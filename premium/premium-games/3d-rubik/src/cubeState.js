export const AXES = ["x", "y", "z"];
export const SUPPORTED_CUBE_SIZES = [2, 3, 4, 5, 6, 7];
export const EXPERIMENTAL_CUBE_LIMITS = { min: 8, max: 10 };

export const CUBE_SIZE_PRESETS = [
  {
    size: 2,
    name: "Pocket Cube",
    difficulty: "Beginner",
    description: "Fast and beginner friendly",
    challenge: "Quick solves",
    recommendedMode: "Beginner Guide",
    guideSupport: "Simple guide"
  },
  {
    size: 3,
    name: "Classic Cube",
    difficulty: "Classic",
    description: "The standard Rubik's Cube",
    challenge: "Core challenge",
    recommendedMode: "Beginner Guide",
    guideSupport: "Full guide"
  },
  {
    size: 4,
    name: "Revenge Cube",
    difficulty: "Advanced",
    description: "More advanced with parity cases",
    challenge: "Parity aware",
    recommendedMode: "Timed Challenge",
    guideSupport: "Free + timed"
  },
  {
    size: 5,
    name: "Professor Cube",
    difficulty: "Strategic",
    description: "Longer solve, more strategy",
    challenge: "Deep planning",
    recommendedMode: "Free Solve",
    guideSupport: "Advanced free solve"
  },
  {
    size: 6,
    name: "Expert Cube",
    difficulty: "Expert",
    description: "Expert challenge with many layers",
    challenge: "High endurance",
    recommendedMode: "Timed Challenge",
    guideSupport: "Expert challenge"
  },
  {
    size: 7,
    name: "Master Cube",
    difficulty: "Master",
    description: "Master-level puzzle",
    challenge: "Full focus",
    recommendedMode: "Timed Challenge",
    guideSupport: "Master challenge"
  }
];

export const FACE_DEFINITIONS = {
  U: { axis: "y", side: "max", sign: 1, normal: { x: 0, y: 1, z: 0 }, color: "#f8f8f2", label: "Up" },
  D: { axis: "y", side: "min", sign: -1, normal: { x: 0, y: -1, z: 0 }, color: "#ffd84d", label: "Down" },
  F: { axis: "z", side: "max", sign: 1, normal: { x: 0, y: 0, z: 1 }, color: "#10a65a", label: "Front" },
  B: { axis: "z", side: "min", sign: -1, normal: { x: 0, y: 0, z: -1 }, color: "#246bde", label: "Back" },
  R: { axis: "x", side: "max", sign: 1, normal: { x: 1, y: 0, z: 0 }, color: "#d93632", label: "Right" },
  L: { axis: "x", side: "min", sign: -1, normal: { x: -1, y: 0, z: 0 }, color: "#f28a24", label: "Left" }
};

export const SLICE_DEFINITIONS = {
  M: { axis: "x", sign: -1, label: "Middle" },
  E: { axis: "y", sign: -1, label: "Equator" },
  S: { axis: "z", sign: 1, label: "Standing" }
};

export const MOVE_DEFINITIONS = {
  ...FACE_DEFINITIONS,
  ...SLICE_DEFINITIONS
};

const FACE_ORDER = ["U", "D", "F", "B", "R", "L"];
const SLICE_ORDER = ["M", "E", "S"];
const SCRAMBLE_LENGTHS = {
  2: 11,
  3: 20,
  4: 40,
  5: 60,
  6: 80,
  7: 100
};

export function clampCubeSize(size) {
  const numeric = Number(size);
  if (SUPPORTED_CUBE_SIZES.includes(numeric)) {
    return numeric;
  }

  return 3;
}

export function getCubeSizePreset(size) {
  return CUBE_SIZE_PRESETS.find((preset) => preset.size === Number(size)) || CUBE_SIZE_PRESETS[1];
}

export function getScrambleLength(size) {
  return SCRAMBLE_LENGTHS[clampCubeSize(size)] || 20;
}

export function getVisibleCubieCount(size) {
  const inner = Math.max(size - 2, 0);
  return size ** 3 - inner ** 3;
}

export function getDefaultInnerLayerIndex(size) {
  if (size < 3) {
    return 0;
  }

  return Math.floor((size - 1) / 2);
}

export function clampInnerLayerIndex(size, layerIndex) {
  if (size < 3) {
    return 0;
  }

  return Math.min(size - 2, Math.max(1, Number(layerIndex) || getDefaultInnerLayerIndex(size)));
}

export function cloneVector(vector) {
  return { x: vector.x, y: vector.y, z: vector.z };
}

export function vectorsEqual(left, right) {
  return left.x === right.x && left.y === right.y && left.z === right.z;
}

export function vectorSignature(vector) {
  return `${vector.x},${vector.y},${vector.z}`;
}

export function roundVector(vector) {
  return {
    x: Math.round(vector.x),
    y: Math.round(vector.y),
    z: Math.round(vector.z)
  };
}

export function axisValue(vector, axis) {
  return vector[axis];
}

function isOuterLayer(value, size) {
  return value === 0 || value === size - 1;
}

function isVisibleCoordinate(x, y, z, size) {
  return isOuterLayer(x, size) || isOuterLayer(y, size) || isOuterLayer(z, size);
}

function layerForFace(definition, size) {
  return definition.side === "max" ? size - 1 : 0;
}

export function getFaceForAxisLayer(axis, layerIndex, size = 3) {
  return Object.keys(FACE_DEFINITIONS).find((face) => {
    const definition = FACE_DEFINITIONS[face];
    return definition.axis === axis && layerForFace(definition, size) === layerIndex;
  });
}

export function normalizeMove(notation) {
  const raw = String(notation || "").trim();
  const face = raw[0]?.toUpperCase();
  if (!MOVE_DEFINITIONS[face]) {
    throw new Error(`Invalid move notation: ${notation}`);
  }

  if (raw.includes("2")) {
    return `${face}2`;
  }

  const inverse = raw.includes("'") || raw.endsWith("i");
  return inverse ? `${face}'` : face;
}

function moveDisplay(face, inverse, layerIndex, size, isSlice, isDouble = false, isLayer = false) {
  const doubleSuffix = isDouble ? "2" : "";
  const suffix = inverse ? "'" : "";
  if (isLayer) {
    return `${face}${layerIndex + 1}${isDouble ? "x2" : ""}${suffix}`;
  }

  if (isSlice && size !== 3) {
    return `${face}${layerIndex + 1}${isDouble ? "x2" : ""}${suffix}`;
  }

  return `${face}${doubleSuffix}${suffix}`;
}

export function createLayerMove({ axis, layerIndex, quarterTurns, size, notation = "Layer", face = "Layer" }) {
  const normalizedSize = clampCubeSize(size);
  const normalizedLayer = Math.min(normalizedSize - 1, Math.max(0, Math.round(layerIndex)));
  const numericTurns = Number(quarterTurns) || 1;
  const normalizedTurns = Math.abs(numericTurns) >= 2 ? (numericTurns > 0 ? 2 : -2) : (numericTurns > 0 ? 1 : -1);

  return {
    notation,
    display: notation,
    face,
    inverse: Math.abs(normalizedTurns) === 2 ? false : normalizedTurns > 0,
    isDouble: Math.abs(normalizedTurns) === 2,
    axis,
    layerIndex: normalizedLayer,
    size: normalizedSize,
    sign: normalizedTurns > 0 ? 1 : -1,
    quarterTurns: normalizedTurns
  };
}

export function parseMove(notation, size = 3, selectedLayerIndex = null) {
  if (notation && typeof notation === "object") {
    return {
      ...notation,
      isDouble: Math.abs(notation.quarterTurns || 0) === 2 || notation.isDouble,
      size: notation.size || clampCubeSize(size)
    };
  }

  const normalizedSize = clampCubeSize(size);
  const raw = String(notation || "").trim();
  const face = raw[0]?.toUpperCase();
  const definition = MOVE_DEFINITIONS[face];

  if (!definition) {
    throw new Error(`Invalid move notation: ${notation}`);
  }

  const inverse = raw.includes("'") || raw.endsWith("i");
  const isDouble = raw.includes("2");
  const isSlice = Boolean(SLICE_DEFINITIONS[face]);
  let layerIndex;

  if (isSlice) {
    if (normalizedSize < 3) {
      throw new Error(`${face} slice is not available on ${normalizedSize}x${normalizedSize}`);
    }
    layerIndex = clampInnerLayerIndex(normalizedSize, selectedLayerIndex ?? getDefaultInnerLayerIndex(normalizedSize));
  } else {
    layerIndex = layerForFace(definition, normalizedSize);
  }

  const baseTurns = inverse ? definition.sign : -definition.sign;
  const quarterTurns = isDouble ? baseTurns * 2 : baseTurns;
  const display = moveDisplay(face, inverse && !isDouble, layerIndex, normalizedSize, isSlice, isDouble);

  return {
    notation: display,
    display,
    face,
    inverse: inverse && !isDouble,
    isDouble,
    axis: definition.axis,
    layerIndex,
    size: normalizedSize,
    sign: definition.sign,
    quarterTurns,
    isSlice
  };
}

export function inverseMove(notation, size = 3, selectedLayerIndex = null) {
  const move = parseMove(notation, size, selectedLayerIndex);
  const isDouble = Math.abs(move.quarterTurns) === 2 || move.isDouble;
  const inverse = isDouble ? false : !move.inverse;
  const isLayer = ["X", "Y", "Z"].includes(String(move.face || "").toUpperCase());
  return {
    ...move,
    inverse,
    isDouble,
    quarterTurns: -move.quarterTurns,
    notation: moveDisplay(move.face, inverse, move.layerIndex, move.size, move.isSlice, isDouble, isLayer),
    display: moveDisplay(move.face, inverse, move.layerIndex, move.size, move.isSlice, isDouble, isLayer)
  };
}

export function rotateVectorQuarter(vector, axis, quarterTurns) {
  const turn = ((quarterTurns % 4) + 4) % 4;
  let result = cloneVector(vector);

  for (let index = 0; index < turn; index += 1) {
    const { x, y, z } = result;
    if (axis === "x") {
      result = { x, y: -z, z: y };
    } else if (axis === "y") {
      result = { x: z, y, z: -x };
    } else {
      result = { x: -y, y: x, z };
    }
  }

  return roundVector(result);
}

export function rotatePositionQuarter(position, axis, quarterTurns, size) {
  const turn = ((quarterTurns % 4) + 4) % 4;
  const center = (size - 1) / 2;
  let result = cloneVector(position);

  for (let index = 0; index < turn; index += 1) {
    const x = result.x - center;
    const y = result.y - center;
    const z = result.z - center;

    if (axis === "x") {
      result = { x: result.x, y: center - z, z: center + y };
    } else if (axis === "y") {
      result = { x: center + z, y: result.y, z: center - x };
    } else {
      result = { x: center - y, y: center + x, z: result.z };
    }
  }

  return roundVector(result);
}

function createSticker(face) {
  const definition = FACE_DEFINITIONS[face];
  return {
    face,
    color: definition.color,
    homeNormal: cloneVector(definition.normal),
    normal: cloneVector(definition.normal)
  };
}

function createCubie(x, y, z, size) {
  const max = size - 1;
  const stickers = [];

  if (y === max) stickers.push(createSticker("U"));
  if (y === 0) stickers.push(createSticker("D"));
  if (z === max) stickers.push(createSticker("F"));
  if (z === 0) stickers.push(createSticker("B"));
  if (x === max) stickers.push(createSticker("R"));
  if (x === 0) stickers.push(createSticker("L"));

  return {
    id: `cubie-${size}-${x}-${y}-${z}`,
    home: { x, y, z },
    position: { x, y, z },
    basis: {
      x: { x: 1, y: 0, z: 0 },
      y: { x: 0, y: 1, z: 0 },
      z: { x: 0, y: 0, z: 1 }
    },
    stickers
  };
}

export function createSolvedCube(size = 3) {
  const normalizedSize = clampCubeSize(size);
  const cubies = [];

  for (let x = 0; x < normalizedSize; x += 1) {
    for (let y = 0; y < normalizedSize; y += 1) {
      for (let z = 0; z < normalizedSize; z += 1) {
        if (isVisibleCoordinate(x, y, z, normalizedSize)) {
          cubies.push(createCubie(x, y, z, normalizedSize));
        }
      }
    }
  }

  return { size: normalizedSize, cubies };
}

export function resetCubeState(state, size = state.size || 3) {
  const solved = createSolvedCube(size);
  state.size = solved.size;
  state.cubies.splice(0, state.cubies.length, ...solved.cubies);
}

export function cloneCubeState(state) {
  return {
    size: state.size,
    cubies: state.cubies.map((cubie) => ({
      id: cubie.id,
      home: cloneVector(cubie.home),
      position: cloneVector(cubie.position),
      basis: {
        x: cloneVector(cubie.basis.x),
        y: cloneVector(cubie.basis.y),
        z: cloneVector(cubie.basis.z)
      },
      stickers: cubie.stickers.map((sticker) => ({
        face: sticker.face,
        color: sticker.color,
        homeNormal: cloneVector(sticker.homeNormal),
        normal: cloneVector(sticker.normal)
      }))
    }))
  };
}

export function getCubieById(state, id) {
  return state.cubies.find((cubie) => cubie.id === id) || null;
}

export function getLayerCubies(state, move) {
  return state.cubies.filter((cubie) => axisValue(cubie.position, move.axis) === move.layerIndex);
}

export function applyMoveToState(state, notation) {
  const move = parseMove(notation, state.size || 3);
  const layerCubies = getLayerCubies(state, move);

  layerCubies.forEach((cubie) => {
    cubie.position = rotatePositionQuarter(cubie.position, move.axis, move.quarterTurns, state.size);
    cubie.basis.x = rotateVectorQuarter(cubie.basis.x, move.axis, move.quarterTurns);
    cubie.basis.y = rotateVectorQuarter(cubie.basis.y, move.axis, move.quarterTurns);
    cubie.basis.z = rotateVectorQuarter(cubie.basis.z, move.axis, move.quarterTurns);
    cubie.stickers.forEach((sticker) => {
      sticker.normal = rotateVectorQuarter(sticker.normal, move.axis, move.quarterTurns);
    });
  });

  return move;
}

export function getCubeSignature(state) {
  return state.cubies
    .slice()
    .sort((left, right) => left.id.localeCompare(right.id))
    .map((cubie) => {
      const stickers = cubie.stickers
        .map((sticker) => `${sticker.face}:${vectorSignature(sticker.normal)}`)
        .sort()
        .join("|");
      return `${cubie.id}@${vectorSignature(cubie.position)}#${vectorSignature(cubie.basis.x)}#${vectorSignature(cubie.basis.y)}#${vectorSignature(cubie.basis.z)}#${stickers}`;
    })
    .join(";");
}

export function isSolved(state) {
  return state.cubies.every((cubie) => {
    if (!vectorsEqual(cubie.position, cubie.home)) {
      return false;
    }

    return cubie.stickers.every((sticker) => vectorsEqual(sticker.normal, sticker.homeNormal));
  });
}

export function generateScramble(size = 3) {
  const normalizedSize = clampCubeSize(size);
  const length = getScrambleLength(normalizedSize);
  const sequence = [];
  let previousFace = "";

  while (sequence.length < length) {
    const face = FACE_ORDER[Math.floor(Math.random() * FACE_ORDER.length)];
    if (face === previousFace) {
      continue;
    }

    const inverse = Math.random() > 0.5;
    sequence.push(inverse ? `${face}'` : face);
    previousFace = face;
  }

  return sequence;
}

export function getAllBasicMoves() {
  return FACE_ORDER.flatMap((face) => [face, `${face}'`, `${face}2`]);
}

export function getAllSliceMoves(size = 3, layerIndex = getDefaultInnerLayerIndex(size)) {
  if (size < 3) {
    return [];
  }

  const safeLayer = clampInnerLayerIndex(size, layerIndex);
  return SLICE_ORDER.flatMap((face) => [
    parseMove(face, size, safeLayer),
    parseMove(`${face}'`, size, safeLayer),
    parseMove(`${face}2`, size, safeLayer)
  ]);
}

export function getAllPlayableMoves(size = 3, layerIndex = getDefaultInnerLayerIndex(size)) {
  return [
    ...getAllBasicMoves().map((move) => parseMove(move, size)),
    ...getAllSliceMoves(size, layerIndex)
  ];
}

function axisFromNormal(normal) {
  if (!normal) {
    return null;
  }

  const abs = {
    x: Math.abs(normal.x || 0),
    y: Math.abs(normal.y || 0),
    z: Math.abs(normal.z || 0)
  };

  if (abs.x >= abs.y && abs.x >= abs.z && abs.x > 0) return "x";
  if (abs.y >= abs.x && abs.y >= abs.z && abs.y > 0) return "y";
  if (abs.z > 0) return "z";
  return null;
}

export function getDragCandidateMoves(position, size = 3, faceNormal = null) {
  const normalizedSize = clampCubeSize(size);
  const candidates = [];
  const preferredAxis = axisFromNormal(faceNormal);

  AXES.forEach((axis) => {
    const layerIndex = axisValue(position, axis);
    candidates.push(
      createLayerMove({
        axis,
        layerIndex,
        quarterTurns: 1,
        size: normalizedSize,
        notation: `${axis.toUpperCase()}${layerIndex + 1}'`,
        face: axis.toUpperCase()
      })
    );
    candidates.push(
      createLayerMove({
        axis,
        layerIndex,
        quarterTurns: -1,
        size: normalizedSize,
        notation: `${axis.toUpperCase()}${layerIndex + 1}`,
        face: axis.toUpperCase()
      })
    );
  });

  candidates.forEach((move) => {
    move.dragPriority = move.axis === preferredAxis ? 1 : 0;
  });

  return candidates;
}
