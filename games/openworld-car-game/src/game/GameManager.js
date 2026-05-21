import * as THREE from '../vendor/three.js';
import { getCarConfig } from '../config/cars.js';
import { getMissionById } from '../config/missions.js';
import { PLAYER_START, SAFE_SPAWNS } from '../config/city.js';
import { AudioManager } from './audio/AudioManager.js';
import { CameraController } from './camera/CameraController.js';
import { CityBuilder } from './city/CityBuilder.js';
import { CockpitManager } from './cockpit/CockpitManager.js';
import { EffectsManager } from './effects/EffectsManager.js';
import { CityEventManager } from './events/CityEventManager.js';
import { CareerManager } from './career/CareerManager.js';
import { CustomizationManager } from './garage/CustomizationManager.js';
import { GarageManager } from './garage/GarageManager.js';
import { TuningManager } from './garage/TuningManager.js';
import { InputManager } from './input/InputManager.js';
import { MissionManager } from './missions/MissionManager.js';
import { AchievementManager } from './progression/AchievementManager.js';
import { MasteryManager } from './progression/MasteryManager.js';
import { ProgressionManager } from './progression/ProgressionManager.js';
import { StatsManager } from './progression/StatsManager.js';
import { SaveManager } from './save/SaveManager.js';
import { SceneManager } from './SceneManager.js';
import { TrafficSystem } from './traffic/TrafficSystem.js';
import { HUDManager } from './ui/HUDManager.js';
import { VehicleController } from './vehicles/VehicleController.js';
import { VehicleFactory } from './vehicles/VehicleFactory.js';

export class GameManager {
  constructor(root) {
    this.root = root;
    this.loadingEl = root.querySelector('#loading-screen');
    this.sceneManager = new SceneManager(root);
    this.saveManager = new SaveManager();
    this.inputManager = new InputManager(root);
    this.audioManager = new AudioManager(this.saveManager);
    this.customizationManager = new CustomizationManager(this.saveManager);
    this.tuningManager = new TuningManager(this.saveManager, {
      onUpgrade: (carId, category) => {
        this.audioManager.play('tuning', 0.75);
        this.hudManager?.showToast(`${category.label} tuning applied`);
      }
    });
    this.masteryManager = new MasteryManager(this.saveManager, {
      onLevelUp: (carId, level) => {
        this.audioManager.play('mastery', 0.8);
        this.hudManager?.showToast(`${getCarConfig(carId).shortName} mastery: ${level.name}`);
      }
    });
    this.careerManager = new CareerManager(this.saveManager, {
      onCareerComplete: (mission, unlocked) => {
        this.audioManager.play('objective', 0.8);
        if (unlocked.length) this.hudManager?.showToast(`Career unlocked: ${unlocked[0]}`);
        else this.hudManager?.showToast(`${mission.title} career medal saved`);
      }
    });
    this.progressionManager = new ProgressionManager(this.saveManager, {
      onLevelUp: (level) => this.hudManager?.showToast(`${level.name} license reached`)
    });
    this.achievementManager = new AchievementManager(this.saveManager, {
      onAchievement: (achievement) => this.hudManager?.showToast(`Achievement: ${achievement.name}`),
      onLevelUp: (level) => this.hudManager?.showToast(`${level.name} license reached`)
    });
    this.statsManager = new StatsManager(this.saveManager);
    this.effectsManager = new EffectsManager(this.sceneManager.scene);
    this.vehicleFactory = new VehicleFactory();
    this.cityBuilder = new CityBuilder(this.sceneManager.scene, this.effectsManager, this.vehicleFactory);
    this.trafficSystem = new TrafficSystem(this.sceneManager.scene, this.vehicleFactory, this.saveManager, this.cityBuilder);
    this.missionManager = new MissionManager(this.sceneManager.scene, this.saveManager, this.audioManager, this.cityBuilder);
    this.cityEventManager = null;
    this.cameraController = new CameraController(this.sceneManager.camera, this.saveManager);
    this.cockpitManager = new CockpitManager(this.sceneManager.scene, this.sceneManager.camera, this.saveManager);
    this.player = null;
    this.playerConfig = getCarConfig(this.saveManager.data.selectedCar);
    this.state = 'garage';
    this.currentMode = 'freeDrive';
    this.testDrive = false;
    this.lastMissionMode = 'freeDrive';
    this.missionHud = this.missionManager.getFreeDriveHud();
    this.phase3Hud = null;
    this.activeCareerMissionId = null;
    this.lastTrafficDensity = this.saveManager.settings.trafficDensity;
    this.frameId = null;
    this.pausedByBlur = false;

    this.cityEventManager = new CityEventManager(
      this.saveManager,
      this.masteryManager,
      {
        onEvent: (event) => {
          this.audioManager.play('event', 0.65);
          this.hudManager?.showToast(event.name);
        },
        onTaskComplete: (task) => {
          this.audioManager.play('objective', 0.8);
          this.hudManager?.showToast(`${task.label} +${task.coins} coins`);
        }
      }
    );

    this.garageManager = new GarageManager(
      root,
      this.vehicleFactory,
      this.saveManager,
      this.customizationManager,
      this.tuningManager,
      this.masteryManager,
      this.careerManager,
      {
        onStart: (mode, carId) => this.startMode(mode, carId),
        onStartCareer: (careerId, mode, carId) => this.startMode(mode, carId, { careerId }),
        onTestDrive: (carId) => this.startMode('freeDrive', carId, { testDrive: true }),
        onFeedback: (message) => this.hudManager?.showToast(message),
        onAudioClick: () => this.audioManager.play('click', 0.6)
      }
    );
    this.hudManager = new HUDManager(root, this.inputManager, this.saveManager, {
      onResume: () => this.resume(),
      onRestart: () => this.restartCurrentMode(),
      onGarage: () => this.openGarage(),
      onMainMenu: () => this.openGarage(),
      onRetry: () => this.restartCurrentMode(),
      onStartMode: (mode) => this.startMode(mode, this.saveManager.data.selectedCar),
      onSettingsChanged: () => this.applySettings()
    });

    this.onResize = this.onResize.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  start() {
    this.cityBuilder.build();
    this.cityBuilder.restoreCollected(this.saveManager);
    this.trafficSystem.build();
    this.applySettings();
    window.addEventListener('resize', this.onResize);
    window.addEventListener('blur', this.onBlur);
    window.addEventListener('focus', this.onFocus);
    this.loadingEl?.classList.add('is-hidden');
    this.garageManager.show();
    this.loop();
  }

  loop() {
    this.frameId = window.requestAnimationFrame(() => this.loop());
    this.sceneManager.resize();
    const dt = Math.min(0.033, this.sceneManager.clock.getDelta());

    if (this.state === 'garage') {
      this.garageManager.update(dt, this.sceneManager.size);
      this.garageManager.render(this.sceneManager.renderer);
      return;
    }

    if (this.state === 'playing') {
      this.updatePlaying(dt);
    }

    this.effectsManager.update(dt);
    this.sceneManager.render();
  }

  updatePlaying(dt) {
    if (!this.player) return;
    this.handleHotkeys();
    this.audioManager.setCockpitActive(this.cameraController.getMode().id === 'cockpit');
    const input = this.inputManager.getDrivingInput();
    const telemetry = this.player.update(dt, input);
    this.cityBuilder.update(dt);
    this.trafficSystem.update(dt, this.player);
    const trafficCollisions = this.cityBuilder.collisionSystem.resolveTrafficVehicles(this.player, this.trafficSystem.vehicles);
    if (trafficCollisions) this.player.syncMesh();
    this.cameraController.update(dt, this.player, telemetry);
    this.cockpitManager.update(dt, this.player, telemetry, this.cameraController.getMode().id);

    this.statsManager.updateDriving(dt, telemetry);
    this.progressionManager.awardCleanDistance(telemetry.distanceTravelled);
    this.masteryManager.awardDriving(this.playerConfig.id, telemetry);
    this.phase3Hud = this.cityEventManager.update(dt, telemetry, this.player, this.currentMode, this.playerConfig.id);

    this.cityBuilder.checkCollectibles(
      this.player.position,
      this.saveManager,
      this.audioManager,
      (message) => this.hudManager.showToast(message)
    );
    this.cityBuilder.checkLandmarks(
      this.player.position,
      this.saveManager,
      this.audioManager,
      (message) => this.hudManager.showToast(message)
    );
    this.cityBuilder.checkDistricts(
      this.player.position,
      this.saveManager,
      this.audioManager,
      (message) => this.hudManager.showToast(message)
    );
    this.achievementManager.evaluate();

    const missionUpdate = this.missionManager.update(dt, this.player, telemetry);
    if (missionUpdate?.result) {
      this.decorateMissionResult(missionUpdate.result);
      this.showResult(missionUpdate.result);
      return;
    }
    this.missionHud = missionUpdate;

    if (telemetry.stuck) {
      this.hudManager.showToast('Car reset available with R');
    }

    this.cityBuilder.collisionSystem.updateDebug(
      this.saveManager.settings.debugOverlay,
      this.player,
      this.player.currentSurfaceInfo
    );

    this.hudManager.update(
      telemetry,
      this.missionHud,
      this.saveManager.data,
      this.playerConfig,
      this.player.position,
      this.player.heading,
      this.phase3Hud,
      {
        dt,
        trafficCount: this.trafficSystem.vehicles.length,
        collectibleCount: this.cityBuilder.collectibles.filter((coin) => coin.visible).length,
        mission: this.currentMode,
        collision: {
          ...this.cityBuilder.collisionSystem.getDebugStats(),
          lastCount: this.player.lastCollision?.count ?? 0,
          trafficCollisions
        },
        cameraMode: this.cameraController.getMode().id,
        cameraLabel: this.cameraController.getMode().label,
        testDrive: Boolean(this.testDrive)
      }
    );
  }

  decorateMissionResult(result) {
    result.achievements = this.achievementManager.evaluate(result);
    const mastery = this.masteryManager.awardMission(this.playerConfig.id, result);
    result.masteryXp = mastery?.amount ?? 0;
    if (this.activeCareerMissionId && result.success) {
      const career = this.careerManager.complete(this.activeCareerMissionId, result);
      result.career = career;
      result.newUnlocks = career?.unlocked ?? [];
    }
    this.activeCareerMissionId = null;
  }

  handleHotkeys() {
    if (this.inputManager.consume('Escape')) {
      this.pause();
      return;
    }
    if (this.inputManager.consume('c')) {
      const label = this.cameraController.nextMode();
      this.showCameraToast(label);
    }
    if (this.inputManager.consume('v')) {
      const label = this.cameraController.toggleCockpit();
      this.showCameraToast(label);
    }
    if (this.inputManager.consume('r')) {
      this.missionManager.noteReset();
      this.resetPlayerNearRoad();
      this.hudManager.showToast('Vehicle reset');
    }
    if (this.inputManager.consume('F3') || this.inputManager.consume('`')) {
      const enabled = !this.saveManager.settings.debugOverlay;
      this.saveManager.updateSettings({ debugOverlay: enabled });
      this.hudManager.showToast(enabled ? 'Collision debug on' : 'Collision debug off');
    }
  }

  startMode(mode, carId, options = {}) {
    this.audioManager.unlock();
    this.audioManager.play('click', 0.65);
    this.currentMode = mode;
    this.testDrive = Boolean(options.testDrive);
    if (mode !== 'freeDrive') this.lastMissionMode = mode;
    this.activeCareerMissionId = options.careerId ?? null;
    this.playerConfig = getCarConfig(carId ?? this.saveManager.data.selectedCar);
    this.saveManager.setSelectedCar(this.playerConfig.id);
    this.spawnPlayer();

    let start = null;
    const missionConfig = getMissionById(mode);
    if (mode === 'freeDrive') {
      this.missionManager.start('freeDrive');
      start = PLAYER_START;
    } else {
      start = this.missionManager.start(mode, {
        carId: this.playerConfig.id,
        carName: this.playerConfig.name,
        shortName: this.playerConfig.shortName
      });
    }
    this.player.reset(start.position, start.heading);
    this.player.setMissionModifiers({
      accelerationMultiplier: missionConfig?.accelerationMultiplier ?? 1
    });
    this.missionHud = this.missionManager.getHudData(this.player.position);
    this.state = 'playing';
    this.pausedByBlur = false;
    this.garageManager.hide();
    this.hudManager.hideResult();
    this.hudManager.hidePause();
    this.hudManager.showHud();
    this.audioManager.setMuted(false);
    const careerPrefix = this.activeCareerMissionId ? 'Career: ' : '';
    this.hudManager.showToast(this.testDrive ? 'Test Drive started - press C for cockpit' : mode === 'freeDrive' ? 'Free Drive started' : `${careerPrefix}${missionConfig?.name ?? 'Mission'} started`);
  }

  spawnPlayer() {
    if (this.player?.mesh) {
      this.cockpitManager.syncVehicleCull(this.player.mesh, false);
      this.sceneManager.scene.remove(this.player.mesh);
    }
    const customization = this.customizationManager.getCarCustomization(this.playerConfig.id);
    const colors = this.customizationManager.resolveVisualColors(this.playerConfig, customization);
    const effectiveConfig = this.tuningManager.getEffectiveConfig(this.playerConfig);
    const mesh = this.vehicleFactory.createCarMesh(effectiveConfig, {
      customization: {
        body: colors.body,
        accent: colors.accent,
        tintOpacity: colors.tintOpacity,
        boostTrail: colors.boostTrail,
        wheelStyle: customization.wheels
      }
    });
    mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
      this.sceneManager.scene.add(mesh);
    this.player = new VehicleController(
      mesh,
      effectiveConfig,
      this.cityBuilder,
      this.effectsManager,
      this.audioManager
    );
  }

  resetPlayerNearRoad() {
    if (!this.player) return;
    const position = this.player.position.clone();
    const collisionSafe = this.cityBuilder.collisionSystem.findNearestRoadSurface(position, this.player.currentSurfaceInfo);
    const safe = collisionSafe?.position ?? this.findNearestRoad(position);
    const heading = collisionSafe?.heading ?? this.player.lastSafeHeading ?? this.player.heading;
    this.player.reset([safe.x, 0, safe.z], heading, collisionSafe?.id ?? null);
  }

  findNearestRoad(position) {
    let best = new THREE.Vector3(0, 0, 16);
    let bestDistance = Infinity;
    SAFE_SPAWNS.forEach((spawn) => {
      const candidate = new THREE.Vector3(spawn.position[0], 0, spawn.position[2]);
      const distance = candidate.distanceTo(position);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = candidate;
      }
    });
    this.cityBuilder.roadSegments.forEach((segment) => {
      const candidate = new THREE.Vector3(segment.center[0], 0, segment.center[1]);
      const distance = candidate.distanceTo(position);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = candidate;
      }
    });
    this.cityBuilder.elevatedRoutes?.forEach((route) => {
      const candidate = new THREE.Vector3(route.center[0], 0, route.center[1]);
      const distance = candidate.distanceTo(position);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = candidate;
      }
    });
    return best;
  }

  pause() {
    if (this.state !== 'playing') return;
    this.state = 'paused';
    this.hudManager.setPaused(true);
    this.audioManager.setMuted(true);
  }

  resume() {
    if (this.state !== 'paused') return;
    this.sceneManager.clock.getDelta();
    this.state = 'playing';
    this.hudManager.setPaused(false);
    this.audioManager.setMuted(false);
  }

  restartCurrentMode() {
    const mode = this.currentMode === 'freeDrive' ? 'freeDrive' : this.lastMissionMode;
    this.startMode(mode, this.saveManager.data.selectedCar);
  }

  openGarage() {
    this.state = 'garage';
    this.testDrive = false;
    if (this.player?.mesh) this.cockpitManager.syncVehicleCull(this.player.mesh, false);
    this.cockpitManager.setVisible(false);
    this.hudManager.hideHud();
    this.hudManager.hidePause();
    this.hudManager.hideResult();
    this.audioManager.setMuted(true);
    this.audioManager.setCockpitActive(false);
    this.garageManager.show();
  }

  showCameraToast(label) {
    this.hudManager.showToast(label);
    if (this.cameraController.getMode().id === 'cockpit' && !this.saveManager.settings.cockpitHintSeen) {
      this.saveManager.updateSettings({ cockpitHintSeen: true });
      window.setTimeout(() => this.hudManager.showToast('Cockpit view enabled. Press C to switch camera.'), 260);
    }
  }

  showResult(result) {
    this.state = 'result';
    if (this.player?.mesh) this.cockpitManager.syncVehicleCull(this.player.mesh, false);
    this.cockpitManager.setVisible(false);
    this.hudManager.showResult(result, this.playerConfig.name);
    this.audioManager.setMuted(true);
  }

  applySettings() {
    this.audioManager.applyVolumes();
    this.cameraController.setMode(this.saveManager.settings.cameraMode, false);
    const quality = this.saveManager.settings.visualQuality;
    const ratio = quality === 'high' ? 1.8 : quality === 'low' ? 1.0 : 1.45;
    this.sceneManager.renderer.setPixelRatio(Math.min(window.devicePixelRatio, ratio));
    const shadowEnabled = quality !== 'low';
    this.sceneManager.renderer.shadowMap.enabled = shadowEnabled;
    if (this.lastTrafficDensity !== this.saveManager.settings.trafficDensity) {
      this.lastTrafficDensity = this.saveManager.settings.trafficDensity;
      this.trafficSystem.build();
    }
  }

  onResize() {
    this.sceneManager.resize();
  }

  onBlur() {
    if (this.state === 'playing') {
      this.pausedByBlur = true;
      this.pause();
    }
  }

  onFocus() {
    if (this.pausedByBlur) {
      this.hudManager.showToast('Paused while tab was inactive');
      this.pausedByBlur = false;
    }
  }

  dispose() {
    if (this.frameId) window.cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('blur', this.onBlur);
    window.removeEventListener('focus', this.onFocus);
    this.inputManager.dispose();
  }
}
