import { Chess } from 'chess.js';

export const PUBLIC_MATCH_TYPES = {
  pvp: 'public_pvp',
  bot: 'public_bot'
};

function createPublicRoomBase({ roomId, matchType, white, black, createdAt = Date.now() }) {
  return {
    id: roomId,
    matchType,
    status: 'intro',
    chess: new Chess(),
    players: {
      w: white,
      b: black
    },
    pendingUndo: null,
    pendingDraw: null,
    pendingRematch: null,
    startedPlayers: {
      w: true,
      b: true
    },
    introReady: {
      w: false,
      b: false
    },
    agreedDraw: false,
    closeTimer: 0,
    botMoveTimer: 0,
    createdAt
  };
}

export function createPublicPvPMatchRoom({ roomId, white, black, createdAt }) {
  return createPublicRoomBase({
    roomId,
    matchType: PUBLIC_MATCH_TYPES.pvp,
    white,
    black,
    createdAt
  });
}

export function createPublicBotMatchRoom({ roomId, human, humanColor, bot, createdAt }) {
  const botColor = humanColor === 'w' ? 'b' : 'w';
  const botSeat = {
    token: `bot-${roomId.toLowerCase()}`,
    socketId: null,
    connected: true,
    lastSeenAt: Date.now(),
    name: bot.name,
    isBot: true
  };

  const room = createPublicRoomBase({
    roomId,
    matchType: PUBLIC_MATCH_TYPES.bot,
    white: humanColor === 'w' ? human : botSeat,
    black: humanColor === 'b' ? human : botSeat,
    createdAt
  });

  room.bot = {
    ...bot,
    color: botColor,
    thinking: false
  };
  room.introReady[botColor] = true;
  return room;
}

export function isPublicRoom(room) {
  return room?.matchType === PUBLIC_MATCH_TYPES.pvp || room?.matchType === PUBLIC_MATCH_TYPES.bot;
}

export function isPublicBotRoom(room) {
  return room?.matchType === PUBLIC_MATCH_TYPES.bot;
}
