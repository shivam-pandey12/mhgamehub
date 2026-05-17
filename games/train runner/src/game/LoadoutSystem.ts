import { COSMETIC_CONFIGS, WEAPON_STYLE_CONFIGS } from './GearConfig';
import type { LoadoutModifiers, LoadoutState, SaveData } from './types';

export function getLoadoutState(save: SaveData): LoadoutState {
  return {
    upgrades: { ...save.upgrades },
    equippedWeapon: save.equippedWeapon,
    equippedSkin: save.equippedSkin,
    equippedCosmetics: { ...save.equippedCosmetics }
  };
}

export function getLoadoutModifiers(save: SaveData): LoadoutModifiers {
  const upgrades = save.upgrades;
  const weapon = WEAPON_STYLE_CONFIGS.find((style) => style.id === save.equippedWeapon) ?? WEAPON_STYLE_CONFIGS[0];
  const trail = COSMETIC_CONFIGS.find((cosmetic) => cosmetic.id === save.equippedCosmetics.trailColor);

  return {
    maxHealthBonus: upgrades.maxHealth >= 4 ? 2 : upgrades.maxHealth >= 2 ? 1 : 0,
    jumpMultiplier: 1 + upgrades.jumpPower * 0.02,
    dashCooldownMultiplier: 1 - upgrades.dashCooldown * 0.04,
    energyGainMultiplier: 1 + upgrades.specialChargeRate * 0.06 + weapon.specialChargeBonus,
    magnetRadiusMultiplier: 1 + upgrades.magnetRadius * 0.07,
    comboDecayMultiplier: 1 - upgrades.comboStability * 0.07,
    damageMultiplier: (1 + upgrades.damagePower * 0.05) * weapon.damageMultiplier,
    shieldStartChance: upgrades.shieldStartChance * 0.04,
    attackRangeMultiplier: weapon.rangeMultiplier,
    attackCooldownMultiplier: weapon.cooldownMultiplier,
    specialChargeBonus: weapon.specialChargeBonus,
    trailColor: trail?.color ?? weapon.color
  };
}

