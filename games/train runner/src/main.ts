import './styles.css';
import { Game } from './game/Game';
import { LoadingSystem } from './game/LoadingSystem';

const host = document.querySelector<HTMLDivElement>('#app');

if (!host) {
  throw new Error('Train Roof Rush could not find #app.');
}

const loading = new LoadingSystem(host);
let game: Game | null = null;

try {
  await loading.prepare();
  game = new Game(host);
  game.start();
  loading.complete();
} catch (error) {
  loading.showError(error);
}

window.addEventListener('beforeunload', () => {
  game?.dispose();
});
