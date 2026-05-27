import { MODE_CARDS, RULE_SECTIONS } from '../config/carrom-constants.js';
import { THEME_PRESETS } from '../config/theme-config.js';

const FEATURE_CHIPS = ['Local 2P', 'Vs Bot', 'Queen cover', 'Challenges', 'Cosmetics'];

function actionButton({ action, label, tone = 'secondary', disabled = false, testId = '' }) {
  return `
    <button
      class="action-btn ${tone}"
      type="button"
      data-action="${action}"
      ${testId ? `data-testid="${testId}"` : ''}
      ${disabled ? 'disabled aria-disabled="true"' : ''}
    ><span>${label}</span></button>
  `;
}

export class OverlayController {
  render() {
    return `
      ${this.renderLoading()}
      ${this.renderMainMenu()}
      ${this.renderModeSelect()}
      ${this.renderLocalSetup()}
      ${this.renderPause()}
      ${this.renderRules()}
      ${this.renderSettings()}
      ${this.renderResult()}
      ${this.renderAbout()}
    `;
  }

  renderLoading() {
    const chips = FEATURE_CHIPS.map((chip) => `<span>${chip}</span>`).join('');

    return `
      <section class="screen" data-screen="loading" data-testid="screen-loading" aria-label="Loading screen">
        <div class="home-card intro-card shimmer-panel">
          <div class="home-hero intro-hero">
            <div class="home-hero-copy">
              <span class="eyebrow">MH Horizon Premium</span>
              <h1>3D Carrom Royale</h1>
              <p class="intro-subtitle">Pocket. Cover. Conquer.</p>
              <p>A standalone premium carrom lounge with local matches, bot play, practice drills, challenges, and cosmetics.</p>
              <div class="gold-line" aria-hidden="true"></div>
              <div class="feature-chip-row" aria-label="Feature highlights">${chips}</div>
              <div class="home-actions">
                ${actionButton({ action: 'main-menu', label: 'Start / Continue', tone: 'primary', testId: 'enter-main-menu' })}
              </div>
            </div>
            <div class="intro-emblem" aria-hidden="true">
              <div class="royale-orbit">
                <span class="orbit-ring ring-one"></span>
                <span class="orbit-ring ring-two"></span>
                <strong>CR</strong>
              </div>
              <div class="brand-signature" aria-label="Powered by MH HORIZON">
                <span class="brand-signature-label">Powered by</span>
                <span class="brand-signature-name">MH HORIZON</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  renderMainMenu() {
    const chips = FEATURE_CHIPS.map((chip) => `<span>${chip}</span>`).join('');

    return `
      <section class="screen" data-screen="mainMenu" data-testid="screen-main-menu" aria-label="Main menu">
        <div class="home-card menu-panel">
          <div class="home-hero">
            <div class="home-hero-copy">
              <span class="eyebrow">Ivory Royale Lounge</span>
              <h2>3D Carrom Royale</h2>
              <p>A premium 3D carrom experience with smooth striker controls, bot play, challenge drills, queen cover rules, and cinematic ivory-gold visuals.</p>
              <div class="feature-chip-row" aria-label="Feature highlights">${chips}</div>
              <div class="home-actions">
                ${actionButton({ action: 'mode-select', label: 'Start Match', tone: 'primary', testId: 'start-match' })}
                ${actionButton({ action: 'rules', label: 'Rules', testId: 'open-rules-main' })}
                ${actionButton({ action: 'settings', label: 'Settings', testId: 'open-settings-main' })}
                ${actionButton({ action: 'about', label: 'About / Credits', testId: 'open-about' })}
              </div>
            </div>
            <div class="home-hero-stats">
              <div class="home-stat">
                <span class="label">Suite</span>
                <strong>Premium Tabletop</strong>
              </div>
              <div class="home-stat">
                <span class="label">Rules</span>
                <strong>Classic + Free Capture</strong>
              </div>
              <div class="home-stat">
                <span class="label">Solo</span>
                <strong>Bot / Practice / Challenges</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  renderModeSelect() {
    const cards = MODE_CARDS.map((card, index) => {
      const badges = {
        local: '2P',
        bot: 'AI',
        practice: 'DRL',
        challenges: 'STAR',
        onlinePrivate: 'NET',
        onlinePublic: 'Q'
      };
      const badge = badges[card.id] || String(index + 1);
      return `
        <article class="mode-select-card ${card.disabled ? 'is-disabled' : 'is-available'}">
          <div class="mode-card-emblem" aria-hidden="true">${badge}</div>
          <span class="status-pill">${card.status}</span>
          <h3>${card.title}</h3>
          <p>${card.description}</p>
          ${actionButton({
            action: card.action || 'disabled-mode',
            label: card.disabled ? card.status : 'Select',
            tone: card.disabled ? 'ghost' : 'primary',
            disabled: card.disabled,
            testId: card.id === 'local' ? 'select-local-mode' : ''
          })}
        </article>
      `;
    }).join('');

    return `
      <section class="screen" data-screen="modeSelect" data-testid="screen-mode-select" aria-label="Mode select">
        <div class="screen-heading">
          <span class="eyebrow">Choose Match Type</span>
          <h2>Select Your Table</h2>
        </div>
        <div class="mode-grid">${cards}</div>
        <div class="screen-actions">
          ${actionButton({ action: 'main-menu', label: 'Back', testId: 'mode-back' })}
        </div>
      </section>
    `;
  }

  renderLocalSetup() {
    return `
      <section class="screen" data-screen="localSetup" data-testid="screen-local-setup" aria-label="Local match setup">
        <form class="setup-panel home-card" data-form="local-setup">
          <div class="setup-heading">
            <span class="eyebrow">Local Table</span>
            <h2>Match Setup</h2>
            <p>Set the match type, names, coin assignment, and table style.</p>
          </div>
          <div class="option-group" aria-label="Match type selector">
            <span class="option-label">Match Type</span>
            <div class="segmented-control">
              <button type="button" data-choice-group="matchMode" data-choice-value="local2p" class="is-selected">Local 2 Player</button>
              <button type="button" data-choice-group="matchMode" data-choice-value="vsBot">Vs Bot</button>
            </div>
          </div>
          <div class="setup-player-grid">
            <label class="player-setup-card">
              <span class="player-medallion">P1</span>
              <span class="text-field">
                <span data-player-one-label>Player 1</span>
                <input id="playerOneName" data-testid="player-one-name" type="text" maxlength="24" autocomplete="off" placeholder="Player 1" />
              </span>
              <small>Color follows setup</small>
            </label>
            <label class="player-setup-card">
              <span class="player-medallion player-medallion-dark">P2</span>
              <span class="text-field">
                <span data-player-two-label>Player 2</span>
                <input id="playerTwoName" data-testid="player-two-name" type="text" maxlength="24" autocomplete="off" placeholder="Player 2" />
              </span>
              <small data-player-two-helper>Color follows setup</small>
            </label>
          </div>
          <div class="option-group" data-bot-difficulty-section aria-label="Bot difficulty selector" hidden>
            <span class="option-label">Bot Difficulty</span>
            <div class="segmented-control">
              <button type="button" data-choice-group="botDifficulty" data-choice-value="easy">Easy</button>
              <button type="button" data-choice-group="botDifficulty" data-choice-value="normal" class="is-selected">Normal</button>
              <button type="button" data-choice-group="botDifficulty" data-choice-value="hard">Hard</button>
            </div>
          </div>
          <div class="setup-divider" aria-hidden="true"></div>
          <div class="option-group" aria-label="Match rules selector">
            <span class="option-label">Match Rules</span>
            <div class="segmented-control">
              <button type="button" data-choice-group="ruleMode" data-choice-value="classic" class="is-selected">Classic Carrom</button>
              <button type="button" data-choice-group="ruleMode" data-choice-value="freeCapture">Free Capture</button>
            </div>
            <p class="modal-lead" data-rule-mode-helper>Assigned colors, first-pocket, and random color options apply in Classic Carrom.</p>
          </div>
          <div class="option-group" data-coin-side-section aria-label="Coin side selector">
            <span class="option-label">Coin Side</span>
            <div class="segmented-control">
              <button type="button" data-choice-group="coinSide" data-choice-value="p1White" class="is-selected">Player 1 White</button>
              <button type="button" data-choice-group="coinSide" data-choice-value="p1Black">Player 1 Black</button>
              <button type="button" data-choice-group="coinSide" data-choice-value="random">Random</button>
              <button type="button" data-choice-group="coinSide" data-choice-value="firstPocket">Open / First Pocket</button>
            </div>
          </div>
          <div class="option-group" aria-label="Board style selector">
            <span class="option-label">Board Style</span>
            <div class="segmented-control">
              <button type="button" data-choice-group="boardStyle" data-choice-value="ivory" class="is-selected">Ivory Royale Board</button>
              <button type="button" data-choice-group="boardStyle" data-choice-value="wood">Tournament Wood</button>
            </div>
          </div>
          <div class="setup-summary-strip">
            <span>Local Rules</span>
            <strong>Turns, fouls, queen cover, and winner detection are active</strong>
          </div>
          <div class="screen-actions split">
            ${actionButton({ action: 'mode-select', label: 'Back', testId: 'setup-back' })}
            ${actionButton({ action: 'start-local-shell-match', label: '<span data-start-match-label>Start Local Match</span>', tone: 'primary', testId: 'start-local-match' })}
          </div>
        </form>
      </section>
    `;
  }

  renderPause() {
    return `
      <section class="screen" data-screen="paused" data-testid="screen-paused" aria-label="Pause panel">
        <div class="modal-panel compact-panel shimmer-panel">
          <span class="eyebrow">Table Hold</span>
          <h2>Match Paused</h2>
          <p class="modal-lead">The local match is held in place while the table waits for your next action.</p>
          <div class="menu-actions stacked">
            ${actionButton({ action: 'resume-match', label: 'Resume', tone: 'primary', testId: 'resume-match' })}
            ${actionButton({ action: 'restart-match', label: 'Restart Match' })}
            ${actionButton({ action: 'settings', label: 'Settings' })}
            ${actionButton({ action: 'rules', label: 'Rules' })}
            ${actionButton({ action: 'main-menu', label: 'Back to Setup', tone: 'danger' })}
          </div>
        </div>
      </section>
    `;
  }

  renderRules() {
    const sections = RULE_SECTIONS.map((section) => `
      <section class="rules-section">
        <h3>${section.title}</h3>
        <p>${section.body}</p>
      </section>
    `).join('');

    return `
      <section class="screen" data-screen="rules" data-testid="screen-rules" aria-label="Rules and help">
        <div class="modal-panel wide-panel">
          <span class="eyebrow">Rules / Help</span>
          <h2>How The Table Plays</h2>
          <p class="modal-lead">Place the striker, aim with a pull, pocket your assigned coins, and cover the queen to finish.</p>
          <div class="rules-grid">${sections}</div>
          <div class="screen-actions">
            ${actionButton({ action: 'return-from-overlay', label: 'Back', testId: 'rules-back' })}
          </div>
        </div>
      </section>
    `;
  }

  renderSettings() {
    const themeButtons = Object.values(THEME_PRESETS).map((theme) => `
      <button type="button" data-setting-choice="themeId" data-setting-value="${theme.id}">${theme.label}</button>
    `).join('');

    return `
      <section class="screen" data-screen="settings" data-testid="screen-settings" aria-label="Settings panel">
        <div class="modal-panel settings-panel">
          <span class="eyebrow">Settings</span>
          <h2>Table Preferences</h2>
          <p class="modal-lead">These preferences persist locally and adjust the table immediately.</p>
          <div class="settings-list">
            <label class="toggle-row">
              <span><strong>Sound</strong><small>Enable generated table cues.</small></span>
              <input type="checkbox" data-setting-toggle="sound" />
            </label>
            <label class="toggle-row">
              <span><strong>Music</strong><small>Stored for future lounge ambience.</small></span>
              <input type="checkbox" data-setting-toggle="music" />
            </label>
            <label class="toggle-row">
              <span><strong>Camera Motion</strong><small>Allow cinematic board movement.</small></span>
              <input type="checkbox" data-setting-toggle="cameraMotion" />
            </label>
            <label class="toggle-row">
              <span><strong>Reduced Effects</strong><small>Calms major animations and VFX.</small></span>
              <input type="checkbox" data-setting-toggle="reducedEffects" />
            </label>
          </div>
          <div class="option-group">
            <span class="option-label">Theme</span>
            <div class="segmented-control" data-setting-group="themeId">${themeButtons}</div>
          </div>
          <div class="option-group">
            <span class="option-label">Quality</span>
            <div class="segmented-control" data-setting-group="quality">
              <button type="button" data-setting-choice="quality" data-setting-value="auto">Auto</button>
              <button type="button" data-setting-choice="quality" data-setting-value="high">High</button>
              <button type="button" data-setting-choice="quality" data-setting-value="balanced">Balanced</button>
              <button type="button" data-setting-choice="quality" data-setting-value="battery">Battery Saver</button>
            </div>
          </div>
          <div class="screen-actions split">
            ${actionButton({ action: 'reset-settings', label: 'Reset Settings' })}
            ${actionButton({ action: 'return-from-overlay', label: 'Back', tone: 'primary', testId: 'settings-back' })}
          </div>
        </div>
      </section>
    `;
  }

  renderResult() {
    return `
      <section class="screen" data-screen="result" data-testid="screen-result" aria-label="Match result">
        <div class="modal-panel result-panel shimmer-panel">
          <span class="eyebrow">Match Result</span>
          <div class="winner-seal" aria-hidden="true">WIN</div>
          <h2><span data-result-winner>Player 1</span> <span data-result-outcome>Wins</span></h2>
          <p class="modal-lead"><span data-result-winner-color>White</span> closes the table after a local 2-player match.</p>
          <div class="result-grid">
            <div><span>Final Score</span><strong data-result-score>0 - 0</strong></div>
            <div><span>Colors</span><strong data-result-colors>Player 1: White | Player 2: Black</strong></div>
            <div><span>Queen</span><strong data-result-queen>On board</strong></div>
            <div><span>Turns</span><strong data-result-turns>1</strong></div>
            <div><span>Shots</span><strong data-result-shots>0</strong></div>
          </div>
          <div class="screen-actions split">
            ${actionButton({ action: 'rematch-shell', label: 'Rematch', tone: 'primary', testId: 'result-rematch' })}
            ${actionButton({ action: 'open-local-setup', label: 'Back to Setup', testId: 'result-setup' })}
            ${actionButton({ action: 'main-menu', label: 'Main Menu', testId: 'result-menu' })}
          </div>
        </div>
      </section>
    `;
  }

  renderAbout() {
    return `
      <section class="screen" data-screen="about" data-testid="screen-about" aria-label="About and credits">
        <div class="modal-panel compact-panel">
          <span class="eyebrow">About / Credits</span>
          <h2>3D Carrom Royale</h2>
          <p class="modal-lead">Standalone premium tabletop experience built for real physics, cinematic shots, bot play, challenge drills, and mobile-friendly local matches.</p>
          <div class="home-doc-card">
            <strong>Visual family</strong>
            <span>Inspired by premium board-game presentation, with its own carrom lounge identity.</span>
          </div>
          <div class="screen-actions">
            ${actionButton({ action: 'return-from-overlay', label: 'Back', testId: 'about-back' })}
          </div>
        </div>
      </section>
    `;
  }
}
