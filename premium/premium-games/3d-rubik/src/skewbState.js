export const SKEWB_MOVES = ["R", "L", "U", "B"];
export const SKEWB_SCRAMBLE_LENGTH = 11;

export const SKEWB_FACE_DEFINITIONS = {
  U: { axis: "y", sign: 1, color: "#f7f1e6", label: "Ivory" },
  D: { axis: "y", sign: -1, color: "#e4b84f", label: "Gold" },
  F: { axis: "z", sign: 1, color: "#42a866", label: "Green" },
  B: { axis: "z", sign: -1, color: "#3b78d1", label: "Blue" },
  R: { axis: "x", sign: 1, color: "#d65345", label: "Red" },
  L: { axis: "x", sign: -1, color: "#d9893b", label: "Orange" }
};

export const SKEWB_MOVE_AXES = {
  R: { x: 1, y: 1, z: 1 },
  L: { x: -1, y: -1, z: 1 },
  U: { x: -1, y: 1, z: -1 },
  B: { x: 1, y: -1, z: -1 }
};

const CORNER_SLOTS = [
  { x: 1, y: 1, z: 1 },
  { x: -1, y: 1, z: 1 },
  { x: 1, y: 1, z: -1 },
  { x: -1, y: 1, z: -1 },
  { x: 1, y: -1, z: 1 },
  { x: -1, y: -1, z: 1 },
  { x: 1, y: -1, z: -1 },
  { x: -1, y: -1, z: -1 }
];

const CENTER_SLOTS = [
  { x: 1, y: 0, z: 0 },
  { x: -1, y: 0, z: 0 },
  { x: 0, y: 1, z: 0 },
  { x: 0, y: -1, z: 0 },
  { x: 0, y: 0, z: 1 },
  { x: 0, y: 0, z: -1 }
];

function cloneVec(vector) {
  return { x: vector.x, y: vector.y, z: vector.z };
}

function vecSignature(vector) {
  return `${vector.x},${vector.y},${vector.z}`;
}

function vectorsEqual(left, right) {
  return left.x === right.x && left.y === right.y && left.z === right.z;
}

function dot(left, right) {
  return left.x * right.x + left.y * right.y + left.z * right.z;
}

function faceFromNormal(normal) {
  return Object.entries(SKEWB_FACE_DEFINITIONS)
    .find(([, definition]) => normal[definition.axis] === definition.sign)?.[0] || "U";
}

function slotId(prefix, vector) {
  return `${prefix}-${vector.x}${vector.y}${vector.z}`;
}

function centerTangent(normal) {
  if (normal.x) return { x: 0, y: 1, z: 0 };
  if (normal.y) return { x: 0, y: 0, z: 1 };
  return { x: 1, y: 0, z: 0 };
}

function createSticker(homeNormal) {
  const face = faceFromNormal(homeNormal);
  return {
    id: "",
    homeFace: face,
    face,
    color: SKEWB_FACE_DEFINITIONS[face].color,
    homeNormal: cloneVec(homeNormal),
    normal: cloneVec(homeNormal)
  };
}

function createCornerPiece(slot) {
  const normals = [
    { x: slot.x, y: 0, z: 0 },
    { x: 0, y: slot.y, z: 0 },
    { x: 0, y: 0, z: slot.z }
  ];
  const id = slotId("corner", slot);
  return {
    id,
    type: "corner",
    homeSlot: cloneVec(slot),
    slot: cloneVec(slot),
    orientation: 0,
    homeOrientation: 0,
    position: cloneVec(slot),
    stickers: normals.map((normal, index) => ({
      ...createSticker(normal),
      id: `${id}-sticker-${index}`
    }))
  };
}

function createCenterPiece(slot) {
  const id = slotId("center", slot);
  const tangent = centerTangent(slot);
  return {
    id,
    type: "center",
    homeSlot: cloneVec(slot),
    slot: cloneVec(slot),
    orientation: 0,
    homeOrientation: 0,
    position: cloneVec(slot),
    homeTangent: cloneVec(tangent),
    tangent: cloneVec(tangent),
    stickers: [{
      ...createSticker(slot),
      id: `${id}-sticker-0`
    }]
  };
}

function rotateVecAroundAxis(vector, axis, turn) {
  const local = {
    x: vector.x * axis.x,
    y: vector.y * axis.y,
    z: vector.z * axis.z
  };
  const rotated = turn > 0
    ? { x: local.z, y: local.x, z: local.y }
    : { x: local.y, y: local.z, z: local.x };
  return {
    x: rotated.x * axis.x,
    y: rotated.y * axis.y,
    z: rotated.z * axis.z
  };
}

function recalcPiece(piece) {
  piece.position = cloneVec(piece.slot);
  return piece;
}

function slotSignature(slot) {
  return `${slot.x},${slot.y},${slot.z}`;
}

function buildTurnTable(face, turn) {
  const axis = SKEWB_MOVE_AXES[face];
  const entries = [...CORNER_SLOTS, ...CENTER_SLOTS]
    .filter((slot) => slot.x && slot.y && slot.z ? dot(slot, axis) >= 1 : dot(slot, axis) > 0)
    .map((slot) => [slotSignature(slot), rotateVecAroundAxis(slot, axis, turn)]);
  return new Map(entries);
}

const SKEWB_TURN_TABLES = Object.fromEntries(SKEWB_MOVES.map((face) => [
  face,
  {
    clockwise: buildTurnTable(face, 1),
    counterclockwise: buildTurnTable(face, -1)
  }
]));

export function createSolvedSkewb() {
  const pieces = [
    ...CORNER_SLOTS.map(createCornerPiece),
    ...CENTER_SLOTS.map(createCenterPiece)
  ].sort((left, right) => left.id.localeCompare(right.id));

  return {
    puzzleType: "skewb",
    size: "skewb",
    pieces,
    slots: pieces.map((piece) => piece.id),
    moveVersion: 0
  };
}

export function resetSkewbState(state) {
  const solved = createSolvedSkewb();
  state.puzzleType = "skewb";
  state.size = "skewb";
  state.slots = [...solved.slots];
  state.moveVersion = 0;
  if (Array.isArray(state.pieces)) {
    state.pieces.splice(0, state.pieces.length, ...solved.pieces);
  } else {
    state.pieces = solved.pieces;
  }
}

export function cloneSkewbState(state) {
  return {
    puzzleType: "skewb",
    size: "skewb",
    slots: [...state.slots],
    moveVersion: state.moveVersion,
    pieces: state.pieces.map((piece) => ({
      ...piece,
      homeSlot: cloneVec(piece.homeSlot),
      slot: cloneVec(piece.slot),
      position: cloneVec(piece.position),
      ...(piece.homeTangent ? {
        homeTangent: cloneVec(piece.homeTangent),
        tangent: cloneVec(piece.tangent)
      } : {}),
      stickers: piece.stickers.map((sticker) => ({
        ...sticker,
        homeNormal: cloneVec(sticker.homeNormal),
        normal: cloneVec(sticker.normal)
      }))
    }))
  };
}

export function getSkewbPieceById(state, id) {
  return state.pieces.find((piece) => piece.id === id) || null;
}

export function parseSkewbMove(notation) {
  if (notation && typeof notation === "object") {
    const face = String(notation.face || notation.corner || notation.notation || "R")[0].toUpperCase();
    if (!SKEWB_MOVES.includes(face)) {
      throw new Error(`Invalid Skewb move notation: ${notation.notation || notation.face || notation.corner}`);
    }
    const rawTurn = Number(notation.turn);
    const turn = Number.isFinite(rawTurn) && rawTurn !== 0 ? Math.sign(rawTurn) : notation.inverse ? -1 : 1;
    const display = notation.display || `${face}${turn < 0 ? "'" : ""}`;
    return {
      ...notation,
      puzzleType: "skewb",
      face,
      corner: face,
      axis: cloneVec(SKEWB_MOVE_AXES[face]),
      turn,
      inverse: turn < 0,
      angle: turn * (Math.PI * 2 / 3),
      notation: display,
      display
    };
  }

  const raw = String(notation || "").trim();
  const face = raw[0]?.toUpperCase();
  if (!SKEWB_MOVES.includes(face)) {
    throw new Error(`Invalid Skewb move notation: ${notation}`);
  }
  const inverse = raw.includes("'") || raw.endsWith("i");
  const turn = inverse ? -1 : 1;
  const display = `${face}${inverse ? "'" : ""}`;
  return {
    puzzleType: "skewb",
    face,
    corner: face,
    axis: cloneVec(SKEWB_MOVE_AXES[face]),
    turn,
    inverse,
    angle: turn * (Math.PI * 2 / 3),
    notation: display,
    display
  };
}

export function inverseSkewbMove(notation) {
  const move = parseSkewbMove(notation);
  const display = `${move.face}${move.turn > 0 ? "'" : ""}`;
  return {
    ...move,
    turn: -move.turn,
    inverse: move.turn > 0,
    angle: -move.angle,
    notation: display,
    display
  };
}

export function isSkewbPieceInMove(piece, notation) {
  const move = parseSkewbMove(notation);
  if (piece.type === "corner") {
    return dot(piece.slot, move.axis) >= 1;
  }
  return dot(piece.slot, move.axis) > 0;
}

export function getSkewbMovePieces(state, notation) {
  const move = parseSkewbMove(notation);
  return state.pieces.filter((piece) => isSkewbPieceInMove(piece, move));
}

export function applySkewbMoveToState(state, notation) {
  const move = parseSkewbMove(notation);
  const slotTurns = move.turn > 0
    ? SKEWB_TURN_TABLES[move.face].clockwise
    : SKEWB_TURN_TABLES[move.face].counterclockwise;
  getSkewbMovePieces(state, move).forEach((piece) => {
    piece.slot = cloneVec(slotTurns.get(slotSignature(piece.slot)) || rotateVecAroundAxis(piece.slot, move.axis, move.turn));
    piece.stickers.forEach((sticker) => {
      sticker.normal = rotateVecAroundAxis(sticker.normal, move.axis, move.turn);
      sticker.face = faceFromNormal(sticker.normal);
    });
    if (piece.tangent) {
      piece.tangent = rotateVecAroundAxis(piece.tangent, move.axis, move.turn);
    }
    piece.orientation = (piece.orientation + move.turn + 3) % 3;
    recalcPiece(piece);
  });
  state.moveVersion = (state.moveVersion || 0) + 1;
  return move;
}

export function getSkewbSignature(state) {
  return state.pieces
    .slice()
    .sort((left, right) => left.id.localeCompare(right.id))
    .map((piece) => {
      const stickers = piece.stickers
        .slice()
        .sort((left, right) => left.id.localeCompare(right.id))
        .map((sticker) => `${sticker.id}:${vecSignature(sticker.normal)}`)
        .join("|");
      const tangent = piece.tangent ? `:${vecSignature(piece.tangent)}` : "";
      return `${piece.id}:${vecSignature(piece.slot)}:${piece.orientation}${tangent}:${stickers}`;
    })
    .join(";");
}

export function isSkewbSolved(state) {
  return state.pieces.every((piece) => (
    vectorsEqual(piece.slot, piece.homeSlot) &&
    piece.orientation === piece.homeOrientation &&
    (!piece.tangent || vectorsEqual(piece.tangent, piece.homeTangent)) &&
    piece.stickers.every((sticker) => vectorsEqual(sticker.normal, sticker.homeNormal))
  ));
}

export function isSkewbFaceSolved(state, face) {
  return state.pieces.every((piece) => (
    piece.stickers
      .filter((sticker) => sticker.homeFace === face)
      .every((sticker) => vectorsEqual(sticker.normal, sticker.homeNormal))
  ));
}

export function generateSkewbScramble({ length = SKEWB_SCRAMBLE_LENGTH } = {}) {
  const sequence = [];
  let previousFace = "";

  while (sequence.length < length) {
    const face = SKEWB_MOVES[Math.floor(Math.random() * SKEWB_MOVES.length)];
    if (face === previousFace) {
      continue;
    }
    const inverse = Math.random() > 0.5;
    sequence.push(inverse ? `${face}'` : face);
    previousFace = face;
  }

  return sequence;
}

export function getAllSkewbMoves() {
  return SKEWB_MOVES.flatMap((move) => [move, `${move}'`]);
}

export function getSkewbDragCandidateMoves(position = {}, options = {}) {
  const candidates = [];
  const hasPosition = Number.isFinite(position.x) && Number.isFinite(position.y) && Number.isFinite(position.z);
  SKEWB_MOVES.forEach((face) => {
    const axis = SKEWB_MOVE_AXES[face];
    const contains = !hasPosition
      ? true
      : options.pieceType === "corner"
        ? dot(position, axis) >= 1
        : dot(position, axis) > 0;
    if (contains) {
      candidates.push(parseSkewbMove(face), parseSkewbMove(`${face}'`));
    }
  });
  return candidates;
}

export function getSkewbStickerCount(state) {
  return state.pieces.reduce((count, piece) => count + piece.stickers.length, 0);
}
