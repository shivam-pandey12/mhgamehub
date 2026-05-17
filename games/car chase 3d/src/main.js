import './styles.css';
import { GameManager } from './core/GameManager.js';
import { GameHubEmbedSystem } from './systems/GameHubEmbedSystem.js';

GameHubEmbedSystem.exposeMetadata();

if (!GameHubEmbedSystem.supportsWebGL()) {
  GameHubEmbedSystem.showError('WebGL is unavailable. Please enable hardware acceleration or use a WebGL-capable browser.');
  throw new Error('WebGL unavailable');
}

const game = new GameManager({
  root: document.querySelector('#game-root'),
});

game.boot();
