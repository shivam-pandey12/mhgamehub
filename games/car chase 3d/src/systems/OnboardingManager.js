import { ONBOARDING_STEPS } from '../config.js';
import { SaveManager } from './SaveManager.js';

const KEY = 'heatline-city-onboarding-v5';

export class OnboardingManager {
  constructor() {
    this.complete = Boolean(SaveManager.readJSON(KEY, { complete: false }).complete);
    this.index = 0;
  }

  shouldShow() {
    return !this.complete;
  }

  current() {
    return {
      ...ONBOARDING_STEPS[this.index],
      index: this.index + 1,
      total: ONBOARDING_STEPS.length,
      isLast: this.index >= ONBOARDING_STEPS.length - 1,
    };
  }

  next() {
    if (this.index < ONBOARDING_STEPS.length - 1) {
      this.index += 1;
      return this.current();
    }
    this.markComplete();
    return null;
  }

  reset() {
    this.complete = false;
    this.index = 0;
    SaveManager.writeJSON(KEY, { complete: false });
  }

  markComplete() {
    this.complete = true;
    SaveManager.writeJSON(KEY, { complete: true });
  }
}
