import { isSolved } from "./cubeState.js";
import {
  areWhiteCornersSolved,
  getGuideStatus,
  isMiddleLayerSolved,
  isWhiteCrossSolved,
  isYellowCrossSolved
} from "./guideManager.js";

const HINT_LEVELS = {
  soft: "Soft Hint",
  visual: "Visual Hint",
  move: "Move Hint",
  auto: "Auto Move"
};

function makeHint({ level = "soft", title, text, algorithm = "", moves = [], targets = { cubieIds: [] } }) {
  return {
    level,
    levelLabel: HINT_LEVELS[level] || HINT_LEVELS.soft,
    title,
    text,
    algorithm,
    moves,
    targets
  };
}

export function getHint(state, level = "soft", activeStageIndex = 0) {
  if (isSolved(state)) {
    return makeHint({
      level,
      title: "Solved",
      text: "The cube is solved. Try a timed challenge or a mission next."
    });
  }

  const guide = getGuideStatus(state, activeStageIndex);

  if (state.size >= 4) {
    return makeHint({
      level,
      title: "Large cube strategy",
      text: "Work in reduction order: solve centers, pair edges, reduce to a 3x3, then watch for parity cases.",
      algorithm: "No full big-cube solver in Phase 2.",
      targets: guide.targets
    });
  }

  if (state.size === 2) {
    if (!guide.stages[1].detector(state)) {
      return makeHint({
        level,
        title: "Build one layer",
        text: "Find the white corner pieces and place them together into one clean first layer.",
        algorithm: "R U R' U'",
        moves: level === "auto" ? ["R", "U", "R'", "U'"] : [],
        targets: guide.targets
      });
    }

    return makeHint({
      level,
      title: "Last layer corners",
      text: "Keep the solved layer safe while you position and orient the final corners.",
      algorithm: "R' D' R D",
      moves: level === "auto" ? ["R'", "D'", "R", "D"] : [],
      targets: guide.targets
    });
  }

  if (!isWhiteCrossSolved(state)) {
    return makeHint({
      level,
      title: "Focus on the white cross",
      text: "Look for white edge pieces first. Bring one white edge to the top and align its side color.",
      algorithm: "F R U R' U' F'",
      moves: level === "auto" ? ["F", "R", "U", "R'", "U'", "F'"] : [],
      targets: guide.targets
    });
  }

  if (!areWhiteCornersSolved(state)) {
    return makeHint({
      level,
      title: "Insert white corners",
      text: "Place a white corner above its slot, then repeat the beginner insert until it drops in correctly.",
      algorithm: "R U R' U'",
      moves: level === "auto" ? ["R", "U", "R'", "U'"] : [],
      targets: guide.targets
    });
  }

  if (!isMiddleLayerSolved(state)) {
    return makeHint({
      level,
      title: "Middle-layer edges",
      text: "Choose an edge without yellow, match it to a center, then insert left or right.",
      algorithm: "U R U' R' U' F' U F",
      moves: level === "auto" ? ["U", "R", "U'", "R'", "U'", "F'", "U", "F"] : [],
      targets: guide.targets
    });
  }

  if (!isYellowCrossSolved(state)) {
    return makeHint({
      level,
      title: "Make the yellow cross",
      text: "Use the yellow cross algorithm until yellow edge stickers form a cross.",
      algorithm: "F R U R' U' F'",
      moves: level === "auto" ? ["F", "R", "U", "R'", "U'", "F'"] : [],
      targets: guide.targets
    });
  }

  return makeHint({
    level,
    title: "Finish the last layer",
    text: "Position the last-layer pieces, then orient the corners. Move slowly and keep solved pieces stable.",
    algorithm: "R U R' U R U2 R'",
    moves: level === "auto" ? ["R", "U", "R'", "U", "R", "U2", "R'"] : [],
    targets: guide.targets
  });
}
