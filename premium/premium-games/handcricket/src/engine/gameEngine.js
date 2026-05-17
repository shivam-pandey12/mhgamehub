// @ts-check

import { MATCH_MODES, MATCH_PHASE, TEAM_IDS } from "../config/constants.js";
import { formatOvers } from "../utils/formatters.js";
import { clone } from "../utils/helpers.js";
import { createId } from "../utils/id.js";
import { getFinalMatchInsights } from "./mindGame.js";
import { getBallPresentation, resolveNumberSetSettings } from "./numberSets.js";
import { ballsLeftInInnings, isAllOut, isOdd, isWicket } from "./rules.js";
import { canReorderBowlingOrder, canReorderRemainingBatters, canSelectBowler, isValidBallChoice } from "./validators.js";

/**
 * Clone a room team into a match team and reset all player stats.
 *
 * @param {import("../types/models").Team} team
 * @returns {import("../types/models").Team}
 */
function cloneTeamForMatch(team) {
  const stats = Object.fromEntries(
    team.playerIds.map((playerId) => [
      playerId,
      {
        runs: 0,
        ballsFaced: 0,
        wicketsTaken: 0,
        ballsBowled: 0,
        dismissals: 0,
      },
    ]),
  );

  return {
    ...clone(team),
    currentBowlerId: null,
    stats,
  };
}

/**
 * @param {import("../types/models").Match["teams"]} teams
 * @param {string} teamId
 */
function getTeam(teams, teamId) {
  return teamId === TEAM_IDS.ALPHA ? teams.alpha : teams.beta;
}

/**
 * @param {import("../types/models").Match} match
 */
function getCurrentInnings(match) {
  return match.innings[match.currentInningsIndex];
}

/**
 * @param {import("../types/models").Innings} innings
 * @param {number[]} allowedNumbers
 * @returns {import("../types/models").Side[]}
 */
function getLockedSides(innings, allowedNumbers) {
  /** @type {import("../types/models").Side[]} */
  const lockedSides = [];

  if (isValidBallChoice(innings.pendingChoices.batting?.value ?? null, allowedNumbers)) {
    lockedSides.push("batting");
  }

  if (isValidBallChoice(innings.pendingChoices.bowling?.value ?? null, allowedNumbers)) {
    lockedSides.push("bowling");
  }

  return lockedSides;
}

/**
 * @param {Partial<import("../types/models").Match["revealState"]>} [patch]
 * @returns {import("../types/models").Match["revealState"]}
 */
function createRevealState(patch = {}) {
  return {
    status: "idle",
    waitingFor: null,
    lockedSides: [],
    revealAt: null,
    cycleId: 0,
    lastBall: null,
    ...patch,
  };
}

/**
 * Guard engine mutations so stale callbacks cannot resolve balls after the
 * innings has already paused or the match has already finished.
 *
 * @param {import("../types/models").Match} match
 * @returns {boolean}
 */
function isLiveBallContext(match) {
  return match.phase === MATCH_PHASE.LIVE && !getCurrentInnings(match).completed;
}

/**
 * Keep derived scoreboard fields aligned with the legal ball count.
 *
 * @param {import("../types/models").Scoreboard} scoreboard
 * @param {import("../types/models").RoomSettings} settings
 */
function syncScoreboard(scoreboard, settings) {
  scoreboard.overs = Math.floor(scoreboard.legalBalls / 6);
  scoreboard.ballsLeft = ballsLeftInInnings(scoreboard.legalBalls, settings.overs);

  if (scoreboard.target) {
    scoreboard.requiredRuns = Math.max(scoreboard.target - scoreboard.runs, 0);
  }
}

/**
 * Swap striker and non-striker when the mode supports two active batters.
 *
 * @param {import("../types/models").Innings} innings
 * @param {import("../types/models").RoomSettings} settings
 */
function swapStrikeInnings(innings, settings) {
  if (settings.matchMode !== MATCH_MODES.TWO_BATSMEN) {
    return;
  }

  if (!innings.strikerId || !innings.nonStrikerId) {
    return;
  }

  [innings.strikerId, innings.nonStrikerId] = [innings.nonStrikerId, innings.strikerId];
}

/**
 * Bring in the next batter from the batting order as striker.
 *
 * @param {import("../types/models").Innings} innings
 * @param {import("../types/models").Team} battingTeam
 * @returns {string | null}
 */
function bringNextBatsmanIn(innings, battingTeam) {
  const playerId = battingTeam.battingOrder[innings.nextBatterIndex] ?? null;

  if (!playerId) {
    // If only one batter remains, keep them on strike as a solo batter.
    if (innings.nonStrikerId) {
      innings.strikerId = innings.nonStrikerId;
      innings.nonStrikerId = null;
      return innings.strikerId;
    }

    innings.strikerId = null;
    return null;
  }

  innings.nextBatterIndex += 1;
  innings.strikerId = playerId;
  return playerId;
}

/**
 * Advance to the next configured bowler.
 *
 * @param {import("../types/models").Innings} innings
 * @param {import("../types/models").Team} bowlingTeam
 * @returns {string | null}
 */
function advanceBowler(innings, bowlingTeam) {
  const order = bowlingTeam.bowlingOrder;
  if (!order.length) {
    innings.currentBowlerId = null;
    bowlingTeam.currentBowlerId = null;
    return null;
  }

  const nextBowlerId = order[innings.nextBowlerIndex % order.length] ?? order[0];
  innings.currentBowlerId = nextBowlerId;
  bowlingTeam.currentBowlerId = nextBowlerId;
  innings.nextBowlerIndex = (innings.nextBowlerIndex + 1) % order.length;
  return nextBowlerId;
}

/**
 * Build the innings state for a team coming in to bat.
 *
 * @param {import("../types/models").Match["teams"]} teams
 * @param {string} battingTeamId
 * @param {string} bowlingTeamId
 * @param {import("../types/models").RoomSettings} settings
 * @param {number | null} target
 * @returns {import("../types/models").Innings}
 */
function createInnings(teams, battingTeamId, bowlingTeamId, settings, target) {
  const battingTeam = getTeam(teams, battingTeamId);
  const bowlingTeam = getTeam(teams, bowlingTeamId);
  const strikerId = battingTeam.battingOrder[0] ?? null;
  const nonStrikerId = settings.matchMode === MATCH_MODES.TWO_BATSMEN ? battingTeam.battingOrder[1] ?? null : null;
  const currentBowlerId = bowlingTeam.bowlingOrder[0] ?? null;

  bowlingTeam.currentBowlerId = currentBowlerId;

  const innings = {
    battingTeamId,
    bowlingTeamId,
    scoreboard: {
      runs: 0,
      wickets: 0,
      legalBalls: 0,
      overs: 0,
      ballsInOver: 0,
      target,
      requiredRuns: target,
      ballsLeft: settings.overs * 6,
    },
    strikerId,
    nonStrikerId,
    currentBowlerId,
    nextBatterIndex: settings.matchMode === MATCH_MODES.TWO_BATSMEN ? 2 : 1,
    nextBowlerIndex: 1,
    dismissedIds: [],
    completed: false,
    pendingChoices: {
      batting: null,
      bowling: null,
    },
  };

  syncScoreboard(innings.scoreboard, settings);
  return innings;
}

/**
 * Turn the current first-innings total into the chase setup for innings two.
 *
 * @param {import("../types/models").Match} match
 * @param {import("../types/models").Innings} firstInnings
 */
function switchToSecondInnings(match, firstInnings) {
  const target = firstInnings.scoreboard.runs + 1;
  const secondInnings = match.innings[1];
  secondInnings.scoreboard.target = target;
  secondInnings.scoreboard.requiredRuns = target;
  secondInnings.scoreboard.ballsLeft = match.settings.overs * 6;
  syncScoreboard(secondInnings.scoreboard, match.settings);
  match.currentInningsIndex = 1;
  match.phase = MATCH_PHASE.BREAK;
}

/**
 * Final result builder after both innings are settled.
 *
 * @param {import("../types/models").Match} match
 * @returns {import("../types/models").Match}
 */
function finalizeResult(match) {
  const next = clone(match);
  const inningsOne = next.innings[0];
  const inningsTwo = next.innings[1];
  const alphaRuns =
    inningsOne.battingTeamId === TEAM_IDS.ALPHA ? inningsOne.scoreboard.runs : inningsTwo.scoreboard.runs;
  const betaRuns = inningsOne.battingTeamId === TEAM_IDS.BETA ? inningsOne.scoreboard.runs : inningsTwo.scoreboard.runs;

  /** @type {import("../types/models").MatchResult} */
  let result;

  if (alphaRuns === betaRuns) {
    result = {
      winnerTeamId: null,
      marginText: "Match tied",
      reason: "Scores level",
      summary: "Both teams finished on the same score.",
      isTie: true,
    };
  } else {
    const winnerTeamId = alphaRuns > betaRuns ? TEAM_IDS.ALPHA : TEAM_IDS.BETA;
    const loserTeamId = winnerTeamId === TEAM_IDS.ALPHA ? TEAM_IDS.BETA : TEAM_IDS.ALPHA;
    const winner = getTeam(next.teams, winnerTeamId);
    const loser = getTeam(next.teams, loserTeamId);
    const secondInnings = next.innings[1];
    const chasingWon = Boolean(secondInnings.scoreboard.target && secondInnings.scoreboard.runs >= secondInnings.scoreboard.target);
    const wicketsLeft = Math.max(winner.playerIds.length - secondInnings.scoreboard.wickets, 0);
    const runMargin = Math.abs(alphaRuns - betaRuns);
    const marginText = chasingWon
      ? `${winner.name} won by ${wicketsLeft} wicket${wicketsLeft === 1 ? "" : "s"}`
      : `${winner.name} won by ${runMargin} run${runMargin === 1 ? "" : "s"}`;

    result = {
      winnerTeamId,
      marginText,
      reason: chasingWon ? "Target chased" : "Defended total",
      summary: `${winner.name} beat ${loser.name}.`,
      isTie: false,
    };
  }

  next.result = result;
  next.phase = MATCH_PHASE.COMPLETE;
  next.updatedAt = Date.now();
  return next;
}

/**
 * Public wrapper for explicit strike changes.
 *
 * @param {import("../types/models").Match} match
 * @returns {import("../types/models").Match}
 */
export function changeStrike(match) {
  if (!isLiveBallContext(match)) {
    return match;
  }

  const next = clone(match);
  swapStrikeInnings(getCurrentInnings(next), next.settings);
  next.updatedAt = Date.now();
  return next;
}

/**
 * Public wrapper for explicitly bringing in the next batsman.
 *
 * @param {import("../types/models").Match} match
 * @returns {import("../types/models").Match}
 */
export function nextBatsman(match) {
  if (!isLiveBallContext(match)) {
    return match;
  }

  const next = clone(match);
  const innings = getCurrentInnings(next);
  const battingTeam = getTeam(next.teams, innings.battingTeamId);
  bringNextBatsmanIn(innings, battingTeam);
  next.updatedAt = Date.now();
  return next;
}

/**
 * Public wrapper for explicitly moving to the next bowler.
 *
 * @param {import("../types/models").Match} match
 * @returns {import("../types/models").Match}
 */
export function nextBowler(match) {
  if (!isLiveBallContext(match)) {
    return match;
  }

  const next = clone(match);
  const innings = getCurrentInnings(next);
  const bowlingTeam = getTeam(next.teams, innings.bowlingTeamId);
  advanceBowler(innings, bowlingTeam);
  next.updatedAt = Date.now();
  return next;
}

/**
 * Handle the over boundary after the sixth legal ball.
 *
 * @param {import("../types/models").Match} match
 * @returns {import("../types/models").Match}
 */
export function endOver(match) {
  if (!isLiveBallContext(match)) {
    return match;
  }

  const next = clone(match);
  const innings = getCurrentInnings(next);
  const bowlingTeam = getTeam(next.teams, innings.bowlingTeamId);

  if (innings.scoreboard.ballsInOver < 6) {
    return next;
  }

  innings.scoreboard.ballsInOver = 0;
  swapStrikeInnings(innings, next.settings);
  advanceBowler(innings, bowlingTeam);
  next.updatedAt = Date.now();
  return next;
}

/**
 * Evaluate whether the current innings or match has just ended.
 *
 * @param {import("../types/models").Match} match
 * @returns {import("../types/models").Match}
 */
export function checkMatchEnd(match) {
  const next = clone(match);
  const innings = getCurrentInnings(next);
  const battingTeam = getTeam(next.teams, innings.battingTeamId);
  const allOut = isAllOut(innings.scoreboard.wickets, battingTeam.playerIds.length);
  const oversDone = innings.scoreboard.legalBalls >= next.settings.overs * 6;
  const targetReached = Boolean(innings.scoreboard.target && innings.scoreboard.runs >= innings.scoreboard.target);

  if (!allOut && !oversDone && !targetReached) {
    next.phase = MATCH_PHASE.LIVE;
    next.updatedAt = Date.now();
    return next;
  }

  innings.completed = true;

  if (next.currentInningsIndex === 0) {
    switchToSecondInnings(next, innings);
    next.updatedAt = Date.now();
    return next;
  }

  return finalizeResult(next);
}

/**
 * Continue after the innings break banner and resume live play.
 *
 * @param {import("../types/models").Match} match
 * @returns {import("../types/models").Match}
 */
export function continueAfterBreak(match) {
  const next = clone(match);
  next.phase = MATCH_PHASE.LIVE;
  next.revealState = createRevealState({
    cycleId: next.revealState.cycleId + 1,
    lastBall: next.revealState.lastBall,
  });
  next.updatedAt = Date.now();
  return next;
}

/**
 * Start a match from drafted teams and a finalized toss decision.
 *
 * @param {import("../types/models").Room} room
 * @param {import("../types/models").TossResult} tossResult
 * @returns {import("../types/models").Match}
 */
export function createMatchFromRoom(room, tossResult) {
  if (!room.teams.alpha || !room.teams.beta) {
    throw new Error("Cannot start match without two drafted teams.");
  }
  const resolvedNumberSet = resolveNumberSetSettings(room.settings, room.settings);
  const resolvedSettings = {
    ...clone(room.settings),
    ...(resolvedNumberSet.ok ? resolvedNumberSet.settings : resolveNumberSetSettings({}, {}).settings),
  };

  const teams = {
    alpha: cloneTeamForMatch(room.teams.alpha),
    beta: cloneTeamForMatch(room.teams.beta),
  };

  const battingFirstId =
    tossResult.decision === "bat"
      ? tossResult.winnerTeamId
      : tossResult.winnerTeamId === TEAM_IDS.ALPHA
        ? TEAM_IDS.BETA
        : TEAM_IDS.ALPHA;
  const bowlingFirstId = battingFirstId === TEAM_IDS.ALPHA ? TEAM_IDS.BETA : TEAM_IDS.ALPHA;

  return {
    id: createId("match"),
    roomId: room.id,
    phase: MATCH_PHASE.LIVE,
    settings: resolvedSettings,
    teams,
    tossResult: clone(tossResult),
    innings: [
      createInnings(teams, battingFirstId, bowlingFirstId, resolvedSettings, null),
      createInnings(teams, bowlingFirstId, battingFirstId, resolvedSettings, null),
    ],
    currentInningsIndex: 0,
    revealState: createRevealState(),
    ballEvents: [],
    result: null,
    updatedAt: Date.now(),
  };
}

/**
 * Store pending number locks until both sides are ready to reveal.
 *
 * @param {import("../types/models").Match} match
 * @param {"batting" | "bowling"} side
 * @param {import("../types/models").PendingChoice} choice
 * @returns {import("../types/models").Match}
 */
export function updatePendingChoice(match, side, choice) {
  const next = clone(match);
  const innings = getCurrentInnings(next);
  innings.pendingChoices[side] = choice;
  const lockedSides = getLockedSides(innings, next.settings.allowedNumbers);

  next.revealState = {
    ...next.revealState,
    status: lockedSides.length === 2 ? "locked" : lockedSides.length === 1 ? "waiting" : "idle",
    waitingFor: lockedSides.length === 1 ? (lockedSides[0] === "batting" ? "bowling" : "batting") : null,
    lockedSides,
    revealAt: null,
  };
  next.updatedAt = Date.now();
  return next;
}

/**
 * Update the reveal lifecycle without changing the rest of the match state.
 *
 * @param {import("../types/models").Match} match
 * @param {Partial<import("../types/models").Match["revealState"]>} [patch]
 * @returns {import("../types/models").Match}
 */
export function setRevealState(match, patch = {}) {
  const next = clone(match);
  const innings = getCurrentInnings(next);
  const lockedSides = getLockedSides(innings, next.settings.allowedNumbers);
  next.revealState = {
    ...next.revealState,
    lockedSides,
    waitingFor: lockedSides.length === 1 ? (lockedSides[0] === "batting" ? "bowling" : "batting") : null,
    ...patch,
  };
  next.updatedAt = Date.now();
  return next;
}

/**
 * Return from reveal mode to idle state.
 *
 * @param {import("../types/models").Match} match
 * @returns {import("../types/models").Match}
 */
export function clearRevealState(match) {
  const next = clone(match);
  next.revealState = createRevealState({
    cycleId: next.revealState.cycleId + 1,
    lastBall: next.revealState.lastBall,
  });
  next.updatedAt = Date.now();
  return next;
}

/**
 * Clear any half-completed picks and return the round to an idle input state.
 *
 * @param {import("../types/models").Match} match
 * @returns {import("../types/models").Match}
 */
export function resetBallSelections(match) {
  const next = clone(match);
  const innings = getCurrentInnings(next);
  innings.pendingChoices = {
    batting: null,
    bowling: null,
  };
  next.revealState = createRevealState({
    cycleId: next.revealState.cycleId + 1,
    lastBall: next.revealState.lastBall,
  });
  next.updatedAt = Date.now();
  return next;
}

/**
 * Resolve one legal ball and return the updated match state.
 *
 * @param {import("../types/models").Match} match
 * @param {number} batsmanNumber
 * @param {number} bowlerNumber
 * @returns {import("../types/models").Match}
 */
export function playBall(match, batsmanNumber, bowlerNumber) {
  if (
    !isLiveBallContext(match) ||
    !isValidBallChoice(batsmanNumber, match.settings.allowedNumbers) ||
    !isValidBallChoice(bowlerNumber, match.settings.allowedNumbers)
  ) {
    return match;
  }

  const next = clone(match);
  const innings = getCurrentInnings(next);
  const battingTeam = getTeam(next.teams, innings.battingTeamId);
  const bowlingTeam = getTeam(next.teams, innings.bowlingTeamId);
  const strikerId = innings.strikerId;
  const nonStrikerId = innings.nonStrikerId;
  const bowlerId = innings.currentBowlerId;
  const over = Math.floor(innings.scoreboard.legalBalls / 6);
  const ball = innings.scoreboard.ballsInOver + 1;
  const wicket = isWicket(batsmanNumber, bowlerNumber);
  const runs = wicket ? 0 : batsmanNumber;
  const presentation = getBallPresentation({
    battingNumber: batsmanNumber,
    bowlingNumber: bowlerNumber,
    runs,
    isWicket: wicket,
    allowedNumbers: next.settings.allowedNumbers,
  });

  if (!strikerId || !bowlerId) {
    return checkMatchEnd(next);
  }

  // Every legal delivery increments the active batter and bowler workloads.
  battingTeam.stats[strikerId].ballsFaced += 1;
  bowlingTeam.stats[bowlerId].ballsBowled += 1;

  if (wicket) {
    // Matching numbers means the striker is out in hand cricket.
    innings.scoreboard.wickets += 1;

    battingTeam.stats[strikerId].dismissals += 1;
    innings.dismissedIds.push(strikerId);
    bowlingTeam.stats[bowlerId].wicketsTaken += 1;

    bringNextBatsmanIn(innings, battingTeam);
  } else {
    // Non-matching numbers score the batter's chosen runs.
    innings.scoreboard.runs += runs;
    battingTeam.stats[strikerId].runs += runs;

    if (isOdd(runs)) {
      // Odd runs swap ends only when two batters are active.
      swapStrikeInnings(innings, next.settings);
    }
  }

  // Overs are derived from legal balls, so every resolved ball updates both.
  innings.scoreboard.legalBalls += 1;
  innings.scoreboard.ballsInOver += 1;
  syncScoreboard(innings.scoreboard, next.settings);

  const ballEvent = {
    inningsIndex: next.currentInningsIndex,
    over,
    ball,
    battingNumber: batsmanNumber,
    bowlingNumber: bowlerNumber,
    resultType: wicket ? "wicket" : runs === 0 ? "dot" : "run",
    runs,
    shotLabel: presentation.shotLabel,
    resultLabel: presentation.resultLabel,
    resultTone: presentation.resultTone,
    strikerId,
    nonStrikerId,
    bowlerId,
    battingTeamId: innings.battingTeamId,
    bowlingTeamId: innings.bowlingTeamId,
    timestamp: Date.now(),
    commentary: presentation.commentary,
  };

  next.ballEvents.push(ballEvent);
  next.revealState.lastBall = ballEvent;
  innings.pendingChoices = {
    batting: null,
    bowling: null,
  };

  // A chase can finish on the sixth ball, so match-end checks come first.
  const evaluated = checkMatchEnd(next);
  if (evaluated.phase !== MATCH_PHASE.LIVE) {
    evaluated.revealState.lastBall = ballEvent;
    evaluated.updatedAt = Date.now();
    return evaluated;
  }

  const liveInnings = getCurrentInnings(evaluated);
  if (liveInnings.scoreboard.ballsInOver === 6) {
    const overCompleted = endOver(evaluated);
    overCompleted.revealState.lastBall = ballEvent;
    overCompleted.updatedAt = Date.now();
    return overCompleted;
  }

  evaluated.revealState.lastBall = ballEvent;
  evaluated.phase = MATCH_PHASE.LIVE;
  evaluated.updatedAt = Date.now();
  return evaluated;
}

/**
 * Backward-compatible wrapper used by the match service.
 *
 * @param {import("../types/models").Match} match
 * @param {{ battingNumber: number; bowlingNumber: number }} selection
 * @returns {import("../types/models").Match}
 */
export function resolveCurrentBall(match, selection) {
  return playBall(match, selection.battingNumber, selection.bowlingNumber);
}

/**
 * Reorder only the yet-to-bat players while leaving active/dismissed state intact.
 *
 * @param {import("../types/models").Match} match
 * @param {string} teamId
 * @param {string[]} nextOrder
 * @returns {import("../types/models").Match}
 */
export function reorderRemainingBatters(match, teamId, nextOrder) {
  if (!canReorderRemainingBatters(match, teamId, nextOrder)) {
    return match;
  }

  const next = clone(match);
  const innings = getCurrentInnings(next);
  const team = getTeam(next.teams, teamId);
  const locked = new Set([innings.strikerId, innings.nonStrikerId, ...innings.dismissedIds].filter(Boolean));
  const queued = [...nextOrder];

  team.battingOrder = team.battingOrder.map((playerId) => {
    if (locked.has(playerId)) {
      return playerId;
    }

    return queued.shift() ?? playerId;
  });

  next.updatedAt = Date.now();
  return next;
}

/**
 * Change the live bowler when the current rules allow it.
 *
 * @param {import("../types/models").Match} match
 * @param {string} teamId
 * @param {string} playerId
 * @returns {import("../types/models").Match}
 */
export function changeCurrentBowler(match, teamId, playerId) {
  if (!canSelectBowler(match, teamId, playerId)) {
    return match;
  }

  const next = clone(match);
  const innings = getCurrentInnings(next);
  const team = getTeam(next.teams, teamId);
  innings.currentBowlerId = playerId;
  team.currentBowlerId = playerId;

  const orderIndex = team.bowlingOrder.indexOf(playerId);
  innings.nextBowlerIndex = orderIndex === -1 ? innings.nextBowlerIndex : (orderIndex + 1) % team.bowlingOrder.length;
  next.updatedAt = Date.now();
  return next;
}

/**
 * Rework the bowling order when the bowling mode allows it.
 *
 * @param {import("../types/models").Match} match
 * @param {string} teamId
 * @param {string[]} nextOrder
 * @returns {import("../types/models").Match}
 */
export function reorderBowlingOrder(match, teamId, nextOrder) {
  if (!canReorderBowlingOrder(match, teamId, nextOrder)) {
    return match;
  }

  const next = clone(match);
  const innings = getCurrentInnings(next);
  const team = getTeam(next.teams, teamId);
  // Reordering future bowlers should not silently swap out the active bowler.
  const activeBowlerId = team.currentBowlerId && nextOrder.includes(team.currentBowlerId) ? team.currentBowlerId : nextOrder[0] ?? null;
  const activeIndex = activeBowlerId ? nextOrder.indexOf(activeBowlerId) : -1;

  team.bowlingOrder = [...nextOrder];
  team.currentBowlerId = activeBowlerId;
  innings.currentBowlerId = activeBowlerId;
  innings.nextBowlerIndex = nextOrder.length ? (activeIndex + 1 + nextOrder.length) % nextOrder.length : 0;
  next.updatedAt = Date.now();
  return next;
}

/**
 * Persistable summary record for the local match history.
 *
 * @param {import("../types/models").Match} match
 * @param {string} roomCode
 * @returns {import("../types/models").MatchHistoryEntry}
 */
export function createHistoryEntry(match, roomCode) {
  return {
    id: createId("history"),
    roomCode,
    playedAt: Date.now(),
    result: clone(match.result),
    tossResult: clone(match.tossResult),
    settings: clone(match.settings),
    numberSetLabel: match.settings.numberSetLabel ?? "Classic 1-6",
    allowedNumbers: [...(match.settings.allowedNumbers ?? [1, 2, 3, 4, 5, 6])],
    insights: getFinalMatchInsights(match, match.ballEvents, match.settings.allowedNumbers),
    inningsSummary: match.innings.map((innings) => ({
      teamId: innings.battingTeamId,
      runs: innings.scoreboard.runs,
      wickets: innings.scoreboard.wickets,
      oversText: formatOvers(innings.scoreboard.legalBalls),
    })),
  };
}
