import { LEVELS } from './levels.js';

export const COURSE_PACKS = [
  {
    id: 'ivory-garden',
    name: 'Ivory Garden',
    subtitle: 'Course Pack 1',
    theme: 'garden',
    description: 'Royal green corridors, marble trims, and golden rails.',
    levelIds: LEVELS.filter((level) => (level.packId ?? 'ivory-garden') === 'ivory-garden').map((level) => level.id),
    lengths: [3, 6, 12]
  },
  {
    id: 'sky-marble',
    name: 'Sky Marble',
    subtitle: 'Course Pack 2',
    theme: 'sky',
    description: 'Floating marble islands, glass bridges, wind lanes, and cloudlit temples.',
    levelIds: LEVELS.filter((level) => level.packId === 'sky-marble').map((level) => level.id),
    lengths: [3, 6, 12]
  }
];

export const FUTURE_PACKS = [
  'Desert Mirage',
  'Ice Palace',
  'Lava Forge',
  'Space Orbit'
];

export function getCoursePack(packId = 'ivory-garden') {
  return COURSE_PACKS.find((item) => item.id === packId) ?? COURSE_PACKS[0];
}

export function getLevelById(levelId) {
  return LEVELS.find((level) => level.id === Number(levelId)) ?? LEVELS[0];
}

export function getLevelIndexById(levelId) {
  return Math.max(0, LEVELS.findIndex((level) => level.id === Number(levelId)));
}

export function getPackForLevel(levelId) {
  const level = getLevelById(levelId);
  return getCoursePack(level.packId ?? 'ivory-garden');
}

export function getCourseLevels(packId = 'ivory-garden', length = 3) {
  if (typeof packId === 'number') {
    length = packId;
    packId = 'ivory-garden';
  }
  const pack = getCoursePack(packId);
  const ids = pack.levelIds.slice(0, length);
  return ids.map((id) => getLevelById(id)).filter(Boolean);
}

export function getCoursePar(levels) {
  return levels.reduce((sum, level) => sum + level.par, 0);
}

export function getCourseScopeId(packId = 'ivory-garden', length = 3) {
  return `${packId}:${length}`;
}

export function getPackProgress(packId, scores = {}) {
  const levels = getCourseLevels(packId, 12);
  const completed = levels.filter((level) => scores[String(level.id)]).length;
  const stars = levels.reduce((sum, level) => sum + (scores[String(level.id)]?.stars ?? 0), 0);
  return {
    completed,
    total: levels.length,
    stars,
    maxStars: levels.length * 3,
    percent: levels.length ? Math.round((completed / levels.length) * 100) : 0
  };
}
