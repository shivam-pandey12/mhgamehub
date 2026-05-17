import * as THREE from 'three';
import { PHASE2_CONFIG } from './config';
import { EffectsSystem } from './EffectsSystem';
import { Hud } from './Hud';
import { laneFromX, laneToX } from './LaneUtils';
import { PlayerStatsSystem } from './PlayerStatsSystem';
import { TrainSystem } from './TrainSystem';
import type { CoachCollider, CombatHitKind, EnemyEntity, EnemyState, EnemyType, LaneIndex, PlayerSnapshot } from './types';

export interface EnemyUpdateResult {
  perfectDodges: number;
}

export interface EnemyHitResult {
  defeated: boolean;
  blocked: boolean;
  position: THREE.Vector3;
}

export class EnemySystem {
  readonly group = new THREE.Group();

  private readonly enemies: EnemyEntity[] = [];
  private readonly materials: Record<string, THREE.Material>;
  private readonly geometries = {
    body: new THREE.CapsuleGeometry(0.18, 0.54, 7, 12),
    head: new THREE.SphereGeometry(0.18, 14, 10),
    limb: new THREE.CapsuleGeometry(0.065, 0.36, 5, 10),
    shield: new THREE.BoxGeometry(0.52, 0.74, 0.1),
    warning: new THREE.RingGeometry(0.38, 0.45, 24)
  };
  private nextId = 1;

  constructor() {
    this.group.name = 'Phase 2 enemies';
    this.materials = this.createMaterials();
  }

  update(
    dt: number,
    train: TrainSystem,
    snapshot: PlayerSnapshot,
    stats: PlayerStatsSystem,
    effects: EffectsSystem,
    hud: Hud
  ): EnemyUpdateResult {
    let perfectDodges = 0;

    for (const enemy of this.enemies) {
      if (!enemy.active) {
        continue;
      }

      if (enemy.z < snapshot.position.z - PHASE2_CONFIG.spawn.cleanupBehind) {
        this.deactivate(enemy);
        continue;
      }

      if (enemy.state === 'defeated') {
        this.updateDefeated(enemy, dt);
        continue;
      }

      const surface = train.getSurfaceAt(snapshot.position.x, snapshot.position.z);
      const playerLane = surface ? laneFromX(surface.coach, snapshot.position.x) : 0;
      const dz = enemy.z - snapshot.position.z;
      const sameLane = playerLane === enemy.lane;

      this.updateEnemyMovement(enemy, dz, dt);
      this.updateEnemyState(enemy, dz, sameLane, dt);
      this.animateEnemy(enemy, dt);

      if (enemy.state !== 'attack' || !sameLane || Math.abs(dz) > 2.4) {
        continue;
      }

      enemy.attackTimer += dt;
      const inPerfectWindow = enemy.attackTimer >= 0.16 && enemy.attackTimer <= 0.52;
      if (snapshot.state === 'dodging' && inPerfectWindow) {
        enemy.state = 'hit';
        enemy.attackTimer = 0;
        enemy.attackResolved = true;
        perfectDodges += 1;
        continue;
      }

      if (!enemy.attackResolved && enemy.attackTimer > 0.55) {
        enemy.attackResolved = true;
        stats.damage('enemy', snapshot.position, effects, hud);
      }
    }

    return { perfectDodges };
  }

  spawn(coach: CoachCollider, z: number, lane: LaneIndex, type: EnemyType): void {
    const enemy = this.getFreeEnemy();
    enemy.type = type;
    enemy.lane = lane;
    enemy.z = z;
    enemy.roofY = coach.roofY;
    enemy.maxHp = type === 'laneBlocker' ? 1 : type === 'runner' ? 2 : 3;
    enemy.hp = enemy.maxHp;
    enemy.state = 'waiting';
    enemy.attackTimer = 0;
    enemy.attackResolved = false;
    enemy.active = true;
    enemy.group.visible = true;
    enemy.group.clear();
    enemy.group.position.set(laneToX(coach, lane), coach.roofY, z);

    this.buildEnemy(enemy);
  }

  findTarget(position: THREE.Vector3, rangeZ: number, rangeX: number): EnemyEntity | null {
    let best: EnemyEntity | null = null;
    let bestDistance = Infinity;

    for (const enemy of this.enemies) {
      if (!enemy.active || enemy.state === 'defeated') {
        continue;
      }

      const dz = enemy.z - position.z;
      const dx = Math.abs(enemy.group.position.x - position.x);
      if (dz < -0.3 || dz > rangeZ || dx > rangeX) {
        continue;
      }

      const distance = dz + dx * 0.8;
      if (distance < bestDistance) {
        best = enemy;
        bestDistance = distance;
      }
    }

    return best;
  }

  applyHit(enemy: EnemyEntity, kind: CombatHitKind, bonus: boolean, effects: EffectsSystem, damageMultiplier = 1): EnemyHitResult {
    const strongHit = kind === 'dash' || kind === 'jump' || kind === 'counter' || bonus;
    const blocked = enemy.type === 'shield' && kind === 'basic' && !bonus;
    const damage = (blocked ? 0.5 : strongHit ? 2 : 1) * damageMultiplier;
    enemy.hp -= damage;
    enemy.state = 'hit';
    enemy.attackTimer = 0;
    enemy.attackResolved = false;

    const hitPosition = enemy.group.position.clone().add(new THREE.Vector3(0, 1.1, 0));
    effects.triggerEnemyHit({ position: hitPosition, intensity: strongHit ? 1.2 : 0.8 });

    if (enemy.hp <= 0) {
      enemy.state = 'defeated';
      enemy.attackTimer = 0;
      effects.triggerEnemyDefeat({ position: hitPosition, intensity: enemy.type === 'shield' ? 1.3 : 1 });
      return { defeated: true, blocked, position: hitPosition };
    }

    return { defeated: false, blocked, position: hitPosition };
  }

  applyWave(position: THREE.Vector3, rangeZ: number, rangeX: number, damage: number, effects: EffectsSystem): number {
    let defeated = 0;

    for (const enemy of this.enemies) {
      if (!enemy.active || enemy.state === 'defeated') {
        continue;
      }

      const dz = enemy.z - position.z;
      const dx = Math.abs(enemy.group.position.x - position.x);
      if (dz < -0.5 || dz > rangeZ || dx > rangeX) {
        continue;
      }

      enemy.hp -= damage;
      enemy.state = 'hit';
      enemy.attackTimer = 0;
      enemy.attackResolved = false;
      effects.triggerEnemyHit({ position: enemy.group.position.clone().add(new THREE.Vector3(0, 1.1, 0)), intensity: 1.2 });

      if (enemy.hp <= 0) {
        enemy.state = 'defeated';
        enemy.attackTimer = 0;
        defeated += 1;
        effects.triggerEnemyDefeat({ position: enemy.group.position.clone().add(new THREE.Vector3(0, 1.1, 0)), intensity: 1.25 });
      }
    }

    return defeated;
  }

  reset(): void {
    this.enemies.forEach((enemy) => this.deactivate(enemy));
  }

  dispose(): void {
    Object.values(this.geometries).forEach((geometry) => geometry.dispose());
    Object.values(this.materials).forEach((material) => material.dispose());
  }

  private getFreeEnemy(): EnemyEntity {
    const existing = this.enemies.find((enemy) => !enemy.active);
    if (existing) {
      return existing;
    }

    const enemy: EnemyEntity = {
      id: this.nextId,
      type: 'laneBlocker',
      lane: 0,
      z: 0,
      roofY: 0,
      hp: 1,
      maxHp: 1,
      state: 'waiting',
      attackTimer: 0,
      attackResolved: false,
      active: false,
      group: new THREE.Group()
    };
    this.nextId += 1;
    enemy.group.visible = false;
    this.enemies.push(enemy);
    this.group.add(enemy.group);
    return enemy;
  }

  private updateEnemyMovement(enemy: EnemyEntity, dz: number, dt: number): void {
    if (enemy.type !== 'runner' || enemy.state === 'attack' || enemy.state === 'hit') {
      return;
    }

    if (dz > 3.2) {
      enemy.z -= dt * 2.7;
      enemy.group.position.z = enemy.z;
    }
  }

  private updateEnemyState(enemy: EnemyEntity, dz: number, sameLane: boolean, dt: number): void {
    if (enemy.state === 'waiting' && dz < 22) {
      this.setEnemyState(enemy, 'alert');
    } else if (enemy.state === 'alert') {
      enemy.attackTimer += dt;
      if (enemy.attackTimer > 0.32) {
        this.setEnemyState(enemy, enemy.type === 'runner' ? 'approach' : 'attack');
      }
    } else if (enemy.state === 'approach' && sameLane && dz < 3.1) {
      this.setEnemyState(enemy, 'attack');
    } else if (enemy.state === 'hit') {
      enemy.attackTimer += dt;
      if (enemy.attackTimer > 0.34) {
        this.setEnemyState(enemy, 'approach');
      }
    } else if (enemy.state === 'attack' && enemy.attackTimer > 0.92) {
      this.setEnemyState(enemy, 'approach');
    }
  }

  private setEnemyState(enemy: EnemyEntity, state: EnemyState): void {
    enemy.state = state;
    enemy.attackTimer = 0;
    enemy.attackResolved = false;
  }

  private updateDefeated(enemy: EnemyEntity, dt: number): void {
    enemy.attackTimer += dt;
    enemy.group.position.x += (enemy.lane || 1) * dt * 4.8;
    enemy.group.position.y -= dt * 3.2;
    enemy.group.rotation.z += dt * 4.2;

    if (enemy.attackTimer > 1.15) {
      this.deactivate(enemy);
    }
  }

  private animateEnemy(enemy: EnemyEntity, dt: number): void {
    const root = enemy.group.children[0];
    if (!root) {
      return;
    }

    root.rotation.z = Math.sin(performance.now() * 0.006 + enemy.id) * 0.08;
    if (enemy.state === 'attack') {
      root.rotation.x = -0.28 - Math.sin(enemy.attackTimer * Math.PI * 5) * 0.12;
    } else if (enemy.state === 'hit') {
      root.rotation.x = 0.42;
      enemy.group.position.z += dt * 1.2;
    } else {
      root.rotation.x = 0;
    }

    const warning = enemy.group.children.find((child) => child.name === 'attack-warning');
    if (warning) {
      warning.visible = enemy.state === 'attack';
      warning.scale.setScalar(1 + Math.sin(performance.now() * 0.018) * 0.08);
    }
  }

  private buildEnemy(enemy: EnemyEntity): void {
    const root = new THREE.Group();
    root.name = `${enemy.type}-rig`;
    enemy.group.add(root);

    const bodyMaterial =
      enemy.type === 'shield' ? this.materials.shieldSuit : enemy.type === 'runner' ? this.materials.runnerSuit : this.materials.blockerSuit;
    const body = this.mesh(this.geometries.body, bodyMaterial);
    body.position.y = 0.92;
    body.scale.set(1, enemy.type === 'shield' ? 1.15 : 1, 0.88);
    root.add(body);

    const head = this.mesh(this.geometries.head, this.materials.helmet);
    head.position.y = 1.58;
    root.add(head);

    for (const side of [-1, 1]) {
      const arm = this.mesh(this.geometries.limb, this.materials.limb);
      arm.position.set(side * 0.3, 1.06, 0.02);
      arm.rotation.z = side * 0.35;
      root.add(arm);

      const leg = this.mesh(this.geometries.limb, this.materials.limb);
      leg.position.set(side * 0.14, 0.38, 0);
      leg.rotation.z = side * 0.08;
      root.add(leg);
    }

    if (enemy.type === 'shield') {
      const shield = this.mesh(this.geometries.shield, this.materials.shieldPlate);
      shield.position.set(0, 1.02, -0.26);
      root.add(shield);
    }

    const warning = new THREE.Mesh(this.geometries.warning, this.materials.warning);
    warning.name = 'attack-warning';
    warning.rotation.x = -Math.PI * 0.5;
    warning.position.y = 0.08;
    warning.visible = false;
    enemy.group.add(warning);
  }

  private deactivate(enemy: EnemyEntity): void {
    enemy.active = false;
    enemy.group.visible = false;
    enemy.group.clear();
  }

  private mesh(geometry: THREE.BufferGeometry, material: THREE.Material): THREE.Mesh {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  private createMaterials(): Record<string, THREE.Material> {
    return {
      blockerSuit: new THREE.MeshStandardMaterial({ color: 0x6a1d2b, roughness: 0.48, metalness: 0.32 }),
      runnerSuit: new THREE.MeshStandardMaterial({ color: 0x44306e, roughness: 0.45, metalness: 0.38 }),
      shieldSuit: new THREE.MeshStandardMaterial({ color: 0x222936, roughness: 0.4, metalness: 0.55 }),
      helmet: new THREE.MeshStandardMaterial({ color: 0x0f172a, emissive: 0x4c0519, emissiveIntensity: 0.8, metalness: 0.5 }),
      limb: new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.42, metalness: 0.25 }),
      shieldPlate: new THREE.MeshStandardMaterial({ color: 0x9aa7b3, roughness: 0.3, metalness: 0.8 }),
      warning: new THREE.MeshBasicMaterial({ color: 0xff5f6d, transparent: true, opacity: 0.72, side: THREE.DoubleSide })
    };
  }
}
