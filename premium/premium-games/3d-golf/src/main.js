import './styles.css';
import { IvoryGolfGame } from './game/IvoryGolfGame.js';

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')));
  } catch {
    return false;
  }
}

function showFatalError(title, message) {
  const loading = document.querySelector('#loading-screen');
  if (!loading) return;
  loading.classList.remove('is-hidden');
  loading.innerHTML = `
    <div class="loading-mark loading-mark--still"></div>
    <h2>${title}</h2>
    <p>${message}</p>
    <button class="glass-button" type="button" id="return-menu-after-error">Return to menu</button>
  `;
  loading.querySelector('#return-menu-after-error')?.addEventListener('click', () => {
    loading.classList.add('is-hidden');
    document.querySelector('#main-menu')?.classList.add('screen--active');
  });
}

try {
  const canvas = document.querySelector('#game-canvas');
  if (!canvas) throw new Error('Game canvas was not found.');
  if (!supportsWebGL()) {
    showFatalError('WebGL Required', 'This browser cannot start the 3D renderer. Try an updated Chrome, Edge, Firefox, or Safari browser.');
  } else {
    const game = new IvoryGolfGame(canvas);
    game.start();
    window.ivoryGolfRoyale = game;
  }
} catch (error) {
  console.error('[Ivory Golf Royale 3D] Startup failed:', error);
  showFatalError('Ivory Golf Royale 3D paused', 'The game hit a startup problem. Local progress is safe; reload or return to the menu and try again.');
}
