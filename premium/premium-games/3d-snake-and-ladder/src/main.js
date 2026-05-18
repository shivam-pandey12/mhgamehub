import "./styles.css";
import { RoyaleScene } from "./game/scene.js";
import { RoyaleUI } from "./game/ui.js";
import { AudioBus } from "./game/audio.js";
import { buildMovementPath, TILE_COUNT } from "./game/board.js";
import { createAnimationToken } from "./game/animation.js";
import { BotTurnController, getBotFlavorLine } from "./game/bots.js";
import {
  applySetupPreset,
  buildPlayersFromSetup,
  createDefaultSetup,
  normalizeSetup,
  updatePlayerCount,
  updateSlot
} from "./game/setup.js";
import { DEFAULT_RULES, getStartPosition, mergeRules, resolveRollTarget } from "./game/rules.js";
import {
  DEFAULT_MODE_ID,
  applyModeDefaults,
  getGameMode
} from "./game/modes.js";
import {
  DEFAULT_BOARD_PRESET_ID,
  createBoardRuntime,
  getTransportForTileFromBoard
} from "./game/board-presets.js";
import {
  createPlayerStatus,
  chooseBotSwapTarget,
  getPowerUpLabel,
  getRandomPowerUp,
  shouldBotUseReroll
} from "./game/powerups.js";
import { DEFAULT_THEME_ID, getTheme } from "./game/themes.js";
import {
  createMatchStats,
  finalizeMatchStats,
  recordEventTile,
  recordPowerUp,
  recordRoll,
  recordTile,
  recordTransport
} from "./game/stats.js";
import { STORAGE_KEYS, loadStoredValue, saveStoredValue } from "./game/storage.js";
import { OnlineGameClient } from "./game/online-client.js";
import { sanitizePlayerName } from "./game/engine.js";
import {
  isWebGLSupported,
  normalizeQualityLevel,
  resolveQualityProfile
} from "./game/quality.js";

const canvas = document.querySelector("#game-canvas");

const DEFAULT_PHASE3 = {
  modeId: DEFAULT_MODE_ID,
  boardPresetId: DEFAULT_BOARD_PRESET_ID,
  powerUpsEnabled: false,
  eventTilesEnabled: false,
  themeId: DEFAULT_THEME_ID,
  accessibility: {
    reduceMotion: false,
    highContrastNumbers: false,
    largeText: false
  }
};

const storedSettings = loadStoredValue(STORAGE_KEYS.settings, {});
const defaultSetup = createDefaultSetup();
const phase3Settings = normalizePhase3(loadStoredValue(STORAGE_KEYS.phase3, DEFAULT_PHASE3));
const webglSupported = isWebGLSupported();
const debugAllowed = Boolean(import.meta.env?.DEV);

const state = {
  gameStatus: "menu",
  setup: normalizeSetup(loadStoredValue(STORAGE_KEYS.setup, defaultSetup)),
  rules: mergeRules(loadStoredValue(STORAGE_KEYS.rules, DEFAULT_RULES)),
  players: [],
  currentPlayerIndex: 0,
  positions: [],
  diceResult: null,
  diceState: "Ready",
  isRolling: false,
  isMoving: false,
  winner: null,
  gameLog: [],
  cinematicCameraEnabled: storedSettings.cinematicCameraEnabled ?? true,
  soundEnabled: storedSettings.soundEnabled ?? true,
  sidePanelOpen: storedSettings.sidePanelOpen ?? true,
  qualityLevel: normalizeQualityLevel(storedSettings.qualityLevel || "auto"),
  qualityProfile: resolveQualityProfile(storedSettings.qualityLevel || "auto"),
  webglSupported,
  webglMessage: webglSupported ? "" : "WebGL is not available in this browser. Local setup still works, but the 3D board cannot render here.",
  debugEnabled: debugAllowed && Boolean(loadStoredValue("slr.debug.v1", false)),
  fps: 0,
  themeId: phase3Settings.themeId,
  theme: getTheme(phase3Settings.themeId).label,
  modeId: phase3Settings.modeId,
  boardPresetId: phase3Settings.boardPresetId,
  powerUpsEnabled: phase3Settings.powerUpsEnabled,
  eventTilesEnabled: phase3Settings.eventTilesEnabled,
  accessibility: phase3Settings.accessibility,
  activeBoard: createBoardRuntime(phase3Settings.boardPresetId),
  matchOrigin: "local",
  introActive: false,
  online: {
    view: getInitialSurface(),
    connectionStatus: "offline",
    name: "Player",
    joinCode: "",
    playerCount: 2,
    publicPlayerCount: "any",
    publicModeId: "any",
    allowBotFill: true,
    roomCode: "",
    roomType: "",
    botFilled: false,
    playerId: "",
    sessionToken: "",
    lobby: null,
    queue: null,
    rematch: null,
    error: "",
    operation: "",
    quitConfirm: false,
    isMyTurn: false
  },
  pendingRoll: null,
  selectedSwapTargetId: null,
  rematchSnapshot: null,
  lastEvent: null,
  turnCount: 1,
  botStatus: { active: false, playerId: null, text: "" },
  matchStats: null,
  validationMessage: ""
};

const scene = webglSupported
  ? new RoyaleScene(canvas, {
      getCinematicEnabled: () => state.cinematicCameraEnabled && state.rules.autoCameraFollow,
      qualityProfile: state.qualityProfile,
      onWebGLContextLost: () => {
        state.webglSupported = false;
        state.webglMessage = "WebGL context was lost. Try reloading if the board does not recover.";
        ui?.showToast?.("WebGL context lost. Board recovery is in progress.", "warning");
        syncUI();
      },
      onWebGLContextRestored: () => {
        state.webglSupported = true;
        state.webglMessage = "";
        ui?.showToast?.("3D board recovered.", "info");
        syncUI();
      },
      canDiceClick: () => canTriggerDiceRoll(),
      onDiceClick: () => {
        if (!canTriggerDiceRoll()) return;
        audio.playSound("click");
        if (state.matchOrigin === "online") {
          ensureOnlineClient().requestRoll();
          return;
        }
        rollDice("human");
      }
    })
  : createSceneFallback(canvas);

const audio = new AudioBus();
audio.setEnabled(state.soundEnabled);

let actionToken = createAnimationToken();
let botController;
let onlineClient;
let pendingOnlineSnapshot = null;
let onlineAnimation = Promise.resolve();
let suppressNextRoomClosedNotice = false;

const ui = new RoyaleUI({
  onPlayerCountChange: (count) => {
    state.setup = updatePlayerCount(state.setup, count);
    state.validationMessage = "";
    persistSetup();
    syncUI();
  },
  onSetupPreset: (preset) => {
    state.setup = applySetupPreset(preset);
    state.validationMessage = "";
    persistSetup();
    syncUI();
  },
  onResetSetup: () => {
    state.setup = createDefaultSetup();
    state.rules = mergeRules(DEFAULT_RULES);
    applyPhase3Options(normalizePhase3(DEFAULT_PHASE3));
    state.validationMessage = "";
    persistSetup();
    persistRules();
    persistPhase3();
    refreshBoardRuntime();
    syncUI();
  },
  onSlotTypeChange: (index, type) => {
    state.setup = updateSlot(state.setup, index, { type });
    state.validationMessage = "";
    persistSetup();
    syncUI();
  },
  onSlotNameChange: (index, value) => {
    state.setup = updateSlot(state.setup, index, { name: value });
    persistSetup();
  },
  onSlotPersonalityChange: (index, personality) => {
    state.setup = updateSlot(state.setup, index, { personality });
    persistSetup();
    syncUI();
  },
  onPlaySurfaceChange: (surface) => {
    if (state.gameStatus !== "menu") return;
    if (surface === "local") {
      if ((state.online.roomCode || state.online.lobby) && !confirmOnlineQuit()) return;
      onlineClient?.cancelPublicQueue();
      requestOnlineLeave();
      state.online.lobby = null;
      state.online.queue = null;
      state.online.roomCode = "";
      state.online.roomType = "";
      state.online.botFilled = false;
      state.online.playerId = "";
      state.online.quitConfirm = false;
    }
    state.online.view = surface || "local";
    state.online.error = "";
    if (surface !== "local") ensureOnlineClient();
    syncUI();
  },
  onOnlineFieldChange: (field, value) => {
    if (!field) return;
    state.online[field] = field === "playerCount" ? Number(value)
      : field === "allowBotFill" ? value === "true" || value === true
        : value;
    if (!["name", "joinCode"].includes(field)) {
      syncUI();
    }
  },
  onCreateOnlineRoom: () => createOnlineRoom(),
  onJoinOnlineRoom: () => joinOnlineRoom(),
  onRetryOnline: () => retryOnlineConnection(),
  onOnlineReady: (ready) => {
    ensureOnlineClient().setReady(ready);
  },
  onOnlineStart: () => {
    ensureOnlineClient().startMatch();
  },
  onOnlineLeave: () => requestOnlineLeaveConfirmation(),
  onOnlineLeaveConfirm: () => leaveOnlineRoom({ requireConfirm: false }),
  onOnlineLeaveCancel: () => cancelOnlineLeaveConfirmation(),
  onOnlineFillBots: () => {
    ensureOnlineClient().fillBots();
  },
  onFindPublicMatch: () => findPublicMatch(),
  onFindNewMatch: () => findNewPublicMatch(),
  onCancelPublicQueue: () => {
    ensureOnlineClient().cancelPublicQueue();
    state.online.view = "public";
    state.online.queue = null;
    syncUI();
  },
  onCopyRoomCode: () => copyRoomCode(),
  onModeChange: (modeId) => {
    if (!ensureSetupEditable("Game mode is locked during an active match.")) return;
    const next = applyModeDefaults({
      modeId: state.modeId,
      boardPresetId: state.boardPresetId,
      powerUpsEnabled: state.powerUpsEnabled,
      eventTilesEnabled: state.eventTilesEnabled
    }, modeId);
    state.modeId = next.modeId;
    state.boardPresetId = next.boardPresetId;
    state.powerUpsEnabled = next.powerUpsEnabled;
    state.eventTilesEnabled = next.eventTilesEnabled;
    state.validationMessage = "";
    persistPhase3();
    refreshBoardRuntime();
    syncUI();
  },
  onBoardPresetChange: (presetId) => {
    if (!ensureSetupEditable("Board preset is locked during an active match.")) return;
    state.modeId = "custom";
    state.boardPresetId = presetId;
    state.validationMessage = "";
    persistPhase3();
    refreshBoardRuntime();
    syncUI();
  },
  onPowerUpsToggle: () => toggleCustomOption("powerUpsEnabled"),
  onEventTilesToggle: () => toggleCustomOption("eventTilesEnabled"),
  onAccessibilityToggle: (key) => {
    state.accessibility = {
      ...state.accessibility,
      [key]: !state.accessibility[key]
    };
    persistPhase3();
    refreshBoardRuntime();
    syncUI();
  },
  onQualityChange: (level) => {
    state.qualityLevel = normalizeQualityLevel(level);
    state.qualityProfile = resolveQualityProfile(state.qualityLevel);
    scene.setQualityProfile?.(state.qualityProfile);
    persistSettings();
    syncUI();
  },
  onRuleToggle: (ruleKey) => {
    if (!ensureSetupEditable("Rules are locked during an active match.")) return;
    state.rules = mergeRules({ ...state.rules, [ruleKey]: !state.rules[ruleKey] });
    persistRules();
    scene.setRuleOptions(state.rules);
    syncUI();
  },
  onStartGame: () => {
    void startGame();
  },
  onRollDice: () => {
    if (state.matchOrigin === "online") {
      ensureOnlineClient().requestRoll();
      return;
    }
    rollDice("human");
  },
  onUsePowerUp: () => {
    if (state.matchOrigin === "online") {
      const player = getCurrentPlayer();
      ensureOnlineClient().usePowerUp({ powerUpId: player?.status?.heldPowerUp, targetPlayerId: state.selectedSwapTargetId });
      return;
    }
    void useCurrentHumanPowerUp();
  },
  onKeepRoll: () => {
    void resolvePendingRoll(false);
  },
  onUseReroll: () => {
    void resolvePendingRoll(true);
  },
  onSwapTargetChange: (playerId) => {
    state.selectedSwapTargetId = playerId;
    syncUI();
  },
  onRematchSame: () => state.matchOrigin === "online" ? ensureOnlineClient().requestRematch("rematch") : rematchSameSettings(),
  onChangeSetup: () => showMainMenu(),
  onRestartClassic: () => restartClassic(),
  onRestart: () => state.matchOrigin === "online" ? ensureOnlineClient().requestRematch("rematch") : restartMatch(),
  onMainMenu: () => showMainMenu({ preferGameHub: true }),
  onTogglePanel: () => {
    state.sidePanelOpen = !state.sidePanelOpen;
    persistSettings();
    syncUI();
  },
  onToggleCinematic: () => {
    state.cinematicCameraEnabled = !state.cinematicCameraEnabled;
    scene.setCinematicEnabled(state.cinematicCameraEnabled && state.rules.autoCameraFollow);
    persistSettings();
    syncUI();
  },
  onToggleSound: () => {
    state.soundEnabled = !state.soundEnabled;
    audio.setEnabled(state.soundEnabled);
    persistSettings();
    syncUI();
  },
  onEscape: () => {
    if (state.online.quitConfirm) {
      cancelOnlineLeaveConfirmation();
      return;
    }
    if (state.sidePanelOpen) {
      state.sidePanelOpen = false;
      persistSettings();
      syncUI();
    }
  },
  onButtonClick: () => audio.playSound("click")
});

botController = new BotTurnController({
  onStatusChange: (status) => {
    state.botStatus = status;
    if (status.playerId) {
      scene.setBotThinking(status.playerId, status.active && status.text === "Bot is thinking...");
    } else {
      scene.setBotThinking(null, false);
    }
    syncUI();
  },
  onReady: (player) => {
    startBotRoll(player);
  }
});

onlineClient = new OnlineGameClient({
  onStatus: (status) => {
    state.online.connectionStatus = status;
    if (status === "unavailable" || status === "disconnected") {
      state.online.operation = "";
      if (state.matchOrigin === "online") {
        state.online.error = status === "unavailable" ? "Online server unavailable." : "Connection lost. Trying to reconnect...";
      }
    } else if (status === "connected" && /connection lost|server unavailable/i.test(state.online.error || "")) {
      state.online.error = "";
    }
    syncUI();
  },
  onOperation: (operation) => {
    state.online.operation = operation;
    syncUI();
  },
  onEvent: (eventName, payload) => {
    state.online.operation = "";
    void handleOnlineEvent(eventName, payload);
  }
});

function normalizePhase3(saved = {}) {
  const accessibility = {
    ...DEFAULT_PHASE3.accessibility,
    ...(saved.accessibility || {})
  };
  const modeId = getGameMode(saved.modeId).id;
  const modeApplied = applyModeDefaults({
    ...DEFAULT_PHASE3,
    ...saved,
    accessibility
  }, modeId);
  const runtime = createBoardRuntime(modeApplied.boardPresetId);
  return {
    ...modeApplied,
    boardPresetId: runtime.preset.id,
    themeId: getTheme(saved.themeId).id,
    accessibility
  };
}

function applyPhase3Options(options) {
  state.modeId = options.modeId;
  state.boardPresetId = options.boardPresetId;
  state.powerUpsEnabled = options.powerUpsEnabled;
  state.eventTilesEnabled = options.eventTilesEnabled;
  state.themeId = options.themeId;
  state.theme = getTheme(options.themeId).label;
  state.accessibility = { ...DEFAULT_PHASE3.accessibility, ...options.accessibility };
}

function ensureOnlineClient() {
  onlineClient.connect();
  return onlineClient;
}

function requestOnlineLeave() {
  if (!onlineClient) return false;
  suppressNextRoomClosedNotice = true;
  const sent = onlineClient.leaveRoom();
  if (!sent) suppressNextRoomClosedNotice = false;
  return sent;
}

function getSafeOnlineName() {
  return sanitizePlayerName(state.online.name, "Player");
}

function retryOnlineConnection() {
  state.online.error = "";
  state.online.operation = "retry";
  ensureOnlineClient().retry();
  syncUI();
}

function createOnlineRoom() {
  const client = ensureOnlineClient();
  state.online.error = "";
  client.createRoom({
    name: getSafeOnlineName(),
    playerCount: state.online.playerCount || state.setup.playerCount,
    modeId: state.modeId,
    boardPresetId: state.boardPresetId,
    rules: state.rules,
    powerUpsEnabled: state.powerUpsEnabled,
    eventTilesEnabled: state.eventTilesEnabled
  });
  syncUI();
}

function joinOnlineRoom() {
  const client = ensureOnlineClient();
  state.online.error = "";
  client.joinRoom({
    name: getSafeOnlineName(),
    roomCode: state.online.joinCode
  });
  syncUI();
}

function findPublicMatch() {
  const client = ensureOnlineClient();
  state.online.error = "";
  state.online.view = "queue";
  client.joinPublicQueue({
    name: getSafeOnlineName(),
    preferredPlayerCount: state.online.publicPlayerCount,
    preferredModeId: state.online.publicModeId,
    allowBotFill: state.online.allowBotFill
  });
  syncUI();
}

function findNewPublicMatch() {
  const client = ensureOnlineClient();
  state.online.error = "";
  state.online.view = "queue";
  state.matchOrigin = "local";
  state.gameStatus = "menu";
  state.players = [];
  state.positions = [];
  state.winner = null;
  state.online.lobby = null;
  state.online.queue = null;
  state.online.roomCode = "";
  state.online.roomType = "";
  state.online.botFilled = false;
  state.online.playerId = "";
  scene.setPlayers([]);
  client.findNewMatch({
    name: getSafeOnlineName(),
    preferredPlayerCount: state.online.publicPlayerCount,
    preferredModeId: state.online.publicModeId,
    allowBotFill: state.online.allowBotFill
  });
  syncUI();
}

function confirmOnlineQuit() {
  if (!state.online.roomCode && !state.online.lobby && state.matchOrigin !== "online") return true;
  return true;
}

function requestOnlineLeaveConfirmation() {
  if (!state.online.roomCode && !state.online.lobby && state.matchOrigin !== "online") {
    leaveOnlineRoom({ requireConfirm: false });
    return;
  }
  state.online.quitConfirm = true;
  state.online.error = "";
  syncUI();
}

function cancelOnlineLeaveConfirmation() {
  state.online.quitConfirm = false;
  syncUI();
}

function leaveOnlineRoom({ requireConfirm = false } = {}) {
  if (requireConfirm) {
    requestOnlineLeaveConfirmation();
    return;
  }
  state.online.quitConfirm = false;
  requestOnlineLeave();
  cancelActiveAction();
  state.matchOrigin = "local";
  state.gameStatus = "menu";
  state.online.view = "private";
  state.online.error = "";
  state.online.operation = "";
  state.online.lobby = null;
  state.online.queue = null;
  state.online.roomCode = "";
  state.online.roomType = "";
  state.online.botFilled = false;
  state.online.playerId = "";
  state.online.sessionToken = "";
  scene.setPlayers([]);
  refreshBoardRuntime();
  syncUI();
}

function copyRoomCode() {
  const code = state.online.roomCode || state.online.lobby?.roomCode;
  if (!code) return;
  navigator.clipboard?.writeText(code).catch(() => {});
  ui.showToast(`Room code ${code} copied.`, "info");
}

async function handleOnlineEvent(eventName, payload = {}) {
  if (payload.roomCode && state.online.roomCode && payload.roomCode !== state.online.roomCode) return;
  if (eventName === "roomCreated" || eventName === "roomJoined") {
    state.online.roomCode = payload.roomCode;
    state.online.playerId = payload.playerId;
    state.online.sessionToken = payload.sessionToken;
    state.online.botFilled = Boolean(payload.botFilled ?? state.online.botFilled);
    state.online.quitConfirm = false;
    state.online.view = "lobby";
    onlineClient.rememberSession({
      roomCode: payload.roomCode,
      playerId: payload.playerId,
      sessionToken: payload.sessionToken
    });
    syncUI();
    return;
  }
  if (eventName === "lobbyState") {
    state.online.lobby = payload;
    state.online.roomCode = payload.roomCode || state.online.roomCode;
    state.online.roomType = payload.roomType || state.online.roomType;
    state.online.botFilled = Boolean(payload.botFilled);
    state.online.view = "lobby";
    state.online.error = "";
    state.online.quitConfirm = false;
    if (payload.settings) applyOnlineSettings(payload.settings);
    syncUI();
    return;
  }
  if (eventName === "queueState") {
    state.online.queue = payload;
    if (!payload.active) state.online.view = "public";
    syncUI();
    return;
  }
  if (eventName === "matchFound") {
    state.online.roomCode = payload.roomCode;
    state.online.botFilled = Boolean(payload.botFilled);
    if (payload.playerId) state.online.playerId = payload.playerId;
    if (payload.sessionToken) {
      state.online.sessionToken = payload.sessionToken;
      onlineClient?.rememberSession({
        roomCode: payload.roomCode,
        playerId: payload.playerId,
        sessionToken: payload.sessionToken
      });
    }
    state.online.view = "lobby";
    ui.showToast("Match found. Preparing board...", "bonus");
    syncUI();
    return;
  }
  if (eventName === "matchStarted") {
    await startOnlineMatch(payload.snapshot, payload.intro);
    return;
  }
  if (eventName === "diceRolled") {
    onlineAnimation = animateOnlineDice(payload);
    return;
  }
  if (eventName === "movementSequence") {
    onlineAnimation = onlineAnimation.then(() => animateOnlineSequence(payload)).catch(() => {});
    return;
  }
  if (eventName === "stateSnapshot") {
    if (state.isRolling || state.isMoving) {
      pendingOnlineSnapshot = payload.snapshot;
    } else {
      applyServerSnapshot(payload.snapshot);
    }
    return;
  }
  if (eventName === "gameEvent") {
    if (payload.message) setEvent(payload.message, payload.type || "info");
    return;
  }
  if (eventName === "matchEnded") {
    applyServerSnapshot(payload.snapshot);
    return;
  }
  if (eventName === "rematchState") {
    state.online.rematch = payload;
    syncUI();
    return;
  }
  if (eventName === "playerDisconnected" || eventName === "playerReconnected") {
    ui.showToast(payload.name ? `${payload.name} ${eventName === "playerDisconnected" ? "disconnected" : "reconnected"}.` : "Presence changed.", eventName === "playerDisconnected" ? "warning" : "info");
    return;
  }
  if (eventName === "playerReplacedByBot") {
    ui.showToast(payload.botName ? `${payload.botName} joined as a server bot.` : "A player was replaced by a bot.", "warning");
    return;
  }
  if (eventName === "roomClosed") {
    const message = payload.message || "Room closed.";
    const selfInitiatedClose = /you left/i.test(message) || (suppressNextRoomClosedNotice && /left|quit/i.test(message));
    suppressNextRoomClosedNotice = false;
    state.online.error = selfInitiatedClose ? "" : message;
    state.online.view = "private";
    state.matchOrigin = "local";
    state.gameStatus = "menu";
    state.online.quitConfirm = false;
    state.online.roomCode = "";
    state.online.roomType = "";
    state.online.botFilled = false;
    state.online.playerId = "";
    onlineClient.clearSession();
    scene.setPlayers([]);
    syncUI();
    return;
  }
  if (eventName === "errorMessage") {
    state.online.error = payload.message || "Online server error.";
    if (/seat was replaced|match expired|reconnect session/i.test(state.online.error)) {
      onlineClient.clearSession();
    }
    ui.showToast(state.online.error, "warning");
    syncUI();
  }
}

function applyOnlineSettings(settings) {
  state.modeId = settings.modeId || state.modeId;
  state.boardPresetId = settings.boardPresetId || state.boardPresetId;
  state.rules = mergeRules(settings.rules || state.rules);
  state.powerUpsEnabled = Boolean(settings.powerUpsEnabled);
  state.eventTilesEnabled = Boolean(settings.eventTilesEnabled);
  refreshBoardRuntime();
}

async function startOnlineMatch(snapshot, intro = {}) {
  cancelActiveAction();
  applyServerSnapshot(snapshot, { forcePlayers: true });
  state.matchOrigin = "online";
  state.online.view = "lobby";
  state.introActive = true;
  syncUI();
  await ui.showVsIntro({
    players: state.players,
    modeLabel: getGameMode(state.modeId).label,
    presetLabel: state.activeBoard.preset.label,
    matchType: state.online.botFilled ? "Bot-Filled Match" : state.online.roomType === "public" ? "Public Match" : "Private Room",
    rematch: Boolean(intro.rematch)
  }).catch(() => {});
  state.introActive = false;
  updateOnlineTurnOwnership();
  syncUI();
}

function applyServerSnapshot(snapshot, options = {}) {
  if (!snapshot) return;
  state.matchOrigin = "online";
  state.gameStatus = snapshot.gameStatus || "playing";
  state.modeId = snapshot.settings?.modeId || state.modeId;
  state.boardPresetId = snapshot.boardPresetId || snapshot.settings?.boardPresetId || state.boardPresetId;
  state.rules = mergeRules(snapshot.settings?.rules || state.rules);
  state.powerUpsEnabled = Boolean(snapshot.settings?.powerUpsEnabled);
  state.eventTilesEnabled = Boolean(snapshot.settings?.eventTilesEnabled);
  state.activeBoard = createBoardRuntime(state.boardPresetId);
  state.players = (snapshot.players || []).map((player) => ({
    ...player,
    status: player.status || createPlayerStatus()
  }));
  state.positions = state.players.map((player) => player.position);
  state.currentPlayerIndex = snapshot.currentPlayerIndex || 0;
  state.diceResult = snapshot.diceResult || null;
  state.diceState = snapshot.diceState || "Ready";
  state.winner = snapshot.winner ? state.players.find((player) => player.id === snapshot.winner.id) || snapshot.winner : null;
  state.gameLog = snapshot.gameLog || [];
  state.matchStats = snapshot.matchStats || null;
  state.turnCount = snapshot.turnCount || 1;
  state.online.roomCode = snapshot.roomCode || state.online.roomCode;
  state.online.roomType = snapshot.roomType || state.online.roomType;
  state.online.botFilled = Boolean(snapshot.botFilled);
  scene.setBoardConfig(state.activeBoard, getSceneOptions());
  if (options.forcePlayers || !samePlayerIds(scene.players || [], state.players)) {
    scene.setPlayers(state.players);
  } else {
    scene.syncTokenPositions(state.players);
  }
  scene.setActivePlayer(state.currentPlayerIndex);
  scene.setActiveTokenPulse(getCurrentPlayer()?.id, true);
  updateOnlineTurnOwnership();
  if (state.gameStatus === "won" && state.winner) {
    scene.showVictory(state.winner);
  }
  syncUI();
}

async function animateOnlineDice(payload) {
  const player = state.players.find((entry) => entry.id === payload.playerId);
  if (!player) return;
  state.isRolling = true;
  state.diceState = "Rolling...";
  syncUI();
  await scene.animateDiceRoll(payload.result, actionToken);
  state.diceResult = payload.result;
  state.isRolling = false;
  scene.showResultPop(payload.result);
  syncUI();
}

async function animateOnlineSequence(payload) {
  state.isMoving = true;
  syncUI();
  for (const segment of payload.sequence || []) {
    if (actionToken.cancelled) return;
    await animateOnlineSegment(segment);
  }
  state.isMoving = false;
  (payload.events || []).forEach((event) => event.message && setEvent(event.message, event.type || "info"));
  applyServerSnapshot(payload.snapshot || pendingOnlineSnapshot);
  pendingOnlineSnapshot = null;
}

async function animateOnlineSegment(segment) {
  const playerIndex = state.players.findIndex((player) => player.id === segment.playerId);
  const player = state.players[playerIndex];
  if (!player) return;
  if (segment.type === "move") {
    await scene.moveTokenTileByTile(player.id, segment.path || buildMovementPath(segment.from, segment.to), state.players, playerIndex, actionToken, (tile) => {
      player.position = tile;
      state.positions[playerIndex] = tile;
      syncUI();
    });
    return;
  }
  if (segment.type === "transport") {
    await scene.animateTransport(player.id, segment.transport, state.players, playerIndex, actionToken);
    player.position = segment.transport.to;
    state.positions[playerIndex] = segment.transport.to;
    scene.syncTokenPositions(state.players);
    syncUI();
    return;
  }
  if (segment.type === "eventMove") {
    await scene.moveTokenDirect(player.id, segment.to, state.players, playerIndex, actionToken, segment.eventType);
    player.position = segment.to;
    state.positions[playerIndex] = segment.to;
    scene.syncTokenPositions(state.players);
    syncUI();
    return;
  }
  if (segment.type === "swap") {
    const targetIndex = state.players.findIndex((candidate) => candidate.id === segment.targetPlayerId);
    const target = state.players[targetIndex];
    if (!target) return;
    await scene.swapTokens(player, playerIndex, target, targetIndex, state.players, actionToken);
    player.position = segment.to;
    target.position = segment.from;
    state.positions[playerIndex] = player.position;
    state.positions[targetIndex] = target.position;
    scene.syncTokenPositions(state.players);
    syncUI();
  }
}

function updateOnlineTurnOwnership() {
  const current = getCurrentPlayer();
  state.online.isMyTurn = state.matchOrigin === "online" && Boolean(current?.id && current.id === state.online.playerId) && state.gameStatus === "playing" && !state.introActive;
}

function samePlayerIds(a = [], b = []) {
  if (a.length !== b.length) return false;
  return a.every((player, index) => player.id === b[index]?.id);
}

function syncUI() {
  document.documentElement.classList.toggle("reduce-motion", state.accessibility.reduceMotion);
  document.documentElement.classList.toggle("large-ui-text", state.accessibility.largeText);
  document.documentElement.classList.toggle("online-match", state.matchOrigin === "online");
  document.documentElement.classList.toggle("webgl-unavailable", !state.webglSupported);
  document.documentElement.dataset.quality = state.qualityProfile.id;
  ui.update(state);
  scene.setRuleOptions(state.rules);
  scene.setQualityProfile?.(state.qualityProfile);
  scene.setActivePlayer(state.currentPlayerIndex);
  scene.setDiceResult(state.diceResult);
  updateDebugPanel();
}

function persistSettings() {
  saveStoredValue(STORAGE_KEYS.settings, {
    cinematicCameraEnabled: state.cinematicCameraEnabled,
    soundEnabled: state.soundEnabled,
    sidePanelOpen: state.sidePanelOpen,
    qualityLevel: state.qualityLevel,
    theme: state.theme,
    themeId: state.themeId
  });
}

function persistSetup() {
  saveStoredValue(STORAGE_KEYS.setup, state.setup);
}

function persistRules() {
  saveStoredValue(STORAGE_KEYS.rules, state.rules);
}

function persistPhase3() {
  saveStoredValue(STORAGE_KEYS.phase3, {
    modeId: state.modeId,
    boardPresetId: state.boardPresetId,
    powerUpsEnabled: state.powerUpsEnabled,
    eventTilesEnabled: state.eventTilesEnabled,
    themeId: state.themeId,
    accessibility: state.accessibility
  });
}

function getSceneOptions() {
  return {
    eventTilesEnabled: state.eventTilesEnabled,
    quickMode: getGameMode(state.modeId).quick,
    reduceMotion: state.accessibility.reduceMotion,
    highContrastNumbers: state.accessibility.highContrastNumbers,
    largeText: state.accessibility.largeText
  };
}

function refreshBoardRuntime() {
  state.activeBoard = createBoardRuntime(state.boardPresetId);
  if (!state.activeBoard.valid) {
    state.validationMessage = `Invalid board preset data. Falling back to ${state.activeBoard.preset.label}.`;
  }
  scene.setBoardConfig(state.activeBoard, getSceneOptions());
}

function ensureSetupEditable(message) {
  if (state.gameStatus === "menu") return true;
  state.validationMessage = message;
  syncUI();
  return false;
}

function toggleCustomOption(key) {
  if (!ensureSetupEditable("Mode options are locked during an active match.")) return;
  if (state.modeId !== "custom") {
    state.modeId = "custom";
  }
  state[key] = !state[key];
  persistPhase3();
  refreshBoardRuntime();
  syncUI();
}

function cancelActiveAction() {
  botController?.cancel();
  ui.hideVsIntro?.();
  actionToken.cancel();
  actionToken = createAnimationToken();
  state.isRolling = false;
  state.isMoving = false;
  state.introActive = false;
  state.pendingRoll = null;
  state.selectedSwapTargetId = null;
  state.botStatus = { active: false, playerId: null, text: "" };
  scene.clearHighlights?.();
}

function addLog(message, type = "info", meta = {}) {
  state.gameLog = [{
    message,
    type,
    icon: getLogIcon(type),
    id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    ...meta
  }, ...state.gameLog].slice(0, 50);
}

function getLogIcon(type) {
  return {
    roll: "Dice",
    ladder: "Ladder",
    snake: "Snake",
    warning: "Warn",
    victory: "Crown",
    bonus: "Bonus",
    bot: "Bot",
    system: "Info",
    power: "Power",
    event: "Event",
    swap: "Swap",
    skip: "Skip",
    shield: "Shield"
  }[type] || "Log";
}

function setEvent(message, type = "info") {
  state.lastEvent = { message, type, id: Date.now() };
  if (state.rules.eventOverlays) {
    ui.showToast(message, type);
  }
}

async function startGame(options = {}) {
  cancelActiveAction();
  state.matchOrigin = "local";
  refreshBoardRuntime();
  const startPosition = getStartPosition(state.rules);
  const built = buildPlayersFromSetup(state.setup, startPosition);
  if (!built.ok) {
    state.validationMessage = built.message;
    syncUI();
    return;
  }

  state.players = built.players.map((player) => ({
    ...player,
    status: createPlayerStatus()
  }));
  state.positions = state.players.map((player) => player.position);
  state.currentPlayerIndex = 0;
  state.diceResult = null;
  state.diceState = "Ready";
  state.winner = null;
  state.turnCount = 1;
  state.gameStatus = "playing";
  state.gameLog = [];
  state.validationMessage = "";
  state.matchStats = createMatchStats(state.players);
  state.matchStats.modeId = state.modeId;
  state.matchStats.finishTile = getFinishTile();
  state.players.forEach((player) => recordTile(state.matchStats, player.id, player.position));
  state.rematchSnapshot = captureMatchSnapshot();

  const mode = getGameMode(state.modeId);
  addLog(`${mode.label} started on ${state.activeBoard.preset.label}. Finish tile: ${getFinishTile()}.`, "system");
  addLog(`${state.rules.exactFinish ? "Exact finish" : "Overshoot clamp"} and ${state.rules.extraTurnOnSix ? "extra turns on 6" : "no extra turns"} are active.`, "system");
  if (state.powerUpsEnabled) addLog("Power-ups are active: Shield, Reroll, and Swap.", "power");
  if (state.eventTilesEnabled) addLog("Event tiles are active after snake or ladder movement.", "event");

  scene.clearHighlights();
  scene.setRuleOptions(state.rules);
  scene.setPlayers(state.players);
  scene.setActivePlayer(0);
  scene.setActiveTokenPulse(state.players[0]?.id, true);
  scene.frameBoardIntro();
  audio.unlock();
  syncUI();
  state.introActive = true;
  syncUI();
  await ui.showVsIntro({
    players: state.players,
    modeLabel: getGameMode(state.modeId).label,
    presetLabel: state.activeBoard.preset.label,
    matchType: "Local",
    rematch: Boolean(options.rematch)
  }).catch(() => {});
  state.introActive = false;
  if (state.gameStatus !== "playing" || state.matchOrigin !== "local") return;
  handleTurnStart();
}

function captureMatchSnapshot() {
  return {
    setup: normalizeSetup(state.setup),
    rules: mergeRules(state.rules),
    modeId: state.modeId,
    boardPresetId: state.boardPresetId,
    powerUpsEnabled: state.powerUpsEnabled,
    eventTilesEnabled: state.eventTilesEnabled,
    themeId: state.themeId,
    accessibility: { ...state.accessibility }
  };
}

function applySnapshot(snapshot) {
  if (!snapshot) return;
  state.setup = normalizeSetup(snapshot.setup);
  state.rules = mergeRules(snapshot.rules);
  applyPhase3Options(normalizePhase3(snapshot));
  persistSetup();
  persistRules();
  persistPhase3();
}

function restartMatch() {
  audio.playSound("click");
  startGame();
}

function rematchSameSettings() {
  audio.playSound("click");
  applySnapshot(state.rematchSnapshot || captureMatchSnapshot());
  void startGame({ rematch: true });
}

function restartClassic() {
  audio.playSound("click");
  if (state.matchOrigin === "online") {
    if (!confirmOnlineQuit()) return;
    requestOnlineLeave();
    state.matchOrigin = "local";
  }
  state.modeId = "classic";
  state.boardPresetId = DEFAULT_BOARD_PRESET_ID;
  state.powerUpsEnabled = false;
  state.eventTilesEnabled = false;
  state.rules = mergeRules(DEFAULT_RULES);
  persistRules();
  persistPhase3();
  startGame();
}

function showMainMenu(options = {}) {
  if (options.preferGameHub && import.meta.env?.VITE_GAMEHUB_HOME_URL) {
    if (state.matchOrigin === "online" && !confirmOnlineQuit()) return;
    requestOnlineLeave();
    navigateToGameHubHome();
    return;
  }
  if (state.matchOrigin === "online" && !confirmOnlineQuit()) return;
  cancelActiveAction();
  if (state.matchOrigin === "online") {
    requestOnlineLeave();
  }
  state.matchOrigin = "local";
  state.gameStatus = "menu";
  state.players = [];
  state.positions = [];
  state.currentPlayerIndex = 0;
  state.diceResult = null;
  state.diceState = "Ready";
  state.winner = null;
  state.gameLog = [];
  state.matchStats = null;
  state.pendingRoll = null;
  state.selectedSwapTargetId = null;
  state.validationMessage = "";
  state.online.view = "local";
  state.online.lobby = null;
  state.online.queue = null;
  state.online.roomCode = "";
  state.online.roomType = "";
  state.online.botFilled = false;
  state.online.playerId = "";
  scene.setPlayers([]);
  scene.clearHighlights();
  refreshBoardRuntime();
  scene.frameBoardIntro();
  syncUI();
}

function navigateToGameHubHome() {
  const target = import.meta.env?.VITE_GAMEHUB_HOME_URL;
  if (!target) return false;
  window.location.assign(target);
  return true;
}

function getCurrentPlayer() {
  return state.players[state.currentPlayerIndex];
}

function getFinishTile() {
  return state.activeBoard?.finishTile || TILE_COUNT;
}

function canRoll() {
  return state.gameStatus === "playing" && !state.introActive && !state.isRolling && !state.isMoving && !state.pendingRoll && !state.winner;
}

function canTriggerDiceRoll() {
  const player = getCurrentPlayer();
  if (!player || !canRoll() || player.type === "bot") return false;
  if (state.matchOrigin === "online") {
    return Boolean(state.online?.isMyTurn)
      && !["reconnecting", "disconnected", "unavailable"].includes(state.online?.connectionStatus);
  }
  return true;
}

function handleTurnStart() {
  scene.setActivePlayer(state.currentPlayerIndex);
  scene.setActiveTokenPulse(getCurrentPlayer()?.id, true);
  syncUI();
  if (resolveSkipTurnIfNeeded()) return;
  scheduleBotTurnIfNeeded();
}

function resolveSkipTurnIfNeeded() {
  const player = getCurrentPlayer();
  if (!player || !canRoll() || !player.status?.skipNextTurn) return false;
  player.status.skipNextTurn = false;
  state.diceState = "Skipped";
  addLog(`${player.name} skipped this turn.`, "skip", { playerId: player.id });
  setEvent(`${player.name} skipped a turn.`, "warning");
  audio.playSound("warning");
  syncUI();
  advanceTurn(false, { fromSkip: true });
  return true;
}

function scheduleBotTurnIfNeeded() {
  const player = getCurrentPlayer();
  if (!canRoll() || !player || player.type !== "bot") {
    if (state.botStatus.active) botController.cancel();
    return;
  }
  botController.schedule(player, { delayScale: getGameMode(state.modeId).quick ? 0.68 : 1 });
}

async function startBotRoll(player) {
  const currentPlayer = getCurrentPlayer();
  if (!canRoll() || !currentPlayer || currentPlayer.id !== player.id || player.type !== "bot") {
    return;
  }

  const swapTarget = state.powerUpsEnabled ? chooseBotSwapTarget(player, state.players) : null;
  if (swapTarget) {
    await applySwapPowerUp(player, swapTarget, "bot");
    if (!canRoll() || getCurrentPlayer()?.id !== player.id) return;
  }

  const line = getBotFlavorLine(player, "roll");
  if (line) addLog(line, "bot", { playerId: player.id });
  state.botStatus = {
    active: true,
    playerId: player.id,
    text: "Bot is rolling...",
    detail: ""
  };
  scene.setBotThinking(player.id, false);
  syncUI();
  rollDice("bot");
}

function advanceTurn(extraTurn, context = {}) {
  const player = getCurrentPlayer();
  if (player) finishTurnStatus(player);

  if (extraTurn && player && !context.fromSkip) {
    state.diceState = context.reason || "Extra Turn!";
    addLog(`${player.name} gets an extra turn.`, "bonus", { playerId: player.id });
    const line = player.type === "bot" ? getBotFlavorLine(player, "extra") : "";
    if (line) addLog(line, "bot", { playerId: player.id });
    setEvent(context.reason || "Extra Turn!", "bonus");
    audio.playSound("extraTurn");
    state.turnCount = Math.max(1, (state.matchStats?.totalTurns || 0) + 1);
    syncUI();
    handleTurnStart();
    return;
  }

  state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
  state.turnCount = Math.max(1, (state.matchStats?.totalTurns || 0) + 1);
  state.diceState = "Ready";
  state.botStatus = { active: false, playerId: null, text: "" };
  handleTurnStart();
}

function finishTurnStatus(player) {
  if (!player?.status) return;
  player.status.rerollUsedThisTurn = false;
  if (player.status.safeTurns > 0) {
    player.status.safeTurns -= 1;
    if (player.status.safeTurns <= 0) player.status.safeTile = false;
  }
}

function declareWinner(player) {
  state.gameStatus = "won";
  state.winner = player;
  state.isRolling = false;
  state.isMoving = false;
  state.pendingRoll = null;
  state.botStatus = { active: false, playerId: null, text: "" };
  state.diceState = "Victory";
  finalizeMatchStats(state.matchStats, state.players, player.id, {
    modeId: state.modeId,
    finishTile: getFinishTile()
  });
  addLog(`${player.name} reached tile ${getFinishTile()} and won the match.`, "victory", { playerId: player.id });
  scene.setActivePlayer(state.currentPlayerIndex);
  scene.setActiveTokenPulse(player.id, true);
  scene.showVictory(player);
  audio.playSound("victory");
  setEvent(`${player.name} wins!`, "victory");
  botController.cancel();
  syncUI();
}

async function rollDice(source = "human") {
  const player = getCurrentPlayer();
  if (!player || !canRoll()) return;
  if (source === "human" && player.type === "bot") return;
  if (source === "bot" && player.type !== "bot") return;

  const token = actionToken;
  state.isRolling = true;
  state.diceState = player.type === "bot" ? "Bot is rolling..." : "Rolling...";
  audio.unlock();
  audio.playSound("dice");
  syncUI();

  const result = await performDiceRoll(player, token);
  if (!result || token.cancelled) return;

  state.isRolling = false;
  if (await maybePauseForReroll(player, result, source, token)) return;
  await finishRollMovement(player, result, source, token);
}

async function performDiceRoll(player, token, prefix = "rolled") {
  const result = Math.floor(Math.random() * 6) + 1;
  const rolled = await scene.animateDiceRoll(result, token);
  if (!rolled || token.cancelled) return null;
  state.diceResult = result;
  recordRoll(state.matchStats, player.id, result);
  state.turnCount = Math.max(1, state.matchStats?.totalTurns || state.turnCount);
  addLog(`${player.name} ${prefix} ${result}.`, "roll", { playerId: player.id });
  scene.showResultPop(result);
  syncUI();
  return result;
}

async function maybePauseForReroll(player, result, source, token) {
  if (!state.powerUpsEnabled || player.status?.heldPowerUp !== "reroll" || player.status.rerollUsedThisTurn) {
    return false;
  }

  const targetResult = resolveRollTarget(player.position, result, state.rules, getFinishTile());
  const transport = targetResult.allowed ? getTransportForTileFromBoard(state.activeBoard, targetResult.target) : null;

  if (source === "bot") {
    if (shouldBotUseReroll({ player, roll: result, targetResult, transport, players: state.players })) {
      await consumeReroll(player, token, "bot");
      return true;
    }
    return false;
  }

  state.pendingRoll = {
    playerId: player.id,
    result,
    source,
    targetResult,
    transport
  };
  state.diceState = "Reroll?";
  setEvent("Reroll available.", "power");
  syncUI();
  return true;
}

async function resolvePendingRoll(useReroll) {
  const pending = state.pendingRoll;
  const player = getCurrentPlayer();
  if (!pending || !player || player.id !== pending.playerId || state.isRolling || state.isMoving) return;
  state.pendingRoll = null;

  if (useReroll) {
    await consumeReroll(player, actionToken, "human");
    return;
  }

  await finishRollMovement(player, pending.result, pending.source, actionToken);
}

async function consumeReroll(player, token, source) {
  if (player.status?.heldPowerUp !== "reroll") return;
  player.status.heldPowerUp = null;
  player.status.rerollUsedThisTurn = true;
  recordPowerUp(state.matchStats, player.id, "reroll", "used");
  addLog(`${player.name} used Reroll.`, "power", { playerId: player.id });
  audio.playSound("extraTurn");
  state.isRolling = true;
  state.diceState = player.type === "bot" ? "Bot is rerolling..." : "Rerolling...";
  syncUI();

  const replacement = await performDiceRoll(player, token, "rerolled");
  state.isRolling = false;
  if (!replacement || token.cancelled) return;
  await finishRollMovement(player, replacement, source, token);
}

async function finishRollMovement(player, result, source, token) {
  if (!player || token.cancelled || state.gameStatus !== "playing") return;
  const currentPosition = player.position;
  const finishTile = getFinishTile();
  const targetResult = resolveRollTarget(currentPosition, result, state.rules, finishTile);

  if (!targetResult.allowed) {
    state.diceState = "Ready";
    addLog(`${player.name} needs exact ${targetResult.needed} to finish.`, "warning", { playerId: player.id });
    const line = player.type === "bot" ? getBotFlavorLine(player, "warning") : "";
    if (line) addLog(line, "bot", { playerId: player.id });
    setEvent(`Exact ${targetResult.needed} needed to finish.`, "warning");
    audio.playSound("warning");
    advanceTurn(false);
    return;
  }

  if (targetResult.clamped) {
    addLog(`${player.name} overshot and finishes at ${finishTile} because exact finish is OFF.`, "warning", { playerId: player.id });
  }

  state.isMoving = true;
  state.botStatus = player.type === "bot"
    ? { active: true, playerId: player.id, text: "Bot is moving...", detail: "" }
    : state.botStatus;
  state.diceState = "Moving...";
  scene.highlightTile(targetResult.target, "target");
  syncUI();

  const moved = await movePlayerAlongPath(player, currentPosition, targetResult.target, token);
  if (!moved || token.cancelled) return;

  if (checkWinner(player)) return;
  await resolveTransport(player, token);
  if (token.cancelled || checkWinner(player)) return;
  const eventResult = await resolveEventTile(player, token);
  if (token.cancelled || checkWinner(player)) return;

  state.isMoving = false;
  state.botStatus = { active: false, playerId: null, text: "" };
  const extraTurn = (state.rules.extraTurnOnSix && result === 6) || eventResult.bonusRoll;
  advanceTurn(extraTurn, { reason: eventResult.bonusRoll ? "Bonus Roll!" : "Extra Turn!" });
}

async function movePlayerAlongPath(player, from, to, token) {
  const path = buildMovementPath(from, to);
  if (!path.length && from === to) return true;
  return scene.moveTokenTileByTile(player.id, path, state.players, state.currentPlayerIndex, token, (tile) => {
    player.position = tile;
    state.positions[state.currentPlayerIndex] = tile;
    recordTile(state.matchStats, player.id, tile);
    audio.playSound("step");
    syncUI();
  });
}

async function resolveTransport(player, token) {
  const transport = getTransportForTileFromBoard(state.activeBoard, player.position);
  if (!transport) return;

  if (transport.type === "snake" && hasSnakeProtection(player)) {
    const protection = consumeSnakeProtection(player);
    addLog(`${player.name}'s ${protection === "shield" ? "shield" : "safe tile"} blocked snake ${transport.from} -> ${transport.to}.`, "shield", { playerId: player.id });
    if (protection === "shield") recordPowerUp(state.matchStats, player.id, "shield", "used");
    setEvent("Shield Blocked Snake!", "shield");
    audio.playSound("extraTurn");
    scene.highlightTile(transport.from, "safe");
    syncUI();
    return;
  }

  const direction = transport.type === "ladder" ? "climbed ladder" : "slid down snake";
  const toast = transport.type === "ladder"
    ? `Ladder Boost! Climbed ${transport.from} -> ${transport.to}`
    : `Snake Slide! Slid ${transport.from} -> ${transport.to}`;
  addLog(`${player.name} ${direction} ${transport.from} -> ${transport.to}.`, transport.type, { playerId: player.id });
  const line = player.type === "bot" ? getBotFlavorLine(player, transport.type) : "";
  if (line) addLog(line, "bot", { playerId: player.id });
  recordTransport(state.matchStats, player.id, transport);
  setEvent(toast, transport.type);
  audio.playSound(transport.type);
  scene.highlightTile(transport.from, transport.type);
  const transported = await scene.animateTransport(player.id, transport, state.players, state.currentPlayerIndex, token);
  if (!transported || token.cancelled) return;
  player.position = transport.to;
  state.positions[state.currentPlayerIndex] = transport.to;
  recordTile(state.matchStats, player.id, transport.to);
  scene.syncTokenPositions(state.players);
  syncUI();
}

function hasSnakeProtection(player) {
  return player.status?.heldPowerUp === "shield" || player.status?.safeTile;
}

function consumeSnakeProtection(player) {
  if (player.status.heldPowerUp === "shield") {
    player.status.heldPowerUp = null;
    return "shield";
  } else if (player.status.safeTile) {
    player.status.safeTile = false;
    player.status.safeTurns = 0;
    return "safe";
  }
  return "";
}

async function resolveEventTile(player, token) {
  if (!state.eventTilesEnabled || !state.activeBoard.eventTilesMap?.size) {
    return { bonusRoll: false };
  }

  const eventType = state.activeBoard.eventTilesMap.get(player.position);
  if (!eventType) return { bonusRoll: false };

  recordEventTile(state.matchStats, player.id);
  scene.highlightTile(player.position, eventType);

  if (eventType === "bonus") {
    addLog(`${player.name} found a Bonus Roll tile.`, "bonus", { playerId: player.id });
    setEvent("Bonus Roll!", "bonus");
    audio.playSound("extraTurn");
    return { bonusRoll: true };
  }

  if (eventType === "backstep" || eventType === "forward") {
    const delta = eventType === "forward" ? 3 : -3;
    const startFloor = getStartPosition(state.rules);
    const target = Math.min(getFinishTile(), Math.max(startFloor, player.position + delta));
    addLog(`${player.name} ${eventType === "forward" ? "jumped forward" : "stepped back"} to tile ${target}.`, "event", { playerId: player.id });
    setEvent(eventType === "forward" ? "Forward Jump!" : "Backstep!", eventType);
    await moveEventPlayer(player, target, token, eventType);
    return { bonusRoll: false };
  }

  if (eventType === "power") {
    if (!state.powerUpsEnabled) {
      addLog(`${player.name} landed on a Power Tile, but power-ups are OFF.`, "power", { playerId: player.id });
    } else if (!player.status.heldPowerUp) {
      player.status.heldPowerUp = getRandomPowerUp();
      recordPowerUp(state.matchStats, player.id, player.status.heldPowerUp, "gained");
      addLog(`${player.name} gained ${getPowerUpLabel(player.status.heldPowerUp)}.`, "power", { playerId: player.id });
      setEvent(`${getPowerUpLabel(player.status.heldPowerUp)} gained.`, "power");
      audio.playSound("extraTurn");
    } else {
      addLog(`${player.name} landed on a Power Tile but already holds a power-up.`, "power", { playerId: player.id });
    }
    return { bonusRoll: false };
  }

  if (eventType === "safe") {
    player.status.safeTile = true;
    player.status.safeTurns = 2;
    addLog(`${player.name} gained one-turn snake protection.`, "shield", { playerId: player.id });
    setEvent("Safe Tile!", "shield");
    return { bonusRoll: false };
  }

  if (eventType === "trap") {
    player.status.skipNextTurn = true;
    addLog(`${player.name} triggered a Trap Tile and will skip the next turn.`, "skip", { playerId: player.id });
    setEvent("Trap Tile!", "warning");
    audio.playSound("warning");
    return { bonusRoll: false };
  }

  return { bonusRoll: false };
}

async function moveEventPlayer(player, target, token, type) {
  const moved = await scene.moveTokenDirect(player.id, target, state.players, state.currentPlayerIndex, token, type);
  if (!moved || token.cancelled) return false;
  player.position = target;
  state.positions[state.currentPlayerIndex] = target;
  recordTile(state.matchStats, player.id, target);
  scene.syncTokenPositions(state.players);
  syncUI();
  return true;
}

function checkWinner(player) {
  if (player.position === getFinishTile()) {
    state.isMoving = false;
    declareWinner(player);
    return true;
  }
  return false;
}

async function useCurrentHumanPowerUp() {
  const player = getCurrentPlayer();
  if (!player || player.type !== "human" || !state.powerUpsEnabled || !canRoll()) return;
  if (player.status?.heldPowerUp !== "swap") {
    setEvent(`${getPowerUpLabel(player.status?.heldPowerUp)} activates automatically.`, "power");
    return;
  }
  const target = getSwapTargetForHuman(player);
  if (!target) {
    setEvent("Choose a different player to swap.", "warning");
    return;
  }
  await applySwapPowerUp(player, target, "human");
}

function getSwapTargetForHuman(player) {
  const selected = state.players.find((candidate) => candidate.id === state.selectedSwapTargetId);
  if (selected && selected.id !== player.id && selected.position !== player.position) return selected;
  return state.players.find((candidate) => candidate.id !== player.id && candidate.position !== player.position) || null;
}

async function applySwapPowerUp(player, target, source) {
  if (!player || !target || player.status?.heldPowerUp !== "swap") return false;
  if (state.winner || player.position === target.position) return false;
  const token = actionToken;
  const playerIndex = state.players.findIndex((entry) => entry.id === player.id);
  const targetIndex = state.players.findIndex((entry) => entry.id === target.id);
  if (playerIndex < 0 || targetIndex < 0) return false;

  state.isMoving = true;
  state.diceState = source === "bot" ? "Bot is swapping..." : "Swapping...";
  syncUI();
  const playerPosition = player.position;
  const targetPosition = target.position;
  const swapped = await scene.swapTokens(player, playerIndex, target, targetIndex, state.players, token);
  if (!swapped || token.cancelled) {
    state.isMoving = false;
    syncUI();
    return false;
  }

  player.position = targetPosition;
  target.position = playerPosition;
  state.positions[playerIndex] = player.position;
  state.positions[targetIndex] = target.position;
  player.status.heldPowerUp = null;
  recordPowerUp(state.matchStats, player.id, "swap", "used");
  recordTile(state.matchStats, player.id, player.position);
  recordTile(state.matchStats, target.id, target.position);
  scene.syncTokenPositions(state.players);
  state.isMoving = false;
  state.diceState = "Ready";
  addLog(`${player.name} swapped with ${target.name}.`, "swap", { playerId: player.id });
  setEvent("Swap!", "power");
  audio.playSound("extraTurn");
  syncUI();
  return true;
}

function createSceneFallback(canvasElement) {
  canvasElement?.setAttribute("aria-label", "WebGL unavailable");
  const fallback = document.createElement("div");
  fallback.className = "webgl-fallback";
  fallback.innerHTML = `
    <strong>3D board unavailable</strong>
    <span>Your browser could not start WebGL. Local setup and online menus remain available.</span>
  `;
  document.querySelector("#game-root")?.appendChild(fallback);
  return {
    players: [],
    setRuleOptions() {},
    setQualityProfile() {},
    setBoardConfig() {},
    setPlayers(players = []) { this.players = players; },
    syncTokenPositions() {},
    setActivePlayer() {},
    setDiceResult() {},
    setCinematicEnabled() {},
    frameBoardIntro() {},
    setActiveTokenPulse() {},
    clearHighlights() {},
    setBotThinking() {},
    highlightTile() {},
    showResultPop() {},
    animateDiceRoll: async () => true,
    moveTokenTileByTile: async (_playerId, path = [], _players, _playerIndex, _token, onStep) => {
      path.forEach((tile) => onStep?.(tile));
      return true;
    },
    animateTransport: async () => true,
    moveTokenDirect: async () => true,
    swapTokens: async () => true,
    showVictory() {},
    destroy() { fallback.remove(); }
  };
}

let debugPanel = null;
let debugFrameCount = 0;
let debugLastFpsTime = performance.now();

if (debugAllowed) {
  debugPanel = document.createElement("div");
  debugPanel.className = "debug-panel";
  document.querySelector("#game-root")?.appendChild(debugPanel);
  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "d") {
      state.debugEnabled = !state.debugEnabled;
      saveStoredValue("slr.debug.v1", state.debugEnabled);
      updateDebugPanel();
    }
  });
  const tickDebugFps = (time) => {
    debugFrameCount += 1;
    if (time - debugLastFpsTime >= 1000) {
      state.fps = Math.round((debugFrameCount * 1000) / (time - debugLastFpsTime));
      debugFrameCount = 0;
      debugLastFpsTime = time;
      updateDebugPanel();
    }
    requestAnimationFrame(tickDebugFps);
  };
  requestAnimationFrame(tickDebugFps);
}

function updateDebugPanel() {
  if (!debugPanel) return;
  debugPanel.classList.toggle("is-visible", state.debugEnabled);
  if (!state.debugEnabled) return;
  debugPanel.innerHTML = `
    <strong>Royale Dev</strong>
    <span>FPS ${state.fps || "-"}</span>
    <span>Quality ${state.qualityLevel} / ${state.qualityProfile.label}</span>
    <span>Mode ${getGameMode(state.modeId).shortLabel}</span>
    <span>Room ${state.online.roomCode || "-"}</span>
    <span>Conn ${state.online.connectionStatus}</span>
    <span>Turn ${state.currentPlayerIndex + 1}</span>
    <span>${escapeHtmlLocal(state.players.map((player) => `${player.name}:${player.position}`).join(" | ") || "No players")}</span>
  `;
}

function escapeHtmlLocal(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

window.addEventListener("beforeunload", () => {
  cancelActiveAction();
  scene.destroy();
});

refreshBoardRuntime();
scene.setRuleOptions(state.rules);
scene.setPlayers([]);
scene.frameBoardIntro();
if (state.online.view !== "local") ensureOnlineClient();
syncUI();

function getInitialSurface() {
  const surface = new URLSearchParams(window.location.search).get("surface");
  return ["local", "private", "public"].includes(surface) ? surface : "local";
}
