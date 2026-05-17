import { ACHIEVEMENT_CONFIGS } from './AchievementConfig';
import { ECONOMY_CONFIG } from './EconomyConfig';
import { COSMETIC_CONFIGS, DEFAULT_EQUIPPED_COSMETICS, SKIN_CONFIGS, WEAPON_STYLE_CONFIGS } from './GearConfig';
import { getLoadoutState } from './LoadoutSystem';
import { createDefaultRecord, getBestGrade, updateRecord } from './RecordsSystem';
import { DEFAULT_ROUTE_ID, getRouteById, isGradeAtLeast, ROUTE_CONFIGS } from './RouteConfig';
import { DEFAULT_UPGRADE_LEVELS, getUpgradeCost, UPGRADE_CONFIGS } from './UpgradeConfig';
import type {
  AchievementId,
  AchievementProgress,
  CosmeticCategory,
  CosmeticId,
  DailyChallenge,
  DailyRecord,
  DailySaveData,
  GameSettings,
  Grade,
  LocalRecord,
  ProgressUpdateResult,
  RouteConfig,
  RouteId,
  RouteProgress,
  RunSummary,
  SaveData,
  SkinId,
  UpgradeId,
  WeaponStyleId
} from './types';

const STORAGE_KEY = 'train-roof-rush-progress-v1';
const SCHEMA_VERSION = 3;

interface RecordRunOptions {
  dailyChallenge?: DailyChallenge;
}

export class ProgressSystem {
  private data: SaveData;
  private storageAvailable = true;

  constructor() {
    this.data = this.load();
    this.updateUnlocks();
    this.autoUnlockGear();
  }

  get snapshot(): SaveData {
    return { ...this.cloneSave(this.data), storageAvailable: this.storageAvailable };
  }

  get settings(): GameSettings {
    return { ...this.data.settings };
  }

  getRouteProgress(routeId: RouteId): RouteProgress {
    return this.cloneRouteProgress(this.data.routes[routeId] ?? this.defaultRouteProgress(routeId));
  }

  isRouteUnlocked(routeId: RouteId): boolean {
    const route = getRouteById(routeId);
    return route.playable && Boolean(this.data.routes[routeId]?.unlocked);
  }

  updateSettings(settings: Partial<GameSettings>): void {
    this.data.settings = { ...this.data.settings, ...settings };
    this.save();
  }

  reset(): SaveData {
    this.data = this.createDefaultSave();
    this.save();
    return this.snapshot;
  }

  debugUnlockAllRoutes(): SaveData {
    for (const route of ROUTE_CONFIGS) {
      this.data.routes[route.id].unlocked = route.playable || route.id === DEFAULT_ROUTE_ID;
    }
    this.save();
    return this.snapshot;
  }

  purchaseUpgrade(id: UpgradeId): boolean {
    const currentLevel = this.data.upgrades[id] ?? 0;
    const cost = getUpgradeCost(id, currentLevel);
    if (cost === null || this.data.totalCoins < cost) {
      return false;
    }

    this.data.totalCoins -= cost;
    this.data.upgrades[id] = Math.min(UPGRADE_CONFIGS.find((upgrade) => upgrade.id === id)?.maxLevel ?? 5, currentLevel + 1);
    this.save();
    return true;
  }

  unlockOrEquipWeapon(id: WeaponStyleId): boolean {
    if (this.data.unlockedWeapons.includes(id)) {
      this.data.equippedWeapon = id;
      this.save();
      return true;
    }

    const config = WEAPON_STYLE_CONFIGS.find((weapon) => weapon.id === id);
    if (!config?.coinCost || this.data.totalCoins < config.coinCost) {
      return false;
    }

    this.data.totalCoins -= config.coinCost;
    this.data.unlockedWeapons.push(id);
    this.data.equippedWeapon = id;
    this.save();
    return true;
  }

  equipSkin(id: SkinId): boolean {
    if (!this.data.unlockedSkins.includes(id)) {
      return false;
    }

    this.data.equippedSkin = id;
    this.save();
    return true;
  }

  unlockOrEquipCosmetic(id: CosmeticId): boolean {
    const config = COSMETIC_CONFIGS.find((cosmetic) => cosmetic.id === id);
    if (!config) {
      return false;
    }

    if (this.data.unlockedCosmetics.includes(id)) {
      this.data.equippedCosmetics[config.category] = id;
      this.save();
      return true;
    }

    if (!config.coinCost || this.data.totalCoins < config.coinCost) {
      return false;
    }

    this.data.totalCoins -= config.coinCost;
    this.data.unlockedCosmetics.push(id);
    this.data.equippedCosmetics[config.category] = id;
    this.save();
    return true;
  }

  recordRun(route: RouteConfig, summary: RunSummary, completedObjectiveIds: string[], options: RecordRunOptions = {}): ProgressUpdateResult {
    const beforeUnlocks = this.getUnlockedRouteIds();
    const previousTotalCoins = this.data.totalCoins;
    const previousWeapons = [...this.data.unlockedWeapons];
    const previousSkins = [...this.data.unlockedSkins];
    const previousCosmetics = [...this.data.unlockedCosmetics];
    const previousCompletedAchievements = this.getCompletedAchievementIds();
    const isDaily = Boolean(options.dailyChallenge);
    const progress = this.data.routes[route.id] ?? this.defaultRouteProgress(route.id);
    const score = Math.floor(summary.score);
    const bestScoreImproved = score > progress.bestScore;
    const economy = this.calculateReward(route, summary, completedObjectiveIds.length, options.dailyChallenge);

    if (!isDaily) {
      progress.runs += 1;
      progress.bestScore = Math.max(progress.bestScore, score);
      progress.bestTokenCount = Math.max(progress.bestTokenCount, summary.routeTokens ?? 0);
      progress.bestGrade = getBestGrade(progress.bestGrade, summary.grade);
      progress.objectivesCompleted = Array.from(new Set([...progress.objectivesCompleted, ...completedObjectiveIds]));
      if (summary.victory) {
        progress.completed = true;
      }
      this.data.routes[route.id] = progress;
      this.updateUnlocks();
    }

    this.data.totalCoins += economy.total;
    this.data.coinsLifetime += economy.total;
    this.data.records[route.id] = updateRecord(this.data.records[route.id] ?? createDefaultRecord(), summary, getLoadoutState(this.data));

    if (options.dailyChallenge) {
      this.recordDaily(options.dailyChallenge, summary);
    }

    const achievementReward = this.updateAchievements(route, summary);
    economy.achievementBonus = achievementReward;
    economy.total += achievementReward;
    this.data.totalCoins += achievementReward;
    this.data.coinsLifetime += achievementReward;

    this.autoUnlockGear();
    this.save();

    const afterUnlocks = this.getUnlockedRouteIds();
    const achievementsUnlocked = this.getCompletedAchievementIds().filter((id) => !previousCompletedAchievements.includes(id));

    return {
      rewardCoins: this.data.totalCoins - previousTotalCoins,
      bestScoreImproved,
      newUnlocks: afterUnlocks.filter((routeId) => !beforeUnlocks.includes(routeId)),
      economy,
      achievementsUnlocked,
      cosmeticsUnlocked: this.data.unlockedCosmetics.filter((id) => !previousCosmetics.includes(id)),
      weaponsUnlocked: this.data.unlockedWeapons.filter((id) => !previousWeapons.includes(id)),
      skinsUnlocked: this.data.unlockedSkins.filter((id) => !previousSkins.includes(id)),
      dailyBestImproved: options.dailyChallenge ? this.data.daily.today?.bestScore === Math.floor(summary.score) : undefined
    };
  }

  private calculateReward(route: RouteConfig, summary: RunSummary, completedObjectiveCount: number, dailyChallenge?: DailyChallenge) {
    const isDaily = Boolean(dailyChallenge);
    const completionBonus = summary.victory ? route.rewardCoins : 0;
    const firstCompletionBonus = !this.data.routes[route.id]?.completed && summary.victory && !isDaily ? ECONOMY_CONFIG.firstCompletionBonus : 0;
    const economy = {
      runCoins: summary.coins,
      completionBonus: completionBonus + firstCompletionBonus,
      objectiveBonus: completedObjectiveCount * ECONOMY_CONFIG.objectiveBonus,
      gradeBonus: ECONOMY_CONFIG.gradeBonus[summary.grade],
      tokenBonus: (summary.routeTokens ?? 0) * ECONOMY_CONFIG.tokenBonus,
      dailyBonus: isDaily ? (dailyChallenge?.rewardCoins ?? ECONOMY_CONFIG.dailyCompletionBonus) : 0,
      achievementBonus: 0,
      total: 0
    };
    economy.total =
      economy.runCoins + economy.completionBonus + economy.objectiveBonus + economy.gradeBonus + economy.tokenBonus + economy.dailyBonus;
    return economy;
  }

  private updateUnlocks(): void {
    for (const route of ROUTE_CONFIGS) {
      if (!this.data.routes[route.id]) {
        this.data.routes[route.id] = this.defaultRouteProgress(route.id);
      }
    }

    this.data.routes[DEFAULT_ROUTE_ID].unlocked = true;
    this.data.routes['dustline-runner'].unlocked = getRouteById('dustline-runner').playable && this.data.routes['neon-express'].completed;
    this.data.routes['frost-rail'].unlocked =
      getRouteById('frost-rail').playable &&
      this.data.routes['dustline-runner'].completed &&
      isGradeAtLeast(this.data.routes['dustline-runner'].bestGrade, 'B');

    const totalObjectives = ROUTE_CONFIGS.reduce((sum, route) => sum + this.data.routes[route.id].objectivesCompleted.length, 0);
    this.data.routes['jungle-breakline'].unlocked = getRouteById('jungle-breakline').playable && totalObjectives >= 6;
    this.data.routes['volcano-freight'].unlocked =
      getRouteById('volcano-freight').playable &&
      ROUTE_CONFIGS.some((route) => isGradeAtLeast(this.data.routes[route.id].bestGrade, 'S'));
  }

  private autoUnlockGear(): void {
    const addWeapon = (id: WeaponStyleId): void => {
      if (!this.data.unlockedWeapons.includes(id)) {
        this.data.unlockedWeapons.push(id);
      }
    };
    const addSkin = (id: SkinId): void => {
      if (!this.data.unlockedSkins.includes(id)) {
        this.data.unlockedSkins.push(id);
      }
    };
    const addCosmetic = (id: CosmeticId): void => {
      if (!this.data.unlockedCosmetics.includes(id)) {
        this.data.unlockedCosmetics.push(id);
      }
    };

    addWeapon('shockGauntlets');
    addSkin('defaultRunner');
    addCosmetic('cyberChrome');
    addCosmetic('trailCyan');
    addCosmetic('bannerStandard');

    if (this.data.routes['neon-express'].completed) {
      addSkin('cyberAgent');
      addCosmetic('bannerNeon');
    }
    if (this.data.routes['dustline-runner'].completed) {
      addWeapon('energyBaton');
      addSkin('desertRaider');
      addCosmetic('dustlineRust');
    }
    if (this.data.routes['frost-rail'].completed) {
      addWeapon('railBlade');
      addSkin('frostOperative');
      addCosmetic('frostGuard');
      addCosmetic('trailFrost');
    }
    if (ROUTE_CONFIGS.some((route) => isGradeAtLeast(this.data.routes[route.id].bestGrade, 'S'))) {
      addSkin('shadowNinja');
    }
    if (this.getCompletedAchievementIds().length >= 12) {
      addSkin('goldenChampion');
    }
  }

  private updateAchievements(route: RouteConfig, summary: RunSummary): number {
    let rewardCoins = 0;
    const setProgress = (id: AchievementId, progress: number, additive = false): void => {
      const achievement = this.data.achievements[id];
      if (!achievement || achievement.completed) {
        return;
      }

      const config = ACHIEVEMENT_CONFIGS.find((item) => item.id === id);
      const nextProgress = additive ? achievement.progress + progress : Math.max(achievement.progress, progress);
      achievement.progress = Math.min(config?.target ?? nextProgress, nextProgress);
      if (config && achievement.progress >= config.target) {
        achievement.completed = true;
      }
    };

    setProgress('firstRide', summary.victory ? 1 : 0);
    setProgress('skybreaker', summary.bossDefeated ? 1 : 0);
    setProgress('perfectReflex', summary.perfectDodges, true);
    setProgress('comboFlow', summary.maxCombo);
    setProgress('noFallHero', summary.victory ? 1 : 0);
    setProgress('coinRunner', summary.coins, true);
    setProgress('enemySweeper', summary.enemiesDefeated, true);
    setProgress('bossHunter', summary.bossDefeated ? 1 : 0, true);
    setProgress('specialMaster', summary.specialUses ?? 0, true);
    setProgress('collector', summary.routeTokens ?? 0, true);
    setProgress('sRankRunner', isGradeAtLeast(summary.grade, 'S') ? 1 : 0);
    setProgress('untouchable', summary.victory && summary.damageTaken === 0 ? 1 : 0);

    if (route.id === 'neon-express' && isGradeAtLeast(summary.grade, 'A')) {
      setProgress('neonChampion', 1);
    }
    if (route.id === 'dustline-runner' && summary.victory) {
      setProgress('desertSurvivor', 1);
    }
    if (route.id === 'frost-rail' && summary.victory) {
      setProgress('frostWalker', 1);
    }

    for (const config of ACHIEVEMENT_CONFIGS) {
      const progress = this.data.achievements[config.id];
      if (!progress.completed || progress.rewarded) {
        continue;
      }

      progress.rewarded = true;
      rewardCoins += config.rewardCoins;
      if (config.rewardCosmetic && !this.data.unlockedCosmetics.includes(config.rewardCosmetic)) {
        this.data.unlockedCosmetics.push(config.rewardCosmetic);
      }
    }

    return rewardCoins;
  }

  private recordDaily(challenge: DailyChallenge, summary: RunSummary): void {
    const existing =
      this.data.daily.today?.dateKey === challenge.dateKey && this.data.daily.today.challengeId === challenge.id
        ? this.data.daily.today
        : this.defaultDailyRecord(challenge);
    const updated = {
      ...updateRecord(existing, summary, getLoadoutState(this.data)),
      dateKey: challenge.dateKey,
      challengeId: challenge.id,
      completed: existing.completed || summary.victory
    } satisfies DailyRecord;
    this.data.daily.today = updated;
    this.data.daily.history[challenge.id] = updated;
  }

  private getUnlockedRouteIds(): RouteId[] {
    return ROUTE_CONFIGS.filter((route) => this.data.routes[route.id]?.unlocked).map((route) => route.id);
  }

  private getCompletedAchievementIds(): AchievementId[] {
    return ACHIEVEMENT_CONFIGS.filter((config) => this.data.achievements[config.id]?.completed).map((config) => config.id);
  }

  private load(): SaveData {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return this.createDefaultSave();
      }

      const parsed = JSON.parse(raw) as Partial<SaveData>;
      return this.sanitizeSave(parsed);
    } catch {
      this.storageAvailable = false;
      return this.createDefaultSave();
    }
  }

  private save(): void {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      this.storageAvailable = true;
      this.data.storageAvailable = true;
    } catch {
      // Progress is best-effort; gameplay should never depend on storage availability.
      this.storageAvailable = false;
      this.data.storageAvailable = false;
    }
  }

  private sanitizeSave(save: Partial<SaveData>): SaveData {
    const fallback = this.createDefaultSave();
    const routes = { ...fallback.routes };
    const records = { ...fallback.records };
    const achievements = { ...fallback.achievements };
    const upgrades = { ...fallback.upgrades };
    const settings = save.settings ?? fallback.settings;

    for (const route of ROUTE_CONFIGS) {
      const incoming = save.routes?.[route.id];
      if (incoming) {
        routes[route.id] = {
          routeId: route.id,
          unlocked: Boolean(incoming.unlocked),
          completed: Boolean(incoming.completed),
          bestScore: this.safeNumber(incoming.bestScore),
          bestGrade: this.isGrade(incoming.bestGrade) ? incoming.bestGrade : null,
          objectivesCompleted: Array.isArray(incoming.objectivesCompleted) ? incoming.objectivesCompleted.filter(Boolean) : [],
          bestTokenCount: this.safeNumber(incoming.bestTokenCount),
          runs: this.safeNumber(incoming.runs)
        };
      }

      const incomingRecord = save.records?.[route.id];
      if (incomingRecord) {
        records[route.id] = this.sanitizeRecord(incomingRecord);
      }
    }

    for (const upgrade of UPGRADE_CONFIGS) {
      const level = save.upgrades?.[upgrade.id] ?? 0;
      upgrades[upgrade.id] = Math.min(upgrade.maxLevel, this.safeNumber(level));
    }

    for (const config of ACHIEVEMENT_CONFIGS) {
      const incoming = save.achievements?.[config.id];
      achievements[config.id] = {
        id: config.id,
        progress: incoming ? this.safeNumber(incoming.progress) : 0,
        completed: Boolean(incoming?.completed),
        rewarded: Boolean(incoming?.rewarded)
      };
    }

    return {
      schemaVersion: SCHEMA_VERSION,
      storageAvailable: this.storageAvailable,
      totalCoins: this.safeNumber(save.totalCoins),
      coinsLifetime: this.safeNumber(save.coinsLifetime ?? save.totalCoins),
      routes,
      settings: {
        soundVolume: Number.isFinite(settings.soundVolume) ? settings.soundVolume : fallback.settings.soundVolume,
        musicVolume: Number.isFinite(settings.musicVolume) ? settings.musicVolume : fallback.settings.musicVolume,
        mute: typeof settings.mute === 'boolean' ? settings.mute : fallback.settings.mute,
        cameraShake: typeof settings.cameraShake === 'boolean' ? settings.cameraShake : fallback.settings.cameraShake,
        vfxIntensity: ['low', 'medium', 'high'].includes(settings.vfxIntensity) ? settings.vfxIntensity : fallback.settings.vfxIntensity,
        showControlHints: typeof settings.showControlHints === 'boolean' ? settings.showControlHints : fallback.settings.showControlHints,
        highContrastWarnings:
          typeof settings.highContrastWarnings === 'boolean' ? settings.highContrastWarnings : fallback.settings.highContrastWarnings,
        performanceMode: typeof settings.performanceMode === 'boolean' ? settings.performanceMode : fallback.settings.performanceMode,
        mobileControls: ['auto', 'on', 'off'].includes(settings.mobileControls) ? settings.mobileControls : fallback.settings.mobileControls,
        reducedMotion: typeof settings.reducedMotion === 'boolean' ? settings.reducedMotion : fallback.settings.reducedMotion,
        uiScale:
          typeof settings.uiScale === 'number' && Number.isFinite(settings.uiScale)
            ? Math.min(1.2, Math.max(0.85, settings.uiScale))
            : fallback.settings.uiScale
      },
      upgrades,
      unlockedWeapons: this.sanitizeList(save.unlockedWeapons, ['shockGauntlets'], WEAPON_STYLE_CONFIGS.map((weapon) => weapon.id)),
      equippedWeapon: this.isWeapon(save.equippedWeapon) ? save.equippedWeapon : 'shockGauntlets',
      unlockedSkins: this.sanitizeList(save.unlockedSkins, ['defaultRunner'], SKIN_CONFIGS.map((skin) => skin.id)),
      equippedSkin: this.isSkin(save.equippedSkin) ? save.equippedSkin : 'defaultRunner',
      unlockedCosmetics: this.sanitizeList(
        save.unlockedCosmetics,
        ['cyberChrome', 'trailCyan', 'bannerStandard'],
        COSMETIC_CONFIGS.map((cosmetic) => cosmetic.id)
      ),
      equippedCosmetics: {
        trainPaint: this.isCosmetic(save.equippedCosmetics?.trainPaint) ? save.equippedCosmetics.trainPaint : DEFAULT_EQUIPPED_COSMETICS.trainPaint,
        trailColor: this.isCosmetic(save.equippedCosmetics?.trailColor) ? save.equippedCosmetics.trailColor : DEFAULT_EQUIPPED_COSMETICS.trailColor,
        victoryBanner: this.isCosmetic(save.equippedCosmetics?.victoryBanner)
          ? save.equippedCosmetics.victoryBanner
          : DEFAULT_EQUIPPED_COSMETICS.victoryBanner
      },
      achievements,
      records,
      daily: this.sanitizeDaily(save.daily)
    };
  }

  private createDefaultSave(): SaveData {
    const routes = Object.fromEntries(ROUTE_CONFIGS.map((route) => [route.id, this.defaultRouteProgress(route.id)])) as SaveData['routes'];
    const records = Object.fromEntries(ROUTE_CONFIGS.map((route) => [route.id, createDefaultRecord()])) as SaveData['records'];
    const achievements = Object.fromEntries(
      ACHIEVEMENT_CONFIGS.map((achievement) => [
        achievement.id,
        { id: achievement.id, progress: 0, completed: false, rewarded: false } satisfies AchievementProgress
      ])
    ) as SaveData['achievements'];

    routes[DEFAULT_ROUTE_ID].unlocked = true;
    return {
      schemaVersion: SCHEMA_VERSION,
      storageAvailable: this.storageAvailable,
      totalCoins: 0,
      coinsLifetime: 0,
      routes,
      settings: {
        soundVolume: 0.8,
        musicVolume: 0.6,
        mute: false,
        cameraShake: true,
        vfxIntensity: 'medium',
        showControlHints: true,
        highContrastWarnings: false,
        performanceMode: false,
        mobileControls: 'auto',
        reducedMotion: false,
        uiScale: 1
      },
      upgrades: { ...DEFAULT_UPGRADE_LEVELS },
      unlockedWeapons: ['shockGauntlets'],
      equippedWeapon: 'shockGauntlets',
      unlockedSkins: ['defaultRunner'],
      equippedSkin: 'defaultRunner',
      unlockedCosmetics: ['cyberChrome', 'trailCyan', 'bannerStandard'],
      equippedCosmetics: { ...DEFAULT_EQUIPPED_COSMETICS },
      achievements,
      records,
      daily: { today: null, history: {} }
    };
  }

  private defaultRouteProgress(routeId: RouteId): RouteProgress {
    return {
      routeId,
      unlocked: routeId === DEFAULT_ROUTE_ID,
      completed: false,
      bestScore: 0,
      bestGrade: null,
      objectivesCompleted: [],
      bestTokenCount: 0,
      runs: 0
    };
  }

  private defaultDailyRecord(challenge: DailyChallenge): DailyRecord {
    return {
      ...createDefaultRecord(),
      dateKey: challenge.dateKey,
      challengeId: challenge.id,
      completed: false
    };
  }

  private sanitizeDaily(daily?: Partial<DailySaveData>): DailySaveData {
    return {
      today: daily?.today ? this.sanitizeDailyRecord(daily.today) : null,
      history: Object.fromEntries(
        Object.entries(daily?.history ?? {}).map(([key, value]) => [key, this.sanitizeDailyRecord(value)])
      )
    };
  }

  private sanitizeDailyRecord(record: Partial<DailyRecord>): DailyRecord {
    return {
      ...this.sanitizeRecord(record),
      dateKey: String(record.dateKey ?? ''),
      challengeId: String(record.challengeId ?? ''),
      completed: Boolean(record.completed)
    };
  }

  private sanitizeRecord(record: Partial<LocalRecord>): LocalRecord {
    return {
      bestScore: this.safeNumber(record.bestScore),
      bestDistance: this.safeNumber(record.bestDistance),
      bestTime: this.safeNumber(record.bestTime),
      bestGrade: this.isGrade(record.bestGrade) ? record.bestGrade : null,
      maxCombo: Math.max(1, this.safeNumber(record.maxCombo)),
      fastestClearTime: Number.isFinite(record.fastestClearTime) ? Math.max(1, Number(record.fastestClearTime)) : null,
      noDamageClear: Boolean(record.noDamageClear),
      enemiesDefeated: this.safeNumber(record.enemiesDefeated),
      coinsCollected: this.safeNumber(record.coinsCollected),
      bossDefeated: Boolean(record.bossDefeated),
      runs: this.safeNumber(record.runs),
      lastLoadout: record.lastLoadout
    };
  }

  private cloneSave(save: SaveData): SaveData {
    return JSON.parse(JSON.stringify(save)) as SaveData;
  }

  private cloneRouteProgress(progress: RouteProgress): RouteProgress {
    return {
      ...progress,
      objectivesCompleted: [...progress.objectivesCompleted]
    };
  }

  private safeNumber(value: unknown): number {
    return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : 0;
  }

  private sanitizeList<T extends string>(incoming: readonly T[] | undefined, defaults: T[], allowed: readonly T[]): T[] {
    const set = new Set<T>(defaults);
    if (Array.isArray(incoming)) {
      for (const value of incoming) {
        if (allowed.includes(value)) {
          set.add(value);
        }
      }
    }
    return [...set];
  }

  private isGrade(value: unknown): value is Grade {
    return value === 'C' || value === 'B' || value === 'A' || value === 'S' || value === 'S+';
  }

  private isWeapon(value: unknown): value is WeaponStyleId {
    return WEAPON_STYLE_CONFIGS.some((weapon) => weapon.id === value);
  }

  private isSkin(value: unknown): value is SkinId {
    return SKIN_CONFIGS.some((skin) => skin.id === value);
  }

  private isCosmetic(value: unknown): value is CosmeticId {
    return COSMETIC_CONFIGS.some((cosmetic) => cosmetic.id === value);
  }
}
