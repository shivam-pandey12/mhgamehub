import { PHYSICS_TUNING } from './physics-tuning.js';

const EPSILON = 0.000001;

export class CollisionResolver {
  constructor({ pocketDetector, onCollision }) {
    this.pocketDetector = pocketDetector;
    this.onCollision = onCollision;
  }

  resolveBodies(bodies) {
    for (let firstIndex = 0; firstIndex < bodies.length - 1; firstIndex += 1) {
      const first = bodies[firstIndex];
      if (first.isPocketed) {
        continue;
      }
      for (let secondIndex = firstIndex + 1; secondIndex < bodies.length; secondIndex += 1) {
        const second = bodies[secondIndex];
        if (second.isPocketed) {
          continue;
        }
        this.resolvePair(first, second);
      }
    }
  }

  resolvePair(first, second) {
    const deltaX = second.position.x - first.position.x;
    const deltaZ = second.position.z - first.position.z;
    const minDistance = first.radius + second.radius;
    const distanceSq = deltaX * deltaX + deltaZ * deltaZ;

    if (distanceSq <= EPSILON || distanceSq >= minDistance * minDistance) {
      return false;
    }

    const distance = Math.sqrt(distanceSq);
    const normalX = deltaX / distance;
    const normalZ = deltaZ / distance;
    const overlap = minDistance - distance;
    const invMassSum = first.invMass + second.invMass;

    if (invMassSum > 0) {
      const correction = overlap / invMassSum;
      first.position.x -= normalX * correction * first.invMass;
      first.position.z -= normalZ * correction * first.invMass;
      second.position.x += normalX * correction * second.invMass;
      second.position.z += normalZ * correction * second.invMass;
    }

    const relativeVelocityX = second.velocity.x - first.velocity.x;
    const relativeVelocityZ = second.velocity.z - first.velocity.z;
    const velocityAlongNormal = relativeVelocityX * normalX + relativeVelocityZ * normalZ;

    first.wake();
    second.wake();

    if (velocityAlongNormal > 0) {
      return true;
    }

    const impactSpeed = Math.abs(velocityAlongNormal);
    const restitution = Math.min(first.restitution, second.restitution);
    const impulseMagnitude = -(1 + restitution) * velocityAlongNormal / invMassSum;
    const impulseX = impulseMagnitude * normalX;
    const impulseZ = impulseMagnitude * normalZ;

    first.velocity.x -= impulseX * first.invMass;
    first.velocity.z -= impulseZ * first.invMass;
    second.velocity.x += impulseX * second.invMass;
    second.velocity.z += impulseZ * second.invMass;

    if (impactSpeed >= PHYSICS_TUNING.COLLISION_EVENT_MIN_SPEED) {
      this.onCollision?.({
        bodyA: first,
        bodyB: second,
        position: {
          x: first.position.x + deltaX * 0.5,
          z: first.position.z + deltaZ * 0.5
        },
        relativeSpeed: impactSpeed,
        intensity: Math.min(impactSpeed / PHYSICS_TUNING.MAX_BODY_SPEED, 1)
      });
    }

    return true;
  }

  resolveRails(body) {
    if (body.isPocketed || this.pocketDetector.isNearPocket(body)) {
      return;
    }

    const bounds = PHYSICS_TUNING.BOARD_BOUNDS;
    const minX = bounds.minX + body.radius;
    const maxX = bounds.maxX - body.radius;
    const minZ = bounds.minZ + body.radius;
    const maxZ = bounds.maxZ - body.radius;
    const impactVelocity = {
      x: body.velocity.x,
      z: body.velocity.z
    };
    let impactSpeed = 0;
    let bounced = false;

    if (body.position.x < minX) {
      body.position.x = minX;
      body.velocity.x = Math.abs(body.velocity.x) * PHYSICS_TUNING.WALL_RESTITUTION;
      impactSpeed = Math.max(impactSpeed, Math.abs(impactVelocity.x));
      bounced = true;
    } else if (body.position.x > maxX) {
      body.position.x = maxX;
      body.velocity.x = -Math.abs(body.velocity.x) * PHYSICS_TUNING.WALL_RESTITUTION;
      impactSpeed = Math.max(impactSpeed, Math.abs(impactVelocity.x));
      bounced = true;
    }

    if (body.position.z < minZ) {
      body.position.z = minZ;
      body.velocity.z = Math.abs(body.velocity.z) * PHYSICS_TUNING.WALL_RESTITUTION;
      impactSpeed = Math.max(impactSpeed, Math.abs(impactVelocity.z));
      bounced = true;
    } else if (body.position.z > maxZ) {
      body.position.z = maxZ;
      body.velocity.z = -Math.abs(body.velocity.z) * PHYSICS_TUNING.WALL_RESTITUTION;
      impactSpeed = Math.max(impactSpeed, Math.abs(impactVelocity.z));
      bounced = true;
    }

    if (bounced) {
      body.wake();
      if (impactSpeed >= PHYSICS_TUNING.COLLISION_EVENT_MIN_SPEED) {
        this.onCollision?.({
          bodyA: body,
          bodyB: { id: 'rail', type: 'rail' },
          position: {
            x: body.position.x,
            z: body.position.z
          },
          relativeSpeed: impactSpeed,
          intensity: Math.min(impactSpeed / PHYSICS_TUNING.MAX_BODY_SPEED, 1)
        });
      }
    }
  }
}
