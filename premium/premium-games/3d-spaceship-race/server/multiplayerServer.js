import express from 'express';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Server } from 'socket.io';
import { initializeFirebaseAdmin, verifyPlayerToken } from './firebaseAdmin.js';
import { createMultiplayerStateStore } from './multiplayerStateStore.js';
import premiumTicketModule from '../../../../core/server/premium-session-ticket.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT ?? 3001);
const ALLOW_INSECURE_LOCAL_AUTH = process.env.ALLOW_INSECURE_LOCAL_AUTH === 'true' || !IS_PRODUCTION;
const TRACK_POOL = ['night-circuit', 'rift-run', 'singularity-loop', 'solar-storm-corridor'];
const RECONNECT_GRACE_MS = 15000;
const RACE_TIMEOUT_MS = 5 * 60 * 1000;
const MAX_SNAPSHOT_SPEED = 160;
const MAX_DISTANCE_RATE = 190;
const SNAPSHOT_DISTANCE_BUFFER = 10;
const MIN_FINISH_TIMES_MS = {
  'night-circuit': 45000,
  'rift-run': 56000,
  'singularity-loop': 68000,
  'solar-storm-corridor': 76000
};
const TRACK_ROOM_RULES = {
  'night-circuit': { maxPlayers: 6, minPlayers: 2 },
  'rift-run': { maxPlayers: 8, minPlayers: 2 },
  'singularity-loop': { maxPlayers: 9, minPlayers: 2 },
  'solar-storm-corridor': { maxPlayers: 10, minPlayers: 2 }
};
const STATE_DIR = path.join(__dirname, 'data');
const STATE_FILE = path.join(STATE_DIR, 'multiplayer-state.json');
const MULTIPLAYER_ALLOWED_ORIGINS = String(process.env.MULTIPLAYER_ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((entry) => entry.trim())
  .filter(Boolean);
const firebaseAdminStatus = initializeFirebaseAdmin();
const { verifyPremiumSessionTicket } = premiumTicketModule;
const sharedStateStore = createMultiplayerStateStore({
  stateFile: STATE_FILE,
  getTier
});
const playerSockets = new Map();
const roomCache = new Map();
const roomSubscriptions = new Map();
const roomRaceTimeouts = new Map();
const reconnectTimeouts = new Map();
const quickAssignmentPollers = new Map();
const SNAPSHOT_SYNC_INTERVAL_MS = 120;

function createRoomId() {
  return `room-${Math.random().toString(36).slice(2, 10)}`;
}

function createRoomCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';

  for (let index = 0; index < 5; index += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return code;
}

function normalizeName(value) {
  return String(value ?? 'Pilot')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 20) || 'Pilot';
}

function sanitizeTrackId(value) {
  return TRACK_POOL.includes(value) ? value : TRACK_POOL[0];
}

function normalizePlayer(payload, verifiedAuth = null) {
  return {
    playerId: verifiedAuth?.uid || String(payload.playerId ?? '').trim(),
    name: normalizeName(payload.name),
    shipId: payload.shipId ?? 'starling',
    trackId: sanitizeTrackId(payload.trackId),
    cosmetics: payload.cosmetics ?? {},
    friends: Array.isArray(payload.friends) ? payload.friends.slice(0, 16) : [],
    authProvider: verifiedAuth?.provider || String(payload.authProvider ?? 'anonymous')
  };
}

function rejectRequest(socket, ack, message) {
  if (typeof ack === 'function') {
    ack({
      ok: false,
      message
    });
    return;
  }

  socket.emit('match:error', { message });
}

function resolveRequest(ack, extra = {}) {
  if (typeof ack === 'function') {
    ack({
      ok: true,
      ...extra
    });
  }
}

function getSafeAuthError(error) {
  const message = String(error?.message ?? '').trim();
  return message || 'Could not verify player identity.';
}

async function authenticateSocketPlayer(socket, payload = {}, ack) {
  const idToken = String(payload?.authToken ?? '').trim();
  const premiumTicket = String(payload?.premiumTicket ?? '').trim();

  if (premiumTicket) {
    const verifiedPremiumSession = verifyPremiumSessionTicket(premiumTicket);
    if (verifiedPremiumSession?.uid) {
      const premiumAuth = {
        uid: verifiedPremiumSession.uid,
        provider: verifiedPremiumSession.provider || 'firebase',
        verified: true,
        projectId: verifiedPremiumSession.projectId || ''
      };
      socket.data.auth = premiumAuth;
      return premiumAuth;
    }
  }

  if (firebaseAdminStatus.enabled) {
    if (!idToken) {
      rejectRequest(socket, ack, 'Missing Firebase auth token.');
      return null;
    }

    try {
      const decoded = await verifyPlayerToken(idToken);
      const provider = decoded.firebase?.sign_in_provider ?? 'anonymous';
      const auth = {
        uid: decoded.uid,
        provider,
        verified: true
      };
      socket.data.auth = auth;
      return auth;
    } catch (error) {
      rejectRequest(socket, ack, `Identity verification failed. ${getSafeAuthError(error)}`);
      return null;
    }
  }

  if (socket.data.auth?.uid) {
    return socket.data.auth;
  }

  if (!ALLOW_INSECURE_LOCAL_AUTH) {
    rejectRequest(socket, ack, 'Server auth is not configured. Set Firebase Admin credentials before going live.');
    return null;
  }

  const fallbackId = String(payload?.playerId ?? '').trim();

  if (!fallbackId) {
    rejectRequest(socket, ack, 'Missing player identity.');
    return null;
  }

  const fallbackAuth = {
    uid: fallbackId,
    provider: String(payload?.authProvider ?? 'development'),
    verified: false
  };
  socket.data.auth = fallbackAuth;
  return fallbackAuth;
}

async function requirePlayerIdentity(socket, payload, ack) {
  const verifiedAuth = await authenticateSocketPlayer(socket, payload, ack);

  if (!verifiedAuth) {
    return null;
  }

  const player = normalizePlayer(payload, verifiedAuth);

  if (!player.playerId) {
    rejectRequest(socket, ack, 'Missing player identity.');
    return null;
  }

  socket.data.player = player;
  playerSockets.set(player.playerId, socket);
  await upsertProfile(player);
  return player;
}

function sanitizeInteger(value, { min = 0, max = 999 } = {}) {
  const numeric = Math.round(Number(value));
  const fallback = Number.isFinite(min) ? min : 0;
  return Number.isFinite(numeric)
    ? Math.max(min, Math.min(max, numeric))
    : fallback;
}

function sanitizeFloat(value, { min = 0, max = 999 } = {}) {
  const numeric = Number(value);
  const fallback = Number.isFinite(min) ? min : 0;
  return Number.isFinite(numeric)
    ? Math.max(min, Math.min(max, numeric))
    : fallback;
}

function sanitizeRaceStats(stats = {}) {
  return {
    overtakes: sanitizeInteger(stats.overtakes, { min: 0, max: 64 }),
    hazardHits: sanitizeInteger(stats.hazardHits, { min: 0, max: 64 }),
    driftReleases: sanitizeInteger(stats.driftReleases, { min: 0, max: 128 }),
    pickupsCollected: sanitizeInteger(stats.pickupsCollected, { min: 0, max: 64 }),
    boostSeconds: sanitizeFloat(stats.boostSeconds, { min: 0, max: 600 }),
    topSpeed: sanitizeFloat(stats.topSpeed, { min: 0, max: 250 })
  };
}

function getTrackMinFinishTime(trackId) {
  return MIN_FINISH_TIMES_MS[trackId] ?? 50000;
}

function getTier(rating = 1000) {
  if (rating >= 1650) {
    return 'Elite';
  }

  if (rating >= 1350) {
    return 'Gold';
  }

  if (rating >= 1100) {
    return 'Silver';
  }

  return 'Bronze';
}

async function getProfile(playerId, fallbackName = 'Pilot') {
  return sharedStateStore.getProfile(playerId, normalizeName(fallbackName));
}

async function upsertProfile(player) {
  if (!player.playerId) {
    return null;
  }

  return sharedStateStore.upsertProfile({
    ...player,
    name: normalizeName(player.name)
  });
}

async function buildLeaderboard(request = {}) {
  return sharedStateStore.buildLeaderboard(request);
}

async function removeFromQueues(playerId) {
  await sharedStateStore.removeFromQueues(playerId);
}

async function removePlayerFromRoom(playerId, message = null) {
  const room = await sharedStateStore.findRoomByPlayer(playerId);

  if (!room) {
    return null;
  }

  const index = room.players.findIndex((entry) => entry.player.playerId === playerId);

  if (index < 0) {
    return room;
  }

  const [removedPlayer] = room.players.splice(index, 1);
  addRoomFeed(room, message ?? `${removedPlayer?.player?.name ?? 'A pilot'} left the room.`);

  if (room.players.length === 0) {
    await sharedStateStore.deleteRoom(room.id);
    return null;
  }

  if (room.hostId === playerId) {
    room.hostId = room.players[0].player.playerId;
  }

  await sharedStateStore.saveRoom(room);
  return room;
}

function createRoomPlayerEntry(player, profile, options = {}) {
  return {
    player,
    snapshot: options.snapshot ?? null,
    lastSnapshotAt: options.lastSnapshotAt ?? 0,
    finishTime: Number.isFinite(options.finishTime) ? options.finishTime : null,
    place: Number.isFinite(options.place) ? options.place : null,
    result: options.result ?? null,
    ready: Boolean(options.ready),
    connected: options.connected !== false,
    reconnectDeadline: options.reconnectDeadline ?? 0,
    rating: Number(profile?.rating ?? options.rating ?? 1000),
    tier: String(options.tier ?? getTier(profile?.rating ?? options.rating ?? 1000)),
    ratingDelta: Number(options.ratingDelta ?? 0),
    ratingAfter: Number(options.ratingAfter ?? profile?.rating ?? options.rating ?? 1000),
    joinedAt: options.joinedAt ?? Date.now()
  };
}

function classifyEntry(room, entry, now = Date.now()) {
  if (!room?.startAt || !room.raceConfig || Number.isFinite(entry.finishTime)) {
    return false;
  }

  const travelledDistance = entry.snapshot?.distance ?? 0;

  if (travelledDistance < room.raceConfig.laps) {
    return false;
  }

  const elapsed = Math.max(0, now - room.startAt);

  if (elapsed < getTrackMinFinishTime(room.trackId)) {
    return false;
  }

  entry.finishTime = elapsed;
  entry.result = {
    stats: sanitizeRaceStats(entry.result?.stats ?? {}),
    finishTime: elapsed
  };

  return true;
}

function buildRoomView(room) {
  return {
    id: room.id,
    code: room.code,
    type: room.type,
    trackId: room.trackId,
    maxPlayers: room.maxPlayers,
    minPlayers: room.minPlayers,
    hostId: room.hostId,
    status: room.status,
    createdAt: room.createdAt,
    startAt: room.startAt,
    raceConfig: room.raceConfig,
    results: room.lastResults ?? null,
    feed: room.feed.slice(-8),
    players: room.players.map((entry) => {
      return {
        playerId: entry.player.playerId,
        name: entry.player.name,
        shipId: entry.player.shipId,
        cosmetics: entry.player.cosmetics,
        rating: Number(entry.rating ?? entry.ratingAfter ?? 1000),
        tier: String(entry.tier ?? getTier(entry.rating ?? 1000)),
        isHost: entry.player.playerId === room.hostId,
        ready: Boolean(entry.ready),
        connected: entry.connected !== false,
        snapshot: entry.snapshot,
        finishTime: entry.finishTime ?? null,
        place: entry.place ?? null
      };
    })
  };
}

function broadcastRoom(io, room) {
  io.to(room.id).emit('room:update', buildRoomView(room));
}

async function closeRoom(io, room, message) {
  if (!room) {
    return;
  }

  clearRaceTimeout(room.id);
  await sharedStateStore.deleteRoom(room.id);

  for (const entry of room.players) {
    const socket = playerSockets.get(entry.player.playerId);

    if (!socket) {
      continue;
    }

    leaveLocalRoom(socket, room.id);
    socket.emit('room:closed', {
      roomId: room.id,
      message
    });
  }
}

async function removeRoomPlayer(io, room, targetId, message, { notifyTarget = false } = {}) {
  if (!room) {
    return room;
  }

  const index = room.players.findIndex((entry) => entry.player.playerId === targetId);

  if (index < 0) {
    return room;
  }

  const [removedPlayer] = room.players.splice(index, 1);
  const removedSocket = playerSockets.get(removedPlayer.player.playerId);

  if (notifyTarget && removedSocket) {
    removedSocket.emit('room:kicked', {
      roomId: room.id,
      message
    });
    leaveLocalRoom(removedSocket, room.id);
  }

  addRoomFeed(room, message);

  if (room.players.length === 0) {
    await sharedStateStore.deleteRoom(room.id);
    return null;
  }

  if (room.hostId === targetId) {
    room.hostId = room.players[0].player.playerId;
  }

  await sharedStateStore.saveRoom(room);
  return room;
}

async function findRoomEntry(playerId) {
  const room = await sharedStateStore.findRoomByPlayer(playerId);

  if (!room) {
    return null;
  }

  const entry = room.players.find((item) => item.player.playerId === playerId);

  if (!entry) {
    return null;
  }

  return { room, entry };
}

async function restorePlayerConnection(io, socket, player) {
  const match = await findRoomEntry(player.playerId);

  if (!match) {
    return null;
  }

  const { room, entry } = match;
  const shouldAnnounce = entry.connected === false;
  const profile = await getProfile(player.playerId, player.name);
  entry.player = {
    ...entry.player,
    ...player
  };
  entry.connected = true;
  entry.reconnectDeadline = 0;
  entry.rating = profile.rating;
  entry.tier = getTier(profile.rating);
  joinLocalRoom(io, socket, room.id);

  if (shouldAnnounce) {
    addRoomFeed(room, `${player.name} reconnected to the room.`);
  }

  await sharedStateStore.saveRoom(room);

  if (room.status === 'countdown') {
    socket.emit('race:countdown', {
      room: buildRoomView(room),
      startAt: room.startAt,
      raceConfig: room.raceConfig
    });
  } else if (room.status === 'race') {
    socket.emit('race:state', {
      roomId: room.id,
      serverTime: Date.now(),
      racers: room.players.map((item) => ({
        playerId: item.player.playerId,
        name: item.player.name,
        snapshot: item.snapshot,
        place: item.place ?? null,
        finished: Number.isFinite(item.finishTime)
      }))
    });
  }

  return room;
}

async function scheduleReconnectExpiry(io, room, playerId) {
  const deadline = Date.now() + RECONNECT_GRACE_MS;
  const entry = room.players.find((item) => item.player.playerId === playerId);

  if (!entry) {
    return;
  }

  entry.connected = false;
  entry.ready = false;
  entry.reconnectDeadline = deadline;
  addRoomFeed(room, `${entry.player.name} disconnected. Holding the slot for reconnect.`);
  await sharedStateStore.saveRoom(room);

  if (reconnectTimeouts.has(`${room.id}:${playerId}`)) {
    clearTimeout(reconnectTimeouts.get(`${room.id}:${playerId}`));
  }

  const timeoutId = setTimeout(async () => {
    const liveRoom = await sharedStateStore.getRoom(room.id);

    if (!liveRoom) {
      return;
    }

    const liveEntry = liveRoom.players.find((item) => item.player.playerId === playerId);

    if (!liveEntry || liveEntry.connected || liveEntry.reconnectDeadline !== deadline) {
      return;
    }

    const nextRoom = await removeRoomPlayer(
      io,
      liveRoom,
      playerId,
      `${liveEntry.player.name} timed out and was removed from the room.`
    );

    if (nextRoom?.status === 'race') {
      await maybeFinalizeRoom(io, nextRoom);
    }
  }, RECONNECT_GRACE_MS + 50);

  reconnectTimeouts.set(`${room.id}:${playerId}`, timeoutId);
}

function addRoomFeed(room, text, type = 'system') {
  room.feed.push({
    at: Date.now(),
    text,
    type
  });
  room.feed = room.feed.slice(-14);
}

function chooseTrack(type, requestedTrackId) {
  if (type === 'private' && TRACK_POOL.includes(requestedTrackId)) {
    return requestedTrackId;
  }

  return TRACK_POOL[Math.floor(Math.random() * TRACK_POOL.length)];
}

function getTrackRoomRules(trackId) {
  return TRACK_ROOM_RULES[trackId] ?? { maxPlayers: 6, minPlayers: 2 };
}

function buildRaceConfig(room) {
  return {
    trackId: room.trackId ?? chooseTrack(room.type, room.players[0]?.player?.trackId),
    laps: 3,
    powerupsEnabled: false,
    hazardsEnabled: false,
    normalizedStats: true,
    type: room.type
  };
}

async function createRoomFromEntries(io, type, entries, options = {}) {
  const trackId = chooseTrack(type, options.trackId ?? entries[0].player.trackId);
  const roomRules = getTrackRoomRules(trackId);
  const players = [];

  for (const entry of entries) {
    const profile = await getProfile(entry.player.playerId, entry.player.name);
    players.push(createRoomPlayerEntry(entry.player, profile));
  }

  const room = {
    id: createRoomId(),
    code: options.privateCode ?? createRoomCode(),
    type,
    trackId,
    maxPlayers: roomRules.maxPlayers,
    minPlayers: roomRules.minPlayers,
    status: 'lobby',
    createdAt: Date.now(),
    startAt: null,
    raceTimeoutAt: null,
    hostId: entries[0].player.playerId,
    players,
    feed: []
  };

  await sharedStateStore.createRoom(room);

  for (const entry of entries) {
    if (entry.socket) {
      joinLocalRoom(io, entry.socket, room.id);
    }
  }

  addRoomFeed(room, `${room.players[0].player.name} opened a ${type} room.`);
  await sharedStateStore.saveRoom(room);
  return room;
}

async function maybeStartQueue(io, type) {
  if (type !== 'quick') {
    return;
  }

  const players = await sharedStateStore.claimQuickQueueGroup({
    minPlayers: 2,
    maxPlayers: 4
  });

  if (players.length < 2) {
    return;
  }

  const entries = players
    .map((player) => ({
      socket: playerSockets.get(player.playerId) ?? null,
      player
    }));

  const room = await createRoomFromEntries(io, type, entries);
  await startRoomRace(io, room);
}

async function startRoomRace(io, room) {
  if (!room || room.players.length < 2) {
    return;
  }

  if (room.players.some((entry) => entry.connected === false)) {
    return;
  }

  room.status = 'countdown';
  room.raceConfig = buildRaceConfig(room);
  room.startAt = Date.now() + 3000;
  room.lastResults = null;
  room.raceTimeoutAt = room.startAt + RACE_TIMEOUT_MS;

  for (const entry of room.players) {
    entry.ready = false;
    entry.snapshot = {
      progress: 0,
      distance: 0,
      lateralOffset: 0,
      speed: 0,
      boosting: false,
      drifting: false,
      lap: 1,
      steer: 0,
      throttle: 0
    };
    entry.lastSnapshotAt = room.startAt;
    entry.finishTime = null;
    entry.place = null;
    entry.result = {
      stats: sanitizeRaceStats({}),
      finishTime: null
    };
  }

  addRoomFeed(room, `${room.type === 'quick' ? 'Quick match' : 'Private room'} launch in 3...`);
  await sharedStateStore.saveRoom(room);
  io.to(room.id).emit('race:countdown', {
    room: buildRoomView(room),
    startAt: room.startAt,
    raceConfig: room.raceConfig
  });

  setTimeout(async () => {
    const liveRoom = await sharedStateStore.getRoom(room.id);

    if (!liveRoom || liveRoom.startAt !== room.startAt) {
      return;
    }

    liveRoom.status = 'race';
    addRoomFeed(liveRoom, 'Race live. Push the pace.');
    await sharedStateStore.saveRoom(liveRoom);
    scheduleRaceTimeout(io, liveRoom);
  }, Math.max(0, room.startAt - Date.now()));
}

async function getRoomByCode(code) {
  return sharedStateStore.getRoomByCode(code);
}

function getRoomRacers(room) {
  return room.players.map((entry) => ({
    playerId: entry.player.playerId,
    name: entry.player.name,
    snapshot: entry.snapshot,
    place: entry.place ?? null,
    finished: Number.isFinite(entry.finishTime)
  }));
}

function clearRaceTimeout(roomId) {
  if (!roomRaceTimeouts.has(roomId)) {
    return;
  }

  clearTimeout(roomRaceTimeouts.get(roomId));
  roomRaceTimeouts.delete(roomId);
}

function getNamespaceRoomSockets(io, roomId) {
  return io?.adapter?.rooms?.get(roomId) ?? io?.sockets?.adapter?.rooms?.get(roomId) ?? null;
}

function getNamespaceSocket(io, socketId) {
  return io?.sockets?.get?.(socketId) ?? io?.sockets?.sockets?.get?.(socketId) ?? null;
}

function ensureRoomSubscription(io, roomId) {
  if (roomSubscriptions.has(roomId)) {
    const existing = roomSubscriptions.get(roomId);
    existing.count += 1;
    roomSubscriptions.set(roomId, existing);
    return;
  }

  const unsubscribe = sharedStateStore.subscribeToRoom(roomId, (room) => {
    const previous = roomCache.get(roomId) ?? null;

    if (!room) {
      clearRaceTimeout(roomId);
      roomCache.delete(roomId);
      io.to(roomId).emit('room:closed', {
        roomId,
        message: previous?.feed?.slice(-1)[0]?.text ?? 'The room was closed.'
      });

      const localSockets = getNamespaceRoomSockets(io, roomId);

      if (localSockets) {
        for (const socketId of localSockets) {
          const localSocket = getNamespaceSocket(io, socketId);

          if (localSocket) {
            leaveLocalRoom(localSocket, roomId);
          }
        }
      }

      return;
    }

    roomCache.set(roomId, room);
    broadcastRoom(io, room);

    if (room.status === 'countdown' && (previous?.startAt !== room.startAt || previous?.status !== 'countdown')) {
      io.to(room.id).emit('race:countdown', {
        room: buildRoomView(room),
        startAt: room.startAt,
        raceConfig: room.raceConfig
      });
    }

    if (room.status === 'race') {
      io.to(room.id).emit('race:state', {
        roomId: room.id,
        serverTime: Date.now(),
        racers: getRoomRacers(room)
      });
      scheduleRaceTimeout(io, room);
    } else {
      clearRaceTimeout(room.id);
    }

    if (room.status === 'finished' && previous?.lastResults?.completedAt !== room.lastResults?.completedAt) {
      void buildLeaderboard({
        playerId: room.lastResults?.standings?.[0]?.playerId,
        friends: room.players.flatMap((entry) => entry.player.friends ?? [])
      }).then((leaderboard) => {
        io.to(room.id).emit('race:results', {
          room: buildRoomView(room),
          standings: room.lastResults?.standings ?? [],
          highlights: room.lastResults?.highlights ?? [],
          leaderboard
        });
      }).catch((error) => {
        console.error(`Failed to build leaderboard for room ${room.id}:`, error);
      });
    }

    const localSockets = getNamespaceRoomSockets(io, roomId);

    if (!localSockets) {
      return;
    }

    const memberIds = new Set(room.players.map((entry) => entry.player.playerId));

    for (const socketId of localSockets) {
      const localSocket = getNamespaceSocket(io, socketId);

      if (!localSocket) {
        continue;
      }

      const localPlayerId = localSocket.data.player?.playerId;

      if (!localPlayerId || memberIds.has(localPlayerId)) {
        continue;
      }

      localSocket.emit('room:kicked', {
        roomId,
        message: `${localSocket.data.player?.name ?? 'You'} were removed from the room.`
      });
      leaveLocalRoom(localSocket, roomId);
    }
  });

  roomSubscriptions.set(roomId, {
    count: 1,
    unsubscribe
  });
}

function releaseRoomSubscription(roomId) {
  if (!roomSubscriptions.has(roomId)) {
    return;
  }

  const current = roomSubscriptions.get(roomId);
  current.count -= 1;

  if (current.count > 0) {
    roomSubscriptions.set(roomId, current);
    return;
  }

  current.unsubscribe();
  roomSubscriptions.delete(roomId);
  roomCache.delete(roomId);
  clearRaceTimeout(roomId);
}

function joinLocalRoom(io, socket, roomId) {
  if (!socket || !roomId) {
    return;
  }

  const previousRoomId = socket.data.activeRoomId;

  if (previousRoomId && previousRoomId !== roomId) {
    leaveLocalRoom(socket, previousRoomId);
  }

  if (previousRoomId === roomId) {
    return;
  }

  socket.join(roomId);
  socket.data.activeRoomId = roomId;
  ensureRoomSubscription(io, roomId);
}

function leaveLocalRoom(socket, roomId = socket?.data?.activeRoomId, updateState = true) {
  if (!socket || !roomId) {
    return;
  }

  socket.leave(roomId);

  if (updateState && socket.data.activeRoomId === roomId) {
    socket.data.activeRoomId = null;
  }

  releaseRoomSubscription(roomId);
}

function scheduleRaceTimeout(io, room) {
  if (!room?.id || room.status !== 'race' || !room.raceTimeoutAt) {
    return;
  }

  clearRaceTimeout(room.id);
  const delay = Math.max(0, room.raceTimeoutAt - Date.now());
  const timeoutId = setTimeout(async () => {
    const liveRoom = await sharedStateStore.getRoom(room.id);

    if (!liveRoom || liveRoom.status !== 'race') {
      return;
    }

    addRoomFeed(liveRoom, 'Race timeout reached. Classifying by verified progress.');
    await sharedStateStore.saveRoom(liveRoom);
    await finalizeRoom(io, liveRoom);
  }, delay);

  roomRaceTimeouts.set(room.id, timeoutId);
}

function computeRatingChanges(room, standings) {
  const kFactor = room.type === 'quick' ? 24 : 16;
  const changes = new Map();

  for (const entry of standings) {
    changes.set(entry.player.playerId, 0);
  }

  for (let index = 0; index < standings.length; index += 1) {
    const playerA = standings[index];
    const ratingA = Number(playerA.ratingAfter ?? playerA.rating ?? 1000);

    for (let otherIndex = index + 1; otherIndex < standings.length; otherIndex += 1) {
      const playerB = standings[otherIndex];
      const ratingB = Number(playerB.ratingAfter ?? playerB.rating ?? 1000);
      const expectedA = 1 / (1 + 10 ** ((ratingB - ratingA) / 400));
      const expectedB = 1 - expectedA;
      const scoreA = 1;
      const scoreB = 0;

      changes.set(playerA.player.playerId, changes.get(playerA.player.playerId) + (scoreA - expectedA) * kFactor);
      changes.set(playerB.player.playerId, changes.get(playerB.player.playerId) + (scoreB - expectedB) * kFactor);
    }
  }

  return changes;
}

function generateHighlights(standings) {
  const highlights = [];

  if (standings.length >= 2 && Number.isFinite(standings[0].finishTime) && Number.isFinite(standings[1].finishTime)) {
    const gap = Math.abs(standings[1].finishTime - standings[0].finishTime) / 1000;

    if (gap < 1.5) {
      highlights.push(`Close finish: ${standings[0].player.name} beat ${standings[1].player.name} by ${gap.toFixed(2)}s.`);
    }
  }

  const overtakeKing = standings
    .map((entry) => ({
      name: entry.player.name,
      overtakes: entry.result?.stats?.overtakes ?? 0
    }))
    .sort((itemA, itemB) => itemB.overtakes - itemA.overtakes)[0];

  if (overtakeKing && overtakeKing.overtakes > 0) {
    highlights.push(`Overtake king: ${overtakeKing.name} carved through ${overtakeKing.overtakes} rivals.`);
  }

  const cleanWinner = standings.find((entry) => (entry.result?.stats?.hazardHits ?? 0) === 0);

  if (cleanWinner) {
    highlights.push(`Clean pressure: ${cleanWinner.player.name} finished with zero hazard hits.`);
  }

  return highlights.slice(0, 4);
}

async function finalizeRoom(io, room) {
  if (!room || room.status === 'finished') {
    return;
  }

  clearRaceTimeout(room.id);

  const standings = [...room.players].sort((entryA, entryB) => {
    const timeA = Number.isFinite(entryA.finishTime) ? entryA.finishTime : Number.POSITIVE_INFINITY;
    const timeB = Number.isFinite(entryB.finishTime) ? entryB.finishTime : Number.POSITIVE_INFINITY;

    if (timeA !== timeB) {
      return timeA - timeB;
    }

    const distanceA = entryA.snapshot?.distance ?? 0;
    const distanceB = entryB.snapshot?.distance ?? 0;
    return distanceB - distanceA;
  });

  standings.forEach((entry, index) => {
    entry.place = index + 1;
  });

  const ratingChanges = computeRatingChanges(room, standings);
  const highlights = generateHighlights(standings);
  const profileUpdates = [];

  for (const entry of standings) {
    const delta = Math.round(ratingChanges.get(entry.player.playerId) ?? 0);
    const nextRating = Math.max(800, Number(entry.rating ?? 1000) + delta);
    entry.ratingDelta = delta;
    entry.ratingAfter = nextRating;
    entry.rating = nextRating;
    entry.tier = getTier(nextRating);

    profileUpdates.push({
      playerId: entry.player.playerId,
      name: entry.player.name,
      rating: nextRating,
      races: Number(entry.player.races ?? 0),
      wins: Number(entry.player.wins ?? 0),
      podiums: Number(entry.player.podiums ?? 0),
      privateWins: Number(entry.player.privateWins ?? 0),
      tournamentWins: Number(entry.player.tournamentWins ?? 0)
    });
  }

  const existingProfiles = await Promise.all(standings.map((entry) => getProfile(entry.player.playerId, entry.player.name)));

  existingProfiles.forEach((profile, index) => {
    const entry = standings[index];
    profileUpdates[index] = {
      ...profile,
      playerId: entry.player.playerId,
      name: entry.player.name,
      rating: entry.ratingAfter,
      races: Number(profile.races ?? 0) + 1,
      wins: Number(profile.wins ?? 0) + (entry.place === 1 ? 1 : 0),
      podiums: Number(profile.podiums ?? 0) + (entry.place <= 3 ? 1 : 0),
      privateWins: Number(profile.privateWins ?? 0) + (room.type === 'private' && entry.place === 1 ? 1 : 0),
      tournamentWins: Number(profile.tournamentWins ?? 0)
    };
  });

  room.status = 'finished';
  room.raceTimeoutAt = null;
  room.lastResults = {
    completedAt: Date.now(),
    highlights,
    standings: standings.map((entry) => ({
      playerId: entry.player.playerId,
      name: entry.player.name,
      place: entry.place,
      finishTime: Number.isFinite(entry.finishTime) ? entry.finishTime : null,
      ratingDelta: entry.ratingDelta,
      ratingAfter: entry.ratingAfter,
      tier: getTier(entry.ratingAfter),
      stats: entry.result?.stats ?? {}
    }))
  };

  await sharedStateStore.updateProfiles(profileUpdates);
  await sharedStateStore.recordRecentRoom({
    id: room.id,
    code: room.code,
    type: room.type,
    completedAt: room.lastResults.completedAt,
    standings: room.lastResults.standings,
    highlights
  });
  await sharedStateStore.saveRoom(room);

  const leaderboard = await buildLeaderboard({
    playerId: standings[0]?.player.playerId,
    friends: room.players.flatMap((entry) => entry.player.friends ?? [])
  });

  io.to(room.id).emit('race:results', {
    room: buildRoomView(room),
    standings: room.lastResults.standings,
    highlights,
    leaderboard
  });

  broadcastRoom(io, room);
}

async function maybeFinalizeRoom(io, room) {
  if (room.status !== 'race') {
    return;
  }

  if (room.players.length <= 1) {
    await finalizeRoom(io, room);
    return;
  }

  const finishedCount = room.players.filter((entry) => Number.isFinite(entry.finishTime)).length;

  if (finishedCount === room.players.length) {
    await finalizeRoom(io, room);
  }
}

function registerPremiumSpaceshipRuntime(options = {}) {
  const app = options.app || express();
  const healthPath = options.healthPath || '/health';
  const server = options.httpServer || http.createServer(app);
  const resolveCorsOrigin = (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (MULTIPLAYER_ALLOWED_ORIGINS.length === 0) {
      callback(null, !IS_PRODUCTION);
      return;
    }

    callback(null, MULTIPLAYER_ALLOWED_ORIGINS.includes(origin));
  };

  const io = options.io || new Server(server, {
    cors: {
      origin: resolveCorsOrigin
    }
  });

  app.get(healthPath, async (_request, response) => {
    const health = await sharedStateStore.getHealth();
    response.json({
      ok: true,
      runtime: 'premium-spaceship-race',
      environment: IS_PRODUCTION ? 'production' : 'development',
      auth: {
        enabled: firebaseAdminStatus.enabled,
        mode: firebaseAdminStatus.mode,
        insecureFallback: ALLOW_INSECURE_LOCAL_AUTH,
        projectId: firebaseAdminStatus.projectId
      },
      stateStore: sharedStateStore.mode,
      rooms: health.rooms,
      queued: {
        quick: health.queuedQuick
      }
    });
  });

  setInterval(() => {
    for (const room of roomCache.values()) {
      if (room.status !== 'race') {
        continue;
      }

      io.to(room.id).emit('race:state', {
        roomId: room.id,
        serverTime: Date.now(),
        racers: getRoomRacers(room)
      });
    }
  }, SNAPSHOT_SYNC_INTERVAL_MS);

  async function getLiveRoom(roomId) {
    return roomCache.get(roomId) ?? sharedStateStore.getRoom(roomId);
  }

  setInterval(async () => {
    for (const [playerId, socket] of playerSockets.entries()) {
      if (!socket.data.queueingQuick || socket.data.activeRoomId) {
        continue;
      }

      const room = await sharedStateStore.findRoomByPlayer(playerId);

      if (!room) {
        continue;
      }

      socket.data.queueingQuick = false;
      joinLocalRoom(io, socket, room.id);
      socket.emit('room:update', buildRoomView(room));

      if (room.status === 'countdown') {
        socket.emit('race:countdown', {
          room: buildRoomView(room),
          startAt: room.startAt,
          raceConfig: room.raceConfig
        });
      }
    }
  }, 900);

  io.on('connection', (socket) => {
  socket.on('profile:sync', async (payload, ack) => {
    const player = await requirePlayerIdentity(socket, payload, ack);

    if (!player) {
      return;
    }

    const profile = await upsertProfile(player);
    const restoredRoom = await restorePlayerConnection(io, socket, player);
    const profileAck = {
      playerId: profile.playerId,
      name: profile.name,
      rating: profile.rating,
      tier: getTier(profile.rating),
      verified: Boolean(socket.data.auth?.verified),
      authMode: firebaseAdminStatus.enabled ? 'verified' : 'local-dev'
    };

    socket.emit('profile:ack', profileAck);

    if (restoredRoom) {
      socket.emit('room:update', buildRoomView(restoredRoom));
    }

    socket.emit('leaderboard:update', await buildLeaderboard({
      playerId: player.playerId,
      friends: player.friends
    }));

    resolveRequest(ack, {
      profile: profileAck
    });
  });

  socket.on('leaderboard:request', async () => {
    const player = socket.data.player;

    if (!player) {
      return;
    }

    socket.emit('leaderboard:update', await buildLeaderboard({
      playerId: player.playerId,
      friends: player.friends
    }));
  });

  socket.on('match:quick', async (payload, ack) => {
    const player = await requirePlayerIdentity(socket, payload, ack);

    if (!player) {
      return;
    }

    await removeFromQueues(player.playerId);
    await removePlayerFromRoom(player.playerId);
    await sharedStateStore.enqueueQuick(player);
    socket.data.queueingQuick = true;
    socket.emit('leaderboard:update', await buildLeaderboard({
      playerId: player.playerId,
      friends: player.friends
    }));
    await maybeStartQueue(io, 'quick');
    resolveRequest(ack, {
      message: 'Queued for quick match.'
    });
  });

  socket.on('room:create-private', async (payload, ack) => {
    const player = await requirePlayerIdentity(socket, payload, ack);

    if (!player) {
      return;
    }

    await removeFromQueues(player.playerId);
    await removePlayerFromRoom(player.playerId);
    const room = await createRoomFromEntries(io, 'private', [{ socket, player }], {
      privateCode: createRoomCode(),
      trackId: player.trackId
    });
    resolveRequest(ack, {
      room: buildRoomView(room),
      message: `Private room ${room.code} created.`
    });
  });

  socket.on('room:join-private', async (payload, ack) => {
    const player = await requirePlayerIdentity(socket, payload, ack);

    if (!player) {
      return;
    }

    await removeFromQueues(player.playerId);
    await removePlayerFromRoom(player.playerId);

    const room = await getRoomByCode(payload.code);

    if (!room) {
      rejectRequest(socket, ack, 'Private room not found.');
      return;
    }

    if (room.status !== 'lobby') {
      rejectRequest(socket, ack, 'That private room is already racing.');
      return;
    }

    if (room.players.length >= room.maxPlayers) {
      rejectRequest(socket, ack, `That private room is full at ${room.maxPlayers} pilots.`);
      return;
    }

    if (room.players.some((entry) => entry.player.playerId === player.playerId)) {
      const restored = await restorePlayerConnection(io, socket, player);
      resolveRequest(ack, {
        room: restored ? buildRoomView(restored) : buildRoomView(room),
        message: `Rejoined room ${room.code}.`
      });
      return;
    }

    const profile = await getProfile(player.playerId, player.name);
    room.players.push(createRoomPlayerEntry(player, profile));
    addRoomFeed(room, `${player.name} joined private room ${room.code}.`);
    await sharedStateStore.saveRoom(room);
    joinLocalRoom(io, socket, room.id);
    resolveRequest(ack, {
      room: buildRoomView(room),
      message: `Joined room ${room.code}.`
    });
  });

  socket.on('room:toggle-ready', async ({ roomId } = {}, ack) => {
    const room = await getLiveRoom(roomId);
    const playerId = socket.data.player?.playerId;

    if (!room || room.type !== 'private' || room.status !== 'lobby' || !playerId) {
      rejectRequest(socket, ack, 'Only pilots in a private lobby can update ready state.');
      return;
    }

    const entry = room.players.find((item) => item.player.playerId === playerId);

    if (!entry) {
      rejectRequest(socket, ack, 'You are not in that room.');
      return;
    }

    entry.ready = !entry.ready;
    addRoomFeed(room, `${entry.player.name} is ${entry.ready ? 'ready' : 'not ready'} for launch.`);
    await sharedStateStore.saveRoom(room);
    resolveRequest(ack, {
      room: buildRoomView(room),
      message: entry.ready ? 'Ready for launch.' : 'Marked not ready.'
    });
  });

  socket.on('room:transfer-host', async ({ roomId, targetId } = {}, ack) => {
    const room = await getLiveRoom(roomId);
    const playerId = socket.data.player?.playerId;

    if (!room || room.type !== 'private' || room.status !== 'lobby' || room.hostId !== playerId) {
      rejectRequest(socket, ack, 'Only the current host can transfer host control.');
      return;
    }

    const target = room.players.find((item) => item.player.playerId === targetId);

    if (!target) {
      rejectRequest(socket, ack, 'That pilot is no longer in the room.');
      return;
    }

    room.hostId = target.player.playerId;
    addRoomFeed(room, `${target.player.name} is now the host.`);
    await sharedStateStore.saveRoom(room);
    resolveRequest(ack, {
      room: buildRoomView(room),
      message: `${target.player.name} is now the host.`
    });
  });

  socket.on('room:rematch', async ({ roomId } = {}, ack) => {
    const room = await getLiveRoom(roomId);
    const playerId = socket.data.player?.playerId;

    if (!room || room.type !== 'private' || room.status !== 'finished' || room.hostId !== playerId) {
      rejectRequest(socket, ack, 'Only the private room host can queue a rematch.');
      return;
    }

    room.status = 'lobby';
    room.startAt = null;
    room.lastResults = null;
    room.raceConfig = null;
    room.raceTimeoutAt = null;

    for (const entry of room.players) {
      entry.snapshot = null;
      entry.lastSnapshotAt = 0;
      entry.finishTime = null;
      entry.place = null;
      entry.result = {
        stats: sanitizeRaceStats({}),
        finishTime: null
      };
      entry.ready = entry.player.playerId === room.hostId;
    }

    addRoomFeed(room, 'Rematch staged. Lock in and get ready for another launch.');
    await sharedStateStore.saveRoom(room);
    resolveRequest(ack, {
      room: buildRoomView(room),
      message: 'Rematch lobby staged.'
    });
  });

  socket.on('room:start', async ({ roomId } = {}, ack) => {
    const room = await getLiveRoom(roomId);
    const playerId = socket.data.player?.playerId;

    if (!room || room.hostId !== playerId) {
      rejectRequest(socket, ack, 'Only the host can launch this room.');
      return;
    }

    if (room.players.length < room.minPlayers) {
      rejectRequest(socket, ack, `Need at least ${room.minPlayers} pilots to start.`);
      return;
    }

    if (room.players.some((entry) => entry.connected === false)) {
      rejectRequest(socket, ack, 'A pilot is reconnecting. Wait for everyone to come back online.');
      return;
    }

    if (room.players.some((entry) => !entry.ready && entry.player.playerId !== playerId)) {
      rejectRequest(socket, ack, 'Every pilot must mark ready before launch.');
      return;
    }

    await startRoomRace(io, room);
    resolveRequest(ack, {
      room: buildRoomView(room),
      message: 'Private room launch started.'
    });
  });

  socket.on('room:kick', async ({ roomId, targetId } = {}, ack) => {
    const room = await getLiveRoom(roomId);
    const playerId = socket.data.player?.playerId;

    if (!room || room.hostId !== playerId || room.status !== 'lobby') {
      rejectRequest(socket, ack, 'Only the host can remove players from this lobby.');
      return;
    }

    if (!targetId || targetId === playerId) {
      rejectRequest(socket, ack, 'Choose another pilot to remove.');
      return;
    }

    const targetEntry = room.players.find((entry) => entry.player.playerId === targetId);

    if (!targetEntry) {
      rejectRequest(socket, ack, 'That pilot is no longer in the room.');
      return;
    }

    const nextRoom = await removeRoomPlayer(
      io,
      room,
      targetId,
      `${targetEntry.player.name} was removed from the room by the host.`,
      { notifyTarget: true }
    );

    resolveRequest(ack, {
      room: nextRoom ? buildRoomView(nextRoom) : null,
      message: `${targetEntry.player.name} removed from the room.`
    });
  });

  socket.on('room:discard', async ({ roomId } = {}, ack) => {
    const room = await getLiveRoom(roomId);
    const playerId = socket.data.player?.playerId;

    if (!room || room.hostId !== playerId || room.status !== 'lobby') {
      rejectRequest(socket, ack, 'Only the host can discard this room.');
      return;
    }

    await closeRoom(io, room, `${socket.data.player?.name ?? 'The host'} discarded the private room.`);
    resolveRequest(ack, {
      message: 'Private room discarded.'
    });
  });

  socket.on('room:leave', async ({ roomId } = {}, ack) => {
    const playerId = socket.data.player?.playerId;

    if (!playerId) {
      rejectRequest(socket, ack, 'Missing player identity.');
      return;
    }

    await removeFromQueues(playerId);
    const room = roomId ? await getLiveRoom(roomId) : null;
    const nextRoom = room
      ? (room.players.some((entry) => entry.player.playerId === playerId) ? await removePlayerFromRoom(playerId) ?? room : room)
      : await removePlayerFromRoom(playerId);

    leaveLocalRoom(socket, roomId ?? socket.data.activeRoomId);

    resolveRequest(ack, {
      room: nextRoom ? buildRoomView(nextRoom) : null,
      message: 'Left room.'
    });
  });

  socket.on('social:emote', async ({ roomId, emote } = {}) => {
    const room = await getLiveRoom(roomId);
    const player = socket.data.player;

    if (!room || !player) {
      return;
    }

    if (!room.players.some((entry) => entry.player.playerId === player.playerId)) {
      return;
    }

    const payload = {
      at: Date.now(),
      playerId: player.playerId,
      name: player.name,
      emote: String(emote ?? '').slice(0, 48)
    };

    addRoomFeed(room, `${player.name}: ${payload.emote}`, 'emote');
    await sharedStateStore.saveRoom(room);
    io.to(room.id).emit('social:emote', payload);
  });

  socket.on('race:snapshot', async ({ roomId, snapshot } = {}) => {
    const room = await getLiveRoom(roomId);
    const playerId = socket.data.player?.playerId;

    if (!room || room.status !== 'race' || !playerId) {
      return;
    }

    const entry = room.players.find((item) => item.player.playerId === playerId);

    if (!entry) {
      return;
    }

    const now = Date.now();
    const previousSnapshot = entry.snapshot;
    const elapsedSeconds = Math.max(0.05, (now - Math.max(room.startAt ?? now, entry.lastSnapshotAt || room.startAt || now)) / 1000);
    const maxDistanceIncrease = elapsedSeconds * MAX_DISTANCE_RATE + SNAPSHOT_DISTANCE_BUFFER;

    const safeSnapshot = {
      progress: Math.max(0, Math.min(1, Number(snapshot.progress ?? 0))),
      distance: Math.max(0, Number(snapshot.distance ?? 0)),
      lateralOffset: Math.max(-50, Math.min(50, Number(snapshot.lateralOffset ?? 0))),
      speed: Math.max(0, Math.min(MAX_SNAPSHOT_SPEED, Number(snapshot.speed ?? 0))),
      boosting: Boolean(snapshot.boosting),
      drifting: Boolean(snapshot.drifting),
      lap: Math.max(1, Math.min(room.raceConfig.laps, Number(snapshot.lap ?? 1))),
      throttle: Math.max(0, Math.min(1, Number(snapshot.throttle ?? 0))),
      steer: Math.max(-1, Math.min(1, Number(snapshot.steer ?? 0)))
    };

    if (previousSnapshot) {
      if (safeSnapshot.distance + 0.15 < previousSnapshot.distance) {
        safeSnapshot.distance = previousSnapshot.distance;
      }

      if (safeSnapshot.distance > previousSnapshot.distance + maxDistanceIncrease) {
        safeSnapshot.distance = previousSnapshot.distance + maxDistanceIncrease;
      }

      if (safeSnapshot.lap < previousSnapshot.lap) {
        safeSnapshot.lap = previousSnapshot.lap;
      }

      if (safeSnapshot.lap > previousSnapshot.lap + 1) {
        safeSnapshot.lap = previousSnapshot.lap + 1;
      }
    }

    entry.snapshot = safeSnapshot;
    entry.lastSnapshotAt = now;
    roomCache.set(room.id, room);

    if (classifyEntry(room, entry, now)) {
      addRoomFeed(room, `${entry.player.name} is classified in P${room.players.filter((item) => Number.isFinite(item.finishTime)).length}.`);
      await sharedStateStore.saveRoom(room);
      await maybeFinalizeRoom(io, room);
      return;
    }

    io.to(room.id).emit('race:state', {
      roomId: room.id,
      serverTime: now,
      racers: getRoomRacers(room)
    });

    if (!socket.data.lastSnapshotPersistAt || now - socket.data.lastSnapshotPersistAt >= SNAPSHOT_SYNC_INTERVAL_MS) {
      socket.data.lastSnapshotPersistAt = now;
      await sharedStateStore.saveRoomPlayer(room.id, entry);
    }
  });

  socket.on('race:finish', async ({ roomId, result } = {}) => {
    const room = await getLiveRoom(roomId);
    const playerId = socket.data.player?.playerId;

    if (!room || room.status !== 'race' || !playerId) {
      return;
    }

    const entry = room.players.find((item) => item.player.playerId === playerId);

    if (!entry) {
      return;
    }

    entry.result = {
      stats: sanitizeRaceStats(result?.stats ?? {}),
      finishTime: Number.isFinite(entry.finishTime) ? entry.finishTime : null
    };

    if (classifyEntry(room, entry, Date.now())) {
      addRoomFeed(room, `${entry.player.name} is classified in P${room.players.filter((item) => Number.isFinite(item.finishTime)).length}.`);
      await sharedStateStore.saveRoom(room);
    } else {
      await sharedStateStore.saveRoomPlayer(room.id, entry);
    }

    await maybeFinalizeRoom(io, room);
  });

  socket.on('disconnect', async () => {
    const playerId = socket.data.player?.playerId;

    if (!playerId) {
      return;
    }

    playerSockets.delete(playerId);
    await removeFromQueues(playerId);
    const match = await findRoomEntry(playerId);

    if (match) {
      await scheduleReconnectExpiry(io, match.room, playerId);
    }

    leaveLocalRoom(socket, socket.data.activeRoomId);
  });
  });

  return {
    app,
    httpServer: server,
    io
  };
}

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
  const { httpServer } = registerPremiumSpaceshipRuntime();
  httpServer.listen(PORT, () => {
    console.log(`Multiplayer server listening on http://localhost:${PORT}`);
    console.log(`Auth mode: ${firebaseAdminStatus.enabled ? firebaseAdminStatus.mode : 'disabled'}${ALLOW_INSECURE_LOCAL_AUTH ? ' (local fallback enabled)' : ''}`);
  });
}

export { registerPremiumSpaceshipRuntime };
