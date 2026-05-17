import { isGradeAtLeast } from './RouteConfig';
import type { Grade, LoadoutState, LocalRecord, RunSummary } from './types';

export function createDefaultRecord(): LocalRecord {
  return {
    bestScore: 0,
    bestDistance: 0,
    bestTime: 0,
    bestGrade: null,
    maxCombo: 1,
    fastestClearTime: null,
    noDamageClear: false,
    enemiesDefeated: 0,
    coinsCollected: 0,
    bossDefeated: false,
    runs: 0
  };
}

export function getBestGrade(current: Grade | null, incoming: Grade): Grade {
  if (!current) {
    return incoming;
  }

  return isGradeAtLeast(incoming, current) ? incoming : current;
}

export function updateRecord(record: LocalRecord, summary: RunSummary, loadout?: LoadoutState): LocalRecord {
  const next: LocalRecord = {
    ...record,
    runs: record.runs + 1,
    bestScore: Math.max(record.bestScore, Math.floor(summary.score)),
    bestDistance: Math.max(record.bestDistance, Math.floor(summary.distance)),
    bestTime: Math.max(record.bestTime, Math.floor(summary.distance)),
    bestGrade: getBestGrade(record.bestGrade, summary.grade),
    maxCombo: Math.max(record.maxCombo, summary.maxCombo),
    noDamageClear: record.noDamageClear || (summary.victory && summary.damageTaken === 0),
    enemiesDefeated: Math.max(record.enemiesDefeated, summary.enemiesDefeated),
    coinsCollected: Math.max(record.coinsCollected, summary.coins),
    bossDefeated: record.bossDefeated || summary.bossDefeated,
    lastLoadout: loadout
  };

  if (summary.victory) {
    const clearTime = Math.max(1, Math.floor(summary.distance / 14.8));
    next.fastestClearTime = record.fastestClearTime === null ? clearTime : Math.min(record.fastestClearTime, clearTime);
  }

  return next;
}

