import { CLASSIC_RULE_VARIANTS, RULE_SECTIONS } from '../config/carrom-constants.js';
import { CHALLENGES } from '../challenges/challenge-data.js';
import {
  COSMETIC_CATEGORIES,
  COSMETIC_RARITY_LABELS,
  COSMETIC_STATUS_LABELS,
  getCosmeticsByCategory
} from '../cosmetics/cosmetic-data.js';
import { PRACTICE_TYPES } from '../training/training-scenarios.js';
import { THEME_PRESETS } from '../config/theme-config.js';

const QUALITY_LABELS = {
  auto: 'Auto',
  high: 'High',
  balanced: 'Balanced',
  battery: 'Battery Saver'
};

const BOT_DIFFICULTY_LABELS = {
  easy: 'Easy',
  normal: 'Normal',
  hard: 'Hard'
};

function renderThemeButtons() {
  return Object.values(THEME_PRESETS).map((theme) => `
    <button type="button" data-setting-choice="themeId" data-setting-value="${theme.id}" aria-label="Use ${theme.label} theme">${theme.label}</button>
  `).join('');
}

function renderQualityButtons() {
  return Object.entries(QUALITY_LABELS).map(([value, label]) => `
    <button type="button" data-setting-choice="quality" data-setting-value="${value}" aria-label="Use ${label} quality">${label}</button>
  `).join('');
}

function renderRuleCards() {
  return RULE_SECTIONS.map((section) => `
    <section class="rules-section side-rules-card">
      <h3>${section.title}</h3>
      <p>${section.body}</p>
    </section>
  `).join('');
}

function renderClassicVariantButtons() {
  return Object.values(CLASSIC_RULE_VARIANTS).map((variant) => `
    <button type="button" data-choice-group="classicRuleVariant" data-choice-value="${variant.id}" aria-label="Use ${variant.label} Classic rules">
      <span>${variant.label}</span>
      <small>${variant.helper}</small>
    </button>
  `).join('');
}

function renderOnlineClassicVariantButtons() {
  return Object.values(CLASSIC_RULE_VARIANTS).map((variant) => `
    <button type="button" data-online-choice-group="classicRuleVariant" data-online-choice-value="${variant.id}" aria-label="Use ${variant.label} Classic rules online">
      <span>${variant.label}</span>
      <small>${variant.helper}</small>
    </button>
  `).join('');
}

function renderPublicClassicVariantButtons() {
  return [
    ...Object.values(CLASSIC_RULE_VARIANTS).map((variant) => `
      <button type="button" data-public-choice-group="classicRuleVariant" data-public-choice-value="${variant.id}" aria-label="Search for ${variant.label} Classic rules">
        <span>${variant.label}</span>
        <small>${variant.helper}</small>
      </button>
    `),
    `
      <button type="button" class="is-selected" data-public-choice-group="classicRuleVariant" data-public-choice-value="any" aria-label="Search any Classic rule style">
        <span>Any</span>
        <small>Match compatible public players faster.</small>
      </button>
    `
  ].join('');
}

function renderPracticeButtons() {
  return Object.values(PRACTICE_TYPES).map((practice) => `
    <button type="button" data-choice-group="practiceType" data-choice-value="${practice.id}" aria-label="Use ${practice.label}">
      <span>${practice.label}</span>
      <small>${practice.helper}</small>
    </button>
  `).join('');
}

function renderStaticChallengeCards() {
  return CHALLENGES.map((challenge) => `
    <button class="challenge-card" type="button" data-action="select-challenge" data-challenge-id="${challenge.id}" aria-label="Select ${challenge.title}">
      <span class="status-pill">${challenge.difficulty}</span>
      <strong>${challenge.title}</strong>
      <small>${challenge.objectiveText}</small>
      <b data-challenge-stars="${challenge.id}">0 stars</b>
    </button>
  `).join('');
}

function renderCosmeticCategoryButtons() {
  return COSMETIC_CATEGORIES.map((category) => `
    <button type="button" data-action="cosmetic-category" data-cosmetic-category="${category.id}" data-cosmetic-category-tab="${category.id}" aria-label="Open ${category.label} cosmetics">
      <span>${category.label}</span>
      <small>${category.description}</small>
    </button>
  `).join('');
}

function renderCosmeticCards() {
  return COSMETIC_CATEGORIES.flatMap((category) => getCosmeticsByCategory(category.id).map((item) => `
    <button
      class="cosmetic-card"
      type="button"
      data-action="preview-cosmetic"
      data-cosmetic-card
      data-cosmetic-category="${item.category}"
      data-cosmetic-id="${item.id}"
      data-cosmetic-status="${item.status}"
      aria-label="Preview ${item.name}"
    >
      <span class="status-pill">${COSMETIC_STATUS_LABELS[item.status] || item.status}</span>
      <strong>${item.name}</strong>
      <small>${item.description}</small>
      <b>${COSMETIC_RARITY_LABELS[item.rarity] || item.rarity}</b>
    </button>
  `)).join('');
}

export class HudController {
  render() {
    return `
      <section class="playing-hud" data-testid="playing-hud" aria-label="Playing HUD">
        <button
          class="hud-toggle"
          type="button"
          data-action="toggle-hud"
          aria-expanded="true"
          aria-controls="carromHudPanel"
          aria-label="Hide side panel"
        >
          <span class="hud-toggle-icon" aria-hidden="true"></span>
          <span class="hud-toggle-label">Hide Panel</span>
        </button>

        <aside id="carromHudPanel" class="hud-panel" aria-label="Match side panel">
          <button
            class="panel-close-button"
            type="button"
            data-action="toggle-hud"
            aria-controls="carromHudPanel"
            aria-label="Hide side panel"
          >Hide Panel</button>

          <div class="brand-panel">
            <span class="eyebrow">Premium Match Suite</span>
            <h2>Carrom Royale</h2>
            <p>Set up, play, tune, and review the local table from this premium side panel.</p>
            <div class="brand-signature" aria-label="Powered by MH HORIZON">
              <span class="brand-signature-label">Powered by</span>
              <strong class="brand-signature-name">MH HORIZON</strong>
            </div>
          </div>

          <nav class="side-panel-nav" aria-label="Carrom side panel sections">
            <button class="panel-tab is-active" type="button" data-action="open-local-setup" data-panel-tab="setup" aria-label="Open match setup">Setup</button>
            <button class="panel-tab" type="button" data-action="panel-match" data-panel-tab="match" aria-label="Open match status">Match</button>
            <button class="panel-tab" type="button" data-action="open-practice" data-panel-tab="practice" aria-label="Open practice and tutorial">Practice</button>
            <button class="panel-tab" type="button" data-action="open-challenges" data-panel-tab="challenges" aria-label="Open challenges">Challenges</button>
            <button class="panel-tab" type="button" data-action="open-online" data-panel-tab="online" aria-label="Open online private rooms">Online</button>
            <button class="panel-tab" type="button" data-action="open-public-matchmaking" data-panel-tab="onlinePublic" aria-label="Open public matchmaking">Public</button>
            <button class="panel-tab" type="button" data-action="open-customize" data-panel-tab="customize" aria-label="Open cosmetics customization">Customize</button>
            <button class="panel-tab" type="button" data-action="rules" data-panel-tab="rules" aria-label="Open rules help">Rules</button>
            <button class="panel-tab" type="button" data-action="settings" data-panel-tab="settings" aria-label="Open settings">Settings</button>
          </nav>

          <div class="side-panel-section is-active" data-panel-section="setup">
            <div class="service-card side-setup-card">
              <span class="eyebrow" data-setup-eyebrow>Local 2 Player</span>
              <h3>Match Setup</h3>
              <p>Choose match type, names, and table rules. The panel will auto-hide for play.</p>

              <div class="option-group" aria-label="Match type selector">
                <span class="option-label">Match Type</span>
                <div class="segmented-control">
                  <button type="button" data-choice-group="matchMode" data-choice-value="local2p" class="is-selected" aria-label="Use local two player mode">Local 2 Player</button>
                  <button type="button" data-choice-group="matchMode" data-choice-value="vsBot" aria-label="Use human versus bot mode">Vs Bot</button>
                </div>
              </div>

              <div class="setup-player-grid side-setup-grid">
                <label class="player-setup-card">
                  <span class="player-medallion">P1</span>
                  <span class="text-field">
                    <span data-player-one-label>Player 1</span>
                    <input id="hudPlayerOneName" data-player-name="one" data-testid="player-one-name" type="text" maxlength="24" autocomplete="off" placeholder="Player 1" />
                  </span>
                  <small>Color follows setup</small>
                </label>
                <label class="player-setup-card">
                  <span class="player-medallion player-medallion-dark">P2</span>
                  <span class="text-field">
                    <span data-player-two-label>Player 2</span>
                    <input id="hudPlayerTwoName" data-player-name="two" data-testid="player-two-name" type="text" maxlength="24" autocomplete="off" placeholder="Player 2" />
                  </span>
                  <small data-player-two-helper>Color follows setup</small>
                </label>
              </div>

              <div class="option-group" data-bot-difficulty-section aria-label="Bot difficulty selector" hidden>
                <span class="option-label">Bot Difficulty</span>
                <div class="segmented-control">
                  <button type="button" data-choice-group="botDifficulty" data-choice-value="easy" aria-label="Use Easy Bot difficulty">Easy</button>
                  <button type="button" data-choice-group="botDifficulty" data-choice-value="normal" class="is-selected" aria-label="Use Normal Bot difficulty">Normal</button>
                  <button type="button" data-choice-group="botDifficulty" data-choice-value="hard" aria-label="Use Hard Bot difficulty">Hard</button>
                </div>
              </div>

              <div class="option-group" aria-label="Match rules selector">
                <span class="option-label">Match Rules</span>
                <div class="segmented-control">
                  <button type="button" data-choice-group="ruleMode" data-choice-value="classic" class="is-selected" aria-label="Use classic assigned-color carrom rules">Classic Carrom</button>
                  <button type="button" data-choice-group="ruleMode" data-choice-value="freeCapture" aria-label="Use Free Capture rules where any coin scores">Free Capture</button>
                </div>
                <p class="modal-lead" data-rule-mode-helper>Assigned colors, first-pocket, and random color options apply in Classic Carrom.</p>
              </div>

              <div class="option-group" data-classic-rule-section aria-label="Classic rule style selector">
                <span class="option-label">Classic Rule Style</span>
                <div class="segmented-control segmented-control-cards">
                  ${renderClassicVariantButtons()}
                </div>
              </div>

              <div class="option-group" data-coin-side-section aria-label="Coin side selector">
                <span class="option-label">Coin Side</span>
                <div class="segmented-control">
                  <button type="button" data-choice-group="coinSide" data-choice-value="p1White" class="is-selected" aria-label="Assign Player 1 white coins">P1 White</button>
                  <button type="button" data-choice-group="coinSide" data-choice-value="p1Black" aria-label="Assign Player 1 black coins">P1 Black</button>
                  <button type="button" data-choice-group="coinSide" data-choice-value="random" aria-label="Randomize coin colors and use point scoring">Random</button>
                  <button type="button" data-choice-group="coinSide" data-choice-value="firstPocket" aria-label="Leave colors open until the first white or black coin is pocketed">Open / First Pocket</button>
                </div>
              </div>

              <div class="option-group" aria-label="Board style selector">
                <span class="option-label">Board Style</span>
                <div class="segmented-control">
                  <button type="button" data-choice-group="boardStyle" data-choice-value="ivory" class="is-selected" aria-label="Use Ivory Royale board style">Ivory Royale</button>
                  <button type="button" data-choice-group="boardStyle" data-choice-value="wood" aria-label="Use Tournament Wood board style">Tournament Wood</button>
                  <button type="button" data-choice-group="boardStyle" data-choice-value="midnight" aria-label="Use Midnight Gold board style">Midnight Gold</button>
                </div>
              </div>

              <div class="setup-summary-strip side-setup-summary">
                <span data-setup-mode-label>Rules</span>
                <strong data-setup-mode-note>Fixed sides use coin counts. Random enables point scoring.</strong>
              </div>

              <div class="controls-card compact-controls">
                <button class="action-btn primary" type="button" data-action="start-local-shell-match" data-testid="start-local-match"><span data-start-match-label>Start Local Match</span></button>
                <button class="action-btn secondary" type="button" data-action="open-customize" data-testid="open-customize"><span>Customize</span></button>
                <button class="action-btn secondary" type="button" data-action="about" data-testid="open-about"><span>About / Credits</span></button>
              </div>
            </div>
          </div>

          <div class="side-panel-section" data-panel-section="match">
            <div class="status-card">
              <div class="status-row">
                <span class="label">Mode</span>
                <strong data-hud-match-mode>Local 2 Player</strong>
              </div>
              <div class="status-row" data-hud-bot-row hidden>
                <span class="label">Bot</span>
                <strong><span data-hud-bot-name>Bot</span> <span data-hud-bot-difficulty></span></strong>
              </div>
              <div class="status-row">
                <span class="label">Current Turn</span>
                <strong data-hud-current-turn>Player 1</strong>
              </div>
              <div class="status-row">
                <span class="label">Rule Mode</span>
                <strong data-hud-rule-mode>Classic Carrom</strong>
              </div>
              <div class="status-row" data-hud-due-row hidden>
                <span class="label">Due</span>
                <strong data-hud-due>Clear</strong>
              </div>
              <div class="status-row" data-hud-challenge-row hidden>
                <span class="label">Challenge</span>
                <strong><span data-hud-challenge-title></span> <span data-hud-challenge-shots></span></strong>
              </div>
              <div class="status-row" data-hud-practice-row hidden>
                <span class="label">Practice</span>
                <strong data-hud-practice-title></strong>
              </div>
              <div class="status-row" data-hud-online-row hidden>
                <span class="label">Online</span>
                <strong><span data-hud-online-room></span> <span data-hud-online-connection></span></strong>
              </div>
              <div class="status-row" data-hud-online-timer-row hidden>
                <span class="label">Timer</span>
                <strong data-hud-online-timer>Paused</strong>
              </div>
              <div class="status-row">
                <span class="label">Color</span>
                <strong data-hud-current-color>White</strong>
              </div>
              <div class="status-row">
                <span class="label">Turn / Shot</span>
                <strong><span data-hud-turn>1</span> / <span data-hud-shot>0</span></strong>
              </div>
              <div class="status-row" aria-live="polite">
                <span class="label">State</span>
                <strong data-hud-status>Place striker on the baseline, then drag to aim.</strong>
              </div>
            </div>

            <div class="match-feedback-banner" data-hud-banner data-tone="default" aria-live="polite">Ready for local match.</div>

            <div class="service-card player-card-stack">
              <span class="eyebrow">Players</span>
              <div class="player-hud-card is-active" data-hud-player-card="player-1">
                <span class="player-medallion">P1</span>
                <span>
                  <small data-hud-p1-name>Player 1</small>
                  <strong><span data-hud-p1-score>0/9</span> <span data-hud-p1-score-label>pocketed</span></strong>
                  <b class="point-pill" data-hud-p1-points>0 pts</b>
                  <em data-hud-p1-color>White</em>
                </span>
              </div>
              <div class="player-hud-card" data-hud-player-card="player-2">
                <span class="player-medallion player-medallion-dark">P2</span>
                <span>
                  <small data-hud-p2-name>Player 2</small>
                  <strong><span data-hud-p2-score>0/9</span> <span data-hud-p2-score-label>pocketed</span></strong>
                  <b class="point-pill" data-hud-p2-points>0 pts</b>
                  <em data-hud-p2-color>Black</em>
                </span>
              </div>
            </div>

            <div class="service-card">
              <span class="eyebrow">Table Status</span>
              <div class="meta-grid">
                <div class="meta-row">
                  <span class="label">Queen</span>
                  <strong data-hud-queen>On board</strong>
                </div>
                <div class="meta-row">
                  <span class="label">Remaining</span>
                  <strong><span data-hud-p1-remaining>9</span> / <span data-hud-p2-remaining>9</span></strong>
                </div>
                <div class="meta-row">
                  <span class="label">Foul</span>
                  <strong data-hud-foul>Clear</strong>
                </div>
                <div class="meta-row" data-points-row>
                  <span class="label">Points</span>
                  <strong data-hud-points>Coins mode</strong>
                </div>
                <div class="meta-row">
                  <span class="label">Shot Power</span>
                  <strong data-hud-power>Waiting</strong>
                </div>
                <div class="power-meter" aria-label="Shot power meter">
                  <span class="power-meter-fill" data-hud-power-fill></span>
                </div>
                <div class="meta-row">
                  <span class="label">Stage</span>
                  <strong>Local rules</strong>
                </div>
              </div>
            </div>

            <div class="service-card physics-debug-controls" aria-label="Debug physics controls">
              <span class="eyebrow">Debug Physics</span>
              <div class="controls-card compact-controls">
                <button class="action-btn primary" type="button" data-action="test-physics-shot" data-testid="test-physics-shot"><span>Debug Impulse</span></button>
                <button class="action-btn secondary" type="button" data-action="reset-physics" data-testid="reset-physics"><span>Reset Physics</span></button>
              </div>
            </div>

            <div class="controls-card">
              <button class="action-btn secondary" type="button" data-action="pause" data-testid="pause-match"><span>Pause</span></button>
              <button class="action-btn secondary" type="button" data-action="settings" data-testid="hud-settings"><span>Settings</span></button>
              <button class="action-btn secondary" type="button" data-action="rules" data-testid="hud-rules"><span>Rules</span></button>
              <button class="action-btn danger" type="button" data-action="main-menu" data-testid="hud-menu"><span>Setup</span></button>
              <button class="action-btn danger" type="button" data-action="quit-match" data-testid="quit-match"><span>Quit Match</span></button>
              <button class="action-btn danger" type="button" data-action="leave-online-room" data-online-only hidden><span>Leave Room</span></button>
            </div>

            <button class="dev-result-btn physics-debug-controls" type="button" data-action="debug-result" data-testid="show-result-debug">
              Result Panel
            </button>
          </div>

          <div class="side-panel-section" data-panel-section="practice">
            <div class="service-card">
              <span class="eyebrow">Practice / Tutorial</span>
              <h3>Train The Table</h3>
              <p>Use real physics without match pressure. Reset drills, move to the next setup, or exit back to setup.</p>
              <div class="option-group" aria-label="Practice type selector">
                <span class="option-label">Practice Type</span>
                <div class="segmented-control segmented-control-cards">
                  ${renderPracticeButtons()}
                </div>
              </div>
              <div class="match-feedback-banner" data-practice-status data-tone="default">Choose a practice drill.</div>
              <div class="tutorial-card" data-tutorial-card hidden>
                <div class="tutorial-card-head">
                  <span class="eyebrow">Guided Tutorial</span>
                  <b data-tutorial-step>1/8</b>
                </div>
                <strong data-tutorial-title>Board Intro</strong>
                <p data-tutorial-instruction>This is your carrom board.</p>
                <div class="controls-card compact-controls">
                  <button class="action-btn secondary" type="button" data-action="tutorial-next"><span>Next Step</span></button>
                  <button class="action-btn danger" type="button" data-action="tutorial-exit"><span>Exit Tutorial</span></button>
                </div>
                <div class="controls-card compact-controls" data-tutorial-finish-actions hidden>
                  <button class="action-btn primary" type="button" data-action="tutorial-local"><span>Play Local Match</span></button>
                  <button class="action-btn secondary" type="button" data-action="tutorial-bot"><span>Play Vs Bot</span></button>
                  <button class="action-btn secondary" type="button" data-action="tutorial-practice"><span>Practice More</span></button>
                  <button class="action-btn secondary" type="button" data-action="tutorial-menu"><span>Main Menu</span></button>
                </div>
              </div>
              <div class="controls-card compact-controls">
                <button class="action-btn primary" type="button" data-action="start-practice"><span>Start Practice</span></button>
                <button class="action-btn secondary" type="button" data-action="start-tutorial"><span>Start Tutorial</span></button>
                <button class="action-btn secondary" type="button" data-action="reset-practice"><span>Reset Drill</span></button>
                <button class="action-btn secondary" type="button" data-action="next-practice"><span>Next Drill</span></button>
                <button class="action-btn danger" type="button" data-action="exit-practice"><span>Exit Practice</span></button>
              </div>
            </div>
          </div>

          <div class="side-panel-section" data-panel-section="challenges">
            <div class="service-card">
              <span class="eyebrow">Challenges</span>
              <h3>Solo Shot Trials</h3>
              <p>Complete curated shot objectives, earn stars, and keep progress locally on this device.</p>
              <div class="challenge-grid" data-challenge-list>${renderStaticChallengeCards()}</div>
              <div class="challenge-detail-card" data-challenge-detail>
                <span class="status-pill" data-challenge-detail-difficulty>easy</span>
                <strong data-challenge-detail-title>Easy Pocket I</strong>
                <p data-challenge-detail-objective>Pocket the white coin in 1 shot.</p>
                <small data-challenge-detail-progress>Best: 0 stars</small>
              </div>
              <div class="match-feedback-banner" data-challenge-result data-tone="default">Select a challenge.</div>
              <div class="controls-card compact-controls">
                <button class="action-btn primary" type="button" data-action="start-challenge"><span>Start Challenge</span></button>
                <button class="action-btn secondary" type="button" data-action="retry-challenge"><span>Retry</span></button>
                <button class="action-btn secondary" type="button" data-action="next-challenge"><span>Next</span></button>
                <button class="action-btn secondary" type="button" data-action="reset-challenge-progress"><span>Reset Stars</span></button>
                <button class="action-btn danger" type="button" data-action="exit-challenge"><span>Exit Challenge</span></button>
              </div>
            </div>
          </div>

          <div class="side-panel-section" data-panel-section="online">
            <div class="service-card online-suite">
              <span class="eyebrow">Online Private</span>
              <h3>Private Room</h3>
              <p>Create a room code or join a friend. Server-owned turns and rules keep both tables synced.</p>

              <div class="online-view is-active" data-online-view="menu">
                <div class="controls-card compact-controls">
                  <button class="action-btn primary" type="button" data-action="online-show-create"><span>Create Room</span></button>
                  <button class="action-btn secondary" type="button" data-action="online-show-join"><span>Join Room</span></button>
                </div>
              </div>

              <div class="online-view" data-online-view="reconnect">
                <div class="online-room-code-card">
                  <span class="label">Previous Session</span>
                  <strong data-online-reconnect-room>-----</strong>
                  <small>Player: <span data-online-reconnect-player>Player</span></small>
                </div>
                <div class="controls-card compact-controls">
                  <button class="action-btn primary" type="button" data-action="reconnect-online-session"><span>Reconnect</span></button>
                  <button class="action-btn secondary" type="button" data-action="discard-online-session"><span>Discard Session</span></button>
                </div>
              </div>

              <div class="online-view" data-online-view="create">
                <label class="text-field">
                  <span>Player Name</span>
                  <input id="onlineHostName" data-online-player-name type="text" maxlength="24" autocomplete="off" placeholder="Host" />
                </label>
                <div class="option-group">
                  <span class="option-label">Rules</span>
                  <div class="segmented-control">
                    <button type="button" class="is-selected" data-online-choice-group="ruleMode" data-online-choice-value="classic">Classic</button>
                    <button type="button" data-online-choice-group="ruleMode" data-online-choice-value="freeCapture">Free Capture</button>
                  </div>
                </div>
                <div class="option-group" data-online-classic-section>
                  <span class="option-label">Classic Rule Style</span>
                  <div class="segmented-control segmented-control-cards">
                    ${renderOnlineClassicVariantButtons()}
                  </div>
                </div>
                <div class="option-group" data-online-coin-section>
                  <span class="option-label">Coin Side</span>
                  <div class="segmented-control">
                    <button type="button" class="is-selected" data-online-choice-group="coinAssignmentMode" data-online-choice-value="p1White">Host White</button>
                    <button type="button" data-online-choice-group="coinAssignmentMode" data-online-choice-value="p1Black">Host Black</button>
                    <button type="button" data-online-choice-group="coinAssignmentMode" data-online-choice-value="random">Random</button>
                    <button type="button" data-online-choice-group="coinAssignmentMode" data-online-choice-value="firstPocket">Open / First Pocket</button>
                  </div>
                </div>
                <div class="controls-card compact-controls">
                  <button class="action-btn primary" type="button" data-action="create-online-room"><span>Create Room</span></button>
                  <button class="action-btn secondary" type="button" data-action="online-show-menu"><span>Back</span></button>
                </div>
              </div>

              <div class="online-view" data-online-view="join">
                <label class="text-field">
                  <span>Player Name</span>
                  <input id="onlineGuestName" data-online-join-name type="text" maxlength="24" autocomplete="off" placeholder="Guest" />
                </label>
                <label class="text-field">
                  <span>Room Code</span>
                  <input id="onlineRoomCode" data-online-room-code type="text" maxlength="8" autocomplete="off" placeholder="A7KQ2" />
                </label>
                <div class="controls-card compact-controls">
                  <button class="action-btn primary" type="button" data-action="join-online-room"><span>Join Room</span></button>
                  <button class="action-btn secondary" type="button" data-action="online-show-menu"><span>Back</span></button>
                </div>
              </div>

              <div class="online-view" data-online-view="lobby">
                <div class="online-room-code-card">
                  <span class="label">Room Code</span>
                  <strong data-online-room-code-label>-----</strong>
                  <button class="action-btn secondary" type="button" data-action="copy-online-room-code"><span>Copy</span></button>
                  <button class="action-btn primary" type="button" data-action="copy-online-room-link"><span>Share Link</span></button>
                </div>
                <div class="status-card compact-status-card">
                  <div class="status-row"><span class="label">Host</span><strong data-online-host>Waiting</strong></div>
                  <div class="status-row"><span class="label">Guest</span><strong data-online-guest>Waiting</strong></div>
                  <div class="status-row"><span class="label">Rules</span><strong data-online-rules>Classic / Casual</strong></div>
                  <div class="status-row"><span class="label">Status</span><strong data-online-status>Lobby</strong></div>
                </div>
                <div class="controls-card compact-controls">
                  <button class="action-btn primary" type="button" data-action="start-online-match" data-online-host-only><span>Start Match</span></button>
                  <button class="action-btn danger" type="button" data-action="leave-online-room"><span>Leave Room</span></button>
                </div>
              </div>

              <div class="online-view" data-online-view="playing">
                <div class="status-card compact-status-card">
                  <div class="status-row"><span class="label">Room</span><strong data-online-playing-room>-----</strong></div>
                  <div class="status-row"><span class="label">Connection</span><strong data-online-connection>Offline</strong></div>
                  <div class="status-row"><span class="label">Turn</span><strong data-online-turn>Waiting</strong></div>
                  <div class="status-row" data-online-timer-row hidden><span class="label">Timer</span><strong data-online-timer>Paused</strong></div>
                  <div class="status-row" data-online-grace-row hidden><span class="label">Reconnect</span><strong data-online-disconnect-countdown>0:00</strong></div>
                  <div class="status-row" data-online-rematch-row hidden><span class="label">Rematch</span><strong data-online-rematch-status>No rematch request</strong></div>
                  <div class="status-row online-debug-row" data-online-debug-row hidden><span class="label">Debug</span><strong data-online-debug-status>v0 / 0ms</strong></div>
                </div>
                <div class="controls-card compact-controls">
                  <button class="action-btn secondary online-debug-row" type="button" data-action="refresh-online-state" data-online-debug-row hidden><span>Force Snapshot</span></button>
                  <button class="action-btn primary" type="button" data-action="request-online-rematch" hidden><span>Request Rematch</span></button>
                  <button class="action-btn primary" type="button" data-action="accept-online-rematch" data-online-rematch-answer hidden><span>Accept Rematch</span></button>
                  <button class="action-btn secondary" type="button" data-action="decline-online-rematch" data-online-rematch-answer hidden><span>Decline</span></button>
                  <button class="action-btn danger" type="button" data-action="leave-online-room"><span>Leave Room</span></button>
                </div>
              </div>

              <div class="match-feedback-banner" data-online-message data-tone="default">Create or join a private room.</div>
            </div>
          </div>

          <div class="side-panel-section" data-panel-section="onlinePublic">
            <div class="service-card online-suite public-matchmaking-suite">
              <span class="eyebrow">Online Public</span>
              <h3>Public Matchmaking</h3>
              <p>Find a casual 3D Carrom opponent. Matched games use the same server-owned turns and rules as private rooms.</p>

              <div class="public-view is-active" data-public-view="form">
                <label class="text-field">
                  <span>Display Name</span>
                  <input id="publicPlayerName" data-public-player-name type="text" maxlength="24" autocomplete="off" placeholder="Player" />
                </label>
                <div class="option-group">
                  <span class="option-label">Rule Mode</span>
                  <div class="segmented-control">
                    <button type="button" data-public-choice-group="ruleMode" data-public-choice-value="classic">Classic</button>
                    <button type="button" data-public-choice-group="ruleMode" data-public-choice-value="freeCapture">Free Capture</button>
                    <button type="button" class="is-selected" data-public-choice-group="ruleMode" data-public-choice-value="any">Any</button>
                  </div>
                </div>
                <div class="option-group" data-public-classic-section>
                  <span class="option-label">Classic Rule Style</span>
                  <div class="segmented-control segmented-control-cards">
                    ${renderPublicClassicVariantButtons()}
                  </div>
                </div>
                <div class="option-group" data-public-coin-section>
                  <span class="option-label">Coin Side</span>
                  <div class="segmented-control">
                    <button type="button" class="is-selected" data-public-choice-group="coinAssignmentMode" data-public-choice-value="random">Random</button>
                    <button type="button" data-public-choice-group="coinAssignmentMode" data-public-choice-value="firstPocket">Open / First Pocket</button>
                    <button type="button" data-public-choice-group="coinAssignmentMode" data-public-choice-value="any">Any</button>
                  </div>
                </div>
                <div class="option-group is-disabled">
                  <span class="option-label">Bot Fill</span>
                  <div class="segmented-control">
                    <button type="button" class="is-selected" disabled aria-disabled="true">Coming Soon</button>
                  </div>
                </div>
                <div class="controls-card compact-controls">
                  <button class="action-btn primary" type="button" data-action="join-public-queue"><span>Find Match</span></button>
                  <button class="action-btn secondary" type="button" data-action="open-online"><span>Private Rooms</span></button>
                  <button class="action-btn secondary" type="button" data-action="open-local-setup"><span>Back</span></button>
                </div>
              </div>

              <div class="public-view" data-public-view="queued">
                <div class="online-room-code-card queue-card">
                  <span class="label">Searching</span>
                  <strong data-public-wait>0:00</strong>
                  <small data-public-preferences>Any Rules</small>
                </div>
                <div class="status-card compact-status-card">
                  <div class="status-row"><span class="label">Players Waiting</span><strong data-public-waiting-count>0</strong></div>
                  <div class="status-row"><span class="label">Connection</span><strong data-public-connection>Connected</strong></div>
                </div>
                <div class="controls-card compact-controls">
                  <button class="action-btn danger" type="button" data-action="cancel-public-queue"><span>Cancel Queue</span></button>
                </div>
              </div>

              <div class="public-view" data-public-view="matched">
                <div class="online-room-code-card queue-card">
                  <span class="label">Match Found</span>
                  <strong data-public-opponent>Opponent</strong>
                  <small>Starting public match...</small>
                </div>
                <div class="status-card compact-status-card">
                  <div class="status-row"><span class="label">Room</span><strong data-public-room>-----</strong></div>
                  <div class="status-row"><span class="label">Rules</span><strong data-public-preferences>Any Rules</strong></div>
                </div>
              </div>

              <div class="match-feedback-banner" data-public-message data-tone="default">Find a casual 3D Carrom opponent.</div>
            </div>
          </div>

          <div class="side-panel-section" data-panel-section="customize">
            <div class="service-card cosmetic-suite">
              <span class="eyebrow">Cosmetics</span>
              <h3>Customize The Table</h3>
              <p>Preview skins directly on the live 3D carrom scene. Equip saves the loadout on this device.</p>

              <div class="option-group" aria-label="Cosmetic category selector">
                <span class="option-label">Category</span>
                <div class="segmented-control segmented-control-cards cosmetic-category-tabs">
                  ${renderCosmeticCategoryButtons()}
                </div>
              </div>

              <div class="cosmetic-preview-card">
                <span class="status-pill" data-cosmetic-detail-status>Available</span>
                <strong data-cosmetic-detail-name>Ivory Royale</strong>
                <p data-cosmetic-detail-description>Default table loadout.</p>
                <small data-cosmetic-detail-summary>Ivory Royale / Classic Carrom / Ivory Striker / Ivory Lounge / Classic Gold</small>
              </div>

              <div class="cosmetic-grid" data-cosmetic-grid>
                ${renderCosmeticCards()}
              </div>

              <div class="match-feedback-banner" data-cosmetic-message data-tone="default">Select a cosmetic to preview it on the live 3D table.</div>
              <div class="controls-card compact-controls">
                <button class="action-btn primary" type="button" data-action="equip-cosmetic"><span>Equip Loadout</span></button>
                <button class="action-btn secondary" type="button" data-action="reset-cosmetics"><span>Reset Default</span></button>
                <button class="action-btn secondary" type="button" data-action="close-customize"><span>Back</span></button>
              </div>
            </div>
          </div>

          <div class="side-panel-section" data-panel-section="rules">
            <div class="service-card">
              <span class="eyebrow">Rules / Help</span>
              <h3>How The Table Plays</h3>
              <div class="side-rules-list">${renderRuleCards()}</div>
            </div>
          </div>

          <div class="side-panel-section" data-panel-section="settings">
            <div class="service-card">
              <span class="eyebrow">Settings</span>
              <h3>Table Preferences</h3>
              <div class="settings-list side-settings-list">
                <label class="toggle-row">
                  <span><strong>Sound</strong><small>Enable generated table cues.</small></span>
                  <input type="checkbox" data-setting-toggle="sound" />
                </label>
                <label class="toggle-row">
                  <span><strong>Music</strong><small>Store lounge ambience preference.</small></span>
                  <input type="checkbox" data-setting-toggle="music" />
                </label>
                <label class="toggle-row">
                  <span><strong>Camera Motion</strong><small>Allow cinematic board movement.</small></span>
                  <input type="checkbox" data-setting-toggle="cameraMotion" />
                </label>
                <label class="toggle-row">
                  <span><strong>Reduced Effects</strong><small>Calm major animations.</small></span>
                  <input type="checkbox" data-setting-toggle="reducedEffects" />
                </label>
              </div>
              <div class="option-group">
                <span class="option-label">Theme</span>
                <div class="segmented-control" data-setting-group="themeId">${renderThemeButtons()}</div>
              </div>
              <div class="option-group">
                <span class="option-label">Quality</span>
                <div class="segmented-control" data-setting-group="quality">
                  ${renderQualityButtons()}
                </div>
              </div>
              <div class="controls-card compact-controls">
                <button class="action-btn secondary" type="button" data-action="open-customize"><span>Customize Board</span></button>
                <button class="action-btn secondary" type="button" data-action="reset-settings"><span>Reset Settings</span></button>
                <button class="action-btn secondary" type="button" data-action="reset-onboarding"><span>Reset Onboarding</span></button>
              </div>
            </div>
          </div>

          <div class="side-panel-section" data-panel-section="about">
            <div class="service-card">
              <span class="eyebrow">About / Credits</span>
              <h3>3D Carrom Royale</h3>
              <p>Standalone premium tabletop experience built for real physics, bot play, challenge drills, cosmetics, and local carrom.</p>
              <div class="home-doc-card">
                <strong>Visual family</strong>
                <span>Styled with a premium board-game feel while keeping its own carrom lounge identity.</span>
              </div>
              <div class="home-doc-card">
                <strong>Local customization</strong>
                <span>Cosmetic selections are saved locally on this device. Future unlock labels are visual hooks only in this standalone build.</span>
              </div>
            </div>
          </div>
        </aside>

        <div class="top-match-bar">
          <div class="game-topbar-ledger">
            <span class="eyebrow">Live Table</span>
            <div class="match-ledger-row">
              <strong>3D Carrom Royale</strong>
              <span data-topbar-match>Player 1 vs Player 2</span>
            </div>
            <div class="top-score-strip" aria-label="Live scores">
              <div class="top-score-card is-active" data-topbar-player-card="player-1">
                <span data-topbar-p1-name>Player 1</span>
                <strong data-topbar-p1-score>0/9</strong>
                <em data-topbar-p1-color>White</em>
              </div>
              <div class="top-score-card" data-topbar-player-card="player-2">
                <span data-topbar-p2-name>Player 2</span>
                <strong data-topbar-p2-score>0/9</strong>
                <em data-topbar-p2-color>Black</em>
              </div>
              <div class="top-score-card top-score-card-status">
                <span>Turn</span>
                <strong data-topbar-turn>Player 1</strong>
                <em data-topbar-queen>Queen on board</em>
              </div>
            </div>
          </div>
          <div class="game-topbar-actions">
            <button class="action-btn secondary" type="button" data-action="toggle-hud" aria-label="Toggle side panel">Panel</button>
            <button class="action-btn secondary" type="button" data-action="settings" aria-label="Open settings">Settings</button>
            <button class="action-btn secondary" type="button" data-action="rules" aria-label="Open rules">Rules</button>
            <button class="action-btn danger" type="button" data-action="main-menu" aria-label="Return to match setup">Setup</button>
            <button class="action-btn danger" type="button" data-action="quit-match" aria-label="Quit current match">Quit</button>
          </div>
        </div>

        <aside class="coach-hint-card" data-coach-hint data-tone="default" aria-live="polite">
          <span class="eyebrow">Coach</span>
          <p data-coach-message>Pull back from the striker to increase power.</p>
          <button type="button" data-action="dismiss-coach" aria-label="Dismiss coach hint">Dismiss</button>
        </aside>

        <section class="onboarding-overlay" data-onboarding-overlay aria-hidden="true" aria-label="First time onboarding">
          <div class="onboarding-panel shimmer-panel">
            <span class="eyebrow">Learn The Table</span>
            <b data-onboarding-step>1/6</b>
            <h2 data-onboarding-title>Welcome to 3D Carrom Royale</h2>
            <p data-onboarding-body>Learn smooth striker control, queen cover, and premium carrom flow.</p>
            <div class="controls-card compact-controls">
              <button class="action-btn secondary" type="button" data-action="onboarding-prev"><span>Back</span></button>
              <button class="action-btn primary" type="button" data-action="onboarding-next"><span>Next</span></button>
            </div>
            <div class="controls-card compact-controls" data-onboarding-final-actions hidden>
              <button class="action-btn primary" type="button" data-action="onboarding-start-tutorial"><span>Start Tutorial</span></button>
              <button class="action-btn secondary" type="button" data-action="onboarding-start-practice"><span>Practice Mode</span></button>
              <button class="action-btn secondary" type="button" data-action="onboarding-skip"><span>Skip to Menu</span></button>
            </div>
          </div>
        </section>
      </section>
    `;
  }

  update(root, match) {
    const setText = (selector, value) => {
      const element = root.querySelector(selector);
      if (element) {
        element.textContent = value;
      }
    };

    const p1Remaining = String(match.playerOneRemaining ?? 9);
    const p2Remaining = String(match.playerTwoRemaining ?? 9);
    const p1Score = match.playerOneScore || '0/9';
    const p2Score = match.playerTwoScore || '0/9';
    const p1Points = Number(match.playerOnePoints) || 0;
    const p2Points = Number(match.playerTwoPoints) || 0;
    const pointsEnabled = match.scoringMode === 'points';
    const freeCapture = match.ruleMode === 'freeCapture';
    const vsBot = match.matchMode === 'vsBot';
    const onlineActive = match.matchMode === 'onlinePrivate' || match.matchMode === 'onlinePublic' || Boolean(match.onlineActive);
    const challengeActive = Boolean(match.challengeActive);
    const practiceActive = Boolean(match.practiceActive);
    const difficultyLabel = match.botDifficultyLabel
      || BOT_DIFFICULTY_LABELS[match.botDifficulty]
      || '';

    setText('[data-hud-match-mode]', match.matchModeLabel || (vsBot ? 'Vs Bot' : 'Local 2 Player'));
    setText('[data-hud-bot-name]', vsBot ? match.playerTwoName || 'Bot' : '');
    setText('[data-hud-bot-difficulty]', difficultyLabel ? `(${difficultyLabel})` : '');
    setText('[data-hud-current-turn]', match.currentTurn);
    setText('[data-hud-rule-mode]', match.ruleModeLabel || 'Classic Carrom');
    setText('[data-hud-due]', match.dueStatus || 'Clear');
    setText('[data-hud-challenge-title]', match.challengeTitle || '');
    setText('[data-hud-challenge-shots]', match.challengeShots ? `(${match.challengeShots})` : '');
    setText('[data-hud-practice-title]', match.practiceTitle || '');
    setText('[data-hud-online-room]', match.onlineRoomCode ? `Room ${match.onlineRoomCode}` : '');
    setText('[data-hud-online-connection]', match.onlineConnectionStatus || '');
    setText('[data-hud-online-timer]', match.onlineTurnTimer || '');
    setText('[data-hud-current-color]', match.currentColor || 'Unassigned');
    setText('[data-hud-turn]', match.turnNumber || '1');
    setText('[data-hud-shot]', match.shotNumber || '0');
    setText('[data-hud-p1-name]', match.playerOneName);
    setText('[data-hud-p2-name]', match.playerTwoName);
    setText('[data-hud-p1-score]', p1Score);
    setText('[data-hud-p2-score]', p2Score);
    setText('[data-hud-p1-score-label]', freeCapture ? 'captured' : 'pocketed');
    setText('[data-hud-p2-score-label]', freeCapture ? 'captured' : 'pocketed');
    setText('[data-hud-p1-color]', match.playerOneColor || 'Unassigned');
    setText('[data-hud-p2-color]', match.playerTwoColor || 'Unassigned');
    setText('[data-hud-p1-points]', `${p1Points} pts`);
    setText('[data-hud-p2-points]', `${p2Points} pts`);
    setText('[data-hud-p1-remaining]', p1Remaining);
    setText('[data-hud-p2-remaining]', p2Remaining);
    setText('[data-hud-foul]', match.foulStatus || 'Clear');
    setText('[data-hud-points]', pointsEnabled ? `${p1Points} - ${p2Points}` : 'Coins mode');
    setText('[data-hud-queen]', match.queenStatus);
    setText('[data-hud-power]', match.shotPower);
    setText('[data-topbar-match]', `${match.playerOneName} vs ${match.playerTwoName}`);
    setText('[data-topbar-p1-name]', match.playerOneName || 'Player 1');
    setText('[data-topbar-p2-name]', match.playerTwoName || 'Player 2');
    setText('[data-topbar-p1-score]', pointsEnabled ? `${p1Points} pts | ${p1Score}` : `${p1Score} | ${p1Remaining} left`);
    setText('[data-topbar-p2-score]', pointsEnabled ? `${p2Points} pts | ${p2Score}` : `${p2Score} | ${p2Remaining} left`);
    setText('[data-topbar-p1-color]', match.playerOneColor || 'Unassigned');
    setText('[data-topbar-p2-color]', match.playerTwoColor || 'Unassigned');
    setText('[data-topbar-turn]', match.currentTurn || 'Player 1');
    setText('[data-topbar-queen]', match.queenStatus || 'Queen on board');
    setText('[data-practice-status]', match.practiceStatus || match.status || 'Choose a practice drill.');
    setText('[data-challenge-result]', match.challengeResult
      ? `${match.challengeResult} | ${match.status || ''}`
      : match.status || 'Select a challenge.');

    root.querySelectorAll('[data-hud-bot-row]').forEach((row) => {
      row.hidden = !vsBot;
      row.classList.toggle('is-visible', vsBot);
    });
    root.querySelectorAll('[data-hud-due-row]').forEach((row) => {
      const visible = Boolean(match.dueStatus);
      row.hidden = !visible;
      row.classList.toggle('is-visible', visible);
    });
    root.querySelectorAll('[data-hud-challenge-row]').forEach((row) => {
      row.hidden = !challengeActive;
      row.classList.toggle('is-visible', challengeActive);
    });
    root.querySelectorAll('[data-hud-practice-row]').forEach((row) => {
      row.hidden = !practiceActive;
      row.classList.toggle('is-visible', practiceActive);
    });
    root.querySelectorAll('[data-hud-online-row]').forEach((row) => {
      row.hidden = !onlineActive;
      row.classList.toggle('is-visible', onlineActive);
    });
    root.querySelectorAll('[data-hud-online-timer-row]').forEach((row) => {
      const visible = onlineActive && Boolean(match.onlineTurnTimer);
      row.hidden = !visible;
      row.classList.toggle('is-visible', visible);
      row.classList.toggle('is-warning', Boolean(match.onlineTurnTimerLow));
    });
    root.querySelectorAll('[data-online-only]').forEach((element) => {
      element.hidden = !onlineActive;
      element.classList.toggle('is-visible', onlineActive);
    });

    const banner = root.querySelector('[data-hud-banner]');
    if (banner) {
      banner.textContent = match.status || 'Ready for local match.';
      banner.dataset.tone = match.bannerTone || 'default';
    }
    const powerFill = root.querySelector('[data-hud-power-fill]');
    if (powerFill) {
      const ratio = Math.min(Math.max(Number(match.shotPowerRatio) || 0, 0), 1);
      powerFill.style.transform = `scaleX(${ratio})`;
    }
    root.querySelectorAll('[data-hud-status]').forEach((element) => {
      element.textContent = match.status;
    });

    root.querySelectorAll('[data-hud-player-card], [data-topbar-player-card]').forEach((card) => {
      const isPlayerOne = card.dataset.hudPlayerCard === 'player-1' || card.dataset.topbarPlayerCard === 'player-1';
      const active = isPlayerOne
        ? match.currentTurn === match.playerOneName
        : match.currentTurn === match.playerTwoName;
      card.classList.toggle('is-active', active);
    });
    root.querySelectorAll('[data-points-row], .point-pill').forEach((element) => {
      element.classList.toggle('is-visible', pointsEnabled);
    });
  }
}
