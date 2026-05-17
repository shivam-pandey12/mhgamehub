import { randomUUID } from 'node:crypto';

import { PLAYER_IDS, PLAYER_META, PLAYER_SETS } from '../src/ludo/constants.js';
import { LudoGame } from '../src/ludo/rules.js';
import {
  ROOM_CODE_ALPHABET,
  normalizePlayerCount,
  normalizePreferredColor,
  normalizeRoomCode,
  sanitizeDisplayName
} from './security.js';

export const ROOM_STATUS = Object.freeze({
  LOBBY: 'lobby',
  COUNTDOWN: 'countdown',
  PLAYING: 'playing',
  PAUSED: 'paused',
  FINISHED: 'finished',
  CLOSED: 'closed'
});

export const ROOM_LIMITS = Object.freeze({
  eventLog: 15,
  actionLog: 15,
  disconnectedGraceMs: 3 * 60 * 1000,
  countdownStaleMs: 30 * 1000,
  emptyLobbyMs: 15 * 60 * 1000,
  finishedMs: 45 * 60 * 1000,
  pausedMs: 20 * 60 * 1000
});

export const REMATCH_LIMITS = Object.freeze({
  voteMs: 30 * 1000
});

export const TURN_TIMER = Object.freeze({
  durationMs: 60 * 1000
});

export const REMATCH_STATUS = Object.freeze({
  IDLE: 'idle',
  VOTING: 'voting',
  ACCEPTED: 'accepted',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled'
});

function nowLabel(elapsedMs = 0) {
  const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function createRoomCode(existingCodes = new Set(), rng = Math.random) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    let suffix = '';
    for (let index = 0; index < 4; index += 1) {
      suffix += ROOM_CODE_ALPHABET[Math.floor(rng() * ROOM_CODE_ALPHABET.length)];
    }
    const code = `LUDO-${suffix}`;
    if (!existingCodes.has(code)) {
      return code;
    }
  }
  throw new Error('Unable to create a unique room code.');
}

export function getActivePlayers(playerCount = 2) {
  return [...(PLAYER_SETS[normalizePlayerCount(playerCount)] || PLAYER_SETS[2])];
}

export function getAvailableSeat(room, preferredColor = null) {
  const activePlayers = getActivePlayers(room.playerCount);
  const occupied = new Set(room.players.map((player) => player.playerId));
  if (preferredColor && activePlayers.includes(preferredColor) && !occupied.has(preferredColor)) {
    return preferredColor;
  }
  return activePlayers.find((playerId) => !occupied.has(playerId)) || null;
}

export function assignPreferredSeats(playerCount = 2, entries = []) {
  const activePlayers = getActivePlayers(playerCount);
  const occupied = new Set();
  return entries.map((entry, index) => {
    const preferred = entry.preferredColor || entry.playerId;
    const playerId = preferred && activePlayers.includes(preferred) && !occupied.has(preferred)
      ? preferred
      : activePlayers.find((candidate) => !occupied.has(candidate));
    if (!playerId) {
      return null;
    }
    occupied.add(playerId);
    return {
      ...entry,
      playerId,
      seatIndex: index
    };
  });
}

export function canStartRoom(room, sessionId) {
  if (!room || room.status !== ROOM_STATUS.LOBBY) {
    return { ok: false, message: 'Room is not in the lobby.' };
  }
  if (room.hostPlayerSessionId !== sessionId) {
    return { ok: false, message: 'Only the host can start the match.' };
  }
  const activePlayers = getActivePlayers(room.playerCount);
  const seatedPlayers = room.players.filter((player) => activePlayers.includes(player.playerId));
  if (seatedPlayers.length < activePlayers.length) {
    return { ok: false, message: 'Waiting for all seats to fill.' };
  }
  const unready = seatedPlayers.filter((player) => player.controller !== 'server-bot' && !player.isHost && !player.ready);
  if (unready.length) {
    return { ok: false, message: 'Waiting for all players to be ready.' };
  }
  return { ok: true };
}

export class RoomStore {
  constructor({ rng = Math.random, now = Date.now } = {}) {
    this.rng = rng;
    this.now = now;
    this.rooms = new Map();
    this.roomCodeToRoomId = new Map();
    this.socketToRoomCode = new Map();
    this.socketToSession = new Map();
  }

  createRoom({ socketId, sessionId, displayName, preferredColor = 'red', playerCount = 2 } = {}) {
    if (!socketId || !sessionId) {
      return { ok: false, message: 'Missing player session.' };
    }

    const normalizedCount = normalizePlayerCount(playerCount, 2);
    const roomCode = createRoomCode(new Set(this.roomCodeToRoomId.keys()), this.rng);
    const roomId = randomUUID();
    const createdAt = this.now();
    const playerId = getActivePlayers(normalizedCount).includes(preferredColor) ? preferredColor : getActivePlayers(normalizedCount)[0];
    const player = this.createPlayer({
      socketId,
      sessionId,
      displayName,
      playerId,
      isHost: true,
      joinedAt: createdAt
    });
    const room = {
      roomId,
      roomCode,
      hostPlayerSessionId: sessionId,
      status: ROOM_STATUS.LOBBY,
      createdAt,
      updatedAt: createdAt,
      playerCount: normalizedCount,
      activePlayers: getActivePlayers(normalizedCount),
      players: [player],
      readyStates: { [sessionId]: true },
      matchConfig: {
        mode: 'online',
        botFill: false
      },
      currentPlayer: null,
      diceState: {
        value: null,
        rolled: false
      },
      game: null,
      gameSnapshot: null,
      actionLog: [],
      eventLog: [],
      sequence: 0,
      winner: null,
      matchStartedAt: null,
      matchEndedAt: null,
      turnStartedAt: null,
      turnDeadlineAt: null,
      turnDurationMs: TURN_TIMER.durationMs
    };
    this.initializeRematchState(room);

    this.appendEvent(room, 'Room created.');
    this.rooms.set(roomId, room);
    this.roomCodeToRoomId.set(roomCode, roomId);
    this.bindSocket(roomCode, socketId, sessionId);
    return { ok: true, room };
  }

  createPlayer({
    socketId,
    sessionId,
    displayName,
    playerId,
    isHost = false,
    joinedAt = this.now(),
    controller = 'online-human',
    botProfile = null,
    connected = true
  }) {
    return {
      playerSessionId: sessionId,
      socketId: socketId || null,
      displayName: sanitizeDisplayName(displayName, PLAYER_META[playerId]?.label || 'Player'),
      playerId,
      controller,
      botProfile,
      connected,
      ready: Boolean(isHost),
      joinedAt,
      lastSeen: joinedAt,
      isHost
    };
  }

  bindSocket(roomCode, socketId, sessionId) {
    this.socketToRoomCode.set(socketId, roomCode);
    this.socketToSession.set(socketId, sessionId);
  }

  unbindSocket(socketId) {
    this.socketToRoomCode.delete(socketId);
    this.socketToSession.delete(socketId);
  }

  getRoom(roomCode) {
    const normalized = normalizeRoomCode(roomCode);
    const roomId = this.roomCodeToRoomId.get(normalized);
    return roomId ? this.rooms.get(roomId) : null;
  }

  getRoomBySocket(socketId) {
    const roomCode = this.socketToRoomCode.get(socketId);
    return roomCode ? this.getRoom(roomCode) : null;
  }

  getPlayer(room, sessionId) {
    return room?.players.find((player) => player.playerSessionId === sessionId) || null;
  }

  getPlayerBySocket(room, socketId) {
    return room?.players.find((player) => player.socketId === socketId) || null;
  }

  joinRoom({ roomCode, socketId, sessionId, displayName, preferredColor = null } = {}) {
    const room = this.getRoom(roomCode);
    if (!room || room.status === ROOM_STATUS.CLOSED) {
      return { ok: false, message: 'Room not found.' };
    }
    if (room.status !== ROOM_STATUS.LOBBY) {
      return { ok: false, message: 'Match already started.' };
    }

    const existing = this.getPlayer(room, sessionId);
    if (existing) {
      existing.socketId = socketId;
      existing.connected = true;
      existing.lastSeen = this.now();
      existing.displayName = sanitizeDisplayName(displayName, existing.displayName);
      this.bindSocket(room.roomCode, socketId, sessionId);
      this.appendEvent(room, `${existing.displayName} rejoined.`);
      return { ok: true, room, player: existing };
    }

    const seat = getAvailableSeat(room, preferredColor);
    if (!seat) {
      return { ok: false, message: 'Room is full.' };
    }

    const player = this.createPlayer({
      socketId,
      sessionId,
      displayName,
      playerId: seat,
      joinedAt: this.now()
    });
    room.players.push(player);
    room.readyStates[sessionId] = false;
    this.touch(room);
    this.bindSocket(room.roomCode, socketId, sessionId);
    this.appendEvent(room, `${player.displayName} joined as ${PLAYER_META[seat].label}.`);
    return { ok: true, room, player };
  }

  reconnectToRoom({ roomCode, socketId, sessionId } = {}) {
    const room = this.getRoom(roomCode);
    if (!room || room.status === ROOM_STATUS.CLOSED) {
      return { ok: false, message: 'Reconnect failed. Room is no longer available.' };
    }
    const player = this.getPlayer(room, sessionId);
    if (!player) {
      return { ok: false, message: 'Reconnect failed. Seat was not found.' };
    }

    player.socketId = socketId;
    player.connected = true;
    player.lastSeen = this.now();
    this.bindSocket(room.roomCode, socketId, sessionId);
    if (room.status === ROOM_STATUS.PAUSED && player.isHost) {
      room.status = ROOM_STATUS.PLAYING;
      this.appendEvent(room, 'Host reconnected. Match resumed.');
    } else if (room.status === ROOM_STATUS.PAUSED && room.roomType === 'public') {
      const allConnected = room.players
        .filter((candidate) => room.activePlayers.includes(candidate.playerId) && candidate.controller !== 'server-bot')
        .every((candidate) => candidate.connected || candidate.playerSessionId === sessionId);
      if (allConnected) {
        room.status = ROOM_STATUS.PLAYING;
        this.appendEvent(room, 'Player reconnected. Public match resumed.');
      } else {
        this.appendEvent(room, `${player.displayName} reconnected.`);
      }
    } else {
      this.appendEvent(room, `${player.displayName} reconnected.`);
    }
    this.touch(room);
    return { ok: true, room, player };
  }

  setReady(roomCode, sessionId, ready) {
    const room = this.getRoom(roomCode);
    if (!room || room.status !== ROOM_STATUS.LOBBY) {
      return { ok: false, message: 'Ready state is unavailable.' };
    }
    const player = this.getPlayer(room, sessionId);
    if (!player) {
      return { ok: false, message: 'Player not found.' };
    }
    if (player.isHost) {
      return { ok: true, room };
    }
    player.ready = Boolean(ready);
    room.readyStates[sessionId] = player.ready;
    this.touch(room);
    this.appendEvent(room, `${player.displayName} is ${player.ready ? 'ready' : 'not ready'}.`);
    return { ok: true, room };
  }

  updateLobbyConfig(roomCode, sessionId, config = {}) {
    const room = this.getRoom(roomCode);
    if (!room || room.status !== ROOM_STATUS.LOBBY) {
      return { ok: false, message: 'Lobby settings are unavailable.' };
    }
    if (room.hostPlayerSessionId !== sessionId) {
      return { ok: false, message: 'Only the host can change lobby settings.' };
    }
    const nextCount = normalizePlayerCount(config.playerCount, room.playerCount);
    const currentSeats = new Set(room.players.map((player) => player.playerId));
    const nextActive = getActivePlayers(nextCount);
    const hasOutsideSeat = [...currentSeats].some((playerId) => !nextActive.includes(playerId));
    if (hasOutsideSeat) {
      return { ok: false, message: 'Player count cannot remove an occupied seat.' };
    }
    room.playerCount = nextCount;
    room.activePlayers = nextActive;
    this.touch(room);
    this.appendEvent(room, `Room set to ${nextCount} players.`);
    return { ok: true, room };
  }

  startMatch(roomCode, sessionId) {
    const room = this.getRoom(roomCode);
    const canStart = canStartRoom(room, sessionId);
    if (!canStart.ok) {
      return canStart;
    }

    room.status = ROOM_STATUS.PLAYING;
    room.game = new LudoGame(room.playerCount);
    room.gameSnapshot = room.game.snapshot();
    room.currentPlayer = room.gameSnapshot.currentPlayer;
    room.diceState = {
      value: null,
      rolled: false
    };
    room.matchStartedAt = this.now();
    this.resetTurnTimer(room);
    room.sequence += 1;
    room.botTurnVersion += 1;
    this.initializeRematchState(room);
    this.touch(room);
    this.appendEvent(room, 'Match started.');
    this.appendAction(room, {
      type: 'matchStarted',
      snapshot: room.gameSnapshot
    });
    return { ok: true, room };
  }

  createPublicRoomFromQueue({ entries = [], playerCount = 2, countdownMs = 5000 } = {}) {
    const normalizedCount = normalizePlayerCount(playerCount, 2);
    const seatedEntries = assignPreferredSeats(normalizedCount, entries);
    if (seatedEntries.length !== normalizedCount || seatedEntries.some((entry) => !entry)) {
      return { ok: false, message: 'Unable to assign seats for public match.' };
    }

    const roomCode = createRoomCode(new Set(this.roomCodeToRoomId.keys()), this.rng);
    const roomId = randomUUID();
    const createdAt = this.now();
    const countdownEndsAt = createdAt + Math.max(1000, Number(countdownMs) || 5000);
    const players = seatedEntries.map((entry) => this.createPlayer({
      socketId: entry.socketId,
      sessionId: entry.sessionId,
      displayName: entry.displayName,
      playerId: entry.playerId,
      isHost: false,
      joinedAt: createdAt,
      controller: entry.controller || 'online-human',
      botProfile: entry.botProfile || null,
      connected: entry.controller === 'server-bot' ? false : entry.connected !== false
    })).map((player) => ({
      ...player,
      ready: true,
      isHost: false
    }));

    const room = {
      roomId,
      roomCode,
      roomType: 'public',
      source: 'matchmaking',
      hostPlayerSessionId: 'server',
      status: ROOM_STATUS.COUNTDOWN,
      createdAt,
      updatedAt: createdAt,
      playerCount: normalizedCount,
      activePlayers: getActivePlayers(normalizedCount),
      players,
      readyStates: Object.fromEntries(players.map((player) => [player.playerSessionId, true])),
      matchConfig: {
        mode: 'online',
        botFill: seatedEntries.some((entry) => entry.controller === 'server-bot'),
        publicMatch: true,
        matchSpeed: seatedEntries[0]?.matchSpeed || 'normal',
        botFillMode: seatedEntries[0]?.botFillMode || 'off'
      },
      currentPlayer: null,
      diceState: {
        value: null,
        rolled: false
      },
      game: null,
      gameSnapshot: null,
      actionLog: [],
      eventLog: [],
      sequence: 0,
      winner: null,
      matchStartedAt: null,
      matchEndedAt: null,
      turnStartedAt: null,
      turnDeadlineAt: null,
      turnDurationMs: TURN_TIMER.durationMs,
      countdownStartedAt: createdAt,
      countdownEndsAt,
      queueIds: seatedEntries.map((entry) => entry.queueId),
      matchmakingOptions: {
        playerCount: normalizedCount,
        botFillAllowed: seatedEntries.some((entry) => entry.controller === 'server-bot'),
        botFillMode: seatedEntries[0]?.botFillMode || 'off',
        botDifficulty: seatedEntries[0]?.botDifficulty || 'medium',
        botPersonality: seatedEntries[0]?.botPersonality || 'balanced',
        matchSpeed: seatedEntries[0]?.matchSpeed || 'normal'
      }
    };
    this.initializeRematchState(room);

    this.appendEvent(room, room.matchConfig.botFill
      ? 'Match found. Filled remaining seats with bots.'
      : 'Match found. Countdown started.', 'success');
    this.rooms.set(roomId, room);
    this.roomCodeToRoomId.set(roomCode, roomId);
    players
      .filter((player) => player.controller !== 'server-bot' && player.socketId)
      .forEach((player) => this.bindSocket(roomCode, player.socketId, player.playerSessionId));
    return { ok: true, room };
  }

  startPublicMatch(roomCode) {
    const room = this.getRoom(roomCode);
    if (!room || room.status !== ROOM_STATUS.COUNTDOWN || room.roomType !== 'public') {
      return { ok: false, message: 'Public match is not ready to start.' };
    }
    const connectedHumans = room.players.filter((player) => player.controller !== 'server-bot' && player.connected);
    const humanSeats = room.players.filter((player) => player.controller !== 'server-bot');
    if (connectedHumans.length < humanSeats.length) {
      return { ok: false, message: 'A player disconnected before the match started.' };
    }

    room.status = ROOM_STATUS.PLAYING;
    room.game = new LudoGame(room.playerCount);
    room.gameSnapshot = room.game.snapshot();
    room.currentPlayer = room.gameSnapshot.currentPlayer;
    room.diceState = {
      value: null,
      rolled: false
    };
    room.matchStartedAt = this.now();
    this.resetTurnTimer(room);
    room.sequence += 1;
    room.botTurnVersion += 1;
    this.initializeRematchState(room);
    this.touch(room);
    this.appendEvent(room, 'Public match started.', 'success');
    this.appendAction(room, {
      type: 'matchStarted',
      snapshot: room.gameSnapshot
    });
    return { ok: true, room };
  }

  leaveRoom(roomCode, sessionId) {
    const room = this.getRoom(roomCode);
    if (!room) {
      return { ok: true, closed: true };
    }
    const player = this.getPlayer(room, sessionId);
    if (!player) {
      return { ok: true, room };
    }

    if (room.status === ROOM_STATUS.LOBBY) {
      if (player.isHost) {
        this.closeRoom(room, 'Host left. Room closed.');
        return { ok: true, room, closed: true };
      }
      room.players = room.players.filter((candidate) => candidate.playerSessionId !== sessionId);
      delete room.readyStates[sessionId];
      this.appendEvent(room, `${player.displayName} left the room.`);
      this.touch(room);
      return { ok: true, room };
    }

    if (room.status === ROOM_STATUS.COUNTDOWN) {
      this.closeRoom(room, `${player.displayName} left before the public match started.`);
      return { ok: true, room, closed: true };
    }

    if (player.controller === 'server-bot') {
      return { ok: true, room };
    }

    player.connected = false;
    player.lastSeen = this.now();
    if (room.roomType === 'public' && room.status === ROOM_STATUS.PLAYING) {
      room.status = ROOM_STATUS.PAUSED;
      this.appendEvent(room, `${player.displayName} disconnected. Match paused.`, 'danger');
    } else if (player.isHost && room.status === ROOM_STATUS.PLAYING) {
      room.status = ROOM_STATUS.PAUSED;
      this.appendEvent(room, 'Host disconnected. Match paused.', 'danger');
    } else {
      this.appendEvent(room, `${player.displayName} disconnected.`);
    }
    this.touch(room);
    return { ok: true, room };
  }

  disconnectSocket(socketId) {
    const room = this.getRoomBySocket(socketId);
    const sessionId = this.socketToSession.get(socketId);
    this.socketToRoomCode.delete(socketId);
    this.socketToSession.delete(socketId);
    if (!room || !sessionId) {
      return null;
    }
    return this.leaveRoom(room.roomCode, sessionId);
  }

  closeRoom(room, message = 'Room closed.') {
    room.status = ROOM_STATUS.CLOSED;
    room.botTurnVersion += 1;
    room.rematchStatus = REMATCH_STATUS.CANCELLED;
    this.appendEvent(room, message, 'danger');
    this.touch(room);
  }

  initializeRematchState(room) {
    room.rematchVotes = {};
    room.rematchDeadline = null;
    room.rematchStatus = REMATCH_STATUS.IDLE;
    room.botTurnVersion = Number(room.botTurnVersion || 0);
  }

  resetTurnTimer(room) {
    if (!room || room.status === ROOM_STATUS.FINISHED || room.status === ROOM_STATUS.CLOSED) {
      return;
    }
    const startedAt = this.now();
    room.turnDurationMs = TURN_TIMER.durationMs;
    room.turnStartedAt = startedAt;
    room.turnDeadlineAt = startedAt + room.turnDurationMs;
  }

  getRequiredRematchVoters(room) {
    if (!room || room.status !== ROOM_STATUS.FINISHED) {
      return [];
    }
    return room.players.filter((player) => (
      room.activePlayers.includes(player.playerId)
      && player.controller !== 'server-bot'
      && player.connected
    ));
  }

  voteRematch(roomCode, sessionId, accepted = true) {
    const room = this.getRoom(roomCode);
    if (!room || room.status === ROOM_STATUS.CLOSED) {
      return { ok: false, message: 'Room not found.' };
    }
    if (room.status !== ROOM_STATUS.FINISHED) {
      return { ok: false, message: 'Rematch is available after the match ends.' };
    }
    const player = this.getPlayer(room, sessionId);
    if (!player || player.controller === 'server-bot' || !player.connected) {
      return { ok: false, message: 'Only connected players can vote for rematch.' };
    }
    if (!accepted) {
      return this.cancelRematch(roomCode, sessionId);
    }

    if (room.rematchStatus !== REMATCH_STATUS.VOTING) {
      room.rematchVotes = {};
      room.rematchDeadline = this.now() + REMATCH_LIMITS.voteMs;
      room.rematchStatus = REMATCH_STATUS.VOTING;
      this.appendEvent(room, 'Rematch vote started.');
    }

    room.rematchVotes[player.playerSessionId] = true;
    this.appendEvent(room, `${player.displayName} voted for rematch.`, 'success');
    const required = this.getRequiredRematchVoters(room);
    const allAccepted = required.length > 0
      && required.every((candidate) => room.rematchVotes[candidate.playerSessionId]);
    if (allAccepted) {
      return this.restartRoomMatch(room, 'Rematch started.');
    }
    this.touch(room);
    return { ok: true, room, accepted: false };
  }

  cancelRematch(roomCode, sessionId = null) {
    const room = this.getRoom(roomCode);
    if (!room || room.status === ROOM_STATUS.CLOSED) {
      return { ok: false, message: 'Room not found.' };
    }
    const player = sessionId ? this.getPlayer(room, sessionId) : null;
    room.rematchStatus = REMATCH_STATUS.CANCELLED;
    room.rematchDeadline = null;
    room.rematchVotes = {};
    this.appendEvent(room, player ? `${player.displayName} cancelled rematch.` : 'Rematch cancelled.', 'danger');
    this.touch(room);
    return { ok: true, room, cancelled: true };
  }

  restartRoomMatch(room, message = 'Rematch started.') {
    if (!room || room.status === ROOM_STATUS.CLOSED) {
      return { ok: false, message: 'Room not found.' };
    }
    room.status = ROOM_STATUS.PLAYING;
    room.game = new LudoGame(room.playerCount);
    room.gameSnapshot = room.game.snapshot();
    room.currentPlayer = room.gameSnapshot.currentPlayer;
    room.diceState = {
      value: null,
      rolled: false
    };
    room.actionLog = [];
    room.eventLog = [];
    room.winner = null;
    room.matchStartedAt = this.now();
    room.matchEndedAt = null;
    this.resetTurnTimer(room);
    room.sequence += 1;
    room.botTurnVersion += 1;
    this.initializeRematchState(room);
    room.players.forEach((player) => {
      if (room.activePlayers.includes(player.playerId)) {
        player.ready = true;
      }
    });
    this.touch(room);
    this.appendEvent(room, message, 'success');
    this.appendAction(room, {
      type: 'rematchStarted',
      snapshot: room.gameSnapshot
    });
    return { ok: true, room, accepted: true };
  }

  touch(room) {
    room.updatedAt = this.now();
  }

  appendEvent(room, message, tone = 'neutral') {
    const elapsed = room.matchStartedAt ? this.now() - room.matchStartedAt : 0;
    room.eventLog = [{
      message,
      tone,
      time: nowLabel(elapsed)
    }, ...room.eventLog].slice(0, ROOM_LIMITS.eventLog);
    this.touch(room);
  }

  appendAction(room, action) {
    const sequence = room.sequence;
    room.actionLog = [{
      sequence,
      createdAt: this.now(),
      ...action
    }, ...room.actionLog].slice(0, ROOM_LIMITS.actionLog);
  }

  cleanupStaleRooms(now = this.now()) {
    const removed = [];
    for (const room of this.rooms.values()) {
      if (room.status === ROOM_STATUS.CLOSED) {
        removed.push(room.roomCode);
        continue;
      }
      const ageSinceUpdate = now - room.updatedAt;
      const connectedCount = room.players.filter((player) => player.connected).length;
      if (room.status === ROOM_STATUS.LOBBY && (!connectedCount || ageSinceUpdate > ROOM_LIMITS.emptyLobbyMs)) {
        this.closeRoom(room, 'Empty lobby expired.');
        removed.push(room.roomCode);
      }
      if (room.status === ROOM_STATUS.COUNTDOWN && ageSinceUpdate > ROOM_LIMITS.countdownStaleMs) {
        this.closeRoom(room, 'Public match countdown expired.');
        removed.push(room.roomCode);
      }
      if (room.status === ROOM_STATUS.FINISHED && ageSinceUpdate > ROOM_LIMITS.finishedMs) {
        this.closeRoom(room, 'Finished room expired.');
        removed.push(room.roomCode);
      }
      if (room.status === ROOM_STATUS.PAUSED && ageSinceUpdate > ROOM_LIMITS.pausedMs) {
        this.closeRoom(room, 'Paused room expired.');
        removed.push(room.roomCode);
      }
      if (room.rematchStatus === REMATCH_STATUS.VOTING && room.rematchDeadline && now > room.rematchDeadline) {
        room.rematchStatus = REMATCH_STATUS.EXPIRED;
        room.rematchDeadline = null;
        room.rematchVotes = {};
        this.appendEvent(room, 'Rematch vote expired.', 'danger');
      }
      if (room.status === ROOM_STATUS.LOBBY) {
        room.players = room.players.filter((player) => (
          player.connected || player.isHost || now - player.lastSeen <= ROOM_LIMITS.disconnectedGraceMs
        ));
      }
    }

    removed.forEach((roomCode) => {
      const roomId = this.roomCodeToRoomId.get(roomCode);
      if (roomId) {
        this.rooms.delete(roomId);
      }
      this.roomCodeToRoomId.delete(roomCode);
    });
    return removed;
  }

  publicRoom(room) {
    if (!room) {
      return null;
    }
    return {
      roomId: room.roomId,
      roomCode: room.roomCode,
      roomType: room.roomType || 'private',
      source: room.source || 'private-room',
      hostPlayerSessionId: room.hostPlayerSessionId,
      status: room.status,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
      playerCount: room.playerCount,
      activePlayers: [...room.activePlayers],
      seats: Object.fromEntries(room.players.map((player) => [player.playerId, player.playerSessionId])),
      players: room.players.map((player) => ({
        playerSessionId: player.playerSessionId,
        displayName: player.displayName,
        playerId: player.playerId,
        controller: player.controller || 'online-human',
        botProfile: player.botProfile ? { ...player.botProfile } : null,
        connected: player.connected,
        ready: player.ready,
        joinedAt: player.joinedAt,
        lastSeen: player.lastSeen,
        isHost: player.isHost
      })),
      readyStates: { ...room.readyStates },
      matchConfig: { ...room.matchConfig },
      currentPlayer: room.gameSnapshot?.currentPlayer || room.currentPlayer,
      diceState: { ...room.diceState },
      gameSnapshot: room.gameSnapshot,
      actionLog: room.actionLog.map((action) => ({ ...action })),
      eventLog: room.eventLog.map((event) => ({ ...event })),
      sequence: room.sequence,
      winner: room.winner,
      matchStartedAt: room.matchStartedAt,
      matchEndedAt: room.matchEndedAt,
      turnStartedAt: room.turnStartedAt || null,
      turnDeadlineAt: room.turnDeadlineAt || null,
      turnDurationMs: room.turnDurationMs || TURN_TIMER.durationMs,
      rematchVotes: { ...(room.rematchVotes || {}) },
      rematchDeadline: room.rematchDeadline || null,
      rematchStatus: room.rematchStatus || REMATCH_STATUS.IDLE,
      countdownStartedAt: room.countdownStartedAt || null,
      countdownEndsAt: room.countdownEndsAt || null,
      queueIds: room.queueIds ? [...room.queueIds] : [],
      matchmakingOptions: room.matchmakingOptions ? { ...room.matchmakingOptions } : null
    };
  }
}
