import { DEFAULT_ROUTE_ID, getNextRoute, getRouteById, ROUTE_CONFIGS } from './RouteConfig';
import { ProgressSystem } from './ProgressSystem';
import type {
  CosmeticId,
  DailyChallenge,
  GameSettings,
  ProgressUpdateResult,
  RouteConfig,
  RouteId,
  RunSummary,
  SaveData,
  SkinId,
  UpgradeId,
  WeaponStyleId
} from './types';

export class RouteManager {
  private selectedRouteId: RouteId = DEFAULT_ROUTE_ID;
  private dailyChallenge: DailyChallenge | null = null;

  constructor(private readonly progress: ProgressSystem) {}

  get currentRoute(): RouteConfig {
    return getRouteById(this.selectedRouteId);
  }

  get progressSnapshot(): SaveData {
    return this.progress.snapshot;
  }

  get settings(): GameSettings {
    return this.progress.settings;
  }

  get currentDailyChallenge(): DailyChallenge | null {
    return this.dailyChallenge;
  }

  get isDailyRun(): boolean {
    return Boolean(this.dailyChallenge);
  }

  canStart(routeId: RouteId): boolean {
    const route = getRouteById(routeId);
    return route.playable && this.progress.isRouteUnlocked(routeId);
  }

  startRoute(routeId: RouteId): RouteConfig | null {
    if (!this.canStart(routeId)) {
      return null;
    }

    this.selectedRouteId = routeId;
    this.dailyChallenge = null;
    return this.currentRoute;
  }

  startDailyChallenge(challenge: DailyChallenge): RouteConfig {
    this.selectedRouteId = challenge.routeId;
    this.dailyChallenge = challenge;
    return this.currentRoute;
  }

  retryCurrentRoute(): RouteConfig {
    return this.currentRoute;
  }

  getNextPlayableRoute(): RouteConfig | null {
    const next = getNextRoute(this.selectedRouteId);
    if (!next || !this.canStart(next.id)) {
      return null;
    }

    return next;
  }

  recordRun(summary: RunSummary, completedObjectiveIds: string[]): ProgressUpdateResult {
    return this.progress.recordRun(this.currentRoute, summary, completedObjectiveIds, {
      dailyChallenge: this.dailyChallenge ?? undefined
    });
  }

  updateSettings(settings: Partial<GameSettings>): SaveData {
    this.progress.updateSettings(settings);
    return this.progressSnapshot;
  }

  resetProgress(): SaveData {
    this.selectedRouteId = DEFAULT_ROUTE_ID;
    this.dailyChallenge = null;
    return this.progress.reset();
  }

  debugUnlockAllRoutes(): SaveData {
    return this.progress.debugUnlockAllRoutes();
  }

  purchaseUpgrade(id: UpgradeId): SaveData {
    this.progress.purchaseUpgrade(id);
    return this.progressSnapshot;
  }

  unlockOrEquipWeapon(id: WeaponStyleId): SaveData {
    this.progress.unlockOrEquipWeapon(id);
    return this.progressSnapshot;
  }

  equipSkin(id: SkinId): SaveData {
    this.progress.equipSkin(id);
    return this.progressSnapshot;
  }

  unlockOrEquipCosmetic(id: CosmeticId): SaveData {
    this.progress.unlockOrEquipCosmetic(id);
    return this.progressSnapshot;
  }

  getRouteLabel(routeId: RouteId): string {
    return ROUTE_CONFIGS.find((route) => route.id === routeId)?.displayName ?? routeId;
  }
}
