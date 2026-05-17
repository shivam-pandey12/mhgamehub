import * as THREE from "three";

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

export class Planet {
  constructor({
    position = new THREE.Vector3(),
    radius = 6,
    color = 0x5d77ff,
    accentColor = 0x8db6ff,
    atmosphereColor = 0x7bc9ff,
    hasRing = false,
  } = {}) {
    this.group = new THREE.Group();
    this.radius = radius;
    this.collisionSphere = new THREE.Sphere(position.clone(), radius);
    this.gravityRadius = radius * 4.3 + 18;
    this.gravityStrength = 4.5 + radius * 0.62;
    this.rotationSpeed = THREE.MathUtils.randFloat(-0.12, 0.12);
    this.surfacePulse = Math.random() * Math.PI * 2;
    this.time = Math.random() * 100;

    this.group.position.copy(position);

    const planetMaterial = new THREE.MeshStandardMaterial({
      color,
      emissive: accentColor,
      emissiveIntensity: 0.18,
      roughness: 0.78,
      metalness: 0.08,
    });

    const atmosphereMaterial = new THREE.MeshStandardMaterial({
      color: atmosphereColor,
      emissive: atmosphereColor,
      emissiveIntensity: 0.35,
      roughness: 0.16,
      metalness: 0.02,
      transparent: true,
      opacity: 0.13,
      side: THREE.DoubleSide,
    });

    this.planetMesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 28, 22),
      planetMaterial,
    );
    this.planetMesh.userData.planet = this;
    this.group.add(this.planetMesh);

    this.atmosphereMesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 1.06, 24, 18),
      atmosphereMaterial,
    );
    this.group.add(this.atmosphereMesh);

    this.addSurfaceBands(accentColor);

    if (hasRing) {
      this.createRing(accentColor);
    }
  }

  get position() {
    return this.group.position;
  }

  addSurfaceBands(accentColor) {
    const bandMaterial = new THREE.MeshStandardMaterial({
      color: accentColor,
      emissive: accentColor,
      emissiveIntensity: 0.08,
      roughness: 0.68,
      metalness: 0.03,
      transparent: true,
      opacity: 0.26,
    });

    const band = new THREE.Mesh(
      new THREE.TorusGeometry(this.radius * 0.78, this.radius * 0.08, 12, 50),
      bandMaterial,
    );
    band.rotation.x = Math.PI * 0.45;
    band.rotation.y = Math.PI * 0.22;
    this.surfaceBand = band;
    this.group.add(band);
  }

  createRing(accentColor) {
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: accentColor,
      emissive: accentColor,
      emissiveIntensity: 0.16,
      roughness: 0.46,
      metalness: 0.04,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
    });

    this.ringMesh = new THREE.Mesh(
      new THREE.TorusGeometry(this.radius * 1.42, this.radius * 0.16, 4, 70),
      ringMaterial,
    );
    this.ringMesh.rotation.x = Math.PI * 0.5;
    this.ringMesh.rotation.y = Math.PI * THREE.MathUtils.randFloat(0.15, 0.45);
    this.group.add(this.ringMesh);
  }

  update(deltaTime) {
    this.time += deltaTime;
    this.planetMesh.rotation.y += this.rotationSpeed * deltaTime;
    this.planetMesh.rotation.z += this.rotationSpeed * 0.35 * deltaTime;
    this.surfaceBand.rotation.z += this.rotationSpeed * 0.6 * deltaTime;
    this.atmosphereMesh.scale.setScalar(1.06 + Math.sin(this.time * 0.75 + this.surfacePulse) * 0.005);

    if (this.ringMesh) {
      this.ringMesh.rotation.z += this.rotationSpeed * 0.2 * deltaTime;
    }
  }

  dispose() {
    disposeObjectResources(this.group);
  }
}
