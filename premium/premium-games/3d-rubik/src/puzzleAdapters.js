import {
  applyMoveToState,
  cloneCubeState,
  createSolvedCube,
  generateScramble,
  getAllPlayableMoves,
  getCubeSignature,
  getLayerCubies,
  inverseMove,
  isSolved,
  parseMove,
  resetCubeState
} from "./cubeState.js";
import { CubeRenderer } from "./cubeRenderer.js";
import {
  applyPyraminxMoveToState,
  clonePyraminxState,
  createSolvedPyraminx,
  generatePyraminxScramble,
  getAllPyraminxMoves,
  getPyraminxMovePieces,
  getPyraminxSignature,
  inversePyraminxMove,
  isPyraminxSolved,
  parsePyraminxMove,
  resetPyraminxState
} from "./pyraminxState.js";
import { PyraminxRenderer } from "./pyraminxRenderer.js";
import {
  applySkewbMoveToState,
  cloneSkewbState,
  createSolvedSkewb,
  generateSkewbScramble,
  getAllSkewbMoves,
  getSkewbMovePieces,
  getSkewbSignature,
  inverseSkewbMove,
  isSkewbSolved,
  parseSkewbMove,
  resetSkewbState
} from "./skewbState.js";
import { SkewbRenderer } from "./skewbRenderer.js";
import {
  applyMirrorCubeMoveToState,
  cloneMirrorCubeState,
  createSolvedMirrorCube,
  generateMirrorCubeScramble,
  getAllMirrorCubeMoves,
  getMirrorCubeMovePieces,
  getMirrorCubeSignature,
  inverseMirrorCubeMove,
  isMirrorCubeSolved,
  parseMirrorCubeMove,
  resetMirrorCubeState
} from "./mirrorCubeState.js";
import { MirrorCubeRenderer } from "./mirrorCubeRenderer.js";
import {
  applyMegaminxMoveToState,
  cloneMegaminxState,
  createSolvedMegaminx,
  generateMegaminxScramble,
  getAllMegaminxMoves,
  getMegaminxMovePieces,
  getMegaminxSignature,
  inverseMegaminxMove,
  isMegaminxSolved,
  parseMegaminxMove,
  resetMegaminxState
} from "./megaminxState.js";
import { MegaminxRenderer } from "./megaminxRenderer.js";

export const PUZZLE_TYPES = [
  {
    id: "cube",
    title: "Cube",
    badge: "2x2 to 7x7",
    description: "Classic Rubik-style cube puzzles with guides, missions, sizes, and skins.",
    compatibility: "Free Solve · Timed · Guide · Missions",
    defaultSkin: "premiumSpeedcube"
  },
  {
    id: "pyraminx",
    title: "Pyraminx",
    badge: "Pyramid twist puzzle",
    description: "Fast, stylish, beginner-friendly tetrahedron puzzle with main and tip turns.",
    compatibility: "Free Solve · Timed · Basic Guide",
    defaultSkin: "ivoryPyraminx"
  },
  {
    id: "skewb",
    title: "Skewb",
    badge: "Corner-turning cube",
    description: "Fast, unusual, stylish cube puzzle with diagonal corner turns.",
    compatibility: "Free Solve · Timed · Basic Guide",
    defaultSkin: "ivorySkewb"
  },
  {
    id: "mirrorCube",
    title: "Mirror Cube",
    badge: "Shape-shifting 3x3",
    description: "A premium block puzzle solved by shape rather than sticker color.",
    compatibility: "Free Solve · Timed · Basic Guide",
    defaultSkin: "ivoryMirror"
  },
  {
    id: "megaminx",
    title: "Megaminx",
    badge: "12-face dodecahedron",
    description: "A premium final-boss twist puzzle with twelve pentagonal faces.",
    compatibility: "Free Solve · Timed · Basic Guide · Weekly",
    defaultSkin: "ivoryMegaminx"
  }
];

export const CUBE_SKINS = [
  ["premiumSpeedcube", "Ivory Speedcube"],
  ["classicStickered", "Classic"],
  ["ivoryRoyale", "Ivory Royale"],
  ["glassPrism", "Glass Prism"],
  ["darkNeon", "Dark Neon"],
  ["woodenPuzzle", "Wooden Puzzle"]
];

export const PYRAMINX_SKINS = [
  ["ivoryPyraminx", "Ivory Pyraminx"],
  ["classicPyraminx", "Classic Pyraminx"],
  ["glassPyraminx", "Glass Pyraminx"],
  ["darkPyraminx", "Dark Pyraminx"]
];

export const SKEWB_SKINS = [
  ["ivorySkewb", "Ivory Skewb"],
  ["classicSkewb", "Classic Skewb"],
  ["glassSkewb", "Glass Skewb"],
  ["darkSkewb", "Dark Skewb"]
];

export const MIRROR_CUBE_SKINS = [
  ["ivoryMirror", "Ivory Mirror"],
  ["goldenMirror", "Golden Mirror"],
  ["silverMirror", "Classic Silver Mirror"],
  ["darkMirror", "Dark Mirror"]
];

export const MEGAMINX_SKINS = [
  ["ivoryMegaminx", "Ivory Megaminx"],
  ["classicMegaminx", "Classic Megaminx"],
  ["glassMegaminx", "Glass Megaminx"],
  ["darkMegaminx", "Dark Megaminx"],
  ["goldenArtifact", "Golden Artifact"]
];

export function getPuzzleType(typeId = "cube") {
  return PUZZLE_TYPES.find((type) => type.id === typeId) || PUZZLE_TYPES[0];
}

function normalizePuzzleType(typeId = "cube") {
  return getPuzzleType(typeId).id;
}

const cubeAdapter = {
  id: "cube",
  label: "Cube",
  defaultSkin: "premiumSpeedcube",
  skinOptions: CUBE_SKINS,
  createState: ({ size = 3 } = {}) => createSolvedCube(size),
  createSolvedState: ({ size = 3 } = {}) => createSolvedCube(size),
  cloneState: cloneCubeState,
  getSignature: getCubeSignature,
  restoreState: (state, snapshot) => {
    state.size = snapshot.size;
    state.cubies.splice(0, state.cubies.length, ...cloneCubeState(snapshot).cubies);
  },
  resetState: (state, { size = state.size || 3 } = {}) => resetCubeState(state, size),
  parseMove: (notation, state, options = {}) => parseMove(notation, state.size || 3, options.layerIndex),
  inverseMove: (notation, state, options = {}) => inverseMove(notation, state.size || 3, options.layerIndex),
  applyMove: (state, move) => applyMoveToState(state, move),
  getMovePieces: (state, move) => getLayerCubies(state, move),
  generateScramble: (state) => generateScramble(state.size || 3),
  isSolved,
  getPlayableMoves: (state, layerIndex) => getAllPlayableMoves(state.size || 3, layerIndex),
  createRenderer: (container, state) => new CubeRenderer(container, state),
  getStatsId: (state) => String(state.size || 3),
  getLabel: (state) => `${state.size}x${state.size} Cube`,
  supportsSize: true
};

const pyraminxAdapter = {
  id: "pyraminx",
  label: "Pyraminx",
  defaultSkin: "ivoryPyraminx",
  skinOptions: PYRAMINX_SKINS,
  createState: () => createSolvedPyraminx(),
  createSolvedState: () => createSolvedPyraminx(),
  cloneState: clonePyraminxState,
  getSignature: getPyraminxSignature,
  restoreState: (state, snapshot) => {
    const clone = clonePyraminxState(snapshot);
    state.puzzleType = "pyraminx";
    state.size = "pyraminx";
    state.slots = [...clone.slots];
    state.moveVersion = clone.moveVersion;
    state.pieces.splice(0, state.pieces.length, ...clone.pieces);
  },
  resetState: (state) => resetPyraminxState(state),
  parseMove: (notation) => parsePyraminxMove(notation),
  inverseMove: (notation) => inversePyraminxMove(notation),
  applyMove: (state, move) => applyPyraminxMoveToState(state, move),
  getMovePieces: (state, move) => getPyraminxMovePieces(state, move),
  generateScramble: (_state, settings = {}) => generatePyraminxScramble({ includeTips: settings.includePyraminxTips !== false }),
  isSolved: isPyraminxSolved,
  getPlayableMoves: () => getAllPyraminxMoves().map(parsePyraminxMove),
  createRenderer: (container, state) => new PyraminxRenderer(container, state),
  getStatsId: () => "pyraminx",
  getLabel: () => "Pyraminx",
  supportsSize: false
};

const skewbAdapter = {
  id: "skewb",
  label: "Skewb",
  defaultSkin: "ivorySkewb",
  skinOptions: SKEWB_SKINS,
  createState: () => createSolvedSkewb(),
  createSolvedState: () => createSolvedSkewb(),
  cloneState: cloneSkewbState,
  getSignature: getSkewbSignature,
  restoreState: (state, snapshot) => {
    const clone = cloneSkewbState(snapshot);
    state.puzzleType = "skewb";
    state.size = "skewb";
    state.slots = [...clone.slots];
    state.moveVersion = clone.moveVersion;
    state.pieces.splice(0, state.pieces.length, ...clone.pieces);
  },
  resetState: (state) => resetSkewbState(state),
  parseMove: (notation) => parseSkewbMove(notation),
  inverseMove: (notation) => inverseSkewbMove(notation),
  applyMove: (state, move) => applySkewbMoveToState(state, move),
  getMovePieces: (state, move) => getSkewbMovePieces(state, move),
  generateScramble: () => generateSkewbScramble(),
  isSolved: isSkewbSolved,
  getPlayableMoves: () => getAllSkewbMoves().map(parseSkewbMove),
  createRenderer: (container, state) => new SkewbRenderer(container, state),
  getStatsId: () => "skewb",
  getLabel: () => "Skewb",
  supportsSize: false
};

const mirrorCubeAdapter = {
  id: "mirrorCube",
  label: "Mirror Cube",
  defaultSkin: "ivoryMirror",
  skinOptions: MIRROR_CUBE_SKINS,
  createState: () => createSolvedMirrorCube(),
  createSolvedState: () => createSolvedMirrorCube(),
  cloneState: cloneMirrorCubeState,
  getSignature: getMirrorCubeSignature,
  restoreState: (state, snapshot) => {
    const clone = cloneMirrorCubeState(snapshot);
    state.puzzleType = "mirrorCube";
    state.size = "mirrorCube";
    state.moveVersion = clone.moveVersion;
    state.cubies.splice(0, state.cubies.length, ...clone.cubies);
  },
  resetState: (state) => resetMirrorCubeState(state),
  parseMove: (notation) => parseMirrorCubeMove(notation),
  inverseMove: (notation) => inverseMirrorCubeMove(notation),
  applyMove: (state, move) => applyMirrorCubeMoveToState(state, move),
  getMovePieces: (state, move) => getMirrorCubeMovePieces(state, move),
  generateScramble: () => generateMirrorCubeScramble(),
  isSolved: isMirrorCubeSolved,
  getPlayableMoves: () => getAllMirrorCubeMoves().map(parseMirrorCubeMove),
  createRenderer: (container, state) => new MirrorCubeRenderer(container, state),
  getStatsId: () => "mirrorCube",
  getLabel: () => "Mirror Cube",
  supportsSize: false
};

const megaminxAdapter = {
  id: "megaminx",
  label: "Megaminx",
  defaultSkin: "ivoryMegaminx",
  skinOptions: MEGAMINX_SKINS,
  createState: () => createSolvedMegaminx(),
  createSolvedState: () => createSolvedMegaminx(),
  cloneState: cloneMegaminxState,
  getSignature: getMegaminxSignature,
  restoreState: (state, snapshot) => {
    const clone = cloneMegaminxState(snapshot);
    state.puzzleType = "megaminx";
    state.size = "megaminx";
    state.faces = [...clone.faces];
    state.slots = [...clone.slots];
    state.moveVersion = clone.moveVersion;
    state.pieces.splice(0, state.pieces.length, ...clone.pieces);
  },
  resetState: (state) => resetMegaminxState(state),
  parseMove: (notation) => parseMegaminxMove(notation),
  inverseMove: (notation) => inverseMegaminxMove(notation),
  applyMove: (state, move) => applyMegaminxMoveToState(state, move),
  getMovePieces: (state, move) => getMegaminxMovePieces(state, move),
  generateScramble: () => generateMegaminxScramble(),
  isSolved: isMegaminxSolved,
  getPlayableMoves: () => getAllMegaminxMoves().map(parseMegaminxMove),
  createRenderer: (container, state) => new MegaminxRenderer(container, state),
  getStatsId: () => "megaminx",
  getLabel: () => "Megaminx",
  supportsSize: false
};

export const PUZZLE_ADAPTERS = {
  cube: cubeAdapter,
  pyraminx: pyraminxAdapter,
  skewb: skewbAdapter,
  mirrorCube: mirrorCubeAdapter,
  megaminx: megaminxAdapter
};

export function getPuzzleAdapter(typeId = "cube") {
  return PUZZLE_ADAPTERS[normalizePuzzleType(typeId)];
}

export function getSkinOptions(typeId = "cube") {
  return getPuzzleAdapter(typeId).skinOptions;
}

export function normalizeSkinForPuzzle(typeId = "cube", skinId = "") {
  const adapter = getPuzzleAdapter(typeId);
  const available = new Set(adapter.skinOptions.map(([id]) => id));
  return available.has(skinId) ? skinId : adapter.defaultSkin;
}
