export type UISoundCue = 'hover' | 'confirm' | 'purchase' | 'upgrade' | 'reward' | 'deny' | 'navigation';

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export class UISoundController {
  private context: AudioContext | null = null;
  private masterVolume = 1;
  private uiVolume = 1;

  setMix(settings: { masterVolume: number; uiVolume: number }): void {
    this.masterVolume = Math.max(0, Math.min(1, settings.masterVolume / 100));
    this.uiVolume = Math.max(0, Math.min(1, settings.uiVolume / 100));
  }

  suspend(): void {
    if (this.context && this.context.state === 'running') {
      void this.context.suspend();
    }
  }

  resume(): void {
    if (this.context && this.context.state === 'suspended') {
      void this.context.resume();
    }
  }

  play(cue: UISoundCue): void {
    const context = this.getContext();
    if (!context) {
      return;
    }

    if (context.state === 'suspended') {
      void context.resume();
    }

    const now = context.currentTime;
    switch (cue) {
      case 'hover':
        this.tone(context, now, 540, 0.025, 'triangle', 0.018);
        break;
      case 'navigation':
        this.tone(context, now, 420, 0.05, 'triangle', 0.03);
        this.tone(context, now + 0.045, 620, 0.04, 'sine', 0.02);
        break;
      case 'confirm':
        this.tone(context, now, 640, 0.04, 'triangle', 0.035);
        this.tone(context, now + 0.04, 880, 0.05, 'sine', 0.028);
        break;
      case 'purchase':
        this.tone(context, now, 380, 0.06, 'square', 0.03);
        this.tone(context, now + 0.04, 760, 0.08, 'triangle', 0.035);
        break;
      case 'upgrade':
        this.tone(context, now, 460, 0.05, 'triangle', 0.03);
        this.tone(context, now + 0.04, 690, 0.05, 'triangle', 0.028);
        this.tone(context, now + 0.085, 980, 0.07, 'sine', 0.024);
        break;
      case 'reward':
        this.tone(context, now, 520, 0.05, 'sine', 0.035);
        this.tone(context, now + 0.055, 780, 0.05, 'triangle', 0.03);
        this.tone(context, now + 0.11, 1040, 0.08, 'sine', 0.028);
        break;
      case 'deny':
        this.tone(context, now, 220, 0.06, 'sawtooth', 0.025);
        this.tone(context, now + 0.05, 180, 0.08, 'square', 0.018);
        break;
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') {
      return null;
    }
    if (this.context) {
      return this.context;
    }

    const AudioCtor = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioCtor) {
      return null;
    }

    this.context = new AudioCtor();
    return this.context;
  }

  private tone(
    context: AudioContext,
    startTime: number,
    frequency: number,
    duration: number,
    type: OscillatorType,
    volume: number,
  ): void {
    const finalVolume = volume * this.masterVolume * this.uiVolume;
    if (finalVolume <= 0.0001) {
      return;
    }
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(80, frequency * 0.92), startTime + duration);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(finalVolume, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.02);
  }
}
