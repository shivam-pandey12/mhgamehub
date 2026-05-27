import { CARROM_BOARD, CARROM_INPUT } from '../config/carrom-constants.js';
import { BotShotEvaluator } from './bot-shot-evaluator.js';
import { getBotDifficultyProfile } from './bot-difficulty.js';
import {
  add,
  angleBetween,
  clamp,
  distance,
  estimatePocketRiskScore,
  getOneRailBankPaths,
  getPathBlockers,
  isPlacementSafe,
  normalize,
  randomRange,
  rotateVector,
  sampleBaselinePositions,
  scale,
  subtract
} from './bot-geometry.js';

function isNormalCoin(body) {
  return body.type === 'coin' && (body.color === 'white' || body.color === 'black');
}

function isQueenAvailable(queen = {}) {
  return queen.state === 'onBoard' || queen.state === 'returned' || !queen.state;
}

export class BotShotPlanner {
  constructor({ debugBot = false } = {}) {
    this.debugBot = debugBot;
  }

  plan({ snapshot, matchState, botPlayer, baseline = 'top', difficulty = 'normal' }) {
    const profile = getBotDifficultyProfile(difficulty);
    const evaluator = new BotShotEvaluator(profile);
    if (!snapshot) {
      return this.createFallbackPlan({
        snapshot: { pockets: [], striker: null },
        activeBodies: [],
        striker: null,
        baseline,
        profile,
        reason: 'missing-snapshot'
      });
    }

    const activeBodies = snapshot.activeBodies || snapshot.bodies?.filter((body) => !body.isPocketed) || [];
    const striker = snapshot.striker;
    const context = this.getContext(matchState, botPlayer, profile, activeBodies);
    context.pockets = snapshot.pockets || [];
    const targets = this.getTargets(activeBodies, matchState, botPlayer, profile, context);
    const strikerPositions = sampleBaselinePositions(baseline, profile.baselineSamples);

    if (!striker || !targets.length) {
      return this.createFallbackPlan({ snapshot, activeBodies, striker, baseline, profile, reason: 'no-targets' });
    }

    const directCandidates = this.createDirectCandidates({
      snapshot,
      activeBodies,
      striker,
      targets,
      strikerPositions,
      profile,
      evaluator,
      context,
      baseline
    });
    const bestDirectScore = directCandidates.reduce((best, candidate) => Math.max(best, candidate.score), -Infinity);
    const shouldTryBank = profile.bankChance > 0
      && (!directCandidates.length || (
        bestDirectScore < profile.bankDirectScoreThreshold
        && Math.random() <= profile.bankChance
      ));
    const bankCandidates = shouldTryBank
      ? this.createBankCandidates({
        snapshot,
        activeBodies,
        striker,
        targets,
        strikerPositions,
        profile,
        evaluator,
        context,
        baseline
      })
      : [];
    const candidates = [...directCandidates, ...bankCandidates];

    if (!candidates.length) {
      return this.createFallbackPlan({ snapshot, activeBodies, striker, baseline, profile, reason: 'no-candidates' });
    }

    candidates.sort((a, b) => b.score - a.score);
    const mistake = Math.random() < profile.mistakeChance;
    const choiceCount = profile.choiceTopN + (mistake ? profile.mistakeSpread : 0);
    const topN = Math.max(1, Math.min(choiceCount, candidates.length));
    const selected = candidates[Math.floor(Math.random() * topN)];
    const plan = this.applyDifficultyError(selected, profile);

    if (this.debugBot) {
      plan.debug = {
        candidates: candidates.length,
        directCandidates: directCandidates.length,
        bankCandidates: bankCandidates.length,
        bestDirectScore: Number(bestDirectScore.toFixed(2)),
        target: selected.target.id,
        pocket: selected.pocket.id,
        shotType: selected.shotType,
        score: Number(selected.score.toFixed(2)),
        scratchRisk: Number((selected.scratchRisk || 0).toFixed(2)),
        mistake
      };
    }

    return plan;
  }

  createDirectCandidates({ snapshot, activeBodies, striker, targets, strikerPositions, profile, evaluator, context, baseline }) {
    const candidates = [];
    targets.forEach((target) => {
      snapshot.pockets.forEach((pocket) => {
        const travelDirection = normalize(subtract(pocket.position, target.position));
        const targetBlockers = getPathBlockers(target.position, pocket.position, activeBodies, {
          ignoreIds: new Set([target.id, striker.id]),
          clearance: target.radius * 1.55
        });
        this.addPlacementCandidates({
          candidates,
          activeBodies,
          striker,
          strikerPositions,
          profile,
          evaluator,
          context,
          baseline,
          target,
          pocket,
          travelDirection,
          targetDistance: distance(target.position, pocket.position),
          targetBlockers,
          bankBlockers: [],
          shotType: 'direct'
        });
      });
    });
    return candidates;
  }

  createBankCandidates({ snapshot, activeBodies, striker, targets, strikerPositions, profile, evaluator, context, baseline }) {
    const candidates = [];
    targets.forEach((target) => {
      snapshot.pockets.forEach((pocket) => {
        getOneRailBankPaths(target, pocket).forEach((bankPath) => {
          const targetBlockers = getPathBlockers(target.position, bankPath.railPoint, activeBodies, {
            ignoreIds: new Set([target.id, striker.id]),
            clearance: target.radius * 1.45
          });
          const bankBlockers = getPathBlockers(bankPath.railPoint, pocket.position, activeBodies, {
            ignoreIds: new Set([target.id, striker.id]),
            clearance: target.radius * 1.25
          });
          this.addPlacementCandidates({
            candidates,
            activeBodies,
            striker,
            strikerPositions,
            profile,
            evaluator,
            context,
            baseline,
            target,
            pocket,
            travelDirection: bankPath.travelDirection,
            targetDistance: bankPath.totalDistance,
            targetBlockers,
            bankBlockers,
            bankPath,
            shotType: 'bank'
          });
        });
      });
    });
    return candidates;
  }

  addPlacementCandidates({
    candidates,
    activeBodies,
    striker,
    strikerPositions,
    profile,
    evaluator,
    context,
    baseline,
    target,
    pocket,
    travelDirection,
    targetDistance,
    targetBlockers,
    bankBlockers,
    bankPath = null,
    shotType
  }) {
    const impactDistance = striker.radius + target.radius;
    const impactPoint = add(target.position, scale(travelDirection, -impactDistance));

    strikerPositions.forEach((strikerPosition) => {
      if (!isPlacementSafe(strikerPosition, striker.radius, activeBodies, new Set([striker.id]))) {
        return;
      }

      const direction = normalize(subtract(impactPoint, strikerPosition), { x: 0, z: baseline === 'top' ? 1 : -1 });
      const strikerDistance = distance(strikerPosition, impactPoint);
      const strikerBlockers = getPathBlockers(strikerPosition, impactPoint, activeBodies, {
        ignoreIds: new Set([target.id, striker.id]),
        clearance: striker.radius * 1.3
      });
      const angleDifficulty = clamp(angleBetween(direction, travelDirection) / (Math.PI * 0.5), 0, 1.5);
      const scratchRisk = estimatePocketRiskScore(
        strikerPosition,
        direction,
        context.pockets,
        Math.min(strikerDistance + 0.65, 3.15)
      );
      const estimatedPower = this.estimatePower(strikerDistance, targetDistance, target.type, shotType);
      const candidate = {
        shotType,
        target,
        pocket,
        strikerPosition,
        impactPoint,
        direction,
        travelDirection,
        strikerDistance,
        targetDistance,
        estimatedPower,
        targetPriority: target.priority,
        targetOwnership: target.ownership,
        strikerBlockers,
        targetBlockers,
        bankBlockers,
        bankRailId: bankPath?.railId || '',
        bankRailPoint: bankPath?.railPoint || null,
        bankAngle: bankPath?.bankAngle || 0,
        scratchRisk,
        strictFinalCoinRisk: Boolean(target.strictFinalCoinRisk),
        baseline,
        difficulty: profile.id
      };
      candidate.score = evaluator.scoreCandidate(candidate, context);
      candidates.push(candidate);
    });
  }

  getContext(matchState, botPlayer, profile, activeBodies = []) {
    const queen = matchState?.queen || {};
    const ruleMode = matchState?.ruleMode || 'classic';
    const variant = matchState?.classicRuleVariant || 'casual';
    const botState = matchState?.players?.find((player) => player.id === botPlayer.id) || {};
    const normalCoins = activeBodies.filter(isNormalCoin);
    const ownActiveCoins = normalCoins.filter((coin) => coin.color === botPlayer.color);
    const coverRequired = queen.state === 'pendingCover' && queen.pendingCoverPlayerId === botPlayer.id;
    const coverAvailable = ruleMode === 'freeCapture'
      ? normalCoins.length > 0
      : !botPlayer.color || ownActiveCoins.length > 0;
    const ownPocketedCount = botState.pocketedOwnCoinIds?.length || 0;
    const queenCovered = queen.state === 'covered';
    const strict = variant === 'strict';
    const queenAllowed = isQueenAvailable(queen)
      && coverAvailable
      && (!strict || ownPocketedCount > 0);
    return {
      ruleMode,
      variant,
      strict,
      pockets: [],
      coverRequired,
      coverAvailable,
      canRiskQueen: Math.random() <= profile.queenRisk,
      queenAllowed,
      queenCovered,
      ownPocketedCount,
      finalOwnCoinRisk: strict && !queenCovered && Boolean(botPlayer.color) && ownActiveCoins.length <= 1
    };
  }

  getTargets(activeBodies, matchState, botPlayer, profile, context) {
    context.pockets = matchState?.pockets || context.pockets;
    const ruleMode = matchState?.ruleMode || 'classic';
    const queen = matchState?.queen || {};
    const colorsAssigned = ruleMode === 'freeCapture' || matchState?.coinAssignment?.isAssigned !== false;
    const coverRequired = queen.state === 'pendingCover' && queen.pendingCoverPlayerId === botPlayer.id;
    const normalCoins = activeBodies.filter(isNormalCoin);
    const queenBody = activeBodies.find((body) => body.type === 'queen');

    if (coverRequired) {
      return normalCoins
        .filter((coin) => ruleMode === 'freeCapture' || !botPlayer.color || coin.color === botPlayer.color)
        .map((coin) => ({ ...coin, priority: 98, ownership: 'cover' }));
    }

    if (ruleMode === 'freeCapture') {
      const targets = normalCoins.map((coin) => ({ ...coin, priority: 70, ownership: 'any' }));
      if (queenBody && context.queenAllowed && context.canRiskQueen) {
        targets.push({ ...queenBody, priority: 48 + profile.queenCoverPriority * 0.22, ownership: 'queen' });
      }
      return targets;
    }

    if (!colorsAssigned || !botPlayer.color) {
      return normalCoins.map((coin) => ({ ...coin, priority: 66, ownership: 'open' }));
    }

    const ownCoins = normalCoins.filter((coin) => coin.color === botPlayer.color);
    const opponentCoins = normalCoins.filter((coin) => coin.color !== botPlayer.color);
    const targets = ownCoins.map((coin) => ({
      ...coin,
      priority: context.finalOwnCoinRisk ? 12 : 82,
      ownership: 'own',
      strictFinalCoinRisk: context.finalOwnCoinRisk
    }));

    if (queenBody && context.queenAllowed && context.canRiskQueen) {
      targets.push({ ...queenBody, priority: 42 + profile.queenCoverPriority * 0.18, ownership: 'queen' });
    }

    if (!targets.length || targets.every((target) => target.strictFinalCoinRisk)) {
      opponentCoins.forEach((coin) => {
        targets.push({ ...coin, priority: 8, ownership: 'opponent' });
      });
    }

    return targets.length ? targets : normalCoins.map((coin) => ({ ...coin, priority: 12, ownership: 'safety' }));
  }

  estimatePower(strikerDistance, targetDistance, targetType, shotType = 'direct') {
    const queenBoost = targetType === 'queen' ? 0.28 : 0;
    const bankBoost = shotType === 'bank' ? 0.46 : 0;
    return clamp(
      1.0 + strikerDistance * 0.78 + targetDistance * 0.54 + queenBoost + bankBoost,
      CARROM_INPUT.MIN_SHOT_POWER,
      CARROM_INPUT.MAX_SHOT_POWER * 0.96
    );
  }

  applyDifficultyError(candidate, profile) {
    const errorMultiplier = candidate.shotType === 'bank' ? 1.2 : 1;
    const angle = randomRange(-profile.aimErrorDegrees, profile.aimErrorDegrees) * errorMultiplier * Math.PI / 180;
    const direction = normalize(rotateVector(candidate.direction, angle), candidate.direction);
    const powerScale = 1 + randomRange(-profile.powerErrorRatio, profile.powerErrorRatio);
    const riskPowerScale = candidate.scratchRisk > 0.38 ? profile.riskyPowerScale : 1;
    const power = clamp(
      candidate.estimatedPower * powerScale * riskPowerScale,
      CARROM_INPUT.MIN_SHOT_POWER,
      CARROM_INPUT.MAX_SHOT_POWER
    );

    return {
      type: 'bot-shot',
      shotType: candidate.shotType,
      targetId: candidate.target.id,
      targetType: candidate.target.type,
      targetColor: candidate.target.color,
      targetOwnership: candidate.targetOwnership,
      pocketId: candidate.pocket.id,
      bankRailId: candidate.bankRailId,
      strikerPosition: { ...candidate.strikerPosition },
      impactPoint: { ...candidate.impactPoint },
      direction,
      power,
      powerRatio: CARROM_INPUT.MAX_SHOT_POWER > 0 ? power / CARROM_INPUT.MAX_SHOT_POWER : 0,
      score: candidate.score,
      scratchRisk: candidate.scratchRisk,
      baseline: candidate.baseline,
      difficulty: profile.id
    };
  }

  createFallbackPlan({ snapshot, activeBodies, striker, baseline, profile, reason }) {
    const strikerBody = striker || snapshot.striker || { radius: CARROM_BOARD.STRIKER_RADIUS, id: 'striker-1' };
    const positions = sampleBaselinePositions(baseline, profile.baselineSamples);
    const strikerPosition = positions.find((position) => (
      isPlacementSafe(position, strikerBody.radius, activeBodies, new Set([strikerBody.id]))
    )) || positions[Math.floor(positions.length / 2)] || { x: 0, z: baseline === 'top' ? -CARROM_BOARD.BASELINE_OFFSET : CARROM_BOARD.BASELINE_OFFSET };
    const normalCoins = activeBodies.filter(isNormalCoin);
    const target = normalCoins
      .slice()
      .sort((a, b) => distance(a.position, strikerPosition) - distance(b.position, strikerPosition))[0];
    const fallbackTarget = target?.position || { x: 0, z: 0 };
    let direction = normalize(subtract(fallbackTarget, strikerPosition), { x: 0, z: baseline === 'top' ? 1 : -1 });
    const scratchRisk = estimatePocketRiskScore(strikerPosition, direction, snapshot.pockets || [], 2.4);
    if (scratchRisk > 0.42) {
      direction = normalize(rotateVector(direction, baseline === 'top' ? 0.28 : -0.28), direction);
    }
    const power = clamp(
      profile.fallbackPower * (scratchRisk > 0.42 ? 0.82 : 1),
      CARROM_INPUT.MIN_SHOT_POWER,
      CARROM_INPUT.MAX_SHOT_POWER * 0.62
    );

    return {
      type: 'bot-fallback-shot',
      shotType: 'safety',
      reason,
      targetId: target?.id || '',
      targetType: target?.type || '',
      targetColor: target?.color || '',
      pocketId: '',
      strikerPosition,
      impactPoint: fallbackTarget,
      direction,
      power,
      powerRatio: CARROM_INPUT.MAX_SHOT_POWER > 0 ? power / CARROM_INPUT.MAX_SHOT_POWER : 0,
      score: -1,
      scratchRisk,
      baseline,
      difficulty: profile.id
    };
  }
}
