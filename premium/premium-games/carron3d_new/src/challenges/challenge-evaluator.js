const QUEEN_ID = 'queen-red-1';

function calculateStars(challenge, shotsUsed, { foul = false } = {}) {
  if (foul && challenge.failOnStriker) {
    return 0;
  }
  if (shotsUsed <= (challenge.idealShots || 1)) {
    return 3;
  }
  if (shotsUsed <= challenge.shotLimit) {
    return 2;
  }
  return 1;
}

export class ChallengeEvaluator {
  createTracker(challenge) {
    return {
      challengeId: challenge.id,
      shotsUsed: 0,
      pocketedIds: new Set(),
      queenPocketed: false,
      coverPocketed: false,
      strikerPocketed: false,
      completed: false,
      failed: false,
      stars: 0,
      message: challenge.objectiveText
    };
  }

  recordPocketed(tracker, piece) {
    if (!tracker || !piece?.id) {
      return tracker;
    }
    tracker.pocketedIds.add(piece.id);
    if (piece.type === 'queen' || piece.id === QUEEN_ID) {
      tracker.queenPocketed = true;
    }
    if (piece.type === 'striker') {
      tracker.strikerPocketed = true;
    }
    return tracker;
  }

  evaluate(challenge, tracker, summary = {}) {
    const pocketedIds = new Set([
      ...tracker.pocketedIds,
      ...(summary.pocketed || []).map((piece) => piece.id)
    ]);
    const strikerPocketed = tracker.strikerPocketed || Boolean(summary.strikerPocketed);
    const normalPocketed = (summary.pocketed || []).filter((piece) => piece.type === 'coin').length;
    let completed = false;
    let failed = false;
    let message = '';

    if (challenge.failOnStriker && strikerPocketed) {
      failed = true;
      message = 'Challenge failed: striker pocketed.';
    } else if (challenge.type === 'cleanBreak') {
      completed = normalPocketed > 0 || [...pocketedIds].some((id) => id.includes('-coin-'));
      failed = !completed && tracker.shotsUsed >= challenge.shotLimit;
      message = completed
        ? 'Clean break complete.'
        : 'No coin from the break. Retry the challenge.';
    } else if (challenge.type === 'queenCover') {
      const coverId = challenge.coverPieceId;
      completed = pocketedIds.has(QUEEN_ID) && Boolean(coverId && pocketedIds.has(coverId));
      failed = !completed && tracker.shotsUsed >= challenge.shotLimit;
      message = completed
        ? 'Queen covered. Challenge complete.'
        : pocketedIds.has(QUEEN_ID)
          ? 'Queen pocketed. Cover it with the normal coin.'
          : 'Pocket the queen, then cover it.';
    } else {
      completed = (challenge.boardSetup.targetPieceIds || []).some((id) => pocketedIds.has(id));
      failed = !completed && tracker.shotsUsed >= challenge.shotLimit;
      message = completed
        ? 'Target pocketed. Challenge complete.'
        : 'Target still on the board. Try again.';
    }

    const stars = completed ? calculateStars(challenge, tracker.shotsUsed, { foul: strikerPocketed }) : 0;
    tracker.pocketedIds = pocketedIds;
    tracker.strikerPocketed = strikerPocketed;
    tracker.queenPocketed = pocketedIds.has(QUEEN_ID);
    tracker.coverPocketed = Boolean(challenge.coverPieceId && pocketedIds.has(challenge.coverPieceId));
    tracker.completed = completed;
    tracker.failed = failed;
    tracker.stars = stars;
    tracker.message = message;
    return {
      completed,
      failed,
      stars,
      message,
      shotsUsed: tracker.shotsUsed,
      pocketedIds: [...pocketedIds]
    };
  }
}
