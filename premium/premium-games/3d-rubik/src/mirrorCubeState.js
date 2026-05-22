import {
  AXES,
  FACE_DEFINITIONS,
  cloneVector,
  getFaceForAxisLayer,
  rotatePositionQuarter,
  rotateVectorQuarter,
  vectorSignature,
  vectorsEqual
} from "./cubeState.js";

export const MIRROR_CUBE_SIZE = 3;
export const MIRROR_CUBE_SCRAMBLE_LENGTH = 20;
export const MIRROR_CUBE_MOVES = ["U", "D", "L", "R", "F", "B"];
export const MIRROR_AXIS_BANDS = {
  x: [0.74, 0.98, 1.28],
  y: [0.64, 1.06, 1.3],
  z: [0.82, 0.92, 1.26]
};

const SOLVED_BASIS = {
  x: { x: 1, y: 0, z: 0 },
  y: { x: 0, y: 1, z: 0 },
  z: { x: 0, y: 0, z: 1 }
};

function layerForFace(definition) {
  return definition.side === "max" ? MIRROR_CUBE_SIZE - 1 : 0;
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

function isOuter(value) {
  return value === 0 || value === MIRROR_CUBE_SIZE - 1;
}

export function getMirrorCubeSlotCenter(position) {
  const result = {};
  AXES.forEach((axis) => {
    const bands = MIRROR_AXIS_BANDS[axis];
    const index = Math.max(0, Math.min(2, Math.round(position[axis])));
    const before = bands.slice(0, index).reduce((sum, width) => sum + width, 0);
    result[axis] = -1.5 + before + bands[index] / 2;
  });
  return result;
}

export function getMirrorCubePieceDimensions(home) {
  return {
    x: MIRROR_AXIS_BANDS.x[home.x],
    y: MIRROR_AXIS_BANDS.y[home.y],
    z: MIRROR_AXIS_BANDS.z[home.z]
  };
}

function createMirrorCubie(x, y, z) {
  const stickers = [];
  if (y === 2) stickers.push(createSticker("U"));
  if (y === 0) stickers.push(createSticker("D"));
  if (z === 2) stickers.push(createSticker("F"));
  if (z === 0) stickers.push(createSticker("B"));
  if (x === 2) stickers.push(createSticker("R"));
  if (x === 0) stickers.push(createSticker("L"));

  const home = { x, y, z };
  return {
    id: `mirror-${x}-${y}-${z}`,
    type: stickers.length === 3 ? "corner" : stickers.length === 2 ? "edge" : stickers.length === 1 ? "center" : "core",
    home: cloneVector(home),
    position: cloneVector(home),
    dimensions: getMirrorCubePieceDimensions(home),
    basis: {
      x: cloneVector(SOLVED_BASIS.x),
      y: cloneVector(SOLVED_BASIS.y),
      z: cloneVector(SOLVED_BASIS.z)
    },
    stickers
  };
}

export function createSolvedMirrorCube() {
  const cubies = [];
  for (let x = 0; x < MIRROR_CUBE_SIZE; x += 1) {
    for (let y = 0; y < MIRROR_CUBE_SIZE; y += 1) {
      for (let z = 0; z < MIRROR_CUBE_SIZE; z += 1) {
        cubies.push(createMirrorCubie(x, y, z));
      }
    }
  }

  return {
    puzzleType: "mirrorCube",
    size: "mirrorCube",
    cubies,
    moveVersion: 0
  };
}

export function resetMirrorCubeState(state) {
  const solved = createSolvedMirrorCube();
  state.puzzleType = "mirrorCube";
  state.size = "mirrorCube";
  state.moveVersion = 0;
  if (Array.isArray(state.cubies)) {
    state.cubies.splice(0, state.cubies.length, ...solved.cubies);
  } else {
    state.cubies = solved.cubies;
  }
}

export function cloneMirrorCubeState(state) {
  return {
    puzzleType: "mirrorCube",
    size: "mirrorCube",
    moveVersion: state.moveVersion || 0,
    cubies: state.cubies.map((cubie) => ({
      id: cubie.id,
      type: cubie.type,
      home: cloneVector(cubie.home),
      position: cloneVector(cubie.position),
      dimensions: { ...cubie.dimensions },
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

export function getMirrorCubieById(state, id) {
  return state.cubies.find((cubie) => cubie.id === id) || null;
}

export function parseMirrorCubeMove(notation) {
  if (notation && typeof notation === "object") {
    const face = String(notation.face || notation.notation || "U")[0].toUpperCase();
    if (!MIRROR_CUBE_MOVES.includes(face)) {
      throw new Error(`Invalid Mirror Cube move notation: ${notation.notation || notation.face}`);
    }
    const definition = FACE_DEFINITIONS[face];
    const rawTurns = Number(notation.quarterTurns ?? notation.turn);
    const quarterTurns = Number.isFinite(rawTurns) && rawTurns !== 0
      ? (Math.abs(rawTurns) >= 2 ? Math.sign(rawTurns) * 2 : Math.sign(rawTurns))
      : notation.isDouble ? -definition.sign * 2 : notation.inverse ? definition.sign : -definition.sign;
    const isDouble = Math.abs(quarterTurns) === 2;
    const inverse = isDouble ? false : quarterTurns === definition.sign;
    const display = `${face}${isDouble ? "2" : inverse ? "'" : ""}`;
    return {
      ...notation,
      puzzleType: "mirrorCube",
      face,
      axis: definition.axis,
      layerIndex: layerForFace(definition),
      size: "mirrorCube",
      sign: definition.sign,
      quarterTurns,
      inverse,
      isDouble,
      notation: display,
      display
    };
  }

  const raw = String(notation || "").trim();
  const face = raw[0]?.toUpperCase();
  if (!MIRROR_CUBE_MOVES.includes(face)) {
    throw new Error(`Invalid Mirror Cube move notation: ${notation}`);
  }

  const definition = FACE_DEFINITIONS[face];
  const inverse = raw.includes("'") || raw.endsWith("i");
  const isDouble = raw.includes("2");
  const quarterTurns = isDouble ? -definition.sign * 2 : inverse ? definition.sign : -definition.sign;
  const display = `${face}${isDouble ? "2" : inverse ? "'" : ""}`;
  return {
    puzzleType: "mirrorCube",
    face,
    axis: definition.axis,
    layerIndex: layerForFace(definition),
    size: "mirrorCube",
    sign: definition.sign,
    quarterTurns,
    inverse: inverse && !isDouble,
    isDouble,
    notation: display,
    display
  };
}

export function inverseMirrorCubeMove(notation) {
  const move = parseMirrorCubeMove(notation);
  const isDouble = Math.abs(move.quarterTurns) === 2;
  const quarterTurns = -move.quarterTurns;
  const inverse = isDouble ? false : !move.inverse;
  const display = `${move.face}${isDouble ? "2" : inverse ? "'" : ""}`;
  return {
    ...move,
    quarterTurns,
    inverse,
    isDouble,
    notation: display,
    display
  };
}

export function getMirrorCubeMovePieces(state, notation) {
  const move = parseMirrorCubeMove(notation);
  return state.cubies.filter((cubie) => cubie.position[move.axis] === move.layerIndex);
}

export function applyMirrorCubeMoveToState(state, notation) {
  const move = parseMirrorCubeMove(notation);
  getMirrorCubeMovePieces(state, move).forEach((cubie) => {
    cubie.position = rotatePositionQuarter(cubie.position, move.axis, move.quarterTurns, MIRROR_CUBE_SIZE);
    cubie.basis.x = rotateVectorQuarter(cubie.basis.x, move.axis, move.quarterTurns);
    cubie.basis.y = rotateVectorQuarter(cubie.basis.y, move.axis, move.quarterTurns);
    cubie.basis.z = rotateVectorQuarter(cubie.basis.z, move.axis, move.quarterTurns);
    cubie.stickers.forEach((sticker) => {
      sticker.normal = rotateVectorQuarter(sticker.normal, move.axis, move.quarterTurns);
    });
  });
  state.moveVersion = (state.moveVersion || 0) + 1;
  return move;
}

export function getMirrorCubeSignature(state) {
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

export function isMirrorCubeSolved(state) {
  return state.cubies.every((cubie) => (
    vectorsEqual(cubie.position, cubie.home) &&
    vectorsEqual(cubie.basis.x, SOLVED_BASIS.x) &&
    vectorsEqual(cubie.basis.y, SOLVED_BASIS.y) &&
    vectorsEqual(cubie.basis.z, SOLVED_BASIS.z) &&
    cubie.stickers.every((sticker) => vectorsEqual(sticker.normal, sticker.homeNormal))
  ));
}

export function isMirrorCubeShapeSolved(state) {
  return state.cubies.every((cubie) => vectorsEqual(cubie.position, cubie.home));
}

export function generateMirrorCubeScramble({ length = MIRROR_CUBE_SCRAMBLE_LENGTH } = {}) {
  const sequence = [];
  let previousFace = "";
  while (sequence.length < length) {
    const face = MIRROR_CUBE_MOVES[Math.floor(Math.random() * MIRROR_CUBE_MOVES.length)];
    if (face === previousFace) {
      continue;
    }
    const roll = Math.random();
    const suffix = roll > 0.82 ? "2" : roll > 0.42 ? "'" : "";
    sequence.push(`${face}${suffix}`);
    previousFace = face;
  }
  return sequence;
}

export function getAllMirrorCubeMoves() {
  return MIRROR_CUBE_MOVES.flatMap((move) => [move, `${move}'`, `${move}2`]);
}

function axisFromNormal(normal) {
  if (!normal) return null;
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

export function getMirrorCubeDragCandidateMoves(position = {}, faceNormal = null) {
  const candidates = [];
  const preferredAxis = axisFromNormal(faceNormal);

  AXES.forEach((axis) => {
    const layerIndex = position[axis];
    if (!isOuter(layerIndex)) {
      return;
    }
    const face = getFaceForAxisLayer(axis, layerIndex, MIRROR_CUBE_SIZE);
    if (!face) {
      return;
    }
    const normal = parseMirrorCubeMove(face);
    const inverse = parseMirrorCubeMove(`${face}'`);
    normal.dragPriority = normal.axis === preferredAxis ? 1 : 0;
    inverse.dragPriority = inverse.axis === preferredAxis ? 1 : 0;
    candidates.push(normal, inverse);
  });

  return candidates;
}

export function getMirrorCubeBounds(state) {
  const bounds = {
    min: { x: Infinity, y: Infinity, z: Infinity },
    max: { x: -Infinity, y: -Infinity, z: -Infinity }
  };

  state.cubies.forEach((cubie) => {
    const center = getMirrorCubeSlotCenter(cubie.position);
    AXES.forEach((axis) => {
      const half = cubie.dimensions[axis] / 2;
      bounds.min[axis] = Math.min(bounds.min[axis], center[axis] - half);
      bounds.max[axis] = Math.max(bounds.max[axis], center[axis] + half);
    });
  });

  return bounds;
}
