import { CARROM_BOARD, CARROM_INPUT } from '../config/carrom-constants.js';

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function length(vector) {
  return Math.hypot(vector.x, vector.z);
}

export function distance(a, b) {
  return Math.hypot(a.x - b.x, a.z - b.z);
}

export function normalize(vector, fallback = { x: 0, z: 1 }) {
  const magnitude = length(vector);
  if (magnitude < 0.0001) {
    return { ...fallback };
  }
  return {
    x: vector.x / magnitude,
    z: vector.z / magnitude
  };
}

export function add(a, b) {
  return { x: a.x + b.x, z: a.z + b.z };
}

export function subtract(a, b) {
  return { x: a.x - b.x, z: a.z - b.z };
}

export function scale(vector, scalar) {
  return { x: vector.x * scalar, z: vector.z * scalar };
}

export function rotateVector(vector, radians) {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return {
    x: vector.x * cos - vector.z * sin,
    z: vector.x * sin + vector.z * cos
  };
}

export function angleBetween(a, b) {
  const left = normalize(a);
  const right = normalize(b);
  return Math.acos(clamp(dot(left, right), -1, 1));
}

export function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

export function distancePointToSegment(point, start, end) {
  const segment = subtract(end, start);
  const segmentLengthSq = segment.x * segment.x + segment.z * segment.z;
  if (segmentLengthSq <= 0.00001) {
    return distance(point, start);
  }

  const t = clamp(
    ((point.x - start.x) * segment.x + (point.z - start.z) * segment.z) / segmentLengthSq,
    0,
    1
  );
  return distance(point, {
    x: start.x + segment.x * t,
    z: start.z + segment.z * t
  });
}

export function getBaselineRange(baseline = 'top') {
  const min = -CARROM_BOARD.BASELINE_HALF_LENGTH + CARROM_BOARD.STRIKER_RADIUS;
  const max = CARROM_BOARD.BASELINE_HALF_LENGTH - CARROM_BOARD.STRIKER_RADIUS;
  const offset = CARROM_BOARD.BASELINE_OFFSET;
  return baseline === 'top'
    ? { minX: min, maxX: max, fixedZ: -offset }
    : { minX: min, maxX: max, fixedZ: offset };
}

export function sampleBaselinePositions(baseline = 'top', count = 11) {
  const range = getBaselineRange(baseline);
  const samples = Math.max(3, count);
  return Array.from({ length: samples }, (_, index) => {
    const t = samples === 1 ? 0.5 : index / (samples - 1);
    return {
      x: range.minX + (range.maxX - range.minX) * t,
      z: range.fixedZ
    };
  });
}

export function isPlacementSafe(position, radius, bodies, ignoreIds = new Set()) {
  return !bodies.some((body) => {
    if (ignoreIds.has(body.id) || body.isPocketed) {
      return false;
    }
    const minDistance = radius + body.radius + CARROM_INPUT.PLACEMENT_PADDING;
    return distance(position, body.position) < minDistance;
  });
}

export function getPathBlockers(start, end, bodies, {
  ignoreIds = new Set(),
  clearance = CARROM_BOARD.COIN_RADIUS * 1.75
} = {}) {
  return bodies.filter((body) => {
    if (ignoreIds.has(body.id) || body.isPocketed || body.type === 'striker') {
      return false;
    }
    const required = clearance + body.radius * 0.35;
    return distancePointToSegment(body.position, start, end) < required;
  });
}

export function estimatePocketRisk(strikerPosition, direction, pockets, maxTravel = 2.55) {
  return estimatePocketRiskScore(strikerPosition, direction, pockets, maxTravel) > 0.35;
}

export function estimatePocketRiskScore(strikerPosition, direction, pockets, maxTravel = 2.55) {
  const normalized = normalize(direction, { x: 0, z: -1 });
  const end = add(strikerPosition, scale(normalized, maxTravel));
  const dangerRadius = CARROM_BOARD.STRIKER_RADIUS * 1.45;
  return pockets.reduce((highest, pocket) => {
    const ahead = dot(subtract(pocket.position, strikerPosition), normalized) > 0;
    if (!ahead) {
      return highest;
    }
    const segmentDistance = distancePointToSegment(pocket.position, strikerPosition, end);
    if (segmentDistance >= dangerRadius) {
      return highest;
    }
    const closeness = 1 - segmentDistance / dangerRadius;
    return Math.max(highest, closeness);
  }, 0);
}

export function dot(a, b) {
  return a.x * b.x + a.z * b.z;
}

export function getOneRailBankPaths(target, pocket) {
  const half = CARROM_BOARD.PLAY_AREA_SIZE / 2 - CARROM_BOARD.COIN_RADIUS * 0.65;
  const rails = [
    { id: 'left', axis: 'x', value: -half },
    { id: 'right', axis: 'x', value: half },
    { id: 'top', axis: 'z', value: -half },
    { id: 'bottom', axis: 'z', value: half }
  ];

  return rails.map((rail) => {
    const reflectedPocket = rail.axis === 'x'
      ? { x: rail.value * 2 - pocket.position.x, z: pocket.position.z }
      : { x: pocket.position.x, z: rail.value * 2 - pocket.position.z };
    const travelDirection = normalize(subtract(reflectedPocket, target.position));
    const denominator = rail.axis === 'x' ? travelDirection.x : travelDirection.z;
    if (Math.abs(denominator) < 0.0001) {
      return null;
    }

    const targetAxis = rail.axis === 'x' ? target.position.x : target.position.z;
    const t = (rail.value - targetAxis) / denominator;
    if (t <= CARROM_BOARD.COIN_RADIUS * 1.8) {
      return null;
    }

    const railPoint = add(target.position, scale(travelDirection, t));
    const crossValue = rail.axis === 'x' ? railPoint.z : railPoint.x;
    if (Math.abs(crossValue) > half) {
      return null;
    }

    const railToPocket = normalize(subtract(pocket.position, railPoint));
    const bankAngle = angleBetween(travelDirection, railToPocket);
    if (bankAngle < 0.18 || bankAngle > 2.45) {
      return null;
    }

    return {
      railId: rail.id,
      railPoint,
      reflectedPocket,
      travelDirection,
      railToPocket,
      bankAngle,
      totalDistance: distance(target.position, railPoint) + distance(railPoint, pocket.position)
    };
  }).filter(Boolean);
}
