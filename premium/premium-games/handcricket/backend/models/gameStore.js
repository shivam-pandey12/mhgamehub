import { HANDREX_RUNTIME_LIMITS, clampInteger, normalizeText } from "../utils/runtimeGuards.js";
import { getBallPresentation, getDefaultNumberSet, isValidPick, resolveNumberSetSettings } from "../../src/engine/numberSets.js";

const DEFAULT_OVERS = 2;
const DEFAULT_INPUT_TIMEOUT_MS = 15000;
const DEFAULT_NUMBER_SET = getDefaultNumberSet();

/**
 * @param {number} legalBalls
 * @returns {string}
 */
function formatOvers(legalBalls) {
  return `${Math.floor(legalBalls / 6)}.${legalBalls % 6}`;
}

/**
 * @param {string[]} order
 * @param {string[]} players
 * @returns {boolean}
 */
function isValidLineup(order, players) {
  return (
    Array.isArray(order) &&
    order.length === players.length &&
    order.every((playerId) => players.includes(playerId)) &&
    new Set(order).size === order.length
  );
}

/**
 * @param {string[]} allPlayers
 * @param {any} payloadTeams
 * @param {number} teamSize
 * @returns {{ teams?: any; error?: string }}
 */
function normalizeTeams(allPlayers, payloadTeams, teamSize) {
  const alpha = payloadTeams?.alpha;
  const beta = payloadTeams?.beta;

  if (!alpha || !beta) {
    return { error: "Two teams are required to start the match." };
  }

  if (!Array.isArray(alpha.playerIds) || !Array.isArray(beta.playerIds)) {
    return { error: "Team player lists are invalid." };
  }

  if (alpha.playerIds.length !== teamSize || beta.playerIds.length !== teamSize) {
    return { error: `Each team must contain exactly ${teamSize} players.` };
  }

  const combined = [...alpha.playerIds, ...beta.playerIds];
  if (combined.length !== allPlayers.length || new Set(combined).size !== combined.length) {
    return { error: "Teams must contain every room player exactly once." };
  }

  if (!combined.every((playerId) => allPlayers.includes(playerId))) {
    return { error: "A team contains a player who is not in the room." };
  }

  if (!alpha.captainId || !alpha.playerIds.includes(alpha.captainId)) {
    return { error: "Alpha captain must belong to Alpha team." };
  }

  if (!beta.captainId || !beta.playerIds.includes(beta.captainId)) {
    return { error: "Beta captain must belong to Beta team." };
  }

  const alphaBatting = alpha.battingOrder ?? alpha.playerIds;
  const alphaBowling = alpha.bowlingOrder ?? alpha.playerIds;
  const betaBatting = beta.battingOrder ?? beta.playerIds;
  const betaBowling = beta.bowlingOrder ?? beta.playerIds;

  if (
    !isValidLineup(alphaBatting, alpha.playerIds) ||
    !isValidLineup(alphaBowling, alpha.playerIds) ||
    !isValidLineup(betaBatting, beta.playerIds) ||
    !isValidLineup(betaBowling, beta.playerIds)
  ) {
    return { error: "Batting or bowling order is invalid." };
  }

  return {
    teams: {
      alpha: {
        id: "alpha",
        name: normalizeText(alpha.name, "Alpha XI", HANDREX_RUNTIME_LIMITS.maxTeamNameLength),
        captainId: alpha.captainId,
        playerIds: [...alpha.playerIds],
        battingOrder: [...alphaBatting],
        bowlingOrder: [...alphaBowling],
      },
      beta: {
        id: "beta",
        name: normalizeText(beta.name, "Beta XI", HANDREX_RUNTIME_LIMITS.maxTeamNameLength),
        captainId: beta.captainId,
        playerIds: [...beta.playerIds],
        battingOrder: [...betaBatting],
        bowlingOrder: [...betaBowling],
      },
    },
  };
}

/**
 * @param {string[]} list
 * @param {string} fromId
 * @param {string} toId
 * @returns {string[]}
 */
function replacePlayerIdInList(list, fromId, toId) {
  return list.map((playerId) => (playerId === fromId ? toId : playerId));
}

/**
 * @param {Record<string, any>} record
 * @param {string} fromId
 * @param {string} toId
 * @returns {Record<string, any>}
 */
function replacePlayerIdInRecord(record, fromId, toId) {
  if (!Object.prototype.hasOwnProperty.call(record, fromId)) {
    return record;
  }

  const next = {
    ...record,
  };
  next[toId] = next[fromId];
  delete next[fromId];
  return next;
}

/**
 * @param {string | null} value
 * @param {string} fromId
 * @param {string} toId
 * @returns {string | null}
 */
function replaceSinglePlayerId(value, fromId, toId) {
  return value === fromId ? toId : value;
}

/**
 * @param {any} teams
 * @param {string} battingTeamId
 * @param {string} bowlingTeamId
 * @param {number} oversLimit
 * @param {string} matchMode
 * @param {number | null} [target]
 * @returns {any}
 */
function createInnings(teams, battingTeamId, bowlingTeamId, oversLimit, matchMode, target = null) {
  const battingTeam = teams[battingTeamId];
  const bowlingTeam = teams[bowlingTeamId];
  const strikerId = battingTeam.battingOrder[0] ?? null;
  const nonStrikerId = matchMode === "two-batsmen" ? battingTeam.battingOrder[1] ?? null : null;
  const currentBowlerId = bowlingTeam.bowlingOrder[0] ?? null;

  return {
    battingTeamId,
    bowlingTeamId,
    score: 0,
    wickets: 0,
    legalBalls: 0,
    ballsInOver: 0,
    oversLimit,
    target,
    completed: false,
    strikerId,
    nonStrikerId,
    currentBowlerId,
    nextBatterIndex: matchMode === "two-batsmen" ? 2 : 1,
    nextBowlerIndex: bowlingTeam.bowlingOrder.length > 1 ? 1 : 0,
    dismissedIds: [],
  };
}

/**
 * @param {any} innings
 * @param {any} battingTeam
 * @returns {string | null}
 */
function bringNextBatter(innings, battingTeam) {
  const nextBatterId = battingTeam.battingOrder[innings.nextBatterIndex] ?? null;

  // Keep the last remaining batter alive as a solo batter when no replacement is left.
  if (!nextBatterId) {
    if (innings.nonStrikerId) {
      innings.strikerId = innings.nonStrikerId;
      innings.nonStrikerId = null;
      return innings.strikerId;
    }

    innings.strikerId = null;
    return null;
  }

  innings.nextBatterIndex += 1;
  innings.strikerId = nextBatterId;
  return nextBatterId;
}

/**
 * @param {any} innings
 * @param {string} matchMode
 */
function swapStrike(innings, matchMode) {
  if (matchMode !== "two-batsmen" || !innings.strikerId || !innings.nonStrikerId) {
    return;
  }

  [innings.strikerId, innings.nonStrikerId] = [innings.nonStrikerId, innings.strikerId];
}

/**
 * @param {any} innings
 * @param {any} bowlingTeam
 */
function advanceBowler(innings, bowlingTeam) {
  if (!bowlingTeam.bowlingOrder.length) {
    innings.currentBowlerId = null;
    return;
  }

  innings.currentBowlerId =
    bowlingTeam.bowlingOrder[innings.nextBowlerIndex % bowlingTeam.bowlingOrder.length] ?? bowlingTeam.bowlingOrder[0];
  innings.nextBowlerIndex = (innings.nextBowlerIndex + 1) % bowlingTeam.bowlingOrder.length;
}

/**
 * @param {any} game
 * @returns {string[]}
 */
function getWaitingFor(game) {
  const innings = game.innings[game.currentInningsIndex];
  return [innings.strikerId, innings.currentBowlerId].filter(
    (playerId) => playerId && game.playerInputs[playerId] == null,
  );
}

/**
 * @param {any} game
 * @returns {any}
 */
function buildMatchResult(game) {
  const firstInnings = game.innings[0];
  const secondInnings = game.innings[1];

  if (secondInnings.target != null && secondInnings.score >= secondInnings.target) {
    const chasingTeam = game.teams[secondInnings.battingTeamId];
    const wicketsLeft = Math.max(chasingTeam.playerIds.length - secondInnings.wickets, 0);
    return {
      winnerTeamId: secondInnings.battingTeamId,
      loserTeamId: secondInnings.bowlingTeamId,
      marginText: `${chasingTeam.name} won by ${wicketsLeft} wicket${wicketsLeft === 1 ? "" : "s"}`,
      reason: "target_achieved",
      isTie: false,
    };
  }

  if (firstInnings.score === secondInnings.score) {
    return {
      winnerTeamId: null,
      loserTeamId: null,
      marginText: "Match tied",
      reason: "scores_level",
      isTie: true,
    };
  }

  const defendingWon = firstInnings.score > secondInnings.score;
  const winnerTeamId = defendingWon ? firstInnings.battingTeamId : secondInnings.battingTeamId;
  const loserTeamId = defendingWon ? firstInnings.bowlingTeamId : secondInnings.bowlingTeamId;
  const winnerTeam = game.teams[winnerTeamId];
  const marginRuns = Math.abs(firstInnings.score - secondInnings.score);

  return {
    winnerTeamId,
    loserTeamId,
    marginText: defendingWon
      ? `${winnerTeam.name} won by ${marginRuns} run${marginRuns === 1 ? "" : "s"}`
      : `${winnerTeam.name} won the chase`,
    reason: "higher_score",
    isTie: false,
  };
}

export class GameStore {
  constructor({ maxGames = HANDREX_RUNTIME_LIMITS.maxGames } = {}) {
    this.maxGames = maxGames;
    this.games = new Map();
    this.turnTimers = new Map();
  }

  countGames() {
    return this.games.size;
  }

  getStats() {
    const statuses = {};
    let liveGames = 0;

    this.games.forEach((game) => {
      statuses[game.status] = (statuses[game.status] ?? 0) + 1;
      if (game.status === "live") {
        liveGames += 1;
      }
    });

    return {
      total: this.games.size,
      liveGames,
      turnTimers: this.turnTimers.size,
      statuses,
    };
  }

  /**
   * @param {string} roomId
   * @returns {any | null}
   */
  getGame(roomId) {
    return this.games.get(roomId) ?? null;
  }

  /**
   * @param {string} roomId
   */
  clearTurnTimer(roomId) {
    const timer = this.turnTimers.get(roomId);
    if (!timer) {
      return;
    }

    clearTimeout(timer);
    this.turnTimers.delete(roomId);
  }

  /**
   * @param {string} roomId
   * @param {number} timeoutMs
   * @param {(payload: any) => void} onTimeout
   */
  startTurnTimer(roomId, timeoutMs, onTimeout) {
    this.clearTurnTimer(roomId);

    const timer = setTimeout(() => {
      this.turnTimers.delete(roomId);
      const game = this.getGame(roomId);

      if (!game || game.status !== "live" || getWaitingFor(game).length === 0) {
        return;
      }

      onTimeout({
        roomId,
        waitingFor: getWaitingFor(game),
      });
    }, timeoutMs);

    timer.unref?.();
    this.turnTimers.set(roomId, timer);
  }

  /**
   * @param {string} roomId
   */
  removeGame(roomId) {
    this.clearTurnTimer(roomId);
    this.games.delete(roomId);
  }

  /**
   * @param {{ now?: number; idleGameTtlMs?: number; completedRoomTtlMs?: number; hasRoom?: (roomId: string) => boolean; hasConnectedPlayers?: (roomId: string) => boolean }} [options]
   * @returns {{ roomId: string; reason: string }[]}
   */
  cleanupExpiredGames(options = {}) {
    const now = options.now ?? Date.now();
    const idleGameTtlMs = options.idleGameTtlMs ?? HANDREX_RUNTIME_LIMITS.idleGameTtlMs;
    const completedRoomTtlMs = options.completedRoomTtlMs ?? HANDREX_RUNTIME_LIMITS.completedRoomTtlMs;
    const hasRoom = options.hasRoom ?? (() => true);
    const hasConnectedPlayers = options.hasConnectedPlayers ?? (() => true);
    const removed = [];

    this.games.forEach((game, roomId) => {
      const updatedAt = game.updatedAt ?? game.createdAt ?? now;
      const idleFor = now - updatedAt;
      let reason = "";

      if (!hasRoom(roomId)) {
        reason = "orphaned_room";
      } else if (game.status === "complete" && idleFor > completedRoomTtlMs) {
        reason = "completed_ttl";
      } else if (idleFor > idleGameTtlMs && !hasConnectedPlayers(roomId)) {
        reason = "idle_game_ttl";
      }

      if (!reason) {
        return;
      }

      this.removeGame(roomId);
      removed.push({
        roomId,
        reason,
      });
    });

    return removed;
  }

  /**
   * Rebind a live player session from an old socket id to a new socket id so
   * refresh/reconnect can keep the same live match slot.
   *
   * @param {string} roomId
   * @param {string} oldSocketId
   * @param {string} newSocketId
   * @returns {any | null}
   */
  rebindPlayer(roomId, oldSocketId, newSocketId) {
    const game = this.getGame(roomId);

    if (!game || !oldSocketId || !newSocketId || oldSocketId === newSocketId) {
      return game;
    }

    Object.values(game.teams).forEach((team) => {
      team.playerIds = replacePlayerIdInList(team.playerIds, oldSocketId, newSocketId);
      team.battingOrder = replacePlayerIdInList(team.battingOrder, oldSocketId, newSocketId);
      team.bowlingOrder = replacePlayerIdInList(team.bowlingOrder, oldSocketId, newSocketId);
      team.captainId = replaceSinglePlayerId(team.captainId, oldSocketId, newSocketId);
    });

    game.innings.forEach((innings) => {
      innings.strikerId = replaceSinglePlayerId(innings.strikerId, oldSocketId, newSocketId);
      innings.nonStrikerId = replaceSinglePlayerId(innings.nonStrikerId, oldSocketId, newSocketId);
      innings.currentBowlerId = replaceSinglePlayerId(innings.currentBowlerId, oldSocketId, newSocketId);
      innings.dismissedIds = replacePlayerIdInList(innings.dismissedIds, oldSocketId, newSocketId);
    });

    game.playerInputs = replacePlayerIdInRecord(game.playerInputs, oldSocketId, newSocketId);
    game.ballHistory = game.ballHistory.map((ball) => ({
      ...ball,
      strikerId: replaceSinglePlayerId(ball.strikerId ?? null, oldSocketId, newSocketId),
      nonStrikerId: replaceSinglePlayerId(ball.nonStrikerId ?? null, oldSocketId, newSocketId),
      currentBowlerId: replaceSinglePlayerId(ball.currentBowlerId ?? null, oldSocketId, newSocketId),
      bowlerId: replaceSinglePlayerId(ball.bowlerId ?? null, oldSocketId, newSocketId),
    }));
    game.updatedAt = Date.now();

    return game;
  }

  /**
   * @param {{ room: any; settings?: any; tossWinnerId?: string | null; decision?: string | null; battingFirstPlayerId?: string | null; teams?: any }} options
   * @returns {{ game?: any; error?: string }}
   */
  createGame({ room, settings = {}, tossWinnerId = null, decision = null, battingFirstPlayerId = null, teams: payloadTeams = null }) {
    if (!room || room.players.length !== room.maxPlayers) {
      return { error: `Room needs ${room?.maxPlayers ?? 0} connected players before the match can start.` };
    }

    if (!this.games.has(room.roomId) && this.games.size >= this.maxGames) {
      return { error: "Realtime match capacity is full. Please try again in a moment." };
    }

    const normalizedTeams = normalizeTeams(
      room.players.map((player) => player.id),
      payloadTeams,
      room.teamSize,
    );

    if (normalizedTeams.error || !normalizedTeams.teams) {
      return { error: normalizedTeams.error ?? "Invalid team setup." };
    }

    const inputSettings = settings && typeof settings === "object" ? settings : {};
    const overs = clampInteger(inputSettings.overs, DEFAULT_OVERS, 1, HANDREX_RUNTIME_LIMITS.maxOvers);
    const inputTimeoutMs = clampInteger(
      inputSettings.inputTimeoutMs,
      DEFAULT_INPUT_TIMEOUT_MS,
      5000,
      HANDREX_RUNTIME_LIMITS.maxInputTimeoutMs,
    );
    const matchMode = inputSettings.matchMode === "single" ? "single" : "two-batsmen";
    const bowlingMode = inputSettings.bowlingMode === "free-change" ? "free-change" : "over-locked";
    const numberSet = resolveNumberSetSettings(inputSettings, room.settings ?? DEFAULT_NUMBER_SET);

    if (!numberSet.ok) {
      return { error: numberSet.error };
    }

    const battingFirstTeamId =
      battingFirstPlayerId && normalizedTeams.teams.alpha.playerIds.includes(battingFirstPlayerId)
        ? "alpha"
        : battingFirstPlayerId && normalizedTeams.teams.beta.playerIds.includes(battingFirstPlayerId)
          ? "beta"
          : tossWinnerId && normalizedTeams.teams.alpha.playerIds.includes(tossWinnerId)
            ? decision === "bowl"
              ? "beta"
              : "alpha"
            : tossWinnerId && normalizedTeams.teams.beta.playerIds.includes(tossWinnerId)
              ? decision === "bowl"
                ? "alpha"
                : "beta"
              : "alpha";
    const bowlingFirstTeamId = battingFirstTeamId === "alpha" ? "beta" : "alpha";

    const game = {
      roomId: room.roomId,
      status: "live",
      settings: {
        overs,
        inputTimeoutMs,
        matchMode,
        bowlingMode,
        ...numberSet.settings,
      },
      tossResult: room.tossResult
        ? {
            ...room.tossResult,
          }
        : null,
      teams: normalizedTeams.teams,
      currentInningsIndex: 0,
      innings: [
        createInnings(normalizedTeams.teams, battingFirstTeamId, bowlingFirstTeamId, overs, matchMode),
        createInnings(normalizedTeams.teams, bowlingFirstTeamId, battingFirstTeamId, overs, matchMode),
      ],
      currentTurn: "awaiting_inputs",
      playerInputs: {},
      ballHistory: [],
      result: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.games.set(room.roomId, game);
    return { game };
  }

  /**
   * @param {{ roomId: string; socketId: string; number: number }} options
   * @returns {{ game?: any; error?: string; readyForReveal?: boolean }}
   */
  submitInput({ roomId, socketId, number }) {
    const game = this.getGame(roomId);

    if (!game) {
      return { error: "Game not found." };
    }

    if (game.status !== "live") {
      return { error: "Match is not accepting inputs." };
    }

    if (!isValidPick(number, game.settings.allowedNumbers)) {
      return {
        error: `Invalid number. Choose one of: ${game.settings.allowedNumbers.join(", ")}.`,
      };
    }

    const innings = game.innings[game.currentInningsIndex];
    const activePlayers = [innings.strikerId, innings.currentBowlerId].filter(Boolean);

    if (!activePlayers.includes(socketId)) {
      return { error: "Player is not active for the current ball." };
    }

    if (Object.prototype.hasOwnProperty.call(game.playerInputs, socketId)) {
      return { error: "Input already locked for this ball." };
    }

    game.playerInputs[socketId] = number;
    game.updatedAt = Date.now();

    return {
      game,
      readyForReveal: getWaitingFor(game).length === 0,
    };
  }

  /**
   * @param {any} game
   * @returns {any}
   */
  serializeGame(game) {
    const innings = game.innings[game.currentInningsIndex];

    return {
      roomId: game.roomId,
      status: game.status,
      settings: game.settings,
      tossResult: game.tossResult,
      teams: game.teams,
      currentInningsIndex: game.currentInningsIndex,
      innings: game.innings.map((entry, index) => ({
        index,
        battingTeamId: entry.battingTeamId,
        bowlingTeamId: entry.bowlingTeamId,
        score: entry.score,
        wickets: entry.wickets,
        legalBalls: entry.legalBalls,
        overs: formatOvers(entry.legalBalls),
        ballsInOver: entry.ballsInOver,
        target: entry.target,
        completed: entry.completed,
        strikerId: entry.strikerId,
        nonStrikerId: entry.nonStrikerId,
        currentBowlerId: entry.currentBowlerId,
      })),
      currentTurn: {
        battingTeamId: innings.battingTeamId,
        bowlingTeamId: innings.bowlingTeamId,
        strikerId: innings.strikerId,
        nonStrikerId: innings.nonStrikerId,
        currentBowlerId: innings.currentBowlerId,
        waitingFor: getWaitingFor(game),
        inputsLocked: Object.fromEntries(
          Object.keys(game.teams).flatMap((teamId) =>
            game.teams[teamId].playerIds.map((playerId) => [playerId, game.playerInputs[playerId] != null]),
          ),
        ),
      },
      result: game.result,
      ballHistory: game.ballHistory,
      updatedAt: game.updatedAt,
    };
  }

  /**
   * @param {any} game
   * @param {{ message?: string; timeout?: boolean; inningsSwitched?: boolean }} [patch]
   * @returns {any}
   */
  createNextTurnPayload(game, patch = {}) {
    const innings = game.innings[game.currentInningsIndex];

    return {
      roomId: game.roomId,
      currentInningsIndex: game.currentInningsIndex,
      battingTeamId: innings.battingTeamId,
      bowlingTeamId: innings.bowlingTeamId,
      strikerId: innings.strikerId,
      nonStrikerId: innings.nonStrikerId,
      currentBowlerId: innings.currentBowlerId,
      score: innings.score,
      wickets: innings.wickets,
      legalBalls: innings.legalBalls,
      overs: formatOvers(innings.legalBalls),
      ballsInOver: innings.ballsInOver,
      target: innings.target,
      waitingFor: getWaitingFor(game),
      inputsLocked: Object.fromEntries(
        Object.keys(game.teams).flatMap((teamId) =>
          game.teams[teamId].playerIds.map((playerId) => [playerId, game.playerInputs[playerId] != null]),
        ),
      ),
      timeout: false,
      inningsSwitched: false,
      message: "Waiting for active players to lock numbers.",
      ...patch,
    };
  }

  /**
   * @param {string} roomId
   * @returns {{ game?: any; ballResult?: any; nextTurn?: any; matchEnd?: any; error?: string }}
   */
  resolveBall(roomId) {
    const game = this.getGame(roomId);

    if (!game) {
      return { error: "Game not found." };
    }

    const innings = game.innings[game.currentInningsIndex];
    const battingTeam = game.teams[innings.battingTeamId];
    const bowlingTeam = game.teams[innings.bowlingTeamId];
    const waitingFor = getWaitingFor(game);

    if (waitingFor.length > 0) {
      return { error: "Still waiting for the second input." };
    }

    if (!innings.strikerId || !innings.currentBowlerId) {
      return { error: "Active batter or bowler is missing." };
    }

    const battingNumber = game.playerInputs[innings.strikerId];
    const bowlingNumber = game.playerInputs[innings.currentBowlerId];

    if (!isValidPick(battingNumber, game.settings.allowedNumbers) || !isValidPick(bowlingNumber, game.settings.allowedNumbers)) {
      return { error: "Invalid locked number. Restart the current ball." };
    }

    const isOut = battingNumber === bowlingNumber;
    const runs = isOut ? 0 : battingNumber;
    const presentation = getBallPresentation({
      battingNumber,
      bowlingNumber,
      runs,
      isWicket: isOut,
      allowedNumbers: game.settings.allowedNumbers,
    });
    const over = Math.floor(innings.legalBalls / 6);
    const ball = innings.ballsInOver + 1;
    const resolvedStrikerId = innings.strikerId;
    const resolvedNonStrikerId = innings.nonStrikerId;
    const resolvedBowlerId = innings.currentBowlerId;

    if (isOut) {
      innings.wickets += 1;
      innings.dismissedIds.push(innings.strikerId);
      bringNextBatter(innings, battingTeam);
    } else {
      innings.score += runs;
      if (runs % 2 === 1) {
        swapStrike(innings, game.settings.matchMode);
      }
    }

    innings.legalBalls += 1;
    innings.ballsInOver += 1;

    if (innings.ballsInOver === 6) {
      innings.ballsInOver = 0;
      swapStrike(innings, game.settings.matchMode);
      advanceBowler(innings, bowlingTeam);
    }

    const targetAchieved = innings.target != null && innings.score >= innings.target;
    const oversCompleted = innings.legalBalls >= innings.oversLimit * 6;
    const allOut = innings.wickets >= Math.max(battingTeam.playerIds.length, 1) || !innings.strikerId;
    const inningsCompleted = targetAchieved || oversCompleted || allOut;
    innings.completed = inningsCompleted;

    const ballResult = {
      roomId,
      inningsIndex: game.currentInningsIndex,
      battingTeamId: innings.battingTeamId,
      bowlingTeamId: innings.bowlingTeamId,
      strikerId: resolvedStrikerId,
      nonStrikerId: resolvedNonStrikerId,
      currentBowlerId: resolvedBowlerId,
      battingNumber,
      bowlingNumber,
      resultType: isOut ? "out" : "run",
      runs,
      shotLabel: presentation.shotLabel,
      resultLabel: presentation.resultLabel,
      resultTone: presentation.resultTone,
      score: innings.score,
      wickets: innings.wickets,
      overs: formatOvers(innings.legalBalls),
      over,
      ball,
      target: innings.target,
      inningsEnded: inningsCompleted,
      matchEnded: false,
      commentary: presentation.commentary,
      timestamp: Date.now(),
    };

    game.ballHistory.push(ballResult);
    game.playerInputs = {};
    game.updatedAt = Date.now();

    if (targetAchieved) {
      game.status = "complete";
      game.currentTurn = "complete";
      game.result = buildMatchResult(game);
      ballResult.matchEnded = true;
      return {
        game,
        ballResult,
        matchEnd: this.createMatchEndPayload(game),
      };
    }

    if (inningsCompleted) {
      if (game.currentInningsIndex === 0) {
        const secondInnings = game.innings[1];
        secondInnings.target = innings.score + 1;
        game.currentInningsIndex = 1;
        game.currentTurn = "awaiting_inputs";

        return {
          game,
          ballResult,
          nextTurn: this.createNextTurnPayload(game, {
            inningsSwitched: true,
            message: `Innings break. Target is ${secondInnings.target}.`,
          }),
        };
      }

      game.status = "complete";
      game.currentTurn = "complete";
      game.result = buildMatchResult(game);
      ballResult.matchEnded = true;

      return {
        game,
        ballResult,
        matchEnd: this.createMatchEndPayload(game),
      };
    }

    game.currentTurn = "awaiting_inputs";
    return {
      game,
      ballResult,
      nextTurn: this.createNextTurnPayload(game, {
        message: "Next ball ready.",
      }),
    };
  }

  /**
   * @param {any} game
   * @returns {any}
   */
  createMatchEndPayload(game) {
    return {
      roomId: game.roomId,
      result: game.result,
      tossResult: game.tossResult,
      innings: game.innings.map((innings, index) => ({
        index,
        battingTeamId: innings.battingTeamId,
        bowlingTeamId: innings.bowlingTeamId,
        score: innings.score,
        wickets: innings.wickets,
        overs: formatOvers(innings.legalBalls),
        target: innings.target,
      })),
      history: game.ballHistory,
      finishedAt: Date.now(),
    };
  }
}
