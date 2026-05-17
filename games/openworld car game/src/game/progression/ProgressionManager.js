import { getLicenseForXp, XP_REWARDS } from '../../config/progression.js';

export class ProgressionManager {
  constructor(saveManager, callbacks = {}) {
    this.saveManager = saveManager;
    this.callbacks = callbacks;
  }

  getLicense() {
    return getLicenseForXp(this.saveManager.data.license.xp);
  }

  awardXP(amount, reason = 'Driving XP') {
    const levelUp = this.saveManager.addXP(amount);
    if (levelUp) this.callbacks.onLevelUp?.(levelUp, reason);
    return levelUp;
  }

  awardCleanDistance(distance) {
    const chunks = Math.floor(this.saveManager.data.stats.totalCleanDistance / 500);
    const key = `clean-distance-${chunks}`;
    if (chunks > 0 && !this.saveManager.data.license.levelUpsSeen[key]) {
      this.saveManager.data.license.levelUpsSeen[key] = true;
      return this.awardXP(XP_REWARDS.cleanDrivingChunk, 'Clean driving');
    }
    return null;
  }
}
