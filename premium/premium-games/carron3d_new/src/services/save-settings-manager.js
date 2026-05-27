import { DEFAULT_THEME_ID } from '../config/theme-config.js';
import { DEFAULT_LOCAL_SETUP, QUALITY_OPTIONS, STORAGE_KEYS } from '../config/carrom-constants.js';

const SETTINGS_VERSION = 1;

export function getDefaultSettings() {
  return {
    version: SETTINGS_VERSION,
    themeId: DEFAULT_THEME_ID,
    sound: true,
    music: true,
    cameraMotion: true,
    reducedEffects: false,
    quality: 'auto'
  };
}

export function loadSettings() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return getDefaultSettings();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.settings);
    if (!raw) {
      return getDefaultSettings();
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return getDefaultSettings();
    }

    const settings = {
      ...getDefaultSettings(),
      ...parsed,
      version: SETTINGS_VERSION
    };
    settings.quality = QUALITY_OPTIONS.includes(settings.quality) ? settings.quality : 'auto';
    return settings;
  } catch {
    return getDefaultSettings();
  }
}

export function saveSettings(settings) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEYS.settings,
      JSON.stringify({
        ...getDefaultSettings(),
        ...settings,
        version: SETTINGS_VERSION,
        quality: QUALITY_OPTIONS.includes(settings.quality) ? settings.quality : 'auto'
      })
    );
  } catch {
    // Settings are helpful, not critical.
  }
}

export function resetSettings() {
  const defaults = getDefaultSettings();
  saveSettings(defaults);
  return defaults;
}

export function loadPlayerNames() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return {
      playerOneName: DEFAULT_LOCAL_SETUP.playerOneName,
      playerTwoName: DEFAULT_LOCAL_SETUP.playerTwoName
    };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.playerNames);
    const parsed = raw ? JSON.parse(raw) : null;
    return {
      playerOneName: parsed?.playerOneName || DEFAULT_LOCAL_SETUP.playerOneName,
      playerTwoName: parsed?.playerTwoName || DEFAULT_LOCAL_SETUP.playerTwoName
    };
  } catch {
    return {
      playerOneName: DEFAULT_LOCAL_SETUP.playerOneName,
      playerTwoName: DEFAULT_LOCAL_SETUP.playerTwoName
    };
  }
}

export function savePlayerNames(playerNames) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEYS.playerNames,
      JSON.stringify({
        playerOneName: playerNames.playerOneName || DEFAULT_LOCAL_SETUP.playerOneName,
        playerTwoName: playerNames.playerTwoName || DEFAULT_LOCAL_SETUP.playerTwoName
      })
    );
  } catch {
    // Ignore storage failures.
  }
}
