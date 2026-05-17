import { WANTED_LEVELS } from '../config.js';

export class WantedSystem {
  constructor({ role, hud, radio, onEscalation }) {
    this.role = role;
    this.hud = hud;
    this.radio = radio;
    this.onEscalation = onEscalation;
    this.points = 0;
    this.level = role === 'robber' ? 1 : 0;
    this.pressure = 0;
    this.growthScale = 1;
    this.fired = new Set();
  }

  reset(role) {
    this.role = role;
    this.points = 0;
    this.level = role === 'robber' ? 1 : 0;
    this.pressure = 0;
    this.growthScale = 1;
    this.fired.clear();
  }

  setGrowthScale(scale = 1) {
    this.growthScale = scale;
  }

  add(amount, reason = 'pressure') {
    if (this.role === 'robber') this.points += amount;
    else this.pressure = Math.min(1, this.pressure + amount / 100);
    this.check(reason);
  }

  update(dt, context) {
    if (this.role === 'robber') {
      this.add(dt * 0.85 * this.growthScale, 'time');
      this.points += (context.stats.destroyed || 0) * 0.002;
    } else {
      const distance = context.player && context.robber
        ? context.player.group.position.distanceTo(context.robber.group.position)
        : 100;
      this.pressure += (distance < 38 ? 0.04 : -0.018) * dt;
      this.pressure = Math.max(0, Math.min(1, this.pressure));
    }
    this.check('update');
  }

  check(reason) {
    if (this.role !== 'robber') return;
    for (const config of WANTED_LEVELS) {
      if (this.points >= config.threshold && this.level < config.level) {
        this.level = config.level;
        this.hud.showEvent(config.message);
        this.radio?.push(config.message, 'Dispatch');
        this.fired.add(config.level);
        this.onEscalation?.(config, reason);
      }
    }
  }

  getHudValue() {
    return this.role === 'robber' ? this.level / 5 : this.pressure;
  }
}
