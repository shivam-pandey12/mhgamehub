import * as THREE from 'three';
import { PHASE3_CONFIG } from './config';
import { EffectsSystem } from './EffectsSystem';
import { Hud } from './Hud';
import { laneFromX, laneToX } from './LaneUtils';
import { PlayerStatsSystem } from './PlayerStatsSystem';
import { TrainSystem } from './TrainSystem';
import type { CombatHitKind, EliteEnemyEntity, EliteEnemySnapshot, EliteEnemyState, LaneIndex, PlayerSnapshot } from './types';

export interface EliteHitResult {
  hit: boolean;
  defeated: boolean;
}

export class EliteEnemySystem {
  readonly group = new THREE.Group();

  private readonly entity: EliteEnemyEntity;
  private readonly materials: Record<string, THREE.Material>;
  private readonly geometries = {
    body: new THREE.CapsuleGeometry(0.42, 1.1, 8, 16),
    head: new THREE.SphereGeometry(0.28, 16, 10),
    limb: new THREE.CapsuleGeometry(0.13, 0.7, 6, 12),
    plate: new THREE.BoxGeometry(0.72, 0.78, 0.16),
    warning: new THREE.RingGeometry(0.9, 1.04, 32),
    lane: new THREE.BoxGeometry(1.15, 0.035, 5.2)
  };
  private spawned = false;
  private timer = 0;
  private warningMesh: THREE.Mesh | null = null;

  constructor() {
    this.group.name = 'Phase 3 armored brute';
    this.materials = this.createMaterials();
    this.entity = {
      state: 'inactive',
      lane: 0,
      z: 0,
      roofY: 0,
      hp: PHASE3_CONFIG.elite.health,
      maxHp: PHASE3_CONFIG.elite.health,
      active: false,
      group: new THREE.Group()
    };
    this.entity.group.visible = false;
    this.group.add(this.entity.group);
  }

  update(
    dt: number,
    distance: number,
    train: TrainSystem,
    snapshot: PlayerSnapshot,
    stats: PlayerStatsSystem,
    effects: EffectsSystem,
    hud: Hud
  ): void {
    this.trySpawn(distance, snapshot.position.z, train, hud);

    if (!this.entity.active) {
      return;
    }

    this.timer += dt;
    const dz = this.entity.z - snapshot.position.z;
    const surface = train.getSurfaceAt(snapshot.position.x, snapshot.position.z);
    const playerLane = surface ? laneFromX(surface.coach, snapshot.position.x) : 0;
    const sameLane = playerLane === this.entity.lane;

    this.animate(dt);

    if (this.entity.state === 'intro' && this.timer > 1.2) {
      this.setState('slamWindup', hud);
    } else if (this.entity.state === 'slamWindup' && this.timer > 1) {
      this.setState('slamImpact', hud);
      effects.triggerShockwave({ position: this.entity.group.position, intensity: 1 });
      if (Math.abs(dz) < PHASE3_CONFIG.elite.slamRadius && snapshot.grounded) {
        stats.damage('enemy', snapshot.position, effects, hud);
      }
    } else if (this.entity.state === 'slamImpact' && this.timer > 0.5) {
      this.setState('chargeWindup', hud);
    } else if (this.entity.state === 'chargeWindup' && this.timer > 0.9) {
      this.setState('charging', hud);
    } else if (this.entity.state === 'charging') {
      this.entity.z -= dt * 9.2;
      this.entity.group.position.z = this.entity.z;
      if (sameLane && Math.abs(dz) < 1.7) {
        stats.damage('enemy', snapshot.position, effects, hud);
        this.setState('stunned', hud);
      } else if (this.timer > 0.85 || dz < -3) {
        this.setState('stunned', hud);
      }
    } else if (this.entity.state === 'stunned' && this.timer > 1.7) {
      this.entity.z = snapshot.position.z + 12;
      this.entity.group.position.z = this.entity.z;
      this.setState('heavyPunch', hud);
    } else if (this.entity.state === 'heavyPunch') {
      if (sameLane && Math.abs(dz) < PHASE3_CONFIG.elite.punchRange && this.timer > 0.48 && this.timer < 0.6) {
        stats.damage('enemy', snapshot.position, effects, hud);
      }
      if (this.timer > 1.1) {
        this.setState('slamWindup', hud);
      }
    } else if (this.entity.state === 'defeated') {
      this.entity.group.position.x += dt * 4.2;
      this.entity.group.position.y -= dt * 2.2;
      this.entity.group.rotation.z += dt * 2.5;
      if (this.timer > 1.8) {
        this.entity.active = false;
        this.entity.group.visible = false;
      }
    }
  }

  applyHitIfInRange(
    position: THREE.Vector3,
    rangeZ: number,
    rangeX: number,
    kind: CombatHitKind,
    counter: boolean,
    effects: EffectsSystem,
    damageMultiplier = 1
  ): EliteHitResult {
    if (!this.entity.active || this.entity.state === 'defeated') {
      return { hit: false, defeated: false };
    }

    const dz = this.entity.z - position.z;
    const dx = Math.abs(this.entity.group.position.x - position.x);
    if (dz < -0.8 || dz > rangeZ + 1.3 || dx > rangeX + 0.8) {
      return { hit: false, defeated: false };
    }

    const vulnerable = this.entity.state === 'stunned' || counter;
    const damage = (kind === 'dash' || kind === 'jump' || kind === 'counter' ? 2 : 1) * damageMultiplier;
    this.entity.hp -= vulnerable ? damage + 1 : damage;
    effects.triggerEnemyHit({ position: this.entity.group.position.clone().add(new THREE.Vector3(0, 1.6, 0)), intensity: 1.2 });

    if (this.entity.hp <= 0) {
      this.setState('defeated');
      effects.triggerEnemyDefeat({ position: this.entity.group.position.clone().add(new THREE.Vector3(0, 1.6, 0)), intensity: 1.4 });
      return { hit: true, defeated: true };
    }

    this.setState('stunned');
    return { hit: true, defeated: false };
  }

  applySpecial(position: THREE.Vector3, rangeZ: number, rangeX: number, effects: EffectsSystem): boolean {
    if (!this.entity.active || this.entity.state === 'defeated') {
      return false;
    }

    const dz = this.entity.z - position.z;
    const dx = Math.abs(this.entity.group.position.x - position.x);
    if (dz < -0.5 || dz > rangeZ || dx > rangeX + 1.2) {
      return false;
    }

    this.entity.hp -= PHASE3_CONFIG.special.damage;
    effects.triggerEnemyHit({ position: this.entity.group.position.clone().add(new THREE.Vector3(0, 1.6, 0)), intensity: 1.5 });
    if (this.entity.hp <= 0) {
      this.setState('defeated');
      effects.triggerEnemyDefeat({ position: this.entity.group.position.clone().add(new THREE.Vector3(0, 1.6, 0)), intensity: 1.5 });
      return true;
    }

    this.setState('stunned');
    return false;
  }

  reset(): void {
    this.spawned = false;
    this.timer = 0;
    this.entity.active = false;
    this.entity.state = 'inactive';
    this.entity.hp = this.entity.maxHp;
    this.entity.group.visible = false;
    this.entity.group.clear();
    this.warningMesh = null;
  }

  getSnapshot(): EliteEnemySnapshot {
    return {
      active: this.entity.active,
      name: 'ARMORED BRUTE',
      state: this.entity.state,
      health: Math.max(0, this.entity.hp),
      maxHealth: this.entity.maxHp
    };
  }

  dispose(): void {
    Object.values(this.geometries).forEach((geometry) => geometry.dispose());
    Object.values(this.materials).forEach((material) => material.dispose());
  }

  private trySpawn(distance: number, playerZ: number, train: TrainSystem, hud: Hud): void {
    if (this.spawned || distance < PHASE3_CONFIG.segments.eliteStart) {
      return;
    }

    const z = playerZ + PHASE3_CONFIG.elite.spawnDistance;
    const coach = train.coaches.find((item) => z > item.startZ + 4 && z < item.endZ - 5);
    if (!coach) {
      return;
    }

    this.spawned = true;
    this.entity.active = true;
    this.entity.state = 'intro';
    this.entity.hp = this.entity.maxHp;
    this.entity.lane = 0;
    this.entity.z = z;
    this.entity.roofY = coach.roofY;
    this.timer = 0;
    this.entity.group.visible = true;
    this.entity.group.clear();
    this.entity.group.position.set(laneToX(coach, 0), coach.roofY, z);
    this.buildBrute();
    hud.showFeedback('Armored Brute', 1.2);
  }

  private setState(state: EliteEnemyState, hud?: Hud): void {
    this.entity.state = state;
    this.timer = 0;
    if (state === 'slamWindup') {
      hud?.showFeedback('Jump the shockwave', 0.8);
    } else if (state === 'chargeWindup') {
      hud?.showFeedback('Dodge the charge', 0.8);
    }
  }

  private animate(dt: number): void {
    const root = this.entity.group.children.find((child) => child.name === 'brute-root');
    if (root) {
      root.rotation.z = Math.sin(performance.now() * 0.005) * 0.05;
      if (this.entity.state === 'slamWindup') {
        root.rotation.x = -0.45;
      } else if (this.entity.state === 'slamImpact') {
        root.rotation.x = 0.28;
      } else if (this.entity.state === 'charging') {
        root.rotation.x = -0.25;
      } else {
        root.rotation.x = 0;
      }
    }

    if (this.warningMesh) {
      this.warningMesh.visible = this.entity.state === 'slamWindup' || this.entity.state === 'chargeWindup';
      this.warningMesh.rotation.z += dt * 2.4;
      this.warningMesh.scale.setScalar(1 + Math.sin(performance.now() * 0.012) * 0.08);
    }
  }

  private buildBrute(): void {
    const root = new THREE.Group();
    root.name = 'brute-root';
    this.entity.group.add(root);

    const body = this.mesh(this.geometries.body, this.materials.armor);
    body.position.y = 1.2;
    body.scale.set(1.15, 1.2, 1);
    root.add(body);

    const head = this.mesh(this.geometries.head, this.materials.helmet);
    head.position.y = 2.08;
    root.add(head);

    const plate = this.mesh(this.geometries.plate, this.materials.plate);
    plate.position.set(0, 1.35, -0.32);
    root.add(plate);

    for (const side of [-1, 1]) {
      const arm = this.mesh(this.geometries.limb, this.materials.limb);
      arm.position.set(side * 0.52, 1.25, 0);
      arm.rotation.z = side * 0.32;
      arm.scale.set(1.28, 1.15, 1.28);
      root.add(arm);

      const leg = this.mesh(this.geometries.limb, this.materials.limb);
      leg.position.set(side * 0.26, 0.48, 0);
      leg.scale.set(1.35, 1.3, 1.35);
      root.add(leg);
    }

    this.warningMesh = new THREE.Mesh(this.geometries.warning, this.materials.warning);
    this.warningMesh.rotation.x = -Math.PI * 0.5;
    this.warningMesh.position.y = 0.08;
    this.entity.group.add(this.warningMesh);
  }

  private mesh(geometry: THREE.BufferGeometry, material: THREE.Material): THREE.Mesh {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  private createMaterials(): Record<string, THREE.Material> {
    return {
      armor: new THREE.MeshStandardMaterial({ color: 0x303846, roughness: 0.42, metalness: 0.65 }),
      helmet: new THREE.MeshStandardMaterial({ color: 0x111827, emissive: 0xff2038, emissiveIntensity: 0.7 }),
      limb: new THREE.MeshStandardMaterial({ color: 0x6f7786, roughness: 0.4, metalness: 0.62 }),
      plate: new THREE.MeshStandardMaterial({ color: 0xc4d3df, roughness: 0.32, metalness: 0.82 }),
      warning: new THREE.MeshBasicMaterial({ color: 0xffb454, transparent: true, opacity: 0.72, side: THREE.DoubleSide })
    };
  }
}
