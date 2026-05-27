const DEFAULT_PUBLIC_CONFIG = {
  ruleMode: 'classic',
  classicRuleVariant: 'casual',
  coinAssignmentMode: 'random',
  coinSide: 'random',
  matchType: 'casual'
};

function resolvePreference(a, b, fallback) {
  if (a === 'any' && b === 'any') {
    return fallback;
  }
  if (a === 'any') {
    return b;
  }
  if (b === 'any') {
    return a;
  }
  return a === b ? a : null;
}

export function resolvePublicMatchConfig(firstPreferences = {}, secondPreferences = {}) {
  const ruleMode = resolvePreference(firstPreferences.ruleMode, secondPreferences.ruleMode, DEFAULT_PUBLIC_CONFIG.ruleMode);
  if (!ruleMode) {
    return null;
  }

  let classicRuleVariant = DEFAULT_PUBLIC_CONFIG.classicRuleVariant;
  let coinAssignmentMode = DEFAULT_PUBLIC_CONFIG.coinAssignmentMode;
  if (ruleMode === 'classic') {
    classicRuleVariant = resolvePreference(
      firstPreferences.classicRuleVariant,
      secondPreferences.classicRuleVariant,
      DEFAULT_PUBLIC_CONFIG.classicRuleVariant
    );
    coinAssignmentMode = resolvePreference(
      firstPreferences.coinAssignmentMode,
      secondPreferences.coinAssignmentMode,
      DEFAULT_PUBLIC_CONFIG.coinAssignmentMode
    );
    if (!classicRuleVariant || !coinAssignmentMode) {
      return null;
    }
  }

  return {
    ...DEFAULT_PUBLIC_CONFIG,
    ruleMode,
    classicRuleVariant,
    coinAssignmentMode,
    coinSide: coinAssignmentMode
  };
}

export class CarromMatchmaker {
  constructor({ roomManager }) {
    this.roomManager = roomManager;
  }

  createPublicRoom(firstEntry, secondEntry, matchConfig) {
    return this.roomManager.createPublicRoom({
      hostSocketId: firstEntry.socketId,
      hostName: firstEntry.playerName,
      guestSocketId: secondEntry.socketId,
      guestName: secondEntry.playerName,
      matchConfig
    });
  }
}
