const CHESS_SOUND_ASSETS = {
  move: new URL('../sounds/movemnt.mp3', import.meta.url).href,
  capture: new URL('../sounds/capturing.mp3', import.meta.url).href
};

export class ChessAudio {
  constructor() {
    this.context = null;
    this.enabled = false;
    this.activeSamples = new Set();
    this.samplePools = new Map();
  }

  unlock() {
    if (this.enabled) {
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        return;
      }
      this.context = this.context || new AudioContextClass();
      if (this.context.state === 'suspended') {
        this.context.resume();
      }
      this.enabled = true;
      this.preloadSamples();
    } catch {
      this.enabled = false;
    }
  }

  preloadSamples() {
    if (typeof Audio === 'undefined') {
      return;
    }

    Object.values(CHESS_SOUND_ASSETS).forEach((source) => {
      try {
        const pool = [];
        for (let index = 0; index < 4; index += 1) {
          const audio = new Audio(source);
          audio.preload = 'auto';
          audio.load?.();
          pool.push(audio);
        }
        this.samplePools.set(source, pool);
      } catch {
        // Browser audio support can vary inside embeds; oscillator fallback stays available.
      }
    });
  }

  getSampleAudio(source) {
    const pool = this.samplePools.get(source) || [];
    const pooled = pool.find((audio) => !this.activeSamples.has(audio));
    if (pooled) {
      return pooled;
    }
    return new Audio(source);
  }

  playSample(source, { volume = 0.78, maxDuration = null, playbackRate = 1 } = {}) {
    if (!this.enabled) {
      this.unlock();
    }

    if (!this.enabled || typeof Audio === 'undefined' || !source) {
      return false;
    }

    try {
      const audio = this.getSampleAudio(source);
      let stopTimer = null;

      const cleanup = () => {
        if (stopTimer) {
          window.clearTimeout(stopTimer);
          stopTimer = null;
        }
        this.activeSamples.delete(audio);
      };

      audio.pause();
      audio.currentTime = 0;
      audio.preload = 'auto';
      audio.volume = Math.max(0, Math.min(1, volume));
      audio.playbackRate = Math.max(0.5, Math.min(1.6, playbackRate));
      audio.addEventListener('ended', cleanup, { once: true });
      this.activeSamples.add(audio);

      if (Number.isFinite(maxDuration) && maxDuration > 0) {
        stopTimer = window.setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
          cleanup();
        }, maxDuration * 1000);
      }

      const playRequest = audio.play();
      if (playRequest?.catch) {
        playRequest.catch(() => cleanup());
      }
      return true;
    } catch {
      return false;
    }
  }

  pulse({
    frequency,
    duration,
    type = 'sine',
    gain = 0.05,
    attack = 0.01,
    release = 0.12,
    pitch = 1,
    durationScale = 1
  }) {
    if (!this.enabled || !this.context) {
      return;
    }

    const now = this.context.currentTime;
    const effectiveDuration = duration * durationScale;
    const effectiveRelease = release * durationScale;
    const startFrequency = Math.max(60, frequency * pitch);
    const endFrequency = Math.max(50, frequency * 0.82 * pitch);
    const oscillator = this.context.createOscillator();
    const envelope = this.context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(startFrequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + effectiveDuration);

    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(gain, now + attack);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + effectiveDuration + effectiveRelease);

    oscillator.connect(envelope);
    envelope.connect(this.context.destination);

    oscillator.start(now);
    oscillator.stop(now + effectiveDuration + effectiveRelease + 0.02);
  }

  playMove() {
    this.unlock();
    if (this.playSample(CHESS_SOUND_ASSETS.move, { volume: 0.82, maxDuration: 1 })) {
      return;
    }

    this.pulse({ frequency: 520, duration: 0.08, type: 'triangle', gain: 0.035 });
    this.pulse({ frequency: 760, duration: 0.05, type: 'sine', gain: 0.02, attack: 0.006, release: 0.08 });
  }

  playCapture({ pitch = 1, durationScale = 1 } = {}) {
    this.unlock();
    if (this.playSample(CHESS_SOUND_ASSETS.capture, {
      volume: 0.88,
      playbackRate: Math.max(0.82, Math.min(1.18, pitch))
    })) {
      return;
    }

    this.pulse({
      frequency: 240,
      duration: 0.12,
      type: 'sawtooth',
      gain: 0.03,
      attack: 0.006,
      release: 0.1,
      pitch,
      durationScale
    });
    this.pulse({
      frequency: 130,
      duration: 0.14,
      type: 'triangle',
      gain: 0.03,
      attack: 0.008,
      release: 0.12,
      pitch,
      durationScale
    });
  }

  playCheck() {
    this.unlock();
    this.pulse({ frequency: 880, duration: 0.11, type: 'triangle', gain: 0.042, attack: 0.003, release: 0.1 });
    this.pulse({ frequency: 1175, duration: 0.09, type: 'sine', gain: 0.028, attack: 0.003, release: 0.09 });
    this.pulse({ frequency: 1568, duration: 0.08, type: 'triangle', gain: 0.018, attack: 0.002, release: 0.08 });
  }

  playBlocked() {
    this.unlock();
    this.pulse({ frequency: 210, duration: 0.06, type: 'square', gain: 0.018, attack: 0.003, release: 0.06 });
    this.pulse({ frequency: 165, duration: 0.08, type: 'triangle', gain: 0.016, attack: 0.004, release: 0.07 });
  }

  playIntroWhoosh() {
    this.unlock();
    this.pulse({ frequency: 210, duration: 0.22, type: 'sawtooth', gain: 0.02, attack: 0.008, release: 0.12 });
    this.pulse({ frequency: 420, duration: 0.18, type: 'triangle', gain: 0.014, attack: 0.01, release: 0.1 });
  }

  playIntroImpact() {
    this.unlock();
    this.pulse({ frequency: 130, duration: 0.16, type: 'triangle', gain: 0.026, attack: 0.004, release: 0.12 });
    this.pulse({ frequency: 320, duration: 0.11, type: 'sawtooth', gain: 0.018, attack: 0.005, release: 0.1 });
  }

  playCountdownTick() {
    this.unlock();
    this.pulse({ frequency: 960, duration: 0.07, type: 'triangle', gain: 0.028, attack: 0.003, release: 0.07 });
    this.pulse({ frequency: 1280, duration: 0.04, type: 'sine', gain: 0.016, attack: 0.002, release: 0.05 });
  }

  playStartChime() {
    this.unlock();
    this.pulse({ frequency: 620, duration: 0.1, type: 'triangle', gain: 0.024, attack: 0.004, release: 0.08 });
    this.pulse({ frequency: 930, duration: 0.12, type: 'sine', gain: 0.022, attack: 0.004, release: 0.1 });
    this.pulse({ frequency: 1240, duration: 0.16, type: 'triangle', gain: 0.018, attack: 0.005, release: 0.12 });
  }
}
