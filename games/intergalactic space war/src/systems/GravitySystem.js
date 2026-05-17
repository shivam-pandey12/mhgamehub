import * as THREE from "three";

const gravityDirection = new THREE.Vector3();
const planetToBody = new THREE.Vector3();

function createDebugHelper() {
  return new THREE.Mesh(
    new THREE.SphereGeometry(1, 18, 14),
    new THREE.MeshBasicMaterial({
      color: 0x7cb8ff,
      transparent: true,
      opacity: 0.08,
      wireframe: true,
      depthWrite: false,
    }),
  );
}

export class GravitySystem {
  constructor({ scene } = {}) {
    this.scene = scene;
    this.debugVisible = false;
    this.playerInfluence = 0;
    this.helperMap = new Map();
    this.group = new THREE.Group();
    this.group.name = "GravityDebug";
    this.group.visible = false;

    this.scene?.add(this.group);
  }

  setDebugVisible(isVisible) {
    this.debugVisible = isVisible;
    this.group.visible = isVisible;
  }

  update(deltaTime, {
    player,
    playerDeltaTime = deltaTime,
    enemies = [],
    projectiles = [],
    environmentManager,
  } = {}) {
    const planets = environmentManager?.planets ?? [];
    this.syncHelpers(planets);
    this.playerInfluence = 0;

    if (player && !player.isDestroyed) {
      this.playerInfluence = this.applyGravityToBody(player, planets, playerDeltaTime, 1);
    }

    for (const enemy of enemies) {
      if (!enemy.isDestroyed) {
        this.applyGravityToBody(enemy, planets, deltaTime, 0.72);
      }
    }

    for (const projectile of projectiles) {
      this.applyGravityToProjectile(projectile, planets, deltaTime, 0.18);
    }

    this.updateHelpers(planets, player);
  }

  syncHelpers(planets) {
    const livePlanets = new Set(planets);

    for (const planet of planets) {
      if (this.helperMap.has(planet)) {
        continue;
      }

      const helper = createDebugHelper();
      helper.position.copy(planet.group.position);
      helper.scale.setScalar(planet.gravityRadius);
      this.helperMap.set(planet, helper);
      this.group.add(helper);
    }

    for (const [planet, helper] of this.helperMap) {
      if (livePlanets.has(planet)) {
        continue;
      }

      this.group.remove(helper);
      helper.geometry.dispose();
      helper.material.dispose();
      this.helperMap.delete(planet);
    }
  }

  updateHelpers(planets, player) {
    this.group.visible = this.debugVisible;

    if (!this.debugVisible) {
      return;
    }

    for (const planet of planets) {
      const helper = this.helperMap.get(planet);

      if (!helper) {
        continue;
      }

      helper.position.copy(planet.group.position);
      helper.scale.setScalar(planet.gravityRadius);

      const opacity = player
        ? THREE.MathUtils.clamp(
          0.05 + Math.max(0, 1 - player.position.distanceTo(planet.position) / (planet.gravityRadius + 40)) * 0.18,
          0.05,
          0.2,
        )
        : 0.08;

      helper.material.opacity = opacity;
    }
  }

  applyGravityToBody(body, planets, deltaTime, influenceScale = 1) {
    let strongestInfluence = 0;

    for (const planet of planets) {
      const influence = this.computeInfluence(body.position, planet, body.collisionRadius ?? 0);

      if (!influence) {
        continue;
      }

      body.velocity.addScaledVector(
        influence.direction,
        influence.acceleration * influenceScale * deltaTime,
      );
      strongestInfluence = Math.max(strongestInfluence, influence.normalized);
    }

    return strongestInfluence;
  }

  applyGravityToProjectile(projectile, planets, deltaTime, influenceScale = 0.18) {
    for (const planet of planets) {
      const influence = this.computeInfluence(projectile.position, planet, projectile.radius ?? 0);

      if (!influence) {
        continue;
      }

      projectile.velocity.addScaledVector(
        influence.direction,
        influence.acceleration * influenceScale * deltaTime,
      );
    }
  }

  computeInfluence(position, planet, paddingRadius = 0) {
    planetToBody.copy(planet.position).sub(position);
    const distanceToCenter = planetToBody.length();
    const surfaceDistance = distanceToCenter - planet.radius - paddingRadius;

    if (surfaceDistance >= planet.gravityRadius || distanceToCenter <= 0.001) {
      return null;
    }

    const normalized = THREE.MathUtils.clamp(1 - surfaceDistance / planet.gravityRadius, 0, 1);
    const acceleration = planet.gravityStrength * normalized * normalized;
    gravityDirection.copy(planetToBody).normalize();

    return {
      direction: gravityDirection,
      normalized,
      acceleration,
    };
  }

  getPlayerInfluence() {
    return this.playerInfluence;
  }

  dispose() {
    for (const helper of this.helperMap.values()) {
      this.group.remove(helper);
      helper.geometry.dispose();
      helper.material.dispose();
    }

    this.helperMap.clear();
    this.scene?.remove(this.group);
  }
}
