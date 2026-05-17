import * as THREE from 'three';

export class CollisionSystem {
  constructor({ damage, effects, audio, camera }) {
    this.damage = damage;
    this.effects = effects;
    this.audio = audio;
    this.camera = camera;
    this.temp = new THREE.Vector3();
  }

  update(vehicles, city, dt, elapsed) {
    this.resolveVehiclePairs(vehicles, elapsed);
    this.resolveBuildings(vehicles, city, elapsed);
    this.resolveBounds(vehicles);
  }

  resolveVehiclePairs(vehicles, elapsed) {
    for (let i = 0; i < vehicles.length; i += 1) {
      const a = vehicles[i];
      if (a.destroyed) continue;
      for (let j = i + 1; j < vehicles.length; j += 1) {
        const b = vehicles[j];
        if (b.destroyed) continue;
        const delta = b.group.position.clone().sub(a.group.position);
        delta.y = 0;
        const distance = Math.max(0.001, delta.length());
        const minDistance = a.stats.radius + b.stats.radius;
        if (distance >= minDistance) continue;

        const normal = delta.multiplyScalar(1 / distance);
        const overlap = minDistance - distance;
        const totalMass = a.stats.mass + b.stats.mass;
        a.group.position.addScaledVector(normal, -overlap * (b.stats.mass / totalMass));
        b.group.position.addScaledVector(normal, overlap * (a.stats.mass / totalMass));

        const relative = a.velocity.clone().sub(b.velocity);
        const impact = Math.abs(relative.dot(normal));
        a.applyImpulse(normal, -impact * 0.28 * b.stats.mass);
        b.applyImpulse(normal, impact * 0.28 * a.stats.mass);

        if (impact > 8 && elapsed - Math.max(a.lastCollisionDamageAt, b.lastCollisionDamageAt) > 0.35) {
          const hitPoint = a.group.position.clone().lerp(b.group.position, 0.5);
          const damage = (impact - 7) * 1.18;
          this.damage.apply(a, damage * b.stats.mass * (b.stats.ramPower || 1), b, hitPoint, { sparkCount: 10 });
          this.damage.apply(b, damage * a.stats.mass * (a.stats.ramPower || 1), a, hitPoint, { sparkCount: 10 });
          a.lastCollisionDamageAt = elapsed;
          b.lastCollisionDamageAt = elapsed;
          this.effects.spark(hitPoint, 14, 0xffba70);
          this.audio.playCollision();
          this.camera?.shake?.(Math.min(0.7, impact / 36));
        }
      }
    }
  }

  resolveBuildings(vehicles, city, elapsed) {
    for (const vehicle of vehicles) {
      if (vehicle.destroyed) continue;
      const pos = vehicle.group.position;
      for (const box of city.collisionBoxes) {
        const radius = vehicle.stats.radius * 0.75;
        if (
          pos.x < box.minX - radius ||
          pos.x > box.maxX + radius ||
          pos.z < box.minZ - radius ||
          pos.z > box.maxZ + radius
        ) {
          continue;
        }

        const left = Math.abs(pos.x - (box.minX - radius));
        const right = Math.abs((box.maxX + radius) - pos.x);
        const bottom = Math.abs(pos.z - (box.minZ - radius));
        const top = Math.abs((box.maxZ + radius) - pos.z);
        const min = Math.min(left, right, bottom, top);
        const hit = pos.clone();

        if (min === left) {
          pos.x = box.minX - radius;
          vehicle.velocity.x = Math.min(0, vehicle.velocity.x) * -0.2;
        } else if (min === right) {
          pos.x = box.maxX + radius;
          vehicle.velocity.x = Math.max(0, vehicle.velocity.x) * -0.2;
        } else if (min === bottom) {
          pos.z = box.minZ - radius;
          vehicle.velocity.z = Math.min(0, vehicle.velocity.z) * -0.2;
        } else {
          pos.z = box.maxZ + radius;
          vehicle.velocity.z = Math.max(0, vehicle.velocity.z) * -0.2;
        }

        const speed = vehicle.speed;
        if (speed > 16 && elapsed - vehicle.lastCollisionDamageAt > 0.65) {
          vehicle.lastCollisionDamageAt = elapsed;
          this.damage.apply(vehicle, (speed - 13) * 0.85, null, hit, { sparkCount: 12 });
          this.effects.spark(hit, 14, 0xffba70);
          this.audio.playCollision();
          this.camera?.shake?.(Math.min(0.55, speed / 58));
        }
      }
    }
  }

  resolveBounds(vehicles) {
    for (const vehicle of vehicles) {
      if (vehicle.destroyed) continue;
      const pos = vehicle.group.position;
      const clampedX = Math.max(-205, Math.min(205, pos.x));
      const clampedZ = Math.max(-154, Math.min(154, pos.z));
      if (clampedX !== pos.x || clampedZ !== pos.z) {
        pos.x = clampedX;
        pos.z = clampedZ;
        vehicle.velocity.multiplyScalar(0.2);
      }
    }
  }
}
