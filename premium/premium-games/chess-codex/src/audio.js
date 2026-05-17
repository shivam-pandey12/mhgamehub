export class ChessAudio {
  constructor() {
    this.context = null;
    this.enabled = false;
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
    } catch {
      this.enabled = false;
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
    this.pulse({ frequency: 520, duration: 0.08, type: 'triangle', gain: 0.035 });
    this.pulse({ frequency: 760, duration: 0.05, type: 'sine', gain: 0.02, attack: 0.006, release: 0.08 });
  }

  playCapture({ pitch = 1, durationScale = 1 } = {}) {
    this.unlock();
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
