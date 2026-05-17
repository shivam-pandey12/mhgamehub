import * as THREE from 'three';
import { AudioEvents } from './AudioEvents';
import { CameraController } from './CameraController';
import { EffectsSystem } from './EffectsSystem';
import { Hud } from './Hud';
import { ObstacleSystem } from './ObstacleSystem';
import { getRouteById } from './RouteConfig';
import { TrainSystem } from './TrainSystem';
import type { PlayerSnapshot, RouteConfig, RouteSetPieceConfig, SetPieceSnapshot, SetPieceState } from './types';

export class SetPieceSystem {
  readonly group = new THREE.Group();

  private state: SetPieceState = 'inactive';
  private readonly triggeredEvents = new Set<string>();
  private sideTrain = new THREE.Group();
  private material = new THREE.MeshStandardMaterial({ color: 0x27466f, roughness: 0.42, metalness: 0.42 });
  private glow = new THREE.MeshBasicMaterial({ color: 0x70f7ff });
  private route: RouteConfig = getRouteById('neon-express');

  constructor(private readonly audio: AudioEvents) {
    this.group.name = 'Phase 3 set pieces';
    this.buildSideTrain();
  }

  configureRoute(route: RouteConfig): void {
    this.route = route;
    this.material.color.setHex(route.biome === 'desert' ? 0x7b5532 : route.biome === 'snow' ? 0xb8c9d7 : 0x27466f);
    this.glow.color.setHex(route.theme.primary);
    this.reset();
  }

  update(
    dt: number,
    distance: number,
    snapshot: PlayerSnapshot,
    train: TrainSystem,
    obstacles: ObstacleSystem,
    effects: EffectsSystem,
    hud: Hud,
    camera: CameraController
  ): void {
    const activeEvent = this.getActiveEvent(distance);
    const eventKey = activeEvent ? `${activeEvent.type}-${activeEvent.start}` : '';
    this.state = activeEvent?.type ?? 'inactive';

    if (this.state === 'tunnelRush' && !this.triggeredEvents.has(eventKey)) {
      this.triggeredEvents.add(eventKey);
      this.audio.play('tunnelWhoosh');
      hud.showFeedback('Tunnel Rush', 1.1);
      camera.triggerCinematic(1.2);
      camera.addFovImpulse(4);
      this.spawnTunnelBeams(snapshot.position.z, train, obstacles);
    }

    if (this.state === 'sideTrain' && !this.triggeredEvents.has(eventKey)) {
      this.triggeredEvents.add(eventKey);
      this.audio.play('sideTrainPass');
      hud.showFeedback('Side Train Passing', 1.1);
      camera.triggerCinematic(1.4);
      camera.addFovImpulse(5);
    }

    this.sideTrain.visible = this.state === 'sideTrain';
    if (this.sideTrain.visible) {
      this.sideTrain.position.set(7.2 + Math.sin(distance * 0.08) * 0.4, snapshot.position.y - 0.2, snapshot.position.z + 16);
      this.sideTrain.rotation.z = Math.sin(distance * 0.11) * 0.018;
      effects.triggerSetPiece({ position: snapshot.position, intensity: 0.18 });
    }

    if (this.state === 'tunnelRush') {
      effects.triggerSetPiece({ position: snapshot.position, intensity: 0.12 });
    }
  }

  reset(): void {
    this.state = 'inactive';
    this.triggeredEvents.clear();
    this.sideTrain.visible = false;
  }

  getSnapshot(distance: number): SetPieceSnapshot {
    const state = this.getStateForDistance(distance);
    const event = this.getActiveEvent(distance);
    const start = event?.start ?? 0;
    const end = event?.end ?? 1;
    return {
      state,
      label: state === 'tunnelRush' ? 'Tunnel Rush' : state === 'sideTrain' ? 'Side Train Passing' : '',
      progress: state === 'inactive' ? 0 : THREE.MathUtils.clamp((distance - start) / (end - start), 0, 1)
    };
  }

  dispose(): void {
    this.group.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
    });
    this.material.dispose();
    this.glow.dispose();
  }

  private spawnTunnelBeams(playerZ: number, train: TrainSystem, obstacles: ObstacleSystem): void {
    for (let i = 0; i < 4; i += 1) {
      const z = playerZ + 26 + i * 14;
      const coach = train.coaches.find((item) => z > item.startZ + 4 && z < item.endZ - 4);
      if (coach) {
        obstacles.spawn(coach, z, 'hangingBeam', i % 2 === 0 ? -1 : 1);
      }
    }
  }

  private getStateForDistance(distance: number): SetPieceState {
    return this.getActiveEvent(distance)?.type ?? 'inactive';
  }

  private getActiveEvent(distance: number): RouteSetPieceConfig | null {
    return this.route.setPieces.find((event) => distance >= event.start && distance <= event.end) ?? null;
  }

  private buildSideTrain(): void {
    this.sideTrain.visible = false;
    for (let i = 0; i < 5; i += 1) {
      const car = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.7, 12), this.material);
      car.position.z = i * 13.2;
      car.castShadow = true;
      car.receiveShadow = true;
      this.sideTrain.add(car);

      const strip = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 10.4), this.glow);
      strip.position.set(-2.14, 1.1, i * 13.2);
      this.sideTrain.add(strip);
    }
    this.group.add(this.sideTrain);
  }
}
