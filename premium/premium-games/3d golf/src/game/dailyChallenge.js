import { LEVELS } from './levels.js';
import { getLevelById, getPackForLevel } from './coursePacks.js';

const OBJECTIVES = [
  { id: 'under-par', label: 'Finish under par', isMet: ({ result }) => result.shots + result.penalties < result.par },
  { id: 'no-wall', label: 'No wall touch', isMet: ({ result }) => result.flags?.noWallTouch },
  { id: 'two-shots', label: 'Finish in 2 shots or fewer', isMet: ({ result }) => result.shots <= 2 },
  { id: 'no-aim', label: 'Aim assist off', isMet: ({ result }) => !result.flags?.aimAssistAtStart },
  { id: 'no-fall', label: 'No out-of-bounds', isMet: ({ result }) => !result.flags?.fellOut }
];

function dateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function seedFromDate(key) {
  return key.split('-').reduce((sum, part, index) => sum + Number(part) * (index + 3), 17);
}

export function getTodayChallenge(date = new Date()) {
  const key = dateKey(date);
  const seed = seedFromDate(key);
  const level = LEVELS[seed % LEVELS.length];
  const objective = OBJECTIVES[Math.floor(seed / LEVELS.length) % OBJECTIVES.length];
  const pack = getPackForLevel(level.id);
  return {
    id: `${key}:${level.id}:${objective.id}`,
    dateKey: key,
    levelId: level.id,
    levelName: level.name,
    packId: pack.id,
    packName: pack.name,
    par: level.par,
    objectiveId: objective.id,
    objective: objective.label
  };
}

export function isDailyResultMet(daily, result) {
  const level = getLevelById(daily.levelId);
  const objective = OBJECTIVES.find((item) => item.id === daily.objectiveId) ?? OBJECTIVES[0];
  return result.levelId === level.id && objective.isMet({ result, level });
}

export function msToNextDaily(now = new Date()) {
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return Math.max(0, next.getTime() - now.getTime());
}

export function formatCountdown(ms) {
  const totalMinutes = Math.ceil(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${String(minutes).padStart(2, '0')}m`;
}
