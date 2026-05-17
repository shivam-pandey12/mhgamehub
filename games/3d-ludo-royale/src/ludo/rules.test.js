import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { LudoGame } from './rules.js';

describe('3D Ludo Royale rules engine', () => {
  it('creates 2, 3, and 4 player active sets', () => {
    assert.deepEqual(new LudoGame(2).state.activePlayers, ['red', 'blue']);
    assert.deepEqual(new LudoGame(3).state.activePlayers, ['red', 'blue', 'green']);
    assert.deepEqual(new LudoGame(4).state.activePlayers, ['red', 'blue', 'green', 'yellow']);
  });

  it('unlocks base tokens only with a six', () => {
    const game = new LudoGame(2);
    assert.equal(game.rollDice(5).legalMoves.length, 0);
    assert.equal(game.state.currentPlayer, 'blue');

    game.restart(2);
    const roll = game.rollDice(6);
    assert.equal(roll.legalMoves.length, 4);
    assert.equal(roll.legalMoves[0].fromState, 'base');
  });

  it('rejects token movement before rolling dice', () => {
    const game = new LudoGame(2);
    const result = game.moveToken('red-0');
    assert.equal(result.ok, false);
    assert.match(result.message, /Roll the dice/);
  });

  it('moves an unlocked token normally', () => {
    const game = new LudoGame(2);
    game.setTokenForTest('red', 0, { state: 'track', steps: 0 });

    game.rollDice(4);
    const result = game.moveToken('red-0');

    assert.equal(result.ok, true);
    assert.equal(game.state.tokens.red[0].steps, 4);
    assert.equal(game.state.tokens.red[0].state, 'track');
    assert.equal(game.state.currentPlayer, 'blue');
  });

  it('grants another turn after rolling six', () => {
    const game = new LudoGame(2);
    game.rollDice(6);
    const result = game.moveToken('red-0');

    assert.equal(result.extraTurn, true);
    assert.equal(game.state.currentPlayer, 'red');
    assert.equal(game.state.phase, 'awaiting-roll');
  });

  it('passes turn automatically when no legal move exists', () => {
    const game = new LudoGame(2);
    const result = game.rollDice(3);

    assert.equal(result.autoPass, true);
    assert.equal(game.state.currentPlayer, 'blue');
    assert.equal(game.state.phase, 'awaiting-roll');
  });

  it('keeps the same player after a no-move six', () => {
    const game = new LudoGame(2);
    for (let index = 0; index < 4; index += 1) {
      game.setTokenForTest('red', index, { state: 'finished', steps: 57 });
    }

    const result = game.rollDice(6);
    assert.equal(result.keptTurn, true);
    assert.equal(game.state.currentPlayer, 'red');
  });

  it('captures opponent tokens on non-safe common cells', () => {
    const game = new LudoGame(2);
    game.setTokenForTest('red', 0, { state: 'track', steps: 0 });
    game.setTokenForTest('blue', 0, { state: 'track', steps: 27 });

    game.rollDice(1);
    const result = game.moveToken('red-0');

    assert.equal(result.captures.length, 1);
    assert.equal(result.captures[0].tokenId, 'blue-0');
    assert.equal(game.state.tokens.blue[0].state, 'base');
    assert.equal(game.state.tokens.blue[0].steps, -1);
  });

  it('does not capture on safe cells', () => {
    const game = new LudoGame(2);
    game.setTokenForTest('red', 0, { state: 'track', steps: 7 });
    game.setTokenForTest('blue', 0, { state: 'track', steps: 34 });

    game.rollDice(1);
    const result = game.moveToken('red-0');

    assert.equal(result.captures.length, 0);
    assert.equal(game.state.tokens.blue[0].state, 'track');
  });

  it('enters home lane after completing the common route', () => {
    const game = new LudoGame(2);
    game.setTokenForTest('red', 0, { state: 'track', steps: 50 });

    game.rollDice(3);
    game.moveToken('red-0');

    assert.equal(game.state.tokens.red[0].state, 'home-lane');
    assert.equal(game.state.tokens.red[0].steps, 53);
  });

  it('requires exact count to finish and rejects over-finish moves', () => {
    const game = new LudoGame(2);
    game.setTokenForTest('red', 0, { state: 'home-lane', steps: 56 });

    assert.equal(game.getLegalMoves('red', 2).length, 0);
    assert.equal(game.getLegalMoves('red', 1).length, 1);

    game.rollDice(1);
    game.moveToken('red-0');
    assert.equal(game.state.tokens.red[0].state, 'finished');
  });

  it('detects winner when all four tokens reach home', () => {
    const game = new LudoGame(2);
    for (let index = 0; index < 3; index += 1) {
      game.setTokenForTest('red', index, { state: 'finished', steps: 57 });
    }
    game.setTokenForTest('red', 3, { state: 'home-lane', steps: 56 });

    game.rollDice(1);
    const result = game.moveToken('red-3');

    assert.equal(result.winner, 'red');
    assert.equal(game.state.winner, 'red');
    assert.equal(game.state.phase, 'game-over');
  });

  it('restarts to a clean selected player count', () => {
    const game = new LudoGame(4);
    game.rollDice(6);
    game.moveToken('red-0');
    game.restart(3);

    assert.deepEqual(game.state.activePlayers, ['red', 'blue', 'green']);
    assert.equal(game.state.tokens.red[0].state, 'base');
    assert.equal(game.state.winner, null);
  });
});
