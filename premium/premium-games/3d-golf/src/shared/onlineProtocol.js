export const ONLINE_EVENTS = {
  STATUS: 'online:status',
  ERROR: 'online:error',
  ROOM_CREATE: 'room:create',
  ROOM_JOIN: 'room:join',
  ROOM_LEAVE: 'room:leave',
  ROOM_UPDATE: 'room:update',
  PLAYER_READY: 'player:ready',
  MATCH_START: 'match:start',
  MATCH_CREATED: 'match:created',
  MATCH_UPDATE: 'match:update',
  TURN_UPDATE: 'turn:update',
  QUEUE_JOIN: 'queue:join',
  QUEUE_CANCEL: 'queue:cancel',
  QUEUE_UPDATE: 'queue:update',
  SHOT_SUBMIT: 'shot:submit',
  SHOT_ACCEPTED: 'shot:accepted',
  SHOT_REJECTED: 'shot:rejected',
  BALL_SAMPLE: 'ball:sample',
  HOLE_COMPLETE: 'hole:complete',
  HOLE_RESULT: 'hole:result',
  MATCH_COMPLETE: 'match:complete',
  REMATCH_REQUEST: 'rematch:request',
  REMATCH_LEAVE: 'rematch:leave',
  REMATCH_UPDATE: 'rematch:update',
  OPPONENT_LEFT: 'opponent:left'
};

export const MATCH_STATUS = {
  WAITING: 'waiting',
  READY: 'ready',
  PREVIEW: 'preview',
  PLAYING: 'playing',
  PLAYER_TURN: 'player_turn',
  BOT_TURN: 'bot_turn',
  HOLE_COMPLETE: 'hole_complete',
  MATCH_COMPLETE: 'match_complete',
  REMATCH_PENDING: 'rematch_pending',
  CLOSED: 'closed'
};

export const ONLINE_LIMITS = {
  ROOM_CODE_LENGTH: 5,
  DISPLAY_NAME_MAX: 18,
  DISPLAY_NAME_MIN: 2,
  COURSE_LENGTHS_PRIVATE: [3, 6, 12],
  COURSE_LENGTHS_PUBLIC: [3, 6],
  BOT_FILL_MS: 30000,
  ROOM_IDLE_MS: 5 * 60 * 1000,
  MATCH_IDLE_MS: 8 * 60 * 1000,
  FINISHED_MATCH_TTL_MS: 3 * 60 * 1000,
  RECONNECT_MS: 25000,
  SHOT_RATE_MS: 450,
  QUEUE_RATE_MS: 900,
  ROOM_CREATE_RATE_MS: 2500,
  REMATCH_RATE_MS: 1200,
  MAX_PAYLOAD_TEXT: 200
};

export function sanitizeDisplayName(name, fallback = 'Guest Putter') {
  const cleaned = String(name ?? '')
    .replace(/[^\w .-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, ONLINE_LIMITS.DISPLAY_NAME_MAX);
  return cleaned.length >= ONLINE_LIMITS.DISPLAY_NAME_MIN ? cleaned : fallback;
}

export function sanitizeRoomCode(code) {
  return String(code ?? '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, ONLINE_LIMITS.ROOM_CODE_LENGTH);
}

export function isValidRoomCode(code) {
  return /^[A-Z0-9]{5}$/.test(String(code ?? ''));
}

export function normalizeCourseLength(length, allowed = ONLINE_LIMITS.COURSE_LENGTHS_PRIVATE) {
  const value = Number(length);
  return allowed.includes(value) ? value : allowed[0];
}

export function normalizePreference(preference) {
  return ['casual', 'challenge', 'any'].includes(preference) ? preference : 'casual';
}

export function maxShotsForPar(par) {
  return Math.max(8, Number(par) + 5);
}

export function makeClientError(code, message) {
  return { code, message };
}

export function normalizeDirectionPayload(direction) {
  const x = Number(direction?.x);
  const z = Number(direction?.z);
  if (!Number.isFinite(x) || !Number.isFinite(z)) return null;
  const length = Math.hypot(x, z);
  if (length < 0.72 || length > 1.28) return null;
  return { x: x / length, z: z / length };
}

export function scoreRecordTotal(record) {
  return (record?.shots ?? 0) + (record?.penalties ?? 0);
}
