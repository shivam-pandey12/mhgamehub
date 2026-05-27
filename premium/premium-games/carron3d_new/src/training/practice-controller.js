import { getPracticeScenario, getPracticeType } from './training-scenarios.js';

export class PracticeController {
  constructor({ sceneRenderer, statsManager = null, coachHints = null, callbacks = {} } = {}) {
    this.sceneRenderer = sceneRenderer;
    this.statsManager = statsManager;
    this.coachHints = coachHints;
    this.callbacks = callbacks;
    this.active = false;
    this.type = 'freePractice';
    this.scenario = null;
    this.shotsTaken = 0;
    this.pocketedIds = new Set();
    this.bestStreak = 0;
    this.currentStreak = 0;
    this.queenPocketed = false;
    this.coverPocketed = false;
    this.status = 'Choose a practice drill.';
    this.completedThisRun = false;
  }

  start(type = 'freePractice') {
    this.active = true;
    this.type = getPracticeType(type).id;
    this.shotsTaken = 0;
    this.pocketedIds.clear();
    this.currentStreak = 0;
    this.queenPocketed = false;
    this.coverPocketed = false;
    this.completedThisRun = false;
    this.applyScenario();
    this.status = this.scenario.objectiveText;
    this.showHintForType();
    this.emitChange();
    return this.getHud();
  }

  reset() {
    if (!this.active) {
      return this.start(this.type);
    }
    return this.start(this.type);
  }

  next() {
    const order = ['freePractice', 'pocketDrill', 'queenCoverDrill'];
    const nextType = order[(order.indexOf(this.type) + 1) % order.length];
    return this.start(nextType);
  }

  exit() {
    this.active = false;
    this.sceneRenderer?.clearTrainingScenario?.();
    this.coachHints?.clear();
    this.status = 'Practice closed.';
    this.emitChange();
  }

  showHintForType() {
    if (this.type === 'queenCoverDrill') {
      this.coachHints?.show('queen');
    } else if (this.type === 'pocketDrill') {
      this.coachHints?.show('pocket');
    } else {
      this.coachHints?.show('aim');
    }
  }

  applyScenario() {
    this.scenario = getPracticeScenario(this.type);
    this.sceneRenderer?.applyTrainingScenario?.(this.scenario);
    this.sceneRenderer?.showTrainingHighlights?.(this.scenario.highlights || []);
    this.sceneRenderer?.prepareForTurn?.({
      baseline: 'bottom',
      enabled: true,
      silent: true,
      rotateCamera: false
    });
  }

  handleShotReleased() {
    if (!this.active) {
      return;
    }
    this.shotsTaken += 1;
    this.statsManager?.recordShot();
    this.status = 'Practice shot in motion.';
    this.emitChange();
  }

  handlePiecePocketed(piece) {
    if (!this.active || !piece?.id) {
      return;
    }
    this.pocketedIds.add(piece.id);
    if (piece.type === 'queen') {
      this.queenPocketed = true;
      this.status = this.type === 'queenCoverDrill'
        ? 'Queen pocketed. Now cover with the normal coin.'
        : 'Queen pocketed.';
    } else if (piece.type === 'coin') {
      this.coverPocketed = piece.id === this.scenario?.coverPieceId || this.coverPocketed;
      this.currentStreak += 1;
      this.bestStreak = Math.max(this.bestStreak, this.currentStreak);
      this.statsManager?.recordPocket();
      this.status = 'Coin pocketed. Nice control.';
    } else if (piece.type === 'striker') {
      this.currentStreak = 0;
      this.statsManager?.resetCurrentStreak();
      this.coachHints?.show('foul', { tone: 'warning' });
      this.status = 'Striker pocketed. Reset or try the next shot.';
    }
    this.emitChange();
  }

  handleShotSettled(summary = {}) {
    if (!this.active) {
      return this.getHud();
    }

    const pocketedIds = new Set((summary.pocketed || []).map((piece) => piece.id));
    if (!summary.pocketedCount) {
      this.currentStreak = 0;
      this.statsManager?.resetCurrentStreak();
    }

    if (this.type === 'pocketDrill') {
      const targetId = this.scenario?.targetPieceIds?.[0];
      if (pocketedIds.has(targetId)) {
        this.status = 'Pocket drill complete. Try the next setup.';
        this.markComplete();
      } else {
        this.status = 'Missed the target coin. Reset the drill and try again.';
        this.coachHints?.show('pocket');
      }
    } else if (this.type === 'queenCoverDrill') {
      if (pocketedIds.has(this.scenario?.coverPieceId)) {
        this.coverPocketed = true;
      }
      if (this.queenPocketed && this.coverPocketed) {
        this.status = 'Queen covered successfully.';
        this.markComplete();
      } else {
        this.status = this.queenPocketed
          ? 'Queen needs cover. Aim for the normal coin.'
          : 'Pocket the queen first.';
        this.coachHints?.show('queen', { tone: 'warning', message: this.status });
      }
    } else {
      this.status = `Shot settled. Pocketed ${summary.pocketedCount || 0}.`;
    }

    this.emitChange();
    return this.getHud();
  }

  markComplete() {
    if (this.completedThisRun) {
      return;
    }
    this.completedThisRun = true;
    this.statsManager?.recordDrillComplete(this.type);
    this.coachHints?.show('pocket', { tone: 'success', message: 'Drill complete. Use Next Drill when you are ready.' });
  }

  getHud() {
    if (!this.active) {
      return {
        practiceActive: false,
        practiceTitle: '',
        practiceStatus: ''
      };
    }

    const practice = getPracticeType(this.type);
    const stats = this.statsManager?.getStats?.() || {};
    return {
      practiceActive: true,
      tutorialActive: false,
      practiceTitle: practice.label,
      practiceStatus: this.status,
      currentTurn: 'Practice',
      currentColor: 'Training',
      matchModeLabel: 'Practice / Tutorial',
      ruleModeLabel: practice.label,
      playerOneName: 'Practice',
      playerTwoName: 'Training',
      playerOneScore: `${this.pocketedIds.size} pocketed`,
      playerTwoScore: `${Math.max(this.bestStreak, stats.bestStreak || 0)} best streak`,
      queenStatus: this.queenPocketed ? 'Queen pocketed' : 'Practice',
      turnNumber: 1,
      shotNumber: this.shotsTaken,
      shotPower: 'Ready',
      shotPowerRatio: 0,
      foulStatus: 'Practice',
      status: this.status,
      bannerTone: this.status.includes('complete') || this.status.includes('successfully') ? 'success' : 'default'
    };
  }

  emitChange() {
    this.callbacks.onChange?.(this.getHud());
  }
}
