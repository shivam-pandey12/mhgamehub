export const SEATS = ["A", "B"];
export const HAND_INDEXES = [0, 1];

export function getOpponentSeat(seat) {
  return seat === "A" ? "B" : "A";
}

export function createInitialMatchState({ status = "playing" } = {}) {
  return {
    hands: {
      A: [1, 1],
      B: [1, 1]
    },
    turn: "A",
    winner: null,
    status,
    sequence: 0,
    lastAction: null,
    reactions: {
      A: null,
      B: null
    }
  };
}

export function cloneHands(hands) {
  return {
    A: [...hands.A],
    B: [...hands.B]
  };
}

export function normalizeHandValue(value) {
  return value >= 5 ? 0 : value;
}

export function isSeatDefeated(match, seat) {
  const [left, right] = match.hands[seat];
  return left === 0 && right === 0;
}

export function getValidSplitOptions(currentHands) {
  if (!currentHands) {
    return [];
  }

  const total = currentHands[0] + currentHands[1];
  const options = [];

  for (let left = 0; left <= 4; left += 1) {
    for (let right = 0; right <= 4; right += 1) {
      if (left + right !== total) {
        continue;
      }

      if (left === currentHands[0] && right === currentHands[1]) {
        continue;
      }

      options.push([left, right]);
    }
  }

  return options.sort((a, b) => {
    const balanceDelta = Math.abs(a[0] - a[1]) - Math.abs(b[0] - b[1]);
    if (balanceDelta !== 0) {
      return balanceDelta;
    }

    return b[0] - a[0];
  });
}

export function listLegalMoves(match, seat) {
  if (!match || match.turn !== seat || match.status !== "playing" || match.winner) {
    return [];
  }

  const opponentSeat = getOpponentSeat(seat);
  const moves = [];

  for (const from of HAND_INDEXES) {
    const attackerCount = match.hands[seat][from];
    if (attackerCount === 0) {
      continue;
    }

    for (const to of HAND_INDEXES) {
      const targetCount = match.hands[opponentSeat][to];
      if (targetCount === 0) {
        continue;
      }

      moves.push({
        type: "attack",
        from,
        to
      });
    }
  }

  for (const hands of getValidSplitOptions(match.hands[seat])) {
    moves.push({
      type: "split",
      hands
    });
  }

  return moves;
}

export function applyReaction(match, seat, emoji) {
  return {
    ...match,
    reactions: {
      ...match.reactions,
      [seat]: {
        emoji,
        at: Date.now(),
        id: `${seat}-${Date.now()}`
      }
    }
  };
}

export function applyMove(match, seat, move) {
  if (!match) {
    return {
      ok: false,
      error: "No active round."
    };
  }

  if (match.status !== "playing") {
    return {
      ok: false,
      error: "The round is not active yet."
    };
  }

  if (match.winner) {
    return {
      ok: false,
      error: "This round has already finished."
    };
  }

  if (match.turn !== seat) {
    return {
      ok: false,
      error: "It is not your turn."
    };
  }

  const next = {
    ...match,
    hands: cloneHands(match.hands),
    reactions: {
      ...match.reactions
    }
  };
  const opponentSeat = getOpponentSeat(seat);
  const actionId = (match.sequence ?? 0) + 1;

  if (move?.type === "attack") {
    const from = Number(move.from);
    const to = Number(move.to);

    if (!HAND_INDEXES.includes(from) || !HAND_INDEXES.includes(to)) {
      return {
        ok: false,
        error: "Choose a valid hand to attack."
      };
    }

    const attackerCount = match.hands[seat][from];
    const targetCount = match.hands[opponentSeat][to];

    if (attackerCount === 0) {
      return {
        ok: false,
        error: "Dead hands cannot attack."
      };
    }

    if (targetCount === 0) {
      return {
        ok: false,
        error: "That hand is already dead."
      };
    }

    next.hands[opponentSeat][to] = normalizeHandValue(targetCount + attackerCount);
    next.sequence = actionId;
    next.lastAction = {
      id: actionId,
      type: "attack",
      seat,
      from,
      to,
      targetSeat: opponentSeat,
      attackerCount,
      at: Date.now()
    };

    if (isSeatDefeated(next, opponentSeat)) {
      next.winner = seat;
      next.status = "finished";
    } else {
      next.turn = opponentSeat;
    }

    return {
      ok: true,
      match: next
    };
  }

  if (move?.type === "split") {
    const currentHands = match.hands[seat];
    const proposedHands = Array.isArray(move.hands)
      ? [Number(move.hands[0]), Number(move.hands[1])]
      : [NaN, NaN];
    const isValidValue = proposedHands.every(
      (value) => Number.isInteger(value) && value >= 0 && value <= 4
    );

    if (!isValidValue) {
      return {
        ok: false,
        error: "Split hands must stay between 0 and 4."
      };
    }

    if (currentHands[0] + currentHands[1] !== proposedHands[0] + proposedHands[1]) {
      return {
        ok: false,
        error: "A split must preserve your total fingers."
      };
    }

    if (currentHands[0] === proposedHands[0] && currentHands[1] === proposedHands[1]) {
      return {
        ok: false,
        error: "That split does not change anything."
      };
    }

    next.hands[seat] = proposedHands;
    next.sequence = actionId;
    next.lastAction = {
      id: actionId,
      type: "split",
      seat,
      hands: proposedHands,
      at: Date.now()
    };
    next.turn = opponentSeat;

    return {
      ok: true,
      match: next
    };
  }

  return {
    ok: false,
    error: "Unknown move type."
  };
}
