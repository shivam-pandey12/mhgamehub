import type { CosmeticCategory, CosmeticId, RouteId, SkinId, WeaponStyleId } from './types';

export interface WeaponStyleConfig {
  id: WeaponStyleId;
  label: string;
  description: string;
  unlockText: string;
  unlockRoute?: RouteId;
  coinCost?: number;
  damageMultiplier: number;
  rangeMultiplier: number;
  cooldownMultiplier: number;
  specialChargeBonus: number;
  color: number;
}

export interface SkinConfig {
  id: SkinId;
  label: string;
  description: string;
  unlockText: string;
  unlockRoute?: RouteId;
  requiresAnyS?: boolean;
  requiresAchievements?: number;
  colors: {
    suit: number;
    armor: number;
    accent: number;
    visor: number;
  };
}

export interface CosmeticConfig {
  id: CosmeticId;
  category: CosmeticCategory;
  label: string;
  description: string;
  unlockText: string;
  unlockRoute?: RouteId;
  coinCost?: number;
  color?: number;
}

export const WEAPON_STYLE_CONFIGS: WeaponStyleConfig[] = [
  {
    id: 'shockGauntlets',
    label: 'Shock Gauntlets',
    description: 'Fast electric punches with balanced reach.',
    unlockText: 'Default style',
    damageMultiplier: 1,
    rangeMultiplier: 1,
    cooldownMultiplier: 1,
    specialChargeBonus: 0,
    color: 0x68f7ff
  },
  {
    id: 'energyBaton',
    label: 'Energy Baton',
    description: 'Longer blue-gold strikes and a heavier finisher.',
    unlockText: 'Complete Dustline Runner or spend 450 coins',
    unlockRoute: 'dustline-runner',
    coinCost: 450,
    damageMultiplier: 1.12,
    rangeMultiplier: 1.16,
    cooldownMultiplier: 1.04,
    specialChargeBonus: 0.06,
    color: 0xffd166
  },
  {
    id: 'railBlade',
    label: 'Rail Blade',
    description: 'Short, sharp slash chains with faster recovery.',
    unlockText: 'Complete Frost Rail or spend 700 coins',
    unlockRoute: 'frost-rail',
    coinCost: 700,
    damageMultiplier: 1.08,
    rangeMultiplier: 1.06,
    cooldownMultiplier: 0.86,
    specialChargeBonus: 0.03,
    color: 0xdffcff
  }
];

export const SKIN_CONFIGS: SkinConfig[] = [
  {
    id: 'defaultRunner',
    label: 'Default Runner',
    description: 'Balanced action-runner suit.',
    unlockText: 'Default skin',
    colors: { suit: 0x202838, armor: 0xd8e3ec, accent: 0x38e8ff, visor: 0x083c5d }
  },
  {
    id: 'cyberAgent',
    label: 'Cyber Agent',
    description: 'Neon city stealth plates and cyan glow.',
    unlockText: 'Complete Neon Express',
    unlockRoute: 'neon-express',
    colors: { suit: 0x10243f, armor: 0x9ddcff, accent: 0xff4fc3, visor: 0x38e8ff }
  },
  {
    id: 'desertRaider',
    label: 'Desert Raider',
    description: 'Dust-worn armor with amber route markings.',
    unlockText: 'Complete Dustline Runner',
    unlockRoute: 'dustline-runner',
    colors: { suit: 0x463024, armor: 0xd4a373, accent: 0xffb454, visor: 0x8df7c6 }
  },
  {
    id: 'frostOperative',
    label: 'Frost Operative',
    description: 'Pale armor and frost-blue lenses.',
    unlockText: 'Complete Frost Rail',
    unlockRoute: 'frost-rail',
    colors: { suit: 0x1a2b3e, armor: 0xdffcff, accent: 0x70f7ff, visor: 0x9ddcff }
  },
  {
    id: 'shadowNinja',
    label: 'Shadow Ninja',
    description: 'Black tactical shell with clean white-blue accents.',
    unlockText: 'Earn any S grade',
    requiresAnyS: true,
    colors: { suit: 0x080c14, armor: 0x59636f, accent: 0xdffcff, visor: 0x101827 }
  },
  {
    id: 'goldenChampion',
    label: 'Golden Champion',
    description: 'High-tier victory suit for completionists.',
    unlockText: 'Complete 12 achievements',
    requiresAchievements: 12,
    colors: { suit: 0x2b2112, armor: 0xffd166, accent: 0xfff4bd, visor: 0xffb454 }
  }
];

export const COSMETIC_CONFIGS: CosmeticConfig[] = [
  {
    id: 'cyberChrome',
    category: 'trainPaint',
    label: 'Cyber Chrome',
    description: 'Clean neon train paint.',
    unlockText: 'Default paint',
    color: 0x38e8ff
  },
  {
    id: 'dustlineRust',
    category: 'trainPaint',
    label: 'Dustline Rust',
    description: 'Warm cargo paint with desert wear.',
    unlockText: 'Complete Dustline Runner',
    unlockRoute: 'dustline-runner',
    color: 0xffb454
  },
  {
    id: 'frostGuard',
    category: 'trainPaint',
    label: 'Frost Guard',
    description: 'Armored pale trim with cold emissives.',
    unlockText: 'Complete Frost Rail',
    unlockRoute: 'frost-rail',
    color: 0x9ddcff
  },
  {
    id: 'trailCyan',
    category: 'trailColor',
    label: 'Cyan Trail',
    description: 'Default energy slash color.',
    unlockText: 'Default trail',
    color: 0x68f7ff
  },
  {
    id: 'trailAmber',
    category: 'trailColor',
    label: 'Amber Trail',
    description: 'Gold special-wave trail.',
    unlockText: 'Spend 280 coins',
    coinCost: 280,
    color: 0xffb454
  },
  {
    id: 'trailFrost',
    category: 'trailColor',
    label: 'Frost Trail',
    description: 'Bright icy slash wave.',
    unlockText: 'Complete Frost Rail',
    unlockRoute: 'frost-rail',
    color: 0xdffcff
  },
  {
    id: 'bannerStandard',
    category: 'victoryBanner',
    label: 'Standard Banner',
    description: 'Clean default result styling.',
    unlockText: 'Default banner'
  },
  {
    id: 'bannerNeon',
    category: 'victoryBanner',
    label: 'Neon Banner',
    description: 'Cyan-magenta victory treatment.',
    unlockText: 'Complete Neon Express',
    unlockRoute: 'neon-express'
  },
  {
    id: 'bannerGold',
    category: 'victoryBanner',
    label: 'Gold Banner',
    description: 'Premium S-rank celebration styling.',
    unlockText: 'Earn any S grade',
    coinCost: 650
  }
];

export const DEFAULT_EQUIPPED_COSMETICS: Record<CosmeticCategory, CosmeticId> = {
  trainPaint: 'cyberChrome',
  trailColor: 'trailCyan',
  victoryBanner: 'bannerStandard'
};

