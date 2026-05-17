import { Hud } from './Hud.js';
import { playSound } from './audio.js';
import { LudoGame } from '../ludo/rules.js';
import { PLAYER_META, STATUS } from '../ludo/constants.js';
import { LudoScene } from '../rendering/LudoScene.js';

export class LudoApp {
  constructor(root) {
    this.root = root;
    this.canvas = root.querySelector('#game-canvas');
    this.game = null;
    this.busy = false;
    this.selectedPlayerCount = 2;

    this.scene = new LudoScene(this.canvas, {
      onDiceClick: () => this.rollDice(),
      onTokenClick: (tokenId) => this.selectToken(tokenId),
      onCellClick: () => this.handleBoardClick()
    });

    this.hud = new Hud(root, {
      onStart: (playerCount) => this.startGame(playerCount),
      onRoll: () => this.rollDice(),
      onRestart: () => this.restartGame()
    });

    this.scene.start();
    this.hud.render(null);
    this.hud.showSetup();
  }

  startGame(playerCount) {
    this.selectedPlayerCount = playerCount;
    this.game = new LudoGame(playerCount);
    this.busy = false;
    this.hud.hideSetup();
    this.hud.hideWinner();
    this.render();
  }

  restartGame() {
    if (!this.game) {
      this.hud.showSetup();
      return;
    }

    this.game.restart(this.selectedPlayerCount);
    this.busy = false;
    this.hud.hideWinner();
    this.render();
  }

  render() {
    const state = this.game?.snapshot();
    if (state) {
      this.scene.setState(state);
    }
    this.hud.render(state, { busy: this.busy });
  }

  async rollDice() {
    if (!this.game || this.busy) {
      return;
    }

    const state = this.game.state;
    if (state.phase !== STATUS.AWAITING_ROLL || state.winner) {
      this.hud.setStatus(state.phase === STATUS.AWAITING_TOKEN ? 'Select a highlighted token.' : 'Dice is not ready.');
      playSound('invalid');
      return;
    }

    this.busy = true;
    const result = this.game.rollDice();
    this.hud.render(this.game.snapshot(), { busy: true });
    playSound('dice');
    await this.scene.animateDice(result.diceValue);
    this.busy = false;

    if (result.legalMoves.length === 0) {
      playSound('invalid');
    }

    this.render();
  }

  async selectToken(tokenId) {
    if (!this.game || this.busy) {
      return;
    }

    const state = this.game.state;
    const isLegal = state.availableMoves.some((move) => move.tokenId === tokenId);
    if (!isLegal) {
      const message = state.phase === STATUS.AWAITING_ROLL
        ? 'Roll the dice before selecting a token.'
        : 'That token cannot move for this dice roll.';
      this.hud.setStatus(message);
      this.scene.pulseInvalidToken(tokenId);
      playSound('invalid');
      return;
    }

    this.busy = true;
    this.scene.setSelectedToken(tokenId);
    this.hud.render(this.game.snapshot(), { busy: true });
    const result = this.game.moveToken(tokenId);
    if (!result.ok) {
      this.busy = false;
      this.scene.pulseInvalidToken(tokenId);
      this.render();
      playSound('invalid');
      return;
    }

    await this.scene.animateTokenMove(
      tokenId,
      result.path,
      result.captures,
      result.state,
      () => playSound('move')
    );

    if (result.captures.length) {
      playSound('capture');
    }
    if (result.reachedHome) {
      playSound('home');
    }
    if (result.winner) {
      playSound('win');
    }

    this.busy = false;
    this.render();

    if (result.winner) {
      this.hud.showWinner(result.winner);
    }
  }

  handleBoardClick() {
    if (!this.game || this.busy) {
      return;
    }

    const state = this.game.state;
    if (state.phase === STATUS.AWAITING_TOKEN) {
      const player = PLAYER_META[state.currentPlayer];
      this.hud.setStatus(`${player.label} must select a highlighted token.`);
      playSound('invalid');
    }
  }
}
