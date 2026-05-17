import * as THREE from '../../vendor/three.js';
import { CAR_CONFIGS } from '../../config/cars.js';
import { TRAFFIC_LOOPS } from '../../config/city.js';
import { COLLISION_TYPES } from '../collision/CollisionSystem.js';
import { dampAngle, vec2Distance } from '../utils/math.js';

export class TrafficSystem {
  constructor(scene, vehicleFactory, saveManager, cityBuilder = null) {
    this.scene = scene;
    this.vehicleFactory = vehicleFactory;
    this.saveManager = saveManager;
    this.cityBuilder = cityBuilder;
    this.vehicles = [];
    this.group = new THREE.Group();
    this.group.name = 'Traffic';
    this.scene.add(this.group);
  }

  build() {
    this.clear();
    if (this.saveManager.settings.trafficDensity === 'off') return;
    const targetCount = this.saveManager.settings.trafficDensity === 'high'
      ? 26
      : this.saveManager.settings.trafficDensity === 'medium'
        ? 18
        : 11;
    const trafficTypes = ['compact', 'sedan', 'van', 'taxi', 'small-bus', 'delivery-truck'];
    for (let i = 0; i < targetCount; i += 1) {
      const loop = TRAFFIC_LOOPS[i % TRAFFIC_LOOPS.length];
      const config = CAR_CONFIGS[(i + 1) % CAR_CONFIGS.length];
      const mesh = this.vehicleFactory.createCarMesh(config);
      const type = trafficTypes[i % trafficTypes.length];
      const typeScale = type === 'small-bus'
        ? 1.28
        : type === 'delivery-truck'
          ? 1.18
          : type === 'van'
            ? 1.08
            : type === 'taxi'
              ? 0.86
              : 0.78;
      mesh.scale.setScalar(i % 5 === 0 ? typeScale * 1.06 : typeScale);
      const pointIndex = this.findSafePointIndex(loop, i % loop.points.length);
      const point = loop.points[pointIndex];
      mesh.position.set(point[0], this.getSurfaceHeight(point[0], point[1]), point[1]);
      this.group.add(mesh);
      this.vehicles.push({
        mesh,
        loop,
        pointIndex,
        speed: loop.speed * (0.8 + (i % 4) * 0.08),
        type,
        heading: 0,
        cooldown: 0,
        stuckTimer: 0,
        offset: (i % 2 ? -1 : 1) * (loop.zone === 'highway' ? 2.8 : 1.9)
      });
    }
  }

  clear() {
    this.vehicles.forEach((traffic) => this.group.remove(traffic.mesh));
    this.vehicles = [];
  }

  update(dt, playerController) {
    this.vehicles.forEach((traffic) => {
      traffic.cooldown = Math.max(0, traffic.cooldown - dt);
      const current = traffic.mesh.position;
      const targetPoint = traffic.loop.points[(traffic.pointIndex + 1) % traffic.loop.points.length];
      const target = new THREE.Vector3(targetPoint[0], 0, targetPoint[1]);
      const direction = target.clone().sub(current);
      direction.y = 0;
      const distance = direction.length();
      if (distance < 2.4) {
        traffic.pointIndex = (traffic.pointIndex + 1) % traffic.loop.points.length;
        return;
      }
      direction.normalize();
      const heading = Math.atan2(direction.x, direction.z);
      traffic.heading = dampAngle(traffic.heading, heading, 5.5, dt);
      const side = new THREE.Vector3(Math.cos(traffic.heading), 0, -Math.sin(traffic.heading));
      let speed = traffic.speed * this.getDistrictSpeedFactor(traffic.loop.zone, traffic.type);
      const playerDistance = vec2Distance(
        [playerController.position.x, playerController.position.z],
        [traffic.mesh.position.x, traffic.mesh.position.z]
      );
      const heightGap = Math.abs(playerController.mesh.position.y - traffic.mesh.position.y);
      if (playerDistance < 15 && heightGap < 3.2) speed *= 0.2;
      speed *= this.getTrafficSpacingFactor(traffic);
      traffic.mesh.position.addScaledVector(direction, speed * dt);
      traffic.mesh.position.addScaledVector(side, traffic.offset * dt * 0.08);
      traffic.mesh.position.y = this.getSurfaceHeight(traffic.mesh.position.x, traffic.mesh.position.z);
      traffic.mesh.rotation.y = traffic.heading;
      traffic.mesh.userData.wheels?.forEach((wheel) => {
        wheel.tire.rotation.x += traffic.speed * dt * 2.1;
      });

      traffic.stuckTimer = (playerDistance < 4 && heightGap < 3.2) || speed < 0.6 ? traffic.stuckTimer + dt : Math.max(0, traffic.stuckTimer - dt);
      if (traffic.stuckTimer > 2.5) {
        this.recycleTraffic(traffic, playerController.position);
        traffic.stuckTimer = 0;
      }
    });
  }

  getDistrictSpeedFactor(zone, type) {
    const zoneFactor = zone === 'highway'
      ? 1.22
      : zone === 'market'
        ? 0.68
        : zone === 'residential'
          ? 0.78
          : zone === 'airport'
            ? 0.72
            : zone === 'industrial'
              ? 0.64
              : 1;
    const typeFactor = type === 'small-bus' || type === 'delivery-truck' ? 0.72 : type === 'taxi' ? 1.02 : 1;
    return zoneFactor * typeFactor;
  }

  getTrafficSpacingFactor(traffic) {
    let factor = 1;
    this.vehicles.forEach((other) => {
      if (other === traffic || other.loop !== traffic.loop) return;
      const distance = vec2Distance(
        [traffic.mesh.position.x, traffic.mesh.position.z],
        [other.mesh.position.x, other.mesh.position.z]
      );
      if (distance > 0.1 && distance < 10) factor = Math.min(factor, 0.42);
    });
    return factor;
  }

  recycleTraffic(traffic, playerPosition) {
    let attempts = 0;
    while (attempts < traffic.loop.points.length) {
      traffic.pointIndex = (traffic.pointIndex + 1) % traffic.loop.points.length;
      const point = traffic.loop.points[traffic.pointIndex];
      const distance = vec2Distance([playerPosition.x, playerPosition.z], point);
      if (distance > 28) {
        if (!this.isSpawnPointClear(point[0], point[1])) {
          attempts += 1;
          continue;
        }
        traffic.mesh.position.set(point[0], 0, point[1]);
        traffic.mesh.position.y = this.getSurfaceHeight(point[0], point[1]);
        return;
      }
      attempts += 1;
    }
  }

  getSurfaceHeight(x, z) {
    if (!this.cityBuilder) return 0;
    return this.cityBuilder.getSurfaceInfo(new THREE.Vector3(x, 0, z), null, { preferElevated: true }).surfaceHeight ?? 0;
  }

  findSafePointIndex(loop, startIndex = 0) {
    for (let attempt = 0; attempt < loop.points.length; attempt += 1) {
      const index = (startIndex + attempt) % loop.points.length;
      const point = loop.points[index];
      if (this.isSpawnPointClear(point[0], point[1])) return index;
    }
    return startIndex;
  }

  isSpawnPointClear(x, z) {
    if (!this.cityBuilder?.collisionSystem) return true;
    const nearby = this.cityBuilder.collisionSystem.queryNearby(new THREE.Vector2(x, z), 9);
    for (const collider of nearby) {
      if ([COLLISION_TYPES.HARD_SOLID, COLLISION_TYPES.SLIDE_SOLID].includes(collider.type)) {
        const dx = collider.center.x - x;
        const dz = collider.center.y - z;
        if (Math.hypot(dx, dz) < Math.max(collider.size.x, collider.size.y) * 0.55 + 4) return false;
      }
    }
    return true;
  }
}
