import * as THREE from 'three';
import { CameraController } from './camera-controller.js';
import { CarromBoardBuilder } from './carrom-board-builder.js';
import { LightingRig } from './lighting-rig.js';
import { MaterialLibrary } from './material-library.js';
import { PieceFactory } from './piece-factory.js';
import { PhysicsWorld } from '../physics/physics-world.js';
import { AimLineRenderer } from './aim-line-renderer.js';
import { InputController } from '../input/input-controller.js';
import { VFXManager } from '../vfx/vfx-manager.js';
import { CARROM_BOARD, composeBoardStyleTheme, getQualityProfile } from '../config/carrom-constants.js';

export class SceneRenderer {
  constructor({ canvas, root, theme, settings, physicsCallbacks = {}, inputCallbacks = {}, debugPhysics = false }) {
    this.canvas = canvas;
    this.root = root;
    this.theme = theme;
    this.settings = settings;
    this.boardStyleId = 'ivory';
    this.physicsCallbacks = physicsCallbacks;
    this.inputCallbacks = inputCallbacks;
    this.debugPhysics = debugPhysics;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(theme.scene.background);
    this.scene.fog = new THREE.Fog(theme.scene.fog, 12, 25);
    this.clock = new THREE.Clock();
    this.animationFrame = 0;
    this.pendingResizeFrame = 0;
    this.qualityProfile = getQualityProfile(settings.quality);
    this.cosmeticSceneOverrides = {};
    this.cosmeticVfxPreset = {};
    this.stageGroup = new THREE.Group();
    this.stageGroup.name = 'carrom-royale-scene-root';
    this.trainingHighlightGroup = new THREE.Group();
    this.trainingHighlightGroup.name = 'training-challenge-highlights';
    this.particles = [];
    this.sceneObjects = {
      pockets: [],
      pieces: []
    };
    this.sceneOrbitEnabled = false;
    this.orbitPointerId = null;

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
    this.cameraController = new CameraController(this.camera);
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.handleSceneOrbitDown = this.handleSceneOrbitDown.bind(this);
    this.handleSceneOrbitMove = this.handleSceneOrbitMove.bind(this);
    this.handleSceneOrbitUp = this.handleSceneOrbitUp.bind(this);
  }

  init() {
    this.materialLibrary = new MaterialLibrary(this.theme);
    this.cameraController.init();
    this.lighting = new LightingRig(this.scene, this.theme);
    this.scene.add(this.stageGroup);
    this.createScene();
    this.stageGroup.add(this.trainingHighlightGroup);
    this.canvas?.addEventListener('pointerdown', this.handleSceneOrbitDown, { passive: false });
    this.canvas?.addEventListener('pointermove', this.handleSceneOrbitMove, { passive: false });
    this.canvas?.addEventListener('pointerup', this.handleSceneOrbitUp, { passive: false });
    this.canvas?.addEventListener('pointercancel', this.handleSceneOrbitUp, { passive: false });
    this.canvas?.addEventListener('lostpointercapture', this.handleSceneOrbitUp, { passive: false });
    this.resize();
    this.animate();
  }

  createScene() {
    this.createEnvironment();

    this.boardBuilder = new CarromBoardBuilder({
      materialLibrary: this.materialLibrary,
      theme: this.theme
    });
    const board = this.boardBuilder.build();
    this.stageGroup.add(board.group);
    this.sceneObjects.pockets = board.pockets;

    this.pieceFactory = new PieceFactory({ materialLibrary: this.materialLibrary });
    const pieces = this.pieceFactory.createInitialPieces();
    this.stageGroup.add(pieces.group);
    this.sceneObjects.pieces = pieces.pieces;

    this.aimLineRenderer = new AimLineRenderer({
      parent: this.stageGroup,
      theme: this.theme
    });
    this.vfxManager = new VFXManager({
      sceneParent: this.stageGroup,
      root: this.root,
      theme: this.theme
    });
    this.vfxManager.setReducedEffects(this.settings.reducedEffects);
    this.vfxManager.setQualityProfile(this.qualityProfile);

    this.physicsWorld = new PhysicsWorld({
      pieces: this.sceneObjects.pieces,
      pockets: this.sceneObjects.pockets,
      onShotStarted: () => {
        this.inputController?.handleShotStarted();
        this.physicsCallbacks.onShotStarted?.();
      },
      onPiecePocketed: (piece) => {
        this.vfxManager?.playPocketEffect(piece, piece.pocketPosition);
        if (piece.type === 'queen') {
          this.vfxManager?.playQueenPocketEffect(piece.pocketPosition);
        }
        this.physicsCallbacks.onPiecePocketed?.(piece);
      },
      onShotSettled: (summary) => {
        this.inputController?.handleShotSettled(summary);
        this.physicsCallbacks.onShotSettled?.(summary);
      },
      onCollision: (event) => {
        this.vfxManager?.playCoinCollision(event);
        this.physicsCallbacks.onCollision?.(event);
      },
      onStatus: (status) => this.physicsCallbacks.onStatus?.(status),
      debugPhysics: this.debugPhysics
    });

    this.inputController = new InputController({
      canvas: this.canvas,
      camera: this.camera,
      physicsWorld: this.physicsWorld,
      aimLineRenderer: this.aimLineRenderer,
      callbacks: this.inputCallbacks
    });
  }

  createEnvironment() {
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 18),
      this.materialLibrary.get('tableBase')
    );
    floor.name = 'luxury-lounge-floor';
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.56;
    floor.receiveShadow = true;
    this.stageGroup.add(floor);

    this.particleMaterial = new THREE.MeshStandardMaterial({
      color: this.theme.scene.particle,
      emissive: new THREE.Color(this.theme.scene.particle),
      emissiveIntensity: 0.38,
      roughness: 0.5,
      metalness: 0.08,
      transparent: true,
      opacity: 0.34
    });
    for (let index = 0; index < 26; index += 1) {
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.012 + Math.random() * 0.022, 10, 10),
        this.particleMaterial
      );
      particle.name = `ambient-gold-dust-${index + 1}`;
      particle.position.set(
        (Math.random() - 0.5) * 9.4,
        0.5 + Math.random() * 3.4,
        (Math.random() - 0.5) * 7.8
      );
      particle.userData.baseY = particle.position.y;
      particle.userData.phase = Math.random() * Math.PI * 2;
      particle.userData.float = 0.08 + Math.random() * 0.2;
      this.stageGroup.add(particle);
      this.particles.push(particle);
    }
  }

  resize() {
    const width = Math.round(window.visualViewport?.width || window.innerWidth || 1);
    const height = Math.round(window.visualViewport?.height || window.innerHeight || 1);
    const mobile = width <= 760 || height <= 560;
    const pixelRatio = mobile
      ? this.qualityProfile.pixelRatioMobile
      : this.qualityProfile.pixelRatioDesktop;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.cameraController.setViewport(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatio));
    this.renderer.setSize(width, height, false);
  }

  requestResize() {
    if (this.pendingResizeFrame) {
      return;
    }

    this.pendingResizeFrame = window.requestAnimationFrame(() => {
      this.pendingResizeFrame = 0;
      this.resize();
    });
  }

  setStateFocus(state) {
    this.cameraController.focusForState(state);
    this.inputController?.setEnabled(state === 'playing');
  }

  setSceneOrbitEnabled(enabled) {
    this.sceneOrbitEnabled = Boolean(enabled);
    this.canvas?.classList.toggle('is-orbit-enabled', this.sceneOrbitEnabled);
    this.canvas?.classList.remove('is-orbiting');
    this.cameraController?.setManualOrbitEnabled(this.sceneOrbitEnabled);
    if (!this.sceneOrbitEnabled) {
      this.orbitPointerId = null;
      this.cameraController?.endManualOrbit();
    }
  }

  handleSceneOrbitDown(event) {
    if (!this.sceneOrbitEnabled || !this.isSceneOrbitPointer(event)) {
      return;
    }

    event.preventDefault();
    this.orbitPointerId = event.pointerId;
    this.canvas?.setPointerCapture?.(event.pointerId);
    this.canvas?.classList.add('is-orbiting');
    this.cameraController?.beginManualOrbit(event.clientX, event.clientY);
  }

  isSceneOrbitPointer(event) {
    if (event.pointerType === 'touch') {
      return event.isPrimary !== false;
    }

    if (event.pointerType === 'pen') {
      return event.button === 0 || event.buttons === 1 || event.button === -1;
    }

    return event.button === 0;
  }

  handleSceneOrbitMove(event) {
    if (!this.sceneOrbitEnabled || event.pointerId !== this.orbitPointerId) {
      return;
    }

    event.preventDefault();
    this.cameraController?.updateManualOrbit(event.clientX, event.clientY);
  }

  handleSceneOrbitUp(event) {
    if (this.orbitPointerId === null || event.pointerId !== this.orbitPointerId) {
      return;
    }

    try {
      this.canvas?.releasePointerCapture?.(this.orbitPointerId);
    } catch {
      // Pointer capture can already be released by the browser.
    }
    this.orbitPointerId = null;
    this.canvas?.classList.remove('is-orbiting');
    this.cameraController?.endManualOrbit();
  }

  applySettings(settings) {
    this.settings = settings;
    this.applyQualityProfile(settings.quality);
    this.cameraController.updateIdleMotion(settings.cameraMotion && !settings.reducedEffects);
    this.vfxManager?.setReducedEffects(settings.reducedEffects);
    this.resize();
  }

  applyQualityProfile(quality = 'auto') {
    this.qualityProfile = getQualityProfile(quality);
    this.renderer.shadowMap.enabled = Boolean(this.qualityProfile.shadowEnabled);
    this.lighting?.applyQuality(this.qualityProfile);
    this.vfxManager?.setQualityProfile(this.qualityProfile);
    const visibleParticles = Math.ceil(this.particles.length * this.qualityProfile.ambientParticleScale);
    this.particles.forEach((particle, index) => {
      particle.visible = index < visibleParticles;
    });
  }

  applyTheme(theme) {
    this.theme = theme;
    const visualTheme = this.getVisualTheme();
    this.scene.background.set(visualTheme.scene.background);
    this.scene.fog.color.set(visualTheme.scene.fog);
    this.lighting?.applyTheme(visualTheme);
    this.materialLibrary?.applyTheme(theme, this.boardStyleId, this.cosmeticSceneOverrides);
    this.boardBuilder?.applyTheme(theme, this.boardStyleId, this.cosmeticSceneOverrides);
    this.aimLineRenderer?.applyTheme(visualTheme);
    this.vfxManager?.applyTheme(visualTheme);
    this.vfxManager?.setCosmeticPreset?.(this.cosmeticVfxPreset);
    if (this.particleMaterial) {
      this.particleMaterial.color.set(visualTheme.scene.particle);
      this.particleMaterial.emissive.set(visualTheme.scene.particle);
    }
  }

  setBoardStyle(boardStyleId = 'ivory') {
    this.boardStyleId = boardStyleId || 'ivory';
    this.materialLibrary?.applyTheme(this.theme, this.boardStyleId, this.cosmeticSceneOverrides);
    this.boardBuilder?.applyTheme(this.theme, this.boardStyleId, this.cosmeticSceneOverrides);
    this.applyTheme(this.theme);
  }

  getVisualTheme() {
    const composed = composeBoardStyleTheme(this.theme, this.boardStyleId);
    return {
      ...composed,
      scene: {
        ...composed.scene,
        ...this.cosmeticSceneOverrides
      }
    };
  }

  applyCosmeticLoadout(loadout = {}, tokens = {}) {
    this.cosmeticLoadout = { ...loadout };
    this.cosmeticSceneOverrides = { ...(tokens.scene || {}) };
    this.cosmeticVfxPreset = { ...(tokens.vfx || {}) };
    this.applyTheme(this.theme);
  }

  animate = () => {
    const delta = Math.min(this.clock.getDelta(), 0.04);
    const elapsed = this.clock.elapsedTime;
    this.cameraController.update(delta);
    this.physicsWorld?.update(delta);
    this.vfxManager?.update(delta);

    this.particles.forEach((particle, index) => {
      if (!particle.visible) {
        return;
      }
      particle.position.y = particle.userData.baseY + Math.sin(elapsed * 0.42 + particle.userData.phase + index) * particle.userData.float;
      particle.rotation.y = elapsed * 0.12 + index;
    });

    this.renderer.render(this.scene, this.camera);
    this.animationFrame = window.requestAnimationFrame(this.animate);
  };

  applyDevTestShot() {
    return this.physicsWorld?.applyDevTestShot() || false;
  }

  resetPhysics() {
    this.physicsWorld?.reset();
    this.inputController?.reset();
    this.vfxManager?.clear();
    this.clearTrainingHighlights();
  }

  prepareForTurn({ baseline = 'bottom', cameraBaseline = baseline, enabled = true, silent = true, rotateCamera = true } = {}) {
    if (rotateCamera) {
      this.cameraController?.setGameplaySide(cameraBaseline);
    } else {
      this.cameraController?.setGameplaySide('bottom', { immediate: true });
    }
    this.inputController?.prepareForTurn({ baseline, enabled, silent });
  }

  setActiveBaseline(baseline, { cameraBaseline = baseline, rotateCamera = true } = {}) {
    if (rotateCamera) {
      this.cameraController?.setGameplaySide(cameraBaseline);
    } else {
      this.cameraController?.setGameplaySide('bottom', { immediate: true });
    }
    this.inputController?.setActiveBaseline(baseline);
  }

  setInputEnabled(enabled) {
    this.inputController?.setEnabled(enabled);
  }

  returnPieceToBoard(id, preferredPosition = null) {
    return this.physicsWorld?.returnBodyToBoard(id, preferredPosition) || null;
  }

  applyTrainingScenario(scenario = {}) {
    this.clearFeedback();
    this.physicsWorld?.applyTrainingScenario(scenario);
    this.inputController?.reset();
    this.showTrainingHighlights(scenario.highlights || []);
  }

  clearTrainingScenario() {
    this.clearFeedback();
    this.clearTrainingHighlights();
    this.physicsWorld?.clearTrainingScenario();
    this.inputController?.reset();
  }

  showTrainingHighlights(highlights = []) {
    this.clearTrainingHighlights();
    highlights.forEach((highlight) => {
      const mesh = this.createTrainingHighlight(highlight);
      if (mesh) {
        this.trainingHighlightGroup.add(mesh);
      }
    });
  }

  createTrainingHighlight(highlight = {}) {
    const gold = highlight.tone === 'queen' ? 0xe95f48 : 0xe5bc72;
    const material = new THREE.MeshBasicMaterial({
      color: gold,
      transparent: true,
      opacity: highlight.tone === 'queen' ? 0.42 : 0.34,
      depthWrite: false
    });

    if (highlight.type === 'piece') {
      const body = this.physicsWorld?.getBody(highlight.pieceId);
      if (!body || body.isPocketed) {
        material.dispose();
        return null;
      }
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(body.radius * 1.28, body.radius * 1.7, 56),
        material
      );
      ring.name = `training-highlight-${highlight.id || highlight.pieceId}`;
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(body.position.x, body.visualY + 0.025, body.position.z);
      ring.renderOrder = 12;
      return ring;
    }

    if (highlight.type === 'pocket') {
      const pocket = this.sceneObjects.pockets.find((item) => item.id === highlight.pocketId);
      if (!pocket) {
        material.dispose();
        return null;
      }
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(CARROM_BOARD.POCKET_RADIUS * 1.06, CARROM_BOARD.POCKET_RADIUS * 1.36, 64),
        material
      );
      ring.name = `training-highlight-${highlight.id || highlight.pocketId}`;
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(pocket.position.x, CARROM_BOARD.SURFACE_Y + 0.045, pocket.position.z);
      ring.renderOrder = 11;
      return ring;
    }

    if (highlight.type === 'baseline') {
      const z = highlight.baseline === 'top' ? -CARROM_BOARD.BASELINE_OFFSET : CARROM_BOARD.BASELINE_OFFSET;
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(CARROM_BOARD.BASELINE_HALF_LENGTH * 2, 0.018, 0.045),
        material
      );
      bar.name = `training-highlight-${highlight.id || 'baseline'}`;
      bar.position.set(0, CARROM_BOARD.SURFACE_Y + 0.05, z);
      bar.renderOrder = 10;
      return bar;
    }

    if (highlight.type === 'center') {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.18, 0.86, 72),
        material
      );
      ring.name = `training-highlight-${highlight.id || 'center'}`;
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(0, CARROM_BOARD.SURFACE_Y + 0.05, 0);
      ring.renderOrder = 10;
      return ring;
    }

    material.dispose();
    return null;
  }

  clearTrainingHighlights() {
    if (!this.trainingHighlightGroup) {
      return;
    }
    [...this.trainingHighlightGroup.children].forEach((child) => {
      this.trainingHighlightGroup.remove(child);
      child.geometry?.dispose?.();
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => material.dispose?.());
      } else {
        child.material?.dispose?.();
      }
    });
  }

  getBoardSnapshot() {
    return this.physicsWorld?.getBoardSnapshot() || null;
  }

  applyBoardSnapshot(snapshot = {}) {
    const applied = this.physicsWorld?.applyBoardSnapshot(snapshot) || null;
    this.inputController?.reset();
    return applied;
  }

  placeStrikerForBot(position) {
    if (!position) {
      return false;
    }
    this.setInputEnabled(false);
    const placed = this.physicsWorld?.setStrikerPosition(position.x, position.z) || false;
    if (placed) {
      this.aimLineRenderer?.showPlacement(position, true);
    }
    return placed;
  }

  applyAuthoritativeShot({ strikerPosition, direction, power } = {}) {
    this.setInputEnabled(false);
    if (strikerPosition) {
      this.physicsWorld?.setBodyPosition('striker-1', strikerPosition, { visible: true, pocketed: false });
    }
    this.inputController?.handleShotStarted();
    return this.physicsWorld?.applyStrikerShot(direction, power) || false;
  }

  previewBotShot(plan) {
    if (!plan?.strikerPosition || !plan?.direction) {
      this.clearBotPreview();
      return;
    }

    this.aimLineRenderer?.hidePlacement();
    this.aimLineRenderer?.showAim({
      start: plan.strikerPosition,
      direction: plan.direction,
      powerRatio: plan.powerRatio || 0,
      valid: true
    });
  }

  fireBotShot(plan) {
    if (!plan?.direction) {
      return false;
    }

    this.clearBotPreview();
    return this.physicsWorld?.applyStrikerShot(plan.direction, plan.power) || false;
  }

  clearBotPreview() {
    this.aimLineRenderer?.hide();
  }

  playMatchIntro(players, matchInfo = {}) {
    this.vfxManager?.playMatchIntro(players, matchInfo);
    this.cameraController.playIntroSweep();
  }

  playShotRelease(powerRatio = 0.5) {
    const striker = this.physicsWorld?.getStrikerBody();
    this.vfxManager?.playShotRelease(powerRatio, striker?.position);
    this.cameraController.shotNudge(powerRatio);
  }

  playRuleFeedback({ ruleResult, currentPlayer, activePlayer, winner } = {}) {
    if (!ruleResult) {
      return;
    }

    if (ruleResult.isFoul) {
      this.vfxManager?.playFoulEffect(ruleResult.foulType);
      this.cameraController.foulPulse();
      return;
    }

    if (ruleResult.queenCovered) {
      this.vfxManager?.playQueenCoveredEffect();
    } else if (ruleResult.queenReturned) {
      this.vfxManager?.playQueenReturnedEffect();
    } else if (ruleResult.queenPending) {
      this.vfxManager?.banner.show({
        eyebrow: 'Queen',
        title: 'Cover the Queen',
        detail: `${currentPlayer?.name || 'Player'} gets one cover shot`,
        tone: 'warning',
        reduced: this.settings.reducedEffects
      });
    }

    if (winner) {
      this.vfxManager?.playWinnerEffect(winner);
      this.cameraController.winnerView();
      return;
    }

    this.vfxManager?.playTurnChange(activePlayer || currentPlayer, !ruleResult.shouldSwitchTurn);
  }

  playWinnerEffect(winner) {
    this.vfxManager?.playWinnerEffect(winner);
    this.cameraController.winnerView();
  }

  playResetEffect() {
    this.vfxManager?.playResetEffect();
  }

  clearFeedback() {
    this.aimLineRenderer?.hide();
    this.vfxManager?.clear();
    this.cameraController?.clearFeedback?.();
  }

  getPhysicsSummary() {
    return this.physicsWorld?.getSummary() || null;
  }

  dispose() {
    window.cancelAnimationFrame(this.animationFrame);
    if (this.pendingResizeFrame) {
      window.cancelAnimationFrame(this.pendingResizeFrame);
      this.pendingResizeFrame = 0;
    }
    this.inputController?.dispose();
    this.canvas?.removeEventListener('pointerdown', this.handleSceneOrbitDown);
    this.canvas?.removeEventListener('pointermove', this.handleSceneOrbitMove);
    this.canvas?.removeEventListener('pointerup', this.handleSceneOrbitUp);
    this.canvas?.removeEventListener('pointercancel', this.handleSceneOrbitUp);
    this.canvas?.removeEventListener('lostpointercapture', this.handleSceneOrbitUp);
    this.clearTrainingHighlights();
    this.aimLineRenderer?.dispose();
    this.vfxManager?.dispose();
    this.physicsWorld?.dispose();
    this.lighting?.dispose();
    this.boardBuilder?.dispose();
    this.pieceFactory?.dispose();
    this.scene.traverse((object) => {
      if (!object.isMesh) {
        return;
      }
      object.geometry?.dispose?.();
    });
    this.particleMaterial?.dispose();
    this.materialLibrary?.dispose();
    this.renderer.dispose();
  }
}
