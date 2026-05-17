import * as THREE from 'three';
import { AIController } from '../ai/AIController.js';
import { AudioManager } from '../audio/AudioManager.js';
import { CameraController } from '../camera/CameraController.js';
import { CityBuilder } from '../city/CityBuilder.js';
import {
  ABILITY_CONFIG,
  DISTRICTS,
  EFFECT_QUALITY,
  GAME_DURATION,
  MISSIONS,
  PERFORMANCE_LIMITS,
  ROBBER_HEALTH_MULTIPLIER,
  SPECIAL_UNITS,
  VEHICLE_CATALOG,
  VEHICLE_STATS,
} from '../config.js';
import { EffectsManager } from '../effects/EffectsManager.js';
import { InputManager } from '../input/InputManager.js';
import { MissionManager } from '../missions/MissionManager.js';
import { ScoreSystem } from '../missions/ScoreSystem.js';
import { ProgressionManager } from '../progression/ProgressionManager.js';
import { SettingsManager } from '../settings/SettingsManager.js';
import { DayEnvironmentManager } from '../scene/DayEnvironmentManager.js';
import { SceneManager } from '../scene/SceneManager.js';
import { AbilitySystem } from '../systems/AbilitySystem.js';
import { CaptainBossSystem } from '../systems/CaptainBossSystem.js';
import { CareerManager } from '../systems/CareerManager.js';
import { ChallengeManager } from '../systems/ChallengeManager.js';
import { ChaseDirector } from '../systems/ChaseDirector.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { CupManager } from '../systems/CupManager.js';
import { DamageSystem } from '../systems/DamageSystem.js';
import { DestructiblePropSystem } from '../systems/DestructiblePropSystem.js';
import { DistrictManager } from '../systems/DistrictManager.js';
import { DifficultyManager } from '../systems/DifficultyManager.js';
import { GameHubEmbedSystem } from '../systems/GameHubEmbedSystem.js';
import { GaragePreviewSystem } from '../systems/GaragePreviewSystem.js';
import { HighlightSystem } from '../systems/HighlightSystem.js';
import { LoadoutManager } from '../systems/LoadoutManager.js';
import { ModifierManager } from '../systems/ModifierManager.js';
import { NavigationMarkerSystem } from '../systems/NavigationMarkerSystem.js';
import { OnboardingManager } from '../systems/OnboardingManager.js';
import { PickupSystem } from '../systems/PickupSystem.js';
import { PerformanceDebugSystem } from '../systems/PerformanceDebugSystem.js';
import { RadarSystem } from '../systems/RadarSystem.js';
import { RadioSystem } from '../systems/RadioSystem.js';
import { RoadblockSystem } from '../systems/RoadblockSystem.js';
import { StatsAchievementManager } from '../systems/StatsAchievementManager.js';
import { TrafficSystem } from '../systems/TrafficSystem.js';
import { WantedSystem } from '../systems/WantedSystem.js';
import { HUDManager } from '../ui/HUDManager.js';
import { clamp, formatTime, rand } from '../utils/math.js';
import { VehicleController } from '../vehicles/VehicleController.js';
import { VehicleFactory } from '../vehicles/VehicleFactory.js';
import { WeaponSystem } from '../weapons/WeaponSystem.js';

export class GameManager {
  constructor({ root }) {
    this.root = root;
    this.sceneManager = new SceneManager(root);
    this.settings = new SettingsManager();
    this.input = new InputManager();
    this.hud = new HUDManager();
    this.audio = new AudioManager();
    this.vehicleFactory = new VehicleFactory();
    this.effects = new EffectsManager(this.sceneManager.scene);
    this.camera = new CameraController(this.sceneManager.camera);
    this.damage = new DamageSystem({
      camera: this.sceneManager.camera,
      renderer: this.sceneManager.renderer,
      effects: this.effects,
      audio: this.audio,
      hud: this.hud,
    });
    this.weapons = new WeaponSystem({
      scene: this.sceneManager.scene,
      effects: this.effects,
      audio: this.audio,
      damage: this.damage,
    });
    this.progression = new ProgressionManager();
    this.missions = new MissionManager();
    this.scoreSystem = new ScoreSystem();
    this.difficulty = new DifficultyManager();
    this.modifiers = new ModifierManager();
    this.career = new CareerManager();
    this.challenges = new ChallengeManager();
    this.cups = new CupManager({ career: this.career });
    this.loadouts = new LoadoutManager();
    this.statsAchievements = new StatsAchievementManager();
    this.onboarding = new OnboardingManager();
    this.performanceDebug = new PerformanceDebugSystem();
    this.highlights = new HighlightSystem();
    this.radio = new RadioSystem({ hud: this.hud, audio: this.audio });
    this.radar = new RadarSystem({ hud: this.hud });
    this.garagePreview = new GaragePreviewSystem({
      renderer: this.sceneManager.renderer,
      container: this.hud.garagePreviewViewport,
    });
    this.abilities = new AbilitySystem({
      scene: this.sceneManager.scene,
      weapons: this.weapons,
      effects: this.effects,
      audio: this.audio,
      damage: this.damage,
      hud: this.hud,
      onAbilityHit: (event) => this.recordAbilityHit(event),
    });
    this.collision = new CollisionSystem({
      damage: this.damage,
      effects: this.effects,
      audio: this.audio,
      camera: this.camera,
    });
    this.dayEnvironment = new DayEnvironmentManager(this.sceneManager);
    this.traffic = null;
    this.roadblocks = null;
    this.destructibles = null;
    this.districts = null;
    this.director = null;
    this.pickups = new PickupSystem({
      scene: this.sceneManager.scene,
      effects: this.effects,
      audio: this.audio,
      hud: this.hud,
    });
    this.captainBoss = new CaptainBossSystem({
      hud: this.hud,
      radio: this.radio,
      audio: this.audio,
      effects: this.effects,
      onSupport: () => this.spawnCaptainSupport(),
      onDefeated: (captain) => this.handleCaptainDefeated(captain),
    });
    this.wanted = new WantedSystem({
      role: 'robber',
      hud: this.hud,
      radio: this.radio,
      onEscalation: (config) => this.handleWantedEscalation(config),
    });
    this.markers = new NavigationMarkerSystem({
      camera: this.sceneManager.camera,
      hud: this.hud,
    });

    this.city = null;
    this.vehicles = [];
    this.ai = [];
    this.player = null;
    this.robber = null;
    this.role = 'robber';
    this.running = false;
    this.paused = false;
    this.ended = false;
    this.timer = GAME_DURATION;
    this.elapsed = 0;
    this.matchTime = 0;
    this.vehicleId = 0;
    this.radioTimer = 0;
    this.pressureStage = 0;
    this.lastRole = 'robber';
    this.lastSelection = { role: 'robber', missionId: 'survival-heat', vehicleId: 'armored-muscle' };
    this.currentMission = MISSIONS.robber[0];
    this.selectedVehicle = VEHICLE_CATALOG.robber[0];
    this.currentDifficulty = this.difficulty.get();
    this.currentChallenge = null;
    this.currentCareer = null;
    this.currentCup = null;
    this.currentDistrict = DISTRICTS.downtown;
    this.currentLoadout = null;
    this.currentDistrictEvent = null;
    this.activeModifierIds = [];
    this.modifierMultipliers = this.modifiers.getMultipliers();
    this.scoreKey = 'survival-heat|standard|none';
    this.convoySupport = [];
    this.specialSpawned = new Set();
    this.stats = this.createStats('robber');
    this.screenPoint = new THREE.Vector3();
    this.lastNitroInput = false;
  }

  boot() {
    this.dayEnvironment.apply();
    const cityBuilder = new CityBuilder(this.sceneManager.scene);
    this.city = cityBuilder.build();
    this.traffic = new TrafficSystem({
      scene: this.sceneManager.scene,
      city: this.city,
      settings: this.settings.get(),
      effects: this.effects,
      audio: this.audio,
    });
    this.roadblocks = new RoadblockSystem({
      scene: this.sceneManager.scene,
      city: this.city,
      effects: this.effects,
      audio: this.audio,
    });
    this.destructibles = new DestructiblePropSystem({
      scene: this.sceneManager.scene,
      city: this.city,
      effects: this.effects,
      audio: this.audio,
      settings: this.settings.get(),
    });
    this.districts = new DistrictManager({
      city: this.city,
      hud: this.hud,
      radio: this.radio,
    });
    this.districts.buildLabels(cityBuilder);
    this.destructibles.build();
    this.traffic.onHit = (event) => this.recordCityHit('traffic', event);
    this.destructibles.onBreak = (event) => this.recordCityHit('prop', event);
    this.damage.setStatsCallback((event) => this.recordDamage(event));
    this.hud.setProgressSnapshot(this.progression.getSnapshot());
    this.hud.setLoadouts(this.loadouts.selected);
    this.hud.setPhase4State({
      difficultyId: this.difficulty.selectedId,
      modifiers: [...this.modifiers.selected],
    });
    this.garagePreview.show(this.selectedVehicle.id);
    this.bindHud();
    this.settings.onChange((settings) => this.applySettings(settings));
    GameHubEmbedSystem.hideLoading();
    if (this.onboarding.shouldShow()) this.hud.showOnboarding(this.onboarding.current());
    this.loop();
  }

  bindHud() {
    this.hud.on('start', (selection) => this.start(selection));
    this.hud.on('restart', () => this.resetToMenu());
    this.hud.on('playAgain', () => this.start(this.lastSelection));
    this.hud.on('changeRole', () => this.resetToMenu());
    this.hud.on('settings', (settings) => this.settings.update(settings));
    this.hud.on('difficulty', (id) => this.difficulty.set(id));
    this.hud.on('modifiers', (ids) => this.modifiers.setSelected(ids));
    this.hud.on('loadout', ({ role, slot, id }) => this.loadouts.set(role, slot, id));
    this.hud.on('garagePreview', (vehicleId) => this.garagePreview.show(vehicleId));
    this.hud.on('touchInput', (state) => this.input.setTouchState(state));
    this.hud.on('resume', () => { this.paused = false; this.hud.setPaused(false); });
    this.hud.on('restartMission', () => this.start(this.lastSelection));
    this.hud.on('garage', () => this.resetToMenu());
    this.hud.on('quitToMenu', () => this.resetToMenu());
    this.hud.on('fullscreen', () => GameHubEmbedSystem.toggleFullscreen());
    this.hud.on('showOnboarding', () => this.hud.showOnboarding(this.onboarding.current()));
    this.hud.on('nextOnboarding', () => {
      const next = this.onboarding.next();
      if (next) this.hud.showOnboarding(next);
      else this.hud.hideOnboarding();
    });
    this.hud.on('skipOnboarding', () => this.onboarding.markComplete());
    this.hud.on('resetProgress', () => {
      this.progression.reset();
      this.loadouts.reset();
      this.onboarding.reset();
      this.hud.setProgressSnapshot(this.progression.getSnapshot());
      this.hud.setLoadouts(this.loadouts.selected);
      this.hud.showEvent('Local progress reset');
    });
    this.hud.on('click', () => {
      this.audio.resume();
      this.audio.playClick();
    });
    window.addEventListener('blur', () => {
      this.input.clear();
      if (this.running && !this.ended) {
        this.paused = true;
        this.hud.setPaused(true);
      }
    });
  }

  applySettings(settings) {
    this.hud.syncSettings(settings);
    this.audio.setSettings(settings);
    this.camera.setSettings(settings);
    this.effects.setQuality(EFFECT_QUALITY[settings.effectsQuality]);
    if (this.traffic) this.traffic.settings = settings;
    if (this.destructibles) this.destructibles.settings = settings;
    this.performanceDebug.setVisible(settings.performanceDebug);
  }

  createStats(role) {
    return {
      role: role === 'robber' ? 'Robber' : 'Police',
      damageDealt: 0,
      biggestHit: 0,
      destroyed: 0,
      takedowns: 0,
      abilityHits: 0,
      convoyDestroyed: 0,
      playerDeaths: 0,
      captainDefeated: false,
      checkpointsReached: 0,
      trafficHits: 0,
      propHits: 0,
      pickupScore: 0,
      eventIntensity: 0,
      nitroUses: 0,
      remainingTime: 0,
    };
  }

  recordDamage({ target, source, amount, destroyed, ability }) {
    if (!source || !this.player) return;
    const countsForPlayer = source === this.player || source.faction === this.player.faction;
    if (!countsForPlayer || target.faction === this.player.faction) return;
    this.stats.damageDealt += amount;
    this.stats.biggestHit = Math.max(this.stats.biggestHit, amount);
    if (amount >= 45) this.highlights.record('big-hit', 'Heavy Hit', `${Math.round(amount)} damage landed.`, 2.4);
    if (ability) {
      this.stats.abilityHits += 1;
      this.hud.showScorePopup('+ Ability hit');
      this.highlights.record(ability, `${ability === 'empShot' ? 'EMP' : 'Ability'} Hit`, `${Math.round(amount)} damage and control effect.`, 2.6);
    }
    if (this.role === 'robber') this.wanted.add(amount * 0.04, 'damage');
    if (destroyed) {
      this.stats.destroyed += 1;
      if (source === this.player) this.stats.takedowns += 1;
      this.hud.showScorePopup(source === this.player ? '+ Takedown' : '+ Support takedown');
      this.highlights.record('takedown', source === this.player ? 'Player Takedown' : 'Support Takedown', `${target.label || target.type} disabled.`, source === this.player ? 3.4 : 2.8);
      if (this.role === 'robber') this.wanted.add(target.type === 'swat' ? 14 : 9, 'takedown');
      if (target.unitKind === 'captain') this.stats.captainDefeated = true;
      if (target.faction === 'robber' && target !== this.robber) this.stats.convoyDestroyed += 1;
    }
  }

  recordAbilityHit({ source, target }) {
    if (!source || !target || !this.player) return;
    const countsForPlayer = source === this.player || source.faction === this.player.faction;
    if (!countsForPlayer || target.faction === this.player.faction) return;
    this.stats.abilityHits += 1;
    this.hud.showScorePopup('+ Ability hit');
    if (this.role === 'robber') this.wanted.add(6, 'ability');
    if (this.role === 'police') this.wanted.add(10, 'ability');
  }

  recordCityHit(type, { vehicle }) {
    if (!vehicle || vehicle !== this.player) return;
    if (type === 'traffic') this.stats.trafficHits += 1;
    if (type === 'prop') this.stats.propHits += 1;
    if (this.modifierMultipliers.cleanRun) {
      this.hud.showScorePopup('- Clean run');
    }
  }

  resolveSelection(selection) {
    let role = typeof selection === 'string' ? selection : selection?.role || 'robber';
    const settings = this.settings.get();
    this.difficulty.set(selection?.difficultyId || settings.defaultDifficulty || this.difficulty.selectedId || 'standard');
    this.currentDifficulty = this.difficulty.get();
    this.modifiers.setSelected(selection?.modifiers || [...this.modifiers.selected]);
    this.currentCareer = null;
    this.currentCup = null;
    if (selection?.loadout) {
      for (const [slot, id] of Object.entries(selection.loadout)) this.loadouts.set(role, slot, id);
    }
    this.challenges.set(selection?.mode === 'challenge' ? selection.challengeId : null);
    this.currentChallenge = this.challenges.get();
    if (this.currentChallenge) role = this.currentChallenge.role;

    let baseMission = (MISSIONS[role] || MISSIONS.robber).find((item) => item.id === selection?.missionId) || (MISSIONS[role] || MISSIONS.robber)[0];
    const challengeMission = this.challenges.createMissionFromChallenge(this.currentChallenge);
    if (selection?.mode === 'career') {
      this.career.set(role, selection.careerId);
      this.currentCareer = this.career.getSelected(role);
      baseMission = this.career.createMission(this.currentCareer?.id) || baseMission;
      role = baseMission.role;
    } else if (selection?.mode === 'cup') {
      if (!selection.cupContinue || this.cups.active?.id !== selection.cupId) this.cups.start(selection.cupId);
      baseMission = this.cups.createCurrentMission() || baseMission;
      this.currentCup = this.cups.active;
      this.currentCareer = this.career.find(baseMission.id);
      role = baseMission.role;
    }
    const forcedModifiers = [
      ...(this.currentChallenge?.forcedModifiers || []),
      ...(baseMission.modifiers || []),
    ];
    this.modifiers.setForced(forcedModifiers);
    this.activeModifierIds = this.modifiers.getActiveIds();
    this.modifierMultipliers = this.modifiers.getMultipliers();
    const vehicles = VEHICLE_CATALOG[role] || VEHICLE_CATALOG.robber;
    const mission = {
      ...(challengeMission || baseMission),
      duration: Math.max(45, Math.round((challengeMission || baseMission).duration * this.currentDifficulty.timerScale * this.modifierMultipliers.timerScale)),
    };
    let vehicle = vehicles.find((item) => item.id === selection?.vehicleId) || vehicles[0];
    if (!this.progression.isUnlocked(vehicle.id) && !vehicle.unlockedByDefault) {
      vehicle = vehicles.find((item) => item.unlockedByDefault || this.progression.isUnlocked(item.id)) || vehicles[0];
    }
    this.currentLoadout = this.loadouts.get(role, vehicle);
    this.currentDistrict = DISTRICTS[mission.districtId] || this.districts?.resolve?.(new THREE.Vector3(0, 0, 0)) || DISTRICTS.downtown;
    this.scoreKey = this.makeScoreKey(mission, this.currentDifficulty.id, this.activeModifierIds);
    return { role, mission, vehicle };
  }

  makeScoreKey(mission, difficultyId, modifierIds = []) {
    const modifierKey = modifierIds.length ? [...modifierIds].sort().join('+') : 'none';
    return `${mission.id}|${difficultyId}|${modifierKey}`;
  }

  start(selection) {
    this.audio.resume();
    this.clearMatch();
    const resolved = this.resolveSelection(selection);
    const { role, mission, vehicle } = resolved;
    this.role = role;
    this.lastRole = role;
    this.currentMission = mission;
    this.selectedVehicle = vehicle;
    this.lastSelection = {
      role,
      mode: mission.cup ? 'cup' : this.currentCareer ? 'career' : this.currentChallenge ? 'challenge' : 'mission',
      careerId: this.currentCareer?.id || null,
      missionId: mission.baseMissionId || mission.id,
      challengeId: this.currentChallenge?.id || null,
      cupId: mission.cupId || null,
      vehicleId: vehicle.id,
      difficultyId: this.currentDifficulty.id,
      modifiers: [...this.modifiers.selected],
      loadout: this.currentLoadout,
    };
    this.missions.start(mission);
    this.wanted.reset(role);
    this.wanted.setGrowthScale(this.currentDifficulty.wantedGrowth);
    if (this.currentChallenge?.startWanted) {
      this.wanted.points = this.currentChallenge.startWanted * 36;
    }
    this.specialSpawned.clear();
    this.captainBoss.reset();
    this.highlights.reset();
    this.radio.reset();
    this.stats = this.createStats(role);
    this.running = true;
    this.paused = false;
    this.ended = false;
    this.timer = mission.duration || GAME_DURATION;
    this.matchTime = 0;
    this.radioTimer = 0.8;
    this.pressureStage = 0;
    this.traffic.setPhase4State({
      trafficBonus: this.currentDifficulty.trafficBonus + this.modifierMultipliers.trafficBonus + (this.currentDistrict?.trafficBonus || 0),
      chaos: 0,
    });
    this.hud.showGame(role, mission);
    this.hud.setPhase4State({ difficultyId: this.currentDifficulty.id, modifiers: [...this.modifiers.selected] });
    this.camera.startIntro();
    this.director = new ChaseDirector({
      role,
      hud: this.hud,
      radio: this.radio,
      onEvent: (event) => this.handleDirectorEvent(event),
    });

    if (role === 'robber') {
      this.setupRobberMode();
      this.traffic.reset(this.player);
      this.radio.say(role, 'start', `${mission.name}: armored suspect entering Heatline downtown.`);
    } else {
      this.setupPoliceMode();
      this.traffic.reset(this.player);
      this.radio.say(role, 'start', `${mission.name}: interceptor online. Target is moving through the city loop.`);
    }
    if (this.currentChallenge?.startWanted) {
      this.wanted.check('challenge');
    }
    this.pickups.reset({
      difficulty: this.currentDifficulty,
      modifiers: this.modifierMultipliers,
      challenge: this.currentChallenge,
    });
    if (this.currentChallenge?.startCaptain || mission.startCaptain || this.modifierMultipliers.captainEarly) {
      const delay = (this.currentChallenge?.startCaptain || mission.startCaptain) ? 1.2 : 10;
      window.setTimeout(() => {
        if (!this.ended && this.running) this.deployCaptain();
      }, delay * 1000);
    }
  }

  setupRobberMode() {
    this.player = this.spawnVehicle(this.selectedVehicle, this.city.spawnPoints.robber, true);
    this.robber = this.player;

    const policeSpawns = this.city.spawnPoints.policeUnits;
    const baseCount = this.currentMission.mode === 'survival' ? 3 : 2;
    for (let i = 0; i < baseCount; i += 1) {
      const police = this.spawnVehicle('police', policeSpawns[i], false);
      this.ai.push(new AIController({
        vehicle: police,
        mode: 'chase',
        city: this.city,
        targetResolver: () => this.player,
        profile: this.pickPersonality(i, i === 1 ? 'rammer' : i === 2 ? 'blocker' : 'chaser'),
      }));
    }
    if (this.currentMission.mode === 'survival') {
      const swat = this.spawnVehicle('swat', this.city.spawnPoints.swat, false);
      this.ai.push(new AIController({
        vehicle: swat,
        mode: 'chase',
        city: this.city,
        targetResolver: () => this.player,
        profile: this.pickPersonality(3, 'rammer'),
      }));
    }
  }

  setupPoliceMode() {
    this.player = this.spawnVehicle(this.selectedVehicle, this.city.spawnPoints.police, true);
    this.robber = this.spawnVehicle('robber', this.city.spawnPoints.aiRobber, false, {
      statOverrides: {
        ...(this.currentMission.mode === 'convoy' ? { maxHealth: 340, maxSpeed: 42 } : {}),
        ...(this.currentMission.robberStatOverrides || {}),
      },
    });
    this.ai.push(new AIController({
      vehicle: this.robber,
      mode: 'escape',
      city: this.city,
      targetResolver: () => this.player,
      profile: this.pickPersonality(0, 'escape'),
    }));

    for (let i = 0; i < 2; i += 1) {
      const police = this.spawnVehicle('police', this.city.spawnPoints.policeUnits[i], false);
      this.ai.push(new AIController({
        vehicle: police,
        mode: 'chase',
        city: this.city,
        targetResolver: () => this.robber,
        profile: this.pickPersonality(i + 1, i === 1 ? 'blocker' : 'chaser'),
      }));
    }
    const swat = this.spawnVehicle('swat', this.city.spawnPoints.policeUnits[2], false);
    this.ai.push(new AIController({
      vehicle: swat,
      mode: 'chase',
      city: this.city,
      targetResolver: () => this.robber,
      profile: this.pickPersonality(3, 'rammer'),
    }));

    if (this.currentMission.mode === 'convoy') {
      this.spawnRobberSupport('escortCar', { position: this.city.spawnPoints.aiRobber.position.clone().add(new THREE.Vector3(-12, 0, 8)), yaw: Math.PI / 2 });
      this.spawnRobberSupport('jammerVan', { position: this.city.spawnPoints.aiRobber.position.clone().add(new THREE.Vector3(-18, 0, -8)), yaw: Math.PI / 2 });
      this.radio.push('Convoy support vehicles confirmed near the target.', 'Dispatch');
    }

    if (this.currentMission.mode === 'intercept') {
      window.setTimeout(() => {
        if (!this.ended && this.role === 'police') this.roadblocks.spawn(this.robber, this.role);
      }, 1200);
    }
  }

  spawnVehicle(typeOrCatalog, spawn, isPlayer, options = {}) {
    const catalog = typeof typeOrCatalog === 'object' ? typeOrCatalog : null;
    const type = catalog?.baseType || options.type || typeOrCatalog;
    const visualType = catalog?.id || options.visualType || type;
    const visual = this.vehicleFactory.create(visualType);
    const baseStats = VEHICLE_STATS[type] || VEHICLE_STATS.police;
    let stats = {
      ...baseStats,
      ...(catalog?.statOverrides || {}),
      ...(options.statOverrides || {}),
    };
    if (isPlayer && this.currentLoadout) {
      stats = this.loadouts.applyStats(stats, this.currentLoadout);
    }
    if (stats.faction === 'robber') {
      stats.maxHealth *= ROBBER_HEALTH_MULTIPLIER;
    }
    if (!isPlayer) {
      stats.maxSpeed *= this.currentDifficulty.aiSpeed;
      stats.acceleration *= this.currentDifficulty.aiSpeed;
      stats.handling *= this.currentDifficulty.aiSpeed > 1 ? 1.04 : 0.96;
    } else {
      stats.primaryDamage *= this.currentDifficulty.weaponDamageGiven;
      stats.secondaryDamage *= this.currentDifficulty.weaponDamageGiven;
    }
    if (options.label) stats.label = options.label;
    const controller = new VehicleController({
      visual,
      stats,
      type,
      id: `${type}-${this.vehicleId += 1}`,
      isPlayer,
    });
    controller.catalogId = catalog?.id || null;
    controller.unitKind = options.unitKind || null;
    controller.label = stats.label;
    controller.abilityCooldownScale = catalog?.stats?.cooldown
      ? clamp(1 - (catalog.stats.cooldown - 50) / 180, 0.72, 1.18)
      : 1;
    controller.damageTakenMultiplier = isPlayer
      ? this.currentDifficulty.weaponDamageTaken * this.modifierMultipliers.damageTaken
      : 1;
    controller.nitroRechargeMultiplier = isPlayer ? this.modifierMultipliers.nitroRecharge : 1;
    controller.aiAggressionScale = isPlayer ? 1 : this.currentDifficulty.aiAggression;
    controller.setSpawn(spawn.position, spawn.yaw);
    this.sceneManager.scene.add(controller.group);
    this.vehicles.push(controller);
    if (isPlayer && this.currentLoadout) {
      this.abilities.setLoadout(controller, this.currentLoadout);
      this.loadouts.applyController(controller, this.currentLoadout);
    } else if (catalog?.loadout) {
      this.abilities.setLoadout(controller, catalog.loadout);
    } else {
      this.abilities.setLoadout(controller, this.getDefaultLoadout(controller));
    }
    return controller;
  }

  getDefaultLoadout(vehicle) {
    if (vehicle.faction === 'robber') {
      return { primary: 'heavyMachineGun', secondary: 'rearMine', boost: 'nitroSurge' };
    }
    if (vehicle.type === 'swat') {
      return { primary: 'machineGun', secondary: 'spikeStrip', boost: 'nitroSurge' };
    }
    return { primary: 'taserBullets', secondary: 'empShot', boost: 'nitroSurge' };
  }

  pickPersonality(index, fallback) {
    const list = this.currentMission?.aiPersonalities || [];
    return list[index % Math.max(1, list.length)] || fallback;
  }

  spawnRobberSupport(kind, spawn) {
    const config = SPECIAL_UNITS[kind];
    if (!config || this.activeCombatVehicles() >= PERFORMANCE_LIMITS.combatVehicles) return null;
    const vehicle = this.spawnVehicle(config.type, spawn || this.safePoliceSpawn(), false, {
      statOverrides: config.statOverrides,
      label: config.label,
      unitKind: kind,
      visualType: kind === 'heavyRaiderSupport' ? 'heavy-raider' : config.type,
    });
    vehicle.faction = 'robber';
    this.convoySupport.push(vehicle);
    this.ai.push(new AIController({
      vehicle,
      mode: 'chase',
      city: this.city,
      targetResolver: () => this.player,
      profile: config.profile,
    }));
    return vehicle;
  }

  spawnSpecialUnit(kind, targetResolver = () => this.player) {
    const config = SPECIAL_UNITS[kind];
    if (!config || this.activeCombatVehicles() >= PERFORMANCE_LIMITS.combatVehicles) return null;
    const vehicle = this.spawnVehicle(config.type, this.safePoliceSpawn(), false, {
      statOverrides: config.statOverrides,
      label: config.label,
      unitKind: kind,
      visualType: kind === 'captain' ? 'captain' : config.type,
    });
    this.ai.push(new AIController({
      vehicle,
      mode: 'chase',
      city: this.city,
      targetResolver,
      profile: config.profile,
    }));
    this.radio.push(`${config.label} joined the pursuit.`, 'Command');
    return vehicle;
  }

  activeCombatVehicles() {
    return this.vehicles.filter((vehicle) => !vehicle.destroyed).length;
  }

  clearMatch() {
    for (const vehicle of this.vehicles) {
      this.sceneManager.scene.remove(vehicle.group);
    }
    this.vehicles.length = 0;
    this.ai.length = 0;
    this.convoySupport.length = 0;
    this.player = null;
    this.robber = null;
    this.director = null;
    this.specialSpawned.clear();
    this.effects.clear();
    this.weapons.clear();
    this.abilities.clear();
    this.pickups.clear();
    this.radar.clear();
    this.radio.reset();
    this.captainBoss.reset();
    this.highlights.reset();
    this.traffic?.clear();
    this.roadblocks?.clear();
    this.destructibles?.build();
  }

  resetToMenu() {
    this.running = false;
    this.paused = false;
    this.ended = false;
    this.clearMatch();
    this.cups.clear();
    this.input.clear();
    this.audio.update(0, { speed: 0, sirenIntensity: 0 });
    this.hud.showMenu();
  }

  loop() {
    const dt = this.sceneManager.getDelta();
    this.elapsed += dt;

    if (this.running && !this.ended) {
      this.updateMatch(dt);
    } else {
      this.camera.updateMenuOrbit(dt, this.elapsed);
      this.dayEnvironment.update(dt);
      this.effects.update(dt);
    }

    this.input.endFrame();
    this.sceneManager.render();
    if (!this.running || this.ended) this.garagePreview.update(dt);
    window.requestAnimationFrame(() => this.loop());
  }

  updateMatch(dt) {
    if (this.input.consumePause()) {
      this.paused = !this.paused;
      this.hud.setPaused(this.paused);
      this.audio.playClick();
    }

    if (this.paused) {
      this.audio.update(dt, { speed: 0, sirenIntensity: 0 });
      return;
    }

    this.matchTime += dt;
    this.timer = Math.max(0, this.timer - dt);
    this.radioTimer -= dt;
    this.highlights.update(dt);
    const missionHudBefore = this.missions.getHudState();
    const activePoliceBefore = this.vehicles.filter((vehicle) => vehicle.faction === 'police' && !vehicle.destroyed).length;
    const objectiveDistance = missionHudBefore.target && this.player
      ? missionHudBefore.target.distanceTo(this.player.group.position)
      : 120;
    this.stats.eventIntensity = this.director?.update({
      dt,
      matchTime: this.matchTime,
      missionTimer: this.timer,
      timerRatio: this.timer / Math.max(1, this.currentMission.duration || GAME_DURATION),
      playerHealthRatio: this.player ? this.player.health / this.player.maxHealth : 1,
      activePolice: activePoliceBefore,
      playerSpeed: this.player?.speed || 0,
      wantedLevel: this.wanted.level,
      pressure: this.wanted.pressure,
      takedowns: this.stats.takedowns,
      objectiveDistance,
      difficulty: this.currentDifficulty,
      modifiers: this.modifierMultipliers,
    }) ?? this.stats.eventIntensity;
    const districtEvent = this.districts?.update(dt, {
      player: this.player,
      intensity: this.stats.eventIntensity,
      mission: this.currentMission,
    });
    if (this.districts?.current) this.currentDistrict = this.districts.current;
    if (districtEvent) {
      this.currentDistrictEvent = districtEvent;
      this.stats.eventIntensity = Math.max(this.stats.eventIntensity, districtEvent.intensity || 0);
      if (districtEvent.roadblock) this.spawnPredictedRoadblock(this.role === 'robber' ? this.player : this.robber);
      if (districtEvent.captain) this.deployCaptain();
    }
    this.traffic.setPhase4State({
      trafficBonus: this.currentDifficulty.trafficBonus + this.modifierMultipliers.trafficBonus + (this.currentDistrict?.trafficBonus || 0),
      chaos: Math.max(this.stats.eventIntensity, this.wanted.getHudValue()),
    });

    this.updateVehicles(dt);
    this.weapons.update(dt, this.vehicles);
    this.abilities.update(dt, this.vehicles);
    this.traffic.update(dt, this.vehicles);
    this.collision.update(this.vehicles, this.city, dt, this.elapsed);
    this.roadblocks.update(dt);
    this.destructibles.update(dt, this.vehicles);
    this.pickups.update(dt, this.player, this.stats);
    const missionState = this.missions.update(dt, {
      player: this.player,
      robber: this.robber,
      stats: this.stats,
      roadblocks: this.roadblocks,
    });
    this.timer = missionState.timer;
    this.wanted.update(dt, {
      player: this.player,
      robber: this.robber,
      stats: this.stats,
    });
    if (this.modifierMultipliers.captainEarly && this.matchTime > 40) this.deployCaptain();
    this.captainBoss.update(dt, {
      player: this.role === 'robber' ? this.player : this.robber,
      vehicles: this.vehicles,
    });
    this.updateRespawns(dt);
    this.updateHealthBars();
    this.updateHud();
    this.updateTargetMarker();
    this.updateAudio(dt);
    this.dayEnvironment.update(dt);
    this.effects.update(dt);
    this.camera.update(dt, this.player && !this.player.destroyed ? this.player : this.robber, this.matchTime);
    this.radio.update(dt);
    this.updateRadar();
    this.performanceDebug.update(dt, {
      ai: this.ai.length,
      traffic: this.traffic?.cars?.length || 0,
      projectiles: this.weapons?.projectiles?.length || 0,
      particles: this.effects?.particles?.length || 0,
      district: this.currentDistrict?.name,
      event: this.currentDistrictEvent?.name,
      wanted: this.wanted.level,
      chaseState: this.director?.tension,
    });
    this.checkWinLoss();
    this.emitRadio();
  }

  updateVehicles(dt) {
    const playerInput = this.player?.destroyed ? this.emptyInput() : this.input.getVehicleInput();
    if (this.player && !this.player.destroyed) {
      if (playerInput.nitro && !this.lastNitroInput) this.stats.nitroUses += 1;
      this.lastNitroInput = Boolean(playerInput.nitro);
      if (this.input.consumeRecenter()) this.camera.shake(0.05);
      this.player.update(dt, playerInput, this.city, this.effects, this.elapsed);
      if (playerInput.primary) this.abilities.firePrimary(this.player, this.vehicles, playerInput.weaponVector);
      if (playerInput.secondary) this.abilities.fireSecondary(this.player, this.vehicles, this.robber);
    }
    if (!playerInput.nitro) this.lastNitroInput = false;

    for (const controller of this.ai) {
      const aiInput = controller.update(dt, this.vehicles);
      controller.vehicle.update(dt, aiInput, this.city, this.effects, this.elapsed);
      if (aiInput.primary) this.abilities.firePrimary(controller.vehicle, this.vehicles);
      if (aiInput.secondary && Math.random() < 0.35) this.abilities.fireSecondary(controller.vehicle, this.vehicles, this.player);
    }
  }

  handleDirectorEvent(event) {
    if (event.dynamic && event.message) this.radio.push(event.message, 'Director');
    if (this.role === 'robber') {
      if (event.key === 'road-pressure') {
        if (this.activeCombatVehicles() < PERFORMANCE_LIMITS.combatVehicles) {
          const blocker = this.spawnVehicle('police', this.safePoliceSpawn(), false);
          this.ai.push(new AIController({
            vehicle: blocker,
            mode: 'chase',
            city: this.city,
            targetResolver: () => this.player,
            profile: 'blocker',
          }));
        }
        this.spawnPredictedRoadblock(this.player);
      } else if (event.key === 'swat') {
        if (this.activeCombatVehicles() < PERFORMANCE_LIMITS.combatVehicles) {
          const swat = this.spawnVehicle('swat', this.safePoliceSpawn(), false);
          this.ai.push(new AIController({
            vehicle: swat,
            mode: 'chase',
            city: this.city,
            targetResolver: () => this.player,
            profile: 'rammer',
          }));
        }
      } else if (event.key === 'lockdown') {
        this.spawnPredictedRoadblock(this.player);
      } else if (event.key === 'director-spawn') {
        this.spawnSpecialUnit(this.stats.eventIntensity > 0.7 ? 'swatRammer' : 'blockerVan');
      } else if (event.key === 'director-roadblock') {
        this.spawnPredictedRoadblock(this.player);
      } else if (event.key === 'director-elite') {
        this.spawnSpecialUnit(this.modifierMultipliers.empPressure ? 'eliteInterceptor' : 'swatRammer');
      }
    } else if (this.role === 'police') {
      if (event.key === 'support') {
        if (this.activeCombatVehicles() < PERFORMANCE_LIMITS.combatVehicles) {
          const support = this.spawnVehicle('police', this.safePoliceSpawn(), false);
          this.ai.push(new AIController({
            vehicle: support,
            mode: 'chase',
            city: this.city,
            targetResolver: () => this.robber,
            profile: 'blocker',
          }));
        }
      } else if (event.key === 'escape-route') {
        this.spawnPredictedRoadblock(this.robber);
      } else if (event.key === 'final-disable') {
        this.spawnPredictedRoadblock(this.robber);
        if (this.currentMission.mode === 'convoy' && !this.specialSpawned.has('heavyRaiderSupport')) {
          this.specialSpawned.add('heavyRaiderSupport');
          this.spawnRobberSupport('heavyRaiderSupport', {
            position: this.city.spawnPoints.aiRobber.position.clone().add(new THREE.Vector3(-28, 0, 0)),
            yaw: Math.PI / 2,
          });
          this.radio.push('Heavy raider support is protecting the convoy leader.', 'Dispatch');
        }
      } else if (event.key === 'director-roadblock') {
        this.spawnPredictedRoadblock(this.robber);
      } else if (event.key === 'director-spawn') {
        if (this.activeCombatVehicles() < PERFORMANCE_LIMITS.combatVehicles) {
          const support = this.spawnVehicle('police', this.safePoliceSpawn(), false);
          this.ai.push(new AIController({
            vehicle: support,
            mode: 'chase',
            city: this.city,
            targetResolver: () => this.robber,
            profile: 'blocker',
          }));
        }
      }
    }
  }

  spawnPredictedRoadblock(target) {
    const missionHud = this.missions.getHudState();
    const spawned = this.roadblocks.spawn(target, this.role, {
      objective: missionHud.target,
    });
    if (spawned) {
      this.radio.say(this.role, 'roadblock', 'Roadblock moving into position.');
      this.highlights.record('roadblock', 'Roadblock Warning', 'A predicted roadblock entered the route.', 1.8);
    }
    return spawned;
  }

  handleWantedEscalation(config) {
    if (this.role !== 'robber' || this.specialSpawned.has(config.level)) return;
    this.specialSpawned.add(config.level);
    if (config.level === 2) {
      this.spawnSpecialUnit('blockerVan');
      this.roadblocks.spawn(this.player, this.role);
    } else if (config.level === 3) {
      this.spawnSpecialUnit('swatRammer');
      this.roadblocks.spawn(this.player, this.role);
    } else if (config.level === 4) {
      const elite = this.spawnSpecialUnit('eliteInterceptor');
      if (elite) this.abilities.setLoadout(elite, { primary: 'taserBullets', secondary: 'empShot', boost: 'nitroSurge' });
    } else if (config.level === 5) {
      this.deployCaptain();
    }
  }

  deployCaptain() {
    if (this.specialSpawned.has('captainBoss')) return null;
    this.specialSpawned.add('captainBoss');
    const captain = this.spawnSpecialUnit('captain', this.role === 'police' ? () => this.robber : () => this.player);
    if (captain) {
      captain.group.name = 'PoliceCaptainUnit';
      captain.unitKind = 'captain';
      this.abilities.setLoadout(captain, { primary: 'taserBullets', secondary: 'empShot', boost: 'nitroSurge' });
      this.captainBoss.setCaptain(captain);
      this.highlights.record('captain', 'Captain Unit Deployed', 'Elite police captain joined the chase.', 4);
      this.radio.say(this.role, 'captain', 'Captain unit deployed.');
    }
    return captain;
  }

  spawnCaptainSupport() {
    const support = this.spawnSpecialUnit('eliteInterceptor');
    if (support) {
      support.unitKind = 'captainSupport';
      this.radio.push('Captain support unit moving to intercept.', 'Command');
    }
  }

  handleCaptainDefeated(captain) {
    this.stats.captainDefeated = true;
    this.effects.explosion(captain.group.position, 1.5);
    this.camera.shake(0.85);
    this.highlights.record('captain-defeat', 'Captain Defeated', 'Tactical captain unit disabled.', 5);
    this.hud.showEvent('CAPTAIN DEFEATED');
    this.hud.showScorePopup('+ Captain bonus');
  }

  updateRespawns(dt) {
    for (const vehicle of this.vehicles) {
      if (!vehicle.destroyed) continue;

      if (this.role === 'police' && vehicle === this.player) {
        if (this.currentChallenge?.noRepairs) {
          this.missions.fail('No Repair Run failed: interceptor destroyed.');
          continue;
        }
        if (vehicle.respawnTimer <= 0) {
          vehicle.respawnTimer = 3.5;
          this.stats.playerDeaths += 1;
          this.radio.push('Interceptor disabled. Reserve unit deploying.', 'Dispatch');
        }
        vehicle.respawnTimer -= dt;
        if (vehicle.respawnTimer <= 0 && !this.ended) {
          const spawn = this.safePoliceSpawn();
          vehicle.respawn(spawn.position, spawn.yaw, 0.68);
          this.radio.push('You are back in the chase. Stay on the target.', 'Dispatch');
        }
        continue;
      }

      const isRespawnablePolice = !vehicle.unitKind && vehicle.faction === 'police' && (this.role === 'robber' || vehicle !== this.player);
      if (isRespawnablePolice) {
        if (vehicle.respawnTimer <= 0) vehicle.respawnTimer = rand(4.2, 7.6);
        vehicle.respawnTimer -= dt;
        if (vehicle.respawnTimer <= 0 && !this.ended) {
          const spawn = this.safePoliceSpawn();
          vehicle.respawn(spawn.position, spawn.yaw, vehicle.type === 'swat' ? 0.95 : 1);
          this.radio.push(vehicle.type === 'swat' ? 'SWAT unit rejoined the pursuit.' : 'Police interceptor respawned ahead.', 'Dispatch');
        }
      }
    }
  }

  updatePressure() {
    if (this.role !== 'robber') return;
    if (this.pressureStage < 1 && this.timer < 120) {
      this.pressureStage = 1;
      const extra = this.spawnVehicle('police', this.safePoliceSpawn(), false);
      this.ai.push(new AIController({
        vehicle: extra,
        mode: 'chase',
        city: this.city,
        targetResolver: () => this.player,
      }));
      this.radio.push('Heat level rising. Additional interceptor entering the grid.', 'Dispatch');
    }
    if (this.pressureStage < 2 && this.timer < 60) {
      this.pressureStage = 2;
      const extraSwat = this.spawnVehicle('swat', this.safePoliceSpawn(), false);
      this.ai.push(new AIController({
        vehicle: extraSwat,
        mode: 'chase',
        city: this.city,
        targetResolver: () => this.player,
      }));
      this.radio.push('Heavy unit authorized. Keep moving.', 'Dispatch');
    }
  }

  safePoliceSpawn() {
    const candidates = this.city.spawnPoints.policeUnits;
    const target = this.robber && !this.robber.destroyed ? this.robber : this.player;
    const ordered = [...candidates].sort((a, b) => {
      if (!target) return 0;
      return b.position.distanceToSquared(target.group.position) - a.position.distanceToSquared(target.group.position);
    });
    const chosen = ordered[Math.floor(Math.random() * Math.min(2, ordered.length))];
    return {
      position: chosen.position.clone().add(new THREE.Vector3(rand(-4, 4), 0, rand(-4, 4))),
      yaw: chosen.yaw,
    };
  }

  updateHealthBars() {
    for (const vehicle of this.vehicles) {
      const visible = vehicle !== this.player && vehicle.group.position.distanceTo(this.player?.group.position || vehicle.group.position) < 85;
      vehicle.updateHealthBar(this.sceneManager.camera, visible);
    }
  }

  updateHud() {
    const activePolice = this.vehicles.filter((vehicle) => vehicle.faction === 'police' && !vehicle.destroyed).length;
    const supportUnits = this.vehicles.filter((vehicle) => vehicle.faction === 'police' && vehicle !== this.player && !vehicle.destroyed).length;
    const boostHeld = this.input.keys.has('ShiftLeft') || this.input.keys.has('ShiftRight');
    const missionHud = this.missions.getHudState();
    missionHud.district = this.currentDistrict?.name || (missionHud.district ? DISTRICTS[missionHud.district]?.name : '');
    this.hud.setSpeedLines(Boolean(this.settings.get().motionEffects !== 'reduced' && this.player && !this.player.destroyed && this.player.nitro < 99 && boostHeld));
    this.hud.update({
      role: this.role,
      timer: this.timer,
      player: this.player,
      target: this.role === 'police' ? this.robber : null,
      activePolice,
      supportUnits,
      intensity: this.stats.eventIntensity,
      alert: this.role === 'robber'
        ? this.wanted.getHudValue()
        : Math.max(this.wanted.getHudValue(), clamp(1 - (this.robber?.health || 0) / (this.robber?.maxHealth || 1), 0, 1)),
      wantedLevel: this.wanted.level,
      primaryCooldown: this.player?.primaryCooldown || 0,
      secondaryCooldown: this.player?.secondaryCooldown || 0,
      primaryLabel: this.player?.primaryAbility?.label || ABILITY_CONFIG.machineGun.label,
      secondaryLabel: this.player?.utilityAbility
        ? `${this.player.secondaryAbility?.label || 'Ability'} / ${this.player.utilityAbility.label}`
        : this.player?.secondaryAbility?.label || (this.role === 'robber' ? 'Rear Mine' : 'EMP Shot'),
      mission: missionHud,
    });
  }

  updateTargetMarker() {
    const missionHud = this.missions.getHudState();
    if (missionHud.target && this.role === 'robber') {
      this.markers.update(missionHud.target, this.currentMission.mode === 'cargo' ? 'DROP' : 'CHECKPOINT');
      return;
    }
    const captainTarget = this.captainBoss.getTargetPosition();
    if (captainTarget && this.role === 'robber') {
      this.markers.update(captainTarget, 'CAPTAIN');
      return;
    }
    if (this.role === 'police' && this.robber && !this.robber.destroyed) {
      this.markers.update(this.robber.group.position, 'ROBBER');
      return;
    }
    this.markers.update(null);
  }

  updateRadar() {
    const missionHud = this.missions.getHudState();
    this.radar.update({
      player: this.player,
      target: this.role === 'police' ? this.robber : this.captainBoss.captain,
      vehicles: this.vehicles,
      missionTarget: missionHud.target,
      roadblocks: this.roadblocks,
      pickups: this.pickups.pickups,
      settings: this.settings.get(),
    });
  }

  updateAudio(dt) {
    const player = this.player;
    const nearPolice = this.vehicles.some((vehicle) => (
      vehicle.faction === 'police' &&
      !vehicle.destroyed &&
      vehicle !== player &&
      player &&
      vehicle.group.position.distanceTo(player.group.position) < 88
    ));
    this.audio.update(dt, {
      speed: player?.speed || 0,
      nitro: player && player.nitro < 99 && (this.input.keys.has('ShiftLeft') || this.input.keys.has('ShiftRight')),
      sirenIntensity: nearPolice || this.role === 'police' ? 1 : 0,
      lowHealth: player && !player.destroyed && player.health / player.maxHealth < 0.28,
      drifting: player?.isDrifting,
    });
    if (player && !player.destroyed && player.health / player.maxHealth < 0.2) {
      player.sputterTimer = (player.sputterTimer || 0) - dt;
      if (player.sputterTimer <= 0) {
        player.sputterTimer = 0.75;
        this.audio.playEngineSputter();
      }
    }
  }

  checkWinLoss() {
    if (this.ended) return;
    const missionState = this.missions.state;
    if (missionState.completed) {
      const title = this.role === 'robber'
        ? (this.currentMission.mode === 'cargo' ? 'Cargo Delivered' : 'Escaped')
        : 'Target Disabled';
      this.end(true, title, missionState.status);
    } else if (missionState.failed) {
      const title = this.role === 'robber' ? 'Busted' : 'Robber Escaped';
      this.end(false, title, missionState.status);
    }
  }

  end(win, title, summary) {
    this.ended = true;
    this.running = false;
    this.paused = false;
    this.stats.remainingTime = this.timer;
    const score = this.scoreSystem.calculate({
      mission: this.currentMission,
      missionState: this.missions.state,
      stats: this.stats,
      player: this.player,
      robber: this.robber,
      wantedLevel: this.wanted.level,
      scoreMultiplier: this.difficulty.getScoreMultiplier(this.modifierMultipliers.scoreMultiplier),
      cleanPenalty: this.modifierMultipliers.cleanRun ? (this.stats.trafficHits + this.stats.propHits) * 180 : 0,
    });
    this.highlights.record(win ? 'mission-complete' : 'mission-failed', win ? 'Mission Complete' : 'Mission Failed', summary, win ? 4 : 2);
    const highlights = this.highlights.getHighlights();
    const previousBest = this.progression.getBestScore(this.scoreKey);
    const unlocks = this.progression.recordResult({
      mission: this.currentMission,
      score,
      win,
      stats: this.stats,
      key: this.scoreKey,
      medal: score.medal,
      highlights,
    });
    let nextRound = null;
    let cupLabel = this.currentMission.cupName || 'None';
    if (this.currentMission.cup && this.cups.active) {
      if (win) {
        const nextMission = this.cups.advance(score);
        if (nextMission) {
          nextRound = nextMission.name;
          title = 'Cup Round Complete';
          summary = `${summary} Next round: ${nextRound}.`;
          this.lastSelection = {
            ...this.lastSelection,
            mode: 'cup',
            cupId: this.cups.active.id,
            cupContinue: true,
            role: nextMission.role,
          };
        } else {
          cupLabel = `${this.currentMission.cupName} complete`;
          this.progression.recordCup({ id: this.currentMission.cupId }, this.cups.active.score, score.medal);
          unlocks.push('Cup score saved');
          this.cups.clear();
        }
      }
    }
    const achievementUnlocks = [];
    this.progression.mutate((progress) => {
      achievementUnlocks.push(...this.statsAchievements.record(progress, {
        mission: this.currentMission,
        score,
        win,
        stats: this.stats,
        vehicleId: this.selectedVehicle?.id,
        wantedLevel: this.wanted.level,
      }));
    });
    unlocks.push(...achievementUnlocks.map((item) => item.name));
    this.hud.setProgressSnapshot(this.progression.getSnapshot());
    this.hud.setPaused(false);
    this.hud.setSpeedLines(false);
    this.hud.updateTargetMarker({ visible: false });
    this.radar.clear();
    this.captainBoss.reset();
    this.radio.say(this.role, win ? 'success' : 'fail', summary);
    this.audio.playMissionResult(win);
    this.hud.showResult({
      win,
      title,
      summary,
      stats: {
        role: this.stats.role,
        mission: this.currentMission.name,
        time: this.role === 'robber'
          ? formatTime((this.currentMission.duration || GAME_DURATION) - this.timer)
          : `${formatTime(this.timer)} left`,
        destroyed: this.stats.destroyed,
        damageDealt: this.stats.damageDealt,
        biggestHit: this.stats.biggestHit,
        takedowns: this.stats.takedowns,
        totalScore: score.total,
        rank: score.rank,
        medal: score.medal,
        difficulty: this.currentDifficulty.name,
        modifiers: this.activeModifierIds.length ? this.activeModifierIds.map((id) => id.replace(/[A-Z]/g, (letter) => ` ${letter}`).replace(/^./, (letter) => letter.toUpperCase())).join(', ') : 'None',
        bonusComplete: this.missions.state.bonusComplete,
        bestScore: Math.max(previousBest, score.total),
        unlocks,
        district: this.currentDistrict?.name,
        cup: cupLabel,
        nextRound,
        highlights: this.highlights.getHighlights(),
      },
    });
  }

  emitRadio() {
    if (this.radioTimer > 0 || this.ended) return;
    this.radioTimer = rand(8, 14);
    if (this.role === 'robber') {
      const lines = [
        'Dispatch: suspect still mobile near city center.',
        'Unit callout: watch the mines, keep distance on turns.',
        'Air watch: downtown lanes are open for pursuit.',
        'Checkpoint warning: heavy vehicle pushing through traffic control.',
      ];
      if (this.player?.health / this.player?.maxHealth < 0.28) this.radio.say('robber', 'lowHealth');
      else this.radio.push(lines[Math.floor(Math.random() * lines.length)], 'Dispatch');
    } else {
      const ratio = this.robber ? this.robber.health / this.robber.maxHealth : 1;
      const lines = ratio < 0.4
        ? ['Target smoking. Maintain pressure.', 'Robber armor is failing. Box them in.']
        : ['Support unit tracking from the east lane.', 'Keep the interceptor close and line up the EMP.'];
      if (this.player?.health / this.player?.maxHealth < 0.28) this.radio.say('police', 'lowHealth');
      else this.radio.push(lines[Math.floor(Math.random() * lines.length)], 'Dispatch');
    }
  }

  emptyInput() {
    return {
      throttle: 0,
      brake: false,
      steer: 0,
      handbrake: false,
      nitro: false,
      primary: false,
      weaponVector: null,
      secondary: false,
      reset: false,
    };
  }
}
