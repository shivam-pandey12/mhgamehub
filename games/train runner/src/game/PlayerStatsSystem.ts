import * as THREE from 'three';
import { PHASE2_CONFIG } from './config';
import { AudioEvents } from './AudioEvents';
import { EffectsSystem } from './EffectsSystem';
import { Hud } from './Hud';
import type { DamageSource, HudStatsSnapshot, LoadoutModifiers, RunSummary, ScoreEvent } from './types';

export class PlayerStatsSystem {
  health: number = PHASE2_CONFIG.stats.maxHealth;
  coins = 0;
  routeTokens = 0;
  energy = 0;
  score = 0;
  shielded = false;
  enemiesDefeated = 0;
  perfectDodges = 0;
  specialUses = 0;
  bossDefeated = false;
  damageTaken = 0;

  private invulnerabilityTimer = 0;
  private combo = 0;
  private comboTimer = 0;
  private maxComboMultiplier = 1;
  private lastDistance = 0;
  private gameOver = false;
  private damageQueued = false;
  private maxHealth: number = PHASE2_CONFIG.stats.maxHealth;
  private energyGainMultiplier = 1;
  private comboDecayMultiplier = 1;
  private shieldStartChance = 0;

  constructor(private readonly audio: AudioEvents) {}

  configureLoadout(modifiers: LoadoutModifiers): void {
    this.maxHealth = PHASE2_CONFIG.stats.maxHealth + modifiers.maxHealthBonus;
    this.energyGainMultiplier = modifiers.energyGainMultiplier;
    this.comboDecayMultiplier = modifiers.comboDecayMultiplier;
    this.shieldStartChance = modifiers.shieldStartChance;
    this.health = Math.min(this.health, this.maxHealth);
  }

  update(dt: number, distance: number): void {
    this.invulnerabilityTimer = Math.max(0, this.invulnerabilityTimer - dt);

    const deltaDistance = Math.max(0, distance - this.lastDistance);
    this.lastDistance = distance;
    this.score += deltaDistance * (1 + this.comboMultiplier * 0.08);

    if (this.comboTimer > 0) {
      this.comboTimer = Math.max(0, this.comboTimer - dt);
    } else if (this.combo > 0) {
      this.combo = Math.max(0, this.combo - PHASE2_CONFIG.stats.comboDecayPerSecond * this.comboDecayMultiplier * dt);
    }
  }

  reset(): void {
    this.health = this.maxHealth;
    this.coins = 0;
    this.routeTokens = 0;
    this.energy = 0;
    this.score = 0;
    this.shielded = Math.random() < this.shieldStartChance;
    this.enemiesDefeated = 0;
    this.perfectDodges = 0;
    this.specialUses = 0;
    this.bossDefeated = false;
    this.damageTaken = 0;
    this.invulnerabilityTimer = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.maxComboMultiplier = 1;
    this.lastDistance = 0;
    this.gameOver = false;
    this.damageQueued = false;
  }

  damage(source: DamageSource, position: THREE.Vector3, effects: EffectsSystem, hud: Hud): boolean {
    if (this.gameOver || this.invulnerabilityTimer > 0) {
      return false;
    }

    if (this.shielded) {
      this.shielded = false;
      this.invulnerabilityTimer = PHASE2_CONFIG.stats.invulnerability * 0.45;
      this.addScore({ type: 'shield', amount: 30, combo: 1, label: 'Shield Break' }, hud);
      effects.triggerShieldBreak({ position, intensity: 0.8 });
      return false;
    }

    this.health = Math.max(0, this.health - 1);
    this.damageTaken += 1;
    this.damageQueued = true;
    this.combo = 0;
    this.comboTimer = 0;
    this.invulnerabilityTimer = PHASE2_CONFIG.stats.invulnerability;
    this.audio.play('damage');
    effects.triggerDamage({ position, intensity: source === 'electric' ? 1.15 : 0.9 });
    hud.showDamageFlash();
    hud.showFeedback(this.health > 0 ? 'Hit' : 'Game Over', this.health > 0 ? 0.42 : 1.1);

    if (this.health <= 0) {
      this.gameOver = true;
      this.audio.play('gameOver');
      effects.triggerFail({ position, intensity: 1.15 });
    }

    return true;
  }

  collectCoin(count: number, hud: Hud): void {
    this.coins += count;
    this.addScore({ type: 'coin', amount: count * PHASE2_CONFIG.pickups.coinValue, combo: 1, label: '+Coin' }, hud);
    this.audio.play('coin');
  }

  collectEnergy(amount: number, hud: Hud): void {
    this.grantEnergy(amount);
    this.addScore({ type: 'energy', amount: 25, combo: 1.2, label: '+Energy' }, hud);
    this.audio.play('energy');
  }

  collectRouteToken(hud: Hud): void {
    this.routeTokens += 1;
    this.addScore({ type: 'coin', amount: 90, combo: 1.8, label: 'Route Token' }, hud);
    this.audio.play('energy');
  }

  collectShield(hud: Hud): void {
    this.shielded = true;
    this.addScore({ type: 'shield', amount: 50, combo: 1.4, label: 'Shield Ready' }, hud);
  }

  addScore(event: ScoreEvent, hud?: Hud): void {
    this.score += event.amount * this.comboMultiplier;
    this.combo += event.combo;
    this.comboTimer = PHASE2_CONFIG.stats.comboGrace;
    this.maxComboMultiplier = Math.max(this.maxComboMultiplier, this.comboMultiplier);

    if (event.label && hud) {
      hud.showFeedback(event.label, 0.55);
    }
  }

  grantEnergy(amount: number): void {
    this.energy = Math.min(PHASE2_CONFIG.stats.energyMax, this.energy + amount * this.energyGainMultiplier);
  }

  useFullEnergy(): boolean {
    if (this.energy < PHASE2_CONFIG.stats.energyMax) {
      return false;
    }

    this.energy = 0;
    this.specialUses += 1;
    return true;
  }

  recordEnemyDefeated(hud?: Hud): void {
    this.enemiesDefeated += 1;
    this.grantEnergy(8);
    if (hud) {
      this.addScore({ type: 'enemy', amount: 90, combo: 1.2, label: 'Defeat' }, hud);
    }
  }

  recordPerfectDodge(): void {
    this.perfectDodges += 1;
    this.grantEnergy(10);
  }

  recordBossDefeated(): void {
    this.bossDefeated = true;
    this.grantEnergy(PHASE2_CONFIG.stats.energyMax);
  }

  debugFillEnergy(): void {
    this.energy = PHASE2_CONFIG.stats.energyMax;
  }

  get comboMultiplier(): number {
    return Math.min(5, 1 + Math.floor(this.combo / 5));
  }

  get isGameOver(): boolean {
    return this.gameOver;
  }

  get isInvulnerable(): boolean {
    return this.invulnerabilityTimer > 0;
  }

  get isEnergyFull(): boolean {
    return this.energy >= PHASE2_CONFIG.stats.energyMax;
  }

  get maxCombo(): number {
    return this.maxComboMultiplier;
  }

  consumeDamageEvent(): boolean {
    const value = this.damageQueued;
    this.damageQueued = false;
    return value;
  }

  getSnapshot(): HudStatsSnapshot {
    return {
      health: this.health,
      maxHealth: this.maxHealth,
      coins: this.coins,
      routeTokens: this.routeTokens,
      energy: Math.round(this.energy),
      score: Math.floor(this.score),
      comboMultiplier: this.comboMultiplier,
      comboLabel: this.getComboLabel(),
      shielded: this.shielded
    };
  }

  getSummary(
    distance: number,
    objectivesCompleted: number,
    objectivesTotal: number,
    victory: boolean,
    endReason?: string
  ): RunSummary {
    const gradeScore =
      distance * 0.9 +
      this.coins * 8 +
      this.enemiesDefeated * 90 +
      this.perfectDodges * 70 +
      this.maxComboMultiplier * 120 +
      objectivesCompleted * 220 +
      (this.bossDefeated ? 1200 : 0);
    const grade: RunSummary['grade'] =
      gradeScore > 3400 ? 'S+' : gradeScore > 2600 ? 'S' : gradeScore > 1900 ? 'A' : gradeScore > 1100 ? 'B' : 'C';

    return {
      victory,
      endReason,
      distance,
      coins: this.coins,
      score: Math.floor(this.score),
      enemiesDefeated: this.enemiesDefeated,
      perfectDodges: this.perfectDodges,
      specialUses: this.specialUses,
      damageTaken: this.damageTaken,
      maxCombo: this.maxComboMultiplier,
      objectivesCompleted,
      objectivesTotal,
      bossDefeated: this.bossDefeated,
      routeTokens: this.routeTokens,
      grade
    };
  }

  private getComboLabel(): string {
    if (this.comboMultiplier >= 5) {
      return 'Perfect Run';
    }

    if (this.comboMultiplier >= 4) {
      return 'Insane Flow';
    }

    if (this.comboMultiplier >= 2) {
      return `Flow x${this.comboMultiplier}`;
    }

    return '--';
  }
}
