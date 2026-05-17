const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { Server } = require("socket.io");

const ROOT_DIR = __dirname;
const DEFAULT_PORT = Number.parseInt(process.env.PORT || "3000", 10);
const ROOM_ID_LENGTH = 5;
const TICK_RATE = 20;
const TICK_MS = 1000 / TICK_RATE;
const PLAYER_RADIUS = 1.4;
const ROOM_MIN_PLAYERS = 2;
const ROOM_MAX_PLAYERS = 5;

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".wav": "audio/wav",
  ".webp": "image/webp",
};

const GAME_CONFIG = {
  arena: {
    initialRadius: 20,
    minimumRadius: 7,
    shrinkDelay: 10,
    shrinkRate: 0.36,
    fallLimit: -14,
  },
  cars: {
    mass: 96,
    rideHeight: 0.62,
    maxForwardSpeed: 18,
    maxReverseSpeed: 8.5,
    engineForce: 760,
    reverseForce: 420,
    turnRate: 2.75,
    driveAuthority: 6.4,
    idleBrake: 4.6,
    grip: 0.22,
    boostDuration: 1.05,
    boostCooldown: 4.8,
    boostSpeedMultiplier: 1.75,
    boostTurnMultiplier: 1.08,
  },
  powerups: {
    maxActive: 4,
    minRespawn: 2.4,
    maxRespawn: 5.2,
    spawnMargin: 3.2,
    pickupRadius: 1.85,
  },
};

const ARENA_TYPES = {
  standard: {
    physics: {
      gripMultiplier: 1,
      engineMultiplier: 1,
      topSpeedMultiplier: 1,
      reverseMultiplier: 1,
      steerMultiplier: 1,
    },
  },
  ice: {
    physics: {
      gripMultiplier: 0.34,
      engineMultiplier: 0.92,
      topSpeedMultiplier: 1.14,
      reverseMultiplier: 0.9,
      steerMultiplier: 0.76,
    },
  },
  sand: {
    physics: {
      gripMultiplier: 1.42,
      engineMultiplier: 0.72,
      topSpeedMultiplier: 0.76,
      reverseMultiplier: 0.74,
      steerMultiplier: 0.9,
    },
  },
  moving: {
    physics: {
      gripMultiplier: 0.96,
      engineMultiplier: 1.02,
      topSpeedMultiplier: 1.02,
      reverseMultiplier: 1,
      steerMultiplier: 1.04,
    },
    motion: {
      shiftX: 1.05,
      shiftZ: 0.82,
      shiftSpeed: 0.42,
      yawAmplitude: 0.11,
      yawSpeed: 0.28,
      carAssist: 1.2,
    },
  },
};

const POWERUP_TYPES = {
  speed: {
    label: "Speed Boost",
    color: 0x59c8ff,
    cssColor: "#59c8ff",
    duration: 8,
    speedMultiplier: 1.38,
  },
  knockback: {
    label: "Knockback Boost",
    color: 0xff9364,
    cssColor: "#ff9364",
    duration: 7,
    knockbackMultiplier: 2.25,
  },
  shield: {
    label: "Shield",
    color: 0xffd76b,
    cssColor: "#ffd76b",
    duration: 9,
    charges: 1,
  },
  weight: {
    label: "Weight Boost",
    color: 0x88dd74,
    cssColor: "#88dd74",
    duration: 8,
    massMultiplier: 1.7,
  },
};

const rooms = new Map();

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function normalizeAngle(angle) {
  let nextAngle = angle;
  while (nextAngle > Math.PI) {
    nextAngle -= Math.PI * 2;
  }
  while (nextAngle < -Math.PI) {
    nextAngle += Math.PI * 2;
  }
  return nextAngle;
}

function roundValue(value) {
  return Math.round(value * 1000) / 1000;
}

function sendJson(response, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2);
  response.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body),
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(body);
}

function getLocalNetworkUrls(port) {
  const urls = [];
  const interfaces = os.networkInterfaces();

  Object.values(interfaces).forEach((entries) => {
    (entries || []).forEach((entry) => {
      if (entry.family === "IPv4" && !entry.internal) {
        urls.push(`http://${entry.address}:${port}`);
      }
    });
  });

  return urls;
}

function resolveRequestPath(requestUrl) {
  const parsedUrl = new URL(requestUrl, "http://localhost");
  let pathname = decodeURIComponent(parsedUrl.pathname);

  if (pathname === "/") {
    pathname = "/index.html";
  }

  const relativePath = pathname.replace(/^\/+/, "");
  const absolutePath = path.resolve(ROOT_DIR, relativePath);

  if (!absolutePath.startsWith(ROOT_DIR)) {
    return null;
  }

  return absolutePath;
}

function serveFile(filePath, response, method) {
  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      sendJson(response, 404, { error: "File not found." });
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extension] || "application/octet-stream";
    const isDevAsset = [".html", ".css", ".js", ".mjs"].includes(extension);
    const headers = {
      "Cache-Control": isDevAsset ? "no-store, max-age=0" : "no-cache",
      "Content-Length": stats.size,
      "Content-Type": contentType,
    };

    response.writeHead(200, headers);

    if (method === "HEAD") {
      response.end();
      return;
    }

    const stream = fs.createReadStream(filePath);
    stream.on("error", () => {
      if (!response.headersSent) {
        sendJson(response, 500, { error: "Unable to read the requested file." });
      } else {
        response.destroy();
      }
    });
    stream.pipe(response);
  });
}

function sanitizeRoomId(roomId) {
  return String(roomId || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, ROOM_ID_LENGTH);
}

function sanitizeArenaId(arenaId) {
  return ARENA_TYPES[arenaId] ? arenaId : "standard";
}

function createRoomId() {
  let roomId = "";
  do {
    roomId = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, ROOM_ID_LENGTH);
  } while (roomId.length < ROOM_ID_LENGTH || rooms.has(roomId));
  return roomId;
}

function createRoomState(roomId, arenaId) {
  return {
    id: roomId,
    arenaId: sanitizeArenaId(arenaId),
    phase: "lobby",
    message: "Waiting for the host to start the match.",
    winnerId: null,
    hostId: null,
    elapsed: 0,
    safeRadius: GAME_CONFIG.arena.initialRadius,
    powerUps: [],
    nextPowerUpAt: 1.8,
    players: new Map(),
    nextJoinOrder: 0,
    arenaMotion: {
      offsetX: 0,
      offsetZ: 0,
      yaw: 0,
      velX: 0,
      velZ: 0,
      yawVelocity: 0,
    },
    lastTickAt: Date.now(),
  };
}

function createPlayerState(socketId, index) {
  return {
    id: socketId,
    name: `Driver ${index + 1}`,
    colorIndex: index,
    joinOrder: index,
    x: 0,
    z: 0,
    y: GAME_CONFIG.cars.rideHeight,
    vx: 0,
    vz: 0,
    angle: 0,
    turnVelocity: 0,
    active: true,
    input: {
      throttle: 0,
      steer: 0,
    },
    boost: {
      activeUntil: 0,
      cooldownUntil: 0,
    },
    effects: {},
  };
}

function getOrderedPlayers(room) {
  return Array.from(room.players.values()).sort((first, second) => first.joinOrder - second.joinOrder);
}

function getSpawnPoints(count) {
  const safeCount = Math.max(count, 1);
  const radius = GAME_CONFIG.arena.initialRadius * 0.55;
  const points = [];

  for (let index = 0; index < safeCount; index += 1) {
    const angle = (index / safeCount) * Math.PI * 2 - Math.PI * 0.5;
    points.push({
      x: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
      angle: normalizeAngle(-angle - Math.PI * 0.5),
    });
  }

  return points;
}

function resetPlayerForMatch(player, spawnPoint) {
  player.x = spawnPoint.x;
  player.z = spawnPoint.z;
  player.y = GAME_CONFIG.cars.rideHeight;
  player.vx = 0;
  player.vz = 0;
  player.angle = spawnPoint.angle;
  player.turnVelocity = 0;
  player.active = true;
  player.input.throttle = 0;
  player.input.steer = 0;
  player.boost.activeUntil = 0;
  player.boost.cooldownUntil = 0;
  player.effects = {};
}

function updateArenaMotion(room, dt) {
  const motion = ARENA_TYPES[room.arenaId].motion;
  const previous = { ...room.arenaMotion };

  if (!motion || room.phase !== "running") {
    room.arenaMotion.offsetX = 0;
    room.arenaMotion.offsetZ = 0;
    room.arenaMotion.yaw = 0;
  } else {
    room.arenaMotion.offsetX = Math.sin(room.elapsed * motion.shiftSpeed) * motion.shiftX;
    room.arenaMotion.offsetZ = Math.sin(room.elapsed * motion.shiftSpeed * 1.35) * motion.shiftZ;
    room.arenaMotion.yaw = Math.sin(room.elapsed * motion.yawSpeed) * motion.yawAmplitude;
  }

  const safeDt = Math.max(dt, 1 / TICK_RATE);
  room.arenaMotion.velX = (room.arenaMotion.offsetX - previous.offsetX) / safeDt;
  room.arenaMotion.velZ = (room.arenaMotion.offsetZ - previous.offsetZ) / safeDt;
  room.arenaMotion.yawVelocity = (room.arenaMotion.yaw - previous.yaw) / safeDt;
}

function getArenaCenter(room) {
  return {
    x: room.arenaMotion.offsetX,
    z: room.arenaMotion.offsetZ,
  };
}

function getPlayerModifiers(player) {
  return {
    speedMultiplier: player.effects.speed ? POWERUP_TYPES.speed.speedMultiplier : 1,
    knockbackMultiplier: player.effects.knockback ? POWERUP_TYPES.knockback.knockbackMultiplier : 1,
    massMultiplier: player.effects.weight ? POWERUP_TYPES.weight.massMultiplier : 1,
    shieldCharges: player.effects.shield ? player.effects.shield.charges : 0,
  };
}

function clearExpiredEffects(room, player) {
  Object.values(player.effects).forEach((effect) => {
    if (effect.expiresAt <= room.elapsed) {
      delete player.effects[effect.type];
    }
  });
}

function applyPowerUp(player, type, room) {
  const definition = POWERUP_TYPES[type];
  const existing = player.effects[type];

  player.effects[type] = {
    type,
    label: definition.label,
    color: definition.color,
    cssColor: definition.cssColor,
    expiresAt: room.elapsed + definition.duration,
    charges: definition.charges || 0,
  };

  if (existing && type === "shield") {
    player.effects[type].charges = 1;
  }
}

function activateBoost(room, player) {
  if (!player.active) {
    return false;
  }

  if (player.boost.cooldownUntil > room.elapsed) {
    return false;
  }

  player.boost.activeUntil = room.elapsed + GAME_CONFIG.cars.boostDuration;
  player.boost.cooldownUntil = room.elapsed + GAME_CONFIG.cars.boostCooldown;
  return true;
}

function scheduleNextPowerUp(room) {
  const delay =
    GAME_CONFIG.powerups.minRespawn +
    Math.random() * (GAME_CONFIG.powerups.maxRespawn - GAME_CONFIG.powerups.minRespawn);
  room.nextPowerUpAt = room.elapsed + delay;
}

function spawnPowerUp(room) {
  if (room.powerUps.length >= GAME_CONFIG.powerups.maxActive) {
    scheduleNextPowerUp(room);
    return;
  }

  const safeRadius = Math.min(
    room.safeRadius - GAME_CONFIG.powerups.spawnMargin,
    GAME_CONFIG.arena.initialRadius - 1.5,
  );

  if (safeRadius <= 2.5) {
    scheduleNextPowerUp(room);
    return;
  }

  const center = getArenaCenter(room);
  const powerUpTypes = Object.keys(POWERUP_TYPES);

  for (let attempt = 0; attempt < 24; attempt += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 2 + Math.random() * Math.max(safeRadius - 2, 1);
    const x = center.x + Math.cos(angle) * radius;
    const z = center.z + Math.sin(angle) * radius;

    const tooCloseToPlayer = Array.from(room.players.values()).some(
      (player) => player.active && Math.hypot(player.x - x, player.z - z) < 4.8,
    );
    const tooCloseToPowerUp = room.powerUps.some((powerUp) => Math.hypot(powerUp.x - x, powerUp.z - z) < 4.2);

    if (tooCloseToPlayer || tooCloseToPowerUp) {
      continue;
    }

    const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    room.powerUps.push({
      id: `${room.id}-${Math.random().toString(36).slice(2, 9)}`,
      type,
      x,
      z,
      pulseOffset: Math.random() * Math.PI * 2,
      spinSpeed: 0.9 + Math.random() * 1.1,
    });
    break;
  }

  scheduleNextPowerUp(room);
}

function useShieldSave(room, player) {
  if (!player.effects.shield || player.effects.shield.charges <= 0) {
    return false;
  }

  player.effects.shield.charges = 0;
  delete player.effects.shield;

  const center = getArenaCenter(room);
  const angle = Math.atan2(player.z - center.z || 0.001, player.x - center.x || 0.001);
  const rescueRadius = Math.max(1.8, Math.min(room.safeRadius - 2.4, 5.8));
  const rescueX = center.x + Math.cos(angle) * rescueRadius * 0.45;
  const rescueZ = center.z + Math.sin(angle) * rescueRadius * 0.45;

  player.x = rescueX;
  player.z = rescueZ;
  player.vx = (center.x - rescueX) * 1.35;
  player.vz = (center.z - rescueZ) * 1.35;
  return true;
}

function updatePlayerMotion(room, player, dt) {
  clearExpiredEffects(room, player);
  if (!player.active) {
    return;
  }

  const arena = ARENA_TYPES[room.arenaId].physics;
  const modifiers = getPlayerModifiers(player);
  const boostMultiplier = player.boost.activeUntil > room.elapsed ? GAME_CONFIG.cars.boostSpeedMultiplier : 1;
  const turnBoostMultiplier = player.boost.activeUntil > room.elapsed ? GAME_CONFIG.cars.boostTurnMultiplier : 1;
  const maxForwardSpeed =
    GAME_CONFIG.cars.maxForwardSpeed * arena.topSpeedMultiplier * modifiers.speedMultiplier * boostMultiplier;
  const maxReverseSpeed = GAME_CONFIG.cars.maxReverseSpeed * arena.reverseMultiplier;
  const engineAcceleration =
    (GAME_CONFIG.cars.engineForce * arena.engineMultiplier * modifiers.speedMultiplier * boostMultiplier) /
    (GAME_CONFIG.cars.mass * modifiers.massMultiplier);
  const reverseAcceleration =
    (GAME_CONFIG.cars.reverseForce * arena.reverseMultiplier) /
    (GAME_CONFIG.cars.mass * modifiers.massMultiplier);
  const frameScale = dt * 60;
  const steerStrength = Math.abs(player.input.steer);
  const planarSpeed = Math.hypot(player.vx, player.vz);

  const turnTarget =
    player.input.steer *
    GAME_CONFIG.cars.turnRate *
    arena.steerMultiplier *
    turnBoostMultiplier *
    lerp(0.72, 1.08, clamp(planarSpeed / 8, 0, 1));
  player.turnVelocity = lerp(player.turnVelocity, turnTarget, clamp(dt * 9, 0, 1));
  player.angle = normalizeAngle(player.angle + player.turnVelocity * dt);

  const forwardX = Math.sin(player.angle);
  const forwardZ = Math.cos(player.angle);
  const rightX = Math.cos(player.angle);
  const rightZ = -Math.sin(player.angle);

  const forwardSpeed = player.vx * forwardX + player.vz * forwardZ;
  const lateralSpeed = player.vx * rightX + player.vz * rightZ;
  const gripForce = clamp(
    (GAME_CONFIG.cars.grip * 2.2 + steerStrength * 0.14) * arena.gripMultiplier * frameScale,
    0.16,
    0.94,
  );

  let desiredForwardSpeed = 0;
  if (player.input.throttle > 0.01) {
    desiredForwardSpeed = player.input.throttle * maxForwardSpeed;
  } else if (player.input.throttle < -0.01) {
    desiredForwardSpeed = player.input.throttle * maxReverseSpeed;
  }

  const speedGap = desiredForwardSpeed - forwardSpeed;
  const accelerationRate =
    desiredForwardSpeed >= forwardSpeed
      ? engineAcceleration * 1.5
      : reverseAcceleration * 1.7 + GAME_CONFIG.cars.idleBrake;
  const forwardBlend = clamp(dt * accelerationRate, 0, speedGap >= 0 ? 1 : 0.24);
  const nextForwardSpeed = forwardSpeed + speedGap * forwardBlend;
  const nextLateralSpeed = lerp(lateralSpeed, 0, gripForce);
  const desiredVelocityX = forwardX * nextForwardSpeed + rightX * nextLateralSpeed;
  const desiredVelocityZ = forwardZ * nextForwardSpeed + rightZ * nextLateralSpeed;
  const controlAuthority = clamp(dt * (GAME_CONFIG.cars.driveAuthority + steerStrength * 1.4), 0, 1);

  player.vx = lerp(player.vx, desiredVelocityX, controlAuthority);
  player.vz = lerp(player.vz, desiredVelocityZ, controlAuthority);

  const limitedSpeed = Math.hypot(player.vx, player.vz);
  const maxPlanarSpeed = maxForwardSpeed * 1.12;
  if (limitedSpeed > maxPlanarSpeed) {
    const scale = maxPlanarSpeed / limitedSpeed;
    player.vx *= scale;
    player.vz *= scale;
  }

  if (Math.abs(player.input.throttle) > 0.01 && limitedSpeed < 0.6) {
    player.vx += forwardX * player.input.throttle * 0.24;
    player.vz += forwardZ * player.input.throttle * 0.24;
  }

  const motion = ARENA_TYPES[room.arenaId].motion;
  if (motion && room.phase === "running") {
    const center = getArenaCenter(room);
    const localX = player.x - center.x;
    const localZ = player.z - center.z;
    const tangentialX = -localZ * room.arenaMotion.yawVelocity;
    const tangentialZ = localX * room.arenaMotion.yawVelocity;
    const influence = dt * motion.carAssist;
    player.vx += (room.arenaMotion.velX + tangentialX) * influence;
    player.vz += (room.arenaMotion.velZ + tangentialZ) * influence;
  }

  player.x += player.vx * dt;
  player.z += player.vz * dt;
}

function resolveCollisions(room) {
  const activePlayers = Array.from(room.players.values()).filter((player) => player.active);

  for (let firstIndex = 0; firstIndex < activePlayers.length; firstIndex += 1) {
    const first = activePlayers[firstIndex];
    const firstModifiers = getPlayerModifiers(first);

    for (let secondIndex = firstIndex + 1; secondIndex < activePlayers.length; secondIndex += 1) {
      const second = activePlayers[secondIndex];
      const secondModifiers = getPlayerModifiers(second);
      const dx = second.x - first.x;
      const dz = second.z - first.z;
      const distance = Math.hypot(dx, dz) || 0.0001;
      const minimumDistance = PLAYER_RADIUS * 2;

      if (distance >= minimumDistance) {
        continue;
      }

      const normalX = dx / distance;
      const normalZ = dz / distance;
      const overlap = minimumDistance - distance;
      const firstMass = GAME_CONFIG.cars.mass * firstModifiers.massMultiplier;
      const secondMass = GAME_CONFIG.cars.mass * secondModifiers.massMultiplier;
      const totalMass = firstMass + secondMass;
      const firstShare = secondMass / totalMass;
      const secondShare = firstMass / totalMass;

      first.x -= normalX * overlap * firstShare;
      first.z -= normalZ * overlap * firstShare;
      second.x += normalX * overlap * secondShare;
      second.z += normalZ * overlap * secondShare;

      const relativeVelocityX = second.vx - first.vx;
      const relativeVelocityZ = second.vz - first.vz;
      const relativeAlongNormal = relativeVelocityX * normalX + relativeVelocityZ * normalZ;
      const baseImpulse = 2.4 + overlap * 8.5 + Math.max(0, -relativeAlongNormal) * 0.9;
      const firstImpulseScale = lerp(1, firstModifiers.knockbackMultiplier, 0.55);
      const secondImpulseScale = lerp(1, secondModifiers.knockbackMultiplier, 0.55);

      first.vx -= normalX * baseImpulse * firstShare * secondImpulseScale;
      first.vz -= normalZ * baseImpulse * firstShare * secondImpulseScale;
      second.vx += normalX * baseImpulse * secondShare * firstImpulseScale;
      second.vz += normalZ * baseImpulse * secondShare * firstImpulseScale;
    }
  }
}

function handlePowerUpPickups(room) {
  room.powerUps = room.powerUps.filter((powerUp) => {
    const collector = Array.from(room.players.values()).find(
      (player) =>
        player.active &&
        Math.hypot(player.x - powerUp.x, player.z - powerUp.z) <= GAME_CONFIG.powerups.pickupRadius,
    );

    if (!collector) {
      return true;
    }

    applyPowerUp(collector, powerUp.type, room);
    return false;
  });
}

function updateEliminations(room) {
  const center = getArenaCenter(room);

  Array.from(room.players.values()).forEach((player) => {
    if (!player.active) {
      return;
    }

    const radialDistance = Math.hypot(player.x - center.x, player.z - center.z);
    if (radialDistance > room.safeRadius + 0.8) {
      if (!useShieldSave(room, player)) {
        player.active = false;
        player.vx = 0;
        player.vz = 0;
      }
    }
  });
}

function updateWinCondition(room) {
  if (room.phase !== "running") {
    return;
  }

  const activePlayers = Array.from(room.players.values()).filter((player) => player.active);
  if (activePlayers.length > 1) {
    return;
  }

  room.phase = "finished";
  room.winnerId = activePlayers[0] ? activePlayers[0].id : null;
  room.message = activePlayers[0]
    ? `${activePlayers[0].name} won the round. Press R to restart the room match.`
    : "No driver survived the round. Press R to restart the room match.";
}

function resetArenaMotion(room) {
  room.arenaMotion.offsetX = 0;
  room.arenaMotion.offsetZ = 0;
  room.arenaMotion.yaw = 0;
  room.arenaMotion.velX = 0;
  room.arenaMotion.velZ = 0;
  room.arenaMotion.yawVelocity = 0;
}

function normalizeSeatOrder(room) {
  getOrderedPlayers(room).forEach((player, index) => {
    player.joinOrder = index;
  });
  room.nextJoinOrder = room.players.size;
}

function syncLobbyState(room, reason) {
  room.elapsed = 0;
  room.safeRadius = GAME_CONFIG.arena.initialRadius;
  room.powerUps = [];
  room.nextPowerUpAt = 1.8;
  room.winnerId = null;
  room.phase = "lobby";
  room.message =
    reason ||
    (room.players.size >= ROOM_MIN_PLAYERS
      ? "Host can start the room match."
      : "Waiting for at least 2 players to join.");
  resetArenaMotion(room);
  normalizeSeatOrder(room);

  const spawnPoints = getSpawnPoints(room.players.size);
  getOrderedPlayers(room).forEach((player, index) => {
    resetPlayerForMatch(player, spawnPoints[index]);
  });
}

function startRoomMatch(room, reason = "Host started the match.") {
  room.elapsed = 0;
  room.safeRadius = GAME_CONFIG.arena.initialRadius;
  room.powerUps = [];
  room.nextPowerUpAt = 1.8;
  room.winnerId = null;
  room.phase = "running";
  room.message = reason;
  resetArenaMotion(room);
  normalizeSeatOrder(room);

  const spawnPoints = getSpawnPoints(room.players.size);
  getOrderedPlayers(room).forEach((player, index) => {
    resetPlayerForMatch(player, spawnPoints[index]);
  });
}

function serializeEffects(room, player) {
  return Object.values(player.effects)
    .filter((effect) => effect.expiresAt > room.elapsed)
    .map((effect) => ({
      type: effect.type,
      label: effect.label,
      color: effect.color,
      cssColor: effect.cssColor,
      expiresAt: roundValue(effect.expiresAt),
      charges: effect.charges || 0,
    }));
}

function buildRoomSnapshot(room) {
  const players = getOrderedPlayers(room).map((player) => ({
    id: player.id,
    name: player.name,
    colorIndex: player.colorIndex,
    joinOrder: player.joinOrder,
    isHost: player.id === room.hostId,
    x: roundValue(player.x),
    y: GAME_CONFIG.cars.rideHeight,
    z: roundValue(player.z),
    vx: roundValue(player.vx),
    vz: roundValue(player.vz),
    angle: roundValue(player.angle),
    active: player.active,
    boostActive: player.boost.activeUntil > room.elapsed,
    boostCooldownRemaining: roundValue(Math.max(0, player.boost.cooldownUntil - room.elapsed)),
    effects: serializeEffects(room, player),
  }));

  return {
    roomId: room.id,
    arenaId: room.arenaId,
    phase: room.phase,
    message: room.message,
    winnerId: room.winnerId,
    hostId: room.hostId,
    elapsed: roundValue(room.elapsed),
    safeRadius: roundValue(room.safeRadius),
    connectedPlayers: room.players.size,
    minPlayers: ROOM_MIN_PLAYERS,
    maxPlayers: ROOM_MAX_PLAYERS,
    canStart: room.phase === "lobby" && room.players.size >= ROOM_MIN_PLAYERS,
    remainingPlayers: players.filter((player) => player.active).length,
    arenaMotion: {
      offsetX: roundValue(room.arenaMotion.offsetX),
      offsetZ: roundValue(room.arenaMotion.offsetZ),
      yaw: roundValue(room.arenaMotion.yaw),
      velX: roundValue(room.arenaMotion.velX),
      velZ: roundValue(room.arenaMotion.velZ),
      yawVelocity: roundValue(room.arenaMotion.yawVelocity),
    },
    players,
    powerUps: room.powerUps.map((powerUp) => ({
      id: powerUp.id,
      type: powerUp.type,
      x: roundValue(powerUp.x),
      z: roundValue(powerUp.z),
      pulseOffset: roundValue(powerUp.pulseOffset),
      spinSpeed: roundValue(powerUp.spinSpeed),
    })),
  };
}

function emitRoomState(io, room) {
  io.to(room.id).emit("room:state", buildRoomSnapshot(room));
}

function stepRooms(io) {
  const now = Date.now();

  rooms.forEach((room, roomId) => {
    if (room.players.size === 0) {
      rooms.delete(roomId);
      return;
    }

    const dt = clamp((now - room.lastTickAt) / 1000, 0.01, 0.05);
    room.lastTickAt = now;

    if (room.phase === "running") {
      room.elapsed += dt;
      room.safeRadius = Math.max(
        GAME_CONFIG.arena.minimumRadius,
        GAME_CONFIG.arena.initialRadius - Math.max(0, room.elapsed - GAME_CONFIG.arena.shrinkDelay) * GAME_CONFIG.arena.shrinkRate,
      );
      updateArenaMotion(room, dt);
      Array.from(room.players.values()).forEach((player) => updatePlayerMotion(room, player, dt));
      resolveCollisions(room);

      if (room.powerUps.length < GAME_CONFIG.powerups.maxActive && room.elapsed >= room.nextPowerUpAt) {
        spawnPowerUp(room);
      }
      handlePowerUpPickups(room);
      updateEliminations(room);
      updateWinCondition(room);
    } else {
      updateArenaMotion(room, dt);
    }

    emitRoomState(io, room);
  });
}

function getRoomForSocket(socket) {
  return socket.data.roomId ? rooms.get(socket.data.roomId) || null : null;
}

function getNextHostId(room) {
  const nextHost = getOrderedPlayers(room)[0];
  return nextHost ? nextHost.id : null;
}

function closeRoom(io, room, message = "The room was closed by the host.", eventName = "room:closed") {
  getOrderedPlayers(room).forEach((player) => {
    const client = io.sockets.sockets.get(player.id);
    if (client) {
      client.leave(room.id);
      client.data.roomId = null;
      client.emit(eventName, {
        roomId: room.id,
        message,
      });
    }
  });
  rooms.delete(room.id);
}

function removePlayerFromRoom(io, room, playerId, { reason, notifyEvent = null } = {}) {
  const player = room.players.get(playerId);
  if (!player) {
    return;
  }

  const client = io.sockets.sockets.get(playerId);
  if (client) {
    client.leave(room.id);
    client.data.roomId = null;
    if (notifyEvent) {
      client.emit(notifyEvent, {
        roomId: room.id,
        message: reason,
      });
    }
  }

  room.players.delete(playerId);

  if (room.players.size === 0) {
    rooms.delete(room.id);
    return;
  }

  if (room.phase === "lobby" && playerId === room.hostId) {
    closeRoom(io, room, reason || "The host left before the match started. Room closed.");
    return;
  }

  if (playerId === room.hostId) {
    room.hostId = getNextHostId(room);
  }

  if (room.phase === "lobby") {
    syncLobbyState(
      room,
      reason || (room.players.size >= ROOM_MIN_PLAYERS ? "Host can start the room match." : "Waiting for at least 2 players to join."),
    );
    emitRoomState(io, room);
    return;
  }

  if (room.phase === "running") {
    updateWinCondition(room);
  }

  emitRoomState(io, room);
}

function removeSocketFromRoom(io, socket, { reason, notifyEvent = null } = {}) {
  const room = getRoomForSocket(socket);
  if (!room) {
    socket.data.roomId = null;
    return;
  }

  removePlayerFromRoom(io, room, socket.id, { reason, notifyEvent });
}

function joinRoom(io, socket, room, reply) {
  removeSocketFromRoom(io, socket, { reason: "Moved to a new room." });

  if (room.phase !== "lobby") {
    reply({ ok: false, message: "That room is not open for joining right now." });
    return;
  }

  if (room.players.size >= ROOM_MAX_PLAYERS) {
    reply({ ok: false, message: "That room is full. Max 5 players allowed." });
    return;
  }

  socket.join(room.id);
  socket.data.roomId = room.id;
  const nextIndex = room.nextJoinOrder;
  room.nextJoinOrder += 1;
  room.players.set(socket.id, createPlayerState(socket.id, nextIndex));
  if (!room.hostId) {
    room.hostId = socket.id;
  }
  syncLobbyState(
    room,
    room.players.size >= ROOM_MIN_PLAYERS ? "Lobby ready. Host can start the match." : "Waiting for at least 2 players to join.",
  );

  const snapshot = buildRoomSnapshot(room);
  emitRoomState(io, room);

  reply({
    ok: true,
    roomId: room.id,
    playerId: socket.id,
    state: snapshot,
  });
}

function attachSocketHandlers(io) {
  io.on("connection", (socket) => {
    socket.data.roomId = null;

    socket.on("room:create", (payload = {}, reply = () => {}) => {
      const arenaId = sanitizeArenaId(payload.arenaId);
      const room = createRoomState(createRoomId(), arenaId);
      rooms.set(room.id, room);
      joinRoom(io, socket, room, reply);
    });

    socket.on("room:join", (payload = {}, reply = () => {}) => {
      const roomId = sanitizeRoomId(payload.roomId);
      const room = rooms.get(roomId);

      if (!room) {
        reply({ ok: false, message: "Room not found. Check the ID and try again." });
        return;
      }

      joinRoom(io, socket, room, reply);
    });

    socket.on("room:leave", () => {
      removeSocketFromRoom(io, socket, {
        reason: "A player left the room.",
      });
      socket.emit("room:left", { ok: true });
    });

    socket.on("room:start", (reply = () => {}) => {
      const room = getRoomForSocket(socket);
      if (!room) {
        reply({ ok: false, message: "Join a room first." });
        return;
      }

      if (room.phase !== "lobby") {
        reply({ ok: false, message: "This room match has already started." });
        return;
      }

      if (room.hostId !== socket.id) {
        reply({ ok: false, message: "Only the host can start the room match." });
        return;
      }

      if (room.players.size < ROOM_MIN_PLAYERS) {
        reply({ ok: false, message: "At least 2 players are required to start." });
        return;
      }

      startRoomMatch(room);
      emitRoomState(io, room);
      reply({ ok: true });
    });

    socket.on("room:discard", (reply = () => {}) => {
      const room = getRoomForSocket(socket);
      if (!room) {
        reply({ ok: false, message: "Join a room first." });
        return;
      }

      if (room.hostId !== socket.id || room.phase !== "lobby") {
        reply({ ok: false, message: "Only the host can discard the lobby before the match starts." });
        return;
      }

      closeRoom(io, room, "The host discarded the room before the match started.");
      reply({ ok: true });
    });

    socket.on("room:kick", (payload = {}, reply = () => {}) => {
      const room = getRoomForSocket(socket);
      const targetId = String(payload.playerId || "");
      if (!room) {
        reply({ ok: false, message: "Join a room first." });
        return;
      }

      if (room.hostId !== socket.id || room.phase !== "lobby") {
        reply({ ok: false, message: "Only the host can remove players before the match starts." });
        return;
      }

      if (!targetId || !room.players.has(targetId) || targetId === socket.id) {
        reply({ ok: false, message: "Choose a valid player to remove." });
        return;
      }

      removePlayerFromRoom(io, room, targetId, {
        reason: "The host removed you from the room.",
        notifyEvent: "room:kicked",
      });
      reply({ ok: true });
    });

    socket.on("room:restart", () => {
      const room = getRoomForSocket(socket);
      if (!room) {
        return;
      }

      if (room.hostId !== socket.id || room.phase !== "finished") {
        return;
      }

      startRoomMatch(room, "Host restarted the match.");
      emitRoomState(io, room);
    });

    socket.on("player:input", (payload = {}) => {
      const room = getRoomForSocket(socket);
      if (!room) {
        return;
      }

      const player = room.players.get(socket.id);
      if (!player) {
        return;
      }

      player.input.throttle = clamp(Number(payload.throttle) || 0, -1, 1);
      player.input.steer = clamp(Number(payload.steer) || 0, -1, 1);
    });

    socket.on("player:boost", () => {
      const room = getRoomForSocket(socket);
      if (!room || room.phase !== "running") {
        return;
      }

      const player = room.players.get(socket.id);
      if (!player) {
        return;
      }

      activateBoost(room, player);
    });

    socket.on("disconnect", () => {
      removeSocketFromRoom(io, socket, {
        reason: "A player disconnected from the room.",
      });
    });
  });
}

function createServer() {
  const server = http.createServer((request, response) => {
    if (!request.url) {
      sendJson(response, 400, { error: "Missing request URL." });
      return;
    }

    if (!["GET", "HEAD"].includes(request.method || "GET")) {
      sendJson(response, 405, { error: "Method not allowed." });
      return;
    }

    const parsedUrl = new URL(request.url, "http://localhost");

    if (parsedUrl.pathname === "/api/health") {
      sendJson(response, 200, {
        ok: true,
        now: new Date().toISOString(),
        service: "car-survival-arena",
        rooms: rooms.size,
      });
      return;
    }

    if (parsedUrl.pathname === "/favicon.ico") {
      response.writeHead(204, {
        "Cache-Control": "public, max-age=86400",
        "Content-Length": 0,
      });
      response.end();
      return;
    }

    const filePath = resolveRequestPath(request.url);
    if (!filePath) {
      sendJson(response, 403, { error: "Access denied." });
      return;
    }

    serveFile(filePath, response, request.method || "GET");
  });

  const io = new Server(server, {
    cors: {
      origin: true,
      methods: ["GET", "POST"],
    },
  });

  attachSocketHandlers(io);
  return { server, io };
}

function startServer(options = {}) {
  const port = Number.isFinite(options.port) ? options.port : DEFAULT_PORT;
  const { server, io } = createServer();

  setInterval(() => {
    stepRooms(io);
  }, TICK_MS);

  server.listen(port, () => {
    const address = server.address();
    const activePort = typeof address === "object" && address ? address.port : port;
    console.log(`Car Survival Arena server running on http://localhost:${activePort}`);
    getLocalNetworkUrls(activePort).forEach((url) => {
      console.log(`LAN: ${url}`);
    });
  });

  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = {
  createServer,
  startServer,
};
