export const MEDALS = [
  { medal: 'S', color: '#7fd8be' },
  { medal: 'Gold', color: '#f3c65f' },
  { medal: 'Silver', color: '#c9d0d8' },
  { medal: 'Bronze', color: '#c48a55' }
];

export const TIME_TRIAL_ROUTES = [
  {
    id: 'downtown-dash',
    type: 'timeTrial',
    name: 'Downtown Dash',
    description: 'A clean sprint through the Downtown Core intersections.',
    recommendedCar: 'Starter Hatchback',
    reward: 130,
    xp: 145,
    start: { position: [0, 0, 26], heading: Math.PI },
    checkpoints: [[0, -42], [44, -42], [44, 42], [0, 42], [-44, 42], [-44, 0], [0, 16]],
    medalTimes: { S: 42, Gold: 50, Silver: 62, Bronze: 78 }
  },
  {
    id: 'highway-blast',
    type: 'timeTrial',
    name: 'Highway Blast',
    description: 'Fast highway markers built for Supercar and Sports Coupe.',
    recommendedCar: 'Supercar',
    reward: 155,
    xp: 160,
    start: { position: [330, 0, -172], heading: -Math.PI * 0.95 },
    checkpoints: [[282, -142], [212, -106], [132, -78], [72, -62], [0, -128], [-185, -272], [-292, -326], [-360, -404]],
    medalTimes: { S: 54, Gold: 68, Silver: 84, Bronze: 108 }
  },
  {
    id: 'park-loop-run',
    type: 'timeTrial',
    name: 'Park Loop Run',
    description: 'Curved park roads with one soft shortcut.',
    recommendedCar: 'Off-Road Jeep',
    reward: 140,
    xp: 150,
    start: { position: [-40, 0, 26], heading: -Math.PI * 0.5 },
    checkpoints: [[-72, 24], [-96, 52], [-65, 62], [-38, 26], [-92, 36]],
    medalTimes: { S: 38, Gold: 48, Silver: 61, Bronze: 78 }
  },
  {
    id: 'hill-climb-sprint',
    type: 'timeTrial',
    name: 'Hill Climb Sprint',
    description: 'A handling run up to the scenic viewpoint.',
    recommendedCar: 'Sports Coupe',
    reward: 165,
    xp: 175,
    start: { position: [58, 0, 92], heading: Math.PI * 0.28 },
    checkpoints: [[72, 104], [94, 120], [118, 132], [132, 136]],
    medalTimes: { S: 32, Gold: 40, Silver: 52, Bronze: 68 }
  },
  {
    id: 'airport-express-sprint',
    type: 'timeTrial',
    name: 'Airport Express Sprint',
    description: 'A longer expressway run from Downtown Core to Horizon Airport.',
    recommendedCar: 'Supercar',
    reward: 190,
    xp: 210,
    start: { position: [0, 0, -48], heading: Math.PI },
    checkpoints: [[0, -86], [-28, -162], [-92, -214], [-185, -272], [-292, -326], [-344, -366], [-360, -404], [-360, -350]],
    medalTimes: { S: 62, Gold: 76, Silver: 94, Bronze: 118 }
  },
  {
    id: 'bridge-ring-run',
    type: 'timeTrial',
    name: 'Bridge Ring Run',
    description: 'A high-speed loop across the bridge corridor and highway ring.',
    recommendedCar: 'Sports Coupe',
    reward: 205,
    xp: 225,
    start: { position: [-390, 0, -172], heading: Math.PI * 0.5 },
    checkpoints: [[-330, -172], [-245, -172], [-48, -172], [140, -172], [330, -172], [430, -238], [430, -346], [240, -420], [0, -420], [-240, -420], [-430, -360], [-390, -172]],
    medalTimes: { S: 104, Gold: 124, Silver: 150, Bronze: 184 }
  },
  {
    id: 'grand-city-cruise',
    type: 'timeTrial',
    name: 'Grand City Cruise',
    description: 'A scenic city-wide cruise linking park, market, residential, and downtown roads.',
    recommendedCar: 'Classic Car',
    reward: 175,
    xp: 190,
    start: { position: [-122, 0, 34], heading: -Math.PI * 0.5 },
    checkpoints: [[-206, 34], [-146, 106], [-58, 182], [30, 112], [184, 74], [108, 144], [0, 62], [-62, 0], [-122, 34]],
    medalTimes: { S: 88, Gold: 106, Silver: 132, Bronze: 162 }
  },
  {
    id: 'scenic-hill-switchback',
    type: 'timeTrial',
    name: 'Scenic Hill Switchback',
    description: 'A longer handling run up the expanded viewpoint road.',
    recommendedCar: 'Sports Coupe',
    reward: 180,
    xp: 205,
    start: { position: [108, 0, 144], heading: 0.52 },
    checkpoints: [[150, 194], [202, 230], [170, 258], [130, 210], [184, 132]],
    medalTimes: { S: 45, Gold: 56, Silver: 72, Bronze: 92 }
  }
];

export const DRIFT_ZONES = [
  {
    id: 'park-loop-drift',
    type: 'drift',
    name: 'Park Loop Drift',
    description: 'Hold clean angle through the park curve.',
    recommendedCar: 'Sports Coupe',
    reward: 120,
    xp: 140,
    start: { position: [-40, 0, 26], heading: -Math.PI * 0.5 },
    zone: { center: [-78, 44], size: [56, 34], rotation: -0.45 },
    timer: 55,
    targetScore: 1600
  },
  {
    id: 'downtown-corner-drift',
    type: 'drift',
    name: 'Downtown Corner Drift',
    description: 'Link the central junction without clipping traffic.',
    recommendedCar: 'Classic Car',
    reward: 130,
    xp: 145,
    start: { position: [-44, 0, -20], heading: 0 },
    zone: { center: [0, 0], size: [74, 74], rotation: 0 },
    timer: 50,
    targetScore: 1450
  }
];

export const TAXI_RIDES = [
  {
    id: 'residential-taxi',
    type: 'taxi',
    name: 'Residential Ride',
    description: 'A smooth passenger ride from the square to City Hall.',
    recommendedCar: 'Classic Car',
    reward: 125,
    xp: 145,
    start: { position: [88, 0, 58], heading: -Math.PI * 0.5 },
    timer: 105,
    pickup: [88, 58],
    destination: [24, 72],
    comfortLoss: 14,
    messages: ['Please drive safely.', 'Nice smooth turn.', 'Careful!', 'We are almost there.']
  },
  {
    id: 'market-taxi',
    type: 'taxi',
    name: 'Market Pickup',
    description: 'Pick up near Market Gate and reach the Park Loop calmly.',
    recommendedCar: 'SUV',
    reward: 135,
    xp: 150,
    start: { position: [-66, 0, 82], heading: Math.PI * 0.5 },
    timer: 100,
    pickup: [-66, 82],
    destination: [-78, 44],
    comfortLoss: 16,
    messages: ['Please avoid the market vans.', 'That was smooth.', 'Careful!', 'Almost there.']
  },
  {
    id: 'residential-airport-taxi',
    type: 'taxi',
    name: 'Residential Airport Taxi',
    description: 'A smooth longer ride from the local square to Horizon Airport Terminal.',
    recommendedCar: 'Classic Car',
    reward: 170,
    xp: 195,
    start: { position: [184, 0, 74], heading: -Math.PI * 0.5 },
    timer: 165,
    pickup: [184, 74],
    destination: [-360, -350],
    comfortLoss: 15,
    messages: ['Airport terminal, please.', 'Smooth highway merge.', 'Careful near the bridge.', 'We are nearly at departures.']
  }
];

export const DELIVERY_RUNS = [
  {
    id: 'standard-parcel',
    type: 'delivery',
    name: 'Standard Parcel',
    description: 'Normal route, normal condition loss.',
    recommendedCar: 'Starter Hatchback',
    reward: 120,
    xp: 130,
    start: { position: [-42, 0, -4], heading: Math.PI * 0.5 },
    timer: 105,
    pickup: [-66, 82],
    destination: [92, 58],
    crashDamage: 13,
    roughDamagePerSecond: 1.1,
    accelerationMultiplier: 1
  },
  {
    id: 'fragile-box',
    type: 'delivery',
    name: 'Fragile Box',
    description: 'Higher reward, collision-sensitive cargo.',
    recommendedCar: 'SUV',
    reward: 150,
    xp: 155,
    start: { position: [-66, 0, 82], heading: Math.PI * 0.5 },
    timer: 110,
    pickup: [-66, 82],
    destination: [24, 72],
    crashDamage: 22,
    roughDamagePerSecond: 1.4,
    accelerationMultiplier: 1
  },
  {
    id: 'express-food',
    type: 'delivery',
    name: 'Express Food',
    description: 'Stricter timer, higher speed bonus.',
    recommendedCar: 'Sports Coupe',
    reward: 145,
    xp: 150,
    start: { position: [-30, 0, 82], heading: Math.PI * 0.5 },
    timer: 78,
    pickup: [-30, 82],
    destination: [120, 56],
    crashDamage: 14,
    roughDamagePerSecond: 1.0,
    accelerationMultiplier: 1
  },
  {
    id: 'heavy-cargo',
    type: 'delivery',
    name: 'Heavy Cargo',
    description: 'Heavier load with reduced acceleration.',
    recommendedCar: 'Off-Road Jeep',
    reward: 155,
    xp: 160,
    start: { position: [64, 0, 30], heading: Math.PI * 0.2 },
    timer: 120,
    pickup: [64, 30],
    destination: [124, 132],
    crashDamage: 15,
    roughDamagePerSecond: 0.8,
    accelerationMultiplier: 0.82
  },
  {
    id: 'industrial-cargo-route',
    type: 'delivery',
    name: 'Industrial Cargo Route',
    description: 'Move heavier cargo from the logistics depot to the airport service road.',
    recommendedCar: 'Off-Road Jeep',
    reward: 185,
    xp: 205,
    start: { position: [360, 0, -370], heading: Math.PI * 0.5 },
    timer: 150,
    pickup: [360, -330],
    destination: [-274, -360],
    crashDamage: 16,
    roughDamagePerSecond: 0.75,
    accelerationMultiplier: 0.78
  },
  {
    id: 'market-delivery-chain',
    type: 'delivery',
    name: 'Market Delivery Chain',
    description: 'A denser route from Market Street through Downtown to Residential Square.',
    recommendedCar: 'Starter Hatchback',
    reward: 165,
    xp: 180,
    start: { position: [-134, 0, 182], heading: Math.PI * 0.5 },
    timer: 132,
    pickup: [-134, 182],
    destination: [184, 74],
    crashDamage: 14,
    roughDamagePerSecond: 1.0,
    accelerationMultiplier: 1
  }
];

export const PARKING_CHALLENGES = [
  {
    id: 'basic-parking',
    type: 'parking',
    name: 'Basic Parking',
    description: 'A fair first parking space in Residential Zone.',
    recommendedCar: 'Starter Hatchback',
    reward: 95,
    xp: 115,
    start: { position: [42, 0, -18], heading: -Math.PI * 0.5 },
    timer: 95,
    zone: { center: [112, 58], size: [8, 13], rotation: Math.PI * 0.5, holdTime: 2.5 }
  },
  {
    id: 'reverse-parking',
    type: 'parking',
    name: 'Reverse Parking',
    description: 'Line up gently and back into the marked slot.',
    recommendedCar: 'Classic Car',
    reward: 110,
    xp: 130,
    start: { position: [88, 0, 22], heading: 0 },
    timer: 100,
    zone: { center: [72, 44], size: [8, 13], rotation: Math.PI, holdTime: 2.8 }
  },
  {
    id: 'tight-market-parking',
    type: 'parking',
    name: 'Tight Market Parking',
    description: 'A careful slot between market barriers.',
    recommendedCar: 'Starter Hatchback',
    reward: 120,
    xp: 140,
    start: { position: [-78, 0, 82], heading: Math.PI * 0.5 },
    timer: 105,
    zone: { center: [-8, 92], size: [7, 12], rotation: Math.PI * 0.5, holdTime: 3.0 }
  },
  {
    id: 'hill-parking',
    type: 'parking',
    name: 'Hill Parking',
    description: 'Stop precisely near the viewpoint guardrail.',
    recommendedCar: 'SUV',
    reward: 130,
    xp: 145,
    start: { position: [92, 0, 116], heading: Math.PI * 0.5 },
    timer: 95,
    zone: { center: [128, 138], size: [8, 13], rotation: 0.2, holdTime: 2.8 }
  },
  {
    id: 'precision-stop',
    type: 'parking',
    name: 'Precision Stop',
    description: 'A short challenge focused on final speed and center accuracy.',
    recommendedCar: 'SUV',
    reward: 115,
    xp: 135,
    start: { position: [44, 0, 42], heading: -Math.PI * 0.5 },
    timer: 70,
    zone: { center: [0, 42], size: [7, 10], rotation: Math.PI * 0.5, holdTime: 2.2 }
  },
  {
    id: 'airport-parking',
    type: 'parking',
    name: 'Airport Parking',
    description: 'Park cleanly in the airport drop-off bay near the terminal.',
    recommendedCar: 'SUV',
    reward: 145,
    xp: 165,
    start: { position: [-360, 0, -404], heading: 0 },
    timer: 115,
    zone: { center: [-320, -324], size: [9, 15], rotation: Math.PI * 0.5, holdTime: 2.8 }
  }
];

export const MISSION_CATALOG = [
  ...TIME_TRIAL_ROUTES,
  ...DRIFT_ZONES,
  ...TAXI_RIDES,
  ...DELIVERY_RUNS,
  ...PARKING_CHALLENGES
];

export const MISSION_CONFIGS = {
  freeDrive: {
    id: 'freeDrive',
    type: 'freeDrive',
    name: 'Free Drive',
    description: 'Explore the city, collect coins, discover landmarks, and enjoy the road.',
    reward: 0
  },
  checkpoint: TIME_TRIAL_ROUTES[0],
  delivery: DELIVERY_RUNS[0],
  parking: PARKING_CHALLENGES[0],
  drift: DRIFT_ZONES[0],
  taxi: TAXI_RIDES[0],
  timeTrial: TIME_TRIAL_ROUTES[0]
};

export const RANKS = [
  { rank: 'S', min: 900 },
  { rank: 'A', min: 700 },
  { rank: 'B', min: 480 },
  { rank: 'C', min: 0 }
];

export const getMissionById = (id) => (
  id === 'freeDrive' ? MISSION_CONFIGS.freeDrive : MISSION_CATALOG.find((mission) => mission.id === id)
);

export const getRankForScore = (score) => RANKS.find((rank) => score >= rank.min)?.rank ?? 'C';

export const getMedalForTime = (route, seconds) => {
  if (!route?.medalTimes) return null;
  if (seconds <= route.medalTimes.S) return 'S';
  if (seconds <= route.medalTimes.Gold) return 'Gold';
  if (seconds <= route.medalTimes.Silver) return 'Silver';
  if (seconds <= route.medalTimes.Bronze) return 'Bronze';
  return null;
};
