export const GAME_MODES = {
  classic: {
    id: "classic",
    label: "Classic Mode",
    shortLabel: "Classic",
    description: "Standard Snake and Ladder with fair dice and no extra events.",
    defaultPresetId: "classic100",
    powerUps: false,
    eventTiles: false,
    dramatic: false,
    quick: false
  },
  royale: {
    id: "royale",
    label: "Royale Mode",
    shortLabel: "Royale",
    description: "Power-ups, event tiles, and richer GameHub replay value.",
    defaultPresetId: "balancedRoyale",
    powerUps: true,
    eventTiles: true,
    dramatic: true,
    quick: false
  },
  quickRush: {
    id: "quickRush",
    label: "Quick Rush",
    shortLabel: "Quick",
    description: "A faster match that finishes at tile 64 on the same 10x10 board.",
    defaultPresetId: "quickBoard",
    powerUps: false,
    eventTiles: false,
    dramatic: false,
    quick: true
  },
  chaos: {
    id: "chaos",
    label: "Chaos Mode",
    shortLabel: "Chaos",
    description: "High-risk ladders, bigger snakes, event tiles, and power swings.",
    defaultPresetId: "highRisk",
    powerUps: true,
    eventTiles: true,
    dramatic: true,
    quick: false
  },
  custom: {
    id: "custom",
    label: "Custom Mode",
    shortLabel: "Custom",
    description: "Choose board preset, rules, power-ups, and event tiles.",
    defaultPresetId: "classic100",
    powerUps: false,
    eventTiles: false,
    dramatic: false,
    quick: false
  }
};

export const DEFAULT_MODE_ID = "classic";

export function getGameMode(modeId) {
  return GAME_MODES[modeId] || GAME_MODES[DEFAULT_MODE_ID];
}

export function getModeRows() {
  return Object.values(GAME_MODES);
}

export function applyModeDefaults(currentOptions, modeId) {
  const mode = getGameMode(modeId);
  if (mode.id === "custom") {
    return {
      ...currentOptions,
      modeId: mode.id,
      boardPresetId: currentOptions.boardPresetId || mode.defaultPresetId
    };
  }

  return {
    ...currentOptions,
    modeId: mode.id,
    boardPresetId: mode.defaultPresetId,
    powerUpsEnabled: mode.powerUps,
    eventTilesEnabled: mode.eventTiles
  };
}
