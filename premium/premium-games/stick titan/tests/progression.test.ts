import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  applyMatchResult,
  canPurchaseUpgrade,
  createDefaultProfile,
  createEmptyMatchStats,
  exportProfileData,
  getModeAvailability,
  getDateKey,
  getWeekKey,
  importProfileData,
  loadProgressionState,
  purchaseCoinSkin,
  purchaseUpgrade,
  registerCloudSyncHandler,
  refreshProfile,
  resetProfile,
  resetUpgrades,
  requestTutorialReplay,
  saveProfile,
  selectGameMode,
  setSelectedStage,
  setThemeMode,
  updateSettings,
} from '../src/game/progression';

describe('progression rewards and unlocks', () => {
  it('applies performance bonuses, streak multipliers, and challenge unlocks', () => {
    const profile = createDefaultProfile(new Date('2026-04-12T00:00:00Z'));
    profile.level = 4;
    profile.xp = 170;
    profile.dailyStreak.streakCount = 3;

    const stats = createEmptyMatchStats('titan');
    stats.outcome = 'win';
    stats.durationSeconds = 140;
    stats.damageTaken = 0;
    stats.hazardDamageTaken = 0;
    stats.fullComboChains = 3;
    stats.finisherUsed = true;
    stats.damageByWeapon = { sword: 120, gun: 48, power: 34 };
    stats.weaponsUsed = { sword: true, gun: true, power: true };
    stats.dashesUsed = 3;

    const summary = applyMatchResult(profile, stats);

    expect(summary.rewards.totalCoins).toBe(292);
    expect(summary.rewards.totalXp).toBe(208);
    expect(summary.levelAfter).toBe(6);
    expect(summary.rankAfter.id).toBe('fighter');
    expect(summary.challengeTiersUnlocked.map((tier) => tier.id)).toContain('ruthless');
    expect(summary.achievementsUnlocked.map((achievement) => achievement.id)).toEqual(
      expect.arrayContaining(['perfect_form', 'speed_hunter', 'combo_discipline', 'arsenal_sweep', 'hazard_dancer']),
    );
  });
});

describe('upgrades and respec', () => {
  it('enforces level-based caps and refunds invested coins on respec', () => {
    const profile = createDefaultProfile();
    profile.coins = 500;
    profile.upgradePoints = 3;

    expect(canPurchaseUpgrade(profile, 'ferocity')).toBe(true);
    expect(purchaseUpgrade(profile, 'ferocity')).toBe(true);
    expect(canPurchaseUpgrade(profile, 'ferocity')).toBe(false);
    expect(profile.coins).toBe(380);
    expect(profile.upgradePoints).toBe(2);

    resetUpgrades(profile);
    expect(profile.coins).toBe(500);
    expect(profile.upgradePoints).toBe(3);
    expect(profile.upgrades.ferocity).toBe(0);
  });
});

describe('daily refresh and missions', () => {
  it('refreshes streak rewards and rolls over daily and weekly missions', () => {
    const sunday = new Date('2026-04-12T00:00:00Z');
    const monday = new Date('2026-04-13T00:00:00Z');
    const profile = createDefaultProfile(sunday);

    profile.dailyStreak.lastClaimDate = getDateKey(sunday);
    profile.dailyStreak.streakCount = 1;
    profile.dailyStreak.cycleDay = 1;
    profile.dailyMissionDate = getDateKey(sunday);
    profile.weeklyMissionWeek = getWeekKey(sunday);

    const reward = refreshProfile(profile, monday);

    expect(reward).toBe(75);
    expect(profile.dailyStreak.streakCount).toBe(2);
    expect(profile.dailyMissions).toHaveLength(3);
    expect(profile.weeklyMissions).toHaveLength(3);
    expect(profile.weeklyMissionWeek).toBe(getWeekKey(monday));
  });
});

describe('weapon mastery', () => {
  it('levels only the matching weapon and unlocks mastery cosmetics', () => {
    const profile = createDefaultProfile();
    profile.weaponMastery.gun.level = 9;
    profile.weaponMastery.gun.xp = 240;

    const stats = createEmptyMatchStats('standard');
    stats.outcome = 'win';
    stats.damageByWeapon.gun = 100;
    stats.weaponsUsed.gun = true;

    const summary = applyMatchResult(profile, stats);

    expect(profile.weaponMastery.gun.level).toBe(10);
    expect(profile.weaponMastery.sword.level).toBe(1);
    expect(summary.skinsUnlocked.map((skin) => skin.id)).toContain('gun_lattice');
    expect(summary.titlesUnlocked.map((title) => title.id)).toContain('deadeye_arc');
  });
});

describe('profile loading', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    registerCloudSyncHandler(null);
  });

  it('falls back to a safe default profile when stored data is corrupted', () => {
    const storage = {
      getItem: vi.fn(() => '{not-valid-json'),
      setItem: vi.fn(),
    };

    vi.stubGlobal('window', { localStorage: storage });

    const result = loadProgressionState(new Date('2026-04-12T00:00:00Z'));

    expect(result.dailyRewardCoins).toBe(50);
    expect(result.profile.selectedSkinId).toBe('classic_azure');
    expect(result.profile.unlockedChallengeTiers).toEqual(['standard']);
    expect(result.profile.dailyMissions).toHaveLength(3);
    expect(result.profile.weeklyMissions).toHaveLength(3);
    expect(storage.setItem).toHaveBeenCalled();
  });

  it('falls back safely when local storage access throws', () => {
    const storage = {
      getItem: vi.fn(() => {
        throw new Error('blocked');
      }),
      setItem: vi.fn(() => {
        throw new Error('blocked');
      }),
    };

    vi.stubGlobal('window', { localStorage: storage });

    const result = loadProgressionState(new Date('2026-04-12T00:00:00Z'));

    expect(result.profile.selectedSkinId).toBe('classic_azure');
    expect(result.profile.profileVersion).toBeGreaterThanOrEqual(4);
  });
});

describe('cloud sync bridge', () => {
  afterEach(() => {
    registerCloudSyncHandler(null);
  });

  it('invokes the registered cloud sync handler after local save', async () => {
    const profile = createDefaultProfile(new Date('2026-04-15T00:00:00Z'));
    profile.coins = 420;
    const handler = vi.fn();

    registerCloudSyncHandler(handler);
    saveProfile(profile);
    await Promise.resolve();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0]?.[0]?.coins).toBe(420);
    expect(handler.mock.calls[0]?.[0]?.lastUpdated).toBeGreaterThan(0);
  });
});

describe('menu-ready progression data', () => {
  it('supports gem skin purchases and mode availability transitions', () => {
    const profile = createDefaultProfile();
    profile.gems = 200;

    expect(getModeAvailability(profile, 'survival')).toBe('locked');
    expect(purchaseCoinSkin(profile, 'neon_revenant')).toBe(true);
    expect(profile.gems).toBe(110);
    expect(profile.unlockedSkins).toContain('neon_revenant');

    profile.level = 10;
    refreshProfile(profile, new Date('2026-04-14T00:00:00Z'));
    expect(getModeAvailability(profile, 'survival')).toBe('available');
    expect(selectGameMode(profile, 'boss_battle')).toBe(true);
    expect(profile.lastSelectedMode).toBe('boss_battle');
  });

  it('defaults to dark theme and persists light theme changes', () => {
    const profile = createDefaultProfile();
    expect(profile.themeMode).toBe('dark');

    setThemeMode(profile, 'light');
    expect(profile.themeMode).toBe('light');

    refreshProfile(profile, new Date('2026-04-15T00:00:00Z'));
    expect(profile.themeMode).toBe('light');
  });

  it('persists settings and tutorial replay state in the profile', () => {
    const profile = createDefaultProfile();

    updateSettings(profile, {
      masterVolume: 75,
      screenShake: 50,
      difficultyAssist: 'forgiving',
    });
    requestTutorialReplay(profile);
    setSelectedStage(profile, 'temple_court');
    refreshProfile(profile, new Date('2026-04-15T00:00:00Z'));

    expect(profile.profileVersion).toBeGreaterThanOrEqual(4);
    expect(profile.settings.masterVolume).toBe(75);
    expect(profile.settings.screenShake).toBe(50);
    expect(profile.settings.difficultyAssist).toBe('forgiving');
    expect(profile.tutorialState.replayRequested).toBe(true);
    expect(profile.selectedStageId).toBe('temple_court');
  });

  it('exports, imports, and resets local save data safely', () => {
    const profile = createDefaultProfile(new Date('2026-04-15T00:00:00Z'));
    profile.level = 12;
    profile.coins = 640;
    profile.selectedStageId = 'sunset_rooftop';
    profile.settings.masterVolume = 50;

    const exported = exportProfileData(profile);
    const imported = importProfileData(exported, new Date('2026-04-16T00:00:00Z'));

    expect(imported.level).toBe(12);
    expect(imported.coins).toBeGreaterThanOrEqual(640);
    expect(imported.selectedStageId).toBe('sunset_rooftop');
    expect(imported.settings.masterVolume).toBe(50);

    const reset = resetProfile(new Date('2026-04-16T00:00:00Z'));
    expect(reset.level).toBe(1);
    expect(reset.selectedStageId).toBe('neon_hangar');
  });
});
