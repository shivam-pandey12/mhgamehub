import * as THREE from "three";

const sharedFlashSphere = new THREE.SphereGeometry(0.16, 12, 12);
const sharedFlashRing = new THREE.TorusGeometry(0.32, 0.04, 8, 24);

class ImpactFlash {
  constructor({ position, color = 0xffffff, scale = 1 } = {}) {
    this.group = new THREE.Group();
    this.group.position.copy(position);
    this.duration = 0.28;
    this.life = 0;
    this.scale = scale;

    this.sphereMaterial = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 1,
      depthWrite: false,
    });

    this.ringMaterial = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });

    this.core = new THREE.Mesh(sharedFlashSphere, this.sphereMaterial);
    this.core.scale.setScalar(scale);
    this.group.add(this.core);

    this.ring = new THREE.Mesh(sharedFlashRing, this.ringMaterial);
    this.ring.rotation.x = Math.PI * 0.5;
    this.ring.scale.setScalar(scale * 0.65);
    this.group.add(this.ring);
  }

  update(deltaTime) {
    this.life += deltaTime;
    const progress = Math.min(this.life / this.duration, 1);

    this.core.scale.setScalar(this.scale * (1 + progress * 1.1));
    this.ring.scale.setScalar(this.scale * (0.65 + progress * 1.8));
    this.sphereMaterial.opacity = 1 - progress;
    this.ringMaterial.opacity = 0.95 - progress * 0.95;

    return progress < 1;
  }

  dispose() {
    this.sphereMaterial.dispose();
    this.ringMaterial.dispose();
  }
}

export class ImpactFlashSystem {
  constructor({ scene }) {
    this.scene = scene;
    this.flashes = [];
  }

  spawnImpactFlash({ position, color, scale } = {}) {
    const flash = new ImpactFlash({ position, color, scale });
    this.flashes.push(flash);
    this.scene.add(flash.group);
  }

  update(deltaTime) {
    for (let index = this.flashes.length - 1; index >= 0; index -= 1) {
      const flash = this.flashes[index];
      const isAlive = flash.update(deltaTime);

      if (!isAlive) {
        this.scene.remove(flash.group);
        flash.dispose();
        this.flashes.splice(index, 1);
      }
    }
  }

  dispose() {
    for (const flash of this.flashes) {
      this.scene.remove(flash.group);
      flash.dispose();
    }

    this.flashes.length = 0;
  }
}
