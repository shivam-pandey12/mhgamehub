import { ACHIEVEMENT_CONFIGS } from './AchievementConfig';
import { getDailyChallenge } from './DailyChallengeSystem';
import { DIFFICULTY_PROFILES, ROUTE_CONFIGS } from './RouteConfig';
import { COSMETIC_CONFIGS, SKIN_CONFIGS, WEAPON_STYLE_CONFIGS } from './GearConfig';
import { getUpgradeCost, UPGRADE_CONFIGS } from './UpgradeConfig';
import type {
  AchievementId,
  CosmeticId,
  DailyChallenge,
  GameSettings,
  RouteConfig,
  RouteId,
  RunSummary,
  SaveData,
  SkinId,
  UpgradeId,
  WeaponStyleId
} from './types';

type GearTab = 'upgrades' | 'weapons' | 'skins' | 'cosmetics' | 'achievements';

interface MenuCallbacks {
  playFirstRoute: () => void;
  startRoute: (routeId: RouteId) => void;
  startDailyChallenge: () => void;
  openMain: () => void;
  openLevelSelect: () => void;
  openControls: () => void;
  openSettings: () => void;
  openGearRoom: () => void;
  openRecords: () => void;
  openDailyChallenge: () => void;
  purchaseUpgrade: (upgradeId: UpgradeId) => void;
  unlockOrEquipWeapon: (weaponId: WeaponStyleId) => void;
  equipSkin: (skinId: SkinId) => void;
  unlockOrEquipCosmetic: (cosmeticId: CosmeticId) => void;
  retryRoute: () => void;
  nextRoute: () => void;
  resume: () => void;
  resetProgress: () => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  playUiSound?: (eventName: 'menuClick' | 'menuHover') => void;
}

export class MenuSystem {
  private readonly root = document.createElement('div');
  private callbacks: MenuCallbacks | null = null;
  private progress: SaveData | null = null;
  private settings: GameSettings | null = null;
  private activeGearTab: GearTab = 'upgrades';

  constructor(host: HTMLElement) {
    this.root.className = 'menu-shell';
    this.root.addEventListener('click', this.onClick);
    this.root.addEventListener('pointerover', this.onPointerOver);
    host.appendChild(this.root);
  }

  setCallbacks(callbacks: MenuCallbacks): void {
    this.callbacks = callbacks;
  }

  setProgress(progress: SaveData): void {
    this.progress = progress;
    this.settings = progress.settings;
  }

  setComfortSettings(settings: GameSettings): void {
    this.root.style.setProperty('--ui-scale', `${settings.uiScale}`);
    this.root.classList.toggle('is-reduced-motion', settings.reducedMotion);
  }

  showMain(): void {
    this.root.classList.add('is-visible');
    this.root.innerHTML = `
      <div class="menu menu--main">
        <div class="menu__brand">
          <span>Phase 5 Early Access Loop</span>
          <h1>Train Roof Rush</h1>
          <p>Choose routes, clear daily challenges, upgrade your runner, unlock loadouts, and chase better records across the rail network.</p>
        </div>
        ${this.renderDailyMiniCard()}
        <div class="menu__actions">
          <button data-action="play">Play</button>
          <button data-action="start-daily">Daily Challenge</button>
          <button data-action="level-select">Level Select</button>
          <button data-action="gear-room">Gear Room</button>
          <button data-action="records">Records</button>
          <button data-action="controls">Controls</button>
          <button data-action="settings">Settings</button>
        </div>
        ${this.renderProgressStrip()}
      </div>
    `;
  }

  showLevelSelect(): void {
    this.root.classList.add('is-visible');
    this.root.innerHTML = `
      <div class="menu menu--wide">
        <div class="menu__header">
          <div>
            <span>Route Select</span>
            <h2>Rail Network</h2>
          </div>
          <button class="menu__ghost" data-action="main-menu">Main Menu</button>
        </div>
        ${this.renderDailyMiniCard()}
        <div class="route-grid">
          ${ROUTE_CONFIGS.map((route) => this.renderRouteCard(route)).join('')}
        </div>
      </div>
    `;
  }

  showDailyChallenge(challenge: DailyChallenge): void {
    const route = ROUTE_CONFIGS.find((item) => item.id === challenge.routeId) ?? ROUTE_CONFIGS[0];
    const record = this.progress?.daily.today?.challengeId === challenge.id ? this.progress.daily.today : null;
    this.root.classList.add('is-visible');
    this.root.innerHTML = `
      <div class="menu menu--panel">
        <div class="menu__header">
          <div>
            <span>${challenge.dateKey}</span>
            <h2>${challenge.displayName}</h2>
          </div>
          <button class="menu__ghost" data-action="main-menu">Back</button>
        </div>
        <div class="daily-card daily-card--${route.biome}">
          <div class="daily-card__meta">
            <span>${this.formatBiome(route.biome)}</span>
            <strong>${DIFFICULTY_PROFILES[challenge.difficulty].label}</strong>
          </div>
          <h3>${route.displayName}</h3>
          <p>${challenge.objectiveLabel}</p>
          <div class="summary-grid summary-grid--compact">
            <div><span>Reward</span><strong>${challenge.rewardCoins} coins</strong></div>
            <div><span>Seed</span><strong>${challenge.seed}</strong></div>
            <div><span>Best Score</span><strong>${record?.bestScore ?? 0}</strong></div>
            <div><span>Completed</span><strong>${record?.completed ? 'Yes' : 'No'}</strong></div>
          </div>
          <button data-action="start-daily">Start Daily</button>
        </div>
      </div>
    `;
  }

  showControls(): void {
    this.root.classList.add('is-visible');
    this.root.innerHTML = `
      <div class="menu menu--panel">
        <div class="menu__header">
          <div>
            <span>Controls</span>
            <h2>Runner Inputs</h2>
          </div>
          <button class="menu__ghost" data-action="main-menu">Back</button>
        </div>
        <div class="control-list">
          ${[
            ['Move', 'A / D or Left / Right'],
            ['Jump gaps', 'Space'],
            ['Slide low hazards', 'S / Down'],
            ['Dash / dodge', 'Shift'],
            ['Attack', 'J / Left Click'],
            ['Special wave', 'E'],
            ['Pause', 'Esc'],
            ['Restart after fail', 'R / Enter']
          ]
            .map((row) => `<div><span>${row[0]}</span><strong>${row[1]}</strong></div>`)
            .join('')}
        </div>
      </div>
    `;
  }

  showSettings(): void {
    const settings =
      this.settings ?? {
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
      };
    this.root.classList.add('is-visible');
    this.root.innerHTML = `
      <div class="menu menu--panel">
        <div class="menu__header">
          <div>
            <span>Settings</span>
            <h2>Run Feel</h2>
          </div>
          <button class="menu__ghost" data-action="main-menu">Back</button>
        </div>
        <div class="settings-list">
          ${this.progress?.storageAvailable === false ? '<div class="storage-warning">Progress is running in memory because localStorage is unavailable.</div>' : ''}
          <div class="settings-row"><span>Sound volume</span><strong>${Math.round(settings.soundVolume * 100)}%</strong></div>
          <div class="settings-row"><span>Music volume</span><strong>${Math.round(settings.musicVolume * 100)}%</strong></div>
          <div class="settings-row"><span>Mute audio</span><button data-action="toggle-mute">${settings.mute ? 'On' : 'Off'}</button></div>
          <div class="settings-row"><span>Camera shake</span><button data-action="toggle-shake">${settings.cameraShake ? 'On' : 'Off'}</button></div>
          <div class="settings-row"><span>Control hints</span><button data-action="toggle-hints">${settings.showControlHints ? 'On' : 'Off'}</button></div>
          <div class="settings-row"><span>High contrast warnings</span><button data-action="toggle-contrast">${settings.highContrastWarnings ? 'On' : 'Off'}</button></div>
          <div class="settings-row"><span>Performance mode</span><button data-action="toggle-performance">${settings.performanceMode ? 'On' : 'Off'}</button></div>
          <div class="settings-row"><span>Reduced motion</span><button data-action="toggle-reduced-motion">${settings.reducedMotion ? 'On' : 'Off'}</button></div>
          <div class="settings-row">
            <span>Mobile controls</span>
            <div class="menu__segmented">
              ${(['auto', 'on', 'off'] as const)
                .map(
                  (value) =>
                    `<button class="${settings.mobileControls === value ? 'is-active' : ''}" data-action="set-mobile-controls" data-value="${value}">${value}</button>`
                )
                .join('')}
            </div>
          </div>
          <div class="settings-row">
            <span>UI scale</span>
            <div class="menu__segmented">
              ${[
                ['0.9', 'Small'],
                ['1', 'Normal'],
                ['1.1', 'Large']
              ]
                .map(
                  ([value, label]) =>
                    `<button class="${Math.abs(settings.uiScale - Number(value)) < 0.02 ? 'is-active' : ''}" data-action="set-ui-scale" data-value="${value}">${label}</button>`
                )
                .join('')}
            </div>
          </div>
          <div class="settings-row">
            <span>VFX intensity</span>
            <div class="menu__segmented">
              ${(['low', 'medium', 'high'] as const)
                .map(
                  (value) =>
                    `<button class="${settings.vfxIntensity === value ? 'is-active' : ''}" data-action="set-vfx" data-value="${value}">${value}</button>`
                )
                .join('')}
            </div>
          </div>
          <button class="menu__danger" data-action="reset-progress">Reset Progress</button>
        </div>
      </div>
    `;
  }

  showGearRoom(tab: GearTab = this.activeGearTab): void {
    this.activeGearTab = tab;
    this.root.classList.add('is-visible');
    this.root.innerHTML = `
      <div class="menu menu--wide">
        <div class="menu__header">
          <div>
            <span>Gear Room</span>
            <h2>Runner Lab</h2>
          </div>
          <button class="menu__ghost" data-action="main-menu">Main Menu</button>
        </div>
        <div class="gear-wallet">
          <span>Spendable Coins <strong>${this.progress?.totalCoins ?? 0}</strong></span>
          <span>Lifetime Coins <strong>${this.progress?.coinsLifetime ?? 0}</strong></span>
        </div>
        <div class="gear-tabs">
          ${(['upgrades', 'weapons', 'skins', 'cosmetics', 'achievements'] as GearTab[])
            .map((value) => `<button class="${tab === value ? 'is-active' : ''}" data-action="gear-tab" data-tab="${value}">${this.title(value)}</button>`)
            .join('')}
        </div>
        ${this.renderGearContent(tab)}
      </div>
    `;
  }

  showRecords(challenge: DailyChallenge): void {
    const achievementsComplete = ACHIEVEMENT_CONFIGS.filter((achievement) => this.progress?.achievements[achievement.id]?.completed).length;
    const totalEnemies = Object.values(this.progress?.records ?? {}).reduce((sum, record) => sum + record.enemiesDefeated, 0);
    const totalBosses = Object.values(this.progress?.records ?? {}).filter((record) => record.bossDefeated).length;
    const daily = this.progress?.daily.today?.challengeId === challenge.id ? this.progress.daily.today : null;
    this.root.classList.add('is-visible');
    this.root.innerHTML = `
      <div class="menu menu--wide">
        <div class="menu__header">
          <div>
            <span>Records</span>
            <h2>Local Score Vault</h2>
          </div>
          <button class="menu__ghost" data-action="main-menu">Main Menu</button>
        </div>
        <div class="records-strip">
          <span>Total Coins Earned <strong>${this.progress?.coinsLifetime ?? 0}</strong></span>
          <span>Enemies Record Sum <strong>${totalEnemies}</strong></span>
          <span>Boss Routes Cleared <strong>${totalBosses}</strong></span>
          <span>Achievements <strong>${achievementsComplete}/${ACHIEVEMENT_CONFIGS.length}</strong></span>
        </div>
        <div class="records-grid">
          ${ROUTE_CONFIGS.map((route) => this.renderRecordCard(route)).join('')}
          <article class="record-card record-card--daily">
            <span>Daily Challenge</span>
            <h3>${challenge.displayName}</h3>
            <p>${challenge.objectiveLabel}</p>
            <div class="route-card__stats">
              <span>Best Score <strong>${daily?.bestScore ?? 0}</strong></span>
              <span>Best Grade <strong>${daily?.bestGrade ?? '--'}</strong></span>
              <span>Completed <strong>${daily?.completed ? 'Yes' : 'No'}</strong></span>
            </div>
          </article>
        </div>
      </div>
    `;
  }

  showPause(): void {
    this.root.classList.add('is-visible');
    this.root.innerHTML = `
      <div class="menu menu--panel">
        <div class="menu__header">
          <div>
            <span>Paused</span>
            <h2>Run Suspended</h2>
          </div>
        </div>
        <div class="menu__actions">
          <button data-action="resume">Resume</button>
          <button data-action="retry">Restart Route</button>
          <button data-action="settings">Settings</button>
          <button data-action="level-select">Level Select</button>
          <button data-action="main-menu">Main Menu</button>
        </div>
      </div>
    `;
  }

  showSummary(summary: RunSummary, route: RouteConfig, nextRoute: RouteConfig | null): void {
    this.root.classList.add('is-visible');
    const unlocks = summary.newUnlocks?.map((routeId) => ROUTE_CONFIGS.find((routeConfig) => routeConfig.id === routeId)?.displayName ?? routeId) ?? [];
    const achievements = summary.achievementsUnlocked?.map((id) => ACHIEVEMENT_CONFIGS.find((achievement) => achievement.id === id)?.label ?? id) ?? [];
    const gearUnlocks = [
      ...(summary.weaponsUnlocked ?? []).map((id) => WEAPON_STYLE_CONFIGS.find((weapon) => weapon.id === id)?.label ?? id),
      ...(summary.skinsUnlocked ?? []).map((id) => SKIN_CONFIGS.find((skin) => skin.id === id)?.label ?? id),
      ...(summary.cosmeticsUnlocked ?? []).map((id) => COSMETIC_CONFIGS.find((cosmetic) => cosmetic.id === id)?.label ?? id)
    ];
    this.root.innerHTML = `
      <div class="menu menu--summary menu--banner-${this.progress?.equippedCosmetics.victoryBanner ?? 'bannerStandard'}">
        <div class="summary-hero">
          <span>${summary.isDaily ? summary.dailyChallenge?.displayName : `${route.displayName} / ${this.formatBiome(route.biome)}`}</span>
          <h2>${summary.victory ? 'Route Complete' : 'Run Summary'}</h2>
          <div class="summary-grade">${summary.grade}</div>
        </div>
        <div class="summary-grid">
          <div class="summary-grid__wide"><span>Run ended because</span><strong>${summary.endReason ?? 'Run ended.'}</strong></div>
          <div><span>Score</span><strong>${summary.score}</strong></div>
          <div><span>Distance</span><strong>${Math.floor(summary.distance)}m</strong></div>
          <div><span>Coins earned</span><strong>${summary.rewardCoins ?? summary.coins}</strong></div>
          <div><span>Enemies</span><strong>${summary.enemiesDefeated}</strong></div>
          <div><span>Objectives</span><strong>${summary.objectivesCompleted}/${summary.objectivesTotal}</strong></div>
          <div><span>${summary.tokenLabel ?? 'Tokens'}</span><strong>${summary.routeTokens ?? 0}/${summary.routeTokenTarget ?? route.tokenCount}</strong></div>
          <div><span>Boss</span><strong>${summary.bossDefeated ? 'Defeated' : 'Escaped'}</strong></div>
          <div><span>Best score</span><strong>${summary.bestScoreImproved || summary.dailyBestImproved ? 'Improved' : 'Held'}</strong></div>
        </div>
        ${summary.rewardBreakdown ? this.renderRewardBreakdown(summary.rewardBreakdown) : ''}
        ${unlocks.length > 0 ? `<div class="unlock-banner">Unlocked Routes: ${unlocks.join(', ')}</div>` : ''}
        ${gearUnlocks.length > 0 ? `<div class="unlock-banner">Gear Unlocked: ${gearUnlocks.join(', ')}</div>` : ''}
        ${achievements.length > 0 ? `<div class="achievement-banner">Achievements: ${achievements.join(', ')}</div>` : ''}
        <div class="menu__actions menu__actions--row">
          <button data-action="retry">Retry</button>
          <button ${nextRoute && !summary.isDaily ? '' : 'disabled'} data-action="next-route">Next Route</button>
          <button data-action="level-select">Level Select</button>
          <button data-action="main-menu">Main Menu</button>
        </div>
      </div>
    `;
  }

  hide(): void {
    this.root.classList.remove('is-visible');
    this.root.innerHTML = '';
  }

  dispose(): void {
    this.root.removeEventListener('click', this.onClick);
    this.root.removeEventListener('pointerover', this.onPointerOver);
    this.root.remove();
  }

  private readonly onClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement | null;
    const button = target?.closest<HTMLButtonElement>('button[data-action]');
    if (!button || button.disabled) {
      return;
    }

    this.callbacks?.playUiSound?.('menuClick');
    const action = button.dataset.action;
    if (action === 'play') {
      this.callbacks?.playFirstRoute();
    } else if (action === 'level-select') {
      this.callbacks?.openLevelSelect();
    } else if (action === 'controls') {
      this.callbacks?.openControls();
    } else if (action === 'settings') {
      this.callbacks?.openSettings();
    } else if (action === 'gear-room') {
      this.callbacks?.openGearRoom();
    } else if (action === 'records') {
      this.callbacks?.openRecords();
    } else if (action === 'daily') {
      this.callbacks?.openDailyChallenge();
    } else if (action === 'start-daily') {
      this.callbacks?.startDailyChallenge();
    } else if (action === 'main-menu') {
      this.callbacks?.openMain();
    } else if (action === 'start-route') {
      this.callbacks?.startRoute(button.dataset.route as RouteId);
    } else if (action === 'retry') {
      this.callbacks?.retryRoute();
    } else if (action === 'next-route') {
      this.callbacks?.nextRoute();
    } else if (action === 'resume') {
      this.callbacks?.resume();
    } else if (action === 'gear-tab') {
      this.showGearRoom(button.dataset.tab as GearTab);
    } else if (action === 'buy-upgrade') {
      this.callbacks?.purchaseUpgrade(button.dataset.upgrade as UpgradeId);
    } else if (action === 'weapon-action') {
      this.callbacks?.unlockOrEquipWeapon(button.dataset.weapon as WeaponStyleId);
    } else if (action === 'skin-action') {
      this.callbacks?.equipSkin(button.dataset.skin as SkinId);
    } else if (action === 'cosmetic-action') {
      this.callbacks?.unlockOrEquipCosmetic(button.dataset.cosmetic as CosmeticId);
    } else if (action === 'reset-progress') {
      if (window.confirm('Reset all local Train Roof Rush progress?')) {
        this.callbacks?.resetProgress();
      }
    } else if (action === 'toggle-mute') {
      this.callbacks?.updateSettings({ mute: !(this.settings?.mute ?? false) });
    } else if (action === 'toggle-shake') {
      this.callbacks?.updateSettings({ cameraShake: !(this.settings?.cameraShake ?? true) });
    } else if (action === 'toggle-hints') {
      this.callbacks?.updateSettings({ showControlHints: !(this.settings?.showControlHints ?? true) });
    } else if (action === 'toggle-contrast') {
      this.callbacks?.updateSettings({ highContrastWarnings: !(this.settings?.highContrastWarnings ?? false) });
    } else if (action === 'toggle-performance') {
      this.callbacks?.updateSettings({ performanceMode: !(this.settings?.performanceMode ?? false) });
    } else if (action === 'toggle-reduced-motion') {
      this.callbacks?.updateSettings({ reducedMotion: !(this.settings?.reducedMotion ?? false) });
    } else if (action === 'set-mobile-controls') {
      this.callbacks?.updateSettings({ mobileControls: button.dataset.value as GameSettings['mobileControls'] });
    } else if (action === 'set-ui-scale') {
      this.callbacks?.updateSettings({ uiScale: Number(button.dataset.value ?? 1) });
    } else if (action === 'set-vfx') {
      this.callbacks?.updateSettings({ vfxIntensity: button.dataset.value as GameSettings['vfxIntensity'] });
    }
  };

  private readonly onPointerOver = (event: PointerEvent): void => {
    const target = event.target as HTMLElement | null;
    const button = target?.closest<HTMLButtonElement>('button[data-action]');
    if (!button || button.disabled) {
      return;
    }

    this.callbacks?.playUiSound?.('menuHover');
  };

  private renderGearContent(tab: GearTab): string {
    if (tab === 'upgrades') {
      return `<div class="gear-grid">${UPGRADE_CONFIGS.map((upgrade) => this.renderUpgradeCard(upgrade.id)).join('')}</div>`;
    }

    if (tab === 'weapons') {
      return `<div class="gear-grid">${WEAPON_STYLE_CONFIGS.map((weapon) => this.renderWeaponCard(weapon.id)).join('')}</div>`;
    }

    if (tab === 'skins') {
      return `<div class="gear-grid">${SKIN_CONFIGS.map((skin) => this.renderSkinCard(skin.id)).join('')}</div>`;
    }

    if (tab === 'cosmetics') {
      return `<div class="gear-grid">${COSMETIC_CONFIGS.map((cosmetic) => this.renderCosmeticCard(cosmetic.id)).join('')}</div>`;
    }

    return `<div class="gear-grid">${ACHIEVEMENT_CONFIGS.map((achievement) => this.renderAchievementCard(achievement.id)).join('')}</div>`;
  }

  private renderUpgradeCard(id: UpgradeId): string {
    const config = UPGRADE_CONFIGS.find((upgrade) => upgrade.id === id)!;
    const level = this.progress?.upgrades[id] ?? 0;
    const cost = getUpgradeCost(id, level);
    const affordable = cost !== null && (this.progress?.totalCoins ?? 0) >= cost;
    return `
      <article class="gear-card">
        <span>Level ${level}/${config.maxLevel}</span>
        <h3>${config.label}</h3>
        <p>${config.description}</p>
        <strong>${config.benefit}</strong>
        <button ${cost === null || !affordable ? 'disabled' : ''} data-action="buy-upgrade" data-upgrade="${id}">
          ${cost === null ? 'Maxed' : `Upgrade ${cost}`}
        </button>
      </article>
    `;
  }

  private renderWeaponCard(id: WeaponStyleId): string {
    const config = WEAPON_STYLE_CONFIGS.find((weapon) => weapon.id === id)!;
    const unlocked = this.progress?.unlockedWeapons.includes(id) ?? false;
    const equipped = this.progress?.equippedWeapon === id;
    const affordable = Boolean(config.coinCost && (this.progress?.totalCoins ?? 0) >= config.coinCost);
    return `
      <article class="gear-card gear-card--weapon">
        <span>${equipped ? 'Equipped' : unlocked ? 'Unlocked' : 'Locked'}</span>
        <h3>${config.label}</h3>
        <p>${config.description}</p>
        <div class="gear-card__stats">
          <strong>${Math.round(config.damageMultiplier * 100)}% damage</strong>
          <strong>${Math.round(config.rangeMultiplier * 100)}% range</strong>
        </div>
        <small>${config.unlockText}</small>
        <button ${equipped || (!unlocked && !affordable) ? 'disabled' : ''} data-action="weapon-action" data-weapon="${id}">
          ${equipped ? 'Equipped' : unlocked ? 'Equip' : `Unlock ${config.coinCost ?? ''}`}
        </button>
      </article>
    `;
  }

  private renderSkinCard(id: SkinId): string {
    const config = SKIN_CONFIGS.find((skin) => skin.id === id)!;
    const unlocked = this.progress?.unlockedSkins.includes(id) ?? false;
    const equipped = this.progress?.equippedSkin === id;
    return `
      <article class="gear-card">
        <span>${equipped ? 'Equipped' : unlocked ? 'Unlocked' : 'Locked'}</span>
        <div class="skin-preview" style="--skin-a:#${config.colors.suit.toString(16).padStart(6, '0')};--skin-b:#${config.colors.accent.toString(16).padStart(6, '0')}"></div>
        <h3>${config.label}</h3>
        <p>${config.description}</p>
        <small>${config.unlockText}</small>
        <button ${equipped || !unlocked ? 'disabled' : ''} data-action="skin-action" data-skin="${id}">${equipped ? 'Equipped' : 'Equip'}</button>
      </article>
    `;
  }

  private renderCosmeticCard(id: CosmeticId): string {
    const config = COSMETIC_CONFIGS.find((cosmetic) => cosmetic.id === id)!;
    const unlocked = this.progress?.unlockedCosmetics.includes(id) ?? false;
    const equipped = this.progress?.equippedCosmetics[config.category] === id;
    const affordable = Boolean(config.coinCost && (this.progress?.totalCoins ?? 0) >= config.coinCost);
    return `
      <article class="gear-card">
        <span>${this.title(config.category)}</span>
        <div class="cosmetic-swatch" style="background:#${(config.color ?? 0x38e8ff).toString(16).padStart(6, '0')}"></div>
        <h3>${config.label}</h3>
        <p>${config.description}</p>
        <small>${config.unlockText}</small>
        <button ${equipped || (!unlocked && !affordable) ? 'disabled' : ''} data-action="cosmetic-action" data-cosmetic="${id}">
          ${equipped ? 'Equipped' : unlocked ? 'Equip' : `Unlock ${config.coinCost ?? ''}`}
        </button>
      </article>
    `;
  }

  private renderAchievementCard(id: AchievementId): string {
    const config = ACHIEVEMENT_CONFIGS.find((achievement) => achievement.id === id)!;
    const progress = this.progress?.achievements[id];
    const value = Math.min(config.target, Math.floor(progress?.progress ?? 0));
    return `
      <article class="gear-card ${progress?.completed ? 'is-complete' : ''}">
        <span>${progress?.completed ? 'Complete' : 'In Progress'}</span>
        <h3>${config.label}</h3>
        <p>${config.description}</p>
        <div class="achievement-progress"><i style="transform:scaleX(${value / Math.max(1, config.target)})"></i></div>
        <strong>${value}/${config.target}</strong>
        <small>Reward: ${config.rewardCoins} coins${config.rewardCosmetic ? ' + cosmetic' : ''}</small>
      </article>
    `;
  }

  private renderRouteCard(route: RouteConfig): string {
    const progress = this.progress?.routes[route.id];
    const unlocked = Boolean(progress?.unlocked) && route.playable;
    const status = !route.playable ? 'Future Route' : unlocked ? progress?.completed ? 'Complete' : 'Unlocked' : 'Locked';
    return `
      <article class="route-card route-card--${route.biome} ${unlocked ? '' : 'is-locked'}">
        <div class="route-card__meta"><span>${this.formatBiome(route.biome)}</span><strong>${DIFFICULTY_PROFILES[route.difficulty].label}</strong></div>
        <h3>${route.displayName}</h3>
        <p>${route.bossName} / ${route.tokenLabel}</p>
        <div class="route-card__stats">
          <span>Best Grade <strong>${progress?.bestGrade ?? '--'}</strong></span>
          <span>Best Score <strong>${progress?.bestScore ?? 0}</strong></span>
          <span>Tokens <strong>${progress?.bestTokenCount ?? 0}/${route.tokenCount}</strong></span>
        </div>
        <div class="route-card__objectives">${route.objectives.map((objective) => `<span>${objective.label}</span>`).join('')}</div>
        <div class="route-card__footer"><span>${status}</span><button ${unlocked ? '' : 'disabled'} data-action="start-route" data-route="${route.id}">Start</button></div>
        <small>${route.unlockText}</small>
      </article>
    `;
  }

  private renderRecordCard(route: RouteConfig): string {
    const record = this.progress?.records[route.id];
    return `
      <article class="record-card route-card--${route.biome}">
        <span>${this.formatBiome(route.biome)}</span>
        <h3>${route.displayName}</h3>
        <div class="route-card__stats">
          <span>Best Score <strong>${record?.bestScore ?? 0}</strong></span>
          <span>Best Grade <strong>${record?.bestGrade ?? '--'}</strong></span>
          <span>Best Distance <strong>${record?.bestDistance ?? 0}m</strong></span>
          <span>Max Flow <strong>x${record?.maxCombo ?? 1}</strong></span>
          <span>No Damage <strong>${record?.noDamageClear ? 'Yes' : 'No'}</strong></span>
        </div>
      </article>
    `;
  }

  private renderDailyMiniCard(): string {
    const challenge = this.getDaily();
    const route = ROUTE_CONFIGS.find((item) => item.id === challenge.routeId) ?? ROUTE_CONFIGS[0];
    const record = this.progress?.daily.today?.challengeId === challenge.id ? this.progress.daily.today : null;
    return `
      <button class="daily-mini daily-mini--${route.biome}" data-action="daily">
        <span>${challenge.dateKey}</span>
        <strong>${challenge.displayName}</strong>
        <small>${challenge.objectiveLabel} / Best ${record?.bestScore ?? 0}</small>
      </button>
    `;
  }

  private renderProgressStrip(): string {
    const totalCoins = this.progress?.totalCoins ?? 0;
    const completed = ROUTE_CONFIGS.filter((route) => this.progress?.routes[route.id]?.completed).length;
    const achievements = ACHIEVEMENT_CONFIGS.filter((achievement) => this.progress?.achievements[achievement.id]?.completed).length;
    return `
      <div class="menu__progress-strip">
        <span>Coins <strong>${totalCoins}</strong></span>
        <span>Completed Routes <strong>${completed}/${ROUTE_CONFIGS.length}</strong></span>
        <span>Achievements <strong>${achievements}/${ACHIEVEMENT_CONFIGS.length}</strong></span>
        ${this.progress?.storageAvailable === false ? '<span class="storage-warning-inline">Save fallback active</span>' : ''}
      </div>
    `;
  }

  private renderRewardBreakdown(breakdown: NonNullable<RunSummary['rewardBreakdown']>): string {
    return `
      <div class="reward-breakdown">
        <div><span>Run Coins</span><strong>${breakdown.runCoins}</strong></div>
        <div><span>Completion</span><strong>${breakdown.completionBonus}</strong></div>
        <div><span>Objectives</span><strong>${breakdown.objectiveBonus}</strong></div>
        <div><span>Grade</span><strong>${breakdown.gradeBonus}</strong></div>
        <div><span>Tokens</span><strong>${breakdown.tokenBonus}</strong></div>
        <div><span>Daily</span><strong>${breakdown.dailyBonus}</strong></div>
        <div><span>Achievements</span><strong>${breakdown.achievementBonus}</strong></div>
        <div><span>Total</span><strong>${breakdown.total}</strong></div>
      </div>
    `;
  }

  private getDaily(): DailyChallenge {
    return getDailyChallenge();
  }

  private formatBiome(biome: RouteConfig['biome']): string {
    const labels: Record<RouteConfig['biome'], string> = {
      cyber: 'Cyber City',
      desert: 'Desert Railway',
      snow: 'Snow Mountain',
      jungle: 'Jungle Ruins',
      lava: 'Lava Zone'
    };
    return labels[biome];
  }

  private title(value: string): string {
    return value.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase());
  }
}
