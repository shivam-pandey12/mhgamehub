import {
  areWhiteCornersSolved,
  isFirstLayerSolved,
  isWhiteCrossSolved,
  isYellowCrossSolved
} from "./guideManager.js";
import { isSolved } from "./cubeState.js";
import { arePyraminxTipsSolved, isPyraminxSolved } from "./pyraminxState.js";
import { isSkewbSolved } from "./skewbState.js";
import { isMirrorCubeSolved } from "./mirrorCubeState.js";
import { isMegaminxSolved } from "./megaminxState.js";

export const MISSIONS = [
  {
    id: "2x2-under-2",
    title: "2x2 Under 2 Minutes",
    size: 2,
    type: "Speed",
    difficulty: "Beginner",
    objective: "Solve the 2x2 in under 2 minutes.",
    scramble: ["R", "U", "R'", "F", "U'", "R", "U2"],
    timeLimitMs: 120000,
    condition: "solved"
  },
  {
    id: "2x2-first-layer",
    title: "2x2 First Layer",
    size: 2,
    type: "Beginner",
    difficulty: "Easy",
    objective: "Complete a clean first layer.",
    scramble: ["R", "U", "R'", "U'", "F", "R"],
    condition: "firstLayer"
  },
  {
    id: "3x3-white-cross",
    title: "Make White Cross",
    size: 3,
    type: "Beginner",
    difficulty: "Easy",
    objective: "Solve the white cross in 12 moves or fewer.",
    scramble: ["F", "R", "U", "R'", "U'", "F'"],
    moveLimit: 12,
    condition: "whiteCross"
  },
  {
    id: "3x3-white-corners",
    title: "Solve White Corners",
    size: 3,
    type: "Beginner",
    difficulty: "Medium",
    objective: "Complete the white corners.",
    scramble: ["R", "U", "R'", "U'", "L'", "U", "L"],
    condition: "whiteCorners"
  },
  {
    id: "3x3-first-layer",
    title: "Complete First Layer",
    size: 3,
    type: "Move Limit",
    difficulty: "Medium",
    objective: "Solve the first layer in 35 moves or fewer.",
    scramble: ["R", "U", "R'", "U'", "F", "U", "F'"],
    moveLimit: 35,
    condition: "firstLayer"
  },
  {
    id: "3x3-yellow-cross",
    title: "Complete Yellow Cross",
    size: 3,
    type: "Beginner",
    difficulty: "Medium",
    objective: "Create the yellow cross.",
    scramble: ["F", "R", "U", "R'", "U'", "F'", "U2"],
    condition: "yellowCross"
  },
  {
    id: "3x3-under-5",
    title: "3x3 Under 5 Minutes",
    size: 3,
    type: "Speed",
    difficulty: "Challenge",
    objective: "Solve the 3x3 in under 5 minutes.",
    timeLimitMs: 300000,
    condition: "solved"
  },
  {
    id: "3x3-under-100",
    title: "3x3 Under 100 Moves",
    size: 3,
    type: "Move Limit",
    difficulty: "Challenge",
    objective: "Solve the 3x3 in under 100 moves.",
    moveLimit: 100,
    condition: "solved"
  },
  {
    id: "checkerboard-pattern",
    title: "Create Checkerboard",
    size: 3,
    type: "Pattern",
    difficulty: "Classic",
    objective: "Apply the checkerboard pattern, then return to solved when ready.",
    patternId: "checkerboard",
    condition: "pattern"
  },
  {
    id: "4x4-timed",
    title: "4x4 Timed Solve",
    size: 4,
    type: "Large Cube",
    difficulty: "Advanced",
    objective: "Complete a legal 4x4 timed solve.",
    condition: "solved"
  },
  {
    id: "5x5-timed",
    title: "5x5 Timed Solve",
    size: 5,
    type: "Large Cube",
    difficulty: "Strategic",
    objective: "Complete a legal 5x5 timed solve.",
    condition: "solved"
  },
  {
    id: "6x6-timed",
    title: "6x6 Timed Solve",
    size: 6,
    type: "Large Cube",
    difficulty: "Expert",
    objective: "Complete a legal 6x6 timed solve.",
    condition: "solved"
  },
  {
    id: "7x7-timed",
    title: "7x7 Timed Solve",
    size: 7,
    type: "Large Cube",
    difficulty: "Master",
    objective: "Complete a legal 7x7 timed solve.",
    condition: "solved"
  },
  {
    id: "pyraminx-under-2",
    title: "Pyraminx Under 2 Minutes",
    puzzleType: "pyraminx",
    type: "Speed",
    difficulty: "Beginner",
    objective: "Solve the Pyraminx in under 2 minutes.",
    scramble: ["R", "U", "R'", "L", "B", "U'"],
    timeLimitMs: 120000,
    condition: "solved"
  },
  {
    id: "pyraminx-under-60",
    title: "Pyraminx Under 60 Moves",
    puzzleType: "pyraminx",
    type: "Move Limit",
    difficulty: "Easy",
    objective: "Solve the Pyraminx in under 60 moves.",
    moveLimit: 60,
    condition: "solved"
  },
  {
    id: "pyraminx-easy-recovery",
    title: "Easy Pyraminx Recovery",
    puzzleType: "pyraminx",
    type: "Beginner",
    difficulty: "Easy",
    objective: "Finish a short legal Pyraminx scramble.",
    scramble: ["R", "U", "L'", "B", "U'"],
    condition: "solved"
  },
  {
    id: "pyraminx-tips",
    title: "Solve The Tips",
    puzzleType: "pyraminx",
    type: "Tips",
    difficulty: "Easy",
    objective: "Return the Pyraminx tips to solved orientation.",
    scramble: ["u", "l'", "r", "b'"],
    condition: "tips"
  },
  {
    id: "skewb-under-2",
    title: "Skewb Under 2 Minutes",
    puzzleType: "skewb",
    type: "Speed",
    difficulty: "Medium",
    objective: "Solve the Skewb in under 2 minutes.",
    scramble: ["R", "U", "R'", "L", "B", "U'"],
    timeLimitMs: 120000,
    condition: "solved"
  },
  {
    id: "skewb-under-60",
    title: "Skewb Under 60 Moves",
    puzzleType: "skewb",
    type: "Move Limit",
    difficulty: "Medium",
    objective: "Solve the Skewb in under 60 moves.",
    moveLimit: 60,
    condition: "solved"
  },
  {
    id: "skewb-easy-recovery",
    title: "Easy Skewb Recovery",
    puzzleType: "skewb",
    type: "Beginner",
    difficulty: "Easy",
    objective: "Finish a short legal Skewb scramble.",
    scramble: ["R", "U", "L'", "B", "R'"],
    condition: "solved"
  },
  {
    id: "skewb-5-move",
    title: "Five-Move Skewb",
    puzzleType: "skewb",
    type: "Beginner",
    difficulty: "Easy",
    objective: "Recover from a compact five-move Skewb scramble.",
    scramble: ["R", "L'", "U", "B'", "R"],
    condition: "solved"
  },
  {
    id: "skewb-10-move",
    title: "Ten-Move Skewb Challenge",
    puzzleType: "skewb",
    type: "Challenge",
    difficulty: "Medium",
    objective: "Recover from a 10-move Skewb challenge scramble.",
    scramble: ["R", "U", "B'", "L", "R'", "B", "U'", "L'", "R", "U"],
    condition: "solved"
  },
  {
    id: "mirror-under-5",
    title: "Mirror Cube Under 5 Minutes",
    puzzleType: "mirrorCube",
    type: "Speed",
    difficulty: "Advanced",
    objective: "Solve the Mirror Cube in under 5 minutes.",
    scramble: ["R", "U", "R'", "F", "U'", "B", "L'", "D"],
    timeLimitMs: 300000,
    condition: "solved"
  },
  {
    id: "mirror-under-150",
    title: "Mirror Cube Under 150 Moves",
    puzzleType: "mirrorCube",
    type: "Move Limit",
    difficulty: "Advanced",
    objective: "Restore the Mirror Cube shape in under 150 moves.",
    moveLimit: 150,
    condition: "solved"
  },
  {
    id: "mirror-5-move",
    title: "Five-Move Mirror Recovery",
    puzzleType: "mirrorCube",
    type: "Beginner",
    difficulty: "Medium",
    objective: "Recover from a compact five-move Mirror Cube scramble.",
    scramble: ["R", "U", "F'", "D", "L'"],
    condition: "solved"
  },
  {
    id: "mirror-10-move",
    title: "Ten-Move Mirror Challenge",
    puzzleType: "mirrorCube",
    type: "Challenge",
    difficulty: "Advanced",
    objective: "Recover from a 10-move shape-shifting scramble.",
    scramble: ["R", "U", "B'", "L", "D'", "F", "R'", "U'", "B", "L'"],
    condition: "solved"
  },
  {
    id: "mirror-easy-shape",
    title: "Restore The Shape",
    puzzleType: "mirrorCube",
    type: "Shape",
    difficulty: "Medium",
    objective: "Restore the clean cube silhouette from an easy scramble.",
    scramble: ["R", "U", "R'", "U'"],
    condition: "solved"
  },
  {
    id: "megaminx-5-move",
    title: "Five-Move Megaminx",
    puzzleType: "megaminx",
    type: "Beginner",
    difficulty: "Medium",
    objective: "Recover from a compact five-move Megaminx scramble.",
    scramble: ["F1", "F2'", "F3", "F4'", "F5"],
    condition: "solved"
  },
  {
    id: "megaminx-10-move",
    title: "Ten-Move Megaminx",
    puzzleType: "megaminx",
    type: "Challenge",
    difficulty: "Advanced",
    objective: "Recover from a 10-move 12-face scramble.",
    scramble: ["F1", "F2'", "F3", "F4'", "F5", "F6'", "F7", "F8'", "F9", "F10'"],
    condition: "solved"
  },
  {
    id: "megaminx-easy-recovery",
    title: "Easy Megaminx Recovery",
    puzzleType: "megaminx",
    type: "Recovery",
    difficulty: "Advanced",
    objective: "Restore the dodecahedron from a readable easy scramble.",
    scramble: ["F1", "F2", "F1'", "F3", "F2'"],
    condition: "solved"
  },
  {
    id: "megaminx-free-solve",
    title: "Complete Megaminx Solve",
    puzzleType: "megaminx",
    type: "Long Form",
    difficulty: "Final Boss",
    objective: "Complete a legal Megaminx solve in Free Solve or Timed Challenge.",
    condition: "solved"
  },
  {
    id: "megaminx-under-180",
    title: "Megaminx Under 180 Moves",
    puzzleType: "megaminx",
    type: "Move Limit",
    difficulty: "Final Boss",
    objective: "Solve the Megaminx in under 180 moves.",
    moveLimit: 180,
    condition: "solved"
  }
];

export function getMission(missionId) {
  return MISSIONS.find((mission) => mission.id === missionId) || null;
}

export function getMissionsForSize(size) {
  return MISSIONS.filter((mission) => mission.size === size);
}

export function getMissionsForPuzzle(puzzleType = "cube", size = 3) {
  return MISSIONS.filter((mission) => (
    (mission.puzzleType || "cube") === puzzleType &&
    (puzzleType !== "cube" || mission.size === size)
  ));
}

export function checkMissionSuccess(mission, state, stats, context = {}) {
  if (!mission) return false;

  if (mission.moveLimit && stats.moveCount > mission.moveLimit) {
    return false;
  }

  if (mission.timeLimitMs && stats.elapsedMs > mission.timeLimitMs) {
    return false;
  }

  if (mission.condition === "pattern") {
    return context.appliedPatternId === mission.patternId;
  }

  if ((mission.puzzleType || state.puzzleType) === "pyraminx") {
    if (mission.condition === "tips") return arePyraminxTipsSolved(state);
    return isPyraminxSolved(state);
  }

  if ((mission.puzzleType || state.puzzleType) === "skewb") {
    return isSkewbSolved(state);
  }

  if ((mission.puzzleType || state.puzzleType) === "mirrorCube") {
    return isMirrorCubeSolved(state);
  }

  if ((mission.puzzleType || state.puzzleType) === "megaminx") {
    return isMegaminxSolved(state);
  }

  if (mission.condition === "whiteCross") return isWhiteCrossSolved(state);
  if (mission.condition === "whiteCorners") return areWhiteCornersSolved(state);
  if (mission.condition === "firstLayer") return isFirstLayerSolved(state);
  if (mission.condition === "yellowCross") return isYellowCrossSolved(state);
  return isSolved(state);
}
