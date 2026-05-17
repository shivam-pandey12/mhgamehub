const ONLINE_SESSION_STORAGE_KEY = 'chess_online_session';

export function loadOnlineSession() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(ONLINE_SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveOnlineSession(session) {
  if (typeof window === 'undefined' || !window.localStorage || !session) {
    return;
  }

  try {
    window.localStorage.setItem(ONLINE_SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Ignore storage failures and keep online play running.
  }
}

export function clearOnlineSession() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.removeItem(ONLINE_SESSION_STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}
