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
  applyMirrorCubeMoveToState,
  createSolvedMirrorCube,
  generateMirrorCubeScramble,
  getAllMirrorCubeMoves,
  getMirrorCubeBounds,
  getMirrorCubeDragCandidateMoves,
  getMirrorCubeMovePieces,
  getMirrorCubeSignature,
  inverseMirrorCubeMove,
  isMirrorCubeSolved,
  parseMirrorCubeMove
} from "../src/mirrorCubeState.js";

function applySequence(state, sequence) {
  sequence.forEach((move) => applyMirrorCubeMoveToState(state, move));
}

describe("mirror cube state", () => {
  it("creates a solved 27-piece Mirror Cube with varied dimensions", () => {
    const state = createSolvedMirrorCube();
    const dimensions = new Set(state.cubies.map((cubie) => `${cubie.dimensions.x},${cubie.dimensions.y},${cubie.dimensions.z}`));

    expect(state.puzzleType).toBe("mirrorCube");
    expect(state.cubies).toHaveLength(27);
    expect(dimensions.size).toBeGreaterThan(8);
    expect(isMirrorCubeSolved(state)).toBe(true);
  });

  it("forms a clean solved cube silhouette", () => {
    const bounds = getMirrorCubeBounds(createSolvedMirrorCube());

    expect(bounds.min.x).toBeCloseTo(-1.5, 6);
    expect(bounds.min.y).toBeCloseTo(-1.5, 6);
    expect(bounds.min.z).toBeCloseTo(-1.5, 6);
    expect(bounds.max.x).toBeCloseTo(1.5, 6);
    expect(bounds.max.y).toBeCloseTo(1.5, 6);
    expect(bounds.max.z).toBeCloseTo(1.5, 6);
  });

  it.each(["U", "D", "L", "R", "F", "B"])("%s plus inverse restores exact signature", (move) => {
    const state = createSolvedMirrorCube();
    const before = getMirrorCubeSignature(state);

    applyMirrorCubeMoveToState(state, move);
    expect(isMirrorCubeSolved(state)).toBe(false);
    applyMirrorCubeMoveToState(state, inverseMirrorCubeMove(move));

    expect(getMirrorCubeSignature(state)).toBe(before);
    expect(isMirrorCubeSolved(state)).toBe(true);
  });

  it.each(["U", "D", "L", "R", "F", "B"])("four repeated %s turns restore exact signature", (move) => {
    const state = createSolvedMirrorCube();
    const before = getMirrorCubeSignature(state);

    applySequence(state, [move, move, move, move]);

    expect(getMirrorCubeSignature(state)).toBe(before);
    expect(isMirrorCubeSolved(state)).toBe(true);
  });

  it("double turns behave as two quarter turns", () => {
    const doubleState = createSolvedMirrorCube();
    const twoTurnState = createSolvedMirrorCube();

    applyMirrorCubeMoveToState(doubleState, "R2");
    applySequence(twoTurnState, ["R", "R"]);

    expect(getMirrorCubeSignature(doubleState)).toBe(getMirrorCubeSignature(twoTurnState));
  });

  it("rotates one outer face layer with 9 pieces", () => {
    const state = createSolvedMirrorCube();

    expect(getMirrorCubeMovePieces(state, "R")).toHaveLength(9);
  });

  it("drag candidates use visible outer layers only", () => {
    const state = createSolvedMirrorCube();
    const corner = state.cubies.find((cubie) => cubie.id === "mirror-2-2-2");
    const core = state.cubies.find((cubie) => cubie.id === "mirror-1-1-1");

    expect(getMirrorCubeDragCandidateMoves(corner.position).map((move) => move.notation))
      .toEqual(expect.arrayContaining(["U", "U'", "R", "R'", "F", "F'"]));
    expect(getMirrorCubeDragCandidateMoves(core.position)).toHaveLength(0);
  });

  it("generates legal 20-move scrambles without immediate same-face repetition", () => {
    const scramble = generateMirrorCubeScramble();

    expect(scramble).toHaveLength(20);
    scramble.forEach((move, index) => {
      expect(() => parseMirrorCubeMove(move)).not.toThrow();
      if (index > 0) {
        expect(move[0]).not.toBe(scramble[index - 1][0]);
      }
    });
  });

  it("scramble plus inverse sequence returns solved", () => {
    const state = createSolvedMirrorCube();
    const scramble = generateMirrorCubeScramble();
    const undo = scramble.slice().reverse().map(inverseMirrorCubeMove);

    applySequence(state, scramble);
    expect(isMirrorCubeSolved(state)).toBe(false);
    applySequence(state, undo);

    expect(isMirrorCubeSolved(state)).toBe(true);
  });

  it("routes Mirror Cube through the shared move executor adapter", async () => {
    const adapter = getPuzzleAdapter("mirrorCube");
    const state = adapter.createState();
    const renderer = {
      animateMove: async () => {},
      syncFromState: () => {},
      pulseLayer: () => {}
    };
    const executor = new MoveExecutor(state, renderer, {}, adapter);

    await executor.execute("F", { animate: false });
    expect(isMirrorCubeSolved(state)).toBe(false);
    await executor.execute("F'", { animate: false });
    expect(isMirrorCubeSolved(state)).toBe(true);
  });
});

describe("mirror cube integration", () => {
  it("registers Mirror Cube as a first-class puzzle adapter", () => {
    const adapter = getPuzzleAdapter("mirrorCube");

    expect(getPuzzleType("mirrorCube").title).toBe("Mirror Cube");
    expect(adapter.getStatsId()).toBe("mirrorCube");
    expect(adapter.skinOptions.map(([id]) => id)).toEqual(["ivoryMirror", "goldenMirror", "silverMirror", "darkMirror"]);
    expect(getAllMirrorCubeMoves()).toContain("R2");
  });

  it("replay rebuild applies Mirror Cube scramble and moves deterministically", () => {
    const adapter = getPuzzleAdapter("mirrorCube");
    const session = createReplaySession({
      puzzleType: "mirrorCube",
      size: "mirrorCube",
      scramble: ["R", "U"],
      moves: [
        { move: { notation: "U'", display: "U'" }, source: "button", atMs: 700 },
        { move: { notation: "R'", display: "R'" }, source: "keyboard", atMs: 1200 }
      ]
    });
    const state = buildReplayState(adapter, session, 2);

    expect(isMirrorCubeSolved(state)).toBe(true);
  });

  it("daily and weekly Mirror Cube challenges are seeded and stable", () => {
    const date = new Date("2026-05-22T12:00:00");
    const dailyA = createDailyChallenge("daily-mirror-cube", date);
    const dailyB = createDailyChallenge("daily-mirror-cube", date);
    const weeklyA = createWeeklyChallenge("weekly-mirror-cube", date);
    const weeklyB = createWeeklyChallenge("weekly-mirror-cube", new Date("2026-05-24T12:00:00"));

    expect(dailyA.scramble).toEqual(dailyB.scramble);
    expect(weeklyA.week).toBe(weeklyB.week);
    expect(weeklyA.scramble).toEqual(weeklyB.scramble);
  });

  it("Mirror Cube missions, hints, stats, and share labels stay separate", () => {
    const state = createSolvedMirrorCube();
    const mission = getMissionsForPuzzle("mirrorCube")[0];
    let stats = recordAttempt({}, { puzzleType: "mirrorCube", size: "mirrorCube" });
    stats = recordSolve(stats, { puzzleType: "mirrorCube", size: "mirrorCube" }, { elapsedMs: 128000, moveCount: 73 });

    expect(mission.puzzleType).toBe("mirrorCube");
    expect(checkMissionSuccess(mission, state, { elapsedMs: 200000, moveCount: 90 })).toBe(true);
    expect(getSmartHint(state, "soft").puzzleType).toBe("mirrorCube");
    expect(getStatsForFilter(stats, "mirrorCube").solves).toBe(1);
    expect(buildSolveShareText({ puzzleLabel: "Mirror Cube", elapsedMs: 128000, moveCount: 73 })).toContain("Solved Mirror Cube");
  });
});
