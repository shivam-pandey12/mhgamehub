import * as THREE from 'three';
import { GAME_CONFIG } from './config';
import { expDecay, smoothstep } from './math';
import type { PlayerSnapshot } from './types';

export class CameraController {
  private readonly desiredPosition = new THREE.Vector3();
  private readonly desiredTarget = new THREE.Vector3();
  private readonly currentTarget = new THREE.Vector3();
  private readonly shakeOffset = new THREE.Vector3();
  private introTimer = 2.8;
  private cinematicTimer = 0;
  private fovImpulse = 0;
  private roll = 0;
  private shakeEnabled = true;

  constructor(private readonly camera: THREE.PerspectiveCamera) {
    this.camera.fov = GAME_CONFIG.camera.fov;
    this.camera.near = 0.1;
    this.camera.far = 520;
    this.camera.updateProjectionMatrix();
  }

  update(dt: number, snapshot: PlayerSnapshot, shakeAmount: number): void {
    if (this.introTimer > 0) {
      this.updateIntro(dt, snapshot);
      return;
    }

    const jumpBlend = snapshot.grounded ? 0 : 1;
    const lateralOffset = THREE.MathUtils.clamp(snapshot.lateralVelocity / 6, -1, 1) * 0.55;
    const offset = GAME_CONFIG.camera.baseOffset
      .clone()
      .addScaledVector(GAME_CONFIG.camera.jumpOffset, jumpBlend)
      .add(new THREE.Vector3(lateralOffset, 0, 0));

    if (this.cinematicTimer > 0) {
      this.cinematicTimer = Math.max(0, this.cinematicTimer - dt);
      const t = this.cinematicTimer;
      offset.x += Math.sin(t * 4.2) * 1.1;
      offset.y += 0.55;
      offset.z -= 1.2;
    }

    this.desiredPosition.copy(snapshot.position).add(offset);
    this.desiredTarget
      .copy(snapshot.position)
      .add(new THREE.Vector3(lateralOffset * 0.35, 1.45 + jumpBlend * 0.26, GAME_CONFIG.camera.lookAhead));

    this.camera.position.lerp(this.desiredPosition, 1 - Math.exp(-GAME_CONFIG.camera.followSharpness * dt));
    this.currentTarget.lerp(this.desiredTarget, 1 - Math.exp(-GAME_CONFIG.camera.lookSharpness * dt));

    this.applyShake(this.shakeEnabled ? shakeAmount : 0);
    this.camera.position.add(this.shakeOffset);
    this.camera.lookAt(this.currentTarget);

    this.roll = expDecay(this.roll, -snapshot.lateralVelocity * 0.012 + shakeAmount * 0.02, 7.5, dt);
    this.camera.rotateZ(this.roll);

    const baseFov = THREE.MathUtils.clamp(
      GAME_CONFIG.camera.fov + (snapshot.forwardSpeed - GAME_CONFIG.player.baseForwardSpeed) * 1.25 + (snapshot.grounded ? 0 : 2.2),
      GAME_CONFIG.camera.minFov,
      GAME_CONFIG.camera.maxFov
    );
    const targetFov = THREE.MathUtils.clamp(
      baseFov + this.fovImpulse,
      GAME_CONFIG.camera.minFov,
      GAME_CONFIG.camera.maxFov + this.fovImpulse
    );
    this.camera.fov = expDecay(this.camera.fov, targetFov, 4.8, dt);
    this.fovImpulse = Math.max(0, this.fovImpulse - dt * 16);
    this.camera.updateProjectionMatrix();
  }

  skipIntro(): void {
    this.introTimer = 0;
  }

  get isIntro(): boolean {
    return this.introTimer > 0;
  }

  resize(width: number, height: number): void {
    this.camera.aspect = width / Math.max(1, height);
    this.camera.updateProjectionMatrix();
  }

  triggerCinematic(duration = 2.2): void {
    this.cinematicTimer = Math.max(this.cinematicTimer, duration);
  }

  addFovImpulse(amount = 5): void {
    this.fovImpulse = Math.max(this.fovImpulse, amount);
  }

  setShakeEnabled(enabled: boolean): void {
    this.shakeEnabled = enabled;
  }

  private updateIntro(dt: number, snapshot: PlayerSnapshot): void {
    this.introTimer = Math.max(0, this.introTimer - dt);
    const progress = smoothstep(0, 1, 1 - this.introTimer / 2.8);
    const angle = THREE.MathUtils.lerp(-1.4, 0.05, progress);
    const radius = THREE.MathUtils.lerp(18, 9.6, progress);
    const height = THREE.MathUtils.lerp(6.8, 4.95, progress);
    const target = snapshot.position.clone().add(new THREE.Vector3(0, 1.6, 6.6));

    this.camera.position.set(
      snapshot.position.x + Math.sin(angle) * radius,
      snapshot.position.y + height,
      snapshot.position.z + Math.cos(angle) * -radius
    );
    this.currentTarget.copy(target);
    this.camera.lookAt(target);
    this.camera.fov = THREE.MathUtils.lerp(65, GAME_CONFIG.camera.fov, progress);
    this.camera.updateProjectionMatrix();
  }

  private applyShake(amount: number): void {
    if (amount <= 0) {
      this.shakeOffset.set(0, 0, 0);
      return;
    }

    this.shakeOffset.set(
      THREE.MathUtils.randFloatSpread(0.16) * amount,
      THREE.MathUtils.randFloatSpread(0.1) * amount,
      THREE.MathUtils.randFloatSpread(0.12) * amount
    );
  }
}
