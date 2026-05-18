export const CLASSIC_LADDERS = [
  [4, 14],
  [9, 31],
  [20, 38],
  [28, 84],
  [40, 59],
  [51, 67],
  [63, 81],
  [71, 91]
];

export const CLASSIC_SNAKES = [
  [17, 7],
  [54, 34],
  [62, 19],
  [64, 60],
  [87, 24],
  [93, 73],
  [95, 75],
  [99, 78]
];

export const BOARD_PRESETS = {
  classic100: {
    id: "classic100",
    label: "Classic 100",
    description: "The stable 10x10 classic board.",
    finishTile: 100,
    ladders: CLASSIC_LADDERS,
    snakes: CLASSIC_SNAKES,
    eventTiles: {}
  },
  beginnerFriendly: {
    id: "beginnerFriendly",
    label: "Beginner Friendly",
    description: "Fewer snakes and a kinder ladder spread.",
    finishTile: 100,
    ladders: [
      [3, 22],
      [8, 30],
      [15, 44],
      [26, 52],
      [40, 59],
      [51, 67],
      [63, 81],
      [72, 91]
    ],
    snakes: [
      [48, 32],
      [62, 42],
      [87, 68],
      [95, 78]
    ],
    eventTiles: {
      12: "safe",
      24: "power",
      36: "bonus",
      69: "forward"
    }
  },
  balancedRoyale: {
    id: "balancedRoyale",
    label: "Balanced Royale",
    description: "Balanced snakes, ladders, and premium event pacing.",
    finishTile: 100,
    ladders: CLASSIC_LADDERS,
    snakes: CLASSIC_SNAKES,
    eventTiles: {
      6: "power",
      13: "bonus",
      22: "safe",
      35: "forward",
      46: "backstep",
      57: "power",
      76: "trap",
      88: "bonus"
    }
  },
  highRisk: {
    id: "highRisk",
    label: "High Risk",
    description: "More dramatic swings for Chaos Mode.",
    finishTile: 100,
    ladders: [
      [2, 23],
      [7, 29],
      [20, 45],
      [28, 84],
      [36, 57],
      [51, 72],
      [63, 88],
      [70, 94]
    ],
    snakes: [
      [17, 5],
      [43, 18],
      [54, 12],
      [62, 19],
      [73, 47],
      [87, 24],
      [95, 56],
      [99, 42]
    ],
    eventTiles: {
      5: "power",
      11: "bonus",
      16: "trap",
      25: "forward",
      33: "backstep",
      41: "power",
      58: "safe",
      67: "trap",
      82: "bonus",
      90: "power"
    }
  },
  quickBoard: {
    id: "quickBoard",
    label: "Quick Board",
    description: "A short match ending at tile 64 with fewer routes.",
    finishTile: 64,
    ladders: [
      [3, 15],
      [8, 23],
      [16, 37],
      [26, 42],
      [34, 50],
      [45, 58]
    ],
    snakes: [
      [19, 7],
      [31, 11],
      [44, 28],
      [52, 35],
      [61, 48],
      [63, 41]
    ],
    eventTiles: {
      5: "bonus",
      12: "power",
      22: "forward",
      29: "safe",
      39: "backstep",
      56: "trap"
    }
  }
};

export const DEFAULT_BOARD_PRESET_ID = "classic100";

export function getBoardPresetRows() {
  return Object.values(BOARD_PRESETS);
}

export function createBoardRuntime(presetId) {
  const result = validateBoardPreset(BOARD_PRESETS[presetId] || BOARD_PRESETS[DEFAULT_BOARD_PRESET_ID]);
  const safePreset = result.valid ? result.preset : BOARD_PRESETS[DEFAULT_BOARD_PRESET_ID];

  return {
    preset: clonePreset(safePreset),
    valid: result.valid,
    fallbackReason: result.valid ? "" : result.reason,
    finishTile: safePreset.finishTile,
    laddersMap: new Map(safePreset.ladders),
    snakesMap: new Map(safePreset.snakes),
    eventTilesMap: new Map(Object.entries(safePreset.eventTiles || {}).map(([tile, type]) => [Number(tile), type]))
  };
}

export function getTransportForTileFromBoard(boardRuntime, tile) {
  if (boardRuntime?.laddersMap?.has(tile)) {
    return { type: "ladder", from: tile, to: boardRuntime.laddersMap.get(tile) };
  }

  if (boardRuntime?.snakesMap?.has(tile)) {
    return { type: "snake", from: tile, to: boardRuntime.snakesMap.get(tile) };
  }

  return null;
}

export function validateBoardPreset(preset) {
  if (!preset || !Array.isArray(preset.ladders) || !Array.isArray(preset.snakes)) {
    return { valid: false, reason: "Preset is missing snake or ladder data.", preset: BOARD_PRESETS[DEFAULT_BOARD_PRESET_ID] };
  }

  const finishTile = Number(preset.finishTile);
  if (!Number.isInteger(finishTile) || finishTile < 2 || finishTile > 100) {
    return { valid: false, reason: "Finish tile is outside the supported 2-100 range.", preset };
  }

  const starts = new Set();
  for (const [from, to] of preset.ladders) {
    const invalid = validatePair(from, to, finishTile, "ladder", starts);
    if (invalid) return { valid: false, reason: invalid, preset };
  }

  for (const [from, to] of preset.snakes) {
    const invalid = validatePair(from, to, finishTile, "snake", starts);
    if (invalid) return { valid: false, reason: invalid, preset };
  }

  for (const tileText of Object.keys(preset.eventTiles || {})) {
    const tile = Number(tileText);
    if (!Number.isInteger(tile) || tile <= 1 || tile >= finishTile) {
      return { valid: false, reason: `Invalid event tile ${tileText}.`, preset };
    }
  }

  return { valid: true, reason: "", preset };
}

function validatePair(from, to, finishTile, type, starts) {
  if (!Number.isInteger(from) || !Number.isInteger(to)) return `${type} has a non-integer tile.`;
  if (from <= 1 || from >= finishTile) return `${type} starts on an invalid tile.`;
  if (to < 1 || to > finishTile) return `${type} ends outside the board.`;
  if (type === "ladder" && from >= to) return "Ladder must move upward.";
  if (type === "snake" && from <= to) return "Snake must move downward.";
  if (starts.has(from)) return `Duplicate snake/ladder start tile ${from}.`;
  starts.add(from);
  return "";
}

function clonePreset(preset) {
  return {
    ...preset,
    ladders: preset.ladders.map(([from, to]) => [from, to]),
    snakes: preset.snakes.map(([from, to]) => [from, to]),
    eventTiles: { ...(preset.eventTiles || {}) }
  };
}
