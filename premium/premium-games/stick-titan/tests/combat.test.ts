import { describe, expect, it } from 'vitest';
import { chooseBossIntent, chooseFighterIntent } from '../src/game/ai';
import {
  MIN_ATTACK_INTERVAL,
  activateOverdrive,
  activateRage,
  addRage,
  applyHitPause,
  createBossState,
  createCombatState,
  createDefenseState,
  createGunState,
  createPowerState,
  createRageState,
  createSlowMoState,
  createUtilityState,
  createWeaponSwitchState,
  crossedNearDefeatThreshold,
  requestDirectAttack,
  requestPlayerAttack,
  requestWeaponSwitch,
  startDash,
  startReload,
  startWeaponSwitch,
  tickBossState,
  tickCombat,
  tickGunState,
  tickPowerState,
  tickRageState,
  tickSlowMo,
  tickWeaponSwitch,
  triggerShockwave,
  triggerSlowMo,
} from '../src/game/combat';
import type { ActorState, CharacterMotorConfig, OpponentArchetype, TeamTag, WeaponMode } from '../src/game/types';

const motor: CharacterMotorConfig = {
  acceleration: 20,
  deceleration: 24,
  maxSpeed: 4,
  sprintSpeed: 4,
  jumpVelocity: 8,
  gravity: 28,
  fallGravityMultiplier: 1.3,
  airControl: 0.4,
  turnSpeed: 12,
};

function createActor(
  team: TeamTag,
  archetype: OpponentArchetype,
  x: number,
  weaponMode: WeaponMode = 'sword',
): ActorState {
  return {
    id: `${team}-${archetype}`,
    team,
    opponentArchetype: archetype,
    position: { x, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    facing: team === 'player' ? Math.PI / 2 : -Math.PI / 2,
    grounded: true,
    health: archetype === 'boss' ? 450 : 120,
    maxHealth: archetype === 'boss' ? 450 : 120,
    radius: archetype === 'boss' ? 0.62 : 0.44,
    height: archetype === 'boss' ? 2.7 : 2.2,
    motor,
    combat: createCombatState(),
    defense: createDefenseState(),
    air: {
      launched: false,
      juggleHits: 0,
      knockdownTimer: 0,
    },
    weaponMode,
    weaponSwitch: createWeaponSwitchState(),
    gun: createGunState(),
    utility: createUtilityState(),
    power: createPowerState(),
    rage: createRageState(),
    boss: archetype === 'boss' ? createBossState() : null,
    hitReactTimer: 0,
    aiProfileId: archetype === 'boss' ? 'boss-test' : 'fighter-test',
    aiLoadout: archetype === 'boss' ? ['power', 'sword', 'gun'] : ['sword', 'power'],
    patternMemory: {
      recentStarters: [],
      repeatedStarter: null,
      repeatedCount: 0,
      countersTriggered: 0,
    },
    presentationMode: '2_5d',
    silhouette: false,
    animation: {
      pose: 'idle',
      basePose: 'idle',
      overlayPose: null,
      timer: 0,
      blend: 1,
      transitionProgress: 1,
      impactStrength: 0,
      celebrating: false,
      celebrationTime: 0,
    },
  };
}

describe('2.5D combo flow', () => {
  it('chains sword light attacks into the 3-hit finisher', () => {
    const combat = createCombatState();

    expect(requestPlayerAttack(combat, 0, 'sword', 'light', false)).toBe(true);
    tickCombat(combat, 0.2, 0.2);
    expect(requestPlayerAttack(combat, 0.2, 'sword', 'light', false)).toBe(true);
    expect(combat.queuedAttack).toBe('sword_light2');

    tickCombat(combat, 0.22, 0.42);
    expect(combat.attackName).toBe('sword_light2');

    tickCombat(combat, 0.2, 0.62);
    expect(requestPlayerAttack(combat, 0.62, 'sword', 'light', false)).toBe(true);
    expect(combat.queuedAttack).toBe('sword_light3');

    tickCombat(combat, 0.26, 0.88);
    expect(combat.attackName).toBe('sword_light3');
    expect(combat.comboIndex).toBe(3);
  });

  it('branches light into heavy launcher when buffered in the combo window', () => {
    const combat = createCombatState();

    expect(requestPlayerAttack(combat, 0, 'sword', 'light', false)).toBe(true);
    tickCombat(combat, 0.18, 0.18);
    expect(requestPlayerAttack(combat, 0.18, 'sword', 'heavy', false)).toBe(true);
    expect(combat.queuedAttack).toBe('sword_launcher');
  });

  it('respects the minimum opener delay for direct attacks', () => {
    const combat = createCombatState();
    combat.lastAttackStartedAt = 1;

    expect(requestDirectAttack(combat, 1 + MIN_ATTACK_INTERVAL - 0.01, 'boss_heavy')).toBe(false);
    expect(requestDirectAttack(combat, 1 + MIN_ATTACK_INTERVAL, 'boss_heavy')).toBe(true);
  });

  it('extends hit pause using the larger duration', () => {
    expect(applyHitPause(0.03, 0.08)).toBe(0.08);
    expect(applyHitPause(0.09, 0.05)).toBe(0.09);
  });
});

describe('weapon, dash, and gun state', () => {
  it('buffers and completes weapon switching with the configured delay', () => {
    const switchState = createWeaponSwitchState();

    expect(requestWeaponSwitch(switchState, 'sword', 'gun')).toBe(true);
    expect(switchState.queuedMode).toBe('gun');

    startWeaponSwitch(switchState, 'gun');
    expect(tickWeaponSwitch(switchState, 0.1)).toBeNull();
    expect(tickWeaponSwitch(switchState, 0.1)).toBe('gun');
    expect(switchState.active).toBe(false);
  });

  it('starts a dash with invulnerability and cooldown', () => {
    const defense = createDefenseState();

    expect(startDash(defense, 1)).toBe(true);
    expect(defense.dashTimer).toBeGreaterThan(0);
    expect(defense.invincibleTimer).toBeGreaterThan(0);
    expect(defense.dashCooldown).toBeGreaterThan(0);
  });

  it('reloads the rifle magazine after the reload timer finishes', () => {
    const gun = createGunState();
    gun.ammoInMagazine = 3;
    gun.reserveAmmo = 9;

    expect(startReload(gun)).toBe(true);
    tickGunState(gun, 0.5);
    expect(gun.ammoInMagazine).toBe(3);

    tickGunState(gun, 0.61);
    expect(gun.reloadTimer).toBeCloseTo(0, 10);
    expect(gun.ammoInMagazine).toBe(gun.magazineSize);
    expect(gun.reserveAmmo).toBe(0);
  });
});

describe('power, rage, and slow motion', () => {
  it('activates and expires overdrive cleanly', () => {
    const power = createPowerState();

    expect(activateOverdrive(power)).toBe(true);
    tickPowerState(power, 3, true);
    expect(power.overdriveActive).toBe(true);

    tickPowerState(power, 4, true);
    expect(power.overdriveActive).toBe(false);
    expect(power.overdriveTimer).toBe(0);
  });

  it('activates rage at full meter and enforces the shockwave cooldown', () => {
    const rage = createRageState();
    addRage(rage, 100);

    expect(activateRage(rage)).toBe(true);
    expect(triggerShockwave(rage)).toBe(true);
    expect(triggerShockwave(rage)).toBe(false);

    tickRageState(rage, 7);
    expect(rage.active).toBe(false);
    expect(rage.cooldownTimer).toBeGreaterThan(0);

    tickRageState(rage, 14);
    expect(rage.cooldownTimer).toBe(0);
  });

  it('smoothly returns slow motion to normal speed', () => {
    const slowMo = createSlowMoState();
    triggerSlowMo(slowMo, 0.3, 0.1, 6);

    expect(tickSlowMo(slowMo, 0.05)).toBe(0.3);
    const recoveringScale = tickSlowMo(slowMo, 0.2);
    expect(recoveringScale).toBeGreaterThan(0.3);
    expect(recoveringScale).toBeLessThan(1);
  });

  it('guards the near-defeat slow motion trigger', () => {
    expect(crossedNearDefeatThreshold(70, 12, 100, false)).toBe(true);
    expect(crossedNearDefeatThreshold(14, 10, 100, false)).toBe(true);
    expect(crossedNearDefeatThreshold(70, 12, 100, true)).toBe(false);
  });
});

describe('2.5D AI intent', () => {
  it('transitions boss phases at the configured health thresholds', () => {
    const boss = createBossState();

    expect(tickBossState(boss, 0.1, 0.69)).toBe(true);
    expect(boss.phase).toBe('phase2');

    expect(tickBossState(boss, 0.1, 0.34)).toBe(true);
    expect(boss.phase).toBe('phase3');
  });

  it('fighter AI advances on the same lane and attacks when close', () => {
    const fighter = createActor('opponent', 'fighter', -4, 'power');
    const player = createActor('player', 'fighter', 3);
    const farIntent = chooseFighterIntent(fighter, player, 0);
    expect(farIntent.moveX).toBeGreaterThan(0);
    expect(farIntent.attackName).toBeNull();

    fighter.position.x = 1.5;
    const closeIntent = chooseFighterIntent(fighter, player, 0.8);
    expect(closeIntent.attackName).not.toBeNull();
  });

  it('fighter AI stays melee-first above the low-health gun threshold', () => {
    const fighter = createActor('opponent', 'fighter', -3.8, 'sword');
    fighter.aiLoadout = ['gun', 'sword'];
    fighter.health = 120;
    fighter.maxHealth = 120;
    const player = createActor('player', 'fighter', 2.6);
    const intent = chooseFighterIntent(fighter, player, 0.4);
    expect(intent.weaponModeRequest).not.toBe('gun');
  });

  it('fighter AI only unlocks gun at mixed or desperation health when spacing is wide enough', () => {
    const fighter = createActor('opponent', 'fighter', -1.2, 'sword');
    fighter.aiLoadout = ['gun', 'sword', 'power'];
    fighter.health = 40;
    fighter.maxHealth = 100;
    const player = createActor('player', 'fighter', 0.1);

    const closeIntent = chooseFighterIntent(fighter, player, 0.5);
    expect(closeIntent.weaponModeRequest).not.toBe('gun');

    player.position.x = 1.8;
    fighter.position.x = -1.6;
    const wideIntent = chooseFighterIntent(fighter, player, 0.9);
    expect(['gun', 'power', 'sword']).toContain(wideIntent.weaponModeRequest ?? 'sword');
  });

  it('boss AI moves on X only and attacks when close enough', () => {
    const boss = createActor('opponent', 'boss', -4, 'power');
    const player = createActor('player', 'fighter', 4);
    const farIntent = chooseBossIntent(boss, player, 0);
    expect(farIntent.moveX).toBeGreaterThan(0);
    expect(farIntent.dashDirection).toBe(0);

    boss.position.x = -0.8;
    player.position.x = 0.3;
    boss.boss!.attackCooldown = 0;
    const closeIntent = chooseBossIntent(boss, player, 0.75);
    expect(closeIntent.attackName).not.toBeNull();
  });

  it('boss AI does not overuse gun in phase 1 spacing', () => {
    const boss = createActor('opponent', 'boss', -4.5, 'power');
    boss.boss!.phase = 'phase1';
    const player = createActor('player', 'fighter', 3.8);
    const intent = chooseBossIntent(boss, player, 0.35);
    expect(intent.weaponModeRequest).not.toBe('gun');
  });

  it('boss AI reserves gun pressure for late phases and wider spacing', () => {
    const boss = createActor('opponent', 'boss', -0.9, 'power');
    boss.boss!.phase = 'phase3';
    boss.health = 140;
    boss.maxHealth = 400;
    const player = createActor('player', 'fighter', 0.7);

    const closeIntent = chooseBossIntent(boss, player, 1.1);
    expect(closeIntent.weaponModeRequest).not.toBe('gun');

    player.position.x = 3.1;
    boss.position.x = -1.1;
    const wideIntent = chooseBossIntent(boss, player, 1.6);
    expect(['gun', 'power']).toContain(wideIntent.weaponModeRequest ?? 'power');
  });
});
