import {
  COSMETIC_CATEGORIES,
  COSMETIC_ITEMS,
  DEFAULT_COSMETIC_LOADOUT,
  getCosmeticById,
  getCosmeticsByCategory
} from './cosmetic-data.js';
import { CosmeticStorageManager } from './cosmetic-storage-manager.js';

const BOARD_STYLE_SKIN_BY_ID = {
  ivory: 'board-ivory-royale',
  wood: 'board-tournament-wood',
  midnight: 'board-midnight-gold'
};

function mergeTokens(loadout) {
  const scene = {};
  const vfx = {};

  Object.entries(loadout).forEach(([loadoutKey, itemId]) => {
    if (DEFAULT_COSMETIC_LOADOUT[loadoutKey] === itemId) {
      return;
    }
    const item = getCosmeticById(itemId);
    if (!item) {
      return;
    }
    Object.assign(scene, item.themeTokens?.scene || {});
    Object.assign(vfx, item.themeTokens?.vfx || {});
  });

  return { scene, vfx };
}

export class CosmeticManager {
  constructor({ sceneRenderer, storage = new CosmeticStorageManager() } = {}) {
    this.sceneRenderer = sceneRenderer;
    this.storage = storage;
    this.loadout = this.validateLoadout(this.storage.load());
  }

  getDefaultLoadout() {
    return { ...DEFAULT_COSMETIC_LOADOUT };
  }

  loadLoadout() {
    this.loadout = this.validateLoadout(this.storage.load());
    return { ...this.loadout };
  }

  saveLoadout(loadout) {
    const nextLoadout = this.validateLoadout(loadout);
    this.loadout = nextLoadout;
    this.storage.save(nextLoadout);
    this.applyLoadout(nextLoadout);
    return { ...nextLoadout };
  }

  applyLoadout(loadout = this.loadout, { preview = false } = {}) {
    const nextLoadout = this.validateLoadout(loadout, { allowLocked: preview });
    this.sceneRenderer?.applyCosmeticLoadout?.(nextLoadout, mergeTokens(nextLoadout));
    return { ...nextLoadout };
  }

  applyBoardStyle(boardStyleId = 'ivory') {
    const boardSkin = BOARD_STYLE_SKIN_BY_ID[boardStyleId] || BOARD_STYLE_SKIN_BY_ID.ivory;
    return this.saveLoadout({
      ...this.loadout,
      boardSkin
    });
  }

  selectCosmetic(category, itemId, { preview = false } = {}) {
    const item = this.getCosmeticById(itemId);
    if (!item || item.category !== category) {
      return {
        ok: false,
        message: 'Cosmetic not found.'
      };
    }

    if (item.status === 'comingSoon') {
      return {
        ok: false,
        item,
        message: 'Coming soon.'
      };
    }

    const categoryConfig = COSMETIC_CATEGORIES.find((entry) => entry.id === category);
    const loadoutKey = categoryConfig?.loadoutKey;
    if (!loadoutKey) {
      return {
        ok: false,
        item,
        message: 'Cosmetic category not found.'
      };
    }

    const loadout = {
      ...this.loadout,
      [loadoutKey]: item.id
    };

    if (preview) {
      this.applyLoadout(loadout, { preview: true });
    }

    return {
      ok: true,
      item,
      loadout,
      message: item.status === 'locked'
        ? 'Locked cosmetic - preview only.'
        : `Previewing ${item.name}.`
    };
  }

  resetToDefault() {
    const defaults = this.storage.reset();
    this.loadout = this.validateLoadout(defaults);
    this.applyLoadout(this.loadout);
    return { ...this.loadout };
  }

  getAvailableCosmetics(category) {
    return getCosmeticsByCategory(category).filter((item) => item.status === 'available');
  }

  getCosmeticById(id) {
    return getCosmeticById(id);
  }

  canEquipLoadout(loadout) {
    return Object.values(this.validateLoadout(loadout, { allowLocked: true })).every((itemId) => {
      const item = getCosmeticById(itemId);
      return item?.status === 'available';
    });
  }

  getPanelItems(loadout = this.loadout) {
    return COSMETIC_CATEGORIES.map((category) => {
      const selectedId = loadout[category.loadoutKey];
      const equippedId = this.loadout[category.loadoutKey];
      return {
        ...category,
        selectedId,
        equippedId,
        items: getCosmeticsByCategory(category.id)
      };
    });
  }

  validateLoadout(loadout = {}, { allowLocked = false } = {}) {
    const next = { ...DEFAULT_COSMETIC_LOADOUT };
    COSMETIC_CATEGORIES.forEach((category) => {
      const candidate = getCosmeticById(loadout[category.loadoutKey]);
      if (
        candidate
        && candidate.category === category.id
        && candidate.status !== 'comingSoon'
        && (allowLocked || candidate.status === 'available')
      ) {
        next[category.loadoutKey] = candidate.id;
      }
    });
    return next;
  }

  getLoadoutSummary(loadout = this.loadout) {
    return COSMETIC_CATEGORIES.map((category) => {
      const item = getCosmeticById(loadout[category.loadoutKey]);
      return item ? item.name : 'Default';
    }).join(' / ');
  }
}
