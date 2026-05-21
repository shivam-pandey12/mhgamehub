export const CITY_EVENTS = [
  {
    id: 'morning-traffic',
    name: 'Morning Traffic Flow',
    description: 'Downtown and Market traffic feel busier for a short cruise.',
    duration: 110,
    rewardCoins: 30,
    rewardXp: 45
  },
  {
    id: 'park-cruise',
    name: 'Park Cruise Bonus',
    description: 'Smooth Park Loop driving earns a gentle XP bonus.',
    duration: 120,
    rewardCoins: 35,
    rewardXp: 55
  },
  {
    id: 'highway-speed',
    name: 'Expressway Speed Window',
    description: 'Clean high-speed highway ring driving gives extra mastery.',
    duration: 90,
    rewardCoins: 40,
    rewardXp: 65
  },
  {
    id: 'market-rush',
    name: 'Market Delivery Rush',
    description: 'Delivery rewards get a local bonus while the rush is active.',
    duration: 120,
    rewardCoins: 35,
    rewardXp: 50
  },
  {
    id: 'hill-view',
    name: 'Hill View Challenge',
    description: 'Reach the viewpoint road cleanly for a scenic reward.',
    duration: 110,
    rewardCoins: 45,
    rewardXp: 70
  },
  {
    id: 'airport-cruise',
    name: 'Airport Arrival Flow',
    description: 'Smooth driving around the terminal and service roads earns a local bonus.',
    duration: 120,
    rewardCoins: 45,
    rewardXp: 70
  },
  {
    id: 'industrial-shift',
    name: 'Industrial Logistics Shift',
    description: 'Cruise the depot roads cleanly while cargo traffic is active.',
    duration: 120,
    rewardCoins: 45,
    rewardXp: 68
  },
  {
    id: 'clean-streak',
    name: 'Clean Driving Streak',
    description: 'Drive without collisions and bank a clean-skill bonus.',
    duration: 100,
    rewardCoins: 45,
    rewardXp: 70
  }
];

export const FREE_DRIVE_TASKS = [
  { id: 'reach-park-fountain', label: 'Reach the Grand Park Fountain', target: [-190, 66], coins: 28, xp: 38, masteryXp: 50 },
  { id: 'reach-airport', label: 'Discover Horizon Airport Terminal', target: [-360, -350], coins: 45, xp: 70, masteryXp: 80 },
  { id: 'cross-bridge', label: 'Cross the Expressway Bridge', target: [0, -172], coins: 38, xp: 56, masteryXp: 70 },
  { id: 'reach-industrial', label: 'Reach Industrial Depot', target: [360, -330], coins: 38, xp: 58, masteryXp: 70 },
  { id: 'clean-900', label: 'Drive 900m without a crash', cleanDistance: 900, coins: 55, xp: 75, masteryXp: 95 },
  { id: 'highway-170', label: 'Hit 170 km/h on the Expressway', zone: 'Highway Ring / Expressway System', speedKmh: 170, coins: 45, xp: 65, masteryXp: 80 },
  { id: 'collect-10', label: 'Collect 10 city coins', coinCount: 10, coins: 40, xp: 55, masteryXp: 70 },
  { id: 'drift-5', label: 'Drift for 5 seconds', driftSeconds: 5, coins: 35, xp: 50, masteryXp: 70 }
];
