// @ts-check

import { TEAM_IDS } from "../config/constants.js";

/**
 * @param {import("../types/models").AppState} state
 */
export function getLocalPlayer(state) {
  return state.room?.players.find((player) => player.id === state.session.localPlayerId) ?? null;
}

/**
 * @param {import("../types/models").AppState} state
 */
export function getCurrentInnings(state) {
  if (!state.match) {
    return null;
  }

  return state.match.innings[state.match.currentInningsIndex] ?? null;
}

/**
 * @param {import("../types/models").AppState} state
 */
export function getTeamMap(state) {
  if (!state.room) {
    return null;
  }

  return state.room.teams;
}

/**
 * @param {import("../types/models").AppState} state
 */
export function getLocalTeamId(state) {
  const room = state.room;
  if (!room || !state.session.localPlayerId) {
    return null;
  }

  const alphaHasLocal = room.teams.alpha?.playerIds.includes(state.session.localPlayerId);
  const betaHasLocal = room.teams.beta?.playerIds.includes(state.session.localPlayerId);

  if (alphaHasLocal) {
    return TEAM_IDS.ALPHA;
  }

  if (betaHasLocal) {
    return TEAM_IDS.BETA;
  }

  return null;
}

/**
 * @param {import("../types/models").AppState} state
 */
export function getLocalTeam(state) {
  const teamId = getLocalTeamId(state);
  if (!teamId || !state.room) {
    return null;
  }

  return state.room.teams[teamId];
}
