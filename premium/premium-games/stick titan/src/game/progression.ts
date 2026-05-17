import type {
  OpponentArchetype,
  OpponentVariantId,
  PresentationMode,
  SettingsState,
  StageVariantId,
  TutorialState,
  WeaponMode,
} from './types';

export const PROFILE_STORAGE_KEY = 'stick-titan-profile-v1';

export type ProgressionTab = 'play' | 'upgrades' | 'mastery' | 'skins' | 'achievements' | 'missions';
export type MatchOutcome = 'win' | 'lose';
export type MenuScreen = 'main' | 'modes' | 'shop' | 'profile' | 'settings' | 'reward';
export type ShopSection = 'skins' | 'upgrades' | 'premium';
export type GameModeId = 'quick_fight' | 'boss_battle' | 'survival';
export type MenuDrawer = 'none' | 'daily' | 'missions' | 'account';
export type ThemeMode = 'dark' | 'light';
export type ChallengeTierId = 'standard' | 'ruthless' | 'titan' | 'cataclysm' | 'legend';
export type RankTierId =
  | 'beginner'
  | 'fighter'
  | 'brawler'
  | 'slayer'
  | 'veteran'
  | 'elite'
  | 'master'
  | 'grandmaster'
  | 'legend';
export type UpgradeCategoryId = 'combat' | 'survival' | 'special';
export type UpgradeNodeId =
  | 'ferocity'
  | 'tempo'
  | 'breaker'
  | 'vitality'
  | 'guard'
  | 'hazard_ward'
  | 'rage_flow'
  | 'shock_core'
  | 'finisher_sense';
export type AchievementId =
  | 'perfect_form'
  | 'speed_hunter'
  | 'combo_discipline'
  | 'arsenal_sweep'
  | 'shock_surgeon'
  | 'demolitionist'
  | 'hazard_dancer'
  | 'ruthless_victor'
  | 'legend_slayer';
export type MissionId =
  | 'daily_win'
  | 'daily_gun_damage'
  | 'daily_sword_damage'
  | 'daily_power_damage'
  | 'daily_combo'
  | 'daily_rage'
  | 'daily_finisher'
  | 'daily_destroy'
  | 'daily_hazardless'
  | 'daily_tier_clear'
  | 'weekly_wins'
  | 'weekly_tier_wins'
  | 'weekly_gun_damage'
  | 'weekly_power_damage'
  | 'weekly_combos'
  | 'weekly_rage'
  | 'weekly_finishers'
  | 'weekly_destruction'
  | 'weekly_hazardless';
export type MissionGroup = 'daily' | 'weekly';
export type MissionMetric =
  | 'wins'
  | 'challenge_wins'
  | 'sword_damage'
  | 'gun_damage'
  | 'power_damage'
  | 'full_combos'
  | 'finishers'
  | 'rage_uses'
  | 'objects_destroyed'
  | 'barrels_detonated'
  | 'hazardless_wins'
  | 'guard_breaks'
  | 'successful_blocks'
  | 'dashes_used'
  | 'juggle_hits'
  | 'launches'
  | 'fighter_wins'
  | 'boss_wins';
export type SkinId =
  | 'classic_azure'
  | 'bronze_volt'
  | 'verdant_wire'
  | 'ember_pulse'
  | 'midnight_drift'
  | 'fighter_cobalt'
  | 'veteran_gold'
  | 'master_crimson'
  | 'legend_aurora'
  | 'ivory_ghost'
  | 'blaze_wire'
  | 'static_step'
  | 'titanfall'
  | 'eclipse'
  | 'solar_static'
  | 'neon_revenant'
  | 'prism_edge'
  | 'void_pulse'
  | 'sword_virtuoso'
  | 'gun_lattice'
  | 'power_core';
export type TitleId =
  | 'rookie'
  | 'untouched'
  | 'rhythm_breaker'
  | 'storm_ender'
  | 'legend_title'
  | 'blade_savant'
  | 'deadeye_arc'
  | 'overdrive_anchor'
  | 'weekbreaker';
export type PremiumOfferId = 'titan_cache' | 'arena_pass' | 'legend_core';

export interface ChallengeTierDefinition {
  id: ChallengeTierId;
  name: string;
  rewardMultiplier: number;
  unlockLevel: number;
  description: string;
  bossHealthMultiplier: number;
  bossDamageMultiplier: number;
  bossSpeedMultiplier: number;
  hazardDamageMultiplier: number;
  eventCadenceMultiplier: number;
}

export interface RankTierDefinition {
  id: RankTierId;
  name: string;
  minLevel: number;
  maxLevel: number | null;
}

export interface UpgradeNodeDefinition {
  id: UpgradeNodeId;
  category: UpgradeCategoryId;
  name: string;
  description: string;
  maxRank: number;
  costBase: number;
  costStep: number;
}

export interface AchievementDefinition {
  id: AchievementId;
  name: string;
  description: string;
  rewardCoins: number;
  rewardSkinId?: SkinId;
  rewardTitleId?: TitleId;
}

export interface SkinDefinition {
  id: SkinId;
  name: string;
  primaryColor: number;
  auraColor: number;
  accentColor: number;
  unlockLabel: string;
  coinCost?: number;
  gemCost?: number;
  featured?: boolean;
}

export interface TitleDefinition {
  id: TitleId;
  name: string;
  unlockLabel: string;
}

export interface GameModeDefinition {
  id: GameModeId;
  name: string;
  description: string;
  unlockLevel: number;
  implemented: boolean;
  accentColor: number;
}

export interface PremiumOfferDefinition {
  id: PremiumOfferId;
  name: string;
  description: string;
  gemCost: number;
  badge: string;
}

export interface StageVariantDefinition {
  id: StageVariantId;
  name: string;
  description: string;
  accentColor: number;
}

export interface OpponentVariantDefinition {
  id: OpponentVariantId;
  name: string;
  archetype: OpponentArchetype;
  unlockLevel: number;
  description: string;
}

export interface MissionDefinition {
  id: MissionId;
  group: MissionGroup;
  name: string;
  description: string;
  metric: MissionMetric;
  target: number;
  rewardCoins: number;
  rewardXp: number;
}

export interface ActiveMission {
  id: MissionId;
  progress: number;
  completed: boolean;
}

export interface DailyStreakState {
  lastClaimDate: string | null;
  streakCount: number;
  cycleDay: number;
}

export interface LifetimeStats {
  wins: number;
  losses: number;
  totalPlaySeconds: number;
  totalDamageDealt: number;
  totalDamageTaken: number;
  totalFinishers: number;
  totalRageUses: number;
  totalBarrelsDetonated: number;
  totalConfirmedHits: number;
  totalSpecials: number;
  totalCancels: number;
  totalAiCountersSeen: number;
}

export interface WeaponMasteryState {
  level: number;
  xp: number;
  totalXp: number;
}

export interface MatchAnalyticsRecord {
  timestamp: string;
  modeId: GameModeId;
  opponentArchetype: OpponentArchetype;
  opponentVariantId: OpponentVariantId;
  challengeTier: ChallengeTierId;
  presentationMode: PresentationMode;
  stageVariantId: StageVariantId;
  outcome: MatchOutcome;
  durationSeconds: number;
  roundWins: number;
  roundLosses: number;
  hitConfirmRate: number;
  cancelCount: number;
  droppedInputs: number;
  reloadEfficiency: number;
  aiCountersTriggered: number;
  preciseCombos: number;
  comboStarters: Record<string, number>;
  weaponUsage: Record<WeaponMode, number>;
}

export interface AnalyticsState {
  totalMatches: number;
  totalConfirmedHits: number;
  totalAttackAttempts: number;
  totalDrops: number;
  totalCancels: number;
  totalAiCountersTriggered: number;
  recentMatches: MatchAnalyticsRecord[];
}

export interface MatchStats {
  modeId: GameModeId;
  opponentArchetype: OpponentArchetype;
  opponentVariantId: OpponentVariantId;
  challengeTier: ChallengeTierId;
  presentationMode: PresentationMode;
  stageVariantId: StageVariantId;
  outcome: MatchOutcome | null;
  durationSeconds: number;
  roundWins: number;
  roundLosses: number;
  damageTaken: number;
  hazardDamageTaken: number;
  damageByWeapon: Record<WeaponMode, number>;
  weaponsUsed: Record<WeaponMode, boolean>;
  fullComboChains: number;
  finisherUsed: boolean;
  barrelsDetonated: number;
  objectsDestroyed: number;
  rageActivations: number;
  shockwaveBossPhase3Kill: boolean;
  guardBreaks: number;
  successfulBlocks: number;
  dashesUsed: number;
  juggleHits: number;
  launches: number;
  confirmedHits: number;
  attackAttempts: number;
  cancelCount: number;
  droppedInputs: number;
  reloadsStarted: number;
  shotsFired: number;
  aiCounterTriggers: number;
  preciseCombos: number;
  grenadeHits: number;
  bombHits: number;
  rageWins: number;
  tutorialCompleted: boolean;
  comboStarters: Record<string, number>;
}

export interface RewardLine {
  label: string;
  amount: number;
}

export interface RewardBreakdown {
  baseCoins: number;
  bonusCoins: RewardLine[];
  challengeMultiplier: number;
  streakMultiplier: number;
  totalCoins: number;
  baseXp: number;
  totalXp: number;
}

export interface MissionRewardSummary {
  mission: MissionDefinition;
  rewardCoins: number;
  rewardXp: number;
}

export interface MasteryProgressSummary {
  weapon: WeaponMode;
  xpGained: number;
  levelBefore: number;
  levelAfter: number;
  xpAfter: number;
  xpToNext: number;
}

export interface PostMatchSummary {
  outcome: MatchOutcome;
  challengeTier: ChallengeTierDefinition;
  rewards: RewardBreakdown;
  missionsCompleted: MissionRewardSummary[];
  achievementsUnlocked: AchievementDefinition[];
  skinsUnlocked: SkinDefinition[];
  titlesUnlocked: TitleDefinition[];
  challengeTiersUnlocked: ChallengeTierDefinition[];
  levelBefore: number;
  levelAfter: number;
  xpBefore: number;
  xpAfter: number;
  xpToNext: number;
  rankBefore: RankTierDefinition;
  rankAfter: RankTierDefinition;
  masteryProgress: MasteryProgressSummary[];
  analytics: MatchAnalyticsRecord;
}

export interface ProgressionState {
  profile: PlayerProfile;
  menuScreen: MenuScreen;
  shopSection: ShopSection;
  lastDailyReward: number;
  postMatchSummary: PostMatchSummary | null;
}

export interface PlayerProfile {
  version: number;
  profileVersion: number;
  lastUpdated: number;
  coins: number;
  gems: number;
  level: number;
  xp: number;
  upgradePoints: number;
  themeMode: ThemeMode;
  presentationMode: PresentationMode;
  menuScreen: MenuScreen;
  shopSection: ShopSection;
  lastSelectedMode: GameModeId;
  unlockedModes: GameModeId[];
  selectedStageId: StageVariantId;
  selectedChallengeTier: ChallengeTierId;
  selectedSkinId: SkinId;
  selectedTitleId: TitleId;
  unlockedOpponentVariants: OpponentVariantId[];
  unlockedSkins: SkinId[];
  unlockedTitles: TitleId[];
  unlockedAchievements: AchievementId[];
  unlockedChallengeTiers: ChallengeTierId[];
  upgrades: Record<UpgradeNodeId, number>;
  upgradeCoinsInvested: number;
  dailyStreak: DailyStreakState;
  dailyMissionDate: string;
  weeklyMissionWeek: string;
  dailyMissions: ActiveMission[];
  weeklyMissions: ActiveMission[];
  weeklyMilestonesClaimed: number[];
  weaponMastery: Record<WeaponMode, WeaponMasteryState>;
  lifetimeStats: LifetimeStats;
  analytics: AnalyticsState;
  settings: SettingsState;
  tutorialState: TutorialState;
  showDetailedHowToPlay: boolean;
  debugAnalyticsVisible: boolean;
}

export interface SaveTransferPayload {
  app: 'stick-titan';
  exportVersion: number;
  exportedAt: string;
  profile: PlayerProfile;
}

export interface ProgressionLoadResult {
  profile: PlayerProfile;
  dailyRewardCoins: number;
}

export interface AppliedCombatModifiers {
  maxHealthBonus: number;
  outgoingDamageMultiplier: number;
  attackSpeedMultiplier: number;
  hitStunMultiplier: number;
  knockbackMultiplier: number;
  incomingDamageMultiplier: number;
  hazardDamageMultiplier: number;
  rageGainMultiplier: number;
  shockwaveMultiplier: number;
  finisherWindowBonus: number;
  swordFinisherRangeBonus: number;
  swordCoinBonus: number;
  gunRecoilMultiplier: number;
  gunReloadMultiplier: number;
  gunAimMoveMultiplier: number;
  gunStaggerMultiplier: number;
  powerOverdriveBonusSeconds: number;
  powerBlockingBonusDamage: number;
}

const DAILY_LOGIN_REWARDS = [50, 75, 100, 125, 150, 200, 300];
const SAVE_TRANSFER_VERSION = 1;
const CURRENT_PROFILE_VERSION = 5;
let inMemoryProfileJson: string | null = null;
type CloudSyncHandler = (profile: PlayerProfile) => void | Promise<void>;
let cloudSyncHandler: CloudSyncHandler | null = null;
type ProfilePersistenceScope = 'session' | 'local';
let activePersistenceScope: ProfilePersistenceScope = 'session';

export const CHALLENGE_TIERS: ChallengeTierDefinition[] = [
  {
    id: 'standard',
    name: 'Standard',
    rewardMultiplier: 1,
    unlockLevel: 1,
    description: 'Baseline boss duel with the full progression loop active.',
    bossHealthMultiplier: 1,
    bossDamageMultiplier: 1,
    bossSpeedMultiplier: 1,
    hazardDamageMultiplier: 1,
    eventCadenceMultiplier: 1,
  },
  {
    id: 'ruthless',
    name: 'Ruthless',
    rewardMultiplier: 1.15,
    unlockLevel: 5,
    description: 'The boss hits harder and hazards arrive a little faster.',
    bossHealthMultiplier: 1.1,
    bossDamageMultiplier: 1.08,
    bossSpeedMultiplier: 1.03,
    hazardDamageMultiplier: 1.05,
    eventCadenceMultiplier: 1.06,
  },
  {
    id: 'titan',
    name: 'Titan',
    rewardMultiplier: 1.3,
    unlockLevel: 15,
    description: 'Boss pressure escalates and arena danger ramps up.',
    bossHealthMultiplier: 1.22,
    bossDamageMultiplier: 1.16,
    bossSpeedMultiplier: 1.07,
    hazardDamageMultiplier: 1.12,
    eventCadenceMultiplier: 1.12,
  },
  {
    id: 'cataclysm',
    name: 'Cataclysm',
    rewardMultiplier: 1.5,
    unlockLevel: 25,
    description: 'High-damage, high-chaos boss pressure with less recovery.',
    bossHealthMultiplier: 1.38,
    bossDamageMultiplier: 1.28,
    bossSpeedMultiplier: 1.12,
    hazardDamageMultiplier: 1.22,
    eventCadenceMultiplier: 1.18,
  },
  {
    id: 'legend',
    name: 'Legend',
    rewardMultiplier: 1.75,
    unlockLevel: 40,
    description: 'Full-speed, high-risk endgame challenge tier.',
    bossHealthMultiplier: 1.55,
    bossDamageMultiplier: 1.4,
    bossSpeedMultiplier: 1.18,
    hazardDamageMultiplier: 1.32,
    eventCadenceMultiplier: 1.26,
  },
];

export const RANKS: RankTierDefinition[] = [
  { id: 'beginner', name: 'Beginner', minLevel: 1, maxLevel: 4 },
  { id: 'fighter', name: 'Fighter', minLevel: 5, maxLevel: 9 },
  { id: 'brawler', name: 'Brawler', minLevel: 10, maxLevel: 14 },
  { id: 'slayer', name: 'Slayer', minLevel: 15, maxLevel: 19 },
  { id: 'veteran', name: 'Veteran', minLevel: 20, maxLevel: 24 },
  { id: 'elite', name: 'Elite', minLevel: 25, maxLevel: 29 },
  { id: 'master', name: 'Master', minLevel: 30, maxLevel: 39 },
  { id: 'grandmaster', name: 'Grandmaster', minLevel: 40, maxLevel: 49 },
  { id: 'legend', name: 'Legend', minLevel: 50, maxLevel: null },
];

export const UPGRADE_NODES: UpgradeNodeDefinition[] = [
  { id: 'ferocity', category: 'combat', name: 'Ferocity', description: '+4% direct damage per rank.', maxRank: 5, costBase: 120, costStep: 35 },
  { id: 'tempo', category: 'combat', name: 'Tempo', description: '+2% attack speed per rank.', maxRank: 5, costBase: 110, costStep: 30 },
  { id: 'breaker', category: 'combat', name: 'Breaker', description: '+5% hit stun and knockback per rank.', maxRank: 5, costBase: 125, costStep: 35 },
  { id: 'vitality', category: 'survival', name: 'Vitality', description: '+6 max health per rank.', maxRank: 5, costBase: 100, costStep: 30 },
  { id: 'guard', category: 'survival', name: 'Guard', description: '-3% incoming damage per rank.', maxRank: 5, costBase: 115, costStep: 32 },
  { id: 'hazard_ward', category: 'survival', name: 'Guard Matrix', description: '-6% block chip and guard pressure per rank.', maxRank: 5, costBase: 95, costStep: 28 },
  { id: 'rage_flow', category: 'special', name: 'Rage Flow', description: '+6% Rage gain per rank.', maxRank: 5, costBase: 120, costStep: 35 },
  { id: 'shock_core', category: 'special', name: 'Shock Core', description: '+6% shockwave radius and damage per rank.', maxRank: 5, costBase: 130, costStep: 40 },
  { id: 'finisher_sense', category: 'special', name: 'Finisher Sense', description: '+0.15s finisher window per rank.', maxRank: 5, costBase: 105, costStep: 30 },
];

export const GAME_MODES: GameModeDefinition[] = [
  {
    id: 'quick_fight',
    name: 'Quick Fight',
    description: 'Fight a best-of-three duel against a rotating fighter archetype.',
    unlockLevel: 1,
    implemented: true,
    accentColor: 0x57d7ff,
  },
  {
    id: 'boss_battle',
    name: 'Boss Battle',
    description: 'Enter a best-of-three boss set against a phase-based arena boss variant.',
    unlockLevel: 1,
    implemented: true,
    accentColor: 0xff9358,
  },
  {
    id: 'survival',
    name: 'Survival Mode',
    description: 'Clear a five-fight ladder with limited recovery between encounters.',
    unlockLevel: 10,
    implemented: true,
    accentColor: 0xff5f76,
  },
];

export const STAGE_VARIANTS: StageVariantDefinition[] = [
  {
    id: 'neon_hangar',
    name: 'Neon Hangar',
    description: 'Industrial lane lighting with sharp cyan and ember contrast.',
    accentColor: 0x57d7ff,
  },
  {
    id: 'sunset_rooftop',
    name: 'Sunset Rooftop',
    description: 'Warm skyline staging with reflective rails and dusk haze.',
    accentColor: 0xffa65e,
  },
  {
    id: 'temple_court',
    name: 'Temple Court',
    description: 'Stone arena framing with gold highlights and deep shadows.',
    accentColor: 0xe6c26a,
  },
];

export const OPPONENT_VARIANTS: OpponentVariantDefinition[] = [
  {
    id: 'vanguard',
    name: 'Vanguard',
    archetype: 'fighter',
    unlockLevel: 1,
    description: 'Sword and power rushdown with fast guard pressure.',
  },
  {
    id: 'striker',
    name: 'Striker',
    archetype: 'fighter',
    unlockLevel: 1,
    description: 'Balanced sword duelist with clean confirms and spacing.',
  },
  {
    id: 'ranger',
    name: 'Ranger',
    archetype: 'fighter',
    unlockLevel: 10,
    description: 'Sword and gun spacing specialist with late gun punishes.',
  },
  {
    id: 'titan_warden',
    name: 'Titan Warden',
    archetype: 'boss',
    unlockLevel: 1,
    description: 'Power and sword boss built around brutal guard breaks.',
  },
  {
    id: 'iron_marshal',
    name: 'Iron Marshal',
    archetype: 'boss',
    unlockLevel: 20,
    description: 'Weapon-rotating boss with disciplined gun pressure.',
  },
];

export const PREMIUM_OFFERS: PremiumOfferDefinition[] = [
  {
    id: 'titan_cache',
    name: 'Titan Cache',
    description: 'Future premium bundle placeholder with a weapon-theme preview and gem pricing.',
    gemCost: 180,
    badge: 'Coming Soon',
  },
  {
    id: 'arena_pass',
    name: 'Arena Pass',
    description: 'Reserved for future seasonal premium cosmetics and menu flair.',
    gemCost: 260,
    badge: 'Coming Soon',
  },
  {
    id: 'legend_core',
    name: 'Legend Core',
    description: 'High-tier premium showcase card for future prestige offerings.',
    gemCost: 420,
    badge: 'Coming Soon',
  },
];

export const SKINS: SkinDefinition[] = [
  { id: 'classic_azure', name: 'Classic Azure', primaryColor: 0x4bc8ff, auraColor: 0x9ed9ff, accentColor: 0xffffff, unlockLabel: 'Starter skin' },
  { id: 'bronze_volt', name: 'Bronze Volt', primaryColor: 0xc98a4a, auraColor: 0xf4bb77, accentColor: 0xffe5bd, unlockLabel: 'Buy with coins', coinCost: 220 },
  { id: 'verdant_wire', name: 'Verdant Wire', primaryColor: 0x4cb96e, auraColor: 0x81e6a0, accentColor: 0xd6ffdf, unlockLabel: 'Buy with coins', coinCost: 260 },
  { id: 'ember_pulse', name: 'Ember Pulse', primaryColor: 0xff6f4a, auraColor: 0xffa86c, accentColor: 0xffe0c8, unlockLabel: 'Buy with coins', coinCost: 320 },
  { id: 'midnight_drift', name: 'Midnight Drift', primaryColor: 0x435a8d, auraColor: 0x7ba5ff, accentColor: 0xd2e3ff, unlockLabel: 'Buy with coins', coinCost: 420 },
  { id: 'neon_revenant', name: 'Neon Revenant', primaryColor: 0x5d64ff, auraColor: 0xc6c9ff, accentColor: 0xf7f7ff, unlockLabel: 'Buy with gems', gemCost: 90, featured: true },
  { id: 'prism_edge', name: 'Prism Edge', primaryColor: 0xff5bc6, auraColor: 0xffc3eb, accentColor: 0xfff0fb, unlockLabel: 'Buy with gems', gemCost: 130, featured: true },
  { id: 'void_pulse', name: 'Void Pulse', primaryColor: 0x27243b, auraColor: 0xb37aff, accentColor: 0xefe2ff, unlockLabel: 'Buy with gems', gemCost: 180, featured: true },
  { id: 'fighter_cobalt', name: 'Fighter Cobalt', primaryColor: 0x4fa0ff, auraColor: 0x9bd4ff, accentColor: 0xe5f3ff, unlockLabel: 'Reach Fighter rank' },
  { id: 'veteran_gold', name: 'Veteran Gold', primaryColor: 0xf4c248, auraColor: 0xffe48f, accentColor: 0xfff5ce, unlockLabel: 'Reach Veteran rank' },
  { id: 'master_crimson', name: 'Master Crimson', primaryColor: 0xd44a58, auraColor: 0xff9e9e, accentColor: 0xffe1e1, unlockLabel: 'Reach Master rank' },
  { id: 'legend_aurora', name: 'Legend Aurora', primaryColor: 0x6f65ff, auraColor: 0xbcc1ff, accentColor: 0xf0f1ff, unlockLabel: 'Reach Legend rank' },
  { id: 'ivory_ghost', name: 'Ivory Ghost', primaryColor: 0xe9f0f7, auraColor: 0xffffff, accentColor: 0xdde9f5, unlockLabel: 'Perfect Form achievement' },
  { id: 'blaze_wire', name: 'Blaze Wire', primaryColor: 0xff7c36, auraColor: 0xffba6f, accentColor: 0xffedd0, unlockLabel: 'Speed Hunter achievement' },
  { id: 'static_step', name: 'Static Step', primaryColor: 0x74d9ff, auraColor: 0xb7f2ff, accentColor: 0xe7fbff, unlockLabel: 'Hazard Dancer achievement' },
  { id: 'titanfall', name: 'Titanfall', primaryColor: 0xff5b5b, auraColor: 0xffa98a, accentColor: 0xffe0dd, unlockLabel: 'Clear Cataclysm' },
  { id: 'eclipse', name: 'Eclipse', primaryColor: 0x26222c, auraColor: 0x9b76ff, accentColor: 0xe0d2ff, unlockLabel: 'Clear Legend' },
  { id: 'solar_static', name: 'Solar Static', primaryColor: 0xffd268, auraColor: 0xfff1b2, accentColor: 0xfff7db, unlockLabel: 'Complete 3 weekly missions' },
  { id: 'sword_virtuoso', name: 'Sword Virtuoso', primaryColor: 0x89ddff, auraColor: 0xdffbff, accentColor: 0xffffff, unlockLabel: 'Reach sword mastery 10' },
  { id: 'gun_lattice', name: 'Gun Lattice', primaryColor: 0xffae72, auraColor: 0xffddb9, accentColor: 0xfff0de, unlockLabel: 'Reach gun mastery 10' },
  { id: 'power_core', name: 'Power Core', primaryColor: 0xffd04e, auraColor: 0xfff3af, accentColor: 0xfff9da, unlockLabel: 'Reach power mastery 10' },
];

export const TITLES: TitleDefinition[] = [
  { id: 'rookie', name: 'Rookie', unlockLabel: 'Starter title' },
  { id: 'untouched', name: 'Untouched', unlockLabel: 'Perfect Form achievement' },
  { id: 'rhythm_breaker', name: 'Rhythm Breaker', unlockLabel: 'Combo Discipline achievement' },
  { id: 'storm_ender', name: 'Storm Ender', unlockLabel: 'Shock Surgeon achievement' },
  { id: 'legend_title', name: 'Legend', unlockLabel: 'Legend Slayer achievement' },
  { id: 'blade_savant', name: 'Blade Savant', unlockLabel: 'Sword mastery 10' },
  { id: 'deadeye_arc', name: 'Deadeye Arc', unlockLabel: 'Gun mastery 10' },
  { id: 'overdrive_anchor', name: 'Overdrive Anchor', unlockLabel: 'Power mastery 10' },
  { id: 'weekbreaker', name: 'Weekbreaker', unlockLabel: 'Complete 2 weekly missions' },
];

export const ACHIEVEMENTS: AchievementDefinition[] = [
  { id: 'perfect_form', name: 'Perfect Form', description: 'Win without taking damage.', rewardCoins: 300, rewardSkinId: 'ivory_ghost', rewardTitleId: 'untouched' },
  { id: 'speed_hunter', name: 'Speed Hunter', description: 'Win under 180 seconds.', rewardCoins: 250, rewardSkinId: 'blaze_wire' },
  { id: 'combo_discipline', name: 'Combo Discipline', description: 'Complete 3 full combo chains in one match.', rewardCoins: 200, rewardTitleId: 'rhythm_breaker' },
  { id: 'arsenal_sweep', name: 'Arsenal Sweep', description: 'Deal damage with sword, gun, and power in one win.', rewardCoins: 200 },
  { id: 'shock_surgeon', name: 'Shock Surgeon', description: 'Land the decisive phase-3 Rage shockwave.', rewardCoins: 300, rewardTitleId: 'storm_ender' },
  { id: 'demolitionist', name: 'Demolitionist', description: 'Break guard 3 times in one match.', rewardCoins: 150 },
  { id: 'hazard_dancer', name: 'Hazard Dancer', description: 'Win a tier 2+ match with 3 clean dashes.', rewardCoins: 250, rewardSkinId: 'static_step' },
  { id: 'ruthless_victor', name: 'Ruthless Victor', description: 'Clear Cataclysm.', rewardCoins: 400, rewardSkinId: 'titanfall' },
  { id: 'legend_slayer', name: 'Legend Slayer', description: 'Clear Legend.', rewardCoins: 800, rewardSkinId: 'eclipse', rewardTitleId: 'legend_title' },
];

const DAILY_MISSION_POOL: MissionDefinition[] = [
  { id: 'daily_win', group: 'daily', name: 'Daily Duel', description: 'Win 1 match.', metric: 'wins', target: 1, rewardCoins: 70, rewardXp: 45 },
  { id: 'daily_gun_damage', group: 'daily', name: 'Gun Pressure', description: 'Deal 140 gun damage.', metric: 'gun_damage', target: 140, rewardCoins: 60, rewardXp: 40 },
  { id: 'daily_sword_damage', group: 'daily', name: 'Sword Work', description: 'Deal 180 sword damage.', metric: 'sword_damage', target: 180, rewardCoins: 55, rewardXp: 35 },
  { id: 'daily_power_damage', group: 'daily', name: 'Power Surge', description: 'Deal 150 power damage.', metric: 'power_damage', target: 150, rewardCoins: 55, rewardXp: 35 },
  { id: 'daily_combo', group: 'daily', name: 'Combo Rhythm', description: 'Complete 2 full combo chains.', metric: 'full_combos', target: 2, rewardCoins: 50, rewardXp: 35 },
  { id: 'daily_rage', group: 'daily', name: 'Ignition', description: 'Activate Rage once.', metric: 'rage_uses', target: 1, rewardCoins: 45, rewardXp: 30 },
  { id: 'daily_finisher', group: 'daily', name: 'Close It Out', description: 'Use 1 finisher.', metric: 'finishers', target: 1, rewardCoins: 80, rewardXp: 60 },
  { id: 'daily_destroy', group: 'daily', name: 'Guard Breaker', description: 'Break guard 2 times.', metric: 'guard_breaks', target: 2, rewardCoins: 50, rewardXp: 35 },
  { id: 'daily_hazardless', group: 'daily', name: 'Clean Footwork', description: 'Dash 3 times in one session.', metric: 'dashes_used', target: 3, rewardCoins: 80, rewardXp: 55 },
  { id: 'daily_tier_clear', group: 'daily', name: 'Step Up', description: 'Win 1 tier 2+ match.', metric: 'challenge_wins', target: 1, rewardCoins: 75, rewardXp: 55 },
];

const WEEKLY_MISSION_POOL: MissionDefinition[] = [
  { id: 'weekly_wins', group: 'weekly', name: 'Fight Runner', description: 'Win 5 matches.', metric: 'wins', target: 5, rewardCoins: 220, rewardXp: 150 },
  { id: 'weekly_tier_wins', group: 'weekly', name: 'Difficulty Climber', description: 'Win 3 tier 2+ matches.', metric: 'challenge_wins', target: 3, rewardCoins: 250, rewardXp: 180 },
  { id: 'weekly_gun_damage', group: 'weekly', name: 'Suppressive Fire', description: 'Deal 650 gun damage.', metric: 'gun_damage', target: 650, rewardCoins: 170, rewardXp: 130 },
  { id: 'weekly_power_damage', group: 'weekly', name: 'Shock Battery', description: 'Deal 520 power damage.', metric: 'power_damage', target: 520, rewardCoins: 170, rewardXp: 130 },
  { id: 'weekly_combos', group: 'weekly', name: 'Chain Artist', description: 'Complete 8 full combo chains.', metric: 'full_combos', target: 8, rewardCoins: 190, rewardXp: 140 },
  { id: 'weekly_rage', group: 'weekly', name: 'Rage Engine', description: 'Activate Rage 6 times.', metric: 'rage_uses', target: 6, rewardCoins: 160, rewardXp: 120 },
  { id: 'weekly_finishers', group: 'weekly', name: 'Execution Loop', description: 'Use 3 finishers.', metric: 'finishers', target: 3, rewardCoins: 200, rewardXp: 145 },
  { id: 'weekly_destruction', group: 'weekly', name: 'Arena Breaker', description: 'Break guard 10 times.', metric: 'guard_breaks', target: 10, rewardCoins: 160, rewardXp: 120 },
  { id: 'weekly_hazardless', group: 'weekly', name: 'Untouchable Route', description: 'Land 12 juggle hits.', metric: 'juggle_hits', target: 12, rewardCoins: 180, rewardXp: 135 },
];

const MISSION_LOOKUP = new Map([...DAILY_MISSION_POOL, ...WEEKLY_MISSION_POOL].map((mission) => [mission.id, mission]));
const ACHIEVEMENT_LOOKUP = new Map(ACHIEVEMENTS.map((achievement) => [achievement.id, achievement]));
const SKIN_LOOKUP = new Map(SKINS.map((skin) => [skin.id, skin]));
const TITLE_LOOKUP = new Map(TITLES.map((title) => [title.id, title]));
const UPGRADE_LOOKUP = new Map(UPGRADE_NODES.map((node) => [node.id, node]));
const CHALLENGE_LOOKUP = new Map(CHALLENGE_TIERS.map((tier) => [tier.id, tier]));
const MODE_LOOKUP = new Map(GAME_MODES.map((mode) => [mode.id, mode]));
const STAGE_LOOKUP = new Map(STAGE_VARIANTS.map((stage) => [stage.id, stage]));
const OPPONENT_VARIANT_LOOKUP = new Map(OPPONENT_VARIANTS.map((variant) => [variant.id, variant]));

function emptyUpgrades(): Record<UpgradeNodeId, number> {
  return {
    ferocity: 0,
    tempo: 0,
    breaker: 0,
    vitality: 0,
    guard: 0,
    hazard_ward: 0,
    rage_flow: 0,
    shock_core: 0,
    finisher_sense: 0,
  };
}

function emptyMastery(): Record<WeaponMode, WeaponMasteryState> {
  return {
    sword: { level: 1, xp: 0, totalXp: 0 },
    gun: { level: 1, xp: 0, totalXp: 0 },
    power: { level: 1, xp: 0, totalXp: 0 },
  };
}

function emptyLifetimeStats(): LifetimeStats {
  return {
    wins: 0,
    losses: 0,
    totalPlaySeconds: 0,
    totalDamageDealt: 0,
    totalDamageTaken: 0,
    totalFinishers: 0,
    totalRageUses: 0,
    totalBarrelsDetonated: 0,
    totalConfirmedHits: 0,
    totalSpecials: 0,
    totalCancels: 0,
    totalAiCountersSeen: 0,
  };
}

function emptyAnalytics(): AnalyticsState {
  return {
    totalMatches: 0,
    totalConfirmedHits: 0,
    totalAttackAttempts: 0,
    totalDrops: 0,
    totalCancels: 0,
    totalAiCountersTriggered: 0,
    recentMatches: [],
  };
}

function defaultSettings(): SettingsState {
  return {
    masterVolume: 100,
    combatVolume: 100,
    uiVolume: 100,
    crowdVolume: 70,
    screenShake: 100,
    difficultyAssist: 'standard',
  };
}

function defaultTutorialState(): TutorialState {
  return {
    completed: false,
    replayRequested: false,
    active: false,
    step: 0,
  };
}

export function createEmptyMatchStats(challengeTier: ChallengeTierId): MatchStats {
  return {
    modeId: 'quick_fight',
    opponentArchetype: 'fighter',
    opponentVariantId: 'vanguard',
    challengeTier,
    presentationMode: '2_5d',
    stageVariantId: 'neon_hangar',
    outcome: null,
    durationSeconds: 0,
    roundWins: 0,
    roundLosses: 0,
    damageTaken: 0,
    hazardDamageTaken: 0,
    damageByWeapon: { sword: 0, gun: 0, power: 0 },
    weaponsUsed: { sword: false, gun: false, power: false },
    fullComboChains: 0,
    finisherUsed: false,
    barrelsDetonated: 0,
    objectsDestroyed: 0,
    rageActivations: 0,
    shockwaveBossPhase3Kill: false,
    guardBreaks: 0,
    successfulBlocks: 0,
    dashesUsed: 0,
    juggleHits: 0,
    launches: 0,
    confirmedHits: 0,
    attackAttempts: 0,
    cancelCount: 0,
    droppedInputs: 0,
    reloadsStarted: 0,
    shotsFired: 0,
    aiCounterTriggers: 0,
    preciseCombos: 0,
    grenadeHits: 0,
    bombHits: 0,
    rageWins: 0,
    tutorialCompleted: false,
    comboStarters: {},
  };
}

export function createDefaultProfile(now: Date = new Date()): PlayerProfile {
  const today = getDateKey(now);
  return {
    version: CURRENT_PROFILE_VERSION,
    profileVersion: CURRENT_PROFILE_VERSION,
    lastUpdated: now.getTime(),
    coins: 0,
    gems: 120,
    level: 1,
    xp: 0,
    upgradePoints: 0,
    themeMode: 'dark',
    presentationMode: '2_5d',
    menuScreen: 'main',
    shopSection: 'skins',
    lastSelectedMode: 'quick_fight',
    unlockedModes: ['quick_fight', 'boss_battle'],
    selectedStageId: 'neon_hangar',
    selectedChallengeTier: 'standard',
    selectedSkinId: 'classic_azure',
    selectedTitleId: 'rookie',
    unlockedOpponentVariants: ['vanguard', 'striker', 'titan_warden'],
    unlockedSkins: ['classic_azure'],
    unlockedTitles: ['rookie'],
    unlockedAchievements: [],
    unlockedChallengeTiers: ['standard'],
    upgrades: emptyUpgrades(),
    upgradeCoinsInvested: 0,
    dailyStreak: { lastClaimDate: null, streakCount: 0, cycleDay: 0 },
    dailyMissionDate: today,
    weeklyMissionWeek: getWeekKey(now),
    dailyMissions: [],
    weeklyMissions: [],
    weeklyMilestonesClaimed: [],
    weaponMastery: emptyMastery(),
    lifetimeStats: emptyLifetimeStats(),
    analytics: emptyAnalytics(),
    settings: defaultSettings(),
    tutorialState: defaultTutorialState(),
    showDetailedHowToPlay: true,
    debugAnalyticsVisible: false,
  };
}

export function loadProgressionState(now: Date = new Date()): ProgressionLoadResult {
  let profile = createDefaultProfile(now);

  const raw = readStoredProfileJson();
  if (raw) {
    try {
      profile = sanitizeProfile(JSON.parse(raw) as Partial<PlayerProfile>, now);
    } catch {
      profile = createDefaultProfile(now);
    }
  }

  const dailyRewardCoins = refreshProfile(profile, now);
  saveProfile(profile, { skipCloudSync: true, preserveTimestamp: true });
  return { profile, dailyRewardCoins };
}

export function registerCloudSyncHandler(handler: CloudSyncHandler | null): void {
  cloudSyncHandler = handler;
}

export function setProfilePersistenceScope(scope: ProfilePersistenceScope): void {
  activePersistenceScope = scope;
}

export function saveProfile(
  profile: PlayerProfile,
  options: {
    skipCloudSync?: boolean;
    preserveTimestamp?: boolean;
  } = {},
): void {
  if (!options.preserveTimestamp) {
    profile.lastUpdated = Date.now();
  }
  const payload = JSON.stringify(profile);
  inMemoryProfileJson = payload;
  if (typeof window === 'undefined') {
    if (!options.skipCloudSync && cloudSyncHandler) {
      void Promise.resolve(cloudSyncHandler(JSON.parse(payload) as PlayerProfile));
    }
    return;
  }
  try {
    const primaryStorage =
      activePersistenceScope === 'local'
        ? window.localStorage
        : (window.sessionStorage ?? window.localStorage);
    primaryStorage.setItem(PROFILE_STORAGE_KEY, payload);
    if (activePersistenceScope === 'session') {
      try {
        window.localStorage.removeItem(PROFILE_STORAGE_KEY);
      } catch {
        // Ignore legacy storage cleanup failures.
      }
    } else {
      try {
        window.sessionStorage?.removeItem(PROFILE_STORAGE_KEY);
      } catch {
        // Ignore session cleanup failures.
      }
    }
  } catch {
    // Fallback to in-memory persistence for restricted storage environments.
  }
  if (!options.skipCloudSync && cloudSyncHandler) {
    void Promise.resolve(cloudSyncHandler(JSON.parse(payload) as PlayerProfile));
  }
}

export function exportProfileData(profile: PlayerProfile): string {
  const payload: SaveTransferPayload = {
    app: 'stick-titan',
    exportVersion: SAVE_TRANSFER_VERSION,
    exportedAt: new Date().toISOString(),
    profile: sanitizeProfile(JSON.parse(JSON.stringify(profile)) as Partial<PlayerProfile>, new Date()),
  };
  return JSON.stringify(payload, null, 2);
}

export function importProfileData(
  raw: string,
  now: Date = new Date(),
  options: {
    skipCloudSync?: boolean;
    preserveTimestamp?: boolean;
  } = {},
): PlayerProfile {
  const parsed = JSON.parse(raw) as Partial<SaveTransferPayload> | Partial<PlayerProfile>;
  const candidate =
    typeof (parsed as SaveTransferPayload).app === 'string' && (parsed as SaveTransferPayload).app === 'stick-titan'
      ? (parsed as SaveTransferPayload).profile
      : (parsed as Partial<PlayerProfile>);
  const profile = sanitizeProfile(candidate ?? {}, now);
  refreshProfile(profile, now);
  saveProfile(profile, options);
  return profile;
}

export function resetProfile(now: Date = new Date()): PlayerProfile {
  const profile = createDefaultProfile(now);
  refreshProfile(profile, now);
  saveProfile(profile);
  return profile;
}

export function refreshProfile(profile: PlayerProfile, now: Date = new Date()): number {
  profile.version = CURRENT_PROFILE_VERSION;
  profile.profileVersion = CURRENT_PROFILE_VERSION;
  profile.lastUpdated = clampNumber(profile.lastUpdated, 0, Number.MAX_SAFE_INTEGER, now.getTime());
  profile.level = Math.max(1, Math.floor(profile.level));
  profile.xp = Math.max(0, Math.floor(profile.xp));
  profile.coins = Math.max(0, Math.floor(profile.coins));
  profile.gems = Math.max(0, Math.floor(profile.gems));
  profile.upgradePoints = Math.max(0, Math.floor(profile.upgradePoints));
  profile.themeMode = profile.themeMode === 'light' ? 'light' : 'dark';
  profile.presentationMode = profile.presentationMode === '2d' ? '2d' : '2_5d';
  profile.upgrades = { ...emptyUpgrades(), ...profile.upgrades };
  profile.weaponMastery = { ...emptyMastery(), ...profile.weaponMastery };
  profile.lifetimeStats = { ...emptyLifetimeStats(), ...profile.lifetimeStats };
  profile.analytics = { ...emptyAnalytics(), ...profile.analytics, recentMatches: profile.analytics?.recentMatches ?? [] };
  profile.menuScreen = profile.menuScreen ?? 'main';
  profile.shopSection = profile.shopSection ?? 'skins';
  profile.lastSelectedMode = profile.lastSelectedMode ?? 'quick_fight';
  profile.unlockedModes = uniqueValidIds(profile.unlockedModes, MODE_LOOKUP, ['quick_fight', 'boss_battle']);
  profile.selectedStageId = STAGE_LOOKUP.has(profile.selectedStageId) ? profile.selectedStageId : 'neon_hangar';
  profile.unlockedOpponentVariants = uniqueValidIds(profile.unlockedOpponentVariants, OPPONENT_VARIANT_LOOKUP, ['vanguard', 'striker', 'titan_warden']);
  profile.unlockedSkins = uniqueValidIds(profile.unlockedSkins, SKIN_LOOKUP, ['classic_azure']);
  profile.unlockedTitles = uniqueValidIds(profile.unlockedTitles, TITLE_LOOKUP, ['rookie']);
  profile.unlockedAchievements = uniqueValidIds(profile.unlockedAchievements, ACHIEVEMENT_LOOKUP);
  profile.unlockedChallengeTiers = uniqueValidIds(profile.unlockedChallengeTiers, CHALLENGE_LOOKUP, ['standard']);
  profile.settings = sanitizeSettings(profile.settings);
  profile.tutorialState = sanitizeTutorialState(profile.tutorialState);

  unlockRankRewards(profile);
  unlockModesForLevel(profile);
  unlockChallengeTiersForLevel(profile);
  unlockOpponentVariantsForLevel(profile);
  ensureMissionSet(profile, 'daily', now);
  ensureMissionSet(profile, 'weekly', now);

  if (!profile.unlockedSkins.includes(profile.selectedSkinId)) {
    profile.selectedSkinId = 'classic_azure';
  }
  if (!profile.unlockedTitles.includes(profile.selectedTitleId)) {
    profile.selectedTitleId = 'rookie';
  }
  if (!profile.unlockedChallengeTiers.includes(profile.selectedChallengeTier)) {
    profile.selectedChallengeTier = 'standard';
  }
  if (!profile.unlockedModes.includes(profile.lastSelectedMode)) {
    profile.lastSelectedMode = 'quick_fight';
  }
  profile.showDetailedHowToPlay = profile.showDetailedHowToPlay !== false;
  profile.debugAnalyticsVisible = Boolean(profile.debugAnalyticsVisible);

  return claimDailyLoginReward(profile, now);
}

export function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getWeekKey(date: Date): string {
  const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = normalized.getDay() || 7;
  normalized.setDate(normalized.getDate() + 4 - day);
  const yearStart = new Date(normalized.getFullYear(), 0, 1);
  const week = Math.ceil((((normalized.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${normalized.getFullYear()}-W${`${week}`.padStart(2, '0')}`;
}

export function getChallengeTier(tierId: ChallengeTierId): ChallengeTierDefinition {
  return CHALLENGE_LOOKUP.get(tierId) ?? CHALLENGE_TIERS[0];
}

export function getRankForLevel(level: number): RankTierDefinition {
  return RANKS.find((rank) => level >= rank.minLevel && (rank.maxLevel === null || level <= rank.maxLevel)) ?? RANKS[0];
}

export function getXpRequirement(level: number): number {
  return Math.min(100 + 25 * Math.max(0, level - 1), 500);
}

export function getWeaponMasteryRequirement(level: number): number {
  return Math.min(60 + 25 * Math.max(0, level - 1), 260);
}

export function getUpgradeRankCap(level: number): number {
  if (level >= 30) {
    return 5;
  }
  if (level >= 20) {
    return 4;
  }
  if (level >= 10) {
    return 3;
  }
  if (level >= 5) {
    return 2;
  }
  return 1;
}

export function getUpgradeCost(nodeId: UpgradeNodeId, currentRank: number): number {
  const node = UPGRADE_LOOKUP.get(nodeId);
  if (!node) {
    return 0;
  }
  return node.costBase + node.costStep * currentRank;
}

export function getStreakMultiplier(profile: PlayerProfile): number {
  return 1 + Math.min(profile.dailyStreak.streakCount, 7) * 0.05;
}

export function canPurchaseUpgrade(profile: PlayerProfile, nodeId: UpgradeNodeId): boolean {
  const node = UPGRADE_LOOKUP.get(nodeId);
  if (!node) {
    return false;
  }
  const currentRank = profile.upgrades[nodeId];
  if (currentRank >= node.maxRank || currentRank >= getUpgradeRankCap(profile.level)) {
    return false;
  }
  if (profile.upgradePoints <= 0) {
    return false;
  }
  return profile.coins >= getUpgradeCost(nodeId, currentRank);
}

export function purchaseUpgrade(profile: PlayerProfile, nodeId: UpgradeNodeId): boolean {
  if (!canPurchaseUpgrade(profile, nodeId)) {
    return false;
  }
  const currentRank = profile.upgrades[nodeId];
  const cost = getUpgradeCost(nodeId, currentRank);
  profile.coins -= cost;
  profile.upgradeCoinsInvested += cost;
  profile.upgradePoints -= 1;
  profile.upgrades[nodeId] += 1;
  saveProfile(profile);
  return true;
}

export function resetUpgrades(profile: PlayerProfile): void {
  const spentRanks = Object.values(profile.upgrades).reduce((sum, rank) => sum + rank, 0);
  profile.coins += profile.upgradeCoinsInvested;
  profile.upgradeCoinsInvested = 0;
  profile.upgradePoints += spentRanks;
  profile.upgrades = emptyUpgrades();
  saveProfile(profile);
}

export function purchaseCoinSkin(profile: PlayerProfile, skinId: SkinId): boolean {
  const skin = SKIN_LOOKUP.get(skinId);
  if (!skin || profile.unlockedSkins.includes(skinId)) {
    return false;
  }
  if (skin.coinCost) {
    if (profile.coins < skin.coinCost) {
      return false;
    }
    profile.coins -= skin.coinCost;
  } else if (skin.gemCost) {
    if (profile.gems < skin.gemCost) {
      return false;
    }
    profile.gems -= skin.gemCost;
  } else {
    return false;
  }
  profile.unlockedSkins.push(skinId);
  saveProfile(profile);
  return true;
}

export function selectSkin(profile: PlayerProfile, skinId: SkinId): boolean {
  if (!profile.unlockedSkins.includes(skinId)) {
    return false;
  }
  profile.selectedSkinId = skinId;
  saveProfile(profile);
  return true;
}

export function selectTitle(profile: PlayerProfile, titleId: TitleId): boolean {
  if (!profile.unlockedTitles.includes(titleId)) {
    return false;
  }
  profile.selectedTitleId = titleId;
  saveProfile(profile);
  return true;
}

export function selectChallengeTier(profile: PlayerProfile, tierId: ChallengeTierId): boolean {
  if (!profile.unlockedChallengeTiers.includes(tierId)) {
    return false;
  }
  profile.selectedChallengeTier = tierId;
  saveProfile(profile);
  return true;
}

export function setMenuScreen(profile: PlayerProfile, screen: MenuScreen): void {
  profile.menuScreen = screen;
  saveProfile(profile);
}

export function setThemeMode(profile: PlayerProfile, mode: ThemeMode): void {
  profile.themeMode = mode;
  saveProfile(profile);
}

export function setPresentationMode(profile: PlayerProfile, mode: PresentationMode): void {
  profile.presentationMode = mode;
  saveProfile(profile);
}

export function setSelectedStage(profile: PlayerProfile, stageId: StageVariantId): void {
  if (!STAGE_LOOKUP.has(stageId)) {
    return;
  }
  profile.selectedStageId = stageId;
  saveProfile(profile);
}

export function updateSettings(profile: PlayerProfile, partial: Partial<SettingsState>): void {
  profile.settings = sanitizeSettings({
    ...profile.settings,
    ...partial,
  });
  saveProfile(profile);
}

export function requestTutorialReplay(profile: PlayerProfile): void {
  profile.tutorialState.replayRequested = true;
  profile.tutorialState.completed = false;
  saveProfile(profile);
}

export function markTutorialCompleted(profile: PlayerProfile): void {
  profile.tutorialState.completed = true;
  profile.tutorialState.replayRequested = false;
  profile.tutorialState.active = false;
  profile.tutorialState.step = 3;
  saveProfile(profile);
}

export function setDetailedHowToPlay(profile: PlayerProfile, visible: boolean): void {
  profile.showDetailedHowToPlay = visible;
  saveProfile(profile);
}

export function setDebugAnalyticsVisible(profile: PlayerProfile, visible: boolean): void {
  profile.debugAnalyticsVisible = visible;
  saveProfile(profile);
}

export function setShopSection(profile: PlayerProfile, section: ShopSection): void {
  profile.shopSection = section;
  if (profile.menuScreen !== 'shop') {
    profile.menuScreen = 'shop';
  }
  saveProfile(profile);
}

export function selectGameMode(profile: PlayerProfile, modeId: GameModeId): boolean {
  if (!MODE_LOOKUP.has(modeId)) {
    return false;
  }
  profile.lastSelectedMode = modeId;
  saveProfile(profile);
  return true;
}

export function isModeUnlocked(profile: PlayerProfile, modeId: GameModeId): boolean {
  return profile.unlockedModes.includes(modeId);
}

export function getGameModeDefinition(modeId: GameModeId): GameModeDefinition {
  return MODE_LOOKUP.get(modeId) ?? GAME_MODES[0];
}

export function getStageDefinition(stageId: StageVariantId): StageVariantDefinition {
  return STAGE_LOOKUP.get(stageId) ?? STAGE_VARIANTS[0];
}

export function getOpponentVariantDefinition(variantId: OpponentVariantId): OpponentVariantDefinition {
  return OPPONENT_VARIANT_LOOKUP.get(variantId) ?? OPPONENT_VARIANTS[0];
}

export function getModeAvailability(profile: PlayerProfile, modeId: GameModeId): 'available' | 'locked' | 'coming_soon' {
  const definition = getGameModeDefinition(modeId);
  if (!profile.unlockedModes.includes(modeId)) {
    return 'locked';
  }
  return definition.implemented ? 'available' : 'coming_soon';
}

export function getPremiumOfferDefinition(offerId: PremiumOfferId): PremiumOfferDefinition {
  return PREMIUM_OFFERS.find((offer) => offer.id === offerId) ?? PREMIUM_OFFERS[0];
}

export function computeAppliedModifiers(profile: PlayerProfile): AppliedCombatModifiers {
  const swordMastery = profile.weaponMastery.sword.level;
  const gunMastery = profile.weaponMastery.gun.level;
  const powerMastery = profile.weaponMastery.power.level;

  return {
    maxHealthBonus: profile.upgrades.vitality * 6,
    outgoingDamageMultiplier: 1 + profile.upgrades.ferocity * 0.04,
    attackSpeedMultiplier: 1 + profile.upgrades.tempo * 0.02,
    hitStunMultiplier: 1 + profile.upgrades.breaker * 0.05,
    knockbackMultiplier: 1 + profile.upgrades.breaker * 0.05,
    incomingDamageMultiplier: Math.max(0.7, 1 - profile.upgrades.guard * 0.03),
    hazardDamageMultiplier: Math.max(0.5, 1 - profile.upgrades.hazard_ward * 0.06),
    rageGainMultiplier: 1 + profile.upgrades.rage_flow * 0.06 + powerMastery * 0.05,
    shockwaveMultiplier: 1 + profile.upgrades.shock_core * 0.06 + powerMastery * 0.04,
    finisherWindowBonus: profile.upgrades.finisher_sense * 0.15,
    swordFinisherRangeBonus: swordMastery * 0.05,
    swordCoinBonus: Math.floor(swordMastery / 2) * 5,
    gunRecoilMultiplier: Math.max(0.62, 1 - gunMastery * 0.04),
    gunReloadMultiplier: Math.max(0.7, 1 - gunMastery * 0.03),
    gunAimMoveMultiplier: 1 + gunMastery * 0.02,
    gunStaggerMultiplier: 1 + gunMastery * 0.03,
    powerOverdriveBonusSeconds: powerMastery * 0.18,
    powerBlockingBonusDamage: 1 + powerMastery * 0.02,
  };
}

function buildAnalyticsRecord(stats: MatchStats): MatchAnalyticsRecord {
  return {
    timestamp: new Date().toISOString(),
    modeId: stats.modeId,
    opponentArchetype: stats.opponentArchetype,
    opponentVariantId: stats.opponentVariantId,
    challengeTier: stats.challengeTier,
    presentationMode: stats.presentationMode,
    stageVariantId: stats.stageVariantId,
    outcome: stats.outcome ?? 'lose',
    durationSeconds: stats.durationSeconds,
    roundWins: stats.roundWins,
    roundLosses: stats.roundLosses,
    hitConfirmRate: stats.attackAttempts > 0 ? stats.confirmedHits / stats.attackAttempts : 0,
    cancelCount: stats.cancelCount,
    droppedInputs: stats.droppedInputs,
    reloadEfficiency: stats.reloadsStarted > 0 ? stats.shotsFired / stats.reloadsStarted : stats.shotsFired,
    aiCountersTriggered: stats.aiCounterTriggers,
    preciseCombos: stats.preciseCombos,
    comboStarters: { ...stats.comboStarters },
    weaponUsage: { ...stats.damageByWeapon },
  };
}

export function applyMatchResult(profile: PlayerProfile, stats: MatchStats): PostMatchSummary {
  const levelBefore = profile.level;
  const xpBefore = profile.xp;
  const rankBefore = getRankForLevel(profile.level);
  const unlockedChallengeBefore = new Set(profile.unlockedChallengeTiers);
  const unlockedSkinsBefore = new Set(profile.unlockedSkins);
  const unlockedTitlesBefore = new Set(profile.unlockedTitles);
  const unlockedAchievementsBefore = new Set(profile.unlockedAchievements);

  const challengeTier = getChallengeTier(stats.challengeTier);
  const modifiers = computeAppliedModifiers(profile);
  const rewards = buildRewardBreakdown(profile, stats, modifiers);
  profile.coins += rewards.totalCoins;
  profile.lifetimeStats.wins += stats.outcome === 'win' ? 1 : 0;
  profile.lifetimeStats.losses += stats.outcome === 'lose' ? 1 : 0;
  profile.lifetimeStats.totalPlaySeconds += stats.durationSeconds;
  profile.lifetimeStats.totalDamageDealt += Object.values(stats.damageByWeapon).reduce((sum, value) => sum + value, 0);
  profile.lifetimeStats.totalDamageTaken += stats.damageTaken;
  profile.lifetimeStats.totalFinishers += stats.finisherUsed ? 1 : 0;
  profile.lifetimeStats.totalRageUses += stats.rageActivations;
  profile.lifetimeStats.totalBarrelsDetonated += stats.barrelsDetonated;
  profile.lifetimeStats.totalConfirmedHits += stats.confirmedHits;
  profile.lifetimeStats.totalSpecials += stats.comboStarters.special_route ?? 0;
  profile.lifetimeStats.totalCancels += stats.cancelCount;
  profile.lifetimeStats.totalAiCountersSeen += stats.aiCounterTriggers;
  grantXp(profile, rewards.totalXp);

  const masteryProgress = applyMasteryGain(profile, stats);
  const missionRewards = applyMissionProgress(profile, stats);
  for (const reward of missionRewards) {
    profile.coins += Math.round(reward.rewardCoins * getStreakMultiplier(profile));
    grantXp(profile, reward.rewardXp);
  }

  const achievementUnlocks = evaluateAchievements(profile, stats);
  for (const achievement of achievementUnlocks) {
    profile.coins += achievement.rewardCoins;
    if (achievement.rewardSkinId) {
      unlockSkin(profile, achievement.rewardSkinId);
    }
    if (achievement.rewardTitleId) {
      unlockTitle(profile, achievement.rewardTitleId);
    }
  }

  unlockRankRewards(profile);
  unlockModesForLevel(profile);
  unlockChallengeTiersForLevel(profile);
  unlockOpponentVariantsForLevel(profile);
  unlockMasteryRewards(profile);

  const weeklyMilestoneUnlocks = applyWeeklyMilestones(profile);
  for (const skinId of weeklyMilestoneUnlocks.skins) {
    unlockSkin(profile, skinId);
  }
  for (const titleId of weeklyMilestoneUnlocks.titles) {
    unlockTitle(profile, titleId);
  }

  const challengeTiersUnlocked = profile.unlockedChallengeTiers
    .filter((tierId) => !unlockedChallengeBefore.has(tierId))
    .map(getChallengeTier);
  const skinsUnlocked = profile.unlockedSkins.filter((skinId) => !unlockedSkinsBefore.has(skinId)).map(getSkinDefinition);
  const titlesUnlocked = profile.unlockedTitles.filter((titleId) => !unlockedTitlesBefore.has(titleId)).map(getTitleDefinition);
  const achievementsUnlocked = profile.unlockedAchievements
    .filter((achievementId) => !unlockedAchievementsBefore.has(achievementId))
    .map(getAchievementDefinition);

  const analytics = buildAnalyticsRecord(stats);
  profile.analytics.totalMatches += 1;
  profile.analytics.totalConfirmedHits += stats.confirmedHits;
  profile.analytics.totalAttackAttempts += stats.attackAttempts;
  profile.analytics.totalDrops += stats.droppedInputs;
  profile.analytics.totalCancels += stats.cancelCount;
  profile.analytics.totalAiCountersTriggered += stats.aiCounterTriggers;
  profile.analytics.recentMatches = [analytics, ...profile.analytics.recentMatches].slice(0, 20);

  saveProfile(profile);

  return {
    outcome: stats.outcome ?? 'lose',
    challengeTier,
    rewards,
    missionsCompleted: missionRewards,
    achievementsUnlocked,
    skinsUnlocked,
    titlesUnlocked,
    challengeTiersUnlocked,
    levelBefore,
    levelAfter: profile.level,
    xpBefore,
    xpAfter: profile.xp,
    xpToNext: getXpRequirement(profile.level),
    rankBefore,
    rankAfter: getRankForLevel(profile.level),
    masteryProgress,
    analytics,
  };
}

export function getSkinDefinition(skinId: SkinId): SkinDefinition {
  return SKIN_LOOKUP.get(skinId) ?? SKINS[0];
}

export function getTitleDefinition(titleId: TitleId): TitleDefinition {
  return TITLE_LOOKUP.get(titleId) ?? TITLES[0];
}

export function getAchievementDefinition(achievementId: AchievementId): AchievementDefinition {
  return ACHIEVEMENT_LOOKUP.get(achievementId) ?? ACHIEVEMENTS[0];
}

export function getUpgradeDefinition(nodeId: UpgradeNodeId): UpgradeNodeDefinition {
  return UPGRADE_LOOKUP.get(nodeId) ?? UPGRADE_NODES[0];
}

export function getMissionDefinition(missionId: MissionId): MissionDefinition {
  return MISSION_LOOKUP.get(missionId) ?? DAILY_MISSION_POOL[0];
}

function sanitizeProfile(raw: Partial<PlayerProfile>, now: Date): PlayerProfile {
  const base = createDefaultProfile(now);
  return {
    ...base,
    ...raw,
    upgrades: { ...base.upgrades, ...raw.upgrades },
    dailyStreak: { ...base.dailyStreak, ...raw.dailyStreak },
    weaponMastery: {
      sword: { ...base.weaponMastery.sword, ...raw.weaponMastery?.sword },
      gun: { ...base.weaponMastery.gun, ...raw.weaponMastery?.gun },
      power: { ...base.weaponMastery.power, ...raw.weaponMastery?.power },
    },
    lifetimeStats: { ...base.lifetimeStats, ...raw.lifetimeStats },
    analytics: {
      ...base.analytics,
      ...raw.analytics,
      recentMatches: Array.isArray(raw.analytics?.recentMatches) ? raw.analytics.recentMatches.slice(0, 20) : [],
    },
    settings: sanitizeSettings(raw.settings),
    tutorialState: sanitizeTutorialState(raw.tutorialState),
    dailyMissions: sanitizeMissions(raw.dailyMissions, 'daily'),
    weeklyMissions: sanitizeMissions(raw.weeklyMissions, 'weekly'),
    weeklyMilestonesClaimed: Array.isArray(raw.weeklyMilestonesClaimed)
      ? raw.weeklyMilestonesClaimed.filter((value): value is number => value === 2 || value === 3)
      : [],
  };
}

function readStoredProfileJson(): string | null {
  if (typeof window === 'undefined') {
    return inMemoryProfileJson;
  }

  try {
    const sessionStored = window.sessionStorage?.getItem(PROFILE_STORAGE_KEY) ?? null;
    if (sessionStored) {
      inMemoryProfileJson = sessionStored;
      return sessionStored;
    }
  } catch {
    // Fall through to legacy local storage / memory fallback.
  }

  try {
    const localStored = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (localStored) {
      inMemoryProfileJson = localStored;
      return localStored;
    }
  } catch {
    // Ignore local storage failures and continue to in-memory fallback.
  }

  return inMemoryProfileJson;
}

function sanitizeSettings(settings: Partial<SettingsState> | undefined): SettingsState {
  const base = defaultSettings();
  return {
    masterVolume: clampNumber(settings?.masterVolume, 0, 100, base.masterVolume),
    combatVolume: clampNumber(settings?.combatVolume, 0, 100, base.combatVolume),
    uiVolume: clampNumber(settings?.uiVolume, 0, 100, base.uiVolume),
    crowdVolume: clampNumber(settings?.crowdVolume, 0, 100, base.crowdVolume),
    screenShake: settings?.screenShake === 0 || settings?.screenShake === 50 || settings?.screenShake === 100 ? settings.screenShake : base.screenShake,
    difficultyAssist: settings?.difficultyAssist === 'forgiving' ? 'forgiving' : 'standard',
  };
}

function sanitizeTutorialState(state: Partial<TutorialState> | undefined): TutorialState {
  const base = defaultTutorialState();
  return {
    completed: Boolean(state?.completed),
    replayRequested: Boolean(state?.replayRequested),
    active: Boolean(state?.active),
    step: state?.step === 1 || state?.step === 2 || state?.step === 3 ? state.step : base.step,
  };
}

function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, Math.round(value)));
}

function sanitizeMissions(missions: ActiveMission[] | undefined, group: MissionGroup): ActiveMission[] {
  if (!Array.isArray(missions)) {
    return [];
  }
  return missions
    .filter((mission): mission is ActiveMission => Boolean(mission && MISSION_LOOKUP.get(mission.id)?.group === group))
    .map((mission) => ({
      id: mission.id,
      progress: Math.max(0, Math.floor(mission.progress)),
      completed: Boolean(mission.completed),
    }));
}

function uniqueValidIds<T extends string>(
  values: T[] | undefined,
  lookup: Map<T, unknown>,
  fallback: T[] = [],
): T[] {
  const seen = new Set<T>();
  const output: T[] = [];
  for (const value of values ?? fallback) {
    if (!lookup.has(value) || seen.has(value)) {
      continue;
    }
    seen.add(value);
    output.push(value);
  }
  return output.length === 0 ? [...fallback] : output;
}

function claimDailyLoginReward(profile: PlayerProfile, now: Date): number {
  const today = getDateKey(now);
  if (profile.dailyStreak.lastClaimDate === today) {
    return 0;
  }

  const previous = profile.dailyStreak.lastClaimDate;
  const diffDays = previous ? daysBetween(previous, today) : null;
  profile.dailyStreak.streakCount = diffDays === 1 ? profile.dailyStreak.streakCount + 1 : 1;
  profile.dailyStreak.cycleDay = (profile.dailyStreak.cycleDay % DAILY_LOGIN_REWARDS.length) + 1;
  profile.dailyStreak.lastClaimDate = today;

  const reward = DAILY_LOGIN_REWARDS[profile.dailyStreak.cycleDay - 1];
  profile.coins += reward;
  return reward;
}

function daysBetween(previous: string, next: string): number {
  const previousDate = new Date(`${previous}T00:00:00`);
  const nextDate = new Date(`${next}T00:00:00`);
  return Math.round((nextDate.getTime() - previousDate.getTime()) / 86400000);
}

function unlockChallengeTiersForLevel(profile: PlayerProfile): void {
  for (const tier of CHALLENGE_TIERS) {
    if (profile.level >= tier.unlockLevel && !profile.unlockedChallengeTiers.includes(tier.id)) {
      profile.unlockedChallengeTiers.push(tier.id);
    }
  }
}

function unlockModesForLevel(profile: PlayerProfile): void {
  for (const mode of GAME_MODES) {
    if (profile.level >= mode.unlockLevel && !profile.unlockedModes.includes(mode.id)) {
      profile.unlockedModes.push(mode.id);
    }
  }
}

function unlockOpponentVariantsForLevel(profile: PlayerProfile): void {
  for (const variant of OPPONENT_VARIANTS) {
    if (profile.level >= variant.unlockLevel && !profile.unlockedOpponentVariants.includes(variant.id)) {
      profile.unlockedOpponentVariants.push(variant.id);
    }
  }
}

function unlockRankRewards(profile: PlayerProfile): void {
  if (profile.level >= 5) {
    unlockSkin(profile, 'fighter_cobalt');
  }
  if (profile.level >= 20) {
    unlockSkin(profile, 'veteran_gold');
  }
  if (profile.level >= 30) {
    unlockSkin(profile, 'master_crimson');
  }
  if (profile.level >= 50) {
    unlockSkin(profile, 'legend_aurora');
  }
}

function unlockMasteryRewards(profile: PlayerProfile): void {
  if (profile.weaponMastery.sword.level >= 10) {
    unlockSkin(profile, 'sword_virtuoso');
    unlockTitle(profile, 'blade_savant');
  }
  if (profile.weaponMastery.gun.level >= 10) {
    unlockSkin(profile, 'gun_lattice');
    unlockTitle(profile, 'deadeye_arc');
  }
  if (profile.weaponMastery.power.level >= 10) {
    unlockSkin(profile, 'power_core');
    unlockTitle(profile, 'overdrive_anchor');
  }
}

function unlockSkin(profile: PlayerProfile, skinId: SkinId): void {
  if (!profile.unlockedSkins.includes(skinId)) {
    profile.unlockedSkins.push(skinId);
  }
}

function unlockTitle(profile: PlayerProfile, titleId: TitleId): void {
  if (!profile.unlockedTitles.includes(titleId)) {
    profile.unlockedTitles.push(titleId);
  }
}

function ensureMissionSet(profile: PlayerProfile, group: MissionGroup, now: Date): void {
  const key = group === 'daily' ? getDateKey(now) : getWeekKey(now);
  const keyField = group === 'daily' ? 'dailyMissionDate' : 'weeklyMissionWeek';
  const missionField = group === 'daily' ? 'dailyMissions' : 'weeklyMissions';

  if (profile[keyField] === key && profile[missionField].length === 3) {
    return;
  }

  const pool = group === 'daily' ? DAILY_MISSION_POOL : WEEKLY_MISSION_POOL;
  profile[keyField] = key;
  profile[missionField] = pickMissionSet(pool, key).map((mission) => ({
    id: mission.id,
    progress: 0,
    completed: false,
  }));
  if (group === 'weekly') {
    profile.weeklyMilestonesClaimed = [];
  }
}

function pickMissionSet(pool: MissionDefinition[], key: string): MissionDefinition[] {
  const indices = new Set<number>();
  let seed = hashString(key);
  while (indices.size < 3) {
    seed = seededStep(seed);
    indices.add(seed % pool.length);
  }
  return [...indices].map((index) => pool[index]);
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function seededStep(seed: number): number {
  return (Math.imul(seed, 1664525) + 1013904223) >>> 0;
}

function buildRewardBreakdown(profile: PlayerProfile, stats: MatchStats, modifiers: AppliedCombatModifiers): RewardBreakdown {
  const baseCoins = stats.outcome === 'win' ? 90 : 35;
  const bonusCoins: RewardLine[] = [];

  if (stats.outcome === 'win' && stats.damageTaken <= 0.001) {
    bonusCoins.push({ label: 'No Damage', amount: 40 });
  }
  if (stats.outcome === 'win' && stats.durationSeconds <= 180) {
    bonusCoins.push({ label: 'Quick Kill', amount: 30 });
  }
  if (stats.fullComboChains >= 3) {
    bonusCoins.push({ label: 'Combo Artist', amount: 20 });
  }
  if (stats.finisherUsed) {
    bonusCoins.push({ label: 'Finisher', amount: 15 + modifiers.swordCoinBonus });
  }

  const survivalMultiplier =
    stats.modeId === 'survival'
      ? ([1, 1.1, 1.25, 1.4, 1.6][Math.max(0, Math.min(4, stats.roundWins - 1))] ?? 1)
      : 1;
  const challengeMultiplier = getChallengeTier(stats.challengeTier).rewardMultiplier * survivalMultiplier;
  const streakMultiplier = getStreakMultiplier(profile);
  const subtotal = baseCoins + bonusCoins.reduce((sum, entry) => sum + entry.amount, 0);
  const totalCoins = Math.round(subtotal * challengeMultiplier * streakMultiplier);
  const baseXp = stats.outcome === 'win' ? 160 : 80;
  const totalXp = Math.round(baseXp * challengeMultiplier);

  return {
    baseCoins,
    bonusCoins,
    challengeMultiplier,
    streakMultiplier,
    totalCoins,
    baseXp,
    totalXp,
  };
}

function grantXp(profile: PlayerProfile, amount: number): void {
  profile.xp += Math.max(0, Math.round(amount));
  while (profile.xp >= getXpRequirement(profile.level)) {
    profile.xp -= getXpRequirement(profile.level);
    profile.level += 1;
    profile.upgradePoints += 1;
  }
}

function applyMasteryGain(profile: PlayerProfile, stats: MatchStats): MasteryProgressSummary[] {
  const summaries: MasteryProgressSummary[] = [];

  for (const weapon of ['sword', 'gun', 'power'] as WeaponMode[]) {
    const mastery = profile.weaponMastery[weapon];
    const levelBefore = mastery.level;
    const xpGained = Math.round(stats.damageByWeapon[weapon] * 0.22 + (stats.weaponsUsed[weapon] ? (stats.outcome === 'win' ? 12 : 6) : 0));
    if (xpGained > 0) {
      mastery.totalXp += xpGained;
      mastery.xp += xpGained;
      while (mastery.level < 10 && mastery.xp >= getWeaponMasteryRequirement(mastery.level)) {
        mastery.xp -= getWeaponMasteryRequirement(mastery.level);
        mastery.level += 1;
      }
    }
    summaries.push({
      weapon,
      xpGained,
      levelBefore,
      levelAfter: mastery.level,
      xpAfter: mastery.xp,
      xpToNext: mastery.level >= 10 ? 0 : getWeaponMasteryRequirement(mastery.level),
    });
  }

  return summaries;
}

function applyMissionProgress(profile: PlayerProfile, stats: MatchStats): MissionRewardSummary[] {
  const rewards: MissionRewardSummary[] = [];

  for (const missionSet of [profile.dailyMissions, profile.weeklyMissions]) {
    for (const mission of missionSet) {
      if (mission.completed) {
        continue;
      }

      const definition = getMissionDefinition(mission.id);
      mission.progress = Math.min(definition.target, mission.progress + getMissionIncrement(definition, stats));
      mission.completed = mission.progress >= definition.target;
      if (mission.completed) {
        rewards.push({
          mission: definition,
          rewardCoins: definition.rewardCoins,
          rewardXp: definition.rewardXp,
        });
      }
    }
  }

  return rewards;
}

function getMissionIncrement(definition: MissionDefinition, stats: MatchStats): number {
  switch (definition.metric) {
    case 'wins':
      return stats.outcome === 'win' ? 1 : 0;
    case 'fighter_wins':
      return stats.outcome === 'win' && stats.opponentArchetype === 'fighter' ? 1 : 0;
    case 'boss_wins':
      return stats.outcome === 'win' && stats.opponentArchetype === 'boss' ? 1 : 0;
    case 'challenge_wins':
      return stats.outcome === 'win' && stats.challengeTier !== 'standard' ? 1 : 0;
    case 'sword_damage':
      return Math.round(stats.damageByWeapon.sword);
    case 'gun_damage':
      return Math.round(stats.damageByWeapon.gun);
    case 'power_damage':
      return Math.round(stats.damageByWeapon.power);
    case 'full_combos':
      return stats.fullComboChains;
    case 'finishers':
      return stats.finisherUsed ? 1 : 0;
    case 'rage_uses':
      return stats.rageActivations;
    case 'objects_destroyed':
      return stats.objectsDestroyed;
    case 'barrels_detonated':
      return stats.barrelsDetonated;
    case 'hazardless_wins':
      return stats.outcome === 'win' && stats.hazardDamageTaken <= 0.001 ? 1 : 0;
    case 'guard_breaks':
      return stats.guardBreaks;
    case 'successful_blocks':
      return stats.successfulBlocks;
    case 'dashes_used':
      return stats.dashesUsed;
    case 'juggle_hits':
      return stats.juggleHits;
    case 'launches':
      return stats.launches;
  }
}

function evaluateAchievements(profile: PlayerProfile, stats: MatchStats): AchievementDefinition[] {
  const unlocks: AchievementDefinition[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (profile.unlockedAchievements.includes(achievement.id)) {
      continue;
    }
    if (!didEarnAchievement(achievement.id, stats)) {
      continue;
    }

    profile.unlockedAchievements.push(achievement.id);
    unlocks.push(achievement);
  }

  return unlocks;
}

function didEarnAchievement(achievementId: AchievementId, stats: MatchStats): boolean {
  switch (achievementId) {
    case 'perfect_form':
      return stats.outcome === 'win' && stats.damageTaken <= 0.001;
    case 'speed_hunter':
      return stats.outcome === 'win' && stats.durationSeconds <= 180;
    case 'combo_discipline':
      return stats.fullComboChains >= 3;
    case 'arsenal_sweep':
      return stats.outcome === 'win' && stats.weaponsUsed.sword && stats.weaponsUsed.gun && stats.weaponsUsed.power;
    case 'shock_surgeon':
      return stats.shockwaveBossPhase3Kill;
    case 'demolitionist':
      return stats.guardBreaks >= 3;
    case 'hazard_dancer':
      return stats.outcome === 'win' && stats.challengeTier !== 'standard' && stats.dashesUsed >= 3;
    case 'ruthless_victor':
      return stats.outcome === 'win' && stats.challengeTier === 'cataclysm';
    case 'legend_slayer':
      return stats.outcome === 'win' && stats.challengeTier === 'legend';
  }
}

function applyWeeklyMilestones(profile: PlayerProfile): { skins: SkinId[]; titles: TitleId[] } {
  const completedWeeklies = profile.weeklyMissions.filter((mission) => mission.completed).length;
  const skins: SkinId[] = [];
  const titles: TitleId[] = [];

  if (completedWeeklies >= 2 && !profile.weeklyMilestonesClaimed.includes(2)) {
    profile.weeklyMilestonesClaimed.push(2);
    titles.push('weekbreaker');
  }
  if (completedWeeklies >= 3 && !profile.weeklyMilestonesClaimed.includes(3)) {
    profile.weeklyMilestonesClaimed.push(3);
    skins.push('solar_static');
  }

  return { skins, titles };
}
