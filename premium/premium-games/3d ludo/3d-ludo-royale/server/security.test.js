import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  createRateLimiter,
  isValidRoomCode,
  isValidTokenId,
  normalizeMatchmakingPreferences,
  normalizeSessionId,
  sanitizeDisplayName
} from './security.js';

describe('3D Ludo Royale server validation and rate limits', () => {
  it('sanitizes user-facing names and sessions', () => {
    assert.equal(sanitizeDisplayName('<Royal & Host>', 'Player'), 'Royal Host');
    assert.equal(normalizeSessionId('abc<> DEF_123'), 'abcDEF_123');
  });

  it('validates room codes and token ids', () => {
    assert.equal(isValidRoomCode('LUDO-7KQ2'), true);
    assert.equal(isValidRoomCode('????'), false);
    assert.equal(isValidTokenId('red-3'), true);
    assert.equal(isValidTokenId('red-4'), false);
  });

  it('falls back invalid matchmaking preferences safely', () => {
    const normalized = normalizeMatchmakingPreferences({
      playerCount: 9,
      preferredColor: 'purple',
      botFillMode: 'ranked',
      botDifficulty: 'impossible',
      botPersonality: 'chaos',
      matchSpeed: 'turbo'
    });

    assert.deepEqual(normalized, {
      playerCount: 2,
      preferredColor: null,
      botFillMode: 'after-wait',
      botDifficulty: 'medium',
      botPersonality: 'balanced',
      matchSpeed: 'normal'
    });
  });

  it('uses event-specific rate limit buckets', () => {
    let current = 1000;
    const limiter = createRateLimiter({ now: () => current });
    for (let index = 0; index < 5; index += 1) {
      assert.equal(limiter.check('socket-a', 'gameplay'), true);
    }
    assert.equal(limiter.check('socket-a', 'gameplay'), false);
    assert.equal(limiter.check('socket-a', 'roomCreate'), true);
    current += 1001;
    assert.equal(limiter.check('socket-a', 'gameplay'), true);
  });
});
