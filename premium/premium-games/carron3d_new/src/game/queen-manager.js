export const QUEEN_ID = 'queen-red-1';

export class QueenManager {
  markPendingCover(state, playerId, shotNumber) {
    state.queen.state = 'pendingCover';
    state.queen.pocketedByPlayerId = playerId;
    state.queen.pendingCoverPlayerId = playerId;
    state.queen.pendingCoverShotNumber = shotNumber;
    state.pocketedPieces.queen = true;
  }

  markCovered(state, playerId) {
    state.queen.state = 'covered';
    state.queen.pocketedByPlayerId = playerId;
    state.queen.pendingCoverPlayerId = null;
    state.queen.pendingCoverShotNumber = null;
    state.pocketedPieces.queen = true;
  }

  returnQueen(state) {
    state.queen.state = 'returned';
    state.queen.pocketedByPlayerId = null;
    state.queen.pendingCoverPlayerId = null;
    state.queen.pendingCoverShotNumber = null;
    state.pocketedPieces.queen = false;
    return { id: QUEEN_ID, type: 'queen', color: 'red' };
  }

  resetQueen(state) {
    state.queen.state = 'onBoard';
    state.queen.pocketedByPlayerId = null;
    state.queen.pendingCoverPlayerId = null;
    state.queen.pendingCoverShotNumber = null;
    state.pocketedPieces.queen = false;
  }

  isCovered(state) {
    return state.queen.state === 'covered';
  }

  getDisplayStatus(state) {
    const labels = {
      onBoard: 'On board',
      pendingCover: 'Pending cover',
      covered: 'Covered',
      returned: 'Returned'
    };
    return labels[state.queen.state] || 'On board';
  }
}
