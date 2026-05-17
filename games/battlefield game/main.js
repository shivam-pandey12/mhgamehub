import "./styles.css";
import { BattlefieldGame } from "./src/game.js";

const canvas = document.querySelector("#game");
const uiElements = {
  ammoReadout: document.querySelector("#ammo-readout"),
  crosshair: document.querySelector(".crosshair"),
  damageFlash: document.querySelector("#damage-flash"),
  difficultyButtons: Array.from(document.querySelectorAll("[data-difficulty]")),
  difficultyNote: document.querySelector("#difficulty-note"),
  enemyReadout: document.querySelector("#enemy-readout"),
  glooNote: document.querySelector("#gloo-note"),
  glooReadout: document.querySelector("#gloo-readout"),
  healChargeElements: Array.from(document.querySelectorAll("[data-heal-charge]")),
  healFlash: document.querySelector("#heal-flash"),
  healNote: document.querySelector("#heal-note"),
  healReadout: document.querySelector("#heal-readout"),
  hitMarker: document.querySelector("#hit-marker"),
  healthFill: document.querySelector("#health-fill"),
  healthNote: document.querySelector("#health-note"),
  healthReadout: document.querySelector("#health-readout"),
  introCard: document.querySelector("#intro-card"),
  lockButton: document.querySelector("#lock-button"),
  lowHealthVignette: document.querySelector("#low-health-vignette"),
  scopeOverlay: document.querySelector("#scope-overlay"),
  scanNote: document.querySelector("#scan-note"),
  scanReadout: document.querySelector("#scan-readout"),
  restartButton: document.querySelector("#restart-button"),
  resultAccuracy: document.querySelector("#result-accuracy"),
  resultCard: document.querySelector("#result-card"),
  resultDetail: document.querySelector("#result-detail"),
  resultEyebrow: document.querySelector("#result-eyebrow"),
  resultKills: document.querySelector("#result-kills"),
  resultScore: document.querySelector("#result-score"),
  resultTime: document.querySelector("#result-time"),
  resultTitle: document.querySelector("#result-title"),
  statusText: document.querySelector("#status-text"),
};

new BattlefieldGame({
  canvas,
  uiElements,
});
