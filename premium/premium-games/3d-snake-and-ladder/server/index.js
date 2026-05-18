import express from "express";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Server } from "socket.io";
import {
  addMatchLog,
  applyMatchPowerUp,
  createMatchState,
  getCurrentPlayer,
  getMatchSnapshot,
  normalizeOnlineSettings,
  resetMatchState,
  resolveMatchRoll,
  sanitizePlayerName
} from "../src/game/engine.js";
import { BOT_PERSONALITIES, getBotDelay } from "../src/game/bots.js";
import { createPlayerStatus } from "../src/game/powerups.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const startedAt = Date.now();
const version = process.env.npm_package_version || "1.0.0";
const config = {
  port: readPositiveInt("PORT", 3000),
  corsOrigin: process.env.CORS_ORIGIN || "*",
  logLevel: normalizeLogLevel(process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "warn" : "info")),
  disconnectGraceMs: readPositiveInt("DISCONNECT_GRACE_MS", 45_000),
  roomIdleMs: readPositiveInt("ROOM_IDLE_MS", 20 * 60_000),
  finishedRoomTtlMs: readPositiveInt("FINISHED_ROOM_TTL_MS", 5 * 60_000),
  publicStartDelayMs: readPositiveInt("PUBLIC_START_DELAY_MS", 3_000),
  publicStillSearchingMs: readPositiveInt("PUBLIC_STILL_SEARCHING_MS", 10_000),
  publicBotFillSoonMs: readPositiveInt("PUBLIC_BOT_FILL_SOON_MS", 20_000),
  publicBotFillMs: readPositiveInt("PUBLIC_BOT_FILL_MS", 30_000),
  publicQueueTickMs: readPositiveInt("PUBLIC_QUEUE_TICK_MS", 1_000),
  introLockMs: readPositiveInt("INTRO_LOCK_MS", 2_400),
  cleanupIntervalMs: readPositiveInt("CLEANUP_INTERVAL_MS", 30_000),
  rateLimitTtlMs: readPositiveInt("RATE_LIMIT_TTL_MS", 10 * 60_000),
  maxRoomsPerSocket: readPositiveInt("MAX_ROOMS_PER_SOCKET", 3),
  maxQueuePerIp: readPositiveInt("MAX_QUEUE_PER_IP", 4)
};

const app = express();
const server = http.createServer(app);
let io = new Server(server, {
  cors: {
    origin: config.corsOrigin,
    methods: ["GET", "POST"]
  }
});
const registeredSocketServers = new WeakSet();

const rooms = new Map();
const queue = new Map();
const socketIndex = new Map();
const rateLimits = new Map();

const DISCONNECT_GRACE_MS = config.disconnectGraceMs;
const ROOM_IDLE_MS = config.roomIdleMs;
const FINISHED_ROOM_TTL_MS = config.finishedRoomTtlMs;
const PUBLIC_START_DELAY_MS = config.publicStartDelayMs;
const PUBLIC_STILL_SEARCHING_MS = config.publicStillSearchingMs;
const PUBLIC_BOT_FILL_SOON_MS = config.publicBotFillSoonMs;
const PUBLIC_BOT_FILL_MS = config.publicBotFillMs;
const PUBLIC_QUEUE_TICK_MS = config.publicQueueTickMs;
const INTRO_LOCK_MS = config.introLockMs;
const CLEANUP_INTERVAL_MS = config.cleanupIntervalMs;
const PUBLIC_MODES = new Set(["any", "classic", "royale", "quickRush", "chaos"]);
const BOT_NAMES = ["Ivory Bot", "Golden Bot", "Marble Bot", "Crown Bot", "Royal Bot", "Ladder Bot", "Serpent Bot", "Dice Bot"];
const BOT_PERSONALITY_IDS = Object.keys(BOT_PERSONALITIES);
const KNOWN_CLIENT_EVENTS = new Set([
  "createRoom",
  "joinRoom",
  "leaveRoom",
  "updateRoomSettings",
  "setReady",
  "fillBots",
  "startMatch",
  "joinPublicQueue",
  "cancelPublicQueue",
  "findNewMatch",
  "requestRoll",
  "usePowerUp",
  "requestRematch",
  "reconnectSession"
]);

function getHealthPayload() {
  return {
    ok: true,
    version,
    rooms: rooms.size,
    queue: queue.size,
    uptime: Math.round(process.uptime())
  };
}

function getStatusPayload() {
  return {
    ok: true,
    online: true,
    version,
    uptime: Math.round((Date.now() - startedAt) / 1000),
    activeRooms: rooms.size,
    queueCount: queue.size,
    publicQueueSearching: getSearchableQueueEntries().length
  };
}

app.get("/health", (_req, res) => {
  res.json(getHealthPayload());
});

app.get("/status", (_req, res) => {
  res.json(getStatusPayload());
});

app.use(express.static(distDir));
app.use((_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

function registerSocketHandlers(socketServer) {
  if (!socketServer || registeredSocketServers.has(socketServer)) {
    return;
  }

  registeredSocketServers.add(socketServer);
  socketServer.on("connection", (socket) => {
  socket.emit("serverHello", { socketId: socket.id });
  socket.onAny((eventName) => {
    if (!KNOWN_CLIENT_EVENTS.has(eventName)) {
      log("debug", `[socket] ignored unknown event ${String(eventName)}`, { socketId: socket.id });
    }
  });

  socket.on("createRoom", (payload = {}) => safeHandle(socket, "createRoom", () => createRoom(socket, sanitizePayload(payload)), payload));
  socket.on("joinRoom", (payload = {}) => safeHandle(socket, "joinRoom", () => joinRoom(socket, sanitizePayload(payload)), payload));
  socket.on("leaveRoom", () => safeHandle(socket, "leaveRoom", () => leaveRoom(socket)));
  socket.on("updateRoomSettings", (payload = {}) => safeHandle(socket, "updateRoomSettings", () => updateRoomSettings(socket, sanitizePayload(payload)), payload));
  socket.on("setReady", (payload = {}) => safeHandle(socket, "setReady", () => setReady(socket, sanitizePayload(payload)), payload));
  socket.on("fillBots", () => safeHandle(socket, "fillBots", () => fillBots(socket)));
  socket.on("startMatch", () => safeHandle(socket, "startMatch", () => startMatch(socket)));
  socket.on("joinPublicQueue", (payload = {}) => safeHandle(socket, "joinPublicQueue", () => joinPublicQueue(socket, sanitizePayload(payload)), payload));
  socket.on("cancelPublicQueue", () => safeHandle(socket, "cancelPublicQueue", () => cancelPublicQueue(socket)));
  socket.on("findNewMatch", (payload = {}) => safeHandle(socket, "findNewMatch", () => findNewMatch(socket, sanitizePayload(payload)), payload));
  socket.on("requestRoll", () => safeHandle(socket, "requestRoll", () => requestRoll(socket)));
  socket.on("usePowerUp", (payload = {}) => safeHandle(socket, "usePowerUp", () => usePowerUp(socket, sanitizePayload(payload)), payload));
  socket.on("requestRematch", (payload = {}) => safeHandle(socket, "requestRematch", () => requestRematch(socket, sanitizePayload(payload)), payload));
  socket.on("reconnectSession", (payload = {}) => safeHandle(socket, "reconnectSession", () => reconnectSession(socket, sanitizePayload(payload)), payload));
  socket.on("disconnect", () => handleDisconnect(socket));
  });
}

function getLiveSocket(socketId) {
  return io?.sockets?.get?.(socketId) ?? io?.sockets?.sockets?.get?.(socketId) ?? null;
}

function hasLiveSocket(socketId) {
  return Boolean(getLiveSocket(socketId));
}

function safeHandle(socket, eventName, handler, payload = {}) {
  try {
    if (socket.disconnected) return;
    if (payload !== undefined && !isPlainObject(payload)) {
      log("warn", `[socket:${eventName}] rejected malformed payload`, { socketId: socket.id });
      socket.emit("errorMessage", { message: "Invalid request payload." });
      return;
    }
    if (!allowAction(socket.id, eventName)) {
      log("debug", `[socket:${eventName}] rate limited`, { socketId: socket.id });
      socket.emit("errorMessage", { message: "Slow down for a moment." });
      return;
    }
    handler();
  } catch (error) {
    log("error", `[socket:${eventName}] ${error?.message || "handler failed"}`, { socketId: socket.id });
    socket.emit("errorMessage", { message: "Something went wrong. Please try again." });
  }
}

function createRoom(socket, payload) {
  const name = sanitizePlayerName(payload.name, "");
  if (!name) return emitError(socket, "Name required.");
  leaveRoom(socket, { silent: true });
  cancelPublicQueue(socket, { silent: true });
  const settings = normalizeOnlineSettings(payload);
  const room = {
    code: createRoomCode(),
    type: "private",
    status: "lobby",
    maxPlayers: settings.playerCount,
    settings,
    hostId: "",
    players: [],
    match: null,
    rematchVotes: new Map(),
    timers: new Set(),
    replacedSessions: new Map(),
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  const host = createSeat(socket, name, 0, { isHost: true });
  room.hostId = host.id;
  room.players.push(host);
  rooms.set(room.code, room);
  attachSocketToSeat(socket, room, host);
  socket.emit("roomCreated", { roomCode: room.code, playerId: host.id, sessionToken: host.sessionToken });
  broadcastLobby(room);
  log("info", `[room] created ${room.code}`);
}

function joinRoom(socket, payload) {
  const name = sanitizePlayerName(payload.name, "");
  const code = normalizeRoomCode(payload.roomCode);
  if (!name) return emitError(socket, "Name required.");
  if (!code) return emitError(socket, "Invalid room code.");
  leaveRoom(socket, { silent: true });
  cancelPublicQueue(socket, { silent: true });
  const room = rooms.get(code);
  if (!room) return emitError(socket, "Room not found or expired.");
  if (room.status !== "lobby") return emitError(socket, "This match has already started.");
  if (room.players.filter((player) => player.type !== "bot").some((player) => player.socketId === socket.id)) {
    return emitError(socket, "You are already in this room.");
  }
  const activeSeats = room.players.filter((player) => player.connected !== false || player.type === "bot");
  if (activeSeats.length >= room.maxPlayers) return emitError(socket, "Room is full.");

  const seat = createSeat(socket, name, room.players.length);
  room.players.push(seat);
  attachSocketToSeat(socket, room, seat);
  socket.emit("roomJoined", { roomCode: room.code, playerId: seat.id, sessionToken: seat.sessionToken });
  broadcastLobby(room);
}

function updateRoomSettings(socket, payload) {
  const context = getSocketRoom(socket);
  if (!context) return emitError(socket, "You are not in a room.");
  const { room, seat } = context;
  if (room.status !== "lobby") return emitError(socket, "Settings are locked after the match starts.");
  if (room.hostId !== seat.id) return emitError(socket, "Only the host can change settings.");
  room.settings = normalizeOnlineSettings({ ...room.settings, ...payload });
  room.maxPlayers = room.settings.playerCount;
  room.players = room.players.slice(0, room.maxPlayers);
  transferHostIfNeeded(room);
  touchRoom(room);
  broadcastLobby(room);
}

function setReady(socket, payload) {
  const context = getSocketRoom(socket);
  if (!context) return emitError(socket, "You are not in a room.");
  const { room, seat } = context;
  if (room.status !== "lobby") return;
  if (seat.id === room.hostId) {
    seat.ready = true;
  } else {
    seat.ready = Boolean(payload.ready);
  }
  touchRoom(room);
  broadcastLobby(room);
}

function fillBots(socket) {
  const context = getSocketRoom(socket);
  if (!context) return emitError(socket, "You are not in a room.");
  const { room, seat } = context;
  if (room.hostId !== seat.id) return emitError(socket, "Only the host can fill bot seats.");
  if (room.status !== "lobby") return emitError(socket, "Bots can only be added in lobby.");
  while (room.players.length < room.maxPlayers) {
    room.players.push(createBotSeat(room, room.players.length));
  }
  touchRoom(room);
  broadcastLobby(room);
}

function startMatch(socket, { countdown = 0 } = {}) {
  const context = getSocketRoom(socket);
  if (!context) return emitError(socket, "You are not in a room.");
  const { room, seat } = context;
  if (room.type === "private" && seat.id !== room.hostId) return emitError(socket, "Only the host can start.");
  if (room.status === "countdown") return emitError(socket, "Match is already starting.");
  if (room.status !== "lobby") return emitError(socket, "Match already started.");
  if (room.players.length < 2) return emitError(socket, "At least two players are required.");
  if (room.players.filter((player) => player.type !== "bot" && player.connected).length < 1) return emitError(socket, "At least one connected player is required.");

  const notReady = room.players.filter((player) => player.type !== "bot" && player.id !== room.hostId && !player.ready);
  if (room.type === "private" && notReady.length) return emitError(socket, "All players must be ready.");

  const begin = () => {
    if (!rooms.has(room.code) || (room.status !== "lobby" && room.status !== "countdown")) return;
    clearStartTimer(room);
    clearBotTimer(room);
    room.status = "playing";
    room.match = createMatchState({ players: room.players, settings: room.settings });
    room.match.inputLockedUntil = Date.now() + INTRO_LOCK_MS;
    room.rematchVotes.clear();
    touchRoom(room);
    const snapshot = getMatchSnapshot(room.match, room);
    io.to(room.code).emit("matchStarted", { roomCode: room.code, snapshot, intro: { duration: INTRO_LOCK_MS, rematch: false } });
    io.to(room.code).emit("vsIntroReady", { roomCode: room.code, snapshot });
    io.to(room.code).emit("stateSnapshot", { roomCode: room.code, snapshot });
    scheduleBotIfNeeded(room);
    log("info", `[match] started ${room.code}`);
  };

  if (countdown > 0) {
    room.status = "countdown";
    const timer = setTimeout(begin, countdown);
    room.startTimer = timer;
    room.timers.add(timer);
    io.to(room.code).emit("lobbyState", getLobbyState(room, { countdownMs: countdown }));
  } else {
    begin();
  }
}

function joinPublicQueue(socket, payload) {
  const name = sanitizePlayerName(payload.name, "");
  if (!name) return emitError(socket, "Name required.");
  if (countQueueEntriesForIp(socket) >= config.maxQueuePerIp && !queue.has(socket.id)) {
    return emitError(socket, "Too many public searches from this connection.");
  }
  leaveRoom(socket, { silent: true });
  cancelPublicQueue(socket, { silent: true });
  const preferredPlayerCount = normalizeQueuePlayerCount(payload.preferredPlayerCount);
  const preferredModeId = normalizeQueueMode(payload.preferredModeId);
  const entry = {
    socketId: socket.id,
    name,
    preferredPlayerCount,
    preferredModeId,
    allowBotFill: payload.allowBotFill !== false,
    joinedAt: Date.now(),
    status: "searching",
    matchedRoomCode: "",
    ip: getSocketIp(socket)
  };
  queue.set(socket.id, entry);
  socket.emit("queueState", getQueueState(entry));
  log("info", `[queue] joined ${socket.id}`, { preferredPlayerCount, preferredModeId, allowBotFill: entry.allowBotFill });
  processPublicQueue();
}

function cancelPublicQueue(socket, options = {}) {
  const entry = queue.get(socket.id);
  if (entry?.status === "creatingRoom" || entry?.status === "matched") {
    if (!options.silent) emitError(socket, "Match already found. Use Quit Match to leave.");
    return;
  }
  if (queue.delete(socket.id) && !options.silent) {
    socket.emit("queueState", { active: false, message: "Search cancelled." });
    log("info", `[queue] canceled ${socket.id}`);
    processPublicQueue();
    return;
  }
  if (!options.silent && getSocketRoom(socket)) {
    emitError(socket, "Match already found. Use Quit Match to leave.");
  }
}

function findNewMatch(socket, payload) {
  leaveRoom(socket, { silent: true });
  joinPublicQueue(socket, payload);
}

function processPublicQueue() {
  cleanupQueueSockets();
  const entries = getSearchableQueueEntries();
  const used = new Set();

  for (const entry of entries) {
    if (used.has(entry.socketId) || entry.status !== "searching") continue;
    const group = buildCompatibleQueueGroup(entry, entries.filter((candidate) => !used.has(candidate.socketId)));
    const targetCount = resolveQueueTargetCount(group);
    if (group.length < targetCount) continue;
    const selected = group.slice(0, targetCount);
    if (createPublicRoomFromQueue(selected, { botFilled: false, targetCount })) {
      selected.forEach((candidate) => used.add(candidate.socketId));
    }
  }

  const remaining = getSearchableQueueEntries().filter((entry) => !used.has(entry.socketId));
  for (const entry of remaining) {
    if (used.has(entry.socketId) || entry.status !== "searching" || !entry.allowBotFill) continue;
    if (Date.now() - entry.joinedAt < PUBLIC_BOT_FILL_MS) continue;
    const group = buildCompatibleQueueGroup(entry, remaining.filter((candidate) => !used.has(candidate.socketId)));
    const targetCount = resolveQueueTargetCount(group);
    const selected = group.slice(0, targetCount);
    if (createPublicRoomFromQueue(selected, { botFilled: true, targetCount })) {
      selected.forEach((candidate) => used.add(candidate.socketId));
    }
  }

  emitQueueStates();
}

function requestRoll(socket) {
  const context = getSocketRoom(socket);
  if (!context) return emitError(socket, "You are not in a match.");
  const { room, seat } = context;
  if (!room.match || room.status !== "playing") return emitError(socket, "Match has not started.");
  if (Date.now() < (room.match.inputLockedUntil || 0)) return emitError(socket, "Match intro is still finishing.");
  if (room.match.isResolving) return emitError(socket, "Wait for the current move to finish.");
  if (getCurrentPlayer(room.match)?.id !== seat.id) return emitError(socket, "It is not your turn.");
  if (seat.connected === false) return emitError(socket, "Reconnect before rolling.");
  resolveAndBroadcastRoll(room, seat.id);
}

function usePowerUp(socket, payload) {
  const context = getSocketRoom(socket);
  if (!context) return emitError(socket, "You are not in a match.");
  const { room, seat } = context;
  if (!room.match || room.status !== "playing") return emitError(socket, "Match has not started.");
  if (Date.now() < (room.match.inputLockedUntil || 0)) return emitError(socket, "Match intro is still finishing.");
  if (seat.connected === false) return emitError(socket, "Reconnect before using a power-up.");
  const result = applyMatchPowerUp(room.match, seat.id, payload);
  if (!result.ok) return emitError(socket, result.error);
  touchRoom(room);
  io.to(room.code).emit("movementSequence", { roomCode: room.code, sequence: result.sequence, events: result.events, snapshot: getMatchSnapshot(room.match, room) });
  io.to(room.code).emit("stateSnapshot", { roomCode: room.code, snapshot: getMatchSnapshot(room.match, room) });
}

function requestRematch(socket, payload) {
  const context = getSocketRoom(socket);
  if (!context) return emitError(socket, "You are not in a room.");
  const { room, seat } = context;
  if (room.status !== "finished" && room.match?.gameStatus !== "won") return emitError(socket, "Rematch is available after the match ends.");
  const vote = payload.vote === "leave" ? "leave" : payload.vote === "rematch" ? "rematch" : "";
  if (!vote) return emitError(socket, "Invalid rematch vote.");
  room.rematchVotes.set(seat.id, vote);
  touchRoom(room);
  io.to(room.code).emit("rematchState", getRematchState(room));
  const activeHumans = room.players.filter((player) => player.type !== "bot" && player.connected !== false);
  if (activeHumans.length && activeHumans.every((player) => room.rematchVotes.get(player.id) === "rematch")) {
    clearBotTimer(room);
    clearStartTimer(room);
    room.status = "playing";
    room.match = resetMatchState(room.match, room.players);
    room.match.inputLockedUntil = Date.now() + Math.round(INTRO_LOCK_MS * 0.72);
    room.rematchVotes.clear();
    const snapshot = getMatchSnapshot(room.match, room);
    io.to(room.code).emit("matchStarted", { roomCode: room.code, snapshot, intro: { duration: Math.round(INTRO_LOCK_MS * 0.72), rematch: true } });
    io.to(room.code).emit("stateSnapshot", { roomCode: room.code, snapshot });
    scheduleBotIfNeeded(room);
    log("info", `[match] rematch started ${room.code}`);
  }
}

function reconnectSession(socket, payload) {
  const roomCode = normalizeRoomCode(payload.roomCode);
  const playerId = String(payload.playerId || "");
  const sessionToken = String(payload.sessionToken || "");
  if (!roomCode || !playerId || !sessionToken) return emitError(socket, "Reconnect session was not found.");
  const room = rooms.get(roomCode);
  if (!room) return emitError(socket, "Match expired.");
  if (room.status === "closed") return emitError(socket, "Match expired.");
  const reconnectKey = `${playerId}:${sessionToken}`;
  if (room.replacedSessions?.has(reconnectKey)) {
    return emitError(socket, "Seat was replaced by bot. Find a new match or return to the main menu.");
  }
  const seat = room.players.find((player) => player.id === playerId && player.sessionToken === sessionToken);
  if (!seat) return emitError(socket, "Reconnect session was not found.");
  leaveRoom(socket, { silent: true });
  cancelPublicQueue(socket, { silent: true });
  attachSocketToSeat(socket, room, seat);
  seat.connected = true;
  clearTimeout(seat.disconnectTimer);
  seat.disconnectTimer = null;
  touchRoom(room);
  socket.emit("roomJoined", { roomCode: room.code, playerId: seat.id, sessionToken: seat.sessionToken });
  io.to(room.code).emit("playerReconnected", { playerId: seat.id, name: seat.name });
  if (room.match) socket.emit("stateSnapshot", { roomCode: room.code, snapshot: getMatchSnapshot(room.match, room) });
  broadcastLobby(room);
}

function resolveAndBroadcastRoll(room, playerId) {
  if (!rooms.has(room.code) || room.status !== "playing" || !room.match) return;
  if (room.type === "public" && countConnectedHumans(room) < 1) {
    closeRoom(room, "All real players left. Public match closed.");
    return;
  }
  const result = resolveMatchRoll(room.match, playerId);
  if (!result.ok) {
    const seat = room.players.find((player) => player.id === playerId);
    const socket = seat?.socketId ? getLiveSocket(seat.socketId) : null;
    socket?.emit("errorMessage", { message: result.error });
    return;
  }
  touchRoom(room);
  io.to(room.code).emit("diceRolled", { roomCode: room.code, playerId, result: result.diceResult });
  io.to(room.code).emit("movementSequence", { roomCode: room.code, sequence: result.sequence, events: result.events, snapshot: getMatchSnapshot(room.match, room) });
  result.events.forEach((event) => io.to(room.code).emit("gameEvent", { roomCode: room.code, ...event }));
  io.to(room.code).emit("turnChanged", { roomCode: room.code, currentPlayerIndex: room.match.currentPlayerIndex });
  const snapshot = getMatchSnapshot(room.match, room);
  io.to(room.code).emit("stateSnapshot", { roomCode: room.code, snapshot });
  if (room.match.gameStatus === "won") {
    room.status = "finished";
    io.to(room.code).emit("matchEnded", { roomCode: room.code, snapshot });
    log("info", `[match] ended ${room.code}`);
    return;
  }
  scheduleBotIfNeeded(room);
}

function scheduleBotIfNeeded(room) {
  clearBotTimer(room);
  if (!rooms.has(room.code) || room.status !== "playing") return;
  if (room.type === "public" && countConnectedHumans(room) < 1) {
    closeRoom(room, "All real players left. Public match closed.");
    return;
  }
  if (!room.match || room.match.gameStatus !== "playing") return;
  if (Date.now() < (room.match.inputLockedUntil || 0)) {
    const timer = setTimeout(() => scheduleBotIfNeeded(room), Math.max(120, room.match.inputLockedUntil - Date.now()));
    room.botTimer = timer;
    room.timers.add(timer);
    return;
  }
  const player = getCurrentPlayer(room.match);
  if (!player || player.type !== "bot") return;
  const timer = setTimeout(() => {
    if (!rooms.has(room.code) || room.match?.gameStatus !== "playing") return;
    if (room.type === "public" && countConnectedHumans(room) < 1) {
      closeRoom(room, "All real players left. Public match closed.");
      return;
    }
    resolveAndBroadcastRoll(room, player.id);
  }, getBotDelay(player.personality));
  room.botTimer = timer;
  room.timers.add(timer);
}

function replaceSeatWithBot(room, seat, reason = "disconnect") {
  const index = room.players.findIndex((player) => player.id === seat.id);
  if (index < 0 || seat.type === "bot") return null;
  const replacement = createBotSeat(room, index);
  replacement.id = seat.id;
  room.replacedSessions = room.replacedSessions || new Map();
  room.replacedSessions.set(`${seat.id}:${seat.sessionToken}`, { at: Date.now(), reason });
  room.players[index] = replacement;
  if (room.hostId === seat.id) {
    room.hostId = "";
    transferHostIfNeeded(room);
  }

  if (room.match?.players?.[index]) {
    const matchPlayer = room.match.players[index];
    matchPlayer.name = replacement.name;
    matchPlayer.type = "bot";
    matchPlayer.personality = replacement.personality;
    matchPlayer.displayBadges = ["BOT"];
    matchPlayer.connected = true;
    matchPlayer.isHost = false;
    if (room.match.matchStats?.players?.[index]) {
      room.match.matchStats.players[index].name = replacement.name;
      room.match.matchStats.players[index].type = "bot";
    }
    addMatchLog(room.match, `${seat.name} was replaced by ${replacement.name}.`, "bot", { playerId: replacement.id });
  }

  io.to(room.code).emit("playerReplacedByBot", { roomCode: room.code, playerId: seat.id, botName: replacement.name });
  log("info", `[bot] replaced disconnected player in ${room.code}`, { playerId: seat.id, botName: replacement.name, reason });
  broadcastLobby(room);
  if (room.match) {
    const snapshot = getMatchSnapshot(room.match, room);
    io.to(room.code).emit("stateSnapshot", { roomCode: room.code, snapshot });
  }
  scheduleBotIfNeeded(room);
  return replacement;
}

function countConnectedHumans(room) {
  return room.players.filter((player) => player.type !== "bot" && player.connected && player.socketId).length;
}

function handleDisconnect(socket) {
  cancelPublicQueue(socket, { silent: true });
  const context = getSocketRoom(socket);
  if (!context) return;
  const { room, seat } = context;
  seat.connected = false;
  seat.socketId = null;
  socketIndex.delete(socket.id);
  touchRoom(room);
  io.to(room.code).emit("playerDisconnected", { playerId: seat.id, name: seat.name });
  log("info", `[socket] disconnected from ${room.code}`, { playerId: seat.id });
  broadcastLobby(room);
  const timer = setTimeout(() => {
    if (!rooms.has(room.code)) return;
    if (seat.connected) return;
    if (room.status === "lobby") {
      room.players = room.players.filter((player) => player.id !== seat.id);
      transferHostIfNeeded(room);
      touchRoom(room);
      if (!room.players.length) closeRoom(room, "Room closed.");
      else broadcastLobby(room);
      return;
    }
    if (room.type === "public") {
      if (countConnectedHumans(room) < 1) {
        closeRoom(room, "All real players left. Public match closed.");
        return;
      }
      replaceSeatWithBot(room, seat, "disconnect");
    } else {
      addMatchLog(room.match, `${seat.name} disconnected.`, "warning", { playerId: seat.id });
      touchRoom(room);
      io.to(room.code).emit("stateSnapshot", { roomCode: room.code, snapshot: getMatchSnapshot(room.match, room) });
    }
  }, DISCONNECT_GRACE_MS);
  seat.disconnectTimer = timer;
  room.timers.add(timer);
}

function leaveRoom(socket, options = {}) {
  const context = getSocketRoom(socket);
  if (!context) return;
  const { room, seat } = context;
  socket.leave(room.code);
  socketIndex.delete(socket.id);
  clearTimeout(seat.disconnectTimer);
  if (seat.disconnectTimer) room.timers?.delete(seat.disconnectTimer);
  seat.disconnectTimer = null;
  if (room.status === "lobby") {
    room.players = room.players.filter((player) => player.id !== seat.id);
    transferHostIfNeeded(room);
    touchRoom(room);
    if (!room.players.length) closeRoom(room, "Room closed.");
    else broadcastLobby(room);
  } else {
    seat.connected = false;
    seat.socketId = null;
    touchRoom(room);
    if (!options.silent) io.to(room.code).emit("playerDisconnected", { playerId: seat.id, name: seat.name });
    if (room.type === "public" && countConnectedHumans(room) < 1) {
      closeRoom(room, "All real players left. Public match closed.");
    }
  }
  if (!options.silent) socket.emit("roomClosed", { message: "You left the room." });
}

function closeRoom(room, message) {
  if (room.status === "closed") return;
  room.status = "closed";
  clearRoomTimers(room);
  cleanupQueueForRoom(room.code);
  io.to(room.code).emit("roomClosed", { roomCode: room.code, message });
  io.in(room.code).socketsLeave(room.code);
  room.players.forEach((player) => {
    if (player.socketId) socketIndex.delete(player.socketId);
  });
  rooms.delete(room.code);
  log("info", `[room] closed ${room.code}`, { message });
}

function broadcastLobby(room, extra = {}) {
  io.to(room.code).emit("lobbyState", getLobbyState(room, extra));
}

function getLobbyState(room, extra = {}) {
  return {
    roomCode: room.code,
    roomType: room.type,
    botFilled: Boolean(room.botFilled),
    status: room.status,
    maxPlayers: room.maxPlayers,
    hostId: room.hostId,
    settings: room.settings,
    players: room.players.map((player) => ({
      id: player.id,
      name: player.name,
      type: player.type,
      personality: player.personality,
      connected: player.connected !== false,
      ready: player.ready || player.id === room.hostId || player.type === "bot",
      isHost: player.id === room.hostId
    })),
    ...extra
  };
}

function getRematchState(room) {
  return {
    roomCode: room.code,
    votes: Object.fromEntries(room.rematchVotes),
    players: room.players.map((player) => ({
      id: player.id,
      name: player.name,
      vote: room.rematchVotes.get(player.id) || ""
    }))
  };
}

function getQueueState(entry, message) {
  const elapsedMs = Date.now() - entry.joinedAt;
  const compatible = buildCompatibleQueueGroup(entry, getSearchableQueueEntries());
  const targetPlayerCount = resolveQueueTargetCount(compatible);
  const botFillInMs = entry.allowBotFill ? Math.max(0, PUBLIC_BOT_FILL_MS - elapsedMs) : null;
  return {
    active: true,
    message: message || getQueueMessage(entry, elapsedMs),
    status: getQueueStatus(entry, elapsedMs),
    elapsedMs,
    preferredPlayerCount: entry.preferredPlayerCount,
    preferredModeId: entry.preferredModeId,
    allowBotFill: entry.allowBotFill,
    targetPlayerCount,
    playersFound: Math.min(compatible.length, targetPlayerCount),
    botFillInMs,
    queueSize: queue.size
  };
}

function createSeat(socket, name, index, overrides = {}) {
  return {
    id: createId("player"),
    name: sanitizePlayerName(name, `Player ${index + 1}`),
    type: overrides.type || "human",
    personality: overrides.personality || null,
    socketId: socket.id,
    sessionToken: createToken(),
    connected: true,
    ready: Boolean(overrides.ready || overrides.isHost),
    isHost: Boolean(overrides.isHost),
    status: createPlayerStatus()
  };
}

function createBotSeat(room, index) {
  const baseName = BOT_NAMES[index % BOT_NAMES.length] || `Royal Bot`;
  const existingNames = new Set(room.players.map((player) => player.name));
  let name = baseName;
  let suffix = 2;
  while (existingNames.has(name)) {
    name = `${baseName} ${suffix}`;
    suffix += 1;
  }
  return {
    id: createId("bot"),
    name,
    type: "bot",
    personality: BOT_PERSONALITY_IDS[index % BOT_PERSONALITY_IDS.length] || "calm",
    socketId: null,
    sessionToken: "",
    connected: true,
    ready: true,
    isHost: false,
    status: createPlayerStatus()
  };
}

function getQueueStatus(entry, elapsedMs) {
  if (entry.status !== "searching") return entry.status;
  if (!entry.allowBotFill) return "realPlayersOnly";
  if (elapsedMs >= PUBLIC_BOT_FILL_MS) return "addingBots";
  if (elapsedMs >= PUBLIC_BOT_FILL_SOON_MS) return "botFillSoon";
  if (elapsedMs >= PUBLIC_STILL_SEARCHING_MS) return "stillSearching";
  return "searching";
}

function getQueueMessage(entry, elapsedMs) {
  if (!entry.allowBotFill) return "Waiting for real players only. You can enable bot fill for a faster match.";
  if (elapsedMs >= PUBLIC_BOT_FILL_MS) return "Adding royal bots to start the match...";
  if (elapsedMs >= PUBLIC_BOT_FILL_SOON_MS) return "No players yet, royal bots may join soon.";
  if (elapsedMs >= PUBLIC_STILL_SEARCHING_MS) return "Still searching for royal challengers...";
  return "Finding royal challengers...";
}

function attachSocketToSeat(socket, room, seat) {
  seat.socketId = socket.id;
  seat.connected = true;
  socket.join(room.code);
  socketIndex.set(socket.id, { roomCode: room.code, playerId: seat.id });
  socket.data.roomCode = room.code;
  socket.data.playerId = seat.id;
  socket.data.sessionToken = seat.sessionToken;
}

function getSocketRoom(socket) {
  const entry = socketIndex.get(socket.id);
  if (!entry) return null;
  const room = rooms.get(entry.roomCode);
  if (!room) return null;
  const seat = room.players.find((player) => player.id === entry.playerId);
  if (!seat) return null;
  return { room, seat };
}

function transferHostIfNeeded(room) {
  if (room.players.some((player) => player.id === room.hostId)) return;
  const next = room.players.find((player) => player.type !== "bot");
  room.hostId = next?.id || room.players[0]?.id || "";
  room.players.forEach((player) => {
    player.isHost = player.id === room.hostId;
    if (player.isHost) player.ready = true;
  });
}

function createPublicRoomFromQueue(entries, { botFilled, targetCount }) {
  const selected = entries
    .filter((entry) => queue.get(entry.socketId) === entry && entry.status === "searching")
    .filter((entry) => hasLiveSocket(entry.socketId));
  if (!selected.length) return null;
  if (!botFilled && selected.length < targetCount) return null;
  if (!lockQueueEntries(selected, "creatingRoom")) return null;

  const modeId = resolveQueueMode(selected);
  const settings = normalizeOnlineSettings({ modeId, playerCount: targetCount });
  const room = {
    code: createRoomCode(),
    type: "public",
    botFilled,
    status: "lobby",
    maxPlayers: targetCount,
    settings,
    hostId: "",
    players: [],
    match: null,
    rematchVotes: new Map(),
    timers: new Set(),
    replacedSessions: new Map(),
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  selected.forEach((entry, index) => {
    const socket = getLiveSocket(entry.socketId);
    if (!socket) return;
    const seat = createSeat(socket, entry.name, index, { ready: true });
    if (!room.hostId) room.hostId = seat.id;
    seat.isHost = seat.id === room.hostId;
    room.players.push(seat);
  });

  while (room.players.length < targetCount) {
    room.players.push(createBotSeat(room, room.players.length));
  }

  if (!room.players.some((player) => player.type !== "bot")) {
    selected.forEach((entry) => {
      queue.delete(entry.socketId);
    });
    log("debug", "[queue] discarded bot-filled room with no real players");
    return null;
  }
  rooms.set(room.code, room);
  selected.forEach((entry) => {
    entry.status = "matched";
    entry.matchedRoomCode = room.code;
    queue.delete(entry.socketId);
  });

  room.players.filter((player) => player.type !== "bot").forEach((seat) => {
    const socket = getLiveSocket(seat.socketId);
    if (!socket) return;
    attachSocketToSeat(socket, room, seat);
    socket.emit("roomJoined", { roomCode: room.code, playerId: seat.id, sessionToken: seat.sessionToken });
    socket.emit("matchFound", { roomCode: room.code, playerId: seat.id, sessionToken: seat.sessionToken, botFilled });
  });

  const hostSocket = getLiveSocket(room.players.find((player) => player.id === room.hostId)?.socketId);
  if (hostSocket) startMatch(hostSocket, { countdown: PUBLIC_START_DELAY_MS });
  log("info", `[queue] public match ${room.code} created`, { seats: room.players.length, targetCount, botFilled, modeId });
  return room;
}

function lockQueueEntries(entries, status) {
  if (!entries.every((entry) => queue.get(entry.socketId) === entry && entry.status === "searching")) return false;
  entries.forEach((entry) => {
    entry.status = status;
  });
  return true;
}

function getSearchableQueueEntries() {
  return [...queue.values()]
    .filter((entry) => entry.status === "searching")
    .filter((entry) => hasLiveSocket(entry.socketId))
    .sort((a, b) => a.joinedAt - b.joinedAt);
}

function cleanupQueueSockets() {
  [...queue.values()].forEach((entry) => {
    if (!hasLiveSocket(entry.socketId)) {
      queue.delete(entry.socketId);
      log("debug", `[queue] removed stale entry ${entry.socketId}`);
    }
  });
}

function cleanupQueueForRoom(roomCode) {
  [...queue.values()].forEach((entry) => {
    if (entry.matchedRoomCode === roomCode) queue.delete(entry.socketId);
  });
}

function buildCompatibleQueueGroup(seed, candidates) {
  const group = [seed];
  candidates
    .filter((candidate) => candidate.socketId !== seed.socketId)
    .sort((a, b) => a.joinedAt - b.joinedAt)
    .forEach((candidate) => {
      if (group.every((member) => compatibleQueue(member, candidate))) group.push(candidate);
    });
  return group;
}

function resolveQueueTargetCount(group) {
  const exact = group.map((entry) => entry.preferredPlayerCount).find((value) => value !== "any");
  return exact || 2;
}

function resolveQueueMode(group) {
  const exact = group.map((entry) => entry.preferredModeId).find((value) => value !== "any");
  return exact || "classic";
}

function emitQueueStates() {
  getSearchableQueueEntries().forEach((entry) => {
    const socket = getLiveSocket(entry.socketId);
    socket?.emit("queueState", getQueueState(entry));
  });
}

function compatibleQueue(a, b) {
  const countOk = a.preferredPlayerCount === "any" || b.preferredPlayerCount === "any" || a.preferredPlayerCount === b.preferredPlayerCount;
  const modeOk = a.preferredModeId === "any" || b.preferredModeId === "any" || a.preferredModeId === b.preferredModeId;
  return countOk && modeOk;
}

function countQueueEntriesForIp(socket) {
  const ip = getSocketIp(socket);
  return [...queue.values()].filter((entry) => entry.ip === ip).length;
}

function getSocketIp(socket) {
  return String(socket.handshake.headers["x-forwarded-for"] || socket.handshake.address || "unknown").split(",")[0].trim();
}

function normalizeQueuePlayerCount(value) {
  if (value === "any") return "any";
  return Math.min(4, Math.max(2, Number(value) || 2));
}

function normalizeQueueMode(value) {
  const modeId = String(value || "any");
  return PUBLIC_MODES.has(modeId) ? modeId : "any";
}

function clearBotTimer(room) {
  if (room.botTimer) {
    clearTimeout(room.botTimer);
    room.timers.delete(room.botTimer);
    room.botTimer = null;
  }
}

function clearStartTimer(room) {
  if (room.startTimer) {
    clearTimeout(room.startTimer);
    room.timers.delete(room.startTimer);
    room.startTimer = null;
  }
}

function clearRoomTimers(room) {
  room.timers?.forEach((timer) => clearTimeout(timer));
  room.timers?.clear();
  room.botTimer = null;
  room.startTimer = null;
}

function touchRoom(room) {
  room.updatedAt = Date.now();
}

function allowAction(socketId, eventName) {
  const key = `${socketId}:${eventName}`;
  const now = Date.now();
  const previous = rateLimits.get(key) || 0;
  const minGap = eventName === "requestRoll" ? 450 : 120;
  if (now - previous < minGap) return false;
  rateLimits.set(key, now);
  return true;
}

function emitError(socket, message) {
  socket.emit("errorMessage", { message });
}

function sanitizePayload(payload) {
  return isPlainObject(payload) ? payload : {};
}

function isPlainObject(value) {
  return value === undefined || (Boolean(value) && typeof value === "object" && !Array.isArray(value));
}

function normalizeRoomCode(code) {
  return String(code || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
}

function createRoomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  do {
    code = Array.from({ length: 5 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
  } while (rooms.has(code));
  return code;
}

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function createToken() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

function cleanupRateLimits(now = Date.now()) {
  let removed = 0;
  rateLimits.forEach((timestamp, key) => {
    if (now - timestamp > config.rateLimitTtlMs) {
      rateLimits.delete(key);
      removed += 1;
    }
  });
  if (removed) log("debug", `[cleanup] removed ${removed} stale rate-limit entries`);
}

function readPositiveInt(key, fallback) {
  const value = Number(process.env[key]);
  if (!Number.isFinite(value) || value <= 0) return fallback;
  return Math.round(value);
}

function normalizeLogLevel(value) {
  const level = String(value || "").toLowerCase();
  return ["silent", "error", "warn", "info", "debug"].includes(level) ? level : "info";
}

function log(level, message, meta = null) {
  const ranks = { silent: 0, error: 1, warn: 2, info: 3, debug: 4 };
  if ((ranks[config.logLevel] ?? 3) < (ranks[level] ?? 3)) return;
  const method = level === "error" ? "error" : level === "warn" ? "warn" : "log";
  if (meta && Object.keys(meta).length) {
    console[method](message, meta);
  } else {
    console[method](message);
  }
}

process.on("unhandledRejection", (reason) => {
  log("error", `[server] unhandled rejection: ${reason?.message || reason}`);
});

process.on("uncaughtException", (error) => {
  log("error", `[server] uncaught exception: ${error?.message || error}`);
});

const queueInterval = setInterval(() => {
  processPublicQueue();
}, PUBLIC_QUEUE_TICK_MS);
queueInterval.unref?.();

const cleanupInterval = setInterval(() => {
  const now = Date.now();
  cleanupQueueSockets();
  cleanupRateLimits(now);
  [...rooms.values()].forEach((room) => {
    if (room.status === "closed") return;
    const humans = room.players.filter((player) => player.type !== "bot");
    const connected = humans.filter((player) => player.connected && player.socketId);
    if (!connected.length && now - room.updatedAt > 10_000) {
      closeRoom(room, "Room expired.");
      return;
    }
    if ((room.status === "finished" || room.match?.gameStatus === "won") && now - room.updatedAt > FINISHED_ROOM_TTL_MS) {
      closeRoom(room, "Finished room expired.");
      return;
    }
    if (now - room.updatedAt > ROOM_IDLE_MS) {
      closeRoom(room, "Room expired from inactivity.");
    }
  });
}, CLEANUP_INTERVAL_MS);
cleanupInterval.unref?.();

let httpServer = null;

function startStandaloneServer() {
  registerSocketHandlers(io);
  httpServer = server.listen(config.port, () => {
    log("info", `[server] 3D Snake & Ladder Royale online server listening on http://localhost:${config.port}`);
  });
}

function shutdown(signal) {
  log("info", `[server] ${signal} received. Closing in-memory rooms.`);
  clearInterval(queueInterval);
  clearInterval(cleanupInterval);
  [...rooms.values()].forEach((room) => closeRoom(room, "Server is shutting down."));
  queue.clear();
  rateLimits.clear();
  if (httpServer) {
    httpServer.close(() => process.exit(0));
  } else {
    process.exit(0);
  }
  setTimeout(() => process.exit(0), 1_500).unref();
}

function registerPremiumSnakeLadderRuntime(options = {}) {
  if (options.io) {
    io = options.io;
    registerSocketHandlers(io);
  }

  if (options.app) {
    options.app.get(options.healthPath || "/health", (_req, res) => {
      res.json(getHealthPayload());
    });
    options.app.get(options.infoPath || "/status", (_req, res) => {
      res.json(getStatusPayload());
    });
  }

  return {
    app: options.app || app,
    io,
    httpServer: options.httpServer || server
  };
}

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
  startStandaloneServer();
  process.once("SIGTERM", () => shutdown("SIGTERM"));
  process.once("SIGINT", () => shutdown("SIGINT"));
}

export { registerPremiumSnakeLadderRuntime };
