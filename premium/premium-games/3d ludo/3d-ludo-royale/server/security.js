import { PLAYER_IDS, PLAYER_SETS } from '../src/ludo/constants.js';
import { BOT_DIFFICULTIES, BOT_PERSONALITIES } from '../src/ai/bot.js';

const ROOM_CODE_PATTERN = /^[A-Z2-9-]{4,12}$/;
const DISPLAY_NAME_MAX_LENGTH = 18;
const SESSION_ID_MAX_LENGTH = 80;
const TOKEN_ID_PATTERN = /^(red|blue|green|yellow)-[0-3]$/;

export const BOT_FILL_MODES = Object.freeze(['off', 'after-wait', 'immediate']);
export const MATCH_SPEEDS = Object.freeze(['normal', 'fast']);
export const DEFAULT_MATCHMAKING_PREFERENCES = Object.freeze({
  botFillMode: 'after-wait',
  botDifficulty: 'medium',
  botPersonality: 'balanced',
  matchSpeed: 'normal'
});

export const RATE_LIMIT_PROFILES = Object.freeze({
  default: { windowMs: 5000, limit: 18 },
  roomCreate: { windowMs: 60_000, limit: 8 },
  roomJoin: { windowMs: 60_000, limit: 24 },
  lobby: { windowMs: 5000, limit: 14 },
  queue: { windowMs: 10_000, limit: 12 },
  gameplay: { windowMs: 1000, limit: 5 },
  reconnect: { windowMs: 10_000, limit: 16 }
});

export const ROOM_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function sanitizeDisplayName(value, fallback = 'Player') {
  const raw = String(value || '')
    .replace(/[<>"'`&]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const name = raw || fallback;
  return name.slice(0, DISPLAY_NAME_MAX_LENGTH);
}

export function normalizeRoomCode(value) {
  return String(value || '')
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/[^A-Z2-9-]/g, '');
}

export function isValidRoomCode(value) {
  const normalized = normalizeRoomCode(value);
  return ROOM_CODE_PATTERN.test(normalized);
}

export function normalizeSessionId(value) {
  return String(value || '')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, SESSION_ID_MAX_LENGTH);
}

export function normalizePlayerCount(value, fallback = 2) {
  const numeric = Number(value);
  return PLAYER_SETS[numeric] ? numeric : fallback;
}

export function normalizePreferredColor(value, playerCount = 2) {
  const normalized = String(value || '').toLowerCase();
  const activePlayers = PLAYER_SETS[normalizePlayerCount(playerCount)] || PLAYER_SETS[2];
  return activePlayers.includes(normalized) ? normalized : null;
}

export function normalizeChoice(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

export function normalizeBotProfile({ difficulty, personality } = {}) {
  return {
    difficulty: normalizeChoice(difficulty, BOT_DIFFICULTIES, DEFAULT_MATCHMAKING_PREFERENCES.botDifficulty),
    personality: normalizeChoice(personality, BOT_PERSONALITIES, DEFAULT_MATCHMAKING_PREFERENCES.botPersonality)
  };
}

export function normalizeMatchmakingPreferences(payload = {}) {
  const playerCount = normalizePlayerCount(payload.playerCount, 2);
  const botProfile = normalizeBotProfile({
    difficulty: payload.difficulty || payload.botDifficulty,
    personality: payload.personality || payload.botPersonality
  });
  return {
    playerCount,
    preferredColor: normalizePreferredColor(payload.preferredColor, playerCount),
    botFillMode: normalizeChoice(payload.botFillMode, BOT_FILL_MODES, DEFAULT_MATCHMAKING_PREFERENCES.botFillMode),
    botDifficulty: botProfile.difficulty,
    botPersonality: botProfile.personality,
    matchSpeed: normalizeChoice(payload.matchSpeed, MATCH_SPEEDS, DEFAULT_MATCHMAKING_PREFERENCES.matchSpeed)
  };
}

export function isValidTokenId(value) {
  return TOKEN_ID_PATTERN.test(String(value || ''));
}

export function isValidPlayerId(value) {
  return PLAYER_IDS.includes(value);
}

export function createRateLimiter({ now = Date.now } = {}) {
  const buckets = new Map();

  return {
    check(key, profileName = 'default') {
      const current = now();
      const profile = RATE_LIMIT_PROFILES[profileName] || RATE_LIMIT_PROFILES.default;
      const bucketKey = `${profileName}:${key}`;
      const bucket = buckets.get(bucketKey) || [];
      const recent = bucket.filter((timestamp) => current - timestamp < profile.windowMs);
      recent.push(current);
      buckets.set(bucketKey, recent);
      return recent.length <= profile.limit;
    },
    prune() {
      const current = now();
      for (const [key, bucket] of buckets.entries()) {
        const profileName = key.split(':')[0];
        const profile = RATE_LIMIT_PROFILES[profileName] || RATE_LIMIT_PROFILES.default;
        const recent = bucket.filter((timestamp) => current - timestamp < profile.windowMs);
        if (recent.length) {
          buckets.set(key, recent);
        } else {
          buckets.delete(key);
        }
      }
    },
    size() {
      return buckets.size;
    }
  };
}
