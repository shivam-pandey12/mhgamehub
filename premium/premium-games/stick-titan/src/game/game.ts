import * as THREE from 'three';
import { chooseBossIntent, chooseFighterIntent } from './ai';
import {
  BOSS_MAGAZINE_SIZE,
  BOSS_RESERVE_AMMO,
  BOSS_MAX_HEALTH,
  BOMB_LIMIT,
  FIGHTER_MAGAZINE_SIZE,
  FIGHTER_RESERVE_AMMO,
  GRENADE_LIMIT,
  GUARD_BREAK_STUN,
  PLAYER_MAGAZINE_SIZE,
  PLAYER_RESERVE_AMMO,
  activateOverdrive,
  activateRage,
  addRage,
  applyHitPause,
  canCancelInto,
  canFireGun,
  canQueueCombo,
  cancelCombat,
  createBossState,
  createCombatState,
  createDefenseState,
  createFinisherState,
  createGunState,
  createPowerState,
  createRageState,
  createSlowMoState,
  createUtilityState,
  createWeaponSwitchState,
  crossedNearDefeatThreshold,
  fireGun,
  getAttackDefinition,
  getPatternForAttack,
  getPushSpeed,
  isAttackActive,
  isCombatNeutral,
  markHitConfirmed,
  markBossFinisherEligible,
  pushInputTokens,
  receiveHit,
  requestDirectAttack,
  requestPlayerAttack,
  requestWeaponSwitch,
  startDash,
  startReload,
  startWeaponSwitch,
  tickBossState,
  tickCombat,
  tickDefenseState,
  tickGunState,
  tickPowerState,
  tickRageState,
  tickSlowMo,
  tickUtilityState,
  tickWeaponSwitch,
  triggerShockwave,
  triggerSlowMo,
  useBomb,
  useGrenade,
  resolveBufferedCommand,
} from './combat';
import { CombatSoundController } from './combatAudio';
import { ThirdPersonCamera, type FinisherCameraState } from './camera';
import {
  getCloudSessionState,
  initFirebase,
  loginUser,
  logoutUser,
  syncPlayerData,
  type CloudSessionState,
} from './firebaseSync';
import { HUDController, type HudAction } from './hud';
import { InputController } from './input';
import { approach, clamp, damp, smoothStep, vector3 } from './math';
import {
  applyMatchResult,
  computeAppliedModifiers,
  createEmptyMatchStats,
  getOpponentVariantDefinition,
  getChallengeTier,
  getGameModeDefinition,
  getModeAvailability,
  getSkinDefinition,
  getStageDefinition,
  exportProfileData,
  importProfileData,
  loadProgressionState,
  markTutorialCompleted,
  purchaseCoinSkin,
  purchaseUpgrade,
  refreshProfile,
  registerCloudSyncHandler,
  resetProfile,
  requestTutorialReplay,
  resetUpgrades,
  saveProfile,
  selectChallengeTier,
  selectGameMode,
  selectSkin,
  setSelectedStage,
  setProfilePersistenceScope,
  selectTitle,
  setMenuScreen,
  setPresentationMode,
  setDebugAnalyticsVisible,
  setDetailedHowToPlay,
  setShopSection,
  setThemeMode,
  updateSettings,
  type AppliedCombatModifiers,
  type GameModeId,
  type MenuDrawer,
  type PlayerProfile,
  type PostMatchSummary,
  type SkinId,
} from './progression';
import { StickmanRig } from './stickman';
import type {
  ActorState,
  AttackDefinition,
  AttackName,
  CharacterMotorConfig,
  MatchState,
  OpponentArchetype,
  OpponentVariantId,
  ProjectileState,
  SetState,
  StageVariantId,
  TeamTag,
  WeaponMode,
} from './types';

const FIXED_STEP = 1 / 60;
const LANE_Z = 0;
const ARENA_HALF_WIDTH = 7.6;
const PLAYER_SPAWN = vector3(-2.7, 0, LANE_Z);
const FIGHTER_SPAWN = vector3(2.7, 0, LANE_Z);
const BOSS_SPAWN = vector3(3.15, 0, LANE_Z);
const PLAYER_BASE_HEALTH = 125;
const FIGHTER_BASE_HEALTH = 138;
const FINISHER_RANGE = 2.95;
const FINISHER_TIMING_MIN = 0.42;
const FINISHER_TIMING_MAX = 0.72;
const FINISHER_WINDOW = 1.05;
const DASH_SPEED = 12.5;
const PLAYER_DAMAGE_BOOST = 1.15;
const PLAYER_HIT_STUN_BOOST = 1.08;
const PLAYER_KNOCKBACK_BOOST = 1.08;
const SHOCKWAVE_RANGE = 4.5;
const SHOCKWAVE_DAMAGE = 28;
const SHOCKWAVE_KNOCKBACK = 8.4;
const SHOCKWAVE_VERTICAL = 4.6;
const ROUND_INTRO_DURATION = 1.0;
const ROUND_KO_DURATION = 1.25;
const ROUND_SCORE_DURATION = 0.9;
const SURVIVAL_SEQUENCE: ReadonlyArray<{ modeId: GameModeId; variantId: OpponentVariantId }> = [
  { modeId: 'quick_fight', variantId: 'vanguard' },
  { modeId: 'quick_fight', variantId: 'striker' },
  { modeId: 'boss_battle', variantId: 'titan_warden' },
  { modeId: 'quick_fight', variantId: 'ranger' },
  { modeId: 'boss_battle', variantId: 'iron_marshal' },
];
const SURVIVAL_MULTIPLIERS = [1, 1.1, 1.25, 1.4, 1.6] as const;

const PLAYER_MOTOR: CharacterMotorConfig = {
  acceleration: 26,
  deceleration: 30,
  maxSpeed: 4.2,
  sprintSpeed: 4.2,
  jumpVelocity: 8.2,
  gravity: 30,
  fallGravityMultiplier: 1.32,
  airControl: 0.46,
  turnSpeed: 14,
};

const FIGHTER_MOTOR: CharacterMotorConfig = {
  acceleration: 24,
  deceleration: 28,
  maxSpeed: 3.85,
  sprintSpeed: 3.85,
  jumpVelocity: 7.7,
  gravity: 30,
  fallGravityMultiplier: 1.28,
  airControl: 0.38,
  turnSpeed: 13,
};

const BOSS_MOTOR: CharacterMotorConfig = {
  acceleration: 22,
  deceleration: 26,
  maxSpeed: 3.55,
  sprintSpeed: 3.55,
  jumpVelocity: 7.1,
  gravity: 30,
  fallGravityMultiplier: 1.22,
  airControl: 0.32,
  turnSpeed: 11,
};

interface ProjectileVisual {
  state: ProjectileState;
  mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
}

interface ImpactVisual {
  mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  time: number;
  duration: number;
}

function createActor(
  id: string,
  team: TeamTag,
  opponentArchetype: OpponentArchetype,
  spawn: { x: number; y: number; z: number },
  motor: CharacterMotorConfig,
  weaponMode: WeaponMode,
): ActorState {
  const isBoss = opponentArchetype === 'boss';
  return {
    id,
    team,
    opponentArchetype,
    position: { ...spawn },
    velocity: vector3(),
    facing: team === 'player' ? Math.PI / 2 : -Math.PI / 2,
    grounded: true,
    health: isBoss ? BOSS_MAX_HEALTH : team === 'player' ? PLAYER_BASE_HEALTH : FIGHTER_BASE_HEALTH,
    maxHealth: isBoss ? BOSS_MAX_HEALTH : team === 'player' ? PLAYER_BASE_HEALTH : FIGHTER_BASE_HEALTH,
    radius: isBoss ? 0.62 : 0.44,
    height: isBoss ? 2.7 : 2.18,
    motor,
    combat: createCombatState(),
    defense: createDefenseState(),
    air: {
      launched: false,
      juggleHits: 0,
      knockdownTimer: 0,
    },
    weaponMode,
    weaponSwitch: createWeaponSwitchState(),
    gun: createGunState(),
    utility: createUtilityState(),
    power: createPowerState(),
    rage: createRageState(),
    boss: isBoss ? createBossState() : null,
    hitReactTimer: 0,
    aiProfileId: isBoss ? 'boss-basic' : team === 'player' ? 'player' : 'fighter-basic',
    aiLoadout: isBoss ? ['power', 'sword', 'gun'] : ['sword', 'power'],
    patternMemory: {
      recentStarters: [],
      repeatedStarter: null,
      repeatedCount: 0,
      countersTriggered: 0,
    },
    presentationMode: '2_5d',
    silhouette: false,
    animation: {
      pose: 'idle',
      basePose: 'idle',
      overlayPose: null,
      timer: 0,
      blend: 1,
      transitionProgress: 1,
      impactStrength: 0,
      celebrating: false,
      celebrationTime: 0,
    },
  };
}

export class Game {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly perspectiveCamera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
  private readonly orthographicCamera = new THREE.OrthographicCamera(-8, 8, 4.5, -4.5, 0.1, 100);
  private readonly followCamera = new ThirdPersonCamera(this.perspectiveCamera, this.orthographicCamera);
  private readonly input: InputController;
  private readonly hud = new HUDController();
  private readonly combatAudio = new CombatSoundController();
  private readonly player = createActor('player', 'player', 'fighter', PLAYER_SPAWN, PLAYER_MOTOR, 'sword');
  private readonly opponent = createActor('opponent', 'opponent', 'fighter', FIGHTER_SPAWN, FIGHTER_MOTOR, 'power');
  private readonly playerRig = new StickmanRig(0x4bc8ff);
  private readonly fighterRig = new StickmanRig(0xe97a58);
  private readonly bossRig = new StickmanRig(0xff704d, 1.14, true);
  private readonly impacts: ImpactVisual[] = [];
  private readonly projectiles = new Map<string, ProjectileVisual>();
  private ambientLight!: THREE.HemisphereLight;
  private keyLight!: THREE.DirectionalLight;
  private fillLight!: THREE.PointLight;
  private rimLight!: THREE.PointLight;
  private floorMaterial!: THREE.MeshStandardMaterial;
  private laneMaterial!: THREE.MeshBasicMaterial;
  private backWallMaterial!: THREE.MeshStandardMaterial;
  private readonly accentLineMaterials: THREE.MeshBasicMaterial[] = [];
  private readonly pillarMaterials: THREE.MeshStandardMaterial[] = [];
  private activeOpponentRig: StickmanRig;
  private profile: PlayerProfile;
  private modifiers: AppliedCombatModifiers;
  private matchStats = createEmptyMatchStats('standard');
  private setState: SetState = {
    roundState: 'round_intro',
    roundTimer: ROUND_INTRO_DURATION,
    roundNumber: 1,
    targetWins: 2,
    playerRoundsWon: 0,
    opponentRoundsWon: 0,
    stageVariantId: 'neon_hangar',
    opponentVariantId: 'vanguard',
    survivalEncounterIndex: 0,
    survivalMultiplier: 1,
  };
  private matchState: MatchState = 'hub';
  private menuDrawer: MenuDrawer = 'none';
  private postMatchSummary: PostMatchSummary | null = null;
  private previewSkinId: SkinId | null = null;
  private skinFilter: 'all' | 'owned' | 'locked' | 'equipped' = 'all';
  private dailyRewardCoins = 0;
  private finisher = createFinisherState();
  private slowMo = createSlowMoState();
  private accumulator = 0;
  private lastFrameTime = 0;
  private currentTime = 0;
  private matchElapsed = 0;
  private hitPauseTimer = 0;
  private victoryTimer = 0;
  private pendingOutcome: 'win' | 'lose' | null = null;
  private roundWinner: TeamTag | null = null;
  private tutorialChecklist = {
    moved: false,
    jumped: false,
    blocked: false,
    dashed: false,
    light: false,
    heavy: false,
    special: false,
    switched: false,
    reloaded: false,
    grenade: false,
    bomb: false,
    lightning: false,
    rage: false,
    shockwave: false,
    finisher: false,
  };
  private running = false;
  private animationFrame = 0;
  private projectileId = 0;
  private readonly saveImportInput: HTMLInputElement;
  private visibilityPaused = false;
  private resumeMatchState: MatchState | null = null;
  private cloudSession: CloudSessionState = getCloudSessionState();

  constructor(canvas: HTMLCanvasElement) {
    setProfilePersistenceScope('session');
    const progression = loadProgressionState(new Date());
    this.profile = progression.profile;
    this.dailyRewardCoins = progression.dailyRewardCoins;
    this.modifiers = computeAppliedModifiers(this.profile);
    this.activeOpponentRig = this.fighterRig;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.input = new InputController(canvas);
    this.saveImportInput = document.createElement('input');
    this.saveImportInput.type = 'file';
    this.saveImportInput.accept = 'application/json,.json';
    this.saveImportInput.className = 'hidden-file-input';
    this.saveImportInput.addEventListener('change', this.onImportFileSelected);
    document.body.append(this.saveImportInput);
    registerCloudSyncHandler((profile) => this.handleCloudSave(profile));

    this.setupScene();
    this.applyThemeMode();
    this.applyPresentationMode();
    this.applyPlayerPalette();
    this.applyAudioMix();
    this.configureOpponentForMode(this.profile.lastSelectedMode);
    this.prepareMenuShowcase();
    this.followCamera.snap(this.player.position, this.opponent.position);
    this.renderMetaState();

    window.addEventListener('resize', this.onResize);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    window.addEventListener('blur', this.onWindowBlur);
    window.addEventListener('focus', this.onWindowFocus);
    this.onResize();
    void this.initializeCloudSync();
  }

  start(): void {
    if (this.running) {
      return;
    }
    this.running = true;
    this.lastFrameTime = performance.now();
    this.animationFrame = window.requestAnimationFrame(this.loop);
  }

  dispose(): void {
    this.running = false;
    window.cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    window.removeEventListener('blur', this.onWindowBlur);
    window.removeEventListener('focus', this.onWindowFocus);
    this.input.dispose();
    this.hud.dispose();
    registerCloudSyncHandler(null);
    this.saveImportInput.removeEventListener('change', this.onImportFileSelected);
    this.saveImportInput.remove();
    this.renderer.dispose();
  }

  private readonly onResize = (): void => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.perspectiveCamera.aspect = width / Math.max(height, 1);
    this.perspectiveCamera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  };

  private readonly onVisibilityChange = (): void => {
    if (document.hidden) {
      this.pauseForVisibility();
    } else {
      this.resumeFromVisibility();
    }
  };

  private readonly onWindowBlur = (): void => {
    this.pauseForVisibility();
  };

  private readonly onWindowFocus = (): void => {
    if (!document.hidden) {
      this.resumeFromVisibility();
    }
  };

  private readonly onImportFileSelected = (): void => {
    const file = this.saveImportInput.files?.[0];
    this.saveImportInput.value = '';
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        this.profile = importProfileData(String(reader.result ?? ''), new Date());
        this.dailyRewardCoins = 0;
        this.modifiers = computeAppliedModifiers(this.profile);
        this.skinFilter = 'all';
        this.previewSkinId = null;
        this.applyThemeMode();
        this.applyPresentationMode();
        this.applyPlayerPalette();
        this.applyAudioMix();
        this.configureOpponentForMode(this.profile.lastSelectedMode, undefined, this.profile.selectedStageId, false);
        this.enterHub('main');
        this.hud.notifyMenuFeedback('confirm', 'Save imported.');
      } catch {
        this.hud.notifyMenuFeedback('deny', 'Import failed. Check the backup file.');
      }
    };
    reader.onerror = () => {
      this.hud.notifyMenuFeedback('deny', 'Could not read that save file.');
    };
    reader.readAsText(file);
  };

  private async initializeCloudSync(): Promise<void> {
    try {
      await initFirebase();
      this.cloudSession = getCloudSessionState();
      const result = await syncPlayerData(this.profile, { immediate: true, reason: 'startup' });
      this.cloudSession = getCloudSessionState();
      if (result.appliedProfile) {
        this.applyCloudProfile(result.appliedProfile);
      }
    } catch {
      this.cloudSession = getCloudSessionState();
    }
    this.renderMetaState();
  }

  private async handleCloudSave(profile: PlayerProfile): Promise<void> {
    const result = await syncPlayerData(profile, { reason: 'save' });
    this.cloudSession = getCloudSessionState();
    if (result.status === 'error') {
      this.renderMetaState();
      return;
    }
    this.renderMetaState();
  }

  private applyCloudProfile(cloudProfile: PlayerProfile): void {
    this.profile = importProfileData(JSON.stringify(cloudProfile), new Date(), {
      skipCloudSync: true,
      preserveTimestamp: true,
    });
    this.dailyRewardCoins = refreshProfile(this.profile, new Date());
    saveProfile(this.profile, { skipCloudSync: true, preserveTimestamp: true });
    this.modifiers = computeAppliedModifiers(this.profile);
    this.menuDrawer = 'none';
    this.previewSkinId = null;
    this.skinFilter = 'all';
    this.applyThemeMode();
    this.applyPresentationMode();
    this.applyPlayerPalette();
    this.applyAudioMix();
    this.configureOpponentForMode(this.profile.lastSelectedMode, undefined, this.profile.selectedStageId, false);
    this.enterHub(this.profile.menuScreen === 'reward' ? 'main' : this.profile.menuScreen);
  }

  private readonly loop = (time: number): void => {
    if (!this.running) {
      return;
    }

    if (this.visibilityPaused) {
      this.lastFrameTime = time;
      this.updateHud();
      this.renderMetaState();
      this.renderer.render(this.scene, this.followCamera.getActiveCamera(this.profile.presentationMode));
      this.animationFrame = window.requestAnimationFrame(this.loop);
      return;
    }

    const rawDt = Math.min(0.05, (time - this.lastFrameTime) / 1000 || FIXED_STEP);
    this.lastFrameTime = time;

    const slowScale = this.hitPauseTimer > 0 ? 0 : tickSlowMo(this.slowMo, rawDt);
    const dt = rawDt * slowScale;
    if (this.hitPauseTimer > 0) {
      this.hitPauseTimer = Math.max(0, this.hitPauseTimer - rawDt);
    }

    const input = this.input.snapshot();
    this.handleCombatOverlayShortcuts(input);

    if (
      this.matchState === 'round_intro' ||
      this.matchState === 'active' ||
      this.matchState === 'round_ko' ||
      this.matchState === 'round_score' ||
      this.matchState === 'finisher' ||
      this.matchState === 'victory_pose'
    ) {
      this.accumulator += dt;
      while (this.accumulator >= FIXED_STEP) {
        this.step(FIXED_STEP, input);
        this.accumulator -= FIXED_STEP;
      }
    } else if (this.matchState === 'help_pause') {
      this.updateHud();
    } else {
      this.handleMetaInput(input);
    }

    this.hud.tick(rawDt);
    this.updateCamera(rawDt);
    this.syncVisuals(time / 1000);
    this.renderMetaState();
    this.renderer.render(this.scene, this.followCamera.getActiveCamera(this.profile.presentationMode));
    this.animationFrame = window.requestAnimationFrame(this.loop);
  };

  private pauseForVisibility(): void {
    if (this.visibilityPaused) {
      return;
    }
    this.visibilityPaused = true;
    if (
      this.matchState === 'active' ||
      this.matchState === 'round_intro' ||
      this.matchState === 'round_ko' ||
      this.matchState === 'round_score' ||
      this.matchState === 'finisher' ||
      this.matchState === 'victory_pose'
    ) {
      this.resumeMatchState = this.matchState;
      this.matchState = 'help_pause';
    }
    this.combatAudio.suspend();
    this.hud.suspendAudio();
  }

  private resumeFromVisibility(): void {
    if (!this.visibilityPaused) {
      return;
    }
    this.visibilityPaused = false;
    if (this.resumeMatchState !== null) {
      this.matchState = this.resumeMatchState;
      this.resumeMatchState = null;
    }
    this.lastFrameTime = performance.now();
    this.combatAudio.resume();
    this.hud.resumeAudio();
  }

  private applyAudioMix(): void {
    this.combatAudio.setMix({
      masterVolume: this.profile.settings.masterVolume,
      combatVolume: this.profile.settings.combatVolume,
      crowdVolume: this.profile.settings.crowdVolume,
    });
    this.hud.setAudioMix({
      masterVolume: this.profile.settings.masterVolume,
      uiVolume: this.profile.settings.uiVolume,
    });
  }

  private setupScene(): void {
    this.scene.background = new THREE.Color(0x090d15);
    this.scene.fog = new THREE.Fog(0x090d15, 14, 34);

    this.ambientLight = new THREE.HemisphereLight(0xd9ecff, 0x1a1210, 1.4);
    this.scene.add(this.ambientLight);

    this.keyLight = new THREE.DirectionalLight(0xfff2db, 1.8);
    this.keyLight.position.set(6, 9, 7);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.setScalar(1024);
    this.keyLight.shadow.camera.near = 0.1;
    this.keyLight.shadow.camera.far = 24;
    this.keyLight.shadow.camera.left = -11;
    this.keyLight.shadow.camera.right = 11;
    this.keyLight.shadow.camera.top = 11;
    this.keyLight.shadow.camera.bottom = -11;
    this.scene.add(this.keyLight);

    this.fillLight = new THREE.PointLight(0x57d7ff, 5.5, 18, 2);
    this.fillLight.position.set(-4.6, 3.4, 7.6);
    this.scene.add(this.fillLight);

    this.rimLight = new THREE.PointLight(0xff8e58, 5.8, 20, 2);
    this.rimLight.position.set(4.8, 4.2, 8.8);
    this.scene.add(this.rimLight);

    this.floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x171e2d,
      roughness: 0.82,
      metalness: 0.06,
    });

    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(20, 0.6, 7.8),
      this.floorMaterial,
    );
    floor.position.set(0, -0.3, 0);
    floor.receiveShadow = true;
    this.scene.add(floor);

    this.laneMaterial = new THREE.MeshBasicMaterial({ color: 0x2d3d58, transparent: true, opacity: 0.5 });

    const lane = new THREE.Mesh(
      new THREE.BoxGeometry(17, 0.03, 0.95),
      this.laneMaterial,
    );
    lane.position.set(0, 0.02, 0);
    this.scene.add(lane);

    this.createBackdrop();

    this.scene.add(this.playerRig.root, this.fighterRig.root, this.bossRig.root);
    this.fighterRig.root.visible = true;
    this.bossRig.root.visible = false;
  }

  private createBackdrop(): void {
    this.backWallMaterial = new THREE.MeshStandardMaterial({
      color: 0x101727,
      roughness: 0.78,
      metalness: 0.08,
    });

    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(24, 7, 0.5),
      this.backWallMaterial,
    );
    backWall.position.set(0, 2.8, -2.9);
    this.scene.add(backWall);

    for (let index = 0; index < 5; index += 1) {
      const accentMaterial = new THREE.MeshBasicMaterial({ color: 0x57d7ff, transparent: true, opacity: 0.32 });
      this.accentLineMaterials.push(accentMaterial);
      const line = new THREE.Mesh(new THREE.BoxGeometry(0.1, 5.2, 0.06), accentMaterial);
      line.position.set(-6 + index * 3, 2.5, -2.58);
      this.scene.add(line);
    }

    for (let index = 0; index < 4; index += 1) {
      const pillarMaterial = new THREE.MeshStandardMaterial({
        color: index % 2 === 0 ? 0x202b41 : 0x2c2439,
        roughness: 0.75,
        metalness: 0.12,
      });
      this.pillarMaterials.push(pillarMaterial);
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.24, 4.2, 8),
        pillarMaterial,
      );
      pillar.position.set(-6 + index * 4, 2.1, 2.25);
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      this.scene.add(pillar);
    }
  }

  private renderMetaState(): void {
    this.hud.renderMetaState({
      matchState: this.matchState,
      profile: this.profile,
      menuDrawer: this.menuDrawer,
      summary: this.postMatchSummary,
      dailyRewardCoins: this.dailyRewardCoins,
      previewSkinId: this.previewSkinId,
      skinFilter: this.skinFilter,
      cloudSession: this.cloudSession,
    });
  }

  private applyThemeMode(): void {
    document.documentElement.setAttribute('data-theme', this.profile.themeMode);
    this.applyScenePresentation();
  }

  private applyPresentationMode(): void {
    const mode = this.profile.presentationMode;
    document.documentElement.setAttribute('data-presentation', mode);
    this.player.presentationMode = mode;
    this.player.silhouette = mode === '2d';
    this.opponent.presentationMode = mode;
    this.opponent.silhouette = mode === '2d';
    this.applyScenePresentation();
  }

  private applyScenePresentation(): void {
    const isLightTheme = this.profile.themeMode === 'light';
    const is2d = this.profile.presentationMode === '2d';
    const stageId = this.setState.stageVariantId;

    const palette = is2d
      ? {
          background: 0x8fcfff,
          fog: 0x9fd8ff,
          floor: 0x5476a0,
          lane: 0xfff0b3,
          laneOpacity: 0.72,
          wall: 0xffc56f,
          accent: 0xfffcf0,
          accentOpacity: 0.42,
          pillarA: 0xe29b62,
          pillarB: 0xc97e49,
          hemiSky: 0xfff9ef,
          hemiGround: 0xc38945,
          hemiIntensity: 1.78,
          key: 0xfff0cf,
          keyIntensity: 1.35,
          fill: 0x58cfff,
          fillIntensity: 4.4,
          rim: 0xff8c42,
          rimIntensity: 4.7,
        }
      : isLightTheme
        ? {
            background: 0xf8f5ef,
            fog: 0xf8f5ef,
            floor: 0xd9cab1,
            lane: 0x8d7548,
            laneOpacity: 0.34,
            wall: 0xf0e5d2,
            accent: 0xc7a96b,
            accentOpacity: 0.24,
            pillarA: 0xc7a96b,
            pillarB: 0xb79257,
            hemiSky: 0xfffbf4,
            hemiGround: 0xc6a66d,
            hemiIntensity: 1.44,
            key: 0xfff3df,
            keyIntensity: 1.62,
            fill: 0x57d7ff,
            fillIntensity: 3.8,
            rim: 0xff9c63,
            rimIntensity: 4,
          }
        : {
            background: 0x090d15,
            fog: 0x090d15,
            floor: 0x171e2d,
            lane: 0x2d3d58,
            laneOpacity: 0.5,
            wall: 0x101727,
            accent: 0x57d7ff,
            accentOpacity: 0.32,
            pillarA: 0x202b41,
            pillarB: 0x2c2439,
            hemiSky: 0xd9ecff,
            hemiGround: 0x1a1210,
            hemiIntensity: 1.4,
            key: 0xfff2db,
            keyIntensity: 1.8,
            fill: 0x57d7ff,
            fillIntensity: 5.5,
            rim: 0xff8e58,
            rimIntensity: 5.8,
          };

    if (stageId === 'sunset_rooftop') {
      palette.background = is2d ? 0xffd9a8 : isLightTheme ? 0xfff1df : 0x241722;
      palette.fog = is2d ? 0xffdfa8 : isLightTheme ? 0xfff1df : 0x2b1b26;
      palette.floor = is2d ? 0xba6d4b : isLightTheme ? 0xe0b998 : 0x3a2432;
      palette.lane = is2d ? 0xfff7d1 : isLightTheme ? 0xa36a42 : 0xff9c63;
      palette.wall = is2d ? 0xffb468 : isLightTheme ? 0xf5dcc1 : 0x382433;
      palette.accent = is2d ? 0xfff4df : isLightTheme ? 0xe39a55 : 0xffa65e;
      palette.pillarA = is2d ? 0xd98048 : isLightTheme ? 0xc58b5a : 0x5a3240;
      palette.pillarB = is2d ? 0xbf5d3f : isLightTheme ? 0xaf7348 : 0x6c4253;
      palette.hemiGround = is2d ? 0xc8643d : isLightTheme ? 0xd8a673 : 0x2d1821;
      palette.key = 0xffe8c2;
      palette.fill = 0xffae6f;
      palette.rim = 0xff7a57;
    } else if (stageId === 'temple_court') {
      palette.background = is2d ? 0xf5e0a2 : isLightTheme ? 0xf7f1e1 : 0x14161d;
      palette.fog = is2d ? 0xf6e8b3 : isLightTheme ? 0xf7f1e1 : 0x191b25;
      palette.floor = is2d ? 0x8d7440 : isLightTheme ? 0xd5c39b : 0x23252d;
      palette.lane = is2d ? 0x6c5533 : isLightTheme ? 0x8d7448 : 0xe6c26a;
      palette.wall = is2d ? 0xe8c873 : isLightTheme ? 0xeee4cf : 0x1b1d24;
      palette.accent = is2d ? 0xfff4d2 : isLightTheme ? 0xc7a96b : 0xe6c26a;
      palette.pillarA = is2d ? 0xb48d45 : isLightTheme ? 0xc0a268 : 0x34363c;
      palette.pillarB = is2d ? 0x8e6d31 : isLightTheme ? 0xa88b57 : 0x2c2d34;
      palette.hemiGround = is2d ? 0x8c6b27 : isLightTheme ? 0xc8ab72 : 0x17140e;
      palette.key = 0xfff0c8;
      palette.fill = 0xd7c07a;
      palette.rim = 0xffcb7c;
    }

    if (this.scene.background instanceof THREE.Color) {
      this.scene.background.setHex(palette.background);
    } else {
      this.scene.background = new THREE.Color(palette.background);
    }

    if (this.scene.fog) {
      this.scene.fog.color.setHex(palette.fog);
    }

    this.floorMaterial.color.setHex(palette.floor);
    this.laneMaterial.color.setHex(palette.lane);
    this.laneMaterial.opacity = palette.laneOpacity;
    this.backWallMaterial.color.setHex(palette.wall);
    for (const [index, material] of this.pillarMaterials.entries()) {
      material.color.setHex(index % 2 === 0 ? palette.pillarA : palette.pillarB);
    }
    for (const material of this.accentLineMaterials) {
      material.color.setHex(palette.accent);
      material.opacity = palette.accentOpacity;
    }

    this.ambientLight.color.setHex(palette.hemiSky);
    this.ambientLight.groundColor.setHex(palette.hemiGround);
    this.ambientLight.intensity = palette.hemiIntensity;
    this.keyLight.color.setHex(palette.key);
    this.keyLight.intensity = palette.keyIntensity;
    this.fillLight.color.setHex(palette.fill);
    this.fillLight.intensity = palette.fillIntensity;
    this.rimLight.color.setHex(palette.rim);
    this.rimLight.intensity = palette.rimIntensity;
  }

  private applyPlayerPalette(): void {
    const previewId = this.previewSkinId ?? this.profile.selectedSkinId;
    const playerSkin = getSkinDefinition(previewId);
    this.playerRig.setPalette(playerSkin.primaryColor, playerSkin.auraColor, playerSkin.accentColor);
    this.fighterRig.setPalette(0xd7635c, 0xffb18e, 0xfff1d5);
    this.bossRig.setPalette(0xff6a5c, 0xffca8c, 0xfff2de);
  }

  private configureOpponentForMode(
    modeId: GameModeId,
    variantId: OpponentVariantId = this.chooseOpponentVariant(modeId),
    stageId: StageVariantId = this.chooseStageVariant(modeId),
    persistMode = true,
  ): void {
    const challenge = getChallengeTier(this.profile.selectedChallengeTier);
    const variant = getOpponentVariantDefinition(variantId);
    const stage = getStageDefinition(stageId);
    const isBoss = variant.archetype === 'boss';
    const aiBand = this.getAiBand();
    if (persistMode) {
      this.profile.lastSelectedMode = modeId;
    }
    this.setState.stageVariantId = stage.id;
    this.setState.opponentVariantId = variant.id;
    this.profile.selectedStageId = stage.id;
    saveProfile(this.profile);

    this.opponent.opponentArchetype = isBoss ? 'boss' : 'fighter';
    this.opponent.motor = isBoss ? { ...BOSS_MOTOR } : { ...FIGHTER_MOTOR };
    this.opponent.weaponMode = this.getOpponentOpeningWeapon(variant.id);
    this.opponent.boss = isBoss ? createBossState() : null;
    this.opponent.maxHealth = Math.round((isBoss ? BOSS_MAX_HEALTH : FIGHTER_BASE_HEALTH) * challenge.bossHealthMultiplier);
    this.opponent.health = this.opponent.maxHealth;
    this.opponent.radius = isBoss ? 0.62 : 0.44;
    this.opponent.height = isBoss ? 2.7 : 2.18;
    this.opponent.aiProfileId = `${variant.id}-${aiBand}`;
    this.opponent.aiLoadout = this.getOpponentLoadout(variant.id, aiBand);
    this.activeOpponentRig = isBoss ? this.bossRig : this.fighterRig;
    this.fighterRig.root.visible = !isBoss;
    this.bossRig.root.visible = isBoss;
    this.applyPresentationMode();
    this.prepareMenuShowcase();
  }

  private prepareMenuShowcase(): void {
    this.resetActor(this.player, PLAYER_SPAWN, 1);
    const spawn = this.opponent.opponentArchetype === 'boss' ? BOSS_SPAWN : FIGHTER_SPAWN;
    this.resetActor(this.opponent, spawn, -1);
    this.opponent.weaponMode = this.getOpponentOpeningWeapon(this.setState.opponentVariantId);
    this.finisher = createFinisherState();
    this.slowMo = createSlowMoState();
    this.hitPauseTimer = 0;
    this.clearProjectiles();
  }

  private startMatch(modeId: GameModeId = this.profile.lastSelectedMode): void {
    if (getModeAvailability(this.profile, modeId) !== 'available') {
      this.hud.notifyMenuFeedback('deny', `${getGameModeDefinition(modeId).name} is still locked.`);
      return;
    }

    this.profile.lastSelectedMode = modeId;
    const initialVariant =
      modeId === 'survival' ? SURVIVAL_SEQUENCE[0].variantId : this.chooseOpponentVariant(modeId);
    const initialStage = modeId === 'survival' ? this.getStageForSurvivalEncounter(0) : this.chooseStageVariant(modeId);
    this.configureOpponentForMode(modeId === 'survival' ? SURVIVAL_SEQUENCE[0].modeId : modeId, initialVariant, initialStage, modeId !== 'survival');
    this.modifiers = computeAppliedModifiers(this.profile);
    this.matchStats = createEmptyMatchStats(this.profile.selectedChallengeTier);
    this.matchStats.modeId = modeId;
    this.matchStats.opponentArchetype = this.opponent.opponentArchetype;
    this.matchStats.opponentVariantId = initialVariant;
    this.matchStats.presentationMode = this.profile.presentationMode;
    this.matchStats.stageVariantId = initialStage;
    this.matchElapsed = 0;
    this.currentTime = 0;
    this.accumulator = 0;
    this.postMatchSummary = null;
    this.pendingOutcome = null;
    this.victoryTimer = 0;
    this.roundWinner = null;
    this.menuDrawer = 'none';
    this.previewSkinId = null;
    this.setState = {
      roundState: 'round_intro',
      roundTimer: ROUND_INTRO_DURATION,
      roundNumber: 1,
      targetWins: modeId === 'survival' ? 1 : 2,
      playerRoundsWon: 0,
      opponentRoundsWon: 0,
      stageVariantId: initialStage,
      opponentVariantId: initialVariant,
      survivalEncounterIndex: 0,
      survivalMultiplier: modeId === 'survival' ? SURVIVAL_MULTIPLIERS[0] : 1,
    };
    this.profile.tutorialState.active =
      modeId === 'quick_fight' && (!this.profile.tutorialState.completed || this.profile.tutorialState.replayRequested);
    this.profile.tutorialState.step = this.profile.tutorialState.active ? 1 : this.profile.tutorialState.step;
    this.tutorialChecklist = {
      moved: false,
      jumped: false,
      blocked: false,
      dashed: false,
      light: false,
      heavy: false,
      special: false,
      switched: false,
      reloaded: false,
      grenade: false,
      bomb: false,
      lightning: false,
      rage: false,
      shockwave: false,
      finisher: false,
    };
    saveProfile(this.profile);
    this.prepareRound({
      refillPlayer: true,
      restorePlayerHealth: true,
      restoreOpponentHealth: true,
      playerCarry: null,
    });
    this.finisher = createFinisherState();
    this.slowMo = createSlowMoState();
    this.hitPauseTimer = 0;
    this.applyPresentationMode();
    this.followCamera.snap(this.player.position, this.opponent.position);
    this.renderMetaState();
  }

  private enterHub(screen: 'main' | 'modes' | 'shop' | 'profile' | 'settings' = 'main'): void {
    this.matchState = 'hub';
    this.menuDrawer = 'none';
    this.postMatchSummary = null;
    setMenuScreen(this.profile, screen);
    this.prepareMenuShowcase();
    this.renderMetaState();
  }

  private exportSaveBackup(): void {
    try {
      const payload = exportProfileData(this.profile);
      const blob = new Blob([payload], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `stick-titan-save-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      this.hud.notifyMenuFeedback('confirm', 'Save exported.');
    } catch {
      this.hud.notifyMenuFeedback('deny', 'Could not export the local save.');
    }
  }

  private finishMatch(outcome: 'win' | 'lose'): void {
    if (this.matchState === 'post_match' || this.matchState === 'victory_pose') {
      return;
    }
    this.matchStats.outcome = outcome;
    if (outcome === 'win' && this.player.rage.active) {
      this.matchStats.rageWins += 1;
    }
    if (this.profile.tutorialState.active && outcome === 'win') {
      this.matchStats.tutorialCompleted = true;
      markTutorialCompleted(this.profile);
    }
    this.matchStats.durationSeconds = Math.round(this.matchElapsed);
    this.pendingOutcome = outcome;
    this.victoryTimer = 1.4;
    this.matchState = 'victory_pose';
    this.player.animation.celebrating = outcome === 'win';
    this.player.animation.celebrationTime = outcome === 'win' ? this.victoryTimer : 0;
    this.opponent.animation.celebrating = outcome === 'lose';
    this.opponent.animation.celebrationTime = outcome === 'lose' ? this.victoryTimer : 0;
    const winner = outcome === 'win' ? this.player : this.opponent;
    this.spawnImpact(vector3(winner.position.x, winner.position.y + 1.4, LANE_Z), 'victory', 0.24);
    this.combatAudio.play('victory');
  }

  private handleMetaInput(input: ReturnType<InputController['snapshot']>): void {
    if (this.matchState === 'post_match' && input.restartPressed) {
      this.startMatch(this.profile.lastSelectedMode);
    }

    for (const action of this.hud.consumeActions()) {
      this.handleHudAction(action);
    }
  }

  private handleHudAction(action: HudAction): void {
    switch (action.type) {
      case 'navigate':
        setMenuScreen(this.profile, action.screen);
        break;
      case 'open_drawer':
        this.menuDrawer = action.drawer;
        break;
      case 'close_drawer':
        this.menuDrawer = 'none';
        break;
      case 'set_shop_section':
        setShopSection(this.profile, action.section);
        break;
      case 'set_skin_filter':
        this.skinFilter = action.filter;
        break;
      case 'select_mode':
        if (getModeAvailability(this.profile, action.modeId) === 'locked') {
          this.hud.notifyMenuFeedback('deny', `${getGameModeDefinition(action.modeId).name} unlocks later.`);
          break;
        }
        selectGameMode(this.profile, action.modeId);
        this.configureOpponentForMode(action.modeId);
        break;
      case 'launch_mode':
      case 'play_again':
        this.startMatch(action.type === 'launch_mode' ? action.modeId : this.profile.lastSelectedMode);
        return;
      case 'set_challenge':
        if (!selectChallengeTier(this.profile, action.tierId)) {
          this.hud.notifyMenuFeedback('deny', `${getChallengeTier(action.tierId).name} is still locked.`);
        }
        break;
      case 'buy_upgrade':
        if (purchaseUpgrade(this.profile, action.nodeId)) {
          this.modifiers = computeAppliedModifiers(this.profile);
          this.hud.notifyMenuFeedback('upgrade', 'Upgrade installed.');
        } else {
          this.hud.notifyMenuFeedback('deny', 'Upgrade unavailable right now.');
        }
        break;
      case 'reset_upgrades':
        resetUpgrades(this.profile);
        this.modifiers = computeAppliedModifiers(this.profile);
        this.hud.notifyMenuFeedback('confirm', 'Upgrades reset.');
        break;
      case 'buy_skin':
        if (purchaseCoinSkin(this.profile, action.skinId)) {
          this.applyPlayerPalette();
          this.hud.notifyMenuFeedback('purchase', 'Skin unlocked.');
        } else {
          this.hud.notifyMenuFeedback('deny', 'Not enough currency for that skin.');
        }
        break;
      case 'select_skin':
        if (selectSkin(this.profile, action.skinId)) {
          this.previewSkinId = null;
          this.applyPlayerPalette();
        }
        break;
      case 'select_title':
        selectTitle(this.profile, action.titleId);
        break;
      case 'preview_skin':
        this.previewSkinId = action.skinId;
        this.applyPlayerPalette();
        break;
      case 'clear_skin_preview':
        this.previewSkinId = null;
        this.applyPlayerPalette();
        break;
      case 'set_theme':
        setThemeMode(this.profile, action.theme);
        this.applyThemeMode();
        break;
      case 'set_presentation':
        setPresentationMode(this.profile, action.mode);
        this.applyPresentationMode();
        break;
      case 'set_stage':
        setSelectedStage(this.profile, action.stageId);
        this.configureOpponentForMode(
          this.profile.lastSelectedMode === 'survival' ? 'quick_fight' : this.profile.lastSelectedMode,
          this.setState.opponentVariantId,
          action.stageId,
          false,
        );
        break;
      case 'update_setting':
        if (action.setting === 'difficultyAssist') {
          updateSettings(this.profile, {
            difficultyAssist: action.value === 'forgiving' ? 'forgiving' : 'standard',
          });
        } else if (action.setting === 'screenShake') {
          const next = Number(action.value);
          updateSettings(this.profile, {
            screenShake: next === 0 || next === 50 || next === 100 ? next : 100,
          });
        } else {
          updateSettings(this.profile, {
            [action.setting]: Number(action.value),
          } as never);
        }
        this.applyAudioMix();
        break;
      case 'replay_tutorial':
        requestTutorialReplay(this.profile);
        this.startMatch('quick_fight');
        return;
      case 'export_save':
        this.exportSaveBackup();
        break;
      case 'import_save':
        this.saveImportInput.click();
        break;
      case 'reset_profile':
        if (window.confirm('Reset the local profile and start fresh?')) {
          this.profile = resetProfile(new Date());
          this.dailyRewardCoins = 0;
          this.modifiers = computeAppliedModifiers(this.profile);
          this.menuDrawer = 'none';
          this.previewSkinId = null;
          this.skinFilter = 'all';
          this.applyThemeMode();
          this.applyPresentationMode();
          this.applyPlayerPalette();
          this.applyAudioMix();
          this.configureOpponentForMode(this.profile.lastSelectedMode, undefined, this.profile.selectedStageId, false);
          this.enterHub('main');
          this.hud.notifyMenuFeedback('confirm', 'Profile reset.');
          return;
        }
        break;
      case 'continue_guest':
        this.menuDrawer = 'none';
        this.hud.notifyMenuFeedback('navigation', 'Continuing with guest local save.');
        break;
      case 'login_google':
        void this.handleCloudAuthAction(action);
        return;
      case 'login_email_signin':
      case 'login_email_register':
      case 'logout_user':
        void this.handleCloudAuthAction(action);
        return;
      case 'open_upgrades':
        setShopSection(this.profile, 'upgrades');
        break;
      case 'back_to_hub':
        this.enterHub();
        return;
      case 'back_to_profile':
        this.enterHub('profile');
        return;
    }

    this.renderMetaState();
  }

  private async handleCloudAuthAction(
    action:
      | Extract<HudAction, { type: 'login_google' }>
      | Extract<HudAction, { type: 'login_email_signin' }>
      | Extract<HudAction, { type: 'login_email_register' }>
      | Extract<HudAction, { type: 'logout_user' }>,
  ): Promise<void> {
    try {
      if (action.type === 'login_google') {
        await loginUser({ mode: 'google' });
      } else if (action.type === 'login_email_signin') {
        await loginUser({
          mode: 'email-signin',
          email: action.email,
          password: action.password,
        });
      } else if (action.type === 'login_email_register') {
        await loginUser({
          mode: 'email-register',
          email: action.email,
          password: action.password,
        });
      } else {
        await logoutUser();
      }

      this.cloudSession = getCloudSessionState();
      if (action.type === 'logout_user') {
        setProfilePersistenceScope('session');
        this.profile = resetProfile(new Date());
        const refreshed = loadProgressionState(new Date());
        this.profile = refreshed.profile;
        this.dailyRewardCoins = refreshed.dailyRewardCoins;
        this.modifiers = computeAppliedModifiers(this.profile);
        this.menuDrawer = 'none';
        this.previewSkinId = null;
        this.skinFilter = 'all';
        this.applyThemeMode();
        this.applyPresentationMode();
        this.applyPlayerPalette();
        this.applyAudioMix();
        this.configureOpponentForMode(this.profile.lastSelectedMode, undefined, this.profile.selectedStageId, false);
        this.enterHub('main');
        this.hud.notifyMenuFeedback('navigation', 'Logged out. Guest session is reset and stays in this tab only.');
        return;
      }

      const result = await syncPlayerData(this.profile, { immediate: true, reason: action.type });
      this.cloudSession = getCloudSessionState();
      if (result.appliedProfile) {
        this.applyCloudProfile(result.appliedProfile);
      } else {
        this.menuDrawer = 'none';
        this.renderMetaState();
      }

      if (this.cloudSession.isLinked) {
        this.hud.notifyMenuFeedback('confirm', 'Cloud save linked successfully.');
      } else {
        this.hud.notifyMenuFeedback('confirm', 'Guest session restored.');
      }
    } catch (error) {
      this.cloudSession = getCloudSessionState();
      const message = error instanceof Error ? error.message : 'Could not update cloud sign-in.';
      this.hud.notifyMenuFeedback('deny', message);
      this.renderMetaState();
    }
  }

  private handleRoundEnd(winner: TeamTag): void {
    if (this.matchState !== 'active') {
      return;
    }
    this.roundWinner = winner;
    if (winner === 'player') {
      this.setState.playerRoundsWon += 1;
      this.matchStats.roundWins += 1;
    } else {
      this.setState.opponentRoundsWon += 1;
      this.matchStats.roundLosses += 1;
    }
    this.matchState = 'round_ko';
    this.setState.roundState = 'round_ko';
    this.setState.roundTimer = ROUND_KO_DURATION;
    this.combatAudio.play('ko');
  }

  private tickRoundIntro(dt: number): void {
    this.setState.roundTimer = Math.max(0, this.setState.roundTimer - dt);
    this.updateImpactEffects(dt);
    this.updateHud();
    if (this.setState.roundTimer === 0) {
      this.matchState = 'active';
      this.setState.roundState = 'round_active';
    }
  }

  private tickRoundKo(dt: number): void {
    this.setState.roundTimer = Math.max(0, this.setState.roundTimer - dt);
    this.updateImpactEffects(dt);
    this.updateHud();
    if (this.setState.roundTimer > 0 || this.roundWinner === null) {
      return;
    }

    if (this.matchStats.modeId === 'survival') {
      if (this.roundWinner !== 'player') {
        this.finishMatch('lose');
        return;
      }

      const nextEncounterIndex = this.setState.survivalEncounterIndex + 1;
      if (nextEncounterIndex >= SURVIVAL_SEQUENCE.length) {
        this.finishMatch('win');
        return;
      }

      const carry = {
        health: Math.min(this.player.maxHealth, this.player.health + this.player.maxHealth * 0.35),
        ammoInMagazine: this.player.gun.magazineSize,
        reserveAmmo: this.player.gun.reserveAmmo,
        grenades: Math.min(GRENADE_LIMIT, this.player.utility.grenades + 1),
        bombs: SURVIVAL_SEQUENCE[nextEncounterIndex].modeId === 'boss_battle' ? BOMB_LIMIT : this.player.utility.bombs,
      };

      this.setState.survivalEncounterIndex = nextEncounterIndex;
      this.setState.survivalMultiplier = SURVIVAL_MULTIPLIERS[nextEncounterIndex] ?? this.setState.survivalMultiplier;
      this.setState.roundNumber = nextEncounterIndex + 1;
      this.setState.playerRoundsWon = 0;
      this.setState.opponentRoundsWon = 0;

      const nextEncounter = SURVIVAL_SEQUENCE[nextEncounterIndex];
      const nextStage = this.getStageForSurvivalEncounter(nextEncounterIndex);
      this.configureOpponentForMode(nextEncounter.modeId, nextEncounter.variantId, nextStage, false);
      this.matchStats.opponentArchetype = this.opponent.opponentArchetype;
      this.matchStats.opponentVariantId = nextEncounter.variantId;
      this.matchStats.stageVariantId = nextStage;
      this.matchState = 'round_score';
      this.setState.roundState = 'round_score';
      this.setState.roundTimer = ROUND_SCORE_DURATION;
      this.roundWinner = null;
      this.prepareRound({
        refillPlayer: false,
        restorePlayerHealth: false,
        restoreOpponentHealth: true,
        playerCarry: carry,
      });
      return;
    }

    const setWon =
      this.setState.playerRoundsWon >= this.setState.targetWins ||
      this.setState.opponentRoundsWon >= this.setState.targetWins;

    if (setWon) {
      this.finishMatch(this.roundWinner === 'player' ? 'win' : 'lose');
      return;
    }

    this.setState.roundNumber += 1;
    this.matchState = 'round_score';
    this.setState.roundState = 'round_score';
    this.setState.roundTimer = ROUND_SCORE_DURATION;
  }

  private tickRoundScore(dt: number): void {
    this.setState.roundTimer = Math.max(0, this.setState.roundTimer - dt);
    this.updateHud();
    if (this.setState.roundTimer > 0) {
      return;
    }
    this.prepareRound({
      refillPlayer: true,
      restorePlayerHealth: true,
      restoreOpponentHealth: true,
      playerCarry: null,
    });
  }

  private step(dt: number, input: ReturnType<InputController['snapshot']>): void {
    if (this.matchState === 'post_match' || this.matchState === 'hub' || this.matchState === 'help_pause') {
      return;
    }

    this.currentTime += dt;
    this.matchElapsed += dt;

    if (this.matchState === 'round_intro') {
      this.tickRoundIntro(dt);
      return;
    }

    if (this.matchState === 'round_ko') {
      this.tickRoundKo(dt);
      return;
    }

    if (this.matchState === 'round_score') {
      this.tickRoundScore(dt);
      return;
    }

    if (this.matchState === 'finisher') {
      this.tickFinisherSequence(dt);
      return;
    }

    if (this.matchState === 'victory_pose') {
      this.tickVictoryPose(dt);
      return;
    }

    this.tickSharedActorState(this.player, dt, true);
    this.tickSharedActorState(this.opponent, dt, false);
    this.tickWeaponSwitches(dt);
    this.handlePlayerInput(input);
    this.updateTutorialProgress(input);
    this.handleOpponentIntent(dt);
    this.updateActor(this.player, input.moveX, input.jumpPressed, dt, this.getPlayerMoveSpeedMultiplier());
    this.resolveAttacks();
    this.updateProjectiles(dt);
    this.updateImpactEffects(dt);
    this.updateFinisherWindow(input, dt);
    this.updateHud();

    if (this.player.health <= 0) {
      this.handleRoundEnd('opponent');
    } else if (this.opponent.health <= 0) {
      this.handleRoundEnd('player');
    }
  }

  private handleCombatOverlayShortcuts(input: ReturnType<InputController['snapshot']>): void {
    if ((this.matchState === 'active' || this.matchState === 'help_pause') && input.helpPressed) {
      const nextState: MatchState = this.matchState === 'help_pause' ? 'active' : 'help_pause';
      this.matchState = nextState;
      setDetailedHowToPlay(this.profile, nextState === 'help_pause');
    }

    if (
      (this.matchState === 'active' ||
        this.matchState === 'help_pause' ||
        this.matchState === 'finisher' ||
        this.matchState === 'victory_pose') &&
      input.debugPressed
    ) {
      setDebugAnalyticsVisible(this.profile, !this.profile.debugAnalyticsVisible);
    }
  }

  private tickVictoryPose(dt: number): void {
    this.player.animation.celebrationTime = Math.max(0, this.player.animation.celebrationTime - dt);
    this.opponent.animation.celebrationTime = Math.max(0, this.opponent.animation.celebrationTime - dt);
    this.victoryTimer = Math.max(0, this.victoryTimer - dt);
    this.updateImpactEffects(dt);
    this.updateHud();
    if (this.victoryTimer > 0 || !this.pendingOutcome) {
      return;
    }
    this.player.animation.celebrating = false;
    this.opponent.animation.celebrating = false;
    this.postMatchSummary = applyMatchResult(this.profile, this.matchStats);
    this.modifiers = computeAppliedModifiers(this.profile);
    this.dailyRewardCoins = 0;
    this.matchState = 'post_match';
    this.pendingOutcome = null;
    this.renderMetaState();
  }

  private tickSharedActorState(actor: ActorState, dt: number, playerControlled: boolean): void {
    actor.position.z = LANE_Z;
    actor.hitReactTimer = Math.max(0, actor.hitReactTimer - dt);
    actor.air.knockdownTimer = Math.max(0, actor.air.knockdownTimer - dt);
    tickDefenseState(actor.defense, dt);
    tickGunState(actor.gun, dt);
    tickUtilityState(actor.utility, dt);
    tickPowerState(actor.power, dt, actor.weaponMode === 'power');
    tickRageState(actor.rage, dt);

    if (actor.weaponSwitch.active) {
      actor.combat.switchLockTimer = Math.max(actor.combat.switchLockTimer, actor.weaponSwitch.timer);
    }

    const attackSpeed = playerControlled ? this.getPlayerAttackSpeedMultiplier() : this.getOpponentAttackSpeedMultiplier();
    const completedAttack = actor.combat.attackName;
    const combatTick = tickCombat(actor.combat, dt * attackSpeed, this.currentTime);
    if (combatTick.attackFinished) {
      if (
        playerControlled &&
        completedAttack &&
        (completedAttack === 'sword_light3' || completedAttack === 'gun_light2' || completedAttack === 'power_light2')
      ) {
        this.matchStats.fullComboChains += 1;
      }
    }

    if (actor.boss) {
      const changed = tickBossState(actor.boss, dt, actor.health / Math.max(actor.maxHealth, 1));
      if (changed) {
        this.hud.flashCallout(actor.boss.phase === 'phase2' ? 'PHASE SHIFT' : 'FINAL PHASE', 'boss');
      }
    }

    if (!actor.grounded && actor.position.y > 0) {
      const gravity = actor.motor.gravity * (actor.velocity.y > 0 ? 1 : actor.motor.fallGravityMultiplier);
      actor.velocity.y -= gravity * dt;
    }
  }

  private tickWeaponSwitches(dt: number): void {
    const playerMode = tickWeaponSwitch(this.player.weaponSwitch, dt);
    if (playerMode) {
      this.player.weaponMode = playerMode;
      if (playerMode !== 'power') {
        this.player.power.overdriveActive = false;
        this.player.power.overdriveTimer = 0;
      }
    }

    const opponentMode = tickWeaponSwitch(this.opponent.weaponSwitch, dt);
    if (opponentMode) {
      this.opponent.weaponMode = opponentMode;
    }
  }

  private handlePlayerInput(input: ReturnType<InputController['snapshot']>): void {
    if (input.restartPressed && (this.matchState === 'post_match' || this.matchState === 'hub')) {
      this.startMatch(this.profile.lastSelectedMode);
      return;
    }

    if (input.weaponSlotRequest && isCombatNeutral(this.player.combat) && requestWeaponSwitch(this.player.weaponSwitch, this.player.weaponMode, input.weaponSlotRequest)) {
      startWeaponSwitch(this.player.weaponSwitch, input.weaponSlotRequest);
      this.tutorialChecklist.switched = true;
    }

    if (input.reloadPressed && this.player.weaponMode === 'gun') {
      this.tutorialChecklist.reloaded = true;
      if (startReload(this.player.gun)) {
        this.matchStats.reloadsStarted += 1;
        this.combatAudio.play('reload');
      } else if (this.player.gun.ammoInMagazine <= 0) {
        this.combatAudio.play('gun_empty');
      }
    }

    if (input.powerPressed && this.player.weaponMode === 'power' && activateOverdrive(this.player.power)) {
      this.hud.flashCallout('OVERDRIVE', 'power');
      this.combatAudio.play('special');
    }

    if (input.ragePressed && activateRage(this.player.rage)) {
      this.tutorialChecklist.rage = true;
      this.matchStats.rageActivations += 1;
      this.hud.flashCallout('RAGE IGNITED', 'rage');
      this.combatAudio.play('special');
    }

    if (input.shockwavePressed && triggerShockwave(this.player.rage)) {
      this.tutorialChecklist.shockwave = true;
      this.emitShockwave();
    }

    if (this.player.combat.attackName && input.blockHeld && canCancelInto(this.player.combat, 'block')) {
      cancelCombat(this.player.combat);
      this.matchStats.cancelCount += 1;
      this.combatAudio.play('block');
    }

    if (this.player.combat.attackName && input.specialPressed && canCancelInto(this.player.combat, 'special')) {
      cancelCombat(this.player.combat);
      this.matchStats.cancelCount += 1;
    }

    if (this.player.defense.guardBreakTimer <= 0 && this.player.defense.dashTimer <= 0 && this.player.combat.hitStunTimer <= 0) {
      this.player.defense.blocking = input.blockHeld && this.player.grounded && !this.player.combat.attackName && this.player.gun.reloadTimer <= 0;
    } else {
      this.player.defense.blocking = false;
    }

    if (input.dashDirection !== 0 && (this.player.combat.attackName ? canCancelInto(this.player.combat, 'dash') : true)) {
      const cancelDash = Boolean(this.player.combat.attackName);
      if (this.player.combat.attackName) {
        cancelCombat(this.player.combat);
        this.matchStats.cancelCount += 1;
      }
      if (startDash(this.player.defense, input.dashDirection)) {
        this.matchStats.dashesUsed += 1;
        this.player.utility.flashTimer = Math.max(this.player.utility.flashTimer, cancelDash ? 0.22 : 0.14);
        this.spawnImpact(vector3(this.player.position.x, this.player.position.y + 1, LANE_Z), 'dash', cancelDash ? 0.22 : 0.14);
        this.combatAudio.play('dash');
      }
    }

    if (this.player.defense.blocking || this.player.weaponSwitch.active || this.player.combat.hitStunTimer > 0) {
      return;
    }

    if (this.player.weaponMode === 'gun' && input.specialPressed && input.upHeld) {
      if (useGrenade(this.player.utility)) {
        this.tutorialChecklist.grenade = true;
        this.spawnUtilityProjectile('grenade');
        this.hud.flashCallout('GRENADE', 'gun');
        this.combatAudio.play('throw');
      } else {
        this.combatAudio.play('gun_empty');
      }
      return;
    }

    if (this.player.weaponMode === 'gun' && input.specialPressed && input.downHeld) {
      if (useBomb(this.player.utility)) {
        this.tutorialChecklist.bomb = true;
        this.spawnUtilityProjectile('bomb');
        this.hud.flashCallout('BOMB SET', 'gun');
        this.combatAudio.play('throw');
      } else {
        this.combatAudio.play('gun_empty');
      }
      return;
    }

    const airborne = !this.player.grounded;
    if (input.lightPressed) {
      this.tryPlayerAttackFromInput('light', input, airborne);
    }

    if (input.heavyPressed) {
      this.tryPlayerAttackFromInput('heavy', input, airborne);
    }

    if (input.specialPressed) {
      if (this.player.weaponMode === 'power' && input.downHeld) {
        this.tutorialChecklist.lightning = true;
      }
      this.tryPlayerAttackFromInput('special', input, airborne);
    }
  }

  private tryPlayerAttackFromInput(
    inputType: 'light' | 'heavy' | 'special',
    input: ReturnType<InputController['snapshot']>,
    airborne: boolean,
  ): void {
    if (this.player.weaponMode === 'gun' && !canFireGun(this.player.gun)) {
      if (this.player.gun.ammoInMagazine <= 0) {
        if (startReload(this.player.gun)) {
          this.matchStats.reloadsStarted += 1;
          this.combatAudio.play('reload');
        } else {
          this.combatAudio.play('gun_empty');
        }
      }
      return;
    }

    const tokens = this.buildCommandTokens(this.player, this.opponent, input, inputType);
    pushInputTokens(this.player.combat, tokens, this.currentTime);
    const resolved = resolveBufferedCommand(this.player.combat, this.player.weaponMode, this.player.grounded, this.player.rage.active, this.currentTime);

    this.matchStats.attackAttempts += 1;
    let started = false;
    if (resolved) {
      started = requestDirectAttack(this.player.combat, this.currentTime, resolved.attackName);
      if (started) {
        this.noteComboStarter(resolved.patternId, resolved.precision);
      }
    }

    if (!started) {
      started = requestPlayerAttack(this.player.combat, this.currentTime, this.player.weaponMode, inputType, airborne);
      if (started) {
        this.noteComboStarter(inputType === 'special' ? 'special_route' : `${this.player.weaponMode}_${inputType}`, false);
      }
    }

    if (!started) {
      this.matchStats.droppedInputs += 1;
      return;
    }

    if (inputType === 'special') {
      this.combatAudio.play(this.player.weaponMode === 'power' ? 'lightning' : 'special');
    } else if (this.player.weaponMode === 'sword') {
      this.combatAudio.play(inputType === 'heavy' ? 'sword_heavy' : 'sword_light');
    }
  }

  private buildCommandTokens(
    actor: ActorState,
    target: ActorState,
    input: ReturnType<InputController['snapshot']>,
    inputType: 'light' | 'heavy' | 'special',
  ): ('light' | 'heavy' | 'special' | 'up' | 'down' | 'forward' | 'back')[] {
    const facingSign = target.position.x >= actor.position.x ? 1 : -1;
    const tokens: ('light' | 'heavy' | 'special' | 'up' | 'down' | 'forward' | 'back')[] = [];
    if (input.downHeld) {
      tokens.push('down');
    } else if (input.upHeld) {
      tokens.push('up');
    }

    const movingForward = input.moveX !== 0 && Math.sign(input.moveX) === facingSign;
    const movingBack = input.moveX !== 0 && Math.sign(input.moveX) === -facingSign;
    const dashForward = input.dashDirection !== 0 && Math.sign(input.dashDirection) === facingSign;
    if (dashForward) {
      tokens.push('forward', 'forward');
    } else if (movingForward) {
      tokens.push('forward');
    } else if (movingBack) {
      tokens.push('back');
    }

    tokens.push(inputType);
    return tokens;
  }

  private noteComboStarter(starter: string, precision: boolean): void {
    this.matchStats.comboStarters[starter] = (this.matchStats.comboStarters[starter] ?? 0) + 1;
    if (precision) {
      this.matchStats.preciseCombos += 1;
      this.hud.flashCallout('PRECISION', 'gun');
      this.combatAudio.play('combo');
    }
    this.trackPatternMemory(this.player, starter);
  }

  private trackPatternMemory(actor: ActorState, starter: string): void {
    actor.patternMemory.recentStarters = [...actor.patternMemory.recentStarters.slice(-4), starter];
    const recent = actor.patternMemory.recentStarters.filter((entry) => entry === starter).length;
    actor.patternMemory.repeatedStarter = recent >= 3 ? starter : actor.patternMemory.repeatedStarter === starter ? starter : null;
    actor.patternMemory.repeatedCount = recent;
  }

  private handleOpponentIntent(dt: number): void {
    if (this.opponent.health <= 0) {
      return;
    }

    const intent =
      this.opponent.opponentArchetype === 'boss'
        ? chooseBossIntent(this.opponent, this.player, this.matchElapsed)
        : chooseFighterIntent(this.opponent, this.player, this.matchElapsed);
    this.opponent.aiProfileId = intent.debugLabel ?? this.opponent.aiProfileId;

    if (this.opponent.defense.guardBreakTimer <= 0 && this.opponent.combat.hitStunTimer <= 0) {
      this.opponent.defense.blocking = intent.block && this.opponent.grounded && this.opponent.defense.dashTimer <= 0;
    } else {
      this.opponent.defense.blocking = false;
    }

    if (
      intent.weaponModeRequest &&
      isCombatNeutral(this.opponent.combat) &&
      requestWeaponSwitch(this.opponent.weaponSwitch, this.opponent.weaponMode, intent.weaponModeRequest)
    ) {
      startWeaponSwitch(this.opponent.weaponSwitch, intent.weaponModeRequest);
    }

    if (this.opponent.weaponMode === 'gun' && this.opponent.gun.ammoInMagazine <= 0) {
      if (!startReload(this.opponent.gun)) {
        const fallback = this.opponent.opponentArchetype === 'boss' ? 'power' : 'sword';
        if (isCombatNeutral(this.opponent.combat) && requestWeaponSwitch(this.opponent.weaponSwitch, this.opponent.weaponMode, fallback)) {
          startWeaponSwitch(this.opponent.weaponSwitch, fallback);
        }
      }
    }

    if (intent.dashDirection !== 0) {
      if (startDash(this.opponent.defense, intent.dashDirection)) {
        this.combatAudio.play('dash');
        this.spawnImpact(vector3(this.opponent.position.x, this.opponent.position.y + 1, LANE_Z), 'dash', 0.16);
      }
    }

    if (intent.jump && this.opponent.grounded) {
      this.opponent.velocity.y = this.opponent.motor.jumpVelocity;
      this.opponent.grounded = false;
    }

    if (intent.tokens.length > 0) {
      pushInputTokens(this.opponent.combat, intent.tokens, this.currentTime);
      const resolved = resolveBufferedCommand(this.opponent.combat, this.opponent.opponentArchetype === 'boss' ? 'boss' : 'fighter', this.opponent.grounded, this.opponent.rage.active, this.currentTime);
      if (resolved) {
        requestDirectAttack(this.opponent.combat, this.currentTime, resolved.attackName);
      }
    }

    if (intent.attackName) {
      requestDirectAttack(this.opponent.combat, this.currentTime, intent.attackName);
      if (this.opponent.boss) {
        this.opponent.boss.attackCooldown = this.getBossAttackCooldown(intent.attackName);
        if (intent.attackName === 'boss_heavy' || intent.attackName === 'boss_launcher') {
          this.opponent.boss.heavyCooldown = 1.3;
        }
        if (intent.attackName === 'boss_dash') {
          this.opponent.boss.dashCooldown = 1.6;
        }
        this.opponent.boss.lastAttack = intent.attackName;
      }
      if (intent.countering) {
        this.matchStats.aiCounterTriggers += 1;
        this.opponent.patternMemory.countersTriggered += 1;
      }
    } else if (canQueueCombo(this.opponent.combat) && this.opponent.combat.attackName) {
      const followUp = this.opponent.combat.attackName === 'fighter_light1'
        ? 'fighter_light2'
        : this.opponent.combat.attackName === 'boss_light1'
          ? 'boss_light2'
          : null;
      if (followUp) {
        this.opponent.combat.queuedAttack = followUp;
      }
    }

    this.updateActor(this.opponent, intent.moveX, intent.jump, dt, this.getOpponentMoveSpeedMultiplier());
  }

  private getBossAttackCooldown(attackName: AttackName): number {
    if (attackName === 'boss_dash') {
      return 0.95;
    }
    if (attackName === 'boss_heavy' || attackName === 'boss_launcher') {
      return 0.78;
    }
    return 0.42;
  }

  private getPlayerAttackSpeedMultiplier(): number {
    const overdriveBonus = this.player.weaponMode === 'power' && this.player.power.overdriveActive ? 1.18 : 1;
    const rageBonus = this.player.rage.active ? 1.12 : 1;
    return Math.min(1.6, this.modifiers.attackSpeedMultiplier * overdriveBonus * rageBonus);
  }

  private getPlayerDamageMultiplier(): number {
    const overdriveBonus = this.player.weaponMode === 'power' && this.player.power.overdriveActive ? 1.25 : 1;
    const rageBonus = this.player.rage.active ? 1.18 : 1;
    return Math.min(1.8, PLAYER_DAMAGE_BOOST * this.modifiers.outgoingDamageMultiplier * overdriveBonus * rageBonus);
  }

  private getPlayerHitStunMultiplier(): number {
    return this.modifiers.hitStunMultiplier * PLAYER_HIT_STUN_BOOST * (this.player.rage.active ? 1.08 : 1);
  }

  private getPlayerKnockbackMultiplier(): number {
    return this.modifiers.knockbackMultiplier * PLAYER_KNOCKBACK_BOOST * (this.player.rage.active ? 1.12 : 1);
  }

  private getPlayerMoveSpeedMultiplier(): number {
    return this.player.rage.active ? 1.1 : 1;
  }

  private getOpponentDamageMultiplier(): number {
    const assist = this.profile.settings.difficultyAssist === 'forgiving' ? 0.88 : 1;
    return getChallengeTier(this.profile.selectedChallengeTier).bossDamageMultiplier * assist;
  }

  private getOpponentAttackSpeedMultiplier(): number {
    if (!this.opponent.boss) {
      return this.profile.settings.difficultyAssist === 'forgiving' ? 0.94 : 1;
    }
    const phaseSpeed = this.opponent.boss.phase === 'phase3' ? 1.16 : this.opponent.boss.phase === 'phase2' ? 1.08 : 1;
    return phaseSpeed * (this.profile.settings.difficultyAssist === 'forgiving' ? 0.94 : 1);
  }

  private getOpponentMoveSpeedMultiplier(): number {
    const challengeSpeed = getChallengeTier(this.profile.selectedChallengeTier).bossSpeedMultiplier;
    const assist = this.profile.settings.difficultyAssist === 'forgiving' ? 0.94 : 1;
    if (!this.opponent.boss) {
      return challengeSpeed * assist;
    }
    return challengeSpeed * (this.opponent.boss.phase === 'phase3' ? 1.14 : this.opponent.boss.phase === 'phase2' ? 1.06 : 1) * assist;
  }

  private getScreenShakeScale(): number {
    return this.profile.settings.screenShake / 100;
  }

  private getAiBand(): number {
    if (this.profile.level >= 30) {
      return 5;
    }
    if (this.profile.level >= 20) {
      return 4;
    }
    if (this.profile.level >= 10) {
      return 3;
    }
    if (this.profile.level >= 5) {
      return 2;
    }
    return 1;
  }

  private chooseOpponentVariant(modeId: GameModeId): OpponentVariantId {
    const targetArchetype: OpponentArchetype = modeId === 'boss_battle' ? 'boss' : 'fighter';
    const available = this.profile.unlockedOpponentVariants
      .map((variantId) => getOpponentVariantDefinition(variantId))
      .filter((variant) => variant.archetype === targetArchetype);

    if (available.length === 0) {
      return targetArchetype === 'boss' ? 'titan_warden' : 'vanguard';
    }

    const seed = Math.floor((Date.now() / 1000) % available.length);
    return available[seed]?.id ?? available[0].id;
  }

  private chooseStageVariant(modeId: GameModeId): StageVariantId {
    if (modeId === 'survival') {
      return this.getStageForSurvivalEncounter(this.setState.survivalEncounterIndex);
    }
    return this.profile.selectedStageId;
  }

  private getStageForSurvivalEncounter(index: number): StageVariantId {
    const variants: StageVariantId[] = ['neon_hangar', 'sunset_rooftop', 'temple_court'];
    return variants[index % variants.length];
  }

  private configureActorGunLoadout(actor: ActorState): void {
    if (actor === this.player) {
      actor.gun = createGunState({ magazineSize: PLAYER_MAGAZINE_SIZE, reserveAmmo: PLAYER_RESERVE_AMMO });
      return;
    }

    actor.gun =
      actor.opponentArchetype === 'boss'
        ? createGunState({ magazineSize: BOSS_MAGAZINE_SIZE, reserveAmmo: BOSS_RESERVE_AMMO })
        : createGunState({ magazineSize: FIGHTER_MAGAZINE_SIZE, reserveAmmo: FIGHTER_RESERVE_AMMO });
  }

  private getOpponentOpeningWeapon(variantId: OpponentVariantId): WeaponMode {
    switch (variantId) {
      case 'vanguard':
      case 'titan_warden':
        return 'power';
      case 'ranger':
        return 'sword';
      case 'iron_marshal':
      case 'striker':
      default:
        return 'sword';
    }
  }

  private getOpponentLoadout(variantId: OpponentVariantId, aiBand: number): WeaponMode[] {
    switch (variantId) {
      case 'vanguard':
        return ['sword', 'power'];
      case 'striker':
        return aiBand >= 4 ? ['sword', 'power'] : ['sword'];
      case 'ranger':
        return aiBand >= 3 ? ['sword', 'gun'] : ['sword'];
      case 'iron_marshal':
        return aiBand >= 4 ? ['sword', 'power', 'gun'] : ['sword', 'power'];
      case 'titan_warden':
      default:
        return ['power', 'sword'];
    }
  }

  private prepareRound(options: {
    refillPlayer: boolean;
    restorePlayerHealth: boolean;
    restoreOpponentHealth: boolean;
    playerCarry?: {
      health: number;
      ammoInMagazine: number;
      reserveAmmo: number | null;
      grenades: number;
      bombs: number;
    } | null;
  }): void {
    this.matchState = 'round_intro';
    this.setState.roundState = 'round_intro';
    this.setState.roundTimer = ROUND_INTRO_DURATION;
    this.roundWinner = null;

    const playerHealthBefore = this.player.health;
    this.resetActor(this.player, PLAYER_SPAWN, 1);
    this.player.maxHealth = PLAYER_BASE_HEALTH + this.modifiers.maxHealthBonus;
    this.player.health = options.restorePlayerHealth
      ? this.player.maxHealth
      : Math.min(this.player.maxHealth, options.playerCarry?.health ?? playerHealthBefore);
    this.player.weaponMode = 'sword';
    this.player.gun = createGunState({ magazineSize: PLAYER_MAGAZINE_SIZE, reserveAmmo: PLAYER_RESERVE_AMMO });
    if (!options.refillPlayer && options.playerCarry) {
      this.player.gun.ammoInMagazine = Math.max(0, Math.min(this.player.gun.magazineSize, options.playerCarry.ammoInMagazine));
      this.player.gun.reserveAmmo = options.playerCarry.reserveAmmo;
    }
    this.player.utility.grenades = options.refillPlayer
      ? GRENADE_LIMIT
      : Math.max(0, Math.min(GRENADE_LIMIT, options.playerCarry?.grenades ?? this.player.utility.grenades));
    this.player.utility.bombs = options.refillPlayer
      ? BOMB_LIMIT
      : Math.max(0, Math.min(BOMB_LIMIT, options.playerCarry?.bombs ?? this.player.utility.bombs));

    const opponentSpawn = this.opponent.opponentArchetype === 'boss' ? BOSS_SPAWN : FIGHTER_SPAWN;
    this.resetActor(this.opponent, opponentSpawn, -1);
    this.configureActorGunLoadout(this.opponent);
    this.opponent.weaponMode = this.getOpponentOpeningWeapon(this.setState.opponentVariantId);
    if (options.restoreOpponentHealth) {
      const baseHealth = this.opponent.opponentArchetype === 'boss' ? BOSS_MAX_HEALTH : FIGHTER_BASE_HEALTH;
      const challengeHealth = getChallengeTier(this.profile.selectedChallengeTier).bossHealthMultiplier;
      const roundHealthMultiplier = this.matchStats.modeId === 'boss_battle' ? 0.7 : 1;
      this.opponent.maxHealth = Math.round(baseHealth * challengeHealth * roundHealthMultiplier);
      this.opponent.health = this.opponent.maxHealth;
    }

    this.finisher = createFinisherState();
    this.hitPauseTimer = 0;
    this.clearProjectiles();
  }

  private updateActor(actor: ActorState, moveX: number, jumpPressed: boolean, dt: number, moveSpeedMultiplier: number): void {
    const facingDirection = actor === this.player
      ? this.opponent.position.x >= actor.position.x
        ? 1
        : -1
      : this.player.position.x >= actor.position.x
        ? 1
        : -1;
    actor.facing = facingDirection > 0 ? Math.PI / 2 : -Math.PI / 2;
    actor.position.z = LANE_Z;

    if (actor.health <= 0) {
      actor.velocity.x = damp(actor.velocity.x, 0, 12, dt);
    } else if (actor.defense.dashTimer > 0) {
      actor.velocity.x = actor.defense.dashDirection * DASH_SPEED * moveSpeedMultiplier;
    } else if (actor.combat.attackName) {
      actor.velocity.x = facingDirection * getPushSpeed(actor.combat);
    } else if (actor.combat.hitStunTimer <= 0 && actor.air.knockdownTimer <= 0) {
      const control = actor.grounded ? 1 : actor.motor.airControl;
      const target = moveX * actor.motor.maxSpeed * moveSpeedMultiplier * control;
      const delta = (Math.abs(target) > Math.abs(actor.velocity.x) ? actor.motor.acceleration : actor.motor.deceleration) * dt;
      actor.velocity.x = approach(actor.velocity.x, target, delta);
    }

    if (jumpPressed && actor.grounded && actor.combat.hitStunTimer <= 0 && actor.defense.dashTimer <= 0 && actor.defense.guardBreakTimer <= 0) {
      actor.velocity.y = actor.motor.jumpVelocity;
      actor.grounded = false;
      actor.air.launched = false;
      actor.air.juggleHits = 0;
    }

    actor.position.x += actor.velocity.x * dt;
    actor.position.y += actor.velocity.y * dt;
    actor.position.x = clamp(actor.position.x, -ARENA_HALF_WIDTH, ARENA_HALF_WIDTH);
    actor.position.z = LANE_Z;

    if (actor.position.y <= 0) {
      actor.position.y = 0;
      actor.velocity.y = 0;
      actor.grounded = true;
      if (actor.air.knockdownTimer <= 0) {
        actor.air.launched = false;
        actor.air.juggleHits = 0;
      }
    } else {
      actor.grounded = false;
    }
  }

  private resolveAttacks(): void {
    this.resolveLaneAttack(this.player, this.opponent);
    this.resolveLaneAttack(this.opponent, this.player);
  }

  private resolveLaneAttack(attacker: ActorState, target: ActorState): void {
    const attack = getAttackDefinition(attacker.combat.attackName);
    if (!attack || !isAttackActive(attacker.combat) || attacker.combat.hitConnected) {
      return;
    }

    if (attack.projectileSpeed) {
      if (attacker.weaponMode !== 'gun' || fireGun(attacker.gun, this.currentTime)) {
        this.spawnProjectile(attacker, attack);
        attacker.combat.hitConnected = true;
      }
      return;
    }

    if (!this.isAttackInRange(attacker, target, attack)) {
      return;
    }

    const attackerPriority = this.getAttackPriority(attacker, attack);
    const targetAttack = getAttackDefinition(target.combat.attackName);
    const targetPriority =
      targetAttack && isAttackActive(target.combat) && !target.combat.hitConnected && this.isAttackInRange(target, attacker, targetAttack)
        ? this.getAttackPriority(target, targetAttack)
        : 0;

    if (targetPriority > attackerPriority) {
      return;
    }

    const didHit = this.applyResolvedHit(attacker, target, attack);
    if (!didHit) {
      return;
    }

    attacker.combat.hitConnected = true;
    if (targetPriority === attackerPriority && targetAttack && !target.combat.hitConnected) {
      this.applyResolvedHit(target, attacker, targetAttack);
      target.combat.hitConnected = true;
    }
  }

  private isAttackInRange(attacker: ActorState, target: ActorState, attack: AttackDefinition): boolean {
    const horizontalReach = attack.range + attacker.radius + target.radius;
    const projectedX = attacker.position.x + (attacker.facing > 0 ? 1 : -1) * attack.forwardOffset;
    const xAligned = Math.abs(target.position.x - projectedX) <= horizontalReach;
    const verticalCenter = attacker.position.y + attack.height * 0.5;
    const targetCenter = target.position.y + target.height * 0.5;
    const yAligned = Math.abs(targetCenter - verticalCenter) <= attack.height * 0.8 + target.height * 0.4;
    return xAligned && yAligned;
  }

  private getAttackPriority(actor: ActorState, attack: AttackDefinition): number {
    if (actor.rage.active) {
      return 4;
    }
    switch (attack.priority) {
      case 'ultimate':
        return 4;
      case 'special':
        return 3;
      case 'combo':
        return 2;
      case 'basic':
      default:
        return 1;
    }
  }

  private applyResolvedHit(attacker: ActorState, target: ActorState, attack: AttackDefinition): boolean {
    if (target.defense.invincibleTimer > 0 || target.health <= 0) {
      return false;
    }

    const direction = attacker.position.x <= target.position.x ? 1 : -1;
    const playerAttacking = attacker === this.player;
    const attackerDamageMultiplier = playerAttacking ? this.getPlayerDamageMultiplier() : this.getOpponentDamageMultiplier();
    const attackerHitStunMultiplier = playerAttacking ? this.getPlayerHitStunMultiplier() : 1;
    const attackerKnockbackMultiplier = playerAttacking ? this.getPlayerKnockbackMultiplier() : 1;
    let damage = attack.damage * attackerDamageMultiplier;
    let hitStun = attack.hitStun * attackerHitStunMultiplier;
    let knockback = attack.knockback * attackerKnockbackMultiplier;
    let vertical = attack.verticalKnockback;
    let impactKind = attack.impactKind;

    const canBlock = target.defense.blocking && attack.canBeBlocked !== false && target.grounded;
    if (canBlock) {
      if (attack.blockBreak) {
        damage *= 0.35;
        hitStun = Math.max(hitStun, GUARD_BREAK_STUN);
        knockback *= 0.55;
        target.defense.guardBreakTimer = GUARD_BREAK_STUN;
        target.defense.blocking = false;
        impactKind = 'guard';
        this.combatAudio.play('guard_break');
        if (playerAttacking) {
          this.matchStats.guardBreaks += 1;
          this.hud.flashCallout('GUARD BREAK', 'power');
        }
      } else {
        damage *= 0.3;
        hitStun *= 0.35;
        knockback *= 0.28;
        vertical *= 0.2;
        target.defense.successfulBlocks += 1;
        impactKind = 'guard';
        this.combatAudio.play('block');
        if (target === this.player) {
          this.matchStats.successfulBlocks += 1;
        }
      }
    }

    if (target === this.player) {
      damage *= this.modifiers.incomingDamageMultiplier;
      if (target.defense.blocking) {
        damage *= this.modifiers.hazardDamageMultiplier;
      }
    }

    const previousHealth = target.health;
    target.health = Math.max(0, target.health - damage);
    target.velocity.x = direction * knockback;
    if (vertical > 0.01) {
      target.velocity.y = vertical;
      target.grounded = false;
      if (target.air.launched) {
        target.air.juggleHits += 1;
        if (playerAttacking) {
          this.matchStats.juggleHits += 1;
        }
      }
      target.air.launched = attack.launches === true || target.air.launched || vertical > 1;
      if (attack.launches && playerAttacking) {
        this.matchStats.launches += 1;
      }
      const juggleLimit = target.opponentArchetype === 'boss' ? 1 : 3;
      if (target.air.juggleHits >= juggleLimit) {
        target.air.knockdownTimer = 0.5;
      }
    }

    receiveHit(target, hitStun);
    markHitConfirmed(attacker.combat, attack.name, getPatternForAttack(attack.name)?.id ?? attack.patternId ?? attack.name, this.currentTime);
    this.hitPauseTimer = applyHitPause(this.hitPauseTimer, attack.hitPause);
    this.followCamera.addShake(attack.shake * (playerAttacking && attacker.rage.active ? 1.5 : 1) * this.getScreenShakeScale());
    this.spawnImpact(
      vector3((attacker.position.x + target.position.x) * 0.5, Math.max(attacker.position.y, target.position.y) + 1.05, LANE_Z),
      impactKind,
      attack.shake,
    );

    if (playerAttacking) {
      this.matchStats.confirmedHits += 1;
      this.matchStats.damageByWeapon[attacker.weaponMode] += Math.round(damage);
      this.matchStats.weaponsUsed[attacker.weaponMode] = true;
      addRage(this.player.rage, damage * 0.34 * this.modifiers.rageGainMultiplier);
      this.combatAudio.play(
        attack.priority === 'special'
          ? 'special'
          : attack.priority === 'combo' || attack.knockback > 6
            ? 'heavy_hit'
            : 'light_hit',
      );
    } else if (target === this.player) {
      this.matchStats.damageTaken += Math.round(damage);
      addRage(this.player.rage, damage * 0.48 * this.modifiers.rageGainMultiplier);
      this.combatAudio.play(attack.priority === 'special' || attack.knockback > 6 ? 'heavy_hit' : 'light_hit');
    }

    if (attack.slowMoScale && playerAttacking) {
      triggerSlowMo(this.slowMo, attack.slowMoScale, attack.slowMoHold ?? 0.1, 6.5);
    }

    if (crossedNearDefeatThreshold(previousHealth, target.health, target.maxHealth, this.slowMo.nearDefeatTriggered)) {
      this.slowMo.nearDefeatTriggered = true;
      triggerSlowMo(this.slowMo, 0.24, 0.22, 4.6);
      this.hud.flashCallout('FINISH THEM', 'boss');
    }

    if (playerAttacking && target.boss && attack.grantsFinisherVulnerability && target.health / Math.max(target.maxHealth, 1) <= 0.12) {
      markBossFinisherEligible(target.boss);
      this.primeFinisherWindow();
    }

    if (playerAttacking && !target.boss && attack.grantsFinisherVulnerability && target.health / Math.max(target.maxHealth, 1) <= 0.12) {
      this.primeFinisherWindow();
    }

    return true;
  }

  private spawnProjectile(actor: ActorState, attack: AttackDefinition): void {
    const direction = actor.facing > 0 ? 1 : -1;
    const projectile: ProjectileState = {
      id: `proj-${this.projectileId += 1}`,
      ownerTeam: actor.team,
      position: vector3(actor.position.x + direction * 0.86, actor.position.y + 1.15, LANE_Z),
      velocity: vector3(direction * (attack.projectileSpeed ?? 0), 0, 0),
      radius: attack.projectileSize ?? 0.28,
      damage: attack.damage * (actor === this.player ? this.getPlayerDamageMultiplier() : this.getOpponentDamageMultiplier()),
      hitPause: attack.hitPause,
      hitStun: attack.hitStun * (actor === this.player ? this.getPlayerHitStunMultiplier() : 1),
      knockback: attack.knockback * (actor === this.player ? this.getPlayerKnockbackMultiplier() : 1),
      verticalKnockback: attack.verticalKnockback,
      shake: attack.shake,
      impactKind: attack.impactKind,
      blockBreak: attack.blockBreak === true,
      launches: attack.launches === true,
      rageEnhanced: actor.rage.active,
      remainingLife: attack.projectileLifetime ?? 1,
      projectileKind: 'bullet',
      gravity: 0,
      explosiveRadius: 0,
      explodeOnGround: false,
      lingerTimer: 0,
      sourceWeapon: actor.weaponMode,
    };
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(projectile.radius, 12, 12),
      new THREE.MeshStandardMaterial({
        color: actor === this.player ? 0xffd07c : 0xff8a6a,
        emissive: actor === this.player ? new THREE.Color(0xffd07c) : new THREE.Color(0xff6f61),
        emissiveIntensity: actor === this.player ? 1.3 : 0.9,
      }),
    );
    mesh.castShadow = true;
    this.scene.add(mesh);
    this.projectiles.set(projectile.id, { state: projectile, mesh });
    this.followCamera.addRecoil(actor === this.player ? 0.2 * this.modifiers.gunRecoilMultiplier : 0.12);
    if (actor === this.player) {
      this.matchStats.shotsFired += 1;
    }
    this.combatAudio.play('gun_fire');
  }

  private spawnUtilityProjectile(kind: 'grenade' | 'bomb'): void {
    const direction = this.player.facing > 0 ? 1 : -1;
    const projectile: ProjectileState = {
      id: `proj-${this.projectileId += 1}`,
      ownerTeam: 'player',
      position: vector3(this.player.position.x + direction * 0.54, this.player.position.y + 1.05, LANE_Z),
      velocity:
        kind === 'grenade'
          ? vector3(direction * 5.1, 6.4, 0)
          : vector3(direction * 3.8, 4.8, 0),
      radius: kind === 'grenade' ? 0.18 : 0.22,
      damage: (kind === 'grenade' ? 20 : 28) * this.getPlayerDamageMultiplier(),
      hitPause: kind === 'grenade' ? 0.06 : 0.08,
      hitStun: (kind === 'grenade' ? 0.18 : 0.26) * this.getPlayerHitStunMultiplier(),
      knockback: (kind === 'grenade' ? 5.8 : 7.2) * this.getPlayerKnockbackMultiplier(),
      verticalKnockback: kind === 'grenade' ? 4.2 : 5.1,
      shake: kind === 'grenade' ? 0.22 : 0.28,
      impactKind: 'explosive',
      blockBreak: kind === 'bomb',
      launches: true,
      rageEnhanced: this.player.rage.active,
      remainingLife: kind === 'grenade' ? 0.95 : 1.15,
      projectileKind: kind,
      gravity: kind === 'grenade' ? 17 : 12,
      explosiveRadius: kind === 'grenade' ? 1.9 : 2.4,
      explodeOnGround: kind === 'bomb',
      lingerTimer: 0,
      sourceWeapon: 'gun',
    };
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(projectile.radius, 14, 14),
      new THREE.MeshStandardMaterial({
        color: kind === 'grenade' ? 0xc8ef7b : 0xffbb67,
        emissive: new THREE.Color(kind === 'grenade' ? 0xa3ff5f : 0xff7a42),
        emissiveIntensity: kind === 'grenade' ? 0.8 : 1,
      }),
    );
    mesh.castShadow = true;
    this.scene.add(mesh);
    this.projectiles.set(projectile.id, { state: projectile, mesh });
  }

  private emitShockwave(): void {
    const dx = Math.abs(this.opponent.position.x - this.player.position.x);
    if (dx > SHOCKWAVE_RANGE) {
      return;
    }

    this.spawnImpact(vector3(this.player.position.x, this.player.position.y + 1.1, LANE_Z), 'electric', 0.42);
    this.followCamera.addShake(0.22 * this.getScreenShakeScale());
    this.combatAudio.play('lightning');
    const shockAttack = {
      damage: SHOCKWAVE_DAMAGE * this.modifiers.shockwaveMultiplier,
      hitStun: 0.28 * this.getPlayerHitStunMultiplier(),
      knockback: SHOCKWAVE_KNOCKBACK * this.modifiers.shockwaveMultiplier,
      verticalKnockback: SHOCKWAVE_VERTICAL,
      hitPause: 0.07,
      shake: 0.22,
      impactKind: 'rage' as const,
      blockBreak: true,
      launches: true,
      grantsFinisherVulnerability: true,
    };

    if (this.opponent.health > 0) {
      const mock = {
        ...getAttackDefinition('power_heavy')!,
        damage: shockAttack.damage,
        hitStun: shockAttack.hitStun,
        knockback: shockAttack.knockback,
        verticalKnockback: shockAttack.verticalKnockback,
        hitPause: shockAttack.hitPause,
        shake: shockAttack.shake,
        impactKind: shockAttack.impactKind,
        blockBreak: true,
        launches: true,
        grantsFinisherVulnerability: true,
      };
      if (this.applyResolvedHit(this.player, this.opponent, mock)) {
        this.matchStats.weaponsUsed.power = true;
        this.matchStats.damageByWeapon.power += Math.round(shockAttack.damage);
        if (this.opponent.boss?.phase === 'phase3' && this.opponent.health <= 0) {
          this.matchStats.shockwaveBossPhase3Kill = true;
        }
      }
    }
  }

  private updateFinisherWindow(input: ReturnType<InputController['snapshot']>, dt: number): void {
    if (!this.finisher.available || this.finisher.executing) {
      return;
    }

    this.finisher.windowTimer = Math.max(0, this.finisher.windowTimer - dt);
    this.finisher.timingProgress = 1 - this.finisher.windowTimer / Math.max(this.finisher.duration, 0.001);
    const inRange = Math.abs(this.player.position.x - this.opponent.position.x) <= FINISHER_RANGE + this.modifiers.swordFinisherRangeBonus;
    this.finisher.promptVisible = this.finisher.windowTimer > 0 && inRange && !this.opponent.defense.blocking && this.opponent.defense.dashTimer <= 0;

    if (input.finisherPressed && this.finisher.promptVisible) {
      const normalized = smoothStep(0, 1, this.finisher.timingProgress);
      this.finisher.timingSuccess = normalized >= FINISHER_TIMING_MIN && normalized <= FINISHER_TIMING_MAX;
      if (this.finisher.timingSuccess) {
        this.startFinisher();
      } else {
        this.finisher.available = false;
        this.finisher.promptVisible = false;
        this.hud.flashCallout('MISSED', 'boss');
      }
    }

    if (this.finisher.windowTimer <= 0) {
      this.finisher.available = false;
      this.finisher.promptVisible = false;
    }
  }

  private primeFinisherWindow(): void {
    this.finisher.available = true;
    this.finisher.promptVisible = true;
    this.finisher.windowTimer = FINISHER_WINDOW + this.modifiers.finisherWindowBonus;
    this.finisher.duration = FINISHER_WINDOW + this.modifiers.finisherWindowBonus;
    this.finisher.timingProgress = 0;
    triggerSlowMo(this.slowMo, 0.18, 0.18, 4.2);
  }

  private startFinisher(): void {
    this.finisher.available = false;
    this.finisher.promptVisible = false;
    this.finisher.executing = true;
    this.finisher.timer = 1.15;
    this.finisher.impactTriggered = false;
    this.matchState = 'finisher';
  }

  private tickFinisherSequence(dt: number): void {
    this.finisher.timer = Math.max(0, this.finisher.timer - dt);
    if (!this.finisher.impactTriggered && this.finisher.timer <= 0.48) {
      this.finisher.impactTriggered = true;
      this.matchStats.finisherUsed = true;
      this.spawnImpact(vector3(this.opponent.position.x, this.opponent.position.y + 1.2, LANE_Z), 'finisher', 0.5);
      this.followCamera.addShake(0.32 * this.getScreenShakeScale());
      this.opponent.health = 0;
      this.combatAudio.play('finisher');
    }

    if (this.finisher.timer === 0) {
      this.finisher.executing = false;
      this.matchState = 'active';
      this.combatAudio.play('ko');
      this.finishMatch('win');
      return;
    }

    this.updateImpactEffects(dt);
    this.updateHud();
  }

  private updateCamera(dt: number): void {
    const finisher: FinisherCameraState | null = this.finisher.executing
      ? {
          active: true,
          player: this.player.position,
          boss: this.opponent.position,
          progress: 1 - this.finisher.timer / 1.15,
        }
      : null;
    this.followCamera.update(this.player.position, this.opponent.position, dt, {
      rageStrength: this.player.rage.tintStrength,
      recoilKick: this.player.gun.recoil * this.modifiers.gunRecoilMultiplier,
      finisher,
      presentationMode: this.profile.presentationMode,
      aspect: window.innerWidth / Math.max(window.innerHeight, 1),
    });
  }

  private spawnImpact(position: { x: number; y: number; z: number }, kind: AttackDefinition['impactKind'], strength: number): void {
    const color =
      kind === 'rage'
        ? 0xff785c
        : kind === 'explosive'
          ? 0xffb15a
          : kind === 'electric'
            ? 0x8ce6ff
        : kind === 'gun'
          ? 0xffd08a
          : kind === 'power'
            ? 0xffd75a
            : kind === 'guard'
              ? 0x9fd4ff
              : kind === 'finisher'
                ? 0xffffff
                : kind === 'victory'
                  ? 0xfff1a3
                : 0xff9b75;
    const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.22 + strength * 0.9, 12, 12), material);
    mesh.position.set(position.x, position.y, position.z);
    this.scene.add(mesh);
    this.impacts.push({ mesh, time: 0, duration: 0.22 + strength * 0.42 });
  }

  private updateImpactEffects(dt: number): void {
    for (let index = this.impacts.length - 1; index >= 0; index -= 1) {
      const impact = this.impacts[index];
      impact.time += dt;
      const t = impact.time / impact.duration;
      impact.mesh.scale.setScalar(1 + t * 1.8);
      impact.mesh.material.opacity = Math.max(0, 0.9 - t);
      if (impact.time >= impact.duration) {
        this.scene.remove(impact.mesh);
        impact.mesh.geometry.dispose();
        impact.mesh.material.dispose();
        this.impacts.splice(index, 1);
      }
    }
  }

  private updateProjectiles(dt: number): void {
    const targetByTeam: Record<TeamTag, ActorState> = {
      player: this.opponent,
      opponent: this.player,
    };

    for (const [id, projectile] of this.projectiles) {
      projectile.state.remainingLife -= dt;
      projectile.state.position.x += projectile.state.velocity.x * dt;
      projectile.state.position.y += projectile.state.velocity.y * dt;
      if (projectile.state.gravity > 0) {
        projectile.state.velocity.y -= projectile.state.gravity * dt;
      }
      if (projectile.state.position.y <= 0) {
        projectile.state.position.y = 0;
      }
      projectile.mesh.position.set(projectile.state.position.x, projectile.state.position.y, LANE_Z);

      const target = targetByTeam[projectile.state.ownerTeam];
      const hitX = Math.abs(projectile.state.position.x - target.position.x) <= projectile.state.radius + target.radius;
      const hitY = Math.abs(projectile.state.position.y - (target.position.y + 1)) <= 1.05;

      if (projectile.state.projectileKind !== 'bullet') {
        const shouldExplode =
          hitX ||
          projectile.state.remainingLife <= 0 ||
          (projectile.state.explodeOnGround && projectile.state.position.y <= 0) ||
          Math.abs(projectile.state.position.x) > ARENA_HALF_WIDTH + 2;
        if (shouldExplode) {
          this.explodeProjectile(id, target);
        }
        continue;
      }

      if (projectile.state.remainingLife <= 0 || Math.abs(projectile.state.position.x) > ARENA_HALF_WIDTH + 2) {
        this.removeProjectile(id);
        continue;
      }

      if (hitX && hitY && target.health > 0) {
        const template = getAttackDefinition(projectile.state.ownerTeam === 'player' ? 'gun_light1' : 'boss_light1');
        if (template) {
          const proxy: AttackDefinition = {
            ...template,
            damage: projectile.state.damage,
            hitPause: projectile.state.hitPause,
            hitStun: projectile.state.hitStun,
            knockback: projectile.state.knockback,
            verticalKnockback: projectile.state.verticalKnockback,
            shake: projectile.state.shake,
            impactKind: projectile.state.impactKind,
            blockBreak: projectile.state.blockBreak,
            launches: projectile.state.launches,
          };
          this.applyResolvedHit(projectile.state.ownerTeam === 'player' ? this.player : this.opponent, target, proxy);
        }
        this.removeProjectile(id);
      }
    }
  }

  private explodeProjectile(id: string, target: ActorState): void {
    const projectile = this.projectiles.get(id);
    if (!projectile) {
      return;
    }
    this.spawnImpact(projectile.state.position, 'explosive', projectile.state.projectileKind === 'bomb' ? 0.34 : 0.28);
    this.followCamera.addShake(projectile.state.shake * this.getScreenShakeScale());
    this.combatAudio.play('explosion');

    const inRange =
      Math.abs(projectile.state.position.x - target.position.x) <= projectile.state.explosiveRadius + target.radius &&
      Math.abs(projectile.state.position.y - (target.position.y + 1)) <= 2.1;

    if (inRange && target.health > 0) {
      const template = getAttackDefinition(projectile.state.projectileKind === 'bomb' ? 'gun_special' : 'gun_heavy');
      if (template) {
        const proxy: AttackDefinition = {
          ...template,
          damage: projectile.state.damage,
          hitPause: projectile.state.hitPause,
          hitStun: projectile.state.hitStun,
          knockback: projectile.state.knockback,
          verticalKnockback: projectile.state.verticalKnockback,
          shake: projectile.state.shake,
          impactKind: 'explosive',
          blockBreak: projectile.state.blockBreak,
          launches: projectile.state.launches,
        };
        this.applyResolvedHit(this.player, target, proxy);
      }
    }

    this.removeProjectile(id);
  }

  private removeProjectile(id: string): void {
    const projectile = this.projectiles.get(id);
    if (!projectile) {
      return;
    }
    this.scene.remove(projectile.mesh);
    projectile.mesh.geometry.dispose();
    projectile.mesh.material.dispose();
    this.projectiles.delete(id);
  }

  private clearProjectiles(): void {
    for (const id of [...this.projectiles.keys()]) {
      this.removeProjectile(id);
    }
  }

  private updateHud(): void {
    this.hud.updateHealth(this.player.health / Math.max(this.player.maxHealth, 1), this.opponent.health / Math.max(this.opponent.maxHealth, 1));
    this.hud.setMatchState(this.matchState, this.pendingOutcome ?? this.postMatchSummary?.outcome ?? null);
    this.hud.setStatus(false, this.player.weaponMode, this.player.rage.active, this.profile.presentationMode);
    this.hud.setCombatInfo(
      this.player.weaponMode,
      this.getModeDetailText(),
      this.getAmmoText(),
      this.getPowerText(),
      this.getRageText(),
    );
    this.hud.setBossPhase(this.opponent.boss?.phase ?? null, getOpponentVariantDefinition(this.setState.opponentVariantId).name);
    this.hud.setRage(
      this.player.rage.meter / Math.max(this.player.rage.maxMeter, 1),
      this.player.rage.active,
      this.player.rage.cooldownTimer,
      this.player.rage.shockwaveCooldown,
    );
    const warningText = this.getWarningText();
    this.hud.setWarning(warningText, warningText.length > 0);
    this.hud.setFinisherPrompt(this.finisher.promptVisible);
    this.hud.setTint(this.player.rage.tintStrength * 0.22, this.finisher.available || this.finisher.executing ? 0.18 : 0);
    this.hud.setHelpOverlay(
      this.matchState === 'help_pause' && this.profile.showDetailedHowToPlay,
      this.getAmmoText(),
      this.getUtilityText(),
      this.profile.presentationMode,
    );
    this.hud.setDebugOverlay(
      this.profile.debugAnalyticsVisible && this.matchState !== 'hub' && this.matchState !== 'post_match',
      this.getDebugOverlayMarkup(),
    );
  }

  private getWarningText(): string {
    if (this.profile.tutorialState.active) {
      return this.getTutorialPrompt();
    }
    if (this.matchState === 'round_intro') {
      return this.matchStats.modeId === 'survival'
        ? `Encounter ${this.setState.roundNumber}/${SURVIVAL_SEQUENCE.length}: ${getOpponentVariantDefinition(this.setState.opponentVariantId).name}`
        : `Round ${this.setState.roundNumber}. ${getOpponentVariantDefinition(this.setState.opponentVariantId).name} enters ${getStageDefinition(this.setState.stageVariantId).name}.`;
    }
    if (this.matchState === 'round_ko') {
      return this.roundWinner === 'player' ? 'KO confirmed. Hold the momentum.' : 'You were knocked out. Reset your read.';
    }
    if (this.matchState === 'round_score') {
      return `Score ${this.setState.playerRoundsWon}-${this.setState.opponentRoundsWon}. Next round loading.`;
    }
    if (this.matchState === 'help_pause') {
      return this.visibilityPaused ? 'Match paused while the tab is inactive.' : 'Help open. Press Tab to resume combat.';
    }
    if (this.matchState === 'victory_pose') {
      return this.pendingOutcome === 'win' ? 'Victory celebration active.' : 'Opponent celebration active.';
    }
    if (this.finisher.promptVisible) {
      return 'Finisher window open. Press X with clean timing.';
    }
    if (this.opponent.defense.guardBreakTimer > 0) {
      return 'Guard break confirmed. Keep the string going.';
    }
    if (!this.player.grounded && this.opponent.air.launched) {
      return 'Air juggle active.';
    }
    return '';
  }

  private getTutorialPrompt(): string {
    switch (this.profile.tutorialState.step) {
      case 1:
        return 'Tutorial 1/3: Move, jump, block, and dash to learn the lane.';
      case 2:
        return 'Tutorial 2/3: Land light, heavy, and special attacks. Try L-L-H or Down+H.';
      case 3:
        return 'Tutorial 3/3: Switch weapons, reload, throw grenade/bomb, use lightning, then trigger Rage and Shockwave.';
      default:
        return 'Tutorial complete. Finish the fight.';
    }
  }

  private updateTutorialProgress(input: ReturnType<InputController['snapshot']>): void {
    if (!this.profile.tutorialState.active) {
      return;
    }

    if (input.moveX !== 0) {
      this.tutorialChecklist.moved = true;
    }
    if (input.jumpPressed) {
      this.tutorialChecklist.jumped = true;
    }
    if (input.blockHeld) {
      this.tutorialChecklist.blocked = true;
    }
    if (input.dashDirection !== 0) {
      this.tutorialChecklist.dashed = true;
    }
    if (input.lightPressed) {
      this.tutorialChecklist.light = true;
    }
    if (input.heavyPressed) {
      this.tutorialChecklist.heavy = true;
    }
    if (input.specialPressed) {
      this.tutorialChecklist.special = true;
    }
    if (input.weaponSlotRequest) {
      this.tutorialChecklist.switched = true;
    }
    if (input.reloadPressed) {
      this.tutorialChecklist.reloaded = true;
    }
    if (input.ragePressed) {
      this.tutorialChecklist.rage = true;
    }
    if (input.shockwavePressed) {
      this.tutorialChecklist.shockwave = true;
    }
    if (input.finisherPressed || this.finisher.promptVisible) {
      this.tutorialChecklist.finisher = true;
    }

    if (
      this.profile.tutorialState.step === 1 &&
      this.tutorialChecklist.moved &&
      this.tutorialChecklist.jumped &&
      this.tutorialChecklist.blocked &&
      this.tutorialChecklist.dashed
    ) {
      this.profile.tutorialState.step = 2;
      saveProfile(this.profile);
      this.hud.flashCallout('TUTORIAL STEP 2', 'arena');
    } else if (
      this.profile.tutorialState.step === 2 &&
      this.tutorialChecklist.light &&
      this.tutorialChecklist.heavy &&
      this.tutorialChecklist.special
    ) {
      this.profile.tutorialState.step = 3;
      saveProfile(this.profile);
      this.hud.flashCallout('TUTORIAL STEP 3', 'arena');
    } else if (
      this.profile.tutorialState.step === 3 &&
      this.tutorialChecklist.switched &&
      this.tutorialChecklist.reloaded &&
      this.tutorialChecklist.grenade &&
      this.tutorialChecklist.bomb &&
      this.tutorialChecklist.lightning &&
      this.tutorialChecklist.rage &&
      this.tutorialChecklist.shockwave
    ) {
      this.profile.tutorialState.step = 0;
      this.profile.tutorialState.active = false;
      markTutorialCompleted(this.profile);
      this.hud.flashCallout('TUTORIAL CLEAR', 'arena');
    }
  }

  private getModeDetailText(): string {
    if (this.player.weaponMode === 'sword') {
      return 'Light chain into launcher. Heavy cracks guard and finishers.';
    }
    if (this.player.weaponMode === 'gun') {
      return 'Lane shots only. Up+L grenade, Down+L bomb, R to reload.';
    }
    return this.player.power.overdriveActive
      ? 'Rod overdrive live. Heavy hits shred guards and lightning spikes.'
      : 'Power rod stance excels at launches, block breaks, and electric pressure.';
  }

  private getAmmoText(): string {
    if (this.player.weaponMode !== 'gun') {
      return `Gun ${this.player.gun.ammoInMagazine}/${this.player.gun.magazineSize} | Reserve ${this.player.gun.reserveAmmo ?? 'INF'}`;
    }
    return this.player.gun.reloadTimer > 0
      ? `Reloading ${this.player.gun.reloadTimer.toFixed(1)}s`
      : `Ammo ${this.player.gun.ammoInMagazine}/${this.player.gun.magazineSize} | Reserve ${this.player.gun.reserveAmmo ?? 'INF'}`;
  }

  private getPowerText(): string {
    if (this.player.weaponMode !== 'power') {
      return 'Power: press 3 then E';
    }
    return this.player.power.overdriveActive
      ? `Overdrive ${(this.player.power.overdriveTimer + this.modifiers.powerOverdriveBonusSeconds).toFixed(1)}s`
      : 'Press E to ignite overdrive';
  }

  private getRageText(): string {
    if (this.player.rage.active) {
      return `Rage ${this.player.rage.timer.toFixed(1)}s | Q shockwave`;
    }
    return `Rage ${Math.round(this.player.rage.meter)}%`;
  }

  private getUtilityText(): string {
    return `Grenades ${this.player.utility.grenades} | Bombs ${this.player.utility.bombs}`;
  }

  private getDebugOverlayMarkup(): string {
    const attempts = Math.max(1, this.matchStats.attackAttempts);
    const hitConfirm = ((this.matchStats.confirmedHits / attempts) * 100).toFixed(0);
    return `
      <div class="debug-panel">
        <span class="eyebrow">Debug Analytics</span>
        <div class="debug-grid">
          <div><span>Visual Mode</span><strong>${this.profile.presentationMode === '2d' ? '2D' : '2.5D'}</strong></div>
          <div><span>AI Plan</span><strong>${this.opponent.aiProfileId}</strong></div>
          <div><span>Opponent Weapon</span><strong>${this.opponent.weaponMode.toUpperCase()}</strong></div>
          <div><span>Opponent Ammo</span><strong>${this.opponent.gun.ammoInMagazine}/${this.opponent.gun.magazineSize} + ${this.opponent.gun.reserveAmmo ?? 'INF'}</strong></div>
          <div><span>Hit Confirm</span><strong>${hitConfirm}%</strong></div>
          <div><span>Cancels</span><strong>${this.matchStats.cancelCount}</strong></div>
          <div><span>Dropped Inputs</span><strong>${this.matchStats.droppedInputs}</strong></div>
          <div><span>AI Counters</span><strong>${this.matchStats.aiCounterTriggers}</strong></div>
          <div><span>Ammo</span><strong>${this.player.gun.ammoInMagazine}/${this.player.gun.magazineSize} + ${this.player.gun.reserveAmmo ?? 'INF'}</strong></div>
          <div><span>Utility</span><strong>G ${this.player.utility.grenades} | B ${this.player.utility.bombs}</strong></div>
        </div>
      </div>
    `;
  }

  private syncVisuals(elapsedTime: number): void {
    this.playerRig.update(this.player, elapsedTime);
    this.activeOpponentRig.update(this.opponent, elapsedTime);
    this.fighterRig.root.visible = this.activeOpponentRig === this.fighterRig;
    this.bossRig.root.visible = this.activeOpponentRig === this.bossRig;
  }

  private resetActor(actor: ActorState, spawn: { x: number; y: number; z: number }, facingDirection: -1 | 1): void {
    actor.position = { ...spawn };
    actor.velocity = vector3();
    actor.facing = facingDirection > 0 ? Math.PI / 2 : -Math.PI / 2;
    actor.grounded = true;
    actor.combat = createCombatState();
    actor.defense = createDefenseState();
    actor.air = { launched: false, juggleHits: 0, knockdownTimer: 0 };
    actor.weaponSwitch = createWeaponSwitchState();
    this.configureActorGunLoadout(actor);
    actor.utility = actor === this.player ? createUtilityState() : { grenades: 0, bombs: 0, grenadeCooldown: 0, bombCooldown: 0, flashTimer: 0 };
    actor.power = createPowerState();
    actor.rage = createRageState();
    if (actor.opponentArchetype === 'boss') {
      actor.boss = createBossState();
    }
    actor.hitReactTimer = 0;
    actor.patternMemory = {
      recentStarters: [],
      repeatedStarter: null,
      repeatedCount: 0,
      countersTriggered: 0,
    };
    actor.animation = {
      pose: 'idle',
      basePose: 'idle',
      overlayPose: null,
      timer: 0,
      blend: 1,
      transitionProgress: 1,
      impactStrength: 0,
      celebrating: false,
      celebrationTime: 0,
    };
  }
}
