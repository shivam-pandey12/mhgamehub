import * as THREE from 'three';
import { LEVELS, getSurfaceHeight, isInsideFallBounds, isPointOnCourse } from './levels.js';
import { storage } from './storage.js';
import { AudioHooks } from './audio.js';
import { BALL_RADIUS, MiniGolfPhysics, clamp } from './physics.js';
import { createZoneMarker, createZoneMesh, getActiveZones, zoneFrictionMultiplier } from './zones.js';
import { ObstacleSystem } from './obstacles.js';
import { EffectsManager } from './effects.js';
import { CAMERA_MODES, CameraRig } from './camera.js';
import { ACHIEVEMENTS, getAchievement } from './achievements.js';
import { CHALLENGES, getChallenge } from './challenges.js';
import { COURSE_PACKS, FUTURE_PACKS, getCourseLevels, getCoursePack, getCoursePar, getCourseScopeId, getLevelById, getLevelIndexById, getPackForLevel, getPackProgress } from './coursePacks.js';
import { botProfile, planBotShot } from './bot.js';
import { createGhostRecorder, makeGhostRecord, sampleGhost } from './ghost.js';
import { createShotReplay, finalizeShotReplay, sampleShotReplay } from './replays.js';
import { GAME_MODES, MODE_LABELS, adjustedScore, createSession, formatTime, rankForCourse, resetHoleFlags, summarizeActor } from './modes.js';
import { OnlineClient } from './onlineClient.js';
import { resultSummaryHtml, starsMarkup, totalsForHoles } from './scorecard.js';
import { TUTORIAL_STEPS } from './tutorial.js';
import { ONLINE_EVENTS, normalizeCourseLength, sanitizeDisplayName, sanitizeRoomCode } from '../shared/onlineProtocol.js';
import { COSMETIC_TYPES, COSMETICS, cosmeticUnlockContext, getCosmetic, isCosmeticUnlocked } from './cosmetics.js';
import { formatCountdown, getTodayChallenge, isDailyResultMet, msToNextDaily } from './dailyChallenge.js';
import { buildShareText, copyShareText, downloadShareImage } from './shareCard.js';
import { emitGameHubEvent, GAME_METADATA, goBackToGameHub } from './gameHubBridge.js';
import { QUALITY_PRESETS, normalizeQuality, suggestedQuality } from './qualitySettings.js';
import { clearObjectGroup, disposeObjectTree } from './disposal.js';

const STATES = {
  LOADING: 'loading',
  MENU: 'menu',
  LEVEL_SELECT: 'levelSelect',
  PREVIEW: 'preview',
  READY: 'ready',
  AIMING: 'aiming',
  MOVING: 'moving',
  RESPAWNING: 'respawning',
  COMPLETE: 'levelComplete',
  RESTARTING: 'restarting'
};

const COLORS = {
  ivory: 0xf9f4e8,
  gold: 0xc5a15d,
  deepGold: 0x947233,
  green: 0x2f6f50,
  greenLight: 0x4c9368,
  cup: 0x090b0d
};

const rayPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const pointerWorld = new THREE.Vector3();
const tmpVector3 = new THREE.Vector3();
const tmpVector2 = new THREE.Vector2();
const tmpDirection = new THREE.Vector2();
const tmpBotDirection = new THREE.Vector2();
const urlParams = new URLSearchParams(window.location.search);
const DEV_UNLOCK_ALL = import.meta.env.VITE_DEV_UNLOCK_ALL === 'true' || urlParams.has('unlock');
const DEBUG_QA = import.meta.env.VITE_DEBUG_QA === 'true' || urlParams.has('qa');

function getCurrentUnlockedLevel() {
  return DEV_UNLOCK_ALL ? LEVELS.length : storage.getUnlockedLevel();
}

function createCanvasTexture(draw, size = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  draw(context, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeMarbleTexture() {
  return createCanvasTexture((context, size) => {
    const gradient = context.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#fffaf0');
    gradient.addColorStop(0.45, '#eee4d6');
    gradient.addColorStop(1, '#ffffff');
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);

    for (let i = 0; i < 115; i += 1) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const length = 70 + Math.random() * 250;
      const alpha = 0.035 + Math.random() * 0.08;
      context.save();
      context.translate(x, y);
      context.rotate(-0.85 + Math.random() * 0.45);
      context.strokeStyle = `rgba(132, 122, 109, ${alpha})`;
      context.lineWidth = 0.8 + Math.random() * 2.4;
      context.beginPath();
      context.moveTo(-length / 2, 0);
      context.bezierCurveTo(-length / 5, -18, length / 5, 18, length / 2, 0);
      context.stroke();
      context.restore();
    }
  });
}

function makeBallTexture() {
  return createCanvasTexture((context, size) => {
    context.fillStyle = '#fffdf6';
    context.fillRect(0, 0, size, size);
    context.fillStyle = 'rgba(185, 181, 170, 0.22)';
    for (let y = 24; y < size; y += 45) {
      for (let x = 24; x < size; x += 45) {
        context.beginPath();
        context.arc(x + ((y / 45) % 2) * 12, y, 6, 0, Math.PI * 2);
        context.fill();
      }
    }
  });
}

function bestLabel(best) {
  return best?.shots ? `${best.shots}` : '--';
}

function starsForScore(shots, par) {
  if (shots <= par) return 3;
  if (shots <= par + 2) return 2;
  return 1;
}

function totalStarsFromScores(scores) {
  return Object.values(scores).reduce((sum, score) => sum + (score?.stars ?? 0), 0);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function sanitizePlayerName(value, fallback = 'Player') {
  return sanitizeDisplayName(value, fallback);
}

function starEntities(count) {
  return `${'&starf;'.repeat(count)}${'&star;'.repeat(3 - count)}`;
}

function normalizeDirection(direction) {
  const vector = new THREE.Vector2(direction?.x ?? 0, direction?.z ?? direction?.y ?? 1);
  if (vector.lengthSq() === 0) vector.set(0, 1);
  return vector.normalize();
}

function createReusableLineGeometry(maxPoints) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(maxPoints * 3);
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setDrawRange(0, 0);
  geometry.userData.maxPoints = maxPoints;
  return geometry;
}

function updateReusableLine(line, points) {
  const attribute = line.geometry.getAttribute('position');
  if (!attribute) return;
  const count = Math.min(points.length, line.geometry.userData.maxPoints ?? points.length);
  for (let i = 0; i < count; i += 1) {
    const point = points[i];
    attribute.setXYZ(i, point.x, point.y, point.z);
  }
  attribute.needsUpdate = true;
  line.geometry.setDrawRange(0, count);
  line.visible = count > 1;
}

export class IvoryGolfGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.clock = new THREE.Clock();
    this.pointer = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.state = STATES.LOADING;
    this.levelIndex = 0;
    this.level = LEVELS[0];
    this.shots = 0;
    this.penalties = 0;
    this.power = 0;
    this.aimDirection = new THREE.Vector2(0, 1);
    this.pointerActive = false;
    this.orbitDragging = false;
    this.pointerLast = { x: 0, y: 0 };
    this.sinkProgress = 0;
    this.respawnProgress = 0;
    this.previewTimer = 0;
    this.outOfBoundsTimer = 0;
    this.panelReturnState = STATES.MENU;
    this.lastBallPosition = new THREE.Vector2();
    this.lastSafePosition = new THREE.Vector2(this.level.start.x, this.level.start.z);
    this.zoneCooldowns = new Map();
    this.flagMeshes = [];
    this.unlockedLevel = getCurrentUnlockedLevel();
    if (DEV_UNLOCK_ALL) {
      storage.setUnlockedLevel(this.unlockedLevel);
      for (const pack of COURSE_PACKS) storage.setUnlockedForPack(pack.id, pack.levelIds.length);
    }
    this.bestScores = storage.getBestScores();
    this.settings = storage.getSettings();
    this.settings.graphicsQuality = normalizeQuality(this.settings.graphicsQuality || suggestedQuality());
    this.selectedPackId = getCoursePack(this.settings.lastPackId).id;
    this.levelGridPackId = this.selectedPackId;
    this.dailyChallenge = getTodayChallenge();
    this.activeDaily = null;
    this.historyFilter = 'all';
    this.shotReplayRecorder = null;
    this.currentReplay = null;
    this.replayFinishTimer = null;
    this.currentShareResult = null;
    this.completingHole = false;
    this.vsIntroTimer = null;
    this.vsIntroComplete = null;
    this.shownVsIntroMatchIds = new Set();
    this.qaPanel = null;
    this.qaFrameCount = 0;
    this.qaFps = 0;
    this.qaLastTime = performance.now();
    this.audio = new AudioHooks(this.settings);
    this.onlineClient = new OnlineClient();
    this.online = {
      connected: false,
      playerId: null,
      room: null,
      match: null,
      turn: null,
      queue: null,
      awaitingShot: false,
      sampleTimer: 0,
      lastMatchComplete: null
    };
    this.session = createSession(GAME_MODES.SOLO_LEVEL, {
      levelIds: [this.level.id],
      actors: [{ id: 'player', name: this.getSavedPlayerName('solo', 'Player'), type: 'human', holes: [] }],
      aimAssist: this.settings.aimAssist
    });
    this.pendingContinue = null;
    this.pendingRetry = null;
    this.botTimer = 0;
    this.botPlan = null;
    this.ghostRecorder = null;
    this.ghostGroup = new THREE.Group();
    this.ghostGroup.visible = false;
    this.replayGroup = new THREE.Group();
    this.replayGroup.visible = false;
    this.tutorialIndex = 0;

    this.physics = new MiniGolfPhysics({
      onBounce: (point, intensity, kind) => this.handleBounce(point, intensity, kind)
    });

    this.ui = this.collectUi();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xe8edf1);
    this.scene.fog = new THREE.Fog(0xe8edf1, 18, 42);

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(0, 7.4, -8.8);
    this.cameraRig = new CameraRig(this.settings.cameraMode);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, QUALITY_PRESETS[this.settings.graphicsQuality].pixelRatio));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.06;

    this.courseGroup = new THREE.Group();
    this.scene.add(this.courseGroup);
    this.scene.add(this.ghostGroup);
    this.scene.add(this.replayGroup);

    this.materials = this.createMaterials();
    this.obstacles = new ObstacleSystem(this.materials, (x, z) => this.heightAt(x, z));

    this.setupLights();
    this.setupSceneElements();
    this.applyCosmetics();
    this.effects = new EffectsManager(this.scene, (x, z) => this.heightAt(x, z), this.materials);
    this.applyQualitySettings();
    this.applyComfortSettings();
    this.bindEvents();
    this.loadLevel(0, { showToast: false });
  }

  collectUi() {
    return {
      loading: document.querySelector('#loading-screen'),
      menu: document.querySelector('#main-menu'),
      hud: document.querySelector('#hud'),
      powerWidget: document.querySelector('#power-widget'),
      powerFill: document.querySelector('#power-fill'),
      powerValue: document.querySelector('#power-value'),
      levelText: document.querySelector('#hud-level'),
      shotsText: document.querySelector('#hud-shots'),
      penaltiesText: document.querySelector('#hud-penalties'),
      bestText: document.querySelector('#hud-best'),
      parText: document.querySelector('#hud-par'),
      toast: document.querySelector('#toast'),
      levelPanel: document.querySelector('#level-panel'),
      levelGrid: document.querySelector('#level-grid'),
      totalStars: document.querySelector('#total-stars'),
      progressPercent: document.querySelector('#progress-percent'),
      modePanel: document.querySelector('#mode-panel'),
      modeGrid: document.querySelector('#mode-grid'),
      setupPanel: document.querySelector('#setup-panel'),
      setupKicker: document.querySelector('#setup-kicker'),
      setupTitle: document.querySelector('#setup-title'),
      setupContent: document.querySelector('#setup-content'),
      helpPanel: document.querySelector('#help-panel'),
      settingsPanel: document.querySelector('#settings-panel'),
      achievementsPanel: document.querySelector('#achievements-panel'),
      achievementsGrid: document.querySelector('#achievements-grid'),
      profilePanel: document.querySelector('#profile-panel'),
      profileGrid: document.querySelector('#profile-grid'),
      historyPanel: document.querySelector('#history-panel'),
      historyFilters: document.querySelector('#history-filters'),
      historyList: document.querySelector('#history-list'),
      lockerPanel: document.querySelector('#locker-panel'),
      lockerContent: document.querySelector('#locker-content'),
      dailyPanel: document.querySelector('#daily-panel'),
      dailyContent: document.querySelector('#daily-content'),
      previewCard: document.querySelector('#preview-card'),
      previewKicker: document.querySelector('#preview-kicker'),
      previewTitle: document.querySelector('#preview-title'),
      previewPar: document.querySelector('#preview-par'),
      completeModal: document.querySelector('#complete-modal'),
      completeTitle: document.querySelector('#complete-title'),
      completeStars: document.querySelector('#complete-stars'),
      completeShots: document.querySelector('#complete-shots'),
      completePar: document.querySelector('#complete-par'),
      completePenalties: document.querySelector('#complete-penalties'),
      completeBest: document.querySelector('#complete-best'),
      newBestBadge: document.querySelector('#new-best-badge'),
      completeWatchLast: document.querySelector('#complete-watch-last'),
      completeWatchBest: document.querySelector('#complete-watch-best'),
      completeCopyShare: document.querySelector('#complete-copy-share'),
      completeDownloadShare: document.querySelector('#complete-download-share'),
      nextButton: document.querySelector('#complete-next'),
      resultModal: document.querySelector('#result-modal'),
      resultContent: document.querySelector('#result-content'),
      resultRetry: document.querySelector('#result-retry'),
      resultCopyShare: document.querySelector('#result-copy-share'),
      resultDownloadShare: document.querySelector('#result-download-share'),
      resultModes: document.querySelector('#result-modes'),
      resultNext: document.querySelector('#result-next'),
      tutorialModal: document.querySelector('#tutorial-modal'),
      tutorialTitle: document.querySelector('#tutorial-title'),
      tutorialText: document.querySelector('#tutorial-text'),
      tutorialDots: document.querySelector('#tutorial-dots'),
      tutorialNext: document.querySelector('#tutorial-next'),
      tutorialSkip: document.querySelector('#tutorial-skip'),
      soundToggle: document.querySelector('#sound-toggle'),
      musicToggle: document.querySelector('#music-toggle'),
      shakeToggle: document.querySelector('#shake-toggle'),
      trailToggle: document.querySelector('#trail-toggle'),
      aimAssistToggle: document.querySelector('#aim-assist-toggle'),
      ghostToggle: document.querySelector('#ghost-toggle'),
      qualitySelect: document.querySelector('#quality-select'),
      cinematicsToggle: document.querySelector('#cinematics-toggle'),
      contrastAimToggle: document.querySelector('#contrast-aim-toggle'),
      largeTextToggle: document.querySelector('#large-text-toggle'),
      leftHandToggle: document.querySelector('#left-hand-toggle'),
      modeText: document.querySelector('#hud-mode'),
      turnText: document.querySelector('#hud-turn'),
      timerText: document.querySelector('#hud-timer'),
      onlineScoreboard: document.querySelector('#online-scoreboard'),
      achievementToast: document.querySelector('#achievement-toast'),
      turnBanner: document.querySelector('#turn-banner'),
      vsIntro: document.querySelector('#vs-intro'),
      cameraButton: document.querySelector('#camera-button'),
      loadingTip: document.querySelector('#loading-tip')
    };
  }

  createMaterials() {
    const marbleTexture = makeMarbleTexture();
    marbleTexture.repeat.set(2.4, 4.2);

    return {
      marble: new THREE.MeshStandardMaterial({ color: COLORS.ivory, map: marbleTexture, roughness: 0.48, metalness: 0.04 }),
      marbleEdge: new THREE.MeshStandardMaterial({ color: 0xfffbf0, roughness: 0.36, metalness: 0.02 }),
      green: new THREE.MeshStandardMaterial({ color: COLORS.green, roughness: 0.86, metalness: 0.02 }),
      greenLight: new THREE.MeshStandardMaterial({ color: COLORS.greenLight, roughness: 0.78, metalness: 0.02 }),
      gold: new THREE.MeshStandardMaterial({ color: COLORS.gold, roughness: 0.28, metalness: 0.42 }),
      deepGold: new THREE.MeshStandardMaterial({ color: COLORS.deepGold, roughness: 0.32, metalness: 0.55 }),
      obstacleShine: new THREE.MeshBasicMaterial({ color: 0xffefbd, transparent: true, opacity: 0.28 }),
      cup: new THREE.MeshStandardMaterial({ color: COLORS.cup, roughness: 0.72, metalness: 0.15 }),
      ball: new THREE.MeshPhysicalMaterial({ color: 0xfffcf2, map: makeBallTexture(), roughness: 0.38, clearcoat: 0.45, clearcoatRoughness: 0.24 }),
      sand: new THREE.MeshStandardMaterial({ color: 0xd7bc83, roughness: 0.92, metalness: 0.01 }),
      boost: new THREE.MeshStandardMaterial({ color: 0xd6ad4f, roughness: 0.33, metalness: 0.32, emissive: 0x4a3306, emissiveIntensity: 0.16 }),
      boostZone: new THREE.MeshStandardMaterial({ color: 0xd6ad4f, roughness: 0.33, metalness: 0.32, emissive: 0x4a3306, emissiveIntensity: 0.16 }),
      boostArrow: new THREE.MeshBasicMaterial({ color: 0xfff1bf, transparent: true, opacity: 0.86 }),
      wind: new THREE.MeshStandardMaterial({ color: 0xaedff7, roughness: 0.28, metalness: 0.08, transparent: true, opacity: 0.72, emissive: 0x5ba8d6, emissiveIntensity: 0.12 }),
      windArrow: new THREE.MeshBasicMaterial({ color: 0xe8f8ff, transparent: true, opacity: 0.78 }),
      bouncePad: new THREE.MeshStandardMaterial({ color: 0x8ecf9d, roughness: 0.42, metalness: 0.08, emissive: 0x164826, emissiveIntensity: 0.1 }),
      aim: new THREE.LineBasicMaterial({ color: 0xf8d886, transparent: true, opacity: 0.92 }),
      prediction: new THREE.LineBasicMaterial({ color: 0xfff4ce, transparent: true, opacity: 0.6 }),
      trail: new THREE.LineBasicMaterial({ color: 0xffefbe, transparent: true, opacity: 0.42 }),
      markerStart: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.42, side: THREE.DoubleSide }),
      markerHole: new THREE.MeshBasicMaterial({ color: 0xffe7ad, transparent: true, opacity: 0.62, side: THREE.DoubleSide })
    };
  }

  setupLights() {
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0xa7b1bd, 2.6));

    const keyLight = new THREE.DirectionalLight(0xfff4dd, 3.1);
    keyLight.position.set(-5, 9, -6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1536, 1536);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 30;
    keyLight.shadow.camera.left = -11;
    keyLight.shadow.camera.right = 11;
    keyLight.shadow.camera.top = 11;
    keyLight.shadow.camera.bottom = -11;
    this.scene.add(keyLight);
    this.keyLight = keyLight;

    const rimLight = new THREE.DirectionalLight(0xcde7ff, 1.15);
    rimLight.position.set(6, 5, 8);
    this.scene.add(rimLight);
  }

  setupSceneElements() {
    const table = new THREE.Mesh(
      new THREE.BoxGeometry(16, 0.35, 24),
      new THREE.MeshStandardMaterial({ color: 0xd6c3a2, roughness: 0.7, metalness: 0.03 })
    );
    table.position.y = -0.46;
    table.receiveShadow = true;
    this.scene.add(table);

    const tableTrim = new THREE.Mesh(
      new THREE.BoxGeometry(16.6, 0.08, 24.6),
      new THREE.MeshStandardMaterial({ color: 0xa8864a, roughness: 0.34, metalness: 0.35 })
    );
    tableTrim.position.y = -0.22;
    tableTrim.receiveShadow = true;
    this.scene.add(tableTrim);

    this.ball = new THREE.Mesh(new THREE.SphereGeometry(BALL_RADIUS, 48, 32), this.materials.ball);
    this.ball.castShadow = true;
    this.ball.receiveShadow = true;
    this.scene.add(this.ball);

    this.opponentBall = new THREE.Mesh(
      new THREE.SphereGeometry(BALL_RADIUS * 0.94, 32, 24),
      new THREE.MeshPhysicalMaterial({ color: 0xffe8ad, roughness: 0.36, metalness: 0.12, transparent: true, opacity: 0.52 })
    );
    this.opponentBall.castShadow = true;
    this.opponentBall.visible = false;
    this.scene.add(this.opponentBall);

    this.aimLine = new THREE.Line(createReusableLineGeometry(2), this.materials.aim);
    this.aimLine.visible = false;
    this.scene.add(this.aimLine);

    this.predictionLine = new THREE.Line(createReusableLineGeometry(52), this.materials.prediction);
    this.predictionLine.visible = false;
    this.scene.add(this.predictionLine);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.scheduleResize());
    this.canvas.addEventListener('contextmenu', (event) => event.preventDefault());
    this.canvas.addEventListener('pointerdown', (event) => this.onPointerDown(event));
    this.canvas.addEventListener('pointermove', (event) => this.onPointerMove(event));
    this.canvas.addEventListener('pointerup', (event) => this.onPointerUp(event));
    this.canvas.addEventListener('pointercancel', () => this.cancelPointer());

    document.querySelector('#play-button').addEventListener('click', () => this.openPanel('modePanel'));
    document.querySelector('#online-button').addEventListener('click', () => this.openOnlineMenu());
    document.querySelector('#level-select-button').addEventListener('click', () => this.openPanel('levelPanel'));
    document.querySelector('#open-levels-button').addEventListener('click', () => this.openPanel('levelPanel'));
    document.querySelector('#achievements-button').addEventListener('click', () => this.openPanel('achievementsPanel'));
    document.querySelector('#locker-button')?.addEventListener('click', () => this.openPanel('lockerPanel'));
    document.querySelector('#daily-button')?.addEventListener('click', () => this.openPanel('dailyPanel'));
    document.querySelector('#profile-button').addEventListener('click', () => this.openPanel('profilePanel'));
    document.querySelector('#history-button').addEventListener('click', () => this.openPanel('historyPanel'));
    document.querySelector('#help-button').addEventListener('click', () => this.openPanel('helpPanel'));
    document.querySelector('#gamehub-back-button')?.addEventListener('click', () => goBackToGameHub(() => this.openPanel('modePanel')));
    document.querySelector('#settings-button').addEventListener('click', () => this.openPanel('settingsPanel'));
    document.querySelector('#restart-button').addEventListener('click', () => this.restartLevel());
    this.ui.cameraButton.addEventListener('click', () => this.toggleCamera());
    document.querySelector('#complete-restart').addEventListener('click', () => this.restartLevel());
    document.querySelector('#complete-next').addEventListener('click', () => this.nextLevel());
    this.ui.completeWatchLast?.addEventListener('click', () => this.showShotReplay('last'));
    this.ui.completeWatchBest?.addEventListener('click', () => this.showShotReplay('best'));
    this.ui.completeCopyShare?.addEventListener('click', () => this.copyCurrentShare());
    this.ui.completeDownloadShare?.addEventListener('click', () => this.downloadCurrentShare());
    document.querySelector('#complete-levels').addEventListener('click', () => {
      this.ui.completeModal.classList.remove('is-visible');
      this.ui.completeModal.setAttribute('aria-hidden', 'true');
      this.openPanel('levelPanel');
    });
    document.querySelector('#reset-progress-button').addEventListener('click', () => this.resetProgress());
    document.querySelector('#reset-stats-button').addEventListener('click', () => this.resetStats());
    document.querySelector('#replay-tutorial-button').addEventListener('click', () => this.showTutorial(true));
    document.querySelector('#skip-preview-button').addEventListener('click', () => this.finishPreview());
    this.ui.resultRetry.addEventListener('click', () => this.retryCurrentMode());
    this.ui.resultCopyShare?.addEventListener('click', () => this.copyCurrentShare());
    this.ui.resultDownloadShare?.addEventListener('click', () => this.downloadCurrentShare());
    this.ui.resultModes.addEventListener('click', () => this.returnToModeSelect());
    this.ui.resultNext.addEventListener('click', () => this.continueSession());
    this.ui.tutorialNext.addEventListener('click', () => this.nextTutorialStep());
    this.ui.tutorialSkip.addEventListener('click', () => this.finishTutorial());

    document.addEventListener('click', (event) => {
      if (event.target.closest('button')) this.audio.click();
    });

    this.bindSettings();
    this.bindOnlineEvents();
    this.buildModeGrid();
    this.buildAchievementsGrid();
    this.buildProfilePanel();
    this.buildHistoryPanel();
    this.buildLockerPanel();
    this.buildDailyPanel();
    document.querySelectorAll('[data-close-panel]').forEach((button) => {
      button.addEventListener('click', () => this.closePanel(button.dataset.closePanel));
    });
  }

  bindSettings() {
    const toggles = [
      ['sound', this.ui.soundToggle],
      ['music', this.ui.musicToggle],
      ['cameraShake', this.ui.shakeToggle],
      ['ballTrail', this.ui.trailToggle],
      ['aimAssist', this.ui.aimAssistToggle],
      ['showGhost', this.ui.ghostToggle],
      ['reduceCinematics', this.ui.cinematicsToggle],
      ['highContrastAim', this.ui.contrastAimToggle],
      ['largeText', this.ui.largeTextToggle],
      ['leftHandControls', this.ui.leftHandToggle]
    ];

    for (const [key, input] of toggles) {
      if (!input) continue;
      input.checked = Boolean(this.settings[key]);
      input.addEventListener('change', () => {
        this.settings[key] = input.checked;
        this.audio.setEnabled(this.settings.sound);
        storage.saveSettings(this.settings);
        this.applyComfortSettings();
        this.updateGhostVisual();
        this.updateAimGuides();
      });
    }

    if (this.ui.qualitySelect) {
      this.ui.qualitySelect.value = this.settings.graphicsQuality;
      this.ui.qualitySelect.addEventListener('change', () => {
        this.settings.graphicsQuality = normalizeQuality(this.ui.qualitySelect.value);
        storage.saveSettings(this.settings);
        this.applyQualitySettings();
        this.showToast(`Graphics: ${QUALITY_PRESETS[this.settings.graphicsQuality].label}`);
      });
    }

    document.querySelector('#fullscreen-button')?.addEventListener('click', () => this.enterFullscreen());
    this.applyComfortSettings();
  }

  bindOnlineEvents() {
    this.onlineClient.on(ONLINE_EVENTS.STATUS, (status) => {
      this.online.connected = Boolean(status.connected);
      this.online.playerId = status.playerId ?? this.online.playerId;
      if (!status.connected && status.reconnecting) this.showToast('Reconnecting to online server...');
      this.updateUi();
      if (this.ui.setupPanel.classList.contains('is-visible') && this.ui.setupTitle.textContent.includes('Online')) {
        this.openOnlineMenu();
      }
    });

    this.onlineClient.on(ONLINE_EVENTS.ERROR, (error) => {
      this.showToast(error?.message ?? 'Online action was rejected.');
      if (this.ui.setupPanel.classList.contains('is-visible')) this.renderOnlineStatus(error?.message);
    });

    this.onlineClient.on(ONLINE_EVENTS.ROOM_UPDATE, (room) => {
      this.online.room = room;
      this.renderOnlineLobby(room);
    });

    this.onlineClient.on(ONLINE_EVENTS.QUEUE_UPDATE, (queue) => {
      this.online.queue = queue;
      this.renderOnlineQueue(queue);
      if (queue?.status === 'bot-filled') this.showToast(queue.message);
    });

    const matchHandler = ({ match }) => {
      this.online.match = match;
      this.online.turn = match?.turn ?? null;
      this.syncOnlineSession(match);
      this.renderOnlineScoreboard(match);
    };

    this.onlineClient.on(ONLINE_EVENTS.MATCH_CREATED, (payload) => {
      matchHandler(payload);
      this.maybeShowOnlineVsIntro(payload?.match);
    });
    this.onlineClient.on(ONLINE_EVENTS.MATCH_UPDATE, matchHandler);
    this.onlineClient.on(ONLINE_EVENTS.TURN_UPDATE, ({ match }) => {
      this.online.match = match;
      this.online.turn = match?.turn ?? null;
      this.handleOnlineTurn(match);
    });

    this.onlineClient.on(ONLINE_EVENTS.SHOT_ACCEPTED, (payload) => this.handleOnlineShotAccepted(payload));
    this.onlineClient.on(ONLINE_EVENTS.SHOT_REJECTED, (payload) => {
      this.online.awaitingShot = false;
      this.showToast(payload?.reason ?? 'Shot rejected.');
      this.setState(STATES.READY);
    });
    this.onlineClient.on(ONLINE_EVENTS.BALL_SAMPLE, (sample) => this.handleOnlineBallSample(sample));
    this.onlineClient.on(ONLINE_EVENTS.HOLE_RESULT, ({ match, result, playerId }) => this.handleOnlineHoleResult(match, result, playerId));
    this.onlineClient.on(ONLINE_EVENTS.MATCH_COMPLETE, (payload) => this.handleOnlineMatchComplete(payload));
    this.onlineClient.on(ONLINE_EVENTS.REMATCH_UPDATE, ({ match }) => {
      this.online.match = match;
      this.showToast('Rematch request updated');
      if (this.online.lastMatchComplete) this.showOnlineMatchComplete(this.online.lastMatchComplete);
    });
    this.onlineClient.on(ONLINE_EVENTS.OPPONENT_LEFT, ({ timeoutMs }) => {
      this.showToast(timeoutMs ? 'Opponent disconnected. Waiting...' : 'Opponent left the match.');
      this.renderOnlineStatus('Opponent disconnected. Waiting for forfeit resolution.');
    });
  }

  renderOnlineStatus(message = '') {
    const status = this.online.connected ? 'Online server connected' : 'Server is offline. Local modes are still available.';
    const detail = message ? `<p class="online-message">${escapeHtml(message)}</p>` : '';
    this.ui.setupContent.querySelector('.online-status-line')?.remove();
    this.ui.setupContent.insertAdjacentHTML('afterbegin', `<div class="online-status-line${this.online.connected ? ' is-online' : ''}"><span>${status}</span>${detail}</div>`);
  }

  start() {
    this.resize();
    this.setState(STATES.MENU);
    this.ui.loading.classList.add('is-hidden');
    this.updateUi();
    if (DEBUG_QA) this.createQaPanel();
    this.renderer.setAnimationLoop(() => this.tick());
    if (!storage.isTutorialCompleted()) {
      setTimeout(() => this.showTutorial(false), 420);
    }
  }

  setState(state) {
    this.state = state;
    const inMenu = state === STATES.MENU || state === STATES.LEVEL_SELECT;
    this.ui.menu.classList.toggle('screen--active', state === STATES.MENU);
    this.ui.hud.classList.toggle('is-visible', !inMenu);
    this.ui.powerWidget.classList.toggle('is-visible', (state === STATES.AIMING || state === STATES.READY) && !inMenu);
    this.ui.previewCard.classList.toggle('is-visible', state === STATES.PREVIEW);
    this.ui.previewCard.setAttribute('aria-hidden', state === STATES.PREVIEW ? 'false' : 'true');
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  scheduleResize() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => this.resize(), 80);
  }

  tick() {
    const delta = Math.min(0.034, this.clock.getDelta());
    this.update(delta);
    this.renderer.render(this.scene, this.camera);
  }

  update(delta) {
    if (this.state === STATES.MENU || this.state === STATES.LEVEL_SELECT) {
      this.updateCamera(delta);
      this.updateQaPanel();
      return;
    }

    this.obstacles.update(delta);
    this.physics.setDynamicColliders(this.obstacles.getColliders());
    this.animateFlags(delta);
    this.updateModeTimer(delta);
    this.updateBot(delta);

    if (this.state === STATES.PREVIEW) {
      this.previewTimer -= delta;
      if (this.previewTimer <= 0) this.finishPreview();
    }

    if (this.state === STATES.MOVING) {
      this.updateMovingBall(delta);
      sampleGhost(this.ghostRecorder, this.physics.position, delta);
      sampleShotReplay(this.shotReplayRecorder, this.physics.position, delta);
    } else if (this.state === STATES.RESPAWNING) {
      this.updateRespawn(delta);
    } else if (this.state === STATES.COMPLETE && this.sinkProgress < 1) {
      this.sinkProgress = Math.min(1, this.sinkProgress + delta * 1.8);
      this.updateBallMesh(delta);
    } else {
      this.updateBallMesh(delta);
    }

    this.updateAimGuides();
    this.effects.update(delta);
    this.updateReplay(delta);
    this.updateCamera(delta);
    this.updateQaPanel();
  }

  updateMovingBall(delta) {
    const platform = this.obstacles.getPlatformAt(this.physics.position.x, this.physics.position.y);
    if (platform) {
      this.physics.updatePositionBy(tmpVector2.copy(platform.velocity).multiplyScalar(delta * 0.8));
    }

    const activeZones = getActiveZones(this.level, this.physics.position.x, this.physics.position.y);
    this.handleZones(activeZones);
    this.physics.update(delta, {
      heightAt: (x, z) => this.heightAt(x, z),
      frictionMultiplier: zoneFrictionMultiplier(activeZones)
    });

    this.updateBallMesh(delta);
    this.effects.updateTrail(
      { x: this.physics.position.x, z: this.physics.position.y },
      this.physics.velocity.length(),
      this.settings.ballTrail
    );
    this.emitOnlineBallSample(delta, true);

    if (this.physics.wouldEnterHole(this.level.hole, delta)) {
      this.beginHoleSuccess();
      return;
    }

    this.checkOutOfBounds(delta);

    if (this.physics.velocity.lengthSq() === 0 && this.state === STATES.MOVING) {
      if (this.isBallOnCourse()) this.lastSafePosition.copy(this.physics.position);
      this.setState(STATES.READY);
      this.hideAimGuides();
      this.effects.clearTrail();
      this.emitOnlineBallSample(0, false);
      this.showToast('Ready for the next putt');
    }
  }

  handleZones(zones) {
    for (const zone of zones) {
      const key = `${this.level.id}-${zone.type}-${zone.x}-${zone.z}`;
      const now = performance.now();
      const last = this.zoneCooldowns.get(key) ?? 0;
      if (now - last < 850) continue;

      if (zone.type === 'sand') {
        this.session.flags.usedSand = true;
        this.effects.dust(this.physics.position.x, this.physics.position.y);
        this.audio.sand();
      }

      if (zone.type === 'boost') {
        this.session.flags.usedBoost = true;
        this.physics.addImpulse(normalizeDirection(zone.direction), clamp(zone.strength ?? 1.7, 0.65, 2.15));
        this.effects.pulse(zone.x, zone.z, 0xffe7ad, 0.55);
        this.audio.boost();
      }

      if (zone.type === 'wind') {
        this.session.flags.usedBoost = true;
        this.physics.addImpulse(normalizeDirection(zone.direction), clamp(zone.strength ?? 0.55, 0.2, 0.85));
        this.effects.pulse(zone.x, zone.z, 0xccefff, 0.42, 0.44);
        this.audio.wind();
      }

      if (zone.type === 'bouncePad') {
        this.session.flags.usedBouncePad = true;
        const dir = this.physics.velocity.lengthSq() > 0.05
          ? tmpDirection.copy(this.physics.velocity).normalize()
          : tmpDirection.set(this.physics.position.x - zone.x, this.physics.position.y - zone.z).normalize();
        this.physics.addImpulse(dir, clamp((zone.strength ?? 1.35) * 2.05, 1.2, 3.15));
        this.effects.pulse(zone.x, zone.z, 0xb8f3bf, 0.62);
        this.audio.bouncePad();
        this.cameraRig.addShake(0.08);
      }

      this.zoneCooldowns.set(key, now);
    }
  }

  checkOutOfBounds(delta) {
    if (this.isBallOnCourse() && isInsideFallBounds(this.level, this.physics.position.x, this.physics.position.y)) {
      this.outOfBoundsTimer = 0;
      return;
    }

    this.outOfBoundsTimer += delta;
    if (this.outOfBoundsTimer > 0.42) {
      this.beginOutOfBounds();
    }
  }

  beginOutOfBounds() {
    this.physics.velocity.set(0, 0);
    this.penalties += 1;
    this.shots += 1;
    this.session.flags.fellOut = true;
    if (this.session.mode === GAME_MODES.TIME_TRIAL) {
      this.session.timer.penaltySeconds += 5;
    }
    this.respawnProgress = 0;
    this.outOfBoundsTimer = 0;
    this.setState(STATES.RESPAWNING);
    this.hideAimGuides();
    this.effects.clearTrail();
    this.effects.pulse(this.physics.position.x, this.physics.position.y, 0xd6ad4f, 0.5);
    this.audio.fall();
    this.emitOnlineBallSample(0, false, { penalty: true });
    this.showToast('Out of Bounds +1');
    this.updateUi();
  }

  updateRespawn(delta) {
    this.respawnProgress = Math.min(1, this.respawnProgress + delta * 1.65);
    const t = THREE.MathUtils.smoothstep(this.respawnProgress, 0, 1);
    this.physics.position.lerpVectors(this.physics.position, this.lastSafePosition, t);
    this.ball.material.opacity = 0.45 + t * 0.55;
    this.ball.material.transparent = t < 1;
    this.updateBallMesh(delta);

    if (this.respawnProgress >= 1) {
      this.physics.position.copy(this.lastSafePosition);
      this.physics.velocity.set(0, 0);
      this.ball.material.transparent = false;
      this.ball.material.opacity = 1;
      this.setState(STATES.READY);
    }
  }

  loadLevel(index, { showToast = true } = {}) {
    try {
      this.levelIndex = clamp(index, 0, LEVELS.length - 1);
      this.level = LEVELS[this.levelIndex] ?? LEVELS[0];
      if (!this.level?.start || !this.level?.hole) throw new Error(`Invalid level at index ${index}`);
      this.selectedPackId = getPackForLevel(this.level.id).id;
      this.applyCourseTheme();
      this.shots = 0;
      this.penalties = 0;
      this.power = 0;
      this.sinkProgress = 0;
      this.respawnProgress = 0;
      this.previewTimer = 0;
      this.outOfBoundsTimer = 0;
      this.pointerActive = false;
      this.orbitDragging = false;
      this.zoneCooldowns.clear();
      this.flagMeshes = [];
      this.stopReplay();
      this.physics.setLevel(this.level);
      this.physics.reset(this.level.start);
      this.lastSafePosition.set(this.level.start.x, this.level.start.z);
      this.lastBallPosition.copy(this.physics.position);
      this.hideAimGuides();
      this.effects?.clearTrail();
      this.rebuildCourse();
      this.updateBallMesh(0);
      this.ghostRecorder = createGhostRecorder(this.level.id);
      this.updateGhostVisual();
      this.updateUi();
      this.buildLevelGrid();
      if (showToast) this.showToast(this.level.name);
    } catch (error) {
      console.error('[Ivory Golf Royale 3D] Level load failed:', error);
      this.setState(STATES.MENU);
      this.showToast('Level failed to load. Returned to menu.');
    }
  }

  startLevel(index) {
    const level = LEVELS[index] ?? LEVELS[0];
    if (!this.isLevelUnlocked(level)) return;
    const pack = getPackForLevel(level.id);
    this.session = createSession(GAME_MODES.SOLO_LEVEL, {
      packId: pack.id,
      levelIds: [level.id],
      actors: [{ id: 'player', name: this.getSavedPlayerName('solo', 'Player'), type: 'human', holes: [] }],
      aimAssist: this.settings.aimAssist
    });
    emitGameHubEvent('game_started', { mode: GAME_MODES.SOLO_LEVEL, packId: pack.id, levelId: level.id });
    this.startSessionHole(index);
  }

  applyCourseTheme() {
    if (this.level.theme === 'sky') {
      this.scene.background = new THREE.Color(0xdff4ff);
      this.scene.fog = new THREE.Fog(0xdff4ff, 16, 46);
      return;
    }
    this.scene.background = new THREE.Color(0xe8edf1);
    this.scene.fog = new THREE.Fog(0xe8edf1, 18, 42);
  }

  startSessionHole(index, { showToast = true } = {}) {
    this.resetTransientStateForModeStart();
    this.closeAllPanels();
    this.ui.completeModal.classList.remove('is-visible');
    this.ui.completeModal.setAttribute('aria-hidden', 'true');
    this.ui.resultModal.classList.remove('is-visible');
    this.ui.resultModal.setAttribute('aria-hidden', 'true');
    resetHoleFlags(this.session, this.settings.aimAssist);
    this.loadLevel(index, { showToast });
    this.startPreview();
  }

  resetTransientStateForModeStart() {
    this.pointerActive = false;
    this.orbitDragging = false;
    this.online.awaitingShot = false;
    this.online.sampleTimer = 0;
    this.botTimer = 0;
    this.botPlan = null;
    this.power = 0;
    this.sinkProgress = 0;
    this.respawnProgress = 0;
    this.outOfBoundsTimer = 0;
    this.shotReplayRecorder = null;
    this.completingHole = false;
    this.zoneCooldowns.clear();
    this.hideAimGuides();
    this.stopReplay();
    this.hideVsIntro();
    this.effects?.clearTrail();
    if (this.opponentBall) this.opponentBall.visible = false;
    this.ui.turnBanner?.classList.remove('is-visible');
  }

  startPreview() {
    this.previewTimer = 2.15;
    this.ui.previewKicker.textContent = `Level ${this.level.id}`;
    this.ui.previewTitle.textContent = this.level.name;
    this.ui.previewPar.textContent = `Par ${this.level.par}`;
    this.setState(STATES.PREVIEW);
  }

  finishPreview() {
    if (this.state !== STATES.PREVIEW) return;
    this.previewTimer = 0;
    this.setState(STATES.READY);
    if (this.session.mode === GAME_MODES.TIME_TRIAL) {
      this.session.timer.active = true;
      this.session.timer.started = true;
    }
    if (this.isBotTurn()) {
      this.scheduleBotShot();
    }
  }

  restartLevel() {
    this.ui.completeModal.classList.remove('is-visible');
    this.ui.completeModal.setAttribute('aria-hidden', 'true');
    this.ui.resultModal.classList.remove('is-visible');
    this.ui.resultModal.setAttribute('aria-hidden', 'true');
    this.setState(STATES.RESTARTING);
    if (this.session.mode === GAME_MODES.TIME_TRIAL) {
      this.session.timer.active = false;
    }
    this.startSessionHole(this.levelIndex);
  }

  nextLevel() {
    const nextIndex = this.levelIndex === LEVELS.length - 1 ? this.levelIndex : this.levelIndex + 1;
    this.startLevel(nextIndex);
  }

  rebuildCourse() {
    disposeObjectTree(this.courseGroup);
    this.scene.remove(this.courseGroup);
    this.courseGroup = new THREE.Group();
    this.scene.add(this.courseGroup);

    const { platform } = this.level;
    const base = new THREE.Mesh(new THREE.BoxGeometry(platform.w, 0.34, platform.d), this.materials.marble);
    base.position.set(platform.x, -0.12, platform.z);
    base.castShadow = true;
    base.receiveShadow = true;
    this.courseGroup.add(base);

    const bevel = new THREE.Mesh(new THREE.BoxGeometry(platform.w + 0.4, 0.16, platform.d + 0.4), this.materials.marbleEdge);
    bevel.position.set(platform.x, -0.25, platform.z);
    bevel.receiveShadow = true;
    this.courseGroup.add(bevel);

    for (const area of this.level.playAreas) this.addPlayArea(area);
    for (const zone of this.level.zones ?? []) this.addZone(zone);
    for (const wall of this.level.walls) this.addRail(wall);
    for (const obstacle of this.level.obstacles ?? []) this.addObstacle(obstacle);

    this.addCupAndFlag();
    this.addMarkers();
    this.addDecor(platform);
    this.obstacles.attach(this.courseGroup);
    this.obstacles.load(this.level);
  }

  addPlayArea(area) {
    if (area.ramp) {
      const y1 = area.ramp.startH;
      const y2 = area.ramp.endH;
      const x1 = area.x - area.w / 2;
      const x2 = area.x + area.w / 2;
      const z1 = area.z - area.d / 2;
      const z2 = area.z + area.d / 2;
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array([x1, y1 + 0.035, z1, x2, y1 + 0.035, z1, x2, y2 + 0.035, z2, x1, y2 + 0.035, z2]), 3)
      );
      geometry.setIndex([0, 1, 2, 0, 2, 3]);
      geometry.computeVertexNormals();
      const mesh = new THREE.Mesh(geometry, this.materials.greenLight);
      mesh.receiveShadow = true;
      this.courseGroup.add(mesh);
      return;
    }

    const mesh = new THREE.Mesh(new THREE.BoxGeometry(area.w, 0.08, area.d), area.h > 0 ? this.materials.greenLight : this.materials.green);
    mesh.position.set(area.x, area.h + 0.02, area.z);
    mesh.receiveShadow = true;
    mesh.castShadow = area.h > 0.1;
    this.courseGroup.add(mesh);
  }

  addZone(zone) {
    const mesh = createZoneMesh(zone, this.materials);
    mesh.position.y = this.heightAt(zone.x, zone.z) + 0.075;
    this.courseGroup.add(mesh);
    const marker = createZoneMarker(zone, this.materials);
    if (marker) {
      marker.position.y = this.heightAt(zone.x, zone.z) + 0.08;
      this.courseGroup.add(marker);
    }
  }

  addRail([x1, z1, x2, z2]) {
    const dx = x2 - x1;
    const dz = z2 - z1;
    const length = Math.hypot(dx, dz);
    const midX = (x1 + x2) / 2;
    const midZ = (z1 + z2) / 2;
    const height = Math.max(this.heightAt(midX, midZ), 0);

    const rail = new THREE.Mesh(new THREE.BoxGeometry(length + 0.22, 0.38, 0.26), this.materials.gold);
    rail.position.set(midX, height + 0.23, midZ);
    rail.rotation.y = -Math.atan2(dz, dx);
    rail.castShadow = true;
    rail.receiveShadow = true;
    this.courseGroup.add(rail);

    const capGeometry = new THREE.CylinderGeometry(0.14, 0.14, 0.38, 18);
    for (const [x, z] of [[x1, z1], [x2, z2]]) {
      const cap = new THREE.Mesh(capGeometry, this.materials.deepGold);
      cap.position.set(x, this.heightAt(x, z) + 0.23, z);
      cap.castShadow = true;
      this.courseGroup.add(cap);
    }
  }

  addObstacle(obstacle) {
    if (obstacle.type === 'box') {
      const box = new THREE.Mesh(new THREE.BoxGeometry(obstacle.w, 0.42, obstacle.d), this.materials.gold);
      box.position.set(obstacle.x, this.heightAt(obstacle.x, obstacle.z) + 0.25, obstacle.z);
      box.rotation.y = obstacle.rotation ?? 0;
      box.castShadow = true;
      box.receiveShadow = true;
      this.courseGroup.add(box);
      return;
    }

    if (obstacle.type !== 'circle') return;
    const height = this.heightAt(obstacle.x, obstacle.z);
    const material = obstacle.visual === 'gold-post' ? this.materials.gold : this.materials.marbleEdge;
    const post = new THREE.Mesh(new THREE.CylinderGeometry(obstacle.r, obstacle.r * 0.92, 0.56, 36), material);
    post.position.set(obstacle.x, height + 0.28, obstacle.z);
    post.castShadow = true;
    post.receiveShadow = true;
    this.courseGroup.add(post);

    const crown = new THREE.Mesh(new THREE.CylinderGeometry(obstacle.r * 1.05, obstacle.r * 0.85, 0.08, 36), this.materials.gold);
    crown.position.set(obstacle.x, height + 0.61, obstacle.z);
    crown.castShadow = true;
    this.courseGroup.add(crown);
  }

  addCupAndFlag() {
    const { hole } = this.level;
    const height = this.heightAt(hole.x, hole.z);

    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.055, 48), this.materials.cup);
    cup.position.set(hole.x, height + 0.065, hole.z);
    cup.receiveShadow = true;
    this.courseGroup.add(cup);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.39, 0.026, 12, 54), this.materials.deepGold);
    ring.position.set(hole.x, height + 0.098, hole.z);
    ring.rotation.x = Math.PI / 2;
    ring.castShadow = true;
    this.courseGroup.add(ring);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.28, 16), this.materials.gold);
    pole.position.set(hole.x + 0.46, height + 0.71, hole.z - 0.16);
    pole.castShadow = true;
    this.courseGroup.add(pole);

    const flagGeometry = new THREE.BufferGeometry();
    flagGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0.22, 0, 0.78, 0.05, 0, 0, -0.12, 0]), 3));
    flagGeometry.setIndex([0, 1, 2]);
    flagGeometry.computeVertexNormals();
    const flagCosmetic = getCosmetic(COSMETIC_TYPES.FLAG, storage.getCosmetics().equipped.flag);
    const flag = new THREE.Mesh(
      flagGeometry,
      new THREE.MeshStandardMaterial({ color: flagCosmetic?.color ?? 0xfff2bf, roughness: 0.42, metalness: 0.2, side: THREE.DoubleSide })
    );
    flag.userData.disposeMaterial = true;
    flag.position.set(hole.x + 0.5, height + 1.18, hole.z - 0.16);
    flag.rotation.y = -0.28;
    flag.castShadow = true;
    flag.userData.baseY = flag.position.y;
    this.flagMeshes.push(flag);
    this.courseGroup.add(flag);
  }

  addMarkers() {
    const startHeight = this.heightAt(this.level.start.x, this.level.start.z);
    const startRing = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.5, 42), this.materials.markerStart);
    startRing.position.set(this.level.start.x, startHeight + 0.09, this.level.start.z);
    startRing.rotation.x = Math.PI / 2;
    this.courseGroup.add(startRing);

    const holeHeight = this.heightAt(this.level.hole.x, this.level.hole.z);
    const holeGlow = new THREE.Mesh(new THREE.RingGeometry(0.54, 0.62, 42), this.materials.markerHole);
    holeGlow.position.set(this.level.hole.x, holeHeight + 0.105, this.level.hole.z);
    holeGlow.rotation.x = Math.PI / 2;
    this.courseGroup.add(holeGlow);
  }

  addDecor(platform) {
    const preset = QUALITY_PRESETS[this.settings.graphicsQuality] ?? QUALITY_PRESETS.high;
    const cornerGeometry = new THREE.CylinderGeometry(0.22, 0.26, 0.48, 24);
    const x = platform.w / 2 - 0.55;
    const z = platform.d / 2 - 0.55;
    for (const [px, pz] of [[-x, -z], [x, -z], [-x, z], [x, z]]) {
      const pillar = new THREE.Mesh(cornerGeometry, this.materials.marbleEdge);
      pillar.position.set(px, 0.22, pz);
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      this.courseGroup.add(pillar);
    }
    if (this.level.theme === 'sky' && preset.decorationDensity > 0.4) {
      const cloudMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.36, depthWrite: false });
      const count = preset.decorationDensity > 0.9 ? 7 : 4;
      for (let i = 0; i < count; i += 1) {
        const cloud = new THREE.Mesh(new THREE.SphereGeometry(0.38 + (i % 3) * 0.12, 16, 10), cloudMaterial);
        cloud.userData.disposeMaterial = i === count - 1;
        const side = i % 2 === 0 ? -1 : 1;
        cloud.position.set(side * (platform.w / 2 + 0.8 + (i % 3) * 0.45), -0.02 + (i % 2) * 0.12, -platform.d / 2 + 2.2 + i * 2.0);
        cloud.scale.set(1.8, 0.34, 0.72);
        this.courseGroup.add(cloud);
      }
    }
  }

  updateBallMesh(delta) {
    const height = this.heightAt(this.physics.position.x, this.physics.position.y);
    const sink = this.state === STATES.COMPLETE ? THREE.MathUtils.smoothstep(this.sinkProgress, 0, 1) : 0;
    this.ball.position.set(this.physics.position.x, height + BALL_RADIUS - sink * 0.35, this.physics.position.y);

    const movement = tmpDirection.copy(this.physics.position).sub(this.lastBallPosition);
    if (movement.lengthSq() > 0.000001) {
      const axis = tmpVector3.set(movement.y, 0, -movement.x).normalize();
      this.ball.rotateOnWorldAxis(axis, movement.length() / BALL_RADIUS);
      this.lastBallPosition.copy(this.physics.position);
    }

    if (sink > 0) {
      this.ball.scale.setScalar(1 - sink * 0.38);
    } else {
      this.ball.scale.lerp(tmpVector3.setScalar(1), 1 - Math.exp(-delta * 14));
    }
  }

  onPointerDown(event) {
    if (this.state === STATES.PREVIEW) {
      this.finishPreview();
      return;
    }
    if (this.state !== STATES.READY) return;
    if (this.currentActor()?.type === 'bot') return;
    if (this.isOnlineMode() && !this.isMyOnlineTurn()) {
      this.showToast("Opponent's turn");
      return;
    }

    this.pointerLast.x = event.clientX;
    this.pointerLast.y = event.clientY;
    const nearBall = this.isPointerNearBall(event);
    const wantsOrbit = event.button === 2 || (this.cameraRig.mode === 'orbit' && !nearBall);

    if (wantsOrbit) {
      this.orbitDragging = true;
      this.canvas.setPointerCapture(event.pointerId);
      return;
    }

    this.canvas.setPointerCapture(event.pointerId);
    this.pointerActive = true;
    this.setState(STATES.AIMING);
    this.updateAimFromPointer(event);
  }

  onPointerMove(event) {
    if (this.orbitDragging) {
      const dx = event.clientX - this.pointerLast.x;
      const dy = event.clientY - this.pointerLast.y;
      this.cameraRig.orbit(-dx * 0.006, -dy * 0.004);
      this.pointerLast.x = event.clientX;
      this.pointerLast.y = event.clientY;
      return;
    }

    if (!this.pointerActive || this.state !== STATES.AIMING) return;
    this.updateAimFromPointer(event);
  }

  onPointerUp(event) {
    if (this.orbitDragging) {
      this.orbitDragging = false;
      this.canvas.releasePointerCapture(event.pointerId);
      return;
    }

    if (!this.pointerActive || this.state !== STATES.AIMING) return;
    this.pointerActive = false;
    this.canvas.releasePointerCapture(event.pointerId);

    if (this.power < 0.07) {
      this.power = 0;
      this.setState(STATES.READY);
      this.hideAimGuides();
      this.updateUi();
      return;
    }

    this.requestShot();
  }

  cancelPointer() {
    this.pointerActive = false;
    this.orbitDragging = false;
    if (this.state === STATES.AIMING) {
      this.power = 0;
      this.setState(STATES.READY);
      this.hideAimGuides();
      this.updateUi();
    }
  }

  isPointerNearBall(event) {
    const projected = this.ball.position.clone().project(this.camera);
    const sx = (projected.x * 0.5 + 0.5) * window.innerWidth;
    const sy = (-projected.y * 0.5 + 0.5) * window.innerHeight;
    return Math.hypot(event.clientX - sx, event.clientY - sy) < 128;
  }

  updateAimFromPointer(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    this.raycaster.ray.intersectPlane(rayPlane, pointerWorld);

    const dx = this.physics.position.x - pointerWorld.x;
    const dz = this.physics.position.y - pointerWorld.z;
    const distance = Math.hypot(dx, dz);
    if (distance > 0.001) {
      this.aimDirection.set(dx / distance, dz / distance);
      this.power = clamp(distance / 3.75, 0, 1);
    }
    this.updateUi();
  }

  requestShot() {
    if (this.isOnlineMode()) {
      if (!this.online.match?.id || !this.online.turn?.id) {
        this.showToast('Online turn is not ready yet');
        this.setState(STATES.READY);
        return;
      }
      if (!this.isMyOnlineTurn() || this.online.awaitingShot) {
        this.showToast('Waiting for your online turn');
        this.setState(STATES.READY);
        return;
      }
      const sent = this.onlineClient.submitShot({
        matchId: this.online.match?.id,
        turnId: this.online.turn?.id,
        direction: { x: this.aimDirection.x, z: this.aimDirection.y },
        power: this.power,
        clientShotId: `shot-${Date.now()}`
      });
      if (sent) {
        this.online.awaitingShot = true;
        this.showToast('Shot sent');
      } else {
        this.setState(STATES.READY);
      }
      return;
    }
    this.applyAcceptedShot(this.aimDirection, this.power);
  }

  shoot() {
    this.requestShot();
  }

  applyAcceptedShot(direction = this.aimDirection, power = this.power, { countShot = true } = {}) {
    this.aimDirection.copy(direction);
    this.power = power;
    if (countShot) {
      this.shots += 1;
      this.recordShotTaken();
    }
    this.online.awaitingShot = false;
    this.audio.hit(this.power);
    this.effects.pulse(this.physics.position.x, this.physics.position.y, 0xf7d178, 0.35 + this.power * 0.45);
    if (this.power > 0.72) this.cameraRig.addShake(0.07 + this.power * 0.08);
    this.physics.shoot(this.aimDirection, this.power);
    this.shotReplayRecorder = createShotReplay({
      levelId: this.level.id,
      packId: this.session.packId ?? this.selectedPackId,
      direction: this.aimDirection,
      power: this.power
    });
    this.power = 0;
    this.setState(STATES.MOVING);
    this.hideAimGuides();
    this.updateUi();
  }

  updateAimGuides() {
    if (!this.settings.aimAssist || (this.state !== STATES.AIMING && this.state !== STATES.READY)) {
      this.hideAimGuides();
      return;
    }
    if (this.state === STATES.READY && this.power <= 0) {
      this.hideAimGuides();
      return;
    }

    const height = this.heightAt(this.physics.position.x, this.physics.position.y) + 0.08;
    const start = new THREE.Vector3(this.physics.position.x, height, this.physics.position.y);
    const length = 1.05 + this.power * 3.45;
    const end = new THREE.Vector3(this.physics.position.x + this.aimDirection.x * length, height + 0.025, this.physics.position.y + this.aimDirection.y * length);
    updateReusableLine(this.aimLine, [start, end]);
    this.aimLine.material.opacity = 0.38 + this.power * 0.56;

    const prediction = this.physics.simulatePath(this.aimDirection, Math.max(this.power, 0.08), this.level, 46, this.obstacles.getColliders());
    const predictionPoints = prediction.map((point) => new THREE.Vector3(point.x, this.heightAt(point.x, point.z) + 0.075, point.z));
    updateReusableLine(this.predictionLine, predictionPoints);
  }

  hideAimGuides() {
    this.aimLine.visible = false;
    this.predictionLine.visible = false;
  }

  handleBounce(point, intensity, kind = 'wall') {
    this.session.flags.noWallTouch = false;
    if (kind === 'movingObstacle') this.audio.obstacle(intensity);
    else this.audio.wall(intensity);
    this.effects.pulse(point.x, point.z, kind === 'movingObstacle' ? 0xffd37a : 0xffefbf, 0.22 + intensity * 0.35);
  }

  beginHoleSuccess() {
    if (this.completingHole || this.state === STATES.COMPLETE) return;
    this.completingHole = true;
    this.physics.velocity.set(0, 0);
    this.physics.position.set(this.level.hole.x, this.level.hole.z);
    this.sinkProgress = 0;
    this.setState(STATES.COMPLETE);
    this.hideAimGuides();
    this.effects.clearTrail();
    this.audio.hole();
    const cupEffect = getCosmetic(COSMETIC_TYPES.CUP, storage.getCosmetics().equipped.cup);
    this.effects.pulse(this.level.hole.x, this.level.hole.z, cupEffect?.color ?? 0xfff1b5, this.shots === 1 ? 1.0 : 0.7);
    this.effects.sparkles(this.level.hole.x, this.level.hole.z);
    if (this.shots === 1 && this.penalties === 0) {
      this.showTurnBanner('HOLE IN ONE');
      this.cameraRig.addShake(0.12);
    }
    setTimeout(() => this.completeLevel(), 760);
  }

  completeLevel() {
    if (this.state !== STATES.COMPLETE || !this.completingHole) return;
    this.completingHole = false;
    const stars = this.calculateStars();
    if (this.isOnlineMode()) {
      if (!this.online.match?.id || !this.online.turn?.id) {
        this.showToast('Online result could not be sent');
        this.setState(STATES.READY);
        return;
      }
      this.onlineClient.completeHole({
        matchId: this.online.match?.id,
        turnId: this.online.turn?.id,
        levelId: this.level.id,
        penalties: this.penalties,
        finalBall: { x: this.physics.position.x, z: this.physics.position.y },
        holed: true
      });
      this.showToast('Hole result sent');
      return;
    }
    const result = {
      levelId: this.level.id,
      levelName: this.level.name,
      packId: this.session.packId ?? getPackForLevel(this.level.id).id,
      packName: this.packLabel(this.session.packId ?? getPackForLevel(this.level.id).id),
      par: this.level.par,
      shots: this.shots,
      penalties: this.penalties,
      stars,
      flags: { ...this.session.flags },
      actorId: this.currentActor()?.id ?? 'player',
      actorName: this.currentActor()?.name ?? 'Player'
    };
    this.handleHoleComplete(result);
  }

  currentActor() {
    return this.session.actors[this.session.actorIndex] ?? this.session.actors[0];
  }

  isBotTurn() {
    return this.currentActor()?.type === 'bot' && this.state === STATES.READY;
  }

  recordShotTaken() {
    const actor = this.currentActor();
    if (actor?.type === 'bot') return;
    if (this.session.mode === GAME_MODES.PRACTICE) {
      storage.updateStats((stats) => {
        stats.totalPracticeShots += 1;
      });
    } else {
      storage.updateStats((stats) => {
        stats.totalShots += 1;
      });
      this.unlockAchievement('first-putt');
    }
    this.buildProfilePanel();
  }

  commitLevelProgress(result, { saveBest = true } = {}) {
    let bestResult = { best: this.bestScores[String(result.levelId)], improved: false };
    if (saveBest) {
      bestResult = storage.setBestScore(result.levelId, result.shots, result.penalties, result.stars);
      if (bestResult.improved && this.ghostRecorder?.samples?.length) {
        storage.saveGhost(
          result.levelId,
          makeGhostRecord(result.levelId, result.shots, result.penalties, this.ghostRecorder.samples)
        );
        this.audio.newBest();
      }
      const pack = getPackForLevel(result.levelId);
      const packIndex = pack.levelIds.indexOf(result.levelId);
      if (pack.id === 'ivory-garden') {
        this.unlockedLevel = Math.max(this.unlockedLevel, Math.min(LEVELS.length, result.levelId + 1));
        storage.setUnlockedLevel(this.unlockedLevel);
      }
      if (packIndex >= 0) {
        storage.setUnlockedForPack(pack.id, Math.min(pack.levelIds.length, packIndex + 2));
      }
    }

    this.bestScores = storage.getBestScores();
    this.buildLevelGrid();
    this.updateUi();
    this.updateGhostVisual();
    return bestResult;
  }

  updateStatsForHole(result) {
    const levelId = String(result.levelId);
    storage.updateStats((stats) => {
      stats.holesCompleted += 1;
      if (result.shots === 1) stats.holeInOnes += 1;
      stats.totalStars = totalStarsFromScores(storage.getBestScores());
      stats.levelCompletions[levelId] = (stats.levelCompletions[levelId] ?? 0) + 1;
      let favorite = null;
      for (const [id, count] of Object.entries(stats.levelCompletions)) {
        if (!favorite || count > favorite.count) favorite = { id, count };
      }
      stats.favoriteLevel = favorite ? `Level ${favorite.id}` : null;
    });
    this.buildProfilePanel();
  }

  handleHoleComplete(result) {
    this.session.timer.active = false;
    const actor = this.currentActor();
    const humanResult = actor?.type !== 'bot';
    const saveBest = humanResult && this.session.mode !== GAME_MODES.PRACTICE;
    const bestResult = this.commitLevelProgress(result, { saveBest });
    const replay = finalizeShotReplay(this.shotReplayRecorder, result);
    if (replay && humanResult) {
      storage.saveShotReplay(result.levelId, replay, { best: bestResult.improved });
    }

    if (humanResult && this.session.mode !== GAME_MODES.PRACTICE) {
      this.updateStatsForHole(result);
      this.evaluateAchievements(result);
      this.evaluateDailyChallenge(result);
    }

    this.audio.complete();
    if (result.shots === 1) this.audio.holeInOne();
    for (let i = 0; i < result.stars; i += 1) {
      setTimeout(() => this.audio.star(i), 180 + i * 160);
    }

    if (this.session.mode === GAME_MODES.SOLO_LEVEL) {
      this.showSingleLevelComplete(result, bestResult);
      return;
    }

    if (this.session.mode === GAME_MODES.PRACTICE) {
      this.showModeResult({
        title: `Practice: ${this.level.name}`,
        subtitle: 'Practice hole complete',
        holes: [result],
        nextText: 'Practice Again',
        retryText: 'Restart',
        onNext: () => this.startSessionHole(this.levelIndex),
        onRetry: () => this.startSessionHole(this.levelIndex)
      });
      return;
    }

    if (actor) actor.holes.push(result);
    if ([GAME_MODES.SOLO_COURSE, GAME_MODES.TIME_TRIAL, GAME_MODES.CHALLENGE].includes(this.session.mode)) {
      this.session.holes.push(result);
    }

    if (this.session.mode === GAME_MODES.CHALLENGE) {
      this.resolveChallenge(result);
      return;
    }

    if (this.session.mode === GAME_MODES.LOCAL_TWO) {
      this.resolveLocalTurn(result);
      return;
    }

    if (this.session.mode === GAME_MODES.VS_BOT) {
      this.resolveBotMatchTurn(result);
      return;
    }

    if (this.session.mode === GAME_MODES.TIME_TRIAL) {
      this.resolveTimeTrialHole(result);
      return;
    }

    this.resolveCourseHole(result);
  }

  showSingleLevelComplete(result, bestResult) {
    this.ui.completeTitle.textContent = `Level ${this.level.id}: ${this.level.name}`;
    this.ui.completeStars.innerHTML = starEntities(result.stars);
    this.ui.completeStars.classList.remove('is-revealing');
    void this.ui.completeStars.offsetWidth;
    this.ui.completeStars.classList.add('is-revealing');
    this.ui.completeShots.textContent = String(result.shots);
    this.ui.completePar.textContent = String(this.level.par);
    this.ui.completePenalties.textContent = String(result.penalties);
    this.ui.completeBest.textContent = bestLabel(bestResult.best);
    this.ui.newBestBadge.classList.toggle('is-visible', bestResult.improved);
    this.ui.nextButton.textContent = this.levelIndex === LEVELS.length - 1 ? 'Play Again' : 'Next Level';
    this.setShareResult({
      kind: 'level',
      coursePack: result.packName ?? this.packLabel(result.packId),
      levelName: result.levelName,
      shots: result.shots,
      par: result.par,
      stars: result.stars,
      best: bestLabel(bestResult.best)
    });
    emitGameHubEvent('level_completed', { levelId: result.levelId, packId: result.packId, shots: result.shots, penalties: result.penalties, stars: result.stars });
    this.ui.completeModal.classList.add('is-visible');
    this.ui.completeModal.setAttribute('aria-hidden', 'false');
  }

  showModeResult({ title, subtitle, holes, rank, bestLabel: best, timeMs, penaltySeconds, winner, stars, nextText = 'Continue', retryText = 'Retry', onNext, onRetry }) {
    this.pendingContinue = onNext ?? null;
    this.pendingRetry = onRetry ?? (() => this.retryCurrentMode());
    this.ui.resultContent.innerHTML = resultSummaryHtml({ title, subtitle, holes, rank, bestLabel: best, timeMs, penaltySeconds, winner, stars });
    this.ui.resultNext.textContent = nextText;
    this.ui.resultRetry.textContent = retryText;
    this.ui.resultNext.style.display = onNext ? '' : 'none';
    const totals = holes?.length ? totalsForHoles(holes) : null;
    this.setShareResult({
      kind: title?.includes('Match') || winner ? 'match' : 'course',
      coursePack: this.packLabel(this.session.packId),
      courseLength: this.session.courseLength,
      levelName: holes?.[0]?.levelName,
      winner: winner ?? title,
      score: totals ? `${totals.shots + totals.penalties}` : best ?? '--',
      stars: stars ?? totals?.stars ?? 0
    });
    this.ui.resultModal.classList.add('is-visible');
    this.ui.resultModal.setAttribute('aria-hidden', 'false');
  }

  continueSession() {
    this.ui.resultModal.classList.remove('is-visible');
    this.ui.resultModal.setAttribute('aria-hidden', 'true');
    const action = this.pendingContinue;
    this.pendingContinue = null;
    if (action) action();
  }

  retryCurrentMode() {
    this.ui.resultModal.classList.remove('is-visible');
    this.ui.resultModal.setAttribute('aria-hidden', 'true');
    if (this.pendingRetry) {
      const retry = this.pendingRetry;
      this.pendingRetry = null;
      retry();
      return;
    }
    this.restartLevel();
  }

  returnToModeSelect() {
    this.ui.resultModal.classList.remove('is-visible');
    this.ui.resultModal.setAttribute('aria-hidden', 'true');
    this.resetTransientStateForModeStart();
    this.online.match = null;
    this.online.turn = null;
    this.online.lastMatchComplete = null;
    this.ui.onlineScoreboard?.classList.remove('is-visible');
    this.setState(STATES.MENU);
    this.openPanel('modePanel');
  }

  resolveCourseHole() {
    const complete = this.session.currentHoleIndex >= this.session.levelIds.length - 1;
    if (!complete) {
      this.showModeResult({
        title: `Hole ${this.session.currentHoleIndex + 1} Complete`,
        subtitle: MODE_LABELS[this.session.mode],
        holes: this.session.holes,
        nextText: 'Next Hole',
        onNext: () => {
          this.session.currentHoleIndex += 1;
          const levelId = this.session.levelIds[this.session.currentHoleIndex];
          this.startSessionHole(getLevelIndexById(levelId));
        },
        onRetry: () => this.restartMode()
      });
      return;
    }

    const totals = totalsForHoles(this.session.holes);
    const rank = rankForCourse(totals.shots, totals.penalties, totals.par);
    const scope = getCourseScopeId(this.session.packId, this.session.courseLength);
    const best = storage.setCourseBest(scope, { ...totals, rank, date: new Date().toISOString() });
    storage.updateStats((stats) => {
      const score = totals.shots + totals.penalties;
      stats.bestCourseScore = stats.bestCourseScore == null ? score : Math.min(stats.bestCourseScore, score);
    });
    this.audio.courseComplete();
    if (this.session.courseLength === 3 && totals.stars >= 9) this.unlockAchievement('perfect-3');
    storage.addMatchHistory({
      category: 'solo',
      mode: 'Solo Course',
      date: new Date().toISOString(),
      coursePack: this.packLabel(this.session.packId),
      players: [this.currentActor()?.name ?? this.getSavedPlayerName('solo', 'Player')],
      courseLength: this.session.courseLength,
      winner: `Rank ${rank}`,
      finalScore: `${totals.shots + totals.penalties} adjusted shots`,
      replayKey: `level:${this.session.holes.at(-1)?.levelId ?? ''}`
    });
    this.buildHistoryPanel();
    emitGameHubEvent('match_completed', { mode: GAME_MODES.SOLO_COURSE, packId: this.session.packId, length: this.session.courseLength, score: totals.shots + totals.penalties, rank });
    this.showModeResult({
      title: `${this.packLabel(this.session.packId)} ${this.session.courseLength}-Hole Complete`,
      subtitle: `Rank ${rank}${best.improved ? ' | New best' : ''}`,
      holes: this.session.holes,
      rank,
      bestLabel: `${best.best.shots + best.best.penalties}`,
      nextText: null,
      onNext: null,
      onRetry: () => this.restartMode()
    });
  }

  resolveTimeTrialHole() {
    const complete = this.session.currentHoleIndex >= this.session.levelIds.length - 1;
    if (!complete) {
      this.showModeResult({
        title: `Split ${this.session.currentHoleIndex + 1}`,
        subtitle: `Time Trial | ${formatTime(this.session.timer.elapsedMs)}`,
        holes: this.session.holes,
        timeMs: this.session.timer.elapsedMs,
        penaltySeconds: this.session.timer.penaltySeconds,
        nextText: 'Next Hole',
        onNext: () => {
          this.session.currentHoleIndex += 1;
          const levelId = this.session.levelIds[this.session.currentHoleIndex];
          this.startSessionHole(getLevelIndexById(levelId));
        },
        onRetry: () => this.restartMode()
      });
      return;
    }

    const scope = this.session.levelIds.length === 1
      ? `single:${this.session.levelIds[0]}`
      : `course:${this.session.packId}:${this.session.courseLength}`;
    const totalMs = this.session.timer.elapsedMs;
    const best = storage.setBestTime(scope, {
      timeMs: totalMs,
      penaltySeconds: this.session.timer.penaltySeconds,
      date: new Date().toISOString()
    });
    storage.updateStats((stats) => {
      const adjusted = totalMs + this.session.timer.penaltySeconds * 1000;
      stats.bestTimeTrialMs = stats.bestTimeTrialMs == null ? adjusted : Math.min(stats.bestTimeTrialMs, adjusted);
    });
    if (this.session.levelIds.length === 1 && totalMs + this.session.timer.penaltySeconds * 1000 < 45000) {
      this.unlockAchievement('speed-runner');
    }
    storage.addMatchHistory({
      category: 'time trial',
      mode: 'Time Trial',
      date: new Date().toISOString(),
      coursePack: this.packLabel(this.session.packId),
      players: [this.currentActor()?.name ?? this.getSavedPlayerName('solo', 'Player')],
      courseLength: this.session.courseLength,
      winner: best.improved ? 'New best time' : 'Finished',
      finalScore: formatTime(totalMs + this.session.timer.penaltySeconds * 1000),
      replayKey: this.session.levelIds.length === 1 ? `level:${this.session.levelIds[0]}` : null
    });
    this.buildHistoryPanel();
    this.showModeResult({
      title: 'Time Trial Complete',
      subtitle: best.improved ? 'New best time' : 'Final time',
      holes: this.session.holes,
      timeMs: totalMs,
      penaltySeconds: this.session.timer.penaltySeconds,
      bestLabel: formatTime(best.best.timeMs + (best.best.penaltySeconds ?? 0) * 1000),
      nextText: null,
      onNext: null,
      onRetry: () => this.restartMode()
    });
  }

  resolveChallenge(result) {
    const challenge = getChallenge(this.session.challengeId);
    const complete = this.session.currentHoleIndex >= this.session.levelIds.length - 1;
    if (!complete) {
      this.showModeResult({
        title: `Challenge Hole ${this.session.currentHoleIndex + 1}`,
        subtitle: challenge.title,
        holes: this.session.holes,
        winner: challenge.objective,
        nextText: 'Next Challenge Hole',
        onNext: () => {
          this.session.currentHoleIndex += 1;
          this.startSessionHole(getLevelIndexById(this.session.levelIds[this.session.currentHoleIndex]));
        },
        onRetry: () => this.startChallenge(challenge.id, this.currentActor()?.name)
      });
      return;
    }
    const passed = challenge.isMet({ result, level: this.level, session: this.session });
    const changed = passed ? storage.setChallengeCompleted(challenge.id) : false;
    if (passed) {
      this.audio.challengeSuccess();
      if (changed) this.showToast('Challenge complete');
    } else {
      this.audio.challengeFail();
    }
    this.buildChallengeSetup();
    this.buildProfilePanel();
    this.showModeResult({
      title: passed ? 'Challenge Complete' : 'Challenge Failed',
      subtitle: challenge.title,
      holes: this.session.holes.length ? this.session.holes : [result],
      winner: challenge.objective,
      nextText: 'Challenge List',
      retryText: 'Retry Challenge',
      onNext: () => {
        this.setState(STATES.MENU);
        this.openModeSetup(GAME_MODES.CHALLENGE);
      },
      onRetry: () => this.startChallenge(challenge.id, this.currentActor()?.name)
    });
  }

  resolveLocalTurn() {
    const player = this.currentActor();
    const nextActorIndex = this.session.actorIndex + 1;
    if (nextActorIndex < this.session.actors.length) {
      this.showModeResult({
        title: `${player.name} Finished Hole ${this.session.currentHoleIndex + 1}`,
        subtitle: 'Pass and play',
        holes: player.holes,
        winner: `${this.session.actors[nextActorIndex].name} is up next.`,
        nextText: `${this.session.actors[nextActorIndex].name} Turn`,
        onNext: () => {
          this.session.actorIndex = nextActorIndex;
          this.startSessionHole(getLevelIndexById(this.session.levelIds[this.session.currentHoleIndex]));
          this.showTurnBanner(`${this.actorDisplayName(this.currentActor())} Turn`);
        },
        onRetry: () => this.restartMode()
      });
      return;
    }

    this.session.actorIndex = 0;
    const complete = this.session.currentHoleIndex >= this.session.levelIds.length - 1;
    const winnerText = this.localWinnerText(false);
    if (!complete) {
      this.showModeResult({
        title: `Hole ${this.session.currentHoleIndex + 1} Scoreboard`,
        subtitle: 'Local 2 Player',
        holes: this.flattenActorHoles(),
        winner: winnerText,
        nextText: 'Next Hole',
        onNext: () => {
          this.session.currentHoleIndex += 1;
          this.startSessionHole(getLevelIndexById(this.session.levelIds[this.session.currentHoleIndex]));
          this.showTurnBanner(`${this.actorDisplayName(this.currentActor())} Turn`);
        },
        onRetry: () => this.restartMode()
      });
      return;
    }

    this.finishMatch('Local 2 Player', this.localWinnerText(true));
  }

  resolveBotMatchTurn() {
    const actor = this.currentActor();
    if (actor.type === 'human') {
      this.session.actorIndex = 1;
      this.startSessionHole(getLevelIndexById(this.session.levelIds[this.session.currentHoleIndex]), { showToast: false });
      this.showTurnBanner(`${this.actorDisplayName(this.currentActor())} thinking...`);
      return;
    }

    this.session.actorIndex = 0;
    const complete = this.session.currentHoleIndex >= this.session.levelIds.length - 1;
    const winnerText = this.localWinnerText(false);
    if (!complete) {
      this.showModeResult({
        title: `Hole ${this.session.currentHoleIndex + 1} Scoreboard`,
        subtitle: `Vs Bot | ${botProfile(this.session.botDifficulty).label}`,
        holes: this.flattenActorHoles(),
        winner: winnerText,
        nextText: 'Next Hole',
        onNext: () => {
          this.session.currentHoleIndex += 1;
          this.startSessionHole(getLevelIndexById(this.session.levelIds[this.session.currentHoleIndex]));
          this.showTurnBanner(`Your Turn: ${this.actorDisplayName(this.currentActor())}`);
        },
        onRetry: () => this.restartMode()
      });
      return;
    }

    const human = this.session.actors[0];
    const bot = this.session.actors[1];
    if (summarizeActor(human).adjusted < summarizeActor(bot).adjusted) {
      this.unlockAchievement(`beat-${this.session.botDifficulty}-bot`);
      storage.updateStats((stats) => {
        stats.botsDefeated += 1;
      });
    }
    this.finishMatch(`Vs Bot | ${botProfile(this.session.botDifficulty).label}`, this.localWinnerText(true));
  }

  finishMatch(modeLabel, winnerText) {
    const holes = this.flattenActorHoles();
    storage.updateStats((stats) => {
      stats.localMatchesPlayed += 1;
    });
    storage.addMatchHistory({
      category: this.session.mode === GAME_MODES.VS_BOT ? 'bot' : 'local',
      mode: modeLabel,
      date: new Date().toISOString(),
      coursePack: this.packLabel(this.session.packId),
      players: this.session.actors.map((actor) => actor.name),
      winner: winnerText,
      courseLength: this.session.courseLength,
      finalScore: this.session.actors.map((actor) => `${actor.name} ${summarizeActor(actor).adjusted}`).join(', '),
      botDifficulty: this.session.mode === GAME_MODES.VS_BOT ? this.session.botDifficulty : null
    });
    this.buildHistoryPanel();
    this.buildProfilePanel();
    this.audio.winner();
    emitGameHubEvent('match_completed', { mode: this.session.mode, packId: this.session.packId, winner: winnerText });
    this.showModeResult({
      title: 'Match Complete',
      subtitle: modeLabel,
      holes,
      winner: winnerText,
      nextText: null,
      onNext: null,
      onRetry: () => this.restartMode()
    });
  }

  localWinnerText(final = false) {
    const summaries = this.session.actors.map((actor) => ({ actor, ...summarizeActor(actor) }));
    summaries.sort((a, b) => a.adjusted - b.adjusted);
    if (summaries[0].adjusted === summaries[1]?.adjusted) return 'Match tied';
    return `${summaries[0].actor.name} ${final ? 'wins' : 'leads'} with ${summaries[0].adjusted}`;
  }

  flattenActorHoles() {
    const max = Math.max(...this.session.actors.map((actor) => actor.holes.length), 0);
    const rows = [];
    for (let i = 0; i < max; i += 1) {
      for (const actor of this.session.actors) {
        if (actor.holes[i]) rows.push({ ...actor.holes[i], levelName: actor.name });
      }
    }
    return rows;
  }

  calculateStars() {
    return starsForScore(this.shots, this.level.par);
  }

  buildModeGrid() {
    const modes = [
      { id: GAME_MODES.SOLO_COURSE, title: 'Solo Course', text: '3, 6, or 12 holes with total rank.' },
      { id: GAME_MODES.TIME_TRIAL, title: 'Time Trial', text: 'Race the clock on a level or short course.' },
      { id: GAME_MODES.CHALLENGE, title: 'Challenge Mode', text: 'Focused trick-shot objectives.' },
      { id: GAME_MODES.LOCAL_TWO, title: 'Local 2 Player', text: 'Pass-and-play score match.' },
      { id: GAME_MODES.VS_BOT, title: 'Vs Bot', text: 'Face a calculated local opponent.' },
      { id: GAME_MODES.PRACTICE, title: 'Practice Mode', text: 'Learn unlocked holes without score pressure.' },
      { id: 'onlineMenu', title: 'Online Play', text: 'Private rooms, matchmaking, and server bot fill.' }
    ];
    this.ui.modeGrid.innerHTML = modes.map((mode) => `
      <button class="mode-card" data-mode="${mode.id}" type="button">
        <span>${mode.title}</span>
        <strong>${mode.text}</strong>
      </button>
    `).join('');
    this.ui.modeGrid.querySelectorAll('[data-mode]').forEach((button) => {
      button.addEventListener('click', () => {
        this.audio.modeSelect();
        if (button.dataset.mode === 'onlineMenu') {
          this.openOnlineMenu();
          return;
        }
        this.openModeSetup(button.dataset.mode);
      });
    });
  }

  openModeSetup(mode) {
    this.closeAllPanels();
    this.ui.setupPanel.classList.add('is-visible');
    this.ui.setupPanel.setAttribute('aria-hidden', 'false');
    this.ui.setupKicker.textContent = 'Mode setup';
    this.ui.setupTitle.textContent = MODE_LABELS[mode];
    if (mode === GAME_MODES.ONLINE_PRIVATE) this.buildPrivateRoomSetup();
    if (mode === GAME_MODES.ONLINE_PUBLIC) this.buildPublicMatchmakingSetup();
    if (mode === GAME_MODES.ONLINE_BOT_STYLE) this.buildOnlineBotSetup();
    if (mode === GAME_MODES.SOLO_COURSE) this.buildCourseSetup();
    if (mode === GAME_MODES.TIME_TRIAL) this.buildTimeTrialSetup();
    if (mode === GAME_MODES.CHALLENGE) this.buildChallengeSetup();
    if (mode === GAME_MODES.LOCAL_TWO) this.buildLocalSetup();
    if (mode === GAME_MODES.VS_BOT) this.buildBotSetup();
    if (mode === GAME_MODES.PRACTICE) this.buildPracticeSetup();
  }

  packLabel(packId = this.selectedPackId) {
    return getCoursePack(packId).name;
  }

  unlockedCountForPack(packId = this.selectedPackId) {
    if (DEV_UNLOCK_ALL) return getCoursePack(packId).levelIds.length;
    const unlockedByPack = storage.getUnlockedByPack();
    return Number(unlockedByPack[packId] ?? (packId === 'ivory-garden' ? this.unlockedLevel : 0));
  }

  isLevelUnlocked(level) {
    if (DEV_UNLOCK_ALL) return true;
    const pack = getPackForLevel(level.id);
    const index = pack.levelIds.indexOf(level.id);
    return index >= 0 && index < this.unlockedCountForPack(pack.id);
  }

  coursePackSelector(mode) {
    return `<div class="course-pack-grid">
      ${COURSE_PACKS.map((pack) => {
        const progress = getPackProgress(pack.id, this.bestScores);
        const best = storage.getCourseBest(getCourseScopeId(pack.id, 12));
        const time = storage.getBestTime(`course:${pack.id}:3`);
        return `<button class="course-pack-card${pack.id === this.selectedPackId ? ' is-selected' : ''}" data-pack-select="${pack.id}" type="button">
          <span>${pack.subtitle}</span>
          <strong>${pack.name}</strong>
          <p>${pack.description}</p>
          <small>${progress.stars}/${progress.maxStars} stars | ${progress.percent}% complete | Full best ${best ? best.shots + best.penalties : '--'} | 3-hole time ${time ? formatTime(time.timeMs + (time.penaltySeconds ?? 0) * 1000) : '--'}</small>
        </button>`;
      }).join('')}
    </div>`;
  }

  bindCoursePackSelector(mode) {
    this.ui.setupContent.querySelectorAll('[data-pack-select]').forEach((button) => {
      button.addEventListener('click', () => {
        this.selectedPackId = getCoursePack(button.dataset.packSelect).id;
        this.settings.lastPackId = this.selectedPackId;
        storage.saveSettings(this.settings);
        this.audio.modeSelect();
        this.openModeSetup(mode);
      });
    });
  }

  openOnlineMenu() {
    this.ensureOnlineConnection();
    this.closeAllPanels();
    this.ui.setupPanel.classList.add('is-visible');
    this.ui.setupPanel.setAttribute('aria-hidden', 'false');
    this.ui.setupKicker.textContent = 'Online Play';
    this.ui.setupTitle.textContent = 'Online Play';
    this.ui.setupContent.innerHTML = `
      <div class="online-status-line${this.online.connected ? ' is-online' : ''}">
        <span>${this.online.connected ? 'Online server connected' : 'Server is offline. Local modes are still available.'}</span>
      </div>
      <div class="mode-grid">
        <button class="mode-card" data-online-mode="${GAME_MODES.ONLINE_PRIVATE}" ${this.online.connected ? '' : 'disabled'} type="button">
          <span>Private Room</span><strong>Create or join with a room code.</strong>
        </button>
        <button class="mode-card" data-online-mode="${GAME_MODES.ONLINE_PUBLIC}" ${this.online.connected ? '' : 'disabled'} type="button">
          <span>Public Matchmaking</span><strong>Find a player or get a bot after 30 seconds.</strong>
        </button>
        <button class="mode-card" data-online-mode="${GAME_MODES.ONLINE_BOT_STYLE}" type="button">
          <span>Play With Bot Online Style</span><strong>${this.online.connected ? 'Server-controlled bot match.' : 'Offline fallback to local Vs Bot.'}</strong>
        </button>
      </div>
    `;
    this.ui.setupContent.querySelectorAll('[data-online-mode]').forEach((button) => {
      button.addEventListener('click', () => this.openModeSetup(button.dataset.onlineMode));
    });
  }

  ensureOnlineConnection() {
    if (!this.onlineClient.connected) this.onlineClient.connect();
  }

  onlineLengthButtons(handlerName, privateRoom = false) {
    const lengths = privateRoom ? [3, 6, 12] : [3, 6];
    const pack = getCoursePack(this.selectedPackId);
    return lengths.map((length) => `<button class="setup-card" data-${handlerName}="${length}" type="button">
      <span>${length} holes</span>
      <strong>${length === 3 ? 'Quick Match' : length === 6 ? 'Standard Match' : 'Full Royale Match'}</strong>
      <small>${pack.name} | Total par ${getCoursePar(getCourseLevels(pack.id, length))}</small>
    </button>`).join('');
  }

  buildPrivateRoomSetup() {
    this.ui.setupTitle.textContent = 'Private Room';
    this.ui.setupContent.innerHTML = `
      <div class="name-grid">
        <label>Display name<input id="online-name" maxlength="18" value="${escapeHtml(this.getPreferredOnlineName())}" /></label>
        <label>Join code<input id="join-code" maxlength="5" placeholder="ABCDE" /></label>
      </div>
      ${this.coursePackSelector(GAME_MODES.ONLINE_PRIVATE)}
      <div class="setup-grid">${this.onlineLengthButtons('private-length', true)}</div>
      <div class="modal-actions online-actions">
        <button id="join-room-button" class="glass-button" ${this.online.connected ? '' : 'disabled'} type="button">Join Room Code</button>
        <button id="online-back-button" class="glass-button" type="button">Back</button>
      </div>
    `;
    this.renderOnlineStatus();
    this.bindCoursePackSelector(GAME_MODES.ONLINE_PRIVATE);
    this.ui.setupContent.querySelectorAll('[data-private-length]').forEach((button) => {
      button.addEventListener('click', () => {
        const displayName = this.readPlayerName('#online-name', 'online', 'Guest Putter');
        this.onlineClient.createRoom({
          displayName,
          coursePack: this.selectedPackId,
          courseLength: Number(button.dataset.privateLength)
        });
      });
    });
    this.ui.setupContent.querySelector('#join-room-button')?.addEventListener('click', () => {
      const displayName = this.readPlayerName('#online-name', 'online', 'Guest Putter');
      this.onlineClient.joinRoom({
        displayName,
        code: this.ui.setupContent.querySelector('#join-code')?.value
      });
    });
    this.ui.setupContent.querySelector('#online-back-button')?.addEventListener('click', () => this.openOnlineMenu());
  }

  buildPublicMatchmakingSetup() {
    this.ui.setupTitle.textContent = 'Public Matchmaking';
    this.ui.setupContent.innerHTML = `
      <div class="name-grid">
        <label>Display name<input id="queue-name" maxlength="18" value="${escapeHtml(this.getPreferredOnlineName())}" /></label>
        <label>Preference
          <select id="queue-preference">
            <option value="casual">Casual</option>
            <option value="challenge">Challenge</option>
            <option value="any">Any</option>
          </select>
        </label>
      </div>
      ${this.coursePackSelector(GAME_MODES.ONLINE_PUBLIC)}
      <div class="setup-grid">${this.onlineLengthButtons('queue-length', false)}</div>
      <div class="modal-actions online-actions">
        <button id="queue-cancel-button" class="glass-button" type="button">Cancel Queue</button>
        <button id="queue-back-button" class="glass-button" type="button">Back</button>
      </div>
    `;
    this.renderOnlineStatus();
    this.bindCoursePackSelector(GAME_MODES.ONLINE_PUBLIC);
    this.ui.setupContent.querySelectorAll('[data-queue-length]').forEach((button) => {
      button.addEventListener('click', () => {
        const displayName = this.readPlayerName('#queue-name', 'online', 'Guest Putter');
        this.onlineClient.joinQueue({
          displayName,
          preference: this.ui.setupContent.querySelector('#queue-preference')?.value,
          coursePack: this.selectedPackId,
          courseLength: Number(button.dataset.queueLength)
        });
      });
    });
    this.ui.setupContent.querySelector('#queue-cancel-button')?.addEventListener('click', () => this.onlineClient.cancelQueue());
    this.ui.setupContent.querySelector('#queue-back-button')?.addEventListener('click', () => this.openOnlineMenu());
  }

  buildOnlineBotSetup() {
    if (!this.online.connected) {
      this.showToast('Server is offline. Starting local bot fallback.');
      this.openModeSetup(GAME_MODES.VS_BOT);
      return;
    }
    this.ui.setupTitle.textContent = 'Online Bot Style';
    this.ui.setupContent.innerHTML = `
      <div class="online-status-line is-online"><span>Server bot will join immediately through matchmaking.</span></div>
      <div class="name-grid">
        <label>Display name<input id="bot-online-name" maxlength="18" value="${escapeHtml(this.getPreferredOnlineName())}" /></label>
        <label>Bot style
          <select id="bot-online-preference">
            <option value="casual">Royale Bot</option>
            <option value="challenge">Golden Putter</option>
          </select>
        </label>
      </div>
      ${this.coursePackSelector(GAME_MODES.ONLINE_BOT_STYLE)}
      <div class="setup-grid">${this.onlineLengthButtons('bot-online-length', false)}</div>
    `;
    this.bindCoursePackSelector(GAME_MODES.ONLINE_BOT_STYLE);
    this.ui.setupContent.querySelectorAll('[data-bot-online-length]').forEach((button) => {
      button.addEventListener('click', () => {
        const displayName = this.readPlayerName('#bot-online-name', 'online', 'Guest Putter');
        this.onlineClient.joinQueue({
          displayName,
          preference: this.ui.setupContent.querySelector('#bot-online-preference')?.value,
          coursePack: this.selectedPackId,
          courseLength: Number(button.dataset.botOnlineLength)
        });
      });
    });
  }

  getPreferredOnlineName() {
    return this.getSavedPlayerName('online', storage.getStats().favoriteLevel ? 'Royale Player' : 'Guest Putter');
  }

  getSavedPlayerName(role, fallback = 'Player') {
    return sanitizePlayerName(this.settings.playerNames?.[role], fallback);
  }

  savePlayerName(role, value, fallback = 'Player') {
    const name = sanitizePlayerName(value, fallback);
    this.settings.playerNames = {
      ...(this.settings.playerNames ?? {}),
      [role]: name
    };
    storage.saveSettings(this.settings);
    return name;
  }

  playerNameInput(role, label, fallback = 'Player', id = `${role}-name`) {
    return `<label>${escapeHtml(label)}<input id="${id}" maxlength="18" autocomplete="nickname" value="${escapeHtml(this.getSavedPlayerName(role, fallback))}" /></label>`;
  }

  readPlayerName(selector, role, fallback = 'Player') {
    const input = this.ui.setupContent.querySelector(selector);
    const name = this.savePlayerName(role, input?.value, fallback);
    if (input) input.value = name;
    return name;
  }

  duplicateNameNotice(names) {
    const normalized = names.map((name) => sanitizePlayerName(name).toLowerCase());
    if (new Set(normalized).size === normalized.length) return '';
    return '<p class="online-message">Duplicate display names are allowed; player slots still decide turns.</p>';
  }

  displayNameWithSlot(name, names, index, fallback = 'Player') {
    const clean = sanitizePlayerName(name, fallback);
    const normalized = clean.toLowerCase();
    const duplicate = names
      .map((item) => sanitizePlayerName(item, fallback).toLowerCase())
      .filter((item) => item === normalized).length > 1;
    return duplicate ? `${clean} (P${index + 1})` : clean;
  }

  actorDisplayName(actor = this.currentActor()) {
    const actors = this.session.actors ?? [];
    const index = Math.max(0, actors.findIndex((item) => item.id === actor?.id));
    return this.displayNameWithSlot(actor?.name, actors.map((item) => item.name), index, 'Player');
  }

  onlinePlayerName(playerId = this.online.match?.currentPlayerId) {
    const players = this.online.match?.players ?? [];
    const index = Math.max(0, players.findIndex((item) => item.id === playerId));
    const player = players[index]
      ?? this.session.actors?.find((item) => item.id === playerId);
    return this.displayNameWithSlot(player?.name, players.map((item) => item.name), index, player?.type === 'bot' ? 'Royale Bot' : 'Opponent');
  }

  renderOnlineLobby(room) {
    this.closeAllPanels();
    this.ui.setupPanel.classList.add('is-visible');
    this.ui.setupPanel.setAttribute('aria-hidden', 'false');
    this.ui.setupKicker.textContent = 'Private room';
    this.ui.setupTitle.textContent = `Room ${room.code}`;
    const me = room.players.find((player) => player.id === this.online.playerId);
    const isHost = room.hostId === this.online.playerId;
    const canStart = isHost && room.players.length >= 2 && room.players.every((player) => player.ready);
    const duplicateNotice = this.duplicateNameNotice(room.players.map((player) => player.name));
    this.ui.setupContent.innerHTML = `
      <div class="online-room-code">
        <span>Room code</span>
        <strong>${room.code}</strong>
        <button id="copy-room-code" class="glass-button compact" type="button">Copy</button>
      </div>
      <div class="online-player-list">
        ${room.players.map((player) => `<article class="online-player-card${player.connected ? '' : ' is-disconnected'}">
          <span>${player.host ? 'Host' : 'Guest'} ${player.ready ? '| Ready' : '| Waiting'}</span>
          <strong>${escapeHtml(player.name)}</strong>
          <small>${player.connected ? 'Connected' : 'Disconnected'}</small>
        </article>`).join('')}
      </div>
      <div class="modal-actions online-actions">
        <button id="ready-room-button" class="glass-button" type="button">${me?.ready ? 'Unready' : 'Ready'}</button>
        <button id="start-room-button" class="primary-button" ${canStart ? '' : 'disabled'} type="button">Start Match</button>
        <button id="leave-room-button" class="danger-button" type="button">Leave Room</button>
      </div>
      <p class="online-message">${this.packLabel(room.coursePack)} | ${room.courseLength} holes</p>
      ${duplicateNotice}
    `;
    this.ui.setupContent.querySelector('#copy-room-code')?.addEventListener('click', async () => {
      try {
        await navigator.clipboard?.writeText(room.code);
        this.showToast('Room code copied');
      } catch {
        this.showToast(`Room code: ${room.code}`);
      }
    });
    this.ui.setupContent.querySelector('#ready-room-button')?.addEventListener('click', () => this.onlineClient.setReady(room.code, !me?.ready));
    this.ui.setupContent.querySelector('#start-room-button')?.addEventListener('click', () => this.onlineClient.startMatch(room.code));
    this.ui.setupContent.querySelector('#leave-room-button')?.addEventListener('click', () => {
      this.onlineClient.leaveRoom();
      this.openOnlineMenu();
    });
  }

  renderOnlineQueue(queueState) {
    this.closeAllPanels();
    this.ui.setupPanel.classList.add('is-visible');
    this.ui.setupPanel.setAttribute('aria-hidden', 'false');
    this.ui.setupKicker.textContent = 'Matchmaking';
    this.ui.setupTitle.textContent = queueState?.status === 'bot-filled' ? 'Bot Opponent Joined' : 'Finding Match';
    const seconds = Math.floor((queueState?.elapsedMs ?? 0) / 1000);
    this.ui.setupContent.innerHTML = `
      <div class="queue-card">
        <div class="matchmaking-ring"></div>
        <span>${queueState?.status === 'cancelled' ? 'Queue cancelled' : `Searching ${this.packLabel(queueState?.coursePack ?? this.selectedPackId)}`}</span>
        <strong>${seconds}s</strong>
        <p>${queueState?.message ?? 'Waiting for another player. Bot fill begins after 30 seconds.'}</p>
      </div>
      <div class="modal-actions online-actions">
        <button id="cancel-online-queue" class="glass-button" type="button">Cancel Queue</button>
        <button id="queue-menu-back" class="glass-button" type="button">Back</button>
      </div>
    `;
    this.ui.setupContent.querySelector('#cancel-online-queue')?.addEventListener('click', () => this.onlineClient.cancelQueue());
    this.ui.setupContent.querySelector('#queue-menu-back')?.addEventListener('click', () => this.openOnlineMenu());
  }

  renderOnlineScoreboard(match) {
    if (!match || !this.ui.onlineScoreboard) {
      this.ui.onlineScoreboard?.classList.remove('is-visible');
      return;
    }
    const current = match.players.find((player) => player.id === match.currentPlayerId);
    const turnLabel = current?.id === this.online.playerId
      ? 'Your Turn'
      : `${this.onlinePlayerName(current?.id)}${current?.type === 'bot' ? ' Thinking' : "'s Turn"}`;
    const playerNames = match.players.map((player) => player.name);
    this.ui.onlineScoreboard.innerHTML = `
      <p class="panel-kicker">Online match | ${this.packLabel(match.coursePack ?? this.session.packId)}</p>
      <h3>Hole ${match.currentHoleIndex + 1} / ${match.totalHoles}</h3>
      <div class="online-turn-pill">${escapeHtml(turnLabel)}</div>
      <div class="online-score-rows">
        ${match.players.map((player, index) => `<span><b>${escapeHtml(this.displayNameWithSlot(player.name, playerNames, index, player.type === 'bot' ? 'Royale Bot' : 'Opponent'))}</b><strong>${player.total}</strong><small>${player.connected ? player.type : 'disconnected'}</small></span>`).join('')}
      </div>
    `;
    this.ui.onlineScoreboard.classList.toggle('is-visible', this.isOnlineMode());
  }

  syncOnlineSession(match) {
    if (!match) return;
    if (match.coursePack) this.selectedPackId = getCoursePack(match.coursePack).id;
    const mode = match.source === 'private'
      ? GAME_MODES.ONLINE_PRIVATE
      : match.source === 'public-bot'
        ? GAME_MODES.ONLINE_BOT_STYLE
        : GAME_MODES.ONLINE_PUBLIC;
    if (!this.isOnlineMode() || this.session.mode !== mode || this.session.levelIds.join(',') !== match.levelIds.join(',')) {
      this.session = createSession(mode, {
        packId: match.coursePack ?? 'ivory-garden',
        courseLength: match.courseLength,
        levelIds: match.levelIds,
        actors: match.players.map((player) => ({ id: player.id, name: player.name, type: player.type, holes: player.holes ?? [] })),
        aimAssist: this.settings.aimAssist
      });
    }
    this.session.currentHoleIndex = match.currentHoleIndex;
    this.session.actorIndex = Math.max(0, match.players.findIndex((player) => player.id === match.currentPlayerId));
    this.session.actors = match.players.map((player) => ({ id: player.id, name: player.name, type: player.type, holes: player.holes ?? [] }));
  }

  handleOnlineTurn(match) {
    if (!match?.turn) return;
    this.syncOnlineSession(match);
    this.closeAllPanels();
    this.ui.resultModal.classList.remove('is-visible');
    this.ui.resultModal.setAttribute('aria-hidden', 'true');
    const levelId = match.turn.levelId;
    this.loadLevel(getLevelIndexById(levelId), { showToast: false });
    this.shots = match.turn.shots;
    this.penalties = match.turn.penalties;
    this.opponentBall.visible = !this.isMyOnlineTurn();
    if (this.opponentBall.visible) {
      this.opponentBall.position.set(this.level.start.x, this.heightAt(this.level.start.x, this.level.start.z) + BALL_RADIUS, this.level.start.z);
    }
    this.startPreview();
    const player = match.players.find((item) => item.id === match.currentPlayerId);
    const displayName = this.onlinePlayerName(match.currentPlayerId);
    this.showTurnBanner(this.isMyOnlineTurn() ? 'Your Turn' : `${player?.type === 'bot' ? `${displayName} thinking` : `${displayName}'s Turn`}`);
    this.renderOnlineScoreboard(match);
    this.updateUi();
  }

  handleOnlineShotAccepted({ match, playerId, shot, officialShots }) {
    if (match) {
      this.online.match = match;
      this.online.turn = match.turn ?? this.online.turn;
    }
    const direction = new THREE.Vector2(shot.direction.x, shot.direction.z);
    const power = clamp(Number(shot.power) || 0, 0, 1);
    if (playerId === this.online.playerId) {
      this.shots = Math.max(0, (officialShots ?? this.shots + 1) - 1);
      this.applyAcceptedShot(direction, power, { countShot: true });
      return;
    }
    this.opponentBall.visible = true;
    this.opponentBall.position.set(this.level.start.x, this.heightAt(this.level.start.x, this.level.start.z) + BALL_RADIUS, this.level.start.z);
    this.power = power;
    this.aimDirection.copy(direction);
    this.updateAimGuides();
    this.showTurnBanner(`${this.onlinePlayerName(playerId)} shooting`);
  }

  handleOnlineBallSample(sample) {
    if (!sample || sample.playerId === this.online.playerId) return;
    this.opponentBall.visible = true;
    this.opponentBall.position.set(sample.x, this.heightAt(sample.x, sample.z) + BALL_RADIUS, sample.z);
    if (!sample.moving) this.showTurnBanner(`${this.onlinePlayerName(sample.playerId)} completed shot`);
  }

  handleOnlineHoleResult(match, result, playerId) {
    if (match) {
      this.online.match = match;
      this.syncOnlineSession(match);
      this.renderOnlineScoreboard(match);
    }
    this.opponentBall.visible = false;
    const player = match?.players?.find((item) => item.id === playerId);
    this.showToast(`${player?.name ?? 'Player'} finished hole ${result?.shots ?? '--'}`);
  }

  handleOnlineMatchComplete(payload) {
    this.online.lastMatchComplete = payload;
    const match = payload.match;
    if (match) {
      this.online.match = match;
      this.syncOnlineSession(match);
    }
    const me = payload.totals?.find((item) => item.playerId === this.online.playerId);
    const opponent = payload.totals?.find((item) => item.playerId !== this.online.playerId);
    storage.addMatchHistory({
      category: match?.source === 'public-bot' ? 'online bot' : 'online',
      mode: MODE_LABELS[this.session.mode] ?? 'Online Match',
      date: new Date().toISOString(),
      coursePack: this.packLabel(match?.coursePack ?? this.session.packId),
      players: payload.totals?.map((item) => item.name) ?? [],
      winner: payload.winner?.name ?? 'Draw',
      courseLength: match?.courseLength ?? this.session.courseLength,
      finalScore: `${me?.name ?? 'You'} ${me?.total ?? '--'}, ${opponent?.name ?? 'Opponent'} ${opponent?.total ?? '--'}`,
      botDifficulty: opponent?.type === 'bot' ? 'server' : null
    });
    emitGameHubEvent('match_completed', { mode: this.session.mode, packId: match?.coursePack, winner: payload.winner?.name ?? 'Draw' });
    this.buildHistoryPanel();
    this.showOnlineMatchComplete(payload);
  }

  showOnlineMatchComplete(payload) {
    const match = payload.match ?? this.online.match;
    const holes = (payload.totals ?? []).flatMap((total) => (total.holes ?? []).map((hole) => ({ ...hole, levelName: total.name })));
    const winner = payload.winner?.name ? `${payload.winner.name} wins` : 'Match tied';
    this.showModeResult({
      title: 'Online Match Complete',
      subtitle: match?.source === 'private' ? 'Private Room' : 'Public Match',
      holes,
      winner,
      retryText: 'Rematch',
      nextText: null,
      onNext: null,
      onRetry: () => this.onlineClient.requestRematch(match?.id)
    });
  }

  isOnlineMode() {
    return [GAME_MODES.ONLINE_PRIVATE, GAME_MODES.ONLINE_PUBLIC, GAME_MODES.ONLINE_BOT_STYLE].includes(this.session.mode);
  }

  isMyOnlineTurn() {
    return this.isOnlineMode() && this.online.match?.currentPlayerId === this.online.playerId;
  }

  emitOnlineBallSample(delta, moving, extra = {}) {
    if (!this.isOnlineMode() || !this.isMyOnlineTurn() || !this.online.turn) return;
    this.online.sampleTimer += delta;
    if (moving && this.online.sampleTimer < 0.12 && !extra.penalty) return;
    this.online.sampleTimer = 0;
    this.onlineClient.sendBallSample({
      matchId: this.online.match.id,
      turnId: this.online.turn.id,
      x: this.physics.position.x,
      z: this.physics.position.y,
      moving,
      ...extra
    });
  }

  courseLengthButtons(mode, handlerName, packId = this.selectedPackId) {
    const pack = getCoursePack(packId);
    const unlockedCount = this.unlockedCountForPack(pack.id);
    return [3, 6, 12].map((length) => {
      const disabled = unlockedCount < length;
      return `<button class="setup-card${disabled ? ' is-locked' : ''}" data-${handlerName}="${length}" ${disabled ? 'disabled' : ''} type="button">
        <span>${length} holes</span>
        <strong>${pack.name}</strong>
        <small>${disabled ? 'Unlock more levels' : `Total par ${getCoursePar(getCourseLevels(pack.id, length))}`}</small>
      </button>`;
    }).join('');
  }

  buildCourseSetup() {
    const pack = getCoursePack(this.selectedPackId);
    const packLevels = getCourseLevels(pack.id, 12);
    const bestFull = storage.getCourseBest(getCourseScopeId(pack.id, 12));
    this.ui.setupContent.innerHTML = `
      <div class="name-grid">${this.playerNameInput('solo', 'Player name', 'Player', 'solo-name')}</div>
      ${this.coursePackSelector(GAME_MODES.SOLO_COURSE)}
      <div class="course-pack">
        <p class="panel-kicker">${pack.subtitle}</p>
        <h3>${pack.name}</h3>
        <p>${packLevels.length} holes | ${getCoursePar(packLevels)} total par | Full best ${bestFull ? bestFull.shots + bestFull.penalties : '--'}</p>
      </div>
      <div class="setup-grid">${this.courseLengthButtons(GAME_MODES.SOLO_COURSE, 'course-length', pack.id)}</div>
      <div class="future-pack-row">${FUTURE_PACKS.map((pack) => `<span>${pack}<b>Coming soon</b></span>`).join('')}</div>
    `;
    this.bindCoursePackSelector(GAME_MODES.SOLO_COURSE);
    this.ui.setupContent.querySelectorAll('[data-course-length]').forEach((button) => {
      button.addEventListener('click', () => {
        const playerName = this.readPlayerName('#solo-name', 'solo', 'Player');
        this.startCourse(Number(button.dataset.courseLength), pack.id, playerName);
      });
    });
  }

  buildTimeTrialSetup() {
    const pack = getCoursePack(this.selectedPackId);
    const unlocked = getCourseLevels(pack.id, 12).filter((level) => this.isLevelUnlocked(level));
    const canSprint = this.unlockedCountForPack(pack.id) >= 3;
    this.ui.setupContent.innerHTML = `
      <div class="name-grid">${this.playerNameInput('solo', 'Player name', 'Player', 'time-player-name')}</div>
      ${this.coursePackSelector(GAME_MODES.TIME_TRIAL)}
      <div class="setup-grid compact-grid">
        <button class="setup-card${canSprint ? '' : ' is-locked'}" data-time-course="3" ${canSprint ? '' : 'disabled'} type="button">
          <span>3-hole sprint</span><strong>${pack.name}</strong><small>Penalties add 5 seconds</small>
        </button>
        ${unlocked.map((level) => `<button class="setup-card" data-time-level="${level.id}" type="button">
          <span>Single level</span><strong>${level.name}</strong><small>Best ${storage.getBestTime(`single:${level.id}`) ? formatTime(storage.getBestTime(`single:${level.id}`).timeMs) : '--'}</small>
        </button>`).join('')}
      </div>
    `;
    this.bindCoursePackSelector(GAME_MODES.TIME_TRIAL);
    this.ui.setupContent.querySelector('[data-time-course]')?.addEventListener('click', () => {
      const playerName = this.readPlayerName('#time-player-name', 'solo', 'Player');
      this.startTimeTrial(getCourseLevels(pack.id, 3).map((level) => level.id), 3, pack.id, playerName);
    });
    this.ui.setupContent.querySelectorAll('[data-time-level]').forEach((button) => {
      button.addEventListener('click', () => {
        const playerName = this.readPlayerName('#time-player-name', 'solo', 'Player');
        this.startTimeTrial([Number(button.dataset.timeLevel)], 1, pack.id, playerName);
      });
    });
  }

  buildChallengeSetup() {
    const completed = storage.getChallenges().completed;
    this.ui.setupContent.innerHTML = `
      <div class="name-grid">${this.playerNameInput('solo', 'Player name', 'Player', 'challenge-player-name')}</div>
      <div class="setup-grid">
        ${CHALLENGES.map((challenge) => {
          const locked = (challenge.levelId && challenge.levelId > this.unlockedLevel) || (challenge.courseLength && this.unlockedLevel < challenge.courseLength);
          return `<button class="setup-card${locked ? ' is-locked' : ''}${completed[challenge.id] ? ' is-complete' : ''}" data-challenge="${challenge.id}" ${locked ? 'disabled' : ''} type="button">
            <span>${completed[challenge.id] ? 'Complete' : 'Mission'}</span>
            <strong>${challenge.title}</strong>
            <small>${challenge.objective}</small>
          </button>`;
        }).join('')}
      </div>
    `;
    this.ui.setupContent.querySelectorAll('[data-challenge]').forEach((button) => {
      button.addEventListener('click', () => {
        const playerName = this.readPlayerName('#challenge-player-name', 'solo', 'Player');
        this.startChallenge(button.dataset.challenge, playerName);
      });
    });
  }

  buildLocalSetup() {
    const pack = getCoursePack(this.selectedPackId);
    this.ui.setupContent.innerHTML = `
      ${this.coursePackSelector(GAME_MODES.LOCAL_TWO)}
      <div class="name-grid">
        ${this.playerNameInput('localP1', 'Player 1', 'Player 1', 'local-p1')}
        ${this.playerNameInput('localP2', 'Player 2', 'Player 2', 'local-p2')}
      </div>
      <p class="online-message">Names are display labels only. Player slots decide turns.</p>
      <div class="setup-grid">${this.courseLengthButtons(GAME_MODES.LOCAL_TWO, 'local-length', pack.id)}</div>
    `;
    this.bindCoursePackSelector(GAME_MODES.LOCAL_TWO);
    this.ui.setupContent.querySelectorAll('[data-local-length]').forEach((button) => {
      button.addEventListener('click', () => {
        const p1 = this.readPlayerName('#local-p1', 'localP1', 'Player 1');
        const p2 = this.readPlayerName('#local-p2', 'localP2', 'Player 2');
        if (p1.toLowerCase() === p2.toLowerCase()) this.showToast('Duplicate names allowed; turns use player slots.');
        this.startLocalTwo(Number(button.dataset.localLength), p1, p2, pack.id);
      });
    });
  }

  buildBotSetup() {
    const pack = getCoursePack(this.selectedPackId);
    this.ui.setupContent.innerHTML = `
      <div class="name-grid">${this.playerNameInput('botHuman', 'Your name', 'Player', 'bot-human-name')}</div>
      ${this.coursePackSelector(GAME_MODES.VS_BOT)}
      <div class="difficulty-row">
        ${['easy', 'normal', 'hard'].map((difficulty) => `<button class="setup-card" data-bot-difficulty="${difficulty}" type="button">
          <span>${botProfile(difficulty).label}</span><strong>${difficulty === 'hard' ? 'Shortcut planner' : difficulty === 'normal' ? 'Balanced read' : 'Forgiving rival'}</strong>
        </button>`).join('')}
      </div>
      <div id="bot-lengths" class="setup-grid is-dimmed">${this.courseLengthButtons(GAME_MODES.VS_BOT, 'bot-length', pack.id)}</div>
    `;
    this.bindCoursePackSelector(GAME_MODES.VS_BOT);
    let selected = 'normal';
    this.ui.setupContent.querySelectorAll('[data-bot-difficulty]').forEach((button) => {
      button.addEventListener('click', () => {
        selected = button.dataset.botDifficulty;
        this.ui.setupContent.querySelectorAll('[data-bot-difficulty]').forEach((item) => item.classList.toggle('is-selected', item === button));
      });
    });
    this.ui.setupContent.querySelector('[data-bot-difficulty="normal"]')?.classList.add('is-selected');
    this.ui.setupContent.querySelectorAll('[data-bot-length]').forEach((button) => {
      button.addEventListener('click', () => {
        const humanName = this.readPlayerName('#bot-human-name', 'botHuman', 'Player');
        this.startVsBot(Number(button.dataset.botLength), selected, pack.id, humanName);
      });
    });
  }

  buildPracticeSetup() {
    const pack = getCoursePack(this.selectedPackId);
    const unlocked = getCourseLevels(pack.id, 12).filter((level) => this.isLevelUnlocked(level));
    this.ui.setupContent.innerHTML = `
      <div class="name-grid">${this.playerNameInput('solo', 'Player name', 'Player', 'practice-player-name')}</div>
      ${this.coursePackSelector(GAME_MODES.PRACTICE)}
      <div class="practice-toggles">
        <label class="toggle-row"><span>Aim assist</span><input id="practice-aim" type="checkbox" ${this.settings.aimAssist ? 'checked' : ''} /></label>
        <label class="toggle-row"><span>Best ghost</span><input id="practice-ghost" type="checkbox" ${this.settings.showGhost ? 'checked' : ''} /></label>
      </div>
      <div class="setup-grid compact-grid">
        ${unlocked.map((level) => `<button class="setup-card" data-practice-level="${level.id}" type="button">
          <span>Practice</span><strong>${level.name}</strong><small>Par ${level.par} | Best ${bestLabel(this.bestScores[String(level.id)])}</small>
        </button>`).join('')}
      </div>
    `;
    this.bindCoursePackSelector(GAME_MODES.PRACTICE);
    this.ui.setupContent.querySelector('#practice-aim')?.addEventListener('change', (event) => {
      this.settings.aimAssist = event.target.checked;
      storage.saveSettings(this.settings);
      this.bindSettingsValues();
      this.updateAimGuides();
    });
    this.ui.setupContent.querySelector('#practice-ghost')?.addEventListener('change', (event) => {
      this.settings.showGhost = event.target.checked;
      storage.saveSettings(this.settings);
      this.bindSettingsValues();
      this.updateGhostVisual();
    });
    this.ui.setupContent.querySelectorAll('[data-practice-level]').forEach((button) => {
      button.addEventListener('click', () => {
        const playerName = this.readPlayerName('#practice-player-name', 'solo', 'Player');
        this.startPractice(Number(button.dataset.practiceLevel), playerName);
      });
    });
  }

  startCourse(length, packId = this.selectedPackId, playerName = this.getSavedPlayerName('solo', 'Player')) {
    const pack = getCoursePack(packId);
    const levels = getCourseLevels(pack.id, length);
    const displayName = sanitizePlayerName(playerName, 'Player');
    this.session = createSession(GAME_MODES.SOLO_COURSE, {
      packId: pack.id,
      courseLength: length,
      levelIds: levels.map((level) => level.id),
      actors: [{ id: 'player', name: displayName, type: 'human', holes: [] }],
      aimAssist: this.settings.aimAssist
    });
    emitGameHubEvent('game_started', { mode: GAME_MODES.SOLO_COURSE, packId: pack.id, length });
    this.startSessionHole(getLevelIndexById(levels[0].id));
  }

  startTimeTrial(levelIds, length, packId = this.selectedPackId, playerName = this.getSavedPlayerName('solo', 'Player')) {
    const displayName = sanitizePlayerName(playerName, 'Player');
    this.session = createSession(GAME_MODES.TIME_TRIAL, {
      packId,
      courseLength: length,
      levelIds,
      actors: [{ id: 'player', name: displayName, type: 'human', holes: [] }],
      aimAssist: this.settings.aimAssist
    });
    this.session.timer.elapsedMs = 0;
    this.session.timer.penaltySeconds = 0;
    emitGameHubEvent('game_started', { mode: GAME_MODES.TIME_TRIAL, packId, length });
    this.startSessionHole(getLevelIndexById(levelIds[0]));
  }

  startChallenge(challengeId, playerName = this.getSavedPlayerName('solo', 'Player')) {
    const challenge = getChallenge(challengeId);
    const ids = challenge.courseLength
      ? getCourseLevels('ivory-garden', challenge.courseLength).map((level) => level.id)
      : [challenge.levelId ?? 1];
    const displayName = sanitizePlayerName(playerName, 'Player');
    this.session = createSession(GAME_MODES.CHALLENGE, {
      challengeId,
      courseLength: ids.length,
      levelIds: ids,
      actors: [{ id: 'player', name: displayName, type: 'human', holes: [] }],
      aimAssist: this.settings.aimAssist
    });
    this.showToast(challenge.objective);
    this.startSessionHole(getLevelIndexById(ids[0]));
  }

  startLocalTwo(length, p1, p2, packId = this.selectedPackId) {
    const pack = getCoursePack(packId);
    const levels = getCourseLevels(pack.id, length);
    const playerOne = sanitizePlayerName(p1, 'Player 1');
    const playerTwo = sanitizePlayerName(p2, 'Player 2');
    this.session = createSession(GAME_MODES.LOCAL_TWO, {
      packId: pack.id,
      courseLength: length,
      levelIds: levels.map((level) => level.id),
      actors: [
        { id: 'p1', name: playerOne, type: 'human', holes: [] },
        { id: 'p2', name: playerTwo, type: 'human', holes: [] }
      ],
      aimAssist: this.settings.aimAssist
    });
    emitGameHubEvent('game_started', { mode: GAME_MODES.LOCAL_TWO, packId: pack.id, length });
    this.showVsIntro({
      leftName: playerOne,
      rightName: playerTwo,
      subtitle: `${pack.name} | ${length} holes`,
      onComplete: () => {
        this.startSessionHole(getLevelIndexById(levels[0].id));
        this.showTurnBanner(`${this.actorDisplayName(this.session.actors[0])} Turn`);
      }
    });
  }

  startVsBot(length, difficulty, packId = this.selectedPackId, humanName = this.getSavedPlayerName('botHuman', 'Player')) {
    const pack = getCoursePack(packId);
    const levels = getCourseLevels(pack.id, length);
    const displayName = sanitizePlayerName(humanName, 'Player');
    const botName = `${botProfile(difficulty).label} Bot`;
    this.session = createSession(GAME_MODES.VS_BOT, {
      packId: pack.id,
      courseLength: length,
      levelIds: levels.map((level) => level.id),
      botDifficulty: difficulty,
      actors: [
        { id: 'human', name: displayName, type: 'human', holes: [] },
        { id: 'bot', name: botName, type: 'bot', holes: [] }
      ],
      aimAssist: this.settings.aimAssist
    });
    emitGameHubEvent('game_started', { mode: GAME_MODES.VS_BOT, packId: pack.id, length });
    this.showVsIntro({
      leftName: displayName,
      rightName: botName,
      subtitle: `${pack.name} | ${botProfile(difficulty).label}`,
      onComplete: () => {
        this.startSessionHole(getLevelIndexById(levels[0].id));
        this.showTurnBanner(`Your Turn: ${this.actorDisplayName(this.session.actors[0])}`);
      }
    });
  }

  startPractice(levelId, playerName = this.getSavedPlayerName('solo', 'Player')) {
    const pack = getPackForLevel(levelId);
    const displayName = sanitizePlayerName(playerName, 'Player');
    this.session = createSession(GAME_MODES.PRACTICE, {
      packId: pack.id,
      levelIds: [levelId],
      actors: [{ id: 'player', name: displayName, type: 'human', holes: [] }],
      aimAssist: this.settings.aimAssist
    });
    emitGameHubEvent('game_started', { mode: GAME_MODES.PRACTICE, packId: pack.id, levelId });
    this.startSessionHole(getLevelIndexById(levelId));
  }

  restartMode() {
    const { mode, packId, courseLength, levelIds, challengeId, botDifficulty, actors } = this.session;
    if (mode === GAME_MODES.SOLO_COURSE) this.startCourse(courseLength, packId, actors[0]?.name);
    else if (mode === GAME_MODES.TIME_TRIAL) this.startTimeTrial(levelIds, courseLength, packId, actors[0]?.name);
    else if (mode === GAME_MODES.CHALLENGE) this.startChallenge(challengeId, actors[0]?.name);
    else if (mode === GAME_MODES.LOCAL_TWO) this.startLocalTwo(courseLength, actors[0].name, actors[1].name, packId);
    else if (mode === GAME_MODES.VS_BOT) this.startVsBot(courseLength, botDifficulty, packId, actors[0]?.name);
    else if (mode === GAME_MODES.PRACTICE) this.startPractice(levelIds[0], actors[0]?.name);
    else this.startLevel(this.levelIndex);
  }

  updateModeTimer(delta) {
    if (this.session.mode !== GAME_MODES.TIME_TRIAL || !this.session.timer.active) return;
    this.session.timer.elapsedMs += delta * 1000;
    this.updateUi();
  }

  scheduleBotShot() {
    const profile = botProfile(this.session.botDifficulty);
    this.botTimer = profile.wait;
    this.botPlan = planBotShot({
      level: this.level,
      physics: this.physics,
      dynamicColliders: this.obstacles.getColliders(),
      difficulty: this.session.botDifficulty,
      shotNumber: this.shots + 1
    });
    this.aimDirection.copy(this.botPlan.direction);
    this.power = this.botPlan.power;
    this.showTurnBanner(`${this.actorDisplayName(this.currentActor())} thinking...`);
    this.audio.botThinking();
    this.updateAimGuides();
  }

  updateBot(delta) {
    if (!this.isBotTurn() || !this.botPlan) return;
    this.botTimer -= delta;
    this.power = this.botPlan.power;
    this.aimDirection.copy(this.botPlan.direction);
    if (this.botTimer <= 0) {
      this.showTurnBanner(`${this.actorDisplayName(this.currentActor())} putt`);
      this.shoot();
      this.botPlan = null;
      this.botTimer = 0;
    }
  }

  showVsIntro({ leftName, rightName, subtitle = '', onComplete = null } = {}) {
    const panel = this.ui.vsIntro;
    if (!panel) {
      onComplete?.();
      return;
    }

    const left = sanitizePlayerName(leftName, 'Player 1');
    const right = sanitizePlayerName(rightName, 'Player 2');
    const done = () => {
      if (!this.vsIntroComplete) return;
      const complete = this.vsIntroComplete;
      this.vsIntroComplete = null;
      clearTimeout(this.vsIntroTimer);
      panel.classList.remove('is-visible');
      panel.setAttribute('aria-hidden', 'true');
      complete();
    };

    clearTimeout(this.vsIntroTimer);
    this.vsIntroComplete = () => {
      onComplete?.();
    };
    panel.innerHTML = `
      <div class="vs-card" role="dialog" aria-label="Match starting">
        <p class="vs-kicker">Match starting</p>
        <div class="vs-row">
          <div class="vs-player"><span>Player 1</span><strong>${escapeHtml(left)}</strong></div>
          <div class="vs-divider">VS</div>
          <div class="vs-player"><span>Player 2</span><strong>${escapeHtml(right)}</strong></div>
        </div>
        ${subtitle ? `<p class="vs-subtitle">${escapeHtml(subtitle)}</p>` : ''}
        <button id="vs-skip-button" class="glass-button compact vs-skip" type="button">Skip</button>
      </div>
    `;
    panel.classList.add('is-visible');
    panel.setAttribute('aria-hidden', 'false');
    panel.querySelector('#vs-skip-button')?.addEventListener('click', done, { once: true });
    this.vsIntroTimer = setTimeout(done, this.settings.reduceCinematics ? 750 : 1750);
    this.audio.modeSelect();
  }

  hideVsIntro({ complete = false } = {}) {
    if (complete && this.vsIntroComplete) {
      const completeIntro = this.vsIntroComplete;
      this.vsIntroComplete = null;
      completeIntro();
    } else {
      this.vsIntroComplete = null;
    }
    clearTimeout(this.vsIntroTimer);
    this.ui.vsIntro?.classList.remove('is-visible');
    this.ui.vsIntro?.setAttribute('aria-hidden', 'true');
  }

  maybeShowOnlineVsIntro(match) {
    if (!match?.id || this.shownVsIntroMatchIds.has(match.id)) return;
    this.shownVsIntroMatchIds.add(match.id);
    if (![GAME_MODES.ONLINE_PRIVATE, GAME_MODES.ONLINE_PUBLIC, GAME_MODES.ONLINE_BOT_STYLE].includes(this.session.mode)) return;
    const [left, right] = match.players ?? [];
    if (!left || !right) return;
    const subtitle = `${this.packLabel(match.coursePack ?? this.session.packId)} | ${match.courseLength} holes`;
    this.showVsIntro({
      leftName: left.name,
      rightName: right.name,
      subtitle
    });
  }

  currentTurnLabel() {
    if (this.isOnlineMode()) {
      const match = this.online.match;
      if (!match?.currentPlayerId) return 'Online';
      if (match.currentPlayerId === this.online.playerId) return 'Your Turn';
      const player = match.players?.find((item) => item.id === match.currentPlayerId);
      const name = this.onlinePlayerName(match.currentPlayerId);
      return player?.type === 'bot' ? `${name} Thinking` : `${name} Turn`;
    }

    const actor = this.currentActor();
    const name = this.actorDisplayName(actor);
    if (this.session.mode === GAME_MODES.VS_BOT) {
      return actor?.type === 'bot' ? `${name} Thinking` : `Your Turn: ${name}`;
    }
    if (this.session.mode === GAME_MODES.LOCAL_TWO) return `${name} Turn`;
    return name;
  }

  showTurnBanner(message) {
    this.ui.turnBanner.textContent = message;
    this.ui.turnBanner.classList.add('is-visible');
    clearTimeout(this.turnTimer);
    this.turnTimer = setTimeout(() => this.ui.turnBanner.classList.remove('is-visible'), 1500);
    this.audio.turnSwitch();
  }

  evaluateAchievements(result) {
    this.unlockAchievement('first-cup');
    if (result.shots === 1) this.unlockAchievement('first-ace');
    if (result.shots + result.penalties < result.par) this.unlockAchievement('under-par');
    if (result.flags.noWallTouch) this.unlockAchievement('no-wall-touch');
    if (result.flags.usedBouncePad) this.unlockAchievement('bounce-master');
    if (result.flags.usedSand) this.unlockAchievement('sand-survivor');
    if (result.flags.usedBoost) this.unlockAchievement('boost-shot');
    if ([3, 10, 19].includes(result.levelId) && !result.flags.fellOut) this.unlockAchievement('bridge-clear');
    const stars = totalStarsFromScores(storage.getBestScores());
    if (stars >= 10) this.unlockAchievement('stars-10');
    if (stars >= 25) this.unlockAchievement('stars-25');
    this.buildAchievementsGrid();
  }

  evaluateDailyChallenge(result) {
    const daily = this.activeDaily ?? getTodayChallenge();
    if (!daily || result.levelId !== daily.levelId) return;
    if (isDailyResultMet(daily, result)) {
      storage.completeDaily(daily, result);
      this.showToast('Daily challenge complete');
      this.buildDailyPanel();
    }
    this.activeDaily = null;
  }

  unlockAchievement(id) {
    if (storage.unlockAchievement(id)) {
      const achievement = getAchievement(id);
      this.ui.achievementToast.innerHTML = `<span>Achievement unlocked</span><strong>${achievement?.title ?? id}</strong>`;
      this.ui.achievementToast.classList.add('is-visible');
      clearTimeout(this.achievementTimer);
      this.achievementTimer = setTimeout(() => this.ui.achievementToast.classList.remove('is-visible'), 2600);
      this.audio.achievement();
      emitGameHubEvent('achievement_unlocked', { id, title: achievement?.title ?? id });
      this.buildAchievementsGrid();
      this.buildLockerPanel();
    }
  }

  buildAchievementsGrid() {
    if (!this.ui.achievementsGrid) return;
    const unlocked = storage.getAchievements().unlocked;
    const stars = totalStarsFromScores(storage.getBestScores());
    this.ui.achievementsGrid.innerHTML = ACHIEVEMENTS.map((achievement) => {
      const done = Boolean(unlocked[achievement.id]);
      const progress = achievement.target ? `<small>${Math.min(stars, achievement.target)} / ${achievement.target}</small>` : '';
      return `<article class="achievement-card${done ? ' is-complete' : ''}">
        <span>${done ? 'Unlocked' : 'Locked'}</span>
        <strong>${achievement.title}</strong>
        <p>${achievement.description}</p>
        ${progress}
      </article>`;
    }).join('');
  }

  buildProfilePanel() {
    if (!this.ui.profileGrid) return;
    const stats = storage.getStats();
    const bestTime = stats.bestTimeTrialMs == null ? '--' : formatTime(stats.bestTimeTrialMs);
    const data = [
      ['Total shots', stats.totalShots],
      ['Practice shots', stats.totalPracticeShots],
      ['Holes completed', stats.holesCompleted],
      ['Hole-in-ones', stats.holeInOnes],
      ['Stars collected', totalStarsFromScores(storage.getBestScores())],
      ['Best course score', stats.bestCourseScore ?? '--'],
      ['Best time trial', bestTime],
      ['Challenges completed', Object.keys(storage.getChallenges().completed).length],
      ['Bots defeated', stats.botsDefeated],
      ['Local matches', stats.localMatchesPlayed],
      ['Favorite level', stats.favoriteLevel ?? '--']
    ];
    this.ui.profileGrid.innerHTML = data.map(([label, value]) => `<article class="profile-stat"><span>${label}</span><strong>${value}</strong></article>`).join('');
  }

  buildHistoryPanel() {
    if (!this.ui.historyList) return;
    const filters = ['all', 'solo', 'bot', 'local', 'online', 'time trial'];
    if (this.ui.historyFilters) {
      this.ui.historyFilters.innerHTML = filters.map((filter) => `<button class="${this.historyFilter === filter ? 'is-selected' : ''}" data-history-filter="${filter}" type="button">${filter === 'all' ? 'All' : filter}</button>`).join('');
      this.ui.historyFilters.querySelectorAll('[data-history-filter]').forEach((button) => {
        button.addEventListener('click', () => {
          this.historyFilter = button.dataset.historyFilter;
          this.buildHistoryPanel();
        });
      });
    }
    const allHistory = storage.getMatchHistory();
    const history = this.historyFilter === 'all'
      ? allHistory
      : allHistory.filter((match) => String(match.category ?? match.mode ?? '').toLowerCase().includes(this.historyFilter));
    this.ui.historyList.innerHTML = history.length
      ? history.map((match) => `<article class="history-card">
          <span>${new Date(match.date).toLocaleString()}</span>
          <strong>${escapeHtml(match.mode)}${match.coursePack ? ` | ${escapeHtml(match.coursePack)}` : ''}</strong>
          <p>${escapeHtml(match.winner ?? match.result ?? 'Complete')} | ${escapeHtml(match.finalScore ?? match.score ?? '--')}${match.replayKey ? ' | Replay saved' : ''}</p>
        </article>`).join('')
      : '<p class="empty-note">No local matches yet.</p>';
  }

  buildLockerPanel() {
    if (!this.ui.lockerContent) return;
    const save = storage.getSave();
    const cosmetics = storage.getCosmetics();
    const context = cosmeticUnlockContext(save);
    this.ui.lockerContent.innerHTML = `
      <div class="locker-preview">
        <span class="locker-ball" style="--ball-color:#${getCosmetic(COSMETIC_TYPES.BALL, cosmetics.equipped.ball).color.toString(16).padStart(6, '0')}"></span>
        <strong>${getCosmetic(COSMETIC_TYPES.BALL, cosmetics.equipped.ball).name}</strong>
        <p>Local-only cosmetics. No gameplay stats change.</p>
      </div>
      ${Object.entries(COSMETICS).map(([type, items]) => `<section class="locker-section">
        <h3>${type === 'ball' ? 'Ball skins' : type === 'trail' ? 'Ball trails' : type === 'flag' ? 'Flag styles' : type === 'aim' ? 'Aim line styles' : 'Cup effects'}</h3>
        <div class="setup-grid compact-grid">
          ${items.map((item) => {
            const unlocked = isCosmeticUnlocked(item, context) || cosmetics.unlocked?.[type]?.[item.id];
            const equipped = cosmetics.equipped?.[type] === item.id;
            return `<button class="setup-card cosmetic-card${equipped ? ' is-selected' : ''}${unlocked ? '' : ' is-locked'}" data-cosmetic-type="${type}" data-cosmetic-id="${item.id}" ${unlocked ? '' : 'disabled'} type="button">
              <span>${equipped ? 'Equipped' : unlocked ? 'Unlocked' : 'Locked'}</span>
              <strong>${item.name}</strong>
              <small>${item.requirement}</small>
            </button>`;
          }).join('')}
        </div>
      </section>`).join('')}
    `;
    this.ui.lockerContent.querySelectorAll('[data-cosmetic-type]').forEach((button) => {
      button.addEventListener('click', () => {
        storage.equipCosmetic(button.dataset.cosmeticType, button.dataset.cosmeticId);
        this.applyCosmetics();
        this.buildLockerPanel();
        this.showToast('Cosmetic equipped');
      });
    });
  }

  buildDailyPanel() {
    if (!this.ui.dailyContent) return;
    const daily = getTodayChallenge();
    this.dailyChallenge = daily;
    const save = storage.getDaily();
    const completed = save.completions[daily.dateKey];
    this.ui.dailyContent.innerHTML = `
      <article class="daily-card">
        <span>${daily.packName}</span>
        <strong>${daily.levelName}</strong>
        <p>${daily.objective}</p>
        <small>Par ${daily.par} | Streak ${save.streak ?? 0} | Next in ${formatCountdown(msToNextDaily())}</small>
      </article>
      <div class="modal-actions">
        <button id="start-daily-button" class="primary-button" type="button">${completed ? 'Replay Daily' : 'Start Daily'}</button>
        <button id="daily-practice-button" class="glass-button" type="button">Practice Level</button>
      </div>
      ${completed ? `<p class="online-message">Completed today in ${completed.shots} shots, ${completed.penalties} penalties.</p>` : '<p class="online-message">Complete locally. No leaderboard, no database.</p>'}
    `;
    this.ui.dailyContent.querySelector('#start-daily-button')?.addEventListener('click', () => this.startDailyChallenge());
    this.ui.dailyContent.querySelector('#daily-practice-button')?.addEventListener('click', () => this.startPractice(daily.levelId));
  }

  startDailyChallenge() {
    const daily = getTodayChallenge();
    this.activeDaily = daily;
    this.startTimeTrial([daily.levelId], 1, daily.packId);
    this.showToast(`Daily: ${daily.objective}`);
  }

  applyCosmetics() {
    const equipped = storage.getCosmetics().equipped;
    const ball = getCosmetic(COSMETIC_TYPES.BALL, equipped.ball);
    const trail = getCosmetic(COSMETIC_TYPES.TRAIL, equipped.trail);
    const aim = getCosmetic(COSMETIC_TYPES.AIM, equipped.aim);
    this.ball.material.color.setHex(ball?.color ?? 0xfffcf2);
    this.materials.trail.color.setHex(trail?.color ?? 0xffefbe);
    if (!this.settings.highContrastAim) {
      this.materials.aim.color.setHex(aim?.color ?? 0xf8d886);
      this.materials.prediction.color.setHex(aim?.color ?? 0xfff4ce);
    }
  }

  setShareResult(result) {
    this.currentShareResult = result;
    storage.saveResultCard({ ...result, text: buildShareText(result), date: new Date().toISOString() });
  }

  copyCurrentShare() {
    if (!this.currentShareResult) return this.showToast('No result ready to share');
    copyShareText(this.currentShareResult)
      .then(() => this.showToast('Result copied'))
      .catch(() => this.showToast('Copy failed'));
  }

  downloadCurrentShare() {
    if (!this.currentShareResult) return this.showToast('No result ready to share');
    downloadShareImage(this.currentShareResult);
    this.showToast('Result image ready');
  }

  showShotReplay(kind = 'last') {
    const replay = storage.getShotReplay(this.level.id, kind);
    if (!replay?.samples?.length || Number(replay.levelId) !== this.level.id) {
      this.showToast(kind === 'best' ? 'No best replay yet' : 'No last-shot replay yet');
      return;
    }
    this.stopReplay();
    const samples = replay.samples.slice(0, 180).filter((sample) => Number.isFinite(sample.x) && Number.isFinite(sample.z));
    if (samples.length < 2) {
      this.showToast('Replay data was not usable');
      return;
    }
    const points = samples.map((sample) => new THREE.Vector3(sample.x, this.heightAt(sample.x, sample.z) + 0.18, sample.z));
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: kind === 'best' ? 0xffd36d : 0xccefff, transparent: true, opacity: 0.65 })
    );
    this.replayGroup.add(line);
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(BALL_RADIUS * 0.82, 20, 14),
      new THREE.MeshPhysicalMaterial({ color: kind === 'best' ? 0xffd36d : 0xdaf7ff, roughness: 0.35, transparent: true, opacity: 0.58 })
    );
    ball.position.copy(points[0]);
    this.replayGroup.add(ball);
    this.currentReplay = { points, ball, index: 0, elapsed: 0 };
    this.replayGroup.visible = true;
    this.showToast(kind === 'best' ? 'Best shot replay' : 'Last shot replay');
  }

  updateReplay(delta) {
    if (!this.currentReplay?.points?.length) return;
    this.currentReplay.elapsed += delta * 26;
    const index = Math.min(this.currentReplay.points.length - 1, Math.floor(this.currentReplay.elapsed));
    this.currentReplay.ball.position.copy(this.currentReplay.points[index]);
    if (index >= this.currentReplay.points.length - 1 && !this.replayFinishTimer) {
      this.replayFinishTimer = setTimeout(() => this.stopReplay(), 900);
    }
  }

  stopReplay() {
    clearTimeout(this.replayFinishTimer);
    this.replayFinishTimer = null;
    this.replayGroup.visible = false;
    this.currentReplay = null;
    clearObjectGroup(this.replayGroup, { disposeMaterials: true });
  }

  resetStats() {
    if (!window.confirm('Reset local stats and match history for Ivory Golf Royale 3D?')) return;
    storage.resetStats();
    this.buildProfilePanel();
    this.buildHistoryPanel();
    this.showToast('Local stats reset');
  }

  showTutorial(force = false) {
    if (!force && storage.isTutorialCompleted()) return;
    this.tutorialIndex = 0;
    this.renderTutorial();
    this.ui.tutorialModal.classList.add('is-visible');
    this.ui.tutorialModal.setAttribute('aria-hidden', 'false');
  }

  renderTutorial() {
    const step = TUTORIAL_STEPS[this.tutorialIndex];
    this.ui.tutorialTitle.textContent = step.title;
    this.ui.tutorialText.textContent = step.text;
    this.ui.tutorialDots.innerHTML = TUTORIAL_STEPS.map((_, index) => `<span class="${index === this.tutorialIndex ? 'is-active' : ''}"></span>`).join('');
    this.ui.tutorialNext.textContent = this.tutorialIndex === TUTORIAL_STEPS.length - 1 ? 'Finish' : 'Next';
  }

  nextTutorialStep() {
    if (this.tutorialIndex >= TUTORIAL_STEPS.length - 1) {
      this.finishTutorial();
      return;
    }
    this.tutorialIndex += 1;
    this.renderTutorial();
  }

  finishTutorial() {
    storage.setTutorialCompleted(true);
    this.ui.tutorialModal.classList.remove('is-visible');
    this.ui.tutorialModal.setAttribute('aria-hidden', 'true');
  }

  updateGhostVisual() {
    clearObjectGroup(this.ghostGroup, { disposeMaterials: true });
    const ghost = storage.getGhost(this.level.id);
    if (!this.settings.showGhost || !ghost?.samples?.length || Number(ghost.levelId) !== this.level.id || this.session.mode === GAME_MODES.PRACTICE && !this.settings.showGhost) {
      this.ghostGroup.visible = false;
      return;
    }
    const samples = ghost.samples.slice(0, 180).filter((sample) => Number.isFinite(sample.x) && Number.isFinite(sample.z));
    if (samples.length < 2) {
      this.ghostGroup.visible = false;
      return;
    }
    const points = samples.map((sample) => new THREE.Vector3(sample.x, this.heightAt(sample.x, sample.z) + 0.12, sample.z));
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: 0xffe7ad, transparent: true, opacity: 0.38 })
    );
    this.ghostGroup.add(line);
    for (let i = 0; i < points.length; i += 28) {
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.075, 12, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.32 })
      );
      dot.position.copy(points[i]);
      this.ghostGroup.add(dot);
    }
    this.ghostGroup.visible = true;
  }

  updateCamera(delta) {
    this.cameraRig.update(this.camera, this.ball, {
      level: this.level,
      velocity: this.physics.velocity,
      aimDirection: this.aimDirection,
      previewing: this.state === STATES.PREVIEW,
      settings: this.settings
    }, delta);
  }

  toggleCamera() {
    const mode = this.cameraRig.nextMode();
    this.settings.cameraMode = mode;
    storage.saveSettings(this.settings);
    this.updateCameraButton();
    this.showToast(`Camera: ${this.modeLabel(mode)}`);
  }

  applyQualitySettings() {
    const preset = QUALITY_PRESETS[this.settings.graphicsQuality] ?? QUALITY_PRESETS.high;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, preset.pixelRatio));
    if (this.keyLight) {
      this.keyLight.castShadow = preset.shadowMapSize > 0;
      this.keyLight.shadow.mapSize.set(preset.shadowMapSize, preset.shadowMapSize);
      this.keyLight.shadow.needsUpdate = true;
    }
    this.renderer.shadowMap.enabled = preset.shadowMapSize > 0;
    if (this.effects) this.effects.setQuality({ trailSamples: preset.trailSamples, particles: preset.particles });
  }

  applyComfortSettings() {
    document.body.classList.toggle('large-ui', Boolean(this.settings.largeText));
    document.body.classList.toggle('left-hand-controls', Boolean(this.settings.leftHandControls));
    this.materials.aim.color.setHex(this.settings.highContrastAim ? 0x004cff : 0xf8d886);
    this.materials.prediction.color.setHex(this.settings.highContrastAim ? 0x00f5ff : 0xfff4ce);
  }

  enterFullscreen() {
    const target = document.documentElement;
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
      return;
    }
    target.requestFullscreen?.().catch(() => this.showToast('Fullscreen is not available here'));
  }

  updateCameraButton() {
    this.ui.cameraButton.textContent = this.modeLabel(this.cameraRig.mode);
  }

  modeLabel(mode) {
    if (mode === 'follow') return 'Follow';
    if (mode === 'orbit') return 'Orbit';
    if (mode === 'top') return 'Top';
    return 'Cinematic';
  }

  openPanel(panelKey) {
    const panel = this.ui[panelKey];
    if (!panel) return;
    this.closeAllPanels();
    if (panelKey === 'achievementsPanel') this.buildAchievementsGrid();
    if (panelKey === 'profilePanel') this.buildProfilePanel();
    if (panelKey === 'historyPanel') this.buildHistoryPanel();
    if (panelKey === 'lockerPanel') this.buildLockerPanel();
    if (panelKey === 'dailyPanel') this.buildDailyPanel();
    if (panelKey === 'modePanel') this.buildModeGrid();
    panel.classList.add('is-visible');
    panel.setAttribute('aria-hidden', 'false');
    if (panelKey === 'levelPanel') {
      this.panelReturnState = this.state;
      if (this.state === STATES.MENU) this.setState(STATES.LEVEL_SELECT);
    }
  }

  closePanel(panelId) {
    const panel = document.querySelector(`#${panelId}`);
    panel?.classList.remove('is-visible');
    panel?.setAttribute('aria-hidden', 'true');
    if (this.state === STATES.LEVEL_SELECT) {
      this.setState(this.panelReturnState === STATES.LEVEL_SELECT ? STATES.MENU : this.panelReturnState);
    }
  }

  closeAllPanels() {
    for (const panel of [
      this.ui.levelPanel,
      this.ui.helpPanel,
      this.ui.settingsPanel,
      this.ui.modePanel,
      this.ui.setupPanel,
      this.ui.achievementsPanel,
      this.ui.profilePanel,
      this.ui.historyPanel,
      this.ui.lockerPanel,
      this.ui.dailyPanel
    ]) {
      if (!panel) continue;
      panel.classList.remove('is-visible');
      panel.setAttribute('aria-hidden', 'true');
    }
  }

  buildLevelGrid() {
    let totalStars = 0;
    let completed = 0;
    for (const level of LEVELS) {
      const best = this.bestScores[String(level.id)];
      const stars = best?.stars || (best?.shots ? starsForScore(best.shots, level.par) : 0);
      totalStars += stars;
      if (best) completed += 1;
    }

    const activePack = getCoursePack(this.levelGridPackId);
    const levels = getCourseLevels(activePack.id, 12);
    this.ui.levelGrid.innerHTML = `
      <div class="level-pack-tabs">
        ${COURSE_PACKS.map((pack) => `<button class="${pack.id === activePack.id ? 'is-selected' : ''}" data-level-pack="${pack.id}" type="button">${pack.name}</button>`).join('')}
      </div>
      ${levels.map((level) => {
        const index = getLevelIndexById(level.id);
        const locked = !this.isLevelUnlocked(level);
        const best = this.bestScores[String(level.id)];
        const stars = best?.stars || (best?.shots ? starsForScore(best.shots, level.par) : 0);
        return `<button class="level-card${locked ? ' is-locked' : ''}${index === this.levelIndex ? ' is-current' : ''}${best ? ' is-complete' : ''}" data-level-id="${level.id}" ${locked ? 'disabled' : ''} type="button">
          <span>${activePack.name} ${activePack.levelIds.indexOf(level.id) + 1} - ${level.difficulty}</span>
          <strong>${level.name}</strong>
          <small>${locked ? 'Locked' : `Par ${level.par} | Best ${bestLabel(best)}`}</small>
          <b class="level-stars">${starEntities(stars)}</b>
        </button>`;
      }).join('')}
    `;

    this.ui.levelGrid.querySelectorAll('[data-level-pack]').forEach((button) => {
      button.addEventListener('click', () => {
        this.levelGridPackId = button.dataset.levelPack;
        this.buildLevelGrid();
      });
    });
    this.ui.levelGrid.querySelectorAll('[data-level-id]').forEach((button) => {
      button.addEventListener('click', () => this.startLevel(getLevelIndexById(Number(button.dataset.levelId))));
    });

    this.ui.totalStars.textContent = String(totalStars);
    this.ui.progressPercent.textContent = `${Math.round((completed / LEVELS.length) * 100)}%`;
  }

  updateUi() {
    const best = this.bestScores[String(this.level.id)];
    this.ui.levelText.textContent = `Level ${this.level.id}`;
    this.ui.shotsText.textContent = String(this.shots);
    this.ui.penaltiesText.textContent = String(this.penalties);
    this.ui.bestText.textContent = bestLabel(best);
    this.ui.parText.textContent = String(this.level.par);
    this.ui.modeText.textContent = MODE_LABELS[this.session.mode] ?? 'Solo';
    if (this.ui.turnText) this.ui.turnText.textContent = this.currentTurnLabel();
    if (this.session.mode === GAME_MODES.TIME_TRIAL) {
      const ms = this.session.timer.elapsedMs + this.session.timer.penaltySeconds * 1000;
      this.ui.timerText.textContent = formatTime(ms);
    } else {
      this.ui.timerText.textContent = '--';
    }
    this.ui.powerFill.style.width = `${Math.round(this.power * 100)}%`;
    this.ui.powerValue.textContent = `${Math.round(this.power * 100)}%`;
    if (!this.isOnlineMode()) this.ui.onlineScoreboard?.classList.remove('is-visible');
    this.updateCameraButton();
  }

  showToast(message) {
    this.ui.toast.textContent = message;
    this.ui.toast.classList.add('is-visible');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.ui.toast.classList.remove('is-visible'), 1450);
  }

  createQaPanel() {
    if (this.qaPanel) return;
    this.qaPanel = document.createElement('aside');
    this.qaPanel.className = 'qa-panel';
    this.qaPanel.setAttribute('aria-label', 'Debug QA panel');
    document.body.appendChild(this.qaPanel);
  }

  updateQaPanel() {
    if (!this.qaPanel) return;
    this.qaFrameCount += 1;
    const now = performance.now();
    if (now - this.qaLastTime < 500) return;
    this.qaFps = Math.round((this.qaFrameCount * 1000) / (now - this.qaLastTime));
    this.qaFrameCount = 0;
    this.qaLastTime = now;
    this.qaPanel.innerHTML = `
      <strong>Ivory QA</strong>
      <span>FPS ${this.qaFps}</span>
      <span>Mode ${escapeHtml(MODE_LABELS[this.session.mode] ?? this.session.mode)}</span>
      <span>Level ${this.level.id}: ${escapeHtml(this.level.name)}</span>
      <span>State ${this.state}</span>
      <span>Socket ${this.online.connected ? 'online' : 'offline'}</span>
      <span>Quality ${this.settings.graphicsQuality}</span>
      <span>Save v${storage.getSave().version}</span>
      <span>${DEV_UNLOCK_ALL ? 'Unlock test on' : 'Progression on'}</span>
    `;
  }

  resetProgress() {
    if (!window.confirm('Reset all local Ivory Golf Royale 3D progress?')) return;
    storage.resetProgress();
    this.unlockedLevel = getCurrentUnlockedLevel();
    if (DEV_UNLOCK_ALL) {
      storage.setUnlockedLevel(this.unlockedLevel);
      for (const pack of COURSE_PACKS) storage.setUnlockedForPack(pack.id, pack.levelIds.length);
    }
    this.bestScores = {};
    this.settings = storage.getSettings();
    this.selectedPackId = getCoursePack(this.settings.lastPackId).id;
    this.levelGridPackId = this.selectedPackId;
    this.audio.settings = this.settings;
    this.audio.setEnabled(this.settings.sound);
    this.cameraRig.setMode(this.settings.cameraMode);
    this.bindSettingsValues();
    this.buildLevelGrid();
    this.buildAchievementsGrid();
    this.buildProfilePanel();
    this.buildHistoryPanel();
    this.buildLockerPanel();
    this.buildDailyPanel();
    this.applyCosmetics();
    this.applyComfortSettings();
    this.applyQualitySettings();
    this.updateGhostVisual();
    this.updateUi();
    this.showToast('Local progress reset');
  }

  bindSettingsValues() {
    this.ui.soundToggle.checked = this.settings.sound;
    this.ui.musicToggle.checked = this.settings.music;
    this.ui.shakeToggle.checked = this.settings.cameraShake;
    this.ui.trailToggle.checked = this.settings.ballTrail;
    this.ui.aimAssistToggle.checked = this.settings.aimAssist;
    this.ui.ghostToggle.checked = this.settings.showGhost;
    if (this.ui.qualitySelect) this.ui.qualitySelect.value = this.settings.graphicsQuality;
    if (this.ui.cinematicsToggle) this.ui.cinematicsToggle.checked = this.settings.reduceCinematics;
    if (this.ui.contrastAimToggle) this.ui.contrastAimToggle.checked = this.settings.highContrastAim;
    if (this.ui.largeTextToggle) this.ui.largeTextToggle.checked = this.settings.largeText;
    if (this.ui.leftHandToggle) this.ui.leftHandToggle.checked = this.settings.leftHandControls;
  }

  heightAt(x, z) {
    return getSurfaceHeight(this.level, x, z, this.obstacles?.getPlatforms?.() ?? []);
  }

  isBallOnCourse() {
    return isPointOnCourse(this.level, this.physics.position.x, this.physics.position.y, 0.28, this.obstacles.getPlatforms());
  }

  animateFlags(delta) {
    const time = performance.now() * 0.002;
    for (const flag of this.flagMeshes) {
      flag.rotation.y = -0.28 + Math.sin(time) * 0.08;
      flag.position.y = flag.userData.baseY + Math.sin(time * 1.7) * 0.025;
    }
  }
}
