import {
  FINAL_STEP,
  PLAYER_IDS,
  PLAYER_META,
  PLAYER_SETS,
  STATUS,
  TOKENS_PER_PLAYER
} from './constants.js';
import { getCellForSteps, getCommonIndex, SAFE_COMMON_INDICES } from './layout.js';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizePlayerCount(playerCount) {
  const numeric = Number(playerCount);
  return PLAYER_SETS[numeric] ? numeric : 2;
}

function createTokensForPlayer(playerId) {
  return Array.from({ length: TOKENS_PER_PLAYER }, (_, index) => ({
    id: `${playerId}-${index}`,
    playerId,
    index,
    state: 'base',
    steps: -1,
    capturedBy: null
  }));
}

export function createInitialState(playerCount = 2) {
  const normalizedCount = normalizePlayerCount(playerCount);
  const activePlayers = [...PLAYER_SETS[normalizedCount]];
  const tokens = Object.fromEntries(PLAYER_IDS.map((playerId) => [playerId, createTokensForPlayer(playerId)]));

  return {
    selectedPlayerCount: normalizedCount,
    activePlayers,
    currentPlayerIndex: 0,
    currentPlayer: activePlayers[0],
    phase: STATUS.AWAITING_ROLL,
    diceValue: null,
    lastDiceValue: null,
    diceRolled: false,
    availableMoves: [],
    tokens,
    capturedTokens: [],
    finishedCounts: Object.fromEntries(PLAYER_IDS.map((playerId) => [playerId, 0])),
    winner: null,
    turnHistory: [],
    lastEvent: {
      type: 'start',
      message: `${PLAYER_META[activePlayers[0]].label} player's turn. Roll the dice.`
    }
  };
}

export class LudoGame {
  constructor(playerCount = 2, rng = Math.random) {
    this.rng = rng;
    this.state = createInitialState(playerCount);
  }

  restart(playerCount = this.state.selectedPlayerCount) {
    this.state = createInitialState(playerCount);
    return this.snapshot();
  }

  snapshot() {
    return clone(this.state);
  }

  getToken(tokenId) {
    for (const playerTokens of Object.values(this.state.tokens)) {
      const token = playerTokens.find((candidate) => candidate.id === tokenId);
      if (token) {
        return token;
      }
    }

    return null;
  }

  setTokenForTest(playerId, index, patch) {
    Object.assign(this.state.tokens[playerId][index], patch);
    this.updateFinishedCounts();
  }

  rollRandom() {
    return Math.floor(this.rng() * 6) + 1;
  }

  rollDice(value = this.rollRandom()) {
    if (this.state.winner || this.state.phase === STATUS.GAME_OVER) {
      return this.invalid('The game is already finished.');
    }

    if (this.state.phase !== STATUS.AWAITING_ROLL) {
      return this.invalid('Dice already rolled. Select a token.');
    }

    const diceValue = Math.max(1, Math.min(6, Number(value) || 1));
    const playerId = this.state.currentPlayer;
    const availableMoves = this.getLegalMoves(playerId, diceValue);

    this.state.diceValue = diceValue;
    this.state.lastDiceValue = diceValue;
    this.state.diceRolled = true;
    this.state.availableMoves = availableMoves;
    this.state.turnHistory.push({
      type: 'roll',
      playerId,
      diceValue,
      legalMoveCount: availableMoves.length
    });

    if (availableMoves.length === 0) {
      const keptTurn = diceValue === 6;
      const message = keptTurn
        ? `${PLAYER_META[playerId].label} rolled 6 but has no valid move. Roll again.`
        : `${PLAYER_META[playerId].label} has no valid moves. Turn passes.`;

      this.state.availableMoves = [];
      this.state.diceValue = null;
      this.state.diceRolled = false;
      this.state.phase = STATUS.AWAITING_ROLL;
      if (!keptTurn) {
        this.advanceTurn();
      }

      this.state.lastEvent = {
        type: 'no-valid-moves',
        playerId,
        diceValue,
        keptTurn,
        message
      };

      return {
        ok: true,
        type: 'roll',
        diceValue,
        legalMoves: [],
        autoPass: !keptTurn,
        keptTurn,
        state: this.snapshot(),
        message
      };
    }

    this.state.phase = STATUS.AWAITING_TOKEN;
    this.state.lastEvent = {
      type: 'roll',
      playerId,
      diceValue,
      message: `${PLAYER_META[playerId].label} rolled ${diceValue}. Select a token.`
    };

    return {
      ok: true,
      type: 'roll',
      diceValue,
      legalMoves: clone(availableMoves),
      state: this.snapshot(),
      message: this.state.lastEvent.message
    };
  }

  getLegalMoves(playerId = this.state.currentPlayer, diceValue = this.state.diceValue) {
    if (!this.state.activePlayers.includes(playerId) || !diceValue) {
      return [];
    }

    return this.state.tokens[playerId]
      .filter((token) => this.canMoveToken(token, diceValue))
      .map((token) => ({
        tokenId: token.id,
        playerId,
        diceValue,
        fromState: token.state,
        fromSteps: token.steps,
        path: this.buildMovePath(token, diceValue)
      }));
  }

  canMoveToken(token, diceValue) {
    if (!token || token.state === 'finished') {
      return false;
    }

    if (token.state === 'base') {
      return diceValue === 6;
    }

    return token.steps + diceValue <= FINAL_STEP;
  }

  buildMovePath(token, diceValue) {
    if (token.state === 'base') {
      return [getCellForSteps(token.playerId, 0)];
    }

    return Array.from({ length: diceValue }, (_, index) => getCellForSteps(token.playerId, token.steps + index + 1));
  }

  moveToken(tokenId) {
    if (this.state.phase !== STATUS.AWAITING_TOKEN) {
      return this.invalid('Roll the dice before moving a token.');
    }

    const move = this.state.availableMoves.find((candidate) => candidate.tokenId === tokenId);
    if (!move) {
      return this.invalid('That token cannot move for this dice roll.', tokenId);
    }

    const token = this.getToken(tokenId);
    const playerId = token.playerId;
    const diceValue = this.state.diceValue;
    const startToken = clone(token);
    const path = this.buildMovePath(token, diceValue);

    if (token.state === 'base') {
      token.state = 'track';
      token.steps = 0;
      token.capturedBy = null;
    } else {
      token.steps += diceValue;
      token.state = token.steps >= FINAL_STEP
        ? 'finished'
        : token.steps > 51
          ? 'home-lane'
          : 'track';
    }

    const captures = this.resolveCaptures(token);
    this.updateFinishedCounts();

    const winner = this.state.tokens[playerId].every((candidate) => candidate.state === 'finished')
      ? playerId
      : null;

    const reachedHome = token.state === 'finished' && startToken.state !== 'finished';

    this.state.turnHistory.push({
      type: 'move',
      playerId,
      tokenId,
      diceValue,
      from: startToken,
      to: clone(token),
      captures: clone(captures),
      reachedHome
    });

    if (winner) {
      this.state.winner = winner;
      this.state.phase = STATUS.GAME_OVER;
      this.state.availableMoves = [];
      this.state.diceValue = null;
      this.state.diceRolled = false;
      this.state.lastEvent = {
        type: 'winner',
        playerId,
        tokenId,
        message: `${PLAYER_META[playerId].label} wins.`
      };
    } else {
      const extraTurn = diceValue === 6;
      this.state.availableMoves = [];
      this.state.diceValue = null;
      this.state.diceRolled = false;
      this.state.phase = STATUS.AWAITING_ROLL;

      if (!extraTurn) {
        this.advanceTurn();
      }

      const captureMessage = captures.length
        ? `${PLAYER_META[captures[0].playerId].label} token captured.`
        : '';
      const homeMessage = reachedHome ? `${PLAYER_META[playerId].label} reached home.` : '';
      const nextMessage = extraTurn
        ? `${PLAYER_META[playerId].label} rolled 6 and plays again.`
        : `${PLAYER_META[this.state.currentPlayer].label} player's turn.`;

      this.state.lastEvent = {
        type: 'move',
        playerId,
        tokenId,
        captures: clone(captures),
        reachedHome,
        extraTurn,
        message: [captureMessage, homeMessage, nextMessage].filter(Boolean).join(' ')
      };
    }

    return {
      ok: true,
      type: 'move',
      playerId,
      tokenId,
      diceValue,
      path: clone(path),
      captures: clone(captures),
      reachedHome,
      winner,
      extraTurn: !winner && diceValue === 6,
      state: this.snapshot(),
      message: this.state.lastEvent.message
    };
  }

  resolveCaptures(token) {
    if (token.state !== 'track') {
      return [];
    }

    const landingIndex = getCommonIndex(token.playerId, token.steps);
    if (SAFE_COMMON_INDICES.has(landingIndex)) {
      return [];
    }

    const captures = [];
    for (const opponentId of this.state.activePlayers) {
      if (opponentId === token.playerId) {
        continue;
      }

      for (const opponentToken of this.state.tokens[opponentId]) {
        if (opponentToken.state !== 'track') {
          continue;
        }

        if (getCommonIndex(opponentToken.playerId, opponentToken.steps) === landingIndex) {
          captures.push({
            tokenId: opponentToken.id,
            playerId: opponentId,
            previousSteps: opponentToken.steps,
            commonIndex: landingIndex
          });
          opponentToken.state = 'base';
          opponentToken.steps = -1;
          opponentToken.capturedBy = token.playerId;
          this.state.capturedTokens.push({
            tokenId: opponentToken.id,
            playerId: opponentId,
            capturedBy: token.playerId,
            turn: this.state.turnHistory.length,
            commonIndex: landingIndex
          });
        }
      }
    }

    return captures;
  }

  advanceTurn() {
    this.state.currentPlayerIndex = (this.state.currentPlayerIndex + 1) % this.state.activePlayers.length;
    this.state.currentPlayer = this.state.activePlayers[this.state.currentPlayerIndex];
  }

  updateFinishedCounts() {
    for (const playerId of PLAYER_IDS) {
      this.state.finishedCounts[playerId] = this.state.tokens[playerId]
        .filter((token) => token.state === 'finished')
        .length;
    }
  }

  invalid(message, tokenId = null) {
    this.state.lastEvent = {
      type: 'invalid',
      tokenId,
      message
    };

    return {
      ok: false,
      type: 'invalid',
      tokenId,
      state: this.snapshot(),
      message
    };
  }
}
