import { playEnergyLowSound } from "../audio/placeholders.js";

export class EnergySystem {
  constructor({
    maxEnergy = 100,
    regenerationRate = 18,
    lowThreshold = 18,
  } = {}) {
    this.maxEnergy = maxEnergy;
    this.energy = maxEnergy;
    this.regenerationRate = regenerationRate;
    this.lowThreshold = lowThreshold;
    this.lowSoundCooldown = 0;
    this.alertPulse = 0;
  }

  update(deltaTime, { regenerationEnabled = true, regenerationMultiplier = 1 } = {}) {
    this.lowSoundCooldown = Math.max(0, this.lowSoundCooldown - deltaTime);
    this.alertPulse = Math.max(0, this.alertPulse - deltaTime * 1.8);

    if (regenerationEnabled) {
      this.energy = Math.min(
        this.maxEnergy,
        this.energy + this.regenerationRate * regenerationMultiplier * deltaTime,
      );
    }
  }

  consume(amount) {
    if (amount <= 0) {
      return true;
    }

    if (this.energy + 1e-6 < amount) {
      this.triggerLowEnergyWarning();
      return false;
    }

    this.energy = Math.max(0, this.energy - amount);

    if (this.energy <= this.lowThreshold) {
      this.triggerLowEnergyWarning();
    }

    return true;
  }

  consumeRate(ratePerSecond, deltaTime) {
    return this.consume(ratePerSecond * deltaTime);
  }

  triggerLowEnergyWarning() {
    this.alertPulse = 1;

    if (this.lowSoundCooldown === 0) {
      playEnergyLowSound();
      this.lowSoundCooldown = 3.4;
    }
  }

  getHudState() {
    return {
      energy: this.energy,
      maxEnergy: this.maxEnergy,
      ratio: this.maxEnergy > 0 ? this.energy / this.maxEnergy : 0,
      isLow: this.energy <= this.lowThreshold,
      pulse: this.alertPulse,
    };
  }

  reset() {
    this.energy = this.maxEnergy;
    this.lowSoundCooldown = 0;
    this.alertPulse = 0;
  }
}
