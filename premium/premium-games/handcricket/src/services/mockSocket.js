// @ts-check

import { CONNECTION_STATUS } from "../config/constants.js";

let socketClientLoader = null;
const MAX_PENDING_EMITS = 24;
const ACK_TIMEOUT_MS = 10000;

/**
 * @returns {string}
 */
function resolveSocketUrl() {
  const override = window.MH_HANDREX_SOCKET_URL;
  if (typeof override === "string" && override.trim()) {
    return override.trim().replace(/\/$/, "");
  }

  if (window.location.protocol.startsWith("http")) {
    const params = new URLSearchParams(window.location.search);
    const isPremiumEmbed =
      params.get("gamehubShell") === "premium" ||
      params.get("gamehubEmbedded") === "1";

    if (isPremiumEmbed) {
      return `${window.location.origin}/premium-handcricket`;
    }

    return window.location.origin;
  }

  return "http://localhost:4000";
}

/**
 * @param {string} url
 * @returns {string}
 */
function resolveSocketOrigin(url) {
  try {
    return new URL(url, window.location.href).origin;
  } catch (_error) {
    return window.location.protocol.startsWith("http") ? window.location.origin : "http://localhost:4000";
  }
}

/**
 * Load the official browser Socket.io client from the backend server so the
 * frontend can keep running without a bundler step.
 *
 * @param {string} url
 * @returns {Promise<(url: string, options?: any) => any>}
 */
function loadSocketClient(url) {
  if (typeof window.io === "function") {
    return Promise.resolve(window.io);
  }

  if (socketClientLoader) {
    return socketClientLoader;
  }

  socketClientLoader = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${resolveSocketOrigin(url)}/socket.io/socket.io.js`;
    script.async = true;

    script.onload = () => {
      if (typeof window.io === "function") {
        resolve(window.io);
        return;
      }

      reject(new Error("Socket.io client loaded but window.io was unavailable."));
    };

    script.onerror = () => {
      reject(new Error("Failed to load Socket.io client from backend."));
    };

    document.head.append(script);
  });

  return socketClientLoader;
}

/**
 * @param {string} eventName
 * @returns {boolean}
 */
function isSyntheticEvent(eventName) {
  return eventName.startsWith("connection:") || eventName.startsWith("socket:") || eventName.startsWith("match:");
}

export class MockSocket {
  constructor() {
    this.url = resolveSocketUrl();
    this.socket = null;
    this.listeners = new Map();
    this.serverListeners = new Map();
    this.timers = new Set();
    this.pendingEmits = [];
    this.initializing = null;

    void this.initialize();
  }

  async initialize() {
    if (this.socket) {
      return this.socket;
    }

    if (this.initializing) {
      return this.initializing;
    }

    this.emitLocal("connection:status", {
      status: CONNECTION_STATUS.RECONNECTING,
      note: "Connecting to realtime backend...",
    });

    this.initializing = loadSocketClient(this.url)
      .then((createSocket) => {
        this.socket = createSocket(this.url, {
          autoConnect: true,
          reconnection: true,
          reconnectionDelay: 500,
          reconnectionDelayMax: 4000,
          randomizationFactor: 0.5,
          timeout: 8000,
          path: "/socket.io",
          transports: ["websocket", "polling"],
        });

        this.registerCoreHandlers();
        this.bindQueuedServerListeners();
        if (this.socket.connected) {
          this.flushPendingEmits();
        }
        return this.socket;
      })
      .catch((error) => {
        this.pendingEmits.splice(0).forEach((request) => {
          request.ack?.({
            ok: false,
            error:
              error instanceof Error
                ? error.message
                : "Unable to connect to the realtime backend.",
          });
        });

        this.emitLocal("connection:status", {
          status: CONNECTION_STATUS.OFFLINE,
          note:
            error instanceof Error
              ? error.message
              : "Unable to connect to the realtime backend.",
        });
        return null;
      })
      .finally(() => {
        this.initializing = null;
      });

    return this.initializing;
  }

  registerCoreHandlers() {
    if (!this.socket) {
      return;
    }

    this.socket.on("connect", () => {
      this.emitLocal("connection:status", {
        status: CONNECTION_STATUS.CONNECTED,
        note: "Connected to realtime backend",
      });
      this.flushPendingEmits();
    });

    this.socket.on("connect_error", () => {
      this.emitLocal("connection:status", {
        status: CONNECTION_STATUS.RECONNECTING,
        note: "Trying to reach realtime backend...",
      });
    });

    this.socket.on("disconnect", (reason) => {
      this.emitLocal("connection:status", {
        status: CONNECTION_STATUS.OFFLINE,
        note: `Disconnected: ${reason}`,
      });
    });

    this.socket.on("connected", (payload) => {
      this.emitLocal("socket:connected", payload);
    });

    this.socket.on("player_left", (payload) => {
      this.emitLocal("match:playerLeft", {
        roomId: payload?.roomId ?? null,
        playerId: payload?.playerId ?? null,
        note: payload?.reason ?? "Player left the room.",
      });
    });
  }

  bindQueuedServerListeners() {
    if (!this.socket) {
      return;
    }

    this.serverListeners.forEach((handlers, eventName) => {
      handlers.forEach((handler) => {
        this.socket.on(eventName, handler);
      });
    });
  }

  flushPendingEmits() {
    if (!this.socket || !this.pendingEmits.length) {
      return;
    }

    const pending = this.pendingEmits.splice(0);
    pending.forEach((request) => {
      this.emitNow(request.eventName, request.payload, request.ack);
    });
  }

  /**
   * @param {{ eventName: string; payload: any; ack?: (response: any) => void }} request
   */
  queueEmit(request) {
    if (this.pendingEmits.length >= MAX_PENDING_EMITS) {
      const dropped = this.pendingEmits.shift();
      dropped?.ack?.({
        ok: false,
        error: "Realtime connection is busy. Please try that action again.",
      });
    }

    this.pendingEmits.push(request);
  }

  /**
   * @param {string} eventName
   * @param {any} payload
   * @param {(response: any) => void} [ack]
   */
  emitNow(eventName, payload, ack) {
    if (!this.socket) {
      ack?.({
        ok: false,
        error: "Realtime backend is not ready yet.",
      });
      return;
    }

    if (typeof ack !== "function") {
      this.socket.emit(eventName, payload);
      return;
    }

    let settled = false;
    const timeout = window.setTimeout(() => {
      if (settled) {
        return;
      }

      settled = true;
      ack({
        ok: false,
        error: "Realtime action timed out. Please try again.",
      });
    }, ACK_TIMEOUT_MS);

    this.socket.emit(eventName, payload, (response) => {
      if (settled) {
        return;
      }

      settled = true;
      window.clearTimeout(timeout);
      ack(response);
    });
  }

  /**
   * @param {string} eventName
   * @param {(payload: any) => void} handler
   * @returns {() => void}
   */
  on(eventName, handler) {
    const targetMap = isSyntheticEvent(eventName) ? this.listeners : this.serverListeners;
    const handlers = targetMap.get(eventName) ?? new Set();
    handlers.add(handler);
    targetMap.set(eventName, handlers);

    if (!isSyntheticEvent(eventName) && this.socket) {
      this.socket.on(eventName, handler);
    }

    return () => {
      handlers.delete(handler);

      if (!isSyntheticEvent(eventName) && this.socket) {
        this.socket.off(eventName, handler);
      }
    };
  }

  /**
   * @param {string} eventName
   * @param {any} payload
   */
  emitLocal(eventName, payload) {
    const handlers = this.listeners.get(eventName);
    if (!handlers) {
      return;
    }

    handlers.forEach((handler) => handler(payload));
  }

  /**
   * @param {string} eventName
   * @param {any} payload
   * @param {(response: any) => void} [ack]
   */
  emit(eventName, payload, ack) {
    if (!this.socket || !this.socket.connected) {
      this.queueEmit({
        eventName,
        payload,
        ack,
      });

      if (!this.socket) {
        void this.initialize();
      } else {
        this.socket.connect();
      }

      return;
    }

    this.emitNow(eventName, payload, ack);
  }

  /**
   * Kept for compatibility with the old mock transport API.
   *
   * @param {string} eventName
   * @param {any} payload
   * @param {number} [delay]
   * @param {(response: any) => void} [ack]
   * @returns {number}
   */
  broadcast(eventName, payload, delay = 0, ack) {
    const timer = window.setTimeout(() => {
      this.timers.delete(timer);
      this.emit(eventName, payload, ack);
    }, delay);

    this.timers.add(timer);
    return timer;
  }

  clear() {
    this.timers.forEach((timer) => window.clearTimeout(timer));
    this.timers.clear();
  }

  reconnect() {
    if (!this.socket) {
      void this.initialize();
      return;
    }

    if (this.socket.connected) {
      this.emitLocal("connection:status", {
        status: CONNECTION_STATUS.CONNECTED,
        note: "Realtime link already active",
      });
      return;
    }

    this.emitLocal("connection:status", {
      status: CONNECTION_STATUS.RECONNECTING,
      note: "Reconnecting to realtime backend...",
    });
    this.socket.connect();
  }

  disconnect() {
    this.clear();
    this.pendingEmits.splice(0).forEach((request) => {
      request.ack?.({
        ok: false,
        error: "Realtime connection closed before the action was sent.",
      });
    });
    this.socket?.disconnect();
  }

  get id() {
    return this.socket?.id ?? null;
  }
}
