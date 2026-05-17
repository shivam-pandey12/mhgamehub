import { DEFAULT_SETTINGS, PROGRESSION_RULES, SAVE_SCHEMA } from '../config.js';

export class SaveManager {
  static readJSON(key, fallback = {}) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  static writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  static loadProgress(defaultProgress) {
    const phase5 = this.readJSON(SAVE_SCHEMA.key, null);
    const legacy = this.readJSON(PROGRESSION_RULES.storageKey, {});
    const source = phase5?.progress || legacy || {};
    return this.normalizeProgress({ ...defaultProgress, ...source });
  }

  static saveProgress(progress) {
    const envelope = {
      schemaVersion: SAVE_SCHEMA.version,
      savedAt: new Date().toISOString(),
      progress: this.normalizeProgress(progress),
    };
    this.writeJSON(SAVE_SCHEMA.key, envelope);
    this.writeJSON(PROGRESSION_RULES.storageKey, envelope.progress);
  }

  static loadSettings() {
    const phase5 = this.readJSON(SAVE_SCHEMA.key, null);
    const legacy = this.readJSON(SAVE_SCHEMA.legacySettingsKey, {});
    return { ...DEFAULT_SETTINGS, ...(phase5?.settings || legacy || {}) };
  }

  static saveSettings(settings) {
    const current = this.readJSON(SAVE_SCHEMA.key, {});
    this.writeJSON(SAVE_SCHEMA.key, {
      ...current,
      schemaVersion: SAVE_SCHEMA.version,
      savedAt: new Date().toISOString(),
      settings,
    });
    this.writeJSON(SAVE_SCHEMA.legacySettingsKey, settings);
  }

  static normalizeProgress(progress) {
    return {
      schemaVersion: SAVE_SCHEMA.version,
      completedMissions: progress.completedMissions || {},
      bestScores: progress.bestScores || {},
      medals: progress.medals || {},
      bestHighlights: progress.bestHighlights || {},
      cups: progress.cups || {},
      achievements: progress.achievements || {},
      selectedLoadouts: progress.selectedLoadouts || {},
      onboardingComplete: Boolean(progress.onboardingComplete),
      unlocked: [...new Set([...(progress.unlocked || []), ...PROGRESSION_RULES.defaultUnlocked])],
      stats: {
        missionsPlayed: 0,
        robberCompletions: 0,
        policeCompletions: 0,
        policeDestroyed: 0,
        robberDisabled: 0,
        bestSurvivalTime: 0,
        bestScore: 0,
        highestWanted: 0,
        captainDefeats: 0,
        cleanRuns: 0,
        totalCrashes: 0,
        nitroUses: 0,
        empHits: 0,
        minesTriggered: 0,
        highwayWins: 0,
        goldMedals: 0,
        sRanks: 0,
        favoriteVehicle: null,
        ...(progress.stats || {}),
      },
      totals: {
        robberCompletions: 0,
        policeCompletions: 0,
        policeDestroyed: 0,
        robberDisabled: 0,
        captainDefeated: false,
        ...(progress.totals || {}),
      },
    };
  }
}
