const QUEEN_ID = 'queen-red-1';

function normalizeClassicVariant(value) {
  return value === 'standard' || value === 'strict' ? value : 'casual';
}

function isNormalCoin(piece) {
  return piece?.type === 'coin' && (piece.color === 'white' || piece.color === 'black');
}

export class RulesEngine {
  constructor({ scoreManager, queenManager, foulManager }) {
    this.scoreManager = scoreManager;
    this.queenManager = queenManager;
    this.foulManager = foulManager;
  }

  evaluate(state, currentPlayer, summary) {
    if (state.ruleMode === 'freeCapture') {
      return this.evaluateFreeCapture(state, currentPlayer, summary);
    }
    return this.evaluateClassic(state, currentPlayer, summary, normalizeClassicVariant(state.classicRuleVariant));
  }

  createRuleResult({ state, currentPlayer, summary, foul, ownCoinsPocketed, opponentCoinsPocketed, capturedCoins = [], variant = 'casual' }) {
    return {
      ruleMode: state.ruleMode,
      classicRuleVariant: variant,
      isFoul: foul.isFoul,
      foulType: foul.foulType,
      ownCoinsPocketed,
      opponentCoinsPocketed,
      capturedCoins,
      queenPocketed: summary.queenPocketed,
      queenCovered: false,
      queenReturned: false,
      queenPending: false,
      firstPocketAssignedColor: summary.firstPocketAssignedColor || '',
      dueChanges: [],
      shouldContinueTurn: false,
      shouldSwitchTurn: true,
      winnerPlayerId: null,
      draw: false,
      messages: [],
      piecesToReturn: [],
      currentPlayerId: currentPlayer.id
    };
  }

  evaluateClassic(state, currentPlayer, summary, variant = 'casual') {
    const colorsAssigned = Boolean(currentPlayer.color);
    const ownCoinsPocketed = colorsAssigned
      ? summary.pocketed.filter((piece) => piece.type === 'coin' && piece.color === currentPlayer.color)
      : [];
    const opponentCoinsPocketed = summary.pocketed.filter((piece) => (
      colorsAssigned &&
      isNormalCoin(piece) &&
      piece.color !== currentPlayer.color
    ));
    const ownCoinIds = ownCoinsPocketed.map((piece) => piece.id);
    const foul = this.foulManager.evaluate(summary);
    const result = this.createRuleResult({
      state,
      currentPlayer,
      summary,
      foul,
      ownCoinsPocketed,
      opponentCoinsPocketed,
      variant
    });

    if (opponentCoinsPocketed.length) {
      result.messages.push('Opponent coin pocketed.');
    }

    if (foul.isFoul) {
      return this.resolveClassicFoul(state, currentPlayer, summary, result, ownCoinIds, colorsAssigned, variant);
    }

    if (!colorsAssigned && summary.awaitedFirstPocketAssignment) {
      return this.resolveUnassignedClassicShot(summary, result);
    }

    if (summary.queenReturnedBeforeAssignment) {
      result.queenReturned = true;
      result.piecesToReturn.push({ id: QUEEN_ID, type: 'queen', reason: 'queen-before-first-color-coin' });
      result.messages.push('Pocket a white or black coin first. Queen returned.');
      if (ownCoinsPocketed.length) {
        result.shouldContinueTurn = true;
        result.shouldSwitchTurn = false;
        result.messages.push(`${currentPlayer.name} claims ${currentPlayer.color === 'white' ? 'White' : 'Black'} and continues.`);
      }
      return this.guardUncoveredFinish(state, currentPlayer, result, ownCoinIds, variant);
    }

    if (summary.colorAssignedThisShot) {
      result.messages.push(`${currentPlayer.name} claims ${currentPlayer.color === 'white' ? 'White' : 'Black'}.`);
    }

    const ownBeforeShot = Math.max(0, (currentPlayer.pocketedOwnCoinIds?.length || 0) - ownCoinIds.length);
    const effectiveOwnCoinIds = [...ownCoinIds];
    const effectiveOwnCoinsPocketed = [...ownCoinsPocketed];

    if (variant === 'strict' && this.scoreManager.getDueCount(state, currentPlayer.id) > 0 && effectiveOwnCoinIds.length) {
      this.consumeStrictDue(state, currentPlayer, result, effectiveOwnCoinIds, effectiveOwnCoinsPocketed);
    }

    const pendingForCurrent = state.queen.state === 'pendingCover' && state.queen.pendingCoverPlayerId === currentPlayer.id;

    if (pendingForCurrent) {
      if (effectiveOwnCoinsPocketed.length) {
        result.queenCovered = true;
        result.shouldContinueTurn = true;
        result.shouldSwitchTurn = false;
        result.messages.push('Queen covered.');
      } else {
        result.queenReturned = true;
        result.piecesToReturn.push({ id: QUEEN_ID, type: 'queen', reason: 'cover-missed' });
        result.messages.push('Queen cover missed. Queen returned.');
      }
      return this.guardUncoveredFinish(state, currentPlayer, result, effectiveOwnCoinIds, variant);
    }

    if (summary.queenPocketed) {
      if (variant === 'strict' && ownBeforeShot <= 0) {
        result.queenReturned = true;
        result.piecesToReturn.push({ id: QUEEN_ID, type: 'queen', reason: 'strict-early-queen' });
        result.messages.push('Queen cannot be claimed yet.');
        return result;
      }

      if (effectiveOwnCoinsPocketed.length) {
        result.queenCovered = true;
        result.shouldContinueTurn = true;
        result.shouldSwitchTurn = false;
        result.messages.push('Queen covered.');
      } else {
        result.queenPending = true;
        result.shouldContinueTurn = true;
        result.shouldSwitchTurn = false;
        result.messages.push('Queen needs cover.');
      }
      return this.guardUncoveredFinish(state, currentPlayer, result, effectiveOwnCoinIds, variant);
    }

    if (effectiveOwnCoinsPocketed.length) {
      result.shouldContinueTurn = true;
      result.shouldSwitchTurn = false;
      result.messages.push(`${currentPlayer.name}: +${effectiveOwnCoinsPocketed.length} own coin${effectiveOwnCoinsPocketed.length === 1 ? '' : 's'}. Extra shot.`);
      return this.guardUncoveredFinish(state, currentPlayer, result, effectiveOwnCoinIds, variant);
    }

    if (!summary.pocketedCount) {
      result.messages.push('No coin pocketed. Turn switched.');
    } else if (opponentCoinsPocketed.length) {
      result.messages.push('Turn switched.');
    } else if (result.dueChanges.length) {
      result.messages.push('Penalty recovery does not continue the turn.');
    }

    return this.guardUncoveredFinish(state, currentPlayer, result, effectiveOwnCoinIds, variant);
  }

  resolveClassicFoul(state, currentPlayer, summary, result, ownCoinIds, colorsAssigned, variant) {
    result.messages.push(result.foulType ? this.foulManager.evaluate(summary).message : 'Foul.');
    const penaltyCoinId = this.scoreManager.selectPenaltyCoin(state, currentPlayer.id, ownCoinIds);
    if (penaltyCoinId) {
      result.piecesToReturn.push({ id: penaltyCoinId, type: 'coin', reason: 'striker-foul-penalty' });
      result.messages.push('Penalty coin returned.');
    } else if (variant === 'strict') {
      result.dueChanges.push({ playerId: currentPlayer.id, delta: 1, reason: 'striker-foul-due' });
      result.messages.push('Due recorded.');
    }

    if (!colorsAssigned && summary.awaitedFirstPocketAssignment) {
      summary.pocketed
        .filter(isNormalCoin)
        .forEach((piece) => result.piecesToReturn.push({
          id: piece.id,
          type: 'coin',
          color: piece.color,
          reason: 'unassigned-foul-return'
        }));
      if (result.piecesToReturn.some((piece) => piece.reason === 'unassigned-foul-return')) {
        result.messages.push('Coin returned. First pocket still decides color.');
      }
    }

    if (summary.queenPocketed || state.queen.state === 'pendingCover') {
      result.queenReturned = true;
      result.piecesToReturn.push({ id: QUEEN_ID, type: 'queen', reason: 'foul-queen-return' });
      result.messages.push('Queen returned.');
    }
    return result;
  }

  resolveUnassignedClassicShot(summary, result) {
    if (summary.queenPocketed) {
      result.queenReturned = true;
      result.piecesToReturn.push({ id: QUEEN_ID, type: 'queen', reason: 'queen-before-color-assignment' });
      result.messages.push('Pocket a white or black coin first. Queen returned.');
      return result;
    }

    result.messages.push('First pocket decides color.');
    return result;
  }

  consumeStrictDue(state, currentPlayer, result, effectiveOwnCoinIds, effectiveOwnCoinsPocketed) {
    const dueCoinId = this.scoreManager.selectPenaltyCoin(state, currentPlayer.id, effectiveOwnCoinIds) || effectiveOwnCoinIds[effectiveOwnCoinIds.length - 1];
    if (!dueCoinId) {
      return;
    }

    result.piecesToReturn.push({ id: dueCoinId, type: 'coin', reason: 'strict-due-recovery' });
    result.dueChanges.push({ playerId: currentPlayer.id, delta: -1, reason: 'strict-due-recovered' });
    result.messages.push('Due cleared: coin returned.');

    const idIndex = effectiveOwnCoinIds.indexOf(dueCoinId);
    if (idIndex >= 0) {
      effectiveOwnCoinIds.splice(idIndex, 1);
    }

    const coinIndex = effectiveOwnCoinsPocketed.findIndex((piece) => piece.id === dueCoinId);
    if (coinIndex >= 0) {
      effectiveOwnCoinsPocketed.splice(coinIndex, 1);
    }
  }

  evaluateFreeCapture(state, currentPlayer, summary) {
    const normalCoinsPocketed = summary.pocketed.filter(isNormalCoin);
    const normalCoinIds = normalCoinsPocketed.map((piece) => piece.id);
    const foul = this.foulManager.evaluate(summary);
    const result = this.createRuleResult({
      state,
      currentPlayer,
      summary,
      foul,
      ownCoinsPocketed: normalCoinsPocketed,
      opponentCoinsPocketed: [],
      capturedCoins: normalCoinsPocketed,
      variant: ''
    });

    if (foul.isFoul) {
      result.messages.push(foul.message);
      const penaltyCoinId = this.scoreManager.selectPenaltyCoin(state, currentPlayer.id, normalCoinIds);
      if (penaltyCoinId) {
        result.piecesToReturn.push({ id: penaltyCoinId, type: 'coin', reason: 'free-capture-striker-foul-penalty' });
        result.messages.push('Penalty captured coin returned.');
      }

      if (summary.queenPocketed || state.queen.state === 'pendingCover') {
        result.queenReturned = true;
        result.piecesToReturn.push({ id: QUEEN_ID, type: 'queen', reason: 'foul-queen-return' });
        result.messages.push('Queen returned.');
      }
      return result;
    }

    const pendingForCurrent = state.queen.state === 'pendingCover' && state.queen.pendingCoverPlayerId === currentPlayer.id;

    if (pendingForCurrent) {
      if (normalCoinsPocketed.length) {
        result.queenCovered = true;
        result.shouldContinueTurn = true;
        result.shouldSwitchTurn = false;
        result.messages.push('Queen covered. +3 bonus.');
      } else {
        result.queenReturned = true;
        result.piecesToReturn.push({ id: QUEEN_ID, type: 'queen', reason: 'cover-missed' });
        result.messages.push('Queen cover missed. Queen returned.');
      }
      return result;
    }

    if (summary.queenPocketed) {
      if (normalCoinsPocketed.length) {
        result.queenCovered = true;
        result.shouldContinueTurn = true;
        result.shouldSwitchTurn = false;
        result.messages.push('Queen covered. +3 bonus.');
      } else {
        result.queenPending = true;
        result.shouldContinueTurn = true;
        result.shouldSwitchTurn = false;
        result.messages.push('Queen needs cover.');
      }
      return result;
    }

    if (normalCoinsPocketed.length) {
      result.shouldContinueTurn = true;
      result.shouldSwitchTurn = false;
      result.messages.push(`Free Capture: +${normalCoinsPocketed.length} point${normalCoinsPocketed.length === 1 ? '' : 's'}. Extra shot.`);
      return result;
    }

    result.messages.push('No coin captured. Turn switched.');
    return result;
  }

  guardUncoveredFinish(state, currentPlayer, result, ownCoinIds, variant = 'casual') {
    const queenWillBeCovered = result.queenCovered || this.queenManager.isCovered(state);
    if (queenWillBeCovered || !this.scoreManager.hasAllOwnCoins(state, currentPlayer.id)) {
      return result;
    }

    const alreadyReturning = new Set(result.piecesToReturn.map((piece) => piece.id));
    const returnCoinId = this.scoreManager.selectPenaltyCoin(state, currentPlayer.id, ownCoinIds);
    if (returnCoinId && !alreadyReturning.has(returnCoinId)) {
      result.piecesToReturn.push({
        id: returnCoinId,
        type: 'coin',
        reason: variant === 'strict' ? 'strict-final-coin-before-queen' : 'queen-not-covered-finish-guard'
      });
    }

    result.shouldContinueTurn = false;
    result.shouldSwitchTurn = true;
    result.messages.push(
      variant === 'strict'
        ? 'Strict: cover queen before final coin.'
        : 'Cover queen to finish. Last coin returned.'
    );

    return result;
  }
}
