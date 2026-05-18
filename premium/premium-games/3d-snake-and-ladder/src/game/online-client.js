import { io } from "socket.io-client";
import { loadStoredValue, saveStoredValue } from "./storage.js";

export const ONLINE_SESSION_KEY = "slr.online.session.v1";

export class OnlineGameClient {
  constructor(callbacks = {}) {
    this.callbacks = callbacks;
    this.socket = null;
    this.status = "offline";
    this.serverUrl = getSocketUrl();
    this.operationTimer = null;
  }

  connect() {
    if (this.socket?.connected) return this.socket;
    if (this.socket) {
      this.socket.connect();
      return this.socket;
    }

    this.socket = io(this.serverUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      transports: ["websocket", "polling"]
    });

    this.socket.on("connect", () => {
      this.clearOperation();
      this.status = "connected";
      this.callbacks.onStatus?.("connected");
      this.tryReconnect();
    });
    this.socket.on("connect_error", () => {
      this.clearOperation();
      this.status = "unavailable";
      this.callbacks.onStatus?.("unavailable");
    });
    this.socket.on("disconnect", () => {
      this.status = "disconnected";
      this.callbacks.onStatus?.("disconnected");
    });
    this.socket.io.on("reconnect_attempt", () => {
      this.status = "reconnecting";
      this.callbacks.onStatus?.("reconnecting");
    });
    this.socket.io.on("reconnect", () => {
      this.status = "connected";
      this.callbacks.onStatus?.("connected");
      this.tryReconnect();
    });

    [
      "roomCreated",
      "roomJoined",
      "lobbyState",
      "queueState",
      "matchFound",
      "matchStarted",
      "vsIntroReady",
      "stateSnapshot",
      "diceRolled",
      "movementSequence",
      "gameEvent",
      "turnChanged",
      "powerUpState",
      "matchEnded",
      "rematchState",
      "playerDisconnected",
      "playerReconnected",
      "playerReplacedByBot",
      "roomClosed",
      "errorMessage"
    ].forEach((eventName) => {
      this.socket.on(eventName, (payload) => {
        this.clearOperation();
        this.callbacks.onEvent?.(eventName, payload);
      });
    });

    return this.socket;
  }

  retry() {
    this.clearOperation();
    if (this.socket) {
      this.socket.disconnect();
      this.socket.connect();
    } else {
      this.connect();
    }
    this.callbacks.onStatus?.("reconnecting");
  }

  createRoom(payload) {
    this.emit("createRoom", payload);
  }

  joinRoom(payload) {
    this.emit("joinRoom", payload);
  }

  leaveRoom() {
    const sent = this.emit("leaveRoom", {});
    if (sent) this.clearSession();
    return sent;
  }

  updateRoomSettings(payload) {
    this.emit("updateRoomSettings", payload);
  }

  setReady(ready) {
    this.emit("setReady", { ready });
  }

  fillBots() {
    this.emit("fillBots", {});
  }

  startMatch() {
    this.emit("startMatch", {});
  }

  joinPublicQueue(payload) {
    this.emit("joinPublicQueue", payload);
  }

  cancelPublicQueue() {
    this.emit("cancelPublicQueue", {});
  }

  findNewMatch(payload) {
    this.emit("findNewMatch", payload);
  }

  requestRoll() {
    this.emit("requestRoll", {});
  }

  usePowerUp(payload) {
    this.emit("usePowerUp", payload);
  }

  requestRematch(vote = "rematch") {
    this.emit("requestRematch", { vote });
  }

  rememberSession(session) {
    saveStoredValue(ONLINE_SESSION_KEY, session);
  }

  clearSession() {
    saveStoredValue(ONLINE_SESSION_KEY, null);
  }

  tryReconnect() {
    const session = loadStoredValue(ONLINE_SESSION_KEY, null);
    if (!session?.roomCode || !session.playerId || !session.sessionToken) return;
    this.emit("reconnectSession", session);
  }

  emit(eventName, payload) {
    const socket = this.connect();
    if (!socket.connected && eventName !== "reconnectSession") {
      this.callbacks.onStatus?.("unavailable");
      this.callbacks.onEvent?.("errorMessage", { message: "Online server unavailable. Local play still works." });
      return false;
    }
    this.startOperation(eventName);
    socket.emit(eventName, payload);
    return true;
  }

  startOperation(eventName) {
    this.clearOperation();
    this.callbacks.onOperation?.(eventName);
    this.operationTimer = window.setTimeout(() => {
      this.callbacks.onEvent?.("errorMessage", { message: `${getOperationLabel(eventName)} timed out. Please retry.` });
      this.clearOperation();
    }, 10_000);
  }

  clearOperation() {
    window.clearTimeout(this.operationTimer);
    this.operationTimer = null;
  }
}

function getSocketUrl() {
  const envUrl = import.meta.env?.VITE_SOCKET_URL;
  if (envUrl) return envUrl;
  return import.meta.env?.DEV
    ? window.location.origin
    : `${window.location.origin}/premium-snake-ladder`;
}

function getOperationLabel(eventName) {
  return {
    createRoom: "Creating the room",
    joinRoom: "Joining the room",
    joinPublicQueue: "Public matchmaking",
    findNewMatch: "Finding a new match",
    reconnectSession: "Reconnecting",
    requestRematch: "Rematch request",
    leaveRoom: "Leaving the room",
    cancelPublicQueue: "Canceling matchmaking",
    requestRoll: "Roll request",
    usePowerUp: "Power-up request"
  }[eventName] || "Online request";
}
