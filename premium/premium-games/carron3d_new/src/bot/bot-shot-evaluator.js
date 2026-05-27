export class BotShotEvaluator {
  constructor(profile) {
    this.profile = profile;
  }

  scoreCandidate(candidate, context = {}) {
    const targetPriority = candidate.targetPriority || 0;
    const pocketBonus = Math.max(0, 30 - candidate.targetDistance * 5.6);
    const approachBonus = Math.max(0, 22 - candidate.strikerDistance * 4.2);
    const centerBonus = Math.max(0, 6 - Math.abs(candidate.strikerPosition.x) * 2.2);
    const directBonus = candidate.shotType === 'direct' ? 10 : -this.profile.bankScorePenalty;
    const queenBonus = candidate.target.type === 'queen'
      ? context.queenAllowed && context.canRiskQueen ? 20 : -80
      : 0;
    const coverBonus = context.coverRequired && candidate.target.type !== 'queen'
      ? this.profile.queenCoverPriority
      : 0;
    const ownershipPenalty = candidate.targetOwnership === 'opponent' ? this.profile.opponentPenalty : 0;
    const blockedPenalty = (
      candidate.strikerBlockers.length * this.profile.blockedPenalty
      + candidate.targetBlockers.length * this.profile.blockedPenalty * 0.85
      + (candidate.bankBlockers?.length || 0) * this.profile.blockedPenalty * 0.68
    );
    const anglePenalty = (candidate.angleDifficulty || 0) * this.profile.anglePenaltyScale;
    const bankAnglePenalty = candidate.shotType === 'bank'
      ? Math.abs((candidate.bankAngle || 0) - 1.1) * 9
      : 0;
    const riskPenalty = (candidate.scratchRisk || 0) * this.profile.foulRiskPenalty * this.profile.scratchPenaltyScale;
    const powerPenalty = Math.max(0, candidate.estimatedPower - 5.25) * 3.2;
    const strictPenalty = candidate.strictFinalCoinRisk ? 140 : 0;
    const queenCoverPenalty = candidate.target.type === 'queen' && !context.coverAvailable ? 32 : 0;

    return (
      targetPriority
      + pocketBonus
      + approachBonus
      + centerBonus
      + directBonus
      + queenBonus
      + coverBonus
      - blockedPenalty
      - anglePenalty
      - bankAnglePenalty
      - riskPenalty
      - powerPenalty
      - ownershipPenalty
      - strictPenalty
      - queenCoverPenalty
    );
  }
}
