import { describe, expect, it } from "vitest";
import {
  SUPPORTED_CUBE_SIZES,
  applyMoveToState,
  createSolvedCube,
  generateScramble,
  getAllBasicMoves,
  getAllSliceMoves,
  getCubeSignature,
  getDragCandidateMoves,
  getScrambleLength,
  getVisibleCubieCount,
  inverseMove,
  isSolved
} from "../src/cubeState.js";
import { getGuideStatus, isWhiteCrossSolved } from "../src/guideManager.js";
import { getHint } from "../src/hintManager.js";
import { checkMissionSuccess, getMission } from "../src/missionManager.js";
import { getPattern } from "../src/patternManager.js";
import { loadSelectedMode, loadSettings } from "../src/storage.js";

function applySequence(state, sequence) {
  sequence.forEach((move) => applyMoveToState(state, move));
}

describe("scalable cube state move logic", () => {
  it("creates solved visible-only cubes for every supported size", () => {
    SUPPORTED_CUBE_SIZES.forEach((size) => {
      const state = createSolvedCube(size);

      expect(state.size).toBe(size);
      expect(state.cubies).toHaveLength(getVisibleCubieCount(size));
      expect(isSolved(state)).toBe(true);
    });
  });

  it("outer move plus inverse returns to the previous state for every size", () => {
    SUPPORTED_CUBE_SIZES.forEach((size) => {
      getAllBasicMoves().forEach((move) => {
        const state = createSolvedCube(size);
        const before = getCubeSignature(state);

        applyMoveToState(state, move);
        expect(isSolved(state)).toBe(false);

        applyMoveToState(state, inverseMove(move, size));
        expect(getCubeSignature(state)).toBe(before);
        expect(isSolved(state)).toBe(true);
      });
    });
  });

  it("four repeated outer turns restore every cube size", () => {
    SUPPORTED_CUBE_SIZES.forEach((size) => {
      ["U", "D", "L", "R", "F", "B"].forEach((move) => {
        const state = createSolvedCube(size);
        const before = getCubeSignature(state);

        applySequence(state, [move, move, move, move]);

        expect(getCubeSignature(state)).toBe(before);
        expect(isSolved(state)).toBe(true);
      });
    });
  });

  it("double turns parse, apply, and undo as one stable notation move", () => {
    SUPPORTED_CUBE_SIZES.forEach((size) => {
      const state = createSolvedCube(size);
      const before = getCubeSignature(state);

      applyMoveToState(state, "R2");
      expect(isSolved(state)).toBe(false);

      applyMoveToState(state, inverseMove("R2", size));
      expect(getCubeSignature(state)).toBe(before);
      expect(isSolved(state)).toBe(true);
    });
  });

  it("slice moves rotate inner layers and can be undone for 3x3 and larger", () => {
    SUPPORTED_CUBE_SIZES.filter((size) => size >= 3).forEach((size) => {
      const layerIndex = Math.floor((size - 1) / 2);
      getAllSliceMoves(size, layerIndex).forEach((move) => {
        const state = createSolvedCube(size);
        const before = getCubeSignature(state);

        applyMoveToState(state, move);
        expect(getCubeSignature(state)).not.toBe(before);

        applyMoveToState(state, inverseMove(move, size));
        expect(getCubeSignature(state)).toBe(before);
        expect(isSolved(state)).toBe(true);
      });
    });
  });

  it("drag candidates keep the clicked face layer available and mark it as preferred", () => {
    const candidates = getDragCandidateMoves(
      { x: 1, y: 2, z: 3 },
      4,
      { x: 0, y: 0, z: 1 }
    );

    expect(candidates).toHaveLength(6);
    expect(candidates.filter((move) => move.axis === "z")).toHaveLength(2);
    expect(candidates.filter((move) => move.dragPriority === 1).map((move) => move.axis)).toEqual(["z", "z"]);
  });

  it("drag-generated layer move objects apply and undo cleanly", () => {
    const state = createSolvedCube(5);
    const before = getCubeSignature(state);
    const move = getDragCandidateMoves(
      { x: 1, y: 3, z: 4 },
      5,
      { x: 0, y: 0, z: 1 }
    ).find((candidate) => candidate.axis === "x" && candidate.quarterTurns === 1);

    applyMoveToState(state, move);
    expect(getCubeSignature(state)).not.toBe(before);

    applyMoveToState(state, inverseMove(move, state.size));
    expect(getCubeSignature(state)).toBe(before);
    expect(isSolved(state)).toBe(true);
  });

  it("scrambles use size-specific lengths and avoid immediate same-face repetition", () => {
    SUPPORTED_CUBE_SIZES.forEach((size) => {
      const scramble = generateScramble(size);

      expect(scramble).toHaveLength(getScrambleLength(size));
      scramble.forEach((move, index) => {
        expect(getAllBasicMoves()).toContain(move);
        if (index > 0) {
          expect(move[0]).not.toBe(scramble[index - 1][0]);
        }
      });
    });
  });

  it("guide status is honest by size and detects solved white cross on solved 3x3", () => {
    const three = createSolvedCube(3);
    const large = createSolvedCube(5);

    expect(isWhiteCrossSolved(three)).toBe(true);
    expect(getGuideStatus(three, 1).unsupported).toBe(false);
    expect(getGuideStatus(large, 0).unsupported).toBe(true);
  });

  it("hint manager returns size-aware non-solver guidance", () => {
    const largeState = createSolvedCube(6);
    applyMoveToState(largeState, "R");
    const largeHint = getHint(largeState, "soft", 0);
    const solvedHint = getHint(createSolvedCube(3), "move", 0);

    expect(largeHint.title).toContain("Large cube");
    expect(solvedHint.title).toBe("Solved");
  });

  it("mission and pattern definitions use legal local state checks", () => {
    const state = createSolvedCube(3);
    const mission = getMission("3x3-white-cross");
    const pattern = getPattern("checkerboard", 3);

    expect(checkMissionSuccess(mission, state, { moveCount: 0, elapsedMs: 0 })).toBe(true);
    expect(pattern.sequence).toContain("U2");
  });

  it("storage helpers fall back safely without browser localStorage", () => {
    expect(loadSelectedMode()).toBe("free");
    expect(loadSettings().animationSpeed).toBe("normal");
  });

  it("undoing a scramble sequence restores every supported cube size", () => {
    SUPPORTED_CUBE_SIZES.forEach((size) => {
      const state = createSolvedCube(size);
      const scramble = generateScramble(size);
      const undoSequence = scramble.slice().reverse().map((move) => inverseMove(move, size));

      applySequence(state, scramble);
      expect(isSolved(state)).toBe(false);

      applySequence(state, undoSequence);
      expect(isSolved(state)).toBe(true);
    });
  });

  it("stays stable after long random move runs and reverse replay", () => {
    SUPPORTED_CUBE_SIZES.forEach((size) => {
      const state = createSolvedCube(size);
      const moves = [...getAllBasicMoves(), ...getAllSliceMoves(size)];
      const sequence = Array.from({ length: 120 }, () => moves[Math.floor(Math.random() * moves.length)]);
      const undoSequence = sequence.slice().reverse().map((move) => inverseMove(move, size));

      applySequence(state, sequence);
      applySequence(state, undoSequence);

      expect(isSolved(state)).toBe(true);
    });
  });
});
