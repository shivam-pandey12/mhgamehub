import type {
  ActorState,
  AttackDefinition,
  AttackInput,
  AttackName,
  BossPhase,
  BossState,
  CancelWindow,
  ComboInputToken,
  ComboMatch,
  ComboPattern,
  CombatState,
  DefenseState,
  FinisherState,
  GunState,
  PowerState,
  RageState,
  SlowMoState,
  UtilityState,
  WeaponMode,
  WeaponSwitchState,
} from './types';

export const MIN_ATTACK_INTERVAL = 0.15;
export const INPUT_BUFFER_WINDOW = 0.3;
export const INPUT_BUFFER_LIMIT = 8;
export const WEAPON_SWITCH_DURATION = 0.2;
export const NEAR_DEFEAT_THRESHOLD_RATIO = 0.15;
export const RIFLE_MAGAZINE_SIZE = 12;
export const RIFLE_RELOAD_DURATION = 1.0;
export const RIFLE_FIRE_INTERVAL = 0.16;
export const POWER_OVERDRIVE_DURATION = 6.5;
export const RAGE_MAX_METER = 100;
export const RAGE_DURATION = 7;
export const RAGE_COOLDOWN = 14;
export const SHOCKWAVE_COOLDOWN = 2.25;
export const BOSS_MAX_HEALTH = 450;
export const PHASE_TWO_RATIO = 0.7;
export const PHASE_THREE_RATIO = 0.35;
export const DASH_DURATION = 0.18;
export const DASH_IFRAMES = 0.1;
export const DASH_COOLDOWN = 0.46;
export const GUARD_BREAK_STUN = 0.35;
export const PLAYER_MAGAZINE_SIZE = 12;
export const PLAYER_RESERVE_AMMO = 36;
export const FIGHTER_MAGAZINE_SIZE = 10;
export const FIGHTER_RESERVE_AMMO = 20;
export const BOSS_MAGAZINE_SIZE = 12;
export const BOSS_RESERVE_AMMO = 30;
export const GRENADE_LIMIT = 2;
export const BOMB_LIMIT = 1;
export const GRENADE_COOLDOWN = 0.9;
export const BOMB_COOLDOWN = 1.35;

const LIGHT_CANCEL: CancelWindow = {
  start: 0.1,
  end: 0.22,
  allowBlock: true,
  allowDash: true,
  allowSpecial: true,
  allowComboFollowup: true,
};

const HEAVY_WHIFF_BLOCK_CANCEL: CancelWindow = {
  start: 0.14,
  end: 0.24,
  allowBlock: true,
  allowDash: false,
  allowSpecial: false,
  allowComboFollowup: false,
};

const SPECIAL_CONFIRM_CANCEL: CancelWindow = {
  start: 0.16,
  end: 0.28,
  allowBlock: false,
  allowDash: false,
  allowSpecial: true,
  allowComboFollowup: false,
  requireHitConfirm: true,
};

const ATTACK_DEFINITIONS = new Map<AttackName, AttackDefinition>();
const COMBO_PATTERNS: ComboPattern[] = [];

const COMBO_INDEX_BY_ATTACK: Partial<Record<AttackName, number>> = {
  sword_light1: 1,
  sword_light2: 2,
  sword_light3: 3,
  gun_light1: 1,
  gun_light2: 2,
  power_light1: 1,
  power_light2: 2,
  fighter_light1: 1,
  fighter_light2: 2,
  boss_light1: 1,
  boss_light2: 2,
};

function createHitConfirmState(): CombatState['hitConfirm'] {
  return {
    comboContinuable: false,
    lastHitConnectedAt: -999,
    lastConnectedAttack: null,
    lastStarter: null,
  };
}

export function createCombatState(): CombatState {
  return {
    phase: 'idle',
    attackName: null,
    comboIndex: 0,
    phaseTime: 0,
    lastAttackStartedAt: -999,
    queuedAttack: null,
    hitConnected: false,
    hitStunTimer: 0,
    switchLockTimer: 0,
    reloadLockTimer: 0,
    inputBuffer: [],
    activeComboRoute: null,
    lastComboMatch: null,
    lastPrecisionBonusAt: -999,
    hitConfirm: createHitConfirmState(),
  };
}

export function createDefenseState(): DefenseState {
  return {
    blocking: false,
    guardBreakTimer: 0,
    dashTimer: 0,
    dashDirection: 0,
    dashCooldown: 0,
    invincibleTimer: 0,
    blockCooldown: 0,
    successfulBlocks: 0,
  };
}

export function createWeaponSwitchState(): WeaponSwitchState {
  return {
    active: false,
    targetMode: null,
    queuedMode: null,
    timer: 0,
    duration: WEAPON_SWITCH_DURATION,
  };
}

export function createGunState(options?: { magazineSize?: number; reserveAmmo?: number | null; reloadDuration?: number }): GunState {
  const magazineSize = options?.magazineSize ?? PLAYER_MAGAZINE_SIZE;
  return {
    magazineSize,
    ammoInMagazine: magazineSize,
    reserveAmmo: options?.reserveAmmo ?? PLAYER_RESERVE_AMMO,
    reloadDuration: options?.reloadDuration ?? RIFLE_RELOAD_DURATION,
    reloadTimer: 0,
    fireInterval: RIFLE_FIRE_INTERVAL,
    fireCooldown: 0,
    recoil: 0,
    muzzleFlashTimer: 0,
    shotAcceptedAt: -999,
  };
}

export function createUtilityState(): UtilityState {
  return {
    grenades: GRENADE_LIMIT,
    bombs: BOMB_LIMIT,
    grenadeCooldown: 0,
    bombCooldown: 0,
    flashTimer: 0,
  };
}

export function createPowerState(): PowerState {
  return {
    overdriveActive: false,
    overdriveTimer: 0,
    overdriveDuration: POWER_OVERDRIVE_DURATION,
    glowIntensity: 0,
  };
}

export function createRageState(): RageState {
  return {
    meter: 0,
    maxMeter: RAGE_MAX_METER,
    active: false,
    timer: 0,
    duration: RAGE_DURATION,
    cooldownTimer: 0,
    cooldownDuration: RAGE_COOLDOWN,
    shockwaveCooldown: 0,
    shockwaveInterval: SHOCKWAVE_COOLDOWN,
    tintStrength: 0,
  };
}

export function createSlowMoState(): SlowMoState {
  return {
    active: false,
    currentScale: 1,
    targetScale: 1,
    holdTimer: 0,
    recoveryRate: 6,
    nearDefeatTriggered: false,
  };
}

export function createBossState(): BossState {
  return {
    phase: 'phase1',
    attackCooldown: 0,
    heavyCooldown: 0,
    dashCooldown: 0,
    blockCooldown: 0,
    dodgeCooldown: 0,
    phaseTransitionTimer: 0,
    finisherEligible: false,
    finisherWindowTimer: 0,
    lastAttack: null,
  };
}

export function createFinisherState(): FinisherState {
  return {
    available: false,
    promptVisible: false,
    executing: false,
    timer: 0,
    duration: 1.05,
    windowTimer: 0,
    impactTriggered: false,
    timingProgress: 0,
    timingSuccess: false,
  };
}

function combatPriorityValue(priority: AttackDefinition['priority']): number {
  switch (priority) {
    case 'ultimate':
      return 4;
    case 'special':
      return 3;
    case 'combo':
      return 2;
    case 'basic':
    default:
      return 1;
  }
}

function patternPriorityValue(priority: ComboPattern['priority']): number {
  switch (priority) {
    case 'ultimate':
      return 3;
    case 'special':
      return 2;
    case 'combo':
    default:
      return 1;
  }
}

export function getAttackDefinition(name: AttackName | null): AttackDefinition | null {
  if (!name) {
    return null;
  }
  return ATTACK_DEFINITIONS.get(name) ?? null;
}

export function attackDuration(definition: AttackDefinition): number {
  return definition.startup + definition.active + definition.recovery;
}

export function isCombatNeutral(combat: CombatState): boolean {
  return combat.attackName === null && combat.hitStunTimer <= 0 && combat.switchLockTimer <= 0 && combat.reloadLockTimer <= 0;
}

export function isAttackActive(combat: CombatState): boolean {
  if (!combat.attackName) {
    return false;
  }
  const attack = getAttackDefinition(combat.attackName);
  if (!attack) {
    return false;
  }
  return combat.phaseTime >= attack.startup && combat.phaseTime < attack.startup + attack.active;
}

export function getPushSpeed(combat: CombatState): number {
  const attack = getAttackDefinition(combat.attackName);
  if (!attack) {
    return 0;
  }
  return combat.phase === 'recovery' ? attack.pushSpeed * 0.2 : attack.pushSpeed;
}

export function getCombatPriority(attack: AttackDefinition, rageActive: boolean): number {
  return (rageActive ? 1 : 0) + combatPriorityValue(attack.priority);
}

export function getBossPhaseForRatio(healthRatio: number): BossPhase {
  if (healthRatio <= PHASE_THREE_RATIO) {
    return 'phase3';
  }
  if (healthRatio <= PHASE_TWO_RATIO) {
    return 'phase2';
  }
  return 'phase1';
}

function defineAttack(
  name: AttackName,
  family: AttackDefinition['family'],
  input: AttackInput,
  config: Partial<AttackDefinition>,
): void {
  ATTACK_DEFINITIONS.set(name, {
    name,
    family,
    input,
    startup: 0.08,
    active: 0.06,
    recovery: 0.1,
    comboBufferStart: 0.1,
    comboBufferEnd: 0.2,
    range: 1.1,
    height: 1.4,
    forwardOffset: 0.68,
    damage: 10,
    chipDamage: 2,
    hitPause: 0.05,
    hitStun: 0.16,
    pushSpeed: 2.8,
    knockback: 4.4,
    verticalKnockback: 0.4,
    shake: 0.12,
    priority: 'basic',
    impactKind: family === 'gun' ? 'gun' : family === 'boss' ? 'boss' : family === 'power' ? 'power' : 'sword',
    canBeBlocked: true,
    canBeDodged: true,
    cancelWindow: LIGHT_CANCEL,
    ...config,
  });
}

function definePattern(pattern: ComboPattern): void {
  COMBO_PATTERNS.push(pattern);
}

defineAttack('sword_light1', 'sword', 'light', {
  damage: 11,
});
defineAttack('sword_light2', 'sword', 'light', {
  damage: 13,
  range: 1.26,
  forwardOffset: 0.76,
  hitStun: 0.18,
  knockback: 4.8,
  priority: 'combo',
});
defineAttack('sword_light3', 'sword', 'light', {
  startup: 0.1,
  active: 0.07,
  recovery: 0.15,
  damage: 17,
  range: 1.4,
  height: 1.55,
  forwardOffset: 0.92,
  hitPause: 0.08,
  hitStun: 0.24,
  pushSpeed: 4.3,
  knockback: 7.2,
  verticalKnockback: 1.8,
  shake: 0.22,
  priority: 'combo',
  launches: true,
  grantsFinisherVulnerability: true,
  slowMoScale: 0.28,
  slowMoHold: 0.12,
  patternId: 'sword_chain',
  cancelWindow: null,
});
defineAttack('sword_launcher', 'sword', 'heavy', {
  startup: 0.1,
  active: 0.07,
  recovery: 0.13,
  damage: 15,
  range: 1.32,
  forwardOffset: 0.84,
  hitPause: 0.07,
  hitStun: 0.26,
  pushSpeed: 4,
  knockback: 5.6,
  verticalKnockback: 6.2,
  shake: 0.18,
  priority: 'combo',
  launches: true,
  grantsFinisherVulnerability: true,
  patternId: 'sword_launcher',
  cancelWindow: null,
});
defineAttack('sword_heavy', 'sword', 'heavy', {
  startup: 0.12,
  active: 0.07,
  recovery: 0.13,
  damage: 16,
  range: 1.34,
  height: 1.55,
  forwardOffset: 0.9,
  hitPause: 0.075,
  hitStun: 0.26,
  pushSpeed: 4.1,
  knockback: 6.8,
  verticalKnockback: 0.9,
  shake: 0.2,
  priority: 'combo',
  blockBreak: true,
  grantsFinisherVulnerability: true,
  patternId: 'sword_dash_strike',
  cancelWindow: HEAVY_WHIFF_BLOCK_CANCEL,
});
defineAttack('sword_special', 'sword', 'special', {
  startup: 0.11,
  active: 0.08,
  recovery: 0.13,
  damage: 22,
  range: 1.5,
  height: 1.7,
  forwardOffset: 1,
  chipDamage: 6,
  hitPause: 0.085,
  hitStun: 0.3,
  pushSpeed: 4.6,
  knockback: 8.2,
  verticalKnockback: 2.8,
  shake: 0.25,
  priority: 'special',
  impactKind: 'special',
  blockBreak: true,
  launches: true,
  grantsFinisherVulnerability: true,
  patternId: 'sword_special_route',
  cancelWindow: SPECIAL_CONFIRM_CANCEL,
});
defineAttack('sword_air', 'sword', 'light', {
  airOnly: true,
  verticalKnockback: 2.4,
  launches: true,
  cancelWindow: null,
});

defineAttack('gun_light1', 'gun', 'light', {
  startup: 0.07,
  active: 0.04,
  recovery: 0.1,
  range: 6,
  height: 1.2,
  forwardOffset: 0.4,
  damage: 10,
  hitPause: 0.04,
  hitStun: 0.14,
  pushSpeed: 1.2,
  knockback: 3.8,
  projectileSpeed: 16,
  projectileLifetime: 0.8,
  projectileSize: 0.16,
  cancelWindow: LIGHT_CANCEL,
});
defineAttack('gun_light2', 'gun', 'light', {
  startup: 0.07,
  active: 0.04,
  recovery: 0.1,
  range: 6.2,
  height: 1.2,
  forwardOffset: 0.42,
  damage: 12,
  hitPause: 0.045,
  hitStun: 0.16,
  pushSpeed: 1.3,
  knockback: 4.2,
  priority: 'combo',
  projectileSpeed: 17,
  projectileLifetime: 0.82,
  projectileSize: 0.18,
  patternId: 'gun_chain',
  cancelWindow: LIGHT_CANCEL,
});
defineAttack('gun_heavy', 'gun', 'heavy', {
  startup: 0.1,
  active: 0.05,
  recovery: 0.14,
  range: 6.5,
  height: 1.25,
  forwardOffset: 0.44,
  damage: 16,
  chipDamage: 5,
  hitPause: 0.06,
  hitStun: 0.22,
  pushSpeed: 1.6,
  knockback: 6.6,
  verticalKnockback: 1.5,
  shake: 0.18,
  priority: 'combo',
  blockBreak: true,
  launches: true,
  projectileSpeed: 19,
  projectileLifetime: 0.86,
  projectileSize: 0.2,
  patternId: 'gun_dash_strike',
  cancelWindow: HEAVY_WHIFF_BLOCK_CANCEL,
});
defineAttack('gun_special', 'gun', 'special', {
  startup: 0.09,
  active: 0.05,
  recovery: 0.15,
  range: 6.6,
  height: 1.3,
  forwardOffset: 0.46,
  damage: 20,
  chipDamage: 6,
  hitPause: 0.075,
  hitStun: 0.24,
  knockback: 7.4,
  verticalKnockback: 2.2,
  shake: 0.22,
  priority: 'special',
  impactKind: 'special',
  blockBreak: true,
  launches: true,
  projectileSpeed: 21,
  projectileLifetime: 0.9,
  projectileSize: 0.24,
  patternId: 'gun_special_route',
  cancelWindow: SPECIAL_CONFIRM_CANCEL,
});
defineAttack('gun_air', 'gun', 'light', {
  startup: 0.07,
  active: 0.04,
  recovery: 0.1,
  range: 5.8,
  height: 1.1,
  forwardOffset: 0.35,
  damage: 11,
  hitPause: 0.04,
  projectileSpeed: 15,
  projectileLifetime: 0.7,
  projectileSize: 0.16,
  airOnly: true,
  cancelWindow: null,
});

defineAttack('power_light1', 'power', 'light', {
  damage: 13,
  hitStun: 0.18,
  knockback: 4.6,
  impactKind: 'power',
});
defineAttack('power_light2', 'power', 'light', {
  startup: 0.09,
  recovery: 0.11,
  damage: 16,
  range: 1.18,
  forwardOffset: 0.72,
  hitPause: 0.06,
  hitStun: 0.2,
  pushSpeed: 3,
  knockback: 5.4,
  verticalKnockback: 0.9,
  shake: 0.16,
  priority: 'combo',
  impactKind: 'power',
});
defineAttack('power_launcher', 'power', 'heavy', {
  startup: 0.11,
  recovery: 0.12,
  damage: 18,
  range: 1.2,
  forwardOffset: 0.78,
  hitPause: 0.07,
  hitStun: 0.24,
  pushSpeed: 3.8,
  knockback: 5.8,
  verticalKnockback: 6.6,
  shake: 0.19,
  priority: 'combo',
  impactKind: 'power',
  launches: true,
  grantsFinisherVulnerability: true,
  patternId: 'power_launcher',
  cancelWindow: null,
});
defineAttack('power_heavy', 'power', 'heavy', {
  startup: 0.12,
  recovery: 0.13,
  damage: 21,
  range: 1.25,
  height: 1.5,
  forwardOffset: 0.82,
  chipDamage: 5,
  hitPause: 0.08,
  hitStun: 0.28,
  pushSpeed: 4,
  knockback: 7.4,
  verticalKnockback: 2.1,
  shake: 0.22,
  priority: 'combo',
  impactKind: 'power',
  blockBreak: true,
  launches: true,
  grantsFinisherVulnerability: true,
  patternId: 'power_dash_strike',
  cancelWindow: HEAVY_WHIFF_BLOCK_CANCEL,
});
defineAttack('power_special', 'power', 'special', {
  startup: 0.1,
  active: 0.08,
  recovery: 0.14,
  damage: 24,
  range: 1.38,
  height: 1.6,
  forwardOffset: 0.92,
  chipDamage: 6,
  hitPause: 0.09,
  hitStun: 0.3,
  pushSpeed: 4.4,
  knockback: 8.6,
  verticalKnockback: 3,
  shake: 0.26,
  priority: 'special',
  impactKind: 'electric',
  blockBreak: true,
  launches: true,
  grantsFinisherVulnerability: true,
  patternId: 'power_special_route',
  cancelWindow: SPECIAL_CONFIRM_CANCEL,
});
defineAttack('power_air', 'power', 'light', {
  damage: 12,
  impactKind: 'power',
  verticalKnockback: 2.8,
  airOnly: true,
  launches: true,
  cancelWindow: null,
});

defineAttack('fighter_light1', 'fighter', 'light', {
  damage: 9,
  impactKind: 'power',
});
defineAttack('fighter_light2', 'fighter', 'light', {
  damage: 11,
  hitStun: 0.18,
  knockback: 4.6,
  priority: 'combo',
  impactKind: 'power',
});
defineAttack('fighter_heavy', 'fighter', 'heavy', {
  startup: 0.11,
  recovery: 0.13,
  damage: 16,
  range: 1.18,
  forwardOffset: 0.76,
  chipDamage: 4,
  hitPause: 0.065,
  hitStun: 0.22,
  pushSpeed: 3.4,
  knockback: 6.2,
  verticalKnockback: 1.1,
  shake: 0.16,
  priority: 'combo',
  impactKind: 'power',
  blockBreak: true,
  grantsFinisherVulnerability: true,
  cancelWindow: null,
});
defineAttack('fighter_launcher', 'fighter', 'heavy', {
  startup: 0.1,
  recovery: 0.12,
  damage: 14,
  range: 1.18,
  forwardOffset: 0.72,
  chipDamage: 3,
  hitPause: 0.06,
  hitStun: 0.22,
  pushSpeed: 3.2,
  knockback: 5.4,
  verticalKnockback: 5.9,
  shake: 0.15,
  priority: 'combo',
  impactKind: 'power',
  launches: true,
  grantsFinisherVulnerability: true,
  cancelWindow: null,
});
defineAttack('fighter_special', 'fighter', 'special', {
  startup: 0.1,
  active: 0.07,
  recovery: 0.13,
  damage: 18,
  range: 1.28,
  height: 1.5,
  forwardOffset: 0.84,
  chipDamage: 5,
  hitPause: 0.075,
  hitStun: 0.24,
  pushSpeed: 3.8,
  knockback: 7,
  verticalKnockback: 2.2,
  shake: 0.2,
  priority: 'special',
  impactKind: 'special',
  blockBreak: true,
  launches: true,
  grantsFinisherVulnerability: true,
  cancelWindow: null,
});
defineAttack('fighter_air', 'fighter', 'light', {
  damage: 10,
  impactKind: 'power',
  verticalKnockback: 2.4,
  airOnly: true,
  launches: true,
  cancelWindow: null,
});

defineAttack('boss_light1', 'boss', 'light', {
  range: 1.22,
  height: 1.5,
  forwardOffset: 0.76,
  damage: 10,
  impactKind: 'boss',
});
defineAttack('boss_light2', 'boss', 'light', {
  range: 1.28,
  height: 1.55,
  forwardOffset: 0.82,
  damage: 12,
  hitPause: 0.055,
  hitStun: 0.18,
  pushSpeed: 3.1,
  knockback: 5.2,
  verticalKnockback: 0.8,
  shake: 0.14,
  priority: 'combo',
  impactKind: 'boss',
});
defineAttack('boss_heavy', 'boss', 'heavy', {
  startup: 0.12,
  active: 0.07,
  recovery: 0.15,
  damage: 20,
  range: 1.42,
  height: 1.7,
  forwardOffset: 0.94,
  chipDamage: 5,
  hitPause: 0.08,
  hitStun: 0.28,
  pushSpeed: 4.2,
  knockback: 7.8,
  verticalKnockback: 2.4,
  shake: 0.22,
  priority: 'combo',
  impactKind: 'boss',
  blockBreak: true,
  launches: true,
  grantsFinisherVulnerability: true,
  cancelWindow: null,
});
defineAttack('boss_launcher', 'boss', 'heavy', {
  startup: 0.11,
  active: 0.07,
  recovery: 0.14,
  damage: 17,
  range: 1.36,
  height: 1.7,
  forwardOffset: 0.9,
  chipDamage: 4,
  hitPause: 0.075,
  hitStun: 0.26,
  pushSpeed: 3.8,
  knockback: 6.8,
  verticalKnockback: 6.5,
  shake: 0.2,
  priority: 'combo',
  impactKind: 'boss',
  launches: true,
  grantsFinisherVulnerability: true,
  cancelWindow: null,
});
defineAttack('boss_special', 'boss', 'special', {
  startup: 0.12,
  active: 0.08,
  recovery: 0.15,
  damage: 22,
  range: 1.48,
  height: 1.75,
  forwardOffset: 0.98,
  chipDamage: 6,
  hitPause: 0.09,
  hitStun: 0.3,
  pushSpeed: 4.5,
  knockback: 8.4,
  verticalKnockback: 2.9,
  shake: 0.25,
  priority: 'special',
  impactKind: 'boss',
  blockBreak: true,
  launches: true,
  grantsFinisherVulnerability: true,
  cancelWindow: null,
});
defineAttack('boss_dash', 'boss', 'heavy', {
  startup: 0.09,
  active: 0.07,
  recovery: 0.13,
  damage: 18,
  range: 1.34,
  height: 1.6,
  forwardOffset: 0.92,
  chipDamage: 4,
  hitPause: 0.07,
  hitStun: 0.22,
  pushSpeed: 6.2,
  knockback: 7.2,
  verticalKnockback: 1.6,
  shake: 0.2,
  priority: 'combo',
  impactKind: 'boss',
  blockBreak: true,
  cancelWindow: null,
});

definePattern({ id: 'sword_chain', family: 'sword', name: 'Sword Chain', tokens: ['light', 'light', 'heavy'], attackName: 'sword_light3', priority: 'combo', within: 0.35, precisionWindow: 0.22, requiresHitConfirm: true, groundedOnly: true });
definePattern({ id: 'sword_launcher', family: 'sword', name: 'Sword Launcher', tokens: ['down', 'heavy'], attackName: 'sword_launcher', priority: 'combo', within: 0.32, precisionWindow: 0.22, groundedOnly: true });
definePattern({ id: 'sword_dash_strike', family: 'sword', name: 'Sword Dash Strike', tokens: ['forward', 'forward', 'heavy'], attackName: 'sword_heavy', priority: 'combo', within: 0.32, precisionWindow: 0.22, groundedOnly: true });
definePattern({ id: 'sword_special_route', family: 'sword', name: 'Sword Special', tokens: ['down', 'forward', 'special'], attackName: 'sword_special', priority: 'special', within: 0.35, precisionWindow: 0.22, groundedOnly: true });
definePattern({ id: 'gun_chain', family: 'gun', name: 'Gun Chain', tokens: ['light', 'light', 'heavy'], attackName: 'gun_heavy', priority: 'combo', within: 0.3, precisionWindow: 0.2 });
definePattern({ id: 'gun_dash_strike', family: 'gun', name: 'Gun Burst', tokens: ['forward', 'forward', 'heavy'], attackName: 'gun_heavy', priority: 'combo', within: 0.32, precisionWindow: 0.22 });
definePattern({ id: 'gun_special_route', family: 'gun', name: 'Gun Special', tokens: ['down', 'forward', 'special'], attackName: 'gun_special', priority: 'special', within: 0.35, precisionWindow: 0.22 });
definePattern({ id: 'power_launcher', family: 'power', name: 'Power Launcher', tokens: ['down', 'heavy'], attackName: 'power_launcher', priority: 'combo', within: 0.32, precisionWindow: 0.22, groundedOnly: true });
definePattern({ id: 'power_dash_strike', family: 'power', name: 'Power Dash', tokens: ['forward', 'forward', 'heavy'], attackName: 'power_heavy', priority: 'combo', within: 0.32, precisionWindow: 0.22, groundedOnly: true });
definePattern({ id: 'power_special_route', family: 'power', name: 'Power Special', tokens: ['down', 'forward', 'special'], attackName: 'power_special', priority: 'special', within: 0.35, precisionWindow: 0.22 });
definePattern({ id: 'fighter_chain', family: 'fighter', name: 'Fighter Chain', tokens: ['light', 'light', 'heavy'], attackName: 'fighter_heavy', priority: 'combo', within: 0.35, precisionWindow: 0.22, requiresHitConfirm: true });
definePattern({ id: 'fighter_launcher', family: 'fighter', name: 'Fighter Launcher', tokens: ['down', 'heavy'], attackName: 'fighter_launcher', priority: 'combo', within: 0.32, precisionWindow: 0.22 });
definePattern({ id: 'fighter_special_route', family: 'fighter', name: 'Fighter Special', tokens: ['down', 'forward', 'special'], attackName: 'fighter_special', priority: 'special', within: 0.35, precisionWindow: 0.22 });
definePattern({ id: 'boss_chain', family: 'boss', name: 'Boss Chain', tokens: ['light', 'light', 'heavy'], attackName: 'boss_heavy', priority: 'combo', within: 0.35, precisionWindow: 0.22, requiresHitConfirm: true });
definePattern({ id: 'boss_launcher', family: 'boss', name: 'Boss Launcher', tokens: ['down', 'heavy'], attackName: 'boss_launcher', priority: 'combo', within: 0.32, precisionWindow: 0.22 });
definePattern({ id: 'boss_dash_strike', family: 'boss', name: 'Boss Dash Strike', tokens: ['forward', 'forward', 'heavy'], attackName: 'boss_dash', priority: 'combo', within: 0.32, precisionWindow: 0.22 });
definePattern({ id: 'boss_special_route', family: 'boss', name: 'Boss Special', tokens: ['down', 'forward', 'special'], attackName: 'boss_special', priority: 'special', within: 0.35, precisionWindow: 0.22 });

export function canQueueCombo(combat: CombatState): boolean {
  const attack = getAttackDefinition(combat.attackName);
  if (!attack || combat.queuedAttack) {
    return false;
  }
  return combat.phaseTime >= attack.comboBufferStart && combat.phaseTime <= attack.comboBufferEnd;
}

export function canCancelInto(combat: CombatState, action: 'block' | 'dash' | 'special'): boolean {
  const attack = getAttackDefinition(combat.attackName);
  if (!attack || !attack.cancelWindow) {
    return false;
  }
  const window = attack.cancelWindow;
  if (combat.phaseTime < window.start || combat.phaseTime > window.end) {
    return false;
  }
  if (window.requireHitConfirm && !combat.hitConfirm.comboContinuable) {
    return false;
  }
  return action === 'block' ? window.allowBlock : action === 'dash' ? window.allowDash : window.allowSpecial;
}

export function cancelCombat(combat: CombatState): void {
  combat.attackName = null;
  combat.phase = 'idle';
  combat.phaseTime = 0;
  combat.queuedAttack = null;
  combat.hitConnected = false;
}

export function receiveHit(actor: ActorState, hitStun: number): void {
  actor.combat.hitStunTimer = Math.max(actor.combat.hitStunTimer, hitStun);
  actor.combat.phase = 'idle';
  actor.combat.attackName = null;
  actor.combat.phaseTime = 0;
  actor.combat.queuedAttack = null;
  actor.combat.hitConnected = false;
  actor.combat.activeComboRoute = null;
  actor.combat.lastComboMatch = null;
  actor.combat.hitConfirm.comboContinuable = false;
  actor.combat.hitConfirm.lastConnectedAttack = null;
  actor.hitReactTimer = Math.max(actor.hitReactTimer, 0.24 + hitStun * 0.4);
}

export function applyHitPause(current: number, duration: number): number {
  return Math.max(current, duration);
}

export function requestWeaponSwitch(state: WeaponSwitchState, currentMode: WeaponMode, nextMode: WeaponMode): boolean {
  if (currentMode === nextMode) {
    return false;
  }
  state.queuedMode = nextMode;
  state.targetMode = nextMode;
  return true;
}

export function startWeaponSwitch(state: WeaponSwitchState, nextMode: WeaponMode): boolean {
  if (state.active) {
    return false;
  }
  state.active = true;
  state.targetMode = nextMode;
  state.timer = state.duration;
  return true;
}

export function tickWeaponSwitch(state: WeaponSwitchState, dt: number): WeaponMode | null {
  if (!state.active) {
    return null;
  }
  state.timer = Math.max(0, state.timer - dt);
  if (state.timer > 0) {
    return null;
  }
  state.active = false;
  const mode = state.targetMode;
  state.targetMode = null;
  state.queuedMode = null;
  return mode;
}

export function tickDefenseState(state: DefenseState, dt: number): void {
  state.guardBreakTimer = Math.max(0, state.guardBreakTimer - dt);
  state.dashTimer = Math.max(0, state.dashTimer - dt);
  state.dashCooldown = Math.max(0, state.dashCooldown - dt);
  state.invincibleTimer = Math.max(0, state.invincibleTimer - dt);
  state.blockCooldown = Math.max(0, state.blockCooldown - dt);
  if (state.guardBreakTimer > 0) {
    state.blocking = false;
  }
  if (state.dashTimer === 0) {
    state.dashDirection = 0;
  }
}

export function startDash(state: DefenseState, direction: -1 | 1): boolean {
  if (state.dashTimer > 0 || state.dashCooldown > 0 || state.guardBreakTimer > 0) {
    return false;
  }
  state.dashDirection = direction;
  state.dashTimer = DASH_DURATION;
  state.invincibleTimer = DASH_IFRAMES;
  state.dashCooldown = DASH_COOLDOWN;
  state.blocking = false;
  return true;
}

export function canFireGun(gun: GunState): boolean {
  return gun.reloadTimer <= 0 && gun.fireCooldown <= 0 && gun.ammoInMagazine > 0;
}

export function fireGun(gun: GunState, time = 0): boolean {
  if (!canFireGun(gun)) {
    return false;
  }
  gun.ammoInMagazine -= 1;
  gun.fireCooldown = gun.fireInterval;
  gun.recoil = Math.min(gun.recoil + 0.28, 1);
  gun.muzzleFlashTimer = 0.09;
  gun.shotAcceptedAt = time;
  return true;
}

export function startReload(gun: GunState): boolean {
  if (gun.reloadTimer > 0 || gun.ammoInMagazine >= gun.magazineSize) {
    return false;
  }
  if (gun.reserveAmmo !== null && gun.reserveAmmo <= 0) {
    return false;
  }
  gun.reloadTimer = gun.reloadDuration;
  gun.fireCooldown = Math.max(gun.fireCooldown, 0.08);
  return true;
}

export function tickGunState(gun: GunState, dt: number): void {
  gun.fireCooldown = Math.max(0, gun.fireCooldown - dt);
  gun.muzzleFlashTimer = Math.max(0, gun.muzzleFlashTimer - dt);
  gun.recoil = Math.max(0, gun.recoil - dt * 3.2);
  if (gun.reloadTimer <= 0) {
    return;
  }
  gun.reloadTimer = Math.max(0, gun.reloadTimer - dt);
  if (gun.reloadTimer === 0) {
    if (gun.reserveAmmo === null) {
      gun.ammoInMagazine = gun.magazineSize;
      return;
    }
    const missing = Math.max(0, gun.magazineSize - gun.ammoInMagazine);
    const refill = Math.min(missing, gun.reserveAmmo);
    gun.ammoInMagazine += refill;
    gun.reserveAmmo -= refill;
  }
}

export function tickUtilityState(utility: UtilityState, dt: number): void {
  utility.grenadeCooldown = Math.max(0, utility.grenadeCooldown - dt);
  utility.bombCooldown = Math.max(0, utility.bombCooldown - dt);
  utility.flashTimer = Math.max(0, utility.flashTimer - dt);
}

export function useGrenade(utility: UtilityState): boolean {
  if (utility.grenades <= 0 || utility.grenadeCooldown > 0) {
    return false;
  }
  utility.grenades -= 1;
  utility.grenadeCooldown = GRENADE_COOLDOWN;
  utility.flashTimer = Math.max(utility.flashTimer, 0.16);
  return true;
}

export function useBomb(utility: UtilityState): boolean {
  if (utility.bombs <= 0 || utility.bombCooldown > 0) {
    return false;
  }
  utility.bombs -= 1;
  utility.bombCooldown = BOMB_COOLDOWN;
  utility.flashTimer = Math.max(utility.flashTimer, 0.22);
  return true;
}

export function activateOverdrive(power: PowerState): boolean {
  if (power.overdriveActive) {
    return false;
  }
  power.overdriveActive = true;
  power.overdriveTimer = power.overdriveDuration;
  return true;
}

export function tickPowerState(power: PowerState, dt: number, activeWeapon: boolean): void {
  if (power.overdriveActive) {
    power.overdriveTimer = Math.max(0, power.overdriveTimer - dt);
    if (power.overdriveTimer === 0) {
      power.overdriveActive = false;
    }
  }
  const targetGlow = activeWeapon ? (power.overdriveActive ? 1 : 0.22) : 0;
  power.glowIntensity += (targetGlow - power.glowIntensity) * Math.min(1, dt * 9);
}

export function addRage(rage: RageState, amount: number): void {
  if (rage.active) {
    return;
  }
  rage.meter = Math.max(0, Math.min(rage.maxMeter, rage.meter + amount));
}

export function activateRage(rage: RageState): boolean {
  if (rage.active || rage.cooldownTimer > 0 || rage.meter < rage.maxMeter) {
    return false;
  }
  rage.active = true;
  rage.timer = rage.duration;
  rage.meter = 0;
  rage.tintStrength = 1;
  return true;
}

export function tickRageState(rage: RageState, dt: number): void {
  rage.cooldownTimer = Math.max(0, rage.cooldownTimer - dt);
  rage.shockwaveCooldown = Math.max(0, rage.shockwaveCooldown - dt);
  if (rage.active) {
    rage.timer = Math.max(0, rage.timer - dt);
    if (rage.timer === 0) {
      rage.active = false;
      rage.cooldownTimer = rage.cooldownDuration;
    }
  }
  const targetTint = rage.active ? 1 : 0;
  rage.tintStrength += (targetTint - rage.tintStrength) * Math.min(1, dt * 8);
}

export function triggerShockwave(rage: RageState): boolean {
  if (!rage.active || rage.shockwaveCooldown > 0) {
    return false;
  }
  rage.shockwaveCooldown = rage.shockwaveInterval;
  return true;
}

export function tickBossState(boss: BossState, dt: number, healthRatio: number): boolean {
  boss.attackCooldown = Math.max(0, boss.attackCooldown - dt);
  boss.heavyCooldown = Math.max(0, boss.heavyCooldown - dt);
  boss.dashCooldown = Math.max(0, boss.dashCooldown - dt);
  boss.blockCooldown = Math.max(0, boss.blockCooldown - dt);
  boss.dodgeCooldown = Math.max(0, boss.dodgeCooldown - dt);
  boss.phaseTransitionTimer = Math.max(0, boss.phaseTransitionTimer - dt);
  boss.finisherWindowTimer = Math.max(0, boss.finisherWindowTimer - dt);
  if (boss.finisherWindowTimer === 0) {
    boss.finisherEligible = false;
  }
  const previous = boss.phase;
  boss.phase = getBossPhaseForRatio(healthRatio);
  if (previous !== boss.phase) {
    boss.phaseTransitionTimer = 0.4;
    return true;
  }
  return false;
}

export function markBossFinisherEligible(boss: BossState): void {
  boss.finisherEligible = true;
  boss.finisherWindowTimer = 1.1;
}

export function crossedNearDefeatThreshold(previousHealth: number, currentHealth: number, maxHealth: number, alreadyTriggered: boolean): boolean {
  if (alreadyTriggered) {
    return false;
  }
  const threshold = maxHealth * NEAR_DEFEAT_THRESHOLD_RATIO;
  return currentHealth <= threshold && previousHealth > currentHealth;
}

export function triggerSlowMo(state: SlowMoState, scale: number, hold: number, recoveryRate: number): void {
  state.active = true;
  state.currentScale = scale;
  state.targetScale = scale;
  state.holdTimer = hold;
  state.recoveryRate = recoveryRate;
}

export function tickSlowMo(state: SlowMoState, dt: number): number {
  if (!state.active) {
    return 1;
  }
  if (state.holdTimer > 0) {
    const remainingHold = state.holdTimer;
    state.holdTimer = Math.max(0, remainingHold - dt);
    state.currentScale = state.targetScale;
    if (dt <= remainingHold) {
      return state.currentScale;
    }
    dt -= remainingHold;
  }
  state.currentScale += (1 - state.currentScale) * Math.min(1, dt * state.recoveryRate);
  if (Math.abs(1 - state.currentScale) < 0.01) {
    state.active = false;
    state.currentScale = 1;
  }
  return state.currentScale;
}

export function pushInputToken(combat: CombatState, token: ComboInputToken, time: number): void {
  combat.inputBuffer.push({ token, time });
  trimInputBuffer(combat, time);
}

export function pushInputTokens(combat: CombatState, tokens: ComboInputToken[], time: number): void {
  for (const token of tokens) {
    pushInputToken(combat, token, time);
  }
}

function trimInputBuffer(combat: CombatState, time: number): void {
  combat.inputBuffer = combat.inputBuffer.filter((entry) => time - entry.time <= INPUT_BUFFER_WINDOW).slice(-INPUT_BUFFER_LIMIT);
}

function matchesPattern(buffer: CombatState['inputBuffer'], pattern: ComboPattern, currentTime: number): { matched: boolean; precision: boolean } {
  if (buffer.length < pattern.tokens.length) {
    return { matched: false, precision: false };
  }
  const relevant = buffer.slice(-pattern.tokens.length);
  const newest = relevant[relevant.length - 1];
  if (currentTime - newest.time > INPUT_BUFFER_WINDOW) {
    return { matched: false, precision: false };
  }
  let precision = true;
  for (let index = 0; index < pattern.tokens.length; index += 1) {
    if (relevant[index].token !== pattern.tokens[index]) {
      return { matched: false, precision: false };
    }
    if (index > 0) {
      const gap = relevant[index].time - relevant[index - 1].time;
      if (gap > pattern.within) {
        return { matched: false, precision: false };
      }
      if (gap > pattern.precisionWindow) {
        precision = false;
      }
    }
  }
  return { matched: true, precision };
}

export function resolveBufferedCommand(
  combat: CombatState,
  family: WeaponMode | 'fighter' | 'boss',
  grounded: boolean,
  rageActive: boolean,
  currentTime: number,
): ComboMatch | null {
  trimInputBuffer(combat, currentTime);
  let best: ComboMatch | null = null;
  let bestValue = -1;

  for (const pattern of COMBO_PATTERNS) {
    if (pattern.family !== family) {
      continue;
    }
    if (pattern.groundedOnly && !grounded) {
      continue;
    }
    if (pattern.airborneOnly && grounded) {
      continue;
    }
    if (pattern.rageOnly && !rageActive) {
      continue;
    }
    if (pattern.requiresHitConfirm && !combat.hitConfirm.comboContinuable) {
      continue;
    }
    const result = matchesPattern(combat.inputBuffer, pattern, currentTime);
    if (!result.matched) {
      continue;
    }
    const value = patternPriorityValue(pattern.priority);
    if (value < bestValue) {
      continue;
    }
    bestValue = value;
    best = {
      patternId: pattern.id,
      attackName: pattern.attackName,
      priority: pattern.priority,
      precision: result.precision,
    };
  }

  if (best) {
    combat.lastComboMatch = best;
    combat.activeComboRoute = best.patternId;
    if (best.precision) {
      combat.lastPrecisionBonusAt = currentTime;
    }
  }
  return best;
}

function startAttack(combat: CombatState, attackName: AttackName, currentTime: number): boolean {
  const attack = getAttackDefinition(attackName);
  if (!attack) {
    return false;
  }
  combat.attackName = attackName;
  combat.phase = 'startup';
  combat.phaseTime = 0;
  combat.lastAttackStartedAt = currentTime;
  combat.hitConnected = false;
  combat.queuedAttack = null;
  combat.comboIndex = COMBO_INDEX_BY_ATTACK[attackName] ?? (attack.input === 'special' ? 3 : attack.input === 'heavy' ? 2 : 1);
  return true;
}

function openerForMode(mode: WeaponMode, input: AttackInput, airborne: boolean): AttackName {
  if (airborne) {
    return mode === 'sword' ? 'sword_air' : mode === 'gun' ? 'gun_air' : 'power_air';
  }
  if (mode === 'sword') {
    return input === 'heavy' ? 'sword_heavy' : input === 'special' ? 'sword_special' : 'sword_light1';
  }
  if (mode === 'gun') {
    return input === 'heavy' ? 'gun_heavy' : input === 'special' ? 'gun_special' : 'gun_light1';
  }
  return input === 'heavy' ? 'power_heavy' : input === 'special' ? 'power_special' : 'power_light1';
}

function queuedFollowUp(currentAttack: AttackName, input: AttackInput, airborne: boolean): AttackName | null {
  if (airborne) {
    return null;
  }
  switch (currentAttack) {
    case 'sword_light1':
      return input === 'light' ? 'sword_light2' : input === 'heavy' ? 'sword_launcher' : 'sword_special';
    case 'sword_light2':
      return input === 'light' || input === 'heavy' ? 'sword_light3' : 'sword_special';
    case 'gun_light1':
      return input === 'light' ? 'gun_light2' : input === 'heavy' ? 'gun_heavy' : 'gun_special';
    case 'gun_light2':
      return input === 'heavy' ? 'gun_heavy' : input === 'special' ? 'gun_special' : null;
    case 'power_light1':
      return input === 'light' ? 'power_light2' : input === 'heavy' ? 'power_launcher' : 'power_special';
    case 'power_light2':
      return input === 'heavy' ? 'power_heavy' : input === 'special' ? 'power_special' : null;
    case 'fighter_light1':
      return input === 'light' ? 'fighter_light2' : input === 'heavy' ? 'fighter_launcher' : 'fighter_special';
    case 'boss_light1':
      return input === 'light' ? 'boss_light2' : input === 'heavy' ? 'boss_launcher' : 'boss_special';
    case 'boss_light2':
      return input === 'heavy' ? 'boss_heavy' : input === 'special' ? 'boss_special' : null;
    default:
      return null;
  }
}

export function requestDirectAttack(combat: CombatState, currentTime: number, attackName: AttackName): boolean {
  if (combat.hitStunTimer > 0 || combat.switchLockTimer > 0 || combat.reloadLockTimer > 0) {
    return false;
  }
  if (combat.attackName) {
    if (!canQueueCombo(combat)) {
      return false;
    }
    combat.queuedAttack = attackName;
    return true;
  }
  if (currentTime - combat.lastAttackStartedAt < MIN_ATTACK_INTERVAL - 1e-6) {
    return false;
  }
  return startAttack(combat, attackName, currentTime);
}

export function requestPlayerAttack(
  combat: CombatState,
  currentTime: number,
  weaponMode: WeaponMode,
  input: AttackInput,
  airborne: boolean,
): boolean {
  if (combat.hitStunTimer > 0 || combat.switchLockTimer > 0 || combat.reloadLockTimer > 0) {
    return false;
  }
  if (combat.attackName) {
    if (!canQueueCombo(combat)) {
      return false;
    }
    const next = queuedFollowUp(combat.attackName, input, airborne);
    if (!next) {
      return false;
    }
    combat.queuedAttack = next;
    return true;
  }
  if (currentTime - combat.lastAttackStartedAt < MIN_ATTACK_INTERVAL - 1e-6) {
    return false;
  }
  return startAttack(combat, openerForMode(weaponMode, input, airborne), currentTime);
}

export function markHitConfirmed(combat: CombatState, attackName: AttackName, starter: string | null, currentTime: number): void {
  combat.hitConfirm.comboContinuable = true;
  combat.hitConfirm.lastHitConnectedAt = currentTime;
  combat.hitConfirm.lastConnectedAttack = attackName;
  combat.hitConfirm.lastStarter = starter;
}

export function tickCombat(combat: CombatState, dt: number, currentTime: number): { attackFinished: boolean; attackStarted: AttackName | null } {
  combat.hitStunTimer = Math.max(0, combat.hitStunTimer - dt);
  combat.switchLockTimer = Math.max(0, combat.switchLockTimer - dt);
  combat.reloadLockTimer = Math.max(0, combat.reloadLockTimer - dt);
  trimInputBuffer(combat, currentTime);

  if (!combat.attackName) {
    if (combat.hitConfirm.comboContinuable && currentTime - combat.hitConfirm.lastHitConnectedAt > 0.3) {
      combat.hitConfirm.comboContinuable = false;
    }
    return { attackFinished: false, attackStarted: null };
  }

  const attack = getAttackDefinition(combat.attackName);
  if (!attack) {
    cancelCombat(combat);
    return { attackFinished: false, attackStarted: null };
  }

  combat.phaseTime += dt;
  if (combat.phaseTime < attack.startup) {
    combat.phase = 'startup';
  } else if (combat.phaseTime < attack.startup + attack.active) {
    combat.phase = 'active';
  } else {
    combat.phase = 'recovery';
  }

  const duration = attackDuration(attack);
  if (combat.phaseTime < duration) {
    return { attackFinished: false, attackStarted: null };
  }

  const previousAttack = combat.attackName;
  const nextAttack = combat.queuedAttack;
  combat.attackName = null;
  combat.phase = 'idle';
  combat.phaseTime = 0;
  combat.hitConfirm.comboContinuable = combat.hitConnected;
  combat.hitConnected = false;
  combat.queuedAttack = null;

  if (nextAttack) {
    startAttack(combat, nextAttack, currentTime);
    return { attackFinished: true, attackStarted: nextAttack };
  }

  if (!combat.hitConfirm.comboContinuable || currentTime - combat.hitConfirm.lastHitConnectedAt > 0.3) {
    combat.comboIndex = 0;
    combat.activeComboRoute = null;
  }
  combat.lastComboMatch = null;
  return { attackFinished: previousAttack !== null, attackStarted: null };
}

export function getPatternForAttack(attackName: AttackName): ComboPattern | null {
  const definition = getAttackDefinition(attackName);
  if (!definition?.patternId) {
    return null;
  }
  return COMBO_PATTERNS.find((pattern) => pattern.id === definition.patternId) ?? null;
}

export function getAllComboPatterns(): ComboPattern[] {
  return COMBO_PATTERNS;
}
