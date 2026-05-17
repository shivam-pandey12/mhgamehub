import * as THREE from 'three';
import { HANDLING } from '../config.js';
import { angleToVector, clamp, damp, shortestAngleDelta } from '../utils/math.js';

const ZERO_INPUT = {
  throttle: 0,
  brake: false,
  steer: 0,
  handbrake: false,
  nitro: false,
  primary: false,
  secondary: false,
  reset: false,
};

export class VehicleController {
  constructor({ visual, stats, type, id, isPlayer = false }) {
    this.id = id;
    this.type = type;
    this.faction = stats.faction;
    this.label = stats.label;
    this.group = visual.group;
    this.parts = visual.parts;
    this.length = visual.length;
    this.width = visual.width;
    this.stats = stats;
    this.isPlayer = isPlayer;
    this.maxHealth = stats.maxHealth;
    this.health = stats.maxHealth;
    this.velocity = new THREE.Vector3();
    this.yaw = 0;
    this.nitro = 100;
    this.primaryCooldown = 0;
    this.secondaryCooldown = 0;
    this.destroyed = false;
    this.respawnTimer = 0;
    this.empTimer = 0;
    this.skidTimer = 0;
    this.smokeTimer = 0;
    this.dustTimer = 0;
    this.isDrifting = false;
    this.isOffroad = false;
    this.lastCollisionDamageAt = 0;
    this.damageTakenMultiplier = 1;
    this.nitroRechargeMultiplier = 1;
    this.armorBoostTimer = 0;
    this.sputterTimer = 0;
    this.turretTargetYaw = 0;
    this.turretRecoil = 0;
    this.spawn = { position: new THREE.Vector3(), yaw: 0 };
  }

  setSpawn(position, yaw = 0) {
    this.spawn.position.copy(position);
    this.spawn.yaw = yaw;
    this.group.position.copy(position);
    this.group.position.y = 0;
    this.yaw = yaw;
    this.group.rotation.y = yaw;
    this.velocity.set(0, 0, 0);
  }

  respawn(position = this.spawn.position, yaw = this.spawn.yaw, healthRatio = 1) {
    this.destroyed = false;
    this.group.visible = true;
    this.respawnTimer = 0;
    this.health = Math.max(1, this.maxHealth * healthRatio);
    this.nitro = Math.max(this.nitro, 50);
    this.empTimer = 0;
    this.primaryCooldown = 0.25;
    this.secondaryCooldown = Math.min(this.secondaryCooldown, 2.5);
    this.setSpawn(position, yaw);
  }

  destroy() {
    this.destroyed = true;
    this.group.visible = false;
    this.velocity.set(0, 0, 0);
  }

  get speed() {
    return this.velocity.length();
  }

  get forwardSpeed() {
    return this.velocity.dot(this.getForward());
  }

  getForward() {
    return angleToVector(this.yaw);
  }

  getRight() {
    return new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
  }

  update(dt, input = ZERO_INPUT, city, effects, elapsed = 0) {
    this.primaryCooldown = Math.max(0, this.primaryCooldown - dt);
    this.secondaryCooldown = Math.max(0, this.secondaryCooldown - dt);
    this.empTimer = Math.max(0, this.empTimer - dt);
    this.armorBoostTimer = Math.max(0, this.armorBoostTimer - dt);
    if (this.destroyed) return;

    if (input.reset) this.resetToRoad(city);

    const forward = this.getForward();
    const right = this.getRight();
    const forwardSpeed = this.velocity.dot(forward);
    const onRoad = city.isOnRoad(this.group.position, 2);
    const slowFactor = this.empTimer > 0 ? 0.46 : 1;
    this.isOffroad = !onRoad;
    const terrainFactor = onRoad ? 1 : HANDLING.offroadSpeedMultiplier;
    const maxSpeed = this.stats.maxSpeed * slowFactor * terrainFactor * (input.nitro && this.nitro > 0 ? HANDLING.nitroMultiplier : 1);
    const reverseSpeed = this.stats.reverseSpeed * terrainFactor;
    const throttle = input.throttle;

    if (throttle > 0) {
      const speedCurve = 1 - clamp(Math.max(0, forwardSpeed) / (this.stats.maxSpeed * 1.18), 0, 0.55);
      this.velocity.addScaledVector(forward, this.stats.acceleration * speedCurve * (input.nitro && this.nitro > 0 ? 1.55 : 1) * dt);
    } else if (throttle < 0) {
      const force = forwardSpeed > 2 ? -this.stats.braking : -this.stats.acceleration * 0.62;
      this.velocity.addScaledVector(forward, force * dt);
    }

    if (input.nitro && this.nitro > 0 && forwardSpeed > 4) {
      this.nitro = Math.max(0, this.nitro - HANDLING.nitroBurnRate * dt);
      effects?.nitroFlame(this);
    } else {
      this.nitro = Math.min(100, this.nitro + (onRoad ? HANDLING.nitroRechargeRoad : HANDLING.nitroRechargeOffroad) * (this.nitroRechargeMultiplier || 1) * dt);
    }

    const speedRatio = clamp(Math.abs(forwardSpeed) / Math.max(8, this.stats.maxSpeed), 0, 1);
    const direction = forwardSpeed < -1 ? -1 : 1;
    const turnBoost = input.handbrake ? 1.35 : 1;
    const steerAuthority = HANDLING.steeringLowSpeedGrip + speedRatio * (input.handbrake ? 1.12 : 0.86);
    const criticalHandling = this.health / this.maxHealth < 0.2 ? 0.88 : 1;
    this.yaw += -input.steer * this.stats.handling * criticalHandling * steerAuthority * turnBoost * direction * dt;

    const lateralSpeed = this.velocity.dot(right);
    const grip = input.handbrake ? this.stats.driftGrip : this.stats.grip;
    this.velocity.addScaledVector(right, -lateralSpeed * clamp(grip * dt, 0, 1));

    if (!onRoad) {
      this.velocity.multiplyScalar(1 - Math.min(0.45, dt * 0.85));
    }

    const currentForwardSpeed = this.velocity.dot(forward);
    if (currentForwardSpeed > maxSpeed) {
      this.velocity.addScaledVector(forward, -(currentForwardSpeed - maxSpeed));
    } else if (currentForwardSpeed < -reverseSpeed) {
      this.velocity.addScaledVector(forward, -reverseSpeed - currentForwardSpeed);
    }

    const drag = input.throttle === 0 ? HANDLING.coastingDrag : HANDLING.throttleDrag;
    this.velocity.multiplyScalar(Math.max(0, 1 - drag * dt));
    if (this.velocity.lengthSq() < 0.0004) this.velocity.set(0, 0, 0);

    this.group.position.addScaledVector(this.velocity, dt);
    this.group.rotation.y = damp(this.group.rotation.y, this.yaw, 18, dt);

    this.updateVisuals(dt, input, lateralSpeed, elapsed, effects);
  }

  updateVisuals(dt, input, lateralSpeed, elapsed, effects) {
    const speed = this.forwardSpeed;
    for (const wheel of this.parts.wheels) {
      wheel.rotation.x += speed * dt * 1.9;
    }
    for (const wheelPivot of this.parts.frontWheels) {
      wheelPivot.rotation.y = damp(wheelPivot.rotation.y, input.steer * -0.42, 18, dt);
    }
    const bounce = Math.sin(elapsed * 14 + this.id.length) * clamp(Math.abs(speed) / 70, 0, 0.08);
    this.group.position.y = bounce;

    for (const brake of this.parts.brakeLights) {
      brake.scale.setScalar(input.brake || speed < -1 ? 1.35 : 1);
      brake.material.color.setHex(input.brake || speed < -1 ? 0xff3b45 : 0x7c0d17);
    }

    for (let i = 0; i < this.parts.sirens.length; i += 1) {
      const active = Math.sin(elapsed * 12 + i * Math.PI) > 0;
      this.parts.sirens[i].visible = active;
    }

    const isSkidding = input.handbrake || Math.abs(lateralSpeed) > 8.5;
    this.isDrifting = isSkidding && this.speed > HANDLING.driftSmokeSpeed;
    this.skidTimer -= dt;
    if (isSkidding && this.speed > 11 && this.skidTimer <= 0) {
      this.skidTimer = 0.08;
      const back = this.getForward().multiplyScalar(-this.length * 0.28);
      effects?.skid(this.group.position.clone().add(back), this.yaw, clamp(Math.abs(lateralSpeed) / 18, 0.35, 1));
      effects?.smoke(this.group.position.clone().add(back), 1, 0x7c7b76);
    }

    this.dustTimer -= dt;
    if (this.isOffroad && this.speed > HANDLING.dustSpeed && this.dustTimer <= 0) {
      this.dustTimer = 0.12;
      effects?.dust(this.group.position.clone().add(this.getForward().multiplyScalar(-this.length * 0.3)), 1);
    }

    this.smokeTimer -= dt;
    if (this.health / this.maxHealth < 0.4 && this.smokeTimer <= 0) {
      this.smokeTimer = this.health / this.maxHealth < 0.2 ? 0.11 : 0.24;
      const exhaust = this.group.position.clone().add(this.getForward().multiplyScalar(-this.length * 0.52));
      effects?.smoke(exhaust, this.health / this.maxHealth < 0.2 ? 2 : 1);
      if (this.health / this.maxHealth < 0.2) {
        effects?.spark(exhaust, 2, 0xff7a42);
      }
    }
    this.updateDamageVisuals();
    this.updateTurretVisuals(dt, input);
  }

  updateTurretVisuals(dt, input) {
    if (!this.parts.turrets?.length) return;
    if (input.weaponVector) {
      this.turretTargetYaw = Math.atan2(input.weaponVector.x || 0, input.weaponVector.z || 0);
    }
    const turnRate = clamp(dt * 11.5, 0, 1);
    for (const turret of this.parts.turrets) {
      turret.rotation.y += shortestAngleDelta(turret.rotation.y, this.turretTargetYaw || 0) * turnRate;
    }

    this.turretRecoil = Math.max(0, (this.turretRecoil || 0) - dt * 4.8);
    for (const barrel of this.parts.turretBarrels || []) {
      const restZ = barrel.userData.restZ ?? barrel.position.z;
      barrel.position.z = restZ - this.turretRecoil * 0.34;
    }
  }

  updateDamageVisuals() {
    const ratio = clamp(this.health / this.maxHealth, 0, 1);
    const damageOpacity = ratio < 0.7 ? clamp((0.7 - ratio) * 1.7, 0.12, 0.88) : 0;
    for (const panel of this.parts.damagePanels || []) {
      panel.material.opacity = damageOpacity;
    }
    for (const point of this.parts.firePoints || []) {
      point.visible = ratio < 0.22 && !this.destroyed;
      point.material.opacity = ratio < 0.22 ? 0.92 : 0;
    }
    for (const crack of this.parts.crackedGlass || []) {
      crack.material.opacity = ratio < 0.45 ? clamp((0.45 - ratio) * 1.9, 0.16, 0.7) : 0;
    }
    const flicker = ratio < 0.28 && Math.sin(performance.now() * 0.03 + this.id.length) > 0.2;
    for (const light of [...(this.parts.headlights || []), ...(this.parts.brakeLights || [])]) {
      if (ratio < 0.28) light.visible = flicker;
      else light.visible = true;
    }
  }

  updateHealthBar(camera, forceVisible = false) {
    if (!this.parts.healthBar) return;
    const ratio = clamp(this.health / this.maxHealth, 0, 1);
    this.parts.healthBar.visible = forceVisible && !this.destroyed && ratio > 0;
    this.parts.healthFill.scale.x = ratio;
    this.parts.healthFill.position.x = -(3.25 * (1 - ratio)) / 2;
    this.parts.healthFill.material.color.setHex(ratio < 0.25 ? 0xff3641 : ratio < 0.55 ? 0xffc247 : 0x39e58d);
    this.parts.healthBar.lookAt(camera.position);
  }

  applyDamage(amount) {
    const armorBoost = this.armorBoostTimer > 0 ? 0.72 : 1;
    const adjusted = amount * this.stats.armor * (this.damageTakenMultiplier || 1) * armorBoost;
    this.health = Math.max(0, this.health - adjusted);
    return adjusted;
  }

  applyImpulse(direction, strength) {
    this.velocity.addScaledVector(direction, strength / Math.max(0.8, this.stats.mass));
    this.velocity.multiplyScalar(0.94);
  }

  applyEmp(duration = 2.4) {
    this.empTimer = Math.max(this.empTimer, duration);
  }

  resetToRoad(city) {
    const waypoint = city.nearestWaypoint(this.group.position);
    const next = waypoint.neighbors[0];
    const yaw = next ? Math.atan2(next.position.x - waypoint.position.x, next.position.z - waypoint.position.z) : this.yaw;
    this.setSpawn(waypoint.position.clone(), yaw);
  }

  facePoint(point) {
    const delta = point.clone().sub(this.group.position);
    if (delta.lengthSq() < 0.001) return 0;
    const targetYaw = Math.atan2(delta.x, delta.z);
    return shortestAngleDelta(this.yaw, targetYaw);
  }
}
