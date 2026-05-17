import * as THREE from 'three';

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function damp(a, b, lambda, dt) {
  return lerp(a, b, 1 - Math.exp(-lambda * dt));
}

export function wrapAngle(angle) {
  let next = angle;
  while (next > Math.PI) next -= Math.PI * 2;
  while (next < -Math.PI) next += Math.PI * 2;
  return next;
}

export function shortestAngleDelta(from, to) {
  return wrapAngle(to - from);
}

export function angleToVector(angle) {
  return new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle));
}

export function vectorToAngle(vector) {
  return Math.atan2(vector.x, vector.z);
}

export function flatDistance(a, b) {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dz * dz);
}

export function rand(min, max) {
  return min + Math.random() * (max - min);
}

export function choose(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function formatTime(seconds) {
  const safe = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(safe / 60).toString().padStart(2, '0');
  const rest = (safe % 60).toString().padStart(2, '0');
  return `${minutes}:${rest}`;
}
