import { io } from 'socket.io-client';
import { ONLINE_EVENTS } from '../shared/onlineProtocol.js';

export class OnlineClient {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.playerId = null;
    this.handlers = new Map();
    this.connecting = false;
    this.url = import.meta.env.VITE_ONLINE_SERVER_URL || `${window.location.origin}/premium-golf`;
  }

  on(event, handler) {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event).add(handler);
  }

  emitLocal(event, payload) {
    for (const handler of this.handlers.get(event) ?? []) handler(payload);
  }

  connect() {
    if (this.socket) {
      if (!this.socket.connected && !this.connecting) {
        this.connecting = true;
        this.socket.connect();
      }
      return;
    }
    this.connecting = true;
    this.socket = io(this.url, {
      transports: ['websocket', 'polling'],
      timeout: 2200,
      reconnectionAttempts: 2,
      reconnectionDelay: 1200
    });

    this.socket.on('connect', () => {
      this.connecting = false;
      this.connected = true;
      this.playerId = this.socket.id;
      this.emitLocal(ONLINE_EVENTS.STATUS, { connected: true, playerId: this.playerId });
    });

    this.socket.on('disconnect', () => {
      this.connecting = false;
      this.connected = false;
      this.emitLocal(ONLINE_EVENTS.STATUS, { connected: false, playerId: this.playerId });
    });

    this.socket.on('connect_error', () => {
      this.connecting = false;
      this.connected = false;
      this.emitLocal(ONLINE_EVENTS.STATUS, { connected: false, playerId: this.playerId });
    });

    this.socket.io.on('reconnect_attempt', () => {
      this.connecting = true;
      this.emitLocal(ONLINE_EVENTS.STATUS, { connected: false, reconnecting: true, playerId: this.playerId });
    });

    this.socket.io.on('reconnect_failed', () => {
      this.connecting = false;
      this.emitLocal(ONLINE_EVENTS.STATUS, { connected: false, playerId: this.playerId });
    });

    for (const event of Object.values(ONLINE_EVENTS)) {
      this.socket.on(event, (payload) => {
        if (event === ONLINE_EVENTS.STATUS && payload?.playerId) this.playerId = payload.playerId;
        this.emitLocal(event, payload);
      });
    }
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.connected = false;
    this.connecting = false;
  }

  send(event, payload = {}) {
    if (!this.socket?.connected) {
      this.emitLocal(ONLINE_EVENTS.ERROR, { code: 'offline', message: 'Server is offline. Local modes are still available.' });
      return false;
    }
    this.socket.emit(event, payload);
    return true;
  }

  createRoom(payload) {
    return this.send(ONLINE_EVENTS.ROOM_CREATE, payload);
  }

  joinRoom(payload) {
    return this.send(ONLINE_EVENTS.ROOM_JOIN, payload);
  }

  leaveRoom() {
    return this.send(ONLINE_EVENTS.ROOM_LEAVE);
  }

  setReady(code, ready) {
    return this.send(ONLINE_EVENTS.PLAYER_READY, { code, ready });
  }

  startMatch(code) {
    return this.send(ONLINE_EVENTS.MATCH_START, { code });
  }

  joinQueue(payload) {
    return this.send(ONLINE_EVENTS.QUEUE_JOIN, payload);
  }

  cancelQueue() {
    return this.send(ONLINE_EVENTS.QUEUE_CANCEL);
  }

  submitShot(payload) {
    return this.send(ONLINE_EVENTS.SHOT_SUBMIT, payload);
  }

  sendBallSample(payload) {
    return this.send(ONLINE_EVENTS.BALL_SAMPLE, payload);
  }

  completeHole(payload) {
    return this.send(ONLINE_EVENTS.HOLE_COMPLETE, payload);
  }

  requestRematch(matchId) {
    return this.send(ONLINE_EVENTS.REMATCH_REQUEST, { matchId });
  }

  leaveRematch(matchId) {
    return this.send(ONLINE_EVENTS.REMATCH_LEAVE, { matchId });
  }
}
