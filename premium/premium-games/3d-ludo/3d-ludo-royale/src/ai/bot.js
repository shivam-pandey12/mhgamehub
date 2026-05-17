import { FINAL_STEP, LAST_TRACK_STEP, PLAYER_IDS } from '../ludo/constants.js';
import { getCommonIndex, SAFE_COMMON_INDICES } from '../ludo/layout.js';

const COMMON_ROUTE_LENGTH = 52;

export const BOT_DIFFICULTIES = Object.freeze(['easy', 'medium', 'smart']);
export const BOT_PERSONALITIES = Object.freeze(['balanced', 'aggressive', 'defensive', 'finisher']);

const PERSONALITY_WEIGHTS = Object.freeze({
  balanced: {
    finish: 1,
    capture: 1,
    home: 1,
    unlock: 1,
    safe: 1,
    escape: 1,
    danger: 1,
    progress: 1
  },
  aggressive: {
    finish: 1,
    capture: 1.42,
    home: 0.9,
    unlock: 1.08,
    safe: 0.72,
    escape: 0.78,
    danger: 0.72,
    progress: 1.12
  },
  defensive: {
    finish: 1,
    capture: 0.86,
    home: 1.05,
    unlock: 0.92,
    safe: 1.55,
    escape: 1.62,
    danger: 1.58,
    progress: 0.92
  },
  finisher: {
    finish: 1.36,
    capture: 0.92,
    home: 1.46,
    unlock: 0.82,
    safe: 1.04,
    escape: 0.94,
    danger: 1.05,
    progress: 1.18
  }
});

function safeRng(rng) {
  return typeof rng === 'function' ? rng : Math.random;
}

function getToken(state, tokenId) {
  for (const playerId of PLAYER_IDS) {
    const token = state.tokens[playerId]?.find((candidate) => candidate.id === tokenId);
    if (token) {
      return token;
    }
  }
  return null;
}

function normalizeDifficulty(difficulty) {
  return BOT_DIFFICULTIES.includes(difficulty) ? difficulty : 'medium';
}

function normalizePersonality(personality) {
  return BOT_PERSONALITIES.includes(personality) ? personality : 'balanced';
}

export function isSafeCommonIndex(commonIndex) {
  return SAFE_COMMON_INDICES.has(commonIndex);
}

export function getTokenDistanceToFinish(token) {
  if (!token || token.state === 'base') {
    return FINAL_STEP + 1;
  }
  if (token.state === 'finished') {
    return 0;
  }
  return Math.max(0, FINAL_STEP - token.steps);
}

export function getLegalBotMoves(state, playerId = state.currentPlayer) {
  if (!state || !state.activePlayers?.includes(playerId)) {
    return [];
  }
  return (state.availableMoves || []).filter((move) => move.playerId === playerId);
}

export function evaluateDanger(state, commonIndex, playerId) {
  if (!state || commonIndex == null || isSafeCommonIndex(commonIndex)) {
    return {
      dangerous: false,
      threats: []
    };
  }

  const threats = [];
  for (const opponentId of state.activePlayers || []) {
    if (opponentId === playerId) {
      continue;
    }

    for (const token of state.tokens[opponentId] || []) {
      if (token.state !== 'track') {
        continue;
      }

      const opponentIndex = getCommonIndex(opponentId, token.steps);
      const distance = (commonIndex - opponentIndex + COMMON_ROUTE_LENGTH) % COMMON_ROUTE_LENGTH;
      if (distance >= 1 && distance <= 6 && token.steps + distance <= 51) {
        threats.push({
          playerId: opponentId,
          tokenId: token.id,
          diceNeeded: distance
        });
      }
    }
  }

  return {
    dangerous: threats.length > 0,
    threats
  };
}

export function analyzeMove(state, move) {
  const token = getToken(state, move.tokenId);
  if (!token || token.playerId !== move.playerId || token.state === 'finished') {
    return null;
  }

  const diceValue = move.diceValue;
  const fromSteps = token.steps;
  const toSteps = token.state === 'base' ? 0 : token.steps + diceValue;
  const landingState = toSteps >= FINAL_STEP
    ? 'finished'
    : toSteps > LAST_TRACK_STEP
      ? 'home-lane'
      : 'track';
  const commonIndex = landingState === 'track'
    ? getCommonIndex(move.playerId, toSteps)
    : null;
  const isSafe = commonIndex != null && isSafeCommonIndex(commonIndex);

  const captures = [];
  if (commonIndex != null && !isSafe) {
    for (const opponentId of state.activePlayers || []) {
      if (opponentId === move.playerId) {
        continue;
      }
      for (const opponentToken of state.tokens[opponentId] || []) {
        if (
          opponentToken.state === 'track'
          && getCommonIndex(opponentId, opponentToken.steps) === commonIndex
        ) {
          captures.push({
            playerId: opponentId,
            tokenId: opponentToken.id
          });
        }
      }
    }
  }

  const currentCommonIndex = token.state === 'track'
    ? getCommonIndex(move.playerId, token.steps)
    : null;
  const currentDanger = evaluateDanger(state, currentCommonIndex, move.playerId);
  const landingDanger = evaluateDanger(state, commonIndex, move.playerId);

  return {
    move,
    token,
    diceValue,
    fromState: token.state,
    fromSteps,
    toSteps,
    landingState,
    commonIndex,
    isSafe,
    captures,
    canCapture: captures.length > 0,
    canFinish: landingState === 'finished',
    canEnterHomeLane: landingState === 'home-lane' && token.steps <= LAST_TRACK_STEP,
    unlocksFromBase: token.state === 'base' && diceValue === 6,
    distanceToFinish: Math.max(0, FINAL_STEP - toSteps),
    currentDanger,
    landingDanger,
    escapesDanger: currentDanger.dangerous && !landingDanger.dangerous,
    isDangerous: landingDanger.dangerous
  };
}

export function simulateMoveForScoring(state, move) {
  return analyzeMove(state, move);
}

export function canCapture(state, move) {
  return Boolean(analyzeMove(state, move)?.canCapture);
}

export function canFinish(state, move) {
  return Boolean(analyzeMove(state, move)?.canFinish);
}

export function canEnterHomeLane(state, move) {
  return Boolean(analyzeMove(state, move)?.canEnterHomeLane);
}

export function getOpponentThreats(state, commonIndex, playerId) {
  return evaluateDanger(state, commonIndex, playerId).threats;
}

function getPlayerContext(state, playerId) {
  const tokens = state.tokens[playerId] || [];
  return {
    baseCount: tokens.filter((token) => token.state === 'base').length,
    trackCount: tokens.filter((token) => token.state === 'track').length,
    homeLaneCount: tokens.filter((token) => token.state === 'home-lane').length,
    finishedCount: tokens.filter((token) => token.state === 'finished').length
  };
}

function getPrimaryReason(summary) {
  if (summary.canFinish) {
    return 'finish-token';
  }
  if (summary.canCapture) {
    return 'capture-opponent';
  }
  if (summary.canEnterHomeLane) {
    return 'enter-home-lane';
  }
  if (summary.unlocksFromBase) {
    return 'unlock-token';
  }
  if (summary.escapesDanger) {
    return 'escape-danger';
  }
  if (summary.isSafe) {
    return 'land-safe';
  }
  if (summary.fromState === 'home-lane') {
    return 'advance-home-lane';
  }
  return 'advance-token';
}

function scoreMove(state, summary, difficulty, personality, rng) {
  const context = getPlayerContext(state, summary.move.playerId);
  const weights = PERSONALITY_WEIGHTS[personality] || PERSONALITY_WEIGHTS.balanced;
  const progress = (Math.max(0, summary.diceValue) * 8 + Math.max(0, summary.toSteps) * 0.45) * weights.progress;
  let score = progress;

  if (difficulty === 'easy') {
    score += rng() * 70;
    if (summary.canFinish) score += 240 * weights.finish;
    if (summary.canCapture && rng() > 0.35) score += 110 * weights.capture;
    if (summary.unlocksFromBase && rng() > 0.2) score += 70 * weights.unlock;
    if (summary.isSafe) score += 35 * weights.safe;
    if (summary.isDangerous) score -= 25 * weights.danger;
    return score;
  }

  if (difficulty === 'medium') {
    if (summary.canFinish) score += 1200 * weights.finish;
    if (summary.canCapture) score += (460 + summary.captures.length * 60) * weights.capture;
    if (summary.canEnterHomeLane) score += 340 * weights.home;
    if (summary.unlocksFromBase) score += (context.trackCount < 2 ? 220 : 120) * weights.unlock;
    if (summary.isSafe) score += 145 * weights.safe;
    if (summary.escapesDanger) score += 140 * weights.escape;
    if (summary.fromState === 'home-lane') score += 180 * weights.home;
    if (summary.isDangerous && !summary.canCapture) score -= 210 * weights.danger;
    score += rng() * 8;
    return score;
  }

  if (summary.canFinish) score += 3200 * weights.finish;
  if (summary.canCapture) score += (960 + summary.captures.length * 140) * weights.capture;
  if (summary.canEnterHomeLane) score += 840 * weights.home;
  if (summary.unlocksFromBase) score += (context.trackCount < 2 ? 430 : 180) * weights.unlock;
  if (summary.isSafe) score += 280 * weights.safe;
  if (summary.escapesDanger) score += 360 * weights.escape;
  if (summary.fromState === 'home-lane') score += 440 * weights.home;
  if (summary.isDangerous && !summary.canCapture && !summary.canFinish && !summary.canEnterHomeLane) score -= 560 * weights.danger;
  if (summary.diceValue === 6 && !summary.unlocksFromBase && !summary.canCapture && !summary.canFinish) score -= 70;
  score += (rng() - 0.5) * 6;
  return score;
}

export function chooseBotMove(state, options = {}) {
  const playerId = options.playerId || state?.currentPlayer;
  const legalMoves = getLegalBotMoves(state, playerId);
  if (!legalMoves.length) {
    return null;
  }

  const rng = safeRng(options.rng);
  const difficulty = normalizeDifficulty(options.difficulty);
  const personality = normalizePersonality(options.personality);
  const scored = legalMoves
    .map((move) => analyzeMove(state, move))
    .filter(Boolean)
    .map((summary) => ({
      tokenId: summary.move.tokenId,
      move: summary.move,
      reason: getPrimaryReason(summary),
      score: scoreMove(state, summary, difficulty, personality, rng),
      personality,
      summary
    }))
    .sort((left, right) => right.score - left.score);

  return scored[0] || null;
}
