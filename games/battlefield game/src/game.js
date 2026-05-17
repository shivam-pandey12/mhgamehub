import {
  Clock,
  Color,
  Fog,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import { BattlefieldAudioSystem } from "./audio.js";
import { createPlayerViewRig } from "./character-rigs.js";
import { BattlefieldEffects } from "./effects.js";
import { GlooWallSystem } from "./gloo-wall.js";
import { PlayerHealthSystem } from "./health.js";
import { NpcManager } from "./npc.js";
import { PlayerController } from "./player-controller.js";
import { BattleScanSystem } from "./scan.js";
import { GameUi } from "./ui.js";
import { WeaponSystem } from "./weapon.js";
import { buildWorld } from "./world.js";

const VICTORY_CINEMATIC_DURATION = 1.2;
const VICTORY_SLOW_MOTION = 0.28;
const DIFFICULTY_STORAGE_KEY = "battlefield-codex-difficulty";
const DIFFICULTY_OPTIONS = {
  easy: {
    description: "Fewer enemies with slower reactions and lighter pressure.",
    label: "Easy",
  },
  normal: {
    description: "Balanced combat with mixed aggression and standard reaction time.",
    label: "Normal",
  },
  tough: {
    description: "Fast hostile pushes with cover use, rushes, and near-constant pressure.",
    label: "Tough",
  },
};

export class BattlefieldGame {
  constructor({ canvas, uiElements }) {
    this.canvas = canvas;
    this.ui = new GameUi(uiElements);
    this.lockButton = uiElements.lockButton;
    this.restartButton = uiElements.restartButton;
    this.audio = new BattlefieldAudioSystem();
    this.effects = null;
    this.isMatchOver = false;
    this.killCount = 0;
    this.matchStarted = false;
    this.survivalTime = 0;
    this.victorySequence = null;
    this.difficulty = loadDifficulty();
    this.aimDirection = new Vector3();
    this.aimTarget = new Vector3();
    this.difficultyButtons = uiElements.difficultyButtons ?? [];
    this.difficultyNote = uiElements.difficultyNote;

    this.clock = new Clock();
    this.scene = new Scene();
    this.scene.background = new Color(0x8eb9cf);
    this.scene.fog = new Fog(0x8eb9cf, 45, 140);

    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      250,
    );
    this.scene.add(this.camera);

    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;

    const { collisionBoxes, navBounds, shootableObjects } = buildWorld(this.scene);
    this.worldTargets = shootableObjects;
    this.effects = new BattlefieldEffects({
      scene: this.scene,
    });

    this.player = new PlayerController({
      camera: this.camera,
      domElement: this.renderer.domElement,
      collisionBoxes,
      onLockChange: (isLocked) => {
        this.ui.setIntroVisible(!isLocked && !this.isMatchOver);
        this.weapon?.refreshHud(true);
      },
      onViewModeChange: (viewMode) =>
        this.ui.setTemporaryStatus(
          viewMode === "first" ? "First-person view." : "Third-person view.",
          "boost",
          1,
        ),
    });
    this.playerView = createPlayerViewRig();
    this.scene.add(this.playerView.root);
    this.applyDifficultySelection();

    this.health = new PlayerHealthSystem({
      onDeath: () => this.triggerDefeat(),
      player: this.player,
      ui: this.ui,
    });

    this.npcs = new NpcManager({
      collisionBoxes,
      coverProvider: () => this.worldTargets.concat(this.glooWalls.getShootTargets()),
      navBounds,
      onEnemyAttack: ({ position, weapon }) => {
        if (weapon === "gun") {
          this.audio.playEnemyGunshot(position, this.player.position);
        }
      },
      onEnemyCountChange: (count) => this.handleEnemyCountChange(count),
      onEnemyDefeated: () => this.handleEnemyDefeated(),
      onNpcFootstep: (position) =>
        this.audio.playNpcFootstep(position, this.player.position),
      onPlayerDamaged: (amount) => this.health.applyDamage(amount),
      difficulty: this.difficulty,
      player: this.player,
      playerSpawn: this.player.position,
      scene: this.scene,
    });

    this.glooWalls = new GlooWallSystem({
      camera: this.camera,
      collisionBoxes,
      effects: this.effects,
      navBounds,
      player: this.player,
      scene: this.scene,
      ui: this.ui,
    });

    this.scan = new BattleScanSystem({
      audio: this.audio,
      camera: this.camera,
      player: this.player,
      ui: this.ui,
    });

    this.weapon = new WeaponSystem({
      audio: this.audio,
      camera: this.camera,
      domElement: this.renderer.domElement,
      effects: this.effects,
      onGunshot: ({ position }) => {
        this.matchStarted = true;
        this.npcs.registerGunshot({
          position,
        });
      },
      player: this.player,
      targetProvider: () =>
        this.worldTargets.concat(this.glooWalls.getShootTargets(), this.npcs.getShootTargets()),
      ui: this.ui,
      viewRig: this.playerView,
    });

    this.requestSceneLock = this.requestSceneLock.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.render = this.render.bind(this);

    for (const button of this.difficultyButtons) {
      button.addEventListener("click", () => this.handleDifficultyChange(button.dataset.difficulty));
    }
    this.lockButton.addEventListener("click", this.requestSceneLock);
    this.canvas.addEventListener("click", this.requestSceneLock);
    this.restartButton.addEventListener("click", () => reloadGameDocument());
    window.addEventListener("resize", this.handleResize);

    this.handleEnemyCountChange(this.npcs.getAliveCount());
    this.handleResize();
    this.registerTouchBridge();
    this.render();
  }

  registerTouchBridge() {
    window.GameHubBattlefieldTouch = {
      enable: () => this.enableTouchMode(),
      look: (deltaX, deltaY) => {
        this.enableTouchMode();
        this.player.applyTouchLook(deltaX, deltaY);
      },
      setAiming: (isActive) => {
        this.enableTouchMode();
        this.weapon.setAiming(isActive);
      },
    };
  }

  enableTouchMode() {
    if (this.isMatchOver) {
      return;
    }

    this.matchStarted = true;
    this.player.setTouchControlsEnabled(true);
    this.ui.setIntroVisible(false);
    this.weapon.refreshHud(true);
  }

  requestSceneLock() {
    if (this.isMatchOver) {
      return;
    }

    this.matchStarted = true;
    this.player.requestPointerLock();
  }

  handleDifficultyChange(nextDifficulty) {
    const resolvedDifficulty = resolveDifficulty(nextDifficulty);
    if (resolvedDifficulty === this.difficulty) {
      return;
    }

    this.difficulty = resolvedDifficulty;
    persistDifficulty(this.difficulty);
    this.applyDifficultySelection();
    reloadGameDocument();
  }

  applyDifficultySelection() {
    for (const button of this.difficultyButtons) {
      button.classList.toggle("is-selected", button.dataset.difficulty === this.difficulty);
    }

    if (this.difficultyNote) {
      this.difficultyNote.textContent = DIFFICULTY_OPTIONS[this.difficulty].description;
    }
  }

  handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  handleEnemyCountChange(count) {
    this.ui.setEnemyCount(count);

    if (count === 0 && this.matchStarted && !this.isMatchOver && !this.victorySequence) {
      this.startVictorySequence();
    }
  }

  handleEnemyDefeated() {
    this.killCount += 1;
  }

  startVictorySequence() {
    this.victorySequence = {
      remaining: VICTORY_CINEMATIC_DURATION,
    };
    this.weapon.setDisabled(true, "Area secure.");
    this.glooWalls.setDisabled(true);
    this.npcs.setPlayerAlive(false);
    this.player.setEnabled(false);
    this.player.applyCameraShake({
      duration: 0.9,
      strength: 0.022,
    });
    this.scan.cancel();
    this.ui.setTemporaryStatus("Final hostile down.", "boost", 1.3);
  }

  concludeMatch({ detail, eyebrow, title, variant, weaponMessage }) {
    this.isMatchOver = true;
    this.victorySequence = null;
    this.player.setEnabled(false);
    this.health.setDisabled();
    this.weapon.setDisabled(true, weaponMessage);
    this.glooWalls.setDisabled(true);
    this.npcs.setPlayerAlive(false);
    this.scan.cancel();
    this.ui.setLowHealthIntensity(0);

    const weaponStats = this.weapon.getStats();
    this.ui.showResult({
      accuracy: Math.round(weaponStats.accuracy * 100),
      detail,
      eyebrow,
      kills: this.killCount,
      score: calculateScore({
        accuracy: weaponStats.accuracy,
        headshots: weaponStats.headshots,
        kills: this.killCount,
        timeSurvived: this.survivalTime,
      }),
      timeSurvived: formatTime(this.survivalTime),
      title,
      variant,
    });

    if (document.pointerLockElement === this.renderer.domElement) {
      document.exitPointerLock();
    }
  }

  triggerDefeat() {
    this.concludeMatch({
      detail: "The enemy squad closed in and dropped your health to zero.",
      eyebrow: "Mission Failed",
      title: "Game Over",
      variant: "defeat",
      weaponMessage: "Game over.",
    });
  }

  triggerVictory() {
    this.concludeMatch({
      detail: "All hostiles are down. The field is secure.",
      eyebrow: "Sector Cleared",
      title: "Victory",
      variant: "victory",
      weaponMessage: "Area secure.",
    });
  }

  updateVictorySequence(rawDelta) {
    if (!this.victorySequence) {
      return 1;
    }

    this.victorySequence.remaining = Math.max(0, this.victorySequence.remaining - rawDelta);
    if (this.victorySequence.remaining === 0) {
      this.triggerVictory();
      return 1;
    }

    return VICTORY_SLOW_MOTION;
  }

  render() {
    const rawDelta = Math.min(this.clock.getDelta(), 0.05);
    const timeScale = this.updateVictorySequence(rawDelta);
    const scaledDelta = rawDelta * timeScale;

    if (this.matchStarted && !this.isMatchOver && !this.victorySequence) {
      this.survivalTime += rawDelta;
    }

    this.player.update(scaledDelta);
    this.scan.update(rawDelta);
    this.glooWalls.setBlocked(this.scan.active || this.isMatchOver || Boolean(this.victorySequence));
    this.glooWalls.update(rawDelta);
    this.npcs.update(scaledDelta);
    this.health.update(rawDelta);
    this.weapon.setBarrierModeActive(this.glooWalls.isPlacementActive);
    this.weapon.setViewBlocked(this.scan.active);
    this.weapon.update(scaledDelta);
    this.ui.setScopeActive(this.player.isScopeActive);
    this.camera.getWorldDirection(this.aimDirection);
    this.aimTarget
      .copy(this.camera.position)
      .addScaledVector(this.aimDirection, 60);
    this.playerView.setLocomotion(this.player.movementState);
    this.playerView.setMovementIntensity({
      sprinting: this.player.isSprinting,
    });
    this.playerView.setVisible(!this.victorySequence);
    this.playerView.update(scaledDelta, {
      aiming: this.weapon.isAiming,
      aimTarget: this.aimTarget,
      crouching: this.player.isCrouching,
      movementInput: this.player.localMovementInput,
      pitch: this.player.pitch,
      position: this.player.position,
      viewMode: this.player.viewMode,
      weaponMode: this.weapon.getEquippedMode(),
      yaw: this.player.yaw,
    });
    this.effects.update(scaledDelta);
    this.audio.update(rawDelta, {
      enemyCount: this.npcs.getAliveCount(),
      matchActive: this.matchStarted,
      matchOver: this.isMatchOver || Boolean(this.victorySequence),
      player: this.player,
    });
    this.ui.update(rawDelta);
    this.scan.applyView();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render);
  }
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function calculateScore({ accuracy, headshots, kills, timeSurvived }) {
  const timeBonus = Math.max(0, Math.round(2600 - timeSurvived * 18));
  const accuracyBonus = Math.round(accuracy * 600);
  const headshotBonus = headshots * 80;
  const killScore = kills * 150;

  return killScore + timeBonus + accuracyBonus + headshotBonus;
}

function loadDifficulty() {
  try {
    if (typeof localStorage === "undefined") {
      return "normal";
    }

    return resolveDifficulty(localStorage.getItem(DIFFICULTY_STORAGE_KEY));
  } catch {
    return "normal";
  }
}

function resolveDifficulty(value) {
  return value in DIFFICULTY_OPTIONS ? value : "normal";
}

function persistDifficulty(value) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(DIFFICULTY_STORAGE_KEY, value);
    }
  } catch {
    // File-based offline pages can block storage access.
  }
}

function reloadGameDocument() {
  if (window.location.protocol !== "file:") {
    window.location.reload();
    return;
  }

  const docType = document.doctype ? `<!doctype ${document.doctype.name}>\n` : "";
  const html = `${docType}${document.documentElement.outerHTML}`;
  document.open();
  document.write(html);
  document.close();
}
