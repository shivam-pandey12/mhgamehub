import * as THREE from "three";
import { playHitSound, playLowHealthSound } from "../audio/placeholders.js";
import { InputController } from "../core/InputController.js";
import { ImpactFlashSystem } from "../effects/ImpactFlashSystem.js";
import { ExplosionSystem } from "../effects/ExplosionSystem.js";
import { PlayerShip } from "../entities/PlayerShip.js";
import { EnemyManager } from "./EnemyManager.js";
import { FollowCamera } from "./FollowCamera.js";
import { EnergySystem } from "../systems/EnergySystem.js";
import { GravitySystem } from "../systems/GravitySystem.js";
import { MotionBlurSystem } from "../systems/MotionBlurSystem.js";
import { ShieldSystem } from "../systems/ShieldSystem.js";
import { StealthSystem } from "../systems/StealthSystem.js";
import { TimeSystem } from "../systems/TimeSystem.js";
import { HUDController } from "../ui/HUDController.js";
import { ProjectileSystem } from "../weapons/ProjectileSystem.js";
import { BackdropField } from "../world/BackdropField.js";
import { EnvironmentManager } from "../world/EnvironmentManager.js";

const respawnPosition = new THREE.Vector3(0, 0, 0);

export class Game {
  constructor({ canvas }) {
    this.canvas = canvas;
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x02050e);
    this.scene.fog = new THREE.FogExp2(0x02050e, 0.0025);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 2.4, 8.5);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;

    this.input = new InputController(this.canvas);
    this.player = new PlayerShip();
    this.followCamera = new FollowCamera(this.camera, this.player);
    this.hud = new HUDController(document);
    this.motionBlurSystem = new MotionBlurSystem({ root: document });
    this.backdrop = new BackdropField();
    this.energySystem = new EnergySystem();
    this.shieldSystem = new ShieldSystem();
    this.timeSystem = new TimeSystem();
    this.projectileSystem = new ProjectileSystem({ scene: this.scene });
    this.explosionSystem = new ExplosionSystem({ scene: this.scene });
    this.impactFlashSystem = new ImpactFlashSystem({ scene: this.scene });
    this.environmentManager = new EnvironmentManager({
      scene: this.scene,
      player: this.player,
    });
    this.gravitySystem = new GravitySystem({ scene: this.scene });
    this.stealthSystem = new StealthSystem();
    this.enemyManager = new EnemyManager({
      scene: this.scene,
      player: this.player,
      projectileSystem: this.projectileSystem,
      explosionSystem: this.explosionSystem,
      environmentManager: this.environmentManager,
    });

    this.animationFrameId = null;
    this.playerRespawnTimer = 0;
    this.playerRespawnDelay = 2.2;
    this.lowHealthSoundCooldown = 0;
    this.isPaused = false;
    this.isDebugVisible = false;
    this.score = 0;
    this.kills = 0;
    this.elapsedTime = 0;
    this.bestWave = this.enemyManager.currentWave;
    this.lastWaveNumber = this.enemyManager.currentWave;

    this.handleResize = this.handleResize.bind(this);
    this.animate = this.animate.bind(this);

    this.setupScene();
  }

  setupScene() {
    const ambientLight = new THREE.AmbientLight(0x8eb8ff, 0.64);
    this.scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(0x7baeff, 0x080d18, 0.78);
    this.scene.add(hemisphereLight);

    const directionalLight = new THREE.DirectionalLight(0xdde8ff, 1.35);
    directionalLight.position.set(7, 9, 10);
    this.scene.add(directionalLight);

    const rimLight = new THREE.DirectionalLight(0x4f8fff, 0.55);
    rimLight.position.set(-12, 4, -8);
    this.scene.add(rimLight);

    const warmFill = new THREE.PointLight(0xff8f72, 1.15, 120, 2);
    warmFill.position.set(18, -8, -28);
    this.scene.add(warmFill);

    this.scene.add(this.backdrop.group);
    this.scene.add(this.player.group);
    this.hud.showBanner(
      `Wave ${this.enemyManager.currentWave}`,
      "Arrow keys move. C boosts. X shields. Shift bends time. Use planets as cover, then strike.",
      3.4,
    );
  }

  start() {
    window.addEventListener("resize", this.handleResize);
    this.clock.start();
    this.animate();
  }

  animate() {
    this.animationFrameId = window.requestAnimationFrame(this.animate);

    const deltaTime = Math.min(this.clock.getDelta(), 0.05);

    this.input.update(deltaTime);

    if (this.input.consumeRestartRequest()) {
      this.resetRun();
    }

    if (this.input.consumePauseToggleRequest()) {
      this.isPaused = !this.isPaused;

      if (this.isPaused && document.exitPointerLock) {
        document.exitPointerLock();
      }

      this.hud.showBanner(
        this.isPaused ? "Simulation Paused" : "Back Online",
        this.isPaused
          ? "Press P to resume or T to restart the run."
          : "Arrow keys for movement. C boosts. X shields. Shift bends time. Re-engage.",
        1.8,
      );
    }

    if (this.input.consumeDebugToggleRequest()) {
      this.isDebugVisible = !this.isDebugVisible;
      this.gravitySystem.setDebugVisible(this.isDebugVisible);
      this.stealthSystem.setDebugVisible(this.isDebugVisible);
      this.hud.showBanner(
        this.isDebugVisible ? "Debug Overlays On" : "Debug Overlays Off",
        this.isDebugVisible
          ? "Enemy vision cones and gravity fields are now visible."
          : "Tactical overlays hidden.",
        1.6,
      );
    }

    if (!this.isPaused) {
      this.lowHealthSoundCooldown = Math.max(0, this.lowHealthSoundCooldown - deltaTime);
      this.elapsedTime += deltaTime;
      this.timeSystem.update(deltaTime, {
        inputController: this.input,
        energySystem: this.energySystem,
        player: this.player,
      });
      this.shieldSystem.update(deltaTime, {
        inputController: this.input,
        energySystem: this.energySystem,
        player: this.player,
      });

      const worldDelta = deltaTime * this.timeSystem.getWorldScale();
      const playerDelta = deltaTime * this.timeSystem.getPlayerScale();

      this.player.setTimeDilationAmount(this.timeSystem.effectAmount);
      this.player.setShieldFieldAmount(this.shieldSystem.getVisualAmount());
      this.player.setShieldImpactAmount(this.shieldSystem.getImpactAmount());
      this.player.update(playerDelta, this.input, this.projectileSystem, {
        energySystem: this.energySystem,
      });

      const shotShake = this.player.weaponSystem.consumeCameraShake();

      if (shotShake > 0) {
        this.followCamera.addShake(shotShake);
      }

      if (this.player.weaponSystem.consumeHudPulse() > 0) {
        this.hud.triggerWeaponPulse();
      }

      this.gravitySystem.update(worldDelta, {
        player: this.player,
        playerDeltaTime: playerDelta,
        enemies: this.enemyManager.enemies,
        projectiles: this.projectileSystem.projectiles,
        environmentManager: this.environmentManager,
      });

      this.environmentManager.resolveShipCollisions(this.player);
      this.stealthSystem.update(worldDelta, {
        player: this.player,
        enemies: this.enemyManager.enemies,
        environmentManager: this.environmentManager,
      });

      const stealthState = this.stealthSystem.playerState;
      this.player.setStealthFieldAmount(
        stealthState === "hidden"
          ? 0.34
          : stealthState === "suspicious"
            ? 0.14
            : 0,
      );

      this.enemyManager.update(worldDelta, {
        stealthSystem: this.stealthSystem,
      });

      for (const enemy of this.enemyManager.enemies) {
        this.environmentManager.resolveShipCollisions(enemy);
      }

      this.projectileSystem.update(worldDelta);
      this.handleProjectileCollisions();
      this.updateRespawn(deltaTime);
      this.environmentManager.update(worldDelta);
      this.impactFlashSystem.update(worldDelta);
      this.explosionSystem.update(worldDelta);
      this.energySystem.update(deltaTime, {
        regenerationEnabled: !this.timeSystem.isActive && !this.player.isBoosting && !this.shieldSystem.isActive,
        regenerationMultiplier: this.stealthSystem.isPlayerHidden() ? 1.18 : 1,
      });
      this.followCamera.setTimeDilation(this.timeSystem.effectAmount);
      this.followCamera.setGravityInfluence(this.gravitySystem.getPlayerInfluence());
      this.followCamera.update(deltaTime);
      this.motionBlurSystem.update(deltaTime, {
        player: this.player,
        timeSystem: this.timeSystem,
        gravitySystem: this.gravitySystem,
        shieldSystem: this.shieldSystem,
        isPaused: false,
      });
      this.handleWaveTransitions();
      this.renderer.toneMappingExposure = 1.08 + this.timeSystem.effectAmount * 0.12;
    } else {
      this.motionBlurSystem.update(deltaTime, {
        player: this.player,
        timeSystem: this.timeSystem,
        gravitySystem: this.gravitySystem,
        shieldSystem: this.shieldSystem,
        isPaused: true,
      });
    }

    this.backdrop.update(deltaTime, this.player.position, this.camera);
    this.hud.update(deltaTime, {
      player: this.player,
      energy: this.energySystem.getHudState(),
      stealth: this.stealthSystem.getHudState(),
      shield: this.shieldSystem.getHudState(),
      time: this.timeSystem.getHudState(),
      debug: this.getDebugState(),
      weapon: this.player.weaponSystem.getHudState(),
      wave: this.enemyManager.getWaveState(),
      session: this.getSessionState(),
      overlay: this.getOverlayState(),
    });

    this.renderer.render(this.scene, this.camera);
  }

  handleWaveTransitions() {
    const currentWave = this.enemyManager.currentWave;

    if (currentWave !== this.lastWaveNumber) {
      this.lastWaveNumber = currentWave;
      this.bestWave = Math.max(this.bestWave, currentWave);
      this.hud.showBanner(`Wave ${currentWave}`, "Fresh hostiles warping into the battlefield.", 2.2);
    }
  }

  handleProjectileCollisions() {
    for (let index = this.projectileSystem.projectiles.length - 1; index >= 0; index -= 1) {
      const projectile = this.projectileSystem.projectiles[index];

      if (!projectile) {
        continue;
      }

      if (this.environmentManager.isProjectileBlocked(projectile)) {
        this.impactFlashSystem.spawnImpactFlash({
          position: projectile.position.clone(),
          color: projectile.impactColor,
          scale: projectile.impactScale,
        });
        this.projectileSystem.removeProjectile(projectile);
        continue;
      }

      if (projectile.ownerTag === "player") {
        for (const enemy of this.enemyManager.enemies) {
          if (enemy.isDestroyed) {
            continue;
          }

          if (projectile.intersectsSphere(enemy.collisionSphere)) {
            this.impactFlashSystem.spawnImpactFlash({
              position: projectile.position.clone(),
              color: projectile.impactColor,
              scale: projectile.impactScale,
            });
            this.projectileSystem.removeProjectile(projectile);
            const wasDestroyed = enemy.takeDamage(projectile.damage);
            playHitSound();
            this.followCamera.addShake(0.08);

            if (wasDestroyed) {
              this.kills += 1;
              this.score += enemy.scoreValue ?? Math.round(enemy.maxHealth * 8);
              this.player.heal(enemy.healthReward ?? 10);
              this.enemyManager.destroyEnemy(enemy);
              this.followCamera.addShake(0.24);
            }

            break;
          }
        }

        continue;
      }

      if (projectile.ownerTag === "enemy" && !this.player.isDestroyed) {
        if (projectile.intersectsSphere(this.player.collisionSphere)) {
          this.impactFlashSystem.spawnImpactFlash({
            position: projectile.position.clone(),
            color: projectile.impactColor,
            scale: projectile.impactScale * 0.9,
          });
          this.projectileSystem.removeProjectile(projectile);
          const incomingDamage = this.shieldSystem.absorbDamage(projectile.damage, this.energySystem);
          this.player.setShieldImpactAmount(this.shieldSystem.getImpactAmount());
          const playerDestroyed = this.player.takeDamage(incomingDamage);
          playHitSound();
          this.hud.triggerDamagePulse();
          this.followCamera.addShake(incomingDamage < projectile.damage ? 0.12 : 0.18);

          if (playerDestroyed) {
            this.handlePlayerDestroyed();
          } else if (this.player.getHealthRatio() < 0.3 && this.lowHealthSoundCooldown === 0) {
            playLowHealthSound();
            this.lowHealthSoundCooldown = 4;
            this.hud.triggerLowHealthPulse();
          }
        }
      }
    }
  }

  handlePlayerDestroyed() {
    this.explosionSystem.spawnExplosion({
      position: this.player.position.clone(),
      color: 0x86d7ff,
      scale: 1.45,
    });

    this.playerRespawnTimer = this.playerRespawnDelay;
    this.projectileSystem.removeProjectilesByOwnerTag("enemy");
    this.shieldSystem.reset();
    this.timeSystem.reset();
    this.player.setTimeDilationAmount(0);
    this.player.setStealthFieldAmount(0);
    this.player.setShieldFieldAmount(0);
    this.player.setShieldImpactAmount(0);
    this.followCamera.addShake(0.42);
    this.hud.showBanner("Hull Breach", "Reconstructing ship systems for redeployment.", 1.8);
  }

  updateRespawn(deltaTime) {
    if (this.playerRespawnTimer <= 0) {
      return;
    }

    this.playerRespawnTimer = Math.max(0, this.playerRespawnTimer - deltaTime);

    if (this.playerRespawnTimer === 0) {
      this.player.respawn(this.environmentManager.getSafePosition(respawnPosition, this.player.collisionRadius));
      this.projectileSystem.removeProjectilesByOwnerTag("enemy");
      this.lowHealthSoundCooldown = 0;
      this.energySystem.reset();
      this.shieldSystem.reset();
      this.timeSystem.reset();
      this.hud.showBanner("Redeployed", "Hull restored. Weapons systems back online.", 1.5);
    }
  }

  getSessionState() {
    return {
      score: this.score,
      kills: this.kills,
      elapsedTime: this.elapsedTime,
      bestWave: this.bestWave,
    };
  }

  getOverlayState() {
    if (this.isPaused) {
      return {
        visible: true,
        eyebrow: "Simulation Paused",
        title: "Tactical Hold",
        copy: "Press P to resume. Use C to boost, X for shields, Shift for slow time, and V for debug overlays. Press T to restart this run.",
      };
    }

    if (this.playerRespawnTimer > 0) {
      return {
        visible: true,
        eyebrow: "Hull Recovery",
        title: "Ship Reconstructing",
        copy: `Redeploying in ${this.playerRespawnTimer.toFixed(1)}s`,
      };
    }

    return { visible: false };
  }

  resetRun() {
    this.isPaused = false;
    this.score = 0;
    this.kills = 0;
    this.elapsedTime = 0;
    this.playerRespawnTimer = 0;
    this.lowHealthSoundCooldown = 0;
    this.energySystem.reset();
    this.shieldSystem.reset();
    this.timeSystem.reset();
    this.projectileSystem.clear();
    this.impactFlashSystem.dispose();
    this.explosionSystem.dispose();
    this.enemyManager.reset();
    this.stealthSystem.update(0, {
      player: this.player,
      enemies: this.enemyManager.enemies,
      environmentManager: this.environmentManager,
    });
    this.bestWave = this.enemyManager.currentWave;
    this.lastWaveNumber = this.enemyManager.currentWave;
    this.player.respawn(this.environmentManager.getSafePosition(respawnPosition, this.player.collisionRadius));
    this.player.setStealthFieldAmount(0);
    this.player.setShieldFieldAmount(0);
    this.player.setShieldImpactAmount(0);
    this.motionBlurSystem.reset();
    this.followCamera.addShake(0.12);
    this.hud.showBanner(
      `Wave ${this.enemyManager.currentWave}`,
      "Run restarted. Hide behind planets, manage energy, raise shields, and strike with intent.",
      2.6,
    );
  }

  getDebugState() {
    if (!this.isDebugVisible) {
      return {
        visible: false,
        enemyStates: [],
      };
    }

    return {
      visible: this.isDebugVisible,
      enemyStates: this.enemyManager.enemies.map((enemy) => {
        const perception = this.stealthSystem.getEnemyPerception(enemy);
        const exactState = perception.state ?? "idle";
        const detail = perception.canSeePlayer
          ? "Line of sight clear"
          : perception.isBlocked
            ? "Line of sight blocked by planet"
            : "Player outside vision cone";

        return {
          label: `${enemy.typeLabel} ${String(enemy.debugId ?? 0).padStart(2, "0")}`,
          state: exactState,
          detection: Math.round((perception.detection ?? 0) * 100),
          detail,
        };
      }),
    };
  }

  handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  dispose() {
    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId);
    }

    window.removeEventListener("resize", this.handleResize);
    this.input.dispose();
    this.enemyManager.dispose();
    this.projectileSystem.dispose();
    this.environmentManager.dispose();
    this.gravitySystem.dispose();
    this.motionBlurSystem.reset();
    this.stealthSystem.dispose();
    this.impactFlashSystem.dispose();
    this.explosionSystem.dispose();
    this.player.dispose();
    this.scene.remove(this.backdrop.group);
    this.backdrop.dispose();
    this.renderer.dispose();
  }
}
