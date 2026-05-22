import { beforeEach, describe, expect, it } from "vitest";
import {
  createDailyChallenge,
  createWeeklyChallenge,
  recordDailyAttempt,
  recordWeeklyAttempt,
  updateDailyRecord,
  updateWeeklyRecord
} from "../src/dailyChallengeManager.js";
import { getPuzzleAdapter, PUZZLE_TYPES } from "../src/puzzleAdapters.js";
import {
  CURRENT_SAVE_VERSION,
  loadSaveVersion,
  loadTotalStats,
  saveSettings,
  saveTotalStats
} from "../src/storage.js";
import {
  getChallengeProgressStats,
  getStatsForFilter,
  recordMove
} from "../src/statsManager.js";

function installLocalStorageMock() {
  const store = new Map();
  global.window = {
    localStorage: {
      getItem: (key) => store.get(key) ?? null,
      setItem: (key, value) => store.set(key, String(value)),
      removeItem: (key) => store.delete(key)
    }
  };
  return store;
}

describe("phase 9 launch hardening", () => {
  beforeEach(() => {
    installLocalStorageMock();
  });

  it("all puzzle adapters expose a stable launch contract and reversible first move", () => {
    PUZZLE_TYPES.forEach((type) => {
      const adapter = getPuzzleAdapter(type.id);
      const state = adapter.createState({ size: 3 });
      const before = adapter.getSignature(state);
      const move = adapter.generateScramble(state, { includePyraminxTips: false })[0];
      const parsed = adapter.parseMove(move, state);

      expect(adapter.id).toBe(type.id);
      expect(adapter.defaultSkin).toBeTruthy();
      expect(adapter.skinOptions.length).toBeGreaterThan(0);
      expect(adapter.getPlayableMoves(state).length).toBeGreaterThan(0);
      expect(adapter.getMovePieces(state, parsed).length).toBeGreaterThan(0);

      adapter.applyMove(state, parsed);
      expect(adapter.getSignature(state)).not.toBe(before);
      adapter.applyMove(state, adapter.inverseMove(parsed, state));
      expect(adapter.getSignature(state)).toBe(before);
      expect(adapter.isSolved(state)).toBe(true);
    });
  });

  it("normalizes corrupted saved stats and writes the current save version", () => {
    window.localStorage.setItem("gamehub.rubik.totalStats", JSON.stringify({
      totalMoves: -20,
      totalAttempts: "bad",
      scoped: {
        "3x3": {
          attempts: "4",
          solves: "2",
          totalTimeMs: "120000",
          totalSolveMoves: "90"
        },
        broken: null
      }
    }));
    window.localStorage.setItem("gamehub.rubik.saveVersion", "old");

    const stats = loadTotalStats();
    expect(loadSaveVersion()).toBe(CURRENT_SAVE_VERSION);
    expect(stats.totalMoves).toBe(0);
    expect(stats.totalAttempts).toBe(4);
    expect(stats.scoped["3x3"].attempts).toBe(4);
    expect(stats.scoped["3x3"].averageMoves).toBe(45);
    expect(stats.scoped.broken.attempts).toBe(0);

    saveTotalStats(recordMove(stats, { puzzleType: "cube", size: 3 }, 3));
    expect(loadTotalStats().scoped["3x3"].totalMoves).toBe(3);
  });

  it("save version is stamped by settings writes even when no stats exist yet", () => {
    saveSettings({ quality: "performance" });
    expect(loadSaveVersion()).toBe(CURRENT_SAVE_VERSION);
  });

  it("daily and weekly stats filters summarize challenge progress instead of falling back to global totals", () => {
    const daily = createDailyChallenge("daily-3x3", new Date("2026-05-22T12:00:00"));
    const weekly = createWeeklyChallenge("weekly-megaminx", new Date("2026-05-22T12:00:00"));
    let dailyProgress = recordDailyAttempt({}, daily);
    dailyProgress = updateDailyRecord(dailyProgress, daily, { elapsedMs: 88000, moveCount: 46 });
    let weeklyProgress = recordWeeklyAttempt({}, weekly);
    weeklyProgress = updateWeeklyRecord(weeklyProgress, weekly, { elapsedMs: 620000, moveCount: 220 });

    const dailyStats = getChallengeProgressStats(dailyProgress, "daily");
    const weeklyStats = getChallengeProgressStats(weeklyProgress, "weekly");
    const unrelated = getStatsForFilter({ totalAttempts: 99, scoped: {} }, "daily");

    expect(dailyStats.attempts).toBe(1);
    expect(dailyStats.solves).toBe(1);
    expect(dailyStats.averageMoves).toBe(46);
    expect(dailyStats.dailyStreak).toBe(1);
    expect(weeklyStats.weeklyCompletions).toBe(1);
    expect(unrelated.attempts).toBe(0);
  });
});
