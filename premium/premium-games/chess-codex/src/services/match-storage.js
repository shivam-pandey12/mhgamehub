export const LAST_MATCH_STORAGE_KEY = 'chess_last_match';
const MATCH_STORAGE_VERSION = 1;

export function loadSavedMatch() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(LAST_MATCH_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    if (parsed.version !== MATCH_STORAGE_VERSION) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveSavedMatch(match) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.setItem(LAST_MATCH_STORAGE_KEY, JSON.stringify({
      version: MATCH_STORAGE_VERSION,
      ...match
    }));
  } catch {
    // Ignore quota or serialization failures and keep gameplay running.
  }
}

export function clearSavedMatch() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.removeItem(LAST_MATCH_STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}
