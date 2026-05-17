import { clamp } from '../utils/math.js';

export class AudioManager {
  constructor(saveManager) {
    this.saveManager = saveManager;
    this.context = null;
    this.master = null;
    this.engineOsc = null;
    this.engineGain = null;
    this.ambienceOsc = null;
    this.ambienceGain = null;
    this.enabled = false;
    this.cockpitActive = false;
    this.unlock = this.unlock.bind(this);
    window.addEventListener('pointerdown', this.unlock, { once: true });
    window.addEventListener('keydown', this.unlock, { once: true });
  }

  unlock() {
    if (this.enabled) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.context = new AudioContext();
    this.master = this.context.createGain();
    this.master.connect(this.context.destination);

    this.engineGain = this.context.createGain();
    this.engineGain.gain.value = 0;
    this.engineOsc = this.context.createOscillator();
    this.engineOsc.type = 'sawtooth';
    this.engineOsc.frequency.value = 80;
    this.engineOsc.connect(this.engineGain);
    this.engineGain.connect(this.master);
    this.engineOsc.start();

    this.ambienceGain = this.context.createGain();
    this.ambienceGain.gain.value = 0.02;
    this.ambienceOsc = this.context.createOscillator();
    this.ambienceOsc.type = 'sine';
    this.ambienceOsc.frequency.value = 122;
    this.ambienceOsc.connect(this.ambienceGain);
    this.ambienceGain.connect(this.master);
    this.ambienceOsc.start();

    this.enabled = true;
    this.applyVolumes();
  }

  applyVolumes() {
    if (!this.enabled) return;
    const settings = this.saveManager.settings;
    this.master.gain.setTargetAtTime(settings.masterVolume, this.context.currentTime, 0.05);
    this.ambienceGain.gain.setTargetAtTime(
      0.026 * settings.ambienceVolume,
      this.context.currentTime,
      0.08
    );
  }

  updateEngine(speedRatio, accelerating, drifting, boosting, carConfig = null) {
    if (!this.enabled) return;
    const settings = this.saveManager.settings;
    const now = this.context.currentTime;
    const pitchBias = carConfig?.id === 'supercar'
      ? 1.28
      : carConfig?.id === 'suv' || carConfig?.id === 'offroad-jeep'
        ? 0.82
        : carConfig?.id === 'classic'
          ? 0.72
          : carConfig?.id === 'sports-coupe'
            ? 1.1
            : 0.95;
    const cockpitMix = this.cockpitActive ? 0.88 : 1;
    const cockpitPitch = this.cockpitActive ? 0.94 : 1;
    const engineLevel = (0.018 + clamp(speedRatio, 0, 1) * 0.055 + (accelerating ? 0.02 : 0)) * cockpitMix;
    const pitch = (72 + clamp(speedRatio, 0, 1) * 210 + (boosting ? 80 : 0)) * pitchBias * cockpitPitch;
    this.engineOsc.frequency.setTargetAtTime(pitch, now, 0.06);
    this.engineGain.gain.setTargetAtTime(engineLevel * settings.engineVolume, now, 0.06);

    if (drifting) this.play('drift', 0.16);
  }

  setCockpitActive(active) {
    this.cockpitActive = Boolean(active);
  }

  play(name, intensity = 1) {
    if (!this.enabled) return;
    const now = this.context.currentTime;
    const settings = this.saveManager.settings;
    const gain = this.context.createGain();
    const osc = this.context.createOscillator();
    const tireSounds = ['drift', 'tire', 'skid'];
    const volumeGroup = tireSounds.includes(name) ? settings.tireVolume : settings.uiVolume;
    const interiorScale = this.cockpitActive && tireSounds.includes(name) ? 0.72 : 1;
    const volume = volumeGroup * intensity * interiorScale;
    const presets = {
      coin: [880, 0.08, 'sine'],
      checkpoint: [640, 0.14, 'triangle'],
      complete: [520, 0.34, 'sine'],
      fail: [128, 0.32, 'sawtooth'],
      boost: [260, 0.16, 'square'],
      crash: [92, 0.16, 'sawtooth'],
      drift: [180, 0.08, 'triangle'],
      tuning: [740, 0.12, 'triangle'],
      mastery: [920, 0.18, 'sine'],
      event: [560, 0.18, 'triangle'],
      objective: [780, 0.14, 'sine'],
      pickup: [620, 0.12, 'triangle'],
      click: [420, 0.06, 'sine']
    };
    const [freq, duration, type] = presets[name] ?? presets.click;
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, 0.09 * volume), now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  setMuted(muted) {
    if (!this.enabled) return;
    this.master.gain.setTargetAtTime(muted ? 0 : this.saveManager.settings.masterVolume, this.context.currentTime, 0.05);
  }
}
