import { RADIO_LINES } from '../config.js';

export class RadioSystem {
  constructor({ hud, audio }) {
    this.hud = hud;
    this.audio = audio;
    this.queue = [];
    this.cooldown = 0;
    this.log = [];
  }

  reset() {
    this.queue.length = 0;
    this.cooldown = 0;
    this.log.length = 0;
    this.hud.setRadioLog?.([]);
  }

  say(role, key, fallback = '', speaker = null) {
    const bank = RADIO_LINES[role]?.[key] || [];
    const line = bank.length ? bank[Math.floor(Math.random() * bank.length)] : fallback;
    if (!line) return;
    const [autoSpeaker, ...rest] = line.split(':');
    this.queue.push({
      speaker: speaker || (rest.length ? autoSpeaker.trim() : role === 'robber' ? 'Scanner' : 'Dispatch'),
      message: rest.length ? rest.join(':').trim() : line,
    });
  }

  push(message, speaker = 'Dispatch') {
    this.queue.push({ speaker, message });
  }

  update(dt) {
    this.cooldown = Math.max(0, this.cooldown - dt);
    if (this.cooldown > 0 || !this.queue.length) return;
    const item = this.queue.shift();
    this.cooldown = 2.1;
    this.log.unshift(item);
    this.log = this.log.slice(0, 12);
    this.audio.playRadio?.();
    this.hud.pushRadio(`${item.speaker}: ${item.message}`);
    this.hud.setRadioLog?.(this.log);
  }
}
