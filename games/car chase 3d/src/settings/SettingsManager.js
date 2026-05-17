import { DEFAULT_SETTINGS } from '../config.js';
import { SaveManager } from '../systems/SaveManager.js';

const STORAGE_KEY = 'heatline-city-phase2-settings';

export class SettingsManager {
  constructor() {
    this.settings = { ...DEFAULT_SETTINGS, ...this.load() };
    this.listeners = new Set();
  }

  load() {
    return SaveManager.loadSettings();
  }

  save() {
    SaveManager.saveSettings(this.settings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch {
      // LocalStorage may be unavailable in some embeds; SaveManager already failed safely.
    }
    for (const listener of this.listeners) listener(this.settings);
  }

  onChange(listener) {
    this.listeners.add(listener);
    listener(this.settings);
  }

  update(partial) {
    this.settings = {
      ...this.settings,
      ...partial,
      masterVolume: this.clampVolume(partial.masterVolume ?? this.settings.masterVolume),
      soundVolume: this.clampVolume(partial.soundVolume ?? this.settings.soundVolume),
      ambienceVolume: this.clampVolume(partial.ambienceVolume ?? this.settings.ambienceVolume),
      engineVolume: this.clampVolume(partial.engineVolume ?? this.settings.engineVolume),
      sirenVolume: this.clampVolume(partial.sirenVolume ?? this.settings.sirenVolume),
      weaponsVolume: this.clampVolume(partial.weaponsVolume ?? this.settings.weaponsVolume),
      uiVolume: this.clampVolume(partial.uiVolume ?? this.settings.uiVolume),
      touchOpacity: this.clampVolume(partial.touchOpacity ?? this.settings.touchOpacity),
    };
    this.save();
  }

  clampVolume(value) {
    return Math.max(0, Math.min(1, Number(value)));
  }

  get() {
    return this.settings;
  }
}
