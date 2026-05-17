import * as THREE from "three";
import { playEnemyShootSound } from "../audio/placeholders.js";
import { ENEMY_WEAPON_DEFINITION } from "../weapons/enemyWeaponDefinition.js";
import { Spaceship } from "./Spaceship.js";

const ENEMY_ARCHETYPES = {
  "fast-attacker": {
    id: "fast-attacker",
    label: "Fast Attacker",
    bodyColor: 0x281721,
    wingColor: 0x3f2133,
    accentColor: 0xff8a89,
    glowColor: 0xff5d8a,
    explosionColor: 0xff8c84,
    explosionScale: 1,
    maxHealth: 38,
    collisionRadius: 1.16,
    scaleRange: [0.84, 0.94],
    maxSpeed: 14.8,
    accelerationForce: 17.4,
    preferredRange: 20,
    attackRange: 56,
    baseFireCooldown: 0.46,
    turnSpeed: 6.2,
    strafeAmplitude: 7.4,
    hoverAmplitude: 2.2,
    leadFactor: 0.08,
    retreatThreshold: 0.56,
    retreatForce: 4.5,
    aimNoiseX: 2.4,
    aimNoiseY: 1.6,
    weaponSway: 0.2,
    weaponDefinition: {
      ...ENEMY_WEAPON_DEFINITION,
      id: "enemy-needle",
      label: "Needler",
      firePattern: "alternating",
      cooldown: 0.56,
      projectileSpeed: 86,
      projectileLifetime: 3,
      projectileStyle: "rapid",
      projectileScale: [0.85, 0.85, 0.9],
      collisionRadius: 0.09,
      damage: 9,
      recoil: 0.05,
      weaponColor: 0xff97b2,
      glowColor: 0xff5d8a,
      trailOpacity: 0.22,
      trailLength: 1.08,
      impactScale: 0.58,
      cameraShake: 0.06,
    },
  },
  "heavy-tank": {
    id: "heavy-tank",
    label: "Heavy Tank",
    bodyColor: 0x2b231b,
    wingColor: 0x413226,
    accentColor: 0xffbf6b,
    glowColor: 0xff7d52,
    explosionColor: 0xffbb72,
    explosionScale: 1.55,
    maxHealth: 108,
    collisionRadius: 1.72,
    scaleRange: [1.2, 1.32],
    maxSpeed: 7.2,
    accelerationForce: 8.2,
    preferredRange: 30,
    attackRange: 74,
    baseFireCooldown: 1.18,
    turnSpeed: 3.2,
    strafeAmplitude: 2.4,
    hoverAmplitude: 1.35,
    leadFactor: 0.18,
    retreatThreshold: 0.48,
    retreatForce: 3.2,
    aimNoiseX: 0.85,
    aimNoiseY: 0.6,
    weaponSway: 0.1,
    weaponDefinition: {
      ...ENEMY_WEAPON_DEFINITION,
      id: "enemy-siege",
      label: "Siege Plasma",
      firePattern: "dual",
      cooldown: 1.48,
      projectileSpeed: 52,
      projectileLifetime: 4.2,
      projectileStyle: "plasma",
      projectileScale: [1.34, 1.34, 1.34],
      collisionRadius: 0.22,
      damage: 24,
      recoil: 0.2,
      weaponColor: 0xffcd7e,
      glowColor: 0xff8959,
      trailOpacity: 0.42,
      trailLength: 2.05,
      impactScale: 1.18,
      cameraShake: 0.12,
    },
  },
  shooter: {
    id: "shooter",
    label: "Shooter",
    bodyColor: 0x1b2332,
    wingColor: 0x25384a,
    accentColor: 0x7ec5ff,
    glowColor: 0x5d95ff,
    explosionColor: 0x86b9ff,
    explosionScale: 1.18,
    maxHealth: 56,
    collisionRadius: 1.32,
    scaleRange: [0.98, 1.08],
    maxSpeed: 9.5,
    accelerationForce: 11.4,
    preferredRange: 34,
    attackRange: 68,
    baseFireCooldown: 0.72,
    turnSpeed: 4.25,
    strafeAmplitude: 4.8,
    hoverAmplitude: 2.6,
    leadFactor: 0.2,
    retreatThreshold: 0.68,
    retreatForce: 5,
    aimNoiseX: 1.1,
    aimNoiseY: 0.9,
    weaponSway: 0.14,
    weaponDefinition: {
      ...ENEMY_WEAPON_DEFINITION,
      id: "enemy-lance",
      label: "Lance Beam",
      firePattern: "alternating",
      cooldown: 0.86,
      projectileSpeed: 72,
      projectileLifetime: 4,
      projectileStyle: "laser",
      projectileScale: [1, 1, 1],
      collisionRadius: 0.13,
      damage: 15,
      recoil: 0.1,
      weaponColor: 0x8cc2ff,
      glowColor: 0x6086ff,
      trailOpacity: 0.28,
      trailLength: 1.45,
      impactScale: 0.78,
      cameraShake: 0.08,
    },
  },
};

const FORWARD_VECTOR = new THREE.Vector3(0, 0, -1);
const desiredPosition = new THREE.Vector3();
const desiredDirection = new THREE.Vector3();
const aimPoint = new THREE.Vector3();
const aimNoise = new THREE.Vector3();
const toPlayer = new THREE.Vector3();
const toPlayerDirection = new THREE.Vector3();
const targetQuaternion = new THREE.Quaternion();
const playerForward = new THREE.Vector3();
const playerRight = new THREE.Vector3();
const playerUp = new THREE.Vector3();

export class EnemyShip extends Spaceship {
  constructor({
    spawnPosition = new THREE.Vector3(),
    archetypeId = "shooter",
  } = {}) {
    const archetype = ENEMY_ARCHETYPES[archetypeId] ?? ENEMY_ARCHETYPES.shooter;
    super({
      bodyColor: archetype.bodyColor,
      wingColor: archetype.wingColor,
      accentColor: archetype.accentColor,
      glowColor: archetype.glowColor,
    });

    this.archetype = archetype;
    this.typeId = archetype.id;
    this.typeLabel = archetype.label;
    this.group.position.copy(spawnPosition);
    this.group.scale.setScalar(THREE.MathUtils.randFloat(...archetype.scaleRange));

    this.maxHealth = archetype.maxHealth;
    this.health = this.maxHealth;
    this.collisionRadius = archetype.collisionRadius;
    this.maxSpeed = archetype.maxSpeed;
    this.accelerationForce = archetype.accelerationForce;
    this.preferredRange = archetype.preferredRange;
    this.attackRange = archetype.attackRange;
    this.baseFireCooldown = archetype.baseFireCooldown;
    this.fireCooldown = THREE.MathUtils.randFloat(0.05, Math.max(0.12, archetype.baseFireCooldown * 0.4));
    this.turnSpeed = archetype.turnSpeed;
    this.aiTime = Math.random() * 100;
    this.strafePhase = Math.random() * Math.PI * 2;
    this.hoverPhase = Math.random() * Math.PI * 2;
    this.aimPhase = Math.random() * Math.PI * 2;
    this.mountCycleIndex = Math.round(Math.random());
    this.weaponDefinition = archetype.weaponDefinition;
    this.explosionScale = archetype.explosionScale;
    this.scoreValue = Math.round(archetype.maxHealth * 8);
    this.healthReward = Math.max(8, Math.round(archetype.maxHealth * 0.16));
    this.patrolAnchor = spawnPosition.clone();
    this.visionRange = Math.max(this.attackRange * 1.7, this.preferredRange + 34);
    this.visionHalfAngle = THREE.MathUtils.degToRad(this.typeId === "heavy-tank" ? 38 : 46);

    this.addCombatArmor();
    this.addWeaponPods();
    this.updateCollisionBounds();
  }

  setPatrolAnchor(position) {
    this.patrolAnchor.copy(position);
  }

  addCombatArmor() {
    const armorMaterial = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: this.archetype.accentColor,
      emissive: this.archetype.glowColor,
      emissiveIntensity: 1.05,
      roughness: 0.24,
      metalness: 0.72,
    }));

    const dorsalFin = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.95, 1.05),
      armorMaterial,
    );
    dorsalFin.position.set(0, 0.72, 1.18);
    dorsalFin.rotation.x = -0.16;
    this.visualRoot.add(dorsalFin);

    if (this.typeId === "fast-attacker") {
      for (const side of [-1, 1]) {
        const spearWing = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 0.22, 1.7),
          armorMaterial,
        );
        spearWing.position.set(0.92 * side, 0.08, -0.8);
        spearWing.rotation.z = -0.4 * side;
        spearWing.rotation.y = 0.2 * side;
        this.visualRoot.add(spearWing);
      }
    } else if (this.typeId === "heavy-tank") {
      for (const side of [-1, 1]) {
        const shoulder = new THREE.Mesh(
          new THREE.BoxGeometry(0.4, 0.3, 1.2),
          armorMaterial,
        );
        shoulder.position.set(0.92 * side, 0.08, 0.35);
        shoulder.rotation.y = 0.08 * side;
        this.visualRoot.add(shoulder);
      }
    } else {
      for (const side of [-1, 1]) {
        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(0.18, 0.42, 1.45),
          armorMaterial,
        );
        blade.position.set(0.82 * side, 0.12, -0.58);
        blade.rotation.z = -0.32 * side;
        blade.rotation.y = 0.16 * side;
        this.visualRoot.add(blade);
      }
    }
  }

  addWeaponPods() {
    const podMaterial = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: 0x251820,
      emissive: 0x3b1d22,
      emissiveIntensity: 0.9,
      roughness: 0.4,
      metalness: 0.75,
    }));

    const muzzleMaterial = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: this.archetype.accentColor,
      emissive: this.archetype.glowColor,
      emissiveIntensity: 1.8,
      roughness: 0.12,
      metalness: 0.18,
    }));

    const barrelLength = this.typeId === "heavy-tank" ? 0.86 : 0.62;
    const muzzleScale = this.typeId === "heavy-tank" ? 1.45 : 1.05;

    for (const mount of [this.leftWeaponMount, this.rightWeaponMount]) {
      const pod = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.16, barrelLength),
        podMaterial,
      );
      pod.position.z = -0.28;
      mount.add(pod);

      const muzzle = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 12, 12),
        muzzleMaterial,
      );
      muzzle.position.z = -0.44 - barrelLength * 0.5;
      muzzle.scale.set(muzzleScale, muzzleScale, 1.25 * muzzleScale);
      mount.add(muzzle);
    }
  }

  getFiringMounts() {
    if (this.weaponDefinition.firePattern === "dual") {
      return [this.leftWeaponMount, this.rightWeaponMount];
    }

    const mount = this.mountCycleIndex % 2 === 0 ? this.leftWeaponMount : this.rightWeaponMount;
    this.mountCycleIndex += 1;
    return [mount];
  }

  update(deltaTime, { player, projectileSystem, perception } = {}) {
    if (this.isDestroyed || !player) {
      super.update(deltaTime);
      return;
    }

    this.aiTime += deltaTime;

    toPlayer.copy(player.position).sub(this.position);
    const distanceToPlayer = Math.max(toPlayer.length(), 0.001);
    toPlayerDirection.copy(toPlayer).normalize();

    const awarenessState = perception?.state ?? "alerted";
    const lastKnownTarget = perception?.lastKnownPosition ?? player.position;

    player.getForwardVector(playerForward);
    player.getRightVector(playerRight);
    player.getUpVector(playerUp);

    if (awarenessState === "idle") {
      desiredPosition.copy(this.patrolAnchor)
        .addScaledVector(playerRight, Math.sin(this.aiTime * 1.1 + this.strafePhase) * this.archetype.strafeAmplitude * 0.55)
        .addScaledVector(playerUp, Math.cos(this.aiTime * 0.9 + this.hoverPhase) * this.archetype.hoverAmplitude * 0.65);
      desiredDirection.copy(desiredPosition).sub(this.position);
    } else if (awarenessState === "suspicious") {
      desiredPosition.copy(lastKnownTarget)
        .addScaledVector(playerRight, Math.sin(this.aiTime * 1.25 + this.strafePhase) * this.archetype.strafeAmplitude * 0.42)
        .addScaledVector(playerUp, Math.cos(this.aiTime * 0.95 + this.hoverPhase) * this.archetype.hoverAmplitude * 0.55);
      desiredDirection.copy(desiredPosition).sub(this.position);

      if (distanceToPlayer > this.preferredRange * 0.85) {
        desiredDirection.addScaledVector(toPlayerDirection, 3.8);
      }
    } else {
      desiredPosition.copy(player.position)
        .addScaledVector(playerRight, Math.sin(this.aiTime * 1.45 + this.strafePhase) * this.archetype.strafeAmplitude)
        .addScaledVector(playerUp, Math.cos(this.aiTime * 1.12 + this.hoverPhase) * this.archetype.hoverAmplitude);

      desiredDirection.copy(desiredPosition).sub(this.position);

      if (distanceToPlayer > this.preferredRange) {
        desiredDirection.addScaledVector(
          toPlayerDirection,
          6.4 + Math.min(distanceToPlayer - this.preferredRange, 18) * 0.42,
        );
      } else if (distanceToPlayer < this.preferredRange * this.archetype.retreatThreshold) {
        desiredDirection.addScaledVector(toPlayerDirection, -this.archetype.retreatForce * 1.2);
      }
    }

    if (desiredDirection.lengthSq() > 0.001) {
      desiredDirection.normalize();
      const accelerationScale = awarenessState === "idle"
        ? 0.52
        : awarenessState === "suspicious"
          ? 0.72
          : 1;
      this.velocity.addScaledVector(desiredDirection, this.accelerationForce * accelerationScale * deltaTime);
    }

    const activeMaxSpeed = awarenessState === "idle"
      ? this.maxSpeed * 0.55
      : awarenessState === "suspicious"
        ? this.maxSpeed * 0.78
        : this.maxSpeed;

    if (this.velocity.length() > activeMaxSpeed) {
      this.velocity.setLength(activeMaxSpeed);
    }

    const strafeWave = Math.sin(this.aiTime * 1.75 + this.strafePhase);
    this.tilt(-strafeWave * 0.65);
    this.attitudeOffset.x = -this.velocity.y * 0.02;
    this.attitudeOffset.y = strafeWave * 0.045;
    this.attitudeOffset.z = this.velocity.x * 0.03;
    this.setWeaponModeOffset(Math.sin(this.aiTime * 1.1 + this.hoverPhase) * this.archetype.weaponSway);

    super.update(deltaTime);

    aimNoise.set(
      Math.sin(this.aiTime * 1.9 + this.aimPhase) * this.archetype.aimNoiseX,
      Math.cos(this.aiTime * 1.45 + this.aimPhase) * this.archetype.aimNoiseY,
      0,
    );

    aimPoint.copy(awarenessState === "alerted" ? player.position : lastKnownTarget)
      .addScaledVector(player.velocity, awarenessState === "alerted" ? this.archetype.leadFactor : this.archetype.leadFactor * 0.3)
      .add(aimNoise);

    desiredDirection.copy(aimPoint).sub(this.position).normalize();
    targetQuaternion.setFromUnitVectors(FORWARD_VECTOR, desiredDirection);
    this.group.quaternion.slerp(targetQuaternion, 1 - Math.exp(-this.turnSpeed * deltaTime));

    const canFireAtPlayer = awarenessState === "alerted"
      || (awarenessState === "suspicious" && perception?.canSeePlayer);
    const effectiveAttackRange = awarenessState === "suspicious"
      ? this.attackRange * 0.88
      : this.attackRange;

    if (canFireAtPlayer && !player.isDestroyed && distanceToPlayer <= effectiveAttackRange) {
      const cooldownStep = awarenessState === "alerted" ? deltaTime : deltaTime * 0.82;
      this.fireCooldown = Math.max(0, this.fireCooldown - cooldownStep);

      if (this.fireCooldown === 0 && projectileSystem) {
        for (const mount of this.getFiringMounts()) {
          projectileSystem.spawnProjectile({
            weaponDefinition: this.weaponDefinition,
            origin: mount,
            ownerVelocity: this.velocity,
            ownerTag: "enemy",
          });
        }

        this.triggerWeaponRecoil(this.weaponDefinition.recoil);
        const reactionDelay = awarenessState === "alerted" ? 1 : 1.18;
        this.fireCooldown = this.baseFireCooldown * reactionDelay + Math.random() * 0.24;
        playEnemyShootSound();
      }
    }
  }
}
