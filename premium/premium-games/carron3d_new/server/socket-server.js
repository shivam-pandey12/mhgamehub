import { Server } from 'socket.io';
import { ONLINE_EVENTS } from '../src/online/online-events.js';
import { CarromRoomManager } from './carrom/carrom-room-manager.js';
import { CarromQueueManager } from './carrom/carrom-queue-manager.js';
import { CarromMatchmaker } from './carrom/carrom-matchmaker.js';
import { ONLINE_TIMER_DEFAULTS, createInterval, createTimeout, startRoomCleanupTimer } from './carrom/carrom-timers.js';
import { sanitizePlayerName } from './carrom/carrom-player.js';
import { normalizeRoomCode } from './carrom/carrom-room-code.js';
import { normalizeMatchConfig, SHOT_REJECTION_CODES } from './carrom/carrom-validators.js';
import { CarromRateLimiter } from './carrom/carrom-rate-limiter.js';

const PUBLIC_START_FALLBACK_MS = 2000;

function emitError(socket, code, message, recoverable = true) {
  socket.emit(ONLINE_EVENTS.error, { code, message, recoverable });
}

function emitMatchmakingError(socket, code, message) {
  socket.emit(ONLINE_EVENTS.matchmakingError, { code, message });
}

function getErrorMessage(error, fallback = 'Online server error.') {
  return error instanceof Error && error.message ? error.message : fallback;
}

function getSocketMap(io) {
  return io?.sockets?.sockets || io?.sockets || new Map();
}

export function createSocketServer(httpServer, { namespace = '/premium-carrom' } = {}) {
  const server = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });
  const io = namespace ? server.of(namespace) : server;
  return {
    server,
    ...registerCarromSocketHandlers(io)
  };
}

export function registerPremiumCarromRuntime({
  app,
  io,
  namespace = '/premium-carrom',
  healthPath = '/api/premium-runtime/carrom/health'
} = {}) {
  if (!io) {
    throw new Error('Premium Carrom runtime requires a Socket.IO namespace.');
  }

  const runtime = registerCarromSocketHandlers(io);
  app?.get?.(healthPath, (_req, res) => {
    res.json({
      ok: true,
      game: 'carrom-3d',
      namespace,
      rooms: runtime.rooms?.rooms?.size || 0,
      queuedPlayers: runtime.queue?.getPlayersWaiting?.() || 0
    });
  });
  return runtime;
}

export function registerCarromSocketHandlers(io) {
  const rooms = new CarromRoomManager();
  const queue = new CarromQueueManager();
  const matchmaker = new CarromMatchmaker({ roomManager: rooms });
  const rateLimiter = new CarromRateLimiter();
  const pendingPublicStarts = new Map();
  startRoomCleanupTimer(rooms);
  createInterval(() => {
    queue.cleanupExpired();
    queue.getQueuedEntries().forEach((entry) => {
      if (!getSocketMap(io).has(entry.socketId) || rooms.isSocketInRoom(entry.socketId)) {
        queue.remove(entry.socketId, 'expired');
      }
    });
    pendingPublicStarts.forEach((_pending, roomCode) => {
      const room = rooms.getRoom(roomCode);
      if (!room || room.status !== 'lobby' || room.roomType !== 'public') {
        clearPendingPublicStart(roomCode);
      }
    });
    rateLimiter.cleanup();
    emitAllQueueStatus();
  }, 30_000);

  const emitRoomState = (room) => {
    io.to(room.roomCode).emit(ONLINE_EVENTS.roomState, rooms.serializeRoom(room));
  };

  const getSessionPayload = (room, player) => ({
    sessionId: player?.sessionId || '',
    playerId: player?.playerId || '',
    roomCode: room?.roomCode || '',
    matchId: room?.matchEngine?.matchStateManager?.state?.matchId || '',
    mode: room?.roomType === 'public' ? 'onlinePublic' : 'onlinePrivate',
    playerName: player?.name || '',
    createdAt: room?.createdAt || Date.now(),
    updatedAt: Date.now()
  });

  const emitTurnTimer = (room) => {
    if (!room?.turnTimer) {
      return;
    }
    room.updateTurnTimer();
    io.to(room.roomCode).emit(ONLINE_EVENTS.turnTimer, {
      roomCode: room.roomCode,
      matchId: room.matchEngine?.matchStateManager?.state?.matchId || '',
      currentPlayerId: room.turnTimer.currentPlayerId,
      remainingMs: room.turnTimer.remainingMs,
      totalMs: room.turnTimer.totalMs,
      generation: room.turnTimer.generation || 0,
      serverStateVersion: room.serverStateVersion || 0,
      serverTime: Date.now()
    });
  };

  const clearTurnTimer = (room) => {
    room?.clearTurnTimer?.();
  };

  const startTurnTimer = (room, { restart = false } = {}) => {
    const matchState = room?.matchEngine?.matchStateManager?.state;
    if (!room || room.status !== 'playing' || matchState?.status !== 'playing' || room.hasDisconnectGrace?.()) {
      return;
    }
    if (
      room.turnTimer?.active
      && room.turnTimer.currentPlayerId === matchState.currentPlayerId
      && !restart
    ) {
      emitTurnTimer(room);
      return;
    }
    room.startTurnTimer(matchState.currentPlayerId, ONLINE_TIMER_DEFAULTS.TURN_TIME_MS);
    const generation = room.turnTimer.generation || 0;
    emitTurnTimer(room);
    room.timers.turnTick = createInterval(() => emitTurnTimer(room), 1000);
    room.timers.turnTimeout = createTimeout(() => {
      if (!room.turnTimer?.active || room.turnTimer.generation !== generation) {
        return;
      }
      room.updateTurnTimer();
      if (room.turnTimer.remainingMs > 0) {
        return;
      }
      const timeout = room.matchEngine?.applyTurnTimeout?.();
      if (!timeout) {
        return;
      }
      room.clearTurnTimer();
      io.to(room.roomCode).emit(ONLINE_EVENTS.turnTimeout, timeout);
      io.to(room.roomCode).emit(ONLINE_EVENTS.matchState, timeout.matchState);
      io.to(room.roomCode).emit(ONLINE_EVENTS.turnChanged, {
        roomCode: room.roomCode,
        matchId: timeout.matchId,
        currentPlayerId: timeout.currentPlayerId,
        turnNumber: timeout.turnNumber,
        shotNumber: timeout.shotNumber,
        serverStateVersion: room.serverStateVersion || 0,
        serverTime: Date.now()
      });
      emitRoomState(room);
      startTurnTimer(room, { restart: true });
    }, ONLINE_TIMER_DEFAULTS.TURN_TIME_MS);
  };

  const startDisconnectGrace = (room, player) => {
    if (!room || !player) {
      return;
    }
    clearTurnTimer(room);
    const durationMs = room.status === 'lobby'
      ? ONLINE_TIMER_DEFAULTS.LOBBY_DISCONNECT_GRACE_MS
      : ONLINE_TIMER_DEFAULTS.DISCONNECT_GRACE_MS;
    const grace = room.startDisconnectGrace(player, { durationMs });
    const payload = {
      roomCode: room.roomCode,
      playerId: player.playerId,
      playerName: player.name,
      graceEndsAt: grace.graceEndsAt,
      remainingMs: grace.remainingMs,
      serverStateVersion: room.serverStateVersion || 0,
      message: `${player.name} disconnected. Waiting for reconnect...`
    };
    io.to(room.roomCode).emit(ONLINE_EVENTS.playerDisconnected, payload);
    io.to(room.roomCode).emit(ONLINE_EVENTS.disconnectGraceStarted, payload);
    emitRoomState(room);
    room.timers.disconnectTick = createInterval(() => {
      const next = room.updateDisconnectGrace();
      if (!next) {
        return;
      }
      io.to(room.roomCode).emit(ONLINE_EVENTS.disconnectGraceTick, {
        ...payload,
        graceEndsAt: next.graceEndsAt,
        remainingMs: next.remainingMs,
        serverStateVersion: room.serverStateVersion || 0,
        serverTime: Date.now()
      });
    }, 1000);
    room.timers.disconnectGrace = createTimeout(() => {
      const latest = room.updateDisconnectGrace();
      const expiredPayload = {
        ...payload,
        remainingMs: 0,
        graceEndsAt: latest?.graceEndsAt || payload.graceEndsAt,
        serverStateVersion: room.serverStateVersion || 0,
        serverTime: Date.now(),
        message: 'Opponent did not reconnect.'
      };
      io.to(room.roomCode).emit(ONLINE_EVENTS.disconnectGraceExpired, expiredPayload);
      if (room.status === 'lobby' && player.seat === 'guest' && room.roomType === 'private') {
        room.players = room.players.filter((item) => item.playerId !== player.playerId);
        room.clearDisconnectGrace();
        room.message = 'Guest disconnected. Waiting for opponent.';
        room.bumpState?.('guest-disconnect-expired');
        emitRoomState(room);
        return;
      }
      room.close('Opponent did not reconnect.');
      io.to(room.roomCode).emit(ONLINE_EVENTS.roomClosed, {
        roomCode: room.roomCode,
        reason: expiredPayload.message,
        serverStateVersion: room.serverStateVersion || 0,
        serverTime: Date.now()
      });
      emitRoomState(room);
      room.timers.cleanup = createTimeout(
        () => rooms.cleanupRoom(room.roomCode),
        ONLINE_TIMER_DEFAULTS.ROOM_EMPTY_CLEANUP_MS
      );
    }, durationMs);
  };

  const sendStartedMatch = (room, matchState, eventName = ONLINE_EVENTS.matchStarted) => {
    io.to(room.roomCode).emit(eventName, {
      roomState: rooms.serializeRoom(room),
      matchState,
      matchConfig: room.matchConfig,
      roomCode: room.roomCode,
      matchId: matchState?.matchId || '',
      serverStateVersion: room.serverStateVersion || 0,
      serverTime: Date.now()
    });
    io.to(room.roomCode).emit(ONLINE_EVENTS.matchState, matchState);
    emitRoomState(room);
    startTurnTimer(room, { restart: true });
  };

  const emitQueueStatus = (socketId, message = '') => {
    const socket = getSocketMap(io).get(socketId);
    const status = queue.getStatus(socketId);
    if (!socket || !status) {
      return;
    }
    socket.emit(ONLINE_EVENTS.queueStatus, {
      ...status,
      message: message || status.message
    });
  };

  const emitAllQueueStatus = () => {
    queue.getQueuedEntries().forEach((entry) => emitQueueStatus(entry.socketId));
  };

  const cancelQueuedSocket = (socket, reason = 'Queue cancelled.') => {
    const entry = queue.remove(socket.id, 'cancelled');
    if (!entry) {
      return false;
    }
    socket.emit(ONLINE_EVENTS.queueCancelled, { reason });
    emitAllQueueStatus();
    return true;
  };

  const clearPendingPublicStart = (roomCode) => {
    const pending = pendingPublicStarts.get(roomCode);
    if (!pending) {
      return null;
    }
    clearTimeout(pending.timer);
    pendingPublicStarts.delete(roomCode);
    return pending;
  };

  const startPublicMatch = (roomCode) => {
    clearPendingPublicStart(roomCode);
    const room = rooms.getRoom(roomCode);
    if (!room || room.status !== 'lobby' || !room.getHost()?.isConnected || !room.getGuest()?.isConnected) {
      return;
    }
    try {
      const matchState = room.startMatch();
      sendStartedMatch(room, matchState);
    } catch (error) {
      io.to(room.roomCode).emit(ONLINE_EVENTS.matchmakingError, {
        code: 'public-start-failed',
        message: error.message || 'Could not start public match.'
      });
    }
  };

  const createPublicMatch = ({ first, second, matchConfig }) => {
    const sockets = getSocketMap(io);
    const firstSocket = sockets.get(first.socketId);
    const secondSocket = sockets.get(second.socketId);
    if (!firstSocket || !secondSocket) {
      return null;
    }

    queue.remove(first.socketId, 'matched');
    queue.remove(second.socketId, 'matched');
    const room = matchmaker.createPublicRoom(first, second, matchConfig);
    firstSocket.join(room.roomCode);
    secondSocket.join(room.roomCode);
    const startsAt = Date.now() + PUBLIC_START_FALLBACK_MS;
    const host = room.getHost();
    const guest = room.getGuest();
    const roomState = rooms.serializeRoom(room);
    pendingPublicStarts.set(room.roomCode, {
      readySocketIds: new Set(),
      timer: setTimeout(() => startPublicMatch(room.roomCode), PUBLIC_START_FALLBACK_MS).unref?.()
    });

    firstSocket.emit(ONLINE_EVENTS.matchFound, {
      roomCode: room.roomCode,
      matchId: '',
      roomType: 'public',
      playerId: host.playerId,
      seat: host.seat,
      session: getSessionPayload(room, host),
      opponentName: guest.name,
      matchConfig: room.matchConfig,
      roomState,
      serverStateVersion: room.serverStateVersion || 0,
      startsAt
    });
    secondSocket.emit(ONLINE_EVENTS.matchFound, {
      roomCode: room.roomCode,
      matchId: '',
      roomType: 'public',
      playerId: guest.playerId,
      seat: guest.seat,
      session: getSessionPayload(room, guest),
      opponentName: host.name,
      matchConfig: room.matchConfig,
      roomState,
      serverStateVersion: room.serverStateVersion || 0,
      startsAt
    });
    emitRoomState(room);
    return room;
  };

  const tryMatchPublicQueue = () => {
    let pair = queue.findCompatiblePair({
      isSocketAvailable: (socketId) => getSocketMap(io).has(socketId) && !rooms.isSocketInRoom(socketId)
    });
    while (pair) {
      try {
        createPublicMatch(pair);
      } catch (error) {
        const sockets = getSocketMap(io);
        const firstSocket = sockets.get(pair.first.socketId);
        const secondSocket = sockets.get(pair.second.socketId);
        firstSocket && emitMatchmakingError(firstSocket, 'match-create-failed', error.message || 'Could not create public match.');
        secondSocket && emitMatchmakingError(secondSocket, 'match-create-failed', error.message || 'Could not create public match.');
        queue.remove(pair.first.socketId, 'cancelled');
        queue.remove(pair.second.socketId, 'cancelled');
      }
      pair = queue.findCompatiblePair({
        isSocketAvailable: (socketId) => getSocketMap(io).has(socketId) && !rooms.isSocketInRoom(socketId)
      });
    }
    emitAllQueueStatus();
  };

  io.on('connection', (socket) => {
    const emitRateLimited = (action, payload = {}) => {
      const message = action.message || 'Please wait before trying again.';
      if (action.key === 'submitShot') {
        socket.emit(ONLINE_EVENTS.shotRejected, {
          roomCode: normalizeRoomCode(payload.roomCode),
          matchId: String(payload.matchId || ''),
          clientShotId: String(payload.clientShotId || ''),
          code: SHOT_REJECTION_CODES.RATE_LIMITED,
          message,
          retryAfterMs: action.retryAfterMs,
          serverTime: Date.now()
        });
        return;
      }
      if (action.key === 'joinPublicQueue' || action.key === 'cancelPublicQueue' || action.key === 'queuePing' || action.key === 'queueReady') {
        emitMatchmakingError(socket, 'RATE_LIMITED', message);
        return;
      }
      emitError(socket, 'RATE_LIMITED', message);
    };

    const onSafe = (eventName, rateKey, handler) => {
      socket.on(eventName, async (payload = {}) => {
        try {
          const safePayload = payload && typeof payload === 'object' && !Array.isArray(payload) ? payload : {};
          if (rateKey) {
            const rate = rateLimiter.check(socket.id, rateKey);
            if (!rate.allowed) {
              emitRateLimited({ ...rate, key: rateKey }, safePayload);
              return;
            }
          }
          await handler(safePayload);
        } catch (error) {
          emitError(socket, 'SERVER_HANDLER_ERROR', getErrorMessage(error));
        }
      });
    };

    onSafe(ONLINE_EVENTS.reconnectRoom, 'reconnectRoom', (payload = {}) => {
      const result = rooms.reconnectSession({
        sessionId: String(payload.sessionId || ''),
        playerId: String(payload.playerId || ''),
        roomCode: payload.roomCode,
        matchId: payload.matchId || '',
        socketId: socket.id
      });
      if (!result.ok) {
        socket.emit(
          result.code === 'session-stale' ? ONLINE_EVENTS.sessionExpired : ONLINE_EVENTS.reconnectRejected,
          { code: result.code, message: result.message }
        );
        return;
      }
      const { room, player } = result;
      socket.join(room.roomCode);
      socket.emit(ONLINE_EVENTS.reconnectAccepted, {
        roomCode: room.roomCode,
        playerId: player.playerId,
        matchId: room.matchEngine?.matchStateManager?.state?.matchId || '',
        session: getSessionPayload(room, player),
        roomState: rooms.serializeRoom(room),
        matchState: room.matchEngine?.getSnapshot?.() || null,
        serverStateVersion: room.serverStateVersion || 0,
        serverTime: Date.now()
      });
      socket.to(room.roomCode).emit(ONLINE_EVENTS.playerReconnected, {
        roomCode: room.roomCode,
        playerId: player.playerId,
        playerName: player.name,
        message: `${player.name} reconnected.`,
        serverStateVersion: room.serverStateVersion || 0,
        serverTime: Date.now()
      });
      emitRoomState(room);
      if (room.roomType === 'public' && room.status === 'lobby' && room.getHost()?.isConnected && room.getGuest()?.isConnected) {
        startPublicMatch(room.roomCode);
        return;
      }
      if (room.status === 'playing') {
        startTurnTimer(room);
      }
    });

    onSafe(ONLINE_EVENTS.createRoom, 'createRoom', (payload = {}) => {
      try {
        cancelQueuedSocket(socket, 'Left public queue for private room.');
        const room = rooms.createRoom({
          socketId: socket.id,
          playerName: sanitizePlayerName(payload.playerName, 'Host'),
          matchConfig: normalizeMatchConfig(payload.matchConfig)
        });
        socket.join(room.roomCode);
        const host = room.getHost();
        socket.emit(ONLINE_EVENTS.roomCreated, {
          roomCode: room.roomCode,
          playerId: host.playerId,
          seat: host.seat,
          session: getSessionPayload(room, host),
          roomState: rooms.serializeRoom(room)
        });
        emitRoomState(room);
      } catch (error) {
        emitError(socket, 'create-room-failed', error.message || 'Could not create room.');
      }
    });

    onSafe(ONLINE_EVENTS.joinRoom, 'joinRoom', (payload = {}) => {
      try {
        cancelQueuedSocket(socket, 'Left public queue for private room.');
        const roomCode = normalizeRoomCode(payload.roomCode);
        const room = rooms.joinRoom({
          socketId: socket.id,
          roomCode,
          playerName: sanitizePlayerName(payload.playerName, 'Guest')
        });
        socket.join(room.roomCode);
        const player = room.getPlayerBySocket(socket.id);
        socket.emit(ONLINE_EVENTS.roomJoined, {
          roomCode: room.roomCode,
          playerId: player.playerId,
          seat: player.seat,
          session: getSessionPayload(room, player),
          roomState: rooms.serializeRoom(room)
        });
      socket.to(room.roomCode).emit(ONLINE_EVENTS.playerJoined, {
        roomCode: room.roomCode,
        player: player.serialize(),
        serverStateVersion: room.serverStateVersion || 0,
        serverTime: Date.now()
      });
        emitRoomState(room);
      } catch (error) {
        emitError(socket, 'join-room-failed', error.message || 'Could not join room.');
      }
    });

    onSafe(ONLINE_EVENTS.leaveRoom, null, (payload = {}) => {
      const room = rooms.getRoom(payload.roomCode) || rooms.getRoomBySocket(socket.id);
      if (!room) {
        emitError(socket, 'room-not-found', 'Room not found.');
        return;
      }
      const player = room.getPlayerBySocket(socket.id);
      let forfeitPayload = null;
      if (
        player
        && room.status === 'playing'
        && room.matchEngine?.matchStateManager?.state?.status === 'playing'
      ) {
        clearTurnTimer(room);
        const forfeit = room.matchEngine.forfeitPlayer(player.playerId);
        if (forfeit?.matchState) {
          const winner = forfeit.matchState.players?.find((item) => item.id === forfeit.matchState.winnerPlayerId);
          forfeitPayload = {
            roomCode: room.roomCode,
            matchId: forfeit.matchState.matchId,
            winnerPlayerId: forfeit.matchState.winnerPlayerId,
            forfeitedPlayerId: player.playerId,
            draw: false,
            reason: `${player.name} left. ${winner?.name || 'Opponent'} wins by forfeit.`,
            matchState: forfeit.matchState,
            serverStateVersion: room.serverStateVersion || 0,
            serverTime: Date.now()
          };
        }
      }
      room.markSocketLeft(socket.id, 'left');
      if (room.roomType === 'public' && !room.matchEngine) {
        clearPendingPublicStart(room.roomCode);
      }
      socket.leave(room.roomCode);
      if (forfeitPayload) {
        const latestMatchState = room.matchEngine?.getSnapshot?.() || forfeitPayload.matchState;
        forfeitPayload.matchState = latestMatchState;
        forfeitPayload.serverStateVersion = room.serverStateVersion || forfeitPayload.serverStateVersion;
        io.to(room.roomCode).emit(ONLINE_EVENTS.matchState, latestMatchState);
        io.to(room.roomCode).emit(ONLINE_EVENTS.matchFinished, forfeitPayload);
      }
      io.to(room.roomCode).emit(ONLINE_EVENTS.playerLeft, {
        roomCode: room.roomCode,
        playerId: player?.playerId || '',
        reason: forfeitPayload?.reason || (player?.seat === 'host' ? 'Host left.' : 'Opponent left.'),
        serverStateVersion: room.serverStateVersion || 0,
        serverTime: Date.now()
      });
      if (room.roomType === 'public' && !room.matchEngine) {
        io.to(room.roomCode).emit(ONLINE_EVENTS.matchmakingError, {
          code: 'public-opponent-left',
          message: 'Opponent disconnected. Search again.'
        });
      }
      emitRoomState(room);
      socket.emit(ONLINE_EVENTS.roomState, rooms.serializeRoom(room));
    });

    onSafe(ONLINE_EVENTS.joinPublicQueue, 'joinPublicQueue', (payload = {}) => {
      if (rooms.isSocketInRoom(socket.id)) {
        emitMatchmakingError(socket, 'already-in-room', 'Leave the current room before joining public matchmaking.');
        return;
      }
      if (queue.has(socket.id)) {
        emitMatchmakingError(socket, 'already-queued', 'You are already searching for a match.');
        return;
      }
      try {
        const entry = queue.add({
          socketId: socket.id,
          playerName: sanitizePlayerName(payload.playerName, 'Player'),
          preferences: payload.preferences
        });
        socket.emit(ONLINE_EVENTS.queueJoined, {
          queueId: entry.queueId,
          joinedAt: entry.joinedAt,
          preferences: entry.preferences,
          estimatedStatus: 'Searching for opponent...'
        });
        emitQueueStatus(socket.id);
        tryMatchPublicQueue();
      } catch (error) {
        emitMatchmakingError(socket, 'queue-join-failed', error.message || 'Could not join public queue.');
      }
    });

    onSafe(ONLINE_EVENTS.cancelPublicQueue, 'cancelPublicQueue', () => {
      if (!cancelQueuedSocket(socket, 'Queue cancelled.')) {
        socket.emit(ONLINE_EVENTS.queueCancelled, { reason: 'Not currently queued.' });
      }
    });

    onSafe(ONLINE_EVENTS.queuePing, 'queuePing', () => {
      emitQueueStatus(socket.id);
    });

    onSafe(ONLINE_EVENTS.queueReady, 'queueReady', (payload = {}) => {
      const room = rooms.getRoom(payload.roomCode) || rooms.getRoomBySocket(socket.id);
      if (!room || room.roomType !== 'public') {
        emitMatchmakingError(socket, 'public-room-not-found', 'Public match room not found.');
        return;
      }
      const pending = pendingPublicStarts.get(room.roomCode);
      if (!pending) {
        return;
      }
      pending.readySocketIds.add(socket.id);
      if (pending.readySocketIds.size >= 2) {
        startPublicMatch(room.roomCode);
      }
    });

    onSafe(ONLINE_EVENTS.startMatch, 'startMatch', (payload = {}) => {
      const room = rooms.getRoom(payload.roomCode);
      if (!room) {
        emitError(socket, 'room-not-found', 'Room not found.');
        return;
      }
      const player = room.getPlayerBySocket(socket.id);
      if (!player || player.seat !== 'host') {
        emitError(socket, 'host-only', 'Only the host can start the match.');
        return;
      }
      try {
        const matchState = room.startMatch();
        sendStartedMatch(room, matchState);
      } catch (error) {
        emitError(socket, 'start-match-failed', error.message || 'Could not start match.');
      }
    });

    onSafe(ONLINE_EVENTS.submitShot, 'submitShot', (payload = {}) => {
      const room = rooms.getRoom(payload.roomCode);
      if (!room) {
        socket.emit(ONLINE_EVENTS.shotRejected, {
          roomCode: normalizeRoomCode(payload.roomCode),
          matchId: String(payload.matchId || ''),
          clientShotId: String(payload.clientShotId || ''),
          code: SHOT_REJECTION_CODES.ROOM_NOT_FOUND,
          message: 'Room not found.',
          serverTime: Date.now()
        });
        return;
      }
      const player = room.getPlayerBySocket(socket.id);
      const outcome = room.matchEngine?.submitShot({ player, payload });
      if (!outcome) {
        socket.emit(ONLINE_EVENTS.shotRejected, {
          roomCode: room.roomCode,
          matchId: String(payload.matchId || ''),
          clientShotId: String(payload.clientShotId || ''),
          code: SHOT_REJECTION_CODES.MATCH_NOT_PLAYING,
          message: 'Match is not ready.',
          serverStateVersion: room.serverStateVersion || 0,
          serverTime: Date.now()
        });
        return;
      }
      if (!outcome.accepted) {
        socket.emit(ONLINE_EVENTS.shotRejected, {
          ...outcome.rejection,
          serverStateVersion: room.serverStateVersion || 0,
          serverTime: Date.now()
        });
        return;
      }

      clearTurnTimer(room);
      socket.emit(ONLINE_EVENTS.shotAccepted, {
        roomCode: room.roomCode,
        matchId: outcome.shot.matchId,
        shotId: outcome.shot.shotId,
        clientShotId: outcome.shot.clientShotId,
        serverStateVersion: outcome.shot.serverStateVersion || room.serverStateVersion || 0,
        serverTime: outcome.shot.serverTime
      });
      io.to(room.roomCode).emit(ONLINE_EVENTS.shotStarted, outcome.shot);
      io.to(room.roomCode).emit(ONLINE_EVENTS.shotSettled, outcome.settled);
      io.to(room.roomCode).emit(ONLINE_EVENTS.matchState, outcome.settled.matchState);
      io.to(room.roomCode).emit(ONLINE_EVENTS.turnChanged, {
        roomCode: room.roomCode,
        matchId: outcome.shot.matchId,
        currentPlayerId: outcome.settled.matchState.currentPlayerId,
        turnNumber: outcome.settled.matchState.turnNumber,
        shotNumber: outcome.settled.matchState.shotNumber,
        serverStateVersion: room.serverStateVersion || 0,
        serverTime: Date.now()
      });
      if (outcome.settled.matchState.status === 'finished') {
        io.to(room.roomCode).emit(ONLINE_EVENTS.matchFinished, {
          roomCode: room.roomCode,
          matchId: outcome.shot.matchId,
          winnerPlayerId: outcome.settled.matchState.winnerPlayerId,
          draw: outcome.settled.matchState.draw,
          matchState: outcome.settled.matchState,
          serverStateVersion: room.serverStateVersion || 0,
          serverTime: Date.now()
        });
      } else {
        startTurnTimer(room, { restart: true });
      }
      emitRoomState(room);
    });

    onSafe(ONLINE_EVENTS.requestRematch, 'requestRematch', (payload = {}) => {
      const room = rooms.getRoom(payload.roomCode) || rooms.getRoomBySocket(socket.id);
      const player = room?.getPlayerBySocket(socket.id);
      if (!room || !player) {
        emitError(socket, 'room-not-found', 'Room not found.');
        return;
      }
      const currentMatchId = room.matchEngine?.matchStateManager?.state?.matchId || '';
      if (room.status !== 'finished' || payload.matchId !== currentMatchId) {
        emitError(socket, 'rematch-not-ready', 'Rematch is available after the match finishes.');
        return;
      }
      const rematch = room.requestRematch(player.playerId);
      if (rematch.status === 'accepted') {
        try {
          const matchState = room.resetForRematch();
          sendStartedMatch(room, matchState, ONLINE_EVENTS.rematchStarted);
        } catch (error) {
          emitError(socket, 'rematch-failed', error.message || 'Could not start rematch.');
        }
        return;
      }
      io.to(room.roomCode).emit(ONLINE_EVENTS.rematchRequested, {
        roomCode: room.roomCode,
        matchId: currentMatchId,
        playerId: player.playerId,
        playerName: player.name,
        rematch,
        serverStateVersion: room.serverStateVersion || 0,
        serverTime: Date.now()
      });
      emitRoomState(room);
    });

    onSafe(ONLINE_EVENTS.respondRematch, 'respondRematch', (payload = {}) => {
      const room = rooms.getRoom(payload.roomCode) || rooms.getRoomBySocket(socket.id);
      const player = room?.getPlayerBySocket(socket.id);
      if (!room || !player) {
        emitError(socket, 'room-not-found', 'Room not found.');
        return;
      }
      const currentMatchId = room.matchEngine?.matchStateManager?.state?.matchId || '';
      if (room.status !== 'finished' || payload.matchId !== currentMatchId) {
        emitError(socket, 'rematch-not-ready', 'Rematch is available after the match finishes.');
        return;
      }
      if (!payload.accepted) {
        const rematch = room.declineRematch(player.playerId);
        io.to(room.roomCode).emit(ONLINE_EVENTS.rematchDeclined, {
          roomCode: room.roomCode,
          matchId: currentMatchId,
          playerId: player.playerId,
          playerName: player.name,
          rematch,
          serverStateVersion: room.serverStateVersion || 0,
          serverTime: Date.now()
        });
        emitRoomState(room);
        return;
      }
      const rematch = room.requestRematch(player.playerId);
      if (rematch.status !== 'accepted') {
        io.to(room.roomCode).emit(ONLINE_EVENTS.rematchRequested, {
          roomCode: room.roomCode,
          matchId: currentMatchId,
          playerId: player.playerId,
          playerName: player.name,
          rematch,
          serverStateVersion: room.serverStateVersion || 0,
          serverTime: Date.now()
        });
        emitRoomState(room);
        return;
      }
      try {
        const matchState = room.resetForRematch();
        sendStartedMatch(room, matchState, ONLINE_EVENTS.rematchStarted);
      } catch (error) {
        emitError(socket, 'rematch-failed', error.message || 'Could not start rematch.');
      }
    });

    onSafe(ONLINE_EVENTS.requestRoomState, 'requestRoomState', (payload = {}) => {
      const room = rooms.getRoom(payload.roomCode) || rooms.getRoomBySocket(socket.id);
      if (!room) {
        emitError(socket, 'room-not-found', 'Room not found.');
        return;
      }
      socket.emit(ONLINE_EVENTS.roomState, rooms.serializeRoom(room));
      if (room.matchEngine) {
        socket.emit(ONLINE_EVENTS.matchState, room.matchEngine.getSnapshot());
      }
    });

    socket.on('disconnect', () => {
      rateLimiter.resetSocket(socket.id);
      queue.remove(socket.id, 'disconnect');
      emitAllQueueStatus();
      const result = rooms.disconnectSocket(socket.id);
      if (!result?.room) {
        return;
      }
      if (result.room.roomType === 'public' && !result.room.matchEngine) {
        clearPendingPublicStart(result.room.roomCode);
        io.to(result.room.roomCode).emit(ONLINE_EVENTS.matchmakingError, {
          code: 'public-opponent-disconnected',
          message: 'Opponent disconnected. Search again.'
        });
      }
      startDisconnectGrace(result.room, result.player);
    });
  });

  return {
    io,
    rooms,
    queue,
    getAdminSnapshot() {
      const now = Date.now();
      const roomItems = [...rooms.rooms.values()].slice(0, 100).map((room) => {
        const snapshot = rooms.serializeRoom(room);
        const players = Array.isArray(snapshot.players) ? snapshot.players : [];
        return {
          roomId: snapshot.roomCode,
          gameSlug: 'carrom-3d',
          gameTitle: 'Carrom 3D',
          type: snapshot.roomType || 'private',
          mode: snapshot.matchConfig?.matchType || snapshot.matchMode || 'online',
          status: snapshot.status || 'unknown',
          playerCount: players.filter((player) => player.isConnected !== false).length,
          maxPlayers: 2,
          createdAt: snapshot.createdAt,
          lastActivityAt: snapshot.updatedAt || snapshot.createdAt,
          hasBots: false,
          players
        };
      });
      const waiting = queue.getQueuedEntries();
      const oldest = waiting.reduce((oldestMs, entry) => Math.min(oldestMs, entry.joinedAt || now), now);
      return {
        health: {
          activeRooms: rooms.rooms.size,
          activeQueues: waiting.length
        },
        rooms: roomItems,
        queues: waiting.length ? [{
          gameSlug: 'carrom-3d',
          gameTitle: 'Carrom 3D',
          mode: 'public',
          waitingCount: waiting.length,
          oldestWaitingSeconds: Math.round((now - oldest) / 1000),
          botFillEnabled: false,
          estimatedMatchSize: 2,
          entries: waiting.slice(0, 20).map((entry) => ({
            queueEntryId: entry.socketId,
            name: entry.playerName || 'Queued player',
            joinedAt: entry.joinedAt
          }))
        }] : []
      };
    },
    closeAdminRoom({ roomId, reason, notifyPlayers = true } = {}) {
      const room = rooms.getRoom(roomId);
      if (!room) {
        return { ok: false, status: 404, code: 'ROOM_NOT_FOUND', error: 'Room was not found.' };
      }
      const message = notifyPlayers
        ? 'This room was closed by admin due to a technical or moderation issue.'
        : 'Room closed by admin.';
      room.close(message);
      io.to(room.roomCode).emit(ONLINE_EVENTS.roomClosed, {
        roomCode: room.roomCode,
        message
      });
      io.in(room.roomCode).socketsLeave(room.roomCode);
      room.clearTimers?.();
      rooms.rooms.delete(room.roomCode);
      return { ok: true, message, reason };
    },
    kickAdminPlayer({ roomId, playerId, reason, notifyPlayer = true } = {}) {
      const room = rooms.getRoom(roomId);
      if (!room) {
        return { ok: false, status: 404, code: 'ROOM_NOT_FOUND', error: 'Room was not found.' };
      }
      const player = room.getPlayerByPlayerId?.(playerId) || room.getPlayerBySocket?.(playerId);
      if (!player?.socketId) {
        return { ok: false, status: 404, code: 'PLAYER_NOT_FOUND', error: 'Player was not found in this room.' };
      }
      const message = notifyPlayer ? 'You were removed from this room by admin.' : 'Player removed by admin.';
      const targetSocket = io.sockets?.get?.(player.socketId) || io.sockets?.sockets?.get?.(player.socketId);
      if (notifyPlayer) {
        targetSocket?.emit(ONLINE_EVENTS.roomClosed, {
          roomCode: room.roomCode,
          message
        });
      }
      targetSocket?.leave?.(room.roomCode);
      const result = rooms.leaveSocket(player.socketId, 'admin');
      if (result?.room && result.room.status !== 'closed') {
        io.to(result.room.roomCode).emit(ONLINE_EVENTS.roomState, rooms.serializeRoom(result.room));
      } else if (result?.room) {
        io.to(result.room.roomCode).emit(ONLINE_EVENTS.roomClosed, {
          roomCode: result.room.roomCode,
          message
        });
      }
      return { ok: true, message, reason };
    },
    removeAdminQueueEntry({ queueEntryId, reason } = {}) {
      const entry = queue.remove(queueEntryId, 'admin');
      if (!entry) {
        return { ok: false, status: 404, code: 'QUEUE_ENTRY_NOT_FOUND', error: 'Queue entry was not found.' };
      }
      const targetSocket = io.sockets?.get?.(entry.socketId) || io.sockets?.sockets?.get?.(entry.socketId);
      targetSocket?.emit(ONLINE_EVENTS.queueCancelled, {
        reason: 'Your public search was cancelled by admin.'
      });
      emitAllQueueStatus();
      return { ok: true, message: 'Queue entry removed by admin.', reason };
    }
  };
}
