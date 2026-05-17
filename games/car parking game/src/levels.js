const LOT_LIMIT = 14.5;
const BASE_Y = 0.62;
const STRIPE_Y = 0.08;
const PARKING_HEIGHT = 0.16;
const COLOR_POOL = [
  "#2b4252",
  "#6f8ca3",
  "#54666f",
  "#4d5365",
  "#7f5c3d",
  "#586c57",
  "#6d5760",
  "#37414f",
  "#455668",
  "#785c4e",
  "#324654",
  "#4d6577",
  "#53646f",
  "#7a6148",
  "#50645b",
  "#6d5b65",
];

const LAYOUT_LABELS = {
  straight: "Straight Parking",
  parallel: "Parallel Parking",
  angled: "Angled Parking",
  reverse: "Reverse Parking",
  drift: "Drift Parking",
};

export const GAME_MODES = [
  {
    id: "normal",
    name: "Normal",
    description: "Forgiving on tiny taps. Focus on placement and control.",
    collisionThreshold: 3.2,
    parkingAngleTolerance: 16,
    reverseOnly: false,
  },
  {
    id: "one-scratch",
    name: "One Scratch",
    description: "Any touch counts. Thread the slot flawlessly.",
    collisionThreshold: 0.45,
    parkingAngleTolerance: 12,
    reverseOnly: false,
  },
  {
    id: "drift-parking",
    name: "Drift Parking",
    description: "Carry speed, break rear traction, and stop the slide inside the box.",
    collisionThreshold: 0.45,
    parkingAngleTolerance: 9,
    reverseOnly: false,
    driftRequired: true,
    driftActivationSpeed: 7.2,
    driftRecentWindow: 2200,
  },
  {
    id: "reverse-only",
    name: "Reverse Only",
    description: "Forward throttle is locked out. Back it in cleanly.",
    collisionThreshold: 0.45,
    parkingAngleTolerance: 12,
    reverseOnly: true,
  },
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  let current = seed >>> 0;
  return () => {
    current += 0x6d2b79f5;
    let t = current;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomRange(rng, min, max) {
  return min + (max - min) * rng();
}

function randomSign(rng) {
  return rng() < 0.5 ? -1 : 1;
}

function choose(rng, values) {
  return values[Math.floor(rng() * values.length)];
}

function weightedChoice(rng, weightedValues) {
  const total = weightedValues.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = rng() * total;

  for (const entry of weightedValues) {
    roll -= entry.weight;
    if (roll <= 0) {
      return entry.value;
    }
  }

  return weightedValues[weightedValues.length - 1].value;
}

function direction(angle, distance = 1) {
  return {
    x: Math.sin(angle) * distance,
    z: Math.cos(angle) * distance,
  };
}

function perpendicular(angle, distance = 1) {
  return direction(angle + Math.PI / 2, distance);
}

function addPoint(point, vector) {
  return {
    x: point.x + vector.x,
    z: point.z + vector.z,
  };
}

function pointToArray(point, y = BASE_Y) {
  return [point.x, y, point.z];
}

function pointDistance(a, b) {
  return Math.hypot(a.x - b.x, a.z - b.z);
}

function normalizeAngle(angle) {
  let normalized = angle;
  while (normalized > Math.PI) {
    normalized -= Math.PI * 2;
  }
  while (normalized < -Math.PI) {
    normalized += Math.PI * 2;
  }
  return normalized;
}

function distanceToSegment(point, start, end) {
  const abX = end.x - start.x;
  const abZ = end.z - start.z;
  const apX = point.x - start.x;
  const apZ = point.z - start.z;
  const abLengthSquared = abX * abX + abZ * abZ;
  const projected = abLengthSquared === 0 ? 0 : clamp((apX * abX + apZ * abZ) / abLengthSquared, 0, 1);
  const closestX = start.x + abX * projected;
  const closestZ = start.z + abZ * projected;
  return Math.hypot(point.x - closestX, point.z - closestZ);
}

function isPointInBounds(point, padding = 0) {
  return (
    Math.abs(point.x) <= LOT_LIMIT - padding &&
    Math.abs(point.z) <= LOT_LIMIT - padding
  );
}

function getModeById(modeOrId) {
  if (!modeOrId) {
    return GAME_MODES[0];
  }

  if (typeof modeOrId === "object") {
    return modeOrId;
  }

  return GAME_MODES.find((mode) => mode.id === modeOrId) ?? GAME_MODES[0];
}

export function getDifficulty(level, modeOrId = GAME_MODES[0]) {
  const mode = getModeById(modeOrId);
  const tier =
    level >= 15 ? "Insane" : level >= 9 ? "Hard" : level >= 4 ? "Medium" : "Easy";
  const progress = clamp((level - 1) / 18, 0, 1.6);
  const driftRequired = !mode.reverseOnly && (Boolean(mode.driftRequired) || level >= 11);
  const parkingWidth = clamp(5.85 - level * 0.14 - (driftRequired ? 0.32 : 0), 2.85, 5.85);
  const parkingDepth = clamp(9.25 - level * 0.18 - (driftRequired ? 0.5 : 0), 5.45, 9.25);

  return {
    level,
    tag: tier,
    progress,
    parkingSize: [parkingWidth, PARKING_HEIGHT, parkingDepth],
    obstacleCount: 3 + Math.floor(level * 0.85) + (driftRequired ? 2 : 0),
    spawnSpacing: clamp(16.6 - level * 0.28 - (driftRequired ? 0.85 : 0), 10.4, 16.6),
    angleDifficulty: degToRad(clamp(10 + level * 3.1 + (driftRequired ? 10 : 0), 10, 68)),
    driftRequired,
    corridorHalfWidth: clamp(4.8 - level * 0.08 - (driftRequired ? 0.28 : 0), 2.65, 4.8),
    parkedCarCount: clamp(1 + Math.floor(level / 3) + (driftRequired ? 1 : 0), 1, 5),
    wallCount: clamp(Math.floor(level / 6) + (driftRequired ? 1 : 0), 0, 4),
    requiresReverseBias: mode.reverseOnly ? 1 : clamp((level - 5) / 18, 0, 0.42),
  };
}

function chooseLayout(level, difficulty, mode, rng) {
  if (mode.reverseOnly) {
    return weightedChoice(rng, [
      { value: "reverse", weight: 5 },
      { value: "angled", weight: 3 },
      { value: "parallel", weight: 3 },
      { value: "straight", weight: 1 },
    ]);
  }

  if (mode.driftRequired || difficulty.driftRequired) {
    return weightedChoice(rng, [
      { value: "drift", weight: 6 },
      { value: "angled", weight: 3 },
      { value: "parallel", weight: 1.5 },
      { value: "straight", weight: 1 },
    ]);
  }

  if (level <= 3) {
    return weightedChoice(rng, [
      { value: "straight", weight: 5 },
      { value: "angled", weight: 2 },
      { value: "parallel", weight: 1 },
    ]);
  }

  if (level <= 8) {
    return weightedChoice(rng, [
      { value: "straight", weight: 3 },
      { value: "parallel", weight: 2 },
      { value: "angled", weight: 3 },
      { value: "reverse", weight: 1.5 },
    ]);
  }

  return weightedChoice(rng, [
    { value: "parallel", weight: 2.5 },
    { value: "angled", weight: 3.5 },
    { value: "reverse", weight: 2 },
    { value: "straight", weight: 1.5 },
  ]);
}

function createPlacement(layoutType, difficulty, mode, rng) {
  const laneAngle = choose(rng, [0, Math.PI / 2, Math.PI, -Math.PI / 2]);
  const laneJitter = degToRad(randomRange(rng, -8, 8));
  const effectiveLaneAngle = laneAngle + laneJitter;
  const requiresReverse =
    mode.reverseOnly ||
    layoutType === "reverse" ||
    (!mode.driftRequired && !mode.reverseOnly && layoutType !== "drift" && rng() < difficulty.requiresReverseBias);
  const driftRequired =
    !requiresReverse &&
    (Boolean(mode.driftRequired) || difficulty.driftRequired || layoutType === "drift");

  let travelAngle = effectiveLaneAngle;
  let zoneRotation = effectiveLaneAngle;
  let spawnYaw = effectiveLaneAngle;
  let spawnLateralOffset = 0;

  if (layoutType === "parallel") {
    zoneRotation = effectiveLaneAngle;
    spawnLateralOffset = randomSign(rng) * randomRange(rng, 1.25, 2.35);
  } else if (layoutType === "angled") {
    zoneRotation =
      effectiveLaneAngle +
      randomSign(rng) * randomRange(rng, degToRad(14), difficulty.angleDifficulty * 0.85);
    spawnLateralOffset = randomSign(rng) * randomRange(rng, 0.4, 1.5);
  } else if (layoutType === "reverse") {
    zoneRotation =
      effectiveLaneAngle +
      randomSign(rng) * randomRange(rng, degToRad(8), difficulty.angleDifficulty * 0.65);
    travelAngle = normalizeAngle(zoneRotation + Math.PI);
  } else if (layoutType === "drift") {
    const driftAngle = randomRange(
      rng,
      Math.max(degToRad(24), difficulty.angleDifficulty * 0.55),
      Math.min(degToRad(62), difficulty.angleDifficulty + degToRad(8))
    );
    zoneRotation = effectiveLaneAngle + randomSign(rng) * driftAngle;
    spawnLateralOffset = randomSign(rng) * randomRange(rng, 1.2, 2.8);
  } else {
    zoneRotation = effectiveLaneAngle + randomSign(rng) * randomRange(rng, 0, difficulty.angleDifficulty * 0.18);
  }

  if (requiresReverse) {
    travelAngle = normalizeAngle(zoneRotation + Math.PI);
    spawnYaw = zoneRotation;
  } else if (driftRequired) {
    spawnYaw = normalizeAngle(travelAngle + randomSign(rng) * randomRange(rng, 0.02, 0.12));
  } else {
    spawnYaw = normalizeAngle(travelAngle + randomSign(rng) * randomRange(rng, 0, 0.05));
  }

  const travelVector = direction(travelAngle, difficulty.spawnSpacing);
  const lateralVector = perpendicular(travelAngle, spawnLateralOffset);
  const centerRange = driftRequired ? 8.8 : 10.8;

  for (let attempt = 0; attempt < 48; attempt += 1) {
    const zone = {
      x: randomRange(rng, -centerRange, centerRange),
      z: randomRange(rng, -centerRange, centerRange),
    };
    const spawn = {
      x: zone.x - travelVector.x + lateralVector.x,
      z: zone.z - travelVector.z + lateralVector.z,
    };

    if (!isPointInBounds(zone, 3.2) || !isPointInBounds(spawn, 3.4)) {
      continue;
    }

    if (pointDistance(zone, spawn) < 8.5) {
      continue;
    }

    return {
      zone,
      spawn,
      zoneRotation,
      travelAngle,
      spawnYaw,
      requiresReverse,
      driftRequired,
      layoutType,
    };
  }

  const fallbackZone = { x: 0, z: 8.6 };
  const fallbackSpawn = { x: 0, z: -7.4 };
  return {
    zone: fallbackZone,
    spawn: fallbackSpawn,
    zoneRotation,
    travelAngle,
    spawnYaw,
    requiresReverse,
    driftRequired,
    layoutType,
  };
}

function reservePoint(occupied, point, radius) {
  occupied.push({ x: point.x, z: point.z, radius });
}

function overlapsOccupied(point, radius, occupied, padding = 0.55) {
  return occupied.some((entry) => {
    const minDistance = entry.radius + radius + padding;
    return Math.hypot(point.x - entry.x, point.z - entry.z) < minDistance;
  });
}

function addCone(cones, occupied, point, radius = 0.8) {
  if (!isPointInBounds(point, 0.8) || overlapsOccupied(point, radius, occupied, 0.25)) {
    return false;
  }

  cones.push([point.x, point.z]);
  reservePoint(occupied, point, radius);
  return true;
}

function addParkedCar(parkedCars, occupied, point, rotation, rng, radius = 2.4) {
  if (!isPointInBounds(point, 1.8) || overlapsOccupied(point, radius, occupied)) {
    return false;
  }

  parkedCars.push({
    position: pointToArray(point),
    rotation,
    color: choose(rng, COLOR_POOL),
  });
  reservePoint(occupied, point, radius);
  return true;
}

function addWall(walls, occupied, point, size, rotation = 0, radius = Math.max(size[0], size[2]) * 0.62) {
  if (!isPointInBounds(point, 1.4) || overlapsOccupied(point, radius, occupied, 0.25)) {
    return false;
  }

  walls.push({
    position: [point.x, 0.8, point.z],
    size,
    rotation,
  });
  reservePoint(occupied, point, radius);
  return true;
}

function isPointBlockingCorridor(point, context, radius = 1) {
  return distanceToSegment(point, context.spawn, context.zone) < context.corridorHalfWidth + radius;
}

function addApproachCones(level, difficulty, placement, cones, occupied, rng) {
  const entryRight = perpendicular(placement.travelAngle, 1);
  const total = Math.max(2, Math.floor(difficulty.obstacleCount * 0.55));
  const corridorBase = difficulty.corridorHalfWidth + 0.55;

  for (let index = 0; index < total; index += 1) {
    const t = lerp(0.18, 0.9, index / Math.max(total - 1, 1));
    const side = index % 2 === 0 ? 1 : -1;
    const center = {
      x: lerp(placement.spawn.x, placement.zone.x, t),
      z: lerp(placement.spawn.z, placement.zone.z, t),
    };
    const point = {
      x: center.x + entryRight.x * side * (corridorBase + randomRange(rng, 0.6, 2.15)),
      z: center.z + entryRight.z * side * (corridorBase + randomRange(rng, 0.6, 2.15)),
    };
    addCone(cones, occupied, point, 0.8);
  }

  if (level >= 9) {
    const gateDistance = difficulty.parkingSize[2] * 0.62 + 1.35;
    const gateSide = difficulty.parkingSize[0] * 0.5 + 1.55;
    const gateCenter = addPoint(placement.zone, direction(placement.travelAngle, -gateDistance));
    const gateRight = perpendicular(placement.zoneRotation, 1);
    addCone(cones, occupied, addPoint(gateCenter, { x: gateRight.x * gateSide, z: gateRight.z * gateSide }), 0.75);
    addCone(cones, occupied, addPoint(gateCenter, { x: -gateRight.x * gateSide, z: -gateRight.z * gateSide }), 0.75);
  }
}

function addSlotGuard(layoutType, difficulty, placement, parkedCars, walls, cones, occupied, rng) {
  const slotRight = perpendicular(placement.zoneRotation, 1);
  const slotForward = direction(placement.zoneRotation, 1);
  const sideGap = difficulty.parkingSize[0] * 0.5 + 1.9;
  const endGap = difficulty.parkingSize[2] * 0.5 + 2.35;

  if (layoutType === "parallel") {
    addParkedCar(
      parkedCars,
      occupied,
      addPoint(placement.zone, { x: slotForward.x * endGap, z: slotForward.z * endGap }),
      placement.zoneRotation,
      rng
    );
    addParkedCar(
      parkedCars,
      occupied,
      addPoint(placement.zone, { x: -slotForward.x * endGap, z: -slotForward.z * endGap }),
      placement.zoneRotation,
      rng
    );

    const curbSide = randomSign(rng);
    addWall(
      walls,
      occupied,
      addPoint(placement.zone, {
        x: slotRight.x * curbSide * (sideGap + 0.8),
        z: slotRight.z * curbSide * (sideGap + 0.8),
      }),
      [difficulty.parkingSize[2] + 3.4, 1.4, 0.55],
      placement.zoneRotation + Math.PI / 2
    );
    return;
  }

  addParkedCar(
    parkedCars,
    occupied,
    addPoint(placement.zone, { x: slotRight.x * sideGap, z: slotRight.z * sideGap }),
    placement.zoneRotation,
    rng
  );
  addParkedCar(
    parkedCars,
    occupied,
    addPoint(placement.zone, { x: -slotRight.x * sideGap, z: -slotRight.z * sideGap }),
    placement.zoneRotation,
    rng
  );

  if (layoutType === "reverse" || difficulty.level >= 7) {
    addWall(
      walls,
      occupied,
      addPoint(placement.zone, { x: slotForward.x * endGap, z: slotForward.z * endGap }),
      [difficulty.parkingSize[0] + 1.4, 1.4, 0.55],
      placement.zoneRotation
    );
  }

  if (placement.driftRequired || layoutType === "drift") {
    const gateCenter = addPoint(placement.zone, direction(placement.travelAngle, -(difficulty.parkingSize[2] * 0.62 + 1.45)));
    const gateSide = difficulty.parkingSize[0] * 0.5 + 1.45;
    addCone(cones, occupied, addPoint(gateCenter, { x: slotRight.x * gateSide, z: slotRight.z * gateSide }), 0.75);
    addCone(cones, occupied, addPoint(gateCenter, { x: -slotRight.x * gateSide, z: -slotRight.z * gateSide }), 0.75);
  }
}

function addAmbientHazards(layoutType, difficulty, placement, parkedCars, walls, cones, occupied, rng) {
  const context = {
    spawn: placement.spawn,
    zone: placement.zone,
    corridorHalfWidth: difficulty.corridorHalfWidth,
  };
  const remainingCars = Math.max(0, difficulty.parkedCarCount - parkedCars.length);
  const remainingWalls = Math.max(0, difficulty.wallCount - walls.length);

  let attempts = 0;
  let carsAdded = 0;
  while (carsAdded < remainingCars && attempts < 50) {
    attempts += 1;
    const point = {
      x: randomRange(rng, -12.6, 12.6),
      z: randomRange(rng, -12.6, 12.6),
    };
    if (isPointBlockingCorridor(point, context, 2.5)) {
      continue;
    }
    if (addParkedCar(parkedCars, occupied, point, choose(rng, [0, Math.PI / 2, Math.PI, -Math.PI / 2]), rng)) {
      carsAdded += 1;
    }
  }

  attempts = 0;
  let wallsAdded = 0;
  while (wallsAdded < remainingWalls && attempts < 40) {
    attempts += 1;
    const point = {
      x: randomRange(rng, -12.4, 12.4),
      z: randomRange(rng, -12.4, 12.4),
    };
    const size = rng() < 0.5 ? [3.6, 1.4, 0.55] : [0.55, 1.4, 4.4];
    if (isPointBlockingCorridor(point, context, Math.max(size[0], size[2]) * 0.58)) {
      continue;
    }
    if (addWall(walls, occupied, point, size, choose(rng, [0, Math.PI / 2, Math.PI / 4, -Math.PI / 4]))) {
      wallsAdded += 1;
    }
  }

  const extraCones = Math.max(0, difficulty.obstacleCount - cones.length);
  attempts = 0;
  let extraAdded = 0;
  while (extraAdded < extraCones && attempts < 60) {
    attempts += 1;
    const point = {
      x: randomRange(rng, -12.8, 12.8),
      z: randomRange(rng, -12.8, 12.8),
    };
    if (isPointBlockingCorridor(point, context, 0.9)) {
      continue;
    }
    if (layoutType === "parallel" && pointDistance(point, placement.zone) < 4.8) {
      continue;
    }
    if (addCone(cones, occupied, point, 0.8)) {
      extraAdded += 1;
    }
  }
}

function buildGoal(layoutType, difficulty, placement) {
  if (placement.driftRequired) {
    return "Carry speed into the bay, rotate on the slide, and stop dead inside the box.";
  }

  if (placement.requiresReverse) {
    return "Set the angle early and reverse cleanly into the generated slot.";
  }

  if (layoutType === "parallel") {
    return "Thread the gap between the parked cars and settle without touching the curb line.";
  }

  if (layoutType === "angled") {
    return "Match the bay angle precisely and finish square inside the painted borders.";
  }

  return "Read the lot, manage the approach, and park cleanly inside the active zone.";
}

function buildInstructions(layoutType, difficulty, placement) {
  if (placement.driftRequired) {
    return "This run is drift-gated. Build speed through the corridor, trigger the slide late, and catch the car before the barriers close around the bay.";
  }

  if (placement.requiresReverse) {
    return "Forward entry will not help here. Use the approach lane to set your angle, then back into the slot under control.";
  }

  if (layoutType === "parallel") {
    return "The slot is boxed in by parked cars. Brake early, stay close to the lane, and feed steering in smoothly.";
  }

  if (difficulty.tag === "Insane") {
    return "Clearance is brutal now. Small steering mistakes compound fast, so commit once and avoid sawing at the wheel.";
  }

  return "Use the open lane, judge the bay angle, and keep the body centered as the space tightens.";
}

export function generateProceduralLevel(level, modeOrId = GAME_MODES[0]) {
  const mode = getModeById(modeOrId);
  const difficulty = getDifficulty(level, mode);
  const seed = hashString(`${mode.id}:${level}`);
  const rng = mulberry32(seed);
  const layoutType = chooseLayout(level, difficulty, mode, rng);
  const placement = createPlacement(layoutType, difficulty, mode, rng);
  const cones = [];
  const walls = [];
  const parkedCars = [];
  const occupied = [];

  reservePoint(occupied, placement.zone, Math.max(difficulty.parkingSize[0], difficulty.parkingSize[2]) * 0.58);
  reservePoint(occupied, placement.spawn, 2.8);

  addSlotGuard(layoutType, difficulty, placement, parkedCars, walls, cones, occupied, rng);
  addApproachCones(level, difficulty, placement, cones, occupied, rng);
  addAmbientHazards(layoutType, difficulty, placement, parkedCars, walls, cones, occupied, rng);

  return {
    id: `level-${level}-${mode.id}`,
    name: `${LAYOUT_LABELS[layoutType]} Layout`,
    layoutType,
    difficultyTag: difficulty.tag,
    goal: buildGoal(layoutType, difficulty, placement),
    instructions: buildInstructions(layoutType, difficulty, placement),
    requiresReverse: placement.requiresReverse,
    driftRequired: placement.driftRequired,
    spawn: {
      position: [placement.spawn.x, 0.82, placement.spawn.z],
      yaw: placement.spawnYaw,
    },
    parkingZone: {
      position: [placement.zone.x, STRIPE_Y, placement.zone.z],
      size: difficulty.parkingSize,
      rotation: placement.zoneRotation,
      angleTolerance: mode.driftRequired || placement.driftRequired ? 7 : clamp(16 - Math.floor(level / 2), 8, 16),
      stripeColor:
        placement.driftRequired || difficulty.tag === "Hard" || difficulty.tag === "Insane"
          ? "#ffe58a"
          : "#f6f1e6",
    },
    cones,
    walls,
    parkedCars,
  };
}
