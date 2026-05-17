import * as THREE from 'three';
import { angleToVector, clamp, damp } from '../utils/math.js';

export class CameraController {
  constructor(camera) {
    this.camera = camera;
    this.position = new THREE.Vector3();
    this.lookAt = new THREE.Vector3();
    this.shakePower = 0;
    this.shakeEnabled = true;
    this.shakeScale = 1;
    this.introTimer = 0;
    this.baseFov = 58;
  }

  startIntro() {
    this.introTimer = 3.15;
  }

  shake(power = 0.35) {
    if (!this.shakeEnabled) return;
    this.shakePower = Math.max(this.shakePower, power);
  }

  setSettings(settings) {
    this.shakeEnabled = settings.cameraShake !== false && settings.cameraShakeIntensity !== 'off';
    this.shakeScale = settings.cameraShakeIntensity === 'low' ? 0.45 : 1;
  }

  update(dt, target, matchTime = 0) {
    if (!target || target.destroyed) return;
    const targetPosition = target.group.position;
    const forward = angleToVector(target.yaw);
    const speedRatio = clamp(target.speed / 58, 0, 1);

    if (this.introTimer > 0) {
      this.introTimer -= dt;
      const t = 1 - this.introTimer / 3.15;
      const orbit = matchTime * 0.7 + t * Math.PI * 1.25;
      const radius = 38 - t * 14;
      this.position.set(
        targetPosition.x + Math.sin(orbit) * radius,
        25 - t * 13,
        targetPosition.z + Math.cos(orbit) * radius,
      );
      this.lookAt.copy(targetPosition).add(forward.clone().multiplyScalar(8));
      this.lookAt.y += 2.4;
      this.camera.position.lerp(this.position, 1 - Math.exp(-4.8 * dt));
      this.camera.lookAt(this.lookAt);
      this.camera.fov = damp(this.camera.fov, this.baseFov + 4, 5, dt);
      this.camera.updateProjectionMatrix();
      return;
    }

    const backDistance = 12.5 + speedRatio * 7.8 + (target.nitro < 92 ? 1.8 : 0);
    const height = 6.1 + speedRatio * 2.8;
    const driftSide = target.velocity.clone().normalize().cross(forward).y || 0;
    const side = new THREE.Vector3(Math.cos(target.yaw), 0, -Math.sin(target.yaw)).multiplyScalar(driftSide * 1.8);
    const desired = targetPosition
      .clone()
      .add(forward.clone().multiplyScalar(-backDistance))
      .add(side);
    desired.y += height;
    const look = targetPosition.clone().add(forward.clone().multiplyScalar(11 + speedRatio * 7));
    look.y += 1.75;

    this.camera.position.lerp(desired, 1 - Math.exp(-7.5 * dt));
    this.lookAt.lerp(look, 1 - Math.exp(-9 * dt));

    if (this.shakePower > 0.002) {
      const shake = new THREE.Vector3(
        (Math.random() - 0.5) * this.shakePower,
        (Math.random() - 0.5) * this.shakePower * 0.65,
        (Math.random() - 0.5) * this.shakePower,
      );
      shake.multiplyScalar(this.shakeScale);
      this.camera.position.add(shake);
      this.shakePower *= Math.max(0, 1 - dt * 5);
    }

    this.camera.lookAt(this.lookAt);
    this.camera.fov = damp(this.camera.fov, this.baseFov + speedRatio * 10 + (target.empTimer > 0 ? -3 : 0), 7, dt);
    this.camera.updateProjectionMatrix();
  }

  updateMenuOrbit(dt, elapsed) {
    const radius = 118;
    const angle = elapsed * 0.07;
    const desired = new THREE.Vector3(Math.sin(angle) * radius, 68, Math.cos(angle) * radius);
    this.camera.position.lerp(desired, 1 - Math.exp(-1.8 * dt));
    this.camera.lookAt(0, 12, 0);
    this.camera.fov = damp(this.camera.fov, 54, 3, dt);
    this.camera.updateProjectionMatrix();
  }
}
