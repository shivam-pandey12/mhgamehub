export class AudioHooks {
  constructor(settings) {
    this.settings = settings;
    this.context = null;
  }

  setEnabled(enabled) {
    this.settings.sound = enabled;
  }

  ensureContext() {
    if (!this.settings.sound) return null;
    if (!this.context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      this.context = new AudioContext();
    }
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
    return this.context;
  }

  tone({ frequency = 440, duration = 0.08, gain = 0.05, type = 'sine', slide = 0 }) {
    const context = this.ensureContext();
    if (!context) return;

    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const now = context.currentTime;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    if (slide) {
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, frequency + slide), now + duration);
    }

    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(gain, now + 0.01);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(envelope);
    envelope.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  click() {
    this.tone({ frequency: 450, duration: 0.045, gain: 0.018, type: 'sine', slide: 40 });
  }

  hit(power) {
    this.tone({ frequency: 150 + power * 170, duration: 0.11, gain: 0.035 + power * 0.045, type: 'triangle', slide: 70 });
  }

  wall(intensity) {
    this.tone({ frequency: 220 + intensity * 80, duration: 0.055, gain: 0.03, type: 'square', slide: -70 });
  }

  obstacle(intensity) {
    this.tone({ frequency: 260 + intensity * 120, duration: 0.07, gain: 0.035, type: 'sawtooth', slide: -95 });
  }

  sand() {
    this.tone({ frequency: 120, duration: 0.06, gain: 0.018, type: 'triangle', slide: -30 });
  }

  boost() {
    this.tone({ frequency: 520, duration: 0.12, gain: 0.035, type: 'sine', slide: 260 });
  }

  wind() {
    this.tone({ frequency: 460, duration: 0.1, gain: 0.022, type: 'sine', slide: 180 });
  }

  bouncePad() {
    this.tone({ frequency: 330, duration: 0.09, gain: 0.04, type: 'triangle', slide: 250 });
  }

  fall() {
    this.tone({ frequency: 240, duration: 0.18, gain: 0.035, type: 'sine', slide: -150 });
  }

  hole() {
    this.tone({ frequency: 620, duration: 0.14, gain: 0.04, type: 'sine', slide: 180 });
  }

  star(index = 0) {
    this.tone({ frequency: 640 + index * 120, duration: 0.08, gain: 0.032, type: 'sine', slide: 70 });
  }

  complete() {
    setTimeout(() => this.tone({ frequency: 540, duration: 0.1, gain: 0.04, type: 'sine', slide: 160 }), 40);
    setTimeout(() => this.tone({ frequency: 780, duration: 0.16, gain: 0.035, type: 'sine', slide: 180 }), 150);
  }

  modeSelect() {
    this.tone({ frequency: 520, duration: 0.07, gain: 0.03, type: 'sine', slide: 90 });
  }

  turnSwitch() {
    this.tone({ frequency: 380, duration: 0.08, gain: 0.028, type: 'triangle', slide: 210 });
  }

  botThinking() {
    this.tone({ frequency: 300, duration: 0.08, gain: 0.018, type: 'sine', slide: 35 });
  }

  achievement() {
    setTimeout(() => this.tone({ frequency: 660, duration: 0.08, gain: 0.035, type: 'sine', slide: 110 }), 20);
    setTimeout(() => this.tone({ frequency: 880, duration: 0.12, gain: 0.032, type: 'sine', slide: 120 }), 130);
  }

  challengeSuccess() {
    this.tone({ frequency: 720, duration: 0.13, gain: 0.038, type: 'triangle', slide: 190 });
  }

  challengeFail() {
    this.tone({ frequency: 210, duration: 0.15, gain: 0.028, type: 'sine', slide: -80 });
  }

  courseComplete() {
    this.complete();
    setTimeout(() => this.tone({ frequency: 960, duration: 0.18, gain: 0.028, type: 'sine', slide: 120 }), 280);
  }

  winner() {
    this.tone({ frequency: 500, duration: 0.12, gain: 0.036, type: 'triangle', slide: 260 });
  }

  newBest() {
    this.tone({ frequency: 740, duration: 0.12, gain: 0.035, type: 'sine', slide: 240 });
  }

  holeInOne() {
    this.tone({ frequency: 820, duration: 0.1, gain: 0.04, type: 'sine', slide: 200 });
    setTimeout(() => this.tone({ frequency: 1120, duration: 0.14, gain: 0.035, type: 'sine', slide: 120 }), 110);
  }
}
