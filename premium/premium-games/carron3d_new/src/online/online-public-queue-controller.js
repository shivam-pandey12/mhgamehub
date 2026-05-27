import { ONLINE_EVENTS, ONLINE_STATUS } from './online-events.js';

function createInitialState() {
  return {
    status: ONLINE_STATUS.idle,
    connectionStatus: 'Offline',
    queueId: '',
    joinedAt: 0,
    waitMs: 0,
    playersWaiting: 0,
    preferences: null,
    matchFound: null,
    message: 'Find a casual 3D Carrom opponent.',
    error: ''
  };
}

export class OnlinePublicQueueController {
  constructor({ client, callbacks = {} }) {
    this.client = client;
    this.callbacks = callbacks;
    this.state = createInitialState();
    this.boundHandlers = new Map();
  }

  async connect() {
    if (!this.client.connected) {
      this.setState({ status: ONLINE_STATUS.connecting, connectionStatus: 'Connecting...', error: '' });
      await this.client.connect();
    }
    this.bindSocketEvents();
    this.setState({ connectionStatus: 'Connected' });
    return true;
  }

  bindSocketEvents() {
    if (this.boundHandlers.size) {
      return;
    }

    const bind = (eventName, handler) => {
      this.boundHandlers.set(eventName, handler);
      this.client.on(eventName, handler);
    };

    bind(ONLINE_EVENTS.queueJoined, (payload = {}) => {
      this.setState({
        status: ONLINE_STATUS.queued,
        queueId: payload.queueId || '',
        joinedAt: payload.joinedAt || Date.now(),
        waitMs: 0,
        preferences: payload.preferences || null,
        message: payload.estimatedStatus || 'Searching for opponent...',
        error: ''
      });
      this.callbacks.onQueueJoined?.(payload, this.state);
    });

    bind(ONLINE_EVENTS.queueStatus, (payload = {}) => {
      this.setState({
        status: payload.status === 'matched' ? ONLINE_STATUS.matched : ONLINE_STATUS.queued,
        waitMs: Number(payload.waitMs) || this.getWaitMs(),
        playersWaiting: Number(payload.playersWaiting) || 0,
        message: payload.message || 'Searching for opponent...'
      });
      this.callbacks.onQueueStatus?.(payload, this.state);
    });

    bind(ONLINE_EVENTS.queueCancelled, (payload = {}) => {
      this.setState({
        ...createInitialState(),
        connectionStatus: this.client.connected ? 'Connected' : 'Offline',
        message: payload.reason || 'Queue cancelled.'
      });
      this.callbacks.onQueueCancelled?.(payload, this.state);
    });

    bind(ONLINE_EVENTS.matchFound, (payload = {}) => {
      this.setState({
        status: ONLINE_STATUS.matched,
        matchFound: payload,
        queueId: '',
        waitMs: this.getWaitMs(),
        message: `Match found vs ${payload.opponentName || 'opponent'}.`,
        error: ''
      });
      this.callbacks.onMatchFound?.(payload, this.state);
    });

    bind(ONLINE_EVENTS.matchmakingError, (payload = {}) => {
      this.setState({
        status: ONLINE_STATUS.error,
        error: payload.message || 'Matchmaking error.',
        message: payload.message || 'Matchmaking error.'
      });
      this.callbacks.onError?.(payload, this.state);
    });
  }

  async joinQueue({ playerName, preferences }) {
    await this.connect();
    this.setState({
      status: ONLINE_STATUS.connecting,
      connectionStatus: 'Connected',
      message: 'Joining public queue...',
      error: ''
    });
    this.client.emit(ONLINE_EVENTS.joinPublicQueue, { playerName, preferences });
  }

  cancelQueue() {
    if (this.state.status === ONLINE_STATUS.queued || this.state.queueId) {
      this.client.emit(ONLINE_EVENTS.cancelPublicQueue, {});
      return true;
    }
    this.setState({
      ...createInitialState(),
      connectionStatus: this.client.connected ? 'Connected' : 'Offline'
    });
    return false;
  }

  ping() {
    if (this.state.status === ONLINE_STATUS.queued) {
      this.client.emit(ONLINE_EVENTS.queuePing, {});
    }
  }

  readyForMatch(payload = this.state.matchFound || {}) {
    if (!payload.roomCode) {
      return;
    }
    this.client.emit(ONLINE_EVENTS.queueReady, {
      matchId: payload.matchId || '',
      roomCode: payload.roomCode
    });
  }

  getWaitMs() {
    return this.state.joinedAt ? Math.max(Date.now() - this.state.joinedAt, 0) : 0;
  }

  setState(patch = {}) {
    this.state = {
      ...this.state,
      ...patch
    };
    this.callbacks.onChange?.(this.state);
  }

  dispose() {
    this.boundHandlers.forEach((handler, eventName) => {
      this.client.off(eventName, handler);
    });
    this.boundHandlers.clear();
  }
}
