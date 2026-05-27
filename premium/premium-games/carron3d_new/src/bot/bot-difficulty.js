export const BOT_DIFFICULTY_PROFILES = {
  easy: {
    id: 'easy',
    label: 'Easy',
    defaultName: 'Easy Bot',
    thinkingMinMs: 1000,
    thinkingMaxMs: 1400,
    previewMs: 700,
    baselineSamples: 7,
    choiceTopN: 5,
    aimErrorDegrees: 8,
    powerErrorRatio: 0.18,
    queenRisk: 0.18,
    queenCoverPriority: 28,
    bankChance: 0,
    bankDirectScoreThreshold: -999,
    bankScorePenalty: 42,
    anglePenaltyScale: 22,
    scratchPenaltyScale: 0.78,
    opponentPenalty: 18,
    riskyPowerScale: 0.9,
    mistakeChance: 0.16,
    mistakeSpread: 5,
    blockedPenalty: 24,
    foulRiskPenalty: 16,
    fallbackPower: 2.3
  },
  normal: {
    id: 'normal',
    label: 'Normal',
    defaultName: 'Royal Bot',
    thinkingMinMs: 650,
    thinkingMaxMs: 1000,
    previewMs: 560,
    baselineSamples: 11,
    choiceTopN: 3,
    aimErrorDegrees: 4,
    powerErrorRatio: 0.1,
    queenRisk: 0.44,
    queenCoverPriority: 44,
    bankChance: 0.16,
    bankDirectScoreThreshold: 72,
    bankScorePenalty: 28,
    anglePenaltyScale: 32,
    scratchPenaltyScale: 1,
    opponentPenalty: 30,
    riskyPowerScale: 0.82,
    mistakeChance: 0.08,
    mistakeSpread: 4,
    blockedPenalty: 36,
    foulRiskPenalty: 26,
    fallbackPower: 2.8
  },
  hard: {
    id: 'hard',
    label: 'Hard',
    defaultName: 'Master Bot',
    thinkingMinMs: 450,
    thinkingMaxMs: 750,
    previewMs: 460,
    baselineSamples: 15,
    choiceTopN: 2,
    aimErrorDegrees: 1.7,
    powerErrorRatio: 0.05,
    queenRisk: 0.68,
    queenCoverPriority: 62,
    bankChance: 0.38,
    bankDirectScoreThreshold: 86,
    bankScorePenalty: 18,
    anglePenaltyScale: 44,
    scratchPenaltyScale: 1.35,
    opponentPenalty: 48,
    riskyPowerScale: 0.74,
    mistakeChance: 0.035,
    mistakeSpread: 3,
    blockedPenalty: 54,
    foulRiskPenalty: 42,
    fallbackPower: 3.1
  }
};

export function normalizeBotDifficulty(value = 'normal') {
  return BOT_DIFFICULTY_PROFILES[value] ? value : 'normal';
}

export function getBotDifficultyProfile(value = 'normal') {
  return BOT_DIFFICULTY_PROFILES[normalizeBotDifficulty(value)];
}

export function getDefaultBotName(value = 'normal') {
  return getBotDifficultyProfile(value).defaultName;
}
