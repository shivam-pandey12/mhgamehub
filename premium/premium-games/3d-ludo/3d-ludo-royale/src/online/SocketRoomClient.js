import { io } from 'socket.io-client';

function getSocketUrl() {
  const envUrl = import.meta.env.VITE_SOCKET_URL;
  if (envUrl) {
    return envUrl;
  }
  const namespace = import.meta.env.VITE_SOCKET_NAMESPACE || '/premium-ludo';
  const isLocalVitePage = /^\/(?:index\.html)?$/.test(location.pathname) && /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  if (isLocalVitePage && location.port && location.port !== '3001') {
    return `http://localhost:3001${namespace}`;
  }
  return `${location.origin}${namespace}`;
}

function emitWithAck(socket, event, payload = {}, timeout = 5000) {
  return new Promise((resolve) => {
    if (!socket?.connected) {
      resolve({ ok: false, message: 'Online server is unavailable.' });
      return;
    }

    socket.timeout(timeout).emit(event, payload, (error, response) => {
      if (error) {
        resolve({ ok: false, message: 'Online server did not respond.' });
        return;
      }
      resolve(response || { ok: true });
    });
  });
}

export class SocketRoomClient {
  constructor(callbacks = {}) {
    this.callbacks = callbacks;
    this.socket = null;
    this.connected = false;
    this.connecting = false;
    this.serverUrl = getSocketUrl();
  }

  connect() {
    if (this.socket?.connected) {
      return Promise.resolve({ ok: true });
    }
    if (this.connecting) {
      return this.connecting;
    }

    this.socket?.removeAllListeners?.();
    this.socket?.disconnect?.();
    this.socket = io(this.serverUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 4,
      timeout: 3500,
      autoConnect: true
    });

    this.bindSocketEvents();
    this.connecting = new Promise((resolve) => {
      const settle = (payload) => {
        this.connecting = false;
        resolve(payload);
      };
      this.socket.once('connect', () => {
        this.connected = true;
        this.callbacks.onStatus?.('Online server connected.', 'success');
        settle({ ok: true });
      });
      this.socket.once('connect_error', () => {
        this.connected = false;
        this.callbacks.onStatus?.('Online server is unavailable. Local modes still work.', 'danger');
        settle({ ok: false, message: 'Online server is unavailable. Local modes still work.' });
      });
    });

    return this.connecting;
  }

  bindSocketEvents() {
    this.socket.on('connect', () => {
      this.connected = true;
      this.callbacks.onStatus?.('Online server connected.', 'success');
    });
    this.socket.on('disconnect', () => {
      this.connected = false;
      this.callbacks.onStatus?.('Socket disconnected. Reconnecting...', 'danger');
      this.callbacks.onDisconnect?.();
    });
    this.socket.on('room:update', (room) => this.callbacks.onRoomUpdate?.(room));
    this.socket.on('room:error', (error) => this.callbacks.onError?.(error?.message || 'Online action failed.'));
    this.socket.on('room:closed', (payload) => this.callbacks.onClosed?.(payload));
    this.socket.on('game:action', (action) => this.callbacks.onGameAction?.(action));
    this.socket.on('game:snapshot', (snapshot) => this.callbacks.onSnapshot?.(snapshot));
    this.socket.on('matchmaking:update', (payload) => this.callbacks.onMatchmakingUpdate?.(payload));
    this.socket.on('matchmaking:found', (payload) => this.callbacks.onMatchmakingFound?.(payload));
    this.socket.on('matchmaking:cancelled', (payload) => this.callbacks.onMatchmakingCancelled?.(payload));
    this.socket.on('matchmaking:expired', (payload) => this.callbacks.onMatchmakingExpired?.(payload));
    this.socket.on('matchmaking:error', (payload) => this.callbacks.onMatchmakingError?.(payload?.message || 'Matchmaking failed.'));
  }

  async createRoom(payload) {
    const connection = await this.connect();
    if (!connection.ok) {
      return connection;
    }
    return emitWithAck(this.socket, 'room:create', payload);
  }

  async joinRoom(payload) {
    const connection = await this.connect();
    if (!connection.ok) {
      return connection;
    }
    return emitWithAck(this.socket, 'room:join', payload);
  }

  async reconnectToRoom(payload) {
    const connection = await this.connect();
    if (!connection.ok) {
      return connection;
    }
    return emitWithAck(this.socket, 'room:reconnect', payload);
  }

  setReady(payload) {
    return emitWithAck(this.socket, 'room:ready', payload);
  }

  updateLobbyConfig(payload) {
    return emitWithAck(this.socket, 'room:config', payload);
  }

  startMatch(payload) {
    return emitWithAck(this.socket, 'room:start', payload);
  }

  leaveRoom(payload) {
    return emitWithAck(this.socket, 'room:leave', payload);
  }

  requestSnapshot(payload) {
    return emitWithAck(this.socket, 'room:snapshot', payload);
  }

  rollDice(payload) {
    return emitWithAck(this.socket, 'game:roll', payload);
  }

  moveToken(payload) {
    return emitWithAck(this.socket, 'game:move', payload);
  }

  voteRematch(payload) {
    return emitWithAck(this.socket, 'room:rematch-vote', payload);
  }

  cancelRematch(payload) {
    return emitWithAck(this.socket, 'room:rematch-cancel', payload);
  }

  async joinMatchmaking(payload) {
    const connection = await this.connect();
    if (!connection.ok) {
      return connection;
    }
    return emitWithAck(this.socket, 'matchmaking:join', payload);
  }

  cancelMatchmaking(payload) {
    return emitWithAck(this.socket, 'matchmaking:cancel', payload);
  }

  requestMatchmakingSnapshot(payload) {
    return emitWithAck(this.socket, 'matchmaking:snapshot', payload);
  }

  async reconnectMatchmaking(payload) {
    const connection = await this.connect();
    if (!connection.ok) {
      return connection;
    }
    return emitWithAck(this.socket, 'matchmaking:reconnect', payload);
  }
}
