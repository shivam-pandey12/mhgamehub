export type TeamTag = 'player' | 'opponent';

export type MatchState =
  | 'intro'
  | 'hub'
  | 'round_intro'
  | 'active'
  | 'round_ko'
  | 'round_score'
  | 'help_pause'
  | 'victory_pose'
  | 'post_match'
  | 'finisher';

export type WeaponMode = 'sword' | 'gun' | 'power';

export type OpponentArchetype = 'fighter' | 'boss';

export type PresentationMode = '2d' | '2_5d';

export type StageVariantId = 'neon_hangar' | 'sunset_rooftop' | 'temple_court';

export type OpponentVariantId = 'vanguard' | 'striker' | 'ranger' | 'titan_warden' | 'iron_marshal';

export type RoundState = 'round_intro' | 'round_active' | 'round_ko' | 'round_score';

export type DifficultyAssist = 'standard' | 'forgiving';

export type AttackName =
  | 'sword_light1'
  | 'sword_light2'
  | 'sword_light3'
  | 'sword_launcher'
  | 'sword_heavy'
  | 'sword_special'
  | 'sword_air'
  | 'gun_light1'
  | 'gun_light2'
  | 'gun_heavy'
  | 'gun_special'
  | 'gun_air'
  | 'power_light1'
  | 'power_light2'
  | 'power_launcher'
  | 'power_heavy'
  | 'power_special'
  | 'power_air'
  | 'fighter_light1'
  | 'fighter_light2'
  | 'fighter_heavy'
  | 'fighter_launcher'
  | 'fighter_special'
  | 'fighter_air'
  | 'boss_light1'
  | 'boss_light2'
  | 'boss_heavy'
  | 'boss_launcher'
  | 'boss_special'
  | 'boss_dash';

export type AttackPhase = 'idle' | 'startup' | 'active' | 'recovery';

export type AttackInput = 'light' | 'heavy' | 'special';

export type AttackPriority = 'basic' | 'combo' | 'special' | 'ultimate';

export type ComboInputToken = 'light' | 'heavy' | 'special' | 'up' | 'down' | 'forward' | 'back';

export type ComboPatternPriority = 'combo' | 'special' | 'ultimate';

export type ImpactKind =
  | 'sword'
  | 'gun'
  | 'power'
  | 'boss'
  | 'rage'
  | 'guard'
  | 'dash'
  | 'finisher'
  | 'special'
  | 'electric'
  | 'explosive'
  | 'victory';

export type BossPhase = 'phase1' | 'phase2' | 'phase3';

export interface Vec2 {
  x: number;
  y: number;
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface BufferedInputEvent {
  token: ComboInputToken;
  time: number;
}

export interface ComboPattern {
  id: string;
  family: WeaponMode | 'fighter' | 'boss';
  name: string;
  tokens: ComboInputToken[];
  attackName: AttackName;
  priority: ComboPatternPriority;
  within: number;
  precisionWindow: number;
  requiresHitConfirm?: boolean;
  groundedOnly?: boolean;
  airborneOnly?: boolean;
  rageOnly?: boolean;
  facingSensitive?: boolean;
}

export interface ComboMatch {
  patternId: string;
  attackName: AttackName;
  priority: ComboPatternPriority;
  precision: boolean;
}

export interface CancelWindow {
  start: number;
  end: number;
  allowBlock: boolean;
  allowDash: boolean;
  allowSpecial: boolean;
  allowComboFollowup: boolean;
  requireHitConfirm?: boolean;
}

export interface HitConfirmState {
  comboContinuable: boolean;
  lastHitConnectedAt: number;
  lastConnectedAttack: AttackName | null;
  lastStarter: string | null;
}

export interface InputState {
  moveX: number;
  moveY: number;
  jumpHeld: boolean;
  jumpPressed: boolean;
  upHeld: boolean;
  downHeld: boolean;
  blockHeld: boolean;
  lightHeld: boolean;
  lightPressed: boolean;
  heavyHeld: boolean;
  heavyPressed: boolean;
  specialHeld: boolean;
  specialPressed: boolean;
  reloadPressed: boolean;
  powerPressed: boolean;
  ragePressed: boolean;
  shockwavePressed: boolean;
  finisherPressed: boolean;
  restartPressed: boolean;
  helpPressed: boolean;
  debugPressed: boolean;
  weaponSlotRequest: WeaponMode | null;
  dashDirection: -1 | 0 | 1;
  mouseDeltaX: number;
  mouseDeltaY: number;
  pointerLocked: boolean;
}

export interface CharacterMotorConfig {
  acceleration: number;
  deceleration: number;
  maxSpeed: number;
  sprintSpeed: number;
  jumpVelocity: number;
  gravity: number;
  fallGravityMultiplier: number;
  airControl: number;
  turnSpeed: number;
}

export interface AttackDefinition {
  name: AttackName;
  family: WeaponMode | 'fighter' | 'boss';
  input: AttackInput;
  startup: number;
  active: number;
  recovery: number;
  comboBufferStart: number;
  comboBufferEnd: number;
  range: number;
  height: number;
  forwardOffset: number;
  damage: number;
  chipDamage: number;
  hitPause: number;
  hitStun: number;
  pushSpeed: number;
  knockback: number;
  verticalKnockback: number;
  shake: number;
  priority: AttackPriority;
  impactKind: ImpactKind;
  canBeBlocked?: boolean;
  canBeDodged?: boolean;
  blockBreak?: boolean;
  launches?: boolean;
  airOnly?: boolean;
  groundOnly?: boolean;
  projectileSpeed?: number;
  projectileLifetime?: number;
  projectileSize?: number;
  grantsFinisherVulnerability?: boolean;
  isFinisher?: boolean;
  slowMoScale?: number;
  slowMoHold?: number;
  patternId?: string;
  animationId?: string;
  ammoCost?: number;
  utilityCost?: {
    grenades?: number;
    bombs?: number;
  };
  effectKind?: 'none' | 'electric' | 'explosive';
  cancelWindow?: CancelWindow | null;
}

export interface CombatState {
  phase: AttackPhase;
  attackName: AttackName | null;
  comboIndex: number;
  phaseTime: number;
  lastAttackStartedAt: number;
  queuedAttack: AttackName | null;
  hitConnected: boolean;
  hitStunTimer: number;
  switchLockTimer: number;
  reloadLockTimer: number;
  inputBuffer: BufferedInputEvent[];
  activeComboRoute: string | null;
  lastComboMatch: ComboMatch | null;
  lastPrecisionBonusAt: number;
  hitConfirm: HitConfirmState;
}

export interface DefenseState {
  blocking: boolean;
  guardBreakTimer: number;
  dashTimer: number;
  dashDirection: -1 | 0 | 1;
  dashCooldown: number;
  invincibleTimer: number;
  blockCooldown: number;
  successfulBlocks: number;
}

export interface AirState {
  launched: boolean;
  juggleHits: number;
  knockdownTimer: number;
}

export interface WeaponSwitchState {
  active: boolean;
  targetMode: WeaponMode | null;
  queuedMode: WeaponMode | null;
  timer: number;
  duration: number;
}

export interface GunState {
  magazineSize: number;
  ammoInMagazine: number;
  reserveAmmo: number | null;
  reloadDuration: number;
  reloadTimer: number;
  fireInterval: number;
  fireCooldown: number;
  recoil: number;
  muzzleFlashTimer: number;
  shotAcceptedAt: number;
}

export interface UtilityState {
  grenades: number;
  bombs: number;
  grenadeCooldown: number;
  bombCooldown: number;
  flashTimer: number;
}

export interface PowerState {
  overdriveActive: boolean;
  overdriveTimer: number;
  overdriveDuration: number;
  glowIntensity: number;
}

export interface RageState {
  meter: number;
  maxMeter: number;
  active: boolean;
  timer: number;
  duration: number;
  cooldownTimer: number;
  cooldownDuration: number;
  shockwaveCooldown: number;
  shockwaveInterval: number;
  tintStrength: number;
}

export interface SlowMoState {
  active: boolean;
  currentScale: number;
  targetScale: number;
  holdTimer: number;
  recoveryRate: number;
  nearDefeatTriggered: boolean;
}

export interface BossState {
  phase: BossPhase;
  attackCooldown: number;
  heavyCooldown: number;
  dashCooldown: number;
  blockCooldown: number;
  dodgeCooldown: number;
  phaseTransitionTimer: number;
  finisherEligible: boolean;
  finisherWindowTimer: number;
  lastAttack: AttackName | null;
}

export interface FinisherState {
  available: boolean;
  promptVisible: boolean;
  executing: boolean;
  timer: number;
  duration: number;
  windowTimer: number;
  impactTriggered: boolean;
  timingProgress: number;
  timingSuccess: boolean;
}

export interface ImpactEvent {
  kind: ImpactKind;
  position: Vec3;
  size: number;
  duration: number;
  color: number;
  shock: number;
}

export interface ProjectileState {
  id: string;
  ownerTeam: TeamTag;
  position: Vec3;
  velocity: Vec3;
  radius: number;
  damage: number;
  hitPause: number;
  hitStun: number;
  knockback: number;
  verticalKnockback: number;
  shake: number;
  impactKind: ImpactKind;
  blockBreak: boolean;
  launches: boolean;
  rageEnhanced: boolean;
  remainingLife: number;
  projectileKind: 'bullet' | 'grenade' | 'bomb';
  gravity: number;
  explosiveRadius: number;
  explodeOnGround: boolean;
  lingerTimer: number;
  sourceWeapon: WeaponMode;
}

export interface PatternMemoryState {
  recentStarters: string[];
  repeatedStarter: string | null;
  repeatedCount: number;
  countersTriggered: number;
}

export interface AnimationState {
  pose: string;
  basePose: string;
  overlayPose: string | null;
  timer: number;
  blend: number;
  transitionProgress: number;
  impactStrength: number;
  celebrating: boolean;
  celebrationTime: number;
}

export interface ActorState {
  id: string;
  team: TeamTag;
  opponentArchetype: OpponentArchetype;
  position: Vec3;
  velocity: Vec3;
  facing: number;
  grounded: boolean;
  health: number;
  maxHealth: number;
  radius: number;
  height: number;
  motor: CharacterMotorConfig;
  combat: CombatState;
  defense: DefenseState;
  air: AirState;
  weaponMode: WeaponMode;
  weaponSwitch: WeaponSwitchState;
  gun: GunState;
  utility: UtilityState;
  power: PowerState;
  rage: RageState;
  boss: BossState | null;
  hitReactTimer: number;
  aiProfileId: string;
  aiLoadout: WeaponMode[];
  patternMemory: PatternMemoryState;
  presentationMode: PresentationMode;
  silhouette: boolean;
  animation: AnimationState;
}

export interface AIIntent {
  moveX: number;
  block: boolean;
  dashDirection: -1 | 0 | 1;
  jump: boolean;
  weaponModeRequest: WeaponMode | null;
  tokens: ComboInputToken[];
  countering: boolean;
  utilityRequest?: 'grenade' | 'bomb' | null;
  strategy?: 'melee' | 'mixed' | 'desperation' | 'pressure';
  debugLabel?: string;
  attackName?: AttackName | null;
}

export interface TutorialState {
  completed: boolean;
  replayRequested: boolean;
  active: boolean;
  step: 0 | 1 | 2 | 3;
}

export interface SettingsState {
  masterVolume: number;
  combatVolume: number;
  uiVolume: number;
  crowdVolume: number;
  screenShake: 0 | 50 | 100;
  difficultyAssist: DifficultyAssist;
}

export interface SetState {
  roundState: RoundState;
  roundTimer: number;
  roundNumber: number;
  targetWins: number;
  playerRoundsWon: number;
  opponentRoundsWon: number;
  stageVariantId: StageVariantId;
  opponentVariantId: OpponentVariantId;
  survivalEncounterIndex: number;
  survivalMultiplier: number;
}
