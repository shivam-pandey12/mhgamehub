import { ACHIEVEMENTS } from '../../config/achievements.js';
import { DEFAULT_CUSTOMIZATION } from '../../config/customization.js';
import { getLicenseForXp } from '../../config/progression.js';
import { createDefaultTuning } from '../../config/tuning.js';

const SAVE_KEY = 'mini-city-drive:v0.5';
const V4_SAVE_KEY = 'mini-city-drive:v0.4';
const V3_SAVE_KEY = 'mini-city-drive:v0.3';
const V2_SAVE_KEY = 'mini-city-drive:v0.2';
const V1_SAVE_KEY = 'mini-city-drive:v0.1';

const DEFAULT_SETTINGS = {
  masterVolume: 0.72,
  engineVolume: 0.72,
  tireVolume: 0.62,
  uiVolume: 0.7,
  ambienceVolume: 0.42,
  cameraShake: 'normal',
  trafficDensity: 'low',
  visualQuality: 'medium',
  minimap: true,
  uiScale: 'normal',
  touchControls: 'auto',
  cameraMode: 'standard',
  cockpitMotion: 'normal',
  cockpitHud: 'minimal',
  cockpitFov: 'normal',
  mirrorRendering: 'geometry',
  dashboardBrightness: 0.9,
  cockpitHintSeen: false,
  debugOverlay: false
};

const createDefaultSave = () => ({
  version: 5,
  totalCoins: 0,
  selectedCar: 'hatchback',
  license: {
    xp: 0,
    levelId: 'rookie',
    levelUpsSeen: {}
  },
  completedMissions: {},
  bestScores: {},
  bestTimes: {},
  medals: {},
  discoveries: {
    landmarks: {},
    districts: {},
    hiddenTokens: {}
  },
  discoveredLandmarks: {},
  collectedCoins: {},
  achievements: {},
  customizations: {},
  carMastery: {},
  carTuning: {},
  career: {
    completed: {},
    activeCareerMission: null,
    pathProgress: {}
  },
  bonusObjectives: {},
  cityEvents: {
    completed: {},
    lastEventId: null
  },
  freeDriveTasks: {
    completed: {},
    activeTaskId: null,
    progress: {}
  },
  debugSettings: {
    overlay: false
  },
  stats: {
    totalDistance: 0,
    totalCleanDistance: 0,
    totalCrashes: 0,
    totalDriftScore: 0,
    totalCoinsCollected: 0,
    missionsCompleted: 0,
    deliveriesCompleted: 0,
    taxiRidesCompleted: 0,
    parkingCompleted: 0,
    timeTrialsCompleted: 0,
    driftZonesCompleted: 0,
    favoriteCarUse: {},
    favoriteCar: 'hatchback',
    highestLicenseLevel: 'rookie'
  },
  onboardingComplete: false,
  settings: DEFAULT_SETTINGS
});

const safeClone = (value) => JSON.parse(JSON.stringify(value));

export class SaveManager {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const current = localStorage.getItem(SAVE_KEY);
      if (current) return this.mergeDefaults(JSON.parse(current));

      const v4 = localStorage.getItem(V4_SAVE_KEY);
      if (v4) {
        const migrated = this.migrateV4(JSON.parse(v4));
        this.data = migrated;
        this.persist();
        return migrated;
      }

      const v3 = localStorage.getItem(V3_SAVE_KEY);
      if (v3) {
        const migrated = this.migrateV3(JSON.parse(v3));
        this.data = migrated;
        this.persist();
        return migrated;
      }

      const v2 = localStorage.getItem(V2_SAVE_KEY);
      if (v2) {
        const migrated = this.migrateV2(JSON.parse(v2));
        this.data = migrated;
        this.persist();
        return migrated;
      }

      const v1 = localStorage.getItem(V1_SAVE_KEY);
      if (v1) {
        const migrated = this.migrateV1(JSON.parse(v1));
        this.data = migrated;
        this.persist();
        return migrated;
      }
    } catch {
      return createDefaultSave();
    }
    return createDefaultSave();
  }

  migrateV4(data) {
    return this.mergeDefaults({
      ...data,
      version: 5
    });
  }

  migrateV3(data) {
    return this.mergeDefaults({
      ...data,
      version: 5
    });
  }

  migrateV2(data) {
    return this.mergeDefaults({
      ...data,
      version: 5
    });
  }

  migrateV1(data) {
    const migrated = createDefaultSave();
    migrated.totalCoins = Number(data.totalCoins ?? 0);
    migrated.selectedCar = data.selectedCar ?? migrated.selectedCar;
    migrated.completedMissions = { ...(data.completedMissions ?? {}) };
    migrated.bestScores = { ...(data.bestScores ?? {}) };
    migrated.discoveries.landmarks = { ...(data.discoveredLandmarks ?? {}) };
    migrated.discoveredLandmarks = { ...(data.discoveredLandmarks ?? {}) };
    migrated.collectedCoins = { ...(data.collectedCoins ?? {}) };
    migrated.stats.totalDistance = Number(data.totalDistance ?? 0);
    migrated.stats.totalDriftScore = Number(data.totalDriftScore ?? 0);
    migrated.settings = this.normalizeSettings(data.settings ?? {});
    return this.mergeDefaults(migrated);
  }

  mergeDefaults(data) {
    const defaults = createDefaultSave();
    const merged = {
      ...defaults,
      ...data,
      license: { ...defaults.license, ...(data.license ?? {}) },
      completedMissions: { ...defaults.completedMissions, ...(data.completedMissions ?? {}) },
      bestScores: { ...defaults.bestScores, ...(data.bestScores ?? {}) },
      bestTimes: { ...defaults.bestTimes, ...(data.bestTimes ?? {}) },
      medals: { ...defaults.medals, ...(data.medals ?? {}) },
      discoveries: {
        landmarks: {
          ...defaults.discoveries.landmarks,
          ...(data.discoveries?.landmarks ?? data.discoveredLandmarks ?? {})
        },
        districts: { ...defaults.discoveries.districts, ...(data.discoveries?.districts ?? {}) },
        hiddenTokens: { ...defaults.discoveries.hiddenTokens, ...(data.discoveries?.hiddenTokens ?? {}) }
      },
      discoveredLandmarks: {
        ...defaults.discoveredLandmarks,
        ...(data.discoveredLandmarks ?? data.discoveries?.landmarks ?? {})
      },
      collectedCoins: { ...defaults.collectedCoins, ...(data.collectedCoins ?? {}) },
      achievements: { ...defaults.achievements, ...(data.achievements ?? {}) },
      customizations: { ...defaults.customizations, ...(data.customizations ?? {}) },
      carMastery: { ...defaults.carMastery, ...(data.carMastery ?? {}) },
      carTuning: { ...defaults.carTuning, ...(data.carTuning ?? {}) },
      career: {
        completed: { ...defaults.career.completed, ...(data.career?.completed ?? {}) },
        activeCareerMission: data.career?.activeCareerMission ?? null,
        pathProgress: { ...defaults.career.pathProgress, ...(data.career?.pathProgress ?? {}) }
      },
      bonusObjectives: { ...defaults.bonusObjectives, ...(data.bonusObjectives ?? {}) },
      cityEvents: {
        completed: { ...defaults.cityEvents.completed, ...(data.cityEvents?.completed ?? {}) },
        lastEventId: data.cityEvents?.lastEventId ?? null
      },
      freeDriveTasks: {
        completed: { ...defaults.freeDriveTasks.completed, ...(data.freeDriveTasks?.completed ?? {}) },
        activeTaskId: data.freeDriveTasks?.activeTaskId ?? null,
        progress: { ...defaults.freeDriveTasks.progress, ...(data.freeDriveTasks?.progress ?? {}) }
      },
      debugSettings: { ...defaults.debugSettings, ...(data.debugSettings ?? {}) },
      stats: { ...defaults.stats, ...(data.stats ?? {}) },
      settings: this.normalizeSettings(data.settings ?? {})
    };
    merged.license.levelId = getLicenseForXp(merged.license.xp).id;
    merged.version = 5;
    merged.stats.favoriteCar = this.getFavoriteCarFromStats(merged.stats.favoriteCarUse, merged.selectedCar);
    return merged;
  }

  normalizeSettings(settings) {
    const normalized = { ...DEFAULT_SETTINGS, ...settings };
    if (typeof normalized.cameraShake === 'boolean') {
      normalized.cameraShake = normalized.cameraShake ? 'normal' : 'off';
    }
    if (normalized.radar !== undefined && normalized.minimap === undefined) {
      normalized.minimap = Boolean(normalized.radar);
    }
    if (!['off', 'low', 'medium', 'high'].includes(normalized.trafficDensity)) {
      normalized.trafficDensity = 'low';
    }
    if (!['off', 'low', 'normal'].includes(normalized.cameraShake)) {
      normalized.cameraShake = 'normal';
    }
    if (!['standard', 'far', 'hood', 'cockpit'].includes(normalized.cameraMode)) {
      normalized.cameraMode = 'standard';
    }
    if (!['off', 'low', 'normal'].includes(normalized.cockpitMotion)) {
      normalized.cockpitMotion = 'normal';
    }
    if (!['minimal', 'normal'].includes(normalized.cockpitHud)) {
      normalized.cockpitHud = 'minimal';
    }
    if (!['low', 'normal', 'wide'].includes(normalized.cockpitFov)) {
      normalized.cockpitFov = 'normal';
    }
    if (!['off', 'geometry'].includes(normalized.mirrorRendering)) {
      normalized.mirrorRendering = 'geometry';
    }
    normalized.dashboardBrightness = Math.min(1.2, Math.max(0.35, Number(normalized.dashboardBrightness ?? 0.9)));
    normalized.cockpitHintSeen = Boolean(normalized.cockpitHintSeen);
    return normalized;
  }

  getFavoriteCarFromStats(usage, fallback) {
    let favorite = fallback;
    let best = -1;
    Object.entries(usage ?? {}).forEach(([carId, count]) => {
      if (count > best) {
        favorite = carId;
        best = count;
      }
    });
    return favorite;
  }

  persist() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
    } catch {
      // Local save failure should never break play.
    }
  }

  get settings() {
    return this.data.settings;
  }

  updateSettings(patch) {
    this.data.settings = this.normalizeSettings({ ...this.data.settings, ...patch });
    this.data.debugSettings.overlay = Boolean(this.data.settings.debugOverlay);
    this.persist();
  }

  setSelectedCar(id) {
    this.data.selectedCar = id;
    this.data.stats.favoriteCarUse[id] = (this.data.stats.favoriteCarUse[id] ?? 0) + 1;
    this.data.stats.favoriteCar = this.getFavoriteCarFromStats(this.data.stats.favoriteCarUse, id);
    this.persist();
  }

  getCustomization(carId) {
    return {
      ...DEFAULT_CUSTOMIZATION,
      ...(this.data.customizations[carId] ?? {})
    };
  }

  setCustomization(carId, customization) {
    this.data.customizations[carId] = {
      ...this.getCustomization(carId),
      ...customization
    };
    this.persist();
  }

  resetCustomization(carId) {
    this.data.customizations[carId] = safeClone(DEFAULT_CUSTOMIZATION);
    this.persist();
  }

  getCarTuning(carId) {
    return {
      ...createDefaultTuning(),
      ...(this.data.carTuning[carId] ?? {})
    };
  }

  setCarTuning(carId, tuning) {
    this.data.carTuning[carId] = {
      ...this.getCarTuning(carId),
      ...tuning
    };
    this.persist();
  }

  resetCarTuning(carId) {
    this.data.carTuning[carId] = createDefaultTuning();
    this.persist();
  }

  spendCoins(amount) {
    const value = Math.max(0, Math.round(amount));
    if (this.data.totalCoins < value) return false;
    this.data.totalCoins -= value;
    this.persist();
    return true;
  }

  addCoins(amount) {
    const value = Math.max(0, Math.round(amount));
    this.data.totalCoins += value;
    this.data.stats.totalCoinsCollected += value;
    this.persist();
    return value;
  }

  addXP(amount) {
    const value = Math.max(0, Math.round(amount));
    if (!value) return null;
    const before = getLicenseForXp(this.data.license.xp);
    this.data.license.xp += value;
    const after = getLicenseForXp(this.data.license.xp);
    this.data.license.levelId = after.id;
    this.data.stats.highestLicenseLevel = after.id;
    this.persist();
    if (before.id !== after.id) return after;
    return null;
  }

  collectCoin(id, value, xp = 1, oneTime = false) {
    if (oneTime && this.data.collectedCoins[id]) return false;
    if (oneTime) this.data.collectedCoins[id] = true;
    this.addCoins(value);
    this.addXP(xp);
    return true;
  }

  collectHiddenToken(id, coins, xp) {
    if (this.data.discoveries.hiddenTokens[id]) return false;
    this.data.discoveries.hiddenTokens[id] = true;
    this.addCoins(coins);
    this.addXP(xp);
    this.persist();
    return true;
  }

  discoverDistrict(id, reward, xp) {
    if (this.data.discoveries.districts[id]) return false;
    this.data.discoveries.districts[id] = true;
    this.addCoins(reward);
    this.addXP(xp);
    this.persist();
    return true;
  }

  discoverLandmark(id, reward, xp) {
    if (this.data.discoveries.landmarks[id]) return false;
    this.data.discoveries.landmarks[id] = true;
    this.data.discoveredLandmarks[id] = true;
    this.addCoins(reward);
    this.addXP(xp);
    this.persist();
    return true;
  }

  addDistance(distance, clean = true) {
    const value = Math.max(0, distance);
    this.data.stats.totalDistance += value;
    this.data.totalDistance = this.data.stats.totalDistance;
    if (clean) this.data.stats.totalCleanDistance += value;
    if (value > 0.01) this.persist();
  }

  addCrash() {
    this.data.stats.totalCrashes += 1;
    this.persist();
  }

  addDriftScore(score) {
    const value = Math.max(0, Math.round(score));
    this.data.stats.totalDriftScore += value;
    this.data.totalDriftScore = this.data.stats.totalDriftScore;
    this.persist();
  }

  getCarMastery(carId) {
    return {
      xp: 0,
      levelUpsSeen: {},
      bestMissions: {},
      ...(this.data.carMastery[carId] ?? {})
    };
  }

  addCarMasteryXp(carId, amount) {
    const value = Math.max(0, Math.round(amount));
    if (!value) return this.getCarMastery(carId);
    const mastery = this.getCarMastery(carId);
    mastery.xp += value;
    this.data.carMastery[carId] = mastery;
    this.persist();
    return mastery;
  }

  recordCarMissionBest(carId, missionId, score) {
    const mastery = this.getCarMastery(carId);
    mastery.bestMissions[missionId] = Math.max(mastery.bestMissions[missionId] ?? 0, Math.round(score));
    this.data.carMastery[carId] = mastery;
    this.persist();
  }

  recordMission(id, score, coins, details = {}) {
    const roundedScore = Math.round(score);
    const previous = this.data.bestScores[id] ?? 0;
    this.data.completedMissions[id] = (this.data.completedMissions[id] ?? 0) + 1;
    this.data.bestScores[id] = Math.max(previous, roundedScore);
    this.data.stats.missionsCompleted += details.success === false ? 0 : 1;

    if (details.type === 'delivery') this.data.stats.deliveriesCompleted += 1;
    if (details.type === 'taxi') this.data.stats.taxiRidesCompleted += 1;
    if (details.type === 'parking') this.data.stats.parkingCompleted += 1;
    if (details.type === 'timeTrial') this.data.stats.timeTrialsCompleted += 1;
    if (details.type === 'drift') this.data.stats.driftZonesCompleted += 1;

    if (typeof details.timeSeconds === 'number') {
      const best = this.data.bestTimes[id];
      this.data.bestTimes[id] = best === undefined ? details.timeSeconds : Math.min(best, details.timeSeconds);
    }
    if (details.medal) this.data.medals[id] = details.medal;
    if (details.bonusObjectives) this.data.bonusObjectives[id] = details.bonusObjectives;
    if (details.carId) this.recordCarMissionBest(details.carId, id, score);

    this.addCoins(coins);
    const levelUp = this.addXP(details.xp ?? 0);
    this.persist();
    return { isBest: roundedScore > previous, levelUp };
  }

  completeCareerMission(careerId, result = {}) {
    const before = Boolean(this.data.career.completed[careerId]);
    this.data.career.completed[careerId] = {
      completedAt: Date.now(),
      medal: result.medal ?? null,
      score: Math.round(result.score ?? 0)
    };
    this.persist();
    return !before;
  }

  completeCityEvent(id) {
    this.data.cityEvents.completed[id] = (this.data.cityEvents.completed[id] ?? 0) + 1;
    this.data.cityEvents.lastEventId = id;
    this.persist();
  }

  completeFreeDriveTask(id) {
    this.data.freeDriveTasks.completed[id] = true;
    this.persist();
  }

  unlockAchievement(id) {
    if (this.data.achievements[id]) return null;
    const achievement = ACHIEVEMENTS.find((item) => item.id === id);
    if (!achievement) return null;
    this.data.achievements[id] = {
      unlockedAt: Date.now()
    };
    this.addCoins(achievement.coins);
    const levelUp = this.addXP(achievement.xp);
    this.persist();
    return { achievement, levelUp };
  }

  setOnboardingComplete(value = true) {
    this.data.onboardingComplete = value;
    this.persist();
  }

  resetProgress() {
    this.data = createDefaultSave();
    this.persist();
  }
}
