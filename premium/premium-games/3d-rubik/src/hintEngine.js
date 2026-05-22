import {
  applyMoveToState,
  cloneCubeState,
  getAllBasicMoves,
  isSolved
} from "./cubeState.js";
import {
  areAllCubiesPositioned,
  areWhiteCornersSolved,
  getGuideStatus,
  isFinalLayerPositioned,
  isFirstLayerSolved,
  isMiddleLayerSolved,
  isWhiteCrossSolved,
  isYellowCrossSolved
} from "./guideManager.js";
import {
  arePyraminxTipsSolved,
  isPyraminxFaceSolved,
  isPyraminxSolved
} from "./pyraminxState.js";
import { isSkewbFaceSolved, isSkewbSolved } from "./skewbState.js";
import { isMirrorCubeShapeSolved, isMirrorCubeSolved } from "./mirrorCubeState.js";
import { isMegaminxFaceSolved, isMegaminxSolved } from "./megaminxState.js";

const HINT_LEVELS = {
  soft: "Soft Hint",
  visual: "Visual Hint",
  move: "Move Hint",
  auto: "Auto Move"
};

const BASIC_3X3_ALGORITHMS = {
  whiteCross: ["F", "R", "U", "R'", "U'", "F'"],
  whiteCorners: ["R", "U", "R'", "U'"],
  middleLayer: ["U", "R", "U'", "R'", "U'", "F'", "U", "F"],
  yellowCross: ["F", "R", "U", "R'", "U'", "F'"],
  yellowEdges: ["R", "U", "R'", "U", "R", "U2", "R'"],
  yellowCorners: ["U", "R", "U'", "L'", "U", "R'", "U'", "L"],
  orientYellowCorners: ["R'", "D'", "R", "D"]
};

const BASIC_2X2_ALGORITHMS = {
  firstLayer2: ["R", "U", "R'", "U'"],
  positionLastCorners2: ["U", "R", "U'", "L'", "U", "R'", "U'", "L"],
  orientLastCorners2: ["R'", "D'", "R", "D"]
};

function normalizeLevel(level) {
  return HINT_LEVELS[level] ? level : "soft";
}

function describeMoves(moves = []) {
  return moves.length ? moves.join(" ") : "";
}

function makeHint({
  state,
  level = "soft",
  stageId = "general",
  title,
  explanation,
  targets = { cubieIds: [] },
  suggestedMoves = [],
  confidence = "medium",
  supportLevel = "educational"
}) {
  const normalizedLevel = normalizeLevel(level);
  const moves = normalizedLevel === "move" || normalizedLevel === "auto"
    ? suggestedMoves
    : [];
  const algorithm = describeMoves(suggestedMoves);

  return {
    puzzleType: state.puzzleType || "cube",
    size: state.puzzleType && state.puzzleType !== "cube" ? state.puzzleType : state.size,
    stageId,
    title,
    explanation,
    text: explanation,
    targets,
    suggestedMoves: moves,
    moves,
    algorithm,
    confidence,
    supportLevel,
    level: normalizedLevel,
    levelLabel: HINT_LEVELS[normalizedLevel]
  };
}

function findBounded2x2Solution(state, { maxDepth = 4, timeoutMs = 18 } = {}) {
  const startedAt = performance.now?.() || Date.now();
  const moves = getAllBasicMoves().flatMap((move) => [move, `${move}'`, `${move}2`]);
  const start = cloneCubeState(state);
  const queue = [{ state: start, path: [], previousFace: "" }];
  const seen = new Set();

  while (queue.length) {
    const elapsed = (performance.now?.() || Date.now()) - startedAt;
    if (elapsed > timeoutMs) {
      return [];
    }

    const current = queue.shift();
    if (isSolved(current.state)) {
      return current.path;
    }

    if (current.path.length >= maxDepth) {
      continue;
    }

    for (const move of moves) {
      const face = move[0];
      if (face === current.previousFace) {
        continue;
      }
      const nextState = cloneCubeState(current.state);
      applyMoveToState(nextState, move);
      const signature = JSON.stringify(nextState.cubies.map((cubie) => `${cubie.id}:${cubie.position.x},${cubie.position.y},${cubie.position.z}:${cubie.stickers.map((sticker) => `${sticker.face}${sticker.normal.x}${sticker.normal.y}${sticker.normal.z}`).join("")}`));
      if (seen.has(signature)) {
        continue;
      }
      seen.add(signature);
      queue.push({ state: nextState, path: [...current.path, move], previousFace: face });
    }
  }

  return [];
}

function getCube3Hint(state, level, activeStageIndex) {
  const guide = getGuideStatus(state, activeStageIndex);

  if (isSolved(state)) {
    return makeHint({
      state,
      level,
      stageId: "solved",
      title: "Solved",
      explanation: "The cube is solved. Try a timed challenge, daily challenge, or replay the solve.",
      targets: guide.targets,
      suggestedMoves: [],
      confidence: "high",
      supportLevel: "complete"
    });
  }

  if (!isWhiteCrossSolved(state)) {
    return makeHint({
      state,
      level,
      stageId: "whiteCross",
      title: "Build the white cross",
      explanation: "Find the four white edge pieces first. Place each white edge on the white face, then align its side color with the matching center.",
      targets: guide.stage.id === "whiteCross" ? guide.targets : getGuideStatus(state, 1).targets,
      suggestedMoves: BASIC_3X3_ALGORITHMS.whiteCross,
      confidence: "medium",
      supportLevel: "stage"
    });
  }

  if (!areWhiteCornersSolved(state)) {
    return makeHint({
      state,
      level,
      stageId: "whiteCorners",
      title: "Insert white corners",
      explanation: "Look for a white corner, place it above its target slot, then repeat the right-hand insert until the corner drops in correctly.",
      targets: getGuideStatus(state, 2).targets,
      suggestedMoves: BASIC_3X3_ALGORITHMS.whiteCorners,
      confidence: "medium",
      supportLevel: "stage"
    });
  }

  if (!isMiddleLayerSolved(state)) {
    return makeHint({
      state,
      level,
      stageId: "middleLayer",
      title: "Solve middle-layer edges",
      explanation: "Choose a top-layer edge without yellow, match its front color to a center, then insert the edge left or right without breaking the first layer.",
      targets: getGuideStatus(state, 3).targets,
      suggestedMoves: BASIC_3X3_ALGORITHMS.middleLayer,
      confidence: "medium",
      supportLevel: "stage"
    });
  }

  if (!isYellowCrossSolved(state)) {
    return makeHint({
      state,
      level,
      stageId: "yellowCross",
      title: "Make the yellow cross",
      explanation: "Use the yellow-cross algorithm until the yellow edge stickers form a line, L-shape, then a cross.",
      targets: getGuideStatus(state, 4).targets,
      suggestedMoves: BASIC_3X3_ALGORITHMS.yellowCross,
      confidence: "medium",
      supportLevel: "stage"
    });
  }

  if (!isFinalLayerPositioned(state)) {
    return makeHint({
      state,
      level,
      stageId: "yellowEdges",
      title: "Position the last-layer pieces",
      explanation: "The yellow cross exists. Now cycle final-layer pieces until they sit over their matching side colors.",
      targets: getGuideStatus(state, 5).targets,
      suggestedMoves: BASIC_3X3_ALGORITHMS.yellowEdges,
      confidence: "medium",
      supportLevel: "stage"
    });
  }

  return makeHint({
    state,
    level,
    stageId: "orientYellowCorners",
    title: "Orient final corners",
    explanation: "The remaining work is final orientation. Keep the cube grip stable, twist one corner at a time, and stop when the full cube is solved.",
    targets: getGuideStatus(state, 7).targets,
    suggestedMoves: BASIC_3X3_ALGORITHMS.orientYellowCorners,
    confidence: "low",
    supportLevel: "honest-fallback"
  });
}

function getCube2Hint(state, level, activeStageIndex) {
  const guide = getGuideStatus(state, activeStageIndex);

  if (isSolved(state)) {
    return makeHint({
      state,
      level,
      stageId: "solved2",
      title: "Solved",
      explanation: "The 2x2 is solved. Try a faster run or the daily 2x2.",
      targets: guide.targets,
      confidence: "high",
      supportLevel: "complete"
    });
  }

  const boundedSolution = findBounded2x2Solution(state);
  if (boundedSolution.length) {
    return makeHint({
      state,
      level,
      stageId: "bounded2x2",
      title: "Short 2x2 recovery found",
      explanation: "This position is close enough for a bounded helper. Preview the first move, or apply the short sequence if you want assisted practice.",
      targets: guide.targets,
      suggestedMoves: boundedSolution,
      confidence: "high",
      supportLevel: "bounded-search"
    });
  }

  if (!isFirstLayerSolved(state)) {
    return makeHint({
      state,
      level,
      stageId: "firstLayer2",
      title: "Build one 2x2 layer",
      explanation: "Pick one color as your base and solve all four corners around it. Because there are no edges, every move changes corner placement.",
      targets: getGuideStatus(state, 1).targets,
      suggestedMoves: BASIC_2X2_ALGORITHMS.firstLayer2,
      confidence: "medium",
      supportLevel: "stage"
    });
  }

  if (!areAllCubiesPositioned(state)) {
    return makeHint({
      state,
      level,
      stageId: "positionLastCorners2",
      title: "Position last-layer corners",
      explanation: "Keep your solved layer intact and cycle the top corners until they sit above the correct slots.",
      targets: getGuideStatus(state, 2).targets,
      suggestedMoves: BASIC_2X2_ALGORITHMS.positionLastCorners2,
      confidence: "medium",
      supportLevel: "stage"
    });
  }

  return makeHint({
    state,
    level,
    stageId: "orientLastCorners2",
    title: "Orient last-layer corners",
    explanation: "The last pieces are positioned. Use a corner-orientation trigger carefully and stop as soon as the 2x2 is solved.",
    targets: getGuideStatus(state, 3).targets,
    suggestedMoves: BASIC_2X2_ALGORITHMS.orientLastCorners2,
    confidence: "low",
    supportLevel: "honest-fallback"
  });
}

function getLargeCubeHint(state, level, activeStageIndex) {
  const guide = getGuideStatus(state, activeStageIndex);
  return makeHint({
    state,
    level,
    stageId: "largeCubeStrategy",
    title: "Large cube strategy",
    explanation: "For 4x4 and larger, solve centers first, pair edges next, reduce the puzzle to a 3x3, then watch for parity. This phase does not fake a full big-cube solver.",
    targets: guide.targets,
    suggestedMoves: [],
    confidence: "high",
    supportLevel: "strategy"
  });
}

function getPyraminxHint(state, level, activeStageIndex) {
  const guide = getGuideStatus(state, activeStageIndex);

  if (isPyraminxSolved(state)) {
    return makeHint({
      state,
      level,
      stageId: "pyraminxSolved",
      title: "Solved",
      explanation: "The Pyraminx is solved. Try the daily Pyraminx or a timed run.",
      targets: guide.targets,
      confidence: "high",
      supportLevel: "complete"
    });
  }

  if (!isPyraminxFaceSolved(state, "U")) {
    return makeHint({
      state,
      level,
      stageId: "pyraminxOneFace",
      title: "Build one Pyraminx face",
      explanation: "Start with one triangular face. Turn the main vertices around it and keep the matching side colors aligned.",
      targets: getGuideStatus(state, 1).targets,
      suggestedMoves: ["R", "U", "R'"],
      confidence: "medium",
      supportLevel: "basic-guide"
    });
  }

  if (!arePyraminxTipsSolved(state)) {
    return makeHint({
      state,
      level,
      stageId: "pyraminxTips",
      title: "Orient the tips",
      explanation: "Lowercase tip moves rotate only corner tips. Align them before finishing the larger pieces.",
      targets: getGuideStatus(state, 2).targets,
      suggestedMoves: ["u", "l", "r", "b"],
      confidence: "medium",
      supportLevel: "basic-guide"
    });
  }

  return makeHint({
    state,
    level,
    stageId: "pyraminxFinish",
    title: "Finish the last Pyraminx pieces",
    explanation: "Use short vertex cycles and watch how three pieces move around a corner. Full Pyraminx solving remains an honest guided aid, not a fake solver.",
    targets: getGuideStatus(state, 3).targets,
    suggestedMoves: ["R", "U", "R'"],
    confidence: "low",
    supportLevel: "honest-fallback"
  });
}

function getSkewbHint(state, level, activeStageIndex) {
  const guide = getGuideStatus(state, activeStageIndex);

  if (isSkewbSolved(state)) {
    return makeHint({
      state,
      level,
      stageId: "skewbSolved",
      title: "Solved",
      explanation: "The Skewb is solved. Try a timed run, daily Skewb, or replay the solve.",
      targets: guide.targets,
      confidence: "high",
      supportLevel: "complete"
    });
  }

  if (!isSkewbFaceSolved(state, "U")) {
    return makeHint({
      state,
      level,
      stageId: "skewbOneFace",
      title: "Build one Skewb face",
      explanation: "Start by making one clean face. Skewb turns move a corner and three centers, so watch how the center colors travel with each corner turn.",
      targets: getGuideStatus(state, 1).targets,
      suggestedMoves: ["R", "U", "R'"],
      confidence: "medium",
      supportLevel: "basic-guide"
    });
  }

  return makeHint({
    state,
    level,
    stageId: "skewbFinish",
    title: "Finish centers and corners",
    explanation: "Your first face is stable. Now use short corner cycles to bring the remaining centers and corners home. This is an honest beginner aid, not a full Skewb solver yet.",
    targets: getGuideStatus(state, 3).targets,
    suggestedMoves: ["R", "L'", "R'", "L"],
    confidence: "low",
    supportLevel: "honest-fallback"
  });
}

function getMirrorCubeHint(state, level, activeStageIndex) {
  const guide = getGuideStatus(state, activeStageIndex);

  if (isMirrorCubeSolved(state)) {
    return makeHint({
      state,
      level,
      stageId: "mirrorSolved",
      title: "Solved",
      explanation: "The Mirror Cube is solved. The clean cube silhouette is restored.",
      targets: guide.targets,
      confidence: "high",
      supportLevel: "complete"
    });
  }

  if (!isMirrorCubeShapeSolved(state)) {
    return makeHint({
      state,
      level,
      stageId: "mirrorShape",
      title: "Solve by shape, not color",
      explanation: "Look for blocks whose height, width, and depth obviously match one solved slot. Treat the moves like a 3x3, but judge each piece by the silhouette it creates.",
      targets: guide.targets,
      suggestedMoves: ["R", "U", "R'"],
      confidence: "medium",
      supportLevel: "basic-guide"
    });
  }

  return makeHint({
    state,
    level,
    stageId: "mirrorFinish",
    title: "Finish orientation",
    explanation: "The shape is nearly restored. If a block looks placed but angled wrong, use normal 3x3-style triggers and watch the silhouette carefully.",
    targets: guide.targets,
    suggestedMoves: ["R", "U", "R'", "U'"],
    confidence: "low",
    supportLevel: "honest-fallback"
  });
}

function getMegaminxHint(state, level, activeStageIndex) {
  const guide = getGuideStatus(state, activeStageIndex);

  if (isMegaminxSolved(state)) {
    return makeHint({
      state,
      level,
      stageId: "megaminxSolved",
      title: "Solved",
      explanation: "The Megaminx is solved. That is a long-form solve worth replaying.",
      targets: guide.targets,
      confidence: "high",
      supportLevel: "complete"
    });
  }

  if (!isMegaminxFaceSolved(state, "F1")) {
    return makeHint({
      state,
      level,
      stageId: "megaminxOneFace",
      title: "Build one Megaminx star",
      explanation: "Start with the top face. Pair the five surrounding edge pieces into a clean star before trying to solve deeper layers.",
      targets: getGuideStatus(state, 1).targets,
      suggestedMoves: ["F1", "F2", "F1'"],
      confidence: "medium",
      supportLevel: "basic-guide"
    });
  }

  return makeHint({
    state,
    level,
    stageId: "megaminxStrategy",
    title: "Work around the dodecahedron",
    explanation: "Keep the solved star protected, solve adjacent layers, and use the face selector for controlled 72-degree turns. This phase gives honest strategy help, not a full Megaminx solver.",
    targets: guide.targets,
    suggestedMoves: ["F3", "F1", "F3'"],
    confidence: "low",
    supportLevel: "honest-fallback"
  });
}

export function getSmartHint(state, level = "soft", activeStageIndex = 0) {
  if (state.puzzleType === "pyraminx") {
    return getPyraminxHint(state, level, activeStageIndex);
  }

  if (state.puzzleType === "skewb") {
    return getSkewbHint(state, level, activeStageIndex);
  }

  if (state.puzzleType === "mirrorCube") {
    return getMirrorCubeHint(state, level, activeStageIndex);
  }

  if (state.puzzleType === "megaminx") {
    return getMegaminxHint(state, level, activeStageIndex);
  }

  if (state.size >= 4) {
    return getLargeCubeHint(state, level, activeStageIndex);
  }

  if (state.size === 2) {
    return getCube2Hint(state, level, activeStageIndex);
  }

  return getCube3Hint(state, level, activeStageIndex);
}
