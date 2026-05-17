import { CHASE_EVENTS } from '../config.js';

export class ChaseDirector {
  constructor({ role, hud, radio, onEvent }) {
    this.role = role;
    this.hud = hud;
    this.radio = radio;
    this.onEvent = onEvent;
    this.events = CHASE_EVENTS[role].map((event) => ({ ...event, fired: false }));
    this.intensity = 0;
    this.tension = 'Calm';
    this.spawnCooldown = 6;
    this.roadblockCooldown = 10;
    this.recoveryTimer = 0;
  }

  update(input) {
    const context = typeof input === 'number' ? { matchTime: input } : input;
    const matchTime = context.matchTime || 0;
    for (const event of this.events) {
      if (!event.fired && matchTime >= event.at) {
        event.fired = true;
        this.intensity = Math.max(this.intensity, event.intensity);
        this.hud.showEvent(event.message);
        this.radio?.push(event.message, 'Dispatch');
        this.onEvent?.(event);
      }
    }
    if (typeof input !== 'number') this.updateDynamic(context);
    return this.intensity;
  }

  updateDynamic(context) {
    const dt = context.dt || 0;
    this.spawnCooldown = Math.max(0, this.spawnCooldown - dt);
    this.roadblockCooldown = Math.max(0, this.roadblockCooldown - dt);
    this.recoveryTimer = Math.max(0, this.recoveryTimer - dt);

    const hp = context.playerHealthRatio ?? 1;
    const wanted = context.wantedLevel || 0;
    const pressure = context.pressure || 0;
    const activePolice = context.activePolice || 0;
    const timerRatio = context.timerRatio ?? 1;
    const speed = context.playerSpeed || 0;
    const takedowns = context.takedowns || 0;
    const objectiveDistance = context.objectiveDistance ?? 120;
    const difficulty = context.difficulty || { spawnRate: 1, roadblockRate: 1 };
    const modifiers = context.modifiers || { roadblockRate: 1, empPressure: false };

    if (hp < 0.26) this.recoveryTimer = Math.max(this.recoveryTimer, 8);
    const dominance = takedowns >= 4 || speed > 42 || hp > 0.72;
    const score = Math.max(wanted / 5, pressure) + (1 - timerRatio) * 0.55 + (dominance ? 0.22 : 0) + (objectiveDistance < 42 ? 0.18 : 0);
    const previous = this.tension;
    this.tension = score > 0.86 ? 'Critical' : score > 0.62 ? 'Lockdown' : score > 0.28 ? 'Chase' : 'Calm';
    this.intensity = Math.max(this.intensity * 0.995, this.tension === 'Critical' ? 1 : this.tension === 'Lockdown' ? 0.74 : this.tension === 'Chase' ? 0.45 : 0.18);
    if (previous !== this.tension) {
      this.hud.showEvent(`CHASE STATE: ${this.tension.toUpperCase()}`);
    }

    const spawnInterval = (this.tension === 'Critical' ? 8 : this.tension === 'Lockdown' ? 11 : this.tension === 'Chase' ? 15 : 24)
      / Math.max(0.5, difficulty.spawnRate);
    const roadInterval = (this.tension === 'Critical' ? 9 : this.tension === 'Lockdown' ? 13 : this.tension === 'Chase' ? 20 : 30)
      / Math.max(0.5, difficulty.roadblockRate * modifiers.roadblockRate);

    if (this.recoveryTimer <= 0 && this.spawnCooldown <= 0 && activePolice < (this.tension === 'Critical' ? 7 : this.tension === 'Lockdown' ? 6 : 4)) {
      this.spawnCooldown = spawnInterval;
      this.emitDynamic('director-spawn', this.tension === 'Critical' ? 'Elite unit joining pursuit' : 'Pursuit unit rotating in', 0.52);
    }
    if (this.recoveryTimer <= 0 && this.roadblockCooldown <= 0 && this.tension !== 'Calm') {
      this.roadblockCooldown = roadInterval;
      this.emitDynamic('director-roadblock', 'Predicted roadblock moving into position', 0.62);
    }
    if ((this.tension === 'Critical' || modifiers.empPressure) && this.spawnCooldown <= spawnInterval * 0.45) {
      this.emitDynamic('director-elite', modifiers.empPressure ? 'EMP unit hunting the lane' : 'Elite unit tracking pursuit line', 0.82, true);
    }
  }

  emitDynamic(key, message, intensity, once = false) {
    if (once && this.events.some((event) => event.key === key && event.fired)) return;
    this.intensity = Math.max(this.intensity, intensity);
    this.onEvent?.({ key, message, intensity, dynamic: true });
    if (once) this.events.push({ key, fired: true });
  }
}
