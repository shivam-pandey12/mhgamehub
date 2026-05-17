import "./styles.css";
import { CarromGame } from "./game.js";

const app = document.querySelector("#app");

app.innerHTML = `
  <div class="app-shell">
    <div class="scene-shell" id="scene-shell"></div>
    <div class="hud">
      <div class="panel">
        <span class="eyebrow">Current Turn</span>
        <div class="turn-row">
          <strong id="current-player">Player 1</strong>
          <span class="turn-chip" id="turn-chip">White</span>
        </div>
        <div class="chip-row">
          <span class="meta-chip" id="phase-chip">Placement</span>
          <span class="meta-chip meta-chip-muted" id="round-chip">Round 1</span>
        </div>
        <p class="status-text" id="status-text">Loading board...</p>
      </div>

      <div class="panel">
        <span class="eyebrow">Match</span>
        <div class="score-row">
          <span>Player 1 Points</span>
          <strong id="score-player-1">0</strong>
        </div>
        <div class="score-row">
          <span>Player 2 Points</span>
          <strong id="score-player-2">0</strong>
        </div>
        <div class="mini-grid">
          <div class="mini-card">
            <span>Rounds</span>
            <strong id="rounds-player-1">0</strong>
            <small>Player 1</small>
          </div>
          <div class="mini-card">
            <span>Rounds</span>
            <strong id="rounds-player-2">0</strong>
            <small>Player 2</small>
          </div>
          <div class="mini-card">
            <span>Board Coins</span>
            <strong id="board-score-player-1">0 / 9</strong>
            <small>Player 1</small>
          </div>
          <div class="mini-card">
            <span>Board Coins</span>
            <strong id="board-score-player-2">0 / 9</strong>
            <small>Player 2</small>
          </div>
          <div class="mini-card mini-card-alert">
            <span>Due</span>
            <strong id="due-player-1">0</strong>
            <small>Player 1</small>
          </div>
          <div class="mini-card mini-card-alert">
            <span>Due</span>
            <strong id="due-player-2">0</strong>
            <small>Player 2</small>
          </div>
        </div>
        <p class="queen-status" id="queen-status">Queen available.</p>
        <p class="round-status" id="round-status">Race to 25 points.</p>
      </div>

      <div class="panel">
        <span class="eyebrow">Match Setup</span>
        <label class="field">
          <span>Mode</span>
          <select id="mode-select">
            <option value="vs-ai" selected>Vs AI</option>
            <option value="local">Local 2P</option>
          </select>
        </label>
        <label class="field">
          <span>AI Difficulty</span>
          <select id="difficulty-select">
            <option value="easy">Easy</option>
            <option value="medium" selected>Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <div class="action-row">
          <button class="secondary-button" id="sound-button" type="button">Sound On</button>
          <button class="secondary-button" id="camera-button" type="button">Reset Camera</button>
        </div>
        <div class="action-row">
          <button class="secondary-button" id="rules-button" type="button">Show Rules</button>
          <button class="restart-button" id="restart-button" type="button">Restart Match</button>
        </div>
        <div class="power-meter">
          <span>Shot Power</span>
          <div class="power-track">
            <div class="power-fill" id="power-fill"></div>
          </div>
        </div>
        <p class="hint-text" id="hint-text">Move the striker along your baseline, then drag from it toward the opposite half to shoot.</p>
      </div>

      <div class="panel rules-panel hidden" id="rules-panel">
        <span class="eyebrow">Rules & Controls</span>
        <ul class="rules-list">
          <li>Move the striker along your baseline before shooting.</li>
          <li>Legal shots must travel toward the opposite half of the board.</li>
          <li>Pocketing your own coin keeps your turn. Pocketed coins come back only for due, striker combinations, or queen respot cases.</li>
          <li>Pocketing the striker creates due. If it falls with your own coin, those coins return but your turn continues.</li>
          <li>The queen follows real cover rules: you must already have your own coin pocketed, and some queen shots must be covered on the next scoring shot.</li>
          <li>Board winner earns opponent remaining men plus queen bonus. Match target is 25.</li>
        </ul>
      </div>
    </div>
  </div>
`;

const ui = {
  currentPlayer: document.querySelector("#current-player"),
  turnChip: document.querySelector("#turn-chip"),
  phaseChip: document.querySelector("#phase-chip"),
  roundChip: document.querySelector("#round-chip"),
  statusText: document.querySelector("#status-text"),
  scorePlayer1: document.querySelector("#score-player-1"),
  scorePlayer2: document.querySelector("#score-player-2"),
  roundsPlayer1: document.querySelector("#rounds-player-1"),
  roundsPlayer2: document.querySelector("#rounds-player-2"),
  boardScorePlayer1: document.querySelector("#board-score-player-1"),
  boardScorePlayer2: document.querySelector("#board-score-player-2"),
  duePlayer1: document.querySelector("#due-player-1"),
  duePlayer2: document.querySelector("#due-player-2"),
  queenStatus: document.querySelector("#queen-status"),
  roundStatus: document.querySelector("#round-status"),
  modeSelect: document.querySelector("#mode-select"),
  difficultySelect: document.querySelector("#difficulty-select"),
  restartButton: document.querySelector("#restart-button"),
  soundButton: document.querySelector("#sound-button"),
  cameraButton: document.querySelector("#camera-button"),
  rulesButton: document.querySelector("#rules-button"),
  rulesPanel: document.querySelector("#rules-panel"),
  powerFill: document.querySelector("#power-fill"),
  hintText: document.querySelector("#hint-text"),
};

const game = new CarromGame({
  container: document.querySelector("#scene-shell"),
  ui,
});

window.__carromGame = game;
