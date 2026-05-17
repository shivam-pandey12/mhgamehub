import { MISSION_MODIFIERS } from '../config.js';

const STORAGE_KEY = 'heatline-city-phase4-modifiers';

export class ModifierManager {
  constructor() {
    this.selected = new Set(this.load());
    this.forced = new Set();
  }

  load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(saved) ? saved.filter((id) => MISSION_MODIFIERS[id]) : [];
    } catch {
      return [];
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...this.selected]));
    } catch {
      // Local modifier selection is optional.
    }
  }

  setSelected(ids = []) {
    this.selected = new Set(ids.filter((id) => MISSION_MODIFIERS[id]));
    this.save();
  }

  setForced(ids = []) {
    this.forced = new Set(ids.filter((id) => MISSION_MODIFIERS[id]));
  }

  toggle(id) {
    if (!MISSION_MODIFIERS[id]) return;
    if (this.selected.has(id)) this.selected.delete(id);
    else this.selected.add(id);
    this.save();
  }

  getActiveIds() {
    return [...new Set([...this.selected, ...this.forced])];
  }

  getActive() {
    return this.getActiveIds().map((id) => MISSION_MODIFIERS[id]);
  }

  has(id) {
    return this.getActiveIds().includes(id);
  }

  getMultipliers() {
    return this.getActive().reduce((acc, modifier) => {
      acc.scoreMultiplier *= modifier.scoreMultiplier || 1;
      acc.trafficBonus += modifier.trafficBonus || 0;
      acc.roadblockRate *= modifier.roadblockRate || 1;
      acc.damageTaken *= modifier.damageTaken || 1;
      acc.timerScale *= modifier.timerScale || 1;
      acc.nitroRecharge *= modifier.nitroRecharge || 1;
      acc.cleanRun = acc.cleanRun || Boolean(modifier.cleanRun);
      acc.captainEarly = acc.captainEarly || Boolean(modifier.captainEarly);
      acc.empPressure = acc.empPressure || Boolean(modifier.empPressure);
      return acc;
    }, {
      scoreMultiplier: 1,
      trafficBonus: 0,
      roadblockRate: 1,
      damageTaken: 1,
      timerScale: 1,
      nitroRecharge: 1,
      cleanRun: false,
      captainEarly: false,
      empPressure: false,
    });
  }
}
