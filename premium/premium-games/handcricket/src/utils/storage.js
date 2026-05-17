// @ts-check

import { STORAGE_KEYS } from "../config/constants.js";

/**
 * @returns {string}
 */
function createPlayerKey() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `player_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

/**
 * @template T
 * @param {string} key
 * @param {T} fallback
 * @returns {T}
 */
export function loadJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * @param {string} key
 * @param {unknown} value
 */
export function saveJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures in mock mode.
  }
}

export function loadSession() {
  const session = loadJson(STORAGE_KEYS.SESSION, {
    localPlayerId: null,
    playerKey: "",
    profileName: "Captain You",
    lastRoomCode: "",
    activeRoomCode: "",
  });

  return {
    localPlayerId: session.localPlayerId ?? null,
    playerKey: session.playerKey || createPlayerKey(),
    profileName: session.profileName || "Captain You",
    lastRoomCode: session.lastRoomCode || "",
    activeRoomCode: session.activeRoomCode || "",
  };
}

/**
 * @param {unknown} session
 */
export function saveSession(session) {
  saveJson(STORAGE_KEYS.SESSION, session);
}

export function loadHistory() {
  return loadJson(STORAGE_KEYS.HISTORY, []);
}

/**
 * @param {unknown[]} history
 */
export function saveHistory(history) {
  saveJson(STORAGE_KEYS.HISTORY, history);
}

/**
 * @param {unknown} room
 */
export function saveLastRoom(room) {
  saveJson(STORAGE_KEYS.ROOM, room);
}

export function loadLastRoom() {
  return loadJson(STORAGE_KEYS.ROOM, null);
}

export function loadState() {
  return loadJson(STORAGE_KEYS.STATE, null);
}

/**
 * @param {unknown} state
 */
export function saveState(state) {
  saveJson(STORAGE_KEYS.STATE, state);
}

export function loadReleaseNotice() {
  return loadJson(STORAGE_KEYS.RELEASE_NOTICE, {
    installedVersion: null,
    whatsNewVersion: null,
  });
}

/**
 * @param {{ installedVersion: string | null; whatsNewVersion: string | null }} notice
 */
export function saveReleaseNotice(notice) {
  saveJson(STORAGE_KEYS.RELEASE_NOTICE, notice);
}
