export const BOARD_SIZE = 10;
export const TILE_COUNT = 100;
export const TILE_SIZE = 1.18;
export const TILE_GAP = 0.035;

export const LADDERS = new Map([
  [4, 14],
  [9, 31],
  [20, 38],
  [28, 84],
  [40, 59],
  [51, 67],
  [63, 81],
  [71, 91]
]);

export const SNAKES = new Map([
  [17, 7],
  [54, 34],
  [62, 19],
  [64, 60],
  [87, 24],
  [93, 73],
  [95, 75],
  [99, 78]
]);

export const PLAYER_COLORS = ["#bb2f42", "#2368c9", "#1f9c69", "#8d55d8"];

export function tileToGrid(tile) {
  if (tile < 1 || tile > TILE_COUNT) {
    return { row: -1, col: -1 };
  }

  const index = tile - 1;
  const row = Math.floor(index / BOARD_SIZE);
  const rawCol = index % BOARD_SIZE;
  const col = row % 2 === 0 ? rawCol : BOARD_SIZE - 1 - rawCol;
  return { row, col };
}

export function tileToWorld(tile) {
  if (tile <= 0) {
    const start = tileToWorld(1);
    return {
      x: start.x - TILE_SIZE * 1.18,
      z: start.z + TILE_SIZE * 0.78
    };
  }

  const { row, col } = tileToGrid(tile);
  return {
    x: (col - (BOARD_SIZE - 1) / 2) * TILE_SIZE,
    z: ((BOARD_SIZE - 1) / 2 - row) * TILE_SIZE
  };
}

export function getPlayerTileOffset(index) {
  const offsets = [
    { x: -0.18, z: -0.18 },
    { x: 0.18, z: -0.18 },
    { x: -0.18, z: 0.18 },
    { x: 0.18, z: 0.18 }
  ];
  return offsets[index % offsets.length];
}

export function buildMovementPath(from, to) {
  const path = [];
  if (to < from) {
    for (let tile = Math.min(TILE_COUNT, from - 1); tile >= Math.max(0, to); tile -= 1) {
      path.push(tile);
    }
    return path;
  }
  for (let tile = Math.max(1, from + 1); tile <= to; tile += 1) {
    path.push(tile);
  }
  return path;
}

export function getTransportForTile(tile) {
  if (LADDERS.has(tile)) {
    return { type: "ladder", from: tile, to: LADDERS.get(tile) };
  }

  if (SNAKES.has(tile)) {
    return { type: "snake", from: tile, to: SNAKES.get(tile) };
  }

  return null;
}

export function getBoardWorldSize() {
  return BOARD_SIZE * TILE_SIZE;
}
