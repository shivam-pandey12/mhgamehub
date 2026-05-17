import * as THREE from 'three';
import { damp, lerp } from './math';
import type { PresentationMode, Vec3 } from './types';

export interface FinisherCameraState {
  active: boolean;
  player: Vec3;
  boss: Vec3;
  progress: number;
}

export interface CameraUpdateOptions {
  rageStrength: number;
  recoilKick: number;
  finisher: FinisherCameraState | null;
  presentationMode: PresentationMode;
  aspect: number;
}

export class ThirdPersonCamera {
  readonly perspectiveCamera: THREE.PerspectiveCamera;
  readonly orthographicCamera: THREE.OrthographicCamera;
  yaw = 0;
  pitch = 0;
  private readonly focus = new THREE.Vector3();
  private readonly desiredPosition = new THREE.Vector3();
  private readonly currentPosition = new THREE.Vector3();
  private readonly shakeOffset = new THREE.Vector3();
  private readonly finisherTarget = new THREE.Vector3();
  private shakeStrength = 0;
  private shakeMultiplier = 1;
  private recoil = 0;
  private cinematicBlend = 0;
  private idleDrift = 0;

  constructor(camera: THREE.PerspectiveCamera, orthographicCamera: THREE.OrthographicCamera) {
    this.perspectiveCamera = camera;
    this.orthographicCamera = orthographicCamera;
  }

  consumeMouse(): void {
    // Mouse look is intentionally disabled in the 2.5D fighter view.
  }

  addShake(amount: number): void {
    this.shakeStrength = Math.min(this.shakeStrength + amount, 1.2);
  }

  addRecoil(kick: number): void {
    this.recoil = Math.min(this.recoil + kick, 0.38);
  }

  getActiveCamera(presentationMode: PresentationMode): THREE.Camera {
    return presentationMode === '2d' ? this.orthographicCamera : this.perspectiveCamera;
  }

  snap(player: Vec3, opponent: Vec3): void {
    this.updateFrame(player, opponent, 0.016, { rageStrength: 0, recoilKick: 0, finisher: null, presentationMode: '2_5d', aspect: 16 / 9 }, true);
  }

  update(player: Vec3, opponent: Vec3, dt: number, options: CameraUpdateOptions): void {
    this.updateFrame(player, opponent, dt, options, false);
  }

  private updateFrame(
    player: Vec3,
    opponent: Vec3,
    dt: number,
    options: CameraUpdateOptions,
    snap: boolean,
  ): void {
    this.idleDrift += dt;
    this.recoil = damp(this.recoil, options.recoilKick, 14, dt);
    this.shakeMultiplier = damp(this.shakeMultiplier, 1 + options.rageStrength * 0.5, 8, dt);
    this.cinematicBlend = damp(this.cinematicBlend, options.finisher?.active ? 1 : 0, 7, dt);

    const midX = (player.x + opponent.x) * 0.5;
    const midY = Math.max(player.y, opponent.y) + 1.25;
    const separation = Math.abs(opponent.x - player.x);
    const distance = 8.8 + separation * 0.55;

    const baseFocus = new THREE.Vector3(midX, midY, 0);
    const depthDrift = options.presentationMode === '2d' ? 0 : Math.sin(this.idleDrift * 0.4) * 0.16;
    const basePosition = new THREE.Vector3(midX + depthDrift, 3.65 + Math.min(separation * 0.12, 0.85) + this.recoil * 0.45, distance + 2.4 + this.recoil * 1.25);

    this.focus.lerp(baseFocus, snap ? 1 : 1 - Math.exp(-10 * dt));
    this.desiredPosition.lerp(basePosition, snap ? 1 : 1 - Math.exp(-8 * dt));

    if (options.finisher?.active) {
      this.computeFinisherShot(options.finisher);
      this.focus.lerp(new THREE.Vector3(midX, lerp(baseFocus.y, opponent.y + 1.2, 0.8), 0), this.cinematicBlend * 0.9);
      this.desiredPosition.lerp(this.finisherTarget, this.cinematicBlend);
    }

    if (snap) {
      this.currentPosition.copy(this.desiredPosition);
    } else {
      this.currentPosition.x = damp(this.currentPosition.x, this.desiredPosition.x, 10.5, dt);
      this.currentPosition.y = damp(this.currentPosition.y, this.desiredPosition.y, 10.5, dt);
      this.currentPosition.z = damp(this.currentPosition.z, this.desiredPosition.z, 10.5, dt);
    }

    this.shakeStrength = damp(this.shakeStrength, 0, 16, dt);
    const shake = this.shakeStrength * this.shakeMultiplier;
    this.shakeOffset.set(
      (Math.random() - 0.5) * shake * 0.55,
      (Math.random() - 0.5) * shake * 0.45,
      (Math.random() - 0.5) * shake * 0.32,
    );

    const baseFov = options.finisher?.active ? 42 + Math.sin(options.finisher.progress * Math.PI) * 3 : 50;
    this.perspectiveCamera.fov = damp(this.perspectiveCamera.fov, baseFov + Math.min(separation * 0.8, 6), 10, dt);
    this.perspectiveCamera.updateProjectionMatrix();
    this.perspectiveCamera.position.copy(this.currentPosition).add(this.shakeOffset);
    this.perspectiveCamera.lookAt(this.focus);

    const orthoHeight = 4.2 + Math.min(separation * 0.22, 1.8) + (options.finisher?.active ? -0.45 : 0);
    const orthoWidth = orthoHeight * options.aspect;
    this.orthographicCamera.left = -orthoWidth;
    this.orthographicCamera.right = orthoWidth;
    this.orthographicCamera.top = orthoHeight;
    this.orthographicCamera.bottom = -orthoHeight;
    this.orthographicCamera.near = 0.1;
    this.orthographicCamera.far = 100;
    this.orthographicCamera.updateProjectionMatrix();
    this.orthographicCamera.position.set(this.currentPosition.x, this.currentPosition.y, 10.5).add(this.shakeOffset);
    this.orthographicCamera.lookAt(this.focus);
  }

  private computeFinisherShot(finisher: FinisherCameraState): void {
    const midX = (finisher.player.x + finisher.boss.x) * 0.5;
    const separation = Math.abs(finisher.boss.x - finisher.player.x);
    const zoom = 5.9 - Math.sin(finisher.progress * Math.PI) * 1.1;
    this.finisherTarget.set(
      midX,
      lerp(finisher.player.y, finisher.boss.y, 0.5) + 2.45,
      zoom + separation * 0.4,
    );
  }
}
