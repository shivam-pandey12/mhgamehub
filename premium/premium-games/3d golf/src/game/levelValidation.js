import { COURSE_PACKS, getCourseLevels, getPackForLevel } from './coursePacks.js';
import { LEVELS, isInsideFallBounds, isPointOnCourse } from './levels.js';

function isFiniteNumber(value) {
  return Number.isFinite(Number(value));
}

function validateRect(rect, label, errors) {
  if (!rect || !isFiniteNumber(rect.x) || !isFiniteNumber(rect.z) || Number(rect.w) <= 0 || Number(rect.d) <= 0) {
    errors.push(`${label} is missing or invalid`);
  }
}

export function validateLevel(level) {
  const errors = [];
  if (!level || typeof level !== 'object') return ['Level is not an object'];
  if (!isFiniteNumber(level.id)) errors.push('level id is invalid');
  if (!level.name) errors.push(`level ${level.id ?? '?'} has no name`);
  if (!isFiniteNumber(level.par) || Number(level.par) < 1 || Number(level.par) > 8) errors.push(`${level.name ?? level.id} par is invalid`);
  if (!isFiniteNumber(level.start?.x) || !isFiniteNumber(level.start?.z)) errors.push(`${level.name ?? level.id} start is invalid`);
  if (!isFiniteNumber(level.hole?.x) || !isFiniteNumber(level.hole?.z)) errors.push(`${level.name ?? level.id} hole is invalid`);
  validateRect(level.platform, `${level.name ?? level.id} platform`, errors);
  if (!Array.isArray(level.playAreas) || level.playAreas.length === 0) errors.push(`${level.name ?? level.id} has no play areas`);
  for (const [index, area] of (level.playAreas ?? []).entries()) validateRect(area, `${level.name ?? level.id} play area ${index + 1}`, errors);
  if (!Array.isArray(level.walls) || level.walls.length < 2) errors.push(`${level.name ?? level.id} has too few walls`);
  if (!isPointOnCourse(level, level.start.x, level.start.z, 0.2, [])) errors.push(`${level.name ?? level.id} start is off course`);
  if (!isPointOnCourse(level, level.hole.x, level.hole.z, 0.2, [])) errors.push(`${level.name ?? level.id} hole is off course`);
  if (!isInsideFallBounds(level, level.start.x, level.start.z)) errors.push(`${level.name ?? level.id} start is outside fall bounds`);
  if (!isInsideFallBounds(level, level.hole.x, level.hole.z)) errors.push(`${level.name ?? level.id} hole is outside fall bounds`);
  if (!getPackForLevel(level.id)?.levelIds?.includes(level.id)) errors.push(`${level.name ?? level.id} is not mapped to its pack`);
  return errors;
}

export function validateAllLevels() {
  const errors = [];
  const ids = new Set();
  for (const level of LEVELS) {
    if (ids.has(level.id)) errors.push(`duplicate level id ${level.id}`);
    ids.add(level.id);
    for (const error of validateLevel(level)) errors.push(error);
  }
  if (LEVELS.length !== 24) errors.push(`expected 24 levels, found ${LEVELS.length}`);
  for (const pack of COURSE_PACKS) {
    const levels = getCourseLevels(pack.id, 12);
    if (levels.length !== 12) errors.push(`${pack.id} expected 12 levels, found ${levels.length}`);
    for (const length of pack.lengths) {
      if (getCourseLevels(pack.id, length).length !== length) errors.push(`${pack.id} length ${length} does not resolve`);
    }
  }
  return errors;
}
