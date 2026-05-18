export class AudioBus {
  constructor() {
    this.enabled = true;
    this.context = null;
    this.lastPlayed = new Map();
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  playSound(kind) {
    const aliases = {
      click: "button",
      warning: "error",
      extraTurn: "extra"
    };
    this.play(aliases[kind] || kind);
  }

  unlock() {
    if (!this.context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.context = new AudioContext();
    }

    if (this.context.state === "suspended") {
      this.context.resume().catch(() => {});
    }
  }

  play(kind) {
    if (!this.enabled) return;
    this.unlock();
    if (!this.context) return;

    const now = performance.now();
    const previous = this.lastPlayed.get(kind) || 0;
    if (now - previous < 55) return;
    this.lastPlayed.set(kind, now);

    const settings = {
      button: [520, 0.035, 0.035],
      dice: [180, 0.08, 0.05],
      step: [360, 0.035, 0.025],
      ladder: [660, 0.16, 0.055],
      snake: [145, 0.18, 0.055],
      victory: [740, 0.28, 0.07],
      extra: [880, 0.12, 0.06],
      error: [120, 0.12, 0.055]
    }[kind] || [400, 0.08, 0.04];

    const [frequency, duration, gainValue] = settings;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = kind === "snake" || kind === "error" ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(40, frequency * (kind === "ladder" || kind === "victory" ? 1.45 : 0.7)),
      this.context.currentTime + duration
    );
    gain.gain.setValueAtTime(gainValue, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(this.context.destination);
    oscillator.start();
    oscillator.stop(this.context.currentTime + duration);
  }
}
