import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { FINAL_STEP, PLAYER_SETS } from '../src/ludo/constants.js';
import { moveTokenForPlayer, moveTokenForRoom, rollDiceForPlayer, rollDiceForRoom, validateMove, validateRoll } from './onlineActions.js';
import {
  REMATCH_STATUS,
  RoomStore,
  ROOM_LIMITS,
  ROOM_STATUS,
  TURN_TIMER,
  canStartRoom,
  createRoomCode,
  getAvailableSeat
} from './roomStore.js';

function createStartedRoom(playerCount = 2) {
  const store = new RoomStore({ rng: () => 0.1, now: () => 1000 });
  const created = store.createRoom({
    socketId: 'socket-host',
    sessionId: 'host-session',
    displayName: 'Host',
    playerCount
  });
  assert.equal(created.ok, true);
  const roomCode = created.room.roomCode;
  for (const playerId of PLAYER_SETS[playerCount].slice(1)) {
    const joined = store.joinRoom({
      roomCode,
      socketId: `socket-${playerId}`,
      sessionId: `${playerId}-session`,
      displayName: playerId,
      preferredColor: playerId
    });
    assert.equal(joined.ok, true);
    store.setReady(roomCode, `${playerId}-session`, true);
  }
  const start = store.startMatch(roomCode, 'host-session');
  assert.equal(start.ok, true);
  return { store, room: start.room, roomCode };
}

describe('3D Ludo Royale online room store', () => {
  it('generates readable unique room codes', () => {
    const existing = new Set(['LUDO-DDDD']);
    const code = createRoomCode(existing, () => 0.2);

    assert.match(code, /^LUDO-[A-HJ-NP-Z2-9]{4}$/);
    assert.notEqual(code, 'LUDO-DDDD');
  });

  it('creates room data and assigns host seat', () => {
    const store = new RoomStore({ rng: () => 0.33, now: () => 1000 });
    const result = store.createRoom({
      socketId: 'socket-1',
      sessionId: 'session-1',
      displayName: '<Host>',
      playerCount: 2
    });

    assert.equal(result.ok, true);
    assert.equal(result.room.status, ROOM_STATUS.LOBBY);
    assert.equal(result.room.players[0].isHost, true);
    assert.equal(result.room.players[0].displayName, 'Host');
    assert.deepEqual(result.room.activePlayers, ['red', 'blue']);
  });

  it('assigns 2/3/4 player seats and rejects full rooms', () => {
    for (const count of [2, 3, 4]) {
      const store = new RoomStore({ rng: () => count / 10, now: () => 1000 });
      const created = store.createRoom({
        socketId: `host-${count}`,
        sessionId: `host-${count}`,
        displayName: 'Host',
        playerCount: count
      });
      const seats = [created.room.players[0].playerId];
      for (let index = 1; index < count; index += 1) {
        const joined = store.joinRoom({
          roomCode: created.room.roomCode,
          socketId: `socket-${count}-${index}`,
          sessionId: `session-${count}-${index}`,
          displayName: `P${index}`
        });
        assert.equal(joined.ok, true);
        seats.push(joined.player.playerId);
      }
      assert.deepEqual(seats, PLAYER_SETS[count]);
      assert.equal(getAvailableSeat(created.room), null);
      assert.equal(store.joinRoom({
        roomCode: created.room.roomCode,
        socketId: `overflow-${count}`,
        sessionId: `overflow-${count}`,
        displayName: 'Overflow'
      }).ok, false);
    }
  });

  it('keeps lobby config host-only and enforces start readiness', () => {
    const store = new RoomStore({ rng: () => 0.4, now: () => 1000 });
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
      displayName: 'Blue'
    });

    assert.equal(store.updateLobbyConfig(created.room.roomCode, 'blue', { playerCount: 3 }).ok, false);
    assert.equal(canStartRoom(created.room, 'host').ok, false);
    store.setReady(created.room.roomCode, 'blue', true);
    assert.equal(canStartRoom(created.room, 'host').ok, true);
    assert.equal(joined.player.ready, true);
  });

  it('validates current-player roll and rejects duplicate roll', () => {
    const { store, room } = createStartedRoom(2);
    room.game.rng = () => 0.99;

    assert.equal(validateRoll(room, 'socket-host').ok, true);
    const roll = rollDiceForRoom(room, 'socket-host', store);
    assert.equal(roll.ok, true);
    assert.equal(validateRoll(room, 'socket-host').ok, false);
    assert.equal(rollDiceForRoom(room, 'socket-blue', store).ok, false);
  });

  it('starts and resets online turn timers on match turns', () => {
    let current = 1000;
    const store = new RoomStore({ rng: () => 0.2, now: () => current });
    const created = store.createRoom({
      socketId: 'host',
      sessionId: 'host',
      displayName: 'Host',
      playerCount: 2
    });
    store.joinRoom({
      roomCode: created.room.roomCode,
      socketId: 'blue',
      sessionId: 'blue',
      displayName: 'Blue'
    });
    store.setReady(created.room.roomCode, 'blue', true);
    const started = store.startMatch(created.room.roomCode, 'host');

    assert.equal(started.room.turnStartedAt, 1000);
    assert.equal(started.room.turnDeadlineAt, 1000 + TURN_TIMER.durationMs);
    current = 5000;
    started.room.game.rng = () => 0.99;
    rollDiceForRoom(started.room, 'host', store);
    moveTokenForRoom(started.room, 'host', 'red-0', store);
    assert.equal(started.room.turnStartedAt, 5000);
    assert.equal(started.room.turnDeadlineAt, 5000 + TURN_TIMER.durationMs);
  });

  it('validates current-player moves and rejects illegal tokens', () => {
    const { store, room } = createStartedRoom(2);
    room.game.rng = () => 0.99;
    rollDiceForRoom(room, 'socket-host', store);

    assert.equal(validateMove(room, 'socket-host', 'blue-0').ok, false);
    assert.equal(moveTokenForRoom(room, 'socket-host', 'blue-0', store).ok, false);
    const legalToken = room.game.state.availableMoves[0].tokenId;
    const move = moveTokenForRoom(room, 'socket-host', legalToken, store);
    assert.equal(move.ok, true);
    assert.equal(move.action.snapshot.tokens.red[0].state !== 'base', true);
  });

  it('can produce a winner room state from the local LudoGame result', () => {
    const { store, room } = createStartedRoom(2);
    room.game.rng = () => 0;
    for (let index = 0; index < 3; index += 1) {
      room.game.setTokenForTest('red', index, { state: 'finished', steps: FINAL_STEP });
    }
    room.game.setTokenForTest('red', 3, { state: 'home-lane', steps: FINAL_STEP - 1 });
    rollDiceForRoom(room, 'socket-host', store);
    const move = moveTokenForRoom(room, 'socket-host', 'red-3', store);

    assert.equal(move.ok, true);
    assert.equal(room.status, ROOM_STATUS.FINISHED);
    assert.equal(room.winner, 'red');
  });

  it('handles leave and reconnect seat restoration', () => {
    const { store, room, roomCode } = createStartedRoom(2);
    const leave = store.leaveRoom(roomCode, 'blue-session');

    assert.equal(leave.ok, true);
    assert.equal(room.players.find((player) => player.playerSessionId === 'blue-session').connected, false);

    const reconnect = store.reconnectToRoom({
      roomCode,
      socketId: 'socket-blue-new',
      sessionId: 'blue-session'
    });
    assert.equal(reconnect.ok, true);
    assert.equal(reconnect.player.playerId, 'blue');
    assert.equal(reconnect.player.connected, true);
  });

  it('cleans stale rooms', () => {
    let current = 1000;
    const store = new RoomStore({ rng: () => 0.5, now: () => current });
    const created = store.createRoom({
      socketId: 'host',
      sessionId: 'host',
      displayName: 'Host'
    });

    current += ROOM_LIMITS.emptyLobbyMs + 1;
    const removed = store.cleanupStaleRooms(current);

    assert.deepEqual(removed, [created.room.roomCode]);
  });

  it('resets a finished private room after unanimous rematch votes', () => {
    const { store, room, roomCode } = createStartedRoom(2);
    room.status = ROOM_STATUS.FINISHED;
    room.winner = 'red';
    room.gameSnapshot = room.game.snapshot();
    room.actionLog = [{ type: 'old', sequence: 99 }];
    room.eventLog = [{ message: 'old' }];

    const first = store.voteRematch(roomCode, 'host-session');
    assert.equal(first.ok, true);
    assert.equal(first.accepted, false);
    assert.equal(room.rematchStatus, REMATCH_STATUS.VOTING);

    const second = store.voteRematch(roomCode, 'blue-session');
    assert.equal(second.ok, true);
    assert.equal(second.accepted, true);
    assert.equal(room.status, ROOM_STATUS.PLAYING);
    assert.equal(room.winner, null);
    assert.equal(room.actionLog[0].type, 'rematchStarted');
    assert.equal(room.gameSnapshot.currentPlayer, 'red');
  });

  it('allows server-only bot actions but rejects client-controlled bot actions', () => {
    const store = new RoomStore({ rng: () => 0.7, now: () => 1000 });
    const publicRoom = store.createPublicRoomFromQueue({
      playerCount: 2,
      entries: [
        {
          queueId: 'human-q',
          socketId: 'human-socket',
          sessionId: 'human-session',
          displayName: 'Human',
          preferredColor: 'blue',
          controller: 'online-human'
        },
        {
          queueId: 'bot-q',
          socketId: null,
          sessionId: 'bot-session',
          displayName: 'Red Bot',
          preferredColor: 'red',
          controller: 'server-bot',
          botProfile: { difficulty: 'medium', personality: 'balanced' }
        }
      ]
    });
    const room = publicRoom.room;
    assert.equal(store.startPublicMatch(room.roomCode).ok, true);
    room.game.rng = () => 0.99;

    assert.equal(rollDiceForRoom(room, null, store).ok, false);
    const roll = rollDiceForPlayer(room, 'red', store, { allowBot: true });
    assert.equal(roll.ok, true);
    const tokenId = room.game.state.availableMoves[0].tokenId;
    const move = moveTokenForPlayer(room, 'red', tokenId, store, { allowBot: true });
    assert.equal(move.ok, true);
  });

  it('expires stale rematch votes during cleanup', () => {
    let current = 1000;
    const store = new RoomStore({ rng: () => 0.6, now: () => current });
    const created = store.createRoom({
      socketId: 'host',
      sessionId: 'host',
      displayName: 'Host'
    });
    const room = created.room;
    store.joinRoom({
      roomCode: room.roomCode,
      socketId: 'blue',
      sessionId: 'blue',
      displayName: 'Blue',
      preferredColor: 'blue'
    });
    room.status = ROOM_STATUS.FINISHED;
    room.winner = 'red';
    store.voteRematch(room.roomCode, 'host');
    current += 31_000;
    store.cleanupStaleRooms(current);

    assert.equal(room.rematchStatus, REMATCH_STATUS.EXPIRED);
    assert.deepEqual(room.rematchVotes, {});
  });
});
