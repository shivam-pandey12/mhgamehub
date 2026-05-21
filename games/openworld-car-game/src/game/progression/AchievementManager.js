import { ACHIEVEMENTS } from '../../config/achievements.js';

export class AchievementManager {
  constructor(saveManager, callbacks = {}) {
    this.saveManager = saveManager;
    this.callbacks = callbacks;
  }

  evaluate(context = {}) {
    const unlocked = [];
    const data = this.saveManager.data;
    const landmarkCount = Object.keys(data.discoveries.landmarks).length;
    const bestMedals = Object.values(data.medals);
    const missionType = context.missionType ?? context.type;

    const checks = {
      'first-drive': data.stats.totalDistance >= 500,
      'first-delivery': data.stats.deliveriesCompleted >= 1 || missionType === 'delivery',
      'first-drift': data.stats.totalDriftScore >= 500 || missionType === 'drift',
      'first-parking': data.stats.parkingCompleted >= 1 || missionType === 'parking',
      'landmark-hunter': landmarkCount >= 5,
      'clean-driver': data.stats.totalCleanDistance >= 2000,
      'highway-racer': ['highway-blast', 'bridge-ring-run', 'airport-express-sprint'].includes(context.routeId) && ['Gold', 'S'].includes(context.medal),
      'perfect-parking': missionType === 'parking' && ['A', 'S'].includes(context.rank),
      'smooth-taxi': missionType === 'taxi' && (context.comfort ?? 0) >= 80,
      'gold-time-trial': bestMedals.includes('Gold') || bestMedals.includes('S') || ['Gold', 'S'].includes(context.medal),
      'horizon-driver': data.license.levelId === 'horizon'
    };

    ACHIEVEMENTS.forEach((achievement) => {
      if (checks[achievement.id]) {
        const result = this.saveManager.unlockAchievement(achievement.id);
        if (result) {
          unlocked.push(result.achievement);
          this.callbacks.onAchievement?.(result.achievement);
          if (result.levelUp) this.callbacks.onLevelUp?.(result.levelUp, achievement.name);
        }
      }
    });
    return unlocked;
  }
}
