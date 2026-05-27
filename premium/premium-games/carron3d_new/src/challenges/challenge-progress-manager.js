import { STORAGE_KEYS } from '../config/carrom-constants.js';

const DEFAULT_PROGRESS = {
  bestStarsByChallengeId: {},
  completedChallengeIds: [],
  lastPlayedChallengeId: ''
};

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export class ChallengeProgressManager {
  constructor(storageKey = STORAGE_KEYS.challengeProgress) {
    this.storageKey = storageKey;
    this.progress = this.load();
  }

  load() {
    if (!canUseStorage()) {
      return { ...DEFAULT_PROGRESS };
    }

    try {
      const parsed = JSON.parse(window.localStorage.getItem(this.storageKey) || 'null');
      return {
        ...DEFAULT_PROGRESS,
        ...(parsed || {}),
        bestStarsByChallengeId: parsed?.bestStarsByChallengeId || {},
        completedChallengeIds: Array.isArray(parsed?.completedChallengeIds) ? parsed.completedChallengeIds : []
      };
    } catch {
      return { ...DEFAULT_PROGRESS };
    }
  }

  save() {
    if (!canUseStorage()) {
      return;
    }
    window.localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
  }

  recordResult(challengeId, stars) {
    const currentBest = Number(this.progress.bestStarsByChallengeId[challengeId]) || 0;
    const nextStars = Math.max(currentBest, Number(stars) || 0);
    this.progress.bestStarsByChallengeId[challengeId] = nextStars;
    this.progress.lastPlayedChallengeId = challengeId;
    if (nextStars > 0 && !this.progress.completedChallengeIds.includes(challengeId)) {
      this.progress.completedChallengeIds.push(challengeId);
    }
    this.save();
    return this.getProgress();
  }

  setLastPlayed(challengeId) {
    this.progress.lastPlayedChallengeId = challengeId || '';
    this.save();
  }

  getBestStars(challengeId) {
    return Number(this.progress.bestStarsByChallengeId[challengeId]) || 0;
  }

  getProgress() {
    return {
      bestStarsByChallengeId: { ...this.progress.bestStarsByChallengeId },
      completedChallengeIds: [...this.progress.completedChallengeIds],
      lastPlayedChallengeId: this.progress.lastPlayedChallengeId || ''
    };
  }

  reset() {
    this.progress = { ...DEFAULT_PROGRESS, bestStarsByChallengeId: {}, completedChallengeIds: [] };
    this.save();
    return this.getProgress();
  }
}
