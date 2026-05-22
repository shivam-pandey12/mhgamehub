import { FACE_DEFINITIONS, isSolved, vectorsEqual } from "./cubeState.js";
import { arePyraminxTipsSolved, isPyraminxFaceSolved, isPyraminxSolved } from "./pyraminxState.js";
import { isSkewbFaceSolved, isSkewbSolved } from "./skewbState.js";
import { isMirrorCubeShapeSolved, isMirrorCubeSolved } from "./mirrorCubeState.js";
import { isMegaminxFaceSolved, isMegaminxSolved } from "./megaminxState.js";

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

const PYRAMINX_STAGES = [
  {
    id: "pyraminxBasics",
    title: "Understand Pyraminx turns",
    goal: "Learn the four main vertex moves: U, L, R, and B.",
    objective: "Try a main turn, then undo it.",
    algorithm: "R U R'",
    detector: () => true
  },
  {
    id: "pyraminxOneFace",
    title: "Solve one face",
    goal: "Build one clean triangular face.",
    objective: "Make the ivory face solved and aligned.",
    algorithm: "Work around one vertex at a time.",
    detector: (state) => isPyraminxFaceSolved(state, "U")
  },
  {
    id: "pyraminxTips",
    title: "Orient the tips",
    goal: "Use lowercase tip turns to align the small corner tips.",
    objective: "All tips should match their adjacent faces.",
    algorithm: "u l r b as needed",
    detector: arePyraminxTipsSolved
  },
  {
    id: "pyraminxFinish",
    title: "Finish the Pyraminx",
    goal: "Return every triangular facelet to its solved location.",
    objective: "The whole Pyraminx should be solved.",
    algorithm: "Use short commutators and undo if needed.",
    detector: isPyraminxSolved
  }
];

const SKEWB_STAGES = [
  {
    id: "skewbBasics",
    title: "Understand Skewb turns",
    goal: "Skewb turns around cube corners, not flat cube faces.",
    objective: "Try R, L, U, or B, then undo it.",
    algorithm: "R U R'",
    detector: () => true
  },
  {
    id: "skewbOneFace",
    title: "Build one face",
    goal: "Create one clean solved face and keep its centers aligned.",
    objective: "Make the ivory face solved and aligned.",
    algorithm: "Work around one corner axis at a time.",
    detector: (state) => isSkewbFaceSolved(state, "U")
  },
  {
    id: "skewbCenters",
    title: "Watch center movement",
    goal: "Skewb centers move around turns, so solve them together with corners.",
    objective: "Keep face centers matched with their colors.",
    algorithm: "R L' R' L",
    detector: (state) => isSkewbFaceSolved(state, "U")
  },
  {
    id: "skewbFinish",
    title: "Finish the Skewb",
    goal: "Return every corner and center to solved orientation.",
    objective: "The whole Skewb should be solved.",
    algorithm: "Use short corner cycles and undo if needed.",
    detector: isSkewbSolved
  }
];

const MIRROR_CUBE_STAGES = [
  {
    id: "mirrorBasics",
    title: "Understand Mirror Cube shape",
    goal: "Mirror Cube uses 3x3 turns, but the solved target is a clean cube silhouette.",
    objective: "Try a simple face turn and notice how different block sizes move.",
    algorithm: "R U R'",
    detector: () => true
  },
  {
    id: "mirrorShape",
    title: "Restore the block silhouette",
    goal: "Find where each unusual block belongs by height, width, and depth.",
    objective: "The shape should become one clean cube again.",
    algorithm: "Solve centers, edges, and corners by shape clues.",
    detector: isMirrorCubeShapeSolved
  },
  {
    id: "mirrorFinish",
    title: "Finish orientation",
    goal: "Make sure every block is both in the right place and correctly oriented.",
    objective: "All pieces should match the solved shape exactly.",
    algorithm: "Use normal 3x3 move ideas, but judge progress by shape.",
    detector: isMirrorCubeSolved
  }
];

const MEGAMINX_STAGES = [
  {
    id: "megaminxBasics",
    title: "Understand Megaminx turns",
    goal: "Megaminx has 12 pentagonal faces, and each face turns by 72 degrees.",
    objective: "Try a face turn, then undo it. Use the face selector for all 12 faces.",
    algorithm: "F1 F1'",
    detector: () => true
  },
  {
    id: "megaminxOneFace",
    title: "Build one star face",
    goal: "Start with one face and build a clean star around its center.",
    objective: "Make the top Megaminx face solved and aligned.",
    algorithm: "Work one edge at a time around F1.",
    detector: (state) => isMegaminxFaceSolved(state, "F1")
  },
  {
    id: "megaminxLayers",
    title: "Solve in layers",
    goal: "Megaminx solving is like a longer 3x3 idea: one face, then layers, then final pieces.",
    objective: "Use legal face turns while preserving the solved star.",
    algorithm: "Advanced Megaminx guide is coming later.",
    detector: isMegaminxSolved
  },
  {
    id: "megaminxFinish",
    title: "Finish the Megaminx",
    goal: "Return all 12 faces and every piece to the solved dodecahedron.",
    objective: "The whole Megaminx should be solved.",
    algorithm: "Use undo/replay for known-path recovery.",
    detector: isMegaminxSolved
  }
];

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
  if (state.puzzleType === "pyraminx") {
    if (stageId === "pyraminxTips") {
      return { pieceIds: state.pieces.filter((piece) => piece.type === "tip").map((piece) => piece.id) };
    }

    if (stageId === "pyraminxOneFace") {
      return {
        pieceIds: state.pieces
          .filter((piece) => piece.stickers.some((sticker) => sticker.homeFace === "U"))
          .map((piece) => piece.id)
      };
    }

    return { pieceIds: state.pieces.slice(0, 8).map((piece) => piece.id) };
  }

  if (state.puzzleType === "skewb") {
    if (stageId === "skewbOneFace" || stageId === "skewbCenters") {
      return {
        pieceIds: state.pieces
          .filter((piece) => piece.stickers.some((sticker) => sticker.homeFace === "U"))
          .map((piece) => piece.id)
      };
    }

    return { pieceIds: state.pieces.map((piece) => piece.id) };
  }

  if (state.puzzleType === "mirrorCube") {
    return {
      cubieIds: state.cubies
        .filter((cubie) => cubie.type !== "core")
        .map((cubie) => cubie.id)
    };
  }

  if (state.puzzleType === "megaminx") {
    if (stageId === "megaminxOneFace") {
      return {
        pieceIds: state.pieces
          .filter((piece) => piece.stickers.some((sticker) => sticker.homeFace === "F1"))
          .map((piece) => piece.id)
      };
    }

    return { pieceIds: state.pieces.slice(0, 24).map((piece) => piece.id) };
  }

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
  if (size === "pyraminx") return PYRAMINX_STAGES;
  if (size === "skewb") return SKEWB_STAGES;
  if (size === "mirrorCube") return MIRROR_CUBE_STAGES;
  if (size === "megaminx") return MEGAMINX_STAGES;
  if (size === 3) return GUIDE_STAGES_3;
  if (size === 2) return GUIDE_STAGES_2;
  return [LARGE_CUBE_STAGE];
}

export function getGuideStatus(state, activeStageIndex = 0) {
  const guideKey = state.puzzleType === "pyraminx" || state.puzzleType === "skewb" || state.puzzleType === "mirrorCube" || state.puzzleType === "megaminx"
    ? state.puzzleType
    : state.size;
  const stages = getGuideStages(guideKey);
  const safeIndex = Math.min(Math.max(activeStageIndex, 0), stages.length - 1);
  const stage = stages[safeIndex];
  const completed = Boolean(stage.detector?.(state));
  const nextIncompleteIndex = stages.findIndex((candidate) => !candidate.detector?.(state));

  return {
    stage,
    stages,
    index: safeIndex,
    completed,
    unsupported: (state.puzzleType || "cube") === "cube" && state.size >= 4,
    targets: getTargetsForStage(state, stage.id),
    nextIncompleteIndex: nextIncompleteIndex === -1 ? stages.length - 1 : nextIncompleteIndex
  };
}
