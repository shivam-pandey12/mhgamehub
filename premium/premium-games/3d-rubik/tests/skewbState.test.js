import { describe, expect, it } from "vitest";
import { createDailyChallenge, createWeeklyChallenge } from "../src/dailyChallengeManager.js";
import { getSmartHint } from "../src/hintEngine.js";
import { checkMissionSuccess, getMissionsForPuzzle } from "../src/missionManager.js";
import { MoveExecutor } from "../src/moveExecutor.js";
import { getPuzzleAdapter, getPuzzleType } from "../src/puzzleAdapters.js";
import { buildReplayState, createReplaySession } from "../src/replayManager.js";
import { buildSolveShareText } from "../src/shareResultManager.js";
import { getStatsForFilter, recordAttempt, recordSolve } from "../src/statsManager.js";
import {
  applySkewbMoveToState,
  createSolvedSkewb,
  generateSkewbScramble,
  getSkewbDragCandidateMoves,
  getSkewbMovePieces,
  getSkewbSignature,
  getSkewbStickerCount,
  inverseSkewbMove,
  isSkewbSolved,
  parseSkewbMove
} from "../src/skewbState.js";

function applySequence(state, sequence) {
  sequence.forEach((move) => applySkewbMoveToState(state, move));
}

describe("skewb state", () => {
  it("creates a solved 14-piece Skewb with 30 stickers", () => {
    const state = createSolvedSkewb();

    expect(state.puzzleType).toBe("skewb");
    expect(state.pieces.filter((piece) => piece.type === "corner")).toHaveLength(8);
    expect(state.pieces.filter((piece) => piece.type === "center")).toHaveLength(6);
    expect(state.pieces).toHaveLength(14);
    expect(getSkewbStickerCount(state)).toBe(30);
    expect(isSkewbSolved(state)).toBe(true);
  });

  it("keeps every Skewb slot occupied once", () => {
    const state = createSolvedSkewb();

    expect(new Set(state.pieces.map((piece) => piece.id))).toHaveProperty("size", 14);
    expect(new Set(state.pieces.map((piece) => `${piece.slot.x},${piece.slot.y},${piece.slot.z}`))).toHaveProperty("size", 14);
  });

  it.each(["R", "L", "U", "B"])("%s plus inverse restores the solved signature", (move) => {
    const state = createSolvedSkewb();
    const before = getSkewbSignature(state);

    applySkewbMoveToState(state, move);
    expect(isSkewbSolved(state)).toBe(false);
    applySkewbMoveToState(state, inverseSkewbMove(move));

    expect(getSkewbSignature(state)).toBe(before);
    expect(isSkewbSolved(state)).toBe(true);
  });

  it.each(["R", "L", "U", "B"])("three repeated %s turns restore the Skewb", (move) => {
    const state = createSolvedSkewb();
    const before = getSkewbSignature(state);

    applySequence(state, [move, move, move]);

    expect(getSkewbSignature(state)).toBe(before);
    expect(isSkewbSolved(state)).toBe(true);
  });

  it("moves one corner layer with four corners and three centers", () => {
    const state = createSolvedSkewb();

    expect(getSkewbMovePieces(state, "R")).toHaveLength(7);
  });

  it("drag candidates come from the actual clicked Skewb piece", () => {
    const state = createSolvedSkewb();
    const corner = state.pieces.find((piece) => piece.id === "corner-111");
    const center = state.pieces.find((piece) => piece.id === "center-100");

    expect(getSkewbDragCandidateMoves(corner.position, { pieceType: corner.type }).map((move) => move.notation))
      .toContain("R");
    expect(getSkewbDragCandidateMoves(center.position, { pieceType: center.type }).map((move) => move.notation))
      .toContain("R");
  });

  it("generates legal scrambles without immediate same-axis repetition", () => {
    const scramble = generateSkewbScramble();

    expect(scramble.length).toBeGreaterThanOrEqual(10);
    expect(scramble.length).toBeLessThanOrEqual(12);
    scramble.forEach((move, index) => {
      expect(() => parseSkewbMove(move)).not.toThrow();
      if (index > 0) {
        expect(move[0]).not.toBe(scramble[index - 1][0]);
      }
    });
  });

  it("scramble plus inverse sequence returns solved", () => {
    const state = createSolvedSkewb();
    const scramble = generateSkewbScramble();
    const undo = scramble.slice().reverse().map(inverseSkewbMove);

    applySequence(state, scramble);
    expect(isSkewbSolved(state)).toBe(false);
    applySequence(state, undo);

    expect(isSkewbSolved(state)).toBe(true);
  });

  it("routes Skewb moves through the shared executor adapter", async () => {
    const adapter = getPuzzleAdapter("skewb");
    const state = adapter.createState();
    const renderer = {
      animateMove: async () => {},
      syncFromState: () => {},
      pulseLayer: () => {}
    };
    const executor = new MoveExecutor(state, renderer, {}, adapter);

    await executor.execute("L", { animate: false });
    expect(isSkewbSolved(state)).toBe(false);
    await executor.execute("L'", { animate: false });
    expect(isSkewbSolved(state)).toBe(true);
  });
});

describe("skewb integration", () => {
  it("registers Skewb as a first-class puzzle adapter", () => {
    const adapter = getPuzzleAdapter("skewb");

    expect(getPuzzleType("skewb").title).toBe("Skewb");
    expect(adapter.getStatsId()).toBe("skewb");
    expect(adapter.getPlayableMoves().map((move) => move.notation)).toEqual(["R", "R'", "L", "L'", "U", "U'", "B", "B'"]);
  });

  it("replay rebuild applies Skewb scramble and moves deterministically", () => {
    const adapter = getPuzzleAdapter("skewb");
    const session = createReplaySession({
      puzzleType: "skewb",
      size: "skewb",
      scramble: ["R", "U"],
      moves: [
        { move: { notation: "U'", display: "U'" }, source: "button", atMs: 800 },
        { move: { notation: "R'", display: "R'" }, source: "keyboard", atMs: 1400 }
      ]
    });
    const state = buildReplayState(adapter, session, 2);

    expect(isSkewbSolved(state)).toBe(true);
  });

  it("daily and weekly Skewb challenges are seeded and stable", () => {
    const date = new Date("2026-05-22T12:00:00");
    const dailyA = createDailyChallenge("daily-skewb", date);
    const dailyB = createDailyChallenge("daily-skewb", date);
    const weeklyA = createWeeklyChallenge("weekly-skewb", date);
    const weeklyB = createWeeklyChallenge("weekly-skewb", new Date("2026-05-24T12:00:00"));

    expect(dailyA.scramble).toEqual(dailyB.scramble);
    expect(weeklyA.week).toBe(weeklyB.week);
    expect(weeklyA.scramble).toEqual(weeklyB.scramble);
  });

  it("Skewb missions, hints, stats, and share labels stay separate", () => {
    const state = createSolvedSkewb();
    const mission = getMissionsForPuzzle("skewb")[0];
    let stats = recordAttempt({}, { puzzleType: "skewb", size: "skewb" });
    stats = recordSolve(stats, { puzzleType: "skewb", size: "skewb" }, { elapsedMs: 64000, moveCount: 42 });

    expect(mission.puzzleType).toBe("skewb");
    expect(checkMissionSuccess(mission, state, { elapsedMs: 60000, moveCount: 40 })).toBe(true);
    expect(getSmartHint(state, "soft").puzzleType).toBe("skewb");
    expect(getStatsForFilter(stats, "skewb").solves).toBe(1);
    expect(buildSolveShareText({ puzzleLabel: "Skewb", elapsedMs: 58000, moveCount: 31 })).toContain("Solved Skewb");
  });
});
