const TRACK_PATH_SCALE = 3;

function scaleTrackPoints(points, scale = TRACK_PATH_SCALE) {
  return points.map(([x, y, z]) => [x * scale, y * scale, z * scale]);
}

export const TRACK_DEFS = [
  {
    id: 'night-circuit',
    name: 'Night Circuit',
    description: 'A fast, open ribbon built for late boosts, big drafts, and brave straight-line pressure.',
    identity: 'Fast Open',
    identityId: 'fast-open',
    themeName: 'Neon Megacity Orbit',
    themeId: 'megacity-orbit',
    rarity: 'rare',
    difficulty: 'Rookie',
    unlockLevel: 1,
    laps: 3,
    halfWidth: 46,
    sectorSplits: [0.31, 0.62],
    points: scaleTrackPoints([
      [0, 0, 0],
      [72, 8, -38],
      [148, 0, 26],
      [112, -4, 122],
      [18, 6, 162],
      [-92, 1, 128],
      [-156, 9, 22],
      [-104, -3, -92],
      [-16, 4, -118]
    ]),
    boostPads: [
      { progress: 0.11, laneOffset: -2.8, width: 2.5, length: 12 },
      { progress: 0.28, laneOffset: 2.6, width: 2.4, length: 11 },
      { progress: 0.58, laneOffset: -0.2, width: 2.8, length: 14 },
      { progress: 0.83, laneOffset: 3.1, width: 2.3, length: 10 }
    ],
    slowZones: [
      { progress: 0.19, laneOffset: 2.8, width: 3.6, length: 18 },
      { progress: 0.51, laneOffset: -2.9, width: 3.4, length: 16 }
    ],
    hazardZones: [
      { progress: 0.36, laneOffset: -4.8, width: 2.2, length: 13 },
      { progress: 0.72, laneOffset: 4.4, width: 2.4, length: 15 },
      { progress: 0.92, laneOffset: 0.2, width: 2.1, length: 9 }
    ],
    pickupSpawns: [
      { progress: 0.07, laneOffset: 0 },
      { progress: 0.17, laneOffset: -3.2 },
      { progress: 0.31, laneOffset: 2.8 },
      { progress: 0.46, laneOffset: 0.8 },
      { progress: 0.63, laneOffset: -2.5 },
      { progress: 0.78, laneOffset: 2.2 },
      { progress: 0.88, laneOffset: -0.8 }
    ],
    shortcutZones: [
      {
        label: 'Solar Cut',
        startProgress: 0.105,
        endProgress: 0.162,
        laneOffset: -12.2,
        width: 5.4,
        bonusSpeed: 12,
        gripBonus: 0.18,
        risk: 0.78,
        recommendedSpeed: 92
      },
      {
        label: 'Comet Dive',
        startProgress: 0.562,
        endProgress: 0.632,
        laneOffset: 11.6,
        width: 5,
        bonusSpeed: 13,
        gripBonus: 0.14,
        risk: 0.82,
        recommendedSpeed: 90
      }
    ],
    palette: {
      shell: 0x1d7cff,
      guide: 0x69efff,
      edge: 0x8df8ff,
      start: 0x5dd6ff,
      boost: { color: 0xffb84d, emissive: 0xff7a11, opacity: 0.9 },
      slow: { color: 0x4ba4ff, emissive: 0x1846ff, opacity: 0.62 },
      hazard: { color: 0xff5c8e, emissive: 0xff2354, opacity: 0.68 }
    }
  },
  {
    id: 'rift-run',
    name: 'Rift Run',
    description: 'A technical drift circuit with sharp altitude changes, compressed entries, and inside cuts that reward control.',
    identity: 'Technical Drift',
    identityId: 'technical-drift',
    themeName: 'Asteroid Refinery',
    themeId: 'asteroid-refinery',
    rarity: 'epic',
    difficulty: 'Skilled',
    unlockLevel: 3,
    laps: 3,
    halfWidth: 38,
    sectorSplits: [0.28, 0.61],
    points: scaleTrackPoints([
      [0, 0, 0],
      [66, 14, -58],
      [158, 7, -8],
      [178, -8, 104],
      [88, 10, 176],
      [-24, 0, 198],
      [-142, -10, 132],
      [-190, 4, 12],
      [-128, 18, -112],
      [-18, 6, -152]
    ]),
    boostPads: [
      { progress: 0.06, laneOffset: -1.8, width: 2.8, length: 15 },
      { progress: 0.33, laneOffset: 3.8, width: 2.2, length: 11 },
      { progress: 0.66, laneOffset: -3.4, width: 2.6, length: 13 },
      { progress: 0.9, laneOffset: 0.2, width: 2.9, length: 16 }
    ],
    slowZones: [
      { progress: 0.24, laneOffset: -2.2, width: 3.8, length: 16 },
      { progress: 0.48, laneOffset: 2.8, width: 3.2, length: 20 },
      { progress: 0.76, laneOffset: 0.4, width: 4, length: 14 }
    ],
    hazardZones: [
      { progress: 0.14, laneOffset: 4.8, width: 2.1, length: 11 },
      { progress: 0.41, laneOffset: -4.6, width: 2.4, length: 17 },
      { progress: 0.57, laneOffset: 4.4, width: 2.5, length: 16 },
      { progress: 0.84, laneOffset: -0.4, width: 2.4, length: 11 }
    ],
    pickupSpawns: [
      { progress: 0.09, laneOffset: 0.4 },
      { progress: 0.22, laneOffset: -3.4 },
      { progress: 0.39, laneOffset: 3.1 },
      { progress: 0.52, laneOffset: -0.6 },
      { progress: 0.68, laneOffset: 3.3 },
      { progress: 0.81, laneOffset: -2.4 },
      { progress: 0.94, laneOffset: 1.4 }
    ],
    shortcutZones: [
      {
        label: 'Rift Apex',
        startProgress: 0.208,
        endProgress: 0.272,
        laneOffset: -8.8,
        width: 4.2,
        bonusSpeed: 14,
        gripBonus: 0.26,
        risk: 1.16,
        recommendedSpeed: 78
      },
      {
        label: 'Spine Chute',
        startProgress: 0.694,
        endProgress: 0.761,
        laneOffset: 8.4,
        width: 4,
        bonusSpeed: 15,
        gripBonus: 0.24,
        risk: 1.22,
        recommendedSpeed: 80
      }
    ],
    palette: {
      shell: 0xff7b27,
      guide: 0xffe07a,
      edge: 0xffc06d,
      start: 0xffbf7e,
      boost: { color: 0xffd166, emissive: 0xff8f1f, opacity: 0.92 },
      slow: { color: 0x4f9fff, emissive: 0x1e55ff, opacity: 0.58 },
      hazard: { color: 0xff4f7b, emissive: 0xff143d, opacity: 0.72 }
    }
  },
  {
    id: 'singularity-loop',
    name: 'Singularity Loop',
    description: 'A hazard-heavy chaos corridor packed with punishing arcs, volatile zones, and brutal shortcut gambles.',
    identity: 'Hazard Chaos',
    identityId: 'hazard-chaos',
    themeName: 'Shattered Ringworld',
    themeId: 'shattered-ringworld',
    rarity: 'legendary',
    difficulty: 'Elite',
    unlockLevel: 5,
    laps: 3,
    halfWidth: 40,
    sectorSplits: [0.24, 0.58],
    points: scaleTrackPoints([
      [0, 0, 0],
      [78, 20, -44],
      [172, 8, 6],
      [216, -14, 112],
      [116, 14, 206],
      [-12, 22, 230],
      [-144, -12, 162],
      [-226, 14, 34],
      [-188, -8, -110],
      [-62, 18, -188]
    ]),
    boostPads: [
      { progress: 0.08, laneOffset: 3.1, width: 2.6, length: 12 },
      { progress: 0.2, laneOffset: -3.2, width: 2.4, length: 10 },
      { progress: 0.46, laneOffset: 1.2, width: 2.9, length: 14 },
      { progress: 0.69, laneOffset: -2.4, width: 2.8, length: 12 },
      { progress: 0.88, laneOffset: 2.6, width: 2.2, length: 11 }
    ],
    slowZones: [
      { progress: 0.16, laneOffset: 0.8, width: 4, length: 20 },
      { progress: 0.38, laneOffset: -2.8, width: 3.8, length: 18 },
      { progress: 0.63, laneOffset: 3.2, width: 3.4, length: 16 },
      { progress: 0.79, laneOffset: -1.1, width: 3.7, length: 18 }
    ],
    hazardZones: [
      { progress: 0.11, laneOffset: -4.8, width: 2.2, length: 15 },
      { progress: 0.29, laneOffset: 4.7, width: 2.2, length: 17 },
      { progress: 0.54, laneOffset: -4.4, width: 2.6, length: 18 },
      { progress: 0.73, laneOffset: 4.3, width: 2.5, length: 17 },
      { progress: 0.93, laneOffset: -0.1, width: 2.3, length: 10 }
    ],
    pickupSpawns: [
      { progress: 0.05, laneOffset: -1.4 },
      { progress: 0.19, laneOffset: 2.8 },
      { progress: 0.32, laneOffset: -3.1 },
      { progress: 0.44, laneOffset: 1.6 },
      { progress: 0.58, laneOffset: -2.6 },
      { progress: 0.72, laneOffset: 3.2 },
      { progress: 0.86, laneOffset: -0.4 }
    ],
    shortcutZones: [
      {
        label: 'Singularity Slot',
        startProgress: 0.126,
        endProgress: 0.186,
        laneOffset: 11.8,
        width: 4.1,
        bonusSpeed: 16,
        gripBonus: 0.18,
        risk: 1.36,
        recommendedSpeed: 84
      },
      {
        label: 'Void Needle',
        startProgress: 0.786,
        endProgress: 0.852,
        laneOffset: -11.4,
        width: 4,
        bonusSpeed: 18,
        gripBonus: 0.16,
        risk: 1.44,
        recommendedSpeed: 86
      }
    ],
    palette: {
      shell: 0xb35bff,
      guide: 0xffa8ff,
      edge: 0xdb9dff,
      start: 0xe4b3ff,
      boost: { color: 0xffc56d, emissive: 0xff931f, opacity: 0.92 },
      slow: { color: 0x5db4ff, emissive: 0x205cff, opacity: 0.62 },
      hazard: { color: 0xff5795, emissive: 0xff1b6b, opacity: 0.76 }
    }
  },
  {
    id: 'solar-storm-corridor',
    name: 'Solar Storm Corridor',
    description: 'A high-voltage sprint cutting through solar arcs, plasma shear, and luminous storm gates built for fearless pilots.',
    identity: 'Storm Sprint',
    identityId: 'storm-sprint',
    themeName: 'Solar Storm Corridor',
    themeId: 'solar-storm-corridor',
    rarity: 'mythic',
    difficulty: 'Master',
    unlockLevel: 7,
    laps: 3,
    halfWidth: 44,
    sectorSplits: [0.26, 0.59],
    points: scaleTrackPoints([
      [0, 0, 0],
      [88, 16, -54],
      [204, 20, -12],
      [268, -12, 106],
      [190, 14, 228],
      [52, 26, 270],
      [-106, -6, 212],
      [-236, 18, 84],
      [-214, -10, -82],
      [-68, 22, -198]
    ]),
    boostPads: [
      { progress: 0.07, laneOffset: -2.6, width: 2.8, length: 15 },
      { progress: 0.23, laneOffset: 2.9, width: 2.5, length: 13 },
      { progress: 0.47, laneOffset: -0.6, width: 3, length: 16 },
      { progress: 0.71, laneOffset: 3.6, width: 2.6, length: 14 },
      { progress: 0.9, laneOffset: -2.4, width: 2.9, length: 15 }
    ],
    slowZones: [
      { progress: 0.18, laneOffset: 0.8, width: 4.2, length: 18 },
      { progress: 0.42, laneOffset: -3.1, width: 3.6, length: 16 },
      { progress: 0.79, laneOffset: 2.8, width: 3.8, length: 17 }
    ],
    hazardZones: [
      { progress: 0.12, laneOffset: 4.8, width: 2.2, length: 16 },
      { progress: 0.31, laneOffset: -4.7, width: 2.4, length: 18 },
      { progress: 0.57, laneOffset: 4.5, width: 2.6, length: 20 },
      { progress: 0.84, laneOffset: -4.3, width: 2.4, length: 16 }
    ],
    pickupSpawns: [
      { progress: 0.06, laneOffset: 1.2 },
      { progress: 0.22, laneOffset: -2.9 },
      { progress: 0.36, laneOffset: 3.2 },
      { progress: 0.49, laneOffset: -0.7 },
      { progress: 0.67, laneOffset: 3.4 },
      { progress: 0.82, laneOffset: -2.2 },
      { progress: 0.94, laneOffset: 0.6 }
    ],
    shortcutZones: [
      {
        label: 'Flare Channel',
        startProgress: 0.148,
        endProgress: 0.214,
        laneOffset: -10.8,
        width: 4.6,
        bonusSpeed: 17,
        gripBonus: 0.2,
        risk: 1.26,
        recommendedSpeed: 92
      },
      {
        label: 'Corona Dive',
        startProgress: 0.642,
        endProgress: 0.714,
        laneOffset: 10.2,
        width: 4.4,
        bonusSpeed: 19,
        gripBonus: 0.18,
        risk: 1.34,
        recommendedSpeed: 94
      }
    ],
    palette: {
      shell: 0xff7d36,
      guide: 0xffe38c,
      edge: 0xffcb68,
      start: 0xfff0c7,
      boost: { color: 0xffd572, emissive: 0xff8a1f, opacity: 0.94 },
      slow: { color: 0x67b4ff, emissive: 0x2f67ff, opacity: 0.58 },
      hazard: { color: 0xff7f64, emissive: 0xff3a24, opacity: 0.82 }
    }
  },
  {
    id: 'eclipse-promenade',
    name: 'Eclipse Promenade',
    description: 'A regal boulevard suspended between eclipse arches, palace spires, and long ceremonial sweepers that reward calm precision.',
    identity: 'Prestige Flow',
    identityId: 'prestige-flow',
    themeName: 'Eclipse Palace Ring',
    themeId: 'eclipse-palace-ring',
    rarity: 'legendary',
    difficulty: 'Master',
    unlockLevel: 8,
    laps: 3,
    halfWidth: 48,
    sectorSplits: [0.29, 0.61],
    points: scaleTrackPoints([
      [0, 0, 0],
      [94, 10, -42],
      [214, 18, -18],
      [304, 8, 72],
      [286, -6, 198],
      [176, 12, 286],
      [28, 18, 314],
      [-128, 8, 278],
      [-256, -4, 172],
      [-302, 12, 24],
      [-214, 18, -126],
      [-62, 8, -176]
    ]),
    boostPads: [
      { progress: 0.07, laneOffset: -2.4, width: 2.9, length: 16 },
      { progress: 0.23, laneOffset: 3.2, width: 2.6, length: 14 },
      { progress: 0.48, laneOffset: -0.4, width: 3.1, length: 18 },
      { progress: 0.71, laneOffset: 3.8, width: 2.5, length: 14 },
      { progress: 0.9, laneOffset: -2.8, width: 2.8, length: 15 }
    ],
    slowZones: [
      { progress: 0.18, laneOffset: 1.4, width: 4.4, length: 18 },
      { progress: 0.41, laneOffset: -3.2, width: 3.9, length: 16 },
      { progress: 0.8, laneOffset: 2.6, width: 3.7, length: 18 }
    ],
    hazardZones: [
      { progress: 0.12, laneOffset: 4.8, width: 2.2, length: 15 },
      { progress: 0.34, laneOffset: -4.6, width: 2.3, length: 18 },
      { progress: 0.59, laneOffset: 4.3, width: 2.4, length: 16 },
      { progress: 0.86, laneOffset: -4.1, width: 2.3, length: 14 }
    ],
    pickupSpawns: [
      { progress: 0.05, laneOffset: 0.8 },
      { progress: 0.16, laneOffset: -3 },
      { progress: 0.29, laneOffset: 3.4 },
      { progress: 0.43, laneOffset: -0.8 },
      { progress: 0.56, laneOffset: 2.2 },
      { progress: 0.67, laneOffset: -3.1 },
      { progress: 0.81, laneOffset: 3.2 },
      { progress: 0.94, laneOffset: -0.4 }
    ],
    shortcutZones: [
      {
        label: 'Velvet Apex',
        startProgress: 0.208,
        endProgress: 0.27,
        laneOffset: -10.4,
        width: 4.8,
        bonusSpeed: 15,
        gripBonus: 0.2,
        risk: 1.04,
        recommendedSpeed: 92
      },
      {
        label: 'Crown Line',
        startProgress: 0.644,
        endProgress: 0.714,
        laneOffset: 10.8,
        width: 4.6,
        bonusSpeed: 17,
        gripBonus: 0.18,
        risk: 1.12,
        recommendedSpeed: 94
      }
    ],
    palette: {
      shell: 0x151218,
      guide: 0xc9f6ff,
      edge: 0xffd88d,
      start: 0xfff8ea,
      boost: { color: 0xffda83, emissive: 0xffa22c, opacity: 0.94 },
      slow: { color: 0x7fdaff, emissive: 0x2e82ff, opacity: 0.56 },
      hazard: { color: 0xff8ea4, emissive: 0xff4d74, opacity: 0.74 }
    }
  },
  {
    id: 'aurora-sanctum',
    name: 'Aurora Sanctum',
    description: 'A vaulted garden circuit of pearl canopies, prism ribbons, and tight apex sequences built for late-career control.',
    identity: 'Crown Chicane',
    identityId: 'crown-chicane',
    themeName: 'Aurora Vault Garden',
    themeId: 'aurora-vault-garden',
    rarity: 'mythic',
    difficulty: 'Mythic',
    unlockLevel: 10,
    laps: 3,
    halfWidth: 37,
    sectorSplits: [0.23, 0.57],
    points: scaleTrackPoints([
      [0, 0, 0],
      [68, 18, -56],
      [154, 30, -34],
      [232, 12, 42],
      [248, -12, 146],
      [176, 20, 232],
      [54, 36, 274],
      [-74, 18, 248],
      [-166, -8, 176],
      [-228, 10, 72],
      [-214, 26, -46],
      [-132, 42, -144],
      [-16, 20, -186]
    ]),
    boostPads: [
      { progress: 0.08, laneOffset: 2.2, width: 2.5, length: 13 },
      { progress: 0.27, laneOffset: -3.1, width: 2.4, length: 11 },
      { progress: 0.52, laneOffset: 0.4, width: 2.8, length: 15 },
      { progress: 0.77, laneOffset: 3.2, width: 2.4, length: 12 },
      { progress: 0.92, laneOffset: -2.6, width: 2.6, length: 13 }
    ],
    slowZones: [
      { progress: 0.17, laneOffset: -1.1, width: 3.6, length: 15 },
      { progress: 0.36, laneOffset: 2.8, width: 3.5, length: 16 },
      { progress: 0.61, laneOffset: -2.6, width: 3.8, length: 18 },
      { progress: 0.84, laneOffset: 1.8, width: 3.4, length: 14 }
    ],
    hazardZones: [
      { progress: 0.11, laneOffset: 4.1, width: 2.1, length: 13 },
      { progress: 0.24, laneOffset: -4.2, width: 2.3, length: 16 },
      { progress: 0.47, laneOffset: 4.3, width: 2.2, length: 16 },
      { progress: 0.69, laneOffset: -4, width: 2.3, length: 17 },
      { progress: 0.9, laneOffset: 0.2, width: 2.1, length: 10 }
    ],
    pickupSpawns: [
      { progress: 0.06, laneOffset: -0.6 },
      { progress: 0.19, laneOffset: 2.8 },
      { progress: 0.31, laneOffset: -3.2 },
      { progress: 0.44, laneOffset: 1.4 },
      { progress: 0.58, laneOffset: -2.4 },
      { progress: 0.7, laneOffset: 3.1 },
      { progress: 0.83, laneOffset: -1.6 },
      { progress: 0.95, laneOffset: 0.4 }
    ],
    shortcutZones: [
      {
        label: 'Prism Fold',
        startProgress: 0.188,
        endProgress: 0.246,
        laneOffset: 8.6,
        width: 3.9,
        bonusSpeed: 16,
        gripBonus: 0.22,
        risk: 1.24,
        recommendedSpeed: 82
      },
      {
        label: 'Vault Thread',
        startProgress: 0.736,
        endProgress: 0.804,
        laneOffset: -8.9,
        width: 3.8,
        bonusSpeed: 18,
        gripBonus: 0.2,
        risk: 1.34,
        recommendedSpeed: 84
      }
    ],
    palette: {
      shell: 0xebe6f5,
      guide: 0x8ff8ea,
      edge: 0xffc6d4,
      start: 0xffffff,
      boost: { color: 0xffd6a4, emissive: 0xff9d59, opacity: 0.9 },
      slow: { color: 0x8ce8ff, emissive: 0x41a3ff, opacity: 0.54 },
      hazard: { color: 0xff9fb9, emissive: 0xff6388, opacity: 0.7 }
    }
  }
];

export const SHIP_DEFS = [
  {
    id: 'starling',
    name: 'Starling',
    tagline: 'Balanced starter frame for learning the flow of a race.',
    manufacturer: 'Aetherline Works',
    manufacturerId: 'aetherline',
    manufacturerStyle: 'aero',
    rarity: 'common',
    unlockLevel: 1,
    cost: 0,
    stats: {
      maxSpeed: 86,
      acceleration: 50,
      friction: 18,
      lateralAcceleration: 38,
      lateralDamping: 4.7,
      startBoostEnergy: 42
    },
    visuals: {
      bodyWidth: 1.92,
      bodyHeight: 0.74,
      bodyLength: 2.95,
      noseRadius: 1.18,
      noseLength: 5.1,
      wingSpan: 4.9,
      wingDepth: 1.42,
      finHeight: 0.96
    }
  },
  {
    id: 'vector',
    name: 'Vector',
    tagline: 'Corner-hunting frame with crisp handling and easy drift control.',
    manufacturer: 'Veil Dynamics',
    manufacturerId: 'veil',
    manufacturerStyle: 'interceptor',
    rarity: 'rare',
    unlockLevel: 2,
    cost: 0,
    stats: {
      maxSpeed: 84,
      acceleration: 49,
      friction: 18.3,
      lateralAcceleration: 44,
      lateralDamping: 5.1,
      startBoostEnergy: 46
    },
    visuals: {
      bodyWidth: 1.45,
      bodyHeight: 0.52,
      bodyLength: 2.55,
      noseRadius: 0.94,
      noseLength: 6.2,
      wingSpan: 5.2,
      wingDepth: 0.76,
      finHeight: 1.44
    }
  },
  {
    id: 'atlas',
    name: 'Atlas',
    tagline: 'Heavy booster rig with brutal straight-line pressure.',
    manufacturer: 'Forgeframe Heavy',
    manufacturerId: 'forgeframe',
    manufacturerStyle: 'industrial',
    rarity: 'rare',
    unlockLevel: 4,
    cost: 780,
    stats: {
      maxSpeed: 90,
      acceleration: 54,
      friction: 17.2,
      lateralAcceleration: 34,
      lateralDamping: 4.2,
      startBoostEnergy: 58
    },
    visuals: {
      bodyWidth: 2.46,
      bodyHeight: 1.02,
      bodyLength: 3.55,
      noseRadius: 1.52,
      noseLength: 4.9,
      wingSpan: 4.2,
      wingDepth: 1.78,
      finHeight: 1.82
    }
  },
  {
    id: 'ghostwire',
    name: 'Ghostwire',
    tagline: 'A surgical drift machine granted to pilots with perfect control.',
    manufacturer: 'Nyx Phantom Lab',
    manufacturerId: 'nyx',
    manufacturerStyle: 'phantom',
    rarity: 'epic',
    unlockAchievement: 'precision-pilot',
    cost: 0,
    stats: {
      maxSpeed: 87,
      acceleration: 48,
      friction: 18.4,
      lateralAcceleration: 46,
      lateralDamping: 5.3,
      startBoostEnergy: 50
    },
    visuals: {
      bodyWidth: 1.34,
      bodyHeight: 0.46,
      bodyLength: 3.18,
      noseRadius: 0.86,
      noseLength: 6.8,
      wingSpan: 5.8,
      wingDepth: 0.7,
      finHeight: 0.72
    }
  },
  {
    id: 'nova',
    name: 'Nova',
    tagline: 'Late-career rocket frame built for risky overdrive runs.',
    manufacturer: 'Helios Apex',
    manufacturerId: 'helios',
    manufacturerStyle: 'exotic',
    rarity: 'legendary',
    unlockLevel: 6,
    cost: 0,
    stats: {
      maxSpeed: 93,
      acceleration: 56,
      friction: 17.1,
      lateralAcceleration: 36,
      lateralDamping: 4.3,
      startBoostEnergy: 64
    },
    visuals: {
      bodyWidth: 1.68,
      bodyHeight: 0.62,
      bodyLength: 3.12,
      noseRadius: 1.08,
      noseLength: 6.9,
      wingSpan: 4.6,
      wingDepth: 1.18,
      finHeight: 2.34
    }
  },
  {
    id: 'solstice',
    name: 'Solstice',
    tagline: 'A prestige grand-tourer tuned for regal sweepers and composed late-boost control.',
    manufacturer: 'Crown Meridian Atelier',
    manufacturerId: 'crown-meridian',
    manufacturerStyle: 'aero',
    rarity: 'epic',
    unlockLevel: 8,
    cost: 0,
    stats: {
      maxSpeed: 91,
      acceleration: 53,
      friction: 17.7,
      lateralAcceleration: 42,
      lateralDamping: 4.8,
      startBoostEnergy: 60
    },
    visuals: {
      bodyWidth: 2.02,
      bodyHeight: 0.74,
      bodyLength: 3.46,
      noseRadius: 1.12,
      noseLength: 6.4,
      wingSpan: 5.6,
      wingDepth: 1.36,
      finHeight: 1.48
    }
  },
  {
    id: 'velour',
    name: 'Velour',
    tagline: 'A couture interceptor with knife-edge handling built for exacting apex rhythm.',
    manufacturer: 'Opaline Circuit',
    manufacturerId: 'opaline',
    manufacturerStyle: 'interceptor',
    rarity: 'legendary',
    unlockLevel: 9,
    cost: 0,
    stats: {
      maxSpeed: 89,
      acceleration: 51,
      friction: 18.1,
      lateralAcceleration: 49,
      lateralDamping: 5.6,
      startBoostEnergy: 58
    },
    visuals: {
      bodyWidth: 1.38,
      bodyHeight: 0.5,
      bodyLength: 2.98,
      noseRadius: 0.82,
      noseLength: 7.3,
      wingSpan: 6.2,
      wingDepth: 0.68,
      finHeight: 1.62
    }
  },
  {
    id: 'imperion',
    name: 'Imperion',
    tagline: 'A ceremonial flagship overdrive frame with the longest burn and the boldest presence in the fleet.',
    manufacturer: 'Helion Sovereign',
    manufacturerId: 'helion-sovereign',
    manufacturerStyle: 'exotic',
    rarity: 'mythic',
    unlockLevel: 10,
    cost: 0,
    stats: {
      maxSpeed: 96,
      acceleration: 59,
      friction: 16.8,
      lateralAcceleration: 39,
      lateralDamping: 4.4,
      startBoostEnergy: 72
    },
    visuals: {
      bodyWidth: 2.26,
      bodyHeight: 0.82,
      bodyLength: 3.58,
      noseRadius: 1.36,
      noseLength: 6.6,
      wingSpan: 5.4,
      wingDepth: 1.42,
      finHeight: 2.58
    }
  }
];

export const HULL_COLORS = [
  { id: 'azure', name: 'Azure', rarity: 'common', unlockLevel: 1, color: 0x8be6ff, emissive: 0x1a71ff },
  { id: 'sunfire', name: 'Sunfire', rarity: 'common', unlockLevel: 1, color: 0xffaf63, emissive: 0xff6324 },
  { id: 'mint', name: 'Mint Vector', rarity: 'rare', unlockLevel: 2, color: 0x8cffcf, emissive: 0x13c482 },
  { id: 'violet', name: 'Violet Pulse', rarity: 'epic', unlockLevel: 3, color: 0xe9a6ff, emissive: 0x9b40ff },
  { id: 'crimson', name: 'Crimson Flash', rarity: 'legendary', unlockLevel: 4, color: 0xff8ca3, emissive: 0xff334f }
];

export const GLOW_COLORS = [
  { id: 'cyan-core', name: 'Cyan Core', rarity: 'common', unlockLevel: 1, color: 0x78f3ff },
  { id: 'amber-core', name: 'Amber Core', rarity: 'common', unlockLevel: 1, color: 0xffd18a },
  { id: 'emerald-core', name: 'Emerald Core', rarity: 'rare', unlockLevel: 2, color: 0x84ffd6 },
  { id: 'violet-core', name: 'Violet Core', rarity: 'epic', unlockLevel: 3, color: 0xf0a7ff },
  { id: 'plasma-core', name: 'Plasma Core', rarity: 'legendary', unlockLevel: 5, color: 0xff84d9 }
];

export const TRAIL_COLORS = [
  { id: 'ion-trail', name: 'Ion Trail', rarity: 'common', unlockLevel: 1, color: 0x6bd7ff },
  { id: 'flare-trail', name: 'Flare Trail', rarity: 'rare', unlockLevel: 2, color: 0xffad5e },
  { id: 'echo-trail', name: 'Echo Trail', rarity: 'rare', unlockLevel: 3, color: 0x82ffd2 },
  { id: 'rift-trail', name: 'Rift Trail', rarity: 'epic', unlockLevel: 4, color: 0xd290ff },
  { id: 'nova-trail', name: 'Nova Trail', rarity: 'legendary', unlockLevel: 6, color: 0xff73ad }
];

export const ACHIEVEMENT_DEFS = [
  {
    id: 'precision-pilot',
    name: 'Precision Pilot',
    description: 'Finish on the podium without hitting a hazard.'
  },
  {
    id: 'quiet-victory',
    name: 'Quiet Victory',
    description: 'Win a race without using manual boost.'
  }
];

export const CHALLENGE_DEFS = [
  {
    id: 'top-three',
    label: 'Finish Top 3',
    rewardXp: 90,
    rewardCurrency: 120,
    getProgressText: (stats, result) => (result ? `${Math.min(result.position, 3)}/3` : `P${stats.currentPosition}`),
    isComplete: (stats, result) => Boolean(result && result.position <= 3)
  },
  {
    id: 'drift-release-3',
    label: 'Trigger 3 Drift Releases',
    rewardXp: 95,
    rewardCurrency: 135,
    getProgressText: (stats) => `${Math.min(stats.driftReleases, 3)}/3`,
    isComplete: (stats) => stats.driftReleases >= 3
  },
  {
    id: 'overtake-4',
    label: 'Make 4 Overtakes',
    rewardXp: 105,
    rewardCurrency: 145,
    getProgressText: (stats) => `${Math.min(stats.overtakes, 4)}/4`,
    isComplete: (stats) => stats.overtakes >= 4
  },
  {
    id: 'collect-2',
    label: 'Collect 2 Power-Ups',
    rewardXp: 80,
    rewardCurrency: 110,
    getProgressText: (stats) => `${Math.min(stats.pickupsCollected, 2)}/2`,
    isComplete: (stats) => stats.pickupsCollected >= 2
  },
  {
    id: 'clean-finish',
    label: 'Finish With No Hazard Hits',
    rewardXp: 110,
    rewardCurrency: 150,
    getProgressText: (stats) => `${stats.hazardHits}`,
    isComplete: (stats) => stats.hazardHits === 0
  },
  {
    id: 'win-no-boost',
    label: 'Win Without Manual Boost',
    rewardXp: 150,
    rewardCurrency: 190,
    getProgressText: (stats, result) => (result ? `${result.position === 1 && !stats.usedManualBoost ? 'Done' : 'Try Again'}` : stats.usedManualBoost ? 'Boost Used' : 'No Boost'),
    isComplete: (stats, result) => Boolean(result && result.position === 1 && !stats.usedManualBoost)
  }
];

export const SHIP_LOOKUP = Object.fromEntries(SHIP_DEFS.map((ship) => [ship.id, ship]));
export const TRACK_LOOKUP = Object.fromEntries(TRACK_DEFS.map((track) => [track.id, track]));
export const HULL_LOOKUP = Object.fromEntries(HULL_COLORS.map((item) => [item.id, item]));
export const GLOW_LOOKUP = Object.fromEntries(GLOW_COLORS.map((item) => [item.id, item]));
export const TRAIL_LOOKUP = Object.fromEntries(TRAIL_COLORS.map((item) => [item.id, item]));
export const CHALLENGE_LOOKUP = Object.fromEntries(CHALLENGE_DEFS.map((challenge) => [challenge.id, challenge]));
