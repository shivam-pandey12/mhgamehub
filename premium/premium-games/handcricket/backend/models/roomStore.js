import { createRoomId } from "../utils/idGenerator.js";
import {
  HANDREX_RUNTIME_LIMITS,
  clampInteger,
  normalizePlayerKey,
  normalizeText,
} from "../utils/runtimeGuards.js";
import { getDefaultNumberSet, resolveNumberSetSettings } from "../../src/engine/numberSets.js";

const DEFAULT_MAX_PLAYERS = 2;
const DEFAULT_TEAM_SIZE = 1;
const MAX_TEAM_SIZE = 11;
const DISCONNECT_GRACE_MS = HANDREX_RUNTIME_LIMITS.disconnectGraceMs;
const DEFAULT_SETTINGS = {
  matchMode: "two-batsmen",
  bowlingMode: "over-locked",
  overs: 2,
  ...getDefaultNumberSet(),
};
const DEFAULT_TEAM_NAMES = {
  alpha: "Alpha XI",
  beta: "Beta XI",
};
const JOINABLE_STATUSES = new Set(["waiting", "lobby", "ready"]);

/**
 * @param {string | null | undefined} hostId
 * @returns {{ alpha: string[]; beta: string[] }}
 */
function createTeamSelections(hostId) {
  return {
    alpha: hostId ? [hostId] : [],
    beta: [],
  };
}

/**
 * @param {string | undefined} value
 * @param {string} fallback
 * @returns {string}
 */
function normalizeTeamName(value, fallback) {
  return normalizeText(value, fallback, HANDREX_RUNTIME_LIMITS.maxTeamNameLength);
}

/**
 * @param {number} teamSize
 * @returns {number}
 */
function normalizeTeamSize(teamSize) {
  return clampInteger(teamSize, DEFAULT_TEAM_SIZE, 1, MAX_TEAM_SIZE);
}

/**
 * @param {string | undefined} value
 * @param {string} fallback
 * @returns {string}
 */
function normalizePlayerName(value, fallback) {
  return normalizeText(value, fallback, HANDREX_RUNTIME_LIMITS.maxPlayerNameLength);
}

/**
 * @param {any} settings
 * @param {number} teamSize
 * @param {any} fallbackSettings
 * @returns {any}
 */
function resolveRoomSettings(settings, teamSize, fallbackSettings = DEFAULT_SETTINGS) {
  const source = settings && typeof settings === "object" ? settings : {};
  const fallbackMatchMode = fallbackSettings.matchMode === "single" ? "single" : DEFAULT_SETTINGS.matchMode;
  const fallbackBowlingMode =
    fallbackSettings.bowlingMode === "free-change" ? "free-change" : DEFAULT_SETTINGS.bowlingMode;
  const matchMode = source.matchMode === "single" ? "single" : fallbackMatchMode;
  const bowlingMode = source.bowlingMode === "free-change" ? "free-change" : fallbackBowlingMode;
  const numberSet = resolveNumberSetSettings(source, fallbackSettings);

  if (!numberSet.ok) {
    return {
      error: numberSet.error,
    };
  }

  return {
    settings: {
      matchMode,
      bowlingMode,
      overs: clampInteger(source.overs, fallbackSettings.overs ?? DEFAULT_SETTINGS.overs, 1, HANDREX_RUNTIME_LIMITS.maxOvers),
      inputTimeoutMs: clampInteger(
        source.inputTimeoutMs,
        fallbackSettings.inputTimeoutMs ?? 15000,
        5000,
        HANDREX_RUNTIME_LIMITS.maxInputTimeoutMs,
      ),
      controlMode: normalizeText(source.controlMode, fallbackSettings.controlMode ?? "", 32),
      playersPerTeam: teamSize,
      ...numberSet.settings,
    },
  };
}

/**
 * @param {any} room
 */
function touchRoom(room) {
  if (room) {
    room.updatedAt = Date.now();
  }
}

/**
 * @param {any} room
 */
function resetReadyStates(room) {
  room.players = room.players.map((player) => ({
    ...player,
    ready: false,
  }));
}

/**
 * @param {any} room
 */
function syncPreMatchStatus(room) {
  if (room.players.length < room.maxPlayers) {
    room.status = "waiting";
    return;
  }

  room.status = room.players.every((entry) => entry.ready) ? "ready" : "lobby";
}

/**
 * @param {any} room
 */
function sanitizeTeamSelections(room) {
  const validIds = new Set(room.players.map((player) => player.id));
  const assigned = new Set();
  const nextSelections = {
    alpha: [],
    beta: [],
  };

  ["alpha", "beta"].forEach((side) => {
    const source = Array.isArray(room.teamSelections?.[side]) ? room.teamSelections[side] : [];
    source.forEach((playerId) => {
      if (
        !validIds.has(playerId) ||
        assigned.has(playerId) ||
        nextSelections[side].length >= room.teamSize
      ) {
        return;
      }

      nextSelections[side].push(playerId);
      assigned.add(playerId);
    });
  });

  room.teamSelections = nextSelections;
  return nextSelections;
}

/**
 * @param {any} room
 * @param {string} playerId
 * @returns {"alpha" | "beta" | null}
 */
function getAssignedTeamId(room, playerId) {
  const selections = sanitizeTeamSelections(room);

  if (selections.alpha.includes(playerId)) {
    return "alpha";
  }

  if (selections.beta.includes(playerId)) {
    return "beta";
  }

  return null;
}

/**
 * @param {any} room
 * @returns {boolean}
 */
function hasFullTeamSelections(room) {
  const selections = sanitizeTeamSelections(room);
  return selections.alpha.length === room.teamSize && selections.beta.length === room.teamSize;
}

/**
 * @param {any} room
 */
function syncCaptains(room) {
  const selections = sanitizeTeamSelections(room);
  const alphaIds = selections.alpha;
  const betaIds = selections.beta;
  const nextAlphaCaptain = alphaIds.includes(room.captains.alpha)
    ? room.captains.alpha
    : alphaIds.includes(room.hostId)
      ? room.hostId
      : alphaIds[0] ?? null;

  room.captains.alpha = nextAlphaCaptain;
  room.captains.beta =
    betaIds.includes(room.captains.beta) && room.captains.beta !== nextAlphaCaptain
      ? room.captains.beta
      : betaIds.find((playerId) => playerId !== nextAlphaCaptain) ?? null;
}

/**
 * @param {string} roomId
 * @param {string} playerKey
 * @returns {string}
 */
function createDisconnectTimerKey(roomId, playerKey) {
  return `${roomId}:${playerKey}`;
}

/**
 * @param {string} socketId
 * @param {string} name
 * @param {string} playerKey
 * @returns {{ id: string; playerKey: string; name: string; ready: boolean; connected: boolean; joinedAt: number }}
 */
function createPlayer(socketId, name, playerKey) {
  return {
    id: socketId,
    playerKey: normalizePlayerKey(playerKey, socketId),
    name: normalizePlayerName(name, "Player"),
    ready: false,
    connected: true,
    joinedAt: Date.now(),
    disconnectedAt: null,
  };
}

export class RoomStore {
  constructor({ maxPlayers = DEFAULT_MAX_PLAYERS, maxRooms = HANDREX_RUNTIME_LIMITS.maxRooms } = {}) {
    this.maxPlayers = maxPlayers;
    this.maxRooms = maxRooms;
    this.rooms = new Map();
    this.socketToRoom = new Map();
    this.disconnectTimers = new Map();
  }

  countRooms() {
    return this.rooms.size;
  }

  getStats() {
    const statuses = {};
    let players = 0;
    let connectedPlayers = 0;
    let staleDisconnectedPlayers = 0;
    const now = Date.now();

    this.rooms.forEach((room) => {
      statuses[room.status] = (statuses[room.status] ?? 0) + 1;
      players += room.players.length;
      connectedPlayers += room.players.filter((player) => player.connected !== false).length;
      staleDisconnectedPlayers += room.players.filter(
        (player) => player.connected === false && player.disconnectedAt && now - player.disconnectedAt > DISCONNECT_GRACE_MS,
      ).length;
    });

    return {
      total: this.rooms.size,
      players,
      connectedPlayers,
      staleDisconnectedPlayers,
      disconnectTimers: this.disconnectTimers.size,
      statuses,
    };
  }

  /**
   * @param {string} roomId
   * @returns {any | null}
   */
  getRoom(roomId) {
    return this.rooms.get(roomId) ?? null;
  }

  /**
   * @param {string} socketId
   * @returns {string | null}
   */
  getRoomIdBySocketId(socketId) {
    return this.socketToRoom.get(socketId) ?? null;
  }

  /**
   * @param {string} socketId
   * @returns {any | null}
   */
  getRoomBySocketId(socketId) {
    const roomId = this.getRoomIdBySocketId(socketId);
    return roomId ? this.getRoom(roomId) : null;
  }

  /**
   * @param {string} roomId
   * @param {string} playerKey
   * @returns {any | null}
   */
  getPlayerByKey(roomId, playerKey) {
    const room = this.getRoom(roomId);
    return room?.players.find((player) => player.playerKey === playerKey) ?? null;
  }

  /**
   * @param {string} roomId
   * @param {string} playerKey
   */
  clearDisconnectExpiry(roomId, playerKey) {
    const timerKey = createDisconnectTimerKey(roomId, playerKey);
    const timer = this.disconnectTimers.get(timerKey);

    if (!timer) {
      return;
    }

    clearTimeout(timer);
    this.disconnectTimers.delete(timerKey);
  }

  /**
   * @param {string} roomId
   * @param {string} playerKey
   * @param {() => void} onExpire
   * @param {number} [timeoutMs]
   */
  scheduleDisconnectExpiry(roomId, playerKey, onExpire, timeoutMs = DISCONNECT_GRACE_MS) {
    this.clearDisconnectExpiry(roomId, playerKey);
    const timerKey = createDisconnectTimerKey(roomId, playerKey);
    const timer = setTimeout(() => {
      this.disconnectTimers.delete(timerKey);
      onExpire();
    }, timeoutMs);

    timer.unref?.();
    this.disconnectTimers.set(timerKey, timer);
  }

  /**
   * @param {{ socketId: string; playerKey?: string; playerName?: string; teamSize?: number; settings?: any }} options
   * @returns {{ room?: any; error?: string }}
   */
  createRoom({ socketId, playerKey = socketId, playerName = "Player 1", teamSize = DEFAULT_TEAM_SIZE, settings = {} }) {
    if (this.rooms.size >= this.maxRooms) {
      return { error: "Realtime room capacity is full. Please try again in a moment." };
    }

    let roomId = "";
    try {
      roomId = createRoomId((candidate) => !this.rooms.has(candidate));
    } catch {
      return { error: "Unable to allocate a room code. Please try again." };
    }
    const normalizedTeamSize = normalizeTeamSize(teamSize);
    const maxPlayers = normalizedTeamSize * 2;
    const resolvedSettings = resolveRoomSettings(settings, normalizedTeamSize);

    if (resolvedSettings.error || !resolvedSettings.settings) {
      return { error: resolvedSettings.error ?? "Invalid room settings." };
    }

    const room = {
      roomId,
      hostId: socketId,
      status: "waiting",
      teamSize: normalizedTeamSize,
      maxPlayers,
      settings: resolvedSettings.settings,
      captains: {
        alpha: socketId,
        beta: null,
      },
      teamSelections: createTeamSelections(socketId),
      teamNames: {
        ...DEFAULT_TEAM_NAMES,
      },
      tossResult: null,
      players: [createPlayer(socketId, playerName, playerKey)],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.rooms.set(roomId, room);
    this.socketToRoom.set(socketId, roomId);
    syncCaptains(room);
    return { room };
  }

  /**
   * @param {{ roomId: string; socketId: string; playerKey?: string; playerName?: string }} options
   * @returns {{ room?: any; error?: string }}
   */
  joinRoom({ roomId, socketId, playerKey = socketId, playerName = "Player 2" }) {
    const room = this.rooms.get(roomId);
    const normalizedPlayerKey = normalizePlayerKey(playerKey, socketId);

    if (!room) {
      return { error: "Room not found." };
    }

    if (this.socketToRoom.has(socketId)) {
      return { error: "Socket already belongs to a room." };
    }

    if (room.players.some((player) => player.playerKey === normalizedPlayerKey)) {
      return { error: "This player session is already linked to the room. Try resuming instead." };
    }

    if (!JOINABLE_STATUSES.has(room.status)) {
      return { error: "This room has already moved past the joinable stage." };
    }

    if (room.players.length >= room.maxPlayers) {
      return { error: "Room is full." };
    }

    room.players.push(createPlayer(socketId, playerName, normalizedPlayerKey));
    room.status = room.players.length === room.maxPlayers ? "lobby" : "waiting";
    this.socketToRoom.set(socketId, roomId);
    syncCaptains(room);
    touchRoom(room);

    return { room };
  }

  /**
   * @param {string} socketId
   * @param {boolean} ready
   * @returns {any | null}
   */
  setPlayerReady(socketId, ready) {
    const room = this.getRoomBySocketId(socketId);

    if (!room) {
      return null;
    }

    const player = room.players.find((entry) => entry.id === socketId);
    if (!player) {
      return null;
    }

    if (!JOINABLE_STATUSES.has(room.status)) {
      return null;
    }

    player.ready = Boolean(ready);
    syncPreMatchStatus(room);
    touchRoom(room);

    return room;
  }

  /**
   * @param {string} roomId
   * @param {string} status
   * @returns {any | null}
   */
  updateStatus(roomId, status) {
    const room = this.getRoom(roomId);

    if (!room) {
      return null;
    }

    room.status = status;
    touchRoom(room);
    return room;
  }

  /**
   * @param {string} roomId
   * @param {{ settings?: any; captains?: { alpha?: string | null; beta?: string | null }; teamNames?: { alpha?: string; beta?: string } }} patch
   * @returns {{ room?: any; error?: string }}
   */
  updateRoomConfig(roomId, patch = {}) {
    const room = this.getRoom(roomId);

    if (!room) {
      return { error: "Room not found." };
    }

    if (room.status === "live" || room.status === "completed") {
      return { error: "Room settings cannot be changed after the match starts." };
    }

    if (patch.settings) {
      const resolvedSettings = resolveRoomSettings(patch.settings, room.teamSize, room.settings);

      if (resolvedSettings.error || !resolvedSettings.settings) {
        return { error: resolvedSettings.error ?? "Invalid room settings." };
      }

      room.settings = resolvedSettings.settings;
    }

    if (patch.captains) {
      const nextCaptains = {
        ...room.captains,
        ...patch.captains,
      };

      if (nextCaptains.alpha && !room.teamSelections.alpha.includes(nextCaptains.alpha)) {
        return { error: "Alpha captain must belong to Alpha team." };
      }

      if (nextCaptains.beta && !room.teamSelections.beta.includes(nextCaptains.beta)) {
        return { error: "Beta captain must belong to Beta team." };
      }

      if (nextCaptains.alpha && nextCaptains.alpha === nextCaptains.beta) {
        return { error: "Alpha and Beta captains must be different players." };
      }

      room.captains = nextCaptains;
    }

    if (patch.teamNames) {
      room.teamNames = {
        alpha: normalizeTeamName(patch.teamNames.alpha, room.teamNames?.alpha ?? DEFAULT_TEAM_NAMES.alpha),
        beta: normalizeTeamName(patch.teamNames.beta, room.teamNames?.beta ?? DEFAULT_TEAM_NAMES.beta),
      };
    }

    syncCaptains(room);
    touchRoom(room);

    return { room };
  }

  /**
   * @param {{ roomId: string; actorSocketId: string; targetPlayerId: string; teamId?: "alpha" | "beta" | null }} options
   * @returns {{ room?: any; error?: string }}
   */
  setPlayerTeam({ roomId, actorSocketId, targetPlayerId, teamId = null }) {
    const room = this.getRoom(roomId);

    if (!room) {
      return { error: "Room not found." };
    }

    if (!JOINABLE_STATUSES.has(room.status)) {
      return { error: "Team sides can only be changed before the toss starts." };
    }

    if (actorSocketId !== room.hostId && actorSocketId !== targetPlayerId) {
      return { error: "You can only change your own team side." };
    }

    if (!room.players.some((player) => player.id === targetPlayerId)) {
      return { error: "Player not found in this room." };
    }

    const normalizedTeamId = teamId === "alpha" || teamId === "beta" ? teamId : null;
    const currentTeamId = getAssignedTeamId(room, targetPlayerId);

    if (currentTeamId === normalizedTeamId) {
      return { room };
    }

    if (normalizedTeamId && room.teamSelections[normalizedTeamId].length >= room.teamSize) {
      return {
        error: `${normalizedTeamId === "alpha" ? "Alpha" : "Beta"} team is already full.`,
      };
    }

    room.teamSelections.alpha = room.teamSelections.alpha.filter((playerId) => playerId !== targetPlayerId);
    room.teamSelections.beta = room.teamSelections.beta.filter((playerId) => playerId !== targetPlayerId);

    if (normalizedTeamId) {
      room.teamSelections[normalizedTeamId].push(targetPlayerId);
    }

    syncCaptains(room);
    syncPreMatchStatus(room);
    touchRoom(room);

    return { room };
  }

  /**
   * @param {string} socketId
   * @returns {{ roomId: string; room: any; player: any } | null}
   */
  markPlayerDisconnected(socketId) {
    const roomId = this.getRoomIdBySocketId(socketId);
    const room = roomId ? this.getRoom(roomId) : null;

    if (!roomId || !room) {
      return null;
    }

    const player = room.players.find((entry) => entry.id === socketId);
    if (!player) {
      return null;
    }

    player.connected = false;
    player.disconnectedAt = Date.now();
    if (room.status !== "live" && room.status !== "completed") {
      player.ready = false;
      syncPreMatchStatus(room);
    }
    this.socketToRoom.delete(socketId);
    touchRoom(room);

    return {
      roomId,
      room,
      player,
    };
  }

  /**
   * @param {{ roomId: string; socketId: string; playerKey: string; playerName?: string }} options
   * @returns {{ room?: any; player?: any; oldSocketId?: string; error?: string }}
   */
  resumePlayer({ roomId, socketId, playerKey, playerName = "" }) {
    const room = this.getRoom(roomId);

    if (!room) {
      return { error: "Room not found." };
    }

    if (this.socketToRoom.has(socketId)) {
      return { error: "Socket already belongs to a room." };
    }

    const normalizedPlayerKey = normalizePlayerKey(playerKey, "");
    const player = room.players.find((entry) => entry.playerKey === normalizedPlayerKey);
    if (!player) {
      return { error: "Saved player session was not found in this room." };
    }

    const oldSocketId = player.id;
    const replacedActiveSocket = player.connected && oldSocketId !== socketId;
    player.id = socketId;
    player.connected = true;
    player.disconnectedAt = null;
    player.name = normalizePlayerName(playerName, player.name);
    this.socketToRoom.delete(oldSocketId);
    this.socketToRoom.set(socketId, roomId);
    this.clearDisconnectExpiry(roomId, normalizedPlayerKey);

    if (room.hostId === oldSocketId) {
      room.hostId = socketId;
    }

    if (room.captains.alpha === oldSocketId) {
      room.captains.alpha = socketId;
    }

    if (room.captains.beta === oldSocketId) {
      room.captains.beta = socketId;
    }

    room.teamSelections = {
      alpha: room.teamSelections.alpha.map((playerId) => (playerId === oldSocketId ? socketId : playerId)),
      beta: room.teamSelections.beta.map((playerId) => (playerId === oldSocketId ? socketId : playerId)),
    };
    touchRoom(room);

    return {
      room,
      player,
      oldSocketId,
      replacedActiveSocket,
    };
  }

  /**
   * @param {string} roomId
   * @returns {any | null}
   */
  startToss(roomId) {
    const room = this.getRoom(roomId);

    if (!room) {
      return null;
    }

    room.status = "toss";
    room.tossResult = null;
    touchRoom(room);
    return room;
  }

  /**
   * @param {string} roomId
   * @param {{ call: "heads" | "tails"; coinFace: "heads" | "tails"; winnerTeamId: "alpha" | "beta"; decision: "bat" | "bowl" | null }} tossResult
   * @returns {any | null}
   */
  setTossResult(roomId, tossResult) {
    const room = this.getRoom(roomId);

    if (!room) {
      return null;
    }

    room.tossResult = {
      ...tossResult,
    };
    touchRoom(room);
    return room;
  }

  /**
   * @param {string} roomId
   * @param {"bat" | "bowl"} decision
   * @returns {any | null}
   */
  finalizeTossDecision(roomId, decision) {
    const room = this.getRoom(roomId);

    if (!room || !room.tossResult) {
      return null;
    }

    room.tossResult = {
      ...room.tossResult,
      decision,
    };
    room.status = "lineup";
    touchRoom(room);
    return room;
  }

  /**
   * @param {string} roomId
   * @param {string} targetSocketId
   * @returns {{ roomId: string; room: any | null; player: any | null; deleted: boolean } | null}
   */
  removePlayerFromRoom(roomId, targetSocketId) {
    const room = this.getRoom(roomId);

    if (!room) {
      return null;
    }

    const leavingPlayer = room.players.find((entry) => entry.id === targetSocketId) ?? null;
    if (!leavingPlayer) {
      return null;
    }

    this.clearDisconnectExpiry(roomId, leavingPlayer.playerKey);

    room.players = room.players.filter((entry) => entry.id !== targetSocketId);
    this.socketToRoom.delete(targetSocketId);

    if (!room.players.length) {
      this.rooms.delete(roomId);
      return {
        roomId,
        room: null,
        player: leavingPlayer,
        deleted: true,
      };
    }

    if (room.hostId === targetSocketId) {
      room.hostId = room.players[0].id;
    }

    room.teamSelections = {
      alpha: room.teamSelections.alpha.filter((playerId) => playerId !== targetSocketId),
      beta: room.teamSelections.beta.filter((playerId) => playerId !== targetSocketId),
    };

    resetReadyStates(room);
    syncCaptains(room);
    room.tossResult = null;
    syncPreMatchStatus(room);
    touchRoom(room);

    return {
      roomId,
      room,
      player: leavingPlayer,
      deleted: false,
    };
  }

  /**
   * @param {string} socketId
   * @returns {{ roomId: string; room: any | null; player: any | null; deleted: boolean } | null}
   */
  leaveRoom(socketId) {
    const roomId = this.getRoomIdBySocketId(socketId);

    if (!roomId) {
      return null;
    }

    return this.removePlayerFromRoom(roomId, socketId);
  }

  /**
   * @param {string} roomId
   * @param {string} playerKey
   * @returns {{ roomId: string; room: any | null; player: any | null; deleted: boolean } | null}
   */
  removePlayerFromRoomByKey(roomId, playerKey) {
    const player = this.getPlayerByKey(roomId, playerKey);

    if (!player) {
      return null;
    }

    return this.removePlayerFromRoom(roomId, player.id);
  }

  /**
   * Permanently close a room and unlink every player session from it.
   *
   * @param {string} roomId
   * @returns {{ roomId: string; players: any[] } | null}
   */
  discardRoom(roomId) {
    const room = this.getRoom(roomId);

    if (!room) {
      return null;
    }

    const players = [...room.players];
    players.forEach((player) => {
      this.clearDisconnectExpiry(roomId, player.playerKey);
      this.socketToRoom.delete(player.id);
    });

    this.rooms.delete(roomId);

    return {
      roomId,
      players,
    };
  }

  /**
   * @param {{ now?: number; idleRoomTtlMs?: number; completedRoomTtlMs?: number }} [options]
   * @returns {{ roomId: string; reason: string; players: any[] }[]}
   */
  cleanupExpiredRooms(options = {}) {
    const now = options.now ?? Date.now();
    const idleRoomTtlMs = options.idleRoomTtlMs ?? HANDREX_RUNTIME_LIMITS.idleRoomTtlMs;
    const completedRoomTtlMs = options.completedRoomTtlMs ?? HANDREX_RUNTIME_LIMITS.completedRoomTtlMs;
    const removed = [];

    this.rooms.forEach((room, roomId) => {
      const updatedAt = room.updatedAt ?? room.createdAt ?? now;
      const idleFor = now - updatedAt;
      const connectedPlayers = room.players.filter((player) => player.connected !== false).length;
      let reason = "";

      if (!room.players.length) {
        reason = "empty";
      } else if (room.status === "completed" && idleFor > completedRoomTtlMs) {
        reason = "completed_ttl";
      } else if (connectedPlayers === 0 && idleFor > idleRoomTtlMs) {
        reason = "idle_disconnected_ttl";
      } else if (room.status !== "live" && idleFor > idleRoomTtlMs * 2) {
        reason = "stale_lobby_ttl";
      }

      if (!reason) {
        return;
      }

      const players = [...room.players];
      players.forEach((player) => {
        this.clearDisconnectExpiry(roomId, player.playerKey);
        this.socketToRoom.delete(player.id);
      });
      this.rooms.delete(roomId);
      removed.push({
        roomId,
        reason,
        players,
      });
    });

    return removed;
  }

  /**
   * @param {any} room
   * @returns {boolean}
   */
  canStartMatch(room) {
    return Boolean(
      room &&
        room.players.length === room.maxPlayers &&
        hasFullTeamSelections(room) &&
        room.players.every((player) => player.ready) &&
        room.status === "lineup" &&
        room.tossResult?.decision,
    );
  }

  /**
   * @param {any} room
   * @returns {boolean}
   */
  canStartToss(room) {
    return Boolean(
      room &&
        room.status !== "toss" &&
        room.status !== "lineup" &&
        room.status !== "live" &&
        room.players.length === room.maxPlayers &&
        hasFullTeamSelections(room) &&
        room.players.every((player) => player.ready) &&
        room.captains.alpha &&
        room.captains.beta,
    );
  }

  /**
   * @param {any} room
   * @returns {any}
   */
  serializeRoom(room) {
    return {
      roomId: room.roomId,
      hostId: room.hostId,
      status: room.status,
      teamSize: room.teamSize,
      maxPlayers: room.maxPlayers,
      settings: room.settings,
      captains: room.captains,
      teamSelections: sanitizeTeamSelections(room),
      teamNames: room.teamNames,
      tossResult: room.tossResult,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
      players: room.players.map((player) => ({
        id: player.id,
        name: player.name,
        ready: player.ready,
        connected: player.connected,
        joinedAt: player.joinedAt,
      })),
    };
  }
}
