import { MEDAL_RULES, SCORE_RULES } from '../config.js';

export class ScoreSystem {
  calculate({ mission, missionState, stats, player, robber, wantedLevel, scoreMultiplier = 1, cleanPenalty = 0 }) {
    let total = 0;
    const breakdown = [];
    const add = (label, value) => {
      const safe = Math.max(0, Math.round(value));
      if (safe > 0) {
        total += safe;
        breakdown.push({ label, value: safe });
      }
    };

    if (mission.role === 'robber') {
      add('Time survived', (mission.duration - missionState.timer) * SCORE_RULES.timeSurvived);
      add('Police destroyed', stats.destroyed * SCORE_RULES.vehicleDestroyed);
      add('Wanted level', wantedLevel * SCORE_RULES.wantedLevel);
      add('Remaining HP', player ? player.health * 3 : 0);
      if (mission.mode === 'checkpoints') add('Checkpoints', missionState.checkpointIndex * SCORE_RULES.checkpoint);
      if (mission.mode === 'cargo' && missionState.completed) {
        add('Cargo delivered', SCORE_RULES.cargoDelivered);
        add('Cargo stability', missionState.cargoStability * SCORE_RULES.cargoStability);
      }
    } else {
      add('Robber damage', stats.damageDealt * 3);
      add('Time remaining', missionState.timer * SCORE_RULES.timeRemaining);
      add('Abilities landed', stats.abilityHits * SCORE_RULES.abilityLanded);
      add('Convoy destroyed', stats.convoyDestroyed * SCORE_RULES.vehicleDestroyed);
      add('No player death', stats.playerDeaths === 0 ? 500 : 0);
      if (robber?.health <= 0) add('Target disabled', 900);
    }

    add('Takedowns', stats.takedowns * SCORE_RULES.takedown);
    add('Pickups', stats.pickupScore || 0);
    add('Bonus objective', missionState.bonusComplete ? SCORE_RULES.bonus : 0);
    if (cleanPenalty > 0) add('Clean run penalty', -cleanPenalty);
    if (scoreMultiplier !== 1) {
      const base = total;
      total = Math.max(0, Math.round(total * scoreMultiplier - cleanPenalty));
      breakdown.push({ label: 'Multiplier', value: `${scoreMultiplier.toFixed(2)}x` });
      if (cleanPenalty > 0) breakdown.push({ label: 'Clean penalty', value: -Math.round(cleanPenalty) });
      if (total > base) breakdown.push({ label: 'Difficulty and modifiers', value: total - base });
    }
    const rank = SCORE_RULES.ranks.find((item) => total >= item.min)?.rank || 'C';
    const healthRatio = player ? player.health / player.maxHealth : 0;
    const medal = MEDAL_RULES.find((rule) => total >= rule.minScore && healthRatio >= rule.minHealthRatio)?.medal || 'Bronze';
    return { total, rank, medal, breakdown };
  }
}
