import type { DifficultyId, DifficultyProfile, Grade, RouteConfig, RouteId } from './types';

export const GRADE_ORDER: Grade[] = ['C', 'B', 'A', 'S', 'S+'];

export const DIFFICULTY_PROFILES: Record<DifficultyId, DifficultyProfile> = {
  easy: {
    id: 'easy',
    label: 'Easy',
    spawnSpacingMultiplier: 1.16,
    pickupGenerosity: 1.2,
    enemyFrequency: 0.82,
    mixedFrequency: 0.7,
    bossWarningMultiplier: 1.18
  },
  normal: {
    id: 'normal',
    label: 'Normal',
    spawnSpacingMultiplier: 1,
    pickupGenerosity: 1,
    enemyFrequency: 1,
    mixedFrequency: 1,
    bossWarningMultiplier: 1
  },
  hard: {
    id: 'hard',
    label: 'Hard',
    spawnSpacingMultiplier: 0.88,
    pickupGenerosity: 0.86,
    enemyFrequency: 1.2,
    mixedFrequency: 1.18,
    bossWarningMultiplier: 0.88
  },
  expert: {
    id: 'expert',
    label: 'Expert',
    spawnSpacingMultiplier: 0.78,
    pickupGenerosity: 0.72,
    enemyFrequency: 1.35,
    mixedFrequency: 1.34,
    bossWarningMultiplier: 0.78
  }
};

export const ROUTE_CONFIGS: RouteConfig[] = [
  {
    id: 'neon-express',
    displayName: 'Neon Express',
    biome: 'cyber',
    difficulty: 'easy',
    playable: true,
    targetDistance: 760,
    bossStartDistance: 650,
    bossName: 'SKY RAIDER',
    bossHealth: 12,
    trainVariant: 'cyberMaglev',
    allowedObstacleTypes: ['lowBarrier', 'roofCrate', 'electricGate', 'brokenPanel', 'hangingBeam'],
    allowedEnemyTypes: ['laneBlocker', 'runner', 'shield'],
    objectives: [
      { id: 'complete-neon', type: 'completeRoute', label: 'Defeat SKY RAIDER', target: 1 },
      { id: 'neon-dodges', type: 'perfectDodges', label: 'Perfect dodge x3', target: 3 },
      { id: 'neon-coins', type: 'coins', label: 'Collect 75 coins', target: 75 }
    ],
    setPieces: [
      { type: 'tunnelRush', start: 270, end: 350 },
      { type: 'sideTrain', start: 470, end: 555 }
    ],
    rewardCoins: 120,
    unlockText: 'Unlocked by default',
    tokenType: 'dataChip',
    tokenLabel: 'Data Chips',
    tokenCount: 3,
    theme: { primary: 0x38e8ff, secondary: 0xff4fc3, accent: 0xffb454 }
  },
  {
    id: 'dustline-runner',
    displayName: 'Dustline Runner',
    biome: 'desert',
    difficulty: 'normal',
    playable: true,
    targetDistance: 860,
    bossStartDistance: 720,
    bossName: 'DUNE WARHAWK',
    bossHealth: 14,
    trainVariant: 'desertCargo',
    allowedObstacleTypes: ['lowBarrier', 'roofCrate', 'brokenPanel', 'hangingBeam'],
    allowedEnemyTypes: ['laneBlocker', 'runner', 'shield'],
    objectives: [
      { id: 'complete-dustline', type: 'completeRoute', label: 'Reach the engine', target: 1 },
      { id: 'dustline-enemies', type: 'enemyDefeats', label: 'Defeat 12 enemies', target: 12 },
      { id: 'dustline-damage', type: 'damageLimit', label: 'Take less than 3 hits', target: 2 }
    ],
    setPieces: [{ type: 'sideTrain', start: 520, end: 610 }],
    rewardCoins: 160,
    unlockText: 'Complete Neon Express',
    tokenType: 'desertRelic',
    tokenLabel: 'Desert Relics',
    tokenCount: 4,
    theme: { primary: 0xffb454, secondary: 0xd47a36, accent: 0x8df7c6 }
  },
  {
    id: 'frost-rail',
    displayName: 'Frost Rail',
    biome: 'snow',
    difficulty: 'hard',
    playable: true,
    targetDistance: 940,
    bossStartDistance: 780,
    bossName: 'ICE DRONE CARRIER',
    bossHealth: 16,
    trainVariant: 'snowArmored',
    allowedObstacleTypes: ['lowBarrier', 'electricGate', 'brokenPanel', 'hangingBeam', 'roofCrate'],
    allowedEnemyTypes: ['runner', 'shield', 'laneBlocker'],
    objectives: [
      { id: 'complete-frost', type: 'completeRoute', label: 'Defeat the carrier', target: 1 },
      { id: 'frost-specials', type: 'specialUses', label: 'Use special x2', target: 2 },
      { id: 'frost-tokens', type: 'routeTokens', label: 'Collect 5 crystals', target: 5 }
    ],
    setPieces: [
      { type: 'tunnelRush', start: 240, end: 330 },
      { type: 'tunnelRush', start: 560, end: 630 }
    ],
    rewardCoins: 220,
    unlockText: 'Complete Dustline Runner with grade B or higher',
    tokenType: 'frozenCrystal',
    tokenLabel: 'Frozen Crystals',
    tokenCount: 5,
    theme: { primary: 0x9ddcff, secondary: 0xdffcff, accent: 0x70f7ff }
  },
  {
    id: 'jungle-breakline',
    displayName: 'Jungle Breakline',
    biome: 'jungle',
    difficulty: 'hard',
    playable: false,
    targetDistance: 980,
    bossStartDistance: 800,
    bossName: 'RAIDER COPTER',
    bossHealth: 18,
    trainVariant: 'jungleSupply',
    allowedObstacleTypes: ['lowBarrier', 'roofCrate', 'brokenPanel', 'hangingBeam'],
    allowedEnemyTypes: ['runner', 'shield'],
    objectives: [
      { id: 'complete-jungle', type: 'completeRoute', label: 'Clear the ruins', target: 1 },
      { id: 'jungle-objectives', type: 'enemyDefeats', label: 'Defeat 16 enemies', target: 16 },
      { id: 'jungle-tokens', type: 'routeTokens', label: 'Collect 5 idols', target: 5 }
    ],
    setPieces: [{ type: 'sideTrain', start: 520, end: 610 }],
    rewardCoins: 260,
    unlockText: 'Complete 6 total objectives',
    tokenType: 'jungleIdol',
    tokenLabel: 'Jungle Idols',
    tokenCount: 5,
    theme: { primary: 0x65d47a, secondary: 0x2f6f4e, accent: 0xffd166 }
  },
  {
    id: 'volcano-freight',
    displayName: 'Volcano Freight',
    biome: 'lava',
    difficulty: 'expert',
    playable: false,
    targetDistance: 1080,
    bossStartDistance: 880,
    bossName: 'FIRESTORM COPTER',
    bossHealth: 20,
    trainVariant: 'lavaFreight',
    allowedObstacleTypes: ['roofCrate', 'electricGate', 'brokenPanel', 'hangingBeam'],
    allowedEnemyTypes: ['runner', 'shield'],
    objectives: [
      { id: 'complete-volcano', type: 'completeRoute', label: 'Survive Firestorm', target: 1 },
      { id: 'volcano-perfect', type: 'perfectDodges', label: 'Perfect dodge x6', target: 6 },
      { id: 'volcano-tokens', type: 'routeTokens', label: 'Collect 5 lava cores', target: 5 }
    ],
    setPieces: [{ type: 'sideTrain', start: 580, end: 680 }],
    rewardCoins: 340,
    unlockText: 'Earn at least one S grade',
    tokenType: 'lavaCore',
    tokenLabel: 'Lava Cores',
    tokenCount: 5,
    theme: { primary: 0xff5f6d, secondary: 0xff7a2d, accent: 0xffd166 }
  }
];

export const DEFAULT_ROUTE_ID: RouteId = 'neon-express';

export function getRouteById(routeId: RouteId): RouteConfig {
  return ROUTE_CONFIGS.find((route) => route.id === routeId) ?? ROUTE_CONFIGS[0];
}

export function getNextRoute(routeId: RouteId): RouteConfig | null {
  const index = ROUTE_CONFIGS.findIndex((route) => route.id === routeId);
  return ROUTE_CONFIGS.slice(index + 1).find((route) => route.playable) ?? null;
}

export function isGradeAtLeast(grade: Grade | null, minimum: Grade): boolean {
  if (!grade) {
    return false;
  }

  return GRADE_ORDER.indexOf(grade) >= GRADE_ORDER.indexOf(minimum);
}
