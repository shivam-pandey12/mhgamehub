import type { Vec2, Vec3 } from './types';

export const TAU = Math.PI * 2;

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

export function damp(from: number, to: number, lambda: number, dt: number): number {
  return lerp(from, to, 1 - Math.exp(-lambda * dt));
}

export function approach(current: number, target: number, delta: number): number {
  if (current < target) {
    return Math.min(current + delta, target);
  }
  return Math.max(current - delta, target);
}

export function smoothStep(edge0: number, edge1: number, value: number): number {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function length2(x: number, z: number): number {
  return Math.hypot(x, z);
}

export function distanceXZ(a: Vec3, b: Vec3): number {
  return Math.hypot(a.x - b.x, a.z - b.z);
}

export function normalize2(x: number, y: number): Vec2 {
  const length = Math.hypot(x, y);
  if (length <= 0.0001) {
    return { x: 0, y: 0 };
  }
  return { x: x / length, y: y / length };
}

export function normalizeXZ(vector: Vec3): Vec3 {
  const length = Math.hypot(vector.x, vector.z);
  if (length <= 0.0001) {
    return { x: 0, y: 0, z: 0 };
  }
  return {
    x: vector.x / length,
    y: 0,
    z: vector.z / length,
  };
}

export function vector3(x = 0, y = 0, z = 0): Vec3 {
  return { x, y, z };
}

export function addScaled(target: Vec3, direction: Vec3, scalar: number): void {
  target.x += direction.x * scalar;
  target.y += direction.y * scalar;
  target.z += direction.z * scalar;
}

export function copyVec3(source: Vec3): Vec3 {
  return { x: source.x, y: source.y, z: source.z };
}

export function dirFromYaw(yaw: number): Vec3 {
  return {
    x: Math.sin(yaw),
    y: 0,
    z: -Math.cos(yaw),
  };
}

export function rightFromYaw(yaw: number): Vec3 {
  return {
    x: Math.cos(yaw),
    y: 0,
    z: Math.sin(yaw),
  };
}

export function yawFromDir(x: number, z: number): number {
  return Math.atan2(x, -z);
}

export function wrapAngle(angle: number): number {
  let wrapped = angle;
  while (wrapped > Math.PI) {
    wrapped -= TAU;
  }
  while (wrapped < -Math.PI) {
    wrapped += TAU;
  }
  return wrapped;
}

export function dampAngle(from: number, to: number, lambda: number, dt: number): number {
  const delta = wrapAngle(to - from);
  return from + delta * (1 - Math.exp(-lambda * dt));
}

export function clampToArena(position: Vec3, radius: number): void {
  const distance = Math.hypot(position.x, position.z);
  if (distance <= radius) {
    return;
  }
  const scale = radius / distance;
  position.x *= scale;
  position.z *= scale;
}
