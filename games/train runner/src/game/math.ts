import * as THREE from 'three';

export function clamp01(value: number): number {
  return THREE.MathUtils.clamp(value, 0, 1);
}

export function smoothstep(edge0: number, edge1: number, value: number): number {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export function expDecay(current: number, target: number, sharpness: number, dt: number): number {
  return THREE.MathUtils.damp(current, target, sharpness, dt);
}

export function signedAxis(negative: boolean, positive: boolean): number {
  if (negative === positive) {
    return 0;
  }

  return negative ? -1 : 1;
}

export function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

export function chooseFrom<T>(items: readonly T[], index: number): T {
  return items[((index % items.length) + items.length) % items.length];
}
