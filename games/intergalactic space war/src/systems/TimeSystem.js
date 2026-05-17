import { playTimeSlowSound } from "../audio/placeholders.js";

export class TimeSystem {
  constructor({
    slowScale = 0.32,
    playerScale = 0.68,
    energyDrainRate = 28,
    cooldownDuration = 1.15,
  } = {}) {
    this.slowScale = slowScale;
    this.playerScale = playerScale;
    this.energyDrainRate = energyDrainRate;
    this.cooldownDuration = cooldownDuration;
    this.cooldown = 0;
    this.effectAmount = 0;
    this.isActive = false;
    this.activeDuration = 0;
  }

  update(deltaTime, {
    inputController,
    energySystem,
    player,
  } = {}) {
    this.cooldown = Math.max(0, this.cooldown - deltaTime);

    const wantsSlowTime = Boolean(inputController?.isTimeSlowing()) && !player?.isDestroyed;
    let shouldStayActive = false;

    if (wantsSlowTime && this.cooldown === 0) {
      shouldStayActive = energySystem
        ? energySystem.consumeRate(this.energyDrainRate, deltaTime)
        : true;
    }

    if (!this.isActive && shouldStayActive) {
      playTimeSlowSound();
    }

    if (this.isActive && !shouldStayActive && this.activeDuration > 0.08) {
      this.cooldown = Math.max(this.cooldown, this.cooldownDuration);
    }

    this.isActive = shouldStayActive;
    this.activeDuration = this.isActive ? this.activeDuration + deltaTime : 0;

    const targetAmount = this.isActive ? 1 : 0;
    const response = 1 - Math.exp(-7 * deltaTime);
    this.effectAmount += (targetAmount - this.effectAmount) * response;
  }

  getWorldScale() {
    return 1 - (1 - this.slowScale) * this.effectAmount;
  }

  getPlayerScale() {
    return 1 - (1 - this.playerScale) * this.effectAmount;
  }

  getHudState() {
    return {
      active: this.isActive,
      effectAmount: this.effectAmount,
      cooldown: this.cooldown,
      worldScale: this.getWorldScale(),
    };
  }

  reset() {
    this.cooldown = 0;
    this.effectAmount = 0;
    this.isActive = false;
    this.activeDuration = 0;
  }
}
