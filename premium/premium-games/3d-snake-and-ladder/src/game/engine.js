import { PLAYER_COLORS, buildMovementPath } from "./board.js";
import { createBoardRuntime, getTransportForTileFromBoard } from "./board-presets.js";
import { getGameMode } from "./modes.js";
import { createPlayerStatus, getRandomPowerUp } from "./powerups.js";
import { getStartPosition, mergeRules, resolveRollTarget } from "./rules.js";
import {
  createMatchStats,
  finalizeMatchStats,
  recordEventTile,
  recordPowerUp,
  recordRoll,
  recordTile,
  recordTransport
} from "./stats.js";

export function sanitizePlayerName(name, fallback = "Player") {
  const clean = String(name || "")
    .replace(/[^\w\s.-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 24);
  return clean || fallback;
}

export function normalizeOnlineSettings(settings = {}) {
  const mode = getGameMode(settings.modeId);
  const modePreset = mode.id === "custom" ? settings.boardPresetId : mode.defaultPresetId;
  const runtime = createBoardRuntime(modePreset);
  return {
    playerCount: Math.min(4, Math.max(2, Number(settings.playerCount) || 2)),
    modeId: mode.id,
    boardPresetId: runtime.preset.id,
    rules: mergeRules(settings.rules),
    powerUpsEnabled: mode.id === "custom" ? Boolean(settings.powerUpsEnabled) : Boolean(mode.powerUps),
    eventTilesEnabled: mode.id === "custom" ? Boolean(settings.eventTilesEnabled) : Boolean(mode.eventTiles)
  };
}

export function createMatchState({ players, settings }) {
  const safeSettings = normalizeOnlineSettings(settings);
  const activeBoard = createBoardRuntime(safeSettings.boardPresetId);
  const startPosition = getStartPosition(safeSettings.rules);
  const matchPlayers = players.slice(0, safeSettings.playerCount).map((player, index) => ({
    id: player.id,
    name: sanitizePlayerName(player.name, player.type === "bot" ? `Royal Bot ${index + 1}` : `Player ${index + 1}`),
    color: PLAYER_COLORS[index],
    type: player.type || "human",
    personality: player.personality || null,
    displayBadges: player.type === "bot" ? ["BOT"] : [],
    connected: player.connected !== false,
    isHost: Boolean(player.isHost),
    position: startPosition,
    status: createPlayerStatus()
  }));

  const stats = createMatchStats(matchPlayers);
  stats.modeId = safeSettings.modeId;
  stats.finishTile = activeBoard.finishTile;
  matchPlayers.forEach((player) => recordTile(stats, player.id, player.position));

  const match = {
    gameStatus: "playing",
    settings: safeSettings,
    activeBoard,
    players: matchPlayers,
    currentPlayerIndex: 0,
    diceResult: null,
    diceState: "Ready",
    winner: null,
    gameLog: [],
    matchStats: stats,
    turnCount: 1,
    isResolving: false,
    startedAt: Date.now()
  };

  addMatchLog(match, `${getGameMode(safeSettings.modeId).label} started online.`, "system");
  normalizeTurnStart(match);
  return match;
}

export function resetMatchState(previousMatch, roomPlayers) {
  return createMatchState({
    players: roomPlayers,
    settings: previousMatch.settings
  });
}

export function getMatchSnapshot(match, room = null) {
  if (!match) return null;
  return {
    roomCode: room?.code || "",
    roomType: room?.type || "private",
    botFilled: Boolean(room?.botFilled),
    gameStatus: match.gameStatus,
    settings: match.settings,
    boardPresetId: match.activeBoard.preset.id,
    finishTile: match.activeBoard.finishTile,
    players: match.players.map((player) => ({
      id: player.id,
      name: player.name,
      color: player.color,
      type: player.type,
      personality: player.personality,
      displayBadges: player.displayBadges || [],
      connected: player.connected !== false,
      isHost: Boolean(player.isHost),
      position: player.position,
      status: { ...(player.status || createPlayerStatus()) }
    })),
    currentPlayerIndex: match.currentPlayerIndex,
    diceResult: match.diceResult,
    diceState: match.diceState,
    winner: match.winner ? { ...match.winner } : null,
    gameLog: [...match.gameLog],
    matchStats: match.matchStats,
    turnCount: match.turnCount,
    rematchVotes: room ? Object.fromEntries(room.rematchVotes || new Map()) : {}
  };
}

export function resolveMatchRoll(match, playerId, roll = rollDie()) {
  const player = getCurrentPlayer(match);
  if (!player || player.id !== playerId) {
    return { ok: false, error: "It is not your turn." };
  }
  if (match.gameStatus !== "playing" || match.winner) {
    return { ok: false, error: "This match is already finished." };
  }
  if (match.isResolving) {
    return { ok: false, error: "A move is already resolving." };
  }

  match.isResolving = true;
  match.diceResult = roll;
  match.diceState = "Moving...";
  recordRoll(match.matchStats, player.id, roll);
  match.turnCount = Math.max(1, match.matchStats.totalTurns || match.turnCount);
  addMatchLog(match, `${player.name} rolled ${roll}.`, "roll", { playerId: player.id });

  const sequence = [];
  const events = [];
  const finishTile = match.activeBoard.finishTile;
  const from = player.position;
  const targetResult = resolveRollTarget(from, roll, match.settings.rules, finishTile);

  if (!targetResult.allowed) {
    match.diceState = "Ready";
    addMatchLog(match, `${player.name} needs exact ${targetResult.needed} to finish.`, "warning", { playerId: player.id });
    events.push({ type: "warning", message: `Exact ${targetResult.needed} needed to finish.`, playerId: player.id });
    advanceTurn(match, false);
    events.push(...normalizeTurnStart(match));
    match.isResolving = false;
    return { ok: true, diceResult: roll, sequence, events, snapshot: getMatchSnapshot(match) };
  }

  if (targetResult.clamped) {
    addMatchLog(match, `${player.name} overshot and finishes at ${finishTile} because exact finish is OFF.`, "warning", { playerId: player.id });
  }

  pushMoveSegment(sequence, player, from, targetResult.target, "dice");
  setPlayerTile(match, player, targetResult.target);
  if (declareIfWinner(match, player)) {
    match.isResolving = false;
    return finishRollResult(match, roll, sequence, events);
  }

  resolveTransport(match, player, sequence, events);
  if (declareIfWinner(match, player)) {
    match.isResolving = false;
    return finishRollResult(match, roll, sequence, events);
  }

  const eventResult = resolveEventTile(match, player, sequence, events);
  if (declareIfWinner(match, player)) {
    match.isResolving = false;
    return finishRollResult(match, roll, sequence, events);
  }

  const extraTurn = (match.settings.rules.extraTurnOnSix && roll === 6) || eventResult.bonusRoll;
  advanceTurn(match, extraTurn, { reason: eventResult.bonusRoll ? "Bonus Roll!" : "Extra Turn!" });
  events.push(...normalizeTurnStart(match));
  match.isResolving = false;
  return finishRollResult(match, roll, sequence, events);
}

export function applyMatchPowerUp(match, playerId, { powerUpId, targetPlayerId } = {}) {
  const player = match.players.find((entry) => entry.id === playerId);
  if (!player) return { ok: false, error: "Player not found." };
  if (match.gameStatus !== "playing" || match.winner) return { ok: false, error: "The match is not active." };
  if (!match.settings.powerUpsEnabled) return { ok: false, error: "Power-ups are disabled for this match." };
  if (match.isResolving) return { ok: false, error: "Wait for the current move to finish." };
  if (player.status?.heldPowerUp !== powerUpId) return { ok: false, error: "That power-up is not available." };

  if (powerUpId === "shield") {
    return { ok: false, error: "Shield activates automatically when a snake is hit." };
  }
  if (powerUpId === "reroll") {
    return { ok: false, error: "Online reroll is disabled until the server pause flow is hardened." };
  }
  if (powerUpId !== "swap") {
    return { ok: false, error: "Unsupported power-up." };
  }
  if (getCurrentPlayer(match)?.id !== playerId) {
    return { ok: false, error: "Swap can only be used before your own roll." };
  }

  const target = match.players.find((entry) => entry.id === targetPlayerId);
  if (!target || target.id === player.id) return { ok: false, error: "Choose a valid swap target." };
  if (target.position === player.position) return { ok: false, error: "Players on the same tile cannot be swapped." };

  const playerTile = player.position;
  const targetTile = target.position;
  setPlayerTile(match, player, targetTile);
  setPlayerTile(match, target, playerTile);
  player.status.heldPowerUp = null;
  recordPowerUp(match.matchStats, player.id, "swap", "used");
  addMatchLog(match, `${player.name} swapped with ${target.name}.`, "swap", { playerId: player.id });
  return {
    ok: true,
    sequence: [{ type: "swap", playerId: player.id, targetPlayerId: target.id, from: playerTile, to: targetTile }],
    events: [{ type: "power", message: `${player.name} used Swap.`, playerId: player.id }],
    snapshot: getMatchSnapshot(match)
  };
}

export function addMatchLog(match, message, type = "info", meta = {}) {
  match.gameLog = [{
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    message,
    type,
    icon: getLogIcon(type),
    ...meta
  }, ...match.gameLog].slice(0, 50);
}

export function getCurrentPlayer(match) {
  return match.players[match.currentPlayerIndex] || null;
}

export function normalizeTurnStart(match) {
  const events = [];
  let guard = match.players.length;
  while (guard > 0) {
    guard -= 1;
    const player = getCurrentPlayer(match);
    if (!player?.status?.skipNextTurn || match.gameStatus !== "playing") break;
    player.status.skipNextTurn = false;
    addMatchLog(match, `${player.name} skipped this turn.`, "skip", { playerId: player.id });
    events.push({ type: "skip", message: `${player.name} skipped a turn.`, playerId: player.id });
    advanceTurn(match, false, { fromSkip: true });
  }
  match.diceState = "Ready";
  return events;
}

export function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function finishRollResult(match, roll, sequence, events) {
  return {
    ok: true,
    diceResult: roll,
    sequence,
    events,
    snapshot: getMatchSnapshot(match)
  };
}

function resolveTransport(match, player, sequence, events) {
  const transport = getTransportForTileFromBoard(match.activeBoard, player.position);
  if (!transport) return;

  if (transport.type === "snake" && hasSnakeProtection(player)) {
    const protection = consumeSnakeProtection(player);
    if (protection === "shield") recordPowerUp(match.matchStats, player.id, "shield", "used");
    addMatchLog(match, `${player.name}'s ${protection === "shield" ? "shield" : "safe tile"} blocked snake ${transport.from} -> ${transport.to}.`, "shield", { playerId: player.id });
    events.push({ type: "shield", message: "Shield Blocked Snake!", playerId: player.id, transport });
    return;
  }

  sequence.push({ type: "transport", playerId: player.id, transport });
  setPlayerTile(match, player, transport.to);
  recordTransport(match.matchStats, player.id, transport);
  addMatchLog(match, `${player.name} ${transport.type === "ladder" ? "climbed ladder" : "slid down snake"} ${transport.from} -> ${transport.to}.`, transport.type, { playerId: player.id });
  events.push({
    type: transport.type,
    message: transport.type === "ladder" ? `Ladder Boost! Climbed ${transport.from} -> ${transport.to}` : `Snake Slide! Slid ${transport.from} -> ${transport.to}`,
    playerId: player.id,
    transport
  });
}

function resolveEventTile(match, player, sequence, events) {
  if (!match.settings.eventTilesEnabled || !match.activeBoard.eventTilesMap?.size) {
    return { bonusRoll: false };
  }
  const eventType = match.activeBoard.eventTilesMap.get(player.position);
  if (!eventType) return { bonusRoll: false };

  recordEventTile(match.matchStats, player.id);

  if (eventType === "bonus") {
    addMatchLog(match, `${player.name} found a Bonus Roll tile.`, "bonus", { playerId: player.id });
    events.push({ type: "bonus", message: "Bonus Roll!", playerId: player.id });
    return { bonusRoll: true };
  }

  if (eventType === "backstep" || eventType === "forward") {
    const from = player.position;
    const delta = eventType === "forward" ? 3 : -3;
    const target = Math.min(match.activeBoard.finishTile, Math.max(getStartPosition(match.settings.rules), from + delta));
    sequence.push({ type: "eventMove", eventType, playerId: player.id, from, to: target, path: buildMovementPath(from, target) });
    setPlayerTile(match, player, target);
    addMatchLog(match, `${player.name} ${eventType === "forward" ? "jumped forward" : "stepped back"} to tile ${target}.`, "event", { playerId: player.id });
    events.push({ type: eventType, message: eventType === "forward" ? "Forward Jump!" : "Backstep!", playerId: player.id });
    return { bonusRoll: false };
  }

  if (eventType === "power") {
    if (match.settings.powerUpsEnabled && !player.status.heldPowerUp) {
      player.status.heldPowerUp = getRandomPowerUp();
      recordPowerUp(match.matchStats, player.id, player.status.heldPowerUp, "gained");
      addMatchLog(match, `${player.name} gained ${player.status.heldPowerUp}.`, "power", { playerId: player.id });
      events.push({ type: "power", message: `${player.name} gained a power-up.`, playerId: player.id, powerUpId: player.status.heldPowerUp });
    }
    return { bonusRoll: false };
  }

  if (eventType === "safe") {
    player.status.safeTile = true;
    player.status.safeTurns = 2;
    addMatchLog(match, `${player.name} gained one-turn snake protection.`, "shield", { playerId: player.id });
    events.push({ type: "shield", message: "Safe Tile!", playerId: player.id });
    return { bonusRoll: false };
  }

  if (eventType === "trap") {
    player.status.skipNextTurn = true;
    addMatchLog(match, `${player.name} triggered a Trap Tile and will skip the next turn.`, "skip", { playerId: player.id });
    events.push({ type: "warning", message: "Trap Tile!", playerId: player.id });
  }

  return { bonusRoll: false };
}

function advanceTurn(match, extraTurn, context = {}) {
  const player = getCurrentPlayer(match);
  if (player) finishTurnStatus(player);
  if (match.gameStatus !== "playing") return;

  if (extraTurn && !context.fromSkip) {
    match.diceState = context.reason || "Extra Turn!";
    addMatchLog(match, `${player.name} gets an extra turn.`, "bonus", { playerId: player.id });
    return;
  }

  match.currentPlayerIndex = (match.currentPlayerIndex + 1) % match.players.length;
  match.turnCount = Math.max(1, (match.matchStats?.totalTurns || 0) + 1);
  match.diceState = "Ready";
}

function finishTurnStatus(player) {
  if (!player?.status) return;
  player.status.rerollUsedThisTurn = false;
  if (player.status.safeTurns > 0) {
    player.status.safeTurns -= 1;
    if (player.status.safeTurns <= 0) player.status.safeTile = false;
  }
}

function declareIfWinner(match, player) {
  if (player.position !== match.activeBoard.finishTile) return false;
  match.gameStatus = "won";
  match.winner = {
    id: player.id,
    name: player.name,
    color: player.color,
    type: player.type,
    position: player.position
  };
  match.diceState = "Victory";
  finalizeMatchStats(match.matchStats, match.players, player.id, {
    modeId: match.settings.modeId,
    finishTile: match.activeBoard.finishTile
  });
  addMatchLog(match, `${player.name} reached tile ${match.activeBoard.finishTile} and won the match.`, "victory", { playerId: player.id });
  return true;
}

function pushMoveSegment(sequence, player, from, to, reason) {
  sequence.push({
    type: "move",
    reason,
    playerId: player.id,
    from,
    to,
    path: buildMovementPath(from, to)
  });
}

function setPlayerTile(match, player, tile) {
  player.position = tile;
  recordTile(match.matchStats, player.id, tile);
}

function hasSnakeProtection(player) {
  return player.status?.heldPowerUp === "shield" || player.status?.safeTile;
}

function consumeSnakeProtection(player) {
  if (player.status.heldPowerUp === "shield") {
    player.status.heldPowerUp = null;
    return "shield";
  }
  if (player.status.safeTile) {
    player.status.safeTile = false;
    player.status.safeTurns = 0;
    return "safe";
  }
  return "";
}

function getLogIcon(type) {
  return {
    roll: "Dice",
    ladder: "Ladder",
    snake: "Snake",
    warning: "Warn",
    victory: "Crown",
    bonus: "Bonus",
    bot: "Bot",
    system: "Info",
    power: "Power",
    event: "Event",
    swap: "Swap",
    skip: "Skip",
    shield: "Shield"
  }[type] || "Log";
}
