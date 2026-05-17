// @ts-check

import { MOCK_DELAYS, PLAYER_NAME_POOL, TEAM_NAMES } from "../config/constants.js";
import { getMostUsedNumber, getNumberTier, getRecentPicks } from "../engine/mindGame.js";
import { getDefaultNumberSet } from "../engine/numberSets.js";
import { randomInt, sample, shuffle } from "../utils/helpers.js";
import { createId } from "../utils/id.js";

/**
 * @param {string[]} usedNames
 * @returns {string}
 */
export function createMockName(usedNames) {
  const available = PLAYER_NAME_POOL.filter((name) => !usedNames.includes(name));
  return available[0] ?? `Player ${usedNames.length + 1}`;
}

/**
 * @param {number} index
 * @param {string[]} usedNames
 * @returns {import("../types/models").Player}
 */
export function createMockPlayer(index, usedNames) {
  const name = createMockName(usedNames);
  usedNames.push(name);

  return {
    id: createId(`mock-${index + 1}`),
    name,
    isHost: false,
    isLocal: false,
    isMock: true,
    role: "player",
    status: "joining",
    avatarSeed: `${name.toLowerCase()}-${index}`,
    connectionState: {
      status: "connected",
      lastSyncAt: Date.now(),
      latencyMs: randomInt(26, 72),
      note: "Mock network",
    },
  };
}

/**
 * @param {number} count
 * @param {string} localName
 * @returns {import("../types/models").Player[]}
 */
export function createRoomRoster(count, localName) {
  const usedNames = [localName];
  return Array.from({ length: count }, (_, index) => createMockPlayer(index, usedNames));
}

export function createTeamNames() {
  const [alpha, beta] = shuffle(TEAM_NAMES).slice(0, 2);
  return { alpha, beta };
}

/**
 * @returns {number}
 */
export function createJoinDelay() {
  return randomInt(MOCK_DELAYS.PLAYER_JOIN_MIN, MOCK_DELAYS.PLAYER_JOIN_MAX);
}

/**
 * @returns {number}
 */
export function createAiDelay() {
  return randomInt(MOCK_DELAYS.AI_PICK_MIN, MOCK_DELAYS.AI_PICK_MAX);
}

export const chooseAiDelay = createAiDelay;

/**
 * @param {{ value: number; weight: number }[]} weightedNumbers
 * @returns {number}
 */
function sampleWeighted(weightedNumbers) {
  const safe = weightedNumbers.filter((entry) => entry.weight > 0);
  const totalWeight = safe.reduce((sum, entry) => sum + entry.weight, 0);
  let cursor = Math.random() * totalWeight;

  for (const entry of safe) {
    cursor -= entry.weight;
    if (cursor <= 0) {
      return entry.value;
    }
  }

  return safe[safe.length - 1]?.value ?? weightedNumbers[0]?.value ?? 1;
}

/**
 * @param {number[]} allowedNumbers
 * @param {number[]} targetNumbers
 * @param {number} strength
 * @returns {number}
 */
function sampleTowardTargets(allowedNumbers, targetNumbers, strength) {
  const targetSet = new Set(targetNumbers.filter((value) => allowedNumbers.includes(value)));
  return sampleWeighted(
    allowedNumbers.map((value) => ({
      value,
      weight: targetSet.has(value) ? strength : 1,
    })),
  );
}

/**
 * @param {import("../types/models").Match} match
 * @param {"batting" | "bowling"} side
 * @param {"beginner" | "medium" | "hard"} [difficulty]
 * @returns {number}
 */
export function chooseAiNumber(match, side, difficulty = /** @type {any} */ (match.settings.aiDifficulty) || "medium") {
  const innings = match.innings[match.currentInningsIndex];
  const targetPressure = innings.scoreboard.target ? innings.scoreboard.requiredRuns ?? 0 : 0;
  const allowedNumbers = Array.isArray(match.settings.allowedNumbers) && match.settings.allowedNumbers.length
    ? match.settings.allowedNumbers
    : getDefaultNumberSet().allowedNumbers;
  const sortedNumbers = [...allowedNumbers].sort((left, right) => left - right);
  const lowerHalf = sortedNumbers.slice(0, Math.max(1, Math.ceil(sortedNumbers.length / 2)));
  const upperHalf = sortedNumbers.slice(Math.max(0, Math.floor(sortedNumbers.length / 2)));
  const normalizedDifficulty = difficulty === "beginner" || difficulty === "hard" ? difficulty : "medium";
  const recentBatterPicks = getRecentPicks(match.ballEvents, "batting", 5);
  const recentBowlerPicks = getRecentPicks(match.ballEvents, "bowling", 5);
  const favoriteBatter = getMostUsedNumber(recentBatterPicks);

  if (normalizedDifficulty === "beginner") {
    return sample(sortedNumbers);
  }

  if (side === "bowling") {
    const repeatedBatterPick =
      recentBatterPicks.length >= 2 &&
      recentBatterPicks[recentBatterPicks.length - 1] === recentBatterPicks[recentBatterPicks.length - 2]
        ? recentBatterPicks[recentBatterPicks.length - 1]
        : null;
    const targets = [
      repeatedBatterPick,
      favoriteBatter && favoriteBatter.count >= 2 ? favoriteBatter.number : null,
      innings.scoreboard.ballsLeft <= 6 ? sample(upperHalf) : null,
    ].filter((value) => value != null);
    const reactionChance = normalizedDifficulty === "hard" ? 0.5 : 0.3;

    if (targets.length && Math.random() < reactionChance) {
      return sampleTowardTargets(sortedNumbers, /** @type {number[]} */ (targets), normalizedDifficulty === "hard" ? 5 : 3);
    }

    return sample(sortedNumbers);
  }

  const lastAiBattingPick = recentBatterPicks[recentBatterPicks.length - 1] ?? null;
  const pressureChoice = targetPressure > Math.max(12, sortedNumbers[sortedNumbers.length - 1] ?? 6);
  const stableChoice = !innings.scoreboard.target || targetPressure <= Math.max(6, sortedNumbers[Math.floor(sortedNumbers.length / 2)] ?? 3);

  if (normalizedDifficulty === "medium") {
    if (pressureChoice && Math.random() < 0.45) {
      return sample(upperHalf);
    }

    if (stableChoice && Math.random() < 0.35) {
      return sample([...lowerHalf, sortedNumbers[Math.floor(sortedNumbers.length / 2)] ?? lowerHalf[0]]);
    }

    return sample(sortedNumbers);
  }

  return sampleWeighted(
    sortedNumbers.map((value) => {
      const tier = getNumberTier(value, sortedNumbers);
      let weight = 1;

      if (value === lastAiBattingPick) {
        weight *= 0.45;
      }

      if (recentBowlerPicks.includes(value)) {
        weight *= 0.85;
      }

      if (pressureChoice && (tier === "high" || tier === "highest")) {
        weight += 3;
      } else if (stableChoice && (tier === "low" || tier === "mid")) {
        weight += 1.6;
      } else if (tier === "highest") {
        weight += 0.7;
      }

      return { value, weight };
    }),
  );
}

/**
 * @param {import("../types/models").Match} match
 * @returns {"bat" | "bowl"}
 */
export function chooseAiTossDecision(match) {
  return match.settings.overs <= 2 ? "bowl" : sample(["bat", "bowl"]);
}

/**
 * @param {import("../types/models").Match} match
 * @param {string} teamId
 * @returns {string | null}
 */
export function chooseAiBowler(match, teamId) {
  const team = teamId === "alpha" ? match.teams.alpha : match.teams.beta;
  const innings = match.innings[match.currentInningsIndex];
  const order = team.bowlingOrder.filter((playerId) => playerId !== innings.currentBowlerId);
  return order[0] ?? team.bowlingOrder[0] ?? null;
}

/**
 * @param {import("../types/models").Room} room
 * @param {string} teamId
 * @returns {string | null}
 */
export function chooseDraftPlayer(room, teamId) {
  const available = [...(room.draftState?.availablePlayerIds ?? [])];
  if (!available.length) {
    return null;
  }

  const team = room.teams[teamId];
  const playersById = Object.fromEntries(room.players.map((player) => [player.id, player]));
  const sorted = available.sort((left, right) => {
    const leftName = playersById[left]?.name ?? left;
    const rightName = playersById[right]?.name ?? right;
    return leftName.localeCompare(rightName);
  });

  return teamId === "alpha" ? sorted[0] : sorted[sorted.length - 1];
}
