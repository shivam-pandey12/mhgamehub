export class MatchmakingManager {
  constructor({
    botFillMs = 30000,
    botEntryDelayMs = 850,
    isSocketBusy,
    createPublicPvPMatch,
    createPublicBotMatch,
    emitStatus
  } = {}) {
    this.botFillMs = botFillMs;
    this.botEntryDelayMs = botEntryDelayMs;
    this.isSocketBusy = isSocketBusy || (() => false);
    this.createPublicPvPMatch = createPublicPvPMatch;
    this.createPublicBotMatch = createPublicBotMatch;
    this.emitStatus = emitStatus;
    this.queue = new Map();
  }

  has(socketId) {
    return this.queue.has(socketId);
  }

  join(socket, playerInfo = {}) {
    if (this.queue.has(socket.id)) {
      return {
        ok: false,
        error: 'You are already searching for a public match.'
      };
    }

    if (this.isSocketBusy(socket.id)) {
      return {
        ok: false,
        error: 'Leave the current room before searching for a public match.'
      };
    }

    const challenger = {
      socket,
      socketId: socket.id,
      playerName: playerInfo.playerName || '',
      preferredColor: playerInfo.preferredColor || 'auto',
      joinedAt: Date.now(),
      statusTimers: [],
      botTimer: 0,
      botEntryTimer: 0
    };

    const opponent = this.findOpponent(socket.id);
    if (opponent) {
      this.remove(opponent.socketId, { emit: false });
      this.createPublicPvPMatch?.(opponent, challenger);
      return {
        ok: true,
        queued: false,
        matched: true
      };
    }

    this.queue.set(socket.id, challenger);
    this.emitStatus?.(socket, {
      phase: 'searching',
      message: 'Searching for a worthy opponent...',
      elapsedMs: 0
    });

    challenger.statusTimers.push(
      setTimeout(() => this.sendQueuedStatus(socket.id, 'looking', 'Looking for public match...'), 7000),
      setTimeout(() => this.sendQueuedStatus(socket.id, 'expanding', 'Expanding search...'), 18000),
      setTimeout(() => this.sendQueuedStatus(socket.id, 'bot-soon', 'Checking for one last real challenger...'), 27000)
    );

    challenger.botTimer = setTimeout(() => {
      const entry = this.queue.get(socket.id);
      if (!entry) {
        return;
      }

      this.emitStatus?.(entry.socket, {
        phase: 'bot-entering',
        message: 'No player found. Bot entering match...',
        elapsedMs: Date.now() - entry.joinedAt
      });

      entry.botEntryTimer = setTimeout(() => {
        const latestEntry = this.queue.get(socket.id);
        if (!latestEntry) {
          return;
        }
        this.remove(socket.id, { emit: false });
        this.createPublicBotMatch?.(latestEntry);
      }, this.botEntryDelayMs);
    }, this.botFillMs);

    return {
      ok: true,
      queued: true,
      matched: false
    };
  }

  cancel(socketId) {
    return this.remove(socketId, {
      emit: true,
      message: 'Public matchmaking cancelled.'
    });
  }

  remove(socketId, { emit = false, message = 'Public matchmaking cancelled.' } = {}) {
    const entry = this.queue.get(socketId);
    if (!entry) {
      return false;
    }

    this.clearEntryTimers(entry);
    this.queue.delete(socketId);
    if (emit) {
      this.emitStatus?.(entry.socket, {
        phase: 'cancelled',
        message,
        elapsedMs: Date.now() - entry.joinedAt
      });
    }
    return true;
  }

  findOpponent(socketId) {
    for (const entry of this.queue.values()) {
      if (entry.socketId !== socketId && entry.socket?.connected) {
        return entry;
      }
    }
    return null;
  }

  sendQueuedStatus(socketId, phase, message) {
    const entry = this.queue.get(socketId);
    if (!entry) {
      return;
    }

    this.emitStatus?.(entry.socket, {
      phase,
      message,
      elapsedMs: Date.now() - entry.joinedAt
    });
  }

  clearEntryTimers(entry) {
    entry.statusTimers?.forEach((timerId) => clearTimeout(timerId));
    entry.statusTimers = [];
    if (entry.botTimer) {
      clearTimeout(entry.botTimer);
      entry.botTimer = 0;
    }
    if (entry.botEntryTimer) {
      clearTimeout(entry.botEntryTimer);
      entry.botEntryTimer = 0;
    }
  }
}
