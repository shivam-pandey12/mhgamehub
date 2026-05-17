import {
  applyMove,
  getOpponentSeat,
  listLegalMoves
} from "../shared/rules";

function scoreMatch(match, seat) {
  const opponent = getOpponentSeat(seat);
  const ownHands = match.hands[seat];
  const opponentHands = match.hands[opponent];
  const ownAlive = ownHands.filter((value) => value > 0).length;
  const opponentAlive = opponentHands.filter((value) => value > 0).length;
  const ownTotal = ownHands[0] + ownHands[1];
  const opponentTotal = opponentHands[0] + opponentHands[1];

  if (match.winner === seat) {
    return 10_000;
  }

  if (match.winner === opponent) {
    return -10_000;
  }

  let score = 0;
  score += (ownAlive - opponentAlive) * 70;
  score += (ownTotal - opponentTotal) * 12;
  score += ownHands.some((value) => value === 0) ? -18 : 16;
  score += opponentHands.some((value) => value === 0) ? 22 : 0;

  return score;
}

function scoreMove(match, seat, move) {
  const next = applyMove(match, seat, move);
  if (!next.ok) {
    return Number.NEGATIVE_INFINITY;
  }

  const opponent = getOpponentSeat(seat);
  let score = scoreMatch(next.match, seat);

  const opponentMoves = listLegalMoves(next.match, opponent);
  for (const opponentMove of opponentMoves) {
    const reply = applyMove(next.match, opponent, opponentMove);
    if (reply.ok && reply.match.winner === opponent) {
      score -= 400;
    }
  }

  if (move.type === "split") {
    const proposed = move.hands;
    score += proposed[0] !== proposed[1] ? 8 : 18;
  }

  if (move.type === "attack" && next.match.hands[opponent][move.to] === 0) {
    score += 55;
  }

  return score;
}

export function chooseAiMove(match, seat = "B") {
  const legalMoves = listLegalMoves(match, seat);
  if (legalMoves.length === 0) {
    return null;
  }

  const rankedMoves = legalMoves
    .map((move) => ({
      move,
      score: scoreMove(match, seat, move)
    }))
    .sort((a, b) => b.score - a.score);

  const topScore = rankedMoves[0].score;
  const finalists = rankedMoves.filter((entry) => topScore - entry.score < 18);
  const choice = finalists[Math.floor(Math.random() * finalists.length)];

  return choice.move;
}
