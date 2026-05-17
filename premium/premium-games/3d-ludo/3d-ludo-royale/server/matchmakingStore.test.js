import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { moveTokenForRoom, rollDiceForRoom, validateRoll } from './onlineActions.js';
import { MATCHMAKING_LIMITS, MATCHMAKING_STATUS, MatchmakingStore } from './matchmakingStore.js';
import { RoomStore, ROOM_STATUS } from './roomStore.js';

function createStores() {
  let current = 1000;
  const now = () => current;
  const store = new RoomStore({ rng: () => 0.24, now });
  const matchmaking = new MatchmakingStore({ roomStore: store, now, countdownMs: 5000 });
  return {
    store,
    matchmaking,
    tick(ms) {
      current += ms;
      return current;
    }
  };
}

function joinSearch(matchmaking, index, playerCount = 2, preferredColor = null) {
  return matchmaking.joinQueue({
    socketId: `socket-${index}`,
    sessionId: `session-${index}`,
    displayName: `Player ${index}`,
    playerCount,
    preferredColor
  });
}

function joinSearchWithBotFill(matchmaking, index, playerCount = 2, botFillMode = 'after-wait') {
  return matchmaking.joinQueue({
    socketId: `socket-${index}`,
    sessionId: `session-${index}`,
    displayName: `Player ${index}`,
    playerCount,
    botFillMode,
    botDifficulty: 'smart',
    botPersonality: 'finisher'
  });
}

describe('3D Ludo Royale public matchmaking store', () => {
  it('creates queue entries and prevents duplicate active queues per session', () => {
    const { matchmaking } = createStores();
    const first = joinSearch(matchmaking, 1, 2, 'blue');
    const duplicate = matchmaking.joinQueue({
      socketId: 'socket-1b',
      sessionId: 'session-1',
      displayName: 'Renamed',
      playerCount: 4,
      preferredColor: 'yellow'
    });

    assert.equal(first.ok, true);
    assert.equal(duplicate.ok, true);
    assert.equal(matchmaking.queueIdToEntry.size, 1);
    assert.equal(duplicate.queue.requestedPlayerCount, 2);
    assert.equal(duplicate.queue.displayName, 'Renamed');
  });

  it('cancels and expires queue entries cleanly', () => {
    const { matchmaking, tick } = createStores();
    const queued = joinSearch(matchmaking, 1);

    assert.equal(matchmaking.cancelQueue('session-1').ok, true);
    assert.equal(matchmaking.queueIdToEntry.has(queued.queue.queueId), false);

    const stale = joinSearch(matchmaking, 2);
    tick(MATCHMAKING_LIMITS.queueExpiryMs + 1);
    const expired = matchmaking.cleanup();

    assert.equal(expired.length, 1);
    assert.equal(expired[0].queueId, stale.queue.queueId);
  });

  it('matches compatible player counts and rejects mismatched counts', () => {
    const { matchmaking } = createStores();
    joinSearch(matchmaking, 1, 3);
    joinSearch(matchmaking, 2, 2);
    const stillWaiting = joinSearch(matchmaking, 3, 3);
    const matched = joinSearch(matchmaking, 4, 3);

    assert.equal(stillWaiting.match, null);
    assert.equal(matched.match.ok, true);
    assert.equal(matched.match.room.playerCount, 3);
    assert.equal(matched.match.room.players.length, 3);
  });

  it('creates public countdown rooms with unique seats and preferred color fallback', () => {
    const { matchmaking } = createStores();
    joinSearch(matchmaking, 1, 2, 'red');
    const matched = joinSearch(matchmaking, 2, 2, 'red');
    const room = matched.match.room;

    assert.equal(room.status, ROOM_STATUS.COUNTDOWN);
    assert.equal(room.roomType, 'public');
    assert.equal(room.hostPlayerSessionId, 'server');
    assert.deepEqual(room.players.map((player) => player.playerId), ['red', 'blue']);
    assert.equal(room.players.every((player) => !player.isHost && player.ready), true);
    assert.equal(room.countdownEndsAt - room.countdownStartedAt, 5000);
  });

  it('starts public rooms through the same authoritative gameplay flow', () => {
    const { store, matchmaking } = createStores();
    joinSearch(matchmaking, 1, 2, 'red');
    const matched = joinSearch(matchmaking, 2, 2, 'blue');
    const room = matched.match.room;
    const start = store.startPublicMatch(room.roomCode);

    assert.equal(start.ok, true);
    assert.equal(room.status, ROOM_STATUS.PLAYING);
    assert.equal(validateRoll(room, 'socket-1').ok, true);
    room.game.rng = () => 0.99;
    const roll = rollDiceForRoom(room, 'socket-1', store);
    assert.equal(roll.ok, true);
    const move = moveTokenForRoom(room, 'socket-1', room.game.state.availableMoves[0].tokenId, store);
    assert.equal(move.ok, true);
    assert.equal(move.action.snapshot.tokens.red[0].state !== 'base', true);
  });

  it('restores searching and matched sessions by session id', () => {
    const { matchmaking } = createStores();
    joinSearch(matchmaking, 1, 2);
    const searching = matchmaking.reconnect({
      sessionId: 'session-1',
      socketId: 'socket-1-new'
    });
    assert.equal(searching.ok, true);
    assert.equal(searching.status, MATCHMAKING_STATUS.SEARCHING);

    const matched = joinSearch(matchmaking, 2, 2);
    const restored = matchmaking.reconnect({
      sessionId: 'session-1',
      socketId: 'socket-1-return',
      roomCode: matched.match.room.roomCode
    });
    assert.equal(restored.ok, true);
    assert.equal(restored.status, MATCHMAKING_STATUS.MATCHED);
    assert.equal(restored.room.roomCode, matched.match.room.roomCode);
  });

  it('handles queue disconnects and countdown cancellation requeues remaining players', () => {
    const { matchmaking } = createStores();
    joinSearch(matchmaking, 1, 2);
    const disconnected = matchmaking.disconnectSocket('socket-1');
    assert.equal(disconnected.status, MATCHMAKING_STATUS.SEARCHING);

    const replacement = joinSearch(matchmaking, 2, 2);
    assert.equal(replacement.match, null);

    const reconnected = matchmaking.reconnect({
      sessionId: 'session-1',
      socketId: 'socket-1-return'
    });
    assert.equal(reconnected.ok, true);
    const matched = matchmaking.tryMatch(2);
    assert.equal(matched.ok, true);

    const cancelled = matchmaking.cancelMatchedRoom(matched.room.roomCode, 'session-1');
    assert.equal(cancelled.room.status, ROOM_STATUS.CLOSED);
    assert.equal(cancelled.requeued.length, 1);
    assert.equal(cancelled.requeued[0].sessionId, 'session-2');
    assert.equal(cancelled.requeued[0].status, MATCHMAKING_STATUS.SEARCHING);
  });

  it('keeps private room creation and start behavior intact', () => {
    const { store } = createStores();
    const created = store.createRoom({
      socketId: 'host',
      sessionId: 'host',
      displayName: 'Host',
      playerCount: 2
    });
    const joined = store.joinRoom({
      roomCode: created.room.roomCode,
      socketId: 'blue',
      sessionId: 'blue',
      displayName: 'Blue',
      preferredColor: 'blue'
    });

    assert.equal(joined.ok, true);
    assert.equal(store.startMatch(created.room.roomCode, 'host').ok, false);
    store.setReady(created.room.roomCode, 'blue', true);
    const started = store.startMatch(created.room.roomCode, 'host');
    assert.equal(started.ok, true);
    assert.equal(started.room.roomType || 'private', 'private');
    assert.equal(started.room.status, ROOM_STATUS.PLAYING);
  });

  it('fills public queues with server bots immediately when requested', () => {
    const { matchmaking } = createStores();
    const matched = joinSearchWithBotFill(matchmaking, 1, 4, 'immediate');

    assert.equal(matched.match.ok, true);
    assert.equal(matched.match.room.playerCount, 4);
    assert.equal(matched.match.room.players.filter((player) => player.controller === 'server-bot').length, 3);
    assert.equal(matched.match.room.matchConfig.botFill, true);
    assert.equal(matched.match.room.players.every((player) => player.playerId), true);
  });

  it('fills public queues with server bots after the wait threshold only', () => {
    const { matchmaking, tick } = createStores();
    const queued = joinSearchWithBotFill(matchmaking, 1, 2, 'after-wait');

    assert.equal(queued.match, null);
    tick(MATCHMAKING_LIMITS.botFillWaitMs + 1);
    const match = matchmaking.tryMatch(2, { allowBotFill: true });

    assert.equal(match.ok, true);
    assert.equal(match.room.players.filter((player) => player.controller === 'server-bot').length, 1);
    assert.equal(match.room.matchmakingOptions.botDifficulty, 'smart');
    assert.equal(match.room.matchmakingOptions.botPersonality, 'finisher');
  });

  it('does not overfill public rooms when bot fill is enabled', () => {
    const { matchmaking } = createStores();
    joinSearchWithBotFill(matchmaking, 1, 2, 'immediate');
    const waitingAfterMatch = [...matchmaking.queueIdToEntry.values()].filter((entry) => entry.status === MATCHMAKING_STATUS.SEARCHING);

    assert.equal(waitingAfterMatch.length, 0);
    const room = [...matchmaking.roomStore.rooms.values()][0];
    assert.equal(room.players.length, 2);
    assert.equal(new Set(room.players.map((player) => player.playerId)).size, 2);
  });
});
