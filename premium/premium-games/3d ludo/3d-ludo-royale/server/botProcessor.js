import { chooseBotMove } from '../src/ai/bot.js';
import { STATUS } from '../src/ludo/constants.js';
import { moveTokenForPlayer, rollDiceForPlayer } from './onlineActions.js';
import { ROOM_STATUS } from './roomStore.js';

const BOT_DELAYS = Object.freeze({
  normal: {
    rollMs: 950,
    thinkMs: 900
  },
  fast: {
    rollMs: 420,
    thinkMs: 360
  }
});

function getCurrentBot(room) {
  if (!room?.game || room.status !== ROOM_STATUS.PLAYING) {
    return null;
  }
  return room.players.find((player) => (
    player.playerId === room.game.state.currentPlayer
    && player.controller === 'server-bot'
  )) || null;
}

function safeRng() {
  return Math.random();
}

export function createBotTurnProcessor({ store, io, log = () => {} } = {}) {
  const timers = new Map();

  function clear(roomCode) {
    const timer = timers.get(roomCode);
    if (timer) {
      clearTimeout(timer);
      timers.delete(roomCode);
    }
  }

  function emitAction(result) {
    if (!result?.ok || !result.room || !result.action) {
      return;
    }
    io.to(result.room.roomCode).emit('game:action', result.action);
    io.to(result.room.roomCode).emit('room:update', store.publicRoom(result.room));
  }

  function schedule(room) {
    if (!room?.roomCode) {
      return false;
    }
    clear(room.roomCode);
    const bot = getCurrentBot(room);
    if (!bot) {
      return false;
    }

    const speed = room.matchConfig?.matchSpeed === 'fast' ? 'fast' : 'normal';
    const delays = BOT_DELAYS[speed];
    const startedSequence = room.sequence;
    const startedVersion = room.botTurnVersion;
    const phase = room.game.state.phase;
    const delay = phase === STATUS.AWAITING_ROLL ? delays.rollMs : delays.thinkMs;

    const timer = setTimeout(() => {
      timers.delete(room.roomCode);
      const latest = store.getRoom(room.roomCode);
      const latestBot = getCurrentBot(latest);
      if (
        !latest
        || !latestBot
        || latestBot.playerSessionId !== bot.playerSessionId
        || latest.botTurnVersion !== startedVersion
        || latest.sequence !== startedSequence
      ) {
        return;
      }

      let result = null;
      if (latest.game.state.phase === STATUS.AWAITING_ROLL) {
        log('bot.roll', { roomCode: latest.roomCode, playerId: latestBot.playerId });
        result = rollDiceForPlayer(latest, latestBot.playerId, store, { allowBot: true });
      } else if (latest.game.state.phase === STATUS.AWAITING_TOKEN) {
        const profile = latestBot.botProfile || { difficulty: 'medium', personality: 'balanced' };
        const choice = chooseBotMove(latest.gameSnapshot, {
          playerId: latestBot.playerId,
          difficulty: profile.difficulty,
          personality: profile.personality,
          rng: safeRng
        });
        if (!choice?.tokenId) {
          log('bot.no_move_choice', { roomCode: latest.roomCode, playerId: latestBot.playerId });
          return;
        }
        log('bot.move', { roomCode: latest.roomCode, playerId: latestBot.playerId, tokenId: choice.tokenId, reason: choice.reason });
        result = moveTokenForPlayer(latest, latestBot.playerId, choice.tokenId, store, { allowBot: true });
      }

      if (result?.ok) {
        emitAction(result);
        schedule(result.room);
      } else if (result?.message) {
        log('bot.action_rejected', { roomCode: latest.roomCode, playerId: latestBot.playerId, message: result.message });
      }
    }, delay);
    timer.unref?.();
    timers.set(room.roomCode, timer);
    return true;
  }

  function clearClosedRooms() {
    for (const roomCode of [...timers.keys()]) {
      const room = store.getRoom(roomCode);
      if (!room || room.status === ROOM_STATUS.CLOSED || room.status === ROOM_STATUS.FINISHED) {
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
