import { DEFAULT_COSMETICS, cosmeticUnlockContext, getCosmetic, isCosmeticUnlocked, normalizeEquippedCosmetics } from './cosmetics.js';

export const SAVE_KEY = 'ivory-golf-royale-save-v3';
const UNLOCK_KEY = 'ivory-golf-royale-unlocked-level';
const BEST_KEY = 'ivory-golf-royale-best-scores';
const SETTINGS_KEY = 'ivory-golf-royale-settings';
const SAVE_VERSION = 6;
const PACK_LEVEL_IDS = {
  'ivory-garden': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  'sky-marble': [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
};
const DEFAULT_UNLOCKED_BY_PACK = { 'ivory-garden': 1, 'sky-marble': 1 };

export const DEFAULT_SETTINGS = {
  sound: true,
  music: false,
  cameraShake: true,
  ballTrail: true,
  aimAssist: true,
  cameraMode: 'follow',
  showGhost: true,
  lastPackId: 'ivory-garden',
  graphicsQuality: 'high',
  reduceCinematics: false,
  highContrastAim: false,
  largeText: false,
  leftHandControls: false,
  playerNames: {
    solo: 'Player',
    localP1: 'Player 1',
    localP2: 'Player 2',
    botHuman: 'Player',
    online: 'Guest Putter'
  }
};

function normalizeSettings(settings = {}) {
  const playerNames = settings?.playerNames && typeof settings.playerNames === 'object'
    ? settings.playerNames
    : {};
  return {
    ...DEFAULT_SETTINGS,
    ...(settings && typeof settings === 'object' ? settings : {}),
    playerNames: {
      ...DEFAULT_SETTINGS.playerNames,
      ...playerNames
    }
  };
}

const DEFAULT_STATS = {
  totalShots: 0,
  totalPracticeShots: 0,
  holesCompleted: 0,
  holeInOnes: 0,
  totalStars: 0,
  bestCourseScore: null,
  bestTimeTrialMs: null,
  challengesCompleted: 0,
  botsDefeated: 0,
  localMatchesPlayed: 0,
  favoriteLevel: null,
  levelCompletions: {}
};

function defaultSave() {
  return {
    version: SAVE_VERSION,
    unlockedLevel: 1,
    unlockedByPack: { ...DEFAULT_UNLOCKED_BY_PACK },
    bestScores: {},
    ghostReplays: {},
    replays: { lastShots: {}, bestShots: {} },
    courseBest: {},
    bestTimes: {},
    challenges: { completed: {} },
    achievements: { unlocked: {}, progress: {} },
    stats: { ...DEFAULT_STATS, levelCompletions: {} },
    matchHistory: [],
    settings: normalizeSettings(),
    cosmetics: {
      equipped: { ...DEFAULT_COSMETICS },
      unlocked: {
        ball: { 'classic-ivory': true },
        trail: { 'minimal-line': true },
        flag: { 'classic-gold': true },
        aim: { 'classic-gold': true },
        cup: { 'golden-burst': true }
      }
    },
    daily: { completions: {}, streak: 0, lastCompletedDate: null },
    resultCards: [],
    graphics: { quality: 'high' },
    tutorial: { completed: false }
  };
}

function readJson(key, fallback) {
  try {
    const store = globalThis.window?.localStorage;
    if (!store) return fallback;
    const raw = store.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function readText(key) {
  try {
    return globalThis.window?.localStorage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function writeJson(key, value) {
  try {
    globalThis.window?.localStorage?.setItem(key, JSON.stringify(value));
  } catch {
    // Local storage is optional; the game remains playable without persistence.
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeSamples(samples, limit = 180) {
  if (!Array.isArray(samples)) return [];
  return samples
    .filter((sample) => Number.isFinite(Number(sample?.x)) && Number.isFinite(Number(sample?.z)))
    .slice(0, limit)
    .map((sample) => ({ x: Number(sample.x), z: Number(sample.z) }));
}

function normalizeReplayRecord(record) {
  if (!record || typeof record !== 'object') return null;
  const samples = normalizeSamples(record.samples);
  if (samples.length < 2) return null;
  return {
    ...record,
    levelId: Number(record.levelId) || 0,
    packId: typeof record.packId === 'string' ? record.packId : 'ivory-garden',
    samples
  };
}

export function normalizeBestRecord(record) {
  if (!record) return null;
  if (typeof record === 'number') {
    return { shots: record, penalties: 0, stars: 0 };
  }
  return {
    shots: Number(record.shots) || 0,
    penalties: Number(record.penalties) || 0,
    stars: Number(record.stars) || 0
  };
}

function earnedUnlockCountForPack(packId, bestScores) {
  const levelIds = PACK_LEVEL_IDS[packId] ?? [];
  let unlocked = 1;
  for (let index = 0; index < levelIds.length; index += 1) {
    if (!bestScores[String(levelIds[index])]) break;
    unlocked = Math.min(levelIds.length, index + 2);
  }
  return unlocked;
}

function earnedLegacyUnlockedLevel(bestScores) {
  return earnedUnlockCountForPack('ivory-garden', bestScores);
}

function isBetterScore(next, previous) {
  if (!previous) return true;
  if (next.shots !== previous.shots) return next.shots < previous.shots;
  if (next.penalties !== previous.penalties) return next.penalties < previous.penalties;
  return next.stars > previous.stars;
}

function isBetterTime(next, previous) {
  if (!previous) return true;
  return next.timeMs + (next.penaltySeconds ?? 0) * 1000 < previous.timeMs + (previous.penaltySeconds ?? 0) * 1000;
}

function normalizeSave(raw) {
  const save = defaultSave();
  if (!raw || typeof raw !== 'object') return save;

  save.unlockedLevel = Number(raw.unlockedLevel) > 0 ? Number(raw.unlockedLevel) : save.unlockedLevel;
  save.unlockedByPack = {
    ...save.unlockedByPack,
    ...(raw.unlockedByPack && typeof raw.unlockedByPack === 'object' ? raw.unlockedByPack : {})
  };
  save.bestScores = {};
  for (const [levelId, record] of Object.entries(raw.bestScores ?? {})) {
    const best = normalizeBestRecord(record);
    if (best) save.bestScores[levelId] = best;
  }
  if (Number(raw.version) < SAVE_VERSION) {
    save.unlockedLevel = earnedLegacyUnlockedLevel(save.bestScores);
    save.unlockedByPack = {
      'ivory-garden': earnedUnlockCountForPack('ivory-garden', save.bestScores),
      'sky-marble': earnedUnlockCountForPack('sky-marble', save.bestScores)
    };
  }
  save.ghostReplays = {};
  for (const [levelId, replay] of Object.entries(raw.ghostReplays ?? {})) {
    const normalized = normalizeReplayRecord(replay);
    if (normalized) save.ghostReplays[levelId] = normalized;
  }
  save.replays = {
    lastShots: {},
    bestShots: {}
  };
  for (const [levelId, replay] of Object.entries(raw.replays?.lastShots ?? {})) {
    const normalized = normalizeReplayRecord(replay);
    if (normalized) save.replays.lastShots[levelId] = normalized;
  }
  for (const [levelId, replay] of Object.entries(raw.replays?.bestShots ?? {})) {
    const normalized = normalizeReplayRecord(replay);
    if (normalized) save.replays.bestShots[levelId] = normalized;
  }
  save.courseBest = raw.courseBest && typeof raw.courseBest === 'object' ? raw.courseBest : {};
  save.bestTimes = raw.bestTimes && typeof raw.bestTimes === 'object' ? raw.bestTimes : {};
  save.challenges = { completed: { ...(raw.challenges?.completed ?? {}) } };
  save.achievements = {
    unlocked: { ...(raw.achievements?.unlocked ?? {}) },
    progress: { ...(raw.achievements?.progress ?? {}) }
  };
  save.stats = { ...save.stats, ...(raw.stats ?? {}) };
  save.stats.levelCompletions = { ...(raw.stats?.levelCompletions ?? {}) };
  save.matchHistory = Array.isArray(raw.matchHistory) ? raw.matchHistory.slice(0, 20) : [];
  save.settings = normalizeSettings(raw.settings);
  save.cosmetics = {
    equipped: normalizeEquippedCosmetics(raw.cosmetics?.equipped),
    unlocked: {
      ...(save.cosmetics.unlocked ?? {}),
      ...(raw.cosmetics?.unlocked ?? {})
    }
  };
  const context = cosmeticUnlockContext(save);
  for (const [type, id] of Object.entries(save.cosmetics.equipped)) {
    const item = getCosmetic(type, id);
    const unlocked = Boolean(save.cosmetics.unlocked?.[type]?.[id]) || isCosmeticUnlocked(item, context);
    if (!unlocked) save.cosmetics.equipped[type] = DEFAULT_COSMETICS[type];
  }
  save.daily = {
    completions: { ...(raw.daily?.completions ?? {}) },
    streak: Number(raw.daily?.streak) || 0,
    lastCompletedDate: raw.daily?.lastCompletedDate ?? null
  };
  save.resultCards = Array.isArray(raw.resultCards) ? raw.resultCards.slice(0, 20) : [];
  save.graphics = { ...save.graphics, ...(raw.graphics ?? {}) };
  save.tutorial = { completed: Boolean(raw.tutorial?.completed) };
  return save;
}

function migrateLegacy() {
  const rawSave = readJson(SAVE_KEY, null);
  const releaseLockLegacy = rawSave && Number(rawSave.version) < SAVE_VERSION;
  const save = normalizeSave(rawSave);
  const legacyUnlocked = Number(readText(UNLOCK_KEY));
  if (!releaseLockLegacy && Number.isFinite(legacyUnlocked) && legacyUnlocked > save.unlockedLevel) {
    save.unlockedLevel = legacyUnlocked;
  }

  const legacyScores = readJson(BEST_KEY, {});
  for (const [levelId, record] of Object.entries(legacyScores)) {
    const best = normalizeBestRecord(record);
    if (best && isBetterScore(best, save.bestScores[levelId])) save.bestScores[levelId] = best;
  }
  if (releaseLockLegacy) {
    save.unlockedLevel = earnedLegacyUnlockedLevel(save.bestScores);
    save.unlockedByPack = {
      'ivory-garden': earnedUnlockCountForPack('ivory-garden', save.bestScores),
      'sky-marble': earnedUnlockCountForPack('sky-marble', save.bestScores)
    };
  }

  save.settings = normalizeSettings({ ...save.settings, ...readJson(SETTINGS_KEY, {}) });
  return save;
}

function writeMirrors(save) {
  try {
    globalThis.window?.localStorage?.setItem(UNLOCK_KEY, String(save.unlockedLevel));
  } catch {
    // Ignore storage failures.
  }
  writeJson(BEST_KEY, save.bestScores);
  writeJson(SETTINGS_KEY, save.settings);
}

let memorySave = null;

function readSave() {
  if (memorySave) return clone(memorySave);
  const save = migrateLegacy();
  memorySave = clone(save);
  writeJson(SAVE_KEY, save);
  writeMirrors(save);
  return clone(save);
}

function saveAll(nextSave) {
  const save = normalizeSave(nextSave);
  memorySave = clone(save);
  writeJson(SAVE_KEY, save);
  writeMirrors(save);
  return clone(save);
}

function updateSave(mutator) {
  const save = readSave();
  mutator(save);
  return saveAll(save);
}

export const storage = {
  keys: {
    save: SAVE_KEY,
    unlocked: UNLOCK_KEY,
    best: BEST_KEY,
    settings: SETTINGS_KEY
  },

  getSave() {
    return readSave();
  },

  saveAll,

  updateSave,

  getUnlockedLevel() {
    return readSave().unlockedLevel;
  },

  setUnlockedLevel(levelId) {
    updateSave((save) => {
      save.unlockedLevel = Math.max(1, Number(levelId) || 1);
      save.unlockedByPack['ivory-garden'] = Math.max(save.unlockedByPack['ivory-garden'] ?? 1, save.unlockedLevel);
    });
  },

  getUnlockedByPack() {
    return readSave().unlockedByPack;
  },

  setUnlockedForPack(packId, levelCount) {
    updateSave((save) => {
      save.unlockedByPack[packId] = Math.max(1, Number(levelCount) || 1);
    });
  },

  getBestScores() {
    return readSave().bestScores;
  },

  setBestScore(levelId, shots, penalties = 0, stars = 0) {
    const key = String(levelId);
    const next = { shots, penalties, stars };
    let best = next;
    let improved = false;
    updateSave((save) => {
      const previous = save.bestScores[key] ?? null;
      improved = isBetterScore(next, previous);
      if (improved) save.bestScores[key] = next;
      best = save.bestScores[key] ?? next;
    });
    return { best, improved };
  },

  saveGhost(levelId, ghost) {
    updateSave((save) => {
      const normalized = normalizeReplayRecord(ghost);
      if (normalized) save.ghostReplays[String(levelId)] = normalized;
    });
  },

  saveShotReplay(levelId, replay, { best = false } = {}) {
    updateSave((save) => {
      const key = String(levelId);
      const normalized = normalizeReplayRecord(replay);
      if (!normalized) return;
      save.replays.lastShots[key] = normalized;
      if (best) save.replays.bestShots[key] = normalized;
    });
  },

  getShotReplay(levelId, kind = 'last') {
    const save = readSave();
    const key = String(levelId);
    return kind === 'best' ? save.replays.bestShots[key] ?? null : save.replays.lastShots[key] ?? null;
  },

  getGhost(levelId) {
    return readSave().ghostReplays[String(levelId)] ?? null;
  },

  getGhosts() {
    return readSave().ghostReplays;
  },

  getCourseBest(scopeId) {
    return readSave().courseBest[scopeId] ?? null;
  },

  setCourseBest(scopeId, record) {
    let best = record;
    let improved = false;
    updateSave((save) => {
      const previous = save.courseBest[scopeId] ?? null;
      const nextScore = record.shots + record.penalties;
      const previousScore = previous ? previous.shots + previous.penalties : Infinity;
      improved = !previous || nextScore < previousScore || (nextScore === previousScore && record.stars > previous.stars);
      if (improved) save.courseBest[scopeId] = record;
      best = save.courseBest[scopeId] ?? record;
    });
    return { best, improved };
  },

  getBestTime(scopeId) {
    return readSave().bestTimes[scopeId] ?? null;
  },

  setBestTime(scopeId, record) {
    let best = record;
    let improved = false;
    updateSave((save) => {
      improved = isBetterTime(record, save.bestTimes[scopeId]);
      if (improved) save.bestTimes[scopeId] = record;
      best = save.bestTimes[scopeId] ?? record;
    });
    return { best, improved };
  },

  getChallenges() {
    return readSave().challenges;
  },

  setChallengeCompleted(id) {
    let changed = false;
    updateSave((save) => {
      changed = !save.challenges.completed[id];
      save.challenges.completed[id] = true;
      save.stats.challengesCompleted = Object.keys(save.challenges.completed).length;
    });
    return changed;
  },

  getAchievements() {
    return readSave().achievements;
  },

  unlockAchievement(id) {
    let changed = false;
    updateSave((save) => {
      if (!save.achievements.unlocked[id]) {
        save.achievements.unlocked[id] = { date: new Date().toISOString() };
        changed = true;
      }
    });
    return changed;
  },

  getStats() {
    return readSave().stats;
  },

  updateStats(mutator) {
    let stats;
    updateSave((save) => {
      mutator(save.stats);
      stats = save.stats;
    });
    return stats;
  },

  resetStats() {
    updateSave((save) => {
      save.stats = { ...DEFAULT_STATS, levelCompletions: {} };
      save.matchHistory = [];
    });
  },

  addMatchHistory(record) {
    updateSave((save) => {
      save.matchHistory = [record, ...(save.matchHistory ?? [])].slice(0, 20);
    });
  },

  getMatchHistory() {
    return readSave().matchHistory;
  },

  setTutorialCompleted(completed = true) {
    updateSave((save) => {
      save.tutorial.completed = Boolean(completed);
    });
  },

  isTutorialCompleted() {
    return readSave().tutorial.completed;
  },

  setAchievementProgress(id, value) {
    updateSave((save) => {
      save.achievements.progress[id] = value;
    });
  },

  getSettings() {
    return readSave().settings;
  },

  saveSettings(settings) {
    updateSave((save) => {
      save.settings = normalizeSettings(settings);
    });
  },

  getCosmetics() {
    return readSave().cosmetics;
  },

  equipCosmetic(type, id) {
    updateSave((save) => {
      const item = getCosmetic(type, id);
      const context = cosmeticUnlockContext(save);
      const unlocked = Boolean(save.cosmetics.unlocked?.[type]?.[id]) || isCosmeticUnlocked(item, context);
      if (!item || !unlocked) return;
      save.cosmetics.equipped = normalizeEquippedCosmetics({
        ...save.cosmetics.equipped,
        [type]: id
      });
    });
  },

  unlockCosmetic(type, id) {
    updateSave((save) => {
      if (!save.cosmetics.unlocked[type]) save.cosmetics.unlocked[type] = {};
      save.cosmetics.unlocked[type][id] = true;
    });
  },

  getDaily() {
    return readSave().daily;
  },

  completeDaily(challenge, result) {
    updateSave((save) => {
      const previous = save.daily.completions[challenge.dateKey];
      const adjusted = (result.shots ?? 0) + (result.penalties ?? 0);
      save.daily.completions[challenge.dateKey] = {
        id: challenge.id,
        levelId: challenge.levelId,
        objective: challenge.objective,
        shots: result.shots,
        penalties: result.penalties,
        adjusted,
        date: new Date().toISOString()
      };
      if (!previous) {
        const last = save.daily.lastCompletedDate;
        const yesterday = new Date(`${challenge.dateKey}T00:00:00`);
        yesterday.setDate(yesterday.getDate() - 1);
        save.daily.streak = last === yesterday.toISOString().slice(0, 10) ? save.daily.streak + 1 : 1;
        save.daily.lastCompletedDate = challenge.dateKey;
      }
    });
  },

  saveResultCard(record) {
    updateSave((save) => {
      save.resultCards = [record, ...(save.resultCards ?? [])].slice(0, 20);
    });
  },

  clearModeProgress() {
    updateSave((save) => {
      save.courseBest = {};
      save.bestTimes = {};
      save.challenges = { completed: {} };
      save.achievements = { unlocked: {}, progress: {} };
      save.ghostReplays = {};
      save.replays = { lastShots: {}, bestShots: {} };
      save.matchHistory = [];
      save.resultCards = [];
      save.daily = { completions: {}, streak: 0, lastCompletedDate: null };
      save.tutorial = { completed: false };
    });
  },

  resetProgress() {
    memorySave = defaultSave();
    try {
      globalThis.window?.localStorage?.removeItem(SAVE_KEY);
      globalThis.window?.localStorage?.removeItem(UNLOCK_KEY);
      globalThis.window?.localStorage?.removeItem(BEST_KEY);
      globalThis.window?.localStorage?.removeItem(SETTINGS_KEY);
    } catch {
      // Ignore storage failures.
    }
    saveAll(memorySave);
  },

  isBetterScore,

  isBetterTime
};
