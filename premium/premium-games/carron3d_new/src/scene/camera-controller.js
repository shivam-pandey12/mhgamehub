import * as THREE from 'three';
import { CAMERA_TURN_ROTATION, CAMERA_VIEWS } from '../config/carrom-constants.js';

const BASELINE_ANGLES = {
  bottom: 0,
  top: Math.PI,
  left: Math.PI / 2,
  right: -Math.PI / 2
};

function easeInOutCubic(value) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function vectorFromPreset(preset, key) {
  const value = preset[key];
  return new THREE.Vector3(value.x, value.y, value.z);
}

function nearestAngle(current, target) {
  const fullTurn = Math.PI * 2;
  let delta = ((target - current + Math.PI) % fullTurn + fullTurn) % fullTurn - Math.PI;
  if (Math.abs(Math.abs(delta) - Math.PI) < 0.0001) {
    delta = Math.PI;
  }
  return current + delta;
}

export class CameraController {
  constructor(camera) {
    this.camera = camera;
    this.target = vectorFromPreset(CAMERA_VIEWS.menu, 'target');
    this.basePosition = vectorFromPreset(CAMERA_VIEWS.menu, 'position');
    this.desiredPosition = this.basePosition.clone();
    this.desiredTarget = this.target.clone();
    this.time = 0;
    this.motionEnabled = true;
    this.viewport = { width: 1280, height: 720 };
    this.mode = 'menu';
    this.side = 'bottom';
    this.sideAngle = 0;
    this.sideTransition = null;
    this.tempPosition = new THREE.Vector3();
    this.tempTarget = new THREE.Vector3();
    this.sidePosition = new THREE.Vector3();
    this.feedbackOffset = new THREE.Vector3();
    this.feedbackVelocity = new THREE.Vector3();
    this.manualOrbitEnabled = false;
    this.isManualOrbiting = false;
    this.manualOrbitYaw = 0;
    this.manualOrbitLift = 0;
    this.orbitStart = { x: 0, y: 0, yaw: 0, lift: 0 };
  }

  init() {
    this.setMenuView({ immediate: true });
  }

  setViewport(width, height) {
    this.viewport = { width, height };
    if (this.mode === 'gameplay') {
      this.setGameplayView();
    }
  }

  setMotionEnabled(enabled) {
    this.updateIdleMotion(enabled);
  }

  updateIdleMotion(enabled) {
    this.motionEnabled = Boolean(enabled);
  }

  setManualOrbitEnabled(enabled) {
    this.manualOrbitEnabled = Boolean(enabled);
    if (!this.manualOrbitEnabled) {
      this.isManualOrbiting = false;
      this.manualOrbitYaw = 0;
      this.manualOrbitLift = 0;
    }
  }

  beginManualOrbit(clientX, clientY) {
    if (!this.manualOrbitEnabled) {
      return false;
    }

    this.isManualOrbiting = true;
    this.orbitStart.x = clientX;
    this.orbitStart.y = clientY;
    this.orbitStart.yaw = this.manualOrbitYaw;
    this.orbitStart.lift = this.manualOrbitLift;
    return true;
  }

  updateManualOrbit(clientX, clientY) {
    if (!this.isManualOrbiting) {
      return;
    }

    const dx = clientX - this.orbitStart.x;
    const dy = clientY - this.orbitStart.y;
    this.manualOrbitYaw = this.orbitStart.yaw - dx * 0.006;
    this.manualOrbitLift = Math.min(Math.max(this.orbitStart.lift + dy * 0.004, -0.82), 0.78);
  }

  endManualOrbit() {
    this.isManualOrbiting = false;
  }

  setMenuView(options = {}) {
    this.mode = 'menu';
    this.setView(CAMERA_VIEWS.menu, options);
  }

  setGameplayView(options = {}) {
    this.mode = 'gameplay';
    const portrait = this.viewport.height > this.viewport.width;
    const mobile = this.viewport.width <= 760 || this.viewport.height <= 560;
    this.setView(portrait && mobile ? CAMERA_VIEWS.mobilePortrait : mobile ? CAMERA_VIEWS.mobile : CAMERA_VIEWS.gameplay, options);
  }

  setGameplaySide(baseline = 'bottom', { immediate = false } = {}) {
    const nextSide = Object.prototype.hasOwnProperty.call(BASELINE_ANGLES, baseline) ? baseline : 'bottom';
    const targetAngle = this.getNextSideAngle(nextSide);
    this.side = nextSide;

    if (immediate || Math.abs(targetAngle - this.sideAngle) < 0.0001) {
      this.sideAngle = targetAngle;
      this.sideTransition = null;
      this.applyImmediateCameraPosition();
      return;
    }

    this.sideTransition = {
      from: this.sideAngle,
      to: targetAngle,
      elapsed: 0,
      duration: CAMERA_TURN_ROTATION.DURATION
    };
  }

  getNextSideAngle(nextSide) {
    const isOppositeLocalSide = (
      (this.side === 'bottom' && nextSide === 'top') ||
      (this.side === 'top' && nextSide === 'bottom')
    );

    if (isOppositeLocalSide) {
      return this.sideAngle + Math.PI;
    }

    return nearestAngle(this.sideAngle, BASELINE_ANGLES[nextSide]);
  }

  setTopView(options = {}) {
    this.mode = 'top';
    this.setView(CAMERA_VIEWS.top, options);
  }

  setCinematicView(options = {}) {
    this.mode = 'cinematic';
    this.setView(CAMERA_VIEWS.cinematic, options);
  }

  focusBoard(options = {}) {
    this.setGameplayView(options);
  }

  setView(preset, { immediate = false } = {}) {
    this.basePosition.copy(vectorFromPreset(preset, 'position'));
    this.target.copy(vectorFromPreset(preset, 'target'));
    this.desiredPosition.copy(this.basePosition);
    this.desiredTarget.copy(this.target);
    if (immediate) {
      this.applyImmediateCameraPosition();
    }
  }

  applyImmediateCameraPosition() {
    this.camera.position.copy(this.getSideAdjustedPosition());
    this.camera.lookAt(this.target);
    this.desiredTarget.copy(this.target);
  }

  getSideAdjustedPosition() {
    const offsetX = this.basePosition.x - this.target.x;
    const offsetZ = this.basePosition.z - this.target.z;
    const angle = (this.mode === 'gameplay' ? this.sideAngle : 0) + this.manualOrbitYaw;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    this.sidePosition.set(
      this.target.x + offsetX * cos - offsetZ * sin,
      this.basePosition.y + this.manualOrbitLift,
      this.target.z + offsetX * sin + offsetZ * cos
    );
    return this.sidePosition;
  }

  focusForState(state) {
    if (state === 'playing' || state === 'paused' || state === 'result') {
      this.setGameplayView();
      return;
    }

    if (state === 'rules' || state === 'settings') {
      return;
    }

    if (state === 'modeSelect' || state === 'localSetup') {
      this.setCinematicView();
      return;
    }

    this.setMenuView();
  }

  playIntroSweep() {
    if (!this.motionEnabled) {
      return;
    }
    this.setCinematicView();
    this.feedbackVelocity.set(-0.12, 0.05, 0.16);
  }

  shotNudge(powerRatio = 0.5) {
    if (!this.motionEnabled) {
      return;
    }
    const strength = Math.min(Math.max(powerRatio, 0.1), 1);
    this.feedbackVelocity.set(0, 0.025 * strength, -0.08 * strength);
  }

  foulPulse() {
    if (!this.motionEnabled) {
      return;
    }
    this.feedbackVelocity.set(0.08, 0, 0.04);
  }

  winnerView() {
    this.setCinematicView();
    if (this.motionEnabled) {
      this.feedbackVelocity.set(-0.06, 0.08, 0.12);
    }
  }

  clearFeedback() {
    this.feedbackOffset.set(0, 0, 0);
    this.feedbackVelocity.set(0, 0, 0);
    this.sideTransition = null;
  }

  update(delta) {
    this.time += delta;
    this.updateSideTransition(delta);
    const idleStrength = this.mode === 'gameplay' ? 0.055 : 0.18;
    const idle = this.motionEnabled ? Math.sin(this.time * 0.32) * idleStrength : 0;
    const lift = this.motionEnabled ? Math.sin(this.time * 0.21) * idleStrength * 0.32 : 0;
    const sidedPosition = this.getSideAdjustedPosition();

    this.tempPosition.set(
      sidedPosition.x + idle,
      sidedPosition.y + lift,
      sidedPosition.z
    );
    this.feedbackOffset.addScaledVector(this.feedbackVelocity, delta);
    this.feedbackVelocity.multiplyScalar(Math.exp(-delta * 9));
    this.feedbackOffset.multiplyScalar(Math.exp(-delta * 5.5));
    this.tempPosition.add(this.feedbackOffset);
    this.tempTarget.copy(this.target);
    const positionLerp = this.sideTransition ? CAMERA_TURN_ROTATION.POSITION_LERP : 2.8;
    const targetLerp = this.sideTransition ? CAMERA_TURN_ROTATION.TARGET_LERP : 3.2;
    this.camera.position.lerp(this.tempPosition, 1 - Math.exp(-delta * positionLerp));
    this.desiredTarget.lerp(this.tempTarget, 1 - Math.exp(-delta * targetLerp));
    this.camera.lookAt(this.desiredTarget);
  }

  updateSideTransition(delta) {
    if (!this.sideTransition) {
      return;
    }

    this.sideTransition.elapsed += delta;
    const progress = Math.min(this.sideTransition.elapsed / this.sideTransition.duration, 1);
    const eased = easeInOutCubic(progress);
    this.sideAngle = this.sideTransition.from + (this.sideTransition.to - this.sideTransition.from) * eased;
    if (progress >= 1) {
      this.sideAngle = this.sideTransition.to;
      this.sideTransition = null;
    }
  }
}
