import * as THREE from 'three';
import { pointInRect } from './levels.js';

export const ZONE_STYLE = {
  sand: {
    color: 0xd7bc83,
    label: 'Sand'
  },
  boost: {
    color: 0xe1b957,
    label: 'Boost'
  },
  bouncePad: {
    color: 0x8ecf9d,
    label: 'Bounce'
  },
  wind: {
    color: 0xaedff7,
    label: 'Wind'
  }
};

export function getActiveZones(level, x, z) {
  return (level.zones ?? []).filter((zone) => pointInRect(x, z, zone, 0.16));
}

export function createZoneMesh(zone, materials) {
  const material = materials[zone.type] ?? materials.boostZone;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(zone.w, 0.035, zone.d), material);
  mesh.position.set(zone.x, 0.075, zone.z);
  mesh.receiveShadow = true;
  mesh.userData.zone = zone;
  return mesh;
}

export function createZoneMarker(zone, materials) {
  if (zone.type !== 'boost' && zone.type !== 'wind') return null;
  const group = new THREE.Group();
  const direction = new THREE.Vector2(zone.direction?.x ?? 0, zone.direction?.z ?? 1).normalize();
  const angle = Math.atan2(direction.x, direction.y);
  for (let i = -1; i <= 1; i += 1) {
    const arrow = new THREE.Mesh(
      new THREE.ConeGeometry(zone.type === 'wind' ? 0.12 : 0.16, zone.type === 'wind' ? 0.34 : 0.42, 3),
      zone.type === 'wind' ? materials.windArrow : materials.boostArrow
    );
    arrow.position.set(zone.x + direction.x * i * 0.34, 0.12, zone.z + direction.y * i * 0.34);
    arrow.rotation.set(Math.PI / 2, 0, -angle);
    group.add(arrow);
  }
  return group;
}

export function zoneFrictionMultiplier(zones) {
  return zones.some((zone) => zone.type === 'sand') ? 3.1 : 1;
}
