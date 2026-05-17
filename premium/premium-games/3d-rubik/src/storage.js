import { clampCubeSize } from "./cubeState.js";

const STORAGE_KEYS = {
  selectedSize: "gamehub.rubik.selectedSize",
  selectedMode: "gamehub.rubik.selectedMode",
  selectedSkin: "gamehub.rubik.selectedSkin",
  settings: "gamehub.rubik.settings",
  totalStats: "gamehub.rubik.totalStats",
  missionProgress: "gamehub.rubik.missionProgress",
  bestTime: (size) => `gamehub.rubik.${size}.bestTimeMs`,
  bestMoves: (size) => `gamehub.rubik.${size}.bestMoves`
};

export const DEFAULT_SETTINGS = {
  sound: true,
  volume: 0.72,
  animationSpeed: "normal",
  quality: "balanced",
  reducedMotion: false,
  stickerBorders: true,
  gapStyle: "clean"
};

const DEFAULT_TOTAL_STATS = {
  totalMoves: 0,
  totalSolves: 0,
  totalMissionsCompleted: 0,
  solvesBySize: {}
};

function readNumber(key) {
  try {
    const value = Number(window.localStorage.getItem(key));
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch (_) {
    return null;
  }
}

function writeNumber(key, value) {
  try {
    window.localStorage.setItem(key, String(value));
  } catch (_) {
    // LocalStorage can be blocked in some embedded contexts.
  }
}

function readString(key, fallback) {
  try {
    return window.localStorage.getItem(key) || fallback;
  } catch (_) {
    return fallback;
  }
}

function writeString(key, value) {
  try {
    window.localStorage.setItem(key, String(value));
  } catch (_) {
    // LocalStorage can be blocked in some embedded contexts.
  }
}

function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    return { ...fallback, ...JSON.parse(raw) };
  } catch (_) {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {
    // LocalStorage can be blocked in some embedded contexts.
  }
}

export function loadSelectedSize() {
  try {
    return clampCubeSize(window.localStorage.getItem(STORAGE_KEYS.selectedSize));
  } catch (_) {
    return 3;
  }
}

export function saveSelectedSize(size) {
  writeNumber(STORAGE_KEYS.selectedSize, clampCubeSize(size));
}

export function loadSelectedMode() {
  return readString(STORAGE_KEYS.selectedMode, "free");
}

export function saveSelectedMode(modeId) {
  writeString(STORAGE_KEYS.selectedMode, modeId || "free");
}

export function loadSelectedSkin() {
  return readString(STORAGE_KEYS.selectedSkin, "premiumSpeedcube");
}

export function saveSelectedSkin(skinId) {
  writeString(STORAGE_KEYS.selectedSkin, skinId || "premiumSpeedcube");
}

export function loadSettings() {
  const settings = readJson(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    volume: Math.min(1, Math.max(0, Number(settings.volume ?? DEFAULT_SETTINGS.volume)))
  };
}

export function saveSettings(settings) {
  writeJson(STORAGE_KEYS.settings, { ...DEFAULT_SETTINGS, ...settings });
}

export function loadBestScores(size = 3) {
  const safeSize = clampCubeSize(size);

  return {
    bestTimeMs: readNumber(STORAGE_KEYS.bestTime(safeSize)),
    bestMoves: readNumber(STORAGE_KEYS.bestMoves(safeSize))
  };
}

export function saveBestScores(size = 3, { bestTimeMs, bestMoves }) {
  const safeSize = clampCubeSize(size);

  if (Number.isFinite(bestTimeMs) && bestTimeMs > 0) {
    writeNumber(STORAGE_KEYS.bestTime(safeSize), Math.round(bestTimeMs));
  }

  if (Number.isFinite(bestMoves) && bestMoves > 0) {
    writeNumber(STORAGE_KEYS.bestMoves(safeSize), Math.round(bestMoves));
  }
}

export function loadTotalStats() {
  return readJson(STORAGE_KEYS.totalStats, DEFAULT_TOTAL_STATS);
}

export function saveTotalStats(stats) {
  writeJson(STORAGE_KEYS.totalStats, {
    ...DEFAULT_TOTAL_STATS,
    ...stats,
    solvesBySize: stats?.solvesBySize || {}
  });
}

export function loadMissionProgress() {
  return readJson(STORAGE_KEYS.missionProgress, {});
}

export function saveMissionProgress(progress) {
  writeJson(STORAGE_KEYS.missionProgress, progress || {});
}

export function formatTime(milliseconds) {
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) {
    return "--";
  }

  const totalTenths = Math.floor(milliseconds / 100);
  const tenths = totalTenths % 10;
  const totalSeconds = Math.floor(totalTenths / 10);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
}
