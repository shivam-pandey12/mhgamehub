import {
  CAR_TUNING_CAPS,
  TUNING_CATEGORIES,
  createDefaultTuning,
  getUpgradeCost
} from '../../config/tuning.js';

const cloneConfig = (config) => JSON.parse(JSON.stringify(config));

export class TuningManager {
  constructor(saveManager, callbacks = {}) {
    this.saveManager = saveManager;
    this.callbacks = callbacks;
  }

  getTuning(carId) {
    return this.saveManager.getCarTuning(carId);
  }

  getCategoryState(carId, categoryId) {
    const category = TUNING_CATEGORIES.find((item) => item.id === categoryId);
    const tuning = this.getTuning(carId);
    const caps = CAR_TUNING_CAPS[carId] ?? {};
    const level = tuning[categoryId] ?? 0;
    const max = caps[categoryId] ?? 3;
    return {
      category,
      level,
      max,
      cost: getUpgradeCost(level),
      canUpgrade: Boolean(category) && level < max
    };
  }

  upgrade(carId, categoryId) {
    const state = this.getCategoryState(carId, categoryId);
    if (!state.category) return { ok: false, reason: 'Unknown tuning category' };
    if (!state.canUpgrade) return { ok: false, reason: 'Tuning cap reached' };
    if (!this.saveManager.spendCoins(state.cost)) return { ok: false, reason: 'Not enough coins' };
    const tuning = this.getTuning(carId);
    tuning[categoryId] = state.level + 1;
    this.saveManager.setCarTuning(carId, tuning);
    this.callbacks.onUpgrade?.(carId, state.category, tuning[categoryId]);
    return { ok: true, level: tuning[categoryId], cost: state.cost };
  }

  reset(carId) {
    this.saveManager.setCarTuning(carId, createDefaultTuning());
  }

  getEffectiveConfig(config, missionModifier = {}) {
    const effective = cloneConfig(config);
    const tuning = this.getTuning(config.id);
    TUNING_CATEGORIES.forEach((category) => {
      const level = tuning[category.id] ?? 0;
      if (!level) return;
      const multiplier = 1 + category.step * level;
      const key = category.physicsKey;
      effective.physics[key] = Math.max(0.1, effective.physics[key] * multiplier);
      effective.stats[category.stat] = Math.min(100, Math.round(effective.stats[category.stat] + level * 3.6));
    });
    if (missionModifier.accelerationMultiplier) {
      effective.physics.acceleration *= missionModifier.accelerationMultiplier;
    }
    effective.tuning = tuning;
    return effective;
  }
}
