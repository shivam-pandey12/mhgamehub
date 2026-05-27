import { randomUUID } from 'node:crypto';

export function sanitizePlayerName(value = '', fallback = 'Player') {
  const clean = String(value)
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 24);
  return clean || fallback;
}

export function createSessionId() {
  return `carrom-session-${randomUUID()}`;
}

export class CarromPlayer {
  constructor({ socketId, playerId, name, seat, sessionId = createSessionId() }) {
    this.socketId = socketId;
    this.playerId = playerId;
    this.sessionId = sessionId;
    this.name = sanitizePlayerName(name, seat === 'host' ? 'Host' : 'Guest');
    this.seat = seat;
    this.color = null;
    this.isConnected = true;
    this.isReady = true;
    this.joinedAt = Date.now();
    this.lastSeenAt = Date.now();
    this.disconnectedAt = 0;
    this.lastShotAt = 0;
    this.clientShotIds = new Set();
  }

  attachSocket(socketId) {
    this.socketId = socketId;
    this.isConnected = true;
    this.isReady = true;
    this.lastSeenAt = Date.now();
    this.disconnectedAt = 0;
  }

  markDisconnected() {
    this.isConnected = false;
    this.lastSeenAt = Date.now();
    this.disconnectedAt = Date.now();
  }

  resetShotGuards() {
    this.lastShotAt = 0;
    this.clientShotIds.clear();
  }

  serialize() {
    return {
      socketId: this.socketId,
      playerId: this.playerId,
      name: this.name,
      seat: this.seat,
      color: this.color,
      isConnected: this.isConnected,
      isReady: this.isReady,
      lastSeenAt: this.lastSeenAt,
      disconnectedAt: this.disconnectedAt
    };
  }
}
