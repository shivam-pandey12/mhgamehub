import * as THREE from 'three';
import { Chess } from 'chess.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ChessAudio } from './audio.js';
import {
  applyPieceAppearance,
  createMoveMarker,
  createPiece,
  morphPiece,
  PIECE_NAMES,
  PIECE_SYMBOLS,
  rethemePiece
} from './piece-factory.js';
import {
  AI_DIFFICULTY_PROFILES,
  AI_STYLE_PROFILES,
  StockfishService,
  evaluationToWhitePerspective,
  getBookMove
} from './services/stockfish-service.js';
import { clearSavedMatch, loadSavedMatch, saveSavedMatch } from './services/match-storage.js';
import { OnlineGameClient } from './services/online-game-client.js';
import { clearOnlineSession, loadOnlineSession, saveOnlineSession } from './services/online-session-storage.js';
import { PieceModelLibrary } from './services/piece-model-loader.js';
import { generateDailyPuzzle, generatePuzzle } from './services/puzzle-generator.js';
import { DEFAULT_THEME_ID, THEME_PRESETS } from './theme-config.js';
import { normalizePuzzleDifficulty } from './data/puzzles.js';

const FILES = 'abcdefgh';
const RANKS = '12345678';
const SQUARE_SIZE = 1.2;
const BOARD_HEIGHT = 0.24;
const BOARD_HALF = (SQUARE_SIZE * 8) / 2;
const PIECE_LIFT = 0.48;
const CAPTURE_TRAY_SCALE = 0.58;
const CLOCK_START_SECONDS = 10 * 60;
const CLOCK_WARNING_SECONDS = 30;
const REPLAY_STEP_DELAY_MS = 900;
const IDLE_CAMERA_ROTATE_DELAY_MS = 6500;
const DAILY_CHALLENGE_STORAGE_KEY = 'chess_daily_challenge';
const THEME_STORAGE_KEY = 'chess_theme';
const HOME_GUIDE_SEEN_STORAGE_KEY = 'chess_home_guide_seen';
const PLAYER_NAME_STORAGE_KEY = 'chess_player_name';
const DEFAULT_PLAYER_NAME = 'Player One';
const DEFAULT_LOCAL_OPPONENT_NAME = 'Player Two';
const DEFAULT_ONLINE_OPPONENT_NAME = 'Opponent';
const GAME_MODES = {
  local: 'local',
  ai: 'ai',
  online: 'online'
};
const ONLINE_MATCH_TYPES = {
  room: 'online_room',
  publicMatchmaking: 'public_matchmaking',
  publicPvp: 'public_pvp',
  publicBot: 'public_bot'
};
const VARIANT_MODES = {
  classic: 'classic',
  blitz: 'blitz',
  puzzle: 'puzzle',
  daily: 'daily',
  custom: 'custom'
};
const BLITZ_PRESETS = {
  '1': {
    label: '1 minute',
    seconds: 60
  },
  '3': {
    label: '3 minutes',
    seconds: 3 * 60
  },
  '5': {
    label: '5 minutes',
    seconds: 5 * 60
  }
};
const COLOR_LABELS = {
  w: 'White',
  b: 'Black'
};
const PUZZLE_TIME_TARGETS = {
  easy: 25,
  medium: 45,
  hard: 70
};
const DEFAULT_SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL
  || (import.meta.env.DEV ? 'http://localhost:3001' : `${window.location.origin}/premium-chess`);

function lerp(start, end, alpha) {
  return start + (end - start) * alpha;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2;
}

function shortestAngleDelta(from, to) {
  const tau = Math.PI * 2;
  let delta = (to - from) % tau;
  if (delta > Math.PI) {
    delta -= tau;
  } else if (delta < -Math.PI) {
    delta += tau;
  }
  return delta;
}

function directedAngleDelta(from, to, direction = 0) {
  const tau = Math.PI * 2;
  const orbitDirection = Math.sign(direction);
  let delta = shortestAngleDelta(from, to);

  if (Math.abs(delta) < 0.0001) {
    return 0;
  }

  if (orbitDirection > 0 && delta <= 0) {
    delta += tau;
  } else if (orbitDirection < 0 && delta >= 0) {
    delta -= tau;
  }

  return delta;
}

function squareToVector(square, y = BOARD_HEIGHT / 2) {
  const fileIndex = FILES.indexOf(square[0]);
  const rankIndex = RANKS.indexOf(square[1]);
  return new THREE.Vector3(
    (fileIndex - 3.5) * SQUARE_SIZE,
    y,
    (3.5 - rankIndex) * SQUARE_SIZE
  );
}

function squareToIndices(square) {
  return {
    fileIndex: FILES.indexOf(square[0]),
    rankIndex: RANKS.indexOf(square[1])
  };
}

function normalizePointer(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  return new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );
}

function tileBaseColor(square, theme = THEME_PRESETS[DEFAULT_THEME_ID]) {
  const { fileIndex, rankIndex } = squareToIndices(square);
  return (fileIndex + rankIndex) % 2 === 0 ? theme.board.dark : theme.board.light;
}

function normalizeMoveRequest(move) {
  return {
    from: move.from,
    to: move.to,
    promotion: move.promotion || undefined
  };
}

function initialFen() {
  return new Chess().fen();
}

function oppositeColor(color) {
  return color === 'w' ? 'b' : 'w';
}

function uciToMoveRequest(uci) {
  return {
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    promotion: uci.slice(4) || undefined
  };
}

function moveRequestToUci(move) {
  return `${move.from}${move.to}${move.promotion || ''}`;
}

function isUciNotation(notation = '') {
  return /^[a-h][1-8][a-h][1-8][nbrq]?$/i.test(notation.trim());
}

function capitalizeLabel(value = '') {
  return value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : '';
}

function formatClockLabel(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}

function buildLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function loadThemePreference() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return DEFAULT_THEME_ID;
  }

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return THEME_PRESETS[stored] ? stored : DEFAULT_THEME_ID;
  } catch {
    return DEFAULT_THEME_ID;
  }
}

function loadHomeGuideSeen() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    return window.localStorage.getItem(HOME_GUIDE_SEEN_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function normalizePlayerName(playerName) {
  return String(playerName || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 24);
}

function loadPlayerNamePreference() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return DEFAULT_PLAYER_NAME;
  }

  try {
    const stored = normalizePlayerName(window.localStorage.getItem(PLAYER_NAME_STORAGE_KEY));
    return stored || DEFAULT_PLAYER_NAME;
  } catch {
    return DEFAULT_PLAYER_NAME;
  }
}

export class Chess3DApp {
  constructor({
    canvas,
    status,
    controls,
    panels
  }) {
    this.canvas = canvas;
    this.status = status;
    this.controls = controls;
    this.panels = panels;
    this.appShell = this.canvas.closest('.app-shell');
    this.boardFrame = this.canvas.closest('.board-frame');
    this.statusCard = this.status.turnLabel?.closest('.status-card') || null;
    this.themeId = loadThemePreference();
    this.activeTheme = THEME_PRESETS[this.themeId] || THEME_PRESETS[DEFAULT_THEME_ID];
    this.playerName = loadPlayerNamePreference();
    this.variantMode = VARIANT_MODES.classic;
    this.blitzPreset = '3';
    this.lastInteractionAt = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    this.onlineSession = loadOnlineSession();
    this.matchPanelOpen = false;

    this.chess = new Chess();
    this.audio = new ChessAudio();
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.activeTheme.sceneBackground);
    this.scene.fog = null;

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(0, 9.4, 10.6);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.06;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    this.controls3D = new OrbitControls(this.camera, this.canvas);
    this.controls3D.enableDamping = true;
    this.controls3D.dampingFactor = 0.065;
    this.controls3D.minDistance = 7.2;
    this.controls3D.maxDistance = 17;
    this.controls3D.minPolarAngle = Math.PI / 5;
    this.controls3D.maxPolarAngle = Math.PI / 2.14;
    this.controls3D.target.set(0, 0.7, 0);
    this.controls3D.autoRotate = false;
    this.controls3D.autoRotateSpeed = 0.38;
    this.controls3D.addEventListener('start', () => {
      this.focusBlend = 0;
      this.markInteraction();
    });
    this.controls3D.addEventListener('change', () => this.markInteraction());

    this.pointer = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.boardSquares = new Map();
    this.boardRaycastTargets = [];
    this.pieceMeshes = [];
    this.piecesBySquare = new Map();
    this.captureTrays = {
      w: { group: null, slots: [], capturedPieces: [], label: null },
      b: { group: null, slots: [], capturedPieces: [], label: null }
    };
    this.playerClocks = {
      w: null,
      b: null
    };
    this.moveMarkers = [];
    this.animations = [];
    this.deferredActions = [];
    this.moveHistory = [];
    this.savedReplayMoves = [];
    this.lastMoveSquares = [];
    this.selectedSquare = null;
    this.validMoves = [];
    this.hoveredSquare = null;
    this.hoveredPieceId = null;
    this.focusTarget = new THREE.Vector3(0, 0.7, 0);
    this.focusBlend = 0;
    this.cameraRig = {
      mode: 'idle',
      userPose: null,
      transition: null,
      queue: []
    };
    this.cinematicCameraEnabled = true;
    this.timeScaleState = {
      current: 1,
      slowTarget: 0.3,
      phase: 'idle',
      elapsed: 0,
      enterDuration: 0.18,
      holdDuration: 0.42,
      returnDuration: 0.54,
      startScale: 1,
      flash: 0,
      vignette: 0
    };
    this.visualTime = 0;
    this.boardGroup = null;
    this.boardFrameMesh = null;
    this.boardApronMesh = null;
    this.boardPedestalMesh = null;
    this.floorMesh = null;
    this.environmentGroup = null;
    this.environmentHalo = null;
    this.environmentArches = [];
    this.environmentParticles = [];
    this.ambientLight = null;
    this.directionalLight = null;
    this.rimLight = null;
    this.boardLabelSprites = [];
    this.pieceModelLibrary = new PieceModelLibrary();
    this.pieceModelsReady = false;
    this.pendingPromotion = null;
    this.isAnimating = false;
    this.restartPending = false;
    this.pieceIdSeed = 0;
    this.hudCollapsed = false;
    this.hudAutoCollapsed = false;
    this.statusOverrideTimeout = 0;
    this.bannerTimeout = 0;
    this.bannerSequence = 0;
    this.bannerRecentlyShown = new Map();
    this.bannerState = {
      key: '',
      displayKey: '',
      visibleUntil: 0,
      sequence: 0
    };
    this.lastBoardAlertKey = '';
    this.replayState = {
      active: false,
      playing: false,
      timerId: 0,
      moveIndex: 0,
      moves: [],
      snapshot: null
    };

    this.gameMode = GAME_MODES.local;
    this.selectedGameMode = this.gameMode;
    this.manualMatchStarted = false;
    this.aiDifficulty = 'medium';
    this.aiStyle = 'balanced';
    this.humanColor = 'w';
    this.aiColor = 'b';
    this.aiService = null;
    this.aiThinking = false;
    this.aiRequestToken = 0;
    this.aiStatusMessage = 'Player controls White';
    this.aiBookMessage = 'Opening book ready';
    this.aiEngineReady = false;
    this.aiEvaluationState = {
      loading: false,
      label: 'Waiting for position',
      whitePerspective: null,
      lines: [],
      requestId: 0
    };

    this.onlineClient = null;
    this.onlineConnected = false;
    this.onlineReady = false;
    this.onlineSubmitting = false;
    this.onlineMatchStarted = false;
    this.onlineMatchPhase = 'waiting';
    this.onlineMatchType = ONLINE_MATCH_TYPES.room;
    this.onlineOpponentType = 'human';
    this.publicIntroReadySent = false;
    this.publicMatchmakingState = {
      active: false,
      startedAt: 0,
      elapsedSeconds: 0,
      timerId: 0,
      message: 'Searching for opponent...',
      phase: 'idle'
    };
    this.onlineRoomId = this.onlineSession?.roomId || null;
    this.onlinePlayerColor = this.onlineSession?.color || null;
    this.onlinePlayerToken = this.onlineSession?.playerToken || null;
    this.onlinePlayerNames = {
      w: null,
      b: null
    };
    this.onlineStartedPlayers = {
      w: false,
      b: false
    };
    this.onlineColorPreference = 'auto';
    this.onlineStatusMessage = 'Create a room or join an existing match.';
    this.onlineConnectionMessage = this.onlineRoomId ? 'Saved seat available' : 'Connect when needed';
    this.onlineReconnectMessage = this.onlinePlayerToken ? 'Reconnect ready from saved seat' : 'Room persistence standby';
    this.onlineUndoState = {
      pending: false,
      canRespond: false,
      requestedBy: null,
      mode: null,
      message: 'No undo request pending.'
    };
    this.onlineRematchState = {
      pending: false,
      canRespond: false,
      requestedBy: null,
      message: 'No rematch request pending.'
    };
    this.undoResponseTimer = 0;
    this.drawState = {
      pending: false,
      canRespond: false,
      requestedBy: null,
      mode: null,
      message: 'No draw offer pending.'
    };
    this.agreedDraw = false;
    this.drawResponseTimer = 0;
    this.confirmationState = {
      resolve: null
    };
    this.homeGuideSeen = loadHomeGuideSeen();
    this.homeVisible = !this.homeGuideSeen;
    this.analysisState = {
      visible: false,
      signature: null,
      timerId: 0
    };
    this.postGameReviewState = {
      loading: false,
      signature: null,
      requestId: 0,
      review: null
    };
    this.roomStateMessageSuppression = {
      message: '',
      expiresAt: 0
    };
    this.duelIntroState = {
      active: false,
      timerId: 0,
      hideTimerId: 0,
      countdownTimers: [],
      lastSignature: ''
    };

    this.clockState = {
      initialSeconds: CLOCK_START_SECONDS,
      remaining: {
        w: CLOCK_START_SECONDS,
        b: CLOCK_START_SECONDS
      },
      flaggedColor: null
    };
    this.puzzleState = {
      source: VARIANT_MODES.puzzle,
      index: 0,
      progress: 0,
      solved: false,
      autoReplyPending: false,
      dailyKey: null,
      difficulty: 'all',
      feedback: 'Find the winning line.',
      elapsedSeconds: 0,
      hintsUsed: 0
    };
    this.activePuzzle = null;
    this.customEditMode = false;
    this.customSelectedColor = 'w';
    this.customSelectedType = 'k';
    this.customSetupFen = initialFen();
    this.customSetupPieces = null;
    this.dailyChallengeState = this.loadDailyChallengeState();

    this.lastMoveText = 'Opening position';

    this.applyThemeToDom();
    this.initScene();
    this.resetTimeScaleEffects();
    this.bindEvents();
    this.restoreLastSession();
    this.updateUiState();
    void this.loadPieceModels();
  }

  start() {
    this.onResize();
    this.setHomeVisible(this.homeVisible);
    this.renderer.setAnimationLoop(() => this.render());
    window.addEventListener('beforeunload', () => this.persistMatchState());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.persistMatchState();
      }
    });
  }

  persistOnlineSeat() {
    if (!this.onlineRoomId || !this.onlinePlayerToken) {
      clearOnlineSession();
      this.onlineSession = null;
      return;
    }

    this.onlineSession = {
      roomId: this.onlineRoomId,
      playerToken: this.onlinePlayerToken,
      color: this.onlinePlayerColor || null
    };
    saveOnlineSession(this.onlineSession);
  }

  clearOnlineSeat() {
    this.onlinePlayerToken = null;
    this.onlineSession = null;
    clearOnlineSession();
  }

  setPlayerName(playerName, { persist = true } = {}) {
    const normalizedName = normalizePlayerName(playerName) || DEFAULT_PLAYER_NAME;
    this.playerName = normalizedName;

    if (persist) {
      try {
        window.localStorage?.setItem(PLAYER_NAME_STORAGE_KEY, normalizedName);
      } catch {
        // Ignore storage failures.
      }
    }

    this.refreshPlayerIdentity(true);
    this.updateUiState();
    this.persistMatchState();
  }

  syncOnlinePlayerNames(detail = {}) {
    if (!detail?.playerNames) {
      return;
    }

    this.onlinePlayerNames = {
      w: normalizePlayerName(detail.playerNames.w) || this.onlinePlayerNames.w || null,
      b: normalizePlayerName(detail.playerNames.b) || this.onlinePlayerNames.b || null
    };
  }

  setOnlineMatchPhase(phase = 'waiting') {
    this.onlineMatchPhase = phase;
  }

  syncOnlineStartState(detail = {}) {
    if (detail?.startedPlayers) {
      this.onlineStartedPlayers = {
        w: Boolean(detail.startedPlayers.w),
        b: Boolean(detail.startedPlayers.b)
      };
    }

    const wasMatchStarted = this.onlineMatchStarted;
    if (Object.prototype.hasOwnProperty.call(detail, 'matchStarted')) {
      this.onlineMatchStarted = Boolean(detail.matchStarted);
      if (!this.onlineMatchStarted) {
        this.setOnlineMatchPhase('waiting');
      } else if (!this.duelIntroState.active) {
        this.setOnlineMatchPhase('playing');
      }
    }

    if (!wasMatchStarted && this.onlineMatchStarted) {
      this.collapsePlayPanelsForLiveMatch();
    }
  }

  syncOnlineMatchType(detail = {}) {
    if (detail.matchType) {
      this.onlineMatchType = detail.matchType;
    }
    if (detail.opponentType) {
      this.onlineOpponentType = detail.opponentType;
    }
  }

  isPublicOnlineMatch() {
    return this.onlineMatchType === ONLINE_MATCH_TYPES.publicPvp
      || this.onlineMatchType === ONLINE_MATCH_TYPES.publicBot;
  }

  isPublicBotMatch() {
    return this.onlineMatchType === ONLINE_MATCH_TYPES.publicBot;
  }

  formatMatchmakingElapsed(seconds = this.publicMatchmakingState.elapsedSeconds) {
    const safeSeconds = Math.max(0, Math.floor(seconds));
    return `${String(Math.floor(safeSeconds / 60)).padStart(2, '0')}:${String(safeSeconds % 60).padStart(2, '0')}`;
  }

  updateMatchmakingOverlay(detail = {}) {
    const overlay = this.panels.matchmakingOverlay;
    if (!overlay) {
      return;
    }

    const message = detail.message || this.publicMatchmakingState.message || 'Searching for opponent...';
    const phase = detail.phase || this.publicMatchmakingState.phase || 'searching';
    this.publicMatchmakingState.message = message;
    this.publicMatchmakingState.phase = phase;

    if (Number.isFinite(detail.elapsedMs)) {
      this.publicMatchmakingState.elapsedSeconds = Math.floor(detail.elapsedMs / 1000);
    } else if (this.publicMatchmakingState.startedAt) {
      this.publicMatchmakingState.elapsedSeconds = Math.floor((Date.now() - this.publicMatchmakingState.startedAt) / 1000);
    }

    if (this.status.matchmakingStatusLabel) {
      this.status.matchmakingStatusLabel.textContent = message;
    }
    if (this.status.matchmakingElapsedLabel) {
      this.status.matchmakingElapsedLabel.textContent = this.formatMatchmakingElapsed();
    }
    if (this.status.matchmakingSubcopyLabel) {
      const copyByPhase = {
        searching: 'Searching for a worthy opponent in the public queue.',
        looking: 'Checking public rooms and fresh challengers.',
        expanding: 'Expanding search so the board does not stay empty.',
        'bot-soon': 'One last sweep before an AI fill enters.',
        'bot-entering': 'No real opponent found. A server-side bot is stepping in.',
        found: 'Match found. Preparing the cinematic VS intro.',
        cancelled: 'Search cancelled. You are back in the online lobby.'
      };
      this.status.matchmakingSubcopyLabel.textContent = copyByPhase[phase] || 'Preparing public match.';
    }
  }

  showMatchmakingOverlay(detail = {}) {
    const overlay = this.panels.matchmakingOverlay;
    this.publicMatchmakingState.active = true;
    this.publicMatchmakingState.startedAt = Date.now();
    this.publicMatchmakingState.elapsedSeconds = 0;
    this.updateMatchmakingOverlay({
      phase: 'searching',
      message: 'Searching for a worthy opponent...',
      ...detail
    });

    overlay?.classList.remove('hidden');
    overlay?.setAttribute('aria-hidden', 'false');
    this.boardFrame?.classList.add('is-matchmaking-active');
    window.clearInterval(this.publicMatchmakingState.timerId);
    this.publicMatchmakingState.timerId = window.setInterval(() => {
      if (!this.publicMatchmakingState.active) {
        return;
      }
      this.updateMatchmakingOverlay();
    }, 250);
  }

  hideMatchmakingOverlay() {
    const overlay = this.panels.matchmakingOverlay;
    this.publicMatchmakingState.active = false;
    this.publicMatchmakingState.startedAt = 0;
    window.clearInterval(this.publicMatchmakingState.timerId);
    this.publicMatchmakingState.timerId = 0;
    overlay?.classList.add('hidden');
    overlay?.setAttribute('aria-hidden', 'true');
    this.boardFrame?.classList.remove('is-matchmaking-active');
  }

  getDisplayedPlayerNames(displayMode = this.selectedGameMode || this.gameMode) {
    const playerName = this.playerName || DEFAULT_PLAYER_NAME;

    if (displayMode === GAME_MODES.online) {
      const preferredColor = this.onlinePlayerColor
        || (this.onlineColorPreference === 'w' || this.onlineColorPreference === 'b' ? this.onlineColorPreference : 'w');
      const opponentColor = oppositeColor(preferredColor);
      return {
        w: this.onlinePlayerNames.w
          || (preferredColor === 'w' ? playerName : DEFAULT_ONLINE_OPPONENT_NAME),
        b: this.onlinePlayerNames.b
          || (preferredColor === 'b' ? playerName : DEFAULT_ONLINE_OPPONENT_NAME)
      };
    }

    if (displayMode === GAME_MODES.ai) {
      return {
        w: playerName,
        b: 'Stockfish'
      };
    }

    if (this.isPuzzleVariant()) {
      const solvingColor = this.activePuzzle?.fen?.split(' ')[1] || 'w';
      return {
        w: solvingColor === 'w' ? playerName : 'Puzzle',
        b: solvingColor === 'b' ? playerName : 'Puzzle'
      };
    }

    return {
      w: playerName,
      b: DEFAULT_LOCAL_OPPONENT_NAME
    };
  }

  getClockPlayerLabel(color) {
    const names = this.getDisplayedPlayerNames();
    const label = normalizePlayerName(names[color] || COLOR_LABELS[color]).toUpperCase();
    return label.length > 12 ? `${label.slice(0, 11)}…` : label;
  }

  refreshPlayerIdentity(forceClock = false) {
    const displayNames = this.getDisplayedPlayerNames();

    if (this.status.whiteTimerName) {
      this.status.whiteTimerName.textContent = displayNames.w;
    }
    if (this.status.blackTimerName) {
      this.status.blackTimerName.textContent = displayNames.b;
    }
    if (this.controls.playerNameInput && this.controls.playerNameInput !== document.activeElement) {
      this.controls.playerNameInput.value = this.playerName;
    }

    ['w', 'b'].forEach((color) => {
      const clockFace = this.playerClocks[color];
      if (!clockFace) {
        return;
      }
      clockFace.label = this.getClockPlayerLabel(color);
    });

    this.refreshClockVisuals(forceClock);
  }

  getAIStyleDescription(style = this.aiStyle) {
    return AI_STYLE_PROFILES[style]?.description || AI_STYLE_PROFILES.balanced.description;
  }

  formatEvaluationLabel(evaluation) {
    if (!evaluation) {
      return '0.0';
    }

    if (evaluation.type === 'mate') {
      return evaluation.display;
    }

    return `${evaluation.numeric >= 0 ? '+' : ''}${(evaluation.numeric / 100).toFixed(1)}`;
  }

  invertEvaluation(evaluation) {
    if (!evaluation) {
      return null;
    }

    return {
      ...evaluation,
      value: evaluation.value * -1,
      numeric: evaluation.numeric * -1,
      display: evaluation.type === 'mate'
        ? (evaluation.value * -1 > 0 ? `M${Math.abs(evaluation.value)}` : `-M${Math.abs(evaluation.value)}`)
        : `${evaluation.numeric * -1 >= 0 ? '+' : ''}${((evaluation.numeric * -1) / 100).toFixed(1)}`
    };
  }

  updateEvaluationBarVisual() {
    const wrapper = this.panels.evalBar;
    const fill = this.panels.evalBarFill;
    const label = this.status.evalBarLabel;
    if (!wrapper || !fill || !label) {
      return;
    }

    const shouldShow = this.gameMode === GAME_MODES.ai && !this.isTrainingVariant() && !this.replayState.active;
    wrapper.classList.toggle('hidden', !shouldShow);
    wrapper.setAttribute('aria-hidden', String(!shouldShow));
    if (!shouldShow) {
      return;
    }

    const evaluation = this.aiEvaluationState.whitePerspective;
    let percent = 50;
    if (evaluation) {
      if (evaluation.type === 'mate') {
        percent = evaluation.value > 0 ? 100 : 0;
      } else {
        const normalized = Math.max(-1000, Math.min(1000, evaluation.numeric));
        percent = 50 + (normalized / 1000) * 50;
      }
    }

    fill.style.width = `${percent.toFixed(1)}%`;
    fill.style.height = '';
    label.textContent = this.aiEvaluationState.loading
      ? '...'
      : evaluation
        ? this.formatEvaluationLabel(evaluation)
        : '0.0';
  }

  async refreshAIEvaluation() {
    if (
      this.gameMode !== GAME_MODES.ai
      || this.isTrainingVariant()
      || this.replayState.active
      || this.aiThinking
      || this.pendingPromotion
    ) {
      this.aiEvaluationState.loading = false;
      this.aiEvaluationState.label = this.gameMode === GAME_MODES.ai ? 'Evaluation paused' : 'Waiting for position';
      this.updateEvaluationBarVisual();
      return;
    }

    const requestId = ++this.aiEvaluationState.requestId;
    this.aiEvaluationState.loading = true;
    this.aiEvaluationState.label = 'Analyzing position...';
    this.updateEvaluationBarVisual();
    this.updateUiState();

    try {
      await this.ensureAIService();
      const detail = await this.aiService.evaluatePosition({
        fen: this.chess.fen(),
        difficulty: this.aiDifficulty === 'master' ? 'hard' : this.aiDifficulty,
        multiPv: 2
      });

      if (requestId !== this.aiEvaluationState.requestId) {
        return;
      }

      const whitePerspective = evaluationToWhitePerspective(detail.evaluation, this.chess.turn());
      this.aiEvaluationState.loading = false;
      this.aiEvaluationState.whitePerspective = whitePerspective;
      this.aiEvaluationState.lines = detail.lines || [];
      this.aiEvaluationState.label = whitePerspective
        ? `${this.formatEvaluationLabel(whitePerspective)} ${whitePerspective.numeric >= 0 ? 'for White' : 'for Black'}`
        : 'Engine ready';
      this.updateEvaluationBarVisual();
      this.updateUiState();
    } catch (error) {
      if (requestId !== this.aiEvaluationState.requestId) {
        return;
      }
      this.aiEvaluationState.loading = false;
      this.aiEvaluationState.label = error.message || 'Evaluation unavailable';
      this.aiEvaluationState.whitePerspective = null;
      this.aiEvaluationState.lines = [];
      this.updateEvaluationBarVisual();
      this.updateUiState();
    }
  }

  markInteraction() {
    this.lastInteractionAt = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    this.controls3D.autoRotate = false;
  }

  loadDailyChallengeState() {
    if (typeof window === 'undefined' || !window.localStorage) {
      return {
        dateKey: buildLocalDateKey(),
        solved: false
      };
    }

    try {
      const raw = window.localStorage.getItem(DAILY_CHALLENGE_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return {
        dateKey: typeof parsed?.dateKey === 'string' ? parsed.dateKey : buildLocalDateKey(),
        solved: Boolean(parsed?.solved)
      };
    } catch {
      return {
        dateKey: buildLocalDateKey(),
        solved: false
      };
    }
  }

  saveDailyChallengeState() {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      window.localStorage.setItem(DAILY_CHALLENGE_STORAGE_KEY, JSON.stringify(this.dailyChallengeState));
    } catch {
      // Ignore storage failures.
    }
  }

  applyThemeToDom() {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    const preset = this.themeId === 'midnight'
      ? {
        bgCream: '#05070d',
        bgMist: '#0b1020',
        bgAccentEnd: '#11182b',
        panel: 'rgba(9, 13, 23, 0.9)',
        panelStrong: 'rgba(12, 17, 29, 0.96)',
        panelTop: 'rgba(20, 28, 48, 0.94)',
        panelSubtle: 'rgba(17, 24, 39, 0.96)',
        panelChip: 'rgba(15, 21, 35, 0.92)',
        surfaceSoft: 'rgba(18, 25, 41, 0.88)',
        surfaceStrong: 'rgba(24, 33, 54, 0.92)',
        surfaceMuted: 'rgba(17, 24, 39, 0.9)',
        ledgerEmptyBg: 'rgba(21, 31, 54, 0.96)',
        ledgerEmptyColor: '#e5ecff',
        ledgerRowBg: 'rgba(15, 24, 43, 0.98)',
        ledgerRowBorder: 'rgba(111, 133, 192, 0.22)',
        ledgerActiveBg: 'linear-gradient(135deg, rgba(84, 104, 156, 0.92), rgba(179, 146, 83, 0.58))',
        ledgerActiveBorder: 'rgba(214, 178, 112, 0.42)'
      }
      : this.themeId === 'regal'
        ? {
          bgCream: '#101417',
          bgMist: '#1a2327',
          bgAccentEnd: '#243138',
          panel: 'rgba(15, 20, 24, 0.9)',
          panelStrong: 'rgba(19, 24, 29, 0.96)',
          panelTop: 'rgba(24, 30, 36, 0.95)',
          panelSubtle: 'rgba(17, 22, 27, 0.95)',
          panelChip: 'rgba(29, 37, 44, 0.92)',
          surfaceSoft: 'rgba(28, 35, 40, 0.86)',
          surfaceStrong: 'rgba(34, 42, 49, 0.94)',
          surfaceMuted: 'rgba(17, 24, 29, 0.9)',
          ledgerEmptyBg: 'rgba(28, 36, 43, 0.95)',
          ledgerEmptyColor: '#f3e4c0',
          ledgerRowBg: 'rgba(18, 24, 31, 0.98)',
          ledgerRowBorder: 'rgba(209, 167, 95, 0.22)',
          ledgerActiveBg: 'linear-gradient(135deg, rgba(54, 66, 74, 0.94), rgba(209, 167, 95, 0.58))',
          ledgerActiveBorder: 'rgba(225, 189, 116, 0.4)'
        }
        : {
          bgCream: '#f7f2e7',
          bgMist: '#fdfcf8',
          bgAccentEnd: '#eadbc0',
          panel: 'rgba(255, 250, 242, 0.78)',
          panelStrong: 'rgba(255, 248, 236, 0.92)',
          panelTop: 'rgba(255, 255, 255, 0.86)',
          panelSubtle: 'rgba(255, 251, 245, 0.95)',
          panelChip: 'rgba(255, 248, 238, 0.82)',
          surfaceSoft: 'rgba(255, 251, 245, 0.84)',
          surfaceStrong: 'rgba(255, 255, 255, 0.68)',
          surfaceMuted: 'rgba(255, 250, 242, 0.76)',
          ledgerEmptyBg: 'rgba(255, 250, 242, 0.76)',
          ledgerEmptyColor: '#706151',
          ledgerRowBg: 'rgba(255, 251, 245, 0.84)',
          ledgerRowBorder: 'rgba(147, 117, 64, 0.14)',
          ledgerActiveBg: 'linear-gradient(135deg, rgba(255, 245, 228, 0.95), rgba(241, 220, 182, 0.82))',
          ledgerActiveBorder: 'rgba(183, 138, 70, 0.26)'
        };

    root.style.setProperty('--bg-cream', preset.bgCream);
    root.style.setProperty('--bg-mist', preset.bgMist);
    root.style.setProperty('--bg-accent-end', preset.bgAccentEnd);
    root.style.setProperty('--panel', preset.panel);
    root.style.setProperty('--panel-strong', preset.panelStrong);
    root.style.setProperty('--panel-top', preset.panelTop);
    root.style.setProperty('--panel-subtle', preset.panelSubtle);
    root.style.setProperty('--panel-chip', preset.panelChip);
    root.style.setProperty('--surface-soft', preset.surfaceSoft);
    root.style.setProperty('--surface-strong', preset.surfaceStrong);
    root.style.setProperty('--surface-muted', preset.surfaceMuted);
    root.style.setProperty('--ledger-empty-bg', preset.ledgerEmptyBg);
    root.style.setProperty('--ledger-empty-color', preset.ledgerEmptyColor);
    root.style.setProperty('--ledger-row-bg', preset.ledgerRowBg);
    root.style.setProperty('--ledger-row-border', preset.ledgerRowBorder);
    root.style.setProperty('--ledger-row-active-bg', preset.ledgerActiveBg);
    root.style.setProperty('--ledger-row-active-border', preset.ledgerActiveBorder);
    root.style.setProperty('--ledger-index-color', this.themeId === 'midnight' ? '#f3f6ff' : this.themeId === 'regal' ? '#f2ddb1' : '#8e6730');
    root.style.setProperty('--ledger-cell-bg', this.themeId === 'midnight' ? 'rgba(31, 42, 70, 0.98)' : this.themeId === 'regal' ? 'rgba(39, 49, 56, 0.98)' : 'rgba(255, 255, 255, 0.68)');
    root.style.setProperty('--ledger-cell-color', this.themeId === 'midnight' ? '#f4f7ff' : this.themeId === 'regal' ? '#f8edd8' : '#2b241d');
    root.style.setProperty('--ledger-cell-current-bg', this.themeId === 'midnight' ? 'rgba(246, 218, 163, 0.28)' : this.themeId === 'regal' ? 'rgba(209, 167, 95, 0.28)' : 'rgba(214, 180, 122, 0.22)');
    root.style.setProperty('--ledger-cell-current-color', this.themeId === 'midnight' ? '#fff7e3' : this.themeId === 'regal' ? '#f7e2b7' : '#8e6730');
    root.style.setProperty('--line-soft', this.themeId === 'midnight' ? 'rgba(151, 178, 255, 0.12)' : this.themeId === 'regal' ? 'rgba(209, 167, 95, 0.18)' : 'rgba(147, 117, 64, 0.18)');
    root.style.setProperty('--line-strong', this.themeId === 'midnight' ? 'rgba(151, 178, 255, 0.28)' : this.themeId === 'regal' ? 'rgba(209, 167, 95, 0.32)' : 'rgba(147, 117, 64, 0.32)');
    root.style.setProperty('--gold', this.themeId === 'midnight' ? '#d6b26e' : this.themeId === 'regal' ? '#d1a75f' : '#b78a46');
    root.style.setProperty('--gold-deep', this.themeId === 'midnight' ? '#dfe6fb' : this.themeId === 'regal' ? '#f1e1bc' : '#8e6730');
    root.style.setProperty('--gold-rich', this.themeId === 'midnight' ? '#8c9ecf' : this.themeId === 'regal' ? '#8c6a35' : '#a87329');
    root.style.setProperty('--danger', this.themeId === 'midnight' ? '#ff8d78' : this.themeId === 'regal' ? '#d95c4c' : '#a73d2d');
    root.style.setProperty('--text', this.themeId === 'midnight' ? '#f3f6fd' : this.themeId === 'regal' ? '#f3ebdf' : '#2b241d');
    root.style.setProperty('--muted', this.themeId === 'midnight' ? '#c0cae1' : this.themeId === 'regal' ? '#c8b38d' : '#706151');
    root.style.setProperty('--shadow', this.themeId === 'midnight' ? '0 28px 80px rgba(5, 10, 18, 0.42)' : this.themeId === 'regal' ? '0 28px 80px rgba(8, 10, 12, 0.34)' : '0 28px 80px rgba(77, 57, 29, 0.16)');
    root.style.setProperty('--glow', this.themeId === 'midnight' ? '0 0 0 1px rgba(142, 162, 214, 0.18), 0 18px 40px rgba(41, 55, 93, 0.26)' : this.themeId === 'regal' ? '0 0 0 1px rgba(209, 167, 95, 0.18), 0 18px 40px rgba(73, 55, 24, 0.24)' : '0 0 0 1px rgba(184, 138, 70, 0.15), 0 18px 40px rgba(183, 138, 70, 0.2)');
    root.style.setProperty('--bg-overlay-1', this.themeId === 'midnight' ? 'rgba(0, 0, 0, 0)' : this.themeId === 'regal' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.95)');
    root.style.setProperty('--bg-overlay-2', this.themeId === 'midnight' ? 'rgba(96, 114, 166, 0.12)' : this.themeId === 'regal' ? 'rgba(209, 167, 95, 0.12)' : 'rgba(247, 238, 222, 0.72)');
    root.style.setProperty('--bg-overlay-3', this.themeId === 'midnight' ? 'rgba(22, 32, 57, 0.72)' : this.themeId === 'regal' ? 'rgba(36, 49, 56, 0.74)' : 'rgba(226, 210, 179, 0.55)');
    root.style.setProperty('--bg-overlay-4', this.themeId === 'midnight' ? 'rgba(5, 7, 13, 0.98)' : this.themeId === 'regal' ? 'rgba(18, 24, 27, 0.96)' : 'rgba(198, 170, 126, 0.24)');
    root.style.setProperty('--backdrop-glow-1', this.themeId === 'midnight' ? 'rgba(96, 114, 166, 0.16)' : this.themeId === 'regal' ? 'rgba(209, 167, 95, 0.14)' : 'rgba(255, 255, 255, 0.9)');
    root.style.setProperty('--backdrop-glow-2', this.themeId === 'midnight' ? 'rgba(96, 114, 166, 0.1)' : this.themeId === 'regal' ? 'rgba(209, 167, 95, 0.08)' : 'rgba(215, 190, 148, 0.28)');
    root.style.setProperty('--backdrop-glow-3', this.themeId === 'midnight' ? 'rgba(12, 18, 33, 0.48)' : this.themeId === 'regal' ? 'rgba(13, 16, 19, 0.46)' : 'rgba(137, 102, 45, 0.12)');
    root.style.setProperty('--home-overlay-bg', this.themeId === 'midnight' ? 'rgba(5, 8, 14, 0.52)' : this.themeId === 'regal' ? 'rgba(9, 12, 14, 0.48)' : 'rgba(30, 22, 12, 0.22)');
    root.style.setProperty('--home-card-bg', this.themeId === 'midnight'
      ? 'radial-gradient(circle at top, rgba(23, 32, 56, 0.96), rgba(12, 18, 32, 0.94) 42%, rgba(8, 12, 22, 0.92) 100%), linear-gradient(180deg, rgba(18, 26, 44, 0.96), rgba(8, 12, 22, 0.94))'
      : this.themeId === 'regal'
        ? 'radial-gradient(circle at top, rgba(34, 42, 49, 0.97), rgba(20, 25, 29, 0.96) 42%, rgba(14, 18, 21, 0.94) 100%), linear-gradient(180deg, rgba(24, 30, 36, 0.98), rgba(15, 20, 24, 0.96))'
        : 'radial-gradient(circle at top, rgba(255, 250, 242, 0.96), rgba(255, 244, 225, 0.9) 42%, rgba(255, 255, 255, 0.72) 100%), linear-gradient(180deg, var(--panel-top), var(--panel))');
    root.style.setProperty('--home-card-shadow', this.themeId === 'midnight' ? '0 26px 80px rgba(3, 6, 12, 0.48)' : this.themeId === 'regal' ? '0 26px 80px rgba(7, 9, 11, 0.42)' : '0 26px 80px rgba(42, 28, 12, 0.18)');
    root.style.setProperty('--home-hero-bg', this.themeId === 'midnight'
      ? 'radial-gradient(circle at top left, rgba(32, 44, 76, 0.84), rgba(18, 26, 44, 0.74) 54%, rgba(97, 115, 168, 0.18) 100%), linear-gradient(180deg, rgba(18, 25, 42, 0.76), rgba(11, 15, 27, 0.62))'
      : this.themeId === 'regal'
        ? 'radial-gradient(circle at top left, rgba(52, 64, 72, 0.82), rgba(31, 39, 45, 0.78) 54%, rgba(209, 167, 95, 0.14) 100%), linear-gradient(180deg, rgba(34, 42, 49, 0.76), rgba(19, 24, 29, 0.64))'
        : 'radial-gradient(circle at top left, rgba(255, 255, 255, 0.78), rgba(255, 248, 236, 0.68) 54%, rgba(255, 233, 188, 0.24) 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.56), rgba(255, 248, 235, 0.4))');
    root.style.setProperty('--home-section-bg', this.themeId === 'midnight' ? 'rgba(17, 24, 41, 0.82)' : this.themeId === 'regal' ? 'rgba(27, 35, 41, 0.84)' : 'rgba(255, 252, 246, 0.7)');
    root.style.setProperty('--home-section-soft-bg', this.themeId === 'midnight' ? 'rgba(15, 21, 36, 0.88)' : this.themeId === 'regal' ? 'rgba(24, 30, 36, 0.9)' : 'rgba(255, 250, 243, 0.74)');
    root.style.setProperty('--home-section-border', this.themeId === 'midnight' ? 'rgba(133, 157, 221, 0.18)' : this.themeId === 'regal' ? 'rgba(209, 167, 95, 0.18)' : 'rgba(147, 117, 64, 0.14)');
    root.style.setProperty('--home-input-bg', this.themeId === 'midnight' ? 'rgba(12, 18, 31, 0.95)' : this.themeId === 'regal' ? 'rgba(16, 21, 25, 0.96)' : 'rgba(255, 255, 255, 0.72)');
  }

  async loadPieceModels() {
    try {
      await this.pieceModelLibrary.load();
      this.pieceModelsReady = this.pieceModelLibrary.ready;
      if (!this.pieceModelsReady) {
        return;
      }
      this.rethemeAllPieces();
    } catch {
      this.pieceModelsReady = false;
    }
  }

  getPieceModelRoot(type) {
    if (!this.pieceModelsReady) {
      return null;
    }

    return this.pieceModelLibrary.get(type);
  }

  initScene() {
    const isMidnight = this.themeId === 'midnight';
    const isRegal = this.themeId === 'regal';
    this.ambientLight = new THREE.AmbientLight(isMidnight ? '#dbe6ff' : isRegal ? '#f3ddbd' : '#fff8ee', isMidnight ? 1.52 : isRegal ? 1.44 : 1.68);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(isMidnight ? '#e7edff' : isRegal ? '#f9e9c3' : '#fff8e8', isMidnight ? 2.18 : isRegal ? 2.28 : 2.4);
    this.directionalLight.position.set(6.5, 11.5, 8);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.set(2048, 2048);
    this.directionalLight.shadow.camera.near = 0.5;
    this.directionalLight.shadow.camera.far = 32;
    this.directionalLight.shadow.camera.left = -10;
    this.directionalLight.shadow.camera.right = 10;
    this.directionalLight.shadow.camera.top = 10;
    this.directionalLight.shadow.camera.bottom = -10;
    this.directionalLight.shadow.bias = -0.00018;
    this.scene.add(this.directionalLight);

    this.rimLight = new THREE.DirectionalLight(this.activeTheme.sceneGlow, isMidnight ? 1.72 : isRegal ? 1.48 : 1.25);
    this.rimLight.position.set(-8, 6, -6);
    this.scene.add(this.rimLight);

    this.floorMesh = new THREE.Mesh(
      new THREE.CircleGeometry(12, 80),
      new THREE.MeshStandardMaterial({
        color: this.activeTheme.sceneAccent,
        roughness: 0.95,
        metalness: 0.02,
        transparent: true,
        opacity: this.activeTheme.floorOpacity
      })
    );
    this.floorMesh.rotation.x = -Math.PI / 2;
    this.floorMesh.position.y = -0.7;
    this.floorMesh.receiveShadow = true;
    this.scene.add(this.floorMesh);

    this.createSceneEnvironment();
    this.createBoard();
    this.createCaptureTrays();
    this.createPlayerClocks();
    this.createIndicators();
    this.createLabels();
    this.applySceneTheme({ rethemePieces: false });
  }

  createSceneEnvironment() {
    this.environmentGroup = new THREE.Group();
    this.scene.add(this.environmentGroup);

    this.environmentHalo = new THREE.Mesh(
      new THREE.TorusGeometry(6.9, 0.08, 20, 100),
      new THREE.MeshStandardMaterial({
        color: this.activeTheme.sceneGlow,
        emissive: new THREE.Color(this.activeTheme.sceneGlow),
        emissiveIntensity: 0.22,
        metalness: 0.28,
        roughness: 0.22,
        transparent: true,
        opacity: 0.42
      })
    );
    this.environmentHalo.rotation.x = Math.PI / 2;
    this.environmentHalo.position.y = -0.42;
    this.environmentGroup.add(this.environmentHalo);

    const archMaterial = new THREE.MeshStandardMaterial({
      color: this.activeTheme.sceneGlow,
      emissive: new THREE.Color(this.activeTheme.sceneGlow),
      emissiveIntensity: 0.12,
      metalness: 0.38,
      roughness: 0.28,
      transparent: true,
      opacity: 0.18
    });

    [
      { radius: 8.6, tube: 0.06, y: 1.25, rotY: 0.35 },
      { radius: 9.8, tube: 0.05, y: 2.2, rotY: -0.22 }
    ].forEach((config) => {
      const arch = new THREE.Mesh(
        new THREE.TorusGeometry(config.radius, config.tube, 18, 90, Math.PI * 1.05),
        archMaterial.clone()
      );
      arch.rotation.set(Math.PI / 2.55, config.rotY, 0);
      arch.position.set(0, config.y, -1.4);
      arch.renderOrder = -1;
      this.environmentGroup.add(arch);
      this.environmentArches.push(arch);
    });

    const particleGeometry = new THREE.SphereGeometry(0.035, 10, 10);
    for (let index = 0; index < 18; index += 1) {
      const particle = new THREE.Mesh(
        particleGeometry,
        new THREE.MeshStandardMaterial({
          color: this.activeTheme.sceneGlow,
          emissive: new THREE.Color(this.activeTheme.sceneGlow),
          emissiveIntensity: 0.18,
          roughness: 0.24,
          metalness: 0.1,
          transparent: true,
          opacity: 0.22
        })
      );
      particle.position.set(
        (Math.random() - 0.5) * 14,
        0.5 + Math.random() * 4.6,
        (Math.random() - 0.5) * 12
      );
      particle.userData.phase = Math.random() * Math.PI * 2;
      particle.userData.radius = 0.18 + Math.random() * 0.32;
      particle.userData.baseY = particle.position.y;
      particle.userData.baseX = particle.position.x;
      particle.userData.baseZ = particle.position.z;
      this.environmentGroup.add(particle);
      this.environmentParticles.push(particle);
    }
  }

  createBoard() {
    this.boardGroup = new THREE.Group();
    this.scene.add(this.boardGroup);

    this.boardFrameMesh = new THREE.Mesh(
      new THREE.BoxGeometry(SQUARE_SIZE * 8 + 1.1, 0.42, SQUARE_SIZE * 8 + 1.1),
      new THREE.MeshStandardMaterial({
        color: this.activeTheme.board.frame,
        metalness: 0.45,
        roughness: 0.34
      })
    );
    this.boardFrameMesh.position.y = -0.1;
    this.boardFrameMesh.receiveShadow = true;
    this.boardFrameMesh.castShadow = true;
    this.boardGroup.add(this.boardFrameMesh);

    this.boardApronMesh = new THREE.Mesh(
      new THREE.BoxGeometry(SQUARE_SIZE * 8 + 2.8, 0.7, SQUARE_SIZE * 8 + 2.8),
      new THREE.MeshStandardMaterial({
        color: this.activeTheme.board.apron,
        metalness: 0.08,
        roughness: 0.9
      })
    );
    this.boardApronMesh.position.y = -0.72;
    this.boardApronMesh.receiveShadow = true;
    this.boardGroup.add(this.boardApronMesh);

    this.boardPedestalMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(3.2, 4.4, 1.2, 48),
      new THREE.MeshStandardMaterial({
        color: this.activeTheme.board.pedestal,
        metalness: 0.12,
        roughness: 0.7
      })
    );
    this.boardPedestalMesh.position.y = -1.6;
    this.boardPedestalMesh.receiveShadow = true;
    this.boardPedestalMesh.castShadow = true;
    this.boardGroup.add(this.boardPedestalMesh);

    for (let rank = 0; rank < 8; rank += 1) {
      for (let file = 0; file < 8; file += 1) {
        const square = `${FILES[file]}${rank + 1}`;
        const material = new THREE.MeshStandardMaterial({
          color: tileBaseColor(square, this.activeTheme),
          roughness: 0.74,
          metalness: 0.06,
          emissive: new THREE.Color('#000000')
        });

        const tile = new THREE.Mesh(
          new THREE.BoxGeometry(SQUARE_SIZE, BOARD_HEIGHT, SQUARE_SIZE),
          material
        );

        tile.position.copy(squareToVector(square, 0));
        tile.userData.square = square;
        tile.receiveShadow = true;
        tile.castShadow = true;
        this.boardGroup.add(tile);

        this.boardSquares.set(square, tile);
        this.boardRaycastTargets.push(tile);
      }
    }
  }

  createCaptureTrays() {
    const trayConfigs = {
      w: {
        center: new THREE.Vector3(6.45, 0.02, 4.95),
        rotationY: Math.PI / 2,
        tint: '#f2e0bb',
        label: 'White Captures'
      },
      b: {
        center: new THREE.Vector3(-6.45, 0.02, -4.95),
        rotationY: -Math.PI / 2,
        tint: '#c8a467',
        label: 'Black Captures'
      }
    };

    Object.entries(trayConfigs).forEach(([color, config]) => {
      const group = new THREE.Group();
      group.position.copy(config.center);
      group.rotation.y = config.rotationY;
      this.scene.add(group);

      const trayWidth = 4.55;
      const trayDepth = 2.36;
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(trayWidth, 0.18, trayDepth),
        new THREE.MeshStandardMaterial({
          color: config.tint,
          metalness: 0.22,
          roughness: 0.62
        })
      );
      base.position.y = 0.02;
      base.castShadow = true;
      base.receiveShadow = true;
      group.add(base);

      const lipMaterial = new THREE.MeshStandardMaterial({
        color: '#b58846',
        metalness: 0.42,
        roughness: 0.34
      });

      [
        { x: 0, y: 0.15, z: trayDepth / 2 - 0.06, w: trayWidth, h: 0.08, d: 0.12 },
        { x: 0, y: 0.15, z: -trayDepth / 2 + 0.06, w: trayWidth, h: 0.08, d: 0.12 },
        { x: trayWidth / 2 - 0.06, y: 0.15, z: 0, w: 0.12, h: 0.08, d: trayDepth },
        { x: -trayWidth / 2 + 0.06, y: 0.15, z: 0, w: 0.12, h: 0.08, d: trayDepth }
      ].forEach((rail) => {
        const mesh = new THREE.Mesh(
          new THREE.BoxGeometry(rail.w, rail.h, rail.d),
          lipMaterial
        );
        mesh.position.set(rail.x, rail.y, rail.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
      });

      const slots = [];
      const columns = 6;
      const rows = 2;
      const xSpacing = 0.68;
      const zSpacing = 0.82;
      for (let index = 0; index < columns * rows; index += 1) {
        const column = index % columns;
        const row = Math.floor(index / columns);
        slots.push(new THREE.Vector3(
          (column - (columns - 1) / 2) * xSpacing,
          0.12,
          ((rows - 1) / 2 - row) * zSpacing
        ));
      }

      this.captureTrays[color].group = group;
      this.captureTrays[color].slots = slots;
      this.captureTrays[color].capturedPieces = [];
      this.captureTrays[color].label = config.label;
    });
  }

  createPlayerClocks() {
    const clockConfigs = {
      w: {
        label: this.getClockPlayerLabel('w'),
        position: new THREE.Vector3(-6.95, 0.42, 5.45),
        rotationY: 0
      },
      b: {
        label: this.getClockPlayerLabel('b'),
        position: new THREE.Vector3(6.95, 0.42, -5.45),
        rotationY: Math.PI
      }
    };

    Object.entries(clockConfigs).forEach(([color, config]) => {
      const group = new THREE.Group();
      group.position.copy(config.position);
      group.rotation.y = config.rotationY;
      this.scene.add(group);

      const body = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 0.64, 1.5),
        new THREE.MeshStandardMaterial({
          color: color === 'w' ? this.activeTheme.clocks.lightBody : this.activeTheme.clocks.darkBody,
          metalness: 0.18,
          roughness: 0.48,
          emissive: new THREE.Color('#000000')
        })
      );
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      const cradle = new THREE.Mesh(
        new THREE.BoxGeometry(2.86, 0.16, 1.74),
        new THREE.MeshStandardMaterial({
          color: '#b48747',
          metalness: 0.34,
          roughness: 0.34
        })
      );
      cradle.position.y = -0.34;
      cradle.castShadow = true;
      cradle.receiveShadow = true;
      group.add(cradle);

      const faceCanvas = document.createElement('canvas');
      faceCanvas.width = 512;
      faceCanvas.height = 192;
      const faceContext = faceCanvas.getContext('2d');
      const faceTexture = new THREE.CanvasTexture(faceCanvas);
      faceTexture.colorSpace = THREE.SRGBColorSpace;

      const face = new THREE.Mesh(
        new THREE.PlaneGeometry(2.28, 0.82),
        new THREE.MeshStandardMaterial({
          map: faceTexture,
          transparent: false,
          metalness: 0.02,
          roughness: 0.72
        })
      );
      face.position.set(0, 0.06, 0.77);
      group.add(face);

      const capLeft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.14, 0.2, 24),
        new THREE.MeshStandardMaterial({
          color: '#c79b58',
          metalness: 0.44,
          roughness: 0.28
        })
      );
      capLeft.position.set(-0.74, 0.44, 0);
      capLeft.rotation.z = Math.PI / 2;
      group.add(capLeft);

      const capRight = capLeft.clone();
      capRight.position.x = 0.74;
      group.add(capRight);

      this.playerClocks[color] = {
        color,
        label: config.label,
        group,
        body,
        face,
        faceCanvas,
        faceContext,
        faceTexture
      };
    });

    this.refreshClockVisuals(true);
  }

  getCaptureSlotWorldPosition(color, slotIndex) {
    const tray = this.captureTrays[color];
    const slot = tray?.slots?.[slotIndex] || new THREE.Vector3(0, 0.12, 0);
    tray.group.updateWorldMatrix(true, false);
    return tray.group.localToWorld(slot.clone());
  }

  addCapturedPieceToTray(color, piece) {
    const tray = this.captureTrays[color];
    tray.capturedPieces.push(piece);
    return tray.capturedPieces.length - 1;
  }

  removeCapturedPieceFromTray(color, piece) {
    const tray = this.captureTrays[color];
    const index = tray.capturedPieces.lastIndexOf(piece);
    if (index >= 0) {
      tray.capturedPieces.splice(index, 1);
      this.layoutCapturedPieces(color);
    }
  }

  layoutCapturedPieces(color, animate = false) {
    const tray = this.captureTrays[color];
    const baseRotation = color === 'w' ? 0 : Math.PI;
    tray.capturedPieces.forEach((piece, index) => {
      const target = this.getCaptureSlotWorldPosition(color, index);
      piece.userData.square = null;
      if (animate) {
        const start = piece.position.clone();
        const fromScale = piece.scale.x;
        this.animations.push({
          duration: 0.28,
          elapsed: 0,
          onUpdate: (progress) => {
            const eased = easeInOutCubic(progress);
            piece.position.lerpVectors(start, target, eased);
            piece.position.y = lerp(start.y, target.y, eased) + Math.sin(progress * Math.PI) * 0.16;
            piece.scale.setScalar(lerp(fromScale, CAPTURE_TRAY_SCALE, eased));
            piece.rotation.y = lerp(piece.rotation.y, baseRotation, eased);
          },
          onComplete: () => {
            piece.position.copy(target);
            piece.scale.setScalar(CAPTURE_TRAY_SCALE);
            piece.rotation.y = baseRotation;
          }
        });
      } else {
        piece.position.copy(target);
        piece.scale.setScalar(CAPTURE_TRAY_SCALE);
        piece.rotation.y = baseRotation;
      }
    });
  }

  isTimedVariant() {
    return this.variantMode === VARIANT_MODES.blitz;
  }

  usesMatchClock() {
    return this.variantMode === VARIANT_MODES.classic || this.variantMode === VARIANT_MODES.blitz;
  }

  isPuzzleVariant() {
    return this.variantMode === VARIANT_MODES.puzzle || this.variantMode === VARIANT_MODES.daily;
  }

  isTrainingVariant() {
    return this.variantMode === VARIANT_MODES.puzzle
      || this.variantMode === VARIANT_MODES.daily
      || this.variantMode === VARIANT_MODES.custom;
  }

  getCurrentBlitzProfile() {
    return BLITZ_PRESETS[this.blitzPreset] || BLITZ_PRESETS['3'];
  }

  syncClockPreset() {
    this.clockState.initialSeconds = this.isTimedVariant()
      ? this.getCurrentBlitzProfile().seconds
      : CLOCK_START_SECONDS;
  }

  resetClockState() {
    this.syncClockPreset();
    this.clockState.remaining.w = this.clockState.initialSeconds;
    this.clockState.remaining.b = this.clockState.initialSeconds;
    this.clockState.flaggedColor = null;
    this.refreshClockVisuals(true);
    this.updateTopTimerBadges();
  }

  isClockRunning() {
    if (!this.usesMatchClock() || this.clockState.flaggedColor || this.chess.isGameOver() || this.agreedDraw || this.drawState.pending || this.onlineUndoState.pending || this.duelIntroState.active) {
      return false;
    }

    if (this.gameMode === GAME_MODES.online) {
      return Boolean(this.onlineRoomId && this.onlineReady && this.onlineConnected && this.onlineMatchStarted && this.onlineMatchPhase === 'playing');
    }

    return this.manualMatchStarted;
  }

  formatClock(seconds) {
    const safeSeconds = Math.max(0, seconds);
    const minutes = Math.floor(safeSeconds / 60);
    const wholeSeconds = Math.floor(safeSeconds % 60);
    if (safeSeconds < 60) {
      const tenths = Math.floor((safeSeconds - Math.floor(safeSeconds)) * 10);
      return `${minutes}:${String(wholeSeconds).padStart(2, '0')}.${tenths}`;
    }
    return `${minutes}:${String(wholeSeconds).padStart(2, '0')}`;
  }

  updateTopTimerBadges() {
    const timed = this.usesMatchClock();
    const timerPairs = [
      ['w', this.panels.whiteTimerBox, this.status.whiteTimerLabel],
      ['b', this.panels.blackTimerBox, this.status.blackTimerLabel]
    ];

    timerPairs.forEach(([color, box, label]) => {
      if (!box || !label) {
        return;
      }

      box.classList.toggle('hidden', !timed);
      box.classList.toggle('is-active', timed && !this.clockState.flaggedColor && this.chess.turn() === color && this.isClockRunning());
      box.classList.toggle('is-warning', timed && this.clockState.remaining[color] <= CLOCK_WARNING_SECONDS);
      box.classList.toggle('is-flagged', this.clockState.flaggedColor === color);
      label.textContent = timed ? this.formatClock(this.clockState.remaining[color]) : '--:--';
    });
  }

  refreshClockVisuals(force = false) {
    ['w', 'b'].forEach((color) => {
      const clockFace = this.playerClocks[color];
      if (!clockFace) {
        return;
      }

      const timed = this.usesMatchClock();
      const isActive = timed && !this.clockState.flaggedColor && this.isClockRunning() && this.chess.turn() === color;
      const isWarning = timed && this.clockState.remaining[color] <= CLOCK_WARNING_SECONDS;
      const isFlagged = this.clockState.flaggedColor === color;
      const timeLabel = timed ? this.formatClock(this.clockState.remaining[color]) : '--:--';
      const labelText = this.getClockPlayerLabel(color);
      clockFace.label = labelText;
      const visualKey = `${timeLabel}|${isActive}|${isWarning}|${isFlagged}|${timed}|${this.themeId}|${labelText}`;

      if (!force && clockFace.visualKey === visualKey) {
        return;
      }

      clockFace.visualKey = visualKey;
      const context = clockFace.faceContext;
      context.clearRect(0, 0, clockFace.faceCanvas.width, clockFace.faceCanvas.height);

      const background = isFlagged
        ? '#5e201f'
        : isActive
          ? (this.themeId === 'midnight' ? '#1a2538' : '#f8eed6')
          : (this.themeId === 'midnight' ? '#162033' : '#efe2c3');
      const edge = isFlagged
        ? '#f2a497'
        : isWarning
          ? '#d77f4d'
          : this.themeId === 'midnight' ? '#8fb6ff' : '#b98b47';
      const textColor = isFlagged ? '#fff0eb' : this.themeId === 'midnight' ? '#eef2fb' : '#2d241c';

      context.fillStyle = background;
      context.fillRect(0, 0, clockFace.faceCanvas.width, clockFace.faceCanvas.height);

      context.strokeStyle = edge;
      context.lineWidth = 12;
      context.strokeRect(10, 10, clockFace.faceCanvas.width - 20, clockFace.faceCanvas.height - 20);

      context.fillStyle = edge;
      context.font = '700 34px Georgia';
      context.textAlign = 'left';
      context.textBaseline = 'middle';
      context.fillText(clockFace.label, 28, 44);

      context.fillStyle = textColor;
      context.font = '700 84px "Courier New"';
      context.textAlign = 'center';
      context.fillText(timeLabel, clockFace.faceCanvas.width / 2, 116);

      context.font = '600 24px Georgia';
      context.fillStyle = isFlagged ? '#f7cbc0' : this.themeId === 'midnight' ? '#c2d7ff' : '#7a6240';
      context.fillText(
        isFlagged ? 'FLAG FALL' : !timed ? 'UNTIMED' : isActive ? 'RUNNING' : 'WAITING',
        clockFace.faceCanvas.width / 2,
        160
      );

      clockFace.faceTexture.needsUpdate = true;
      clockFace.body.material.emissive.set(isFlagged ? '#7f2b24' : isActive ? '#5e4417' : '#000000');
      clockFace.body.material.emissiveIntensity = isFlagged ? 0.46 : isActive ? 0.18 : 0;
    });
  }

  handleFlagFall(color) {
    if (this.clockState.flaggedColor) {
      return;
    }

    this.clockState.flaggedColor = color;
    this.clockState.remaining[color] = 0;
    this.clearSelection();
    this.closePromotion(true);
    this.aiRequestToken += 1;
    this.aiThinking = false;
    this.aiService?.stop();
    this.onlineSubmitting = false;
    this.resetOnlineUndoState();
    this.resetDrawState();
    if (this.gameMode === GAME_MODES.ai) {
      this.aiStatusMessage = `${COLOR_LABELS[oppositeColor(color)]} wins on time`;
    }
    if (this.gameMode === GAME_MODES.online) {
      this.onlineStatusMessage = `${COLOR_LABELS[oppositeColor(color)]} wins on time`;
    }
    this.updateStatus(`${COLOR_LABELS[color]} flag fell`);
    this.refreshClockVisuals(true);
    this.presentBoardAlert();
    this.scheduleGameAnalysisPresentation();
  }

  updateClocks(delta) {
    if (this.isClockRunning()) {
      const activeColor = this.chess.turn();
      this.clockState.remaining[activeColor] = Math.max(0, this.clockState.remaining[activeColor] - delta);
      if (this.clockState.remaining[activeColor] <= 0.0001) {
        this.handleFlagFall(activeColor);
      }
    }

    this.refreshClockVisuals();
    this.updateTopTimerBadges();
  }

  createIndicators() {
    this.hoverIndicator = new THREE.Mesh(
      new THREE.BoxGeometry(SQUARE_SIZE * 0.94, 0.05, SQUARE_SIZE * 0.94),
      new THREE.MeshStandardMaterial({
        color: this.activeTheme.board.hover,
        transparent: true,
        opacity: 0,
        emissive: new THREE.Color(this.activeTheme.board.hover),
        emissiveIntensity: 0.25
      })
    );
    this.hoverIndicator.position.y = BOARD_HEIGHT / 2 + 0.05;
    this.hoverIndicator.visible = false;
    this.scene.add(this.hoverIndicator);

    this.selectionRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.45, 0.045, 18, 48),
      new THREE.MeshStandardMaterial({
        color: this.activeTheme.board.selection,
        emissive: new THREE.Color(this.activeTheme.board.selection),
        emissiveIntensity: 0.52,
        metalness: 0.6,
        roughness: 0.26
      })
    );
    this.selectionRing.rotation.x = Math.PI / 2;
    this.selectionRing.visible = false;
    this.scene.add(this.selectionRing);
  }

  createLabels() {
    const labelGroup = new THREE.Group();
    this.scene.add(labelGroup);
    this.boardLabelSprites = [];

    const createLabel = (text) => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const context = canvas.getContext('2d');
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.95
      });

      const sprite = new THREE.Sprite(material);
      sprite.scale.set(0.46, 0.46, 1);
      sprite.userData.labelText = text;
      sprite.userData.canvas = canvas;
      sprite.userData.context = context;
      sprite.userData.texture = texture;
      this.boardLabelSprites.push(sprite);
      return sprite;
    };

    for (let index = 0; index < 8; index += 1) {
      const fileLabelBottom = createLabel(FILES[index]);
      fileLabelBottom.position.set((index - 3.5) * SQUARE_SIZE, 0.12, BOARD_HALF + 0.6);
      labelGroup.add(fileLabelBottom);

      const rankLabelLeft = createLabel(`${8 - index}`);
      rankLabelLeft.position.set(-BOARD_HALF - 0.6, 0.12, (index - 3.5) * SQUARE_SIZE);
      labelGroup.add(rankLabelLeft);
    }

    this.refreshBoardLabelTextures();
  }

  getVariantLabel() {
    switch (this.variantMode) {
      case VARIANT_MODES.blitz:
        return 'Blitz';
      case VARIANT_MODES.puzzle:
        return 'Puzzle';
      case VARIANT_MODES.daily:
        return 'Daily Challenge';
      case VARIANT_MODES.custom:
        return 'Custom';
      default:
        return 'Classic';
    }
  }

  getCustomPieceLabel(type = this.customSelectedType) {
    switch (type) {
      case 'k':
        return 'King';
      case 'q':
        return 'Queen';
      case 'r':
        return 'Rook';
      case 'b':
        return 'Bishop';
      case 'n':
        return 'Knight';
      case 'p':
        return 'Pawn';
      case 'erase':
        return 'Eraser';
      default:
        return 'Piece';
    }
  }

  getVariantStartMessage() {
    switch (this.variantMode) {
      case VARIANT_MODES.blitz:
        return `${this.getCurrentBlitzProfile().label} blitz ready`;
      case VARIANT_MODES.puzzle:
        return `Puzzle ${this.puzzleState.index + 1} ready`;
      case VARIANT_MODES.daily:
        return 'Daily challenge ready';
      case VARIANT_MODES.custom:
        return this.customEditMode ? 'Custom editor ready' : 'Custom match ready';
      default:
        return 'Opening position';
    }
  }

  getPuzzleForSource(
    source = this.puzzleState.source,
    index = this.puzzleState.index,
    dailyKey = this.puzzleState.dailyKey,
    difficulty = this.puzzleState.difficulty
  ) {
    if (source === VARIANT_MODES.daily) {
      const key = dailyKey || buildLocalDateKey();
      const { puzzle, difficulty: dailyDifficulty, index: dailyIndex } = generateDailyPuzzle(new Date(`${key}T12:00:00`));
      return {
        puzzle,
        index: dailyIndex,
        difficulty: dailyDifficulty
      };
    }

    const normalizedDifficulty = normalizePuzzleDifficulty(difficulty);
    const normalizedIndex = Math.max(0, Number(index) || 0);
    return {
      puzzle: generatePuzzle({
        difficulty: normalizedDifficulty,
        index: normalizedIndex
      }),
      index: normalizedIndex,
      difficulty: normalizedDifficulty
    };
  }

  setActivePuzzle(
    source,
    index,
    {
      progress = 0,
      solved = false,
      dailyKey = buildLocalDateKey(),
      difficulty = this.puzzleState.difficulty,
      feedback = null,
      elapsedSeconds = 0,
      hintsUsed = 0
    } = {}
  ) {
    const resolved = this.getPuzzleForSource(source, index, dailyKey, difficulty);
    this.activePuzzle = resolved.puzzle;
    this.puzzleState.source = source;
    this.puzzleState.index = resolved.index;
    this.puzzleState.progress = progress;
    this.puzzleState.solved = solved;
    this.puzzleState.autoReplyPending = false;
    this.puzzleState.dailyKey = source === VARIANT_MODES.daily ? dailyKey : null;
    if (source === VARIANT_MODES.puzzle) {
      this.puzzleState.difficulty = resolved.difficulty;
    }
    this.puzzleState.elapsedSeconds = Math.max(0, Number(elapsedSeconds) || 0);
    this.puzzleState.hintsUsed = Math.max(0, Number(hintsUsed) || 0);
    this.puzzleState.feedback = feedback || this.getDefaultPuzzleFeedback({
      puzzle: resolved.puzzle,
      progress,
      solved,
      autoReplyPending: false
    });
  }

  getActivePuzzleLine(puzzle = this.activePuzzle) {
    if (Array.isArray(puzzle?.solutionMoves)) {
      return puzzle.solutionMoves;
    }
    if (Array.isArray(puzzle?.solution)) {
      return puzzle.solution;
    }
    return [];
  }

  getPuzzleStartingColor(puzzle = this.activePuzzle) {
    return puzzle?.fen?.split(' ')[1] === 'b' ? 'b' : 'w';
  }

  getExpectedPuzzleColor(stepIndex = this.puzzleState.progress, puzzle = this.activePuzzle) {
    const startingColor = this.getPuzzleStartingColor(puzzle);
    return stepIndex % 2 === 0 ? startingColor : oppositeColor(startingColor);
  }

  resolvePuzzleMoveEntry(entry, chess = this.chess) {
    if (!entry || !chess) {
      return null;
    }

    const legalMoves = chess.moves({ verbose: true });
    const matchByRequest = (request) => legalMoves.find((move) => (
      move.from === request.from
      && move.to === request.to
      && (move.promotion || undefined) === (request.promotion || undefined)
    )) || null;

    if (typeof entry === 'string') {
      const normalizedEntry = entry.trim();
      if (!normalizedEntry) {
        return null;
      }

      if (isUciNotation(normalizedEntry)) {
        return matchByRequest(uciToMoveRequest(normalizedEntry.toLowerCase()));
      }

      return legalMoves.find((move) => (
        move.san === normalizedEntry
        || move.san.replace(/[+#?!]/g, '') === normalizedEntry.replace(/[+#?!]/g, '')
      )) || null;
    }

    if (entry.uci || entry.san) {
      return this.resolvePuzzleMoveEntry(entry.uci || entry.san, chess);
    }

    if (entry.from && entry.to) {
      return matchByRequest(normalizeMoveRequest(entry));
    }

    return null;
  }

  getExpectedPuzzleMove(stepIndex = this.puzzleState.progress, chess = this.chess) {
    const solutionLine = this.getActivePuzzleLine();
    return this.resolvePuzzleMoveEntry(solutionLine[stepIndex], chess);
  }

  getPuzzleProgressLabel() {
    const totalSteps = Math.max(1, this.getActivePuzzleLine().length);
    if (this.puzzleState.solved) {
      return 'Solved';
    }
    if (this.puzzleState.autoReplyPending) {
      return `Reply ${Math.min(this.puzzleState.progress + 1, totalSteps)} of ${totalSteps}`;
    }
    return `Step ${Math.min(this.puzzleState.progress + 1, totalSteps)} of ${totalSteps}`;
  }

  getDefaultPuzzleFeedback(
    {
      puzzle = this.activePuzzle,
      progress = this.puzzleState.progress,
      solved = this.puzzleState.solved,
      autoReplyPending = this.puzzleState.autoReplyPending
    } = {}
  ) {
    if (!puzzle) {
      return 'Choose a puzzle to begin.';
    }

    if (solved) {
      return this.puzzleState.source === VARIANT_MODES.daily
        ? 'Daily challenge solved. Come back tomorrow for a fresh line.'
        : 'Puzzle solved. Move to the next challenge when you are ready.';
    }

    if (autoReplyPending) {
      return 'Correct move. The reply is being played.';
    }

    if (progress === 0) {
      return 'Find the winning first move.';
    }

    return 'Correct so far. Continue the forcing line.';
  }

  setPuzzleFeedback(message, { persist = false } = {}) {
    this.puzzleState.feedback = message;
    if (this.status.puzzleFeedbackLabel) {
      this.status.puzzleFeedbackLabel.textContent = message;
    }
    if (this.status.dailyFeedbackLabel) {
      this.status.dailyFeedbackLabel.textContent = message;
    }
    if (persist) {
      this.persistMatchState();
    }
  }

  getPuzzleStarCount() {
    const difficulty = this.activePuzzle?.difficulty || 'medium';
    const timeTarget = PUZZLE_TIME_TARGETS[difficulty] || PUZZLE_TIME_TARGETS.medium;
    let stars = 3;

    if (this.puzzleState.hintsUsed > 0) {
      stars -= 1;
    }

    if (this.puzzleState.elapsedSeconds > timeTarget) {
      stars -= 1;
    }

    return Math.max(1, stars);
  }

  updatePuzzleTimer(delta) {
    if (!this.isPuzzleVariant() || !this.activePuzzle || this.puzzleState.solved || this.replayState.active || !this.manualMatchStarted) {
      return;
    }

    const previousSecond = Math.floor(this.puzzleState.elapsedSeconds);
    this.puzzleState.elapsedSeconds += delta;
    const currentSecond = Math.floor(this.puzzleState.elapsedSeconds);

    if (currentSecond !== previousSecond) {
      const timerLabel = formatClockLabel(this.puzzleState.elapsedSeconds);
      if (this.status.puzzleTimerLabel) {
        this.status.puzzleTimerLabel.textContent = timerLabel;
      }
      if (this.status.dailyTimerLabel) {
        this.status.dailyTimerLabel.textContent = timerLabel;
      }
    }
  }

  setPuzzleDifficulty(difficulty) {
    const normalizedDifficulty = normalizePuzzleDifficulty(difficulty);
    if (normalizedDifficulty === this.puzzleState.difficulty && this.variantMode === VARIANT_MODES.puzzle) {
      return;
    }

    this.puzzleState.difficulty = normalizedDifficulty;

    if (this.variantMode !== VARIANT_MODES.puzzle) {
      this.updateUiState();
      this.persistMatchState();
      return;
    }

    this.setActivePuzzle(VARIANT_MODES.puzzle, 0, {
      difficulty: normalizedDifficulty
    });
    this.refreshPuzzleMeta();
    this.clearPersistedMatch();
    this.loadActivePuzzlePosition({ defer: true });
    this.persistMatchState();
  }

  loadActivePuzzlePosition({ defer = false, message = this.getVariantStartMessage() } = {}) {
    if (!this.activePuzzle) {
      return;
    }

    const applyPosition = () => {
      if (!this.activePuzzle) {
        return;
      }

      try {
        this.chess.load(this.activePuzzle.fen);
      } catch {
        this.chess.reset();
      }
      this.hydrateBoardFromCurrentState({ message });
      this.refreshPuzzleMeta();
      this.updateUiState();
      this.persistMatchState();
    };

    if (defer) {
      window.requestAnimationFrame(() => applyPosition());
      return;
    }

    applyPosition();
  }

  getVariantBaseFen(snapshot = null) {
    const variantMode = snapshot?.variantMode || this.variantMode;

    if (variantMode === VARIANT_MODES.puzzle) {
      const resolved = this.getPuzzleForSource(
        VARIANT_MODES.puzzle,
        snapshot?.puzzleIndex ?? this.puzzleState.index,
        null,
        snapshot?.puzzleDifficulty || this.puzzleState.difficulty
      );
      return resolved.puzzle?.fen || initialFen();
    }

    if (variantMode === VARIANT_MODES.daily) {
      const resolved = this.getPuzzleForSource(
        VARIANT_MODES.daily,
        snapshot?.dailyPuzzleIndex ?? this.puzzleState.index,
        snapshot?.dailyKey || this.puzzleState.dailyKey || buildLocalDateKey()
      );
      return resolved.puzzle?.fen || initialFen();
    }

    if (variantMode === VARIANT_MODES.custom) {
      return snapshot?.customSetupFen || this.customSetupFen || initialFen();
    }

    return initialFen();
  }

  getVariantSnapshot() {
    const snapshot = {
      variantMode: this.variantMode,
      blitzPreset: this.blitzPreset,
      themeId: this.themeId,
      customSetupFen: this.customSetupFen,
      customEditMode: this.customEditMode,
      customSetupPieces: this.customSetupPieces || (this.variantMode === VARIANT_MODES.custom ? this.captureBoardPiecesFromChess() : null),
      puzzleDifficulty: this.puzzleState.difficulty
    };

    if (this.isPuzzleVariant()) {
      snapshot.puzzleIndex = this.puzzleState.index;
      snapshot.puzzleProgress = this.puzzleState.progress;
      snapshot.puzzleSolved = this.puzzleState.solved;
      snapshot.puzzleSource = this.puzzleState.source;
      snapshot.dailyKey = this.puzzleState.dailyKey;
      snapshot.dailyPuzzleIndex = this.puzzleState.index;
      snapshot.puzzleFeedback = this.puzzleState.feedback;
      snapshot.puzzleElapsedSeconds = this.puzzleState.elapsedSeconds;
      snapshot.puzzleHintsUsed = this.puzzleState.hintsUsed;
    }

    return snapshot;
  }

  refreshPuzzleMeta() {
    if (!this.activePuzzle) {
      this.status.puzzleTitleLabel.textContent = 'Select a puzzle';
      this.status.puzzleObjectiveLabel.textContent = 'Checkmate challenge';
      this.status.puzzleDifficultyLabel.textContent = 'All difficulties';
      this.status.puzzleProgressLabel.textContent = 'Step 1 of 1';
      this.status.puzzleTimerLabel.textContent = '00:00';
      this.status.puzzleFeedbackLabel.textContent = 'Find the winning line.';
      this.status.dailyPuzzleLabel.textContent = 'Daily puzzle ready';
      this.status.dailyObjectiveLabel.textContent = 'Checkmate challenge';
      this.status.dailyDifficultyLabel.textContent = 'Rotating challenge';
      this.status.dailyTimerLabel.textContent = '00:00';
      this.status.dailyFeedbackLabel.textContent = 'Load the daily puzzle to begin.';
      return;
    }

    const prefix = this.puzzleState.source === VARIANT_MODES.daily ? 'Daily' : `Puzzle ${this.puzzleState.index + 1}`;
    const title = `${prefix} · ${this.activePuzzle.name || 'Challenge'}`;
    const objective = this.activePuzzle.objective || 'Checkmate challenge';

    this.status.puzzleTitleLabel.textContent = title;
    this.status.puzzleObjectiveLabel.textContent = objective;
    this.status.dailyPuzzleLabel.textContent = title;
  }

  updateDailyChallengeStatus() {
    const todayKey = buildLocalDateKey();
    if (this.dailyChallengeState.dateKey !== todayKey) {
      this.dailyChallengeState = {
        dateKey: todayKey,
        solved: false
      };
      this.saveDailyChallengeState();
    }

    this.status.dailyStatusLabel.textContent = this.dailyChallengeState.solved
      ? 'Solved today'
      : 'Unsolved today';
  }

  async setVariantMode(mode) {
    if (!Object.values(VARIANT_MODES).includes(mode)) {
      return;
    }

    if (this.variantMode === mode && mode !== VARIANT_MODES.daily) {
      return;
    }

    this.markInteraction();
    this.stopReplayPlayback();
    this.replayState.active = false;
    this.replayState.moveIndex = 0;
    this.replayState.moves = [];
    this.replayState.snapshot = null;
    this.cancelAIMove();
    this.clearSelection();

    if ((mode === VARIANT_MODES.puzzle || mode === VARIANT_MODES.daily || mode === VARIANT_MODES.custom) && this.gameMode !== GAME_MODES.local) {
      await this.setGameMode(GAME_MODES.local, { reloadPosition: false });
    }

    this.variantMode = mode;
    this.manualMatchStarted = false;
    this.clockState.flaggedColor = null;
    this.customEditMode = mode === VARIANT_MODES.custom;

    if (mode === VARIANT_MODES.classic || mode === VARIANT_MODES.blitz) {
      this.activePuzzle = null;
      this.puzzleState.progress = 0;
      this.puzzleState.solved = false;
      this.clearPersistedMatch();
      this.loadPositionFromFen(initialFen(), { message: this.getVariantStartMessage() });
    }

    if (mode === VARIANT_MODES.puzzle) {
      this.setActivePuzzle(VARIANT_MODES.puzzle, this.puzzleState.index || 0);
      this.refreshPuzzleMeta();
      this.clearPersistedMatch();
      this.loadPositionFromFen(this.activePuzzle.fen, { message: this.getVariantStartMessage() });
    }

    if (mode === VARIANT_MODES.daily) {
      this.updateDailyChallengeStatus();
      this.setActivePuzzle(
        VARIANT_MODES.daily,
        0,
        {
          dailyKey: this.dailyChallengeState.dateKey,
          solved: this.dailyChallengeState.solved
        }
      );
      this.refreshPuzzleMeta();
      this.clearPersistedMatch();
      this.loadPositionFromFen(this.activePuzzle.fen, { message: this.getVariantStartMessage() });
    }

    if (mode === VARIANT_MODES.custom) {
      this.activePuzzle = null;
      this.clearPersistedMatch();
      if (Array.isArray(this.customSetupPieces)) {
        this.loadCustomBoardPieces(this.customSetupPieces, { message: this.getVariantStartMessage() });
      } else {
        this.loadPositionFromFen(this.customSetupFen || initialFen(), { message: this.getVariantStartMessage() });
      }
    }

    this.updateUiState();
    this.persistMatchState();
  }

  setBlitzPreset(presetId) {
    if (!BLITZ_PRESETS[presetId]) {
      return;
    }

    this.blitzPreset = presetId;
    if (this.variantMode === VARIANT_MODES.blitz && !this.hasMatchStarted()) {
      this.resetClockState();
    }
    this.updateUiState();
    this.persistMatchState();
  }

  setTheme(themeId) {
    if (!THEME_PRESETS[themeId] || this.themeId === themeId) {
      return;
    }

    this.themeId = themeId;
    this.activeTheme = THEME_PRESETS[themeId];
    this.applyThemeToDom();
    this.applySceneTheme();
    try {
      window.localStorage?.setItem(THEME_STORAGE_KEY, themeId);
    } catch {
      // Ignore storage failures.
    }
    this.updateUiState();
    this.persistMatchState();
  }

  getStartGameLabel() {
    if (this.selectedGameMode === GAME_MODES.online) {
      if (this.gameMode !== GAME_MODES.online) {
        return 'Start Online';
      }
      if (!this.onlineRoomId) {
        return this.onlinePlayerToken ? 'Reconnect Room' : 'Start Online';
      }
      if (!this.onlineConnected) {
        return this.onlinePlayerToken ? 'Reconnect Room' : 'Start Online';
      }
      if (!this.onlineReady) {
        return 'Waiting for Opponent';
      }
      if (this.onlineMatchStarted) {
        return 'Online Live';
      }
      if (this.onlinePlayerColor && this.onlineStartedPlayers[this.onlinePlayerColor]) {
        return 'Waiting to Start';
      }
      return 'Start Match';
    }

    if (this.selectedGameMode === this.gameMode && this.manualMatchStarted) {
      if (this.variantMode === VARIANT_MODES.puzzle) {
        return 'Puzzle Live';
      }
      if (this.variantMode === VARIANT_MODES.daily) {
        return 'Daily Live';
      }
      if (this.variantMode === VARIANT_MODES.custom) {
        return 'Custom Live';
      }
      if (this.selectedGameMode === GAME_MODES.ai) {
        return 'Vs AI Live';
      }
      return this.variantMode === VARIANT_MODES.blitz ? 'Blitz Live' : 'Match Live';
    }

    if (this.variantMode === VARIANT_MODES.puzzle) {
      return 'Start Puzzle';
    }

    if (this.variantMode === VARIANT_MODES.daily) {
      return 'Start Daily';
    }

    if (this.variantMode === VARIANT_MODES.custom) {
      return 'Start Custom';
    }

    if (this.variantMode === VARIANT_MODES.blitz) {
      return 'Start Blitz';
    }

    if (this.selectedGameMode === GAME_MODES.ai) {
      return 'Start Vs AI';
    }

    return 'Start Game';
  }

  async startSelectedGame({ fromHome = false } = {}) {
    if (this.pendingPromotion || this.isAnimating || this.replayState.active) {
      return;
    }

    if (fromHome || this.homeVisible) {
      this.setHomeVisible(false);
    }
    this.hideGameAnalysis();

    if (this.selectedGameMode !== this.gameMode) {
      await this.setGameMode(this.selectedGameMode);
      if (this.gameMode === GAME_MODES.online) {
        return;
      }
    }

    if (this.gameMode === GAME_MODES.online) {
      if (!this.onlineConnected && this.onlinePlayerToken && (this.onlineRoomId || this.controls.roomInput?.value)) {
        await this.attemptOnlineReconnect();
      }

      if (!this.onlineRoomId) {
        this.onlineStatusMessage = 'Create or join a room to begin live play.';
        this.updateUiState();
        return;
      }

      if (!this.onlineConnected) {
        this.onlineStatusMessage = 'Reconnect to the room before starting.';
        this.updateUiState();
        return;
      }

      if (!this.onlineReady) {
        this.onlineStatusMessage = 'Waiting for the other player to join and connect.';
        this.updateUiState();
        return;
      }

      if (this.onlineMatchStarted) {
        this.onlineStatusMessage = 'Room already live. Continue from the board.';
        this.updateUiState();
        return;
      }

      if (this.onlinePlayerColor && this.onlineStartedPlayers[this.onlinePlayerColor]) {
        this.onlineStatusMessage = 'Start acknowledged. Waiting for your opponent.';
        this.updateUiState();
        return;
      }

      await this.startOnlineMatch();
      return;
    }

    if (this.variantMode === VARIANT_MODES.custom) {
      this.startCustomMatch({ startLive: true });
      return;
    }

    this.beginPreparedMatch();
  }

  buildGameAnalysis() {
    if (!this.isMatchFinished() || this.replayState.active || this.variantMode === VARIANT_MODES.puzzle || this.variantMode === VARIANT_MODES.daily) {
      return null;
    }

    let winner = null;
    let loser = null;
    let resultLabel = 'Draw';
    let summary = 'The match ended level after a hard-fought sequence.';
    const playerNames = this.getDisplayedPlayerNames(this.gameMode);

    if (this.clockState.flaggedColor) {
      winner = oppositeColor(this.clockState.flaggedColor);
      loser = this.clockState.flaggedColor;
      resultLabel = 'Win on Time';
      summary = `${playerNames[winner] || COLOR_LABELS[winner]} claimed the point after ${playerNames[loser] || COLOR_LABELS[loser]}'s clock hit zero.`;
    } else if (this.chess.isCheckmate()) {
      winner = this.chess.turn() === 'w' ? 'b' : 'w';
      loser = this.chess.turn();
      resultLabel = 'Checkmate';
      summary = `${playerNames[winner] || COLOR_LABELS[winner]} finished the attack and checkmated ${playerNames[loser] || COLOR_LABELS[loser]}.`;
    } else if (this.agreedDraw) {
      resultLabel = 'Draw by Agreement';
      summary = 'Both players accepted the draw and ended the match peacefully.';
    } else if (this.chess.isStalemate()) {
      resultLabel = 'Stalemate';
      summary = 'No legal move remained, so the game closed as a stalemate.';
    } else if (this.chess.isThreefoldRepetition()) {
      resultLabel = 'Threefold Repetition';
      summary = 'The same position repeated three times, forcing the game into a draw.';
    } else if (this.chess.isInsufficientMaterial()) {
      resultLabel = 'Insufficient Material';
      summary = 'Neither side had enough material left to force checkmate.';
    } else if (this.chess.isDraw()) {
      resultLabel = 'Draw';
      summary = 'The game reached a drawn conclusion.';
    }

    const whiteCaptures = this.moveHistory.filter((move) => move.capturedBy === 'w').length;
    const blackCaptures = this.moveHistory.filter((move) => move.capturedBy === 'b').length;
    const deliveredChecks = this.moveHistory.filter((move) => /[+#]/.test(move.san || '')).length;
    const actualMode = this.gameMode === GAME_MODES.ai
      ? 'Vs AI'
      : this.gameMode === GAME_MODES.online
        ? 'Online'
        : 'Local';
    const actualVariant = capitalizeLabel(this.variantMode || VARIANT_MODES.classic);
    const signature = [
      this.chess.fen(),
      resultLabel,
      winner || 'draw',
      this.moveHistory.length,
      this.clockState.flaggedColor || '',
      this.agreedDraw ? 'agreement' : ''
    ].join('|');

    return {
      signature,
      headline: winner ? `${playerNames[winner] || COLOR_LABELS[winner]} Victorious` : 'Drawn Battle',
      summary,
      winnerLabel: winner ? playerNames[winner] || COLOR_LABELS[winner] : 'No winner',
      resultLabel,
      modeLabel: actualMode,
      variantLabel: actualVariant,
      moves: String(this.moveHistory.length),
      whiteCaptures: String(whiteCaptures),
      blackCaptures: String(blackCaptures),
      checks: String(deliveredChecks)
    };
  }

  classifyMoveLoss(loss) {
    if (loss >= 220) {
      return 'blunder';
    }
    if (loss >= 110) {
      return 'mistake';
    }
    if (loss >= 50) {
      return 'inaccuracy';
    }
    if (loss <= 12) {
      return 'best';
    }
    return 'good';
  }

  calculateAccuracyFromLoss(loss) {
    return Math.max(45, Math.min(100, 100 - Math.sqrt(Math.max(0, loss)) * 3.45));
  }

  buildEvaluationGraphPath(points = []) {
    if (points.length === 0) {
      return '';
    }

    const width = 640;
    const height = 180;
    const maxAbs = Math.max(120, ...points.map((value) => Math.abs(Math.max(-900, Math.min(900, value)))));

    return points.map((value, index) => {
      const x = points.length === 1 ? 0 : (index / (points.length - 1)) * width;
      const clamped = Math.max(-maxAbs, Math.min(maxAbs, value));
      const y = height / 2 - (clamped / maxAbs) * (height * 0.42);
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
  }

  renderPostGameReview() {
    const review = this.postGameReviewState.review;
    const loading = this.postGameReviewState.loading;

    this.status.analysisEngineStatus.textContent = loading
      ? 'Stockfish is reviewing the final game...'
      : review?.status || 'Awaiting Stockfish review...';
    this.status.analysisWhiteAccuracy.textContent = review ? `${review.whiteAccuracy}%` : '-';
    this.status.analysisBlackAccuracy.textContent = review ? `${review.blackAccuracy}%` : '-';
    this.status.analysisInaccuracies.textContent = review ? String(review.inaccuracies) : '0';
    this.status.analysisMistakes.textContent = review ? String(review.mistakes) : '0';
    this.status.analysisBlunders.textContent = review ? String(review.blunders) : '0';
    this.status.analysisSwing.textContent = review ? review.biggestSwingLabel : '-';

    if (this.panels.analysisGraphPath) {
      this.panels.analysisGraphPath.setAttribute('d', review ? this.buildEvaluationGraphPath(review.graphPoints) : '');
    }

    if (this.panels.analysisNotableList) {
      if (!review && loading) {
        this.panels.analysisNotableList.innerHTML = '<div class="analysis-note-empty">Building move-by-move review...</div>';
        return;
      }

      if (!review?.notableMoves?.length) {
        this.panels.analysisNotableList.innerHTML = '<div class="analysis-note-empty">No large swings were detected. The game was remarkably clean.</div>';
        return;
      }

      this.panels.analysisNotableList.innerHTML = review.notableMoves.map((item) => `
        <div class="analysis-note-card tone-${item.category}">
          <div class="analysis-note-head">
            <strong>${item.moveNumber}. ${item.san}</strong>
            <span>${item.label}</span>
          </div>
          <div class="analysis-note-copy">${item.message}</div>
        </div>
      `).join('');
    }
  }

  async startPostGameReview(signature = this.analysisState.signature) {
    if (!signature) {
      return;
    }

    if (this.postGameReviewState.loading && this.postGameReviewState.signature === signature) {
      return;
    }

    if (this.postGameReviewState.review && this.postGameReviewState.signature === signature) {
      this.renderPostGameReview();
      return;
    }

    const serializedMoves = this.getSerializableMoves();
    if (serializedMoves.length === 0) {
      this.postGameReviewState = {
        ...this.postGameReviewState,
        signature,
        loading: false,
        review: {
          status: 'No moves were played in this game.',
          whiteAccuracy: 100,
          blackAccuracy: 100,
          inaccuracies: 0,
          mistakes: 0,
          blunders: 0,
          biggestSwingLabel: '0.0',
          graphPoints: [0],
          notableMoves: []
        }
      };
      this.renderPostGameReview();
      return;
    }

    const requestId = this.postGameReviewState.requestId + 1;
    this.postGameReviewState = {
      loading: true,
      signature,
      requestId,
      review: null
    };
    this.renderPostGameReview();

    try {
      await this.ensureAIService();
      if (requestId !== this.postGameReviewState.requestId) {
        return;
      }

      const workingChess = new Chess();
      try {
        workingChess.load(this.getVariantBaseFen());
      } catch {
        workingChess.reset();
      }

      const reviewDifficulty = serializedMoves.length > 80
        ? 'easy'
        : serializedMoves.length > 44
          ? 'medium'
          : 'hard';
      const totals = {
        w: { accuracy: 0, moves: 0 },
        b: { accuracy: 0, moves: 0 }
      };
      let inaccuracies = 0;
      let mistakes = 0;
      let blunders = 0;
      let biggestSwing = 0;
      let biggestSwingLabel = '0.0';
      const graphPoints = [0];
      const notableMoves = [];

      for (let index = 0; index < serializedMoves.length; index += 1) {
        if (requestId !== this.postGameReviewState.requestId) {
          return;
        }

        const moveRequest = normalizeMoveRequest(serializedMoves[index]);
        const beforeFen = workingChess.fen();
        const mover = workingChess.turn();
        const beforeDetail = await this.aiService.evaluatePosition({
          fen: beforeFen,
          difficulty: reviewDifficulty,
          multiPv: 2
        });

        const appliedMove = workingChess.move(moveRequest);
        if (!appliedMove) {
          break;
        }

        const afterDetail = await this.aiService.evaluatePosition({
          fen: workingChess.fen(),
          difficulty: reviewDifficulty,
          multiPv: 1
        });

        const bestScore = beforeDetail.evaluation?.numeric || 0;
        const afterMoverScore = this.invertEvaluation(afterDetail.evaluation)?.numeric || 0;
        const loss = Math.max(0, bestScore - afterMoverScore);
        const accuracy = this.calculateAccuracyFromLoss(loss);
        const category = this.classifyMoveLoss(loss);
        const whitePoint = evaluationToWhitePerspective(afterDetail.evaluation, workingChess.turn())?.numeric || 0;
        graphPoints.push(whitePoint);

        totals[mover].accuracy += accuracy;
        totals[mover].moves += 1;

        if (category === 'inaccuracy') {
          inaccuracies += 1;
        } else if (category === 'mistake') {
          mistakes += 1;
        } else if (category === 'blunder') {
          blunders += 1;
        }

        if (loss > biggestSwing) {
          biggestSwing = loss;
          biggestSwingLabel = `${(loss / 100).toFixed(1)} pawns`;
        }

        if (category === 'inaccuracy' || category === 'mistake' || category === 'blunder') {
          let bestSan = '';
          if (beforeDetail.bestMove) {
            const suggestionBoard = new Chess();
            try {
              suggestionBoard.load(beforeFen);
              bestSan = suggestionBoard.move(beforeDetail.bestMove)?.san || moveRequestToUci(beforeDetail.bestMove);
            } catch {
              bestSan = moveRequestToUci(beforeDetail.bestMove);
            }
          }

          notableMoves.push({
            moveNumber: Math.ceil((index + 1) / 2),
            san: appliedMove.san,
            category,
            label: capitalizeLabel(category),
            message: `${COLOR_LABELS[mover]} lost about ${(loss / 100).toFixed(1)} pawns here.${bestSan ? ` ${bestSan} was the stronger continuation.` : ''}`
          });
        }

        if (index % 2 === 1) {
          this.postGameReviewState.loading = true;
          this.status.analysisEngineStatus.textContent = `Stockfish reviewing move ${index + 1} of ${serializedMoves.length}...`;
        }
      }

      if (requestId !== this.postGameReviewState.requestId) {
        return;
      }

      const review = {
        status: `Reviewed ${serializedMoves.length} half-moves with Stockfish ${AI_DIFFICULTY_PROFILES[reviewDifficulty].label}.`,
        whiteAccuracy: Math.round(totals.w.moves ? totals.w.accuracy / totals.w.moves : 100),
        blackAccuracy: Math.round(totals.b.moves ? totals.b.accuracy / totals.b.moves : 100),
        inaccuracies,
        mistakes,
        blunders,
        biggestSwingLabel,
        graphPoints,
        notableMoves: notableMoves
          .sort((left, right) => {
            const priority = { blunder: 3, mistake: 2, inaccuracy: 1, good: 0, best: 0 };
            return (priority[right.category] || 0) - (priority[left.category] || 0);
          })
          .slice(0, 8)
      };

      this.postGameReviewState = {
        loading: false,
        signature,
        requestId,
        review
      };
      this.renderPostGameReview();
    } catch (error) {
      if (requestId !== this.postGameReviewState.requestId) {
        return;
      }
      this.postGameReviewState = {
        loading: false,
        signature,
        requestId,
        review: {
          status: error.message || 'Stockfish review unavailable.',
          whiteAccuracy: 0,
          blackAccuracy: 0,
          inaccuracies: 0,
          mistakes: 0,
          blunders: 0,
          biggestSwingLabel: '-',
          graphPoints: [],
          notableMoves: []
        }
      };
      this.renderPostGameReview();
    }
  }

  clearPendingGameAnalysis() {
    if (this.analysisState.timerId) {
      window.clearTimeout(this.analysisState.timerId);
      this.analysisState.timerId = 0;
    }
  }

  presentGameAnalysis() {
    this.clearPendingGameAnalysis();
    const analysis = this.buildGameAnalysis();
    if (!analysis) {
      return;
    }

    if (this.analysisState.visible && this.analysisState.signature === analysis.signature) {
      return;
    }

    this.analysisState.signature = analysis.signature;
    this.analysisState.visible = true;
    this.status.analysisHeadline.textContent = analysis.headline;
    this.status.analysisSummary.textContent = analysis.summary;
    this.status.analysisWinner.textContent = analysis.winnerLabel;
    this.status.analysisResult.textContent = analysis.resultLabel;
    this.status.analysisMode.textContent = analysis.modeLabel;
    this.status.analysisVariant.textContent = analysis.variantLabel;
    this.status.analysisMoves.textContent = analysis.moves;
    this.status.analysisWhiteCaptures.textContent = analysis.whiteCaptures;
    this.status.analysisBlackCaptures.textContent = analysis.blackCaptures;
    this.status.analysisChecks.textContent = analysis.checks;
    this.renderPostGameReview();
    this.panels.analysisOverlay?.classList.remove('hidden');
    this.panels.analysisOverlay?.setAttribute('aria-hidden', 'false');
    void this.startPostGameReview(analysis.signature);
  }

  scheduleGameAnalysisPresentation() {
    const analysis = this.buildGameAnalysis();
    if (!analysis || this.replayState.active) {
      return;
    }

    if (this.analysisState.visible && this.analysisState.signature === analysis.signature) {
      return;
    }

    if (this.analysisState.timerId && this.analysisState.signature === analysis.signature) {
      return;
    }

    this.clearPendingGameAnalysis();
    this.analysisState.signature = analysis.signature;
    this.analysisState.timerId = window.setTimeout(() => {
      this.analysisState.timerId = 0;
      this.presentGameAnalysis();
    }, 5000);
  }

  setCinematicCameraEnabled(enabled) {
    const nextValue = Boolean(enabled);
    if (this.cinematicCameraEnabled === nextValue) {
      return;
    }

    this.cinematicCameraEnabled = nextValue;
    if (!this.cinematicCameraEnabled) {
      this.clearCameraCinematics();
    }
    this.updateUiState();
    this.persistMatchState();
  }

  nextPuzzle() {
    this.setActivePuzzle(VARIANT_MODES.puzzle, this.puzzleState.index + 1);
    this.refreshPuzzleMeta();
    this.clearPersistedMatch();
    this.loadPositionFromFen(this.activePuzzle.fen, { message: this.getVariantStartMessage() });
    this.persistMatchState();
  }

  resetPuzzle() {
    if (!this.isPuzzleVariant() || !this.activePuzzle) {
      return;
    }

    this.puzzleState.progress = 0;
    this.puzzleState.solved = this.variantMode === VARIANT_MODES.daily && this.dailyChallengeState.solved;
    this.puzzleState.autoReplyPending = false;
    this.loadPositionFromFen(this.activePuzzle.fen, { message: this.getVariantStartMessage() });
    this.persistMatchState();
  }

  continuePuzzleSequenceIfNeeded() {
    if (!this.isPuzzleVariant() || !this.activePuzzle || this.puzzleState.solved) {
      return;
    }

    if (this.puzzleState.progress >= this.activePuzzle.solution.length) {
      return;
    }

    const expectedReply = this.activePuzzle.solution[this.puzzleState.progress];
    const expectedColor = this.puzzleState.progress % 2 === 0 ? this.activePuzzle.fen.split(' ')[1] : oppositeColor(this.activePuzzle.fen.split(' ')[1]);
    if (this.chess.turn() !== expectedColor || this.puzzleState.progress % 2 === 0) {
      return;
    }

    this.puzzleState.autoReplyPending = true;
    const move = uciToMoveRequest(expectedReply);
    window.setTimeout(() => {
      this.scheduleDeferredAction(() => {
        if (!this.isPuzzleVariant() || !this.activePuzzle || !this.puzzleState.autoReplyPending) {
          return;
        }

        const applied = this.executeMove(move, {
          source: 'puzzle-reply',
          autoCollapse: false
        });
        if (applied) {
          this.puzzleState.progress += 1;
          this.puzzleState.autoReplyPending = false;
          this.updateStatus(`Puzzle reply: ${applied.san}`);
          this.updateUiState();
          this.persistMatchState();
        }
      });
    }, 280);
  }

  completePuzzle() {
    this.puzzleState.solved = true;
    this.puzzleState.autoReplyPending = false;
    if (this.variantMode === VARIANT_MODES.daily) {
      this.dailyChallengeState = {
        dateKey: this.puzzleState.dailyKey || buildLocalDateKey(),
        solved: true
      };
      this.saveDailyChallengeState();
      this.updateDailyChallengeStatus();
    }
    this.showEventBanner('Solved', { duration: 1800 });
    this.updateStatus(this.variantMode === VARIANT_MODES.daily ? 'Daily challenge solved' : 'Puzzle solved');
    this.updateUiState();
    this.persistMatchState();
  }

  getVariantStartMessage() {
    switch (this.variantMode) {
      case VARIANT_MODES.blitz:
        return `${this.getCurrentBlitzProfile().label} blitz ready`;
      case VARIANT_MODES.puzzle:
        return `${this.activePuzzle?.title || `Puzzle ${this.puzzleState.index + 1}`} ready`;
      case VARIANT_MODES.daily:
        return 'Daily challenge ready';
      case VARIANT_MODES.custom:
        return this.customEditMode ? 'Custom editor ready' : 'Custom match ready';
      default:
        return 'Opening position';
    }
  }

  getVariantBaseFen(snapshot = null) {
    const variantMode = snapshot?.variantMode || this.variantMode;

    if (variantMode === VARIANT_MODES.puzzle) {
      const resolved = this.getPuzzleForSource(
        VARIANT_MODES.puzzle,
        snapshot?.puzzleIndex ?? this.puzzleState.index,
        null,
        snapshot?.puzzleDifficulty || this.puzzleState.difficulty
      );
      return resolved.puzzle?.fen || initialFen();
    }

    if (variantMode === VARIANT_MODES.daily) {
      const resolved = this.getPuzzleForSource(
        VARIANT_MODES.daily,
        snapshot?.dailyPuzzleIndex ?? this.puzzleState.index,
        snapshot?.dailyKey || this.puzzleState.dailyKey || buildLocalDateKey()
      );
      return resolved.puzzle?.fen || initialFen();
    }

    if (variantMode === VARIANT_MODES.custom) {
      return snapshot?.customSetupFen || this.customSetupFen || initialFen();
    }

    return initialFen();
  }

  getVariantSnapshot() {
    const snapshot = {
      variantMode: this.variantMode,
      blitzPreset: this.blitzPreset,
      themeId: this.themeId,
      customSetupFen: this.customSetupFen,
      customEditMode: this.customEditMode,
      customSetupPieces: this.customSetupPieces || (this.variantMode === VARIANT_MODES.custom ? this.captureBoardPiecesFromChess() : null),
      puzzleDifficulty: this.puzzleState.difficulty
    };

    if (this.isPuzzleVariant()) {
      snapshot.puzzleIndex = this.puzzleState.index;
      snapshot.puzzleProgress = this.puzzleState.progress;
      snapshot.puzzleSolved = this.puzzleState.solved;
      snapshot.puzzleSource = this.puzzleState.source;
      snapshot.dailyKey = this.puzzleState.dailyKey;
      snapshot.dailyPuzzleIndex = this.puzzleState.index;
      snapshot.puzzleFeedback = this.puzzleState.feedback;
      snapshot.puzzleElapsedSeconds = this.puzzleState.elapsedSeconds;
      snapshot.puzzleHintsUsed = this.puzzleState.hintsUsed;
    }

    return snapshot;
  }

  refreshPuzzleMeta() {
    if (!this.activePuzzle) {
      this.status.puzzleTitleLabel.textContent = 'Select a puzzle';
      this.status.puzzleObjectiveLabel.textContent = 'Checkmate challenge';
      this.status.puzzleDifficultyLabel.textContent = 'All difficulties';
      this.status.puzzleProgressLabel.textContent = 'Step 1 of 1';
      this.status.puzzleTimerLabel.textContent = '00:00';
      this.status.puzzleFeedbackLabel.textContent = 'Find the winning line.';
      this.status.dailyPuzzleLabel.textContent = 'Daily puzzle ready';
      this.status.dailyObjectiveLabel.textContent = 'Checkmate challenge';
      this.status.dailyDifficultyLabel.textContent = 'Rotating challenge';
      this.status.dailyTimerLabel.textContent = '00:00';
      this.status.dailyFeedbackLabel.textContent = 'Load the daily puzzle to begin.';
      return;
    }

    const prefix = this.puzzleState.source === VARIANT_MODES.daily ? 'Daily' : `Puzzle ${this.puzzleState.index + 1}`;
    const title = `${prefix} - ${this.activePuzzle.title || 'Challenge'}`;
    const objective = this.activePuzzle.description || 'Checkmate challenge';
    const difficulty = capitalizeLabel(this.activePuzzle.difficulty || 'easy');
    const timerLabel = formatClockLabel(this.puzzleState.elapsedSeconds);
    const feedback = this.puzzleState.feedback || this.getDefaultPuzzleFeedback();

    this.status.puzzleTitleLabel.textContent = title;
    this.status.puzzleObjectiveLabel.textContent = objective;
    this.status.puzzleDifficultyLabel.textContent = `${difficulty} puzzle`;
    this.status.puzzleProgressLabel.textContent = this.getPuzzleProgressLabel();
    this.status.puzzleTimerLabel.textContent = timerLabel;
    this.status.puzzleFeedbackLabel.textContent = feedback;
    this.status.dailyPuzzleLabel.textContent = title;
    this.status.dailyObjectiveLabel.textContent = objective;
    this.status.dailyDifficultyLabel.textContent = `${difficulty} puzzle`;
    this.status.dailyTimerLabel.textContent = timerLabel;
    this.status.dailyFeedbackLabel.textContent = feedback;
  }

  updateDailyChallengeStatus() {
    const todayKey = buildLocalDateKey();
    if (this.dailyChallengeState.dateKey !== todayKey) {
      this.dailyChallengeState = {
        dateKey: todayKey,
        solved: false
      };
      this.saveDailyChallengeState();
    }

    this.status.dailyStatusLabel.textContent = this.dailyChallengeState.solved
      ? 'Solved today'
      : 'Unsolved today';
  }

  async setVariantMode(mode) {
    if (!Object.values(VARIANT_MODES).includes(mode)) {
      return;
    }

    if (this.variantMode === mode && mode !== VARIANT_MODES.daily) {
      return;
    }

    this.markInteraction();
    this.stopReplayPlayback();
    this.replayState.active = false;
    this.replayState.moveIndex = 0;
    this.replayState.moves = [];
    this.replayState.snapshot = null;
    this.cancelAIMove();
    this.clearSelection();

    if ((mode === VARIANT_MODES.puzzle || mode === VARIANT_MODES.daily || mode === VARIANT_MODES.custom) && this.gameMode !== GAME_MODES.local) {
      await this.setGameMode(GAME_MODES.local, { reloadPosition: false });
    }

    this.variantMode = mode;
    this.clockState.flaggedColor = null;
    this.customEditMode = mode === VARIANT_MODES.custom;

    if (mode === VARIANT_MODES.classic || mode === VARIANT_MODES.blitz) {
      this.activePuzzle = null;
      this.puzzleState.progress = 0;
      this.puzzleState.solved = false;
      this.clearPersistedMatch();
      this.loadPositionFromFen(initialFen(), { message: this.getVariantStartMessage() });
    }

    if (mode === VARIANT_MODES.puzzle) {
      this.setActivePuzzle(VARIANT_MODES.puzzle, this.puzzleState.index || 0, {
        difficulty: this.puzzleState.difficulty
      });
      this.refreshPuzzleMeta();
      this.clearPersistedMatch();
      this.loadActivePuzzlePosition();
    }

    if (mode === VARIANT_MODES.daily) {
      this.updateDailyChallengeStatus();
      this.setActivePuzzle(
        VARIANT_MODES.daily,
        0,
        {
          dailyKey: this.dailyChallengeState.dateKey,
          solved: this.dailyChallengeState.solved
        }
      );
      this.refreshPuzzleMeta();
      this.clearPersistedMatch();
      this.loadActivePuzzlePosition();
    }

    if (mode === VARIANT_MODES.custom) {
      this.activePuzzle = null;
      this.clearPersistedMatch();
      if (Array.isArray(this.customSetupPieces)) {
        this.loadCustomBoardPieces(this.customSetupPieces, { message: this.getVariantStartMessage() });
      } else {
        this.loadPositionFromFen(this.customSetupFen || initialFen(), { message: this.getVariantStartMessage() });
      }
    }

    this.updateUiState();
    this.persistMatchState();
  }

  nextPuzzle() {
    this.setActivePuzzle(VARIANT_MODES.puzzle, this.puzzleState.index + 1, {
      difficulty: this.puzzleState.difficulty
    });
    this.manualMatchStarted = false;
    this.refreshPuzzleMeta();
    this.clearPersistedMatch();
    this.loadActivePuzzlePosition();
    this.persistMatchState();
  }

  resetPuzzle({ feedback = null } = {}) {
    if (!this.isPuzzleVariant() || !this.activePuzzle) {
      return;
    }

    this.puzzleState.progress = 0;
    this.puzzleState.solved = false;
    this.puzzleState.autoReplyPending = false;
    this.puzzleState.elapsedSeconds = 0;
    this.puzzleState.hintsUsed = 0;
    this.setPuzzleFeedback(
      feedback
        || this.getDefaultPuzzleFeedback({
          solved: this.puzzleState.solved,
          progress: 0,
          autoReplyPending: false
        })
    );
    this.loadActivePuzzlePosition();
    this.persistMatchState();
  }

  continuePuzzleSequenceIfNeeded() {
    if (!this.isPuzzleVariant() || !this.activePuzzle || this.puzzleState.solved) {
      return;
    }

    const solutionLine = this.getActivePuzzleLine();
    if (this.puzzleState.progress >= solutionLine.length) {
      this.completePuzzle();
      return;
    }

    const playerColor = this.getPuzzleStartingColor();
    const expectedColor = this.getExpectedPuzzleColor();
    if (this.chess.turn() !== expectedColor || expectedColor === playerColor) {
      return;
    }

    const expectedReply = this.getExpectedPuzzleMove();
    if (!expectedReply) {
      this.setPuzzleFeedback('This puzzle line could not be resolved. Restart the puzzle.');
      return;
    }

    this.puzzleState.autoReplyPending = true;
    this.setPuzzleFeedback('Correct move. The reply is being played.');
    const move = normalizeMoveRequest(expectedReply);
    window.setTimeout(() => {
      this.scheduleDeferredAction(() => {
        if (!this.isPuzzleVariant() || !this.activePuzzle || !this.puzzleState.autoReplyPending) {
          return;
        }

        const applied = this.executeMove(move, {
          source: 'puzzle-reply',
          autoCollapse: false
        });
        if (applied) {
          this.puzzleState.progress += 1;
          this.puzzleState.autoReplyPending = false;
          if (this.puzzleState.progress >= solutionLine.length) {
            this.completePuzzle();
            return;
          }
          this.setPuzzleFeedback(this.getDefaultPuzzleFeedback());
          this.updateStatus(`Puzzle reply: ${applied.san}`);
          this.updateUiState();
          this.persistMatchState();
          this.continuePuzzleSequenceIfNeeded();
        }
      });
    }, 280);
  }

  completePuzzle() {
    this.puzzleState.solved = true;
    this.puzzleState.autoReplyPending = false;
    const stars = this.getPuzzleStarCount();
    const solvedMessage = `Puzzle solved - ${stars}/3 stars`;
    if (this.variantMode === VARIANT_MODES.daily) {
      this.dailyChallengeState = {
        dateKey: this.puzzleState.dailyKey || buildLocalDateKey(),
        solved: true
      };
      this.saveDailyChallengeState();
      this.updateDailyChallengeStatus();
    }
    this.showEventBanner('Solved', { duration: 1800 });
    this.setPuzzleFeedback(solvedMessage);
    this.updateStatus(this.variantMode === VARIANT_MODES.daily ? 'Daily challenge solved' : 'Puzzle solved');
    this.updateUiState();
    this.persistMatchState();
  }

  setCustomPieceColor(color) {
    this.customSelectedColor = color === 'b' ? 'b' : 'w';
    this.updateUiState();
  }

  setCustomPieceType(type) {
    this.customSelectedType = ['k', 'q', 'r', 'b', 'n', 'p', 'erase'].includes(type) ? type : 'k';
    this.updateUiState();
  }

  captureBoardPiecesFromChess() {
    const pieces = [];
    for (let rank = 1; rank <= 8; rank += 1) {
      for (let file = 0; file < 8; file += 1) {
        const square = `${FILES[file]}${rank}`;
        const piece = this.chess.get(square);
        if (piece) {
          pieces.push({
            square,
            type: piece.type,
            color: piece.color
          });
        }
      }
    }
    return pieces;
  }

  loadCustomBoardPieces(
    pieces = [],
    {
      message = 'Custom editor ready',
      preserveSavedReplayMoves = false,
      preserveReplayState = false
    } = {}
  ) {
    this.chess.clear();
    pieces.forEach((piece) => {
      this.chess.put({ type: piece.type, color: piece.color }, piece.square);
    });
    this.customSetupPieces = pieces.map((piece) => ({ ...piece }));
    this.customSetupFen = this.chess.fen();
    this.hydrateBoardFromCurrentState({
      message,
      preserveSavedReplayMoves,
      preserveReplayState
    });
  }

  toggleCustomEditMode() {
    if (this.variantMode !== VARIANT_MODES.custom) {
      return;
    }

    this.customEditMode = !this.customEditMode;
    this.manualMatchStarted = false;
    this.clearSelection();
    this.showTemporaryStatus(this.customEditMode ? 'Edit mode enabled' : 'Edit mode locked');
    this.updateUiState();
    this.persistMatchState();
  }

  clearCustomBoard() {
    if (this.variantMode !== VARIANT_MODES.custom) {
      return;
    }

    this.customEditMode = true;
    this.manualMatchStarted = false;
    this.chess.clear();
    this.customSetupPieces = [];
    this.customSetupFen = this.chess.fen();
    this.hydrateBoardFromCurrentState({ message: 'Custom board cleared' });
    this.persistMatchState();
  }

  loadStandardCustomSetup() {
    if (this.variantMode !== VARIANT_MODES.custom) {
      return;
    }

    this.customEditMode = true;
    this.manualMatchStarted = false;
    this.customSetupFen = initialFen();
    this.customSetupPieces = null;
    this.loadPositionFromFen(this.customSetupFen, { message: 'Standard setup loaded' });
    this.persistMatchState();
  }

  validateCustomSetup() {
    const counts = { w: 0, b: 0 };
    this.chess.board().flat().forEach((piece) => {
      if (piece?.type === 'k') {
        counts[piece.color] += 1;
      }
    });

    if (counts.w !== 1 || counts.b !== 1) {
      return 'Place exactly one white king and one black king.';
    }

    const validator = new Chess();
    try {
      validator.load(this.chess.fen());
    } catch {
      return 'That setup is not playable.';
    }

    return null;
  }

  startCustomMatch({ startLive = true } = {}) {
    if (this.variantMode !== VARIANT_MODES.custom) {
      return;
    }

    const error = this.validateCustomSetup();
    if (error) {
      this.triggerRestrictedFeedback(error, [this.panels.customPanel, this.statusCard]);
      return;
    }

    this.customEditMode = false;
    this.customSetupPieces = this.captureBoardPiecesFromChess();
    this.customSetupFen = this.chess.fen();
    this.clearPersistedMatch();
    this.loadPositionFromFen(this.customSetupFen, { message: 'Custom match ready' });
    this.manualMatchStarted = startLive;
    if (this.manualMatchStarted) {
      this.collapsePlayPanelsForLiveMatch();
    }
    this.updateStatus(this.lastMoveText);
    this.updateUiState();
    this.persistMatchState();
  }

  handleCustomEditorClick(square) {
    if (this.variantMode !== VARIANT_MODES.custom || !this.customEditMode) {
      return false;
    }

    this.markInteraction();
    this.clearSelection();
    this.closePromotion(true);

    if (this.customSelectedType === 'erase') {
      this.chess.remove(square);
      this.customSetupPieces = this.captureBoardPiecesFromChess();
      this.customSetupFen = this.chess.fen();
      this.hydrateBoardFromCurrentState({ message: `Cleared ${square.toUpperCase()}` });
      this.persistMatchState();
      return true;
    }

    this.chess.remove(square);
    const placed = this.chess.put({ type: this.customSelectedType, color: this.customSelectedColor }, square);
    if (!placed) {
      this.triggerRestrictedFeedback('That piece placement is not allowed.', [this.panels.customPanel, this.statusCard]);
      return true;
    }

    this.customSetupFen = this.chess.fen();
    this.customSetupPieces = this.captureBoardPiecesFromChess();
    this.hydrateBoardFromCurrentState({
      message: `${COLOR_LABELS[this.customSelectedColor]} ${this.getCustomPieceLabel(this.customSelectedType).toLowerCase()} placed on ${square.toUpperCase()}`
    });
    this.persistMatchState();
    return true;
  }

  refreshBoardLabelTextures() {
    this.boardLabelSprites.forEach((sprite) => {
      const canvas = sprite.userData.canvas;
      const context = sprite.userData.context;
      const texture = sprite.userData.texture;
      if (!canvas || !context || !texture) {
        return;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = this.themeId === 'midnight' ? '#d5e4ff' : '#9b7239';
      context.font = '700 52px Georgia';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(sprite.userData.labelText, canvas.width / 2, canvas.height / 2);
      texture.needsUpdate = true;
    });
  }

  rethemeAllPieces() {
    this.pieceMeshes.forEach((piece) => {
      rethemePiece(piece, this.themeId, {
        modelRoot: this.getPieceModelRoot(piece.userData.type)
      });
    });
    this.refreshPieceAppearance();
  }

  applySceneTheme({ rethemePieces = true } = {}) {
    const isMidnight = this.themeId === 'midnight';
    const isRegal = this.themeId === 'regal';
    this.scene.background = new THREE.Color(this.activeTheme.sceneBackground);
    this.renderer.toneMappingExposure = isMidnight ? 1.02 : isRegal ? 1.12 : 1.06;

    if (this.floorMesh) {
      this.floorMesh.material.color.set(this.activeTheme.sceneAccent);
      this.floorMesh.material.opacity = this.activeTheme.floorOpacity;
    }

    if (this.boardFrameMesh) {
      this.boardFrameMesh.material.color.set(this.activeTheme.board.frame);
    }
    if (this.boardApronMesh) {
      this.boardApronMesh.material.color.set(this.activeTheme.board.apron);
    }
    if (this.boardPedestalMesh) {
      this.boardPedestalMesh.material.color.set(this.activeTheme.board.pedestal);
    }

    if (this.ambientLight) {
      this.ambientLight.color.set(isMidnight ? '#dbe6ff' : isRegal ? '#f3ddbd' : '#fff8ee');
      this.ambientLight.intensity = isMidnight ? 1.52 : isRegal ? 1.44 : 1.68;
    }
    if (this.directionalLight) {
      this.directionalLight.color.set(isMidnight ? '#e7edff' : isRegal ? '#f9e9c3' : '#fff8e8');
      this.directionalLight.intensity = isMidnight ? 2.18 : isRegal ? 2.28 : 2.4;
    }
    if (this.rimLight) {
      this.rimLight.color.set(this.activeTheme.sceneGlow);
      this.rimLight.intensity = isMidnight ? 1.72 : isRegal ? 1.48 : 1.25;
    }
    if (this.environmentHalo) {
      this.environmentHalo.material.color.set(this.activeTheme.sceneGlow);
      this.environmentHalo.material.emissive.set(this.activeTheme.sceneGlow);
    }
    this.environmentArches.forEach((arch) => {
      arch.material.color.set(this.activeTheme.sceneGlow);
      arch.material.emissive.set(this.activeTheme.sceneGlow);
    });
    this.environmentParticles.forEach((particle) => {
      particle.material.color.set(this.activeTheme.sceneGlow);
      particle.material.emissive.set(this.activeTheme.sceneGlow);
    });

    if (this.hoverIndicator) {
      this.hoverIndicator.material.color.set(this.activeTheme.board.hover);
      this.hoverIndicator.material.emissive.set(this.activeTheme.board.hover);
    }
    if (this.selectionRing) {
      this.selectionRing.material.color.set(this.activeTheme.board.selection);
      this.selectionRing.material.emissive.set(this.activeTheme.board.selection);
    }

    ['w', 'b'].forEach((color) => {
      const clockFace = this.playerClocks[color];
      if (!clockFace) {
        return;
      }
      clockFace.body.material.color.set(color === 'w' ? this.activeTheme.clocks.lightBody : this.activeTheme.clocks.darkBody);
    });

    this.updateBoardHighlights();
    this.refreshBoardLabelTextures();
    this.refreshClockVisuals(true);
    if (rethemePieces) {
      this.rethemeAllPieces();
    }
    if (this.moveMarkers.length > 0) {
      this.showMoveMarkers(this.validMoves);
    }
  }

  hasMatchStarted() {
    return this.chess.history().length > 0 || this.moveHistory.length > 0;
  }

  isCurrentMatchStarted(mode = this.gameMode) {
    if (mode === GAME_MODES.online) {
      return this.onlineMatchStarted;
    }

    return this.manualMatchStarted;
  }

  beginPreparedMatch() {
    if (this.gameMode === GAME_MODES.online) {
      return;
    }

    this.manualMatchStarted = true;
    this.collapsePlayPanelsForLiveMatch();
    if (this.gameMode === GAME_MODES.ai) {
      this.aiStatusMessage = this.describeAIModeStatus();
      void this.refreshAIEvaluation();
    }
    this.updateStatus(this.lastMoveText);
    this.updateUiState();
    this.persistMatchState();
  }

  isAIDifficultyLocked() {
    return this.gameMode === GAME_MODES.ai && this.hasMatchStarted();
  }

  resetOnlineUndoState() {
    if (this.undoResponseTimer) {
      window.clearTimeout(this.undoResponseTimer);
      this.undoResponseTimer = 0;
    }

    this.onlineUndoState = {
      pending: false,
      canRespond: false,
      requestedBy: null,
      mode: null,
      message: 'No undo request pending.'
    };
  }

  resetOnlineRematchState() {
    this.onlineRematchState = {
      pending: false,
      canRespond: false,
      requestedBy: null,
      message: 'No rematch request pending.'
    };
  }

  clearPendingDrawTimer() {
    if (this.drawResponseTimer) {
      window.clearTimeout(this.drawResponseTimer);
      this.drawResponseTimer = 0;
    }
  }

  resetDrawState() {
    this.clearPendingDrawTimer();
    this.drawState = {
      pending: false,
      canRespond: false,
      requestedBy: null,
      mode: null,
      message: 'No draw offer pending.'
    };
  }

  isMatchFinished() {
    return this.chess.isGameOver() || this.clockState.flaggedColor || this.agreedDraw;
  }

  finalizeAgreedDraw(message = 'Draw agreed by both players.') {
    if (this.agreedDraw) {
      return;
    }

    this.clearPendingDrawTimer();
    this.agreedDraw = true;
    this.clearSelection();
    this.closePromotion(true);
    this.aiRequestToken += 1;
    this.aiThinking = false;
    this.aiService?.stop();
    this.resetDrawState();
    if (this.gameMode === GAME_MODES.ai) {
      this.aiStatusMessage = 'Match complete';
    }
    if (this.gameMode === GAME_MODES.online) {
      this.onlineStatusMessage = 'Match complete';
    }
    this.showEventBanner('Draw', { duration: 1800 });
    this.updateStatus(message);
    this.refreshClockVisuals(true);
    this.updateTopTimerBadges();
    this.persistMatchState();
    this.updateUiState();
    this.scheduleGameAnalysisPresentation();
  }

  setOnlineColorPreference(preference) {
    const normalized = preference === 'w' || preference === 'b' ? preference : 'auto';
    if (this.onlineRoomId) {
      this.triggerRestrictedFeedback('Leave the current room to change seat preference.', [this.panels.onlinePanel, this.statusCard]);
      return;
    }

    this.onlineColorPreference = normalized;
    if (this.gameMode === GAME_MODES.online) {
      this.resetView({ animate: true });
    }
    this.updateUiState();
  }

  setHudCollapsed(collapsed) {
    this.hudCollapsed = Boolean(collapsed);
    this.appShell?.classList.toggle('panel-collapsed', this.hudCollapsed);

    if (this.controls.hudToggleButton) {
      this.controls.hudToggleButton.setAttribute('aria-expanded', String(!this.hudCollapsed));
      this.controls.hudToggleButton.setAttribute(
        'aria-label',
        this.hudCollapsed ? 'Open side panel' : 'Hide side panel'
      );
      const label = this.controls.hudToggleButton.querySelector('.hud-toggle-label');
      if (label) {
        label.textContent = this.hudCollapsed ? 'Open Panel' : 'Hide Panel';
      }
    }
  }

  collapsePlayPanelsForLiveMatch() {
    this.hudAutoCollapsed = true;

    if (!this.hudCollapsed) {
      this.setHudCollapsed(true);
    }

    if (this.matchPanelOpen) {
      this.setMatchPanelOpen(false);
    }
  }

  isCompactMatchOverlay() {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return false;
    }

    return window.matchMedia('(max-width: 760px), (max-width: 1180px) and (max-height: 900px) and (orientation: landscape)').matches;
  }

  setMatchPanelOpen(open) {
    this.matchPanelOpen = Boolean(open);
    const topbar = this.panels.matchActionsPanel?.closest('.game-topbar');
    topbar?.classList.toggle('is-action-panel-open', this.matchPanelOpen);

    if (this.controls.matchPanelToggleButton) {
      this.controls.matchPanelToggleButton.setAttribute('aria-expanded', String(this.matchPanelOpen));
      this.controls.matchPanelToggleButton.setAttribute(
        'aria-label',
        this.matchPanelOpen ? 'Hide match controls' : 'Show match controls'
      );
      const label = this.controls.matchPanelToggleButton.querySelector('.match-panel-toggle-label');
      if (label) {
        label.textContent = this.matchPanelOpen ? 'Close' : 'Match';
      }
    }
  }

  setHomeVisible(visible) {
    this.homeVisible = Boolean(visible);
    if (!this.homeVisible && !this.homeGuideSeen) {
      this.homeGuideSeen = true;
      try {
        window.localStorage?.setItem(HOME_GUIDE_SEEN_STORAGE_KEY, '1');
      } catch {
        // Ignore storage failures.
      }
    }
    this.panels.homeOverlay?.classList.toggle('hidden', !this.homeVisible);
    this.panels.homeOverlay?.setAttribute('aria-hidden', String(!this.homeVisible));
  }

  hideGameAnalysis() {
    this.clearPendingGameAnalysis();
    this.analysisState.visible = false;
    this.panels.analysisOverlay?.classList.add('hidden');
    this.panels.analysisOverlay?.setAttribute('aria-hidden', 'true');
  }

  selectGameMode(mode) {
    if (!Object.values(GAME_MODES).includes(mode)) {
      return;
    }

    this.selectedGameMode = mode;
    this.updateUiState();
  }

  getPreferredViewColor() {
    if (this.gameMode === GAME_MODES.online) {
      if (this.onlinePlayerColor) {
        return this.onlinePlayerColor;
      }
      if (this.onlineColorPreference === 'w' || this.onlineColorPreference === 'b') {
        return this.onlineColorPreference;
      }
    }

    return this.humanColor || 'w';
  }

  getCameraPoseForColor(color) {
    const direction = color === 'b' ? -1 : 1;
    return {
      position: new THREE.Vector3(0, 7.45, 13.35 * direction),
      target: new THREE.Vector3(0, 0.72, 0)
    };
  }

  captureCurrentCameraPose() {
    return {
      position: this.camera.position.clone(),
      target: this.controls3D.target.clone()
    };
  }

  applyCameraPose(position, target) {
    this.camera.position.copy(position);
    this.controls3D.target.copy(target);
  }

  interpolateOrbitCameraPose(fromPose, toPose, progress, { lift = 0, thetaDirection = 0 } = {}) {
    const target = new THREE.Vector3().lerpVectors(fromPose.target, toPose.target, progress);
    const fromOffset = fromPose.position.clone().sub(fromPose.target);
    const toOffset = toPose.position.clone().sub(toPose.target);
    const fromSpherical = new THREE.Spherical().setFromVector3(fromOffset);
    const toSpherical = new THREE.Spherical().setFromVector3(toOffset);
    const spherical = new THREE.Spherical(
      lerp(fromSpherical.radius, toSpherical.radius, progress),
      lerp(fromSpherical.phi, toSpherical.phi, progress),
      fromSpherical.theta + shortestAngleDelta(fromSpherical.theta, toSpherical.theta) * progress
    );
    const offset = new THREE.Vector3().setFromSpherical(spherical);

    if (lift > 0) {
      offset.y += Math.sin(progress * Math.PI) * lift;
    }

    return {
      position: target.clone().add(offset),
      target
    };
  }

  setCameraControlsLocked(locked) {
    this.controls3D.enabled = !locked;
    if (locked) {
      this.controls3D.autoRotate = false;
    }
  }

  clearCameraCinematics() {
    this.cameraRig.mode = 'idle';
    this.cameraRig.transition = null;
    this.cameraRig.queue = [];
    this.cameraRig.userPose = null;
    this.setCameraControlsLocked(false);
  }

  queueCameraCinematic(shot) {
    if (!shot || !this.cinematicCameraEnabled) {
      return;
    }

    if (!this.cameraRig.transition && this.cameraRig.queue.length === 0) {
      this.startCameraCinematic(shot);
      return;
    }

    this.cameraRig.queue.push(shot);
  }

  startCameraCinematic(shot) {
    const currentPose = this.captureCurrentCameraPose();
    if (!this.cameraRig.userPose) {
      this.cameraRig.userPose = currentPose;
    }

    this.cameraRig.mode = 'transition';
    this.cameraRig.transition = {
      phase: 'forward',
      elapsed: 0,
      duration: shot.duration ?? 0.52,
      hold: shot.hold ?? 0.2,
      returnDuration: shot.returnDuration ?? 0.58,
      shake: shot.shake ?? 0,
      returnOrbit: shot.returnOrbit || null,
      returnOrbitDirection: shot.returnOrbitDirection || 0,
      returnLift: shot.returnLift ?? 0,
      startPose: currentPose,
      focusPose: {
        position: shot.position.clone(),
        target: shot.target.clone()
      },
      returnPose: shot.returnPose || this.cameraRig.userPose
    };
    this.focusBlend = 0;
    this.setCameraControlsLocked(true);
  }

  finishCameraCinematic() {
    if (this.cameraRig.queue.length > 0) {
      const nextShot = this.cameraRig.queue.shift();
      this.startCameraCinematic(nextShot);
      return;
    }

    this.cameraRig.mode = 'idle';
    this.cameraRig.transition = null;
    this.cameraRig.userPose = null;
    this.setCameraControlsLocked(false);
  }

  updateCameraCinematic(delta) {
    const transition = this.cameraRig.transition;
    if (!transition) {
      return;
    }

    const phaseDuration = transition.phase === 'forward'
      ? transition.duration
      : transition.phase === 'hold'
        ? transition.hold
        : transition.returnDuration;

    transition.elapsed += delta;
    const progress = phaseDuration > 0 ? Math.min(1, transition.elapsed / phaseDuration) : 1;

    if (transition.phase === 'hold') {
      this.cameraRig.mode = 'cinematic';
      this.applyCameraPose(transition.focusPose.position, transition.focusPose.target);
    } else {
      this.cameraRig.mode = 'transition';
      const eased = easeInOutCubic(progress);
      const fromPose = transition.phase === 'forward' ? transition.startPose : transition.focusPose;
      const toPose = transition.phase === 'forward' ? transition.focusPose : transition.returnPose;
      const orbitalReturn = transition.phase === 'return' && transition.returnOrbit === 'board';
      const interpolatedPose = orbitalReturn
        ? this.interpolateOrbitCameraPose(fromPose, toPose, eased, {
          lift: transition.returnLift,
          thetaDirection: transition.returnOrbitDirection
        })
        : {
          position: new THREE.Vector3().lerpVectors(fromPose.position, toPose.position, eased),
          target: new THREE.Vector3().lerpVectors(fromPose.target, toPose.target, eased)
        };
      const position = interpolatedPose.position;
      const target = interpolatedPose.target;

      if (transition.phase !== 'return' && transition.shake > 0.0001) {
        const shakeFade = 1 - progress;
        const time = (typeof performance !== 'undefined' ? performance.now() : Date.now()) * 0.001;
        position.x += Math.sin(time * 36.7) * transition.shake * shakeFade;
        position.y += Math.cos(time * 42.3) * transition.shake * 0.55 * shakeFade;
        position.z += Math.sin(time * 39.1 + 1.6) * transition.shake * shakeFade;
      }

      this.applyCameraPose(position, target);
    }

    if (progress < 1) {
      return;
    }

    if (transition.phase === 'forward') {
      transition.phase = transition.hold > 0.0001 ? 'hold' : 'return';
      transition.elapsed = 0;
      return;
    }

    if (transition.phase === 'hold') {
      transition.phase = 'return';
      transition.elapsed = 0;
      return;
    }

    this.applyCameraPose(transition.returnPose.position, transition.returnPose.target);
    this.finishCameraCinematic();
  }

  buildMoveCameraShot(fromSquare, toSquare, { capture = false } = {}) {
    const from = squareToVector(fromSquare, 0.88);
    const to = squareToVector(toSquare, 0.88);
    const midpoint = from.clone().add(to).multiplyScalar(0.5);
    const target = midpoint.clone().lerp(to, capture ? 0.42 : 0.24);
    target.y = 0.9;

    const baseOffset = this.camera.position.clone().sub(this.controls3D.target);
    if (baseOffset.lengthSq() < 0.001) {
      baseOffset.set(0, 7.45, 13.35);
    }

    const moveVector = to.clone().sub(from);
    const lateral = new THREE.Vector3(-moveVector.z, 0, moveVector.x);
    if (lateral.lengthSq() > 0.0001) {
      lateral.normalize().multiplyScalar(capture ? 1.05 : 0.68);
    }

    const offset = baseOffset.multiplyScalar(capture ? 0.76 : 0.84).add(lateral);
    offset.y = Math.max(capture ? 4.8 : 5.2, offset.y * (capture ? 0.86 : 0.92));

    return {
      position: target.clone().add(offset),
      target,
      duration: capture ? 0.42 : 0.5,
      hold: capture ? 0.24 : 0.16,
      returnDuration: 0.56,
      shake: capture ? 0.12 : 0.03
    };
  }

  findKingSquare(color) {
    for (let rank = 1; rank <= 8; rank += 1) {
      for (let file = 0; file < 8; file += 1) {
        const square = `${FILES[file]}${rank}`;
        const piece = this.chess.get(square);
        if (piece?.type === 'k' && piece.color === color) {
          return square;
        }
      }
    }

    return null;
  }

  buildThreatCameraShot(color, { checkmate = false } = {}) {
    const kingSquare = this.findKingSquare(color);
    if (!kingSquare) {
      return null;
    }

    const target = squareToVector(kingSquare, 0.96);
    target.y = 1.02;
    const baseOffset = this.camera.position.clone().sub(this.controls3D.target);
    if (baseOffset.lengthSq() < 0.001) {
      baseOffset.set(0, 7.45, 13.35);
    }

    const offset = baseOffset.multiplyScalar(checkmate ? 0.56 : 0.66);
    offset.y = Math.max(checkmate ? 4.25 : 4.75, offset.y * (checkmate ? 0.72 : 0.82));

    return {
      position: target.clone().add(offset),
      target,
      duration: checkmate ? 0.72 : 0.48,
      hold: checkmate ? 1.25 : 0.34,
      returnDuration: checkmate ? 0.8 : 0.54,
      shake: checkmate ? 0.08 : 0.02
    };
  }

  shouldAutoRotateLocalTurnView() {
    return this.gameMode === GAME_MODES.local
      && this.manualMatchStarted
      && !this.replayState.active
      && !this.isPuzzleVariant()
      && !this.customEditMode
      && !this.homeVisible;
  }

  resetLocalTurnCameraView({ animate = true } = {}) {
    this.resetView({
      animate,
      color: this.chess.turn(),
      orbit: true,
      orbitDirection: 1,
      duration: 1.22,
      lift: 0.92,
      lockControls: true
    });
  }

  triggerMoveCameraSequence(result, record) {
    const turnViewPose = this.shouldAutoRotateLocalTurnView()
      ? this.getCameraPoseForColor(this.chess.turn())
      : null;

    if (!result || !record || this.replayState.active) {
      return;
    }

    if (turnViewPose) {
      this.resetLocalTurnCameraView();
      return;
    }

    if (!this.cinematicCameraEnabled) {
      return;
    }

    const moveShot = this.buildMoveCameraShot(result.from, result.to, {
      capture: Boolean(record.capturedPiece)
    });
    if (turnViewPose) {
      moveShot.returnPose = turnViewPose;
      moveShot.returnOrbit = 'board';
      moveShot.returnOrbitDirection = 1;
      moveShot.returnLift = 0.7;
    }
    this.queueCameraCinematic(moveShot);

    if (this.chess.inCheck() || this.chess.isCheckmate()) {
      const threatShot = this.buildThreatCameraShot(this.chess.turn(), {
        checkmate: this.chess.isCheckmate()
      });
      if (threatShot) {
        if (turnViewPose) {
          threatShot.returnPose = turnViewPose;
          threatShot.returnOrbit = 'board';
          threatShot.returnOrbitDirection = 1;
          threatShot.returnLift = this.chess.isCheckmate() ? 0.86 : 0.62;
        }
        this.queueCameraCinematic(threatShot);
      }
    }
  }

  updateImpactOverlay() {
    const overlay = this.panels.impactOverlay;
    if (!overlay) {
      return;
    }

    overlay.style.setProperty('--impact-vignette-opacity', this.timeScaleState.vignette.toFixed(3));
    overlay.style.setProperty('--impact-flash-opacity', this.timeScaleState.flash.toFixed(3));
  }

  resetTimeScaleEffects() {
    this.timeScaleState.current = 1;
    this.timeScaleState.phase = 'idle';
    this.timeScaleState.elapsed = 0;
    this.timeScaleState.startScale = 1;
    this.timeScaleState.flash = 0;
    this.timeScaleState.vignette = 0;
    this.updateImpactOverlay();
  }

  beginCaptureSlowMotion() {
    this.timeScaleState.phase = 'enter';
    this.timeScaleState.elapsed = 0;
    this.timeScaleState.startScale = this.timeScaleState.current;
  }

  commitCaptureImpact() {
    this.timeScaleState.current = Math.min(this.timeScaleState.current, this.timeScaleState.slowTarget);
    this.timeScaleState.phase = 'hold';
    this.timeScaleState.elapsed = 0;
    this.timeScaleState.flash = 0.9;
    this.updateImpactOverlay();
  }

  updateTimeScale(rawDelta) {
    const state = this.timeScaleState;

    switch (state.phase) {
      case 'enter': {
        state.elapsed += rawDelta;
        const progress = Math.min(state.elapsed / state.enterDuration, 1);
        state.current = lerp(state.startScale, state.slowTarget, easeInOutCubic(progress));
        if (progress >= 1) {
          state.phase = 'armed';
          state.elapsed = 0;
          state.current = state.slowTarget;
        }
        break;
      }
      case 'armed':
        state.current = state.slowTarget;
        break;
      case 'hold':
        state.elapsed += rawDelta;
        state.current = state.slowTarget;
        if (state.elapsed >= state.holdDuration) {
          state.phase = 'return';
          state.elapsed = 0;
          state.startScale = state.current;
        }
        break;
      case 'return': {
        state.elapsed += rawDelta;
        const progress = Math.min(state.elapsed / state.returnDuration, 1);
        state.current = lerp(state.startScale, 1, easeInOutCubic(progress));
        if (progress >= 1) {
          state.phase = 'idle';
          state.elapsed = 0;
          state.current = 1;
        }
        break;
      }
      default:
        state.current = lerp(state.current, 1, 1 - Math.exp(-rawDelta * 10));
        if (Math.abs(state.current - 1) < 0.0001) {
          state.current = 1;
        }
        break;
    }

    state.flash = Math.max(0, state.flash - rawDelta * 2.1);
    const overlayTarget = Math.min(0.34, (1 - state.current) * 0.38);
    state.vignette = lerp(state.vignette, overlayTarget, 1 - Math.exp(-rawDelta * 8.5));
    this.updateImpactOverlay();
  }

  resetView({
    animate = true,
    color = this.getPreferredViewColor(),
    orbit = false,
    orbitDirection = 0,
    duration = null,
    lift = 0.55,
    lockControls = false
  } = {}) {
    const pose = this.getCameraPoseForColor(color);
    const fromPosition = this.camera.position.clone();
    const fromTarget = this.controls3D.target.clone();
    const fromPose = {
      position: fromPosition,
      target: fromTarget
    };

    this.clearCameraCinematics();
    this.focusBlend = 0;
    this.focusTarget.copy(pose.target);

    if (!animate) {
      this.camera.position.copy(pose.position);
      this.controls3D.target.copy(pose.target);
      this.controls3D.update();
      return;
    }

    this.animations.push({
      duration: orbit ? 0.78 : 0.55,
      elapsed: 0,
      onUpdate: (progress) => {
        const eased = easeInOutCubic(progress);
        if (orbit) {
          const orbitalPose = this.interpolateOrbitCameraPose(fromPose, pose, eased, { lift: 0.55 });
          this.camera.position.copy(orbitalPose.position);
          this.controls3D.target.copy(orbitalPose.target);
        } else {
          this.camera.position.lerpVectors(fromPosition, pose.position, eased);
          this.controls3D.target.lerpVectors(fromTarget, pose.target, eased);
        }
      },
      onComplete: () => {
        this.camera.position.copy(pose.position);
        this.controls3D.target.copy(pose.target);
        this.controls3D.update();
      }
    });
  }

  getSerializableMoves(records = this.moveHistory) {
    return records.map((record) => ({
      from: record.from,
      to: record.to,
      promotion: record.promotion || undefined,
      san: record.san,
      color: record.color,
      source: record.source
    }));
  }

  buildSavedMatch() {
    if (this.replayState.active) {
      return this.replayState.snapshot;
    }

    const moves = this.getSerializableMoves();
    const variantSnapshot = this.getVariantSnapshot();
    const clockIsPristine = !this.usesMatchClock()
      || (
        Math.abs(this.clockState.remaining.w - this.clockState.initialSeconds) < 0.05
        && Math.abs(this.clockState.remaining.b - this.clockState.initialSeconds) < 0.05
        && !this.clockState.flaggedColor
      );
    const isDefaultState = moves.length === 0
      && this.chess.fen() === initialFen()
      && this.gameMode === GAME_MODES.local
      && this.selectedGameMode === GAME_MODES.local
      && this.variantMode === VARIANT_MODES.classic
      && !this.manualMatchStarted
      && this.themeId === DEFAULT_THEME_ID
      && this.cinematicCameraEnabled
      && !this.agreedDraw
      && !this.drawState.pending
      && clockIsPristine
      && !this.customEditMode;
    if (isDefaultState) {
      return null;
    }

    return {
      savedAt: Date.now(),
      fen: this.chess.fen(),
      turn: this.chess.turn(),
      gameMode: this.gameMode,
      selectedGameMode: this.selectedGameMode,
      matchStarted: this.gameMode === GAME_MODES.online ? this.onlineMatchStarted : this.manualMatchStarted,
      aiDifficulty: this.aiDifficulty,
      aiStyle: this.aiStyle,
      themeId: this.themeId,
      cinematicCameraEnabled: this.cinematicCameraEnabled,
      onlineColorPreference: this.onlineColorPreference,
      onlinePlayerColor: this.onlinePlayerColor,
      roomId: this.onlineRoomId || this.controls.roomInput?.value?.trim()?.toUpperCase() || '',
      agreedDraw: this.agreedDraw,
      drawState: {
        pending: this.drawState.pending,
        canRespond: this.drawState.canRespond,
        requestedBy: this.drawState.requestedBy,
        mode: this.drawState.mode,
        message: this.drawState.message
      },
      variantState: variantSnapshot,
      moves,
      lastMoveText: this.lastMoveText,
      lastMoveSquares: [...this.lastMoveSquares],
      clockState: {
        remaining: {
          w: this.clockState.remaining.w,
          b: this.clockState.remaining.b
        },
        flaggedColor: this.clockState.flaggedColor
      }
    };
  }

  persistMatchState() {
    const match = this.replayState.active
      ? this.replayState.snapshot || loadSavedMatch()
      : this.buildSavedMatch();
    if (!match) {
      clearSavedMatch();
      this.savedReplayMoves = [];
      return;
    }

    saveSavedMatch(match);
    this.savedReplayMoves = [...match.moves];
  }

  clearPersistedMatch() {
    clearSavedMatch();
    this.savedReplayMoves = [];
  }

  restoreLastSession() {
    const savedMatch = loadSavedMatch();
    if (!savedMatch?.moves?.length && !savedMatch?.variantState && !savedMatch?.fen) {
      this.manualMatchStarted = false;
      this.loadPositionFromFen(initialFen(), { message: 'Opening position' });
      this.renderMoveHistory();
      return;
    }

    this.savedReplayMoves = [...(savedMatch.moves || [])];
    this.restoreFromSavedMatch(savedMatch, { allowAISync: true });
  }

  restoreFromSavedMatch(savedMatch, { allowAISync = false } = {}) {
    const savedMoves = Array.isArray(savedMatch?.moves) ? savedMatch.moves : [];
    const restoredMode = Object.values(GAME_MODES).includes(savedMatch?.gameMode)
      ? savedMatch.gameMode
      : GAME_MODES.local;

    this.stopReplayPlayback();
    this.replayState.active = false;
    this.replayState.moveIndex = 0;
    this.replayState.moves = [];
    this.replayState.snapshot = null;

    this.gameMode = restoredMode;
    this.selectedGameMode = Object.values(GAME_MODES).includes(savedMatch?.selectedGameMode)
      ? savedMatch.selectedGameMode
      : restoredMode;
    this.manualMatchStarted = restoredMode === GAME_MODES.online
      ? false
      : typeof savedMatch?.matchStarted === 'boolean'
        ? savedMatch.matchStarted
        : savedMoves.length > 0;
    if (this.manualMatchStarted) {
      this.collapsePlayPanelsForLiveMatch();
    }
    this.aiDifficulty = AI_DIFFICULTY_PROFILES[savedMatch?.aiDifficulty] ? savedMatch.aiDifficulty : 'medium';
    this.aiStyle = AI_STYLE_PROFILES[savedMatch?.aiStyle] ? savedMatch.aiStyle : 'balanced';
    this.themeId = THEME_PRESETS[savedMatch?.themeId] ? savedMatch.themeId : loadThemePreference();
    this.activeTheme = THEME_PRESETS[this.themeId] || THEME_PRESETS[DEFAULT_THEME_ID];
    this.cinematicCameraEnabled = savedMatch?.cinematicCameraEnabled !== false;
    this.applyThemeToDom();
    this.applySceneTheme();
    this.resetOnlineState({ preserveClient: false });
    this.onlineColorPreference = savedMatch?.onlineColorPreference === 'w' || savedMatch?.onlineColorPreference === 'b'
      ? savedMatch.onlineColorPreference
      : 'auto';
    this.variantMode = Object.values(VARIANT_MODES).includes(savedMatch?.variantState?.variantMode)
      ? savedMatch.variantState.variantMode
      : VARIANT_MODES.classic;
    if (this.isTrainingVariant()) {
      this.gameMode = GAME_MODES.local;
    }
    this.blitzPreset = BLITZ_PRESETS[savedMatch?.variantState?.blitzPreset] ? savedMatch.variantState.blitzPreset : '3';
    this.puzzleState.difficulty = normalizePuzzleDifficulty(savedMatch?.variantState?.puzzleDifficulty || this.puzzleState.difficulty);
    this.customSetupFen = savedMatch?.variantState?.customSetupFen || this.customSetupFen || initialFen();
    this.customSetupPieces = Array.isArray(savedMatch?.variantState?.customSetupPieces)
      ? savedMatch.variantState.customSetupPieces
      : this.customSetupPieces;
    this.customEditMode = Boolean(savedMatch?.variantState?.customEditMode && this.variantMode === VARIANT_MODES.custom);
    if (this.variantMode === VARIANT_MODES.puzzle || this.variantMode === VARIANT_MODES.daily) {
      const puzzleSource = savedMatch?.variantState?.puzzleSource === VARIANT_MODES.daily ? VARIANT_MODES.daily : this.variantMode;
      this.setActivePuzzle(
        puzzleSource,
        savedMatch?.variantState?.puzzleIndex ?? 0,
        {
          progress: savedMatch?.variantState?.puzzleProgress ?? 0,
          solved: Boolean(savedMatch?.variantState?.puzzleSolved),
          dailyKey: savedMatch?.variantState?.dailyKey || buildLocalDateKey(),
          difficulty: savedMatch?.variantState?.puzzleDifficulty || this.puzzleState.difficulty,
          feedback: savedMatch?.variantState?.puzzleFeedback || null,
          elapsedSeconds: savedMatch?.variantState?.puzzleElapsedSeconds ?? 0,
          hintsUsed: savedMatch?.variantState?.puzzleHintsUsed ?? 0
        }
      );
      this.refreshPuzzleMeta();
    } else {
      this.activePuzzle = null;
    }
    this.updateDailyChallengeStatus();

    if (restoredMode === GAME_MODES.online) {
      this.onlinePlayerColor = savedMatch?.onlinePlayerColor || this.onlineSession?.color || null;
      this.onlinePlayerToken = this.onlineSession?.playerToken || null;
      this.onlineRoomId = savedMatch?.roomId || this.onlineSession?.roomId || null;
      this.onlineStatusMessage = this.onlinePlayerToken
        ? 'Restored local board snapshot. Use Start Game or Reconnect to rejoin the live room.'
        : 'Restored local board snapshot. Rejoin the room to continue live.';
      this.onlineConnectionMessage = this.onlineRoomId
        ? `Saved room ${this.onlineRoomId}`
        : 'Offline snapshot';
      this.onlineReconnectMessage = this.onlinePlayerToken ? 'Reconnect ready from saved seat' : 'Room persistence standby';
      if (this.controls.roomInput) {
        this.controls.roomInput.value = this.onlineRoomId || '';
      }
    } else {
      if (this.controls.roomInput) {
        this.controls.roomInput.value = '';
      }
      this.onlinePlayerColor = null;
      this.onlinePlayerToken = null;
      this.onlineStatusMessage = 'Create a room or join an existing match.';
      this.onlineConnectionMessage = 'Connect when needed';
      this.onlineReconnectMessage = 'Room persistence standby';
    }

    this.aiStatusMessage = this.describeAIModeStatus();
    this.aiBookMessage = `${AI_STYLE_PROFILES[this.aiStyle]?.label || 'Balanced'} opening plan ready`;
    if (this.variantMode === VARIANT_MODES.custom && this.customEditMode && Array.isArray(this.customSetupPieces)) {
      this.loadCustomBoardPieces(this.customSetupPieces, {
        message: 'Custom editor ready',
        preserveSavedReplayMoves: true,
        preserveReplayState: true
      });
    } else {
      this.loadPositionFromFen(this.getVariantBaseFen(savedMatch?.variantState), {
        message: 'Opening position',
        preserveSavedReplayMoves: true,
        preserveReplayState: true
      });
    }

    let restoreFailed = false;
    savedMoves.forEach((move) => {
      if (restoreFailed) {
        return;
      }

      const restored = this.executeMove(normalizeMoveRequest(move), {
        source: move.source || 'local',
        silent: true,
        persist: false,
        animate: false,
        autoCollapse: false,
        updateStatusText: false
      });

      if (!restored) {
        restoreFailed = true;
      }
    });

    if (restoreFailed && savedMatch?.fen) {
      this.loadPositionFromFen(savedMatch.fen, {
        message: savedMatch.lastMoveText || 'Restored match',
        preserveSavedReplayMoves: true,
        preserveReplayState: true
      });
    }

    if (savedMatch?.clockState?.remaining) {
      this.clockState.remaining.w = Number(savedMatch.clockState.remaining.w) || this.clockState.initialSeconds;
      this.clockState.remaining.b = Number(savedMatch.clockState.remaining.b) || this.clockState.initialSeconds;
      this.clockState.flaggedColor = savedMatch.clockState.flaggedColor || null;
      this.refreshClockVisuals(true);
      this.updateTopTimerBadges();
    }

    if (savedMatch?.lastMoveSquares?.length === 2) {
      this.lastMoveSquares = [...savedMatch.lastMoveSquares];
      this.updateBoardHighlights();
    }

    this.agreedDraw = Boolean(savedMatch?.agreedDraw);
    if (savedMatch?.drawState?.pending && !this.agreedDraw) {
      this.drawState = {
        pending: true,
        canRespond: Boolean(savedMatch.drawState.canRespond),
        requestedBy: savedMatch.drawState.requestedBy || null,
        mode: savedMatch.drawState.mode || null,
        message: savedMatch.drawState.message || 'Draw offer pending.'
      };
    } else {
      this.resetDrawState();
    }

    if (this.isPuzzleVariant() && this.activePuzzle) {
      if (!savedMatch?.variantState?.puzzleProgress && savedMoves.length > 0) {
        this.puzzleState.progress = Math.min(savedMoves.length, this.getActivePuzzleLine().length);
      }
      this.puzzleState.solved = Boolean(
        savedMatch?.variantState?.puzzleSolved
        || this.puzzleState.progress >= this.getActivePuzzleLine().length
        || this.chess.isCheckmate()
      );
      this.puzzleState.feedback = savedMatch?.variantState?.puzzleFeedback
        || this.puzzleState.feedback
        || this.getDefaultPuzzleFeedback();
    }

    const fallbackMessage = savedMoves.length > 0
      ? this.describeMove(savedMoves[savedMoves.length - 1], {
        source: savedMoves[savedMoves.length - 1].source || 'local'
      })
      : 'Opening position';

    this.lastMoveText = savedMatch?.lastMoveText || fallbackMessage;
    this.updateStatus(this.lastMoveText);
    this.resetView({ animate: false, color: this.getPreferredViewColor() });
    this.renderMoveHistory();
    this.updateUiState();
    this.continuePuzzleSequenceIfNeeded();

    if (
      allowAISync
      && this.gameMode === GAME_MODES.ai
      && this.manualMatchStarted
      && !this.isTrainingVariant()
      && this.chess.turn() === this.aiColor
      && !this.chess.isGameOver()
      && !this.clockState.flaggedColor
    ) {
      void this.requestAIMove();
    } else if (this.gameMode === GAME_MODES.ai && !this.isTrainingVariant() && this.manualMatchStarted) {
      void this.refreshAIEvaluation();
    } else if (this.gameMode === GAME_MODES.ai && !this.isTrainingVariant()) {
      this.aiEvaluationState = {
        loading: false,
        label: 'Press Start Game',
        whitePerspective: null,
        lines: [],
        requestId: this.aiEvaluationState.requestId + 1
      };
    }
  }

  renderMoveHistory() {
    const container = this.panels.moveHistoryList;
    if (!container) {
      return;
    }

    const liveMoves = this.getSerializableMoves();
    const moves = this.replayState.active
      ? this.replayState.moves
      : liveMoves.length > 0
        ? liveMoves
        : this.savedReplayMoves;

    if (moves.length === 0) {
      container.innerHTML = '<div class="move-history-empty">No moves yet.</div>';
      return;
    }

    const activeMoveIndex = this.replayState.active
      ? this.replayState.moveIndex - 1
      : moves.length - 1;

    const rows = [];
    for (let index = 0; index < moves.length; index += 2) {
      const whiteMove = moves[index];
      const blackMove = moves[index + 1];
      const moveNumber = index / 2 + 1;
      const whiteActive = activeMoveIndex === index;
      const blackActive = activeMoveIndex === index + 1;
      const rowActive = whiteActive || blackActive;

      rows.push(`
        <div class="move-history-row${rowActive ? ' is-active' : ''}">
          <span class="move-history-index">${moveNumber}.</span>
          <span class="move-history-cell${whiteActive ? ' is-current' : ''}">${whiteMove?.san || ''}</span>
          <span class="move-history-cell${blackActive ? ' is-current' : ''}">${blackMove?.san || ''}</span>
        </div>
      `);
    }

    container.innerHTML = rows.join('');
    const currentMove = container.querySelector('.move-history-cell.is-current')
      || container.querySelector('.move-history-row.is-active');
    currentMove?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }

  startReplayMatch() {
    if (this.replayState.active) {
      this.exitReplayMode();
      return;
    }

    if (this.pendingPromotion || this.isAnimating || this.aiThinking) {
      this.triggerRestrictedFeedback('Finish the current action before starting replay.');
      return;
    }

    if (this.onlineRoomId && this.onlineConnected) {
      this.triggerRestrictedFeedback('Leave the live room before starting replay.', [this.panels.onlinePanel, this.statusCard]);
      return;
    }

    const savedMatch = loadSavedMatch() || this.buildSavedMatch();
    if (!savedMatch?.moves?.length) {
      this.triggerRestrictedFeedback('No saved match is available to replay.');
      return;
    }

    this.cancelAIMove();
    this.stopReplayPlayback();
    this.replayState.active = true;
    this.replayState.playing = false;
    this.replayState.moveIndex = 0;
    this.replayState.moves = [...savedMatch.moves];
    this.replayState.snapshot = this.buildSavedMatch();
    this.gameMode = savedMatch.gameMode || GAME_MODES.local;
    this.variantMode = Object.values(VARIANT_MODES).includes(savedMatch?.variantState?.variantMode)
      ? savedMatch.variantState.variantMode
      : VARIANT_MODES.classic;
    this.blitzPreset = BLITZ_PRESETS[savedMatch?.variantState?.blitzPreset] ? savedMatch.variantState.blitzPreset : this.blitzPreset;
    if (THEME_PRESETS[savedMatch?.themeId]) {
      this.themeId = savedMatch.themeId;
      this.activeTheme = THEME_PRESETS[this.themeId];
      this.applyThemeToDom();
      this.applySceneTheme();
    }
    if (this.variantMode === VARIANT_MODES.puzzle || this.variantMode === VARIANT_MODES.daily) {
      this.puzzleState.difficulty = normalizePuzzleDifficulty(savedMatch?.variantState?.puzzleDifficulty || this.puzzleState.difficulty);
      this.setActivePuzzle(
        savedMatch?.variantState?.puzzleSource === VARIANT_MODES.daily ? VARIANT_MODES.daily : this.variantMode,
        savedMatch?.variantState?.puzzleIndex ?? 0,
        {
          dailyKey: savedMatch?.variantState?.dailyKey || buildLocalDateKey(),
          difficulty: savedMatch?.variantState?.puzzleDifficulty || this.puzzleState.difficulty,
          feedback: savedMatch?.variantState?.puzzleFeedback || null,
          elapsedSeconds: savedMatch?.variantState?.puzzleElapsedSeconds ?? 0,
          hintsUsed: savedMatch?.variantState?.puzzleHintsUsed ?? 0
        }
      );
      this.refreshPuzzleMeta();
    }
    if (this.variantMode === VARIANT_MODES.custom) {
      this.customSetupFen = savedMatch?.variantState?.customSetupFen || this.customSetupFen;
      this.customEditMode = false;
    }
    this.onlinePlayerColor = savedMatch.onlinePlayerColor || this.onlinePlayerColor;
    this.aiDifficulty = AI_DIFFICULTY_PROFILES[savedMatch.aiDifficulty] ? savedMatch.aiDifficulty : this.aiDifficulty;
    this.loadPositionFromFen(this.getVariantBaseFen(savedMatch?.variantState), {
      message: 'Replay ready',
      preserveSavedReplayMoves: true,
      preserveReplayState: true
    });
    this.lastMoveText = 'Replay ready';
    this.updateStatus(this.lastMoveText);
    this.renderMoveHistory();
    this.updateUiState();
  }

  exitReplayMode() {
    if (!this.replayState.active) {
      return;
    }

    const snapshot = this.replayState.snapshot;
    this.stopReplayPlayback();
    this.replayState.active = false;
    this.replayState.playing = false;
    this.replayState.moveIndex = 0;
    this.replayState.moves = [];
    this.replayState.snapshot = null;

    if (snapshot?.moves?.length) {
      this.restoreFromSavedMatch(snapshot, { allowAISync: false });
      return;
    }

    this.gameMode = GAME_MODES.local;
    this.loadPositionFromFen(initialFen(), { message: 'Opening position', preserveSavedReplayMoves: true });
    this.updateUiState();
  }

  stopReplayPlayback() {
    if (this.replayState.timerId) {
      window.clearTimeout(this.replayState.timerId);
      this.replayState.timerId = 0;
    }
    this.replayState.playing = false;
  }

  toggleReplayPlayback() {
    if (!this.replayState.active) {
      return;
    }

    if (this.replayState.playing) {
      this.stopReplayPlayback();
      this.updateUiState();
      return;
    }

    if (this.replayState.moveIndex >= this.replayState.moves.length) {
      return;
    }

    this.replayState.playing = true;
    this.scheduleReplayPlayback();
    this.updateUiState();
  }

  scheduleReplayPlayback() {
    this.stopReplayPlayback();
    this.replayState.playing = true;

    const advance = () => {
      if (!this.replayState.active || !this.replayState.playing) {
        return;
      }

      if (this.isAnimating) {
        this.replayState.timerId = window.setTimeout(advance, 120);
        return;
      }

      if (!this.stepReplayForward()) {
        this.stopReplayPlayback();
        this.updateUiState();
        return;
      }

      if (this.replayState.moveIndex >= this.replayState.moves.length) {
        this.stopReplayPlayback();
        this.updateUiState();
        return;
      }

      this.replayState.timerId = window.setTimeout(advance, REPLAY_STEP_DELAY_MS);
    };

    this.replayState.timerId = window.setTimeout(advance, 80);
  }

  stepReplayForward() {
    if (
      !this.replayState.active
      || this.replayState.moveIndex >= this.replayState.moves.length
      || this.isAnimating
    ) {
      return false;
    }

    const move = this.replayState.moves[this.replayState.moveIndex];
    const result = this.executeMove(normalizeMoveRequest(move), {
      source: 'replay',
      silent: true,
      persist: false,
      animate: true,
      autoCollapse: false,
      updateStatusText: false
    });

    if (!result) {
      return false;
    }

    this.replayState.moveIndex += 1;
    this.updateStatus(`Replay: ${move.san}`);
    this.renderMoveHistory();
    this.updateUiState();
    return true;
  }

  stepReplayBackward() {
    if (!this.replayState.active || this.replayState.moveIndex <= 0 || this.isAnimating) {
      return false;
    }

    const nextIndex = this.replayState.moveIndex - 1;
    const undone = this.performUndoMove({
      silent: true,
      persist: false,
      animate: true,
      statusText: nextIndex > 0
        ? `Replay: ${this.replayState.moves[nextIndex - 1].san}`
        : 'Replay ready'
    });

    if (!undone) {
      return false;
    }

    this.replayState.moveIndex = nextIndex;
    this.renderMoveHistory();
    this.updateUiState();
    return true;
  }

  autoCollapseHudIfNeeded() {
    if (this.hudAutoCollapsed || !this.hasMatchStarted()) {
      return;
    }

    this.collapsePlayPanelsForLiveMatch();
  }

  showEventBanner(text, { tone = 'default', duration = 1500, dedupeKey = null, allowRepeat = false } = {}) {
    const banner = this.panels.eventBanner;
    if (!banner) {
      return;
    }

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const bannerKey = dedupeKey || `${tone}:${text}`;
    const displayKey = `${tone}:${text}`;
    if (!allowRepeat) {
      const recentUntil = this.bannerRecentlyShown.get(bannerKey) || 0;
      const recentDisplayUntil = this.bannerRecentlyShown.get(displayKey) || 0;
      const sameVisibleAlert = this.bannerState.key === bannerKey || this.bannerState.displayKey === displayKey;
      if (sameVisibleAlert && now < this.bannerState.visibleUntil) {
        return;
      }
      if (now < recentUntil || now < recentDisplayUntil) {
        return;
      }
    }

    const visibleUntil = now + duration;
    const sequence = this.bannerSequence + 1;
    this.bannerSequence = sequence;
    this.bannerState = {
      key: bannerKey,
      displayKey,
      visibleUntil,
      sequence
    };

    if (!allowRepeat) {
      const cooldown = Math.max(550, Math.min(1200, Math.round(duration * 0.7)));
      const cooldownUntil = visibleUntil + cooldown;
      this.bannerRecentlyShown.set(bannerKey, cooldownUntil);
      this.bannerRecentlyShown.set(displayKey, cooldownUntil);
      this.bannerRecentlyShown.forEach((expiresAt, key) => {
        if (expiresAt < now - 5000) {
          this.bannerRecentlyShown.delete(key);
        }
      });
    }

    window.clearTimeout(this.bannerTimeout);
    banner.classList.remove('is-visible');
    banner.classList.remove('hidden');
    banner.dataset.tone = tone;
    banner.innerHTML = `<div class="event-banner-text">${text}</div>`;
    banner.setAttribute('aria-hidden', 'false');
    void banner.offsetWidth;
    banner.classList.add('is-visible');

    this.bannerTimeout = window.setTimeout(() => {
      if (this.bannerState.key !== bannerKey || this.bannerState.sequence !== sequence) {
        return;
      }
      this.hideEventBanner({ key: bannerKey, sequence });
    }, duration);
  }

  hideEventBanner({ key = null, sequence = null } = {}) {
    const banner = this.panels.eventBanner;
    if (!banner) {
      return;
    }

    if (key && this.bannerState.key !== key) {
      return;
    }
    if (sequence !== null && this.bannerState.sequence !== sequence) {
      return;
    }

    window.clearTimeout(this.bannerTimeout);
    this.bannerState = {
      ...this.bannerState,
      key: '',
      displayKey: '',
      visibleUntil: 0
    };
    banner.classList.remove('is-visible');
    banner.classList.add('hidden');
    banner.setAttribute('aria-hidden', 'true');
  }

  hideMatchIntro({ immediate = false } = {}) {
    const overlay = this.panels.matchIntroOverlay;
    const countdownNode = this.status.matchIntroCountdown;
    const wasActive = this.duelIntroState.active;
    window.clearTimeout(this.duelIntroState.timerId);
    window.clearTimeout(this.duelIntroState.hideTimerId);
    this.duelIntroState.countdownTimers.forEach((timerId) => window.clearTimeout(timerId));
    this.duelIntroState.countdownTimers = [];
    this.duelIntroState.active = false;
    this.setOnlineMatchPhase(this.gameMode === GAME_MODES.online && this.onlineMatchStarted ? 'playing' : 'waiting');
    if (!immediate && wasActive) {
      this.notifyPublicIntroComplete();
    }
    this.boardFrame?.classList.remove('is-match-intro-active');

    if (countdownNode) {
      countdownNode.textContent = '';
      countdownNode.classList.remove('is-popping');
    }

    if (!overlay) {
      return;
    }

    overlay.classList.remove('is-visible');
    overlay.classList.remove('is-countdown-live');
    if (immediate) {
      overlay.classList.add('hidden');
      overlay.setAttribute('aria-hidden', 'true');
      return;
    }

    this.duelIntroState.hideTimerId = window.setTimeout(() => {
      overlay.classList.add('hidden');
      overlay.setAttribute('aria-hidden', 'true');
    }, 260);
  }

  showMatchIntro({
    whiteName = COLOR_LABELS.w,
    blackName = COLOR_LABELS.b,
    roomLabel = 'Room Match',
    signature,
    duration = 4600,
    force = false
  } = {}) {
    const overlay = this.panels.matchIntroOverlay;
    const whiteNameLabel = this.status.matchIntroWhiteName;
    const blackNameLabel = this.status.matchIntroBlackName;
    const countdownNode = this.status.matchIntroCountdown;
    const roomLabelNode = this.status.matchIntroRoomLabel;
    if (!overlay || !whiteNameLabel || !blackNameLabel || !roomLabelNode || !countdownNode) {
      return;
    }

    if (!force && signature && this.duelIntroState.lastSignature === signature) {
      return;
    }

    if (signature) {
      this.duelIntroState.lastSignature = signature;
    }

    window.clearTimeout(this.duelIntroState.timerId);
    window.clearTimeout(this.duelIntroState.hideTimerId);
    this.duelIntroState.countdownTimers.forEach((timerId) => window.clearTimeout(timerId));
    this.duelIntroState.countdownTimers = [];
    this.duelIntroState.active = true;
    this.setOnlineMatchPhase('intro');
    this.boardFrame?.classList.add('is-match-intro-active');
    whiteNameLabel.textContent = whiteName;
    blackNameLabel.textContent = blackName;
    roomLabelNode.textContent = roomLabel;
    countdownNode.textContent = '';
    countdownNode.classList.remove('is-popping');
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.remove('is-visible');
    overlay.classList.remove('is-countdown-live');
    void overlay.offsetWidth;
    overlay.classList.add('is-visible');
    this.audio.playIntroWhoosh();

    const showCountdownValue = (value) => {
      countdownNode.textContent = value;
      countdownNode.classList.remove('is-popping');
      void countdownNode.offsetWidth;
      countdownNode.classList.add('is-popping');
      overlay.classList.add('is-countdown-live');
      this.audio.playCountdownTick();
    };

    this.duelIntroState.countdownTimers.push(
      window.setTimeout(() => {
        this.audio.playIntroImpact();
      }, 760),
      window.setTimeout(() => {
        showCountdownValue('3');
      }, 2100),
      window.setTimeout(() => {
        showCountdownValue('2');
      }, 2900),
      window.setTimeout(() => {
        showCountdownValue('1');
      }, 3700)
    );

    this.duelIntroState.timerId = window.setTimeout(() => {
      this.audio.playStartChime();
      this.hideMatchIntro();
      this.updateStatus(this.lastMoveText);
      this.updateUiState();
    }, duration);
  }

  maybeShowOnlineMatchIntro({ force = false, source = 'room-live' } = {}) {
    if (
      this.gameMode !== GAME_MODES.online
      || !this.onlineConnected
      || !this.onlineReady
      || !this.onlineMatchStarted
      || !this.onlineRoomId
      || this.homeVisible
      || this.replayState.active
      || this.drawState.pending
      || this.onlineUndoState.pending
      || this.onlineRematchState.pending
      || this.chess.fen() !== initialFen()
    ) {
      return;
    }

    const names = this.getDisplayedPlayerNames(GAME_MODES.online);
    const signature = force
      ? `${this.onlineRoomId}|${names.w}|${names.b}|${source}|${Date.now()}`
      : `${this.onlineRoomId}|${names.w}|${names.b}|${this.chess.fen()}`;
    this.refreshPlayerIdentity(true);
    this.showMatchIntro({
      whiteName: names.w,
      blackName: names.b,
      roomLabel: this.isPublicBotMatch()
        ? `Public AI Fill · Room ${this.onlineRoomId}`
        : this.onlineMatchType === ONLINE_MATCH_TYPES.publicPvp
          ? `Public PvP · Room ${this.onlineRoomId}`
          : `Battle for Room ${this.onlineRoomId}`,
      signature,
      force
    });
  }

  suppressRoomStateMessage(message, duration = 1600) {
    this.roomStateMessageSuppression = {
      message,
      expiresAt: Date.now() + duration
    };
  }

  shouldSuppressRoomStateMessage(message) {
    return Boolean(
      message
      && this.roomStateMessageSuppression.message === message
      && this.roomStateMessageSuppression.expiresAt > Date.now()
    );
  }

  getOnlineLiveStatusMessage() {
    if (this.publicMatchmakingState.active) {
      return 'Searching public queue';
    }

    if (!this.onlineConnected) {
      return this.onlineRoomId ? 'Reconnect available' : 'Connect when needed';
    }

    if (!this.onlineRoomId) {
      return 'Server ready';
    }

    if (!this.onlineReady) {
      return 'Waiting for full room';
    }

    if (!this.onlineMatchStarted) {
      if (this.onlinePlayerColor && this.onlineStartedPlayers[this.onlinePlayerColor]) {
        return 'Waiting for opponent to press Start Game';
      }
      return 'Press Start Game';
    }

    if (this.isPublicBotMatch()) {
      return this.agreedDraw || this.chess.isGameOver() || this.clockState.flaggedColor
        ? 'Match complete'
        : 'Public bot live';
    }

    return this.agreedDraw || this.chess.isGameOver() || this.clockState.flaggedColor
      ? 'Match complete'
      : this.onlineMatchType === ONLINE_MATCH_TYPES.publicPvp
        ? 'Public PvP live'
        : 'Room live';
  }

  isConfirmationOpen() {
    return Boolean(this.confirmationState.resolve);
  }

  requestConfirmation({
    title = 'Are you sure?',
    message = 'This action needs confirmation.',
    confirmLabel = 'Continue',
    cancelLabel = 'Cancel'
  } = {}) {
    const overlay = this.panels.confirmationOverlay;
    const titleLabel = this.status.confirmationTitle;
    const messageLabel = this.status.confirmationMessage;
    const confirmButton = this.controls.confirmationConfirmButton;
    const cancelButton = this.controls.confirmationCancelButton;

    if (!overlay || !titleLabel || !messageLabel || !confirmButton || !cancelButton) {
      return Promise.resolve(window.confirm(message || title));
    }

    if (this.confirmationState.resolve) {
      this.closeConfirmation(false);
    }

    titleLabel.textContent = title;
    messageLabel.textContent = message;
    confirmButton.textContent = confirmLabel;
    cancelButton.textContent = cancelLabel;
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');

    window.requestAnimationFrame(() => {
      confirmButton.focus();
    });

    return new Promise((resolve) => {
      this.confirmationState.resolve = resolve;
    });
  }

  closeConfirmation(accepted = false) {
    const overlay = this.panels.confirmationOverlay;
    if (overlay) {
      overlay.classList.add('hidden');
      overlay.setAttribute('aria-hidden', 'true');
    }

    const resolve = this.confirmationState.resolve;
    this.confirmationState.resolve = null;
    resolve?.(accepted);
  }

  getBoardAlertDescriptor() {
    if (this.agreedDraw) {
      return {
        text: 'Draw',
        duration: 1800,
        state: `agreed:${this.moveHistory.length}:${this.chess.fen()}`
      };
    }

    if (this.clockState.flaggedColor) {
      return {
        text: 'Time',
        tone: 'danger',
        duration: 1800,
        state: `flag:${this.clockState.flaggedColor}:${this.moveHistory.length}:${this.chess.fen()}`
      };
    }

    if (this.chess.isCheckmate()) {
      return {
        text: 'Checkmate',
        tone: 'danger',
        duration: 2200,
        state: `checkmate:${this.moveHistory.length}:${this.chess.fen()}`
      };
    }

    if (this.chess.isDraw()) {
      return {
        text: 'Draw',
        duration: 1800,
        state: `draw:${this.moveHistory.length}:${this.chess.fen()}`
      };
    }

    if (this.chess.inCheck()) {
      return {
        text: 'Check',
        tone: 'danger',
        duration: 1600,
        state: `check:${this.moveHistory.length}:${this.chess.fen()}`
      };
    }

    return null;
  }

  presentBoardAlert({ force = false } = {}) {
    const alert = this.getBoardAlertDescriptor();
    if (!alert) {
      return;
    }

    const dedupeKey = `board:${alert.tone || 'default'}:${alert.text}:${alert.state}`;
    if (!force && this.lastBoardAlertKey === dedupeKey) {
      return;
    }

    this.lastBoardAlertKey = dedupeKey;
    this.showEventBanner(alert.text, {
      tone: alert.tone || 'default',
      duration: alert.duration,
      dedupeKey
    });
  }

  showTemporaryStatus(message, duration = 1200) {
    if (!this.status.stateLabel) {
      return;
    }

    window.clearTimeout(this.statusOverrideTimeout);
    this.status.stateLabel.textContent = message;
    this.statusOverrideTimeout = window.setTimeout(() => {
      this.updateStatus(this.lastMoveText);
    }, duration);
  }

  shakeRestrictedMove(elements = [this.boardFrame, this.statusCard]) {
    elements.filter(Boolean).forEach((element) => {
      element.classList.remove('is-shaking');
      void element.offsetWidth;
      element.classList.add('is-shaking');
      window.setTimeout(() => {
        element.classList.remove('is-shaking');
      }, 460);
    });
  }

  showDrawRejectedFeedback(message = 'Draw offer declined.') {
    this.showTemporaryStatus(message, 1700);
    this.showEventBanner('Draw Rejected', { tone: 'danger', duration: 1700 });
  }

  showUndoRejectedFeedback(message = 'Undo request declined.') {
    this.showTemporaryStatus(message, 1700);
    this.showEventBanner('Undo Rejected', { tone: 'danger', duration: 1700 });
  }

  getUndoCountForCurrentState() {
    if (this.moveHistory.length === 0) {
      return 0;
    }

    return this.gameMode === GAME_MODES.ai && this.moveHistory[this.moveHistory.length - 1]?.source === 'ai'
      ? 2
      : 1;
  }

  async handleUndoButtonClick() {
    if (this.controls.undoButton.disabled) {
      return;
    }

    if (this.gameMode === GAME_MODES.online) {
      const confirmed = await this.requestConfirmation({
        title: 'Request Undo?',
        message: 'Send an undo request to your opponent? The move will only be taken back if they accept.',
        confirmLabel: 'Request Undo'
      });
      if (!confirmed) {
        return;
      }
    }

    if (this.gameMode === GAME_MODES.ai) {
      const confirmed = await this.requestConfirmation({
        title: 'Request Undo?',
        message: 'Ask the AI to approve taking back the last move or turn?',
        confirmLabel: 'Request Undo'
      });
      if (!confirmed) {
        return;
      }
    }

    this.undoMove();
  }

  getDrawActionUnavailableMessage() {
    if (this.replayState.active) {
      return 'Exit replay before offering a draw.';
    }
    if (this.isPuzzleVariant()) {
      return 'Draw offers are not available in puzzle modes.';
    }
    if (this.customEditMode) {
      return 'Finish custom board editing before offering a draw.';
    }
    if (this.isAnimating) {
      return 'Wait for the current move animation to finish.';
    }
    if (this.pendingPromotion) {
      return 'Choose a promotion piece before offering a draw.';
    }
    if (this.onlineSubmitting) {
      return 'An online request is already in progress.';
    }
    if (this.agreedDraw) {
      return 'This match is already drawn by agreement.';
    }
    if (this.drawState.pending) {
      return this.drawState.canRespond
        ? 'Answer the pending draw offer first.'
        : 'Draw offer already sent. Waiting for approval.';
    }
    if (this.onlineRematchState.pending) {
      return 'Resolve the pending rematch request first.';
    }
    if (this.onlineUndoState.pending) {
      return this.onlineUndoState.canRespond
        ? 'Answer the pending undo request first.'
        : 'Undo request is waiting for approval.';
    }
    if (this.clockState.flaggedColor) {
      return 'The clock has already expired.';
    }
    if (this.chess.isGameOver()) {
      return 'The game is already finished.';
    }
    if (this.gameMode !== GAME_MODES.online && !this.manualMatchStarted) {
      return 'Press Start Game before offering a draw.';
    }
    if (this.gameMode === GAME_MODES.online) {
      if (!this.onlineRoomId) {
        return 'Create or join an online room before offering a draw.';
      }
      if (!this.onlineReady) {
        return 'Wait for the opponent to join before offering a draw.';
      }
      if (!this.onlineConnected) {
        return 'Reconnect to the match server before offering a draw.';
      }
      if (!this.onlineMatchStarted) {
        return this.onlinePlayerColor && this.onlineStartedPlayers[this.onlinePlayerColor]
          ? 'Waiting for your opponent to press Start Game.'
          : 'Press Start Game to begin the online match.';
      }
    }
    if (this.gameMode === GAME_MODES.ai && (this.aiThinking || this.chess.turn() !== this.humanColor)) {
      return 'Offer a draw on your turn, before the AI starts thinking.';
    }

    return '';
  }

  getQuitActionUnavailableMessage() {
    if (this.homeVisible) {
      return 'Close the home guide before quitting the match.';
    }
    if (this.isAnimating) {
      return 'Wait for the current move animation to finish.';
    }
    if (this.pendingPromotion) {
      return 'Choose a promotion piece before quitting.';
    }
    if (this.onlineSubmitting) {
      return 'An online request is already in progress.';
    }

    return '';
  }

  async handleDrawButtonClick() {
    const unavailableMessage = this.getDrawActionUnavailableMessage();
    if (unavailableMessage) {
      this.triggerRestrictedFeedback(unavailableMessage);
      return;
    }

    const confirmed = await this.requestConfirmation({
      title: 'Offer Draw?',
      message: this.gameMode === GAME_MODES.online
        ? 'Send a draw offer to your opponent? The match only ends if they accept.'
        : this.gameMode === GAME_MODES.ai
          ? 'Offer a draw to the AI? It may accept or reject based on the current position.'
          : 'Offer a draw? The match only ends if the other side accepts.',
      confirmLabel: 'Offer Draw'
    });

    if (confirmed) {
      await this.offerDraw();
    }
  }

  async handleReplayButtonClick() {
    if (this.replayState.active) {
      this.startReplayMatch();
      return;
    }

    if (this.controls.replayMatchButton.disabled) {
      return;
    }

    const confirmed = await this.requestConfirmation({
      title: 'Replay Last Match?',
      message: 'This loads the saved move list and switches the board into replay mode until you exit replay.',
      confirmLabel: 'Start Replay'
    });

    if (confirmed) {
      this.startReplayMatch();
    }
  }

  async handleAnalysisRematchClick() {
    if (this.gameMode !== GAME_MODES.online || !this.isMatchFinished()) {
      return;
    }

    const confirmed = await this.requestConfirmation({
      title: 'Request Rematch?',
      message: 'Ask your online opponent to start a fresh game in the same room?',
      confirmLabel: 'Request Rematch'
    });

    if (!confirmed) {
      return;
    }

    await this.requestOnlineRematch();
  }

  async handleRestartButtonClick() {
    if (this.controls.restartButton.disabled) {
      return;
    }

    const needsConfirmation = this.hasMatchStarted()
      || this.replayState.active
      || this.savedReplayMoves.length > 0
      || Boolean(this.onlineRoomId);

    if (!needsConfirmation) {
      this.restartGame();
      return;
    }

    const confirmed = await this.requestConfirmation({
      title: 'Start New Game?',
      message: 'This resets the current board and overwrites the saved match snapshot for this session.',
      confirmLabel: 'New Game'
    });

    if (confirmed) {
      this.restartGame();
    }
  }

  async handleQuitButtonClick() {
    const unavailableMessage = this.getQuitActionUnavailableMessage();
    if (unavailableMessage) {
      this.triggerRestrictedFeedback(unavailableMessage);
      return;
    }

    const message = this.replayState.active
      ? 'Exit replay mode and reset the board to a fresh match?'
      : this.gameMode === GAME_MODES.online
        ? 'Leave the live room and reset the board to a fresh local match?'
        : this.gameMode === GAME_MODES.ai
          ? 'Stop the current AI match and reset the board?'
          : 'Quit the current match and reset the board?';

    const confirmed = await this.requestConfirmation({
      title: 'Quit Current Match?',
      message,
      confirmLabel: 'Quit Match'
    });

    if (!confirmed) {
      return;
    }

    await this.quitCurrentGame();
  }

  async quitCurrentGame() {
    this.hideGameAnalysis();
    this.hideEventBanner();
    this.hideMatchIntro({ immediate: true });
    this.stopReplayPlayback();
    this.replayState.active = false;
    this.replayState.playing = false;
    this.replayState.moveIndex = 0;
    this.replayState.moves = [];
    this.replayState.snapshot = null;
    this.cancelAIMove();
    this.clearSelection();
    this.closePromotion(true);
    this.resetDrawState();
    this.resetOnlineUndoState();
    this.resetOnlineRematchState();
    this.clearPersistedMatch();
    this.postGameReviewState.review = null;
    this.postGameReviewState.signature = null;
    this.postGameReviewState.loading = false;
    this.analysisState.signature = null;
    this.analysisState.visible = false;
    this.aiEvaluationState = {
      loading: false,
      label: 'Waiting for position',
      whitePerspective: null,
      lines: [],
      requestId: this.aiEvaluationState.requestId + 1
    };
    this.aiBookMessage = `${AI_STYLE_PROFILES[this.aiStyle]?.label || 'Balanced'} opening plan ready`;
    this.agreedDraw = false;
    this.activePuzzle = null;
    this.customEditMode = false;
    this.variantMode = VARIANT_MODES.classic;
    this.selectedGameMode = GAME_MODES.local;

    if (this.gameMode === GAME_MODES.online || this.onlineRoomId) {
      await this.leaveOnlineRoom({ silent: true, resetBoard: false });
    } else {
      this.resetOnlineState({ preserveClient: false });
      this.clearOnlineSeat();
    }
    this.controls.roomInput.value = '';

    this.gameMode = GAME_MODES.local;
    this.manualMatchStarted = false;
    this.aiStatusMessage = this.describeAIModeStatus();
    this.loadPositionFromFen(initialFen(), {
      message: 'Opening position',
      preserveSavedReplayMoves: false,
      preserveReplayState: false
    });
    this.setHomeVisible(false);
    this.resetView({ animate: true, color: 'w' });
    this.updateUiState();
  }

  getInteractionLockMessage() {
    if (this.agreedDraw) {
      return 'The match has already been drawn by agreement.';
    }

    if (this.chess.isGameOver()) {
      return 'The game is already finished.';
    }

    if (this.clockState.flaggedColor) {
      return 'The clock has already expired.';
    }

    if (this.drawState.pending) {
      return this.drawState.canRespond
        ? 'Answer the draw offer first.'
        : 'Draw offer is waiting for approval.';
    }

    if (this.gameMode !== GAME_MODES.online && !this.manualMatchStarted) {
      return 'Press Start Game to begin the match.';
    }

    if (this.gameMode === GAME_MODES.ai) {
      if (this.aiThinking) {
        return 'Stockfish is thinking.';
      }
      if (this.chess.turn() !== this.humanColor) {
        return 'It is the AI turn.';
      }
    }

    if (this.isPuzzleVariant()) {
      if (this.puzzleState.solved) {
        return 'This puzzle is already solved.';
      }
      if (this.puzzleState.autoReplyPending) {
        return 'The puzzle reply is being played.';
      }
      const playerColor = this.activePuzzle?.fen?.split(' ')[1] || 'w';
      if (this.chess.turn() !== playerColor) {
        return 'Wait for the puzzle sequence to continue.';
      }
    }

    if (this.gameMode === GAME_MODES.online) {
      if (this.publicMatchmakingState.active) {
        return 'Public matchmaking is still searching.';
      }
      if (this.drawState.pending) {
        return this.drawState.canRespond
          ? 'Answer the draw offer first.'
          : 'Draw offer is waiting for approval.';
      }
      if (this.onlineUndoState.pending) {
        return this.onlineUndoState.canRespond
          ? 'Answer the undo request first.'
          : 'Undo request is waiting for approval.';
      }
      if (!this.onlineRoomId) {
        return 'Create or join an online room first.';
      }
      if (!this.onlineReady) {
        return 'Waiting for the other player.';
      }
      if (!this.onlineConnected) {
        return 'Connection lost.';
      }
      if (!this.onlineMatchStarted) {
        return this.onlinePlayerColor && this.onlineStartedPlayers[this.onlinePlayerColor]
          ? 'Waiting for your opponent to press Start Game.'
          : 'Press Start Game to begin the room match.';
      }
      if (this.onlineMatchPhase !== 'playing') {
        return 'The VS intro is still preparing the match.';
      }
      if (this.chess.turn() !== this.onlinePlayerColor) {
        return 'It is your opponent turn.';
      }
    }

    if (this.gameMode === GAME_MODES.ai && this.onlineUndoState.pending) {
      return 'Undo request is waiting for the AI approval.';
    }

    return 'That move is restricted right now.';
  }

  triggerRestrictedFeedback(message = 'That move is restricted right now.', elements) {
    this.audio.playBlocked();
    this.showTemporaryStatus(message);
    this.shakeRestrictedMove(elements);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize());
    this.canvas.addEventListener('contextmenu', (event) => event.preventDefault());
    this.canvas.addEventListener('pointermove', (event) => this.onPointerMove(event));
    this.canvas.addEventListener('pointerleave', () => this.onPointerLeave());
    this.canvas.addEventListener('pointerdown', () => {
      this.markInteraction();
      this.audio.unlock();
    });
    this.canvas.addEventListener('wheel', () => this.markInteraction(), { passive: true });
    this.canvas.addEventListener('click', (event) => this.onClick(event));

    this.controls.undoButton.addEventListener('click', () => {
      void this.handleUndoButtonClick();
    });
    this.controls.drawButton.addEventListener('click', () => {
      void this.handleDrawButtonClick();
    });
    this.controls.cinematicCameraButton.addEventListener('click', () => {
      this.setCinematicCameraEnabled(!this.cinematicCameraEnabled);
    });
    this.controls.resetViewButton.addEventListener('click', () => this.resetView());
    this.controls.restartButton.addEventListener('click', () => {
      void this.handleRestartButtonClick();
    });
    this.controls.quitButton.addEventListener('click', () => {
      void this.handleQuitButtonClick();
    });
    this.controls.replayMatchButton.addEventListener('click', () => {
      void this.handleReplayButtonClick();
    });
    this.controls.matchPanelToggleButton?.addEventListener('click', () => {
      this.setMatchPanelOpen(!this.matchPanelOpen);
    });
    this.panels.matchActionsPanel?.addEventListener('click', (event) => {
      if (event.target instanceof HTMLElement && event.target.closest('button') && this.isCompactMatchOverlay()) {
        this.setMatchPanelOpen(false);
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.matchPanelOpen) {
        this.setMatchPanelOpen(false);
      }
    });
    this.controls.replayPrevButton.addEventListener('click', () => {
      this.stopReplayPlayback();
      this.stepReplayBackward();
    });
    this.controls.replayPlayButton.addEventListener('click', () => this.toggleReplayPlayback());
    this.controls.replayNextButton.addEventListener('click', () => {
      this.stopReplayPlayback();
      this.stepReplayForward();
    });
    this.controls.replayExitButton.addEventListener('click', () => this.exitReplayMode());
    this.controls.hudToggleButton.addEventListener('click', () => {
      this.setHudCollapsed(!this.hudCollapsed);
    });
    this.controls.localModeButton.addEventListener('click', () => {
      this.selectGameMode(GAME_MODES.local);
    });
    this.controls.aiModeButton.addEventListener('click', () => {
      this.selectGameMode(GAME_MODES.ai);
    });
    this.controls.onlineModeButton.addEventListener('click', () => {
      this.selectGameMode(GAME_MODES.online);
    });
    this.controls.classicVariantButton.addEventListener('click', () => {
      void this.setVariantMode(VARIANT_MODES.classic);
    });
    this.controls.blitzVariantButton.addEventListener('click', () => {
      void this.setVariantMode(VARIANT_MODES.blitz);
    });
    this.controls.puzzleVariantButton.addEventListener('click', () => {
      void this.setVariantMode(VARIANT_MODES.puzzle);
    });
    this.controls.dailyVariantButton.addEventListener('click', () => {
      void this.setVariantMode(VARIANT_MODES.daily);
    });
    this.controls.customVariantButton.addEventListener('click', () => {
      void this.setVariantMode(VARIANT_MODES.custom);
    });
    this.controls.onlineAutoColorButton.addEventListener('click', () => this.setOnlineColorPreference('auto'));
    this.controls.onlineWhiteColorButton.addEventListener('click', () => this.setOnlineColorPreference('w'));
    this.controls.onlineBlackColorButton.addEventListener('click', () => this.setOnlineColorPreference('b'));
    this.controls.aiBeginnerButton.addEventListener('click', () => this.setAIDifficulty('beginner'));
    this.controls.aiEasyButton.addEventListener('click', () => this.setAIDifficulty('easy'));
    this.controls.aiMediumButton.addEventListener('click', () => this.setAIDifficulty('medium'));
    this.controls.aiHardButton.addEventListener('click', () => this.setAIDifficulty('hard'));
    this.controls.aiMasterButton.addEventListener('click', () => this.setAIDifficulty('master'));
    this.controls.aiBalancedStyleButton.addEventListener('click', () => this.setAIStyle('balanced'));
    this.controls.aiAggressiveStyleButton.addEventListener('click', () => this.setAIStyle('aggressive'));
    this.controls.aiSolidStyleButton.addEventListener('click', () => this.setAIStyle('solid'));
    this.controls.aiTrickyStyleButton.addEventListener('click', () => this.setAIStyle('tricky'));
    this.controls.themeIvoryButton.addEventListener('click', () => this.setTheme('ivory'));
    this.controls.themeMidnightButton.addEventListener('click', () => this.setTheme('midnight'));
    this.controls.themeRegalButton.addEventListener('click', () => this.setTheme('regal'));
    this.controls.blitz1Button.addEventListener('click', () => this.setBlitzPreset('1'));
    this.controls.blitz3Button.addEventListener('click', () => this.setBlitzPreset('3'));
    this.controls.blitz5Button.addEventListener('click', () => this.setBlitzPreset('5'));
    this.controls.puzzleAllButton.addEventListener('click', () => this.setPuzzleDifficulty('all'));
    this.controls.puzzleEasyButton.addEventListener('click', () => this.setPuzzleDifficulty('easy'));
    this.controls.puzzleMediumButton.addEventListener('click', () => this.setPuzzleDifficulty('medium'));
    this.controls.puzzleHardButton.addEventListener('click', () => this.setPuzzleDifficulty('hard'));
    this.controls.nextPuzzleButton.addEventListener('click', () => this.nextPuzzle());
    this.controls.resetPuzzleButton.addEventListener('click', () => this.resetPuzzle());
    this.controls.hintPuzzleButton.addEventListener('click', () => this.showPuzzleHint());
    this.controls.loadDailyButton.addEventListener('click', () => {
      void this.setVariantMode(VARIANT_MODES.daily);
    });
    this.controls.dailyResetButton.addEventListener('click', () => this.resetPuzzle());
    this.controls.hintDailyButton.addEventListener('click', () => this.showPuzzleHint());
    this.controls.customWhiteButton.addEventListener('click', () => this.setCustomPieceColor('w'));
    this.controls.customBlackButton.addEventListener('click', () => this.setCustomPieceColor('b'));
    this.controls.customKingButton.addEventListener('click', () => this.setCustomPieceType('k'));
    this.controls.customQueenButton.addEventListener('click', () => this.setCustomPieceType('q'));
    this.controls.customRookButton.addEventListener('click', () => this.setCustomPieceType('r'));
    this.controls.customBishopButton.addEventListener('click', () => this.setCustomPieceType('b'));
    this.controls.customKnightButton.addEventListener('click', () => this.setCustomPieceType('n'));
    this.controls.customPawnButton.addEventListener('click', () => this.setCustomPieceType('p'));
    this.controls.customEraseButton.addEventListener('click', () => this.setCustomPieceType('erase'));
    this.controls.customToggleEditButton.addEventListener('click', () => this.toggleCustomEditMode());
    this.controls.customStartButton.addEventListener('click', () => this.startCustomMatch());
    this.controls.customClearButton.addEventListener('click', () => this.clearCustomBoard());
    this.controls.customStandardButton.addEventListener('click', () => this.loadStandardCustomSetup());
    this.controls.createRoomButton.addEventListener('click', () => {
      void this.createOnlineRoom();
    });
    this.controls.findPublicMatchButton?.addEventListener('click', () => {
      void this.startPublicMatchmaking();
    });
    this.controls.cancelPublicMatchmakingButton?.addEventListener('click', () => {
      void this.cancelPublicMatchmaking();
    });
    this.controls.copyRoomButton.addEventListener('click', () => {
      void this.copyRoomId();
    });
    this.controls.joinRoomButton.addEventListener('click', () => {
      void this.joinOnlineRoom();
    });
    this.controls.reconnectRoomButton.addEventListener('click', () => {
      void this.attemptOnlineReconnect();
    });
    this.controls.leaveRoomButton.addEventListener('click', () => {
      void this.leaveOnlineRoom();
    });
    this.controls.acceptUndoButton.addEventListener('click', () => {
      void this.respondToUndoRequest(true);
    });
    this.controls.declineUndoButton.addEventListener('click', () => {
      void this.respondToUndoRequest(false);
    });
    this.controls.acceptRematchButton.addEventListener('click', () => {
      void this.respondToRematchRequest(true);
    });
    this.controls.declineRematchButton.addEventListener('click', () => {
      void this.respondToRematchRequest(false);
    });
    this.controls.acceptDrawButton.addEventListener('click', () => {
      void this.respondToDrawOffer(true);
    });
    this.controls.declineDrawButton.addEventListener('click', () => {
      void this.respondToDrawOffer(false);
    });
    this.controls.startGameButton.addEventListener('click', () => {
      void this.startSelectedGame();
    });
    this.controls.playerNameInput?.addEventListener('input', (event) => {
      this.setPlayerName(event.currentTarget.value, { persist: true });
    });
    this.controls.playerNameInput?.addEventListener('blur', () => {
      this.refreshPlayerIdentity(true);
    });
    this.controls.openHomeGuideButton.addEventListener('click', () => {
      this.setHomeVisible(true);
    });
    this.controls.homeEnterButton.addEventListener('click', () => {
      this.setHomeVisible(false);
    });
    this.controls.homeStartButton.addEventListener('click', () => {
      void this.startSelectedGame({ fromHome: true });
    });
    this.panels.matchIntroOverlay?.addEventListener('click', (event) => {
      event.preventDefault();
    });
    this.controls.analysisCloseButton.addEventListener('click', () => {
      this.hideGameAnalysis();
    });
    this.controls.analysisReplayButton.addEventListener('click', () => {
      this.hideGameAnalysis();
      this.startReplayMatch();
    });
    this.controls.analysisRematchButton.addEventListener('click', () => {
      void this.handleAnalysisRematchClick();
    });
    this.controls.analysisNewGameButton.addEventListener('click', () => {
      this.hideGameAnalysis();
      if (this.gameMode === GAME_MODES.online) {
        this.selectGameMode(GAME_MODES.local);
        void this.setGameMode(GAME_MODES.local);
        return;
      }
      this.restartGame();
    });
    this.controls.confirmationCancelButton.addEventListener('click', () => {
      this.closeConfirmation(false);
    });
    this.controls.confirmationConfirmButton.addEventListener('click', () => {
      this.closeConfirmation(true);
    });
    this.panels.confirmationOverlay?.addEventListener('click', (event) => {
      if (event.target === this.panels.confirmationOverlay) {
        this.closeConfirmation(false);
      }
    });
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isConfirmationOpen()) {
        this.closeConfirmation(false);
      }
    });
    this.controls.roomInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        void this.joinOnlineRoom();
      }
    });
  }

  prepareOnlineClient() {
    if (this.onlineClient) {
      return this.onlineClient;
    }

    this.onlineClient = new OnlineGameClient(DEFAULT_SOCKET_SERVER_URL);
    this.onlineClient.addEventListener('connection', (event) => {
      if (this.gameMode !== GAME_MODES.online) {
        return;
      }

      this.onlineConnected = event.detail.connected;
      this.onlineConnectionMessage = event.detail.message;
      if (!event.detail.connected) {
        this.onlineReady = false;
        this.onlineReconnectMessage = this.onlineRoomId
          ? 'Connection lost - saved seat waiting to reconnect'
          : 'Room persistence standby';
      }
      this.updateUiState();
    });

    this.onlineClient.addEventListener('roomState', (event) => {
      if (this.gameMode !== GAME_MODES.online) {
        return;
      }

      this.syncOnlinePlayerNames(event.detail);
      this.syncOnlineMatchType(event.detail);
      const wasMatchStarted = this.onlineMatchStarted;
      if (event.detail.roomId) {
        this.onlineRoomId = event.detail.roomId;
      }
      if (event.detail.color) {
        this.onlinePlayerColor = event.detail.color;
      }
      this.syncOnlineStartState(event.detail);
      if (this.isPublicOnlineMatch() && event.detail.status) {
        this.setOnlineMatchPhase(event.detail.status === 'intro' ? 'intro' : 'playing');
      }
      this.onlineReady = Boolean(event.detail.ready && event.detail.bothConnected !== false);
      if (event.detail.undoPending === false && this.onlineUndoState.pending) {
        this.resetOnlineUndoState();
      }
      if (event.detail.rematchPending === false && this.onlineRematchState.pending) {
        this.resetOnlineRematchState();
      }
      if (event.detail.drawPending === false && this.drawState.pending && this.drawState.mode === GAME_MODES.online) {
        this.resetDrawState();
      }
      this.onlineReconnectMessage = event.detail.bothConnected === false
        ? this.onlineMatchStarted
          ? 'Room live, waiting for full reconnect'
          : 'Seat synchronized - waiting for reconnect'
        : this.onlinePlayerToken
          ? 'Saved seat synchronized'
          : 'Room persistence standby';
      this.persistOnlineSeat();
      if (event.detail.state?.result === 'draw' && event.detail.state?.reason === 'agreement' && !this.agreedDraw) {
        this.scheduleDeferredAction(() => {
          this.finalizeAgreedDraw('Draw agreed by both players.');
        });
      }
      if (event.detail.message && !this.shouldSuppressRoomStateMessage(event.detail.message)) {
        this.onlineStatusMessage = event.detail.message;
      }
      if (!wasMatchStarted && this.onlineMatchStarted) {
        this.maybeShowOnlineMatchIntro({ source: 'room-live' });
      }
      this.updateStatus(this.lastMoveText);
      this.updateUiState();
    });

    this.onlineClient.addEventListener('playerPresence', (event) => {
      if (this.gameMode !== GAME_MODES.online) {
        return;
      }

      this.syncOnlinePlayerNames(event.detail);
      if (event.detail.color && event.detail.color !== this.onlinePlayerColor) {
        this.onlineReady = Boolean(this.onlineConnected && event.detail.connected);
      }
      this.onlineStatusMessage = event.detail.message || (event.detail.connected ? 'Opponent reconnected.' : 'Opponent disconnected.');
      this.onlineReconnectMessage = event.detail.connected
        ? this.onlineMatchStarted
          ? 'Room live again'
          : 'Both seats connected'
        : 'Reconnect window active';
      this.updateStatus(this.lastMoveText);
      this.updateUiState();
    });

    this.onlineClient.addEventListener('playerJoined', (event) => {
      if (this.gameMode !== GAME_MODES.online) {
        return;
      }

      this.syncOnlinePlayerNames(event.detail);
      this.syncOnlineMatchType(event.detail);
      this.syncOnlineStartState(event.detail);
      if (event.detail.color) {
        this.onlinePlayerColor = event.detail.color;
      }
      this.onlineReady = true;
      this.onlineStatusMessage = event.detail.message || 'Opponent connected. Press Start Game to begin.';
      this.onlineReconnectMessage = 'Both seats connected - waiting to start';
      this.updateStatus(this.lastMoveText);
      this.updateUiState();
    });

    this.onlineClient.addEventListener('publicMatchmakingStatus', (event) => {
      if (this.gameMode !== GAME_MODES.online) {
        return;
      }

      this.updateMatchmakingOverlay(event.detail);
      this.onlineStatusMessage = event.detail.message || this.onlineStatusMessage;
      this.updateUiState();
    });

    this.onlineClient.addEventListener('publicMatchFound', (event) => {
      this.handlePublicMatchFound(event.detail);
    });

    this.onlineClient.addEventListener('publicBotMatchFound', (event) => {
      this.handlePublicMatchFound(event.detail);
    });

    this.onlineClient.addEventListener('undoRequested', (event) => {
      if (this.gameMode !== GAME_MODES.online) {
        return;
      }

      this.onlineUndoState = {
        pending: true,
        canRespond: Boolean(event.detail.canRespond),
        requestedBy: event.detail.requesterColor || null,
        mode: GAME_MODES.online,
        message: event.detail.message || 'Undo request pending.'
      };
      this.onlineStatusMessage = event.detail.message || 'Undo request pending.';
      this.updateStatus(this.lastMoveText);
      this.updateUiState();
    });

    this.onlineClient.addEventListener('undoResolved', (event) => {
      if (this.gameMode !== GAME_MODES.online) {
        return;
      }

      this.resetOnlineUndoState();
      const message = event.detail.message || 'Undo request declined.';
      this.suppressRoomStateMessage(message);
      this.onlineStatusMessage = this.getOnlineLiveStatusMessage();
      if (/declin|reject/i.test(message)) {
        this.showUndoRejectedFeedback(message);
      }
      this.updateStatus(this.lastMoveText);
      this.updateUiState();
    });

    this.onlineClient.addEventListener('undoApplied', (event) => {
      if (this.gameMode !== GAME_MODES.online) {
        return;
      }

      this.resetOnlineUndoState();
      this.suppressRoomStateMessage('Undo applied.');
      this.onlineStatusMessage = this.getOnlineLiveStatusMessage();
      this.scheduleDeferredAction(() => {
        const undone = this.undoSingleMove();
        if (!undone && event.detail.fen) {
          this.loadPositionFromFen(event.detail.fen, { message: event.detail.message || 'Undo applied.' });
          return;
        }
        this.updateUiState();
      });
    });

    this.onlineClient.addEventListener('drawRequested', (event) => {
      if (this.gameMode !== GAME_MODES.online) {
        return;
      }

      this.drawState = {
        pending: true,
        canRespond: Boolean(event.detail.canRespond),
        requestedBy: event.detail.requesterColor || null,
        mode: GAME_MODES.online,
        message: event.detail.message || 'Draw offer pending.'
      };
      this.onlineStatusMessage = event.detail.message || 'Draw offer pending.';
      this.updateStatus(this.lastMoveText);
      this.updateUiState();
    });

    this.onlineClient.addEventListener('drawResolved', (event) => {
      if (this.gameMode !== GAME_MODES.online) {
        return;
      }

      this.resetDrawState();
      const message = event.detail.message || 'Draw offer declined.';
      this.suppressRoomStateMessage(message);
      this.onlineStatusMessage = this.getOnlineLiveStatusMessage();
      if (/declin|reject/i.test(message)) {
        this.showDrawRejectedFeedback(message);
      }
      this.updateStatus(this.lastMoveText);
      this.updateUiState();
    });

    this.onlineClient.addEventListener('drawAccepted', (event) => {
      if (this.gameMode !== GAME_MODES.online) {
        return;
      }

      this.resetDrawState();
      this.suppressRoomStateMessage(event.detail.message || 'Draw agreed.');
      this.onlineStatusMessage = 'Match complete';
      this.scheduleDeferredAction(() => {
        this.finalizeAgreedDraw(event.detail.message || 'Draw agreed.');
      });
    });

    this.onlineClient.addEventListener('rematchRequested', (event) => {
      if (this.gameMode !== GAME_MODES.online) {
        return;
      }

      this.onlineRematchState = {
        pending: true,
        canRespond: Boolean(event.detail.canRespond),
        requestedBy: event.detail.requesterColor || null,
        message: event.detail.message || 'Rematch request pending.'
      };
      this.onlineStatusMessage = event.detail.message || 'Rematch request pending.';
      this.updateUiState();
    });

    this.onlineClient.addEventListener('rematchResolved', (event) => {
      if (this.gameMode !== GAME_MODES.online) {
        return;
      }

      this.resetOnlineRematchState();
      this.onlineStatusMessage = event.detail.message || 'Rematch declined.';
      this.showTemporaryStatus(this.onlineStatusMessage, 1800);
      this.updateUiState();
    });

    this.onlineClient.addEventListener('rematchStarted', (event) => {
      if (this.gameMode !== GAME_MODES.online) {
        return;
      }

      this.syncOnlineStartState(event.detail);
      this.resetOnlineRematchState();
      this.resetDrawState();
      this.resetOnlineUndoState();
      this.onlineReady = true;
      this.onlineStatusMessage = event.detail.message || 'Rematch started.';
      if (event.detail.fen) {
        this.loadPositionFromFen(event.detail.fen, { message: 'Opening position' });
      }
      this.resetView({ animate: true, color: this.onlinePlayerColor || 'w' });
      this.updateUiState();
    });

    this.onlineClient.addEventListener('opponentMove', (event) => {
      if (this.gameMode !== GAME_MODES.online) {
        return;
      }

      this.onlineStatusMessage = 'Opponent move received.';
      this.scheduleDeferredAction(() => {
        const applied = this.executeMove(normalizeMoveRequest(event.detail.move), { source: 'opponent' });
        if (!applied && event.detail.fen) {
          this.loadPositionFromFen(event.detail.fen, { message: 'Opponent move synchronized.' });
        }
        this.updateUiState();
      });
    });

    this.onlineClient.addEventListener('opponentLeft', (event) => {
      if (this.gameMode !== GAME_MODES.online) {
        return;
      }

      this.onlineReady = false;
      this.onlineMatchStarted = false;
      this.onlineRoomId = null;
      this.onlinePlayerColor = null;
      this.onlineStartedPlayers = {
        w: false,
        b: false
      };
      this.clearOnlineSeat();
      this.resetDrawState();
      this.resetOnlineRematchState();
      this.hideMatchIntro({ immediate: true });
      this.onlineStatusMessage = event.detail.message || 'Opponent left the room. You win.';
      this.onlineReconnectMessage = 'Saved seat cleared';
      this.showEventBanner('Opponent Left - You Win', { tone: 'success', duration: 2600 });
      this.updateStatus(this.lastMoveText);
      this.updateUiState();
    });

    this.onlineClient.addEventListener('gameOver', (event) => {
      if (this.gameMode !== GAME_MODES.online) {
        return;
      }

      if (event.detail.state?.result === 'draw' && (event.detail.reason === 'agreement' || event.detail.state?.reason === 'agreement')) {
        this.scheduleDeferredAction(() => {
          this.finalizeAgreedDraw('Draw agreed by both players.');
        });
        return;
      }

      if (event.detail.fen && this.chess.fen() !== event.detail.fen) {
        this.loadPositionFromFen(event.detail.fen, { message: this.lastMoveText });
      }
      this.hideMatchIntro({ immediate: true });
      this.onlineStatusMessage = event.detail.message || this.describeOnlineGameOver(event.detail.state, event.detail.reason);
      this.updateStatus(this.lastMoveText);
      this.updateUiState();
    });

    this.onlineClient.addEventListener('serverError', (event) => {
      if (this.gameMode !== GAME_MODES.online) {
        return;
      }

      this.onlineStatusMessage = event.detail.message || 'Server error.';
      this.updateUiState();
    });

    return this.onlineClient;
  }

  async startPublicMatchmaking() {
    if (this.selectedGameMode !== GAME_MODES.online) {
      this.selectGameMode(GAME_MODES.online);
    }

    if (this.gameMode !== GAME_MODES.online) {
      await this.setGameMode(GAME_MODES.online);
    }

    if (this.onlineRoomId || this.publicMatchmakingState.active) {
      this.triggerRestrictedFeedback('Leave the current room before searching for a public match.');
      return;
    }

    this.cancelAIMove();
    this.hideGameAnalysis();
    this.clearSelection();
    this.resetOnlineUndoState();
    this.resetDrawState();
    this.onlineMatchType = ONLINE_MATCH_TYPES.publicMatchmaking;
    this.onlineOpponentType = 'human';
    this.onlineSubmitting = true;
    this.onlineStatusMessage = 'Searching for a public match...';
    this.showMatchmakingOverlay({
      phase: 'searching',
      message: 'Searching for a worthy opponent...'
    });
    this.updateUiState();

    try {
      const client = this.prepareOnlineClient();
      await client.joinPublicMatchmaking({
        playerName: this.playerName,
        preferredColor: this.onlineColorPreference
      });
      this.onlineConnected = true;
      if (!this.onlineRoomId && this.publicMatchmakingState.active) {
        this.onlineConnectionMessage = 'Public queue connected';
        this.onlineReconnectMessage = 'Public matchmaking active';
        this.onlineStatusMessage = 'Looking for public match...';
      }
    } catch (error) {
      this.hideMatchmakingOverlay();
      this.onlineMatchType = ONLINE_MATCH_TYPES.room;
      this.onlineStatusMessage = error.message || 'Unable to start public matchmaking.';
      this.triggerRestrictedFeedback(this.onlineStatusMessage);
    } finally {
      this.onlineSubmitting = false;
      this.updateUiState();
    }
  }

  async cancelPublicMatchmaking() {
    if (!this.publicMatchmakingState.active) {
      return;
    }

    this.onlineSubmitting = true;
    this.updateMatchmakingOverlay({
      phase: 'cancelled',
      message: 'Cancelling public search...'
    });
    this.updateUiState();

    try {
      const client = this.prepareOnlineClient();
      await client.cancelPublicMatchmaking();
    } catch {
      // Queue cancellation can race with a match-found event; the server-side cleanup is best-effort.
    }

    if (this.onlineRoomId && this.onlineMatchStarted) {
      this.onlineSubmitting = false;
      this.updateUiState();
      return;
    }

    this.hideMatchmakingOverlay();
    this.onlineSubmitting = false;
    this.onlineMatchType = ONLINE_MATCH_TYPES.room;
    this.onlineStatusMessage = 'Public matchmaking cancelled.';
    this.onlineReconnectMessage = 'Room persistence standby';
    this.updateUiState();
  }

  handlePublicMatchFound(detail = {}) {
    if (!detail?.roomId) {
      return;
    }

    this.updateMatchmakingOverlay({
      phase: 'found',
      message: 'Match found!'
    });
    window.setTimeout(() => this.hideMatchmakingOverlay(), 420);
    this.gameMode = GAME_MODES.online;
    this.selectedGameMode = GAME_MODES.online;
    this.onlineConnected = true;
    this.onlineReady = true;
    this.onlineSubmitting = false;
    this.onlineRoomId = detail.roomId;
    this.onlinePlayerColor = detail.color;
    this.onlinePlayerToken = detail.playerToken || null;
    this.onlineMatchStarted = true;
    this.onlineMatchPhase = 'intro';
    this.onlineMatchType = detail.matchType || ONLINE_MATCH_TYPES.publicPvp;
    this.onlineOpponentType = detail.opponentType || 'human';
    this.collapsePlayPanelsForLiveMatch();
    this.publicIntroReadySent = false;
    this.onlineStartedPlayers = {
      w: true,
      b: true
    };
    this.syncOnlinePlayerNames(detail);
    this.onlineStatusMessage = detail.opponentType === 'bot'
      ? `${detail.opponentName || 'Bot'} joined as AI fill.`
      : 'Public opponent found.';
    this.onlineConnectionMessage = 'Public match connected';
    this.onlineReconnectMessage = detail.opponentType === 'bot'
      ? 'Server-side bot opponent'
      : 'Public PvP match';
    this.controls.roomInput.value = detail.roomId;
    this.clearOnlineSeat();
    if (detail.fen) {
      this.loadPositionFromFen(detail.fen, { message: 'Opening position' });
    }
    if (this.variantMode === VARIANT_MODES.classic) {
      this.clockState.initialSeconds = 5 * 60;
      this.clockState.remaining.w = this.clockState.initialSeconds;
      this.clockState.remaining.b = this.clockState.initialSeconds;
      this.refreshClockVisuals(true);
      this.updateTopTimerBadges();
    }
    this.resetView({ animate: true, color: detail.color || 'w' });
    this.refreshPlayerIdentity(true);
    this.maybeShowOnlineMatchIntro({ force: true, source: this.onlineMatchType });
    this.updateStatus(this.lastMoveText);
    this.updateUiState();
  }

  notifyPublicIntroComplete() {
    if (!this.isPublicOnlineMatch() || this.publicIntroReadySent || !this.onlineRoomId || !this.onlineClient) {
      return;
    }

    this.publicIntroReadySent = true;
    this.setOnlineMatchPhase('intro');
    this.onlineStatusMessage = 'Waiting for public match intro sync...';
    this.updateUiState();
    void this.onlineClient.markPublicIntroComplete(this.onlineRoomId).then((detail = {}) => {
      if (!this.isPublicOnlineMatch()) {
        return;
      }

      this.syncOnlineStartState(detail);
      if (detail.status) {
        this.setOnlineMatchPhase(detail.status === 'playing' ? 'playing' : 'intro');
      } else if (detail.playing) {
        this.setOnlineMatchPhase('playing');
      }
      this.onlineStatusMessage = detail.message || (detail.playing ? 'Public match live.' : 'Waiting for opponent intro.');
      this.updateStatus(this.lastMoveText);
      this.updateUiState();
    }).catch((error) => {
      this.publicIntroReadySent = false;
      this.onlineStatusMessage = error.message || 'Unable to start the public match.';
      this.updateUiState();
    });
  }

  async ensureAIService() {
    if (!this.aiService) {
      this.aiService = new StockfishService();
    }

    if (this.aiEngineReady) {
      return this.aiService;
    }

    this.aiStatusMessage = 'Starting Stockfish...';
    this.updateUiState();
    await this.aiService.initialize();
    this.aiEngineReady = true;
    this.aiStatusMessage = this.describeAIModeStatus();
    this.updateUiState();
    return this.aiService;
  }

  async setGameMode(mode, { reloadPosition = true } = {}) {
    if (this.gameMode === mode) {
      return;
    }

    if (mode !== GAME_MODES.local && this.isTrainingVariant()) {
      this.variantMode = VARIANT_MODES.classic;
      this.activePuzzle = null;
      this.customEditMode = false;
    }

    this.stopReplayPlayback();
    this.replayState.active = false;
    this.replayState.moveIndex = 0;
    this.replayState.moves = [];
    this.replayState.snapshot = null;

    if (this.gameMode === GAME_MODES.online) {
      await this.leaveOnlineRoom({ silent: true, resetBoard: false });
    }

    this.cancelAIMove();
    this.resetDrawState();
    this.clearSelection();
    this.gameMode = mode;
    this.selectedGameMode = mode;
    this.manualMatchStarted = false;

    if (mode === GAME_MODES.local) {
      this.resetOnlineState({ preserveClient: false });
      this.aiStatusMessage = 'Player controls White';
      if (reloadPosition) {
        this.clearPersistedMatch();
        this.loadPositionFromFen(this.getVariantBaseFen(), { message: this.getVariantStartMessage() });
      }
    }

    if (mode === GAME_MODES.ai) {
      this.resetOnlineState({ preserveClient: false });
      if (reloadPosition) {
        this.clearPersistedMatch();
        this.loadPositionFromFen(initialFen(), { message: 'Opening position' });
      }
      this.aiEvaluationState = {
        loading: false,
        label: 'Press Start Game',
        whitePerspective: null,
        lines: [],
        requestId: this.aiEvaluationState.requestId + 1
      };
      try {
        await this.ensureAIService();
      } catch (error) {
        this.aiStatusMessage = error.message || 'Unable to start the AI engine.';
      }
    }

    if (mode === GAME_MODES.online) {
      if (reloadPosition) {
        this.clearPersistedMatch();
        this.loadPositionFromFen(initialFen(), { message: 'Opening position' });
      }
      this.onlineMatchType = ONLINE_MATCH_TYPES.room;
      this.onlineOpponentType = 'human';
      this.publicIntroReadySent = false;
      this.onlineRoomId = this.onlineSession?.roomId || this.onlineRoomId;
      this.onlinePlayerColor = this.onlineSession?.color || this.onlinePlayerColor;
      this.onlinePlayerToken = this.onlineSession?.playerToken || this.onlinePlayerToken;
      this.onlineStatusMessage = this.onlinePlayerToken
        ? 'Saved online seat detected. Reconnect or create a new room.'
        : 'Create a room or join an existing match.';
      this.onlineConnectionMessage = this.onlinePlayerToken ? 'Saved seat available' : 'Connect when needed';
      this.onlineReconnectMessage = this.onlinePlayerToken ? 'Reconnect ready from saved seat' : 'Room persistence standby';
      this.onlineReady = false;
      this.controls.roomInput.value = this.onlineRoomId || '';
    }

    this.updateUiState();
  }

  resetOnlineState({ preserveClient = false } = {}) {
    if (!preserveClient && this.onlineClient) {
      this.onlineClient.destroy();
      this.onlineClient = null;
    }

    this.hideMatchIntro({ immediate: true });
    this.hideMatchmakingOverlay();
    this.onlineConnected = false;
    this.onlineReady = false;
    this.onlineSubmitting = false;
    this.onlineMatchStarted = false;
    this.onlineMatchPhase = 'waiting';
    this.onlineMatchType = ONLINE_MATCH_TYPES.room;
    this.onlineOpponentType = 'human';
    this.publicIntroReadySent = false;
    this.onlineRoomId = null;
    this.onlinePlayerColor = null;
    this.onlinePlayerNames = {
      w: null,
      b: null
    };
    this.onlineStartedPlayers = {
      w: false,
      b: false
    };
    this.onlineReconnectMessage = 'Room persistence standby';
    this.onlineStatusMessage = 'Create a room or join an existing match.';
    this.onlineConnectionMessage = 'Connect when needed';
    this.resetOnlineUndoState();
    this.resetOnlineRematchState();
    this.resetDrawState();
  }

  setAIDifficulty(difficulty) {
    if (!AI_DIFFICULTY_PROFILES[difficulty]) {
      return;
    }

    if (this.isAIDifficultyLocked()) {
      this.aiStatusMessage = 'AI difficulty is locked after the first move. Restart to change it.';
      this.triggerRestrictedFeedback(this.aiStatusMessage, [this.panels.aiPanel, this.statusCard]);
      this.updateUiState();
      return;
    }

    this.aiDifficulty = difficulty;
    this.aiBookMessage = `${AI_DIFFICULTY_PROFILES[difficulty].label} engine profile armed`;
    if (!this.aiThinking) {
      this.aiStatusMessage = this.describeAIModeStatus();
    }
    this.updateUiState();
    this.persistMatchState();
  }

  setAIStyle(style) {
    if (!AI_STYLE_PROFILES[style]) {
      return;
    }

    if (this.isAIDifficultyLocked()) {
      this.aiStatusMessage = 'AI style is locked after the first move. Restart to change it.';
      this.triggerRestrictedFeedback(this.aiStatusMessage, [this.panels.aiPanel, this.statusCard]);
      this.updateUiState();
      return;
    }

    this.aiStyle = style;
    this.aiBookMessage = `${AI_STYLE_PROFILES[style].label} opening plan ready`;
    if (!this.aiThinking) {
      this.aiStatusMessage = this.describeAIModeStatus();
    }
    this.updateUiState();
    this.persistMatchState();
  }

  describeAIModeStatus() {
    const profile = AI_DIFFICULTY_PROFILES[this.aiDifficulty];
    const styleLabel = AI_STYLE_PROFILES[this.aiStyle]?.label || 'Balanced';
    return this.isAIDifficultyLocked()
      ? `Player is White - ${profile.label} ${styleLabel} locked`
      : `Player is White - ${profile.label} ${styleLabel}`;
  }

  describeOnlineGameOver(state, reason) {
    if (!state) {
      return reason || 'Online game finished.';
    }

    const playerNames = this.getDisplayedPlayerNames(GAME_MODES.online);

    if (state.result === 'checkmate') {
      return `Checkmate - ${playerNames[state.winner] || COLOR_LABELS[state.winner]} wins`;
    }

    if (state.result === 'draw') {
      return reason === 'agreement' || state.reason === 'agreement'
        ? 'Draw by agreement'
        : 'Draw';
    }

    if (state.result === 'abandoned') {
      return reason || `${playerNames[state.winner] || 'You'} win by forfeit.`;
    }

    return reason || 'Online game finished.';
  }

  prepareBoardForPosition(
    {
      message = 'Opening position',
      preserveSavedReplayMoves = false,
      preserveReplayState = false
    } = {}
  ) {
    this.clearSelection();
    this.clearMoveMarkers();
    this.clearPieces();
    this.closePromotion(true);
    this.clearCameraCinematics();
    this.resetTimeScaleEffects();
    this.visualTime = 0;
    this.animations = [];
    this.deferredActions = [];
    this.moveHistory = [];
    this.lastBoardAlertKey = '';
    if (!preserveSavedReplayMoves) {
      this.savedReplayMoves = [];
    }
    this.lastMoveSquares = [];
    this.selectedSquare = null;
    this.validMoves = [];
    this.pendingPromotion = null;
    this.isAnimating = false;
    this.restartPending = false;
    this.pieceIdSeed = 0;
    this.hoveredSquare = null;
    this.hoveredPieceId = null;
    this.agreedDraw = false;
    this.focusTarget.set(0, 0.7, 0);
    this.focusBlend = 0.55;
    this.hoverIndicator.visible = false;
    this.selectionRing.visible = false;
    this.captureTrays.w.capturedPieces = [];
    this.captureTrays.b.capturedPieces = [];
    this.resetClockState();
    this.resetDrawState();
    this.resetOnlineRematchState();
    this.hideEventBanner();
    this.hideGameAnalysis();
    this.analysisState.signature = null;
    this.postGameReviewState.review = null;
    this.postGameReviewState.signature = null;
    this.postGameReviewState.loading = false;
    this.renderPostGameReview();
    this.stopReplayPlayback();
    if (!preserveReplayState) {
      this.replayState.active = false;
      this.replayState.moveIndex = 0;
      this.replayState.moves = [];
      this.replayState.snapshot = null;
    }

    if (message === 'Opening position') {
      this.hudAutoCollapsed = false;
      this.setHudCollapsed(false);
      this.resetOnlineUndoState();
      this.resetView({ animate: false });
      this.updateEvaluationBarVisual();
    }
  }

  rebuildPiecesFromChessState(message = 'Opening position') {
    for (let rank = 1; rank <= 8; rank += 1) {
      for (let file = 0; file < 8; file += 1) {
        const square = `${FILES[file]}${rank}`;
        const state = this.chess.get(square);
        if (!state) {
          continue;
        }

        const piece = createPiece({
          color: state.color,
          type: state.type,
          themeId: this.themeId,
          modelRoot: this.getPieceModelRoot(state.type)
        });

        piece.userData.pieceId = `piece-${this.pieceIdSeed += 1}`;
        piece.userData.square = square;
        piece.position.copy(squareToVector(square, piece.userData.baseY));
        this.scene.add(piece);

        this.pieceMeshes.push(piece);
        this.piecesBySquare.set(square, piece);
      }
    }

    this.lastMoveText = message;
    this.updateBoardHighlights();
    this.refreshClockVisuals(true);
    this.updateStatus(message);
    this.renderMoveHistory();
    this.updateUiState();
  }

  hydrateBoardFromCurrentState(
    {
      message = 'Opening position',
      preserveSavedReplayMoves = false,
      preserveReplayState = false
    } = {}
  ) {
    this.prepareBoardForPosition({
      message,
      preserveSavedReplayMoves,
      preserveReplayState
    });
    this.rebuildPiecesFromChessState(message);
  }

  loadPositionFromFen(
    fen,
    {
      message = 'Opening position',
      preserveSavedReplayMoves = false,
      preserveReplayState = false
    } = {}
  ) {
    this.prepareBoardForPosition({
      message,
      preserveSavedReplayMoves,
      preserveReplayState
    });

    try {
      this.chess.load(fen);
    } catch {
      this.chess.reset();
    }
    this.rebuildPiecesFromChessState(message);
  }

  clearPieces() {
    this.pieceMeshes.forEach((piece) => this.scene.remove(piece));
    this.pieceMeshes = [];
    this.piecesBySquare.clear();
  }

  restartGame({ autoStart = false } = {}) {
    this.stopReplayPlayback();
    if (this.replayState.active) {
      this.replayState.active = false;
      this.replayState.moveIndex = 0;
      this.replayState.moves = [];
      this.replayState.snapshot = null;
    }

    if (this.gameMode === GAME_MODES.online) {
      return;
    }

    this.cancelAIMove();
    if (this.isAnimating) {
      this.restartPending = true;
      return;
    }

    this.clearPersistedMatch();
    if (this.variantMode === VARIANT_MODES.puzzle || this.variantMode === VARIANT_MODES.daily) {
      this.resetPuzzle();
    } else if (this.variantMode === VARIANT_MODES.custom) {
      this.customEditMode = false;
      this.loadPositionFromFen(this.customSetupFen || initialFen(), { message: 'Custom match ready' });
    } else {
      this.loadPositionFromFen(this.getVariantBaseFen(), { message: this.getVariantStartMessage() });
    }
    this.manualMatchStarted = autoStart;
    if (this.manualMatchStarted) {
      this.collapsePlayPanelsForLiveMatch();
    }
    if (this.gameMode === GAME_MODES.ai) {
      this.aiStatusMessage = this.describeAIModeStatus();
      this.aiBookMessage = `${AI_STYLE_PROFILES[this.aiStyle]?.label || 'Balanced'} opening plan ready`;
      if (this.manualMatchStarted) {
        void this.refreshAIEvaluation();
      } else {
        this.aiEvaluationState = {
          loading: false,
          label: 'Press Start Game',
          whitePerspective: null,
          lines: [],
          requestId: this.aiEvaluationState.requestId + 1
        };
      }
    }
    this.updateStatus(this.lastMoveText);
    this.updateUiState();
    this.persistMatchState();
  }

  undoMove() {
    if (this.pendingPromotion || this.isAnimating || this.replayState.active || this.agreedDraw || this.drawState.pending || this.onlineUndoState.pending) {
      return;
    }

    if (this.gameMode === GAME_MODES.online) {
      void this.requestOnlineUndo();
      return;
    }

    if (this.gameMode === GAME_MODES.ai) {
      void this.requestAIUndo();
      return;
    }

    if (this.isPuzzleVariant() || this.customEditMode || this.moveHistory.length === 0) {
      return;
    }

    const undoCount = this.getUndoCountForCurrentState();

    for (let index = 0; index < undoCount; index += 1) {
      if (!this.undoSingleMove()) {
        break;
      }
    }
    this.updateUiState();
  }

  undoSingleMove() {
    return this.performUndoMove();
  }

  async requestAIUndo() {
    if (this.gameMode !== GAME_MODES.ai) {
      return;
    }

    if (this.drawState.pending) {
      this.triggerRestrictedFeedback(
        this.drawState.canRespond
          ? 'Answer the pending draw offer first.'
          : 'Draw offer already pending.'
      );
      return;
    }

    if (this.onlineUndoState.pending) {
      this.triggerRestrictedFeedback('Undo request already pending.');
      return;
    }

    const undoCount = this.getUndoCountForCurrentState();
    if (undoCount === 0) {
      this.triggerRestrictedFeedback('There is no move to undo yet.');
      return;
    }

    this.cancelAIMove();
    this.onlineUndoState = {
      pending: true,
      canRespond: false,
      requestedBy: this.humanColor,
      mode: GAME_MODES.ai,
      message: 'Undo request sent to the AI...'
    };
    this.aiStatusMessage = 'AI reviewing undo request...';
    this.updateStatus(this.lastMoveText);
    this.updateUiState();

    this.undoResponseTimer = window.setTimeout(() => {
      if (
        this.gameMode !== GAME_MODES.ai
        || !this.onlineUndoState.pending
        || this.onlineUndoState.mode !== GAME_MODES.ai
      ) {
        return;
      }

      this.resetOnlineUndoState();

      let applied = false;
      for (let index = 0; index < undoCount; index += 1) {
        if (!this.undoSingleMove()) {
          break;
        }
        applied = true;
      }

      if (!applied) {
        this.aiStatusMessage = 'AI could not apply the undo.';
        this.triggerRestrictedFeedback(this.aiStatusMessage);
        this.updateUiState();
        return;
      }

      this.aiStatusMessage = this.describeAIModeStatus();
      this.showTemporaryStatus('AI accepted the undo request.', 1600);
      this.showEventBanner('Undo Approved', { duration: 1600 });
      this.updateUiState();
    }, 900);
  }

  getMaterialBalance() {
    const pieceValues = {
      p: 1,
      n: 3,
      b: 3,
      r: 5,
      q: 9,
      k: 0
    };

    let balance = 0;
    this.chess.board().flat().forEach((piece) => {
      if (!piece) {
        return;
      }
      const value = pieceValues[piece.type] || 0;
      balance += piece.color === 'w' ? value : -value;
    });
    return balance;
  }

  shouldAIAcceptDraw() {
    const balance = this.getMaterialBalance();
    const aiPerspective = this.aiColor === 'w' ? balance : -balance;
    const movesPlayed = this.moveHistory.length;

    if (aiPerspective <= -3) {
      return true;
    }

    if (Math.abs(balance) <= 1 && movesPlayed >= 12) {
      return true;
    }

    if (Math.abs(balance) <= 2 && movesPlayed >= 24) {
      return true;
    }

    if (this.chess.inCheck() && aiPerspective < 0) {
      return true;
    }

    return false;
  }

  async offerDraw() {
    if (
      this.replayState.active
      || this.pendingPromotion
      || this.isAnimating
      || this.isPuzzleVariant()
      || this.customEditMode
      || this.agreedDraw
      || this.chess.isGameOver()
      || this.clockState.flaggedColor
    ) {
      return;
    }

    if (this.drawState.pending) {
      this.triggerRestrictedFeedback(
        this.drawState.canRespond
          ? 'Answer the pending draw offer first.'
          : 'A draw offer is already waiting for approval.'
      );
      return;
    }

    if (this.gameMode === GAME_MODES.online) {
      await this.requestOnlineDraw();
      return;
    }

    if (this.gameMode === GAME_MODES.ai) {
      if (this.aiThinking || this.chess.turn() !== this.humanColor) {
        this.triggerRestrictedFeedback('Offer a draw on your turn, before the AI starts thinking.');
        return;
      }

      this.drawState = {
        pending: true,
        canRespond: false,
        requestedBy: this.humanColor,
        mode: GAME_MODES.ai,
        message: 'Draw offer sent to the AI...'
      };
      this.aiStatusMessage = 'AI reviewing draw offer...';
      this.updateStatus(this.lastMoveText);
      this.updateUiState();
      this.persistMatchState();

      this.clearPendingDrawTimer();
      this.drawResponseTimer = window.setTimeout(() => {
        if (!this.drawState.pending || this.drawState.mode !== GAME_MODES.ai || this.agreedDraw) {
          return;
        }

        if (this.shouldAIAcceptDraw()) {
          this.finalizeAgreedDraw('Draw agreed with the AI.');
          return;
        }

        this.resetDrawState();
        this.aiStatusMessage = this.describeAIModeStatus();
        this.showDrawRejectedFeedback('AI declined the draw offer.');
        this.updateStatus(this.lastMoveText);
        this.updateUiState();
        this.persistMatchState();
      }, 950);
      return;
    }

    const requesterColor = this.chess.turn();
    this.drawState = {
      pending: true,
      canRespond: true,
      requestedBy: requesterColor,
      mode: GAME_MODES.local,
      message: `${COLOR_LABELS[requesterColor]} offers a draw.`
    };
    this.updateStatus(this.lastMoveText);
    this.updateUiState();
    this.persistMatchState();
  }

  async respondToDrawOffer(accept) {
    if (!this.drawState.pending) {
      return;
    }

    if (this.drawState.mode === GAME_MODES.online) {
      await this.respondToOnlineDraw(accept);
      return;
    }

    if (!accept) {
      const message = 'Draw offer declined.';
      this.resetDrawState();
      if (this.gameMode === GAME_MODES.ai) {
        this.aiStatusMessage = this.describeAIModeStatus();
      }
      this.showDrawRejectedFeedback(message);
      this.updateStatus(this.lastMoveText);
      this.updateUiState();
      this.persistMatchState();
      return;
    }

    this.finalizeAgreedDraw('Draw agreed by both players.');
  }

  performUndoMove({
    silent = false,
    persist = !this.replayState.active,
    animate = true,
    statusText
  } = {}) {
    const chessMove = this.chess.undo();
    if (!chessMove) {
      return false;
    }

    const record = this.moveHistory.pop();
    if (!record) {
      this.resetClockState();
      this.lastBoardAlertKey = '';
      this.updateStatus('Opening position');
      return false;
    }

    this.lastBoardAlertKey = '';
    this.clearSelection();
    this.clearMoveMarkers();

    if (record.promotion) {
      morphPiece(record.piece, record.originalType, { modelRoot: this.getPieceModelRoot(record.originalType) });
      record.piece.userData.type = record.originalType;
    }

    if (record.rook) {
      this.piecesBySquare.delete(record.rook.to);
      this.piecesBySquare.set(record.rook.from, record.rook.piece);
      record.rook.piece.userData.square = record.rook.from;
      this.queueMoveAnimation(record.rook.piece, record.rook.to, record.rook.from, false, undefined, { animate });
    }

    this.piecesBySquare.delete(record.to);
    this.piecesBySquare.set(record.from, record.piece);
    record.piece.userData.square = record.from;
    record.piece.visible = true;

    if (record.capturedPiece) {
      this.removeCapturedPieceFromTray(record.capturedBy, record.capturedPiece);
      record.capturedPiece.visible = true;
      record.capturedPiece.scale.setScalar(1);
      record.capturedPiece.rotation.y = 0;
      record.capturedPiece.position.copy(squareToVector(record.capturedSquare, record.capturedPiece.userData.baseY));
      record.capturedPiece.userData.square = record.capturedSquare;
      this.piecesBySquare.set(record.capturedSquare, record.capturedPiece);
    }

    this.clockState.remaining.w = record.previousClockRemaining.w;
    this.clockState.remaining.b = record.previousClockRemaining.b;
    this.clockState.flaggedColor = record.previousFlaggedColor;
    this.refreshClockVisuals(true);

    this.queueMoveAnimation(record.piece, record.to, record.from, true, undefined, { animate });
    this.lastMoveSquares = record.previousLastMoveSquares;
    this.updateBoardHighlights();
    this.updateStatus(statusText || this.describeMove(chessMove, { undo: true, source: record.source }));
    if (persist) {
      this.persistMatchState();
    }
    if (!silent) {
      this.renderMoveHistory();
      this.updateUiState();
      if (this.gameMode === GAME_MODES.ai && !this.isTrainingVariant()) {
        void this.refreshAIEvaluation();
      } else if (this.shouldAutoRotateLocalTurnView()) {
        this.resetLocalTurnCameraView();
      }
    }
    return true;
  }

  async requestOnlineUndo() {
    if (this.gameMode !== GAME_MODES.online) {
      return;
    }

    if (this.drawState.pending) {
      this.triggerRestrictedFeedback(
        this.drawState.canRespond
          ? 'Answer the pending draw offer first.'
          : 'Draw offer already pending.'
      );
      return;
    }

    if (this.onlineUndoState.pending) {
      this.triggerRestrictedFeedback(
        this.onlineUndoState.canRespond
          ? 'Answer the pending undo request first.'
          : 'Undo request already sent.'
      );
      return;
    }

    if (!this.onlineRoomId || !this.onlineReady || !this.onlineConnected || !this.onlineMatchStarted) {
      this.triggerRestrictedFeedback('Online match is not ready for undo requests.');
      return;
    }

    if (this.moveHistory.length === 0) {
      this.triggerRestrictedFeedback('There is no move to undo yet.');
      return;
    }

    this.onlineSubmitting = true;
    this.onlineStatusMessage = 'Requesting undo approval...';
    this.updateStatus(this.lastMoveText);
    this.updateUiState();

    try {
      const client = this.prepareOnlineClient();
      await client.requestUndo(this.onlineRoomId);
    } catch (error) {
      this.onlineStatusMessage = error.message || 'Unable to request an undo.';
      this.triggerRestrictedFeedback(this.onlineStatusMessage);
    } finally {
      this.onlineSubmitting = false;
      this.updateUiState();
    }
  }

  async respondToUndoRequest(accept) {
    if (
      this.gameMode !== GAME_MODES.online
      || !this.onlineUndoState.pending
      || !this.onlineUndoState.canRespond
      || !this.onlineRoomId
    ) {
      return;
    }

    this.onlineSubmitting = true;
    this.onlineStatusMessage = accept ? 'Accepting undo...' : 'Declining undo...';
    this.updateStatus(this.lastMoveText);
    this.updateUiState();

    try {
      const client = this.prepareOnlineClient();
      await client.respondToUndo(this.onlineRoomId, accept);
    } catch (error) {
      this.onlineStatusMessage = error.message || 'Unable to answer the undo request.';
      this.triggerRestrictedFeedback(this.onlineStatusMessage);
    } finally {
      this.onlineSubmitting = false;
      this.updateUiState();
    }
  }

  async requestOnlineDraw() {
    if (this.gameMode !== GAME_MODES.online) {
      return;
    }

    if (this.onlineUndoState.pending) {
      this.triggerRestrictedFeedback(
        this.onlineUndoState.canRespond
          ? 'Answer the pending undo request first.'
          : 'Undo request already pending.'
      );
      return;
    }

    if (this.drawState.pending) {
      this.triggerRestrictedFeedback(
        this.drawState.canRespond
          ? 'Answer the pending draw offer first.'
          : 'Draw offer already sent.'
      );
      return;
    }

    if (!this.onlineRoomId || !this.onlineReady || !this.onlineConnected || !this.onlineMatchStarted) {
      this.triggerRestrictedFeedback('Online match is not ready for draw offers.');
      return;
    }

    this.onlineSubmitting = true;
    this.onlineStatusMessage = 'Offering a draw...';
    this.updateStatus(this.lastMoveText);
    this.updateUiState();

    try {
      const client = this.prepareOnlineClient();
      await client.requestDraw(this.onlineRoomId);
    } catch (error) {
      this.onlineStatusMessage = error.message || 'Unable to offer a draw.';
      this.triggerRestrictedFeedback(this.onlineStatusMessage);
    } finally {
      this.onlineSubmitting = false;
      this.updateUiState();
    }
  }

  async respondToOnlineDraw(accept) {
    if (
      this.gameMode !== GAME_MODES.online
      || !this.drawState.pending
      || !this.drawState.canRespond
      || !this.onlineRoomId
    ) {
      return;
    }

    this.onlineSubmitting = true;
    this.onlineStatusMessage = accept ? 'Accepting draw...' : 'Declining draw...';
    this.updateStatus(this.lastMoveText);
    this.updateUiState();

    try {
      const client = this.prepareOnlineClient();
      await client.respondToDraw(this.onlineRoomId, accept);
    } catch (error) {
      this.onlineStatusMessage = error.message || 'Unable to answer the draw offer.';
      this.triggerRestrictedFeedback(this.onlineStatusMessage);
    } finally {
      this.onlineSubmitting = false;
      this.updateUiState();
    }
  }

  async requestOnlineRematch() {
    if (this.gameMode !== GAME_MODES.online || !this.onlineRoomId || !this.onlineConnected) {
      return;
    }

    this.onlineSubmitting = true;
    this.onlineStatusMessage = 'Requesting rematch...';
    this.updateUiState();

    try {
      const client = this.prepareOnlineClient();
      await client.requestRematch(this.onlineRoomId);
    } catch (error) {
      this.onlineStatusMessage = error.message || 'Unable to request a rematch.';
      this.triggerRestrictedFeedback(this.onlineStatusMessage);
    } finally {
      this.onlineSubmitting = false;
      this.updateUiState();
    }
  }

  async respondToRematchRequest(accept) {
    if (
      this.gameMode !== GAME_MODES.online
      || !this.onlineRematchState.pending
      || !this.onlineRoomId
    ) {
      return;
    }

    this.onlineSubmitting = true;
    this.onlineStatusMessage = accept ? 'Accepting rematch...' : 'Declining rematch...';
    this.updateUiState();

    try {
      const client = this.prepareOnlineClient();
      await client.respondToRematch(this.onlineRoomId, accept);
    } catch (error) {
      this.onlineStatusMessage = error.message || 'Unable to answer the rematch request.';
      this.triggerRestrictedFeedback(this.onlineStatusMessage);
    } finally {
      this.onlineSubmitting = false;
      this.updateUiState();
    }
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    if (this.matchPanelOpen && !this.isCompactMatchOverlay()) {
      this.setMatchPanelOpen(false);
    }
  }

  onPointerMove(event) {
    if (this.pendingPromotion || this.replayState.active) {
      this.hoveredSquare = null;
      this.hoveredPieceId = null;
      this.refreshHoverIndicator();
      return;
    }

    this.pointer.copy(normalizePointer(event, this.canvas));
    this.raycaster.setFromCamera(this.pointer, this.camera);

    const hits = this.raycaster.intersectObjects([...this.pieceMeshes, ...this.boardRaycastTargets], true);
    let hoveredSquare = null;
    let hoveredPieceId = null;

    for (const hit of hits) {
      const pieceRoot = this.getPieceRoot(hit.object);
      if (pieceRoot?.userData.square) {
        hoveredPieceId = pieceRoot.userData.pieceId;
        hoveredSquare = pieceRoot.userData.square;
        break;
      }

      if (hit.object.userData.square) {
        hoveredSquare = hit.object.userData.square;
        break;
      }
    }

    this.hoveredSquare = hoveredSquare;
    this.hoveredPieceId = hoveredPieceId;
    this.refreshPieceAppearance();
    this.refreshHoverIndicator();
  }

  onPointerLeave() {
    this.hoveredSquare = null;
    this.hoveredPieceId = null;
    this.refreshPieceAppearance();
    this.refreshHoverIndicator();
  }

  onClick(event) {
    if (this.pendingPromotion || this.isAnimating || this.onlineSubmitting || this.replayState.active) {
      return;
    }

    this.markInteraction();
    this.audio.unlock();
    this.pointer.copy(normalizePointer(event, this.canvas));
    this.raycaster.setFromCamera(this.pointer, this.camera);

    const hits = this.raycaster.intersectObjects([...this.pieceMeshes, ...this.boardRaycastTargets], true);
    let clickedSquare = null;

    for (const hit of hits) {
      const pieceRoot = this.getPieceRoot(hit.object);
      if (pieceRoot?.userData.square) {
        clickedSquare = pieceRoot.userData.square;
        break;
      }

      if (hit.object.userData.square) {
        clickedSquare = hit.object.userData.square;
        break;
      }
    }

    if (!clickedSquare) {
      this.clearSelection();
      return;
    }

    if (this.handleCustomEditorClick(clickedSquare)) {
      return;
    }

    if (!this.canHumanAct()) {
      this.triggerRestrictedFeedback(this.getInteractionLockMessage());
      return;
    }

    const pieceState = this.chess.get(clickedSquare);

    if (this.selectedSquare && this.validMoves.some((move) => move.to === clickedSquare)) {
      void this.handleMoveSelection(clickedSquare);
      return;
    }

    if (pieceState && this.isSelectablePiece(pieceState, clickedSquare)) {
      this.selectSquare(clickedSquare);
      return;
    }

    if (this.selectedSquare) {
      this.triggerRestrictedFeedback('That square is not legal for the selected piece.');
      return;
    }

    if (pieceState) {
      this.triggerRestrictedFeedback('That piece cannot be moved right now.');
      return;
    }

    this.clearSelection();
  }

  canHumanAct() {
    if (this.isConfirmationOpen() || this.replayState.active || this.chess.isGameOver() || this.clockState.flaggedColor || this.agreedDraw || this.drawState.pending || this.onlineUndoState.pending) {
      return false;
    }

    if (this.customEditMode) {
      return false;
    }

    if (this.gameMode !== GAME_MODES.online && !this.manualMatchStarted) {
      return false;
    }

    if (this.isPuzzleVariant()) {
      const playerColor = this.activePuzzle?.fen?.split(' ')[1] || 'w';
      return !this.puzzleState.solved && !this.puzzleState.autoReplyPending && this.chess.turn() === playerColor;
    }

    if (this.gameMode === GAME_MODES.ai) {
      return !this.aiThinking && this.chess.turn() === this.humanColor;
    }

    if (this.gameMode === GAME_MODES.online) {
      return Boolean(
        this.onlineRoomId
        && this.onlineReady
        && this.onlineConnected
        && this.onlineMatchStarted
        && this.onlineMatchPhase === 'playing'
        && !this.onlineUndoState.pending
        && this.onlinePlayerColor
        && this.chess.turn() === this.onlinePlayerColor
      );
    }

    return true;
  }

  getPuzzleSelectableMoves(square) {
    const expectedMove = this.getExpectedPuzzleMove();
    if (!expectedMove || expectedMove.from !== square) {
      return [];
    }

    return this.chess.moves({ square, verbose: true }).filter((move) => (
      move.from === expectedMove.from
      && move.to === expectedMove.to
      && (move.promotion || undefined) === (expectedMove.promotion || undefined)
    ));
  }

  showPuzzleHint() {
    if (!this.isPuzzleVariant() || !this.activePuzzle || this.puzzleState.solved || this.puzzleState.autoReplyPending) {
      return;
    }

    const expectedMove = this.getExpectedPuzzleMove();
    if (!expectedMove) {
      this.setPuzzleFeedback('No hint is available for this position.');
      return;
    }

    this.puzzleState.hintsUsed += 1;
    this.selectSquare(expectedMove.from);
    const pieceState = this.chess.get(expectedMove.from);
    const pieceName = pieceState?.type === 'p'
      ? 'pawn'
      : (PIECE_NAMES[pieceState?.type] || 'piece').toLowerCase();
    const message = `Hint: start with the ${pieceName} on ${expectedMove.from}.`;
    this.setPuzzleFeedback(message, { persist: true });
    this.showTemporaryStatus(message, 1700);
  }

  isSelectablePiece(pieceState, square = null) {
    if (pieceState.color !== this.chess.turn()) {
      return false;
    }

    if (this.gameMode !== GAME_MODES.online && !this.manualMatchStarted) {
      return false;
    }

    if (this.isPuzzleVariant()) {
      const playerColor = this.getPuzzleStartingColor();
      const expectedMove = this.getExpectedPuzzleMove();
      return pieceState.color === playerColor && (!square || expectedMove?.from === square);
    }

    if (this.gameMode === GAME_MODES.ai) {
      return pieceState.color === this.humanColor;
    }

    if (this.gameMode === GAME_MODES.online) {
      return pieceState.color === this.onlinePlayerColor;
    }

    return true;
  }

  selectSquare(square) {
    const moves = this.isPuzzleVariant()
      ? this.getPuzzleSelectableMoves(square)
      : this.chess.moves({ square, verbose: true });

    if (this.isPuzzleVariant() && moves.length === 0) {
      this.triggerRestrictedFeedback('That piece is not part of the solution.', [this.panels.puzzlePanel || this.statusCard, this.statusCard]);
      this.setPuzzleFeedback('Try the exact piece from the solution line.');
      return;
    }

    this.selectedSquare = square;
    this.validMoves = moves;
    this.selectionRing.visible = true;
    this.selectionRing.position.copy(squareToVector(square, BOARD_HEIGHT / 2 + 0.08));
    this.showMoveMarkers(this.validMoves);
    this.refreshPieceAppearance();
    this.refreshHoverIndicator();
  }

  clearSelection() {
    this.selectedSquare = null;
    this.validMoves = [];
    this.selectionRing.visible = false;
    this.clearMoveMarkers();
    this.refreshPieceAppearance();
  }

  showMoveMarkers(moves) {
    this.clearMoveMarkers();
    const selectedPiece = this.selectedSquare ? this.piecesBySquare.get(this.selectedSquare) : null;
    const markerColor = selectedPiece?.userData?.color === 'w'
      ? this.activeTheme.pieces.w.body
      : selectedPiece?.userData?.color === 'b'
        ? this.activeTheme.pieces.b.accent
        : this.activeTheme.board.marker;

    moves.forEach((move) => {
      const marker = createMoveMarker({
        capture: move.captured || move.flags.includes('e'),
        color: markerColor
      });
      marker.position.copy(squareToVector(move.to, BOARD_HEIGHT / 2 + 0.12));
      marker.userData.phase = Math.random() * Math.PI * 2;
      this.moveMarkers.push(marker);
      this.scene.add(marker);
    });
  }

  clearMoveMarkers() {
    this.moveMarkers.forEach((marker) => this.scene.remove(marker));
    this.moveMarkers = [];
  }

  async handleMoveSelection(targetSquare) {
    const plannedMove = this.validMoves.find((move) => move.to === targetSquare);
    if (!plannedMove) {
      return;
    }

    if (plannedMove.promotion) {
      this.openPromotion(targetSquare, plannedMove);
      return;
    }

    await this.submitMove({
      from: this.selectedSquare,
      to: targetSquare
    });
  }

  openPromotion(targetSquare, plannedMove = null) {
    this.pendingPromotion = {
      from: this.selectedSquare,
      to: targetSquare
    };

    this.panels.promotionOptions.innerHTML = '';
    this.panels.promotionOverlay.classList.remove('hidden');
    this.panels.promotionOverlay.setAttribute('aria-hidden', 'false');

    const promotionChoices = this.isPuzzleVariant() && plannedMove?.promotion
      ? [plannedMove.promotion]
      : ['q', 'r', 'b', 'n'];

    promotionChoices.forEach((type) => {
      const button = document.createElement('button');
      button.className = 'promotion-option';
      button.type = 'button';
      button.innerHTML = `
        <span class="promotion-symbol">${PIECE_SYMBOLS[type]}</span>
        <span class="promotion-name">${PIECE_NAMES[type]}</span>
      `;
      button.addEventListener('click', () => {
        const pendingPromotion = this.pendingPromotion;
        this.closePromotion();
        this.pendingPromotion = null;
        if (!pendingPromotion) {
          return;
        }
        void this.submitMove({
          from: pendingPromotion.from,
          to: pendingPromotion.to,
          promotion: type
        });
      }, { once: true });
      this.panels.promotionOptions.append(button);
    });
  }

  closePromotion(clearPending = false) {
    this.panels.promotionOverlay.classList.add('hidden');
    this.panels.promotionOverlay.setAttribute('aria-hidden', 'true');
    if (clearPending) {
      this.pendingPromotion = null;
    }
  }

  async submitMove(moveRequest) {
    if (this.isPuzzleVariant()) {
      await this.submitPuzzleMove(moveRequest);
      return;
    }

    if (this.gameMode === GAME_MODES.online) {
      await this.submitOnlineMove(moveRequest);
      return;
    }

    const source = this.gameMode === GAME_MODES.ai ? 'human' : 'local';
    const result = this.executeMove(moveRequest, { source });
    if (!result) {
      this.triggerRestrictedFeedback('Illegal move.');
      return;
    }

    if (this.gameMode === GAME_MODES.ai) {
      void this.requestAIMove();
    }
  }

  async submitPuzzleMove(moveRequest) {
    if (!this.activePuzzle || this.puzzleState.solved || this.puzzleState.autoReplyPending) {
      return;
    }

    const expectedMove = this.getExpectedPuzzleMove();
    if (!expectedMove) {
      this.setPuzzleFeedback('This puzzle line is unavailable. Restart the puzzle.');
      return;
    }

    const normalizedRequest = moveRequestToUci(normalizeMoveRequest(moveRequest));
    const expectedRequest = moveRequestToUci(expectedMove);
    if (normalizedRequest !== expectedRequest) {
      this.setPuzzleFeedback('Incorrect move. Try again.');
      this.triggerRestrictedFeedback('Incorrect move. Try again.', [this.panels.puzzlePanel || this.statusCard, this.statusCard]);
      window.setTimeout(() => {
        if (this.isPuzzleVariant()) {
          this.resetPuzzle({ feedback: 'Incorrect move. Puzzle reset.' });
        }
      }, 280);
      return;
    }

    const result = this.executeMove(moveRequest, {
      source: this.variantMode === VARIANT_MODES.daily ? 'daily' : 'puzzle',
      autoCollapse: false
    });
    if (!result) {
      this.setPuzzleFeedback('That move is not legal in this puzzle.');
      this.triggerRestrictedFeedback('Try again. That move is not legal here.', [this.panels.puzzlePanel || this.statusCard, this.statusCard]);
      window.setTimeout(() => {
        if (this.isPuzzleVariant()) {
          this.resetPuzzle({ feedback: 'Illegal attempt. Puzzle reset.' });
        }
      }, 280);
      return;
    }

    this.puzzleState.progress += 1;
    if (this.puzzleState.progress >= this.getActivePuzzleLine().length) {
      this.completePuzzle();
      return;
    }

    this.setPuzzleFeedback(this.getDefaultPuzzleFeedback({
      progress: this.puzzleState.progress,
      autoReplyPending: this.getExpectedPuzzleColor() !== this.getPuzzleStartingColor()
    }));
    this.continuePuzzleSequenceIfNeeded();
    this.updateUiState();
    this.persistMatchState();
  }

  async submitOnlineMove(moveRequest) {
    if (!this.onlineRoomId || !this.onlineReady || !this.onlineConnected || !this.onlineMatchStarted || this.onlineMatchPhase !== 'playing' || !this.onlinePlayerColor) {
      return;
    }

    this.onlineSubmitting = true;
    this.clearSelection();
    this.onlineStatusMessage = 'Sending move to the room...';
    this.updateStatus(this.lastMoveText);
    this.updateUiState();

    try {
      const client = this.prepareOnlineClient();
      const response = await client.sendMove(this.onlineRoomId, normalizeMoveRequest(moveRequest));
      const applied = this.executeMove(normalizeMoveRequest(response.move), { source: 'online-self' });
      if (!applied && response.fen) {
        this.loadPositionFromFen(response.fen, { message: 'Move synchronized.' });
      }
      this.onlineStatusMessage = response.state.result === 'active'
        ? 'Move synchronized.'
        : this.describeOnlineGameOver(response.state, response.state.result);
    } catch (error) {
      this.onlineStatusMessage = error.message || 'Unable to send the move.';
      this.triggerRestrictedFeedback(this.onlineStatusMessage);
    } finally {
      this.onlineSubmitting = false;
      this.updateUiState();
    }
  }

  executeMove(
    moveRequest,
    {
      source = 'local',
      silent = false,
      persist = !this.replayState.active,
      animate = true,
      autoCollapse = true,
      updateStatusText = true
    } = {}
  ) {
    if (this.clockState.flaggedColor || this.agreedDraw) {
      return null;
    }

    const normalizedMove = normalizeMoveRequest(moveRequest);
    const result = this.chess.move(normalizedMove);
    if (!result) {
      return null;
    }

    const piece = this.piecesBySquare.get(result.from);
    if (!piece) {
      return null;
    }

    const record = {
      piece,
      from: result.from,
      to: result.to,
      san: result.san,
      color: result.color,
      originalType: piece.userData.type,
      promotion: result.promotion || null,
      previousLastMoveSquares: [...this.lastMoveSquares],
      previousClockRemaining: { ...this.clockState.remaining },
      previousFlaggedColor: this.clockState.flaggedColor,
      source
    };

    let capturedSquare = result.to;
    if (result.flags.includes('e')) {
      const direction = result.color === 'w' ? -1 : 1;
      const captureRank = Number(result.to[1]) + direction;
      capturedSquare = `${result.to[0]}${captureRank}`;
    }

    const capturedPiece = this.piecesBySquare.get(capturedSquare);
    if (capturedPiece && capturedPiece !== piece) {
      record.capturedPiece = capturedPiece;
      record.capturedSquare = capturedSquare;
      record.capturedBy = result.color;
      record.capturedTrayIndex = this.addCapturedPieceToTray(result.color, capturedPiece);
      this.piecesBySquare.delete(capturedSquare);
    }

    this.piecesBySquare.delete(result.from);
    this.piecesBySquare.set(result.to, piece);
    piece.userData.square = result.to;

    if (result.flags.includes('k') || result.flags.includes('q')) {
      const rookFrom = result.flags.includes('k')
        ? `${FILES[7]}${result.from[1]}`
        : `${FILES[0]}${result.from[1]}`;
      const rookTo = result.flags.includes('k')
        ? `${FILES[5]}${result.from[1]}`
        : `${FILES[3]}${result.from[1]}`;
      const rookPiece = this.piecesBySquare.get(rookFrom);

      if (rookPiece) {
        this.piecesBySquare.delete(rookFrom);
        this.piecesBySquare.set(rookTo, rookPiece);
        rookPiece.userData.square = rookTo;
        record.rook = {
          piece: rookPiece,
          from: rookFrom,
          to: rookTo
        };
        this.queueMoveAnimation(rookPiece, rookFrom, rookTo, false, undefined, { animate });
      }
    }

    this.queueMoveAnimation(piece, result.from, result.to, true, () => {
      if (record.capturedPiece) {
        this.playCaptureEffect(
          record.capturedPiece,
          record.capturedSquare,
          record.capturedBy,
          record.capturedTrayIndex,
          { animate, silent }
        );
      }

      if (record.promotion) {
        morphPiece(piece, record.promotion, { modelRoot: this.getPieceModelRoot(record.promotion) });
        piece.userData.type = record.promotion;
      }
    }, { animate });

    this.moveHistory.push(record);
    this.lastMoveSquares = [result.from, result.to];
    this.focusTarget.copy(squareToVector(result.to, 0.7));
    this.focusBlend = 1;
    if (!silent && animate && record.capturedPiece) {
      this.beginCaptureSlowMotion();
    }
    if (autoCollapse) {
      this.autoCollapseHudIfNeeded();
    }
    this.updateBoardHighlights();
    this.clearSelection();
    this.pendingPromotion = null;
    this.closePromotion(true);

    if (!silent) {
      if (!record.capturedPiece) {
        this.audio.playMove();
      }

      if (this.chess.inCheck()) {
        this.audio.playCheck();
      }
    }

    if (!silent) {
      this.presentBoardAlert();
      this.triggerMoveCameraSequence(result, record);
    }
    if (updateStatusText) {
      this.updateStatus(this.describeMove(result, { source }));
    }
    if (persist) {
      this.persistMatchState();
    }
    if (!silent) {
      this.renderMoveHistory();
      this.updateUiState();
      if (this.isMatchFinished()) {
        this.scheduleGameAnalysisPresentation();
      }
    }
    return result;
  }

  describeMove(move, { undo = false, source = 'local' } = {}) {
    if (undo) {
      return `${COLOR_LABELS[move.color]} rewound ${move.san}`;
    }

    if (source === 'ai') {
      return `AI played ${move.san}`;
    }

    if (source === 'ai-book') {
      return `AI prepared ${move.san}`;
    }

    if (source === 'opponent') {
      return `Opponent played ${move.san}`;
    }

    if (source === 'human' || source === 'online-self') {
      return `You played ${move.san}`;
    }

    if (source === 'puzzle' || source === 'daily') {
      return `Solution move ${move.san}`;
    }

    if (source === 'puzzle-reply') {
      return `Puzzle reply ${move.san}`;
    }

    return `${COLOR_LABELS[move.color]} played ${move.san}`;
  }

  spawnCaptureParticles(square) {
    const origin = squareToVector(square, 0.5);
    const particles = [];
    const particleMaterial = new THREE.MeshStandardMaterial({
      color: this.activeTheme.board.marker,
      emissive: new THREE.Color(this.activeTheme.board.marker),
      emissiveIntensity: 0.55,
      metalness: 0.38,
      roughness: 0.26,
      transparent: true,
      opacity: 0.9
    });

    for (let index = 0; index < 8; index += 1) {
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.05 + Math.random() * 0.03, 10, 10),
        particleMaterial.clone()
      );
      particle.position.copy(origin);
      particle.userData.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.9,
        0.4 + Math.random() * 0.65,
        (Math.random() - 0.5) * 0.9
      );
      particles.push(particle);
      this.scene.add(particle);
    }

    this.animations.push({
      duration: 0.42,
      elapsed: 0,
      onUpdate: (progress) => {
        particles.forEach((particle) => {
          particle.position.x = origin.x + particle.userData.velocity.x * progress;
          particle.position.y = origin.y + particle.userData.velocity.y * progress - progress * progress * 0.25;
          particle.position.z = origin.z + particle.userData.velocity.z * progress;
          particle.scale.setScalar(1 - progress * 0.7);
          particle.material.opacity = 0.9 * (1 - progress);
        });
      },
      onComplete: () => {
        particles.forEach((particle) => {
          this.scene.remove(particle);
          particle.geometry.dispose?.();
          particle.material.dispose?.();
        });
      }
    });
  }

  playCaptureEffect(piece, capturedSquare, collectorColor, trayIndex, { animate = true, silent = false } = {}) {
    piece.userData.square = null;
    const start = squareToVector(capturedSquare, piece.userData.baseY);
    const target = this.getCaptureSlotWorldPosition(collectorColor, trayIndex);
    const startScale = piece.scale.x;
    const startRotation = piece.rotation.y;
    const targetRotation = collectorColor === 'w' ? 0 : Math.PI;

    if (!animate) {
      piece.visible = true;
      piece.position.copy(target);
      piece.scale.setScalar(CAPTURE_TRAY_SCALE);
      piece.rotation.y = targetRotation;
      this.isAnimating = false;
      return;
    }

    if (!silent) {
      this.commitCaptureImpact();
      this.audio.playCapture({
        pitch: Math.max(0.58, this.timeScaleState.current * 1.9),
        durationScale: 1.22
      });
    }
    this.isAnimating = true;
    this.spawnCaptureParticles(capturedSquare);
    this.animations.push({
      duration: 0.5,
      elapsed: 0,
      onUpdate: (progress) => {
        const eased = easeInOutCubic(progress);
        piece.position.lerpVectors(start, target, eased);
        piece.position.y = lerp(start.y, target.y, eased) + Math.sin(progress * Math.PI) * 0.5;
        piece.scale.setScalar(lerp(startScale, CAPTURE_TRAY_SCALE, eased));
        piece.rotation.y = lerp(startRotation, targetRotation, eased);
        piece.traverse((child) => {
          if (child.isMesh && child.material && !child.material.isMeshBasicMaterial) {
            child.material.transparent = true;
            child.material.opacity = 1 - progress * 0.18;
          }
        });
      },
      onComplete: () => {
        piece.visible = true;
        piece.position.copy(target);
        piece.scale.setScalar(CAPTURE_TRAY_SCALE);
        piece.rotation.y = targetRotation;
        piece.traverse((child) => {
          if (child.isMesh && child.material && !child.material.isMeshBasicMaterial) {
            child.material.transparent = false;
            child.material.opacity = 1;
          }
        });
        this.isAnimating = false;
        if (this.restartPending) {
          this.restartPending = false;
          this.restartGame();
          return;
        }
        this.flushDeferredActions();
      }
    });
  }

  queueMoveAnimation(piece, fromSquare, toSquare, primary = true, onComplete, { animate = true } = {}) {
    const from = squareToVector(fromSquare, piece.userData.baseY);
    const to = squareToVector(toSquare, piece.userData.baseY);
    const duration = primary ? 0.34 : 0.26;

    if (!animate) {
      piece.position.copy(to);
      onComplete?.();
      return;
    }

    this.animations.push({
      duration,
      elapsed: 0,
      onStart: () => {
        if (primary) {
          this.isAnimating = true;
        }
      },
      onUpdate: (progress) => {
        const eased = easeInOutCubic(progress);
        piece.position.x = lerp(from.x, to.x, eased);
        piece.position.z = lerp(from.z, to.z, eased);
        const arc = Math.sin(progress * Math.PI) * PIECE_LIFT;
        piece.position.y = piece.userData.baseY + arc;
      },
      onComplete: () => {
        piece.position.copy(to);
        if (primary) {
          this.isAnimating = false;
        }
        onComplete?.();
        if (!this.isAnimating) {
          if (this.restartPending) {
            this.restartPending = false;
            this.restartGame();
            return;
          }
          this.flushDeferredActions();
        }
      }
    });
  }

  scheduleDeferredAction(action) {
    if (this.isAnimating) {
      this.deferredActions.push(action);
      return;
    }

    action();
  }

  flushDeferredActions() {
    while (!this.isAnimating && this.deferredActions.length > 0) {
      const action = this.deferredActions.shift();
      action?.();
    }
  }

  cancelAIMove() {
    this.aiRequestToken += 1;
    this.aiThinking = false;
    if (this.aiService) {
      this.aiService.stop();
    }
    if (this.gameMode === GAME_MODES.ai) {
      this.aiStatusMessage = this.describeAIModeStatus();
    }
    this.updateStatus(this.lastMoveText);
    this.updateUiState();
  }

  async requestAIMove() {
    if (
      this.replayState.active
      || this.replayState.playing
      || this.gameMode !== GAME_MODES.ai
      || this.isTrainingVariant()
      || this.chess.isGameOver()
      || this.agreedDraw
      || this.drawState.pending
      || this.onlineUndoState.pending
      || this.clockState.flaggedColor
      || this.chess.turn() !== this.aiColor
    ) {
      return;
    }

    const token = ++this.aiRequestToken;
    const profile = AI_DIFFICULTY_PROFILES[this.aiDifficulty];
    const historyUci = this.getSerializableMoves().map((move) => moveRequestToUci(move));
    const bookMove = getBookMove({
      history: historyUci,
      color: this.aiColor,
      style: this.aiStyle
    });

    if (bookMove) {
      this.aiThinking = true;
      this.aiStatusMessage = `AI follows ${AI_STYLE_PROFILES[this.aiStyle]?.label || 'Balanced'} prep...`;
      this.aiBookMessage = `Book move ${moveRequestToUci(bookMove).toUpperCase()} selected`;
      this.aiEvaluationState.label = 'Opening book in control';
      this.updateStatus(this.lastMoveText);
      this.updateUiState();
      window.setTimeout(() => {
        if (token !== this.aiRequestToken || this.gameMode !== GAME_MODES.ai) {
          return;
        }

        this.scheduleDeferredAction(() => {
          if (token !== this.aiRequestToken || this.gameMode !== GAME_MODES.ai) {
            return;
          }

          this.aiThinking = false;
          this.aiStatusMessage = this.describeAIModeStatus();
          this.executeMove(bookMove, { source: 'ai-book' });
          void this.refreshAIEvaluation();
        });
      }, 480);
      return;
    }

    try {
      await this.ensureAIService();
      if (token !== this.aiRequestToken || this.gameMode !== GAME_MODES.ai) {
        return;
      }

      this.aiThinking = true;
      this.aiStatusMessage = `AI thinking at ${profile.label} depth...`;
      this.aiBookMessage = `${AI_STYLE_PROFILES[this.aiStyle]?.label || 'Balanced'} book exhausted - engine calculating`;
      this.updateStatus(this.lastMoveText);
      this.updateUiState();

      const move = await this.aiService.analyzePosition({
        fen: this.chess.fen(),
        difficulty: this.aiDifficulty
      });

      if (token !== this.aiRequestToken || this.gameMode !== GAME_MODES.ai) {
        return;
      }

      if (!move) {
        this.aiThinking = false;
        this.aiStatusMessage = this.describeAIModeStatus();
        this.updateStatus(this.lastMoveText);
        this.updateUiState();
        return;
      }

      this.scheduleDeferredAction(() => {
        if (token !== this.aiRequestToken || this.gameMode !== GAME_MODES.ai) {
          return;
        }

        this.aiThinking = false;
        this.aiStatusMessage = this.describeAIModeStatus();
        this.executeMove(move, { source: 'ai' });
        void this.refreshAIEvaluation();
      });
    } catch (error) {
      if (token !== this.aiRequestToken || error.message === 'AI request canceled.') {
        return;
      }

      this.aiThinking = false;
      this.aiStatusMessage = error.message || 'Unable to calculate an AI move.';
      this.updateStatus(this.lastMoveText);
      this.updateUiState();
    }
  }

  async createOnlineRoom() {
    if (this.gameMode !== GAME_MODES.online) {
      return;
    }

    this.cancelAIMove();
    this.onlineStatusMessage = 'Creating room...';
    this.updateUiState();

    try {
      const client = this.prepareOnlineClient();
      const response = await client.createRoom(this.onlineColorPreference, this.playerName);
      this.onlineConnected = true;
      this.onlineRoomId = response.roomId;
      this.onlinePlayerColor = response.color;
      this.onlinePlayerToken = response.playerToken || this.onlinePlayerToken;
      this.onlineMatchType = ONLINE_MATCH_TYPES.room;
      this.onlineOpponentType = 'human';
      this.publicIntroReadySent = false;
      this.syncOnlinePlayerNames(response);
      this.syncOnlineStartState(response);
      this.onlineReady = Boolean(response.ready && response.bothConnected !== false);
      this.onlineStatusMessage = response.message || 'Room created.';
      this.onlineConnectionMessage = 'Server connected';
      this.onlineReconnectMessage = 'Seat reserved and persisted locally';
      this.controls.roomInput.value = response.roomId;
      this.persistOnlineSeat();
      this.loadPositionFromFen(response.fen, { message: 'Opening position' });
      this.resetView({ animate: true, color: response.color });
    } catch (error) {
      this.onlineStatusMessage = error.message || 'Unable to create a room.';
      this.updateUiState();
    }
  }

  async startOnlineMatch() {
    if (this.gameMode !== GAME_MODES.online) {
      return;
    }

    if (!this.onlineRoomId || !this.onlineConnected || !this.onlineReady) {
      this.onlineStatusMessage = 'The room is not ready to start yet.';
      this.updateUiState();
      return;
    }

    if (this.onlineMatchStarted) {
      this.onlineStatusMessage = 'The room match is already live.';
      this.updateUiState();
      return;
    }

    this.onlineSubmitting = true;
    this.onlineStatusMessage = 'Start request sent. Waiting for room confirmation...';
    this.updateStatus(this.lastMoveText);
    this.updateUiState();

    try {
      const client = this.prepareOnlineClient();
      const response = await client.startMatch(this.onlineRoomId);
      this.syncOnlineStartState(response);
      this.onlineStatusMessage = response.message || 'Start request sent.';
    } catch (error) {
      this.onlineStatusMessage = error.message || 'Unable to start the room match.';
      this.triggerRestrictedFeedback(this.onlineStatusMessage);
    } finally {
      this.onlineSubmitting = false;
      this.updateUiState();
    }
  }

  async joinOnlineRoom() {
    if (this.gameMode !== GAME_MODES.online) {
      return;
    }

    const roomId = this.controls.roomInput.value.trim().toUpperCase();
    if (!roomId) {
      this.onlineStatusMessage = 'Enter a room ID first.';
      this.updateUiState();
      return;
    }

    this.cancelAIMove();
    this.onlineStatusMessage = 'Joining room...';
    this.updateUiState();

    try {
      const client = this.prepareOnlineClient();
      const response = await client.joinRoom(roomId, this.onlineColorPreference, this.playerName);
      this.onlineConnected = true;
      this.onlineRoomId = response.roomId;
      this.onlinePlayerColor = response.color;
      this.onlinePlayerToken = response.playerToken || this.onlinePlayerToken;
      this.onlineMatchType = ONLINE_MATCH_TYPES.room;
      this.onlineOpponentType = 'human';
      this.publicIntroReadySent = false;
      this.syncOnlinePlayerNames(response);
      this.syncOnlineStartState(response);
      this.onlineReady = Boolean(response.ready && response.bothConnected !== false);
      this.onlineStatusMessage = response.message || 'Joined room.';
      this.onlineConnectionMessage = 'Server connected';
      this.onlineReconnectMessage = 'Seat reserved and persisted locally';
      this.controls.roomInput.value = response.roomId;
      this.persistOnlineSeat();
      this.loadPositionFromFen(response.fen, { message: 'Opening position' });
      this.resetView({ animate: true, color: response.color });
    } catch (error) {
      this.onlineStatusMessage = error.message || 'Unable to join the room.';
      this.updateUiState();
    }
  }

  async attemptOnlineReconnect() {
    if (this.gameMode !== GAME_MODES.online) {
      return false;
    }

    const roomId = (this.onlineRoomId || this.controls.roomInput.value || '').trim().toUpperCase();
    if (!roomId || !this.onlinePlayerToken) {
      this.onlineStatusMessage = 'No saved online seat is available to reconnect.';
      this.updateUiState();
      return false;
    }

    this.onlineStatusMessage = 'Reconnecting to saved room...';
    this.onlineConnectionMessage = 'Restoring saved seat';
    this.updateUiState();

    try {
      const client = this.prepareOnlineClient();
      const response = await client.reconnectRoom(roomId, this.onlinePlayerToken, this.playerName);
      this.onlineConnected = true;
      this.onlineRoomId = response.roomId;
      this.onlinePlayerColor = response.color;
      this.onlineMatchType = response.matchType || ONLINE_MATCH_TYPES.room;
      this.onlineOpponentType = response.opponentType || 'human';
      this.publicIntroReadySent = false;
      this.syncOnlinePlayerNames(response);
      this.syncOnlineStartState(response);
      this.onlineReady = Boolean(response.ready && response.bothConnected !== false);
      this.onlineStatusMessage = response.message || 'Reconnected to room.';
      this.onlineConnectionMessage = 'Server connected';
      this.onlineReconnectMessage = this.onlineReady
        ? this.onlineMatchStarted
          ? 'Live room restored'
          : 'Seat restored - press Start Game'
        : 'Seat restored - waiting for opponent';
      this.controls.roomInput.value = response.roomId;
      this.persistOnlineSeat();
      this.loadPositionFromFen(response.fen, { message: 'Reconnected match' });
      this.resetView({ animate: true, color: response.color });
      return true;
    } catch (error) {
      const message = error.message || 'Unable to reconnect to the saved room.';
      this.onlineStatusMessage = message;
      this.onlineConnectionMessage = 'Reconnect failed';
      const shouldClearSeat = /no longer available|not found|expired|rejected/i.test(message);
      this.onlineReconnectMessage = shouldClearSeat ? 'Saved seat expired' : 'Reconnect can be retried';
      if (shouldClearSeat) {
        this.onlineRoomId = null;
        this.onlinePlayerColor = null;
        this.clearOnlineSeat();
      }
      this.updateUiState();
      return false;
    }
  }

  async copyRoomId() {
    if (!this.onlineRoomId) {
      this.onlineStatusMessage = 'Create a room before copying the code.';
      this.updateUiState();
      return;
    }

    try {
      await navigator.clipboard.writeText(this.onlineRoomId);
      this.onlineStatusMessage = `Room ${this.onlineRoomId} copied to the clipboard.`;
    } catch {
      this.onlineStatusMessage = `Room ID: ${this.onlineRoomId}`;
    }
    this.updateUiState();
  }

  async leaveOnlineRoom({ silent = false, resetBoard = true } = {}) {
    const activeRoomId = this.onlineRoomId;
    this.hideMatchIntro({ immediate: true });

    try {
      if (this.onlineClient && activeRoomId) {
        await this.onlineClient.leaveRoom(activeRoomId);
      }
    } catch {
      // Ignore shutdown races when leaving a room or switching modes.
    }

    if (this.onlineClient) {
      this.onlineClient.destroy();
      this.onlineClient = null;
    }

    this.resetOnlineState({ preserveClient: false });
    this.clearOnlineSeat();
    this.controls.roomInput.value = activeRoomId && silent ? activeRoomId : '';

    if (!silent) {
      this.onlineStatusMessage = 'Left the room.';
    }

    if (resetBoard) {
      this.loadPositionFromFen(initialFen(), { message: 'Opening position' });
    } else {
      this.updateUiState();
    }
  }

  refreshPieceAppearance() {
    this.pieceMeshes.forEach((piece) => {
      const isSelected = piece.userData.square === this.selectedSquare;
      const isHovered = piece.userData.pieceId === this.hoveredPieceId;
      applyPieceAppearance(piece, { selected: isSelected, hovered: isHovered });
    });
  }

  refreshHoverIndicator() {
    if (!this.hoveredSquare) {
      this.hoverIndicator.visible = false;
      return;
    }

    this.hoverIndicator.visible = true;
    this.hoverIndicator.position.copy(squareToVector(this.hoveredSquare, BOARD_HEIGHT / 2 + 0.06));
    const isValidTarget = this.validMoves.some((move) => move.to === this.hoveredSquare);
    this.hoverIndicator.material.opacity = isValidTarget ? 0.58 : 0.24;
    const hoverColor = isValidTarget ? this.activeTheme.board.selection : this.activeTheme.board.hover;
    this.hoverIndicator.material.color.set(hoverColor);
    this.hoverIndicator.material.emissive.set(hoverColor);
  }

  getPieceRoot(object) {
    let current = object;
    while (current) {
      if (current.userData?.pieceId) {
        return current;
      }
      current = current.parent;
    }
    return null;
  }

  updateBoardHighlights() {
    this.boardSquares.forEach((tile, square) => {
      const material = tile.material;
      material.color.set(tileBaseColor(square, this.activeTheme));
      material.emissive.set('#000000');
      material.emissiveIntensity = 0;

      if (this.lastMoveSquares.includes(square)) {
        material.color.lerp(new THREE.Color(this.activeTheme.board.lastMove), 0.24);
        material.emissive.set(this.activeTheme.board.marker);
        material.emissiveIntensity = 0.08;
      }
    });
  }

  updateStatus(lastMoveText = this.lastMoveText) {
    this.lastMoveText = lastMoveText;
    window.clearTimeout(this.statusOverrideTimeout);
    this.status.turnLabel.textContent = this.clockState.flaggedColor || this.agreedDraw
      ? 'Stopped'
      : !this.replayState.active && !this.isCurrentMatchStarted()
        ? 'Ready'
        : COLOR_LABELS[this.chess.turn()];
    this.status.moveLabel.textContent = lastMoveText;

    let state = `${COLOR_LABELS[this.chess.turn()]} to move`;

    if (this.replayState.active) {
      state = this.replayState.playing
        ? 'Replay playing'
        : this.replayState.moveIndex === 0
          ? 'Replay ready'
          : `Replay move ${this.replayState.moveIndex} of ${this.replayState.moves.length}`;
    } else if (this.agreedDraw) {
      state = 'Draw by agreement';
    } else if (this.variantMode === VARIANT_MODES.custom && this.customEditMode) {
      state = 'Edit mode - place or erase pieces on the board';
    } else if (this.isPuzzleVariant()) {
      if (!this.manualMatchStarted) {
        state = 'Press Start Game to begin';
      } else if (this.puzzleState.solved) {
        state = this.variantMode === VARIANT_MODES.daily ? 'Daily challenge solved' : 'Puzzle solved';
      } else if (this.puzzleState.autoReplyPending) {
        state = 'Puzzle sequence continuing...';
      } else if (this.puzzleState.progress === 0) {
        state = this.activePuzzle?.description || 'Find the solution';
      } else {
        state = `Continue the line · step ${this.puzzleState.progress + 1}`;
      }
    } else if (this.clockState.flaggedColor) {
      state = `Time - ${COLOR_LABELS[oppositeColor(this.clockState.flaggedColor)]} wins`;
    } else if (this.chess.isCheckmate()) {
      state = `Checkmate - ${COLOR_LABELS[this.chess.turn() === 'w' ? 'b' : 'w']} wins`;
    } else if (this.chess.isDraw()) {
      state = 'Draw';
    } else if (this.onlineUndoState.pending && this.onlineUndoState.mode === GAME_MODES.ai) {
      state = 'Undo requested - AI reviewing';
    } else if (this.drawState.pending) {
      state = this.drawState.message || 'Draw offer pending';
    } else if (this.gameMode === GAME_MODES.ai) {
      if (!this.manualMatchStarted) {
        state = 'Press Start Game to begin';
      } else if (this.aiThinking) {
        state = 'AI thinking...';
      } else if (this.chess.inCheck()) {
        state = this.chess.turn() === this.humanColor
          ? 'Check - your king is under attack'
          : 'Check - the AI king is under attack';
      } else {
        state = this.chess.turn() === this.humanColor ? 'Your move' : 'AI to move';
      }
    } else if (this.gameMode === GAME_MODES.online) {
      if (/you win/i.test(this.onlineStatusMessage || '')) {
        state = 'Opponent left - you win';
      } else if (this.publicMatchmakingState.active) {
        state = this.publicMatchmakingState.message || 'Searching public queue';
      } else if (this.duelIntroState.active) {
        state = 'Match intro';
      } else if (!this.onlineRoomId) {
        state = 'Create or join an online room';
      } else if (!this.onlineConnected) {
        state = 'Connection lost';
      } else if (!this.onlineReady) {
        state = 'Waiting for full room';
      } else if (!this.onlineMatchStarted) {
        state = this.onlinePlayerColor && this.onlineStartedPlayers[this.onlinePlayerColor]
          ? 'Waiting for opponent to press Start Game'
          : 'Press Start Game to begin';
      } else if (this.onlineRematchState.pending) {
        state = this.onlineRematchState.canRespond
          ? 'Rematch requested - choose accept or decline'
          : 'Rematch requested - waiting for opponent';
      } else if (this.onlineUndoState.pending) {
        state = this.onlineUndoState.canRespond
          ? 'Undo requested - choose accept or decline'
          : 'Undo requested - waiting for opponent';
      } else if (this.onlineSubmitting) {
        state = 'Sending move...';
      } else if (this.chess.inCheck()) {
        state = this.chess.turn() === this.onlinePlayerColor
          ? 'Check - your king is under attack'
          : 'Check - opponent is under pressure';
      } else {
        state = this.chess.turn() === this.onlinePlayerColor ? 'Your move' : 'Opponent to move';
      }
    } else if (!this.manualMatchStarted) {
      state = 'Press Start Game to begin';
    } else if (this.chess.inCheck()) {
      state = `Check - ${COLOR_LABELS[this.chess.turn()]} is under pressure`;
    }

    this.status.stateLabel.textContent = state;
  }

  updateUiState() {
    this.refreshPlayerIdentity();
    this.status.modeLabel.textContent = this.getModeLabel();
    this.status.variantLabel.textContent = this.getVariantLabel();
    this.status.sideLabel.textContent = this.getSideLabel();
    this.status.roomLabel.textContent = this.getRoomLabel();
    this.status.connectionLabel.textContent = this.getConnectionLabel();
    const previewMode = this.selectedGameMode;
    const onlineLobbyActive = this.gameMode === GAME_MODES.online;
    this.status.aiStatusLabel.textContent = previewMode === GAME_MODES.ai && (this.gameMode !== GAME_MODES.ai || !this.manualMatchStarted)
      ? 'Press Start Game to begin a Vs AI match.'
      : this.aiStatusMessage;
    this.status.aiBookLabel.textContent = this.aiBookMessage;
    this.status.aiStyleLabel.textContent = this.getAIStyleDescription();
    this.status.aiEvalLabel.textContent = this.aiEvaluationState.label;
    this.status.onlineStatusLabel.textContent = previewMode === GAME_MODES.online && this.gameMode !== GAME_MODES.online
      ? 'Press Start Game to open the online lobby.'
      : this.onlineStatusMessage;
    this.status.onlineReconnectLabel.textContent = this.onlineReconnectMessage;
    this.status.undoRequestLabel.textContent = this.onlineUndoState.message;
    this.status.rematchRequestLabel.textContent = this.onlineRematchState.message;
    this.status.drawRequestLabel.textContent = this.drawState.message;
    this.status.themeLabel.textContent = this.activeTheme.label;
    this.status.blitzStatusLabel.textContent = `${this.getCurrentBlitzProfile().label} per side`;
    this.status.customStatusLabel.textContent = this.customEditMode
      ? `Editing · ${COLOR_LABELS[this.customSelectedColor]} ${this.getCustomPieceLabel()} selected`
      : 'Custom setup locked';
    this.status.replayProgressLabel.textContent = this.replayState.active
      ? `${this.replayState.moveIndex} / ${this.replayState.moves.length}`
      : this.savedReplayMoves.length > 0
        ? `${this.savedReplayMoves.length} moves saved`
        : 'Replay idle';
    this.refreshPuzzleMeta();
    this.updateDailyChallengeStatus();

    this.controls.localModeButton.classList.toggle('is-active', previewMode === GAME_MODES.local);
    this.controls.aiModeButton.classList.toggle('is-active', previewMode === GAME_MODES.ai);
    this.controls.onlineModeButton.classList.toggle('is-active', previewMode === GAME_MODES.online);
    this.controls.classicVariantButton.classList.toggle('is-active', this.variantMode === VARIANT_MODES.classic);
    this.controls.blitzVariantButton.classList.toggle('is-active', this.variantMode === VARIANT_MODES.blitz);
    this.controls.puzzleVariantButton.classList.toggle('is-active', this.variantMode === VARIANT_MODES.puzzle);
    this.controls.dailyVariantButton.classList.toggle('is-active', this.variantMode === VARIANT_MODES.daily);
    this.controls.customVariantButton.classList.toggle('is-active', this.variantMode === VARIANT_MODES.custom);
    this.controls.aiBeginnerButton.classList.toggle('is-active', this.aiDifficulty === 'beginner');
    this.controls.aiEasyButton.classList.toggle('is-active', this.aiDifficulty === 'easy');
    this.controls.aiMediumButton.classList.toggle('is-active', this.aiDifficulty === 'medium');
    this.controls.aiHardButton.classList.toggle('is-active', this.aiDifficulty === 'hard');
    this.controls.aiMasterButton.classList.toggle('is-active', this.aiDifficulty === 'master');
    this.controls.aiBalancedStyleButton.classList.toggle('is-active', this.aiStyle === 'balanced');
    this.controls.aiAggressiveStyleButton.classList.toggle('is-active', this.aiStyle === 'aggressive');
    this.controls.aiSolidStyleButton.classList.toggle('is-active', this.aiStyle === 'solid');
    this.controls.aiTrickyStyleButton.classList.toggle('is-active', this.aiStyle === 'tricky');
    this.controls.themeIvoryButton.classList.toggle('is-active', this.themeId === 'ivory');
    this.controls.themeMidnightButton.classList.toggle('is-active', this.themeId === 'midnight');
    this.controls.themeRegalButton.classList.toggle('is-active', this.themeId === 'regal');
    this.controls.blitz1Button.classList.toggle('is-active', this.blitzPreset === '1');
    this.controls.blitz3Button.classList.toggle('is-active', this.blitzPreset === '3');
    this.controls.blitz5Button.classList.toggle('is-active', this.blitzPreset === '5');
    this.controls.puzzleAllButton.classList.toggle('is-active', this.puzzleState.difficulty === 'all');
    this.controls.puzzleEasyButton.classList.toggle('is-active', this.puzzleState.difficulty === 'easy');
    this.controls.puzzleMediumButton.classList.toggle('is-active', this.puzzleState.difficulty === 'medium');
    this.controls.puzzleHardButton.classList.toggle('is-active', this.puzzleState.difficulty === 'hard');
    this.controls.onlineAutoColorButton.classList.toggle('is-active', this.onlineColorPreference === 'auto');
    this.controls.onlineWhiteColorButton.classList.toggle('is-active', this.onlineColorPreference === 'w');
    this.controls.onlineBlackColorButton.classList.toggle('is-active', this.onlineColorPreference === 'b');
    this.controls.customWhiteButton.classList.toggle('is-active', this.customSelectedColor === 'w');
    this.controls.customBlackButton.classList.toggle('is-active', this.customSelectedColor === 'b');
    this.controls.customKingButton.classList.toggle('is-active', this.customSelectedType === 'k');
    this.controls.customQueenButton.classList.toggle('is-active', this.customSelectedType === 'q');
    this.controls.customRookButton.classList.toggle('is-active', this.customSelectedType === 'r');
    this.controls.customBishopButton.classList.toggle('is-active', this.customSelectedType === 'b');
    this.controls.customKnightButton.classList.toggle('is-active', this.customSelectedType === 'n');
    this.controls.customPawnButton.classList.toggle('is-active', this.customSelectedType === 'p');
    this.controls.customEraseButton.classList.toggle('is-active', this.customSelectedType === 'erase');

    const showAIPanel = previewMode === GAME_MODES.ai;
    const showOnlinePanel = previewMode === GAME_MODES.online;
    const showUndoApproval = showOnlinePanel && this.onlineUndoState.pending;
    const showRematchApproval = showOnlinePanel && this.onlineRematchState.pending;
    const showDrawApproval = this.drawState.pending && this.drawState.canRespond;
    const showReplayPanel = this.replayState.active;
    const showBlitzPanel = this.variantMode === VARIANT_MODES.blitz;
    const showPuzzlePanel = this.variantMode === VARIANT_MODES.puzzle;
    const showDailyPanel = this.variantMode === VARIANT_MODES.daily;
    const showCustomPanel = this.variantMode === VARIANT_MODES.custom;
    if ((showUndoApproval || showRematchApproval || showDrawApproval) && this.hudCollapsed) {
      this.hudAutoCollapsed = false;
      this.setHudCollapsed(false);
    }
    this.panels.aiPanel.classList.toggle('hidden', !showAIPanel);
    this.panels.aiPanel.setAttribute('aria-hidden', String(!showAIPanel));
    this.panels.blitzPanel.classList.toggle('hidden', !showBlitzPanel);
    this.panels.blitzPanel.setAttribute('aria-hidden', String(!showBlitzPanel));
    this.panels.puzzlePanel.classList.toggle('hidden', !showPuzzlePanel);
    this.panels.puzzlePanel.setAttribute('aria-hidden', String(!showPuzzlePanel));
    this.panels.dailyPanel.classList.toggle('hidden', !showDailyPanel);
    this.panels.dailyPanel.setAttribute('aria-hidden', String(!showDailyPanel));
    this.panels.customPanel.classList.toggle('hidden', !showCustomPanel);
    this.panels.customPanel.setAttribute('aria-hidden', String(!showCustomPanel));
    this.panels.onlinePanel.classList.toggle('hidden', !showOnlinePanel);
    this.panels.onlinePanel.setAttribute('aria-hidden', String(!showOnlinePanel));
    this.panels.undoApprovalPanel.classList.toggle('hidden', !showUndoApproval);
    this.panels.undoApprovalPanel.setAttribute('aria-hidden', String(!showUndoApproval));
    this.panels.rematchApprovalPanel.classList.toggle('hidden', !showRematchApproval);
    this.panels.rematchApprovalPanel.setAttribute('aria-hidden', String(!showRematchApproval));
    this.panels.drawApprovalPanel.classList.toggle('hidden', !showDrawApproval);
    this.panels.drawApprovalPanel.setAttribute('aria-hidden', String(!showDrawApproval));
    this.panels.replayPanel.classList.toggle('hidden', !showReplayPanel);
    this.panels.replayPanel.setAttribute('aria-hidden', String(!showReplayPanel));
    this.updateTopTimerBadges();

    const undoDisabled = this.replayState.active
      ? true
      : this.isPuzzleVariant() || this.customEditMode || this.agreedDraw || this.drawState.pending || this.onlineUndoState.pending
        ? true
      : this.gameMode === GAME_MODES.online
        ? !this.onlineRoomId
          || !this.onlineReady
          || !this.onlineConnected
          || !this.onlineMatchStarted
          || this.moveHistory.length === 0
          || this.isAnimating
          || this.pendingPromotion
          || this.onlineSubmitting
        : this.moveHistory.length === 0
          || this.isAnimating
          || this.pendingPromotion;
    const restartDisabled = (this.gameMode === GAME_MODES.online && !this.replayState.active)
      || this.isAnimating
      || this.onlineSubmitting;
    const drawDisabled = this.replayState.active
      || this.isPuzzleVariant()
      || this.customEditMode
      || this.isAnimating
      || this.pendingPromotion
      || this.onlineSubmitting
      || this.agreedDraw
      || this.drawState.pending
      || this.onlineRematchState.pending
      || this.onlineUndoState.pending
      || this.clockState.flaggedColor
      || this.chess.isGameOver()
      || (this.gameMode !== GAME_MODES.online && !this.manualMatchStarted)
      || (this.gameMode === GAME_MODES.online && (!this.onlineRoomId || !this.onlineReady || !this.onlineConnected || !this.onlineMatchStarted))
      || (this.gameMode === GAME_MODES.ai && (this.aiThinking || this.chess.turn() !== this.humanColor));
    const roomActive = Boolean(this.onlineRoomId);
    const publicSearchActive = this.publicMatchmakingState.active;
    const hasReplaySource = this.replayState.active || this.savedReplayMoves.length > 0 || this.moveHistory.length > 0;
    const variantLockedByRoom = roomActive || publicSearchActive || this.replayState.active || this.isAnimating;
    const trainingVariantSelected = this.isTrainingVariant();
    const startDisabled = this.isAnimating || this.pendingPromotion || this.replayState.active || this.onlineSubmitting || publicSearchActive;
    const quitDisabled = this.homeVisible || this.isAnimating || this.pendingPromotion || this.onlineSubmitting;
    const onlineStartWaitingForRoom = previewMode === GAME_MODES.online
      && this.gameMode === GAME_MODES.online
      && !this.onlineRoomId
      && !this.onlinePlayerToken;
    const onlineStartWaitingForReconnect = previewMode === GAME_MODES.online
      && this.gameMode === GAME_MODES.online
      && !this.onlineConnected
      && !this.onlinePlayerToken;
    const onlineStartWaitingForOpponent = previewMode === GAME_MODES.online
      && this.gameMode === GAME_MODES.online
      && this.onlineConnected
      && this.onlineRoomId
      && !this.onlineReady;
    const onlineStartAlreadyRequested = previewMode === GAME_MODES.online
      && this.gameMode === GAME_MODES.online
      && Boolean(this.onlinePlayerColor && this.onlineStartedPlayers[this.onlinePlayerColor]);
    const onlineStartAlreadyLive = previewMode === GAME_MODES.online
      && this.gameMode === GAME_MODES.online
      && this.onlineMatchStarted;
    const nonOnlineStartAlreadyLive = previewMode !== GAME_MODES.online
      && previewMode === this.gameMode
      && this.manualMatchStarted;

    this.controls.startGameButton.textContent = this.getStartGameLabel();
    this.controls.startGameButton.disabled = startDisabled
      || onlineStartWaitingForRoom
      || onlineStartWaitingForReconnect
      || onlineStartWaitingForOpponent
      || onlineStartAlreadyRequested
      || onlineStartAlreadyLive
      || nonOnlineStartAlreadyLive;
    this.controls.undoButton.textContent = this.onlineUndoState.pending
      ? 'Undo Pending'
      : this.gameMode === GAME_MODES.online || this.gameMode === GAME_MODES.ai
        ? 'Request Undo'
        : 'Undo Move';
    this.controls.drawButton.textContent = this.drawState.pending ? 'Draw Pending' : 'Offer Draw';
    this.controls.cinematicCameraButton.textContent = this.cinematicCameraEnabled ? 'Cinema On' : 'Cinema Off';
    this.controls.cinematicCameraButton.setAttribute('aria-pressed', String(this.cinematicCameraEnabled));
    this.controls.cinematicCameraButton.classList.toggle('is-active-toggle', this.cinematicCameraEnabled);
    this.controls.restartButton.textContent = this.replayState.active ? 'New Game' : 'New Game';
    this.controls.quitButton.textContent = this.replayState.active ? 'Quit Replay' : 'Quit Match';
    this.controls.replayMatchButton.textContent = this.replayState.active ? 'Exit Replay' : 'Replay Match';
    this.controls.replayPlayButton.textContent = this.replayState.playing ? 'Pause' : 'Play';
    this.controls.customToggleEditButton.textContent = this.customEditMode ? 'Finish Editing' : 'Edit Mode';
    this.controls.undoButton.disabled = undoDisabled;
    this.controls.drawButton.disabled = false;
    this.controls.drawButton.setAttribute('aria-disabled', String(drawDisabled));
    this.controls.restartButton.disabled = restartDisabled;
    this.controls.quitButton.disabled = false;
    this.controls.quitButton.setAttribute('aria-disabled', String(quitDisabled));
    this.controls.replayMatchButton.disabled = !hasReplaySource
      || this.isAnimating
      || this.pendingPromotion
      || (this.onlineRoomId && this.onlineConnected);
    this.controls.localModeButton.disabled = this.replayState.active || this.isAnimating || roomActive || publicSearchActive;
    this.controls.aiModeButton.disabled = this.replayState.active || this.isAnimating || trainingVariantSelected || roomActive || publicSearchActive;
    this.controls.onlineModeButton.disabled = this.replayState.active || this.isAnimating || trainingVariantSelected || roomActive || publicSearchActive;
    this.controls.classicVariantButton.disabled = variantLockedByRoom;
    this.controls.blitzVariantButton.disabled = variantLockedByRoom;
    this.controls.puzzleVariantButton.disabled = variantLockedByRoom;
    this.controls.dailyVariantButton.disabled = variantLockedByRoom;
    this.controls.customVariantButton.disabled = variantLockedByRoom;
    this.controls.copyRoomButton.disabled = !this.onlineRoomId;
    this.controls.leaveRoomButton.disabled = !this.onlineRoomId;
    this.controls.reconnectRoomButton.disabled = !showOnlinePanel || !this.onlinePlayerToken || this.onlineSubmitting || this.onlineConnected;
    this.controls.findPublicMatchButton.disabled = !onlineLobbyActive || this.onlineSubmitting || roomActive || publicSearchActive || trainingVariantSelected;
    this.controls.cancelPublicMatchmakingButton.disabled = !publicSearchActive || this.onlineSubmitting;
    this.controls.createRoomButton.disabled = !onlineLobbyActive || this.onlineSubmitting || roomActive || publicSearchActive;
    this.controls.joinRoomButton.disabled = !onlineLobbyActive || this.onlineSubmitting || roomActive || publicSearchActive;
    this.controls.roomInput.disabled = !onlineLobbyActive || this.onlineSubmitting || roomActive || publicSearchActive;
    this.controls.onlineAutoColorButton.disabled = this.onlineSubmitting || roomActive || publicSearchActive;
    this.controls.onlineWhiteColorButton.disabled = this.onlineSubmitting || roomActive || publicSearchActive;
    this.controls.onlineBlackColorButton.disabled = this.onlineSubmitting || roomActive || publicSearchActive;
    this.controls.acceptUndoButton.disabled = !this.onlineUndoState.canRespond || this.onlineSubmitting || this.isAnimating;
    this.controls.declineUndoButton.disabled = !this.onlineUndoState.canRespond || this.onlineSubmitting || this.isAnimating;
    this.controls.acceptRematchButton.disabled = !this.onlineRematchState.canRespond || this.onlineSubmitting || this.isAnimating;
    this.controls.declineRematchButton.disabled = !this.onlineRematchState.canRespond || this.onlineSubmitting || this.isAnimating;
    this.controls.acceptDrawButton.disabled = !this.drawState.canRespond || this.onlineSubmitting || this.isAnimating;
    this.controls.declineDrawButton.disabled = !this.drawState.canRespond || this.onlineSubmitting || this.isAnimating;
    this.controls.replayPrevButton.disabled = !this.replayState.active
      || this.replayState.moveIndex === 0
      || this.isAnimating
      || this.replayState.playing;
    this.controls.replayPlayButton.disabled = !this.replayState.active || this.isAnimating || this.replayState.moves.length === 0;
    this.controls.replayNextButton.disabled = !this.replayState.active
      || this.replayState.moveIndex >= this.replayState.moves.length
      || this.isAnimating
      || this.replayState.playing;
    this.controls.replayExitButton.disabled = !this.replayState.active || this.isAnimating;
    this.controls.blitz1Button.disabled = this.hasMatchStarted() && this.variantMode === VARIANT_MODES.blitz;
    this.controls.blitz3Button.disabled = this.hasMatchStarted() && this.variantMode === VARIANT_MODES.blitz;
    this.controls.blitz5Button.disabled = this.hasMatchStarted() && this.variantMode === VARIANT_MODES.blitz;
    this.controls.puzzleAllButton.disabled = this.variantMode !== VARIANT_MODES.puzzle || this.isAnimating;
    this.controls.puzzleEasyButton.disabled = this.variantMode !== VARIANT_MODES.puzzle || this.isAnimating;
    this.controls.puzzleMediumButton.disabled = this.variantMode !== VARIANT_MODES.puzzle || this.isAnimating;
    this.controls.puzzleHardButton.disabled = this.variantMode !== VARIANT_MODES.puzzle || this.isAnimating;
    this.controls.nextPuzzleButton.disabled = this.variantMode !== VARIANT_MODES.puzzle || this.isAnimating;
    this.controls.resetPuzzleButton.disabled = !this.isPuzzleVariant() || this.isAnimating;
    this.controls.loadDailyButton.disabled = this.isAnimating;
    this.controls.dailyResetButton.disabled = this.variantMode !== VARIANT_MODES.daily || this.isAnimating;
    this.controls.hintPuzzleButton.disabled = this.variantMode !== VARIANT_MODES.puzzle || this.isAnimating || this.puzzleState.solved || this.puzzleState.autoReplyPending;
    this.controls.hintDailyButton.disabled = this.variantMode !== VARIANT_MODES.daily || this.isAnimating || this.puzzleState.solved || this.puzzleState.autoReplyPending;
    this.controls.customWhiteButton.disabled = !this.customEditMode;
    this.controls.customBlackButton.disabled = !this.customEditMode;
    this.controls.customKingButton.disabled = !this.customEditMode;
    this.controls.customQueenButton.disabled = !this.customEditMode;
    this.controls.customRookButton.disabled = !this.customEditMode;
    this.controls.customBishopButton.disabled = !this.customEditMode;
    this.controls.customKnightButton.disabled = !this.customEditMode;
    this.controls.customPawnButton.disabled = !this.customEditMode;
    this.controls.customEraseButton.disabled = !this.customEditMode;
    this.controls.customClearButton.disabled = !showCustomPanel || this.isAnimating;
    this.controls.customStandardButton.disabled = !showCustomPanel || this.isAnimating;
    this.controls.customStartButton.disabled = !showCustomPanel || this.isAnimating || this.manualMatchStarted;

    this.controls.homeStartButton.textContent = this.getStartGameLabel();
    this.controls.homeStartButton.disabled = this.controls.startGameButton.disabled;
    this.controls.analysisReplayButton.disabled = !hasReplaySource || this.isAnimating;
    this.controls.analysisRematchButton.disabled = this.gameMode !== GAME_MODES.online
      || !this.isMatchFinished()
      || !this.onlineRoomId
      || !this.onlineConnected
      || this.isPublicOnlineMatch()
      || this.onlineRematchState.pending
      || this.onlineSubmitting;
    this.controls.analysisRematchButton.hidden = this.gameMode !== GAME_MODES.online;
    this.controls.analysisNewGameButton.disabled = this.isAnimating;
    this.controls.undoButton.style.opacity = undoDisabled ? '0.55' : '1';
    this.controls.drawButton.style.opacity = drawDisabled ? '0.55' : '1';
    this.controls.restartButton.style.opacity = restartDisabled ? '0.55' : '1';
    this.controls.quitButton.style.opacity = quitDisabled ? '0.55' : '1';
    this.renderMoveHistory();
    this.updateEvaluationBarVisual();
  }

  getModeLabel() {
    const displayMode = this.selectedGameMode || this.gameMode;
    if (this.replayState.active) {
      return 'Replay';
    }

    if (displayMode === GAME_MODES.ai) {
      return 'Vs AI';
    }

    if (displayMode === GAME_MODES.online) {
      if (this.publicMatchmakingState.active || this.onlineMatchType === ONLINE_MATCH_TYPES.publicMatchmaking) {
        return 'Public Search';
      }
      if (this.onlineMatchType === ONLINE_MATCH_TYPES.publicPvp) {
        return 'Public PvP';
      }
      if (this.onlineMatchType === ONLINE_MATCH_TYPES.publicBot) {
        return 'Public Bot';
      }
      return 'Online';
    }

    return 'Local';
  }

  getSideLabel() {
    const displayMode = this.selectedGameMode || this.gameMode;
    const playerNames = this.getDisplayedPlayerNames(displayMode);
    if (this.isPuzzleVariant()) {
      return `${COLOR_LABELS[this.activePuzzle?.fen?.split(' ')[1] || 'w']} solves`;
    }

    if (this.variantMode === VARIANT_MODES.custom) {
      return this.customEditMode ? 'Board editor' : 'Custom setup';
    }

    if (displayMode === GAME_MODES.ai) {
      return `${playerNames.w} vs ${playerNames.b}`;
    }

    if (displayMode === GAME_MODES.online) {
      return this.onlinePlayerColor
        ? `${COLOR_LABELS[this.onlinePlayerColor]} · ${playerNames[this.onlinePlayerColor]}`
        : 'Awaiting seat';
    }

    return `${playerNames.w} / ${playerNames.b}`;
  }

  getRoomLabel() {
    const displayMode = this.selectedGameMode || this.gameMode;
    if (displayMode !== GAME_MODES.online) {
      return 'Offline';
    }

    if (this.publicMatchmakingState.active) {
      return 'Public Queue';
    }

    if (this.isPublicOnlineMatch() && this.onlineRoomId) {
      return `Public ${this.onlineRoomId}`;
    }

    return this.onlineRoomId || 'Not connected';
  }

  getConnectionLabel() {
    const displayMode = this.selectedGameMode || this.gameMode;
    if (this.replayState.active) {
      return this.replayState.playing ? 'Playback running' : 'Replay paused';
    }

    if (this.agreedDraw) {
      return 'Draw agreed';
    }

    if (this.drawState.pending) {
      return 'Draw pending';
    }

    if (this.isPuzzleVariant()) {
      if (!this.manualMatchStarted) {
        return 'Press Start Game';
      }
      return this.puzzleState.solved ? 'Challenge solved' : 'Training ready';
    }

    if (displayMode === GAME_MODES.ai) {
      if (this.gameMode === GAME_MODES.ai && !this.manualMatchStarted) {
        return 'Press Start Game';
      }
      if (this.onlineUndoState.pending && this.onlineUndoState.mode === GAME_MODES.ai) {
        return 'Undo pending';
      }
      if (this.aiThinking) {
        return 'AI thinking';
      }
      if (this.aiEvaluationState.loading) {
        return 'Engine evaluating';
      }
      return this.gameMode === GAME_MODES.ai
        ? this.aiEngineReady ? 'Engine ready' : 'Engine standby'
        : 'Press Start Game';
    }

    if (displayMode === GAME_MODES.online) {
      if (this.publicMatchmakingState.active) {
        return 'Searching public';
      }
      if (this.duelIntroState.active) {
        return 'Match intro';
      }
      if (this.onlineUndoState.pending) {
        return 'Undo pending';
      }
      if (this.onlineRematchState.pending) {
        return 'Rematch pending';
      }
      if (this.gameMode !== GAME_MODES.online) {
        return 'Press Start Game';
      }
      if (!this.onlineRoomId) {
        return this.onlinePlayerToken ? 'Reconnect ready' : this.onlineConnected ? 'Server ready' : 'Connect when needed';
      }
      if (!this.onlineConnected) {
        return 'Reconnect available';
      }
      if (!this.onlineReady) {
        return 'Waiting for full room';
      }
      if (!this.onlineMatchStarted) {
        return this.onlinePlayerColor && this.onlineStartedPlayers[this.onlinePlayerColor]
          ? 'Waiting for opponent start'
          : 'Press Start Game';
      }
      if (this.isPublicBotMatch()) {
        return 'Public bot live';
      }
      if (this.onlineMatchType === ONLINE_MATCH_TYPES.publicPvp) {
        return 'Public PvP live';
      }
      return 'Room live';
    }

    return this.gameMode === GAME_MODES.local && !this.manualMatchStarted
      ? 'Press Start Game'
      : 'Local ready';
  }

  render() {
    const delta = this.clock.getDelta();
    this.updateClocks(delta);
    this.updatePuzzleTimer(delta);
    this.updateTimeScale(delta);
    const scaledDelta = delta * this.timeScaleState.current;
    this.visualTime += scaledDelta;
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const shouldAutoRotate = !this.hudCollapsed
      && !this.isAnimating
      && !this.pendingPromotion
      && !this.replayState.active
      && this.cameraRig.mode === 'idle'
      && now - this.lastInteractionAt > IDLE_CAMERA_ROTATE_DELAY_MS;
    this.controls3D.autoRotate = shouldAutoRotate;
    if (this.cameraRig.mode === 'idle' && this.focusBlend > 0.001) {
      this.controls3D.target.lerp(this.focusTarget, (1 - Math.exp(-scaledDelta * 2.6)) * this.focusBlend);
      this.focusBlend = Math.max(0, this.focusBlend - scaledDelta * 0.75);
    }
    this.updateCameraCinematic(scaledDelta);
    if (this.cameraRig.mode === 'idle') {
      this.controls3D.update();
    }
    this.updateSceneEnvironment(this.visualTime);
    this.updateAnimations(scaledDelta);
    this.animateMarkers(this.visualTime);
    this.renderer.render(this.scene, this.camera);
  }

  updateSceneEnvironment(visualTime) {
    if (this.environmentHalo) {
      this.environmentHalo.rotation.z = visualTime * 0.05;
      this.environmentHalo.material.opacity = 0.3 + Math.sin(visualTime * 0.4) * 0.06;
    }

    this.environmentArches.forEach((arch, index) => {
      arch.rotation.y += 0.0006 * (index === 0 ? 1 : -1);
      arch.position.y += Math.sin(visualTime * 0.35 + index * 1.4) * 0.0008;
    });

    this.environmentParticles.forEach((particle, index) => {
      const wave = visualTime * 0.45 + particle.userData.phase + index * 0.08;
      particle.position.y = particle.userData.baseY + Math.sin(wave) * particle.userData.radius;
      particle.position.x = particle.userData.baseX + Math.sin(wave * 0.42) * 0.34;
      particle.position.z = particle.userData.baseZ + Math.cos(wave * 0.33) * 0.28;
      particle.material.opacity = 0.13 + (Math.sin(wave * 1.3) + 1) * 0.07;
    });
  }

  updateAnimations(delta) {
    if (this.animations.length === 0) {
      return;
    }

    const activeAnimations = this.animations;
    this.animations = [];

    activeAnimations.forEach((animation) => {
      if (!animation.started) {
        animation.started = true;
        animation.onStart?.();
      }

      animation.elapsed += delta;
      const progress = Math.min(animation.elapsed / animation.duration, 1);
      animation.onUpdate?.(progress);

      if (progress >= 1) {
        animation.onComplete?.();
      } else {
        this.animations.push(animation);
      }
    });
  }

  animateMarkers(time) {
    this.moveMarkers.forEach((marker, index) => {
      const pulse = Math.sin(time * 3.2 + marker.userData.phase + index * 0.12);
      marker.position.y = BOARD_HEIGHT / 2 + 0.12 + pulse * 0.035;
      marker.rotation.z = time * 0.4;
      marker.material.opacity = marker.material.opacity > 0.9 ? 0.9 : 0.72 + (pulse + 1) * 0.08;
    });
  }
}
