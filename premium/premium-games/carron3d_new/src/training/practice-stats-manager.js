import { STORAGE_KEYS } from '../config/carrom-constants.js';

const DEFAULT_STATS = {
  shotsTaken: 0,
  pocketedCount: 0,
  currentStreak: 0,
  bestStreak: 0,
  drillCompletions: {
    freePractice: 0,
    pocketDrill: 0,
    queenCoverDrill: 0
  }
};

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export class PracticeStatsManager {
  constructor(storageKey = STORAGE_KEYS.practiceStats) {
    this.storageKey = storageKey;
    this.stats = this.load();
  }

  load() {
    if (!canUseStorage()) {
      return this.createDefaultStats();
    }

    try {
      const parsed = JSON.parse(window.localStorage.getItem(this.storageKey) || 'null');
      return {
        ...this.createDefaultStats(),
        ...(parsed || {}),
        drillCompletions: {
          ...DEFAULT_STATS.drillCompletions,
          ...(parsed?.drillCompletions || {})
        }
      };
    } catch {
      return this.createDefaultStats();
    }
  }

  createDefaultStats() {
    return {
      ...DEFAULT_STATS,
      drillCompletions: { ...DEFAULT_STATS.drillCompletions }
    };
  }

  save() {
    if (canUseStorage()) {
      window.localStorage.setItem(this.storageKey, JSON.stringify(this.stats));
    }
  }

  recordShot() {
    this.stats.shotsTaken += 1;
    this.save();
    return this.getStats();
  }

  recordPocket() {
    this.stats.pocketedCount += 1;
    this.stats.currentStreak += 1;
    this.stats.bestStreak = Math.max(this.stats.bestStreak, this.stats.currentStreak);
    this.save();
    return this.getStats();
  }

  resetCurrentStreak() {
    this.stats.currentStreak = 0;
    this.save();
    return this.getStats();
  }

  recordDrillComplete(type) {
    if (!this.stats.drillCompletions[type]) {
      this.stats.drillCompletions[type] = 0;
    }
    this.stats.drillCompletions[type] += 1;
    this.save();
    return this.getStats();
  }

  reset() {
    this.stats = this.createDefaultStats();
    this.save();
    return this.getStats();
  }

  getStats() {
    return {
      ...this.stats,
      drillCompletions: { ...this.stats.drillCompletions }
    };
  }
}
