import './styles.css';
import { GameManager } from './game/GameManager.js';

const root = document.querySelector('#game-root');

const showFatalError = (message) => {
  root.innerHTML = `
    <div class="webgl-error">
      <div class="webgl-error__panel">
        <p class="eyebrow">Mini City Drive</p>
        <h1>WebGL could not start</h1>
        <p>${message}</p>
        <p class="webgl-error__hint">Try a modern browser with hardware acceleration enabled.</p>
      </div>
    </div>
  `;
};

try {
  if (!window.WebGLRenderingContext) {
    throw new Error('Your browser does not expose WebGL.');
  }

  const game = new GameManager(root);
  window.__MINI_CITY_DRIVE__ = game;
  game.start().catch((error) => {
    game.dispose();
    console.error('[Mini City Drive] startup failed', error);
    showFatalError(error?.message ?? 'Unknown renderer startup error.');
  });
} catch (error) {
  console.error('[Mini City Drive] startup failed', error);
  showFatalError(error?.message ?? 'Unknown renderer startup error.');
}
