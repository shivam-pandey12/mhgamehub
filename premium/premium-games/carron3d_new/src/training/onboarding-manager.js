import { STORAGE_KEYS } from '../config/carrom-constants.js';

export const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to 3D Carrom Royale',
    body: 'Learn smooth striker control, queen cover, and premium carrom flow.'
  },
  {
    id: 'controls',
    title: 'Controls',
    body: 'Place the striker on your baseline, drag back to aim and set power, then release to shoot.'
  },
  {
    id: 'coins',
    title: 'Coins',
    body: 'Classic uses assigned colors. Free Capture lets any normal coin score.'
  },
  {
    id: 'queen',
    title: 'Queen',
    body: 'Pocket the queen and cover it with a valid coin. If cover fails, queen returns.'
  },
  {
    id: 'fouls',
    title: 'Fouls',
    body: 'Pocketing the striker is a foul. A penalty may return one captured or pocketed coin.'
  },
  {
    id: 'start',
    title: 'Ready',
    body: 'Start the tutorial, jump into practice, or skip straight to the setup panel.'
  }
];

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export class OnboardingManager {
  constructor(storageKey = STORAGE_KEYS.onboardingSeen) {
    this.storageKey = storageKey;
    this.visible = false;
    this.stepIndex = 0;
  }

  hasSeen() {
    if (!canUseStorage()) {
      return false;
    }
    return window.localStorage.getItem(this.storageKey) === 'true';
  }

  shouldShow() {
    return !this.hasSeen();
  }

  open() {
    this.visible = true;
    this.stepIndex = 0;
    return this.getViewModel();
  }

  close({ markSeen = true } = {}) {
    this.visible = false;
    if (markSeen) {
      this.markSeen();
    }
    return this.getViewModel();
  }

  next() {
    this.stepIndex = Math.min(this.stepIndex + 1, ONBOARDING_STEPS.length - 1);
    return this.getViewModel();
  }

  previous() {
    this.stepIndex = Math.max(this.stepIndex - 1, 0);
    return this.getViewModel();
  }

  markSeen() {
    if (canUseStorage()) {
      window.localStorage.setItem(this.storageKey, 'true');
    }
  }

  reset() {
    if (canUseStorage()) {
      window.localStorage.removeItem(this.storageKey);
    }
    this.visible = false;
    this.stepIndex = 0;
    return this.getViewModel();
  }

  getViewModel() {
    const step = ONBOARDING_STEPS[this.stepIndex] || ONBOARDING_STEPS[0];
    return {
      visible: this.visible,
      step,
      stepIndex: this.stepIndex,
      stepCount: ONBOARDING_STEPS.length,
      isFirst: this.stepIndex === 0,
      isLast: this.stepIndex === ONBOARDING_STEPS.length - 1
    };
  }
}
