import { CARROM_BOARD, CARROM_INPUT } from '../config/carrom-constants.js';

const BASELINES = new Set(['bottom', 'top', 'left', 'right']);

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export class StrikerPlacementController {
  constructor({ physicsWorld, aimLineRenderer }) {
    this.physicsWorld = physicsWorld;
    this.aimLineRenderer = aimLineRenderer;
    this.activeBaseline = CARROM_INPUT.ACTIVE_BASELINE;
    this.lastPlacement = this.getDefaultPosition();
  }

  setActiveBaseline(baseline) {
    this.activeBaseline = BASELINES.has(baseline) ? baseline : CARROM_INPUT.ACTIVE_BASELINE;
    return this.activeBaseline;
  }

  getBaselinePlacementRange(baseline = this.activeBaseline) {
    const min = -CARROM_BOARD.BASELINE_HALF_LENGTH + CARROM_BOARD.STRIKER_RADIUS;
    const max = CARROM_BOARD.BASELINE_HALF_LENGTH - CARROM_BOARD.STRIKER_RADIUS;
    const offset = CARROM_BOARD.BASELINE_OFFSET;

    if (baseline === 'top') {
      return { axis: 'x', minX: min, maxX: max, minZ: -offset, maxZ: -offset, fixedZ: -offset };
    }

    if (baseline === 'left') {
      return { axis: 'z', minX: -offset, maxX: -offset, fixedX: -offset, minZ: min, maxZ: max };
    }

    if (baseline === 'right') {
      return { axis: 'z', minX: offset, maxX: offset, fixedX: offset, minZ: min, maxZ: max };
    }

    return { axis: 'x', minX: min, maxX: max, minZ: offset, maxZ: offset, fixedZ: offset };
  }

  getDefaultPosition(preferred = {}) {
    const range = this.getBaselinePlacementRange();
    if (range.axis === 'z') {
      return {
        x: range.fixedX,
        z: clamp(preferred.z ?? 0, range.minZ, range.maxZ)
      };
    }

    return {
      x: clamp(preferred.x ?? 0, range.minX, range.maxX),
      z: range.fixedZ
    };
  }

  isPointOnBaseline(point) {
    if (!point) {
      return false;
    }

    const range = this.getBaselinePlacementRange();
    const band = CARROM_INPUT.BASELINE_TOUCH_BAND;
    if (range.axis === 'z') {
      return (
        Math.abs(point.x - range.fixedX) <= band &&
        point.z >= range.minZ - band &&
        point.z <= range.maxZ + band
      );
    }

    return (
      Math.abs(point.z - range.fixedZ) <= band &&
      point.x >= range.minX - band &&
      point.x <= range.maxX + band
    );
  }

  getClampedPosition(point) {
    const range = this.getBaselinePlacementRange();
    if (range.axis === 'z') {
      return {
        x: range.fixedX,
        z: clamp(point?.z ?? this.lastPlacement.z, range.minZ, range.maxZ)
      };
    }

    return {
      x: clamp(point?.x ?? this.lastPlacement.x, range.minX, range.maxX),
      z: range.fixedZ
    };
  }

  moveToPoint(point) {
    const position = this.getClampedPosition(point);
    return this.placeAt(position);
  }

  placeAt(position) {
    const validation = this.validatePosition(position);
    if (!validation.valid) {
      this.aimLineRenderer?.showPlacement(position, false);
      return {
        placed: false,
        position,
        ...validation
      };
    }

    const placed = this.physicsWorld?.setStrikerPosition(position.x, position.z);
    if (placed) {
      this.lastPlacement = { x: position.x, z: position.z };
    }
    this.aimLineRenderer?.showPlacement(position, validation.valid);
    return {
      placed,
      position,
      ...validation
    };
  }

  placeAtDefault(preferred = {}) {
    const position = this.findOpenBaselinePosition(preferred);
    return this.placeAt(position);
  }

  findOpenBaselinePosition(preferred = {}) {
    const preferredPosition = this.getDefaultPosition(preferred);
    if (this.validatePosition(preferredPosition).valid) {
      return preferredPosition;
    }

    const range = this.getBaselinePlacementRange();
    const samples = Math.max(3, CARROM_INPUT.PLACEMENT_SAMPLE_COUNT);
    const centerIndex = Math.floor(samples / 2);

    for (let offset = 1; offset <= centerIndex; offset += 1) {
      const candidates = [centerIndex - offset, centerIndex + offset];
      for (const index of candidates) {
        if (index < 0 || index >= samples) {
          continue;
        }

        const t = samples === 1 ? 0.5 : index / (samples - 1);
        const position = range.axis === 'z'
          ? { x: range.fixedX, z: range.minZ + (range.maxZ - range.minZ) * t }
          : { x: range.minX + (range.maxX - range.minX) * t, z: range.fixedZ };

        if (this.validatePosition(position).valid) {
          return position;
        }
      }
    }

    return preferredPosition;
  }

  validateCurrentPosition() {
    const striker = this.physicsWorld?.getStrikerBody();
    if (!striker) {
      return { valid: false, reason: 'missing-striker' };
    }

    return this.validatePosition(striker.position);
  }

  validatePosition(position) {
    const striker = this.physicsWorld?.getStrikerBody();
    if (!striker) {
      return { valid: false, reason: 'missing-striker' };
    }

    const overlapping = this.physicsWorld.isCircleOverlapping(
      position.x,
      position.z,
      striker.radius + CARROM_INPUT.PLACEMENT_PADDING,
      striker.id
    );

    return overlapping
      ? { valid: false, reason: 'overlap' }
      : { valid: true, reason: '' };
  }

  clearFeedback() {
    this.aimLineRenderer?.hidePlacement();
  }
}
