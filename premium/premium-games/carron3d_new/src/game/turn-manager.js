export class TurnManager {
  constructor(state) {
    this.state = state;
  }

  getCurrentPlayer() {
    return this.state.players.find((player) => player.id === this.state.currentPlayerId) || this.state.players[0];
  }

  getOpponentPlayer() {
    const current = this.getCurrentPlayer();
    return this.state.players.find((player) => player.id !== current.id) || null;
  }

  continueTurn() {
    return this.getCurrentPlayer();
  }

  switchTurn() {
    const opponent = this.getOpponentPlayer();
    if (opponent) {
      this.state.currentPlayerId = opponent.id;
      this.state.turnNumber += 1;
    }
    return this.getCurrentPlayer();
  }

  getActiveBaseline(playerId = this.state.currentPlayerId) {
    return playerId === 'player-2' ? 'top' : 'bottom';
  }

  resetTurns() {
    this.state.currentPlayerId = 'player-1';
    this.state.turnNumber = 1;
    this.state.shotNumber = 0;
  }
}
