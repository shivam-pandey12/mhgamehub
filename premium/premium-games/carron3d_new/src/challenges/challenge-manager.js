import { CHALLENGES, getChallengeById, getNextChallengeId } from './challenge-data.js';
import { ChallengeEvaluator } from './challenge-evaluator.js';
import { ChallengeProgressManager } from './challenge-progress-manager.js';

export class ChallengeManager {
  constructor({ sceneRenderer, callbacks = {} } = {}) {
    this.sceneRenderer = sceneRenderer;
    this.callbacks = callbacks;
    this.evaluator = new ChallengeEvaluator();
    this.progressManager = new ChallengeProgressManager();
    this.active = false;
    this.challenge = null;
    this.tracker = null;
    this.lastResult = null;
  }

  listChallenges() {
    const progress = this.progressManager.getProgress();
    return CHALLENGES.map((challenge) => ({
      ...challenge,
      bestStars: this.progressManager.getBestStars(challenge.id),
      completed: progress.completedChallengeIds.includes(challenge.id)
    }));
  }

  selectChallenge(challengeId) {
    this.active = false;
    this.tracker = null;
    this.lastResult = null;
    this.challenge = getChallengeById(challengeId);
    this.progressManager.setLastPlayed(this.challenge.id);
    this.sceneRenderer?.clearTrainingScenario?.();
    this.emitChange();
    return this.challenge;
  }

  startChallenge(challengeId = '') {
    this.challenge = getChallengeById(challengeId || this.challenge?.id || this.progressManager.getProgress().lastPlayedChallengeId);
    this.tracker = this.evaluator.createTracker(this.challenge);
    this.lastResult = null;
    this.active = true;
    this.progressManager.setLastPlayed(this.challenge.id);
    this.applyBoardSetup();
    this.emitChange();
    return this.getHud();
  }

  retryChallenge() {
    return this.startChallenge(this.challenge?.id);
  }

  nextChallenge() {
    return this.startChallenge(getNextChallengeId(this.challenge?.id));
  }

  exitChallenge() {
    this.active = false;
    this.tracker = null;
    this.lastResult = null;
    this.sceneRenderer?.clearTrainingScenario?.();
    this.emitChange();
  }

  resetProgress() {
    this.lastResult = null;
    this.progressManager.reset();
    this.emitChange();
  }

  applyBoardSetup() {
    const setup = this.challenge?.boardSetup;
    if (!setup) {
      return;
    }
    this.sceneRenderer?.applyTrainingScenario?.(setup);
    this.sceneRenderer?.showTrainingHighlights?.(setup.highlights || []);
    this.sceneRenderer?.prepareForTurn?.({
      baseline: 'bottom',
      enabled: true,
      silent: true,
      rotateCamera: false
    });
  }

  handleShotReleased() {
    if (!this.active || !this.tracker || this.tracker.completed || this.tracker.failed) {
      return;
    }
    this.tracker.shotsUsed += 1;
    this.emitChange();
  }

  handlePiecePocketed(piece) {
    if (!this.active || !this.tracker || this.tracker.completed || this.tracker.failed) {
      return;
    }
    this.evaluator.recordPocketed(this.tracker, piece);
    this.emitChange();
  }

  handleShotSettled(summary = {}) {
    if (!this.active || !this.tracker || !this.challenge) {
      return this.getHud();
    }

    if (this.tracker.completed || this.tracker.failed) {
      return this.getHud();
    }

    this.lastResult = this.evaluator.evaluate(this.challenge, this.tracker, summary);
    if (this.lastResult.completed) {
      this.progressManager.recordResult(this.challenge.id, this.lastResult.stars);
      this.callbacks.onSuccess?.(this.lastResult, this.challenge);
    } else if (this.lastResult.failed) {
      this.callbacks.onFail?.(this.lastResult, this.challenge);
    }

    if (!this.lastResult.completed && !this.lastResult.failed) {
      this.sceneRenderer?.prepareForTurn?.({
        baseline: 'bottom',
        enabled: true,
        silent: true,
        rotateCamera: false
      });
    } else {
      this.sceneRenderer?.setInputEnabled?.(false);
    }

    this.emitChange();
    return this.getHud();
  }

  getPanelModel() {
    return {
      challenges: this.listChallenges(),
      selectedChallengeId: this.challenge?.id || this.progressManager.getProgress().lastPlayedChallengeId || CHALLENGES[0]?.id,
      active: this.active,
      result: this.lastResult,
      progress: this.progressManager.getProgress()
    };
  }

  getHud() {
    if (!this.active || !this.challenge || !this.tracker) {
      return {
        challengeActive: false,
        challengeTitle: '',
        challengeObjective: '',
        challengeShots: '',
        challengeResult: ''
      };
    }

    const resultText = this.lastResult?.message || this.tracker.message || this.challenge.objectiveText;
    const tone = this.lastResult?.completed ? 'success' : this.lastResult?.failed ? 'danger' : 'warning';
    return {
      challengeActive: true,
      challengeTitle: this.challenge.title,
      challengeObjective: this.challenge.objectiveText,
      challengeShots: `${this.tracker.shotsUsed}/${this.challenge.shotLimit}`,
      challengeResult: this.lastResult?.completed
        ? `${this.lastResult.stars} star${this.lastResult.stars === 1 ? '' : 's'}`
        : this.lastResult?.failed ? 'Failed' : 'In progress',
      currentTurn: 'Challenge',
      currentColor: this.challenge.difficulty,
      matchModeLabel: 'Challenge Mode',
      ruleModeLabel: this.challenge.title,
      playerOneName: 'Challenge',
      playerTwoName: this.challenge.difficulty,
      playerOneScore: `${this.tracker.shotsUsed}/${this.challenge.shotLimit}`,
      playerTwoScore: `${this.progressManager.getBestStars(this.challenge.id)} best`,
      playerOnePoints: this.lastResult?.stars || 0,
      playerTwoPoints: this.progressManager.getBestStars(this.challenge.id),
      scoringMode: 'points',
      queenStatus: this.challenge.queenRequired ? 'Queen objective' : 'Solo objective',
      turnNumber: 1,
      shotNumber: this.tracker.shotsUsed,
      foulStatus: this.tracker.strikerPocketed ? 'Foul' : 'Clear',
      shotPower: this.lastResult?.completed || this.lastResult?.failed ? 'Complete' : 'Ready',
      shotPowerRatio: 0,
      status: resultText,
      bannerTone: tone
    };
  }

  emitChange() {
    this.callbacks.onChange?.(this.getPanelModel(), this.getHud());
  }
}
