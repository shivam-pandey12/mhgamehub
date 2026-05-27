import { CARROM_BOARD } from '../config/carrom-constants.js';
import { PHYSICS_TUNING } from './physics-tuning.js';

export class PocketDetector {
  constructor({ pockets, onPocketed }) {
    this.pockets = pockets;
    this.onPocketed = onPocketed;
  }

  updateBody(body, dt) {
    if (body.isPocketed) {
      body.pocketedElapsed += dt;
      return;
    }

    const pocket = this.getNearestPocket(body);
    if (!pocket) {
      return;
    }

    if (pocket.distance <= this.getCaptureRadius(body)) {
      if (body.markPocketed(pocket)) {
        body.position.x = pocket.position.x;
        body.position.z = pocket.position.z;
        body.mesh?.userData?.carrom && (body.mesh.userData.carrom.isPocketed = true);
        this.onPocketed?.(body, pocket);
      }
      return;
    }

    if (pocket.distance <= this.getPullRadius(body)) {
      const strength = PHYSICS_TUNING.POCKET_PULL_STRENGTH * dt;
      body.velocity.x += pocket.normalX * strength;
      body.velocity.z += pocket.normalZ * strength;
      body.wake();
    }
  }

  isNearPocket(body) {
    return Boolean(this.getNearestPocket(body, this.getRailBypassRadius(body)));
  }

  getCaptureRadius(body) {
    const entryRatio = Math.min(Math.max(PHYSICS_TUNING.POCKET_HALF_ENTRY_RATIO ?? 0.5, 0.1), 0.9);
    return Math.max(
      PHYSICS_TUNING.POCKET_CAPTURE_RADIUS * 0.45,
      CARROM_BOARD.POCKET_RADIUS - body.radius * entryRatio
    );
  }

  getPullRadius(body) {
    return Math.max(this.getCaptureRadius(body) + body.radius * 0.75, PHYSICS_TUNING.POCKET_PULL_RADIUS);
  }

  getRailBypassRadius(body) {
    return Math.max(
      this.getCaptureRadius(body) + body.radius * 0.45,
      CARROM_BOARD.POCKET_RADIUS + body.radius * 0.15
    );
  }

  getNearestPocket(body, maxDistance = PHYSICS_TUNING.POCKET_PULL_RADIUS) {
    let nearest = null;

    this.pockets.forEach((pocket) => {
      const dx = pocket.position.x - body.position.x;
      const dz = pocket.position.z - body.position.z;
      const distanceSq = dx * dx + dz * dz;
      if (distanceSq > maxDistance * maxDistance) {
        return;
      }

      const distance = Math.sqrt(distanceSq) || 0.0001;
      if (!nearest || distance < nearest.distance) {
        nearest = {
          ...pocket,
          distance,
          normalX: dx / distance,
          normalZ: dz / distance
        };
      }
    });

    return nearest;
  }
}
