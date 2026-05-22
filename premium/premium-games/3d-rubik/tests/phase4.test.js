import { describe, expect, it } from "vitest";
import { applyMoveToState, createSolvedCube, getCubeSignature, inverseMove, isSolved } from "../src/cubeState.js";
import { createDailyChallenge, recordDailyAttempt, updateDailyRecord } from "../src/dailyChallengeManager.js";
import { captureGuideSnapshot, detectGuideMistake } from "../src/guideMistakeDetector.js";
import { getSmartHint } from "../src/hintEngine.js";
import { getPuzzleAdapter } from "../src/puzzleAdapters.js";
import { buildReplayState, createReplaySession } from "../src/replayManager.js";
import { simulateSequence } from "../src/solverManager.js";
import { getScopedStats, recordAttempt, recordHint, recordSolve, recordUndo } from "../src/statsManager.js";

describe("phase 4 smart systems", () => {
  it("returns puzzle-aware hint objects without pretending large cubes have a full solver", () => {
    const cube = createSolvedCube(3);
    applyMoveToState(cube, "R");
    const cubeHint = getSmartHint(cube, "move", 1);
    const large = createSolvedCube(6);
    applyMoveToState(large, "R");
    const largeHint = getSmartHint(large, "move", 0);
    const pyraminx = getPuzzleAdapter("pyraminx").createState();
    getPuzzleAdapter("pyraminx").applyMove(pyraminx, "R");
    const pyraminxHint = getSmartHint(pyraminx, "move", 0);

    expect(cubeHint.puzzleType).toBe("cube");
    expect(cubeHint.suggestedMoves.length).toBeGreaterThan(0);
    expect(largeHint.supportLevel).toBe("strategy");
    expect(largeHint.suggestedMoves).toHaveLength(0);
    expect(pyraminxHint.puzzleType).toBe("pyraminx");
  });

  it("bounded 2x2 hint can find a nearby legal recovery", () => {
    const state = createSolvedCube(2);
    applyMoveToState(state, "R");
    const hint = getSmartHint(state, "move", 1);

    expect(hint.size).toBe(2);
    expect(hint.suggestedMoves.length).toBeGreaterThan(0);
  });

  it("ghost preview simulation does not mutate real cube state", () => {
    const adapter = getPuzzleAdapter("cube");
    const state = adapter.createState({ size: 3 });
    const before = adapter.getSignature(state);
    const preview = simulateSequence(adapter, state, ["R", "U"]);

    expect(adapter.getSignature(state)).toBe(before);
    expect(preview.signature).not.toBe(before);
  });

  it("known replay state rebuilds from scramble and moves deterministically", () => {
    const adapter = getPuzzleAdapter("cube");
    const session = createReplaySession({
      puzzleType: "cube",
      size: 3,
      scramble: ["R", "U"],
      moves: [
        { move: inverseMove("U", 3), source: "button", atMs: 100 },
        { move: inverseMove("R", 3), source: "keyboard", atMs: 200 }
      ],
      elapsedMs: 200,
      moveCount: 2
    });
    const rebuilt = buildReplayState(adapter, session, 2);

    expect(isSolved(rebuilt)).toBe(true);
  });

  it("daily challenge scrambles are stable by date and different across dates", () => {
    const dayA = new Date("2026-05-22T12:00:00");
    const dayB = new Date("2026-05-23T12:00:00");
    const first = createDailyChallenge("daily-3x3", dayA);
    const second = createDailyChallenge("daily-3x3", dayA);
    const next = createDailyChallenge("daily-3x3", dayB);

    expect(first.scramble).toEqual(second.scramble);
    expect(first.scramble.join(" ")).not.toBe(next.scramble.join(" "));
  });

  it("daily records and scoped stats persist counters and averages", () => {
    const challenge = createDailyChallenge("daily-2x2", new Date("2026-05-22T12:00:00"));
    let progress = recordDailyAttempt({}, challenge);
    progress = updateDailyRecord(progress, challenge, { elapsedMs: 42000, moveCount: 34 });

    let stats = recordAttempt({}, { puzzleType: "cube", size: 2 });
    stats = recordHint(stats, { puzzleType: "cube", size: 2 });
    stats = recordUndo(stats, { puzzleType: "cube", size: 2 });
    stats = recordSolve(stats, { puzzleType: "cube", size: 2 }, { elapsedMs: 42000, moveCount: 34 });
    const scoped = getScopedStats(stats, { puzzleType: "cube", size: 2 });

    expect(progress["daily-2x2"][challenge.date].completed).toBe(true);
    expect(scoped.attempts).toBe(1);
    expect(scoped.solves).toBe(1);
    expect(scoped.hintsUsed).toBe(1);
    expect(scoped.undosUsed).toBe(1);
    expect(scoped.averageMoves).toBe(34);
  });

  it("guide mistake detector catches a disturbed completed stage", () => {
    const state = createSolvedCube(3);
    const beforeSignature = getCubeSignature(state);
    const snapshot = captureGuideSnapshot(state, 1);

    applyMoveToState(state, "R");
    const warning = detectGuideMistake(snapshot, state, 1);
    applyMoveToState(state, "R'");

    expect(warning).toBeTruthy();
    expect(getCubeSignature(state)).toBe(beforeSignature);
  });
});
