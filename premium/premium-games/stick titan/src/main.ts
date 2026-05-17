import './styles.css';
import { Game } from './game/game';

const canvas = document.querySelector<HTMLCanvasElement>('#game');

function showBootFallback(title: string, message: string): void {
  const root = document.querySelector('#app') ?? document.body;
  const panel = document.createElement('div');
  panel.className = 'boot-fallback';
  panel.innerHTML = `
    <div class="boot-fallback-card">
      <span class="eyebrow">Stick Titan</span>
      <h1>${title}</h1>
      <p>${message}</p>
    </div>
  `;
  root.append(panel);
}

function supportsRequiredFeatures(target: HTMLCanvasElement | null): { ok: boolean; reason?: string } {
  if (!target) {
    return { ok: false, reason: 'The game canvas is missing from the page.' };
  }

  try {
    const storageKey = '__stick_titan_boot_check__';
    const storage = window.sessionStorage ?? window.localStorage;
    storage.setItem(storageKey, '1');
    storage.removeItem(storageKey);
  } catch {
    return { ok: false, reason: 'Browser storage is unavailable, so session progress and settings cannot be saved safely.' };
  }

  const gl =
    target.getContext('webgl2') ??
    target.getContext('webgl') ??
    target.getContext('experimental-webgl');
  if (!gl) {
    return { ok: false, reason: 'WebGL is unavailable in this browser, so the arena renderer cannot start.' };
  }

  if (typeof window.requestAnimationFrame !== 'function' || typeof window.Blob !== 'function' || typeof window.FileReader !== 'function') {
    return { ok: false, reason: 'This browser is missing modern desktop APIs required by the release build.' };
  }

  return { ok: true };
}

const support = supportsRequiredFeatures(canvas);
if (!support.ok) {
  showBootFallback('Browser Support Required', `${support.reason ?? 'This browser is not supported.'} Use a current desktop version of Chrome, Edge, Firefox, or Safari.`);
} else {
  try {
    const game = new Game(canvas as HTMLCanvasElement);
    game.start();

    window.addEventListener('beforeunload', () => {
      game.dispose();
    });
  } catch (error) {
    console.error(error);
    showBootFallback(
      'Startup Failed',
      'Stick Titan could not finish loading this session. Refresh the page or try another supported desktop browser.',
    );
  }
}
