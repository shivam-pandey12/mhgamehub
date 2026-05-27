import { CarromMatchEngine } from './carrom-match-engine.js';
import { CarromPlayer } from './carrom-player.js';
import { normalizeMatchConfig } from './carrom-validators.js';
import { ONLINE_TIMER_DEFAULTS } from './carrom-timers.js';

export class CarromRoom {
  constructor({ roomCode, hostSocketId, hostName, matchConfig, roomType = 'private' }) {
    this.roomCode = roomCode;
    this.hostSocketId = hostSocketId;
    this.roomType = roomType === 'public' ? 'public' : 'private';
    this.status = 'lobby';
    this.matchConfig = normalizeMatchConfig(matchConfig);
    this.players = [
      new CarromPlayer({
        socketId: hostSocketId,
        playerId: 'player-1',
        name: hostName,
        seat: 'host'
      })
    ];
    this.matchEngine = null;
    this.message = this.roomType === 'public' ? 'Public match found.' : 'Room created. Waiting for guest.';
    this.disconnectGrace = null;
    this.turnTimer = {
      active: false,
      currentPlayerId: '',
      totalMs: ONLINE_TIMER_DEFAULTS.TURN_TIME_MS,
      startedAt: 0,
      endsAt: 0,
      remainingMs: 0
    };
    this.rematch = {
      status: 'idle',
      requestedBy: [],
      requestedAt: 0,
      declinedBy: ''
    };
    this.serverStateVersion = 0;
    this.lastStateReason = 'created';
    this.timers = {
      disconnectGrace: null,
      disconnectTick: null,
      turnTimeout: null,
      turnTick: null,
      cleanup: null
    };
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
  }

  bumpState(reason = 'state') {
    this.serverStateVersion += 1;
    this.lastStateReason = reason;
    this.updatedAt = Date.now();
    return this.serverStateVersion;
  }

  resetPlayerShotGuards() {
    this.players.forEach((player) => player.resetShotGuards?.());
  }

  addGuest({ socketId, playerName }) {
    const existing = this.getPlayerBySocket(socketId);
    if (existing) {
      existing.attachSocket(socketId);
      this.bumpState('guest-reconnected');
      return existing;
    }

    if (this.getGuest()) {
      throw new Error('Room is full.');
    }

    const guest = new CarromPlayer({
      socketId,
      playerId: 'player-2',
      name: playerName,
      seat: 'guest'
    });
    this.players.push(guest);
    this.message = `${guest.name} joined.`;
    this.bumpState('guest-joined');
    return guest;
  }

  startMatch() {
    if (!this.getHost() || !this.getGuest()) {
      throw new Error('Two players are required.');
    }
    if (this.status !== 'lobby') {
      throw new Error('Room is not in lobby.');
    }
    this.resetPlayerShotGuards();
    this.matchEngine = new CarromMatchEngine({ room: this });
    this.clearDisconnectGrace();
    this.clearRematch();
    this.matchEngine.start();
    this.bumpState('match-started');
    return this.matchEngine.getSnapshot();
  }

  markSocketLeft(socketId, reason = 'left') {
    const player = this.getPlayerBySocket(socketId);
    if (!player) {
      return null;
    }
    player.isConnected = false;
    this.bumpState('player-left');
    this.message = player.seat === 'host' ? 'Host left.' : 'Opponent left.';

    if (this.status === 'finished') {
      return player;
    }

    if (this.status === 'lobby' && player.seat === 'guest') {
      this.players = this.players.filter((item) => item.playerId !== player.playerId);
      this.message = 'Guest left. Waiting for opponent.';
    }

    if (player.seat === 'host') {
      this.status = 'closed';
      this.message = reason === 'disconnect' ? 'Host disconnected.' : 'Host left.';
    } else if (this.status === 'playing') {
      this.status = 'closed';
    }

    return player;
  }

  markSocketDisconnected(socketId) {
    const player = this.getPlayerBySocket(socketId);
    if (!player) {
      return null;
    }
    player.markDisconnected();
    this.message = player.seat === 'host' ? 'Host disconnected.' : 'Opponent disconnected.';
    this.bumpState('player-disconnected');
    return player;
  }

  startDisconnectGrace(player, { now = Date.now(), durationMs = ONLINE_TIMER_DEFAULTS.DISCONNECT_GRACE_MS } = {}) {
    this.clearDisconnectGrace();
    this.disconnectGrace = {
      playerId: player?.playerId || '',
      playerName: player?.name || 'Opponent',
      startedAt: now,
      graceEndsAt: now + durationMs,
      remainingMs: durationMs,
      durationMs
    };
    this.bumpState('disconnect-grace-started');
    return this.disconnectGrace;
  }

  updateDisconnectGrace(now = Date.now()) {
    if (!this.disconnectGrace) {
      return null;
    }
    this.disconnectGrace.remainingMs = Math.max(this.disconnectGrace.graceEndsAt - now, 0);
    return this.disconnectGrace;
  }

  clearDisconnectGrace() {
    clearTimeout(this.timers.disconnectGrace);
    clearInterval(this.timers.disconnectTick);
    this.timers.disconnectGrace = null;
    this.timers.disconnectTick = null;
    this.disconnectGrace = null;
    this.bumpState('disconnect-grace-cleared');
  }

  close(message = 'Room closed.') {
    this.status = 'closed';
    this.message = message;
    this.clearTurnTimer();
    this.clearDisconnectGrace();
    this.bumpState('room-closed');
  }

  resetForRematch() {
    this.resetPlayerShotGuards();
    this.matchEngine = new CarromMatchEngine({ room: this });
    this.status = 'playing';
    this.clearDisconnectGrace();
    this.clearRematch();
    this.matchEngine.start();
    this.bumpState('rematch-started');
    return this.matchEngine.getSnapshot();
  }

  requestRematch(playerId) {
    if (!playerId || this.status !== 'finished') {
      return this.rematch;
    }
    const requestedBy = new Set(this.rematch.requestedBy || []);
    requestedBy.add(playerId);
    this.rematch = {
      status: requestedBy.size >= 2 ? 'accepted' : 'requested',
      requestedBy: [...requestedBy],
      requestedAt: this.rematch.requestedAt || Date.now(),
      declinedBy: ''
    };
    this.bumpState('rematch-requested');
    return this.rematch;
  }

  declineRematch(playerId) {
    this.rematch = {
      status: 'declined',
      requestedBy: [],
      requestedAt: Date.now(),
      declinedBy: playerId || ''
    };
    this.bumpState('rematch-declined');
    return this.rematch;
  }

  clearRematch() {
    this.rematch = {
      status: 'idle',
      requestedBy: [],
      requestedAt: 0,
      declinedBy: ''
    };
  }

  clearTurnTimer() {
    clearTimeout(this.timers.turnTimeout);
    clearInterval(this.timers.turnTick);
    this.timers.turnTimeout = null;
    this.timers.turnTick = null;
    this.turnTimer = {
      ...this.turnTimer,
      active: false,
      remainingMs: 0,
      startedAt: 0,
      endsAt: 0,
      generation: this.turnTimer.generation || 0
    };
  }

  startTurnTimer(currentPlayerId, totalMs = ONLINE_TIMER_DEFAULTS.TURN_TIME_MS) {
    this.clearTurnTimer();
    const now = Date.now();
    const generation = (this.turnTimer.generation || 0) + 1;
    this.turnTimer = {
      active: true,
      currentPlayerId,
      totalMs,
      startedAt: now,
      endsAt: now + totalMs,
      remainingMs: totalMs,
      generation
    };
    this.bumpState('turn-timer-started');
    return this.turnTimer;
  }

  updateTurnTimer(now = Date.now()) {
    if (!this.turnTimer.active) {
      return this.turnTimer;
    }
    this.turnTimer.remainingMs = Math.max(this.turnTimer.endsAt - now, 0);
    return this.turnTimer;
  }

  hasDisconnectGrace() {
    return Boolean(this.disconnectGrace);
  }

  hasRematchPending() {
    return this.rematch.status === 'requested' || this.rematch.status === 'accepted';
  }

  clearTimers() {
    this.clearTurnTimer();
    this.clearDisconnectGrace();
    clearTimeout(this.timers.cleanup);
    this.timers.cleanup = null;
  }

  getHost() {
    return this.players.find((player) => player.seat === 'host') || null;
  }

  getGuest() {
    return this.players.find((player) => player.seat === 'guest') || null;
  }

  getPlayerBySocket(socketId) {
    return this.players.find((player) => player.socketId === socketId) || null;
  }

  getPlayerByPlayerId(playerId) {
    return this.players.find((player) => player.playerId === playerId) || null;
  }

  getPlayerBySession(sessionId) {
    return this.players.find((player) => player.sessionId === sessionId) || null;
  }

  hasSocket(socketId) {
    return Boolean(this.getPlayerBySocket(socketId));
  }

  get isEmptyOrClosed() {
    return this.status === 'closed' || !this.players.some((player) => player.isConnected);
  }
}
