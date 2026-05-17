import {
  ACHIEVEMENTS,
  CHALLENGE_TIERS,
  GAME_MODES,
  PREMIUM_OFFERS,
  SKINS,
  STAGE_VARIANTS,
  TITLES,
  UPGRADE_NODES,
  getChallengeTier,
  getGameModeDefinition,
  getMissionDefinition,
  getModeAvailability,
  getRankForLevel,
  getSkinDefinition,
  getStageDefinition,
  getUpgradeCost,
  getUpgradeRankCap,
  getWeaponMasteryRequirement,
  type ChallengeTierId,
  type GameModeId,
  type MenuDrawer,
  type MenuScreen,
  type PlayerProfile,
  type PostMatchSummary,
  type ShopSection,
  type SkinId,
  type ThemeMode,
  type TitleId,
  type UpgradeNodeId,
} from './progression';
import type { CloudSessionState } from './firebaseSync';
import type { BossPhase, MatchState, PresentationMode, WeaponMode } from './types';
import { UISoundController, type UISoundCue } from './uiAudio';

type CalloutTone = 'sword' | 'gun' | 'power' | 'rage' | 'boss' | 'arena';
type SkinFilter = 'all' | 'owned' | 'locked' | 'equipped';

export type HudAction =
  | { type: 'navigate'; screen: MenuScreen }
  | { type: 'open_drawer'; drawer: Exclude<MenuDrawer, 'none'> }
  | { type: 'close_drawer' }
  | { type: 'set_shop_section'; section: ShopSection }
  | { type: 'set_skin_filter'; filter: SkinFilter }
  | { type: 'select_mode'; modeId: GameModeId }
  | { type: 'launch_mode'; modeId: GameModeId }
  | { type: 'set_challenge'; tierId: ChallengeTierId }
  | { type: 'buy_upgrade'; nodeId: UpgradeNodeId }
  | { type: 'reset_upgrades' }
  | { type: 'buy_skin'; skinId: SkinId }
  | { type: 'select_skin'; skinId: SkinId }
  | { type: 'select_title'; titleId: TitleId }
  | { type: 'preview_skin'; skinId: SkinId }
  | { type: 'clear_skin_preview' }
  | { type: 'set_theme'; theme: ThemeMode }
  | { type: 'set_presentation'; mode: '2d' | '2_5d' }
  | { type: 'set_stage'; stageId: 'neon_hangar' | 'sunset_rooftop' | 'temple_court' }
  | { type: 'update_setting'; setting: string; value: string }
  | { type: 'replay_tutorial' }
  | { type: 'export_save' }
  | { type: 'import_save' }
  | { type: 'reset_profile' }
  | { type: 'continue_guest' }
  | { type: 'login_google' }
  | { type: 'login_email_signin'; email: string; password: string }
  | { type: 'login_email_register'; email: string; password: string }
  | { type: 'logout_user' }
  | { type: 'open_upgrades' }
  | { type: 'play_again' }
  | { type: 'back_to_hub' }
  | { type: 'back_to_profile' };

interface HudMetaView {
  matchState: MatchState;
  profile: PlayerProfile;
  menuDrawer: MenuDrawer;
  summary: PostMatchSummary | null;
  dailyRewardCoins: number;
  previewSkinId: SkinId | null;
  skinFilter: SkinFilter;
  cloudSession: CloudSessionState;
}

interface ResourceElements {
  playerHealth: HTMLElement;
  bossHealth: HTMLElement;
  bossPhase: HTMLElement;
  warningText: HTMLElement;
  centerMessage: HTMLElement;
  comboCallout: HTMLElement;
  finisherPrompt: HTMLElement;
  statusText: HTMLElement;
  restartText: HTMLElement;
  modeName: HTMLElement;
  modeDetail: HTMLElement;
  ammoText: HTMLElement;
  powerText: HTMLElement;
  rageText: HTMLElement;
  rageFill: HTMLElement;
  rageCooldown: HTMLElement;
  screenTint: HTMLElement;
  hudRoot: HTMLElement;
  metaOverlay: HTMLElement;
  resultsOverlay: HTMLElement;
}

interface RewardAnimationState {
  active: boolean;
  time: number;
  summaryKey: string;
  coinsPlayed: boolean;
  xpPlayed: boolean;
  bonusPlayed: boolean;
}

export class HUDController {
  private readonly elements: ResourceElements;
  private readonly actions: HudAction[] = [];
  private readonly uiAudio = new UISoundController();
  private readonly toast: HTMLDivElement;
  private readonly helpOverlay: HTMLDivElement;
  private readonly debugOverlay: HTMLDivElement;
  private readonly onMetaClick = (event: Event): void => this.handleOverlayClick(event, false);
  private readonly onResultsClick = (event: Event): void => this.handleOverlayClick(event, true);
  private readonly onMetaMouseOver = (event: Event): void => this.handleOverlayHover(event);
  private readonly onMetaMouseOut = (event: Event): void => this.handleOverlayHoverOut(event);
  private readonly onResultsMouseOver = (event: Event): void => this.handleButtonHover(event);
  private metaView: HudMetaView | null = null;
  private renderSignature = '';
  private calloutTimer = 0;
  private toastTimer = 0;
  private hoveredButton: HTMLElement | null = null;
  private previewHoverCard: HTMLElement | null = null;
  private rewardAnimation: RewardAnimationState = {
    active: false,
    time: 0,
    summaryKey: '',
    coinsPlayed: false,
    xpPlayed: false,
    bonusPlayed: false,
  };

  setAudioMix(settings: { masterVolume: number; uiVolume: number }): void {
    this.uiAudio.setMix(settings);
  }

  suspendAudio(): void {
    this.uiAudio.suspend();
  }

  resumeAudio(): void {
    this.uiAudio.resume();
  }

  constructor() {
    this.elements = {
      playerHealth: this.getElement('player-health'),
      bossHealth: this.getElement('boss-health'),
      bossPhase: this.getElement('boss-phase'),
      warningText: this.getElement('warning-text'),
      centerMessage: this.getElement('center-message'),
      comboCallout: this.getElement('combo-callout'),
      finisherPrompt: this.getElement('finisher-prompt'),
      statusText: this.getElement('status-text'),
      restartText: this.getElement('restart-text'),
      modeName: this.getElement('mode-name'),
      modeDetail: this.getElement('mode-detail'),
      ammoText: this.getElement('ammo-text'),
      powerText: this.getElement('power-text'),
      rageText: this.getElement('rage-text'),
      rageFill: this.getElement('rage-fill'),
      rageCooldown: this.getElement('rage-cooldown'),
      screenTint: this.getElement('screen-tint'),
      hudRoot: this.getElement('hud'),
      metaOverlay: this.getElement('meta-overlay'),
      resultsOverlay: this.getElement('results-overlay'),
    };

    this.toast = document.createElement('div');
    this.toast.className = 'menu-toast hidden';
    document.body.append(this.toast);

    this.helpOverlay = document.createElement('div');
    this.helpOverlay.className = 'combat-help-overlay hidden';
    document.body.append(this.helpOverlay);

    this.debugOverlay = document.createElement('div');
    this.debugOverlay.className = 'debug-analytics-overlay hidden';
    document.body.append(this.debugOverlay);

    this.elements.metaOverlay.addEventListener('click', this.onMetaClick);
    this.elements.resultsOverlay.addEventListener('click', this.onResultsClick);
    this.elements.metaOverlay.addEventListener('mouseover', this.onMetaMouseOver);
    this.elements.metaOverlay.addEventListener('mouseout', this.onMetaMouseOut);
    this.elements.resultsOverlay.addEventListener('mouseover', this.onResultsMouseOver);
  }

  dispose(): void {
    this.elements.metaOverlay.removeEventListener('click', this.onMetaClick);
    this.elements.resultsOverlay.removeEventListener('click', this.onResultsClick);
    this.elements.metaOverlay.removeEventListener('mouseover', this.onMetaMouseOver);
    this.elements.metaOverlay.removeEventListener('mouseout', this.onMetaMouseOut);
    this.elements.resultsOverlay.removeEventListener('mouseover', this.onResultsMouseOver);
    this.toast.remove();
    this.helpOverlay.remove();
    this.debugOverlay.remove();
  }

  consumeActions(): HudAction[] {
    const queued = [...this.actions];
    this.actions.length = 0;
    return queued;
  }

  updateHealth(playerRatio: number, bossRatio: number): void {
    this.elements.playerHealth.style.width = `${Math.round(Math.max(0, Math.min(1, playerRatio)) * 100)}%`;
    this.elements.bossHealth.style.width = `${Math.round(Math.max(0, Math.min(1, bossRatio)) * 100)}%`;
  }

  setMatchState(state: MatchState, outcome: 'win' | 'lose' | null = null): void {
    const message =
      state === 'finisher'
        ? 'Finisher'
        : state === 'round_intro'
          ? 'Round Start'
          : state === 'round_ko'
            ? 'KO'
            : state === 'round_score'
              ? 'Next Round'
        : state === 'help_pause'
          ? 'Paused'
          : state === 'victory_pose'
            ? outcome === 'lose'
              ? 'Defeat'
              : 'Victory'
            : '';
    this.elements.centerMessage.textContent = message;
    this.elements.centerMessage.classList.toggle('hidden', message.length === 0);
    if (state === 'victory_pose' && outcome) {
      this.elements.centerMessage.dataset.result = outcome;
    } else if (state === 'finisher') {
      this.elements.centerMessage.dataset.result = 'finisher';
    } else {
      delete this.elements.centerMessage.dataset.result;
    }
    this.elements.restartText.classList.toggle('hidden', state !== 'post_match');
  }

  setStatus(pointerLocked: boolean, weaponMode: WeaponMode, rageActive: boolean, presentationMode: PresentationMode): void {
    const pointerText = pointerLocked ? 'Lane duel live.' : presentationMode === '2d' ? '2D silhouette duel live.' : '2.5D lane locked.';
    const modeText =
      weaponMode === 'sword'
        ? 'Sword pressure online.'
        : weaponMode === 'gun'
          ? 'Rifle stance ready.'
          : 'Power stance active.';
    const controlText =
      'Move: A/D or arrows or left stick. Jump: Space or A. Block: Shift or LB. Dash: double tap left/right. Light: LMB/J or X. Heavy: RMB/K or Y. Special: L or B. Help: Tab or Start. Debug: ` or Back.';
    const rageText = rageActive ? ' Rage Mode is amplifying your hits.' : '';
    this.elements.statusText.textContent = `${pointerText} ${modeText} ${controlText}${rageText}`.trim();
  }

  setCombatInfo(mode: WeaponMode, detail: string, ammo: string, power: string, rage: string): void {
    this.elements.modeName.textContent = mode.toUpperCase();
    this.elements.modeDetail.textContent = detail;
    this.elements.ammoText.textContent = ammo;
    this.elements.powerText.textContent = power;
    this.elements.rageText.textContent = rage;
  }

  setBossPhase(phase: BossPhase | null, labelOverride?: string): void {
    const label = phase === null
      ? `${labelOverride ?? 'Duel'}: Rival`
      : phase === 'phase1'
        ? 'Phase 1: Pressure'
        : phase === 'phase2'
          ? 'Phase 2: Fury'
          : 'Phase 3: Titan';
    this.elements.bossPhase.textContent = label;
  }

  setRage(fillRatio: number, active: boolean, cooldown: number, shockwaveCooldown: number): void {
    const fill = Math.max(0, Math.min(1, fillRatio));
    this.elements.rageFill.style.width = `${Math.round(fill * 100)}%`;
    this.elements.rageCooldown.textContent = active
      ? `Rage live${shockwaveCooldown > 0 ? ` | Shockwave ${shockwaveCooldown.toFixed(1)}s` : ' | Shockwave ready'}`
      : cooldown > 0
        ? `Cooldown ${cooldown.toFixed(1)}s`
        : fill >= 1
          ? 'Press F to ignite'
          : 'Build Rage';
  }

  setWarning(text: string, visible: boolean): void {
    this.elements.warningText.textContent = text;
    this.elements.warningText.classList.toggle('hidden', !visible || text.length === 0);
  }

  setFinisherPrompt(visible: boolean): void {
    this.elements.finisherPrompt.classList.toggle('hidden', !visible);
  }

  setTint(rageStrength: number, finisherStrength: number): void {
    this.elements.screenTint.style.opacity = `${Math.max(rageStrength, finisherStrength).toFixed(3)}`;
  }

  setHelpOverlay(visible: boolean, ammoText: string, utilityText: string, presentationMode: PresentationMode): void {
    this.helpOverlay.classList.toggle('hidden', !visible);
    if (!visible) {
      return;
    }
    this.helpOverlay.innerHTML = `
      <div class="combat-help-card">
        <span class="eyebrow">Fight Help</span>
        <h2>${presentationMode === '2d' ? '2D Silhouette Controls' : '2.5D Arena Controls'}</h2>
        <div class="help-grid">
          <div><span>Move / Crouch / Jump</span><strong>A-D / S / Space</strong></div>
          <div><span>Light / Heavy / Special</span><strong>LMB-J / RMB-K / L</strong></div>
          <div><span>Block / Dash</span><strong>Shift / double tap left-right</strong></div>
          <div><span>Weapons</span><strong>1 Sword / 2 Gun / 3 Power</strong></div>
          <div><span>Power / Rage / Shockwave / Finisher</span><strong>E / F / Q / X</strong></div>
          <div><span>Gun Utility / Power Rod</span><strong>Up+L grenade / Down+L bomb / Down+Forward+L lightning</strong></div>
          <div><span>Combos</span><strong>L-L-H, Down+H, Fwd-Fwd+H, Down-Fwd+S</strong></div>
          <div><span>Controller</span><strong>X light / Y heavy / B special / LB block / RT context</strong></div>
          <div><span>Ammo / Utility</span><strong>${ammoText} | ${utilityText}</strong></div>
        </div>
        <p>Tab resumes the match. Backquote toggles the debug combat panel.</p>
      </div>
    `;
  }

  setDebugOverlay(visible: boolean, html: string): void {
    this.debugOverlay.classList.toggle('hidden', !visible);
    if (!visible) {
      return;
    }
    this.debugOverlay.innerHTML = html;
  }

  flashCallout(text: string, tone: CalloutTone): void {
    this.elements.comboCallout.textContent = text;
    this.elements.comboCallout.dataset.tone = tone;
    this.elements.comboCallout.classList.remove('hidden');
    this.calloutTimer = 1.1;
  }

  notifyMenuFeedback(cue: UISoundCue, text: string): void {
    this.uiAudio.play(cue);
    this.toast.textContent = text;
    this.toast.classList.remove('hidden');
    this.toast.dataset.tone = cue;
    this.toastTimer = 1.8;
  }

  renderMetaState(view: HudMetaView): void {
    this.metaView = view;
    const nextSignature = this.buildSignature(view);
    if (nextSignature === this.renderSignature) {
      return;
    }
    this.renderSignature = nextSignature;

    const showMenu = view.matchState === 'hub';
    const showResults = view.matchState === 'post_match' && view.summary !== null;

    this.elements.hudRoot.classList.toggle('hud-hidden', showMenu || showResults);
    this.elements.metaOverlay.classList.toggle('hidden', !showMenu);
    this.elements.resultsOverlay.classList.toggle('hidden', !showResults);

    if (showMenu) {
      this.elements.metaOverlay.innerHTML = this.renderMenuShell(view);
      this.focusPrimaryAction(this.elements.metaOverlay, view.profile.menuScreen === 'main' ? '[data-action="launch-mode"]' : 'button');
    }

    if (showResults && view.summary) {
      const summaryKey = `${view.summary.outcome}-${view.summary.levelAfter}-${view.summary.rewards.totalCoins}-${view.summary.rewards.totalXp}`;
      if (this.rewardAnimation.summaryKey !== summaryKey) {
        this.rewardAnimation = {
          active: true,
          time: 0,
          summaryKey,
          coinsPlayed: false,
          xpPlayed: false,
          bonusPlayed: false,
        };
      }
      this.elements.resultsOverlay.innerHTML = this.renderRewardShell(view.summary);
      this.focusPrimaryAction(this.elements.resultsOverlay, '[data-action="play-again"]');
      this.updateRewardAnimation();
    }
  }

  tick(dt: number): void {
    if (this.calloutTimer > 0) {
      this.calloutTimer = Math.max(0, this.calloutTimer - dt);
      if (this.calloutTimer === 0) {
        this.elements.comboCallout.classList.add('hidden');
      }
    }

    if (this.toastTimer > 0) {
      this.toastTimer = Math.max(0, this.toastTimer - dt);
      if (this.toastTimer === 0) {
        this.toast.classList.add('hidden');
      }
    }

    if (this.rewardAnimation.active && !this.elements.resultsOverlay.classList.contains('hidden')) {
      this.rewardAnimation.time += dt;
      this.updateRewardAnimation();
    }
  }

  private getElement(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (!element) {
      throw new Error(`Missing #${id}`);
    }
    return element;
  }

  private enqueue(action: HudAction): void {
    this.actions.push(action);
  }

  private handleOverlayClick(event: Event, results: boolean): void {
    const target = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>('[data-action]') : null;
    if (!target) {
      return;
    }

    const action = target.dataset.action;
    const sound = (target.dataset.sound as UISoundCue | undefined) ?? 'confirm';

    switch (action) {
      case 'navigate':
        this.enqueue({ type: 'navigate', screen: this.readDataset<MenuScreen>(target, 'screen', 'main') });
        break;
      case 'open-drawer':
        this.enqueue({ type: 'open_drawer', drawer: this.readDataset<Exclude<MenuDrawer, 'none'>>(target, 'drawer', 'daily') });
        break;
      case 'close-drawer':
        this.enqueue({ type: 'close_drawer' });
        break;
      case 'set-shop':
        this.enqueue({ type: 'set_shop_section', section: this.readDataset<ShopSection>(target, 'section', 'skins') });
        break;
      case 'set-skin-filter':
        this.enqueue({ type: 'set_skin_filter', filter: this.readDataset<SkinFilter>(target, 'filter', 'all') });
        break;
      case 'select-mode':
        this.enqueue({ type: 'select_mode', modeId: this.readDataset<GameModeId>(target, 'mode', 'quick_fight') });
        break;
      case 'launch-mode':
        this.enqueue({ type: 'launch_mode', modeId: this.readDataset<GameModeId>(target, 'mode', 'quick_fight') });
        break;
      case 'set-challenge':
        this.enqueue({ type: 'set_challenge', tierId: this.readDataset<ChallengeTierId>(target, 'tier', 'standard') });
        break;
      case 'buy-upgrade':
        this.enqueue({ type: 'buy_upgrade', nodeId: this.readDataset<UpgradeNodeId>(target, 'node', 'ferocity') });
        break;
      case 'reset-upgrades':
        this.enqueue({ type: 'reset_upgrades' });
        break;
      case 'buy-skin':
        this.enqueue({ type: 'buy_skin', skinId: this.readDataset<SkinId>(target, 'skin', 'classic_azure') });
        break;
      case 'select-skin':
        this.enqueue({ type: 'select_skin', skinId: this.readDataset<SkinId>(target, 'skin', 'classic_azure') });
        break;
      case 'preview-skin':
        this.enqueue({ type: 'preview_skin', skinId: this.readDataset<SkinId>(target, 'skin', 'classic_azure') });
        break;
      case 'select-title':
        this.enqueue({ type: 'select_title', titleId: this.readDataset<TitleId>(target, 'title', 'rookie') });
        break;
      case 'set-theme':
        this.enqueue({ type: 'set_theme', theme: this.readDataset<ThemeMode>(target, 'theme', 'dark') });
        break;
      case 'set-presentation':
        this.enqueue({ type: 'set_presentation', mode: this.readDataset<'2d' | '2_5d'>(target, 'mode', '2_5d') });
        break;
      case 'set-stage':
        this.enqueue({
          type: 'set_stage',
          stageId: this.readDataset<'neon_hangar' | 'sunset_rooftop' | 'temple_court'>(target, 'stage', 'neon_hangar'),
        });
        break;
      case 'update-setting':
        this.enqueue({
          type: 'update_setting',
          setting: target.dataset.setting ?? 'masterVolume',
          value: target.dataset.value ?? '100',
        });
        break;
      case 'replay-tutorial':
        this.enqueue({ type: 'replay_tutorial' });
        break;
      case 'export-save':
        this.enqueue({ type: 'export_save' });
        break;
      case 'import-save':
        this.enqueue({ type: 'import_save' });
        break;
      case 'reset-profile':
        this.enqueue({ type: 'reset_profile' });
        break;
      case 'continue-guest':
        this.enqueue({ type: 'continue_guest' });
        break;
      case 'login-google':
        this.enqueue({ type: 'login_google' });
        break;
      case 'login-email-signin': {
        const credentials = this.readAccountCredentials(target);
        if (!credentials) {
          this.notifyMenuFeedback('deny', 'Enter email and password first.');
          return;
        }
        this.enqueue({ type: 'login_email_signin', ...credentials });
        break;
      }
      case 'login-email-register': {
        const credentials = this.readAccountCredentials(target);
        if (!credentials) {
          this.notifyMenuFeedback('deny', 'Enter email and password first.');
          return;
        }
        this.enqueue({ type: 'login_email_register', ...credentials });
        break;
      }
      case 'logout-user':
        this.enqueue({ type: 'logout_user' });
        break;
      case 'open-upgrades':
        this.enqueue({ type: 'open_upgrades' });
        break;
      case 'play-again':
        this.enqueue({ type: 'play_again' });
        break;
      case 'back-to-hub':
        this.enqueue({ type: 'back_to_hub' });
        break;
      case 'back-to-profile':
        this.enqueue({ type: 'back_to_profile' });
        break;
      case 'clear-preview':
        this.enqueue({ type: 'clear_skin_preview' });
        break;
      default:
        return;
    }

    if (!results || action !== 'play-again') {
      this.uiAudio.play(sound);
    }
  }

  private handleOverlayHover(event: Event): void {
    this.handleButtonHover(event);
    const target = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>('[data-preview-skin]') : null;
    if (!target || target === this.previewHoverCard) {
      return;
    }
    this.previewHoverCard = target;
    this.enqueue({ type: 'preview_skin', skinId: this.readDataset<SkinId>(target, 'previewSkin', 'classic_azure') });
  }

  private handleOverlayHoverOut(event: Event): void {
    const card = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>('[data-preview-skin]') : null;
    if (!card || !this.previewHoverCard || card !== this.previewHoverCard) {
      return;
    }

    const related = event instanceof MouseEvent && event.relatedTarget instanceof Node ? event.relatedTarget : null;
    if (related && card.contains(related)) {
      return;
    }

    this.previewHoverCard = null;
    this.enqueue({ type: 'clear_skin_preview' });
  }

  private handleButtonHover(event: Event): void {
    const target = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>('[data-sound-hover]') : null;
    if (!target || target === this.hoveredButton) {
      return;
    }

    this.hoveredButton = target;
    this.uiAudio.play('hover');
  }

  private buildSignature(view: HudMetaView): string {
    const { profile, summary } = view;
    return JSON.stringify({
      matchState: view.matchState,
      menuScreen: profile.menuScreen,
      shopSection: profile.shopSection,
      menuDrawer: view.menuDrawer,
      previewSkinId: view.previewSkinId,
      skinFilter: view.skinFilter,
      dailyRewardCoins: view.dailyRewardCoins,
      selectedMode: profile.lastSelectedMode,
      selectedChallengeTier: profile.selectedChallengeTier,
      selectedSkinId: profile.selectedSkinId,
      selectedTitleId: profile.selectedTitleId,
      level: profile.level,
      xp: profile.xp,
      coins: profile.coins,
      gems: profile.gems,
      themeMode: profile.themeMode,
      presentationMode: profile.presentationMode,
      selectedStageId: profile.selectedStageId,
      cloudSession: view.cloudSession,
      settings: profile.settings,
      tutorialState: profile.tutorialState,
      upgradePoints: profile.upgradePoints,
      unlockedModes: profile.unlockedModes,
      unlockedSkins: profile.unlockedSkins,
      unlockedTitles: profile.unlockedTitles,
      unlockedAchievements: profile.unlockedAchievements,
      unlockedChallengeTiers: profile.unlockedChallengeTiers,
      upgrades: profile.upgrades,
      dailyMissions: profile.dailyMissions,
      weeklyMissions: profile.weeklyMissions,
      weeklyMilestonesClaimed: profile.weeklyMilestonesClaimed,
      weaponMastery: profile.weaponMastery,
      lifetimeStats: profile.lifetimeStats,
      summary:
        summary === null
          ? null
          : {
              outcome: summary.outcome,
              totalCoins: summary.rewards.totalCoins,
              totalXp: summary.rewards.totalXp,
              levelAfter: summary.levelAfter,
              challengeTier: summary.challengeTier.id,
              achievements: summary.achievementsUnlocked.map((entry) => entry.id),
              skins: summary.skinsUnlocked.map((entry) => entry.id),
              titles: summary.titlesUnlocked.map((entry) => entry.id),
            },
    });
  }

  private renderMenuShell(view: HudMetaView): string {
    const titleRank = getRankForLevel(view.profile.level);
    const screenMarkup = this.renderMenuScreen(view);

    return `
      <div class="menu-shell screen-${view.profile.menuScreen}">
        <div class="menu-bg-orb orb-left"></div>
        <div class="menu-bg-orb orb-right"></div>
        <header class="menu-topbar glass-panel">
          <div class="brand-lockup">
            <span class="brand-kicker">Stick Titan</span>
            <strong class="brand-title">Neon Arena Protocol</strong>
          </div>
          <div class="topbar-tools">
            <button class="account-entry" data-action="open-drawer" data-drawer="account" data-sound="navigation" data-sound-hover="1" type="button">
              <span>${view.cloudSession.isLinked ? 'Cloud Save' : 'Login / Save Progress'}</span>
              <strong>${this.getCloudStatusLabel(view.cloudSession)}</strong>
            </button>
            <div class="theme-toggle" role="group" aria-label="Theme">
              ${this.renderThemeButton(view.profile.themeMode, 'dark', 'Dark')}
              ${this.renderThemeButton(view.profile.themeMode, 'light', 'Light')}
            </div>
            <div class="theme-toggle" role="group" aria-label="Visual Mode">
              ${this.renderPresentationButton(view.profile.presentationMode, '2_5d', '2.5D')}
              ${this.renderPresentationButton(view.profile.presentationMode, '2d', '2D')}
            </div>
          </div>
          <div class="resource-bar">
            <div class="resource-chip coin"><span>Coins</span><strong>${this.formatNumber(view.profile.coins)}</strong></div>
            <div class="resource-chip gem"><span>Gems</span><strong>${this.formatNumber(view.profile.gems)}</strong></div>
            <div class="resource-chip level"><span>Level</span><strong>${view.profile.level} | ${titleRank.name}</strong></div>
          </div>
        </header>
        <div class="menu-layout">
          <aside class="menu-rail">
            <button class="rail-button" data-action="open-drawer" data-drawer="daily" data-sound="navigation" data-sound-hover="1">
              <span class="rail-icon">DAILY</span>
              <span>Daily Rewards</span>
              <strong>${view.dailyRewardCoins > 0 ? `+${view.dailyRewardCoins}` : `Day ${Math.max(view.profile.dailyStreak.cycleDay, 1)}`}</strong>
            </button>
            <button class="rail-button" data-action="open-drawer" data-drawer="missions" data-sound="navigation" data-sound-hover="1">
              <span class="rail-icon">TASK</span>
              <span>Missions</span>
              <strong>${this.getCompletedMissionCount(view.profile)}</strong>
            </button>
          </aside>
          <main class="menu-main">
            ${screenMarkup}
          </main>
        </div>
        ${this.renderDrawer(view)}
      </div>
    `;
  }

  private renderMenuScreen(view: HudMetaView): string {
    switch (view.profile.menuScreen) {
      case 'modes':
        return this.renderModesScreen(view.profile);
      case 'shop':
        return this.renderShopScreen(view.profile, view.previewSkinId);
      case 'profile':
        return this.renderProfileScreen(view.profile);
      case 'settings':
        return this.renderSettingsScreen(view.profile, view.cloudSession);
      case 'reward':
        return this.renderRewardFallback(view.summary);
      case 'main':
      default:
        return this.renderMainMenu(view.profile, view.dailyRewardCoins);
    }
  }

  private renderRewardFallback(summary: PostMatchSummary | null): string {
    return `
      <section class="screen-panel main-panel">
        <div class="panel-copy">
          <span class="eyebrow">Reward Screen</span>
          <h1>Jump Back Into The Arena</h1>
          <p>${summary ? `${summary.outcome === 'win' ? 'Victory secured.' : 'Setback logged.'} Open the full reward screen to review unlocks.` : 'Match results will appear here after a run.'}</p>
        </div>
        <div class="hero-actions">
          <button class="menu-button primary" data-action="play-again" data-sound="reward" data-sound-hover="1">Play Again</button>
          <button class="menu-button" data-action="open-upgrades" data-sound="navigation" data-sound-hover="1">Upgrade</button>
          <button class="menu-button" data-action="back-to-profile" data-sound="navigation" data-sound-hover="1">Back To Profile</button>
        </div>
      </section>
    `;
  }

  private renderMainMenu(profile: PlayerProfile, dailyRewardCoins: number): string {
    const tier = getChallengeTier(profile.selectedChallengeTier);
    const mode = getGameModeDefinition(profile.lastSelectedMode);
    const title = TITLES.find((entry) => entry.id === profile.selectedTitleId)?.name ?? 'Rookie';
    const streakBonus = Math.min(profile.dailyStreak.streakCount, 7) * 5;
    return `
      <section class="screen-panel main-panel home-panel">
        <div class="home-hero glass-panel">
          <div class="hero-copy">
            <span class="eyebrow">Tournament Command</span>
            <h1>Fight Fast. Adapt Hard. Run It Back.</h1>
            <p>The arena stays live behind the shell, but this front end now behaves like a full command deck: clear status, faster choices, and a stronger route back into combat.</p>
          </div>
          <div class="home-chip-row">
            <span class="home-chip accent">Live Arena</span>
            <span class="home-chip">${profile.presentationMode === '2d' ? '2D Silhouette' : '2.5D Cinematic'}</span>
            <span class="home-chip">${profile.themeMode === 'light' ? 'Light Deck' : 'Dark Deck'}</span>
          </div>
          <div class="home-signal-grid">
            <article class="home-signal-card">
              <span class="eyebrow">Identity</span>
              <strong>${title}</strong>
              <span>Level ${profile.level} operator</span>
            </article>
            <article class="home-signal-card">
              <span class="eyebrow">Mode Focus</span>
              <strong>${mode.name}</strong>
              <span>${tier.name} tier selected</span>
            </article>
            <article class="home-signal-card">
              <span class="eyebrow">Mission Pulse</span>
              <strong>${this.getCompletedMissionCount(profile)}</strong>
              <span>missions complete</span>
            </article>
            <article class="home-signal-card">
              <span class="eyebrow">Streak Bonus</span>
              <strong>+${streakBonus}%</strong>
              <span>${dailyRewardCoins > 0 ? `today +${dailyRewardCoins} coins` : 'reward already claimed'}</span>
            </article>
          </div>
        </div>
        <div class="main-menu-center glass-panel home-command">
          <div class="home-command-head">
            <div class="player-badge">
              <span class="eyebrow">Ready Loadout</span>
              <strong>${mode.name}</strong>
              <span>Tier: ${tier.name}</span>
              <span>Fast launch is primed</span>
            </div>
            <div class="home-launch-card">
              <span class="eyebrow">Primary Action</span>
              <strong>Quick Fight</strong>
              <span>Press Enter or hit Play to jump straight in.</span>
            </div>
          </div>
          <div class="feature-list tournament-strip home-spotlight-strip">
            <div><strong>Visual Mode</strong><span>${profile.presentationMode === '2d' ? 'Pure side silhouette read' : 'Side-view cinematic depth'}</span></div>
            <div><strong>Current Theme</strong><span>${profile.themeMode === 'light' ? 'White and golden beige command deck' : 'Dark neon command deck'}</span></div>
            <div><strong>Fight Style</strong><span>Light, heavy, special, block, dash, rage, finisher</span></div>
          </div>
          <div class="cta-stack home-cta-stack">
            <button class="menu-button primary big home-primary-button" data-action="launch-mode" data-mode="quick_fight" data-sound="confirm" data-sound-hover="1">Play</button>
            <div class="home-nav-grid">
              <button class="menu-button big home-nav-card" data-action="navigate" data-screen="modes" data-sound="navigation" data-sound-hover="1">
                <strong>Modes</strong>
                <span>Switch between duels, boss runs, and survival.</span>
              </button>
              <button class="menu-button big home-nav-card" data-action="navigate" data-screen="shop" data-sound="navigation" data-sound-hover="1">
                <strong>Shop</strong>
                <span>Review skins, upgrades, and current build value.</span>
              </button>
              <button class="menu-button big home-nav-card" data-action="navigate" data-screen="profile" data-sound="navigation" data-sound-hover="1">
                <strong>Profile</strong>
                <span>Check rank, mastery, achievements, and long-term stats.</span>
              </button>
              <button class="menu-button big home-nav-card" data-action="navigate" data-screen="settings" data-sound="navigation" data-sound-hover="1">
                <strong>Settings</strong>
                <span>Tune visuals, assists, audio, and tutorial replay.</span>
              </button>
            </div>
          </div>
          <div class="home-footer-strip">
            <div><span>Fast Path</span><strong>Enter launches Quick Fight instantly</strong></div>
            <div><span>Current Loop</span><strong>${mode.name} | ${tier.name}</strong></div>
            <div><span>Readiness</span><strong>${profile.dailyMissions.filter((mission) => mission.completed).length} daily claims primed</strong></div>
          </div>
        </div>
        <div class="main-menu-side home-side-stack">
          <div class="glass-panel home-side-card">
            <span class="eyebrow">Quick Start</span>
            <div class="feature-list">
              <div><strong>Daily Reward</strong><span>${dailyRewardCoins > 0 ? `Claimed +${dailyRewardCoins} coins today` : 'Next login reward already secured'}</span></div>
              <div><strong>Mission Flow</strong><span>${this.getCompletedMissionCount(profile)} missions currently complete</span></div>
              <div><strong>Best Start</strong><span>Play, learn the spacing, then tune in Settings or Shop.</span></div>
            </div>
          </div>
          <div class="glass-panel home-side-card controls-sheet home-controls-deck">
            <strong>How To Play</strong>
            <div><span>Movement</span><span>A / D or arrows, S down, W up, Space jump</span></div>
            <div><span>Attacks</span><span>LMB or J light, RMB or K heavy, L special</span></div>
            <div><span>Defense</span><span>Shift block, double tap left-right dash</span></div>
            <div><span>Weapon Flow</span><span>1 sword, 2 gun, 3 power, R reload</span></div>
            <div><span>Advanced</span><span>F rage, Q shockwave, X finisher, E overdrive</span></div>
            <div><span>Utility Tech</span><span>Up+L grenade, Down+L bomb, Down+Forward+L lightning</span></div>
            <div><span>Match Tools</span><span>Tab help overlay, Backquote debug analytics</span></div>
            <div><span>Core Routes</span><span>L-L-H, Down+H, Forward-Forward+H, Down-Forward+S</span></div>
          </div>
        </div>
      </section>
    `;
  }

  private renderModesScreen(profile: PlayerProfile): string {
    const selectedMode = GAME_MODES.find((entry) => entry.id === profile.lastSelectedMode) ?? GAME_MODES[0];
    const selectedTier = getChallengeTier(profile.selectedChallengeTier);
    const availability = getModeAvailability(profile, selectedMode.id);

    return `
      <section class="screen-panel modes-panel">
        <div class="screen-header">
          <div>
            <span class="eyebrow">Modes</span>
            <h1>Choose Your Entry Point</h1>
            <p>Quick Fight launches a best-of-three duel, Boss Battle opens the boss set, and Survival runs the full five-fight ladder with carryover recovery.</p>
          </div>
          <button class="menu-button subtle" data-action="navigate" data-screen="main" data-sound="navigation" data-sound-hover="1">Back</button>
        </div>
        <div class="modes-layout">
          <div class="mode-grid">
            ${GAME_MODES.map((mode) => this.renderModeCard(profile, mode.id, mode.id === selectedMode.id)).join('')}
          </div>
          <div class="mode-brief glass-panel">
            <span class="eyebrow">Selected Mode</span>
            <h2>${selectedMode.name}</h2>
            <p>${selectedMode.description}</p>
            ${
              selectedMode.id === 'boss_battle'
                ? `
                  <div class="tier-grid">
                    ${CHALLENGE_TIERS.map((tier) => {
                      const unlocked = profile.unlockedChallengeTiers.includes(tier.id);
                      return `
                        <button
                          class="tier-pill ${tier.id === profile.selectedChallengeTier ? 'active' : ''}"
                          data-action="set-challenge"
                          data-tier="${tier.id}"
                          data-sound="${unlocked ? 'navigation' : 'deny'}"
                          data-sound-hover="1"
                          ${unlocked ? '' : 'disabled'}
                        >
                          <strong>${tier.name}</strong>
                          <span>${Math.round(tier.rewardMultiplier * 100)}% rewards</span>
                        </button>
                      `;
                    }).join('')}
                  </div>
                  <div class="mode-stats">
                    <div><span>Opponent Health</span><strong>${Math.round(selectedTier.bossHealthMultiplier * 100)}%</strong></div>
                    <div><span>Damage</span><strong>${Math.round(selectedTier.bossDamageMultiplier * 100)}%</strong></div>
                    <div><span>Guard Pressure</span><strong>${Math.round(selectedTier.hazardDamageMultiplier * 100)}%</strong></div>
                  </div>
                `
                : `
                  <div class="mode-stats">
                    <div><span>Current Tier</span><strong>${selectedTier.name}</strong></div>
                    <div><span>Reward Multiplier</span><strong>${selectedTier.rewardMultiplier.toFixed(2)}x</strong></div>
                    <div><span>Status</span><strong>${availability === 'available' ? 'Ready' : availability === 'locked' ? `Unlock at Lv ${selectedMode.unlockLevel}` : 'Coming Soon'}</strong></div>
                  </div>
                `
            }
            <div class="section-minihead">
              <span class="eyebrow">Stage Variant</span>
              <strong>${getStageDefinition(profile.selectedStageId).name}</strong>
            </div>
            <div class="tier-grid">
              ${STAGE_VARIANTS.map((stage) => {
                return `
                  <button
                    class="tier-pill ${stage.id === profile.selectedStageId ? 'active' : ''}"
                    data-action="set-stage"
                    data-stage="${stage.id}"
                    data-sound="navigation"
                    data-sound-hover="1"
                  >
                    <strong>${stage.name}</strong>
                    <span>${stage.description}</span>
                  </button>
                `;
              }).join('')}
            </div>
            <div class="hero-actions">
              <button
                class="menu-button primary"
                data-action="launch-mode"
                data-mode="${selectedMode.id}"
                data-sound="${availability === 'available' ? 'confirm' : 'deny'}"
                data-sound-hover="1"
              >
                ${availability === 'available' ? `Launch ${selectedMode.name}` : availability === 'locked' ? 'Locked' : 'Coming Soon'}
              </button>
              <button class="menu-button" data-action="navigate" data-screen="shop" data-sound="navigation" data-sound-hover="1">Tune Loadout</button>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  private renderModeCard(profile: PlayerProfile, modeId: GameModeId, selected: boolean): string {
    const mode = getGameModeDefinition(modeId);
    const availability = getModeAvailability(profile, modeId);
    const badge = availability === 'available' ? 'Ready' : availability === 'locked' ? `Lv ${mode.unlockLevel}` : 'Soon';
    return `
      <button
        class="mode-card-modern glass-panel ${selected ? 'selected' : ''} availability-${availability}"
        data-action="select-mode"
        data-mode="${modeId}"
        data-sound="${availability === 'locked' ? 'deny' : 'navigation'}"
        data-sound-hover="1"
      >
        <span class="mode-accent" style="--mode-accent:#${mode.accentColor.toString(16).padStart(6, '0')}"></span>
        <span class="mode-badge">${badge}</span>
        <strong>${mode.name}</strong>
        <span>${mode.description}</span>
      </button>
    `;
  }

  private renderShopScreen(profile: PlayerProfile, previewSkinId: SkinId | null): string {
    const previewSkin = getSkinDefinition(previewSkinId ?? profile.selectedSkinId);
    return `
      <section class="screen-panel shop-panel">
        <div class="screen-header">
          <div>
            <span class="eyebrow">Shop</span>
            <h1>Skins, Upgrades, And Premium Preview</h1>
            <p>The live fighter in the background reflects your equipped or selected preview skin. Upgrades stay coin-funded and premium cards remain disabled as a future-ready shell.</p>
          </div>
          <button class="menu-button subtle" data-action="navigate" data-screen="main" data-sound="navigation" data-sound-hover="1">Back</button>
        </div>
        <div class="shop-tabs">
          <button class="shop-tab ${profile.shopSection === 'skins' ? 'active' : ''}" data-action="set-shop" data-section="skins" data-sound="navigation" data-sound-hover="1">Skins</button>
          <button class="shop-tab ${profile.shopSection === 'upgrades' ? 'active' : ''}" data-action="set-shop" data-section="upgrades" data-sound="navigation" data-sound-hover="1">Upgrades</button>
          <button class="shop-tab ${profile.shopSection === 'premium' ? 'active' : ''}" data-action="set-shop" data-section="premium" data-sound="navigation" data-sound-hover="1">Premium</button>
        </div>
        <div class="shop-layout">
          <div class="shop-preview glass-panel" style="--preview-skin:#${previewSkin.primaryColor.toString(16).padStart(6, '0')}; --preview-glow:#${previewSkin.auraColor.toString(16).padStart(6, '0')}">
            <span class="eyebrow">Live Preview</span>
            <h2>${previewSkin.name}</h2>
            <p>${previewSkin.unlockLabel}</p>
            <div class="preview-swatch"></div>
            <div class="preview-meta">
              <span>${previewSkinId ? 'Preview selected' : 'Equipped preview'}</span>
              <strong>${profile.selectedSkinId === previewSkin.id ? 'Equipped' : 'Inspecting'}</strong>
            </div>
            ${previewSkinId ? '<button class="menu-button subtle" data-action="clear-preview" data-sound="navigation" data-sound-hover="1">Return To Equipped</button>' : ''}
          </div>
          ${profile.shopSection === 'skins' ? this.renderSkinsSection(profile, this.metaView?.skinFilter ?? 'all') : profile.shopSection === 'upgrades' ? this.renderUpgradeSection(profile) : this.renderPremiumSection(profile)}
        </div>
      </section>
    `;
  }

  private renderSkinsSection(profile: PlayerProfile, filter: SkinFilter): string {
    const skins = SKINS.filter((skin) => {
      const owned = profile.unlockedSkins.includes(skin.id);
      const equipped = profile.selectedSkinId === skin.id;
      if (filter === 'owned') {
        return owned;
      }
      if (filter === 'locked') {
        return !owned;
      }
      if (filter === 'equipped') {
        return equipped;
      }
      return true;
    });
    return `
      <div class="shop-content skin-grid-modern">
        <div class="skin-filter-row">
          ${(['all', 'owned', 'locked', 'equipped'] as SkinFilter[]).map((entry) => `<button class="shop-tab ${filter === entry ? 'active' : ''}" data-action="set-skin-filter" data-filter="${entry}" data-sound="navigation" data-sound-hover="1">${entry.toUpperCase()}</button>`).join('')}
        </div>
        ${
          skins.length === 0
            ? `
              <article class="glass-panel empty-state-card">
                <span class="eyebrow">No Skins Here Yet</span>
                <h3>Nothing matches the current filter.</h3>
                <p>Swap the filter to see owned, locked, or equipped looks and keep the preview pinned with the Preview button.</p>
              </article>
            `
            : ''
        }
        ${skins.map((skin) => {
          const owned = profile.unlockedSkins.includes(skin.id);
          const equipped = profile.selectedSkinId === skin.id;
          const purchasable = typeof skin.coinCost === 'number' || typeof skin.gemCost === 'number';
          const price = skin.coinCost ? `${skin.coinCost} coins` : skin.gemCost ? `${skin.gemCost} gems` : 'Unlock only';
          const previewed = this.metaView?.previewSkinId === skin.id;
          return `
            <article
              class="skin-card-modern glass-panel ${owned ? 'owned' : 'locked'} ${equipped ? 'equipped' : ''} ${previewed ? 'previewed' : ''}"
            >
              <div class="skin-card-top">
                <span class="skin-name">${skin.name}</span>
                <span class="skin-price">${previewed ? 'Previewing' : owned ? (equipped ? 'Equipped' : 'Owned') : price}</span>
              </div>
              <div
                class="skin-art"
                style="--skin-main:#${skin.primaryColor.toString(16).padStart(6, '0')}; --skin-glow:#${skin.auraColor.toString(16).padStart(6, '0')};"
              ></div>
              <p>${skin.unlockLabel}</p>
              <div class="card-actions">
                <button class="menu-button subtle" data-action="preview-skin" data-skin="${skin.id}" data-sound="navigation" data-sound-hover="1">Preview</button>
                ${
                  owned
                    ? `<button class="menu-button ${equipped ? 'subtle' : ''}" data-action="select-skin" data-skin="${skin.id}" data-sound="${equipped ? 'navigation' : 'confirm'}" data-sound-hover="1">${equipped ? 'Equipped' : 'Equip'}</button>`
                    : purchasable
                      ? `<button class="menu-button primary" data-action="buy-skin" data-skin="${skin.id}" data-sound="purchase" data-sound-hover="1">Buy</button>`
                      : `<button class="menu-button subtle" disabled>Locked Challenge</button>`
                }
              </div>
            </article>
          `;
        }).join('')}
      </div>
    `;
  }

  private renderUpgradeSection(profile: PlayerProfile): string {
    const cap = getUpgradeRankCap(profile.level);
    return `
      <div class="shop-content upgrade-layout">
        <div class="upgrade-preview glass-panel">
          <span class="eyebrow">Character Preview</span>
          <h2>Build Control</h2>
          <p>Upgrade points unlock with level ups. Coin spend is permanent until you free-respec.</p>
          <div class="mode-stats">
            <div><span>Upgrade Points</span><strong>${profile.upgradePoints}</strong></div>
            <div><span>Rank Cap</span><strong>${cap}/5</strong></div>
            <div><span>Coins</span><strong>${this.formatNumber(profile.coins)}</strong></div>
          </div>
          <button class="menu-button subtle" data-action="reset-upgrades" data-sound="navigation" data-sound-hover="1">Free Respec</button>
        </div>
        <div class="upgrade-groups">
          ${['combat', 'survival', 'special']
            .map((category) => {
              return `
                <section class="upgrade-group glass-panel">
                  <div class="section-minihead">
                    <span class="eyebrow">${category}</span>
                    <strong>${category === 'combat' ? 'Aggression' : category === 'survival' ? 'Durability' : 'Special Systems'}</strong>
                  </div>
                  <div class="upgrade-list">
                    ${UPGRADE_NODES.filter((node) => node.category === category)
                      .map((node) => {
                        const currentRank = profile.upgrades[node.id];
                        const nextCost = getUpgradeCost(node.id, currentRank);
                        const blocked = currentRank >= cap || currentRank >= node.maxRank || profile.upgradePoints <= 0;
                        return `
                          <article class="upgrade-node">
                            <div class="upgrade-node-head">
                              <div>
                                <strong>${node.name}</strong>
                                <span>${node.description}</span>
                              </div>
                              <div class="upgrade-rank">Lv ${currentRank}/${node.maxRank}</div>
                            </div>
                            <div class="upgrade-node-foot">
                              <span>${this.getNextUpgradeText(node.id, currentRank)} | ${nextCost} coins</span>
                              <button
                                class="menu-button ${blocked ? 'subtle' : 'primary'}"
                                data-action="buy-upgrade"
                                data-node="${node.id}"
                                data-sound="${blocked ? 'deny' : 'upgrade'}"
                                data-sound-hover="1"
                                ${blocked ? 'disabled' : ''}
                              >
                                ${blocked ? 'Cap / No Points' : 'Upgrade'}
                              </button>
                            </div>
                          </article>
                        `;
                      })
                      .join('')}
                  </div>
                </section>
              `;
            })
            .join('')}
        </div>
      </div>
    `;
  }

  private renderPremiumSection(profile: PlayerProfile): string {
    return `
      <div class="shop-content premium-grid">
        ${PREMIUM_OFFERS.map((offer) => {
          return `
            <article class="premium-card glass-panel">
              <span class="premium-badge">${offer.badge}</span>
              <h2>${offer.name}</h2>
              <p>${offer.description}</p>
              <div class="mode-stats">
                <div><span>Preview Price</span><strong>${offer.gemCost} gems</strong></div>
                <div><span>Your Gems</span><strong>${profile.gems}</strong></div>
                <div><span>Status</span><strong>Unavailable</strong></div>
              </div>
              <button class="menu-button subtle" disabled>Coming Soon</button>
            </article>
          `;
        }).join('')}
      </div>
    `;
  }

  private renderProfileScreen(profile: PlayerProfile): string {
    const rank = getRankForLevel(profile.level);
    const totalAchievements = ACHIEVEMENTS.length;
    const achievementProgress = Math.round((profile.unlockedAchievements.length / Math.max(totalAchievements, 1)) * 100);
    return `
      <section class="screen-panel profile-panel">
        <div class="screen-header">
          <div>
            <span class="eyebrow">Profile</span>
            <h1>${TITLES.find((title) => title.id === profile.selectedTitleId)?.name ?? 'Rookie'} Profile</h1>
            <p>Track lifetime stats, mastery progress, challenge advancement, and achievement completion from one place.</p>
          </div>
          <div class="hero-actions">
            <button class="menu-button" data-action="navigate" data-screen="settings" data-sound="navigation" data-sound-hover="1">Settings</button>
            <button class="menu-button subtle" data-action="navigate" data-screen="main" data-sound="navigation" data-sound-hover="1">Back</button>
          </div>
        </div>
        <div class="profile-layout">
          <section class="profile-card glass-panel">
            <span class="eyebrow">Identity</span>
            <h2>Level ${profile.level} | ${rank.name}</h2>
            <p>Equipped skin: ${getSkinDefinition(profile.selectedSkinId).name}</p>
            <div class="mode-stats">
              <div><span>Wins</span><strong>${profile.lifetimeStats.wins}</strong></div>
              <div><span>Losses</span><strong>${profile.lifetimeStats.losses}</strong></div>
              <div><span>Finishers</span><strong>${profile.lifetimeStats.totalFinishers}</strong></div>
            </div>
            <div class="progress-line">
              <span>Achievements</span>
              <div class="line-track"><div class="line-fill" style="width:${achievementProgress}%"></div></div>
              <strong>${achievementProgress}%</strong>
            </div>
          </section>
          <section class="profile-card glass-panel">
            <span class="eyebrow">Lifetime Stats</span>
            <div class="stats-stack">
              <div><span>Total Play Time</span><strong>${Math.round(profile.lifetimeStats.totalPlaySeconds / 60)} min</strong></div>
              <div><span>Damage Dealt</span><strong>${this.formatNumber(Math.round(profile.lifetimeStats.totalDamageDealt))}</strong></div>
              <div><span>Damage Taken</span><strong>${this.formatNumber(Math.round(profile.lifetimeStats.totalDamageTaken))}</strong></div>
              <div><span>Rage Activations</span><strong>${profile.lifetimeStats.totalRageUses}</strong></div>
            </div>
          </section>
          <section class="profile-card glass-panel">
            <span class="eyebrow">Weapon Mastery</span>
            <div class="mastery-stack">
              ${(['sword', 'gun', 'power'] as WeaponMode[])
                .map((weapon) => {
                  const mastery = profile.weaponMastery[weapon];
                  const next = getWeaponMasteryRequirement(mastery.level);
                  const fill = mastery.level >= 10 ? 100 : Math.round((mastery.xp / Math.max(next, 1)) * 100);
                  return `
                    <div class="mastery-row">
                      <div>
                        <strong>${weapon.toUpperCase()}</strong>
                        <span>Level ${mastery.level}</span>
                      </div>
                      <div class="line-track"><div class="line-fill" style="width:${fill}%"></div></div>
                      <strong>${mastery.level >= 10 ? 'MAX' : `${mastery.xp}/${next}`}</strong>
                    </div>
                  `;
                })
                .join('')}
            </div>
          </section>
          <section class="profile-card glass-panel">
            <span class="eyebrow">Challenge Progress</span>
            <div class="stats-stack">
              <div><span>Tiers Unlocked</span><strong>${profile.unlockedChallengeTiers.length}/${CHALLENGE_TIERS.length}</strong></div>
              <div><span>Modes Unlocked</span><strong>${profile.unlockedModes.length}/${GAME_MODES.length}</strong></div>
              <div><span>Skins Unlocked</span><strong>${profile.unlockedSkins.length}/${SKINS.length}</strong></div>
              <div><span>Titles Unlocked</span><strong>${profile.unlockedTitles.length}/${TITLES.length}</strong></div>
            </div>
          </section>
        </div>
      </section>
    `;
  }

  private renderSettingsScreen(profile: PlayerProfile, cloudSession: CloudSessionState): string {
    const volumeOptions = [0, 25, 50, 75, 100];
    return `
      <section class="screen-panel settings-panel">
        <div class="screen-header">
          <div>
            <span class="eyebrow">Settings</span>
            <h1>Fight Control Center</h1>
            <p>Adjust volume, difficulty assists, shake intensity, visuals, and replay the tutorial without leaving the progression shell.</p>
          </div>
          <button class="menu-button subtle" data-action="navigate" data-screen="main" data-sound="navigation" data-sound-hover="1">Back</button>
        </div>
        <div class="profile-layout">
          <section class="profile-card glass-panel">
            <span class="eyebrow">Audio</span>
            <div class="stats-stack">
              ${[
                ['masterVolume', 'Master', profile.settings.masterVolume],
                ['combatVolume', 'Combat', profile.settings.combatVolume],
                ['uiVolume', 'UI', profile.settings.uiVolume],
                ['crowdVolume', 'Crowd', profile.settings.crowdVolume],
              ]
                .map(
                  ([setting, label, value]) => `
                    <div class="settings-row">
                      <span>${label}</span>
                      <div class="settings-chip-row">
                        ${volumeOptions
                          .map(
                            (option) => `
                              <button
                                class="shop-tab ${Number(value) === option ? 'active' : ''}"
                                data-action="update-setting"
                                data-setting="${setting}"
                                data-value="${option}"
                                data-sound="navigation"
                                data-sound-hover="1"
                              >${option}</button>
                            `,
                          )
                          .join('')}
                      </div>
                    </div>
                  `,
                )
                .join('')}
            </div>
          </section>
          <section class="profile-card glass-panel">
            <span class="eyebrow">Presentation</span>
            <div class="stats-stack">
              <div class="settings-row">
                <span>Theme</span>
                <div class="settings-chip-row">
                  ${this.renderThemeButton(profile.themeMode, 'dark', 'Dark')}
                  ${this.renderThemeButton(profile.themeMode, 'light', 'Light')}
                </div>
              </div>
              <div class="settings-row">
                <span>Visual Mode</span>
                <div class="settings-chip-row">
                  ${this.renderPresentationButton(profile.presentationMode, '2_5d', '2.5D')}
                  ${this.renderPresentationButton(profile.presentationMode, '2d', '2D')}
                </div>
              </div>
              <div class="settings-row">
                <span>Screen Shake</span>
                <div class="settings-chip-row">
                  ${([0, 50, 100] as const)
                    .map(
                      (option) => `
                        <button
                          class="shop-tab ${profile.settings.screenShake === option ? 'active' : ''}"
                          data-action="update-setting"
                          data-setting="screenShake"
                          data-value="${option}"
                          data-sound="navigation"
                          data-sound-hover="1"
                        >${option}%</button>
                      `,
                    )
                    .join('')}
                  </div>
              </div>
              <div class="settings-row">
                <span>Preferred Stage</span>
                <div class="settings-chip-row">
                  ${STAGE_VARIANTS.map(
                    (stage) => `
                      <button
                        class="shop-tab ${profile.selectedStageId === stage.id ? 'active' : ''}"
                        data-action="set-stage"
                        data-stage="${stage.id}"
                        data-sound="navigation"
                        data-sound-hover="1"
                      >${stage.name}</button>
                    `,
                  ).join('')}
                </div>
              </div>
            </div>
          </section>
          <section class="profile-card glass-panel">
            <span class="eyebrow">Assist + Training</span>
            <div class="stats-stack">
              <div class="settings-row">
                <span>Difficulty Assist</span>
                <div class="settings-chip-row">
                  <button class="shop-tab ${profile.settings.difficultyAssist === 'standard' ? 'active' : ''}" data-action="update-setting" data-setting="difficultyAssist" data-value="standard" data-sound="navigation" data-sound-hover="1">Standard</button>
                  <button class="shop-tab ${profile.settings.difficultyAssist === 'forgiving' ? 'active' : ''}" data-action="update-setting" data-setting="difficultyAssist" data-value="forgiving" data-sound="navigation" data-sound-hover="1">Forgiving</button>
                </div>
              </div>
              <div class="settings-row">
                <span>Tutorial</span>
                <div class="settings-chip-row">
                  <button class="menu-button" data-action="replay-tutorial" data-sound="navigation" data-sound-hover="1">Replay Tutorial Fight</button>
                </div>
              </div>
              <div class="settings-row">
                <span>Help Surface</span>
                <div class="settings-chip-row">
                  <button class="shop-tab active">Home + Tab Overlay</button>
                  <button class="shop-tab active">Backquote Debug</button>
                </div>
              </div>
            </div>
          </section>
          <section class="profile-card glass-panel">
            <span class="eyebrow">Account</span>
            ${this.renderAccountPanel(cloudSession, true)}
          </section>
          <section class="profile-card glass-panel">
            <span class="eyebrow">Controller Map</span>
            <div class="stats-stack">
              <div><span>Movement</span><strong>Left stick / D-pad</strong></div>
              <div><span>Jump / Light / Heavy / Special</span><strong>A / X / Y / B</strong></div>
              <div><span>Block / Reload</span><strong>LB / RB</strong></div>
              <div><span>Rage / Context</span><strong>LT / RT</strong></div>
              <div><span>Help / Debug</span><strong>Start / Back</strong></div>
            </div>
          </section>
          <section class="profile-card glass-panel">
            <span class="eyebrow">Save Data</span>
            <div class="stats-stack">
              <div><span>Profile Version</span><strong>v${profile.profileVersion}</strong></div>
              <div><span>Storage</span><strong>Session save + cloud for linked accounts</strong></div>
              <div><span>Cloud Status</span><strong>${this.getCloudStatusLabel(cloudSession)}</strong></div>
            </div>
            <div class="card-actions">
              <button class="menu-button" data-action="export-save" data-sound="confirm" data-sound-hover="1">Export Save</button>
              <button class="menu-button" data-action="import-save" data-sound="navigation" data-sound-hover="1">Import Save</button>
              <button class="menu-button subtle" data-action="reset-profile" data-sound="deny" data-sound-hover="1">Reset Profile</button>
            </div>
          </section>
        </div>
      </section>
    `;
  }

  private renderDrawer(view: HudMetaView): string {
    if (view.menuDrawer === 'none') {
      return '';
    }

    if (view.menuDrawer === 'daily') {
      const nextDay = ((view.profile.dailyStreak.cycleDay % 7) || 0) + 1;
      return `
        <aside class="drawer-panel glass-panel">
          <div class="drawer-head">
            <div>
              <span class="eyebrow">Daily Rewards</span>
              <h2>Streak ${view.profile.dailyStreak.streakCount} days</h2>
            </div>
            <button class="menu-button subtle" data-action="close-drawer" data-sound="navigation" data-sound-hover="1">Close</button>
          </div>
          <div class="stats-stack">
            <div><span>Today</span><strong>${view.dailyRewardCoins > 0 ? `+${view.dailyRewardCoins} coins` : 'Already claimed'}</strong></div>
            <div><span>Next reward</span><strong>Day ${nextDay}</strong></div>
            <div><span>Streak bonus</span><strong>+${Math.min(view.profile.dailyStreak.streakCount, 7) * 5}% coins</strong></div>
          </div>
        </aside>
      `;
    }

    if (view.menuDrawer === 'account') {
      return `
        <aside class="drawer-panel glass-panel">
          <div class="drawer-head">
            <div>
              <span class="eyebrow">Account</span>
              <h2>Cloud Save Access</h2>
            </div>
            <button class="menu-button subtle" data-action="close-drawer" data-sound="navigation" data-sound-hover="1">Close</button>
          </div>
          ${this.renderAccountPanel(view.cloudSession, false)}
        </aside>
      `;
    }

    return `
      <aside class="drawer-panel glass-panel">
        <div class="drawer-head">
          <div>
            <span class="eyebrow">Missions</span>
            <h2>Daily + Weekly Progress</h2>
          </div>
          <button class="menu-button subtle" data-action="close-drawer" data-sound="navigation" data-sound-hover="1">Close</button>
        </div>
        <div class="drawer-missions">
          ${view.profile.dailyMissions
            .map((mission) => {
              const definition = getMissionDefinition(mission.id);
              return `
                <div class="mission-row ${mission.completed ? 'complete' : ''}">
                  <div>
                    <strong>${definition.name}</strong>
                    <span>${definition.description}</span>
                  </div>
                  <strong>${Math.min(mission.progress, definition.target)}/${definition.target}</strong>
                </div>
              `;
            })
            .join('')}
          ${view.profile.weeklyMissions
            .map((mission) => {
              const definition = getMissionDefinition(mission.id);
              return `
                <div class="mission-row ${mission.completed ? 'complete' : ''}">
                  <div>
                    <strong>${definition.name}</strong>
                    <span>${definition.description}</span>
                  </div>
                  <strong>${Math.min(mission.progress, definition.target)}/${definition.target}</strong>
                </div>
              `;
            })
            .join('')}
        </div>
      </aside>
    `;
  }

  private renderRewardShell(summary: PostMatchSummary): string {
    return `
      <div class="reward-shell glass-panel" data-outcome="${summary.outcome}">
        <div class="reward-header">
          <div>
            <span class="eyebrow">Post Match</span>
            <h1>${summary.outcome === 'win' ? 'Victory Logged' : 'Defeat Logged'}</h1>
            <p>${summary.challengeTier.name} tier | ${summary.rankAfter.name} rank | ${summary.analytics.modeId === 'survival' ? `Survival ${summary.analytics.roundWins}/5` : `Rounds ${summary.analytics.roundWins}-${summary.analytics.roundLosses}`} | quick replay is one click away.</p>
          </div>
          <div class="results-actions">
            <div class="theme-toggle" role="group" aria-label="Theme">
              ${this.renderThemeButton(this.metaView?.profile.themeMode ?? 'dark', 'dark', 'Dark')}
              ${this.renderThemeButton(this.metaView?.profile.themeMode ?? 'dark', 'light', 'Light')}
            </div>
            <div class="theme-toggle" role="group" aria-label="Visual Mode">
              ${this.renderPresentationButton(this.metaView?.profile.presentationMode ?? '2_5d', '2_5d', '2.5D')}
              ${this.renderPresentationButton(this.metaView?.profile.presentationMode ?? '2_5d', '2d', '2D')}
            </div>
            <button class="menu-button primary" data-action="play-again" data-sound="reward" data-sound-hover="1">Play Again</button>
            <button class="menu-button" data-action="open-upgrades" data-sound="navigation" data-sound-hover="1">Upgrade</button>
            <button class="menu-button" data-action="back-to-profile" data-sound="navigation" data-sound-hover="1">Back To Profile</button>
            <button class="menu-button subtle" data-action="back-to-hub" data-sound="navigation" data-sound-hover="1">Back To Hub</button>
          </div>
        </div>
        <div class="reward-grid">
          <section class="reward-card accent">
            <span class="eyebrow">Coins</span>
            <strong id="reward-coins-value">0</strong>
            <div class="reward-sublist">
              ${summary.rewards.bonusCoins.map((line) => `<span class="reward-bonus hidden" data-bonus-line>${line.label} +${line.amount}</span>`).join('')}
            </div>
          </section>
          <section class="reward-card accent">
            <span class="eyebrow">XP</span>
            <strong id="reward-xp-value">0</strong>
            <div class="progress-line">
              <span>Level ${summary.levelBefore} to ${summary.levelAfter}</span>
              <div class="line-track"><div id="reward-level-fill" class="line-fill"></div></div>
              <strong>${summary.rankAfter.name}</strong>
            </div>
          </section>
          <section class="reward-card">
            <span class="eyebrow">Mission Progress</span>
            <div class="reward-sublist">
              ${summary.missionsCompleted.length > 0 ? summary.missionsCompleted.map((entry) => `<span>${entry.mission.name} +${entry.rewardCoins}c / +${entry.rewardXp}xp</span>`).join('') : '<span>No mission payout this round.</span>'}
            </div>
          </section>
          <section class="reward-card">
            <span class="eyebrow">Unlocks</span>
            <div class="unlock-list">
              ${this.renderRewardUnlocks(summary)}
            </div>
          </section>
          <section class="reward-card">
            <span class="eyebrow">Mastery</span>
            <div class="reward-sublist">
              ${summary.masteryProgress.map((entry) => `<span>${entry.weapon.toUpperCase()} +${entry.xpGained} XP | Lv ${entry.levelAfter}</span>`).join('')}
            </div>
          </section>
          <section class="reward-card">
            <span class="eyebrow">Bonuses</span>
            <div class="reward-sublist">
              <span>Base coins ${summary.rewards.baseCoins}</span>
              <span>Tier multiplier ${summary.rewards.challengeMultiplier.toFixed(2)}x</span>
              <span>Streak multiplier ${summary.rewards.streakMultiplier.toFixed(2)}x</span>
              <span>Base XP ${summary.rewards.baseXp}</span>
            </div>
          </section>
          <section class="reward-card">
            <span class="eyebrow">Combat Analytics</span>
            <div class="reward-sublist">
              <span>Hit confirm ${(summary.analytics.hitConfirmRate * 100).toFixed(0)}%</span>
              <span>Cancels ${summary.analytics.cancelCount}</span>
              <span>Dropped inputs ${summary.analytics.droppedInputs}</span>
              <span>Reload efficiency ${summary.analytics.reloadEfficiency.toFixed(1)}</span>
              <span>AI counters ${summary.analytics.aiCountersTriggered}</span>
              <span>Opponent ${summary.analytics.opponentVariantId.replace(/_/g, ' ')}</span>
              <span>Stage ${summary.analytics.stageVariantId.replace(/_/g, ' ')}</span>
              <span>Visual mode ${summary.analytics.presentationMode === '2d' ? '2D' : '2.5D'}</span>
            </div>
          </section>
        </div>
      </div>
    `;
  }

  private renderRewardUnlocks(summary: PostMatchSummary): string {
    const unlocks = [
      ...summary.achievementsUnlocked.map((entry) => entry.name),
      ...summary.skinsUnlocked.map((entry) => `Skin: ${entry.name}`),
      ...summary.titlesUnlocked.map((entry) => `Title: ${entry.name}`),
      ...summary.challengeTiersUnlocked.map((entry) => `Tier: ${entry.name}`),
    ];
    return unlocks.length > 0
      ? unlocks.map((entry) => `<span class="unlock-chip">${entry}</span>`).join('')
      : '<span class="unlock-chip muted">No new unlocks this run</span>';
  }

  private updateRewardAnimation(): void {
    if (!this.metaView?.summary) {
      return;
    }

    const summary = this.metaView.summary;
    const coinsEl = document.getElementById('reward-coins-value');
    const xpEl = document.getElementById('reward-xp-value');
    const levelFill = document.getElementById('reward-level-fill');
    if (!coinsEl || !xpEl || !levelFill) {
      return;
    }

    const time = this.rewardAnimation.time;
    const coinsProgress = Math.max(0, Math.min(1, time / 0.75));
    const xpProgress = Math.max(0, Math.min(1, (time - 0.45) / 0.85));
    const fillProgress = Math.max(0, Math.min(1, (time - 0.65) / 0.9));

    coinsEl.textContent = this.formatNumber(Math.round(summary.rewards.totalCoins * coinsProgress));
    xpEl.textContent = this.formatNumber(Math.round(summary.rewards.totalXp * xpProgress));
    levelFill.style.width = `${Math.round(fillProgress * 100)}%`;

    document.querySelectorAll<HTMLElement>('[data-bonus-line]').forEach((element, index) => {
      element.classList.toggle('hidden', time < 0.7 + index * 0.12);
    });

    if (!this.rewardAnimation.coinsPlayed && time >= 0.2) {
      this.rewardAnimation.coinsPlayed = true;
      this.uiAudio.play('reward');
    }
    if (!this.rewardAnimation.xpPlayed && time >= 0.65) {
      this.rewardAnimation.xpPlayed = true;
      this.uiAudio.play('confirm');
    }
    if (!this.rewardAnimation.bonusPlayed && time >= 1.05) {
      this.rewardAnimation.bonusPlayed = true;
      this.uiAudio.play('navigation');
    }

    if (time > 1.8) {
      this.rewardAnimation.active = false;
    }
  }

  private getCompletedMissionCount(profile: PlayerProfile): number {
    return [...profile.dailyMissions, ...profile.weeklyMissions].filter((mission) => mission.completed).length;
  }

  private readAccountCredentials(target: HTMLElement): { email: string; password: string } | null {
    const scope = target.closest<HTMLElement>('[data-auth-scope="account"]');
    if (!scope) {
      return null;
    }

    const emailInput = scope.querySelector<HTMLInputElement>('input[name="account-email"]');
    const passwordInput = scope.querySelector<HTMLInputElement>('input[name="account-password"]');
    const email = emailInput?.value.trim() ?? '';
    const password = passwordInput?.value ?? '';

    if (!email || !password) {
      return null;
    }

    return { email, password };
  }

  private readDataset<T extends string>(element: HTMLElement, key: string, fallback: T): T {
    const value = element.dataset[key];
    return (value as T | undefined) ?? fallback;
  }

  private renderAccountPanel(cloudSession: CloudSessionState, compact: boolean): string {
    const statusCopy = this.getCloudStatusCopy(cloudSession);
    const providerLabel =
      cloudSession.authMode === 'google'
        ? 'Google linked'
        : cloudSession.authMode === 'email'
          ? 'Email linked'
          : 'Guest session';

    return `
      <div class="account-panel" data-auth-scope="account">
        <div class="stats-stack">
          <div><span>Status</span><strong>${providerLabel}</strong></div>
          <div><span>Sync</span><strong>${statusCopy}</strong></div>
          <div><span>UID</span><strong>${this.formatUid(cloudSession.userId)}</strong></div>
          ${cloudSession.email ? `<div><span>Email</span><strong>${cloudSession.email}</strong></div>` : ''}
        </div>
        <p class="account-copy">
          ${
            cloudSession.isLinked
              ? 'This account will recover progress from the cloud and no longer depends on a persistent local browser save.'
              : 'Guest play stays in this browser session only. Link Google or email to secure progress in the cloud.'
          }
        </p>
        ${
          cloudSession.isLinked
            ? `
              <div class="card-actions">
                <button class="menu-button subtle" data-action="logout-user" data-sound="navigation" data-sound-hover="1">Log Out</button>
              </div>
            `
            : `
              <div class="auth-fields">
                <label class="auth-field">
                  <span>Email</span>
                  <input class="auth-input" type="email" name="account-email" placeholder="pilot@arena.com" autocomplete="email" />
                </label>
                <label class="auth-field">
                  <span>Password</span>
                  <input class="auth-input" type="password" name="account-password" placeholder="Create a password" autocomplete="${compact ? 'current-password' : 'new-password'}" />
                </label>
              </div>
              <div class="card-actions auth-actions">
                <button class="menu-button" data-action="continue-guest" data-sound="navigation" data-sound-hover="1">Continue As Guest</button>
                <button class="menu-button" data-action="login-google" data-sound="confirm" data-sound-hover="1">Sign In With Google</button>
                <button class="menu-button" data-action="login-email-signin" data-sound="confirm" data-sound-hover="1">Log In</button>
                <button class="menu-button primary" data-action="login-email-register" data-sound="purchase" data-sound-hover="1">Create Account</button>
              </div>
            `
        }
      </div>
    `;
  }

  private getCloudStatusLabel(cloudSession: CloudSessionState): string {
    if (cloudSession.syncStatus === 'syncing' || cloudSession.syncStatus === 'signing_in') {
      return 'Syncing';
    }
    if (cloudSession.syncStatus === 'offline') {
      return 'Offline fallback';
    }
    if (cloudSession.syncStatus === 'error') {
      return 'Sync issue';
    }
    if (cloudSession.isLinked) {
      return 'Cloud secured';
    }
    return 'Guest mode';
  }

  private getCloudStatusCopy(cloudSession: CloudSessionState): string {
    if (cloudSession.lastSyncError) {
      return cloudSession.lastSyncError;
    }
    switch (cloudSession.syncStatus) {
      case 'syncing':
      case 'signing_in':
        return 'Syncing in background';
      case 'offline':
        return 'Offline fallback active';
      case 'error':
        return 'Cloud unavailable, local save still active';
      case 'synced':
        return cloudSession.isLinked ? 'Cloud synced' : 'Guest session only';
      case 'idle':
      default:
        return cloudSession.isLinked ? 'Cloud ready' : 'Session-only guest mode';
    }
  }

  private formatUid(uid: string | null): string {
    if (!uid) {
      return 'Pending';
    }
    if (uid.length <= 12) {
      return uid;
    }
    return `${uid.slice(0, 6)}...${uid.slice(-4)}`;
  }

  private renderThemeButton(currentTheme: ThemeMode, theme: ThemeMode, label: string): string {
    return `
      <button
        class="theme-button ${currentTheme === theme ? 'active' : ''}"
        data-action="set-theme"
        data-theme="${theme}"
        data-sound="navigation"
        data-sound-hover="1"
        type="button"
      >
        ${label}
      </button>
    `;
  }

  private renderPresentationButton(currentMode: '2d' | '2_5d', mode: '2d' | '2_5d', label: string): string {
    return `
      <button
        class="theme-button ${currentMode === mode ? 'active' : ''}"
        data-action="set-presentation"
        data-mode="${mode}"
        data-sound="navigation"
        data-sound-hover="1"
        type="button"
      >
        ${label}
      </button>
    `;
  }

  private getNextUpgradeText(nodeId: UpgradeNodeId, currentRank: number): string {
    const nextRank = currentRank + 1;
    switch (nodeId) {
      case 'ferocity':
        return `Next damage bonus ${nextRank * 4}%`;
      case 'tempo':
        return `Next attack speed ${nextRank * 2}%`;
      case 'breaker':
        return `Next hit stun ${nextRank * 5}%`;
      case 'vitality':
        return `Next max health +${nextRank * 6}`;
      case 'guard':
        return `Next damage reduction ${nextRank * 3}%`;
      case 'hazard_ward':
        return `Next guard pressure resist ${nextRank * 6}%`;
      case 'rage_flow':
        return `Next rage gain ${nextRank * 6}%`;
      case 'shock_core':
        return `Next shockwave bonus ${nextRank * 6}%`;
      case 'finisher_sense':
        return `Next finisher window +${(nextRank * 0.15).toFixed(2)}s`;
      default:
        return `Next rank ${nextRank}`;
    }
  }

  private focusPrimaryAction(root: HTMLElement, selector: string): void {
    window.requestAnimationFrame(() => {
      const target = root.querySelector<HTMLElement>(selector);
      target?.focus();
    });
  }

  private formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }
}
