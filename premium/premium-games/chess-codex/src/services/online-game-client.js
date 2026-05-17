import { io } from 'socket.io-client';

function withTimeout(executor, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error('The server took too long to respond.'));
    }, timeoutMs);

    executor(
      (value) => {
        window.clearTimeout(timeoutId);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timeoutId);
        reject(error);
      }
    );
  });
}

export class OnlineGameClient extends EventTarget {
  constructor(serverUrl) {
    super();
    this.serverUrl = serverUrl;
    this.socket = null;
    this.connectPromise = null;
  }

  ensureSocket() {
    if (this.socket) {
      return this.socket;
    }

    this.socket = io(this.serverUrl, {
      autoConnect: false,
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      this.dispatchEvent(new CustomEvent('connection', {
        detail: {
          connected: true,
          message: 'Connected to the match server.'
        }
      }));
    });

    this.socket.on('disconnect', (reason) => {
      this.dispatchEvent(new CustomEvent('connection', {
        detail: {
          connected: false,
          message: `Disconnected: ${reason}`
        }
      }));
    });

    this.socket.on('roomState', (detail) => {
      this.dispatchEvent(new CustomEvent('roomState', { detail }));
    });

    this.socket.on('playerJoined', (detail) => {
      this.dispatchEvent(new CustomEvent('playerJoined', { detail }));
    });

    this.socket.on('playerPresence', (detail) => {
      this.dispatchEvent(new CustomEvent('playerPresence', { detail }));
    });

    this.socket.on('opponentMove', (detail) => {
      this.dispatchEvent(new CustomEvent('opponentMove', { detail }));
    });

    this.socket.on('opponentLeft', (detail) => {
      this.dispatchEvent(new CustomEvent('opponentLeft', { detail }));
    });

    this.socket.on('undoRequested', (detail) => {
      this.dispatchEvent(new CustomEvent('undoRequested', { detail }));
    });

    this.socket.on('undoResolved', (detail) => {
      this.dispatchEvent(new CustomEvent('undoResolved', { detail }));
    });

    this.socket.on('undoApplied', (detail) => {
      this.dispatchEvent(new CustomEvent('undoApplied', { detail }));
    });

    this.socket.on('drawRequested', (detail) => {
      this.dispatchEvent(new CustomEvent('drawRequested', { detail }));
    });

    this.socket.on('drawResolved', (detail) => {
      this.dispatchEvent(new CustomEvent('drawResolved', { detail }));
    });

    this.socket.on('drawAccepted', (detail) => {
      this.dispatchEvent(new CustomEvent('drawAccepted', { detail }));
    });

    this.socket.on('rematchRequested', (detail) => {
      this.dispatchEvent(new CustomEvent('rematchRequested', { detail }));
    });

    this.socket.on('rematchResolved', (detail) => {
      this.dispatchEvent(new CustomEvent('rematchResolved', { detail }));
    });

    this.socket.on('rematchStarted', (detail) => {
      this.dispatchEvent(new CustomEvent('rematchStarted', { detail }));
    });

    this.socket.on('gameOver', (detail) => {
      this.dispatchEvent(new CustomEvent('gameOver', { detail }));
    });

    this.socket.on('serverError', (detail) => {
      this.dispatchEvent(new CustomEvent('serverError', { detail }));
    });

    this.socket.on('public_matchmaking_status', (detail) => {
      this.dispatchEvent(new CustomEvent('publicMatchmakingStatus', { detail }));
    });

    this.socket.on('public_match_found', (detail) => {
      this.dispatchEvent(new CustomEvent('publicMatchFound', { detail }));
    });

    this.socket.on('public_bot_match_found', (detail) => {
      this.dispatchEvent(new CustomEvent('publicBotMatchFound', { detail }));
    });

    return this.socket;
  }

  async connect() {
    const socket = this.ensureSocket();
    if (socket.connected) {
      return;
    }

    if (this.connectPromise) {
      return this.connectPromise;
    }

    this.connectPromise = withTimeout((resolve, reject) => {
      const handleConnect = () => {
        socket.off('connect_error', handleError);
        resolve();
      };

      const handleError = (error) => {
        socket.off('connect', handleConnect);
        reject(error instanceof Error ? error : new Error('Unable to reach the match server.'));
      };

      socket.once('connect', handleConnect);
      socket.once('connect_error', handleError);
      socket.connect();
    }).finally(() => {
      this.connectPromise = null;
    });

    return this.connectPromise;
  }

  async emitWithAck(eventName, payload = {}) {
    await this.connect();
    const socket = this.ensureSocket();

    return withTimeout((resolve, reject) => {
      socket.emit(eventName, payload, (response) => {
        if (response?.ok) {
          resolve(response);
          return;
        }

        reject(new Error(response?.error || 'The server rejected the request.'));
      });
    });
  }

  async createRoom(preferredColor = 'auto', playerName = '') {
    return this.emitWithAck('createRoom', { preferredColor, playerName });
  }

  async joinRoom(roomId, preferredColor = 'auto', playerName = '') {
    return this.emitWithAck('joinRoom', { roomId, preferredColor, playerName });
  }

  async reconnectRoom(roomId, playerToken, playerName = '') {
    return this.emitWithAck('reconnectRoom', { roomId, playerToken, playerName });
  }

  async startMatch(roomId) {
    return this.emitWithAck('startMatch', { roomId });
  }

  async sendMove(roomId, move) {
    return this.emitWithAck('move', { roomId, move });
  }

  async requestUndo(roomId) {
    return this.emitWithAck('requestUndo', { roomId });
  }

  async respondToUndo(roomId, accept) {
    return this.emitWithAck('respondUndo', { roomId, accept });
  }

  async requestDraw(roomId) {
    return this.emitWithAck('requestDraw', { roomId });
  }

  async respondToDraw(roomId, accept) {
    return this.emitWithAck('respondDraw', { roomId, accept });
  }

  async requestRematch(roomId) {
    return this.emitWithAck('requestRematch', { roomId });
  }

  async respondToRematch(roomId, accept) {
    return this.emitWithAck('respondRematch', { roomId, accept });
  }

  async leaveRoom(roomId) {
    return this.emitWithAck('leaveRoom', { roomId });
  }

  async joinPublicMatchmaking({ playerName = '', preferredColor = 'auto' } = {}) {
    return this.emitWithAck('public_matchmaking_join', { playerName, preferredColor });
  }

  async cancelPublicMatchmaking() {
    return this.emitWithAck('public_matchmaking_cancel');
  }

  async markPublicIntroComplete(roomId) {
    return this.emitWithAck('public_match_intro_complete', { roomId });
  }

  destroy() {
    if (!this.socket) {
      return;
    }

    this.socket.disconnect();
    this.socket = null;
    this.connectPromise = null;
  }
}
