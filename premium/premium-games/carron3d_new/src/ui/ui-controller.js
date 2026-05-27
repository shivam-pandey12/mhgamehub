import { APP_STATES, DEFAULT_LOCAL_SETUP } from '../config/carrom-constants.js';
import { THEME_PRESETS } from '../config/theme-config.js';
import { OverlayController } from './overlay-controller.js';
import { HudController } from './hud-controller.js';

export class UIController {
  constructor({ app, root }) {
    this.app = app;
    this.root = root;
    this.overlayController = new OverlayController();
    this.hudController = new HudController();
    this.sidePanelSection = 'setup';
    this.pendingConfirmation = null;
  }

  init() {
    this.root.innerHTML = `
      <div class="carrom-shell" data-state="${APP_STATES.playing}">
        <canvas id="carromStage" class="carrom-stage" aria-label="Premium 3D carrom board scene"></canvas>
        <div class="backdrop" aria-hidden="true">
          <span class="ambient-glow glow-one"></span>
          <span class="ambient-glow glow-two"></span>
          <span class="ambient-glow glow-three"></span>
        </div>
        <div class="scene-vignette" aria-hidden="true"></div>
        <div class="portrait-hint" aria-live="polite">Rotate for the best carrom table view.</div>
        <main class="screen-host">
          ${this.overlayController.render()}
        </main>
        ${this.hudController.render()}
        ${this.renderConfirmationCard()}
      </div>
    `;

    this.shell = this.root.querySelector('.carrom-shell');
    this.canvas = this.root.querySelector('#carromStage');
    this.bindEvents();
  }

  bindEvents() {
    this.handleCosmeticClick = (event) => {
      const categoryTarget = event.target.closest('[data-cosmetic-category-tab]');
      if (categoryTarget && this.root.contains(categoryTarget)) {
        event.preventDefault();
        event.stopPropagation();
        this.app.playUiClick?.();
        this.app.selectCosmeticCategory?.(categoryTarget.dataset.cosmeticCategoryTab);
        return;
      }

      const cosmeticCard = event.target.closest('[data-cosmetic-card]');
      if (cosmeticCard && this.root.contains(cosmeticCard)) {
        event.preventDefault();
        event.stopPropagation();
        this.app.playUiClick?.();
        this.app.previewCosmetic?.(cosmeticCard.dataset.cosmeticCategory, cosmeticCard.dataset.cosmeticId);
      }
    };

    this.handleActionClick = (event) => {
      const actionTarget = event.target.closest('[data-action]');
      if (!actionTarget || actionTarget.disabled) {
        return;
      }

      event.preventDefault();
      this.app.playUiClick?.();
      this.handleAction(actionTarget.dataset.action, actionTarget);
    };

    this.handleConfirmationClick = (event) => {
      const target = event.target.closest('[data-confirm-choice]');
      if (!target || !this.root.contains(target)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      const choice = target.dataset.confirmChoice;
      if (choice === 'confirm') {
        this.confirmPendingAction();
      } else {
        this.closeConfirmation();
      }
    };

    this.handleChoiceClick = (event) => {
      const choice = event.target.closest('[data-choice-group]');
      if (!choice || choice.disabled) {
        return;
      }

      event.preventDefault();
      this.app.updateLocalSetup(choice.dataset.choiceGroup, choice.dataset.choiceValue);
    };

    this.handleOnlineChoiceClick = (event) => {
      const choice = event.target.closest('[data-online-choice-group]');
      if (!choice || choice.disabled) {
        return;
      }

      event.preventDefault();
      const group = choice.dataset.onlineChoiceGroup;
      this.root.querySelectorAll(`[data-online-choice-group="${group}"]`).forEach((button) => {
        const selected = button === choice;
        button.classList.toggle('is-selected', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      this.updateOnlineRuleVisibility();
    };

    this.handlePublicChoiceClick = (event) => {
      const choice = event.target.closest('[data-public-choice-group]');
      if (!choice || choice.disabled) {
        return;
      }

      event.preventDefault();
      const group = choice.dataset.publicChoiceGroup;
      this.root.querySelectorAll(`[data-public-choice-group="${group}"]`).forEach((button) => {
        const selected = button === choice;
        button.classList.toggle('is-selected', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      this.updatePublicRuleVisibility();
    };

    this.handleSettingClick = (event) => {
      const choice = event.target.closest('[data-setting-choice]');
      if (!choice || choice.disabled) {
        return;
      }

      event.preventDefault();
      this.app.updateSetting(choice.dataset.settingChoice, choice.dataset.settingValue);
    };

    this.handleSettingChange = (event) => {
      const toggle = event.target.closest('[data-setting-toggle]');
      if (!toggle) {
        return;
      }

      this.app.updateSetting(toggle.dataset.settingToggle, toggle.checked);
    };

    this.handleSetupInput = (event) => {
      if (event.target.matches('#playerOneName, #hudPlayerOneName, [data-player-name="one"]')) {
        this.app.updateLocalSetup('playerOneName', event.target.value);
      }
      if (event.target.matches('#playerTwoName, #hudPlayerTwoName, [data-player-name="two"]')) {
        this.app.updateLocalSetup('playerTwoName', event.target.value);
      }
    };

    this.root.addEventListener('click', this.handleCosmeticClick, true);
    this.root.addEventListener('click', this.handleConfirmationClick, true);
    this.root.addEventListener('click', this.handleActionClick);
    this.root.addEventListener('click', this.handleChoiceClick);
    this.root.addEventListener('click', this.handleOnlineChoiceClick);
    this.root.addEventListener('click', this.handlePublicChoiceClick);
    this.root.addEventListener('click', this.handleSettingClick);
    this.root.addEventListener('change', this.handleSettingChange);
    this.root.addEventListener('input', this.handleSetupInput);
  }

  renderConfirmationCard() {
    return `
      <section class="confirmation-overlay" data-confirmation-overlay aria-hidden="true" aria-label="Confirm important action">
        <div class="confirmation-card shimmer-panel" role="dialog" aria-modal="true" aria-labelledby="confirmationTitle" aria-describedby="confirmationBody">
          <span class="eyebrow" data-confirmation-eyebrow>Confirm Action</span>
          <h2 id="confirmationTitle" data-confirmation-title>Are you sure?</h2>
          <p id="confirmationBody" data-confirmation-body>This action needs confirmation.</p>
          <div class="confirmation-detail" data-confirmation-detail hidden></div>
          <div class="controls-card compact-controls confirmation-actions">
            <button class="action-btn danger" type="button" data-confirm-choice="confirm"><span data-confirmation-confirm-label>Confirm</span></button>
            <button class="action-btn secondary" type="button" data-confirm-choice="cancel"><span data-confirmation-cancel-label>Cancel</span></button>
          </div>
        </div>
      </section>
    `;
  }

  handleAction(action, target = null, { confirmed = false } = {}) {
    if (!confirmed) {
      const confirmation = this.app.getActionConfirmation?.(action, target) || null;
      if (confirmation) {
        this.openConfirmation(action, target, confirmation);
        return;
      }
    }

    const actionMap = {
      'main-menu': () => this.app.showMainMenu(),
      'mode-select': () => this.app.showModeSelect(),
      'open-local-setup': () => this.app.showLocalSetup(),
      'select-vs-bot': () => this.app.selectMatchMode?.('vsBot'),
      'select-local2p': () => this.app.selectMatchMode?.('local2p'),
      'open-practice': () => this.app.showPracticePanel?.(),
      'start-practice': () => this.app.startPractice?.(this.getLocalSetupValues().practiceType),
      'start-tutorial': () => this.app.startTutorial?.(),
      'tutorial-next': () => this.app.tutorialNext?.(),
      'tutorial-exit': () => this.app.exitTutorial?.(),
      'tutorial-local': () => this.app.finishTutorialToLocal?.(),
      'tutorial-bot': () => this.app.finishTutorialToBot?.(),
      'tutorial-practice': () => this.app.finishTutorialToPractice?.(),
      'tutorial-menu': () => this.app.finishTutorialToMenu?.(),
      'reset-practice': () => this.app.resetPractice?.(),
      'next-practice': () => this.app.nextPracticeDrill?.(),
      'exit-practice': () => this.app.exitPractice?.(),
      'onboarding-next': () => this.app.onboardingNext?.(),
      'onboarding-prev': () => this.app.onboardingPrevious?.(),
      'onboarding-skip': () => this.app.skipOnboarding?.(),
      'onboarding-start-tutorial': () => this.app.startTutorialFromOnboarding?.(),
      'onboarding-start-practice': () => this.app.startPracticeFromOnboarding?.(),
      'reset-onboarding': () => this.app.resetOnboarding?.(),
      'dismiss-coach': () => this.app.dismissCoachHint?.(),
      'open-challenges': () => this.app.showChallengePanel?.(),
      'open-online': () => this.app.showOnlinePanel?.(),
      'open-public-matchmaking': () => this.app.showPublicMatchmakingPanel?.(),
      'online-show-menu': () => this.setOnlineView('menu'),
      'online-show-create': () => this.setOnlineView('create'),
      'online-show-join': () => this.setOnlineView('join'),
      'create-online-room': () => this.app.createOnlineRoom?.(this.getOnlineCreateValues()),
      'join-online-room': () => this.app.joinOnlineRoom?.(this.getOnlineJoinValues()),
      'leave-online-room': () => this.app.leaveOnlineRoom?.(),
      'reconnect-online-session': () => this.app.reconnectOnlineSession?.(),
      'discard-online-session': () => this.app.discardOnlineSession?.(),
      'start-online-match': () => this.app.startOnlineMatch?.(),
      'copy-online-room-code': () => this.app.copyOnlineRoomCode?.(),
      'copy-online-room-link': () => this.app.copyOnlineRoomLink?.(),
      'refresh-online-state': () => this.app.requestOnlineState?.(),
      'request-online-rematch': () => this.app.requestOnlineRematch?.(),
      'accept-online-rematch': () => this.app.respondOnlineRematch?.(true),
      'decline-online-rematch': () => this.app.respondOnlineRematch?.(false),
      'join-public-queue': () => this.app.joinPublicQueue?.(this.getPublicQueueValues()),
      'cancel-public-queue': () => this.app.cancelPublicQueue?.(),
      'select-challenge': () => this.app.selectChallenge?.(target?.dataset.challengeId),
      'start-challenge': () => this.app.startChallenge?.(this.getSelectedChallengeId()),
      'retry-challenge': () => this.app.retryChallenge?.(),
      'next-challenge': () => this.app.nextChallenge?.(),
      'exit-challenge': () => this.app.exitChallenge?.(),
      'reset-challenge-progress': () => this.app.resetChallengeProgress?.(),
      'open-customize': () => this.app.showCustomizePanel?.(),
      'cosmetic-category': () => this.app.selectCosmeticCategory?.(target?.dataset.cosmeticCategory),
      'preview-cosmetic': () => this.app.previewCosmetic?.(target?.dataset.cosmeticCategory, target?.dataset.cosmeticId),
      'equip-cosmetic': () => this.app.equipCosmetics?.(),
      'reset-cosmetics': () => this.app.resetCosmetics?.(),
      'close-customize': () => this.app.closeCustomizePanel?.(),
      'panel-match': () => this.app.showMatchPanel(),
      'start-local-shell-match': () => this.app.startLocalShellMatch(),
      pause: () => this.app.showPause(),
      'resume-match': () => this.app.resumeMatch(),
      rules: () => this.app.showRules(),
      settings: () => this.app.showSettings(),
      about: () => this.app.showAbout(),
      'debug-result': () => this.app.showDebugResult(),
      'toggle-hud': () => this.app.toggleHudCollapsed(),
      'quit-match': () => this.app.quitMatch(),
      'test-physics-shot': () => this.app.testPhysicsShot(),
      'reset-physics': () => this.app.resetPhysicsScene(),
      'rematch-shell': () => this.app.handleResultPrimary?.(),
      'restart-match': () => this.app.startLocalShellMatch({ preserveSetup: true }),
      'return-from-overlay': () => this.app.returnFromOverlay(),
      'reset-settings': () => this.app.resetSettings()
    };

    actionMap[action]?.();
  }

  openConfirmation(action, target, confirmation = {}) {
    const overlay = this.root.querySelector('[data-confirmation-overlay]');
    if (!overlay) {
      return;
    }

    this.pendingConfirmation = { action, target };
    const setText = (selector, value) => {
      const element = overlay.querySelector(selector);
      if (element) {
        element.textContent = value;
      }
    };

    setText('[data-confirmation-eyebrow]', confirmation.eyebrow || 'Confirm Action');
    setText('[data-confirmation-title]', confirmation.title || 'Are you sure?');
    setText('[data-confirmation-body]', confirmation.body || 'This action needs confirmation.');
    setText('[data-confirmation-confirm-label]', confirmation.confirmLabel || 'Confirm');
    setText('[data-confirmation-cancel-label]', confirmation.cancelLabel || 'Cancel');
    const detail = overlay.querySelector('[data-confirmation-detail]');
    if (detail) {
      const hasDetail = Boolean(confirmation.detail);
      detail.hidden = !hasDetail;
      detail.textContent = confirmation.detail || '';
    }

    overlay.classList.add('is-visible');
    overlay.setAttribute('aria-hidden', 'false');
    overlay.querySelector('[data-confirm-choice="cancel"]')?.focus?.({ preventScroll: true });
  }

  closeConfirmation() {
    this.pendingConfirmation = null;
    const overlay = this.root.querySelector('[data-confirmation-overlay]');
    if (!overlay) {
      return;
    }
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
  }

  confirmPendingAction() {
    const pending = this.pendingConfirmation;
    this.closeConfirmation();
    if (!pending?.action) {
      return;
    }
    this.handleAction(pending.action, pending.target, { confirmed: true });
  }

  hasOpenConfirmation() {
    return Boolean(this.pendingConfirmation);
  }

  getCanvas() {
    return this.canvas;
  }

  getLocalSetupValues() {
    const getChoiceValue = (group, fallback) => (
      this.root.querySelector(`[data-choice-group="${group}"].is-selected`)?.dataset.choiceValue || fallback
    );

    return {
      playerOneName: this.root.querySelector('#hudPlayerOneName')?.value.trim()
        || this.root.querySelector('#playerOneName')?.value.trim()
        || DEFAULT_LOCAL_SETUP.playerOneName,
      playerTwoName: this.root.querySelector('#hudPlayerTwoName')?.value.trim()
        || this.root.querySelector('#playerTwoName')?.value.trim()
        || DEFAULT_LOCAL_SETUP.playerTwoName,
      matchMode: getChoiceValue('matchMode', DEFAULT_LOCAL_SETUP.matchMode),
      botDifficulty: getChoiceValue('botDifficulty', DEFAULT_LOCAL_SETUP.botDifficulty),
      ruleMode: getChoiceValue('ruleMode', DEFAULT_LOCAL_SETUP.ruleMode),
      classicRuleVariant: getChoiceValue('classicRuleVariant', DEFAULT_LOCAL_SETUP.classicRuleVariant),
      coinSide: getChoiceValue('coinSide', DEFAULT_LOCAL_SETUP.coinSide),
      matchType: getChoiceValue('matchType', DEFAULT_LOCAL_SETUP.matchType),
      practiceType: getChoiceValue('practiceType', DEFAULT_LOCAL_SETUP.practiceType),
      boardStyle: getChoiceValue('boardStyle', DEFAULT_LOCAL_SETUP.boardStyle)
    };
  }

  getOnlineChoiceValue(group, fallback = '') {
    return this.root.querySelector(`[data-online-choice-group="${group}"].is-selected`)?.dataset.onlineChoiceValue || fallback;
  }

  getPublicChoiceValue(group, fallback = '') {
    return this.root.querySelector(`[data-public-choice-group="${group}"].is-selected`)?.dataset.publicChoiceValue || fallback;
  }

  getOnlineCreateValues() {
    const playerName = this.root.querySelector('#onlineHostName')?.value.trim()
      || this.root.querySelector('#hudPlayerOneName')?.value.trim()
      || DEFAULT_LOCAL_SETUP.playerOneName;
    return {
      playerName,
      matchConfig: {
        ruleMode: this.getOnlineChoiceValue('ruleMode', 'classic'),
        classicRuleVariant: this.getOnlineChoiceValue('classicRuleVariant', DEFAULT_LOCAL_SETUP.classicRuleVariant),
        coinAssignmentMode: this.getOnlineChoiceValue('coinAssignmentMode', DEFAULT_LOCAL_SETUP.coinSide)
      }
    };
  }

  getOnlineJoinValues() {
    return {
      playerName: this.root.querySelector('#onlineGuestName')?.value.trim()
        || this.root.querySelector('#hudPlayerTwoName')?.value.trim()
        || DEFAULT_LOCAL_SETUP.playerTwoName,
      roomCode: this.root.querySelector('#onlineRoomCode')?.value.trim() || ''
    };
  }

  getPublicQueueValues() {
    return {
      playerName: this.root.querySelector('#publicPlayerName')?.value.trim()
        || this.root.querySelector('#hudPlayerOneName')?.value.trim()
        || DEFAULT_LOCAL_SETUP.playerOneName,
      preferences: {
        ruleMode: this.getPublicChoiceValue('ruleMode', 'any'),
        classicRuleVariant: this.getPublicChoiceValue('classicRuleVariant', 'any'),
        coinAssignmentMode: this.getPublicChoiceValue('coinAssignmentMode', 'random'),
        matchType: 'casual',
        allowBotFill: false
      }
    };
  }

  getSelectedChallengeId() {
    return this.root.querySelector('[data-challenge-id].is-selected')?.dataset.challengeId
      || this.root.querySelector('[data-challenge-id]')?.dataset.challengeId
      || '';
  }

  setState(state) {
    if (this.shell) {
      this.shell.dataset.state = state;
    }

    this.root.querySelectorAll('[data-screen]').forEach((screen) => {
      screen.classList.toggle('is-active', screen.dataset.screen === state);
    });
  }

  updateLocalSetup(setup) {
    this.root.querySelectorAll('#playerOneName, #hudPlayerOneName, [data-player-name="one"]').forEach((playerOne) => {
      if (document.activeElement !== playerOne) {
        playerOne.value = setup.playerOneName || '';
      }
    });
    this.root.querySelectorAll('#publicPlayerName').forEach((publicName) => {
      if (document.activeElement !== publicName) {
        publicName.value = setup.playerOneName || '';
      }
    });
    this.root.querySelectorAll('#playerTwoName, #hudPlayerTwoName, [data-player-name="two"]').forEach((playerTwo) => {
      if (document.activeElement !== playerTwo) {
        playerTwo.value = setup.playerTwoName || '';
      }
    });

    const normalizedSetup = {
      ...setup,
      matchMode: setup.matchMode || DEFAULT_LOCAL_SETUP.matchMode,
      botDifficulty: setup.botDifficulty || DEFAULT_LOCAL_SETUP.botDifficulty,
      ruleMode: setup.ruleMode || DEFAULT_LOCAL_SETUP.ruleMode,
      classicRuleVariant: setup.classicRuleVariant || DEFAULT_LOCAL_SETUP.classicRuleVariant,
      practiceType: setup.practiceType || DEFAULT_LOCAL_SETUP.practiceType,
      coinSide: this.normalizeCoinSide(setup.coinSide)
    };

    this.root.querySelectorAll('[data-choice-group]').forEach((button) => {
      const selected = normalizedSetup[button.dataset.choiceGroup] === button.dataset.choiceValue;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });

    const setupLabel = this.root.querySelector('[data-setup-mode-label]');
    if (setupLabel) {
      setupLabel.textContent = normalizedSetup.matchMode === 'vsBot'
        ? 'Human vs Bot'
        : normalizedSetup.ruleMode === 'freeCapture' ? 'Free Capture' : 'Classic Coin Side';
    }

    const setupNote = this.root.querySelector('[data-setup-mode-note]');
    if (setupNote) {
      const notes = {
        p1White: 'Player 1 starts as White; Player 2 plays Black.',
        p1Black: 'Player 1 starts as Black; Player 2 plays White.',
        random: 'Random side mode active: colors are assigned on start and points are shown.',
        firstPocket: 'Open color mode active: the first white or black coin pocketed assigns colors.'
      };
      setupNote.textContent = normalizedSetup.ruleMode === 'freeCapture'
        ? 'Pocket any coin. Every captured coin counts for you.'
        : notes[normalizedSetup.coinSide] || notes.p1White;
    }

    const vsBot = normalizedSetup.matchMode === 'vsBot';
    this.root.querySelectorAll('[data-setup-eyebrow]').forEach((eyebrow) => {
      eyebrow.textContent = vsBot ? 'Human vs Bot' : 'Local 2 Player';
    });
    this.root.querySelectorAll('[data-player-one-label]').forEach((label) => {
      label.textContent = vsBot ? 'Human Player' : 'Player 1';
    });
    this.root.querySelectorAll('[data-player-two-label]').forEach((label) => {
      label.textContent = vsBot ? 'Bot Name' : 'Player 2';
    });
    this.root.querySelectorAll('[data-player-two-helper]').forEach((helper) => {
      helper.textContent = vsBot ? 'Bot plays from the top baseline' : 'Color follows setup';
    });
    this.root.querySelectorAll('[data-start-match-label]').forEach((label) => {
      label.textContent = vsBot ? 'Start Vs Bot Match' : 'Start Local Match';
    });
    this.root.querySelectorAll('[data-bot-difficulty-section]').forEach((section) => {
      section.hidden = !vsBot;
      section.classList.toggle('is-disabled', !vsBot);
      section.querySelectorAll('[data-choice-group="botDifficulty"]').forEach((button) => {
        button.disabled = !vsBot;
        button.setAttribute('aria-disabled', String(!vsBot));
      });
    });
    this.updateCoinSideLabels(vsBot);

    const classicRuleSection = this.root.querySelectorAll('[data-classic-rule-section]');
    classicRuleSection.forEach((section) => {
      const hidden = normalizedSetup.ruleMode === 'freeCapture';
      section.hidden = hidden;
      section.classList.toggle('is-disabled', hidden);
      section.querySelectorAll('[data-choice-group="classicRuleVariant"]').forEach((button) => {
        button.disabled = hidden;
        button.setAttribute('aria-disabled', String(hidden));
      });
    });

    const coinSideSection = this.root.querySelectorAll('[data-coin-side-section]');
    coinSideSection.forEach((section) => {
      const disabled = normalizedSetup.ruleMode === 'freeCapture';
      section.hidden = disabled;
      section.classList.toggle('is-disabled', disabled);
      section.querySelectorAll('[data-choice-group="coinSide"]').forEach((button) => {
        button.disabled = disabled;
        button.setAttribute('aria-disabled', String(disabled));
      });
    });

    this.root.querySelectorAll('[data-rule-mode-helper]').forEach((helper) => {
      helper.textContent = normalizedSetup.ruleMode === 'freeCapture'
        ? 'Pocket any coin. Every captured coin counts for you.'
        : 'Assigned colors, first-pocket, and random color options apply in Classic Carrom.';
    });
  }

  normalizeCoinSide(value) {
    if (value === 'fixed') {
      return 'p1White';
    }
    if (value === 'black') {
      return 'p1Black';
    }
    return value || DEFAULT_LOCAL_SETUP.coinSide;
  }

  updateCoinSideLabels(vsBot = false) {
    const labels = vsBot
      ? {
        p1White: 'Human White',
        p1Black: 'Human Black',
        random: 'Random',
        firstPocket: 'Open / First Pocket'
      }
      : {
        p1White: 'P1 White',
        p1Black: 'P1 Black',
        random: 'Random',
        firstPocket: 'Open / First Pocket'
      };

    Object.entries(labels).forEach(([value, label]) => {
      this.root.querySelectorAll(`[data-choice-group="coinSide"][data-choice-value="${value}"]`).forEach((button) => {
        button.textContent = label;
      });
    });
  }

  updateSettings(settings) {
    this.root.querySelectorAll('[data-setting-toggle]').forEach((input) => {
      input.checked = Boolean(settings[input.dataset.settingToggle]);
    });

    this.root.querySelectorAll('[data-setting-choice]').forEach((button) => {
      const key = button.dataset.settingChoice;
      const selected = String(settings[key]) === String(button.dataset.settingValue);
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  updateTheme(theme) {
    Object.entries(theme.css).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
    document.body.dataset.theme = theme.id;
  }

  updateMatch(match) {
    this.hudController.update(this.root, match);
    const winner = this.root.querySelector('[data-result-winner]');
    const outcome = this.root.querySelector('[data-result-outcome]');
    const winnerColor = this.root.querySelector('[data-result-winner-color]');
    const score = this.root.querySelector('[data-result-score]');
    const colors = this.root.querySelector('[data-result-colors]');
    const queen = this.root.querySelector('[data-result-queen]');
    const turns = this.root.querySelector('[data-result-turns]');
    const shots = this.root.querySelector('[data-result-shots]');
    if (winner) {
      winner.textContent = match.winnerName || match.playerOneName || 'Player 1';
    }
    if (outcome) {
      outcome.textContent = match.resultOutcome || 'Wins';
    }
    if (winnerColor) {
      winnerColor.textContent = match.winnerColor || match.currentColor || 'White';
    }
    if (score) {
      score.textContent = match.resultScore || `${match.playerOneScore} - ${match.playerTwoScore}`;
    }
    if (colors) {
      colors.textContent = match.resultColorSummary || `${match.playerOneName}: ${match.playerOneColor} | ${match.playerTwoName}: ${match.playerTwoColor}`;
    }
    if (queen) {
      queen.textContent = match.resultQueenStatus || match.queenStatus || 'On board';
    }
    if (turns) {
      turns.textContent = String(match.resultTurns || match.turnNumber || 1);
    }
    if (shots) {
      shots.textContent = String(match.resultShots || match.shotNumber || 0);
    }
    const resultPrimary = this.root.querySelector('[data-action="rematch-shell"] span');
    if (resultPrimary) {
      resultPrimary.textContent = match.matchMode === 'onlinePrivate' || match.matchMode === 'onlinePublic'
        ? 'Request Rematch'
        : 'Rematch';
    }
  }

  updateChallengePanel(model = {}) {
    const challenges = model.challenges || [];
    const selectedId = model.selectedChallengeId || challenges[0]?.id || '';
    const selected = challenges.find((challenge) => challenge.id === selectedId) || challenges[0];

    this.root.querySelectorAll('[data-challenge-id]').forEach((button) => {
      const challenge = challenges.find((item) => item.id === button.dataset.challengeId);
      const selectedButton = button.dataset.challengeId === selectedId;
      button.classList.toggle('is-selected', selectedButton);
      button.setAttribute('aria-pressed', String(selectedButton));
      const stars = button.querySelector(`[data-challenge-stars="${button.dataset.challengeId}"]`);
      if (stars && challenge) {
        stars.textContent = `${challenge.bestStars || 0} star${challenge.bestStars === 1 ? '' : 's'}`;
      }
    });

    const setText = (selector, value) => {
      const element = this.root.querySelector(selector);
      if (element) {
        element.textContent = value;
      }
    };

    if (selected) {
      setText('[data-challenge-detail-title]', selected.title);
      setText('[data-challenge-detail-difficulty]', selected.difficulty);
      setText('[data-challenge-detail-objective]', selected.objectiveText);
      setText('[data-challenge-detail-progress]', `Best: ${selected.bestStars || 0} star${selected.bestStars === 1 ? '' : 's'}`);
    }

    const result = model.result;
    const resultBanner = this.root.querySelector('[data-challenge-result]');
    if (resultBanner && result) {
      resultBanner.textContent = result.completed
        ? `Success: ${result.stars} star${result.stars === 1 ? '' : 's'} earned.`
        : result.failed ? `Failed: ${result.message}` : result.message;
      resultBanner.dataset.tone = result.completed ? 'success' : result.failed ? 'danger' : 'default';
    } else if (resultBanner) {
      resultBanner.textContent = selected ? selected.objectiveText : 'Select a challenge.';
      resultBanner.dataset.tone = 'default';
    }
  }

  setOnlineView(view = 'menu') {
    this.root.querySelectorAll('[data-online-view]').forEach((panel) => {
      const visible = panel.dataset.onlineView === view;
      panel.classList.toggle('is-active', visible);
      panel.hidden = !visible;
    });
    this.updateOnlineRuleVisibility();
  }

  updateOnlineRuleVisibility() {
    const ruleMode = this.getOnlineChoiceValue('ruleMode', 'classic');
    const classicOnly = ruleMode !== 'freeCapture';
    this.root.querySelectorAll('[data-online-classic-section], [data-online-coin-section]').forEach((section) => {
      section.hidden = !classicOnly;
      section.classList.toggle('is-disabled', !classicOnly);
    });
  }

  updatePublicRuleVisibility() {
    const ruleMode = this.getPublicChoiceValue('ruleMode', 'any');
    const hidden = ruleMode === 'freeCapture';
    this.root.querySelectorAll('[data-public-classic-section], [data-public-coin-section]').forEach((section) => {
      section.hidden = hidden;
      section.classList.toggle('is-disabled', hidden);
    });
  }

  updateOnlinePanel(model = {}) {
    const view = model.view || 'menu';
    this.setOnlineView(view);
    const setText = (selector, value) => {
      const element = this.root.querySelector(selector);
      if (element) {
        element.textContent = value;
      }
    };
    const config = model.matchConfig || {};
    const ruleLabel = config.ruleMode === 'freeCapture'
      ? 'Free Capture'
      : `Classic / ${config.classicRuleVariant || 'casual'} / ${config.coinAssignmentMode || 'p1White'}`;
    setText('[data-online-room-code-label]', model.roomCode || '-----');
    setText('[data-online-playing-room]', model.roomCode || '-----');
    setText('[data-online-host]', model.host?.name || 'Waiting');
    setText('[data-online-guest]', model.guest?.name || 'Waiting');
    setText('[data-online-rules]', ruleLabel);
    setText('[data-online-status]', model.message || model.roomStatus || 'Lobby');
    setText('[data-online-connection]', model.connectionStatus || 'Offline');
    setText('[data-online-turn]', model.message || 'Waiting');
    setText('[data-online-reconnect-room]', model.reconnectRoomCode || '-----');
    setText('[data-online-reconnect-player]', model.reconnectPlayerName || 'Player');
    setText('[data-online-timer]', model.turnTimerLabel || 'Paused');
    setText('[data-online-disconnect-countdown]', model.disconnectLabel || '0:00');
    setText('[data-online-rematch-status]', model.rematchLabel || 'No rematch request');
    setText('[data-online-debug-status]', model.debugLabel || 'v0 / 0ms / OK');
    const message = this.root.querySelector('[data-online-message]');
    if (message) {
      message.textContent = model.error || model.message || 'Create or join a private room.';
      message.dataset.tone = model.error ? 'danger' : model.status === 'playing' ? 'success' : 'default';
    }
    this.root.querySelectorAll('[data-online-host-only]').forEach((button) => {
      button.hidden = !model.isHost;
      button.disabled = !model.canStart;
      button.setAttribute('aria-disabled', String(!model.canStart));
    });
    this.root.querySelectorAll('[data-online-timer-row]').forEach((row) => {
      const visible = Boolean(model.turnTimerLabel);
      row.hidden = !visible;
      row.classList.toggle('is-visible', visible);
      row.classList.toggle('is-warning', Boolean(model.turnTimerLow));
    });
    this.root.querySelectorAll('[data-online-grace-row]').forEach((row) => {
      const visible = Boolean(model.disconnectGrace);
      row.hidden = !visible;
      row.classList.toggle('is-visible', visible);
    });
    this.root.querySelectorAll('[data-online-rematch-row]').forEach((row) => {
      const visible = Boolean(model.rematch && model.rematch.status !== 'idle');
      row.hidden = !visible;
      row.classList.toggle('is-visible', visible);
    });
    this.root.querySelectorAll('[data-online-debug-row]').forEach((element) => {
      const visible = Boolean(this.debugOnline);
      element.hidden = !visible;
      element.classList.toggle('is-visible', visible);
    });
    this.root.querySelectorAll('[data-action="request-online-rematch"]').forEach((button) => {
      button.hidden = !model.canRequestRematch;
      button.disabled = !model.canRequestRematch;
      button.setAttribute('aria-disabled', String(!model.canRequestRematch));
    });
    this.root.querySelectorAll('[data-online-rematch-answer]').forEach((button) => {
      button.hidden = !model.canAnswerRematch;
      button.disabled = !model.canAnswerRematch;
      button.setAttribute('aria-disabled', String(!model.canAnswerRematch));
    });
  }

  updatePublicMatchmakingPanel(model = {}) {
    const view = model.view || 'form';
    this.root.querySelectorAll('[data-public-view]').forEach((panel) => {
      const visible = panel.dataset.publicView === view;
      panel.classList.toggle('is-active', visible);
      panel.hidden = !visible;
    });
    this.updatePublicRuleVisibility();

    const setText = (selector, value) => {
      const element = this.root.querySelector(selector);
      if (element) {
        element.textContent = value;
      }
    };
    const setAllText = (selector, value) => {
      this.root.querySelectorAll(selector).forEach((element) => {
        element.textContent = value;
      });
    };

    setText('[data-public-wait]', model.waitLabel || '0:00');
    setText('[data-public-waiting-count]', `${model.playersWaiting || 0}`);
    setAllText('[data-public-preferences]', model.preferencesLabel || 'Any Rules');
    setText('[data-public-opponent]', model.opponentName || 'Opponent');
    setText('[data-public-room]', model.roomCode || '-----');
    setText('[data-public-connection]', model.connectionStatus || 'Offline');
    const message = this.root.querySelector('[data-public-message]');
    if (message) {
      message.textContent = model.message || 'Find a casual 3D Carrom opponent.';
      message.dataset.tone = model.tone || 'default';
    }
    this.root.querySelectorAll('[data-action="join-public-queue"]').forEach((button) => {
      button.disabled = model.queued || model.matched;
      button.setAttribute('aria-disabled', String(button.disabled));
    });
    this.root.querySelectorAll('[data-action="cancel-public-queue"]').forEach((button) => {
      button.disabled = !model.queued;
      button.setAttribute('aria-disabled', String(button.disabled));
    });
  }

  updateCosmeticsPanel(model = {}) {
    const activeCategory = model.activeCategory || 'board';
    const selectedItem = model.selectedItem || {};
    const equippedLoadout = model.equippedLoadout || {};
    const previewLoadout = model.previewLoadout || {};

    this.root.querySelectorAll('[data-cosmetic-category-tab]').forEach((button) => {
      const selected = button.dataset.cosmeticCategoryTab === activeCategory;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });

    this.root.querySelectorAll('[data-cosmetic-card]').forEach((card) => {
      const category = card.dataset.cosmeticCategory;
      const itemId = card.dataset.cosmeticId;
      const visible = category === activeCategory;
      const categoryModel = model.categories?.find((entry) => entry.id === category);
      const previewed = categoryModel ? previewLoadout[categoryModel.loadoutKey] === itemId : false;
      const equipped = categoryModel ? equippedLoadout[categoryModel.loadoutKey] === itemId : false;
      const focused = model.focusedItemId === itemId;
      card.hidden = !visible;
      card.classList.toggle('is-selected', visible && previewed);
      card.classList.toggle('is-focused', visible && focused);
      card.classList.toggle('is-equipped', visible && equipped);
      card.classList.toggle('is-locked', card.dataset.cosmeticStatus === 'locked');
      card.classList.toggle('is-coming-soon', card.dataset.cosmeticStatus === 'comingSoon');
      card.setAttribute('aria-pressed', String(visible && (previewed || focused)));
      card.setAttribute('aria-disabled', String(card.dataset.cosmeticStatus === 'comingSoon'));
      const pill = card.querySelector('.status-pill');
      if (pill) {
        if (focused && card.dataset.cosmeticStatus === 'comingSoon') {
          pill.textContent = 'Coming Soon';
        } else if (previewed && equipped) {
          pill.textContent = 'Equipped';
        } else if (previewed) {
          pill.textContent = 'Previewing';
        } else if (equipped) {
          pill.textContent = 'Equipped';
        } else if (card.dataset.cosmeticStatus === 'locked') {
          pill.textContent = 'Locked';
        } else if (card.dataset.cosmeticStatus === 'comingSoon') {
          pill.textContent = 'Coming Soon';
        } else {
          pill.textContent = 'Available';
        }
      }
    });

    const setText = (selector, value) => {
      const element = this.root.querySelector(selector);
      if (element) {
        element.textContent = value;
      }
    };

    setText('[data-cosmetic-detail-status]', `${model.selectedStatusLabel || 'Available'} / ${model.selectedRarityLabel || 'Common'}`);
    setText('[data-cosmetic-detail-name]', selectedItem.name || 'Ivory Royale');
    setText('[data-cosmetic-detail-description]', selectedItem.description || 'Select a cosmetic to preview the live table.');
    setText('[data-cosmetic-detail-summary]', model.summary || '');
    setText('[data-cosmetic-message]', model.message || 'Select a cosmetic to preview it on the live 3D table.');

    const message = this.root.querySelector('[data-cosmetic-message]');
    if (message) {
      message.dataset.tone = model.tone || 'default';
    }

    this.root.querySelectorAll('[data-action="equip-cosmetic"]').forEach((button) => {
      button.disabled = !model.canEquip;
      button.setAttribute('aria-disabled', String(!model.canEquip));
    });
  }

  updateOnboarding(model = {}) {
    const overlay = this.root.querySelector('[data-onboarding-overlay]');
    if (!overlay) {
      return;
    }
    const visible = Boolean(model.visible);
    overlay.classList.toggle('is-visible', visible);
    overlay.setAttribute('aria-hidden', String(!visible));
    const setText = (selector, value) => {
      const element = overlay.querySelector(selector);
      if (element) {
        element.textContent = value;
      }
    };
    setText('[data-onboarding-title]', model.step?.title || 'Welcome to 3D Carrom Royale');
    setText('[data-onboarding-body]', model.step?.body || '');
    setText('[data-onboarding-step]', `${(model.stepIndex || 0) + 1}/${model.stepCount || 1}`);
    overlay.querySelectorAll('[data-action="onboarding-prev"]').forEach((button) => {
      button.disabled = Boolean(model.isFirst);
    });
    overlay.querySelectorAll('[data-action="onboarding-next"]').forEach((button) => {
      button.hidden = Boolean(model.isLast);
    });
    overlay.querySelectorAll('[data-onboarding-final-actions]').forEach((actions) => {
      actions.hidden = !model.isLast;
    });
  }

  updateCoachHint(model = {}) {
    const hint = this.root.querySelector('[data-coach-hint]');
    if (!hint) {
      return;
    }
    hint.classList.toggle('is-visible', Boolean(model.visible));
    hint.dataset.tone = model.tone || 'default';
    const body = hint.querySelector('[data-coach-message]');
    if (body) {
      body.textContent = model.message || '';
    }
  }

  updateTutorial(hud = {}) {
    const card = this.root.querySelector('[data-tutorial-card]');
    if (!card) {
      return;
    }
    const active = Boolean(hud.tutorialActive);
    card.classList.toggle('is-active', active);
    card.hidden = !active;
    const setText = (selector, value) => {
      const element = card.querySelector(selector);
      if (element) {
        element.textContent = value;
      }
    };
    setText('[data-tutorial-title]', hud.tutorialTitle || 'Tutorial');
    setText('[data-tutorial-step]', `${(hud.tutorialStepIndex || 0) + 1}/${hud.tutorialStepCount || 1}`);
    setText('[data-tutorial-instruction]', hud.tutorialInstruction || '');
    const finished = hud.tutorialStepId === 'finish';
    card.querySelectorAll('[data-tutorial-finish-actions]').forEach((actions) => {
      actions.hidden = !finished;
    });
    card.querySelectorAll('[data-action="tutorial-next"]').forEach((button) => {
      button.hidden = finished;
    });
  }

  setHudCollapsed(collapsed) {
    this.shell?.classList.toggle('panel-collapsed', Boolean(collapsed));
    const toggle = this.root.querySelector('[data-action="toggle-hud"]');
    const label = toggle?.querySelector('.hud-toggle-label');
    if (!toggle || !label) {
      return;
    }

    toggle.setAttribute('aria-expanded', String(!collapsed));
    toggle.setAttribute('aria-label', collapsed ? 'Show side panel' : 'Hide side panel');
    label.textContent = collapsed ? 'Show Panel' : 'Hide Panel';
  }

  setSidePanelSection(section = 'match') {
    this.sidePanelSection = section;
    this.root.querySelectorAll('[data-panel-section]').forEach((panel) => {
      panel.classList.toggle('is-active', panel.dataset.panelSection === section);
    });
    this.root.querySelectorAll('[data-panel-tab]').forEach((tab) => {
      const selected = tab.dataset.panelTab === section;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-pressed', String(selected));
    });
  }

  setDebugPhysics(enabled) {
    this.shell?.classList.toggle('debug-physics', Boolean(enabled));
  }

  setDebugOnline(enabled) {
    this.debugOnline = Boolean(enabled);
    this.shell?.classList.toggle('debug-online', this.debugOnline);
  }

  updateThemeLabels() {
    const themes = Object.values(THEME_PRESETS).map((theme) => theme.label).join(', ');
    this.root.querySelector('[data-theme-labels]')?.replaceChildren(themes);
  }

  showVsIntro({
    leftName = 'Player 1',
    leftMeta = 'You',
    rightName = 'Player 2',
    rightMeta = 'Opponent',
    modeLabel = 'Online Match',
    roomCode = ''
  } = {}) {
    this.hideVsIntro({ immediate: true });
    const overlay = document.createElement('div');
    overlay.className = 'vs-intro-overlay';
    overlay.setAttribute('role', 'status');

    const frame = document.createElement('div');
    frame.className = 'vs-intro-frame';

    const createSide = (name, meta, side) => {
      const panel = document.createElement('div');
      panel.className = `vs-intro-player vs-intro-player-${side}`;
      const eyebrow = document.createElement('span');
      eyebrow.className = 'vs-intro-meta';
      eyebrow.textContent = meta;
      const title = document.createElement('strong');
      title.textContent = name;
      const chip = document.createElement('span');
      chip.className = 'vs-intro-chip';
      chip.textContent = side === 'left' ? 'Your Side' : 'Opponent Side';
      panel.append(eyebrow, title, chip);
      return panel;
    };

    const center = document.createElement('div');
    center.className = 'vs-intro-center';
    const mode = document.createElement('span');
    mode.textContent = modeLabel;
    const vs = document.createElement('strong');
    vs.textContent = 'VS';
    const room = document.createElement('small');
    room.textContent = roomCode ? `Room ${roomCode}` : 'Server synced match';
    center.append(mode, vs, room);

    frame.append(
      createSide(leftName, leftMeta, 'left'),
      center,
      createSide(rightName, rightMeta, 'right')
    );
    overlay.append(frame);
    this.shell?.appendChild(overlay);
    this.vsIntroOverlay = overlay;
    window.requestAnimationFrame(() => overlay.classList.add('is-visible'));
    window.clearTimeout(this.vsIntroTimer);
    this.vsIntroTimer = window.setTimeout(() => this.hideVsIntro(), 2300);
  }

  hideVsIntro({ immediate = false } = {}) {
    window.clearTimeout(this.vsIntroTimer);
    this.vsIntroTimer = 0;
    const overlay = this.vsIntroOverlay;
    if (!overlay) {
      return;
    }
    this.vsIntroOverlay = null;
    if (immediate) {
      overlay.remove();
      return;
    }
    overlay.classList.add('is-leaving');
    window.setTimeout(() => overlay.remove(), 360);
  }

  dispose() {
    this.hideVsIntro({ immediate: true });
    if (this.handleActionClick) {
      this.root.removeEventListener('click', this.handleCosmeticClick, true);
      this.root.removeEventListener('click', this.handleConfirmationClick, true);
      this.root.removeEventListener('click', this.handleActionClick);
      this.root.removeEventListener('click', this.handleChoiceClick);
      this.root.removeEventListener('click', this.handleOnlineChoiceClick);
      this.root.removeEventListener('click', this.handlePublicChoiceClick);
      this.root.removeEventListener('click', this.handleSettingClick);
      this.root.removeEventListener('change', this.handleSettingChange);
      this.root.removeEventListener('input', this.handleSetupInput);
    }
  }
}
