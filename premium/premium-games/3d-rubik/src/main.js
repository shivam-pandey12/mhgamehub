import "./styles.css";
import { MoveAudio } from "./audio.js";
import {
  SUPPORTED_CUBE_SIZES,
  clampCubeSize,
  clampInnerLayerIndex,
  createSolvedCube,
  generateScramble,
  getCubeSizePreset,
  getDefaultInnerLayerIndex,
  inverseMove,
  isSolved,
  resetCubeState
} from "./cubeState.js";
import { CubeRenderer } from "./cubeRenderer.js";
import { getDefaultMode, getMode } from "./gameModes.js";
import { getGuideStatus } from "./guideManager.js";
import { getHint } from "./hintManager.js";
import { checkMissionSuccess, getMission, getMissionsForSize, MISSIONS } from "./missionManager.js";
import { getPattern, getAvailablePatterns } from "./patternManager.js";
import { InputController } from "./inputController.js";
import { MoveExecutor } from "./moveExecutor.js";
import {
  loadBestScores,
  loadMissionProgress,
  loadSelectedMode,
  loadSelectedSize,
  loadSelectedSkin,
  loadSettings,
  loadTotalStats,
  saveBestScores,
  saveMissionProgress,
  saveSelectedMode,
  saveSelectedSize,
  saveSelectedSkin,
  saveSettings,
  saveTotalStats
} from "./storage.js";
import { UIController } from "./uiController.js";

const SPEED_DURATIONS = {
  slow: 380,
  normal: 260,
  fast: 150
};

function gradeSolve({ elapsedMs, moveCount, size }) {
  const seconds = Math.max(1, elapsedMs / 1000);
  const adjusted = seconds / Math.max(1, size - 1) + moveCount * 0.18;
  if (adjusted < 35) return "S";
  if (adjusted < 60) return "A";
  if (adjusted < 95) return "B";
  if (adjusted < 140) return "C";
  return "Practice";
}

function cloneMoveForHistory(move) {
  return {
    ...move,
    notation: move.notation,
    display: move.display || move.notation
  };
}

class RubikGame {
  constructor() {
    this.stage = document.querySelector("#game-stage");
    this.currentSize = loadSelectedSize();
    this.currentMode = loadSelectedMode() || getDefaultMode();
    this.selectedSkin = loadSelectedSkin();
    this.settings = loadSettings();
    this.selectedLayerIndex = getDefaultInnerLayerIndex(this.currentSize);
    this.cubeState = createSolvedCube(this.currentSize);
    this.bestScores = loadBestScores(this.currentSize);
    this.totalStats = loadTotalStats();
    this.missionProgress = loadMissionProgress();
    this.moveHistory = [];
    this.redoStack = [];
    this.moveCount = 0;
    this.elapsedMs = 0;
    this.timerStartedAt = 0;
    this.timerInterval = null;
    this.currentScramble = [];
    this.isSystemSequence = false;
    this.activeGuideIndex = 0;
    this.activeMission = null;
    this.appliedPatternId = null;

    this.audio = new MoveAudio(this.settings);
    this.renderer = new CubeRenderer(this.stage, this.cubeState);
    this.renderer.updateRenderSettings(this.settings);
    if (!this.renderer.setVisualPreset(this.selectedSkin)) {
      this.selectedSkin = this.renderer.getVisualPresetName();
      saveSelectedSkin(this.selectedSkin);
    }
    this.executor = new MoveExecutor(this.cubeState, this.renderer, {
      onMoveStart: (move, options) => {
        this.ui?.setBusy(true);
        this.ui?.setMoveStatus(`${options.system ? "Applying" : "Twisting"} ${move.notation}`);
      },
      onMoveComplete: (move, options) => this.afterMove(move, options),
      onMoveEnd: () => {
        this.ui?.setBusy(false);
      }
    });

    this.ui = new UIController({
      move: (notation, source) => this.requestUserMove(notation, source),
      scramble: () => this.scramble(),
      undo: () => this.undo(),
      redo: () => this.redo(),
      reset: () => this.resetCube(),
      resetCamera: () => this.renderer.resetCamera(),
      cameraPreset: (preset) => this.renderer.setCameraPreset(preset),
      style: (styleName) => this.setSkin(styleName),
      size: (size) => this.requestCubeSize(size),
      layerStep: (step) => this.stepSelectedLayer(step),
      mode: (modeId) => this.setMode(modeId),
      timedStart: () => this.startTimedChallenge(),
      guideStep: (step) => this.stepGuide(step),
      guideCheck: () => this.checkGuideStep(),
      hint: (level) => this.requestHint(level),
      mission: (missionId) => this.startMission(missionId),
      nextMission: () => this.startNextMission(),
      pattern: (patternId) => this.applyPattern(patternId),
      settings: (partial) => this.updateSettings(partial),
      copyScramble: () => this.copyScramble(),
      copyHistory: () => this.copyHistory(),
      clearHistory: () => this.clearHistory(),
      fullscreen: () => this.toggleFullscreen()
    });

    this.input = new InputController({
      renderer: this.renderer,
      cubeState: this.cubeState,
      isBusy: () => this.executor.isMoving || this.isSystemSequence,
      onMove: (notation, source) => this.requestUserMove(notation, source)
    });

    this.refreshUi();
    this.ui.setMoveStatus("Ready");
  }

  getStats() {
    return {
      elapsedMs: this.getElapsedMs(),
      moveCount: this.moveCount,
      bestTimeMs: this.bestScores.bestTimeMs,
      bestMoves: this.bestScores.bestMoves,
      size: this.currentSize,
      mode: this.currentMode
    };
  }

  getElapsedMs() {
    if (!this.timerStartedAt) {
      return this.elapsedMs;
    }

    return performance.now() - this.timerStartedAt + this.elapsedMs;
  }

  getMoveDuration(base = SPEED_DURATIONS.normal) {
    const speed = this.settings.animationSpeed || "normal";
    const target = SPEED_DURATIONS[speed] || SPEED_DURATIONS.normal;
    return Math.max(50, Math.round(base * (target / SPEED_DURATIONS.normal)));
  }

  startTimerIfNeeded() {
    if (this.timerStartedAt || this.isSystemSequence) {
      return;
    }

    this.timerStartedAt = performance.now();
    this.timerInterval = window.setInterval(() => {
      this.ui.updateStats(this.getStats());
      this.ui.setStatsPanel({ stats: this.getStats(), totalStats: this.totalStats, mode: this.currentMode, skin: this.selectedSkin });
    }, 100);
  }

  stopTimer() {
    if (this.timerStartedAt) {
      this.elapsedMs = this.getElapsedMs();
      this.timerStartedAt = 0;
    }

    if (this.timerInterval) {
      window.clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  resetTimer() {
    this.stopTimer();
    this.elapsedMs = 0;
  }

  async requestUserMove(notation, source = "unknown") {
    if (this.executor.isMoving || this.isSystemSequence) {
      this.audio.invalid();
      return false;
    }

    const isMoveObject = notation && typeof notation === "object";
    const face = isMoveObject
      ? String(notation.face || notation.notation || "")[0]?.toUpperCase()
      : String(notation || "")[0]?.toUpperCase();
    const usesSelectedSliceLayer = !isMoveObject && ["M", "E", "S"].includes(face);

    if (usesSelectedSliceLayer && this.currentSize < 3) {
      this.ui.setMoveStatus("2x2 has no middle slice");
      this.audio.invalid();
      return false;
    }

    this.startTimerIfNeeded();
    const completed = await this.executor.execute(notation, {
      source,
      trackHistory: true,
      countMove: true,
      duration: this.getMoveDuration(),
      layerIndex: usesSelectedSliceLayer ? this.selectedLayerIndex : undefined
    });

    return completed;
  }

  afterMove(move, options) {
    if (options.trackHistory) {
      this.moveHistory.push({ move: cloneMoveForHistory(move), source: options.source || "move" });
      this.redoStack = [];
    }

    if (options.countMove) {
      this.moveCount += 1;
      this.totalStats.totalMoves = (this.totalStats.totalMoves || 0) + 1;
      saveTotalStats(this.totalStats);
    }

    if (!options.system) {
      this.audio.tick();
    }

    this.ui.setMoveStatus(`Last move ${move.display || move.notation}`);
    this.updateGuidance();
    this.refreshUi();

    if (!options.system) {
      this.checkActiveMission();
    }

    if (!options.system && this.moveCount > 0 && isSolved(this.cubeState)) {
      this.handleSolved();
    }
  }

  handleSolved() {
    this.stopTimer();
    const elapsedMs = this.getElapsedMs();
    const bestTimeMs = !this.bestScores.bestTimeMs || elapsedMs < this.bestScores.bestTimeMs
      ? elapsedMs
      : this.bestScores.bestTimeMs;
    const bestMoves = !this.bestScores.bestMoves || this.moveCount < this.bestScores.bestMoves
      ? this.moveCount
      : this.bestScores.bestMoves;

    this.bestScores = { bestTimeMs, bestMoves };
    this.totalStats.totalSolves = (this.totalStats.totalSolves || 0) + 1;
    this.totalStats.solvesBySize = this.totalStats.solvesBySize || {};
    this.totalStats.solvesBySize[this.currentSize] = (this.totalStats.solvesBySize[this.currentSize] || 0) + 1;
    saveBestScores(this.currentSize, this.bestScores);
    saveTotalStats(this.totalStats);

    const tps = this.moveCount / Math.max(1, elapsedMs / 1000);
    const grade = this.currentMode === "timed" ? gradeSolve({ elapsedMs, moveCount: this.moveCount, size: this.currentSize }) : "--";
    this.refreshUi();
    this.ui.showVictory({ ...this.getStats(), tps, grade });
    this.ui.setMoveStatus(this.currentMode === "timed" ? `Solved · Grade ${grade}` : "Solved");
    this.audio.success();
  }

  async executeSystemSequence(sequence, { duration = 86, label = "Applying" } = {}) {
    this.isSystemSequence = true;
    this.ui.setBusy(true);
    this.ui.setMoveStatus(label);

    for (const notation of sequence) {
      await this.executor.execute(notation, {
        system: true,
        trackHistory: false,
        countMove: false,
        duration: this.getMoveDuration(duration)
      });
    }

    this.isSystemSequence = false;
    this.ui.setBusy(false);
  }

  async scramble({ timed = false } = {}) {
    if (this.executor.isMoving || this.isSystemSequence) {
      return;
    }

    this.ui.hideVictory();
    if (!timed) {
      this.activeMission = null;
    }
    this.resetForNewPosition();
    this.currentScramble = generateScramble(this.currentSize);
    this.ui.setScrambleStatus(this.currentScramble.join(" "));
    await this.executeSystemSequence(this.currentScramble, {
      duration: timed ? 58 : 86,
      label: `Scrambling ${this.currentSize}x${this.currentSize}`
    });

    this.moveHistory = [];
    this.redoStack = [];
    this.moveCount = 0;
    this.resetTimer();
    this.renderer.syncFromState();
    this.ui.setMoveStatus(timed ? "Timed challenge ready" : "Scrambled");
    this.refreshUi();
  }

  async undo() {
    if (this.executor.isMoving || this.isSystemSequence || this.moveHistory.length === 0) {
      this.audio.invalid();
      return;
    }

    const entry = this.moveHistory.pop();
    const completed = await this.executor.execute(inverseMove(entry.move, this.currentSize), {
      source: "undo",
      trackHistory: false,
      countMove: false,
      duration: this.getMoveDuration(220)
    });

    if (!completed) {
      this.moveHistory.push(entry);
      return;
    }

    this.redoStack.push(entry);
    this.ui.setMoveStatus(`Undid ${entry.move.display || entry.move.notation}`);
    this.refreshUi();
  }

  async redo() {
    if (this.executor.isMoving || this.isSystemSequence || this.redoStack.length === 0) {
      this.audio.invalid();
      return;
    }

    const entry = this.redoStack.pop();
    await this.requestUserMove(entry.move, "redo");
  }

  resetForNewPosition({ rebuild = false } = {}) {
    resetCubeState(this.cubeState, this.currentSize);
    if (rebuild) {
      this.renderer.rebuildCubies();
    }
    this.renderer.syncFromState();
    this.moveHistory = [];
    this.redoStack = [];
    this.moveCount = 0;
    this.appliedPatternId = null;
    this.resetTimer();
    this.renderer.clearGuideHighlights();
  }

  resetCube() {
    if (this.executor.isMoving || this.isSystemSequence) {
      return;
    }

    this.ui.hideVictory();
    this.resetForNewPosition();
    this.currentScramble = [];
    this.activeMission = null;
    this.ui.setScrambleStatus("No scramble yet");
    this.ui.setMoveStatus("Reset to solved");
    this.refreshUi();
  }

  hasProgress() {
    return (
      this.moveCount > 0 ||
      this.moveHistory.length > 0 ||
      this.getElapsedMs() > 0 ||
      !isSolved(this.cubeState)
    );
  }

  requestCubeSize(size) {
    const nextSize = clampCubeSize(size);
    if (nextSize === this.currentSize || this.executor.isMoving || this.isSystemSequence) {
      return;
    }

    if (this.hasProgress()) {
      this.ui.showSizeConfirmation(nextSize, () => this.switchCubeSize(nextSize));
      return;
    }

    this.switchCubeSize(nextSize);
  }

  switchCubeSize(size) {
    this.ui.hideVictory();
    this.currentSize = clampCubeSize(size);
    this.selectedLayerIndex = getDefaultInnerLayerIndex(this.currentSize);
    this.bestScores = loadBestScores(this.currentSize);
    saveSelectedSize(this.currentSize);
    this.currentScramble = [];
    this.activeGuideIndex = 0;
    this.activeMission = null;
    this.resetForNewPosition({ rebuild: true });

    const preset = getCubeSizePreset(this.currentSize);
    this.ui.setMoveStatus(`${this.currentSize}x${this.currentSize} ${preset.name}`);
    this.refreshUi();
  }

  setMode(modeId) {
    const nextMode = getMode(modeId).id;
    if (nextMode === this.currentMode) {
      return;
    }

    const switchMode = () => {
      this.currentMode = nextMode;
      saveSelectedMode(this.currentMode);
      this.activeMission = null;
      this.activeGuideIndex = 0;
      if (this.currentMode !== "free") {
        this.resetForNewPosition();
      }
      if (this.currentMode === "timed") {
        this.startTimedChallenge();
      } else {
        this.ui.setMoveStatus(`${getMode(this.currentMode).title} mode`);
        this.refreshUi();
      }
    };

    if (this.currentMode !== "free" || (this.hasProgress() && nextMode !== "free")) {
      this.ui.showSizeConfirmation(this.currentSize, switchMode, "Switching mode will reset the active timer, move history, scramble, and mission state.");
      return;
    }

    switchMode();
  }

  async startTimedChallenge() {
    if (this.executor.isMoving || this.isSystemSequence) return;
    this.currentMode = "timed";
    saveSelectedMode(this.currentMode);
    await this.scramble({ timed: true });
    this.refreshUi();
  }

  async startMission(missionId) {
    const mission = getMission(missionId);
    if (!mission || this.executor.isMoving || this.isSystemSequence) return;

    const begin = async () => {
      if (mission.size !== this.currentSize) {
        this.currentSize = clampCubeSize(mission.size);
        this.selectedLayerIndex = getDefaultInnerLayerIndex(this.currentSize);
        this.bestScores = loadBestScores(this.currentSize);
        saveSelectedSize(this.currentSize);
      }

      this.currentMode = "missions";
      saveSelectedMode(this.currentMode);
      this.activeMission = mission;
      this.currentScramble = mission.condition === "pattern" ? [] : mission.scramble || generateScramble(this.currentSize);
      this.resetForNewPosition({ rebuild: true });
      this.ui.setScrambleStatus(this.currentScramble.length ? this.currentScramble.join(" ") : "Pattern mission starts solved");
      if (this.currentScramble.length) {
        await this.executeSystemSequence(this.currentScramble, {
          duration: 72,
          label: `Starting ${mission.title}`
        });
      }
      this.moveHistory = [];
      this.redoStack = [];
      this.moveCount = 0;
      this.resetTimer();
      this.ui.setMoveStatus(mission.objective);
      this.refreshUi();
    };

    if (this.hasProgress()) {
      this.ui.showSizeConfirmation(mission.size, begin, `Starting ${mission.title} will reset the current cube and load its mission setup.`);
      return;
    }

    await begin();
  }

  startNextMission() {
    this.ui.hideMissionComplete();
    const currentIndex = MISSIONS.findIndex((mission) => mission.id === this.activeMission?.id);
    const nextMission = MISSIONS.slice(currentIndex + 1).find((mission) => mission.size === this.currentSize) ||
      getMissionsForSize(this.currentSize)[0];
    if (nextMission) {
      this.startMission(nextMission.id);
    }
  }

  checkActiveMission() {
    if (!this.activeMission) return;
    const stats = this.getStats();
    const completed = checkMissionSuccess(this.activeMission, this.cubeState, stats, { appliedPatternId: this.appliedPatternId });
    if (!completed) return;

    const previous = this.missionProgress[this.activeMission.id] || {};
    const record = {
      completed: true,
      bestTimeMs: !previous.bestTimeMs || stats.elapsedMs < previous.bestTimeMs ? stats.elapsedMs : previous.bestTimeMs,
      bestMoves: !previous.bestMoves || stats.moveCount < previous.bestMoves ? stats.moveCount : previous.bestMoves
    };
    const wasNew = !previous.completed;
    this.missionProgress[this.activeMission.id] = record;
    if (wasNew) {
      this.totalStats.totalMissionsCompleted = (this.totalStats.totalMissionsCompleted || 0) + 1;
    }
    saveMissionProgress(this.missionProgress);
    saveTotalStats(this.totalStats);
    this.ui.showMissionComplete({ mission: this.activeMission, elapsedMs: stats.elapsedMs, moveCount: stats.moveCount, record });
    this.audio.success();
    this.refreshUi();
  }

  stepSelectedLayer(step) {
    if (this.currentSize < 3) {
      return;
    }

    this.selectedLayerIndex = clampInnerLayerIndex(this.currentSize, this.selectedLayerIndex + step);
    this.ui.setLayerControls(this.currentSize, this.selectedLayerIndex);
    this.ui.setMoveStatus(`Selected layer ${this.selectedLayerIndex + 1}`);
  }

  stepGuide(step) {
    const guide = getGuideStatus(this.cubeState, this.activeGuideIndex);
    this.activeGuideIndex = Math.min(Math.max(this.activeGuideIndex + step, 0), guide.stages.length - 1);
    this.currentMode = "guide";
    saveSelectedMode(this.currentMode);
    this.updateGuidance();
    this.refreshUi();
  }

  checkGuideStep() {
    const guide = getGuideStatus(this.cubeState, this.activeGuideIndex);
    if (guide.completed) {
      this.ui.setMoveStatus("Guide step complete");
      this.audio.success();
      if (this.activeGuideIndex < guide.stages.length - 1) {
        this.activeGuideIndex += 1;
      }
    } else if (guide.unsupported) {
      this.ui.setMoveStatus("Large cube guides are coming later");
      this.audio.invalid();
    } else {
      this.ui.setMoveStatus("Not solved for this step yet");
      this.audio.invalid();
    }
    this.updateGuidance();
  }

  async requestHint(level) {
    if (this.executor.isMoving || this.isSystemSequence) {
      this.audio.invalid();
      return;
    }

    const hint = getHint(this.cubeState, level, this.activeGuideIndex);
    this.ui.showHint(hint);
    if (level === "visual" || level === "move" || level === "auto") {
      this.renderer.setGuideHighlights(hint.targets);
    }

    if (level === "auto" && hint.moves?.length) {
      const confirmed = window.confirm(`Apply hint moves: ${hint.moves.join(" ")}?`);
      if (!confirmed) return;
      for (const notation of hint.moves) {
        await this.requestUserMove(notation, "hint");
      }
    }
  }

  async applyPattern(patternId) {
    const pattern = getPattern(patternId, this.currentSize);
    if (!pattern || this.executor.isMoving || this.isSystemSequence) return;
    this.currentMode = "patterns";
    saveSelectedMode(this.currentMode);
    this.appliedPatternId = pattern.id;
    for (const notation of pattern.sequence) {
      await this.requestUserMove(notation, "pattern");
    }
    this.ui.setMoveStatus(`${pattern.title} applied`);
    this.checkActiveMission();
    this.refreshUi();
  }

  setSkin(styleName) {
    if (this.executor.isMoving || this.isSystemSequence) {
      return;
    }

    const changed = this.renderer.setVisualPreset(styleName);
    if (changed) {
      this.selectedSkin = this.renderer.getVisualPresetName();
      saveSelectedSkin(this.selectedSkin);
      this.ui.setMoveStatus(`${this.selectedSkin} skin`);
      this.refreshUi();
    }
  }

  updateSettings(partial) {
    this.settings = { ...this.settings, ...partial };
    saveSettings(this.settings);
    this.audio.updateSettings(this.settings);
    this.renderer.updateRenderSettings(this.settings);
    this.refreshUi();
  }

  async copyText(text, feedbackAction) {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }
      await navigator.clipboard.writeText(text);
      this.ui.showCopyFeedback(feedbackAction);
    } catch (_) {
      this.ui.setMoveStatus("Clipboard unavailable");
    }
  }

  copyScramble() {
    this.copyText(this.currentScramble.join(" ") || "No scramble yet", "copy-scramble");
  }

  copyHistory() {
    this.copyText(this.moveHistory.map((entry) => entry.move.display || entry.move.notation).join(" "), "copy-history");
  }

  clearHistory() {
    this.moveHistory = [];
    this.redoStack = [];
    this.refreshUi();
    this.ui.setMoveStatus("Move history cleared");
  }

  toggleFullscreen() {
    const root = document.querySelector("#app");
    if (!document.fullscreenElement) {
      root?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  updateGuidance() {
    const guide = getGuideStatus(this.cubeState, this.activeGuideIndex);
    this.ui.setGuideStatus(guide);
    if (this.currentMode === "guide") {
      this.renderer.setGuideHighlights(guide.targets);
    } else {
      this.renderer.clearGuideHighlights();
    }
  }

  getBestBySize() {
    return Object.fromEntries(SUPPORTED_CUBE_SIZES.map((size) => [size, loadBestScores(size)]));
  }

  refreshUi() {
    this.ui.updateStats(this.getStats());
    this.ui.setMode(this.currentMode);
    this.ui.setCubeSize(this.currentSize, this.getBestBySize());
    this.ui.setLayerControls(this.currentSize, this.selectedLayerIndex);
    this.ui.setCubeStyle(this.selectedSkin);
    this.ui.setSettings(this.settings);
    this.ui.renderHistory(this.moveHistory);
    this.ui.renderMissions({ size: this.currentSize, progress: this.missionProgress, activeMissionId: this.activeMission?.id });
    this.ui.renderPatterns(this.currentSize);
    this.ui.setStatsPanel({ stats: this.getStats(), totalStats: this.totalStats, mode: this.currentMode, skin: this.selectedSkin });
    this.updateGuidance();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.rubikGame = new RubikGame();
});
