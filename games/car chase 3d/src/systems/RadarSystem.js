import { RADAR_CONFIG } from '../config.js';

export class RadarSystem {
  constructor({ hud }) {
    this.hud = hud;
  }

  update({ player, target, vehicles, missionTarget, roadblocks, pickups, settings }) {
    if (!settings?.minimap || !player || player.destroyed) {
      this.hud.updateRadar?.({ visible: false, icons: [] });
      return;
    }
    const origin = player.group.position;
    const icons = [];
    const push = (type, position, label = '') => {
      if (!position || icons.length >= RADAR_CONFIG.maxIcons) return;
      const dx = position.x - origin.x;
      const dz = position.z - origin.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      if (distance > RADAR_CONFIG.range) return;
      icons.push({
        type,
        label,
        x: dx / RADAR_CONFIG.range,
        y: dz / RADAR_CONFIG.range,
        distance,
      });
    };

    if (target && !target.destroyed) push('target', target.group.position, 'T');
    if (missionTarget) push('objective', missionTarget, 'O');
    for (const vehicle of vehicles) {
      if (vehicle === player || vehicle.destroyed) continue;
      if (vehicle.unitKind === 'captain') push('captain', vehicle.group.position, 'C');
      else if (vehicle.faction === 'police') push('police', vehicle.group.position, 'P');
      else if (vehicle.faction === 'robber') push('robber', vehicle.group.position, 'R');
    }
    for (const block of roadblocks?.blocks || []) push('roadblock', block.group.position, '!');
    for (const pickup of pickups || []) push('pickup', pickup.mesh.position, '+');
    this.hud.updateRadar?.({ visible: true, icons });
  }

  clear() {
    this.hud.updateRadar?.({ visible: false, icons: [] });
  }
}
