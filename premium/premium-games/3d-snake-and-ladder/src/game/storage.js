export const STORAGE_KEYS = {
  settings: "slr.settings.v1",
  setup: "slr.setup.v1",
  rules: "slr.rules.v1",
  phase3: "slr.phase3.v1"
};

export function loadStoredValue(key, fallback) {
  try {
    const raw = window.localStorage?.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveStoredValue(key, value) {
  try {
    window.localStorage?.setItem(key, JSON.stringify(value));
  } catch {
    // Local preferences should never interrupt gameplay.
  }
}
