import { LEVELS } from '../src/game/levels.js';
import { COURSE_PACKS, getCourseLevels, getCoursePack, getCoursePar, getLevelById } from '../src/game/coursePacks.js';
import { validateAllLevels } from '../src/game/levelValidation.js';
import { storage } from '../src/game/storage.js';
import { ONLINE_LIMITS, isValidRoomCode, maxShotsForPar, normalizeCourseLength, normalizeDirectionPayload, sanitizeDisplayName, sanitizeRoomCode } from '../src/shared/onlineProtocol.js';

const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

assert(LEVELS.length === 24, `Expected 24 levels, found ${LEVELS.length}`);
assert(new Set(LEVELS.map((level) => level.id)).size === LEVELS.length, 'Level ids must be unique');

for (const pack of COURSE_PACKS) {
  const levels = getCourseLevels(pack.id, 12);
  assert(levels.length === 12, `${pack.id} should resolve 12 levels`);
  assert(getCoursePar(levels) > 0, `${pack.id} should have positive par`);
  for (const length of pack.lengths) {
    assert(getCourseLevels(pack.id, length).length === length, `${pack.id} length ${length} failed`);
  }
}

assert(getCoursePack('missing').id === 'ivory-garden', 'Unknown course pack should fall back safely');
assert(getLevelById(999).id === 1, 'Unknown level should fall back safely');

for (const error of validateAllLevels()) failures.push(error);

const normalized = storage.saveAll({
  version: 5,
  bestScores: { 1: 2 },
  ghostReplays: { 1: { levelId: 1, samples: Array.from({ length: 300 }, (_, index) => ({ x: index, z: index })) } },
  replays: { lastShots: { 1: { levelId: 1, samples: [{ x: 0, z: 0 }, { x: 1, z: 1 }] } } },
  cosmetics: { equipped: { ball: 'midnight-black' }, unlocked: {} },
  matchHistory: Array.from({ length: 25 }, (_, index) => ({ mode: 'audit', date: String(index) })),
  resultCards: Array.from({ length: 25 }, (_, index) => ({ kind: 'audit', date: String(index) }))
});

assert(normalized.bestScores['1'].shots === 2, 'Numeric best score migration failed');
assert(normalized.ghostReplays['1'].samples.length <= 180, 'Ghost replay cap failed');
assert(normalized.matchHistory.length === 20, 'Match history cap failed');
assert(normalized.resultCards.length === 20, 'Result card cap failed');
assert(normalized.cosmetics.equipped.ball === 'classic-ivory', 'Locked cosmetic should normalize to default');

assert(sanitizeDisplayName('<Bad!!! Name That Is Too Long>') === 'Bad Name That Is T', 'Display name sanitization changed unexpectedly');
assert(sanitizeRoomCode(' ab-12* ') === 'AB12', 'Room code sanitization failed');
assert(!isValidRoomCode('AB12'), 'Short room code should be invalid');
assert(isValidRoomCode('AB123'), 'Valid room code rejected');
assert(normalizeCourseLength(12, ONLINE_LIMITS.COURSE_LENGTHS_PUBLIC) === 3, 'Public course length fallback failed');
assert(maxShotsForPar(5) === 10, 'Max shot rule failed');
assert(normalizeDirectionPayload({ x: 10, z: 0 }) === null, 'Oversized direction should be rejected');
assert(normalizeDirectionPayload({ x: 1, z: 0 })?.x === 1, 'Valid direction should normalize');

if (failures.length) {
  console.error(`Ivory Golf Royale audit failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Ivory Golf Royale audit passed: ${LEVELS.length} levels, ${COURSE_PACKS.length} packs, local save/protocol checks ok.`);
