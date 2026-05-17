import * as THREE from 'three';
import { disposeObjectTree } from './disposal.js';

const tempVec = new THREE.Vector2();
const zeroVelocity = new THREE.Vector2();

function obstaclePosition(def, time) {
  const speed = def.speed ?? 0.6;
  const phase = def.phase ?? 0;
  const offset = Math.sin(time * speed + phase) * (def.amplitude ?? 0);
  const x = def.x + (def.axis === 'x' ? offset : 0);
  const z = def.z + (def.axis === 'z' ? offset : 0);
  const dx = def.axis === 'x' ? Math.cos(time * speed + phase) * (def.amplitude ?? 0) * speed : 0;
  const dz = def.axis === 'z' ? Math.cos(time * speed + phase) * (def.amplitude ?? 0) * speed : 0;
  return { x, z, velocity: tempVec.set(dx, dz).clone() };
}

export class ObstacleSystem {
  constructor(materials, getHeight) {
    this.materials = materials;
    this.getHeight = getHeight;
    this.group = new THREE.Group();
    this.level = null;
    this.items = [];
    this.time = 0;
  }

  attach(parent) {
    parent.add(this.group);
  }

  clear() {
    for (const child of [...this.group.children]) {
      disposeObjectTree(child, { disposeMaterials: false });
      this.group.remove(child);
    }
    this.items = [];
    this.time = 0;
  }

  load(level) {
    this.clear();
    this.level = level;

    for (const def of level.movingObstacles ?? []) {
      const item = { def, mesh: this.createMesh(def), lastX: def.x, lastZ: def.z, collider: null };
      this.items.push(item);
      this.group.add(item.mesh);
    }
    this.update(0);
  }

  createMesh(def) {
    if (def.type === 'movingPlatform') {
      const group = new THREE.Group();
      const floor = new THREE.Mesh(new THREE.BoxGeometry(def.w, 0.12, def.d), this.materials.greenLight);
      floor.receiveShadow = true;
      floor.castShadow = true;
      group.add(floor);
      const railGeo = new THREE.BoxGeometry(def.w + 0.18, 0.18, 0.12);
      const front = new THREE.Mesh(railGeo, this.materials.gold);
      const back = new THREE.Mesh(railGeo, this.materials.gold);
      front.position.z = -def.d / 2 - 0.04;
      back.position.z = def.d / 2 + 0.04;
      front.position.y = 0.14;
      back.position.y = 0.14;
      group.add(front, back);
      return group;
    }

    const group = new THREE.Group();
    const main = new THREE.Mesh(new THREE.BoxGeometry(def.w, 0.44, def.d), this.materials.gold);
    main.castShadow = true;
    main.receiveShadow = true;
    group.add(main);

    const shine = new THREE.Mesh(new THREE.BoxGeometry(def.w * 0.92, 0.035, def.d * 0.72), this.materials.obstacleShine);
    shine.position.y = 0.24;
    shine.castShadow = false;
    group.add(shine);
    return group;
  }

  update(delta) {
    this.time += delta;
    for (const item of this.items) {
      const { def } = item;
      const previousX = item.mesh.position.x || def.x;
      const previousZ = item.mesh.position.z || def.z;
      const baseHeight = this.getHeight(def.x, def.z);

      let x = def.x;
      let z = def.z;
      let rotation = 0;
      let velocity = zeroVelocity;

      if (def.type === 'slidingGate' || def.type === 'movingPlatform') {
        const next = obstaclePosition(def, this.time);
        x = next.x;
        z = next.z;
        velocity = next.velocity;
      }

      if (def.type === 'rotatingBar') {
        rotation = this.time * (def.speed ?? 0.5) + (def.phase ?? 0);
      }

      if (def.type === 'swingingBlocker') {
        rotation = Math.sin(this.time * (def.speed ?? 0.55) + (def.phase ?? 0)) * (def.amplitude ?? 0.7);
      }

      const h = def.h ?? baseHeight;
      item.mesh.position.set(x, h + (def.type === 'movingPlatform' ? 0.065 : 0.29), z);
      item.mesh.rotation.y = rotation;

      if (!velocity.lengthSq()) {
        tempVec.set((x - previousX) / Math.max(delta, 1 / 60), (z - previousZ) / Math.max(delta, 1 / 60));
        velocity = tempVec;
      }

      item.collider = {
        type: 'box',
        kind: def.type === 'movingPlatform' ? 'platform' : 'movingObstacle',
        x,
        z,
        w: def.w,
        d: def.d,
        h,
        rotation,
        velocity: item.collider?.velocity?.copy(velocity) ?? velocity.clone(),
        velocityBoost: def.type === 'movingPlatform' ? 0 : 0.08,
        isPlatform: def.type === 'movingPlatform'
      };
      item.lastX = x;
      item.lastZ = z;
    }
  }

  getColliders() {
    return this.items
      .map((item) => item.collider)
      .filter((collider) => collider && !collider.isPlatform);
  }

  getPlatforms() {
    return this.items
      .map((item) => item.collider)
      .filter((collider) => collider?.isPlatform);
  }

  getPlatformAt(x, z) {
    return this.getPlatforms().find((platform) => {
      const rotation = platform.rotation ?? 0;
      const cos = Math.cos(-rotation);
      const sin = Math.sin(-rotation);
      const dx = x - platform.x;
      const dz = z - platform.z;
      const localX = dx * cos - dz * sin;
      const localZ = dx * sin + dz * cos;
      return Math.abs(localX) <= platform.w / 2 && Math.abs(localZ) <= platform.d / 2;
    });
  }
}
