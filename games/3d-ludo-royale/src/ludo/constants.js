export const BOARD_SIZE = 15;
export const TOKENS_PER_PLAYER = 4;
export const FINAL_STEP = 57;

export const PLAYER_IDS = Object.freeze(['red', 'blue', 'green', 'yellow']);

export const PLAYER_SETS = Object.freeze({
  2: ['red', 'blue'],
  3: ['red', 'blue', 'green'],
  4: ['red', 'blue', 'green', 'yellow']
});

export const PLAYER_META = Object.freeze({
  red: {
    id: 'red',
    label: 'Red',
    startIndex: 0,
    color: '#8f2f2f',
    accent: '#c98677',
    baseSlots: [
      { x: 2, y: 11 },
      { x: 4, y: 11 },
      { x: 2, y: 13 },
      { x: 4, y: 13 }
    ],
    zone: { x: 2.5, y: 11.5 },
    homeLane: [
      { x: 7, y: 13 },
      { x: 7, y: 12 },
      { x: 7, y: 11 },
      { x: 7, y: 10 },
      { x: 7, y: 9 },
      { x: 7, y: 8 }
    ]
  },
  blue: {
    id: 'blue',
    label: 'Blue',
    startIndex: 26,
    color: '#2c527c',
    accent: '#88a5c4',
    baseSlots: [
      { x: 10, y: 1 },
      { x: 12, y: 1 },
      { x: 10, y: 3 },
      { x: 12, y: 3 }
    ],
    zone: { x: 11.5, y: 2.5 },
    homeLane: [
      { x: 7, y: 1 },
      { x: 7, y: 2 },
      { x: 7, y: 3 },
      { x: 7, y: 4 },
      { x: 7, y: 5 },
      { x: 7, y: 6 }
    ]
  },
  green: {
    id: 'green',
    label: 'Green',
    startIndex: 13,
    color: '#2f6846',
    accent: '#8db79b',
    baseSlots: [
      { x: 2, y: 1 },
      { x: 4, y: 1 },
      { x: 2, y: 3 },
      { x: 4, y: 3 }
    ],
    zone: { x: 2.5, y: 2.5 },
    homeLane: [
      { x: 1, y: 7 },
      { x: 2, y: 7 },
      { x: 3, y: 7 },
      { x: 4, y: 7 },
      { x: 5, y: 7 },
      { x: 6, y: 7 }
    ]
  },
  yellow: {
    id: 'yellow',
    label: 'Yellow',
    startIndex: 39,
    color: '#b6923c',
    accent: '#d7be72',
    baseSlots: [
      { x: 10, y: 11 },
      { x: 12, y: 11 },
      { x: 10, y: 13 },
      { x: 12, y: 13 }
    ],
    zone: { x: 11.5, y: 11.5 },
    homeLane: [
      { x: 13, y: 7 },
      { x: 12, y: 7 },
      { x: 11, y: 7 },
      { x: 10, y: 7 },
      { x: 9, y: 7 },
      { x: 8, y: 7 }
    ]
  }
});

export const STATUS = Object.freeze({
  SETUP: 'setup',
  AWAITING_ROLL: 'awaiting-roll',
  AWAITING_TOKEN: 'awaiting-token',
  ANIMATING: 'animating',
  GAME_OVER: 'game-over'
});
