import {
  COSMETIC_CATEGORIES,
  COSMETIC_RARITY_LABELS,
  COSMETIC_STATUS_LABELS,
  getCosmeticById
} from './cosmetic-data.js';

export class CosmeticPreviewController {
  constructor({ cosmeticManager }) {
    this.cosmeticManager = cosmeticManager;
    this.activeCategory = 'board';
    this.previewLoadout = this.cosmeticManager?.loadout || {};
    this.originalLoadout = this.cosmeticManager?.loadout || {};
    this.focusedItemId = null;
    this.isOpen = false;
    this.message = 'Select a cosmetic to preview it on the live 3D table.';
    this.tone = 'default';
  }

  open() {
    this.isOpen = true;
    this.originalLoadout = { ...this.cosmeticManager.loadout };
    this.previewLoadout = { ...this.originalLoadout };
    this.focusedItemId = null;
    this.message = 'Select a cosmetic to preview it on the live 3D table.';
    this.tone = 'default';
    this.cosmeticManager.applyLoadout(this.previewLoadout, { preview: true });
    return this.getModel();
  }

  setCategory(category) {
    if (COSMETIC_CATEGORIES.some((entry) => entry.id === category)) {
      this.activeCategory = category;
      this.focusedItemId = null;
    }
    return this.getModel();
  }

  preview(category, itemId) {
    this.setCategory(category);
    const item = getCosmeticById(itemId);
    if (!item) {
      this.message = 'Cosmetic not found.';
      this.tone = 'danger';
      return this.getModel();
    }

    if (item.status === 'comingSoon') {
      this.focusedItemId = item.id;
      this.message = 'Coming soon.';
      this.tone = 'warning';
      return this.getModel();
    }

    const loadoutKey = COSMETIC_CATEGORIES.find((entry) => entry.id === category)?.loadoutKey;
    if (!loadoutKey) {
      this.message = 'Cosmetic category not found.';
      this.tone = 'danger';
      return this.getModel();
    }

    this.previewLoadout = {
      ...this.previewLoadout,
      [loadoutKey]: item.id
    };
    this.focusedItemId = item.id;
    this.cosmeticManager.applyLoadout(this.previewLoadout, { preview: true });
    this.message = item.status === 'locked'
      ? 'Locked cosmetic - future unlock. Preview only.'
      : `Previewing ${item.name}.`;
    this.tone = item.status === 'locked' ? 'warning' : 'success';
    return this.getModel();
  }

  equip() {
    if (!this.cosmeticManager.canEquipLoadout(this.previewLoadout)) {
      this.message = 'Locked or coming-soon cosmetics cannot be equipped yet.';
      this.tone = 'warning';
      return this.getModel();
    }

    this.originalLoadout = this.cosmeticManager.saveLoadout(this.previewLoadout);
    this.previewLoadout = { ...this.originalLoadout };
    this.focusedItemId = null;
    this.message = 'Cosmetic loadout equipped and saved locally.';
    this.tone = 'success';
    return this.getModel();
  }

  resetToDefault() {
    const defaults = this.cosmeticManager.resetToDefault();
    this.originalLoadout = { ...defaults };
    this.previewLoadout = { ...defaults };
    this.focusedItemId = null;
    this.message = 'Default cosmetics restored.';
    this.tone = 'success';
    return this.getModel();
  }

  cancelPreview() {
    this.previewLoadout = { ...this.cosmeticManager.loadout };
    this.originalLoadout = { ...this.cosmeticManager.loadout };
    this.focusedItemId = null;
    this.cosmeticManager.applyLoadout(this.originalLoadout);
    this.message = 'Preview cancelled. Equipped loadout restored.';
    this.tone = 'default';
    return this.getModel();
  }

  getSelectedItem() {
    const category = COSMETIC_CATEGORIES.find((entry) => entry.id === this.activeCategory) || COSMETIC_CATEGORIES[0];
    const focusedItem = getCosmeticById(this.focusedItemId);
    if (focusedItem?.category === category.id) {
      return focusedItem;
    }
    return getCosmeticById(this.previewLoadout[category.loadoutKey]);
  }

  getModel() {
    const selectedItem = this.getSelectedItem();
    return {
      isOpen: this.isOpen,
      activeCategory: this.activeCategory,
      categories: this.cosmeticManager.getPanelItems(this.previewLoadout),
      equippedLoadout: { ...this.cosmeticManager.loadout },
      previewLoadout: { ...this.previewLoadout },
      focusedItemId: this.focusedItemId,
      canEquip: this.cosmeticManager.canEquipLoadout(this.previewLoadout)
        && (!this.focusedItemId || selectedItem?.status === 'available'),
      selectedItem,
      selectedStatusLabel: COSMETIC_STATUS_LABELS[selectedItem?.status] || 'Available',
      selectedRarityLabel: COSMETIC_RARITY_LABELS[selectedItem?.rarity] || 'Common',
      summary: this.cosmeticManager.getLoadoutSummary(this.previewLoadout),
      message: this.message,
      tone: this.tone
    };
  }
}
