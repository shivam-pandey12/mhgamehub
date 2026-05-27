import { STORAGE_KEYS } from '../config/carrom-constants.js';
import {
  createFreePracticeScenario,
  createPocketDrillScenario,
  createQueenCoverDrillScenario,
  TRAINING_PIECES
} from './training-scenarios.js';

export const TUTORIAL_STEPS = [
  {
    id: 'board',
    title: 'Board Intro',
    instruction: 'This is your carrom board. Coins slide flat across the surface.',
    hintKey: 'place'
  },
  {
    id: 'placement',
    title: 'Place The Striker',
    instruction: 'Drag the striker left or right on the highlighted baseline.',
    hintKey: 'place'
  },
  {
    id: 'aim',
    title: 'Aim',
    instruction: 'Drag from the striker to create an aim line.',
    hintKey: 'aim'
  },
  {
    id: 'power',
    title: 'Power',
    instruction: 'Pull farther until the power meter crosses the training mark.',
    hintKey: 'power'
  },
  {
    id: 'shoot',
    title: 'Shoot',
    instruction: 'Release to shoot using the real physics system.',
    hintKey: 'power'
  },
  {
    id: 'pocket',
    title: 'Pocket Practice',
    instruction: 'Pocket the highlighted coin into the marked pocket.',
    hintKey: 'pocket'
  },
  {
    id: 'queen',
    title: 'Queen Cover',
    instruction: 'Pocket the queen, then cover with the highlighted coin.',
    hintKey: 'queen'
  },
  {
    id: 'finish',
    title: 'You Are Ready',
    instruction: 'Play a match, challenge the bot, or keep practicing.',
    hintKey: 'pocket'
  }
];

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export class TutorialController {
  constructor({ sceneRenderer, coachHints, callbacks = {}, storageKey = STORAGE_KEYS.tutorialCompleted } = {}) {
    this.sceneRenderer = sceneRenderer;
    this.coachHints = coachHints;
    this.callbacks = callbacks;
    this.storageKey = storageKey;
    this.active = false;
    this.stepIndex = 0;
    this.queenPocketed = false;
    this.coverPocketed = false;
    this.pocketDrillComplete = false;
    this.scenarioGroup = '';
  }

  start() {
    this.active = true;
    this.stepIndex = 0;
    this.queenPocketed = false;
    this.coverPocketed = false;
    this.pocketDrillComplete = false;
    this.scenarioGroup = '';
    this.applyCurrentScenario();
    this.showCurrentHint();
    this.emitChange();
    return this.getHud();
  }

  exit({ complete = false } = {}) {
    if (complete) {
      this.markCompleted();
    }
    this.active = false;
    this.sceneRenderer?.clearTrainingScenario?.();
    this.coachHints?.clear();
    this.emitChange();
  }

  next() {
    if (!this.active) {
      return this.getHud();
    }
    this.setStep(this.stepIndex + 1);
    return this.getHud();
  }

  setStep(nextIndex) {
    this.stepIndex = Math.min(Math.max(nextIndex, 0), TUTORIAL_STEPS.length - 1);
    this.applyCurrentScenario();
    this.showCurrentHint();
    this.emitChange();
  }

  applyCurrentScenario() {
    if (!this.active) {
      return;
    }

    const step = this.getCurrentStep();
    const group = step.id === 'pocket' ? 'pocket' : step.id === 'queen' ? 'queen' : 'basic';
    if (group === this.scenarioGroup) {
      this.sceneRenderer?.setInputEnabled?.(step.id !== 'board' && step.id !== 'finish');
      return;
    }
    this.scenarioGroup = group;

    if (step.id === 'pocket') {
      this.sceneRenderer?.applyTrainingScenario?.(createPocketDrillScenario());
    } else if (step.id === 'queen') {
      this.queenPocketed = false;
      this.coverPocketed = false;
      this.sceneRenderer?.applyTrainingScenario?.(createQueenCoverDrillScenario());
    } else {
      this.sceneRenderer?.applyTrainingScenario?.(createFreePracticeScenario());
    }

    this.sceneRenderer?.prepareForTurn?.({
      baseline: 'bottom',
      enabled: step.id !== 'board' && step.id !== 'finish',
      silent: true,
      rotateCamera: false
    });
  }

  showCurrentHint() {
    const step = this.getCurrentStep();
    this.coachHints?.show(step.hintKey, { message: step.instruction });
  }

  handlePlacementChanged() {
    this.advanceIfStep('placement');
  }

  handleAimCreated() {
    this.advanceIfStep('aim');
  }

  handlePowerChange(power = {}) {
    if (this.getCurrentStep().id === 'power' && Number(power.ratio) >= 0.32) {
      this.next();
    }
  }

  handleShotReleased() {
    if (this.active && this.getCurrentStep().id === 'shoot') {
      this.coachHints?.show('pocket', { message: 'Good release. Wait for the shot to settle.' });
    }
  }

  handlePiecePocketed(piece) {
    if (!this.active || !piece?.id) {
      return;
    }

    if (this.getCurrentStep().id === 'pocket' && piece.id === TRAINING_PIECES.pocketCoin) {
      this.pocketDrillComplete = true;
      this.next();
      return;
    }

    if (this.getCurrentStep().id === 'queen') {
      if (piece.id === TRAINING_PIECES.queen) {
        this.queenPocketed = true;
        this.coachHints?.show('queen', { message: 'Queen pocketed. Now cover it with the normal coin.', tone: 'warning' });
      }
      if (piece.id === TRAINING_PIECES.coverCoin) {
        this.coverPocketed = true;
      }
      if (this.queenPocketed && this.coverPocketed) {
        this.next();
      }
    }
  }

  handleShotSettled(summary = {}) {
    if (!this.active) {
      return this.getHud();
    }

    const step = this.getCurrentStep();
    const pocketedIds = new Set((summary.pocketed || []).map((piece) => piece.id));
    if (step.id === 'shoot') {
      this.next();
      return this.getHud();
    }
    if (step.id === 'pocket' && pocketedIds.has(TRAINING_PIECES.pocketCoin)) {
      this.pocketDrillComplete = true;
      this.next();
    }
    if (step.id === 'queen') {
      if (pocketedIds.has(TRAINING_PIECES.queen)) {
        this.queenPocketed = true;
      }
      if (pocketedIds.has(TRAINING_PIECES.coverCoin)) {
        this.coverPocketed = true;
      }
      if (this.queenPocketed && this.coverPocketed) {
        this.next();
      }
    }

    return this.getHud();
  }

  advanceIfStep(stepId) {
    if (this.active && this.getCurrentStep().id === stepId) {
      this.next();
    }
  }

  markCompleted() {
    if (canUseStorage()) {
      window.localStorage.setItem(this.storageKey, 'true');
    }
  }

  isCompleted() {
    return canUseStorage() && window.localStorage.getItem(this.storageKey) === 'true';
  }

  getCurrentStep() {
    return TUTORIAL_STEPS[this.stepIndex] || TUTORIAL_STEPS[0];
  }

  getHud() {
    if (!this.active) {
      return {
        tutorialActive: false,
        tutorialTitle: '',
        tutorialInstruction: ''
      };
    }

    const step = this.getCurrentStep();
    return {
      tutorialActive: true,
      tutorialStepId: step.id,
      tutorialStepIndex: this.stepIndex,
      tutorialStepCount: TUTORIAL_STEPS.length,
      tutorialTitle: step.title,
      tutorialInstruction: step.instruction,
      practiceActive: true,
      practiceTitle: 'Tutorial',
      practiceStatus: step.instruction,
      currentTurn: 'Tutorial',
      currentColor: 'Training',
      matchModeLabel: 'Practice / Tutorial',
      ruleModeLabel: step.title,
      playerOneName: 'Tutorial',
      playerTwoName: 'Coach',
      playerOneScore: `${this.stepIndex + 1}/${TUTORIAL_STEPS.length}`,
      playerTwoScore: this.pocketDrillComplete ? 'Pocket done' : 'Learning',
      queenStatus: this.queenPocketed ? 'Queen pocketed' : 'Tutorial',
      turnNumber: 1,
      shotNumber: this.stepIndex + 1,
      shotPower: 'Ready',
      shotPowerRatio: 0,
      foulStatus: 'Training',
      status: step.instruction,
      bannerTone: step.id === 'finish' ? 'success' : 'default'
    };
  }

  emitChange() {
    this.callbacks.onChange?.(this.getHud());
  }
}
