import * as THREE from 'three';
import { AudioEvents } from './AudioEvents';
import { PHASE2_CONFIG } from './config';
import { EffectsSystem } from './EffectsSystem';
import { Hud } from './Hud';
import { laneFromX, laneToX, LANES } from './LaneUtils';
import { PlayerStatsSystem } from './PlayerStatsSystem';
import { TrainSystem } from './TrainSystem';
import type { CoachCollider, LaneIndex, ObstacleEntity, ObstacleType, PlayerSnapshot, RouteConfig } from './types';

export class ObstacleSystem {
  readonly group = new THREE.Group();

  private readonly obstacles: ObstacleEntity[] = [];
  private readonly materials: Record<string, THREE.Material>;
  private readonly geometries = {
    box: new THREE.BoxGeometry(1, 1, 1),
    beam: new THREE.BoxGeometry(1, 1, 1),
    ring: new THREE.TorusGeometry(0.34, 0.035, 8, 22)
  };
  private nextId = 1;

  constructor(private readonly audio: AudioEvents) {
    this.group.name = 'Phase 2 obstacles';
    this.materials = this.createMaterials();
  }

  configureRoute(route: RouteConfig): void {
    this.group.name = `${route.displayName} obstacles`;
    this.tintStandard('warning', route.theme.accent, route.theme.secondary, route.biome === 'desert' ? 0.35 : 0.7);
    this.tintStandard('crate', route.biome === 'snow' ? 0xb8c9d7 : route.biome === 'desert' ? 0x8f6038 : 0x5d463b);
    this.tintStandard('redGlow', route.theme.secondary, route.theme.primary, route.biome === 'desert' ? 0.55 : 1.3);
    this.tintBasic('electric', route.theme.primary);
    this.tintBasic('neonAmber', route.theme.accent);
  }

  update(
    dt: number,
    train: TrainSystem,
    snapshot: PlayerSnapshot,
    stats: PlayerStatsSystem,
    effects: EffectsSystem,
    hud: Hud
  ): void {
    for (const obstacle of this.obstacles) {
      if (!obstacle.active) {
        continue;
      }

      this.animateObstacle(obstacle, dt);

      if (obstacle.z < snapshot.position.z - PHASE2_CONFIG.spawn.cleanupBehind) {
        this.deactivate(obstacle);
        continue;
      }

      if (obstacle.passed || Math.abs(snapshot.position.z - obstacle.z) > 0.75) {
        continue;
      }

      const surface = train.getSurfaceAt(snapshot.position.x, snapshot.position.z);
      if (!surface) {
        continue;
      }

      const playerLane = laneFromX(surface.coach, snapshot.position.x);
      const laneBlocked = obstacle.lanes.includes(playerLane);
      if (!laneBlocked) {
        continue;
      }

      const actionValid = this.isCorrectReaction(obstacle, snapshot);
      obstacle.passed = true;

      if (actionValid) {
        if (obstacle.type === 'roofCrate' && snapshot.state === 'dodging') {
          effects.triggerObstacleBreak({ position: obstacle.group.position, intensity: 0.8 });
          stats.addScore({ type: 'obstacleBreak', amount: 45, combo: 1.2, label: 'Crate Break' }, hud);
          this.deactivate(obstacle);
        }
        return;
      }

      const damageType = obstacle.type === 'electricGate' ? 'electric' : obstacle.type === 'brokenPanel' ? 'brokenRoof' : 'obstacle';
      stats.damage(damageType, snapshot.position, effects, hud);
    }
  }

  spawn(coach: CoachCollider, z: number, type: ObstacleType, lane: LaneIndex, safeLane?: LaneIndex): void {
    const obstacle = this.getFreeObstacle();
    obstacle.type = type;
    obstacle.lane = lane;
    obstacle.lanes = type === 'electricGate' ? LANES.filter((candidate) => candidate !== safeLane) : [lane];
    obstacle.z = z;
    obstacle.roofY = coach.roofY;
    obstacle.active = true;
    obstacle.passed = false;
    obstacle.group.visible = true;
    obstacle.group.clear();

    this.buildObstacle(obstacle, coach);
  }

  clearLightHazards(position: THREE.Vector3, rangeZ: number, rangeX: number, effects: EffectsSystem): number {
    let cleared = 0;

    for (const obstacle of this.obstacles) {
      if (!obstacle.active || obstacle.type === 'electricGate' || obstacle.type === 'brokenPanel') {
        continue;
      }

      const dz = obstacle.z - position.z;
      const dx = Math.abs(obstacle.group.position.x - position.x);
      if (dz < -0.5 || dz > rangeZ || dx > rangeX) {
        continue;
      }

      effects.triggerObstacleBreak({ position: obstacle.group.position, intensity: 1 });
      this.deactivate(obstacle);
      cleared += 1;
    }

    return cleared;
  }

  reset(): void {
    this.obstacles.forEach((obstacle) => this.deactivate(obstacle));
  }

  dispose(): void {
    this.group.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.geometry && !(Object.values(this.geometries) as THREE.BufferGeometry[]).includes(mesh.geometry)) {
        mesh.geometry.dispose();
      }
    });
    Object.values(this.geometries).forEach((geometry) => geometry.dispose());
    Object.values(this.materials).forEach((material) => material.dispose());
  }

  private getFreeObstacle(): ObstacleEntity {
    const existing = this.obstacles.find((obstacle) => !obstacle.active);
    if (existing) {
      return existing;
    }

    const obstacle: ObstacleEntity = {
      id: this.nextId,
      type: 'roofCrate',
      lane: 0,
      lanes: [0],
      z: 0,
      roofY: 0,
      active: false,
      passed: false,
      group: new THREE.Group()
    };
    this.nextId += 1;
    obstacle.group.visible = false;
    this.obstacles.push(obstacle);
    this.group.add(obstacle.group);
    return obstacle;
  }

  private buildObstacle(obstacle: ObstacleEntity, coach: CoachCollider): void {
    if (obstacle.type === 'electricGate') {
      this.buildElectricGate(obstacle, coach);
      return;
    }

    const x = laneToX(coach, obstacle.lane);
    obstacle.group.position.set(x, obstacle.roofY, obstacle.z);

    if (obstacle.type === 'lowBarrier') {
      const frame = this.mesh(this.geometries.box, this.materials.warning);
      frame.scale.set(1.05, 0.55, 0.18);
      frame.position.y = 0.72;
      obstacle.group.add(frame);

      const top = this.mesh(this.geometries.box, this.materials.redGlow);
      top.scale.set(1.2, 0.08, 0.24);
      top.position.y = 1.05;
      obstacle.group.add(top);
    } else if (obstacle.type === 'roofCrate') {
      const crate = this.mesh(this.geometries.box, this.materials.crate);
      crate.scale.set(0.88, 0.75, 0.88);
      crate.position.y = 0.44;
      obstacle.group.add(crate);

      for (const side of [-1, 1]) {
        const strip = this.mesh(this.geometries.box, this.materials.neonAmber);
        strip.scale.set(0.08, 0.82, 0.96);
        strip.position.set(side * 0.48, 0.46, 0);
        obstacle.group.add(strip);
      }
    } else if (obstacle.type === 'brokenPanel') {
      const hole = this.mesh(this.geometries.box, this.materials.hole);
      hole.scale.set(1.2, 0.08, 1.38);
      hole.position.y = 0.035;
      obstacle.group.add(hole);

      for (const side of [-1, 1]) {
        const edge = this.mesh(this.geometries.box, this.materials.warning);
        edge.scale.set(0.12, 0.06, 1.4);
        edge.position.set(side * 0.65, 0.11, 0);
        obstacle.group.add(edge);
      }
    } else if (obstacle.type === 'hangingBeam') {
      const post = this.mesh(this.geometries.box, this.materials.infrastructure);
      post.scale.set(0.14, 2.1, 0.14);
      post.position.set(0.72, 1.5, 0);
      obstacle.group.add(post);

      const sign = this.mesh(this.geometries.box, this.materials.redGlow);
      sign.scale.set(1.25, 0.18, 0.28);
      sign.position.y = 1.82;
      obstacle.group.add(sign);
    }
  }

  private buildElectricGate(obstacle: ObstacleEntity, coach: CoachCollider): void {
    obstacle.group.position.set(0, obstacle.roofY, obstacle.z);

    for (const lane of obstacle.lanes) {
      const x = laneToX(coach, lane);
      const pillarA = this.mesh(this.geometries.box, this.materials.infrastructure);
      pillarA.scale.set(0.12, 1.35, 0.12);
      pillarA.position.set(x - 0.43, 0.72, 0);
      obstacle.group.add(pillarA);

      const pillarB = this.mesh(this.geometries.box, this.materials.infrastructure);
      pillarB.scale.set(0.12, 1.35, 0.12);
      pillarB.position.set(x + 0.43, 0.72, 0);
      obstacle.group.add(pillarB);

      const arc = this.mesh(this.geometries.box, this.materials.electric);
      arc.scale.set(0.95, 0.05, 0.1);
      arc.position.set(x, 1.26, 0);
      obstacle.group.add(arc);

      const warning = this.mesh(this.geometries.ring, this.materials.electric);
      warning.rotation.x = Math.PI * 0.5;
      warning.position.set(x, 0.09, -0.62);
      obstacle.group.add(warning);
    }
  }

  private isCorrectReaction(obstacle: ObstacleEntity, snapshot: PlayerSnapshot): boolean {
    if (obstacle.type === 'lowBarrier' || obstacle.type === 'hangingBeam') {
      return snapshot.state === 'sliding';
    }

    if (obstacle.type === 'roofCrate') {
      return snapshot.state === 'dodging' || !snapshot.grounded || snapshot.position.y > obstacle.roofY + 0.72;
    }

    if (obstacle.type === 'brokenPanel') {
      return !snapshot.grounded || snapshot.position.y > obstacle.roofY + 0.55;
    }

    return false;
  }

  private animateObstacle(obstacle: ObstacleEntity, dt: number): void {
    if (obstacle.type === 'electricGate') {
      obstacle.group.children.forEach((child, index) => {
        if (index % 4 === 2) {
          child.scale.x = 0.8 + Math.sin(performance.now() * 0.02 + obstacle.id) * 0.18;
        }
      });
    } else if (obstacle.type === 'roofCrate') {
      obstacle.group.rotation.y += dt * 0.22;
    }
  }

  private deactivate(obstacle: ObstacleEntity): void {
    obstacle.active = false;
    obstacle.group.visible = false;
    obstacle.group.clear();
  }

  private mesh(geometry: THREE.BufferGeometry, material: THREE.Material): THREE.Mesh {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  private createMaterials(): Record<string, THREE.Material> {
    return {
      warning: new THREE.MeshStandardMaterial({ color: 0xffb454, emissive: 0x7d3e07, emissiveIntensity: 0.7 }),
      crate: new THREE.MeshStandardMaterial({ color: 0x5d463b, roughness: 0.58, metalness: 0.35 }),
      hole: new THREE.MeshStandardMaterial({ color: 0x030712, roughness: 0.9, metalness: 0.2 }),
      infrastructure: new THREE.MeshStandardMaterial({ color: 0x9aa7b3, roughness: 0.4, metalness: 0.76 }),
      redGlow: new THREE.MeshStandardMaterial({ color: 0xff5f6d, emissive: 0xff2038, emissiveIntensity: 1.3 }),
      electric: new THREE.MeshBasicMaterial({ color: 0x55f7ff }),
      neonAmber: new THREE.MeshBasicMaterial({ color: 0xffb454 })
    };
  }

  private tintStandard(name: string, color: number, emissive?: number, emissiveIntensity?: number): void {
    const material = this.materials[name] as THREE.MeshStandardMaterial | undefined;
    if (!material) {
      return;
    }

    material.color.setHex(color);
    if (emissive !== undefined) {
      material.emissive.setHex(emissive);
      material.emissiveIntensity = emissiveIntensity ?? material.emissiveIntensity;
    }
  }

  private tintBasic(name: string, color: number): void {
    const material = this.materials[name] as THREE.MeshBasicMaterial | undefined;
    material?.color.setHex(color);
  }
}
