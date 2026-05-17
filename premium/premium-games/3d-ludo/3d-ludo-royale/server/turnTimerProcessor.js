import { PLAYER_META, STATUS } from '../src/ludo/constants.js';
import { moveTokenForPlayer, rollDiceForPlayer } from './onlineActions.js';
import { ROOM_STATUS } from './roomStore.js';

const FORCED_MOVE_DELAY_MS = 1300;

function playerLabel(playerId) {
  return PLAYER_META[playerId]?.label || playerId;
}

export function createTurnTimerProcessor({ store, io, log = () => {}, afterAction = () => {} } = {}) {
  const timers = new Map();

  function clear(roomCode) {
    const timer = timers.get(roomCode);
    if (timer) {
      clearTimeout(timer);
      timers.delete(roomCode);
    }
  }

  function emit(result) {
    if (!result?.ok || !result.room || !result.action) {
      return;
    }
    io.to(result.room.roomCode).emit('game:action', result.action);
    io.to(result.room.roomCode).emit('room:update', store.publicRoom(result.room));
    afterAction(result.room);
  }

  function forceMove(room) {
    const move = room.game.state.availableMoves?.[0];
    if (!move?.tokenId) {
      return null;
    }
    return moveTokenForPlayer(room, room.game.state.currentPlayer, move.tokenId, store, {
      allowBot: room.players.some((player) => player.playerId === room.game.state.currentPlayer && player.controller === 'server-bot')
    });
  }

  function expire(roomCode, startedDeadline) {
    timers.delete(roomCode);
    const room = store.getRoom(roomCode);
    if (
      !room
      || room.status !== ROOM_STATUS.PLAYING
      || !room.game
      || room.winner
      || room.turnDeadlineAt !== startedDeadline
      || Date.now() < startedDeadline - 8
    ) {
      return;
    }

    const playerId = room.game.state.currentPlayer;
    store.appendEvent(room, `${playerLabel(playerId)} timer expired. Auto action played.`, 'danger');
    log('turn_timer.expired', { roomCode, playerId, phase: room.game.state.phase });

    if (room.game.state.phase === STATUS.AWAITING_ROLL) {
      const roll = rollDiceForPlayer(room, playerId, store, {
        allowBot: room.players.some((player) => player.playerId === playerId && player.controller === 'server-bot')
      });
      emit(roll);
      if (roll.ok && roll.room.game?.state.phase === STATUS.AWAITING_TOKEN) {
        const now = Date.now();
        roll.room.turnStartedAt = now;
        roll.room.turnDeadlineAt = now + FORCED_MOVE_DELAY_MS;
        io.to(roll.room.roomCode).emit('room:update', store.publicRoom(roll.room));
        schedule(roll.room);
        return;
      }
      schedule(roll.room);
      return;
    }

    if (room.game.state.phase === STATUS.AWAITING_TOKEN) {
      const move = forceMove(room);
      emit(move);
      schedule(move?.room || room);
    }
  }

  function schedule(room) {
    if (!room?.roomCode) {
      return false;
    }
    clear(room.roomCode);
    if (room.status !== ROOM_STATUS.PLAYING || !room.turnDeadlineAt || room.winner) {
      return false;
    }
    const delay = Math.max(0, room.turnDeadlineAt - Date.now());
    const timer = setTimeout(() => expire(room.roomCode, room.turnDeadlineAt), delay);
    timer.unref?.();
    timers.set(room.roomCode, timer);
    return true;
  }

  function clearClosedRooms() {
    for (const roomCode of [...timers.keys()]) {
      const room = store.getRoom(roomCode);
      if (!room || room.status !== ROOM_STATUS.PLAYING || !room.turnDeadlineAt) {
        clear(roomCode);
      }
    }
  }

  return {
    schedule,
    clear,
    clearClosedRooms,
    size: () => timers.size
  };
}
