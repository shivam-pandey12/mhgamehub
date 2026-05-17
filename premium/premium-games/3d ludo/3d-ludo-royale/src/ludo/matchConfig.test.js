import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  buildMatchConfig,
  createQuickPlayOptions,
  formatDuration,
  normalizeOptions,
  pushEventLog
} from '../game/matchConfig.js';

describe('3D Ludo Royale local match config', () => {
  it('creates mixed controller config', () => {
    const config = buildMatchConfig({
      matchType: 'mixed',
      playerCount: 3,
      controllers: {
        red: 'human',
        blue: 'bot',
        green: 'human'
      }
    });

    assert.equal(config.matchType, 'mixed');
    assert.deepEqual(config.activePlayers, ['red', 'blue', 'green']);
    assert.equal(config.controllers.red, 'human');
    assert.equal(config.controllers.blue, 'bot');
    assert.equal(config.controllers.green, 'human');
  });

  it('supports per-player Human/Bot assignment', () => {
    const config = buildMatchConfig({
      matchType: 'mixed',
      playerCount: 4,
      controllers: {
        red: 'human',
        blue: 'bot',
        green: 'bot',
        yellow: 'human'
      }
    });

    assert.equal(config.controllers.red, 'human');
    assert.equal(config.controllers.blue, 'bot');
    assert.equal(config.controllers.green, 'bot');
    assert.equal(config.controllers.yellow, 'human');
  });

  it('marks inactive colors as inactive', () => {
    const config = buildMatchConfig({
      matchType: 'mixed',
      playerCount: 2,
      controllers: {
        green: 'bot',
        yellow: 'bot'
      }
    });

    assert.equal(config.controllers.red, 'human');
    assert.equal(config.controllers.blue, 'bot');
    assert.equal(config.controllers.green, 'inactive');
    assert.equal(config.controllers.yellow, 'inactive');
  });

  it('normalizes per-bot difficulty and personality selection', () => {
    const config = buildMatchConfig({
      matchType: 'mixed',
      playerCount: 2,
      controllers: {
        red: 'human',
        blue: 'bot'
      },
      botProfiles: {
        blue: {
          difficulty: 'smart',
          personality: 'defensive'
        }
      }
    });

    assert.deepEqual(config.botProfiles.blue, {
      difficulty: 'smart',
      personality: 'defensive'
    });
  });

  it('builds Quick Play defaults', () => {
    const quickPlay = createQuickPlayOptions();

    assert.equal(quickPlay.matchType, 'mixed');
    assert.equal(quickPlay.playerCount, 4);
    assert.equal(quickPlay.controllers.red, 'human');
    assert.equal(quickPlay.controllers.blue, 'bot');
    assert.equal(quickPlay.controllers.green, 'bot');
    assert.equal(quickPlay.controllers.yellow, 'bot');
    assert.equal(quickPlay.botProfiles.blue.difficulty, 'medium');
    assert.equal(quickPlay.botProfiles.blue.personality, 'balanced');
  });

  it('keeps local multiplayer all human', () => {
    const config = buildMatchConfig({
      matchType: 'local',
      playerCount: 4,
      controllers: {
        blue: 'bot'
      }
    });

    assert.equal(config.controllers.red, 'human');
    assert.equal(config.controllers.blue, 'human');
    assert.equal(config.controllers.green, 'human');
    assert.equal(config.controllers.yellow, 'human');
  });

  it('keeps online private rooms human-controlled', () => {
    const config = buildMatchConfig({
      matchType: 'online',
      playerCount: 3,
      controllers: {
        blue: 'bot'
      }
    });

    assert.equal(config.matchType, 'online');
    assert.deepEqual(config.activePlayers, ['red', 'blue', 'green']);
    assert.equal(config.controllers.red, 'human');
    assert.equal(config.controllers.blue, 'human');
    assert.equal(config.controllers.green, 'human');
    assert.equal(config.controllers.yellow, 'inactive');
  });

  it('keeps public matchmaking human-controlled', () => {
    const config = buildMatchConfig({
      matchType: 'public',
      playerCount: 4,
      controllers: {
        blue: 'bot'
      }
    });

    assert.equal(config.matchType, 'public');
    assert.deepEqual(config.activePlayers, ['red', 'blue', 'green', 'yellow']);
    assert.equal(config.controllers.red, 'human');
    assert.equal(config.controllers.blue, 'human');
    assert.equal(config.controllers.green, 'human');
    assert.equal(config.controllers.yellow, 'human');
  });

  it('formats and limits local event log entries', () => {
    let log = [];
    for (let index = 0; index < 14; index += 1) {
      log = pushEventLog(log, `Move ${index}`, 'neutral', index * 1000, 12);
    }

    assert.equal(log.length, 12);
    assert.equal(log[0].message, 'Move 13');
    assert.equal(log[0].time, '0:13');
    assert.equal(formatDuration(62_000), '1:02');
  });

  it('normalizes volume preference', () => {
    assert.equal(normalizeOptions({ volume: 3 }).volume, 1);
    assert.equal(normalizeOptions({ volume: -1 }).volume, 0);
  });

  it('normalizes launch settings preferences', () => {
    const defaults = normalizeOptions({ graphicsQuality: 'ultra', reducedMotion: 'yes' });
    const low = normalizeOptions({ graphicsQuality: 'low', reducedMotion: true });

    assert.equal(defaults.graphicsQuality, 'auto');
    assert.equal(defaults.reducedMotion, false);
    assert.equal(low.graphicsQuality, 'low');
    assert.equal(low.reducedMotion, true);
  });
});
