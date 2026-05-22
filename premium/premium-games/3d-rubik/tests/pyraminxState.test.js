import { describe, expect, it } from "vitest";
import { MoveExecutor } from "../src/moveExecutor.js";
import { getPuzzleAdapter } from "../src/puzzleAdapters.js";
import {
  applyPyraminxMoveToState,
  createSolvedPyraminx,
  generatePyraminxScramble,
  getPyraminxDragCandidateMoves,
  getPyraminxMovePieces,
  getPyraminxSignature,
  getPyraminxStickerCount,
  inversePyraminxMove,
  isPyraminxSolved,
  parsePyraminxMove
} from "../src/pyraminxState.js";

function applySequence(state, sequence) {
  sequence.forEach((move) => applyPyraminxMoveToState(state, move));
}

describe("pyraminx state", () => {
  it("creates a solved 14-piece Pyraminx with 36 stickers", () => {
    const state = createSolvedPyraminx();

    expect(state.puzzleType).toBe("pyraminx");
    expect(state.pieces).toHaveLength(14);
    expect(getPyraminxStickerCount(state)).toBe(36);
    expect(isPyraminxSolved(state)).toBe(true);
  });

  it("keeps each physical slot occupied by exactly one piece", () => {
    const state = createSolvedPyraminx();

    expect(new Set(state.slots)).toHaveProperty("size", 14);
    expect(new Set(state.pieces.map((piece) => piece.id))).toHaveProperty("size", 14);
    expect(new Set(state.pieces.map((piece) => piece.slot))).toHaveProperty("size", 14);
  });

  it.each(["U", "L", "R", "B"])("%s plus inverse restores the solved state", (move) => {
    const state = createSolvedPyraminx();
    const before = getPyraminxSignature(state);

    applyPyraminxMoveToState(state, move);
    expect(isPyraminxSolved(state)).toBe(false);
    applyPyraminxMoveToState(state, inversePyraminxMove(move));

    expect(getPyraminxSignature(state)).toBe(before);
    expect(isPyraminxSolved(state)).toBe(true);
  });

  it.each(["U", "L", "R", "B"])("three repeated %s turns restore the Pyraminx", (move) => {
    const state = createSolvedPyraminx();
    const before = getPyraminxSignature(state);

    applySequence(state, [move, move, move]);

    expect(getPyraminxSignature(state)).toBe(before);
  });

  it.each(["u", "l", "r", "b"])("%s tip move plus inverse restores the solved state", (move) => {
    const state = createSolvedPyraminx();
    const before = getPyraminxSignature(state);

    applyPyraminxMoveToState(state, move);
    expect(isPyraminxSolved(state)).toBe(false);
    applyPyraminxMoveToState(state, inversePyraminxMove(move));
    expect(getPyraminxSignature(state)).toBe(before);
    expect(isPyraminxSolved(state)).toBe(true);
  });

  it.each(["u", "l", "r", "b"])("three repeated %s tip turns restore the Pyraminx", (move) => {
    const state = createSolvedPyraminx();
    const before = getPyraminxSignature(state);

    applySequence(state, [move, move, move]);
    expect(getPyraminxSignature(state)).toBe(before);
  });

  it("main turns rotate a real vertex layer and tip turns rotate only one tip", () => {
    const state = createSolvedPyraminx();

    expect(getPyraminxMovePieces(state, "R")).toHaveLength(5);
    expect(getPyraminxMovePieces(state, "r")).toHaveLength(1);
  });

  it("drag candidates separate tip pieces from lower main-layer pieces", () => {
    const state = createSolvedPyraminx();
    const tip = state.pieces.find((piece) => piece.id === "tip-R");
    const center = state.pieces.find((piece) => piece.id === "center-R");

    expect(getPyraminxDragCandidateMoves(tip.position, { pieceType: tip.type }).map((move) => move.notation))
      .toEqual(["r", "r'"]);
    expect(getPyraminxDragCandidateMoves(center.position, { pieceType: center.type }).map((move) => move.notation))
      .toEqual(["R", "R'"]);
  });

  it("generates legal scrambles without immediate same-vertex repetition", () => {
    const scramble = generatePyraminxScramble();

    expect(scramble).toHaveLength(11);
    scramble.forEach((move, index) => {
      expect(() => parsePyraminxMove(move)).not.toThrow();
      if (index > 0) {
        expect(move[0].toUpperCase()).not.toBe(scramble[index - 1][0].toUpperCase());
      }
    });
  });

  it("undoing a scramble sequence restores the solved state", () => {
    const state = createSolvedPyraminx();
    const scramble = generatePyraminxScramble();
    const undo = scramble.slice().reverse().map(inversePyraminxMove);

    applySequence(state, scramble);
    expect(isPyraminxSolved(state)).toBe(false);
    applySequence(state, undo);

    expect(isPyraminxSolved(state)).toBe(true);
  });

  it("routes through the shared move executor adapter", async () => {
    const adapter = getPuzzleAdapter("pyraminx");
    const state = adapter.createState();
    const renderer = {
      animateMove: async () => {},
      syncFromState: () => {},
      pulseLayer: () => {}
    };
    const executor = new MoveExecutor(state, renderer, {}, adapter);

    await executor.execute("L", { animate: false });
    expect(isPyraminxSolved(state)).toBe(false);
    await executor.execute("L'", { animate: false });
    expect(isPyraminxSolved(state)).toBe(true);
  });
});
