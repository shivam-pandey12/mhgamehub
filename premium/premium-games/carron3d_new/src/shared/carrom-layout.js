import { CARROM_BOARD, CARROM_VISUAL_Y } from '../config/carrom-constants.js';

function createPiece({ id, type = 'coin', color, position }) {
  return {
    id,
    type,
    color,
    radius: type === 'striker' ? CARROM_BOARD.STRIKER_RADIUS : CARROM_BOARD.COIN_RADIUS,
    initialPosition: { ...position },
    visualY: position.y,
    isPocketed: false
  };
}

function createCoinRing({ count, radius, angleOffset, colors, idPrefix }) {
  const pieces = [];
  for (let index = 0; index < count; index += 1) {
    const angle = angleOffset + (index / count) * Math.PI * 2;
    const color = colors[index];
    pieces.push(createPiece({
      id: `${idPrefix}-${color}-coin-${index + 1}`,
      type: 'coin',
      color,
      position: {
        x: Math.cos(angle) * radius,
        y: CARROM_VISUAL_Y.COIN_VISUAL_Y,
        z: Math.sin(angle) * radius
      }
    }));
  }
  return pieces;
}

export function createDefaultCarromPieces() {
  return [
    createPiece({
      id: 'queen-red-1',
      type: 'queen',
      color: 'red',
      position: {
        x: 0,
        y: CARROM_VISUAL_Y.QUEEN_VISUAL_Y,
        z: 0
      }
    }),
    ...createCoinRing({
      count: 6,
      radius: CARROM_BOARD.CENTER_CLUSTER_SPACING,
      angleOffset: Math.PI / 6,
      colors: ['white', 'black', 'white', 'black', 'white', 'black'],
      idPrefix: 'inner'
    }),
    ...createCoinRing({
      count: 12,
      radius: CARROM_BOARD.CENTER_CLUSTER_SPACING * 2,
      angleOffset: 0,
      colors: ['black', 'white', 'black', 'white', 'black', 'white', 'black', 'white', 'black', 'white', 'black', 'white'],
      idPrefix: 'outer'
    }),
    createPiece({
      id: 'striker-1',
      type: 'striker',
      color: 'striker',
      position: {
        x: 0,
        y: CARROM_VISUAL_Y.STRIKER_VISUAL_Y,
        z: CARROM_BOARD.BASELINE_OFFSET
      }
    })
  ];
}

export function createDefaultCarromPockets() {
  return [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1]
  ].map(([sx, sz], index) => ({
    id: `pocket-${index + 1}`,
    position: {
      x: sx * CARROM_BOARD.POCKET_CENTER_OFFSET,
      y: CARROM_BOARD.SURFACE_Y,
      z: sz * CARROM_BOARD.POCKET_CENTER_OFFSET
    },
    radius: CARROM_BOARD.POCKET_RADIUS
  }));
}
