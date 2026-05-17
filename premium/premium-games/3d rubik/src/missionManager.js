import {
  areWhiteCornersSolved,
  isFirstLayerSolved,
  isWhiteCrossSolved,
  isYellowCrossSolved
} from "./guideManager.js";
import { isSolved } from "./cubeState.js";

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
  }
];

export function getMission(missionId) {
  return MISSIONS.find((mission) => mission.id === missionId) || null;
}

export function getMissionsForSize(size) {
  return MISSIONS.filter((mission) => mission.size === size);
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

  if (mission.condition === "whiteCross") return isWhiteCrossSolved(state);
  if (mission.condition === "whiteCorners") return areWhiteCornersSolved(state);
  if (mission.condition === "firstLayer") return isFirstLayerSolved(state);
  if (mission.condition === "yellowCross") return isYellowCrossSolved(state);
  return isSolved(state);
}
