export const MASTERY_LEVELS = [
  { id: 'new', name: 'New', minXp: 0, nextReward: 'Factory familiarity' },
  { id: 'familiar', name: 'Familiar', minXp: 260, nextReward: 'Car-specific plate badge' },
  { id: 'skilled', name: 'Skilled', minXp: 760, nextReward: 'Extra tuning cap' },
  { id: 'expert', name: 'Expert', minXp: 1500, nextReward: 'Premium rim finish' },
  { id: 'mastered', name: 'Mastered', minXp: 2600, nextReward: 'Mastered local badge' }
];

export const MASTERY_XP = {
  distancePerMeter: 0.035,
  cleanDistancePerMeter: 0.02,
  driftPoint: 0.025,
  missionComplete: 150,
  medalS: 180,
  medalGold: 130,
  medalSilver: 80,
  parkingSuccess: 90,
  deliveryTaxiSuccess: 100
};

export const getMasteryForXp = (xp) => {
  let current = MASTERY_LEVELS[0];
  for (const level of MASTERY_LEVELS) {
    if (xp >= level.minXp) current = level;
  }
  const index = MASTERY_LEVELS.findIndex((level) => level.id === current.id);
  const next = MASTERY_LEVELS[index + 1] ?? null;
  return {
    ...current,
    index,
    next,
    progress: next ? Math.min(1, (xp - current.minXp) / (next.minXp - current.minXp)) : 1
  };
};
