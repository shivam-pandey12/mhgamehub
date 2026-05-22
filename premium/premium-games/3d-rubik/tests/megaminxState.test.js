import { describe, expect, it } from "vitest";
import { createWeeklyChallenge } from "../src/dailyChallengeManager.js";
import { getSmartHint } from "../src/hintEngine.js";
import { checkMissionSuccess, getMissionsForPuzzle } from "../src/missionManager.js";
import { MoveExecutor } from "../src/moveExecutor.js";
import { getPuzzleAdapter, getPuzzleType } from "../src/puzzleAdapters.js";
import { buildReplayState, createReplaySession } from "../src/replayManager.js";
import { buildSolveShareText } from "../src/shareResultManager.js";
import { getStatsForFilter, recordAttempt, recordSolve } from "../src/statsManager.js";
import {
  MEGAMINX_FACE_IDS,
  MEGAMINX_TOPOLOGY,
  applyMegaminxMoveToState,
  createSolvedMegaminx,
  generateMegaminxScramble,
  getAllMegaminxMoves,
  getMegaminxMovePieces,
  getMegaminxSignature,
  getMegaminxStickerCount,
  inverseMegaminxMove,
  isMegaminxSolved,
  parseMegaminxMove
} from "../src/megaminxState.js";

function applySequence(state, sequence) {
  sequence.forEach((move) => applyMegaminxMoveToState(state, move));
}

describe("megaminx state", () => {
  it("creates a solved topology-driven Megaminx", () => {
    const state = createSolvedMegaminx();

    expect(state.puzzleType).toBe("megaminx");
    expect(state.pieces.filter((piece) => piece.type === "center")).toHaveLength(12);
    expect(state.pieces.filter((piece) => piece.type === "edge")).toHaveLength(30);
    expect(state.pieces.filter((piece) => piece.type === "corner")).toHaveLength(20);
    expect(getMegaminxStickerCount(state)).toBe(132);
    expect(Object.keys(MEGAMINX_TOPOLOGY.faces)).toHaveLength(12);
    expect(isMegaminxSolved(state)).toBe(true);
  });

  it("has five ordered neighbors for every face and unique slots", () => {
    const state = createSolvedMegaminx();
    const edgeSlots = new Set(state.pieces.filter((piece) => piece.type === "edge").map((piece) => piece.slot));
    const cornerSlots = new Set(state.pieces.filter((piece) => piece.type === "corner").map((piece) => piece.slot));

    MEGAMINX_FACE_IDS.forEach((faceId) => {
      expect(MEGAMINX_TOPOLOGY.faces[faceId].neighborIds).toHaveLength(5);
      expect(MEGAMINX_TOPOLOGY.faces[faceId].edgeSlots).toHaveLength(5);
      expect(MEGAMINX_TOPOLOGY.faces[faceId].cornerSlots).toHaveLength(5);
    });
    expect(edgeSlots.size).toBe(30);
    expect(cornerSlots.size).toBe(20);
  });

  it.each(MEGAMINX_FACE_IDS)("%s plus inverse restores exact signature", (move) => {
    const state = createSolvedMegaminx();
    const before = getMegaminxSignature(state);

    applyMegaminxMoveToState(state, move);
    expect(isMegaminxSolved(state)).toBe(false);
    applyMegaminxMoveToState(state, inverseMegaminxMove(move));

    expect(getMegaminxSignature(state)).toBe(before);
    expect(isMegaminxSolved(state)).toBe(true);
  });

  it.each(MEGAMINX_FACE_IDS)("five repeated %s turns restore exact signature", (move) => {
    const state = createSolvedMegaminx();
    const before = getMegaminxSignature(state);

    applySequence(state, [move, move, move, move, move]);

    expect(getMegaminxSignature(state)).toBe(before);
    expect(isMegaminxSolved(state)).toBe(true);
  });

  it("rotates one face ring with 11 physical pieces", () => {
    const state = createSolvedMegaminx();

    expect(getMegaminxMovePieces(state, "F1")).toHaveLength(11);
  });

  it("parses face labels and quick visible-face notation", () => {
    expect(parseMegaminxMove("F12'").faceId).toBe("F12");
    expect(parseMegaminxMove("U").faceId).toBe("F1");
    expect(parseMegaminxMove("B'").notation).toBe("B'");
  });

  it("generates legal 50-move scrambles without immediate same-face repetition", () => {
    const scramble = generateMegaminxScramble();

    expect(scramble).toHaveLength(50);
    scramble.forEach((move, index) => {
      expect(() => parseMegaminxMove(move)).not.toThrow();
      if (index > 0) {
        expect(parseMegaminxMove(move).faceId).not.toBe(parseMegaminxMove(scramble[index - 1]).faceId);
      }
    });
  });

  it("scramble plus inverse sequence returns solved", () => {
    const state = createSolvedMegaminx();
    const scramble = generateMegaminxScramble();
    const undo = scramble.slice().reverse().map(inverseMegaminxMove);

    applySequence(state, scramble);
    expect(isMegaminxSolved(state)).toBe(false);
    applySequence(state, undo);

    expect(isMegaminxSolved(state)).toBe(true);
  });

  it("routes Megaminx through the shared move executor adapter", async () => {
    const adapter = getPuzzleAdapter("megaminx");
    const state = adapter.createState();
    const renderer = {
      animateMove: async () => {},
      syncFromState: () => {},
      pulseLayer: () => {}
    };
    const executor = new MoveExecutor(state, renderer, {}, adapter);

    await executor.execute("F3", { animate: false });
    expect(isMegaminxSolved(state)).toBe(false);
    await executor.execute("F3'", { animate: false });
    expect(isMegaminxSolved(state)).toBe(true);
  });
});

describe("megaminx integration", () => {
  it("registers Megaminx as a first-class puzzle adapter", () => {
    const adapter = getPuzzleAdapter("megaminx");

    expect(getPuzzleType("megaminx").title).toBe("Megaminx");
    expect(adapter.getStatsId()).toBe("megaminx");
    expect(adapter.skinOptions.map(([id]) => id)).toEqual([
      "ivoryMegaminx",
      "classicMegaminx",
      "glassMegaminx",
      "darkMegaminx",
      "goldenArtifact"
    ]);
    expect(getAllMegaminxMoves()).toContain("F12'");
  });

  it("replay rebuild applies Megaminx scramble and moves deterministically", () => {
    const adapter = getPuzzleAdapter("megaminx");
    const session = createReplaySession({
      puzzleType: "megaminx",
      size: "megaminx",
      scramble: ["F1", "F2"],
      moves: [
        { move: { notation: "F2'", display: "F2'" }, source: "button", atMs: 700 },
        { move: { notation: "F1'", display: "F1'" }, source: "keyboard", atMs: 1200 }
      ]
    });
    const state = buildReplayState(adapter, session, 2);

    expect(isMegaminxSolved(state)).toBe(true);
  });

  it("weekly Megaminx challenge is seeded and stable", () => {
    const date = new Date("2026-05-22T12:00:00");
    const weeklyA = createWeeklyChallenge("weekly-megaminx", date);
    const weeklyB = createWeeklyChallenge("weekly-megaminx", new Date("2026-05-24T12:00:00"));

    expect(weeklyA.week).toBe(weeklyB.week);
    expect(weeklyA.scramble).toEqual(weeklyB.scramble);
    expect(weeklyA.scramble).toHaveLength(50);
  });

  it("Megaminx missions, hints, stats, and share labels stay separate", () => {
    const state = createSolvedMegaminx();
    const mission = getMissionsForPuzzle("megaminx")[0];
    let stats = recordAttempt({}, { puzzleType: "megaminx", size: "megaminx" });
    stats = recordSolve(stats, { puzzleType: "megaminx", size: "megaminx" }, { elapsedMs: 420000, moveCount: 143 });

    expect(mission.puzzleType).toBe("megaminx");
    expect(checkMissionSuccess(mission, state, { elapsedMs: 420000, moveCount: 143 })).toBe(true);
    expect(getSmartHint(state, "soft").puzzleType).toBe("megaminx");
    expect(getStatsForFilter(stats, "megaminx").solves).toBe(1);
    expect(buildSolveShareText({ puzzleLabel: "Megaminx", elapsedMs: 420000, moveCount: 143 })).toContain("Solved Megaminx");
  });
});
