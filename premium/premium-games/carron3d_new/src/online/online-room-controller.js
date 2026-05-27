import { ONLINE_EVENTS, ONLINE_STATUS } from './online-events.js';

function createInitialState() {
  return {
    status: ONLINE_STATUS.idle,
    connectionStatus: 'Offline',
    roomCode: '',
    playerId: '',
    seat: '',
    roomState: null,
    matchState: null,
    roomType: 'private',
    pendingShot: false,
    reconnectPrompt: null,
    disconnectGrace: null,
    turnTimer: null,
    rematch: null,
    latestServerStateVersion: 0,
    lastRejectedShot: null,
    latencyMs: 0,
    lastSession: null,
    message: 'Create or join a private room.',
    error: ''
  };
}

function normalizeRoomCode(value = '') {
  return String(value).trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
}

export class OnlineRoomController {
  constructor({ client, callbacks = {} }) {
    this.client = client;
    this.callbacks = callbacks;
    this.state = createInitialState();
    this.boundHandlers = new Map();
  }

  getServerStateVersion(payload = {}) {
    const version = payload?.serverStateVersion
      ?? payload?.roomState?.serverStateVersion
      ?? payload?.matchState?.serverStateVersion
      ?? 0;
    return Number.isFinite(Number(version)) ? Number(version) : 0;
  }

  acceptServerPayload(payload = {}) {
    const version = this.getServerStateVersion(payload);
    if (version > 0 && version < (this.state.latestServerStateVersion || 0)) {
      return false;
    }
    if (version > (this.state.latestServerStateVersion || 0)) {
      this.state = {
        ...this.state,
        latestServerStateVersion: version
      };
    }
    const serverTime = Number(payload?.serverTime || payload?.matchState?.serverTime || payload?.roomState?.serverTime);
    if (Number.isFinite(serverTime) && serverTime > 0) {
      this.state = {
        ...this.state,
        latencyMs: Math.max(Date.now() - serverTime, 0)
      };
    }
    return true;
  }

  async connect() {
    if (this.client.connected) {
      this.bindSocketEvents();
      return true;
    }
    this.setState({ status: ONLINE_STATUS.connecting, connectionStatus: 'Connecting...', error: '' });
    await this.client.connect();
    this.bindSocketEvents();
    this.setState({ status: ONLINE_STATUS.connected, connectionStatus: 'Connected' });
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

    bind(ONLINE_EVENTS.roomCreated, (payload) => {
      if (!this.acceptServerPayload(payload)) {
        return;
      }
      this.setState({
        status: ONLINE_STATUS.lobby,
        roomCode: payload.roomCode,
        playerId: payload.playerId,
        seat: payload.seat,
        roomState: payload.roomState,
        roomType: payload.roomState?.roomType || 'private',
        lastSession: payload.session || null,
        message: 'Room created. Share the room code.'
      });
      this.callbacks.onSession?.(payload.session, this.state);
      this.callbacks.onRoomState?.(this.state);
    });

    bind(ONLINE_EVENTS.roomJoined, (payload) => {
      if (!this.acceptServerPayload(payload)) {
        return;
      }
      this.setState({
        status: ONLINE_STATUS.lobby,
        roomCode: payload.roomCode,
        playerId: payload.playerId,
        seat: payload.seat,
        roomState: payload.roomState,
        roomType: payload.roomState?.roomType || 'private',
        lastSession: payload.session || null,
        message: 'Joined room.'
      });
      this.callbacks.onSession?.(payload.session, this.state);
      this.callbacks.onRoomState?.(this.state);
    });

    bind(ONLINE_EVENTS.roomState, (roomState) => {
      if (!this.acceptServerPayload(roomState)) {
        return;
      }
      const closed = roomState?.status === 'closed';
      this.setState({
        roomState,
        roomType: roomState?.roomType || this.state.roomType || 'private',
        matchState: roomState?.matchState || this.state.matchState,
        disconnectGrace: roomState?.disconnectGrace || null,
        turnTimer: roomState?.turnTimer || this.state.turnTimer,
        rematch: roomState?.rematch || this.state.rematch,
        status: closed ? ONLINE_STATUS.disconnected : roomState?.status === 'playing' ? ONLINE_STATUS.playing : ONLINE_STATUS.lobby,
        message: roomState?.message || this.state.message,
        connectionStatus: closed ? 'Opponent left' : 'Connected'
      });
      this.callbacks.onRoomState?.(this.state);
    });

    bind(ONLINE_EVENTS.playerJoined, (payload) => {
      if (!this.acceptServerPayload(payload)) {
        return;
      }
      this.setState({ message: `${payload.player?.name || 'Opponent'} joined.` });
      this.callbacks.onRoomState?.(this.state);
    });

    bind(ONLINE_EVENTS.playerLeft, (payload) => {
      if (!this.acceptServerPayload(payload)) {
        return;
      }
      this.setState({
        status: ONLINE_STATUS.disconnected,
        pendingShot: false,
        connectionStatus: 'Player left',
        message: payload.reason || 'Opponent left.'
      });
      this.callbacks.onPlayerLeft?.(payload, this.state);
    });

    bind(ONLINE_EVENTS.playerDisconnected, (payload) => {
      if (!this.acceptServerPayload(payload)) {
        return;
      }
      this.setState({
        status: ONLINE_STATUS.grace,
        pendingShot: false,
        disconnectGrace: payload,
        connectionStatus: 'Opponent disconnected',
        message: payload.message || 'Opponent disconnected.'
      });
      this.callbacks.onPlayerDisconnected?.(payload, this.state);
    });

    bind(ONLINE_EVENTS.disconnectGraceStarted, (payload) => {
      if (!this.acceptServerPayload(payload)) {
        return;
      }
      this.setState({
        status: ONLINE_STATUS.grace,
        pendingShot: false,
        disconnectGrace: payload,
        connectionStatus: 'Waiting for reconnect',
        message: payload.message || 'Waiting for opponent to reconnect.'
      });
      this.callbacks.onDisconnectGrace?.(payload, this.state);
    });

    bind(ONLINE_EVENTS.disconnectGraceTick, (payload) => {
      if (!this.acceptServerPayload(payload)) {
        return;
      }
      this.setState({
        disconnectGrace: payload,
        connectionStatus: 'Waiting for reconnect',
        message: payload.message || 'Waiting for opponent to reconnect.'
      });
      this.callbacks.onDisconnectGrace?.(payload, this.state);
    });

    bind(ONLINE_EVENTS.disconnectGraceExpired, (payload) => {
      if (!this.acceptServerPayload(payload)) {
        return;
      }
      this.setState({
        status: ONLINE_STATUS.disconnected,
        pendingShot: false,
        disconnectGrace: payload,
        connectionStatus: 'Room closed',
        message: payload.message || 'Opponent did not reconnect.'
      });
      this.callbacks.onDisconnectExpired?.(payload, this.state);
    });

    bind(ONLINE_EVENTS.roomClosed, (payload) => {
      if (!this.acceptServerPayload(payload)) {
        return;
      }
      this.setState({
        status: ONLINE_STATUS.disconnected,
        pendingShot: false,
        connectionStatus: 'Room closed',
        message: payload.reason || 'Room closed.'
      });
      this.callbacks.onRoomClosed?.(payload, this.state);
    });

    bind(ONLINE_EVENTS.playerReconnected, (payload) => {
      if (!this.acceptServerPayload(payload)) {
        return;
      }
      this.setState({
        status: this.state.matchState?.status === 'playing' ? ONLINE_STATUS.playing : this.state.status,
        disconnectGrace: null,
        connectionStatus: 'Connected',
        message: payload.message || 'Player reconnected.'
      });
      this.callbacks.onPlayerReconnected?.(payload, this.state);
    });

    bind(ONLINE_EVENTS.reconnectAccepted, (payload) => {
      if (!this.acceptServerPayload(payload)) {
        return;
      }
      const nextMatchState = payload.matchState || payload.roomState?.matchState || null;
      this.setState({
        status: nextMatchState?.status === 'finished'
          ? ONLINE_STATUS.finished
          : nextMatchState?.status === 'playing' ? ONLINE_STATUS.playing : ONLINE_STATUS.lobby,
        connectionStatus: 'Connected',
        roomCode: payload.roomCode,
        playerId: payload.playerId,
        roomState: payload.roomState,
        roomType: payload.roomState?.roomType || this.state.roomType,
        matchState: nextMatchState,
        disconnectGrace: null,
        rematch: payload.roomState?.rematch || null,
        turnTimer: payload.roomState?.turnTimer || payload.matchState?.turnTimer || null,
        lastSession: payload.session || null,
        pendingShot: false,
        reconnectPrompt: null,
        message: 'Reconnected to online match.'
      });
      this.callbacks.onSession?.(payload.session, this.state);
      this.callbacks.onReconnectAccepted?.(payload, this.state);
    });

    bind(ONLINE_EVENTS.reconnectRejected, (payload) => {
      this.setState({
        status: ONLINE_STATUS.error,
        reconnectPrompt: null,
        error: payload.message || 'Reconnect failed.',
        message: payload.message || 'Reconnect failed.'
      });
      this.callbacks.onReconnectRejected?.(payload, this.state);
    });

    bind(ONLINE_EVENTS.sessionExpired, (payload) => {
      this.setState({
        status: ONLINE_STATUS.error,
        reconnectPrompt: null,
        error: payload.message || 'Session expired.',
        message: payload.message || 'Session expired.'
      });
      this.callbacks.onSessionExpired?.(payload, this.state);
    });

    bind(ONLINE_EVENTS.matchStarted, (payload) => {
      if (!this.acceptServerPayload(payload)) {
        return;
      }
      this.setState({
        status: ONLINE_STATUS.playing,
        roomState: payload.roomState,
        roomType: payload.roomState?.roomType || this.state.roomType || 'private',
        matchState: payload.matchState,
        disconnectGrace: payload.roomState?.disconnectGrace || null,
        turnTimer: payload.matchState?.turnTimer || payload.roomState?.turnTimer || null,
        rematch: payload.matchState?.rematch || payload.roomState?.rematch || null,
        pendingShot: false,
        message: 'Online match started.'
      });
      this.callbacks.onMatchStarted?.(payload.matchState, this.state);
    });

    bind(ONLINE_EVENTS.shotAccepted, (payload) => {
      if (!this.acceptServerPayload(payload)) {
        return;
      }
      this.setState({ pendingShot: true, status: ONLINE_STATUS.waiting, message: 'Shot accepted.' });
      this.callbacks.onShotAccepted?.(payload, this.state);
    });

    bind(ONLINE_EVENTS.shotRejected, (payload) => {
      this.setState({
        pendingShot: false,
        status: ONLINE_STATUS.playing,
        lastRejectedShot: payload || null,
        error: payload.message || 'Shot rejected.',
        message: payload.message || 'Shot rejected.'
      });
      this.callbacks.onShotRejected?.(payload, this.state);
    });

    bind(ONLINE_EVENTS.shotStarted, (payload) => {
      if (!this.acceptServerPayload(payload)) {
        return;
      }
      this.setState({ pendingShot: true, status: ONLINE_STATUS.waiting, message: 'Online shot in motion.' });
      this.callbacks.onShotStarted?.(payload, this.state);
    });

    bind(ONLINE_EVENTS.shotSettled, (payload) => {
      if (!this.acceptServerPayload(payload)) {
        return;
      }
      this.setState({
        pendingShot: false,
        status: payload.matchState?.status === 'finished' ? ONLINE_STATUS.finished : ONLINE_STATUS.playing,
        matchState: payload.matchState,
        turnTimer: payload.matchState?.turnTimer || this.state.turnTimer,
        rematch: payload.matchState?.rematch || this.state.rematch,
        message: 'Shot settled.'
      });
      this.callbacks.onShotSettled?.(payload, this.state);
    });

    bind(ONLINE_EVENTS.matchState, (matchState) => {
      if (!this.acceptServerPayload(matchState)) {
        return;
      }
      this.setState({
        matchState,
        turnTimer: matchState?.turnTimer || this.state.turnTimer,
        rematch: matchState?.rematch || this.state.rematch,
        disconnectGrace: matchState?.disconnectGrace || this.state.disconnectGrace,
        status: matchState?.status === 'finished' ? ONLINE_STATUS.finished : ONLINE_STATUS.playing
      });
      this.callbacks.onMatchState?.(matchState, this.state);
    });

    bind(ONLINE_EVENTS.turnTimer, (payload) => {
      if (!this.acceptServerPayload(payload)) {
        return;
      }
      this.setState({
        turnTimer: payload,
        message: this.state.message
      });
      this.callbacks.onTurnTimer?.(payload, this.state);
    });

    bind(ONLINE_EVENTS.turnTimeout, (payload) => {
      if (!this.acceptServerPayload(payload)) {
        return;
      }
      this.setState({
        pendingShot: false,
        matchState: payload.matchState || this.state.matchState,
        turnTimer: null,
        message: 'Turn timed out.'
      });
      this.callbacks.onTurnTimeout?.(payload, this.state);
    });

    bind(ONLINE_EVENTS.matchFinished, (payload) => {
      if (!this.acceptServerPayload(payload)) {
        return;
      }
      this.setState({
        pendingShot: false,
        status: ONLINE_STATUS.finished,
        matchState: payload.matchState,
        rematch: payload.matchState?.rematch || this.state.rematch,
        message: payload.draw ? 'Online match drawn.' : 'Online match finished.'
      });
      this.callbacks.onMatchFinished?.(payload, this.state);
    });

    bind(ONLINE_EVENTS.rematchRequested, (payload) => {
      if (!this.acceptServerPayload(payload)) {
        return;
      }
      this.setState({
        status: ONLINE_STATUS.rematch,
        rematch: payload.rematch || this.state.rematch,
        message: payload.playerId === this.state.playerId
          ? 'Rematch request sent.'
          : `${payload.playerName || 'Opponent'} wants a rematch.`
      });
      this.callbacks.onRematchRequested?.(payload, this.state);
    });

    bind(ONLINE_EVENTS.rematchDeclined, (payload) => {
      if (!this.acceptServerPayload(payload)) {
        return;
      }
      this.setState({
        status: ONLINE_STATUS.finished,
        rematch: payload.rematch || null,
        message: `${payload.playerName || 'Opponent'} declined rematch.`
      });
      this.callbacks.onRematchDeclined?.(payload, this.state);
    });

    bind(ONLINE_EVENTS.rematchStarted, (payload) => {
      if (!this.acceptServerPayload(payload)) {
        return;
      }
      this.setState({
        status: ONLINE_STATUS.playing,
        roomState: payload.roomState || this.state.roomState,
        matchState: payload.matchState,
        rematch: null,
        pendingShot: false,
        message: 'Rematch started.'
      });
      this.callbacks.onRematchStarted?.(payload, this.state);
    });

    bind(ONLINE_EVENTS.error, (payload) => {
      this.setState({
        status: ONLINE_STATUS.error,
        error: payload.message || 'Online error.',
        message: payload.message || 'Online error.'
      });
      this.callbacks.onError?.(payload, this.state);
    });
  }

  async createRoom({ playerName, matchConfig }) {
    await this.connect();
    this.setState({ message: 'Creating room...', error: '' });
    this.client.emit(ONLINE_EVENTS.createRoom, { playerName, matchConfig });
  }

  async joinRoom({ playerName, roomCode }) {
    await this.connect();
    this.setState({ message: 'Joining room...', error: '' });
    this.client.emit(ONLINE_EVENTS.joinRoom, {
      playerName,
      roomCode: normalizeRoomCode(roomCode)
    });
  }

  leaveRoom() {
    if (this.state.roomCode) {
      this.client.emit(ONLINE_EVENTS.leaveRoom, { roomCode: this.state.roomCode });
    }
    this.setState(createInitialState());
    this.callbacks.onRoomState?.(this.state);
  }

  startMatch() {
    if (!this.state.roomCode) {
      return;
    }
    this.setState({ message: 'Starting match...' });
    this.client.emit(ONLINE_EVENTS.startMatch, { roomCode: this.state.roomCode });
  }

  adoptMatchedRoom(payload = {}) {
    this.bindSocketEvents();
    this.setState({
      status: payload.roomState?.status === 'playing' ? ONLINE_STATUS.playing : ONLINE_STATUS.lobby,
      connectionStatus: 'Connected',
      roomCode: payload.roomCode || payload.roomState?.roomCode || '',
      playerId: payload.playerId || '',
      seat: payload.seat || '',
      lastSession: payload.session || null,
      roomType: payload.roomType || payload.roomState?.roomType || 'public',
      roomState: payload.roomState || null,
      matchState: payload.roomState?.matchState || null,
      pendingShot: false,
      message: `Match found vs ${payload.opponentName || 'opponent'}.`
    });
    this.callbacks.onSession?.(payload.session, this.state);
    this.callbacks.onRoomState?.(this.state);
  }

  submitShot(intent) {
    if (!this.state.roomCode || !this.state.matchState?.matchId || this.state.pendingShot) {
      return false;
    }
    this.setState({ pendingShot: true, status: ONLINE_STATUS.waiting, message: 'Sending shot...' });
    this.client.emit(ONLINE_EVENTS.submitShot, {
      roomCode: this.state.roomCode,
      matchId: this.state.matchState.matchId,
      ...intent
    });
    return true;
  }

  requestRoomState() {
    if (this.state.roomCode) {
      this.client.emit(ONLINE_EVENTS.requestRoomState, { roomCode: this.state.roomCode });
    }
  }

  showReconnectPrompt(session) {
    this.setState({
      status: ONLINE_STATUS.idle,
      reconnectPrompt: session,
      message: 'Reconnect to previous online match?'
    });
  }

  async reconnectRoom(session) {
    await this.connect();
    this.setState({
      status: ONLINE_STATUS.reconnecting,
      connectionStatus: 'Reconnecting...',
      reconnectPrompt: null,
      message: 'Reconnecting...'
    });
    this.client.emit(ONLINE_EVENTS.reconnectRoom, session);
  }

  requestRematch() {
    const matchId = this.state.matchState?.matchId || this.state.roomState?.matchState?.matchId || '';
    if (!this.state.roomCode || !matchId) {
      return false;
    }
    this.client.emit(ONLINE_EVENTS.requestRematch, {
      roomCode: this.state.roomCode,
      matchId
    });
    return true;
  }

  respondRematch(accepted) {
    const matchId = this.state.matchState?.matchId || this.state.roomState?.matchState?.matchId || '';
    if (!this.state.roomCode || !matchId) {
      return false;
    }
    this.client.emit(ONLINE_EVENTS.respondRematch, {
      roomCode: this.state.roomCode,
      matchId,
      accepted: Boolean(accepted)
    });
    return true;
  }

  setState(patch = {}) {
    this.state = {
      ...this.state,
      ...patch
    };
    this.callbacks.onChange?.(this.state);
  }

  getViewModel() {
    const room = this.state.roomState;
    const players = room?.players || [];
    const host = players.find((player) => player.seat === 'host');
    const guest = players.find((player) => player.seat === 'guest');
    return {
      ...this.state,
      host,
      guest,
      isHost: this.state.seat === 'host',
      canStart: this.state.seat === 'host' && room?.status === 'lobby' && Boolean(host && guest),
      hasRoom: Boolean(this.state.roomCode),
      roomStatus: room?.status || 'offline',
      matchConfig: room?.matchConfig || {},
      roomType: room?.roomType || this.state.roomType || 'private',
      reconnectPrompt: this.state.reconnectPrompt,
      disconnectGrace: this.state.disconnectGrace || room?.disconnectGrace || null,
      turnTimer: this.state.turnTimer || room?.turnTimer || null,
      rematch: this.state.rematch || room?.rematch || null,
      latestServerStateVersion: this.state.latestServerStateVersion || 0,
      lastRejectedShot: this.state.lastRejectedShot || null,
      latencyMs: Math.round(Number(this.state.latencyMs) || 0)
    };
  }

  dispose() {
    this.boundHandlers.forEach((handler, eventName) => {
      this.client.off(eventName, handler);
    });
    this.boundHandlers.clear();
    this.client.disconnect();
  }
}
