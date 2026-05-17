import { createServer } from 'node:http';
import { existsSync, readFile } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Server } from 'socket.io';
import { getCourseLevels, getCoursePack, getLevelById } from '../src/game/coursePacks.js';
import {
  MATCH_STATUS,
  ONLINE_EVENTS,
  ONLINE_LIMITS,
  isValidRoomCode,
  makeClientError,
  maxShotsForPar,
  normalizeCourseLength,
  normalizeDirectionPayload,
  normalizePreference,
  sanitizeDisplayName,
  sanitizeRoomCode,
  scoreRecordTotal
} from '../src/shared/onlineProtocol.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const port = Number(process.env.PORT || process.env.ONLINE_PORT || 3001);
const devLogs = process.env.NODE_ENV !== 'production';

const rooms = new Map();
const matches = new Map();
const queue = [];
const socketPlayers = new Map();

function log(...parts) {
  if (devLogs) console.log('[online]', ...parts);
}

function now() {
  return Date.now();
}

function id(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

function randomRoomCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  do {
    code = Array.from({ length: ONLINE_LIMITS.ROOM_CODE_LENGTH }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
  } while (rooms.has(code));
  return code;
}

function safeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function isPlainPayload(payload) {
  if (!payload) return true;
  if (typeof payload !== 'object' || Array.isArray(payload)) return false;
  try {
    return JSON.stringify(payload).length <= 1200;
  } catch {
    return false;
  }
}

function rateLimited(socket, key, ms) {
  const current = now();
  const rateKey = `rate:${key}`;
  const last = socket.data[rateKey] ?? 0;
  if (current - last < ms) return true;
  socket.data[rateKey] = current;
  return false;
}

function levelById(levelId) {
  return getLevelById(levelId);
}

function courseLevelIds(coursePack, length) {
  return getCourseLevels(coursePack, length).map((level) => level.id);
}

function makePlayer(socket, displayName, options = {}) {
  return {
    id: options.id ?? socket?.id ?? id('bot'),
    socketId: socket?.id ?? null,
    name: sanitizeDisplayName(displayName, options.fallbackName ?? 'Guest Putter'),
    type: options.type ?? 'human',
    host: Boolean(options.host),
    ready: Boolean(options.ready),
    connected: options.type === 'bot' ? true : Boolean(socket?.connected),
    holes: [],
    rematch: false,
    lastShotAt: 0
  };
}

function publicPlayer(player) {
  const total = player.holes.reduce((sum, hole) => sum + scoreRecordTotal(hole), 0);
  return {
    id: player.id,
    name: player.name,
    type: player.type,
    host: player.host,
    ready: player.ready,
    connected: player.connected,
    holes: player.holes,
    total
  };
}

function publicRoom(room) {
  return {
    code: room.code,
    status: room.status,
    courseLength: room.courseLength,
    coursePack: room.coursePack,
    players: room.players.map(publicPlayer),
    hostId: room.hostId,
    createdAt: room.createdAt
  };
}

function currentLevel(match) {
  return levelById(match.levelIds[match.currentHoleIndex]);
}

function currentPlayer(match) {
  return match.players[match.actorIndex];
}

function publicMatch(match) {
  const player = currentPlayer(match);
  return {
    id: match.id,
    roomCode: match.roomCode,
    source: match.source,
    status: match.status,
    courseLength: match.courseLength,
    coursePack: match.coursePack,
    preference: match.preference,
    levelIds: match.levelIds,
    currentHoleIndex: match.currentHoleIndex,
    totalHoles: match.levelIds.length,
    currentPlayerId: player?.id ?? null,
    turnId: match.turn?.id ?? null,
    turn: match.turn ? {
      id: match.turn.id,
      playerId: match.turn.playerId,
      levelId: match.turn.levelId,
      holeIndex: match.turn.holeIndex,
      shots: match.turn.shots,
      penalties: match.turn.penalties,
      maxShots: match.turn.maxShots,
      ballMoving: match.turn.ballMoving
    } : null,
    players: match.players.map(publicPlayer),
    rematch: match.players.map((item) => ({ id: item.id, requested: item.rematch }))
  };
}

function emitRoom(room) {
  io.to(`room:${room.code}`).emit(ONLINE_EVENTS.ROOM_UPDATE, publicRoom(room));
}

function emitMatch(match, event = ONLINE_EVENTS.MATCH_UPDATE, payload = {}) {
  io.to(`match:${match.id}`).emit(event, { match: publicMatch(match), ...payload });
}

function error(socket, code, message) {
  socket.emit(ONLINE_EVENTS.ERROR, makeClientError(code, message));
}

function findPlayerRoom(socketId) {
  for (const room of rooms.values()) {
    if (room.players.some((player) => player.socketId === socketId)) return room;
  }
  return null;
}

function findPlayerMatch(socketId) {
  for (const match of matches.values()) {
    if (match.players.some((player) => player.socketId === socketId)) return match;
  }
  return null;
}

function startTurn(match) {
  const player = currentPlayer(match);
  const level = currentLevel(match);
  match.status = player.type === 'bot' ? MATCH_STATUS.BOT_TURN : MATCH_STATUS.PLAYER_TURN;
  match.turn = {
    id: id('turn'),
    playerId: player.id,
    levelId: level.id,
    holeIndex: match.currentHoleIndex,
    shots: 0,
    penalties: 0,
    maxShots: maxShotsForPar(level.par),
    ballMoving: false,
    completed: false,
    lastPenaltyAt: 0
  };
  match.lastActivity = now();
  emitMatch(match, ONLINE_EVENTS.TURN_UPDATE);
  if (player.type === 'bot') scheduleBotTurn(match);
}

function createMatch({ source, players, courseLength, coursePack = 'ivory-garden', roomCode = null, preference = 'casual' }) {
  const pack = getCoursePack(coursePack);
  const match = {
    id: id('match'),
    source,
    roomCode,
    coursePack: pack.id,
    courseLength,
    preference,
    levelIds: courseLevelIds(pack.id, courseLength),
    currentHoleIndex: 0,
    actorIndex: 0,
    status: MATCH_STATUS.READY,
    createdAt: now(),
    lastActivity: now(),
    forfeitTimer: null,
    timers: new Set(),
    rematchStarted: false,
    players: players.map((player, index) => ({
      ...player,
      name: sanitizeDisplayName(player.name, player.type === 'bot' ? player.name : 'Guest Putter'),
      host: index === 0 ? player.host : false,
      ready: false,
      rematch: false,
      holes: []
    })),
    turn: null
  };

  matches.set(match.id, match);
  for (const player of match.players) {
    if (player.socketId) {
      const socket = io.sockets.sockets.get(player.socketId);
      socket?.join(`match:${match.id}`);
      socketPlayers.set(player.socketId, { matchId: match.id, playerId: player.id });
    }
  }
  log('match started', match.id, source, pack.id, courseLength);
  emitMatch(match, ONLINE_EVENTS.MATCH_CREATED);
  startTurn(match);
  return match;
}

function scheduleMatchTimer(match, callback, delay) {
  const timer = setTimeout(() => {
    match.timers?.delete(timer);
    callback();
  }, delay);
  match.timers?.add(timer);
  return timer;
}

function clearMatchTimers(match) {
  clearTimeout(match?.forfeitTimer);
  for (const timer of match?.timers ?? []) clearTimeout(timer);
  match?.timers?.clear?.();
}

function completeTurn(match, reason = 'holed') {
  if (!match.turn || match.turn.completed) return;
  const player = currentPlayer(match);
  const level = currentLevel(match);
  const record = {
    levelId: level.id,
    levelName: level.name,
    par: level.par,
    shots: Math.max(1, Math.min(match.turn.shots, match.turn.maxShots)),
    penalties: Math.max(0, Math.min(match.turn.penalties, match.turn.maxShots)),
    reason
  };
  match.turn.completed = true;
  match.turn.ballMoving = false;
  player.holes[match.currentHoleIndex] = record;
  emitMatch(match, ONLINE_EVENTS.HOLE_RESULT, { result: record, playerId: player.id });

  const lastActor = match.actorIndex >= match.players.length - 1;
  const lastHole = match.currentHoleIndex >= match.levelIds.length - 1;
  if (!lastActor) {
    match.actorIndex += 1;
    startTurn(match);
    return;
  }
  if (!lastHole) {
    match.actorIndex = 0;
    match.currentHoleIndex += 1;
    startTurn(match);
    return;
  }
  finishMatch(match);
}

function finishMatch(match, forfeitWinnerId = null) {
  clearMatchTimers(match);
  match.status = MATCH_STATUS.MATCH_COMPLETE;
  match.turn = null;
  match.finishedAt = now();
  match.lastActivity = now();
  const totals = match.players.map((player) => ({
    playerId: player.id,
    name: player.name,
    type: player.type,
    total: player.holes.reduce((sum, hole) => sum + scoreRecordTotal(hole), 0),
    holes: player.holes
  }));
  let winner = totals.slice().sort((a, b) => a.total - b.total)[0] ?? null;
  if (forfeitWinnerId) winner = totals.find((item) => item.playerId === forfeitWinnerId) ?? winner;
  emitMatch(match, ONLINE_EVENTS.MATCH_COMPLETE, { totals, winner });
  log('match complete', match.id, winner?.name ?? 'draw');
}

function scheduleBotTurn(match) {
  const turnId = match.turn.id;
  const bot = currentPlayer(match);
  const level = currentLevel(match);
  const difficulty = match.preference === 'challenge' ? 'hard' : 'normal';
  const distance = Math.hypot(level.hole.x - level.start.x, level.hole.z - level.start.z);
  const angle = Math.atan2(level.hole.z - level.start.z, level.hole.x - level.start.x);
  const error = difficulty === 'hard' ? 0.04 : 0.1;
  const seed = Math.sin(match.currentHoleIndex * 37 + bot.name.length * 11) * error;
  const direction = { x: Math.cos(angle + seed), z: Math.sin(angle + seed) };
  const power = Math.max(0.25, Math.min(0.92, distance / 12 + (difficulty === 'hard' ? -0.04 : 0.04)));
  const plannedShots = Math.max(1, Math.min(match.turn.maxShots, Math.round(level.par + (difficulty === 'hard' ? -0.6 : 0.35) + Math.abs(seed) * 5)));

  scheduleMatchTimer(match, () => {
    if (!matches.has(match.id) || match.turn?.id !== turnId || match.status !== MATCH_STATUS.BOT_TURN) return;
    match.turn.shots = plannedShots;
    match.turn.ballMoving = true;
    emitMatch(match, ONLINE_EVENTS.SHOT_ACCEPTED, {
      playerId: bot.id,
      shot: { direction, power, clientShotId: id('bot-shot') },
      officialShots: plannedShots
    });
    io.to(`match:${match.id}`).emit(ONLINE_EVENTS.BALL_SAMPLE, {
      matchId: match.id,
      turnId,
      playerId: bot.id,
      x: level.start.x,
      z: level.start.z,
      moving: true
    });
    for (let i = 1; i <= 5; i += 1) {
      scheduleMatchTimer(match, () => {
        if (!matches.has(match.id) || match.turn?.id !== turnId || match.status !== MATCH_STATUS.BOT_TURN) return;
        const t = i / 6;
        const wobble = Math.sin(i * 1.7 + seed * 10) * (difficulty === 'hard' ? 0.12 : 0.28);
        io.to(`match:${match.id}`).emit(ONLINE_EVENTS.BALL_SAMPLE, {
          matchId: match.id,
          turnId,
          playerId: bot.id,
          x: level.start.x + (level.hole.x - level.start.x) * t + wobble,
          z: level.start.z + (level.hole.z - level.start.z) * t,
          moving: true
        });
      }, i * 420);
    }
  }, 900);

  scheduleMatchTimer(match, () => {
    if (!matches.has(match.id) || match.turn?.id !== turnId || match.status !== MATCH_STATUS.BOT_TURN) return;
    io.to(`match:${match.id}`).emit(ONLINE_EVENTS.BALL_SAMPLE, {
      matchId: match.id,
      turnId,
      playerId: bot.id,
      x: level.hole.x,
      z: level.hole.z,
      moving: false
    });
    completeTurn(match, 'bot');
  }, 3600);
}

function rejectShot(socket, reason) {
  socket.emit(ONLINE_EVENTS.SHOT_REJECTED, { reason });
}

function handleShot(socket, payload) {
  if (!isPlainPayload(payload)) return rejectShot(socket, 'Shot payload was rejected.');
  const match = matches.get(payload?.matchId);
  if (!match || !match.turn) return rejectShot(socket, 'Match is not active.');
  if (match.status !== MATCH_STATUS.PLAYER_TURN) return rejectShot(socket, 'Match is not ready for a player shot.');
  const player = currentPlayer(match);
  if (!player || player.socketId !== socket.id) return rejectShot(socket, 'It is not your turn.');
  if (match.turn.id !== payload.turnId) return rejectShot(socket, 'That turn has expired.');
  if (match.turn.ballMoving) return rejectShot(socket, 'Wait for the ball to stop.');
  if (match.turn.shots >= match.turn.maxShots) return rejectShot(socket, 'Shot limit reached.');
  if (now() - player.lastShotAt < ONLINE_LIMITS.SHOT_RATE_MS) return rejectShot(socket, 'Please wait before shooting again.');
  const direction = normalizeDirectionPayload(payload.direction);
  const power = safeNumber(payload.power, -1);
  if (!direction || power < 0 || power > 1) return rejectShot(socket, 'Shot input was rejected.');

  player.lastShotAt = now();
  match.turn.shots += 1;
  match.turn.ballMoving = true;
  match.lastActivity = now();
  emitMatch(match, ONLINE_EVENTS.SHOT_ACCEPTED, {
    playerId: player.id,
    shot: {
      direction,
      power,
      clientShotId: String(payload.clientShotId ?? '').slice(0, 48)
    },
    officialShots: match.turn.shots
  });

  if (match.turn.shots >= match.turn.maxShots) {
    const turnId = match.turn.id;
    scheduleMatchTimer(match, () => {
      if (matches.get(match.id)?.turn?.id === turnId) completeTurn(match, 'max-shots');
    }, 2200);
  }
}

function handleBallSample(socket, payload) {
  if (!isPlainPayload(payload)) return;
  const match = matches.get(payload?.matchId);
  if (!match?.turn || match.turn.id !== payload.turnId) return;
  const player = currentPlayer(match);
  if (player?.socketId !== socket.id) return;

  if (payload.penalty && now() - match.turn.lastPenaltyAt > 850) {
    match.turn.penalties += 1;
    match.turn.shots = Math.min(match.turn.maxShots, match.turn.shots + 1);
    match.turn.lastPenaltyAt = now();
  }
  if (payload.moving === false) match.turn.ballMoving = false;

  const x = safeNumber(payload.x);
  const z = safeNumber(payload.z);
  if (Math.abs(x) > 60 || Math.abs(z) > 60) return;

  socket.to(`match:${match.id}`).emit(ONLINE_EVENTS.BALL_SAMPLE, {
    matchId: match.id,
    turnId: match.turn.id,
    playerId: player.id,
    x,
    z,
    moving: Boolean(payload.moving)
  });
}

function handleHoleComplete(socket, payload) {
  if (!isPlainPayload(payload)) return error(socket, 'payload_invalid', 'That match action was rejected.');
  const match = matches.get(payload?.matchId);
  if (!match?.turn) return error(socket, 'match_missing', 'Match is not active.');
  if (match.status !== MATCH_STATUS.PLAYER_TURN) return error(socket, 'match_state', 'The match is not accepting completion right now.');
  const player = currentPlayer(match);
  if (player?.socketId !== socket.id) return error(socket, 'turn_invalid', 'It is not your turn.');
  if (match.turn.id !== payload.turnId) return error(socket, 'turn_expired', 'That turn has expired.');
  if (match.turn.levelId !== Number(payload.levelId)) return error(socket, 'level_invalid', 'Hole mismatch.');
  if (match.turn.shots <= 0) return error(socket, 'complete_invalid', 'Take a shot before completing the hole.');
  if (!payload.holed) return error(socket, 'complete_invalid', 'Hole completion was not accepted.');
  match.turn.penalties = Math.max(match.turn.penalties, Math.min(Math.max(0, Number(payload.penalties) || 0), match.turn.maxShots));
  completeTurn(match, 'holed');
}

function leaveQueue(socketId) {
  const index = queue.findIndex((item) => item.socketId === socketId);
  if (index >= 0) queue.splice(index, 1);
}

function cleanupRoom(socketId) {
  const room = findPlayerRoom(socketId);
  if (!room) return;
  const player = room.players.find((item) => item.socketId === socketId);
  if (player) player.connected = false;
  room.lastActivity = now();
  emitRoom(room);
}

function forfeitMatch(socketId) {
  const match = findPlayerMatch(socketId);
  if (!match || match.status === MATCH_STATUS.MATCH_COMPLETE) return;
  const player = match.players.find((item) => item.socketId === socketId);
  if (player) player.connected = false;
  const opponent = match.players.find((item) => item.socketId !== socketId && item.type !== 'bot') ?? match.players.find((item) => item.id !== player?.id);
  emitMatch(match, ONLINE_EVENTS.OPPONENT_LEFT, { playerId: player?.id, timeoutMs: ONLINE_LIMITS.RECONNECT_MS });
  clearTimeout(match.forfeitTimer);
  match.forfeitTimer = scheduleMatchTimer(match, () => {
    if (!matches.has(match.id) || player?.connected) return;
    finishMatch(match, opponent?.id);
  }, ONLINE_LIMITS.RECONNECT_MS);
}

function joinOrCreateQueue(socket, payload) {
  leaveQueue(socket.id);
  const courseLength = normalizeCourseLength(payload?.courseLength, ONLINE_LIMITS.COURSE_LENGTHS_PUBLIC);
  const coursePack = getCoursePack(payload?.coursePack).id;
  const preference = normalizePreference(payload?.preference);
  const name = sanitizeDisplayName(payload?.displayName);
  const compatibleIndex = queue.findIndex((item) => item.courseLength === courseLength && item.coursePack === coursePack && (item.preference === preference || item.preference === 'any' || preference === 'any'));

  if (compatibleIndex >= 0) {
    const other = queue.splice(compatibleIndex, 1)[0];
    const otherSocket = io.sockets.sockets.get(other.socketId);
    if (otherSocket) {
      const players = [makePlayer(otherSocket, other.name, { ready: true, host: true }), makePlayer(socket, name, { ready: true })];
      createMatch({ source: 'public', players, courseLength, coursePack, preference });
      return;
    }
  }

  queue.push({ socketId: socket.id, name, courseLength, coursePack, preference, enqueuedAt: now() });
  socket.emit(ONLINE_EVENTS.QUEUE_UPDATE, { status: 'queued', courseLength, coursePack, preference, elapsedMs: 0 });
}

function cleanupStale() {
  const current = now();
  for (const item of [...queue]) {
    const socket = io.sockets.sockets.get(item.socketId);
    if (!socket) {
      leaveQueue(item.socketId);
      continue;
    }
    const elapsedMs = current - item.enqueuedAt;
    socket.emit(ONLINE_EVENTS.QUEUE_UPDATE, { status: 'queued', courseLength: item.courseLength, coursePack: item.coursePack, preference: item.preference, elapsedMs });
    if (elapsedMs >= ONLINE_LIMITS.BOT_FILL_MS) {
      leaveQueue(item.socketId);
      const botName = item.preference === 'challenge' ? 'Golden Putter' : 'Royale Bot';
      const players = [makePlayer(socket, item.name, { ready: true, host: true }), makePlayer(null, botName, { id: id('bot'), type: 'bot', ready: true })];
      socket.emit(ONLINE_EVENTS.QUEUE_UPDATE, { status: 'bot-filled', message: 'No player found. Bot opponent joined.' });
      createMatch({ source: 'public-bot', players, courseLength: item.courseLength, coursePack: item.coursePack, preference: item.preference });
    }
  }

  for (const [code, room] of rooms.entries()) {
    const empty = room.players.every((player) => !player.connected);
    if (empty && current - room.lastActivity > ONLINE_LIMITS.ROOM_IDLE_MS) rooms.delete(code);
  }

  for (const [matchId, match] of matches.entries()) {
    const idleLimit = match.status === MATCH_STATUS.MATCH_COMPLETE ? ONLINE_LIMITS.FINISHED_MATCH_TTL_MS : ONLINE_LIMITS.MATCH_IDLE_MS;
    if (current - match.lastActivity > idleLimit) {
      clearMatchTimers(match);
      matches.delete(matchId);
    }
  }
}

const httpServer = createServer((request, response) => {
  const requestUrl = decodeURIComponent((request.url || '/').split('?')[0]);
  const target = requestUrl === '/' ? '/index.html' : requestUrl;
  const filePath = path.normalize(path.join(distDir, target));
  const insideDist = filePath === distDir || filePath.startsWith(`${distDir}${path.sep}`);
  if (!insideDist || !existsSync(distDir)) {
    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Ivory Golf Royale 3D online server is running. Build the client with npm.cmd run build to serve dist.');
    return;
  }
  readFile(filePath, (errorRead, data) => {
    if (errorRead) {
      readFile(path.join(distDir, 'index.html'), (fallbackError, fallback) => {
        if (fallbackError) {
          response.writeHead(404);
          response.end('Not found');
          return;
        }
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end(fallback);
      });
      return;
    }
    const ext = path.extname(filePath);
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
    response.writeHead(200, { 'Content-Type': `${types[ext] ?? 'application/octet-stream'}; charset=utf-8` });
    response.end(data);
  });
});

let io = null;
let cleanupTimer = null;

function bindGolfSocketHandlers(socketServer) {
socketServer.on('connection', (socket) => {
  log('player connected', socket.id);
  socket.emit(ONLINE_EVENTS.STATUS, { connected: true, playerId: socket.id });

  socket.on(ONLINE_EVENTS.ROOM_CREATE, (payload = {}) => {
    if (!isPlainPayload(payload)) return error(socket, 'payload_invalid', 'Room request was rejected.');
    if (rateLimited(socket, 'room-create', ONLINE_LIMITS.ROOM_CREATE_RATE_MS)) return error(socket, 'rate_limited', 'Please wait before creating another room.');
    if ((socket.data.roomsCreated ?? 0) >= 5) return error(socket, 'rate_limited', 'Too many rooms created. Try again later.');
    leaveQueue(socket.id);
    const courseLength = normalizeCourseLength(payload.courseLength, ONLINE_LIMITS.COURSE_LENGTHS_PRIVATE);
    const coursePack = getCoursePack(payload.coursePack).id;
    const code = randomRoomCode();
    const player = makePlayer(socket, payload.displayName, { host: true, ready: false });
    const room = {
      code,
      hostId: player.id,
      courseLength,
      coursePack,
      status: MATCH_STATUS.WAITING,
      players: [player],
      createdAt: now(),
      lastActivity: now(),
      matchId: null
    };
    rooms.set(code, room);
    socket.data.roomsCreated = (socket.data.roomsCreated ?? 0) + 1;
    socket.join(`room:${code}`);
    emitRoom(room);
    log('room created', code);
  });

  socket.on(ONLINE_EVENTS.ROOM_JOIN, (payload = {}) => {
    if (!isPlainPayload(payload)) return error(socket, 'payload_invalid', 'Join request was rejected.');
    const code = sanitizeRoomCode(payload.code);
    leaveQueue(socket.id);
    if (!isValidRoomCode(code)) return error(socket, 'invalid_code', 'Invalid room code.');
    const room = rooms.get(code);
    if (!room) return error(socket, 'room_missing', 'Room not found. Check the code and try again.');
    if (room.matchId || room.status !== MATCH_STATUS.WAITING) return error(socket, 'room_started', 'Match already started.');
    room.players = room.players.filter((player) => player.connected || player.socketId === socket.id);
    if (room.players.some((player) => player.socketId === socket.id)) {
      socket.join(`room:${code}`);
      emitRoom(room);
      return;
    }
    if (room.players.filter((player) => player.connected).length >= 2) return error(socket, 'room_full', 'Room is full.');
    const player = makePlayer(socket, payload.displayName, { ready: false });
    room.players.push(player);
    room.lastActivity = now();
    socket.join(`room:${code}`);
    emitRoom(room);
  });

  socket.on(ONLINE_EVENTS.PLAYER_READY, ({ code, ready } = {}) => {
    const room = rooms.get(sanitizeRoomCode(code));
    const player = room?.players.find((item) => item.socketId === socket.id);
    if (!room || !player) return;
    player.ready = Boolean(ready);
    room.lastActivity = now();
    emitRoom(room);
  });

  socket.on(ONLINE_EVENTS.MATCH_START, ({ code } = {}) => {
    const room = rooms.get(sanitizeRoomCode(code));
    if (!room) return error(socket, 'room_missing', 'Room not found.');
    if (room.hostId !== socket.id) return error(socket, 'host_only', 'Only the host can start.');
    const connected = room.players.filter((player) => player.connected);
    if (connected.length < 2 || !connected.every((player) => player.ready)) return error(socket, 'room_not_ready', 'Both players must be ready.');
    room.status = MATCH_STATUS.PLAYING;
    room.matchId = createMatch({ source: 'private', players: connected, courseLength: room.courseLength, coursePack: room.coursePack, roomCode: room.code }).id;
    emitRoom(room);
  });

  socket.on(ONLINE_EVENTS.ROOM_LEAVE, () => {
    leaveQueue(socket.id);
    cleanupRoom(socket.id);
    forfeitMatch(socket.id);
  });

  socket.on(ONLINE_EVENTS.QUEUE_JOIN, (payload) => {
    if (!isPlainPayload(payload)) return error(socket, 'payload_invalid', 'Queue request was rejected.');
    if (rateLimited(socket, 'queue', ONLINE_LIMITS.QUEUE_RATE_MS)) return error(socket, 'rate_limited', 'Please wait before changing matchmaking.');
    joinOrCreateQueue(socket, payload);
  });
  socket.on(ONLINE_EVENTS.QUEUE_CANCEL, () => {
    if (rateLimited(socket, 'queue', ONLINE_LIMITS.QUEUE_RATE_MS)) return;
    leaveQueue(socket.id);
    socket.emit(ONLINE_EVENTS.QUEUE_UPDATE, { status: 'cancelled' });
  });
  socket.on(ONLINE_EVENTS.SHOT_SUBMIT, (payload) => handleShot(socket, payload));
  socket.on(ONLINE_EVENTS.BALL_SAMPLE, (payload) => handleBallSample(socket, payload));
  socket.on(ONLINE_EVENTS.HOLE_COMPLETE, (payload) => handleHoleComplete(socket, payload));

  socket.on(ONLINE_EVENTS.REMATCH_REQUEST, ({ matchId } = {}) => {
    if (rateLimited(socket, 'rematch', ONLINE_LIMITS.REMATCH_RATE_MS)) return;
    const match = matches.get(matchId);
    const player = match?.players.find((item) => item.socketId === socket.id);
    if (!match || !player || match.status !== MATCH_STATUS.MATCH_COMPLETE || match.rematchStarted) return;
    player.rematch = true;
    emitMatch(match, ONLINE_EVENTS.REMATCH_UPDATE);
    const humans = match.players.filter((item) => item.type !== 'bot');
    if (match.players.some((item) => item.type === 'bot') || humans.every((item) => item.rematch)) {
      match.rematchStarted = true;
      createMatch({ source: match.source, players: match.players, courseLength: match.courseLength, coursePack: match.coursePack, roomCode: match.roomCode, preference: match.preference });
    }
  });

  socket.on(ONLINE_EVENTS.REMATCH_LEAVE, ({ matchId } = {}) => {
    const match = matches.get(matchId);
    if (match) emitMatch(match, ONLINE_EVENTS.OPPONENT_LEFT, { playerId: socket.id, timeoutMs: 0 });
  });

  socket.on('disconnect', () => {
    log('player disconnected', socket.id);
    leaveQueue(socket.id);
    cleanupRoom(socket.id);
    forfeitMatch(socket.id);
    socketPlayers.delete(socket.id);
  });
});
}

export function registerPremiumGolfRuntime({ app = null, io: runtimeIo, healthPath = '/health' } = {}) {
  if (!runtimeIo) {
    throw new Error('Ivory Golf Royale 3D runtime requires a Socket.IO namespace/server.');
  }

  io = runtimeIo;

  if (app && healthPath) {
    app.get(healthPath, (_request, response) => {
      response.json({
        ok: true,
        service: 'ivory-golf-royale-3d',
        activeRooms: rooms.size,
        activeMatches: matches.size,
        queuedPlayers: queue.length,
        connectedPlayers: socketPlayers.size
      });
    });
  }

  bindGolfSocketHandlers(io);

  if (!cleanupTimer) {
    cleanupTimer = setInterval(cleanupStale, 1000);
    cleanupTimer.unref?.();
  }

  return {
    closeRuntime: () => {
      if (cleanupTimer) {
        clearInterval(cleanupTimer);
        cleanupTimer = null;
      }
      rooms.clear();
      matches.clear();
      queue.length = 0;
      socketPlayers.clear();
    }
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const standaloneIo = new Server(httpServer, {
    cors: { origin: '*' },
    maxHttpBufferSize: 10000
  }).of('/premium-golf');

  registerPremiumGolfRuntime({ io: standaloneIo });

  httpServer.listen(port, () => {
    log(`server listening on http://localhost:${port}`);
  });
}
