import { randomUUID } from 'node:crypto';

import { PLAYER_IDS, PLAYER_META, PLAYER_SETS } from '../src/ludo/constants.js';
import { ROOM_STATUS } from './roomStore.js';
import {
  normalizeMatchmakingPreferences,
  normalizePlayerCount,
  sanitizeDisplayName
} from './security.js';

export const MATCHMAKING_STATUS = Object.freeze({
  SEARCHING: 'searching',
  MATCHED: 'matched',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired'
});

export const MATCHMAKING_LIMITS = Object.freeze({
  countdownMs: 5000,
  queueExpiryMs: 3 * 60 * 1000,
  disconnectedGraceMs: 20 * 1000,
  botFillWaitMs: 30 * 1000
});

export class MatchmakingStore {
  constructor({ roomStore, now = Date.now, countdownMs = MATCHMAKING_LIMITS.countdownMs } = {}) {
    this.roomStore = roomStore;
    this.now = now;
    this.countdownMs = countdownMs;
    this.queues = new Map(Object.keys(PLAYER_SETS).map((count) => [Number(count), []]));
    this.sessionToQueue = new Map();
    this.queueIdToEntry = new Map();
  }

  joinQueue({
    socketId,
    sessionId,
    displayName,
    playerCount = 2,
    preferredColor = null,
    botFillMode = 'after-wait',
    botDifficulty = 'medium',
    botPersonality = 'balanced',
    matchSpeed = 'normal'
  } = {}) {
    if (!socketId || !sessionId) {
      return { ok: false, message: 'Missing matchmaking session.' };
    }

    const existing = this.getActiveEntry(sessionId);
    if (existing) {
      existing.socketId = socketId;
      existing.connected = true;
      existing.displayName = sanitizeDisplayName(displayName, existing.displayName);
      existing.lastSeen = this.now();
      if (existing.status === MATCHMAKING_STATUS.MATCHED) {
        const room = this.roomStore.getRoom(existing.matchedRoomCode);
        return {
          ok: true,
          queue: this.publicQueue(existing),
          match: room ? { room, entries: this.entriesForRoom(existing.matchedRoomCode) } : null
        };
      }
      const match = this.tryMatch(existing.requestedPlayerCount, { allowBotFill: true });
      return {
        ok: true,
        queue: this.publicQueue(existing),
        match
      };
    }

    const preferences = normalizeMatchmakingPreferences({
      playerCount,
      preferredColor,
      botFillMode,
      botDifficulty,
      botPersonality,
      matchSpeed
    });
    const requestedPlayerCount = preferences.playerCount;
    const entry = {
      queueId: randomUUID(),
      sessionId: String(sessionId).slice(0, 80),
      socketId,
      displayName: sanitizeDisplayName(displayName, 'Player'),
      requestedPlayerCount,
      preferredColor: preferences.preferredColor,
      botFillAllowed: preferences.botFillMode !== 'off',
      botFillMode: preferences.botFillMode,
      botDifficulty: preferences.botDifficulty,
      botPersonality: preferences.botPersonality,
      matchSpeed: preferences.matchSpeed,
      controller: 'online-human',
      botProfile: null,
      status: MATCHMAKING_STATUS.SEARCHING,
      connected: true,
      joinedAt: this.now(),
      lastSeen: this.now(),
      matchedRoomId: null,
      matchedRoomCode: null
    };

    this.queueIdToEntry.set(entry.queueId, entry);
    this.sessionToQueue.set(entry.sessionId, entry.queueId);
    this.queues.get(requestedPlayerCount).push(entry);
    const match = this.tryMatch(requestedPlayerCount, { allowBotFill: true });
    return {
      ok: true,
      queue: this.publicQueue(entry),
      match
    };
  }

  cancelQueue(sessionId) {
    const entry = this.getActiveEntry(sessionId);
    if (!entry) {
      return { ok: true, cancelled: true };
    }

    if (entry.status === MATCHMAKING_STATUS.MATCHED) {
      return {
        ok: true,
        matched: true,
        roomCode: entry.matchedRoomCode,
        entry: this.publicQueue(entry)
      };
    }

    entry.status = MATCHMAKING_STATUS.CANCELLED;
    this.removeEntry(entry);
    return { ok: true, cancelled: true };
  }

  cancelMatchedRoom(roomCode, cancellingSessionId = null) {
    const room = this.roomStore.getRoom(roomCode);
    const entries = this.entriesForRoom(roomCode);
    const requeued = [];
    const cancelled = [];
    entries.forEach((entry) => {
      if (entry.socketId) {
        this.roomStore.unbindSocket(entry.socketId);
      }
      if (entry.sessionId === cancellingSessionId || !entry.connected) {
        entry.status = MATCHMAKING_STATUS.CANCELLED;
        cancelled.push(entry);
        this.removeEntry(entry);
        return;
      }

      entry.status = MATCHMAKING_STATUS.SEARCHING;
      entry.matchedRoomCode = null;
      entry.matchedRoomId = null;
      entry.joinedAt = this.now();
      entry.lastSeen = this.now();
      this.enqueueEntry(entry);
      requeued.push(entry);
    });

    if (room && room.status !== ROOM_STATUS.CLOSED) {
      this.roomStore.closeRoom(room, 'Public match cancelled. Returning players to search.');
    }

    return {
      ok: true,
      room,
      requeued,
      cancelled
    };
  }

  disconnectSocket(socketId) {
    const entry = [...this.queueIdToEntry.values()].find((candidate) => candidate.socketId === socketId);
    if (!entry) {
      return null;
    }

    entry.connected = false;
    entry.lastSeen = this.now();
    if (entry.status === MATCHMAKING_STATUS.MATCHED) {
      return { status: MATCHMAKING_STATUS.MATCHED, entry, roomCode: entry.matchedRoomCode };
    }
    return { status: entry.status, entry };
  }

  reconnect({ sessionId, socketId, roomCode = null } = {}) {
    const entry = this.getActiveEntry(sessionId);
    if (entry) {
      entry.socketId = socketId;
      entry.connected = true;
      entry.lastSeen = this.now();
      if (entry.status === MATCHMAKING_STATUS.MATCHED) {
        const room = this.roomStore.getRoom(entry.matchedRoomCode);
        if (room) {
          const reconnect = this.roomStore.reconnectToRoom({
            roomCode: entry.matchedRoomCode,
            socketId,
            sessionId
          });
          return {
            ok: reconnect.ok,
            queue: this.publicQueue(entry),
            room: reconnect.room || room,
            status: MATCHMAKING_STATUS.MATCHED,
            message: reconnect.message
          };
        }
      }
      return { ok: true, queue: this.publicQueue(entry), status: MATCHMAKING_STATUS.SEARCHING };
    }

    if (roomCode) {
      const reconnect = this.roomStore.reconnectToRoom({ roomCode, socketId, sessionId });
      if (reconnect.ok) {
        return { ok: true, room: reconnect.room, status: reconnect.room.status };
      }
    }

    return { ok: false, message: 'No active public match search was found.' };
  }

  snapshot(sessionId) {
    const entry = this.getActiveEntry(sessionId);
    if (!entry) {
      return { ok: false, message: 'No active search found.' };
    }
    if (entry.status === MATCHMAKING_STATUS.MATCHED) {
      const room = this.roomStore.getRoom(entry.matchedRoomCode);
      return { ok: true, queue: this.publicQueue(entry), room };
    }
    return { ok: true, queue: this.publicQueue(entry) };
  }

  markRoomStarted(roomCode) {
    this.entriesForRoom(roomCode).forEach((entry) => this.removeEntry(entry, { unqueueOnly: false }));
  }

  cleanup(now = this.now()) {
    const expired = [];
    for (const entry of [...this.queueIdToEntry.values()]) {
      if (entry.status === MATCHMAKING_STATUS.SEARCHING) {
        const stale = now - entry.joinedAt > MATCHMAKING_LIMITS.queueExpiryMs;
        const disconnected = !entry.connected && now - entry.lastSeen > MATCHMAKING_LIMITS.disconnectedGraceMs;
        if (stale || disconnected) {
          entry.status = MATCHMAKING_STATUS.EXPIRED;
          expired.push(entry);
          this.removeEntry(entry);
        }
      }
      if (entry.status === MATCHMAKING_STATUS.MATCHED) {
        const room = this.roomStore.getRoom(entry.matchedRoomCode);
        if (!room || room.status === ROOM_STATUS.CLOSED) {
          this.removeEntry(entry);
        }
      }
    }
    return expired.map((entry) => this.publicQueue(entry));
  }

  tryMatch(playerCount, { allowBotFill = false } = {}) {
    const requestedPlayerCount = normalizePlayerCount(playerCount);
    const queue = this.queues.get(requestedPlayerCount);
    const candidates = queue.filter((entry) => (
      entry.status === MATCHMAKING_STATUS.SEARCHING
      && entry.connected
      && this.now() - entry.joinedAt <= MATCHMAKING_LIMITS.queueExpiryMs
    ));

    if (candidates.length < requestedPlayerCount && !allowBotFill) {
      return null;
    }

    let entries = candidates.slice(0, requestedPlayerCount);
    const botFillCandidate = this.getBotFillCandidate(candidates, requestedPlayerCount);
    if (entries.length < requestedPlayerCount) {
      if (!botFillCandidate) {
        return null;
      }
      const humanEntries = candidates
        .filter((entry) => entry.botFillMode !== 'off')
        .slice(0, requestedPlayerCount);
      entries = [
        ...humanEntries,
        ...this.createBotEntries({
          count: requestedPlayerCount - humanEntries.length,
          baseEntry: botFillCandidate,
          playerCount: requestedPlayerCount
        })
      ];
    }

    const publicRoom = this.roomStore.createPublicRoomFromQueue({
      entries,
      playerCount: requestedPlayerCount,
      countdownMs: this.countdownMs
    });
    if (!publicRoom.ok) {
      return { ok: false, message: publicRoom.message };
    }

    const matchedIds = new Set(entries.filter((entry) => entry.controller !== 'server-bot').map((entry) => entry.queueId));
    this.queues.set(requestedPlayerCount, queue.filter((entry) => !matchedIds.has(entry.queueId)));
    entries.filter((entry) => entry.controller !== 'server-bot').forEach((entry) => {
      entry.status = MATCHMAKING_STATUS.MATCHED;
      entry.matchedRoomId = publicRoom.room.roomId;
      entry.matchedRoomCode = publicRoom.room.roomCode;
      entry.lastSeen = this.now();
    });

    return {
      ok: true,
      room: publicRoom.room,
      entries
    };
  }

  tryMatchAll(playerCount) {
    const matches = [];
    let match = this.tryMatch(playerCount, { allowBotFill: true });
    while (match?.ok) {
      matches.push(match);
      match = this.tryMatch(playerCount, { allowBotFill: true });
    }
    return matches;
  }

  getBotFillCandidate(candidates, playerCount) {
    if (!candidates.length) {
      return null;
    }
    const allowed = candidates.filter((entry) => entry.botFillMode !== 'off');
    if (!allowed.length) {
      return null;
    }
    const immediate = allowed.find((entry) => entry.botFillMode === 'immediate');
    if (immediate) {
      return immediate;
    }
    return allowed.find((entry) => (
      entry.botFillMode === 'after-wait'
      && this.now() - entry.joinedAt >= MATCHMAKING_LIMITS.botFillWaitMs
      && playerCount > allowed.length
    )) || null;
  }

  createBotEntries({ count, baseEntry, playerCount }) {
    const activePlayers = PLAYER_SETS[playerCount] || PLAYER_SETS[2];
    return Array.from({ length: Math.max(0, count) }, (_, index) => {
      const label = PLAYER_META[activePlayers[index]]?.label || 'Royal';
      const queueId = `bot-${randomUUID()}`;
      return {
        queueId,
        sessionId: queueId,
        socketId: null,
        displayName: `${label} Bot`,
        requestedPlayerCount: playerCount,
        preferredColor: null,
        botFillAllowed: true,
        botFillMode: baseEntry.botFillMode,
        botDifficulty: baseEntry.botDifficulty || 'medium',
        botPersonality: baseEntry.botPersonality || 'balanced',
        matchSpeed: baseEntry.matchSpeed || 'normal',
        controller: 'server-bot',
        botProfile: {
          difficulty: baseEntry.botDifficulty || 'medium',
          personality: baseEntry.botPersonality || 'balanced'
        },
        status: MATCHMAKING_STATUS.MATCHED,
        connected: false,
        joinedAt: this.now(),
        lastSeen: this.now(),
        matchedRoomId: null,
        matchedRoomCode: null
      };
    });
  }

  getActiveEntry(sessionId) {
    const queueId = this.sessionToQueue.get(String(sessionId || '').slice(0, 80));
    const entry = queueId ? this.queueIdToEntry.get(queueId) : null;
    if (!entry || entry.status === MATCHMAKING_STATUS.CANCELLED || entry.status === MATCHMAKING_STATUS.EXPIRED) {
      return null;
    }
    return entry;
  }

  entriesForRoom(roomCode) {
    return [...this.queueIdToEntry.values()].filter((entry) => (
      entry.status === MATCHMAKING_STATUS.MATCHED
      && entry.matchedRoomCode === roomCode
    ));
  }

  enqueueEntry(entry) {
    const queue = this.queues.get(entry.requestedPlayerCount);
    if (!queue.includes(entry)) {
      queue.push(entry);
    }
    this.queueIdToEntry.set(entry.queueId, entry);
    this.sessionToQueue.set(entry.sessionId, entry.queueId);
  }

  removeEntry(entry) {
    const queue = this.queues.get(entry.requestedPlayerCount);
    if (queue) {
      this.queues.set(entry.requestedPlayerCount, queue.filter((candidate) => candidate.queueId !== entry.queueId));
    }
    this.sessionToQueue.delete(entry.sessionId);
    this.queueIdToEntry.delete(entry.queueId);
  }

  publicQueue(entry) {
    if (!entry) {
      return null;
    }
    return {
      queueId: entry.queueId,
      sessionId: entry.sessionId,
      displayName: entry.displayName,
      requestedPlayerCount: entry.requestedPlayerCount,
      preferredColor: entry.preferredColor,
      botFillAllowed: entry.botFillMode !== 'off',
      botFillMode: entry.botFillMode || 'off',
      botDifficulty: entry.botDifficulty || 'medium',
      botPersonality: entry.botPersonality || 'balanced',
      matchSpeed: entry.matchSpeed || 'normal',
      botFillAvailableAt: entry.botFillMode === 'after-wait' ? entry.joinedAt + MATCHMAKING_LIMITS.botFillWaitMs : null,
      botFillRemainingMs: entry.botFillMode === 'after-wait'
        ? Math.max(0, entry.joinedAt + MATCHMAKING_LIMITS.botFillWaitMs - this.now())
        : 0,
      status: entry.status,
      connected: entry.connected,
      joinedAt: entry.joinedAt,
      lastSeen: entry.lastSeen,
      matchedRoomId: entry.matchedRoomId,
      matchedRoomCode: entry.matchedRoomCode,
      position: this.queuePosition(entry),
      waitingPlayers: this.queues.get(entry.requestedPlayerCount)?.filter((candidate) => (
        candidate.status === MATCHMAKING_STATUS.SEARCHING && candidate.connected
      )).length || 0
    };
  }

  queuePosition(entry) {
    if (entry.status !== MATCHMAKING_STATUS.SEARCHING) {
      return null;
    }
    const queue = this.queues.get(entry.requestedPlayerCount) || [];
    const active = queue.filter((candidate) => candidate.status === MATCHMAKING_STATUS.SEARCHING && candidate.connected);
    const index = active.findIndex((candidate) => candidate.queueId === entry.queueId);
    return index >= 0 ? index + 1 : null;
  }
}

export function isValidPreferredColor(value) {
  return !value || PLAYER_IDS.includes(value);
}
