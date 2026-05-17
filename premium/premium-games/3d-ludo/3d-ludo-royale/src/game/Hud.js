import { DEFAULT_OPTIONS, formatDuration, normalizeOptions } from './matchConfig.js';
import { playSound } from './audio.js';
import { PLAYER_IDS, PLAYER_META, PLAYER_SETS, STATUS, TOKENS_PER_PLAYER } from '../ludo/constants.js';

const SIDEBAR_KEY = 'ludo-royale.sidebar-collapsed';

function activeValue(buttons, attribute, fallback) {
  return buttons.find((button) => button.classList.contains('is-active'))?.dataset[attribute] || fallback;
}

export class Hud {
  constructor(root, handlers = {}) {
    this.root = root;
    this.handlers = handlers;
    this.setupOptions = normalizeOptions(DEFAULT_OPTIONS);
    this.setupPanel = root.querySelector('#setup-panel');
    this.sidebarContent = root.querySelector('#sidebar-content');
    this.quickPlayButton = root.querySelector('#quick-play-button');
    this.matchTypeButtons = [...root.querySelectorAll('[data-match-type]')];
    this.playerButtons = [...root.querySelectorAll('[data-player-count]')];
    this.humanColorButtons = [...root.querySelectorAll('[data-human-color]')];
    this.difficultyButtons = [...root.querySelectorAll('[data-bot-difficulty]')];
    this.tokenSpeedButtons = [...root.querySelectorAll('[data-token-speed]')];
    this.botSpeedButtons = [...root.querySelectorAll('[data-bot-speed]')];
    this.assignmentCards = [...root.querySelectorAll('[data-player-assignment]')];
    this.controllerButtons = [...root.querySelectorAll('[data-controller-player]')];
    this.botDifficultySelects = [...root.querySelectorAll('[data-bot-difficulty-select]')];
    this.botPersonalitySelects = [...root.querySelectorAll('[data-bot-personality-select]')];
    this.botSetupSections = [...root.querySelectorAll('[data-bot-setup]')];
    this.setupCinematicToggle = root.querySelector('#setup-cinematic-toggle');
    this.setupAutoFocusToggle = root.querySelector('#setup-auto-focus-toggle');
    this.setupSoundToggle = root.querySelector('#setup-sound-toggle');
    this.setupVolumeSlider = root.querySelector('#setup-volume-slider');
    this.setupReducedMotionToggle = root.querySelector('#setup-reduced-motion-toggle');
    this.setupGraphicsQuality = root.querySelector('#setup-graphics-quality');
    this.startButton = root.querySelector('#start-game-button');
    this.hud = root.querySelector('#hud');
    this.currentPlayerDot = root.querySelector('#current-player-dot');
    this.currentPlayerLabel = root.querySelector('#current-player-label');
    this.diceValue = root.querySelector('#dice-value');
    this.rollButton = root.querySelector('#roll-dice-button');
    this.header = root.querySelector('#game-header');
    this.headerCurrentPlayerDot = root.querySelector('#header-current-player-dot');
    this.headerCurrentPlayerLabel = root.querySelector('#header-current-player-label');
    this.headerDiceValue = root.querySelector('#header-dice-value');
    this.headerMoveCount = root.querySelector('#header-move-count');
    this.headerStatusMessage = root.querySelector('#header-status-message');
    this.headerRoomCode = root.querySelector('#header-room-code');
    this.headerTimerSlots = root.querySelector('#header-timer-slots');
    this.headerRollButton = root.querySelector('#header-roll-dice-button');
    this.statusMessage = root.querySelector('#status-message');
    this.progressList = root.querySelector('#progress-list');
    this.eventLog = root.querySelector('#event-log');
    this.restartButton = root.querySelector('#restart-game-button');
    this.cinematicToggle = root.querySelector('#cinematic-camera-toggle');
    this.autoFocusToggle = root.querySelector('#auto-focus-toggle');
    this.muteToggle = root.querySelector('#mute-toggle');
    this.volumeSlider = root.querySelector('#volume-slider');
    this.winnerModal = root.querySelector('#winner-modal');
    this.winnerTitle = root.querySelector('#winner-title');
    this.winnerCopy = root.querySelector('#winner-copy');
    this.winnerSummary = root.querySelector('#winner-summary');
    this.winnerRestartButton = root.querySelector('#winner-restart-button');
    this.winnerRematchButton = root.querySelector('#winner-rematch-button');
    this.winnerSettingsButton = root.querySelector('#winner-settings-button');
    this.confirmModal = root.querySelector('#confirm-modal');
    this.confirmTitle = root.querySelector('#confirm-title');
    this.confirmCopy = root.querySelector('#confirm-copy');
    this.confirmCancelButton = root.querySelector('#confirm-cancel-button');
    this.confirmAcceptButton = root.querySelector('#confirm-accept-button');
    this.onlineEntry = root.querySelector('#online-entry');
    this.onlinePlayerName = root.querySelector('#online-player-name');
    this.onlineRoomCode = root.querySelector('#online-room-code');
    this.onlineCreateButton = root.querySelector('#online-create-button');
    this.onlineJoinButton = root.querySelector('#online-join-button');
    this.onlineStatus = root.querySelector('#online-status');
    this.onlineLobby = root.querySelector('#online-lobby');
    this.onlineLobbyCard = root.querySelector('.online-lobby-card');
    this.onlineLobbyCode = root.querySelector('#online-lobby-code');
    this.onlineCopyCodeButton = root.querySelector('#online-copy-code');
    this.onlineLobbyStatus = root.querySelector('#online-lobby-status');
    this.onlineLobbyPlayerCount = root.querySelector('#online-lobby-player-count');
    this.onlinePlayerList = root.querySelector('#online-player-list');
    this.onlineReadyButton = root.querySelector('#online-ready-button');
    this.onlineStartButton = root.querySelector('#online-start-button');
    this.onlineLeaveButton = root.querySelector('#online-leave-button');
    this.publicEntry = root.querySelector('#public-matchmaking-entry');
    this.publicPlayerName = root.querySelector('#public-player-name');
    this.publicPlayerCount = root.querySelector('#public-player-count');
    this.publicPreferredColor = root.querySelector('#public-preferred-color');
    this.publicBotFill = root.querySelector('#public-bot-fill');
    this.publicBotDifficulty = root.querySelector('#public-bot-difficulty');
    this.publicBotPersonality = root.querySelector('#public-bot-personality');
    this.publicMatchSpeed = root.querySelector('#public-match-speed');
    this.publicFindButton = root.querySelector('#public-find-button');
    this.publicCancelButton = root.querySelector('#public-cancel-button');
    this.publicSearchPanel = root.querySelector('#public-search-panel');
    this.publicSearchTitle = root.querySelector('#public-search-title');
    this.publicSearchTimer = root.querySelector('#public-search-timer');
    this.publicStatus = root.querySelector('#public-matchmaking-status');
    this.onlineBusy = false;
    this.loadingOverlay = root.querySelector('#loading-overlay');
    this.menuOpenButton = root.querySelector('#menu-open-button');
    this.menuOverlay = root.querySelector('#menu-overlay');
    this.menuCloseButton = root.querySelector('#menu-close-button');
    this.menuResumeButton = root.querySelector('#menu-resume-button');
    this.menuHelpButton = root.querySelector('#menu-help-button');
    this.menuExitButton = root.querySelector('#menu-exit-button');
    this.menuConnectionStatus = root.querySelector('#menu-connection-status');
    this.howToPlayPanel = root.querySelector('#how-to-play-panel');
    this.confirmResolve = null;
    this.sidebarToggleButton = root.querySelector('#sidebar-toggle-button');
    this.sidebarCollapsed = this.readSidebarPreference();
    this.mountSetupInSidebar();
    this.bindEvents();
    this.renderSetupOptions(this.setupOptions);
    this.setSidebarCollapsed(this.sidebarCollapsed, { persist: false });
  }

  mountSetupInSidebar() {
    if (this.setupPanel && this.sidebarContent && this.setupPanel.parentElement !== this.sidebarContent) {
      this.sidebarContent.prepend(this.setupPanel);
    }
  }

  bindEvents() {
    this.bindChoiceGroup(this.matchTypeButtons, 'matchType', (value) => {
      this.setupOptions.matchType = value;
      this.syncSetupVisibility();
      this.syncAssignmentControls();
    });
    this.bindChoiceGroup(this.playerButtons, 'playerCount', (value) => {
      this.setupOptions.playerCount = Number(value);
      this.syncHumanColorAvailability();
      this.syncAssignmentControls();
    });
    this.bindChoiceGroup(this.humanColorButtons, 'humanColor', (value) => {
      this.setupOptions.humanPlayerId = value;
      this.syncAssignmentControls();
    });
    this.bindChoiceGroup(this.difficultyButtons, 'botDifficulty', (value) => {
      this.setupOptions.botDifficulty = value;
      this.applyDefaultBotDifficulty(value);
      this.syncAssignmentControls();
    });
    this.bindChoiceGroup(this.tokenSpeedButtons, 'tokenSpeed', (value) => {
      this.setupOptions.tokenSpeed = value;
    });
    this.bindChoiceGroup(this.botSpeedButtons, 'botSpeed', (value) => {
      this.setupOptions.botSpeed = value;
    });

    this.quickPlayButton.addEventListener('click', () => this.handlers.onQuickPlay?.());
    this.startButton.addEventListener('click', () => this.handlers.onStart?.(this.getSetupConfig()));
    this.rollButton.addEventListener('click', () => this.handlers.onRoll?.());
    this.headerRollButton.addEventListener('click', () => this.handlers.onRoll?.());
    this.restartButton.addEventListener('click', () => this.handlers.onLeaveMatch?.());
    this.winnerRestartButton.addEventListener('click', () => this.handlers.onRestart?.());
    this.winnerRematchButton.addEventListener('click', () => this.handlers.onRematch?.());
    this.winnerSettingsButton.addEventListener('click', () => this.handlers.onChangeSettings?.());
    this.onlineCreateButton.addEventListener('click', () => this.handlers.onCreateOnlineRoom?.(this.getOnlineEntryConfig()));
    this.onlineJoinButton.addEventListener('click', () => this.handlers.onJoinOnlineRoom?.(this.getOnlineEntryConfig()));
    this.publicFindButton.addEventListener('click', () => this.handlers.onFindPublicMatch?.(this.getPublicMatchmakingConfig()));
    this.publicCancelButton.addEventListener('click', () => this.handlers.onCancelPublicMatch?.());
    this.onlineReadyButton.addEventListener('click', () => this.handlers.onOnlineReady?.());
    this.onlineStartButton.addEventListener('click', () => this.handlers.onOnlineStart?.());
    this.onlineLeaveButton.addEventListener('click', () => this.handlers.onOnlineLeave?.());
    this.onlineCopyCodeButton.addEventListener('click', () => this.copyOnlineRoomCode());
    this.menuOpenButton.addEventListener('click', () => this.openMenu());
    this.menuCloseButton.addEventListener('click', () => this.closeMenu());
    this.menuResumeButton.addEventListener('click', () => {
      this.closeMenu();
      this.handlers.onResumeMatch?.();
    });
    this.menuHelpButton.addEventListener('click', () => {
      this.howToPlayPanel.classList.toggle('is-hidden');
      playSound('ui-open');
    });
    this.menuExitButton.addEventListener('click', () => {
      this.closeMenu();
      this.handlers.onLeaveMatch?.();
    });
    this.confirmCancelButton.addEventListener('click', () => this.resolveConfirmation(false));
    this.confirmAcceptButton.addEventListener('click', () => this.resolveConfirmation(true));
    this.root.addEventListener('click', (event) => {
      const control = event.target.closest('button');
      if (!control || control.disabled) {
        return;
      }
      playSound('ui-click');
    }, true);
    this.sidebarToggleButton.addEventListener('click', () => {
      this.setSidebarCollapsed(!this.sidebarCollapsed);
    });
    this.onlineLobbyPlayerCount.addEventListener('change', () => {
      playSound('ui-confirm');
      this.handlers.onOnlineConfig?.({ playerCount: Number(this.onlineLobbyPlayerCount.value) });
    });

    [
      this.cinematicToggle,
      this.autoFocusToggle,
      this.muteToggle,
      this.setupCinematicToggle,
      this.setupAutoFocusToggle,
      this.setupSoundToggle,
      this.setupReducedMotionToggle
    ].forEach((input) => input.addEventListener('change', () => this.emitOptionsChange(input)));

    [this.volumeSlider, this.setupVolumeSlider].forEach((input) => {
      input.addEventListener('input', () => this.emitOptionsChange(input));
    });

    this.setupGraphicsQuality.addEventListener('change', () => this.emitOptionsChange(this.setupGraphicsQuality));

    this.controllerButtons.forEach((button) => {
      button.addEventListener('click', () => {
        if (button.disabled) {
          return;
        }
        const playerId = button.dataset.controllerPlayer;
        this.setupOptions.controllers[playerId] = button.dataset.controllerValue;
        this.syncAssignmentControls();
      });
    });

    this.botDifficultySelects.forEach((select) => {
      select.addEventListener('change', () => {
        playSound('ui-confirm');
        const playerId = select.dataset.botDifficultySelect;
        this.setupOptions.botProfiles[playerId].difficulty = select.value;
        this.syncAssignmentControls();
      });
    });

    this.botPersonalitySelects.forEach((select) => {
      select.addEventListener('change', () => {
        playSound('ui-confirm');
        const playerId = select.dataset.botPersonalitySelect;
        this.setupOptions.botProfiles[playerId].personality = select.value;
        this.syncAssignmentControls();
      });
    });
  }

  readSidebarPreference() {
    try {
      return localStorage.getItem(SIDEBAR_KEY) === 'true';
    } catch {
      return false;
    }
  }

  setSidebarCollapsed(collapsed, { persist = true } = {}) {
    this.sidebarCollapsed = Boolean(collapsed);
    this.root.classList.toggle('is-sidebar-collapsed', this.sidebarCollapsed);
    this.sidebarToggleButton.setAttribute('aria-expanded', String(!this.sidebarCollapsed));
    this.sidebarToggleButton.setAttribute('aria-label', this.sidebarCollapsed ? 'Show details panel' : 'Hide details panel');
    this.sidebarToggleButton.querySelector('span').textContent = this.sidebarCollapsed ? 'Show' : 'Hide';
    if (persist) {
      try {
        localStorage.setItem(SIDEBAR_KEY, String(this.sidebarCollapsed));
      } catch {
        // Sidebar preference is optional.
      }
    }
  }

  bindChoiceGroup(buttons, key, onChange) {
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        if (button.disabled) {
          return;
        }
        buttons.forEach((candidate) => {
          candidate.classList.toggle('is-active', candidate === button);
        });
        onChange(button.dataset[key]);
      });
    });
  }

  getSetupConfig() {
    return {
      matchType: activeValue(this.matchTypeButtons, 'matchType', this.setupOptions.matchType),
      playerCount: Number(activeValue(this.playerButtons, 'playerCount', this.setupOptions.playerCount)),
      humanPlayerId: activeValue(this.humanColorButtons, 'humanColor', this.setupOptions.humanPlayerId),
      botDifficulty: activeValue(this.difficultyButtons, 'botDifficulty', this.setupOptions.botDifficulty),
      controllers: this.getControllersFromInputs(),
      botProfiles: this.getBotProfilesFromInputs(),
      tokenSpeed: activeValue(this.tokenSpeedButtons, 'tokenSpeed', this.setupOptions.tokenSpeed),
      botSpeed: activeValue(this.botSpeedButtons, 'botSpeed', this.setupOptions.botSpeed),
      cinematicCamera: this.setupCinematicToggle.checked,
      autoFocusCurrentPlayer: this.setupAutoFocusToggle.checked,
      muted: !this.setupSoundToggle.checked,
      volume: Number(this.setupVolumeSlider.value) / 100,
      reducedMotion: this.setupReducedMotionToggle.checked,
      graphicsQuality: this.setupGraphicsQuality.value
    };
  }

  getOnlineEntryConfig() {
    return {
      displayName: this.onlinePlayerName.value,
      roomCode: this.onlineRoomCode.value,
      playerCount: Number(activeValue(this.playerButtons, 'playerCount', this.setupOptions.playerCount)),
      preferredColor: this.setupOptions.humanPlayerId
    };
  }

  getPublicMatchmakingConfig() {
    return {
      displayName: this.publicPlayerName.value,
      playerCount: Number(this.publicPlayerCount.value || 2),
      preferredColor: this.publicPreferredColor.value || this.setupOptions.humanPlayerId,
      botFillMode: this.publicBotFill.value || 'after-wait',
      botDifficulty: this.publicBotDifficulty.value || 'medium',
      botPersonality: this.publicBotPersonality.value || 'balanced',
      matchSpeed: this.publicMatchSpeed.value || 'normal'
    };
  }

  emitOptionsChange(sourceInput) {
    if (sourceInput.type !== 'range') {
      playSound('ui-confirm');
    }
    const fromSetup = sourceInput === this.setupCinematicToggle
      || sourceInput === this.setupAutoFocusToggle
      || sourceInput === this.setupSoundToggle
      || sourceInput === this.setupVolumeSlider
      || sourceInput === this.setupReducedMotionToggle
      || sourceInput === this.setupGraphicsQuality;
    const options = fromSetup
      ? {
          cinematicCamera: this.setupCinematicToggle.checked,
          autoFocusCurrentPlayer: this.setupAutoFocusToggle.checked,
          muted: !this.setupSoundToggle.checked,
          volume: Number(this.setupVolumeSlider.value) / 100,
          reducedMotion: this.setupReducedMotionToggle.checked,
          graphicsQuality: this.setupGraphicsQuality.value
        }
      : {
          cinematicCamera: this.cinematicToggle.checked,
          autoFocusCurrentPlayer: this.autoFocusToggle.checked,
          muted: this.muteToggle.checked,
          volume: Number(this.volumeSlider.value) / 100
        };

    this.renderCameraOptions(options);
    this.handlers.onOptionsChange?.(options);
  }

  showSetup() {
    this.setupPanel.classList.remove('is-hidden');
  }

  hideSetup() {
    this.setupPanel.classList.add('is-hidden');
  }

  setOnlineBusy(value) {
    this.onlineBusy = Boolean(value);
    [
      this.onlineCreateButton,
      this.onlineJoinButton,
      this.publicFindButton,
      this.publicCancelButton,
      this.onlineReadyButton,
      this.onlineStartButton,
      this.onlineLeaveButton,
      this.onlineLobbyPlayerCount
    ].forEach((control) => {
      if (control) {
        control.disabled = this.onlineBusy || control.dataset.forceDisabled === 'true';
      }
    });
  }

  setLoading(visible, message = 'Preparing the royal table...') {
    if (!this.loadingOverlay) {
      return;
    }
    this.loadingOverlay.classList.toggle('is-hidden', !visible);
    const copy = this.loadingOverlay.querySelector('p');
    if (copy) {
      copy.textContent = message;
    }
  }

  openMenu() {
    this.menuOverlay.classList.remove('is-hidden');
    this.menuConnectionStatus.textContent = this.onlineStatus?.textContent || 'Local play ready.';
    this.menuConnectionStatus.dataset.tone = this.onlineStatus?.dataset.tone || 'neutral';
    playSound('ui-open');
    requestAnimationFrame(() => this.menuResumeButton.focus({ preventScroll: true }));
  }

  closeMenu() {
    this.menuOverlay.classList.add('is-hidden');
    this.howToPlayPanel.classList.add('is-hidden');
  }

  setOnlineStatus(message, tone = 'neutral') {
    this.onlineStatus.textContent = message;
    this.onlineStatus.dataset.tone = tone;
    this.onlineLobbyStatus.textContent = message;
    this.onlineLobbyStatus.dataset.tone = tone;
    if (this.publicStatus) {
      this.publicStatus.textContent = message;
      this.publicStatus.dataset.tone = tone;
    }
  }

  showOnlineLobby(room, localSessionId) {
    this.hideSetup();
    this.onlineLobby.classList.remove('is-hidden');
    this.renderOnlineLobby(room, localSessionId);
  }

  hideOnlineLobby() {
    this.onlineLobby.classList.add('is-hidden');
  }

  setStatus(message, tone = 'neutral') {
    this.statusMessage.textContent = message;
    this.statusMessage.dataset.tone = tone;
    this.headerStatusMessage.textContent = message;
    this.headerStatusMessage.dataset.tone = tone;
    this.statusMessage.classList.remove('is-flashing');
    this.headerStatusMessage.classList.remove('is-flashing');
    requestAnimationFrame(() => this.statusMessage.classList.add('is-flashing'));
    requestAnimationFrame(() => this.headerStatusMessage.classList.add('is-flashing'));
  }

  renderSetupOptions(options = {}) {
    this.setupOptions = normalizeOptions({ ...this.setupOptions, ...options });
    this.activateButton(this.matchTypeButtons, 'matchType', this.setupOptions.matchType);
    this.activateButton(this.playerButtons, 'playerCount', String(this.setupOptions.playerCount));
    this.activateButton(this.humanColorButtons, 'humanColor', this.setupOptions.humanPlayerId);
    this.activateButton(this.difficultyButtons, 'botDifficulty', this.setupOptions.botDifficulty);
    this.activateButton(this.tokenSpeedButtons, 'tokenSpeed', this.setupOptions.tokenSpeed);
    this.activateButton(this.botSpeedButtons, 'botSpeed', this.setupOptions.botSpeed);
    this.syncProfileInputs();
    this.renderCameraOptions(this.setupOptions);
    this.syncSetupVisibility();
    this.syncHumanColorAvailability();
    this.syncAssignmentControls();
  }

  activateButton(buttons, attribute, value) {
    buttons.forEach((button) => {
      button.classList.toggle('is-active', String(button.dataset[attribute]) === String(value));
    });
  }

  syncSetupVisibility() {
    this.setupPanel.dataset.matchType = this.setupOptions.matchType;
    this.botSetupSections.forEach((section) => {
      section.classList.toggle('is-dimmed', this.setupOptions.matchType !== 'bots');
    });
    this.startButton.textContent = (this.setupOptions.matchType === 'online' || this.setupOptions.matchType === 'public')
      ? 'Use Online Mode'
      : 'Start Game';
  }

  syncHumanColorAvailability() {
    const activePlayers = PLAYER_SETS[this.setupOptions.playerCount] || PLAYER_SETS[2];
    if (!activePlayers.includes(this.setupOptions.humanPlayerId)) {
      this.setupOptions.humanPlayerId = activePlayers[0];
      this.activateButton(this.humanColorButtons, 'humanColor', this.setupOptions.humanPlayerId);
    }
    this.humanColorButtons.forEach((button) => {
      const enabled = activePlayers.includes(button.dataset.humanColor);
      button.disabled = !enabled;
      button.classList.toggle('is-unavailable', !enabled);
    });
  }

  renderCameraOptions(options) {
    const cinematic = options.cinematicCamera !== false;
    const autoFocus = options.autoFocusCurrentPlayer !== false;
    const muted = options.muted === true;
    const volume = Math.round((options.volume ?? this.setupOptions.volume ?? 0.72) * 100);
    this.cinematicToggle.checked = cinematic;
    this.autoFocusToggle.checked = autoFocus;
    this.muteToggle.checked = muted;
    this.setupCinematicToggle.checked = cinematic;
    this.setupAutoFocusToggle.checked = autoFocus;
    this.setupSoundToggle.checked = !muted;
    this.volumeSlider.value = String(volume);
    this.setupVolumeSlider.value = String(volume);
    this.setupReducedMotionToggle.checked = options.reducedMotion === true;
    this.setupGraphicsQuality.value = options.graphicsQuality || 'auto';
  }

  getControllersFromInputs() {
    const controllers = { ...this.setupOptions.controllers };
    PLAYER_IDS.forEach((playerId) => {
      const active = this.controllerButtons.find((button) => (
        button.dataset.controllerPlayer === playerId
        && button.classList.contains('is-active')
      ));
      if (active) {
        controllers[playerId] = active.dataset.controllerValue;
      }
    });
    return controllers;
  }

  getBotProfilesFromInputs() {
    const profiles = { ...this.setupOptions.botProfiles };
    PLAYER_IDS.forEach((playerId) => {
      const difficulty = this.botDifficultySelects.find((select) => select.dataset.botDifficultySelect === playerId)?.value;
      const personality = this.botPersonalitySelects.find((select) => select.dataset.botPersonalitySelect === playerId)?.value;
      profiles[playerId] = {
        ...profiles[playerId],
        difficulty: difficulty || profiles[playerId]?.difficulty || 'medium',
        personality: personality || profiles[playerId]?.personality || 'balanced'
      };
    });
    return profiles;
  }

  applyDefaultBotDifficulty(difficulty) {
    this.botDifficultySelects.forEach((select) => {
      const playerId = select.dataset.botDifficultySelect;
      const controller = this.getVisibleController(playerId);
      if (controller === 'bot') {
        select.value = difficulty;
        this.setupOptions.botProfiles[playerId].difficulty = difficulty;
      }
    });
  }

  syncProfileInputs() {
    this.botDifficultySelects.forEach((select) => {
      const playerId = select.dataset.botDifficultySelect;
      select.value = this.setupOptions.botProfiles[playerId]?.difficulty || 'medium';
    });
    this.botPersonalitySelects.forEach((select) => {
      const playerId = select.dataset.botPersonalitySelect;
      select.value = this.setupOptions.botProfiles[playerId]?.personality || 'balanced';
    });
  }

  getVisibleController(playerId) {
    const activePlayers = PLAYER_SETS[this.setupOptions.playerCount] || PLAYER_SETS[2];
    if (!activePlayers.includes(playerId)) {
      return 'inactive';
    }
    if (this.setupOptions.matchType === 'local' || this.setupOptions.matchType === 'online' || this.setupOptions.matchType === 'public') {
      return 'human';
    }
    if (this.setupOptions.matchType === 'bots') {
      return playerId === this.setupOptions.humanPlayerId ? 'human' : 'bot';
    }
    return this.setupOptions.controllers[playerId] || (playerId === activePlayers[0] ? 'human' : 'bot');
  }

  syncAssignmentControls() {
    const activePlayers = PLAYER_SETS[this.setupOptions.playerCount] || PLAYER_SETS[2];
    this.assignmentCards.forEach((card) => {
      const playerId = card.dataset.playerAssignment;
      const active = activePlayers.includes(playerId);
      const controller = this.getVisibleController(playerId);
      const lockedMode = this.setupOptions.matchType !== 'mixed';
      card.classList.toggle('is-inactive', !active);
      card.classList.toggle('is-bot', controller === 'bot');
      card.classList.toggle('is-human', controller === 'human');

      this.controllerButtons
        .filter((button) => button.dataset.controllerPlayer === playerId)
        .forEach((button) => {
          button.disabled = !active || lockedMode;
          button.classList.toggle('is-active', button.dataset.controllerValue === controller);
        });

      const profileDisabled = !active || controller !== 'bot';
      this.botDifficultySelects
        .filter((select) => select.dataset.botDifficultySelect === playerId)
        .forEach((select) => {
          select.disabled = profileDisabled;
        });
      this.botPersonalitySelects
        .filter((select) => select.dataset.botPersonalitySelect === playerId)
        .forEach((select) => {
          select.disabled = profileDisabled;
        });
    });
  }

  render(state, { busy = false, matchConfig = null, eventLog = [], onlinePlayerId = null, onlineMode = false, onlinePending = false, onlineRoomCode = '', playerNames = {}, playerTimers = {} } = {}) {
    if (!state) {
      this.currentPlayerLabel.textContent = 'Red';
      this.diceValue.textContent = '-';
      this.headerCurrentPlayerLabel.textContent = 'Red';
      this.headerCurrentPlayerDot.className = 'player-dot player-red';
      this.headerDiceValue.textContent = '-';
      this.headerMoveCount.textContent = '0';
      this.headerRoomCode.textContent = '';
      this.rollButton.disabled = true;
      this.headerRollButton.disabled = true;
      this.restartButton.textContent = 'Exit Match';
      this.restartButton.setAttribute('aria-label', 'Exit local match');
      this.renderTimers(null, { playerNames, playerTimers });
      this.renderProgress(null);
      this.renderEventLog(eventLog);
      return;
    }

    const player = PLAYER_META[state.currentPlayer];
    const controller = matchConfig?.controllers?.[state.currentPlayer] || 'human';
    const displayDiceValue = state.diceValue ?? '-';
    this.currentPlayerLabel.textContent = controller === 'bot' ? `${player.label} Bot` : player.label;
    this.currentPlayerDot.className = `player-dot player-${player.id}`;
    this.diceValue.textContent = displayDiceValue;
    this.headerCurrentPlayerLabel.textContent = onlineMode
      ? `${player.label} Online`
      : controller === 'bot'
        ? `${player.label} Bot`
        : player.label;
    this.headerCurrentPlayerDot.className = `player-dot player-${player.id}`;
    this.headerDiceValue.textContent = displayDiceValue;
    this.headerMoveCount.textContent = String(state.turnHistory?.filter((entry) => entry.type === 'move').length || 0);
    this.headerRoomCode.textContent = onlineMode && onlineRoomCode ? onlineRoomCode : '';
    const onlineWaiting = onlineMode && state.currentPlayer !== onlinePlayerId;
    const rollDisabled = busy || onlinePending || onlineWaiting || controller === 'bot' || state.phase !== STATUS.AWAITING_ROLL || Boolean(state.winner);
    this.rollButton.disabled = rollDisabled;
    this.headerRollButton.disabled = rollDisabled;
    this.rollButton.classList.toggle('is-loading', busy && state.phase === STATUS.AWAITING_ROLL);
    this.headerRollButton.classList.toggle('is-loading', busy && state.phase === STATUS.AWAITING_ROLL);
    this.restartButton.textContent = onlineMode ? 'Leave Room' : 'Exit Match';
    this.restartButton.setAttribute('aria-label', onlineMode ? 'Leave online room' : 'Exit local match');
    this.hud.dataset.activePlayer = player.id;
    this.header.dataset.activePlayer = player.id;
    this.hud.dataset.controller = controller;
    this.restartButton.disabled = false;
    this.renderTimers(state, { playerNames, playerTimers });
    const tone = state.lastEvent?.type === 'invalid'
      ? 'danger'
      : state.lastEvent?.type === 'winner' || state.lastEvent?.reachedHome
        ? 'success'
        : state.lastEvent?.captures?.length
          ? 'capture'
          : 'neutral';
    this.setStatus(state.lastEvent?.message || `${player.label} player's turn.`, tone);
    this.renderProgress(state, matchConfig, { onlineMode });
    this.renderEventLog(eventLog);
  }

  renderTimers(state, { playerNames = {}, playerTimers = {} } = {}) {
    if (!this.headerTimerSlots) {
      return;
    }
    if (!state?.activePlayers?.length) {
      this.headerTimerSlots.innerHTML = '';
      return;
    }
    const hasTimers = state.activePlayers.some((playerId) => playerTimers[playerId]?.label);
    if (!hasTimers) {
      this.headerTimerSlots.innerHTML = '';
      return;
    }
    this.headerTimerSlots.innerHTML = state.activePlayers.map((playerId) => {
      const meta = PLAYER_META[playerId];
      const timer = playerTimers[playerId] || {};
      const label = timer.label || '1:00';
      const name = playerNames[playerId] || meta.label;
      return `
        <div class="header-timer-slot ${state.currentPlayer === playerId ? 'is-active' : ''} ${timer.urgent ? 'is-danger' : ''}">
          <strong>${name}</strong>
          <span>${label}</span>
        </div>
      `;
    }).join('');
  }

  animateDiceValue(value) {
    this.diceValue.textContent = value ?? '-';
    this.headerDiceValue.textContent = value ?? '-';
    this.diceValue.classList.remove('dice-pop');
    this.headerDiceValue.classList.remove('dice-pop');
    requestAnimationFrame(() => this.diceValue.classList.add('dice-pop'));
    requestAnimationFrame(() => this.headerDiceValue.classList.add('dice-pop'));
  }

  renderProgress(state, matchConfig = null, { onlineMode = false } = {}) {
    if (!state) {
      this.progressList.innerHTML = '';
      return;
    }

    this.progressList.innerHTML = state.activePlayers.map((playerId) => {
      const player = PLAYER_META[playerId];
      const controller = matchConfig?.controllers?.[playerId] || 'human';
      const profile = matchConfig?.botProfiles?.[playerId] || {};
      const difficulty = controller === 'bot' ? profile.difficulty || 'medium' : '';
      const personality = controller === 'bot' ? profile.personality || 'balanced' : '';
      const counts = state.tokens[playerId].reduce((total, token) => {
        total[token.state] = (total[token.state] || 0) + 1;
        return total;
      }, { base: 0, track: 0, 'home-lane': 0, finished: 0 });
      const finished = state.finishedCounts[playerId] || counts.finished || 0;
      const percent = (finished / TOKENS_PER_PLAYER) * 100;
      const controllerLabel = onlineMode
        ? controller === 'bot' ? 'Server Bot' : 'Online'
        : controller === 'bot' ? 'Bot' : 'Human';
      return `
        <div class="progress-row ${state.currentPlayer === playerId ? 'is-active' : ''}">
          <span class="player-dot player-${playerId}"></span>
          <div class="progress-copy">
            <strong>${player.label}</strong>
            <span>${finished}/${TOKENS_PER_PLAYER} home</span>
          </div>
          <div class="controller-line">
            <span class="controller-badge">${controllerLabel}</span>
            ${controller === 'bot' ? `<span class="difficulty-badge">${difficulty}</span>` : ''}
            ${controller === 'bot' ? `<span class="difficulty-badge">${personality}</span>` : ''}
          </div>
          <div class="token-state-list" aria-label="${player.label} token states">
            <span>B ${counts.base || 0}</span>
            <span>T ${counts.track || 0}</span>
            <span>H ${counts['home-lane'] || 0}</span>
            <span>F ${counts.finished || 0}</span>
          </div>
          <div class="progress-track" aria-hidden="true">
            <span style="width: ${percent}%"></span>
          </div>
        </div>
      `;
    }).join('');
  }

  renderEventLog(eventLog = []) {
    this.eventLog.innerHTML = eventLog.slice(0, 12).map((entry) => `
      <li data-tone="${entry.tone || 'neutral'}">
        <span>${entry.time || '--:--'}</span>
        <strong>${entry.message}</strong>
      </li>
    `).join('');
  }

  showWinner(playerId, summary = {}) {
    const player = PLAYER_META[playerId];
    this.winnerTitle.textContent = `${player.label} wins`;
    this.winnerCopy.textContent = summary.controllerLabel
      ? `${summary.controllerLabel} finished all four tokens.`
      : 'All four tokens reached home.';
    const capturesByPlayer = summary.capturesByPlayer || {};
    const finishedByPlayer = summary.finishedByPlayer || {};
    const playerSummaries = summary.playerSummaries || [];
    this.winnerSummary.innerHTML = `
      <span><strong>${summary.turns ?? 0}</strong> turns</span>
      <span><strong>${summary.duration || '0:00'}</strong> duration</span>
      <span><strong>${summary.highestCaptureLabel || 'None'}</strong> top captures</span>
      <span><strong>${capturesByPlayer.red ?? 0}</strong> Red captures</span>
      <span><strong>${capturesByPlayer.blue ?? 0}</strong> Blue captures</span>
      <span><strong>${capturesByPlayer.green ?? 0}</strong> Green captures</span>
      <span><strong>${capturesByPlayer.yellow ?? 0}</strong> Yellow captures</span>
      <span><strong>${finishedByPlayer[playerId] ?? 4}</strong> winner home</span>
      <span><strong>${summary.matchTypeLabel || 'Local'}</strong> mode</span>
      ${playerSummaries.map((item) => `<span><strong>${item.label}</strong> ${item.detail}</span>`).join('')}
    `;
    const publicMatch = summary.matchTypeLabel === 'Public Matchmaking';
    const onlineMatch = publicMatch || summary.matchTypeLabel === 'Online Private Room';
    this.winnerRestartButton.textContent = publicMatch ? 'Find Another Match' : 'Play Again';
    this.winnerRematchButton.classList.toggle('is-hidden', !onlineMatch);
    this.winnerRematchButton.textContent = summary.rematchStatus === 'voting' ? 'Rematch Vote Sent' : 'Rematch Same Players';
    this.winnerSettingsButton.textContent = publicMatch ? 'Back to Menu' : 'Change Settings';
    this.winnerModal.classList.remove('is-hidden');
  }

  hideWinner() {
    this.winnerModal.classList.add('is-hidden');
  }

  confirmAction({
    title = 'Are you sure?',
    message = 'Please confirm this action.',
    confirmText = 'Confirm',
    cancelText = 'Stay'
  } = {}) {
    if (!this.confirmModal || !this.confirmAcceptButton || !this.confirmCancelButton) {
      return Promise.resolve(window.confirm(message));
    }

    if (this.confirmResolve) {
      this.confirmResolve(false);
      this.confirmResolve = null;
    }

    this.confirmTitle.textContent = title;
    this.confirmCopy.textContent = message;
    this.confirmAcceptButton.textContent = confirmText;
    this.confirmCancelButton.textContent = cancelText;
    this.confirmModal.classList.remove('is-hidden');
    playSound('ui-open');
    requestAnimationFrame(() => this.confirmCancelButton.focus({ preventScroll: true }));

    return new Promise((resolve) => {
      this.confirmResolve = resolve;
    });
  }

  resolveConfirmation(confirmed) {
    if (!this.confirmResolve) {
      this.confirmModal?.classList.add('is-hidden');
      return;
    }

    const resolve = this.confirmResolve;
    this.confirmResolve = null;
    this.confirmModal.classList.add('is-hidden');
    playSound(confirmed ? 'ui-confirm' : 'ui-cancel');
    resolve(Boolean(confirmed));
  }

  renderOnlineLobby(room, localSessionId) {
    if (!room) {
      return;
    }
    const localPlayer = room.players.find((player) => player.playerSessionId === localSessionId);
    const isHost = localPlayer?.isHost;
    const publicRoom = room.roomType === 'public';
    this.onlineLobbyCard.dataset.roomType = publicRoom ? 'public' : 'private';
    this.onlineLobby.querySelector('.eyebrow').textContent = publicRoom ? 'Public Matchmaking' : 'Online Private Room';
    this.onlineLobbyCode.textContent = publicRoom ? 'Match Found' : room.roomCode;
    this.onlineLobbyPlayerCount.value = String(room.playerCount);
    this.onlineLobbyPlayerCount.disabled = this.onlineBusy || publicRoom || !isHost || room.status !== 'lobby';
    this.onlineLobbyPlayerCount.dataset.forceDisabled = (publicRoom || !isHost || room.status !== 'lobby') ? 'true' : 'false';
    this.onlineReadyButton.classList.toggle('is-hidden', publicRoom || Boolean(isHost) || room.status !== 'lobby');
    this.onlineStartButton.classList.toggle('is-hidden', publicRoom || !isHost || room.status !== 'lobby');
    this.onlineReadyButton.textContent = localPlayer?.ready ? 'Not Ready' : 'Ready';
    const startLocked = publicRoom || !isHost || room.status !== 'lobby' || !this.canStartOnlineRoom(room);
    this.onlineStartButton.disabled = this.onlineBusy || startLocked;
    this.onlineStartButton.dataset.forceDisabled = startLocked ? 'true' : 'false';
    this.onlinePlayerList.innerHTML = room.activePlayers.map((playerId) => {
      const player = room.players.find((candidate) => candidate.playerId === playerId);
      const meta = PLAYER_META[playerId];
      if (!player) {
        return `
          <article class="online-player-card is-empty">
            <span class="player-dot player-${playerId}"></span>
            <div class="online-player-copy">
              <strong>${meta.label}</strong>
              <span>Waiting for player</span>
            </div>
            <span class="online-pill">${publicRoom ? 'Matching' : 'Open'}</span>
          </article>
        `;
      }
      return `
        <article class="online-player-card ${player.connected || player.controller === 'server-bot' ? '' : 'is-disconnected'}">
          <span class="player-dot player-${playerId}"></span>
          <div class="online-player-copy">
            <strong>${player.displayName}</strong>
            <span>${meta.label} ${publicRoom ? 'Public seat' : player.isHost ? 'Host' : player.ready ? 'Ready' : 'Not ready'}</span>
          </div>
      <span class="online-pill">${player.controller === 'server-bot' ? 'Server Bot' : player.connected ? 'Connected' : 'Offline'}</span>
        </article>
      `;
    }).join('');
    const filled = room.players.filter((player) => room.activePlayers.includes(player.playerId)).length;
    const ready = room.players.filter((player) => !player.isHost && player.ready).length;
    const status = room.status === 'countdown'
      ? `Match found. Starting in ${this.formatRemaining(room.countdownEndsAt)}.`
      : room.status === 'paused'
        ? publicRoom ? 'Player disconnected. Match paused.' : 'Host disconnected. Match paused.'
        : room.status === 'playing'
          ? 'Match is in progress.'
          : `${filled}/${room.playerCount} seats filled. ${ready} ready.`;
    this.setOnlineStatus(status, room.status === 'paused' ? 'danger' : 'neutral');
  }

  renderMatchmakingState(payload = null) {
    const queue = payload?.queue || payload;
    const status = queue?.status || null;
    const searching = status === 'searching';
    const matched = status === 'matched';
    this.publicSearchPanel.classList.toggle('is-hidden', !searching && !matched);
    this.publicCancelButton.classList.toggle('is-hidden', !searching && !matched);
    this.publicFindButton.disabled = this.onlineBusy || searching || matched;
    this.publicCancelButton.disabled = this.onlineBusy;
    if (!queue) {
      this.publicSearchTitle.textContent = 'Find a public table.';
      this.publicSearchTimer.textContent = '0:00';
      return;
    }

    this.publicSearchTitle.textContent = matched
      ? 'Match found. Preparing the table...'
      : `${queue.waitingPlayers || 1}/${queue.requestedPlayerCount || 2} players found.`;
    const botRemainingMs = queue.botFillAvailableAt
      ? Math.max(0, Number(queue.botFillAvailableAt) - Date.now())
      : Number(queue.botFillRemainingMs || 0);
    const botText = queue.botFillMode === 'off'
      ? 'Bot fill off.'
      : queue.botFillMode === 'immediate'
        ? 'Bot fill can start immediately.'
        : botRemainingMs > 0
          ? `Bot fill unlocks in ${Math.ceil(botRemainingMs / 1000)}s.`
          : 'Bot fill available.';
    this.publicSearchTimer.textContent = `${this.formatElapsed(queue.joinedAt)} · ${botText}`;
    this.setOnlineStatus(
      payload?.message || (matched ? 'Match found.' : 'Searching for a public match.'),
      matched ? 'success' : 'neutral'
    );
  }

  clearMatchmakingState() {
    this.publicSearchPanel.classList.add('is-hidden');
    this.publicCancelButton.classList.add('is-hidden');
    this.publicFindButton.disabled = false;
    this.publicCancelButton.disabled = false;
    this.publicSearchTimer.textContent = '0:00';
  }

  formatElapsed(startedAt = Date.now()) {
    return formatDuration(Date.now() - Number(startedAt || Date.now()));
  }

  formatRemaining(endsAt = Date.now()) {
    return `${Math.max(0, Math.ceil((Number(endsAt || Date.now()) - Date.now()) / 1000))}s`;
  }

  canStartOnlineRoom(room) {
    const filled = room.players.filter((player) => room.activePlayers.includes(player.playerId)).length;
    const unready = room.players.filter((player) => !player.isHost && !player.ready);
    return filled >= room.playerCount && unready.length === 0;
  }

  async copyOnlineRoomCode() {
    const roomCode = this.onlineLobbyCode.textContent;
    try {
      await navigator.clipboard.writeText(roomCode);
      playSound('copy');
      this.setOnlineStatus('Room code copied.', 'success');
    } catch {
      this.setOnlineStatus(`Room code: ${roomCode}`, 'neutral');
    }
  }
}

export { formatDuration };
