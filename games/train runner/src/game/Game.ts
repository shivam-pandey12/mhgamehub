import * as THREE from 'three';
import { AudioEvents } from './AudioEvents';
import { BossSystem } from './BossSystem';
import { CameraController } from './CameraController';
import { CombatSystem } from './CombatSystem';
import { EliteEnemySystem } from './EliteEnemySystem';
import { EnemySystem } from './EnemySystem';
import { EffectsSystem } from './EffectsSystem';
import { EnvironmentSystem } from './EnvironmentSystem';
import { GameplayDirector } from './GameplayDirector';
import { getDailyChallenge } from './DailyChallengeSystem';
import { COSMETIC_CONFIGS, SKIN_CONFIGS } from './GearConfig';
import { getLoadoutModifiers } from './LoadoutSystem';
import { Hud } from './Hud';
import { InputManager } from './InputManager';
import { MenuSystem } from './MenuSystem';
import { MissionSystem } from './MissionSystem';
import { ObstacleSystem } from './ObstacleSystem';
import { PlayerController } from './PlayerController';
import { PickupSystem } from './PickupSystem';
import { ProgressSystem } from './ProgressSystem';
import { RouteManager } from './RouteManager';
import { ROUTE_CONFIGS } from './RouteConfig';
import { PlayerStatsSystem } from './PlayerStatsSystem';
import { SetPieceSystem } from './SetPieceSystem';
import { SpecialAttackSystem } from './SpecialAttackSystem';
import { TrainSystem } from './TrainSystem';
import type {
  BossSnapshot,
  CosmeticId,
  GameMode,
  GameSettings,
  HudPhase3Snapshot,
  RouteConfig,
  RouteId,
  RunSegment,
  RunnerState,
  RunSummary,
  SetPieceSnapshot,
  SkinId,
  UpgradeId,
  WeaponStyleId
} from './types';

export class Game {
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera();
  private readonly renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance'
  });
  private readonly input = new InputManager();
  private readonly audio = new AudioEvents();
  private readonly progress = new ProgressSystem();
  private readonly routeManager = new RouteManager(this.progress);
  private readonly train = new TrainSystem();
  private readonly environment = new EnvironmentSystem(this.scene);
  private readonly effects = new EffectsSystem();
  private readonly player = new PlayerController(this.train);
  private readonly stats = new PlayerStatsSystem(this.audio);
  private readonly obstacles = new ObstacleSystem(this.audio);
  private readonly enemies = new EnemySystem();
  private readonly pickups = new PickupSystem(this.audio);
  private readonly combat = new CombatSystem(this.audio);
  private readonly director = new GameplayDirector();
  private readonly missions = new MissionSystem(this.audio);
  private readonly setPieces = new SetPieceSystem(this.audio);
  private readonly elite = new EliteEnemySystem();
  private readonly boss = new BossSystem(this.audio);
  private readonly special = new SpecialAttackSystem(this.audio);
  private readonly cameraController = new CameraController(this.camera);
  private readonly hud: Hud;
  private readonly menu: MenuSystem;

  private frameId = 0;
  private lastTime = performance.now();
  private disposed = false;
  private summary: RunSummary | null = null;
  private mode: GameMode = 'menu';
  private readonly debugEnabled = new URLSearchParams(window.location.search).get('debug') === '1';
  private readonly debugPanel: HTMLDivElement | null = this.debugEnabled ? document.createElement('div') : null;

  private readonly onResize = (): void => {
    const width = this.host.clientWidth || window.innerWidth;
    const height = this.host.clientHeight || window.innerHeight;
    this.renderer.setSize(width, height, false);
    this.cameraController.resize(width, height);
  };

  constructor(private readonly host: HTMLElement) {
    this.hud = new Hud(host);
    this.menu = new MenuSystem(host);
    this.menu.setCallbacks({
      playFirstRoute: () => this.playFirstRoute(),
      startRoute: (routeId) => this.startRoute(routeId),
      openMain: () => this.openMainMenu(),
      openLevelSelect: () => this.openLevelSelect(),
      openControls: () => this.openControls(),
      openSettings: () => this.openSettings(),
      openGearRoom: () => this.openGearRoom(),
      openRecords: () => this.openRecords(),
      openDailyChallenge: () => this.openDailyChallenge(),
      startDailyChallenge: () => this.startDailyChallenge(),
      purchaseUpgrade: (upgradeId) => this.purchaseUpgrade(upgradeId),
      unlockOrEquipWeapon: (weaponId) => this.unlockOrEquipWeapon(weaponId),
      equipSkin: (skinId) => this.equipSkin(skinId),
      unlockOrEquipCosmetic: (cosmeticId) => this.unlockOrEquipCosmetic(cosmeticId),
      retryRoute: () => this.retryRoute(),
      nextRoute: () => this.startNextRoute(),
      resume: () => this.resumeGame(),
      resetProgress: () => this.resetProgress(),
      updateSettings: (settings) => this.updateSettings(settings),
      playUiSound: (eventName) => this.audio.play(eventName)
    });
    this.configureRenderer();
    this.configureRoute(this.routeManager.currentRoute);
    this.applyLoadout();
    this.applySettings();
    this.scene.add(
      this.environment.group,
      this.train.group,
      this.setPieces.group,
      this.obstacles.group,
      this.enemies.group,
      this.elite.group,
      this.boss.group,
      this.pickups.group,
      this.special.group,
      this.effects.group,
      this.player.character.group
    );
    this.host.appendChild(this.renderer.domElement);
    this.hud.setGameplayVisible(false);
    this.menu.setProgress(this.routeManager.progressSnapshot);
    this.menu.showMain();
    if (this.debugPanel) {
      this.debugPanel.className = 'debug-panel';
      this.host.appendChild(this.debugPanel);
      window.addEventListener('keydown', this.onDebugKeyDown);
    }
    this.onResize();
  }

  start(): void {
    this.input.connect(this.host);
    window.addEventListener('resize', this.onResize);
    this.renderer.domElement.tabIndex = 0;
    this.renderer.domElement.focus();
    this.lastTime = performance.now();
    this.frameId = window.requestAnimationFrame(this.loop);
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;
    window.cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onDebugKeyDown);
    this.input.dispose();
    this.audio.dispose();
    this.menu.dispose();
    this.hud.dispose();
    this.player.dispose();
    this.train.dispose();
    this.environment.dispose();
    this.obstacles.dispose();
    this.enemies.dispose();
    this.pickups.dispose();
    this.elite.dispose();
    this.boss.dispose();
    this.setPieces.dispose();
    this.special.dispose();
    this.effects.dispose();
    this.renderer.dispose();
  }

  private readonly loop = (time: number): void => {
    if (this.disposed) {
      return;
    }

    const rawDt = Math.min(0.033, Math.max(0.001, (time - this.lastTime) / 1000));
    const dt = rawDt * this.combat.getTimeScale();
    this.lastTime = time;

    const pausePressed = this.input.consumePause();
    if (this.mode === 'gameplay' && pausePressed) {
      this.pauseGame();
    } else if (this.mode === 'pause' && pausePressed) {
      this.resumeGame();
    } else if (pausePressed && this.mode !== 'menu') {
      this.openMainMenu();
    }

    if (this.mode === 'summary' && this.input.consumeRestart()) {
      this.retryRoute();
    }

    if (this.mode !== 'gameplay') {
      this.audio.setRunning(false);
      this.renderShellFrame(dt);
      this.updateDebugPanel();
      return;
    }

    if (this.input.consumeAny() && this.cameraController.isIntro) {
      this.cameraController.skipIntro();
    }

    const stateBeforeUpdate = this.player.state;
    this.train.update(this.player.position.z);
    if (stateBeforeUpdate !== 'failed') {
      this.director.update(
        this.player.position.z,
        this.player.distance,
        this.train,
        this.obstacles,
        this.enemies,
        this.pickups
      );
    }
    this.player.update(dt, this.input, this.effects, this.hud);
    if (this.player.state === 'jumping' && stateBeforeUpdate !== 'jumping') {
      this.audio.play('jump');
    }
    if (this.player.state === 'landing' && stateBeforeUpdate !== 'landing') {
      this.audio.play('land');
    }
    this.audio.setRunning(this.shouldPlayRunningAudio());
    const failedThisFrame = this.player.state === 'failed' && stateBeforeUpdate !== 'failed';

    if (stateBeforeUpdate === 'failed' && this.player.state !== 'failed') {
      this.resetRunSystems();
    }

    if (this.player.state !== 'failed') {
      this.setPieces.update(
        dt,
        this.player.distance,
        this.player.getSnapshot(),
        this.train,
        this.obstacles,
        this.effects,
        this.hud,
        this.cameraController
      );
      this.obstacles.update(dt, this.train, this.player.getSnapshot(), this.stats, this.effects, this.hud);
      const enemyResult = this.enemies.update(dt, this.train, this.player.getSnapshot(), this.stats, this.effects, this.hud);
      for (let i = 0; i < enemyResult.perfectDodges; i += 1) {
        this.combat.grantPerfectDodge(this.player, this.stats, this.effects, this.hud);
      }
      this.pickups.update(dt, this.player.getSnapshot(), this.stats, this.effects, this.hud);
      this.elite.update(dt, this.player.distance, this.train, this.player.getSnapshot(), this.stats, this.effects, this.hud);
      this.boss.update(
        dt,
        this.player.distance,
        this.train,
        this.player.getSnapshot(),
        this.stats,
        this.enemies,
        this.effects,
        this.hud,
        this.cameraController
      );
      this.special.update(
        dt,
        this.input,
        this.player,
        this.stats,
        this.enemies,
        this.obstacles,
        this.elite,
        this.boss,
        this.effects,
        this.hud,
        this.cameraController
      );
      this.combat.update(dt, this.input, this.player, this.enemies, this.stats, this.effects, this.hud, this.elite);

      if (this.player.consumeCleanGapCleared()) {
        this.stats.addScore({ type: 'cleanGap', amount: 75, combo: 1.3, label: 'Gap Flow' }, this.hud);
        this.stats.grantEnergy(6);
      }

      if (this.stats.consumeDamageEvent()) {
        this.player.triggerDamageReaction();
      }

      if (this.stats.isGameOver) {
        this.player.triggerFailFromDamage(this.effects);
      }
    }

    this.stats.update(rawDt, this.player.distance);
    this.missions.update(this.player.distance, this.stats, this.boss.isDefeated, this.effects, this.hud);
    if (this.boss.isDefeated) {
      this.showSummary(true);
    } else if (this.stats.isGameOver || failedThisFrame) {
      this.showSummary(false);
    }
    this.environment.update(this.player.position.z);
    this.effects.update(dt * 0.45, this.player.position, this.player.forwardSpeed * 0.5);
    this.cameraController.update(dt, this.player.getSnapshot(), this.effects.getShakeAmount());
    this.updateHud(rawDt);

    this.renderer.render(this.scene, this.camera);
    this.updateDebugPanel();
    this.frameId = window.requestAnimationFrame(this.loop);
  };

  private updateHud(dt: number): void {
    const state: RunnerState =
      this.player.state === 'failed' ? 'failed' : this.cameraController.isIntro ? 'intro' : this.player.state;
    this.hud.update(
      dt,
      this.player.getSpeedKmh(),
      this.player.distance,
      this.train.getUpcomingGap(this.player.position.z),
      state,
      this.stats.getSnapshot(),
      this.getPhase3HudSnapshot()
    );
  }

  private getRunEndReason(victory: boolean): string {
    if (victory) {
      return 'SKY RAIDER defeated. Route cleared.';
    }

    if (this.stats.isGameOver) {
      return 'Health depleted after taking too much damage.';
    }

    if (this.player.state === 'failed') {
      return 'Fell from the train after missing the roof route.';
    }

    return 'Run ended before the final objective was cleared.';
  }

  private shouldPlayRunningAudio(): boolean {
    return (
      this.mode === 'gameplay' &&
      !this.cameraController.isIntro &&
      this.player.grounded &&
      (this.player.state === 'running' || this.player.state === 'landing')
    );
  }

  private resetRunSystems(): void {
    const route = this.routeManager.currentRoute;
    this.summary = null;
    this.applyLoadout();
    this.stats.reset();
    this.obstacles.reset();
    this.enemies.reset();
    this.pickups.reset();
    this.combat.reset();
    this.elite.reset();
    this.boss.reset();
    this.setPieces.reset();
    this.special.reset();
    this.missions.reset(route);
    this.director.reset(this.player.position.z, route);
  }

  private getPhase3HudSnapshot(): HudPhase3Snapshot {
    const segment = this.director.getSegment(this.player.distance);
    const boss = this.boss.getSnapshot();
    const setPiece = this.setPieces.getSnapshot(this.player.distance);

    return {
      segment,
      routeName: this.routeManager.currentRoute.displayName,
      specialReady: this.stats.isEnergyFull,
      boss,
      elite: this.elite.getSnapshot(),
      setPiece,
      missions: this.missions.getSnapshot(),
      warning: this.getWarning(segment, boss, setPiece),
      summary: this.summary
    };
  }

  private getWarning(segment: RunSegment, boss: BossSnapshot, setPiece: SetPieceSnapshot): string {
    if (this.summary) {
      return '';
    }

    if (boss.active) {
      if (boss.vulnerable) {
        return 'Boss vulnerable - press E';
      }

      if (boss.state === 'missileWarning') {
        return 'Missile markers - change lane';
      }

      if (boss.state === 'droneDrop') {
        return 'Drone drop - clear enemies';
      }
    }

    const elite = this.elite.getSnapshot();
    if (elite.active && (elite.state === 'slamWindup' || elite.state === 'chargeWindup')) {
      return elite.state === 'slamWindup' ? 'Armored Brute slam - jump' : 'Armored Brute charge - dodge';
    }

    if (setPiece.state === 'tunnelRush') {
      return 'Tunnel Rush - slide low beams';
    }

    if (setPiece.state === 'sideTrain') {
      return 'Side Train Passing - hold your lane';
    }

    if (this.stats.isEnergyFull && segment !== 'warmup') {
      return 'Special ready - press E';
    }

    return '';
  }

  private showSummary(victory: boolean): void {
    if (this.summary) {
      return;
    }

    this.audio.setRunning(false);
    const route = this.routeManager.currentRoute;
    const baseSummary = this.stats.getSummary(
      this.player.distance,
      this.missions.completedCount,
      this.missions.totalCount,
      victory,
      this.getRunEndReason(victory)
    );
    const completedObjectiveIds = this.missions.completedIds;
    const dailyChallenge = this.routeManager.currentDailyChallenge;
    const progressResult = this.routeManager.recordRun(
      {
        ...baseSummary,
        routeId: route.id,
        routeName: route.displayName,
        biome: route.biome,
        isDaily: Boolean(dailyChallenge),
        dailyChallenge: dailyChallenge ?? undefined,
        routeTokenTarget: route.tokenCount,
        tokenLabel: route.tokenLabel,
        objectiveIds: completedObjectiveIds
      },
      completedObjectiveIds
    );
    this.summary = {
      ...baseSummary,
      routeId: route.id,
      routeName: route.displayName,
      biome: route.biome,
      isDaily: Boolean(dailyChallenge),
      dailyChallenge: dailyChallenge ?? undefined,
      routeTokenTarget: route.tokenCount,
      tokenLabel: route.tokenLabel,
      objectiveIds: completedObjectiveIds,
      rewardCoins: progressResult.rewardCoins,
      rewardBreakdown: progressResult.economy,
      achievementsUnlocked: progressResult.achievementsUnlocked,
      cosmeticsUnlocked: progressResult.cosmeticsUnlocked,
      weaponsUnlocked: progressResult.weaponsUnlocked,
      skinsUnlocked: progressResult.skinsUnlocked,
      dailyBestImproved: progressResult.dailyBestImproved,
      bestScoreImproved: progressResult.bestScoreImproved,
      newUnlocks: progressResult.newUnlocks
    };
    this.mode = 'summary';
    this.hud.setGameplayVisible(false);
    this.menu.setProgress(this.routeManager.progressSnapshot);
    this.menu.showSummary(this.summary, route, this.routeManager.getNextPlayableRoute());
    if (progressResult.achievementsUnlocked.length > 0) {
      this.audio.play('achievementUnlock');
    }
    if (victory) {
      this.audio.play('routeComplete');
      this.audio.play('victory');
      this.effects.triggerObjective({ position: this.player.position, intensity: 1.1 });
      this.cameraController.triggerCinematic(1.4);
      this.cameraController.addFovImpulse(5);
    }
  }

  private renderShellFrame(dt: number): void {
    this.environment.update(this.player.position.z);
    this.effects.update(dt * 0.45, this.player.position, this.player.forwardSpeed * 0.5);
    this.cameraController.update(dt, this.player.getSnapshot(), this.effects.getShakeAmount());
    this.renderer.render(this.scene, this.camera);
    this.frameId = window.requestAnimationFrame(this.loop);
  }

  private configureRoute(route: RouteConfig): void {
    this.environment.configureRoute(route);
    this.train.configureRoute(route, this.getTrainPaintColor());
    this.obstacles.configureRoute(route);
    this.pickups.configureRoute(route);
    this.director.configureRoute(route);
    this.missions.reset(route);
    this.setPieces.configureRoute(route);
    this.boss.configureRoute(route);
  }

  private startRoute(routeId: RouteId): void {
    const route = this.routeManager.startRoute(routeId);
    if (!route) {
      this.menu.showLevelSelect();
      return;
    }

    this.mode = 'gameplay';
    this.summary = null;
    this.configureRoute(route);
    this.applyLoadout();
    this.player.reset();
    this.resetRunSystems();
    this.hud.setGameplayVisible(true);
    this.menu.hide();
    this.renderer.domElement.focus();
  }

  private playFirstRoute(): void {
    const route =
      ROUTE_CONFIGS.find((candidate) => this.routeManager.canStart(candidate.id) && !this.routeManager.progressSnapshot.routes[candidate.id].completed) ??
      ROUTE_CONFIGS.find((candidate) => this.routeManager.canStart(candidate.id));
    this.startRoute(route?.id ?? this.routeManager.currentRoute.id);
  }

  private retryRoute(): void {
    const dailyChallenge = this.summary?.dailyChallenge ?? this.routeManager.currentDailyChallenge;
    if (dailyChallenge) {
      this.startDailyChallenge(dailyChallenge);
      return;
    }

    this.startRoute(this.routeManager.retryCurrentRoute().id);
  }

  private startNextRoute(): void {
    const nextRoute = this.routeManager.getNextPlayableRoute();
    if (nextRoute) {
      this.startRoute(nextRoute.id);
    } else {
      this.openLevelSelect();
    }
  }

  private pauseGame(): void {
    if (this.mode !== 'gameplay') {
      return;
    }

    this.audio.setRunning(false);
    this.mode = 'pause';
    this.hud.setGameplayVisible(false);
    this.menu.showPause();
  }

  private resumeGame(): void {
    if (this.mode !== 'pause') {
      return;
    }

    this.mode = 'gameplay';
    this.hud.setGameplayVisible(true);
    this.menu.hide();
    this.renderer.domElement.focus();
  }

  private openMainMenu(): void {
    this.cleanupRunForShell();
    this.mode = 'menu';
    this.summary = null;
    this.hud.setGameplayVisible(false);
    this.menu.setProgress(this.routeManager.progressSnapshot);
    this.menu.showMain();
  }

  private openLevelSelect(): void {
    this.cleanupRunForShell();
    this.mode = 'levelSelect';
    this.summary = null;
    this.hud.setGameplayVisible(false);
    this.menu.setProgress(this.routeManager.progressSnapshot);
    this.menu.showLevelSelect();
  }

  private openControls(): void {
    this.mode = 'controls';
    this.hud.setGameplayVisible(false);
    this.menu.showControls();
  }

  private openSettings(): void {
    this.mode = 'settings';
    this.hud.setGameplayVisible(false);
    this.menu.setProgress(this.routeManager.progressSnapshot);
    this.menu.showSettings();
  }

  private openGearRoom(): void {
    this.mode = 'gearRoom';
    this.summary = null;
    this.hud.setGameplayVisible(false);
    this.menu.setProgress(this.routeManager.progressSnapshot);
    this.menu.showGearRoom();
  }

  private openRecords(): void {
    this.mode = 'records';
    this.summary = null;
    this.hud.setGameplayVisible(false);
    this.menu.setProgress(this.routeManager.progressSnapshot);
    this.menu.showRecords(getDailyChallenge());
  }

  private openDailyChallenge(): void {
    this.mode = 'dailyChallenge';
    this.summary = null;
    this.hud.setGameplayVisible(false);
    this.menu.setProgress(this.routeManager.progressSnapshot);
    this.menu.showDailyChallenge(getDailyChallenge());
  }

  private startDailyChallenge(challenge = getDailyChallenge()): void {
    const route = this.routeManager.startDailyChallenge(challenge);
    this.mode = 'gameplay';
    this.summary = null;
    this.configureRoute(route);
    this.applyLoadout();
    this.player.reset();
    this.resetRunSystems();
    this.hud.setGameplayVisible(true);
    this.menu.hide();
    this.renderer.domElement.focus();
  }

  private resetProgress(): void {
    this.routeManager.resetProgress();
    this.configureRoute(this.routeManager.currentRoute);
    this.applyLoadout();
    this.applySettings();
    this.menu.setProgress(this.routeManager.progressSnapshot);
    this.menu.showSettings();
  }

  private updateSettings(settings: Partial<GameSettings>): void {
    this.routeManager.updateSettings(settings);
    this.applySettings();
    this.menu.setProgress(this.routeManager.progressSnapshot);
    this.menu.showSettings();
  }

  private purchaseUpgrade(upgradeId: UpgradeId): void {
    this.routeManager.purchaseUpgrade(upgradeId);
    this.applyLoadout();
    this.menu.setProgress(this.routeManager.progressSnapshot);
    this.menu.showGearRoom('upgrades');
  }

  private unlockOrEquipWeapon(weaponId: WeaponStyleId): void {
    this.routeManager.unlockOrEquipWeapon(weaponId);
    this.applyLoadout();
    this.menu.setProgress(this.routeManager.progressSnapshot);
    this.menu.showGearRoom('weapons');
  }

  private equipSkin(skinId: SkinId): void {
    this.routeManager.equipSkin(skinId);
    this.applyLoadout();
    this.menu.setProgress(this.routeManager.progressSnapshot);
    this.menu.showGearRoom('skins');
  }

  private unlockOrEquipCosmetic(cosmeticId: CosmeticId): void {
    this.routeManager.unlockOrEquipCosmetic(cosmeticId);
    this.configureRoute(this.routeManager.currentRoute);
    this.applyLoadout();
    this.menu.setProgress(this.routeManager.progressSnapshot);
    this.menu.showGearRoom('cosmetics');
  }

  private applySettings(): void {
    const settings = this.routeManager.settings;
    this.audio.setSettings(settings);
    this.input.configure(settings);
    this.cameraController.setShakeEnabled(settings.cameraShake);
    this.effects.setVfxIntensity(settings.performanceMode && settings.vfxIntensity === 'high' ? 'medium' : settings.vfxIntensity);
    this.effects.setReducedMotion(settings.reducedMotion);
    this.hud.setControlHintsVisible(settings.showControlHints);
    this.hud.setHighContrastWarnings(settings.highContrastWarnings);
    this.hud.setComfortSettings(settings);
    this.menu.setComfortSettings(settings);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, settings.performanceMode ? 1.15 : 1.8));
    this.renderer.shadowMap.enabled = !settings.performanceMode;
  }

  private applyLoadout(): void {
    const save = this.routeManager.progressSnapshot;
    const modifiers = getLoadoutModifiers(save);
    const skin = SKIN_CONFIGS.find((candidate) => candidate.id === save.equippedSkin) ?? SKIN_CONFIGS[0];
    this.stats.configureLoadout(modifiers);
    this.player.configureLoadout(modifiers);
    this.player.character.applySkin(skin.colors);
    this.pickups.configureLoadout(modifiers);
    this.combat.configureLoadout(modifiers);
    this.special.configureLoadout(modifiers);
  }

  private getTrainPaintColor(): number | undefined {
    const save = this.routeManager.progressSnapshot;
    return COSMETIC_CONFIGS.find((cosmetic) => cosmetic.id === save.equippedCosmetics.trainPaint)?.color;
  }

  private configureRenderer(): void {
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    this.renderer.setSize(this.host.clientWidth || window.innerWidth, this.host.clientHeight || window.innerHeight, false);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.22;
  }

  private cleanupRunForShell(): void {
    if (this.mode !== 'gameplay' && this.mode !== 'pause') {
      return;
    }

    this.audio.setRunning(false);
    this.resetRunSystems();
    this.player.reset();
    this.hud.setGameplayVisible(false);
  }

  private readonly onDebugKeyDown = (event: KeyboardEvent): void => {
    if (!this.debugEnabled) {
      return;
    }

    if (event.code === 'F2') {
      event.preventDefault();
      this.stats.debugFillEnergy();
      this.hud.showFeedback('DEBUG Energy Filled', 0.7);
    } else if (event.code === 'F3') {
      event.preventDefault();
      this.player.debugSetDistance(Math.max(0, this.routeManager.currentRoute.bossStartDistance - 24));
      this.train.update(this.player.position.z);
      this.hud.showFeedback('DEBUG Boss Approach', 0.7);
    } else if (event.code === 'F4') {
      event.preventDefault();
      this.routeManager.debugUnlockAllRoutes();
      this.menu.setProgress(this.routeManager.progressSnapshot);
      this.hud.showFeedback('DEBUG Routes Unlocked', 0.7);
    } else if (event.code === 'F8') {
      event.preventDefault();
      this.resetProgress();
    }
  };

  private updateDebugPanel(): void {
    if (!this.debugPanel) {
      return;
    }

    const segment = this.director.getSegment(this.player.distance);
    this.debugPanel.textContent = `debug=1 | mode ${this.mode} | route ${this.routeManager.currentRoute.id} | state ${this.player.state} | segment ${segment} | z ${Math.floor(
      this.player.position.z
    )} | dist ${Math.floor(this.player.distance)} | energy ${this.stats.energy.toFixed(0)}`;
  }
}
