const express = require("express");
const fs = require("fs/promises");
const http = require("http");
const path = require("path");
const { Server: SocketIOServer } = require("socket.io");

const SOCKET_CONTROL_EVENTS = new Set([
    "connect",
    "connect_error",
    "disconnect",
    "disconnecting",
    "error",
    "gamehub:join",
    "join-room",
    "gamehub:leave",
    "leave-room",
    "gamehub:rooms",
    "rooms:list",
    "room:create",
    "room:join",
    "room:update",
    "room:error",
    "match:move",
    "match:reaction",
    "match:rematch"
]);

const CHOPSTICK_HAND_INDEXES = [0, 1];
const CHOPSTICK_SEATS = ["A", "B"];
const CHOPSTICK_GAME_ID = "chopstick";
const CAR_WRESTLING_GAME_ID = "car-wrestling";
const CAR_WRESTLING_ROOM_KEY_PREFIX = "carwrestling:room:";
const CAR_WRESTLING_ROOM_ID_LENGTH = 5;
const CAR_WRESTLING_TICK_RATE = 20;
const CAR_WRESTLING_TICK_MS = 1000 / CAR_WRESTLING_TICK_RATE;
const CAR_WRESTLING_PLAYER_RADIUS = 1.4;
const CAR_WRESTLING_MIN_PLAYERS = 2;
const CAR_WRESTLING_MAX_PLAYERS = 5;
const CAR_WRESTLING_EVENTS = {
    roomState: "carwrestling:room:state",
    roomLeft: "carwrestling:room:left",
    roomClosed: "carwrestling:room:closed",
    roomKicked: "carwrestling:room:kicked",
    roomCreate: "carwrestling:room:create",
    roomJoin: "carwrestling:room:join",
    roomLeave: "carwrestling:room:leave",
    roomStart: "carwrestling:room:start",
    roomDiscard: "carwrestling:room:discard",
    roomKick: "carwrestling:room:kick",
    roomRestart: "carwrestling:room:restart",
    playerInput: "carwrestling:player:input",
    playerBoost: "carwrestling:player:boost"
};
const CAR_WRESTLING_CONFIG = {
    arena: {
        initialRadius: 20,
        minimumRadius: 7,
        shrinkDelay: 10,
        shrinkRate: 0.36
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
        boostTurnMultiplier: 1.08
    },
    powerups: {
        maxActive: 4,
        minRespawn: 2.4,
        maxRespawn: 5.2,
        spawnMargin: 3.2,
        pickupRadius: 1.85
    }
};
const CAR_WRESTLING_ARENAS = {
    standard: {
        physics: {
            gripMultiplier: 1,
            engineMultiplier: 1,
            topSpeedMultiplier: 1,
            reverseMultiplier: 1,
            steerMultiplier: 1
        }
    },
    ice: {
        physics: {
            gripMultiplier: 0.34,
            engineMultiplier: 0.92,
            topSpeedMultiplier: 1.14,
            reverseMultiplier: 0.9,
            steerMultiplier: 0.76
        }
    },
    sand: {
        physics: {
            gripMultiplier: 1.42,
            engineMultiplier: 0.72,
            topSpeedMultiplier: 0.76,
            reverseMultiplier: 0.74,
            steerMultiplier: 0.9
        }
    },
    moving: {
        physics: {
            gripMultiplier: 0.96,
            engineMultiplier: 1.02,
            topSpeedMultiplier: 1.02,
            reverseMultiplier: 1,
            steerMultiplier: 1.04
        },
        motion: {
            shiftX: 1.05,
            shiftZ: 0.82,
            shiftSpeed: 0.42,
            yawAmplitude: 0.11,
            yawSpeed: 0.28,
            carAssist: 1.2
        }
    }
};
const CAR_WRESTLING_POWERUPS = {
    speed: {
        label: "Speed Boost",
        color: 0x59c8ff,
        cssColor: "#59c8ff",
        duration: 8,
        speedMultiplier: 1.38
    },
    knockback: {
        label: "Knockback Boost",
        color: 0xff9364,
        cssColor: "#ff9364",
        duration: 7,
        knockbackMultiplier: 2.25
    },
    shield: {
        label: "Shield",
        color: 0xffd76b,
        cssColor: "#ffd76b",
        duration: 9,
        charges: 1
    },
    weight: {
        label: "Weight Boost",
        color: 0x88dd74,
        cssColor: "#88dd74",
        duration: 8,
        massMultiplier: 1.7
    }
};

Object.values(CAR_WRESTLING_EVENTS).forEach((eventName) => SOCKET_CONTROL_EVENTS.add(eventName));

function clampCarWrestling(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function lerpCarWrestling(start, end, amount) {
    return start + (end - start) * amount;
}

function normalizeCarWrestlingAngle(angle) {
    let nextAngle = angle;
    while (nextAngle > Math.PI) {
        nextAngle -= Math.PI * 2;
    }
    while (nextAngle < -Math.PI) {
        nextAngle += Math.PI * 2;
    }
    return nextAngle;
}

function roundCarWrestlingValue(value) {
    return Math.round(value * 1000) / 1000;
}

function createCarWrestlingSocketRoomKey(roomId) {
    return `${CAR_WRESTLING_ROOM_KEY_PREFIX}${roomId}`;
}

function sanitizeCarWrestlingRoomId(roomId) {
    return String(roomId || "")
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, CAR_WRESTLING_ROOM_ID_LENGTH);
}

function sanitizeCarWrestlingArenaId(arenaId) {
    return CAR_WRESTLING_ARENAS[arenaId] ? arenaId : "standard";
}

function createCarWrestlingRoomId(carWrestlingRooms) {
    let roomId = "";
    do {
        roomId = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, CAR_WRESTLING_ROOM_ID_LENGTH);
    } while (roomId.length < CAR_WRESTLING_ROOM_ID_LENGTH || carWrestlingRooms.has(roomId));
    return roomId;
}

function createCarWrestlingRoomState(roomId, arenaId) {
    return {
        id: roomId,
        arenaId: sanitizeCarWrestlingArenaId(arenaId),
        phase: "lobby",
        message: "Waiting for the host to start the match.",
        winnerId: null,
        hostId: null,
        elapsed: 0,
        safeRadius: CAR_WRESTLING_CONFIG.arena.initialRadius,
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
            yawVelocity: 0
        },
        lastTickAt: Date.now()
    };
}

function createCarWrestlingPlayerState(socketId, index) {
    return {
        id: socketId,
        name: `Driver ${index + 1}`,
        colorIndex: index,
        joinOrder: index,
        x: 0,
        z: 0,
        y: CAR_WRESTLING_CONFIG.cars.rideHeight,
        vx: 0,
        vz: 0,
        angle: 0,
        turnVelocity: 0,
        active: true,
        input: {
            throttle: 0,
            steer: 0
        },
        boost: {
            activeUntil: 0,
            cooldownUntil: 0
        },
        effects: {}
    };
}

function getOrderedCarWrestlingPlayers(room) {
    return Array.from(room.players.values()).sort((left, right) => left.joinOrder - right.joinOrder);
}

function getCarWrestlingSpawnPoints(count) {
    const safeCount = Math.max(count, 1);
    const radius = CAR_WRESTLING_CONFIG.arena.initialRadius * 0.55;
    const points = [];

    for (let index = 0; index < safeCount; index += 1) {
        const angle = (index / safeCount) * Math.PI * 2 - Math.PI * 0.5;
        points.push({
            x: Math.cos(angle) * radius,
            z: Math.sin(angle) * radius,
            angle: normalizeCarWrestlingAngle(-angle - Math.PI * 0.5)
        });
    }

    return points;
}

function resetCarWrestlingPlayerForMatch(player, spawnPoint) {
    player.x = spawnPoint.x;
    player.z = spawnPoint.z;
    player.y = CAR_WRESTLING_CONFIG.cars.rideHeight;
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

function updateCarWrestlingArenaMotion(room, dt) {
    const motion = CAR_WRESTLING_ARENAS[room.arenaId].motion;
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

    const safeDt = Math.max(dt, 1 / CAR_WRESTLING_TICK_RATE);
    room.arenaMotion.velX = (room.arenaMotion.offsetX - previous.offsetX) / safeDt;
    room.arenaMotion.velZ = (room.arenaMotion.offsetZ - previous.offsetZ) / safeDt;
    room.arenaMotion.yawVelocity = (room.arenaMotion.yaw - previous.yaw) / safeDt;
}

function getCarWrestlingArenaCenter(room) {
    return {
        x: room.arenaMotion.offsetX,
        z: room.arenaMotion.offsetZ
    };
}

function getCarWrestlingPlayerModifiers(player) {
    return {
        speedMultiplier: player.effects.speed ? CAR_WRESTLING_POWERUPS.speed.speedMultiplier : 1,
        knockbackMultiplier: player.effects.knockback ? CAR_WRESTLING_POWERUPS.knockback.knockbackMultiplier : 1,
        massMultiplier: player.effects.weight ? CAR_WRESTLING_POWERUPS.weight.massMultiplier : 1,
        shieldCharges: player.effects.shield ? player.effects.shield.charges : 0
    };
}

function clearCarWrestlingExpiredEffects(room, player) {
    Object.values(player.effects).forEach((effect) => {
        if (effect.expiresAt <= room.elapsed) {
            delete player.effects[effect.type];
        }
    });
}

function applyCarWrestlingPowerUp(player, type, room) {
    const definition = CAR_WRESTLING_POWERUPS[type];
    const existing = player.effects[type];

    player.effects[type] = {
        type,
        label: definition.label,
        color: definition.color,
        cssColor: definition.cssColor,
        expiresAt: room.elapsed + definition.duration,
        charges: definition.charges || 0
    };

    if (existing && type === "shield") {
        player.effects[type].charges = 1;
    }
}

function activateCarWrestlingBoost(room, player) {
    if (!player.active || player.boost.cooldownUntil > room.elapsed) {
        return false;
    }

    player.boost.activeUntil = room.elapsed + CAR_WRESTLING_CONFIG.cars.boostDuration;
    player.boost.cooldownUntil = room.elapsed + CAR_WRESTLING_CONFIG.cars.boostCooldown;
    return true;
}

function scheduleNextCarWrestlingPowerUp(room) {
    const delay = CAR_WRESTLING_CONFIG.powerups.minRespawn
        + Math.random() * (CAR_WRESTLING_CONFIG.powerups.maxRespawn - CAR_WRESTLING_CONFIG.powerups.minRespawn);
    room.nextPowerUpAt = room.elapsed + delay;
}

function spawnCarWrestlingPowerUp(room) {
    if (room.powerUps.length >= CAR_WRESTLING_CONFIG.powerups.maxActive) {
        scheduleNextCarWrestlingPowerUp(room);
        return;
    }

    const safeRadius = Math.min(
        room.safeRadius - CAR_WRESTLING_CONFIG.powerups.spawnMargin,
        CAR_WRESTLING_CONFIG.arena.initialRadius - 1.5
    );

    if (safeRadius <= 2.5) {
        scheduleNextCarWrestlingPowerUp(room);
        return;
    }

    const center = getCarWrestlingArenaCenter(room);
    const powerUpTypes = Object.keys(CAR_WRESTLING_POWERUPS);

    for (let attempt = 0; attempt < 24; attempt += 1) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 2 + Math.random() * Math.max(safeRadius - 2, 1);
        const x = center.x + Math.cos(angle) * radius;
        const z = center.z + Math.sin(angle) * radius;

        const tooCloseToPlayer = Array.from(room.players.values()).some((player) => player.active && Math.hypot(player.x - x, player.z - z) < 4.8);
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
            spinSpeed: 0.9 + Math.random() * 1.1
        });
        break;
    }

    scheduleNextCarWrestlingPowerUp(room);
}

function useCarWrestlingShieldSave(room, player) {
    if (!player.effects.shield || player.effects.shield.charges <= 0) {
        return false;
    }

    player.effects.shield.charges = 0;
    delete player.effects.shield;

    const center = getCarWrestlingArenaCenter(room);
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

function updateCarWrestlingPlayerMotion(room, player, dt) {
    clearCarWrestlingExpiredEffects(room, player);
    if (!player.active) {
        return;
    }

    const arena = CAR_WRESTLING_ARENAS[room.arenaId].physics;
    const modifiers = getCarWrestlingPlayerModifiers(player);
    const boostMultiplier = player.boost.activeUntil > room.elapsed ? CAR_WRESTLING_CONFIG.cars.boostSpeedMultiplier : 1;
    const turnBoostMultiplier = player.boost.activeUntil > room.elapsed ? CAR_WRESTLING_CONFIG.cars.boostTurnMultiplier : 1;
    const maxForwardSpeed = CAR_WRESTLING_CONFIG.cars.maxForwardSpeed * arena.topSpeedMultiplier * modifiers.speedMultiplier * boostMultiplier;
    const maxReverseSpeed = CAR_WRESTLING_CONFIG.cars.maxReverseSpeed * arena.reverseMultiplier;
    const engineAcceleration = (CAR_WRESTLING_CONFIG.cars.engineForce * arena.engineMultiplier * modifiers.speedMultiplier * boostMultiplier)
        / (CAR_WRESTLING_CONFIG.cars.mass * modifiers.massMultiplier);
    const reverseAcceleration = (CAR_WRESTLING_CONFIG.cars.reverseForce * arena.reverseMultiplier)
        / (CAR_WRESTLING_CONFIG.cars.mass * modifiers.massMultiplier);
    const frameScale = dt * 60;
    const steerStrength = Math.abs(player.input.steer);
    const planarSpeed = Math.hypot(player.vx, player.vz);

    const turnTarget = player.input.steer
        * CAR_WRESTLING_CONFIG.cars.turnRate
        * arena.steerMultiplier
        * turnBoostMultiplier
        * lerpCarWrestling(0.72, 1.08, clampCarWrestling(planarSpeed / 8, 0, 1));
    player.turnVelocity = lerpCarWrestling(player.turnVelocity, turnTarget, clampCarWrestling(dt * 9, 0, 1));
    player.angle = normalizeCarWrestlingAngle(player.angle + player.turnVelocity * dt);

    const forwardX = Math.sin(player.angle);
    const forwardZ = Math.cos(player.angle);
    const rightX = Math.cos(player.angle);
    const rightZ = -Math.sin(player.angle);
    const forwardSpeed = player.vx * forwardX + player.vz * forwardZ;
    const lateralSpeed = player.vx * rightX + player.vz * rightZ;
    const gripForce = clampCarWrestling(
        (CAR_WRESTLING_CONFIG.cars.grip * 2.2 + steerStrength * 0.14) * arena.gripMultiplier * frameScale,
        0.16,
        0.94
    );

    let desiredForwardSpeed = 0;
    if (player.input.throttle > 0.01) {
        desiredForwardSpeed = player.input.throttle * maxForwardSpeed;
    } else if (player.input.throttle < -0.01) {
        desiredForwardSpeed = player.input.throttle * maxReverseSpeed;
    }

    const speedGap = desiredForwardSpeed - forwardSpeed;
    const accelerationRate = desiredForwardSpeed >= forwardSpeed
        ? engineAcceleration * 1.5
        : reverseAcceleration * 1.7 + CAR_WRESTLING_CONFIG.cars.idleBrake;
    const forwardBlend = clampCarWrestling(dt * accelerationRate, 0, speedGap >= 0 ? 1 : 0.24);
    const nextForwardSpeed = forwardSpeed + speedGap * forwardBlend;
    const nextLateralSpeed = lerpCarWrestling(lateralSpeed, 0, gripForce);
    const desiredVelocityX = forwardX * nextForwardSpeed + rightX * nextLateralSpeed;
    const desiredVelocityZ = forwardZ * nextForwardSpeed + rightZ * nextLateralSpeed;
    const controlAuthority = clampCarWrestling(dt * (CAR_WRESTLING_CONFIG.cars.driveAuthority + steerStrength * 1.4), 0, 1);

    player.vx = lerpCarWrestling(player.vx, desiredVelocityX, controlAuthority);
    player.vz = lerpCarWrestling(player.vz, desiredVelocityZ, controlAuthority);

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

    const motion = CAR_WRESTLING_ARENAS[room.arenaId].motion;
    if (motion && room.phase === "running") {
        const center = getCarWrestlingArenaCenter(room);
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

function resolveCarWrestlingCollisions(room) {
    const activePlayers = Array.from(room.players.values()).filter((player) => player.active);

    for (let firstIndex = 0; firstIndex < activePlayers.length; firstIndex += 1) {
        const first = activePlayers[firstIndex];
        const firstModifiers = getCarWrestlingPlayerModifiers(first);

        for (let secondIndex = firstIndex + 1; secondIndex < activePlayers.length; secondIndex += 1) {
            const second = activePlayers[secondIndex];
            const secondModifiers = getCarWrestlingPlayerModifiers(second);
            const dx = second.x - first.x;
            const dz = second.z - first.z;
            const distance = Math.hypot(dx, dz) || 0.0001;
            const minimumDistance = CAR_WRESTLING_PLAYER_RADIUS * 2;

            if (distance >= minimumDistance) {
                continue;
            }

            const normalX = dx / distance;
            const normalZ = dz / distance;
            const overlap = minimumDistance - distance;
            const firstMass = CAR_WRESTLING_CONFIG.cars.mass * firstModifiers.massMultiplier;
            const secondMass = CAR_WRESTLING_CONFIG.cars.mass * secondModifiers.massMultiplier;
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
            const firstImpulseScale = lerpCarWrestling(1, firstModifiers.knockbackMultiplier, 0.55);
            const secondImpulseScale = lerpCarWrestling(1, secondModifiers.knockbackMultiplier, 0.55);

            first.vx -= normalX * baseImpulse * firstShare * secondImpulseScale;
            first.vz -= normalZ * baseImpulse * firstShare * secondImpulseScale;
            second.vx += normalX * baseImpulse * secondShare * firstImpulseScale;
            second.vz += normalZ * baseImpulse * secondShare * firstImpulseScale;
        }
    }
}

function handleCarWrestlingPowerUpPickups(room) {
    room.powerUps = room.powerUps.filter((powerUp) => {
        const collector = Array.from(room.players.values()).find((player) => player.active && Math.hypot(player.x - powerUp.x, player.z - powerUp.z) <= CAR_WRESTLING_CONFIG.powerups.pickupRadius);
        if (!collector) {
            return true;
        }

        applyCarWrestlingPowerUp(collector, powerUp.type, room);
        return false;
    });
}

function updateCarWrestlingEliminations(room) {
    const center = getCarWrestlingArenaCenter(room);
    Array.from(room.players.values()).forEach((player) => {
        if (!player.active) {
            return;
        }

        const radialDistance = Math.hypot(player.x - center.x, player.z - center.z);
        if (radialDistance > room.safeRadius + 0.8 && !useCarWrestlingShieldSave(room, player)) {
            player.active = false;
            player.vx = 0;
            player.vz = 0;
        }
    });
}

function updateCarWrestlingWinCondition(room) {
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

function resetCarWrestlingArenaMotion(room) {
    room.arenaMotion.offsetX = 0;
    room.arenaMotion.offsetZ = 0;
    room.arenaMotion.yaw = 0;
    room.arenaMotion.velX = 0;
    room.arenaMotion.velZ = 0;
    room.arenaMotion.yawVelocity = 0;
}

function normalizeCarWrestlingSeatOrder(room) {
    getOrderedCarWrestlingPlayers(room).forEach((player, index) => {
        player.joinOrder = index;
    });
    room.nextJoinOrder = room.players.size;
}

function syncCarWrestlingLobbyState(room, reason) {
    room.elapsed = 0;
    room.safeRadius = CAR_WRESTLING_CONFIG.arena.initialRadius;
    room.powerUps = [];
    room.nextPowerUpAt = 1.8;
    room.winnerId = null;
    room.phase = "lobby";
    room.message = reason || (room.players.size >= CAR_WRESTLING_MIN_PLAYERS ? "Host can start the room match." : "Waiting for at least 2 players to join.");
    resetCarWrestlingArenaMotion(room);
    normalizeCarWrestlingSeatOrder(room);

    const spawnPoints = getCarWrestlingSpawnPoints(room.players.size);
    getOrderedCarWrestlingPlayers(room).forEach((player, index) => {
        resetCarWrestlingPlayerForMatch(player, spawnPoints[index]);
    });
}

function startCarWrestlingRoomMatch(room, reason = "Host started the match.") {
    room.elapsed = 0;
    room.safeRadius = CAR_WRESTLING_CONFIG.arena.initialRadius;
    room.powerUps = [];
    room.nextPowerUpAt = 1.8;
    room.winnerId = null;
    room.phase = "running";
    room.message = reason;
    resetCarWrestlingArenaMotion(room);
    normalizeCarWrestlingSeatOrder(room);

    const spawnPoints = getCarWrestlingSpawnPoints(room.players.size);
    getOrderedCarWrestlingPlayers(room).forEach((player, index) => {
        resetCarWrestlingPlayerForMatch(player, spawnPoints[index]);
    });
}

function serializeCarWrestlingEffects(room, player) {
    return Object.values(player.effects)
        .filter((effect) => effect.expiresAt > room.elapsed)
        .map((effect) => ({
            type: effect.type,
            label: effect.label,
            color: effect.color,
            cssColor: effect.cssColor,
            expiresAt: roundCarWrestlingValue(effect.expiresAt),
            charges: effect.charges || 0
        }));
}

function buildCarWrestlingRoomSnapshot(room) {
    const players = getOrderedCarWrestlingPlayers(room).map((player) => ({
        id: player.id,
        name: player.name,
        colorIndex: player.colorIndex,
        joinOrder: player.joinOrder,
        isHost: player.id === room.hostId,
        x: roundCarWrestlingValue(player.x),
        y: CAR_WRESTLING_CONFIG.cars.rideHeight,
        z: roundCarWrestlingValue(player.z),
        vx: roundCarWrestlingValue(player.vx),
        vz: roundCarWrestlingValue(player.vz),
        angle: roundCarWrestlingValue(player.angle),
        active: player.active,
        boostActive: player.boost.activeUntil > room.elapsed,
        boostCooldownRemaining: roundCarWrestlingValue(Math.max(0, player.boost.cooldownUntil - room.elapsed)),
        effects: serializeCarWrestlingEffects(room, player)
    }));

    return {
        roomId: room.id,
        arenaId: room.arenaId,
        phase: room.phase,
        message: room.message,
        winnerId: room.winnerId,
        hostId: room.hostId,
        elapsed: roundCarWrestlingValue(room.elapsed),
        safeRadius: roundCarWrestlingValue(room.safeRadius),
        connectedPlayers: room.players.size,
        minPlayers: CAR_WRESTLING_MIN_PLAYERS,
        maxPlayers: CAR_WRESTLING_MAX_PLAYERS,
        canStart: room.phase === "lobby" && room.players.size >= CAR_WRESTLING_MIN_PLAYERS,
        remainingPlayers: players.filter((player) => player.active).length,
        arenaMotion: {
            offsetX: roundCarWrestlingValue(room.arenaMotion.offsetX),
            offsetZ: roundCarWrestlingValue(room.arenaMotion.offsetZ),
            yaw: roundCarWrestlingValue(room.arenaMotion.yaw),
            velX: roundCarWrestlingValue(room.arenaMotion.velX),
            velZ: roundCarWrestlingValue(room.arenaMotion.velZ),
            yawVelocity: roundCarWrestlingValue(room.arenaMotion.yawVelocity)
        },
        players,
        powerUps: room.powerUps.map((powerUp) => ({
            id: powerUp.id,
            type: powerUp.type,
            x: roundCarWrestlingValue(powerUp.x),
            z: roundCarWrestlingValue(powerUp.z),
            pulseOffset: roundCarWrestlingValue(powerUp.pulseOffset),
            spinSpeed: roundCarWrestlingValue(powerUp.spinSpeed)
        }))
    };
}

function emitCarWrestlingRoomState(io, room) {
    io.to(createCarWrestlingSocketRoomKey(room.id)).emit(CAR_WRESTLING_EVENTS.roomState, buildCarWrestlingRoomSnapshot(room));
}

function stepCarWrestlingRooms(io, carWrestlingRooms) {
    const now = Date.now();

    carWrestlingRooms.forEach((room, roomId) => {
        if (room.players.size === 0) {
            carWrestlingRooms.delete(roomId);
            return;
        }

        const dt = clampCarWrestling((now - room.lastTickAt) / 1000, 0.01, 0.05);
        room.lastTickAt = now;

        if (room.phase === "running") {
            room.elapsed += dt;
            room.safeRadius = Math.max(
                CAR_WRESTLING_CONFIG.arena.minimumRadius,
                CAR_WRESTLING_CONFIG.arena.initialRadius - Math.max(0, room.elapsed - CAR_WRESTLING_CONFIG.arena.shrinkDelay) * CAR_WRESTLING_CONFIG.arena.shrinkRate
            );
            updateCarWrestlingArenaMotion(room, dt);
            Array.from(room.players.values()).forEach((player) => updateCarWrestlingPlayerMotion(room, player, dt));
            resolveCarWrestlingCollisions(room);

            if (room.powerUps.length < CAR_WRESTLING_CONFIG.powerups.maxActive && room.elapsed >= room.nextPowerUpAt) {
                spawnCarWrestlingPowerUp(room);
            }

            handleCarWrestlingPowerUpPickups(room);
            updateCarWrestlingEliminations(room);
            updateCarWrestlingWinCondition(room);
        } else {
            updateCarWrestlingArenaMotion(room, dt);
        }

        emitCarWrestlingRoomState(io, room);
    });
}

function getCarWrestlingRoomForSocket(socket, carWrestlingRooms) {
    return socket.data.carWrestlingRoomId ? carWrestlingRooms.get(socket.data.carWrestlingRoomId) || null : null;
}

function getNextCarWrestlingHostId(room) {
    const nextHost = getOrderedCarWrestlingPlayers(room)[0];
    return nextHost ? nextHost.id : null;
}

function closeCarWrestlingRoom(io, carWrestlingRooms, room, message = "The room was closed by the host.", eventName = CAR_WRESTLING_EVENTS.roomClosed) {
    getOrderedCarWrestlingPlayers(room).forEach((player) => {
        const client = io.sockets.sockets.get(player.id);
        if (client) {
            client.leave(createCarWrestlingSocketRoomKey(room.id));
            client.data.carWrestlingRoomId = "";
            client.emit(eventName, {
                roomId: room.id,
                message
            });
        }
    });
    carWrestlingRooms.delete(room.id);
}

function removeCarWrestlingPlayerFromRoom(io, carWrestlingRooms, room, playerId, { reason, notifyEvent = null } = {}) {
    const player = room.players.get(playerId);
    if (!player) {
        return;
    }

    const client = io.sockets.sockets.get(playerId);
    if (client) {
        client.leave(createCarWrestlingSocketRoomKey(room.id));
        client.data.carWrestlingRoomId = "";
        if (notifyEvent) {
            client.emit(notifyEvent, {
                roomId: room.id,
                message: reason
            });
        }
    }

    room.players.delete(playerId);

    if (room.players.size === 0) {
        carWrestlingRooms.delete(room.id);
        return;
    }

    if (room.phase === "lobby" && playerId === room.hostId) {
        closeCarWrestlingRoom(io, carWrestlingRooms, room, reason || "The host left before the match started. Room closed.");
        return;
    }

    if (playerId === room.hostId) {
        room.hostId = getNextCarWrestlingHostId(room);
    }

    if (room.phase === "lobby") {
        syncCarWrestlingLobbyState(room, reason || (room.players.size >= CAR_WRESTLING_MIN_PLAYERS ? "Host can start the room match." : "Waiting for at least 2 players to join."));
        emitCarWrestlingRoomState(io, room);
        return;
    }

    if (room.phase === "running") {
        updateCarWrestlingWinCondition(room);
    }

    emitCarWrestlingRoomState(io, room);
}

function removeCarWrestlingSocketFromRoom(io, carWrestlingRooms, socket, { reason, notifyEvent = null } = {}) {
    const room = getCarWrestlingRoomForSocket(socket, carWrestlingRooms);
    if (!room) {
        socket.data.carWrestlingRoomId = "";
        return;
    }

    removeCarWrestlingPlayerFromRoom(io, carWrestlingRooms, room, socket.id, { reason, notifyEvent });
}

function replyToCarWrestlingSocket(callback, payload) {
    if (typeof callback === "function") {
        callback(payload);
    }
}

function joinCarWrestlingRoom(io, socket, carWrestlingRooms, room, reply) {
    removeCarWrestlingSocketFromRoom(io, carWrestlingRooms, socket, { reason: "Moved to a new room." });

    if (room.phase !== "lobby") {
        replyToCarWrestlingSocket(reply, { ok: false, message: "That room is not open for joining right now." });
        return;
    }

    if (room.players.size >= CAR_WRESTLING_MAX_PLAYERS) {
        replyToCarWrestlingSocket(reply, { ok: false, message: "That room is full. Max 5 players allowed." });
        return;
    }

    socket.join(createCarWrestlingSocketRoomKey(room.id));
    socket.data.carWrestlingRoomId = room.id;
    const nextIndex = room.nextJoinOrder;
    room.nextJoinOrder += 1;
    room.players.set(socket.id, createCarWrestlingPlayerState(socket.id, nextIndex));
    if (!room.hostId) {
        room.hostId = socket.id;
    }

    syncCarWrestlingLobbyState(room, room.players.size >= CAR_WRESTLING_MIN_PLAYERS ? "Lobby ready. Host can start the match." : "Waiting for at least 2 players to join.");

    const snapshot = buildCarWrestlingRoomSnapshot(room);
    emitCarWrestlingRoomState(io, room);
    replyToCarWrestlingSocket(reply, {
        ok: true,
        roomId: room.id,
        playerId: socket.id,
        state: snapshot
    });
}

function slugify(value) {
    return String(value)
        .toLowerCase()
        .replace(/\.html?$/i, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function prettifyName(fileName) {
    return fileName
        .replace(/\.html?$/i, "")
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function extractTitleFromHtml(html, fallback) {
    const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    return match && match[1] ? match[1].trim() : fallback;
}

function createMark(name) {
    const compact = name.replace(/[^a-z0-9]/gi, "").toUpperCase();
    return (compact.slice(0, 6) || "GAME");
}

function sanitizeSegment(value, fallback) {
    const normalized = slugify(value);
    return normalized || fallback;
}

function cleanPlayerName(value, fallback = "Player") {
    const normalized = String(value || "").trim().replace(/\s+/g, " ");
    return normalized.slice(0, 32) || fallback;
}

function isPlainObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function extractGameIdFromReferer(referer) {
    if (!referer) {
        return "";
    }

    try {
        const url = new URL(referer);
        const queryGameId = sanitizeSegment(url.searchParams.get("gameId") || url.searchParams.get("id"), "");
        if (queryGameId) {
            return queryGameId;
        }

        const match = url.pathname.match(/^\/games\/([^/]+)/i);
        if (match && match[1]) {
            return sanitizeSegment(decodeURIComponent(match[1]), "");
        }
    } catch (_) {
        // Invalid referer headers can be ignored.
    }

    return "";
}

function resolveSocketContext(handshake = {}) {
    const auth = isPlainObject(handshake.auth) ? handshake.auth : {};
    const query = isPlainObject(handshake.query) ? handshake.query : {};
    const gameId = sanitizeSegment(
        auth.gameId || query.gameId || query.game || extractGameIdFromReferer(handshake.headers && handshake.headers.referer),
        "lobby"
    );

    return {
        gameId,
        roomId: sanitizeSegment(auth.roomId || auth.room || query.roomId || query.room, "default"),
        playerName: cleanPlayerName(auth.playerName || query.playerName || "", "")
    };
}

function createRoomKey(gameId, roomId) {
    return `game:${gameId}:room:${roomId}`;
}

function getChopstickOpponentSeat(seat) {
    return seat === "A" ? "B" : "A";
}

function createChopstickInitialMatchState({ status = "playing" } = {}) {
    return {
        hands: {
            A: [1, 1],
            B: [1, 1]
        },
        turn: "A",
        winner: null,
        status,
        sequence: 0,
        lastAction: null,
        reactions: {
            A: null,
            B: null
        }
    };
}

function cloneChopstickHands(hands) {
    return {
        A: [...hands.A],
        B: [...hands.B]
    };
}

function normalizeChopstickHandValue(value) {
    return value >= 5 ? 0 : value;
}

function isChopstickSeatDefeated(match, seat) {
    const [left, right] = match.hands[seat];
    return left === 0 && right === 0;
}

function applyChopstickReaction(match, seat, emoji) {
    return {
        ...match,
        reactions: {
            ...match.reactions,
            [seat]: {
                emoji,
                at: Date.now(),
                id: `${seat}-${Date.now()}`
            }
        }
    };
}

function applyChopstickMove(match, seat, move) {
    if (!match) {
        return {
            ok: false,
            error: "No active round."
        };
    }

    if (match.status !== "playing") {
        return {
            ok: false,
            error: "The round is not active yet."
        };
    }

    if (match.winner) {
        return {
            ok: false,
            error: "This round has already finished."
        };
    }

    if (match.turn !== seat) {
        return {
            ok: false,
            error: "It is not your turn."
        };
    }

    const next = {
        ...match,
        hands: cloneChopstickHands(match.hands),
        reactions: {
            ...match.reactions
        }
    };
    const opponentSeat = getChopstickOpponentSeat(seat);
    const actionId = (match.sequence ?? 0) + 1;

    if (move && move.type === "attack") {
        const from = Number(move.from);
        const to = Number(move.to);

        if (!CHOPSTICK_HAND_INDEXES.includes(from) || !CHOPSTICK_HAND_INDEXES.includes(to)) {
            return {
                ok: false,
                error: "Choose a valid hand to attack."
            };
        }

        const attackerCount = match.hands[seat][from];
        const targetCount = match.hands[opponentSeat][to];

        if (attackerCount === 0) {
            return {
                ok: false,
                error: "Dead hands cannot attack."
            };
        }

        if (targetCount === 0) {
            return {
                ok: false,
                error: "That hand is already dead."
            };
        }

        next.hands[opponentSeat][to] = normalizeChopstickHandValue(targetCount + attackerCount);
        next.sequence = actionId;
        next.lastAction = {
            id: actionId,
            type: "attack",
            seat,
            from,
            to,
            targetSeat: opponentSeat,
            attackerCount,
            at: Date.now()
        };

        if (isChopstickSeatDefeated(next, opponentSeat)) {
            next.winner = seat;
            next.status = "finished";
        } else {
            next.turn = opponentSeat;
        }

        return {
            ok: true,
            match: next
        };
    }

    if (move && move.type === "split") {
        const currentHands = match.hands[seat];
        const proposedHands = Array.isArray(move.hands)
            ? [Number(move.hands[0]), Number(move.hands[1])]
            : [NaN, NaN];
        const isValidValue = proposedHands.every(
            (value) => Number.isInteger(value) && value >= 0 && value <= 4
        );

        if (!isValidValue) {
            return {
                ok: false,
                error: "Split hands must stay between 0 and 4."
            };
        }

        if (currentHands[0] + currentHands[1] !== proposedHands[0] + proposedHands[1]) {
            return {
                ok: false,
                error: "A split must preserve your total fingers."
            };
        }

        if (currentHands[0] === proposedHands[0] && currentHands[1] === proposedHands[1]) {
            return {
                ok: false,
                error: "That split does not change anything."
            };
        }

        next.hands[seat] = proposedHands;
        next.sequence = actionId;
        next.lastAction = {
            id: actionId,
            type: "split",
            seat,
            hands: proposedHands,
            at: Date.now()
        };
        next.turn = opponentSeat;

        return {
            ok: true,
            match: next
        };
    }

    return {
        ok: false,
        error: "Unknown move type."
    };
}

function sanitizeChopstickProfile(profile = {}) {
    const name = typeof profile.name === "string" && profile.name.trim()
        ? profile.name.trim().slice(0, 20)
        : "Arena Pilot";
    const skinId = typeof profile.skinId === "string" && profile.skinId.trim()
        ? profile.skinId.trim().slice(0, 32)
        : "ember";

    return { name, skinId };
}

function generateChopstickRoomCode(chopstickRooms) {
    let code = "";
    do {
        code = String(Math.floor(100000 + Math.random() * 900000));
    } while (chopstickRooms.has(code));

    return code;
}

function createChopstickRoomSnapshot(room) {
    const players = Object.fromEntries(
        CHOPSTICK_SEATS.map((seat) => {
            const player = room.players[seat];
            return [
                seat,
                player
                    ? {
                        seat: player.seat,
                        name: player.name,
                        skinId: player.skinId,
                        connected: player.connected
                    }
                    : null
            ];
        })
    );

    return {
        code: room.code,
        createdAt: room.createdAt,
        players,
        rematchVotes: [...room.rematchVotes],
        match: room.match
    };
}

function createRealtimeHub(io) {
    const rooms = new Map();
    const chopstickRooms = new Map();
    const carWrestlingRooms = new Map();
    const carWrestlingTicker = setInterval(() => {
        stepCarWrestlingRooms(io, carWrestlingRooms);
    }, CAR_WRESTLING_TICK_MS);

    if (typeof carWrestlingTicker.unref === "function") {
        carWrestlingTicker.unref();
    }

    function getOrCreateRoom(gameId, roomId) {
        const key = createRoomKey(gameId, roomId);
        const existing = rooms.get(key);

        if (existing) {
            return existing;
        }

        const created = {
            key,
            gameId,
            roomId,
            createdAt: Date.now(),
            hostId: null,
            players: new Map()
        };

        rooms.set(key, created);
        return created;
    }

    function serializePlayer(player) {
        return {
            id: player.id,
            name: player.name,
            joinedAt: player.joinedAt,
            meta: player.meta || {}
        };
    }

    function serializeRoom(room) {
        return {
            key: room.key,
            gameId: room.gameId,
            roomId: room.roomId,
            hostId: room.hostId,
            createdAt: room.createdAt,
            playerCount: room.players.size,
            players: [...room.players.values()].map(serializePlayer)
        };
    }

    function getRoomsSnapshot() {
        return [...rooms.values()]
            .map(serializeRoom)
            .sort((left, right) => left.gameId.localeCompare(right.gameId) || left.roomId.localeCompare(right.roomId));
    }

    function emitRoomState(room) {
        const snapshot = serializeRoom(room);
        io.to(room.key).emit("gamehub:room-state", snapshot);
        io.to(room.key).emit("room-state", snapshot);
        return snapshot;
    }

    function detachSocket(socket, reason = "left-room") {
        const currentRoomKey = socket.data.roomKey;
        if (!currentRoomKey) {
            return null;
        }

        socket.leave(currentRoomKey);

        const room = rooms.get(currentRoomKey);
        socket.data.roomKey = "";
        socket.data.roomId = "";
        socket.data.gameId = socket.data.defaultGameId || "lobby";

        if (!room) {
            return null;
        }

        const player = room.players.get(socket.id);
        room.players.delete(socket.id);

        if (room.hostId === socket.id) {
            room.hostId = room.players.keys().next().value || null;
        }

        const playerSnapshot = player ? serializePlayer(player) : {
            id: socket.id,
            name: cleanPlayerName(socket.data.playerName, "Player"),
            joinedAt: Date.now(),
            meta: {}
        };

        const payload = {
            player: playerSnapshot,
            reason
        };

        socket.to(room.key).emit("gamehub:player-left", payload);
        socket.to(room.key).emit("player-left", playerSnapshot);

        if (room.players.size === 0) {
            rooms.delete(room.key);
            return payload;
        }

        payload.room = emitRoomState(room);
        return payload;
    }

    function joinSocketToRoom(socket, options = {}, ack) {
        if (socket.data.roomKey) {
            detachSocket(socket, "switched-room");
        }

        const gameId = sanitizeSegment(options.gameId || socket.data.defaultGameId || socket.data.gameId, "lobby");
        const roomId = sanitizeSegment(options.roomId || options.room || socket.data.defaultRoomId || socket.data.roomId, "default");
        const room = getOrCreateRoom(gameId, roomId);
        const fallbackName = socket.data.playerName || `Player ${room.players.size + 1}`;
        const player = {
            id: socket.id,
            name: cleanPlayerName(options.playerName || fallbackName, fallbackName),
            joinedAt: Date.now(),
            meta: isPlainObject(options.meta) ? options.meta : {}
        };

        room.players.set(socket.id, player);
        if (!room.hostId) {
            room.hostId = socket.id;
        }

        socket.join(room.key);

        socket.data.defaultGameId = gameId;
        socket.data.defaultRoomId = roomId;
        socket.data.gameId = gameId;
        socket.data.roomId = roomId;
        socket.data.roomKey = room.key;
        socket.data.playerName = player.name;

        const payload = {
            room: serializeRoom(room),
            player: serializePlayer(player),
            socketId: socket.id
        };

        socket.emit("gamehub:joined-room", payload);
        socket.emit("joined-room", payload);
        socket.to(room.key).emit("gamehub:player-joined", payload);
        socket.to(room.key).emit("player-joined", payload.player);
        emitRoomState(room);

        if (typeof ack === "function") {
            ack({ ok: true, ...payload });
        }

        return payload;
    }

    function getTargetRoomKey(socket, args) {
        const candidate = args.find(isPlainObject);
        const gameId = sanitizeSegment(candidate && candidate.gameId ? candidate.gameId : socket.data.gameId || socket.data.defaultGameId, "lobby");
        const roomId = sanitizeSegment(candidate && (candidate.roomId || candidate.room) ? candidate.roomId || candidate.room : socket.data.roomId || socket.data.defaultRoomId, "default");
        return createRoomKey(gameId, roomId);
    }

    function relaySocketEvent(socket, eventName, args) {
        const roomKey = getTargetRoomKey(socket, args);
        if (!roomKey || !rooms.has(roomKey)) {
            return;
        }

        socket.to(roomKey).emit(eventName, ...args);
    }

    function sendRoomsSnapshot(socket, maybeAck) {
        const payload = {
            rooms: getRoomsSnapshot(),
            clientScript: "/socket.io/socket.io.js",
            helperScript: "/gamehub-socket.js",
            gameRooms: {
                [CAR_WRESTLING_GAME_ID]: [...carWrestlingRooms.values()]
                    .map(buildCarWrestlingRoomSnapshot)
                    .sort((left, right) => left.roomId.localeCompare(right.roomId)),
                [CHOPSTICK_GAME_ID]: [...chopstickRooms.values()]
                    .map(createChopstickRoomSnapshot)
                    .sort((left, right) => left.code.localeCompare(right.code))
            }
        };

        if (typeof maybeAck === "function") {
            maybeAck(payload);
            return;
        }

        socket.emit("gamehub:rooms", payload);
    }

    function broadcastChopstickRoom(room) {
        io.to(room.code).emit("room:update", createChopstickRoomSnapshot(room));
    }

    function resetChopstickMatch(room) {
        const bothConnected = room.players.A && room.players.A.connected && room.players.B && room.players.B.connected;
        room.match = createChopstickInitialMatchState({
            status: bothConnected ? "playing" : "waiting"
        });
        room.rematchVotes.clear();
    }

    function removeChopstickRoomIfEmpty(room) {
        const hasConnectedPlayer = Boolean(
            (room.players.A && room.players.A.connected) || (room.players.B && room.players.B.connected)
        );

        if (!hasConnectedPlayer) {
            chopstickRooms.delete(room.code);
        }
    }

    function detachSocketFromChopstickRoom(socket, { disconnecting = false } = {}) {
        const roomCode = socket.data.chopstickRoomCode;
        const seat = socket.data.chopstickSeat;

        if (!roomCode || !seat) {
            return;
        }

        const room = chopstickRooms.get(roomCode);
        if (!room) {
            socket.data.chopstickRoomCode = "";
            socket.data.chopstickSeat = "";
            return;
        }

        const player = room.players[seat];
        if (player && player.socketId === socket.id) {
            player.connected = false;
            player.socketId = null;
        }

        room.rematchVotes.clear();
        room.match.status = room.match.winner ? "finished" : "waiting";

        if (!disconnecting) {
            socket.leave(roomCode);
        }

        socket.data.chopstickRoomCode = "";
        socket.data.chopstickSeat = "";

        removeChopstickRoomIfEmpty(room);
        if (chopstickRooms.has(roomCode)) {
            broadcastChopstickRoom(room);
        }
    }

    function assignChopstickSeat(room) {
        if (!room.players.A || !room.players.A.connected) {
            return "A";
        }

        if (!room.players.B || !room.players.B.connected) {
            return "B";
        }

        return null;
    }

    io.on("connection", (socket) => {
        const initial = resolveSocketContext(socket.handshake);

        socket.data.defaultGameId = initial.gameId;
        socket.data.defaultRoomId = initial.roomId;
        socket.data.playerName = initial.playerName;
        socket.data.gameId = "";
        socket.data.roomId = "";
        socket.data.roomKey = "";
        socket.data.chopstickRoomCode = "";
        socket.data.chopstickSeat = "";
        socket.data.carWrestlingRoomId = "";

        joinSocketToRoom(socket, initial);

        socket.emit("gamehub:ready", {
            socketId: socket.id,
            gameId: socket.data.gameId,
            roomId: socket.data.roomId,
            roomKey: socket.data.roomKey,
            clientScript: "/socket.io/socket.io.js",
            helperScript: "/gamehub-socket.js"
        });

        socket.on("gamehub:join", (payload = {}, ack) => {
            joinSocketToRoom(socket, isPlainObject(payload) ? payload : {}, ack);
        });

        socket.on("join-room", (payload = {}, ack) => {
            joinSocketToRoom(socket, isPlainObject(payload) ? payload : {}, ack);
        });

        socket.on("gamehub:leave", (_payload, ack) => {
            const left = detachSocket(socket, "left-room");
            if (typeof ack === "function") {
                ack({ ok: true, left });
            }
        });

        socket.on("leave-room", (_payload, ack) => {
            const left = detachSocket(socket, "left-room");
            if (typeof ack === "function") {
                ack({ ok: true, left });
            }
        });

        socket.on("gamehub:rooms", (payload, ack) => {
            sendRoomsSnapshot(socket, typeof payload === "function" ? payload : ack);
        });

        socket.on("rooms:list", (payload, ack) => {
            sendRoomsSnapshot(socket, typeof payload === "function" ? payload : ack);
        });

        socket.on("room:create", ({ profile } = {}, callback) => {
            detachSocketFromChopstickRoom(socket);

            const code = generateChopstickRoomCode(chopstickRooms);
            const host = sanitizeChopstickProfile(profile);
            const room = {
                code,
                createdAt: Date.now(),
                players: {
                    A: {
                        seat: "A",
                        name: host.name,
                        skinId: host.skinId,
                        connected: true,
                        socketId: socket.id
                    },
                    B: null
                },
                rematchVotes: new Set(),
                match: createChopstickInitialMatchState({
                    status: "waiting"
                })
            };

            chopstickRooms.set(code, room);
            socket.join(code);
            socket.data.chopstickRoomCode = code;
            socket.data.chopstickSeat = "A";

            if (typeof callback === "function") {
                callback({
                    ok: true,
                    seat: "A",
                    room: createChopstickRoomSnapshot(room)
                });
            }
        });

        socket.on("room:join", ({ roomCode, profile } = {}, callback) => {
            detachSocketFromChopstickRoom(socket);

            const code = String(roomCode || "").trim();
            const room = chopstickRooms.get(code);

            if (!room) {
                if (typeof callback === "function") {
                    callback({
                        ok: false,
                        error: "Room code not found."
                    });
                }
                return;
            }

            const seat = assignChopstickSeat(room);
            if (!seat) {
                if (typeof callback === "function") {
                    callback({
                        ok: false,
                        error: "That room is already full."
                    });
                }
                return;
            }

            const player = sanitizeChopstickProfile(profile);
            room.players[seat] = {
                seat,
                name: player.name,
                skinId: player.skinId,
                connected: true,
                socketId: socket.id
            };

            socket.join(code);
            socket.data.chopstickRoomCode = code;
            socket.data.chopstickSeat = seat;

            resetChopstickMatch(room);
            broadcastChopstickRoom(room);

            if (typeof callback === "function") {
                callback({
                    ok: true,
                    seat,
                    room: createChopstickRoomSnapshot(room)
                });
            }
        });

        socket.on("match:move", ({ move } = {}, callback) => {
            const room = chopstickRooms.get(socket.data.chopstickRoomCode);
            const seat = socket.data.chopstickSeat;

            if (!room || !seat) {
                if (typeof callback === "function") {
                    callback({
                        ok: false,
                        error: "Join a room before sending moves."
                    });
                }
                return;
            }

            const result = applyChopstickMove(room.match, seat, move);
            if (!result.ok) {
                if (typeof callback === "function") {
                    callback(result);
                }
                return;
            }

            room.match = result.match;
            room.rematchVotes.clear();
            broadcastChopstickRoom(room);

            if (typeof callback === "function") {
                callback({
                    ok: true
                });
            }
        });

        socket.on("match:reaction", ({ emoji } = {}, callback) => {
            const room = chopstickRooms.get(socket.data.chopstickRoomCode);
            const seat = socket.data.chopstickSeat;

            if (!room || !seat) {
                if (typeof callback === "function") {
                    callback({
                        ok: false,
                        error: "Join a room before sending reactions."
                    });
                }
                return;
            }

            room.match = applyChopstickReaction(room.match, seat, String(emoji || "").slice(0, 4));
            broadcastChopstickRoom(room);

            if (typeof callback === "function") {
                callback({
                    ok: true
                });
            }
        });

        socket.on("match:rematch", (_payload, callback) => {
            const room = chopstickRooms.get(socket.data.chopstickRoomCode);
            const seat = socket.data.chopstickSeat;

            if (!room || !seat) {
                if (typeof callback === "function") {
                    callback({
                        ok: false,
                        error: "Join a room before requesting a rematch."
                    });
                }
                return;
            }

            room.rematchVotes.add(seat);
            const bothConnected = room.players.A && room.players.A.connected && room.players.B && room.players.B.connected;

            if (bothConnected && room.rematchVotes.size === 2) {
                resetChopstickMatch(room);
            }

            broadcastChopstickRoom(room);

            if (typeof callback === "function") {
                callback({
                    ok: true
                });
            }
        });

        socket.on(CAR_WRESTLING_EVENTS.roomCreate, (payload = {}, reply) => {
            const arenaId = sanitizeCarWrestlingArenaId(payload.arenaId);
            const room = createCarWrestlingRoomState(createCarWrestlingRoomId(carWrestlingRooms), arenaId);
            carWrestlingRooms.set(room.id, room);
            joinCarWrestlingRoom(io, socket, carWrestlingRooms, room, reply);
        });

        socket.on(CAR_WRESTLING_EVENTS.roomJoin, (payload = {}, reply) => {
            const roomId = sanitizeCarWrestlingRoomId(payload.roomId);
            const room = carWrestlingRooms.get(roomId);

            if (!room) {
                replyToCarWrestlingSocket(reply, { ok: false, message: "Room not found. Check the ID and try again." });
                return;
            }

            joinCarWrestlingRoom(io, socket, carWrestlingRooms, room, reply);
        });

        socket.on(CAR_WRESTLING_EVENTS.roomLeave, () => {
            removeCarWrestlingSocketFromRoom(io, carWrestlingRooms, socket, {
                reason: "A player left the room."
            });
            socket.emit(CAR_WRESTLING_EVENTS.roomLeft, { ok: true });
        });

        socket.on(CAR_WRESTLING_EVENTS.roomStart, (reply) => {
            const room = getCarWrestlingRoomForSocket(socket, carWrestlingRooms);
            if (!room) {
                replyToCarWrestlingSocket(reply, { ok: false, message: "Join a room first." });
                return;
            }

            if (room.phase !== "lobby") {
                replyToCarWrestlingSocket(reply, { ok: false, message: "This room match has already started." });
                return;
            }

            if (room.hostId !== socket.id) {
                replyToCarWrestlingSocket(reply, { ok: false, message: "Only the host can start the room match." });
                return;
            }

            if (room.players.size < CAR_WRESTLING_MIN_PLAYERS) {
                replyToCarWrestlingSocket(reply, { ok: false, message: "At least 2 players are required to start." });
                return;
            }

            startCarWrestlingRoomMatch(room);
            emitCarWrestlingRoomState(io, room);
            replyToCarWrestlingSocket(reply, { ok: true });
        });

        socket.on(CAR_WRESTLING_EVENTS.roomDiscard, (reply) => {
            const room = getCarWrestlingRoomForSocket(socket, carWrestlingRooms);
            if (!room) {
                replyToCarWrestlingSocket(reply, { ok: false, message: "Join a room first." });
                return;
            }

            if (room.hostId !== socket.id || room.phase !== "lobby") {
                replyToCarWrestlingSocket(reply, { ok: false, message: "Only the host can discard the lobby before the match starts." });
                return;
            }

            closeCarWrestlingRoom(io, carWrestlingRooms, room, "The host discarded the room before the match started.");
            replyToCarWrestlingSocket(reply, { ok: true });
        });

        socket.on(CAR_WRESTLING_EVENTS.roomKick, (payload = {}, reply) => {
            const room = getCarWrestlingRoomForSocket(socket, carWrestlingRooms);
            const targetId = String(payload.playerId || "");
            if (!room) {
                replyToCarWrestlingSocket(reply, { ok: false, message: "Join a room first." });
                return;
            }

            if (room.hostId !== socket.id || room.phase !== "lobby") {
                replyToCarWrestlingSocket(reply, { ok: false, message: "Only the host can remove players before the match starts." });
                return;
            }

            if (!targetId || !room.players.has(targetId) || targetId === socket.id) {
                replyToCarWrestlingSocket(reply, { ok: false, message: "Choose a valid player to remove." });
                return;
            }

            removeCarWrestlingPlayerFromRoom(io, carWrestlingRooms, room, targetId, {
                reason: "The host removed you from the room.",
                notifyEvent: CAR_WRESTLING_EVENTS.roomKicked
            });
            replyToCarWrestlingSocket(reply, { ok: true });
        });

        socket.on(CAR_WRESTLING_EVENTS.roomRestart, () => {
            const room = getCarWrestlingRoomForSocket(socket, carWrestlingRooms);
            if (!room || room.hostId !== socket.id || room.phase !== "finished") {
                return;
            }

            startCarWrestlingRoomMatch(room, "Host restarted the match.");
            emitCarWrestlingRoomState(io, room);
        });

        socket.on(CAR_WRESTLING_EVENTS.playerInput, (payload = {}) => {
            const room = getCarWrestlingRoomForSocket(socket, carWrestlingRooms);
            if (!room) {
                return;
            }

            const player = room.players.get(socket.id);
            if (!player) {
                return;
            }

            player.input.throttle = clampCarWrestling(Number(payload.throttle) || 0, -1, 1);
            player.input.steer = clampCarWrestling(Number(payload.steer) || 0, -1, 1);
        });

        socket.on(CAR_WRESTLING_EVENTS.playerBoost, () => {
            const room = getCarWrestlingRoomForSocket(socket, carWrestlingRooms);
            if (!room || room.phase !== "running") {
                return;
            }

            const player = room.players.get(socket.id);
            if (!player) {
                return;
            }

            activateCarWrestlingBoost(room, player);
        });

        socket.on("disconnect", (reason) => {
            detachSocket(socket, reason);
            detachSocketFromChopstickRoom(socket, { disconnecting: true });
            removeCarWrestlingSocketFromRoom(io, carWrestlingRooms, socket, {
                reason: "A player disconnected from the room."
            });
        });

        socket.onAny((eventName, ...args) => {
            if (SOCKET_CONTROL_EVENTS.has(eventName)) {
                return;
            }

            relaySocketEvent(socket, eventName, args);
        });
    });

    return {
        getRoomsSnapshot,
        getChopstickRoomsSnapshot() {
            return [...chopstickRooms.values()]
                .map(createChopstickRoomSnapshot)
                .sort((left, right) => left.code.localeCompare(right.code));
        },
        getCarWrestlingRoomsSnapshot() {
            return [...carWrestlingRooms.values()]
                .map(buildCarWrestlingRoomSnapshot)
                .sort((left, right) => left.roomId.localeCompare(right.roomId));
        }
    };
}
module.exports = {
    createRealtimeHub
};
