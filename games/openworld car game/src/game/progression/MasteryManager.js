import { getMasteryForXp, MASTERY_XP } from '../../config/mastery.js';

export class MasteryManager {
  constructor(saveManager, callbacks = {}) {
    this.saveManager = saveManager;
    this.callbacks = callbacks;
    this.distanceBuffer = {};
  }

  getMastery(carId) {
    const data = this.saveManager.getCarMastery(carId);
    return {
      ...data,
      level: getMasteryForXp(data.xp)
    };
  }

  awardDriving(carId, telemetry) {
    if (!carId || !telemetry) return null;
    const clean = telemetry.collisionIntensity < 0.05;
    const distanceXp = telemetry.distanceTravelled * (
      MASTERY_XP.distancePerMeter + (clean ? MASTERY_XP.cleanDistancePerMeter : 0)
    );
    const driftXp = telemetry.driftScore * MASTERY_XP.driftPoint;
    const total = distanceXp + driftXp;
    this.distanceBuffer[carId] = (this.distanceBuffer[carId] ?? 0) + total;
    if (this.distanceBuffer[carId] < 5) return null;
    const awarded = this.distanceBuffer[carId];
    this.distanceBuffer[carId] = 0;
    return this.addXp(carId, awarded, 'driving');
  }

  awardMission(carId, result) {
    if (!carId || !result?.success) return null;
    let amount = MASTERY_XP.missionComplete;
    if (result.medal === 'S') amount += MASTERY_XP.medalS;
    if (result.medal === 'Gold') amount += MASTERY_XP.medalGold;
    if (result.medal === 'Silver') amount += MASTERY_XP.medalSilver;
    if (result.missionType === 'parking') amount += MASTERY_XP.parkingSuccess;
    if (result.missionType === 'delivery' || result.missionType === 'taxi') amount += MASTERY_XP.deliveryTaxiSuccess;
    amount += Math.min(160, Math.round((result.driftScore ?? 0) * 0.03));
    return this.addXp(carId, amount, 'mission');
  }

  addXp(carId, amount, source = 'bonus') {
    const before = this.getMastery(carId).level;
    const data = this.saveManager.addCarMasteryXp(carId, amount);
    const after = getMasteryForXp(data.xp);
    if (before.id !== after.id) {
      this.callbacks.onLevelUp?.(carId, after, source);
    }
    return {
      amount: Math.round(amount),
      level: after,
      totalXp: data.xp
    };
  }
}
