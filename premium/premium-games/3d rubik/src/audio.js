export class MoveAudio {
  constructor(settings = {}) {
    this.context = null;
    this.enabled = settings.sound !== false;
    this.volume = Number.isFinite(settings.volume) ? settings.volume : 0.72;
  }

  updateSettings(settings = {}) {
    this.enabled = settings.sound !== false;
    this.volume = Math.min(1, Math.max(0, Number(settings.volume ?? this.volume)));
  }

  ensureContext() {
    if (!this.enabled) {
      return null;
    }

    if (!this.context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        this.enabled = false;
        return null;
      }

      this.context = new AudioContext();
    }

    if (this.context.state === "suspended") {
      this.context.resume();
    }

    return this.context;
  }

  play({ frequency = 360, endFrequency = 180, duration = 0.09, peakGain = 0.055, type = "triangle" } = {}) {
    const context = this.ensureContext();
    if (!context) {
      return;
    }

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + duration * 0.56);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, peakGain * this.volume), now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.9);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  tick() {
    this.play();
  }

  invalid() {
    this.play({ frequency: 130, endFrequency: 90, duration: 0.12, peakGain: 0.045, type: "sawtooth" });
  }

  success() {
    this.play({ frequency: 420, endFrequency: 720, duration: 0.16, peakGain: 0.06, type: "sine" });
  }

  tap() {
    this.play({ frequency: 280, endFrequency: 210, duration: 0.055, peakGain: 0.032, type: "triangle" });
  }
}
