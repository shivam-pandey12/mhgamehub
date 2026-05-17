export const CAR_CONFIGS = [
  {
    id: 'hatchback',
    name: 'Starter Hatchback',
    shortName: 'Hatchback',
    description: 'A balanced city car with forgiving handling and easy drift recovery.',
    unlocked: true,
    unlockText: 'Unlocked',
    colors: {
      body: '#f4d35e',
      secondary: '#fff7cf',
      glass: '#83c5e8',
      accent: '#d49a22',
      lights: '#fff6cc',
      brake: '#ff3434'
    },
    visual: {
      type: 'hatchback',
      length: 4.1,
      width: 1.85,
      height: 1.55,
      wheelRadius: 0.43,
      wheelWidth: 0.32,
      rideHeight: 0.52,
      spoiler: 'lip',
      panelStyle: 'friendly-city',
      archSize: 1.02,
      rimStyle: 'compact',
      bodyLayers: 3,
      specialty: ['short-hood', 'tall-cabin', 'smile-bumper']
    },
    stats: {
      speed: 62,
      acceleration: 55,
      handling: 74,
      braking: 68,
      drift: 58,
      offRoad: 52,
      stability: 78
    },
    physics: {
      maxSpeed: 31,
      acceleration: 18,
      braking: 23,
      reverseSpeed: 11,
      steerRate: 2.35,
      grip: 8.8,
      driftGrip: 3.6,
      offRoadGrip: 0.78,
      mass: 1.0,
      boost: 12
    }
  },
  {
    id: 'sports-coupe',
    name: 'Sports Coupe',
    shortName: 'Coupe',
    description: 'Low, quick, and playful. Built for sweeping city drifts.',
    unlocked: true,
    unlockText: 'Unlocked',
    colors: {
      body: '#e74c3c',
      secondary: '#2f3640',
      glass: '#9ee8ff',
      accent: '#f6c04f',
      lights: '#fff8db',
      brake: '#ff2d2d'
    },
    visual: {
      type: 'coupe',
      length: 4.55,
      width: 1.98,
      height: 1.24,
      wheelRadius: 0.46,
      wheelWidth: 0.36,
      rideHeight: 0.46,
      spoiler: 'sport',
      panelStyle: 'swept-sport',
      archSize: 1.08,
      rimStyle: 'sport',
      bodyLayers: 3,
      specialty: ['side-skirts', 'low-roofline', 'wide-tires']
    },
    stats: {
      speed: 82,
      acceleration: 78,
      handling: 68,
      braking: 65,
      drift: 82,
      offRoad: 40,
      stability: 58
    },
    physics: {
      maxSpeed: 40,
      acceleration: 24,
      braking: 22,
      reverseSpeed: 10,
      steerRate: 2.15,
      grip: 7.2,
      driftGrip: 2.25,
      offRoadGrip: 0.58,
      mass: 0.92,
      boost: 16
    }
  },
  {
    id: 'suv',
    name: 'SUV',
    shortName: 'SUV',
    description: 'Stable, heavy, and confidence inspiring for relaxed city driving.',
    unlocked: true,
    unlockText: 'Unlocked',
    colors: {
      body: '#f6f1e7',
      secondary: '#8d99ae',
      glass: '#88c8e8',
      accent: '#c7a15a',
      lights: '#fff9d8',
      brake: '#fa2e2e'
    },
    visual: {
      type: 'suv',
      length: 4.9,
      width: 2.16,
      height: 1.92,
      wheelRadius: 0.55,
      wheelWidth: 0.38,
      rideHeight: 0.72,
      roofRails: true,
      panelStyle: 'premium-utility',
      archSize: 1.12,
      rimStyle: 'touring',
      bodyLayers: 4,
      specialty: ['roof-rails', 'trunk-mass', 'high-clearance']
    },
    stats: {
      speed: 60,
      acceleration: 46,
      handling: 56,
      braking: 82,
      drift: 38,
      offRoad: 66,
      stability: 90
    },
    physics: {
      maxSpeed: 30,
      acceleration: 15,
      braking: 28,
      reverseSpeed: 10,
      steerRate: 1.85,
      grip: 9.8,
      driftGrip: 5.8,
      offRoadGrip: 0.86,
      mass: 1.35,
      boost: 9
    }
  },
  {
    id: 'supercar',
    name: 'Supercar',
    shortName: 'Supercar',
    description: 'The fastest Phase 4 car. Sharp, premium, and demanding at speed.',
    unlocked: true,
    unlockText: 'Phase 4 local unlock',
    colors: {
      body: '#1abc9c',
      secondary: '#101820',
      glass: '#b9f6ff',
      accent: '#f4d35e',
      lights: '#fff8d8',
      brake: '#ff1f3d'
    },
    visual: {
      type: 'supercar',
      length: 4.75,
      width: 2.18,
      height: 1.08,
      wheelRadius: 0.48,
      wheelWidth: 0.42,
      rideHeight: 0.38,
      spoiler: 'wing',
      diffuser: true,
      panelStyle: 'sharp-wedge',
      archSize: 1.12,
      rimStyle: 'wide-performance',
      bodyLayers: 4,
      specialty: ['side-intakes', 'diffuser', 'front-splitter']
    },
    stats: {
      speed: 98,
      acceleration: 94,
      handling: 72,
      braking: 72,
      drift: 72,
      offRoad: 22,
      stability: 48
    },
    physics: {
      maxSpeed: 48,
      acceleration: 31,
      braking: 24,
      reverseSpeed: 9,
      steerRate: 2.0,
      grip: 6.9,
      driftGrip: 2.6,
      offRoadGrip: 0.42,
      mass: 0.86,
      boost: 22
    }
  },
  {
    id: 'offroad-jeep',
    name: 'Off-Road Jeep',
    shortName: 'Jeep',
    description: 'Raised suspension, rugged tires, and the best grip on grass paths.',
    unlocked: true,
    unlockText: 'Phase 4 local unlock',
    colors: {
      body: '#607d3b',
      secondary: '#2f3324',
      glass: '#a9d6e5',
      accent: '#e4c56a',
      lights: '#fff2b6',
      brake: '#ff3333'
    },
    visual: {
      type: 'jeep',
      length: 4.35,
      width: 2.04,
      height: 1.88,
      wheelRadius: 0.58,
      wheelWidth: 0.44,
      rideHeight: 0.78,
      rollCage: true,
      spareTire: true,
      panelStyle: 'rugged-open',
      archSize: 1.22,
      rimStyle: 'offroad',
      bodyLayers: 4,
      specialty: ['roll-cage', 'spare-tire', 'roof-lights', 'fender-flares']
    },
    stats: {
      speed: 58,
      acceleration: 52,
      handling: 62,
      braking: 68,
      drift: 46,
      offRoad: 95,
      stability: 84
    },
    physics: {
      maxSpeed: 29,
      acceleration: 17,
      braking: 22,
      reverseSpeed: 12,
      steerRate: 2.08,
      grip: 8.2,
      driftGrip: 4.7,
      offRoadGrip: 1.04,
      mass: 1.18,
      boost: 10
    }
  },
  {
    id: 'classic',
    name: 'Classic Car',
    shortName: 'Classic',
    description: 'A long vintage cruiser with chrome details and smooth momentum.',
    unlocked: true,
    unlockText: 'Unlocked',
    colors: {
      body: '#5f4bb6',
      secondary: '#f7efe5',
      glass: '#aed9e0',
      accent: '#d4af37',
      lights: '#fff6c9',
      brake: '#f03535'
    },
    visual: {
      type: 'classic',
      length: 5.25,
      width: 1.98,
      height: 1.42,
      wheelRadius: 0.48,
      wheelWidth: 0.32,
      rideHeight: 0.5,
      chrome: true,
      panelStyle: 'vintage-long',
      archSize: 1.06,
      rimStyle: 'classic',
      bodyLayers: 3,
      specialty: ['chrome', 'rounded-hood', 'tail-fins']
    },
    stats: {
      speed: 64,
      acceleration: 50,
      handling: 42,
      braking: 60,
      drift: 50,
      offRoad: 38,
      stability: 72
    },
    physics: {
      maxSpeed: 32,
      acceleration: 16,
      braking: 20,
      reverseSpeed: 9,
      steerRate: 1.55,
      grip: 8.0,
      driftGrip: 3.9,
      offRoadGrip: 0.62,
      mass: 1.14,
      boost: 8
    }
  }
];

export const getCarConfig = (id) => CAR_CONFIGS.find((car) => car.id === id) ?? CAR_CONFIGS[0];
