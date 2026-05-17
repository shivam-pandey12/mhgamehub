// @ts-check

import {
  CONNECTION_STATUS,
  MATCH_PHASE,
  MATCH_TIMINGS,
  ROOM_STATUS,
  ROUTES,
  TEAM_IDS,
} from "../config/constants.js";
import {
  changeCurrentBowler,
  clearRevealState,
  continueAfterBreak,
  createHistoryEntry,
  createMatchFromRoom,
  playBall,
  reorderBowlingOrder,
  reorderRemainingBatters,
  resetBallSelections,
  setRevealState,
  updatePendingChoice,
} from "../engine/gameEngine.js";
import { getBallPresentation, resolveNumberSetSettings } from "../engine/numberSets.js";
import { isValidBallChoice } from "../engine/validators.js";
import { chooseAiDelay, chooseAiNumber, chooseAiTossDecision } from "../services/simulationService.js";
import { ACTIONS } from "../state/actions.js";
import { clone } from "../utils/helpers.js";
import { createId } from "../utils/id.js";

/**
 * @param {import("../types/models").Room} room
 * @param {string | null} localPlayerId
 * @returns {"alpha" | "beta" | null}
 */
function getLocalTeamId(room, localPlayerId) {
  if (!localPlayerId) {
    return null;
  }

  if (room.teams.alpha?.playerIds.includes(localPlayerId)) {
    return TEAM_IDS.ALPHA;
  }

  if (room.teams.beta?.playerIds.includes(localPlayerId)) {
    return TEAM_IDS.BETA;
  }

  return null;
}

/**
 * @param {import("../types/models").Room | null | undefined} room
 * @returns {boolean}
 */
function isOfflineRoom(room) {
  return room?.source === "offline";
}

/**
 * @param {import("../types/models").Room} room
 * @param {string | null | undefined} playerId
 * @returns {boolean}
 */
function isAiControlledPlayer(room, playerId) {
  if (!playerId) {
    return false;
  }

  return Boolean(room.players.find((player) => player.id === playerId && !player.isLocal));
}

/**
 * When a client joins an already-started match or misses earlier room events,
 * infer a minimal toss result from the batting-first team so the existing screens still have
 * a stable match model to render.
 *
 * @param {import("../types/models").Room} room
 * @param {string | null | undefined} battingFirstTeamId
 * @returns {import("../types/models").TossResult}
 */
function createSyntheticTossResult(room, battingFirstTeamId) {
  const normalizedBattingFirstTeamId =
    battingFirstTeamId === TEAM_IDS.ALPHA || battingFirstTeamId === TEAM_IDS.BETA
      ? battingFirstTeamId
      : TEAM_IDS.ALPHA;
  return {
    call: "heads",
    coinFace: "heads",
    winnerTeamId: normalizedBattingFirstTeamId,
    decision: "bat",
  };
}

/**
 * @param {import("../types/models").Room} room
 * @returns {any}
 */
function createServerTeamsPayload(room) {
  return {
    alpha: room.teams.alpha
      ? {
          id: room.teams.alpha.id,
          name: room.teams.alpha.name,
          captainId: room.teams.alpha.captainId,
          playerIds: [...room.teams.alpha.playerIds],
          battingOrder: [...(room.lineups?.alpha?.battingOrder ?? room.teams.alpha.battingOrder)],
          bowlingOrder: [...(room.lineups?.alpha?.bowlingOrder ?? room.teams.alpha.bowlingOrder)],
        }
      : null,
    beta: room.teams.beta
      ? {
          id: room.teams.beta.id,
          name: room.teams.beta.name,
          captainId: room.teams.beta.captainId,
          playerIds: [...room.teams.beta.playerIds],
          battingOrder: [...(room.lineups?.beta?.battingOrder ?? room.teams.beta.battingOrder)],
          bowlingOrder: [...(room.lineups?.beta?.bowlingOrder ?? room.teams.beta.bowlingOrder)],
        }
      : null,
  };
}

const HIDDEN_LOCK_VALUE = 1;

/**
 * @param {import("../types/models").Match} match
 * @param {any} payload
 * @returns {import("../types/models").Match}
 */
function syncMatchFromNextTurn(match, payload) {
  const next = clone(match);
  const inningsIndex = Number(payload?.currentInningsIndex);
  const legalBalls = Number(payload?.legalBalls);

  if (!Number.isInteger(inningsIndex) || inningsIndex < 0 || inningsIndex >= next.innings.length) {
    return match;
  }

  const currentInnings = match.innings[match.currentInningsIndex];
  if (inningsIndex < match.currentInningsIndex) {
    return match;
  }

  if (
    inningsIndex === match.currentInningsIndex &&
    Number.isFinite(legalBalls) &&
    legalBalls < currentInnings.scoreboard.legalBalls
  ) {
    return match;
  }

  next.currentInningsIndex = inningsIndex;
  const innings = next.innings[inningsIndex];
  const runs = Number(payload?.score);
  const wickets = Number(payload?.wickets);
  const ballsInOver = Number(payload?.ballsInOver);
  const target = payload?.target == null ? null : Number(payload.target);
  const battingLocked = Boolean(payload?.inputsLocked?.[payload?.strikerId ?? ""]);
  const bowlingLocked = Boolean(payload?.inputsLocked?.[payload?.currentBowlerId ?? ""]);
  const lockedSides = [];

  innings.battingTeamId = payload?.battingTeamId ?? innings.battingTeamId;
  innings.bowlingTeamId = payload?.bowlingTeamId ?? innings.bowlingTeamId;
  innings.strikerId = payload?.strikerId ?? innings.strikerId;
  innings.nonStrikerId = payload?.nonStrikerId ?? innings.nonStrikerId;
  innings.currentBowlerId = payload?.currentBowlerId ?? innings.currentBowlerId;

  if (Number.isFinite(runs)) {
    innings.scoreboard.runs = runs;
  }

  if (Number.isFinite(wickets)) {
    innings.scoreboard.wickets = wickets;
  }

  if (Number.isFinite(legalBalls)) {
    innings.scoreboard.legalBalls = legalBalls;
    innings.scoreboard.overs = Math.floor(legalBalls / 6);
    innings.scoreboard.ballsLeft = Math.max(next.settings.overs * 6 - legalBalls, 0);
  }

  if (Number.isFinite(ballsInOver)) {
    innings.scoreboard.ballsInOver = ballsInOver;
  }

  innings.scoreboard.target = target;
  innings.scoreboard.requiredRuns = target == null ? null : Math.max(target - innings.scoreboard.runs, 0);
  innings.completed = Boolean(payload?.inningsSwitched ? false : innings.completed);
  innings.pendingChoices = {
    batting: battingLocked
      ? {
          controller: "manual",
          playerId: innings.strikerId,
          teamId: innings.battingTeamId,
          value: HIDDEN_LOCK_VALUE,
          lockedAt: Date.now(),
        }
      : null,
    bowling: bowlingLocked
      ? {
          controller: "manual",
          playerId: innings.currentBowlerId,
          teamId: innings.bowlingTeamId,
          value: HIDDEN_LOCK_VALUE,
          lockedAt: Date.now(),
        }
      : null,
  };

  if (battingLocked) {
    lockedSides.push("batting");
  }

  if (bowlingLocked) {
    lockedSides.push("bowling");
  }

  next.teams[innings.bowlingTeamId].currentBowlerId = innings.currentBowlerId;

  if (next.phase !== MATCH_PHASE.COMPLETE && next.revealState.status !== "revealing") {
    next.phase = payload?.inningsSwitched ? MATCH_PHASE.BREAK : MATCH_PHASE.LIVE;
    next.revealState = {
      ...next.revealState,
      status: lockedSides.length === 2 ? "locked" : lockedSides.length === 1 ? "waiting" : "idle",
      waitingFor:
        lockedSides.length === 1 ? (lockedSides[0] === "batting" ? "bowling" : "batting") : null,
      lockedSides,
      revealAt: lockedSides.length === 2 ? Date.now() + MATCH_TIMINGS.REVEAL_LOCK : null,
    };
  }

  next.updatedAt = Date.now();
  return next;
}

/**
 * @param {any} payload
 * @returns {number | null}
 */
function getResolvedLegalBalls(payload) {
  const over = Number(payload?.over);
  const ball = Number(payload?.ball);

  if (!Number.isInteger(over) || !Number.isInteger(ball) || ball < 1 || ball > 6) {
    return null;
  }

  return over * 6 + ball;
}

/**
 * @param {any} payload
 * @returns {import("../types/models").BallEvent}
 */
function createBallEventFromPayload(payload) {
  const isWicket = payload?.resultType === "out";
  const runs = payload?.runs ?? 0;
  const presentation = getBallPresentation({
    battingNumber: payload?.battingNumber ?? 0,
    bowlingNumber: payload?.bowlingNumber ?? 0,
    runs,
    isWicket,
    allowedNumbers: payload?.allowedNumbers ?? payload?.settings?.allowedNumbers ?? [],
  });

  return {
    inningsIndex: payload?.inningsIndex ?? 0,
    over: payload?.over ?? 0,
    ball: payload?.ball ?? 1,
    battingNumber: payload?.battingNumber ?? 0,
    bowlingNumber: payload?.bowlingNumber ?? 0,
    resultType: isWicket ? "wicket" : runs ? "run" : "dot",
    runs,
    shotLabel: payload?.shotLabel ?? presentation.shotLabel,
    resultLabel: payload?.resultLabel ?? presentation.resultLabel,
    resultTone: payload?.resultTone ?? presentation.resultTone,
    strikerId: payload?.strikerId ?? null,
    nonStrikerId: payload?.nonStrikerId ?? null,
    bowlerId: payload?.currentBowlerId ?? null,
    battingTeamId: payload?.battingTeamId ?? TEAM_IDS.ALPHA,
    bowlingTeamId: payload?.bowlingTeamId ?? TEAM_IDS.BETA,
    timestamp: payload?.timestamp ?? Date.now(),
    commentary:
      payload?.commentary ??
      presentation.commentary,
  };
}

/**
 * @param {string[]} battingOrder
 * @param {string | null} strikerId
 * @param {string | null} nonStrikerId
 * @param {number} wickets
 * @returns {string[]}
 */
function inferDismissedIds(battingOrder, strikerId, nonStrikerId, wickets) {
  const activeIds = new Set([strikerId, nonStrikerId].filter(Boolean));
  const dismissedIds = [];

  battingOrder.forEach((playerId) => {
    if (dismissedIds.length >= wickets || activeIds.has(playerId)) {
      return;
    }

    dismissedIds.push(playerId);
  });

  return dismissedIds;
}

/**
 * Hydrate a fresh local match model from the authoritative backend snapshot so
 * reload/rejoin can restore the live score, innings, and ball history.
 *
 * @param {import("../types/models").Match} match
 * @param {any} payload
 * @returns {import("../types/models").Match}
 */
function hydrateMatchSnapshot(match, payload) {
  const next = clone(match);
  const inningsSnapshots = Array.isArray(payload?.innings) ? payload.innings : [];
  const oversLimit = next.settings.overs * 6;

  next.currentInningsIndex =
    Number.isInteger(Number(payload?.currentInningsIndex)) && Number(payload.currentInningsIndex) >= 0
      ? Number(payload.currentInningsIndex)
      : next.currentInningsIndex;
  next.ballEvents = Array.isArray(payload?.ballHistory)
    ? payload.ballHistory.map((entry) => createBallEventFromPayload(entry))
    : next.ballEvents;
  next.result = payload?.result ?? null;
  next.phase = payload?.status === "complete" || next.result ? MATCH_PHASE.COMPLETE : MATCH_PHASE.LIVE;

  inningsSnapshots.forEach((snapshot, index) => {
    const innings = next.innings[index];

    if (!innings) {
      return;
    }

    const battingTeam = next.teams[snapshot?.battingTeamId ?? innings.battingTeamId];
    const bowlingTeam = next.teams[snapshot?.bowlingTeamId ?? innings.bowlingTeamId];
    const legalBalls = Number(snapshot?.legalBalls);
    const runs = Number(snapshot?.score);
    const wickets = Number(snapshot?.wickets);
    const ballsInOver = Number(snapshot?.ballsInOver);
    const target = snapshot?.target == null ? null : Number(snapshot.target);
    const strikerId = snapshot?.strikerId ?? innings.strikerId;
    const nonStrikerId = snapshot?.nonStrikerId ?? innings.nonStrikerId;
    const currentBowlerId = snapshot?.currentBowlerId ?? innings.currentBowlerId;
    const activeBatters = [strikerId, nonStrikerId].filter(Boolean).length;

    innings.battingTeamId = snapshot?.battingTeamId ?? innings.battingTeamId;
    innings.bowlingTeamId = snapshot?.bowlingTeamId ?? innings.bowlingTeamId;
    innings.strikerId = strikerId;
    innings.nonStrikerId = nonStrikerId;
    innings.currentBowlerId = currentBowlerId;
    innings.completed = Boolean(snapshot?.completed);
    innings.scoreboard.runs = Number.isFinite(runs) ? runs : innings.scoreboard.runs;
    innings.scoreboard.wickets = Number.isFinite(wickets) ? wickets : innings.scoreboard.wickets;
    innings.scoreboard.legalBalls = Number.isFinite(legalBalls) ? legalBalls : innings.scoreboard.legalBalls;
    innings.scoreboard.overs = Math.floor(innings.scoreboard.legalBalls / 6);
    innings.scoreboard.ballsInOver = Number.isFinite(ballsInOver)
      ? ballsInOver
      : innings.scoreboard.legalBalls % 6;
    innings.scoreboard.target = target;
    innings.scoreboard.requiredRuns = target == null ? null : Math.max(target - innings.scoreboard.runs, 0);
    innings.scoreboard.ballsLeft = Math.max(oversLimit - innings.scoreboard.legalBalls, 0);
    innings.dismissedIds = battingTeam
      ? inferDismissedIds(
          battingTeam.battingOrder,
          innings.strikerId,
          innings.nonStrikerId,
          innings.scoreboard.wickets,
        )
      : [];
    innings.nextBatterIndex = innings.dismissedIds.length + activeBatters;
    innings.nextBowlerIndex =
      bowlingTeam?.bowlingOrder?.length && currentBowlerId
        ? (bowlingTeam.bowlingOrder.indexOf(currentBowlerId) + 1 + bowlingTeam.bowlingOrder.length) %
          bowlingTeam.bowlingOrder.length
        : 0;
    innings.pendingChoices = {
      batting: null,
      bowling: null,
    };

    if (bowlingTeam) {
      bowlingTeam.currentBowlerId = currentBowlerId;
    }
  });

  next.updatedAt = payload?.updatedAt ?? Date.now();
  return next;
}

/**
 * @param {import("../types/models").Match} match
 * @returns {import("../types/models").Match}
 */
function rebuildMatchStats(match) {
  const next = clone(match);

  Object.values(next.teams).forEach((team) => {
    team.playerIds.forEach((playerId) => {
      team.stats[playerId] = {
        runs: 0,
        ballsFaced: 0,
        wicketsTaken: 0,
        ballsBowled: 0,
        dismissals: 0,
      };
    });
  });

  next.ballEvents.forEach((event) => {
    const battingTeam = next.teams[event.battingTeamId];
    const bowlingTeam = next.teams[event.bowlingTeamId];
    const strikerId = event.strikerId;
    const bowlerId = event.bowlerId;

    if (strikerId && battingTeam?.stats[strikerId]) {
      battingTeam.stats[strikerId].ballsFaced += 1;
      battingTeam.stats[strikerId].runs += event.runs;

      if (event.resultType === "wicket") {
        battingTeam.stats[strikerId].dismissals += 1;
      }
    }

    if (bowlerId && bowlingTeam?.stats[bowlerId]) {
      bowlingTeam.stats[bowlerId].ballsBowled += 1;

      if (event.resultType === "wicket") {
        bowlingTeam.stats[bowlerId].wicketsTaken += 1;
      }
    }
  });

  return next;
}

/**
 * @param {import("../types/models").Match} match
 * @param {any} payload
 * @returns {import("../types/models").Match}
 */
function syncRevealFromBallResult(match, payload) {
  const next = clone(match);
  const inningsIndex =
    Number.isInteger(Number(payload?.inningsIndex)) && Number(payload?.inningsIndex) >= 0
      ? Number(payload.inningsIndex)
      : next.currentInningsIndex;
  const innings = next.innings[inningsIndex];
  const resolvedLegalBalls = getResolvedLegalBalls(payload);
  const runs = Number(payload?.score);
  const wickets = Number(payload?.wickets);
  const event = createBallEventFromPayload(payload);

  if (innings) {
    if (Number.isFinite(runs)) {
      innings.scoreboard.runs = runs;
    }

    if (Number.isFinite(wickets)) {
      innings.scoreboard.wickets = wickets;
    }

    if (Number.isInteger(resolvedLegalBalls)) {
      innings.scoreboard.legalBalls = resolvedLegalBalls;
      innings.scoreboard.overs = Math.floor(resolvedLegalBalls / 6);
      innings.scoreboard.ballsLeft = Math.max(next.settings.overs * 6 - resolvedLegalBalls, 0);
    }

    innings.scoreboard.target = payload?.target == null ? innings.scoreboard.target : Number(payload.target);
    innings.scoreboard.requiredRuns =
      innings.scoreboard.target == null ? null : Math.max(innings.scoreboard.target - innings.scoreboard.runs, 0);
    innings.scoreboard.ballsInOver = Number.isInteger(Number(payload?.ball)) ? Number(payload.ball) % 6 : innings.scoreboard.ballsInOver;
    innings.strikerId = payload?.strikerId ?? innings.strikerId;
    innings.nonStrikerId = payload?.nonStrikerId ?? innings.nonStrikerId;
    innings.currentBowlerId = payload?.currentBowlerId ?? innings.currentBowlerId;
    innings.pendingChoices = {
      batting: null,
      bowling: null,
    };
  }

  next.revealState = {
    ...next.revealState,
    status: "revealing",
    waitingFor: null,
    lockedSides: [],
    revealAt: null,
    lastBall: event,
  };

  if (!next.ballEvents.some((ball) => ball.timestamp === event.timestamp)) {
    next.ballEvents.push(event);
  }

  next.updatedAt = Date.now();
  return next;
}

export class MatchService {
  /**
   * @param {{ store: ReturnType<import("../state/store.js").createStore>; socket: import("./mockSocket.js").MockSocket }} options
   */
  constructor({ store, socket }) {
    this.store = store;
    this.socket = socket;
    this.timers = {
      revealReset: null,
      inningsBreak: null,
      revealLock: null,
      aiBatting: null,
      aiBowling: null,
      aiDecision: null,
    };
    this.unsubscribers = [
      this.socket.on("game_started", (payload) => this.handleGameStarted(payload)),
      this.socket.on("next_turn", (payload) => this.handleNextTurn(payload)),
      this.socket.on("ball_result", (payload) => this.handleBallResult(payload)),
      this.socket.on("match_end", (payload) => this.handleMatchEnd(payload)),
      this.socket.on("game_error", (payload) => this.handleGameError(payload)),
      this.socket.on("match:playerLeft", (payload) => this.handlePlayerLeft(payload)),
      this.socket.on("connection:status", (payload) => this.applyConnection(payload)),
    ];
  }

  destroy() {
    this.clearTimers();
    this.unsubscribers.forEach((unsubscribe) => unsubscribe());
  }

  /**
   * @param {keyof MatchService["timers"]} key
   */
  clearTimer(key) {
    const timer = this.timers[key];
    if (!timer) {
      return;
    }

    window.clearTimeout(timer);
    this.timers[key] = null;
  }

  /**
   * @param {(keyof MatchService["timers"])[]} [keys]
   */
  clearTimers(keys = /** @type {(keyof MatchService["timers"])[]} */ (Object.keys(this.timers))) {
    keys.forEach((key) => this.clearTimer(key));
  }

  /**
   * @param {string} message
   */
  setBanner(message) {
    this.store.dispatch({
      type: ACTIONS.PATCH_UI,
      payload: {
        connectionBanner: message,
      },
    });
  }

  /**
   * @param {string} message
   * @param {"info" | "success" | "warning"} [tone]
   */
  pushToast(message, tone = "info") {
    this.store.dispatch({
      type: ACTIONS.PUSH_TOAST,
      payload: {
        id: createId("toast"),
        message,
        tone,
      },
    });
  }

  queueOfflineAiSelections() {
    const state = this.store.getState();
    const room = state.room;
    const match = state.match;

    if (!room || !match || !isOfflineRoom(room) || state.ui.isPaused || match.phase !== MATCH_PHASE.LIVE) {
      this.clearTimers(["aiBatting", "aiBowling", "revealLock"]);
      return;
    }

    const innings = match.innings[match.currentInningsIndex];
    const battingNeedsPick = !innings.pendingChoices.batting && isAiControlledPlayer(room, innings.strikerId);
    const bowlingNeedsPick = !innings.pendingChoices.bowling && isAiControlledPlayer(room, innings.currentBowlerId);

    if (battingNeedsPick && !this.timers.aiBatting) {
      this.timers.aiBatting = window.setTimeout(() => {
        this.timers.aiBatting = null;
        this.applyOfflineAiSelection("batting");
      }, chooseAiDelay());
    }

    if (!battingNeedsPick) {
      this.clearTimer("aiBatting");
    }

    if (bowlingNeedsPick && !this.timers.aiBowling) {
      this.timers.aiBowling = window.setTimeout(() => {
        this.timers.aiBowling = null;
        this.applyOfflineAiSelection("bowling");
      }, chooseAiDelay());
    }

    if (!bowlingNeedsPick) {
      this.clearTimer("aiBowling");
    }

    if (innings.pendingChoices.batting && innings.pendingChoices.bowling) {
      this.lockOfflineReveal();
    }
  }

  /**
   * @param {"batting" | "bowling"} side
   */
  applyOfflineAiSelection(side) {
    const state = this.store.getState();
    const room = state.room;
    const match = state.match;

    if (!room || !match || !isOfflineRoom(room) || match.phase !== MATCH_PHASE.LIVE || state.ui.isPaused) {
      return;
    }

    const innings = match.innings[match.currentInningsIndex];
    const playerId = side === "batting" ? innings.strikerId : innings.currentBowlerId;

    if (!isAiControlledPlayer(room, playerId) || innings.pendingChoices[side]) {
      return;
    }

    const teamId = side === "batting" ? innings.battingTeamId : innings.bowlingTeamId;
    const nextMatch = updatePendingChoice(match, side, {
      controller: "ai",
      playerId,
      teamId,
      value: chooseAiNumber(match, side),
      lockedAt: Date.now(),
    });

    this.store.dispatch({ type: ACTIONS.SET_MATCH, payload: nextMatch });
    this.setBanner(
      nextMatch.revealState.status === "locked"
        ? "Both picks locked. Revealing together..."
        : side === "batting"
          ? "AI batter locked in."
          : "AI bowler locked in.",
    );
    this.queueOfflineAiSelections();
  }

  lockOfflineReveal() {
    const state = this.store.getState();
    const room = state.room;
    const match = state.match;

    if (!room || !match || !isOfflineRoom(room) || match.phase !== MATCH_PHASE.LIVE) {
      return;
    }

    const innings = match.innings[match.currentInningsIndex];
    if (!innings.pendingChoices.batting || !innings.pendingChoices.bowling) {
      return;
    }

    this.clearTimers(["aiBatting", "aiBowling"]);

    const lockedMatch =
      match.revealState.status === "locked"
        ? match
        : setRevealState(match, {
            status: "locked",
            waitingFor: null,
            revealAt: Date.now() + MATCH_TIMINGS.REVEAL_LOCK,
          });

    this.store.dispatch({ type: ACTIONS.SET_MATCH, payload: lockedMatch });
    this.setBanner("Both picks locked. Revealing together...");
    this.clearTimer("revealLock");
    this.timers.revealLock = window.setTimeout(() => {
      this.timers.revealLock = null;
      this.resolveOfflineBall();
    }, MATCH_TIMINGS.REVEAL_LOCK);
  }

  resolveOfflineBall() {
    const state = this.store.getState();
    const room = state.room;
    const match = state.match;

    if (!room || !match || !isOfflineRoom(room) || match.phase !== MATCH_PHASE.LIVE) {
      return;
    }

    const innings = match.innings[match.currentInningsIndex];
    const battingChoice = innings.pendingChoices.batting?.value ?? null;
    const bowlingChoice = innings.pendingChoices.bowling?.value ?? null;

    if (
      !isValidBallChoice(battingChoice, match.settings.allowedNumbers) ||
      !isValidBallChoice(bowlingChoice, match.settings.allowedNumbers)
    ) {
      return;
    }

    const resolved = setRevealState(playBall(match, battingChoice, bowlingChoice), {
      status: "revealing",
      waitingFor: null,
      revealAt: null,
    });
    const revealStamp = resolved.revealState.lastBall?.timestamp ?? Date.now();

    this.store.dispatch({ type: ACTIONS.SET_MATCH, payload: resolved });
    this.store.dispatch({
      type: ACTIONS.SET_CONNECTION,
      payload: {
        status: CONNECTION_STATUS.CONNECTED,
        note: resolved.revealState.lastBall?.commentary ?? "Practice ball resolved.",
        lastSyncAt: Date.now(),
      },
    });
    this.setBanner(resolved.revealState.lastBall?.commentary ?? "Practice ball resolved.");
    this.clearTimer("revealReset");
    this.timers.revealReset = window.setTimeout(
      () => this.finalizeResolvedBall(revealStamp),
      MATCH_TIMINGS.RESULT_DISPLAY,
    );
  }

  /**
   * @param {"bat" | "bowl"} decision
   */
  finalizeOfflineTossDecision(decision) {
    const state = this.store.getState();
    const room = state.room;

    if (!room?.tossResult || !isOfflineRoom(room)) {
      return;
    }

    this.clearTimer("aiDecision");

    this.store.dispatch({
      type: ACTIONS.SET_ROOM,
      payload: {
        ...room,
        status: ROOM_STATUS.LINEUP,
        tossResult: {
          ...room.tossResult,
          decision,
        },
      },
    });
    this.store.dispatch({ type: ACTIONS.NAVIGATE, payload: ROUTES.LINEUP });
    this.setBanner(`Toss finalized. ${room.teams[room.tossResult.winnerTeamId]?.name ?? "Winning team"} chose to ${decision}.`);
  }

  /**
   * @param {string} note
   * @param {{ resetSelections?: boolean; toast?: string | null }} [options]
   */
  pauseInterruptedMatch(note, options = {}) {
    const { resetSelections = false, toast = null } = options;
    const state = this.store.getState();

    this.clearTimers();

    if (state.match && resetSelections) {
      this.store.dispatch({
        type: ACTIONS.SET_MATCH,
        payload: resetBallSelections(state.match),
      });
    }

    this.store.dispatch({
      type: ACTIONS.PATCH_UI,
      payload: {
        isPaused: true,
        connectionBanner: note,
      },
    });

    if (toast) {
      this.pushToast(toast, "warning");
    }
  }

  /**
   * @param {string} playerId
   * @param {import("../types/models").PlayerStatus} status
   * @param {string} note
   */
  markPlayerStatus(playerId, status, note) {
    const state = this.store.getState();
    if (!state.room) {
      return;
    }

    this.store.dispatch({
      type: ACTIONS.SET_ROOM,
      payload: {
        ...state.room,
        players: state.room.players.map((player) =>
          player.id === playerId
            ? {
                ...player,
                status,
                connectionState: {
                  ...player.connectionState,
                  status: status === "away" ? CONNECTION_STATUS.OFFLINE : CONNECTION_STATUS.CONNECTED,
                  note,
                  lastSyncAt: Date.now(),
                },
              }
            : player,
        ),
      },
    });
  }

  togglePause() {
    const state = this.store.getState();
    if (!state.match) {
      return;
    }

    const nextPaused = !state.ui.isPaused;
    this.store.dispatch({
      type: ACTIONS.PATCH_UI,
      payload: {
        isPaused: nextPaused,
        connectionBanner: nextPaused ? "Match paused locally." : "Match resumed. Lock your number.",
      },
    });

    if (!nextPaused && isOfflineRoom(state.room)) {
      this.queueOfflineAiSelections();
    }
  }

  simulateReconnect() {
    if (isOfflineRoom(this.store.getState().room)) {
      this.setBanner("Practice mode runs locally. No server reconnect is needed.");
      return;
    }

    this.setBanner("Trying to reconnect to the realtime backend...");
    this.socket.reconnect();
  }

  startToss() {
    const state = this.store.getState();
    const room = state.room;

    if (
      !room?.teams.alpha ||
      !room.teams.beta ||
      room.hostId !== state.session.localPlayerId ||
      room.players.length !== room.maxPlayers ||
      room.players.some((player) => player.status !== "ready") ||
      room.teams.alpha.playerIds.length !== room.settings.playersPerTeam ||
      room.teams.beta.playerIds.length !== room.settings.playersPerTeam
    ) {
      return;
    }

    if (isOfflineRoom(room)) {
      this.store.dispatch({
        type: ACTIONS.SET_ROOM,
        payload: {
          ...room,
          status: ROOM_STATUS.TOSS,
          tossResult: null,
        },
      });
      this.store.dispatch({ type: ACTIONS.NAVIGATE, payload: ROUTES.TOSS });
      this.setBanner("Practice toss ready. Call heads or tails.");
      return;
    }

    this.socket.emit("start_toss", {}, (response) => {
      if (response?.ok) {
        return;
      }

      this.handleGameError({
        message: response?.error ?? "Unable to start the toss.",
      });
    });
  }

  /**
   * @param {"heads" | "tails"} call
   */
  runToss(call) {
    const room = this.store.getState().room;

    if (!room?.teams.alpha || !room.teams.beta || room.status !== ROOM_STATUS.TOSS) {
      return;
    }

    if (isOfflineRoom(room)) {
      const coinFace = Math.random() > 0.5 ? "heads" : "tails";
      const winnerTeamId = coinFace === call ? TEAM_IDS.ALPHA : TEAM_IDS.BETA;
      const updatedRoom = {
        ...room,
        tossResult: {
          call,
          coinFace,
          winnerTeamId,
          decision: null,
        },
      };

      this.store.dispatch({ type: ACTIONS.SET_ROOM, payload: updatedRoom });

      if (updatedRoom.captains[winnerTeamId] === this.store.getState().session.localPlayerId) {
        this.setBanner(`${updatedRoom.teams[winnerTeamId]?.name ?? "Your team"} won the toss. Choose bat or bowl.`);
      } else {
        this.setBanner(`${updatedRoom.teams[winnerTeamId]?.name ?? "AI team"} won the toss. AI captain is choosing...`);
        this.clearTimer("aiDecision");
        this.timers.aiDecision = window.setTimeout(() => {
          this.timers.aiDecision = null;
          this.finalizeOfflineTossDecision(chooseAiTossDecision({ settings: updatedRoom.settings }));
        }, chooseAiDelay());
      }
      return;
    }

    this.socket.emit(
      "run_toss",
      {
        call,
      },
      (response) => {
        if (response?.ok) {
          return;
        }

        this.handleGameError({
          message: response?.error ?? "Unable to flip the toss.",
        });
      },
    );
  }

  /**
   * @param {"bat" | "bowl"} decision
   */
  chooseTossDecision(decision) {
    const room = this.store.getState().room;

    if (!room?.tossResult || room.status !== ROOM_STATUS.TOSS) {
      return;
    }

    if (isOfflineRoom(room)) {
      this.finalizeOfflineTossDecision(decision);
      return;
    }

    this.socket.emit(
      "choose_toss",
      {
        decision,
      },
      (response) => {
        if (response?.ok) {
          return;
        }

        this.handleGameError({
          message: response?.error ?? "Unable to lock the toss decision.",
        });
      },
    );
  }

  confirmLineupsAndStart() {
    const state = this.store.getState();
    const room = state.room;

    if (!room?.teams.alpha || !room.teams.beta || !room.tossResult?.decision) {
      return;
    }

    if (room.hostId !== state.session.localPlayerId) {
      return;
    }

    const battingFirstTeamId =
      room.tossResult.decision === "bat"
        ? room.tossResult.winnerTeamId
        : room.tossResult.winnerTeamId === TEAM_IDS.ALPHA
          ? TEAM_IDS.BETA
          : TEAM_IDS.ALPHA;
    const battingFirstPlayerId = room.lineups?.[battingFirstTeamId]?.battingOrder?.[0] ?? room.teams[battingFirstTeamId]?.playerIds[0] ?? null;

    if (!battingFirstPlayerId) {
      return;
    }

    if (isOfflineRoom(room)) {
      this.store.dispatch({
        type: ACTIONS.PATCH_UI,
        payload: {
          connectionBanner: "Game starts within 5 seconds. Preparing practice match...",
          isPaused: false,
        },
      });

      const nextRoom = {
        ...room,
        status: ROOM_STATUS.LIVE,
      };
      const match = createMatchFromRoom(nextRoom, room.tossResult);

      this.clearTimers();
      this.store.dispatch({ type: ACTIONS.SET_ROOM, payload: nextRoom });
      this.store.dispatch({ type: ACTIONS.SET_MATCH, payload: match });
      this.store.dispatch({ type: ACTIONS.NAVIGATE, payload: ROUTES.MATCH });
      this.store.dispatch({
        type: ACTIONS.SET_CONNECTION,
        payload: {
          status: CONNECTION_STATUS.CONNECTED,
          note: "Practice match running locally.",
          lastSyncAt: Date.now(),
        },
      });
      this.store.dispatch({
        type: ACTIONS.PATCH_UI,
        payload: {
          connectionBanner: "Practice match live. Lock your number when it is your turn.",
          isPaused: false,
        },
      });
      this.queueOfflineAiSelections();
      return;
    }

    this.store.dispatch({
      type: ACTIONS.PATCH_UI,
      payload: {
        connectionBanner: "Game starts within 5 seconds. Preparing realtime match...",
        isPaused: false,
      },
    });

    this.socket.emit(
      "start_match",
      {
        battingFirstPlayerId,
        tossWinnerId: room.teams[room.tossResult.winnerTeamId]?.captainId ?? null,
        decision: room.tossResult.decision,
        teams: createServerTeamsPayload(room),
        settings: {
          overs: room.settings.overs,
          matchMode: room.settings.matchMode,
          bowlingMode: room.settings.bowlingMode,
          numberSetMode: room.settings.numberSetMode,
          numberSetPreset: room.settings.numberSetPreset,
          numberSetLabel: room.settings.numberSetLabel,
          allowedNumbers: room.settings.allowedNumbers,
          numberRangeMin: room.settings.numberRangeMin,
          numberRangeMax: room.settings.numberRangeMax,
          customNumbersText: room.settings.customNumbersText,
        },
      },
      (response) => {
        if (response?.ok) {
          return;
        }

        this.handleGameError({
          message: response?.error ?? "Unable to start the match.",
        });
      },
    );
  }

  /**
   * @param {"batting" | "bowling"} side
   * @param {number} value
   * @param {{ previewOnly?: boolean }} [options]
   */
  submitSelection(side, value, options = {}) {
    const state = this.store.getState();
    const match = state.match;
    const room = state.room;
    const localPlayerId = state.session.localPlayerId;
    const allowedNumbers = match?.settings.allowedNumbers ?? resolveNumberSetSettings({}, {}).settings.allowedNumbers;

    if (
      !match ||
      !room ||
      !localPlayerId ||
      state.ui.isPaused ||
      match.phase !== MATCH_PHASE.LIVE ||
      !isValidBallChoice(value, allowedNumbers) ||
      match.revealState.status === "locked" ||
      match.revealState.status === "revealing"
    ) {
      if (match && !isValidBallChoice(value, allowedNumbers)) {
        this.handleGameError({
          message: `Choose one of: ${allowedNumbers.join(", ")}.`,
        });
      }
      return;
    }

    const innings = match.innings[match.currentInningsIndex];
    const expectedSide =
      innings.strikerId === localPlayerId
        ? "batting"
        : innings.currentBowlerId === localPlayerId
          ? "bowling"
          : null;

    if (expectedSide !== side) {
      return;
    }

    if (innings.pendingChoices[side]?.value != null) {
      return;
    }

    if (options.previewOnly) {
      this.store.dispatch({
        type: ACTIONS.PATCH_UI,
        payload: {
          selectedPicks: {
            ...(state.ui.selectedPicks ?? { batting: null, bowling: null }),
            [side]: value,
          },
          selectedNumberSide: side,
        },
      });
      this.setBanner(`Selected ${value}. Lock your pick when ready.`);
      return;
    }

    const teamId = side === "batting" ? innings.battingTeamId : innings.bowlingTeamId;
    const playerId = side === "batting" ? innings.strikerId : innings.currentBowlerId;
    const pending = updatePendingChoice(match, side, {
      controller: "local",
      playerId,
      teamId,
      value,
      lockedAt: Date.now(),
    });
    const expectedCycleId = pending.revealState.cycleId;

    this.store.dispatch({ type: ACTIONS.SET_MATCH, payload: pending });
    this.store.dispatch({
      type: ACTIONS.PATCH_UI,
      payload: {
        selectedPicks: {
          ...(state.ui.selectedPicks ?? { batting: null, bowling: null }),
          [side]: null,
        },
        selectedNumberSide: null,
      },
    });
    this.setBanner("Selection locked. Waiting for opponent.");

    if (isOfflineRoom(room)) {
      this.queueOfflineAiSelections();
      if (pending.innings[pending.currentInningsIndex].pendingChoices.batting && pending.innings[pending.currentInningsIndex].pendingChoices.bowling) {
        this.lockOfflineReveal();
      }
      return;
    }

    this.socket.emit(
      "select_number",
      {
        number: value,
      },
      (response) => {
        const liveState = this.store.getState();
        const liveMatch = liveState.match;

        if (!liveMatch || liveMatch.revealState.cycleId !== expectedCycleId) {
          return;
        }

        if (liveMatch.revealState.status === "revealing") {
          return;
        }

        if (!response?.ok) {
          this.store.dispatch({
            type: ACTIONS.SET_MATCH,
            payload: resetBallSelections(liveMatch),
          });
          this.store.dispatch({
            type: ACTIONS.PATCH_UI,
            payload: {
              selectedPicks: {
                ...(liveState.ui.selectedPicks ?? { batting: null, bowling: null }),
                [side]: null,
              },
            },
          });
          this.handleGameError({
            message: response?.error ?? "Unable to submit selection.",
          });
          return;
        }

        if (response.waiting === false) {
          this.store.dispatch({
            type: ACTIONS.SET_MATCH,
            payload: setRevealState(liveMatch, {
              status: "locked",
              waitingFor: null,
              revealAt: Date.now() + MATCH_TIMINGS.REVEAL_LOCK,
            }),
          });
          this.setBanner("Both picks locked. Revealing together...");
        }
      },
    );
  }

  /**
   * @param {string} teamId
   * @param {string[]} nextOrder
   */
  reorderBatters(teamId, nextOrder) {
    const state = this.store.getState();
    if (!state.match || state.ui.isPaused) {
      return;
    }

    this.store.dispatch({
      type: ACTIONS.SET_MATCH,
      payload: reorderRemainingBatters(state.match, teamId, nextOrder),
    });
  }

  /**
   * @param {string} teamId
   * @param {string[]} nextOrder
   */
  reorderBowlers(teamId, nextOrder) {
    const state = this.store.getState();
    if (!state.match || state.ui.isPaused) {
      return;
    }

    this.store.dispatch({
      type: ACTIONS.SET_MATCH,
      payload: reorderBowlingOrder(state.match, teamId, nextOrder),
    });
  }

  /**
   * @param {string} teamId
   * @param {string} playerId
   */
  changeBowler(teamId, playerId) {
    const state = this.store.getState();
    if (!state.match || state.ui.isPaused) {
      return;
    }

    this.store.dispatch({
      type: ACTIONS.SET_MATCH,
      payload: changeCurrentBowler(state.match, teamId, playerId),
    });
  }

  startRematch() {
    const state = this.store.getState();
    const room = state.room;

    if (!room) {
      return;
    }

    this.clearTimers();
    this.store.dispatch({ type: ACTIONS.SET_MATCH, payload: null });
    this.store.dispatch({
      type: ACTIONS.SET_ROOM,
      payload: {
        ...room,
        status: ROOM_STATUS.TOSS,
        tossResult: null,
        teams: {
          alpha: room.teams.alpha ? { ...room.teams.alpha, lockedLineup: false } : null,
          beta: room.teams.beta ? { ...room.teams.beta, lockedLineup: false } : null,
        },
        lineups: {
          alpha: room.lineups?.alpha ? { ...room.lineups.alpha, locked: false } : null,
          beta: room.lineups?.beta ? { ...room.lineups.beta, locked: false } : null,
        },
      },
    });
    this.store.dispatch({
      type: ACTIONS.PATCH_UI,
      payload: {
        isPaused: false,
        connectionBanner: "Rematch ready. Toss again to start fresh.",
      },
    });
    this.store.dispatch({ type: ACTIONS.NAVIGATE, payload: ROUTES.TOSS });
  }

  /**
   * @param {any} payload
   */
  handleGameStarted(payload) {
    const state = this.store.getState();
    const room = state.room;

    if (!room?.teams.alpha || !room.teams.beta) {
      return;
    }

    const inferredToss =
      payload?.tossResult?.decision && payload?.tossResult?.winnerTeamId
        ? payload.tossResult
        : room.tossResult?.decision && room.tossResult.winnerTeamId
        ? room.tossResult
        : createSyntheticTossResult(room, payload?.innings?.[0]?.battingTeamId ?? null);
    const syncedTeams = payload?.teams
      ? {
          alpha: room.teams.alpha
            ? {
                ...room.teams.alpha,
                playerIds: [...payload.teams.alpha.playerIds],
                captainId: payload.teams.alpha.captainId,
                battingOrder: [...payload.teams.alpha.battingOrder],
                bowlingOrder: [...payload.teams.alpha.bowlingOrder],
                currentBowlerId: payload.teams.alpha.bowlingOrder[0] ?? room.teams.alpha.currentBowlerId,
                lockedLineup: true,
              }
            : room.teams.alpha,
          beta: room.teams.beta
            ? {
                ...room.teams.beta,
                playerIds: [...payload.teams.beta.playerIds],
                captainId: payload.teams.beta.captainId,
                battingOrder: [...payload.teams.beta.battingOrder],
                bowlingOrder: [...payload.teams.beta.bowlingOrder],
                currentBowlerId: payload.teams.beta.bowlingOrder[0] ?? room.teams.beta.currentBowlerId,
                lockedLineup: true,
              }
            : room.teams.beta,
        }
      : room.teams;
    const resolvedNumberSet = resolveNumberSetSettings(payload?.settings ?? {}, room.settings);
    const nextRoom = {
      ...room,
      status: ROOM_STATUS.LIVE,
      tossResult: inferredToss,
      settings: {
        ...room.settings,
        overs: payload?.settings?.overs ?? room.settings.overs,
        matchMode: payload?.settings?.matchMode ?? room.settings.matchMode,
        bowlingMode: payload?.settings?.bowlingMode ?? room.settings.bowlingMode,
        ...(resolvedNumberSet.ok ? resolvedNumberSet.settings : resolveNumberSetSettings({}, room.settings).settings),
      },
      teams: syncedTeams,
      lineups: {
        alpha: syncedTeams.alpha
          ? {
              teamId: syncedTeams.alpha.id,
              battingOrder: [...syncedTeams.alpha.battingOrder],
              bowlingOrder: [...syncedTeams.alpha.bowlingOrder],
              locked: true,
            }
          : null,
        beta: syncedTeams.beta
          ? {
              teamId: syncedTeams.beta.id,
              battingOrder: [...syncedTeams.beta.battingOrder],
              bowlingOrder: [...syncedTeams.beta.bowlingOrder],
              locked: true,
            }
          : null,
      },
    };
    const match = createMatchFromRoom(nextRoom, inferredToss);
    const hydratedMatch = rebuildMatchStats(hydrateMatchSnapshot(match, payload));

    this.store.dispatch({ type: ACTIONS.SET_ROOM, payload: nextRoom });
    this.store.dispatch({ type: ACTIONS.SET_MATCH, payload: hydratedMatch });
    this.store.dispatch({ type: ACTIONS.NAVIGATE, payload: ROUTES.MATCH });
    this.store.dispatch({
      type: ACTIONS.PATCH_UI,
      payload: {
        connectionBanner:
          payload?.ballHistory?.length || payload?.innings?.some((innings) => Number(innings?.legalBalls) > 0)
            ? "Realtime match restored. Lock your number when your turn is active."
            : "Realtime match live. Lock your number.",
        isPaused: false,
      },
    });
  }

  /**
   * @param {any} payload
   */
  handleNextTurn(payload) {
    const state = this.store.getState();
    const nextMatch = state.match ? syncMatchFromNextTurn(state.match, payload) : null;
    const revealInProgress = state.match?.revealState.status === "revealing";
    const waitingForInput = Boolean(payload?.waitingFor?.length);
    const connectionStatus = revealInProgress
      ? CONNECTION_STATUS.CONNECTED
      : waitingForInput
        ? CONNECTION_STATUS.WAITING
        : CONNECTION_STATUS.CONNECTED;
    const connectionNote = revealInProgress
      ? state.ui.connectionBanner || "Reveal in progress."
      : payload?.message ?? "Realtime turn synced.";

    this.store.dispatch({
      type: ACTIONS.SET_CONNECTION,
      payload: {
        status: connectionStatus,
        note: connectionNote,
        lastSyncAt: Date.now(),
      },
    });

    if (nextMatch) {
      this.store.dispatch({ type: ACTIONS.SET_MATCH, payload: nextMatch });
    }

    if (payload?.timeout && !revealInProgress) {
      this.pushToast("Still waiting for the missing input.", "warning");
    }

    if (!revealInProgress) {
      this.setBanner(payload?.message ?? "Realtime turn synced.");
    }

    if (state.room) {
      this.store.dispatch({
        type: ACTIONS.SET_ROOM,
        payload: {
          ...state.room,
          status: state.room.status === ROOM_STATUS.COMPLETED ? ROOM_STATUS.COMPLETED : ROOM_STATUS.LIVE,
        },
      });
    }
  }

  /**
   * @param {any} payload
   */
  handleBallResult(payload) {
    const state = this.store.getState();
    const match = state.match;

    if (!match || match.phase !== MATCH_PHASE.LIVE) {
      return;
    }

    const resolvedLegalBalls = getResolvedLegalBalls(payload);
    const currentInnings = match.innings[match.currentInningsIndex];
    if (
      Number.isInteger(resolvedLegalBalls) &&
      currentInnings.scoreboard.legalBalls > resolvedLegalBalls
    ) {
      return;
    }

    const alreadyApplied =
      Number.isInteger(resolvedLegalBalls) && currentInnings.scoreboard.legalBalls >= resolvedLegalBalls;
    const resolved = alreadyApplied
      ? syncRevealFromBallResult(match, payload)
      : setRevealState(playBall(match, payload.battingNumber, payload.bowlingNumber), {
          status: "revealing",
          waitingFor: null,
          revealAt: null,
        });

    if (resolved.revealState.lastBall) {
      resolved.revealState.lastBall.timestamp = payload?.timestamp ?? resolved.revealState.lastBall.timestamp;
      resolved.revealState.lastBall.commentary = payload?.commentary ?? resolved.revealState.lastBall.commentary;
    }

    if (resolved.ballEvents.length) {
      const latestBall = resolved.ballEvents[resolved.ballEvents.length - 1];
      latestBall.timestamp = payload?.timestamp ?? latestBall.timestamp;
      latestBall.commentary = payload?.commentary ?? latestBall.commentary;
    }

    const revealStamp = payload?.timestamp ?? resolved.revealState.lastBall?.timestamp ?? Date.now();

    this.store.dispatch({ type: ACTIONS.SET_MATCH, payload: resolved });
    this.store.dispatch({
      type: ACTIONS.SET_CONNECTION,
      payload: {
        status: CONNECTION_STATUS.CONNECTED,
        note: payload?.commentary ?? resolved.revealState.lastBall?.commentary ?? "Ball synced.",
        lastSyncAt: Date.now(),
      },
    });
    this.setBanner(payload?.commentary ?? resolved.revealState.lastBall?.commentary ?? "Ball synced.");
    this.clearTimer("revealReset");
    this.timers.revealReset = window.setTimeout(
      () => this.finalizeResolvedBall(revealStamp),
      MATCH_TIMINGS.RESULT_DISPLAY,
    );
  }

  /**
   * @param {number} revealStamp
   */
  finalizeResolvedBall(revealStamp) {
    const state = this.store.getState();
    const match = state.match;
    const room = state.room;

    if (!match || match.revealState.lastBall?.timestamp !== revealStamp) {
      return;
    }

    if (match.phase === MATCH_PHASE.BREAK) {
      this.clearTimer("inningsBreak");
      this.timers.inningsBreak = window.setTimeout(() => {
        const breakState = this.store.getState();
        if (!breakState.match || breakState.match.phase !== MATCH_PHASE.BREAK) {
          return;
        }

        this.store.dispatch({
          type: ACTIONS.SET_MATCH,
          payload: continueAfterBreak(breakState.match),
        });
        this.setBanner("Innings switched. Lock fresh picks.");

        if (isOfflineRoom(breakState.room)) {
          this.queueOfflineAiSelections();
        }
      }, MATCH_TIMINGS.INNINGS_BREAK);
      return;
    }

    if (match.phase === MATCH_PHASE.COMPLETE && match.result && room) {
      this.store.dispatch({
        type: ACTIONS.SAVE_HISTORY_ENTRY,
        payload: createHistoryEntry(match, room.code),
      });
      this.store.dispatch({
        type: ACTIONS.SET_ROOM,
        payload: {
          ...room,
          status: ROOM_STATUS.COMPLETED,
        },
      });
      this.store.dispatch({ type: ACTIONS.NAVIGATE, payload: ROUTES.RESULT });
      this.setBanner(match.result.marginText);
      return;
    }

    this.store.dispatch({
      type: ACTIONS.SET_MATCH,
      payload: clearRevealState(match),
    });
    this.setBanner("Next ball ready. Make your picks.");

    if (isOfflineRoom(room)) {
      this.queueOfflineAiSelections();
    }
  }

  /**
   * @param {any} payload
   */
  handleMatchEnd(payload) {
    const state = this.store.getState();

    if (payload?.aborted) {
      this.pauseInterruptedMatch(payload.reason ?? "Match ended early.", {
        resetSelections: true,
        toast: payload.reason ?? "Match ended early.",
      });
      return;
    }

    if (state.room) {
      this.store.dispatch({
        type: ACTIONS.SET_ROOM,
        payload: {
          ...state.room,
          status: ROOM_STATUS.COMPLETED,
        },
      });
    }

    if (payload?.result?.marginText) {
      this.setBanner(payload.result.marginText);
    }
  }

  /**
   * @param {{ roomId?: string | null; playerId?: string | null; note?: string }} payload
   */
  handlePlayerLeft(payload) {
    const state = this.store.getState();

    if (!state.room || !state.match || isOfflineRoom(state.room) || (payload.roomId && payload.roomId !== state.room.code)) {
      return;
    }

    const player = state.room.players.find((entry) => entry.id === payload.playerId);
    const playerName = player?.name ?? "Opponent";

    if (payload.playerId) {
      this.markPlayerStatus(payload.playerId, "away", payload.note ?? "Left the room");
    }

    this.pauseInterruptedMatch(`${playerName} left mid-match. Match paused.`, {
      resetSelections: true,
      toast: `${playerName} disconnected during the round.`,
    });
  }

  /**
   * @param {{ message?: string }} payload
   */
  handleGameError(payload) {
    const message = payload?.message ?? "Realtime game action failed.";
    this.pushToast(message, "warning");
    this.setBanner(message);
  }

  /**
   * @param {{ status: import("../types/models").ConnectionStatus; note: string }} payload
   */
  applyConnection(payload) {
    const state = this.store.getState();

    if (isOfflineRoom(state.room)) {
      this.store.dispatch({
        type: ACTIONS.SET_CONNECTION,
        payload: {
          status: CONNECTION_STATUS.CONNECTED,
          note: "Practice mode active locally.",
          lastSyncAt: Date.now(),
        },
      });
      return;
    }

    this.store.dispatch({
      type: ACTIONS.SET_CONNECTION,
      payload: {
        status: payload.status,
        note: payload.note,
        lastSyncAt: Date.now(),
      },
    });

    if (payload.status === CONNECTION_STATUS.RECONNECTING && state.match) {
      this.pauseInterruptedMatch("Realtime link unstable. Waiting to reconnect.", {
        resetSelections: true,
      });
      return;
    }

    if (payload.status === CONNECTION_STATUS.OFFLINE && state.match) {
      this.pauseInterruptedMatch(payload.note || "Connection lost.", {
        resetSelections: true,
      });
      return;
    }

    if (payload.status === CONNECTION_STATUS.CONNECTED && !state.ui.isPaused) {
      this.setBanner(payload.note || (state.match ? "Realtime match synced." : "Connected."));
    }
  }
}
