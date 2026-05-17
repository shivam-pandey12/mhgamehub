import * as THREE from "three";

const rotatedPositionOffset = new THREE.Vector3();
const rotatedLookOffset = new THREE.Vector3();
const forwardVector = new THREE.Vector3();

export class FollowCamera {
  constructor(camera, player) {
    this.camera = camera;
    this.player = player;
    this.positionOffset = new THREE.Vector3(0, 2.6, 10.5);
    this.lookOffset = new THREE.Vector3(0, 0.4, -15);
    this.desiredPosition = new THREE.Vector3();
    this.lookTarget = new THREE.Vector3();
    this.shakeOffset = new THREE.Vector3();
    this.baseFov = camera.fov;
    this.shakeIntensity = 0;
    this.lastAppliedFov = camera.fov;
    this.timeDilationAmount = 0;
    this.gravityInfluence = 0;
  }

  update(deltaTime) {
    const playerPosition = this.player.group.position;
    const velocity = this.player.velocity;
    const shipQuaternion = this.player.group.quaternion;

    rotatedPositionOffset.copy(this.positionOffset).applyQuaternion(shipQuaternion);
    rotatedLookOffset.copy(this.lookOffset).applyQuaternion(shipQuaternion);
    this.player.getForwardVector(forwardVector);

    this.desiredPosition.copy(playerPosition).add(rotatedPositionOffset);
    this.desiredPosition.addScaledVector(velocity, -0.08);

    const cameraBlend = 1 - Math.exp(-2.55 * deltaTime);
    this.camera.position.lerp(this.desiredPosition, cameraBlend);

    this.lookTarget.copy(playerPosition)
      .add(rotatedLookOffset)
      .addScaledVector(forwardVector, 6.5)
      .addScaledVector(velocity, 0.04);

    this.shakeIntensity = THREE.MathUtils.damp(
      this.shakeIntensity,
      this.gravityInfluence * 0.08,
      10.5,
      deltaTime,
    );
    this.shakeOffset.set(
      THREE.MathUtils.randFloatSpread(1),
      THREE.MathUtils.randFloatSpread(1),
      THREE.MathUtils.randFloatSpread(1),
    ).multiplyScalar(this.shakeIntensity);

    this.camera.position.add(this.shakeOffset);

    const targetFov = this.baseFov
      - (this.player.boostVisualAmount ?? 0) * 3.3
      - this.timeDilationAmount * 4.4
      + this.gravityInfluence * 1.05
      + this.shakeIntensity * 1.2;
    this.camera.fov = THREE.MathUtils.damp(this.camera.fov, targetFov, 5.4, deltaTime);

    if (Math.abs(this.camera.fov - this.lastAppliedFov) > 0.01) {
      this.camera.updateProjectionMatrix();
      this.lastAppliedFov = this.camera.fov;
    }

    this.camera.lookAt(this.lookTarget.addScaledVector(this.shakeOffset, 0.18));
  }

  addShake(intensity = 0.12) {
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
  }

  setTimeDilation(amount = 0) {
    this.timeDilationAmount = amount;
  }

  setGravityInfluence(amount = 0) {
    this.gravityInfluence = amount;
  }
}
