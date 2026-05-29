import { Hud } from './Hud.js';
import { playSound, setAudioMuted, setAudioVolume } from './audio.js';
import {
  DEFAULT_OPTIONS,
  buildMatchConfig,
  createQuickPlayOptions,
  formatDuration,
  normalizeOptions,
  pushEventLog
} from './matchConfig.js';
import { chooseBotMove } from '../ai/bot.js';
import { LudoGame } from '../ludo/rules.js';
import { PLAYER_IDS, PLAYER_META, STATUS } from '../ludo/constants.js';
import { SAFE_COMMON_INDICES } from '../ludo/layout.js';
import { SocketRoomClient } from '../online/SocketRoomClient.js';
import {
  getLastMatchmakingState,
  getLastRoomCode,
  getOnlineSessionId,
  saveLastMatchmakingState,
  saveLastRoomCode
} from '../online/session.js';
import { LudoScene } from '../rendering/LudoScene.js';

const OPTIONS_KEY = 'ludo-royale.phase5-options';
const PHASE4_OPTIONS_KEY = 'ludo-royale.phase4-options';
const PHASE3_OPTIONS_KEY = 'ludo-royale.phase3-options';
const LEGACY_OPTIONS_KEY = 'ludo-royale.phase2-options';

function readStoredOptions(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '{}');
  } catch {
    return {};
  }
}

function loadOptions() {
  const legacy = readStoredOptions(LEGACY_OPTIONS_KEY);
  const phase3 = readStoredOptions(PHASE3_OPTIONS_KEY);
  const phase4 = readStoredOptions(PHASE4_OPTIONS_KEY);
  const saved = readStoredOptions(OPTIONS_KEY);
  return normalizeOptions({
    ...DEFAULT_OPTIONS,
    ...legacy,
    ...phase3,
    ...phase4,
    ...saved
  });
}

function saveOptions(options) {
  try {
    localStorage.setItem(OPTIONS_KEY, JSON.stringify(options));
  } catch {
    // Local preferences are optional.
  }
}

function playerLabel(playerId, matchConfig = null) {
  const label = PLAYER_META[playerId]?.label || playerId;
  return matchConfig?.controllers?.[playerId] === 'bot' ? `${label} Bot` : label;
}

function matchTypeLabel(matchType) {
  return {
    local: 'Local Multiplayer',
    bots: 'Human vs Bots',
    mixed: 'Mixed Local',
    online: 'Online Private Room',
    public: 'Public Matchmaking'
  }[matchType] || 'Local Multiplayer';
}

function clone(value) {
  return value ? JSON.parse(JSON.stringify(value)) : value;
}

export class LudoApp {
  constructor(root) {
    this.root = root;
    this.canvas = root.querySelector('#game-canvas');
    this.game = null;
    this.busy = false;
    this.botTurnRunning = false;
    this.botSequenceId = null;
    this.selectedPlayerCount = 2;
    this.sequenceId = 0;
    this.humanAssistTimer = null;
    this.recordingOrbitEnabled = false;
    this.options = loadOptions();
    this.matchConfig = buildMatchConfig(this.options);
    this.eventLog = [];
    this.matchStartedAt = null;
    this.onlineClient = new SocketRoomClient({
      onStatus: (message, tone) => this.hud?.setOnlineStatus(message, tone),
      onRoomUpdate: (room) => this.handleOnlineRoomUpdate(room),
      onGameAction: (action) => this.handleOnlineGameAction(action),
      onClosed: (payload) => this.handleOnlineClosed(payload),
      onError: (message) => this.handleOnlineError(message),
      onDisconnect: () => this.handleOnlineDisconnect(),
      onMatchmakingUpdate: (payload) => this.handleMatchmakingUpdate(payload),
      onMatchmakingFound: (payload) => this.handleMatchmakingFound(payload),
      onMatchmakingCancelled: (payload) => this.handleMatchmakingCancelled(payload),
      onMatchmakingExpired: (payload) => this.handleMatchmakingExpired(payload),
      onMatchmakingError: (message) => this.handleMatchmakingError(message)
    });
    this.onlineSessionId = getOnlineSessionId();
    this.onlineRoom = null;
    this.onlineState = null;
    this.onlinePlayerId = null;
    this.onlinePending = false;
    this.onlineAnimating = false;
    this.pendingOnlineRoom = null;
    this.lastOnlineActionSequence = 0;
    this.matchmakingState = null;
    this.matchmakingTimer = null;
    this.turnTimerRefresh = null;
    this.lastTimerBeepSecond = null;
    setAudioMuted(this.options.muted);
    setAudioVolume(this.options.volume);

    this.scene = new LudoScene(this.canvas, {
      onDiceClick: () => this.rollDice(),
      onTokenClick: (tokenId) => this.selectToken(tokenId),
      onCellClick: () => this.handleBoardClick(),
      onRecordingOrbitChange: (enabled) => this.syncRecordingOrbitState(enabled, { announce: true })
    });

    this.hud = new Hud(root, {
      onStart: (config) => this.startGame(config),
      onQuickPlay: () => this.quickPlay(),
      onRoll: () => this.rollDice(),
      onRestart: () => this.requestRestartMatch(),
      onRematch: () => this.requestRematch(),
      onResumeMatch: () => this.resumeMatch(),
      onLeaveMatch: () => this.requestLeaveMatch(),
      onChangeSettings: () => this.requestChangeSettings(),
      onOptionsChange: (options) => this.updateOptions(options),
      onCreateOnlineRoom: (config) => this.createOnlineRoom(config),
      onJoinOnlineRoom: (config) => this.joinOnlineRoom(config),
      onFindPublicMatch: (config) => this.findPublicMatch(config),
      onCancelPublicMatch: () => this.cancelPublicMatchmaking(),
      onOnlineReady: () => this.toggleOnlineReady(),
      onOnlineStart: () => this.requestStartOnlineMatch(),
      onOnlineLeave: () => this.leaveOnlineRoom({ confirm: true }),
      onOnlineConfig: (config) => this.updateOnlineLobbyConfig(config),
      onToggleRecordingOrbit: () => this.toggleRecordingOrbit()
    });

    this.scene.setCameraOptions(this.options);
    this.scene.setRecordingOrbitSpeed?.(this.options.recordingOrbitSpeed);
    this.scene.setGraphicsQuality?.(this.options.graphicsQuality);
    this.scene.start();
    this.hud.renderSetupOptions(this.options);
    if (this.hud.onlineRoomCode) {
      this.hud.onlineRoomCode.value = getLastRoomCode();
    }
    this.hud.renderCameraOptions(this.options);
    this.syncRecordingOrbitState(this.recordingOrbitEnabled);
    this.hud.render(null, { eventLog: this.eventLog });
    this.hud.showSetup();
    this.startTurnTimerRefresh();
    this.resumePublicMatchmaking();
  }

  startGame(config = this.options) {
    if (config.matchType === 'online') {
      this.hud.setOnlineStatus('Create or join a private room to start online play.', 'neutral');
      return;
    }
    if (config.matchType === 'public') {
      this.hud.setOnlineStatus('Use Find Match to enter public matchmaking.', 'neutral');
      return;
    }
    this.clearOnlineState();
    this.sequenceId += 1;
    this.clearHumanAssist();
    this.botTurnRunning = false;
    this.botSequenceId = null;
    this.options = normalizeOptions({ ...this.options, ...config });
    saveOptions(this.options);
    setAudioMuted(this.options.muted);
    setAudioVolume(this.options.volume);
    this.matchConfig = buildMatchConfig(this.options);
    this.selectedPlayerCount = this.matchConfig.playerCount;
    this.game = new LudoGame(this.selectedPlayerCount);
    this.busy = false;
    this.eventLog = [];
    this.matchStartedAt = Date.now();
    this.scene.cancelAnimations();
    this.scene.setCameraOptions(this.options);
    this.scene.setRecordingOrbitSpeed?.(this.options.recordingOrbitSpeed);
    this.scene.setGraphicsQuality?.(this.options.graphicsQuality);
    this.hud.renderSetupOptions(this.options);
    this.hud.hideSetup();
    this.hud.hideWinner();
    this.appendEvent(`${matchTypeLabel(this.matchConfig.matchType)} match started.`);
    this.render();
    playSound('match-start');
    playSound('turn');
    this.playTurnIntroForState(this.game.snapshot());
    this.scheduleBotTurn();
    this.scheduleHumanAssist();
  }

  quickPlay() {
    this.startGame(createQuickPlayOptions(this.options));
  }

  async requestRestartMatch() {
    const state = this.getStateSnapshot();
    if (state || this.onlineRoom) {
      const confirmed = await this.hud.confirmAction({
        title: state?.winner ? 'Play again?' : 'Restart match?',
        message: state?.winner
          ? 'This will start a fresh match with the current setup.'
          : 'This will reset the current board and clear match progress.',
        confirmText: state?.winner ? 'Play Again' : 'Restart',
        cancelText: 'Stay'
      });
      if (!confirmed) {
        return;
      }
    }

    this.restartGame();
  }

  restartGame() {
    if (this.isOnlineMode()) {
      if (this.onlineRoom?.roomType === 'public' && this.onlineRoom?.status === 'finished') {
        const localPlayer = this.onlineRoom.players.find((player) => player.playerSessionId === this.onlineSessionId);
        const nextConfig = {
          displayName: localPlayer?.displayName || '',
          playerCount: this.onlineRoom.playerCount || 2,
          preferredColor: localPlayer?.playerId || 'red'
        };
        this.leaveOnlineRoom().then(() => this.findPublicMatch(nextConfig));
        return;
      }
      this.leaveOnlineRoom();
      return;
    }
    this.sequenceId += 1;
    this.clearHumanAssist();
    this.botTurnRunning = false;
    this.botSequenceId = null;
    this.scene.cancelAnimations();
    this.busy = false;
    if (!this.game) {
      this.hud.showSetup();
      return;
    }

    this.game.restart(this.selectedPlayerCount);
    this.eventLog = [];
    this.matchStartedAt = Date.now();
    this.hud.hideWinner();
    this.appendEvent('Match restarted.');
    this.render();
    playSound('match-start');
    playSound('turn');
    this.playTurnIntroForState(this.game.snapshot());
    this.scheduleBotTurn();
    this.scheduleHumanAssist();
  }

  async requestLeaveMatch() {
    if (this.isOnlineMode()) {
      await this.leaveOnlineRoom({ confirm: true });
      return;
    }

    if (!this.game) {
      this.hud.showSetup();
      return;
    }

    const confirmed = await this.hud.confirmAction({
      title: 'Exit local match?',
      message: 'This will leave the current local match and return to setup.',
      confirmText: 'Exit Match',
      cancelText: 'Stay'
    });
    if (!confirmed) {
      return;
    }

    this.exitLocalMatch();
  }

  exitLocalMatch() {
    this.sequenceId += 1;
    this.clearHumanAssist();
    this.botTurnRunning = false;
    this.botSequenceId = null;
    this.scene.cancelAnimations();
    this.busy = false;
    this.game = null;
    this.eventLog = [];
    this.matchStartedAt = null;
    this.hud.hideWinner();
    this.hud.renderSetupOptions(this.options);
    this.hud.showSetup();
    this.render();
    this.hud.setStatus('Returned to setup.', 'neutral');
    playSound('room-leave');
  }

  async requestChangeSettings() {
    const state = this.getStateSnapshot();
    if (state || this.onlineRoom) {
      const confirmed = await this.hud.confirmAction({
        title: 'Change settings?',
        message: this.isOnlineMode()
          ? 'This will leave the online match flow and return to setup.'
          : 'This will leave the current match and return to setup.',
        confirmText: 'Change Settings',
        cancelText: 'Stay'
      });
      if (!confirmed) {
        return;
      }
    }

    this.changeSettings();
  }

  changeSettings() {
    if (this.isOnlineMode()) {
      this.clearOnlineState();
    }
    this.sequenceId += 1;
    this.clearHumanAssist();
    this.botTurnRunning = false;
    this.botSequenceId = null;
    this.busy = false;
    this.scene.cancelAnimations();
    this.hud.hideWinner();
    this.hud.renderSetupOptions(this.options);
    this.hud.showSetup();
    playSound('ui-open');
  }

  updateOptions(options) {
    this.options = normalizeOptions({ ...this.options, ...options });
    saveOptions(this.options);
    setAudioMuted(this.options.muted);
    setAudioVolume(this.options.volume);
    this.scene.setCameraOptions(this.options);
    this.scene.setGraphicsQuality?.(this.options.graphicsQuality);
    this.hud.renderCameraOptions(this.options);
  }

  toggleRecordingOrbit() {
    const enabled = this.scene.setRecordingOrbit(!this.recordingOrbitEnabled);
    this.syncRecordingOrbitState(enabled, { announce: true });
  }

  syncRecordingOrbitState(enabled, { announce = false } = {}) {
    this.recordingOrbitEnabled = Boolean(enabled);
    this.hud.setRecordingOrbit?.(this.recordingOrbitEnabled);
    if (announce) {
      this.hud.setStatus(
        this.recordingOrbitEnabled
          ? `Record Orbit is on at ${this.options.recordingOrbitSpeed}x. The camera will rotate around the board.`
          : 'Record Orbit stopped.',
        this.recordingOrbitEnabled ? 'success' : 'neutral'
      );
    }
  }

  resumeMatch() {
    this.hud.setStatus(this.isOnlineMode() ? 'Online match view resumed.' : 'Local match resumed.', 'neutral');
    this.render();
  }

  nextSequence() {
    this.sequenceId += 1;
    return this.sequenceId;
  }

  isSequenceActive(sequenceId) {
    return sequenceId === this.sequenceId;
  }

  isOnlineMode() {
    return this.matchConfig?.matchType === 'online'
      || this.matchConfig?.matchType === 'public'
      || Boolean(this.onlineRoom);
  }

  isPublicOnlineRoom() {
    return this.onlineRoom?.roomType === 'public' || this.matchConfig?.matchType === 'public';
  }

  getStateSnapshot() {
    return this.isOnlineMode() ? clone(this.onlineState) : this.game?.snapshot();
  }

  currentController(playerId = this.game?.state.currentPlayer) {
    if (this.isOnlineMode()) {
      return 'human';
    }
    return this.matchConfig?.controllers?.[playerId] || 'human';
  }

  isCurrentBotTurn() {
    if (this.isOnlineMode()) {
      return false;
    }
    return this.game
      && this.currentController(this.game.state.currentPlayer) === 'bot'
      && !this.game.state.winner;
  }

  render() {
    const state = this.getStateSnapshot();
    const playerNames = this.getPlayerDisplayNames(state);
    const playerTimers = this.getPlayerTimers(state);
    if (state) {
      this.scene.setState(state, {
        ...this.getSceneCameraOptions(state),
        playerDisplayNames: playerNames,
        playerTimers
      });
    }
    this.hud.render(state, {
      busy: this.busy,
      matchConfig: this.matchConfig,
      eventLog: this.eventLog,
      onlinePlayerId: this.onlinePlayerId,
      onlineMode: this.isOnlineMode(),
      onlinePending: this.onlinePending,
      onlineRoomCode: this.onlineRoom?.roomType === 'public' ? '' : this.onlineRoom?.roomCode || '',
      playerNames,
      playerTimers
    });
    if (this.isOnlineMode() && state && !state.winner) {
      if (this.onlineRoom?.status === 'paused') {
        this.hud.setStatus(this.onlineRoom?.roomType === 'public' ? 'Player disconnected. Match paused.' : 'Host disconnected. Match paused.', 'danger');
      } else if (state.currentPlayer !== this.onlinePlayerId) {
        this.hud.setStatus(`Waiting for ${PLAYER_META[state.currentPlayer].label}.`, 'neutral');
      } else if (state.phase === STATUS.AWAITING_ROLL) {
        this.hud.setStatus('Your turn. Roll the dice.', 'success');
      }
    }
  }

  startTurnTimerRefresh() {
    if (this.turnTimerRefresh) {
      window.clearInterval(this.turnTimerRefresh);
    }
    this.turnTimerRefresh = window.setInterval(() => this.refreshTimerDisplays(), 500);
  }

  refreshTimerDisplays() {
    const state = this.getStateSnapshot();
    if (!state) {
      return;
    }
    const playerNames = this.getPlayerDisplayNames(state);
    const playerTimers = this.getPlayerTimers(state);
    this.hud.renderTimers(state, { playerNames, playerTimers });
    this.scene.updatePlayerInfoPanels?.(state, playerNames, playerTimers);
    this.maybePlayTimerBeep(state, playerTimers);
  }

  getPlayerDisplayNames(state = this.getStateSnapshot()) {
    if (!state?.activePlayers) {
      return {};
    }
    return Object.fromEntries(state.activePlayers.map((playerId) => {
      const meta = PLAYER_META[playerId];
      if (this.isOnlineMode()) {
        const onlinePlayer = this.onlineRoom?.players?.find((player) => player.playerId === playerId);
        if (onlinePlayer?.controller === 'server-bot') {
          return [playerId, `${meta.label} Bot`];
        }
        return [playerId, onlinePlayer?.displayName || `${meta.label} Player`];
      }
      const controller = this.matchConfig?.controllers?.[playerId] || 'human';
      return [playerId, controller === 'bot' ? `${meta.label} Bot` : `${meta.label} Player`];
    }));
  }

  getPlayerTimers(state = this.getStateSnapshot()) {
    if (!state?.activePlayers) {
      return {};
    }
    if (!this.isOnlineMode() || this.onlineRoom?.status !== 'playing' || !this.onlineRoom?.turnDeadlineAt) {
      return {};
    }
    const duration = this.onlineRoom.turnDurationMs || 60_000;
    const remaining = Math.max(0, Number(this.onlineRoom.turnDeadlineAt) - Date.now());
    return Object.fromEntries(state.activePlayers.map((playerId) => {
      const active = state.currentPlayer === playerId;
      return [playerId, {
        label: active ? this.formatTimer(remaining) : this.formatTimer(duration),
        remainingMs: active ? remaining : duration,
        active,
        urgent: active && remaining <= 10_000
      }];
    }));
  }

  formatTimer(ms = 0) {
    const total = Math.max(0, Math.ceil(Number(ms || 0) / 1000));
    const minutes = Math.floor(total / 60);
    const seconds = String(total % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  maybePlayTimerBeep(state, timers) {
    if (!this.isOnlineMode() || state.currentPlayer !== this.onlinePlayerId) {
      this.lastTimerBeepSecond = null;
      return;
    }
    const timer = timers[state.currentPlayer];
    if (!timer?.urgent || timer.remainingMs <= 0) {
      this.lastTimerBeepSecond = null;
      return;
    }
    const second = Math.ceil(timer.remainingMs / 1000);
    if (second !== this.lastTimerBeepSecond) {
      this.lastTimerBeepSecond = second;
      playSound('timer-beep');
    }
  }

  getSceneCameraOptions(state) {
    if (!state) {
      return {};
    }

    if (this.isOnlineMode()) {
      return {
        moveCamera: Boolean(this.onlinePlayerId),
        cameraPlayerId: this.onlinePlayerId || state.currentPlayer
      };
    }

    return {
      moveCamera: this.currentController(state.currentPlayer) === 'human',
      cameraPlayerId: state.currentPlayer
    };
  }

  playTurnIntroForState(state) {
    if (!state) {
      return Promise.resolve(false);
    }

    const cameraOptions = this.getSceneCameraOptions(state);
    return this.scene.playTurnIntro(state, cameraOptions);
  }

  shouldSuppressActionCamera(actorOrPlayerId) {
    if (this.isOnlineMode()) {
      return actorOrPlayerId !== this.onlinePlayerId;
    }

    return actorOrPlayerId === 'bot';
  }

  clearHumanAssist() {
    if (this.humanAssistTimer) {
      window.clearTimeout(this.humanAssistTimer);
      this.humanAssistTimer = null;
    }
  }

  scheduleHumanAssist(delay = 760) {
    this.clearHumanAssist();
    const state = this.getStateSnapshot();
    if (!state || state.winner || this.busy || this.botTurnRunning || this.onlinePending || this.onlineAnimating) {
      return;
    }

    const onlineMode = this.isOnlineMode();
    if (onlineMode && (this.onlineRoom?.status !== 'playing' || state.currentPlayer !== this.onlinePlayerId)) {
      return;
    }

    if (!onlineMode && this.currentController(state.currentPlayer) !== 'human') {
      return;
    }

    const assistType = this.getHumanAssistType(state, onlineMode);
    if (!assistType) {
      return;
    }

    const scheduledSequence = this.sequenceId;
    this.humanAssistTimer = window.setTimeout(async () => {
      this.humanAssistTimer = null;
      const latestState = this.getStateSnapshot();
      if (scheduledSequence !== this.sequenceId || !latestState || latestState.winner || this.busy || this.onlinePending || this.onlineAnimating) {
        return;
      }

      if (assistType === 'auto-roll' && latestState.phase === STATUS.AWAITING_ROLL) {
        const label = onlineMode ? 'Auto rolling until a token can enter.' : 'Auto rolling until an opening 6 appears.';
        this.hud.setStatus(label, 'neutral');
        await this.rollDice();
        return;
      }

      if (assistType === 'single-move' && latestState.phase === STATUS.AWAITING_TOKEN && latestState.availableMoves?.length === 1) {
        this.hud.setStatus('Only one legal move - moving token.', 'neutral');
        await this.selectToken(latestState.availableMoves[0].tokenId);
      }
    }, delay);
  }

  getHumanAssistType(state, onlineMode = this.isOnlineMode()) {
    if (state.phase === STATUS.AWAITING_TOKEN && state.availableMoves?.length === 1) {
      return 'single-move';
    }

    if (state.phase !== STATUS.AWAITING_ROLL) {
      return null;
    }

    const playerTokens = state.tokens?.[state.currentPlayer] || [];
    const hasBaseToken = playerTokens.some((token) => token.state === 'base');
    const hasActiveToken = playerTokens.some((token) => token.state === 'track' || token.state === 'home-lane');
    if (!hasBaseToken || hasActiveToken) {
      return null;
    }

    return onlineMode || this.currentController(state.currentPlayer) === 'human' ? 'auto-roll' : null;
  }

  async rollDice() {
    this.clearHumanAssist();
    if (this.isOnlineMode()) {
      await this.submitOnlineRoll();
      return;
    }

    if (!this.game || this.busy || this.isCurrentBotTurn()) {
      return;
    }

    const state = this.game.state;
    if (state.phase !== STATUS.AWAITING_ROLL || state.winner) {
      this.hud.setStatus(state.phase === STATUS.AWAITING_TOKEN ? 'Select a highlighted token.' : 'Dice is not ready.');
      playSound('invalid');
      return;
    }

    const sequenceId = this.nextSequence();
    const result = await this.executeRoll(sequenceId, 'human');
    if (!this.isSequenceActive(sequenceId) || !result) {
      return;
    }

    if (result.legalMoves.length === 0) {
      this.scheduleBotTurn();
      this.scheduleHumanAssist();
      return;
    }
    this.scheduleHumanAssist();
  }

  async selectToken(tokenId) {
    this.clearHumanAssist();
    if (this.isOnlineMode()) {
      await this.submitOnlineMove(tokenId);
      return;
    }

    if (!this.game || this.busy || this.isCurrentBotTurn()) {
      return;
    }

    const state = this.game.state;
    const isLegal = state.availableMoves.some((move) => move.tokenId === tokenId);
    if (!isLegal) {
      const message = state.phase === STATUS.AWAITING_ROLL
        ? 'Roll the dice before selecting a token.'
        : 'That token cannot move for this dice roll.';
      this.hud.setStatus(message);
      this.scene.pulseInvalidToken(tokenId);
      playSound('invalid');
      return;
    }

    const sequenceId = this.nextSequence();
    const result = await this.executeMove(sequenceId, tokenId, 'human');
    if (!this.isSequenceActive(sequenceId) || !result?.ok || result.winner) {
      return;
    }

    this.scheduleBotTurn();
    this.scheduleHumanAssist();
  }

  async executeRoll(sequenceId, actor) {
    if (!this.game || this.game.state.phase !== STATUS.AWAITING_ROLL || this.game.state.winner) {
      return null;
    }

    const playerId = this.game.state.currentPlayer;
    const label = playerLabel(playerId, this.matchConfig);
    this.busy = true;
    this.render();
    this.hud.setStatus(`${label} is rolling...`, 'neutral');
    const result = this.game.rollDice();
    this.appendEvent(`${label} rolled ${result.diceValue}.`);
    await this.scene.animateDiceSequence(result.diceValue, {
      onRollStart: () => playSound('dice'),
      suppressCamera: this.shouldSuppressActionCamera(actor)
    });
    if (!this.isSequenceActive(sequenceId)) {
      return null;
    }

    playSound('dice-result');
    this.busy = false;

    if (result.legalMoves.length === 0) {
      this.appendEvent(`${label} had no valid move.`, 'neutral');
      this.render();
      this.hud.animateDiceValue(result.diceValue);
      this.hud.setStatus(`${label} had no valid move.`, 'neutral');
      await this.wait(this.getBotAwareDelay('pass', actor), sequenceId);
      if (!this.isSequenceActive(sequenceId)) {
        return null;
      }
      playSound('turn');
      this.playTurnIntroForState(this.game.snapshot());
      return result;
    }

    this.render();
    this.hud.animateDiceValue(result.diceValue);
    if (actor === 'bot') {
      this.hud.setStatus(`${label} is thinking...`, 'neutral');
    }
    return result;
  }

  async executeMove(sequenceId, tokenId, actor, botChoice = null) {
    if (!this.game || this.game.state.phase !== STATUS.AWAITING_TOKEN) {
      return null;
    }

    this.busy = true;
    this.scene.setSelectedToken(tokenId);
    this.render();
    const result = this.game.moveToken(tokenId);
    if (!result.ok) {
      this.busy = false;
      this.scene.pulseInvalidToken(tokenId);
      this.render();
      if (actor === 'human') {
        playSound('invalid');
      }
      return result;
    }

    await this.scene.animateTokenMove(
      tokenId,
      result.path,
      result.captures,
      result.state,
      () => {
        playSound('move');
      },
      {
        reachedHome: result.reachedHome,
        tokenSpeed: this.options.tokenSpeed,
        suppressCamera: this.shouldSuppressActionCamera(actor),
        allowTurnCamera: this.getSceneCameraOptions(result.state).moveCamera,
        turnCameraPlayerId: this.getSceneCameraOptions(result.state).cameraPlayerId
      }
    );
    if (!this.isSequenceActive(sequenceId)) {
      return null;
    }

    this.appendMoveEvents(result, actor, botChoice);
    if (result.captures.length) {
      playSound('capture');
    }
    if (this.didEnterHomeLane(result)) {
      playSound('home-entry');
    }
    if (this.didLandSafe(result)) {
      playSound('safe');
    }
    if (result.reachedHome) {
      playSound('home');
    }
    if (result.winner) {
      playSound('win');
    }

    const postMoveStatus = this.getPostMoveStatus(result, actor, botChoice);
    this.busy = false;
    this.render();
    if (postMoveStatus) {
      this.hud.setStatus(postMoveStatus.message, postMoveStatus.tone);
    }

    if (result.winner) {
      await this.scene.playWinnerCamera(result.winner);
      if (!this.isSequenceActive(sequenceId)) {
        return null;
      }
      this.hud.showWinner(result.winner, this.buildWinnerSummary(result.state, result.winner));
    } else {
      playSound('turn');
      this.playTurnIntroForState(this.game.snapshot());
    }

    return result;
  }

  scheduleBotTurn() {
    if (!this.game || this.busy || this.botTurnRunning || this.game.state.winner) {
      return;
    }
    if (this.game.state.phase !== STATUS.AWAITING_ROLL || !this.isCurrentBotTurn()) {
      return;
    }

    const sequenceId = this.nextSequence();
    this.botSequenceId = sequenceId;
    this.runBotTurnLoop(sequenceId);
  }

  async runBotTurnLoop(sequenceId) {
    this.botTurnRunning = true;
    try {
      while (
        this.isSequenceActive(sequenceId)
        && this.game
        && !this.game.state.winner
        && this.game.state.phase === STATUS.AWAITING_ROLL
        && this.isCurrentBotTurn()
      ) {
        const playerId = this.game.state.currentPlayer;
        const label = playerLabel(playerId, this.matchConfig);
        await this.wait(this.getBotAwareDelay('turn', 'bot'), sequenceId);
        if (!this.isSequenceActive(sequenceId)) {
          return;
        }

        this.hud.setStatus(`${label} is rolling...`, 'neutral');
        const rollResult = await this.executeRoll(sequenceId, 'bot');
        if (!this.isSequenceActive(sequenceId) || !rollResult) {
          return;
        }

        if (rollResult.legalMoves.length === 0) {
          continue;
        }

        await this.wait(this.getBotAwareDelay('think', 'bot'), sequenceId);
        if (!this.isSequenceActive(sequenceId)) {
          return;
        }

        const snapshot = this.game.snapshot();
        const currentPlayer = snapshot.currentPlayer;
        const currentLabel = playerLabel(currentPlayer, this.matchConfig);
        this.hud.setStatus(`${currentLabel} is thinking...`, 'neutral');
        const choice = chooseBotMove(snapshot, {
          playerId: currentPlayer,
          difficulty: this.matchConfig.botProfiles[currentPlayer]?.difficulty,
          personality: this.matchConfig.botProfiles[currentPlayer]?.personality,
          rng: Math.random
        });
        playSound('bot-turn');

        if (!choice) {
          this.appendEvent(`${currentLabel} had no move to choose.`, 'neutral');
          this.render();
          continue;
        }

        await this.wait(this.getBotAwareDelay('select', 'bot'), sequenceId);
        if (!this.isSequenceActive(sequenceId)) {
          return;
        }

        const moveResult = await this.executeMove(sequenceId, choice.tokenId, 'bot', choice);
        if (!this.isSequenceActive(sequenceId) || !moveResult || moveResult.winner) {
          return;
        }
      }
    } finally {
      if (this.botSequenceId === sequenceId) {
        this.botTurnRunning = false;
        this.botSequenceId = null;
      }
      if (this.isSequenceActive(sequenceId)) {
        this.render();
        this.scheduleHumanAssist();
      }
    }
  }

  handleBoardClick() {
    if (this.isOnlineMode()) {
      const state = this.onlineState;
      if (!state || this.busy || this.onlinePending || state.currentPlayer !== this.onlinePlayerId) {
        return;
      }
      if (state.phase === STATUS.AWAITING_TOKEN) {
        this.hud.setStatus('Select one of your highlighted tokens.');
        playSound('invalid');
      }
      return;
    }

    if (!this.game || this.busy || this.isCurrentBotTurn()) {
      return;
    }

    const state = this.game.state;
    if (state.phase === STATUS.AWAITING_TOKEN) {
      const player = PLAYER_META[state.currentPlayer];
      this.hud.setStatus(`${player.label} must select a highlighted token.`);
      playSound('invalid');
    }
  }

  buildOnlinePayload(extra = {}) {
    return {
      sessionId: this.onlineSessionId,
      roomCode: this.onlineRoom?.roomCode,
      ...extra
    };
  }

  setOnlineMatchConfig(room) {
    this.matchConfig = buildMatchConfig({
      ...this.options,
      matchType: room?.roomType === 'public' ? 'public' : 'online',
      playerCount: room?.playerCount || 2
    });
    const controllers = { ...this.matchConfig.controllers };
    const botProfiles = { ...this.matchConfig.botProfiles };
    room?.players?.forEach((player) => {
      if (player.controller === 'server-bot') {
        controllers[player.playerId] = 'bot';
        botProfiles[player.playerId] = player.botProfile || { difficulty: 'medium', personality: 'balanced' };
      } else if (player.playerId) {
        controllers[player.playerId] = 'human';
      }
    });
    this.matchConfig = {
      ...this.matchConfig,
      controllers,
      botProfiles
    };
    this.selectedPlayerCount = this.matchConfig.playerCount;
    const localPlayer = room?.players?.find((player) => player.playerSessionId === this.onlineSessionId);
    this.onlinePlayerId = localPlayer?.playerId || this.onlinePlayerId;
  }

  async createOnlineRoom(config) {
    this.sequenceId += 1;
    this.clearLocalRuntimeForOnline();
    this.hud.setOnlineBusy(true);
    this.hud.setLoading(true, 'Creating private room...');
    this.hud.setOnlineStatus('Creating private room...', 'neutral');
    const result = await this.onlineClient.createRoom({
      sessionId: this.onlineSessionId,
      displayName: config.displayName,
      preferredColor: config.preferredColor,
      playerCount: config.playerCount
    });
    this.hud.setOnlineBusy(false);
    this.hud.setLoading(false);
    if (!result.ok) {
      this.hud.setOnlineStatus(result.message || 'Online server is unavailable. Local modes still work.', 'danger');
      playSound('invalid');
      return;
    }
    saveLastRoomCode(result.roomCode);
    this.applyOnlineRoom(result.room);
    this.hud.showOnlineLobby(result.room, this.onlineSessionId);
    this.hud.setOnlineStatus('Room created. Share the code when ready.', 'success');
    playSound('room-join');
  }

  async joinOnlineRoom(config) {
    this.sequenceId += 1;
    this.clearLocalRuntimeForOnline();
    this.hud.setOnlineBusy(true);
    this.hud.setLoading(true, 'Joining private room...');
    this.hud.setOnlineStatus('Joining private room...', 'neutral');
    const result = await this.onlineClient.joinRoom({
      sessionId: this.onlineSessionId,
      displayName: config.displayName,
      roomCode: config.roomCode,
      preferredColor: config.preferredColor
    });
    this.hud.setOnlineBusy(false);
    this.hud.setLoading(false);
    if (!result.ok) {
      this.hud.setOnlineStatus(result.message || 'Unable to join room.', 'danger');
      playSound('invalid');
      return;
    }
    saveLastRoomCode(result.roomCode);
    this.applyOnlineRoom(result.room);
    this.hud.showOnlineLobby(result.room, this.onlineSessionId);
    this.hud.setOnlineStatus('Joined room. Mark ready when seated.', 'success');
    playSound('room-join');
  }

  async findPublicMatch(config) {
    this.sequenceId += 1;
    this.clearLocalRuntimeForOnline();
    this.clearOnlineState({ keepMatchmaking: true });
    this.matchConfig = buildMatchConfig({
      ...this.options,
      matchType: 'public',
      playerCount: config.playerCount || 2
    });
    this.hud.setOnlineBusy(true);
    this.hud.setLoading(true, 'Searching for players...');
    this.hud.setOnlineStatus('Searching for a public match...', 'neutral');
    const result = await this.onlineClient.joinMatchmaking({
      sessionId: this.onlineSessionId,
      displayName: config.displayName,
      playerCount: config.playerCount,
      preferredColor: config.preferredColor,
      botFillMode: config.botFillMode || 'after-wait',
      botDifficulty: config.botDifficulty || 'medium',
      botPersonality: config.botPersonality || 'balanced',
      matchSpeed: config.matchSpeed || 'normal'
    });
    this.hud.setOnlineBusy(false);
    this.hud.setLoading(false);
    if (!result.ok) {
      this.hud.setOnlineStatus(result.message || 'Online server is unavailable. Local modes still work.', 'danger');
      playSound('invalid');
      return;
    }

    this.applyMatchmakingState({
      queue: result.queue,
      message: result.status === 'matched' ? 'Match found.' : 'Searching for a public match.'
    });
    if (result.room) {
      this.handleMatchmakingFound({ room: result.room, queue: result.queue });
    }
  }

  async cancelPublicMatchmaking() {
    if (!this.matchmakingState && this.onlineRoom?.roomType !== 'public') {
      return;
    }
    const confirmed = await this.hud.confirmAction({
      title: this.onlineRoom?.status === 'countdown' ? 'Cancel public match?' : 'Cancel search?',
      message: this.onlineRoom?.status === 'countdown'
        ? 'This will cancel the match-found countdown and return other players to search.'
        : 'This will leave the public matchmaking queue.',
      confirmText: this.onlineRoom?.status === 'countdown' ? 'Cancel Match' : 'Cancel Search',
      cancelText: 'Stay'
    });
    if (!confirmed) {
      return;
    }

    this.hud.setOnlineBusy(true);
    await this.onlineClient.cancelMatchmaking({
      sessionId: this.onlineSessionId,
      roomCode: this.onlineRoom?.roomCode
    });
    this.hud.setOnlineBusy(false);
    this.clearMatchmakingState();
    if (this.onlineRoom?.status === 'countdown') {
      this.clearOnlineState();
      this.hud.hideOnlineLobby();
      this.hud.showSetup();
    }
    this.hud.setOnlineStatus('Public search cancelled.', 'neutral');
    playSound('ui-cancel');
  }

  async toggleOnlineReady() {
    if (!this.onlineRoom) {
      return;
    }
    const player = this.onlineRoom.players.find((candidate) => candidate.playerSessionId === this.onlineSessionId);
    if (!player || player.isHost) {
      return;
    }
    this.hud.setOnlineBusy(true);
    const result = await this.onlineClient.setReady(this.buildOnlinePayload({ ready: !player.ready }));
    this.hud.setOnlineBusy(false);
    if (!result.ok) {
      this.hud.setOnlineStatus(result.message || 'Ready update failed.', 'danger');
      playSound('invalid');
    } else {
      playSound('room-ready');
    }
  }

  async updateOnlineLobbyConfig(config) {
    if (!this.onlineRoom) {
      return;
    }
    const player = this.onlineRoom.players.find((candidate) => candidate.playerSessionId === this.onlineSessionId);
    if (!player?.isHost) {
      return;
    }
    this.hud.setOnlineBusy(true);
    const result = await this.onlineClient.updateLobbyConfig(this.buildOnlinePayload({ config }));
    this.hud.setOnlineBusy(false);
    if (!result.ok) {
      this.hud.setOnlineStatus(result.message || 'Lobby settings update failed.', 'danger');
      playSound('invalid');
    } else {
      playSound('ui-confirm');
    }
  }

  async startOnlineMatch() {
    if (!this.onlineRoom) {
      return;
    }
    this.hud.setOnlineBusy(true);
    this.hud.setOnlineStatus('Starting online match...', 'neutral');
    const result = await this.onlineClient.startMatch(this.buildOnlinePayload());
    this.hud.setOnlineBusy(false);
    if (!result.ok) {
      this.hud.setOnlineStatus(result.message || 'Unable to start match.', 'danger');
      playSound('invalid');
    } else {
      playSound('match-start');
    }
  }

  async requestStartOnlineMatch() {
    if (!this.onlineRoom) {
      return;
    }
    const confirmed = await this.hud.confirmAction({
      title: 'Start online match?',
      message: 'This will lock the lobby and start the match for all seated players.',
      confirmText: 'Start Match',
      cancelText: 'Stay'
    });
    if (!confirmed) {
      return;
    }

    await this.startOnlineMatch();
  }

  async requestRematch() {
    if (this.isOnlineMode() && this.onlineRoom?.status === 'finished') {
      const confirmed = await this.hud.confirmAction({
        title: 'Request rematch?',
        message: 'This will send a rematch request using the same room and players.',
        confirmText: 'Request Rematch',
        cancelText: 'Stay'
      });
      if (!confirmed) {
        return;
      }
    }

    await this.voteRematch();
  }

  async voteRematch() {
    if (!this.isOnlineMode() || !this.onlineRoom || this.onlineRoom.status !== 'finished') {
      this.restartGame();
      return;
    }
    this.hud.setOnlineBusy(true);
    const result = await this.onlineClient.voteRematch(this.buildOnlinePayload({ accepted: true }));
    this.hud.setOnlineBusy(false);
    if (!result.ok) {
      this.hud.setOnlineStatus(result.message || 'Rematch vote failed.', 'danger');
      playSound('invalid');
      return;
    }
    this.applyOnlineRoom(result.room);
    this.hud.setOnlineStatus(result.accepted ? 'Rematch started.' : 'Rematch vote sent.', 'success');
    playSound('ui-confirm');
  }

  async leaveOnlineRoom({ confirm = false } = {}) {
    const leavingPublic = this.onlineRoom?.roomType === 'public';
    if (confirm) {
      const confirmed = await this.hud.confirmAction({
        title: leavingPublic ? 'Leave public match?' : 'Leave online room?',
        message: leavingPublic
          ? 'This will leave the public match. If play has started, the match may pause for the other players.'
          : 'You will leave this room match. Your seat may be marked offline for the other players.',
        confirmText: leavingPublic ? 'Leave Match' : 'Leave Room',
        cancelText: 'Stay'
      });
      if (!confirmed) {
        return;
      }
    }

    const roomCode = this.onlineRoom?.roomCode;
    if (roomCode) {
      this.hud.setOnlineBusy(true);
      if (leavingPublic && this.onlineRoom?.status === 'countdown') {
        await this.onlineClient.cancelMatchmaking(this.buildOnlinePayload());
      } else {
        await this.onlineClient.leaveRoom(this.buildOnlinePayload());
      }
      this.hud.setOnlineBusy(false);
    }
    saveLastRoomCode('');
    saveLastMatchmakingState(null);
    this.clearOnlineState();
    this.hud.hideOnlineLobby();
    this.hud.hideWinner();
    this.hud.showSetup();
    this.hud.setOnlineStatus(leavingPublic ? 'Left public match. Local modes still work.' : 'Left online room. Local modes still work.', 'neutral');
    this.render();
    playSound('room-leave');
  }

  applyMatchmakingState(payload = null) {
    this.matchmakingState = payload?.queue || payload || null;
    if (this.matchmakingState) {
      saveLastMatchmakingState({
        status: this.matchmakingState.status,
        roomCode: this.matchmakingState.matchedRoomCode || this.onlineRoom?.roomCode || '',
        playerCount: this.matchmakingState.requestedPlayerCount
      });
      this.matchConfig = buildMatchConfig({
        ...this.options,
        matchType: 'public',
        playerCount: this.matchmakingState.requestedPlayerCount || this.matchConfig.playerCount || 2
      });
      this.hud.renderSetupOptions({ ...this.options, matchType: 'public' });
      this.startMatchmakingTimer();
    }
    this.hud.renderMatchmakingState(payload);
  }

  clearMatchmakingState() {
    if (this.matchmakingTimer) {
      window.clearInterval(this.matchmakingTimer);
      this.matchmakingTimer = null;
    }
    this.matchmakingState = null;
    saveLastMatchmakingState(null);
    this.hud.clearMatchmakingState();
  }

  startMatchmakingTimer() {
    if (this.matchmakingTimer) {
      window.clearInterval(this.matchmakingTimer);
    }
    this.matchmakingTimer = window.setInterval(() => {
      if (!this.matchmakingState) {
        this.clearMatchmakingState();
        return;
      }
      this.hud.renderMatchmakingState(this.matchmakingState);
      if (this.onlineRoom?.status === 'countdown') {
        this.hud.renderOnlineLobby(this.onlineRoom, this.onlineSessionId);
      }
    }, 1000);
  }

  async resumePublicMatchmaking() {
    const saved = getLastMatchmakingState();
    if (!saved?.status && !saved?.roomCode) {
      return;
    }
    const result = await this.onlineClient.reconnectMatchmaking({
      sessionId: this.onlineSessionId,
      roomCode: saved.roomCode || ''
    });
    if (!result.ok) {
      saveLastMatchmakingState(null);
      return;
    }
    if (result.queue) {
      this.applyMatchmakingState({
        queue: result.queue,
        message: result.room ? 'Public match restored.' : 'Search restored.'
      });
    }
    if (result.room) {
      this.applyOnlineRoom(result.room);
    }
  }

  handleMatchmakingUpdate(payload) {
    this.applyMatchmakingState(payload);
  }

  handleMatchmakingFound(payload) {
    if (!payload?.room) {
      return;
    }
    saveLastRoomCode(payload.room.roomCode);
    saveLastMatchmakingState({
      status: 'matched',
      roomCode: payload.room.roomCode,
      playerCount: payload.room.playerCount
    });
    this.applyMatchmakingState(payload.queue ? { queue: payload.queue, message: 'Match found.' } : {
      status: 'matched',
      joinedAt: Date.now(),
      requestedPlayerCount: payload.room.playerCount,
      matchedRoomCode: payload.room.roomCode
    });
    this.applyOnlineRoom(payload.room);
    this.hud.setOnlineStatus('Match found. Preparing the table...', 'success');
    playSound('room-join');
  }

  handleMatchmakingCancelled(payload = {}) {
    this.clearMatchmakingState();
    if (this.onlineRoom?.status === 'countdown') {
      this.clearOnlineState();
      this.hud.hideOnlineLobby();
      this.hud.showSetup();
    }
    this.hud.setOnlineStatus(payload.message || 'Public search cancelled.', 'neutral');
  }

  handleMatchmakingExpired(payload = {}) {
    this.clearMatchmakingState();
    this.hud.setOnlineStatus(payload.message || 'Public search expired. Try again.', 'danger');
    playSound('invalid');
  }

  handleMatchmakingError(message) {
    this.hud.setOnlineStatus(message || 'Public matchmaking failed.', 'danger');
    playSound('invalid');
  }

  clearLocalRuntimeForOnline() {
    this.clearHumanAssist();
    this.botTurnRunning = false;
    this.botSequenceId = null;
    this.game = null;
    this.busy = false;
    this.onlinePending = false;
    this.onlineAnimating = false;
    this.pendingOnlineRoom = null;
    this.scene.cancelAnimations();
  }

  clearOnlineState({ keepMatchmaking = false } = {}) {
    this.clearHumanAssist();
    this.onlineRoom = null;
    this.onlineState = null;
    this.onlinePlayerId = null;
    this.onlinePending = false;
    this.onlineAnimating = false;
    this.pendingOnlineRoom = null;
    this.lastOnlineActionSequence = 0;
    this.game = null;
    this.matchConfig = buildMatchConfig(this.options);
    this.hud.hideOnlineLobby();
    if (!keepMatchmaking) {
      this.clearMatchmakingState();
    }
  }

  applyOnlineRoom(room) {
    if (!room) {
      return;
    }
    const previousStatus = this.onlineRoom?.status;
    this.onlineRoom = room;
    this.setOnlineMatchConfig(room);
    this.eventLog = room.eventLog || [];
    this.matchStartedAt = room.matchStartedAt || this.matchStartedAt || Date.now();
    if (room.gameSnapshot) {
      this.onlineState = clone(room.gameSnapshot);
    }

    if (room.status === 'lobby' || room.status === 'countdown') {
      this.onlineState = null;
      this.hud.hideWinner();
      this.hud.showOnlineLobby(room, this.onlineSessionId);
      if (room.status === 'countdown') {
        this.hud.hideSetup();
        this.startMatchmakingTimer();
      }
      return;
    }

    if (room.status === 'playing' || room.status === 'paused' || room.status === 'finished') {
      this.hud.hideSetup();
      this.hud.hideOnlineLobby();
      this.render();
      if (previousStatus !== room.status && this.onlineState && room.status === 'playing') {
        playSound('turn');
        this.playTurnIntroForState(this.onlineState);
      }
      this.scheduleHumanAssist();
      if (room.status === 'finished' && room.winner && this.onlineState) {
        this.hud.showWinner(room.winner, {
          ...this.buildWinnerSummary(this.onlineState, room.winner),
          rematchStatus: room.rematchStatus
        });
      }
    }
  }

  handleOnlineRoomUpdate(room) {
    if (!room) {
      return;
    }
    if (this.onlineAnimating || this.onlinePending) {
      this.pendingOnlineRoom = room;
      return;
    }
    this.applyOnlineRoom(room);
  }

  async handleOnlineGameAction(action) {
    if (!action || action.sequence <= this.lastOnlineActionSequence) {
      return;
    }
    this.lastOnlineActionSequence = action.sequence;
    this.onlinePending = false;
    const sequenceId = this.nextSequence();

    if (action.type === 'matchStarted' || action.type === 'rematchStarted') {
      this.onlineState = clone(action.snapshot);
      this.onlinePending = false;
      this.onlineAnimating = false;
      this.pendingOnlineRoom = null;
      this.eventLog = this.onlineRoom?.eventLog || this.eventLog;
      if (this.onlineRoom?.roomType === 'public') {
        if (this.matchmakingTimer) {
          window.clearInterval(this.matchmakingTimer);
          this.matchmakingTimer = null;
        }
        this.matchmakingState = null;
        this.hud.clearMatchmakingState();
        saveLastMatchmakingState({
          status: 'playing',
          roomCode: this.onlineRoom.roomCode,
          playerCount: this.onlineRoom.playerCount
        });
      }
      this.hud.hideSetup();
      this.hud.hideOnlineLobby();
      this.hud.hideWinner();
      this.render();
      playSound('match-start');
      playSound('turn');
      await this.playTurnIntroForState(this.onlineState);
      this.scheduleHumanAssist();
      return;
    }

    if (!action.snapshot) {
      return;
    }

    this.onlineAnimating = true;
    this.busy = true;
    try {
      if (action.type === 'diceRolled' || action.type === 'noValidMoves') {
        const label = PLAYER_META[action.playerId].label;
        this.render();
        this.hud.setStatus(`${label} is rolling...`, 'neutral');
        await this.scene.animateDiceSequence(action.diceValue, {
          onRollStart: () => playSound('dice'),
          suppressCamera: this.shouldSuppressActionCamera(action.playerId)
        });
        if (!this.isSequenceActive(sequenceId)) {
          return;
        }
        playSound('dice-result');
        this.onlineState = clone(action.snapshot);
        this.render();
        this.hud.animateDiceValue(action.diceValue);
        if (action.type === 'noValidMoves') {
          this.hud.setStatus(`${label} had no valid move.`, 'neutral');
          playSound('turn');
          this.playTurnIntroForState(this.onlineState);
        }
        return;
      }

      if (action.type === 'tokenMoved') {
        const previousState = this.onlineState;
        const finalState = clone(action.snapshot);
        if (!previousState) {
          this.onlineState = finalState;
          this.render();
          return;
        }
        this.render();
        await this.scene.animateTokenMove(
          action.tokenId,
          action.path,
          action.captures,
          finalState,
          () => {
            playSound('move');
          },
          {
            reachedHome: action.reachedHome,
            tokenSpeed: this.options.tokenSpeed,
            suppressCamera: this.shouldSuppressActionCamera(action.playerId),
            allowTurnCamera: this.getSceneCameraOptions(finalState).moveCamera,
            turnCameraPlayerId: this.getSceneCameraOptions(finalState).cameraPlayerId
          }
        );
        if (!this.isSequenceActive(sequenceId)) {
          return;
        }
        this.onlineState = finalState;
        this.eventLog = this.onlineRoom?.eventLog || this.eventLog;
        if (action.captures?.length) {
          playSound('capture');
        }
        if (this.didOnlineActionEnterHomeLane(action)) {
          playSound('home-entry');
        }
        if (this.didOnlineActionLandSafe(action)) {
          playSound('safe');
        }
        if (action.reachedHome) {
          playSound('home');
        }
        if (action.winner) {
          playSound('win');
        } else {
          playSound('turn');
          this.playTurnIntroForState(this.onlineState);
        }
      }
    } finally {
      if (this.isSequenceActive(sequenceId)) {
        this.busy = false;
        this.onlineAnimating = false;
        if (this.pendingOnlineRoom) {
          const pending = this.pendingOnlineRoom;
          this.pendingOnlineRoom = null;
          this.applyOnlineRoom(pending);
        } else {
          this.render();
        }
        if (action.winner && this.onlineState) {
          await this.scene.playWinnerCamera(action.winner);
          this.hud.showWinner(action.winner, {
            ...this.buildWinnerSummary(this.onlineState, action.winner),
            rematchStatus: this.onlineRoom?.rematchStatus
          });
        } else if (!this.pendingOnlineRoom) {
          this.scheduleHumanAssist();
        }
      }
    }
  }

  handleOnlineClosed(payload = {}) {
    this.hud.setOnlineStatus(payload.message || 'Room closed.', 'danger');
    saveLastRoomCode('');
    this.clearOnlineState();
    this.hud.showSetup();
    this.render();
    playSound('room-leave');
  }

  handleOnlineError(message) {
    this.onlinePending = false;
    this.busy = false;
    this.hud.setOnlineStatus(message || 'Online action failed.', 'danger');
    playSound('invalid');
    if (this.isOnlineMode()) {
      this.hud.setStatus(message || 'Online action failed.', 'danger');
      this.render();
    }
  }

  handleOnlineDisconnect() {
    if (this.matchmakingState) {
      this.hud.setOnlineStatus('Socket disconnected. Public search will restore if possible.', 'danger');
    }
    if (this.isOnlineMode()) {
      this.onlinePending = false;
      this.hud.setStatus('Socket disconnected. Reconnecting...', 'danger');
      this.render();
    }
  }

  async submitOnlineRoll() {
    const state = this.onlineState;
    if (!state || this.busy || this.onlinePending || this.onlineRoom?.status !== 'playing') {
      return;
    }
    if (state.currentPlayer !== this.onlinePlayerId) {
      return;
    }
    if (state.phase !== STATUS.AWAITING_ROLL || state.winner) {
      this.hud.setStatus('Dice is not ready.', 'neutral');
      playSound('invalid');
      return;
    }
    this.onlinePending = true;
    this.render();
    const result = await this.onlineClient.rollDice(this.buildOnlinePayload());
    if (!result.ok) {
      this.onlinePending = false;
      this.hud.setStatus(result.message || 'Roll rejected by server.', 'danger');
      this.render();
      playSound('invalid');
    }
  }

  async submitOnlineMove(tokenId) {
    const state = this.onlineState;
    if (!state || this.busy || this.onlinePending || this.onlineRoom?.status !== 'playing') {
      return;
    }
    if (state.currentPlayer !== this.onlinePlayerId) {
      return;
    }
    const isLegal = state.availableMoves.some((move) => move.tokenId === tokenId);
    if (!isLegal) {
      this.scene.pulseInvalidToken(tokenId);
      this.hud.setStatus('That token cannot move for this dice roll.', 'danger');
      playSound('invalid');
      return;
    }
    this.onlinePending = true;
    this.scene.setSelectedToken(tokenId);
    this.render();
    const result = await this.onlineClient.moveToken(this.buildOnlinePayload({ tokenId }));
    if (!result.ok) {
      this.onlinePending = false;
      this.scene.pulseInvalidToken(tokenId);
      this.hud.setStatus(result.message || 'Move rejected by server.', 'danger');
      this.render();
      playSound('invalid');
    }
  }

  didLandSafe(result) {
    const finalStep = result.path[result.path.length - 1];
    return finalStep?.kind === 'track'
      && SAFE_COMMON_INDICES.has(finalStep.commonIndex)
      && result.captures.length === 0;
  }

  didOnlineActionLandSafe(action) {
    const finalStep = action.path?.[action.path.length - 1];
    return finalStep?.kind === 'track'
      && SAFE_COMMON_INDICES.has(finalStep.commonIndex)
      && !action.captures?.length;
  }

  didEnterHomeLane(result) {
    const finalStep = result.path[result.path.length - 1];
    return finalStep?.kind === 'home-lane' && !result.reachedHome;
  }

  didOnlineActionEnterHomeLane(action) {
    const finalStep = action.path?.[action.path.length - 1];
    return finalStep?.kind === 'home-lane' && !action.reachedHome;
  }

  getPostMoveStatus(result, actor, botChoice = null) {
    const label = playerLabel(result.playerId, this.matchConfig);
    if (result.winner) {
      return {
        message: `${label} wins.`,
        tone: 'success'
      };
    }
    if (result.reachedHome) {
      return {
        message: actor === 'bot' ? `${label} brought a token home.` : `${PLAYER_META[result.playerId].label} token reached home.`,
        tone: 'success'
      };
    }
    if (result.captures.length) {
      return {
        message: actor === 'bot'
          ? `${label} made a capture.`
          : `${PLAYER_META[result.captures[0].playerId].label} token captured!`,
        tone: 'capture'
      };
    }
    if (this.didEnterHomeLane(result)) {
      return {
        message: `${label} is entering home.`,
        tone: 'success'
      };
    }
    if (this.didLandSafe(result)) {
      return {
        message: actor === 'bot' ? `${label} moved to safety.` : 'Safe position.',
        tone: 'success'
      };
    }
    if (result.extraTurn) {
      return {
        message: actor === 'bot' ? `${label} earned another roll.` : 'Rolled 6 - extra turn.',
        tone: 'success'
      };
    }
    if (actor === 'bot' && botChoice) {
      return {
        message: this.getBotFriendlyReason(label, botChoice.reason),
        tone: 'neutral'
      };
    }
    return null;
  }

  getBotFriendlyReason(label, reason) {
    const messages = {
      'finish-token': `${label} brought a token home.`,
      'capture-opponent': `${label} made a capture.`,
      'enter-home-lane': `${label} is entering home.`,
      'escape-danger': `${label} found a safer path.`,
      'land-safe': `${label} moved to safety.`,
      'unlock-token': `${label} entered the board.`,
      'advance-home-lane': `${label} pressed closer to home.`,
      'advance-token': `${label} advanced with care.`
    };
    return messages[reason] || `${label} advanced with care.`;
  }

  appendMoveEvents(result, actor, botChoice = null) {
    const label = playerLabel(result.playerId, this.matchConfig);
    const tokenNumber = Number(String(result.tokenId).split('-')[1]) + 1;
    this.appendEvent(`${label} moved token ${tokenNumber}.`);
    if (result.captures.length) {
      const capturedLabels = [...new Set(result.captures.map((capture) => PLAYER_META[capture.playerId].label))].join(', ');
      this.appendEvent(`${label} captured ${capturedLabels}.`, 'capture');
    }
    if (this.didLandSafe(result)) {
      this.appendEvent(`${label} landed safe.`, 'success');
    }
    if (this.didEnterHomeLane(result)) {
      this.appendEvent(`${label} entered home lane.`, 'success');
    }
    if (result.reachedHome) {
      this.appendEvent(`${label} reached home.`, 'success');
    }
    if (result.winner) {
      this.appendEvent(`${label} won the match.`, 'success');
    }
  }

  appendEvent(message, tone = 'neutral') {
    const elapsed = this.matchStartedAt ? Date.now() - this.matchStartedAt : 0;
    this.eventLog = pushEventLog(this.eventLog, message, tone, elapsed, 12);
  }

  buildWinnerSummary(state, winner) {
    const capturesByPlayer = Object.fromEntries(PLAYER_IDS.map((playerId) => [playerId, 0]));
    state.capturedTokens.forEach((capture) => {
      capturesByPlayer[capture.capturedBy] = (capturesByPlayer[capture.capturedBy] || 0) + 1;
    });
    const highestCaptureEntry = Object.entries(capturesByPlayer)
      .sort((left, right) => right[1] - left[1])[0];
    const highestCaptureLabel = highestCaptureEntry?.[1] > 0
      ? `${PLAYER_META[highestCaptureEntry[0]].label} (${highestCaptureEntry[1]})`
      : 'None';
    const controller = this.matchConfig.controllers[winner] || 'human';
    const playerSummaries = this.matchConfig.activePlayers.map((playerId) => {
      const onlinePlayer = this.onlineRoom?.players?.find((player) => player.playerId === playerId);
      const playerController = this.matchConfig.controllers[playerId];
      const profile = this.matchConfig.botProfiles[playerId];
      return {
        label: PLAYER_META[playerId].label,
        detail: onlinePlayer
          ? `${onlinePlayer.displayName} online player`
          : playerController === 'bot'
          ? `${profile.difficulty} ${profile.personality} bot`
          : 'human player'
      };
    });
    const winningOnlinePlayer = this.onlineRoom?.players?.find((player) => player.playerId === winner);

    return {
      turns: state.turnHistory.filter((entry) => entry.type === 'roll').length,
      duration: formatDuration(Date.now() - (this.matchStartedAt || Date.now())),
      capturesByPlayer,
      finishedByPlayer: { ...state.finishedCounts },
      highestCaptureLabel,
      controllerLabel: winningOnlinePlayer
        ? `${PLAYER_META[winner].label} ${winningOnlinePlayer.displayName}`
        : `${PLAYER_META[winner].label} ${controller === 'bot' ? 'Bot' : 'Human'}`,
      matchTypeLabel: matchTypeLabel(this.matchConfig.matchType),
      playerSummaries
    };
  }

  getBotAwareDelay(kind, actor) {
    if (actor !== 'bot') {
      return kind === 'pass' ? 360 : 0;
    }
    const fast = this.options.botSpeed === 'fast';
    const delays = fast
      ? { turn: 260, think: 300, select: 120, pass: 220 }
      : { turn: 620, think: 760, select: 220, pass: 520 };
    return delays[kind] ?? 300;
  }

  wait(duration, sequenceId) {
    return new Promise((resolve) => {
      window.setTimeout(() => resolve(this.isSequenceActive(sequenceId)), duration);
    });
  }
}
