import * as THREE from 'three';
import { pointInRotatedRect } from './levels.js';

const scratchA = new THREE.Vector2();
const scratchB = new THREE.Vector2();
const scratchC = new THREE.Vector2();
const scratchD = new THREE.Vector2();

export const BALL_RADIUS = 0.23;

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function closestPointOnSegment(point, a, b, target = new THREE.Vector2()) {
  scratchA.copy(b).sub(a);
  const lengthSq = scratchA.lengthSq();
  if (lengthSq === 0) return target.copy(a);
  const t = clamp(scratchB.copy(point).sub(a).dot(scratchA) / lengthSq, 0, 1);
  return target.copy(a).addScaledVector(scratchA, t);
}

function closestPointOnRotatedBox(point, box, target = new THREE.Vector2()) {
  const rotation = box.rotation ?? 0;
  const cos = Math.cos(-rotation);
  const sin = Math.sin(-rotation);
  const dx = point.x - box.x;
  const dz = point.y - box.z;
  const localX = dx * cos - dz * sin;
  const localZ = dx * sin + dz * cos;
  const clampedX = clamp(localX, -box.w / 2, box.w / 2);
  const clampedZ = clamp(localZ, -box.d / 2, box.d / 2);
  const worldCos = Math.cos(rotation);
  const worldSin = Math.sin(rotation);
  target.set(
    box.x + clampedX * worldCos - clampedZ * worldSin,
    box.z + clampedX * worldSin + clampedZ * worldCos
  );
  return target;
}

function boxNormalFromPoint(point, box, target = new THREE.Vector2()) {
  const rotation = box.rotation ?? 0;
  const cos = Math.cos(-rotation);
  const sin = Math.sin(-rotation);
  const dx = point.x - box.x;
  const dz = point.y - box.z;
  const localX = dx * cos - dz * sin;
  const localZ = dx * sin + dz * cos;
  const px = box.w / 2 - Math.abs(localX);
  const pz = box.d / 2 - Math.abs(localZ);
  const localNormal = px < pz ? scratchD.set(Math.sign(localX) || 1, 0) : scratchD.set(0, Math.sign(localZ) || 1);
  const worldCos = Math.cos(rotation);
  const worldSin = Math.sin(rotation);
  target.set(
    localNormal.x * worldCos - localNormal.y * worldSin,
    localNormal.x * worldSin + localNormal.y * worldCos
  );
  return target.normalize();
}

function normalizeWall(wall) {
  if (Array.isArray(wall)) {
    const [x1, z1, x2, z2] = wall;
    return { type: 'line', a: new THREE.Vector2(x1, z1), b: new THREE.Vector2(x2, z2), source: wall };
  }
  if (wall.type === 'box') return { ...wall };
  return { type: 'line', a: new THREE.Vector2(wall.x1, wall.z1), b: new THREE.Vector2(wall.x2, wall.z2), source: wall };
}

export class MiniGolfPhysics {
  constructor({ radius = BALL_RADIUS, onBounce = () => {} } = {}) {
    this.radius = radius;
    this.onBounce = onBounce;
    this.position = new THREE.Vector2();
    this.velocity = new THREE.Vector2();
    this.walls = [];
    this.staticObstacles = [];
    this.dynamicColliders = [];
    this.friction = 1.62;
    this.restitution = 0.68;
    this.sleepSpeed = 0.12;
    this.maxSpeed = 10.2;
    this.maxStep = 1 / 240;
    this.lastCollisionKind = 'wall';
  }

  setLevel(level) {
    this.walls = (level.walls ?? []).map(normalizeWall);
    this.staticObstacles = (level.obstacles ?? []).map((obstacle) => ({ ...obstacle, kind: obstacle.kind ?? 'obstacle' }));
    this.dynamicColliders = [];
  }

  setDynamicColliders(colliders = []) {
    this.dynamicColliders = colliders;
  }

  reset(start) {
    this.position.set(start.x, start.z);
    this.velocity.set(0, 0);
  }

  shoot(direction, power) {
    const strength = THREE.MathUtils.lerp(2.05, this.maxSpeed, clamp(power, 0, 1));
    this.velocity.copy(direction).multiplyScalar(strength);
  }

  update(delta, env = {}) {
    if (this.velocity.lengthSq() === 0) return false;

    if (env.heightAt) this.applySlope(delta, env.heightAt);
    this.clampVelocity();

    const speedBefore = this.velocity.length();
    const steps = Math.max(1, Math.ceil(delta / this.maxStep));
    const step = delta / steps;
    let bounced = false;

    for (let i = 0; i < steps; i += 1) {
      this.position.addScaledVector(this.velocity, step);
      for (let pass = 0; pass < 3; pass += 1) {
        const hit = this.resolveCollisions();
        bounced = hit || bounced;
        if (!hit) break;
      }
      this.clampVelocity();
    }

    const damping = env.frictionMultiplier ?? 1;
    this.velocity.multiplyScalar(Math.exp(-this.friction * damping * delta));

    if (this.velocity.length() < this.sleepSpeed) {
      this.velocity.set(0, 0);
    }

    return bounced || speedBefore !== 0;
  }

  applySlope(delta, heightAt) {
    const sample = 0.34;
    const center = heightAt(this.position.x, this.position.y);
    const hx = heightAt(this.position.x + sample, this.position.y) - heightAt(this.position.x - sample, this.position.y);
    const hz = heightAt(this.position.x, this.position.y + sample) - heightAt(this.position.x, this.position.y - sample);
    if (Math.abs(hx) + Math.abs(hz) < 0.001) return;

    scratchA.set(-hx, -hz).multiplyScalar(1.65 / (sample * 2));
    if (center > 0.01 || this.velocity.lengthSq() > 0.01) {
      this.velocity.addScaledVector(scratchA, delta);
    }
  }

  clampVelocity() {
    const speed = this.velocity.length();
    if (speed > this.maxSpeed) this.velocity.multiplyScalar(this.maxSpeed / speed);
  }

  addImpulse(direction, strength) {
    this.velocity.addScaledVector(direction, clamp(strength, -2.8, 3.4));
    this.clampVelocity();
  }

  updatePositionBy(delta) {
    this.position.add(delta);
  }

  resolveCollisions() {
    let bounced = false;

    for (const wall of this.walls) {
      if (wall.type === 'box') {
        bounced = this.resolveBox(wall, 0) || bounced;
      } else {
        bounced = this.resolveLine(wall, 0) || bounced;
      }
    }

    for (const obstacle of this.staticObstacles) {
      if (obstacle.type === 'circle') {
        bounced = this.resolveCircle(obstacle, 0) || bounced;
      }
      if (obstacle.type === 'box') {
        bounced = this.resolveBox(obstacle, 0) || bounced;
      }
    }

    for (const collider of this.dynamicColliders) {
      if (collider.type === 'circle') {
        bounced = this.resolveCircle(collider, collider.velocityBoost ?? 0, collider.velocity) || bounced;
      }
      if (collider.type === 'box') {
        bounced = this.resolveBox(collider, collider.velocityBoost ?? 0, collider.velocity) || bounced;
      }
    }

    return bounced;
  }

  resolveLine(wall, boost = 0, colliderVelocity = null) {
    const closest = closestPointOnSegment(this.position, wall.a, wall.b, scratchC);
    scratchA.copy(this.position).sub(closest);
    let distance = scratchA.length();

    if (distance >= this.radius) return false;

    if (distance < 0.0001) {
      scratchA.set(-(wall.b.y - wall.a.y), wall.b.x - wall.a.x).normalize();
      distance = 0.0001;
    } else {
      scratchA.multiplyScalar(1 / distance);
    }

    this.position.addScaledVector(scratchA, this.radius - distance + 0.002);
    return this.reflectVelocity(scratchA, closest, boost, colliderVelocity, wall.kind ?? 'wall');
  }

  resolveCircle(obstacle, boost = 0, colliderVelocity = null) {
    scratchA.set(this.position.x - obstacle.x, this.position.y - obstacle.z);
    let distance = scratchA.length();
    const minDistance = this.radius + obstacle.r;

    if (distance >= minDistance) return false;

    if (distance < 0.0001) {
      scratchA.set(1, 0);
      distance = 0.0001;
    } else {
      scratchA.multiplyScalar(1 / distance);
    }

    this.position.addScaledVector(scratchA, minDistance - distance + 0.002);
    return this.reflectVelocity(scratchA, scratchB.set(obstacle.x, obstacle.z), boost, colliderVelocity, obstacle.kind ?? 'obstacle');
  }

  resolveBox(box, boost = 0, colliderVelocity = null) {
    const inside = pointInRotatedRect(this.position.x, this.position.y, box, this.radius);
    if (!inside) return false;

    const closest = closestPointOnRotatedBox(this.position, box, scratchC);
    scratchA.copy(this.position).sub(closest);
    let distance = scratchA.length();

    if (distance < 0.0001 || pointInRotatedRect(this.position.x, this.position.y, box, -0.001)) {
      scratchA.copy(boxNormalFromPoint(this.position, box, scratchD));
      const overlap = this.radius + 0.016;
      this.position.addScaledVector(scratchA, overlap);
    } else {
      scratchA.multiplyScalar(1 / distance);
      this.position.addScaledVector(scratchA, this.radius - distance + 0.002);
    }

    return this.reflectVelocity(scratchA, closest, boost, colliderVelocity, box.kind ?? 'obstacle');
  }

  reflectVelocity(normal, point, boost = 0, colliderVelocity = null, kind = 'wall') {
    scratchB.copy(this.velocity);
    if (colliderVelocity) scratchB.sub(colliderVelocity);

    const towardSurface = scratchB.dot(normal);
    if (towardSurface >= 0) {
      if (colliderVelocity) this.velocity.addScaledVector(colliderVelocity, 0.12);
      return false;
    }

    const resolvedBoost = clamp(boost, 0, 0.22);
    scratchB.addScaledVector(normal, -(1 + this.restitution + resolvedBoost) * towardSurface);
    if (colliderVelocity) scratchB.addScaledVector(colliderVelocity, 0.9);
    this.velocity.copy(scratchB).multiplyScalar(0.985);
    this.clampVelocity();
    this.lastCollisionKind = kind;
    this.onBounce({ x: point.x, z: point.y }, Math.min(1, Math.abs(towardSurface) / this.maxSpeed), kind);
    return true;
  }

  wouldEnterHole(hole, delta) {
    const distance = this.position.distanceTo(scratchA.set(hole.x, hole.z));
    const speed = this.velocity.length();
    const softCatch = distance < 0.47 && speed < 2.75;
    const cleanCenter = distance < 0.24 && speed < 5.85;
    const futureCenter = scratchB.copy(this.position).addScaledVector(this.velocity, delta * 0.3);
    const aligned = futureCenter.distanceTo(scratchA.set(hole.x, hole.z)) < 0.3 && speed < 5.05;
    return softCatch || cleanCenter || aligned;
  }

  simulatePath(direction, power, level, pointCount = 46, dynamicColliders = []) {
    const clone = new MiniGolfPhysics({ radius: this.radius });
    clone.friction = this.friction;
    clone.restitution = this.restitution;
    clone.maxSpeed = this.maxSpeed;
    clone.setLevel(level);
    clone.setDynamicColliders(dynamicColliders);
    clone.position.copy(this.position);
    clone.shoot(direction, power);

    const points = [];
    for (let i = 0; i < pointCount; i += 1) {
      clone.update(1 / 22);
      points.push({ x: clone.position.x, z: clone.position.y });
      if (clone.velocity.lengthSq() === 0) break;
    }
    return points;
  }
}
