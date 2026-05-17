const MAX_HEALTH = 100;
const HEAL_AMOUNT = 50;
const HEAL_DURATION = 4.2;
const MAX_HEAL_CHARGES = 2;
const HEAL_COOLDOWN = 10;

export class PlayerHealthSystem {
  constructor({ onDeath, player, ui }) {
    this.onDeath = onDeath;
    this.player = player;
    this.ui = ui;

    this.currentHealth = MAX_HEALTH;
    this.maxHealth = MAX_HEALTH;
    this.remainingHealCharges = MAX_HEAL_CHARGES;
    this.healAmountRemaining = 0;
    this.healCooldownRemaining = 0;
    this.healProgressPulse = 0;
    this.healTimeRemaining = 0;
    this.isAlive = true;

    this.audio = new SurvivalAudio();

    this.handleKeyDown = this.handleKeyDown.bind(this);
    document.addEventListener("keydown", this.handleKeyDown);

    this.syncUi(true);
  }

  handleKeyDown(event) {
    if (event.code !== "KeyH" || event.repeat) {
      return;
    }

    this.tryHeal();
  }

  update(delta) {
    this.healCooldownRemaining = Math.max(0, this.healCooldownRemaining - delta);
    this.updateHealing(delta);
    this.syncUi();
    this.audio.update(this.getLowHealthIntensity(), this.isAlive);
  }

  applyDamage(amount) {
    if (!this.isAlive) {
      return;
    }

    this.currentHealth = Math.max(0, this.currentHealth - amount);
    this.ui.flashDamage(Math.min(1, 0.45 + amount / 18));
    this.ui.setTemporaryStatus("Taking fire.", "alert", 0.9);
    this.ui.setLowHealthIntensity(this.getLowHealthIntensity());
    this.player.applyCameraShake({
      duration: 0.24,
      strength: Math.min(0.03, 0.008 + amount * 0.0013),
    });
    this.audio.playDamage();
    this.syncUi(true);

    if (this.currentHealth === 0) {
      this.isAlive = false;
      this.audio.stopHeartbeat();
      this.onDeath();
    }
  }

  tryHeal() {
    if (!this.isAlive || !this.player.enabled || !this.player.isLocked) {
      return false;
    }

    if (this.currentHealth >= this.maxHealth) {
      this.ui.setTemporaryStatus("Health already full.", "warning", 1.5);
      return false;
    }

    if (this.remainingHealCharges <= 0) {
      this.ui.setTemporaryStatus("No field kits remaining.", "alert", 1.8);
      return false;
    }

    if (this.healCooldownRemaining > 0) {
      if (this.healTimeRemaining > 0) {
        this.ui.setTemporaryStatus(
          `Field kit applying: ${this.healTimeRemaining.toFixed(1)}s`,
          "boost",
          1.1,
        );
        return false;
      }

      this.ui.setTemporaryStatus(
        `Field kit cooling down: ${Math.ceil(this.healCooldownRemaining)}s`,
        "warning",
        1.6,
      );
      return false;
    }

    this.remainingHealCharges -= 1;
    this.healAmountRemaining = HEAL_AMOUNT;
    this.healCooldownRemaining = HEAL_COOLDOWN;
    this.healProgressPulse = 0;
    this.healTimeRemaining = HEAL_DURATION;
    this.ui.flashHeal();
    this.ui.setTemporaryStatus("Applying field kit...", "boost", 1.7);
    this.audio.playHeal();
    this.syncUi();
    return true;
  }

  setDisabled() {
    this.isAlive = false;
    this.audio.stopHeartbeat();
  }

  syncUi(force = false) {
    this.ui.setHealth({
      current: this.currentHealth,
      force,
      max: this.maxHealth,
    });
    this.ui.setHealState({
      cooldownRemaining: this.healCooldownRemaining,
      currentHealth: this.currentHealth,
      healingRemaining: this.healTimeRemaining,
      isHealing: this.healTimeRemaining > 0,
      maxCharges: MAX_HEAL_CHARGES,
      maxHealth: this.maxHealth,
      remainingCharges: this.remainingHealCharges,
    });
    this.ui.setLowHealthIntensity(this.getLowHealthIntensity());
  }

  getLowHealthIntensity() {
    if (this.currentHealth >= 30) {
      return 0;
    }

    return (30 - this.currentHealth) / 30;
  }

  updateHealing(delta) {
    if (this.healTimeRemaining <= 0) {
      return;
    }

    const timeSlice = Math.min(delta, this.healTimeRemaining);
    const healBudget = Math.min(this.healAmountRemaining, (HEAL_AMOUNT / HEAL_DURATION) * timeSlice);
    const applied = Math.min(healBudget, this.maxHealth - this.currentHealth);

    if (applied > 0) {
      this.currentHealth += applied;
      this.ui.setLowHealthIntensity(this.getLowHealthIntensity());
    }

    this.healAmountRemaining = Math.max(0, this.healAmountRemaining - healBudget);
    this.healTimeRemaining = Math.max(0, this.healTimeRemaining - timeSlice);
    this.healProgressPulse += delta;

    if (this.healProgressPulse >= 0.4) {
      this.healProgressPulse = 0;
      this.ui.flashHeal();
    }

    if (this.healTimeRemaining === 0 || this.healAmountRemaining === 0) {
      this.healTimeRemaining = 0;
      this.healAmountRemaining = 0;
      this.ui.setTemporaryStatus("Field kit finished.", "boost", 1.2);
    }
  }
}

class SurvivalAudio {
  constructor() {
    this.context = null;
    this.nextHeartbeatAt = 0;
  }

  update(lowHealthIntensity, isAlive) {
    if (!isAlive || lowHealthIntensity <= 0.04) {
      this.stopHeartbeat();
      return;
    }

    const context = this.ensureContext();
    if (!context) {
      return;
    }

    if (context.currentTime >= this.nextHeartbeatAt) {
      this.playHeartbeat(lowHealthIntensity);
      this.nextHeartbeatAt = context.currentTime + lerp(1.15, 0.72, lowHealthIntensity);
    }
  }

  stopHeartbeat() {
    this.nextHeartbeatAt = 0;
  }

  playDamage() {
    const context = this.ensureContext();
    if (!context) {
      return;
    }

    this.playTone({
      attack: 0.008,
      decay: 0.16,
      endFrequency: 110,
      frequency: 190,
      type: "sawtooth",
      volume: 0.032,
      when: context.currentTime,
    });
  }

  playHeal() {
    const context = this.ensureContext();
    if (!context) {
      return;
    }

    const start = context.currentTime;
    this.playTone({
      attack: 0.018,
      decay: 0.22,
      endFrequency: 510,
      frequency: 340,
      type: "triangle",
      volume: 0.026,
      when: start,
    });
    this.playTone({
      attack: 0.018,
      decay: 0.26,
      endFrequency: 660,
      frequency: 510,
      type: "sine",
      volume: 0.022,
      when: start + 0.08,
    });
  }

  playHeartbeat(intensity) {
    const context = this.ensureContext();
    if (!context) {
      return;
    }

    const baseTime = context.currentTime;
    const volume = lerp(0.015, 0.032, intensity);

    this.playTone({
      attack: 0.008,
      decay: 0.11,
      endFrequency: 42,
      frequency: 58,
      type: "triangle",
      volume,
      when: baseTime,
    });
    this.playTone({
      attack: 0.008,
      decay: 0.095,
      endFrequency: 40,
      frequency: 54,
      type: "triangle",
      volume: volume * 0.8,
      when: baseTime + 0.16,
    });
  }

  playTone({
    attack,
    decay,
    endFrequency,
    frequency,
    type,
    volume,
    when,
  }) {
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    const filter = this.context.createBiquadFilter();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, when);
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, when + decay);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(620, when);

    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(volume, when + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + decay);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(this.context.destination);

    oscillator.start(when);
    oscillator.stop(when + decay + 0.04);
  }

  ensureContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return null;
    }

    if (!this.context) {
      this.context = new AudioContextClass();
    }

    if (this.context.state === "suspended") {
      this.context.resume().catch(() => {});
    }

    return this.context;
  }
}

function lerp(start, end, alpha) {
  return start + (end - start) * alpha;
}
