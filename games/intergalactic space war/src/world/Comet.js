import * as THREE from "three";

const forward = new THREE.Vector3();
const orientationForward = new THREE.Vector3(0, 0, 1);
const spawnDirection = new THREE.Vector3();
const travelDirection = new THREE.Vector3();

function disposeObjectResources(root) {
  const disposedMaterials = new Set();

  root.traverse((object) => {
    if (object.geometry) {
      object.geometry.dispose();
    }

    const materials = Array.isArray(object.material) ? object.material : [object.material];

    for (const material of materials) {
      if (material && !disposedMaterials.has(material)) {
        disposedMaterials.add(material);
        material.dispose();
      }
    }
  });
}

export class Comet {
  constructor({ anchor = new THREE.Vector3() } = {}) {
    this.group = new THREE.Group();
    this.velocity = new THREE.Vector3();
    this.rotationVelocity = new THREE.Vector3();
    this.anchor = anchor.clone();

    const nucleusMaterial = new THREE.MeshStandardMaterial({
      color: 0x7f8ca4,
      emissive: 0x1a2431,
      emissiveIntensity: 0.2,
      roughness: 0.88,
      metalness: 0.04,
    });

    const tailMaterial = new THREE.MeshStandardMaterial({
      color: 0xa6e0ff,
      emissive: 0x72c8ff,
      emissiveIntensity: 0.52,
      roughness: 0.14,
      metalness: 0.02,
      transparent: true,
      opacity: 0.32,
    });

    this.nucleus = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.9, 0),
      nucleusMaterial,
    );
    this.group.add(this.nucleus);

    this.tail = new THREE.Group();
    this.group.add(this.tail);

    for (let index = 0; index < 4; index += 1) {
      const tailNode = new THREE.Mesh(
        new THREE.SphereGeometry(0.42 - index * 0.07, 10, 10),
        tailMaterial,
      );
      tailNode.position.z = -0.7 - index * 0.55;
      tailNode.scale.set(1.2, 0.8, 1.6 + index * 0.25);
      this.tail.add(tailNode);
    }

    this.reset(anchor);
  }

  reset(anchor = this.anchor) {
    this.anchor.copy(anchor);

    spawnDirection.set(
      THREE.MathUtils.randFloatSpread(1),
      THREE.MathUtils.randFloatSpread(1),
      THREE.MathUtils.randFloatSpread(1),
    ).normalize();

    const spawnDistance = THREE.MathUtils.randFloat(110, 210);
    this.group.position.copy(anchor).addScaledVector(spawnDirection, spawnDistance);
    this.group.scale.setScalar(THREE.MathUtils.randFloat(0.7, 1.65));

    travelDirection.copy(spawnDirection).multiplyScalar(-1);
    travelDirection.x += THREE.MathUtils.randFloatSpread(0.35);
    travelDirection.y += THREE.MathUtils.randFloatSpread(0.35);
    travelDirection.z += THREE.MathUtils.randFloatSpread(0.35);
    travelDirection.normalize();

    this.velocity.copy(travelDirection).multiplyScalar(THREE.MathUtils.randFloat(18, 30));

    this.rotationVelocity.set(
      THREE.MathUtils.randFloatSpread(0.6),
      THREE.MathUtils.randFloatSpread(0.9),
      THREE.MathUtils.randFloatSpread(0.4),
    );

    this.updateOrientation();
  }

  updateOrientation() {
    forward.copy(this.velocity).normalize();
    this.group.quaternion.setFromUnitVectors(orientationForward, forward);
  }

  update(deltaTime, anchor) {
    this.group.position.addScaledVector(this.velocity, deltaTime);
    this.nucleus.rotation.x += this.rotationVelocity.x * deltaTime;
    this.nucleus.rotation.y += this.rotationVelocity.y * deltaTime;
    this.nucleus.rotation.z += this.rotationVelocity.z * deltaTime;

    if (this.group.position.distanceToSquared(anchor) > 260 ** 2) {
      this.reset(anchor);
    }
  }

  dispose() {
    disposeObjectResources(this.group);
  }
}
