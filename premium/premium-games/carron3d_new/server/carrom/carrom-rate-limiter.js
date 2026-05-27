const DEFAULT_LIMITS = {
  createRoom: { cooldownMs: 1500, message: 'Please wait before creating another room.' },
  joinRoom: { cooldownMs: 900, message: 'Please wait before joining another room.' },
  joinPublicQueue: { cooldownMs: 900, message: 'Please wait before searching again.' },
  cancelPublicQueue: { cooldownMs: 450, message: 'Queue action is cooling down.' },
  queuePing: { cooldownMs: 750, message: 'Queue status is already fresh.' },
  queueReady: { cooldownMs: 350, message: 'Match ready signal is cooling down.' },
  reconnectRoom: { cooldownMs: 1200, message: 'Please wait before reconnecting again.' },
  requestRoomState: { cooldownMs: 600, message: 'Please wait before requesting state again.' },
  requestRematch: { cooldownMs: 800, message: 'Please wait before requesting rematch again.' },
  respondRematch: { cooldownMs: 600, message: 'Please wait before changing rematch response.' },
  startMatch: { cooldownMs: 800, message: 'Please wait before starting the match again.' },
  submitShot: { cooldownMs: 350, message: 'Shot submitted too quickly.' }
};

export class CarromRateLimiter {
  constructor(limits = DEFAULT_LIMITS) {
    this.limits = limits;
    this.lastActions = new Map();
  }

  check(socketId, action, now = Date.now()) {
    const limit = this.limits[action];
    if (!socketId || !limit) {
      return { allowed: true, retryAfterMs: 0, message: '' };
    }

    const key = `${socketId}:${action}`;
    const lastAt = this.lastActions.get(key) || 0;
    const elapsed = now - lastAt;
    if (elapsed < limit.cooldownMs) {
      return {
        allowed: false,
        retryAfterMs: limit.cooldownMs - elapsed,
        message: limit.message
      };
    }

    this.lastActions.set(key, now);
    return { allowed: true, retryAfterMs: 0, message: '' };
  }

  resetSocket(socketId) {
    if (!socketId) {
      return;
    }
    [...this.lastActions.keys()].forEach((key) => {
      if (key.startsWith(`${socketId}:`)) {
        this.lastActions.delete(key);
      }
    });
  }

  cleanup(now = Date.now(), maxAgeMs = 300_000) {
    this.lastActions.forEach((lastAt, key) => {
      if (now - lastAt > maxAgeMs) {
        this.lastActions.delete(key);
      }
    });
  }
}
