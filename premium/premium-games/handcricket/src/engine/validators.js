// @ts-check

import { BOWLING_MODES, MATCH_PHASE } from "../config/constants.js";
import { getDefaultNumberSet, isValidPick } from "./numberSets.js";

/**
 * @param {string[]} candidateOrder
 * @param {string[]} teamPlayers
 * @returns {boolean}
 */
export function isValidLineup(candidateOrder, teamPlayers) {
  return (
    candidateOrder.length === teamPlayers.length &&
    candidateOrder.every((id) => teamPlayers.includes(id)) &&
    new Set(candidateOrder).size === candidateOrder.length
  );
}

/**
 * @param {number} value
 * @param {number[]} [allowedNumbers]
 * @returns {boolean}
 */
export function isValidBallChoice(value, allowedNumbers = getDefaultNumberSet().allowedNumbers) {
  return isValidPick(value, allowedNumbers);
}

/**
 * @param {import("../types/models").Match} match
 * @param {string} teamId
 * @param {string} playerId
 * @returns {boolean}
 */
export function canSelectBowler(match, teamId, playerId) {
  if (match.phase !== MATCH_PHASE.LIVE) {
    return false;
  }

  const innings = match.innings[match.currentInningsIndex];
  const teamKey = innings.bowlingTeamId === "alpha" ? "alpha" : "beta";
  const bowlingTeam = match.teams[teamKey];

  if (innings.bowlingTeamId !== teamId || !bowlingTeam.playerIds.includes(playerId)) {
    return false;
  }

  if (innings.pendingChoices.batting || innings.pendingChoices.bowling) {
    return false;
  }

  if (match.settings.bowlingMode === BOWLING_MODES.LOCKED && innings.scoreboard.ballsInOver !== 0) {
    return false;
  }

  return true;
}

/**
 * @param {import("../types/models").Match} match
 * @param {string} teamId
 * @param {string[]} nextOrder
 * @returns {boolean}
 */
export function canReorderRemainingBatters(match, teamId, nextOrder) {
  if (match.phase !== MATCH_PHASE.LIVE) {
    return false;
  }

  const innings = match.innings[match.currentInningsIndex];

  if (innings.battingTeamId !== teamId) {
    return false;
  }

  const team = match.teams[teamId === "alpha" ? "alpha" : "beta"];
  const lockedIds = [innings.strikerId, innings.nonStrikerId, ...innings.dismissedIds].filter(Boolean);
  const unlocked = team.battingOrder.filter((id) => !lockedIds.includes(id));

  return (
    unlocked.length === nextOrder.length &&
    nextOrder.every((id) => unlocked.includes(id)) &&
    new Set(nextOrder).size === nextOrder.length
  );
}

/**
 * @param {import("../types/models").Match} match
 * @param {string} teamId
 * @param {string[]} nextOrder
 * @returns {boolean}
 */
export function canReorderBowlingOrder(match, teamId, nextOrder) {
  if (match.phase !== MATCH_PHASE.LIVE) {
    return false;
  }

  const innings = match.innings[match.currentInningsIndex];
  const team = match.teams[teamId === "alpha" ? "alpha" : "beta"];

  if (innings.bowlingTeamId !== teamId) {
    return false;
  }

  if (!isValidLineup(nextOrder, team.playerIds)) {
    return false;
  }

  if (innings.pendingChoices.batting || innings.pendingChoices.bowling) {
    return false;
  }

  if (match.settings.bowlingMode === BOWLING_MODES.LOCKED && innings.scoreboard.ballsInOver !== 0) {
    return false;
  }

  return true;
}
