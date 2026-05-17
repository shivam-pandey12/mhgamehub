export class ShieldSystem {
  constructor({
    sustainDrainRate = 21,
    impactEnergyCostMultiplier = 1.4,
    damageReduction = 0.72,
    cooldownDuration = 0.9,
  } = {}) {
    this.sustainDrainRate = sustainDrainRate;
    this.impactEnergyCostMultiplier = impactEnergyCostMultiplier;
    this.damageReduction = damageReduction;
    this.cooldownDuration = cooldownDuration;
    this.cooldown = 0;
    this.isActive = false;
    this.fieldAmount = 0;
    this.impactAmount = 0;
  }

  update(deltaTime, {
    inputController,
    energySystem,
    player,
  } = {}) {
    this.cooldown = Math.max(0, this.cooldown - deltaTime);
    this.impactAmount = Math.max(0, this.impactAmount - deltaTime * 3.4);

    const wantsShield = Boolean(inputController?.isShielding()) && !player?.isDestroyed;
    const canHold = wantsShield
      && this.cooldown === 0
      && (!energySystem || energySystem.consumeRate(this.sustainDrainRate, deltaTime));

    if (this.isActive && !canHold) {
      this.cooldown = Math.max(this.cooldown, this.cooldownDuration);
    }

    this.isActive = canHold;
    const targetField = this.isActive ? 1 : 0;
    this.fieldAmount += (targetField - this.fieldAmount) * (1 - Math.exp(-8 * deltaTime));
  }

  absorbDamage(amount, energySystem) {
    if (!this.isActive || amount <= 0) {
      return amount;
    }

    const impactCost = amount * this.impactEnergyCostMultiplier;

    if (energySystem && !energySystem.consume(impactCost)) {
      this.breakShield();
      return amount;
    }

    this.impactAmount = 1;
    return amount * (1 - this.damageReduction);
  }

  breakShield() {
    this.isActive = false;
    this.cooldown = Math.max(this.cooldown, this.cooldownDuration);
    this.impactAmount = 0.35;
  }

  getVisualAmount() {
    return this.fieldAmount;
  }

  getImpactAmount() {
    return this.impactAmount;
  }

  getHudState() {
    return {
      active: this.isActive,
      cooldown: this.cooldown,
      strength: this.fieldAmount,
    };
  }

  reset() {
    this.cooldown = 0;
    this.isActive = false;
    this.fieldAmount = 0;
    this.impactAmount = 0;
  }
}
