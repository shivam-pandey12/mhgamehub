import { AUDIO_ASSETS } from '../config.js';
import { OptionalAssetLoader } from '../systems/OptionalAssetLoader.js';

export class AudioManager {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.effectsBus = null;
    this.ambienceBus = null;
    this.engineBus = null;
    this.sirenBus = null;
    this.weaponsBus = null;
    this.uiBus = null;
    this.engine = null;
    this.siren = null;
    this.ambience = null;
    this.assets = new OptionalAssetLoader();
    this.samples = {};
    this.pendingSettings = null;
    this.tireTimer = 0;
    this.lowHealthTimer = 0;
    this.collisionTimer = 0;
  }

  ensure() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.8;
    this.master.connect(this.ctx.destination);
    this.effectsBus = this.ctx.createGain();
    this.ambienceBus = this.ctx.createGain();
    this.engineBus = this.ctx.createGain();
    this.sirenBus = this.ctx.createGain();
    this.weaponsBus = this.ctx.createGain();
    this.uiBus = this.ctx.createGain();
    this.effectsBus.gain.value = 0.8;
    this.ambienceBus.gain.value = 0.45;
    this.effectsBus.connect(this.master);
    this.ambienceBus.connect(this.master);
    this.engineBus.connect(this.effectsBus);
    this.sirenBus.connect(this.effectsBus);
    this.weaponsBus.connect(this.effectsBus);
    this.uiBus.connect(this.effectsBus);
    this.createEngine();
    this.createSiren();
    this.createAmbience();
    this.loadOptionalSamples();
    if (this.pendingSettings) this.setSettings(this.pendingSettings);
  }

  resume() {
    this.ensure();
    this.ctx?.resume();
  }

  createEngine() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = 62;
    gain.gain.value = 0;
    osc.connect(gain).connect(this.engineBus);
    osc.start();
    this.engine = { osc, gain };
  }

  createSiren() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 480;
    gain.gain.value = 0;
    osc.connect(gain).connect(this.sirenBus);
    osc.start();
    this.siren = { osc, gain, phase: 0 };
  }

  setSettings(settings) {
    this.pendingSettings = settings;
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.master.gain.setTargetAtTime(settings.masterVolume ?? 0.82, now, 0.08);
    this.effectsBus.gain.setTargetAtTime(settings.soundVolume ?? 0.8, now, 0.08);
    this.ambienceBus.gain.setTargetAtTime(settings.ambienceVolume ?? 0.45, now, 0.08);
    this.engineBus.gain.setTargetAtTime(settings.engineVolume ?? 0.78, now, 0.08);
    this.sirenBus.gain.setTargetAtTime(settings.sirenVolume ?? 0.72, now, 0.08);
    this.weaponsBus.gain.setTargetAtTime(settings.weaponsVolume ?? 0.82, now, 0.08);
    this.uiBus.gain.setTargetAtTime(settings.uiVolume ?? 0.72, now, 0.08);
  }

  createAmbience() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    osc.type = 'triangle';
    osc.frequency.value = 86;
    filter.type = 'lowpass';
    filter.frequency.value = 180;
    gain.gain.value = 0.018;
    osc.connect(filter).connect(gain).connect(this.ambienceBus);
    osc.start();
    this.ambience = { osc, gain };
  }

  update(dt, { speed = 0, nitro = false, sirenIntensity = 0, lowHealth = false, drifting = false } = {}) {
    if (!this.ctx) return;
    this.collisionTimer = Math.max(0, this.collisionTimer - dt);
    const now = this.ctx.currentTime;
    if (this.engine) {
      const speedRatio = Math.min(1, Math.abs(speed) / 54);
      this.engine.osc.frequency.setTargetAtTime(58 + speedRatio * 96 + (nitro ? 26 : 0), now, 0.045);
      this.engine.gain.gain.setTargetAtTime(0.025 + speedRatio * 0.08, now, 0.08);
    }
    if (this.siren) {
      this.siren.phase += dt * 4.4;
      this.siren.osc.frequency.setTargetAtTime(520 + Math.sin(this.siren.phase) * 170, now, 0.05);
      this.siren.gain.gain.setTargetAtTime(0.055 * sirenIntensity, now, 0.08);
    }
    if (lowHealth) {
      this.lowHealthTimer -= dt;
      if (this.lowHealthTimer <= 0) {
        this.lowHealthTimer = 1.25;
        this.beep(780, 0.08, 0.08, 'square');
      }
    }
    if (drifting) {
      this.tireTimer -= dt;
      if (this.tireTimer <= 0) {
        this.tireTimer = 0.11;
        this.noise(0.08, 0.045, 1600);
      }
    } else {
      this.tireTimer = 0;
    }
  }

  playClick() {
    this.playSample('ui') || this.beep(420, 0.045, 0.08, 'triangle', this.uiBus);
  }

  playFire() {
    if (this.playSample('fire')) return;
    this.noise(0.055, 0.1, 900, this.weaponsBus);
    this.beep(170, 0.035, 0.08, 'square', this.weaponsBus);
  }

  playEmp() {
    this.playSample('emp') || this.sweep(920, 160, 0.22, 0.13, 'sawtooth', this.weaponsBus);
  }

  playMine() {
    this.playSample('mine') || this.sweep(130, 48, 0.34, 0.18, 'sawtooth', this.weaponsBus);
  }

  playMineBeep() {
    this.beep(880, 0.05, 0.08, 'square', this.weaponsBus);
  }

  playNitro() {
    this.sweep(190, 440, 0.22, 0.1, 'sawtooth', this.engineBus);
  }

  playExplosion() {
    if (this.playSample('explosion')) return;
    this.noise(0.32, 0.24, 320, this.weaponsBus);
    this.sweep(160, 42, 0.28, 0.16, 'sawtooth', this.weaponsBus);
  }

  playCollision() {
    if (this.collisionTimer > 0) return;
    this.collisionTimer = 0.08;
    this.playSample('collision') || this.noise(0.08, 0.13 + Math.random() * 0.05, 520 + Math.random() * 220, this.weaponsBus);
  }

  playWarning() {
    this.beep(640, 0.08, 0.09, 'square', this.uiBus);
    window.setTimeout(() => this.beep(520, 0.08, 0.08, 'square', this.uiBus), 90);
  }

  playRadio() {
    this.playSample('radio') || this.beep(720, 0.04, 0.055, 'square', this.uiBus);
  }

  playCaptain() {
    this.playSample('captain') || this.sweep(280, 760, 0.32, 0.12, 'sawtooth', this.uiBus);
  }

  playPickup() {
    this.beep(540, 0.055, 0.06, 'triangle', this.uiBus);
    window.setTimeout(() => this.beep(820, 0.06, 0.055, 'triangle', this.uiBus), 55);
  }

  playMissionResult(win) {
    this.playSample(win ? 'success' : 'failure') || this.sweep(win ? 360 : 180, win ? 980 : 70, 0.42, 0.14, 'triangle', this.uiBus);
  }

  playEngineSputter() {
    this.noise(0.075, 0.045, 260, this.engineBus);
  }

  async loadOptionalSamples() {
    for (const [key, url] of Object.entries(AUDIO_ASSETS)) {
      const buffer = await this.assets.loadAudio(url, this.ctx);
      if (buffer) this.samples[key] = buffer;
    }
  }

  playSample(key) {
    if (!this.ctx || !this.samples[key]) return false;
    const source = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();
    source.buffer = this.samples[key];
    gain.gain.value = 0.55;
    const bus = ['engine'].includes(key) ? this.engineBus
      : ['siren'].includes(key) ? this.sirenBus
        : ['fire', 'emp', 'mine', 'explosion', 'collision'].includes(key) ? this.weaponsBus
          : this.uiBus;
    source.connect(gain).connect(bus);
    source.start();
    return true;
  }

  beep(freq, duration, volume, type = 'sine', bus = this.effectsBus) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain).connect(bus);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  sweep(from, to, duration, volume, type = 'sine', bus = this.effectsBus) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), this.ctx.currentTime + duration);
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain).connect(bus);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  noise(duration, volume, filterFreq, bus = this.effectsBus) {
    if (!this.ctx) return;
    const bufferSize = Math.max(1, Math.floor(this.ctx.sampleRate * duration));
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    filter.type = 'lowpass';
    filter.frequency.value = filterFreq;
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    source.buffer = buffer;
    source.connect(filter).connect(gain).connect(bus);
    source.start();
    source.stop(this.ctx.currentTime + duration);
  }
}
