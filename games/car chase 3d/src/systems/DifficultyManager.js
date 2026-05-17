import { DIFFICULTIES } from '../config.js';

const STORAGE_KEY = 'heatline-city-phase4-difficulty';

export class DifficultyManager {
  constructor() {
    this.selectedId = this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return DIFFICULTIES[saved] ? saved : 'standard';
    } catch {
      return 'standard';
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, this.selectedId);
    } catch {
      // Local settings are optional; gameplay continues without persistence.
    }
  }

  set(id) {
    this.selectedId = DIFFICULTIES[id] ? id : 'standard';
    this.save();
  }

  get(id = this.selectedId) {
    return DIFFICULTIES[id] || DIFFICULTIES.standard;
  }

  getAll() {
    return Object.values(DIFFICULTIES);
  }

  getScoreMultiplier(modifierMultiplier = 1) {
    return this.get().scoreMultiplier * modifierMultiplier;
  }
}
