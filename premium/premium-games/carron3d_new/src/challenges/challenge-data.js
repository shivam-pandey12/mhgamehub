import { CARROM_BOARD } from '../config/carrom-constants.js';

const STRIKER = 'striker-1';
const QUEEN = 'queen-red-1';

function baseScenario({ id, title, objectiveText, activePieceIds, placements, targetPieceIds = [], targetPocketId = '', highlights = [], resetToDefault = false }) {
  return {
    id,
    title,
    objectiveText,
    resetToDefault,
    activePieceIds,
    placements: {
      [STRIKER]: { x: 0, z: CARROM_BOARD.BASELINE_OFFSET },
      ...placements
    },
    targetPieceIds,
    targetPocketId,
    highlights: [
      { id: `${id}-baseline`, type: 'baseline', baseline: 'bottom' },
      ...highlights
    ]
  };
}

function targetHighlights(id, targetPieceId, targetPocketId, tone = 'coin') {
  return [
    { id: `${id}-piece`, type: 'piece', pieceId: targetPieceId, tone },
    { id: `${id}-pocket`, type: 'pocket', pocketId: targetPocketId }
  ];
}

export const CHALLENGES = [
  {
    id: 'easy-pocket-1',
    title: 'Easy Pocket I',
    type: 'easyPocket',
    difficulty: 'easy',
    description: 'A straight starter pocket to lock in striker feel.',
    objectiveText: 'Pocket the white coin in 1 shot.',
    shotLimit: 1,
    idealShots: 1,
    boardSetup: baseScenario({
      id: 'easy-pocket-1',
      title: 'Easy Pocket I',
      objectiveText: 'Pocket the white coin in 1 shot.',
      activePieceIds: [STRIKER, 'inner-white-coin-1'],
      placements: {
        'inner-white-coin-1': { x: 1.28, z: 1.48 }
      },
      targetPieceIds: ['inner-white-coin-1'],
      targetPocketId: 'pocket-4',
      highlights: targetHighlights('easy-pocket-1', 'inner-white-coin-1', 'pocket-4')
    })
  },
  {
    id: 'easy-pocket-2',
    title: 'Easy Pocket II',
    type: 'easyPocket',
    difficulty: 'easy',
    description: 'A clean black-coin starter from the opposite lane.',
    objectiveText: 'Pocket the black coin in 1 shot.',
    shotLimit: 1,
    idealShots: 1,
    boardSetup: baseScenario({
      id: 'easy-pocket-2',
      title: 'Easy Pocket II',
      objectiveText: 'Pocket the black coin in 1 shot.',
      activePieceIds: [STRIKER, 'inner-black-coin-2'],
      placements: {
        'inner-black-coin-2': { x: -1.28, z: 1.48 }
      },
      targetPieceIds: ['inner-black-coin-2'],
      targetPocketId: 'pocket-3',
      highlights: targetHighlights('easy-pocket-2', 'inner-black-coin-2', 'pocket-3')
    })
  },
  {
    id: 'angle-shot-1',
    title: 'Angle Shot I',
    type: 'angleShot',
    difficulty: 'normal',
    description: 'Pocket an angled coin with two attempts.',
    objectiveText: 'Pocket the highlighted coin in 2 shots or less.',
    shotLimit: 2,
    idealShots: 1,
    boardSetup: baseScenario({
      id: 'angle-shot-1',
      title: 'Angle Shot I',
      objectiveText: 'Pocket the highlighted coin in 2 shots or less.',
      activePieceIds: [STRIKER, 'outer-white-coin-2'],
      placements: {
        'outer-white-coin-2': { x: 0.78, z: 0.92 }
      },
      targetPieceIds: ['outer-white-coin-2'],
      targetPocketId: 'pocket-4',
      highlights: targetHighlights('angle-shot-1', 'outer-white-coin-2', 'pocket-4')
    })
  },
  {
    id: 'angle-shot-2',
    title: 'Angle Shot II',
    type: 'angleShot',
    difficulty: 'normal',
    description: 'A sharper angle with less margin for lazy power.',
    objectiveText: 'Pocket the highlighted coin in 2 shots or less.',
    shotLimit: 2,
    idealShots: 1,
    boardSetup: baseScenario({
      id: 'angle-shot-2',
      title: 'Angle Shot II',
      objectiveText: 'Pocket the highlighted coin in 2 shots or less.',
      activePieceIds: [STRIKER, 'outer-black-coin-3'],
      placements: {
        'outer-black-coin-3': { x: -0.72, z: 0.74 }
      },
      targetPieceIds: ['outer-black-coin-3'],
      targetPocketId: 'pocket-3',
      highlights: targetHighlights('angle-shot-2', 'outer-black-coin-3', 'pocket-3')
    })
  },
  {
    id: 'queen-cover-1',
    title: 'Queen Cover I',
    type: 'queenCover',
    difficulty: 'normal',
    description: 'Claim the queen, then cover with the normal coin.',
    objectiveText: 'Pocket the queen and cover it before the shot limit.',
    shotLimit: 3,
    idealShots: 2,
    queenRequired: true,
    coverPieceId: 'inner-white-coin-3',
    boardSetup: baseScenario({
      id: 'queen-cover-1',
      title: 'Queen Cover I',
      objectiveText: 'Pocket the queen, then cover with the white coin.',
      activePieceIds: [STRIKER, QUEEN, 'inner-white-coin-3'],
      placements: {
        [QUEEN]: { x: 1.28, z: 1.48 },
        'inner-white-coin-3': { x: -1.15, z: 1.35 }
      },
      targetPieceIds: [QUEEN, 'inner-white-coin-3'],
      targetPocketId: 'pocket-4',
      highlights: [
        { id: 'queen-cover-1-queen', type: 'piece', pieceId: QUEEN, tone: 'queen' },
        { id: 'queen-cover-1-cover', type: 'piece', pieceId: 'inner-white-coin-3' },
        { id: 'queen-cover-1-pocket', type: 'pocket', pocketId: 'pocket-4' }
      ]
    })
  },
  {
    id: 'queen-cover-2',
    title: 'Queen Cover II',
    type: 'queenCover',
    difficulty: 'hard',
    description: 'A tighter queen-cover route with a harder cover coin.',
    objectiveText: 'Pocket the queen and cover it before the shot limit.',
    shotLimit: 3,
    idealShots: 2,
    queenRequired: true,
    coverPieceId: 'inner-black-coin-4',
    boardSetup: baseScenario({
      id: 'queen-cover-2',
      title: 'Queen Cover II',
      objectiveText: 'Pocket the queen, then cover with the black coin.',
      activePieceIds: [STRIKER, QUEEN, 'inner-black-coin-4'],
      placements: {
        [QUEEN]: { x: -1.2, z: 1.46 },
        'inner-black-coin-4': { x: 1.08, z: 1.02 }
      },
      targetPieceIds: [QUEEN, 'inner-black-coin-4'],
      targetPocketId: 'pocket-3',
      highlights: [
        { id: 'queen-cover-2-queen', type: 'piece', pieceId: QUEEN, tone: 'queen' },
        { id: 'queen-cover-2-cover', type: 'piece', pieceId: 'inner-black-coin-4' },
        { id: 'queen-cover-2-pocket', type: 'pocket', pocketId: 'pocket-3' }
      ]
    })
  },
  {
    id: 'bank-basic-1',
    title: 'Bank Basic I',
    type: 'bankBasic',
    difficulty: 'normal',
    description: 'Use the rail if you need it. V1 checks the pocketed target.',
    objectiveText: 'Pocket the highlighted coin in 2 shots or less.',
    shotLimit: 2,
    idealShots: 2,
    boardSetup: baseScenario({
      id: 'bank-basic-1',
      title: 'Bank Basic I',
      objectiveText: 'Pocket the highlighted coin in 2 shots or less.',
      activePieceIds: [STRIKER, 'outer-white-coin-4'],
      placements: {
        'outer-white-coin-4': { x: 1.96, z: 0.15 }
      },
      targetPieceIds: ['outer-white-coin-4'],
      targetPocketId: 'pocket-4',
      highlights: targetHighlights('bank-basic-1', 'outer-white-coin-4', 'pocket-4')
    })
  },
  {
    id: 'bank-basic-2',
    title: 'Bank Basic II',
    type: 'bankBasic',
    difficulty: 'hard',
    description: 'A harder rail-side target with two shots.',
    objectiveText: 'Pocket the highlighted coin in 2 shots or less.',
    shotLimit: 2,
    idealShots: 2,
    boardSetup: baseScenario({
      id: 'bank-basic-2',
      title: 'Bank Basic II',
      objectiveText: 'Pocket the highlighted coin in 2 shots or less.',
      activePieceIds: [STRIKER, 'outer-black-coin-7'],
      placements: {
        'outer-black-coin-7': { x: -1.92, z: 0.06 }
      },
      targetPieceIds: ['outer-black-coin-7'],
      targetPocketId: 'pocket-3',
      highlights: targetHighlights('bank-basic-2', 'outer-black-coin-7', 'pocket-3')
    })
  },
  {
    id: 'clean-break-1',
    title: 'Clean Break',
    type: 'cleanBreak',
    difficulty: 'normal',
    description: 'Break the standard cluster and pocket at least one normal coin.',
    objectiveText: 'Pocket at least one normal coin from the break shot.',
    shotLimit: 1,
    idealShots: 1,
    boardSetup: baseScenario({
      id: 'clean-break-1',
      title: 'Clean Break',
      objectiveText: 'Pocket at least one normal coin from the break shot.',
      resetToDefault: true,
      activePieceIds: null,
      placements: {},
      highlights: [
        { id: 'clean-break-cluster', type: 'center' },
        { id: 'clean-break-baseline', type: 'baseline', baseline: 'bottom' }
      ]
    })
  },
  {
    id: 'foul-avoidance-1',
    title: 'Foul Avoidance',
    type: 'foulAvoidance',
    difficulty: 'hard',
    description: 'Score the target without losing the striker.',
    objectiveText: 'Pocket the target coin without pocketing the striker.',
    shotLimit: 2,
    idealShots: 1,
    failOnStriker: true,
    boardSetup: baseScenario({
      id: 'foul-avoidance-1',
      title: 'Foul Avoidance',
      objectiveText: 'Pocket the target coin without pocketing the striker.',
      activePieceIds: [STRIKER, 'outer-white-coin-8'],
      placements: {
        'outer-white-coin-8': { x: 1.28, z: 1.32 }
      },
      targetPieceIds: ['outer-white-coin-8'],
      targetPocketId: 'pocket-4',
      highlights: targetHighlights('foul-avoidance-1', 'outer-white-coin-8', 'pocket-4')
    })
  }
];

export function getChallengeById(id) {
  return CHALLENGES.find((challenge) => challenge.id === id) || CHALLENGES[0];
}

export function getNextChallengeId(currentId) {
  const index = CHALLENGES.findIndex((challenge) => challenge.id === currentId);
  return CHALLENGES[(index + 1 + CHALLENGES.length) % CHALLENGES.length].id;
}
