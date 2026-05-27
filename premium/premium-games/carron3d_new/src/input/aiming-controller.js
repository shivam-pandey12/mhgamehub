import { CARROM_INPUT } from '../config/carrom-constants.js';

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export class AimingController {
  constructor({ physicsWorld, aimLineRenderer, onPowerChange }) {
    this.physicsWorld = physicsWorld;
    this.aimLineRenderer = aimLineRenderer;
    this.onPowerChange = onPowerChange;
    this.reset();
  }

  begin() {
    this.reset();
    const striker = this.physicsWorld?.getStrikerBody();
    if (!striker) {
      return false;
    }

    this.startPosition = {
      x: striker.position.x,
      z: striker.position.z
    };
    this.active = true;
    this.emitPower(0, 'Pull to aim');
    return true;
  }

  update(pointerPoint, validPlacement = true) {
    if (!this.active || !pointerPoint || !this.startPosition) {
      return this.getAimState();
    }

    const pullX = pointerPoint.x - this.startPosition.x;
    const pullZ = pointerPoint.z - this.startPosition.z;
    const dragDistance = Math.hypot(pullX, pullZ);
    const clampedDistance = clamp(dragDistance, 0, CARROM_INPUT.AIM_DRAG_MAX_DISTANCE);
    const power = clamp(
      clampedDistance * CARROM_INPUT.POWER_SCALE,
      0,
      CARROM_INPUT.MAX_SHOT_POWER
    );
    const powerRatio = CARROM_INPUT.MAX_SHOT_POWER > 0 ? power / CARROM_INPUT.MAX_SHOT_POWER : 0;

    let direction = { x: 0, z: -1 };
    if (dragDistance > 0.0001) {
      direction = {
        x: -pullX / dragDistance,
        z: -pullZ / dragDistance
      };
    }

    this.dragDistance = dragDistance;
    this.power = power;
    this.powerRatio = powerRatio;
    this.direction = direction;

    this.aimLineRenderer?.showAim({
      start: this.startPosition,
      direction,
      powerRatio,
      valid: validPlacement && power >= CARROM_INPUT.MIN_SHOT_POWER
    });

    const label = power < CARROM_INPUT.MIN_SHOT_POWER
      ? 'Too soft'
      : `${Math.round(powerRatio * 100)}%`;
    this.emitPower(powerRatio, label);

    return this.getAimState();
  }

  release(validPlacement = true, { applyShot = true } = {}) {
    const state = this.getAimState();
    this.cancel();

    if (!validPlacement) {
      return { fired: false, reason: 'invalid-placement', ...state };
    }

    if (state.power < CARROM_INPUT.MIN_SHOT_POWER || state.dragDistance < CARROM_INPUT.AIM_CANCEL_DISTANCE) {
      return { fired: false, reason: 'cancelled', ...state };
    }

    if (!applyShot) {
      return {
        fired: true,
        deferred: true,
        reason: 'deferred',
        ...state
      };
    }

    const fired = this.physicsWorld?.applyStrikerShot(state.direction, state.power) || false;
    return {
      fired,
      reason: fired ? '' : 'blocked',
      ...state
    };
  }

  cancel() {
    this.aimLineRenderer?.hideAim();
    this.emitPower(0, 'Ready');
    this.reset();
  }

  reset() {
    this.active = false;
    this.startPosition = null;
    this.dragDistance = 0;
    this.power = 0;
    this.powerRatio = 0;
    this.direction = { x: 0, z: -1 };
  }

  getAimState() {
    return {
      active: this.active,
      strikerPosition: this.startPosition ? { ...this.startPosition } : null,
      dragDistance: this.dragDistance,
      power: this.power,
      powerRatio: this.powerRatio,
      direction: { ...this.direction }
    };
  }

  emitPower(ratio, label) {
    this.onPowerChange?.({
      ratio: clamp(ratio, 0, 1),
      label
    });
  }
}
