import { FACE_DEFINITIONS, isSolved, vectorsEqual } from "./cubeState.js";

const GUIDE_STAGES_3 = [
  {
    id: "notation",
    title: "Understand notation",
    goal: "Learn what U, D, L, R, F, and B mean.",
    objective: "Try a simple face turn, then undo it.",
    algorithm: "R U R' U'",
    detector: () => true
  },
  {
    id: "whiteCross",
    title: "Make the white cross",
    goal: "Place the four white edge pieces around the white center.",
    objective: "White edge pieces must match their side colors.",
    algorithm: "F R U R' U' F'",
    detector: isWhiteCrossSolved
  },
  {
    id: "whiteCorners",
    title: "Solve white corners",
    goal: "Complete the four white corner pieces.",
    objective: "Each white corner should sit in its solved position.",
    algorithm: "R U R' U'",
    detector: areWhiteCornersSolved
  },
  {
    id: "middleLayer",
    title: "Solve the middle layer",
    goal: "Insert the four non-yellow edge pieces into the middle.",
    objective: "Middle-layer edge pieces should match their centers.",
    algorithm: "U R U' R' U' F' U F",
    detector: isMiddleLayerSolved
  },
  {
    id: "yellowCross",
    title: "Make the yellow cross",
    goal: "Orient yellow edge stickers into a cross.",
    objective: "Only the yellow cross is required here.",
    algorithm: "F R U R' U' F'",
    detector: isYellowCrossSolved
  },
  {
    id: "yellowEdges",
    title: "Position yellow edges",
    goal: "Move yellow edge pieces to their correct sides.",
    objective: "Final-layer edges should be positioned correctly.",
    algorithm: "R U R' U R U2 R'",
    detector: isFinalLayerPositioned
  },
  {
    id: "yellowCorners",
    title: "Position yellow corners",
    goal: "Place final-layer corners before orienting them.",
    objective: "Corner positions matter before sticker orientation.",
    algorithm: "U R U' L' U R' U' L",
    detector: isFinalLayerPositioned
  },
  {
    id: "orientYellowCorners",
    title: "Orient yellow corners",
    goal: "Twist the final-layer corners without moving solved pieces.",
    objective: "Use the algorithm carefully one corner at a time.",
    algorithm: "R' D' R D",
    detector: isSolved
  },
  {
    id: "finish",
    title: "Finish the cube",
    goal: "Return every cubie to its solved position and orientation.",
    objective: "Check the full cube.",
    algorithm: "Use undo/reset if you want another run.",
    detector: isSolved
  }
];

const GUIDE_STAGES_2 = [
  {
    id: "basics2",
    title: "Understand 2x2 basics",
    goal: "A 2x2 has only corners, so every move changes corner positions.",
    objective: "Start by building one layer.",
    algorithm: "R U R' U'",
    detector: () => true
  },
  {
    id: "firstLayer2",
    title: "Solve the first layer",
    goal: "Build one clean white layer.",
    objective: "All first-layer corners should be solved.",
    algorithm: "R U R' U'",
    detector: isFirstLayerSolved
  },
  {
    id: "positionLastCorners2",
    title: "Position last-layer corners",
    goal: "Place the final corners before twisting them.",
    objective: "All corners should be in the correct locations.",
    algorithm: "U R U' L' U R' U' L",
    detector: areAllCubiesPositioned
  },
  {
    id: "orientLastCorners2",
    title: "Orient last-layer corners",
    goal: "Twist the final corners into place.",
    objective: "Finish all sticker orientations.",
    algorithm: "R' D' R D",
    detector: isSolved
  },
  {
    id: "finish2",
    title: "Finish the cube",
    goal: "Solve every corner.",
    objective: "The 2x2 should be fully solved.",
    algorithm: "Celebrate, then try a timed run.",
    detector: isSolved
  }
];

const LARGE_CUBE_STAGE = {
  id: "largeCubeIntro",
  title: "Large cube guide coming later",
  goal: "Large cube solving needs centers, paired edges, reduction, and parity handling.",
  objective: "Use Free Solve or Timed Challenge for now.",
  algorithm: "Strategy: solve centers, pair edges, reduce to 3x3, then handle parity.",
  detector: () => false
};

function hasSticker(cubie, face) {
  return cubie.stickers.some((sticker) => sticker.face === face);
}

function stickerByFace(cubie, face) {
  return cubie.stickers.find((sticker) => sticker.face === face);
}

function isCubieSolved(cubie) {
  return vectorsEqual(cubie.position, cubie.home) &&
    cubie.stickers.every((sticker) => vectorsEqual(sticker.normal, sticker.homeNormal));
}

function isEdge(cubie) {
  return cubie.stickers.length === 2;
}

function isCorner(cubie) {
  return cubie.stickers.length === 3;
}

export function isWhiteCrossSolved(state) {
  if (state.size !== 3) return false;
  return state.cubies
    .filter((cubie) => isEdge(cubie) && hasSticker(cubie, "U"))
    .every(isCubieSolved);
}

export function areWhiteCornersSolved(state) {
  if (state.size !== 3) return false;
  return state.cubies
    .filter((cubie) => isCorner(cubie) && hasSticker(cubie, "U"))
    .every(isCubieSolved);
}

export function isFirstLayerSolved(state) {
  const firstFace = "U";
  return state.cubies
    .filter((cubie) => hasSticker(cubie, firstFace))
    .every(isCubieSolved);
}

export function isMiddleLayerSolved(state) {
  if (state.size !== 3) return false;
  return state.cubies
    .filter((cubie) => isEdge(cubie) && !hasSticker(cubie, "U") && !hasSticker(cubie, "D"))
    .every(isCubieSolved);
}

export function isYellowCrossSolved(state) {
  if (state.size !== 3) return false;
  const downNormal = FACE_DEFINITIONS.D.normal;
  return state.cubies
    .filter((cubie) => isEdge(cubie) && hasSticker(cubie, "D"))
    .every((cubie) => vectorsEqual(stickerByFace(cubie, "D").normal, downNormal));
}

export function isFinalLayerPositioned(state) {
  if (state.size !== 3) return false;
  return state.cubies
    .filter((cubie) => hasSticker(cubie, "D"))
    .every((cubie) => vectorsEqual(cubie.position, cubie.home));
}

export function areAllCubiesPositioned(state) {
  return state.cubies.every((cubie) => vectorsEqual(cubie.position, cubie.home));
}

function getTargetsForStage(state, stageId) {
  if (state.size >= 4) {
    return { cubieIds: state.cubies.filter((cubie) => cubie.stickers.length >= 1).slice(0, 16).map((cubie) => cubie.id) };
  }

  if (stageId.includes("Cross") || stageId === "whiteCross" || stageId === "yellowCross") {
    const face = stageId === "yellowCross" ? "D" : "U";
    return { cubieIds: state.cubies.filter((cubie) => isEdge(cubie) && hasSticker(cubie, face)).map((cubie) => cubie.id) };
  }

  if (stageId.includes("Corner") || stageId.includes("corner") || stageId.includes("Layer")) {
    return { cubieIds: state.cubies.filter((cubie) => isCorner(cubie) && hasSticker(cubie, "U")).map((cubie) => cubie.id) };
  }

  return { cubieIds: [] };
}

export function getGuideStages(size) {
  if (size === 3) return GUIDE_STAGES_3;
  if (size === 2) return GUIDE_STAGES_2;
  return [LARGE_CUBE_STAGE];
}

export function getGuideStatus(state, activeStageIndex = 0) {
  const stages = getGuideStages(state.size);
  const safeIndex = Math.min(Math.max(activeStageIndex, 0), stages.length - 1);
  const stage = stages[safeIndex];
  const completed = Boolean(stage.detector?.(state));
  const nextIncompleteIndex = stages.findIndex((candidate) => !candidate.detector?.(state));

  return {
    stage,
    stages,
    index: safeIndex,
    completed,
    unsupported: state.size >= 4,
    targets: getTargetsForStage(state, stage.id),
    nextIncompleteIndex: nextIncompleteIndex === -1 ? stages.length - 1 : nextIncompleteIndex
  };
}
