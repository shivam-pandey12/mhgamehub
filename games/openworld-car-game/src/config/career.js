export const CAREER_PATHS = [
  {
    id: 'city-driver',
    name: 'City Driver Path',
    description: 'Relaxed local driving, deliveries, taxi comfort, parking, and city discovery.',
    missions: [
      {
        id: 'career-first-city-ride',
        title: 'First City Ride',
        missionId: 'downtown-dash',
        required: null,
        rewardCoins: 80,
        rewardXp: 100
      },
      {
        id: 'career-parkside-delivery',
        title: 'Parkside Delivery',
        missionId: 'standard-parcel',
        required: 'career-first-city-ride',
        rewardCoins: 100,
        rewardXp: 120
      },
      {
        id: 'career-smooth-taxi',
        title: 'Smooth Taxi Pickup',
        missionId: 'residential-taxi',
        required: 'career-parkside-delivery',
        rewardCoins: 115,
        rewardXp: 135
      },
      {
        id: 'career-market-parking',
        title: 'Market Parking Test',
        missionId: 'tight-market-parking',
        required: 'career-smooth-taxi',
        rewardCoins: 130,
        rewardXp: 150
      }
    ]
  },
  {
    id: 'pro-driver',
    name: 'Pro Driver Path',
    description: 'Skill routes, drift control, clean speed, and hill handling.',
    missions: [
      {
        id: 'career-downtown-dash',
        title: 'Downtown Dash',
        missionId: 'downtown-dash',
        required: null,
        rewardCoins: 90,
        rewardXp: 115
      },
      {
        id: 'career-park-drift',
        title: 'Park Drift Trial',
        missionId: 'park-loop-drift',
        required: 'career-downtown-dash',
        rewardCoins: 120,
        rewardXp: 145
      },
      {
        id: 'career-highway-speed',
        title: 'Highway Speed Run',
        missionId: 'highway-blast',
        required: 'career-park-drift',
        rewardCoins: 140,
        rewardXp: 160
      },
      {
        id: 'career-hill-view',
        title: 'Hill View Sprint',
        missionId: 'hill-climb-sprint',
        required: 'career-highway-speed',
        rewardCoins: 160,
        rewardXp: 180
      }
    ]
  }
];

export const CAREER_MISSION_LOOKUP = Object.fromEntries(
  CAREER_PATHS.flatMap((path) => path.missions.map((mission) => [mission.id, { ...mission, pathId: path.id }]))
);
