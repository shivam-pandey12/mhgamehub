import { PLAYER_COLORS } from "./board.js";
import { BOT_PERSONALITIES } from "./bots.js";
import { getRuleRows } from "./rules.js";
import { getPersonalityLabel } from "./setup.js";
import { getBoardPresetRows } from "./board-presets.js";
import { getModeRows, getGameMode } from "./modes.js";
import { EVENT_TILE_DEFINITIONS, getEventTileRows, getPowerUpLabel } from "./powerups.js";
import { getQualityRows } from "./quality.js";

export class RoyaleUI {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.root = document.querySelector("#game-root");
    this.panel = document.querySelector("#side-panel");
    this.panelContent = document.querySelector("#panel-content");
    this.panelToggle = document.querySelector("#panel-toggle");
    this.rollButton = document.querySelector("#roll-button");
    this.turnBadge = document.querySelector("#turn-badge");
    this.diceMini = document.querySelector("#dice-mini");
    this.toast = document.querySelector("#event-toast");
    this.victory = document.querySelector("#victory-overlay");
    this.connectionOverlay = document.createElement("div");
    this.connectionOverlay.className = "connection-overlay";
    this.connectionOverlay.setAttribute("aria-live", "polite");
    document.body.appendChild(this.connectionOverlay);
    this.toastTimer = null;

    this.panelToggle.addEventListener("click", () => {
      this.callbacks.onButtonClick?.();
      this.callbacks.onTogglePanel?.();
    });

    this.rollButton.addEventListener("click", () => {
      this.callbacks.onButtonClick?.();
      this.callbacks.onRollDice?.();
    });

    this.panelContent.addEventListener("click", (event) => {
      const target = event.target.closest("[data-action]");
      if (!target) return;
      this.callbacks.onButtonClick?.();
      const action = target.dataset.action;
      if (action === "start") this.callbacks.onStartGame?.();
      if (action === "restart") this.callbacks.onRestart?.();
      if (action === "menu") this.callbacks.onMainMenu?.();
      if (action === "roll") this.callbacks.onRollDice?.();
      if (action === "toggle-cinematic") this.callbacks.onToggleCinematic?.();
      if (action === "toggle-sound") this.callbacks.onToggleSound?.();
      if (action === "player-count") this.callbacks.onPlayerCountChange?.(Number(target.dataset.count));
      if (action === "setup-preset") this.callbacks.onSetupPreset?.(target.dataset.preset);
      if (action === "reset-setup") this.callbacks.onResetSetup?.();
      if (action === "slot-type") this.callbacks.onSlotTypeChange?.(Number(target.dataset.slot), target.dataset.type);
      if (action === "rule-toggle") this.callbacks.onRuleToggle?.(target.dataset.rule);
      if (action === "mode-select") this.callbacks.onModeChange?.(target.dataset.mode);
      if (action === "board-preset") this.callbacks.onBoardPresetChange?.(target.dataset.preset);
      if (action === "toggle-powerups") this.callbacks.onPowerUpsToggle?.();
      if (action === "toggle-events") this.callbacks.onEventTilesToggle?.();
      if (action === "accessibility-toggle") this.callbacks.onAccessibilityToggle?.(target.dataset.key);
      if (action === "quality-select") this.callbacks.onQualityChange?.(target.dataset.quality);
      if (action === "use-powerup") this.callbacks.onUsePowerUp?.();
      if (action === "keep-roll") this.callbacks.onKeepRoll?.();
      if (action === "use-reroll") this.callbacks.onUseReroll?.();
      if (action === "rematch") this.callbacks.onRematchSame?.();
      if (action === "change-setup") this.callbacks.onChangeSetup?.();
      if (action === "restart-classic") this.callbacks.onRestartClassic?.();
      if (action === "play-surface") this.callbacks.onPlaySurfaceChange?.(target.dataset.surface);
      if (action === "online-create-room") this.callbacks.onCreateOnlineRoom?.();
      if (action === "online-join-room") this.callbacks.onJoinOnlineRoom?.();
      if (action === "online-retry") this.callbacks.onRetryOnline?.();
      if (action === "online-ready") this.callbacks.onOnlineReady?.(target.dataset.ready === "true");
      if (action === "online-start") this.callbacks.onOnlineStart?.();
      if (action === "online-leave") this.callbacks.onOnlineLeave?.();
      if (action === "online-fill-bots") this.callbacks.onOnlineFillBots?.();
      if (action === "public-find") this.callbacks.onFindPublicMatch?.();
      if (action === "public-cancel") this.callbacks.onCancelPublicQueue?.();
      if (action === "online-copy-code") this.callbacks.onCopyRoomCode?.();
      if (action === "find-new-match") this.callbacks.onFindNewMatch?.();
    });

    this.panelContent.addEventListener("input", (event) => {
      const input = event.target.closest("[data-slot-name]");
      if (!input) return;
      this.callbacks.onSlotNameChange?.(Number(input.dataset.slotName), input.value);
    });

    this.panelContent.addEventListener("input", (event) => {
      const input = event.target.closest("[data-online-field]");
      if (!input) return;
      this.callbacks.onOnlineFieldChange?.(input.dataset.onlineField, input.value);
    });

    this.panelContent.addEventListener("change", (event) => {
      const personality = event.target.closest("[data-slot-personality]");
      if (personality) {
        this.callbacks.onSlotPersonalityChange?.(Number(personality.dataset.slotPersonality), personality.value);
        return;
      }
      const swapTarget = event.target.closest("[data-swap-target]");
      if (swapTarget) {
        this.callbacks.onSwapTargetChange?.(swapTarget.value);
        return;
      }
      const onlineSelect = event.target.closest("[data-online-select]");
      if (onlineSelect) {
        this.callbacks.onOnlineFieldChange?.(onlineSelect.dataset.onlineSelect, onlineSelect.value);
      }
    });

    this.victory.addEventListener("click", (event) => {
      const target = event.target.closest("[data-action]");
      if (!target) return;
      this.callbacks.onButtonClick?.();
      if (target.dataset.action === "restart") this.callbacks.onRestart?.();
      if (target.dataset.action === "menu") this.callbacks.onMainMenu?.();
      if (target.dataset.action === "rematch") this.callbacks.onRematchSame?.();
      if (target.dataset.action === "change-setup") this.callbacks.onChangeSetup?.();
      if (target.dataset.action === "restart-classic") this.callbacks.onRestartClassic?.();
      if (target.dataset.action === "online-leave") this.callbacks.onOnlineLeave?.();
      if (target.dataset.action === "find-new-match") this.callbacks.onFindNewMatch?.();
    });

    this.connectionOverlay.addEventListener("click", (event) => {
      const target = event.target.closest("[data-action]");
      if (!target) return;
      this.callbacks.onButtonClick?.();
      if (target.dataset.action === "menu") this.callbacks.onMainMenu?.();
      if (target.dataset.action === "play-surface") this.callbacks.onPlaySurfaceChange?.(target.dataset.surface);
      if (target.dataset.action === "online-retry") this.callbacks.onRetryOnline?.();
      if (target.dataset.action === "online-leave-confirm") this.callbacks.onOnlineLeaveConfirm?.();
      if (target.dataset.action === "online-leave-cancel") this.callbacks.onOnlineLeaveCancel?.();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (this.vsOverlay) {
        this.hideVsIntro();
        return;
      }
      if (this.victory.classList.contains("is-visible")) return;
      this.callbacks.onEscape?.();
    });
  }

  update(state) {
    this.root.classList.toggle("panel-closed", !state.sidePanelOpen);
    this.panel.classList.toggle("is-open", state.sidePanelOpen);
    this.panelToggle.setAttribute("aria-pressed", String(state.sidePanelOpen));
    this.panelToggle.setAttribute("aria-expanded", String(state.sidePanelOpen));
    this.panelToggle.setAttribute("aria-label", state.sidePanelOpen ? "Hide side panel" : "Show side panel");
    this.panelToggle.querySelector(".panel-toggle-label").textContent = state.sidePanelOpen ? "Hide Panel" : "Show Panel";

    this.renderPanel(state);
    this.renderHud(state);
    this.renderVictory(state);
    this.renderConnectionOverlay(state);
  }

  showToast(message, type = "info") {
    window.clearTimeout(this.toastTimer);
    this.toast.innerHTML = `<strong>${escapeHtml(message)}</strong>`;
    this.toast.className = `event-toast is-visible is-${type}`;
    this.toastTimer = window.setTimeout(() => {
      this.toast.classList.remove("is-visible");
    }, 2300);
  }

  showVsIntro({ players = [], modeLabel = "Classic", presetLabel = "Classic 100", matchType = "Local", rematch = false } = {}) {
    this.hideVsIntro();
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = `vs-intro chess-codex-vs is-visible ${players.length > 2 ? "is-grid" : "is-duel"}`;
      const [leftPlayer, rightPlayer] = [players[0], players[1] || players[0]];
      const extras = players.slice(2);
      const centerTitle = players.length > 2 ? (rematch ? "REMATCH" : "ROYAL MATCH") : (rematch ? "REMATCH" : "VS");
      overlay.innerHTML = `
        <button class="vs-skip match-intro-skip" type="button">Skip</button>
        <div class="match-intro-shell ${players.length > 2 ? "is-multiplayer" : ""}">
          <div class="match-intro-streak" aria-hidden="true"></div>
          ${renderIntroPlayer(leftPlayer, 0, "is-white", matchType)}
          <div class="match-intro-center">
            <span class="match-intro-mode">${escapeHtml(modeLabel)}</span>
            <strong class="match-intro-vs">${escapeHtml(centerTitle)}</strong>
            <span class="match-intro-cue">${escapeHtml(matchType)}</span>
            <span class="match-intro-room">${escapeHtml(presetLabel)}</span>
          </div>
          ${renderIntroPlayer(rightPlayer, 1, "is-black", matchType)}
          ${extras.length ? `
            <div class="match-intro-extra-grid">
              ${extras.map((player, offset) => renderIntroMiniPlayer(player, offset + 2, matchType)).join("")}
            </div>
          ` : ""}
        </div>
      `;
      document.body.appendChild(overlay);
      this.vsOverlay = overlay;
      this.vsResolve = resolve;
      const finish = () => {
        if (!this.vsOverlay) return;
        this.hideVsIntro();
      };
      overlay.querySelector(".vs-skip")?.addEventListener("click", finish, { once: true });
      this.vsTimer = window.setTimeout(finish, rematch ? 2100 : 3200);
    });
  }

  hideVsIntro() {
    window.clearTimeout(this.vsTimer);
    this.vsTimer = null;
    this.vsOverlay?.remove();
    this.vsOverlay = null;
    const resolve = this.vsResolve;
    this.vsResolve = null;
    resolve?.();
  }

  renderPanel(state) {
    const activeElement = document.activeElement;
    const restoreFocus = this.panelContent.contains(activeElement) ? {
      kind: activeElement.dataset?.onlineField ? "onlineField"
        : activeElement.dataset?.slotName ? "slotName"
          : activeElement.dataset?.onlineSelect ? "onlineSelect"
            : null,
      key: activeElement.dataset?.onlineField || activeElement.dataset?.slotName || activeElement.dataset?.onlineSelect || "",
      selectionStart: typeof activeElement.selectionStart === "number" ? activeElement.selectionStart : null,
      selectionEnd: typeof activeElement.selectionEnd === "number" ? activeElement.selectionEnd : null
    } : null;

    this.panelContent.innerHTML = state.gameStatus === "menu"
      ? this.renderSetupPanel(state)
      : this.renderGamePanel(state);

    if (restoreFocus?.kind) {
      const selector = restoreFocus.kind === "onlineField" ? "[data-online-field]"
        : restoreFocus.kind === "slotName" ? "[data-slot-name]"
          : "[data-online-select]";
      const nextElement = [...this.panelContent.querySelectorAll(selector)]
        .find((element) => {
          if (restoreFocus.kind === "onlineField") return element.dataset.onlineField === restoreFocus.key;
          if (restoreFocus.kind === "slotName") return element.dataset.slotName === restoreFocus.key;
          return element.dataset.onlineSelect === restoreFocus.key;
        });
      if (nextElement) {
        nextElement.focus({ preventScroll: true });
        if (typeof nextElement.setSelectionRange === "function" && restoreFocus.selectionStart !== null) {
          nextElement.setSelectionRange(restoreFocus.selectionStart, restoreFocus.selectionEnd ?? restoreFocus.selectionStart);
        }
      }
    }
  }

  renderSetupPanel(state) {
    const setup = state.setup;
    const slots = setup.slots.slice(0, setup.playerCount);
    const mode = getGameMode(state.modeId);
    const customMode = state.modeId === "custom";
    const surfaceTabs = this.renderPlaySurfaceTabs(state);
    if (state.online?.view && state.online.view !== "local") {
      return `
        <div class="panel-hero">
          <p class="eyebrow">GameHub online royale</p>
          <h1>3D Snake & Ladder Royale</h1>
          <p>Private rooms, public queue, server dice, and the same Ivory Royale board.</p>
          <div class="brand-signature" aria-label="Powered by MH HORIZON">
            <span class="brand-signature-label">Powered by</span>
            <strong class="brand-signature-name">MH HORIZON</strong>
          </div>
        </div>
        ${state.validationMessage ? `<div class="validation-banner">${escapeHtml(state.validationMessage)}</div>` : ""}
        ${state.webglSupported ? "" : `<div class="validation-banner">${escapeHtml(state.webglMessage || "WebGL is unavailable.")}</div>`}
        ${surfaceTabs}
        ${this.renderOnlinePanel(state)}
      `;
    }
    return `
      <div class="panel-hero">
        <p class="eyebrow">GameHub local royale</p>
        <h1>3D Snake & Ladder Royale</h1>
        <p>Ivory marble, fair dice, local bots, modes, and one polished climb to the crown.</p>
        <div class="brand-signature" aria-label="Powered by MH HORIZON">
          <span class="brand-signature-label">Powered by</span>
          <strong class="brand-signature-name">MH HORIZON</strong>
        </div>
      </div>

      ${state.validationMessage ? `<div class="validation-banner">${escapeHtml(state.validationMessage)}</div>` : ""}
      ${state.webglSupported ? "" : `<div class="validation-banner">${escapeHtml(state.webglMessage || "WebGL is unavailable.")}</div>`}

      ${surfaceTabs}

      <section class="panel-section">
        <div class="section-heading">
          <span>Game Mode</span>
          <strong>${escapeHtml(mode.shortLabel)}</strong>
        </div>
        <div class="mode-grid">
          ${getModeRows().map((row) => `
            <button class="mode-card ${row.id === state.modeId ? "is-active" : ""}" data-action="mode-select" data-mode="${row.id}" type="button">
              <strong>${escapeHtml(row.label)}</strong>
              <span>${escapeHtml(row.description)}</span>
            </button>
          `).join("")}
        </div>
      </section>

      <section class="panel-section">
        <div class="section-heading">
          <span>Board Preset</span>
          <strong>${escapeHtml(state.activeBoard?.preset?.label || "Classic 100")}</strong>
        </div>
        <div class="preset-list">
          ${getBoardPresetRows().map((preset) => `
            <button class="preset-row ${preset.id === state.boardPresetId ? "is-active" : ""}" data-action="board-preset" data-preset="${preset.id}" type="button" ${customMode ? "" : "disabled"}>
              <span>${escapeHtml(preset.label)}</span>
              <em>Finish ${preset.finishTile}</em>
            </button>
          `).join("")}
        </div>
        ${customMode ? "" : `<p class="micro-copy">Preset follows the selected mode. Choose Custom Mode to edit it.</p>`}
      </section>

      <section class="panel-section">
        <div class="section-heading">
          <span>Royale Options</span>
          <strong>${customMode ? "Custom" : "Mode locked"}</strong>
        </div>
        <div class="rule-grid">
          <button class="rule-toggle ${state.powerUpsEnabled ? "is-on" : ""}" data-action="toggle-powerups" type="button" ${customMode ? "" : "disabled"}>
            <span>Power-ups</span><strong>${state.powerUpsEnabled ? "ON" : "OFF"}</strong>
          </button>
          <button class="rule-toggle ${state.eventTilesEnabled ? "is-on" : ""}" data-action="toggle-events" type="button" ${customMode ? "" : "disabled"}>
            <span>Event tiles</span><strong>${state.eventTilesEnabled ? "ON" : "OFF"}</strong>
          </button>
        </div>
      </section>

      <section class="panel-section">
        <div class="section-heading">
          <span>Quick Presets</span>
          <strong>Players</strong>
        </div>
        <div class="preset-grid">
          <button data-action="setup-preset" data-preset="twoHumans" type="button">2 Players</button>
          <button data-action="setup-preset" data-preset="humanVsBot" type="button">1v1 Bot</button>
          <button data-action="setup-preset" data-preset="humanVsThreeBots" type="button">1v3 Bots</button>
          <button data-action="setup-preset" data-preset="fourHumans" type="button">4 Local</button>
        </div>
      </section>

      <section class="panel-section">
        <div class="section-heading">
          <span>Players</span>
          <strong>${setup.playerCount}</strong>
        </div>
        <div class="segmented">
          ${[2, 3, 4].map((count) => `
            <button class="${count === setup.playerCount ? "is-active" : ""}" data-action="player-count" data-count="${count}" type="button">${count}</button>
          `).join("")}
        </div>
      </section>

      <section class="panel-section player-slots">
        ${slots.map((slot, index) => this.renderSlot(slot, index)).join("")}
      </section>

      <section class="panel-section">
        <div class="section-heading">
          <span>Rules</span>
          <strong>Editable</strong>
        </div>
        <div class="rule-grid">
          ${getRuleRows(state.rules).map(([key, label, enabled]) => `
            <button class="rule-toggle ${enabled ? "is-on" : ""}" data-action="rule-toggle" data-rule="${key}" type="button">
              <span>${label}</span><strong>${enabled ? "ON" : "OFF"}</strong>
            </button>
          `).join("")}
        </div>
      </section>

      <section class="panel-section">
        <div class="section-heading">
          <span>Accessibility</span>
          <strong>${escapeHtml(state.qualityProfile?.label || "Auto")}</strong>
        </div>
        <div class="quality-grid">
          ${getQualityRows().map(([id, label]) => `
            <button class="${state.qualityLevel === id ? "is-active" : ""}" data-action="quality-select" data-quality="${id}" type="button">${label}</button>
          `).join("")}
        </div>
        <div class="rule-grid">
          ${renderAccessibilityToggles(state)}
        </div>
      </section>

      <div class="setup-actions">
        <button class="secondary-action" data-action="reset-setup" type="button">Reset Setup</button>
        <button class="primary-action" data-action="start" type="button">Start Game</button>
      </div>
    `;
  }

  renderSlot(slot, index) {
    const isBot = slot.type === "bot";
    return `
      <div class="slot-card ${isBot ? "is-bot" : ""}" style="--token:${PLAYER_COLORS[index]}">
        <div class="slot-topline">
          <span class="slot-token"></span>
          <strong>Player ${index + 1}</strong>
          ${isBot ? `<em>BOT</em>` : `<em>Human</em>`}
        </div>
        <div class="slot-type">
          <button class="${!isBot ? "is-active" : ""}" data-action="slot-type" data-slot="${index}" data-type="human" type="button">Human</button>
          <button class="${isBot ? "is-active" : ""}" data-action="slot-type" data-slot="${index}" data-type="bot" type="button">Bot</button>
        </div>
        <input data-slot-name="${index}" value="${escapeHtml(slot.name)}" maxlength="24" aria-label="Player ${index + 1} name" />
        ${isBot ? `
          <select data-slot-personality="${index}" aria-label="Bot personality">
            ${Object.entries(BOT_PERSONALITIES).map(([key, personality]) => `
              <option value="${key}" ${slot.personality === key ? "selected" : ""}>${personality.label}</option>
            `).join("")}
          </select>
        ` : ""}
      </div>
    `;
  }

  renderPlaySurfaceTabs(state) {
    const current = state.online?.view || "local";
    const onlineUnavailable = state.online?.connectionStatus === "unavailable";
    const rows = [
      ["local", "Local Play", "Same-device match"],
      ["private", "Private Room", "Create or join by code"],
      ["public", "Public Matchmaking", "Find an online opponent"]
    ];
    return `
      <section class="panel-section">
        <div class="section-heading">
          <span>Play Mode</span>
          <strong>${escapeHtml(connectionLabel(state.online?.connectionStatus))}</strong>
        </div>
        <div class="online-mode-grid">
          ${rows.map(([id, label, hint]) => `
            <button class="mode-card ${current === id ? "is-active" : ""}" data-action="play-surface" data-surface="${id}" type="button" ${id !== "local" && onlineUnavailable ? "disabled" : ""}>
              <strong>${label}</strong>
              <span>${id !== "local" && onlineUnavailable ? "Online server unavailable" : hint}</span>
            </button>
          `).join("")}
        </div>
        ${onlineUnavailable ? `
          <div class="online-unavailable">
            <strong>Online server unavailable</strong>
            <span>Local play and local bots still work. Retry when your real-time server is running.</span>
            <button class="secondary-action" data-action="online-retry" type="button">Retry Online Connection</button>
          </div>
        ` : ""}
      </section>
    `;
  }

  renderOnlinePanel(state) {
    if (state.online?.view === "lobby") return this.renderOnlineLobby(state);
    if (state.online?.view === "queue") return this.renderPublicQueue(state);
    if (state.online?.view === "public") return this.renderPublicSetup(state);
    return this.renderPrivateSetup(state);
  }

  renderPrivateSetup(state) {
    const onlineDisabled = state.online?.connectionStatus === "unavailable";
    const busy = Boolean(state.online?.operation);
    return `
      <section class="panel-section">
        <div class="section-heading">
          <span>Private Room</span>
          <strong>${busy ? "Working..." : "No database"}</strong>
        </div>
        <label class="field-stack">
          <span>Your name</span>
          <input data-online-field="name" value="${escapeHtml(state.online.name)}" maxlength="24" />
        </label>
        <div class="segmented">
          ${[2, 3, 4].map((count) => `
            <button class="${count === Number(state.online.playerCount) ? "is-active" : ""}" data-online-select="playerCount" value="${count}" type="button" onclick="this.dispatchEvent(new Event('change',{bubbles:true}))">${count}</button>
          `).join("")}
        </div>
        <div class="online-actions">
          <button class="primary-action" data-action="online-create-room" type="button" ${onlineDisabled || busy ? "disabled" : ""}>${busy ? "Connecting..." : "Create Room"}</button>
        </div>
      </section>
      <section class="panel-section">
        <div class="section-heading">
          <span>Join Room</span>
          <strong>Code</strong>
        </div>
        <label class="field-stack">
          <span>Room code</span>
          <input data-online-field="joinCode" value="${escapeHtml(state.online.joinCode || "")}" maxlength="8" />
        </label>
        <button class="secondary-action" data-action="online-join-room" type="button" ${onlineDisabled || busy ? "disabled" : ""}>Join Room</button>
      </section>
      ${onlineDisabled ? `<button class="secondary-action" data-action="online-retry" type="button">Retry Online Connection</button>` : ""}
      ${this.renderOnlineError(state)}
    `;
  }

  renderPublicSetup(state) {
    const selectedMode = !state.online.publicModeId || state.online.publicModeId === "any" ? null : getGameMode(state.online.publicModeId);
    const onlineDisabled = state.online?.connectionStatus === "unavailable";
    const busy = Boolean(state.online?.operation);
    return `
      <section class="panel-section public-matchmaking-card">
        <div class="public-matchmaking-head">
          <div>
            <span class="online-kicker">Public Matchmaking</span>
            <strong>Find a Royale table</strong>
            <p>Queue with fair server dice and synchronized board movement.</p>
          </div>
          <em>${escapeHtml(connectionLabel(state.online?.connectionStatus))}</em>
        </div>
        <div class="online-form-block">
          <label class="field-stack">
            <span>Display name</span>
            <input data-online-field="name" value="${escapeHtml(state.online.name)}" maxlength="24" autocomplete="off" spellcheck="false" />
          </label>
        </div>
        <div class="public-preference-grid">
          <label class="field-stack">
            <span>Players</span>
            <select data-online-select="publicPlayerCount">
              ${["any", 2, 3, 4].map((value) => `<option value="${value}" ${String(state.online.publicPlayerCount) === String(value) ? "selected" : ""}>${value === "any" ? "Any size" : `${value} players`}</option>`).join("")}
            </select>
          </label>
          <label class="field-stack">
            <span>Mode</span>
            <select data-online-select="publicModeId">
              ${["any", ...getModeRows().filter((row) => row.id !== "custom").map((row) => row.id)].map((value) => `<option value="${value}" ${state.online.publicModeId === value ? "selected" : ""}>${value === "any" ? "Any mode" : getGameMode(value).label}</option>`).join("")}
            </select>
          </label>
          <label class="field-stack">
            <span>Bot fill</span>
            <select data-online-select="allowBotFill">
              <option value="true" ${state.online.allowBotFill ? "selected" : ""}>Allow bot fill</option>
              <option value="false" ${!state.online.allowBotFill ? "selected" : ""}>Real players only</option>
            </select>
          </label>
        </div>
        <div class="public-matchmaking-summary">
          <span>${escapeHtml(String(state.online.publicPlayerCount === "any" ? "Flexible seats" : `${state.online.publicPlayerCount} player match`))}</span>
          <span>${escapeHtml(selectedMode?.label || "Flexible mode")}</span>
          <span>${state.online.allowBotFill ? "Bot fill ON" : "Humans only"}</span>
        </div>
        <button class="primary-action public-find-button" data-action="public-find" type="button" ${onlineDisabled || busy ? "disabled" : ""}>${busy ? "Connecting..." : "Find Match"}</button>
      </section>
      ${onlineDisabled ? `<button class="secondary-action" data-action="online-retry" type="button">Retry Online Connection</button>` : ""}
      ${this.renderOnlineError(state)}
    `;
  }

  renderPublicQueue(state) {
    const queue = state.online.queue || {};
    const queueModeId = queue.preferredModeId || state.online.publicModeId || "any";
    const queueModeLabel = queueModeId === "any" ? "Any mode" : getGameMode(queueModeId).label;
    const botFillSeconds = queue.botFillInMs === null || queue.botFillInMs === undefined ? null : Math.ceil(Math.max(0, queue.botFillInMs) / 1000);
    const targetCount = queue.targetPlayerCount || queue.preferredPlayerCount || state.online.publicPlayerCount || 2;
    const foundCount = queue.playersFound || 1;
    return `
      <section class="panel-section queue-card">
        <div class="section-heading">
          <span>Searching</span>
          <strong>${Math.floor((queue.elapsedMs || 0) / 1000)}s</strong>
        </div>
        <div class="queue-orbit"></div>
        <p>${escapeHtml(queue.message || "Finding players...")}</p>
        <div class="summary-pills">
          <span>${escapeHtml(String(foundCount))}/${escapeHtml(String(targetCount))} found</span>
          <span>${escapeHtml(queueModeLabel)}</span>
          <span>${queue.allowBotFill === false ? "Humans only" : botFillSeconds ? `Bots in ${botFillSeconds}s` : "Bots ready"}</span>
          <span>${queue.queueSize || 1} searching</span>
        </div>
        <button class="secondary-action" data-action="public-cancel" type="button">Cancel Search</button>
      </section>
      ${this.renderOnlineError(state)}
    `;
  }

  renderOnlineLobby(state) {
    const lobby = state.online.lobby;
    if (!lobby) return this.renderOnlineError(state);
    const me = lobby.players.find((player) => player.id === state.online.playerId);
    const isHost = lobby.hostId === state.online.playerId;
    return `
      <section class="panel-section lobby-card">
        <div class="section-heading">
          <span>${lobby.botFilled ? "Bot-Filled Match" : lobby.roomType === "public" ? "Public Match" : "Private Room"}</span>
          <strong>${escapeHtml(lobby.roomCode)}</strong>
        </div>
        <div class="room-code-row">
          <b>${escapeHtml(lobby.roomCode)}</b>
          <button class="secondary-action" data-action="online-copy-code" type="button">Copy</button>
        </div>
        <div class="summary-pills">
          <span>${escapeHtml(getGameMode(lobby.settings.modeId).label)}</span>
          <span>${escapeHtml(lobby.settings.boardPresetId)}</span>
          <span>${lobby.players.length}/${lobby.maxPlayers}</span>
          ${lobby.botFilled ? "<span>Bots joined</span>" : ""}
        </div>
      </section>
      <section class="panel-section">
        <div class="section-heading">
          <span>Seats</span>
          <strong>${lobby.status}</strong>
        </div>
        <div class="player-list">
          ${lobby.players.map((player) => `
            <div class="player-row ${player.connected ? "" : "is-disconnected"}">
              <span class="mini-token"></span>
              <strong>${escapeHtml(player.name)} ${player.isHost ? `<b class="bot-badge">HOST</b>` : ""} ${player.type === "bot" ? `<b class="bot-badge">BOT</b>` : ""}</strong>
              <em>${player.connected ? (player.ready ? "Ready" : "Waiting") : "Disconnected"}</em>
            </div>
          `).join("")}
        </div>
      </section>
      <section class="panel-section settings-grid match-settings-grid">
        ${!isHost ? `
          <button class="setting-toggle ${me?.ready ? "is-on" : ""}" data-action="online-ready" data-ready="${me?.ready ? "false" : "true"}" type="button">
            <span>Ready</span><strong>${me?.ready ? "ON" : "OFF"}</strong>
          </button>
        ` : `
          <button class="setting-toggle" data-action="online-fill-bots" type="button"><span>Fill Bots</span><strong>Server</strong></button>
          <button class="setting-toggle is-on" data-action="online-start" type="button"><span>Start Match</span><strong>Host</strong></button>
        `}
        <button class="setting-toggle is-danger" data-action="online-leave" type="button"><span>Quit Match</span><strong>Leave</strong></button>
      </section>
      ${lobby.countdownMs ? `<div class="validation-banner">Match starts in ${Math.ceil(lobby.countdownMs / 1000)} seconds.</div>` : ""}
      ${this.renderOnlineError(state)}
    `;
  }

  renderOnlineError(state) {
    return state.online?.error ? `<div class="validation-banner">${escapeHtml(state.online.error)}</div>` : "";
  }

  renderGamePanel(state) {
    const currentPlayer = state.players[state.currentPlayerIndex];
    const disabled = state.isRolling || state.isMoving || state.pendingRoll || state.gameStatus !== "playing" || currentPlayer?.type === "bot";
    const mode = getGameMode(state.modeId);
    const isOnlineMatch = state.matchOrigin === "online";
    const onlineRoomType = state.online?.botFilled ? "Bot-Filled Match" : (state.online?.lobby?.roomType || state.online?.roomType) === "public" ? "Public Match" : "Private Room";
    const onlineSelf = isOnlineMatch ? state.players.find((player) => player.id === state.online?.playerId) : null;
    const onlineTurnLabel = state.online?.isMyTurn ? "Your turn" : `${currentPlayer?.name || "Player"} turn`;
    return `
      ${isOnlineMatch ? `
        <section class="panel-section online-match-card ${state.online?.lobby?.roomType === "public" ? "is-public" : "is-private"}">
          <div class="online-match-card-head">
            <div>
              <p class="eyebrow">Online Match</p>
              <h2>${escapeHtml(onlineRoomType)}</h2>
            </div>
            <span class="status-pill ${state.gameStatus === "won" ? "is-won" : ""}">${state.gameStatus === "won" ? "Won" : escapeHtml(state.diceState)}</span>
          </div>
          <div class="online-room-code-card">
            <div>
              <span>${escapeHtml(onlineRoomType)}</span>
              <strong>${escapeHtml(state.online?.roomCode || "Room")}</strong>
            </div>
            <em>${escapeHtml(connectionLabel(state.online?.connectionStatus))}</em>
          </div>
          <div class="online-live-grid">
            <span><b>Turn</b>${escapeHtml(onlineTurnLabel)}</span>
            <span><b>Seat</b>${escapeHtml(onlineSelf ? onlineSelf.name : "Watching")}</span>
            <span><b>Sync</b>${state.online?.playerId ? "Server locked" : "Viewer"}</span>
          </div>
          <div class="online-room-actions">
            <button class="secondary-action" data-action="online-copy-code" type="button">Copy Code</button>
            <button class="secondary-action danger-action" data-action="online-leave" type="button">Quit Match</button>
          </div>
        </section>
      ` : `
        <div class="panel-title-row">
          <div>
            <p class="eyebrow">Turn ${state.turnCount}</p>
            <h2>Royale Match</h2>
          </div>
          <span class="status-pill ${state.gameStatus === "won" ? "is-won" : ""}">${state.gameStatus === "won" ? "Won" : escapeHtml(state.diceState)}</span>
        </div>
      `}
      ${isOnlineMatch && state.online?.error ? `<div class="validation-banner">${escapeHtml(state.online.error)}</div>` : ""}

      <section class="panel-section mode-summary">
        <div class="section-heading">
          <span>${escapeHtml(mode.label)}</span>
          <strong>Finish ${state.activeBoard?.finishTile || 100}</strong>
        </div>
        <div class="summary-pills">
          <span>${escapeHtml(state.activeBoard?.preset?.label || "Classic 100")}</span>
          <span>Power ${state.powerUpsEnabled ? "ON" : "OFF"}</span>
          <span>Events ${state.eventTilesEnabled ? "ON" : "OFF"}</span>
        </div>
      </section>

      <section class="current-card ${currentPlayer?.type === "bot" ? "is-bot" : ""}" style="--token:${currentPlayer?.color || "#c9a35d"}">
        <div class="token-orb"></div>
        <div>
          <span>Current Player ${currentPlayer?.type === "bot" ? `<b class="bot-badge">BOT</b>` : ""}</span>
          <strong>${escapeHtml(currentPlayer?.name || "Waiting")}</strong>
          <small>${escapeHtml(botLine(state, currentPlayer))}${renderStatusInline(currentPlayer)}</small>
        </div>
      </section>

      <section class="panel-section dice-section">
        <div class="section-heading">
          <span>Dice</span>
          <strong>${state.diceResult || "-"}</strong>
        </div>
        <button class="secondary-action" data-action="roll" type="button" ${disabled ? "disabled" : ""}>${buttonText(state)}</button>
      </section>

      ${this.renderPowerSection(state, currentPlayer)}

      <section class="panel-section">
        <div class="section-heading">
          <span>Player Positions</span>
          <strong>${state.players.length}</strong>
        </div>
        <div class="player-list">
          ${state.players.map((player, index) => this.renderPlayerRow(player, index, state)).join("")}
        </div>
      </section>

      <section class="panel-section">
        <div class="section-heading">
          <span>Match Stats</span>
          <strong>${state.matchStats?.totalTurns || 0} rolls</strong>
        </div>
        <div class="stats-grid">
          ${state.players.map((player) => this.renderStatsRow(player, state)).join("")}
        </div>
      </section>

      ${this.renderEventLegend(state)}

      <section class="panel-section">
        <div class="section-heading">
          <span>Rules</span>
          <strong>Locked</strong>
        </div>
        <div class="rule-grid is-locked">
          ${getRuleRows(state.rules).map(([, label, enabled]) => `
            <div class="rule-toggle ${enabled ? "is-on" : ""}">
              <span>${label}</span><strong>${enabled ? "ON" : "OFF"}</strong>
            </div>
          `).join("")}
        </div>
      </section>

      <section class="panel-section">
        <div class="section-heading">
          <span>Game Log</span>
          <strong>${state.gameLog.length}</strong>
        </div>
        <div class="game-log">
          ${state.gameLog.map((entry) => `
            <div class="log-entry is-${entry.type}" data-id="${entry.id}">
              <span>${escapeHtml(entry.icon || "Log")}</span>
              <p>${escapeHtml(entry.message)}</p>
            </div>
          `).join("") || `<div class="log-entry"><span>Info</span><p>No moves yet.</p></div>`}
        </div>
      </section>

      <section class="panel-section settings-grid match-settings-grid">
        <button class="setting-toggle ${state.cinematicCameraEnabled ? "is-on" : ""}" data-action="toggle-cinematic" type="button">
          <span>Cinematic Camera</span><strong>${state.cinematicCameraEnabled ? "ON" : "OFF"}</strong>
        </button>
        <button class="setting-toggle ${state.soundEnabled ? "is-on" : ""}" data-action="toggle-sound" type="button">
          <span>Sound</span><strong>${state.soundEnabled ? "ON" : "OFF"}</strong>
        </button>
        <div class="setting-toggle quality-setting">
          <span>Quality</span><strong>${escapeHtml(state.qualityProfile?.label || "Auto")}</strong>
          <div class="quality-grid compact">
            ${getQualityRows().map(([id, label]) => `
              <button class="${state.qualityLevel === id ? "is-active" : ""}" data-action="quality-select" data-quality="${id}" type="button">${label}</button>
            `).join("")}
          </div>
        </div>
        ${isOnlineMatch ? `
          ${state.gameStatus === "won" ? `
            <button class="setting-toggle" data-action="rematch" type="button">
              <span>Vote Rematch</span><strong>Online</strong>
            </button>
          ` : ""}
        ` : `
          <button class="setting-toggle" data-action="restart" type="button">
            <span>Restart Match</span><strong>Reset</strong>
          </button>
          <button class="setting-toggle" data-action="rematch" type="button">
            <span>Rematch Same Settings</span><strong>Clean</strong>
          </button>
          <button class="setting-toggle" data-action="change-setup" type="button">
            <span>Change Setup</span><strong>Panel</strong>
          </button>
          <button class="setting-toggle" data-action="menu" type="button">
            <span>Main Menu</span><strong>Local</strong>
          </button>
        `}
      </section>
    `;
  }

  renderPowerSection(state, currentPlayer) {
    if (!state.powerUpsEnabled) return "";
    const held = currentPlayer?.status?.heldPowerUp;
    const isHumanTurn = currentPlayer?.type === "human" && state.gameStatus === "playing";
    const canUseSwap = isHumanTurn && held === "swap" && !state.isRolling && !state.isMoving && !state.pendingRoll;
    const targets = state.players.filter((player) => player.id !== currentPlayer?.id && player.position !== currentPlayer?.position);
    return `
      <section class="panel-section power-section">
        <div class="section-heading">
          <span>Power-Up</span>
          <strong>${held ? escapeHtml(getPowerUpLabel(held)) : "Empty"}</strong>
        </div>
        ${state.pendingRoll && held === "reroll" ? `
          <div class="pending-roll">
            <span>Rolled ${state.pendingRoll.result}. Use Reroll?</span>
            <div>
              <button class="secondary-action" data-action="keep-roll" type="button">Keep</button>
              <button class="primary-action" data-action="use-reroll" type="button">Reroll</button>
            </div>
          </div>
        ` : held === "swap" ? `
          <div class="swap-control">
            <select data-swap-target aria-label="Swap target" ${canUseSwap ? "" : "disabled"}>
              ${targets.map((target) => `
                <option value="${target.id}" ${state.selectedSwapTargetId === target.id ? "selected" : ""}>${escapeHtml(target.name)} - Tile ${target.position}</option>
              `).join("") || `<option>No target</option>`}
            </select>
            <button class="secondary-action" data-action="use-powerup" type="button" ${canUseSwap && targets.length ? "" : "disabled"}>Use Swap</button>
          </div>
        ` : `
          <div class="placeholder-row full">
            <span>${held ? `${escapeHtml(getPowerUpLabel(held))} is automatic` : "No power-up held"}</span>
            <em>${held === "shield" ? "Blocks next snake" : held === "reroll" ? "Available after roll" : "Power tiles can grant one"}</em>
          </div>
        `}
      </section>
    `;
  }

  renderEventLegend(state) {
    if (!state.eventTilesEnabled) return "";
    const rows = getEventTileRows(state.activeBoard?.eventTilesMap);
    return `
      <section class="panel-section">
        <div class="section-heading">
          <span>Event Tiles</span>
          <strong>${rows.length}</strong>
        </div>
        <div class="event-legend">
          ${rows.map((row) => {
            const definition = EVENT_TILE_DEFINITIONS[row.type] || row;
            return `
              <div>
                <b>${escapeHtml(definition?.marker || "?")}</b>
                <span>${escapeHtml(definition?.label || row.type)}</span>
                <em>${row.tile}</em>
              </div>
            `;
          }).join("") || `<div><span>No event tiles in this preset.</span></div>`}
        </div>
      </section>
    `;
  }

  renderPlayerRow(player, index, state) {
    return `
      <div class="player-row ${index === state.currentPlayerIndex ? "is-active" : ""} ${state.winner?.id === player.id ? "is-winner" : ""}">
        <span class="mini-token" style="--token:${player.color}"></span>
        <strong>${escapeHtml(player.name)} ${player.type === "bot" ? `<b class="bot-badge">BOT</b>` : ""}</strong>
        <em>Tile ${player.position}${player.connected === false ? " | Offline" : ""}${player.status?.heldPowerUp ? ` | ${escapeHtml(getPowerUpLabel(player.status.heldPowerUp))}` : ""}${player.status?.skipNextTurn ? " | Skip" : ""}${player.status?.safeTile ? " | Safe" : ""}</em>
      </div>
    `;
  }

  renderStatsRow(player, state) {
    const stats = state.matchStats?.players?.find((entry) => entry.id === player.id);
    if (!stats) return "";
    return `
      <div class="stats-row">
        <strong>${escapeHtml(player.name)}</strong>
        <span>R ${stats.totalRolls}</span>
        <span>6s ${stats.sixes}</span>
        <span>L ${stats.laddersClimbed}</span>
        <span>S ${stats.snakesHit}</span>
        <span>P ${stats.powerUpsUsed || 0}</span>
      </div>
    `;
  }

  renderHud(state) {
    if (state.gameStatus === "menu" && state.online?.view === "queue") {
      const queue = state.online.queue || {};
      this.rollButton.disabled = true;
      this.rollButton.textContent = queue.status === "botFillSoon" ? "Bots Soon" : queue.status === "addingBots" ? "Match Found" : "Searching";
      this.rollButton.classList.remove("is-ready", "is-bot-turn");
      this.turnBadge.innerHTML = `<span class="mini-token"></span><strong>${escapeHtml(queue.message || "Searching...")}</strong>`;
      this.diceMini.innerHTML = `<span>Queue</span><strong>${escapeHtml(String(queue.playersFound || 1))}/${escapeHtml(String(queue.targetPlayerCount || queue.preferredPlayerCount || 2))}</strong>`;
      return;
    }

    const currentPlayer = state.players[state.currentPlayerIndex];
    const isBotTurn = currentPlayer?.type === "bot";
    const onlineBlocked = state.matchOrigin === "online" && (!state.online?.isMyTurn || ["reconnecting", "disconnected", "unavailable"].includes(state.online?.connectionStatus));
    const disabled = state.gameStatus !== "playing" || state.introActive || state.isRolling || state.isMoving || Boolean(state.pendingRoll) || Boolean(state.winner) || isBotTurn || onlineBlocked;
    this.rollButton.disabled = disabled;
    this.rollButton.textContent = buttonText(state);
    this.rollButton.classList.toggle("is-ready", !disabled && state.gameStatus === "playing");
    this.rollButton.classList.toggle("is-bot-turn", Boolean(isBotTurn));

    this.turnBadge.innerHTML = currentPlayer
      ? `<span class="mini-token" style="--token:${currentPlayer.color}"></span><strong>${escapeHtml(currentPlayer.name)}</strong>${currentPlayer.type === "bot" ? `<b class="bot-badge">BOT</b>` : ""}`
      : `<span class="mini-token"></span><strong>Setup</strong>`;

    const held = currentPlayer?.status?.heldPowerUp;
    this.diceMini.innerHTML = `<span>${state.matchOrigin === "online" ? escapeHtml(connectionLabel(state.online?.connectionStatus)) : "Dice"}</span><strong>${state.diceResult || "-"}</strong>${held && currentPlayer?.type === "human" ? `<em>${escapeHtml(getPowerUpLabel(held))}</em>` : ""}`;
  }

  renderConnectionOverlay(state) {
    if (state.online?.quitConfirm) {
      const roomLabel = state.online?.roomCode ? `Room ${state.online.roomCode}` : "this online room";
      this.connectionOverlay.className = "connection-overlay is-visible is-quit-confirm";
      this.connectionOverlay.innerHTML = `
        <div class="connection-overlay-card quit-confirm-card" role="dialog" aria-modal="true" aria-label="Confirm quit match">
          <p class="eyebrow">Leave Online Room</p>
          <h2>Quit match?</h2>
          <p>You will leave ${escapeHtml(roomLabel)} and return to the private room screen.</p>
          <div class="connection-overlay-actions quit-confirm-actions">
            <button class="secondary-action" data-action="online-leave-cancel" type="button">Stay</button>
            <button class="primary-action danger-action" data-action="online-leave-confirm" type="button">Leave Room</button>
          </div>
        </div>
      `;
      return;
    }

    const status = state.online?.connectionStatus || "offline";
    const transient = ["reconnecting", "disconnected"].includes(status);
    const expired = state.online?.error && /expired|connection lost|seat was replaced|server unavailable/i.test(state.online.error);
    const onlineContext = state.matchOrigin === "online" || Boolean(state.online?.roomCode) || Boolean(expired && state.online?.view !== "local");
    const show = onlineContext && (transient || expired);
    if (!show) {
      this.connectionOverlay.className = "connection-overlay";
      this.connectionOverlay.innerHTML = "";
      return;
    }

    const title = status === "reconnecting"
      ? "Reconnecting to the royal table"
      : expired
        ? "Match connection needs attention"
        : "Connection interrupted";
    const detail = state.online?.error
      || (status === "reconnecting" ? "Trying to restore your in-memory room session." : "The server connection was interrupted.");
    this.connectionOverlay.className = "connection-overlay is-visible";
    this.connectionOverlay.innerHTML = `
      <div class="connection-overlay-card" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}">
        <span class="connection-loader" aria-hidden="true"></span>
        <p class="eyebrow">Online Royale</p>
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(detail)}</p>
        <div class="connection-overlay-actions">
          <button class="primary-action" data-action="online-retry" type="button">Retry Online</button>
          <button class="secondary-action" data-action="play-surface" data-surface="local" type="button">Play Local</button>
          <button class="secondary-action" data-action="menu" type="button">Return to menu</button>
        </div>
      </div>
    `;
  }

  renderVictory(state) {
    if (state.gameStatus !== "won" || !state.winner) {
      this.victory.className = "victory-overlay";
      this.victory.innerHTML = "";
      return;
    }

    const stats = state.matchStats;
    const onlineMatchType = state.online?.botFilled ? "Bot-Filled Match" : state.online?.roomType === "public" ? "Public Match" : "Private Room";
    this.victory.className = "victory-overlay is-visible";
    this.victory.innerHTML = `
      <div class="victory-card">
        <div class="victory-token" style="--token:${state.winner.color}"></div>
        <p class="eyebrow">${state.matchOrigin === "online" ? escapeHtml(onlineMatchType) : "Royal Finish"}</p>
        <h2>${escapeHtml(state.winner.name)} wins!</h2>
        <p>${stats?.totalTurns || 0} total rolls in ${escapeHtml(getGameMode(state.modeId).label)}. Final positions and awards are sealed below.</p>
        <div class="final-positions">
          ${state.players.map((player) => {
            const row = stats?.players?.find((entry) => entry.id === player.id);
            return `
              <div>
                <span class="mini-token" style="--token:${player.color}"></span>
                <strong>${escapeHtml(player.name)} ${player.type === "bot" ? `<b class="bot-badge">BOT</b>` : ""}</strong>
                <em>Tile ${player.position} | R ${row?.totalRolls || 0} | P ${row?.powerUpsUsed || 0}</em>
              </div>
            `;
          }).join("")}
        </div>
        <div class="award-grid">
          ${(stats?.awards || []).map((award) => `
            <div class="award-card">
              <span>${escapeHtml(award.title)}</span>
              <strong>${escapeHtml(award.playerName)}</strong>
              <em>${escapeHtml(award.value)}</em>
            </div>
          `).join("")}
        </div>
        <div class="victory-actions">
          ${state.matchOrigin === "online" ? `
            <button class="primary-action" data-action="rematch" type="button">Vote Rematch</button>
            ${state.online?.roomType === "public" ? `<button class="secondary-action" data-action="find-new-match" type="button">Find New Match</button>` : ""}
            <button class="secondary-action danger-action" data-action="online-leave" type="button">Quit Match</button>
          ` : `
            <button class="primary-action" data-action="rematch" type="button">Rematch Same Settings</button>
            <button class="secondary-action" data-action="change-setup" type="button">Change Setup</button>
            <button class="secondary-action" data-action="restart-classic" type="button">Restart Classic</button>
            <button class="secondary-action" data-action="menu" type="button">Main Menu</button>
          `}
        </div>
      </div>
    `;
  }
}

function botLine(state, currentPlayer) {
  if (!currentPlayer) return "Waiting";
  if (currentPlayer.type === "bot" && state.botStatus.active) {
    return state.botStatus.detail || state.botStatus.text || "Bot turn";
  }
  if (currentPlayer.type === "bot") return getPersonalityLabel(currentPlayer.personality);
  return `Tile ${currentPlayer.position}`;
}

function buttonText(state) {
  const currentPlayer = state.players[state.currentPlayerIndex];
  if (state.gameStatus === "won") return "Won";
  if (state.introActive) return "Intro";
  if (state.matchOrigin === "online" && ["reconnecting", "disconnected", "unavailable"].includes(state.online?.connectionStatus)) {
    return state.online.connectionStatus === "reconnecting" ? "Reconnecting" : "Offline";
  }
  if (state.matchOrigin === "online" && !state.online?.isMyTurn) {
    if (currentPlayer?.type === "bot") return "Bot Turn";
    return currentPlayer ? `${currentPlayer.name} Turn` : "Waiting";
  }
  if (state.pendingRoll) return "Choose Reroll";
  if (currentPlayer?.type === "bot") {
    if (state.botStatus.text === "Bot is thinking...") return "Bot Thinking...";
    if (state.botStatus.text === "Bot is rolling...") return "Bot Rolling...";
    if (state.botStatus.text === "Bot is moving...") return "Bot Moving...";
    return "Bot Turn";
  }
  if (state.isRolling) return "Rolling...";
  if (state.isMoving) return "Moving...";
  return "Roll";
}

function connectionLabel(status) {
  return {
    connected: "Connected",
    reconnecting: "Reconnecting",
    disconnected: "Disconnected",
    unavailable: "Server unavailable",
    offline: "Offline"
  }[status] || "Offline";
}

function renderAccessibilityToggles(state) {
  const rows = [
    ["reduceMotion", "Reduce motion"],
    ["highContrastNumbers", "High contrast numbers"],
    ["largeText", "Larger UI text"]
  ];
  return rows.map(([key, label]) => {
    const enabled = Boolean(state.accessibility?.[key]);
    return `
      <button class="rule-toggle ${enabled ? "is-on" : ""}" data-action="accessibility-toggle" data-key="${key}" type="button">
        <span>${label}</span><strong>${enabled ? "ON" : "OFF"}</strong>
      </button>
    `;
  }).join("");
}

function renderIntroPlayer(player, index, sideClass, matchType) {
  const safePlayer = player || {};
  return `
    <div class="match-intro-player ${sideClass}" style="--token:${safePlayer.color || PLAYER_COLORS[index % PLAYER_COLORS.length]}">
      <span class="match-intro-side">${escapeHtml(matchType)} ${safePlayer.type === "bot" ? `<b class="bot-badge">BOT</b>` : ""}</span>
      <span class="match-intro-token" aria-hidden="true"></span>
      <strong class="match-intro-name">${escapeHtml(safePlayer.name || ["Crown One", "Crown Two", "Crown Three", "Crown Four"][index] || `Guest ${index + 1}`)}</strong>
    </div>
  `;
}

function renderIntroMiniPlayer(player, index, matchType) {
  const safePlayer = player || {};
  return `
    <div class="match-intro-mini" style="--token:${safePlayer.color || PLAYER_COLORS[index % PLAYER_COLORS.length]}">
      <span class="match-intro-token" aria-hidden="true"></span>
      <strong>${escapeHtml(safePlayer.name || `Guest ${index + 1}`)}</strong>
      <em>${escapeHtml(matchType)} ${safePlayer.type === "bot" ? "BOT" : ""}</em>
    </div>
  `;
}

function renderStatusInline(player) {
  if (!player?.status) return "";
  const parts = [];
  if (player.status.heldPowerUp) parts.push(getPowerUpLabel(player.status.heldPowerUp));
  if (player.status.skipNextTurn) parts.push("Skip next");
  if (player.status.safeTile) parts.push("Safe");
  return parts.length ? ` | ${parts.join(" | ")}` : "";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
