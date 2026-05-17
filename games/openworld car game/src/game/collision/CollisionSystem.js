import * as THREE from '../../vendor/three.js';
import { clamp } from '../utils/math.js';

export const COLLISION_TYPES = {
  HARD_SOLID: 'HARD_SOLID',
  SLIDE_SOLID: 'SLIDE_SOLID',
  LOW_SURPASSABLE: 'LOW_SURPASSABLE',
  SOFT_PASSABLE: 'SOFT_PASSABLE',
  SOLID_STATIC: 'HARD_SOLID',
  SOLID_DYNAMIC: 'SOLID_DYNAMIC',
  ROAD_SURFACE: 'ROAD_SURFACE',
  SOFT_OBSTACLE: 'SOFT_PASSABLE',
  TRIGGER_ONLY: 'TRIGGER_ONLY',
  DECORATIVE_NO_COLLISION: 'DECORATIVE_NO_COLLISION',
  NO_BUILD_ZONE: 'NO_BUILD_ZONE'
};

export const COLLISION_TUNING = {
  carColliderPadding: 0.035,
  staticColliderPadding: 0.02,
  trafficColliderPadding: 0.04,
  softObstaclePushForce: 0.18,
  collisionDamping: 0.68,
  wallSlideFriction: 0.84,
  bounceFactor: 0.92,
  minImpactSpeedForEffect: 5.5,
  softObstaclePassThreshold: 3.2,
  curbClimbHeight: 0.62,
  breakerClimbHeight: 0.45,
  barrierHardness: 0.82
};

const DEBUG_COLORS = {
  [COLLISION_TYPES.HARD_SOLID]: 0xff4f4a,
  [COLLISION_TYPES.SLIDE_SOLID]: 0xffd057,
  [COLLISION_TYPES.LOW_SURPASSABLE]: 0x69d9ff,
  [COLLISION_TYPES.SOFT_PASSABLE]: 0x55e0d2,
  [COLLISION_TYPES.SOLID_DYNAMIC]: 0x67d9ff,
  [COLLISION_TYPES.ROAD_SURFACE]: 0x7fd8be,
  [COLLISION_TYPES.TRIGGER_ONLY]: 0x4da4ff,
  [COLLISION_TYPES.NO_BUILD_ZONE]: 0xb48cff
};

export class CollisionSystem {
  constructor(scene) {
    this.scene = scene;
    this.cellSize = 34;
    this.colliders = [];
    this.roadSurfaces = [];
    this.grid = new Map();
    this.debugGroup = new THREE.Group();
    this.debugGroup.name = 'Collision Debug';
    this.debugGroup.visible = false;
    this.scene.add(this.debugGroup);
    this.debugTimer = 0;
    this.lastDebugStats = {
      staticCount: 0,
      roadSurfaceCount: 0,
      nearbyCount: 0,
      currentSurface: 'ground'
    };
  }

  addBox(options) {
    const type = options.type ?? COLLISION_TYPES.HARD_SOLID;
    const padding = options.padding ?? (
      type === COLLISION_TYPES.SLIDE_SOLID
        ? COLLISION_TUNING.staticColliderPadding
        : type === COLLISION_TYPES.HARD_SOLID
          ? COLLISION_TUNING.staticColliderPadding
          : 0
    );
    const collider = {
      id: options.id,
      type,
      center: new THREE.Vector2(options.center[0], options.center[1]),
      size: new THREE.Vector2(
        Math.max(0.05, options.size[0] - padding * 2),
        Math.max(0.05, options.size[1] - padding * 2)
      ),
      rotation: options.rotation ?? 0,
      yMin: options.yMin ?? 0,
      yMax: options.yMax ?? 8,
      response: options.response ?? 'block',
      metadata: options.metadata ?? {}
    };
    collider.aabb = this.computeAabb(collider);
    this.colliders.push(collider);
    if (collider.type === COLLISION_TYPES.ROAD_SURFACE) {
      this.roadSurfaces.push(collider);
    } else if (this.isBlockingType(collider.type)) {
      this.insertIntoGrid(collider);
    }
    this.lastDebugStats.staticCount = this.colliders.filter((item) => this.isBlockingType(item.type)).length;
    this.lastDebugStats.roadSurfaceCount = this.roadSurfaces.length;
    return collider;
  }

  addRoadSurface(options) {
    return this.addBox({
      ...options,
      type: COLLISION_TYPES.ROAD_SURFACE,
      yMin: options.yMin ?? (options.surfaceHeight ?? 0) - 0.25,
      yMax: options.yMax ?? (options.surfaceHeight ?? 0) + 0.35,
      response: 'surface'
    });
  }

  resolvePlayer(controller, dt = 0.016) {
    const player = controller.getCollider();
    const queryRadius = Math.max(player.size.x, player.size.y) * 0.58 + 2.2;
    const nearby = this.queryNearby(player.center, queryRadius);
    let collided = false;
    let maxIntensity = 0;
    const collisionIds = [];

    for (const collider of nearby) {
      if (!this.verticalOverlap(player, collider)) continue;
      const hit = this.testObbOverlap(player, collider);
      if (!hit) continue;

      if (collider.type === COLLISION_TYPES.LOW_SURPASSABLE) {
        controller.registerLowSurfaceBump?.(collider.metadata?.bump ?? 0.12, dt);
        controller.velocity.multiplyScalar(collider.metadata?.slowdown ?? 0.96);
        continue;
      }

      if (collider.type === COLLISION_TYPES.SOFT_PASSABLE) {
        const impactSpeed = controller.velocity.length();
        controller.velocity.multiplyScalar(collider.metadata?.slowdown ?? 0.93);
        if (impactSpeed > COLLISION_TUNING.softObstaclePassThreshold) {
          controller.registerCollisionImpact?.(0.12, collider.id, dt, { quiet: true });
        }
        continue;
      }

      const slideSolid = collider.type === COLLISION_TYPES.SLIDE_SOLID || collider.response === 'slide';
      const push = hit.normal.clone().multiplyScalar(hit.depth + (slideSolid ? 0.006 : 0.012));
      controller.position.x += push.x;
      controller.position.z += push.z;
      player.center.x = controller.position.x;
      player.center.y = controller.position.z;

      const normal3 = new THREE.Vector3(hit.normal.x, 0, hit.normal.z);
      const intoWall = controller.velocity.dot(normal3);
      if (intoWall < 0) {
        controller.velocity.addScaledVector(normal3, -intoWall * (slideSolid ? COLLISION_TUNING.barrierHardness : COLLISION_TUNING.bounceFactor));
      }
      controller.velocity.multiplyScalar(slideSolid ? COLLISION_TUNING.wallSlideFriction : COLLISION_TUNING.collisionDamping);

      const intensity = clamp((slideSolid ? 0.1 : 0.16) + hit.depth * 0.18 + controller.velocity.length() * 0.018, 0.12, 1.05);
      maxIntensity = Math.max(maxIntensity, intensity);
      collided = true;
      collisionIds.push(collider.id);
    }

    if (collided) {
      controller.registerCollisionImpact(maxIntensity, collisionIds[0], dt);
    }

    return {
      collided,
      intensity: maxIntensity,
      count: collisionIds.length,
      ids: collisionIds
    };
  }

  resolveTrafficVehicles(controller, vehicles) {
    const player = controller.getCollider();
    let count = 0;
    vehicles.forEach((traffic) => {
      const dims = traffic.mesh.userData.dimensions;
      if (!dims) return;
      const collider = {
        id: `traffic-${traffic.type}`,
        type: COLLISION_TYPES.SOLID_DYNAMIC,
        center: new THREE.Vector2(traffic.mesh.position.x, traffic.mesh.position.z),
        size: new THREE.Vector2(
          Math.max(0.4, dims.width * traffic.mesh.scale.x * 0.82 + COLLISION_TUNING.trafficColliderPadding),
          Math.max(0.4, dims.length * traffic.mesh.scale.z * 0.84 + COLLISION_TUNING.trafficColliderPadding)
        ),
        rotation: traffic.mesh.rotation.y,
        yMin: traffic.mesh.position.y - 0.15,
        yMax: traffic.mesh.position.y + dims.height * traffic.mesh.scale.y + 1.2
      };
      if (!this.verticalOverlap(player, collider)) return;
      const hit = this.testObbOverlap(player, collider);
      if (!hit) return;
      controller.position.x += hit.normal.x * (hit.depth + 0.04);
      controller.position.z += hit.normal.z * (hit.depth + 0.04);
      const normal3 = new THREE.Vector3(hit.normal.x, 0, hit.normal.z);
      const intoTraffic = controller.velocity.dot(normal3);
      if (intoTraffic < 0) controller.velocity.addScaledVector(normal3, -intoTraffic * 1.05);
      controller.velocity.multiplyScalar(0.62);
      traffic.mesh.position.x -= hit.normal.x * Math.min(hit.depth * 0.28, 0.5);
      traffic.mesh.position.z -= hit.normal.z * Math.min(hit.depth * 0.28, 0.5);
      traffic.cooldown = 0.9;
      count += 1;
    });
    if (count) controller.registerCollisionImpact(0.72, 'traffic', 0.016);
    return count;
  }

  findNearestRoadSurface(position, currentSurfaceInfo = null) {
    let best = null;
    let bestDistance = Infinity;
    const currentHeight = currentSurfaceInfo?.surfaceHeight ?? 0;
    const allowHighSurface = Boolean(
      currentSurfaceInfo?.elevated
      || currentSurfaceInfo?.pathId
      || ['ramp', 'bridge', 'elevated'].includes(currentSurfaceInfo?.surfaceType)
    );
    this.roadSurfaces.forEach((surface) => {
      const surfaceHeight = surface.metadata.surfaceHeight ?? 0;
      if (!allowHighSurface && surfaceHeight > currentHeight + 4.5) return;
      const dx = surface.center.x - position.x;
      const dz = surface.center.y - position.z;
      const distance = Math.hypot(dx, dz);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = surface;
      }
    });
    if (!best) return null;
    const surfaceId = best.metadata.pathId ?? best.metadata.routeId ?? best.id;
    return {
      id: surfaceId,
      colliderId: best.id,
      position: new THREE.Vector3(best.center.x, best.metadata.surfaceHeight ?? 0, best.center.y),
      heading: best.size.x >= best.size.y ? (best.rotation ?? 0) + Math.PI * 0.5 : (best.rotation ?? 0),
      surfaceHeight: best.metadata.surfaceHeight ?? 0
    };
  }

  updateDebug(enabled, playerController, surfaceInfo) {
    this.debugGroup.visible = enabled;
    if (!enabled) return;
    this.debugTimer -= 0.016;
    if (this.debugTimer > 0) return;
    this.debugTimer = 0.2;
    this.clearDebug();

    const player = playerController?.getCollider();
    const nearby = player ? this.queryNearby(player.center, 90) : [];
    const nearbyRoads = player
      ? this.roadSurfaces.filter((surface) => surface.center.distanceTo(player.center) < 95)
      : [];
    const nearbyClearance = player
      ? this.colliders.filter((collider) => collider.type === COLLISION_TYPES.NO_BUILD_ZONE && collider.center.distanceTo(player.center) < 130)
      : [];
    nearby.forEach((collider) => this.addDebugBox(collider));
    nearbyRoads.forEach((surface) => this.addDebugBox(surface));
    nearbyClearance.forEach((collider) => this.addDebugBox(collider));
    if (player) this.addDebugBox({ ...player, id: 'player', type: COLLISION_TYPES.SOLID_DYNAMIC });

    this.lastDebugStats = {
      staticCount: this.colliders.filter((item) => this.isBlockingType(item.type)).length,
      roadSurfaceCount: this.roadSurfaces.length,
      nearbyCount: nearby.length,
      clearanceCount: nearbyClearance.length,
      currentSurface: surfaceInfo?.surfaceId ?? 'ground',
      surfaceType: surfaceInfo?.surfaceType ?? 'terrain',
      surfaceHeight: surfaceInfo?.surfaceHeight ?? 0
    };
  }

  getDebugStats() {
    return this.lastDebugStats;
  }

  clearDebug() {
    while (this.debugGroup.children.length) {
      const child = this.debugGroup.children[0];
      this.debugGroup.remove(child);
      child.geometry?.dispose?.();
      child.material?.dispose?.();
    }
  }

  addDebugBox(collider) {
    const yMin = collider.yMin ?? 0;
    const yMax = collider.yMax ?? 0.12;
    const height = Math.max(0.12, yMax - yMin);
    const geometry = new THREE.BoxGeometry(collider.size.x, height, collider.size.y);
    const material = new THREE.MeshBasicMaterial({
      color: DEBUG_COLORS[collider.type] ?? 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: collider.type === COLLISION_TYPES.ROAD_SURFACE ? 0.34 : 0.62
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(collider.center.x, yMin + height * 0.5, collider.center.y);
    mesh.rotation.y = collider.rotation ?? 0;
    this.debugGroup.add(mesh);
  }

  queryNearby(center, radius) {
    const result = new Set();
    const minX = Math.floor((center.x - radius) / this.cellSize);
    const maxX = Math.floor((center.x + radius) / this.cellSize);
    const minZ = Math.floor((center.y - radius) / this.cellSize);
    const maxZ = Math.floor((center.y + radius) / this.cellSize);
    for (let x = minX; x <= maxX; x += 1) {
      for (let z = minZ; z <= maxZ; z += 1) {
        const bucket = this.grid.get(`${x}:${z}`);
        if (!bucket) continue;
        bucket.forEach((collider) => result.add(collider));
      }
    }
    return result;
  }

  insertIntoGrid(collider) {
    const aabb = collider.aabb;
    const minX = Math.floor(aabb.minX / this.cellSize);
    const maxX = Math.floor(aabb.maxX / this.cellSize);
    const minZ = Math.floor(aabb.minZ / this.cellSize);
    const maxZ = Math.floor(aabb.maxZ / this.cellSize);
    for (let x = minX; x <= maxX; x += 1) {
      for (let z = minZ; z <= maxZ; z += 1) {
        const key = `${x}:${z}`;
        if (!this.grid.has(key)) this.grid.set(key, []);
        this.grid.get(key).push(collider);
      }
    }
  }

  computeAabb(collider) {
    const axes = this.getAxes(collider.rotation ?? 0);
    const halfX = collider.size.x * 0.5;
    const halfZ = collider.size.y * 0.5;
    const corners = [
      axes.x.clone().multiplyScalar(halfX).add(axes.z.clone().multiplyScalar(halfZ)),
      axes.x.clone().multiplyScalar(halfX).add(axes.z.clone().multiplyScalar(-halfZ)),
      axes.x.clone().multiplyScalar(-halfX).add(axes.z.clone().multiplyScalar(halfZ)),
      axes.x.clone().multiplyScalar(-halfX).add(axes.z.clone().multiplyScalar(-halfZ))
    ].map((corner) => corner.add(collider.center));
    return {
      minX: Math.min(...corners.map((corner) => corner.x)),
      maxX: Math.max(...corners.map((corner) => corner.x)),
      minZ: Math.min(...corners.map((corner) => corner.y)),
      maxZ: Math.max(...corners.map((corner) => corner.y))
    };
  }

  testObbOverlap(a, b) {
    const axesA = this.getAxes(a.rotation ?? 0);
    const axesB = this.getAxes(b.rotation ?? 0);
    const axes = [axesA.x, axesA.z, axesB.x, axesB.z];
    let minOverlap = Infinity;
    let bestAxis = null;

    for (const axis of axes) {
      const projectionA = this.projectObb(a, axis);
      const projectionB = this.projectObb(b, axis);
      const overlap = Math.min(projectionA.max, projectionB.max) - Math.max(projectionA.min, projectionB.min);
      if (overlap <= 0) return null;
      if (overlap < minOverlap) {
        minOverlap = overlap;
        bestAxis = axis.clone();
      }
    }

    const delta = a.center.clone().sub(b.center);
    if (delta.dot(bestAxis) < 0) bestAxis.multiplyScalar(-1);
    return {
      normal: new THREE.Vector3(bestAxis.x, 0, bestAxis.y),
      depth: minOverlap
    };
  }

  projectObb(box, axis) {
    const axes = this.getAxes(box.rotation ?? 0);
    const center = box.center.dot(axis);
    const radius = Math.abs(axes.x.dot(axis)) * box.size.x * 0.5
      + Math.abs(axes.z.dot(axis)) * box.size.y * 0.5;
    return {
      min: center - radius,
      max: center + radius
    };
  }

  getAxes(rotation) {
    return {
      x: new THREE.Vector2(Math.cos(rotation), Math.sin(rotation)),
      z: new THREE.Vector2(-Math.sin(rotation), Math.cos(rotation))
    };
  }

  verticalOverlap(a, b) {
    return (a.yMin ?? 0) <= (b.yMax ?? 0) && (a.yMax ?? 2) >= (b.yMin ?? 0);
  }

  isBlockingType(type) {
    return type === COLLISION_TYPES.HARD_SOLID
      || type === COLLISION_TYPES.SLIDE_SOLID
      || type === COLLISION_TYPES.LOW_SURPASSABLE
      || type === COLLISION_TYPES.SOFT_PASSABLE;
  }
}
