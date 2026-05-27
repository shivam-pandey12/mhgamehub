import { sanitizePlayerName } from './carrom-player.js';
import { resolvePublicMatchConfig } from './carrom-matchmaker.js';
import { ONLINE_TIMER_DEFAULTS } from './carrom-timers.js';

const VALID_RULE_MODES = new Set(['classic', 'freeCapture', 'any']);
const VALID_CLASSIC_VARIANTS = new Set(['casual', 'standard', 'strict', 'any']);
const VALID_COIN_ASSIGNMENTS = new Set(['random', 'firstPocket', 'any']);

function normalizeChoice(value, allowed, fallback, label) {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  if (!allowed.has(value)) {
    throw new Error(`Invalid ${label}.`);
  }
  return value;
}

export function normalizePublicPreferences(preferences = {}) {
  return {
    ruleMode: normalizeChoice(preferences.ruleMode, VALID_RULE_MODES, 'any', 'rule mode'),
    classicRuleVariant: normalizeChoice(preferences.classicRuleVariant, VALID_CLASSIC_VARIANTS, 'any', 'classic rule style'),
    coinAssignmentMode: normalizeChoice(preferences.coinAssignmentMode || preferences.coinSide, VALID_COIN_ASSIGNMENTS, 'random', 'coin side'),
    matchType: 'casual',
    allowBotFill: false
  };
}

export class CarromQueueManager {
  constructor() {
    this.entries = new Map();
    this.lastQueueId = 0;
  }

  add({ socketId, playerName, preferences }) {
    if (!socketId) {
      throw new Error('Socket is missing.');
    }
    if (this.entries.has(socketId)) {
      throw new Error('You are already in the public queue.');
    }

    const entry = {
      queueId: `queue-${Date.now().toString(36)}-${++this.lastQueueId}`,
      socketId,
      playerId: '',
      playerName: sanitizePlayerName(playerName, 'Player'),
      preferences: normalizePublicPreferences(preferences),
      joinedAt: Date.now(),
      status: 'queued',
      allowBotFill: false,
      lastStatusEmitAt: 0
    };
    this.entries.set(socketId, entry);
    return entry;
  }

  remove(socketId, reason = 'cancelled') {
    const entry = this.entries.get(socketId) || null;
    if (!entry) {
      return null;
    }
    entry.status = reason === 'matched' ? 'matched' : reason;
    this.entries.delete(socketId);
    return entry;
  }

  has(socketId) {
    return this.entries.has(socketId);
  }

  get(socketId) {
    return this.entries.get(socketId) || null;
  }

  getQueuedEntries() {
    return [...this.entries.values()].filter((entry) => entry.status === 'queued');
  }

  getPlayersWaiting() {
    return this.getQueuedEntries().length;
  }

  getStatus(socketId) {
    const entry = this.get(socketId);
    if (!entry) {
      return null;
    }
    return {
      status: entry.status,
      waitMs: Math.max(Date.now() - entry.joinedAt, 0),
      playersWaiting: this.getPlayersWaiting(),
      message: entry.status === 'queued' ? 'Searching for opponent...' : 'Match found.'
    };
  }

  findCompatiblePair({ isSocketAvailable } = {}) {
    const entries = this.getQueuedEntries().filter((entry) => (
      typeof isSocketAvailable === 'function' ? isSocketAvailable(entry.socketId) : true
    ));
    for (let firstIndex = 0; firstIndex < entries.length; firstIndex += 1) {
      for (let secondIndex = firstIndex + 1; secondIndex < entries.length; secondIndex += 1) {
        const first = entries[firstIndex];
        const second = entries[secondIndex];
        if (first.socketId === second.socketId) {
          continue;
        }
        const matchConfig = resolvePublicMatchConfig(first.preferences, second.preferences);
        if (matchConfig) {
          return { first, second, matchConfig };
        }
      }
    }
    return null;
  }

  cleanupExpired(now = Date.now()) {
    const removed = [];
    this.entries.forEach((entry, socketId) => {
      if (now - entry.joinedAt > ONLINE_TIMER_DEFAULTS.QUEUE_ENTRY_TIMEOUT_MS) {
        removed.push(this.remove(socketId, 'expired'));
      }
    });
    return removed.filter(Boolean);
  }
}
