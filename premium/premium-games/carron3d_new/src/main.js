import './styles.css';
import { Carrom3DApp } from './carrom3d-app.js';

const root = document.querySelector('#app');

if (!root) {
  throw new Error('3D Carrom Royale requires an #app mount node.');
}

const app = new Carrom3DApp({ root });
app.init();

window.__carrom3dRoyale = app;

if (import.meta.hot) {
  import.meta.hot.dispose(() => app.dispose());
}
