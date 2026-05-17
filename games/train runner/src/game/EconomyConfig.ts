import type { Grade } from './types';

export const ECONOMY_CONFIG = {
  gradeBonus: {
    C: 20,
    B: 45,
    A: 80,
    S: 130,
    'S+': 200
  } satisfies Record<Grade, number>,
  objectiveBonus: 35,
  tokenBonus: 20,
  firstCompletionBonus: 85,
  dailyCompletionBonus: 120
} as const;

