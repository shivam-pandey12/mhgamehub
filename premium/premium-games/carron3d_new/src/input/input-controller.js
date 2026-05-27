import { CARROM_INPUT } from '../config/carrom-constants.js';
import { AimingController } from './aiming-controller.js';
import { PointerRaycaster } from './pointer-raycaster.js';
import { StrikerPlacementController } from './striker-placement-controller.js';

const CONTROL_STATES = {
  ready: 'ready',
  pending: 'pending',
  placing: 'placing',
  aiming: 'aiming',
  shotMoving: 'shotMoving',
  settling: 'settling'
};

const POINTER_DECISION_DISTANCE = 0.045;

export class InputController {
  constructor({ canvas, camera, physicsWorld, aimLineRenderer, callbacks = {} }) {
    this.canvas = canvas;
    this.camera = camera;
    this.physicsWorld = physicsWorld;
    this.aimLineRenderer = aimLineRenderer;
    this.callbacks = callbacks;
    this.enabled = false;
    this.state = CONTROL_STATES.ready;
    this.activePointerId = null;
    this.pointerStart = null;

    this.pointerRaycaster = new PointerRaycaster({ canvas, camera });
    this.placementController = new StrikerPlacementController({
      physicsWorld,
      aimLineRenderer
    });
    this.aimingController = new AimingController({
      physicsWorld,
      aimLineRenderer,
      onPowerChange: (power) => this.callbacks.onPowerChange?.(power)
    });

    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handlePointerCancel = this.handlePointerCancel.bind(this);

    this.canvas?.addEventListener('pointerdown', this.handlePointerDown, { passive: false });
    this.canvas?.addEventListener('pointermove', this.handlePointerMove, { passive: false });
    this.canvas?.addEventListener('pointerup', this.handlePointerUp, { passive: false });
    this.canvas?.addEventListener('pointercancel', this.handlePointerCancel, { passive: false });
    this.canvas?.addEventListener('lostpointercapture', this.handlePointerCancel, { passive: false });
  }

  setEnabled(enabled) {
    this.enabled = Boolean(enabled);
    if (!this.enabled) {
      this.cancelActiveInput();
      return;
    }

    this.state = CONTROL_STATES.ready;
    this.aimLineRenderer?.hide();
  }

  reset() {
    this.cancelActiveInput();
    this.placementController.placeAtDefault();
    this.aimLineRenderer?.hide();
    this.state = CONTROL_STATES.ready;
    this.callbacks.onPowerChange?.({ ratio: 0, label: 'Ready' });
    this.emitReadyStatus();
  }

  setActiveBaseline(baseline) {
    this.placementController.setActiveBaseline(baseline);
  }

  prepareForTurn({ baseline = CARROM_INPUT.ACTIVE_BASELINE, enabled = true, silent = false } = {}) {
    this.cancelActiveInput();
    this.setActiveBaseline(baseline);
    this.enabled = Boolean(enabled);
    this.placementController.placeAtDefault();
    this.aimLineRenderer?.hide();
    this.state = enabled ? CONTROL_STATES.ready : CONTROL_STATES.settling;
    this.callbacks.onPowerChange?.({ ratio: 0, label: enabled ? 'Ready' : 'Locked' });
    if (!silent && enabled) {
      this.emitReadyStatus();
    }
  }

  handlePointerDown(event) {
    if (event.pointerType === 'touch' && event.isPrimary === false) {
      return;
    }

    if (!this.canReceivePointer()) {
      return;
    }

    const point = this.pointerRaycaster.getBoardPoint(event);
    if (!point) {
      return;
    }

    const nearStriker = this.isNearStriker(point);
    const onBaseline = this.placementController.isPointOnBaseline(point);
    if (!nearStriker && !onBaseline) {
      return;
    }

    event.preventDefault();
    this.activePointerId = event.pointerId;
    this.pointerStart = point;
    this.canvas?.setPointerCapture?.(event.pointerId);

    if (nearStriker) {
      this.state = CONTROL_STATES.pending;
      this.emitStatus('Drag sideways to place, or pull back to aim.', { shotPower: 'Ready', shotPowerRatio: 0 });
      return;
    }

    if (onBaseline) {
      this.beginPlacing(point);
    }
  }

  handlePointerMove(event) {
    if (event.pointerId !== this.activePointerId) {
      return;
    }

    const point = this.pointerRaycaster.getBoardPoint(event);
    if (!point) {
      return;
    }

    event.preventDefault();

    if (this.state === CONTROL_STATES.pending) {
      this.resolvePendingGesture(point);
      return;
    }

    if (this.state === CONTROL_STATES.placing) {
      this.updatePlacement(point);
      return;
    }

    if (this.state === CONTROL_STATES.aiming) {
      this.updateAim(point);
    }
  }

  handlePointerUp(event) {
    if (event.pointerId !== this.activePointerId) {
      return;
    }

    event.preventDefault();

    if (this.state === CONTROL_STATES.pending) {
      this.finishPointer();
      this.emitReadyStatus();
      return;
    }

    if (this.state === CONTROL_STATES.placing) {
      const validation = this.placementController.validateCurrentPosition();
      this.finishPointer();
      if (validation.valid) {
        this.placementController.clearFeedback();
        this.emitReadyStatus();
      } else {
        this.emitInvalidPlacement();
      }
      return;
    }

    if (this.state === CONTROL_STATES.aiming) {
      this.releaseShot();
      this.finishPointer();
      return;
    }

    this.finishPointer();
  }

  handlePointerCancel(event) {
    if (this.activePointerId === null || event.pointerId !== this.activePointerId) {
      return;
    }

    this.cancelActiveInput();
    if (this.enabled) {
      this.emitReadyStatus();
    }
  }

  resolvePendingGesture(point) {
    if (!this.pointerStart) {
      return;
    }

    const dx = point.x - this.pointerStart.x;
    const dz = point.z - this.pointerStart.z;
    const distance = Math.hypot(dx, dz);
    if (distance < POINTER_DECISION_DISTANCE) {
      return;
    }

    if (Math.abs(dx) > Math.abs(dz) * 1.15) {
      this.beginPlacing(point);
      return;
    }

    this.beginAiming(point);
  }

  beginPlacing(point) {
    if (!this.canInteractWithWorld()) {
      this.emitSettlingStatus();
      return;
    }

    this.state = CONTROL_STATES.placing;
    this.updatePlacement(point);
  }

  updatePlacement(point) {
    const result = this.placementController.moveToPoint(point);
    if (result.valid) {
      this.callbacks.onPlacementChanged?.(result.position);
      this.emitStatus('Striker placed. Pull from the striker to aim.', {
        shotPower: 'Ready',
        shotPowerRatio: 0
      });
      return;
    }

    this.emitInvalidPlacement();
  }

  beginAiming(point) {
    if (!this.canInteractWithWorld()) {
      this.emitSettlingStatus();
      return;
    }

    const validation = this.placementController.validateCurrentPosition();
    if (!validation.valid) {
      this.emitInvalidPlacement();
      this.state = CONTROL_STATES.ready;
      return;
    }

    this.placementController.clearFeedback();
    if (!this.aimingController.begin()) {
      this.emitStatus('Striker is not ready.', { shotPower: 'Blocked', shotPowerRatio: 0 });
      this.state = CONTROL_STATES.ready;
      return;
    }

    this.state = CONTROL_STATES.aiming;
    this.callbacks.onAimCreated?.();
    this.updateAim(point);
  }

  updateAim(point) {
    const validation = this.placementController.validateCurrentPosition();
    const aim = this.aimingController.update(point, validation.valid);
    this.callbacks.onAimUpdated?.(aim);

    if (!validation.valid) {
      this.emitInvalidPlacement();
      return;
    }

    const status = aim.power < CARROM_INPUT.MIN_SHOT_POWER
      ? 'Pull farther for a clean shot.'
      : 'Release to shoot.';
    this.emitStatus(status, {
      shotPower: aim.power < CARROM_INPUT.MIN_SHOT_POWER ? 'Too soft' : `${Math.round(aim.powerRatio * 100)}%`,
      shotPowerRatio: aim.powerRatio
    });
  }

  releaseShot() {
    const validation = this.placementController.validateCurrentPosition();
    const deferShot = this.callbacks.shouldDeferShotRelease?.() === true;
    const result = this.aimingController.release(validation.valid, { applyShot: !deferShot });

    if (!result.fired) {
      this.state = CONTROL_STATES.ready;
      if (result.reason === 'invalid-placement') {
        this.emitInvalidPlacement();
        return;
      }
      if (result.reason === 'cancelled') {
        this.emitStatus('Shot cancelled. Pull farther to shoot.', {
          shotPower: 'Ready',
          shotPowerRatio: 0
        });
        return;
      }
      this.emitStatus('Shot blocked while pieces settle.', {
        shotPower: 'Blocked',
        shotPowerRatio: 0
      });
      return;
    }

    this.state = CONTROL_STATES.shotMoving;
    this.placementController.clearFeedback();
    this.callbacks.onShotReleased?.(result);
  }

  handleShotStarted() {
    this.state = CONTROL_STATES.shotMoving;
    this.aimLineRenderer?.hide();
    this.emitStatus('Shot in motion.', {
      shotPower: 'Moving',
      shotPowerRatio: 1
    });
  }

  handleShotSettled(summary = { pocketedCount: 0 }) {
    this.state = CONTROL_STATES.settling;
    this.aimLineRenderer?.hide();
    this.emitStatus(`Resolving shot. Pocketed: ${summary.pocketedCount || 0}.`, {
      shotPower: 'Settled',
      shotPowerRatio: 0
    });
  }

  canReceivePointer() {
    if (!this.enabled || this.activePointerId !== null) {
      return false;
    }

    if (!this.canInteractWithWorld()) {
      this.emitSettlingStatus();
      return false;
    }

    return true;
  }

  canInteractWithWorld() {
    const state = this.physicsWorld?.getMotionState();
    return Boolean(state && !state.anyMoving);
  }

  isNearStriker(point) {
    const striker = this.physicsWorld?.getStrikerBody();
    if (!striker || striker.isPocketed) {
      return false;
    }

    const dx = point.x - striker.position.x;
    const dz = point.z - striker.position.z;
    return Math.hypot(dx, dz) <= CARROM_INPUT.AIM_START_RADIUS;
  }

  emitReadyStatus() {
    if (!this.enabled || !this.canInteractWithWorld()) {
      return;
    }

    const validation = this.placementController.validateCurrentPosition();
    if (!validation.valid) {
      this.emitInvalidPlacement();
      return;
    }

    this.emitStatus('Ready. Drag striker to place, pull from it to aim.', {
      shotPower: 'Ready',
      shotPowerRatio: 0
    });
  }

  emitInvalidPlacement() {
    this.emitStatus('Invalid striker placement. Move it away from coins.', {
      shotPower: 'Blocked',
      shotPowerRatio: 0
    });
  }

  emitSettlingStatus() {
    this.emitStatus('Waiting for pieces to settle.', {
      shotPower: 'Moving',
      shotPowerRatio: 1
    });
  }

  emitStatus(status, overrides = {}) {
    this.callbacks.onStatus?.(status, overrides);
  }

  finishPointer() {
    if (this.activePointerId !== null) {
      try {
        this.canvas?.releasePointerCapture?.(this.activePointerId);
      } catch {
        // Pointer capture may already be released by the browser on cancel/up.
      }
    }
    this.activePointerId = null;
    this.pointerStart = null;
    if (this.state !== CONTROL_STATES.shotMoving) {
      this.state = CONTROL_STATES.ready;
    }
  }

  cancelActiveInput() {
    this.aimingController.cancel();
    this.placementController.clearFeedback();
    this.finishPointer();
    this.state = CONTROL_STATES.ready;
  }

  dispose() {
    this.cancelActiveInput();
    this.canvas?.removeEventListener('pointerdown', this.handlePointerDown);
    this.canvas?.removeEventListener('pointermove', this.handlePointerMove);
    this.canvas?.removeEventListener('pointerup', this.handlePointerUp);
    this.canvas?.removeEventListener('pointercancel', this.handlePointerCancel);
    this.canvas?.removeEventListener('lostpointercapture', this.handlePointerCancel);
  }
}
