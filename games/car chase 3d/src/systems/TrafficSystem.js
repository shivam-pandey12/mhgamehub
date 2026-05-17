import * as THREE from 'three';
import { PERFORMANCE_LIMITS, TRAFFIC } from '../config.js';
import { clamp, rand, vectorToAngle, shortestAngleDelta } from '../utils/math.js';

export class TrafficSystem {
  constructor({ scene, city, settings, effects, audio }) {
    this.scene = scene;
    this.city = city;
    this.settings = settings;
    this.effects = effects;
    this.audio = audio;
    this.group = new THREE.Group();
    this.group.name = 'DayTraffic';
    this.scene.add(this.group);
    this.cars = [];
    this.parked = [];
    this.materials = [
      new THREE.MeshStandardMaterial({ color: 0xf2f0e7, roughness: 0.38, metalness: 0.22 }),
      new THREE.MeshStandardMaterial({ color: 0x4e79a7, roughness: 0.42, metalness: 0.18 }),
      new THREE.MeshStandardMaterial({ color: 0xd9a441, roughness: 0.44, metalness: 0.12 }),
      new THREE.MeshStandardMaterial({ color: 0x7a8c52, roughness: 0.46, metalness: 0.12 }),
    ];
    this.dark = new THREE.MeshStandardMaterial({ color: 0x1d242b, roughness: 0.42, metalness: 0.28 });
    this.phase4 = { trafficBonus: 0, chaos: 0 };
    this.onHit = null;
  }

  reset(player) {
    this.clear();
    const density = TRAFFIC[this.settings.trafficDensity] || TRAFFIC.low;
    const cap = PERFORMANCE_LIMITS.traffic[this.settings.trafficDensity] || PERFORMANCE_LIMITS.traffic.low;
    const moving = Math.min(cap, density.moving + (this.phase4.trafficBonus || 0));
    const parked = Math.min(cap + 8, density.parked + Math.ceil((this.phase4.trafficBonus || 0) * 1.5));
    for (let i = 0; i < moving; i += 1) this.spawnMoving(player, i);
    for (let i = 0; i < parked; i += 1) this.spawnParked(i);
  }

  setPhase4State(state = {}) {
    this.phase4 = { ...this.phase4, ...state };
  }

  clear() {
    for (const item of [...this.cars, ...this.parked]) {
      this.group.remove(item.group);
      item.group.traverse((child) => {
        child.geometry?.dispose?.();
      });
    }
    this.cars.length = 0;
    this.parked.length = 0;
  }

  spawnMoving(player, index) {
    const waypoint = this.chooseWaypointFarFrom(player);
    const next = waypoint.neighbors[index % Math.max(1, waypoint.neighbors.length)] || waypoint;
    const car = {
      group: this.createTrafficVehicle(index % 6 === 0 ? 'bus' : index % 4 === 0 ? 'van' : index % 3 === 0 ? 'taxi' : 'car'),
      waypoint,
      next,
      speed: rand(8, 15),
      desiredSpeed: rand(10, 17),
      radius: index % 5 === 0 ? 4.6 : 2.8,
      cooldown: 0,
      yaw: 0,
    };
    car.group.position.copy(waypoint.position).add(new THREE.Vector3(rand(-2, 2), 0, rand(-2, 2)));
    car.yaw = vectorToAngle(next.position.clone().sub(waypoint.position));
    car.group.rotation.y = car.yaw;
    this.group.add(car.group);
    this.cars.push(car);
  }

  spawnParked(index) {
    const sites = this.city.parkingSites || [];
    const site = sites[index % Math.max(1, sites.length)];
    if (!site) return;
    const item = {
      group: this.createTrafficVehicle(index % 5 === 0 ? 'taxi' : index % 3 === 0 ? 'van' : 'car'),
      radius: 2.8,
      cooldown: 0,
    };
    item.group.position.copy(site.position);
    item.group.rotation.y = site.yaw;
    this.group.add(item.group);
    this.parked.push(item);
  }

  createTrafficVehicle(type) {
    const group = new THREE.Group();
    const length = type === 'bus' ? 9 : type === 'van' ? 6.3 : 5.3;
    const width = type === 'bus' ? 3.1 : 2.6;
    const height = type === 'bus' ? 2.3 : type === 'van' ? 1.9 : 1.35;
    const material = type === 'taxi'
      ? new THREE.MeshStandardMaterial({ color: 0xf2c23f, roughness: 0.42, metalness: 0.12 })
      : this.materials[Math.floor(rand(0, this.materials.length))];
    const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, length), material);
    body.position.y = 0.75 + height * 0.25;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(width * 0.78, 0.46, length * 0.38), this.dark);
    cabin.position.set(0, height + 0.65, length * 0.06);
    cabin.castShadow = true;
    group.add(cabin);
    const wheelGeometry = new THREE.CylinderGeometry(0.42, 0.42, 0.34, 14);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x090909, roughness: 0.7 });
    for (const x of [-width * 0.56, width * 0.56]) {
      for (const z of [-length * 0.32, length * 0.32]) {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(x, 0.48, z);
        group.add(wheel);
      }
    }
    return group;
  }

  chooseWaypointFarFrom(player) {
    const ordered = [...this.city.waypoints].sort((a, b) => {
      if (!player) return Math.random() - 0.5;
      return b.position.distanceToSquared(player.group.position) - a.position.distanceToSquared(player.group.position);
    });
    return ordered[Math.floor(rand(0, Math.min(12, ordered.length)))] || this.city.waypoints[0];
  }

  update(dt, combatVehicles) {
    for (const car of this.cars) {
      this.updateMovingCar(car, dt, combatVehicles);
    }
    for (const parked of this.parked) {
      this.resolveCombatCollision(parked, combatVehicles, dt, true);
    }
  }

  updateMovingCar(car, dt, combatVehicles) {
    const panic = combatVehicles.some((vehicle) => (
      !vehicle.destroyed && vehicle.group.position.distanceTo(car.group.position) < 26 + (this.phase4.chaos || 0) * 18
    ));
    const targetSpeed = panic ? car.desiredSpeed * (this.phase4.chaos > 0.7 ? 0.08 : 0.28) : car.desiredSpeed;
    car.speed += (targetSpeed - car.speed) * clamp(dt * 1.8, 0, 1);
    const delta = car.next.position.clone().sub(car.group.position);
    delta.y = 0;
    if (delta.length() < 6) {
      car.waypoint = car.next;
      const options = car.waypoint.neighbors.length ? car.waypoint.neighbors : [car.waypoint];
      car.next = options[Math.floor(rand(0, options.length))];
    }
    const desiredYaw = vectorToAngle(car.next.position.clone().sub(car.group.position));
    car.yaw += shortestAngleDelta(car.yaw, desiredYaw) * clamp(dt * 2.4, 0, 1);
    car.group.rotation.y = car.yaw;
    car.group.position.add(new THREE.Vector3(Math.sin(car.yaw), 0, Math.cos(car.yaw)).multiplyScalar(car.speed * dt));
    this.resolveCombatCollision(car, combatVehicles, dt, false);
  }

  resolveCombatCollision(item, combatVehicles, dt, parked) {
    item.cooldown = Math.max(0, item.cooldown - dt);
    for (const vehicle of combatVehicles) {
      if (vehicle.destroyed) continue;
      const delta = vehicle.group.position.clone().sub(item.group.position);
      delta.y = 0;
      const distance = Math.max(0.001, delta.length());
      const min = vehicle.stats.radius + item.radius;
      if (distance > min) continue;
      const normal = delta.multiplyScalar(1 / distance);
      vehicle.group.position.addScaledVector(normal, min - distance);
      vehicle.velocity.multiplyScalar(parked ? 0.42 : 0.62);
      vehicle.applyImpulse(normal, parked ? 6 : 3.5);
      if (item.cooldown <= 0) {
        item.cooldown = 0.5;
        this.effects.spark(vehicle.group.position, 8, 0xffc37a);
        this.audio.playCollision();
        this.onHit?.({ vehicle, parked });
      }
    }
  }
}
