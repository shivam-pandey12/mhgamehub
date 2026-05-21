export const LICENSE_LEVELS = [
  {
    id: 'rookie',
    name: 'Rookie Driver',
    minXp: 0,
    nextReward: 'City coin starter bonus'
  },
  {
    id: 'city',
    name: 'City Driver',
    minXp: 320,
    nextReward: 'Warm paint palette and clean boost trail'
  },
  {
    id: 'skilled',
    name: 'Skilled Driver',
    minXp: 820,
    nextReward: 'Sport accent colors and alloy wheel style'
  },
  {
    id: 'pro',
    name: 'Pro Driver',
    minXp: 1550,
    nextReward: 'Premium tint and Horizon stripe decals'
  },
  {
    id: 'horizon',
    name: 'Horizon Driver',
    minXp: 2600,
    nextReward: 'All Phase 4 local cosmetics unlocked'
  }
];

export const XP_REWARDS = {
  coin: 1,
  landmark: 45,
  district: 24,
  hiddenToken: 80,
  missionComplete: 120,
  timeTrialMedal: 110,
  driftScore: 0.04,
  cleanDrivingChunk: 8,
  achievement: 60
};

export const getLicenseForXp = (xp) => {
  let current = LICENSE_LEVELS[0];
  for (const level of LICENSE_LEVELS) {
    if (xp >= level.minXp) current = level;
  }
  const currentIndex = LICENSE_LEVELS.findIndex((level) => level.id === current.id);
  const next = LICENSE_LEVELS[currentIndex + 1] ?? null;
  return {
    ...current,
    index: currentIndex,
    next,
    progress: next ? Math.min(1, (xp - current.minXp) / (next.minXp - current.minXp)) : 1
  };
};
