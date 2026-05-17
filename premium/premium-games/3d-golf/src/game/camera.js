import * as THREE from 'three';
import { clamp } from './physics.js';

const desired = new THREE.Vector3();
const lookAt = new THREE.Vector3();
const direction = new THREE.Vector2();

export const CAMERA_MODES = ['follow', 'orbit', 'top', 'cinematic'];

export class CameraRig {
  constructor(mode = 'follow') {
    this.mode = CAMERA_MODES.includes(mode) ? mode : 'follow';
    this.orbitYaw = -0.55;
    this.orbitPitch = 0.74;
    this.orbitDistance = 9.4;
    this.shakeTime = 0;
    this.shakeStrength = 0;
  }

  setMode(mode) {
    this.mode = CAMERA_MODES.includes(mode) ? mode : 'follow';
  }

  nextMode() {
    const index = CAMERA_MODES.indexOf(this.mode);
    this.setMode(CAMERA_MODES[(index + 1) % CAMERA_MODES.length]);
    return this.mode;
  }

  addShake(strength) {
    this.shakeTime = Math.max(this.shakeTime, 0.28);
    this.shakeStrength = Math.max(this.shakeStrength, strength);
  }

  orbit(deltaYaw, deltaPitch) {
    this.orbitYaw += deltaYaw;
    this.orbitPitch = clamp(this.orbitPitch + deltaPitch, 0.36, 1.18);
  }

  update(camera, target, context, delta) {
    const smooth = 1 - Math.exp(-delta * (context.previewing ? 2.4 : 4.2));
    const ball = target.position;
    const velocity = context.velocity;
    direction.copy(context.aimDirection);
    if (velocity.lengthSq() > 0.05) direction.copy(velocity).normalize();

    if (context.previewing) {
      const intro = context.level.intro ?? {};
      const yaw = intro.yaw ?? -0.3;
      const distance = intro.distance ?? 14.5;
      desired.set(Math.sin(yaw) * distance * 0.45, 10.4, Math.cos(yaw) * -distance * 0.55);
      desired.x += context.level.platform.x;
      desired.z += context.level.platform.z;
      lookAt.set((context.level.start.x + context.level.hole.x) / 2, 0.3, (context.level.start.z + context.level.hole.z) / 2);
    } else if (this.mode === 'top') {
      desired.set(ball.x, 12.1, ball.z + 0.02);
      lookAt.set(ball.x, ball.y, ball.z);
    } else if (this.mode === 'orbit') {
      desired.set(
        ball.x + Math.sin(this.orbitYaw) * Math.cos(this.orbitPitch) * this.orbitDistance,
        ball.y + Math.sin(this.orbitPitch) * this.orbitDistance,
        ball.z + Math.cos(this.orbitYaw) * Math.cos(this.orbitPitch) * this.orbitDistance
      );
      lookAt.set(ball.x, ball.y + 0.15, ball.z);
    } else if (this.mode === 'cinematic') {
      desired.set(
        ball.x - direction.x * 5.4 + Math.sin(performance.now() * 0.00035) * 0.7,
        Math.max(4.5, ball.y + 4.7),
        ball.z - direction.y * 6.2
      );
      lookAt.set(ball.x + direction.x * 0.8, ball.y + 0.15, ball.z + direction.y * 0.8);
    } else {
      desired.set(ball.x - direction.x * 6.8, Math.max(4.6, ball.y + 5.35), ball.z - direction.y * 7.0);
      lookAt.set(ball.x, ball.y + 0.15, ball.z);
    }

    desired.x = clamp(desired.x, -7.2, 7.2);
    desired.y = Math.max(desired.y, 3.2);
    desired.z = clamp(desired.z, -12, 12);

    if (this.shakeTime > 0 && context.settings.cameraShake) {
      this.shakeTime = Math.max(0, this.shakeTime - delta);
      const amount = this.shakeStrength * (this.shakeTime / 0.28);
      desired.x += (Math.random() - 0.5) * amount;
      desired.y += (Math.random() - 0.5) * amount * 0.5;
      desired.z += (Math.random() - 0.5) * amount;
      if (this.shakeTime === 0) this.shakeStrength = 0;
    }

    camera.position.lerp(desired, smooth);
    camera.lookAt(lookAt);
  }
}
