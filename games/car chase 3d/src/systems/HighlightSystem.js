import { PERFORMANCE_LIMITS } from '../config.js';
import { formatTime } from '../utils/math.js';

export class HighlightSystem {
  constructor() {
    this.items = [];
    this.matchTime = 0;
  }

  reset() {
    this.items.length = 0;
    this.matchTime = 0;
  }

  update(dt) {
    this.matchTime += dt;
  }

  record(type, title, detail = '', weight = 1) {
    const item = {
      type,
      title,
      detail,
      weight,
      time: this.matchTime,
      labelTime: formatTime(this.matchTime),
    };
    this.items.push(item);
    this.items.sort((a, b) => b.weight - a.weight || a.time - b.time);
    this.items = this.items.slice(0, PERFORMANCE_LIMITS.highlightCards);
  }

  getHighlights() {
    return [...this.items].sort((a, b) => a.time - b.time);
  }
}
