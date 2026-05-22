export const PYRAMINX_MOVES = ["U", "L", "R", "B"];
export const PYRAMINX_TIP_MOVES = ["u", "l", "r", "b"];
export const PYRAMINX_VERTEX_LABELS = ["U", "L", "R", "B"];
export const PYRAMINX_ORDER = 3;
export const PYRAMINX_SCRAMBLE_LENGTH = 11;

export const PYRAMINX_FACE_DEFINITIONS = {
  U: { label: "Ivory face", color: "#f5f1e7" },
  L: { label: "Green face", color: "#36a669" },
  R: { label: "Blue face", color: "#3478d6" },
  B: { label: "Gold face", color: "#e1b84a" }
};

const MOVE_CYCLES = {
  U: ["L", "R", "B"],
  L: ["U", "B", "R"],
  R: ["U", "L", "B"],
  B: ["U", "R", "L"]
};

const SLOT_SORT_ORDER = { U: 0, L: 1, R: 2, B: 3 };

function mod(value, base) {
  return ((value % base) + base) % base;
}

function cloneCoord(coord) {
  return { U: coord.U, L: coord.L, R: coord.R, B: coord.B };
}

function coordSignature(coord) {
  return `${coord.U},${coord.L},${coord.R},${coord.B}`;
}

function coordsEqual(left, right) {
  return left.U === right.U && left.L === right.L && left.R === right.R && left.B === right.B;
}

function cloneTriangle(triangle) {
  return triangle.map(cloneCoord);
}

function triangleSignature(triangle) {
  return triangle.map(coordSignature).join("/");
}

function sortedPair(left, right) {
  return [left, right].sort((a, b) => SLOT_SORT_ORDER[a] - SLOT_SORT_ORDER[b]).join("");
}

function createCoord(face, a, b, c) {
  const labels = PYRAMINX_VERTEX_LABELS.filter((label) => label !== face);
  return {
    U: face === "U" ? 0 : labels[0] === "U" ? a : labels[1] === "U" ? b : labels[2] === "U" ? c : 0,
    L: face === "L" ? 0 : labels[0] === "L" ? a : labels[1] === "L" ? b : labels[2] === "L" ? c : 0,
    R: face === "R" ? 0 : labels[0] === "R" ? a : labels[1] === "R" ? b : labels[2] === "R" ? c : 0,
    B: face === "B" ? 0 : labels[0] === "B" ? a : labels[1] === "B" ? b : labels[2] === "B" ? c : 0
  };
}

function getTriangleCentroid(triangle) {
  const total = triangle.reduce((sum, coord) => ({
    U: sum.U + coord.U,
    L: sum.L + coord.L,
    R: sum.R + coord.R,
    B: sum.B + coord.B
  }), { U: 0, L: 0, R: 0, B: 0 });

  return {
    U: total.U / 3,
    L: total.L / 3,
    R: total.R / 3,
    B: total.B / 3
  };
}

function classifyTriangleSlot(triangle) {
  const centroid = getTriangleCentroid(triangle);
  const present = PYRAMINX_VERTEX_LABELS.map((label) => ({ label, value: centroid[label] }))
    .filter((entry) => entry.value > 0.001)
    .sort((left, right) => right.value - left.value);
  const max = present[0];

  if (max.value > 2) {
    return `tip-${max.label}`;
  }

  if (max.value > 1.5) {
    return `center-${max.label}`;
  }

  return `edge-${sortedPair(present[0].label, present[1].label)}`;
}

function createSticker(face, triangle) {
  return {
    id: "",
    homeFace: face,
    face,
    color: PYRAMINX_FACE_DEFINITIONS[face].color,
    homeTriangle: cloneTriangle(triangle),
    triangle: cloneTriangle(triangle)
  };
}

function createFaceStickers(face) {
  const stickers = [];
  let index = 0;

  for (let a = 0; a <= PYRAMINX_ORDER - 1; a += 1) {
    for (let b = 0; b <= PYRAMINX_ORDER - 1 - a; b += 1) {
      const c = PYRAMINX_ORDER - 1 - a - b;
      const triangle = [
        createCoord(face, a + 1, b, c),
        createCoord(face, a, b + 1, c),
        createCoord(face, a, b, c + 1)
      ];
      stickers.push({ ...createSticker(face, triangle), id: `${face}-up-${index}` });
      index += 1;
    }
  }

  for (let a = 0; a <= PYRAMINX_ORDER - 2; a += 1) {
    for (let b = 0; b <= PYRAMINX_ORDER - 2 - a; b += 1) {
      const c = PYRAMINX_ORDER - 2 - a - b;
      const triangle = [
        createCoord(face, a + 1, b + 1, c),
        createCoord(face, a + 1, b, c + 1),
        createCoord(face, a, b + 1, c + 1)
      ];
      stickers.push({ ...createSticker(face, triangle), id: `${face}-down-${index}` });
      index += 1;
    }
  }

  return stickers;
}

function createPieceFromStickers(slot, stickers) {
  const type = slot.startsWith("tip") ? "tip" : slot.startsWith("center") ? "center" : "edge";
  return {
    id: slot,
    type,
    homeSlot: slot,
    slot,
    orientation: 0,
    homeOrientation: 0,
    stickers: stickers.map((sticker) => ({ ...sticker, id: `${slot}-${sticker.id}` })),
    position: getPiecePositionFromStickers(stickers)
  };
}

function getPiecePositionFromStickers(stickers) {
  const total = stickers.reduce((sum, sticker) => {
    const centroid = getTriangleCentroid(sticker.triangle);
    return {
      U: sum.U + centroid.U,
      L: sum.L + centroid.L,
      R: sum.R + centroid.R,
      B: sum.B + centroid.B
    };
  }, { U: 0, L: 0, R: 0, B: 0 });
  const count = Math.max(1, stickers.length);
  return {
    U: total.U / count,
    L: total.L / count,
    R: total.R / count,
    B: total.B / count
  };
}

function recalcPiece(piece) {
  piece.slot = classifyTriangleSlot(piece.stickers[0].triangle);
  piece.position = getPiecePositionFromStickers(piece.stickers);
  return piece;
}

function rotateCoordAroundVertex(coord, vertex, turn) {
  const result = cloneCoord(coord);
  const cycle = MOVE_CYCLES[vertex];
  const offset = turn > 0 ? 1 : 2;

  cycle.forEach((label, index) => {
    result[cycle[(index + offset) % cycle.length]] = coord[label];
  });

  result[vertex] = coord[vertex];
  return result;
}

function rotateStickerAroundVertex(sticker, vertex, turn) {
  sticker.triangle = sticker.triangle.map((coord) => rotateCoordAroundVertex(coord, vertex, turn));
  return sticker;
}

export function getPyraminxStickerCentroid(sticker) {
  return getTriangleCentroid(sticker.triangle);
}

export function createSolvedPyraminx() {
  const bySlot = new Map();

  PYRAMINX_VERTEX_LABELS.flatMap(createFaceStickers).forEach((sticker) => {
    const slot = classifyTriangleSlot(sticker.triangle);
    if (!bySlot.has(slot)) {
      bySlot.set(slot, []);
    }
    bySlot.get(slot).push(sticker);
  });

  const pieces = [...bySlot.entries()]
    .map(([slot, stickers]) => createPieceFromStickers(slot, stickers))
    .sort((left, right) => left.id.localeCompare(right.id));

  return {
    puzzleType: "pyraminx",
    size: "pyraminx",
    pieces,
    slots: pieces.map((piece) => piece.homeSlot),
    moveVersion: 0
  };
}

export function resetPyraminxState(state) {
  const solved = createSolvedPyraminx();
  state.puzzleType = "pyraminx";
  state.size = "pyraminx";
  state.slots = [...solved.slots];
  state.moveVersion = 0;
  if (Array.isArray(state.pieces)) {
    state.pieces.splice(0, state.pieces.length, ...solved.pieces);
  } else {
    state.pieces = solved.pieces;
  }
}

export function clonePyraminxState(state) {
  return {
    puzzleType: "pyraminx",
    size: "pyraminx",
    slots: [...state.slots],
    moveVersion: state.moveVersion,
    pieces: state.pieces.map((piece) => ({
      ...piece,
      position: { ...piece.position },
      stickers: piece.stickers.map((sticker) => ({
        ...sticker,
        homeTriangle: cloneTriangle(sticker.homeTriangle),
        triangle: cloneTriangle(sticker.triangle)
      }))
    }))
  };
}

export function getPyraminxPieceById(state, id) {
  return state.pieces.find((piece) => piece.id === id) || null;
}

export function parsePyraminxMove(notation) {
  if (notation && typeof notation === "object") {
    const vertex = String(notation.vertex || notation.face || notation.notation || "U")[0].toUpperCase();
    if (!PYRAMINX_MOVES.includes(vertex)) {
      throw new Error(`Invalid Pyraminx move notation: ${notation.notation || notation.face || notation.vertex}`);
    }
    const token = String(notation.face || notation.notation || "")[0] || "";
    const isTip = typeof notation.isTip === "boolean"
      ? notation.isTip
      : PYRAMINX_TIP_MOVES.includes(token);
    const rawTurn = Number(notation.turn);
    const turn = Number.isFinite(rawTurn) && rawTurn !== 0 ? Math.sign(rawTurn) : notation.inverse ? -1 : 1;
    const display = notation.display || `${isTip ? vertex.toLowerCase() : vertex}${turn < 0 ? "'" : ""}`;
    return {
      ...notation,
      puzzleType: "pyraminx",
      vertex,
      isTip,
      inverse: turn < 0,
      turn,
      angle: turn * (Math.PI * 2 / 3),
      notation: display,
      display
    };
  }

  const raw = String(notation || "").trim();
  const token = raw[0] || "";
  const vertex = token.toUpperCase();
  const isTip = token === token.toLowerCase() && PYRAMINX_TIP_MOVES.includes(token);

  if (!PYRAMINX_MOVES.includes(vertex)) {
    throw new Error(`Invalid Pyraminx move notation: ${notation}`);
  }

  const inverse = raw.includes("'") || raw.endsWith("i");
  const turn = inverse ? -1 : 1;
  const display = `${isTip ? vertex.toLowerCase() : vertex}${inverse ? "'" : ""}`;

  return {
    puzzleType: "pyraminx",
    notation: display,
    display,
    face: isTip ? vertex.toLowerCase() : vertex,
    vertex,
    isTip,
    inverse,
    turn,
    angle: turn * (Math.PI * 2 / 3)
  };
}

export function inversePyraminxMove(notation) {
  const move = parsePyraminxMove(notation);
  const inverse = move.turn > 0;
  const display = `${move.isTip ? move.vertex.toLowerCase() : move.vertex}${inverse ? "'" : ""}`;
  return {
    ...move,
    inverse,
    turn: -move.turn,
    angle: -move.angle,
    notation: display,
    display
  };
}

export function isPyraminxPieceInMove(piece, notation) {
  const move = parsePyraminxMove(notation);
  if (move.isTip) {
    return piece.type === "tip" && piece.slot === `tip-${move.vertex}`;
  }

  if (piece.type === "tip" || piece.type === "center") {
    return piece.slot.endsWith(`-${move.vertex}`);
  }

  return piece.slot.includes(move.vertex);
}

export function getPyraminxMovePieces(state, notation) {
  const move = parsePyraminxMove(notation);
  return state.pieces.filter((piece) => isPyraminxPieceInMove(piece, move));
}

export const getPyraminxMoveFacelets = getPyraminxMovePieces;

export function applyPyraminxMoveToState(state, notation) {
  const move = parsePyraminxMove(notation);
  const pieces = getPyraminxMovePieces(state, move);

  pieces.forEach((piece) => {
    piece.stickers.forEach((sticker) => rotateStickerAroundVertex(sticker, move.vertex, move.turn));
    if (piece.type === "tip" || piece.type === "center") {
      piece.orientation = mod(piece.orientation + move.turn, 3);
    }
    recalcPiece(piece);
  });

  state.moveVersion = (state.moveVersion || 0) + 1;
  return move;
}

export function getPyraminxSignature(state) {
  return state.pieces
    .slice()
    .sort((left, right) => left.id.localeCompare(right.id))
    .map((piece) => {
      const stickers = piece.stickers
        .slice()
        .sort((left, right) => left.id.localeCompare(right.id))
        .map((sticker) => `${sticker.id}:${sticker.face}:${triangleSignature(sticker.triangle)}`)
        .join("|");
      return `${piece.id}@${piece.slot}#${piece.orientation}#${stickers}`;
    })
    .join(";");
}

export function isPyraminxSolved(state) {
  return state.pieces.every((piece) => (
    piece.slot === piece.homeSlot &&
    piece.orientation === piece.homeOrientation &&
    piece.stickers.every((sticker) => sticker.triangle.every((coord, index) => coordsEqual(coord, sticker.homeTriangle[index])))
  ));
}

export function isPyraminxFaceSolved(state, face) {
  return state.pieces.every((piece) => (
    piece.stickers
      .filter((sticker) => sticker.homeFace === face)
      .every((sticker) => sticker.triangle.every((coord, index) => coordsEqual(coord, sticker.homeTriangle[index])))
  ));
}

export function arePyraminxTipsSolved(state) {
  return state.pieces
    .filter((piece) => piece.type === "tip")
    .every((piece) => (
      piece.slot === piece.homeSlot &&
      piece.orientation === piece.homeOrientation &&
      piece.stickers.every((sticker) => sticker.triangle.every((coord, index) => coordsEqual(coord, sticker.homeTriangle[index])))
    ));
}

export function generatePyraminxScramble({ includeTips = true, length = PYRAMINX_SCRAMBLE_LENGTH } = {}) {
  const moves = [...PYRAMINX_MOVES, ...(includeTips ? PYRAMINX_TIP_MOVES : [])];
  const sequence = [];
  let previousVertex = "";

  while (sequence.length < length) {
    const base = moves[Math.floor(Math.random() * moves.length)];
    const vertex = base.toUpperCase();
    if (vertex === previousVertex) {
      continue;
    }

    const inverse = Math.random() > 0.5;
    sequence.push(inverse ? `${base}'` : base);
    previousVertex = vertex;
  }

  return sequence;
}

export function getAllPyraminxMoves() {
  return [
    ...PYRAMINX_MOVES.flatMap((move) => [move, `${move}'`]),
    ...PYRAMINX_TIP_MOVES.flatMap((move) => [move, `${move}'`])
  ];
}

function dominantVertexFromPosition(position = {}) {
  return PYRAMINX_VERTEX_LABELS
    .map((vertex) => ({ vertex, value: position[vertex] || 0 }))
    .sort((left, right) => right.value - left.value)[0]?.vertex || "U";
}

export function getPyraminxDragCandidateMoves(position = {}, options = {}) {
  const candidates = [];
  const pieceType = options.pieceType || options.type || "";

  if (pieceType === "tip") {
    const tip = dominantVertexFromPosition(position).toLowerCase();
    return [parsePyraminxMove(tip), parsePyraminxMove(`${tip}'`)];
  }

  PYRAMINX_MOVES.forEach((vertex) => {
    if ((position[vertex] || 0) > 0.55) {
      candidates.push(parsePyraminxMove(vertex));
      candidates.push(parsePyraminxMove(`${vertex}'`));
    }
  });

  return candidates;
}

export function getPyraminxStickerCount(state) {
  return state.pieces.reduce((count, piece) => count + piece.stickers.length, 0);
}
