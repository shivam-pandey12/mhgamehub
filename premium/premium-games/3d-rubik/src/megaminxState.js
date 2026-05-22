export const MEGAMINX_FACE_IDS = Array.from({ length: 12 }, (_, index) => `F${index + 1}`);
export const MEGAMINX_SCRAMBLE_LENGTH = 50;

export const MEGAMINX_FACE_LABELS = {
  F1: "Top",
  F2: "Upper Right",
  F3: "Front Right",
  F4: "Front Left",
  F5: "Upper Left",
  F6: "Right Low",
  F7: "Front Low",
  F8: "Left Low",
  F9: "Back Right",
  F10: "Back Left",
  F11: "Lower Back",
  F12: "Bottom"
};

export const MEGAMINX_FACE_COLORS = {
  F1: "#f7f1e6",
  F2: "#d75248",
  F3: "#3a9f68",
  F4: "#3478d6",
  F5: "#e7b84a",
  F6: "#d9853d",
  F7: "#74b8d8",
  F8: "#9b70c7",
  F9: "#c65d91",
  F10: "#8fbc56",
  F11: "#b7a172",
  F12: "#f0d36d"
};

export const MEGAMINX_QUICK_FACE_MAP = {
  U: "F1",
  R: "F2",
  F: "F3",
  L: "F5",
  B: "F9",
  D: "F12"
};

const PHI_STEP = Math.PI * 2 / 5;
const RING_Y = 1 / Math.sqrt(5);
const RING_RADIUS = 2 / Math.sqrt(5);
const DODECA_RADIUS = 2.02;

function mod(value, base) {
  return ((value % base) + base) % base;
}

function vec(x = 0, y = 0, z = 0) {
  return { x, y, z };
}

function cloneVec(vector) {
  return { x: vector.x, y: vector.y, z: vector.z };
}

function addVec(left, right) {
  return { x: left.x + right.x, y: left.y + right.y, z: left.z + right.z };
}

function subVec(left, right) {
  return { x: left.x - right.x, y: left.y - right.y, z: left.z - right.z };
}

function scaleVec(vector, scalar) {
  return { x: vector.x * scalar, y: vector.y * scalar, z: vector.z * scalar };
}

function dotVec(left, right) {
  return left.x * right.x + left.y * right.y + left.z * right.z;
}

function crossVec(left, right) {
  return {
    x: left.y * right.z - left.z * right.y,
    y: left.z * right.x - left.x * right.z,
    z: left.x * right.y - left.y * right.x
  };
}

function lengthVec(vector) {
  return Math.hypot(vector.x, vector.y, vector.z);
}

function normalizeVec(vector) {
  const length = lengthVec(vector) || 1;
  return scaleVec(vector, 1 / length);
}

function averageVec(points) {
  return scaleVec(points.reduce((sum, point) => addVec(sum, point), vec()), 1 / Math.max(1, points.length));
}

function lerpVec(left, right, alpha) {
  return {
    x: left.x + (right.x - left.x) * alpha,
    y: left.y + (right.y - left.y) * alpha,
    z: left.z + (right.z - left.z) * alpha
  };
}

function vecSignature(vector) {
  return `${Number(vector.x).toFixed(5)},${Number(vector.y).toFixed(5)},${Number(vector.z).toFixed(5)}`;
}

function makeSlotId(type, faces) {
  return `${type}-${faces.slice().sort((left, right) => {
    const a = Number(left.slice(1));
    const b = Number(right.slice(1));
    return a - b;
  }).join("-")}`;
}

function slotFaces(slotId) {
  return String(slotId).split("-").slice(1);
}

function createIcosahedronVertices() {
  const vertices = [vec(0, 1, 0)];
  for (let index = 0; index < 5; index += 1) {
    const angle = Math.PI / 2 - index * PHI_STEP;
    vertices.push(normalizeVec(vec(Math.cos(angle) * RING_RADIUS, RING_Y, Math.sin(angle) * RING_RADIUS)));
  }
  for (let index = 0; index < 5; index += 1) {
    const angle = Math.PI / 2 - Math.PI / 5 - index * PHI_STEP;
    vertices.push(normalizeVec(vec(Math.cos(angle) * RING_RADIUS, -RING_Y, Math.sin(angle) * RING_RADIUS)));
  }
  vertices.push(vec(0, -1, 0));
  return vertices;
}

function createIcosahedronFaces() {
  const faces = [];
  for (let index = 0; index < 5; index += 1) {
    const upper = 1 + index;
    const upperNext = 1 + ((index + 1) % 5);
    const lower = 6 + index;
    const lowerPrevious = 6 + mod(index - 1, 5);
    const lowerNext = 6 + ((index + 1) % 5);

    faces.push([0, upper, upperNext]);
    faces.push([upper, lower, lowerPrevious]);
    faces.push([upper, upperNext, lower]);
    faces.push([11, lowerNext, lower]);
  }
  return faces;
}

function projectReference(normal) {
  const preferred = Math.abs(normal.y) > 0.86 ? vec(0, 0, 1) : vec(0, 1, 0);
  return normalizeVec(subVec(preferred, scaleVec(normal, dotVec(preferred, normal))));
}

function sortAroundNormal(items, normal, getPoint) {
  const tangent = projectReference(normal);
  const bitangent = normalizeVec(crossVec(normal, tangent));
  return items.slice().sort((left, right) => {
    const leftPoint = subVec(getPoint(left), scaleVec(normal, dotVec(getPoint(left), normal)));
    const rightPoint = subVec(getPoint(right), scaleVec(normal, dotVec(getPoint(right), normal)));
    const leftAngle = Math.atan2(dotVec(leftPoint, bitangent), dotVec(leftPoint, tangent));
    const rightAngle = Math.atan2(dotVec(rightPoint, bitangent), dotVec(rightPoint, tangent));
    return leftAngle - rightAngle;
  });
}

function polygonCentroid(points) {
  return averageVec(points);
}

function createFacelet(faceId, slotId, type, points) {
  return {
    id: `${faceId}-${slotId}-${type}`,
    faceId,
    slotId,
    type,
    points: points.map(cloneVec),
    center: polygonCentroid(points)
  };
}

function createFaceletsForFace(face) {
  const facelets = [];
  const points = face.points;
  const center = face.center;

  facelets.push(createFacelet(
    face.id,
    face.centerSlot,
    "center",
    points.map((point) => lerpVec(center, point, 0.36))
  ));

  for (let index = 0; index < 5; index += 1) {
    const previous = points[mod(index - 1, 5)];
    const current = points[index];
    const next = points[(index + 1) % 5];

    facelets.push(createFacelet(face.id, face.edgeSlots[index], "edge", [
      lerpVec(center, current, 0.43),
      lerpVec(center, next, 0.43),
      lerpVec(center, next, 0.73),
      lerpVec(center, current, 0.73)
    ]));

    facelets.push(createFacelet(face.id, face.cornerSlots[index], "corner", [
      lerpVec(lerpVec(current, previous, 0.24), center, 0.08),
      lerpVec(current, center, 0.38),
      lerpVec(lerpVec(current, next, 0.24), center, 0.08)
    ]));
  }

  return facelets;
}

function createMegaminxTopology() {
  const vertices = createIcosahedronVertices();
  const icoFaces = createIcosahedronFaces().map((vertexIndices, index) => {
    const faceIds = vertexIndices.map((vertexIndex) => MEGAMINX_FACE_IDS[vertexIndex]);
    const center = normalizeVec(averageVec(vertexIndices.map((vertexIndex) => vertices[vertexIndex])));
    return {
      index,
      vertexIndices,
      slotId: makeSlotId("corner", faceIds),
      point: scaleVec(center, DODECA_RADIUS)
    };
  });

  const faceDefinitions = {};
  const edgeSlots = new Set();
  const cornerSlots = new Set(icoFaces.map((face) => face.slotId));

  MEGAMINX_FACE_IDS.forEach((faceId, vertexIndex) => {
    const normal = vertices[vertexIndex];
    const adjacent = sortAroundNormal(
      icoFaces.filter((face) => face.vertexIndices.includes(vertexIndex)),
      normal,
      (face) => face.point
    );

    const cornerSlotIds = adjacent.map((face) => face.slotId);
    const points = adjacent.map((face) => face.point);
    const neighborIds = adjacent.map((face, index) => {
      const next = adjacent[(index + 1) % adjacent.length];
      const shared = face.vertexIndices
        .filter((candidate) => next.vertexIndices.includes(candidate) && candidate !== vertexIndex);
      return MEGAMINX_FACE_IDS[shared[0]];
    });
    const orderedEdgeSlots = neighborIds.map((neighborId) => {
      const slot = makeSlotId("edge", [faceId, neighborId]);
      edgeSlots.add(slot);
      return slot;
    });

    faceDefinitions[faceId] = {
      id: faceId,
      label: MEGAMINX_FACE_LABELS[faceId],
      color: MEGAMINX_FACE_COLORS[faceId],
      normal: cloneVec(normal),
      center: polygonCentroid(points),
      points: points.map(cloneVec),
      centerSlot: `center-${faceId}`,
      cornerSlots: cornerSlotIds,
      edgeSlots: orderedEdgeSlots,
      neighborIds
    };
  });

  const facelets = Object.values(faceDefinitions).flatMap(createFaceletsForFace);
  const bySlot = new Map();
  facelets.forEach((facelet) => {
    if (!bySlot.has(facelet.slotId)) {
      bySlot.set(facelet.slotId, []);
    }
    bySlot.get(facelet.slotId).push(facelet);
  });

  const slotCenters = {};
  bySlot.forEach((items, slotId) => {
    slotCenters[slotId] = polygonCentroid(items.map((item) => item.center));
  });

  return {
    faceIds: [...MEGAMINX_FACE_IDS],
    faces: faceDefinitions,
    facelets,
    edgeSlots: [...edgeSlots].sort(),
    cornerSlots: [...cornerSlots].sort(),
    slotCenters
  };
}

export const MEGAMINX_TOPOLOGY = createMegaminxTopology();

function createSticker(faceId, index) {
  return {
    id: "",
    homeFace: faceId,
    face: faceId,
    color: MEGAMINX_FACE_COLORS[faceId],
    homeIndex: index
  };
}

function createPiece(type, slotId) {
  const faces = slotFaces(slotId);
  const id = `${type}-${faces.join("-")}`;
  return {
    id,
    type,
    homeSlot: slotId,
    slot: slotId,
    orientation: 0,
    homeOrientation: 0,
    stickers: faces.map((faceId, index) => ({
      ...createSticker(faceId, index),
      id: `${id}-sticker-${index}`
    }))
  };
}

function clonePiece(piece) {
  return {
    ...piece,
    stickers: piece.stickers.map((sticker) => ({ ...sticker }))
  };
}

function rotateFaceReference(faceId, moveFaceId, turn) {
  if (faceId === moveFaceId) return faceId;
  return MEGAMINX_TURN_TABLES[moveFaceId]?.[mod(turn, 5)]?.faces.get(faceId) || faceId;
}

function rotateSlotReference(slotId, moveFaceId, turn) {
  if (slotId === `center-${moveFaceId}`) return slotId;
  return MEGAMINX_TURN_TABLES[moveFaceId]?.[mod(turn, 5)]?.slots.get(slotId) || slotId;
}

function hasFaceInSlot(slotId, faceId) {
  return slotFaces(slotId).includes(faceId);
}

function cycleRing(ring, steps) {
  return new Map(ring.map((item, index) => [item, ring[mod(index + steps, ring.length)]]));
}

function buildTurnTable(faceId, steps) {
  const face = MEGAMINX_TOPOLOGY.faces[faceId];
  return {
    faces: cycleRing(face.neighborIds, steps),
    slots: new Map([
      ...cycleRing(face.edgeSlots, steps),
      ...cycleRing(face.cornerSlots, steps)
    ])
  };
}

const MEGAMINX_TURN_TABLES = Object.fromEntries(MEGAMINX_FACE_IDS.map((faceId) => [
  faceId,
  Array.from({ length: 5 }, (_, steps) => buildTurnTable(faceId, steps))
]));

export function createSolvedMegaminx() {
  const pieces = [
    ...MEGAMINX_FACE_IDS.map((faceId) => createPiece("center", `center-${faceId}`)),
    ...MEGAMINX_TOPOLOGY.edgeSlots.map((slotId) => createPiece("edge", slotId)),
    ...MEGAMINX_TOPOLOGY.cornerSlots.map((slotId) => createPiece("corner", slotId))
  ].sort((left, right) => left.id.localeCompare(right.id));

  return {
    puzzleType: "megaminx",
    size: "megaminx",
    pieces,
    slots: pieces.map((piece) => piece.homeSlot),
    faces: MEGAMINX_FACE_IDS,
    moveVersion: 0
  };
}

export function resetMegaminxState(state) {
  const solved = createSolvedMegaminx();
  state.puzzleType = "megaminx";
  state.size = "megaminx";
  state.faces = [...solved.faces];
  state.slots = [...solved.slots];
  state.moveVersion = 0;
  if (Array.isArray(state.pieces)) {
    state.pieces.splice(0, state.pieces.length, ...solved.pieces);
  } else {
    state.pieces = solved.pieces;
  }
}

export function cloneMegaminxState(state) {
  return {
    puzzleType: "megaminx",
    size: "megaminx",
    faces: [...(state.faces || MEGAMINX_FACE_IDS)],
    slots: [...(state.slots || [])],
    moveVersion: state.moveVersion || 0,
    pieces: state.pieces.map(clonePiece)
  };
}

export function getMegaminxPieceById(state, id) {
  return state.pieces.find((piece) => piece.id === id) || null;
}

export function getMegaminxFaceDefinition(faceId) {
  return MEGAMINX_TOPOLOGY.faces[faceId] || MEGAMINX_TOPOLOGY.faces.F1;
}

export function getMegaminxSlotCenter(slotId) {
  return cloneVec(MEGAMINX_TOPOLOGY.slotCenters[slotId] || vec());
}

function normalizeMoveFace(value) {
  const raw = String(value || "").trim();
  const faceMatch = raw.match(/^F(1[0-2]|[1-9])$/i);
  if (faceMatch) return `F${Number(faceMatch[1])}`;
  const quick = raw[0]?.toUpperCase();
  return MEGAMINX_QUICK_FACE_MAP[quick] || null;
}

function parseMoveToken(rawValue) {
  const raw = String(rawValue || "").trim();
  const faceMatch = raw.match(/^F(1[0-2]|[1-9])/i);
  if (faceMatch) {
    return {
      faceId: `F${Number(faceMatch[1])}`,
      token: `F${Number(faceMatch[1])}`,
      suffix: raw.slice(faceMatch[0].length)
    };
  }
  const token = raw[0]?.toUpperCase();
  return {
    faceId: normalizeMoveFace(token),
    token,
    suffix: raw.slice(1)
  };
}

export function parseMegaminxMove(notation) {
  if (notation && typeof notation === "object") {
    const faceId = normalizeMoveFace(notation.faceId || notation.face || notation.notation || "F1");
    if (!faceId) {
      throw new Error(`Invalid Megaminx move notation: ${notation.notation || notation.faceId || notation.face}`);
    }
    const rawTurn = Number(notation.turn ?? notation.steps);
    const turn = Number.isFinite(rawTurn) && rawTurn !== 0
      ? Math.max(-2, Math.min(2, Math.trunc(rawTurn)))
      : notation.inverse ? -1 : 1;
    const isDouble = Math.abs(turn) === 2;
    const displayBase = notation.displayBase || notation.face || notation.faceId || faceId;
    const display = notation.display || `${displayBase}${isDouble ? "2" : ""}${turn < 0 ? "'" : ""}`;
    return {
      ...notation,
      puzzleType: "megaminx",
      faceId,
      face: faceId,
      turn,
      inverse: turn < 0,
      isDouble,
      angle: turn * (Math.PI * 2 / 5),
      notation: display,
      display
    };
  }

  const parsed = parseMoveToken(notation);
  if (!parsed.faceId) {
    throw new Error(`Invalid Megaminx move notation: ${notation}`);
  }
  const suffix = parsed.suffix || "";
  const inverse = suffix.includes("'") || suffix.includes("i");
  const isDouble = suffix.includes("2");
  const turn = isDouble ? (inverse ? -2 : 2) : inverse ? -1 : 1;
  const display = `${parsed.token}${isDouble ? "2" : ""}${inverse ? "'" : ""}`;
  return {
    puzzleType: "megaminx",
    faceId: parsed.faceId,
    face: parsed.faceId,
    displayBase: parsed.token,
    turn,
    inverse,
    isDouble,
    angle: turn * (Math.PI * 2 / 5),
    notation: display,
    display
  };
}

export function inverseMegaminxMove(notation) {
  const move = parseMegaminxMove(notation);
  const turn = -move.turn;
  const isDouble = Math.abs(turn) === 2;
  const displayBase = move.displayBase || move.faceId;
  const display = `${displayBase}${isDouble ? "2" : ""}${turn < 0 ? "'" : ""}`;
  return {
    ...move,
    turn,
    inverse: turn < 0,
    isDouble,
    angle: -move.angle,
    notation: display,
    display
  };
}

export function isMegaminxPieceInMove(piece, notation) {
  const move = parseMegaminxMove(notation);
  return hasFaceInSlot(piece.slot, move.faceId);
}

export function getMegaminxMovePieces(state, notation) {
  const move = parseMegaminxMove(notation);
  return state.pieces.filter((piece) => isMegaminxPieceInMove(piece, move));
}

export function applyMegaminxMoveToState(state, notation) {
  const move = parseMegaminxMove(notation);
  const steps = mod(move.turn, 5);
  getMegaminxMovePieces(state, move).forEach((piece) => {
    if (piece.type === "center") {
      piece.orientation = mod(piece.orientation + steps, 5);
    } else {
      piece.slot = rotateSlotReference(piece.slot, move.faceId, steps);
    }
    piece.stickers.forEach((sticker) => {
      sticker.face = rotateFaceReference(sticker.face, move.faceId, steps);
    });
  });
  state.moveVersion = (state.moveVersion || 0) + 1;
  return move;
}

export function getMegaminxSignature(state) {
  return state.pieces
    .slice()
    .sort((left, right) => left.id.localeCompare(right.id))
    .map((piece) => {
      const stickers = piece.stickers
        .slice()
        .sort((left, right) => left.id.localeCompare(right.id))
        .map((sticker) => `${sticker.id}:${sticker.homeFace}->${sticker.face}`)
        .join("|");
      return `${piece.id}@${piece.slot}#${piece.orientation}#${stickers}`;
    })
    .join(";");
}

export function isMegaminxSolved(state) {
  return state.pieces.every((piece) => (
    piece.slot === piece.homeSlot &&
    piece.orientation === piece.homeOrientation &&
    piece.stickers.every((sticker) => sticker.face === sticker.homeFace)
  ));
}

export function isMegaminxFaceSolved(state, faceId = "F1") {
  const target = normalizeMoveFace(faceId) || "F1";
  return state.pieces.every((piece) => (
    piece.stickers
      .filter((sticker) => sticker.homeFace === target)
      .every((sticker) => sticker.face === sticker.homeFace && hasFaceInSlot(piece.slot, target))
  ));
}

export function generateMegaminxScramble({ length = MEGAMINX_SCRAMBLE_LENGTH } = {}) {
  const sequence = [];
  let previousFace = "";

  while (sequence.length < length) {
    const faceId = MEGAMINX_FACE_IDS[Math.floor(Math.random() * MEGAMINX_FACE_IDS.length)];
    if (faceId === previousFace) {
      continue;
    }
    sequence.push(`${faceId}${Math.random() > 0.5 ? "'" : ""}`);
    previousFace = faceId;
  }

  return sequence;
}

export function getAllMegaminxMoves() {
  return MEGAMINX_FACE_IDS.flatMap((faceId) => [faceId, `${faceId}'`]);
}

export function getMegaminxDragCandidateMoves(_position = {}, options = {}) {
  const faceId = normalizeMoveFace(options.faceId || options.face || _position.faceId);
  if (faceId) {
    return [parseMegaminxMove(faceId), parseMegaminxMove(`${faceId}'`)];
  }

  return MEGAMINX_FACE_IDS.flatMap((id) => [parseMegaminxMove(id), parseMegaminxMove(`${id}'`)]);
}

export function getMegaminxStickerCount(state) {
  return state.pieces.reduce((count, piece) => count + piece.stickers.length, 0);
}

export function getMegaminxFaceNeighborSignature() {
  return MEGAMINX_FACE_IDS
    .map((faceId) => `${faceId}:${MEGAMINX_TOPOLOGY.faces[faceId].neighborIds.join(",")}`)
    .join(";");
}

export function getMegaminxTopologySignature() {
  return [
    ...MEGAMINX_FACE_IDS.map((faceId) => {
      const face = MEGAMINX_TOPOLOGY.faces[faceId];
      return `${faceId}:${vecSignature(face.normal)}:${face.neighborIds.join(",")}`;
    }),
    `edges:${MEGAMINX_TOPOLOGY.edgeSlots.length}`,
    `corners:${MEGAMINX_TOPOLOGY.cornerSlots.length}`
  ].join("|");
}
