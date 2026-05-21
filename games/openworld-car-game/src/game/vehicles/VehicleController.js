import * as THREE from '../../vendor/three.js';
import { WORLD_CONFIG } from '../../config/city.js';
import { COLLISION_TUNING } from '../collision/CollisionSystem.js';
import { clamp, damp, headingToVector, inverseLerp, pointInRotatedRect } from '../utils/math.js';

const TEMP_FORWARD = new THREE.Vector3();
const TEMP_RIGHT = new THREE.Vector3();
const TEMP_POS = new THREE.Vector3();

export class VehicleController {
  constructor(mesh, config, cityBuilder, effectsManager, audioManager) {
    this.mesh = mesh;
    this.config = config;
    this.cityBuilder = cityBuilder;
    this.effectsManager = effectsManager;
    this.audioManager = audioManager;
    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.heading = 0;
    this.steerVisual = 0;
    this.wheelSpin = 0;
    this.boostEnergy = 1;
    this.exhaustTimer = 0;
    this.boostTimer = 0;
    this.dustTimer = 0;
    this.skidTimer = 0;
    this.collisionShake = 0;
    this.collisionCooldown = 0;
    this.roadBump = 0;
    this.payloadAccelerationMultiplier = 1;
    this.surfaceHeight = 0;
    this.currentSurfaceId = null;
    this.currentSurfaceInfo = null;
    this.lastCollision = { collided: false, count: 0, ids: [] };
    this.lastPosition = new THREE.Vector3();
    this.lastSafePosition = new THREE.Vector3();
    this.lastSafeHeading = 0;
    this.stuckTimer = 0;
    this.telemetry = this.createTelemetry();
  }

  createTelemetry() {
    return {
      speed: 0,
      speedKmh: 0,
      speedRatio: 0,
      forwardSpeed: 0,
      drifting: false,
      braking: false,
      boosting: false,
      offRoad: false,
      zoneName: 'Downtown Core',
      distanceTravelled: 0,
      driftScore: 0,
      collisionIntensity: 0,
      boostEnergy: 1,
      stuck: false,
      elevated: false,
      steeringVisual: 0,
      inputSteer: 0,
      inputThrottle: 0
    };
  }

  reset(position = [0, 0, 0], heading = 0, surfaceId = null) {
    this.position.set(position[0], 0, position[2] ?? position[1] ?? 0);
    this.velocity.set(0, 0, 0);
    this.heading = heading;
    this.steerVisual = 0;
    this.wheelSpin = 0;
    this.stuckTimer = 0;
    this.currentSurfaceId = surfaceId ?? this.currentSurfaceId;
    this.currentSurfaceInfo = this.cityBuilder.getSurfaceInfo(this.position, this.currentSurfaceId, { preferElevated: Boolean(surfaceId) });
    this.currentSurfaceId = this.currentSurfaceInfo.surfaceId;
    this.surfaceHeight = this.currentSurfaceInfo.surfaceHeight ?? 0;
    this.lastPosition.copy(this.position);
    this.lastSafePosition.copy(this.position);
    this.lastSafeHeading = heading;
    this.syncMesh();
  }

  setMissionModifiers(modifiers = {}) {
    this.payloadAccelerationMultiplier = modifiers.accelerationMultiplier ?? 1;
  }

  update(dt, input) {
    const physics = this.config.physics;
    let surface = this.cityBuilder.getSurfaceInfo(this.position, this.currentSurfaceId);
    this.currentSurfaceId = surface.surfaceId;
    const forward = headingToVector(this.heading);
    TEMP_FORWARD.copy(forward);
    TEMP_RIGHT.set(forward.z, 0, -forward.x);

    const forwardSpeed = this.velocity.dot(TEMP_FORWARD);
    const lateralSpeed = this.velocity.dot(TEMP_RIGHT);
    const speed = this.velocity.length();
    const movingDirection = Math.abs(forwardSpeed) > 0.7 ? Math.sign(forwardSpeed) : 1;
    const speedRatio = clamp(speed / physics.maxSpeed, 0, 1);
    const steerPower = (0.32 + speedRatio * 0.92) * (input.handbrake ? 1.22 : 1);
    this.heading += input.steer * physics.steerRate * steerPower * movingDirection * dt;

    let acceleration = 0;
    const braking = input.brake > 0 && forwardSpeed > 1.1;
    if (input.throttle > 0) acceleration += physics.acceleration * surface.accelerationFactor * this.payloadAccelerationMultiplier;
    if (input.brake > 0) {
      acceleration += braking ? -physics.braking : -physics.acceleration * 0.58;
    }

    const boosting = input.boost && input.throttle > 0 && this.boostEnergy > 0.02 && speed > 2;
    if (boosting) {
      acceleration += physics.boost;
      this.boostEnergy = clamp(this.boostEnergy - dt * 0.28, 0, 1);
      this.boostTimer -= dt;
      if (this.boostTimer <= 0) {
        this.spawnRearPuffs(true);
        this.boostTimer = 0.055;
      }
    } else {
      this.boostEnergy = clamp(this.boostEnergy + dt * 0.12, 0, 1);
    }

    this.velocity.addScaledVector(TEMP_FORWARD, acceleration * dt);

    const currentForward = this.velocity.dot(TEMP_FORWARD);
    const currentLateral = this.velocity.dot(TEMP_RIGHT);
    const targetGrip = (input.handbrake ? physics.driftGrip : physics.grip) * surface.gripFactor;
    const lateralAfterGrip = damp(currentLateral, 0, targetGrip, dt);
    this.velocity
      .copy(TEMP_FORWARD)
      .multiplyScalar(currentForward)
      .addScaledVector(TEMP_RIGHT, lateralAfterGrip);

    const drag = 0.34;
    this.velocity.multiplyScalar(Math.max(0, 1 - drag * dt));

    const maxForward = physics.maxSpeed * surface.speedFactor * (boosting ? 1.12 : 1);
    const maxReverse = physics.reverseSpeed;
    const clampedForward = clamp(this.velocity.dot(TEMP_FORWARD), -maxReverse, maxForward);
    const clampedLateral = clamp(this.velocity.dot(TEMP_RIGHT), -maxForward * 0.36, maxForward * 0.36);
    this.velocity
      .copy(TEMP_FORWARD)
      .multiplyScalar(clampedForward)
      .addScaledVector(TEMP_RIGHT, clampedLateral);

    this.lastPosition.copy(this.position);
    this.position.addScaledVector(this.velocity, dt);
    this.resolveWorldBounds();
    this.lastCollision = this.cityBuilder.collisionSystem?.resolvePlayer(this, dt) ?? { collided: false, count: 0, ids: [] };
    surface = this.cityBuilder.getSurfaceInfo(this.position, this.currentSurfaceId);
    this.currentSurfaceId = surface.surfaceId;
    this.currentSurfaceInfo = surface;
    this.surfaceHeight = damp(this.surfaceHeight, surface.surfaceHeight ?? 0, 9.5, dt);
    const distanceTravelled = this.lastPosition.distanceTo(this.position);

    const driftAmount = Math.abs(clampedLateral) * inverseLerp(6, 18, speed);
    const drifting = (input.handbrake || driftAmount > 3.5) && speed > 7;
    const driftScore = drifting ? driftAmount * dt * 9 : 0;

    if (distanceTravelled < 0.06 && (input.throttle > 0 || input.brake > 0)) {
      this.stuckTimer += dt;
    } else {
      this.stuckTimer = Math.max(0, this.stuckTimer - dt * 1.4);
    }

    this.exhaustTimer -= dt;
    this.dustTimer -= dt;
    this.skidTimer -= dt;
    if ((input.throttle > 0 || speed > 6) && this.exhaustTimer <= 0) {
      this.spawnRearPuffs(false);
      this.exhaustTimer = input.throttle > 0 ? 0.22 : 0.42;
    }
    if (surface.offRoad && speed > 5 && this.dustTimer <= 0) {
      this.spawnRearDust();
      this.dustTimer = 0.12;
    }
    if (drifting && this.skidTimer <= 0) {
      this.spawnSkidMarks();
      this.skidTimer = 0.16;
    }

    this.updateVisuals(dt, input, input.brake > 0, boosting, speed, clampedForward);
    this.collisionShake = Math.max(0, this.collisionShake - dt * 2.4);
    this.collisionCooldown = Math.max(0, this.collisionCooldown - dt);
    this.syncMesh();

    if (!this.lastCollision.collided && speed < physics.maxSpeed * 1.05) {
      this.lastSafePosition.copy(this.position);
      this.lastSafeHeading = this.heading;
    }

    this.telemetry = {
      speed,
      speedKmh: Math.round(speed * 6.2),
      speedRatio,
      forwardSpeed: clampedForward,
      drifting,
      braking,
      boosting,
      offRoad: surface.offRoad,
      zoneName: surface.zoneName,
      distanceTravelled,
      driftScore,
      collisionIntensity: this.collisionShake,
      boostEnergy: this.boostEnergy,
      stuck: this.stuckTimer > 2.5,
      surfaceId: surface.surfaceId,
      surfaceType: surface.surfaceType,
      surfaceHeight: surface.surfaceHeight,
      elevated: Boolean(surface.elevated),
      collisionCount: this.lastCollision.count,
      steeringVisual: this.steerVisual,
      inputSteer: input.steer,
      inputThrottle: input.throttle
    };

    this.audioManager.updateEngine(speedRatio, input.throttle > 0, drifting, boosting, this.config);
    return this.telemetry;
  }

  updateVisuals(dt, input, braking, boosting, speed, forwardSpeed) {
    const visual = this.config.visual;
    this.steerVisual = damp(this.steerVisual, input.steer * 0.46, 10, dt);
    this.wheelSpin += forwardSpeed * dt / Math.max(0.1, visual.wheelRadius);
    const root = this.mesh.userData.root;
    if (root) {
      root.position.y = this.roadBump;
      root.rotation.z = damp(root.rotation.z, -input.steer * clamp(speed / 45, 0, 1) * 0.045, 8, dt);
      root.rotation.x = damp(root.rotation.x, braking ? -0.035 : input.throttle ? 0.018 : 0, 7, dt);
    }
    this.roadBump = damp(this.roadBump, 0, 8, dt);

    this.mesh.userData.frontWheels?.forEach((wheel) => {
      wheel.rotation.y = this.steerVisual;
    });
    this.mesh.userData.wheels?.forEach((wheel) => {
      wheel.tire.rotation.x = this.wheelSpin;
    });
    this.mesh.userData.brakeLights?.forEach((light) => {
      light.material.emissiveIntensity = braking ? 1.45 : 0.12;
    });
  }

  syncMesh() {
    this.mesh.position.copy(this.position);
    this.mesh.position.y = this.surfaceHeight;
    this.mesh.rotation.y = this.heading;
  }

  getWorldPosition(target = new THREE.Vector3()) {
    return target.copy(this.mesh.position);
  }

  spawnRearPuffs(boost) {
    this.mesh.userData.exhausts?.forEach((exhaust) => {
      exhaust.getWorldPosition(TEMP_POS);
      this.effectsManager.spawnPuff(TEMP_POS, {
        boost,
        color: boost ? this.mesh.userData.boostTrailColor : null,
        size: boost ? 0.85 : 0.62,
        life: boost ? 0.32 : 0.68
      });
    });
  }

  spawnRearDust() {
    this.mesh.userData.wheels?.forEach((wheel) => {
      if (wheel.axle < 0) {
        wheel.pivot.getWorldPosition(TEMP_POS);
        this.effectsManager.spawnDust(TEMP_POS);
      }
    });
  }

  spawnSkidMarks() {
    this.mesh.userData.wheels?.forEach((wheel) => {
      if (Math.abs(wheel.axle) > 0) {
        wheel.pivot.getWorldPosition(TEMP_POS);
        this.effectsManager.spawnSkid(TEMP_POS, this.heading);
      }
    });
  }

  applyCollision(otherPosition, intensity = 1) {
    const away = this.position.clone().sub(otherPosition);
    if (away.lengthSq() < 0.0001) away.set(1, 0, 0);
    away.normalize();
    const force = (5 + intensity * 8) / this.config.physics.mass;
    this.velocity.addScaledVector(away, force);
    this.velocity.multiplyScalar(0.58);
    this.collisionShake = clamp(this.collisionShake + intensity, 0, 1.5);
    if (intensity > 0.65) this.effectsManager.spawnSparks(this.position);
    this.audioManager.play('crash', clamp(intensity, 0.3, 1));
  }

  registerCollisionImpact(intensity = 0.45, colliderId = 'static', dt = 0.016, options = {}) {
    this.collisionShake = clamp(this.collisionShake + intensity * 0.55, 0, 1.5);
    if (this.collisionCooldown <= 0) {
      if (!options.quiet && intensity > 0.45) this.effectsManager.spawnSparks(this.position);
      if (!options.quiet) this.audioManager.play('crash', clamp(intensity, 0.25, 0.95));
      this.collisionCooldown = 0.22 + dt;
    }
    this.lastCollision = {
      collided: true,
      count: Math.max(1, this.lastCollision?.count ?? 0),
      ids: [colliderId]
    };
  }

  registerLowSurfaceBump(amount = 0.1, dt = 0.016) {
    this.roadBump = Math.max(this.roadBump, Math.min(amount, COLLISION_TUNING.curbClimbHeight * 0.32));
    this.collisionShake = clamp(this.collisionShake + amount * 0.18, 0, 0.42);
    this.collisionCooldown = Math.max(this.collisionCooldown, dt);
  }

  getCollider() {
    const visual = this.config.visual;
    const height = visual.rideHeight + visual.height + 0.55;
    const collider = this.getColliderDimensions(visual);
    return {
      id: 'player',
      center: new THREE.Vector2(this.position.x, this.position.z),
      size: new THREE.Vector2(collider.width, collider.length),
      rotation: this.heading,
      yMin: this.surfaceHeight - 0.15,
      yMax: this.surfaceHeight + height
    };
  }

  getColliderDimensions(visual) {
    const byType = {
      hatchback: { width: 0.78, length: 0.82 },
      coupe: { width: 0.8, length: 0.84 },
      suv: { width: 0.82, length: 0.84 },
      supercar: { width: 0.83, length: 0.86 },
      jeep: { width: 0.84, length: 0.82 },
      classic: { width: 0.78, length: 0.88 }
    };
    const modifier = byType[visual.type] ?? { width: 0.8, length: 0.84 };
    return {
      width: Math.max(0.9, visual.width * modifier.width + COLLISION_TUNING.carColliderPadding),
      length: Math.max(1.8, visual.length * modifier.length + COLLISION_TUNING.carColliderPadding)
    };
  }

  isInsideParkingZone(zone) {
    const center = new THREE.Vector3(zone.center[0], 0, zone.center[1]);
    const size = new THREE.Vector3(zone.size[0], 0, zone.size[1]);
    return pointInRotatedRect(this.position, center, size, zone.rotation);
  }

  resolveWorldBounds() {
    const limit = WORLD_CONFIG.bounds;
    if (Math.abs(this.position.x) > limit || Math.abs(this.position.z) > limit) {
      this.position.x = clamp(this.position.x, -limit, limit);
      this.position.z = clamp(this.position.z, -limit, limit);
      this.velocity.multiplyScalar(0.38);
    }
  }
}
