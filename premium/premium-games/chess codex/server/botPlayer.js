const BOT_NAMES = [
  'Ivory Bot',
  'Midnight Bot',
  'Knight Engine',
  'Golden Bishop',
  'Checkmate Rookie'
];

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function createBotPlayer() {
  return {
    name: randomItem(BOT_NAMES),
    type: 'server-bot'
  };
}

export function getBotMoveDelayMs() {
  return 500 + Math.floor(Math.random() * 1000);
}

function scoreBotMove(move) {
  let score = 1;
  if (move.captured || move.flags?.includes('c') || move.flags?.includes('e')) {
    score += 7;
  }
  if (move.san?.includes('+')) {
    score += 5;
  }
  if (move.san?.includes('#')) {
    score += 40;
  }
  if (move.promotion) {
    score += 9;
  }
  if (move.san?.includes('O-O')) {
    score += 2;
  }
  return score;
}

export function chooseBotMove(chess) {
  const legalMoves = chess.moves({ verbose: true });
  if (legalMoves.length === 0) {
    return null;
  }

  const scoredMoves = legalMoves
    .map((move) => ({
      move,
      score: scoreBotMove(move) + Math.random() * 2
    }))
    .sort((a, b) => b.score - a.score);

  const bestBucket = scoredMoves.slice(0, Math.min(scoredMoves.length, 4));
  const selected = randomItem(bestBucket).move;
  return {
    from: selected.from,
    to: selected.to,
    promotion: selected.promotion || undefined
  };
}

export function shouldBotAcceptDraw(chess) {
  if (chess.isDraw()) {
    return true;
  }

  const materialValues = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 0
  };

  const materialBalance = chess.board().flat().reduce((total, piece) => {
    if (!piece) {
      return total;
    }
    const value = materialValues[piece.type] || 0;
    return total + (piece.color === 'w' ? value : -value);
  }, 0);

  return Math.abs(materialBalance) <= 1 && chess.history().length >= 20;
}
