import * as THREE from 'three';
import { DISTRICT_EVENTS, DISTRICTS } from '../config.js';

export class DistrictManager {
  constructor({ city, hud, radio }) {
    this.city = city;
    this.hud = hud;
    this.radio = radio;
    this.current = DISTRICTS.downtown;
    this.eventTimer = 8;
    this.recentEvents = [];
    this.markerGroup = new THREE.Group();
    this.markerGroup.name = 'DistrictLabels';
    this.city.group.add(this.markerGroup);
  }

  buildLabels(builder) {
    if (!builder?.makeTextTexture) return;
    for (const district of Object.values(DISTRICTS)) {
      const texture = builder.makeTextTexture(district.name.toUpperCase(), '#123047', 256, 64, 'bold 24px Arial', 0xfff3d8);
      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.78 });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(24, 6), material);
      mesh.position.set(district.landmark.x, 5.8, district.landmark.z);
      mesh.rotation.x = -0.3;
      this.markerGroup.add(mesh);
    }
  }

  resolve(position) {
    if (!position) return this.current;
    const found = Object.values(DISTRICTS).find((district) => (
      position.x >= district.bounds.minX &&
      position.x <= district.bounds.maxX &&
      position.z >= district.bounds.minZ &&
      position.z <= district.bounds.maxZ
    ));
    return found || this.nearestDistrict(position);
  }

  nearestDistrict(position) {
    let best = DISTRICTS.downtown;
    let bestDistance = Infinity;
    for (const district of Object.values(DISTRICTS)) {
      const dx = position.x - district.landmark.x;
      const dz = position.z - district.landmark.z;
      const distance = dx * dx + dz * dz;
      if (distance < bestDistance) {
        bestDistance = distance;
        best = district;
      }
    }
    return best;
  }

  update(dt, { player, intensity = 0, mission = null } = {}) {
    if (!player) return null;
    const next = mission?.districtId ? DISTRICTS[mission.districtId] || this.resolve(player.group.position) : this.resolve(player.group.position);
    if (next.id !== this.current.id) {
      this.current = next;
      this.hud.showEvent?.(`DISTRICT: ${next.name.toUpperCase()}`);
      this.radio?.push(`${next.name} pursuit zone entered.`, 'City Watch');
    }
    this.eventTimer -= dt * (1 + intensity * 0.7);
    if (this.eventTimer > 0) return null;
    this.eventTimer = 24 + Math.random() * 18;
    const event = this.pickEvent(next);
    if (!event) return null;
    this.hud.showEvent?.(event.name);
    this.radio?.push(event.message, 'City Watch');
    return { ...event, district: next };
  }

  pickEvent(district) {
    const candidates = district.events
      .map((id) => ({ id, ...DISTRICT_EVENTS[id] }))
      .filter((event) => !this.recentEvents.includes(event.id));
    const event = candidates[Math.floor(Math.random() * Math.max(1, candidates.length))];
    if (!event) return null;
    this.recentEvents.push(event.id);
    while (this.recentEvents.length > 4) this.recentEvents.shift();
    return event;
  }
}
