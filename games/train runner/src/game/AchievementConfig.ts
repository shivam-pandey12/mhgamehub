import type { AchievementId, CosmeticId, RouteId } from './types';

export interface AchievementConfig {
  id: AchievementId;
  label: string;
  description: string;
  target: number;
  rewardCoins: number;
  rewardCosmetic?: CosmeticId;
  routeId?: RouteId;
}

export const ACHIEVEMENT_CONFIGS: AchievementConfig[] = [
  { id: 'firstRide', label: 'First Ride', description: 'Complete your first route.', target: 1, rewardCoins: 80 },
  { id: 'skybreaker', label: 'Skybreaker', description: 'Defeat SKY RAIDER once.', target: 1, rewardCoins: 90 },
  { id: 'perfectReflex', label: 'Perfect Reflex', description: 'Perform 10 perfect dodges total.', target: 10, rewardCoins: 120 },
  { id: 'comboFlow', label: 'Combo Flow', description: 'Reach FLOW x5.', target: 5, rewardCoins: 110 },
  { id: 'noFallHero', label: 'No Fall Hero', description: 'Complete any route without falling.', target: 1, rewardCoins: 140 },
  { id: 'coinRunner', label: 'Coin Runner', description: 'Collect 500 total coins.', target: 500, rewardCoins: 150 },
  { id: 'enemySweeper', label: 'Enemy Sweeper', description: 'Defeat 100 enemies total.', target: 100, rewardCoins: 175 },
  { id: 'bossHunter', label: 'Boss Hunter', description: 'Defeat 5 bosses total.', target: 5, rewardCoins: 220 },
  { id: 'specialMaster', label: 'Special Master', description: 'Use special attack 25 times.', target: 25, rewardCoins: 160 },
  { id: 'neonChampion', label: 'Neon Champion', description: 'Earn A grade or better on Neon Express.', target: 1, rewardCoins: 130, routeId: 'neon-express' },
  { id: 'desertSurvivor', label: 'Desert Survivor', description: 'Complete Dustline Runner.', target: 1, rewardCoins: 135, routeId: 'dustline-runner' },
  { id: 'frostWalker', label: 'Frost Walker', description: 'Complete Frost Rail.', target: 1, rewardCoins: 150, routeId: 'frost-rail' },
  { id: 'collector', label: 'Collector', description: 'Collect 10 route tokens total.', target: 10, rewardCoins: 160 },
  { id: 'sRankRunner', label: 'S-Rank Runner', description: 'Earn an S grade on any route.', target: 1, rewardCoins: 220, rewardCosmetic: 'bannerGold' },
  { id: 'untouchable', label: 'Untouchable', description: 'Complete a route taking no damage.', target: 1, rewardCoins: 250 }
];

