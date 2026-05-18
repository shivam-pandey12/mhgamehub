export const POWER_UPS = {
  shield: {
    id: "shield",
    label: "Shield",
    description: "Blocks the next snake slide."
  },
  reroll: {
    id: "reroll",
    label: "Reroll",
    description: "Replace one roll before movement."
  },
  swap: {
    id: "swap",
    label: "Swap",
    description: "Swap positions with another player before rolling."
  }
};

export const EVENT_TILE_DEFINITIONS = {
  bonus: {
    id: "bonus",
    label: "Bonus Roll",
    marker: "+R",
    description: "Grants one extra roll."
  },
  backstep: {
    id: "backstep",
    label: "Backstep",
    marker: "-3",
    description: "Move back three tiles."
  },
  forward: {
    id: "forward",
    label: "Forward Jump",
    marker: "+3",
    description: "Move forward three tiles."
  },
  power: {
    id: "power",
    label: "Power Tile",
    marker: "P",
    description: "Grants a random power-up."
  },
  safe: {
    id: "safe",
    label: "Safe Tile",
    marker: "S",
    description: "Blocks one snake while active."
  },
  trap: {
    id: "trap",
    label: "Trap Tile",
    marker: "T",
    description: "Skip the next turn."
  }
};

export function createPlayerStatus() {
  return {
    heldPowerUp: null,
    safeTile: false,
    safeTurns: 0,
    skipNextTurn: false,
    rerollUsedThisTurn: false
  };
}

export function getRandomPowerUp() {
  const ids = Object.keys(POWER_UPS);
  return ids[Math.floor(Math.random() * ids.length)];
}

export function getPowerUpLabel(powerUpId) {
  return POWER_UPS[powerUpId]?.label || "None";
}

export function getEventTileRows(eventTilesMap) {
  if (!eventTilesMap) return [];
  return [...eventTilesMap.entries()]
    .sort(([tileA], [tileB]) => tileA - tileB)
    .map(([tile, type]) => ({
      tile,
      type,
      ...(EVENT_TILE_DEFINITIONS[type] || {})
    }))
    .filter((row) => row.id);
}

export function shouldBotUseReroll({ player, roll, targetResult, transport, players }) {
  if (!player || player.status?.heldPowerUp !== "reroll") return false;
  if (targetResult && !targetResult.allowed) return true;
  if (transport?.type === "snake") return true;
  const leaderPosition = Math.max(...players.map((entry) => entry.position));
  return roll === 1 && leaderPosition - player.position >= 18;
}

export function chooseBotSwapTarget(player, players) {
  if (!player || player.status?.heldPowerUp !== "swap") return null;
  const candidates = players
    .filter((entry) => entry.id !== player.id && entry.position !== player.position)
    .sort((a, b) => b.position - a.position);
  const leader = candidates[0];
  if (!leader || leader.position - player.position < 15) return null;
  return leader;
}
