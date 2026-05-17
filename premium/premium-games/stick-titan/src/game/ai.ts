import type { AIIntent, ActorState, BossPhase } from './types';

interface BossProfile {
  preferredRange: number;
  dashRange: number;
  aggression: number;
}

const BOSS_PHASE_PROFILES: Record<BossPhase, BossProfile> = {
  phase1: { preferredRange: 1.8, dashRange: 4.8, aggression: 0.44 },
  phase2: { preferredRange: 2.05, dashRange: 5.4, aggression: 0.62 },
  phase3: { preferredRange: 2.25, dashRange: 6, aggression: 0.82 },
};

function idleIntent(): AIIntent {
  return {
    moveX: 0,
    attackName: null,
    block: false,
    dashDirection: 0,
    jump: false,
    weaponModeRequest: null,
    tokens: [],
    countering: false,
    utilityRequest: null,
    strategy: 'melee',
    debugLabel: 'idle',
  };
}

function hasGunAmmo(actor: ActorState): boolean {
  return actor.gun.ammoInMagazine > 0 || actor.gun.reserveAmmo === null || actor.gun.reserveAmmo > 0;
}

function hasLoadout(actor: ActorState, mode: 'sword' | 'gun' | 'power'): boolean {
  return actor.aiLoadout.includes(mode);
}

export function chooseFighterIntent(opponent: ActorState, player: ActorState, elapsedTime: number): AIIntent {
  const intent = idleIntent();
  if (opponent.health <= 0) {
    return intent;
  }

  const dx = player.position.x - opponent.position.x;
  const absDx = Math.abs(dx);
  const sign = dx >= 0 ? 1 : -1;
  const airborneThreat = !player.grounded && player.position.y > 0.7;
  const beat = Math.sin(elapsedTime * 4.4);
  const repeated = player.patternMemory.repeatedStarter;
  const playerPressuring = player.combat.attackName !== null && absDx <= 1.9;
  const healthRatio = opponent.health / Math.max(opponent.maxHealth, 1);
  const gunReady = hasLoadout(opponent, 'gun') && hasGunAmmo(opponent);
  const desperation = healthRatio <= 0.2;
  const mixedPressure = healthRatio <= 0.45 && healthRatio > 0.2;
  intent.strategy = desperation ? 'desperation' : mixedPressure ? 'mixed' : 'melee';

  if (opponent.combat.hitStunTimer > 0 || opponent.defense.guardBreakTimer > 0) {
    intent.moveX = 0;
    intent.debugLabel = 'recovering';
    return intent;
  }

  if (opponent.defense.dashTimer > 0) {
    intent.dashDirection = opponent.defense.dashDirection;
    intent.debugLabel = 'dash-active';
    return intent;
  }

  if (playerPressuring && beat > 0.45) {
    if (beat > 0.82) {
      intent.dashDirection = -sign as -1 | 1;
      intent.countering = true;
      intent.debugLabel = 'counter-dash';
      return intent;
    }
    intent.block = true;
    intent.countering = repeated !== null;
    intent.debugLabel = 'block-pressure';
    return intent;
  }

  if (absDx > 2.05) {
    const allowGun = gunReady && ((mixedPressure && absDx >= 2.8) || (desperation && absDx >= 2.8));
    intent.weaponModeRequest = allowGun ? 'gun' : healthRatio > 0.45 ? 'sword' : hasLoadout(opponent, 'power') ? 'power' : 'sword';
    if (intent.weaponModeRequest === 'gun' && absDx < 4.8 && absDx >= 2.8 && (desperation ? beat > -0.15 : beat > 0.68)) {
      intent.attackName = desperation && beat > 0.55 ? 'gun_heavy' : 'gun_light1';
      intent.tokens = desperation && beat > 0.55 ? ['forward', 'forward', 'heavy'] : ['light'];
      intent.debugLabel = desperation ? 'desperation-gun' : 'gun-punish';
      return intent;
    }
    intent.moveX = sign * (absDx > 3.6 ? 1 : 0.7);
    if (absDx > 4.2 && beat < -0.72) {
      intent.dashDirection = sign as -1 | 1;
    }
    intent.debugLabel = intent.weaponModeRequest === 'gun' ? 'gun-spacing' : 'melee-approach';
    return intent;
  }

  if (airborneThreat && absDx < 1.65) {
    intent.weaponModeRequest = 'power';
    intent.attackName = 'fighter_launcher';
    intent.tokens = ['down', 'heavy'];
    intent.debugLabel = 'anti-air';
    return intent;
  }

  if (absDx < 1.15 && beat < -0.42) {
    intent.weaponModeRequest = desperation || repeated === 'light_chain' ? (hasLoadout(opponent, 'power') ? 'power' : 'sword') : 'sword';
    intent.attackName = 'fighter_heavy';
    intent.tokens = repeated === 'light_chain' ? ['down', 'forward', 'special'] : ['forward', 'forward', 'heavy'];
    intent.countering = repeated !== null;
    intent.debugLabel = intent.countering ? 'counter-heavy' : 'close-heavy';
    return intent;
  }

  if (absDx < 1.55) {
    intent.weaponModeRequest = beat > 0.1 || !hasLoadout(opponent, 'power') ? 'sword' : 'power';
    intent.attackName = beat > 0.1 || !hasLoadout(opponent, 'power') ? 'fighter_light1' : 'fighter_launcher';
    intent.tokens = beat > 0.1 ? ['light', 'light', 'heavy'] : ['down', 'heavy'];
    intent.debugLabel = beat > 0.1 ? 'melee-chain' : 'launcher';
    return intent;
  }

  if (desperation && absDx < 1.8) {
    intent.weaponModeRequest = hasLoadout(opponent, 'power') ? 'power' : 'sword';
    intent.moveX = sign * 0.34;
    intent.debugLabel = 'desperation-collapse';
    return intent;
  }

  intent.moveX = sign * 0.5;
  intent.debugLabel = 'hold-mid';
  return intent;
}

export function chooseBossIntent(opponent: ActorState, player: ActorState, elapsedTime: number): AIIntent {
  const intent = idleIntent();
  if (!opponent.boss || opponent.health <= 0) {
    return intent;
  }

  const dx = player.position.x - opponent.position.x;
  const absDx = Math.abs(dx);
  const sign = dx >= 0 ? 1 : -1;
  const phase = opponent.boss.phase;
  const profile = BOSS_PHASE_PROFILES[phase];
  const rhythm = Math.sin(elapsedTime * (phase === 'phase3' ? 6 : phase === 'phase2' ? 4.8 : 3.6));
  const repeated = player.patternMemory.repeatedStarter;
  const playerPressuring = player.combat.attackName !== null && absDx <= 2;
  const healthRatio = opponent.health / Math.max(opponent.maxHealth, 1);
  const gunReady = hasGunAmmo(opponent);
  const gunUnlocked = phase === 'phase3' || healthRatio <= 0.35;
  const rarePhaseTwoGun = phase === 'phase2' && gunReady && absDx > 3.2 && rhythm > 0.76;
  intent.strategy = gunUnlocked ? 'mixed' : 'pressure';

  if (opponent.combat.hitStunTimer > 0 || opponent.defense.guardBreakTimer > 0) {
    intent.debugLabel = 'recovering';
    return intent;
  }

  if (opponent.defense.dashTimer > 0) {
    intent.dashDirection = opponent.defense.dashDirection;
    intent.debugLabel = 'dash-active';
    return intent;
  }

  if (playerPressuring && rhythm > 0.3) {
    if (opponent.boss.dodgeCooldown <= 0 && rhythm > 0.78) {
      intent.dashDirection = -sign as -1 | 1;
      intent.countering = true;
      intent.debugLabel = 'boss-counter-dash';
      return intent;
    }
    if (opponent.boss.blockCooldown <= 0) {
      intent.block = true;
      intent.countering = repeated !== null;
      intent.debugLabel = 'boss-block';
      return intent;
    }
  }

  if (opponent.boss.attackCooldown > 0) {
    intent.weaponModeRequest =
      gunUnlocked && gunReady && absDx > 2.6
        ? 'gun'
        : phase === 'phase3'
          ? 'power'
          : 'sword';
    intent.moveX = sign * (absDx > profile.preferredRange ? 0.7 : absDx < 1.15 ? -0.3 : 0);
    intent.debugLabel = intent.weaponModeRequest === 'gun' ? 'boss-gun-space' : 'boss-melee-space';
    return intent;
  }

  if (phase === 'phase3' && absDx <= 2.1 && rhythm < -0.2) {
    intent.weaponModeRequest = 'power';
    intent.attackName = 'boss_heavy';
    intent.tokens = ['down', 'forward', 'special'];
    intent.debugLabel = 'boss-phase3-special';
    return intent;
  }

  if (absDx <= 1.8 && gunUnlocked) {
    intent.weaponModeRequest = phase === 'phase3' ? 'power' : 'sword';
    intent.moveX = sign * 0.28;
    intent.debugLabel = 'boss-melee-force';
    return intent;
  }

  if (absDx <= 1.55) {
    if (phase !== 'phase1' && rhythm < -0.52) {
      intent.weaponModeRequest = 'power';
      intent.attackName = 'boss_launcher';
      intent.tokens = ['down', 'heavy'];
      intent.debugLabel = 'boss-launcher';
      return intent;
    }
    intent.weaponModeRequest = phase === 'phase1' || !gunUnlocked || !gunReady ? 'sword' : 'power';
    intent.attackName = 'boss_light1';
    intent.tokens = ['light', 'light', 'heavy'];
    intent.debugLabel = 'boss-close-chain';
    return intent;
  }

  if (absDx <= 2.1 && opponent.boss.heavyCooldown <= 0) {
    intent.weaponModeRequest = 'power';
    intent.attackName = 'boss_heavy';
    intent.tokens = ['forward', 'forward', 'heavy'];
    intent.countering = repeated !== null;
    intent.debugLabel = intent.countering ? 'boss-counter-heavy' : 'boss-heavy';
    return intent;
  }

  if (absDx <= profile.dashRange && opponent.boss.dashCooldown <= 0 && rhythm > 0.18) {
    intent.weaponModeRequest = gunUnlocked && gunReady && absDx > 2.5 ? 'gun' : 'power';
    intent.attackName = 'boss_dash';
    intent.tokens = ['forward', 'forward', 'heavy'];
    intent.debugLabel = 'boss-dash';
    return intent;
  }

  if (absDx <= 4.8 && absDx > 2.2 && gunReady && ((gunUnlocked && absDx > 2.6) || rarePhaseTwoGun) && rhythm > 0.12) {
    intent.weaponModeRequest = 'gun';
    intent.attackName = phase === 'phase3' && rhythm > 0.55 ? 'gun_special' : 'gun_light1';
    intent.tokens = phase === 'phase3' && rhythm > 0.55 ? ['down', 'forward', 'special'] : ['light'];
    intent.countering = repeated !== null;
    intent.debugLabel = phase === 'phase3' ? 'boss-phase3-gun' : 'boss-phase2-punish';
    return intent;
  }

  intent.weaponModeRequest = gunUnlocked && gunReady && absDx > 3.3 ? 'gun' : phase === 'phase3' ? 'power' : 'sword';
  intent.moveX = sign * (absDx > profile.preferredRange ? 0.85 + profile.aggression * 0.2 : 0.25);
  intent.debugLabel = intent.weaponModeRequest === 'gun' ? 'boss-ranged-advance' : 'boss-pressure-step';
  return intent;
}
