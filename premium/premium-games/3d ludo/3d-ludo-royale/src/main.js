import './styles.css';
import { LudoApp } from './game/App.js';

const root = document.querySelector('#app');
const app = new LudoApp(root);

window.__ludoRoyale = app;
