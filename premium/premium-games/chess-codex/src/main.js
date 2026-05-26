import './style.css';
import { Chess3DApp } from './chess3d-app.js';

const root = document.querySelector('#app');

root.innerHTML = `
  <div class="app-shell">
    <div class="backdrop"></div>
    <div id="landscapeOverlay" class="mobile-landscape-overlay" aria-hidden="true">
      <div class="mobile-landscape-card">
        <span class="eyebrow">Landscape mode</span>
        <h2>Rotate your phone</h2>
        <p>Imperial Chess 3D opens the board in landscape so the pieces, timers, and touch controls have room.</p>
      </div>
    </div>
    <button
      id="hudToggleBtn"
      class="hud-toggle"
      type="button"
      aria-expanded="true"
      aria-controls="hudPanel"
      aria-label="Hide side panel"
    >
      <span class="hud-toggle-icon" aria-hidden="true"></span>
      <span class="hud-toggle-label">Hide Panel</span>
    </button>

    <div id="hudPanel" class="hud">
      <div class="brand">
        <span class="eyebrow">Premium Match Suite</span>
        <h1>Imperial Chess 3D</h1>
        <p>Classic strategy, now playable across the table, against the engine, or across the network.</p>
        <div class="brand-signature" aria-label="Powered by MH HORIZON">
          <span class="brand-signature-label">Powered by</span>
          <strong class="brand-signature-name">MH HORIZON</strong>
        </div>
      </div>

      <div class="mode-card">
        <span class="eyebrow">Play Mode</span>
        <div class="segmented-control" role="tablist" aria-label="Game mode">
          <button id="localModeBtn" class="mode-chip is-active" type="button">Local</button>
          <button id="aiModeBtn" class="mode-chip" type="button">Vs AI</button>
          <button id="onlineModeBtn" class="mode-chip" type="button">Online</button>
        </div>
        <div class="meta-grid">
          <div class="meta-row">
            <span class="label">Mode</span>
            <strong id="modeLabel">Local</strong>
          </div>
          <div class="meta-row meta-row--side">
            <span class="label">Side</span>
            <span class="side-name-editor">
              <strong id="sideLabel">Both sides</strong>
              <button id="sideNameEditBtn" class="inline-edit-btn" type="button" aria-label="Edit player names">Edit</button>
            </span>
          </div>
          <div class="meta-row">
            <span class="label">Room</span>
            <strong id="roomLabel">Offline</strong>
          </div>
          <div class="meta-row">
            <span class="label">Network</span>
            <strong id="connectionLabel">Local ready</strong>
          </div>
        </div>
      </div>

      <div class="mode-card variant-card">
        <span class="eyebrow">Game Variant</span>
        <div class="segmented-control variant-grid" role="tablist" aria-label="Game variants">
          <button id="classicVariantBtn" class="mode-chip compact is-active" type="button">Classic</button>
          <button id="blitzVariantBtn" class="mode-chip compact" type="button">Blitz</button>
          <button id="puzzleVariantBtn" class="mode-chip compact" type="button">Puzzle</button>
          <button id="dailyVariantBtn" class="mode-chip compact" type="button">Daily</button>
          <button id="customVariantBtn" class="mode-chip compact" type="button">Custom</button>
        </div>
        <div class="meta-row inline">
          <span class="label">Current</span>
          <strong id="variantLabel">Classic</strong>
        </div>
      </div>

      <div class="service-card">
        <span class="eyebrow">Theme</span>
        <div class="service-content">
          <div class="segmented-control compact triple" role="tablist" aria-label="Theme">
            <button id="themeIvoryBtn" class="mode-chip compact is-active" type="button">Ivory</button>
            <button id="themeMidnightBtn" class="mode-chip compact" type="button">Midnight</button>
            <button id="themeRegalBtn" class="mode-chip compact" type="button">Regal</button>
          </div>
          <div class="meta-row inline">
            <span class="label">Palette</span>
            <strong id="themeLabel">Ivory</strong>
          </div>
        </div>
      </div>

      <div class="status-card">
        <div class="status-row">
          <span class="label">Turn</span>
          <strong id="turnLabel">White</strong>
        </div>
        <div class="status-row">
          <span class="label">State</span>
          <strong id="stateLabel">White to move</strong>
        </div>
        <div class="status-row">
          <span class="label">Last Move</span>
          <strong id="moveLabel">Opening position</strong>
        </div>
      </div>

      <div id="blitzPanel" class="service-card hidden" aria-hidden="true">
        <span class="eyebrow">Blitz Control</span>
        <div class="service-content">
          <div class="segmented-control compact triple" role="tablist" aria-label="Blitz time control">
            <button id="blitz1Btn" class="mode-chip compact" type="button">1 min</button>
            <button id="blitz3Btn" class="mode-chip compact is-active" type="button">3 min</button>
            <button id="blitz5Btn" class="mode-chip compact" type="button">5 min</button>
          </div>
          <div class="meta-row inline">
            <span class="label">Clock</span>
            <strong id="blitzStatusLabel">3 minutes per side</strong>
          </div>
        </div>
      </div>

      <div id="puzzlePanel" class="service-card hidden" aria-hidden="true">
        <span class="eyebrow">Puzzle Suite</span>
        <div class="service-content">
          <div class="service-stack">
            <span class="label">Difficulty</span>
            <div class="segmented-control compact quad" role="tablist" aria-label="Puzzle difficulty">
              <button id="puzzleAllBtn" class="mode-chip compact is-active" type="button">All</button>
              <button id="puzzleEasyBtn" class="mode-chip compact" type="button">Easy</button>
              <button id="puzzleMediumBtn" class="mode-chip compact" type="button">Medium</button>
              <button id="puzzleHardBtn" class="mode-chip compact" type="button">Hard</button>
            </div>
          </div>
          <div class="meta-row inline">
            <span class="label">Puzzle</span>
            <strong id="puzzleTitleLabel">Select a puzzle</strong>
          </div>
          <div class="meta-row inline">
            <span class="label">Goal</span>
            <strong id="puzzleObjectiveLabel">Checkmate challenge</strong>
          </div>
          <div class="meta-row inline">
            <span class="label">Level</span>
            <strong id="puzzleDifficultyLabel">All difficulties</strong>
          </div>
          <div class="meta-row inline">
            <span class="label">Progress</span>
            <strong id="puzzleProgressLabel">Step 1 of 1</strong>
          </div>
          <div class="meta-row inline">
            <span class="label">Timer</span>
            <strong id="puzzleTimerLabel">00:00</strong>
          </div>
          <div class="feedback-band">
            <span class="label">Feedback</span>
            <strong id="puzzleFeedbackLabel">Find the winning line.</strong>
          </div>
          <div class="stacked-actions triple">
            <button id="nextPuzzleBtn" class="action-btn secondary" type="button">Next Puzzle</button>
            <button id="resetPuzzleBtn" class="action-btn secondary" type="button">Reset Puzzle</button>
            <button id="hintPuzzleBtn" class="action-btn secondary" type="button">Hint</button>
          </div>
        </div>
      </div>

      <div id="dailyPanel" class="service-card hidden" aria-hidden="true">
        <span class="eyebrow">Daily Challenge</span>
        <div class="service-content">
          <div class="meta-row inline">
            <span class="label">Today</span>
            <strong id="dailyPuzzleLabel">Daily puzzle ready</strong>
          </div>
          <div class="meta-row inline">
            <span class="label">Goal</span>
            <strong id="dailyObjectiveLabel">Checkmate challenge</strong>
          </div>
          <div class="meta-row inline">
            <span class="label">Level</span>
            <strong id="dailyDifficultyLabel">Rotating challenge</strong>
          </div>
          <div class="meta-row inline">
            <span class="label">Timer</span>
            <strong id="dailyTimerLabel">00:00</strong>
          </div>
          <div class="meta-row inline">
            <span class="label">Progress</span>
            <strong id="dailyStatusLabel">Unsolved today</strong>
          </div>
          <div class="feedback-band">
            <span class="label">Feedback</span>
            <strong id="dailyFeedbackLabel">Load the daily puzzle to begin.</strong>
          </div>
          <div class="stacked-actions triple">
            <button id="loadDailyBtn" class="action-btn primary" type="button">Load Daily</button>
            <button id="dailyResetBtn" class="action-btn secondary" type="button">Restart Daily</button>
            <button id="hintDailyBtn" class="action-btn secondary" type="button">Hint</button>
          </div>
        </div>
      </div>

      <div id="customPanel" class="service-card hidden" aria-hidden="true">
        <span class="eyebrow">Custom Board</span>
        <div class="service-content">
          <div class="meta-row inline">
            <span class="label">Status</span>
            <strong id="customStatusLabel">Edit the starting position</strong>
          </div>
          <div class="service-stack">
            <span class="label">Piece Color</span>
            <div class="segmented-control compact" role="tablist" aria-label="Custom piece color">
              <button id="customWhiteBtn" class="mode-chip compact is-active" type="button">White</button>
              <button id="customBlackBtn" class="mode-chip compact" type="button">Black</button>
            </div>
          </div>
          <div class="service-stack">
            <span class="label">Selected Piece</span>
            <div class="segmented-control triple piece-grid" role="tablist" aria-label="Custom piece selection">
              <button id="customKingBtn" class="mode-chip compact is-active" type="button">King</button>
              <button id="customQueenBtn" class="mode-chip compact" type="button">Queen</button>
              <button id="customRookBtn" class="mode-chip compact" type="button">Rook</button>
              <button id="customBishopBtn" class="mode-chip compact" type="button">Bishop</button>
              <button id="customKnightBtn" class="mode-chip compact" type="button">Knight</button>
              <button id="customPawnBtn" class="mode-chip compact" type="button">Pawn</button>
              <button id="customEraseBtn" class="mode-chip compact danger-chip" type="button">Erase</button>
            </div>
          </div>
          <div class="replay-actions custom-actions">
            <button id="customToggleEditBtn" class="action-btn secondary" type="button">Edit Mode</button>
            <button id="customStartBtn" class="action-btn primary" type="button">Start Match</button>
            <button id="customClearBtn" class="action-btn secondary" type="button">Clear Board</button>
            <button id="customStandardBtn" class="action-btn secondary" type="button">Standard Setup</button>
          </div>
        </div>
      </div>

      <div id="replayPanel" class="service-card hidden" aria-hidden="true">
        <span class="eyebrow">Replay Controls</span>
        <div class="service-content">
          <div class="meta-row inline">
            <span class="label">Progress</span>
            <strong id="replayProgressLabel">Replay idle</strong>
          </div>
          <div class="replay-actions">
            <button id="replayPrevBtn" class="action-btn secondary" type="button">Previous</button>
            <button id="replayPlayBtn" class="action-btn primary" type="button">Play</button>
            <button id="replayNextBtn" class="action-btn secondary" type="button">Next</button>
            <button id="replayExitBtn" class="action-btn secondary" type="button">Exit Replay</button>
          </div>
        </div>
      </div>

      <div id="aiPanel" class="service-card hidden" aria-hidden="true">
        <span class="eyebrow">AI Opponent</span>
        <div class="service-content">
          <div class="service-title">Stockfish Worker</div>
          <div class="service-stack">
            <span class="label">Difficulty</span>
            <div class="segmented-control compact quint" role="tablist" aria-label="AI difficulty">
              <button id="aiBeginnerBtn" class="mode-chip compact" type="button">Beginner</button>
              <button id="aiEasyBtn" class="mode-chip compact is-active" type="button">Easy</button>
              <button id="aiMediumBtn" class="mode-chip compact" type="button">Medium</button>
              <button id="aiHardBtn" class="mode-chip compact" type="button">Hard</button>
              <button id="aiMasterBtn" class="mode-chip compact" type="button">Master</button>
            </div>
          </div>
          <div class="service-stack">
            <span class="label">Style</span>
            <div class="segmented-control compact quad" role="tablist" aria-label="AI style">
              <button id="aiBalancedStyleBtn" class="mode-chip compact is-active" type="button">Balanced</button>
              <button id="aiAggressiveStyleBtn" class="mode-chip compact" type="button">Aggressive</button>
              <button id="aiSolidStyleBtn" class="mode-chip compact" type="button">Solid</button>
              <button id="aiTrickyStyleBtn" class="mode-chip compact" type="button">Tricky</button>
            </div>
          </div>
          <div class="meta-row inline">
            <span class="label">Engine</span>
            <strong id="aiStatusLabel">Player controls White</strong>
          </div>
          <div class="meta-row inline">
            <span class="label">Book</span>
            <strong id="aiBookLabel">Opening book ready</strong>
          </div>
          <div class="meta-row inline">
            <span class="label">Style Note</span>
            <strong id="aiStyleLabel">Balanced classical play</strong>
          </div>
          <div class="meta-row inline">
            <span class="label">Engine Eval</span>
            <strong id="aiEvalLabel">Waiting for position</strong>
          </div>
        </div>
      </div>

      <div id="onlinePanel" class="service-card hidden" aria-hidden="true">
        <span class="eyebrow">Online Room</span>
        <div class="service-content">
          <div class="service-title">Real-time Matchmaking</div>
          <button id="findPublicMatchBtn" class="action-btn primary public-match-btn" type="button">
            Find Public Match
          </button>
          <div class="service-stack">
            <span class="label">Seat Preference</span>
            <div class="segmented-control compact triple" role="tablist" aria-label="Online color preference">
              <button id="onlineAutoColorBtn" class="mode-chip compact is-active" type="button">Auto</button>
              <button id="onlineWhiteColorBtn" class="mode-chip compact" type="button">White</button>
              <button id="onlineBlackColorBtn" class="mode-chip compact" type="button">Black</button>
            </div>
          </div>
          <div class="stacked-actions">
            <button id="createRoomBtn" class="action-btn secondary" type="button">Create Room</button>
            <button id="copyRoomBtn" class="action-btn secondary" type="button">Copy Invite</button>
          </div>
          <div class="join-row">
            <input id="roomInput" class="room-input" type="text" maxlength="140" placeholder="Room code or invite URL" autocomplete="off" />
            <button id="joinRoomBtn" class="action-btn primary join-btn" type="button">Join</button>
          </div>
          <div class="stacked-actions">
            <button id="reconnectRoomBtn" class="action-btn secondary" type="button">Reconnect</button>
            <button id="leaveRoomBtn" class="action-btn secondary" type="button">Leave Room</button>
          </div>
          <div class="meta-row inline">
            <span class="label">Status</span>
            <strong id="onlineStatusLabel">Create a room or join an existing match.</strong>
          </div>
          <div class="meta-row inline">
            <span class="label">Continuity</span>
            <strong id="onlineReconnectLabel">Room persistence standby</strong>
          </div>
          <div id="undoApprovalPanel" class="approval-panel hidden" aria-hidden="true">
            <div class="approval-copy">
              <span class="label">Undo</span>
              <strong id="undoRequestLabel">No undo request pending.</strong>
            </div>
            <div class="approval-actions">
              <button id="acceptUndoBtn" class="action-btn primary" type="button">Accept</button>
              <button id="declineUndoBtn" class="action-btn secondary" type="button">Decline</button>
            </div>
          </div>
          <div id="rematchApprovalPanel" class="approval-panel hidden" aria-hidden="true">
            <div class="approval-copy">
              <span class="label">Rematch</span>
              <strong id="rematchRequestLabel">No rematch request pending.</strong>
            </div>
            <div class="approval-actions">
              <button id="acceptRematchBtn" class="action-btn primary" type="button">Accept</button>
              <button id="declineRematchBtn" class="action-btn secondary" type="button">Decline</button>
            </div>
          </div>
        </div>
      </div>

      <div id="drawApprovalPanel" class="service-card hidden" aria-hidden="true">
        <span class="eyebrow">Draw Offer</span>
        <div class="service-content">
          <div class="approval-copy">
            <span class="label">Decision</span>
            <strong id="drawRequestLabel">No draw offer pending.</strong>
          </div>
          <div class="approval-actions">
            <button id="acceptDrawBtn" class="action-btn primary" type="button">Accept Draw</button>
            <button id="declineDrawBtn" class="action-btn secondary" type="button">Decline</button>
          </div>
        </div>
      </div>

      <div class="controls-card">
        <button id="startGameBtn" class="action-btn primary" type="button">Start Game</button>
        <button id="undoBtn" class="action-btn secondary" type="button">Undo Move</button>
        <button id="restartBtn" class="action-btn secondary" type="button">New Game</button>
      </div>

      <div class="service-card home-link-card">
        <span class="eyebrow">Suite Guide</span>
        <div class="service-content">
          <button id="openHomeGuideBtn" class="action-btn secondary full-width" type="button">Open Home Page</button>
        </div>
      </div>

      <div class="legend-card">
        <span>Click a piece to select it, then click a glowing destination square.</span>
        <span>Drag to orbit, scroll to zoom, right-drag to pan.</span>
      </div>
    </div>

    <div class="board-frame">
      <div id="evalBar" class="eval-bar hidden" aria-hidden="true">
        <div id="evalBarFill" class="eval-bar-fill"></div>
        <div class="eval-bar-caps">
          <span class="eval-bar-side white">White</span>
          <span class="eval-bar-side black">Black</span>
        </div>
        <strong id="evalBarLabel" class="eval-bar-label">0.0</strong>
      </div>
      <div class="game-topbar">
        <div id="whiteTimerBox" class="timer-pill hidden">
          <span id="whiteTimerName" class="timer-name">White</span>
          <strong id="whiteTimerLabel">03:00</strong>
        </div>
        <div class="game-topbar-ledger">
          <span class="eyebrow">Move Ledger</span>
          <div id="moveHistoryList" class="move-history-list">
            <div class="move-history-empty">No moves yet.</div>
          </div>
        </div>
        <div id="blackTimerBox" class="timer-pill hidden">
          <span id="blackTimerName" class="timer-name">Black</span>
          <strong id="blackTimerLabel">03:00</strong>
        </div>
        <button id="matchPanelToggleBtn" class="match-panel-toggle" type="button" aria-controls="matchActionPanel" aria-expanded="false">
          <span class="match-panel-toggle-mark" aria-hidden="true"></span>
          <span class="match-panel-toggle-label">Match</span>
        </button>
        <div id="matchActionPanel" class="game-topbar-actions" aria-label="Match actions">
          <button id="nameSettingsBtn" class="action-btn secondary compact-btn" type="button">Names</button>
          <button id="drawBtn" class="action-btn secondary compact-btn" type="button">Offer Draw</button>
          <button id="cinematicCameraBtn" class="action-btn secondary compact-btn" type="button" aria-pressed="true">Cinema On</button>
          <button id="replayMatchBtn" class="action-btn secondary compact-btn" type="button">Replay Match</button>
          <button id="resetViewBtn" class="action-btn secondary compact-btn" type="button">Reset View</button>
          <button id="quitBtn" class="action-btn danger compact-btn" type="button">Quit Match</button>
        </div>
      </div>
      <canvas id="chessCanvas" aria-label="3D chess board"></canvas>
      <div id="impactOverlay" class="impact-overlay" aria-hidden="true"></div>
      <div class="build-badge" aria-label="Version 1.2.0">
        <span class="build-badge-label">v1.2.0</span>
      </div>
    </div>

    <div id="homeOverlay" class="home-overlay" aria-hidden="false">
      <div class="home-card">
        <div class="home-hero">
          <div class="home-hero-copy">
            <span class="eyebrow">Imperial Matchroom</span>
            <h2>Imperial Chess 3D</h2>
            <p>
              A cinematic chess suite with premium 3D presentation, strict rules, local and online play,
              Stockfish support, puzzle training, replay tools, and a polished white-and-gold identity.
            </p>
          </div>
          <div class="home-hero-stats">
            <div class="home-stat">
              <span class="label">Modes</span>
              <strong>Local, AI, Online, Public</strong>
            </div>
            <div class="home-stat">
              <span class="label">Variants</span>
              <strong>Classic, Blitz, Puzzle, Daily, Custom</strong>
            </div>
            <div class="home-stat">
              <span class="label">Systems</span>
              <strong>Move ledger, replay, clocks, capture trays, themes</strong>
            </div>
          </div>
        </div>

        <div class="home-doc-section home-profile-section">
          <div class="home-section-heading">
            <span class="eyebrow">Player Profile</span>
            <h3>Set names for local, AI, and room games</h3>
          </div>
          <div class="home-profile-card">
            <label class="home-field" for="playerNameInput">
              <span class="home-field-label">Main name</span>
              <input
                id="playerNameInput"
                class="home-text-input"
                type="text"
                maxlength="24"
                autocomplete="name"
                spellcheck="false"
                placeholder="Used for Vs AI and rooms"
              />
            </label>
            <div class="home-local-name-grid">
              <label class="home-field" for="localWhiteNameInput">
                <span class="home-field-label">Local white</span>
                <input
                  id="localWhiteNameInput"
                  class="home-text-input"
                  type="text"
                  maxlength="24"
                  autocomplete="off"
                  spellcheck="false"
                  placeholder="White player name"
                />
              </label>
              <label class="home-field" for="localBlackNameInput">
                <span class="home-field-label">Local black</span>
                <input
                  id="localBlackNameInput"
                  class="home-text-input"
                  type="text"
                  maxlength="24"
                  autocomplete="off"
                  spellcheck="false"
                  placeholder="Black player name"
                />
              </label>
            </div>
            <div class="home-name-actions" aria-label="Main name selection">
              <button id="mainFromWhiteBtn" class="action-btn secondary compact-btn" type="button">Use White as Main</button>
              <button id="mainFromBlackBtn" class="action-btn secondary compact-btn" type="button">Use Black as Main</button>
            </div>
            <p class="home-field-note">Main name is used for Vs AI, private rooms, and public matchmaking. Local names are used only for two-player local games.</p>
          </div>
        </div>

        <div class="home-doc-section">
          <div class="home-section-heading">
            <span class="eyebrow">Quick Start</span>
            <h3>How to begin a match</h3>
          </div>
          <div class="home-doc-grid">
            <div class="home-doc-card">
              <strong>1. Choose a mode</strong>
              <span>Select <span class="home-inline-code">Local</span>, <span class="home-inline-code">Vs AI</span>, or <span class="home-inline-code">Online</span> from the side panel. Use <span class="home-inline-code">Find Public Match</span> inside Online for instant matchmaking.</span>
            </div>
            <div class="home-doc-card">
              <strong>2. Choose a variant</strong>
              <span>Pick <span class="home-inline-code">Classic</span>, <span class="home-inline-code">Blitz</span>, <span class="home-inline-code">Puzzle</span>, <span class="home-inline-code">Daily</span>, or <span class="home-inline-code">Custom</span> depending on the kind of session you want.</span>
            </div>
            <div class="home-doc-card">
              <strong>3. Adjust settings</strong>
              <span>Set AI difficulty, blitz time, online color preference, theme, or custom-board editor options before launch.</span>
            </div>
            <div class="home-doc-card">
              <strong>4. Press Start Game</strong>
              <span>Use the in-panel <span class="home-inline-code">Start Game</span> button or the primary button below to commit the selected setup and begin.</span>
            </div>
          </div>
        </div>

        <div class="home-doc-section">
          <div class="home-section-heading">
            <span class="eyebrow">Mode Guide</span>
            <h3>What each mode is built for</h3>
          </div>
          <div class="home-feature-grid">
            <div class="home-feature">
              <strong>Local Match</strong>
              <span>Two players share the same device, alternate moves on one board, and use the same polished 3D interaction flow.</span>
            </div>
            <div class="home-feature">
              <strong>Vs AI</strong>
              <span>Play against Stockfish with difficulty presets, engine thinking feedback, and approval-based undo/draw handling.</span>
            </div>
            <div class="home-feature">
              <strong>Online Room</strong>
              <span>Create or join a room, choose color preference, sync moves in real time, and keep the camera aligned to your side.</span>
            </div>
            <div class="home-feature">
              <strong>Public Matchmaking</strong>
              <span>Search the public queue for a live opponent, then auto-fill with a server-side bot challenger if no player joins within 30 seconds.</span>
            </div>
          </div>
        </div>

        <div class="home-doc-section">
          <div class="home-section-heading">
            <span class="eyebrow">Variant Notes</span>
            <h3>Training, speed, and creative play</h3>
          </div>
          <div class="home-doc-grid">
            <div class="home-doc-card">
              <strong>Classic</strong>
              <span>Standard full chess with clocks, move history, replay, draw offers, undo flow, and endgame analysis.</span>
            </div>
            <div class="home-doc-card">
              <strong>Blitz</strong>
              <span>Timed chess with 1, 3, or 5 minute presets, active-side clock focus, low-time warnings, and flag-fall detection.</span>
            </div>
            <div class="home-doc-card">
              <strong>Puzzle</strong>
              <span>Strict solution validation, generated challenge stream, guided progress, hints, and reset-on-mistake behavior.</span>
            </div>
            <div class="home-doc-card">
              <strong>Daily</strong>
              <span>A rotating challenge based on the local date with persistent solve state and the same puzzle-grade validation pipeline.</span>
            </div>
            <div class="home-doc-card">
              <strong>Custom</strong>
              <span>Edit the board manually, place or erase pieces, validate the setup, then lock it and start a custom match from that position.</span>
            </div>
            <div class="home-doc-card">
              <strong>Replay</strong>
              <span>Review the last saved match move by move with playback controls, move highlighting, and board-state reconstruction.</span>
            </div>
          </div>
        </div>

        <div class="home-doc-section">
          <div class="home-section-heading">
            <span class="eyebrow">Board Controls</span>
            <h3>Interaction and premium systems</h3>
          </div>
          <div class="home-control-list">
            <div class="home-control-item"><strong>Left click</strong><span>Select pieces and commit legal moves.</span></div>
            <div class="home-control-item"><strong>Drag</strong><span>Orbit the camera around the board with damping.</span></div>
            <div class="home-control-item"><strong>Scroll</strong><span>Zoom in and out while preserving the premium board framing.</span></div>
            <div class="home-control-item"><strong>Right drag</strong><span>Pan the view for fine board positioning.</span></div>
            <div class="home-control-item"><strong>Cinema Toggle</strong><span>Enable or disable move-based cinematic camera shots at any time.</span></div>
            <div class="home-control-item"><strong>Reset View</strong><span>Return to the preferred player-side camera orientation instantly.</span></div>
          </div>
        </div>

        <div class="home-doc-section">
          <div class="home-section-heading">
            <span class="eyebrow">Included Systems</span>
            <h3>What the suite already supports</h3>
          </div>
          <div class="home-doc-grid">
            <div class="home-doc-card"><strong>Rules & Validation</strong><span><span class="home-inline-code">chess.js</span> move legality, SAN move ledger, check/checkmate/draw handling, promotions, castling, en passant.</span></div>
            <div class="home-doc-card"><strong>Premium Board Feel</strong><span>Animated piece motion, capture trays, 3D player clocks, hover/selection feedback, sound cues, and slow-motion captures.</span></div>
            <div class="home-doc-card"><strong>Persistence</strong><span>Last match save, auto-resume, replay source, puzzle progress, theme preference, and generated daily state.</span></div>
            <div class="home-doc-card"><strong>Presentation</strong><span>Move ledger, cinematic camera, event banners, confirmation flows, midnight/ivory themes, branded overlays, and post-match analysis.</span></div>
            <div class="home-doc-card"><strong>Public Queue</strong><span>Real player pairing, animated search overlay, VS intro handoff, server-side bot fill, and authoritative online move validation.</span></div>
          </div>
        </div>
        <div class="home-actions">
          <button id="homeEnterBtn" class="action-btn secondary" type="button">Enter Match Suite</button>
          <button id="homeStartBtn" class="action-btn primary" type="button">Start Selected Match</button>
        </div>
      </div>
    </div>

    <div id="eventBanner" class="event-banner hidden" aria-hidden="true"></div>

    <div id="matchmakingOverlay" class="matchmaking-overlay hidden" aria-hidden="true">
      <div class="matchmaking-card">
        <div class="matchmaking-radar" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span class="eyebrow">Public Matchmaking</span>
        <h2 id="matchmakingStatusLabel">Searching for opponent...</h2>
        <p id="matchmakingSubcopyLabel">Checking public rooms for a worthy challenger.</p>
        <div class="matchmaking-meta">
          <span>Elapsed search</span>
          <strong id="matchmakingElapsedLabel">00:00</strong>
        </div>
        <button id="cancelPublicMatchBtn" class="action-btn secondary" type="button">Cancel Search</button>
      </div>
    </div>

    <div id="matchIntroOverlay" class="match-intro-overlay hidden" aria-hidden="true">
      <div class="match-intro-shell">
        <div class="match-intro-streak" aria-hidden="true"></div>
        <div class="match-intro-player is-white">
          <span class="match-intro-side">White</span>
          <strong id="matchIntroWhiteName" class="match-intro-name">Player One</strong>
        </div>
        <div class="match-intro-center">
          <span class="match-intro-mode">Room Match</span>
          <strong class="match-intro-vs">VS</strong>
          <span class="match-intro-cue">Battle Begins</span>
          <span id="matchIntroCountdown" class="match-intro-countdown" aria-live="polite"></span>
          <span id="matchIntroRoomLabel" class="match-intro-room">Board is live</span>
        </div>
        <div class="match-intro-player is-black">
          <span class="match-intro-side">Black</span>
          <strong id="matchIntroBlackName" class="match-intro-name">Player Two</strong>
        </div>
      </div>
    </div>

    <div id="analysisOverlay" class="analysis-overlay hidden" aria-hidden="true">
      <div class="analysis-card">
        <span class="eyebrow">Post-Match Analysis</span>
        <h2 id="analysisHeadline">Match complete</h2>
        <p id="analysisSummary">A concise breakdown of how the battle finished.</p>
        <div class="analysis-grid">
          <div class="analysis-metric">
            <span class="label">Winner</span>
            <strong id="analysisWinner">-</strong>
          </div>
          <div class="analysis-metric">
            <span class="label">Result</span>
            <strong id="analysisResult">-</strong>
          </div>
          <div class="analysis-metric">
            <span class="label">Mode</span>
            <strong id="analysisMode">-</strong>
          </div>
          <div class="analysis-metric">
            <span class="label">Variant</span>
            <strong id="analysisVariant">-</strong>
          </div>
          <div class="analysis-metric">
            <span class="label">Moves</span>
            <strong id="analysisMoves">0</strong>
          </div>
          <div class="analysis-metric">
            <span class="label">White Captures</span>
            <strong id="analysisWhiteCaptures">0</strong>
          </div>
          <div class="analysis-metric">
            <span class="label">Black Captures</span>
            <strong id="analysisBlackCaptures">0</strong>
          </div>
          <div class="analysis-metric">
            <span class="label">Checks Delivered</span>
            <strong id="analysisChecks">0</strong>
          </div>
        </div>
        <div class="analysis-actions">
          <button id="analysisCloseBtn" class="action-btn secondary" type="button">Close</button>
          <button id="analysisRematchBtn" class="action-btn secondary" type="button">Rematch</button>
          <button id="analysisReplayBtn" class="action-btn secondary" type="button">Replay Match</button>
          <button id="analysisNewGameBtn" class="action-btn primary" type="button">New Match</button>
        </div>
        <div class="analysis-engine-card">
          <div class="analysis-engine-header">
            <span class="label">Engine Review</span>
            <strong id="analysisEngineStatus">Awaiting Stockfish review...</strong>
          </div>
          <div class="analysis-review-grid">
            <div class="analysis-metric tone-light">
              <span class="label">White Accuracy</span>
              <strong id="analysisWhiteAccuracy">-</strong>
            </div>
            <div class="analysis-metric tone-light">
              <span class="label">Black Accuracy</span>
              <strong id="analysisBlackAccuracy">-</strong>
            </div>
            <div class="analysis-metric tone-light">
              <span class="label">Inaccuracies</span>
              <strong id="analysisInaccuracies">0</strong>
            </div>
            <div class="analysis-metric tone-light">
              <span class="label">Mistakes</span>
              <strong id="analysisMistakes">0</strong>
            </div>
            <div class="analysis-metric tone-light">
              <span class="label">Blunders</span>
              <strong id="analysisBlunders">0</strong>
            </div>
            <div class="analysis-metric tone-light">
              <span class="label">Biggest Swing</span>
              <strong id="analysisSwing">-</strong>
            </div>
          </div>
          <div class="analysis-graph-wrap">
            <svg id="analysisGraph" class="analysis-graph" viewBox="0 0 640 180" preserveAspectRatio="none" aria-label="Evaluation graph">
              <path id="analysisGraphPath" d="" />
              <line x1="0" y1="90" x2="640" y2="90" class="analysis-graph-midline"></line>
            </svg>
          </div>
          <div class="analysis-notable">
            <span class="label">Key Moments</span>
            <div id="analysisNotableList" class="analysis-notable-list">
              <div class="analysis-note-empty">Stockfish will summarize the biggest swings and best alternatives here.</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="confirmationOverlay" class="confirmation-overlay hidden" aria-hidden="true">
      <div class="confirmation-card">
        <span class="eyebrow">Confirm Action</span>
        <h2 id="confirmationTitle">Are you sure?</h2>
        <p id="confirmationMessage">This action needs confirmation.</p>
        <div class="confirmation-actions">
          <button id="confirmationCancelBtn" class="action-btn secondary" type="button">Cancel</button>
          <button id="confirmationConfirmBtn" class="action-btn primary" type="button">Continue</button>
        </div>
      </div>
    </div>

    <div id="promotionOverlay" class="promotion-overlay hidden" aria-hidden="true">
      <div class="promotion-card">
        <span class="eyebrow">Promotion</span>
        <h2>Choose a piece</h2>
        <div id="promotionOptions" class="promotion-options"></div>
      </div>
    </div>
  </div>
`;

const app = new Chess3DApp({
  canvas: document.querySelector('#chessCanvas'),
  status: {
    turnLabel: document.querySelector('#turnLabel'),
    stateLabel: document.querySelector('#stateLabel'),
    moveLabel: document.querySelector('#moveLabel'),
    modeLabel: document.querySelector('#modeLabel'),
    variantLabel: document.querySelector('#variantLabel'),
    sideLabel: document.querySelector('#sideLabel'),
    roomLabel: document.querySelector('#roomLabel'),
    connectionLabel: document.querySelector('#connectionLabel'),
    aiStatusLabel: document.querySelector('#aiStatusLabel'),
    aiBookLabel: document.querySelector('#aiBookLabel'),
    aiStyleLabel: document.querySelector('#aiStyleLabel'),
    aiEvalLabel: document.querySelector('#aiEvalLabel'),
    onlineStatusLabel: document.querySelector('#onlineStatusLabel'),
    onlineReconnectLabel: document.querySelector('#onlineReconnectLabel'),
    undoRequestLabel: document.querySelector('#undoRequestLabel'),
    rematchRequestLabel: document.querySelector('#rematchRequestLabel'),
    drawRequestLabel: document.querySelector('#drawRequestLabel'),
    replayProgressLabel: document.querySelector('#replayProgressLabel'),
    themeLabel: document.querySelector('#themeLabel'),
    blitzStatusLabel: document.querySelector('#blitzStatusLabel'),
    puzzleTitleLabel: document.querySelector('#puzzleTitleLabel'),
    puzzleObjectiveLabel: document.querySelector('#puzzleObjectiveLabel'),
    puzzleDifficultyLabel: document.querySelector('#puzzleDifficultyLabel'),
    puzzleProgressLabel: document.querySelector('#puzzleProgressLabel'),
    puzzleTimerLabel: document.querySelector('#puzzleTimerLabel'),
    puzzleFeedbackLabel: document.querySelector('#puzzleFeedbackLabel'),
    dailyPuzzleLabel: document.querySelector('#dailyPuzzleLabel'),
    dailyObjectiveLabel: document.querySelector('#dailyObjectiveLabel'),
    dailyDifficultyLabel: document.querySelector('#dailyDifficultyLabel'),
    dailyTimerLabel: document.querySelector('#dailyTimerLabel'),
    dailyStatusLabel: document.querySelector('#dailyStatusLabel'),
    dailyFeedbackLabel: document.querySelector('#dailyFeedbackLabel'),
    customStatusLabel: document.querySelector('#customStatusLabel'),
    confirmationTitle: document.querySelector('#confirmationTitle'),
    confirmationMessage: document.querySelector('#confirmationMessage'),
    analysisHeadline: document.querySelector('#analysisHeadline'),
    analysisSummary: document.querySelector('#analysisSummary'),
    analysisWinner: document.querySelector('#analysisWinner'),
    analysisResult: document.querySelector('#analysisResult'),
    analysisMode: document.querySelector('#analysisMode'),
    analysisVariant: document.querySelector('#analysisVariant'),
    analysisMoves: document.querySelector('#analysisMoves'),
    analysisWhiteCaptures: document.querySelector('#analysisWhiteCaptures'),
    analysisBlackCaptures: document.querySelector('#analysisBlackCaptures'),
    analysisChecks: document.querySelector('#analysisChecks'),
    analysisEngineStatus: document.querySelector('#analysisEngineStatus'),
    analysisWhiteAccuracy: document.querySelector('#analysisWhiteAccuracy'),
    analysisBlackAccuracy: document.querySelector('#analysisBlackAccuracy'),
    analysisInaccuracies: document.querySelector('#analysisInaccuracies'),
    analysisMistakes: document.querySelector('#analysisMistakes'),
    analysisBlunders: document.querySelector('#analysisBlunders'),
    analysisSwing: document.querySelector('#analysisSwing'),
    matchIntroWhiteName: document.querySelector('#matchIntroWhiteName'),
    matchIntroBlackName: document.querySelector('#matchIntroBlackName'),
    matchIntroCountdown: document.querySelector('#matchIntroCountdown'),
    matchIntroRoomLabel: document.querySelector('#matchIntroRoomLabel'),
    matchmakingStatusLabel: document.querySelector('#matchmakingStatusLabel'),
    matchmakingSubcopyLabel: document.querySelector('#matchmakingSubcopyLabel'),
    matchmakingElapsedLabel: document.querySelector('#matchmakingElapsedLabel'),
    whiteTimerName: document.querySelector('#whiteTimerName'),
    blackTimerName: document.querySelector('#blackTimerName'),
    whiteTimerLabel: document.querySelector('#whiteTimerLabel'),
    blackTimerLabel: document.querySelector('#blackTimerLabel'),
    evalBarLabel: document.querySelector('#evalBarLabel')
  },
  controls: {
    startGameButton: document.querySelector('#startGameBtn'),
    openHomeGuideButton: document.querySelector('#openHomeGuideBtn'),
    undoButton: document.querySelector('#undoBtn'),
    quitButton: document.querySelector('#quitBtn'),
    drawButton: document.querySelector('#drawBtn'),
    nameSettingsButton: document.querySelector('#nameSettingsBtn'),
    sideNameEditButton: document.querySelector('#sideNameEditBtn'),
    cinematicCameraButton: document.querySelector('#cinematicCameraBtn'),
    resetViewButton: document.querySelector('#resetViewBtn'),
    matchPanelToggleButton: document.querySelector('#matchPanelToggleBtn'),
    restartButton: document.querySelector('#restartBtn'),
    replayMatchButton: document.querySelector('#replayMatchBtn'),
    replayPrevButton: document.querySelector('#replayPrevBtn'),
    replayPlayButton: document.querySelector('#replayPlayBtn'),
    replayNextButton: document.querySelector('#replayNextBtn'),
    replayExitButton: document.querySelector('#replayExitBtn'),
    hudToggleButton: document.querySelector('#hudToggleBtn'),
    localModeButton: document.querySelector('#localModeBtn'),
    aiModeButton: document.querySelector('#aiModeBtn'),
    onlineModeButton: document.querySelector('#onlineModeBtn'),
    classicVariantButton: document.querySelector('#classicVariantBtn'),
    blitzVariantButton: document.querySelector('#blitzVariantBtn'),
    puzzleVariantButton: document.querySelector('#puzzleVariantBtn'),
    dailyVariantButton: document.querySelector('#dailyVariantBtn'),
    customVariantButton: document.querySelector('#customVariantBtn'),
    aiBeginnerButton: document.querySelector('#aiBeginnerBtn'),
    aiEasyButton: document.querySelector('#aiEasyBtn'),
    aiMediumButton: document.querySelector('#aiMediumBtn'),
    aiHardButton: document.querySelector('#aiHardBtn'),
    aiMasterButton: document.querySelector('#aiMasterBtn'),
    aiBalancedStyleButton: document.querySelector('#aiBalancedStyleBtn'),
    aiAggressiveStyleButton: document.querySelector('#aiAggressiveStyleBtn'),
    aiSolidStyleButton: document.querySelector('#aiSolidStyleBtn'),
    aiTrickyStyleButton: document.querySelector('#aiTrickyStyleBtn'),
    themeIvoryButton: document.querySelector('#themeIvoryBtn'),
    themeMidnightButton: document.querySelector('#themeMidnightBtn'),
    themeRegalButton: document.querySelector('#themeRegalBtn'),
    blitz1Button: document.querySelector('#blitz1Btn'),
    blitz3Button: document.querySelector('#blitz3Btn'),
    blitz5Button: document.querySelector('#blitz5Btn'),
    puzzleAllButton: document.querySelector('#puzzleAllBtn'),
    puzzleEasyButton: document.querySelector('#puzzleEasyBtn'),
    puzzleMediumButton: document.querySelector('#puzzleMediumBtn'),
    puzzleHardButton: document.querySelector('#puzzleHardBtn'),
    nextPuzzleButton: document.querySelector('#nextPuzzleBtn'),
    resetPuzzleButton: document.querySelector('#resetPuzzleBtn'),
    hintPuzzleButton: document.querySelector('#hintPuzzleBtn'),
    loadDailyButton: document.querySelector('#loadDailyBtn'),
    dailyResetButton: document.querySelector('#dailyResetBtn'),
    hintDailyButton: document.querySelector('#hintDailyBtn'),
    createRoomButton: document.querySelector('#createRoomBtn'),
    findPublicMatchButton: document.querySelector('#findPublicMatchBtn'),
    cancelPublicMatchmakingButton: document.querySelector('#cancelPublicMatchBtn'),
    copyRoomButton: document.querySelector('#copyRoomBtn'),
    joinRoomButton: document.querySelector('#joinRoomBtn'),
    reconnectRoomButton: document.querySelector('#reconnectRoomBtn'),
    leaveRoomButton: document.querySelector('#leaveRoomBtn'),
    onlineAutoColorButton: document.querySelector('#onlineAutoColorBtn'),
    onlineWhiteColorButton: document.querySelector('#onlineWhiteColorBtn'),
    onlineBlackColorButton: document.querySelector('#onlineBlackColorBtn'),
    customWhiteButton: document.querySelector('#customWhiteBtn'),
    customBlackButton: document.querySelector('#customBlackBtn'),
    customKingButton: document.querySelector('#customKingBtn'),
    customQueenButton: document.querySelector('#customQueenBtn'),
    customRookButton: document.querySelector('#customRookBtn'),
    customBishopButton: document.querySelector('#customBishopBtn'),
    customKnightButton: document.querySelector('#customKnightBtn'),
    customPawnButton: document.querySelector('#customPawnBtn'),
    customEraseButton: document.querySelector('#customEraseBtn'),
    customToggleEditButton: document.querySelector('#customToggleEditBtn'),
    customStartButton: document.querySelector('#customStartBtn'),
    customClearButton: document.querySelector('#customClearBtn'),
    customStandardButton: document.querySelector('#customStandardBtn'),
    roomInput: document.querySelector('#roomInput'),
    acceptUndoButton: document.querySelector('#acceptUndoBtn'),
    declineUndoButton: document.querySelector('#declineUndoBtn'),
    acceptRematchButton: document.querySelector('#acceptRematchBtn'),
    declineRematchButton: document.querySelector('#declineRematchBtn'),
    acceptDrawButton: document.querySelector('#acceptDrawBtn'),
    declineDrawButton: document.querySelector('#declineDrawBtn'),
    playerNameInput: document.querySelector('#playerNameInput'),
    localWhiteNameInput: document.querySelector('#localWhiteNameInput'),
    localBlackNameInput: document.querySelector('#localBlackNameInput'),
    mainFromWhiteButton: document.querySelector('#mainFromWhiteBtn'),
    mainFromBlackButton: document.querySelector('#mainFromBlackBtn'),
    homeEnterButton: document.querySelector('#homeEnterBtn'),
    homeStartButton: document.querySelector('#homeStartBtn'),
    analysisCloseButton: document.querySelector('#analysisCloseBtn'),
    analysisRematchButton: document.querySelector('#analysisRematchBtn'),
    analysisReplayButton: document.querySelector('#analysisReplayBtn'),
    analysisNewGameButton: document.querySelector('#analysisNewGameBtn'),
    confirmationCancelButton: document.querySelector('#confirmationCancelBtn'),
    confirmationConfirmButton: document.querySelector('#confirmationConfirmBtn')
  },
  panels: {
    hud: document.querySelector('#hudPanel'),
    moveHistoryList: document.querySelector('#moveHistoryList'),
    whiteTimerBox: document.querySelector('#whiteTimerBox'),
    blackTimerBox: document.querySelector('#blackTimerBox'),
    aiPanel: document.querySelector('#aiPanel'),
    blitzPanel: document.querySelector('#blitzPanel'),
    puzzlePanel: document.querySelector('#puzzlePanel'),
    dailyPanel: document.querySelector('#dailyPanel'),
    customPanel: document.querySelector('#customPanel'),
    onlinePanel: document.querySelector('#onlinePanel'),
    undoApprovalPanel: document.querySelector('#undoApprovalPanel'),
    rematchApprovalPanel: document.querySelector('#rematchApprovalPanel'),
    drawApprovalPanel: document.querySelector('#drawApprovalPanel'),
    replayPanel: document.querySelector('#replayPanel'),
    matchActionsPanel: document.querySelector('#matchActionPanel'),
    eventBanner: document.querySelector('#eventBanner'),
    matchmakingOverlay: document.querySelector('#matchmakingOverlay'),
    matchIntroOverlay: document.querySelector('#matchIntroOverlay'),
    homeOverlay: document.querySelector('#homeOverlay'),
    analysisOverlay: document.querySelector('#analysisOverlay'),
    impactOverlay: document.querySelector('#impactOverlay'),
    landscapeOverlay: document.querySelector('#landscapeOverlay'),
    evalBar: document.querySelector('#evalBar'),
    evalBarFill: document.querySelector('#evalBarFill'),
    analysisGraphPath: document.querySelector('#analysisGraphPath'),
    analysisNotableList: document.querySelector('#analysisNotableList'),
    confirmationOverlay: document.querySelector('#confirmationOverlay'),
    promotionOverlay: document.querySelector('#promotionOverlay'),
    promotionOptions: document.querySelector('#promotionOptions')
  }
});

app.start();
