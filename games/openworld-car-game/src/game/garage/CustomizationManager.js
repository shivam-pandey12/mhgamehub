import {
  ACCENT_OPTIONS,
  BOOST_TRAILS,
  DEFAULT_CUSTOMIZATION,
  PAINT_OPTIONS,
  WHEEL_OPTIONS,
  WINDOW_TINTS,
  getOption
} from '../../config/customization.js';
import { LICENSE_LEVELS } from '../../config/progression.js';

const levelIndex = (id) => Math.max(0, LICENSE_LEVELS.findIndex((level) => level.id === id));

export class CustomizationManager {
  constructor(saveManager) {
    this.saveManager = saveManager;
  }

  isUnlocked(option) {
    return levelIndex(this.saveManager.data.license.levelId) >= levelIndex(option.unlockLevel);
  }

  getOptions() {
    return {
      paints: PAINT_OPTIONS,
      accents: ACCENT_OPTIONS,
      wheels: WHEEL_OPTIONS,
      boostTrails: BOOST_TRAILS,
      tints: WINDOW_TINTS
    };
  }

  getCarCustomization(carId) {
    return this.saveManager.getCustomization(carId);
  }

  apply(carId, patch) {
    const current = this.getCarCustomization(carId);
    const next = { ...current, ...patch };
    this.saveManager.setCustomization(carId, next);
    return next;
  }

  reset(carId) {
    this.saveManager.resetCustomization(carId);
    return { ...DEFAULT_CUSTOMIZATION };
  }

  resolveVisualColors(carConfig, customization = this.getCarCustomization(carConfig.id)) {
    const paint = getOption(PAINT_OPTIONS, customization.paint);
    const accent = getOption(ACCENT_OPTIONS, customization.accent);
    const boostTrail = getOption(BOOST_TRAILS, customization.boostTrail);
    const tint = getOption(WINDOW_TINTS, customization.tint);
    return {
      body: paint.color ?? carConfig.colors.body,
      accent: accent.color ?? carConfig.colors.accent,
      boostTrail: boostTrail.color,
      tintOpacity: tint.opacity
    };
  }
}
