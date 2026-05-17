import * as THREE from "three";

const LOCAL_FORWARD = new THREE.Vector3(0, 0, 1);
const SHARED_BULLET_RESOURCES = new Map();
const segment = new THREE.Vector3();
const toCenter = new THREE.Vector3();
const closestPoint = new THREE.Vector3();

function createResourceBundle(weaponDefinition) {
  let coreGeometry;
  let trailGeometry;
  let haloGeometry;

  if (weaponDefinition.projectileStyle === "plasma") {
    coreGeometry = new THREE.SphereGeometry(0.18, 14, 12);
    trailGeometry = new THREE.CylinderGeometry(0.17, 0.02, 1, 10);
    trailGeometry.rotateX(Math.PI * 0.5);
    haloGeometry = new THREE.SphereGeometry(0.24, 12, 12);
  } else if (weaponDefinition.projectileStyle === "rapid") {
    coreGeometry = new THREE.BoxGeometry(0.08, 0.08, 0.54);
    trailGeometry = new THREE.CylinderGeometry(0.08, 0.02, 1, 8);
    trailGeometry.rotateX(Math.PI * 0.5);
    haloGeometry = new THREE.SphereGeometry(0.11, 10, 10);
  } else if (weaponDefinition.projectileStyle === "enemy") {
    coreGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.82, 10);
    coreGeometry.rotateX(Math.PI * 0.5);
    trailGeometry = new THREE.CylinderGeometry(0.1, 0.03, 1, 10);
    trailGeometry.rotateX(Math.PI * 0.5);
    haloGeometry = new THREE.SphereGeometry(0.14, 12, 12);
  } else {
    coreGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.9, 10);
    coreGeometry.rotateX(Math.PI * 0.5);
    trailGeometry = new THREE.CylinderGeometry(0.08, 0.02, 1, 10);
    trailGeometry.rotateX(Math.PI * 0.5);
    haloGeometry = new THREE.SphereGeometry(0.12, 10, 10);
  }

  return {
    coreGeometry,
    trailGeometry,
    haloGeometry,
  };
}

function getSharedBulletResources(weaponDefinition) {
  if (!SHARED_BULLET_RESOURCES.has(weaponDefinition.id)) {
    SHARED_BULLET_RESOURCES.set(weaponDefinition.id, createResourceBundle(weaponDefinition));
  }

  return SHARED_BULLET_RESOURCES.get(weaponDefinition.id);
}

export class Bullet {
  constructor({
    weaponDefinition,
    position,
    direction,
    ownerVelocity,
    ownerTag = "player",
  }) {
    this.weaponId = weaponDefinition.id;
    this.ownerTag = ownerTag;
    this.damage = weaponDefinition.damage;
    this.radius = weaponDefinition.collisionRadius;
    this.age = 0;
    this.maxLifetime = weaponDefinition.projectileLifetime;
    this.impactColor = weaponDefinition.glowColor;
    this.impactScale = weaponDefinition.impactScale ?? 0.7;
    this.direction = direction.clone().normalize();
    this.position = position.clone();
    this.previousPosition = position.clone();
    this.velocity = this.direction.clone()
      .multiplyScalar(weaponDefinition.projectileSpeed)
      .addScaledVector(ownerVelocity, weaponDefinition.velocityInheritance);
    this.collisionSphere = new THREE.Sphere(this.position.clone(), this.radius);
    this.baseTrailLength = weaponDefinition.trailLength ?? 1.1;
    this.baseTrailOpacity = weaponDefinition.trailOpacity ?? 0.24;

    const resources = getSharedBulletResources(weaponDefinition);

    this.materials = {
      core: new THREE.MeshStandardMaterial({
        color: weaponDefinition.weaponColor,
        emissive: weaponDefinition.glowColor,
        emissiveIntensity: weaponDefinition.projectileStyle === "plasma" ? 2.35 : 1.9,
        roughness: weaponDefinition.projectileStyle === "plasma" ? 0.12 : 0.16,
        metalness: weaponDefinition.projectileStyle === "rapid" ? 0.22 : 0.08,
        transparent: true,
        opacity: 1,
      }),
      trail: new THREE.MeshBasicMaterial({
        color: weaponDefinition.glowColor,
        transparent: true,
        opacity: this.baseTrailOpacity,
        depthWrite: false,
      }),
      halo: new THREE.MeshBasicMaterial({
        color: weaponDefinition.weaponColor,
        transparent: true,
        opacity: 0.24,
        depthWrite: false,
      }),
    };

    this.mesh = new THREE.Group();
    this.coreMesh = new THREE.Mesh(resources.coreGeometry, this.materials.core);
    this.trailMesh = new THREE.Mesh(resources.trailGeometry, this.materials.trail);
    this.haloMesh = new THREE.Mesh(resources.haloGeometry, this.materials.halo);
    this.haloMesh.scale.setScalar(1.2);

    this.mesh.add(this.trailMesh);
    this.mesh.add(this.haloMesh);
    this.mesh.add(this.coreMesh);
    this.mesh.position.copy(this.position);
    this.mesh.quaternion.setFromUnitVectors(LOCAL_FORWARD, this.direction);
    this.coreMesh.scale.set(...weaponDefinition.projectileScale);
    this.updateVisuals();
  }

  update(deltaTime) {
    this.previousPosition.copy(this.position);
    this.position.addScaledVector(this.velocity, deltaTime);
    this.direction.copy(this.velocity).normalize();
    this.mesh.position.copy(this.position);
    this.mesh.quaternion.setFromUnitVectors(LOCAL_FORWARD, this.direction);
    this.collisionSphere.center.copy(this.position);
    this.age += deltaTime;
    this.updateVisuals();

    return this.age < this.maxLifetime;
  }

  updateVisuals() {
    const lifeRatio = 1 - this.age / this.maxLifetime;
    const speedRatio = THREE.MathUtils.clamp(this.velocity.length() / 80, 0.75, 1.65);
    const trailLength = this.baseTrailLength * speedRatio * (0.75 + lifeRatio * 0.35);

    this.trailMesh.scale.set(1, 1, trailLength);
    this.trailMesh.position.z = -0.28 - trailLength * 0.48;
    this.haloMesh.scale.setScalar(1 + (1 - lifeRatio) * 0.08 + this.radius * 2.8);

    this.materials.core.opacity = 0.72 + lifeRatio * 0.28;
    this.materials.trail.opacity = this.baseTrailOpacity * Math.max(0, lifeRatio);
    this.materials.halo.opacity = 0.14 + lifeRatio * 0.16;
  }

  intersectsSphere(targetSphere) {
    segment.copy(this.position).sub(this.previousPosition);

    if (segment.lengthSq() === 0) {
      return this.collisionSphere.intersectsSphere(targetSphere);
    }

    toCenter.copy(targetSphere.center).sub(this.previousPosition);
    const projection = THREE.MathUtils.clamp(
      toCenter.dot(segment) / segment.lengthSq(),
      0,
      1,
    );

    closestPoint.copy(this.previousPosition).addScaledVector(segment, projection);

    return closestPoint.distanceToSquared(targetSphere.center) <= (targetSphere.radius + this.radius) ** 2;
  }

  dispose() {
    this.materials.core.dispose();
    this.materials.trail.dispose();
    this.materials.halo.dispose();
  }
}
