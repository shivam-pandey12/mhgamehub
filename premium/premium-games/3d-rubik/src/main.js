import "./styles.css";
import { MoveAudio } from "./audio.js";
import {
  SUPPORTED_CUBE_SIZES,
  clampCubeSize,
  clampInnerLayerIndex,
  getCubeSizePreset,
  getDefaultInnerLayerIndex
} from "./cubeState.js";
import {
  createDailyChallenge,
  createWeeklyChallenge,
  getDailyChallengeList,
  getWeeklyChallengeList,
  recordDailyAttempt,
  recordWeeklyAttempt,
  updateDailyRecord,
  updateWeeklyRecord
} from "./dailyChallengeManager.js";
import { getDefaultMode, getMode } from "./gameModes.js";
import { captureGuideSnapshot, detectGuideMistake } from "./guideMistakeDetector.js";
import { getGuideStatus } from "./guideManager.js";
import { getHint } from "./hintManager.js";
import { checkMissionSuccess, getMission, getMissionsForPuzzle, MISSIONS } from "./missionManager.js";
import { getPattern } from "./patternManager.js";
import { getPuzzleAdapter, getPuzzleType, normalizeSkinForPuzzle } from "./puzzleAdapters.js";
import {
  buildReplayState,
  createReplaySession,
  getReplayStatus
} from "./replayManager.js";
import {
  buildDailyShareText,
  buildSolveShareText,
  buildWeeklyShareText
} from "./shareResultManager.js";
import { createSolutionSections } from "./solverManager.js";
import {
  getChallengeProgressStats,
  getScopedStats,
  getStatsFilterOptions,
  getStatsForFilter,
  recordAttempt,
  recordHint,
  recordMove,
  recordSolve,
  recordUndo,
  recordWeeklyCompletion,
  setDailyStreak
} from "./statsManager.js";
import { InputController } from "./inputController.js";
import { MoveExecutor } from "./moveExecutor.js";
import {
  loadBestScores,
  loadDailyProgress,
  loadMissionProgress,
  loadSelectedMode,
  loadSelectedPuzzleType,
  loadSelectedSize,
  loadSelectedSkin,
  loadSettings,
  loadSolveSessions,
  loadStatsFilter,
  loadTotalStats,
  loadWeeklyProgress,
  saveBestScores,
  saveDailyProgress,
  saveLastScramble,
  saveMissionProgress,
  saveSelectedMode,
  saveSelectedPuzzleType,
  saveSelectedSize,
  saveSelectedSkin,
  saveSettings,
  saveSolveSessions,
  saveStatsFilter,
  saveTotalStats,
  saveWeeklyProgress
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
    this.currentPuzzleType = loadSelectedPuzzleType();
    this.adapter = getPuzzleAdapter(this.currentPuzzleType);
    this.currentSize = loadSelectedSize();
    this.currentMode = loadSelectedMode() || getDefaultMode();
    this.selectedSkin = normalizeSkinForPuzzle(this.currentPuzzleType, loadSelectedSkin(this.currentPuzzleType));
    this.settings = loadSettings();
    this.selectedLayerIndex = getDefaultInnerLayerIndex(this.currentSize);
    this.cubeState = this.adapter.createState({ size: this.currentSize });
    this.bestScores = loadBestScores(this.getStatsId(), this.currentPuzzleType);
    this.totalStats = loadTotalStats();
    this.missionProgress = loadMissionProgress();
    this.dailyProgress = loadDailyProgress();
    this.weeklyProgress = loadWeeklyProgress();
    this.statsFilter = loadStatsFilter();
    this.solveSessions = loadSolveSessions();
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
    this.currentHint = null;
    this.lastSolveSession = this.solveSessions.at(-1) || null;
    this.activeDailyChallenge = null;
    this.activeWeeklyChallenge = null;
    this.shareResultText = "";
    this.replaySession = null;
    this.replaySnapshot = null;
    this.replayIndex = 0;
    this.replaySpeed = 1;
    this.replayTimer = null;
    this.isReplayMode = false;

    this.audio = new MoveAudio(this.settings);
    this.renderer = this.adapter.createRenderer(this.stage, this.cubeState);
    this.renderer.updateRenderSettings(this.settings);
    if (!this.renderer.setVisualPreset(this.selectedSkin)) {
      this.selectedSkin = normalizeSkinForPuzzle(this.currentPuzzleType, this.adapter.defaultSkin);
      this.renderer.setVisualPreset(this.selectedSkin);
      saveSelectedSkin(this.selectedSkin, this.currentPuzzleType);
    }
    this.bindRendererEvents();
    this.executor = new MoveExecutor(this.cubeState, this.renderer, {
      onMoveStart: (move, options) => {
        this.ui?.setBusy(true);
        this.ui?.setMoveStatus(`${options.system ? "Applying" : "Twisting"} ${move.notation}`);
      },
      onMoveComplete: (move, options) => this.afterMove(move, options),
      onMoveEnd: () => {
        this.ui?.setBusy(false);
      },
      onInvalidMove: () => this.audio.invalid()
    }, this.adapter);

    this.ui = new UIController({
      move: (notation, source) => this.requestUserMove(notation, source),
      scramble: () => this.scramble(),
      undo: () => this.undo(),
      redo: () => this.redo(),
      reset: () => this.resetCube(),
      resetCamera: () => this.renderer.resetCamera(),
      cameraPreset: (preset) => this.renderer.setCameraPreset(preset),
      style: (styleName) => this.setSkin(styleName),
      puzzleType: (typeId) => this.requestPuzzleType(typeId),
      size: (size) => this.requestCubeSize(size),
      layerStep: (step) => this.stepSelectedLayer(step),
      mode: (modeId) => this.setMode(modeId),
      timedStart: () => this.startTimedChallenge(),
      guideStep: (step) => this.stepGuide(step),
      guideCheck: () => this.checkGuideStep(),
      hint: (level) => this.requestHint(level),
      hintPreview: () => this.previewCurrentHint(),
      hintApply: () => this.applyCurrentHint(),
      hintCancel: () => this.cancelCurrentHint(),
      mission: (missionId) => this.startMission(missionId),
      nextMission: () => this.startNextMission(),
      pattern: (patternId) => this.applyPattern(patternId),
      settings: (partial) => this.updateSettings(partial),
      copyScramble: () => this.copyScramble(),
      copyHistory: () => this.copyHistory(),
      clearHistory: () => this.clearHistory(),
      replayStart: () => this.startReplay(),
      replayPlay: () => this.toggleReplayPlayback(),
      replayStep: (step) => this.stepReplay(step),
      replayRestart: () => this.restartReplay(),
      replayExit: () => this.exitReplay(),
      replaySpeed: (speed) => this.setReplaySpeed(speed),
      dailyStart: (puzzleId) => this.startDailyChallenge(puzzleId),
      weeklyStart: (challengeId) => this.startWeeklyChallenge(challengeId),
      statsFilter: (filterId) => this.setStatsFilter(filterId),
      copyShare: () => this.copyShareResult(),
      mistakeUndo: () => this.handleMistakeUndo(),
      mistakeContinue: () => this.handleMistakeContinue(),
      fullscreen: () => this.toggleFullscreen()
    });

    this.input = new InputController({
      renderer: this.renderer,
      cubeState: this.cubeState,
      isBusy: () => this.executor.isMoving || this.isSystemSequence,
      onMove: (notation, source) => this.requestUserMove(notation, source),
      settings: this.settings
    });

    this.refreshUi();
    this.ui.setMoveStatus("Ready");
  }

  bindRendererEvents() {
    const canvas = this.renderer?.domElement;
    if (!canvas) return;
    canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      this.ui?.showErrorToast("WebGL paused. If the puzzle disappears, refresh the page to restore the 3D scene.", "WebGL context lost");
    }, { once: true });
    canvas.addEventListener("webglcontextrestored", () => {
      this.ui?.showErrorToast("The 3D context was restored.", "WebGL restored");
      this.renderer?.syncFromState?.();
    }, { once: true });
  }

  getStatsId() {
    return this.adapter.getStatsId(this.cubeState);
  }

  getStatsScope() {
    return {
      puzzleType: this.currentPuzzleType,
      size: this.currentPuzzleType === "cube" ? this.currentSize : this.currentPuzzleType
    };
  }

  getPuzzleLabel() {
    if (this.currentPuzzleType === "pyraminx") {
      return "Pyraminx";
    }

    if (this.currentPuzzleType === "skewb") {
      return "Skewb";
    }

    if (this.currentPuzzleType === "mirrorCube") {
      return "Mirror Cube";
    }

    if (this.currentPuzzleType === "megaminx") {
      return "Megaminx";
    }

    const preset = getCubeSizePreset(this.currentSize);
    return `${preset.size}x${preset.size} ${preset.name}`;
  }

  getStats() {
    return {
      elapsedMs: this.getElapsedMs(),
      moveCount: this.moveCount,
      bestTimeMs: this.bestScores.bestTimeMs,
      bestMoves: this.bestScores.bestMoves,
      size: this.currentSize,
      puzzleType: this.currentPuzzleType,
      puzzleLabel: this.getPuzzleLabel(),
      mode: this.currentMode,
      scopedStats: getScopedStats(this.totalStats, this.getStatsScope())
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
      this.refreshStatsPanel();
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
    if (this.isReplayMode) {
      this.ui.setMoveStatus("Exit replay to continue solving");
      this.audio.invalid();
      return false;
    }

    if (this.executor.isMoving || this.isSystemSequence) {
      this.audio.invalid();
      return false;
    }

    const isMoveObject = notation && typeof notation === "object";
    const face = isMoveObject
      ? String(notation.face || notation.notation || "")[0]?.toUpperCase()
      : String(notation || "")[0]?.toUpperCase();
    const usesSelectedSliceLayer = !isMoveObject && ["M", "E", "S"].includes(face);

    const allowedNonCubeMoves = this.currentPuzzleType === "mirrorCube" || this.currentPuzzleType === "megaminx"
      ? ["U", "D", "L", "R", "F", "B"]
      : ["U", "L", "R", "B"];
    if (this.currentPuzzleType !== "cube" && !allowedNonCubeMoves.includes(face)) {
      this.ui.setMoveStatus(`Use ${allowedNonCubeMoves.join(", ")} for ${this.getPuzzleLabel()}`);
      this.audio.invalid();
      return false;
    }

    if (this.currentPuzzleType === "cube" && usesSelectedSliceLayer && this.currentSize < 3) {
      this.ui.setMoveStatus("2x2 has no middle slice");
      this.audio.invalid();
      return false;
    }

    this.startTimerIfNeeded();
    const guideBefore = this.currentMode === "guide" && !["undo", "redo", "hint"].includes(source)
      ? captureGuideSnapshot(this.cubeState, this.activeGuideIndex)
      : null;
    const completed = await this.executor.execute(notation, {
      source,
      trackHistory: true,
      countMove: true,
      duration: this.getMoveDuration(),
      layerIndex: usesSelectedSliceLayer ? this.selectedLayerIndex : undefined,
      guideBefore
    });

    return completed;
  }

  afterMove(move, options) {
    if (options.trackHistory) {
      this.moveHistory.push({
        move: cloneMoveForHistory(move),
        source: options.source || "move",
        atMs: this.getElapsedMs()
      });
      this.redoStack = [];
    }

    if (options.countMove) {
      this.moveCount += 1;
      this.totalStats = recordMove(this.totalStats, this.getStatsScope(), 1);
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

    if (!options.system && options.guideBefore) {
      const warning = detectGuideMistake(options.guideBefore, this.cubeState, this.activeGuideIndex);
      if (warning) {
        this.ui.showMistakeWarning(warning);
        this.renderer.setGuideHighlights(warning.targets);
      }
    }

    if (!options.system && this.moveCount > 0 && this.adapter.isSolved(this.cubeState)) {
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
    const completedAt = new Date().toISOString();
    this.totalStats = recordSolve(this.totalStats, this.getStatsScope(), {
      elapsedMs,
      moveCount: this.moveCount,
      completedAt
    });
    saveBestScores(this.getStatsId(), this.bestScores, this.currentPuzzleType);

    this.lastSolveSession = createReplaySession({
      puzzleType: this.currentPuzzleType,
      size: this.currentPuzzleType === "cube" ? this.currentSize : this.currentPuzzleType,
      mode: this.currentMode,
      scramble: this.currentScramble,
      moves: this.moveHistory,
      elapsedMs,
      moveCount: this.moveCount,
      completedAt
    });
    this.solveSessions = [...this.solveSessions, this.lastSolveSession].slice(-12);
    saveSolveSessions(this.solveSessions);

    if (this.activeDailyChallenge) {
      this.dailyProgress = updateDailyRecord(this.dailyProgress, this.activeDailyChallenge, {
        elapsedMs,
        moveCount: this.moveCount
      });
      const streak = this.dailyProgress[this.activeDailyChallenge.id]?.streak || 0;
      this.totalStats = setDailyStreak(this.totalStats, this.getStatsScope(), streak);
      saveDailyProgress(this.dailyProgress);
      this.shareResultText = buildDailyShareText({
        challenge: this.activeDailyChallenge,
        elapsedMs,
        moveCount: this.moveCount,
        streak
      });
    } else if (this.activeWeeklyChallenge) {
      const previous = this.weeklyProgress[this.activeWeeklyChallenge.id]?.[this.activeWeeklyChallenge.week] || {};
      const wasCompleted = Boolean(previous.completed);
      this.weeklyProgress = updateWeeklyRecord(this.weeklyProgress, this.activeWeeklyChallenge, {
        elapsedMs,
        moveCount: this.moveCount
      });
      if (!wasCompleted) {
        this.totalStats = recordWeeklyCompletion(this.totalStats, this.getStatsScope());
      }
      saveWeeklyProgress(this.weeklyProgress);
      this.shareResultText = buildWeeklyShareText({
        challenge: this.activeWeeklyChallenge,
        elapsedMs,
        moveCount: this.moveCount
      });
    } else {
      this.shareResultText = buildSolveShareText({
        puzzleLabel: this.getPuzzleLabel(),
        elapsedMs,
        moveCount: this.moveCount,
        mode: getMode(this.currentMode).title
      });
    }

    saveTotalStats(this.totalStats);

    const tps = this.moveCount / Math.max(1, elapsedMs / 1000);
    const grade = this.currentMode === "timed" ? gradeSolve({ elapsedMs, moveCount: this.moveCount, size: this.currentPuzzleType === "cube" ? this.currentSize : 2 }) : "--";
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
    if (this.isReplayMode) {
      this.ui.setMoveStatus("Exit replay before scrambling");
      return;
    }

    if (this.executor.isMoving || this.isSystemSequence) {
      return;
    }

    this.ui.hideVictory();
    if (!timed) {
      this.activeMission = null;
    }
    this.activeDailyChallenge = null;
    this.activeWeeklyChallenge = null;
    this.resetForNewPosition();
    this.currentScramble = this.adapter.generateScramble(this.cubeState, this.settings);
    this.ui.setScrambleStatus(this.currentScramble.join(" "));
    saveLastScramble(this.currentPuzzleType, this.currentScramble);
    this.totalStats = recordAttempt(this.totalStats, this.getStatsScope());
    saveTotalStats(this.totalStats);
    await this.executeSystemSequence(this.currentScramble, {
      duration: timed ? 58 : 86,
      label: `Scrambling ${this.getPuzzleLabel()}`
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
    if (this.isReplayMode) {
      this.ui.setMoveStatus("Exit replay before undoing");
      return;
    }

    if (this.executor.isMoving || this.isSystemSequence || this.moveHistory.length === 0) {
      this.audio.invalid();
      return;
    }

    const entry = this.moveHistory.pop();
    const completed = await this.executor.execute(this.adapter.inverseMove(entry.move, this.cubeState), {
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
    this.totalStats = recordUndo(this.totalStats, this.getStatsScope());
    saveTotalStats(this.totalStats);
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
    this.adapter.resetState(this.cubeState, { size: this.currentSize });
    if (rebuild) {
      this.renderer.rebuildCubies?.();
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
    if (this.isReplayMode) {
      this.exitReplay();
      return;
    }

    if (this.executor.isMoving || this.isSystemSequence) {
      return;
    }

    this.ui.hideVictory();
    this.resetForNewPosition();
    this.currentScramble = [];
    this.activeMission = null;
    this.activeDailyChallenge = null;
    this.activeWeeklyChallenge = null;
    this.ui.setScrambleStatus("No scramble yet");
    this.ui.setMoveStatus("Reset to solved");
    this.refreshUi();
  }

  hasProgress() {
    return (
      this.moveCount > 0 ||
      this.moveHistory.length > 0 ||
      this.getElapsedMs() > 0 ||
      !this.adapter.isSolved(this.cubeState)
    );
  }

  requestCubeSize(size) {
    if (this.isReplayMode) {
      this.ui.setMoveStatus("Exit replay before changing size");
      return;
    }

    if (this.currentPuzzleType !== "cube") {
      return;
    }

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

  requestPuzzleType(typeId) {
    if (this.isReplayMode) {
      this.ui.setMoveStatus("Exit replay before changing puzzle");
      return;
    }

    const nextType = getPuzzleType(typeId).id;
    if (nextType === this.currentPuzzleType || this.executor.isMoving || this.isSystemSequence) {
      return;
    }

    if (this.hasProgress()) {
      this.ui.showSizeConfirmation(nextType, () => this.switchPuzzleType(nextType), `Switching to ${getPuzzleType(nextType).title} will reset the active puzzle, timer, move history, scramble, and mission state.`);
      return;
    }

    this.switchPuzzleType(nextType);
  }

  switchPuzzleType(typeId) {
    this.ui.hideVictory();
    this.stopTimer();
    this.input?.dispose();
    this.renderer?.dispose();

    this.currentPuzzleType = getPuzzleType(typeId).id;
    this.adapter = getPuzzleAdapter(this.currentPuzzleType);
    saveSelectedPuzzleType(this.currentPuzzleType);

    this.selectedSkin = normalizeSkinForPuzzle(this.currentPuzzleType, loadSelectedSkin(this.currentPuzzleType));
    this.cubeState = this.adapter.createState({ size: this.currentSize });
    this.bestScores = loadBestScores(this.getStatsId(), this.currentPuzzleType);
    this.renderer = this.adapter.createRenderer(this.stage, this.cubeState);
    this.renderer.updateRenderSettings(this.settings);
    if (!this.renderer.setVisualPreset(this.selectedSkin)) {
      this.selectedSkin = this.adapter.defaultSkin;
      this.renderer.setVisualPreset(this.selectedSkin);
    }
    this.bindRendererEvents();
    saveSelectedSkin(this.selectedSkin, this.currentPuzzleType);
    this.executor.setPuzzle(this.cubeState, this.renderer, this.adapter);
    this.input = new InputController({
      renderer: this.renderer,
      cubeState: this.cubeState,
      isBusy: () => this.executor.isMoving || this.isSystemSequence,
      onMove: (notation, source) => this.requestUserMove(notation, source),
      settings: this.settings
    });

    this.currentScramble = [];
    this.activeGuideIndex = 0;
    this.activeMission = null;
    this.activeDailyChallenge = null;
    this.activeWeeklyChallenge = null;
    this.moveHistory = [];
    this.redoStack = [];
    this.moveCount = 0;
    this.appliedPatternId = null;
    this.resetTimer();
    this.ui.setScrambleStatus("No scramble yet");
    this.ui.setMoveStatus(`${this.getPuzzleLabel()} ready`);
    this.refreshUi();
  }

  switchCubeSize(size) {
    this.ui.hideVictory();
    this.currentSize = clampCubeSize(size);
    this.selectedLayerIndex = getDefaultInnerLayerIndex(this.currentSize);
    this.bestScores = loadBestScores(this.currentSize, "cube");
    saveSelectedSize(this.currentSize);
    this.currentScramble = [];
    this.activeGuideIndex = 0;
    this.activeMission = null;
    this.activeDailyChallenge = null;
    this.activeWeeklyChallenge = null;
    this.resetForNewPosition({ rebuild: true });

    const preset = getCubeSizePreset(this.currentSize);
    this.ui.setMoveStatus(`${this.currentSize}x${this.currentSize} ${preset.name}`);
    this.refreshUi();
  }

  setMode(modeId) {
    if (this.isReplayMode) {
      this.ui.setMoveStatus("Exit replay before changing mode");
      return;
    }

    const nextMode = getMode(modeId).id;
    if (nextMode === this.currentMode) {
      return;
    }

    const switchMode = () => {
      this.currentMode = nextMode;
      saveSelectedMode(this.currentMode);
      this.activeMission = null;
      this.activeDailyChallenge = null;
      this.activeWeeklyChallenge = null;
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
    if (this.isReplayMode) {
      this.ui.setMoveStatus("Exit replay before starting a mission");
      return;
    }

    const mission = getMission(missionId);
    if (!mission || this.executor.isMoving || this.isSystemSequence) return;

    const begin = async () => {
      const missionPuzzleType = mission.puzzleType || "cube";
      if (missionPuzzleType !== this.currentPuzzleType) {
        this.switchPuzzleType(missionPuzzleType);
      }

      if (this.currentPuzzleType === "cube" && mission.size !== this.currentSize) {
        this.currentSize = clampCubeSize(mission.size);
        this.selectedLayerIndex = getDefaultInnerLayerIndex(this.currentSize);
        this.bestScores = loadBestScores(this.currentSize, "cube");
        saveSelectedSize(this.currentSize);
      }

      this.currentMode = "missions";
      saveSelectedMode(this.currentMode);
      this.activeMission = mission;
      this.activeDailyChallenge = null;
      this.activeWeeklyChallenge = null;
      this.currentScramble = mission.condition === "pattern" ? [] : mission.scramble || this.adapter.generateScramble(this.cubeState, this.settings);
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
      this.ui.showSizeConfirmation(mission.size || mission.puzzleType, begin, `Starting ${mission.title} will reset the current puzzle and load its mission setup.`);
      return;
    }

    await begin();
  }

  startNextMission() {
    this.ui.hideMissionComplete();
    const currentIndex = MISSIONS.findIndex((mission) => mission.id === this.activeMission?.id);
    const nextMission = MISSIONS.slice(currentIndex + 1).find((mission) => (
      (mission.puzzleType || "cube") === this.currentPuzzleType &&
      (this.currentPuzzleType !== "cube" || mission.size === this.currentSize)
    )) || getMissionsForPuzzle(this.currentPuzzleType, this.currentSize)[0];
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
    this.currentHint = hint;
    this.totalStats = recordHint(this.totalStats, this.getStatsScope());
    saveTotalStats(this.totalStats);
    this.ui.showHint(hint);
    if (level === "visual" || level === "move" || level === "auto") {
      this.renderer.setGuideHighlights(hint.targets);
    }

    if (level === "auto" && hint.moves?.length) {
      const confirmed = window.confirm(`Apply hint moves: ${hint.moves.join(" ")}?`);
      if (!confirmed) return;
      await this.applyCurrentHint();
    }
  }

  previewCurrentHint() {
    const move = this.currentHint?.moves?.[0] || this.currentHint?.suggestedMoves?.[0];
    if (!move || this.executor.isMoving || this.isSystemSequence) {
      this.audio.invalid();
      return;
    }
    this.renderer.startGhostPreview?.(move);
    this.renderer.setGuideHighlights(this.currentHint.targets);
    this.ui.setMoveStatus(`Previewing ${move}`);
  }

  cancelCurrentHint() {
    this.renderer.clearGhostPreview?.();
    this.currentHint = null;
    this.ui.setHintActionsEnabled(false);
    this.ui.setMoveStatus("Hint canceled");
    this.updateGuidance();
  }

  async applyCurrentHint() {
    const moves = this.currentHint?.moves?.length
      ? this.currentHint.moves
      : this.currentHint?.suggestedMoves || [];
    if (!moves.length || this.executor.isMoving || this.isSystemSequence) {
      this.audio.invalid();
      return;
    }

    this.renderer.clearGhostPreview?.();
    for (const notation of moves) {
      const completed = await this.requestUserMove(notation, "hint");
      if (!completed) break;
    }
  }

  async applyPattern(patternId) {
    if (this.isReplayMode) {
      this.ui.setMoveStatus("Exit replay before applying a pattern");
      return;
    }

    if (this.currentPuzzleType !== "cube") {
      this.ui.setMoveStatus("Pattern Mode is currently for Cube puzzles");
      this.audio.invalid();
      return;
    }

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
      saveSelectedSkin(this.selectedSkin, this.currentPuzzleType);
      this.ui.setMoveStatus(`${this.selectedSkin} skin`);
      this.refreshUi();
    }
  }

  updateSettings(partial) {
    this.settings = { ...this.settings, ...partial };
    saveSettings(this.settings);
    this.audio.updateSettings(this.settings);
    this.renderer.updateRenderSettings(this.settings);
    this.input?.updateSettings(this.settings);
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
      this.ui.showErrorToast("Clipboard permission was blocked. You can still copy the text manually from the Share panel.", "Copy failed");
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

  stopReplayTimer() {
    if (this.replayTimer) {
      window.clearInterval(this.replayTimer);
      this.replayTimer = null;
    }
  }

  startReplay(session = this.lastSolveSession || this.solveSessions.at(-1)) {
    if (!session || this.executor.isMoving || this.isSystemSequence) {
      this.audio.invalid();
      return;
    }

    this.stopTimer();
    this.stopReplayTimer();
    this.replaySnapshot = {
      puzzleType: this.currentPuzzleType,
      size: this.currentSize,
      state: this.adapter.cloneState(this.cubeState),
      moveHistory: [...this.moveHistory],
      redoStack: [...this.redoStack],
      moveCount: this.moveCount,
      elapsedMs: this.elapsedMs,
      currentScramble: [...this.currentScramble],
      mode: this.currentMode,
      selectedSkin: this.selectedSkin,
      activeDailyChallenge: this.activeDailyChallenge,
      activeWeeklyChallenge: this.activeWeeklyChallenge
    };
    this.replaySession = session;
    this.isReplayMode = true;
    this.replayIndex = 0;
    this.seekReplay(0);
    this.ui.setMoveStatus("Replay loaded");
  }

  ensureReplayPuzzle(session) {
    const type = getPuzzleType(session.puzzleType).id;
    if (type !== this.currentPuzzleType) {
      this.input?.dispose();
      this.renderer?.dispose();
      this.currentPuzzleType = type;
      this.adapter = getPuzzleAdapter(type);
      this.cubeState = this.adapter.createState({ size: session.size });
      this.renderer = this.adapter.createRenderer(this.stage, this.cubeState);
      this.renderer.updateRenderSettings(this.settings);
      this.selectedSkin = normalizeSkinForPuzzle(type, loadSelectedSkin(type));
      this.renderer.setVisualPreset(this.selectedSkin);
      this.bindRendererEvents();
      this.executor.setPuzzle(this.cubeState, this.renderer, this.adapter);
      this.input = new InputController({
        renderer: this.renderer,
        cubeState: this.cubeState,
        isBusy: () => this.executor.isMoving || this.isSystemSequence || this.isReplayMode,
        onMove: (notation, source) => this.requestUserMove(notation, source),
        settings: this.settings
      });
    }

    if (type === "cube" && session.size !== this.currentSize) {
      this.currentSize = clampCubeSize(session.size);
    }
  }

  seekReplay(index) {
    if (!this.replaySession) return;
    this.ensureReplayPuzzle(this.replaySession);
    const total = this.replaySession.moves.length;
    this.replayIndex = Math.min(Math.max(index, 0), total);
    let replayState;
    try {
      replayState = buildReplayState(this.adapter, this.replaySession, this.replayIndex);
    } catch (error) {
      this.stopReplayTimer();
      this.ui.showErrorToast("Replay contains a move this puzzle version cannot apply. The active solve was left untouched.", "Replay stopped");
      this.exitReplay();
      return;
    }
    const needsRebuild = this.currentPuzzleType === "cube" && this.cubeState.size !== replayState.size;
    this.adapter.restoreState(this.cubeState, replayState);
    if (this.currentPuzzleType === "cube" && this.cubeState.size !== this.currentSize) {
      this.currentSize = this.cubeState.size;
    }
    if (needsRebuild) {
      this.renderer.rebuildCubies?.();
    }
    this.renderer.syncFromState();
    this.ui.setReplayStatus(getReplayStatus(this.replaySession, this.replayIndex, Boolean(this.replayTimer), this.replaySpeed));
    this.ui.setSolutionPath(createSolutionSections(this.adapter, this.cubeState, this.replaySession.scramble, this.replaySession.moves));
  }

  stepReplay(step = 1) {
    if (!this.replaySession) {
      this.startReplay();
      return;
    }
    this.seekReplay(this.replayIndex + step);
  }

  toggleReplayPlayback() {
    if (!this.replaySession) {
      this.startReplay();
      return;
    }

    if (this.replayTimer) {
      this.stopReplayTimer();
      this.ui.setReplayStatus(getReplayStatus(this.replaySession, this.replayIndex, false, this.replaySpeed));
      return;
    }

    const interval = Math.max(130, 620 / Math.max(0.5, this.replaySpeed));
    this.replayTimer = window.setInterval(() => {
      if (!this.replaySession || this.replayIndex >= this.replaySession.moves.length) {
        this.stopReplayTimer();
        this.ui.setReplayStatus(getReplayStatus(this.replaySession, this.replayIndex, false, this.replaySpeed));
        return;
      }
      this.seekReplay(this.replayIndex + 1);
    }, interval);
    this.ui.setReplayStatus(getReplayStatus(this.replaySession, this.replayIndex, true, this.replaySpeed));
  }

  restartReplay() {
    if (!this.replaySession) {
      this.startReplay();
      return;
    }
    this.stopReplayTimer();
    this.seekReplay(0);
  }

  exitReplay() {
    this.stopReplayTimer();
    if (!this.replaySnapshot) {
      this.isReplayMode = false;
      this.replaySession = null;
      this.ui.setReplayStatus();
      return;
    }

    const snapshot = this.replaySnapshot;
    if (snapshot.puzzleType !== this.currentPuzzleType) {
      this.input?.dispose();
      this.renderer?.dispose();
      this.currentPuzzleType = snapshot.puzzleType;
      this.adapter = getPuzzleAdapter(snapshot.puzzleType);
      this.cubeState = this.adapter.createState({ size: snapshot.size });
      this.renderer = this.adapter.createRenderer(this.stage, this.cubeState);
      this.renderer.updateRenderSettings(this.settings);
      this.selectedSkin = normalizeSkinForPuzzle(this.currentPuzzleType, snapshot.selectedSkin || loadSelectedSkin(this.currentPuzzleType));
      this.renderer.setVisualPreset(this.selectedSkin);
      this.bindRendererEvents();
      this.executor.setPuzzle(this.cubeState, this.renderer, this.adapter);
      this.input = new InputController({
        renderer: this.renderer,
        cubeState: this.cubeState,
        isBusy: () => this.executor.isMoving || this.isSystemSequence,
        onMove: (notation, source) => this.requestUserMove(notation, source),
        settings: this.settings
      });
    }

    const needsRebuild = this.currentPuzzleType === "cube" && this.cubeState.size !== snapshot.state.size;
    this.adapter.restoreState(this.cubeState, snapshot.state);
    if (snapshot.puzzleType === "cube") {
      this.currentSize = clampCubeSize(snapshot.size);
    }
    this.moveHistory = snapshot.moveHistory;
    this.redoStack = snapshot.redoStack;
    this.moveCount = snapshot.moveCount;
    this.elapsedMs = snapshot.elapsedMs;
    this.currentScramble = snapshot.currentScramble;
    this.currentMode = snapshot.mode;
    this.selectedSkin = normalizeSkinForPuzzle(this.currentPuzzleType, snapshot.selectedSkin || this.selectedSkin);
    this.activeDailyChallenge = snapshot.activeDailyChallenge;
    this.activeWeeklyChallenge = snapshot.activeWeeklyChallenge;
    if (needsRebuild) {
      this.renderer.rebuildCubies?.();
    }
    this.renderer.syncFromState();
    this.isReplayMode = false;
    this.replaySession = null;
    this.replaySnapshot = null;
    this.ui.setReplayStatus();
    this.refreshUi();
    this.ui.setMoveStatus("Replay closed");
  }

  setReplaySpeed(speed) {
    this.replaySpeed = [0.5, 1, 2, 4].includes(speed) ? speed : 1;
    if (this.replayTimer) {
      this.stopReplayTimer();
      this.toggleReplayPlayback();
    } else {
      this.ui.setReplayStatus(getReplayStatus(this.replaySession || {}, this.replayIndex, false, this.replaySpeed));
    }
  }

  async startDailyChallenge(puzzleId) {
    if (this.isReplayMode) {
      this.ui.setMoveStatus("Exit replay before starting daily challenge");
      return;
    }

    if (this.executor.isMoving || this.isSystemSequence) return;
    const challenge = createDailyChallenge(puzzleId);
    const begin = async () => {
      if (challenge.puzzleType !== this.currentPuzzleType) {
        this.switchPuzzleType(challenge.puzzleType);
      }
      if (challenge.puzzleType === "cube" && challenge.size !== this.currentSize) {
        this.switchCubeSize(challenge.size);
      }
      this.activeDailyChallenge = challenge;
      this.activeWeeklyChallenge = null;
      this.currentMode = "timed";
      saveSelectedMode(this.currentMode);
      this.resetForNewPosition({ rebuild: challenge.puzzleType === "cube" });
      this.currentScramble = [...challenge.scramble];
      this.ui.setScrambleStatus(this.currentScramble.join(" "));
      saveLastScramble(this.currentPuzzleType, this.currentScramble);
      this.dailyProgress = recordDailyAttempt(this.dailyProgress, challenge);
      this.totalStats = recordAttempt(this.totalStats, this.getStatsScope());
      saveDailyProgress(this.dailyProgress);
      saveTotalStats(this.totalStats);
      await this.executeSystemSequence(this.currentScramble, {
        duration: 58,
        label: `Loading ${challenge.title}`
      });
      this.moveHistory = [];
      this.redoStack = [];
      this.moveCount = 0;
      this.resetTimer();
      this.ui.setMoveStatus(`${challenge.title} ready`);
      this.refreshUi();
    };

    if (this.hasProgress()) {
      this.ui.showSizeConfirmation(challenge.size, begin, `Starting ${challenge.title} will reset the active puzzle and load today's seeded scramble.`);
      return;
    }

    await begin();
  }

  async startWeeklyChallenge(challengeId) {
    if (this.isReplayMode) {
      this.ui.setMoveStatus("Exit replay before starting weekly challenge");
      return;
    }

    if (this.executor.isMoving || this.isSystemSequence) return;
    const challenge = createWeeklyChallenge(challengeId);
    const begin = async () => {
      if (challenge.puzzleType !== this.currentPuzzleType) {
        this.switchPuzzleType(challenge.puzzleType);
      }
      if (challenge.puzzleType === "cube" && challenge.size !== this.currentSize) {
        this.switchCubeSize(challenge.size);
      }
      this.activeWeeklyChallenge = challenge;
      this.activeDailyChallenge = null;
      this.currentMode = "timed";
      saveSelectedMode(this.currentMode);
      this.resetForNewPosition({ rebuild: challenge.puzzleType === "cube" });
      this.currentScramble = [...challenge.scramble];
      this.ui.setScrambleStatus(this.currentScramble.join(" "));
      saveLastScramble(this.currentPuzzleType, this.currentScramble);
      this.weeklyProgress = recordWeeklyAttempt(this.weeklyProgress, challenge);
      this.totalStats = recordAttempt(this.totalStats, this.getStatsScope());
      saveWeeklyProgress(this.weeklyProgress);
      saveTotalStats(this.totalStats);
      await this.executeSystemSequence(this.currentScramble, {
        duration: 58,
        label: `Loading ${challenge.title}`
      });
      this.moveHistory = [];
      this.redoStack = [];
      this.moveCount = 0;
      this.resetTimer();
      this.ui.setMoveStatus(`${challenge.title} ready`);
      this.refreshUi();
    };

    if (this.hasProgress()) {
      this.ui.showSizeConfirmation(challenge.size, begin, `Starting ${challenge.title} will reset the active puzzle and load this week's seeded scramble.`);
      return;
    }

    await begin();
  }

  setStatsFilter(filterId = "all") {
    this.statsFilter = filterId;
    saveStatsFilter(filterId);
    this.refreshStatsPanel();
  }

  copyShareResult() {
    const text = this.shareResultText || buildSolveShareText({
      puzzleLabel: this.getPuzzleLabel(),
      elapsedMs: this.getElapsedMs(),
      moveCount: this.moveCount,
      mode: getMode(this.currentMode).title
    });
    this.copyText(text, "copy-share");
  }

  async handleMistakeUndo() {
    this.ui.hideMistakeWarning();
    await this.undo();
  }

  handleMistakeContinue() {
    this.ui.hideMistakeWarning();
    this.updateGuidance();
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

  getChallengeSummary() {
    const dailyStreak = Object.values(this.dailyProgress || {})
      .reduce((best, record) => Math.max(best, Number(record?.streak || 0)), 0);
    const weeklyCompletions = Object.values(this.weeklyProgress || {})
      .reduce((total, record) => total + Object.values(record || {})
        .filter((entry) => entry && typeof entry === "object" && entry.completed)
        .length, 0);
    return { dailyStreak, weeklyCompletions };
  }

  refreshStatsPanel() {
    const challengeSummary = this.getChallengeSummary();
    const statsView = this.statsFilter === "daily"
      ? getChallengeProgressStats(this.dailyProgress, "daily")
      : this.statsFilter === "weekly"
        ? getChallengeProgressStats(this.weeklyProgress, "weekly")
        : getStatsForFilter(this.totalStats, this.statsFilter);
    this.ui.setStatsPanel({
      stats: this.getStats(),
      totalStats: this.totalStats,
      mode: this.currentMode,
      skin: this.selectedSkin,
      statsView,
      activeFilter: this.statsFilter,
      filters: getStatsFilterOptions(),
      challengeSummary
    });
  }

  refreshUi() {
    this.ui.updateStats(this.getStats());
    this.ui.setPuzzleType(this.currentPuzzleType);
    this.ui.setPuzzleLabel(this.getPuzzleLabel());
    this.ui.setMode(this.currentMode);
    if (this.currentPuzzleType === "cube") {
      this.ui.setCubeSize(this.currentSize, this.getBestBySize());
    }
    this.ui.setLayerControls(this.currentSize, this.selectedLayerIndex);
    this.ui.setCubeStyle(this.selectedSkin);
    this.ui.setSettings(this.settings);
    this.ui.renderHistory(this.moveHistory);
    this.ui.renderMissions({ size: this.currentSize, puzzleType: this.currentPuzzleType, progress: this.missionProgress, activeMissionId: this.activeMission?.id });
    this.ui.renderPatterns(this.currentSize);
    this.ui.renderDailyChallenges(getDailyChallengeList(), this.dailyProgress, this.activeDailyChallenge?.id);
    this.ui.renderWeeklyChallenges(getWeeklyChallengeList(), this.weeklyProgress, this.activeWeeklyChallenge?.id);
    this.ui.setDailyStatus(this.shareResultText || "Finish a daily challenge or solve to copy a result.");
    this.ui.setReplayStatus(this.replaySession ? getReplayStatus(this.replaySession, this.replayIndex, Boolean(this.replayTimer), this.replaySpeed) : {});
    const solutionAdapter = this.lastSolveSession ? getPuzzleAdapter(this.lastSolveSession.puzzleType) : this.adapter;
    const solutionState = this.lastSolveSession
      ? solutionAdapter.createSolvedState({ size: this.lastSolveSession.size })
      : this.cubeState;
    this.ui.setSolutionPath(this.lastSolveSession
      ? createSolutionSections(solutionAdapter, solutionState, this.lastSolveSession.scramble, this.lastSolveSession.moves)
      : []);
    this.refreshStatsPanel();
    this.updateGuidance();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.rubikGame = new RubikGame();
});
