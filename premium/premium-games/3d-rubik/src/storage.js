import { clampCubeSize } from "./cubeState.js";

const STORAGE_KEYS = {
  saveVersion: "gamehub.rubik.saveVersion",
  selectedPuzzleType: "gamehub.rubik.selectedPuzzleType",
  selectedSize: "gamehub.rubik.selectedSize",
  selectedMode: "gamehub.rubik.selectedMode",
  selectedSkin: "gamehub.rubik.selectedSkin",
  selectedPuzzleSkin: (puzzleType) => `gamehub.rubik.${puzzleType}.selectedSkin`,
  settings: "gamehub.rubik.settings",
  totalStats: "gamehub.rubik.totalStats",
  missionProgress: "gamehub.rubik.missionProgress",
  dailyProgress: "gamehub.rubik.dailyProgress",
  weeklyProgress: "gamehub.rubik.weeklyProgress",
  statsFilter: "gamehub.rubik.statsFilter",
  solveSessions: "gamehub.rubik.solveSessions",
  bestTime: (size) => `gamehub.rubik.${size}.bestTimeMs`,
  bestMoves: (size) => `gamehub.rubik.${size}.bestMoves`,
  puzzleBestTime: (puzzleType) => `gamehub.rubik.${puzzleType}.bestTimeMs`,
  puzzleBestMoves: (puzzleType) => `gamehub.rubik.${puzzleType}.bestMoves`,
  lastScramble: (puzzleType) => `gamehub.rubik.${puzzleType}.lastScramble`
};

export const CURRENT_SAVE_VERSION = 1;

const PUZZLE_SKIN_DEFAULTS = {
  pyraminx: "ivoryPyraminx",
  skewb: "ivorySkewb",
  mirrorCube: "ivoryMirror",
  megaminx: "ivoryMegaminx"
};

export const DEFAULT_SETTINGS = {
  sound: true,
  volume: 0.72,
  animationSpeed: "normal",
  quality: "balanced",
  reducedMotion: false,
  stickerBorders: true,
  gapStyle: "clean",
  includePyraminxTips: true,
  showMoveButtons: true,
  showNotationPanel: true,
  cameraSensitivity: 1,
  touchSensitivity: 1
};

const DEFAULT_TOTAL_STATS = {
  totalMoves: 0,
  totalSolves: 0,
  totalAttempts: 0,
  totalHintsUsed: 0,
  totalUndosUsed: 0,
  totalMissionsCompleted: 0,
  weeklyCompletions: 0,
  lastPlayedPuzzle: "",
  favoritePuzzleByAttempts: "",
  attemptsByPuzzle: {},
  solvesBySize: {},
  solvesByPuzzle: {},
  scoped: {}
};

function clampUnitRange(value, fallback = 1, min = 0.5, max = 1.75) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, number));
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function nonNegativeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

function hasNonNegativeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0;
}

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

    const parsed = JSON.parse(raw);
    if (isPlainObject(fallback)) {
      return isPlainObject(parsed) ? { ...fallback, ...parsed } : fallback;
    }
    if (Array.isArray(fallback)) {
      return Array.isArray(parsed) ? parsed : fallback;
    }
    return parsed ?? fallback;
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

export function loadSaveVersion() {
  try {
    const value = Number(window.localStorage.getItem(STORAGE_KEYS.saveVersion));
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch (_) {
    return 0;
  }
}

export function saveSaveVersion(version = CURRENT_SAVE_VERSION) {
  writeNumber(STORAGE_KEYS.saveVersion, version);
}

function touchSaveVersion() {
  if (loadSaveVersion() !== CURRENT_SAVE_VERSION) {
    saveSaveVersion(CURRENT_SAVE_VERSION);
  }
}

function normalizeStatsBucket(bucket = {}) {
  const source = isPlainObject(bucket) ? bucket : {};
  const solves = nonNegativeNumber(source.solves);
  const totalTimeMs = nonNegativeNumber(source.totalTimeMs);
  const totalSolveMoves = nonNegativeNumber(source.totalSolveMoves);
  return {
    totalMoves: nonNegativeNumber(source.totalMoves),
    attempts: nonNegativeNumber(source.attempts),
    solves,
    totalTimeMs,
    totalSolveMoves,
    averageTimeMs: solves ? nonNegativeNumber(source.averageTimeMs, totalTimeMs / solves) : 0,
    averageMoves: solves ? nonNegativeNumber(source.averageMoves, totalSolveMoves / solves) : 0,
    latestSolve: isPlainObject(source.latestSolve) ? source.latestSolve : null,
    hintsUsed: nonNegativeNumber(source.hintsUsed),
    undosUsed: nonNegativeNumber(source.undosUsed),
    dailyStreak: nonNegativeNumber(source.dailyStreak),
    weeklyCompletions: nonNegativeNumber(source.weeklyCompletions)
  };
}

function normalizeNumberMap(map = {}) {
  if (!isPlainObject(map)) {
    return {};
  }
  return Object.fromEntries(Object.entries(map)
    .map(([key, value]) => [key, nonNegativeNumber(value)])
    .filter(([, value]) => value >= 0));
}

function normalizeTotalStats(stats = {}) {
  const source = isPlainObject(stats) ? stats : {};
  const scopedSource = isPlainObject(source.scoped) ? source.scoped : {};
  const scoped = Object.fromEntries(Object.entries(scopedSource).map(([key, bucket]) => [key, normalizeStatsBucket(bucket)]));
  const scopedTotals = Object.values(scoped).reduce((totals, bucket) => ({
    totalMoves: totals.totalMoves + bucket.totalMoves,
    totalSolves: totals.totalSolves + bucket.solves,
    totalAttempts: totals.totalAttempts + bucket.attempts,
    totalHintsUsed: totals.totalHintsUsed + bucket.hintsUsed,
    totalUndosUsed: totals.totalUndosUsed + bucket.undosUsed,
    weeklyCompletions: totals.weeklyCompletions + bucket.weeklyCompletions
  }), {
    totalMoves: 0,
    totalSolves: 0,
    totalAttempts: 0,
    totalHintsUsed: 0,
    totalUndosUsed: 0,
    weeklyCompletions: 0
  });
  return {
    ...DEFAULT_TOTAL_STATS,
    totalMoves: hasNonNegativeNumber(source.totalMoves) ? nonNegativeNumber(source.totalMoves) : scopedTotals.totalMoves,
    totalSolves: hasNonNegativeNumber(source.totalSolves) ? nonNegativeNumber(source.totalSolves) : scopedTotals.totalSolves,
    totalAttempts: hasNonNegativeNumber(source.totalAttempts) ? nonNegativeNumber(source.totalAttempts) : scopedTotals.totalAttempts,
    totalHintsUsed: hasNonNegativeNumber(source.totalHintsUsed) ? nonNegativeNumber(source.totalHintsUsed) : scopedTotals.totalHintsUsed,
    totalUndosUsed: hasNonNegativeNumber(source.totalUndosUsed) ? nonNegativeNumber(source.totalUndosUsed) : scopedTotals.totalUndosUsed,
    totalMissionsCompleted: nonNegativeNumber(source.totalMissionsCompleted),
    weeklyCompletions: hasNonNegativeNumber(source.weeklyCompletions) ? nonNegativeNumber(source.weeklyCompletions) : scopedTotals.weeklyCompletions,
    lastPlayedPuzzle: typeof source.lastPlayedPuzzle === "string" ? source.lastPlayedPuzzle : "",
    favoritePuzzleByAttempts: typeof source.favoritePuzzleByAttempts === "string" ? source.favoritePuzzleByAttempts : "",
    attemptsByPuzzle: normalizeNumberMap(source.attemptsByPuzzle),
    solvesBySize: normalizeNumberMap(source.solvesBySize),
    solvesByPuzzle: normalizeNumberMap(source.solvesByPuzzle),
    scoped
  };
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

export function loadSelectedPuzzleType() {
  const value = readString(STORAGE_KEYS.selectedPuzzleType, "cube");
  return ["pyraminx", "skewb", "mirrorCube", "megaminx"].includes(value) ? value : "cube";
}

export function saveSelectedPuzzleType(puzzleType) {
  writeString(STORAGE_KEYS.selectedPuzzleType, ["pyraminx", "skewb", "mirrorCube", "megaminx"].includes(puzzleType) ? puzzleType : "cube");
}

export function loadSelectedMode() {
  return readString(STORAGE_KEYS.selectedMode, "free");
}

export function saveSelectedMode(modeId) {
  writeString(STORAGE_KEYS.selectedMode, modeId || "free");
}

export function loadSelectedSkin(puzzleType = "cube") {
  if (PUZZLE_SKIN_DEFAULTS[puzzleType]) {
    return readString(STORAGE_KEYS.selectedPuzzleSkin(puzzleType), PUZZLE_SKIN_DEFAULTS[puzzleType]);
  }

  return readString(STORAGE_KEYS.selectedSkin, "premiumSpeedcube");
}

export function saveSelectedSkin(skinId, puzzleType = "cube") {
  if (PUZZLE_SKIN_DEFAULTS[puzzleType]) {
    writeString(STORAGE_KEYS.selectedPuzzleSkin(puzzleType), skinId || PUZZLE_SKIN_DEFAULTS[puzzleType]);
    return;
  }

  writeString(STORAGE_KEYS.selectedSkin, skinId || "premiumSpeedcube");
}

export function loadSettings() {
  const settings = readJson(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    volume: Math.min(1, Math.max(0, Number(settings.volume ?? DEFAULT_SETTINGS.volume))),
    cameraSensitivity: clampUnitRange(settings.cameraSensitivity, DEFAULT_SETTINGS.cameraSensitivity),
    touchSensitivity: clampUnitRange(settings.touchSensitivity, DEFAULT_SETTINGS.touchSensitivity)
  };
}

export function saveSettings(settings) {
  touchSaveVersion();
  writeJson(STORAGE_KEYS.settings, { ...DEFAULT_SETTINGS, ...settings });
}

export function loadBestScores(size = 3, puzzleType = "cube") {
  if (puzzleType !== "cube" || PUZZLE_SKIN_DEFAULTS[size]) {
    const id = puzzleType === "cube" ? size : puzzleType;
    return {
      bestTimeMs: readNumber(STORAGE_KEYS.puzzleBestTime(id)),
      bestMoves: readNumber(STORAGE_KEYS.puzzleBestMoves(id))
    };
  }

  const safeSize = clampCubeSize(size);

  return {
    bestTimeMs: readNumber(STORAGE_KEYS.bestTime(safeSize)),
    bestMoves: readNumber(STORAGE_KEYS.bestMoves(safeSize))
  };
}

export function saveBestScores(size = 3, { bestTimeMs, bestMoves }, puzzleType = "cube") {
  if (puzzleType !== "cube" || PUZZLE_SKIN_DEFAULTS[size]) {
    const id = puzzleType === "cube" ? size : puzzleType;
    if (Number.isFinite(bestTimeMs) && bestTimeMs > 0) {
      writeNumber(STORAGE_KEYS.puzzleBestTime(id), Math.round(bestTimeMs));
    }

    if (Number.isFinite(bestMoves) && bestMoves > 0) {
      writeNumber(STORAGE_KEYS.puzzleBestMoves(id), Math.round(bestMoves));
    }
    return;
  }

  const safeSize = clampCubeSize(size);

  if (Number.isFinite(bestTimeMs) && bestTimeMs > 0) {
    writeNumber(STORAGE_KEYS.bestTime(safeSize), Math.round(bestTimeMs));
  }

  if (Number.isFinite(bestMoves) && bestMoves > 0) {
    writeNumber(STORAGE_KEYS.bestMoves(safeSize), Math.round(bestMoves));
  }
}

export function loadTotalStats() {
  touchSaveVersion();
  return normalizeTotalStats(readJson(STORAGE_KEYS.totalStats, DEFAULT_TOTAL_STATS));
}

export function saveTotalStats(stats) {
  touchSaveVersion();
  writeJson(STORAGE_KEYS.totalStats, normalizeTotalStats(stats));
}

export function loadMissionProgress() {
  return readJson(STORAGE_KEYS.missionProgress, {});
}

export function saveMissionProgress(progress) {
  writeJson(STORAGE_KEYS.missionProgress, progress || {});
}

export function loadDailyProgress() {
  return readJson(STORAGE_KEYS.dailyProgress, {});
}

export function saveDailyProgress(progress) {
  writeJson(STORAGE_KEYS.dailyProgress, progress || {});
}

export function loadWeeklyProgress() {
  return readJson(STORAGE_KEYS.weeklyProgress, {});
}

export function saveWeeklyProgress(progress) {
  writeJson(STORAGE_KEYS.weeklyProgress, progress || {});
}

export function loadStatsFilter() {
  return readString(STORAGE_KEYS.statsFilter, "all");
}

export function saveStatsFilter(filterId = "all") {
  writeString(STORAGE_KEYS.statsFilter, filterId || "all");
}

export function loadSolveSessions() {
  const sessions = readJson(STORAGE_KEYS.solveSessions, { items: [] });
  return Array.isArray(sessions.items) ? sessions.items : [];
}

export function saveSolveSessions(sessions = []) {
  writeJson(STORAGE_KEYS.solveSessions, {
    items: Array.isArray(sessions) ? sessions.slice(-12) : []
  });
}

export function loadLastScramble(puzzleType = "cube") {
  return readString(STORAGE_KEYS.lastScramble(puzzleType), "");
}

export function saveLastScramble(puzzleType = "cube", scramble = []) {
  writeString(STORAGE_KEYS.lastScramble(puzzleType), Array.isArray(scramble) ? scramble.join(" ") : String(scramble || ""));
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
