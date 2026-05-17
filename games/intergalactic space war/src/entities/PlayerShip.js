import * as THREE from "three";
import { playBoostSound, playEngineSound } from "../audio/placeholders.js";
import { Spaceship } from "./Spaceship.js";
import { WeaponSystem } from "../weapons/WeaponSystem.js";

const forwardVector = new THREE.Vector3();
const rightVector = new THREE.Vector3();
const upVector = new THREE.Vector3();
const accelerationVector = new THREE.Vector3();
const targetAngularVelocity = new THREE.Vector3();

export class PlayerShip extends Spaceship {
  constructor() {
    super();

    this.translationInput = new THREE.Vector3();
    this.rotationInput = new THREE.Vector3();
    this.maxSpeed = 34;
    this.baseMaxSpeed = 34;
    this.boostMaxSpeed = 52;
    this.forwardAcceleration = 42;
    this.reverseAcceleration = 32;
    this.strafeAcceleration = 20;
    this.verticalAcceleration = 22;
    this.linearDamping = 1.28;
    this.angularDamping = 3.9;
    this.pitchSpeed = 1.9;
    this.yawSpeed = 2.1;
    this.rollSpeed = 2.35;
    this.angularResponsiveness = 6.4;
    this.hasPlayedEngineSound = false;
    this.weaponSystem = new WeaponSystem({ ship: this });
    this.maxHealth = 120;
    this.health = this.maxHealth;
    this.collisionRadius = 1.4;
    this.boostVisualAmount = 0;
    this.wasBoosting = false;
    this.boostEnergyDrain = 15;
    this.isBoosting = false;
    this.updateCollisionBounds();
  }

  update(deltaTime, inputController, projectileSystem, { energySystem } = {}) {
    if (this.isDestroyed) {
      this.translationInput.set(0, 0, 0);
      this.rotationInput.set(0, 0, 0);
      this.isBoosting = false;
      super.update(deltaTime);
      return;
    }

    if (inputController) {
      this.translationInput.copy(inputController.getTranslationInput());
      this.rotationInput.copy(inputController.getRotationInput());
    } else {
      this.translationInput.set(0, 0, 0);
      this.rotationInput.set(0, 0, 0);
    }

    const wantsBoost = inputController?.isBoosting() ?? false;
    const isBoosting = wantsBoost && (!energySystem || energySystem.consumeRate(this.boostEnergyDrain, deltaTime));
    this.isBoosting = isBoosting;

    this.getForwardVector(forwardVector);
    this.getRightVector(rightVector);
    this.getUpVector(upVector);

    accelerationVector.set(0, 0, 0);
    accelerationVector.addScaledVector(rightVector, this.translationInput.x * this.strafeAcceleration);
    accelerationVector.addScaledVector(upVector, this.translationInput.y * this.verticalAcceleration);
    accelerationVector.addScaledVector(
      forwardVector,
      this.translationInput.z * (this.translationInput.z >= 0 ? this.forwardAcceleration : this.reverseAcceleration) * (isBoosting ? 1.32 : 1),
    );

    this.velocity.addScaledVector(accelerationVector, deltaTime);
    this.maxSpeed = isBoosting ? this.boostMaxSpeed : this.baseMaxSpeed;

    const speed = this.velocity.length();

    if (speed > this.maxSpeed) {
      this.velocity.setLength(this.maxSpeed);
    }

    targetAngularVelocity.set(
      this.rotationInput.x * this.pitchSpeed,
      this.rotationInput.y * this.yawSpeed,
      this.rotationInput.z * this.rollSpeed,
    );

    this.angularVelocity.x = THREE.MathUtils.damp(this.angularVelocity.x, targetAngularVelocity.x, this.angularResponsiveness, deltaTime);
    this.angularVelocity.y = THREE.MathUtils.damp(this.angularVelocity.y, targetAngularVelocity.y, this.angularResponsiveness, deltaTime);
    this.angularVelocity.z = THREE.MathUtils.damp(this.angularVelocity.z, targetAngularVelocity.z, this.angularResponsiveness, deltaTime);

    const targetBoostAmount = speed > 0.2
      ? THREE.MathUtils.clamp(speed / this.boostMaxSpeed + (isBoosting ? 0.22 : 0.08), 0, 1)
      : 0;
    this.boostVisualAmount = THREE.MathUtils.damp(this.boostVisualAmount, targetBoostAmount, 4.2, deltaTime);
    this.boostAmount = Math.max(this.boostAmount, this.boostVisualAmount * (isBoosting ? 0.88 : 0.46));

    this.tilt(this.translationInput.x * 0.24 - this.rotationInput.z * 0.36);

    this.attitudeOffset.x = -this.rotationInput.x * 0.09 - this.translationInput.y * 0.04;
    this.attitudeOffset.y = this.rotationInput.y * 0.05;
    this.attitudeOffset.z = -this.translationInput.x * 0.06 + this.rotationInput.z * 0.05;
    this.setWeaponModeOffset(this.rotationInput.y * 0.15);

    if (!this.hasPlayedEngineSound && this.translationInput.lengthSq() > 0) {
      playEngineSound();
      this.hasPlayedEngineSound = true;
    }

    if (isBoosting && this.boostVisualAmount > 0.78 && !this.wasBoosting) {
      playBoostSound();
      this.wasBoosting = true;
    }

    super.update(deltaTime);
    this.weaponSystem.update(deltaTime, inputController, projectileSystem, { energySystem });

    if (this.translationInput.lengthSq() === 0 && this.velocity.lengthSq() < 0.04) {
      this.hasPlayedEngineSound = false;
    }

    if (!isBoosting || this.boostVisualAmount < 0.28) {
      this.wasBoosting = false;
    }
  }

  respawn(position = new THREE.Vector3(0, 0, 0)) {
    this.restore({ position });
    this.hasPlayedEngineSound = false;
    this.boostVisualAmount = 0;
    this.wasBoosting = false;
    this.isBoosting = false;
  }

  getHealthRatio() {
    return this.health / this.maxHealth;
  }
}
