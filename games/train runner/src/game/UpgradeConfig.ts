import type { UpgradeId } from './types';

export interface UpgradeConfig {
  id: UpgradeId;
  label: string;
  description: string;
  maxLevel: number;
  baseCost: number;
  costStep: number;
  benefit: string;
}

export const UPGRADE_CONFIGS: UpgradeConfig[] = [
  {
    id: 'maxHealth',
    label: 'Max Health',
    description: 'Adds one heart at levels 2 and 4.',
    maxLevel: 5,
    baseCost: 120,
    costStep: 80,
    benefit: '+2 hearts at max'
  },
  {
    id: 'jumpPower',
    label: 'Jump Power',
    description: 'Slightly increases jump velocity for safer gap clears.',
    maxLevel: 5,
    baseCost: 100,
    costStep: 70,
    benefit: '+10% jump at max'
  },
  {
    id: 'dashCooldown',
    label: 'Dash Cooldown',
    description: 'Lets dodge bursts come back faster.',
    maxLevel: 5,
    baseCost: 110,
    costStep: 75,
    benefit: '-20% cooldown at max'
  },
  {
    id: 'specialChargeRate',
    label: 'Special Charge Rate',
    description: 'Increases energy gained from orbs, combat, and clean jumps.',
    maxLevel: 5,
    baseCost: 130,
    costStep: 85,
    benefit: '+30% energy gain at max'
  },
  {
    id: 'magnetRadius',
    label: 'Magnet Radius',
    description: 'Pulls coins, energy, and route tokens from farther away.',
    maxLevel: 5,
    baseCost: 90,
    costStep: 65,
    benefit: '+35% pickup radius at max'
  },
  {
    id: 'comboStability',
    label: 'Combo Stability',
    description: 'Slows FLOW decay during recovery beats.',
    maxLevel: 5,
    baseCost: 115,
    costStep: 80,
    benefit: '-35% combo decay at max'
  },
  {
    id: 'damagePower',
    label: 'Damage Power',
    description: 'Improves basic combo and finisher damage.',
    maxLevel: 5,
    baseCost: 140,
    costStep: 95,
    benefit: '+25% damage at max'
  },
  {
    id: 'shieldStartChance',
    label: 'Shield Start Chance',
    description: 'Adds a chance to begin each route with one shield.',
    maxLevel: 5,
    baseCost: 125,
    costStep: 90,
    benefit: '20% start shield at max'
  }
];

export const DEFAULT_UPGRADE_LEVELS = Object.fromEntries(UPGRADE_CONFIGS.map((upgrade) => [upgrade.id, 0])) as Record<UpgradeId, number>;

export function getUpgradeCost(id: UpgradeId, currentLevel: number): number | null {
  const config = UPGRADE_CONFIGS.find((upgrade) => upgrade.id === id);
  if (!config || currentLevel >= config.maxLevel) {
    return null;
  }

  return config.baseCost + currentLevel * config.costStep + Math.max(0, currentLevel - 1) * 25;
}

