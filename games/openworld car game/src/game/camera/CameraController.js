import * as THREE from '../../vendor/three.js';
import { COCKPIT_SETTINGS, getCockpitConfig } from '../../config/cockpits.js';
import { damp, dampAngle, headingToVector } from '../utils/math.js';

const MODES = [
  { id: 'standard', label: 'Standard Chase', distance: 12, height: 5.3, lookAhead: 7, fov: 62 },
  { id: 'far', label: 'Far Chase', distance: 18, height: 8.2, lookAhead: 10, fov: 66 },
  { id: 'hood', label: 'Hood View', distance: -1.1, height: 1.85, lookAhead: 16, fov: 72 },
  { id: 'cockpit', label: 'Cockpit View', distance: 0, height: 1.3, lookAhead: 14, fov: 68 }
];

const MODE_IDS = MODES.map((mode) => mode.id);

export class CameraController {
  constructor(camera, saveManager) {
    this.camera = camera;
    this.saveManager = saveManager;
    const savedMode = saveManager.settings.cameraMode;
    this.modeIndex = Math.max(0, MODE_IDS.indexOf(MODE_IDS.includes(savedMode) ? savedMode : 'standard'));
    this.lastChaseMode = this.currentMode.id === 'cockpit' ? 'standard' : this.currentMode.id;
    this.position = new THREE.Vector3(0, 8, -14);
    this.target = new THREE.Vector3();
    this.vehicleWorld = new THREE.Vector3();
    this.yaw = 0;
    this.shake = 0;
  }

  nextMode() {
    const next = MODES[(this.modeIndex + 1) % MODES.length].id;
    this.setMode(next);
    return this.currentMode.label;
  }

  setMode(id, persist = true) {
    const index = MODE_IDS.indexOf(id);
    if (index < 0) return this.currentMode.label;
    if (this.currentMode.id !== 'cockpit' && id !== 'cockpit') {
      this.lastChaseMode = this.currentMode.id;
    }
    this.modeIndex = index;
    if (id !== 'cockpit') this.lastChaseMode = id;
    if (persist) this.saveManager.updateSettings({ cameraMode: this.currentMode.id });
    return this.currentMode.label;
  }

  toggleCockpit() {
    if (this.currentMode.id === 'cockpit') {
      return this.setMode(this.lastChaseMode || 'standard');
    }
    this.lastChaseMode = this.currentMode.id;
    return this.setMode('cockpit');
  }

  getMode() {
    return this.currentMode;
  }

  get currentMode() {
    return MODES[this.modeIndex];
  }

  update(dt, vehicle, telemetry) {
    const mode = this.currentMode;
    const forward = headingToVector(vehicle.heading);
    const vehicleWorld = vehicle.getWorldPosition
      ? vehicle.getWorldPosition(this.vehicleWorld)
      : this.vehicleWorld.copy(vehicle.mesh?.position ?? vehicle.position);

    if (mode.id === 'cockpit') {
      this.updateCockpit(dt, vehicle, telemetry, vehicleWorld, forward);
      return;
    }

    this.yaw = dampAngle(this.yaw, vehicle.heading, mode.id === 'hood' ? 18 : 8.5, dt);
    const cameraForward = headingToVector(this.yaw);
    const pullback = telemetry.speedRatio * (mode.id === 'hood' ? 0.7 : 3.2);
    const clearance = telemetry.elevated ? 0.65 : 0;
    const desired = vehicleWorld
      .clone()
      .addScaledVector(cameraForward, -mode.distance - pullback)
      .add(new THREE.Vector3(0, mode.height + telemetry.speedRatio * 0.65 + clearance, 0));
    if (mode.id === 'hood') {
      desired.copy(vehicleWorld)
        .addScaledVector(forward, 1.55)
        .add(new THREE.Vector3(0, mode.height + clearance * 0.35, 0));
    }

    const horizontalRate = mode.id === 'hood' ? 16 : 6.5;
    const verticalRate = mode.id === 'hood' ? 14 : 5.4;
    const horizontalAlpha = 1 - Math.exp(-horizontalRate * dt);
    this.position.x += (desired.x - this.position.x) * horizontalAlpha;
    this.position.z += (desired.z - this.position.z) * horizontalAlpha;
    this.position.y = damp(this.position.y, desired.y, verticalRate, dt);

    this.target.copy(vehicleWorld)
      .addScaledVector(forward, mode.lookAhead + telemetry.speedRatio * 4)
      .add(new THREE.Vector3(0, 1.2 + clearance * 0.25, 0));

    this.shake = Math.max(this.shake, telemetry.collisionIntensity);
    const shakeSetting = this.saveManager.settings.cameraShake;
    const shakeScale = shakeSetting === 'normal' ? 0.23 : shakeSetting === 'low' ? 0.11 : 0;
    const shakeAmount = this.shake * shakeScale;
    this.shake = Math.max(0, this.shake - dt * 1.8);

    this.camera.position.copy(this.position);
    if (shakeAmount > 0.01) {
      this.camera.position.x += (Math.random() - 0.5) * shakeAmount;
      this.camera.position.y += (Math.random() - 0.5) * shakeAmount * 0.5;
    }
    this.camera.lookAt(this.target);
    this.camera.fov = damp(this.camera.fov, mode.fov + telemetry.speedRatio * 7, 4.6, dt);
    this.camera.updateProjectionMatrix();
  }

  updateCockpit(dt, vehicle, telemetry, vehicleWorld, forward) {
    const config = getCockpitConfig(vehicle.config?.id);
    const local = config.camera.localPosition;
    const right = new THREE.Vector3(forward.z, 0, -forward.x);
    const clearance = telemetry.elevated ? config.camera.clearance + 0.08 : config.camera.clearance;
    const interiorEyeLift = 0.32;
    const desired = vehicleWorld.clone()
      .addScaledVector(right, local[0])
      .add(new THREE.Vector3(0, local[1] + clearance + interiorEyeLift, 0))
      .addScaledVector(forward, local[2]);

    const speedPush = (telemetry.speedRatio ?? 0) * 0.14;
    desired.addScaledVector(forward, speedPush);
    this.position.x = desired.x;
    this.position.z = desired.z;
    this.position.y = damp(this.position.y, desired.y, 24, dt);

    this.target.copy(vehicleWorld)
      .addScaledVector(forward, config.camera.lookAhead + (telemetry.speedRatio ?? 0) * 4)
      .add(new THREE.Vector3(0, config.camera.lookHeight + clearance * 0.35, 0));

    this.shake = Math.max(this.shake, telemetry.collisionIntensity * 0.55);
    const shakeSetting = this.saveManager.settings.cameraShake;
    const cockpitMotion = this.saveManager.settings.cockpitMotion;
    const shakeScale = cockpitMotion === 'off'
      ? 0
      : shakeSetting === 'normal'
        ? 0.08
        : shakeSetting === 'low'
          ? 0.04
          : 0;
    const shakeAmount = this.shake * shakeScale;
    this.shake = Math.max(0, this.shake - dt * 2.1);

    this.camera.position.copy(this.position);
    if (shakeAmount > 0.005) {
      this.camera.position.x += (Math.random() - 0.5) * shakeAmount;
      this.camera.position.y += (Math.random() - 0.5) * shakeAmount * 0.45;
    }
    this.camera.lookAt(this.target);
    const fovOffset = COCKPIT_SETTINGS.fovOffsets[this.saveManager.settings.cockpitFov] ?? 0;
    const targetFov = config.camera.fov + fovOffset + (telemetry.boosting ? 3 : 0) + (telemetry.speedRatio ?? 0) * 2.5;
    this.camera.fov = damp(this.camera.fov, targetFov, 5.5, dt);
    this.camera.updateProjectionMatrix();
  }
}
