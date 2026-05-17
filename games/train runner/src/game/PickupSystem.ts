import * as THREE from 'three';
import { AudioEvents } from './AudioEvents';
import { PHASE2_CONFIG } from './config';
import { EffectsSystem } from './EffectsSystem';
import { Hud } from './Hud';
import { laneToX } from './LaneUtils';
import { PlayerStatsSystem } from './PlayerStatsSystem';
import type { CoachCollider, LaneIndex, LoadoutModifiers, PickupEntity, PickupType, PlayerSnapshot, RouteConfig, RouteTokenType } from './types';

export class PickupSystem {
  readonly group = new THREE.Group();

  private readonly pickups: PickupEntity[] = [];
  private readonly materials: Record<string, THREE.Material>;
  private readonly geometries = {
    coin: new THREE.TorusGeometry(0.25, 0.055, 8, 24),
    orb: new THREE.SphereGeometry(0.2, 18, 12),
    shield: new THREE.TorusGeometry(0.34, 0.04, 8, 28),
    token: new THREE.OctahedronGeometry(0.32, 0),
    glow: new THREE.SphereGeometry(0.42, 12, 8)
  };
  private nextId = 1;
  private routeTokenType: RouteTokenType = 'dataChip';
  private magnetRadiusMultiplier = 1;

  constructor(private readonly audio: AudioEvents) {
    this.group.name = 'Phase 2 pickups';
    this.materials = this.createMaterials();
  }

  configureRoute(route: RouteConfig): void {
    this.routeTokenType = route.tokenType;
    const tokenMaterial = this.materials.routeToken as THREE.MeshStandardMaterial;
    tokenMaterial.color.setHex(route.theme.accent);
    tokenMaterial.emissive.setHex(route.theme.primary);
  }

  configureLoadout(modifiers: LoadoutModifiers): void {
    this.magnetRadiusMultiplier = modifiers.magnetRadiusMultiplier;
  }

  update(
    dt: number,
    snapshot: PlayerSnapshot,
    stats: PlayerStatsSystem,
    effects: EffectsSystem,
    hud: Hud
  ): void {
    for (const pickup of this.pickups) {
      if (!pickup.active) {
        continue;
      }

      pickup.group.rotation.y += dt * (pickup.type === 'coin' ? 5.2 : 2.4);
      pickup.group.position.y = pickup.roofY + 0.95 + Math.sin(performance.now() * 0.004 + pickup.id) * 0.08;

      if (pickup.z < snapshot.position.z - PHASE2_CONFIG.spawn.cleanupBehind) {
        this.deactivate(pickup);
        continue;
      }

      const dx = pickup.group.position.x - snapshot.position.x;
      const dz = pickup.z - snapshot.position.z;
      const radius = PHASE2_CONFIG.pickups.magnetRadius * this.magnetRadiusMultiplier;
      if (dx * dx + dz * dz > radius * radius) {
        continue;
      }

      this.collect(pickup, stats, effects, hud);
    }
  }

  spawnLine(coach: CoachCollider, startZ: number, lane: LaneIndex, type: PickupType, count: number, spacing = 1.85): void {
    for (let i = 0; i < count; i += 1) {
      const z = startZ + i * spacing;
      if (z > coach.endZ - 2.2) {
        break;
      }
      this.spawn(coach, z, lane, type);
    }
  }

  spawn(coach: CoachCollider, z: number, lane: LaneIndex, type: PickupType): void {
    const pickup = this.getFreePickup();
    pickup.type = type;
    pickup.tokenType = type === 'routeToken' ? this.routeTokenType : undefined;
    pickup.lane = lane;
    pickup.z = z;
    pickup.roofY = coach.roofY;
    pickup.active = true;
    pickup.group.visible = true;
    pickup.group.clear();
    pickup.group.position.set(laneToX(coach, lane), coach.roofY + 0.92, z);

    this.buildPickup(pickup);
  }

  reset(): void {
    this.pickups.forEach((pickup) => this.deactivate(pickup));
  }

  dispose(): void {
    Object.values(this.geometries).forEach((geometry) => geometry.dispose());
    Object.values(this.materials).forEach((material) => material.dispose());
  }

  private collect(pickup: PickupEntity, stats: PlayerStatsSystem, effects: EffectsSystem, hud: Hud): void {
    if (pickup.type === 'coin') {
      stats.collectCoin(1, hud);
      this.audio.play('coin');
    } else if (pickup.type === 'energy') {
      stats.collectEnergy(PHASE2_CONFIG.pickups.energyValue, hud);
      this.audio.play('energy');
    } else if (pickup.type === 'routeToken') {
      stats.collectRouteToken(hud);
    } else {
      stats.collectShield(hud);
    }

    effects.triggerPickup({ position: pickup.group.position, intensity: pickup.type === 'shield' || pickup.type === 'routeToken' ? 1 : 0.7 });
    this.deactivate(pickup);
  }

  private buildPickup(pickup: PickupEntity): void {
    const geometry =
      pickup.type === 'coin'
        ? this.geometries.coin
        : pickup.type === 'energy'
          ? this.geometries.orb
          : pickup.type === 'routeToken'
            ? this.geometries.token
            : this.geometries.shield;
    const material =
      pickup.type === 'coin'
        ? this.materials.coin
        : pickup.type === 'energy'
          ? this.materials.energy
          : pickup.type === 'routeToken'
            ? this.materials.routeToken
            : this.materials.shield;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.rotation.y = Math.PI * 0.25;
    pickup.group.add(mesh);

    const glow = new THREE.Mesh(this.geometries.glow, this.materials.glow);
    glow.scale.setScalar(pickup.type === 'shield' || pickup.type === 'routeToken' ? 1.25 : 1);
    pickup.group.add(glow);
  }

  private getFreePickup(): PickupEntity {
    const existing = this.pickups.find((pickup) => !pickup.active);
    if (existing) {
      return existing;
    }

    const pickup: PickupEntity = {
      id: this.nextId,
      type: 'coin',
      tokenType: undefined,
      lane: 0,
      z: 0,
      roofY: 0,
      active: false,
      group: new THREE.Group()
    };
    this.nextId += 1;
    pickup.group.visible = false;
    this.pickups.push(pickup);
    this.group.add(pickup.group);
    return pickup;
  }

  private deactivate(pickup: PickupEntity): void {
    pickup.active = false;
    pickup.tokenType = undefined;
    pickup.group.visible = false;
    pickup.group.clear();
  }

  private createMaterials(): Record<string, THREE.Material> {
    return {
      coin: new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xc87300, emissiveIntensity: 0.9, metalness: 0.7 }),
      energy: new THREE.MeshStandardMaterial({ color: 0x38e8ff, emissive: 0x1bb9ff, emissiveIntensity: 1.8 }),
      shield: new THREE.MeshStandardMaterial({ color: 0x8df7c6, emissive: 0x37ff9f, emissiveIntensity: 1.5, metalness: 0.35 }),
      routeToken: new THREE.MeshStandardMaterial({ color: 0xffb454, emissive: 0x38e8ff, emissiveIntensity: 1.6, metalness: 0.45 }),
      glow: new THREE.MeshBasicMaterial({
        color: 0x7beeff,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    };
  }
}
