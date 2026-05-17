const DEFAULT_GUNSHOT_RADIUS = 28;

export class BattlefieldAudioSystem {
  constructor() {
    this.context = null;
    this.ambientTimer = 0;
    this.musicTimer = 0;
    this.playerStepAccumulator = 0;
  }

  update(delta, { enemyCount, matchActive, matchOver, player }) {
    if (!matchActive || matchOver) {
      return;
    }

    this.updateAmbient(delta);
    this.updateMusic(delta, enemyCount);
    this.updatePlayerFootsteps(delta, player);
  }

  playPlayerGunshot({ aiming = false } = {}) {
    const context = this.ensureContext();
    if (!context) {
      return;
    }

    this.playGunshotTone({
      context,
      pan: 0,
      volume: aiming ? 0.052 : 0.06,
    });
  }

  playEnemyGunshot(sourcePosition, listenerPosition) {
    const context = this.ensureContext();
    if (!context) {
      return;
    }

    this.playGunshotTone({
      context,
      pan: calculatePan(sourcePosition, listenerPosition),
      volume: 0.04 * calculateFalloff(sourcePosition, listenerPosition, DEFAULT_GUNSHOT_RADIUS),
    });
  }

  playImpact(sourcePosition, listenerPosition) {
    const context = this.ensureContext();
    if (!context) {
      return;
    }

    const pan = calculatePan(sourcePosition, listenerPosition);
    const impactVolume = 0.018 * calculateFalloff(sourcePosition, listenerPosition, 24);
    const gainNode = this.createOutputGain(
      context,
      impactVolume,
      pan,
    );
    const oscillator = context.createOscillator();
    const filter = context.createBiquadFilter();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(280, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(110, context.currentTime + 0.1);

    filter.type = "highpass";
    filter.frequency.setValueAtTime(120, context.currentTime);

    gainNode.gain.setValueAtTime(0.0001, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(impactVolume, context.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.12);

    oscillator.connect(filter);
    filter.connect(gainNode);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.15);
  }

  playNpcFootstep(sourcePosition, listenerPosition) {
    const context = this.ensureContext();
    if (!context) {
      return;
    }

    this.playFootstepTone({
      context,
      pan: calculatePan(sourcePosition, listenerPosition),
      volume: 0.013 * calculateFalloff(sourcePosition, listenerPosition, 22),
    });
  }

  playScanPulse() {
    const context = this.ensureContext();
    if (!context) {
      return;
    }

    const start = context.currentTime;
    this.playTone({
      context,
      duration: 0.2,
      endFrequency: 820,
      frequency: 420,
      pan: 0,
      type: "triangle",
      volume: 0.018,
      when: start,
    });
    this.playTone({
      context,
      duration: 0.24,
      endFrequency: 960,
      frequency: 560,
      pan: 0,
      type: "sine",
      volume: 0.014,
      when: start + 0.06,
    });
  }

  playReload() {
    const context = this.ensureContext();
    if (!context) {
      return;
    }

    const start = context.currentTime;
    this.playTone({
      context,
      duration: 0.08,
      endFrequency: 300,
      frequency: 460,
      pan: 0,
      type: "square",
      volume: 0.016,
      when: start,
    });
    this.playTone({
      context,
      duration: 0.12,
      endFrequency: 210,
      frequency: 340,
      pan: 0,
      type: "triangle",
      volume: 0.02,
      when: start + 0.16,
    });
  }

  playKnifeSlash() {
    const context = this.ensureContext();
    if (!context) {
      return;
    }

    this.playTone({
      context,
      duration: 0.16,
      endFrequency: 180,
      frequency: 520,
      pan: 0,
      type: "sawtooth",
      volume: 0.024,
      when: context.currentTime,
    });
  }

  playHitConfirm(headshot = false) {
    const context = this.ensureContext();
    if (!context) {
      return;
    }

    const start = context.currentTime;
    this.playTone({
      context,
      duration: 0.06,
      endFrequency: headshot ? 920 : 760,
      frequency: headshot ? 1120 : 920,
      pan: 0,
      type: "square",
      volume: headshot ? 0.024 : 0.018,
      when: start,
    });

    if (headshot) {
      this.playTone({
        context,
        duration: 0.08,
        endFrequency: 720,
        frequency: 920,
        pan: 0,
        type: "triangle",
        volume: 0.016,
        when: start + 0.04,
      });
    }
  }

  updateAmbient(delta) {
    const context = this.ensureContext();
    if (!context) {
      return;
    }

    this.ambientTimer -= delta;
    if (this.ambientTimer > 0) {
      return;
    }

    this.ambientTimer = 3.6 + Math.random() * 2.4;
    const start = context.currentTime;

    this.playTone({
      context,
      duration: 0.9,
      endFrequency: 58,
      frequency: 66,
      pan: 0,
      type: "triangle",
      volume: 0.0038,
      when: start,
    });

    if (Math.random() > 0.45) {
      this.playTone({
        context,
        duration: 0.22,
        endFrequency: 150,
        frequency: 240,
        pan: Math.random() * 1.6 - 0.8,
        type: "sawtooth",
        volume: 0.0052,
        when: start + 0.28,
      });
    }
  }

  updateMusic(delta, enemyCount) {
    const context = this.ensureContext();
    if (!context) {
      return;
    }

    const danger = enemyCount <= 3;
    this.musicTimer -= delta;

    if (this.musicTimer > 0) {
      return;
    }

    this.musicTimer = danger ? 0.78 : 2.3;

    const volume = danger ? 0.012 : 0.005;
    const baseFrequency = danger ? 94 : 74;

    this.playTone({
      context,
      duration: danger ? 0.42 : 0.68,
      endFrequency: baseFrequency * 0.92,
      frequency: baseFrequency,
      pan: 0,
      type: "triangle",
      volume,
      when: context.currentTime,
    });
    this.playTone({
      context,
      duration: danger ? 0.26 : 0.34,
      endFrequency: baseFrequency * 1.5,
      frequency: baseFrequency * 1.7,
      pan: 0,
      type: "sine",
      volume: volume * 0.7,
      when: context.currentTime + 0.16,
    });
  }

  updatePlayerFootsteps(delta, player) {
    if (!player.isGrounded || !player.isLocked || !player.enabled) {
      this.playerStepAccumulator = 0;
      return;
    }

    const speed = player.horizontalSpeed;
    if (speed < 1.2 || player.movementState === "idle") {
      this.playerStepAccumulator = 0;
      return;
    }

    const sprinting = player.movementState === "run";
    this.playerStepAccumulator += speed * delta;
    if (this.playerStepAccumulator < (sprinting ? 1.45 : 2.05)) {
      return;
    }

    this.playerStepAccumulator = 0;
    const context = this.ensureContext();
    if (!context) {
      return;
    }

    this.playFootstepTone({
      context,
      pan: 0,
      sprinting,
      volume: sprinting ? 0.023 : 0.017,
    });
  }

  playGunshotTone({ context, pan, volume }) {
    const start = context.currentTime;

    this.playTone({
      context,
      duration: 0.12,
      endFrequency: 140,
      frequency: 340,
      pan,
      type: "sawtooth",
      volume,
      when: start,
    });
    this.playTone({
      context,
      duration: 0.08,
      endFrequency: 520,
      frequency: 820,
      pan,
      type: "square",
      volume: volume * 0.45,
      when: start,
    });
  }

  playFootstepTone({ context, pan, sprinting = false, volume }) {
    this.playTone({
      context,
      duration: sprinting ? 0.1 : 0.12,
      endFrequency: sprinting ? 62 : 55,
      frequency: sprinting ? 95 : 82,
      pan,
      type: "triangle",
      volume,
      when: context.currentTime,
    });
  }

  playTone({
    context,
    duration,
    endFrequency,
    frequency,
    pan,
    type,
    volume,
    when,
  }) {
    const oscillator = context.createOscillator();
    const output = this.createOutputGain(context, volume, pan);
    const filter = context.createBiquadFilter();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, when);
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, when + duration);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, when);

    output.gain.setValueAtTime(0.0001, when);
    output.gain.exponentialRampToValueAtTime(volume, when + 0.012);
    output.gain.exponentialRampToValueAtTime(0.0001, when + duration);

    oscillator.connect(filter);
    filter.connect(output);
    oscillator.start(when);
    oscillator.stop(when + duration + 0.04);
  }

  createOutputGain(context, volume, pan) {
    const gain = context.createGain();
    const StereoPanner = window.StereoPannerNode;

    if (StereoPanner) {
      const panner = context.createStereoPanner();
      panner.pan.setValueAtTime(pan, context.currentTime);
      gain.connect(panner);
      panner.connect(context.destination);
    } else {
      gain.connect(context.destination);
    }

    gain.gain.setValueAtTime(volume, context.currentTime);
    return gain;
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

function calculateFalloff(sourcePosition, listenerPosition, radius) {
  const dx = sourcePosition.x - listenerPosition.x;
  const dz = sourcePosition.z - listenerPosition.z;
  const distance = Math.hypot(dx, dz);
  return 1 / (1 + distance / radius);
}

function calculatePan(sourcePosition, listenerPosition) {
  return clamp((sourcePosition.x - listenerPosition.x) / 28, -1, 1);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
