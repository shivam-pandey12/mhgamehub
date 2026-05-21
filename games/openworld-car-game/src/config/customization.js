export const PAINT_OPTIONS = [
  { id: 'stock', name: 'Factory Paint', color: null, unlockLevel: 'rookie' },
  { id: 'pearl', name: 'Pearl White', color: '#f8f3ea', unlockLevel: 'rookie' },
  { id: 'sunburst', name: 'Sunburst Yellow', color: '#f4d35e', unlockLevel: 'rookie' },
  { id: 'canyon-red', name: 'Canyon Red', color: '#d94c45', unlockLevel: 'city' },
  { id: 'bay-blue', name: 'Bay Blue', color: '#3f88c5', unlockLevel: 'city' },
  { id: 'horizon-teal', name: 'Horizon Teal', color: '#1abc9c', unlockLevel: 'skilled' },
  { id: 'royal-violet', name: 'Royal Violet', color: '#5f4bb6', unlockLevel: 'pro' }
];

export const ACCENT_OPTIONS = [
  { id: 'stock', name: 'Factory Accent', color: null, unlockLevel: 'rookie' },
  { id: 'classic-gold', name: 'Classic Gold', color: '#caa76a', unlockLevel: 'rookie' },
  { id: 'graphite', name: 'Graphite', color: '#2f3640', unlockLevel: 'city' },
  { id: 'cream', name: 'Cream Stripe', color: '#fff7cf', unlockLevel: 'city' },
  { id: 'mint', name: 'Mint Detail', color: '#7fd8be', unlockLevel: 'skilled' }
];

export const WHEEL_OPTIONS = [
  { id: 'stock', name: 'Factory Wheels', unlockLevel: 'rookie' },
  { id: 'alloy', name: 'Bright Alloy', unlockLevel: 'city' },
  { id: 'sport', name: 'Sport Split-Spoke', unlockLevel: 'skilled' },
  { id: 'offroad', name: 'Rugged Tire', unlockLevel: 'skilled' },
  { id: 'classic', name: 'Chrome Classic', unlockLevel: 'pro' }
];

export const BOOST_TRAILS = [
  { id: 'clean-blue', name: 'Clean Blue', color: '#67d9ff', unlockLevel: 'rookie' },
  { id: 'sun-gold', name: 'Sun Gold', color: '#f3c65f', unlockLevel: 'city' },
  { id: 'soft-mint', name: 'Soft Mint', color: '#6ee7b7', unlockLevel: 'skilled' }
];

export const WINDOW_TINTS = [
  { id: 'stock', name: 'Factory Glass', opacity: 0.72, unlockLevel: 'rookie' },
  { id: 'light', name: 'Light Blue Tint', opacity: 0.64, unlockLevel: 'city' },
  { id: 'premium', name: 'Premium Smoke Tint', opacity: 0.52, unlockLevel: 'pro' }
];

export const DEFAULT_CUSTOMIZATION = {
  paint: 'stock',
  accent: 'stock',
  wheels: 'stock',
  boostTrail: 'clean-blue',
  tint: 'stock',
  plate: 'MCD-02'
};

export const CAR_ROLE_RECOMMENDATIONS = {
  hatchback: 'Best for first drives, parking, and calm route learning.',
  'sports-coupe': 'Best for drift zones and fast city time trials.',
  suv: 'Best for taxi comfort, stable delivery runs, and safe cruising.',
  supercar: 'Best for Highway Blast and S medal attempts.',
  'offroad-jeep': 'Best for Park Loop shortcuts and rough grass paths.',
  classic: 'Best for relaxed cruising, smooth taxi rides, and style runs.'
};

export const getOption = (options, id) => options.find((option) => option.id === id) ?? options[0];
