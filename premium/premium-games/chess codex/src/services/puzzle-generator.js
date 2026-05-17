import { Chess } from 'chess.js';
import { getPuzzlePool, normalizePuzzleDifficulty, PUZZLES } from '../data/puzzles.js';

const FILES = 'abcdefgh';
const DAILY_DIFFICULTY_ROTATION = ['easy', 'medium', 'hard', 'medium'];
const TRANSFORM_PRESETS = [
  {
    id: 'prime',
    mirrorFiles: false,
    flipRanks: false,
    swapColors: false,
    label: 'Prime'
  },
  {
    id: 'mirror',
    mirrorFiles: true,
    flipRanks: false,
    swapColors: false,
    label: 'Mirror'
  },
  {
    id: 'inverted',
    mirrorFiles: false,
    flipRanks: true,
    swapColors: true,
    label: 'Inverted'
  },
  {
    id: 'inverted-mirror',
    mirrorFiles: true,
    flipRanks: true,
    swapColors: true,
    label: 'Inverted Mirror'
  }
];
const DECORATION_LABELS = ['Ember', 'Prism', 'Echo', 'Velvet', 'Aura', 'Crown', 'Nova', 'Arc'];
const DECORATION_TEMPLATES = [
  { type: 'p', color: 'w' },
  { type: 'p', color: 'b' },
  { type: 'n', color: 'w' },
  { type: 'n', color: 'b' },
  { type: 'b', color: 'w' },
  { type: 'b', color: 'b' }
];
const BASE_CATALOG_CACHE = new Map();
const GENERATED_SEQUENCE_CACHE = new Map();
const DECORATION_SQUARE_CACHE = new Map();

function oppositeColor(color) {
  return color === 'b' ? 'w' : 'b';
}

function squareToCoords(square) {
  return {
    x: FILES.indexOf(square[0]),
    y: Number(square[1]) - 1
  };
}

function coordsToSquare(x, y) {
  return `${FILES[x]}${y + 1}`;
}

function normalizeIndex(index = 0) {
  const numeric = Number(index);
  return Number.isFinite(numeric) ? Math.max(0, Math.floor(numeric)) : 0;
}

function hashString(value) {
  let hash = 2166136261;
  const text = String(value);
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createSeededRng(seed) {
  let state = (seed >>> 0) || 0x6d2b79f5;
  return () => {
    state = Math.imul(state ^ (state >>> 15), state | 1);
    state ^= state + Math.imul(state ^ (state >>> 7), state | 61);
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
  };
}

function parseMove(step) {
  return {
    from: step.slice(0, 2),
    to: step.slice(2, 4),
    promotion: step.slice(4) || undefined
  };
}

function parseSeedPieces(fen) {
  const chess = new Chess();
  chess.load(fen);

  const pieces = [];
  for (let rank = 1; rank <= 8; rank += 1) {
    for (let file = 0; file < 8; file += 1) {
      const square = `${FILES[file]}${rank}`;
      const state = chess.get(square);
      if (!state) {
        continue;
      }

      pieces.push({
        square,
        type: state.type,
        color: state.color
      });
    }
  }

  return {
    pieces,
    turn: fen.split(' ')[1] === 'b' ? 'b' : 'w'
  };
}

function findKingSquare(chess, color) {
  for (let rank = 1; rank <= 8; rank += 1) {
    for (let file = 0; file < 8; file += 1) {
      const square = `${FILES[file]}${rank}`;
      const state = chess.get(square);
      if (state?.type === 'k' && state.color === color) {
        return square;
      }
    }
  }

  return null;
}

function transformCoords(coords, transform) {
  return {
    x: transform.mirrorFiles ? 7 - coords.x : coords.x,
    y: transform.flipRanks ? 7 - coords.y : coords.y
  };
}

function transformSquare(square, transform, shiftX, shiftY) {
  const transformed = transformCoords(squareToCoords(square), transform);
  return coordsToSquare(transformed.x + shiftX, transformed.y + shiftY);
}

function buildFenFromPieces(pieces, turn) {
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));
  pieces.forEach((piece) => {
    const { x, y } = squareToCoords(piece.square);
    board[y][x] = piece.color === 'w'
      ? piece.type.toUpperCase()
      : piece.type.toLowerCase();
  });

  const rows = [];
  for (let y = 7; y >= 0; y -= 1) {
    let row = '';
    let empties = 0;
    for (let x = 0; x < 8; x += 1) {
      const piece = board[y][x];
      if (!piece) {
        empties += 1;
        continue;
      }
      if (empties > 0) {
        row += empties;
        empties = 0;
      }
      row += piece;
    }
    if (empties > 0) {
      row += empties;
    }
    rows.push(row);
  }

  return `${rows.join('/')} ${turn} - - 0 1`;
}

function collectShiftBudget(seed, transform) {
  const { pieces } = parseSeedPieces(seed.fen);
  const transformedPieces = pieces.map((piece) => transformCoords(squareToCoords(piece.square), transform));
  const xs = transformedPieces.map((piece) => piece.x);
  const ys = transformedPieces.map((piece) => piece.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = maxX - minX + 1;
  const height = maxY - minY + 1;

  return {
    anchorX: minX,
    anchorY: minY,
    slotsX: Math.max(1, 8 - width + 1),
    slotsY: Math.max(1, 8 - height + 1)
  };
}

function buildCandidatePuzzle(seed, transform, targetShiftX, targetShiftY, displayIndex) {
  const parsed = parseSeedPieces(seed.fen);
  const budget = collectShiftBudget(seed, transform);
  const deltaX = targetShiftX - budget.anchorX;
  const deltaY = targetShiftY - budget.anchorY;

  const pieces = parsed.pieces.map((piece) => {
    const transformedSquare = transformSquare(piece.square, transform, deltaX, deltaY);
    return {
      square: transformedSquare,
      type: piece.type,
      color: transform.swapColors ? oppositeColor(piece.color) : piece.color
    };
  });

  const turn = transform.swapColors ? oppositeColor(parsed.turn) : parsed.turn;
  const solutionMoves = seed.solutionMoves.map((uci) => {
    const from = transformSquare(uci.slice(0, 2), transform, deltaX, deltaY);
    const to = transformSquare(uci.slice(2, 4), transform, deltaX, deltaY);
    const promotion = uci.slice(4) || '';
    return `${from}${to}${promotion}`;
  });
  const variantCode = `${String.fromCharCode(65 + targetShiftX)}${targetShiftY + 1}`;

  return {
    id: `${seed.id}--${transform.id}--${targetShiftX}-${targetShiftY}--${displayIndex}`,
    title: `${seed.title} ${transform.label} ${variantCode}`,
    description: seed.description,
    difficulty: seed.difficulty,
    fen: buildFenFromPieces(pieces, turn),
    solutionMoves,
    generated: true,
    seedId: seed.id
  };
}

function isPuzzleCandidateValid(candidate) {
  try {
    const chess = new Chess();
    chess.load(candidate.fen);
    for (const step of candidate.solutionMoves) {
      const move = chess.move(parseMove(step));
      if (!move) {
        return false;
      }
    }

    return chess.isCheckmate();
  } catch {
    return false;
  }
}

function getBasePuzzleCatalog(difficulty = 'all') {
  const normalizedDifficulty = normalizePuzzleDifficulty(difficulty);
  if (BASE_CATALOG_CACHE.has(normalizedDifficulty)) {
    return BASE_CATALOG_CACHE.get(normalizedDifficulty);
  }

  const seedPool = getPuzzlePool(normalizedDifficulty);
  const pool = seedPool.length > 0 ? seedPool : PUZZLES;
  const catalog = [];
  const seenSignatures = new Set();

  pool.forEach((seed) => {
    TRANSFORM_PRESETS.forEach((transform) => {
      const budget = collectShiftBudget(seed, transform);
      for (let shiftX = 0; shiftX < budget.slotsX; shiftX += 1) {
        for (let shiftY = 0; shiftY < budget.slotsY; shiftY += 1) {
          const candidate = buildCandidatePuzzle(seed, transform, shiftX, shiftY, catalog.length);
          const signature = `${candidate.fen}|${candidate.solutionMoves.join(',')}`;

          if (seenSignatures.has(signature)) {
            continue;
          }

          if (isPuzzleCandidateValid(candidate)) {
            seenSignatures.add(signature);
            catalog.push(candidate);
          }
        }
      }
    });
  });

  const fallbackCatalog = catalog.length > 0
    ? catalog
    : pool.map((seed, seedIndex) => ({
      ...seed,
      id: `${seed.id}--fallback-${seedIndex}`,
      generated: true,
      seedId: seed.id
    }));

  BASE_CATALOG_CACHE.set(normalizedDifficulty, fallbackCatalog);
  return fallbackCatalog;
}

function collectActionSquares(puzzle) {
  const chess = new Chess();
  chess.load(puzzle.fen);
  const actionSquares = new Set();
  const parsed = parseSeedPieces(puzzle.fen);
  parsed.pieces.forEach((piece) => actionSquares.add(piece.square));

  const whiteKing = findKingSquare(chess, 'w');
  const blackKing = findKingSquare(chess, 'b');
  if (whiteKing) {
    actionSquares.add(whiteKing);
  }
  if (blackKing) {
    actionSquares.add(blackKing);
  }

  for (const step of puzzle.solutionMoves) {
    actionSquares.add(step.slice(0, 2));
    actionSquares.add(step.slice(2, 4));
    const move = chess.move(parseMove(step));
    if (!move) {
      break;
    }
    const nextWhiteKing = findKingSquare(chess, 'w');
    const nextBlackKing = findKingSquare(chess, 'b');
    if (nextWhiteKing) {
      actionSquares.add(nextWhiteKing);
    }
    if (nextBlackKing) {
      actionSquares.add(nextBlackKing);
    }
  }

  return Array.from(actionSquares);
}

function getDecorationSquares(basePuzzle) {
  const cacheKey = `${basePuzzle.fen}|${basePuzzle.solutionMoves.join(',')}`;
  if (DECORATION_SQUARE_CACHE.has(cacheKey)) {
    return DECORATION_SQUARE_CACHE.get(cacheKey);
  }

  const actionSquares = collectActionSquares(basePuzzle);
  const actionSet = new Set(actionSquares);
  const occupied = new Set(parseSeedPieces(basePuzzle.fen).pieces.map((piece) => piece.square));
  const candidates = [];

  for (let rank = 1; rank <= 8; rank += 1) {
    for (let file = 0; file < 8; file += 1) {
      const square = `${FILES[file]}${rank}`;
      if (occupied.has(square) || actionSet.has(square)) {
        continue;
      }

      const coords = squareToCoords(square);
      let minDistance = Infinity;
      actionSquares.forEach((focusSquare) => {
        const focus = squareToCoords(focusSquare);
        const distance = Math.abs(coords.x - focus.x) + Math.abs(coords.y - focus.y);
        if (distance < minDistance) {
          minDistance = distance;
        }
      });

      if (minDistance < 2) {
        continue;
      }

      candidates.push({
        square,
        minDistance,
        pawnAllowed: rank > 1 && rank < 8
      });
    }
  }

  candidates.sort((left, right) => {
    if (right.minDistance !== left.minDistance) {
      return right.minDistance - left.minDistance;
    }

    return left.square.localeCompare(right.square);
  });

  const limited = candidates.slice(0, 32);
  DECORATION_SQUARE_CACHE.set(cacheKey, limited);
  return limited;
}

function buildVariantLabel(seed) {
  const accent = DECORATION_LABELS[seed % DECORATION_LABELS.length];
  const orbit = String.fromCharCode(65 + (seed % 26));
  const step = (seed % 9) + 1;
  return `${accent} ${orbit}${step}`;
}

function pickAvailableSquare(entries, usedSquares, rng, offset = 0) {
  if (!entries.length) {
    return null;
  }

  const start = Math.floor(rng() * entries.length);
  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[(start + offset + index * 3) % entries.length];
    if (!usedSquares.has(entry.square)) {
      return entry;
    }
  }

  return null;
}

function pickDecorationTemplate(entry, rng, salt = 0) {
  const validTemplates = DECORATION_TEMPLATES.filter((template) => template.type !== 'p' || entry.pawnAllowed);
  if (!validTemplates.length) {
    return null;
  }

  return validTemplates[(Math.floor(rng() * validTemplates.length) + salt) % validTemplates.length];
}

function buildDecoratedPuzzle(basePuzzle, variantSeed, sequenceIndex) {
  const parsed = parseSeedPieces(basePuzzle.fen);
  const basePieces = parsed.pieces.map((piece) => ({ ...piece }));
  const occupiedSquares = new Set(basePieces.map((piece) => piece.square));
  const decorationSquares = getDecorationSquares(basePuzzle);
  const rng = createSeededRng(hashString(`${basePuzzle.id}:${variantSeed}:${sequenceIndex}`));
  const attemptBudget = Math.max(18, decorationSquares.length * 2);

  for (let attempt = 0; attempt < attemptBudget; attempt += 1) {
    const pieces = basePieces.map((piece) => ({ ...piece }));
    const usedSquares = new Set(occupiedSquares);
    const selectedSquares = [];
    const selectedPieces = [];
    const desiredCount = Math.min(
      4,
      1 + ((variantSeed + attempt) % 2) + Math.floor(rng() * 2) + Math.floor(sequenceIndex / 96) % 2
    );

    for (let pick = 0; pick < desiredCount; pick += 1) {
      const entry = pickAvailableSquare(decorationSquares, usedSquares, rng, attempt + pick);
      if (!entry) {
        break;
      }

      const template = pickDecorationTemplate(entry, rng, pick + attempt);
      if (!template) {
        continue;
      }

      usedSquares.add(entry.square);
      selectedSquares.push(entry.square);
      selectedPieces.push(`${template.color}${template.type}`);
      pieces.push({
        square: entry.square,
        type: template.type,
        color: template.color
      });
    }

    if (selectedSquares.length === 0) {
      continue;
    }

    const candidate = {
      ...basePuzzle,
      id: `${basePuzzle.id}--ornament-${variantSeed}-${attempt}-${selectedSquares.join('_')}`,
      title: `${basePuzzle.title} ${buildVariantLabel(hashString(`${variantSeed}:${attempt}`))}`,
      fen: buildFenFromPieces(pieces, parsed.turn),
      generated: true,
      seedId: basePuzzle.seedId || basePuzzle.id,
      decorationSquares: selectedSquares,
      decorationPieces: selectedPieces
    };

    if (candidate.fen !== basePuzzle.fen && isPuzzleCandidateValid(candidate)) {
      return candidate;
    }
  }

  return {
    ...basePuzzle,
    id: `${basePuzzle.id}--cycle-${sequenceIndex}`,
    title: `${basePuzzle.title} ${buildVariantLabel(hashString(`${variantSeed}:fallback`))}`,
    generated: true,
    seedId: basePuzzle.seedId || basePuzzle.id
  };
}

function buildSequenceCandidate(baseCatalog, attemptIndex) {
  const basePuzzle = baseCatalog[attemptIndex % baseCatalog.length];
  const cycle = Math.floor(attemptIndex / baseCatalog.length);

  if (cycle === 0) {
    return {
      ...basePuzzle,
      id: `${basePuzzle.id}--base-${attemptIndex}`,
      generated: true,
      seedId: basePuzzle.seedId || basePuzzle.id
    };
  }

  const variantSeed = cycle * 4099 + attemptIndex;
  return buildDecoratedPuzzle(basePuzzle, variantSeed, attemptIndex);
}

function getGeneratedState(difficulty = 'all') {
  const normalizedDifficulty = normalizePuzzleDifficulty(difficulty);
  if (!GENERATED_SEQUENCE_CACHE.has(normalizedDifficulty)) {
    GENERATED_SEQUENCE_CACHE.set(normalizedDifficulty, {
      puzzles: [],
      signatures: new Set(),
      attemptCursor: 0
    });
  }

  return GENERATED_SEQUENCE_CACHE.get(normalizedDifficulty);
}

function ensureGeneratedSequence(difficulty = 'all', count = 1) {
  const normalizedDifficulty = normalizePuzzleDifficulty(difficulty);
  const targetCount = Math.max(1, normalizeIndex(count - 1) + 1);
  const state = getGeneratedState(normalizedDifficulty);
  const baseCatalog = getBasePuzzleCatalog(normalizedDifficulty);

  if (!baseCatalog.length) {
    return [];
  }

  const attemptLimit = Math.max(360, (targetCount - state.puzzles.length) * 240);
  let attempts = 0;

  while (state.puzzles.length < targetCount && attempts < attemptLimit) {
    const candidate = buildSequenceCandidate(baseCatalog, state.attemptCursor);
    state.attemptCursor += 1;
    attempts += 1;

    const signature = `${candidate.fen}|${candidate.solutionMoves.join(',')}`;
    if (state.signatures.has(signature)) {
      continue;
    }

    if (!isPuzzleCandidateValid(candidate)) {
      continue;
    }

    state.signatures.add(signature);
    state.puzzles.push(candidate);
  }

  return state.puzzles;
}

export function generatePuzzle({
  difficulty = 'all',
  index = 0
} = {}) {
  const normalizedDifficulty = normalizePuzzleDifficulty(difficulty);
  const generationIndex = normalizeIndex(index);
  const sequence = ensureGeneratedSequence(normalizedDifficulty, generationIndex + 1);
  const fallbackCatalog = getBasePuzzleCatalog(normalizedDifficulty);
  const basePuzzle = sequence[generationIndex]
    || fallbackCatalog[generationIndex % fallbackCatalog.length]
    || PUZZLES[0];

  return {
    ...basePuzzle,
    id: `${basePuzzle.id}--${generationIndex}`,
    generated: true,
    sequenceIndex: generationIndex
  };
}

export function generateDailyPuzzle(date = new Date()) {
  const seed = Number(`${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`);
  const difficulty = DAILY_DIFFICULTY_ROTATION[seed % DAILY_DIFFICULTY_ROTATION.length];
  const index = seed % 512;
  const puzzle = generatePuzzle({
    difficulty,
    index
  });

  return {
    puzzle,
    difficulty,
    index
  };
}
