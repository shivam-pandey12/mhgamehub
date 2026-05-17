import * as THREE from 'three';

export type CoachType = 'passenger' | 'cargo' | 'armored' | 'low' | 'tall';

export type RunnerState =
  | 'intro'
  | 'running'
  | 'jumping'
  | 'airborne'
  | 'landing'
  | 'sliding'
  | 'dodging'
  | 'falling'
  | 'failed';

export type LaneIndex = -1 | 0 | 1;
export type SpawnPattern = 'calm' | 'obstacle' | 'pickup' | 'enemy' | 'mixed' | 'recovery';
export type ObstacleType = 'lowBarrier' | 'roofCrate' | 'electricGate' | 'brokenPanel' | 'hangingBeam';
export type EnemyType = 'laneBlocker' | 'runner' | 'shield';
export type EnemyState = 'waiting' | 'alert' | 'approach' | 'attack' | 'hit' | 'defeated';
export type PickupType = 'coin' | 'energy' | 'shield' | 'routeToken';
export type DamageSource = 'obstacle' | 'enemy' | 'electric' | 'brokenRoof' | 'fall';
export type CombatHitKind = 'basic' | 'dash' | 'jump' | 'counter';
export type RouteId = 'neon-express' | 'dustline-runner' | 'frost-rail' | 'jungle-breakline' | 'volcano-freight';
export type BiomeId = 'cyber' | 'desert' | 'snow' | 'jungle' | 'lava';
export type DifficultyId = 'easy' | 'normal' | 'hard' | 'expert';
export type TrainVariantId = 'cyberMaglev' | 'desertCargo' | 'snowArmored' | 'jungleSupply' | 'lavaFreight';
export type RouteTokenType = 'dataChip' | 'desertRelic' | 'frozenCrystal' | 'jungleIdol' | 'lavaCore';
export type GameMode =
  | 'menu'
  | 'levelSelect'
  | 'controls'
  | 'settings'
  | 'gameplay'
  | 'pause'
  | 'summary'
  | 'gearRoom'
  | 'records'
  | 'dailyChallenge';
export type UpgradeId =
  | 'maxHealth'
  | 'jumpPower'
  | 'dashCooldown'
  | 'specialChargeRate'
  | 'magnetRadius'
  | 'comboStability'
  | 'damagePower'
  | 'shieldStartChance';
export type WeaponStyleId = 'shockGauntlets' | 'energyBaton' | 'railBlade';
export type SkinId = 'defaultRunner' | 'cyberAgent' | 'desertRaider' | 'frostOperative' | 'shadowNinja' | 'goldenChampion';
export type CosmeticCategory = 'trainPaint' | 'trailColor' | 'victoryBanner';
export type CosmeticId =
  | 'cyberChrome'
  | 'dustlineRust'
  | 'frostGuard'
  | 'trailCyan'
  | 'trailAmber'
  | 'trailFrost'
  | 'bannerStandard'
  | 'bannerNeon'
  | 'bannerGold';
export type AchievementId =
  | 'firstRide'
  | 'skybreaker'
  | 'perfectReflex'
  | 'comboFlow'
  | 'noFallHero'
  | 'coinRunner'
  | 'enemySweeper'
  | 'bossHunter'
  | 'specialMaster'
  | 'neonChampion'
  | 'desertSurvivor'
  | 'frostWalker'
  | 'collector'
  | 'sRankRunner'
  | 'untouchable';
export type DailyChallengeKind = 'neonRush' | 'bossHunt' | 'noDamage' | 'coinSprint';
export type MobileControlsMode = 'auto' | 'on' | 'off';
export type RunSegment =
  | 'warmup'
  | 'obstacleChallenge'
  | 'enemyEncounter'
  | 'tunnelRush'
  | 'sideTrain'
  | 'eliteEncounter'
  | 'bossEncounter'
  | 'victory';
export type MissionObjectiveType =
  | 'distance'
  | 'completeRoute'
  | 'coins'
  | 'enemyDefeats'
  | 'specialUses'
  | 'bossDefeated'
  | 'perfectDodges'
  | 'damageLimit'
  | 'routeTokens';
export type SpecialAttackState = 'ready' | 'charging' | 'active' | 'cooldown';
export type BossState = 'inactive' | 'intro' | 'missileWarning' | 'missileImpact' | 'droneDrop' | 'vulnerable' | 'retreat' | 'crashing' | 'defeated';
export type BossAttackPhase = 'missile' | 'droneDrop' | 'vulnerable' | 'crash';
export type EliteEnemyState = 'inactive' | 'intro' | 'idle' | 'slamWindup' | 'slamImpact' | 'chargeWindup' | 'charging' | 'heavyPunch' | 'stunned' | 'defeated';
export type SetPieceState = 'inactive' | 'tunnelRush' | 'sideTrain';
export type Grade = 'C' | 'B' | 'A' | 'S' | 'S+';

export interface DifficultyProfile {
  id: DifficultyId;
  label: string;
  spawnSpacingMultiplier: number;
  pickupGenerosity: number;
  enemyFrequency: number;
  mixedFrequency: number;
  bossWarningMultiplier: number;
}

export interface RouteObjectiveConfig {
  id: string;
  type: MissionObjectiveType;
  label: string;
  target: number;
}

export interface RouteSetPieceConfig {
  type: Exclude<SetPieceState, 'inactive'>;
  start: number;
  end: number;
}

export interface RouteConfig {
  id: RouteId;
  displayName: string;
  biome: BiomeId;
  difficulty: DifficultyId;
  playable: boolean;
  targetDistance: number;
  bossStartDistance: number;
  bossName: string;
  bossHealth: number;
  trainVariant: TrainVariantId;
  allowedObstacleTypes: ObstacleType[];
  allowedEnemyTypes: EnemyType[];
  objectives: RouteObjectiveConfig[];
  setPieces: RouteSetPieceConfig[];
  rewardCoins: number;
  unlockText: string;
  tokenType: RouteTokenType;
  tokenLabel: string;
  tokenCount: number;
  theme: {
    primary: number;
    secondary: number;
    accent: number;
  };
}

export interface RouteProgress {
  routeId: RouteId;
  unlocked: boolean;
  completed: boolean;
  bestScore: number;
  bestGrade: Grade | null;
  objectivesCompleted: string[];
  bestTokenCount: number;
  runs: number;
}

export interface GameSettings {
  soundVolume: number;
  musicVolume: number;
  mute: boolean;
  cameraShake: boolean;
  vfxIntensity: 'low' | 'medium' | 'high';
  showControlHints: boolean;
  highContrastWarnings: boolean;
  performanceMode: boolean;
  mobileControls: MobileControlsMode;
  reducedMotion: boolean;
  uiScale: number;
}

export interface SaveData {
  schemaVersion: number;
  storageAvailable: boolean;
  totalCoins: number;
  coinsLifetime: number;
  routes: Record<RouteId, RouteProgress>;
  settings: GameSettings;
  upgrades: Record<UpgradeId, number>;
  unlockedWeapons: WeaponStyleId[];
  equippedWeapon: WeaponStyleId;
  unlockedSkins: SkinId[];
  equippedSkin: SkinId;
  unlockedCosmetics: CosmeticId[];
  equippedCosmetics: Record<CosmeticCategory, CosmeticId>;
  achievements: Record<AchievementId, AchievementProgress>;
  records: Record<RouteId, LocalRecord>;
  daily: DailySaveData;
}

export interface ProgressUpdateResult {
  rewardCoins: number;
  bestScoreImproved: boolean;
  newUnlocks: RouteId[];
  economy: EconomyBreakdown;
  achievementsUnlocked: AchievementId[];
  cosmeticsUnlocked: CosmeticId[];
  weaponsUnlocked: WeaponStyleId[];
  skinsUnlocked: SkinId[];
  dailyBestImproved?: boolean;
}

export interface LoadoutState {
  upgrades: Record<UpgradeId, number>;
  equippedWeapon: WeaponStyleId;
  equippedSkin: SkinId;
  equippedCosmetics: Record<CosmeticCategory, CosmeticId>;
}

export interface LoadoutModifiers {
  maxHealthBonus: number;
  jumpMultiplier: number;
  dashCooldownMultiplier: number;
  energyGainMultiplier: number;
  magnetRadiusMultiplier: number;
  comboDecayMultiplier: number;
  damageMultiplier: number;
  shieldStartChance: number;
  attackRangeMultiplier: number;
  attackCooldownMultiplier: number;
  specialChargeBonus: number;
  trailColor: number;
}

export interface EconomyBreakdown {
  runCoins: number;
  completionBonus: number;
  objectiveBonus: number;
  gradeBonus: number;
  tokenBonus: number;
  dailyBonus: number;
  achievementBonus: number;
  total: number;
}

export interface AchievementProgress {
  id: AchievementId;
  progress: number;
  completed: boolean;
  rewarded: boolean;
}

export interface DailyChallenge {
  dateKey: string;
  id: string;
  kind: DailyChallengeKind;
  displayName: string;
  routeId: RouteId;
  difficulty: DifficultyId;
  objectiveLabel: string;
  rewardCoins: number;
  seed: number;
}

export interface LocalRecord {
  bestScore: number;
  bestDistance: number;
  bestTime: number;
  bestGrade: Grade | null;
  maxCombo: number;
  fastestClearTime: number | null;
  noDamageClear: boolean;
  enemiesDefeated: number;
  coinsCollected: number;
  bossDefeated: boolean;
  runs: number;
  lastLoadout?: LoadoutState;
}

export interface DailyRecord extends LocalRecord {
  dateKey: string;
  challengeId: string;
  completed: boolean;
}

export interface DailySaveData {
  today: DailyRecord | null;
  history: Record<string, DailyRecord>;
}

export interface CoachCollider {
  id: number;
  type: CoachType;
  startZ: number;
  endZ: number;
  length: number;
  width: number;
  walkableWidth: number;
  roofY: number;
  group: THREE.Group;
}

export interface SurfaceHit {
  coach: CoachCollider;
  roofY: number;
  edgeDistance: number;
}

export interface GapInfo {
  distance: number;
  length: number;
  startZ: number;
  endZ: number;
}

export interface EffectEvent {
  position: THREE.Vector3;
  intensity?: number;
  direction?: THREE.Vector3;
  color?: number;
}

export interface PlayerSnapshot {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  state: RunnerState;
  grounded: boolean;
  forwardSpeed: number;
  lateralVelocity: number;
  stride: number;
  stateTime: number;
  compression: number;
  lean: number;
  attackPose: number;
  dashStrike: number;
  recoil: number;
  perfectDodge: number;
}

export interface ObstacleEntity {
  id: number;
  type: ObstacleType;
  lane: LaneIndex;
  lanes: LaneIndex[];
  z: number;
  roofY: number;
  active: boolean;
  passed: boolean;
  group: THREE.Group;
}

export interface EnemyEntity {
  id: number;
  type: EnemyType;
  lane: LaneIndex;
  z: number;
  roofY: number;
  hp: number;
  maxHp: number;
  state: EnemyState;
  attackTimer: number;
  attackResolved: boolean;
  active: boolean;
  group: THREE.Group;
}

export interface PickupEntity {
  id: number;
  type: PickupType;
  tokenType?: RouteTokenType;
  lane: LaneIndex;
  z: number;
  roofY: number;
  active: boolean;
  group: THREE.Group;
}

export interface CombatHit {
  kind: CombatHitKind;
  damage: number;
  target: EnemyEntity;
  critical: boolean;
}

export interface ScoreEvent {
  type: 'coin' | 'energy' | 'enemy' | 'perfectDodge' | 'cleanGap' | 'obstacleBreak' | 'shield';
  amount: number;
  combo: number;
  label?: string;
}

export interface HudStatsSnapshot {
  health: number;
  maxHealth: number;
  coins: number;
  routeTokens: number;
  energy: number;
  score: number;
  comboMultiplier: number;
  comboLabel: string;
  shielded: boolean;
}

export interface MissionObjective {
  id: string;
  type: MissionObjectiveType;
  label: string;
  target: number;
  progress: number;
  completed: boolean;
}

export interface BossSnapshot {
  active: boolean;
  name: string;
  state: BossState;
  phase: BossAttackPhase;
  health: number;
  maxHealth: number;
  vulnerable: boolean;
}

export interface EliteEnemySnapshot {
  active: boolean;
  name: string;
  state: EliteEnemyState;
  health: number;
  maxHealth: number;
}

export interface SetPieceSnapshot {
  state: SetPieceState;
  label: string;
  progress: number;
}

export interface HudPhase3Snapshot {
  segment: RunSegment;
  routeName: string;
  specialReady: boolean;
  boss: BossSnapshot;
  elite: EliteEnemySnapshot;
  setPiece: SetPieceSnapshot;
  missions: MissionObjective[];
  warning: string;
  summary: RunSummary | null;
}

export interface EliteEnemyEntity {
  state: EliteEnemyState;
  lane: LaneIndex;
  z: number;
  roofY: number;
  hp: number;
  maxHp: number;
  active: boolean;
  group: THREE.Group;
}

export interface RunSummary {
  victory: boolean;
  endReason?: string;
  routeId?: RouteId;
  routeName?: string;
  biome?: BiomeId;
  dailyChallenge?: DailyChallenge;
  isDaily?: boolean;
  distance: number;
  coins: number;
  score: number;
  rewardCoins?: number;
  rewardBreakdown?: EconomyBreakdown;
  achievementsUnlocked?: AchievementId[];
  cosmeticsUnlocked?: CosmeticId[];
  weaponsUnlocked?: WeaponStyleId[];
  skinsUnlocked?: SkinId[];
  dailyBestImproved?: boolean;
  enemiesDefeated: number;
  perfectDodges: number;
  specialUses?: number;
  damageTaken: number;
  maxCombo: number;
  objectivesCompleted: number;
  objectivesTotal: number;
  objectiveIds?: string[];
  bossDefeated: boolean;
  routeTokens?: number;
  routeTokenTarget?: number;
  tokenLabel?: string;
  bestScoreImproved?: boolean;
  newUnlocks?: RouteId[];
  grade: Grade;
}
