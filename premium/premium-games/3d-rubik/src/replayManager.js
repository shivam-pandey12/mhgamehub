function moveDisplay(move) {
  if (!move) return "";
  if (typeof move === "string") return move;
  return move.display || move.notation || String(move.face || move.vertex || "");
}

export function serializeMoveHistory(history = []) {
  return history.map((entry, index) => ({
    index,
    move: entry.move,
    notation: moveDisplay(entry.move),
    display: moveDisplay(entry.move),
    source: entry.source || "move",
    atMs: Math.max(0, Number(entry.atMs || 0))
  }));
}

export function createReplaySession({
  puzzleType = "cube",
  size = 3,
  mode = "free",
  scramble = [],
  moves = [],
  elapsedMs = 0,
  moveCount = moves.length,
  completedAt = new Date().toISOString()
} = {}) {
  return {
    id: `solve-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    puzzleType,
    size,
    mode,
    scramble: [...scramble],
    moves: serializeMoveHistory(moves),
    timestamps: moves.map((entry) => Math.max(0, Number(entry.atMs || 0))),
    elapsedMs: Math.max(0, Math.round(elapsedMs)),
    moveCount,
    completedAt
  };
}

export function getReplayMoveNotations(session = {}) {
  return (session.moves || []).map((entry) => entry.notation || entry.display).filter(Boolean);
}

export function buildReplayState(adapter, session, index = 0, options = {}) {
  const state = adapter.createSolvedState({ size: session.size, ...options });
  (session.scramble || []).forEach((move) => adapter.applyMove(state, move));
  getReplayMoveNotations(session)
    .slice(0, Math.max(0, index))
    .forEach((move) => adapter.applyMove(state, move));
  return state;
}

export function getReplayStatus(session = {}, index = 0, isPlaying = false, speed = 1) {
  const total = (session.moves || []).length;
  const current = index > 0 ? session.moves[index - 1] : null;
  const next = index < total ? session.moves[index] : null;
  const label = session.puzzleType === "pyraminx"
    ? "Pyraminx"
    : session.puzzleType === "skewb"
      ? "Skewb"
      : session.puzzleType === "mirrorCube"
        ? "Mirror Cube"
        : session.puzzleType === "megaminx"
          ? "Megaminx"
          : `${session.size || 3}x${session.size || 3}`;
  const timestamp = current?.atMs || session.timestamps?.[Math.max(0, index - 1)] || 0;
  return {
    active: Boolean(session.id),
    index,
    total,
    currentMove: current?.display || current?.notation || "Start",
    nextMove: next?.display || next?.notation || "",
    puzzleLabel: label,
    timeMarkerMs: Math.max(0, Number(timestamp || 0)),
    isPlaying,
    speed
  };
}
