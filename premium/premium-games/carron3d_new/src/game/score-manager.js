export const COINS_PER_PLAYER = 9;
export const TOTAL_NORMAL_COINS = COINS_PER_PLAYER * 2;
export const POINTS_PER_COIN = 1;
export const QUEEN_COVER_BONUS = 3;

export class ScoreManager {
  applyPocketedCoins(state, pocketedPieces) {
    const newlyTracked = [];

    pocketedPieces
      .filter((piece) => piece.type === 'coin' && (piece.color === 'white' || piece.color === 'black'))
      .forEach((piece) => {
        const colorList = state.pocketedPieces[piece.color];
        if (colorList.includes(piece.id)) {
          return;
        }

        colorList.push(piece.id);
        const owner = this.getPlayerByColor(state, piece.color);
        owner?.pocketedOwnCoinIds.push(piece.id);
        newlyTracked.push(piece);
      });

    return newlyTracked;
  }

  applyCapturedCoins(state, playerId, pocketedPieces) {
    const player = this.getPlayerById(state, playerId);
    const newlyCaptured = [];
    if (!player) {
      return newlyCaptured;
    }

    pocketedPieces
      .filter((piece) => piece.type === 'coin' && (piece.color === 'white' || piece.color === 'black'))
      .forEach((piece) => {
        const colorList = state.pocketedPieces[piece.color];
        if (colorList.includes(piece.id)) {
          return;
        }

        colorList.push(piece.id);
        player.capturedCoinIds.push(piece.id);
        newlyCaptured.push(piece);
      });

    return newlyCaptured;
  }

  getPlayerByColor(state, color) {
    return state.players.find((player) => player.color === color) || null;
  }

  getPlayerById(state, playerId) {
    return state.players.find((player) => player.id === playerId) || null;
  }

  getOpponent(state, playerId) {
    return state.players.find((player) => player.id !== playerId) || null;
  }

  getDueCount(state, playerId) {
    return Math.max(0, Number(this.getPlayerById(state, playerId)?.dueCount) || 0);
  }

  applyDueChange(state, playerId, delta = 0) {
    const player = this.getPlayerById(state, playerId);
    if (!player) {
      return 0;
    }
    player.dueCount = Math.max(0, (Number(player.dueCount) || 0) + delta);
    return player.dueCount;
  }

  getPocketedCount(state, playerId) {
    const player = this.getPlayerById(state, playerId);
    if (!player) {
      return 0;
    }
    return state.ruleMode === 'freeCapture'
      ? player.capturedCoinIds.length
      : player.pocketedOwnCoinIds.length;
  }

  getRemainingCount(state, playerId) {
    if (state.ruleMode === 'freeCapture') {
      return Math.max(TOTAL_NORMAL_COINS - this.getTotalNormalCoinsPocketed(state), 0);
    }
    return Math.max(COINS_PER_PLAYER - this.getPocketedCount(state, playerId), 0);
  }

  hasAllOwnCoins(state, playerId) {
    return this.getPocketedCount(state, playerId) >= COINS_PER_PLAYER;
  }

  selectPenaltyCoin(state, playerId, preferredIds = []) {
    const player = this.getPlayerById(state, playerId);
    const penaltyPool = state.ruleMode === 'freeCapture'
      ? player?.capturedCoinIds
      : player?.pocketedOwnCoinIds;
    if (!player || !penaltyPool?.length) {
      return null;
    }

    const preferred = [...preferredIds].reverse().find((id) => penaltyPool.includes(id));
    return preferred || penaltyPool[penaltyPool.length - 1];
  }

  returnCoinToBoard(state, coinId) {
    if (!coinId) {
      return null;
    }

    const color = state.pocketedPieces.white.includes(coinId)
      ? 'white'
      : state.pocketedPieces.black.includes(coinId)
        ? 'black'
        : '';

    if (!color) {
      return null;
    }

    state.pocketedPieces[color] = state.pocketedPieces[color].filter((id) => id !== coinId);
    const owner = this.getPlayerByColor(state, color);
    if (owner) {
      owner.pocketedOwnCoinIds = owner.pocketedOwnCoinIds.filter((id) => id !== coinId);
      owner.returnedPenaltyCount += 1;
    }
    state.players.forEach((player) => {
      const hadCapture = player.capturedCoinIds.includes(coinId);
      player.pocketedOwnCoinIds = player.pocketedOwnCoinIds.filter((id) => id !== coinId);
      player.capturedCoinIds = player.capturedCoinIds.filter((id) => id !== coinId);
      if (hadCapture) {
        player.returnedPenaltyCount += 1;
      }
    });

    return { id: coinId, type: 'coin', color };
  }

  getTotalNormalCoinsPocketed(state) {
    return state.pocketedPieces.white.length + state.pocketedPieces.black.length;
  }

  getScoreSnapshot(state) {
    return state.players.reduce((snapshot, player) => {
      const pocketed = this.getPocketedCount(state, player.id);
      const queenBonus = state.queen.state === 'covered' && state.queen.pocketedByPlayerId === player.id
        ? QUEEN_COVER_BONUS
        : 0;
      snapshot[player.id] = {
        pocketed,
        remaining: this.getRemainingCount(state, player.id),
        color: player.color,
        points: pocketed * POINTS_PER_COIN + queenBonus,
        queenBonus,
        dueCount: this.getDueCount(state, player.id)
      };
      return snapshot;
    }, {});
  }
}
