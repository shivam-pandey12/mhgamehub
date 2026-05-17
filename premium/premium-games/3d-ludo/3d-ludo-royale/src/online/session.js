const SESSION_KEY = 'ludo-royale.online-session-id';
const LAST_ROOM_KEY = 'ludo-royale.online-last-room';
const LAST_MATCHMAKING_KEY = 'ludo-royale.public-matchmaking';

function createId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `ludo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getOnlineSessionId() {
  try {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) {
      return existing;
    }
    const id = createId();
    localStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return createId();
  }
}

export function saveLastRoomCode(roomCode) {
  try {
    if (roomCode) {
      localStorage.setItem(LAST_ROOM_KEY, roomCode);
    } else {
      localStorage.removeItem(LAST_ROOM_KEY);
    }
  } catch {
    // Reconnect metadata is optional.
  }
}

export function getLastRoomCode() {
  try {
    return localStorage.getItem(LAST_ROOM_KEY) || '';
  } catch {
    return '';
  }
}

export function saveLastMatchmakingState(state = null) {
  try {
    if (state) {
      localStorage.setItem(LAST_MATCHMAKING_KEY, JSON.stringify(state));
    } else {
      localStorage.removeItem(LAST_MATCHMAKING_KEY);
    }
  } catch {
    // Matchmaking reconnect metadata is optional.
  }
}

export function getLastMatchmakingState() {
  try {
    return JSON.parse(localStorage.getItem(LAST_MATCHMAKING_KEY) || 'null');
  } catch {
    return null;
  }
}
