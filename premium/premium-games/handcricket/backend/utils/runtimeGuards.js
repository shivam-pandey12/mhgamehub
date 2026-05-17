const KILOBYTE = 1024;
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

function readIntegerEnv(name, fallback, min, max) {
  const parsed = Number.parseInt(process.env[name] ?? "", 10);
  const value = Number.isFinite(parsed) ? parsed : fallback;
  return Math.max(min, Math.min(max, value));
}

export const HANDREX_RUNTIME_LIMITS = Object.freeze({
  maxRooms: readIntegerEnv("MH_HANDREX_MAX_ROOMS", 500, 10, 5000),
  maxGames: readIntegerEnv("MH_HANDREX_MAX_GAMES", 500, 10, 5000),
  maxOvers: readIntegerEnv("MH_HANDREX_MAX_OVERS", 20, 1, 50),
  maxPlayerNameLength: readIntegerEnv("MH_HANDREX_MAX_PLAYER_NAME_LENGTH", 32, 8, 80),
  maxTeamNameLength: readIntegerEnv("MH_HANDREX_MAX_TEAM_NAME_LENGTH", 32, 8, 80),
  maxPlayerKeyLength: readIntegerEnv("MH_HANDREX_MAX_PLAYER_KEY_LENGTH", 96, 16, 160),
  maxCustomSignalLength: readIntegerEnv("MH_HANDREX_MAX_SIGNAL_LENGTH", 56, 16, 120),
  maxSocketPayloadBytes: readIntegerEnv("MH_HANDREX_MAX_SOCKET_PAYLOAD_BYTES", 16 * KILOBYTE, 4 * KILOBYTE, 128 * KILOBYTE),
  cleanupIntervalMs: readIntegerEnv("MH_HANDREX_CLEANUP_INTERVAL_MS", 60 * SECOND, 10 * SECOND, 15 * MINUTE),
  disconnectGraceMs: readIntegerEnv("MH_HANDREX_DISCONNECT_GRACE_MS", 60 * SECOND, 10 * SECOND, 10 * MINUTE),
  idleRoomTtlMs: readIntegerEnv("MH_HANDREX_IDLE_ROOM_TTL_MS", 2 * HOUR, 5 * MINUTE, 24 * HOUR),
  completedRoomTtlMs: readIntegerEnv("MH_HANDREX_COMPLETED_ROOM_TTL_MS", 30 * MINUTE, 2 * MINUTE, 6 * HOUR),
  idleGameTtlMs: readIntegerEnv("MH_HANDREX_IDLE_GAME_TTL_MS", 2 * HOUR, 10 * MINUTE, 24 * HOUR),
  maxInputTimeoutMs: readIntegerEnv("MH_HANDREX_MAX_INPUT_TIMEOUT_MS", 60 * SECOND, 10 * SECOND, 5 * MINUTE),
});

const EVENT_RATE_LIMITS = new Map([
  ["create_room", { max: 12, windowMs: MINUTE }],
  ["join_room", { max: 24, windowMs: MINUTE }],
  ["resume_session", { max: 36, windowMs: MINUTE }],
  ["update_room_config", { max: 40, windowMs: MINUTE }],
  ["set_player_team", { max: 60, windowMs: MINUTE }],
  ["player_ready", { max: 80, windowMs: MINUTE }],
  ["start_toss", { max: 20, windowMs: MINUTE }],
  ["run_toss", { max: 20, windowMs: MINUTE }],
  ["choose_toss", { max: 20, windowMs: MINUTE }],
  ["start_match", { max: 20, windowMs: MINUTE }],
  ["select_number", { max: 120, windowMs: MINUTE }],
  ["send_signal", { max: 36, windowMs: MINUTE }],
  ["kick_player", { max: 24, windowMs: MINUTE }],
  ["leave_room", { max: 24, windowMs: MINUTE }],
  ["discard_room", { max: 12, windowMs: MINUTE }],
]);

const DEFAULT_EVENT_RATE_LIMIT = { max: 180, windowMs: MINUTE };

export function clampInteger(value, fallback, min, max) {
  const parsed = Number.parseInt(value, 10);
  const normalized = Number.isFinite(parsed) ? parsed : fallback;
  return Math.max(min, Math.min(max, normalized));
}

export function normalizeText(value, fallback = "", maxLength = 64) {
  const normalized = String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

  return normalized || fallback;
}

export function normalizePlayerKey(value, fallback = "") {
  return normalizeText(value, fallback, HANDREX_RUNTIME_LIMITS.maxPlayerKeyLength);
}

export function normalizeRoomCode(value) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 8);
}

export function safeAck(ack, payload) {
  if (typeof ack === "function") {
    ack(payload);
  }
}

export function debugLog(scope, event, payload) {
  if (process.env.NODE_ENV === "production" && process.env.MH_HANDREX_DEBUG !== "1") {
    return;
  }

  console.log(`[${scope}] ${event}`, payload);
}

function estimatePacketBytes(packet) {
  try {
    return Buffer.byteLength(
      JSON.stringify(packet.map((entry) => (typeof entry === "function" ? "[ack]" : entry))),
      "utf8",
    );
  } catch {
    return HANDREX_RUNTIME_LIMITS.maxSocketPayloadBytes + 1;
  }
}

function getRateBucket(socket, eventName, rateLimit) {
  if (!socket.data.handrexRateBuckets) {
    socket.data.handrexRateBuckets = new Map();
  }

  const now = Date.now();
  const bucket = socket.data.handrexRateBuckets.get(eventName) ?? {
    count: 0,
    windowStartedAt: now,
  };

  if (now - bucket.windowStartedAt > rateLimit.windowMs) {
    bucket.count = 0;
    bucket.windowStartedAt = now;
  }

  bucket.count += 1;
  socket.data.handrexRateBuckets.set(eventName, bucket);
  return bucket;
}

export function attachSocketProtections(socket, limits = HANDREX_RUNTIME_LIMITS) {
  socket.use((packet, next) => {
    const eventName = String(packet[0] ?? "");
    const ack = packet.find((entry) => typeof entry === "function");
    const packetBytes = estimatePacketBytes(packet);

    if (packetBytes > limits.maxSocketPayloadBytes) {
      safeAck(ack, {
        ok: false,
        error: "Realtime payload is too large.",
      });
      return;
    }

    const rateLimit = EVENT_RATE_LIMITS.get(eventName) ?? DEFAULT_EVENT_RATE_LIMIT;
    const bucket = getRateBucket(socket, eventName, rateLimit);
    if (bucket.count > rateLimit.max) {
      safeAck(ack, {
        ok: false,
        error: "Too many realtime actions. Please slow down for a moment.",
      });
      return;
    }

    next();
  });
}

export function onSafe(socket, eventName, handler) {
  socket.on(eventName, (...args) => {
    Promise.resolve(handler(...args)).catch((error) => {
      console.error(`[handrex] ${eventName} failed:`, error);
      const ack = args.find((entry) => typeof entry === "function");
      safeAck(ack, {
        ok: false,
        error: "Realtime action failed. Please try again.",
      });
      socket.emit("server_error", {
        event: eventName,
        message: "Realtime action failed. Please try again.",
      });
    });
  });
}
