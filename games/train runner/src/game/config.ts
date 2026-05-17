import * as THREE from 'three';

export const GAME_CONFIG = {
  world: {
    skyColor: new THREE.Color(0x10263d),
    fogColor: new THREE.Color(0x17314a),
    fogNear: 70,
    fogFar: 310,
    trainSpeedKmh: 278
  },
  train: {
    coachCount: 24,
    firstCoachStartZ: -12,
    recycleBehindDistance: 48,
    gapMin: 2.15,
    gapMax: 3.45,
    defaultWidth: 4.55,
    walkableInset: 0.64
  },
  player: {
    startX: 0,
    startZ: -7,
    baseForwardSpeed: 14.8,
    maxForwardSpeed: 19.5,
    acceleration: 7.4,
    lateralSpeed: 5.6,
    lateralDamping: 13,
    airControl: 0.55,
    jumpVelocity: 12.4,
    gravity: 31,
    coyoteTime: 0.13,
    jumpBuffer: 0.14,
    slideDuration: 0.62,
    dodgeDuration: 0.28,
    dodgeImpulse: 8.8,
    landingLock: 0.16,
    failY: -8.5,
    height: 1.86,
    radius: 0.32
  },
  camera: {
    fov: 57,
    minFov: 56,
    maxFov: 68,
    followSharpness: 6.6,
    lookSharpness: 8.2,
    baseOffset: new THREE.Vector3(0, 4.95, -9.4),
    jumpOffset: new THREE.Vector3(0, 0.65, -1.1),
    lookAhead: 7.8
  }
} as const;

export const COACH_BLUEPRINTS = [
  { type: 'passenger', length: 20.5, height: 2.72, color: 0x1d4d78, trim: 0x38e8ff },
  { type: 'cargo', length: 18.8, height: 2.92, color: 0x394150, trim: 0xffb454 },
  { type: 'armored', length: 19.6, height: 3.03, color: 0x222936, trim: 0x9fb6c9 },
  { type: 'low', length: 17.4, height: 2.46, color: 0x68423d, trim: 0xff5f6d },
  { type: 'tall', length: 21.2, height: 3.24, color: 0x28334d, trim: 0x8df7c6 }
] as const;

export const INPUT_KEYS = {
  forward: ['KeyW', 'ArrowUp'],
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
  jump: ['Space'],
  slide: ['KeyS', 'ArrowDown'],
  dodge: ['ShiftLeft', 'ShiftRight'],
  attack: ['KeyJ'],
  special: ['KeyE'],
  pause: ['Escape'],
  restart: ['KeyR', 'Enter']
} as const;

export const PHASE2_CONFIG = {
  lanes: [-1, 0, 1],
  spawn: {
    lookAhead: 118,
    firstSpawnDistance: 42,
    sectionSpacing: 18,
    cleanupBehind: 28
  },
  stats: {
    maxHealth: 3,
    invulnerability: 1.05,
    comboGrace: 3.2,
    comboDecayPerSecond: 1.1,
    energyMax: 100
  },
  combat: {
    basicRangeZ: 4.8,
    basicRangeX: 1.55,
    dashRangeZ: 5.8,
    jumpRangeZ: 5.2,
    attackCooldown: 0.28,
    hitStop: 0.055,
    perfectDodgeWindow: 0.34
  },
  pickups: {
    magnetRadius: 1.35,
    coinValue: 10,
    energyValue: 18
  }
} as const;

export const PHASE3_CONFIG = {
  segments: {
    tunnelStart: 270,
    tunnelEnd: 350,
    sideTrainStart: 470,
    sideTrainEnd: 555,
    eliteStart: 405,
    bossStart: 650,
    victoryDistance: 760
  },
  special: {
    waveSpeed: 32,
    waveLife: 1.15,
    rangeX: 1.8,
    damage: 4,
    bossDamage: 3
  },
  elite: {
    health: 10,
    spawnDistance: 54,
    slamRadius: 3.4,
    chargeRange: 4.4,
    punchRange: 2.2
  },
  boss: {
    name: 'SKY RAIDER',
    health: 12,
    introDuration: 3.2,
    missileWarningDuration: 1.8,
    missileImpactDuration: 0.55,
    droneDropDuration: 3.4,
    vulnerableDuration: 5.2,
    retreatDuration: 1.4
  },
  missions: {
    distanceTarget: 700,
    enemyTarget: 8,
    specialTarget: 2
  }
} as const;
