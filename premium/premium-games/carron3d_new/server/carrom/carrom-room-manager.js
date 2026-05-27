import { CarromRoom } from './carrom-room.js';
import { createRoomCode, normalizeRoomCode } from './carrom-room-code.js';
import { serializeRoom } from './carrom-serializer.js';
import { ONLINE_TIMER_DEFAULTS, createTimeout } from './carrom-timers.js';

export class CarromRoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom({ socketId, playerName, matchConfig, roomType = 'private' }) {
    const roomCode = createRoomCode(new Set(this.rooms.keys()));
    const room = new CarromRoom({
      roomCode,
      hostSocketId: socketId,
      hostName: playerName,
      matchConfig,
      roomType
    });
    this.rooms.set(roomCode, room);
    return room;
  }

  createPublicRoom({ hostSocketId, hostName, guestSocketId, guestName, matchConfig }) {
    const room = this.createRoom({
      socketId: hostSocketId,
      playerName: hostName,
      matchConfig,
      roomType: 'public'
    });
    room.addGuest({
      socketId: guestSocketId,
      playerName: guestName
    });
    room.message = 'Public match found. Starting soon.';
    room.bumpState('public-room-created');
    return room;
  }

  joinRoom({ socketId, roomCode, playerName }) {
    const room = this.getRoom(roomCode);
    if (!room) {
      throw new Error('Room not found.');
    }
    if (room.status !== 'lobby') {
      throw new Error('Room is already playing.');
    }
    room.addGuest({ socketId, playerName });
    return room;
  }

  getRoom(roomCode = '') {
    return this.rooms.get(normalizeRoomCode(roomCode)) || null;
  }

  getRoomBySocket(socketId) {
    return [...this.rooms.values()].find((room) => room.hasSocket(socketId)) || null;
  }

  getRoomBySession(sessionId) {
    return [...this.rooms.values()].find((room) => room.getPlayerBySession(sessionId)) || null;
  }

  isSocketInRoom(socketId) {
    const room = this.getRoomBySocket(socketId);
    const player = room?.getPlayerBySocket(socketId);
    return Boolean(room && room.status !== 'closed' && player?.isConnected);
  }

  leaveSocket(socketId, reason = 'left') {
    const room = this.getRoomBySocket(socketId);
    if (!room) {
      return null;
    }
    const player = room.markSocketLeft(socketId, reason);
    if (room.status === 'closed') {
      room.clearTimers();
      room.timers.cleanup = createTimeout(
        () => this.cleanupRoom(room.roomCode),
        ONLINE_TIMER_DEFAULTS.ROOM_EMPTY_CLEANUP_MS
      );
    }
    return { room, player };
  }

  disconnectSocket(socketId) {
    const room = this.getRoomBySocket(socketId);
    if (!room) {
      return null;
    }
    const player = room.markSocketDisconnected(socketId);
    return { room, player };
  }

  reconnectSession({ sessionId, playerId, roomCode, socketId, matchId }) {
    const room = this.getRoom(roomCode) || this.getRoomBySession(sessionId);
    const player = room?.getPlayerBySession(sessionId);
    if (!room || !player) {
      return { ok: false, code: 'session-not-found', message: 'Online session expired.' };
    }
    if (room.status === 'closed') {
      return { ok: false, code: 'room-closed', message: 'Room is closed.' };
    }
    if (player.playerId !== playerId) {
      return { ok: false, code: 'player-mismatch', message: 'Session player does not match.' };
    }
    if (matchId && room.matchEngine?.matchStateManager?.state?.matchId !== matchId) {
      return { ok: false, code: 'match-mismatch', message: 'Match session is out of date.' };
    }
    if (Date.now() - player.lastSeenAt > ONLINE_TIMER_DEFAULTS.STALE_SESSION_MS) {
      return { ok: false, code: 'session-stale', message: 'Session expired.' };
    }
    const activeSocketRoom = this.getRoomBySocket(socketId);
    if (activeSocketRoom && activeSocketRoom.roomCode !== room.roomCode) {
      return { ok: false, code: 'socket-in-room', message: 'Socket already belongs to another room.' };
    }
    player.attachSocket(socketId);
    room.clearDisconnectGrace();
    room.message = `${player.name} reconnected.`;
    room.bumpState('player-reconnected');
    return { ok: true, room, player };
  }

  cleanupRoom(roomCode) {
    const room = this.getRoom(roomCode);
    if (!room) {
      return;
    }
    if (room.isEmptyOrClosed) {
      room.clearTimers();
      this.rooms.delete(room.roomCode);
    }
  }

  cleanupExpired() {
    const now = Date.now();
    this.rooms.forEach((room) => {
      const ttl = room.status === 'finished'
        ? ONLINE_TIMER_DEFAULTS.FINISHED_ROOM_CLEANUP_MS
        : ONLINE_TIMER_DEFAULTS.ROOM_EMPTY_CLEANUP_MS;
      const lobbyIdle = room.status === 'lobby'
        && now - room.updatedAt > ONLINE_TIMER_DEFAULTS.LOBBY_IDLE_CLEANUP_MS;
      if (room.isEmptyOrClosed && now - room.updatedAt > ttl) {
        room.clearTimers();
        this.rooms.delete(room.roomCode);
        return;
      }
      if (lobbyIdle) {
        room.close('Lobby expired.');
        room.clearTimers();
        this.rooms.delete(room.roomCode);
      }
    });
  }

  serializeRoom(room) {
    return serializeRoom(room);
  }
}
