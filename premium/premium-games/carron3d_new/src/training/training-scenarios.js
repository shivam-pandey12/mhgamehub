import { CARROM_BOARD } from '../config/carrom-constants.js';

export const PRACTICE_TYPES = {
  freePractice: {
    id: 'freePractice',
    label: 'Free Practice',
    helper: 'Full board sandbox. Shoot freely and reset whenever you want.'
  },
  pocketDrill: {
    id: 'pocketDrill',
    label: 'Pocket Drill',
    helper: 'Pocket the highlighted coin into the marked corner.'
  },
  queenCoverDrill: {
    id: 'queenCoverDrill',
    label: 'Queen Cover Drill',
    helper: 'Pocket the queen, then cover it with the highlighted coin.'
  }
};

export const TRAINING_PIECES = {
  striker: 'striker-1',
  queen: 'queen-red-1',
  pocketCoin: 'inner-white-coin-1',
  coverCoin: 'inner-black-coin-1'
};

export function getPracticeType(type = 'freePractice') {
  return PRACTICE_TYPES[type] || PRACTICE_TYPES.freePractice;
}

export function createFreePracticeScenario() {
  return {
    id: 'practice-free',
    title: 'Free Practice',
    objectiveText: 'Shoot freely. Reset the board when you want a fresh rack.',
    resetToDefault: true,
    striker: { x: 0, z: CARROM_BOARD.BASELINE_OFFSET },
    highlights: [
      { id: 'practice-baseline', type: 'baseline', baseline: 'bottom' }
    ]
  };
}

export function createPocketDrillScenario() {
  return {
    id: 'practice-pocket-drill',
    title: 'Pocket Drill',
    objectiveText: 'Pocket the highlighted white coin into the lower-right pocket.',
    activePieceIds: [TRAINING_PIECES.striker, TRAINING_PIECES.pocketCoin],
    placements: {
      [TRAINING_PIECES.striker]: { x: 0, z: CARROM_BOARD.BASELINE_OFFSET },
      [TRAINING_PIECES.pocketCoin]: { x: 1.28, z: 1.48 }
    },
    targetPieceIds: [TRAINING_PIECES.pocketCoin],
    targetPocketId: 'pocket-4',
    highlights: [
      { id: 'practice-pocket-coin', type: 'piece', pieceId: TRAINING_PIECES.pocketCoin },
      { id: 'practice-pocket-target', type: 'pocket', pocketId: 'pocket-4' },
      { id: 'practice-baseline', type: 'baseline', baseline: 'bottom' }
    ]
  };
}

export function createQueenCoverDrillScenario() {
  return {
    id: 'practice-queen-cover',
    title: 'Queen Cover Drill',
    objectiveText: 'Pocket the queen, then cover with the highlighted normal coin.',
    activePieceIds: [TRAINING_PIECES.striker, TRAINING_PIECES.queen, TRAINING_PIECES.coverCoin],
    placements: {
      [TRAINING_PIECES.striker]: { x: 0, z: CARROM_BOARD.BASELINE_OFFSET },
      [TRAINING_PIECES.queen]: { x: 1.28, z: 1.48 },
      [TRAINING_PIECES.coverCoin]: { x: -1.15, z: 1.35 }
    },
    targetPieceIds: [TRAINING_PIECES.queen, TRAINING_PIECES.coverCoin],
    targetPocketId: 'pocket-4',
    queenRequired: true,
    coverPieceId: TRAINING_PIECES.coverCoin,
    highlights: [
      { id: 'practice-queen', type: 'piece', pieceId: TRAINING_PIECES.queen, tone: 'queen' },
      { id: 'practice-cover-coin', type: 'piece', pieceId: TRAINING_PIECES.coverCoin },
      { id: 'practice-pocket-target', type: 'pocket', pocketId: 'pocket-4' },
      { id: 'practice-baseline', type: 'baseline', baseline: 'bottom' }
    ]
  };
}

export function getPracticeScenario(type = 'freePractice') {
  if (type === 'pocketDrill') {
    return createPocketDrillScenario();
  }
  if (type === 'queenCoverDrill') {
    return createQueenCoverDrillScenario();
  }
  return createFreePracticeScenario();
}
