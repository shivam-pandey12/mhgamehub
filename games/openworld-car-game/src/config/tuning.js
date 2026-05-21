export const TUNING_CATEGORIES = [
  { id: 'acceleration', label: 'Acceleration', stat: 'acceleration', physicsKey: 'acceleration', step: 0.055 },
  { id: 'topSpeed', label: 'Top Speed', stat: 'speed', physicsKey: 'maxSpeed', step: 0.045 },
  { id: 'braking', label: 'Braking', stat: 'braking', physicsKey: 'braking', step: 0.055 },
  { id: 'handling', label: 'Handling', stat: 'handling', physicsKey: 'steerRate', step: 0.04 },
  { id: 'driftGrip', label: 'Drift Grip', stat: 'drift', physicsKey: 'driftGrip', step: -0.045 },
  { id: 'offRoadGrip', label: 'Off-Road', stat: 'offRoad', physicsKey: 'offRoadGrip', step: 0.045 },
  { id: 'stability', label: 'Stability', stat: 'stability', physicsKey: 'grip', step: 0.035 }
];

export const BASE_TUNING_COST = 80;

export const CAR_TUNING_CAPS = {
  hatchback: { acceleration: 4, topSpeed: 3, braking: 4, handling: 5, driftGrip: 3, offRoadGrip: 3, stability: 5 },
  'sports-coupe': { acceleration: 5, topSpeed: 5, braking: 3, handling: 4, driftGrip: 5, offRoadGrip: 2, stability: 3 },
  suv: { acceleration: 3, topSpeed: 3, braking: 5, handling: 3, driftGrip: 2, offRoadGrip: 4, stability: 5 },
  supercar: { acceleration: 5, topSpeed: 6, braking: 4, handling: 4, driftGrip: 4, offRoadGrip: 1, stability: 3 },
  'offroad-jeep': { acceleration: 3, topSpeed: 2, braking: 4, handling: 3, driftGrip: 3, offRoadGrip: 6, stability: 5 },
  classic: { acceleration: 3, topSpeed: 3, braking: 3, handling: 3, driftGrip: 4, offRoadGrip: 2, stability: 5 }
};

export const createDefaultTuning = () => Object.fromEntries(TUNING_CATEGORIES.map((category) => [category.id, 0]));

export const getUpgradeCost = (currentLevel) => BASE_TUNING_COST + currentLevel * 55;
