// @ts-check

import {
  CONNECTION_STATUS,
  CONTROL_MODES,
  DEFAULT_SETTINGS,
  ROOM_CODE_LENGTH,
  ROOM_STATUS,
  ROUTES,
  TEAM_IDS,
} from "../config/constants.js";
import { isValidLineup } from "../engine/validators.js";
import { resolveNumberSetSettings } from "../engine/numberSets.js";
import { createRoomRoster, createTeamNames } from "../services/simulationService.js";
import { ACTIONS } from "../state/actions.js";
import { createId, createRoomCode } from "../utils/id.js";

/**
 * @param {string} code
 * @returns {boolean}
 */
function isValidRoomCodeFormat(code) {
  return new RegExp(`^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{${ROOM_CODE_LENGTH}}$`).test(code);
}

/**
 * @param {Partial<import("../types/models").RoomSettings>} settings
 * @param {Partial<import("../types/models").RoomSettings>} [fallback]
 * @returns {import("../types/models").RoomSettings}
 */
function resolveClientRoomSettings(settings, fallback = DEFAULT_SETTINGS) {
  const numberSet = resolveNumberSetSettings(settings, fallback);

  return {
    ...DEFAULT_SETTINGS,
    ...fallback,
    ...settings,
    ...(numberSet.ok ? numberSet.settings : resolveNumberSetSettings({}, DEFAULT_SETTINGS).settings),
  };
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function tryLegacyClipboardWrite(value) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.append(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  let copied = false;
  try {
    copied = Boolean(document.execCommand?.("copy"));
  } catch {
    copied = false;
  }

  textarea.remove();
  return copied;
}

/**
 * @param {string} teamId
 * @param {string} name
 * @param {string} captainId
 * @param {string[]} playerIds
 * @param {boolean} lockedLineup
 * @returns {import("../types/models").Team}
 */
function createTeam(teamId, name, captainId, playerIds, lockedLineup) {
  return {
    id: teamId,
    name,
    captainId,
    playerIds: [...playerIds],
    battingOrder: [...playerIds],
    bowlingOrder: [...playerIds],
    currentBowlerId: playerIds[0] ?? null,
    lockedLineup,
    stats: {},
  };
}

/**
 * @param {import("../types/models").Team} team
 * @param {import("../types/models").Lineup | null | undefined} existingLineup
 * @returns {import("../types/models").Lineup}
 */
function createLineup(team, existingLineup) {
  const battingOrder = existingLineup?.battingOrder && isValidLineup(existingLineup.battingOrder, team.playerIds)
    ? [...existingLineup.battingOrder]
    : [...team.battingOrder];
  const bowlingOrder = existingLineup?.bowlingOrder && isValidLineup(existingLineup.bowlingOrder, team.playerIds)
    ? [...existingLineup.bowlingOrder]
    : [...team.bowlingOrder];

  return {
    teamId: team.id,
    battingOrder,
    bowlingOrder,
    locked: team.lockedLineup,
  };
}

/**
 * @param {string | null | undefined} preferredId
 * @param {string[]} availableIds
 * @param {string | null} [excludeId]
 * @returns {string | null}
 */
function resolveCaptainId(preferredId, availableIds, excludeId = null) {
  if (preferredId && availableIds.includes(preferredId) && preferredId !== excludeId) {
    return preferredId;
  }

  return availableIds.find((playerId) => playerId !== excludeId) ?? null;
}

/**
 * @param {import("../types/models").Player[]} players
 * @param {number} teamSize
 * @param {{ alpha?: string[]; beta?: string[] } | null | undefined} selections
 * @returns {{ alpha: string[]; beta: string[] }}
 */
function sanitizeTeamSelections(players, teamSize, selections) {
  const validIds = new Set(players.map((player) => player.id));
  const assigned = new Set();
  const nextSelections = {
    alpha: [],
    beta: [],
  };

  [TEAM_IDS.ALPHA, TEAM_IDS.BETA].forEach((side) => {
    const source = Array.isArray(selections?.[side]) ? selections[side] : [];
    source.forEach((playerId) => {
      if (
        !validIds.has(playerId) ||
        assigned.has(playerId) ||
        nextSelections[side].length >= teamSize
      ) {
        return;
      }

      nextSelections[side].push(playerId);
      assigned.add(playerId);
    });
  });

  return nextSelections;
}

/**
 * @param {import("../types/models").Player[]} players
 * @param {{ alpha: string[]; beta: string[] }} selections
 * @returns {string[]}
 */
function getUnassignedPlayerIds(players, selections) {
  const assignedIds = new Set([...selections.alpha, ...selections.beta]);
  return players.map((player) => player.id).filter((playerId) => !assignedIds.has(playerId));
}

/**
 * @param {{ alpha: string[]; beta: string[] }} selections
 * @param {number} teamSize
 * @returns {boolean}
 */
function hasFullTeamSelections(selections, teamSize) {
  return selections.alpha.length === teamSize && selections.beta.length === teamSize;
}

/**
 * @param {{ alpha: string[]; beta: string[] }} selections
 * @param {string} playerId
 * @returns {"alpha" | "beta" | null}
 */
function getSelectedTeamId(selections, playerId) {
  if (selections.alpha.includes(playerId)) {
    return TEAM_IDS.ALPHA;
  }

  if (selections.beta.includes(playerId)) {
    return TEAM_IDS.BETA;
  }

  return null;
}

/**
 * @param {{ alpha: string[]; beta: string[] }} selections
 * @param {string} playerId
 * @param {"alpha" | "beta" | null} teamId
 * @param {number} teamSize
 * @returns {{ ok: true; selections: { alpha: string[]; beta: string[] } } | { ok: false; error: string }}
 */
function movePlayerBetweenTeams(selections, playerId, teamId, teamSize) {
  const currentTeamId = getSelectedTeamId(selections, playerId);

  if (currentTeamId === teamId) {
    return {
      ok: true,
      selections,
    };
  }

  if (teamId && selections[teamId].length >= teamSize) {
    return {
      ok: false,
      error: `${teamId === TEAM_IDS.ALPHA ? "Alpha" : "Beta"} team is already full.`,
    };
  }

  const nextSelections = {
    alpha: selections.alpha.filter((entry) => entry !== playerId),
    beta: selections.beta.filter((entry) => entry !== playerId),
  };

  if (teamId) {
    nextSelections[teamId].push(playerId);
  }

  return {
    ok: true,
    selections: nextSelections,
  };
}

/**
 * @param {import("../types/models").Player[]} players
 * @param {{ alpha: string | null; beta: string | null }} captains
 * @param {number} teamSize
 * @param {import("../types/models").Room | null} currentRoom
 * @param {{ alpha?: string[]; beta?: string[] } | null | undefined} teamSelections
 * @returns {{
 *   alpha: import("../types/models").Team | null;
 *   beta: import("../types/models").Team | null;
 *   lineups: { alpha: import("../types/models").Lineup | null; beta: import("../types/models").Lineup | null };
 *   captains: { alpha: string | null; beta: string | null };
 *   selections: { alpha: string[]; beta: string[] };
 * }}
 */
function buildTeams(players, captains, teamSize, currentRoom, teamSelections) {
  const lockedLineup = Boolean(
    currentRoom?.lineups?.alpha?.locked ||
      currentRoom?.lineups?.beta?.locked ||
      currentRoom?.status === ROOM_STATUS.LINEUP ||
      currentRoom?.status === ROOM_STATUS.LIVE ||
      currentRoom?.status === ROOM_STATUS.COMPLETED,
  );
  const normalizedSelections = sanitizeTeamSelections(
    players,
    teamSize,
    teamSelections ?? currentRoom?.teamSelections,
  );
  const alphaPlayers = normalizedSelections.alpha;
  const betaPlayers = normalizedSelections.beta;
  const alphaCaptain = resolveCaptainId(captains.alpha, alphaPlayers) ?? alphaPlayers[0] ?? null;
  const betaCaptain = resolveCaptainId(captains.beta, betaPlayers, alphaCaptain) ?? betaPlayers[0] ?? null;

  const alphaTeam =
    alphaPlayers.length
      ? createTeam(
          TEAM_IDS.ALPHA,
          currentRoom?.teams?.alpha?.name ?? currentRoom?.teamNames?.alpha ?? "Alpha XI",
          alphaCaptain ?? alphaPlayers[0],
          alphaPlayers,
          lockedLineup,
        )
      : null;
  const betaTeam =
    betaPlayers.length
      ? createTeam(
          TEAM_IDS.BETA,
          currentRoom?.teams?.beta?.name ?? currentRoom?.teamNames?.beta ?? "Beta XI",
          betaCaptain ?? betaPlayers[0],
          betaPlayers,
          lockedLineup,
        )
      : null;

  return {
    alpha: alphaTeam,
    beta: betaTeam,
    lineups: {
      alpha: alphaTeam ? createLineup(alphaTeam, currentRoom?.lineups?.alpha) : null,
      beta: betaTeam ? createLineup(betaTeam, currentRoom?.lineups?.beta) : null,
    },
    captains: {
      alpha: alphaTeam?.captainId ?? null,
      beta: betaTeam?.captainId ?? null,
    },
    selections: normalizedSelections,
  };
}

/**
 * @param {import("../types/models").Room | null | undefined} room
 * @param {{ alpha?: string; beta?: string } | null | undefined} teamNames
 * @returns {import("../types/models").Room | null}
 */
function withResolvedTeamNames(room, teamNames) {
  if (!room) {
    return null;
  }

  return {
    ...room,
    teamNames: {
      alpha: teamNames?.alpha?.trim() || room.teamNames?.alpha || room.teams?.alpha?.name || "Alpha XI",
      beta: teamNames?.beta?.trim() || room.teamNames?.beta || room.teams?.beta?.name || "Beta XI",
    },
    teams: {
      alpha: room.teams?.alpha
        ? {
            ...room.teams.alpha,
            name: teamNames?.alpha?.trim() || room.teams.alpha.name || "Alpha XI",
          }
        : room.teams?.alpha ?? null,
      beta: room.teams?.beta
        ? {
            ...room.teams.beta,
            name: teamNames?.beta?.trim() || room.teams.beta.name || "Beta XI",
          }
        : room.teams?.beta ?? null,
    },
  };
}

/**
 * @param {import("../types/models").AppState} state
 * @param {string} playerName
 * @param {number} teamSize
 * @returns {import("../types/models").Room}
 */
function createPracticeRoom(state, playerName, teamSize) {
  const localPlayerId = state.session.localPlayerId ?? createId("local");
  const roomCode = createRoomCode();
  const teamNames = createTeamNames();
  const aiPlayers = createRoomRoster(teamSize * 2 - 1, playerName).map((player, index) => ({
    ...player,
    role: index === 0 ? "captain" : "player",
    status: "ready",
    connectionState: {
      ...player.connectionState,
      note: "Practice AI ready",
    },
  }));
  const captains = {
    alpha: localPlayerId,
    beta: aiPlayers[0]?.id ?? null,
  };
  const players = [
    {
      id: localPlayerId,
      name: playerName,
      isHost: true,
      isLocal: true,
      isMock: false,
      role: "captain",
      status: "unready",
      avatarSeed: playerName.toLowerCase().replace(/\s+/g, "-"),
      connectionState: {
        status: CONNECTION_STATUS.CONNECTED,
        lastSyncAt: Date.now(),
        latencyMs: 0,
        note: "Practice player",
      },
    },
    ...aiPlayers,
  ];
  const practiceSelections = {
    alpha: [localPlayerId],
    beta: aiPlayers[0]?.id ? [aiPlayers[0].id] : [],
  };
  aiPlayers
    .filter((player) => !practiceSelections.beta.includes(player.id))
    .forEach((player) => {
      if (practiceSelections.alpha.length < teamSize) {
        practiceSelections.alpha.push(player.id);
        return;
      }

      if (practiceSelections.beta.length < teamSize) {
        practiceSelections.beta.push(player.id);
      }
    });
  const baseRoom = {
    id: createId("practice-room"),
    code: roomCode,
    source: "offline",
    teamNames,
    hostId: localPlayerId,
    maxPlayers: teamSize * 2,
    playerIds: players.map((player) => player.id),
    players,
    status: ROOM_STATUS.LOBBY,
    connectionState: {
      status: CONNECTION_STATUS.CONNECTED,
      lastSyncAt: Date.now(),
      latencyMs: 0,
      note: "Offline practice room with AI players.",
    },
    settings: {
      ...resolveClientRoomSettings(DEFAULT_SETTINGS),
      playersPerTeam: teamSize,
      controlMode: CONTROL_MODES.LOCAL_VS_AI,
    },
    captains,
    teamSelections: practiceSelections,
    teams: {
      alpha: null,
      beta: null,
    },
    lineups: {
      alpha: null,
      beta: null,
    },
    draftState: {
      status: "complete",
      availablePlayerIds: [],
      currentPickIndex: 0,
      pickSequence: [],
      picks: [],
    },
    tossResult: null,
    createdAt: Date.now(),
  };
  const built = buildTeams(players, captains, teamSize, baseRoom, practiceSelections);
  const teams = {
    alpha: built.alpha ? { ...built.alpha, name: teamNames.alpha } : null,
    beta: built.beta ? { ...built.beta, name: teamNames.beta } : null,
  };

  return {
    ...baseRoom,
    captains: built.captains,
    teamSelections: built.selections,
    teams,
    lineups: {
      alpha: teams.alpha ? createLineup(teams.alpha, built.lineups.alpha) : null,
      beta: teams.beta ? createLineup(teams.beta, built.lineups.beta) : null,
    },
    players: players.map((player) => ({
      ...player,
      role: player.id === built.captains.alpha || player.id === built.captains.beta ? "captain" : "player",
    })),
  };
}

/**
 * @param {string} serverStatus
 * @param {import("../types/models").RoomStatus | undefined} currentStatus
 * @param {number} playerCount
 * @param {number} maxPlayers
 * @returns {import("../types/models").RoomStatus}
 */
function mapRoomStatus(serverStatus, currentStatus, playerCount, maxPlayers) {
  if (serverStatus === "toss") {
    return ROOM_STATUS.TOSS;
  }

  if (serverStatus === "lineup") {
    return ROOM_STATUS.LINEUP;
  }

  if (serverStatus === "live") {
    return ROOM_STATUS.LIVE;
  }

  if (serverStatus === "completed") {
    return ROOM_STATUS.COMPLETED;
  }

  if (serverStatus === "draft") {
    return ROOM_STATUS.DRAFT;
  }

  return ROOM_STATUS.LOBBY;
}

/**
 * @param {string} serverStatus
 * @param {number} playerCount
 * @param {number} maxPlayers
 * @returns {import("../types/models").ConnectionState}
 */
function mapRoomConnection(serverStatus, playerCount, maxPlayers) {
  if (serverStatus === "live") {
    return {
      status: CONNECTION_STATUS.CONNECTED,
      lastSyncAt: Date.now(),
      latencyMs: 28,
      note: "Realtime match is live.",
    };
  }

  if (serverStatus === "completed") {
    return {
      status: CONNECTION_STATUS.CONNECTED,
      lastSyncAt: Date.now(),
      latencyMs: 28,
      note: "Match completed.",
    };
  }

  if (serverStatus === "toss") {
    return {
      status: CONNECTION_STATUS.CONNECTED,
      lastSyncAt: Date.now(),
      latencyMs: 28,
      note: "Toss live for the captains.",
    };
  }

  if (serverStatus === "lineup") {
    return {
      status: CONNECTION_STATUS.CONNECTED,
      lastSyncAt: Date.now(),
      latencyMs: 28,
      note: "Lineups are being finalized.",
    };
  }

  if (playerCount < maxPlayers || serverStatus === "waiting") {
    return {
      status: CONNECTION_STATUS.WAITING,
      lastSyncAt: Date.now(),
      latencyMs: 28,
      note: `Waiting for ${Math.max(maxPlayers - playerCount, 0)} more player${maxPlayers - playerCount === 1 ? "" : "s"}.`,
    };
  }

  return {
    status: CONNECTION_STATUS.CONNECTED,
    lastSyncAt: Date.now(),
    latencyMs: 28,
    note: "Room synced. Ready states are live.",
  };
}

/**
 * @param {any} serverRoom
 * @param {import("../types/models").AppState} state
 * @returns {import("../types/models").Room}
 */
function mapServerRoomToClient(serverRoom, state) {
  const currentRoom =
    withResolvedTeamNames(state.room, serverRoom.teamNames) ?? {
      teamNames: serverRoom.teamNames ?? {
        alpha: "Alpha XI",
        beta: "Beta XI",
      },
      teams: {
        alpha: null,
        beta: null,
      },
      lineups: state.room?.lineups,
      status: state.room?.status,
      settings: state.room?.settings ?? DEFAULT_SETTINGS,
      captains: state.room?.captains ?? {
        alpha: null,
        beta: null,
      },
      teamSelections: state.room?.teamSelections ?? {
        alpha: [],
        beta: [],
      },
    };
  const localPlayerId = state.session.localPlayerId;
  const playerIds = serverRoom.players.map((player) => player.id);
  const playersPerTeam = Math.max(
    1,
    Number(serverRoom.teamSize) ||
      serverRoom.settings?.playersPerTeam ||
      currentRoom?.settings?.playersPerTeam ||
      DEFAULT_SETTINGS.playersPerTeam,
  );
  const maxPlayers = Math.max(2, Number(serverRoom.maxPlayers) || playersPerTeam * 2);
  const players = serverRoom.players.map((player) => ({
    id: player.id,
    name: player.name,
    isHost: player.id === serverRoom.hostId,
    isLocal: player.id === localPlayerId,
    isMock: false,
    role: "player",
    status: player.connected === false ? "away" : player.ready ? "ready" : "unready",
    avatarSeed: player.name.toLowerCase().replace(/\s+/g, "-"),
    connectionState: {
      status: player.connected === false ? CONNECTION_STATUS.OFFLINE : CONNECTION_STATUS.CONNECTED,
      lastSyncAt: Date.now(),
      latencyMs: 28,
      note: player.connected === false ? "Disconnected from room" : player.ready ? "Ready in lobby" : "Connected",
    },
  }));

  const teams = buildTeams(
    players,
    {
      alpha: serverRoom.captains?.alpha ?? currentRoom?.captains?.alpha ?? null,
      beta: serverRoom.captains?.beta ?? currentRoom?.captains?.beta ?? null,
    },
    playersPerTeam,
    currentRoom,
    serverRoom.teamSelections ?? currentRoom?.teamSelections,
  );
  const playersWithRoles = players.map((player) => ({
    ...player,
    role: player.id === teams.captains.alpha || player.id === teams.captains.beta ? "captain" : "player",
  }));
  const roomStatus = mapRoomStatus(serverRoom.status, currentRoom?.status, players.length, maxPlayers);
  const roomFull = players.length >= maxPlayers;
  const teamsReady = hasFullTeamSelections(teams.selections, playersPerTeam);

  return {
    id: serverRoom.roomId,
    code: serverRoom.roomId,
    source: "realtime",
    teamNames: {
      alpha: teams.alpha?.name ?? serverRoom.teamNames?.alpha ?? "Alpha XI",
      beta: teams.beta?.name ?? serverRoom.teamNames?.beta ?? "Beta XI",
    },
    hostId: serverRoom.hostId,
    maxPlayers,
    playerIds,
    players: playersWithRoles,
    status: roomStatus,
    connectionState: mapRoomConnection(serverRoom.status, players.length, maxPlayers),
    settings: {
      ...resolveClientRoomSettings(serverRoom.settings ?? {}, currentRoom?.settings ?? DEFAULT_SETTINGS),
      playersPerTeam,
      controlMode: CONTROL_MODES.LOCAL_VS_AI,
    },
    captains: {
      alpha: teams.captains.alpha,
      beta: teams.captains.beta,
    },
    teamSelections: teams.selections,
    teams: {
      alpha: teams.alpha,
      beta: teams.beta,
    },
    lineups: teams.lineups,
    draftState: {
      status: roomFull && teamsReady ? "complete" : "pending",
      availablePlayerIds: [],
      currentPickIndex: 0,
      pickSequence: [],
      picks: [],
    },
    tossResult: serverRoom.tossResult ?? currentRoom?.tossResult ?? null,
    createdAt: serverRoom.createdAt ?? currentRoom?.createdAt ?? Date.now(),
  };
}

export class RoomService {
  /**
   * @param {{ store: ReturnType<import("../state/store.js").createStore>; socket: import("./mockSocket.js").MockSocket }} options
   */
  constructor({ store, socket }) {
    this.store = store;
    this.socket = socket;
    this.pendingRoomAction = null;
    this.resumeInFlight = false;
    this.inviteJoinAttempted = false;
    this.unsubscribers = [
      this.socket.on("socket:connected", (payload) => this.handleSocketConnected(payload)),
      this.socket.on("room_created", (payload) => this.handleRoomCreated(payload)),
      this.socket.on("room_update", (payload) => this.handleRoomUpdate(payload)),
      this.socket.on("room_kicked", (payload) => this.handleRoomKicked(payload)),
      this.socket.on("room_closed", (payload) => this.handleRoomClosed(payload)),
      this.socket.on("room_error", (payload) => this.handleRoomError(payload)),
      this.socket.on("connection:status", (payload) => this.setConnection(payload)),
    ];
  }

  destroy() {
    this.unsubscribers.forEach((unsubscribe) => unsubscribe());
  }

  clearPendingRoomAction() {
    this.pendingRoomAction = null;
  }

  /**
   * @param {"create" | "join"} action
   * @returns {boolean}
   */
  beginRoomAction(action) {
    if (this.pendingRoomAction || this.resumeInFlight) {
      this.pushToast("Please wait for the current room request to finish.", "info");
      return false;
    }

    this.pendingRoomAction = action;
    return true;
  }

  clearActiveRoomSession() {
    const state = this.store.getState();
    this.store.dispatch({
      type: ACTIONS.UPDATE_SESSION,
      payload: {
        ...state.session,
        activeRoomCode: "",
      },
    });
  }

  attemptResume() {
    const state = this.store.getState();
    const roomCode = state.session.activeRoomCode?.trim().toUpperCase();
    const playerKey = state.session.playerKey;

    if (!roomCode || !playerKey || this.resumeInFlight) {
      return;
    }

    this.resumeInFlight = true;
    this.store.dispatch({
      type: ACTIONS.PATCH_UI,
      payload: {
        connectionBanner: `Rejoining room ${roomCode}...`,
      },
    });

    this.socket.emit(
      "resume_session",
      {
        roomId: roomCode,
        playerKey,
        playerName: state.session.profileName,
      },
      (response) => {
        this.resumeInFlight = false;

        if (response?.ok) {
          this.pushToast(`Rejoined room ${roomCode}.`, "success");
          return;
        }

        this.clearActiveRoomSession();
        this.handleRoomError({
          message: response?.error ?? "Unable to restore the previous room session.",
        });
      },
    );
  }

  attemptInviteJoin() {
    const state = this.store.getState();
    const roomCode = state.ui.inviteRoomCode?.trim().toUpperCase() ?? "";

    if (!roomCode || this.inviteJoinAttempted || state.room) {
      return false;
    }

    this.inviteJoinAttempted = true;
    this.joinRoom({
      playerName: state.session.profileName,
      code: roomCode,
    });
    return true;
  }

  /**
   * @param {string} message
   * @param {"info" | "success" | "warning"} [tone]
   */
  pushToast(message, tone = "info") {
    this.store.dispatch({
      type: ACTIONS.PUSH_TOAST,
      payload: {
        id: createId("toast"),
        message,
        tone,
      },
    });
  }

  /**
   * @param {{ status: import("../types/models").ConnectionStatus; note: string }} payload
   */
  setConnection(payload) {
    const state = this.store.getState();

    if (state.room?.source === "offline") {
      this.store.dispatch({
        type: ACTIONS.SET_CONNECTION,
        payload: {
          status: CONNECTION_STATUS.CONNECTED,
          note: state.room.connectionState.note ?? "Practice room active locally.",
          lastSyncAt: Date.now(),
        },
      });
      return;
    }

    this.store.dispatch({
      type: ACTIONS.SET_CONNECTION,
      payload: {
        status: payload.status,
        note: payload.note,
        lastSyncAt: Date.now(),
      },
    });

    if (!state.room) {
      return;
    }

    this.store.dispatch({
      type: ACTIONS.SET_ROOM,
      payload: {
        ...state.room,
        connectionState: {
          ...state.room.connectionState,
          status: payload.status,
          note: payload.note,
          lastSyncAt: Date.now(),
        },
      },
    });
  }

  /**
   * @param {{ socketId?: string }} payload
   */
  handleSocketConnected(payload) {
    if (!payload?.socketId) {
      return;
    }

    if (this.store.getState().room?.source === "offline") {
      return;
    }

    this.store.dispatch({
      type: ACTIONS.UPDATE_SESSION,
      payload: {
        localPlayerId: payload.socketId,
      },
    });

    if (this.attemptInviteJoin()) {
      return;
    }

    if (this.store.getState().session.activeRoomCode) {
      this.attemptResume();
    }
  }

  /**
   * @param {any} serverRoom
   */
  applyServerRoom(serverRoom) {
    const state = this.store.getState();
    const nextRoom = mapServerRoomToClient(serverRoom, state);
    const teamsReady = hasFullTeamSelections(nextRoom.teamSelections, nextRoom.settings.playersPerTeam);
    let nextRoute = null;
    this.resumeInFlight = false;
    this.clearPendingRoomAction();

    if (nextRoom.status === ROOM_STATUS.TOSS && state.route !== ROUTES.MATCH && state.route !== ROUTES.RESULT) {
      nextRoute = ROUTES.TOSS;
    } else if (nextRoom.status === ROOM_STATUS.LINEUP && state.route !== ROUTES.MATCH && state.route !== ROUTES.RESULT) {
      nextRoute = ROUTES.LINEUP;
    } else if (
      nextRoom.status === ROOM_STATUS.LOBBY &&
      [ROUTES.TOSS, ROUTES.LINEUP].includes(state.route)
    ) {
      nextRoute = nextRoom.playerIds.length === nextRoom.maxPlayers ? ROUTES.LOBBY : ROUTES.ROOM;
    } else if (
      nextRoom.playerIds.length === nextRoom.maxPlayers &&
      nextRoom.status === ROOM_STATUS.LOBBY &&
      [ROUTES.HOME, ROUTES.ROOM, ROUTES.TOSS, ROUTES.LINEUP].includes(state.route)
    ) {
      nextRoute = ROUTES.LOBBY;
    } else if (
      (!state.room || state.route === ROUTES.HOME) &&
      nextRoom.status !== ROOM_STATUS.LIVE &&
      nextRoom.status !== ROOM_STATUS.COMPLETED
    ) {
      nextRoute = nextRoom.playerIds.length === nextRoom.maxPlayers ? ROUTES.LOBBY : ROUTES.ROOM;
    }

    let connectionBanner = "Room synced.";
    if (nextRoom.status === ROOM_STATUS.TOSS) {
      connectionBanner = nextRoom.tossResult
        ? nextRoom.tossResult.decision
          ? `${nextRoom.teams[nextRoom.tossResult.winnerTeamId]?.name ?? "Winning team"} chose to ${nextRoom.tossResult.decision}.`
          : `${nextRoom.teams[nextRoom.tossResult.winnerTeamId]?.name ?? "Winning team"} won the toss. Waiting for the decision.`
        : "Toss live. Alpha captain can call the flip.";
    } else if (nextRoom.status === ROOM_STATUS.LINEUP) {
      connectionBanner = "Toss complete. Captains can finalize batting and bowling orders.";
    } else if (nextRoom.playerIds.length < nextRoom.maxPlayers) {
      connectionBanner = `Room live. Waiting for ${nextRoom.maxPlayers - nextRoom.playerIds.length} more player${nextRoom.maxPlayers - nextRoom.playerIds.length === 1 ? "" : "s"} to join.`;
    } else if (!teamsReady) {
      connectionBanner = "Choose sides for Alpha and Beta before the host starts the toss.";
    } else if (nextRoom.players.every((player) => player.status === "ready")) {
      connectionBanner = "All players ready. Host can continue.";
    } else {
      connectionBanner = "Room synced. Ready toggles are live.";
    }

    this.store.dispatch({
      type: ACTIONS.UPDATE_SESSION,
      payload: {
        lastRoomCode: nextRoom.code,
        activeRoomCode: nextRoom.code,
      },
    });
    this.store.dispatch({ type: ACTIONS.SET_ROOM, payload: nextRoom });

    if (!state.match) {
      this.store.dispatch({ type: ACTIONS.SET_MATCH, payload: null });
    }

    if (nextRoute) {
      this.store.dispatch({ type: ACTIONS.NAVIGATE, payload: nextRoute });
    }

    this.store.dispatch({
      type: ACTIONS.PATCH_UI,
      payload: {
        roomCodeInput: nextRoom.code,
        connectionBanner,
      },
    });
  }

  /**
   * @param {any} serverRoom
   */
  handleRoomCreated(serverRoom) {
    this.applyServerRoom(serverRoom);
    this.pushToast(`Room ${serverRoom.roomId} created. Share the invite link or room code to join.`, "success");
  }

  /**
   * @param {any} serverRoom
   */
  handleRoomUpdate(serverRoom) {
    this.applyServerRoom(serverRoom);
  }

  /**
   * @param {{ roomId?: string; message?: string }} payload
   */
  handleRoomKicked(payload) {
    const roomId = payload?.roomId ?? this.store.getState().room?.code ?? "";
    const message = payload?.message ?? "You were removed from the room by the host.";
    this.resumeInFlight = false;
    this.clearPendingRoomAction();

    this.store.dispatch({ type: ACTIONS.RESET_FLOW });
    this.store.dispatch({
      type: ACTIONS.PATCH_UI,
      payload: {
        roomCodeInput: roomId,
        connectionBanner: message,
      },
    });
    this.pushToast(message, "warning");
  }

  /**
   * @param {{ roomId?: string; message?: string }} payload
   */
  handleRoomClosed(payload) {
    const roomId = payload?.roomId ?? this.store.getState().room?.code ?? "";
    const message = payload?.message ?? "This room was discarded by the host.";
    this.resumeInFlight = false;
    this.clearPendingRoomAction();

    this.store.dispatch({ type: ACTIONS.RESET_FLOW });
    this.store.dispatch({
      type: ACTIONS.PATCH_UI,
      payload: {
        roomCodeInput: roomId,
        connectionBanner: message,
      },
    });
    this.pushToast(message, "info");
  }

  /**
   * @param {{ message?: string }} payload
   */
  handleRoomError(payload) {
    this.clearPendingRoomAction();
    const message = payload?.message ?? "Room action failed.";
    this.pushToast(message, "warning");
    this.store.dispatch({
      type: ACTIONS.PATCH_UI,
      payload: {
        connectionBanner: message,
      },
    });
  }

  /**
   * @param {string} [roomCode]
   * @returns {string}
   */
  getInviteLink(roomCode = this.store.getState().room?.code ?? "") {
    if (!roomCode) {
      return "";
    }

    const url = new URL(window.location.href);
    const normalizedRoomCode = roomCode.trim().toUpperCase();
    if (url.searchParams.get("gamehubEmbedded") === "1" && url.searchParams.get("gamehubShell") === "premium") {
      const premiumInviteUrl = new URL("/premium/play", window.location.origin);
      premiumInviteUrl.searchParams.set("id", "handrex");
      premiumInviteUrl.searchParams.set("room", normalizedRoomCode);
      return premiumInviteUrl.toString();
    }

    url.search = "";
    url.hash = "";
    url.searchParams.set("room", normalizedRoomCode);
    return url.toString();
  }

  copyInviteLink() {
    if (this.store.getState().room?.source === "offline") {
      this.pushToast("Invite links are only available for realtime rooms.", "info");
      return;
    }

    const link = this.getInviteLink();

    if (!link) {
      this.pushToast("Create or join a room first to share an invite link.", "warning");
      return;
    }

    if (navigator.clipboard?.writeText) {
      void navigator.clipboard
        .writeText(link)
        .then(() => {
          this.pushToast("Invite link copied.", "success");
        })
        .catch(() => {
          if (tryLegacyClipboardWrite(link)) {
            this.pushToast("Invite link copied.", "success");
            return;
          }

          this.pushToast("Unable to copy automatically. Please copy the room link from the browser address bar.", "warning");
        });
      return;
    }

    if (tryLegacyClipboardWrite(link)) {
      this.pushToast("Invite link copied.", "success");
      return;
    }

    this.pushToast("Unable to copy automatically. Please copy the room link from the browser address bar.", "warning");
  }

  /**
   * @param {{ playerName?: string; teamSize?: number }} [options]
   */
  createRoom(options = {}) {
    const playerName = (options.playerName || "Captain You").trim() || "Captain You";
    const teamSize = Math.max(1, Math.min(11, Number(options.teamSize) || this.store.getState().ui.playersPerTeam || DEFAULT_SETTINGS.playersPerTeam));

    if (!this.beginRoomAction("create")) {
      return;
    }

    const state = this.store.getState();

    this.store.dispatch({
      type: ACTIONS.UPDATE_SESSION,
      payload: {
        profileName: playerName,
        playerKey: state.session.playerKey,
      },
    });
    this.store.dispatch({ type: ACTIONS.SET_MATCH, payload: null });
    this.store.dispatch({
      type: ACTIONS.PATCH_UI,
      payload: {
        connectionBanner: `Creating realtime ${teamSize}v${teamSize} room...`,
        playersPerTeam: teamSize,
      },
    });

    this.socket.emit("create_room", {
      playerName,
      playerKey: state.session.playerKey,
      teamSize,
      settings: resolveClientRoomSettings({ playersPerTeam: teamSize }, DEFAULT_SETTINGS),
    }, (response) => {
      this.clearPendingRoomAction();
      if (response?.ok) {
        return;
      }

      this.handleRoomError({
        message: response?.error ?? "Unable to create room.",
      });
    });
  }

  /**
   * @param {{ playerName?: string; code?: string }} [options]
   */
  joinRoom(options = {}) {
    const playerName = (options.playerName || "Captain You").trim() || "Captain You";
    const roomCode = (options.code || "").trim().toUpperCase();

    if (!isValidRoomCodeFormat(roomCode)) {
      this.handleRoomError({
        message: `Enter a valid ${ROOM_CODE_LENGTH}-character room code.`,
      });
      return;
    }

    if (!this.beginRoomAction("join")) {
      return;
    }

    const state = this.store.getState();

    this.store.dispatch({
      type: ACTIONS.UPDATE_SESSION,
      payload: {
        profileName: playerName,
        playerKey: state.session.playerKey,
      },
    });
    this.store.dispatch({ type: ACTIONS.SET_MATCH, payload: null });
    this.store.dispatch({
      type: ACTIONS.PATCH_UI,
      payload: {
        connectionBanner: `Joining room ${roomCode}...`,
      },
    });

    this.socket.emit(
      "join_room",
      {
        roomId: roomCode,
        playerName,
        playerKey: state.session.playerKey,
      },
      (response) => {
        this.clearPendingRoomAction();
        if (response?.ok) {
          this.pushToast(`Joined room ${roomCode}.`, "success");
          return;
        }

        this.handleRoomError({
          message: response?.error ?? "Unable to join room.",
        });
      },
    );
  }

  /**
   * @param {{ teamSize?: number }} [options]
   */
  startQuickMatch(options = {}) {
    this.createRoom({
      playerName: this.store.getState().session.profileName,
      teamSize: options.teamSize,
    });
  }

  startPracticeMode() {
    const state = this.store.getState();
    const requestedTeamSize = Number(state.ui.playersPerTeam) || 1;
    const teamSize = Math.max(1, Math.min(2, requestedTeamSize));

    if (requestedTeamSize > 2) {
      this.pushToast("Practice mode currently supports up to 2v2. Switched to 2v2.", "info");
    }

    const room = createPracticeRoom(state, state.session.profileName, teamSize);

    this.store.dispatch({
      type: ACTIONS.UPDATE_SESSION,
      payload: {
        localPlayerId: room.hostId,
        profileName: state.session.profileName,
        activeRoomCode: "",
      },
    });
    this.store.dispatch({ type: ACTIONS.SET_MATCH, payload: null });
    this.store.dispatch({ type: ACTIONS.SET_ROOM, payload: room });
    this.store.dispatch({ type: ACTIONS.SET_CONNECTION, payload: room.connectionState });
    this.store.dispatch({
      type: ACTIONS.PATCH_UI,
      payload: {
        playersPerTeam: teamSize,
        roomCodeInput: room.code,
        connectionBanner: "Practice room ready. Review settings, ready up, and start the toss.",
        isPaused: false,
      },
    });
    this.store.dispatch({ type: ACTIONS.NAVIGATE, payload: ROUTES.LOBBY });
    this.pushToast(`Practice ${teamSize}v${teamSize} room created with AI players.`, "success");
  }

  enterLobby() {
    if (!this.store.getState().room) {
      return;
    }

    this.store.dispatch({ type: ACTIONS.NAVIGATE, payload: ROUTES.LOBBY });
  }

  openDraftBoard() {
    if (this.store.getState().room?.source === "offline") {
      this.pushToast("Practice teams are already prepared with AI players.", "info");
      this.store.dispatch({
        type: ACTIONS.PATCH_UI,
        payload: {
          connectionBanner: "Practice teams are ready. Review lineups and move into the toss.",
        },
      });
      return;
    }

    this.pushToast("Players now choose sides directly in the room and lobby before the toss.", "info");
    this.store.dispatch({
      type: ACTIONS.PATCH_UI,
      payload: {
        connectionBanner: "Set team sides, choose captains from each side, then move into the toss.",
      },
    });
  }

  /**
   * @param {string} _playerId
   */
  pickDraftPlayer(_playerId) {}

  autoDraftTeams() {
    if (this.store.getState().room?.source === "offline") {
      this.pushToast("Practice teams are already filled with AI players.", "info");
      this.store.dispatch({
        type: ACTIONS.PATCH_UI,
        payload: {
          connectionBanner: "Practice teams are already set. Start the toss when you are ready.",
        },
      });
      return;
    }

    this.pushToast("Manual side selection is active. Use the team board to place players into Alpha or Beta.", "info");
    this.store.dispatch({
      type: ACTIONS.PATCH_UI,
      payload: {
        connectionBanner: "Arrange both sides manually, then review captains and ready states.",
      },
    });
  }

  /**
   * @param {Partial<import("../types/models").RoomSettings>} settingsPatch
   */
  updateSettings(settingsPatch) {
    const state = this.store.getState();
    if (!state.room || state.room.hostId !== state.session.localPlayerId) {
      return;
    }

    if (state.match || state.room.status === ROOM_STATUS.LIVE || state.room.status === ROOM_STATUS.COMPLETED) {
      this.pushToast("Room settings are locked after the match starts.", "warning");
      this.store.dispatch({
        type: ACTIONS.PATCH_UI,
        payload: {
          connectionBanner: "Room settings are locked after the match starts.",
          numberSetValidationError: "Room settings are locked after the match starts.",
        },
      });
      return;
    }

    const resolvedNumberSet = resolveNumberSetSettings(settingsPatch, state.room.settings);

    if (!resolvedNumberSet.ok) {
      this.pushToast(resolvedNumberSet.error, "warning");
      this.store.dispatch({
        type: ACTIONS.PATCH_UI,
        payload: {
          connectionBanner: resolvedNumberSet.error,
          numberSetValidationError: resolvedNumberSet.error,
        },
      });
      return;
    }

    const nextSettings = {
      ...state.room.settings,
      ...settingsPatch,
      ...resolvedNumberSet.settings,
      playersPerTeam: state.room.settings.playersPerTeam,
      controlMode: CONTROL_MODES.LOCAL_VS_AI,
    };
    const numberSetPatch = [
      "numberSetMode",
      "numberSetPreset",
      "numberRangeMin",
      "numberRangeMax",
      "customNumbersText",
      "allowedNumbers",
    ].some((key) => Object.prototype.hasOwnProperty.call(settingsPatch, key));

    this.store.dispatch({
      type: ACTIONS.SET_ROOM,
      payload: {
        ...state.room,
        settings: nextSettings,
      },
    });
    this.store.dispatch({
      type: ACTIONS.PATCH_UI,
      payload: {
        numberSetDraft: numberSetPatch ? null : state.ui.numberSetDraft ?? null,
        numberSetValidationError: numberSetPatch ? "" : state.ui.numberSetValidationError ?? "",
        connectionBanner: numberSetPatch ? `${nextSettings.numberSetLabel} number set applied.` : "Room settings updated.",
      },
    });

    if (state.room.source === "offline") {
      return;
    }

    this.socket.emit("update_room_config", {
      settings: {
        matchMode: nextSettings.matchMode,
        bowlingMode: nextSettings.bowlingMode,
        overs: nextSettings.overs,
        numberSetMode: nextSettings.numberSetMode,
        numberSetPreset: nextSettings.numberSetPreset,
        numberSetLabel: nextSettings.numberSetLabel,
        allowedNumbers: nextSettings.allowedNumbers,
        numberRangeMin: nextSettings.numberRangeMin,
        numberRangeMax: nextSettings.numberRangeMax,
        customNumbersText: nextSettings.customNumbersText,
      },
    }, (response) => {
      if (response?.ok) {
        return;
      }

      this.store.dispatch({
        type: ACTIONS.PATCH_UI,
        payload: {
          numberSetValidationError: response?.error ?? "Unable to update room settings.",
        },
      });
      this.handleRoomError({
        message: response?.error ?? "Unable to update room settings.",
      });
    });
  }

  /**
   * @param {"alpha" | "beta"} side
   * @param {string} value
   */
  updateTeamName(side, value) {
    const state = this.store.getState();
    const room = state.room;

    if (!room || room.hostId !== state.session.localPlayerId) {
      return;
    }

    const fallbackName = side === "alpha" ? "Alpha XI" : "Beta XI";
    const nextName = value.trim() || fallbackName;
    const nextRoom = {
      ...room,
      teamNames: {
        alpha: side === "alpha" ? nextName : room.teams.alpha?.name ?? "Alpha XI",
        beta: side === "beta" ? nextName : room.teams.beta?.name ?? "Beta XI",
      },
      teams: {
        ...room.teams,
        [side]: room.teams[side]
          ? {
              ...room.teams[side],
              name: nextName,
            }
          : room.teams[side],
      },
    };

    this.store.dispatch({
      type: ACTIONS.SET_ROOM,
      payload: nextRoom,
    });

    if (room.source === "offline") {
      return;
    }

    this.socket.emit(
      "update_room_config",
      {
        teamNames: {
          alpha: side === "alpha" ? nextName : room.teams.alpha?.name ?? "Alpha XI",
          beta: side === "beta" ? nextName : room.teams.beta?.name ?? "Beta XI",
        },
      },
      (response) => {
        if (response?.ok) {
          return;
        }

        this.handleRoomError({
          message: response?.error ?? "Unable to update team names.",
        });
      },
    );
  }

  /**
   * @param {"alpha" | "beta"} side
   * @param {string} captainId
   */
  setCaptain(side, captainId) {
    const state = this.store.getState();
    if (!state.room || state.room.hostId !== state.session.localPlayerId) {
      return;
    }

    if (!state.room.teamSelections?.[side]?.includes(captainId)) {
      this.pushToast(
        `${side === TEAM_IDS.ALPHA ? "Alpha" : "Beta"} captain must belong to that side first.`,
        "info",
      );
      return;
    }

    const nextCaptains = {
      ...state.room.captains,
      [side]: captainId,
    };

    if (nextCaptains.alpha && nextCaptains.alpha === nextCaptains.beta) {
      return;
    }

    const teams = buildTeams(
      state.room.players,
      nextCaptains,
      state.room.settings.playersPerTeam,
      state.room,
      state.room.teamSelections,
    );

    this.store.dispatch({
      type: ACTIONS.SET_ROOM,
      payload: {
        ...state.room,
        captains: teams.captains,
        teamSelections: teams.selections,
        teams: {
          alpha: teams.alpha,
          beta: teams.beta,
        },
        lineups: teams.lineups,
        draftState: {
          ...(state.room.draftState ?? {
            status: "pending",
            availablePlayerIds: [],
            currentPickIndex: 0,
            pickSequence: [],
            picks: [],
          }),
          status:
            state.room.playerIds.length === state.room.maxPlayers &&
            hasFullTeamSelections(teams.selections, state.room.settings.playersPerTeam)
              ? "complete"
              : "pending",
        },
      },
    });

    if (state.room.source === "offline") {
      return;
    }

    this.socket.emit("update_room_config", {
      captains: teams.captains,
    }, (response) => {
      if (response?.ok) {
        return;
      }

      this.handleRoomError({
        message: response?.error ?? "Unable to update captains.",
      });
    });
  }

  /**
   * @param {string} playerId
   * @param {string | null} teamId
   */
  setPlayerTeam(playerId, teamId) {
    const state = this.store.getState();
    const room = state.room;
    const localPlayerId = state.session.localPlayerId;

    if (!room || !playerId || !localPlayerId) {
      return;
    }

    const canManage = room.hostId === localPlayerId || playerId === localPlayerId;
    if (!canManage) {
      return;
    }

    const normalizedTeamId =
      teamId === TEAM_IDS.ALPHA || teamId === TEAM_IDS.BETA ? teamId : null;

    if (room.source === "offline") {
      const moved = movePlayerBetweenTeams(
        sanitizeTeamSelections(room.players, room.settings.playersPerTeam, room.teamSelections),
        playerId,
        normalizedTeamId,
        room.settings.playersPerTeam,
      );

      if (!moved.ok) {
        this.pushToast(moved.error, "warning");
        return;
      }

      const teams = buildTeams(
        room.players,
        room.captains,
        room.settings.playersPerTeam,
        room,
        moved.selections,
      );

      this.store.dispatch({
        type: ACTIONS.SET_ROOM,
        payload: {
          ...room,
          captains: teams.captains,
          teamSelections: teams.selections,
          teams: {
            alpha: teams.alpha,
            beta: teams.beta,
          },
          lineups: teams.lineups,
        },
      });
      return;
    }

    this.socket.emit(
      "set_player_team",
      {
        playerId,
        teamId: normalizedTeamId,
      },
      (response) => {
        if (response?.ok) {
          return;
        }

        this.handleRoomError({
          message: response?.error ?? "Unable to change team side.",
        });
      },
    );
  }

  /**
   * @param {"alpha" | "beta"} teamId
   * @param {"batting" | "bowling"} type
   * @param {string[]} nextOrder
   */
  updateTeamLineup(teamId, type, nextOrder) {
    const state = this.store.getState();
    const room = state.room;
    const team = room?.teams[teamId];
    const lineup = room?.lineups?.[teamId];

    if (!room || !team || !lineup) {
      return;
    }

    if (!isValidLineup(nextOrder, team.playerIds)) {
      return;
    }

    const nextTeam = {
      ...team,
      battingOrder: type === "batting" ? nextOrder : team.battingOrder,
      bowlingOrder: type === "bowling" ? nextOrder : team.bowlingOrder,
      currentBowlerId:
        type === "bowling"
          ? nextOrder[0] ?? team.currentBowlerId
          : team.currentBowlerId,
    };

    const nextLineup = {
      ...lineup,
      battingOrder: type === "batting" ? nextOrder : lineup.battingOrder,
      bowlingOrder: type === "bowling" ? nextOrder : lineup.bowlingOrder,
    };

    this.store.dispatch({
      type: ACTIONS.SET_ROOM,
      payload: {
        ...room,
        teams: {
          ...room.teams,
          [teamId]: nextTeam,
        },
        lineups: {
          ...room.lineups,
          [teamId]: nextLineup,
        },
      },
    });
  }

  lockLineups() {
    const state = this.store.getState();
    const room = state.room;

    if (!room?.teams.alpha || !room.teams.beta || !room.lineups?.alpha || !room.lineups.beta) {
      return;
    }

    this.store.dispatch({
      type: ACTIONS.SET_ROOM,
      payload: {
        ...room,
        status: ROOM_STATUS.LINEUP,
        teams: {
          alpha: { ...room.teams.alpha, lockedLineup: true },
          beta: { ...room.teams.beta, lockedLineup: true },
        },
        lineups: {
          alpha: { ...room.lineups.alpha, locked: true },
          beta: { ...room.lineups.beta, locked: true },
        },
      },
    });
  }

  resetToHome() {
    this.resumeInFlight = false;
    this.clearPendingRoomAction();
    const state = this.store.getState();

    if (state.room?.source === "realtime") {
      this.socket.emit("leave_room", {}, () => {});
    }

    this.store.dispatch({ type: ACTIONS.RESET_FLOW });

    if (state.room?.source === "offline") {
      if (this.socket.id) {
        this.store.dispatch({
          type: ACTIONS.UPDATE_SESSION,
          payload: {
            localPlayerId: this.socket.id,
          },
        });
      }

      this.store.dispatch({
        type: ACTIONS.SET_CONNECTION,
        payload: {
          status: this.socket.id ? CONNECTION_STATUS.CONNECTED : CONNECTION_STATUS.RECONNECTING,
          note: this.socket.id ? "Connected to realtime backend" : "Connecting to realtime backend",
          lastSyncAt: Date.now(),
        },
      });
    }
  }

  discardRoom() {
    const state = this.store.getState();

    if (!state.room) {
      return;
    }

    if (state.room.source === "offline") {
      this.resetToHome();
      this.store.dispatch({
        type: ACTIONS.PATCH_UI,
        payload: {
          connectionBanner: "Practice room discarded.",
        },
      });
      this.pushToast("Practice room discarded.", "success");
      return;
    }

    if (state.room.hostId !== state.session.localPlayerId) {
      this.handleRoomError({
        message: "Only the room host can discard the room.",
      });
      return;
    }

    this.socket.emit("discard_room", {}, (response) => {
      if (response?.ok) {
        return;
      }

      this.handleRoomError({
        message: response?.error ?? "Unable to discard room.",
      });
    });
  }

  toggleReady() {
    const state = this.store.getState();
    const room = state.room;
    const localPlayerId = state.session.localPlayerId;
    const player = room?.players.find((entry) => entry.id === localPlayerId);

    if (!room || !player) {
      return;
    }

    if (room.source === "offline") {
      const nextStatus = player.status === "ready" ? "unready" : "ready";
      const nextPlayers = room.players.map((entry) =>
        entry.id === localPlayerId
          ? {
              ...entry,
              status: nextStatus,
              connectionState: {
                ...entry.connectionState,
                note: nextStatus === "ready" ? "Ready for practice toss" : "Reviewing practice settings",
                lastSyncAt: Date.now(),
              },
            }
          : entry,
      );

      this.store.dispatch({
        type: ACTIONS.SET_ROOM,
        payload: {
          ...room,
          players: nextPlayers,
        },
      });
      this.store.dispatch({
        type: ACTIONS.PATCH_UI,
        payload: {
          connectionBanner:
            nextStatus === "ready"
              ? "Practice lobby ready. Start the toss when you want."
              : "Practice lobby unlocked. Change settings or lineups before readying again.",
        },
      });
      return;
    }

    this.socket.emit(
      "player_ready",
      {
        ready: player.status !== "ready",
      },
      (response) => {
        if (response?.ok) {
          return;
        }

        this.handleRoomError({
          message: response?.error ?? "Unable to change ready state.",
        });
      },
    );
  }

  /**
   * @param {string} playerId
   */
  removePlayer(playerId) {
    const state = this.store.getState();

    if (!state.room || state.room.hostId !== state.session.localPlayerId || !playerId || playerId === state.room.hostId) {
      return;
    }

    if (state.room.source === "offline") {
      this.pushToast("AI players stay fixed in practice mode.", "info");
      return;
    }

    this.socket.emit(
      "kick_player",
      {
        playerId,
      },
      (response) => {
        if (response?.ok) {
          const playerName = state.room?.players.find((player) => player.id === playerId)?.name ?? "Player";
          this.pushToast(`${playerName} was removed from the room.`, "success");
          return;
        }

        this.handleRoomError({
          message: response?.error ?? "Unable to remove player.",
        });
      },
    );
  }
}
