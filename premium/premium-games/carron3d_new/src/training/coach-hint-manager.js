export const COACH_HINTS = {
  place: 'Drag the striker along the highlighted baseline before aiming.',
  aim: 'Pull back from the striker. The aim line shows where the striker will travel.',
  power: 'Pull farther to increase power, then release when the meter feels right.',
  pocket: 'Try aiming through the coin toward the highlighted pocket.',
  queen: 'Pocket the queen, then cover it with a normal coin.',
  foul: 'Too much direct power near a corner can pocket the striker.',
  freeCapture: 'In Free Capture, any normal coin gives points.'
};

export class CoachHintManager {
  constructor() {
    this.visible = false;
    this.message = '';
    this.tone = 'default';
    this.dismissedKeys = new Set();
    this.activeKey = '';
  }

  show(key, overrides = {}) {
    if (this.dismissedKeys.has(key)) {
      return this.getViewModel();
    }

    this.activeKey = key;
    this.message = overrides.message || COACH_HINTS[key] || key;
    this.tone = overrides.tone || 'default';
    this.visible = Boolean(this.message);
    return this.getViewModel();
  }

  dismiss() {
    if (this.activeKey) {
      this.dismissedKeys.add(this.activeKey);
    }
    this.visible = false;
    return this.getViewModel();
  }

  clear() {
    this.visible = false;
    this.activeKey = '';
    this.message = '';
    this.tone = 'default';
    return this.getViewModel();
  }

  resetDismissed() {
    this.dismissedKeys.clear();
    return this.clear();
  }

  getViewModel() {
    return {
      visible: this.visible,
      key: this.activeKey,
      message: this.message,
      tone: this.tone
    };
  }
}
