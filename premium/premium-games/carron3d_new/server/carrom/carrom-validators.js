import { CARROM_BOARD, CARROM_INPUT, normalizeClassicRuleVariant } from '../../src/config/carrom-constants.js';
import { isValidRoomCode, normalizeRoomCode } from './carrom-room-code.js';

const VALID_RULE_MODES = new Set(['classic', 'freeCapture']);
const VALID_COIN_ASSIGNMENTS = new Set(['p1White', 'p1Black', 'random', 'firstPocket']);
const SHOT_SPAM_MS = 450;
const MAX_SHOT_PAYLOAD_BYTES = 2048;
const MAX_COORDINATE_ABS = 10;
const MIN_DIRECTION_LENGTH = 0.85;
const MAX_DIRECTION_LENGTH = 1.15;
const MIN_POWER_RATIO = 0;
const MAX_POWER_RATIO = 1.05;
const CLIENT_SHOT_ID_PATTERN = /^[A-Za-z0-9:_-]{1,80}$/;

export const SHOT_REJECTION_CODES = {
  ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
  SESSION_INVALID: 'SESSION_INVALID',
  MATCH_NOT_PLAYING: 'MATCH_NOT_PLAYING',
  NOT_YOUR_TURN: 'NOT_YOUR_TURN',
  PIECES_MOVING: 'PIECES_MOVING',
  INVALID_STRIKER_POSITION: 'INVALID_STRIKER_POSITION',
  STRIKER_OVERLAP: 'STRIKER_OVERLAP',
  INVALID_DIRECTION: 'INVALID_DIRECTION',
  INVALID_POWER: 'INVALID_POWER',
  DUPLICATE_SHOT: 'DUPLICATE_SHOT',
  RATE_LIMITED: 'RATE_LIMITED'
};

function reject(code, message) {
  return { valid: false, code, message };
}

function isPlainObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function getPayloadSize(value) {
  try {
    return JSON.stringify(value || {}).length;
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}

function isFiniteNumber(value) {
  return Number.isFinite(Number(value));
}

function normalizeRuleMode(value) {
  return value === 'freeCapture' ? 'freeCapture' : 'classic';
}

export function normalizeMatchConfig(config = {}) {
  const ruleMode = normalizeRuleMode(config.ruleMode);
  const classicRuleVariant = normalizeClassicRuleVariant(config.classicRuleVariant);
  const coinAssignmentMode = VALID_COIN_ASSIGNMENTS.has(config.coinAssignmentMode || config.coinSide)
    ? config.coinAssignmentMode || config.coinSide
    : 'p1White';
  return {
    ruleMode: VALID_RULE_MODES.has(ruleMode) ? ruleMode : 'classic',
    classicRuleVariant,
    coinAssignmentMode,
    coinSide: coinAssignmentMode
  };
}

export function validateRoomCode(value) {
  const roomCode = normalizeRoomCode(value);
  return {
    valid: isValidRoomCode(roomCode),
    roomCode,
    message: 'Enter a valid room code.'
  };
}

export function normalizeVector(vector = {}) {
  const x = Number(vector.x);
  const z = Number(vector.z);
  if (!Number.isFinite(x) || !Number.isFinite(z)) {
    return null;
  }
  const length = Math.hypot(x, z);
  if (length < MIN_DIRECTION_LENGTH || length > MAX_DIRECTION_LENGTH) {
    return null;
  }
  return {
    x: x / length,
    z: z / length
  };
}

function normalizeShotPower(payload = {}) {
  const rawPower = Number(payload.power);
  if (
    Number.isFinite(rawPower)
    && rawPower >= CARROM_INPUT.MIN_SHOT_POWER
    && rawPower <= CARROM_INPUT.MAX_SHOT_POWER
  ) {
    return rawPower;
  }

  const rawRatio = Number(payload.powerRatio);
  if (!Number.isFinite(rawRatio) || rawRatio < MIN_POWER_RATIO || rawRatio > MAX_POWER_RATIO) {
    return null;
  }

  const ratio = Math.min(Math.max(rawRatio, 0), 1);
  const derivedPower = ratio * CARROM_INPUT.MAX_SHOT_POWER;
  if (derivedPower < CARROM_INPUT.MIN_SHOT_POWER || derivedPower > CARROM_INPUT.MAX_SHOT_POWER) {
    return null;
  }

  return derivedPower;
}

export function validateShotPayload({ room, player, payload = {} }) {
  if (!isPlainObject(payload) || getPayloadSize(payload) > MAX_SHOT_PAYLOAD_BYTES) {
    return reject(SHOT_REJECTION_CODES.SESSION_INVALID, 'Shot payload is malformed.');
  }

  if (!room || room.status !== 'playing' || !room.matchEngine) {
    return reject(SHOT_REJECTION_CODES.MATCH_NOT_PLAYING, 'Match is not playing.');
  }

  if (!player) {
    return reject(SHOT_REJECTION_CODES.SESSION_INVALID, 'You are not seated in this room.');
  }

  if (!player.isConnected) {
    return reject(SHOT_REJECTION_CODES.SESSION_INVALID, 'Reconnect before shooting.');
  }

  if (room.hasDisconnectGrace?.()) {
    return reject(SHOT_REJECTION_CODES.MATCH_NOT_PLAYING, 'Waiting for opponent to reconnect.');
  }

  if (room.hasRematchPending?.()) {
    return reject(SHOT_REJECTION_CODES.MATCH_NOT_PLAYING, 'Rematch request is pending.');
  }

  const matchState = room.matchEngine.matchStateManager?.state;
  if (!matchState || payload.matchId !== matchState.matchId) {
    return reject(SHOT_REJECTION_CODES.MATCH_NOT_PLAYING, 'Match state is out of sync.');
  }

  if (matchState.status !== 'playing') {
    return reject(SHOT_REJECTION_CODES.MATCH_NOT_PLAYING, 'Match is already finished.');
  }

  if (matchState.currentPlayerId !== player.playerId) {
    return reject(SHOT_REJECTION_CODES.NOT_YOUR_TURN, 'It is not your turn.');
  }

  if (room.turnTimer?.active && room.turnTimer.currentPlayerId === player.playerId) {
    room.updateTurnTimer?.();
    if (room.turnTimer.remainingMs <= 0) {
      return reject(SHOT_REJECTION_CODES.MATCH_NOT_PLAYING, 'Turn timer expired.');
    }
  }

  const motion = room.matchEngine.physicsWorld?.getMotionState?.();
  if (motion?.anyMoving) {
    return reject(SHOT_REJECTION_CODES.PIECES_MOVING, 'Wait for pieces to settle.');
  }

  const clientShotId = String(payload.clientShotId || '').trim().slice(0, 80);
  if (!CLIENT_SHOT_ID_PATTERN.test(clientShotId)) {
    return reject(SHOT_REJECTION_CODES.DUPLICATE_SHOT, 'Shot id is invalid.');
  }
  if (player.clientShotIds.has(clientShotId)) {
    return reject(SHOT_REJECTION_CODES.DUPLICATE_SHOT, 'Duplicate shot ignored.');
  }

  const now = Date.now();
  if (now - player.lastShotAt < SHOT_SPAM_MS) {
    return reject(SHOT_REJECTION_CODES.RATE_LIMITED, 'Shot submitted too quickly.');
  }

  const strikerPosition = payload.strikerPosition || {};
  if (!isFiniteNumber(strikerPosition.x) || !isFiniteNumber(strikerPosition.z)) {
    return reject(SHOT_REJECTION_CODES.INVALID_STRIKER_POSITION, 'Invalid striker position.');
  }

  const activeBaseline = room.matchEngine.matchStateManager.getActiveBaseline();
  const offset = activeBaseline === 'top' ? -CARROM_BOARD.BASELINE_OFFSET : CARROM_BOARD.BASELINE_OFFSET;
  const minX = -CARROM_BOARD.BASELINE_HALF_LENGTH + CARROM_BOARD.STRIKER_RADIUS;
  const maxX = CARROM_BOARD.BASELINE_HALF_LENGTH - CARROM_BOARD.STRIKER_RADIUS;
  const tolerance = 0.075;
  const x = Number(strikerPosition.x);
  const z = Number(strikerPosition.z);
  if (Math.abs(x) > MAX_COORDINATE_ABS || Math.abs(z) > MAX_COORDINATE_ABS) {
    return reject(SHOT_REJECTION_CODES.INVALID_STRIKER_POSITION, 'Invalid striker position.');
  }
  if (x < minX - tolerance || x > maxX + tolerance || Math.abs(z - offset) > tolerance) {
    return reject(SHOT_REJECTION_CODES.INVALID_STRIKER_POSITION, 'Illegal striker placement.');
  }

  const striker = room.matchEngine.physicsWorld.getStrikerBody();
  if (!striker) {
    return reject(SHOT_REJECTION_CODES.INVALID_STRIKER_POSITION, 'Striker is missing.');
  }
  if (striker.isPocketed) {
    return reject(SHOT_REJECTION_CODES.INVALID_STRIKER_POSITION, 'Striker is not ready.');
  }
  if (room.matchEngine.physicsWorld.isCircleOverlapping(x, z, striker.radius + CARROM_INPUT.PLACEMENT_PADDING, striker.id)) {
    return reject(SHOT_REJECTION_CODES.STRIKER_OVERLAP, 'Striker overlaps another piece.');
  }

  const direction = normalizeVector(payload.direction);
  if (!direction) {
    return reject(SHOT_REJECTION_CODES.INVALID_DIRECTION, 'Invalid shot direction.');
  }

  const power = normalizeShotPower(payload);
  if (power === null) {
    return reject(SHOT_REJECTION_CODES.INVALID_POWER, 'Invalid shot power.');
  }

  return {
    valid: true,
    clientShotId,
    strikerPosition: { x, z },
    direction,
    power
  };
}
