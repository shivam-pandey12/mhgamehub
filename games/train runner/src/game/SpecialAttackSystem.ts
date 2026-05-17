import * as THREE from 'three';
import { AudioEvents } from './AudioEvents';
import { PHASE3_CONFIG } from './config';
import { BossSystem } from './BossSystem';
import { CameraController } from './CameraController';
import { EffectsSystem } from './EffectsSystem';
import { EliteEnemySystem } from './EliteEnemySystem';
import { EnemySystem } from './EnemySystem';
import { Hud } from './Hud';
import { InputManager } from './InputManager';
import { ObstacleSystem } from './ObstacleSystem';
import { PlayerController } from './PlayerController';
import { PlayerStatsSystem } from './PlayerStatsSystem';
import type { LoadoutModifiers, SpecialAttackState } from './types';

interface Wave {
  active: boolean;
  life: number;
  originZ: number;
  position: THREE.Vector3;
  mesh: THREE.Mesh;
  hitBoss: boolean;
}

export class SpecialAttackSystem {
  readonly group = new THREE.Group();

  private readonly material = new THREE.MeshBasicMaterial({
    color: 0x68f7ff,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  private readonly geometry = new THREE.BoxGeometry(1, 1, 1);
  private readonly wave: Wave;
  private state: SpecialAttackState = 'ready';
  private trailColor = 0x68f7ff;

  constructor(private readonly audio: AudioEvents) {
    const mesh = new THREE.Mesh(this.geometry, this.material);
    mesh.visible = false;
    this.wave = {
      active: false,
      life: 0,
      originZ: 0,
      position: new THREE.Vector3(),
      mesh,
      hitBoss: false
    };
    this.group.name = 'Phase 3 special attack';
    this.group.add(mesh);
  }

  update(
    dt: number,
    input: InputManager,
    player: PlayerController,
    stats: PlayerStatsSystem,
    enemies: EnemySystem,
    obstacles: ObstacleSystem,
    elite: EliteEnemySystem,
    boss: BossSystem,
    effects: EffectsSystem,
    hud: Hud,
    camera: CameraController
  ): void {
    if (input.consumeSpecial()) {
      this.tryFire(player, stats, effects, hud, camera);
    }

    if (!this.wave.active) {
      this.state = stats.isEnergyFull ? 'ready' : 'cooldown';
      return;
    }

    this.wave.life -= dt;
    this.wave.position.z += PHASE3_CONFIG.special.waveSpeed * dt;
    this.wave.mesh.position.copy(this.wave.position);
    this.wave.mesh.scale.set(
      1.25 + (PHASE3_CONFIG.special.waveLife - this.wave.life) * 4,
      0.06,
      1.6 + (PHASE3_CONFIG.special.waveLife - this.wave.life) * 7
    );
    this.material.opacity = Math.max(0, this.wave.life / PHASE3_CONFIG.special.waveLife) * 0.72;

    const defeated = enemies.applyWave(
      this.wave.position,
      6,
      PHASE3_CONFIG.special.rangeX,
      PHASE3_CONFIG.special.damage,
      effects
    );
    for (let i = 0; i < defeated; i += 1) {
      stats.recordEnemyDefeated(hud);
    }

    const cleared = obstacles.clearLightHazards(this.wave.position, 5, PHASE3_CONFIG.special.rangeX, effects);
    if (cleared > 0) {
      stats.addScore({ type: 'obstacleBreak', amount: cleared * 45, combo: cleared * 0.8, label: 'Wave Clear' }, hud);
    }

    if (elite.applySpecial(this.wave.position, 6, PHASE3_CONFIG.special.rangeX, effects)) {
      stats.recordEnemyDefeated(hud);
    }

    if (!this.wave.hitBoss && boss.applySpecial(this.wave.position, effects, hud, stats)) {
      this.wave.hitBoss = true;
      stats.addScore({ type: 'enemy', amount: 260, combo: 2.5, label: 'Boss Strike' }, hud);
    }

    if (this.wave.life <= 0 || this.wave.position.z - this.wave.originZ > 32) {
      this.wave.active = false;
      this.wave.mesh.visible = false;
      this.material.opacity = 0;
    }
  }

  reset(): void {
    this.state = 'ready';
    this.wave.active = false;
    this.wave.mesh.visible = false;
    this.material.opacity = 0;
  }

  configureLoadout(modifiers: LoadoutModifiers): void {
    this.trailColor = modifiers.trailColor;
    this.material.color.setHex(this.trailColor);
  }

  getState(): SpecialAttackState {
    return this.state;
  }

  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }

  private tryFire(
    player: PlayerController,
    stats: PlayerStatsSystem,
    effects: EffectsSystem,
    hud: Hud,
    camera: CameraController
  ): void {
    if (!stats.useFullEnergy()) {
      hud.showFeedback('Energy Not Ready', 0.45);
      return;
    }

    const snapshot = player.getSnapshot();
    this.state = 'active';
    this.wave.active = true;
    this.wave.life = PHASE3_CONFIG.special.waveLife;
    this.wave.originZ = snapshot.position.z;
    this.wave.position.copy(snapshot.position).add(new THREE.Vector3(0, 0.35, 2.1));
    this.wave.hitBoss = false;
    this.wave.mesh.visible = true;
    this.wave.mesh.position.copy(this.wave.position);
    player.triggerAttackPose('counter');
    effects.triggerSpecialWave({ position: snapshot.position, intensity: 1.25, color: this.trailColor });
    this.audio.play('specialRelease');
    hud.showFeedback('Energy Slash', 0.75);
    camera.addFovImpulse(8);
    camera.triggerCinematic(0.65);
  }
}
