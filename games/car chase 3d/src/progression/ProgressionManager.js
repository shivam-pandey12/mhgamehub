import { PROGRESSION_RULES } from '../config.js';
import { SaveManager } from '../systems/SaveManager.js';

export class ProgressionManager {
  constructor() {
    this.progress = this.load();
  }

  load() {
    return SaveManager.loadProgress(this.defaultProgress());
  }

  save() {
    SaveManager.saveProgress(this.progress);
  }

  defaultProgress() {
    return {
      completedMissions: {},
      bestScores: {},
      medals: {},
      bestHighlights: {},
      cups: {},
      achievements: {},
      selectedLoadouts: {},
      onboardingComplete: false,
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
      },
      totals: {
        robberCompletions: 0,
        policeCompletions: 0,
        policeDestroyed: 0,
        robberDisabled: 0,
        captainDefeated: false,
      },
      unlocked: [...PROGRESSION_RULES.defaultUnlocked],
    };
  }

  reset() {
    this.progress = this.defaultProgress();
    this.save?.();
    return this.progress;
  }

  isUnlocked(vehicleId) {
    return PROGRESSION_RULES.defaultUnlocked.includes(vehicleId) || this.progress.unlocked.includes(vehicleId);
  }

  recordResult({ mission, score, win, stats, key = mission.id, medal = null, highlights = [] }) {
    const unlocks = [];
    if (win) {
      this.progress.completedMissions[mission.id] = true;
      if (mission.baseMissionId) this.progress.completedMissions[mission.baseMissionId] = true;
      if (mission.role === 'robber') this.progress.totals.robberCompletions += 1;
      if (mission.role === 'police') this.progress.totals.policeCompletions += 1;
    }
    this.progress.totals.policeDestroyed += stats.destroyed || 0;
    if (mission.role === 'police' && win) this.progress.totals.robberDisabled += 1;
    if (stats.captainDefeated) this.progress.totals.captainDefeated = true;

    const previous = this.progress.bestScores[key] || this.progress.bestScores[mission.id] || 0;
    if (score.total > previous) {
      this.progress.bestScores[key] = score.total;
      this.progress.bestHighlights[key] = highlights;
    }
    if (medal) this.progress.medals[key] = this.bestMedal(this.progress.medals[key], medal);

    if (this.progress.totals.robberCompletions >= 1) unlocks.push(this.unlock(PROGRESSION_RULES.unlocks.heavyRaider));
    if (this.progress.totals.policeCompletions >= 1) unlocks.push(this.unlock(PROGRESSION_RULES.unlocks.swatCharger));
    if (this.progress.totals.captainDefeated) unlocks.push(this.unlock(PROGRESSION_RULES.unlocks.captainBadge));
    if (win && (mission.id === 'escape-route' || mission.baseMissionId === 'escape-route')) {
      unlocks.push(this.unlock(PROGRESSION_RULES.unlocks.escapeAccent));
      unlocks.push(this.unlock(PROGRESSION_RULES.unlocks.speedDemon));
    }
    if (win && (mission.id === 'police-hunt' || mission.baseMissionId === 'police-hunt')) {
      unlocks.push(this.unlock(PROGRESSION_RULES.unlocks.rapidInterceptor));
    }

    this.save();
    return unlocks.filter(Boolean);
  }

  recordCup(cup, score, medal) {
    if (!cup?.id) return;
    const previous = this.progress.cups[cup.id] || { bestScore: 0, medal: null, completions: 0 };
    const bestScore = Math.max(previous.bestScore || 0, score || 0);
    this.progress.cups[cup.id] = {
      bestScore,
      medal: this.bestMedal(previous.medal, medal || 'Bronze'),
      completions: (previous.completions || 0) + 1,
    };
    this.save();
  }

  mutate(callback) {
    callback?.(this.progress);
    this.save();
  }

  unlock(id) {
    if (!id || this.progress.unlocked.includes(id)) return null;
    this.progress.unlocked.push(id);
    return id;
  }

  getBestScore(missionId) {
    return this.progress.bestScores[missionId] || 0;
  }

  getMedal(key) {
    return this.progress.medals?.[key] || null;
  }

  bestMedal(current, next) {
    const order = ['Bronze', 'Silver', 'Gold', 'Platinum'];
    if (!current) return next;
    return order.indexOf(next) > order.indexOf(current) ? next : current;
  }

  getSnapshot() {
    return typeof structuredClone === 'function'
      ? structuredClone(this.progress)
      : JSON.parse(JSON.stringify(this.progress));
  }
}
