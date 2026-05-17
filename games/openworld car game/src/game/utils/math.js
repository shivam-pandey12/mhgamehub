import * as THREE from '../../vendor/three.js';

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export const lerp = (a, b, t) => a + (b - a) * clamp(t, 0, 1);
export const inverseLerp = (a, b, value) => (a === b ? 0 : clamp((value - a) / (b - a), 0, 1));
export const damp = (current, target, lambda, dt) => lerp(current, target, 1 - Math.exp(-lambda * dt));

export const shortestAngleDelta = (from, to) => {
  let delta = (to - from + Math.PI) % (Math.PI * 2);
  if (delta < 0) delta += Math.PI * 2;
  return delta - Math.PI;
};

export const dampAngle = (current, target, lambda, dt) => (
  current + shortestAngleDelta(current, target) * (1 - Math.exp(-lambda * dt))
);

export const vec2Distance = (a, b) => {
  const dx = a[0] - b[0];
  const dz = a[1] - b[1];
  return Math.hypot(dx, dz);
};

export const headingToVector = (heading) => new THREE.Vector3(Math.sin(heading), 0, Math.cos(heading));

export const formatTime = (seconds) => {
  const safe = Math.max(0, seconds);
  const mins = Math.floor(safe / 60);
  const secs = Math.floor(safe % 60);
  const tenths = Math.floor((safe - Math.floor(safe)) * 10);
  return `${mins}:${String(secs).padStart(2, '0')}.${tenths}`;
};

export const pointInRotatedRect = (point, center, size, rotation = 0) => {
  const cos = Math.cos(-rotation);
  const sin = Math.sin(-rotation);
  const dx = point.x - center.x;
  const dz = point.z - center.z;
  const localX = dx * cos - dz * sin;
  const localZ = dx * sin + dz * cos;
  return Math.abs(localX) <= size.x * 0.5 && Math.abs(localZ) <= size.z * 0.5;
};
