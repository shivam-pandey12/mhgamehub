import * as THREE from "three";
import { Bullet } from "./Bullet.js";

const WORLD_FORWARD = new THREE.Vector3(0, 0, -1);
const DEFAULT_OWNER_VELOCITY = new THREE.Vector3();
const spawnPosition = new THREE.Vector3();
const worldQuaternion = new THREE.Quaternion();
const direction = new THREE.Vector3();

export class ProjectileSystem {
  constructor({ scene, maxProjectiles = 180 }) {
    this.scene = scene;
    this.maxProjectiles = maxProjectiles;
    this.projectiles = [];
    this.group = new THREE.Group();

    this.scene.add(this.group);
  }

  spawnProjectile({
    weaponDefinition,
    origin,
    ownerVelocity = DEFAULT_OWNER_VELOCITY,
    ownerTag = "player",
  }) {
    if (this.projectiles.length >= this.maxProjectiles) {
      this.removeProjectile(this.projectiles[0]);
    }

    origin.getWorldPosition(spawnPosition);
    origin.getWorldQuaternion(worldQuaternion);
    direction.copy(WORLD_FORWARD).applyQuaternion(worldQuaternion).normalize();
    spawnPosition.addScaledVector(direction, weaponDefinition.spawnOffset);

    const projectile = new Bullet({
      weaponDefinition,
      position: spawnPosition,
      direction,
      ownerVelocity,
      ownerTag,
    });

    this.projectiles.push(projectile);
    this.group.add(projectile.mesh);

    return projectile;
  }

  update(deltaTime) {
    for (let index = this.projectiles.length - 1; index >= 0; index -= 1) {
      const projectile = this.projectiles[index];
      const isAlive = projectile.update(deltaTime);

      if (!isAlive) {
        this.removeProjectile(projectile);
      }
    }
  }

  removeProjectile(projectile) {
    const projectileIndex = this.projectiles.indexOf(projectile);

    if (projectileIndex >= 0) {
      this.projectiles.splice(projectileIndex, 1);
    }

    this.group.remove(projectile.mesh);
    projectile.dispose();
  }

  removeProjectilesByOwnerTag(ownerTag) {
    for (let index = this.projectiles.length - 1; index >= 0; index -= 1) {
      const projectile = this.projectiles[index];

      if (projectile.ownerTag === ownerTag) {
        this.removeProjectile(projectile);
      }
    }
  }

  clear() {
    for (let index = this.projectiles.length - 1; index >= 0; index -= 1) {
      this.removeProjectile(this.projectiles[index]);
    }
  }

  dispose() {
    this.clear();
    this.scene.remove(this.group);
  }
}
