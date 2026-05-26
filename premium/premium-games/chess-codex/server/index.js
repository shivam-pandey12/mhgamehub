import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { Server } from 'socket.io';
import { Chess } from 'chess.js';
import {
  chooseBotMove,
  createBotPlayer,
  getBotMoveDelayMs,
  shouldBotAcceptDraw
} from './botPlayer.js';
import { MatchmakingManager } from './matchmakingManager.js';
import {
  PUBLIC_MATCH_TYPES,
  createPublicBotMatchRoom,
  createPublicPvPMatchRoom,
  isPublicBotRoom,
  isPublicRoom
} from './publicRoomManager.js';

const PORT = Number(process.env.PORT || 3001);
const DEFAULT_HEALTH_PATH = '/health';

export function registerPremiumChessRuntime({ app, io, healthPath = DEFAULT_HEALTH_PATH } = {}) {
if (!app || !io) {
  throw new Error('registerPremiumChessRuntime requires an Express app and a Socket.IO namespace/server.');
}

const ROOM_PERSIST_MS = 120000;
const PUBLIC_BOT_FILL_MS = 30000;
const ROOM_CLOCK_SECONDS = 10 * 60;
const PUBLIC_MATCH_CLOCK_SECONDS = 5 * 60;
const CLOCK_TIMEOUT_GRACE_MS = 35;

const rooms = new Map();
const socketToRoom = new Map();
const COLOR_LABELS = {
  w: 'White',
  b: 'Black'
};

function createClockState(initialSeconds = ROOM_CLOCK_SECONDS) {
  const seconds = Number.isFinite(Number(initialSeconds))
    ? Math.max(1, Number(initialSeconds))
    : ROOM_CLOCK_SECONDS;
  return {
    initialSeconds: seconds,
    remaining: {
      w: seconds,
      b: seconds
    },
    activeColor: 'w',
    flaggedColor: null,
    lastUpdatedAt: 0,
    timeoutTimer: 0
  };
}

function serializeClock(clock) {
  if (!clock) {
    return null;
  }

  return {
    initialSeconds: clock.initialSeconds,
    remaining: {
      w: clock.remaining.w,
      b: clock.remaining.b
    },
    activeColor: clock.activeColor,
    flaggedColor: clock.flaggedColor,
    serverNow: Date.now()
  };
}

function tryChessMove(chess, move) {
  try {
    return chess.move(move);
  } catch {
    return null;
  }
}

app.get(healthPath, (_request, response) => {
  response.json({ ok: true });
});

function createRoomId() {
  let roomId = '';
  do {
    roomId = randomBytes(3).toString('hex').toUpperCase();
  } while (rooms.has(roomId));
  return roomId;
}

function normalizePlayerName(playerName) {
  return String(playerName || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 24);
}

function createPlayerSeat(socketId, playerName = '') {
  return {
    token: randomBytes(12).toString('hex'),
    socketId,
    connected: true,
    lastSeenAt: Date.now(),
    name: normalizePlayerName(playerName)
  };
}

function summarizeGame(chess, options = {}) {
  if (options.agreedDraw) {
    return {
      result: 'draw',
      winner: null,
      inCheck: false,
      turn: chess.turn(),
      reason: 'agreement'
    };
  }

  if (options.clock?.flaggedColor) {
    return {
      result: 'timeout',
      winner: options.clock.flaggedColor === 'w' ? 'b' : 'w',
      loser: options.clock.flaggedColor,
      inCheck: chess.inCheck(),
      turn: chess.turn(),
      reason: 'timeout'
    };
  }

  if (chess.isCheckmate()) {
    return {
      result: 'checkmate',
      winner: chess.turn() === 'w' ? 'b' : 'w',
      inCheck: true,
      turn: chess.turn()
    };
  }

  if (chess.isDraw()) {
    return {
      result: 'draw',
      winner: null,
      inCheck: chess.inCheck(),
      turn: chess.turn()
    };
  }

  return {
    result: 'active',
    winner: null,
    inCheck: chess.inCheck(),
    turn: chess.turn()
  };
}

function normalizeColorPreference(preferredColor) {
  const normalized = String(preferredColor || 'auto').trim().toLowerCase();
  if (normalized === 'w' || normalized === 'white') {
    return 'w';
  }
  if (normalized === 'b' || normalized === 'black') {
    return 'b';
  }
  return 'auto';
}

function oppositeColor(color) {
  return color === 'w' ? 'b' : 'w';
}

function clearRoomClockTimer(room) {
  if (room?.clock?.timeoutTimer) {
    clearTimeout(room.clock.timeoutTimer);
    room.clock.timeoutTimer = 0;
  }
}

function isClockPaused(room) {
  return !room
    || room.status !== 'playing'
    || room.agreedDraw
    || room.pendingDraw
    || room.pendingUndo
    || room.pendingRematch
    || room.chess.isGameOver();
}

function syncRoomClock(room, { schedule = true, now = Date.now() } = {}) {
  if (!room?.clock || room.clock.flaggedColor) {
    return room?.clock?.flaggedColor || null;
  }

  const clock = room.clock;
  if (isClockPaused(room)) {
    clock.lastUpdatedAt = now;
    clearRoomClockTimer(room);
    return null;
  }

  const activeColor = room.chess.turn();
  if (clock.activeColor !== activeColor) {
    clock.activeColor = activeColor;
    clock.lastUpdatedAt = now;
    if (schedule) {
      scheduleRoomClockTimer(room);
    }
    return null;
  }

  if (!clock.lastUpdatedAt) {
    clock.lastUpdatedAt = now;
  }

  const elapsedSeconds = Math.max(0, (now - clock.lastUpdatedAt) / 1000);
  if (elapsedSeconds > 0) {
    clock.remaining[activeColor] = Math.max(0, clock.remaining[activeColor] - elapsedSeconds);
    clock.lastUpdatedAt = now;
  }

  if (clock.remaining[activeColor] <= 0) {
    clock.remaining[activeColor] = 0;
    clock.flaggedColor = activeColor;
    room.status = 'ended';
    clearRoomClockTimer(room);
    return activeColor;
  }

  if (schedule) {
    scheduleRoomClockTimer(room);
  }
  return null;
}

function scheduleRoomClockTimer(room) {
  clearRoomClockTimer(room);
  if (!room?.clock || room.clock.flaggedColor || isClockPaused(room)) {
    return;
  }

  const activeColor = room.chess.turn();
  const remainingMs = Math.max(1, Math.ceil(room.clock.remaining[activeColor] * 1000));
  room.clock.timeoutTimer = setTimeout(() => handleRoomClockTimeout(room.id), remainingMs + CLOCK_TIMEOUT_GRACE_MS);
}

function startRoomClock(room, initialSeconds = room?.clock?.initialSeconds || ROOM_CLOCK_SECONDS) {
  if (!room) {
    return;
  }

  if (!room.clock || room.clock.flaggedColor) {
    room.clock = createClockState(initialSeconds);
  }
  room.clock.activeColor = room.chess.turn();
  room.clock.lastUpdatedAt = Date.now();
  scheduleRoomClockTimer(room);
}

function pauseRoomClock(room) {
  if (!room?.clock) {
    return;
  }

  const pendingDraw = room.pendingDraw;
  const pendingUndo = room.pendingUndo;
  const pendingRematch = room.pendingRematch;
  room.pendingDraw = null;
  room.pendingUndo = null;
  room.pendingRematch = null;
  syncRoomClock(room, { schedule: false });
  room.pendingDraw = pendingDraw;
  room.pendingUndo = pendingUndo;
  room.pendingRematch = pendingRematch;
  room.clock.lastUpdatedAt = Date.now();
  clearRoomClockTimer(room);
}

function resumeRoomClock(room) {
  if (!room?.clock || isRoomFinished(room) || room.status !== 'playing') {
    return;
  }

  room.clock.activeColor = room.chess.turn();
  room.clock.lastUpdatedAt = Date.now();
  scheduleRoomClockTimer(room);
}

function advanceClockAfterMove(room) {
  if (!room?.clock || room.clock.flaggedColor || room.status !== 'playing') {
    return;
  }

  room.clock.activeColor = room.chess.turn();
  room.clock.lastUpdatedAt = Date.now();
  scheduleRoomClockTimer(room);
}

function roomHasBothSeats(room) {
  return Boolean(room.players.w && room.players.b);
}

function roomBothConnected(room) {
  return Boolean(room.players.w?.connected && room.players.b?.connected);
}

function roomMatchStarted(room) {
  if (room?.matchType === 'online_room' && room.hostColor) {
    return Boolean(room.startedPlayers?.[room.hostColor]);
  }

  return Boolean(room.startedPlayers?.w && room.startedPlayers?.b);
}

function isRoomFinished(room) {
  return room.agreedDraw || Boolean(room.clock?.flaggedColor) || room.chess.isGameOver();
}

function findOpenSeat(room) {
  if (!room.players.w) {
    return 'w';
  }
  if (!room.players.b) {
    return 'b';
  }
  return null;
}

function findSeatColorBySocket(room, socketId) {
  if (room.players.w?.socketId === socketId) {
    return 'w';
  }
  if (room.players.b?.socketId === socketId) {
    return 'b';
  }
  return null;
}

function findSeatColorByToken(room, token) {
  if (room.players.w?.token === token) {
    return 'w';
  }
  if (room.players.b?.token === token) {
    return 'b';
  }
  return null;
}

function buildPlayerNames(room) {
  return {
    w: room.players.w?.name || null,
    b: room.players.b?.name || null
  };
}

function buildRoomPayload(room, color, message = '') {
  const opponentColor = color ? oppositeColor(color) : null;
  const opponent = opponentColor ? room.players[opponentColor] : null;
  const opponentType = opponent?.isBot ? 'bot' : 'human';

  return {
    roomId: room.id,
    color,
    fen: room.chess.fen(),
    matchType: room.matchType || 'online_room',
    status: room.status || (roomMatchStarted(room) ? 'playing' : 'waiting'),
    opponentType,
    opponentName: opponent?.name || null,
    ready: roomHasBothSeats(room),
    bothConnected: roomBothConnected(room),
    connectedPlayers: {
      w: Boolean(room.players.w?.connected),
      b: Boolean(room.players.b?.connected)
    },
    hostColor: room.hostColor || null,
    isHost: Boolean(color && room.hostColor === color),
    startedPlayers: {
      w: Boolean(room.startedPlayers?.w),
      b: Boolean(room.startedPlayers?.b)
    },
    matchStarted: roomMatchStarted(room),
    undoPending: Boolean(room.pendingUndo),
    drawPending: Boolean(room.pendingDraw),
    rematchPending: Boolean(room.pendingRematch),
    turn: room.chess.turn(),
    state: summarizeGame(room.chess, { agreedDraw: room.agreedDraw, clock: room.clock }),
    clock: serializeClock(room.clock),
    playerNames: buildPlayerNames(room),
    bot: room.bot
      ? {
        name: room.bot.name,
        color: room.bot.color,
        type: room.bot.type || 'server-bot'
      }
      : null,
    message
  };
}

function cancelRoomExpiry(room) {
  if (!room?.closeTimer) {
    return;
  }

  clearTimeout(room.closeTimer);
  room.closeTimer = 0;
}

function cleanupRoom(roomId) {
  const room = rooms.get(roomId);
  if (!room) {
    return;
  }

  cancelRoomExpiry(room);
  clearRoomClockTimer(room);
  if (room.botMoveTimer) {
    clearTimeout(room.botMoveTimer);
    room.botMoveTimer = 0;
  }
  ['w', 'b'].forEach((color) => {
    const seat = room.players[color];
    if (!seat?.socketId) {
      return;
    }
    io.sockets.sockets.get(seat.socketId)?.leave(roomId);
    socketToRoom.delete(seat.socketId);
  });

  rooms.delete(roomId);
}

function emitRoomState(room, message = '') {
  ['w', 'b'].forEach((color) => {
    const seat = room.players[color];
    if (!seat?.connected || !seat.socketId) {
      return;
    }
    io.to(seat.socketId).emit('roomState', buildRoomPayload(room, color, message));
  });
}

function emitPresence(room, changedColor, connected, message) {
  ['w', 'b'].forEach((color) => {
    const seat = room.players[color];
    if (!seat?.connected || !seat.socketId) {
      return;
    }
    io.to(seat.socketId).emit('playerPresence', {
      roomId: room.id,
      color: changedColor,
      connected,
      playerNames: buildPlayerNames(room),
      message
    });
  });
}

function scheduleRoomExpiry(roomId) {
  const room = rooms.get(roomId);
  if (!room) {
    return;
  }

  cancelRoomExpiry(room);
  if (roomBothConnected(room)) {
    return;
  }

  room.closeTimer = setTimeout(() => {
    const latestRoom = rooms.get(roomId);
    if (!latestRoom || roomBothConnected(latestRoom)) {
      return;
    }

    ['w', 'b'].forEach((color) => {
      const seat = latestRoom.players[color];
      if (!seat?.connected || !seat.socketId) {
        return;
      }
      io.to(seat.socketId).emit('opponentLeft', {
        roomId,
        message: 'Reconnect window expired. Your opponent did not return, so you win.'
      });
      io.to(seat.socketId).emit('gameOver', {
        roomId,
        reason: 'abandoned',
        message: 'Reconnect window expired. Your opponent did not return, so you win.',
        state: {
          result: 'abandoned',
          winner: color,
          inCheck: latestRoom.chess.inCheck(),
          turn: latestRoom.chess.turn()
        },
        fen: latestRoom.chess.fen(),
        clock: serializeClock(latestRoom.clock)
      });
    });

    cleanupRoom(roomId);
  }, ROOM_PERSIST_MS);
}

function assignPlayerSeat(room, socketId, preferredColor = 'auto', playerName = '') {
  const desiredSeat = normalizeColorPreference(preferredColor);
  const normalizedName = normalizePlayerName(playerName);

  if (desiredSeat !== 'auto') {
    if (room.players[desiredSeat]) {
      return {
        seat: null,
        player: null,
        error: `${COLOR_LABELS[desiredSeat]} is already taken in this room.`
      };
    }

    const player = createPlayerSeat(socketId, normalizedName);
    room.players[desiredSeat] = player;
    return { seat: desiredSeat, player, error: null };
  }

  const openSeat = findOpenSeat(room);
  if (!openSeat) {
    return {
      seat: null,
      player: null,
      error: 'That room already has two players.'
    };
  }

  const player = createPlayerSeat(socketId, normalizedName);
  room.players[openSeat] = player;
  return { seat: openSeat, player, error: null };
}

function attachSeatSocket(room, color, socket) {
  const seat = room.players[color];
  if (!seat) {
    return null;
  }

  if (seat.socketId && seat.socketId !== socket.id) {
    socketToRoom.delete(seat.socketId);
    io.sockets.sockets.get(seat.socketId)?.leave(room.id);
  }

  seat.socketId = socket.id;
  seat.connected = true;
  seat.lastSeenAt = Date.now();
  socketToRoom.set(socket.id, room.id);
  socket.join(room.id);
  cancelRoomExpiry(room);
  return seat;
}

function updateSeatName(room, color, playerName = '') {
  const seat = room.players[color];
  if (!seat) {
    return;
  }

  const normalizedName = normalizePlayerName(playerName);
  if (normalizedName) {
    seat.name = normalizedName;
  }
}

function resetForRematch(room) {
  const clockSeconds = room.clock?.initialSeconds || ROOM_CLOCK_SECONDS;
  clearRoomClockTimer(room);
  room.chess = new Chess();
  room.clock = createClockState(clockSeconds);
  room.pendingUndo = null;
  room.pendingDraw = null;
  room.pendingRematch = null;
  room.agreedDraw = false;
  room.status = 'waiting';
  room.introReady = {
    w: false,
    b: false
  };
  room.startedPlayers = {
    w: false,
    b: false
  };
  if (room.botMoveTimer) {
    clearTimeout(room.botMoveTimer);
    room.botMoveTimer = 0;
  }
}

function closeRoom(roomId, reason = 'match closed', departedSocketId = null) {
  const room = rooms.get(roomId);
  if (!room) {
    return;
  }

  const departedColor = departedSocketId ? findSeatColorBySocket(room, departedSocketId) : null;
  const winner = departedColor ? oppositeColor(departedColor) : null;
  room.status = 'ended';
  clearRoomClockTimer(room);

  ['w', 'b'].forEach((color) => {
    const seat = room.players[color];
    if (!seat?.connected || !seat.socketId || seat.socketId === departedSocketId) {
      return;
    }

    const departedName = departedColor ? room.players[departedColor]?.name || COLOR_LABELS[departedColor] : 'Opponent';
    const winnerMessage = departedColor
      ? `${departedName} left the room. You win.`
      : reason;

    io.to(seat.socketId).emit('opponentLeft', {
      roomId,
      message: winnerMessage
    });

    io.to(seat.socketId).emit('gameOver', {
      roomId,
      reason,
      message: winnerMessage,
      state: room.agreedDraw
        ? summarizeGame(room.chess, { agreedDraw: true, clock: room.clock })
        : {
          result: 'abandoned',
          winner,
          inCheck: room.chess.inCheck(),
          turn: room.chess.turn()
        },
      fen: room.chess.fen(),
      clock: serializeClock(room.clock)
    });
  });

  cleanupRoom(roomId);
}

function normalizeQueueColor(preferredColor) {
  const normalized = normalizeColorPreference(preferredColor);
  return normalized === 'auto' ? null : normalized;
}

function choosePublicColorForFirstPlayer(playerA, playerB) {
  const preferenceA = normalizeQueueColor(playerA.preferredColor);
  const preferenceB = normalizeQueueColor(playerB.preferredColor);

  if (preferenceA && preferenceA !== preferenceB) {
    return preferenceA;
  }
  if (preferenceB && preferenceA !== preferenceB) {
    return oppositeColor(preferenceB);
  }
  return Math.random() > 0.5 ? 'w' : 'b';
}

function createMoveResponse(room, roomId, appliedMove) {
  return {
    roomId,
    move: {
      from: appliedMove.from,
      to: appliedMove.to,
      promotion: appliedMove.promotion || undefined,
      san: appliedMove.san,
      color: appliedMove.color
    },
    fen: room.chess.fen(),
    turn: room.chess.turn(),
    state: summarizeGame(room.chess, { agreedDraw: room.agreedDraw, clock: room.clock }),
    clock: serializeClock(room.clock)
  };
}

function buildPublicMatchPayload(room, color, playerToken, message) {
  return {
    ok: true,
    ...buildRoomPayload(room, color, message),
    playerToken,
    opponentType: room.players[oppositeColor(color)]?.isBot ? 'bot' : 'human',
    opponentName: room.players[oppositeColor(color)]?.name || 'Opponent'
  };
}

function createPublicPvPMatch(playerA, playerB) {
  const roomId = createRoomId();
  const colorA = choosePublicColorForFirstPlayer(playerA, playerB);
  const colorB = oppositeColor(colorA);
  const seatA = createPlayerSeat(playerA.socketId, playerA.playerName);
  const seatB = createPlayerSeat(playerB.socketId, playerB.playerName);
  const room = createPublicPvPMatchRoom({
    roomId,
    white: colorA === 'w' ? seatA : seatB,
    black: colorA === 'b' ? seatA : seatB
  });
  room.clock = createClockState(PUBLIC_MATCH_CLOCK_SECONDS);

  rooms.set(roomId, room);
  socketToRoom.set(playerA.socketId, roomId);
  socketToRoom.set(playerB.socketId, roomId);
  playerA.socket.join(roomId);
  playerB.socket.join(roomId);

  playerA.socket.emit('public_match_found', buildPublicMatchPayload(
    room,
    colorA,
    seatA.token,
    'Match found. Preparing board...'
  ));
  playerB.socket.emit('public_match_found', buildPublicMatchPayload(
    room,
    colorB,
    seatB.token,
    'Match found. Preparing board...'
  ));
}

function createPublicBotMatch(player) {
  const roomId = createRoomId();
  const preferredColor = normalizeQueueColor(player.preferredColor);
  const humanColor = preferredColor || (Math.random() > 0.5 ? 'w' : 'b');
  const humanSeat = createPlayerSeat(player.socketId, player.playerName);
  const bot = createBotPlayer();
  const room = createPublicBotMatchRoom({
    roomId,
    human: humanSeat,
    humanColor,
    bot
  });
  room.clock = createClockState(PUBLIC_MATCH_CLOCK_SECONDS);

  rooms.set(roomId, room);
  socketToRoom.set(player.socketId, roomId);
  player.socket.join(roomId);

  player.socket.emit('public_bot_match_found', buildPublicMatchPayload(
    room,
    humanColor,
    humanSeat.token,
    'AI fill found. Preparing board...'
  ));
}

function emitGameOverIfNeeded(room, roomId, response) {
  if (response.state.result === 'active') {
    return false;
  }

  room.status = 'ended';
  clearRoomClockTimer(room);
  io.to(roomId).emit('gameOver', {
    roomId,
    reason: response.state.result,
    state: response.state,
    fen: response.fen,
    clock: response.clock || serializeClock(room.clock)
  });
  return true;
}

function buildClockTimeoutResponse(room, roomId) {
  return {
    roomId,
    fen: room.chess.fen(),
    turn: room.chess.turn(),
    state: summarizeGame(room.chess, { agreedDraw: room.agreedDraw, clock: room.clock }),
    clock: serializeClock(room.clock)
  };
}

function handleRoomClockTimeout(roomId) {
  const room = rooms.get(roomId);
  if (!room) {
    return;
  }

  const flaggedColor = syncRoomClock(room, { schedule: false });
  if (!flaggedColor) {
    scheduleRoomClockTimer(room);
    return;
  }

  const response = buildClockTimeoutResponse(room, roomId);
  emitRoomState(room, `${COLOR_LABELS[flaggedColor]} flagged on time.`);
  emitGameOverIfNeeded(room, roomId, response);
}

function scheduleBotMove(roomId) {
  const room = rooms.get(roomId);
  if (!isPublicBotRoom(room) || room.status !== 'playing' || isRoomFinished(room) || room.pendingDraw || room.pendingUndo) {
    return;
  }

  if (room.chess.turn() !== room.bot?.color || room.botMoveTimer) {
    return;
  }

  room.bot.thinking = true;
  room.botMoveTimer = setTimeout(() => {
    room.botMoveTimer = 0;
    makeBotMove(roomId);
  }, getBotMoveDelayMs());
}

function makeBotMove(roomId) {
  const room = rooms.get(roomId);
  if (!isPublicBotRoom(room) || room.status !== 'playing' || isRoomFinished(room) || room.pendingDraw || room.pendingUndo) {
    return;
  }

  const flaggedColor = syncRoomClock(room, { schedule: false });
  if (flaggedColor) {
    const timeoutResponse = buildClockTimeoutResponse(room, roomId);
    emitRoomState(room, `${COLOR_LABELS[flaggedColor]} flagged on time.`);
    emitGameOverIfNeeded(room, roomId, timeoutResponse);
    return;
  }

  if (room.chess.turn() !== room.bot?.color) {
    scheduleRoomClockTimer(room);
    return;
  }

  const botMove = chooseBotMove(room.chess);
  if (!botMove) {
    scheduleRoomClockTimer(room);
    return;
  }

  const appliedMove = tryChessMove(room.chess, botMove);
  if (!appliedMove) {
    scheduleRoomClockTimer(room);
    return;
  }

  advanceClockAfterMove(room);
  room.bot.thinking = false;
  const response = createMoveResponse(room, roomId, appliedMove);
  const humanColor = oppositeColor(room.bot.color);
  const humanSocketId = room.players[humanColor]?.socketId;
  if (humanSocketId) {
    io.to(humanSocketId).emit('opponentMove', {
      ...response,
      opponentType: 'bot'
    });
  }
  emitRoomState(room, response.state.result === 'active' ? `${room.bot.name} moved.` : 'Game finished.');
  emitGameOverIfNeeded(room, roomId, response);
}

function markPublicIntroComplete(room, color) {
  if (!isPublicRoom(room)) {
    return false;
  }

  room.introReady = room.introReady || { w: false, b: false };
  room.introReady[color] = true;
  if (isPublicBotRoom(room) && room.bot?.color) {
    room.introReady[room.bot.color] = true;
  }

  if (room.introReady.w && room.introReady.b) {
    room.status = 'playing';
    startRoomClock(room, room.clock?.initialSeconds || PUBLIC_MATCH_CLOCK_SECONDS);
    emitRoomState(room, 'Public match live.');
    if (isPublicBotRoom(room)) {
      scheduleBotMove(room.id);
    }
    return true;
  }

  emitRoomState(room, 'Waiting for opponent intro to finish.');
  return false;
}

const matchmakingManager = new MatchmakingManager({
  botFillMs: PUBLIC_BOT_FILL_MS,
  isSocketBusy: (socketId) => socketToRoom.has(socketId),
  emitStatus: (socket, detail) => socket.emit('public_matchmaking_status', detail),
  createPublicPvPMatch,
  createPublicBotMatch
});

io.on('connection', (socket) => {
  socket.on('public_matchmaking_join', ({ playerName, preferredColor } = {}, acknowledge) => {
    const result = matchmakingManager.join(socket, {
      playerName: normalizePlayerName(playerName),
      preferredColor: normalizeColorPreference(preferredColor)
    });

    acknowledge?.(result);
  });

  socket.on('public_matchmaking_cancel', (_payload = {}, acknowledge) => {
    matchmakingManager.cancel(socket.id);
    acknowledge?.({ ok: true });
  });

  socket.on('public_match_intro_complete', ({ roomId } = {}, acknowledge) => {
    const normalizedRoomId = String(roomId || '').trim().toUpperCase();
    const room = rooms.get(normalizedRoomId);
    if (!room) {
      acknowledge?.({ ok: false, error: 'Room not found.' });
      return;
    }

    const playerColor = findSeatColorBySocket(room, socket.id);
    if (!playerColor) {
      acknowledge?.({ ok: false, error: 'You are not seated in this room.' });
      return;
    }

    const playing = markPublicIntroComplete(room, playerColor);
    acknowledge?.({ ok: true, playing, ...buildRoomPayload(room, playerColor, playing ? 'Public match live.' : 'Waiting for opponent intro.') });
  });

  socket.on('createRoom', ({ preferredColor, playerName } = {}, acknowledge) => {
    matchmakingManager.remove(socket.id, { emit: false });
    const roomId = createRoomId();
    const room = {
      id: roomId,
      matchType: 'online_room',
      status: 'waiting',
      chess: new Chess(),
      players: {
        w: null,
        b: null
      },
      pendingUndo: null,
      pendingDraw: null,
      pendingRematch: null,
      startedPlayers: {
        w: false,
        b: false
      },
      agreedDraw: false,
      clock: createClockState(ROOM_CLOCK_SECONDS),
      closeTimer: 0
    };

    const { seat, player, error } = assignPlayerSeat(room, socket.id, preferredColor, playerName);
    if (!seat || !player || error) {
      acknowledge({ ok: false, error: error || 'Unable to reserve the requested seat.' });
      return;
    }

    room.hostColor = seat;
    rooms.set(roomId, room);
    socketToRoom.set(socket.id, roomId);
    socket.join(roomId);

    const inviteColor = oppositeColor(seat);
    const payload = buildRoomPayload(
      room,
      seat,
      `Room created. Share the invite link or code to invite ${COLOR_LABELS[inviteColor]}.`
    );
    socket.emit('roomState', payload);
    acknowledge({ ok: true, ...payload, playerToken: player.token });
  });

  socket.on('joinRoom', ({ roomId, preferredColor, playerName } = {}, acknowledge) => {
    matchmakingManager.remove(socket.id, { emit: false });
    const normalizedRoomId = String(roomId || '').trim().toUpperCase();
    const room = rooms.get(normalizedRoomId);

    if (!room) {
      acknowledge({ ok: false, error: 'Room not found.' });
      return;
    }

    if (isPublicRoom(room)) {
      acknowledge({ ok: false, error: 'Public matchmaking rooms cannot be joined by room code.' });
      return;
    }

    const { seat, player, error } = assignPlayerSeat(room, socket.id, preferredColor, playerName);
    if (!seat || !player || error) {
      acknowledge({ ok: false, error: error || 'Unable to claim a seat in this room.' });
      return;
    }

    socketToRoom.set(socket.id, normalizedRoomId);
    socket.join(normalizedRoomId);

    const joiningPayload = buildRoomPayload(room, seat, 'Joined room successfully.');
    socket.emit('roomState', joiningPayload);

    const opponentColor = oppositeColor(seat);
    const opponent = room.players[opponentColor];
    if (opponent?.connected && opponent.socketId) {
      io.to(opponent.socketId).emit('playerJoined', buildRoomPayload(room, opponentColor, 'Opponent connected. Host can start the match.'));
    }

    emitRoomState(room, roomBothConnected(room) ? 'Both players connected. Host can start the match.' : 'Waiting for opponent.');
    acknowledge({ ok: true, ...joiningPayload, playerToken: player.token });
  });

  socket.on('reconnectRoom', ({ roomId, playerToken, playerName } = {}, acknowledge) => {
    matchmakingManager.remove(socket.id, { emit: false });
    const normalizedRoomId = String(roomId || '').trim().toUpperCase();
    const normalizedToken = String(playerToken || '').trim();
    const room = rooms.get(normalizedRoomId);

    if (!room || !normalizedToken) {
      acknowledge({ ok: false, error: 'Saved room session not found.' });
      return;
    }

    if (isPublicRoom(room)) {
      acknowledge({ ok: false, error: 'Public matches cannot be restored after reload yet.' });
      return;
    }

    const color = findSeatColorByToken(room, normalizedToken);
    if (!color) {
      acknowledge({ ok: false, error: 'This saved seat is no longer available.' });
      return;
    }

    attachSeatSocket(room, color, socket);
    updateSeatName(room, color, playerName);
    emitPresence(room, color, true, `${room.players[color]?.name || COLOR_LABELS[color]} reconnected.`);
    emitRoomState(
      room,
      roomBothConnected(room)
        ? roomMatchStarted(room)
          ? 'Match live.'
          : 'Both players connected. Host can start the match.'
        : 'Waiting for reconnect.'
    );
    acknowledge({ ok: true, ...buildRoomPayload(room, color, 'Reconnected to the room.'), playerToken: normalizedToken });
  });

  socket.on('startMatch', ({ roomId }, acknowledge) => {
    const normalizedRoomId = String(roomId || '').trim().toUpperCase();
    const room = rooms.get(normalizedRoomId);
    if (!room) {
      acknowledge({ ok: false, error: 'Room not found.' });
      return;
    }

    if (isPublicRoom(room)) {
      acknowledge({ ok: false, error: 'Public matches start automatically after the VS intro.' });
      return;
    }

    const playerColor = findSeatColorBySocket(room, socket.id);
    if (!playerColor) {
      acknowledge({ ok: false, error: 'You are not seated in this room.' });
      return;
    }

    if (!roomHasBothSeats(room)) {
      acknowledge({ ok: false, error: 'Waiting for both players to join.' });
      return;
    }

    if (!roomBothConnected(room)) {
      acknowledge({ ok: false, error: 'Both players must be connected before starting.' });
      return;
    }

    if (isRoomFinished(room)) {
      acknowledge({ ok: false, error: 'This game has already finished.' });
      return;
    }

    if (room.hostColor && playerColor !== room.hostColor) {
      acknowledge({ ok: false, error: 'Only the host can start this room match.' });
      return;
    }

    const hostColor = room.hostColor || playerColor;
    room.hostColor = hostColor;
    room.startedPlayers = {
      w: true,
      b: true
    };
    room.status = 'playing';
    startRoomClock(room, room.clock?.initialSeconds || ROOM_CLOCK_SECONDS);
    const message = 'Host started the match.';
    emitRoomState(room, message);
    acknowledge({ ok: true, ...buildRoomPayload(room, playerColor, message) });
  });

  socket.on('move', ({ roomId, move }, acknowledge) => {
    const normalizedRoomId = String(roomId || '').trim().toUpperCase();
    const room = rooms.get(normalizedRoomId);
    if (!room) {
      acknowledge({ ok: false, error: 'Room not found.' });
      return;
    }

    const playerColor = findSeatColorBySocket(room, socket.id);
    if (!playerColor) {
      acknowledge({ ok: false, error: 'You are not seated in this room.' });
      return;
    }

    if (!roomHasBothSeats(room)) {
      acknowledge({ ok: false, error: 'Waiting for both players to join.' });
      return;
    }

    if (!roomBothConnected(room)) {
      acknowledge({ ok: false, error: 'Waiting for the disconnected player to reconnect.' });
      return;
    }

    if (!roomMatchStarted(room)) {
      acknowledge({ ok: false, error: 'The host must start the match first.' });
      return;
    }

    if (isPublicRoom(room) && room.status !== 'playing') {
      acknowledge({ ok: false, error: 'The public match starts after the VS intro finishes.' });
      return;
    }

    if (room.pendingUndo || room.pendingDraw || room.pendingRematch) {
      acknowledge({ ok: false, error: 'Resolve the pending agreement first.' });
      return;
    }

    if (isRoomFinished(room)) {
      acknowledge({ ok: false, error: 'This game has already finished.' });
      return;
    }

    const flaggedColor = syncRoomClock(room, { schedule: false });
    if (flaggedColor) {
      const timeoutResponse = buildClockTimeoutResponse(room, normalizedRoomId);
      emitRoomState(room, `${COLOR_LABELS[flaggedColor]} flagged on time.`);
      emitGameOverIfNeeded(room, normalizedRoomId, timeoutResponse);
      acknowledge({
        ok: false,
        error: `${COLOR_LABELS[flaggedColor]} flagged on time.`,
        ...timeoutResponse
      });
      return;
    }

    if (room.chess.turn() !== playerColor) {
      scheduleRoomClockTimer(room);
      acknowledge({ ok: false, error: 'It is not your turn.' });
      return;
    }

    const appliedMove = tryChessMove(room.chess, move);
    if (!appliedMove) {
      scheduleRoomClockTimer(room);
      acknowledge({ ok: false, error: 'Illegal move.' });
      return;
    }

    room.pendingUndo = null;
    advanceClockAfterMove(room);

    const response = createMoveResponse(room, normalizedRoomId, appliedMove);

    acknowledge({ ok: true, ...response });
    socket.to(normalizedRoomId).emit('opponentMove', response);
    emitRoomState(room, response.state.result === 'active' ? 'Move synchronized.' : 'Game finished.');

    if (!emitGameOverIfNeeded(room, normalizedRoomId, response) && isPublicBotRoom(room)) {
      scheduleBotMove(normalizedRoomId);
    }
  });

  socket.on('requestUndo', ({ roomId }, acknowledge) => {
    const normalizedRoomId = String(roomId || '').trim().toUpperCase();
    const room = rooms.get(normalizedRoomId);
    if (!room) {
      acknowledge({ ok: false, error: 'Room not found.' });
      return;
    }

    const playerColor = findSeatColorBySocket(room, socket.id);
    if (!playerColor) {
      acknowledge({ ok: false, error: 'You are not seated in this room.' });
      return;
    }

    if (!roomBothConnected(room)) {
      acknowledge({ ok: false, error: 'Both players must be connected to request undo.' });
      return;
    }

    if (isRoomFinished(room)) {
      acknowledge({ ok: false, error: 'This game has already finished.' });
      return;
    }

    const flaggedColor = syncRoomClock(room, { schedule: false });
    if (flaggedColor) {
      const timeoutResponse = buildClockTimeoutResponse(room, normalizedRoomId);
      emitRoomState(room, `${COLOR_LABELS[flaggedColor]} flagged on time.`);
      emitGameOverIfNeeded(room, normalizedRoomId, timeoutResponse);
      acknowledge({
        ok: false,
        error: `${COLOR_LABELS[flaggedColor]} flagged on time.`,
        ...timeoutResponse
      });
      return;
    }

    if (room.chess.history().length === 0) {
      acknowledge({ ok: false, error: 'There is no move to undo yet.' });
      return;
    }

    if (room.pendingUndo) {
      acknowledge({ ok: false, error: 'An undo request is already waiting for approval.' });
      return;
    }

    if (room.pendingDraw || room.pendingRematch) {
      acknowledge({ ok: false, error: 'Resolve the pending agreement first.' });
      return;
    }

    if (isPublicBotRoom(room)) {
      if (room.botMoveTimer) {
        clearTimeout(room.botMoveTimer);
        room.botMoveTimer = 0;
      }
      if (room.bot) {
        room.bot.thinking = false;
      }

      room.pendingUndo = {
        requesterColor: playerColor,
        requesterSocketId: socket.id,
        plyCount: room.chess.history().length
      };
      pauseRoomClock(room);

      io.to(socket.id).emit('undoRequested', {
        roomId: normalizedRoomId,
        requesterColor: playerColor,
        canRespond: false,
        message: `${room.bot?.name || 'Bot'} is reviewing the undo request.`
      });

      emitRoomState(room, 'Undo request pending.');
      setTimeout(() => {
        const latestRoom = rooms.get(normalizedRoomId);
        if (!isPublicBotRoom(latestRoom) || latestRoom.pendingUndo?.requesterSocketId !== socket.id) {
          return;
        }

        const undoneMove = latestRoom.chess.undo();
        latestRoom.pendingUndo = null;
        if (!undoneMove) {
          resumeRoomClock(latestRoom);
          io.to(socket.id).emit('undoResolved', {
            roomId: normalizedRoomId,
            accepted: false,
            message: `${latestRoom.bot?.name || 'Bot'} could not undo that move.`
          });
          emitRoomState(latestRoom, 'Undo request declined.');
          return;
        }

        resumeRoomClock(latestRoom);
        const response = {
          roomId: normalizedRoomId,
          move: {
            from: undoneMove.from,
            to: undoneMove.to,
            promotion: undoneMove.promotion || undefined,
            san: undoneMove.san,
            color: undoneMove.color
          },
          fen: latestRoom.chess.fen(),
          turn: latestRoom.chess.turn(),
          state: summarizeGame(latestRoom.chess, { agreedDraw: latestRoom.agreedDraw, clock: latestRoom.clock }),
          clock: serializeClock(latestRoom.clock),
          message: `${COLOR_LABELS[undoneMove.color]} move has been taken back.`
        };

        io.to(socket.id).emit('undoApplied', response);
        emitRoomState(latestRoom, 'Undo applied.');
      }, 700);

      acknowledge({ ok: true, message: 'Undo request sent.' });
      return;
    }

    room.pendingUndo = {
      requesterColor: playerColor,
      requesterSocketId: socket.id,
      plyCount: room.chess.history().length
    };
    pauseRoomClock(room);

    const opponentColor = oppositeColor(playerColor);
    const opponentSocketId = room.players[opponentColor]?.socketId;

    io.to(socket.id).emit('undoRequested', {
      roomId: normalizedRoomId,
      requesterColor: playerColor,
      canRespond: false,
      message: 'Undo request sent. Waiting for your opponent.'
    });

    if (opponentSocketId) {
      io.to(opponentSocketId).emit('undoRequested', {
        roomId: normalizedRoomId,
        requesterColor: playerColor,
        canRespond: true,
        message: `${COLOR_LABELS[playerColor]} requests an undo.`
      });
    }

    emitRoomState(room, 'Undo request pending.');
    acknowledge({ ok: true, message: 'Undo request sent.' });
  });

  socket.on('respondUndo', ({ roomId, accept }, acknowledge) => {
    const normalizedRoomId = String(roomId || '').trim().toUpperCase();
    const room = rooms.get(normalizedRoomId);
    if (!room) {
      acknowledge({ ok: false, error: 'Room not found.' });
      return;
    }

    const playerColor = findSeatColorBySocket(room, socket.id);
    if (!playerColor) {
      acknowledge({ ok: false, error: 'You are not seated in this room.' });
      return;
    }

    if (!room.pendingUndo) {
      acknowledge({ ok: false, error: 'There is no undo request to answer.' });
      return;
    }

    if (room.pendingUndo.requesterSocketId === socket.id) {
      acknowledge({ ok: false, error: 'You cannot answer your own undo request.' });
      return;
    }

    const requesterSocketId = room.pendingUndo.requesterSocketId;

    if (!accept) {
      room.pendingUndo = null;
      resumeRoomClock(room);

      io.to(requesterSocketId).emit('undoResolved', {
        roomId: normalizedRoomId,
        accepted: false,
        message: 'Undo request declined.'
      });

      io.to(socket.id).emit('undoResolved', {
        roomId: normalizedRoomId,
        accepted: false,
        message: 'Undo request declined.'
      });

      emitRoomState(room, 'Undo request declined.');
      acknowledge({ ok: true, accepted: false });
      return;
    }

    const undoneMove = room.chess.undo();
    room.pendingUndo = null;

    if (!undoneMove) {
      resumeRoomClock(room);
      acknowledge({ ok: false, error: 'Unable to undo the last move.' });
      return;
    }

    resumeRoomClock(room);
    const response = {
      roomId: normalizedRoomId,
      move: {
        from: undoneMove.from,
        to: undoneMove.to,
        promotion: undoneMove.promotion || undefined,
        san: undoneMove.san,
        color: undoneMove.color
      },
      fen: room.chess.fen(),
      turn: room.chess.turn(),
      state: summarizeGame(room.chess, { agreedDraw: room.agreedDraw, clock: room.clock }),
      clock: serializeClock(room.clock),
      message: `${COLOR_LABELS[undoneMove.color]} move has been taken back.`
    };

    io.to(normalizedRoomId).emit('undoApplied', response);
    emitRoomState(room, 'Undo applied.');
    acknowledge({ ok: true, accepted: true, ...response });
  });

  socket.on('requestDraw', ({ roomId }, acknowledge) => {
    const normalizedRoomId = String(roomId || '').trim().toUpperCase();
    const room = rooms.get(normalizedRoomId);
    if (!room) {
      acknowledge({ ok: false, error: 'Room not found.' });
      return;
    }

    const playerColor = findSeatColorBySocket(room, socket.id);
    if (!playerColor) {
      acknowledge({ ok: false, error: 'You are not seated in this room.' });
      return;
    }

    if (!roomBothConnected(room)) {
      acknowledge({ ok: false, error: 'Both players must be connected to offer a draw.' });
      return;
    }

    if (isRoomFinished(room)) {
      acknowledge({ ok: false, error: 'This game has already finished.' });
      return;
    }

    const flaggedColor = syncRoomClock(room, { schedule: false });
    if (flaggedColor) {
      const timeoutResponse = buildClockTimeoutResponse(room, normalizedRoomId);
      emitRoomState(room, `${COLOR_LABELS[flaggedColor]} flagged on time.`);
      emitGameOverIfNeeded(room, normalizedRoomId, timeoutResponse);
      acknowledge({
        ok: false,
        error: `${COLOR_LABELS[flaggedColor]} flagged on time.`,
        ...timeoutResponse
      });
      return;
    }

    if (room.pendingUndo || room.pendingRematch) {
      acknowledge({ ok: false, error: 'Resolve the pending agreement first.' });
      return;
    }

    if (room.pendingDraw) {
      acknowledge({ ok: false, error: 'A draw request is already waiting for approval.' });
      return;
    }

    if (isPublicBotRoom(room)) {
      if (room.botMoveTimer) {
        clearTimeout(room.botMoveTimer);
        room.botMoveTimer = 0;
      }
      if (room.bot) {
        room.bot.thinking = false;
      }

      room.pendingDraw = {
        requesterColor: playerColor,
        requesterSocketId: socket.id
      };
      pauseRoomClock(room);

      io.to(socket.id).emit('drawRequested', {
        roomId: normalizedRoomId,
        requesterColor: playerColor,
        canRespond: false,
        message: `${room.bot?.name || 'Bot'} is reviewing the draw offer.`
      });

      emitRoomState(room, 'Draw offer pending.');
      setTimeout(() => {
        const latestRoom = rooms.get(normalizedRoomId);
        if (!isPublicBotRoom(latestRoom) || latestRoom.pendingDraw?.requesterSocketId !== socket.id) {
          return;
        }

        const accepted = shouldBotAcceptDraw(latestRoom.chess);
        latestRoom.pendingDraw = null;
        if (!accepted) {
          resumeRoomClock(latestRoom);
          io.to(socket.id).emit('drawResolved', {
            roomId: normalizedRoomId,
            accepted: false,
            message: `${latestRoom.bot?.name || 'Bot'} declined the draw offer.`
          });
          emitRoomState(latestRoom, 'Draw offer declined.');
          return;
        }

        latestRoom.agreedDraw = true;
        latestRoom.status = 'ended';
        clearRoomClockTimer(latestRoom);
        const response = {
          roomId: normalizedRoomId,
          fen: latestRoom.chess.fen(),
          turn: latestRoom.chess.turn(),
          state: summarizeGame(latestRoom.chess, { agreedDraw: latestRoom.agreedDraw, clock: latestRoom.clock }),
          clock: serializeClock(latestRoom.clock),
          message: 'Draw agreed.'
        };

        io.to(socket.id).emit('drawAccepted', response);
        emitRoomState(latestRoom, 'Draw agreed.');
        io.to(socket.id).emit('gameOver', {
          roomId: normalizedRoomId,
          reason: 'agreement',
          state: response.state,
          fen: response.fen,
          clock: response.clock
        });
      }, 800);

      acknowledge({ ok: true, message: 'Draw offer sent.' });
      return;
    }

    room.pendingDraw = {
      requesterColor: playerColor,
      requesterSocketId: socket.id
    };
    pauseRoomClock(room);

    const opponentColor = oppositeColor(playerColor);
    const opponentSocketId = room.players[opponentColor]?.socketId;

    io.to(socket.id).emit('drawRequested', {
      roomId: normalizedRoomId,
      requesterColor: playerColor,
      canRespond: false,
      message: 'Draw offer sent. Waiting for your opponent.'
    });

    if (opponentSocketId) {
      io.to(opponentSocketId).emit('drawRequested', {
        roomId: normalizedRoomId,
        requesterColor: playerColor,
        canRespond: true,
        message: `${COLOR_LABELS[playerColor]} offers a draw.`
      });
    }

    emitRoomState(room, 'Draw offer pending.');
    acknowledge({ ok: true, message: 'Draw offer sent.' });
  });

  socket.on('respondDraw', ({ roomId, accept }, acknowledge) => {
    const normalizedRoomId = String(roomId || '').trim().toUpperCase();
    const room = rooms.get(normalizedRoomId);
    if (!room) {
      acknowledge({ ok: false, error: 'Room not found.' });
      return;
    }

    const playerColor = findSeatColorBySocket(room, socket.id);
    if (!playerColor) {
      acknowledge({ ok: false, error: 'You are not seated in this room.' });
      return;
    }

    if (!room.pendingDraw) {
      acknowledge({ ok: false, error: 'There is no draw offer to answer.' });
      return;
    }

    if (room.pendingDraw.requesterSocketId === socket.id) {
      acknowledge({ ok: false, error: 'You cannot answer your own draw offer.' });
      return;
    }

    const requesterSocketId = room.pendingDraw.requesterSocketId;

    if (!accept) {
      room.pendingDraw = null;
      resumeRoomClock(room);

      io.to(requesterSocketId).emit('drawResolved', {
        roomId: normalizedRoomId,
        accepted: false,
        message: 'Draw offer declined.'
      });

      io.to(socket.id).emit('drawResolved', {
        roomId: normalizedRoomId,
        accepted: false,
        message: 'Draw offer declined.'
      });

      emitRoomState(room, 'Draw offer declined.');
      acknowledge({ ok: true, accepted: false });
      return;
    }

    room.pendingDraw = null;
    room.agreedDraw = true;
    clearRoomClockTimer(room);

    const response = {
      roomId: normalizedRoomId,
      fen: room.chess.fen(),
      turn: room.chess.turn(),
      state: summarizeGame(room.chess, { agreedDraw: room.agreedDraw, clock: room.clock }),
      clock: serializeClock(room.clock),
      message: 'Draw agreed.'
    };

    io.to(normalizedRoomId).emit('drawAccepted', response);
    emitRoomState(room, 'Draw agreed.');
    io.to(normalizedRoomId).emit('gameOver', {
      roomId: normalizedRoomId,
      reason: 'agreement',
      state: response.state,
      fen: response.fen,
      clock: response.clock
    });

    acknowledge({ ok: true, accepted: true, ...response });
  });

  socket.on('requestRematch', ({ roomId }, acknowledge) => {
    const normalizedRoomId = String(roomId || '').trim().toUpperCase();
    const room = rooms.get(normalizedRoomId);
    if (!room) {
      acknowledge({ ok: false, error: 'Room not found.' });
      return;
    }

    const playerColor = findSeatColorBySocket(room, socket.id);
    if (!playerColor) {
      acknowledge({ ok: false, error: 'You are not seated in this room.' });
      return;
    }

    if (isPublicRoom(room)) {
      acknowledge({ ok: false, error: 'Public matches use New Game or Find Public Match for another opponent.' });
      return;
    }

    if (!roomHasBothSeats(room) || !roomBothConnected(room)) {
      acknowledge({ ok: false, error: 'Both players must be connected for a rematch.' });
      return;
    }

    if (!isRoomFinished(room)) {
      acknowledge({ ok: false, error: 'Rematch is only available after the current game ends.' });
      return;
    }

    if (room.pendingRematch) {
      acknowledge({ ok: false, error: 'A rematch request is already waiting for approval.' });
      return;
    }

    room.pendingRematch = {
      requesterColor: playerColor,
      requesterSocketId: socket.id
    };

    const opponentColor = oppositeColor(playerColor);
    const opponentSocketId = room.players[opponentColor]?.socketId;

    io.to(socket.id).emit('rematchRequested', {
      roomId: normalizedRoomId,
      requesterColor: playerColor,
      canRespond: false,
      message: 'Rematch request sent. Waiting for your opponent.'
    });

    if (opponentSocketId) {
      io.to(opponentSocketId).emit('rematchRequested', {
        roomId: normalizedRoomId,
        requesterColor: playerColor,
        canRespond: true,
        message: `${COLOR_LABELS[playerColor]} requests a rematch.`
      });
    }

    emitRoomState(room, 'Rematch request pending.');
    acknowledge({ ok: true, message: 'Rematch request sent.' });
  });

  socket.on('respondRematch', ({ roomId, accept }, acknowledge) => {
    const normalizedRoomId = String(roomId || '').trim().toUpperCase();
    const room = rooms.get(normalizedRoomId);
    if (!room) {
      acknowledge({ ok: false, error: 'Room not found.' });
      return;
    }

    const playerColor = findSeatColorBySocket(room, socket.id);
    if (!playerColor) {
      acknowledge({ ok: false, error: 'You are not seated in this room.' });
      return;
    }

    if (!room.pendingRematch) {
      acknowledge({ ok: false, error: 'There is no rematch request to answer.' });
      return;
    }

    if (room.pendingRematch.requesterSocketId === socket.id) {
      acknowledge({ ok: false, error: 'You cannot answer your own rematch request.' });
      return;
    }

    const requesterSocketId = room.pendingRematch.requesterSocketId;

    if (!accept) {
      room.pendingRematch = null;

      io.to(requesterSocketId).emit('rematchResolved', {
        roomId: normalizedRoomId,
        accepted: false,
        message: 'Rematch declined.'
      });

      io.to(socket.id).emit('rematchResolved', {
        roomId: normalizedRoomId,
        accepted: false,
        message: 'Rematch declined.'
      });

      emitRoomState(room, 'Rematch declined.');
      acknowledge({ ok: true, accepted: false });
      return;
    }

    resetForRematch(room);
    const response = {
      roomId: normalizedRoomId,
      fen: room.chess.fen(),
      turn: room.chess.turn(),
      state: summarizeGame(room.chess, { agreedDraw: false, clock: room.clock }),
      clock: serializeClock(room.clock),
      startedPlayers: {
        w: false,
        b: false
      },
      matchStarted: false,
      message: 'Rematch started.'
    };

    io.to(normalizedRoomId).emit('rematchStarted', response);
    emitRoomState(room, 'Rematch started.');
    acknowledge({ ok: true, accepted: true, ...response });
  });

  socket.on('leaveRoom', ({ roomId }, acknowledge) => {
    matchmakingManager.remove(socket.id, { emit: false });
    const normalizedRoomId = String(roomId || socketToRoom.get(socket.id) || '').trim().toUpperCase();
    if (!normalizedRoomId || !rooms.has(normalizedRoomId)) {
      acknowledge?.({ ok: true });
      return;
    }

    closeRoom(normalizedRoomId, 'Opponent left the room.', socket.id);
    acknowledge?.({ ok: true });
  });

  socket.on('disconnect', () => {
    matchmakingManager.remove(socket.id, { emit: false });
    const roomId = socketToRoom.get(socket.id);
    if (!roomId) {
      return;
    }

    const room = rooms.get(roomId);
    socketToRoom.delete(socket.id);
    if (!room) {
      return;
    }

    const color = findSeatColorBySocket(room, socket.id);
    if (!color) {
      return;
    }

    if (isPublicBotRoom(room)) {
      cleanupRoom(roomId);
      return;
    }

    if (room.matchType === PUBLIC_MATCH_TYPES.pvp) {
      closeRoom(roomId, 'Opponent disconnected from the public match.', socket.id);
      return;
    }

    const seat = room.players[color];
    seat.connected = false;
    seat.socketId = null;
    seat.lastSeenAt = Date.now();

    emitPresence(room, color, false, `${seat.name || COLOR_LABELS[color]} disconnected. Waiting for reconnect.`);
    emitRoomState(room, 'Opponent disconnected. Room is being held for reconnect.');
    scheduleRoomExpiry(roomId);
  });
});

return {
  ok: true,
  healthPath,
  rooms
};
}

function createStandaloneChessServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: true,
      credentials: true
    }
  });

  registerPremiumChessRuntime({ app, io, healthPath: DEFAULT_HEALTH_PATH });
  return { app, httpServer, io };
}

const currentFilePath = fileURLToPath(import.meta.url);
const invokedFilePath = process.argv[1] ? path.resolve(process.argv[1]) : '';

if (invokedFilePath && currentFilePath === invokedFilePath) {
  const { httpServer } = createStandaloneChessServer();
  httpServer.listen(PORT, () => {
    console.log(`Imperial Chess server running on http://localhost:${PORT}`);
  });
}
