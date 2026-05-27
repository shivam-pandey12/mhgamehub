export const APP_STATES = {
  loading: 'loading',
  mainMenu: 'mainMenu',
  modeSelect: 'modeSelect',
  localSetup: 'localSetup',
  challenges: 'challenges',
  challengePlaying: 'challengePlaying',
  practice: 'practice',
  playing: 'playing',
  paused: 'paused',
  rules: 'rules',
  settings: 'settings',
  result: 'result',
  about: 'about'
};

export const STORAGE_KEYS = {
  settings: 'gamehub.carrom3d.settings',
  playerNames: 'gamehub.carrom3d.playerNames',
  challengeProgress: 'gamehub.carrom3d.challengeProgress',
  onboardingSeen: 'gamehub.carrom3d.onboardingSeen',
  tutorialCompleted: 'gamehub.carrom3d.tutorialCompleted',
  practiceStats: 'gamehub.carrom3d.practiceStats',
  cosmetics: 'gamehub.carrom3d.cosmetics',
  onlineSession: 'gamehub.carrom3d.onlineSession'
};

export const DEFAULT_LOCAL_SETUP = {
  matchMode: 'local2p',
  playerOneName: 'Player 1',
  playerTwoName: 'Player 2',
  botDifficulty: 'normal',
  ruleMode: 'classic',
  classicRuleVariant: 'casual',
  coinSide: 'p1White',
  matchType: 'classic',
  practiceType: 'freePractice',
  boardStyle: 'ivory'
};

export const CLASSIC_RULE_VARIANTS = {
  casual: {
    id: 'casual',
    label: 'Casual',
    hudLabel: 'Classic - Casual',
    helper: 'Forgiving local rules for quick games and beginners.'
  },
  standard: {
    id: 'standard',
    label: 'Standard',
    hudLabel: 'Classic - Standard',
    helper: 'Cleaner queen and foul handling without strict dues.'
  },
  strict: {
    id: 'strict',
    label: 'Strict',
    hudLabel: 'Classic - Strict',
    helper: 'Harder queen timing and due penalties for mistakes.'
  }
};

export function normalizeClassicRuleVariant(value) {
  return CLASSIC_RULE_VARIANTS[value] ? value : 'casual';
}

export function getClassicRuleVariant(value = 'casual') {
  return CLASSIC_RULE_VARIANTS[normalizeClassicRuleVariant(value)];
}

export const BOARD_STYLE_PRESETS = {
  ivory: {
    id: 'ivory',
    label: 'Ivory Royale',
    scene: {}
  },
  wood: {
    id: 'wood',
    label: 'Tournament Wood',
    scene: {
      tableBase: '#d9c0a0',
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
  },
  midnight: {
    id: 'midnight',
    label: 'Midnight Gold',
    scene: {
      tableBase: '#090d14',
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
};

export function getBoardStylePreset(styleId) {
  return BOARD_STYLE_PRESETS[styleId] || BOARD_STYLE_PRESETS.ivory;
}

export function composeBoardStyleTheme(theme, styleId) {
  const preset = getBoardStylePreset(styleId);
  return {
    ...theme,
    scene: {
      ...theme.scene,
      ...preset.scene
    }
  };
}

export const SHELL_MATCH_DEFAULTS = {
  matchMode: 'local2p',
  matchModeLabel: 'Local 2 Player',
  currentTurn: 'Player 1',
  playerOneScore: '0',
  playerTwoScore: '0',
  queenStatus: 'On board',
  shotPower: 'Ready',
  shotPowerRatio: 0,
  currentColor: 'White',
  playerOneColor: 'White',
  playerTwoColor: 'Black',
  ruleMode: 'classic',
  ruleModeLabel: 'Classic Carrom',
  classicRuleVariant: 'casual',
  classicRuleVariantLabel: 'Casual',
  dueStatus: '',
  playerOneDue: 0,
  playerTwoDue: 0,
  coinAssignmentMode: 'p1White',
  colorsAssigned: true,
  playerOnePocketed: 0,
  playerTwoPocketed: 0,
  playerOneRemaining: 9,
  playerTwoRemaining: 9,
  scoringMode: 'coins',
  playerOnePoints: 0,
  playerTwoPoints: 0,
  pointsLabel: '',
  botDifficulty: '',
  botDifficultyLabel: '',
  botStatus: '',
  currentIsBot: false,
  onlineActive: false,
  onlineRoomCode: '',
  onlineConnectionStatus: '',
  onlineTurnStatus: '',
  challengeActive: false,
  challengeTitle: '',
  challengeObjective: '',
  challengeShots: '',
  challengeResult: '',
  practiceActive: false,
  practiceTitle: '',
  practiceStatus: '',
  tutorialActive: false,
  tutorialTitle: '',
  tutorialInstruction: '',
  turnNumber: 1,
  shotNumber: 0,
  foulStatus: 'Clear',
  bannerTone: 'default',
  status: 'Place striker on the baseline, then drag to aim.'
};

export const MODE_CARDS = [
  {
    id: 'local',
    title: 'Local 2 Player',
    status: 'Playable',
    description: 'Play a complete local match on the same device with turns, fouls, and queen cover.',
    action: 'select-local2p',
    disabled: false
  },
  {
    id: 'bot',
    title: 'Vs Bot',
    status: 'Playable',
    description: 'Play a local human-vs-bot match with difficulty-based geometric shot planning.',
    action: 'select-vs-bot',
    disabled: false
  },
  {
    id: 'practice',
    title: 'Practice / Tutorial',
    status: 'Playable',
    description: 'Train striker control, pocket drills, and queen cover without match pressure.',
    action: 'open-practice',
    disabled: false
  },
  {
    id: 'challenges',
    title: 'Challenges',
    status: 'Playable',
    description: 'Clear curated solo shot objectives, earn stars, and save progress locally.',
    action: 'open-challenges',
    disabled: false
  },
  {
    id: 'onlinePrivate',
    title: 'Online Private Room',
    status: 'MVP',
    description: 'Create or join a memory-only private room and play online with server-owned turns.',
    action: 'open-online',
    disabled: false
  },
  {
    id: 'onlinePublic',
    title: 'Public Matchmaking',
    status: 'MVP',
    description: 'Find a casual online opponent and play with server-owned match state.',
    action: 'open-public-matchmaking',
    disabled: false
  }
];

export const RULE_SECTIONS = [
  {
    title: 'Controls',
    body: 'Place the striker on the baseline, drag to aim, pull back for power, and release to shoot.'
  },
  {
    title: 'Objective',
    body: 'Pocket your assigned coins before finishing the match with clean, controlled shots.'
  },
  {
    title: 'Casual Classic',
    body: 'Forgiving classic play: own coins continue the turn, queen needs cover, and simple fouls return a coin when possible.'
  },
  {
    title: 'Standard Classic',
    body: 'Standard play tightens queen and foul handling while keeping the match readable and fair.'
  },
  {
    title: 'Strict Classic',
    body: 'Strict play blocks early queen claims, returns the final coin before queen cover, and records dues for hard fouls.'
  },
  {
    title: 'Queen',
    body: 'Pocket the queen and cover it with your own coin to secure the royal finish.'
  },
  {
    title: 'Fouls',
    body: 'Avoid pocketing the striker. Foul penalties return one of your pocketed own coins when available.'
  },
  {
    title: 'Match Flow',
    body: 'Pocketing your own coin continues the turn. Empty shots and opponent-only pockets pass the table.'
  },
  {
    title: 'Free Capture',
    body: 'Pocket any normal coin to score. Each coin is 1 point, the covered queen is 3 bonus points, and coin color does not matter.'
  },
  {
    title: 'Bot Mode',
    body: 'Vs Bot uses the same physics and rules. The bot waits, places the striker, previews aim, and shoots without teleporting pieces.'
  },
  {
    title: 'Practice',
    body: 'Practice mode lets you reset drills and train shots without turns, winners, or bot pressure.'
  },
  {
    title: 'Online Private',
    body: 'Private rooms use server-owned turns, shot validation, and authoritative match state sync.'
  },
  {
    title: 'Online Public',
    body: 'Public matchmaking pairs compatible casual players, then reuses the same online match engine.'
  },
  {
    title: 'Challenges',
    body: 'Challenges are solo shot setups with limited shots, clear objectives, star ratings, and local-only progress.'
  },
  {
    title: 'Customization',
    body: 'Cosmetic loadouts are saved on this device. Board, coin, striker, table, and VFX styles are visual only and do not change physics.'
  }
];

export const QUALITY_OPTIONS = ['auto', 'high', 'balanced', 'battery'];

export const QUALITY_PROFILES = {
  high: {
    id: 'high',
    pixelRatioDesktop: 2,
    pixelRatioMobile: 1.65,
    keyShadowMapSize: 2048,
    spotShadowMapSize: 1024,
    shadowEnabled: true,
    vfxIntensity: 1,
    ambientParticleScale: 1
  },
  auto: {
    id: 'auto',
    pixelRatioDesktop: 1.5,
    pixelRatioMobile: 1.25,
    keyShadowMapSize: 1024,
    spotShadowMapSize: 768,
    shadowEnabled: true,
    vfxIntensity: 0.9,
    ambientParticleScale: 0.85
  },
  balanced: {
    id: 'balanced',
    pixelRatioDesktop: 1.25,
    pixelRatioMobile: 1.1,
    keyShadowMapSize: 1024,
    spotShadowMapSize: 512,
    shadowEnabled: true,
    vfxIntensity: 0.72,
    ambientParticleScale: 0.65
  },
  battery: {
    id: 'battery',
    pixelRatioDesktop: 1,
    pixelRatioMobile: 1,
    keyShadowMapSize: 512,
    spotShadowMapSize: 256,
    shadowEnabled: false,
    vfxIntensity: 0.46,
    ambientParticleScale: 0.34
  }
};

export function getQualityProfile(quality = 'auto') {
  return QUALITY_PROFILES[quality] || QUALITY_PROFILES.auto;
}

export const CARROM_BOARD = {
  BOARD_SIZE: 6.4,
  PLAY_AREA_SIZE: 5.34,
  FRAME_WIDTH: 0.53,
  BOARD_THICKNESS: 0.34,
  FRAME_HEIGHT: 0.34,
  SURFACE_Y: 0.08,
  POCKET_RADIUS: 0.26,
  POCKET_CENTER_OFFSET: 2.35,
  COIN_RADIUS: 0.145,
  COIN_HEIGHT: 0.075,
  STRIKER_RADIUS: 0.22,
  STRIKER_HEIGHT: 0.085,
  CENTER_CLUSTER_SPACING: 0.33,
  BASELINE_OFFSET: 2.08,
  BASELINE_HALF_LENGTH: 1.55,
  MARKING_Y_OFFSET: 0.006
};

export const CARROM_VISUAL_Y = {
  COIN_VISUAL_Y: CARROM_BOARD.SURFACE_Y + CARROM_BOARD.COIN_HEIGHT / 2 + 0.025,
  QUEEN_VISUAL_Y: CARROM_BOARD.SURFACE_Y + CARROM_BOARD.COIN_HEIGHT / 2 + 0.026,
  STRIKER_VISUAL_Y: CARROM_BOARD.SURFACE_Y + CARROM_BOARD.STRIKER_HEIGHT / 2 + 0.026
};

export const CARROM_INPUT = {
  ACTIVE_BASELINE: 'bottom',
  BASELINE_TOUCH_BAND: 0.42,
  PLACEMENT_PADDING: 0.015,
  PLACEMENT_SAMPLE_COUNT: 25,
  AIM_START_RADIUS: 0.48,
  AIM_CANCEL_DISTANCE: 0.12,
  AIM_DRAG_MAX_DISTANCE: 1.65,
  MIN_SHOT_POWER: 0.55,
  MAX_SHOT_POWER: 14.4,
  POWER_SCALE: 9.6
};

export const CAMERA_VIEWS = {
  menu: {
    position: { x: -2.25, y: 5.7, z: 7.4 },
    target: { x: 0, y: 0.2, z: 0 }
  },
  gameplay: {
    position: { x: 0, y: 6.8, z: 6.7 },
    target: { x: 0, y: 0.16, z: 0 }
  },
  top: {
    position: { x: 0, y: 8.6, z: 0.18 },
    target: { x: 0, y: 0.12, z: 0 }
  },
  cinematic: {
    position: { x: -3.15, y: 4.35, z: 6.1 },
    target: { x: 0, y: 0.18, z: 0 }
  },
  mobile: {
    position: { x: 0, y: 7.55, z: 6.9 },
    target: { x: 0, y: 0.14, z: 0 }
  }
};

export const CAMERA_TURN_ROTATION = {
  DURATION: 0.72,
  POSITION_LERP: 9.5,
  TARGET_LERP: 10.5
};
