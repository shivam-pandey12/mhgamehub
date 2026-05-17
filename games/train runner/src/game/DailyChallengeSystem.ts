import { DIFFICULTY_PROFILES, getRouteById } from './RouteConfig';
import type { DailyChallenge, DailyChallengeKind, DifficultyId, RouteId } from './types';

const DAILY_ROUTES: RouteId[] = ['neon-express', 'dustline-runner', 'frost-rail'];
const DAILY_KINDS: DailyChallengeKind[] = ['neonRush', 'bossHunt', 'noDamage', 'coinSprint'];

export function getTodayKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDailyChallenge(date = new Date()): DailyChallenge {
  const dateKey = getTodayKey(date);
  const seed = hashString(dateKey);
  const routeId = DAILY_ROUTES[seed % DAILY_ROUTES.length];
  const kind = DAILY_KINDS[Math.floor(seed / 7) % DAILY_KINDS.length];
  const difficulty: DifficultyId = kind === 'bossHunt' ? 'hard' : getRouteById(routeId).difficulty;
  const route = getRouteById(routeId);
  const label = getKindLabel(kind, route.displayName);

  return {
    dateKey,
    id: `${dateKey}-${kind}-${routeId}`,
    kind,
    displayName: label.title,
    routeId,
    difficulty,
    objectiveLabel: label.objective,
    rewardCoins: 160 + (DIFFICULTY_PROFILES[difficulty].enemyFrequency > 1 ? 60 : 0),
    seed
  };
}

function getKindLabel(kind: DailyChallengeKind, routeName: string): { title: string; objective: string } {
  if (kind === 'bossHunt') {
    return { title: 'Daily Boss Hunt', objective: `Defeat the boss on ${routeName}` };
  }

  if (kind === 'noDamage') {
    return { title: 'Daily No-Damage', objective: 'Complete the run taking no damage' };
  }

  if (kind === 'coinSprint') {
    return { title: 'Daily Coin Sprint', objective: 'Collect 90 coins before the summary' };
  }

  return { title: 'Daily Neon Rush', objective: `Set a high score on ${routeName}` };
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

