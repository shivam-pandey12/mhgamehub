import { STORAGE_KEYS } from '../config/carrom-constants.js';
import { DEFAULT_COSMETIC_LOADOUT } from './cosmetic-data.js';

export class CosmeticStorageManager {
  constructor({ storageKey = STORAGE_KEYS.cosmetics } = {}) {
    this.storageKey = storageKey;
  }

  load() {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { ...DEFAULT_COSMETIC_LOADOUT };
    }

    try {
      const raw = window.localStorage.getItem(this.storageKey);
      const parsed = raw ? JSON.parse(raw) : null;
      if (!parsed || typeof parsed !== 'object') {
        return { ...DEFAULT_COSMETIC_LOADOUT };
      }
      return {
        ...DEFAULT_COSMETIC_LOADOUT,
        ...parsed
      };
    } catch {
      return { ...DEFAULT_COSMETIC_LOADOUT };
    }
  }

  save(loadout) {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      window.localStorage.setItem(
        this.storageKey,
        JSON.stringify({
          ...DEFAULT_COSMETIC_LOADOUT,
          ...loadout
        })
      );
    } catch {
      // Cosmetic persistence should never block the game.
    }
  }

  reset() {
    const defaults = { ...DEFAULT_COSMETIC_LOADOUT };
    this.save(defaults);
    return defaults;
  }
}
