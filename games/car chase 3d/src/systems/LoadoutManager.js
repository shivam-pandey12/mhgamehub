import { ABILITY_CONFIG, LOADOUT_OPTIONS } from '../config.js';
import { SaveManager } from './SaveManager.js';

const STORAGE_KEY = 'heatline-city-phase5-loadouts';

const DEFAULTS = {
  robber: { primary: 'heavyMachineGun', secondary: 'rearMine', passive: 'none', tire: 'balanced', accent: 'stock' },
  police: { primary: 'taserBullets', secondary: 'empShot', passive: 'none', tire: 'balanced', accent: 'stock' },
};

export class LoadoutManager {
  constructor() {
    this.selected = {
      ...DEFAULTS,
      ...SaveManager.readJSON(STORAGE_KEY, {}),
    };
  }

  set(role, slot, id) {
    if (!this.selected[role]) this.selected[role] = { ...DEFAULTS[role] };
    this.selected[role][slot] = id;
    SaveManager.writeJSON(STORAGE_KEY, this.selected);
  }

  reset() {
    this.selected = {
      robber: { ...DEFAULTS.robber },
      police: { ...DEFAULTS.police },
    };
    SaveManager.writeJSON(STORAGE_KEY, this.selected);
  }

  get(role, vehicle = null) {
    const base = { ...(vehicle?.loadout || {}), ...(this.selected[role] || DEFAULTS[role]) };
    return {
      primary: base.primary,
      secondary: base.secondary,
      utility: vehicle?.loadout?.utility,
      boost: vehicle?.loadout?.boost || 'nitroSurge',
      passive: base.passive || 'none',
      tire: base.tire || 'balanced',
      accent: base.accent || 'stock',
    };
  }

  getOptions(role) {
    return {
      primary: LOADOUT_OPTIONS[role]?.primary || [],
      secondary: LOADOUT_OPTIONS[role]?.secondary || [],
      passive: LOADOUT_OPTIONS.universal.passive,
      tire: LOADOUT_OPTIONS.universal.tire,
      accent: LOADOUT_OPTIONS.universal.accent,
    };
  }

  applyStats(stats, loadout) {
    const next = { ...stats };
    const passive = LOADOUT_OPTIONS.universal.passive.find((item) => item.id === loadout.passive);
    const tire = LOADOUT_OPTIONS.universal.tire.find((item) => item.id === loadout.tire);
    this.applyModifiers(next, passive?.statModifiers || {});
    this.applyModifiers(next, tire?.statModifiers || {});
    return next;
  }

  applyModifiers(stats, modifiers) {
    if (modifiers.maxHealth) stats.maxHealth += modifiers.maxHealth;
    if (modifiers.maxSpeedMultiplier) stats.maxSpeed *= modifiers.maxSpeedMultiplier;
    if (modifiers.accelerationMultiplier) stats.acceleration *= modifiers.accelerationMultiplier;
    if (modifiers.handlingMultiplier) stats.handling *= modifiers.handlingMultiplier;
    if (modifiers.gripMultiplier) stats.grip *= modifiers.gripMultiplier;
    if (modifiers.driftGripMultiplier) stats.driftGrip *= modifiers.driftGripMultiplier;
    if (modifiers.armorMultiplier) stats.armor *= modifiers.armorMultiplier;
    if (modifiers.massMultiplier) stats.mass *= modifiers.massMultiplier;
    if (modifiers.ramPowerMultiplier) stats.ramPower *= modifiers.ramPowerMultiplier;
  }

  applyController(controller, loadout) {
    const passive = LOADOUT_OPTIONS.universal.passive.find((item) => item.id === loadout.passive);
    const modifiers = passive?.statModifiers || {};
    controller.abilityCooldownScale *= modifiers.cooldownScale || 1;
    controller.nitroRechargeMultiplier *= modifiers.nitroRechargeMultiplier || 1;
  }

  label(role, vehicle = null) {
    const loadout = this.get(role, vehicle);
    const primary = ABILITY_CONFIG[loadout.primary]?.label || 'Primary';
    const secondary = ABILITY_CONFIG[loadout.secondary]?.label || 'Secondary';
    const passive = LOADOUT_OPTIONS.universal.passive.find((item) => item.id === loadout.passive)?.label || 'No Passive';
    const tire = LOADOUT_OPTIONS.universal.tire.find((item) => item.id === loadout.tire)?.label || 'Balanced Tires';
    return `${primary} + ${secondary} + ${passive} + ${tire}`;
  }
}
