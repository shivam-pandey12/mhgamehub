import type { GameSettings } from './types';

export type AudioEventName =
  | 'menuHover'
  | 'menuClick'
  | 'menuBack'
  | 'jump'
  | 'land'
  | 'slide'
  | 'dash'
  | 'attack'
  | 'comboHit'
  | 'enemyHit'
  | 'enemyDefeat'
  | 'damage'
  | 'coin'
  | 'energy'
  | 'perfectDodge'
  | 'achievementUnlock'
  | 'gameOver'
  | 'bossIntro'
  | 'rotorLoop'
  | 'missileLaunch'
  | 'explosion'
  | 'bossDamage'
  | 'bossDefeat'
  | 'miniBossSlam'
  | 'specialReady'
  | 'specialCharge'
  | 'specialRelease'
  | 'objectiveComplete'
  | 'routeComplete'
  | 'victory'
  | 'tunnelWhoosh'
  | 'sideTrainPass';

type SampleName = 'jump' | 'punch' | 'running';
type WaveShape = OscillatorType;

const SAMPLE_URLS: Record<SampleName, string> = {
  jump: new URL('../sounds/freesound_community-jump-sound-14839.mp3', import.meta.url).href,
  punch: new URL('../sounds/freesound_community-punch-2-37333.mp3', import.meta.url).href,
  running: new URL('../sounds/freesound_community-running-14658.mp3', import.meta.url).href
};

const SAMPLE_GAIN: Record<SampleName, number> = {
  jump: 0.78,
  punch: 0.74,
  running: 0.28
};

interface ToneRecipe {
  frequency: number;
  endFrequency?: number;
  duration: number;
  gain: number;
  type: WaveShape;
}

export class AudioEvents {
  private context: AudioContext | null = null;
  private unlocked = false;
  private soundVolume = 0.8;
  private muted = false;
  private readonly sampleBuffers = new Map<SampleName, AudioBuffer>();
  private readonly samplePromises = new Map<SampleName, Promise<AudioBuffer | null>>();
  private runningWanted = false;
  private runningSource: AudioBufferSourceNode | null = null;
  private runningGain: GainNode | null = null;

  constructor() {
    window.addEventListener('pointerdown', this.unlock, { once: true, passive: true });
    window.addEventListener('keydown', this.unlock, { once: true });
  }

  setSettings(settings: GameSettings): void {
    this.soundVolume = settings.soundVolume;
    this.muted = settings.mute;
    if (this.runningGain) {
      this.runningGain.gain.value = this.muted ? 0 : SAMPLE_GAIN.running * this.soundVolume;
    }
    if (this.muted || this.soundVolume <= 0.01) {
      this.stopRunningLoop();
    } else if (this.runningWanted) {
      this.startRunningLoop();
    }
  }

  play(name: AudioEventName): void {
    if (this.muted || this.soundVolume <= 0.01) {
      return;
    }

    const context = this.getContext();
    if (!context || !this.unlocked) {
      return;
    }

    const sample = this.getSampleForEvent(name);
    if (sample) {
      this.playSample(sample);
      return;
    }

    const recipe = this.getRecipe(name);
    if (!recipe) {
      return;
    }

    try {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = recipe.type;
      oscillator.frequency.setValueAtTime(recipe.frequency, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        Math.max(1, recipe.endFrequency ?? recipe.frequency),
        context.currentTime + recipe.duration
      );
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(recipe.gain * this.soundVolume, context.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + recipe.duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + recipe.duration + 0.02);
    } catch {
      // Audio is polish only. Browser audio failures should never affect gameplay.
    }
  }

  setRunning(active: boolean): void {
    this.runningWanted = active;
    if (!active || this.muted || this.soundVolume <= 0.01) {
      this.stopRunningLoop();
      return;
    }

    this.startRunningLoop();
  }

  dispose(): void {
    window.removeEventListener('pointerdown', this.unlock);
    window.removeEventListener('keydown', this.unlock);
    this.stopRunningLoop();
    void this.context?.close();
    this.context = null;
  }

  private readonly unlock = (): void => {
    const context = this.getContext();
    if (!context) {
      return;
    }

    void context.resume();
    this.unlocked = true;
    void this.preloadSamples();
    if (this.runningWanted) {
      this.startRunningLoop();
    }
  };

  private playSample(sample: SampleName): void {
    const context = this.getContext();
    if (!context || !this.unlocked) {
      return;
    }

    const buffer = this.sampleBuffers.get(sample);
    if (!buffer) {
      void this.loadSample(sample).then((loaded) => {
        if (loaded && !this.muted && this.soundVolume > 0.01) {
          this.playSample(sample);
        }
      });
      return;
    }

    try {
      const source = context.createBufferSource();
      const gain = context.createGain();
      source.buffer = buffer;
      gain.gain.value = SAMPLE_GAIN[sample] * this.soundVolume;
      source.connect(gain);
      gain.connect(context.destination);
      source.start();
    } catch {
      // File-based audio is polish only.
    }
  }

  private startRunningLoop(): void {
    if (this.runningSource || this.muted || this.soundVolume <= 0.01) {
      return;
    }

    const context = this.getContext();
    if (!context || !this.unlocked) {
      return;
    }

    const buffer = this.sampleBuffers.get('running');
    if (!buffer) {
      void this.loadSample('running').then(() => {
        if (this.runningWanted) {
          this.startRunningLoop();
        }
      });
      return;
    }

    try {
      const source = context.createBufferSource();
      const gain = context.createGain();
      const loopEnd = Math.min(1, buffer.duration);
      source.buffer = buffer;
      source.loop = true;
      source.loopStart = 0;
      source.loopEnd = loopEnd;
      gain.gain.value = SAMPLE_GAIN.running * this.soundVolume;
      source.connect(gain);
      gain.connect(context.destination);
      source.start(0, 0);
      this.runningSource = source;
      this.runningGain = gain;
      source.onended = () => {
        if (this.runningSource === source) {
          this.runningSource = null;
          this.runningGain = null;
        }
      };
    } catch {
      this.runningSource = null;
      this.runningGain = null;
    }
  }

  private stopRunningLoop(): void {
    if (!this.runningSource) {
      this.runningGain = null;
      return;
    }

    try {
      this.runningSource.stop();
    } catch {
      // Already stopped.
    }
    this.runningSource = null;
    this.runningGain = null;
  }

  private preloadSamples(): Promise<Array<AudioBuffer | null>> {
    return Promise.all([this.loadSample('jump'), this.loadSample('punch'), this.loadSample('running')]);
  }

  private loadSample(sample: SampleName): Promise<AudioBuffer | null> {
    const cached = this.sampleBuffers.get(sample);
    if (cached) {
      return Promise.resolve(cached);
    }

    const existing = this.samplePromises.get(sample);
    if (existing) {
      return existing;
    }

    const promise = this.fetchAndDecode(sample);
    this.samplePromises.set(sample, promise);
    return promise;
  }

  private async fetchAndDecode(sample: SampleName): Promise<AudioBuffer | null> {
    const context = this.getContext();
    if (!context) {
      return null;
    }

    try {
      const response = await fetch(SAMPLE_URLS[sample]);
      const arrayBuffer = await response.arrayBuffer();
      const decoded = await context.decodeAudioData(arrayBuffer);
      this.sampleBuffers.set(sample, decoded);
      return decoded;
    } catch {
      return null;
    }
  }

  private getSampleForEvent(name: AudioEventName): SampleName | null {
    if (name === 'jump') {
      return 'jump';
    }
    if (name === 'attack') {
      return 'punch';
    }
    return null;
  }

  private getContext(): AudioContext | null {
    if (this.context) {
      return this.context;
    }

    try {
      const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
      this.context = AudioContextCtor ? new AudioContextCtor() : null;
    } catch {
      this.context = null;
    }

    return this.context;
  }

  private getRecipe(name: AudioEventName): ToneRecipe | null {
    const recipes: Partial<Record<AudioEventName, ToneRecipe>> = {
      menuHover: { frequency: 620, duration: 0.04, gain: 0.025, type: 'sine' },
      menuClick: { frequency: 410, endFrequency: 680, duration: 0.08, gain: 0.04, type: 'triangle' },
      menuBack: { frequency: 360, endFrequency: 220, duration: 0.09, gain: 0.035, type: 'triangle' },
      jump: { frequency: 360, endFrequency: 760, duration: 0.12, gain: 0.045, type: 'triangle' },
      land: { frequency: 180, endFrequency: 90, duration: 0.12, gain: 0.05, type: 'sine' },
      slide: { frequency: 260, endFrequency: 130, duration: 0.16, gain: 0.04, type: 'sawtooth' },
      dash: { frequency: 520, endFrequency: 920, duration: 0.11, gain: 0.045, type: 'sawtooth' },
      attack: { frequency: 460, endFrequency: 840, duration: 0.08, gain: 0.04, type: 'square' },
      comboHit: { frequency: 740, endFrequency: 980, duration: 0.08, gain: 0.04, type: 'triangle' },
      enemyHit: { frequency: 210, endFrequency: 120, duration: 0.08, gain: 0.05, type: 'square' },
      enemyDefeat: { frequency: 320, endFrequency: 80, duration: 0.18, gain: 0.05, type: 'sawtooth' },
      damage: { frequency: 120, endFrequency: 60, duration: 0.18, gain: 0.06, type: 'sawtooth' },
      coin: { frequency: 920, endFrequency: 1320, duration: 0.08, gain: 0.035, type: 'sine' },
      energy: { frequency: 580, endFrequency: 1180, duration: 0.12, gain: 0.035, type: 'triangle' },
      perfectDodge: { frequency: 740, endFrequency: 1480, duration: 0.16, gain: 0.045, type: 'sine' },
      achievementUnlock: { frequency: 520, endFrequency: 1560, duration: 0.22, gain: 0.045, type: 'triangle' },
      gameOver: { frequency: 220, endFrequency: 55, duration: 0.4, gain: 0.055, type: 'sawtooth' },
      bossIntro: { frequency: 90, endFrequency: 180, duration: 0.42, gain: 0.04, type: 'sawtooth' },
      missileLaunch: { frequency: 220, endFrequency: 520, duration: 0.14, gain: 0.045, type: 'sawtooth' },
      explosion: { frequency: 90, endFrequency: 40, duration: 0.22, gain: 0.065, type: 'sawtooth' },
      bossDamage: { frequency: 170, endFrequency: 280, duration: 0.14, gain: 0.055, type: 'square' },
      bossDefeat: { frequency: 180, endFrequency: 42, duration: 0.55, gain: 0.07, type: 'sawtooth' },
      miniBossSlam: { frequency: 130, endFrequency: 65, duration: 0.22, gain: 0.055, type: 'sine' },
      specialReady: { frequency: 680, endFrequency: 1420, duration: 0.2, gain: 0.04, type: 'sine' },
      specialCharge: { frequency: 420, endFrequency: 900, duration: 0.18, gain: 0.035, type: 'triangle' },
      specialRelease: { frequency: 260, endFrequency: 1180, duration: 0.22, gain: 0.055, type: 'sawtooth' },
      objectiveComplete: { frequency: 520, endFrequency: 1240, duration: 0.18, gain: 0.045, type: 'triangle' },
      routeComplete: { frequency: 460, endFrequency: 1320, duration: 0.28, gain: 0.05, type: 'triangle' },
      victory: { frequency: 520, endFrequency: 1560, duration: 0.34, gain: 0.055, type: 'triangle' },
      tunnelWhoosh: { frequency: 220, endFrequency: 520, duration: 0.26, gain: 0.035, type: 'sawtooth' },
      sideTrainPass: { frequency: 180, endFrequency: 360, duration: 0.3, gain: 0.035, type: 'sawtooth' }
    };

    return recipes[name] ?? null;
  }
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
