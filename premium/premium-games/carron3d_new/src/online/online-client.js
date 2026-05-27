import { io } from 'socket.io-client';

const SOCKET_NAMESPACE = '/premium-carrom';

function getDefaultSocketUrl() {
  if (typeof window === 'undefined') {
    return SOCKET_NAMESPACE;
  }
  const { protocol, hostname, port, origin } = window.location;
  const devPorts = new Set(['5173', '5174', '4173']);
  if (devPorts.has(port)) {
    return `${protocol}//${hostname}:3001${SOCKET_NAMESPACE}`;
  }
  if (!port || port === '3001') {
    return `${origin}${SOCKET_NAMESPACE}`;
  }
  return `${origin}${SOCKET_NAMESPACE}`;
}

export class OnlineClient {
  constructor({ url = getDefaultSocketUrl() } = {}) {
    this.url = url;
    this.socket = null;
  }

  connect() {
    if (this.socket?.connected) {
      return Promise.resolve(this.socket);
    }

    if (!this.socket) {
      this.socket = io(this.url, {
        autoConnect: false,
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 3
      });
    }

    return new Promise((resolve, reject) => {
      const handleConnect = () => {
        cleanup();
        resolve(this.socket);
      };
      const handleError = (error) => {
        cleanup();
        reject(error instanceof Error ? error : new Error('Could not connect to online server.'));
      };
      const cleanup = () => {
        this.socket.off('connect', handleConnect);
        this.socket.off('connect_error', handleError);
      };
      this.socket.once('connect', handleConnect);
      this.socket.once('connect_error', handleError);
      this.socket.connect();
    });
  }

  emit(eventName, payload = {}) {
    this.socket?.emit(eventName, payload);
  }

  on(eventName, handler) {
    this.socket?.on(eventName, handler);
  }

  off(eventName, handler) {
    this.socket?.off(eventName, handler);
  }

  disconnect() {
    this.socket?.disconnect();
  }

  get connected() {
    return Boolean(this.socket?.connected);
  }

  get id() {
    return this.socket?.id || '';
  }
}
