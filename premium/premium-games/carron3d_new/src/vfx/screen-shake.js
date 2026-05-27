export class ScreenShake {
  constructor({ target }) {
    this.target = target;
    this.time = 0;
    this.power = 0;
    this.reduced = false;
  }

  setReducedEffects(enabled) {
    this.reduced = Boolean(enabled);
  }

  trigger(power = 1, duration = 0.18) {
    if (this.reduced || !this.target) {
      return;
    }
    this.power = Math.min(Math.max(power, 0), 1);
    this.time = duration;
  }

  update(delta) {
    if (!this.target || this.time <= 0) {
      return;
    }
    this.time -= delta;
    const strength = this.power * this.time * 8;
    this.target.style.transform = `translate3d(${Math.sin(this.time * 88) * strength}px, ${Math.cos(this.time * 73) * strength * 0.6}px, 0)`;
    if (this.time <= 0) {
      this.target.style.transform = '';
    }
  }

  clear() {
    this.time = 0;
    if (this.target) {
      this.target.style.transform = '';
    }
  }
}
