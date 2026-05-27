import { SOUND_LIBRARY } from './sound-library.js';

const SOUND_ASSETS = {
  shotRelease: {
    url: new URL('../sounds/stiker_hit.mp4', import.meta.url).href,
    gain: 0.88
  },
  collisionSoft: {
    url: new URL('../sounds/collison.mp4', import.meta.url).href,
    gain: 0.52
  },
  collisionHard: {
    url: new URL('../sounds/collison.mp4', import.meta.url).href,
    gain: 0.72
  }
};

export class AudioManager {
  constructor(settings = {}) {
    this.settings = settings;
    this.context = null;
    this.master = null;
    this.unlocked = false;
    this.lastPlayed = new Map();
    this.assetBuffers = new Map();
    this.assetPromises = new Map();
    this.assetFailures = new Set();
    this.boundUnlock = () => this.unlock();
  }

  init() {
    if (typeof window === 'undefined') {
      return;
    }
    window.addEventListener('pointerdown', this.boundUnlock, { once: true, passive: true });
    window.addEventListener('keydown', this.boundUnlock, { once: true });
  }

  updateSettings(settings) {
    this.settings = settings;
    if (this.master) {
      this.master.gain.value = this.settings.sound ? 0.72 : 0;
    }
  }

  unlock() {
    if (this.unlocked || typeof window === 'undefined') {
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      return;
    }

    this.context = this.context || new AudioContext();
    this.master = this.master || this.context.createGain();
    this.master.gain.value = this.settings.sound ? 0.72 : 0;
    this.master.connect(this.context.destination);
    this.context.resume?.();
    this.unlocked = true;
    this.preloadAssets();
  }

  play(name, { intensity = 1, throttle = 0.035 } = {}) {
    if (!this.settings.sound) {
      return;
    }
    this.unlock();
    if (!this.context || !this.master) {
      return;
    }

    const now = this.context.currentTime;
    const last = this.lastPlayed.get(name) ?? -Infinity;
    if (now - last < throttle) {
      return;
    }
    this.lastPlayed.set(name, now);

    if (this.playAsset(name, intensity, now)) {
      return;
    }

    this.loadAsset(name);
    this.playSynth(name, intensity, now);
  }

  preloadAssets() {
    Object.keys(SOUND_ASSETS).forEach((name) => this.loadAsset(name));
  }

  loadAsset(name) {
    const asset = SOUND_ASSETS[name];
    if (!asset || !this.context || this.assetBuffers.has(name) || this.assetFailures.has(name)) {
      return null;
    }

    if (this.assetPromises.has(name)) {
      return this.assetPromises.get(name);
    }

    const promise = fetch(asset.url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Audio asset failed: ${name}`);
        }
        return response.arrayBuffer();
      })
      .then((buffer) => this.context.decodeAudioData(buffer))
      .then((decoded) => {
        this.assetBuffers.set(name, decoded);
        this.assetPromises.delete(name);
        return decoded;
      })
      .catch(() => {
        this.assetFailures.add(name);
        this.assetPromises.delete(name);
        return null;
      });

    this.assetPromises.set(name, promise);
    return promise;
  }

  playAsset(name, intensity, now = this.context?.currentTime || 0) {
    const asset = SOUND_ASSETS[name];
    const buffer = this.assetBuffers.get(name);
    if (!asset || !buffer || !this.context || !this.master) {
      return false;
    }

    const safeIntensity = Math.min(Math.max(intensity, 0.15), 1.8);
    const source = this.context.createBufferSource();
    const gain = this.context.createGain();
    source.buffer = buffer;
    source.playbackRate.setValueAtTime(Math.min(1.08, 0.96 + safeIntensity * 0.04), now);
    gain.gain.setValueAtTime(Math.min(asset.gain * safeIntensity, 1.15), now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.min(buffer.duration, 1.4));
    source.connect(gain);
    gain.connect(this.master);
    source.start(now);
    source.stop(now + buffer.duration);
    return true;
  }

  playSynth(name, intensity, now = this.context?.currentTime || 0) {
    const preset = SOUND_LIBRARY[name] || SOUND_LIBRARY.uiClick;
    const safeIntensity = Math.min(Math.max(intensity, 0.15), 1.8);
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    const filter = this.context.createBiquadFilter();

    oscillator.type = preset.type;
    oscillator.frequency.setValueAtTime(preset.frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(40, preset.frequency + (preset.sweep || 0) * safeIntensity),
      now + preset.duration
    );

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400 + safeIntensity * 900, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(preset.gain * safeIntensity, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + preset.duration);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    oscillator.start(now);
    oscillator.stop(now + preset.duration + 0.025);
  }

  playCollision(intensity) {
    this.play(intensity > 0.62 ? 'collisionHard' : 'collisionSoft', {
      intensity,
      throttle: 0.055
    });
  }

  dispose() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('pointerdown', this.boundUnlock);
      window.removeEventListener('keydown', this.boundUnlock);
    }
    this.context?.close?.();
    this.context = null;
    this.master = null;
    this.assetBuffers.clear();
    this.assetPromises.clear();
    this.assetFailures.clear();
  }
}
