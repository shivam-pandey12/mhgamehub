export type CombatSoundCue =
  | 'light_hit'
  | 'heavy_hit'
  | 'sword_light'
  | 'sword_heavy'
  | 'special'
  | 'block'
  | 'guard_break'
  | 'dash'
  | 'gun_fire'
  | 'gun_empty'
  | 'reload'
  | 'lightning'
  | 'throw'
  | 'explosion'
  | 'combo'
  | 'finisher'
  | 'victory'
  | 'ko';

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export class CombatSoundController {
  private context: AudioContext | null = null;
  private masterVolume = 1;
  private combatVolume = 1;
  private crowdVolume = 0.7;

  setMix(settings: { masterVolume: number; combatVolume: number; crowdVolume: number }): void {
    this.masterVolume = Math.max(0, Math.min(1, settings.masterVolume / 100));
    this.combatVolume = Math.max(0, Math.min(1, settings.combatVolume / 100));
    this.crowdVolume = Math.max(0, Math.min(1, settings.crowdVolume / 100));
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

  play(cue: CombatSoundCue): void {
    const context = this.getContext();
    if (!context) {
      return;
    }
    if (context.state === 'suspended') {
      void context.resume();
    }

    const now = context.currentTime;
    switch (cue) {
      case 'light_hit':
        this.tone(context, now, 220, 0.045, 'square', 0.025, 0.75);
        this.noise(context, now, 0.035, 0.018);
        break;
      case 'heavy_hit':
        this.tone(context, now, 120, 0.09, 'sawtooth', 0.04, 0.6);
        this.tone(context, now + 0.01, 78, 0.11, 'triangle', 0.03, 0.45);
        this.noise(context, now, 0.06, 0.022);
        break;
      case 'special':
        this.tone(context, now, 300, 0.08, 'triangle', 0.03, 1.15);
        this.tone(context, now + 0.05, 480, 0.11, 'sine', 0.028, 1.1);
        break;
      case 'sword_light':
        this.tone(context, now, 340, 0.05, 'triangle', 0.022, 1.1);
        this.noise(context, now, 0.028, 0.012);
        break;
      case 'sword_heavy':
        this.tone(context, now, 210, 0.08, 'sawtooth', 0.028, 0.82);
        this.tone(context, now + 0.016, 520, 0.05, 'triangle', 0.016, 0.9);
        break;
      case 'block':
        this.tone(context, now, 540, 0.03, 'triangle', 0.018, 0.8);
        this.tone(context, now + 0.015, 760, 0.035, 'sine', 0.012, 0.9);
        break;
      case 'guard_break':
        this.tone(context, now, 180, 0.08, 'square', 0.03, 0.55);
        this.tone(context, now + 0.03, 680, 0.08, 'triangle', 0.028, 0.85);
        this.noise(context, now, 0.05, 0.018);
        break;
      case 'dash':
        this.noise(context, now, 0.05, 0.02);
        this.tone(context, now, 150, 0.05, 'triangle', 0.02, 1.25);
        break;
      case 'gun_fire':
        this.noise(context, now, 0.045, 0.028);
        this.tone(context, now, 90, 0.04, 'square', 0.03, 0.6);
        break;
      case 'gun_empty':
        this.tone(context, now, 820, 0.02, 'square', 0.012, 1.1);
        this.tone(context, now + 0.024, 620, 0.018, 'triangle', 0.01, 0.92);
        break;
      case 'reload':
        this.tone(context, now, 640, 0.03, 'triangle', 0.015, 1);
        this.tone(context, now + 0.06, 520, 0.04, 'triangle', 0.012, 0.85);
        break;
      case 'lightning':
        this.noise(context, now, 0.06, 0.016);
        this.tone(context, now, 680, 0.08, 'triangle', 0.022, 1.25);
        this.tone(context, now + 0.025, 980, 0.06, 'sine', 0.018, 1.08);
        break;
      case 'throw':
        this.tone(context, now, 280, 0.05, 'triangle', 0.02, 0.88);
        this.noise(context, now + 0.01, 0.02, 0.01);
        break;
      case 'explosion':
        this.noise(context, now, 0.09, 0.028);
        this.tone(context, now, 92, 0.12, 'sawtooth', 0.04, 0.5);
        this.tone(context, now + 0.018, 56, 0.15, 'triangle', 0.03, 0.42);
        break;
      case 'combo':
        this.tone(context, now, 520, 0.03, 'triangle', 0.02, 1);
        this.tone(context, now + 0.035, 760, 0.04, 'triangle', 0.018, 1);
        break;
      case 'finisher':
        this.tone(context, now, 160, 0.12, 'sawtooth', 0.04, 0.5);
        this.tone(context, now + 0.05, 420, 0.18, 'triangle', 0.03, 1.2);
        this.noise(context, now + 0.02, 0.08, 0.02);
        break;
      case 'ko':
        this.tone(context, now, 140, 0.16, 'square', 0.035, 0.5);
        this.tone(context, now + 0.06, 92, 0.22, 'triangle', 0.025, 0.42);
        break;
      case 'victory':
        this.tone(context, now, 360, 0.1, 'triangle', 0.026, 1.18);
        this.tone(context, now + 0.08, 520, 0.12, 'triangle', 0.022, 1.1);
        this.tone(context, now + 0.16, 680, 0.16, 'sine', 0.018, 1.02);
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
    endRatio: number,
  ): void {
    const finalVolume = volume * this.masterVolume * this.getCueVolumeMultiplier();
    if (finalVolume <= 0.0001) {
      return;
    }
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(60, frequency * endRatio), startTime + duration);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(finalVolume, startTime + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.03);
  }

  private noise(context: AudioContext, startTime: number, duration: number, volume: number): void {
    const finalVolume = volume * this.masterVolume * this.getCueVolumeMultiplier();
    if (finalVolume <= 0.0001) {
      return;
    }
    const length = Math.max(1, Math.floor(context.sampleRate * duration));
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < length; index += 1) {
      data[index] = (Math.random() * 2 - 1) * (1 - index / length);
    }
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(700, startTime);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(finalVolume, startTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    source.start(startTime);
    source.stop(startTime + duration + 0.02);
  }

  private getCueVolumeMultiplier(): number {
    return Math.max(0, this.combatVolume * 0.85 + this.crowdVolume * 0.15);
  }
}
