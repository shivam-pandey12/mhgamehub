import { formatTime, clamp } from '../utils/math.js';
import {
  ABILITY_CONFIG,
  ACHIEVEMENTS,
  CAREER_MISSIONS,
  CHALLENGES,
  CUP_MODES,
  DIFFICULTIES,
  DISTRICTS,
  LOADOUT_OPTIONS,
  MISSION_MODIFIERS,
  MISSIONS,
  PROGRESSION_RULES,
  TOUCH_LAYOUTS,
  VEHICLE_CATALOG,
} from '../config.js';

export class HUDManager {
  constructor() {
    this.selectedRole = 'robber';
    this.selectedMissionByRole = {
      robber: MISSIONS.robber[0].id,
      police: MISSIONS.police[0].id,
    };
    this.selectedVehicleByRole = {
      robber: VEHICLE_CATALOG.robber[0].id,
      police: VEHICLE_CATALOG.police[0].id,
    };
    this.selectedChallengeByRole = {
      robber: CHALLENGES.find((challenge) => challenge.role === 'robber')?.id,
      police: CHALLENGES.find((challenge) => challenge.role === 'police')?.id,
    };
    this.selectedMode = 'mission';
    this.selectedCareerByRole = {
      robber: CAREER_MISSIONS.robber[0].id,
      police: CAREER_MISSIONS.police[0].id,
    };
    this.selectedCupId = CUP_MODES[0].id;
    this.selectedDifficultyId = 'standard';
    this.selectedModifiers = new Set();
    this.homePage = 'role';
    this.homePages = ['role', 'mission', 'difficulty', 'vehicle', 'loadout', 'summary'];
    this.selectedLoadouts = {
      robber: { primary: 'heavyMachineGun', secondary: 'rearMine', passive: 'none', tire: 'balanced', accent: 'stock' },
      police: { primary: 'taserBullets', secondary: 'empShot', passive: 'none', tire: 'balanced', accent: 'stock' },
    };
    this.progressSnapshot = {
      unlocked: ['armored-muscle', 'interceptor'],
      bestScores: {},
      medals: {},
      completedMissions: {},
      totals: {},
    };
    this.callbacks = {};
    this.startMenu = document.querySelector('#startMenu');
    this.controlsPanel = document.querySelector('#controlsPanel');
    this.settingsPanel = document.querySelector('#settingsPanel');
    this.hud = document.querySelector('#hud');
    this.pauseOverlay = document.querySelector('#pauseOverlay');
    this.resultOverlay = document.querySelector('#resultOverlay');
    this.roleIntro = document.querySelector('#roleIntro');
    this.speedLines = document.querySelector('#speedLines');
    this.radioFeed = document.querySelector('#radioFeed');
    this.damageFeed = document.querySelector('#damageFeed');
    this.eventBanner = document.querySelector('#eventBanner');
    this.targetMarker = document.querySelector('#targetMarker');
    this.scoreFeed = document.querySelector('#scoreFeed');
    this.startButton = document.querySelector('#startButton');
    this.continueButton = document.querySelector('#continueButton');
    this.recordsButton = document.querySelector('#recordsButton');
    this.tutorialButton = document.querySelector('#tutorialButton');
    this.fullscreenButton = document.querySelector('#fullscreenButton');
    this.homePageButtons = [...document.querySelectorAll('[data-home-page]')];
    this.homeBackButton = document.querySelector('#homeBackButton');
    this.homeNextButton = document.querySelector('#homeNextButton');
    this.homePageLabel = document.querySelector('#homePageLabel');
    this.careerModeButton = document.querySelector('#careerModeButton');
    this.missionModeButton = document.querySelector('#missionModeButton');
    this.challengeModeButton = document.querySelector('#challengeModeButton');
    this.cupModeButton = document.querySelector('#cupModeButton');
    this.careerGrid = document.querySelector('#careerGrid');
    this.missionGrid = document.querySelector('#missionGrid');
    this.challengeGrid = document.querySelector('#challengeGrid');
    this.cupGrid = document.querySelector('#cupGrid');
    this.difficultyGrid = document.querySelector('#difficultyGrid');
    this.vehicleGrid = document.querySelector('#vehicleGrid');
    this.loadoutGrid = document.querySelector('#loadoutGrid');
    this.modifierGrid = document.querySelector('#modifierGrid');
    this.garagePreviewViewport = document.querySelector('#garagePreviewViewport');
    this.garageSummary = document.querySelector('#garageSummary');
    this.garageStats = document.querySelector('#garageStats');
    this.garageLoadout = document.querySelector('#garageLoadout');
    this.garageMedal = document.querySelector('#garageMedal');
    this.garageBestScore = document.querySelector('#garageBestScore');
    this.radioLog = document.querySelector('#radioLog');
    this.radar = document.querySelector('#radar');
    this.bossHud = document.querySelector('#bossHud');
    this.resultHighlights = document.querySelector('#resultHighlights');
    this.touchControlsLayer = document.querySelector('#touchControlsLayer');
    this.recordsPanel = document.querySelector('#recordsPanel');
    this.recordsSummary = document.querySelector('#recordsSummary');
    this.achievementGrid = document.querySelector('#achievementGrid');
    this.onboardingPanel = document.querySelector('#onboardingPanel');

    this.elements = {
      role: document.querySelector('#hudRole'),
      objective: document.querySelector('#hudObjective'),
      missionName: document.querySelector('#hudMissionName'),
      missionObjective: document.querySelector('#hudMissionObjective'),
      missionProgress: document.querySelector('#hudMissionProgress'),
      missionBonus: document.querySelector('#hudMissionBonus'),
      timer: document.querySelector('#hudTimer'),
      targetLabel: document.querySelector('#hudTargetLabel'),
      targetValue: document.querySelector('#hudTargetValue'),
      intensityValue: document.querySelector('#hudIntensityValue'),
      healthText: document.querySelector('#hudHealthText'),
      healthBar: document.querySelector('#hudHealthBar'),
      nitroText: document.querySelector('#hudNitroText'),
      nitroBar: document.querySelector('#hudNitroBar'),
      alertText: document.querySelector('#hudAlertText'),
      alertBar: document.querySelector('#hudAlertBar'),
      primary: document.querySelector('#hudPrimary'),
      primaryLabel: document.querySelector('#hudPrimaryLabel'),
      secondary: document.querySelector('#hudSecondary'),
      secondaryLabel: document.querySelector('#hudSecondaryLabel'),
      resultKicker: document.querySelector('#resultKicker'),
      resultTitle: document.querySelector('#resultTitle'),
      resultSummary: document.querySelector('#resultSummary'),
      resultStats: document.querySelector('#resultStats'),
      masterVolume: document.querySelector('#masterVolume'),
      soundVolume: document.querySelector('#soundVolume'),
      ambienceVolume: document.querySelector('#ambienceVolume'),
      engineVolume: document.querySelector('#engineVolume'),
      sirenVolume: document.querySelector('#sirenVolume'),
      weaponsVolume: document.querySelector('#weaponsVolume'),
      uiVolume: document.querySelector('#uiVolume'),
      cameraShake: document.querySelector('#cameraShake'),
      cameraShakeIntensity: document.querySelector('#cameraShakeIntensity'),
      motionEffects: document.querySelector('#motionEffects'),
      uiScale: document.querySelector('#uiScale'),
      highContrastHud: document.querySelector('#highContrastHud'),
      radioSubtitles: document.querySelector('#radioSubtitles'),
      minimap: document.querySelector('#minimapToggle'),
      touchControls: document.querySelector('#touchControls'),
      touchLayout: document.querySelector('#touchLayout'),
      touchOpacity: document.querySelector('#touchOpacity'),
      defaultDifficulty: document.querySelector('#defaultDifficulty'),
      radarSize: document.querySelector('#radarSize'),
      performanceDebug: document.querySelector('#performanceDebug'),
      effectsQuality: document.querySelector('#effectsQuality'),
      trafficDensity: document.querySelector('#trafficDensity'),
      resetProgress: document.querySelector('#resetProgressButton'),
      bossTitle: document.querySelector('#bossTitle'),
      bossName: document.querySelector('#bossName'),
      bossHealthBar: document.querySelector('#bossHealthBar'),
      bossPhase: document.querySelector('#bossPhase'),
      onboardingStep: document.querySelector('#onboardingStep'),
      onboardingTitle: document.querySelector('#onboardingTitle'),
      onboardingBody: document.querySelector('#onboardingBody'),
    };

    this.bindMenu();
    this.renderHomePage();
    this.renderGarage();
  }

  bindMenu() {
    document.querySelectorAll('.role-card').forEach((card) => {
      card.addEventListener('click', () => {
        this.selectedRole = card.dataset.role;
        document.querySelectorAll('.role-card').forEach((item) => item.classList.remove('is-selected'));
        card.classList.add('is-selected');
        this.ensureSelectionIsUnlocked();
        this.renderGarage();
        this.emit('click');
      });
    });

    this.startButton.addEventListener('click', () => {
      const vehicle = this.getSelectedVehicle();
      if (!vehicle || !this.isVehicleUnlocked(vehicle)) {
        this.showEvent(vehicle?.requirement || 'Vehicle locked');
        this.emit('click');
        return;
      }
      this.emit('start', {
        role: this.selectedRole,
        mode: this.selectedMode,
        careerId: this.selectedCareerByRole[this.selectedRole],
        missionId: this.selectedMissionByRole[this.selectedRole],
        challengeId: this.selectedChallengeByRole[this.selectedRole],
        cupId: this.selectedCupId,
        vehicleId: this.selectedVehicleByRole[this.selectedRole],
        difficultyId: this.selectedDifficultyId,
        modifiers: [...this.selectedModifiers],
        loadout: this.selectedLoadouts[this.selectedRole],
      });
    });

    this.careerModeButton.addEventListener('click', () => {
      this.selectedMode = 'career';
      this.renderGarage();
      this.emit('click');
    });

    this.missionModeButton.addEventListener('click', () => {
      this.selectedMode = 'mission';
      this.renderGarage();
      this.emit('click');
    });

    this.cupModeButton.addEventListener('click', () => {
      this.selectedMode = 'cup';
      this.renderGarage();
      this.emit('click');
    });

    this.continueButton.addEventListener('click', () => {
      this.selectedMode = 'career';
      this.selectLatestCareer();
      this.setHomePage('mission');
      this.renderGarage();
      this.emit('click');
    });

    this.recordsButton.addEventListener('click', () => {
      this.renderRecords();
      this.recordsPanel.setAttribute('aria-hidden', 'false');
      this.emit('click');
    });

    this.tutorialButton.addEventListener('click', () => {
      this.emit('showOnboarding');
      this.emit('click');
    });

    this.fullscreenButton.addEventListener('click', () => {
      this.emit('fullscreen');
      this.emit('click');
    });

    for (const button of this.homePageButtons) {
      button.addEventListener('click', () => {
        this.setHomePage(button.dataset.homePage);
        this.emit('click');
      });
    }

    this.homeBackButton?.addEventListener('click', () => {
      this.moveHomePage(-1);
      this.emit('click');
    });

    this.homeNextButton?.addEventListener('click', () => {
      this.moveHomePage(1);
      this.emit('click');
    });

    this.challengeModeButton.addEventListener('click', () => {
      this.selectedMode = 'challenge';
      this.renderGarage();
      this.emit('click');
    });

    document.querySelector('#controlsButton').addEventListener('click', () => {
      this.controlsPanel.setAttribute('aria-hidden', 'false');
      this.emit('click');
    });

    document.querySelector('#settingsButton').addEventListener('click', () => {
      this.settingsPanel.setAttribute('aria-hidden', 'false');
      this.emit('click');
    });

    document.querySelector('#closeSettingsButton').addEventListener('click', () => {
      this.settingsPanel.setAttribute('aria-hidden', 'true');
      this.emit('click');
    });

    document.querySelector('#closeControlsButton').addEventListener('click', () => {
      this.controlsPanel.setAttribute('aria-hidden', 'true');
      this.emit('click');
    });

    document.querySelector('#closeRecordsButton').addEventListener('click', () => {
      this.recordsPanel.setAttribute('aria-hidden', 'true');
      this.emit('click');
    });

    document.querySelector('#nextOnboardingButton').addEventListener('click', () => {
      this.emit('nextOnboarding');
      this.emit('click');
    });

    document.querySelector('#skipOnboardingButton').addEventListener('click', () => {
      this.hideOnboarding();
      this.emit('skipOnboarding');
      this.emit('click');
    });

    document.querySelector('#openControlsFromOnboardingButton').addEventListener('click', () => {
      this.controlsPanel.setAttribute('aria-hidden', 'false');
      this.emit('click');
    });

    document.querySelector('#resumeButton').addEventListener('click', () => this.emit('resume'));
    document.querySelector('#restartMissionButton').addEventListener('click', () => this.emit('restartMission'));
    document.querySelector('#garageButton').addEventListener('click', () => this.emit('garage'));
    document.querySelector('#pauseSettingsButton').addEventListener('click', () => this.settingsPanel.setAttribute('aria-hidden', 'false'));
    document.querySelector('#pauseControlsButton').addEventListener('click', () => this.controlsPanel.setAttribute('aria-hidden', 'false'));
    document.querySelector('#pauseHelpButton').addEventListener('click', () => this.emit('showOnboarding'));
    document.querySelector('#quitToMenuButton').addEventListener('click', () => this.emit('quitToMenu'));

    document.querySelector('#restartButton').addEventListener('click', () => {
      this.resultOverlay.classList.add('is-hidden');
      this.showMenu();
      this.emit('restart');
      this.emit('click');
    });

    document.querySelector('#playAgainButton').addEventListener('click', () => {
      this.resultOverlay.classList.add('is-hidden');
      this.emit('playAgain');
      this.emit('click');
    });

    document.querySelector('#changeRoleButton').addEventListener('click', () => {
      this.resultOverlay.classList.add('is-hidden');
      this.showMenu();
      this.emit('changeRole');
      this.emit('click');
    });

    for (const input of [
      this.elements.masterVolume,
      this.elements.soundVolume,
      this.elements.ambienceVolume,
      this.elements.engineVolume,
      this.elements.sirenVolume,
      this.elements.weaponsVolume,
      this.elements.uiVolume,
      this.elements.cameraShake,
      this.elements.cameraShakeIntensity,
      this.elements.motionEffects,
      this.elements.uiScale,
      this.elements.highContrastHud,
      this.elements.radioSubtitles,
      this.elements.minimap,
      this.elements.touchControls,
      this.elements.touchLayout,
      this.elements.touchOpacity,
      this.elements.defaultDifficulty,
      this.elements.radarSize,
      this.elements.performanceDebug,
      this.elements.effectsQuality,
      this.elements.trafficDensity,
    ]) {
      input.addEventListener('input', () => this.emitSettings());
      input.addEventListener('change', () => this.emitSettings());
    }

    this.elements.resetProgress.addEventListener('click', () => {
      this.emit('resetProgress');
      this.emit('click');
    });

    this.bindTouchControls();
  }

  setHomePage(page) {
    if (!this.homePages.includes(page)) return;
    this.homePage = page;
    this.renderHomePage();
  }

  moveHomePage(direction) {
    const index = this.homePages.indexOf(this.homePage);
    const next = clamp(index + direction, 0, this.homePages.length - 1);
    this.setHomePage(this.homePages[next]);
  }

  renderHomePage() {
    this.startMenu?.setAttribute('data-page', this.homePage);
    for (const button of this.homePageButtons || []) {
      button.classList.toggle('is-selected', button.dataset.homePage === this.homePage);
    }
    const index = this.homePages.indexOf(this.homePage);
    const labels = {
      role: 'Choose role and path',
      mission: 'Choose mission type and objective',
      difficulty: 'Pick the chase pressure',
      vehicle: 'Choose and preview your vehicle',
      loadout: 'Tune weapons, perks, and modifiers',
      summary: 'Review and start the chase',
    };
    if (this.homePageLabel) this.homePageLabel.textContent = labels[this.homePage];
    if (this.homeBackButton) this.homeBackButton.disabled = index <= 0;
    if (this.homeNextButton) {
      this.homeNextButton.disabled = index >= this.homePages.length - 1;
      const nextLabel = this.homePages[index + 1];
      this.homeNextButton.textContent = nextLabel ? `Next: ${nextLabel[0].toUpperCase()}${nextLabel.slice(1)}` : 'Ready';
    }
  }

  bindTouchControls() {
    if (!this.touchControlsLayer) return;
    const state = {};
    const setState = () => {
      this.emit('touchInput', {
        throttle: (state.accelerate ? 1 : 0) + (state.brake ? -1 : 0),
        steer: (state.left ? 1 : 0) + (state.right ? -1 : 0),
        nitro: Boolean(state.nitro),
        primary: Boolean(state.primary),
        secondary: Boolean(state.secondary),
        handbrake: Boolean(state.handbrake),
        pause: Boolean(state.pause),
        recenter: Boolean(state.recenter),
      });
      state.secondary = false;
      state.pause = false;
      state.recenter = false;
    };
    for (const button of this.touchControlsLayer.querySelectorAll('button[data-touch]')) {
      const key = button.dataset.touch;
      const down = (event) => {
        event.preventDefault();
        state[key] = true;
        setState();
      };
      const up = (event) => {
        event.preventDefault();
        state[key] = false;
        setState();
      };
      button.addEventListener('pointerdown', down);
      button.addEventListener('pointerup', up);
      button.addEventListener('pointercancel', up);
      button.addEventListener('pointerleave', up);
    }
  }

  emitSettings() {
    this.emit('settings', {
      masterVolume: Number(this.elements.masterVolume.value) / 100,
      soundVolume: Number(this.elements.soundVolume.value) / 100,
      ambienceVolume: Number(this.elements.ambienceVolume.value) / 100,
      engineVolume: Number(this.elements.engineVolume.value) / 100,
      sirenVolume: Number(this.elements.sirenVolume.value) / 100,
      weaponsVolume: Number(this.elements.weaponsVolume.value) / 100,
      uiVolume: Number(this.elements.uiVolume.value) / 100,
      cameraShake: this.elements.cameraShake.checked,
      cameraShakeIntensity: this.elements.cameraShakeIntensity.value,
      motionEffects: this.elements.motionEffects.value,
      uiScale: this.elements.uiScale.value,
      highContrastHud: this.elements.highContrastHud.checked,
      radioSubtitles: this.elements.radioSubtitles.checked,
      minimap: this.elements.minimap.checked,
      touchControls: this.elements.touchControls.value,
      touchLayout: this.elements.touchLayout.value,
      touchOpacity: Number(this.elements.touchOpacity.value) / 100,
      defaultDifficulty: this.elements.defaultDifficulty.value,
      radarSize: this.elements.radarSize.value,
      performanceDebug: this.elements.performanceDebug.checked,
      effectsQuality: this.elements.effectsQuality.value,
      trafficDensity: this.elements.trafficDensity.value,
    });
  }

  syncSettings(settings) {
    this.elements.masterVolume.value = Math.round((settings.masterVolume ?? 0.82) * 100);
    this.elements.soundVolume.value = Math.round(settings.soundVolume * 100);
    this.elements.ambienceVolume.value = Math.round(settings.ambienceVolume * 100);
    this.elements.engineVolume.value = Math.round((settings.engineVolume ?? 0.78) * 100);
    this.elements.sirenVolume.value = Math.round((settings.sirenVolume ?? 0.72) * 100);
    this.elements.weaponsVolume.value = Math.round((settings.weaponsVolume ?? 0.82) * 100);
    this.elements.uiVolume.value = Math.round((settings.uiVolume ?? 0.72) * 100);
    this.elements.cameraShake.checked = Boolean(settings.cameraShake);
    this.elements.cameraShakeIntensity.value = settings.cameraShakeIntensity || 'normal';
    this.elements.motionEffects.value = settings.motionEffects || 'normal';
    this.elements.uiScale.value = settings.uiScale || 'normal';
    this.elements.highContrastHud.checked = Boolean(settings.highContrastHud);
    this.elements.radioSubtitles.checked = settings.radioSubtitles !== false;
    this.elements.minimap.checked = settings.minimap !== false;
    this.elements.touchControls.value = settings.touchControls || 'auto';
    this.elements.touchLayout.value = settings.touchLayout || 'standard';
    this.elements.touchOpacity.value = Math.round((settings.touchOpacity ?? 0.82) * 100);
    this.elements.defaultDifficulty.value = settings.defaultDifficulty || 'standard';
    this.elements.radarSize.value = settings.radarSize || 'normal';
    this.elements.performanceDebug.checked = Boolean(settings.performanceDebug);
    this.elements.effectsQuality.value = settings.effectsQuality;
    this.elements.trafficDensity.value = settings.trafficDensity;
    document.body.classList.toggle('high-contrast', Boolean(settings.highContrastHud));
    document.body.classList.toggle('ui-scale-small', settings.uiScale === 'small');
    document.body.classList.toggle('ui-scale-large', settings.uiScale === 'large');
    const autoTouch = settings.touchControls === 'auto' && matchMedia('(pointer: coarse), (max-width: 760px)').matches;
    const showTouch = settings.touchControls === 'on' || autoTouch;
    document.body.classList.toggle('touch-controls-visible', Boolean(showTouch));
    this.touchControlsLayer?.classList.toggle('is-visible', Boolean(showTouch));
    this.touchControlsLayer?.setAttribute('aria-hidden', showTouch ? 'false' : 'true');
    this.touchControlsLayer?.style.setProperty('--touch-opacity', `${settings.touchOpacity ?? 0.82}`);
    this.touchControlsLayer?.classList.toggle('touch-controls--compact', settings.touchLayout === 'compact');
    this.touchControlsLayer?.classList.toggle('touch-controls--large', settings.touchLayout === 'large');
    this.radar?.classList.toggle('radar--small', settings.radarSize === 'small');
    this.radar?.classList.toggle('radar--large', settings.radarSize === 'large');
  }

  setProgressSnapshot(progressSnapshot) {
    this.progressSnapshot = progressSnapshot || this.progressSnapshot;
    this.ensureSelectionIsUnlocked();
    this.renderGarage();
  }

  setPhase4State({ difficultyId = 'standard', modifiers = [] } = {}) {
    this.selectedDifficultyId = DIFFICULTIES[difficultyId] ? difficultyId : 'standard';
    this.selectedModifiers = new Set(modifiers.filter((id) => MISSION_MODIFIERS[id]));
    this.renderGarage();
  }

  setLoadouts(loadouts = {}) {
    this.selectedLoadouts = {
      ...this.selectedLoadouts,
      ...loadouts,
    };
    this.renderGarage();
  }

  ensureSelectionIsUnlocked() {
    const current = this.getSelectedVehicle();
    if (current && this.isVehicleUnlocked(current)) return;
    const fallback = VEHICLE_CATALOG[this.selectedRole].find((vehicle) => this.isVehicleUnlocked(vehicle))
      || VEHICLE_CATALOG[this.selectedRole][0];
    this.selectedVehicleByRole[this.selectedRole] = fallback.id;
  }

  getSelectedMission() {
    return MISSIONS[this.selectedRole].find((mission) => mission.id === this.selectedMissionByRole[this.selectedRole])
      || MISSIONS[this.selectedRole][0];
  }

  getSelectedChallenge() {
    return CHALLENGES.find((challenge) => challenge.id === this.selectedChallengeByRole[this.selectedRole])
      || CHALLENGES.find((challenge) => challenge.role === this.selectedRole)
      || CHALLENGES[0];
  }

  getSelectedVehicle() {
    return VEHICLE_CATALOG[this.selectedRole].find((vehicle) => vehicle.id === this.selectedVehicleByRole[this.selectedRole])
      || VEHICLE_CATALOG[this.selectedRole][0];
  }

  isVehicleUnlocked(vehicle) {
    return vehicle.unlockedByDefault
      || PROGRESSION_RULES.defaultUnlocked.includes(vehicle.id)
      || this.progressSnapshot.unlocked?.includes(vehicle.id);
  }

  renderGarage() {
    if (!this.missionGrid || !this.vehicleGrid) return;
    this.careerModeButton.classList.toggle('is-selected', this.selectedMode === 'career');
    this.missionModeButton.classList.toggle('is-selected', this.selectedMode === 'mission');
    this.challengeModeButton.classList.toggle('is-selected', this.selectedMode === 'challenge');
    this.cupModeButton.classList.toggle('is-selected', this.selectedMode === 'cup');
    this.careerGrid.classList.toggle('is-hidden', this.selectedMode !== 'career');
    this.missionGrid.classList.toggle('is-hidden', this.selectedMode !== 'mission');
    this.challengeGrid.classList.toggle('is-hidden', this.selectedMode !== 'challenge');
    this.cupGrid.classList.toggle('is-hidden', this.selectedMode !== 'cup');
    this.renderCareerCards();
    this.renderMissionCards();
    this.renderChallengeCards();
    this.renderCupCards();
    this.renderDifficultyCards();
    this.renderVehicleCards();
    this.renderLoadoutCards();
    this.renderModifierCards();
    this.renderGarageSummary();
    this.emit('garagePreview', this.getSelectedVehicle().id);
  }

  renderCareerCards() {
    this.careerGrid.innerHTML = '';
    for (const mission of CAREER_MISSIONS[this.selectedRole]) {
      const unlocked = this.isCareerUnlocked(mission);
      const district = DISTRICTS[mission.districtId]?.name || 'Heatline City';
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `mission-card${mission.id === this.selectedCareerByRole[this.selectedRole] ? ' is-selected' : ''}${unlocked ? '' : ' is-locked'}`;
      card.dataset.requirement = mission.requires?.length ? `Complete ${mission.requires.length} prior mission` : 'Career start';
      const medal = this.progressSnapshot.medals?.[this.makeScoreKey(mission.id)] || 'No medal';
      const completed = this.progressSnapshot.completedMissions?.[mission.id] ? 'Completed' : unlocked ? 'Unlocked' : 'Locked';
      card.innerHTML = `<strong>${mission.name}</strong><span>${district} - ${mission.objective}</span><span>${completed} - ${medal} - Reward: ${mission.reward}</span>`;
      card.addEventListener('click', () => {
        if (!unlocked) {
          this.showEvent(card.dataset.requirement);
          this.emit('click');
          return;
        }
        this.selectedCareerByRole[this.selectedRole] = mission.id;
        this.selectedMode = 'career';
        this.selectedDifficultyId = mission.recommendedDifficulty || this.selectedDifficultyId;
        this.renderGarage();
        this.emit('click');
      });
      this.careerGrid.appendChild(card);
    }
  }

  renderMissionCards() {
    this.missionGrid.innerHTML = '';
    for (const mission of MISSIONS[this.selectedRole]) {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `mission-card${mission.id === this.selectedMissionByRole[this.selectedRole] ? ' is-selected' : ''}`;
      const completed = this.progressSnapshot.completedMissions?.[mission.id] ? 'Completed' : 'Local mission';
      const medal = this.progressSnapshot.medals?.[this.makeScoreKey(mission.id)] || 'No medal';
      card.innerHTML = `<strong>${mission.name}</strong><span>${mission.objective}</span><span>${completed} - ${medal}</span>`;
      card.addEventListener('click', () => {
        this.selectedMissionByRole[this.selectedRole] = mission.id;
        this.renderGarage();
        this.emit('click');
      });
      this.missionGrid.appendChild(card);
    }
  }

  renderChallengeCards() {
    this.challengeGrid.innerHTML = '';
    for (const challenge of CHALLENGES.filter((item) => item.role === this.selectedRole)) {
      const key = this.makeScoreKey(`challenge-${challenge.id}`);
      const medal = this.progressSnapshot.medals?.[key] || 'No medal';
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `mission-card${challenge.id === this.selectedChallengeByRole[this.selectedRole] ? ' is-selected' : ''}`;
      card.innerHTML = `<strong>${challenge.name}</strong><span>${challenge.description}</span><span>${medal}</span>`;
      card.addEventListener('click', () => {
        this.selectedChallengeByRole[this.selectedRole] = challenge.id;
        this.selectedMode = 'challenge';
        this.renderGarage();
        this.emit('click');
      });
      this.challengeGrid.appendChild(card);
    }
  }

  renderCupCards() {
    this.cupGrid.innerHTML = '';
    for (const cup of CUP_MODES.filter((item) => item.role === 'mixed' || item.role === this.selectedRole)) {
      const saved = this.progressSnapshot.cups?.[cup.id];
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `mission-card${cup.id === this.selectedCupId ? ' is-selected' : ''}`;
      card.innerHTML = `<strong>${cup.name}</strong><span>${cup.description}</span><span>${cup.rounds.length} rounds - ${cup.expectedTime} - Best ${saved?.bestScore || 0}</span>`;
      card.addEventListener('click', () => {
        this.selectedCupId = cup.id;
        this.selectedMode = 'cup';
        this.renderGarage();
        this.emit('click');
      });
      this.cupGrid.appendChild(card);
    }
  }

  renderDifficultyCards() {
    this.difficultyGrid.innerHTML = '';
    for (const difficulty of Object.values(DIFFICULTIES)) {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `difficulty-card${difficulty.id === this.selectedDifficultyId ? ' is-selected' : ''}`;
      card.innerHTML = `<strong>${difficulty.name} - ${difficulty.scoreMultiplier.toFixed(2)}x</strong><span>${difficulty.description}</span>`;
      card.addEventListener('click', () => {
        this.selectedDifficultyId = difficulty.id;
        this.renderGarage();
        this.emit('difficulty', difficulty.id);
        this.emit('click');
      });
      this.difficultyGrid.appendChild(card);
    }
  }

  renderModifierCards() {
    this.modifierGrid.innerHTML = '';
    const forced = this.getForcedModifierIds();
    for (const modifier of Object.values(MISSION_MODIFIERS)) {
      const selected = this.selectedModifiers.has(modifier.id) || forced.includes(modifier.id);
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `modifier-card${selected ? ' is-selected' : ''}`;
      card.innerHTML = `<strong>${modifier.name} - ${(modifier.scoreMultiplier || 1).toFixed(2)}x</strong><span>${forced.includes(modifier.id) ? 'Challenge forced - ' : ''}${modifier.description}</span>`;
      card.addEventListener('click', () => {
        if (forced.includes(modifier.id)) {
          this.showEvent('Challenge modifier is locked in');
          this.emit('click');
          return;
        }
        if (this.selectedModifiers.has(modifier.id)) this.selectedModifiers.delete(modifier.id);
        else this.selectedModifiers.add(modifier.id);
        this.renderGarage();
        this.emit('modifiers', [...this.selectedModifiers]);
        this.emit('click');
      });
      this.modifierGrid.appendChild(card);
    }
  }

  renderVehicleCards() {
    this.vehicleGrid.innerHTML = '';
    for (const vehicle of VEHICLE_CATALOG[this.selectedRole]) {
      const unlocked = this.isVehicleUnlocked(vehicle);
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `vehicle-card${vehicle.id === this.selectedVehicleByRole[this.selectedRole] ? ' is-selected' : ''}${unlocked ? '' : ' is-locked'}`;
      card.dataset.requirement = vehicle.requirement || 'Locked';
      card.innerHTML = `<strong>${vehicle.name}</strong><span>${vehicle.description}</span><span>${this.getLoadoutLabel(vehicle)}</span>`;
      card.addEventListener('click', () => {
        if (!unlocked) {
          this.showEvent(vehicle.requirement || 'Vehicle locked');
          this.emit('click');
          return;
        }
        this.selectedVehicleByRole[this.selectedRole] = vehicle.id;
        this.renderGarage();
        this.emit('click');
      });
      this.vehicleGrid.appendChild(card);
    }
  }

  renderLoadoutCards() {
    if (!this.loadoutGrid) return;
    this.loadoutGrid.innerHTML = '';
    const loadout = this.selectedLoadouts[this.selectedRole];
    const options = {
      primary: LOADOUT_OPTIONS[this.selectedRole]?.primary || [],
      secondary: LOADOUT_OPTIONS[this.selectedRole]?.secondary || [],
      passive: LOADOUT_OPTIONS.universal.passive,
      tire: LOADOUT_OPTIONS.universal.tire,
      accent: LOADOUT_OPTIONS.universal.accent,
    };
    for (const slot of ['primary', 'secondary', 'passive', 'tire', 'accent']) {
      const row = document.createElement('div');
      row.className = 'loadout-row';
      row.innerHTML = `<strong>${slot}</strong>`;
      for (const item of options[slot]) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = item.id === loadout[slot] ? 'is-selected' : '';
        button.textContent = item.label;
        button.title = item.description || `${item.pros || ''} ${item.cons || ''}`.trim();
        button.addEventListener('click', () => {
          this.selectedLoadouts[this.selectedRole][slot] = item.id;
          this.emit('loadout', { role: this.selectedRole, slot, id: item.id, loadout: this.selectedLoadouts[this.selectedRole] });
          this.renderGarage();
          this.emit('click');
        });
        row.appendChild(button);
      }
      this.loadoutGrid.appendChild(row);
    }
  }

  getLoadoutLabel(vehicle) {
    const selected = this.selectedLoadouts[this.selectedRole] || {};
    const primary = ABILITY_CONFIG[selected.primary || vehicle.loadout.primary]?.label || 'Primary';
    const secondary = ABILITY_CONFIG[selected.secondary || vehicle.loadout.secondary]?.label || 'Secondary';
    const utility = ABILITY_CONFIG[vehicle.loadout.utility]?.label;
    const boost = ABILITY_CONFIG[vehicle.loadout.boost]?.label || 'Nitro';
    const passive = LOADOUT_OPTIONS.universal.passive.find((item) => item.id === selected.passive)?.label;
    return `${primary} + ${secondary}${utility ? ` / ${utility}` : ''} + ${passive || boost}`;
  }

  renderGarageSummary() {
    const mission = this.getSelectedMission();
    const challenge = this.getSelectedChallenge();
    const career = this.getSelectedCareer();
    const cup = this.getSelectedCup();
    const activeName = this.selectedMode === 'challenge'
      ? challenge.name
      : this.selectedMode === 'career'
        ? career.name
        : this.selectedMode === 'cup'
          ? cup.name
          : mission.name;
    const activeKey = this.makeScoreKey(this.selectedMode === 'challenge'
      ? `challenge-${challenge.id}`
      : this.selectedMode === 'career'
        ? career.id
        : this.selectedMode === 'cup'
          ? cup.id
          : mission.id);
    const vehicle = this.getSelectedVehicle();
    const best = this.progressSnapshot.bestScores?.[activeKey] || this.progressSnapshot.bestScores?.[mission.id] || 0;
    const medal = this.progressSnapshot.medals?.[activeKey] || 'None';
    const difficulty = DIFFICULTIES[this.selectedDifficultyId] || DIFFICULTIES.standard;
    this.garageSummary.textContent = `${this.selectedRole === 'robber' ? 'Robber' : 'Police'} - ${activeName} - ${difficulty.name} - ${vehicle.name}`;
    this.garageBestScore.textContent = `Best score: ${best}`;
    this.garageMedal.textContent = `Best medal: ${medal}`;
    this.garageLoadout.textContent = this.getLoadoutLabel(vehicle);
    this.startButton.disabled = !this.isVehicleUnlocked(vehicle);
    this.garageStats.innerHTML = Object.entries(vehicle.stats)
      .map(([label, value]) => `
        <div class="stat-row">
          <span>${label}</span>
          <i style="--value:${value}"></i>
          <b>${value}</b>
        </div>
      `)
      .join('');
  }

  makeScoreKey(baseId) {
    const modifierKey = [...new Set([...this.selectedModifiers, ...this.getForcedModifierIds()])].sort().join('+') || 'none';
    return `${baseId}|${this.selectedDifficultyId}|${modifierKey}`;
  }

  getForcedModifierIds() {
    if (this.selectedMode === 'challenge') return this.getSelectedChallenge()?.forcedModifiers || [];
    if (this.selectedMode === 'career') return this.getSelectedCareer()?.modifiers || [];
    if (this.selectedMode === 'cup') {
      const firstRound = this.getSelectedCup()?.rounds?.[0];
      const career = [...CAREER_MISSIONS.robber, ...CAREER_MISSIONS.police].find((mission) => mission.id === firstRound);
      return career?.modifiers || [];
    }
    return [];
  }

  getSelectedCareer() {
    return CAREER_MISSIONS[this.selectedRole].find((mission) => mission.id === this.selectedCareerByRole[this.selectedRole])
      || CAREER_MISSIONS[this.selectedRole][0];
  }

  getSelectedCup() {
    return CUP_MODES.find((cup) => cup.id === this.selectedCupId) || CUP_MODES[0];
  }

  isCareerUnlocked(mission) {
    if (!mission.requires?.length) return true;
    return mission.requires.every((id) => this.progressSnapshot.completedMissions?.[id]);
  }

  selectLatestCareer() {
    const list = CAREER_MISSIONS[this.selectedRole];
    const latest = [...list].reverse().find((mission) => this.isCareerUnlocked(mission)) || list[0];
    this.selectedCareerByRole[this.selectedRole] = latest.id;
  }

  on(eventName, callback) {
    this.callbacks[eventName] = callback;
  }

  emit(eventName, payload) {
    this.callbacks[eventName]?.(payload);
  }

  showMenu() {
    this.startMenu.classList.remove('is-hidden');
    this.hud.classList.add('is-hidden');
    this.pauseOverlay.classList.add('is-hidden');
    this.targetMarker.classList.remove('is-visible');
    this.updateRadar({ visible: false });
    this.updateBoss({ visible: false });
    document.body.classList.remove('touch-controls-visible');
    this.renderGarage();
  }

  renderRecords() {
    if (!this.recordsSummary || !this.achievementGrid) return;
    const stats = this.progressSnapshot.stats || {};
    const medalCount = Object.values(this.progressSnapshot.medals || {}).filter((medal) => ['Gold', 'Platinum'].includes(medal)).length;
    this.recordsSummary.innerHTML = `
      <div><strong>${stats.missionsPlayed || 0}</strong><span>Missions played</span></div>
      <div><strong>${stats.bestScore || 0}</strong><span>Best score</span></div>
      <div><strong>${stats.highestWanted || 0}/5</strong><span>Highest wanted</span></div>
      <div><strong>${stats.captainDefeats || 0}</strong><span>Captain defeats</span></div>
      <div><strong>${medalCount}</strong><span>Gold medals</span></div>
      <div><strong>${stats.favoriteVehicle || 'None'}</strong><span>Favorite vehicle</span></div>
    `;
    this.achievementGrid.innerHTML = ACHIEVEMENTS.map((achievement) => {
      const value = stats[achievement.stat] || 0;
      const ratio = Math.min(1, value / achievement.target);
      const unlocked = Boolean(this.progressSnapshot.achievements?.[achievement.id]);
      return `
        <div class="achievement-card${unlocked ? ' is-unlocked' : ''}">
          <strong>${achievement.name}</strong>
          <span>${achievement.description}</span>
          <i><b style="transform:scaleX(${ratio})"></b></i>
          <small>${unlocked ? 'Unlocked' : `${value} / ${achievement.target}`}</small>
        </div>
      `;
    }).join('');
  }

  showOnboarding(step) {
    if (!step || !this.onboardingPanel) return;
    this.elements.onboardingStep.textContent = `Step ${step.index} / ${step.total}`;
    this.elements.onboardingTitle.textContent = step.title;
    this.elements.onboardingBody.textContent = step.body;
    document.querySelector('#nextOnboardingButton').textContent = step.isLast ? 'Finish' : 'Next';
    this.onboardingPanel.setAttribute('aria-hidden', 'false');
  }

  hideOnboarding() {
    this.onboardingPanel?.setAttribute('aria-hidden', 'true');
  }

  showGame(role, mission = null) {
    this.startMenu.classList.add('is-hidden');
    this.hud.classList.remove('is-hidden');
    this.resultOverlay.classList.add('is-hidden');
    this.setPaused(false);
    const intro = mission?.intro || (role === 'robber' ? 'ESCAPE THE CITY HEAT.' : 'BRING THE OUTLAW DOWN.');
    this.showIntro(intro.toUpperCase());
  }

  showIntro(text) {
    this.roleIntro.textContent = text;
    this.roleIntro.classList.remove('is-active');
    window.requestAnimationFrame(() => this.roleIntro.classList.add('is-active'));
  }

  setPaused(paused) {
    this.pauseOverlay.classList.toggle('is-hidden', !paused);
  }

  setSpeedLines(active) {
    this.speedLines.classList.toggle('is-active', active);
  }

  pushRadio(message) {
    if (this.elements.radioSubtitles && !this.elements.radioSubtitles.checked) return;
    const item = document.createElement('div');
    item.className = 'radio-message';
    item.textContent = message;
    this.radioFeed.prepend(item);
    while (this.radioFeed.children.length > 4) {
      this.radioFeed.lastElementChild.remove();
    }
    window.setTimeout(() => item.remove(), 4300);
  }

  setRadioLog(items = []) {
    if (!this.radioLog) return;
    this.radioLog.innerHTML = items
      .map((item) => `<div><strong>${item.speaker}</strong>: ${item.message}</div>`)
      .join('');
  }

  updateBoss({ visible, label, title, phase, ratio = 0 }) {
    if (!this.bossHud) return;
    this.bossHud.classList.toggle('is-hidden', !visible);
    if (!visible) return;
    this.elements.bossName.textContent = label || 'Captain Unit';
    this.elements.bossTitle.textContent = title || 'Tactical Pursuit Captain';
    this.elements.bossHealthBar.style.transform = `scaleX(${clamp(ratio, 0, 1)})`;
    this.elements.bossPhase.textContent = phase ? `Phase: ${phase}` : 'Phase: Pursuit';
  }

  updateRadar({ visible, icons = [] }) {
    if (!this.radar) return;
    this.radar.classList.toggle('is-hidden', !visible);
    this.radar.querySelectorAll('.radar-icon').forEach((item) => item.remove());
    if (!visible) return;
    for (const icon of icons) {
      const dot = document.createElement('span');
      dot.className = `radar-icon radar-icon--${icon.type}`;
      dot.title = icon.label || icon.type;
      dot.style.left = `${50 + icon.x * 44}%`;
      dot.style.top = `${50 + icon.y * 44}%`;
      this.radar.appendChild(dot);
    }
  }

  showEvent(message) {
    this.eventBanner.textContent = message;
    this.eventBanner.classList.add('is-active');
    window.clearTimeout(this.eventTimer);
    this.eventTimer = window.setTimeout(() => this.eventBanner.classList.remove('is-active'), 3200);
  }

  updateTargetMarker({ visible, x = 0, y = 0, label = 'TARGET' }) {
    this.targetMarker.textContent = label;
    this.targetMarker.style.left = `${x}px`;
    this.targetMarker.style.top = `${y}px`;
    this.targetMarker.classList.toggle('is-visible', visible);
  }

  showDamage(amount, x, y, color = '#fff') {
    const item = document.createElement('div');
    item.className = 'damage-pop';
    item.textContent = Math.round(amount);
    item.style.left = `${clamp(x, 18, window.innerWidth - 18)}px`;
    item.style.top = `${clamp(y, 90, window.innerHeight - 90)}px`;
    item.style.color = color;
    this.damageFeed.appendChild(item);
    window.setTimeout(() => item.remove(), 900);
  }

  showScorePopup(message) {
    if (!this.scoreFeed) return;
    const item = document.createElement('div');
    item.className = 'score-pop';
    item.textContent = message;
    this.scoreFeed.prepend(item);
    while (this.scoreFeed.children.length > 3) this.scoreFeed.lastElementChild.remove();
    window.setTimeout(() => item.remove(), 1200);
  }

  update(state) {
    const {
      role,
      timer,
      player,
      target,
      activePolice,
      supportUnits,
      intensity = 0,
      alert = 0,
      primaryCooldown,
      secondaryCooldown,
      primaryLabel = 'Primary',
      secondaryLabel = role === 'robber' ? 'Rear Mine' : 'EMP Shot',
      mission = null,
      wantedLevel = 0,
    } = state;

    const isRobber = role === 'robber';
    this.elements.role.textContent = isRobber ? 'ROBBER' : 'POLICE';
    this.elements.objective.textContent = mission?.name || (isRobber ? 'Survive the chase' : 'Disable the robber');
    this.elements.timer.textContent = formatTime(timer);
    const intensityLabel = intensity > 0.72 ? 'HIGH' : intensity > 0.38 ? 'RISING' : 'LOW';
    this.elements.intensityValue.textContent = intensityLabel;

    if (isRobber) {
      this.elements.targetLabel.textContent = 'POLICE ACTIVE';
      this.elements.targetValue.textContent = `${activePolice}`;
      this.elements.secondaryLabel.textContent = secondaryLabel;
    } else {
      this.elements.targetLabel.textContent = 'ROBBER HP';
      this.elements.targetValue.textContent = target ? `${Math.ceil(target.health)} / ${target.maxHealth}` : '0';
      this.elements.secondaryLabel.textContent = secondaryLabel;
    }

    const healthRatio = player ? clamp(player.health / player.maxHealth, 0, 1) : 0;
    const nitroRatio = player ? clamp(player.nitro / 100, 0, 1) : 0;
    this.elements.healthText.textContent = player ? `${Math.ceil(player.health)} / ${player.maxHealth}` : '0 / 0';
    this.elements.healthBar.style.transform = `scaleX(${healthRatio})`;
    this.elements.nitroText.textContent = `${Math.round(nitroRatio * 100)}%`;
    this.elements.nitroBar.style.transform = `scaleX(${nitroRatio})`;
    this.elements.alertText.textContent = isRobber && wantedLevel ? `${wantedLevel} / 5` : `${Math.round(alert * 100)}%`;
    this.elements.alertBar.style.transform = `scaleX(${clamp(alert, 0, 1)})`;
    this.elements.primaryLabel.textContent = primaryLabel;
    this.elements.primary.textContent = primaryCooldown <= 0 ? 'READY' : `${primaryCooldown.toFixed(1)}s`;
    this.elements.secondary.textContent = secondaryCooldown <= 0 ? 'READY' : `${secondaryCooldown.toFixed(1)}s`;

    if (!isRobber && supportUnits !== undefined) {
      this.elements.objective.textContent = mission?.name
        ? `${mission.name} - Support ${supportUnits}`
        : `Disable the robber - Support ${supportUnits}`;
    }

    if (mission) {
      this.elements.missionName.textContent = mission.name;
      this.elements.missionObjective.textContent = mission.objective;
      this.elements.missionProgress.style.transform = `scaleX(${clamp(mission.progress, 0, 1)})`;
      const cargo = mission.cargo !== null && mission.cargo !== undefined ? ` Cargo ${Math.round(mission.cargo)}%.` : '';
      const bonusState = mission.bonusComplete ? 'Bonus complete' : `Bonus: ${mission.bonus}`;
      const district = mission.district ? ` ${mission.district}.` : '';
      const cup = mission.cupLabel ? ` ${mission.cupLabel}.` : '';
      this.elements.missionBonus.textContent = `${bonusState}${cargo}${district}${cup}`;
    }
  }

  showResult({ win, title, summary, stats = {} }) {
    this.resultOverlay.classList.remove('is-hidden');
    this.elements.resultKicker.textContent = win ? 'MISSION COMPLETE' : 'CHASE FAILED';
    this.elements.resultTitle.textContent = title;
    this.elements.resultSummary.textContent = summary;
    const entries = [
      ['Role', stats.role || '-'],
      ['Mission', stats.mission || '-'],
      ['Score', stats.totalScore ?? 0],
      ['Rank', stats.rank || 'C'],
      ['Medal', stats.medal || 'Bronze'],
      ['Difficulty', stats.difficulty || 'Standard'],
      ['Modifiers', stats.modifiers || 'None'],
      ['Time', stats.time || '-'],
      ['Destroyed', stats.destroyed ?? 0],
      ['Damage', Math.round(stats.damageDealt || 0)],
      ['Biggest Hit', Math.round(stats.biggestHit || 0)],
      ['Takedowns', stats.takedowns ?? 0],
      ['Bonus', stats.bonusComplete ? 'Complete' : 'Missed'],
      ['Best', stats.bestScore ?? 0],
      ['Unlocks', stats.unlocks?.length ? stats.unlocks.join(', ') : 'None'],
      ['District', stats.district || '-'],
      ['Cup', stats.cup || 'None'],
      ['Next', stats.nextRound || '-'],
    ];
    this.elements.resultStats.innerHTML = entries
      .map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`)
      .join('');
    if (this.resultHighlights) {
      const highlights = stats.highlights || [];
      this.resultHighlights.innerHTML = highlights.length
        ? `<strong>Match Highlights</strong>${highlights.map((item) => `
          <div class="highlight-card">
            <b>${item.labelTime}</b>
            <span><strong>${item.title}</strong><br />${item.detail}</span>
          </div>
        `).join('')}`
        : '';
    }
  }
}
