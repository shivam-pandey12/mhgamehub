import { STORAGE_KEYS } from '../config/carrom-constants.js';

const DEFAULT_STALE_MS = 300_000;

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function normalizeSession(session = {}) {
  const sessionId = String(session.sessionId || '').trim();
  const playerId = String(session.playerId || '').trim();
  const roomCode = String(session.roomCode || '').trim().toUpperCase();
  if (!sessionId || !playerId || !roomCode) {
    return null;
  }
  return {
    sessionId,
    playerId,
    roomCode,
    matchId: String(session.matchId || ''),
    mode: session.mode === 'onlinePublic' ? 'onlinePublic' : 'onlinePrivate',
    playerName: String(session.playerName || 'Player').slice(0, 24),
    createdAt: Number(session.createdAt) || Date.now(),
    updatedAt: Number(session.updatedAt) || Date.now()
  };
}

export class OnlineSessionManager {
  constructor({ storageKey = STORAGE_KEYS.onlineSession, staleMs = DEFAULT_STALE_MS } = {}) {
    this.storageKey = storageKey;
    this.staleMs = staleMs;
  }

  loadSession() {
    if (!canUseStorage()) {
      return null;
    }
    try {
      const parsed = JSON.parse(window.localStorage.getItem(this.storageKey) || 'null');
      const session = normalizeSession(parsed);
      if (!session || this.isExpired(session)) {
        this.clearSession();
        return null;
      }
      return session;
    } catch {
      this.clearSession();
      return null;
    }
  }

  saveSession(session = {}) {
    if (!canUseStorage()) {
      return null;
    }
    const normalized = normalizeSession({
      ...session,
      updatedAt: Date.now()
    });
    if (!normalized) {
      return null;
    }
    window.localStorage.setItem(this.storageKey, JSON.stringify(normalized));
    return normalized;
  }

  updateSession(patch = {}) {
    const current = this.loadSession();
    return this.saveSession({
      ...(current || {}),
      ...patch
    });
  }

  clearSession() {
    if (canUseStorage()) {
      window.localStorage.removeItem(this.storageKey);
    }
  }

  isExpired(session = {}) {
    return Date.now() - (Number(session.updatedAt) || 0) > this.staleMs;
  }

  getReconnectPayload() {
    const session = this.loadSession();
    if (!session) {
      return null;
    }
    return {
      sessionId: session.sessionId,
      playerId: session.playerId,
      roomCode: session.roomCode,
      matchId: session.matchId
    };
  }
}
