import { CUBE_SIZE_PRESETS, getCubeSizePreset } from "./cubeState.js";
import { GAME_MODES, getMode } from "./gameModes.js";
import { MISSIONS } from "./missionManager.js";
import { PATTERNS } from "./patternManager.js";
import { formatTime } from "./storage.js";

const MOVE_KEYS = new Set(["U", "D", "L", "R", "F", "B", "M", "E", "S"]);
const SKIN_LABELS = {
  premiumSpeedcube: "Ivory Speedcube",
  classicStickered: "Classic",
  ivoryRoyale: "Ivory Royale",
  glassPrism: "Glass Prism",
  darkNeon: "Dark Neon",
  woodenPuzzle: "Wooden Puzzle"
};

function isEditableTarget(target) {
  return Boolean(target.closest?.("input, textarea, select, [contenteditable='true']"));
}

function buttonText(button, value) {
  if (button) button.textContent = value;
}

export class UIController {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.timer = document.querySelector("#timer");
    this.moveCount = document.querySelector("#move-count");
    this.bestTime = document.querySelector("#best-time");
    this.bestMoves = document.querySelector("#best-moves");
    this.moveStatus = document.querySelector("#move-status");
    this.scrambleStatus = document.querySelector("#scramble-status");
    this.helpPanel = document.querySelector("#help-panel");
    this.victoryPanel = document.querySelector("#victory-panel");
    this.victoryTime = document.querySelector("#victory-time");
    this.victoryMoves = document.querySelector("#victory-moves");
    this.victoryTps = document.querySelector("#victory-tps");
    this.victoryGrade = document.querySelector("#victory-grade");
    this.victoryBestTime = document.querySelector("#victory-best-time");
    this.victoryBestMoves = document.querySelector("#victory-best-moves");
    this.victorySize = document.querySelector("#victory-size");
    this.currentSizeBadge = document.querySelector("#current-size-badge");
    this.currentModeBadge = document.querySelector("#current-mode-badge");
    this.currentSkinBadge = document.querySelector("#current-skin-badge");
    this.guideCompatibility = document.querySelector("#guide-compatibility");
    this.layerIndicator = document.querySelector("#layer-indicator");
    this.sizeConfirmPanel = document.querySelector("#size-confirm-panel");
    this.sizeConfirmCopy = document.querySelector("#size-confirm-copy");
    this.modeGrid = document.querySelector("#mode-grid");
    this.missionList = document.querySelector("#mission-list");
    this.patternList = document.querySelector("#pattern-list");
    this.historyList = document.querySelector("#history-list");
    this.scrambleCopyText = document.querySelector("#scramble-copy-text");
    this.guideTitle = document.querySelector("#guide-title");
    this.guideGoal = document.querySelector("#guide-goal");
    this.guideObjective = document.querySelector("#guide-objective");
    this.guideAlgorithm = document.querySelector("#guide-algorithm");
    this.hintOutput = document.querySelector("#hint-output");
    this.statsPanel = document.querySelector("#stats-panel");
    this.missionCompletePanel = document.querySelector("#mission-complete-panel");
    this.missionCompleteCopy = document.querySelector("#mission-complete-copy");
    this.missionTime = document.querySelector("#mission-time");
    this.missionMoves = document.querySelector("#mission-moves");
    this.missionBestTime = document.querySelector("#mission-best-time");
    this.missionBestMoves = document.querySelector("#mission-best-moves");
    this.buttons = [...document.querySelectorAll("button")];
    this.styleButtons = [...document.querySelectorAll("[data-style]")];
    this.sizeButtons = [...document.querySelectorAll("[data-size]")];
    this.sizeMeta = [...document.querySelectorAll("[data-size-meta]")];
    this.layerButtons = [...document.querySelectorAll("[data-layer-step]")];
    this.sliceButtons = [...document.querySelectorAll(".slice-moves button")];
    this.controlPanel = document.querySelector("#control-panel");
    this.panelToggle = document.querySelector("[data-action='panel-toggle']");
    this.drawerTabs = [...document.querySelectorAll("[data-drawer-tab]")];
    this.drawerPanels = [...document.querySelectorAll("[data-drawer-panel]")];
    this.settingsInputs = [...document.querySelectorAll("[data-setting]")];
    this.isControlPanelOpen = !this.controlPanel?.classList.contains("is-collapsed");
    this.pendingSizeConfirm = null;
    this.currentMode = "free";
    this.currentSize = 3;
    this.currentLayerIndex = 1;

    this.renderModeCards();
    this.bindEvents();
    window.addEventListener("keydown", this.onKeyDown);
  }

  dispose() {
    window.removeEventListener("keydown", this.onKeyDown);
  }

  bindEvents() {
    document.querySelectorAll("[data-move]").forEach((button) => {
      button.addEventListener("click", () => this.fireMove(button.dataset.move, "button", button));
    });

    this.styleButtons.forEach((button) => {
      button.addEventListener("click", () => this.callbacks.style(button.dataset.style));
    });

    this.sizeButtons.forEach((button) => {
      button.addEventListener("click", () => this.callbacks.size(Number(button.dataset.size)));
    });

    this.layerButtons.forEach((button) => {
      button.addEventListener("click", () => this.callbacks.layerStep(Number(button.dataset.layerStep)));
    });

    this.drawerTabs.forEach((button) => {
      button.addEventListener("click", () => this.setActiveDrawerPanel(button.dataset.drawerTab));
    });

    document.querySelectorAll("[data-camera-preset]").forEach((button) => {
      button.addEventListener("click", () => this.callbacks.cameraPreset(button.dataset.cameraPreset));
    });

    document.querySelectorAll("[data-hint-level]").forEach((button) => {
      button.addEventListener("click", () => this.callbacks.hint(button.dataset.hintLevel));
    });

    this.settingsInputs.forEach((input) => {
      input.addEventListener("input", () => this.emitSetting(input));
      input.addEventListener("change", () => this.emitSetting(input));
    });

    document.querySelector("[data-action='scramble']")?.addEventListener("click", () => this.callbacks.scramble());
    document.querySelector("[data-action='undo']")?.addEventListener("click", () => this.callbacks.undo());
    document.querySelector("[data-action='redo']")?.addEventListener("click", () => this.callbacks.redo());
    document.querySelector("[data-action='reset']")?.addEventListener("click", () => this.callbacks.reset());
    document.querySelector("[data-action='camera']")?.addEventListener("click", () => this.callbacks.resetCamera());
    document.querySelector("[data-action='help']")?.addEventListener("click", () => this.showHelp());
    document.querySelector("[data-action='timed-start']")?.addEventListener("click", () => this.callbacks.timedStart());
    document.querySelector("[data-action='fullscreen']")?.addEventListener("click", () => this.callbacks.fullscreen());
    document.querySelector("[data-action='guide-prev']")?.addEventListener("click", () => this.callbacks.guideStep(-1));
    document.querySelector("[data-action='guide-next']")?.addEventListener("click", () => this.callbacks.guideStep(1));
    document.querySelector("[data-action='guide-check']")?.addEventListener("click", () => this.callbacks.guideCheck());
    document.querySelector("[data-action='copy-scramble']")?.addEventListener("click", () => this.callbacks.copyScramble());
    document.querySelector("[data-action='copy-history']")?.addEventListener("click", () => this.callbacks.copyHistory());
    document.querySelector("[data-action='clear-history']")?.addEventListener("click", () => this.callbacks.clearHistory());
    this.panelToggle?.addEventListener("click", () => this.setControlPanelOpen(!this.isControlPanelOpen));
    document.querySelector("[data-close-help]")?.addEventListener("click", () => this.hideHelp());
    document.querySelector("[data-action='victory-restart']")?.addEventListener("click", () => {
      this.hideVictory();
      this.callbacks.reset();
    });
    document.querySelector("[data-action='size-cancel']")?.addEventListener("click", () => this.hideSizeConfirmation());
    document.querySelector("[data-action='size-confirm']")?.addEventListener("click", () => {
      const pending = this.pendingSizeConfirm;
      this.hideSizeConfirmation();
      pending?.();
    });
    document.querySelector("[data-action='mission-close']")?.addEventListener("click", () => this.hideMissionComplete());
    document.querySelector("[data-action='mission-next']")?.addEventListener("click", () => this.callbacks.nextMission());

    this.helpPanel?.addEventListener("click", (event) => {
      if (event.target === this.helpPanel) this.hideHelp();
    });
    this.victoryPanel?.addEventListener("click", (event) => {
      if (event.target === this.victoryPanel) this.hideVictory();
    });
    this.missionCompletePanel?.addEventListener("click", (event) => {
      if (event.target === this.missionCompletePanel) this.hideMissionComplete();
    });
  }

  emitSetting(input) {
    const key = input.dataset.setting;
    const value = input.type === "checkbox" ? input.checked : input.type === "range" ? Number(input.value) : input.value;
    this.callbacks.settings({ [key]: value });
  }

  renderModeCards() {
    if (!this.modeGrid) return;
    this.modeGrid.replaceChildren(...GAME_MODES.map((mode) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mode-card";
      button.dataset.mode = mode.id;
      button.innerHTML = `<strong>${mode.title}</strong><span>${mode.badge}</span><small>${mode.description}</small>`;
      button.addEventListener("click", () => this.callbacks.mode(mode.id));
      return button;
    }));
  }

  renderMissions({ size, progress = {}, activeMissionId = null } = {}) {
    if (!this.missionList) return;
    const missions = MISSIONS.filter((mission) => mission.size === size);
    this.missionList.replaceChildren(...missions.map((mission) => {
      const record = progress[mission.id] || {};
      const button = document.createElement("button");
      button.type = "button";
      button.className = `mission-card${record.completed ? " is-complete" : ""}${mission.id === activeMissionId ? " is-active" : ""}`;
      button.dataset.missionId = mission.id;
      button.innerHTML = `
        <strong>${mission.title}</strong>
        <span>${mission.difficulty} · ${mission.type}</span>
        <small>${mission.objective}${record.completed ? " · Completed" : ""}</small>
      `;
      button.addEventListener("click", () => this.callbacks.mission(mission.id));
      return button;
    }));
  }

  renderPatterns(size) {
    if (!this.patternList) return;
    const patterns = PATTERNS.filter((pattern) => pattern.sizes.includes(size));
    this.patternList.replaceChildren(...patterns.map((pattern) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "pattern-card";
      button.dataset.patternId = pattern.id;
      button.innerHTML = `<strong>${pattern.title}</strong><span>${pattern.difficulty}</span><small>${pattern.description}</small>`;
      button.addEventListener("click", () => this.callbacks.pattern(pattern.id));
      return button;
    }));
  }

  onKeyDown = (event) => {
    if (isEditableTarget(event.target) || event.ctrlKey || event.metaKey) {
      return;
    }

    const key = event.key.toUpperCase();
    if (!MOVE_KEYS.has(key)) {
      if (event.key === "Escape") {
        if (!this.sizeConfirmPanel.hidden) {
          this.hideSizeConfirmation();
        } else if (!this.helpPanel.hidden) {
          this.hideHelp();
        } else if (!this.missionCompletePanel.hidden) {
          this.hideMissionComplete();
        } else if (this.isControlPanelOpen) {
          this.setControlPanelOpen(false);
        }
      }
      return;
    }

    event.preventDefault();
    const notation = event.altKey ? `${key}2` : event.shiftKey ? `${key}'` : key;
    this.fireMove(notation, "keyboard");
  };

  fireMove(notation, source, button = null) {
    if (button) {
      button.classList.add("is-pressed");
      setTimeout(() => button.classList.remove("is-pressed"), 180);
    }

    this.callbacks.move(notation, source);
  }

  setBusy(isBusy) {
    this.buttons.forEach((button) => {
      if (
        button.dataset.action === "help" ||
        button.dataset.action === "panel-toggle" ||
        button.dataset.drawerTab
      ) {
        return;
      }
      button.disabled = isBusy;
    });

    if (!isBusy && this.currentSize) {
      this.setLayerControls(this.currentSize, this.currentLayerIndex);
    }
  }

  setActiveDrawerPanel(panelId) {
    this.drawerTabs.forEach((button) => button.classList.toggle("is-active", button.dataset.drawerTab === panelId));
    this.drawerPanels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.drawerPanel === panelId));
  }

  setControlPanelOpen(isOpen) {
    this.isControlPanelOpen = isOpen;
    this.controlPanel?.classList.toggle("is-collapsed", !isOpen);
    this.panelToggle?.setAttribute("aria-expanded", String(isOpen));
    this.panelToggle?.setAttribute("aria-label", isOpen ? "Hide controls panel" : "Show controls panel");
  }

  updateStats({ elapsedMs, moveCount, bestTimeMs, bestMoves }) {
    this.timer.textContent = formatTime(elapsedMs || 1).replace("--", "00:00.0");
    this.moveCount.textContent = String(moveCount);
    this.bestTime.textContent = formatTime(bestTimeMs);
    this.bestMoves.textContent = bestMoves ? String(bestMoves) : "--";
  }

  setMoveStatus(value) {
    this.moveStatus.textContent = value;
  }

  setScrambleStatus(value) {
    this.scrambleStatus.textContent = value;
    if (this.scrambleCopyText) this.scrambleCopyText.textContent = value;
  }

  setMode(modeId) {
    const mode = getMode(modeId);
    this.currentMode = mode.id;
    this.currentModeBadge.textContent = mode.title;
    document.querySelectorAll("[data-mode]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.mode === mode.id);
      button.setAttribute("aria-pressed", String(button.dataset.mode === mode.id));
    });
  }

  setCubeStyle(styleName) {
    this.currentSkinBadge.textContent = SKIN_LABELS[styleName] || styleName;
    this.styleButtons.forEach((button) => {
      const isActive = button.dataset.style === styleName;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  setCubeSize(size, bestBySize = {}) {
    const preset = getCubeSizePreset(size);
    const label = `${preset.size}x${preset.size} ${preset.name}`;
    this.currentSize = preset.size;

    this.currentSizeBadge.textContent = label;
    this.sizeButtons.forEach((button) => {
      const cardSize = Number(button.dataset.size);
      const isActive = cardSize === preset.size;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    this.sizeMeta.forEach((meta) => {
      const cardSize = Number(meta.dataset.sizeMeta);
      const cardPreset = getCubeSizePreset(cardSize);
      const best = bestBySize[cardSize] || {};
      const bestTime = best.bestTimeMs ? formatTime(best.bestTimeMs) : "--";
      const bestMoves = best.bestMoves || "--";
      meta.textContent = `${cardPreset.difficulty} · ${cardPreset.guideSupport} · Best ${bestTime}/${bestMoves}`;
    });

    if (preset.size === 3) {
      this.guideCompatibility.textContent = "Guide mode is optimized for the 3x3 Classic Cube.";
      this.guideCompatibility.classList.add("is-optimized");
    } else if (preset.size === 2) {
      this.guideCompatibility.textContent = "Simple 2x2 beginner guide is available.";
      this.guideCompatibility.classList.add("is-optimized");
    } else {
      this.guideCompatibility.textContent = "Guide mode for larger cubes is coming later. Use Free Solve or Timed Challenge.";
      this.guideCompatibility.classList.remove("is-optimized");
    }
  }

  setLayerControls(size, layerIndex) {
    this.currentSize = size;
    this.currentLayerIndex = layerIndex;
    const hasInnerLayer = size >= 3;
    const displayLayer = hasInnerLayer ? layerIndex + 1 : "-";
    this.layerIndicator.textContent = hasInnerLayer ? `Layer ${displayLayer} of ${size}` : "No inner layer";

    this.layerButtons.forEach((button) => {
      button.disabled = !hasInnerLayer;
    });
    this.sliceButtons.forEach((button) => {
      button.disabled = !hasInnerLayer;
    });
  }

  setGuideStatus(status) {
    if (!status?.stage) return;
    this.guideTitle.textContent = status.unsupported ? "Large cube guide" : `${status.index + 1}. ${status.stage.title}`;
    this.guideGoal.textContent = status.stage.goal;
    this.guideObjective.textContent = status.completed ? "Step complete." : status.stage.objective;
    this.guideAlgorithm.textContent = status.stage.algorithm || "No algorithm needed";
  }

  showHint(hint) {
    if (!hint) return;
    this.hintOutput.innerHTML = `<strong>${hint.levelLabel}: ${hint.title}</strong><br>${hint.text}${hint.algorithm ? `<br><em>${hint.algorithm}</em>` : ""}`;
  }

  renderHistory(history = []) {
    if (!this.historyList) return;
    if (!history.length) {
      this.historyList.textContent = "No moves yet.";
      return;
    }

    this.historyList.replaceChildren(...history.map((entry) => {
      const badge = document.createElement("span");
      badge.className = "move-badge";
      badge.innerHTML = `${entry.move.display || entry.move.notation}<small>${entry.source || "move"}</small>`;
      return badge;
    }));
  }

  setSettings(settings) {
    this.settingsInputs.forEach((input) => {
      const value = settings[input.dataset.setting];
      if (input.type === "checkbox") input.checked = Boolean(value);
      else input.value = value;
    });
  }

  setStatsPanel({ stats, totalStats, mode, skin }) {
    if (!this.statsPanel) return;
    this.statsPanel.innerHTML = `
      <span>Current size <strong>${stats.size}x${stats.size}</strong></span>
      <span>Total solves <strong>${totalStats.totalSolves || 0}</strong></span>
      <span>Total moves <strong>${totalStats.totalMoves || 0}</strong></span>
      <span>Missions completed <strong>${totalStats.totalMissionsCompleted || 0}</strong></span>
      <span>Best time <strong>${formatTime(stats.bestTimeMs)}</strong></span>
      <span>Best moves <strong>${stats.bestMoves || "--"}</strong></span>
      <span>Mode <strong>${getMode(mode).title}</strong></span>
      <span>Skin <strong>${SKIN_LABELS[skin] || skin}</strong></span>
    `;
  }

  showSizeConfirmation(size, onConfirm, customCopy = "") {
    const preset = getCubeSizePreset(size);
    this.pendingSizeConfirm = onConfirm;
    this.sizeConfirmCopy.textContent = customCopy ||
      `Switching to ${preset.size}x${preset.size} ${preset.name} will reset the current cube, timer, move history, and scramble.`;
    this.sizeConfirmPanel.hidden = false;
  }

  hideSizeConfirmation() {
    this.pendingSizeConfirm = null;
    this.sizeConfirmPanel.hidden = true;
  }

  showHelp() {
    this.helpPanel.hidden = false;
  }

  hideHelp() {
    this.helpPanel.hidden = true;
  }

  showVictory({ elapsedMs, moveCount, bestTimeMs, bestMoves, size, tps = 0, grade = "--" }) {
    const preset = getCubeSizePreset(size);
    this.victorySize.textContent = `${preset.size}x${preset.size} ${preset.name}`;
    this.victoryTime.textContent = formatTime(elapsedMs);
    this.victoryMoves.textContent = String(moveCount);
    this.victoryTps.textContent = tps.toFixed(2);
    this.victoryGrade.textContent = grade;
    this.victoryBestTime.textContent = formatTime(bestTimeMs);
    this.victoryBestMoves.textContent = bestMoves ? String(bestMoves) : "--";
    this.victoryPanel.hidden = false;
  }

  hideVictory() {
    this.victoryPanel.hidden = true;
  }

  showMissionComplete({ mission, elapsedMs, moveCount, record }) {
    this.missionCompleteCopy.textContent = `${mission.title}: ${mission.objective}`;
    this.missionTime.textContent = formatTime(elapsedMs);
    this.missionMoves.textContent = String(moveCount);
    this.missionBestTime.textContent = formatTime(record.bestTimeMs);
    this.missionBestMoves.textContent = record.bestMoves ? String(record.bestMoves) : "--";
    this.missionCompletePanel.hidden = false;
  }

  hideMissionComplete() {
    this.missionCompletePanel.hidden = true;
  }

  showCopyFeedback(type) {
    const button = document.querySelector(`[data-action='${type}']`);
    const original = button?.textContent;
    buttonText(button, "Copied");
    window.setTimeout(() => buttonText(button, original), 900);
  }
}
