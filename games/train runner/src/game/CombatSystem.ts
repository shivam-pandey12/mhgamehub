import { AudioEvents } from './AudioEvents';
import { PHASE2_CONFIG } from './config';
import { EffectsSystem } from './EffectsSystem';
import { EnemySystem } from './EnemySystem';
import { Hud } from './Hud';
import { InputManager } from './InputManager';
import { PlayerController } from './PlayerController';
import { PlayerStatsSystem } from './PlayerStatsSystem';
import type { CombatHitKind, LoadoutModifiers } from './types';
import type { EliteEnemySystem } from './EliteEnemySystem';

export class CombatSystem {
  private cooldown = 0;
  private hitStopTimer = 0;
  private dashHitConsumed = false;
  private perfectDodgeBonusTimer = 0;
  private chainTimer = 0;
  private chainStep = 0;
  private damageMultiplier = 1;
  private rangeMultiplier = 1;
  private cooldownMultiplier = 1;
  private attackColor = 0xe0f7ff;

  constructor(private readonly audio: AudioEvents) {}

  update(
    dt: number,
    input: InputManager,
    player: PlayerController,
    enemies: EnemySystem,
    stats: PlayerStatsSystem,
    effects: EffectsSystem,
    hud: Hud,
    elite?: EliteEnemySystem
  ): void {
    this.cooldown = Math.max(0, this.cooldown - dt);
    this.hitStopTimer = Math.max(0, this.hitStopTimer - dt);
    this.perfectDodgeBonusTimer = Math.max(0, this.perfectDodgeBonusTimer - dt);
    this.chainTimer = Math.max(0, this.chainTimer - dt);
    if (this.chainTimer <= 0) {
      this.chainStep = 0;
    }

    const snapshot = player.getSnapshot();
    if (snapshot.state !== 'dodging') {
      this.dashHitConsumed = false;
    } else if (!this.dashHitConsumed) {
      this.dashHitConsumed = true;
      this.tryAttack('dash', player, enemies, stats, effects, hud, elite);
    }

    if (!input.consumeAttack() || this.cooldown > 0 || player.state === 'failed') {
      return;
    }

    const kind: CombatHitKind = snapshot.grounded ? 'basic' : 'jump';
    this.tryAttack(kind, player, enemies, stats, effects, hud, elite);
  }

  grantPerfectDodge(player: PlayerController, stats: PlayerStatsSystem, effects: EffectsSystem, hud: Hud): void {
    this.perfectDodgeBonusTimer = 2.2;
    player.triggerPerfectDodge();
    effects.triggerPerfectDodge({ position: player.position, intensity: 1 });
    stats.addScore({ type: 'perfectDodge', amount: 120, combo: 2.4, label: 'Perfect Dodge' }, hud);
    stats.recordPerfectDodge();
    this.audio.play('perfectDodge');
    this.hitStopTimer = Math.max(this.hitStopTimer, 0.09);
  }

  getTimeScale(): number {
    return this.hitStopTimer > 0 ? 0.18 : 1;
  }

  reset(): void {
    this.cooldown = 0;
    this.hitStopTimer = 0;
    this.dashHitConsumed = false;
    this.perfectDodgeBonusTimer = 0;
    this.chainTimer = 0;
    this.chainStep = 0;
  }

  configureLoadout(modifiers: LoadoutModifiers): void {
    this.damageMultiplier = modifiers.damageMultiplier;
    this.rangeMultiplier = modifiers.attackRangeMultiplier;
    this.cooldownMultiplier = modifiers.attackCooldownMultiplier;
    this.attackColor = modifiers.trailColor;
  }

  private tryAttack(
    kind: CombatHitKind,
    player: PlayerController,
    enemies: EnemySystem,
    stats: PlayerStatsSystem,
    effects: EffectsSystem,
    hud: Hud,
    elite?: EliteEnemySystem
  ): void {
    const snapshot = player.getSnapshot();
    const config = PHASE2_CONFIG.combat;
    const rangeZ = (kind === 'dash' ? config.dashRangeZ : kind === 'jump' ? config.jumpRangeZ : config.basicRangeZ) * this.rangeMultiplier;
    const rangeX = config.basicRangeX * this.rangeMultiplier;
    const target = enemies.findTarget(snapshot.position, rangeZ, rangeX);
    const counter = this.perfectDodgeBonusTimer > 0;
    const resolvedKind: CombatHitKind = counter && kind === 'basic' ? 'counter' : kind;
    const chainDamageBonus = kind === 'basic' ? this.chainStep * 0.35 : 0;

    this.cooldown = config.attackCooldown * this.cooldownMultiplier;
    player.triggerAttackPose(resolvedKind);
    effects.triggerAttack({ position: snapshot.position, intensity: kind === 'dash' ? 1.2 : 0.8 + chainDamageBonus, color: this.attackColor });
    this.audio.play('attack');

    if (!target) {
      const eliteResult = elite?.applyHitIfInRange(snapshot.position, rangeZ, rangeX, resolvedKind, counter, effects, this.damageMultiplier);
      if (eliteResult?.hit) {
        this.hitStopTimer = Math.max(this.hitStopTimer, config.hitStop * 1.4);
        this.advanceChain(kind);
        if (eliteResult.defeated) {
          stats.recordEnemyDefeated(hud);
          hud.showFeedback('Brute Down', 0.85);
        } else {
          stats.addScore({ type: 'enemy', amount: 50, combo: 1, label: counter ? 'Perfect Counter' : `Hit x${Math.max(1, this.chainStep)}` }, hud);
        }
      }
      return;
    }

    const result = enemies.applyHit(target, resolvedKind, counter, effects, this.damageMultiplier);
    this.audio.play('enemyHit');
    this.hitStopTimer = Math.max(this.hitStopTimer, config.hitStop);

    if (result.defeated) {
      stats.recordEnemyDefeated(hud);
      stats.addScore({ type: 'enemy', amount: target.type === 'shield' ? 240 : 140, combo: 2, label: this.chainStep >= 2 ? 'Finisher' : 'Enemy Down' }, hud);
      this.perfectDodgeBonusTimer = 0;
      this.advanceChain(kind);
      return;
    }

    if (result.blocked) {
      hud.showFeedback('Blocked', 0.42);
    } else {
      this.advanceChain(kind);
      stats.addScore({ type: 'enemy', amount: 40, combo: 0.8, label: counter ? 'Perfect Counter' : `Hit x${this.chainStep}` }, hud);
    }
  }

  private advanceChain(kind: CombatHitKind): void {
    if (kind !== 'basic' && kind !== 'counter') {
      return;
    }

    this.chainStep = Math.min(3, this.chainStep + 1);
    this.chainTimer = 0.9;
  }
}
