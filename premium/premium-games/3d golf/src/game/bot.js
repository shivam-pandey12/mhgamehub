import * as THREE from 'three';

const DIFFICULTY = {
  easy: { label: 'Easy', aimError: 0.18, powerError: 0.18, wait: 0.85, candidates: 3 },
  normal: { label: 'Normal', aimError: 0.09, powerError: 0.1, wait: 0.7, candidates: 7 },
  hard: { label: 'Hard', aimError: 0.035, powerError: 0.055, wait: 0.55, candidates: 12 }
};

function deterministicNoise(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function powerForDistance(distance) {
  return THREE.MathUtils.clamp(distance / 10.2, 0.24, 0.95);
}

function targetCandidates(level) {
  const candidates = [
    { x: level.hole.x, z: level.hole.z, weight: 0 }
  ];

  for (const area of level.playAreas ?? []) {
    candidates.push({ x: area.x, z: area.z, weight: 0.65 });
  }

  for (const zone of level.zones ?? []) {
    if (zone.type === 'boost' || zone.type === 'bouncePad') {
      candidates.push({ x: zone.x, z: zone.z, weight: zone.type === 'bouncePad' ? 0.4 : 0.3 });
    }
  }

  const midpoint = {
    x: (level.start.x + level.hole.x) / 2,
    z: (level.start.z + level.hole.z) / 2,
    weight: 0.5
  };
  candidates.push(midpoint);
  return candidates;
}

export function botProfile(difficulty = 'normal') {
  return DIFFICULTY[difficulty] ?? DIFFICULTY.normal;
}

export function planBotShot({ level, physics, dynamicColliders = [], difficulty = 'normal', shotNumber = 1 }) {
  const profile = botProfile(difficulty);
  const start = physics.position;
  let best = null;
  const candidates = targetCandidates(level).slice(0, profile.candidates);

  for (const target of candidates) {
    const direction = new THREE.Vector2(target.x - start.x, target.z - start.y);
    const distance = direction.length();
    if (distance < 0.05) continue;
    direction.normalize();
    const basePower = powerForDistance(distance + target.weight * 2.2);
    for (const powerBias of [-0.12, 0, 0.12]) {
      const power = THREE.MathUtils.clamp(basePower + powerBias, 0.16, 1);
      const path = physics.simulatePath(direction, power, level, 64, dynamicColliders);
      const last = path[path.length - 1] ?? { x: start.x, z: start.y };
      const holeDistance = Math.hypot(last.x - level.hole.x, last.z - level.hole.z);
      const targetDistance = Math.hypot(last.x - target.x, last.z - target.z);
      const score = holeDistance + targetDistance * target.weight + power * 0.06;
      if (!best || score < best.score) {
        best = { direction: direction.clone(), power, score };
      }
    }
  }

  const direct = best ?? {
    direction: new THREE.Vector2(level.hole.x - start.x, level.hole.z - start.y).normalize(),
    power: powerForDistance(Math.hypot(level.hole.x - start.x, level.hole.z - start.y)),
    score: 0
  };

  const seed = level.id * 17 + shotNumber * 11 + profile.wait * 100;
  const angleError = (deterministicNoise(seed) - 0.5) * profile.aimError;
  const powerError = (deterministicNoise(seed + 5) - 0.5) * profile.powerError;
  direct.direction.rotateAround(new THREE.Vector2(0, 0), angleError);
  direct.power = THREE.MathUtils.clamp(direct.power + powerError, 0.14, 1);
  return direct;
}
