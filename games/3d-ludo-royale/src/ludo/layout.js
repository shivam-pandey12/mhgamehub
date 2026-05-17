import { FINAL_STEP, PLAYER_META } from './constants.js';

export const COMMON_ROUTE = Object.freeze([
  { x: 6, y: 13 },
  { x: 6, y: 12 },
  { x: 6, y: 11 },
  { x: 6, y: 10 },
  { x: 6, y: 9 },
  { x: 5, y: 8 },
  { x: 4, y: 8 },
  { x: 3, y: 8 },
  { x: 2, y: 8 },
  { x: 1, y: 8 },
  { x: 0, y: 8 },
  { x: 0, y: 7 },
  { x: 0, y: 6 },
  { x: 1, y: 6 },
  { x: 2, y: 6 },
  { x: 3, y: 6 },
  { x: 4, y: 6 },
  { x: 5, y: 6 },
  { x: 6, y: 5 },
  { x: 6, y: 4 },
  { x: 6, y: 3 },
  { x: 6, y: 2 },
  { x: 6, y: 1 },
  { x: 6, y: 0 },
  { x: 7, y: 0 },
  { x: 8, y: 0 },
  { x: 8, y: 1 },
  { x: 8, y: 2 },
  { x: 8, y: 3 },
  { x: 8, y: 4 },
  { x: 8, y: 5 },
  { x: 9, y: 6 },
  { x: 10, y: 6 },
  { x: 11, y: 6 },
  { x: 12, y: 6 },
  { x: 13, y: 6 },
  { x: 14, y: 6 },
  { x: 14, y: 7 },
  { x: 14, y: 8 },
  { x: 13, y: 8 },
  { x: 12, y: 8 },
  { x: 11, y: 8 },
  { x: 10, y: 8 },
  { x: 9, y: 8 },
  { x: 8, y: 9 },
  { x: 8, y: 10 },
  { x: 8, y: 11 },
  { x: 8, y: 12 },
  { x: 8, y: 13 },
  { x: 8, y: 14 },
  { x: 7, y: 14 },
  { x: 6, y: 14 }
]);

export const SAFE_COMMON_INDICES = Object.freeze(new Set([0, 8, 13, 21, 26, 34, 39, 47]));

export function getCommonIndex(playerId, steps) {
  const startIndex = PLAYER_META[playerId].startIndex;
  return (startIndex + steps) % COMMON_ROUTE.length;
}

export function getTrackCell(playerId, steps) {
  return COMMON_ROUTE[getCommonIndex(playerId, steps)];
}

export function getHomeLaneCell(playerId, laneIndex) {
  return PLAYER_META[playerId].homeLane[Math.min(laneIndex, PLAYER_META[playerId].homeLane.length - 1)];
}

export function getCellForSteps(playerId, steps) {
  if (steps <= 51) {
    return {
      kind: 'track',
      playerId,
      steps,
      commonIndex: getCommonIndex(playerId, steps),
      cell: getTrackCell(playerId, steps)
    };
  }

  return {
    kind: steps >= FINAL_STEP ? 'finished' : 'home-lane',
    playerId,
    steps,
    laneIndex: Math.min(steps - 52, 5),
    cell: getHomeLaneCell(playerId, steps - 52)
  };
}

export function getTokenCell(token) {
  if (token.state === 'base') {
    return PLAYER_META[token.playerId].baseSlots[token.index];
  }

  if (token.state === 'finished') {
    return PLAYER_META[token.playerId].homeLane[5];
  }

  return getCellForSteps(token.playerId, token.steps).cell;
}

export function getAllBoardCells() {
  const cells = new Map();
  const add = (cell, role, playerId = null, index = null) => {
    const key = `${cell.x},${cell.y}`;
    const existing = cells.get(key) || { ...cell, roles: [] };
    existing.roles.push({ role, playerId, index });
    cells.set(key, existing);
  };

  COMMON_ROUTE.forEach((cell, index) => add(cell, SAFE_COMMON_INDICES.has(index) ? 'safe-track' : 'track', null, index));

  Object.values(PLAYER_META).forEach((player) => {
    player.homeLane.forEach((cell, index) => add(cell, 'home-lane', player.id, index));
    player.baseSlots.forEach((cell, index) => add(cell, 'base-slot', player.id, index));
  });

  [{ x: 6, y: 6 }, { x: 7, y: 6 }, { x: 8, y: 6 }, { x: 6, y: 7 }, { x: 7, y: 7 }, { x: 8, y: 7 }, { x: 6, y: 8 }, { x: 7, y: 8 }, { x: 8, y: 8 }]
    .forEach((cell, index) => add(cell, 'center', null, index));

  return [...cells.values()];
}
