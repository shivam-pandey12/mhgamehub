import { CUBE_SIZE_PRESETS, getCubeSizePreset } from "./cubeState.js";
import { GAME_MODES, getMode } from "./gameModes.js";
import { MISSIONS } from "./missionManager.js";
import { MEGAMINX_FACE_IDS, MEGAMINX_FACE_LABELS } from "./megaminxState.js";
import { PATTERNS } from "./patternManager.js";
import { PUZZLE_TYPES, getPuzzleType, getSkinOptions } from "./puzzleAdapters.js";
import { formatTime } from "./storage.js";

const SKIN_LABELS = {
  premiumSpeedcube: "Ivory Speedcube",
  classicStickered: "Classic",
  ivoryRoyale: "Ivory Royale",
  glassPrism: "Glass Prism",
  darkNeon: "Dark Neon",
  woodenPuzzle: "Wooden Puzzle",
  ivoryPyraminx: "Ivory Pyraminx",
  classicPyraminx: "Classic Pyraminx",
  glassPyraminx: "Glass Pyraminx",
  darkPyraminx: "Dark Pyraminx",
  ivorySkewb: "Ivory Skewb",
  classicSkewb: "Classic Skewb",
  glassSkewb: "Glass Skewb",
  darkSkewb: "Dark Skewb",
  ivoryMirror: "Ivory Mirror",
  goldenMirror: "Golden Mirror",
  silverMirror: "Classic Silver Mirror",
  darkMirror: "Dark Mirror",
  ivoryMegaminx: "Ivory Megaminx",
  classicMegaminx: "Classic Megaminx",
  glassMegaminx: "Glass Megaminx",
  darkMegaminx: "Dark Megaminx",
  goldenArtifact: "Golden Artifact"
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
    this.gameTitle = document.querySelector("#game-title");
    this.helpPanel = document.querySelector("#help-panel");
    this.helpTitle = document.querySelector("#help-title");
    this.helpCopy = document.querySelector("#help-copy");
    this.helpList = document.querySelector("#help-list");
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
    this.puzzleTypeGrid = document.querySelector("#puzzle-type-grid");
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
    this.replaySummary = document.querySelector("#replay-summary");
    this.replaySpeed = document.querySelector("#replay-speed");
    this.solutionPath = document.querySelector("#solution-path");
    this.dailyList = document.querySelector("#daily-list");
    this.weeklyList = document.querySelector("#weekly-list");
    this.dailyStatus = document.querySelector("#daily-status");
    this.mistakeToast = document.querySelector("#mistake-toast");
    this.mistakeTitle = document.querySelector("#mistake-title");
    this.mistakeCopy = document.querySelector("#mistake-copy");
    this.errorToast = document.querySelector("#error-toast");
    this.errorTitle = document.querySelector("#error-title");
    this.errorCopy = document.querySelector("#error-copy");
    this.statsPanel = document.querySelector("#stats-panel");
    this.statsFilterList = document.querySelector("#stats-filter-list");
    this.keyboardHelp = document.querySelector("#keyboard-help");
    this.launchOverlay = document.querySelector("#launch-overlay");
    this.returnGamehubButton = document.querySelector("#return-gamehub");
    this.skinGrid = document.querySelector(".skin-grid");
    this.skinSectionTitle = document.querySelector("#skin-section-title");
    this.missionCompletePanel = document.querySelector("#mission-complete-panel");
    this.missionCompleteCopy = document.querySelector("#mission-complete-copy");
    this.missionTime = document.querySelector("#mission-time");
    this.missionMoves = document.querySelector("#mission-moves");
    this.missionBestTime = document.querySelector("#mission-best-time");
    this.missionBestMoves = document.querySelector("#mission-best-moves");
    this.buttons = [...document.querySelectorAll("button")];
    this.styleButtons = [];
    this.sizeButtons = [...document.querySelectorAll("[data-size]")];
    this.sizeMeta = [...document.querySelectorAll("[data-size-meta]")];
    this.layerButtons = [...document.querySelectorAll("[data-layer-step]")];
    this.sliceButtons = [...document.querySelectorAll(".slice-moves button")];
    this.megaminxFaceButtons = [...document.querySelectorAll("[data-megaminx-face]")];
    this.megaminxFaceIndicator = document.querySelector("#megaminx-face-indicator");
    this.controlPanel = document.querySelector("#control-panel");
    this.panelToggle = document.querySelector("[data-action='panel-toggle']");
    this.drawerTabs = [...document.querySelectorAll("[data-drawer-tab]")];
    this.drawerPanels = [...document.querySelectorAll("[data-drawer-panel]")];
    this.settingsInputs = [...document.querySelectorAll("[data-setting]")];
    this.isControlPanelOpen = !this.controlPanel?.classList.contains("is-collapsed");
    this.pendingSizeConfirm = null;
    this.currentPuzzleType = "cube";
    this.currentMode = "free";
    this.currentSize = 3;
    this.currentLayerIndex = 1;
    this.selectedMegaminxFace = "F1";
    this.errorTimer = null;

    this.renderPuzzleCards();
    this.renderSkinButtons("cube");
    this.renderModeCards();
    this.bindEvents();
    this.setHintActionsEnabled(false);
    window.addEventListener("keydown", this.onKeyDown);
  }

  dispose() {
    window.removeEventListener("keydown", this.onKeyDown);
  }

  bindEvents() {
    document.querySelectorAll("[data-move]").forEach((button) => {
      button.addEventListener("click", () => this.fireMove(button.dataset.move, "button", button));
    });

    this.skinGrid?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-style]");
      if (button) {
        this.callbacks.style(button.dataset.style);
      }
    });

    this.sizeButtons.forEach((button) => {
      button.addEventListener("click", () => this.callbacks.size(Number(button.dataset.size)));
    });

    this.layerButtons.forEach((button) => {
      button.addEventListener("click", () => this.callbacks.layerStep(Number(button.dataset.layerStep)));
    });

    this.megaminxFaceButtons.forEach((button) => {
      button.addEventListener("click", () => this.setMegaminxSelectedFace(button.dataset.megaminxFace));
    });

    document.querySelector("[data-action='megaminx-cw']")?.addEventListener("click", () => this.fireMove(this.selectedMegaminxFace, "button"));
    document.querySelector("[data-action='megaminx-ccw']")?.addEventListener("click", () => this.fireMove(`${this.selectedMegaminxFace}'`, "button"));
    document.querySelector("[data-action='megaminx-double']")?.addEventListener("click", () => this.fireMove(`${this.selectedMegaminxFace}2`, "button"));

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
    document.querySelector("[data-action='hint-preview']")?.addEventListener("click", () => this.callbacks.hintPreview());
    document.querySelector("[data-action='hint-apply']")?.addEventListener("click", () => this.callbacks.hintApply());
    document.querySelector("[data-action='hint-cancel']")?.addEventListener("click", () => this.callbacks.hintCancel());
    document.querySelector("[data-action='replay-start']")?.addEventListener("click", () => this.callbacks.replayStart());
    document.querySelector("[data-action='replay-play']")?.addEventListener("click", () => this.callbacks.replayPlay());
    document.querySelector("[data-action='replay-prev']")?.addEventListener("click", () => this.callbacks.replayStep(-1));
    document.querySelector("[data-action='replay-next']")?.addEventListener("click", () => this.callbacks.replayStep(1));
    document.querySelector("[data-action='replay-restart']")?.addEventListener("click", () => this.callbacks.replayRestart());
    document.querySelector("[data-action='replay-exit']")?.addEventListener("click", () => this.callbacks.replayExit());
    document.querySelectorAll("[data-action='copy-share']").forEach((button) => {
      button.addEventListener("click", () => this.callbacks.copyShare());
    });
    document.querySelector("[data-action='start-game']")?.addEventListener("click", () => this.dismissLaunchOverlay());
    document.querySelectorAll("[data-launch-panel]").forEach((button) => {
      button.addEventListener("click", () => this.dismissLaunchOverlay(button.dataset.launchPanel));
    });
    this.statsFilterList?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-stats-filter]");
      if (button) {
        this.callbacks.statsFilter(button.dataset.statsFilter);
      }
    });
    document.querySelector("[data-action='replay-last']")?.addEventListener("click", () => {
      this.hideVictory();
      this.callbacks.replayStart();
      this.setActiveDrawerPanel("replay");
      this.setControlPanelOpen(true);
    });
    document.querySelector("[data-action='mistake-undo']")?.addEventListener("click", () => this.callbacks.mistakeUndo());
    document.querySelector("[data-action='mistake-continue']")?.addEventListener("click", () => this.callbacks.mistakeContinue());
    this.replaySpeed?.addEventListener("change", () => this.callbacks.replaySpeed(Number(this.replaySpeed.value)));
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

  renderPuzzleCards() {
    if (!this.puzzleTypeGrid) return;
    this.puzzleTypeGrid.replaceChildren(...PUZZLE_TYPES.map((type) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mode-card puzzle-type-card";
      button.dataset.puzzleType = type.id;
      button.innerHTML = `<strong>${type.title}</strong><span>${type.badge}</span><small>${type.description}<br>${type.compatibility}</small>`;
      button.addEventListener("click", () => this.callbacks.puzzleType(type.id));
      return button;
    }));
  }

  renderSkinButtons(puzzleType = this.currentPuzzleType) {
    if (!this.skinGrid) return;
    const options = getSkinOptions(puzzleType);
    this.skinGrid.replaceChildren(...options.map(([id, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.style = id;
      button.textContent = label;
      return button;
    }));
    this.styleButtons = [...this.skinGrid.querySelectorAll("[data-style]")];
    this.buttons = [...document.querySelectorAll("button")];
  }

  renderMissions({ size, puzzleType = this.currentPuzzleType, progress = {}, activeMissionId = null } = {}) {
    if (!this.missionList) return;
    const missions = MISSIONS.filter((mission) => (
      (mission.puzzleType || "cube") === puzzleType &&
      (puzzleType !== "cube" || mission.size === size)
    ));
    if (!missions.length) {
      const label = puzzleType === "megaminx" ? "Megaminx" : puzzleType === "mirrorCube" ? "Mirror Cube" : puzzleType === "skewb" ? "Skewb" : "Pyraminx";
      this.missionList.textContent = puzzleType !== "cube"
        ? `${label} missions are starting simple in this phase.`
        : "No missions for this cube yet.";
      return;
    }
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
    if (this.currentPuzzleType !== "cube") {
      this.patternList.textContent = "Pattern Mode is currently available for Cube puzzles.";
      return;
    }
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
    const allowedKeys = this.currentPuzzleType === "pyraminx" || this.currentPuzzleType === "skewb"
      ? new Set(["U", "L", "R", "B"])
      : this.currentPuzzleType === "mirrorCube" || this.currentPuzzleType === "megaminx"
        ? new Set(["U", "D", "L", "R", "F", "B"])
        : new Set(["U", "D", "L", "R", "F", "B", "M", "E", "S"]);
    if (!allowedKeys.has(key)) {
      if (event.key === "Escape") {
        if (!this.mistakeToast?.hidden) {
          this.callbacks.mistakeContinue();
        } else if (!this.sizeConfirmPanel.hidden) {
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
    const notation = this.currentPuzzleType === "pyraminx"
      ? `${event.altKey ? key.toLowerCase() : key}${event.shiftKey ? "'" : ""}`
      : this.currentPuzzleType === "skewb"
        ? `${key}${event.shiftKey ? "'" : ""}`
        : this.currentPuzzleType === "megaminx"
          ? `${key}${event.altKey ? "2" : ""}${event.shiftKey ? "'" : ""}`
        : event.altKey ? `${key}2` : event.shiftKey ? `${key}'` : key;
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
        button.dataset.action === "start-game" ||
        button.dataset.drawerTab
      ) {
        return;
      }
      button.disabled = isBusy;
    });

    if (!isBusy && this.currentSize && this.currentPuzzleType === "cube") {
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

  dismissLaunchOverlay(panelId = "") {
    if (panelId) {
      this.setActiveDrawerPanel(panelId);
      this.setControlPanelOpen(true);
    }
    this.launchOverlay?.classList.add("is-dismissed");
    window.setTimeout(() => {
      if (this.launchOverlay) this.launchOverlay.hidden = true;
    }, 280);
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

  setPuzzleType(puzzleType = "cube") {
    const type = getPuzzleType(puzzleType);
    this.currentPuzzleType = type.id;
    document.querySelector("#app")?.setAttribute("data-puzzle-type", type.id);
    this.gameTitle.textContent = "Twisty Puzzle 3D";
    this.currentSizeBadge.textContent = type.id === "cube" ? this.currentSizeBadge.textContent : type.title;
    this.skinSectionTitle.textContent = type.id === "pyraminx"
      ? "Pyraminx Skins"
      : type.id === "skewb"
        ? "Skewb Skins"
        : type.id === "mirrorCube"
          ? "Mirror Cube Skins"
          : type.id === "megaminx"
            ? "Megaminx Skins"
            : "Cube Skins";
    this.keyboardHelp.textContent = type.id === "pyraminx"
      ? "Press U, L, R, or B. Shift gives inverse. Alt turns the matching tip."
      : type.id === "skewb"
        ? "Press R, L, U, or B. Shift gives inverse."
        : type.id === "mirrorCube"
          ? "Press U, D, L, R, F, or B. Shift gives inverse. Alt gives a double turn."
          : type.id === "megaminx"
            ? "Press U, R, D, L, F, or B for quick Megaminx faces. Shift gives inverse. Use the face selector for all 12 faces."
            : "Press U, D, L, R, F, B, M, E, or S. Shift gives inverse. Alt gives a double turn.";
    document.querySelectorAll(".cube-only").forEach((element) => {
      element.hidden = type.id !== "cube";
    });
    document.querySelectorAll(".pyraminx-only").forEach((element) => {
      element.hidden = type.id !== "pyraminx";
    });
    document.querySelectorAll(".skewb-only").forEach((element) => {
      element.hidden = type.id !== "skewb";
    });
    document.querySelectorAll(".mirror-only").forEach((element) => {
      element.hidden = type.id !== "mirrorCube";
    });
    document.querySelectorAll(".megaminx-only").forEach((element) => {
      element.hidden = type.id !== "megaminx";
    });
    document.querySelectorAll("#puzzle-type-grid [data-puzzle-type]").forEach((button) => {
      const isActive = button.dataset.puzzleType === type.id;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    this.renderSkinButtons(type.id);
    this.setMegaminxSelectedFace(this.selectedMegaminxFace);
    this.updateHelpContent();
  }

  setCubeStyle(styleName) {
    this.currentSkinBadge.textContent = SKIN_LABELS[styleName] || styleName;
    this.styleButtons.forEach((button) => {
      const isActive = button.dataset.style === styleName;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  setPuzzleLabel(label) {
    this.currentSizeBadge.textContent = label;
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
    if (this.currentPuzzleType !== "cube") {
      this.layerIndicator.textContent = this.currentPuzzleType === "mirrorCube"
        ? "Mirror shape"
        : this.currentPuzzleType === "skewb"
          ? "Skewb corners"
          : this.currentPuzzleType === "megaminx"
            ? `Megaminx ${this.selectedMegaminxFace}`
            : "Pyraminx tips";
      this.layerButtons.forEach((button) => {
        button.disabled = true;
      });
      this.sliceButtons.forEach((button) => {
        button.disabled = true;
      });
      return;
    }

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

  setMegaminxSelectedFace(faceId = "F1") {
    const safeFace = MEGAMINX_FACE_IDS.includes(faceId) ? faceId : "F1";
    this.selectedMegaminxFace = safeFace;
    this.megaminxFaceButtons.forEach((button) => {
      const isActive = button.dataset.megaminxFace === safeFace;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    if (this.megaminxFaceIndicator) {
      this.megaminxFaceIndicator.textContent = `${safeFace} · ${MEGAMINX_FACE_LABELS[safeFace] || "Face"}`;
    }
    if (this.currentPuzzleType === "megaminx") {
      this.layerIndicator.textContent = `Megaminx ${safeFace}`;
    }
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
    const moveLine = hint.algorithm ? `<br><em>${hint.algorithm}</em>` : "";
    const support = hint.supportLevel ? `<span class="hint-meta">${hint.supportLevel} · ${hint.confidence || "medium"} confidence</span>` : "";
    this.hintOutput.innerHTML = `<strong>${hint.levelLabel}: ${hint.title}</strong><br>${hint.explanation || hint.text}${moveLine}${support}`;
    this.setHintActionsEnabled(Boolean(hint.moves?.length || hint.suggestedMoves?.length));
  }

  setHintActionsEnabled(hasAction) {
    document.querySelectorAll("[data-action='hint-preview'], [data-action='hint-apply'], [data-action='hint-cancel']").forEach((button) => {
      button.disabled = !hasAction && button.dataset.action !== "hint-cancel";
    });
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
    document.querySelector("#app")?.classList.toggle("hide-move-buttons", settings.showMoveButtons === false);
    document.querySelector("#app")?.classList.toggle("hide-notation-panel", settings.showNotationPanel === false);
  }

  setStatsPanel({ stats, totalStats, mode, skin, statsView = {}, activeFilter = "all", filters = [], challengeSummary = {} }) {
    if (!this.statsPanel) return;
    if (this.statsFilterList && filters.length) {
      this.statsFilterList.replaceChildren(...filters.map((filter) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.statsFilter = filter.id;
        button.className = activeFilter === filter.id ? "is-active" : "";
        button.textContent = filter.label;
        return button;
      }));
      this.buttons = [...document.querySelectorAll("button")];
    }
    const puzzleLabel = stats.puzzleType === "pyraminx"
      ? "Pyraminx"
      : stats.puzzleType === "skewb"
        ? "Skewb"
        : stats.puzzleType === "mirrorCube"
          ? "Mirror Cube"
          : stats.puzzleType === "megaminx"
            ? "Megaminx"
            : `${stats.size}x${stats.size}`;
    const scoped = stats.scopedStats || {};
    const view = statsView || scoped;
    const averageTime = view.averageTimeMs || (view.solves ? view.totalTimeMs / view.solves : 0);
    const averageMoves = view.averageMoves || (view.solves ? view.totalSolveMoves / view.solves : 0);
    const metric = (key, fallback = 0) => {
      const value = Number(view[key]);
      return Number.isFinite(value) ? value : fallback;
    };
    this.statsPanel.innerHTML = `
      <span>Puzzle <strong>${puzzleLabel}</strong></span>
      <span>Filter <strong>${activeFilter}</strong></span>
      <span>Attempts <strong>${metric("attempts")}</strong></span>
      <span>Total solves <strong>${metric("solves")}</strong></span>
      <span>Total moves <strong>${metric("totalMoves")}</strong></span>
      <span>Missions completed <strong>${totalStats.totalMissionsCompleted || 0}</strong></span>
      <span>Average time <strong>${formatTime(averageTime)}</strong></span>
      <span>Average moves <strong>${averageMoves ? averageMoves.toFixed(1) : "--"}</strong></span>
      <span>Hints used <strong>${metric("hintsUsed", scoped.hintsUsed || 0)}</strong></span>
      <span>Undos used <strong>${metric("undosUsed", scoped.undosUsed || 0)}</strong></span>
      <span>Daily streak <strong>${challengeSummary.dailyStreak || scoped.dailyStreak || 0}</strong></span>
      <span>Weekly completions <strong>${challengeSummary.weeklyCompletions || totalStats.weeklyCompletions || 0}</strong></span>
      <span>Last played <strong>${totalStats.lastPlayedPuzzle || "--"}</strong></span>
      <span>Favorite <strong>${totalStats.favoritePuzzleByAttempts || "--"}</strong></span>
      <span>Best time <strong>${formatTime(stats.bestTimeMs)}</strong></span>
      <span>Best moves <strong>${stats.bestMoves || "--"}</strong></span>
      <span>Mode <strong>${getMode(mode).title}</strong></span>
      <span>Skin <strong>${SKIN_LABELS[skin] || skin}</strong></span>
    `;
  }

  renderDailyChallenges(challenges = [], progress = {}, activeDailyId = null) {
    if (!this.dailyList) return;
    this.renderChallengeCards(this.dailyList, challenges, progress, activeDailyId, "dailyStart", "date");
  }

  renderWeeklyChallenges(challenges = [], progress = {}, activeWeeklyId = null) {
    if (!this.weeklyList) return;
    this.renderChallengeCards(this.weeklyList, challenges, progress, activeWeeklyId, "weeklyStart", "week");
  }

  renderChallengeCards(container, challenges = [], progress = {}, activeId = null, callbackName = "dailyStart", periodField = "date") {
    container.replaceChildren(...challenges.map((challenge) => {
      const period = challenge[periodField];
      const record = progress[challenge.id]?.[period] || {};
      const button = document.createElement("button");
      button.type = "button";
      button.className = `daily-card challenge-card${challenge.id === activeId ? " is-active" : ""}${record.completed ? " is-complete" : ""}`;
      button.dataset.challengeId = challenge.id;
      const periodLabel = periodField === "week" ? (challenge.period || period) : period;
      const actionLabel = record.attempts ? "Retry" : "Start";
      button.innerHTML = `
        <strong>${challenge.title}</strong>
        <span>${periodLabel} · ${challenge.difficulty || "Challenge"}</span>
        <small>${challenge.description}</small>
        <small>${record.completed ? "Completed" : "Not completed"} · Attempts ${record.attempts || 0}</small>
        <small>Best ${formatTime(record.bestTimeMs)} / ${record.bestMoves || "--"} moves</small>
        <code>${(challenge.scramble || []).join(" ")}</code>
        <b>${actionLabel}</b>
      `;
      button.addEventListener("click", () => this.callbacks[callbackName]?.(challenge.id));
      return button;
    }));
    this.buttons = [...document.querySelectorAll("button")];
  }

  setDailyStatus(text) {
    if (this.dailyStatus) {
      this.dailyStatus.textContent = text || "Finish a daily challenge or solve to copy a result.";
    }
  }

  setReplayStatus(status = {}) {
    if (!this.replaySummary) return;
    if (!status.active) {
      this.replaySummary.textContent = "Complete a solve to replay it here.";
      return;
    }
    this.replaySummary.textContent = `${status.isPlaying ? "Playing" : "Replay"} ${status.puzzleLabel || "Puzzle"} · Move ${status.index}/${status.total} · Current ${status.currentMove || "Start"} · Next ${status.nextMove || "Done"} · ${formatTime(status.timeMarkerMs)} · ${status.speed || 1}x`;
    buttonText(document.querySelector("[data-action='replay-play']"), status.isPlaying ? "Pause" : "Play");
  }

  setSolutionPath(sections = []) {
    if (!this.solutionPath) return;
    if (!sections.length) {
      this.solutionPath.textContent = "Known-path recovery appears after a solve.";
      return;
    }

    this.solutionPath.replaceChildren(...sections.map((section) => {
      const wrapper = document.createElement("div");
      wrapper.className = "solution-section";
      const moves = (section.moves || []).map((move) => `<span class="move-badge">${move}</span>`).join("");
      wrapper.innerHTML = `<strong>${section.title}</strong><small>${section.description || ""}</small><div>${moves || "No moves needed."}</div>`;
      return wrapper;
    }));
  }

  showMistakeWarning(warning) {
    if (!this.mistakeToast || !warning) return;
    this.mistakeTitle.textContent = warning.title || "Careful";
    this.mistakeCopy.textContent = warning.message || "That move may have disturbed a solved guide step.";
    this.mistakeToast.hidden = false;
  }

  hideMistakeWarning() {
    if (this.mistakeToast) {
      this.mistakeToast.hidden = true;
    }
  }

  showSizeConfirmation(size, onConfirm, customCopy = "") {
    const preset = Number.isFinite(Number(size)) ? getCubeSizePreset(size) : null;
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
    this.updateHelpContent();
    this.helpPanel.hidden = false;
  }

  hideHelp() {
    this.helpPanel.hidden = true;
  }

  showVictory({ elapsedMs, moveCount, bestTimeMs, bestMoves, size, puzzleType = "cube", puzzleLabel = "", tps = 0, grade = "--" }) {
    const preset = puzzleType === "cube" ? getCubeSizePreset(size) : null;
    this.victorySize.textContent = puzzleType === "cube" ? `${preset.size}x${preset.size} ${preset.name}` : puzzleLabel || (puzzleType === "megaminx" ? "Megaminx" : puzzleType === "mirrorCube" ? "Mirror Cube" : puzzleType === "skewb" ? "Skewb" : "Pyraminx");
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
    const buttons = [...document.querySelectorAll(`[data-action='${type}']`)];
    const originals = buttons.map((button) => button.textContent);
    buttons.forEach((button) => buttonText(button, "Copied"));
    window.setTimeout(() => {
      buttons.forEach((button, index) => buttonText(button, originals[index]));
    }, 900);
    this.showErrorToast("Copied to clipboard.", "Copied");
  }

  showErrorToast(message, title = "Heads up") {
    if (!this.errorToast) return;
    this.errorTitle.textContent = title;
    this.errorCopy.textContent = message;
    this.errorToast.hidden = false;
    window.clearTimeout(this.errorTimer);
    this.errorTimer = window.setTimeout(() => {
      this.errorToast.hidden = true;
    }, 2400);
  }

  updateHelpContent() {
    if (this.currentPuzzleType === "pyraminx") {
      this.helpTitle.textContent = "How to Play Pyraminx";
      this.helpCopy.textContent = "Solve the pyramid by returning each triangular face to one solid color.";
      this.helpList.innerHTML = `
        <li>Drag directly on a triangular facelet to twist that Pyraminx section.</li>
        <li>Drag empty space around the puzzle to orbit the camera.</li>
        <li>On touch screens, use one finger on facelets to twist and two fingers to zoom or orbit.</li>
        <li>Main moves are U, L, R, and B around the four pyramid vertices.</li>
        <li>Tip moves are lowercase u, l, r, and b. Hold Alt with a keyboard move for a tip turn.</li>
        <li>Hold Shift for inverse moves.</li>
        <li>Scramble uses legal Pyraminx moves, Reset returns to solved, and Undo reverses your latest move.</li>
      `;
      return;
    }

    if (this.currentPuzzleType === "skewb") {
      this.helpTitle.textContent = "How to Play Skewb";
      this.helpCopy.textContent = "Solve the corner-turning cube by returning every face to one solid color.";
      this.helpList.innerHTML = `
        <li>Drag directly on a Skewb piece to twist the matching corner layer.</li>
        <li>Drag empty space around the puzzle to orbit the camera.</li>
        <li>On touch screens, use one finger on pieces to twist and two fingers to zoom or orbit.</li>
        <li>Main moves are R, L, U, and B around four cube corners.</li>
        <li>Hold Shift for inverse moves.</li>
        <li>Scramble uses legal Skewb turns, Reset returns to solved, and Undo reverses your latest move.</li>
      `;
      return;
    }

    if (this.currentPuzzleType === "mirrorCube") {
      this.helpTitle.textContent = "How to Play Mirror Cube";
      this.helpCopy.textContent = "Restore the clean cube silhouette. Mirror Cube solves by shape, not sticker color.";
      this.helpList.innerHTML = `
        <li>Drag directly on a Mirror Cube block to twist that face layer.</li>
        <li>Drag empty space around the puzzle to orbit the camera.</li>
        <li>On touch screens, use one finger on blocks to twist and two fingers to zoom or orbit.</li>
        <li>Moves use 3x3 notation: U up, D down, L left, R right, F front, B back.</li>
        <li>Hold Shift for inverse moves. Hold Alt for double turns.</li>
        <li>The solved state is the clean cube shape; scrambled states become uneven and shape-shifted.</li>
        <li>Scramble uses legal Mirror Cube moves, Reset returns to solved, and Undo reverses your latest move.</li>
      `;
      return;
    }

    if (this.currentPuzzleType === "megaminx") {
      this.helpTitle.textContent = "How to Play Megaminx";
      this.helpCopy.textContent = "Solve the 12-face dodecahedron by returning every pentagonal face to one solid color.";
      this.helpList.innerHTML = `
        <li>Drag directly on a Megaminx facelet to twist that face by 72 degrees.</li>
        <li>Drag empty space around the puzzle to orbit the camera.</li>
        <li>Use the face selector for all 12 faces, then turn clockwise, counterclockwise, or two-step.</li>
        <li>Quick keyboard moves are U, R, D, L, F, and B. Hold Shift for inverse turns.</li>
        <li>Move notation uses clear face labels like F1 and F7 instead of claiming full WCA Megaminx notation.</li>
        <li>Begin by solving one star face, then work outward in layers. Advanced guide support is coming later.</li>
        <li>Scramble uses legal 72-degree face turns, Reset returns to solved, and Undo reverses your latest move.</li>
      `;
      return;
    }

    this.helpTitle.textContent = "How to Play";
    this.helpCopy.textContent = "Solve the cube by returning every face to one solid color.";
    this.helpList.innerHTML = `
      <li>Drag directly on a visible sticker to twist that layer.</li>
      <li>Drag empty space around the cube to orbit the camera.</li>
      <li>On touch screens, use one finger on stickers to twist and two fingers to zoom or orbit.</li>
      <li>Moves use standard notation: U up, D down, L left, R right, F front, B back.</li>
      <li>Middle-slice moves are M middle, E equator, and S standing.</li>
      <li>Keyboard moves use U, D, L, R, F, B, M, E, and S. Hold Shift for inverse moves.</li>
      <li>Scramble uses legal moves, Reset returns to solved, and Undo reverses your latest move.</li>
    `;
  }
}
