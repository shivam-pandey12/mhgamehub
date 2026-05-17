import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  analyzeMove,
  canCapture,
  chooseBotMove,
  evaluateDanger,
  getLegalBotMoves
} from '../ai/bot.js';
import { FINAL_STEP } from './constants.js';
import { LudoGame } from './rules.js';

function fixedRng(value = 0.42) {
  return () => value;
}

describe('3D Ludo Royale bot AI', () => {
  it('selects a legal move only', () => {
    const game = new LudoGame(2);
    const roll = game.rollDice(6);
    const choice = chooseBotMove(game.snapshot(), {
      playerId: 'red',
      difficulty: 'medium',
      rng: fixedRng()
    });

    assert.ok(roll.legalMoves.some((move) => move.tokenId === choice.tokenId));
  });

  it('Easy bot can choose from available moves', () => {
    const game = new LudoGame(2);
    game.rollDice(6);
    const state = game.snapshot();
    const choice = chooseBotMove(state, {
      playerId: 'red',
      difficulty: 'easy',
      rng: fixedRng(0.1)
    });

    assert.ok(choice);
    assert.ok(getLegalBotMoves(state, 'red').some((move) => move.tokenId === choice.tokenId));
  });

  it('Medium bot prefers capture over random movement', () => {
    const game = new LudoGame(2);
    game.setTokenForTest('red', 0, { state: 'track', steps: 0 });
    game.setTokenForTest('red', 1, { state: 'track', steps: 10 });
    game.setTokenForTest('blue', 0, { state: 'track', steps: 27 });
    game.rollDice(1);

    const choice = chooseBotMove(game.snapshot(), {
      playerId: 'red',
      difficulty: 'medium',
      rng: fixedRng()
    });

    assert.equal(choice.tokenId, 'red-0');
    assert.equal(choice.reason, 'capture-opponent');
  });

  it('Smart bot prefers finish move when available', () => {
    const game = new LudoGame(2);
    game.setTokenForTest('red', 0, { state: 'home-lane', steps: FINAL_STEP - 1 });
    game.setTokenForTest('red', 1, { state: 'track', steps: 10 });
    game.rollDice(1);

    const choice = chooseBotMove(game.snapshot(), {
      playerId: 'red',
      difficulty: 'smart',
      rng: fixedRng()
    });

    assert.equal(choice.tokenId, 'red-0');
    assert.equal(choice.reason, 'finish-token');
  });

  it('Smart bot avoids dangerous non-safe cell when safer move exists', () => {
    const game = new LudoGame(2);
    game.setTokenForTest('red', 0, { state: 'track', steps: 4 });
    game.setTokenForTest('red', 1, { state: 'track', steps: 7 });
    game.setTokenForTest('blue', 0, { state: 'track', steps: 27 });
    game.rollDice(1);

    const state = game.snapshot();
    const dangerMove = state.availableMoves.find((move) => move.tokenId === 'red-0');
    const danger = analyzeMove(state, dangerMove);
    const choice = chooseBotMove(state, {
      playerId: 'red',
      difficulty: 'smart',
      rng: fixedRng()
    });

    assert.equal(danger.isDangerous, true);
    assert.equal(choice.tokenId, 'red-1');
    assert.ok(['land-safe', 'escape-danger'].includes(choice.reason));
  });

  it('Bot unlocks token on 6 when useful', () => {
    const game = new LudoGame(2);
    game.setTokenForTest('red', 1, { state: 'track', steps: 10 });
    game.rollDice(6);

    const choice = chooseBotMove(game.snapshot(), {
      playerId: 'red',
      difficulty: 'smart',
      rng: fixedRng()
    });

    assert.equal(choice.tokenId, 'red-0');
    assert.equal(choice.reason, 'unlock-token');
  });

  it('Bot handles no legal moves', () => {
    const game = new LudoGame(2);
    game.rollDice(3);

    const choice = chooseBotMove(game.snapshot(), {
      playerId: 'red',
      difficulty: 'medium',
      rng: fixedRng()
    });

    assert.equal(choice, null);
  });

  it('Bot does not move opponent tokens', () => {
    const game = new LudoGame(2);
    game.rollDice(6);

    const choice = chooseBotMove(game.snapshot(), {
      playerId: 'red',
      difficulty: 'medium',
      rng: fixedRng()
    });

    assert.match(choice.tokenId, /^red-/);
  });

  it('Bot does not move finished tokens', () => {
    const game = new LudoGame(2);
    game.setTokenForTest('red', 0, { state: 'finished', steps: FINAL_STEP });
    game.setTokenForTest('red', 1, { state: 'track', steps: 10 });
    game.rollDice(2);

    const choice = chooseBotMove(game.snapshot(), {
      playerId: 'red',
      difficulty: 'medium',
      rng: fixedRng()
    });

    assert.notEqual(choice.tokenId, 'red-0');
  });

  it('Bot exact finish logic works', () => {
    const game = new LudoGame(2);
    game.setTokenForTest('red', 0, { state: 'home-lane', steps: FINAL_STEP - 1 });
    assert.equal(game.getLegalMoves('red', 2).length, 0);

    game.rollDice(1);
    const choice = chooseBotMove(game.snapshot(), {
      playerId: 'red',
      difficulty: 'smart',
      rng: fixedRng()
    });

    assert.equal(choice.tokenId, 'red-0');
  });

  it('Bot capture respects safe cells', () => {
    const game = new LudoGame(2);
    game.setTokenForTest('red', 0, { state: 'track', steps: 7 });
    game.setTokenForTest('blue', 0, { state: 'track', steps: 34 });
    game.rollDice(1);
    const move = game.snapshot().availableMoves.find((candidate) => candidate.tokenId === 'red-0');

    assert.equal(canCapture(game.snapshot(), move), false);
  });

  it('Bot decision does not mutate original game state', () => {
    const game = new LudoGame(2);
    game.setTokenForTest('red', 0, { state: 'track', steps: 0 });
    game.setTokenForTest('blue', 0, { state: 'track', steps: 27 });
    game.rollDice(1);
    const state = game.snapshot();
    const before = JSON.stringify(state);

    chooseBotMove(state, {
      playerId: 'red',
      difficulty: 'smart',
      rng: fixedRng()
    });

    assert.equal(JSON.stringify(state), before);
  });

  it('Bot works in 2-player mode', () => {
    const game = new LudoGame(2);
    game.rollDice(6);
    const choice = chooseBotMove(game.snapshot(), {
      playerId: 'red',
      difficulty: 'medium',
      rng: fixedRng()
    });

    assert.ok(choice?.tokenId);
  });

  it('Bot works in 3-player mode', () => {
    const game = new LudoGame(3);
    game.rollDice(6);
    const choice = chooseBotMove(game.snapshot(), {
      playerId: 'red',
      difficulty: 'medium',
      rng: fixedRng()
    });

    assert.ok(choice?.tokenId);
  });

  it('Bot works in 4-player mode', () => {
    const game = new LudoGame(4);
    game.rollDice(6);
    const choice = chooseBotMove(game.snapshot(), {
      playerId: 'red',
      difficulty: 'medium',
      rng: fixedRng()
    });

    assert.ok(choice?.tokenId);
  });

  it('Danger evaluation ignores safe cells and detects active threats', () => {
    const game = new LudoGame(2);
    game.setTokenForTest('blue', 0, { state: 'track', steps: 27 });
    const state = game.snapshot();

    assert.equal(evaluateDanger(state, 8, 'red').dangerous, false);
    assert.equal(evaluateDanger(state, 5, 'red').dangerous, true);
  });

  it('Bot personality influences scoring without mutating state', () => {
    const game = new LudoGame(2);
    game.setTokenForTest('red', 0, { state: 'track', steps: 0 });
    game.setTokenForTest('blue', 0, { state: 'track', steps: 27 });
    game.rollDice(1);
    const state = game.snapshot();
    const before = JSON.stringify(state);

    const aggressive = chooseBotMove(state, {
      playerId: 'red',
      difficulty: 'smart',
      personality: 'aggressive',
      rng: fixedRng()
    });
    const defensive = chooseBotMove(state, {
      playerId: 'red',
      difficulty: 'smart',
      personality: 'defensive',
      rng: fixedRng()
    });

    assert.equal(aggressive.reason, 'capture-opponent');
    assert.equal(defensive.reason, 'capture-opponent');
    assert.ok(aggressive.score > defensive.score);
    assert.equal(JSON.stringify(state), before);
  });

  it('Smart jitter does not override obvious finish move', () => {
    const game = new LudoGame(2);
    game.setTokenForTest('red', 0, { state: 'home-lane', steps: FINAL_STEP - 1 });
    game.setTokenForTest('red', 1, { state: 'track', steps: 0 });
    game.setTokenForTest('blue', 0, { state: 'track', steps: 27 });
    game.rollDice(1);

    const lowJitter = chooseBotMove(game.snapshot(), {
      playerId: 'red',
      difficulty: 'smart',
      personality: 'aggressive',
      rng: fixedRng(0)
    });
    const highJitter = chooseBotMove(game.snapshot(), {
      playerId: 'red',
      difficulty: 'smart',
      personality: 'aggressive',
      rng: fixedRng(1)
    });

    assert.equal(lowJitter.tokenId, 'red-0');
    assert.equal(highJitter.tokenId, 'red-0');
  });
});
