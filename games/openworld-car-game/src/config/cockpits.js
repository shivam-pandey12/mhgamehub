export const COCKPIT_SETTINGS = {
  motionLevels: {
    off: 0,
    low: 0.45,
    normal: 1
  },
  fovOffsets: {
    low: -4,
    normal: 0,
    wide: 5
  }
};

export const COCKPIT_CONFIGS = {
  hatchback: {
    name: 'Compact city cockpit',
    visibility: 'Wide city windshield',
    dashboardStyle: 'Rounded digital dashboard',
    drivingFeel: 'Easy, practical, open view',
    camera: {
      localPosition: [-0.22, 1.38, 0.7],
      lookAhead: 13,
      lookHeight: 1.35,
      fov: 68,
      clearance: 0.12
    },
    motion: { lean: 0.018, pitch: 0.016, push: 0.035, vibration: 0.006 },
    dashboard: {
      width: 2.08,
      height: 0.34,
      y: -0.48,
      z: -1.08,
      shape: 'rounded',
      display: 'digital',
      accent: '#d4a84f'
    },
    wheel: {
      x: -0.34,
      y: -0.29,
      z: -0.72,
      radius: 0.25,
      tube: 0.018,
      maxTurn: 1.08,
      spokes: 3
    },
    windshield: {
      width: 2.34,
      height: 1.22,
      y: 0.08,
      z: -1.25,
      pillarWidth: 0.045,
      tint: 0.08
    },
    materials: {
      dash: '#444b55',
      lower: '#222832',
      trim: '#d8c3a1',
      display: '#9ee8ff',
      frame: '#2b313a',
      seat: '#303844'
    }
  },
  'sports-coupe': {
    name: 'Sport coupe cockpit',
    visibility: 'Lower, tighter windshield',
    dashboardStyle: 'Analog tach with red accents',
    drivingFeel: 'Focused and performance-heavy',
    camera: {
      localPosition: [-0.26, 1.17, 0.55],
      lookAhead: 15,
      lookHeight: 1.15,
      fov: 70,
      clearance: 0.1
    },
    motion: { lean: 0.024, pitch: 0.021, push: 0.045, vibration: 0.008 },
    dashboard: {
      width: 2.16,
      height: 0.3,
      y: -0.48,
      z: -1.02,
      shape: 'sport',
      display: 'sport-analog',
      accent: '#e74c3c'
    },
    wheel: {
      x: -0.32,
      y: -0.28,
      z: -0.7,
      radius: 0.27,
      tube: 0.024,
      maxTurn: 1.18,
      spokes: 3
    },
    windshield: {
      width: 2.16,
      height: 0.98,
      y: 0.03,
      z: -1.18,
      pillarWidth: 0.052,
      tint: 0.07
    },
    materials: {
      dash: '#242833',
      lower: '#151a22',
      trim: '#e74c3c',
      display: '#ffd1c9',
      frame: '#151820',
      seat: '#252a32'
    }
  },
  suv: {
    name: 'High comfort cockpit',
    visibility: 'Tall broad windshield',
    dashboardStyle: 'Large practical dash with center screen',
    drivingFeel: 'Stable high seating position',
    camera: {
      localPosition: [-0.24, 1.64, 0.68],
      lookAhead: 12.5,
      lookHeight: 1.62,
      fov: 66,
      clearance: 0.14
    },
    motion: { lean: 0.012, pitch: 0.013, push: 0.026, vibration: 0.004 },
    dashboard: {
      width: 2.34,
      height: 0.42,
      y: -0.5,
      z: -1.1,
      shape: 'broad',
      display: 'center-screen',
      accent: '#c7a15a'
    },
    wheel: {
      x: -0.36,
      y: -0.27,
      z: -0.73,
      radius: 0.3,
      tube: 0.024,
      maxTurn: 0.95,
      spokes: 4
    },
    windshield: {
      width: 2.46,
      height: 1.38,
      y: 0.14,
      z: -1.28,
      pillarWidth: 0.06,
      tint: 0.075
    },
    materials: {
      dash: '#53585f',
      lower: '#252a31',
      trim: '#c7a15a',
      display: '#a4d7ff',
      frame: '#313842',
      seat: '#343c47'
    }
  },
  supercar: {
    name: 'Low supercar cockpit',
    visibility: 'Wide low glass canopy',
    dashboardStyle: 'Sharp digital speed strip',
    drivingFeel: 'Aggressive high-speed view',
    camera: {
      localPosition: [-0.18, 1.02, 0.52],
      lookAhead: 17,
      lookHeight: 1.0,
      fov: 74,
      clearance: 0.08
    },
    motion: { lean: 0.03, pitch: 0.018, push: 0.055, vibration: 0.01 },
    dashboard: {
      width: 2.28,
      height: 0.25,
      y: -0.51,
      z: -0.98,
      shape: 'wedge',
      display: 'digital-strip',
      accent: '#1abc9c'
    },
    wheel: {
      x: -0.22,
      y: -0.31,
      z: -0.66,
      radius: 0.23,
      tube: 0.02,
      maxTurn: 1.28,
      spokes: 2
    },
    windshield: {
      width: 2.5,
      height: 0.86,
      y: -0.02,
      z: -1.1,
      pillarWidth: 0.045,
      tint: 0.065
    },
    materials: {
      dash: '#111820',
      lower: '#070b10',
      trim: '#1abc9c',
      display: '#b9fff2',
      frame: '#0b1118',
      seat: '#171d25'
    }
  },
  'offroad-jeep': {
    name: 'Rugged trail cockpit',
    visibility: 'Upright windshield and hood view',
    dashboardStyle: 'Chunky utility gauges',
    drivingFeel: 'Tall, tough, all-road posture',
    camera: {
      localPosition: [-0.26, 1.62, 0.58],
      lookAhead: 12,
      lookHeight: 1.58,
      fov: 67,
      clearance: 0.18
    },
    motion: { lean: 0.017, pitch: 0.018, push: 0.03, vibration: 0.012 },
    dashboard: {
      width: 2.18,
      height: 0.38,
      y: -0.48,
      z: -1.03,
      shape: 'rugged',
      display: 'rugged-analog',
      accent: '#e4c56a'
    },
    wheel: {
      x: -0.35,
      y: -0.25,
      z: -0.7,
      radius: 0.32,
      tube: 0.026,
      maxTurn: 1.02,
      spokes: 4
    },
    windshield: {
      width: 2.28,
      height: 1.34,
      y: 0.13,
      z: -1.16,
      pillarWidth: 0.075,
      tint: 0.06
    },
    materials: {
      dash: '#31362c',
      lower: '#171b15',
      trim: '#e4c56a',
      display: '#f7f2c1',
      frame: '#20261d',
      seat: '#30372a'
    }
  },
  classic: {
    name: 'Vintage cruiser cockpit',
    visibility: 'Wide old-school windshield',
    dashboardStyle: 'Round analog chrome gauges',
    drivingFeel: 'Warm classic touring feel',
    camera: {
      localPosition: [-0.24, 1.28, 0.72],
      lookAhead: 13,
      lookHeight: 1.28,
      fov: 66,
      clearance: 0.12
    },
    motion: { lean: 0.014, pitch: 0.012, push: 0.026, vibration: 0.005 },
    dashboard: {
      width: 2.28,
      height: 0.36,
      y: -0.49,
      z: -1.08,
      shape: 'vintage',
      display: 'classic-round',
      accent: '#d4af37'
    },
    wheel: {
      x: -0.34,
      y: -0.28,
      z: -0.72,
      radius: 0.31,
      tube: 0.014,
      maxTurn: 0.9,
      spokes: 3
    },
    windshield: {
      width: 2.36,
      height: 1.08,
      y: 0.06,
      z: -1.22,
      pillarWidth: 0.05,
      tint: 0.05
    },
    materials: {
      dash: '#6a4934',
      lower: '#302018',
      trim: '#d4af37',
      display: '#fff2ca',
      frame: '#5a3928',
      seat: '#8d6547'
    }
  }
};

export const getCockpitConfig = (carId) => COCKPIT_CONFIGS[carId] ?? COCKPIT_CONFIGS.hatchback;
