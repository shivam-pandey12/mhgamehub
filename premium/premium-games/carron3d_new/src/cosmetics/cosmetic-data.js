export const COSMETIC_CATEGORIES = [
  {
    id: 'board',
    loadoutKey: 'boardSkin',
    label: 'Board',
    description: 'Surface, frame, trim, pockets, and markings.'
  },
  {
    id: 'coins',
    loadoutKey: 'coinSet',
    label: 'Coins',
    description: 'White coins, black coins, queen, and rim detail.'
  },
  {
    id: 'striker',
    loadoutKey: 'strikerSkin',
    label: 'Striker',
    description: 'Striker body, rings, and control glow.'
  },
  {
    id: 'table',
    loadoutKey: 'tableEnvironment',
    label: 'Table',
    description: 'Floor, lounge mood, fog, and lighting tint.'
  },
  {
    id: 'vfx',
    loadoutKey: 'vfxPreset',
    label: 'VFX',
    description: 'Feedback colors and effect intensity.'
  }
];

export const COSMETIC_STATUS_LABELS = {
  available: 'Available',
  locked: 'Locked',
  comingSoon: 'Coming Soon'
};

export const COSMETIC_RARITY_LABELS = {
  default: 'Default',
  common: 'Common',
  rare: 'Rare',
  royale: 'Royale'
};

export const COSMETIC_ITEMS = [
  {
    id: 'board-ivory-royale',
    category: 'board',
    name: 'Ivory Royale',
    description: 'White ivory surface, warm gold trims, and premium lounge readability.',
    rarity: 'default',
    status: 'available',
    previewLabel: 'Default board',
    themeTokens: {
      scene: {
        boardSurface: '#f6ecd8',
        boardSurfaceAccent: '#fff9ee',
        outerFrame: '#b8894a',
        frameSide: '#84602d',
        goldTrim: '#d5ad67',
        pocketDark: '#1e1813',
        pocketRim: '#b98945',
        markingLine: '#8f662d',
        shadow: '#6a4318'
      }
    }
  },
  {
    id: 'board-tournament-wood',
    category: 'board',
    name: 'Tournament Wood',
    description: 'Warm wooden playfield with dark rails and grounded tournament contrast.',
    rarity: 'common',
    status: 'available',
    previewLabel: 'Warm wood',
    themeTokens: {
      scene: {
        boardSurface: '#c99458',
        boardSurfaceAccent: '#e4b87b',
        outerFrame: '#6c3f21',
        frameSide: '#3f2416',
        goldTrim: '#d7a65e',
        pocketDark: '#160e09',
        pocketRim: '#7f4c25',
        markingLine: '#4d2b17',
        shadow: '#3d2314'
      }
    }
  },
  {
    id: 'board-midnight-gold',
    category: 'board',
    name: 'Midnight Gold',
    description: 'Dark luxury surface with crisp gold markings and pocket rims.',
    rarity: 'rare',
    status: 'available',
    previewLabel: 'Dark gold table',
    themeTokens: {
      scene: {
        boardSurface: '#222936',
        boardSurfaceAccent: '#303948',
        outerFrame: '#8b642d',
        frameSide: '#080b10',
        goldTrim: '#dfb765',
        pocketDark: '#02050a',
        pocketRim: '#d9aa56',
        markingLine: '#f0d08b',
        shadow: '#030509'
      }
    }
  },
  {
    id: 'board-royal-walnut',
    category: 'board',
    name: 'Royal Walnut',
    description: 'Deep walnut frame with cream surface and subdued royal trim.',
    rarity: 'rare',
    status: 'available',
    previewLabel: 'Unlocked for testing',
    entitlementKey: 'carrom.skin.boardRoyalWalnut',
    themeTokens: {
      scene: {
        boardSurface: '#ead9b8',
        outerFrame: '#59331d',
        frameSide: '#2c1a12',
        goldTrim: '#c99b55',
        pocketDark: '#120b08',
        pocketRim: '#6d4224',
        markingLine: '#694321'
      }
    }
  },
  {
    id: 'board-marble-palace',
    category: 'board',
    name: 'Marble Palace',
    description: 'Bright marble-inspired surface with soft gold detail.',
    rarity: 'royale',
    status: 'available',
    previewLabel: 'Unlocked for testing',
    entitlementKey: 'carrom.skin.boardMarblePalace',
    themeTokens: {
      scene: {
        boardSurface: '#f9f5ec',
        outerFrame: '#d8bd82',
        frameSide: '#b18b55',
        goldTrim: '#e7c77d',
        pocketRim: '#d2a75e',
        markingLine: '#9c733d'
      }
    }
  },
  {
    id: 'coins-classic-carrom',
    category: 'coins',
    name: 'Classic Carrom',
    description: 'Readable matte white, black, and red coin set.',
    rarity: 'default',
    status: 'available',
    previewLabel: 'Default coins',
    themeTokens: {
      scene: {
        whiteCoin: '#fff6e7',
        whiteCoinRim: '#c79b55',
        blackCoin: '#2f2925',
        blackCoinRim: '#b78a46',
        queen: '#a53a2d',
        queenRim: '#e3bd73'
      }
    }
  },
  {
    id: 'coins-ivory-edge',
    category: 'coins',
    name: 'Ivory Edge',
    description: 'Ivory and dark walnut coins with fine gold rims.',
    rarity: 'common',
    status: 'available',
    previewLabel: 'Gold edged',
    themeTokens: {
      scene: {
        whiteCoin: '#fffaf0',
        whiteCoinRim: '#dfb96b',
        blackCoin: '#3a251a',
        blackCoinRim: '#d6a85a',
        queen: '#b54534',
        queenRim: '#f0ca79'
      }
    }
  },
  {
    id: 'coins-tournament-matte',
    category: 'coins',
    name: 'Tournament Matte',
    description: 'Simple, low-glare coins built for fast reading.',
    rarity: 'common',
    status: 'available',
    previewLabel: 'Matte readable',
    themeTokens: {
      scene: {
        whiteCoin: '#f1eadb',
        whiteCoinRim: '#8f795c',
        blackCoin: '#1c1b19',
        blackCoinRim: '#7f6a4e',
        queen: '#9f3027',
        queenRim: '#bc8d4f'
      }
    }
  },
  {
    id: 'coins-midnight',
    category: 'coins',
    name: 'Midnight Coins',
    description: 'Dark luxury coins with luminous gold accents.',
    rarity: 'rare',
    status: 'available',
    previewLabel: 'Unlocked for testing',
    entitlementKey: 'carrom.skin.coinsMidnight',
    themeTokens: {
      scene: {
        whiteCoin: '#e8deca',
        whiteCoinRim: '#f0cc7b',
        blackCoin: '#07090e',
        blackCoinRim: '#d6a857',
        queen: '#c6493b',
        queenRim: '#f2d18c'
      }
    }
  },
  {
    id: 'coins-royal-queen-set',
    category: 'coins',
    name: 'Royal Queen Set',
    description: 'A stronger red and gold queen treatment for royal finishes.',
    rarity: 'royale',
    status: 'available',
    previewLabel: 'Unlocked for testing',
    entitlementKey: 'carrom.skin.coinsRoyalQueen',
    themeTokens: {
      scene: {
        queen: '#d84634',
        queenRim: '#ffd58a',
        whiteCoinRim: '#dfb86e',
        blackCoinRim: '#d7a75f'
      }
    }
  },
  {
    id: 'striker-ivory',
    category: 'striker',
    name: 'Ivory Striker',
    description: 'Clean ivory striker with warm gold control glow.',
    rarity: 'default',
    status: 'available',
    previewLabel: 'Default striker',
    themeTokens: {
      scene: {
        striker: '#fff4da',
        strikerGlow: '#f1c06f'
      }
    }
  },
  {
    id: 'striker-gold-ring',
    category: 'striker',
    name: 'Gold Ring Striker',
    description: 'Brighter striker ring and stronger launch readability.',
    rarity: 'common',
    status: 'available',
    previewLabel: 'Gold ring',
    themeTokens: {
      scene: {
        striker: '#fff8e8',
        strikerGlow: '#f6c866',
        strikerRing: '#ddb25f'
      }
    }
  },
  {
    id: 'striker-walnut-pro',
    category: 'striker',
    name: 'Walnut Pro Striker',
    description: 'Warm pro striker with cream center and walnut edge mood.',
    rarity: 'common',
    status: 'available',
    previewLabel: 'Walnut pro',
    themeTokens: {
      scene: {
        striker: '#d9b071',
        strikerGlow: '#f0c36e',
        strikerRing: '#9d6330'
      }
    }
  },
  {
    id: 'striker-midnight',
    category: 'striker',
    name: 'Midnight Striker',
    description: 'Dark striker shell with premium gold glow.',
    rarity: 'rare',
    status: 'available',
    previewLabel: 'Unlocked for testing',
    entitlementKey: 'carrom.skin.strikerMidnight',
    themeTokens: {
      scene: {
        striker: '#151a22',
        strikerGlow: '#f0c86e',
        strikerRing: '#d7a957'
      }
    }
  },
  {
    id: 'striker-royal-red',
    category: 'striker',
    name: 'Royal Red Striker',
    description: 'Red striker accent made for royal table themes.',
    rarity: 'royale',
    status: 'available',
    previewLabel: 'Unlocked for testing',
    entitlementKey: 'carrom.skin.strikerRoyalRed',
    themeTokens: {
      scene: {
        striker: '#b94234',
        strikerGlow: '#ffd18a'
      }
    }
  },
  {
    id: 'table-ivory-lounge',
    category: 'table',
    name: 'Ivory Lounge',
    description: 'Soft ivory room, gold dust, and bright tabletop lighting.',
    rarity: 'default',
    status: 'available',
    previewLabel: 'Default room',
    themeTokens: {
      scene: {
        background: '#f7efe1',
        fog: '#eadbc0',
        tableBase: '#ece0c9',
        floor: '#ece0c9',
        particle: '#ffe7b4',
        light: '#fff8ee',
        rim: '#f2c781',
        glow: '#f2c781'
      }
    }
  },
  {
    id: 'table-royal',
    category: 'table',
    name: 'Royal Table',
    description: 'Warmer lounge with deeper base and richer gold ambience.',
    rarity: 'common',
    status: 'available',
    previewLabel: 'Royal warmth',
    themeTokens: {
      scene: {
        background: '#efe0c5',
        fog: '#d7bd95',
        tableBase: '#caa36a',
        floor: '#d5b887',
        particle: '#ffd98f',
        light: '#fff1d2',
        rim: '#e0b461',
        glow: '#e0b461'
      }
    }
  },
  {
    id: 'table-midnight-room',
    category: 'table',
    name: 'Midnight Room',
    description: 'Dark premium room with gold highlights and readable table focus.',
    rarity: 'rare',
    status: 'available',
    previewLabel: 'Dark lounge',
    themeTokens: {
      scene: {
        background: '#080a0f',
        fog: '#121821',
        tableBase: '#151d29',
        floor: '#121923',
        particle: '#f0cb76',
        light: '#f8e6c4',
        rim: '#d7ac5d',
        glow: '#d7ac5d'
      }
    }
  },
  {
    id: 'table-tournament-hall',
    category: 'table',
    name: 'Tournament Hall',
    description: 'Neutral hall lighting made for long serious sessions.',
    rarity: 'rare',
    status: 'available',
    previewLabel: 'Unlocked for testing',
    entitlementKey: 'carrom.skin.tableTournamentHall',
    themeTokens: {
      scene: {
        background: '#d8d0c3',
        fog: '#c5b8a8',
        tableBase: '#9f8462',
        particle: '#e9c878',
        light: '#fff5dd'
      }
    }
  },
  {
    id: 'table-marble-studio',
    category: 'table',
    name: 'Marble Studio',
    description: 'Bright studio ambience for future marble boards.',
    rarity: 'royale',
    status: 'available',
    previewLabel: 'Unlocked for testing',
    entitlementKey: 'carrom.skin.tableMarbleStudio',
    themeTokens: {
      scene: {
        background: '#f8f6f1',
        fog: '#e9e1d3',
        tableBase: '#e5d5b9',
        particle: '#ffe0a3'
      }
    }
  },
  {
    id: 'vfx-classic-gold',
    category: 'vfx',
    name: 'Classic Gold',
    description: 'Warm gold feedback for pockets, launches, and banners.',
    rarity: 'default',
    status: 'available',
    previewLabel: 'Default VFX',
    themeTokens: {
      scene: {
        particle: '#ffe7b4',
        strikerGlow: '#f1c06f'
      },
      vfx: {
        intensity: 1,
        sparkColor: '#d5ad67'
      }
    }
  },
  {
    id: 'vfx-royal-red',
    category: 'vfx',
    name: 'Royal Red',
    description: 'Richer queen and foul feedback with red-gold sparks.',
    rarity: 'common',
    status: 'available',
    previewLabel: 'Red gold',
    themeTokens: {
      scene: {
        queen: '#c44738',
        queenRim: '#f3c36e',
        particle: '#ffd0a0',
        strikerGlow: '#f0b76f'
      },
      vfx: {
        intensity: 1.06,
        sparkColor: '#f0b76f'
      }
    }
  },
  {
    id: 'vfx-minimal-clean',
    category: 'vfx',
    name: 'Minimal Clean',
    description: 'Lower particle intensity with clear readable feedback.',
    rarity: 'common',
    status: 'available',
    previewLabel: 'Low sparkle',
    themeTokens: {
      scene: {
        particle: '#f4d99f',
        strikerGlow: '#e9bd68'
      },
      vfx: {
        intensity: 0.62,
        sparkColor: '#d3b374'
      }
    }
  },
  {
    id: 'vfx-midnight-spark',
    category: 'vfx',
    name: 'Midnight Spark',
    description: 'Gold-blue sparkle profile for midnight tables.',
    rarity: 'rare',
    status: 'available',
    previewLabel: 'Unlocked for testing',
    entitlementKey: 'carrom.skin.vfxMidnightSpark',
    themeTokens: {
      scene: {
        particle: '#c9d9ff',
        strikerGlow: '#d8ad63'
      },
      vfx: {
        intensity: 0.94,
        sparkColor: '#c9d9ff'
      }
    }
  }
];

export const DEFAULT_COSMETIC_LOADOUT = {
  boardSkin: 'board-ivory-royale',
  coinSet: 'coins-classic-carrom',
  strikerSkin: 'striker-ivory',
  tableEnvironment: 'table-ivory-lounge',
  vfxPreset: 'vfx-classic-gold'
};

export function getCosmeticCategory(categoryId) {
  return COSMETIC_CATEGORIES.find((category) => category.id === categoryId) || COSMETIC_CATEGORIES[0];
}

export function getCosmeticsByCategory(categoryId) {
  return COSMETIC_ITEMS.filter((item) => item.category === categoryId);
}

export function getCosmeticById(itemId) {
  return COSMETIC_ITEMS.find((item) => item.id === itemId) || null;
}

export function getLoadoutKeyForCategory(categoryId) {
  return getCosmeticCategory(categoryId).loadoutKey;
}
