export const COSMETIC_TYPES = {
  BALL: 'ball',
  TRAIL: 'trail',
  FLAG: 'flag',
  AIM: 'aim',
  CUP: 'cup'
};

export const DEFAULT_COSMETICS = {
  [COSMETIC_TYPES.BALL]: 'classic-ivory',
  [COSMETIC_TYPES.TRAIL]: 'minimal-line',
  [COSMETIC_TYPES.FLAG]: 'classic-gold',
  [COSMETIC_TYPES.AIM]: 'classic-gold',
  [COSMETIC_TYPES.CUP]: 'golden-burst'
};

export const COSMETICS = {
  [COSMETIC_TYPES.BALL]: [
    { id: 'classic-ivory', name: 'Classic Ivory', color: 0xfffcf2, requirement: 'Default' },
    { id: 'golden-pearl', name: 'Golden Pearl', color: 0xf7d98b, requirement: 'Collect 10 stars', needs: { stars: 10 } },
    { id: 'marble-white', name: 'Marble White', color: 0xf4f1ea, requirement: 'Collect 25 stars', needs: { stars: 25 } },
    { id: 'royal-green', name: 'Royal Green', color: 0x2f6f50, requirement: 'Complete any Sky Marble level', needs: { levelMin: 13 } },
    { id: 'sky-blue', name: 'Sky Blue', color: 0x9fd9ff, requirement: 'Complete Sky Marble Level 6', needs: { levelId: 18 } },
    { id: 'midnight-black', name: 'Midnight Black', color: 0x151820, requirement: 'Beat Hard Bot', needs: { achievement: 'beat-hard-bot' } }
  ],
  [COSMETIC_TYPES.TRAIL]: [
    { id: 'minimal-line', name: 'Minimal Line', color: 0xffefbe, requirement: 'Default' },
    { id: 'soft-sparkle', name: 'Soft Sparkle', color: 0xffffff, requirement: 'First hole-in-one', needs: { achievement: 'first-ace' } },
    { id: 'golden-dust', name: 'Golden Dust', color: 0xf3c86a, requirement: 'Collect 10 stars', needs: { stars: 10 } },
    { id: 'cloud-mist', name: 'Cloud Mist', color: 0xccefff, requirement: 'Complete Sky Marble Level 6', needs: { levelId: 18 } }
  ],
  [COSMETIC_TYPES.FLAG]: [
    { id: 'classic-gold', name: 'Classic Gold', color: 0xfff2bf, requirement: 'Default' },
    { id: 'sky-banner', name: 'Sky Banner', color: 0xc9f0ff, requirement: 'Complete any Sky Marble level', needs: { levelMin: 13 } },
    { id: 'royal-crown', name: 'Royal Crown', color: 0xf0c45a, requirement: 'Collect 25 stars', needs: { stars: 25 } }
  ],
  [COSMETIC_TYPES.AIM]: [
    { id: 'classic-gold', name: 'Classic Gold', color: 0xf8d886, requirement: 'Default' },
    { id: 'emerald-read', name: 'Emerald Read', color: 0x82d9a6, requirement: 'Complete a challenge', needs: { challengeCount: 1 } },
    { id: 'cloud-thread', name: 'Cloud Thread', color: 0xdaf7ff, requirement: 'Complete Sky Marble Level 3', needs: { levelId: 15 } }
  ],
  [COSMETIC_TYPES.CUP]: [
    { id: 'golden-burst', name: 'Golden Burst', color: 0xfff1b5, requirement: 'Default' },
    { id: 'cloud-bloom', name: 'Cloud Bloom', color: 0xccefff, requirement: 'Complete Sky Marble Level 6', needs: { levelId: 18 } },
    { id: 'royal-halo', name: 'Royal Halo', color: 0xffd777, requirement: 'First hole-in-one', needs: { achievement: 'first-ace' } }
  ]
};

export function getCosmetic(type, id) {
  return COSMETICS[type]?.find((item) => item.id === id) ?? COSMETICS[type]?.[0] ?? null;
}

export function isCosmeticUnlocked(item, context = {}) {
  if (!item?.needs) return true;
  const { stars = 0, scores = {}, achievements = {}, challengesCompleted = 0 } = context;
  if (item.needs.stars && stars < item.needs.stars) return false;
  if (item.needs.achievement && !achievements[item.needs.achievement]) return false;
  if (item.needs.challengeCount && challengesCompleted < item.needs.challengeCount) return false;
  if (item.needs.levelId && !scores[String(item.needs.levelId)]) return false;
  if (item.needs.levelMin) {
    const completed = Object.keys(scores).some((levelId) => Number(levelId) >= item.needs.levelMin);
    if (!completed) return false;
  }
  return true;
}

export function cosmeticUnlockContext(save) {
  const scores = save.bestScores ?? {};
  const stars = Object.values(scores).reduce((sum, score) => sum + (score?.stars ?? 0), 0);
  return {
    scores,
    stars,
    achievements: save.achievements?.unlocked ?? {},
    challengesCompleted: Object.keys(save.challenges?.completed ?? {}).length
  };
}

export function normalizeEquippedCosmetics(equipped = {}) {
  return {
    ...DEFAULT_COSMETICS,
    ...Object.fromEntries(Object.entries(equipped).filter(([type, id]) => getCosmetic(type, id)))
  };
}
