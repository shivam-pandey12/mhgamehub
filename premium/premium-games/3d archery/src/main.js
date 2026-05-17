import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const BOW_STRETCH_AUDIO_URL = new URL("../audio/bow strech .mp3", import.meta.url).href;
const ARROW_RELEASE_AUDIO_URL = new URL("../audio/arrow just out of the bow .mp3", import.meta.url).href;
const ARROW_FLIGHT_AUDIO_URL = new URL("../audio/arrow  journey till reaching target.mp3", import.meta.url).href;

const app = document.querySelector("#app");
const body = document.body;
const crosshair = document.querySelector("#crosshair");
const powerFill = document.querySelector("#powerFill");
const powerText = document.querySelector("#powerText");
const statusLabel = document.querySelector("#statusLabel");
const windLabel = document.querySelector("#windLabel");
const windArrow = document.querySelector("#windArrow");
const stageLabel = document.querySelector("#stageLabel");
const modeLabel = document.querySelector("#modeLabel");
const feedbackLabel = document.querySelector("#feedbackLabel");
const resultText = document.querySelector("#resultText");
const targetDistance = document.querySelector("#targetDistance");
const hintLabel = document.querySelector("#hintLabel");
const utilityHint = document.querySelector("#utilityHint");
const screenFlash = document.querySelector("#screenFlash");
const scoreValue = document.querySelector("#scoreValue");
const comboValue = document.querySelector("#comboValue");
const objectiveLabel = document.querySelector("#objectiveLabel");
const objectiveValue = document.querySelector("#objectiveValue");
const coinsValue = document.querySelector("#coinsValue");
const modeDescription = document.querySelector("#modeDescription");

const normalModeButton = document.querySelector("#normalModeButton");
const memeModeButton = document.querySelector("#memeModeButton");
const recordButton = document.querySelector("#recordButton");
const angleButton = document.querySelector("#angleButton");
const replayButton = document.querySelector("#replayButton");

const menuScreen = document.querySelector("#menuScreen");
const playButton = document.querySelector("#playButton");
const menuBestStat = document.querySelector("#menuBestStat");
const menuStageStat = document.querySelector("#menuStageStat");
const menuCoinsStat = document.querySelector("#menuCoinsStat");
const modeCards = Array.from(document.querySelectorAll(".mode-card"));

const resultScreen = document.querySelector("#resultScreen");
const resultModeName = document.querySelector("#resultModeName");
const resultTitle = document.querySelector("#resultTitle");
const resultSubtitle = document.querySelector("#resultSubtitle");
const resultScore = document.querySelector("#resultScore");
const resultBest = document.querySelector("#resultBest");
const resultCoins = document.querySelector("#resultCoins");
const resultCombo = document.querySelector("#resultCombo");
const resultStage = document.querySelector("#resultStage");
const leaderboardList = document.querySelector("#leaderboardList");
const retryButton = document.querySelector("#retryButton");
const resultReplayButton = document.querySelector("#resultReplayButton");
const bestShotButton = document.querySelector("#bestShotButton");
const menuButton = document.querySelector("#menuButton");

const clamp = THREE.MathUtils.clamp;
const lerp = THREE.MathUtils.lerp;

function damp(current, target, lambda, dt) {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

function dampVector3(current, target, lambda, dt) {
  current.lerp(target, 1 - Math.exp(-lambda * dt));
  return current;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function smoothstep(edge0, edge1, value) {
  if (edge0 === edge1) {
    return 0;
  }

  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function randomChoice(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function disposeObject(root) {
  root.traverse((child) => {
    if (child.geometry) {
      child.geometry.dispose();
    }

    if (Array.isArray(child.material)) {
      child.material.forEach((material) => material.dispose());
    } else if (child.material) {
      child.material.dispose();
    }
  });
}

const GAME_STATES = {
  MENU: "MENU",
  PLAYING: "PLAYING",
  RESULT: "RESULT",
};

const MODE_DEFS = {
  precision: {
    id: "precision",
    label: "Precision",
    description: "Precision mode: five arrows, clean scoring, no wasted shots.",
    arrowLimit: 5,
    timerSeconds: null,
    baseRespawn: 1.05,
    introHint: "Five arrows only. Build the score.",
  },
  timeAttack: {
    id: "timeAttack",
    label: "Time Attack",
    description: "Time attack: 30 seconds, chain hits, and keep combo pressure high.",
    arrowLimit: null,
    timerSeconds: 30,
    baseRespawn: 0.55,
    introHint: "Clock is running. Keep shooting.",
  },
  oneShot: {
    id: "oneShot",
    label: "One Shot",
    description: "One shot challenge: one arrow, long range, immediate verdict.",
    arrowLimit: 1,
    timerSeconds: null,
    baseRespawn: 0.7,
    introHint: "One arrow. No reset excuses.",
  },
};

const STAGE_PROFILES = {
  1: {
    distance: [22, 27],
    windMax: 0.14,
    motionSpeed: 0.62,
    behaviors: ["static", "horizontal"],
    aimAssist: 0.57,
  },
  2: {
    distance: [26, 32],
    windMax: 0.2,
    motionSpeed: 0.92,
    behaviors: ["horizontal", "vertical", "jitter"],
    aimAssist: 0.61,
  },
  3: {
    distance: [30, 37],
    windMax: 0.28,
    motionSpeed: 1.24,
    behaviors: ["horizontal", "vertical", "jitter", "rotating"],
    aimAssist: 0.66,
  },
};

const UNLOCK_THRESHOLDS = {
  precision: {
    score: [250, 340],
    perfect: [2, 3],
  },
  timeAttack: {
    score: [420, 620],
    perfect: [3, 5],
  },
  oneShot: {
    score: [70, 90],
    perfect: [1, 1],
  },
};

const STORAGE_KEY = "whisper_range_progress_v3";
const DEFAULT_PROGRESS = {
  bestScores: {
    precision: 0,
    timeAttack: 0,
    oneShot: 0,
  },
  unlockedStages: {
    precision: 1,
    timeAttack: 1,
    oneShot: 1,
  },
  coins: 0,
  highestCombo: 1,
  bestShotDistance: 0,
  lifetimePerfectShots: 0,
};

function loadProgress() {
  let parsed = {};

  try {
    parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch (error) {
    parsed = {};
  }

  return {
    bestScores: {
      precision: Number(parsed?.bestScores?.precision) || 0,
      timeAttack: Number(parsed?.bestScores?.timeAttack) || 0,
      oneShot: Number(parsed?.bestScores?.oneShot) || 0,
    },
    unlockedStages: {
      precision: clamp(Number(parsed?.unlockedStages?.precision) || 1, 1, 3),
      timeAttack: clamp(Number(parsed?.unlockedStages?.timeAttack) || 1, 1, 3),
      oneShot: clamp(Number(parsed?.unlockedStages?.oneShot) || 1, 1, 3),
    },
    coins: Math.max(0, Number(parsed?.coins) || 0),
    highestCombo: clamp(Number(parsed?.highestCombo) || 1, 1, 3),
    bestShotDistance: Math.max(0, Number(parsed?.bestShotDistance) || 0),
    lifetimePerfectShots: Math.max(0, Number(parsed?.lifetimePerfectShots) || 0),
  };
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    // Ignore storage write failures (private mode, quota, etc.)
  }
}

class GameStateManager {
  constructor(initialState = GAME_STATES.MENU) {
    this.state = initialState;
    this.listeners = new Set();
    this.applyToDom();
  }

  applyToDom() {
    body.dataset.gameState = this.state.toLowerCase();
  }

  setState(nextState) {
    if (this.state === nextState) {
      return;
    }

    this.state = nextState;
    this.applyToDom();
    this.listeners.forEach((listener) => listener(this.state));
  }

  onChange(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  is(state) {
    return this.state === state;
  }
}

class ScoreManager {
  constructor(progressData) {
    this.data = progressData;
    this.resetRound();
  }

  resetRound() {
    this.currentScore = 0;
    this.comboStreak = 0;
    this.comboMultiplier = 1;
    this.roundHighestCombo = 1;
    this.roundPerfectShots = 0;
    this.roundHits = 0;
  }

  getBestScore(mode) {
    return this.data.bestScores[mode] ?? 0;
  }

  getComboLabel() {
    return `x${this.comboMultiplier}`;
  }

  registerHit({ zoneId, baseScore, movingBonus = 0, distanceBonus = 0 }) {
    const previousMultiplier = this.comboMultiplier;
    this.comboStreak += 1;
    this.comboMultiplier = clamp(this.comboStreak, 1, 3);

    let effectiveMultiplier = this.comboMultiplier;
    if (zoneId === "bullseye") {
      effectiveMultiplier += 0.5;
    }

    const bullseyeBonus = zoneId === "bullseye" ? 18 : zoneId === "inner" ? 8 : 0;
    const gained = Math.round(baseScore * effectiveMultiplier + movingBonus + distanceBonus + bullseyeBonus);

    this.currentScore += gained;
    this.roundHits += 1;

    if (zoneId === "bullseye" || zoneId === "inner") {
      this.roundPerfectShots += 1;
      this.data.lifetimePerfectShots += 1;
    }

    if (this.comboMultiplier > this.roundHighestCombo) {
      this.roundHighestCombo = this.comboMultiplier;
    }

    if (this.roundHighestCombo > this.data.highestCombo) {
      this.data.highestCombo = this.roundHighestCombo;
    }

    return {
      gained,
      multiplier: this.comboMultiplier,
      comboRaised: this.comboMultiplier > previousMultiplier,
      effectiveMultiplier,
    };
  }

  registerMiss() {
    this.comboStreak = 0;
    this.comboMultiplier = 1;
    return {
      multiplier: this.comboMultiplier,
      comboRaised: false,
      gained: 0,
    };
  }

  finalizeRound(mode) {
    const previousBest = this.getBestScore(mode);
    const isNewBest = this.currentScore > previousBest;

    if (isNewBest) {
      this.data.bestScores[mode] = this.currentScore;
    }

    if (this.roundHighestCombo > this.data.highestCombo) {
      this.data.highestCombo = this.roundHighestCombo;
    }

    return {
      isNewBest,
      bestScore: this.getBestScore(mode),
    };
  }

  setBestShotDistance(distance) {
    if (distance > this.data.bestShotDistance) {
      this.data.bestShotDistance = distance;
    }
  }
}

class CoinManager {
  constructor(progressData) {
    this.data = progressData;
    this.roundCoins = 0;
  }

  startRound() {
    this.roundCoins = 0;
  }

  rewardShot({ hit, zoneId, multiplier }) {
    let gained = 0;

    if (hit) {
      gained += 2;
      if (zoneId === "bullseye" || zoneId === "inner") {
        gained += 3;
      }
      if (multiplier >= 2) {
        gained += multiplier - 1;
      }
    }

    if (gained > 0) {
      this.roundCoins += gained;
      this.data.coins += gained;
    }

    return gained;
  }
}

class LevelManager {
  constructor(progressData) {
    this.data = progressData;
  }

  getUnlockedStage(mode) {
    return clamp(this.data.unlockedStages[mode] ?? 1, 1, 3);
  }

  getProfile(mode) {
    const stage = this.getUnlockedStage(mode);
    const base = STAGE_PROFILES[stage];

    const profile = {
      stage,
      distanceMin: base.distance[0],
      distanceMax: base.distance[1],
      windMax: base.windMax,
      motionSpeed: base.motionSpeed,
      behaviors: [...base.behaviors],
      aimAssist: base.aimAssist,
    };

    if (mode === "oneShot") {
      profile.distanceMin = Math.max(profile.distanceMin, 34 + stage);
      profile.distanceMax = Math.max(profile.distanceMax, 39 + stage * 1.6);
      profile.windMax += 0.04;
      if (!profile.behaviors.includes("rotating")) {
        profile.behaviors.push("rotating");
      }
      if (!profile.behaviors.includes("jitter")) {
        profile.behaviors.push("jitter");
      }
    }

    return profile;
  }

  evaluateUnlock(mode, roundSummary) {
    const currentStage = this.getUnlockedStage(mode);

    if (currentStage >= 3) {
      return {
        unlocked: false,
        newStage: currentStage,
      };
    }

    const thresholdIndex = currentStage - 1;
    const scoreThreshold = UNLOCK_THRESHOLDS[mode].score[thresholdIndex];
    const perfectThreshold = UNLOCK_THRESHOLDS[mode].perfect[thresholdIndex];
    const shouldUnlock =
      roundSummary.score >= scoreThreshold || roundSummary.perfectShots >= perfectThreshold;

    if (!shouldUnlock) {
      return {
        unlocked: false,
        newStage: currentStage,
      };
    }

    const newStage = currentStage + 1;
    this.data.unlockedStages[mode] = newStage;

    return {
      unlocked: true,
      newStage,
    };
  }
}

class GameModeManager {
  constructor(levelManagerInstance) {
    this.levelManager = levelManagerInstance;
    this.selectedMode = "precision";
    this.activeMode = "precision";
    this.round = null;
  }

  selectMode(mode) {
    if (!MODE_DEFS[mode]) {
      return;
    }
    this.selectedMode = mode;
  }

  getModeDefinition(mode = this.selectedMode) {
    return MODE_DEFS[mode];
  }

  startRound(mode = this.selectedMode) {
    const definition = this.getModeDefinition(mode);
    this.activeMode = mode;

    this.round = {
      mode,
      stage: this.levelManager.getUnlockedStage(mode),
      arrowsRemaining: Number.isFinite(definition.arrowLimit) ? definition.arrowLimit : Infinity,
      timeRemaining: Number.isFinite(definition.timerSeconds) ? definition.timerSeconds : 0,
      timerActive: Number.isFinite(definition.timerSeconds),
      shotsFired: 0,
      hits: 0,
      perfectShots: 0,
      misses: 0,
      finished: false,
      timerExpired: false,
      lastOutcome: null,
    };

    return this.round;
  }

  onArrowReleased() {
    if (!this.round || this.round.finished) {
      return;
    }

    this.round.shotsFired += 1;
    if (Number.isFinite(this.round.arrowsRemaining)) {
      this.round.arrowsRemaining = Math.max(0, this.round.arrowsRemaining - 1);
    }
  }

  onImpact(outcome) {
    if (!this.round || this.round.finished) {
      return;
    }

    this.round.lastOutcome = outcome;
    if (outcome.hit) {
      this.round.hits += 1;
      if (outcome.zoneId === "bullseye" || outcome.zoneId === "inner") {
        this.round.perfectShots += 1;
      }
    } else {
      this.round.misses += 1;
    }
  }

  update(rawDt) {
    if (!this.round || this.round.finished || !this.round.timerActive) {
      return;
    }

    this.round.timeRemaining = Math.max(0, this.round.timeRemaining - rawDt);
    this.round.timerExpired = this.round.timeRemaining <= 0;
  }

  canShoot() {
    if (!this.round || this.round.finished) {
      return false;
    }

    if (this.round.timerActive && this.round.timeRemaining <= 0) {
      return false;
    }

    if (Number.isFinite(this.round.arrowsRemaining) && this.round.arrowsRemaining <= 0) {
      return false;
    }

    return true;
  }

  isRoundComplete({ hasActiveArrow, pointerDown }) {
    if (!this.round) {
      return false;
    }

    if (this.round.timerActive) {
      return this.round.timeRemaining <= 0 && !hasActiveArrow && !pointerDown;
    }

    const definition = MODE_DEFS[this.round.mode];
    if (Number.isFinite(definition.arrowLimit)) {
      return this.round.shotsFired >= definition.arrowLimit && !hasActiveArrow && !pointerDown;
    }

    return false;
  }

  getObjectiveUi() {
    if (!this.round) {
      return {
        label: "Arrows",
        value: "--",
      };
    }

    if (this.round.timerActive) {
      return {
        label: "Timer",
        value: `${this.round.timeRemaining.toFixed(1)}s`,
      };
    }

    return {
      label: "Arrows",
      value: Number.isFinite(this.round.arrowsRemaining) ? String(this.round.arrowsRemaining) : "--",
    };
  }

  buildRoundSummary(scoreManager, coinManager) {
    const mode = this.round?.mode ?? this.activeMode;
    const definition = MODE_DEFS[mode];

    return {
      mode,
      modeLabel: definition.label,
      score: scoreManager.currentScore,
      hits: this.round?.hits ?? 0,
      misses: this.round?.misses ?? 0,
      perfectShots: this.round?.perfectShots ?? 0,
      highestCombo: scoreManager.roundHighestCombo,
      coinsEarned: coinManager.roundCoins,
      stage: this.round?.stage ?? 1,
      lastOutcome: this.round?.lastOutcome ?? null,
    };
  }
}

class AudioSystem {
  constructor() {
    this.context = null;
    this.master = null;
    this.noiseBuffer = null;
    this.drawTone = null;
    this.impactTimer = null;
    this.drawClip = this.createClip(BOW_STRETCH_AUDIO_URL, { loop: false, volume: 0.4 });
    this.releaseClip = this.createClip(ARROW_RELEASE_AUDIO_URL, { volume: 0.72 });
    this.flightClip = this.createClip(ARROW_FLIGHT_AUDIO_URL, { volume: 0.32 });
    this.voiceCooldowns = {
      perfect: [],
      near: [],
      miss: [],
    };
    this.speechPools = {
      perfect: [
        "Perfect hit. Run it again.",
        "Clean shot. That looked expensive.",
        "Bullseye pressure. Stay there.",
      ],
      near: [
        "Close. Slight correction.",
        "Almost there. Reset and send it.",
        "Near hit. Keep the rhythm.",
      ],
      miss: [
        "Missed. Quick reset.",
        "No score. Next arrow.",
        "Shot wide. Try again.",
      ],
    };
  }

  createClip(src, { loop = false, volume = 1, playbackRate = 1 } = {}) {
    const element = new Audio(src);
    element.preload = "auto";
    element.loop = loop;
    element.volume = volume;
    element.playbackRate = playbackRate;
    element.playsInline = true;

    return {
      element,
      baseVolume: volume,
      basePlaybackRate: playbackRate,
    };
  }

  setClipDynamics(clip, { volume = clip.baseVolume, playbackRate = clip.basePlaybackRate } = {}) {
    if (!clip?.element) {
      return;
    }

    clip.element.volume = clamp(volume, 0, 1);
    clip.element.playbackRate = Math.max(0.25, playbackRate);
  }

  playClip(clip, { restart = true } = {}) {
    if (!clip?.element) {
      return;
    }

    const { element } = clip;

    if (restart) {
      element.pause();
      try {
        element.currentTime = 0;
      } catch {
        // Some browsers block currentTime updates until metadata is ready.
      }
    }

    this.setClipDynamics(clip);
    const playPromise = element.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {});
    }
  }

  stopClip(clip, { resetTime = true } = {}) {
    if (!clip?.element) {
      return;
    }

    clip.element.pause();
    if (resetTime) {
      try {
        clip.element.currentTime = 0;
      } catch {
        // Ignore currentTime reset failures during teardown.
      }
    }

    this.setClipDynamics(clip);
  }

  ensure() {
    if (this.context) {
      return;
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      return;
    }

    this.context = new AudioCtx();
    this.master = this.context.createGain();
    this.master.gain.value = 0.24;
    this.master.connect(this.context.destination);

    const length = this.context.sampleRate * 0.6;
    this.noiseBuffer = this.context.createBuffer(1, length, this.context.sampleRate);
    const data = this.noiseBuffer.getChannelData(0);

    for (let i = 0; i < length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    }
  }

  resume() {
    this.ensure();

    if (this.context?.state === "suspended") {
      this.context.resume();
    }
  }

  playNoise({
    duration = 0.18,
    gainValue = 0.05,
    lowpass = 1100,
    highpass = null,
    playbackRate = 1,
    delay = 0,
  }) {
    if (!this.context || !this.noiseBuffer) {
      return;
    }

    const source = this.context.createBufferSource();
    const gain = this.context.createGain();
    const low = this.context.createBiquadFilter();

    source.buffer = this.noiseBuffer;
    source.playbackRate.value = playbackRate;
    low.type = "lowpass";
    low.frequency.value = lowpass;

    if (highpass) {
      const high = this.context.createBiquadFilter();
      high.type = "highpass";
      high.frequency.value = highpass;
      source.connect(high);
      high.connect(low);
    } else {
      source.connect(low);
    }

    gain.gain.value = 0.0001;
    low.connect(gain);
    gain.connect(this.master);

    const now = this.context.currentTime + delay;
    gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    source.start(now);
    source.stop(now + duration + 0.05);
  }

  playTone({
    type = "sine",
    frequency = 220,
    gainValue = 0.02,
    duration = 0.12,
    glide = 0,
    delay = 0,
  }) {
    if (!this.context) {
      return;
    }

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    const now = this.context.currentTime + delay;

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);
    if (glide !== 0) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(30, frequency + glide), now + duration);
    }

    gain.gain.value = 0.0001;
    osc.connect(gain);
    gain.connect(this.master);
    gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.start(now);
    osc.stop(now + duration + 0.06);
  }

  startDraw() {
    this.resume();
    if (this.drawClip?.element) {
      this.playClip(this.drawClip, { restart: false });
      this.setClipDynamics(this.drawClip, {
        volume: this.drawClip.baseVolume * 0.72,
        playbackRate: 0.9,
      });
    }

    if (!this.context || this.drawTone || this.drawClip?.element) {
      return;
    }

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    const filter = this.context.createBiquadFilter();

    filter.type = "lowpass";
    filter.frequency.value = 920;
    osc.type = "triangle";
    osc.frequency.value = 124;
    gain.gain.value = 0.0001;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);

    const now = this.context.currentTime;
    gain.gain.exponentialRampToValueAtTime(0.016, now + 0.08);
    osc.start(now);
    this.drawTone = { osc, gain, filter };
  }

  updateDraw(power) {
    if (this.drawClip?.element && !this.drawClip.element.paused) {
      this.setClipDynamics(this.drawClip, {
        volume: this.drawClip.baseVolume * (0.7 + power * 0.3),
        playbackRate: 0.9 + power * 0.32,
      });
    }

    if (!this.drawTone || !this.context) {
      return;
    }

    const now = this.context.currentTime;
    this.drawTone.osc.frequency.linearRampToValueAtTime(124 + power * 160, now + 0.04);
    this.drawTone.filter.frequency.linearRampToValueAtTime(900 + power * 1200, now + 0.04);
    this.drawTone.gain.gain.linearRampToValueAtTime(0.014 + power * 0.02, now + 0.04);
  }

  stopDraw() {
    this.stopClip(this.drawClip);

    if (!this.drawTone || !this.context) {
      return;
    }

    const { osc, gain } = this.drawTone;
    const now = this.context.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    osc.stop(now + 0.09);
    this.drawTone = null;
  }

  release(power) {
    this.resume();
    this.stopDraw();
    this.stopFlight();

    if (this.releaseClip?.element) {
      this.playClip(this.releaseClip);
      this.setClipDynamics(this.releaseClip, {
        volume: this.releaseClip.baseVolume * (0.92 + power * 0.16),
        playbackRate: 0.96 + power * 0.12,
      });
    }

    if (this.flightClip?.element) {
      this.playClip(this.flightClip);
      this.setClipDynamics(this.flightClip, {
        volume: this.flightClip.baseVolume * (0.9 + power * 0.12),
        playbackRate: 0.95 + power * 0.1,
      });
    }

    if (this.releaseClip?.element || this.flightClip?.element) {
      return;
    }

    this.playNoise({ duration: 0.11, gainValue: 0.06, lowpass: 2800, highpass: 900, playbackRate: 1.2 });
    this.playTone({
      type: "triangle",
      frequency: 430 + power * 110,
      gainValue: 0.018 + power * 0.012,
      duration: 0.09,
      glide: -220,
    });
    this.playTone({
      type: "sine",
      frequency: 80,
      gainValue: 0.015 + power * 0.01,
      duration: 0.13,
      glide: -18,
      delay: 0.012,
    });
  }

  comboUp(level) {
    this.resume();
    const base = level >= 3 ? 560 : 480;
    this.playTone({ type: "sine", frequency: base, gainValue: 0.02, duration: 0.12, glide: 64 });
    this.playTone({ type: "sine", frequency: base * 1.2, gainValue: 0.015, duration: 0.1, glide: -20, delay: 0.05 });
  }

  failTone() {
    this.resume();
    this.playTone({ type: "triangle", frequency: 164, gainValue: 0.013, duration: 0.12, glide: -68 });
  }

  targetImpact(outcome) {
    this.resume();
    this.stopFlight();
    this.playNoise({ duration: 0.2, gainValue: 0.05, lowpass: 1200, highpass: 120, playbackRate: 0.92 });
    this.playNoise({ duration: 0.08, gainValue: 0.032, lowpass: 2400, highpass: 700, playbackRate: 1.16 });

    if (outcome.zoneId === "bullseye") {
      this.playTone({ type: "triangle", frequency: 180, gainValue: 0.022, duration: 0.2, glide: -42 });
      this.playTone({ type: "sine", frequency: 320, gainValue: 0.022, duration: 0.2, glide: 32, delay: 0.04 });
      this.playTone({ type: "sine", frequency: 240, gainValue: 0.014, duration: 0.22, glide: -14, delay: 0.12 });
      return;
    }

    if (outcome.zoneId === "inner") {
      this.playTone({ type: "triangle", frequency: 160, gainValue: 0.019, duration: 0.18, glide: -32 });
      this.playTone({ type: "sine", frequency: 260, gainValue: 0.014, duration: 0.14, glide: 18, delay: 0.04 });
      return;
    }

    this.playTone({ type: "triangle", frequency: 140, gainValue: 0.017, duration: 0.16, glide: -22 });
  }

  groundImpact() {
    this.resume();
    this.stopFlight();
    this.playNoise({ duration: 0.22, gainValue: 0.045, lowpass: 620, highpass: 60, playbackRate: 0.88 });
    this.playTone({ type: "triangle", frequency: 92, gainValue: 0.013, duration: 0.13, glide: -28 });
  }

  stopFlight() {
    this.stopClip(this.flightClip);
  }

  pickSpeech(category) {
    const pool = this.speechPools[category];
    const recent = this.voiceCooldowns[category];
    const candidates = pool
      .map((text, index) => ({ text, index }))
      .filter(({ index }) => !recent.includes(index));
    const selected = randomChoice(candidates.length ? candidates : pool.map((text, index) => ({ text, index })));

    recent.push(selected.index);
    while (recent.length > 2) {
      recent.shift();
    }

    return selected.text;
  }

  speakLine(text, category) {
    if (!("speechSynthesis" in window)) {
      this.playImpactCue(category, "normal");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = category === "miss" ? 1.08 : 1;
    utterance.pitch = category === "perfect" ? 1.15 : category === "near" ? 0.95 : 0.88;
    utterance.volume = 0.84;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  queueImpactCue(category, mode) {
    this.cancelImpactCue();
    this.impactTimer = window.setTimeout(() => {
      this.playImpactCue(category, mode);
    }, 200);
  }

  cancelImpactCue() {
    if (this.impactTimer) {
      window.clearTimeout(this.impactTimer);
      this.impactTimer = null;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    this.stopFlight();
  }

  playImpactCue(category, mode) {
    this.impactTimer = null;
    this.resume();

    if (mode === "meme") {
      this.speakLine(this.pickSpeech(category), category);
      return;
    }

    if (category === "perfect") {
      this.playTone({ type: "sine", frequency: 430, gainValue: 0.024, duration: 0.18, glide: 48 });
      this.playTone({ type: "sine", frequency: 560, gainValue: 0.018, duration: 0.16, glide: -40, delay: 0.04 });
    } else if (category === "near") {
      this.playTone({ type: "triangle", frequency: 196, gainValue: 0.018, duration: 0.16, glide: -18 });
      this.playTone({ type: "triangle", frequency: 164, gainValue: 0.014, duration: 0.16, glide: -12, delay: 0.05 });
    } else {
      this.playTone({ type: "triangle", frequency: 154, gainValue: 0.014, duration: 0.12, glide: -90 });
      this.playTone({ type: "sine", frequency: 108, gainValue: 0.012, duration: 0.18, glide: -20, delay: 0.04 });
    }
  }
}

const progressData = loadProgress();
const gameStateManager = new GameStateManager(GAME_STATES.MENU);
const scoreManager = new ScoreManager(progressData);
const coinManager = new CoinManager(progressData);
const levelManager = new LevelManager(progressData);
const modeManager = new GameModeManager(levelManager);
const audio = new AudioSystem();
const MAX_RENDER_PIXEL_RATIO = 1.5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_RENDER_PIXEL_RATIO));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.16;
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xf9f1e6, 0.013);

const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 220);
camera.position.set(0.6, 2.08, 8.6);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false;
controls.enableDamping = true;

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.18, 0.48, 0.96);
composer.addPass(renderPass);
composer.addPass(bloomPass);

function createSkyDome() {
  const geometry = new THREE.SphereGeometry(180, 48, 32);
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      topColor: { value: new THREE.Color("#fffdf8") },
      horizonColor: { value: new THREE.Color("#f8ead0") },
      bottomColor: { value: new THREE.Color("#efddbf") },
      sunTint: { value: new THREE.Color("#f7dfaf") },
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vWorldPosition;
      uniform vec3 topColor;
      uniform vec3 horizonColor;
      uniform vec3 bottomColor;
      uniform vec3 sunTint;
      void main() {
        float h = normalize(vWorldPosition).y * 0.5 + 0.5;
        float horizonMix = smoothstep(0.22, 0.68, h);
        vec3 base = mix(bottomColor, horizonColor, smoothstep(0.0, 0.42, h));
        base = mix(base, topColor, horizonMix);
        float sun = smoothstep(0.88, 1.0, 1.0 - distance(normalize(vWorldPosition).xz, vec2(0.0, -0.42)));
        vec3 color = mix(base, sunTint, sun * 0.28);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });

  return new THREE.Mesh(geometry, material);
}

scene.add(createSkyDome());

function createGround() {
  const geometry = new THREE.PlaneGeometry(180, 180, 160, 160);
  const position = geometry.attributes.position;

  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i);
    const y = position.getY(i);
    const ripple = Math.sin(x * 0.18) * 0.08 + Math.cos(y * 0.12) * 0.06;
    const swell = Math.sin((x + y) * 0.05) * 0.2;
    position.setZ(i, ripple + swell);
  }

  geometry.computeVertexNormals();
  geometry.rotateX(-Math.PI / 2);

  const material = new THREE.MeshStandardMaterial({
    color: "#e6d4b8",
    roughness: 0.97,
    metalness: 0.01,
  });

  const ground = new THREE.Mesh(geometry, material);
  ground.receiveShadow = true;
  ground.position.y = -0.02;
  return ground;
}

scene.add(createGround());

function createLaneMark(z, width, opacity) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, 0.12),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color("#f7ecd5"),
      transparent: true,
      opacity,
      depthWrite: false,
    }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(0, 0.021, z);
  return mesh;
}

scene.add(createLaneMark(4.5, 4.6, 0.38));

const ambientLight = new THREE.AmbientLight("#fffdf8", 0.46);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight("#fff9ee", "#ceb58f", 0.72);
scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight("#fff9ef", 1.72);
sunLight.position.set(8, 18, 10);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(1536, 1536);
sunLight.shadow.radius = 4;
sunLight.shadow.bias = -0.00014;
sunLight.shadow.camera.near = 1;
sunLight.shadow.camera.far = 72;
sunLight.shadow.camera.left = -30;
sunLight.shadow.camera.right = 30;
sunLight.shadow.camera.top = 30;
sunLight.shadow.camera.bottom = -22;
scene.add(sunLight);

function createTree() {
  const group = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.28, 3.6, 10),
    new THREE.MeshStandardMaterial({ color: "#73553b", roughness: 1 }),
  );
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  trunk.position.y = 1.8;

  const crown = new THREE.Mesh(
    new THREE.ConeGeometry(1.3, 4.8, 9),
    new THREE.MeshStandardMaterial({ color: "#7b7f57", roughness: 0.98 }),
  );
  crown.castShadow = true;
  crown.receiveShadow = true;
  crown.position.y = 5.1;

  group.add(trunk, crown);
  return group;
}

for (let i = 0; i < 22; i += 1) {
  const tree = createTree();
  const side = i % 2 === 0 ? -1 : 1;
  const depth = -8 - i * 4.7 + (i % 3) * 1.1;
  tree.position.set(side * (10 + (i % 4) * 4 + Math.random() * 2), 0, depth);
  tree.scale.setScalar(0.85 + Math.random() * 0.5);
  scene.add(tree);
}

function createTargetTexture() {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const center = size / 2;

  ctx.fillStyle = "#dec695";
  ctx.fillRect(0, 0, size, size);

  const ringColors = ["#f7f0e4", "#1f1b18", "#406483", "#a83a31", "#d2aa57"];
  const ringWidths = [0.98, 0.79, 0.6, 0.4, 0.19];

  for (let i = 0; i < ringColors.length; i += 1) {
    ctx.beginPath();
    ctx.arc(center, center, center * ringWidths[i], 0, Math.PI * 2);
    ctx.fillStyle = ringColors[i];
    ctx.fill();
  }

  for (let i = 0; i < 14; i += 1) {
    ctx.beginPath();
    ctx.arc(center, center, center * (0.06 + i * 0.065), 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(47, 30, 14, 0.12)";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  for (let i = 0; i < 2200; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * center;
    const x = center + Math.cos(angle) * radius;
    const y = center + Math.sin(angle) * radius;
    ctx.fillStyle = `rgba(83, 55, 28, ${Math.random() * 0.05})`;
    ctx.fillRect(x, y, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createTarget() {
  const group = new THREE.Group();
  const faceTexture = createTargetTexture();
  const targetGeometry = new THREE.CylinderGeometry(1.35, 1.35, 0.34, 48, 1, false);
  targetGeometry.rotateX(Math.PI / 2);

  const faceMaterials = [
    new THREE.MeshStandardMaterial({ color: "#93724f", roughness: 0.95 }),
    new THREE.MeshStandardMaterial({ map: faceTexture, roughness: 0.92 }),
    new THREE.MeshStandardMaterial({ map: faceTexture, roughness: 0.92 }),
  ];

  const targetMesh = new THREE.Mesh(targetGeometry, faceMaterials);
  targetMesh.castShadow = true;
  targetMesh.receiveShadow = true;
  targetMesh.position.y = 1.75;
  group.add(targetMesh);

  const supportMaterial = new THREE.MeshStandardMaterial({
    color: "#8b6944",
    roughness: 0.98,
  });

  const leftPost = new THREE.Mesh(new THREE.BoxGeometry(0.18, 3.1, 0.18), supportMaterial);
  const rightPost = leftPost.clone();
  leftPost.position.set(-0.85, 1.55, 0);
  rightPost.position.set(0.85, 1.55, 0);
  leftPost.castShadow = true;
  rightPost.castShadow = true;
  leftPost.receiveShadow = true;
  rightPost.receiveShadow = true;

  const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.16, 0.18), supportMaterial);
  crossBeam.position.set(0, 2.92, 0);
  crossBeam.castShadow = true;
  crossBeam.receiveShadow = true;

  const foot1 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 1.6), supportMaterial);
  const foot2 = foot1.clone();
  foot1.position.set(-0.85, 0.08, 0.52);
  foot2.position.set(0.85, 0.08, 0.52);
  foot1.castShadow = true;
  foot2.castShadow = true;
  foot1.receiveShadow = true;
  foot2.receiveShadow = true;

  const impactRing = new THREE.Mesh(
    new THREE.RingGeometry(0.09, 0.13, 48),
    new THREE.MeshBasicMaterial({
      color: "#e0b35f",
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  impactRing.position.z = 0.19;
  impactRing.visible = false;

  const impactGlow = new THREE.Mesh(
    new THREE.CircleGeometry(0.14, 48),
    new THREE.MeshBasicMaterial({
      color: "#efc77d",
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  impactGlow.position.z = 0.175;
  impactGlow.visible = false;

  const labelAnchor = new THREE.Object3D();
  labelAnchor.position.set(0, 3.45, 0.2);

  targetMesh.add(impactRing, impactGlow);
  group.add(leftPost, rightPost, crossBeam, foot1, foot2, labelAnchor);
  group.position.set(0, 0, -26);

  return {
    group,
    mesh: targetMesh,
    labelAnchor,
    impactRing,
    impactGlow,
    radius: 1.35,
    depth: 0.34,
  };
}

const target = createTarget();
scene.add(target.group);

function createArrowMesh(color = "#8a633d") {
  const arrow = new THREE.Group();

  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 1.45, 10),
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.9,
      metalness: 0.03,
    }),
  );
  shaft.geometry.rotateX(Math.PI / 2);
  shaft.position.z = -0.18;
  shaft.castShadow = true;
  shaft.receiveShadow = true;

  const tip = new THREE.Mesh(
    new THREE.ConeGeometry(0.055, 0.24, 10),
    new THREE.MeshStandardMaterial({
      color: "#c5c8cf",
      roughness: 0.32,
      metalness: 0.88,
      emissive: "#756749",
      emissiveIntensity: 0.06,
    }),
  );
  tip.geometry.rotateX(-Math.PI / 2);
  tip.position.z = -0.98;
  tip.castShadow = true;

  const nock = new THREE.Mesh(
    new THREE.BoxGeometry(0.045, 0.06, 0.055),
    new THREE.MeshStandardMaterial({ color: "#ece7dc", roughness: 0.42, metalness: 0.08 }),
  );
  nock.position.z = 0.56;

  const vaneMaterial = new THREE.MeshStandardMaterial({
    color: "#f4ede2",
    roughness: 0.72,
    metalness: 0.02,
    side: THREE.DoubleSide,
  });

  for (let i = 0; i < 3; i += 1) {
    const vane = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.12), vaneMaterial);
    vane.position.set(0, 0, 0.42);
    vane.rotation.z = (Math.PI * 2 * i) / 3;
    vane.castShadow = true;
    arrow.add(vane);
  }

  arrow.add(shaft, tip, nock);
  arrow.renderOrder = 2;
  return arrow;
}

function createBow() {
  const group = new THREE.Group();

  const grip = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.44, 0.12),
    new THREE.MeshStandardMaterial({
      color: "#6a4a31",
      roughness: 0.88,
    }),
  );
  grip.castShadow = true;
  grip.receiveShadow = true;

  const riser = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.88, 0.08),
    new THREE.MeshStandardMaterial({
      color: "#9a7246",
      roughness: 0.86,
      metalness: 0.08,
    }),
  );
  riser.castShadow = true;
  riser.receiveShadow = true;

  const limbMaterial = new THREE.MeshStandardMaterial({
    color: "#bb9158",
    roughness: 0.72,
    metalness: 0.05,
  });

  const topCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.18, 0),
    new THREE.Vector3(0.18, 0.78, -0.03),
    new THREE.Vector3(0.12, 1.43, 0.02),
  ]);
  const bottomCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -0.18, 0),
    new THREE.Vector3(0.16, -0.78, -0.03),
    new THREE.Vector3(0.1, -1.43, 0.02),
  ]);

  const topLimb = new THREE.Mesh(new THREE.TubeGeometry(topCurve, 20, 0.04, 10, false), limbMaterial);
  const bottomLimb = new THREE.Mesh(new THREE.TubeGeometry(bottomCurve, 20, 0.04, 10, false), limbMaterial);
  topLimb.castShadow = true;
  topLimb.receiveShadow = true;
  bottomLimb.castShadow = true;
  bottomLimb.receiveShadow = true;

  const stringPoints = [
    new THREE.Vector3(0.11, 1.4, 0.01),
    new THREE.Vector3(0.03, 0, 0.04),
    new THREE.Vector3(0.09, -1.4, 0.01),
  ];

  const stringGeometry = new THREE.BufferGeometry().setFromPoints(stringPoints);
  const string = new THREE.Line(
    stringGeometry,
    new THREE.LineBasicMaterial({ color: "#f4e2bf", transparent: true, opacity: 0.94 }),
  );

  const nockedArrow = createArrowMesh();
  nockedArrow.position.set(-0.01, 0, 0.1);

  group.add(topLimb, bottomLimb, grip, riser, string, nockedArrow);

  return {
    group,
    stringGeometry,
    stringPoints,
    nockedArrow,
  };
}

const bow = createBow();
scene.add(bow.group);

function createArrowTrail(color = "#f2c56e", opacity = 0.3, trailLength = 22) {
  const positions = new Float32Array(trailLength * 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const line = new THREE.Line(geometry, material);
  line.frustumCulled = false;
  line.visible = false;
  scene.add(line);

  return { line, positions, trailLength, opacity };
}

function seedTrail(trail, position) {
  for (let i = 0; i < trail.positions.length; i += 3) {
    trail.positions[i] = position.x;
    trail.positions[i + 1] = position.y;
    trail.positions[i + 2] = position.z;
  }

  trail.line.geometry.attributes.position.needsUpdate = true;
}

function pushTrailPoint(trail, position) {
  const { positions } = trail;

  for (let i = positions.length - 3; i >= 3; i -= 3) {
    positions[i] = positions[i - 3];
    positions[i + 1] = positions[i - 2];
    positions[i + 2] = positions[i - 1];
  }

  positions[0] = position.x;
  positions[1] = position.y;
  positions[2] = position.z;
  trail.line.geometry.attributes.position.needsUpdate = true;
}

const arrowForward = new THREE.Vector3(0, 0, -1);
const aimBaseForward = new THREE.Vector3(0, 0, -1);
const worldUp = new THREE.Vector3(0, 1, 0);
const tempVecA = new THREE.Vector3();
const tempVecB = new THREE.Vector3();
const tempVecC = new THREE.Vector3();
const tempVecD = new THREE.Vector3();
const tempVecE = new THREE.Vector3();
const tempVecF = new THREE.Vector3();
const tempVecG = new THREE.Vector3();
const tempVecH = new THREE.Vector3();
const tempQuat = new THREE.Quaternion();
const aimRay = new THREE.Ray();
const aimPlane = new THREE.Plane();
const targetPlaneNormal = new THREE.Vector3(0, 0, 1);
const targetCenter = new THREE.Vector3();
const aimBasePosition = new THREE.Vector3(0.6, 2.08, 8.6);

const round = {
  stage: 1,
  distance: 26,
  laneX: 0,
  behavior: "static",
  isMoving: false,
  motionAmplitude: 0,
  verticalAmplitude: 0,
  motionSpeed: 0.7,
  phase: 0,
  rotateSpeed: 0,
  rotation: 0,
  jitterTimer: 0,
  jitterCurrent: new THREE.Vector2(0, 0),
  jitterTarget: new THREE.Vector2(0, 0),
  aimAssist: 0.57,
};

const windState = {
  base: 0,
  target: 0,
  current: 0,
};

const highlight = {
  recordMode: false,
  archive: [],
  lastShot: null,
  bestShot: null,
};

const replayAngles = [
  { id: "cine", label: "Cine" },
  { id: "side", label: "Side" },
  { id: "over", label: "Over" },
];

const replay = {
  active: false,
  returnState: GAME_STATES.PLAYING,
  data: null,
  time: 0,
  sampleIndex: 0,
  angleIndex: 0,
  ghostArrow: createArrowMesh("#d9a55a"),
  ghostTrail: createArrowTrail("#ecc06f", 0.28, 36),
};
replay.ghostArrow.visible = false;
replay.ghostTrail.line.visible = false;
scene.add(replay.ghostArrow);

const arrowPool = [];
const activeArrows = [];
const MAX_VISIBLE_ARROWS = 12;

function createPooledArrow() {
  const mesh = createArrowMesh();
  mesh.visible = false;
  scene.add(mesh);

  const trail = createArrowTrail("#f1c882", 0.32, 22);
  trail.line.visible = false;

  return {
    mesh,
    velocity: new THREE.Vector3(),
    trail,
    inUse: false,
    active: false,
    impactType: null,
    lastDirection: new THREE.Vector3(0, 0, -1),
    life: 0,
    restTimer: 0,
    closestNormalizedRadius: Infinity,
    almostSaved: false,
    stuckToTarget: false,
    previousPosition: new THREE.Vector3(),
  };
}

function acquireArrow() {
  let arrow = arrowPool.find((item) => !item.inUse);

  if (!arrow) {
    arrow = createPooledArrow();
    arrowPool.push(arrow);
  }

  arrow.inUse = true;
  arrow.active = true;
  arrow.impactType = null;
  arrow.life = 0;
  arrow.restTimer = 0;
  arrow.closestNormalizedRadius = Infinity;
  arrow.almostSaved = false;
  arrow.stuckToTarget = false;
  arrow.velocity.set(0, 0, 0);
  arrow.trail.opacity = 0.32;
  arrow.trail.line.material.opacity = arrow.trail.opacity;
  arrow.trail.line.visible = true;
  arrow.mesh.visible = true;

  if (arrow.mesh.parent !== scene) {
    scene.attach(arrow.mesh);
  }

  activeArrows.push(arrow);
  return arrow;
}

function releaseArrowToPool(arrow) {
  if (!arrow) {
    return;
  }

  if (arrow.mesh.parent !== scene) {
    scene.attach(arrow.mesh);
  }

  arrow.mesh.visible = false;
  arrow.trail.line.visible = false;
  arrow.inUse = false;
  arrow.active = false;
  arrow.stuckToTarget = false;
  arrow.impactType = null;
}

function clearAllArrows() {
  audio.stopFlight();

  for (let i = activeArrows.length - 1; i >= 0; i -= 1) {
    releaseArrowToPool(activeArrows[i]);
    activeArrows.splice(i, 1);
  }
}

function trimOldArrows() {
  if (activeArrows.length <= MAX_VISIBLE_ARROWS) {
    return;
  }

  for (let i = 0; i < activeArrows.length && activeArrows.length > MAX_VISIBLE_ARROWS; i += 1) {
    const arrow = activeArrows[i];
    if (arrow.active || arrow.restTimer < 0.5) {
      continue;
    }

    releaseArrowToPool(arrow);
    activeArrows.splice(i, 1);
    i -= 1;
  }
}

const game = {
  pointerDown: false,
  debugOrbit: false,
  audioMode: "normal",
  activePointerId: null,
  drawPointerType: null,
  drawTarget: 0,
  drawAmount: 0,
  canShoot: false,
  roundFinished: true,
  activeArrow: null,
  currentCapture: null,
  respawnTimer: 0,
  screenShake: 0,
  timeScale: 1,
  targetTimeScale: 1,
  slowMoTimer: 0,
  freezeTimer: 0,
  shotId: 0,
  cameraMode: "aim",
  modeTime: 0,
  lastImpactType: "none",
  lastImpactPoint: new THREE.Vector3(),
  lastShotDirection: new THREE.Vector3(0, 0.06, -1).normalize(),
  currentOutcome: null,
  feedbackTimer: 0,
  showBow: false,
};

const cameraState = {
  position: camera.position.clone(),
  lookTarget: new THREE.Vector3(0, 1.75, -26),
  desiredPosition: aimBasePosition.clone(),
  desiredLook: new THREE.Vector3(0, 1.75, -26),
  aimDirection: new THREE.Vector3(0, 0, -1),
  fov: camera.fov,
};

const aimState = {
  yaw: 0,
  pitch: 0,
  targetYaw: 0,
  targetPitch: 0,
  sensitivityX: 0.0023,
  sensitivityY: 0.0018,
  maxYaw: 0.42,
  maxPitch: 0.26,
  lastPointerX: null,
  lastPointerY: null,
};

const fxState = {
  ringActive: false,
  ringProgress: 0,
  ringStrength: 1,
  bloomKick: 0,
};

const baseAimQuaternion = new THREE.Quaternion();
const localAimQuaternion = new THREE.Quaternion();
const aimEuler = new THREE.Euler(0, 0, 0, "YXZ");

function modeName(mode) {
  return MODE_DEFS[mode]?.label ?? mode;
}

function behaviorLabel(type) {
  if (type === "static") {
    return "still";
  }
  if (type === "horizontal") {
    return "horizontal";
  }
  if (type === "vertical") {
    return "vertical";
  }
  if (type === "jitter") {
    return "jitter";
  }
  if (type === "rotating") {
    return "rotating";
  }
  return type;
}

function setCameraMode(mode) {
  game.cameraMode = mode;
  game.modeTime = 0;
}

function syncBowVisibility() {
  bow.group.visible =
    game.showBow &&
    gameStateManager.is(GAME_STATES.PLAYING) &&
    !replay.active;
}

function getTargetCenter(out) {
  return target.mesh.getWorldPosition(out);
}

function resetAim() {
  aimState.yaw = 0;
  aimState.pitch = 0;
  aimState.targetYaw = 0;
  aimState.targetPitch = 0;
  resetAimPointer();
}

function resetAimPointer() {
  aimState.lastPointerX = null;
  aimState.lastPointerY = null;
}

function rememberAimPointer(event) {
  aimState.lastPointerX = event.clientX;
  aimState.lastPointerY = event.clientY;
}

function applyAimDelta(deltaX, deltaY) {
  aimState.targetYaw = clamp(aimState.targetYaw - deltaX * aimState.sensitivityX, -aimState.maxYaw, aimState.maxYaw);
  aimState.targetPitch = clamp(
    aimState.targetPitch - deltaY * aimState.sensitivityY,
    -aimState.maxPitch,
    aimState.maxPitch,
  );
}

function updateAimState() {
  aimState.yaw = aimState.targetYaw;
  aimState.pitch = aimState.targetPitch;
}

function getAimDirection(baseDirection, out) {
  baseAimQuaternion.setFromUnitVectors(arrowForward, baseDirection);
  aimEuler.set(aimState.pitch, aimState.yaw, 0, "YXZ");
  localAimQuaternion.setFromEuler(aimEuler);
  return out.copy(arrowForward).applyQuaternion(localAimQuaternion).applyQuaternion(baseAimQuaternion).normalize();
}

function getAimBaseForward(out) {
  getTargetCenter(targetCenter);
  return out.copy(targetCenter).sub(aimBasePosition).normalize();
}

function getCurrentAimDirection(out) {
  return getAimDirection(getAimBaseForward(tempVecA), out);
}

function getCrosshairAimPoint(out) {
  camera.getWorldDirection(tempVecA);
  getTargetCenter(targetCenter);

  aimPlane.setFromNormalAndCoplanarPoint(targetPlaneNormal, targetCenter);
  aimRay.origin.copy(camera.position);
  aimRay.direction.copy(tempVecA);

  if (aimRay.intersectPlane(aimPlane, out)) {
    return out;
  }

  return out.copy(camera.position).addScaledVector(tempVecA, Math.max(round.distance + 24, 60));
}

function updateMenuCards() {
  const selected = modeManager.selectedMode;

  modeCards.forEach((card) => {
    const mode = card.dataset.mode;
    const best = scoreManager.getBestScore(mode);
    const unlockedStage = levelManager.getUnlockedStage(mode);
    card.classList.toggle("is-selected", mode === selected);
    const meta = card.querySelector(".mode-card__meta");
    if (meta) {
      meta.textContent = `Best ${best} - Unlocked Stage ${unlockedStage}`;
    }
  });

  menuBestStat.textContent = `Best Score ${scoreManager.getBestScore(selected)}`;
  menuStageStat.textContent = `Unlocked Stage ${levelManager.getUnlockedStage(selected)}`;
  menuCoinsStat.textContent = `Coins ${progressData.coins}`;
}

function updateLeaderboardRows() {
  leaderboardList.innerHTML = `
    <div class="leaderboard-row"><span>Best Precision</span><span>${scoreManager.getBestScore("precision")}</span></div>
    <div class="leaderboard-row"><span>Best Time Attack</span><span>${scoreManager.getBestScore("timeAttack")}</span></div>
    <div class="leaderboard-row"><span>Best One Shot</span><span>${scoreManager.getBestScore("oneShot")}</span></div>
    <div class="leaderboard-row"><span>Highest Combo</span><span>x${progressData.highestCombo}</span></div>
    <div class="leaderboard-row"><span>Best Shot Distance</span><span>${progressData.bestShotDistance.toFixed(1)}m</span></div>
  `;
}

function configureRound(initial = false) {
  const mode = modeManager.activeMode ?? modeManager.selectedMode;
  const profile = levelManager.getProfile(mode);

  round.stage = profile.stage;
  round.distance = randomRange(profile.distanceMin, profile.distanceMax);
  round.laneX = (Math.random() - 0.5) * 1.8;
  round.behavior = randomChoice(profile.behaviors);
  round.motionSpeed = profile.motionSpeed * randomRange(0.92, 1.14);
  round.phase = Math.random() * Math.PI * 2;
  round.rotation = 0;
  round.rotateSpeed = randomRange(1.2, 2.6);
  round.jitterTimer = 0;
  round.jitterCurrent.set(0, 0);
  round.jitterTarget.set(0, 0);
  round.aimAssist = profile.aimAssist;
  round.motionAmplitude = 0;
  round.verticalAmplitude = 0;

  if (round.behavior === "horizontal") {
    round.motionAmplitude = randomRange(0.45, 1.15);
  } else if (round.behavior === "vertical") {
    round.verticalAmplitude = randomRange(0.32, 0.95);
  } else if (round.behavior === "jitter") {
    round.motionAmplitude = randomRange(0.25, 0.7);
    round.verticalAmplitude = randomRange(0.16, 0.45);
  } else if (round.behavior === "rotating") {
    round.motionAmplitude = randomRange(0.22, 0.65);
  }

  round.isMoving = round.behavior !== "static";
  windState.target = (Math.random() - 0.5) * profile.windMax * 2;

  if (initial) {
    windState.base = windState.target;
    windState.current = windState.target;
  }

  stageLabel.textContent = `Stage ${round.stage}`;
  target.mesh.rotation.z = 0;

  hintLabel.textContent = round.isMoving
    ? `Stage ${round.stage} ${behaviorLabel(round.behavior)} target. Commit through release.`
    : `Stage ${round.stage} still board. Build a clean scoreline.`;
}

function updateTarget(rawDt, rawTime) {
  const baseZ = -round.distance;
  let x = round.laneX;
  let y = 0;

  const wave = Math.sin(rawTime * round.motionSpeed + round.phase);

  if (round.behavior === "horizontal") {
    x += wave * round.motionAmplitude;
  } else if (round.behavior === "vertical") {
    y += wave * round.verticalAmplitude;
  } else if (round.behavior === "jitter") {
    round.jitterTimer -= rawDt;

    if (round.jitterTimer <= 0) {
      round.jitterTimer = randomRange(0.18, 0.42);
      round.jitterTarget.set(
        (Math.random() * 2 - 1) * round.motionAmplitude,
        (Math.random() * 2 - 1) * round.verticalAmplitude,
      );
    }

    round.jitterCurrent.lerp(round.jitterTarget, 1 - Math.exp(-7.5 * rawDt));
    x += round.jitterCurrent.x;
    y += round.jitterCurrent.y;
  } else if (round.behavior === "rotating") {
    x += wave * round.motionAmplitude;
    round.rotation += round.rotateSpeed * rawDt;
  }

  target.group.position.set(x, y, baseZ);
  const rollTarget = round.behavior === "rotating" ? Math.sin(round.rotation) * 0.42 : 0;
  target.mesh.rotation.z = damp(target.mesh.rotation.z, rollTarget, 5.8, rawDt);
}

function updateWind(rawDt, rawTime) {
  windState.base = damp(windState.base, windState.target, 0.7, rawDt);
  const gust = Math.sin(rawTime * 0.8 + round.phase) * 0.06 + Math.sin(rawTime * 1.66 + round.phase * 0.5) * 0.025;
  windState.current = windState.base + gust;
}

function getWindVector(rawTime, out) {
  return out.set(windState.current, 0, Math.cos(rawTime * 0.34 + round.phase) * 0.01);
}

function setFeedback(text, duration = 1.8) {
  feedbackLabel.textContent = text;
  feedbackLabel.style.opacity = "1";
  feedbackLabel.style.transform = "translateY(0)";
  game.feedbackTimer = duration;
}

function fadeFeedback(rawDt) {
  if (game.feedbackTimer > 0) {
    game.feedbackTimer -= rawDt;

    if (game.feedbackTimer <= 0) {
      feedbackLabel.style.opacity = "0.42";
      feedbackLabel.style.transform = "translateY(10px)";
    }
  }
}

function showResultText(text, tone = "gold") {
  resultText.textContent = text;
  resultText.style.color = tone === "red" ? "#a04f49" : tone === "neutral" ? "#715635" : "#855520";
  resultText.getAnimations().forEach((animation) => animation.cancel());
  resultText.animate(
    [
      { opacity: 0, transform: "translateX(-50%) translateY(18px) scale(0.86)" },
      { opacity: 1, transform: "translateX(-50%) translateY(0) scale(1)" },
      { opacity: 1, transform: "translateX(-50%) translateY(-4px) scale(1.04)", offset: 0.58 },
      { opacity: 0, transform: "translateX(-50%) translateY(-26px) scale(1.09)" },
    ],
    {
      duration: 1100,
      easing: "cubic-bezier(0.18, 0.8, 0.2, 1)",
    },
  );
}

function triggerScreenFlash(kind) {
  const flashColor =
    kind === "gold"
      ? "radial-gradient(circle at 50% 50%, rgba(255, 220, 150, 0.62), transparent 48%)"
      : "radial-gradient(circle at 50% 50%, rgba(209, 92, 84, 0.28), transparent 44%)";
  screenFlash.style.background = flashColor;
  screenFlash.getAnimations().forEach((animation) => animation.cancel());
  screenFlash.animate(
    [
      { opacity: 0 },
      { opacity: kind === "gold" ? 0.9 : 0.38, offset: 0.18 },
      { opacity: 0 },
    ],
    {
      duration: kind === "gold" ? 420 : 260,
      easing: "ease-out",
    },
  );

  if (kind === "gold") {
    app.getAnimations().forEach((animation) => animation.cancel());
    app.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.012)", offset: 0.35 },
        { transform: "scale(1)" },
      ],
      {
        duration: 260,
        easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
    );
  }
}

function triggerImpactRing(localPoint, color, strength = 1) {
  target.impactRing.material.color.set(color);
  target.impactGlow.material.color.set(color);
  target.impactRing.position.set(localPoint.x, localPoint.y, target.depth * 0.5 + 0.03);
  target.impactGlow.position.set(localPoint.x, localPoint.y, target.depth * 0.5 + 0.01);
  target.impactRing.scale.setScalar(0.16);
  target.impactGlow.scale.setScalar(0.45);
  target.impactRing.material.opacity = 0.95;
  target.impactGlow.material.opacity = 0.3;
  target.impactRing.visible = true;
  target.impactGlow.visible = true;
  fxState.ringActive = true;
  fxState.ringProgress = 0;
  fxState.ringStrength = strength;
  fxState.bloomKick = Math.max(fxState.bloomKick, strength * 0.22);
}

function updateImpactFx(rawDt) {
  if (fxState.ringActive) {
    fxState.ringProgress += rawDt * 3.4;
    const t = clamp(fxState.ringProgress, 0, 1);
    const ringScale = lerp(0.16, 1.2 + fxState.ringStrength * 0.55, easeOutCubic(t));
    const glowScale = lerp(0.45, 1.35 + fxState.ringStrength * 0.35, easeOutCubic(t));
    const ringOpacity = (1 - t) * 0.95;
    const glowOpacity = (1 - t) * 0.28;

    target.impactRing.scale.setScalar(ringScale);
    target.impactGlow.scale.setScalar(glowScale);
    target.impactRing.material.opacity = ringOpacity;
    target.impactGlow.material.opacity = glowOpacity;

    if (t >= 1) {
      fxState.ringActive = false;
      target.impactRing.visible = false;
      target.impactGlow.visible = false;
    }
  }

  fxState.bloomKick = damp(fxState.bloomKick, 0, 4.2, rawDt);
  bloomPass.strength = 0.18 + fxState.bloomKick;
}

function createShotArrow(startPosition, direction, power) {
  const arrow = acquireArrow();

  arrow.mesh.position.copy(startPosition);
  arrow.mesh.quaternion.setFromUnitVectors(arrowForward, direction.clone().normalize());
  const speedBoost = modeManager.activeMode === "oneShot" ? 4 : 0;
  const speed = lerp(27, 54, power) + speedBoost;
  arrow.velocity.copy(direction).normalize().multiplyScalar(speed);
  arrow.lastDirection.copy(direction).normalize();
  seedTrail(arrow.trail, startPosition);

  game.activeArrow = arrow;
  return arrow;
}

function setReplayAngle(index) {
  replay.angleIndex = (index + replayAngles.length) % replayAngles.length;
  angleButton.textContent = `Angle ${replayAngles[replay.angleIndex].label}`;
}

function syncButtons() {
  normalModeButton.classList.toggle("is-active", game.audioMode !== "meme");
  memeModeButton.classList.toggle("is-active", game.audioMode === "meme");
  recordButton.classList.toggle("is-active", highlight.recordMode);
  recordButton.textContent = highlight.recordMode ? "Record On" : "Record Off";

  const hasLiveArrow = Boolean(game.activeArrow && game.activeArrow.active);
  replayButton.disabled =
    !highlight.lastShot ||
    replay.active ||
    game.pointerDown ||
    hasLiveArrow ||
    gameStateManager.is(GAME_STATES.MENU);

  resultReplayButton.disabled = !highlight.lastShot;
  bestShotButton.disabled = !highlight.bestShot;
}

function buildTargetOutcome(normalizedRadius) {
  if (normalizedRadius <= 0.12) {
    return {
      zoneId: "bullseye",
      hit: true,
      baseScore: 100,
      family: "perfect",
      resultText: "PERFECT",
      statusLine: "Bullseye",
      feedback: "Bullseye. One more.",
      flash: "gold",
      ringColor: "#f0c46e",
      ringStrength: 1.3,
      freeze: 0.15,
      impactShake: 0.12,
      cueCategory: "perfect",
      normalizedRadius,
    };
  }

  if (normalizedRadius <= 0.34) {
    return {
      zoneId: "inner",
      hit: true,
      baseScore: 70,
      family: "perfect",
      resultText: "PERFECT",
      statusLine: "Inner ring",
      feedback: "Inner ring. Keep pressure.",
      flash: "gold",
      ringColor: "#e5b45d",
      ringStrength: 1.02,
      freeze: 0.12,
      impactShake: 0.1,
      cueCategory: "perfect",
      normalizedRadius,
    };
  }

  return {
    zoneId: "outer",
    hit: true,
    baseScore: 40,
    family: "near",
    resultText: "CLOSE!",
    statusLine: "Outer ring",
    feedback: "Outer ring. Tighten the aim.",
    flash: "red",
    ringColor: "#d36a62",
    ringStrength: 0.72,
    freeze: 0.06,
    impactShake: 0.07,
    cueCategory: "near",
    normalizedRadius,
  };
}

function buildMissOutcome(arrow) {
  if (arrow.closestNormalizedRadius <= 1.14 || arrow.almostSaved) {
    return {
      zoneId: "miss",
      hit: false,
      baseScore: 0,
      family: "near",
      resultText: "CLOSE!",
      statusLine: "Near miss",
      feedback: "Almost. The edge was there.",
      flash: "red",
      ringColor: null,
      ringStrength: 0,
      freeze: 0,
      impactShake: 0.04,
      cueCategory: "near",
      normalizedRadius: arrow.closestNormalizedRadius,
    };
  }

  return {
    zoneId: "miss",
    hit: false,
    baseScore: 0,
    family: "miss",
    resultText: "MISS",
    statusLine: "Miss",
    feedback: "No score. Quick reset.",
    flash: null,
    ringColor: null,
    ringStrength: 0,
    freeze: 0,
    impactShake: 0.03,
    cueCategory: "miss",
    normalizedRadius: arrow.closestNormalizedRadius,
  };
}

function beginCapture(arrow, power) {
  game.currentCapture = {
    shotId: game.shotId,
    power,
    elapsed: 0,
    mode: modeManager.activeMode,
    stage: round.stage,
    distance: round.distance,
    samples: [],
    outcome: null,
    impactPoint: new THREE.Vector3(),
    impactDirection: new THREE.Vector3(),
  };

  captureSample(arrow);
}

function captureSample(arrow) {
  if (!game.currentCapture || !arrow) {
    return;
  }

  const capture = game.currentCapture;
  const lastSample = capture.samples[capture.samples.length - 1];

  if (lastSample && capture.elapsed - lastSample.time < 1 / 60) {
    return;
  }

  capture.samples.push({
    time: capture.elapsed,
    arrowPos: arrow.mesh.getWorldPosition(new THREE.Vector3()),
    arrowDir: arrow.lastDirection.clone(),
    cameraPos: camera.position.clone(),
    cameraLook: cameraState.lookTarget.clone(),
    targetPos: target.group.position.clone(),
  });
}

function evaluateShotQuality(capture) {
  if (!capture?.outcome) {
    return -Infinity;
  }

  const { outcome } = capture;
  let quality = outcome.hit ? 1000 : 120;

  if (typeof outcome.normalizedRadius === "number") {
    quality += (1 - clamp(outcome.normalizedRadius, 0, 2)) * 360;
  }

  quality += (capture.distance ?? 0) * (outcome.hit ? 10 : 4);

  if (outcome.zoneId === "bullseye") {
    quality += 300;
  } else if (outcome.zoneId === "inner") {
    quality += 180;
  } else if (outcome.zoneId === "outer") {
    quality += 90;
  }

  return quality;
}

function finalizeCapture(outcome, arrow) {
  if (!game.currentCapture || !arrow) {
    return;
  }

  captureSample(arrow);
  const capture = game.currentCapture;
  capture.outcome = outcome;
  capture.impactPoint.copy(arrow.mesh.getWorldPosition(new THREE.Vector3()));
  capture.impactDirection.copy(arrow.lastDirection);
  capture.duration = capture.samples[capture.samples.length - 1]?.time ?? capture.elapsed;
  capture.quality = evaluateShotQuality(capture);

  highlight.lastShot = capture;

  if (highlight.recordMode) {
    highlight.archive.unshift(capture);
    highlight.archive = highlight.archive.slice(0, 6);
  } else {
    highlight.archive = [capture];
  }

  if (!highlight.bestShot || capture.quality > highlight.bestShot.quality) {
    highlight.bestShot = capture;
  }

  game.currentCapture = null;
  syncButtons();
}

function applyOutcome(outcome, arrow, localTargetPoint = null) {
  const impactWorldPoint = arrow.mesh.getWorldPosition(new THREE.Vector3());
  game.currentOutcome = outcome;
  game.lastImpactType = arrow.impactType;
  game.lastImpactPoint.copy(impactWorldPoint);
  game.lastShotDirection.copy(arrow.lastDirection);
  game.freezeTimer = outcome.freeze;
  game.screenShake = Math.max(game.screenShake, outcome.impactShake);
  game.slowMoTimer = 0;
  game.targetTimeScale = 1;

  if (outcome.flash) {
    triggerScreenFlash(outcome.flash === "gold" ? "gold" : "red");
  }

  if (localTargetPoint && outcome.ringColor) {
    triggerImpactRing(localTargetPoint, outcome.ringColor, outcome.ringStrength);
  }

  modeManager.onImpact(outcome);

  let scoreDelta = 0;
  let coinDelta = 0;
  let comboRaised = false;

  if (outcome.hit) {
    const movingBonus = round.isMoving ? 8 : 0;
    const distanceBonus = round.distance >= 30 ? 10 : 0;
    const scoring = scoreManager.registerHit({
      zoneId: outcome.zoneId,
      baseScore: outcome.baseScore,
      movingBonus,
      distanceBonus,
    });
    scoreDelta = scoring.gained;
    comboRaised = scoring.comboRaised;
    coinDelta = coinManager.rewardShot({
      hit: true,
      zoneId: outcome.zoneId,
      multiplier: scoring.multiplier,
    });

    if (comboRaised && scoring.multiplier > 1) {
      audio.comboUp(scoring.multiplier);
    }

    scoreManager.setBestShotDistance(round.distance);
  } else {
    const missData = scoreManager.registerMiss();
    coinDelta = coinManager.rewardShot({
      hit: false,
      zoneId: outcome.zoneId,
      multiplier: missData.multiplier,
    });
    audio.failTone();
  }

  const modeDefinition = modeManager.getModeDefinition(modeManager.activeMode);
  game.respawnTimer = modeDefinition.baseRespawn;

  if (modeManager.activeMode === "timeAttack") {
    game.respawnTimer = Math.min(0.72, modeDefinition.baseRespawn + (outcome.hit ? 0 : 0.08));
  }

  if (modeManager.activeMode === "oneShot") {
    game.respawnTimer = 0.72;
  }

  statusLabel.textContent = outcome.statusLine;
  if (scoreDelta > 0) {
    setFeedback(
      `${outcome.feedback} +${scoreDelta} pts${coinDelta > 0 ? `  +${coinDelta} coins` : ""}`,
      comboRaised ? 2.3 : 2.05,
    );
  } else {
    setFeedback(outcome.feedback, 1.9);
  }

  showResultText(
    outcome.resultText,
    outcome.flash === "red" ? "red" : outcome.flash ? "gold" : "neutral",
  );
  setCameraMode("impact");

  if (arrow.impactType === "target") {
    audio.targetImpact(outcome);
  } else {
    audio.groundImpact();
  }

  audio.queueImpactCue(outcome.cueCategory, game.audioMode);
  finalizeCapture(outcome, arrow);
  syncButtons();
}

function stickArrowToTarget(arrow) {
  arrow.velocity.set(0, 0, 0);
  arrow.stuckToTarget = true;
  target.mesh.attach(arrow.mesh);
}

function nockArrow() {
  bow.nockedArrow.visible = true;
  bow.nockedArrow.position.set(-0.01, 0, 0.1);
  bow.nockedArrow.rotation.set(0, 0, 0);
  game.showBow = true;
  syncBowVisibility();
  game.canShoot = gameStateManager.is(GAME_STATES.PLAYING) && !replay.active && modeManager.canShoot() && !game.roundFinished;
  syncButtons();
}

function cancelDraw(message = "Bow rested.") {
  if (!game.pointerDown) {
    return false;
  }

  if (game.activePointerId !== null && renderer.domElement.hasPointerCapture(game.activePointerId)) {
    renderer.domElement.releasePointerCapture(game.activePointerId);
  }

  game.pointerDown = false;
  game.activePointerId = null;
  game.drawPointerType = null;
  game.drawTarget = 0;
  resetAimPointer();
  audio.stopDraw();
  statusLabel.textContent = "Bow rested";
  setFeedback(message, 1.2);
  syncButtons();
  return true;
}

function releaseArrow() {
  if (!game.pointerDown || !game.canShoot || replay.active || !modeManager.canShoot()) {
    return;
  }

  game.pointerDown = false;
  game.canShoot = false;
  game.drawPointerType = null;
  game.drawTarget = 0;
  bow.nockedArrow.visible = false;
  game.showBow = false;
  syncBowVisibility();
  audio.stopDraw();
  modeManager.onArrowReleased();

  updateAimState();
  const startPosition = bow.nockedArrow.getWorldPosition(tempVecB);
  getCrosshairAimPoint(tempVecC);
  tempVecE.copy(tempVecC).sub(startPosition);
  if (tempVecE.lengthSq() < 1e-6) {
    getCurrentAimDirection(tempVecE);
  } else {
    tempVecE.normalize();
  }
  const arrow = createShotArrow(startPosition, tempVecE, game.drawAmount);

  game.shotId += 1;
  game.lastShotDirection.copy(tempVecE);
  game.screenShake = 0.08 + game.drawAmount * 0.06;
  game.slowMoTimer = 0;
  game.freezeTimer = 0;
  game.targetTimeScale = 1;

  beginCapture(arrow, game.drawAmount);
  audio.release(game.drawAmount);
  setCameraMode("release");
  setFeedback("Release clean. Let the arrow finish.");
  syncButtons();
}

function onPointerDown(event) {
  if (!gameStateManager.is(GAME_STATES.PLAYING) || replay.active || game.debugOrbit || game.roundFinished) {
    return;
  }

  if (game.pointerDown) {
    if (event.pointerType === "touch" && event.pointerId !== game.activePointerId) {
      cancelDraw("Bow rested. Draw again when ready.");
    }
    return;
  }

  if (event.button !== 0 || !game.canShoot || !modeManager.canShoot()) {
    return;
  }

  game.activePointerId = event.pointerId;
  game.drawPointerType = event.pointerType;
  game.pointerDown = true;
  rememberAimPointer(event);
  renderer.domElement.setPointerCapture(event.pointerId);
  audio.startDraw();
  setFeedback("Drawing...");
  syncButtons();
}

function onPointerMove(event) {
  if (game.debugOrbit || replay.active || gameStateManager.is(GAME_STATES.MENU)) {
    return;
  }

  const isTrackedPointer = game.activePointerId !== null && event.pointerId === game.activePointerId;
  const isHoverMouse = game.activePointerId === null && event.pointerType === "mouse";

  if (!isTrackedPointer && !isHoverMouse) {
    return;
  }

  if (event.pointerType === "mouse") {
    const deltaX = typeof event.movementX === "number" ? event.movementX : event.clientX - (aimState.lastPointerX ?? event.clientX);
    const deltaY = typeof event.movementY === "number" ? event.movementY : event.clientY - (aimState.lastPointerY ?? event.clientY);
    rememberAimPointer(event);

    if (Math.abs(deltaX) < 0.01 && Math.abs(deltaY) < 0.01) {
      return;
    }

    applyAimDelta(deltaX, deltaY);
    return;
  }

  if (aimState.lastPointerX === null || aimState.lastPointerY === null) {
    rememberAimPointer(event);
    return;
  }

  const deltaX = event.clientX - aimState.lastPointerX;
  const deltaY = event.clientY - aimState.lastPointerY;
  rememberAimPointer(event);

  if (Math.abs(deltaX) < 0.01 && Math.abs(deltaY) < 0.01) {
    return;
  }

  applyAimDelta(deltaX, deltaY);
}

function onPointerUp(event) {
  if (!game.pointerDown || (game.activePointerId !== null && event.pointerId !== game.activePointerId)) {
    return;
  }

  if (renderer.domElement.hasPointerCapture(event.pointerId)) {
    renderer.domElement.releasePointerCapture(event.pointerId);
  }

  game.activePointerId = null;
  game.drawPointerType = null;
  resetAimPointer();
  releaseArrow();
}

function onPointerCancel(event) {
  if (!game.pointerDown || (game.activePointerId !== null && event.pointerId !== game.activePointerId)) {
    return;
  }

  if (renderer.domElement.hasPointerCapture(event.pointerId)) {
    renderer.domElement.releasePointerCapture(event.pointerId);
  }

  game.activePointerId = null;
  game.drawPointerType = null;
  cancelDraw("Bow rested.");
}

function startReplay(data = highlight.lastShot, returnState = null) {
  if (!data || replay.active) {
    return false;
  }

  audio.stopFlight();

  if (game.pointerDown) {
    cancelDraw("Bow rested.");
  }

  const hasActiveArrow = Boolean(game.activeArrow && game.activeArrow.active);
  if (hasActiveArrow) {
    return false;
  }

  replay.active = true;
  replay.data = data;
  replay.time = 0;
  replay.sampleIndex = 0;
  replay.returnState = returnState ?? (game.roundFinished ? GAME_STATES.RESULT : GAME_STATES.PLAYING);
  replay.ghostArrow.visible = true;
  replay.ghostTrail.line.visible = true;
  seedTrail(replay.ghostTrail, replay.data.samples[0].arrowPos);
  syncBowVisibility();
  game.canShoot = false;
  gameStateManager.setState(GAME_STATES.PLAYING);
  setFeedback(`Replay angle: ${replayAngles[replay.angleIndex].label}.`, 1.4);
  statusLabel.textContent = "Replay";
  syncButtons();
  return true;
}

function stopReplay() {
  replay.active = false;
  replay.data = null;
  replay.ghostArrow.visible = false;
  replay.ghostTrail.line.visible = false;
  setCameraMode("aim");

  if (replay.returnState === GAME_STATES.RESULT && game.roundFinished) {
    gameStateManager.setState(GAME_STATES.RESULT);
  } else {
    gameStateManager.setState(GAME_STATES.PLAYING);
  }

  game.showBow = bow.nockedArrow.visible && gameStateManager.is(GAME_STATES.PLAYING) && !game.roundFinished;
  syncBowVisibility();
  game.canShoot = gameStateManager.is(GAME_STATES.PLAYING) && !game.roundFinished && modeManager.canShoot();
  statusLabel.textContent = game.roundFinished ? "Round complete" : "Hold to draw";
  syncButtons();
}

function updateReplay(rawDt) {
  if (!replay.active || !replay.data) {
    return false;
  }

  const { samples } = replay.data;
  replay.time += rawDt * 1.02;

  while (replay.sampleIndex < samples.length - 2 && samples[replay.sampleIndex + 1].time < replay.time) {
    replay.sampleIndex += 1;
  }

  const sampleA = samples[replay.sampleIndex];
  const sampleB = samples[Math.min(replay.sampleIndex + 1, samples.length - 1)];
  const span = Math.max(sampleB.time - sampleA.time, 0.0001);
  const alpha = clamp((replay.time - sampleA.time) / span, 0, 1);

  tempVecA.lerpVectors(sampleA.arrowPos, sampleB.arrowPos, alpha);
  tempVecB.lerpVectors(sampleA.arrowDir, sampleB.arrowDir, alpha).normalize();
  tempVecC.lerpVectors(sampleA.targetPos, sampleB.targetPos, alpha);
  target.group.position.copy(tempVecC);
  replay.ghostArrow.position.copy(tempVecA);
  replay.ghostArrow.lookAt(tempVecD.copy(tempVecA).add(tempVecB));
  pushTrailPoint(replay.ghostTrail, tempVecA);

  const angle = replayAngles[replay.angleIndex].id;
  if (angle === "cine") {
    camera.position.lerpVectors(sampleA.cameraPos, sampleB.cameraPos, alpha);
    cameraState.lookTarget.lerpVectors(sampleA.cameraLook, sampleB.cameraLook, alpha);
  } else if (angle === "side") {
    tempVecD.crossVectors(tempVecB, worldUp).normalize();
    camera.position
      .copy(tempVecA)
      .addScaledVector(tempVecD, 3)
      .addScaledVector(worldUp, 1.1)
      .addScaledVector(tempVecB, -0.8);
    cameraState.lookTarget.copy(tempVecA).addScaledVector(tempVecB, 2.2);
  } else {
    camera.position.copy(tempVecA).addScaledVector(worldUp, 4.2).addScaledVector(tempVecB, -1.3);
    cameraState.lookTarget.copy(tempVecA).addScaledVector(tempVecB, 1.7);
  }

  camera.lookAt(cameraState.lookTarget);
  camera.fov = damp(camera.fov, 46, 8, rawDt);
  camera.updateProjectionMatrix();

  if (replay.time > (replay.data.duration ?? samples[samples.length - 1].time) + 0.32) {
    stopReplay();
  }

  return true;
}

function updateBowVisual(rawTime) {
  if (!bow.group.visible) {
    return;
  }

  camera.getWorldDirection(tempVecA);

  const idleDrift = Math.sin(rawTime * 1.2) * 0.02;
  const breath = Math.sin(rawTime * 1.9) * 0.018;
  const pull = game.drawAmount;

  tempVecB.set(
    -0.44 - pull * 0.02,
    -0.24 + idleDrift * 0.6,
    -0.96 + pull * 0.1,
  );

  tempVecB.applyQuaternion(camera.quaternion).add(camera.position);
  bow.group.position.copy(tempVecB);

  bow.group.quaternion.copy(camera.quaternion);
  bow.group.quaternion.multiply(
    tempQuat.setFromEuler(
      new THREE.Euler(
        -0.06 + breath * 0.3,
        -0.16 - pull * 0.08,
        -0.1 + idleDrift * 0.5,
      ),
    ),
  );

  const drawDepth = lerp(0.02, 0.54, pull);
  bow.nockedArrow.position.z = 0.1 + drawDepth * 0.82;
  bow.nockedArrow.position.y = drawDepth * 0.02;
  bow.nockedArrow.rotation.z = Math.sin(rawTime * 3) * 0.01;

  bow.stringPoints[0].set(0.11, 1.4, 0.01);
  bow.stringPoints[1].set(0.03, 0, 0.04 + drawDepth);
  bow.stringPoints[2].set(0.09, -1.4, 0.01);
  bow.stringGeometry.setFromPoints(bow.stringPoints);
}

function updateDraw(rawDt) {
  game.drawTarget = game.pointerDown ? clamp(game.drawTarget + rawDt / 1.2, 0, 1) : 0;
  game.drawAmount = damp(game.drawAmount, game.drawTarget, game.pointerDown ? 8 : 12, rawDt);
  audio.updateDraw(game.drawAmount);

  powerFill.style.width = `${(game.drawAmount * 100).toFixed(0)}%`;
  powerText.textContent = `${Math.round(game.drawAmount * 100)}%`;
  crosshair.style.opacity = String(replay.active ? 0 : lerp(1, 0.08, Math.pow(game.drawAmount, 0.84)));
  body.classList.toggle("is-pulling", game.pointerDown || game.drawAmount > 0.02);

  if (game.pointerDown) {
    statusLabel.textContent = game.drawAmount > 0.9 ? "Full draw. Release." : "Drawing the bow";
  } else if (!game.activeArrow || !game.activeArrow.active) {
    if (gameStateManager.is(GAME_STATES.MENU)) {
      statusLabel.textContent = "Select a mode to begin.";
    } else if (gameStateManager.is(GAME_STATES.RESULT)) {
      statusLabel.textContent = "Round complete";
    } else {
      statusLabel.textContent = game.debugOrbit ? "Debug orbit enabled" : replay.active ? "Replay" : "Hold to draw";
    }
  }
}

function updateCinematicTiming(rawDt) {
  if (game.freezeTimer > 0) {
    game.freezeTimer -= rawDt;
    game.timeScale = 0;
    return 0;
  }

  game.slowMoTimer = 0;
  game.targetTimeScale = 1;
  game.timeScale = 1;
  return rawDt * game.timeScale;
}

function applyAimAssist(arrow, dt, rawTime, targetLocalBeforeStep) {
  const forwardGap = targetLocalBeforeStep.z - target.depth * 0.5;
  const radialDistance = Math.hypot(targetLocalBeforeStep.x, targetLocalBeforeStep.y);
  arrow.closestNormalizedRadius = Math.min(arrow.closestNormalizedRadius, radialDistance / target.radius);

  if (forwardGap <= 0 || forwardGap >= 8 || radialDistance >= target.radius * 1.35) {
    return;
  }

  getTargetCenter(tempVecA);
  const desiredDirection = tempVecA.sub(arrow.mesh.position).normalize();
  const speed = arrow.velocity.length();
  const assistStrength =
    smoothstep(8, 1.2, forwardGap) *
    smoothstep(target.radius * 1.35, target.radius * 0.18, radialDistance) *
    round.aimAssist;

  tempVecB.copy(desiredDirection).multiplyScalar(speed);
  arrow.velocity.lerp(tempVecB, assistStrength * dt * 1.8);

  if (forwardGap < 2.8 && radialDistance > target.radius && radialDistance < target.radius * 1.16) {
    arrow.velocity.addScaledVector(desiredDirection, dt * (4.8 + round.stage * 0.7));
    arrow.almostSaved = true;
  }

  arrow.velocity.addScaledVector(getWindVector(rawTime, tempVecC), dt * 0.16);
}

function getTargetSegmentHit(startWorld, endWorld) {
  const startLocal = target.mesh.worldToLocal(tempVecF.copy(startWorld));
  const endLocal = target.mesh.worldToLocal(tempVecG.copy(endWorld));
  const frontZ = target.depth * 0.5;
  const backZ = -target.depth * 0.5;
  const planeOrder = startLocal.z >= endLocal.z ? [frontZ, backZ] : [backZ, frontZ];
  const deltaZ = endLocal.z - startLocal.z;

  if (Math.abs(deltaZ) > 1e-5) {
    for (const planeZ of planeOrder) {
      const t = (planeZ - startLocal.z) / deltaZ;

      if (t < 0 || t > 1) {
        continue;
      }

      const localPoint = tempVecH.copy(startLocal).lerp(endLocal, t);
      const radialDistance = Math.hypot(localPoint.x, localPoint.y);

      if (radialDistance <= target.radius) {
        return {
          pointLocal: localPoint.clone(),
          pointWorld: target.mesh.localToWorld(localPoint.clone()),
          radialDistance,
        };
      }
    }
  }

  const endRadialDistance = Math.hypot(endLocal.x, endLocal.y);
  if (endLocal.z <= frontZ && endLocal.z >= backZ && endRadialDistance <= target.radius) {
    return {
      pointLocal: endLocal.clone(),
      pointWorld: target.mesh.localToWorld(endLocal.clone()),
      radialDistance: endRadialDistance,
    };
  }

  return null;
}

function getGroundSegmentHit(startWorld, endWorld, groundY = 0.04) {
  const deltaY = endWorld.y - startWorld.y;

  if (Math.abs(deltaY) < 1e-5) {
    return null;
  }

  const t = (groundY - startWorld.y) / deltaY;
  if (t < 0 || t > 1) {
    return null;
  }

  const point = tempVecH.copy(startWorld).lerp(endWorld, t);
  point.y = groundY;
  return point.clone();
}

function updateArrow(arrow, dt, rawTime) {
  if (!arrow.active) {
    arrow.restTimer += dt;
    arrow.trail.opacity = damp(arrow.trail.opacity, 0, 4.2, dt);
    arrow.trail.line.material.opacity = arrow.trail.opacity;
    if (arrow.restTimer > 5.2) {
      const index = activeArrows.indexOf(arrow);
      if (index >= 0) {
        releaseArrowToPool(arrow);
        activeArrows.splice(index, 1);
      }
    }
    return;
  }

  const gravity = tempVecA.set(0, -18.8, 0);
  const targetLocalBeforeStep = target.mesh.worldToLocal(tempVecB.copy(arrow.mesh.position));
  const previousPosition = arrow.previousPosition.copy(arrow.mesh.position);

  applyAimAssist(arrow, dt, rawTime, targetLocalBeforeStep);
  arrow.velocity.addScaledVector(gravity, dt);
  arrow.velocity.addScaledVector(getWindVector(rawTime, tempVecD), dt);
  arrow.mesh.position.addScaledVector(arrow.velocity, dt);

  const direction = tempVecE.copy(arrow.velocity).normalize();
  arrow.lastDirection.copy(direction);
  arrow.mesh.lookAt(tempVecF.copy(arrow.mesh.position).add(direction));
  pushTrailPoint(arrow.trail, arrow.mesh.position);
  arrow.life += dt;

  const localTargetPosition = target.mesh.worldToLocal(tempVecG.copy(arrow.mesh.position));
  const radialDistance = Math.hypot(localTargetPosition.x, localTargetPosition.y);
  arrow.closestNormalizedRadius = Math.min(arrow.closestNormalizedRadius, radialDistance / target.radius);

  const targetHit = getTargetSegmentHit(previousPosition, arrow.mesh.position);
  if (targetHit) {
    arrow.active = false;
    arrow.impactType = "target";
    arrow.mesh.position.copy(targetHit.pointWorld).addScaledVector(direction, 0.12);
    arrow.mesh.lookAt(tempVecF.copy(arrow.mesh.position).add(direction));
    applyOutcome(buildTargetOutcome(targetHit.radialDistance / target.radius), arrow, targetHit.pointLocal.clone());
    stickArrowToTarget(arrow);
    return;
  }

  const groundHit = getGroundSegmentHit(previousPosition, arrow.mesh.position);
  if (groundHit) {
    arrow.active = false;
    arrow.impactType = "ground";
    arrow.mesh.position.copy(groundHit);
    arrow.mesh.lookAt(tempVecF.copy(arrow.mesh.position).add(direction));
    applyOutcome(buildMissOutcome(arrow), arrow);
  }
}

function updateArrows(dt, rawTime, rawDt) {
  for (const arrow of activeArrows) {
    updateArrow(arrow, dt, rawTime);
  }

  if (game.currentCapture && game.activeArrow) {
    game.currentCapture.elapsed += rawDt;
    captureSample(game.activeArrow);
  }

  if (game.activeArrow && !game.activeArrow.active && game.respawnTimer > 0) {
    game.respawnTimer -= dt;

    if (game.respawnTimer <= 0) {
      const shouldEnd = modeManager.isRoundComplete({
        hasActiveArrow: false,
        pointerDown: game.pointerDown,
      });

      game.activeArrow = null;
      game.lastImpactType = "none";
      game.currentOutcome = null;

      if (shouldEnd) {
        endRound("mode-complete");
      } else if (gameStateManager.is(GAME_STATES.PLAYING) && !game.roundFinished) {
        configureRound();
        nockArrow();
        setCameraMode("aim");
      }

      trimOldArrows();
    }
  }
}

function updateCamera(rawDt, rawTime) {
  if (game.debugOrbit) {
    getTargetCenter(targetCenter);
    controls.target.copy(targetCenter);
    controls.update();
    camera.fov = damp(camera.fov, 58, 8, rawDt);
    camera.updateProjectionMatrix();
    return;
  }

  if (replay.active) {
    return;
  }

  game.modeTime += rawDt;
  updateAimState();
  getTargetCenter(targetCenter);

  const idleSway = Math.sin(rawTime * 0.72) * 0.09;
  const breathLift = Math.sin(rawTime * 1.4) * 0.05;
  const drawFocus = Math.pow(game.drawAmount, 1.15);
  const aimForward = getCurrentAimDirection(tempVecB);
  const aimRight = tempVecC.crossVectors(aimForward, worldUp).normalize();
  const aimUp = tempVecD.crossVectors(aimRight, aimForward).normalize();
  const aimOffsetX = aimState.yaw * 0.85;
  const aimOffsetY = aimState.pitch * 0.5;
  const aimDistance = Math.max(round.distance + 20, 36);
  cameraState.aimDirection.copy(aimForward);

  if (gameStateManager.is(GAME_STATES.MENU)) {
    const sweep = Math.sin(rawTime * 0.3) * 0.75;
    cameraState.desiredPosition
      .set(
        aimBasePosition.x + sweep,
        aimBasePosition.y + 0.3 + Math.sin(rawTime * 0.84) * 0.05,
        11.8 + Math.cos(rawTime * 0.22) * 0.45,
      );
    cameraState.desiredLook.copy(targetCenter);
    cameraState.desiredLook.y += 0.18;
    cameraState.fov = damp(cameraState.fov, 49, 7, rawDt);
  } else if (gameStateManager.is(GAME_STATES.RESULT)) {
    cameraState.desiredPosition
      .copy(game.lastImpactPoint)
      .addScaledVector(game.lastShotDirection, -1.75)
      .addScaledVector(worldUp, 0.85);
    cameraState.desiredLook.copy(game.lastImpactPoint);
    cameraState.desiredLook.y += 0.15;
    cameraState.fov = damp(cameraState.fov, 42, 7.5, rawDt);
  } else if (game.cameraMode === "aim") {
    cameraState.desiredPosition
      .copy(aimBasePosition)
      .addScaledVector(aimRight, idleSway * 0.28 + aimOffsetX)
      .addScaledVector(aimUp, aimOffsetY);
    cameraState.desiredPosition.y += breathLift * 0.55;

    cameraState.desiredLook
      .copy(cameraState.desiredPosition)
      .addScaledVector(aimForward, aimDistance)
      .addScaledVector(aimRight, idleSway * 0.15)
      .addScaledVector(aimUp, breathLift * 0.12);
    cameraState.fov = damp(cameraState.fov, lerp(52, 41.5, drawFocus), 8, rawDt);
  } else if (game.cameraMode === "release") {
    const push = easeOutCubic(clamp(game.modeTime / 0.18, 0, 1));
    const releaseDirection = tempVecE.copy(game.lastShotDirection).normalize();
    const releaseRight = tempVecC.crossVectors(releaseDirection, worldUp).normalize();
    const releaseUp = tempVecD.crossVectors(releaseRight, releaseDirection).normalize();
    cameraState.desiredPosition
      .copy(aimBasePosition)
      .addScaledVector(releaseDirection, 0.95 + push * 1.2)
      .addScaledVector(releaseRight, aimOffsetX * 0.4)
      .addScaledVector(releaseUp, aimOffsetY * 0.2);
    cameraState.desiredPosition.x += idleSway * 0.04;
    cameraState.desiredPosition.y += 0.04 + breathLift * 0.1;
    cameraState.desiredLook.copy(cameraState.desiredPosition).addScaledVector(releaseDirection, aimDistance);
    cameraState.fov = damp(cameraState.fov, 41, 10, rawDt);

    if (game.modeTime > 0.1 && game.activeArrow) {
      setCameraMode("follow");
    }
  } else if (game.cameraMode === "follow" && game.activeArrow) {
    const arrowDir = tempVecE.copy(game.activeArrow.lastDirection).normalize();
    const arrowRight = tempVecC.crossVectors(arrowDir, worldUp).normalize();
    cameraState.desiredPosition
      .copy(game.activeArrow.mesh.position)
      .addScaledVector(arrowDir, -3.3)
      .addScaledVector(worldUp, 0.95)
      .addScaledVector(arrowRight, 0.28);
    cameraState.desiredLook.copy(game.activeArrow.mesh.position).addScaledVector(arrowDir, 6.8).addScaledVector(worldUp, 0.18);
    cameraState.fov = damp(cameraState.fov, 46, 7, rawDt);

    if (!game.activeArrow.active) {
      setCameraMode("impact");
    }
  } else if (game.cameraMode === "impact") {
    const outcome = game.currentOutcome;

    if (game.lastImpactType === "target") {
      const perfect = outcome?.family === "perfect";
      cameraState.desiredPosition
        .copy(game.lastImpactPoint)
        .addScaledVector(game.lastShotDirection, perfect ? -1.2 : -1.55)
        .addScaledVector(worldUp, perfect ? 0.26 : 0.4);
      cameraState.desiredLook.copy(game.lastImpactPoint).addScaledVector(game.lastShotDirection, 1.7);
      cameraState.fov = damp(cameraState.fov, perfect ? 33 : 38, 10, rawDt);
    } else {
      const closeMiss = outcome?.family === "near";
      cameraState.desiredPosition.copy(game.lastImpactPoint);
      cameraState.desiredPosition.x += closeMiss ? 1.4 : 2;
      cameraState.desiredPosition.y += 1.1;
      cameraState.desiredPosition.z += closeMiss ? 2 : 2.5;
      cameraState.desiredLook.copy(game.lastImpactPoint);
      cameraState.desiredLook.y += 0.08;
      cameraState.desiredLook.z -= 0.6;
      cameraState.fov = damp(cameraState.fov, closeMiss ? 45 : 48, 8, rawDt);
    }
  }

  dampVector3(cameraState.position, cameraState.desiredPosition, game.cameraMode === "follow" ? 9 : 6.5, rawDt);
  dampVector3(cameraState.lookTarget, cameraState.desiredLook, game.cameraMode === "follow" ? 10 : 6.5, rawDt);

  game.screenShake = damp(game.screenShake, 0, 13, rawDt);
  const shakeStrength = game.screenShake;
  tempVecF.set(
    (Math.random() - 0.5) * shakeStrength,
    (Math.random() - 0.5) * shakeStrength * 0.5,
    0,
  );

  camera.position.copy(cameraState.position).add(tempVecF);
  camera.lookAt(cameraState.lookTarget);
  camera.fov = cameraState.fov;
  camera.updateProjectionMatrix();
}

function updateTargetLabel() {
  target.labelAnchor.getWorldPosition(tempVecA);
  tempVecA.project(camera);

  if (tempVecA.z > 1) {
    targetDistance.style.opacity = "0";
    return;
  }

  const x = (tempVecA.x * 0.5 + 0.5) * window.innerWidth;
  const y = (tempVecA.y * -0.5 + 0.5) * window.innerHeight;

  targetDistance.textContent = `${round.distance.toFixed(1)}m - ${behaviorLabel(round.behavior)}`;
  targetDistance.style.left = `${x}px`;
  targetDistance.style.top = `${y}px`;
  targetDistance.style.opacity = replay.active ? "0.6" : "1";
  targetDistance.style.transform = `translate(-50%, -50%) scale(${replay.active ? 0.96 : 1})`;
}

function updateHud(rawTime) {
  const wind = windState.current;
  const directionText = wind >= 0 ? "right" : "left";
  const strengthText =
    Math.abs(wind) < 0.05 ? "calm" : Math.abs(wind) < 0.14 ? "light" : Math.abs(wind) < 0.21 ? "steady" : "bold";
  const arrowRotation = wind >= 0 ? 0 : 180;

  windLabel.textContent = `Wind ${strengthText}${Math.abs(wind) < 0.05 ? "" : ` ${directionText}`}`;
  windArrow.style.transform = `rotate(${arrowRotation}deg) scaleX(${1 + Math.min(Math.abs(wind) * 2.2, 0.55)})`;

  const activeDefinition = modeManager.getModeDefinition(modeManager.activeMode);
  modeLabel.textContent = activeDefinition.label;
  modeDescription.textContent = activeDefinition.description;
  stageLabel.textContent = `Stage ${round.stage}`;

  scoreValue.textContent = String(scoreManager.currentScore);
  comboValue.textContent = scoreManager.getComboLabel();
  coinsValue.textContent = String(progressData.coins);

  const objective = modeManager.getObjectiveUi();
  objectiveLabel.textContent = objective.label;
  objectiveValue.textContent = objective.value;

  if (gameStateManager.is(GAME_STATES.MENU)) {
    statusLabel.textContent = "Select a mode to begin.";
  } else if (gameStateManager.is(GAME_STATES.RESULT)) {
    statusLabel.textContent = "Round complete";
  } else if (!game.pointerDown && !game.activeArrow?.active && !replay.active) {
    statusLabel.textContent = "Hold to draw";
  }

  if (modeManager.activeMode === "timeAttack" && modeManager.round?.timeRemaining <= 6 && modeManager.round?.timeRemaining > 0 && !game.roundFinished) {
    feedbackLabel.style.opacity = String(0.55 + Math.sin(rawTime * 10) * 0.2);
  }

  syncButtons();
}

function buildOneShotTitle(lastOutcome) {
  if (!lastOutcome) {
    return "RESULT";
  }

  if (lastOutcome.zoneId === "bullseye" || lastOutcome.zoneId === "inner") {
    return "PERFECT";
  }

  if (lastOutcome.zoneId === "outer" || lastOutcome.family === "near") {
    return "CLOSE";
  }

  return "MISS";
}

function showResultScreen(summary, unlockInfo) {
  const mode = summary.mode;
  const definition = MODE_DEFS[mode];
  const oneShotTitle = mode === "oneShot" ? buildOneShotTitle(summary.lastOutcome) : "Round Complete";
  const subtitle =
    mode === "precision"
      ? "Five shots down. Check the board and go again."
      : mode === "timeAttack"
        ? "Timer ended. Clean up the scoreline and retry."
        : "Single-arrow verdict locked. Run it back.";

  resultModeName.textContent = definition.label;
  resultTitle.textContent = oneShotTitle;
  resultSubtitle.textContent = subtitle;
  resultScore.textContent = String(summary.score);
  resultBest.textContent = String(scoreManager.getBestScore(mode));
  resultCoins.textContent = String(summary.coinsEarned);
  resultCombo.textContent = `x${summary.highestCombo}`;
  resultStage.textContent = `Stage ${summary.stage}`;

  updateLeaderboardRows();
  updateMenuCards();

  gameStateManager.setState(GAME_STATES.RESULT);

  if (unlockInfo.unlocked) {
    setFeedback(`Stage ${unlockInfo.newStage} unlocked for ${definition.label}.`, 2.6);
  } else if (summary.lastOutcome?.zoneId === "bullseye") {
    setFeedback("Bullseye round close. Keep climbing.", 2.1);
  } else {
    setFeedback("Round complete. Retry and sharpen it.", 1.9);
  }

  syncButtons();
}

function endRound(reason = "complete") {
  if (game.roundFinished || !modeManager.round) {
    return;
  }

  game.roundFinished = true;
  modeManager.round.finished = true;
  game.canShoot = false;
  game.pointerDown = false;
  game.activePointerId = null;
  game.drawPointerType = null;
  game.drawTarget = 0;
  game.showBow = false;
  syncBowVisibility();
  audio.stopDraw();
  audio.cancelImpactCue();

  const summary = modeManager.buildRoundSummary(scoreManager, coinManager);
  const bestInfo = scoreManager.finalizeRound(summary.mode);
  summary.bestScore = bestInfo.bestScore;
  const unlockInfo = levelManager.evaluateUnlock(summary.mode, summary);
  saveProgress(progressData);

  showResultScreen(summary, unlockInfo);
  statusLabel.textContent = reason === "time" ? "Time up" : "Round complete";
  setCameraMode("impact");
}

function startRound(mode = modeManager.selectedMode) {
  if (replay.active) {
    stopReplay();
  }

  clearAllArrows();
  audio.cancelImpactCue();
  modeManager.startRound(mode);
  scoreManager.resetRound();
  coinManager.startRound();

  game.pointerDown = false;
  game.activePointerId = null;
  game.drawPointerType = null;
  game.drawTarget = 0;
  game.drawAmount = 0;
  game.roundFinished = false;
  game.activeArrow = null;
  game.currentCapture = null;
  game.currentOutcome = null;
  game.respawnTimer = 0;
  game.lastImpactType = "none";
  game.timeScale = 1;
  game.targetTimeScale = 1;
  game.freezeTimer = 0;
  game.slowMoTimer = 0;
  game.screenShake = 0;
  game.showBow = false;
  resetAim();

  configureRound(true);
  setCameraMode("aim");
  gameStateManager.setState(GAME_STATES.PLAYING);
  nockArrow();

  statusLabel.textContent = "Hold to draw";
  setFeedback(MODE_DEFS[mode].introHint, 1.7);
  updateMenuCards();
  syncButtons();
}

function backToMenu() {
  if (replay.active) {
    stopReplay();
  }

  cancelDraw("Bow rested.");
  clearAllArrows();
  modeManager.selectMode(modeManager.selectedMode);
  modeManager.startRound(modeManager.selectedMode);
  configureRound(true);
  game.roundFinished = true;
  game.activeArrow = null;
  game.canShoot = false;
  game.showBow = false;
  bow.nockedArrow.visible = false;
  syncBowVisibility();
  resetAim();

  gameStateManager.setState(GAME_STATES.MENU);
  statusLabel.textContent = "Select a mode to begin.";
  setFeedback("Choose a mode and play.", 1.3);
  updateMenuCards();
  syncButtons();
}

renderer.domElement.addEventListener("pointerdown", onPointerDown);
renderer.domElement.addEventListener("pointermove", onPointerMove);
renderer.domElement.addEventListener("contextmenu", (event) => {
  event.preventDefault();

  if (game.pointerDown && game.drawPointerType === "mouse") {
    cancelDraw("Bow rested.");
  }
});
window.addEventListener("pointerup", onPointerUp);
window.addEventListener("pointercancel", onPointerCancel);

window.addEventListener("keydown", (event) => {
  if (event.code === "Escape") {
    if (cancelDraw("Bow rested.")) {
      return;
    }
  }

  if (event.code === "KeyO") {
    game.debugOrbit = !game.debugOrbit;
    controls.enabled = game.debugOrbit;
    statusLabel.textContent = game.debugOrbit ? "Debug orbit enabled" : "Hold to draw";
    setFeedback(game.debugOrbit ? "Orbit controls active." : "Gameplay camera restored.");
    syncButtons();
    return;
  }

  if (event.code === "KeyR") {
    startReplay(highlight.lastShot, game.roundFinished ? GAME_STATES.RESULT : GAME_STATES.PLAYING);
    return;
  }

  if (event.code === "KeyM") {
    game.audioMode = game.audioMode === "meme" ? "normal" : "meme";
    setFeedback(game.audioMode === "meme" ? "Meme mode armed." : "Normal mode restored.");
    syncButtons();
  }
});

modeCards.forEach((card) => {
  card.addEventListener("click", () => {
    const mode = card.dataset.mode;
    modeManager.selectMode(mode);
    modeManager.activeMode = mode;
    configureRound(true);
    updateMenuCards();
    modeDescription.textContent = MODE_DEFS[mode].description;
    modeLabel.textContent = MODE_DEFS[mode].label;
    stageLabel.textContent = `Stage ${levelManager.getUnlockedStage(mode)}`;
    setFeedback(`${MODE_DEFS[mode].label} selected.`, 1.1);
  });
});

playButton.addEventListener("click", () => {
  startRound(modeManager.selectedMode);
});

retryButton.addEventListener("click", () => {
  startRound(modeManager.activeMode);
});

menuButton.addEventListener("click", () => {
  backToMenu();
});

resultReplayButton.addEventListener("click", () => {
  startReplay(highlight.lastShot, GAME_STATES.RESULT);
});

bestShotButton.addEventListener("click", () => {
  startReplay(highlight.bestShot, GAME_STATES.RESULT);
});

normalModeButton.addEventListener("click", () => {
  game.audioMode = "normal";
  setFeedback("Normal mode. Clean reactions only.");
  syncButtons();
});

memeModeButton.addEventListener("click", () => {
  game.audioMode = "meme";
  setFeedback("Meme mode. Impact lines unlocked.");
  syncButtons();
});

recordButton.addEventListener("click", () => {
  highlight.recordMode = !highlight.recordMode;
  setFeedback(highlight.recordMode ? "Record mode on. Saving recent highlights." : "Record mode off. Last shot only.");
  syncButtons();
});

angleButton.addEventListener("click", () => {
  setReplayAngle(replay.angleIndex + 1);
  setFeedback(`Replay angle set to ${replayAngles[replay.angleIndex].label}.`, 1.2);
  syncButtons();
});

replayButton.addEventListener("click", () => {
  startReplay(highlight.lastShot, game.roundFinished ? GAME_STATES.RESULT : GAME_STATES.PLAYING);
});

function animate() {
  requestAnimationFrame(animate);

  const rawDt = Math.min(clock.getDelta(), 0.05);
  const rawTime = clock.elapsedTime;

  updateWind(rawDt, rawTime);
  fadeFeedback(rawDt);
  updateImpactFx(rawDt);

  if (!replay.active) {
    updateTarget(rawDt, rawTime);
    updateDraw(rawDt);
    updateBowVisual(rawTime);
    const simDt = updateCinematicTiming(rawDt);
    updateArrows(simDt, rawTime, rawDt);

    if (gameStateManager.is(GAME_STATES.PLAYING) && !game.roundFinished) {
      modeManager.update(rawDt);

      if (modeManager.round?.timerActive && modeManager.round.timeRemaining <= 0 && game.pointerDown) {
        cancelDraw("Time up. Draw canceled.");
      }

      if (
        modeManager.round?.timerActive &&
        modeManager.round.timeRemaining <= 0 &&
        !game.pointerDown &&
        !(game.activeArrow && game.activeArrow.active)
      ) {
        endRound("time");
      }
    }

    updateCamera(rawDt, rawTime);
  } else {
    updateReplay(rawDt);
  }

  updateHud(rawTime);
  updateTargetLabel();
  composer.render();
}

const clock = new THREE.Clock();

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_RENDER_PIXEL_RATIO));
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onResize);

modeManager.selectMode("precision");
modeManager.startRound("precision");
configureRound(true);
setReplayAngle(0);
updateMenuCards();
updateLeaderboardRows();
syncButtons();
feedbackLabel.style.opacity = "1";
feedbackLabel.style.transform = "translateY(0)";
setFeedback("Play, improve, compete, retry.");
statusLabel.textContent = "Select a mode to begin.";
utilityHint.textContent = "Esc or right click rests the bow. Two-finger tap cancels on touch.";
bow.nockedArrow.visible = false;
game.roundFinished = true;
game.canShoot = false;
gameStateManager.setState(GAME_STATES.MENU);
syncBowVisibility();
animate();

window.addEventListener("beforeunload", () => {
  saveProgress(progressData);
  audio.stopDraw();
  audio.cancelImpactCue();

  for (const arrow of arrowPool) {
    if (arrow.trail?.line) {
      arrow.trail.line.geometry.dispose();
      arrow.trail.line.material.dispose();
    }

    if (arrow.mesh) {
      disposeObject(arrow.mesh);
    }
  }

  if (replay.ghostTrail?.line) {
    replay.ghostTrail.line.geometry.dispose();
    replay.ghostTrail.line.material.dispose();
  }
});
