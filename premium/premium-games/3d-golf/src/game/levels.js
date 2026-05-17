export const LEVELS = [
  {
    id: 1,
    name: 'Marble Promenade',
    difficulty: 'beginner',
    par: 2,
    start: { x: 0, z: -5.35 },
    hole: { x: 0, z: 5.45 },
    platform: { x: 0, z: 0, w: 7.2, d: 15.8 },
    playAreas: [{ x: 0, z: 0, w: 5.2, d: 13.6, h: 0 }],
    walls: [
      [-2.85, -7.05, 2.85, -7.05],
      [2.85, -7.05, 2.85, 7.05],
      [2.85, 7.05, -2.85, 7.05],
      [-2.85, 7.05, -2.85, -7.05]
    ],
    obstacles: [],
    zones: [],
    movingObstacles: [],
    fallBounds: { x: 0, z: 0, w: 8.4, d: 17 },
    intro: { yaw: -0.1, distance: 13.8 }
  },
  {
    id: 2,
    name: 'Gilded Angles',
    difficulty: 'beginner',
    par: 3,
    start: { x: -1.65, z: -5.55 },
    hole: { x: 1.65, z: 5.5 },
    platform: { x: 0, z: 0, w: 7.4, d: 15.7 },
    playAreas: [{ x: 0, z: 0, w: 5.45, d: 13.55, h: 0 }],
    walls: [
      [-3, -7, 3, -7],
      [3, -7, 3, 7],
      [3, 7, -3, 7],
      [-3, 7, -3, -7],
      [-2.35, -1.2, 0.75, 1.7],
      [2.35, 1.1, -0.45, 3.55]
    ],
    obstacles: [{ type: 'circle', x: 0.25, z: -2.4, r: 0.42, visual: 'pillar' }],
    zones: [],
    movingObstacles: [],
    fallBounds: { x: 0, z: 0, w: 8.5, d: 17 },
    intro: { yaw: -0.35, distance: 14 }
  },
  {
    id: 3,
    name: 'Royal Bridge',
    difficulty: 'beginner',
    par: 3,
    start: { x: 0, z: -5.7 },
    hole: { x: 0, z: 5.65 },
    platform: { x: 0, z: 0, w: 7.6, d: 15.9 },
    playAreas: [
      { x: 0, z: -4.65, w: 5.25, d: 4.5, h: 0 },
      { x: 0, z: 0.35, w: 2, d: 5.45, h: 0 },
      { x: 0, z: 4.85, w: 5.25, d: 4.2, h: 0 }
    ],
    walls: [
      [-2.85, -7, 2.85, -7],
      [-2.85, -7, -2.85, -2.45],
      [2.85, -7, 2.85, -2.45],
      [-2.85, -2.45, -1.08, -2.45],
      [1.08, -2.45, 2.85, -2.45],
      [-1.08, -2.45, -1.08, 3.08],
      [1.08, -2.45, 1.08, 3.08],
      [-2.85, 3.08, -1.08, 3.08],
      [1.08, 3.08, 2.85, 3.08],
      [-2.85, 3.08, -2.85, 7],
      [2.85, 3.08, 2.85, 7],
      [2.85, 7, -2.85, 7]
    ],
    obstacles: [
      { type: 'circle', x: -1.95, z: 4.5, r: 0.33, visual: 'pillar' },
      { type: 'circle', x: 1.95, z: 4.5, r: 0.33, visual: 'pillar' }
    ],
    zones: [],
    movingObstacles: [],
    fallBounds: { x: 0, z: 0, w: 8.6, d: 17.2 },
    intro: { yaw: 0.1, distance: 14.3 }
  },
  {
    id: 4,
    name: 'Ivory Rise',
    difficulty: 'medium',
    par: 4,
    start: { x: 0, z: -5.7 },
    hole: { x: 0.95, z: 5.55 },
    platform: { x: 0, z: 0, w: 7.4, d: 15.9 },
    playAreas: [
      { x: 0, z: -4.4, w: 5.15, d: 4.95, h: 0 },
      { x: 0, z: -0.85, w: 4.4, d: 2.9, ramp: { axis: 'z', from: -2.25, to: 0.55, startH: 0, endH: 0.58 } },
      { x: 0, z: 3.85, w: 5.15, d: 7.1, h: 0.58 }
    ],
    heightZones: [
      { type: 'ramp', x: 0, z: -0.85, w: 4.4, d: 2.9, from: -2.25, to: 0.55, startH: 0, endH: 0.58 },
      { type: 'box', x: 0, z: 3.85, w: 5.15, d: 7.1, h: 0.58 }
    ],
    walls: [
      [-2.85, -7, 2.85, -7],
      [2.85, -7, 2.85, 7],
      [2.85, 7, -2.85, 7],
      [-2.85, 7, -2.85, -7],
      [-2.2, -2.15, -2.2, 0.55],
      [2.2, -2.15, 2.2, 0.55]
    ],
    obstacles: [
      { type: 'circle', x: -1.25, z: 2.5, r: 0.38, visual: 'pillar' },
      { type: 'circle', x: 1.3, z: 3.55, r: 0.38, visual: 'pillar' }
    ],
    zones: [],
    movingObstacles: [],
    fallBounds: { x: 0, z: 0, w: 8.5, d: 17.2 },
    intro: { yaw: -0.15, distance: 14.5 }
  },
  {
    id: 5,
    name: 'Crown Curve',
    difficulty: 'medium',
    par: 4,
    start: { x: -1.85, z: -5.55 },
    hole: { x: 1.8, z: 5.55 },
    platform: { x: 0, z: 0, w: 7.7, d: 16 },
    playAreas: [
      { x: -0.95, z: -3.9, w: 3.9, d: 5.2, h: 0 },
      { x: 0, z: 0.45, w: 5.6, d: 4.25, h: 0 },
      { x: 1.05, z: 4.3, w: 3.9, d: 5.1, h: 0 }
    ],
    walls: [
      [-3.05, -7.1, 1.35, -7.1],
      [1.35, -7.1, 1.35, -4.05],
      [1.35, -4.05, 3.05, -4.05],
      [3.05, -4.05, 3.05, 7.1],
      [3.05, 7.1, -1.35, 7.1],
      [-1.35, 7.1, -1.35, 4.05],
      [-1.35, 4.05, -3.05, 4.05],
      [-3.05, 4.05, -3.05, -7.1],
      [-3.05, -7.1, -3.05, 4.05],
      [-1.25, -1.25, 1.25, -1.25],
      [-1.25, 2.35, 1.25, 2.35]
    ],
    obstacles: [
      { type: 'circle', x: -0.75, z: -0.15, r: 0.46, visual: 'pillar' },
      { type: 'circle', x: 0.9, z: 1.15, r: 0.46, visual: 'pillar' },
      { type: 'circle', x: -0.15, z: 3.35, r: 0.36, visual: 'gold-post' }
    ],
    zones: [],
    movingObstacles: [],
    fallBounds: { x: 0, z: 0, w: 8.8, d: 17.3 },
    intro: { yaw: -0.45, distance: 14.6 }
  },
  {
    id: 6,
    name: 'Sandglass Steps',
    difficulty: 'medium',
    par: 4,
    start: { x: 0, z: -5.7 },
    hole: { x: -1.45, z: 5.45 },
    platform: { x: 0, z: 0, w: 7.6, d: 16 },
    playAreas: [
      { x: 0, z: -4.8, w: 5.2, d: 4.4, h: 0 },
      { x: 0, z: -1.1, w: 4.8, d: 3.1, ramp: { axis: 'z', from: -2.65, to: 0.45, startH: 0, endH: 0.5 } },
      { x: -0.7, z: 3.65, w: 5.4, d: 7.1, h: 0.5 }
    ],
    heightZones: [
      { type: 'ramp', x: 0, z: -1.1, w: 4.8, d: 3.1, from: -2.65, to: 0.45, startH: 0, endH: 0.5 },
      { type: 'box', x: -0.7, z: 3.65, w: 5.4, d: 7.1, h: 0.5 }
    ],
    walls: [
      [-2.9, -7.05, 2.9, -7.05],
      [2.9, -7.05, 2.9, 7.05],
      [2.9, 7.05, -3.2, 7.05],
      [-3.2, 7.05, -3.2, -7.05],
      [-2.35, -2.65, -2.35, 0.45],
      [2.35, -2.65, 2.35, 0.45],
      [-0.3, 2.05, 2.3, 2.05]
    ],
    obstacles: [{ type: 'circle', x: 1.1, z: 3.9, r: 0.34, visual: 'pillar' }],
    zones: [
      { type: 'sand', x: -1.35, z: 2.3, w: 2.1, d: 1.4 },
      { type: 'sand', x: 0.45, z: 4.6, w: 1.55, d: 1.25 }
    ],
    movingObstacles: [],
    fallBounds: { x: -0.15, z: 0, w: 8.8, d: 17.4 },
    intro: { yaw: -0.25, distance: 14.9 }
  },
  {
    id: 7,
    name: 'Golden Switchback',
    difficulty: 'medium',
    par: 4,
    start: { x: -1.8, z: -5.65 },
    hole: { x: 1.85, z: 5.5 },
    platform: { x: 0, z: 0, w: 7.8, d: 16 },
    playAreas: [
      { x: -0.9, z: -4.15, w: 4.1, d: 4.8, h: 0 },
      { x: 0.15, z: -0.1, w: 5.75, d: 3.8, h: 0 },
      { x: 0.95, z: 4.2, w: 4.25, d: 5.2, h: 0 }
    ],
    walls: [
      [-3.1, -7, 1.35, -7],
      [1.35, -7, 1.35, -2.3],
      [1.35, -2.3, 3.1, -2.3],
      [3.1, -2.3, 3.1, 7],
      [3.1, 7, -1.35, 7],
      [-1.35, 7, -1.35, 2.35],
      [-1.35, 2.35, -3.1, 2.35],
      [-3.1, 2.35, -3.1, -7],
      [-1.2, -0.95, 1.55, -0.95],
      [-1.55, 1.2, 1.2, 1.2]
    ],
    obstacles: [
      { type: 'circle', x: -0.8, z: -0.05, r: 0.35, visual: 'gold-post' },
      { type: 'circle', x: 1.25, z: 2.95, r: 0.35, visual: 'pillar' }
    ],
    zones: [{ type: 'boost', x: -0.25, z: -1.6, w: 1.55, d: 0.9, direction: { x: 1, z: 0.45 }, strength: 2.15 }],
    movingObstacles: [],
    fallBounds: { x: 0, z: 0, w: 8.9, d: 17.3 },
    intro: { yaw: -0.5, distance: 14.8 }
  },
  {
    id: 8,
    name: 'Sliding Gate Gallery',
    difficulty: 'challenge',
    par: 4,
    start: { x: 0, z: -5.7 },
    hole: { x: 0, z: 5.55 },
    platform: { x: 0, z: 0, w: 7.7, d: 16 },
    playAreas: [{ x: 0, z: 0, w: 5.45, d: 13.7, h: 0 }],
    walls: [
      [-3, -7.05, 3, -7.05],
      [3, -7.05, 3, 7.05],
      [3, 7.05, -3, 7.05],
      [-3, 7.05, -3, -7.05],
      [-2.35, -1.15, -0.75, -1.15],
      [0.75, -1.15, 2.35, -1.15],
      [-2.35, 2.2, -0.8, 2.2],
      [0.8, 2.2, 2.35, 2.2]
    ],
    obstacles: [{ type: 'circle', x: 1.55, z: -3.6, r: 0.32, visual: 'pillar' }],
    zones: [{ type: 'sand', x: 0, z: 4.1, w: 1.7, d: 1.2 }],
    movingObstacles: [
      { id: 'gate-a', type: 'slidingGate', x: 0, z: -1.15, w: 1.35, d: 0.25, axis: 'x', amplitude: 1.25, speed: 0.78, phase: 0 },
      { id: 'gate-b', type: 'slidingGate', x: 0, z: 2.2, w: 1.35, d: 0.25, axis: 'x', amplitude: 1.15, speed: 0.72, phase: Math.PI }
    ],
    fallBounds: { x: 0, z: 0, w: 8.8, d: 17.3 },
    intro: { yaw: 0.15, distance: 14.8 }
  },
  {
    id: 9,
    name: 'Carousel Court',
    difficulty: 'challenge',
    par: 4,
    start: { x: -1.8, z: -5.55 },
    hole: { x: 1.8, z: 5.55 },
    platform: { x: 0, z: 0, w: 7.8, d: 16 },
    playAreas: [
      { x: -0.9, z: -4.2, w: 4.25, d: 4.75, h: 0 },
      { x: 0, z: 0.1, w: 5.7, d: 4.25, h: 0 },
      { x: 1.05, z: 4.3, w: 4.25, d: 5.3, h: 0 }
    ],
    walls: [
      [-3.1, -7.05, 1.35, -7.05],
      [1.35, -7.05, 1.35, -2.25],
      [1.35, -2.25, 3.1, -2.25],
      [3.1, -2.25, 3.1, 7.05],
      [3.1, 7.05, -1.35, 7.05],
      [-1.35, 7.05, -1.35, 2.2],
      [-1.35, 2.2, -3.1, 2.2],
      [-3.1, 2.2, -3.1, -7.05],
      [-1.25, -1, 1.25, -1],
      [-1.25, 1.25, 1.25, 1.25]
    ],
    obstacles: [{ type: 'circle', x: 0, z: 0.1, r: 0.28, visual: 'gold-post' }],
    zones: [{ type: 'bouncePad', x: -0.6, z: 2.95, w: 0.9, d: 0.9, strength: 1.38 }],
    movingObstacles: [
      { id: 'carousel', type: 'rotatingBar', x: 0, z: 0.1, w: 3.25, d: 0.22, speed: 0.55, phase: 0.15 }
    ],
    fallBounds: { x: 0, z: 0, w: 8.9, d: 17.3 },
    intro: { yaw: -0.65, distance: 15 }
  },
  {
    id: 10,
    name: 'Moonbridge Mezzanine',
    difficulty: 'challenge',
    par: 5,
    start: { x: 0, z: -5.85 },
    hole: { x: 0, z: 5.55 },
    platform: { x: 0, z: 0, w: 7.8, d: 16.2 },
    playAreas: [
      { x: 0, z: -5.05, w: 5.35, d: 3.85, h: 0.35 },
      { x: 0, z: 5, w: 5.35, d: 4.15, h: 0.35 },
      { x: 0, z: -1.1, w: 2.15, d: 2.5, ramp: { axis: 'z', from: -2.35, to: 0.15, startH: 0.35, endH: 0.72 } },
      { x: 0, z: 1.4, w: 2.15, d: 2.5, ramp: { axis: 'z', from: 0.15, to: 2.65, startH: 0.72, endH: 0.35 } }
    ],
    heightZones: [
      { type: 'box', x: 0, z: -5.05, w: 5.35, d: 3.85, h: 0.35 },
      { type: 'box', x: 0, z: 5, w: 5.35, d: 4.15, h: 0.35 },
      { type: 'ramp', x: 0, z: -1.1, w: 2.15, d: 2.5, from: -2.35, to: 0.15, startH: 0.35, endH: 0.72 },
      { type: 'ramp', x: 0, z: 1.4, w: 2.15, d: 2.5, from: 0.15, to: 2.65, startH: 0.72, endH: 0.35 }
    ],
    walls: [
      [-2.95, -7.15, 2.95, -7.15],
      [-2.95, -7.15, -2.95, -3.05],
      [2.95, -7.15, 2.95, -3.05],
      [-2.95, 3.05, -2.95, 7.15],
      [2.95, 3.05, 2.95, 7.15],
      [2.95, 7.15, -2.95, 7.15],
      [-1.2, -3.05, -1.2, 3.05],
      [1.2, -3.05, 1.2, 3.05]
    ],
    obstacles: [],
    zones: [{ type: 'boost', x: 0, z: -3.1, w: 1.25, d: 0.8, direction: { x: 0, z: 1 }, strength: 1.55 }],
    movingObstacles: [
      { id: 'moon-platform', type: 'movingPlatform', x: 0, z: 0.15, w: 1.75, d: 2.6, h: 0.72, axis: 'x', amplitude: 1.15, speed: 0.5, phase: 0 }
    ],
    fallBounds: { x: 0, z: 0, w: 8.4, d: 17.4 },
    intro: { yaw: 0.15, distance: 15.4 }
  },
  {
    id: 11,
    name: 'Split Laurel',
    difficulty: 'challenge',
    par: 5,
    start: { x: 0, z: -5.75 },
    hole: { x: 0, z: 5.6 },
    platform: { x: 0, z: 0, w: 8, d: 16.2 },
    playAreas: [
      { x: 0, z: -5, w: 5.4, d: 3.9, h: 0 },
      { x: -1.55, z: -0.35, w: 2.35, d: 5.6, h: 0 },
      { x: 1.55, z: -0.35, w: 2.35, d: 5.6, h: 0 },
      { x: 0, z: 4.75, w: 5.4, d: 4.5, h: 0 }
    ],
    walls: [
      [-3.05, -7.1, 3.05, -7.1],
      [-3.05, -7.1, -3.05, -2.75],
      [3.05, -7.1, 3.05, -2.75],
      [-3.05, -2.75, -2.75, 2.45],
      [-0.35, -2.75, -0.35, 2.45],
      [0.35, -2.75, 0.35, 2.45],
      [3.05, -2.75, 2.75, 2.45],
      [-2.75, 2.45, -3.05, 2.45],
      [2.75, 2.45, 3.05, 2.45],
      [-3.05, 2.45, -3.05, 7.1],
      [3.05, 2.45, 3.05, 7.1],
      [3.05, 7.1, -3.05, 7.1]
    ],
    obstacles: [
      { type: 'circle', x: -1.55, z: -0.2, r: 0.34, visual: 'pillar' },
      { type: 'circle', x: 1.55, z: 1.05, r: 0.34, visual: 'pillar' }
    ],
    zones: [
      { type: 'sand', x: -1.55, z: 1.45, w: 1.35, d: 1.2 },
      { type: 'boost', x: 1.55, z: -1.75, w: 1.15, d: 0.85, direction: { x: 0, z: 1 }, strength: 1.85 }
    ],
    movingObstacles: [
      { id: 'split-swing', type: 'swingingBlocker', x: 0, z: 3.05, w: 2.35, d: 0.2, speed: 0.6, amplitude: 0.72, phase: 0.2 }
    ],
    fallBounds: { x: 0, z: 0, w: 9, d: 17.4 },
    intro: { yaw: -0.2, distance: 15.2 }
  },
  {
    id: 12,
    name: 'Crown Shortcut',
    difficulty: 'challenge',
    par: 5,
    start: { x: -2.05, z: -5.65 },
    hole: { x: 2.05, z: 5.55 },
    platform: { x: 0, z: 0, w: 8, d: 16.2 },
    playAreas: [
      { x: -1.45, z: -4.35, w: 3.6, d: 4.9, h: 0 },
      { x: 0, z: -0.05, w: 5.8, d: 3.6, h: 0 },
      { x: 1.45, z: 4.35, w: 3.6, d: 5.05, h: 0 },
      { x: 0, z: 3.15, w: 1.3, d: 2.25, h: 0.28 }
    ],
    heightZones: [{ type: 'box', x: 0, z: 3.15, w: 1.3, d: 2.25, h: 0.28 }],
    walls: [
      [-3.2, -7.05, 0.85, -7.05],
      [0.85, -7.05, 0.85, -2.35],
      [0.85, -2.35, 3.2, -2.35],
      [3.2, -2.35, 3.2, 7.05],
      [3.2, 7.05, -0.85, 7.05],
      [-0.85, 7.05, -0.85, 2.35],
      [-0.85, 2.35, -3.2, 2.35],
      [-3.2, 2.35, -3.2, -7.05],
      [-1.2, -1.05, 1.2, -1.05],
      [-1.2, 1.05, 1.2, 1.05],
      [-0.75, 2.1, -0.75, 4.15],
      [0.75, 2.1, 0.75, 4.15]
    ],
    obstacles: [
      { type: 'circle', x: -1, z: -0.1, r: 0.4, visual: 'pillar' },
      { type: 'circle', x: 1.1, z: 1.55, r: 0.38, visual: 'gold-post' }
    ],
    zones: [
      { type: 'bouncePad', x: -0.65, z: 0.2, w: 0.95, d: 0.95, strength: 1.55 },
      { type: 'boost', x: 0, z: 2.35, w: 1.1, d: 0.75, direction: { x: 0.8, z: 1 }, strength: 1.75 },
      { type: 'sand', x: 1.6, z: 4.6, w: 1.25, d: 1.15 }
    ],
    movingObstacles: [
      { id: 'final-gate', type: 'slidingGate', x: 1.45, z: 3.3, w: 1.45, d: 0.22, axis: 'z', amplitude: 0.8, speed: 0.7, phase: 0.4 },
      { id: 'final-rotor', type: 'rotatingBar', x: 0, z: -1.85, w: 2.6, d: 0.2, speed: 0.48, phase: 0.7 }
    ],
    fallBounds: { x: 0, z: 0, w: 9.2, d: 17.4 },
    intro: { yaw: -0.7, distance: 15.5 }
  },
  {
    id: 13,
    packId: 'sky-marble',
    name: 'Sky Bridge',
    difficulty: 'easy-medium',
    par: 3,
    theme: 'sky',
    decor: 'floating-pillars',
    railStyle: 'glass-gold',
    flagStyle: 'sky-banner',
    tilePattern: 'cloud-vein',
    platform: { x: 0, z: 0, w: 8.8, d: 17.2 },
    start: { x: 0, z: -6.4 },
    hole: { x: 0, z: 6.35 },
    playAreas: [{ x: 0, z: 0, w: 2.7, d: 14.4, h: 0.22 }],
    heightZones: [{ type: 'box', x: 0, z: 0, w: 2.7, d: 14.4, h: 0.22 }],
    walls: [
      [-1.5, -7.35, -1.5, 7.15], [1.5, -7.35, 1.5, 7.15],
      [-1.5, -7.35, 1.5, -7.35], [-1.5, 7.15, 1.5, 7.15]
    ],
    obstacles: [],
    zones: [],
    movingObstacles: [],
    fallBounds: { x: 0, z: 0, w: 6.5, d: 16.8 },
    intro: { yaw: -0.55, distance: 14.8 }
  },
  {
    id: 14,
    packId: 'sky-marble',
    name: 'Cloud Curve',
    difficulty: 'easy-medium',
    par: 3,
    theme: 'sky',
    decor: 'cloud-rings',
    railStyle: 'rounded-gold',
    flagStyle: 'sky-banner',
    tilePattern: 'crescent',
    platform: { x: 0, z: 0, w: 9.1, d: 17.4 },
    start: { x: -2.15, z: -6.25 },
    hole: { x: 2.15, z: 6.1 },
    playAreas: [
      { x: -2.15, z: -3.8, w: 2.2, d: 5.4, h: 0.16 },
      { x: 0, z: 0.6, w: 5.2, d: 2.2, h: 0.16 },
      { x: 2.15, z: 4.55, w: 2.2, d: 4.6, h: 0.16 }
    ],
    heightZones: [
      { type: 'box', x: -2.15, z: -3.8, w: 2.2, d: 5.4, h: 0.16 },
      { type: 'box', x: 0, z: 0.6, w: 5.2, d: 2.2, h: 0.16 },
      { type: 'box', x: 2.15, z: 4.55, w: 2.2, d: 4.6, h: 0.16 }
    ],
    walls: [
      [-3.35, -6.65, -3.35, -1.0], [-0.95, -6.65, -0.95, -0.55],
      [-3.35, -6.65, -0.95, -6.65], [-3.35, -1.0, -2.05, -0.35],
      [-2.6, -0.55, 2.65, -0.55], [-2.65, 1.75, 2.65, 1.75],
      [0.95, 1.2, 0.95, 6.9], [3.35, 1.2, 3.35, 6.9],
      [0.95, 6.9, 3.35, 6.9]
    ],
    obstacles: [{ type: 'circle', x: 0, z: 0.6, r: 0.28, visual: 'gold-post' }],
    zones: [],
    movingObstacles: [],
    fallBounds: { x: 0, z: 0, w: 8.8, d: 17.2 },
    intro: { yaw: -0.75, distance: 15.2 }
  },
  {
    id: 15,
    packId: 'sky-marble',
    name: 'Split Nimbus',
    difficulty: 'easy-medium',
    par: 4,
    theme: 'sky',
    decor: 'split-islands',
    railStyle: 'glass-gold',
    flagStyle: 'classic-gold',
    tilePattern: 'diamond',
    platform: { x: 0, z: 0, w: 9.2, d: 17.2 },
    start: { x: 0, z: -6.35 },
    hole: { x: 0, z: 6.2 },
    playAreas: [
      { x: 0, z: -4.35, w: 2.7, d: 4.3, h: 0.18 },
      { x: -1.9, z: 0.15, w: 1.8, d: 5.6, h: 0.18 },
      { x: 1.75, z: 0.15, w: 1.55, d: 5.0, h: 0.18 },
      { x: 0, z: 4.8, w: 3.2, d: 3.7, h: 0.18 }
    ],
    heightZones: [
      { type: 'box', x: 0, z: -4.35, w: 2.7, d: 4.3, h: 0.18 },
      { type: 'box', x: -1.9, z: 0.15, w: 1.8, d: 5.6, h: 0.18 },
      { type: 'box', x: 1.75, z: 0.15, w: 1.55, d: 5.0, h: 0.18 },
      { type: 'box', x: 0, z: 4.8, w: 3.2, d: 3.7, h: 0.18 }
    ],
    walls: [
      [-1.45, -6.75, -1.45, -2.0], [1.45, -6.75, 1.45, -2.0], [-1.45, -6.75, 1.45, -6.75],
      [-2.95, -2.65, -2.95, 3.0], [-0.9, -2.65, -0.9, 3.0],
      [0.9, -2.35, 0.9, 2.55], [2.62, -2.35, 2.62, 2.55],
      [-1.75, 3.05, 1.75, 3.05], [-1.75, 6.78, 1.75, 6.78],
      [-1.75, 3.05, -1.75, 6.78], [1.75, 3.05, 1.75, 6.78]
    ],
    obstacles: [{ type: 'circle', x: 0, z: 2.65, r: 0.32, visual: 'gold-post' }],
    zones: [{ type: 'boost', x: 1.75, z: -0.65, w: 0.95, d: 0.72, direction: { x: -0.18, z: 1 }, strength: 1.35 }],
    movingObstacles: [],
    fallBounds: { x: 0, z: 0, w: 8.8, d: 17.2 },
    intro: { yaw: -0.48, distance: 15.4 }
  },
  {
    id: 16,
    packId: 'sky-marble',
    name: 'Temple Drop',
    difficulty: 'medium',
    par: 4,
    theme: 'sky',
    decor: 'temple-steps',
    railStyle: 'marble-gold',
    flagStyle: 'royal-crown',
    tilePattern: 'stepped',
    platform: { x: 0, z: 0, w: 9.2, d: 17.4 },
    start: { x: 0, z: -6.55 },
    hole: { x: 0.15, z: 6.05 },
    playAreas: [
      { x: 0, z: -4.4, w: 3.4, d: 4.5, h: 0.14 },
      { x: 0, z: -0.55, w: 2.6, d: 3.9, h: 0.55 },
      { x: 0.1, z: 4.1, w: 3.2, d: 5.1, h: 0.24 }
    ],
    heightZones: [
      { type: 'box', x: 0, z: -4.4, w: 3.4, d: 4.5, h: 0.14 },
      { type: 'ramp', x: 0, z: -2.4, w: 2.6, d: 2.8, from: -3.8, to: -1.0, startH: 0.14, endH: 0.55 },
      { type: 'box', x: 0, z: -0.55, w: 2.6, d: 3.9, h: 0.55 },
      { type: 'ramp', x: 0.05, z: 1.95, w: 2.5, d: 2.3, from: 0.8, to: 3.1, startH: 0.55, endH: 0.24 },
      { type: 'box', x: 0.1, z: 4.1, w: 3.2, d: 5.1, h: 0.24 }
    ],
    walls: [
      [-1.85, -6.9, -1.85, -2.15], [1.85, -6.9, 1.85, -2.15], [-1.85, -6.9, 1.85, -6.9],
      [-1.42, -2.55, -1.42, 1.25], [1.42, -2.55, 1.42, 1.25],
      [-1.72, 1.7, -1.72, 6.8], [1.92, 1.7, 1.92, 6.8], [-1.72, 6.8, 1.92, 6.8]
    ],
    obstacles: [],
    zones: [{ type: 'sand', x: 0.85, z: 4.1, w: 1.1, d: 1.25 }],
    movingObstacles: [],
    fallBounds: { x: 0, z: 0, w: 8.8, d: 17.4 },
    intro: { yaw: -0.64, distance: 15.8 }
  },
  {
    id: 17,
    packId: 'sky-marble',
    name: 'Drift Platform',
    difficulty: 'medium',
    par: 4,
    theme: 'sky',
    decor: 'moving-cloud',
    railStyle: 'glass-gold',
    flagStyle: 'sky-banner',
    tilePattern: 'floating',
    platform: { x: 0, z: 0, w: 9.4, d: 17.4 },
    start: { x: -2.35, z: -6.1 },
    hole: { x: 2.25, z: 6.05 },
    playAreas: [
      { x: -2.35, z: -4.75, w: 2.5, d: 3.6, h: 0.22 },
      { x: 2.25, z: 4.75, w: 2.8, d: 3.9, h: 0.22 }
    ],
    heightZones: [
      { type: 'box', x: -2.35, z: -4.75, w: 2.5, d: 3.6, h: 0.22 },
      { type: 'box', x: 2.25, z: 4.75, w: 2.8, d: 3.9, h: 0.22 }
    ],
    walls: [
      [-3.72, -6.75, -3.72, -2.8], [-0.98, -6.75, -0.98, -2.8], [-3.72, -6.75, -0.98, -6.75],
      [0.75, 2.75, 0.75, 6.85], [3.75, 2.75, 3.75, 6.85], [0.75, 6.85, 3.75, 6.85]
    ],
    obstacles: [],
    zones: [{ type: 'wind', x: 0, z: 0.15, w: 1.6, d: 3.0, direction: { x: 0.75, z: 1 }, strength: 0.68 }],
    movingObstacles: [
      { id: 'sky-drift-platform', type: 'movingPlatform', x: 0, z: 0.2, w: 2.2, d: 3.15, h: 0.22, axis: 'x', amplitude: 1.2, speed: 0.48, phase: 0 }
    ],
    fallBounds: { x: 0, z: 0, w: 9.1, d: 17.2 },
    intro: { yaw: -0.75, distance: 15.6 }
  },
  {
    id: 18,
    packId: 'sky-marble',
    name: 'Golden Halo',
    difficulty: 'medium',
    par: 4,
    theme: 'sky',
    decor: 'halo-rotor',
    railStyle: 'rounded-gold',
    flagStyle: 'royal-crown',
    tilePattern: 'ring',
    platform: { x: 0, z: 0, w: 9.2, d: 17.4 },
    start: { x: 0, z: -6.35 },
    hole: { x: 0, z: 6.15 },
    playAreas: [{ x: 0, z: 0, w: 4.2, d: 14.6, h: 0.18 }],
    heightZones: [{ type: 'box', x: 0, z: 0, w: 4.2, d: 14.6, h: 0.18 }],
    walls: [
      [-2.25, -7.25, -2.25, 7.0], [2.25, -7.25, 2.25, 7.0],
      [-2.25, -7.25, 2.25, -7.25], [-2.25, 7.0, 2.25, 7.0]
    ],
    obstacles: [
      { type: 'circle', x: -1.35, z: 2.4, r: 0.3, visual: 'gold-post' },
      { type: 'circle', x: 1.35, z: -2.0, r: 0.3, visual: 'gold-post' }
    ],
    zones: [],
    movingObstacles: [{ id: 'golden-halo-bar', type: 'rotatingBar', x: 0, z: 0.2, w: 3.35, d: 0.22, speed: 0.62, phase: 0.25 }],
    fallBounds: { x: 0, z: 0, w: 8.8, d: 17.1 },
    intro: { yaw: -0.58, distance: 15.1 }
  },
  {
    id: 19,
    packId: 'sky-marble',
    name: 'Glass Crown Bridge',
    difficulty: 'medium',
    par: 4,
    theme: 'sky',
    decor: 'glass-bridge',
    railStyle: 'glass-gold',
    flagStyle: 'sky-banner',
    tilePattern: 'glass',
    platform: { x: 0, z: 0, w: 9.0, d: 17.5 },
    start: { x: 0, z: -6.5 },
    hole: { x: 0, z: 6.2 },
    playAreas: [
      { x: 0, z: -5.0, w: 3.1, d: 3.2, h: 0.24 },
      { x: 0, z: -0.2, w: 1.24, d: 6.1, h: 0.24 },
      { x: 0, z: 4.9, w: 3.1, d: 3.7, h: 0.24 }
    ],
    heightZones: [
      { type: 'box', x: 0, z: -5.0, w: 3.1, d: 3.2, h: 0.24 },
      { type: 'box', x: 0, z: -0.2, w: 1.24, d: 6.1, h: 0.24 },
      { type: 'box', x: 0, z: 4.9, w: 3.1, d: 3.7, h: 0.24 }
    ],
    walls: [
      [-1.72, -6.85, -1.72, -3.15], [1.72, -6.85, 1.72, -3.15], [-1.72, -6.85, 1.72, -6.85],
      [-0.76, -3.25, -0.76, 2.85], [0.76, -3.25, 0.76, 2.85],
      [-1.72, 3.1, -1.72, 6.9], [1.72, 3.1, 1.72, 6.9], [-1.72, 6.9, 1.72, 6.9]
    ],
    obstacles: [],
    zones: [{ type: 'wind', x: 0, z: -0.1, w: 0.98, d: 3.2, direction: { x: 0, z: 1 }, strength: 0.42 }],
    movingObstacles: [],
    fallBounds: { x: 0, z: 0, w: 7.8, d: 17.3 },
    intro: { yaw: -0.5, distance: 15.7 }
  },
  {
    id: 20,
    packId: 'sky-marble',
    name: 'Windwalk Arcade',
    difficulty: 'medium',
    par: 4,
    theme: 'sky',
    decor: 'wind-arches',
    railStyle: 'marble-gold',
    flagStyle: 'sky-banner',
    tilePattern: 'arrow',
    platform: { x: 0, z: 0, w: 9.2, d: 17.4 },
    start: { x: -1.85, z: -6.15 },
    hole: { x: 1.9, z: 6.05 },
    playAreas: [
      { x: -1.85, z: -3.65, w: 2.5, d: 5.6, h: 0.18 },
      { x: 0, z: 0.8, w: 5.3, d: 2.0, h: 0.18 },
      { x: 1.9, z: 4.65, w: 2.6, d: 4.4, h: 0.18 }
    ],
    heightZones: [
      { type: 'box', x: -1.85, z: -3.65, w: 2.5, d: 5.6, h: 0.18 },
      { type: 'box', x: 0, z: 0.8, w: 5.3, d: 2.0, h: 0.18 },
      { type: 'box', x: 1.9, z: 4.65, w: 2.6, d: 4.4, h: 0.18 }
    ],
    walls: [
      [-3.18, -6.8, -3.18, -0.8], [-0.52, -6.8, -0.52, -0.15], [-3.18, -6.8, -0.52, -6.8],
      [-2.75, -0.25, 2.75, -0.25], [-2.75, 1.85, 2.75, 1.85],
      [0.52, 1.15, 0.52, 6.85], [3.25, 1.15, 3.25, 6.85], [0.52, 6.85, 3.25, 6.85]
    ],
    obstacles: [{ type: 'circle', x: 0.1, z: 0.8, r: 0.26, visual: 'gold-post' }],
    zones: [
      { type: 'wind', x: -1.85, z: -2.15, w: 1.55, d: 2.25, direction: { x: 0.55, z: 1 }, strength: 0.72 },
      { type: 'wind', x: 1.0, z: 0.8, w: 1.55, d: 1.3, direction: { x: 1, z: 0.2 }, strength: 0.55 }
    ],
    movingObstacles: [],
    fallBounds: { x: 0, z: 0, w: 8.9, d: 17.2 },
    intro: { yaw: -0.72, distance: 15.6 }
  },
  {
    id: 21,
    packId: 'sky-marble',
    name: 'Bounce Isle',
    difficulty: 'challenge',
    par: 5,
    theme: 'sky',
    decor: 'island-hop',
    railStyle: 'glass-gold',
    flagStyle: 'royal-crown',
    tilePattern: 'islands',
    platform: { x: 0, z: 0, w: 9.4, d: 17.6 },
    start: { x: -2.45, z: -6.15 },
    hole: { x: 2.45, z: 6.05 },
    playAreas: [
      { x: -2.45, z: -5.0, w: 2.4, d: 3.1, h: 0.2 },
      { x: 0, z: -0.25, w: 2.1, d: 3.2, h: 0.28 },
      { x: 2.45, z: 4.9, w: 2.55, d: 3.8, h: 0.2 }
    ],
    heightZones: [
      { type: 'box', x: -2.45, z: -5.0, w: 2.4, d: 3.1, h: 0.2 },
      { type: 'box', x: 0, z: -0.25, w: 2.1, d: 3.2, h: 0.28 },
      { type: 'box', x: 2.45, z: 4.9, w: 2.55, d: 3.8, h: 0.2 }
    ],
    walls: [
      [-3.75, -6.75, -3.75, -3.25], [-1.15, -6.75, -1.15, -3.25], [-3.75, -6.75, -1.15, -6.75],
      [-1.18, -2.05, -1.18, 1.55], [1.18, -2.05, 1.18, 1.55],
      [1.05, 2.85, 1.05, 6.9], [3.85, 2.85, 3.85, 6.9], [1.05, 6.9, 3.85, 6.9]
    ],
    obstacles: [],
    zones: [
      { type: 'bouncePad', x: -1.05, z: -3.0, w: 0.9, d: 0.9, strength: 1.62 },
      { type: 'bouncePad', x: 0.95, z: 1.55, w: 0.9, d: 0.9, strength: 1.58 }
    ],
    movingObstacles: [],
    fallBounds: { x: 0, z: 0, w: 9.2, d: 17.4 },
    intro: { yaw: -0.67, distance: 15.9 }
  },
  {
    id: 22,
    packId: 'sky-marble',
    name: 'Royal Spiral',
    difficulty: 'challenge',
    par: 5,
    theme: 'sky',
    decor: 'spiral-ramp',
    railStyle: 'rounded-gold',
    flagStyle: 'royal-crown',
    tilePattern: 'spiral',
    platform: { x: 0, z: 0, w: 9.4, d: 17.4 },
    start: { x: -2.05, z: -6.2 },
    hole: { x: 1.8, z: 5.95 },
    playAreas: [
      { x: -1.95, z: -4.6, w: 2.2, d: 3.8, h: 0.1 },
      { x: 0.1, z: -1.15, w: 4.7, d: 2.1, h: 0.34 },
      { x: 1.75, z: 2.25, w: 2.1, d: 4.3, h: 0.62 },
      { x: 0.15, z: 5.25, w: 4.1, d: 2.2, h: 0.62 }
    ],
    heightZones: [
      { type: 'box', x: -1.95, z: -4.6, w: 2.2, d: 3.8, h: 0.1 },
      { type: 'ramp', x: -0.7, z: -2.75, w: 2.4, d: 2.4, from: -4.0, to: -1.55, startH: 0.1, endH: 0.34 },
      { type: 'box', x: 0.1, z: -1.15, w: 4.7, d: 2.1, h: 0.34 },
      { type: 'ramp', x: 1.25, z: 0.65, w: 2.2, d: 2.5, from: -0.55, to: 1.9, startH: 0.34, endH: 0.62 },
      { type: 'box', x: 1.75, z: 2.25, w: 2.1, d: 4.3, h: 0.62 },
      { type: 'box', x: 0.15, z: 5.25, w: 4.1, d: 2.2, h: 0.62 }
    ],
    walls: [
      [-3.15, -6.65, -3.15, -2.8], [-0.75, -6.65, -0.75, -2.45], [-3.15, -6.65, -0.75, -6.65],
      [-2.25, -2.2, 2.55, -2.2], [-2.25, 0.05, 2.55, 0.05],
      [0.55, 0.35, 0.55, 4.4], [2.95, 0.35, 2.95, 4.4],
      [-2.15, 4.1, 2.35, 4.1], [-2.15, 6.55, 2.35, 6.55]
    ],
    obstacles: [{ type: 'circle', x: 0.2, z: -1.1, r: 0.24, visual: 'gold-post' }],
    zones: [{ type: 'wind', x: 1.75, z: 2.3, w: 1.35, d: 1.55, direction: { x: -0.7, z: 1 }, strength: 0.5 }],
    movingObstacles: [],
    fallBounds: { x: 0, z: 0, w: 9.2, d: 17.2 },
    intro: { yaw: -0.92, distance: 16.2 }
  },
  {
    id: 23,
    packId: 'sky-marble',
    name: 'Cloudline Trickshot',
    difficulty: 'challenge',
    par: 5,
    theme: 'sky',
    decor: 'trickshot-pillars',
    railStyle: 'glass-gold',
    flagStyle: 'sky-banner',
    tilePattern: 'cloudline',
    platform: { x: 0, z: 0, w: 9.5, d: 17.5 },
    start: { x: -2.35, z: -6.25 },
    hole: { x: 2.4, z: 6.05 },
    playAreas: [
      { x: -2.35, z: -4.95, w: 2.45, d: 3.5, h: 0.2 },
      { x: -0.25, z: -0.95, w: 2.0, d: 3.2, h: 0.35 },
      { x: 1.65, z: 1.65, w: 1.7, d: 2.8, h: 0.35 },
      { x: 2.4, z: 5.0, w: 2.6, d: 3.7, h: 0.2 }
    ],
    heightZones: [
      { type: 'box', x: -2.35, z: -4.95, w: 2.45, d: 3.5, h: 0.2 },
      { type: 'box', x: -0.25, z: -0.95, w: 2.0, d: 3.2, h: 0.35 },
      { type: 'box', x: 1.65, z: 1.65, w: 1.7, d: 2.8, h: 0.35 },
      { type: 'box', x: 2.4, z: 5.0, w: 2.6, d: 3.7, h: 0.2 }
    ],
    walls: [
      [-3.72, -6.75, -3.72, -3.05], [-1.0, -6.75, -1.0, -3.05], [-3.72, -6.75, -1.0, -6.75],
      [-1.42, -2.65, -1.42, 0.8], [0.95, -2.65, 0.95, 0.8],
      [0.68, 0.05, 0.68, 3.25], [2.62, 0.05, 2.62, 3.25],
      [1.0, 3.0, 1.0, 6.85], [3.85, 3.0, 3.85, 6.85], [1.0, 6.85, 3.85, 6.85]
    ],
    obstacles: [
      { type: 'circle', x: -0.25, z: -0.9, r: 0.25, visual: 'gold-post' },
      { type: 'circle', x: 1.65, z: 1.65, r: 0.28, visual: 'gold-post' }
    ],
    zones: [
      { type: 'boost', x: -1.4, z: -2.55, w: 0.85, d: 0.7, direction: { x: 0.72, z: 1 }, strength: 1.52 },
      { type: 'wind', x: 0.65, z: 2.9, w: 1.25, d: 1.5, direction: { x: 0.85, z: 1 }, strength: 0.58 }
    ],
    movingObstacles: [{ id: 'cloudline-gate', type: 'slidingGate', x: 1.65, z: 1.65, w: 1.35, d: 0.2, axis: 'z', amplitude: 0.85, speed: 0.7, phase: 0.3 }],
    fallBounds: { x: 0, z: 0, w: 9.2, d: 17.3 },
    intro: { yaw: -0.8, distance: 16.0 }
  },
  {
    id: 24,
    packId: 'sky-marble',
    name: 'Final Sky Temple',
    difficulty: 'challenge',
    par: 5,
    theme: 'sky',
    decor: 'final-temple',
    railStyle: 'marble-gold',
    flagStyle: 'royal-crown',
    tilePattern: 'temple',
    platform: { x: 0, z: 0, w: 9.7, d: 17.8 },
    start: { x: 0, z: -6.55 },
    hole: { x: 0.25, z: 6.15 },
    playAreas: [
      { x: 0, z: -5.0, w: 3.2, d: 3.4, h: 0.16 },
      { x: -1.55, z: -0.8, w: 1.75, d: 5.0, h: 0.42 },
      { x: 1.45, z: -0.8, w: 1.75, d: 5.0, h: 0.42 },
      { x: 0.25, z: 4.6, w: 3.8, d: 4.4, h: 0.24 }
    ],
    heightZones: [
      { type: 'box', x: 0, z: -5.0, w: 3.2, d: 3.4, h: 0.16 },
      { type: 'ramp', x: -1.55, z: -3.0, w: 1.75, d: 2.0, from: -4.0, to: -2.0, startH: 0.16, endH: 0.42 },
      { type: 'ramp', x: 1.45, z: -3.0, w: 1.75, d: 2.0, from: -4.0, to: -2.0, startH: 0.16, endH: 0.42 },
      { type: 'box', x: -1.55, z: -0.8, w: 1.75, d: 5.0, h: 0.42 },
      { type: 'box', x: 1.45, z: -0.8, w: 1.75, d: 5.0, h: 0.42 },
      { type: 'ramp', x: 0.25, z: 2.25, w: 2.4, d: 2.6, from: 0.95, to: 3.55, startH: 0.42, endH: 0.24 },
      { type: 'box', x: 0.25, z: 4.6, w: 3.8, d: 4.4, h: 0.24 }
    ],
    walls: [
      [-1.75, -6.9, -1.75, -3.25], [1.75, -6.9, 1.75, -3.25], [-1.75, -6.9, 1.75, -6.9],
      [-2.62, -3.35, -2.62, 1.85], [-0.58, -3.35, -0.58, 1.85],
      [0.48, -3.35, 0.48, 1.85], [2.55, -3.35, 2.55, 1.85],
      [-1.85, 2.35, -1.85, 6.9], [2.35, 2.35, 2.35, 6.9], [-1.85, 6.9, 2.35, 6.9]
    ],
    obstacles: [
      { type: 'circle', x: 0.25, z: 3.65, r: 0.34, visual: 'gold-post' },
      { type: 'box', x: -0.1, z: 5.2, w: 1.2, d: 0.25, rotation: 0.18 }
    ],
    zones: [
      { type: 'bouncePad', x: -1.55, z: -2.0, w: 0.82, d: 0.82, strength: 1.5 },
      { type: 'wind', x: 1.45, z: 0.15, w: 1.15, d: 1.7, direction: { x: -0.7, z: 1 }, strength: 0.62 },
      { type: 'boost', x: 0.25, z: 2.35, w: 1.05, d: 0.74, direction: { x: 0, z: 1 }, strength: 1.42 }
    ],
    movingObstacles: [
      { id: 'temple-rotor', type: 'rotatingBar', x: 0.25, z: 3.65, w: 2.7, d: 0.2, speed: 0.55, phase: 0.4 },
      { id: 'temple-gate', type: 'slidingGate', x: 0.25, z: 5.25, w: 1.4, d: 0.22, axis: 'x', amplitude: 0.75, speed: 0.72, phase: 0.2 }
    ],
    fallBounds: { x: 0, z: 0, w: 9.4, d: 17.6 },
    intro: { yaw: -0.9, distance: 16.4 }
  }
];

export function getSurfaceHeight(level, x, z, platforms = []) {
  let height = 0;

  for (const zone of level.heightZones ?? []) {
    if (!pointInRect(x, z, zone)) continue;

    if (zone.type === 'box') {
      height = Math.max(height, zone.h);
    }

    if (zone.type === 'ramp') {
      const t = Math.min(1, Math.max(0, (z - zone.from) / (zone.to - zone.from)));
      height = Math.max(height, zone.startH + (zone.endH - zone.startH) * t);
    }
  }

  for (const platform of platforms) {
    if (pointInRotatedRect(x, z, platform)) {
      height = Math.max(height, platform.h ?? 0);
    }
  }

  return height;
}

export function pointInRect(x, z, rect, padding = 0) {
  return (
    x >= rect.x - rect.w / 2 - padding &&
    x <= rect.x + rect.w / 2 + padding &&
    z >= rect.z - rect.d / 2 - padding &&
    z <= rect.z + rect.d / 2 + padding
  );
}

export function pointInRotatedRect(x, z, rect, padding = 0) {
  const rotation = rect.rotation ?? 0;
  const cos = Math.cos(-rotation);
  const sin = Math.sin(-rotation);
  const dx = x - rect.x;
  const dz = z - rect.z;
  const localX = dx * cos - dz * sin;
  const localZ = dx * sin + dz * cos;
  return Math.abs(localX) <= rect.w / 2 + padding && Math.abs(localZ) <= rect.d / 2 + padding;
}

export function isPointOnCourse(level, x, z, padding = 0.28, platforms = []) {
  const inBaseArea = (level.playAreas ?? []).some((area) => pointInRect(x, z, area, padding));
  const onPlatform = platforms.some((platform) => platform.isPlatform && pointInRotatedRect(x, z, platform, padding));
  return inBaseArea || onPlatform;
}

export function isInsideFallBounds(level, x, z) {
  return pointInRect(x, z, level.fallBounds ?? level.platform, 0.9);
}
