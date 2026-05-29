import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { pathToFileURL } from 'node:url';

import { createBotTurnProcessor } from './botProcessor.js';
import { startRoomCleanup } from './cleanup.js';
import { MATCHMAKING_STATUS, MatchmakingStore } from './matchmakingStore.js';
import { moveTokenForRoom, rollDiceForRoom } from './onlineActions.js';
import { RoomStore, ROOM_STATUS } from './roomStore.js';
import { createTurnTimerProcessor } from './turnTimerProcessor.js';
import {
  createRateLimiter,
  isValidRoomCode,
  isValidTokenId,
  normalizeMatchmakingPreferences,
  normalizeRoomCode,
  normalizeSessionId,
  sanitizeDisplayName
} from './security.js';

const PORT = Number(process.env.SOCKET_PORT || 3001);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

export function registerPremiumLudoRuntime({ app, io, healthPath = '/health' } = {}) {
  if (!app || !io) {
    throw new Error('3D Ludo Royale runtime requires an Express router and Socket.IO namespace.');
  }

  const store = new RoomStore();
  const matchmaking = new MatchmakingStore({ roomStore: store });
  const limiter = createRateLimiter();
  const publicCountdownTimers = new Map();
  const startedAt = Date.now();

function log(event, details = {}) {
  const payload = {
    at: new Date().toISOString(),
    event,
    ...details
  };
  console.log(JSON.stringify(payload));
}

const botProcessor = createBotTurnProcessor({ store, io, log });
const turnTimerProcessor = createTurnTimerProcessor({
  store,
  io,
  log,
  afterAction: (room) => botProcessor.schedule(room)
});

app.get(healthPath, (_request, response) => {
  response.json({
    ok: true,
    uptime: Math.round(process.uptime()),
    activeRooms: store.rooms.size,
    activeQueues: matchmaking.queueIdToEntry.size,
    connectedSockets: io.sockets?.size || io.sockets?.sockets?.size || io.engine?.clientsCount || 0,
    countdownTimers: publicCountdownTimers.size,
    botTimers: botProcessor.size(),
    turnTimers: turnTimerProcessor.size(),
    startedAt,
    service: '3d-ludo-royale-socket',
    version: 'phase-7'
  });
});

function reply(ack, payload) {
  if (typeof ack === 'function') {
    ack(payload);
  }
}

function emitRoom(room) {
  io.to(room.roomCode).emit('room:update', store.publicRoom(room));
}

function emitError(socket, message, code = 'action-error') {
  socket.emit('room:error', { message, code });
}

function guard(socket, ack, profile = 'default', sessionId = '') {
  const key = sessionId ? `${socket.id}:${sessionId}` : socket.id;
  if (!limiter.check(key, profile)) {
    const payload = { ok: false, message: 'Please slow down.' };
    reply(ack, payload);
    emitError(socket, payload.message, 'rate-limited');
    log('rate_limited', { socketId: socket.id, profile });
    return false;
  }
  return true;
}

function socketById(socketId) {
  return io.sockets?.get?.(socketId) || io.sockets?.sockets?.get?.(socketId) || null;
}

function emitMatchmakingUpdate(socket, queue, message = 'Searching for a public match.') {
  socket.emit('matchmaking:update', {
    ok: true,
    queue,
    message
  });
}

function emitMatchmakingError(socket, message, code = 'matchmaking-error') {
  socket.emit('matchmaking:error', { message, code });
}

function joinPublicRoomSockets(room) {
  room.players.forEach((player) => {
    if (player.socketId) {
      socketById(player.socketId)?.join(room.roomCode);
    }
  });
}

function notifyPublicMatch(match) {
  if (!match?.ok || !match.room) {
    return;
  }
  joinPublicRoomSockets(match.room);
  const publicRoom = store.publicRoom(match.room);
  io.to(match.room.roomCode).emit('matchmaking:found', {
    ok: true,
    room: publicRoom,
    countdownEndsAt: match.room.countdownEndsAt
  });
  emitRoom(match.room);
  log('queue.matched', {
    roomCode: match.room.roomCode,
    playerCount: match.room.playerCount,
    botFilled: Boolean(match.room.matchConfig?.botFill)
  });
  schedulePublicMatchStart(match.room);
}

function notifyPossibleMatches(playerCount) {
  matchmaking.tryMatchAll(playerCount).forEach((match) => notifyPublicMatch(match));
}

function clearPublicCountdown(roomCode) {
  const timer = publicCountdownTimers.get(roomCode);
  if (timer) {
    clearTimeout(timer);
    publicCountdownTimers.delete(roomCode);
  }
}

function schedulePublicMatchStart(room) {
  clearPublicCountdown(room.roomCode);
  const delay = Math.max(0, (room.countdownEndsAt || Date.now()) - Date.now());
  const timer = setTimeout(() => {
    publicCountdownTimers.delete(room.roomCode);
    const result = store.startPublicMatch(room.roomCode);
    if (!result.ok) {
      const cancelled = matchmaking.cancelMatchedRoom(room.roomCode);
      if (cancelled.room) {
        io.to(room.roomCode).emit('room:closed', {
          message: result.message || 'Public match cancelled.',
          roomCode: room.roomCode
        });
        io.in(room.roomCode).socketsLeave(room.roomCode);
      }
      cancelled.requeued.forEach((entry) => {
        const target = socketById(entry.socketId);
        if (target) {
          emitMatchmakingUpdate(target, matchmaking.publicQueue(entry), 'A player disconnected. Searching again.');
        }
      });
      notifyPossibleMatches(room.playerCount);
      return;
    }
    matchmaking.markRoomStarted(room.roomCode);
    const action = result.room.actionLog[0];
    io.to(result.room.roomCode).emit('game:action', action);
    emitRoom(result.room);
    turnTimerProcessor.schedule(result.room);
    botProcessor.schedule(result.room);
    log('public.match_started', { roomCode: result.room.roomCode, playerCount: result.room.playerCount });
  }, delay);
  timer.unref?.();
  publicCountdownTimers.set(room.roomCode, timer);
}

function cancelPublicCountdown(roomCode, cancellingSessionId = null, message = 'Public match cancelled. Searching again.') {
  clearPublicCountdown(roomCode);
  const cancelled = matchmaking.cancelMatchedRoom(roomCode, cancellingSessionId);
  if (cancelled.room) {
    io.to(roomCode).emit('room:closed', {
      message,
      roomCode
    });
    io.in(roomCode).socketsLeave(roomCode);
  }
  cancelled.cancelled.forEach((entry) => {
    const target = socketById(entry.socketId);
    target?.emit('matchmaking:cancelled', {
      ok: true,
      message: entry.sessionId === cancellingSessionId ? 'Search cancelled.' : message
    });
  });
  cancelled.requeued.forEach((entry) => {
    const target = socketById(entry.socketId);
    if (target) {
      emitMatchmakingUpdate(target, matchmaking.publicQueue(entry), message);
    }
  });
  notifyPossibleMatches(cancelled.requeued[0]?.requestedPlayerCount || cancelled.room?.playerCount || 2);
  return cancelled;
}

io.on('connection', (socket) => {
  socket.emit('connect:status', { ok: true, socketId: socket.id });

  socket.on('room:create', (payload = {}, ack) => {
    const sessionId = normalizeSessionId(payload.sessionId);
    if (!guard(socket, ack, 'roomCreate', sessionId)) {
      return;
    }
    const result = store.createRoom({
      socketId: socket.id,
      sessionId,
      displayName: sanitizeDisplayName(payload.displayName, 'Host'),
      preferredColor: payload.preferredColor,
      playerCount: payload.playerCount
    });
    if (!result.ok) {
      reply(ack, result);
      emitError(socket, result.message);
      return;
    }
    socket.join(result.room.roomCode);
    emitRoom(result.room);
    log('room.created', { roomCode: result.room.roomCode, sessionId, playerCount: result.room.playerCount });
    reply(ack, {
      ok: true,
      roomCode: result.room.roomCode,
      room: store.publicRoom(result.room)
    });
  });

  socket.on('room:join', (payload = {}, ack) => {
    const sessionId = normalizeSessionId(payload.sessionId);
    if (!guard(socket, ack, 'roomJoin', sessionId)) {
      return;
    }
    const roomCode = normalizeRoomCode(payload.roomCode);
    if (!isValidRoomCode(roomCode)) {
      const result = { ok: false, message: 'Invalid room code.' };
      reply(ack, result);
      emitError(socket, result.message);
      return;
    }
    const result = store.joinRoom({
      roomCode,
      socketId: socket.id,
      sessionId,
      displayName: sanitizeDisplayName(payload.displayName),
      preferredColor: payload.preferredColor
    });
    if (!result.ok) {
      reply(ack, result);
      emitError(socket, result.message);
      return;
    }
    socket.join(result.room.roomCode);
    emitRoom(result.room);
    log('room.joined', { roomCode: result.room.roomCode, sessionId, playerId: result.player?.playerId });
    reply(ack, {
      ok: true,
      roomCode: result.room.roomCode,
      room: store.publicRoom(result.room)
    });
  });

  socket.on('room:reconnect', (payload = {}, ack) => {
    const sessionId = normalizeSessionId(payload.sessionId);
    if (!guard(socket, ack, 'reconnect', sessionId)) {
      return;
    }
    const result = store.reconnectToRoom({
      roomCode: normalizeRoomCode(payload.roomCode),
      socketId: socket.id,
      sessionId
    });
    if (!result.ok) {
      reply(ack, result);
      return;
    }
    socket.join(result.room.roomCode);
    emitRoom(result.room);
    turnTimerProcessor.schedule(result.room);
    botProcessor.schedule(result.room);
    log('room.reconnected', { roomCode: result.room.roomCode, sessionId });
    reply(ack, {
      ok: true,
      room: store.publicRoom(result.room)
    });
  });

  socket.on('room:snapshot', (payload = {}, ack) => {
    const room = store.getRoom(normalizeRoomCode(payload.roomCode));
    reply(ack, room && room.status !== ROOM_STATUS.CLOSED
      ? { ok: true, room: store.publicRoom(room) }
      : { ok: false, message: 'Room not found.' });
  });

  socket.on('matchmaking:join', (payload = {}, ack) => {
    const sessionId = normalizeSessionId(payload.sessionId);
    if (!guard(socket, ack, 'queue', sessionId)) {
      return;
    }
    const preferences = normalizeMatchmakingPreferences(payload);
    const result = matchmaking.joinQueue({
      socketId: socket.id,
      sessionId,
      displayName: sanitizeDisplayName(payload.displayName, 'Player'),
      playerCount: preferences.playerCount,
      preferredColor: preferences.preferredColor,
      botFillMode: preferences.botFillMode,
      botDifficulty: preferences.botDifficulty,
      botPersonality: preferences.botPersonality,
      matchSpeed: preferences.matchSpeed
    });
    if (!result.ok) {
      reply(ack, result);
      emitMatchmakingError(socket, result.message);
      return;
    }
    log('queue.joined', { sessionId, playerCount: preferences.playerCount, botFillMode: preferences.botFillMode });
    if (result.match?.ok) {
      notifyPublicMatch(result.match);
      reply(ack, {
        ok: true,
        queue: result.queue,
        room: store.publicRoom(result.match.room),
        status: MATCHMAKING_STATUS.MATCHED
      });
      return;
    }
    emitMatchmakingUpdate(socket, result.queue);
    reply(ack, {
      ok: true,
      queue: result.queue,
      status: MATCHMAKING_STATUS.SEARCHING
    });
  });

  socket.on('matchmaking:cancel', (payload = {}, ack) => {
    const sessionId = normalizeSessionId(payload.sessionId);
    if (!guard(socket, ack, 'queue', sessionId)) {
      return;
    }
    const result = matchmaking.cancelQueue(sessionId);
    if (result.matched && result.roomCode) {
      cancelPublicCountdown(result.roomCode, sessionId, 'A player cancelled before the match started. Searching again.');
    }
    socket.emit('matchmaking:cancelled', {
      ok: true,
      message: 'Search cancelled.'
    });
    reply(ack, { ok: true });
    log('queue.cancelled', { sessionId });
  });

  socket.on('matchmaking:snapshot', (payload = {}, ack) => {
    const sessionId = normalizeSessionId(payload.sessionId);
    const result = matchmaking.snapshot(sessionId);
    reply(ack, result.ok
      ? {
          ok: true,
          queue: result.queue,
          room: result.room ? store.publicRoom(result.room) : null
        }
      : result);
  });

  socket.on('matchmaking:reconnect', (payload = {}, ack) => {
    const sessionId = normalizeSessionId(payload.sessionId);
    if (!guard(socket, ack, 'reconnect', sessionId)) {
      return;
    }
    const result = matchmaking.reconnect({
      sessionId,
      socketId: socket.id,
      roomCode: normalizeRoomCode(payload.roomCode)
    });
    if (!result.ok) {
      reply(ack, result);
      return;
    }
    if (result.room) {
      socket.join(result.room.roomCode);
      emitRoom(result.room);
      turnTimerProcessor.schedule(result.room);
      botProcessor.schedule(result.room);
    }
    if (result.queue && result.status === MATCHMAKING_STATUS.SEARCHING) {
      emitMatchmakingUpdate(socket, result.queue, 'Search restored.');
    }
    reply(ack, {
      ok: true,
      queue: result.queue,
      room: result.room ? store.publicRoom(result.room) : null,
      status: result.status
    });
  });

  socket.on('room:ready', (payload = {}, ack) => {
    const sessionId = normalizeSessionId(payload.sessionId);
    if (!guard(socket, ack, 'lobby', sessionId)) {
      return;
    }
    const result = store.setReady(
      normalizeRoomCode(payload.roomCode),
      sessionId,
      payload.ready
    );
    if (!result.ok) {
      reply(ack, result);
      emitError(socket, result.message);
      return;
    }
    emitRoom(result.room);
    reply(ack, { ok: true, room: store.publicRoom(result.room) });
  });

  socket.on('room:config', (payload = {}, ack) => {
    const sessionId = normalizeSessionId(payload.sessionId);
    if (!guard(socket, ack, 'lobby', sessionId)) {
      return;
    }
    const result = store.updateLobbyConfig(
      normalizeRoomCode(payload.roomCode),
      sessionId,
      payload.config || {}
    );
    if (!result.ok) {
      reply(ack, result);
      emitError(socket, result.message);
      return;
    }
    emitRoom(result.room);
    reply(ack, { ok: true, room: store.publicRoom(result.room) });
  });

  socket.on('room:start', (payload = {}, ack) => {
    const sessionId = normalizeSessionId(payload.sessionId);
    if (!guard(socket, ack, 'lobby', sessionId)) {
      return;
    }
    const result = store.startMatch(
      normalizeRoomCode(payload.roomCode),
      sessionId
    );
    if (!result.ok) {
      reply(ack, result);
      emitError(socket, result.message);
      return;
    }
    const action = result.room.actionLog[0];
    io.to(result.room.roomCode).emit('game:action', action);
    emitRoom(result.room);
    turnTimerProcessor.schedule(result.room);
    botProcessor.schedule(result.room);
    log('room.match_started', { roomCode: result.room.roomCode, playerCount: result.room.playerCount });
    reply(ack, { ok: true, room: store.publicRoom(result.room) });
  });

  socket.on('room:rematch-vote', (payload = {}, ack) => {
    const sessionId = normalizeSessionId(payload.sessionId);
    if (!guard(socket, ack, 'lobby', sessionId)) {
      return;
    }
    const result = store.voteRematch(
      normalizeRoomCode(payload.roomCode),
      sessionId,
      payload.accepted !== false
    );
    if (!result.ok) {
      reply(ack, result);
      emitError(socket, result.message);
      return;
    }
    const action = result.room.actionLog[0];
    if (result.accepted && action?.type === 'rematchStarted') {
      io.to(result.room.roomCode).emit('game:action', action);
      turnTimerProcessor.schedule(result.room);
      botProcessor.schedule(result.room);
      log('room.rematch_started', { roomCode: result.room.roomCode });
    }
    emitRoom(result.room);
    reply(ack, { ok: true, room: store.publicRoom(result.room), accepted: Boolean(result.accepted) });
  });

  socket.on('room:rematch-cancel', (payload = {}, ack) => {
    const sessionId = normalizeSessionId(payload.sessionId);
    if (!guard(socket, ack, 'lobby', sessionId)) {
      return;
    }
    const result = store.cancelRematch(normalizeRoomCode(payload.roomCode), sessionId);
    if (!result.ok) {
      reply(ack, result);
      emitError(socket, result.message);
      return;
    }
    emitRoom(result.room);
    reply(ack, { ok: true, room: store.publicRoom(result.room) });
    log('room.rematch_cancelled', { roomCode: result.room.roomCode, sessionId });
  });

  socket.on('room:leave', (payload = {}, ack) => {
    const sessionId = normalizeSessionId(payload.sessionId);
    if (!guard(socket, ack, 'lobby', sessionId)) {
      return;
    }
    const result = store.leaveRoom(
      normalizeRoomCode(payload.roomCode),
      sessionId
    );
    socket.leave(normalizeRoomCode(payload.roomCode));
    if (result?.room) {
      if (result.closed) {
        io.to(result.room.roomCode).emit('room:closed', {
          message: result.room.eventLog[0]?.message || 'Room closed.',
          roomCode: result.room.roomCode
        });
      }
      emitRoom(result.room);
      turnTimerProcessor.clear(result.room.roomCode);
      botProcessor.clear(result.room.roomCode);
    }
    reply(ack, { ok: true });
    log('room.left', { roomCode: normalizeRoomCode(payload.roomCode), sessionId });
  });

  socket.on('game:roll', (payload = {}, ack) => {
    if (!guard(socket, ack, 'gameplay')) {
      return;
    }
    const room = store.getRoom(normalizeRoomCode(payload.roomCode));
    const result = rollDiceForRoom(room, socket.id, store);
    if (!result.ok) {
      reply(ack, result);
      emitError(socket, result.message);
      return;
    }
    io.to(result.room.roomCode).emit('game:action', result.action);
    emitRoom(result.room);
    turnTimerProcessor.schedule(result.room);
    botProcessor.schedule(result.room);
    reply(ack, { ok: true, action: result.action });
  });

  socket.on('game:move', (payload = {}, ack) => {
    if (!guard(socket, ack, 'gameplay')) {
      return;
    }
    if (!isValidTokenId(payload.tokenId)) {
      const result = { ok: false, message: 'Invalid token.' };
      reply(ack, result);
      emitError(socket, result.message);
      return;
    }
    const room = store.getRoom(normalizeRoomCode(payload.roomCode));
    const result = moveTokenForRoom(room, socket.id, payload.tokenId, store);
    if (!result.ok) {
      reply(ack, result);
      emitError(socket, result.message);
      return;
    }
    io.to(result.room.roomCode).emit('game:action', result.action);
    emitRoom(result.room);
    turnTimerProcessor.schedule(result.room);
    botProcessor.schedule(result.room);
    reply(ack, { ok: true, action: result.action });
  });

  socket.on('disconnect', () => {
    const queueDisconnect = matchmaking.disconnectSocket(socket.id);
    if (queueDisconnect?.status === MATCHMAKING_STATUS.MATCHED) {
      const room = store.getRoom(queueDisconnect.roomCode);
      if (room?.status === ROOM_STATUS.COUNTDOWN) {
        cancelPublicCountdown(queueDisconnect.roomCode, queueDisconnect.entry.sessionId, 'A player disconnected before the match started. Searching again.');
        return;
      }
    }
    const result = store.disconnectSocket(socket.id);
    if (result?.room) {
      if (result.closed) {
        io.to(result.room.roomCode).emit('room:closed', {
          message: result.room.eventLog[0]?.message || 'Room closed.',
          roomCode: result.room.roomCode
        });
      }
      emitRoom(result.room);
      turnTimerProcessor.schedule(result.room);
      botProcessor.schedule(result.room);
    }
    log('socket.disconnected', { socketId: socket.id });
  });
});

const cleanupTimer = startRoomCleanup(store, io, 60_000, matchmaking, {
  clear(roomCode) {
    botProcessor.clear(roomCode);
    turnTimerProcessor.clear(roomCode);
  },
  clearClosedRooms() {
    botProcessor.clearClosedRooms();
    turnTimerProcessor.clearClosedRooms();
  }
}, log, clearPublicCountdown);
const matchmakingPump = setInterval(() => {
  [2, 3, 4].forEach((count) => notifyPossibleMatches(count));
  limiter.prune();
}, 5000);
matchmakingPump.unref?.();

function stop() {
  clearInterval(cleanupTimer);
  clearInterval(matchmakingPump);
  for (const roomCode of publicCountdownTimers.keys()) {
    clearPublicCountdown(roomCode);
  }
  botProcessor.clearClosedRooms();
  turnTimerProcessor.clearClosedRooms();
}

  log('runtime.mounted', { namespace: io.name || '/', healthPath });

  return {
    id: 'ludo-3d-royale',
    healthPath,
    stop,
    getSnapshot() {
      return {
        activeRooms: store.rooms.size,
        activeQueues: matchmaking.queueIdToEntry.size,
        countdownTimers: publicCountdownTimers.size,
        botTimers: botProcessor.size(),
        turnTimers: turnTimerProcessor.size(),
        startedAt
      };
    },
    getAdminSnapshot() {
      const now = Date.now();
      const rooms = [...store.rooms.values()].slice(0, 100).map((room) => {
        const publicRoom = store.publicRoom(room);
        const players = Array.isArray(publicRoom.players) ? publicRoom.players : [];
        return {
          roomId: publicRoom.roomCode || publicRoom.roomId,
          gameSlug: 'ludo-3d-royale',
          gameTitle: 'Ludo 3D Royale',
          type: publicRoom.roomType || (publicRoom.source === 'public-matchmaking' ? 'public' : 'private'),
          mode: publicRoom.matchConfig?.matchSpeed || publicRoom.source || 'online',
          status: publicRoom.status || 'unknown',
          playerCount: Number(publicRoom.playerCount) || players.length,
          maxPlayers: Number(publicRoom.playerCount) || null,
          createdAt: publicRoom.createdAt,
          lastActivityAt: publicRoom.updatedAt || publicRoom.turnStartedAt || publicRoom.createdAt,
          hasBots: players.some((player) => player.controller === 'server-bot' || player.botProfile),
          players
        };
      });
      const queues = [...matchmaking.queues.entries()].map(([playerCount, entries]) => {
        const active = entries.filter((entry) => entry.status === MATCHMAKING_STATUS.SEARCHING && entry.connected !== false);
        const oldest = active.reduce((oldestMs, entry) => Math.min(oldestMs, entry.joinedAt || now), now);
        return {
          gameSlug: 'ludo-3d-royale',
          gameTitle: 'Ludo 3D Royale',
          mode: `${playerCount}-player`,
          waitingCount: active.length,
          oldestWaitingSeconds: active.length ? Math.round((now - oldest) / 1000) : null,
          botFillEnabled: active.some((entry) => entry.botFillAllowed),
          estimatedMatchSize: Number(playerCount) || null
        };
      }).filter((queue) => queue.waitingCount > 0);
      return {
        health: this.getSnapshot(),
        rooms,
        queues
      };
    }
  };
}

function createStandaloneSocketServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production' ? CLIENT_ORIGIN : [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/],
      methods: ['GET', 'POST']
    }
  });
  const runtime = registerPremiumLudoRuntime({
    app,
    io: io.of('/premium-ludo'),
    healthPath: '/health'
  });

  function shutdown() {
    runtime.stop();
    httpServer.close(() => {
      console.log(JSON.stringify({
        at: new Date().toISOString(),
        event: 'server.stopped'
      }));
      process.exit(0);
    });
  }

  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);

  httpServer.listen(PORT, () => {
    console.log(JSON.stringify({
      at: new Date().toISOString(),
      event: 'server.started',
      url: `http://localhost:${PORT}`,
      namespace: '/premium-ludo',
      clientOrigin: CLIENT_ORIGIN
    }));
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createStandaloneSocketServer();
}
