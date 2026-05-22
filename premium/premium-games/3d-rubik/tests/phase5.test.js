import { beforeEach, describe, expect, it } from "vitest";
import {
  createWeeklyChallenge,
  recordWeeklyAttempt,
  updateWeeklyRecord
} from "../src/dailyChallengeManager.js";
import { createReplaySession, getReplayStatus } from "../src/replayManager.js";
import { buildDailyShareText, buildSolveShareText, buildWeeklyShareText } from "../src/shareResultManager.js";
import {
  getStatsForFilter,
  recordAttempt,
  recordSolve,
  recordWeeklyCompletion
} from "../src/statsManager.js";
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from "../src/storage.js";

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

describe("phase 5 launch polish systems", () => {
  beforeEach(() => {
    installLocalStorageMock();
  });

  it("weekly challenges are stable for one week and change across weeks", () => {
    const weekA = new Date("2026-05-22T12:00:00");
    const sameWeek = new Date("2026-05-24T12:00:00");
    const nextWeek = new Date("2026-05-29T12:00:00");
    const first = createWeeklyChallenge("weekly-3x3-hard", weekA);
    const second = createWeeklyChallenge("weekly-3x3-hard", sameWeek);
    const next = createWeeklyChallenge("weekly-3x3-hard", nextWeek);

    expect(first.week).toBe(second.week);
    expect(first.scramble).toEqual(second.scramble);
    expect(first.scramble.join(" ")).not.toBe(next.scramble.join(" "));
  });

  it("weekly attempts and records stay separate from daily progress", () => {
    const challenge = createWeeklyChallenge("weekly-pyraminx-speed", new Date("2026-05-22T12:00:00"));
    let progress = recordWeeklyAttempt({}, challenge);
    progress = recordWeeklyAttempt(progress, challenge);
    progress = updateWeeklyRecord(progress, challenge, { elapsedMs: 58100, moveCount: 31 });

    const record = progress[challenge.id][challenge.week];
    expect(record.attempts).toBe(2);
    expect(record.completed).toBe(true);
    expect(record.bestMoves).toBe(31);
  });

  it("share text uses the launch title and correct challenge labels", () => {
    const daily = { label: "Daily 3x3 Challenge", date: "2026-05-22" };
    const weekly = { label: "Weekly 4x4 Challenge", period: "2026-05-18 to 2026-05-24" };

    expect(buildSolveShareText({ puzzleLabel: "Pyraminx", elapsedMs: 58000, moveCount: 34 }))
      .toContain("Twisty Puzzle 3D");
    expect(buildDailyShareText({ challenge: daily, elapsedMs: 134000, moveCount: 89, streak: 4 }))
      .toContain("Daily 3x3 Challenge");
    expect(buildWeeklyShareText({ challenge: weekly, elapsedMs: 240000, moveCount: 121 }))
      .toContain("Weekly 4x4 Challenge");
  });

  it("stats filters expose all, cube, size, pyraminx, and weekly totals", () => {
    let stats = recordAttempt({}, { puzzleType: "cube", size: 3 });
    stats = recordAttempt(stats, { puzzleType: "pyraminx", size: "pyraminx" });
    stats = recordSolve(stats, { puzzleType: "cube", size: 3 }, { elapsedMs: 60000, moveCount: 50 });
    stats = recordWeeklyCompletion(stats, { puzzleType: "cube", size: 3 });

    expect(getStatsForFilter(stats, "all").attempts).toBe(2);
    expect(getStatsForFilter(stats, "cube").solves).toBe(1);
    expect(getStatsForFilter(stats, "3x3").averageMoves).toBe(50);
    expect(getStatsForFilter(stats, "pyraminx").attempts).toBe(1);
    expect(stats.favoritePuzzleByAttempts).toBeTruthy();
    expect(stats.weeklyCompletions).toBe(1);
  });

  it("replay status includes puzzle label, move index, next move, and time marker", () => {
    const session = createReplaySession({
      puzzleType: "cube",
      size: 3,
      scramble: ["R"],
      moves: [
        { move: { notation: "R'", display: "R'" }, source: "button", atMs: 1200 },
        { move: { notation: "U", display: "U" }, source: "keyboard", atMs: 2100 }
      ],
      elapsedMs: 2300,
      moveCount: 2
    });
    const status = getReplayStatus(session, 1, false, 2);

    expect(status.puzzleLabel).toBe("3x3");
    expect(status.index).toBe(1);
    expect(status.total).toBe(2);
    expect(status.currentMove).toBe("R'");
    expect(status.nextMove).toBe("U");
    expect(status.timeMarkerMs).toBe(1200);
  });

  it("settings persist launch controls and clamp sensitivity", () => {
    saveSettings({
      ...DEFAULT_SETTINGS,
      showMoveButtons: false,
      showNotationPanel: false,
      cameraSensitivity: 9,
      touchSensitivity: 0.1
    });
    const settings = loadSettings();

    expect(settings.showMoveButtons).toBe(false);
    expect(settings.showNotationPanel).toBe(false);
    expect(settings.cameraSensitivity).toBe(1.75);
    expect(settings.touchSensitivity).toBe(0.5);
  });
});
