export const GAME_DURATION = 180;
export const ROBBER_HEALTH_MULTIPLIER = 7;

export const FACTIONS = {
  ROBBER: 'robber',
  POLICE: 'police',
};

export const VEHICLE_STATS = {
  robber: {
    label: 'Armored Outlaw',
    faction: FACTIONS.ROBBER,
    maxHealth: 300,
    maxSpeed: 45,
    reverseSpeed: 16,
    acceleration: 34,
    braking: 48,
    handling: 2.05,
    grip: 10.5,
    driftGrip: 3.1,
    armor: 0.78,
    radius: 3.4,
    mass: 1.78,
    ramPower: 1.25,
    primaryDamage: 20,
    secondaryDamage: 72,
  },
  police: {
    label: 'Police Interceptor',
    faction: FACTIONS.POLICE,
    maxHealth: 120,
    maxSpeed: 54,
    reverseSpeed: 18,
    acceleration: 41,
    braking: 56,
    handling: 2.82,
    grip: 12,
    driftGrip: 3.8,
    armor: 1,
    radius: 2.85,
    mass: 1,
    ramPower: 0.9,
    primaryDamage: 11,
    secondaryDamage: 28,
  },
  swat: {
    label: 'SWAT SUV',
    faction: FACTIONS.POLICE,
    maxHealth: 160,
    maxSpeed: 38,
    reverseSpeed: 12,
    acceleration: 26,
    braking: 38,
    handling: 1.75,
    grip: 10,
    driftGrip: 2.8,
    armor: 0.84,
    radius: 3.3,
    mass: 2.1,
    ramPower: 1.55,
    primaryDamage: 8,
    secondaryDamage: 18,
  },
};

export const HANDLING = {
  nitroMultiplier: 1.42,
  nitroBurnRate: 32,
  nitroRechargeRoad: 15,
  nitroRechargeOffroad: 9,
  offroadSpeedMultiplier: 0.68,
  coastingDrag: 0.22,
  throttleDrag: 0.1,
  steeringLowSpeedGrip: 0.28,
  driftSmokeSpeed: 13,
  dustSpeed: 11,
};

export const WEAPONS = {
  primaryCooldown: 0.14,
  policePrimaryCooldown: 0.13,
  secondaryCooldown: 8,
  projectileSpeed: 132,
  projectileLife: 1.25,
  mineArmTime: 0.8,
  mineLife: 12,
  mineRadius: 8.5,
  empSpeed: 92,
  empLife: 1.45,
  empRadius: 6.2,
  aimAssistAngle: 0.27,
  aimAssistRange: 56,
  hitKnockback: 4.8,
};

export const COLORS = {
  robber: 0x201815,
  robberAccent: 0xff5f28,
  police: 0xe7edf2,
  policeDark: 0x101927,
  policeBlue: 0x256dff,
  policeRed: 0xff283e,
  swat: 0x202831,
  road: 0x30343a,
  roadWet: 0x34383f,
  pavement: 0xb3aea4,
  grass: 0x3f8a45,
};

export const DEFAULT_SETTINGS = {
  masterVolume: 0.82,
  soundVolume: 0.8,
  ambienceVolume: 0.45,
  engineVolume: 0.78,
  sirenVolume: 0.72,
  weaponsVolume: 0.82,
  uiVolume: 0.72,
  cameraShake: true,
  cameraShakeIntensity: 'normal',
  motionEffects: 'normal',
  uiScale: 'normal',
  highContrastHud: false,
  radioSubtitles: true,
  minimap: true,
  touchControls: 'auto',
  touchLayout: 'standard',
  touchOpacity: 0.82,
  defaultDifficulty: 'standard',
  radarSize: 'normal',
  performanceDebug: false,
  effectsQuality: 'medium',
  trafficDensity: 'low',
};

export const EFFECT_QUALITY = {
  low: { particles: 0.55, skids: 75, traffic: 5 },
  medium: { particles: 0.85, skids: 120, traffic: 8 },
  high: { particles: 1.15, skids: 175, traffic: 12 },
};

export const TRAFFIC = {
  low: { moving: 6, parked: 10 },
  medium: { moving: 10, parked: 16 },
};

export const AI_PROFILES = {
  chaser: { leadDistance: 0, sideOffset: 0, aggression: 1, ramRange: 14, turnCaution: 1 },
  rammer: { leadDistance: -4, sideOffset: 7, aggression: 1.18, ramRange: 18, turnCaution: 0.9 },
  blocker: { leadDistance: 34, sideOffset: 5, aggression: 0.82, ramRange: 10, turnCaution: 1.15 },
  escape: { leadDistance: 0, sideOffset: 0, aggression: 0.95, ramRange: 10, turnCaution: 1.1 },
  aggressiveChaser: { leadDistance: -2, sideOffset: 2, aggression: 1.28, ramRange: 17, turnCaution: 0.86 },
  tacticalBlocker: { leadDistance: 40, sideOffset: 8, aggression: 0.9, ramRange: 12, turnCaution: 1.22 },
  supportUnit: { leadDistance: 12, sideOffset: 12, aggression: 0.78, ramRange: 9, turnCaution: 1.32 },
  heavyRammer: { leadDistance: -6, sideOffset: 5, aggression: 1.08, ramRange: 20, turnCaution: 0.78 },
  speedRunner: { leadDistance: 12, sideOffset: 0, aggression: 1.18, ramRange: 8, turnCaution: 0.92 },
  trickster: { leadDistance: 2, sideOffset: 10, aggression: 0.98, ramRange: 9, turnCaution: 1.04 },
  tank: { leadDistance: -2, sideOffset: 2, aggression: 0.88, ramRange: 18, turnCaution: 1.18 },
  escapeArtist: { leadDistance: 18, sideOffset: 8, aggression: 1.04, ramRange: 7, turnCaution: 1.24 },
};

export const CHASE_EVENTS = {
  robber: [
    { at: 2, key: 'patrol', message: 'Patrol units engaged', intensity: 0.2 },
    { at: 60, key: 'road-pressure', message: 'Roadblock pressure increasing', intensity: 0.48 },
    { at: 120, key: 'swat', message: 'SWAT unit deployed', intensity: 0.72 },
    { at: 150, key: 'lockdown', message: 'Final minute: city lockdown', intensity: 1 },
  ],
  police: [
    { at: 2, key: 'target-spotted', message: 'Target spotted', intensity: 0.22 },
    { at: 45, key: 'support', message: 'Support units joining pursuit', intensity: 0.48 },
    { at: 95, key: 'escape-route', message: 'Robber attempting escape route', intensity: 0.68 },
    { at: 150, key: 'final-disable', message: 'Final minute: disable the target', intensity: 1 },
  ],
};

export const VEHICLE_CATALOG = {
  robber: [
    {
      id: 'armored-muscle',
      name: 'Armored Muscle',
      type: 'robber',
      baseType: 'robber',
      description: 'Balanced outlaw car with armor, mines, and reliable speed.',
      unlockedByDefault: true,
      stats: {
        speed: 72,
        armor: 84,
        handling: 58,
        ram: 78,
        weapon: 76,
        cooldown: 62,
      },
      statOverrides: {},
      loadout: {
        primary: 'heavyMachineGun',
        secondary: 'rearMine',
        boost: 'nitroSurge',
      },
    },
    {
      id: 'heavy-raider',
      name: 'Heavy Raider SUV',
      type: 'robber',
      baseType: 'robber',
      description: 'Slow armored raider with brutal ram force and shockwave control.',
      unlockKey: 'heavyRaider',
      requirement: 'Complete 1 robber mission',
      stats: {
        speed: 56,
        armor: 96,
        handling: 42,
        ram: 96,
        weapon: 70,
        cooldown: 46,
      },
      statOverrides: {
        label: 'Heavy Raider SUV',
        maxHealth: 380,
        maxSpeed: 38,
        acceleration: 28,
        handling: 1.55,
        grip: 9,
        mass: 2.35,
        ramPower: 1.8,
        secondaryDamage: 38,
      },
      loadout: {
        primary: 'heavyMachineGun',
        secondary: 'shockwaveBlast',
        boost: 'nitroSurge',
      },
    },
    {
      id: 'speed-demon-coupe',
      name: 'Speed Demon Coupe',
      type: 'robber',
      baseType: 'robber',
      description: 'Low armor sprint car tuned for checkpoint routes and nitro escapes.',
      unlockKey: 'speedDemon',
      requirement: 'Complete Escape Route',
      stats: {
        speed: 96,
        armor: 48,
        handling: 82,
        ram: 38,
        weapon: 62,
        cooldown: 82,
      },
      statOverrides: {
        label: 'Speed Demon Coupe',
        maxHealth: 205,
        maxSpeed: 60,
        acceleration: 48,
        braking: 58,
        handling: 2.95,
        grip: 12.8,
        driftGrip: 4.3,
        armor: 0.94,
        mass: 1.18,
        ramPower: 0.72,
        primaryDamage: 15,
      },
      loadout: {
        primary: 'heavyMachineGun',
        secondary: 'rearMine',
        boost: 'nitroSurge',
      },
    },
  ],
  police: [
    {
      id: 'interceptor',
      name: 'Interceptor',
      type: 'police',
      baseType: 'police',
      description: 'Fast pursuit car with EMP precision and sharp handling.',
      unlockedByDefault: true,
      stats: {
        speed: 92,
        armor: 55,
        handling: 88,
        ram: 52,
        weapon: 62,
        cooldown: 76,
      },
      statOverrides: {},
      loadout: {
        primary: 'taserBullets',
        secondary: 'empShot',
        utility: 'pursuitScan',
        boost: 'nitroSurge',
      },
    },
    {
      id: 'swat-charger',
      name: 'SWAT Charger',
      type: 'police',
      baseType: 'swat',
      description: 'Tactical pursuit bruiser with spike strips and strong ramming.',
      unlockKey: 'swatCharger',
      requirement: 'Complete 1 police mission',
      stats: {
        speed: 64,
        armor: 78,
        handling: 56,
        ram: 86,
        weapon: 68,
        cooldown: 54,
      },
      statOverrides: {
        label: 'SWAT Charger',
        maxHealth: 190,
        maxSpeed: 42,
        acceleration: 30,
        handling: 1.95,
        mass: 1.95,
        ramPower: 1.45,
        primaryDamage: 12,
      },
      loadout: {
        primary: 'machineGun',
        secondary: 'spikeStrip',
        utility: 'pursuitScan',
        boost: 'nitroSurge',
      },
    },
    {
      id: 'rapid-interceptor',
      name: 'Rapid Interceptor',
      type: 'police',
      baseType: 'police',
      description: 'Ultra-fast pursuit car for tracking, scanning, and clean EMP windows.',
      unlockKey: 'rapidInterceptor',
      requirement: 'Complete Police Hunt',
      stats: {
        speed: 98,
        armor: 38,
        handling: 94,
        ram: 36,
        weapon: 54,
        cooldown: 88,
      },
      statOverrides: {
        label: 'Rapid Interceptor',
        maxHealth: 92,
        maxSpeed: 63,
        acceleration: 49,
        braking: 62,
        handling: 3.18,
        grip: 13.5,
        driftGrip: 4.8,
        armor: 1.08,
        mass: 0.86,
        ramPower: 0.68,
        primaryDamage: 9,
      },
      loadout: {
        primary: 'taserBullets',
        secondary: 'empShot',
        utility: 'pursuitScan',
        boost: 'nitroSurge',
      },
    },
  ],
};

export const MISSIONS = {
  robber: [
    {
      id: 'survival-heat',
      name: 'Survival Heat',
      mode: 'survival',
      role: 'robber',
      duration: 180,
      objective: 'Survive the full pursuit window.',
      bonus: 'Destroy 5 police units.',
    },
    {
      id: 'escape-route',
      name: 'Escape Route',
      mode: 'checkpoints',
      role: 'robber',
      duration: 210,
      objective: 'Reach 3 escape checkpoints across the city.',
      bonus: 'Finish with 30 seconds remaining.',
      checkpoints: [
        { x: -148, z: 60, radius: 9 },
        { x: 82, z: 60, radius: 9 },
        { x: 148, z: -66, radius: 9 },
      ],
    },
    {
      id: 'cargo-run',
      name: 'Cargo Run',
      mode: 'cargo',
      role: 'robber',
      duration: 210,
      objective: 'Deliver stolen cargo before stability hits zero.',
      bonus: 'Keep cargo above 55% stability.',
      cargoStability: 100,
      dropPoint: { x: 126, z: 94, radius: 11 },
    },
  ],
  police: [
    {
      id: 'police-hunt',
      name: 'Police Hunt',
      mode: 'hunt',
      role: 'police',
      duration: 180,
      objective: 'Disable the robber before the timer expires.',
      bonus: 'Disable the target before 2 minutes.',
    },
    {
      id: 'roadblock-intercept',
      name: 'Roadblock Intercept',
      mode: 'intercept',
      role: 'police',
      duration: 210,
      objective: 'Force the robber into roadblock zones.',
      bonus: 'Land 3 EMP or spike hits.',
      interceptGoal: 100,
    },
    {
      id: 'convoy-stop',
      name: 'Convoy Stop',
      mode: 'convoy',
      role: 'police',
      duration: 210,
      objective: 'Stop the robber convoy and disable the leader.',
      bonus: 'Destroy both support vehicles.',
      supportCount: 2,
    },
  ],
};

export const ABILITY_CONFIG = {
  heavyMachineGun: {
    label: 'Heavy MG',
    kind: 'primary',
    cooldown: WEAPONS.primaryCooldown,
    damageScale: 1.18,
  },
  machineGun: {
    label: 'Machine Gun',
    kind: 'primary',
    cooldown: WEAPONS.policePrimaryCooldown,
    damageScale: 1,
  },
  taserBullets: {
    label: 'Taser Burst',
    kind: 'primary',
    cooldown: WEAPONS.policePrimaryCooldown,
    damageScale: 0.92,
  },
  burstCannon: {
    label: 'Burst Cannon',
    kind: 'primary',
    cooldown: 0.22,
    damageScale: 1.42,
  },
  pursuitRifle: {
    label: 'Pursuit Rifle',
    kind: 'primary',
    cooldown: 0.18,
    damageScale: 1.12,
  },
  rearMine: {
    label: 'Rear Mine',
    kind: 'secondary',
    cooldown: 8,
  },
  shockwaveBlast: {
    label: 'Shockwave',
    kind: 'secondary',
    cooldown: 11,
    radius: 14,
    damage: 32,
    impulse: 28,
  },
  empShot: {
    label: 'EMP Shot',
    kind: 'secondary',
    cooldown: 8,
  },
  spikeStrip: {
    label: 'Spike Strip',
    kind: 'secondary',
    cooldown: 9,
    radius: 6,
    damage: 18,
    slowDuration: 2.8,
  },
  pursuitScan: {
    label: 'Pursuit Scan',
    kind: 'secondary',
    cooldown: 10,
    duration: 5,
  },
  smokeBurst: {
    label: 'Smoke Burst',
    kind: 'secondary',
    cooldown: 9.5,
    radius: 15,
    slowDuration: 1.6,
  },
  trackerPulse: {
    label: 'Tracker Pulse',
    kind: 'secondary',
    cooldown: 8.5,
    radius: 32,
    slowDuration: 1.4,
  },
  nitroSurge: {
    label: 'Nitro Surge',
    kind: 'boost',
    cooldown: 0,
    ramBoost: 0.35,
  },
};

export const WANTED_LEVELS = [
  { level: 1, threshold: 0, label: 'Basic Patrol', message: 'Wanted Level 1: Patrol engaged' },
  { level: 2, threshold: 35, label: 'Blockers', message: 'Wanted Level 2: Blockers moving in' },
  { level: 3, threshold: 72, label: 'SWAT', message: 'Wanted Level 3: SWAT deployed' },
  { level: 4, threshold: 118, label: 'Elite Unit', message: 'Wanted Level 4: Elite interceptor joining' },
  { level: 5, threshold: 165, label: 'Captain', message: 'Wanted Level 5: Tactical captain joining pursuit' },
];

export const SPECIAL_UNITS = {
  blockerVan: {
    type: 'swat',
    label: 'Blocker Van',
    profile: 'blocker',
    statOverrides: { maxHealth: 130, maxSpeed: 32, ramPower: 1.1 },
  },
  swatRammer: {
    type: 'swat',
    label: 'SWAT Rammer',
    profile: 'rammer',
    statOverrides: { maxHealth: 180, ramPower: 1.8 },
  },
  eliteInterceptor: {
    type: 'police',
    label: 'Elite Interceptor',
    profile: 'rammer',
    statOverrides: { maxHealth: 150, maxSpeed: 58, primaryDamage: 14 },
  },
  captain: {
    type: 'swat',
    label: 'Police Captain',
    profile: 'rammer',
    statOverrides: { maxHealth: 260, maxSpeed: 44, ramPower: 1.9, primaryDamage: 16 },
  },
  escortCar: {
    type: 'robber',
    label: 'Escort Car',
    profile: 'rammer',
    statOverrides: { maxHealth: 120, maxSpeed: 44, primaryDamage: 10, secondaryDamage: 0 },
  },
  jammerVan: {
    type: 'robber',
    label: 'Jammer Van',
    profile: 'blocker',
    statOverrides: { maxHealth: 145, maxSpeed: 34, primaryDamage: 7, secondaryDamage: 0 },
  },
  heavyRaiderSupport: {
    type: 'robber',
    label: 'Heavy Raider',
    profile: 'rammer',
    statOverrides: { maxHealth: 210, maxSpeed: 34, ramPower: 1.55 },
  },
};

export const PROGRESSION_RULES = {
  storageKey: 'heatline-city-phase3-progress',
  defaultUnlocked: [
    'armored-muscle',
    'heavy-raider',
    'speed-demon-coupe',
    'interceptor',
    'swat-charger',
    'rapid-interceptor',
  ],
  unlocks: {
    heavyRaider: 'heavy-raider',
    swatCharger: 'swat-charger',
    speedDemon: 'speed-demon-coupe',
    rapidInterceptor: 'rapid-interceptor',
    captainBadge: 'captain-badge',
    escapeAccent: 'escape-accent',
  },
};

export const SCORE_RULES = {
  timeSurvived: 8,
  timeRemaining: 10,
  checkpoint: 450,
  cargoDelivered: 900,
  cargoStability: 8,
  vehicleDestroyed: 260,
  takedown: 420,
  wantedLevel: 350,
  abilityLanded: 120,
  bonus: 650,
  ranks: [
    { rank: 'S', min: 5200 },
    { rank: 'A', min: 3600 },
    { rank: 'B', min: 2200 },
    { rank: 'C', min: 0 },
  ],
};

export const DESTRUCTIBLE_PROPS = {
  debrisCaps: { low: 40, medium: 70, high: 110 },
  impactSpeed: 12,
  debrisLife: 4.5,
};

export const DIFFICULTIES = {
  rookie: {
    id: 'rookie',
    name: 'Rookie',
    description: 'Forgiving chase pressure with lighter police damage.',
    scoreMultiplier: 0.85,
    aiSpeed: 0.9,
    aiAggression: 0.82,
    spawnRate: 0.72,
    roadblockRate: 0.68,
    weaponDamageTaken: 0.78,
    weaponDamageGiven: 1.05,
    wantedGrowth: 0.72,
    timerScale: 1.12,
    pickupScale: 1.25,
    trafficBonus: 0,
  },
  standard: {
    id: 'standard',
    name: 'Standard',
    description: 'Balanced GameHub chase tuning.',
    scoreMultiplier: 1,
    aiSpeed: 1,
    aiAggression: 1,
    spawnRate: 1,
    roadblockRate: 1,
    weaponDamageTaken: 1,
    weaponDamageGiven: 1,
    wantedGrowth: 1,
    timerScale: 1,
    pickupScale: 1,
    trafficBonus: 0,
  },
  veteran: {
    id: 'veteran',
    name: 'Veteran',
    description: 'Faster police pressure, harder hits, better scoring.',
    scoreMultiplier: 1.22,
    aiSpeed: 1.08,
    aiAggression: 1.14,
    spawnRate: 1.18,
    roadblockRate: 1.28,
    weaponDamageTaken: 1.16,
    weaponDamageGiven: 0.96,
    wantedGrowth: 1.18,
    timerScale: 0.94,
    pickupScale: 0.82,
    trafficBonus: 1,
  },
  chaos: {
    id: 'chaos',
    name: 'Chaos',
    description: 'Maximum pressure with elite units and richer traffic.',
    scoreMultiplier: 1.48,
    aiSpeed: 1.16,
    aiAggression: 1.28,
    spawnRate: 1.38,
    roadblockRate: 1.55,
    weaponDamageTaken: 1.28,
    weaponDamageGiven: 0.92,
    wantedGrowth: 1.42,
    timerScale: 0.88,
    pickupScale: 0.68,
    trafficBonus: 2,
  },
};

export const MISSION_MODIFIERS = {
  heavyTraffic: {
    id: 'heavyTraffic',
    name: 'Heavy Traffic',
    description: 'More civilian vehicles and traffic panic.',
    scoreMultiplier: 1.1,
    trafficBonus: 4,
  },
  roadblockCity: {
    id: 'roadblockCity',
    name: 'Roadblock City',
    description: 'Roadblock events arrive more often.',
    scoreMultiplier: 1.14,
    roadblockRate: 1.42,
  },
  weakArmor: {
    id: 'weakArmor',
    name: 'Weak Armor',
    description: 'Player takes more damage.',
    scoreMultiplier: 1.16,
    damageTaken: 1.2,
  },
  nitroRush: {
    id: 'nitroRush',
    name: 'Nitro Rush',
    description: 'Nitro recharges faster for speed-focused runs.',
    scoreMultiplier: 1.06,
    nitroRecharge: 1.45,
  },
  empStorm: {
    id: 'empStorm',
    name: 'EMP Storm',
    description: 'Elite EMP pressure appears sooner.',
    scoreMultiplier: 1.12,
    empPressure: true,
  },
  cleanRun: {
    id: 'cleanRun',
    name: 'Clean Run',
    description: 'Avoid traffic and prop collisions for a medal boost.',
    scoreMultiplier: 1.1,
    cleanRun: true,
  },
  timeCrunch: {
    id: 'timeCrunch',
    name: 'Time Crunch',
    description: 'Shorter mission timer with a higher score payout.',
    scoreMultiplier: 1.18,
    timerScale: 0.82,
  },
  captainHunt: {
    id: 'captainHunt',
    name: 'Captain Hunt',
    description: 'The captain joins before five-star pressure.',
    scoreMultiplier: 1.2,
    captainEarly: true,
  },
};

export const CHALLENGES = [
  {
    id: 'five-star-survival',
    name: 'Five-Star Survival',
    role: 'robber',
    baseMissionId: 'survival-heat',
    description: 'Start at high wanted level and survive the lockdown.',
    duration: 210,
    startWanted: 4,
    forcedModifiers: ['roadblockCity', 'heavyTraffic'],
  },
  {
    id: 'captain-showdown',
    name: 'Captain Showdown',
    role: 'robber',
    baseMissionId: 'survival-heat',
    description: 'A direct daytime duel against the police captain.',
    duration: 180,
    startCaptain: true,
    forcedModifiers: ['captainHunt'],
  },
  {
    id: 'checkpoint-blitz',
    name: 'Checkpoint Blitz',
    role: 'robber',
    baseMissionId: 'escape-route',
    description: 'Fast checkpoint route with tighter timer pressure.',
    duration: 145,
    forcedModifiers: ['nitroRush', 'timeCrunch'],
  },
  {
    id: 'no-repair-run',
    name: 'No Repair Run',
    role: 'police',
    baseMissionId: 'police-hunt',
    description: 'Disable the target without repair pickups or respawn comfort.',
    duration: 190,
    noRepairs: true,
    forcedModifiers: ['weakArmor'],
  },
  {
    id: 'clean-driver',
    name: 'Clean Driver',
    role: 'robber',
    baseMissionId: 'cargo-run',
    description: 'Deliver cargo with minimal civilian and prop collisions.',
    duration: 205,
    forcedModifiers: ['cleanRun'],
  },
  {
    id: 'takedown-trial',
    name: 'Takedown Trial',
    role: 'robber',
    baseMissionId: 'survival-heat',
    description: 'Destroy 6 police units before time runs out.',
    duration: 160,
    takedownGoal: 6,
    forcedModifiers: ['empStorm'],
  },
];

export const MEDAL_RULES = [
  { medal: 'Platinum', minScore: 7600, minHealthRatio: 0.34 },
  { medal: 'Gold', minScore: 5400, minHealthRatio: 0.22 },
  { medal: 'Silver', minScore: 3300, minHealthRatio: 0.08 },
  { medal: 'Bronze', minScore: 1, minHealthRatio: 0 },
];

export const CAPTAIN_BOSS = {
  label: 'Captain Vale',
  title: 'Tactical Pursuit Captain',
  maxSupport: 2,
  supportCooldown: 18,
  empCooldown: 7.5,
  warningDistance: 48,
  phases: {
    pursuit: { maxHealthRatio: 1, profile: 'rammer', message: 'Captain Unit Deployed' },
    intercept: { maxHealthRatio: 0.62, profile: 'blocker', message: 'Captain shifting to intercept.' },
    aggressive: { maxHealthRatio: 0.28, profile: 'rammer', message: 'Captain damaged. Aggressive pursuit mode.' },
  },
};

export const PICKUP_CONFIG = {
  maxActive: 5,
  respawnDelay: 15,
  spawnPoints: [
    { x: -116, z: -106 }, { x: 0, z: -106 }, { x: 116, z: -106 },
    { x: -148, z: 60 }, { x: 82, z: 60 }, { x: 150, z: 60 },
    { x: -82, z: 34 }, { x: 116, z: 0 }, { x: 0, z: 82 },
  ],
  types: {
    repair: { label: 'Repair Kit', color: 0x42d97c, amount: 58, weight: 3 },
    nitro: { label: 'Nitro Refill', color: 0x4dbbff, amount: 48, weight: 3 },
    ability: { label: 'Ability Charge', color: 0xffc247, amount: 3, weight: 2 },
    armor: { label: 'Armor Boost', color: 0xd8f3ff, amount: 0.75, duration: 8, weight: 1 },
    score: { label: 'Score Token', color: 0xff8e45, amount: 300, weight: 1 },
  },
};

export const RADAR_CONFIG = {
  range: 150,
  maxIcons: 28,
};

export const RADIO_LINES = {
  robber: {
    start: ['Fixer: Heat is rising. Keep moving.'],
    roadblock: ['Scanner: Roadblock ahead. Find another route.'],
    captain: ['Fixer: Captain unit deployed. Survive this.'],
    lowHealth: ['Fixer: Engine is coughing. Do not let them box you in.'],
    success: ['Fixer: You broke the city net. Clean exit.'],
    fail: ['Dispatch: Suspect vehicle disabled.'],
  },
  police: {
    start: ['Dispatch: Target spotted. Stay on pursuit.'],
    roadblock: ['Command: Roadblock unit moving into position.'],
    captain: ['Command: Captain unit entering pursuit control.'],
    lowHealth: ['Dispatch: Interceptor integrity low. Rotate through repair route.'],
    success: ['Command: Target disabled. Heatline is secure.'],
    fail: ['Dispatch: Target escaped containment.'],
  },
};

export const AUDIO_ASSETS = {
  engine: '/assets/audio/engine-loop.mp3',
  siren: '/assets/audio/siren-loop.mp3',
  fire: '/assets/audio/weapon-fire.mp3',
  emp: '/assets/audio/emp.mp3',
  mine: '/assets/audio/mine-beep.mp3',
  explosion: '/assets/audio/explosion.mp3',
  collision: '/assets/audio/collision.mp3',
  ui: '/assets/audio/ui-click.mp3',
  radio: '/assets/audio/radio-beep.mp3',
  captain: '/assets/audio/captain-arrival.mp3',
  success: '/assets/audio/mission-success.mp3',
  failure: '/assets/audio/mission-failure.mp3',
};

export const MODEL_ASSETS = {
  vehicles: {
    'armored-muscle': '/assets/models/armored-muscle.glb',
    'heavy-raider': '/assets/models/heavy-raider.glb',
    'speed-demon-coupe': '/assets/models/speed-demon-coupe.glb',
    interceptor: '/assets/models/interceptor.glb',
    'swat-charger': '/assets/models/swat-charger.glb',
    'rapid-interceptor': '/assets/models/rapid-interceptor.glb',
  },
  props: {
    roadblock: '/assets/models/roadblock.glb',
    pickup: '/assets/models/pickup.glb',
  },
};

export const PERFORMANCE_LIMITS = {
  combatVehicles: 8,
  traffic: { low: 8, medium: 14, high: 18 },
  projectiles: 80,
  pickups: 5,
  radarIcons: 28,
  highlightCards: 5,
  debris: { low: 40, medium: 70, high: 110 },
};

export const SAVE_SCHEMA = {
  version: 5,
  key: 'heatline-city-phase5-save',
  legacyProgressKey: PROGRESSION_RULES.storageKey,
  legacySettingsKey: 'heatline-city-phase2-settings',
};

export const GAMEHUB_METADATA = {
  title: 'Heatline City',
  version: 'Phase 5 / v0.5',
  mode: 'Local single-player',
  theme: 'Premium daytime city chase',
  genres: ['Vehicle Combat', 'Police Chase', 'Arcade Driving'],
  description: 'Local police-vs-robber vehicle combat chase missions across Heatline City.',
  controls: 'Arrow keys drive, WASD fires weapons in 360-degree directions, Shift nitro, Space drift, J/click front fire, K ability, R reset, Esc pause.',
  sessionLength: '3-12 minutes',
  recommendedDevice: 'Desktop or tablet with WebGL support',
};

export const DISTRICTS = {
  downtown: {
    id: 'downtown',
    name: 'Downtown Core',
    description: 'Tall glass offices, wide intersections, and the central tower.',
    bounds: { minX: -62, maxX: 70, minZ: 4, maxZ: 128 },
    trafficBonus: 1,
    landmark: { x: 38, z: 116, label: 'Central Tower' },
    roadblocks: [{ x: 0, z: 60 }, { x: 82, z: 34 }],
    pickups: [{ x: -36, z: 60 }, { x: 62, z: 94 }],
    events: ['officeRush', 'intersectionLockdown', 'glassTowerChase'],
  },
  park: {
    id: 'park',
    name: 'Central Park Loop',
    description: 'Curved roads around the fountain, grass shortcuts, and light props.',
    bounds: { minX: -170, maxX: -70, minZ: 44, maxZ: 126 },
    trafficBonus: -1,
    landmark: { x: -112, z: 88, label: 'Park Fountain' },
    roadblocks: [{ x: -148, z: 60 }],
    pickups: [{ x: -122, z: 94 }, { x: -92, z: 60 }],
    events: ['parkCutThrough', 'fountainLoop', 'grassShortcut'],
  },
  highway: {
    id: 'highway',
    name: 'Highway Ring',
    description: 'Long straights, bridge pressure, and high-speed traffic merges.',
    bounds: { minX: -188, maxX: 188, minZ: -132, maxZ: -82 },
    trafficBonus: 1,
    landmark: { x: 0, z: -106, label: 'Highway Bridge' },
    roadblocks: [{ x: -64, z: -106 }, { x: 72, z: -106 }],
    pickups: [{ x: 0, z: -106 }, { x: 130, z: -106 }],
    events: ['highwaySprint', 'bridgeRoadblock', 'trafficMerge'],
  },
  industrial: {
    id: 'industrial',
    name: 'Industrial Yard',
    description: 'Warehouses, containers, barriers, and cargo routes.',
    bounds: { minX: 72, maxX: 178, minZ: 48, maxZ: 126 },
    trafficBonus: 0,
    landmark: { x: 128, z: 88, label: 'Ironworks' },
    roadblocks: [{ x: 148, z: 60 }, { x: 116, z: 94 }],
    pickups: [{ x: 126, z: 94 }, { x: 148, z: 34 }],
    events: ['containerMaze', 'cargoTruckBlockade', 'warehouseAmbush'],
  },
  market: {
    id: 'market',
    name: 'Market Street',
    description: 'Shopfronts, parked cars, tighter lanes, and clean-run pressure.',
    bounds: { minX: -172, maxX: -16, minZ: -84, maxZ: 42 },
    trafficBonus: 2,
    landmark: { x: -116, z: -8, label: 'Market Block' },
    roadblocks: [{ x: -116, z: -66 }, { x: -82, z: 0 }],
    pickups: [{ x: -148, z: 0 }, { x: -82, z: 34 }],
    events: ['narrowLane', 'parkedCarJam', 'cleanDriverZone'],
  },
  policeHq: {
    id: 'policeHq',
    name: 'Police HQ Zone',
    description: 'Barricades, checkpoint drills, and interceptor deployment lanes.',
    bounds: { minX: 84, maxX: 178, minZ: -86, maxZ: 18 },
    trafficBonus: -1,
    landmark: { x: 126, z: -64, label: 'Police Checkpoint' },
    roadblocks: [{ x: 126, z: -56 }, { x: 148, z: 0 }],
    pickups: [{ x: 116, z: -8 }, { x: 148, z: -66 }],
    events: ['barricadeDrill', 'interceptorDeployment', 'captainLaunch'],
  },
};

export const DISTRICT_EVENTS = {
  officeRush: { name: 'Office Rush Traffic', message: 'Downtown traffic is surging through the office grid.', intensity: 0.35 },
  intersectionLockdown: { name: 'Intersection Lockdown', message: 'Intersection lockdown forming ahead.', intensity: 0.55, roadblock: true },
  glassTowerChase: { name: 'Glass Tower Chase', message: 'Central tower lanes are open for a fast chase line.', intensity: 0.42 },
  parkCutThrough: { name: 'Park Cut-through', message: 'Park cut-through available. Expect lower grip on grass.', intensity: 0.36 },
  fountainLoop: { name: 'Fountain Loop', message: 'Fountain loop is clear for a tight turn escape.', intensity: 0.32 },
  grassShortcut: { name: 'Grass Shortcut Warning', message: 'Grass shortcut ahead. Speed will drop off-road.', intensity: 0.34 },
  highwaySprint: { name: 'Highway Sprint', message: 'Highway sprint window open. Use nitro on the straight.', intensity: 0.52 },
  bridgeRoadblock: { name: 'Bridge Roadblock', message: 'Bridge roadblock units are staging with a gap lane.', intensity: 0.62, roadblock: true },
  trafficMerge: { name: 'Traffic Merge Chaos', message: 'Civilian traffic merging onto the highway.', intensity: 0.48 },
  containerMaze: { name: 'Container Maze', message: 'Industrial yard lanes are tightening around cargo routes.', intensity: 0.5 },
  cargoTruckBlockade: { name: 'Cargo Truck Blockade', message: 'Cargo trucks are narrowing the industrial chase route.', intensity: 0.58, roadblock: true },
  warehouseAmbush: { name: 'Warehouse Ambush', message: 'Units are cutting through warehouse corners.', intensity: 0.55 },
  narrowLane: { name: 'Narrow Lane Chase', message: 'Market lanes are narrowing. Keep the car clean.', intensity: 0.44 },
  parkedCarJam: { name: 'Parked Car Jam', message: 'Parked cars are crowding Market Street.', intensity: 0.5 },
  cleanDriverZone: { name: 'Clean Driver Bonus Zone', message: 'Clean driver zone active. Avoid civilian impacts.', intensity: 0.36 },
  barricadeDrill: { name: 'Full Barricade Drill', message: 'Police HQ barricade drill is active.', intensity: 0.62, roadblock: true },
  interceptorDeployment: { name: 'Interceptor Deployment', message: 'Fresh interceptors are leaving the HQ zone.', intensity: 0.54 },
  captainLaunch: { name: 'Captain Unit Launch', message: 'Captain launch lane is hot near HQ.', intensity: 0.72, captain: true },
};

export const CAREER_MISSIONS = {
  robber: [
    { id: 'career-first-heat', name: 'First Heat', baseMissionId: 'survival-heat', role: 'robber', districtId: 'downtown', intro: 'First heat. Keep moving and prove the outlaw build can take pressure.', objective: 'Survive the patrol chase.', bonus: 'Destroy 3 police units.', recommendedDifficulty: 'rookie', reward: 'Market Escape unlocked', aiPersonalities: ['aggressiveChaser', 'supportUnit'] },
    { id: 'career-market-escape', name: 'Market Escape', baseMissionId: 'escape-route', role: 'robber', districtId: 'market', requires: ['career-first-heat'], intro: 'Cut through Market Street checkpoints without wrecking the route.', objective: 'Reach checkpoints through Market Street.', bonus: 'Keep traffic and prop collisions under 3.', recommendedDifficulty: 'standard', reward: 'Cargo Through Industrial unlocked', modifiers: ['cleanRun'], aiPersonalities: ['tacticalBlocker', 'aggressiveChaser'] },
    { id: 'career-cargo-industrial', name: 'Cargo Through Industrial', baseMissionId: 'cargo-run', role: 'robber', districtId: 'industrial', requires: ['career-market-escape'], intro: 'Carry hot cargo through the industrial yard and keep stability intact.', objective: 'Deliver cargo through the Industrial Yard.', bonus: 'Cargo above 60%.', recommendedDifficulty: 'standard', reward: 'Highway Breakout unlocked', aiPersonalities: ['heavyRammer', 'supportUnit'] },
    { id: 'career-highway-breakout', name: 'Highway Breakout', baseMissionId: 'escape-route', role: 'robber', districtId: 'highway', requires: ['career-cargo-industrial'], intro: 'Hit the highway ring, chain nitro, and break the lockdown.', objective: 'Clear a high-speed escape route.', bonus: 'Finish with 40 seconds remaining.', recommendedDifficulty: 'veteran', reward: 'Captain Heat unlocked', modifiers: ['roadblockCity'], aiPersonalities: ['aggressiveChaser', 'tacticalBlocker', 'heavyRammer'] },
    { id: 'career-captain-heat', name: 'Captain Heat', baseMissionId: 'survival-heat', role: 'robber', districtId: 'policeHq', requires: ['career-highway-breakout'], intro: 'The captain is waiting. Survive the tactical response or take him down.', objective: 'Survive until the captain joins, then escape.', bonus: 'Defeat the captain unit.', recommendedDifficulty: 'veteran', reward: 'Captain badge focus', modifiers: ['captainHunt'], startCaptain: true, aiPersonalities: ['heavyRammer', 'tacticalBlocker', 'supportUnit'] },
  ],
  police: [
    { id: 'career-target-spotted', name: 'Target Spotted', baseMissionId: 'police-hunt', role: 'police', districtId: 'downtown', intro: 'First pursuit call. Stay on the target and land clean EMP windows.', objective: 'Disable the robber.', bonus: 'Disable before 2 minutes.', recommendedDifficulty: 'rookie', reward: 'Roadblock Setup unlocked', aiPersonalities: ['escapeArtist'] },
    { id: 'career-roadblock-setup', name: 'Roadblock Setup', baseMissionId: 'roadblock-intercept', role: 'police', districtId: 'policeHq', requires: ['career-target-spotted'], intro: 'Guide the target into support roadblocks near HQ.', objective: 'Build intercept progress with roadblocks.', bonus: 'Land 3 abilities.', recommendedDifficulty: 'standard', reward: 'Convoy Intercept unlocked', aiPersonalities: ['trickster'] },
    { id: 'career-convoy-intercept', name: 'Convoy Intercept', baseMissionId: 'convoy-stop', role: 'police', districtId: 'industrial', requires: ['career-roadblock-setup'], intro: 'A robber convoy is cutting through industrial roads.', objective: 'Stop convoy supports and disable the leader.', bonus: 'Destroy both supports.', recommendedDifficulty: 'standard', reward: 'Market Containment unlocked', aiPersonalities: ['tank', 'trickster'] },
    { id: 'career-market-containment', name: 'Market Containment', baseMissionId: 'police-hunt', role: 'police', districtId: 'market', requires: ['career-convoy-intercept'], intro: 'Contain the robber in Market Street without causing civilian chaos.', objective: 'Disable target with low city damage.', bonus: 'Keep civilian collisions under 3.', recommendedDifficulty: 'veteran', reward: 'Captain Assist unlocked', modifiers: ['cleanRun'], aiPersonalities: ['speedRunner', 'escapeArtist'] },
    { id: 'career-captain-assist', name: 'Captain Assist', baseMissionId: 'police-hunt', role: 'police', districtId: 'policeHq', requires: ['career-market-containment'], intro: 'Support the captain unit against a heavily armored outlaw.', objective: 'Disable a heavy robber with captain support.', bonus: 'Keep player vehicle alive.', recommendedDifficulty: 'veteran', reward: 'Justice Cup focus', aiPersonalities: ['tank'], startCaptain: true, robberStatOverrides: { maxHealth: 380, armor: 0.74, ramPower: 1.45 } },
  ],
};

export const CUP_MODES = [
  { id: 'robber-cup', name: 'Robber Cup', role: 'robber', description: 'Survival, market escape, industrial cargo, and captain finale.', rounds: ['career-first-heat', 'career-market-escape', 'career-cargo-industrial', 'career-captain-heat'], expectedTime: '12 minutes' },
  { id: 'police-cup', name: 'Police Cup', role: 'police', description: 'Hunt, roadblock setup, convoy intercept, and captain assist.', rounds: ['career-target-spotted', 'career-roadblock-setup', 'career-convoy-intercept', 'career-captain-assist'], expectedTime: '12 minutes' },
  { id: 'mixed-heat-cup', name: 'Mixed Heat Cup', role: 'mixed', description: 'Alternate between outlaw escape and tactical pursuit missions.', rounds: ['career-first-heat', 'career-target-spotted', 'career-highway-breakout', 'career-market-containment', 'career-captain-heat'], expectedTime: '15 minutes' },
];

export const LOADOUT_OPTIONS = {
  robber: {
    primary: [
      { id: 'heavyMachineGun', label: 'Heavy MG', pros: 'Reliable damage', cons: 'Moderate heat' },
      { id: 'burstCannon', label: 'Burst Cannon', pros: 'Big hit bursts', cons: 'Slower fire rhythm' },
    ],
    secondary: [
      { id: 'rearMine', label: 'Rear Mine', pros: 'Strong chase denial', cons: 'Needs timing' },
      { id: 'shockwaveBlast', label: 'Shockwave', pros: 'Pushes police away', cons: 'Long cooldown' },
      { id: 'smokeBurst', label: 'Smoke Burst', pros: 'Short control escape', cons: 'Low damage' },
    ],
  },
  police: {
    primary: [
      { id: 'taserBullets', label: 'Taser MG', pros: 'Fast pursuit fire', cons: 'Lower burst' },
      { id: 'pursuitRifle', label: 'Pursuit Rifle', pros: 'Harder hits', cons: 'Less forgiving' },
    ],
    secondary: [
      { id: 'empShot', label: 'EMP Shot', pros: 'Reliable target slow', cons: 'Needs aim' },
      { id: 'spikeStrip', label: 'Spike Strip', pros: 'Area denial', cons: 'Works best ahead of target' },
      { id: 'trackerPulse', label: 'Tracker Pulse', pros: 'Scan and light slow', cons: 'Low damage' },
    ],
  },
  universal: {
    passive: [
      { id: 'none', label: 'No Passive', statModifiers: {}, description: 'Balanced factory tune.' },
      { id: 'heavyArmor', label: 'Heavy Armor', statModifiers: { maxHealth: 35, armorMultiplier: 0.94, maxSpeedMultiplier: 0.97 }, description: 'More HP with slight speed loss.' },
      { id: 'nitroRecovery', label: 'Nitro Recovery', statModifiers: { nitroRechargeMultiplier: 1.28, accelerationMultiplier: 1.03 }, description: 'Faster boost recovery.' },
      { id: 'ramBoost', label: 'Ram Boost', statModifiers: { ramPowerMultiplier: 1.18, massMultiplier: 1.08 }, description: 'Harder impacts.' },
      { id: 'betterHandling', label: 'Better Handling', statModifiers: { handlingMultiplier: 1.12, gripMultiplier: 1.12 }, description: 'Cleaner turns.' },
      { id: 'fasterCooldown', label: 'Faster Cooldown', statModifiers: { cooldownScale: 0.82 }, description: 'Abilities recover sooner.' },
      { id: 'reinforcedBumper', label: 'Reinforced Bumper', statModifiers: { ramPowerMultiplier: 1.14, maxHealth: 18 }, description: 'Front-end pursuit strength.' },
    ],
    tire: [
      { id: 'balanced', label: 'Balanced Tires', statModifiers: {}, description: 'Default grip.' },
      { id: 'grip', label: 'Grip Tires', statModifiers: { gripMultiplier: 1.16, driftGripMultiplier: 0.92 }, description: 'Stable corner exits.' },
      { id: 'drift', label: 'Drift Tires', statModifiers: { driftGripMultiplier: 1.22, handlingMultiplier: 1.04, gripMultiplier: 0.95 }, description: 'Easier handbrake slides.' },
    ],
    accent: [
      { id: 'stock', label: 'Factory Accent' },
      { id: 'sunburst', label: 'Sunburst Trim' },
      { id: 'pursuitBlue', label: 'Pursuit Blue' },
    ],
  },
};

export const ACHIEVEMENTS = [
  { id: 'firstEscape', name: 'First Escape', description: 'Complete one robber mission.', stat: 'robberCompletions', target: 1 },
  { id: 'firstArrest', name: 'First Arrest', description: 'Complete one police mission.', stat: 'policeCompletions', target: 1 },
  { id: 'fiveStarSurvivor', name: 'Five-Star Survivor', description: 'Reach wanted level 5.', stat: 'highestWanted', target: 5 },
  { id: 'captainDown', name: 'Captain Down', description: 'Defeat the police captain.', stat: 'captainDefeats', target: 1 },
  { id: 'cleanDriver', name: 'Clean Driver', description: 'Complete a clean run.', stat: 'cleanRuns', target: 1 },
  { id: 'mineMaster', name: 'Mine Master', description: 'Trigger 10 mine or ability hits.', stat: 'minesTriggered', target: 10 },
  { id: 'empSpecialist', name: 'EMP Specialist', description: 'Land 10 ability hits.', stat: 'empHits', target: 10 },
  { id: 'driftEscape', name: 'Drift Escape', description: 'Use nitro 20 times across missions.', stat: 'nitroUses', target: 20 },
  { id: 'highwayHero', name: 'Highway Hero', description: 'Complete a Highway Ring mission.', stat: 'highwayWins', target: 1 },
  { id: 'goldMedalist', name: 'Gold Medalist', description: 'Earn 3 Gold or Platinum medals.', stat: 'goldMedals', target: 3 },
  { id: 'sRankPursuer', name: 'S Rank Pursuer', description: 'Earn an S rank score.', stat: 'sRanks', target: 1 },
];

export const ONBOARDING_STEPS = [
  { title: 'Choose Your Side', body: 'Pick Robber for escape pressure or Police for tactical pursuit missions.' },
  { title: 'Pick A Mission', body: 'Career, Missions, Challenges, and Cups all use the same daytime city systems.' },
  { title: 'Tune The Garage', body: 'Vehicle, weapons, passive perk, and tire style change real gameplay stats.' },
  { title: 'Drive And Fire', body: 'Arrow keys drive. WASD fires the weapon system around the car, with diagonal fire from combined keys.' },
  { title: 'Follow Markers', body: 'Use the HUD marker and radar to track checkpoints, targets, roadblocks, and pickups.' },
  { title: 'Chase Better Scores', body: 'Ranks, medals, achievements, and local best scores are saved on this device only.' },
];

export const TOUCH_LAYOUTS = {
  compact: { label: 'Compact', buttonSize: 46, opacity: 0.72 },
  standard: { label: 'Standard', buttonSize: 56, opacity: 0.82 },
  large: { label: 'Large', buttonSize: 68, opacity: 0.9 },
};

export const PERFORMANCE_DEBUG = {
  sampleWindow: 0.35,
  visibleByDefault: false,
};
