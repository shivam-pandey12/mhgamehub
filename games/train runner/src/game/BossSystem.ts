import * as THREE from 'three';
import { AudioEvents } from './AudioEvents';
import { PHASE3_CONFIG } from './config';
import { CameraController } from './CameraController';
import { EffectsSystem } from './EffectsSystem';
import { EnemySystem } from './EnemySystem';
import { Hud } from './Hud';
import { laneFromX, laneToX, LANES } from './LaneUtils';
import { pseudoRandom } from './math';
import { PlayerStatsSystem } from './PlayerStatsSystem';
import { DIFFICULTY_PROFILES, getRouteById } from './RouteConfig';
import { TrainSystem } from './TrainSystem';
import type { BossAttackPhase, BossSnapshot, BossState, CoachCollider, DifficultyProfile, LaneIndex, PlayerSnapshot, RouteConfig } from './types';

interface MissileMarker {
  lane: LaneIndex;
  z: number;
  group: THREE.Group;
  resolved: boolean;
}

export class BossSystem {
  readonly group = new THREE.Group();

  private readonly heli = new THREE.Group();
  private readonly markerGroup = new THREE.Group();
  private readonly markers: MissileMarker[] = [];
  private readonly materials: Record<string, THREE.Material>;
  private readonly geometries = {
    body: new THREE.BoxGeometry(2.7, 1.05, 4.2),
    cockpit: new THREE.SphereGeometry(0.65, 18, 12),
    tail: new THREE.BoxGeometry(0.35, 0.32, 3.4),
    blade: new THREE.BoxGeometry(5.2, 0.035, 0.22),
    pod: new THREE.BoxGeometry(0.45, 0.34, 1.05),
    skid: new THREE.BoxGeometry(0.12, 0.12, 2.6),
    marker: new THREE.RingGeometry(0.55, 0.72, 32),
    flare: new THREE.SphereGeometry(0.18, 10, 8)
  };

  private state: BossState = 'inactive';
  private phase: BossAttackPhase = 'missile';
  private health: number = PHASE3_CONFIG.boss.health;
  private maxHealth: number = PHASE3_CONFIG.boss.health;
  private timer = 0;
  private cycle = 0;
  private droneDropped = false;
  private rotor: THREE.Object3D | null = null;
  private tailRotor: THREE.Object3D | null = null;
  private route: RouteConfig = getRouteById('neon-express');
  private difficulty: DifficultyProfile = DIFFICULTY_PROFILES.easy;

  constructor(private readonly audio: AudioEvents) {
    this.group.name = 'Phase 3 SKY RAIDER boss';
    this.materials = this.createMaterials();
    this.heli.visible = false;
    this.markerGroup.name = 'boss missile markers';
    this.group.add(this.heli, this.markerGroup);
    this.buildHelicopter();
  }

  configureRoute(route: RouteConfig): void {
    this.route = route;
    this.difficulty = DIFFICULTY_PROFILES[route.difficulty];
    this.maxHealth = route.bossHealth;
    this.health = this.maxHealth;
    (this.materials.body as THREE.MeshStandardMaterial).color.setHex(route.biome === 'desert' ? 0x5a4738 : route.biome === 'snow' ? 0xb8c9d7 : 0x263141);
    (this.materials.cockpit as THREE.MeshStandardMaterial).emissive.setHex(route.theme.primary);
    (this.materials.pod as THREE.MeshStandardMaterial).color.setHex(route.theme.secondary);
    (this.materials.marker as THREE.MeshBasicMaterial).color.setHex(route.theme.secondary);
    (this.materials.red as THREE.MeshBasicMaterial).color.setHex(route.theme.accent);
  }

  update(
    dt: number,
    distance: number,
    train: TrainSystem,
    snapshot: PlayerSnapshot,
    stats: PlayerStatsSystem,
    enemies: EnemySystem,
    effects: EffectsSystem,
    hud: Hud,
    camera: CameraController
  ): void {
    if (this.state === 'inactive' && distance >= this.route.bossStartDistance) {
      this.activate(snapshot, hud, camera);
    }

    if (this.state === 'inactive' || this.state === 'defeated') {
      return;
    }

    this.timer += dt;
    this.animateHelicopter(dt, snapshot);
    this.updateMarkers(dt);

    if (this.state === 'intro' && this.timer > PHASE3_CONFIG.boss.introDuration) {
      this.enterMissileWarning(train, snapshot, hud);
    } else if (this.state === 'missileWarning' && this.timer > PHASE3_CONFIG.boss.missileWarningDuration * this.difficulty.bossWarningMultiplier) {
      this.state = 'missileImpact';
      this.phase = 'missile';
      this.timer = 0;
      this.audio.play('missileLaunch');
      this.resolveMissiles(train, snapshot, stats, effects, hud, camera);
    } else if (this.state === 'missileImpact' && this.timer > PHASE3_CONFIG.boss.missileImpactDuration) {
      this.enterDroneDrop(train, snapshot, enemies, hud);
    } else if (this.state === 'droneDrop' && this.timer > PHASE3_CONFIG.boss.droneDropDuration) {
      this.enterVulnerable(hud, camera);
    } else if (this.state === 'vulnerable' && this.timer > PHASE3_CONFIG.boss.vulnerableDuration) {
      this.enterRetreat(hud);
    } else if (this.state === 'retreat' && this.timer > PHASE3_CONFIG.boss.retreatDuration) {
      this.enterMissileWarning(train, snapshot, hud);
    } else if (this.state === 'crashing') {
      this.heli.position.x += dt * 9;
      this.heli.position.y -= dt * 4.5;
      this.heli.rotation.z += dt * 4;
      this.heli.rotation.x += dt * 1.8;
      if (this.timer > 2.2) {
        this.state = 'defeated';
        this.heli.visible = false;
      }
    }
  }

  applySpecial(position: THREE.Vector3, effects: EffectsSystem, hud: Hud, stats: PlayerStatsSystem): boolean {
    if (this.state !== 'vulnerable') {
      return false;
    }

    const dz = Math.abs(this.heli.position.z - position.z);
    if (dz > 22) {
      return false;
    }

    this.health = Math.max(0, this.health - PHASE3_CONFIG.special.bossDamage);
    this.audio.play('bossDamage');
    effects.triggerBossDamage({ position: this.heli.position.clone(), intensity: 1.3 });
    hud.showFeedback('Boss Hit', 0.75);

    if (this.health <= 0) {
      this.defeat(stats, effects, hud);
      return true;
    }

    this.enterRetreat(hud);
    return true;
  }

  reset(): void {
    this.state = 'inactive';
    this.phase = 'missile';
    this.maxHealth = this.route.bossHealth;
    this.health = this.maxHealth;
    this.timer = 0;
    this.cycle = 0;
    this.droneDropped = false;
    this.heli.visible = false;
    this.heli.rotation.set(0, 0, 0);
    this.clearMarkers();
  }

  getSnapshot(): BossSnapshot {
    return {
      active: this.state !== 'inactive' && this.state !== 'defeated',
      name: this.route.bossName,
      state: this.state,
      phase: this.phase,
      health: this.health,
      maxHealth: this.maxHealth,
      vulnerable: this.state === 'vulnerable'
    };
  }

  get isDefeated(): boolean {
    return this.state === 'defeated';
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

  private activate(snapshot: PlayerSnapshot, hud: Hud, camera: CameraController): void {
    this.state = 'intro';
    this.phase = 'missile';
    this.timer = 0;
    this.heli.visible = true;
    this.heli.position.set(-18, snapshot.position.y + 11, snapshot.position.z + 38);
    this.heli.rotation.set(0, 0.35, 0);
    this.audio.play('bossIntro');
    hud.showFeedback(this.route.bossName, 2.2);
    camera.triggerCinematic(3.2);
    camera.addFovImpulse(7);
  }

  private enterMissileWarning(train: TrainSystem, snapshot: PlayerSnapshot, hud: Hud): void {
    this.state = 'missileWarning';
    this.phase = 'missile';
    this.timer = 0;
    this.cycle += 1;
    this.clearMarkers();
    hud.showFeedback('Missile Lock', 0.8);

    const baseZ = snapshot.position.z + 9;
    const lanes = [...LANES].sort((a, b) => pseudoRandom(this.cycle + a + 3) - pseudoRandom(this.cycle + b + 5));
    for (let i = 0; i < 2; i += 1) {
      const lane = lanes[i] ?? 0;
      const z = baseZ + i * 5.2;
      const coach = train.coaches.find((item) => z > item.startZ && z < item.endZ);
      if (!coach) {
        continue;
      }
      this.addMarker(coach, lane, z);
    }
  }

  private enterDroneDrop(train: TrainSystem, snapshot: PlayerSnapshot, enemies: EnemySystem, hud: Hud): void {
    this.state = 'droneDrop';
    this.phase = 'droneDrop';
    this.timer = 0;
    this.droneDropped = true;
    hud.showFeedback('Drone Drop', 0.75);

    for (let i = 0; i < 3; i += 1) {
      const z = snapshot.position.z + 12 + i * 4.4;
      const coach = train.coaches.find((item) => z > item.startZ + 3 && z < item.endZ - 3);
      if (coach) {
        enemies.spawn(coach, z, LANES[(i + this.cycle) % LANES.length] ?? 0, i === 2 ? 'runner' : 'laneBlocker');
      }
    }
  }

  private enterVulnerable(hud: Hud, camera: CameraController): void {
    this.state = 'vulnerable';
    this.phase = 'vulnerable';
    this.timer = 0;
    hud.showFeedback('Boss Vulnerable - Press E', 1);
    camera.addFovImpulse(4);
  }

  private enterRetreat(hud: Hud): void {
    this.state = 'retreat';
    this.phase = 'vulnerable';
    this.timer = 0;
    hud.showFeedback('Boss Retreating', 0.5);
  }

  private defeat(stats: PlayerStatsSystem, effects: EffectsSystem, hud: Hud): void {
    this.state = 'crashing';
    this.phase = 'crash';
    this.timer = 0;
    stats.recordBossDefeated();
    this.audio.play('bossDefeat');
    effects.triggerExplosion({ position: this.heli.position.clone(), intensity: 1.8 });
    hud.showFeedback(`${this.route.bossName} DOWN`, 1.4);
    this.clearMarkers();
  }

  private resolveMissiles(
    train: TrainSystem,
    snapshot: PlayerSnapshot,
    stats: PlayerStatsSystem,
    effects: EffectsSystem,
    hud: Hud,
    camera: CameraController
  ): void {
    const surface = train.getSurfaceAt(snapshot.position.x, snapshot.position.z);
    const playerLane = surface ? laneFromX(surface.coach, snapshot.position.x) : 0;

    for (const marker of this.markers) {
      marker.resolved = true;
      effects.triggerExplosion({ position: marker.group.position.clone().add(new THREE.Vector3(0, 0.5, 0)), intensity: 1.1 });
      if (marker.lane === playerLane && Math.abs(marker.z - snapshot.position.z) < 2.2) {
        stats.damage('enemy', snapshot.position, effects, hud);
      }
    }

    camera.addFovImpulse(5);
  }

  private addMarker(coach: CoachCollider, lane: LaneIndex, z: number): void {
    const group = new THREE.Group();
    group.position.set(laneToX(coach, lane), coach.roofY + 0.08, z);

    const ring = new THREE.Mesh(this.geometries.marker, this.materials.marker);
    ring.rotation.x = -Math.PI * 0.5;
    group.add(ring);

    const flare = new THREE.Mesh(this.geometries.flare, this.materials.red);
    flare.position.y = 0.18;
    group.add(flare);

    this.markerGroup.add(group);
    this.markers.push({ lane, z, group, resolved: false });
  }

  private clearMarkers(): void {
    for (const marker of this.markers) {
      marker.group.removeFromParent();
    }
    this.markers.length = 0;
  }

  private updateMarkers(dt: number): void {
    for (const marker of this.markers) {
      marker.group.rotation.y += dt * 2.5;
      const scale = 1 + Math.sin(performance.now() * 0.014 + marker.z) * 0.12;
      marker.group.scale.setScalar(scale);
    }
  }

  private animateHelicopter(dt: number, snapshot: PlayerSnapshot): void {
    const side = this.state === 'vulnerable' ? -7.2 : -11.5;
    const height = this.state === 'crashing' ? this.heli.position.y : snapshot.position.y + (this.state === 'vulnerable' ? 6.8 : 9.8);
    const targetZ = snapshot.position.z + (this.state === 'intro' ? 24 : 14);
    this.heli.position.x = THREE.MathUtils.damp(this.heli.position.x, side, 2.7, dt);
    this.heli.position.y = THREE.MathUtils.damp(this.heli.position.y, height, 2.4, dt);
    this.heli.position.z = THREE.MathUtils.damp(this.heli.position.z, targetZ, 3.1, dt);
    this.heli.rotation.y = Math.sin(performance.now() * 0.002) * 0.14 + 0.35;
    this.rotor?.rotateY(dt * 34);
    this.tailRotor?.rotateX(dt * 42);
  }

  private buildHelicopter(): void {
    const body = this.mesh(this.geometries.body, this.materials.body);
    body.castShadow = true;
    this.heli.add(body);

    const cockpit = this.mesh(this.geometries.cockpit, this.materials.cockpit);
    cockpit.scale.set(0.95, 0.62, 0.9);
    cockpit.position.set(0, 0.08, -1.78);
    this.heli.add(cockpit);

    const tail = this.mesh(this.geometries.tail, this.materials.body);
    tail.position.set(0, 0.1, 3.65);
    this.heli.add(tail);

    this.rotor = new THREE.Group();
    this.rotor.position.y = 0.8;
    for (let i = 0; i < 2; i += 1) {
      const blade = this.mesh(this.geometries.blade, this.materials.rotor);
      blade.rotation.y = (Math.PI * i) / 2;
      this.rotor.add(blade);
    }
    this.heli.add(this.rotor);

    this.tailRotor = new THREE.Group();
    this.tailRotor.position.set(0, 0.2, 5.38);
    for (let i = 0; i < 2; i += 1) {
      const blade = this.mesh(this.geometries.blade, this.materials.rotor);
      blade.scale.set(0.32, 1, 0.42);
      blade.rotation.z = (Math.PI * i) / 2;
      this.tailRotor.add(blade);
    }
    this.heli.add(this.tailRotor);

    for (const side of [-1, 1]) {
      const pod = this.mesh(this.geometries.pod, this.materials.pod);
      pod.position.set(side * 1.68, -0.1, -0.55);
      this.heli.add(pod);

      const skid = this.mesh(this.geometries.skid, this.materials.rotor);
      skid.position.set(side * 0.95, -0.88, 0.2);
      this.heli.add(skid);
    }
  }

  private mesh(geometry: THREE.BufferGeometry, material: THREE.Material): THREE.Mesh {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  private createMaterials(): Record<string, THREE.Material> {
    return {
      body: new THREE.MeshStandardMaterial({ color: 0x263141, roughness: 0.42, metalness: 0.62 }),
      cockpit: new THREE.MeshStandardMaterial({ color: 0x0b213d, emissive: 0x104e73, emissiveIntensity: 0.8, roughness: 0.16, metalness: 0.45 }),
      rotor: new THREE.MeshStandardMaterial({ color: 0xa8bac8, roughness: 0.32, metalness: 0.85 }),
      pod: new THREE.MeshStandardMaterial({ color: 0x4c1d24, roughness: 0.46, metalness: 0.6 }),
      marker: new THREE.MeshBasicMaterial({ color: 0xff243f, transparent: true, opacity: 0.76, side: THREE.DoubleSide }),
      red: new THREE.MeshBasicMaterial({ color: 0xff5f6d })
    };
  }
}
