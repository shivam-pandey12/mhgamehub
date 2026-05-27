import { APP_STATES, CARROM_INPUT, DEFAULT_LOCAL_SETUP, SHELL_MATCH_DEFAULTS } from './config/carrom-constants.js';
import { DEFAULT_THEME_ID, getThemeById } from './config/theme-config.js';
import { AudioManager } from './audio/audio-manager.js';
import { BotController } from './bot/bot-controller.js';
import { getDefaultBotName } from './bot/bot-difficulty.js';
import { ChallengeManager } from './challenges/challenge-manager.js';
import { CosmeticManager } from './cosmetics/cosmetic-manager.js';
import { CosmeticPreviewController } from './cosmetics/cosmetic-preview-controller.js';
import { MatchStateManager } from './game/match-state-manager.js';
import { OnlineClient } from './online/online-client.js';
import { OnlinePublicQueueController } from './online/online-public-queue-controller.js';
import { OnlineRoomController } from './online/online-room-controller.js';
import { OnlineSessionManager } from './online/online-session-manager.js';
import { OnlineStateSync } from './online/online-state-sync.js';
import { createPublicMatchmakingModel } from './online/online-matchmaking-ui-controller.js';
import { createOnlinePanelModel } from './online/online-ui-controller.js';
import { SceneRenderer } from './scene/scene-renderer.js';
import { CoachHintManager } from './training/coach-hint-manager.js';
import { OnboardingManager } from './training/onboarding-manager.js';
import { PracticeController } from './training/practice-controller.js';
import { PracticeStatsManager } from './training/practice-stats-manager.js';
import { TutorialController } from './training/tutorial-controller.js';
import { UIController } from './ui/ui-controller.js';
import { ResponsiveController } from './ui/responsive-controller.js';
import {
  loadPlayerNames,
  loadSettings,
  resetSettings,
  savePlayerNames,
  saveSettings
} from './services/save-settings-manager.js';

export class Carrom3DApp {
  constructor({ root }) {
    this.root = root;
    this.state = APP_STATES.loading;
    this.returnState = APP_STATES.mainMenu;
    this.hudCollapsed = false;
    this.debugPhysics = typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).has('debugPhysics')
      : false;
    this.debugBot = typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).has('debugBot')
      : false;
    this.debugOnline = typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).has('debugOnline')
      : false;
    this.settings = loadSettings();
    const savedNames = loadPlayerNames();
    this.localSetup = {
      ...DEFAULT_LOCAL_SETUP,
      ...savedNames
    };
    this.match = {
      ...SHELL_MATCH_DEFAULTS,
      playerOneName: this.localSetup.playerOneName,
      playerTwoName: this.localSetup.playerTwoName
    };
    this.matchStateManager = null;
    this.botController = null;
    this.challengeManager = null;
    this.practiceController = null;
    this.onboardingManager = null;
    this.coachHintManager = null;
    this.practiceStatsManager = null;
    this.tutorialController = null;
    this.cosmeticManager = null;
    this.cosmeticPreviewController = null;
    this.onlineClient = null;
    this.onlineRoomController = null;
    this.onlinePublicQueueController = null;
    this.onlineSessionManager = null;
    this.onlineStateSync = null;
    this.publicQueueTimer = 0;
    this.onlineShotActive = false;
    this.onlineAnimationSettled = true;
    this.pendingOnlineSettledPayload = null;
    this.customizeReturnSection = 'setup';
    this.introTimer = 0;
    this.handleResize = () => this.sceneRenderer?.requestResize?.();
    this.handleKeydown = (event) => this.handleGlobalKeydown(event);
  }

  init() {
    this.ui = new UIController({ app: this, root: this.root });
    this.ui.init();
    this.ui.setDebugPhysics(this.debugPhysics);
    this.ui.setDebugOnline?.(this.debugOnline);
    this.responsive = new ResponsiveController(this.ui.shell);
    this.responsive.init();
    this.audioManager = new AudioManager(this.settings);
    this.audioManager.init();

    this.applyTheme(this.settings.themeId || DEFAULT_THEME_ID, { persist: false });
    this.applySettings({ persist: false });
    this.ui.updateLocalSetup(this.localSetup);
    this.ui.updateSettings(this.settings);
    this.ui.updateMatch(this.match);
    this.ui.setHudCollapsed(this.hudCollapsed);

    this.sceneRenderer = new SceneRenderer({
      canvas: this.ui.getCanvas(),
      root: this.ui.shell,
      theme: getThemeById(this.settings.themeId),
      settings: this.settings,
      debugPhysics: this.debugPhysics,
      physicsCallbacks: {
        onShotStarted: () => {
          this.updatePhysicsHud('Shot in motion.', { shotPower: 'Moving', shotPowerRatio: 1 });
        },
        onPiecePocketed: (piece) => this.handlePhysicsPocketed(piece),
        onShotSettled: (summary) => this.handlePhysicsSettled(summary),
        onCollision: (event) => this.handlePhysicsCollision(event),
        onStatus: (status) => this.updatePhysicsHud(status)
      },
      inputCallbacks: {
        onStatus: (status, overrides) => this.updatePhysicsHud(status, overrides),
        onPowerChange: (power) => this.handleInputPower(power),
        onPlacementChanged: (position) => this.handleInputPlacementChanged(position),
        onAimCreated: () => this.handleInputAimCreated(),
        onAimUpdated: (aim) => this.handleInputAimUpdated(aim),
        shouldDeferShotRelease: () => this.shouldDeferShotRelease(),
        onShotReleased: (result) => this.handleShotReleased(result)
      }
    });
    this.sceneRenderer.init();
    this.sceneRenderer.applySettings(this.settings);
    this.sceneRenderer.setBoardStyle(this.localSetup.boardStyle);
    this.cosmeticManager = new CosmeticManager({ sceneRenderer: this.sceneRenderer });
    this.cosmeticManager.applyLoadout();
    this.cosmeticPreviewController = new CosmeticPreviewController({ cosmeticManager: this.cosmeticManager });
    this.ui.updateCosmeticsPanel?.(this.cosmeticPreviewController.getModel());
    this.botController = new BotController({
      sceneRenderer: this.sceneRenderer,
      getMatchStateManager: () => this.matchStateManager,
      getAppState: () => this.state,
      canRun: () => this.state === APP_STATES.playing && this.ui?.sidePanelSection !== 'customize',
      debugBot: this.debugBot,
      callbacks: {
        onStatus: (status, overrides) => this.updatePhysicsHud(status, overrides),
        onShotFired: (plan, botPlayer) => this.handleBotShotFired(plan, botPlayer)
      }
    });
    this.challengeManager = new ChallengeManager({
      sceneRenderer: this.sceneRenderer,
      callbacks: {
        onChange: (model, hud) => this.handleChallengeChange(model, hud),
        onSuccess: (result) => this.handleChallengeResult(result, true),
        onFail: (result) => this.handleChallengeResult(result, false)
      }
    });
    this.onboardingManager = new OnboardingManager();
    this.coachHintManager = new CoachHintManager();
    this.practiceStatsManager = new PracticeStatsManager();
    this.practiceController = new PracticeController({
      sceneRenderer: this.sceneRenderer,
      statsManager: this.practiceStatsManager,
      coachHints: this.coachHintManager,
      callbacks: {
        onChange: (hud) => this.handlePracticeChange(hud)
      }
    });
    this.tutorialController = new TutorialController({
      sceneRenderer: this.sceneRenderer,
      coachHints: this.coachHintManager,
      callbacks: {
        onChange: (hud) => this.handleTutorialChange(hud)
      }
    });
    this.onlineClient = new OnlineClient();
    this.onlineSessionManager = new OnlineSessionManager();
    this.onlineStateSync = new OnlineStateSync({ sceneRenderer: this.sceneRenderer });
    this.onlineRoomController = new OnlineRoomController({
      client: this.onlineClient,
      callbacks: {
        onChange: (state) => this.handleOnlineControllerChange(state),
        onSession: (session, state) => this.handleOnlineSession(session, state),
        onRoomState: (state) => this.handleOnlineRoomState(state),
        onMatchStarted: (matchState, state) => this.handleOnlineMatchStarted(matchState, state),
        onShotAccepted: (payload, state) => this.handleOnlineShotAccepted(payload, state),
        onShotRejected: (payload, state) => this.handleOnlineShotRejected(payload, state),
        onShotStarted: (payload, state) => this.handleOnlineShotStarted(payload, state),
        onShotSettled: (payload, state) => this.handleOnlineShotSettled(payload, state),
        onMatchState: (matchState, state) => this.handleOnlineMatchState(matchState, state),
        onMatchFinished: (payload, state) => this.handleOnlineMatchFinished(payload, state),
        onPlayerLeft: (payload, state) => this.handleOnlinePlayerLeft(payload, state),
        onPlayerDisconnected: (payload, state) => this.handleOnlineDisconnectGrace(payload, state),
        onDisconnectGrace: (payload, state) => this.handleOnlineDisconnectGrace(payload, state),
        onDisconnectExpired: (payload, state) => this.handleOnlineDisconnectExpired(payload, state),
        onRoomClosed: (payload, state) => this.handleOnlineRoomClosed(payload, state),
        onPlayerReconnected: (payload, state) => this.handleOnlinePlayerReconnected(payload, state),
        onReconnectAccepted: (payload, state) => this.handleOnlineReconnectAccepted(payload, state),
        onReconnectRejected: (payload, state) => this.handleOnlineReconnectRejected(payload, state),
        onSessionExpired: (payload, state) => this.handleOnlineReconnectRejected(payload, state),
        onTurnTimer: (payload, state) => this.handleOnlineTurnTimer(payload, state),
        onTurnTimeout: (payload, state) => this.handleOnlineTurnTimeout(payload, state),
        onRematchRequested: (payload, state) => this.handleOnlineRematchState(payload, state),
        onRematchDeclined: (payload, state) => this.handleOnlineRematchState(payload, state),
        onRematchStarted: (payload, state) => this.handleOnlineRematchStarted(payload, state),
        onError: (payload, state) => this.handleOnlineError(payload, state)
      }
    });
    this.onlinePublicQueueController = new OnlinePublicQueueController({
      client: this.onlineClient,
      callbacks: {
        onChange: (state) => this.handlePublicQueueChange(state),
        onQueueJoined: (payload, state) => this.handlePublicQueueJoined(payload, state),
        onQueueStatus: (payload, state) => this.handlePublicQueueStatus(payload, state),
        onQueueCancelled: (payload, state) => this.handlePublicQueueCancelled(payload, state),
        onMatchFound: (payload, state) => this.handlePublicMatchFound(payload, state),
        onError: (payload, state) => this.handlePublicQueueError(payload, state)
      }
    });
    this.ui.updateChallengePanel?.(this.challengeManager.getPanelModel());
    this.ui.updateOnlinePanel?.(createOnlinePanelModel(this.onlineRoomController.state));
    this.ui.updatePublicMatchmakingPanel?.(createPublicMatchmakingModel(this.onlinePublicQueueController.state));
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('keydown', this.handleKeydown);

    this.showLocalSetup();
    const handledRoomLink = this.handleIncomingRoomLink();
    if (!handledRoomLink) {
      this.showSavedOnlineSessionPrompt();
    }
    if (!handledRoomLink && this.onboardingManager.shouldShow()) {
      this.showOnboarding();
    }
  }

  setState(state) {
    if (!Object.values(APP_STATES).includes(state)) {
      return;
    }

    const overlayStates = [APP_STATES.rules, APP_STATES.settings, APP_STATES.about];
    if (!overlayStates.includes(state) && state !== APP_STATES.paused) {
      this.returnState = state;
    }

    this.state = state;
    this.ui.setState(state);
    this.sceneRenderer?.setStateFocus(state);
    if (this.isCurrentTurnBot()) {
      this.sceneRenderer?.setInputEnabled(false);
    }
  }

  showLoading() {
    this.showLocalSetup();
  }

  showMainMenu() {
    this.showLocalSetup();
  }

  showModeSelect() {
    this.showLocalSetup();
  }

  showLocalSetup() {
    this.cancelCosmeticPreviewIfLeaving('setup');
    this.endOnlineSession({ updateHud: false });
    this.botController?.cancel();
    this.exitSoloModes({ restoreBoard: true, updateHud: false });
    this.ui.setSidePanelSection('setup');
    this.hudCollapsed = false;
    this.ui.setHudCollapsed(false);
    this.setState(APP_STATES.playing);
    this.sceneRenderer?.setInputEnabled(false);
    this.sceneRenderer?.setSceneOrbitEnabled(true);
    this.ui.updateLocalSetup(this.localSetup);
  }

  showMatchPanel() {
    this.cancelCosmeticPreviewIfLeaving('match');
    this.ui.setSidePanelSection('match');
    this.hudCollapsed = false;
    this.ui.setHudCollapsed(false);
    if (this.state !== APP_STATES.result) {
      this.setState(APP_STATES.playing);
      if (!this.matchStateManager) {
        this.sceneRenderer?.setInputEnabled(false);
        this.sceneRenderer?.setSceneOrbitEnabled(true);
      }
    }
  }

  startLocalShellMatch({ preserveSetup = false } = {}) {
    this.endOnlineSession({ updateHud: false });
    this.botController?.cancel();
    this.exitSoloModes({ restoreBoard: true, updateHud: false });
    if (!preserveSetup) {
      this.localSetup = {
        ...this.localSetup,
        ...this.ui.getLocalSetupValues()
      };
    }

    const matchMode = this.localSetup.matchMode || DEFAULT_LOCAL_SETUP.matchMode;
    const botDifficulty = this.localSetup.botDifficulty || DEFAULT_LOCAL_SETUP.botDifficulty;
    const playerOneName = this.localSetup.playerOneName || DEFAULT_LOCAL_SETUP.playerOneName;
    let playerTwoName = this.localSetup.playerTwoName || DEFAULT_LOCAL_SETUP.playerTwoName;
    if (matchMode === 'vsBot' && (!playerTwoName || playerTwoName === DEFAULT_LOCAL_SETUP.playerTwoName)) {
      playerTwoName = getDefaultBotName(botDifficulty);
    }
    this.localSetup.matchMode = matchMode;
    this.localSetup.botDifficulty = botDifficulty;
    this.localSetup.playerOneName = playerOneName;
    this.localSetup.playerTwoName = playerTwoName;
    savePlayerNames({ playerOneName, playerTwoName });

    this.match = {
      ...SHELL_MATCH_DEFAULTS,
      currentTurn: playerOneName,
      playerOneName,
      playerTwoName,
      matchMode,
      botDifficulty,
      classicRuleVariant: this.localSetup.classicRuleVariant
    };
    this.matchStateManager = new MatchStateManager({
      playerOneName,
      playerTwoName,
      matchMode,
      botDifficulty,
      classicRuleVariant: this.localSetup.classicRuleVariant,
      ruleMode: this.localSetup.ruleMode,
      coinSide: this.localSetup.coinSide,
      boardStyle: this.localSetup.boardStyle,
      matchType: this.localSetup.matchType
    });
    this.sceneRenderer?.setBoardStyle(this.localSetup.boardStyle);
    this.sceneRenderer?.clearFeedback();
    this.sceneRenderer?.setSceneOrbitEnabled(false);
    this.sceneRenderer?.resetPhysics();
    this.sceneRenderer?.prepareForTurn({
      baseline: this.matchStateManager.getActiveBaseline(),
      enabled: false,
      silent: true,
      rotateCamera: this.shouldRotateCameraForTurn()
    });
    this.match = {
      ...this.match,
      ...this.matchStateManager.toHudMatch()
    };
    this.ui.updateMatch(this.match);
    this.setState(APP_STATES.playing);
    this.ui.setSidePanelSection('match');
    this.hudCollapsed = true;
    this.ui.setHudCollapsed(true);
    this.playMatchIntro();
  }

  showPause() {
    if (this.state !== APP_STATES.playing) {
      return;
    }
    this.botController?.pause();
    this.returnState = APP_STATES.playing;
    this.setState(APP_STATES.paused);
  }

  resumeMatch() {
    this.setState(APP_STATES.playing);
    if (this.isOnlineMatchActive()) {
      this.prepareOnlineTurn({ silent: true });
      return;
    }
    this.botController?.resume();
    if (!this.isCurrentTurnBot() && this.matchStateManager) {
      this.prepareActiveTurn({ silent: true });
    }
  }

  showRules() {
    this.showSidePanelSection('rules');
  }

  showSettings() {
    this.showSidePanelSection('settings');
  }

  showAbout() {
    this.showSidePanelSection('about');
  }

  showCustomizePanel() {
    this.botController?.pause();
    this.customizeReturnSection = this.ui?.sidePanelSection || (this.matchStateManager ? 'match' : 'setup');
    const model = this.cosmeticPreviewController?.open();
    this.ui.setSidePanelSection('customize');
    this.hudCollapsed = false;
    this.ui.setHudCollapsed(false);
    this.setState(APP_STATES.playing);
    this.sceneRenderer?.setInputEnabled(false);
    this.sceneRenderer?.setSceneOrbitEnabled(!this.matchStateManager);
    this.ui.updateCosmeticsPanel?.(model);
    this.updatePhysicsHud('Preview cosmetics on the live 3D table. Equip to save locally.', {
      bannerTone: 'default'
    });
  }

  selectCosmeticCategory(category) {
    this.ui.updateCosmeticsPanel?.(this.cosmeticPreviewController?.setCategory(category));
  }

  previewCosmetic(category, itemId) {
    const model = this.cosmeticPreviewController?.preview(category, itemId);
    this.ui.updateCosmeticsPanel?.(model);
    this.updatePhysicsHud(model?.message || 'Cosmetic preview updated.', {
      bannerTone: model?.tone || 'default'
    });
  }

  equipCosmetics() {
    const model = this.cosmeticPreviewController?.equip();
    this.ui.updateCosmeticsPanel?.(model);
    this.updatePhysicsHud(model?.message || 'Cosmetic loadout saved.', {
      bannerTone: model?.tone || 'success'
    });
  }

  resetCosmetics() {
    const model = this.cosmeticPreviewController?.resetToDefault();
    this.ui.updateCosmeticsPanel?.(model);
    this.updatePhysicsHud(model?.message || 'Default cosmetics restored.', {
      bannerTone: 'success'
    });
  }

  closeCustomizePanel() {
    const model = this.cosmeticPreviewController?.cancelPreview();
    this.ui.updateCosmeticsPanel?.(model);
    const target = this.customizeReturnSection || (this.matchStateManager ? 'match' : 'setup');
    this.showSidePanelSection(target);
    if (target === 'match' && this.matchStateManager) {
      if (this.isCurrentTurnBot()) {
        this.botController?.resume();
      } else {
        this.prepareActiveTurn({ silent: true });
      }
    }
  }

  cancelCosmeticPreviewIfLeaving(nextSection) {
    if (this.ui?.sidePanelSection !== 'customize' || nextSection === 'customize') {
      return;
    }
    this.ui.updateCosmeticsPanel?.(this.cosmeticPreviewController?.cancelPreview?.());
  }

  showOnboarding() {
    const viewModel = this.onboardingManager?.open();
    this.ui.updateOnboarding?.(viewModel);
  }

  onboardingNext() {
    this.ui.updateOnboarding?.(this.onboardingManager?.next());
  }

  onboardingPrevious() {
    this.ui.updateOnboarding?.(this.onboardingManager?.previous());
  }

  skipOnboarding() {
    this.ui.updateOnboarding?.(this.onboardingManager?.close({ markSeen: true }));
    this.showLocalSetup();
  }

  resetOnboarding() {
    this.onboardingManager?.reset();
    this.ui.updateOnboarding?.(this.onboardingManager?.getViewModel?.());
    this.updatePhysicsHud('Onboarding will show on next launch.', { bannerTone: 'success' });
  }

  startTutorialFromOnboarding() {
    this.ui.updateOnboarding?.(this.onboardingManager?.close({ markSeen: true }));
    this.startTutorial();
  }

  startPracticeFromOnboarding() {
    this.ui.updateOnboarding?.(this.onboardingManager?.close({ markSeen: true }));
    this.showPracticePanel();
    this.startPractice('freePractice');
  }

  showPracticePanel() {
    this.cancelCosmeticPreviewIfLeaving('practice');
    this.endOnlineSession({ updateHud: false });
    this.botController?.cancel();
    this.challengeManager?.exitChallenge();
    this.matchStateManager = null;
    this.ui.setSidePanelSection('practice');
    this.hudCollapsed = false;
    this.ui.setHudCollapsed(false);
    this.setState(APP_STATES.playing);
    this.sceneRenderer?.setInputEnabled(false);
    this.sceneRenderer?.setSceneOrbitEnabled(true);
    this.match = {
      ...this.match,
      ...this.practiceController?.getHud?.()
    };
    this.ui.updateMatch(this.match);
  }

  startPractice(type = this.localSetup.practiceType) {
    this.endOnlineSession({ updateHud: false });
    this.botController?.cancel();
    this.matchStateManager = null;
    this.challengeManager?.exitChallenge();
    this.tutorialController?.exit();
    this.localSetup.practiceType = type || this.localSetup.practiceType;
    this.ui.updateLocalSetup(this.localSetup);
    this.sceneRenderer?.setSceneOrbitEnabled(false);
    const hud = this.practiceController?.start(this.localSetup.practiceType);
    this.match = {
      ...SHELL_MATCH_DEFAULTS,
      ...hud
    };
    this.ui.updateMatch(this.match);
    this.ui.setSidePanelSection('practice');
    this.setState(APP_STATES.playing);
  }

  startTutorial() {
    this.endOnlineSession({ updateHud: false });
    this.botController?.cancel();
    this.matchStateManager = null;
    this.challengeManager?.exitChallenge();
    this.practiceController?.exit();
    this.sceneRenderer?.setSceneOrbitEnabled(false);
    const hud = this.tutorialController?.start();
    this.match = {
      ...SHELL_MATCH_DEFAULTS,
      ...hud
    };
    this.ui.updateMatch(this.match);
    this.ui.updateTutorial?.(hud);
    this.ui.updateCoachHint?.(this.coachHintManager?.getViewModel?.());
    this.ui.setSidePanelSection('practice');
    this.setState(APP_STATES.playing);
  }

  tutorialNext() {
    const hud = this.tutorialController?.next();
    this.match = {
      ...this.match,
      ...hud
    };
    this.ui.updateMatch(this.match);
    this.ui.updateTutorial?.(hud);
    this.ui.updateCoachHint?.(this.coachHintManager?.getViewModel?.());
  }

  exitTutorial({ complete = false } = {}) {
    this.tutorialController?.exit({ complete });
    this.ui.updateTutorial?.(this.tutorialController?.getHud?.());
    this.ui.updateCoachHint?.(this.coachHintManager?.getViewModel?.());
    if (!complete) {
      this.showLocalSetup();
    }
  }

  finishTutorialToLocal() {
    this.exitTutorial({ complete: true });
    this.updateLocalSetup('matchMode', 'local2p');
    this.showLocalSetup();
  }

  finishTutorialToBot() {
    this.exitTutorial({ complete: true });
    this.updateLocalSetup('matchMode', 'vsBot');
    this.showLocalSetup();
  }

  finishTutorialToPractice() {
    this.exitTutorial({ complete: true });
    this.showPracticePanel();
    this.startPractice('freePractice');
  }

  finishTutorialToMenu() {
    this.exitTutorial({ complete: true });
    this.showLocalSetup();
  }

  resetPractice() {
    const hud = this.practiceController?.reset();
    this.match = {
      ...this.match,
      ...hud
    };
    this.ui.updateMatch(this.match);
  }

  nextPracticeDrill() {
    const hud = this.practiceController?.next();
    this.localSetup.practiceType = this.practiceController?.type || this.localSetup.practiceType;
    this.match = {
      ...this.match,
      ...hud
    };
    this.ui.updateMatch(this.match);
    this.ui.updateLocalSetup(this.localSetup);
  }

  exitPractice() {
    this.practiceController?.exit();
    this.showLocalSetup();
  }

  showChallengePanel() {
    this.cancelCosmeticPreviewIfLeaving('challenges');
    this.endOnlineSession({ updateHud: false });
    this.botController?.cancel();
    this.practiceController?.exit();
    this.tutorialController?.exit();
    this.matchStateManager = null;
    this.ui.setSidePanelSection('challenges');
    this.hudCollapsed = false;
    this.ui.setHudCollapsed(false);
    this.ui.updateChallengePanel?.(this.challengeManager?.getPanelModel?.());
    this.setState(APP_STATES.playing);
    this.sceneRenderer?.setInputEnabled(false);
    this.sceneRenderer?.setSceneOrbitEnabled(true);
  }

  selectChallenge(challengeId) {
    this.challengeManager?.selectChallenge(challengeId);
    this.ui.setSidePanelSection('challenges');
  }

  startChallenge(challengeId = '') {
    this.endOnlineSession({ updateHud: false });
    this.botController?.cancel();
    this.practiceController?.exit();
    this.tutorialController?.exit();
    this.matchStateManager = null;
    this.sceneRenderer?.setSceneOrbitEnabled(false);
    const hud = this.challengeManager?.startChallenge(challengeId);
    this.match = {
      ...SHELL_MATCH_DEFAULTS,
      ...hud
    };
    this.ui.updateMatch(this.match);
    this.ui.updateChallengePanel?.(this.challengeManager?.getPanelModel?.());
    this.ui.setSidePanelSection('challenges');
    this.setState(APP_STATES.playing);
  }

  retryChallenge() {
    const hud = this.challengeManager?.retryChallenge();
    this.match = {
      ...this.match,
      ...hud
    };
    this.ui.updateMatch(this.match);
    this.ui.updateChallengePanel?.(this.challengeManager?.getPanelModel?.());
  }

  nextChallenge() {
    const hud = this.challengeManager?.nextChallenge();
    this.match = {
      ...this.match,
      ...hud
    };
    this.ui.updateMatch(this.match);
    this.ui.updateChallengePanel?.(this.challengeManager?.getPanelModel?.());
  }

  exitChallenge() {
    this.challengeManager?.exitChallenge();
    this.showLocalSetup();
  }

  resetChallengeProgress() {
    this.challengeManager?.resetProgress();
    this.ui.updateChallengePanel?.(this.challengeManager?.getPanelModel?.());
  }

  exitSoloModes({ restoreBoard = false, updateHud = true } = {}) {
    const hadSolo = Boolean(this.challengeManager?.active || this.practiceController?.active || this.tutorialController?.active);
    if (this.challengeManager?.active) {
      this.challengeManager.exitChallenge();
    }
    if (this.practiceController?.active) {
      this.practiceController.exit();
    }
    if (this.tutorialController?.active) {
      this.tutorialController.exit();
    }
    if (restoreBoard || hadSolo) {
      this.sceneRenderer?.clearTrainingScenario?.();
    }
    if (updateHud) {
      this.match = {
        ...this.match,
        challengeActive: false,
        practiceActive: false,
        tutorialActive: false,
        challengeTitle: '',
        practiceTitle: ''
      };
      this.ui.updateMatch(this.match);
      this.ui.updateChallengePanel?.(this.challengeManager?.getPanelModel?.());
    }
  }

  showOnlinePanel() {
    if (this.match?.matchMode === 'onlinePublic' || this.getOnlineMatchState()?.mode === 'onlinePublic') {
      this.showPublicMatchmakingPanel();
      return;
    }
    this.cancelCosmeticPreviewIfLeaving('online');
    this.stopPublicQueueTimer();
    this.botController?.cancel();
    this.exitSoloModes({ restoreBoard: true, updateHud: false });
    this.matchStateManager = null;
    this.ui.setSidePanelSection('online');
    this.hudCollapsed = false;
    this.ui.setHudCollapsed(false);
    this.setState(APP_STATES.playing);
    const onlineMatch = this.getOnlineMatchState();
    this.sceneRenderer?.setInputEnabled(false);
    this.sceneRenderer?.setSceneOrbitEnabled(!onlineMatch || onlineMatch.status !== 'playing');
    this.ui.updateOnlinePanel?.(createOnlinePanelModel(this.onlineRoomController?.state));
    if (onlineMatch) {
      this.applyOnlineMatchSnapshot(onlineMatch, this.onlineRoomController.state, {
        reconcile: false,
        updatePanel: true
      });
    }
  }

  showPublicMatchmakingPanel() {
    this.cancelCosmeticPreviewIfLeaving('onlinePublic');
    this.botController?.cancel();
    this.exitSoloModes({ restoreBoard: true, updateHud: false });
    this.matchStateManager = null;
    this.ui.setSidePanelSection('onlinePublic');
    this.hudCollapsed = false;
    this.ui.setHudCollapsed(false);
    this.setState(APP_STATES.playing);
    const onlineMatch = this.getOnlineMatchState();
    this.sceneRenderer?.setInputEnabled(false);
    this.sceneRenderer?.setSceneOrbitEnabled(!onlineMatch || onlineMatch.status !== 'playing');
    this.ui.updatePublicMatchmakingPanel?.(createPublicMatchmakingModel(this.onlinePublicQueueController?.state));
    if (onlineMatch?.mode === 'onlinePublic') {
      this.applyOnlineMatchSnapshot(onlineMatch, this.onlineRoomController.state, {
        reconcile: false,
        updatePanel: true
      });
    }
  }

  showSavedOnlineSessionPrompt() {
    const session = this.onlineSessionManager?.loadSession?.();
    if (!session || this.onlineRoomController?.state?.roomCode) {
      return;
    }
    this.onlineRoomController?.showReconnectPrompt(session);
    this.ui.setSidePanelSection('online');
    this.ui.updateOnlinePanel?.(createOnlinePanelModel(this.onlineRoomController?.state));
    this.updatePhysicsHud('Reconnect to your previous online room or discard the saved session.', {
      bannerTone: 'warning'
    });
  }

  async reconnectOnlineSession() {
    const payload = this.onlineSessionManager?.getReconnectPayload?.();
    if (!payload) {
      this.discardOnlineSession();
      return;
    }
    this.cancelCosmeticPreviewIfLeaving('online');
    this.botController?.cancel();
    this.exitSoloModes({ restoreBoard: true, updateHud: false });
    this.matchStateManager = null;
    this.ui.setSidePanelSection('online');
    this.sceneRenderer?.setInputEnabled(false);
    try {
      await this.onlineRoomController?.reconnectRoom(payload);
    } catch (error) {
      this.handleOnlineReconnectRejected({ message: error.message || 'Could not reconnect.' }, this.onlineRoomController?.state);
    }
  }

  discardOnlineSession() {
    this.onlineSessionManager?.clearSession?.();
    this.onlineRoomController?.setState?.({
      reconnectPrompt: null,
      message: 'Saved online session discarded.',
      error: ''
    });
    this.ui.updateOnlinePanel?.(createOnlinePanelModel(this.onlineRoomController?.state));
    this.updatePhysicsHud('Saved online session discarded.', { bannerTone: 'default' });
  }

  async joinPublicQueue(values = {}) {
    this.cancelCosmeticPreviewIfLeaving('onlinePublic');
    this.botController?.cancel();
    this.exitSoloModes({ restoreBoard: true, updateHud: false });
    this.matchStateManager = null;
    this.onlineRoomController?.leaveRoom();
    this.onlineShotActive = false;
    this.onlineAnimationSettled = true;
    this.pendingOnlineSettledPayload = null;
    this.sceneRenderer?.setInputEnabled(false);
    this.sceneRenderer?.setSceneOrbitEnabled(true);
    this.ui.setSidePanelSection('onlinePublic');
    try {
      await this.onlinePublicQueueController?.joinQueue(values);
    } catch (error) {
      this.handlePublicQueueError({ message: error.message || 'Could not join public queue.' }, this.onlinePublicQueueController?.state);
    }
  }

  cancelPublicQueue() {
    this.onlinePublicQueueController?.cancelQueue();
    this.stopPublicQueueTimer();
    this.sceneRenderer?.setInputEnabled(false);
    this.sceneRenderer?.setSceneOrbitEnabled(true);
  }

  handlePublicQueueChange(state = {}) {
    this.ui?.updatePublicMatchmakingPanel?.(createPublicMatchmakingModel(state));
    if (state.status === 'queued') {
      this.startPublicQueueTimer();
    } else if (state.status !== 'matched') {
      this.stopPublicQueueTimer();
    }
  }

  handlePublicQueueJoined(payload, state = {}) {
    this.startPublicQueueTimer();
    this.updatePhysicsHud('Searching for public opponent...', {
      bannerTone: 'warning'
    });
    this.ui?.updatePublicMatchmakingPanel?.(createPublicMatchmakingModel(state));
  }

  handlePublicQueueStatus(payload, state = {}) {
    this.ui?.updatePublicMatchmakingPanel?.(createPublicMatchmakingModel(state));
  }

  handlePublicQueueCancelled(payload, state = {}) {
    this.stopPublicQueueTimer();
    this.updatePhysicsHud(payload?.reason || 'Queue cancelled.', {
      bannerTone: 'default'
    });
    this.ui?.updatePublicMatchmakingPanel?.(createPublicMatchmakingModel(state));
  }

  async handlePublicMatchFound(payload, state = {}) {
    this.stopPublicQueueTimer();
    this.matchStateManager = null;
    this.onlineShotActive = false;
    this.onlineAnimationSettled = true;
    this.pendingOnlineSettledPayload = null;
    this.sceneRenderer?.setInputEnabled(false);
    this.sceneRenderer?.setSceneOrbitEnabled(true);
    await this.onlineRoomController?.connect();
    this.onlineRoomController?.adoptMatchedRoom(payload);
    this.onlinePublicQueueController?.readyForMatch(payload);
    this.ui.setSidePanelSection('onlinePublic');
    this.ui.updatePublicMatchmakingPanel?.(createPublicMatchmakingModel(state));
    this.updatePhysicsHud(`Match found vs ${payload?.opponentName || 'opponent'}. Starting...`, {
      matchMode: 'onlinePublic',
      matchModeLabel: 'Online Public',
      onlineActive: true,
      onlineConnectionStatus: 'Connected',
      onlineTurnStatus: 'Match found',
      bannerTone: 'success'
    });
    this.audioManager?.play('matchStart', { intensity: 0.65 });
  }

  handlePublicQueueError(payload, state = {}) {
    this.stopPublicQueueTimer();
    this.updatePhysicsHud(payload?.message || 'Public matchmaking error.', {
      bannerTone: 'danger'
    });
    this.ui?.updatePublicMatchmakingPanel?.(createPublicMatchmakingModel(state || this.onlinePublicQueueController?.state));
  }

  startPublicQueueTimer() {
    if (this.publicQueueTimer) {
      return;
    }
    this.publicQueueTimer = window.setInterval(() => {
      this.onlinePublicQueueController?.ping?.();
      this.ui?.updatePublicMatchmakingPanel?.(
        createPublicMatchmakingModel(this.onlinePublicQueueController?.state)
      );
    }, 1000);
  }

  stopPublicQueueTimer() {
    window.clearInterval(this.publicQueueTimer);
    this.publicQueueTimer = 0;
  }

  handleIncomingRoomLink() {
    if (typeof window === 'undefined') {
      return false;
    }
    const url = new URL(window.location.href);
    const roomCode = (url.searchParams.get('room') || url.searchParams.get('carromRoom') || '').trim().toUpperCase();
    if (!roomCode) {
      return false;
    }

    url.searchParams.delete('room');
    url.searchParams.delete('carromRoom');
    window.history?.replaceState?.({}, '', url.toString());
    this.showOnlinePanel();
    this.ui?.setOnlineView?.('join');
    const roomInput = this.root?.querySelector?.('#onlineRoomCode');
    if (roomInput) {
      roomInput.value = roomCode;
    }
    window.setTimeout(() => {
      this.joinOnlineRoom({
        playerName: this.localSetup.playerTwoName || DEFAULT_LOCAL_SETUP.playerTwoName,
        roomCode
      });
    }, 250);
    return true;
  }

  async createOnlineRoom(values = {}) {
    this.cancelCosmeticPreviewIfLeaving('online');
    this.onlinePublicQueueController?.cancelQueue?.();
    this.stopPublicQueueTimer();
    this.botController?.cancel();
    this.exitSoloModes({ restoreBoard: true, updateHud: false });
    this.matchStateManager = null;
    this.sceneRenderer?.setInputEnabled(false);
    this.sceneRenderer?.setSceneOrbitEnabled(true);
    this.ui.setSidePanelSection('online');
    try {
      await this.onlineRoomController?.createRoom(values);
    } catch (error) {
      this.handleOnlineError({ message: error.message || 'Could not create online room.' }, this.onlineRoomController?.state);
    }
  }

  async joinOnlineRoom(values = {}) {
    this.cancelCosmeticPreviewIfLeaving('online');
    this.onlinePublicQueueController?.cancelQueue?.();
    this.stopPublicQueueTimer();
    this.botController?.cancel();
    this.exitSoloModes({ restoreBoard: true, updateHud: false });
    this.matchStateManager = null;
    this.sceneRenderer?.setInputEnabled(false);
    this.sceneRenderer?.setSceneOrbitEnabled(true);
    this.ui.setSidePanelSection('online');
    try {
      await this.onlineRoomController?.joinRoom(values);
    } catch (error) {
      this.handleOnlineError({ message: error.message || 'Could not join online room.' }, this.onlineRoomController?.state);
    }
  }

  leaveOnlineRoom() {
    const wasPublic = this.match?.matchMode === 'onlinePublic'
      || this.onlineRoomController?.state?.roomType === 'public'
      || this.onlineRoomController?.state?.roomState?.roomType === 'public';
    this.onlineRoomController?.leaveRoom();
    this.onlinePublicQueueController?.cancelQueue?.();
    this.onlineSessionManager?.clearSession?.();
    this.stopPublicQueueTimer();
    this.onlineShotActive = false;
    this.onlineAnimationSettled = true;
    this.pendingOnlineSettledPayload = null;
    this.matchStateManager = null;
    this.sceneRenderer?.setInputEnabled(false);
    this.sceneRenderer?.setSceneOrbitEnabled(true);
    this.sceneRenderer?.clearFeedback?.();
    this.match = {
      ...SHELL_MATCH_DEFAULTS,
      status: 'Left online room.'
    };
    this.ui.updateMatch(this.match);
    if (wasPublic) {
      this.showPublicMatchmakingPanel();
    } else {
      this.showOnlinePanel();
    }
  }

  startOnlineMatch() {
    this.onlineRoomController?.startMatch();
  }

  requestOnlineRematch() {
    const requested = this.onlineRoomController?.requestRematch?.();
    this.updatePhysicsHud(requested ? 'Rematch request sent.' : 'Could not request rematch.', {
      onlineTurnStatus: requested ? 'Rematch requested' : 'Rematch unavailable',
      bannerTone: requested ? 'success' : 'warning'
    });
    this.ui.updateOnlinePanel?.(createOnlinePanelModel(this.onlineRoomController?.state));
  }

  respondOnlineRematch(accepted) {
    const sent = this.onlineRoomController?.respondRematch?.(accepted);
    this.updatePhysicsHud(sent
      ? accepted ? 'Rematch accepted.' : 'Rematch declined.'
      : 'Could not respond to rematch.', {
      onlineTurnStatus: accepted ? 'Rematch accepted' : 'Rematch declined',
      bannerTone: sent ? (accepted ? 'success' : 'warning') : 'danger'
    });
    this.ui.updateOnlinePanel?.(createOnlinePanelModel(this.onlineRoomController?.state));
  }

  copyOnlineRoomCode() {
    const code = this.onlineRoomController?.state?.roomCode || '';
    if (!code) {
      this.updatePhysicsHud('No room code to copy.', { bannerTone: 'warning' });
      return;
    }

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code).then(() => {
        this.updatePhysicsHud(`Room code ${code} copied.`, { bannerTone: 'success' });
      }).catch(() => {
        this.updatePhysicsHud(`Room code: ${code}`, { bannerTone: 'default' });
      });
      return;
    }

    this.updatePhysicsHud(`Room code: ${code}`, { bannerTone: 'default' });
  }

  getOnlineRoomLink() {
    const code = this.onlineRoomController?.state?.roomCode || '';
    if (!code || typeof window === 'undefined') {
      return '';
    }
    const url = new URL(window.location.href);
    url.searchParams.set('room', code);
    return url.toString();
  }

  copyOnlineRoomLink() {
    const link = this.getOnlineRoomLink();
    if (!link) {
      this.updatePhysicsHud('No room link to share.', { bannerTone: 'warning' });
      return;
    }

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(link).then(() => {
        this.updatePhysicsHud('Room invite link copied.', { bannerTone: 'success' });
      }).catch(() => {
        this.updatePhysicsHud(`Room link: ${link}`, { bannerTone: 'default' });
      });
      return;
    }

    this.updatePhysicsHud(`Room link: ${link}`, { bannerTone: 'default' });
  }

  requestOnlineState() {
    if (!this.debugOnline) {
      return;
    }
    this.onlineRoomController?.requestRoomState?.();
    this.updatePhysicsHud('Requested authoritative online snapshot.', {
      onlineTurnStatus: 'Syncing board',
      bannerTone: 'default'
    });
  }

  getActionConfirmation(action) {
    const onlineRoomActive = Boolean(
      this.onlineRoomController?.state?.roomCode
      || this.onlineRoomController?.state?.roomState
      || this.onlineRoomController?.state?.matchState
      || this.match?.matchMode === 'onlinePrivate'
      || this.match?.matchMode === 'onlinePublic'
    );
    const queueActive = this.onlinePublicQueueController?.state?.status === 'queued'
      || Boolean(this.onlinePublicQueueController?.state?.queueId);
    const localMatchActive = Boolean(this.matchStateManager && this.state !== APP_STATES.result);
    const practiceActive = Boolean(this.practiceController?.active);
    const tutorialActive = Boolean(this.tutorialController?.active);
    const challengeActive = Boolean(this.challengeManager?.active);
    const soloActive = practiceActive || tutorialActive || challengeActive;
    const leaveOnlineCopy = {
      eyebrow: 'Online Room',
      title: 'Leave online room?',
      body: 'You will disconnect from the current online room and your opponent will be notified.',
      detail: 'Use this only when you are ready to leave the match or lobby.',
      confirmLabel: 'Leave Room',
      cancelLabel: 'Stay'
    };

    if (action === 'quit-match') {
      if (onlineRoomActive) {
        return leaveOnlineCopy;
      }
      if (localMatchActive) {
        return {
          eyebrow: 'Quit Match',
          title: 'Quit current match?',
          body: 'The active local match will end and the result screen will open.',
          detail: 'Current board position and turn progress will not continue.',
          confirmLabel: 'Quit Match',
          cancelLabel: 'Keep Playing'
        };
      }
      return null;
    }

    if (action === 'leave-online-room') {
      return onlineRoomActive ? leaveOnlineCopy : null;
    }

    if (action === 'cancel-public-queue') {
      return queueActive ? {
        eyebrow: 'Public Queue',
        title: 'Cancel matchmaking?',
        body: 'You will leave the public matchmaking queue.',
        confirmLabel: 'Cancel Queue',
        cancelLabel: 'Keep Searching'
      } : null;
    }

    if (['main-menu', 'open-local-setup', 'mode-select'].includes(action)) {
      if (onlineRoomActive) {
        return leaveOnlineCopy;
      }
      if (localMatchActive) {
        return {
          eyebrow: 'Return To Setup',
          title: 'Leave current match?',
          body: 'Returning to setup will stop the current local match.',
          confirmLabel: 'Leave Match',
          cancelLabel: 'Keep Playing'
        };
      }
      if (soloActive) {
        return {
          eyebrow: 'Leave Activity',
          title: 'Exit this activity?',
          body: 'Current practice, tutorial, or challenge progress on the table will be cleared.',
          confirmLabel: 'Exit',
          cancelLabel: 'Stay'
        };
      }
      return null;
    }

    if (action === 'restart-match' && localMatchActive) {
      return {
        eyebrow: 'Restart Match',
        title: 'Restart this match?',
        body: 'The board, scores, queen state, and current turn will reset.',
        confirmLabel: 'Restart',
        cancelLabel: 'Cancel'
      };
    }

    if (action === 'tutorial-exit' && tutorialActive) {
      return {
        eyebrow: 'Tutorial',
        title: 'Exit tutorial?',
        body: 'You will return to setup and the current tutorial step will close.',
        confirmLabel: 'Exit Tutorial',
        cancelLabel: 'Continue'
      };
    }

    if (action === 'exit-practice' && practiceActive) {
      return {
        eyebrow: 'Practice',
        title: 'Exit practice?',
        body: 'The current drill setup will be cleared.',
        confirmLabel: 'Exit Practice',
        cancelLabel: 'Continue'
      };
    }

    if (action === 'reset-practice' && practiceActive) {
      return {
        eyebrow: 'Practice',
        title: 'Reset drill?',
        body: 'The drill pieces and shot state will return to the start.',
        confirmLabel: 'Reset Drill',
        cancelLabel: 'Cancel'
      };
    }

    if (action === 'exit-challenge' && challengeActive) {
      return {
        eyebrow: 'Challenge',
        title: 'Exit challenge?',
        body: 'The current challenge attempt will end and the board will return to setup.',
        confirmLabel: 'Exit Challenge',
        cancelLabel: 'Continue'
      };
    }

    if (action === 'reset-challenge-progress') {
      return {
        eyebrow: 'Challenge Progress',
        title: 'Reset all challenge stars?',
        body: 'Saved challenge progress on this device will be cleared.',
        confirmLabel: 'Reset Progress',
        cancelLabel: 'Cancel'
      };
    }

    if (action === 'reset-cosmetics') {
      return {
        eyebrow: 'Cosmetics',
        title: 'Reset cosmetics?',
        body: 'Your equipped board, coin, striker, table, and VFX cosmetics will return to the default loadout.',
        confirmLabel: 'Reset Loadout',
        cancelLabel: 'Cancel'
      };
    }

    if (action === 'reset-settings') {
      return {
        eyebrow: 'Settings',
        title: 'Reset settings?',
        body: 'Theme, sound, camera motion, effects, and quality preferences will return to defaults.',
        confirmLabel: 'Reset Settings',
        cancelLabel: 'Cancel'
      };
    }

    if (action === 'reset-onboarding') {
      return {
        eyebrow: 'Onboarding',
        title: 'Reset onboarding?',
        body: 'The first-time guide will appear again on the next launch.',
        confirmLabel: 'Reset Onboarding',
        cancelLabel: 'Cancel'
      };
    }

    if (action === 'discard-online-session') {
      return {
        eyebrow: 'Online Session',
        title: 'Discard saved session?',
        body: 'The reconnect prompt for the previous online room will be cleared from this device.',
        confirmLabel: 'Discard Session',
        cancelLabel: 'Keep Session'
      };
    }

    return null;
  }

  endOnlineSession({ updateHud = true } = {}) {
    const hadOnline = Boolean(
      this.onlineRoomController?.state?.roomCode
      || this.onlineRoomController?.state?.matchState
      || this.onlineRoomController?.state?.roomState
      || this.onlinePublicQueueController?.state?.queueId
      || this.onlinePublicQueueController?.state?.status === 'queued'
      || this.match?.matchMode === 'onlinePrivate'
      || this.match?.matchMode === 'onlinePublic'
    );
    if (!hadOnline) {
      return;
    }

    this.onlineRoomController?.leaveRoom();
    this.onlinePublicQueueController?.cancelQueue?.();
    this.onlineSessionManager?.clearSession?.();
    this.stopPublicQueueTimer();
    this.onlineShotActive = false;
    this.onlineAnimationSettled = true;
    this.pendingOnlineSettledPayload = null;
    if (updateHud) {
      this.match = {
        ...SHELL_MATCH_DEFAULTS,
        status: 'Online room closed.'
      };
      this.ui?.updateMatch(this.match);
    }
  }

  handleOnlineControllerChange(state = {}) {
    this.ui?.updateOnlinePanel?.(createOnlinePanelModel(state));
    if (this.match?.matchMode === 'onlinePrivate' || this.match?.matchMode === 'onlinePublic') {
      const matchState = state.matchState || state.roomState?.matchState || this.getOnlineMatchState();
      if (matchState && !this.onlineShotActive) {
        this.match = this.onlineStateSync?.toHud(matchState, state) || this.match;
        this.ui?.updateMatch(this.match);
      }
    }
  }

  handleOnlineSession(session = null, state = {}) {
    if (!session?.sessionId) {
      return;
    }
    this.onlineSessionManager?.saveSession?.({
      ...session,
      matchId: state.matchState?.matchId || state.roomState?.matchState?.matchId || session.matchId || '',
      mode: state.roomType === 'public' || state.roomState?.roomType === 'public' ? 'onlinePublic' : session.mode
    });
  }

  handleOnlineRoomState(state = {}) {
    this.ui?.updateOnlinePanel?.(createOnlinePanelModel(state));
    const matchState = state.matchState || state.roomState?.matchState || null;
    if (matchState && (this.match?.matchMode === 'onlinePrivate' || this.match?.matchMode === 'onlinePublic') && !this.onlineShotActive) {
      this.applyOnlineMatchSnapshot(matchState, state, { reconcile: false });
      return;
    }
    if (state.status === 'disconnected' && (this.match?.matchMode === 'onlinePrivate' || this.match?.matchMode === 'onlinePublic')) {
      this.sceneRenderer?.setInputEnabled(false);
      this.updatePhysicsHud(state.message || 'Opponent left the room.', {
        onlineConnectionStatus: state.connectionStatus || 'Disconnected',
        onlineTurnStatus: 'Room closed',
        bannerTone: 'warning'
      });
    }
  }

  handleOnlineMatchStarted(matchState, state = {}, { showIntro = true } = {}) {
    this.botController?.cancel();
    this.exitSoloModes({ restoreBoard: true, updateHud: false });
    this.matchStateManager = null;
    this.onlineShotActive = false;
    this.onlineAnimationSettled = true;
    this.pendingOnlineSettledPayload = null;
    this.onlineSessionManager?.updateSession?.({
      matchId: matchState?.matchId || '',
      roomCode: matchState?.roomCode || state.roomCode || '',
      mode: matchState?.mode || (state.roomType === 'public' ? 'onlinePublic' : 'onlinePrivate'),
      playerId: state.playerId || ''
    });
    this.sceneRenderer?.clearFeedback?.();
    this.sceneRenderer?.setSceneOrbitEnabled(false);
    this.match = this.onlineStateSync?.applyMatchState(matchState, state) || {
      ...SHELL_MATCH_DEFAULTS,
      matchMode: matchState?.mode === 'onlinePublic' ? 'onlinePublic' : 'onlinePrivate'
    };
    this.ui.updateMatch(this.match);
    this.ui.updateOnlinePanel?.(createOnlinePanelModel(state));
    this.ui.updatePublicMatchmakingPanel?.(createPublicMatchmakingModel(this.onlinePublicQueueController?.state));
    this.ui.setSidePanelSection(this.match.matchMode === 'onlinePublic' ? 'onlinePublic' : 'online');
    this.hudCollapsed = true;
    this.ui.setHudCollapsed(true);
    this.setState(APP_STATES.playing);
    this.audioManager?.play('matchStart');
    if (showIntro) {
      this.showOnlineVsIntro(matchState, state);
    }
    this.sceneRenderer?.vfxManager?.banner?.show?.({
      eyebrow: this.match.matchModeLabel || 'Online',
      title: 'Match Started',
      detail: this.match.onlineTurnStatus || 'Server-owned match state is live.',
      tone: 'success',
      reduced: this.settings.reducedEffects
    });
    this.prepareOnlineTurn({ silent: true });
  }

  handleOnlineReconnectAccepted(payload, state = {}) {
    this.onlineShotActive = false;
    this.onlineAnimationSettled = true;
    this.pendingOnlineSettledPayload = null;
    this.handleOnlineSession(payload.session, state);
    const matchState = payload.matchState || payload.roomState?.matchState || null;
    if (matchState) {
      if (matchState.status === 'finished') {
        this.applyOnlineMatchSnapshot(matchState, state, { reconcile: true });
      } else {
        this.handleOnlineMatchStarted(matchState, state, { showIntro: false });
      }
      this.updatePhysicsHud('Reconnected to online match.', {
        onlineConnectionStatus: 'Connected',
        bannerTone: 'success'
      });
      return;
    }
    this.ui.updateOnlinePanel?.(createOnlinePanelModel(state));
    this.updatePhysicsHud('Reconnected to online lobby.', { bannerTone: 'success' });
  }

  handleOnlineReconnectRejected(payload, state = {}) {
    this.onlineSessionManager?.clearSession?.();
    this.sceneRenderer?.setInputEnabled(false);
    this.ui.updateOnlinePanel?.(createOnlinePanelModel(state || this.onlineRoomController?.state));
    this.updatePhysicsHud(payload?.message || 'Online session expired.', {
      onlineConnectionStatus: 'Session expired',
      bannerTone: 'warning'
    });
  }

  handleOnlineShotAccepted(payload, state = {}) {
    this.onlineShotActive = true;
    this.onlineAnimationSettled = false;
    this.sceneRenderer?.setInputEnabled(false);
    this.updatePhysicsHud('Shot accepted.', {
      onlineConnectionStatus: state.connectionStatus || 'Connected',
      onlineTurnStatus: 'Shot accepted',
      shotPower: 'Queued',
      shotPowerRatio: 0.4
    });
    this.ui?.updateOnlinePanel?.(createOnlinePanelModel(state));
  }

  handleOnlineShotRejected(payload, state = {}) {
    this.onlineShotActive = false;
    this.onlineAnimationSettled = true;
    this.pendingOnlineSettledPayload = null;
    this.audioManager?.play('foul', { intensity: 0.45 });
    this.updatePhysicsHud(payload?.message || 'Shot rejected by server.', {
      onlineConnectionStatus: state.connectionStatus || 'Connected',
      onlineTurnStatus: 'Shot rejected',
      shotPower: 'Ready',
      shotPowerRatio: 0,
      bannerTone: 'danger'
    });
    this.prepareOnlineTurn({ silent: true });
  }

  handleOnlineShotStarted(payload, state = {}) {
    this.onlineShotActive = true;
    this.onlineAnimationSettled = false;
    this.pendingOnlineSettledPayload = null;
    this.sceneRenderer?.setSceneOrbitEnabled(false);
    this.sceneRenderer?.setInputEnabled(false);
    const fired = this.sceneRenderer?.applyAuthoritativeShot(payload);
    const ratio = Math.min(Math.max((Number(payload?.power) || 0) / CARROM_INPUT.MAX_SHOT_POWER, 0.35), 1);
    this.updatePhysicsHud('Opponent shooting...', {
      onlineConnectionStatus: state.connectionStatus || 'Connected',
      onlineTurnStatus: payload.playerId === state.playerId ? 'Shot in motion' : 'Opponent shooting...',
      shotPower: 'Moving',
      shotPowerRatio: 1
    });
    this.audioManager?.play('shotRelease', { intensity: ratio });
    this.sceneRenderer?.playShotRelease(ratio);
    if (!fired) {
      this.onlineAnimationSettled = true;
      this.updatePhysicsHud('Waiting for server result...', {
        onlineTurnStatus: 'Syncing',
        bannerTone: 'warning'
      });
    }
  }

  handleOnlineShotSettled(payload, state = {}) {
    this.pendingOnlineSettledPayload = payload;
    this.ui?.updateOnlinePanel?.(createOnlinePanelModel(state));
    if (this.onlineAnimationSettled || !this.onlineShotActive) {
      this.applyOnlineSettledPayload(payload, state);
      return;
    }
    this.updatePhysicsHud('Syncing server result...', {
      onlineTurnStatus: 'Syncing',
      shotPower: 'Syncing',
      shotPowerRatio: 0.2
    });
  }

  handleOnlineMatchState(matchState, state = {}) {
    if (!matchState) {
      return;
    }
    if (this.onlineShotActive && !this.onlineAnimationSettled) {
      this.pendingOnlineSettledPayload = { matchState };
      return;
    }
    this.applyOnlineMatchSnapshot(matchState, state, { reconcile: !this.onlineShotActive });
  }

  handleOnlineMatchFinished(payload, state = {}) {
    if (this.onlineShotActive && !this.onlineAnimationSettled) {
      this.pendingOnlineSettledPayload = {
        ...payload,
        matchState: payload.matchState
      };
      return;
    }
    this.applyOnlineSettledPayload(payload, state);
  }

  handleOnlinePlayerLeft(payload, state = {}) {
    this.onlineShotActive = false;
    this.onlineAnimationSettled = true;
    this.pendingOnlineSettledPayload = null;
    this.sceneRenderer?.setInputEnabled(false);
    this.sceneRenderer?.setSceneOrbitEnabled(true);
    this.updatePhysicsHud(payload?.reason || 'Opponent left.', {
      onlineConnectionStatus: state?.connectionStatus || 'Player left',
      onlineTurnStatus: 'Room paused',
      bannerTone: 'warning'
    });
    this.ui?.updateOnlinePanel?.(createOnlinePanelModel(state || this.onlineRoomController?.state));
  }

  handleOnlineDisconnectGrace(payload, state = {}) {
    this.onlineShotActive = false;
    this.onlineAnimationSettled = true;
    this.pendingOnlineSettledPayload = null;
    this.sceneRenderer?.setInputEnabled(false);
    this.sceneRenderer?.setSceneOrbitEnabled(true);
    this.updatePhysicsHud(payload?.message || 'Opponent disconnected. Waiting for reconnect...', {
      onlineConnectionStatus: state?.connectionStatus || 'Opponent disconnected',
      onlineTurnStatus: `Reconnect ${Math.max(0, Math.ceil((Number(payload?.remainingMs) || 0) / 1000))}s`,
      bannerTone: 'warning'
    });
    this.ui?.updateOnlinePanel?.(createOnlinePanelModel(state || this.onlineRoomController?.state));
  }

  handleOnlineDisconnectExpired(payload, state = {}) {
    this.onlineShotActive = false;
    this.onlineAnimationSettled = true;
    this.pendingOnlineSettledPayload = null;
    this.onlineSessionManager?.clearSession?.();
    this.sceneRenderer?.setInputEnabled(false);
    this.sceneRenderer?.setSceneOrbitEnabled(true);
    this.updatePhysicsHud(payload?.message || 'Opponent did not reconnect.', {
      onlineConnectionStatus: 'Room closed',
      onlineTurnStatus: 'Closed',
      bannerTone: 'danger'
    });
    this.ui?.updateOnlinePanel?.(createOnlinePanelModel(state || this.onlineRoomController?.state));
  }

  handleOnlineRoomClosed(payload, state = {}) {
    this.onlineSessionManager?.clearSession?.();
    this.sceneRenderer?.setInputEnabled(false);
    this.sceneRenderer?.setSceneOrbitEnabled(true);
    this.updatePhysicsHud(payload?.reason || 'Room closed.', {
      onlineConnectionStatus: 'Room closed',
      onlineTurnStatus: 'Closed',
      bannerTone: 'warning'
    });
    this.ui?.updateOnlinePanel?.(createOnlinePanelModel(state || this.onlineRoomController?.state));
  }

  handleOnlinePlayerReconnected(payload, state = {}) {
    this.updatePhysicsHud(payload?.message || 'Player reconnected.', {
      onlineConnectionStatus: 'Connected',
      bannerTone: 'success'
    });
    this.ui?.updateOnlinePanel?.(createOnlinePanelModel(state || this.onlineRoomController?.state));
    this.prepareOnlineTurn({ silent: true });
  }

  handleOnlineTurnTimer(payload, state = {}) {
    if (!(this.match?.matchMode === 'onlinePrivate' || this.match?.matchMode === 'onlinePublic')) {
      return;
    }
    const matchState = this.getOnlineMatchState();
    if (matchState && !this.onlineShotActive) {
      this.match = this.onlineStateSync?.toHud(matchState, state) || this.match;
      this.ui?.updateMatch(this.match);
    }
    this.ui?.updateOnlinePanel?.(createOnlinePanelModel(state || this.onlineRoomController?.state));
  }

  handleOnlineTurnTimeout(payload, state = {}) {
    const matchState = payload?.matchState || state?.matchState || null;
    if (matchState) {
      this.applyOnlineMatchSnapshot(matchState, state, { reconcile: false });
    }
    this.updatePhysicsHud('Turn timed out.', {
      onlineTurnStatus: 'Turn switched',
      bannerTone: 'warning'
    });
  }

  handleOnlineRematchState(payload, state = {}) {
    this.sceneRenderer?.setInputEnabled(false);
    this.ui?.updateOnlinePanel?.(createOnlinePanelModel(state || this.onlineRoomController?.state));
    this.updatePhysicsHud(state?.message || payload?.message || 'Rematch status updated.', {
      onlineTurnStatus: 'Rematch',
      bannerTone: payload?.rematch?.status === 'declined' ? 'warning' : 'success'
    });
  }

  handleOnlineRematchStarted(payload, state = {}) {
    this.handleOnlineMatchStarted(payload.matchState, state);
    this.updatePhysicsHud('Rematch started.', {
      onlineConnectionStatus: 'Connected',
      onlineTurnStatus: 'Rematch started',
      bannerTone: 'success'
    });
  }

  handleOnlineError(payload, state = {}) {
    const message = payload?.message || 'Online room error.';
    this.updatePhysicsHud(message, {
      onlineConnectionStatus: state?.connectionStatus || 'Online error',
      onlineTurnStatus: 'Error',
      bannerTone: 'danger'
    });
    this.ui?.updateOnlinePanel?.(createOnlinePanelModel(state || this.onlineRoomController?.state));
  }

  handleOnlineShotIntent(result = {}) {
    const matchState = this.getOnlineMatchState();
    const onlineState = this.onlineRoomController?.state || {};
    const motion = this.sceneRenderer?.getBoardSnapshot?.()?.motion || {};
    if (!this.onlineStateSync?.canLocalPlayerShoot(matchState, onlineState, motion)) {
      this.updatePhysicsHud('Waiting for your online turn.', {
        onlineTurnStatus: 'Opponent turn',
        shotPower: 'Locked',
        shotPowerRatio: 0,
        bannerTone: 'warning'
      });
      this.prepareOnlineTurn({ silent: true });
      return;
    }

    const submitted = this.onlineRoomController?.submitShot({
      clientShotId: this.createClientShotId(),
      strikerPosition: result.strikerPosition,
      direction: result.direction,
      power: result.power,
      powerRatio: result.powerRatio
    });
    if (!submitted) {
      this.updatePhysicsHud('Could not submit online shot.', {
        onlineTurnStatus: 'Submit failed',
        bannerTone: 'danger'
      });
      this.prepareOnlineTurn({ silent: true });
      return;
    }

    this.onlineShotActive = true;
    this.onlineAnimationSettled = false;
    this.sceneRenderer?.setInputEnabled(false);
    this.updatePhysicsHud('Shot sent to server...', {
      onlineConnectionStatus: onlineState.connectionStatus || 'Connected',
      onlineTurnStatus: 'Sending shot...',
      shotPower: 'Queued',
      shotPowerRatio: Math.max(0.15, Number(result.powerRatio) || 0.4)
    });
  }

  handleOnlineLocalPhysicsSettled(summary = {}) {
    this.onlineAnimationSettled = true;
    if (this.pendingOnlineSettledPayload) {
      this.applyOnlineSettledPayload(this.pendingOnlineSettledPayload, this.onlineRoomController?.state || {});
      return;
    }
    this.updatePhysicsHud(`Online animation settled. Pocketed: ${summary.pocketedCount || 0}. Waiting for server...`, {
      onlineTurnStatus: 'Waiting for server',
      shotPower: 'Syncing',
      shotPowerRatio: 0.15
    });
  }

  applyOnlineSettledPayload(payload = {}, state = this.onlineRoomController?.state || {}) {
    const matchState = payload.matchState || payload;
    if (!matchState) {
      return;
    }
    this.onlineShotActive = false;
    this.onlineAnimationSettled = true;
    this.pendingOnlineSettledPayload = null;
    this.sceneRenderer?.clearFeedback?.();
    this.applyOnlineMatchSnapshot(matchState, state, { reconcile: true });
    if (matchState.status !== 'finished') {
      this.updatePhysicsHud(this.match?.status || 'Board synced.', {
        onlineTurnStatus: 'Synced',
        shotPower: 'Settled',
        shotPowerRatio: 0
      });
    }
  }

  applyOnlineMatchSnapshot(matchState, state = this.onlineRoomController?.state || {}, { reconcile = true, updatePanel = true } = {}) {
    if (!matchState) {
      return;
    }
    const alreadyShowingResult = this.state === APP_STATES.result
      && (this.match?.matchMode === 'onlinePrivate' || this.match?.matchMode === 'onlinePublic');
    this.match = reconcile
      ? this.onlineStateSync?.applyMatchState(matchState, state)
      : this.onlineStateSync?.toHud(matchState, state);
    this.match = {
      ...SHELL_MATCH_DEFAULTS,
      ...this.match
    };
    this.ui.updateMatch(this.match);
    if (updatePanel) {
      this.ui.updateOnlinePanel?.(createOnlinePanelModel(state));
      this.ui.updatePublicMatchmakingPanel?.(createPublicMatchmakingModel(this.onlinePublicQueueController?.state));
    }
    if (matchState.status === 'finished') {
      this.sceneRenderer?.setInputEnabled(false);
      this.sceneRenderer?.setSceneOrbitEnabled(false);
      if (!alreadyShowingResult) {
        this.audioManager?.play('win');
      }
      this.setState(APP_STATES.result);
      return;
    }
    this.setState(APP_STATES.playing);
    this.prepareOnlineTurn({ silent: true });
  }

  getOnlineMatchState() {
    return this.onlineRoomController?.state?.matchState
      || this.onlineRoomController?.state?.roomState?.matchState
      || null;
  }

  isOnlineMatchActive() {
    const matchState = this.getOnlineMatchState();
    return Boolean(
      this.match?.matchMode === 'onlinePrivate'
      || this.match?.matchMode === 'onlinePublic'
      || matchState?.status === 'playing'
      || matchState?.status === 'finished'
    );
  }

  shouldDeferShotRelease() {
    return this.isOnlineMatchActive();
  }

  prepareOnlineTurn({ silent = true } = {}) {
    const matchState = this.getOnlineMatchState();
    if (!matchState || this.state !== APP_STATES.playing) {
      this.sceneRenderer?.setInputEnabled(false);
      return;
    }
    const motion = this.sceneRenderer?.getBoardSnapshot?.()?.motion || {};
    const enabled = this.onlineStateSync?.canLocalPlayerShoot(matchState, this.onlineRoomController?.state || {}, motion);
    const inputBaseline = this.onlineStateSync?.getActiveBaseline(matchState) || 'bottom';
    const cameraBaseline = this.onlineStateSync?.getLocalPlayerBaseline(matchState, this.onlineRoomController?.state || {}) || inputBaseline;
    this.sceneRenderer?.setSceneOrbitEnabled(false);
    this.sceneRenderer?.prepareForTurn({
      baseline: inputBaseline,
      cameraBaseline,
      enabled,
      silent,
      rotateCamera: true
    });
  }

  showOnlineVsIntro(matchState = {}, state = {}) {
    const players = matchState.players || [];
    const localPlayer = players.find((player) => player.id === state.playerId) || players[0] || null;
    const opponent = players.find((player) => player.id !== localPlayer?.id) || players[1] || null;
    this.ui?.showVsIntro?.({
      leftName: localPlayer?.name || 'You',
      leftMeta: localPlayer?.id === state.playerId ? 'You' : 'Host',
      rightName: opponent?.name || 'Opponent',
      rightMeta: 'Opponent',
      modeLabel: matchState.mode === 'onlinePublic' ? 'Online Public' : 'Online Private',
      roomCode: matchState.roomCode || state.roomCode || ''
    });
  }

  createClientShotId() {
    const random = Math.random().toString(36).slice(2, 8);
    return `client-${Date.now().toString(36)}-${random}`;
  }

  showSidePanelSection(section) {
    this.cancelCosmeticPreviewIfLeaving(section);
    this.ui.setSidePanelSection(section);
    this.hudCollapsed = false;
    this.ui.setHudCollapsed(false);
    if (this.state !== APP_STATES.result) {
      this.setState(APP_STATES.playing);
      if (!this.matchStateManager || section === 'setup') {
        this.sceneRenderer?.setInputEnabled(false);
        this.sceneRenderer?.setSceneOrbitEnabled(true);
      } else if (section === 'customize') {
        this.sceneRenderer?.setInputEnabled(false);
        this.sceneRenderer?.setSceneOrbitEnabled(false);
      } else {
        this.sceneRenderer?.setSceneOrbitEnabled(false);
      }
    }
  }

  openOverlay(state) {
    if (![APP_STATES.rules, APP_STATES.settings, APP_STATES.about].includes(state)) {
      return;
    }

    if (![APP_STATES.rules, APP_STATES.settings, APP_STATES.about].includes(this.state)) {
      this.returnState = this.state === APP_STATES.loading ? APP_STATES.mainMenu : this.state;
    }
    this.setState(state);
  }

  returnFromOverlay() {
    this.setState(this.returnState || APP_STATES.playing);
  }

  showDebugResult() {
    if (!this.debugPhysics) {
      return;
    }
    this.returnState = APP_STATES.playing;
    this.setState(APP_STATES.result);
  }

  toggleHudCollapsed() {
    this.hudCollapsed = !this.hudCollapsed;
    this.ui.setHudCollapsed(this.hudCollapsed);
  }

  testPhysicsShot() {
    if (!this.debugPhysics || this.state !== APP_STATES.playing) {
      return;
    }

    const fired = this.sceneRenderer?.applyDevTestShot();
    if (!fired) {
      this.updatePhysicsHud('Physics is busy or striker is pocketed.', { shotPower: 'Waiting' });
    } else {
      this.audioManager?.play('shotRelease');
      this.sceneRenderer?.playShotRelease(0.8);
    }
  }

  quitMatch() {
    this.botController?.cancel();
    if (this.isOnlineMatchActive()) {
      this.leaveOnlineRoom();
      return;
    }
    if (!this.matchStateManager) {
      this.showLocalSetup();
      return;
    }

    const result = this.matchStateManager.quitCurrentMatch();
    this.match = {
      ...this.match,
      ...result.hud
    };
    this.ui.updateMatch(this.match);
    this.playRuleFeedback(result);
    this.audioManager?.play('win');
    this.sceneRenderer?.setInputEnabled(false);
    this.sceneRenderer?.setSceneOrbitEnabled(false);
    this.setState(APP_STATES.result);
  }

  resetPhysicsScene() {
    if (!this.debugPhysics) {
      return;
    }
    this.botController?.cancel();
    this.sceneRenderer?.resetPhysics();
    if (this.matchStateManager) {
      this.matchStateManager.resetMatch({
        playerOneName: this.localSetup.playerOneName,
        playerTwoName: this.localSetup.playerTwoName,
        matchMode: this.localSetup.matchMode,
        botDifficulty: this.localSetup.botDifficulty,
        classicRuleVariant: this.localSetup.classicRuleVariant,
        ruleMode: this.localSetup.ruleMode,
        coinSide: this.localSetup.coinSide,
        boardStyle: this.localSetup.boardStyle,
        matchType: this.localSetup.matchType
      });
      this.prepareActiveTurn({ silent: true });
      this.match = {
        ...this.match,
        ...this.matchStateManager.toHudMatch([`Match reset. ${this.localSetup.playerOneName || 'Player 1'} starts.`])
      };
    } else {
      this.match = {
        ...this.match,
        queenStatus: SHELL_MATCH_DEFAULTS.queenStatus,
        shotPower: SHELL_MATCH_DEFAULTS.shotPower,
        shotPowerRatio: SHELL_MATCH_DEFAULTS.shotPowerRatio,
        status: 'Physics reset. Ready for striker placement.'
      };
    }
      this.ui.updateMatch(this.match);
      this.sceneRenderer?.playResetEffect();
      this.audioManager?.play('reset');
    }

  handleGlobalKeydown(event) {
    if (event.repeat || this.isEditableTarget(event.target)) {
      return;
    }

    const key = event.key.toLowerCase();
    if (key === 'escape') {
      event.preventDefault();
      this.handleEscapeShortcut();
      return;
    }

    if (key === 'm') {
      event.preventDefault();
      this.updateSetting('sound', !this.settings.sound);
      return;
    }

    if (key === 'h') {
      event.preventDefault();
      this.showRules();
      return;
    }

    if (this.debugPhysics && key === 't') {
      event.preventDefault();
      this.testPhysicsShot();
    }
  }

  isEditableTarget(target) {
    return Boolean(target?.closest?.('input, textarea, select, [contenteditable="true"]'));
  }

  handleEscapeShortcut() {
    if (this.ui?.hasOpenConfirmation?.()) {
      this.ui.closeConfirmation();
      return;
    }

    if (this.state === APP_STATES.paused) {
      this.resumeMatch();
      return;
    }

    if ([APP_STATES.rules, APP_STATES.settings, APP_STATES.about].includes(this.state)) {
      this.returnFromOverlay();
      return;
    }

    if (this.state !== APP_STATES.playing) {
      return;
    }

    if (this.ui?.sidePanelSection === 'customize') {
      this.closeCustomizePanel();
      return;
    }

    if (!this.hudCollapsed) {
      this.hudCollapsed = true;
      this.ui.setHudCollapsed(true);
      return;
    }

    if (this.matchStateManager) {
      this.showPause();
    }
  }

  handlePhysicsPocketed(piece) {
    if (piece.type === 'striker') {
      this.audioManager?.play('foul');
    } else if (piece.type === 'queen') {
      this.audioManager?.play('queenPocket');
    } else {
      this.audioManager?.play('pocketCoin');
    }

    if (this.challengeManager?.active) {
      this.challengeManager.handlePiecePocketed(piece);
      this.updatePhysicsHud(`Challenge pocketed: ${piece.color} ${piece.type}`, {
        shotPower: 'Moving',
        shotPowerRatio: 1
      });
      return;
    }

    if (this.tutorialController?.active) {
      this.tutorialController.handlePiecePocketed(piece);
      this.updatePhysicsHud(`Tutorial pocketed: ${piece.color} ${piece.type}`, {
        shotPower: 'Moving',
        shotPowerRatio: 1
      });
      this.ui.updateTutorial?.(this.tutorialController.getHud());
      this.ui.updateCoachHint?.(this.coachHintManager?.getViewModel?.());
      return;
    }

    if (this.practiceController?.active) {
      this.practiceController.handlePiecePocketed(piece);
      this.updatePhysicsHud(`Practice pocketed: ${piece.color} ${piece.type}`, {
        shotPower: 'Moving',
        shotPowerRatio: 1
      });
      return;
    }

    if (this.isOnlineMatchActive()) {
      this.updatePhysicsHud(`Online pocketed: ${piece.color} ${piece.type}`, {
        shotPower: 'Moving',
        shotPowerRatio: 1,
        onlineTurnStatus: 'Shot in motion'
      });
      return;
    }

    if (this.matchStateManager) {
      this.updatePhysicsHud(`Pocketed: ${piece.color} ${piece.type}`, {
        shotPower: 'Moving',
        shotPowerRatio: 1
      });
      return;
    }

    const queenStatus = piece.type === 'queen' ? 'Pocketed' : this.match.queenStatus;
    this.updatePhysicsHud(`Pocketed: ${piece.color} ${piece.type}`, {
      queenStatus,
      shotPower: 'Moving',
      shotPowerRatio: 1
    });
  }

  handlePhysicsSettled(summary) {
    if (this.challengeManager?.active) {
      const hud = this.challengeManager.handleShotSettled(summary);
      this.match = {
        ...this.match,
        ...hud
      };
      this.ui.updateMatch(this.match);
      this.ui.updateChallengePanel?.(this.challengeManager.getPanelModel());
      return;
    }

    if (this.tutorialController?.active) {
      const hud = this.tutorialController.handleShotSettled(summary);
      this.match = {
        ...this.match,
        ...hud
      };
      this.ui.updateMatch(this.match);
      this.ui.updateTutorial?.(hud);
      this.ui.updateCoachHint?.(this.coachHintManager?.getViewModel?.());
      if (this.tutorialController.active && hud?.tutorialStepId !== 'finish') {
        this.sceneRenderer?.prepareForTurn({
          baseline: 'bottom',
          enabled: true,
          silent: true,
          rotateCamera: false
        });
      }
      return;
    }

    if (this.practiceController?.active) {
      const hud = this.practiceController.handleShotSettled(summary);
      this.match = {
        ...this.match,
        ...hud
      };
      this.ui.updateMatch(this.match);
      if (this.practiceController.active) {
        this.sceneRenderer?.prepareForTurn({
          baseline: 'bottom',
          enabled: true,
          silent: true,
          rotateCamera: false
        });
      }
      return;
    }

    if (this.isOnlineMatchActive()) {
      this.handleOnlineLocalPhysicsSettled(summary);
      return;
    }

    if (this.matchStateManager) {
      const result = this.matchStateManager.applyShotSummary(summary);
      result.piecesToReturn.forEach((piece) => {
        this.sceneRenderer?.returnPieceToBoard(piece.id);
      });
      this.playRuleFeedback(result);

      this.match = {
        ...this.match,
        ...result.hud
      };
      this.ui.updateMatch(this.match);

      if (result.state.status === 'finished') {
        this.botController?.cancel();
        this.audioManager?.play('win');
        this.sceneRenderer?.setInputEnabled(false);
        this.sceneRenderer?.setSceneOrbitEnabled(false);
        this.setState(APP_STATES.result);
        return;
      }

      this.prepareActiveTurn({ baseline: result.activeBaseline, silent: true });
      return;
    }

    this.updatePhysicsHud(`Shot settled. Pocketed: ${summary.pocketedCount}`, {
      shotPower: 'Settled',
      shotPowerRatio: 0
    });
  }

  handleInputPower({ ratio, label }) {
    if (this.tutorialController?.active) {
      this.tutorialController.handlePowerChange({ ratio, label });
      const tutorialHud = this.tutorialController.getHud();
      this.match = {
        ...this.match,
        ...tutorialHud
      };
      this.ui.updateTutorial?.(tutorialHud);
      this.ui.updateCoachHint?.(this.coachHintManager?.getViewModel?.());
    }
    this.match = {
      ...this.match,
      shotPower: label,
      shotPowerRatio: ratio
    };
    this.ui?.updateMatch(this.match);
  }

  handleInputPlacementChanged(position) {
    if (!this.tutorialController?.active) {
      return;
    }
    this.tutorialController.handlePlacementChanged(position);
    this.match = {
      ...this.match,
      ...this.tutorialController.getHud()
    };
    this.ui.updateMatch(this.match);
    this.ui.updateTutorial?.(this.tutorialController.getHud());
    this.ui.updateCoachHint?.(this.coachHintManager?.getViewModel?.());
  }

  handleInputAimCreated() {
    if (!this.tutorialController?.active) {
      return;
    }
    this.tutorialController.handleAimCreated();
    this.match = {
      ...this.match,
      ...this.tutorialController.getHud()
    };
    this.ui.updateMatch(this.match);
    this.ui.updateTutorial?.(this.tutorialController.getHud());
    this.ui.updateCoachHint?.(this.coachHintManager?.getViewModel?.());
  }

  handleInputAimUpdated(aim) {
    if (this.tutorialController?.active) {
      this.tutorialController.handlePowerChange(aim);
      const tutorialHud = this.tutorialController.getHud();
      this.match = {
        ...this.match,
        ...tutorialHud
      };
      this.ui.updateMatch(this.match);
      this.ui.updateTutorial?.(tutorialHud);
      this.ui.updateCoachHint?.(this.coachHintManager?.getViewModel?.());
    }
  }

  handleShotReleased(result = {}) {
    if (result?.deferred && this.isOnlineMatchActive()) {
      this.handleOnlineShotIntent(result);
      return;
    }

    const ratio = Number(result?.powerRatio ?? this.match.shotPowerRatio) || 0.5;
    if (this.challengeManager?.active) {
      this.challengeManager.handleShotReleased();
    }
    if (this.practiceController?.active) {
      this.practiceController.handleShotReleased();
    }
    if (this.tutorialController?.active) {
      this.tutorialController.handleShotReleased();
      this.match = {
        ...this.match,
        ...this.tutorialController.getHud()
      };
      this.ui.updateTutorial?.(this.tutorialController.getHud());
      this.ui.updateCoachHint?.(this.coachHintManager?.getViewModel?.());
    }
    this.updatePhysicsHud('Shot in motion.', { shotPower: 'Moving', shotPowerRatio: 1 });
    this.audioManager?.play('shotRelease', { intensity: Math.max(0.35, ratio) });
    this.sceneRenderer?.playShotRelease(ratio);
  }

  handleBotShotFired(plan, botPlayer) {
    const ratio = Number(plan?.powerRatio) || 0.5;
    this.updatePhysicsHud(`${botPlayer?.name || 'Bot'} shot in motion...`, {
      shotPower: 'Moving',
      shotPowerRatio: 1,
      botStatus: 'shooting'
    });
    this.audioManager?.play('shotRelease', { intensity: Math.max(0.35, ratio) });
    this.sceneRenderer?.playShotRelease(ratio);
  }

  handlePhysicsCollision(event) {
    this.audioManager?.playCollision(event.intensity);
  }

  playMatchIntro() {
    window.clearTimeout(this.introTimer);
    const players = this.matchStateManager?.state.players.map((player) => ({
      ...player,
      color: this.matchStateManager?.state.ruleMode === 'freeCapture'
        ? 'Any Coin'
        : player.color ? (player.color === 'white' ? 'White' : 'Black') : 'Open Colors'
    })) || [];
    this.sceneRenderer?.setInputEnabled(false);
    this.sceneRenderer?.playMatchIntro(players, {
      matchMode: this.matchStateManager?.state.matchMode,
      ruleMode: this.matchStateManager?.state.ruleMode,
      ruleModeLabel: this.match.ruleModeLabel,
      classicRuleVariantLabel: this.match.classicRuleVariantLabel,
      botDifficultyLabel: this.match.botDifficultyLabel
    });
    this.audioManager?.play('matchStart');
    const delay = this.settings.reducedEffects ? 450 : 1400;
    this.introTimer = window.setTimeout(() => {
      if (this.state !== APP_STATES.playing || !this.matchStateManager) {
        return;
      }
      this.prepareActiveTurn({ silent: true });
      this.sceneRenderer?.setStateFocus(APP_STATES.playing);
      this.sceneRenderer?.playRuleFeedback({
        ruleResult: { shouldSwitchTurn: true },
        activePlayer: this.matchStateManager.getCurrentPlayer()
      });
      this.audioManager?.play('turnChange');
    }, delay);
  }

  playRuleFeedback(result) {
    this.sceneRenderer?.playRuleFeedback({
      ruleResult: result.ruleResult,
      currentPlayer: result.resolvedPlayer,
      activePlayer: result.activePlayer,
      winner: result.winner
    });

    if (!result.ruleResult) {
      return;
    }
    if (result.ruleResult.isFoul) {
      this.audioManager?.play('foul');
      return;
    }
    if (result.ruleResult.queenCovered) {
      this.audioManager?.play('queenCovered');
    } else if (result.ruleResult.queenReturned) {
      this.audioManager?.play('queenReturned');
    } else if (result.ruleResult.queenPending) {
      this.audioManager?.play('queenPocket');
    } else if (result.ruleResult.shouldSwitchTurn) {
      this.audioManager?.play('turnChange');
    } else {
      this.audioManager?.play('turnChange', { intensity: 0.72 });
    }
  }

  handleChallengeChange(model, hud) {
    this.ui?.updateChallengePanel?.(model);
    if (hud?.challengeActive) {
      this.match = {
        ...this.match,
        ...hud
      };
      this.ui?.updateMatch(this.match);
    }
  }

  handleChallengeResult(result, success) {
    this.audioManager?.play(success ? 'queenCovered' : 'foul', { intensity: success ? 0.8 : 0.65 });
    this.sceneRenderer?.vfxManager?.banner?.show?.({
      eyebrow: 'Challenge',
      title: success ? 'Challenge Complete' : 'Challenge Failed',
      detail: success ? `${result.stars} star${result.stars === 1 ? '' : 's'} earned` : result.message,
      tone: success ? 'success' : 'danger',
      reduced: this.settings.reducedEffects
    });
  }

  handlePracticeChange(hud) {
    if (!hud?.practiceActive) {
      return;
    }
    this.match = {
      ...this.match,
      ...hud
    };
    this.ui?.updateMatch(this.match);
    this.ui?.updateCoachHint?.(this.coachHintManager?.getViewModel?.());
  }

  handleTutorialChange(hud) {
    if (!hud?.tutorialActive) {
      return;
    }
    this.match = {
      ...this.match,
      ...hud
    };
    this.ui?.updateMatch(this.match);
    this.ui?.updateTutorial?.(hud);
    this.ui?.updateCoachHint?.(this.coachHintManager?.getViewModel?.());
  }

  dismissCoachHint() {
    this.ui?.updateCoachHint?.(this.coachHintManager?.dismiss?.());
  }

  playUiClick() {
    this.audioManager?.play('uiClick', { throttle: 0.025 });
  }

  updatePhysicsHud(status, overrides = {}) {
    this.match = {
      ...this.match,
      ...overrides,
      status
    };
    this.ui?.updateMatch(this.match);
  }

  handleResultPrimary() {
    if (this.match?.matchMode === 'onlinePrivate' || this.match?.matchMode === 'onlinePublic') {
      this.requestOnlineRematch();
      this.ui.setSidePanelSection(this.match.matchMode === 'onlinePublic' ? 'onlinePublic' : 'online');
      return;
    }

    this.startLocalShellMatch({ preserveSetup: true });
  }

  backToMenu() {
    this.showLocalSetup();
  }

  selectMatchMode(matchMode) {
    this.updateLocalSetup('matchMode', matchMode === 'vsBot' ? 'vsBot' : 'local2p');
    this.showLocalSetup();
  }

  updateLocalSetup(key, value) {
    if (!Object.prototype.hasOwnProperty.call(this.localSetup, key)) {
      return;
    }

    const nextSetup = {
      ...this.localSetup,
      [key]: value
    };
    if (
      key === 'matchMode'
      && value === 'vsBot'
      && (!nextSetup.playerTwoName || nextSetup.playerTwoName === DEFAULT_LOCAL_SETUP.playerTwoName)
    ) {
      nextSetup.playerTwoName = getDefaultBotName(nextSetup.botDifficulty);
    }
    if (
      key === 'botDifficulty'
      && nextSetup.matchMode === 'vsBot'
      && (!nextSetup.playerTwoName || ['Player 2', 'Easy Bot', 'Royal Bot', 'Master Bot'].includes(nextSetup.playerTwoName))
    ) {
      nextSetup.playerTwoName = getDefaultBotName(value);
    }
    this.localSetup = nextSetup;
    if (key === 'boardStyle') {
      this.sceneRenderer?.setBoardStyle(value);
      const syncedLoadout = this.cosmeticManager?.applyBoardStyle?.(value);
      if (syncedLoadout && this.ui?.sidePanelSection === 'customize') {
        this.ui.updateCosmeticsPanel?.(this.cosmeticPreviewController?.cancelPreview?.());
      }
      const boardStyleLabels = {
        ivory: 'Ivory Royale',
        wood: 'Tournament Wood',
        midnight: 'Midnight Gold'
      };
      this.updatePhysicsHud(`${boardStyleLabels[value] || 'Selected'} board applied.`, {
        bannerTone: 'success'
      });
    }
    this.ui.updateLocalSetup(this.localSetup);
  }

  prepareActiveTurn({ baseline = null, silent = true } = {}) {
    if (!this.matchStateManager || this.state !== APP_STATES.playing) {
      this.sceneRenderer?.setInputEnabled(false);
      return;
    }

    const activeBaseline = baseline || this.matchStateManager.getActiveBaseline();
    const isBot = this.isCurrentTurnBot();
    const rotateCamera = this.shouldRotateCameraForTurn();
    this.sceneRenderer?.setSceneOrbitEnabled(false);
    this.sceneRenderer?.prepareForTurn({
      baseline: activeBaseline,
      enabled: !isBot,
      silent,
      rotateCamera
    });

    if (isBot) {
      this.botController?.scheduleTurn({ reason: 'active-turn' });
    }
  }

  isCurrentTurnBot() {
    return Boolean(this.matchStateManager?.getCurrentPlayer?.()?.isBot);
  }

  shouldRotateCameraForTurn() {
    return this.matchStateManager?.state?.matchMode === 'local2p';
  }

  updateSetting(key, value) {
    if (!Object.prototype.hasOwnProperty.call(this.settings, key)) {
      return;
    }

    this.settings = {
      ...this.settings,
      [key]: value
    };

    if (key === 'themeId') {
      this.applyTheme(value);
    } else {
      this.applySettings();
    }
  }

  applyTheme(themeId, { persist = true } = {}) {
    const theme = getThemeById(themeId);
    this.settings.themeId = theme.id;
    this.ui?.updateTheme(theme);
    this.sceneRenderer?.applyTheme(theme);
    this.ui?.updateSettings(this.settings);

    if (persist) {
      this.saveSettings();
    }
  }

  applySettings({ persist = true } = {}) {
    document.body.classList.toggle('app-reduced-effects', Boolean(this.settings.reducedEffects));
    document.body.dataset.quality = this.settings.quality || 'auto';
    this.sceneRenderer?.applySettings(this.settings);
    this.audioManager?.updateSettings(this.settings);
    this.ui?.updateSettings(this.settings);

    if (persist) {
      this.saveSettings();
    }
  }

  saveSettings() {
    saveSettings(this.settings);
  }

  loadSettings() {
    this.settings = loadSettings();
    this.applyTheme(this.settings.themeId, { persist: false });
    this.applySettings({ persist: false });
  }

  resetSettings() {
    this.settings = resetSettings();
    this.applyTheme(this.settings.themeId, { persist: false });
    this.applySettings();
  }

  dispose() {
    window.clearTimeout(this.introTimer);
    this.stopPublicQueueTimer();
    this.challengeManager?.exitChallenge();
    this.practiceController?.exit();
    this.tutorialController?.exit();
    this.cosmeticPreviewController?.cancelPreview?.();
    this.onlinePublicQueueController?.dispose?.();
    this.onlineRoomController?.dispose?.();
    this.botController?.dispose();
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('keydown', this.handleKeydown);
    this.sceneRenderer?.dispose();
    this.responsive?.dispose();
    this.audioManager?.dispose();
    this.ui?.dispose();
  }
}
