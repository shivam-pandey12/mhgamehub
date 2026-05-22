function toDisplay(move) {
  if (!move) return "";
  if (typeof move === "string") return move;
  return move.display || move.notation || String(move.face || move.vertex || "");
}

export function getKnownPathRecovery(adapter, state, scramble = [], moveHistory = []) {
  const userMoves = moveHistory
    .map((entry) => entry.move || entry.notation || entry.display || entry)
    .reverse()
    .map((move) => adapter.inverseMove(move, state));
  const scrambleMoves = scramble
    .slice()
    .reverse()
    .map((move) => adapter.inverseMove(move, state));

  return [...userMoves, ...scrambleMoves].map(toDisplay);
}

export function simulateSequence(adapter, state, sequence = []) {
  const clone = adapter.cloneState(state);
  sequence.forEach((notation) => {
    adapter.applyMove(clone, notation);
  });
  return {
    state: clone,
    signature: adapter.getSignature(clone),
    solved: adapter.isSolved(clone)
  };
}

export function createSolutionSections(adapter, state, scramble = [], moveHistory = []) {
  const moves = getKnownPathRecovery(adapter, state, scramble, moveHistory);
  return [
    {
      id: "recovery",
      title: "Recovery Path",
      description: "Guaranteed from the tracked legal scramble and your recorded moves.",
      moves
    }
  ];
}
