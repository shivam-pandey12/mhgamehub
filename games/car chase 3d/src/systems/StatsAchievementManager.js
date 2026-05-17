import { ACHIEVEMENTS } from '../config.js';

export class StatsAchievementManager {
  record(progress, { mission, score, win, stats, vehicleId, wantedLevel }) {
    const s = progress.stats;
    s.missionsPlayed += 1;
    s.bestScore = Math.max(s.bestScore || 0, score.total || 0);
    s.favoriteVehicle = vehicleId || s.favoriteVehicle;
    s.highestWanted = Math.max(s.highestWanted || 0, wantedLevel || 0);
    s.policeDestroyed += stats.destroyed || 0;
    s.totalCrashes += (stats.trafficHits || 0) + (stats.propHits || 0);
    s.empHits += stats.abilityHits || 0;
    s.minesTriggered += stats.abilityHits || 0;
    s.nitroUses += stats.nitroUses || 0;
    if (mission.role === 'robber' && win) s.robberCompletions += 1;
    if (mission.role === 'police' && win) {
      s.policeCompletions += 1;
      s.robberDisabled += 1;
    }
    if (stats.captainDefeated) s.captainDefeats += 1;
    if (win && (stats.trafficHits || 0) + (stats.propHits || 0) <= 1) s.cleanRuns += 1;
    if (win && mission.districtId === 'highway') s.highwayWins += 1;
    if (['Gold', 'Platinum'].includes(score.medal)) s.goldMedals += 1;
    if (score.rank === 'S') s.sRanks += 1;
    if (mission.role === 'robber') {
      s.bestSurvivalTime = Math.max(s.bestSurvivalTime || 0, (mission.duration || 0) - (stats.remainingTime || 0));
    }
    return this.evaluate(progress);
  }

  evaluate(progress) {
    const unlocked = [];
    progress.achievements ||= {};
    for (const achievement of ACHIEVEMENTS) {
      const value = progress.stats?.[achievement.stat] || 0;
      if (value >= achievement.target && !progress.achievements[achievement.id]) {
        progress.achievements[achievement.id] = {
          unlockedAt: Date.now(),
          value,
        };
        unlocked.push(achievement);
      }
    }
    return unlocked;
  }

  getCards(progress) {
    return ACHIEVEMENTS.map((achievement) => {
      const value = progress.stats?.[achievement.stat] || 0;
      return {
        ...achievement,
        value,
        ratio: Math.min(1, value / achievement.target),
        unlocked: Boolean(progress.achievements?.[achievement.id]),
      };
    });
  }
}
