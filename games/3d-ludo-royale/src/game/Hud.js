import { PLAYER_META, STATUS, TOKENS_PER_PLAYER } from '../ludo/constants.js';

export class Hud {
  constructor(root, handlers = {}) {
    this.root = root;
    this.handlers = handlers;
    this.selectedPlayerCount = 2;
    this.setupPanel = root.querySelector('#setup-panel');
    this.playerButtons = [...root.querySelectorAll('[data-player-count]')];
    this.startButton = root.querySelector('#start-game-button');
    this.hud = root.querySelector('#hud');
    this.currentPlayerDot = root.querySelector('#current-player-dot');
    this.currentPlayerLabel = root.querySelector('#current-player-label');
    this.diceValue = root.querySelector('#dice-value');
    this.rollButton = root.querySelector('#roll-dice-button');
    this.statusMessage = root.querySelector('#status-message');
    this.progressList = root.querySelector('#progress-list');
    this.restartButton = root.querySelector('#restart-game-button');
    this.winnerModal = root.querySelector('#winner-modal');
    this.winnerTitle = root.querySelector('#winner-title');
    this.winnerCopy = root.querySelector('#winner-copy');
    this.winnerRestartButton = root.querySelector('#winner-restart-button');
    this.bindEvents();
  }

  bindEvents() {
    this.playerButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.selectedPlayerCount = Number(button.dataset.playerCount);
        this.playerButtons.forEach((candidate) => {
          candidate.classList.toggle('is-active', candidate === button);
        });
      });
    });

    this.startButton.addEventListener('click', () => this.handlers.onStart?.(this.selectedPlayerCount));
    this.rollButton.addEventListener('click', () => this.handlers.onRoll?.());
    this.restartButton.addEventListener('click', () => this.handlers.onRestart?.());
    this.winnerRestartButton.addEventListener('click', () => this.handlers.onRestart?.());
  }

  showSetup() {
    this.setupPanel.classList.remove('is-hidden');
  }

  hideSetup() {
    this.setupPanel.classList.add('is-hidden');
  }

  setStatus(message) {
    this.statusMessage.textContent = message;
  }

  render(state, { busy = false } = {}) {
    if (!state) {
      this.currentPlayerLabel.textContent = 'Red';
      this.diceValue.textContent = '-';
      this.rollButton.disabled = true;
      this.renderProgress(null);
      return;
    }

    const player = PLAYER_META[state.currentPlayer];
    this.currentPlayerLabel.textContent = player.label;
    this.currentPlayerDot.className = `player-dot player-${player.id}`;
    this.diceValue.textContent = state.diceValue ?? state.lastDiceValue ?? '-';
    this.rollButton.disabled = busy || state.phase !== STATUS.AWAITING_ROLL || Boolean(state.winner);
    this.restartButton.disabled = busy;
    this.statusMessage.textContent = state.lastEvent?.message || `${player.label} player's turn.`;
    this.renderProgress(state);
  }

  renderProgress(state) {
    if (!state) {
      this.progressList.innerHTML = '';
      return;
    }

    this.progressList.innerHTML = state.activePlayers.map((playerId) => {
      const player = PLAYER_META[playerId];
      const finished = state.finishedCounts[playerId] || 0;
      const percent = (finished / TOKENS_PER_PLAYER) * 100;
      return `
        <div class="progress-row">
          <span class="player-dot player-${playerId}"></span>
          <div class="progress-copy">
            <strong>${player.label}</strong>
            <span>${finished}/${TOKENS_PER_PLAYER} home</span>
          </div>
          <div class="progress-track" aria-hidden="true">
            <span style="width: ${percent}%"></span>
          </div>
        </div>
      `;
    }).join('');
  }

  showWinner(playerId) {
    const player = PLAYER_META[playerId];
    this.winnerTitle.textContent = `${player.label} wins`;
    this.winnerCopy.textContent = 'All four tokens reached home.';
    this.winnerModal.classList.remove('is-hidden');
  }

  hideWinner() {
    this.winnerModal.classList.add('is-hidden');
  }
}
