import { PLAYER_META, STATUS } from '../src/ludo/constants.js';
import { ROOM_STATUS } from './roomStore.js';
import { isValidTokenId } from './security.js';

function tokenNumber(tokenId) {
  return Number(String(tokenId).split('-')[1]) + 1;
}

function playerLabel(playerId) {
  return PLAYER_META[playerId]?.label || playerId;
}

function requirePlayingRoom(room) {
  if (!room || room.status === ROOM_STATUS.CLOSED) {
    return { ok: false, message: 'Room not found.' };
  }
  if (room.status === ROOM_STATUS.PAUSED) {
    return { ok: false, message: 'Match is paused.' };
  }
  if (room.status !== ROOM_STATUS.PLAYING || !room.game) {
    return { ok: false, message: 'Match has not started.' };
  }
  return { ok: true };
}

function requireCurrentPlayer(room, socketId) {
  const player = room.players.find((candidate) => candidate.socketId === socketId);
  if (!player || !player.connected) {
    return { ok: false, message: 'Player is not connected.' };
  }
  if (player.playerId !== room.game.state.currentPlayer) {
    return { ok: false, message: 'It is not your turn.' };
  }
  return { ok: true, player };
}

function requireCurrentPlayerId(room, playerId, { allowBot = false } = {}) {
  const player = room.players.find((candidate) => candidate.playerId === playerId);
  if (!player) {
    return { ok: false, message: 'Player is not seated.' };
  }
  if (player.controller === 'server-bot' && !allowBot) {
    return { ok: false, message: 'Bot actions are server controlled.' };
  }
  if (player.controller !== 'server-bot' && !player.connected) {
    return { ok: false, message: 'Player is not connected.' };
  }
  if (player.playerId !== room.game.state.currentPlayer) {
    return { ok: false, message: 'It is not your turn.' };
  }
  return { ok: true, player };
}

function syncRoomFromGame(room) {
  room.gameSnapshot = room.game.snapshot();
  room.currentPlayer = room.gameSnapshot.currentPlayer;
  room.diceState = {
    value: room.gameSnapshot.diceValue,
    lastValue: room.gameSnapshot.lastDiceValue,
    rolled: room.gameSnapshot.diceRolled
  };
  room.winner = room.gameSnapshot.winner;
  if (room.winner) {
    room.status = ROOM_STATUS.FINISHED;
    room.matchEndedAt = Date.now();
    room.turnDeadlineAt = null;
    room.turnStartedAt = null;
  }
}

export function rollDiceForRoom(room, socketId, store) {
  const roomCheck = requirePlayingRoom(room);
  if (!roomCheck.ok) {
    return roomCheck;
  }
  const turnCheck = requireCurrentPlayer(room, socketId);
  if (!turnCheck.ok) {
    return turnCheck;
  }
  return rollDiceForPlayer(room, turnCheck.player.playerId, store, { allowBot: false });
}

export function rollDiceForPlayer(room, playerId, store, { allowBot = false } = {}) {
  const roomCheck = requirePlayingRoom(room);
  if (!roomCheck.ok) {
    return roomCheck;
  }
  const turnCheck = requireCurrentPlayerId(room, playerId, { allowBot });
  if (!turnCheck.ok) {
    return turnCheck;
  }
  if (room.game.state.phase !== STATUS.AWAITING_ROLL) {
    return { ok: false, message: 'Dice already rolled.' };
  }

  const result = room.game.rollDice();
  if (!result.ok) {
    return result;
  }

  room.sequence += 1;
  syncRoomFromGame(room);
  if (!room.winner && room.game.state.phase === STATUS.AWAITING_ROLL) {
    store.resetTurnTimer(room);
  }
  store.touch(room);
  store.appendEvent(room, `${playerLabel(playerId)} rolled ${result.diceValue}.`);
  if (result.legalMoves.length === 0) {
    store.appendEvent(room, `${playerLabel(playerId)} had no valid move.`);
  }

  const action = {
    type: result.legalMoves.length === 0 ? 'noValidMoves' : 'diceRolled',
    sequence: room.sequence,
    playerId,
    diceValue: result.diceValue,
    legalMoves: result.legalMoves,
    autoPass: Boolean(result.autoPass),
    keptTurn: Boolean(result.keptTurn),
    snapshot: room.gameSnapshot,
    message: result.message
  };
  store.appendAction(room, action);
  return { ok: true, room, action };
}

export function moveTokenForRoom(room, socketId, tokenId, store) {
  const roomCheck = requirePlayingRoom(room);
  if (!roomCheck.ok) {
    return roomCheck;
  }
  const turnCheck = requireCurrentPlayer(room, socketId);
  if (!turnCheck.ok) {
    return turnCheck;
  }
  return moveTokenForPlayer(room, turnCheck.player.playerId, tokenId, store, { allowBot: false });
}

export function moveTokenForPlayer(room, playerId, tokenId, store, { allowBot = false } = {}) {
  const roomCheck = requirePlayingRoom(room);
  if (!roomCheck.ok) {
    return roomCheck;
  }
  const turnCheck = requireCurrentPlayerId(room, playerId, { allowBot });
  if (!turnCheck.ok) {
    return turnCheck;
  }
  if (room.game.state.phase !== STATUS.AWAITING_TOKEN) {
    return { ok: false, message: 'Roll before moving a token.' };
  }
  if (!isValidTokenId(tokenId)) {
    return { ok: false, message: 'Invalid token.' };
  }
  const token = room.game.getToken(tokenId);
  if (!token || token.playerId !== turnCheck.player.playerId) {
    return { ok: false, message: 'That token does not belong to you.' };
  }

  const result = room.game.moveToken(tokenId);
  if (!result.ok) {
    return { ok: false, message: result.message };
  }

  room.sequence += 1;
  syncRoomFromGame(room);
  if (!room.winner) {
    store.resetTurnTimer(room);
  }
  store.touch(room);
  const label = playerLabel(result.playerId);
  store.appendEvent(room, `${label} moved token ${tokenNumber(result.tokenId)}.`);
  if (result.captures.length) {
    const capturedLabels = [...new Set(result.captures.map((capture) => playerLabel(capture.playerId)))].join(', ');
    store.appendEvent(room, `${label} captured ${capturedLabels}.`, 'capture');
  }
  if (result.reachedHome) {
    store.appendEvent(room, `${label} reached home.`, 'success');
  }
  if (result.winner) {
    store.appendEvent(room, `${label} wins.`, 'success');
  }

  const action = {
    type: 'tokenMoved',
    sequence: room.sequence,
    playerId: result.playerId,
    tokenId: result.tokenId,
    diceValue: result.diceValue,
    path: result.path,
    captures: result.captures,
    reachedHome: result.reachedHome,
    winner: result.winner,
    extraTurn: result.extraTurn,
    snapshot: room.gameSnapshot,
    message: result.message
  };
  store.appendAction(room, action);
  return { ok: true, room, action };
}

export function validateRoll(room, socketId) {
  const roomCheck = requirePlayingRoom(room);
  if (!roomCheck.ok) {
    return roomCheck;
  }
  const turnCheck = requireCurrentPlayer(room, socketId);
  if (!turnCheck.ok) {
    return turnCheck;
  }
  return room.game.state.phase === STATUS.AWAITING_ROLL
    ? { ok: true }
    : { ok: false, message: 'Dice already rolled.' };
}

export function validateMove(room, socketId, tokenId) {
  const roomCheck = requirePlayingRoom(room);
  if (!roomCheck.ok) {
    return roomCheck;
  }
  const turnCheck = requireCurrentPlayer(room, socketId);
  if (!turnCheck.ok) {
    return turnCheck;
  }
  if (!isValidTokenId(tokenId)) {
    return { ok: false, message: 'Invalid token.' };
  }
  const token = room.game.getToken(tokenId);
  if (!token || token.playerId !== turnCheck.player.playerId) {
    return { ok: false, message: 'That token does not belong to you.' };
  }
  const legal = room.game.state.availableMoves.some((move) => move.tokenId === tokenId);
  return legal ? { ok: true } : { ok: false, message: 'Illegal token move.' };
}
