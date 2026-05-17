import * as THREE from "three";
import { playExplosionSound } from "../audio/placeholders.js";

const sharedParticleGeometry = new THREE.IcosahedronGeometry(0.08, 0);

class ExplosionBurst {
  constructor({ position, color = 0xffae75, scale = 1 } = {}) {
    this.group = new THREE.Group();
    this.group.position.copy(position);
    this.duration = 0.65;
    this.life = 0;
    this.particles = [];
    this.baseScales = [];
    this.velocities = [];
    this.material = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 2.4,
      roughness: 0.22,
      metalness: 0.08,
      transparent: true,
      opacity: 1,
    });

    const particleCount = 12;

    for (let index = 0; index < particleCount; index += 1) {
      const particle = new THREE.Mesh(sharedParticleGeometry, this.material);
      const direction = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5,
      ).normalize();
      const particleScale = scale * THREE.MathUtils.randFloat(0.6, 1.45);

      particle.position.copy(direction).multiplyScalar(0.18 * scale);
      particle.scale.setScalar(particleScale);

      this.baseScales.push(particleScale);
      this.velocities.push(direction.multiplyScalar(THREE.MathUtils.randFloat(4, 10) * scale));
      this.particles.push(particle);
      this.group.add(particle);
    }
  }

  update(deltaTime) {
    this.life += deltaTime;
    const progress = Math.min(this.life / this.duration, 1);

    for (let index = 0; index < this.particles.length; index += 1) {
      const particle = this.particles[index];
      const velocity = this.velocities[index];
      const particleScale = this.baseScales[index] * (1 - progress * 0.82);

      particle.position.addScaledVector(velocity, deltaTime);
      particle.scale.setScalar(Math.max(0.001, particleScale));
    }

    this.group.scale.setScalar(1 + progress * 0.45);
    this.material.opacity = 1 - progress;
    this.material.emissiveIntensity = 2.4 * (1 - progress * 0.75);

    return progress < 1;
  }

  dispose() {
    this.material.dispose();
  }
}

export class ExplosionSystem {
  constructor({ scene }) {
    this.scene = scene;
    this.bursts = [];
  }

  spawnExplosion({ position, color, scale } = {}) {
    const burst = new ExplosionBurst({ position, color, scale });
    this.bursts.push(burst);
    this.scene.add(burst.group);
    playExplosionSound();
  }

  update(deltaTime) {
    for (let index = this.bursts.length - 1; index >= 0; index -= 1) {
      const burst = this.bursts[index];
      const isAlive = burst.update(deltaTime);

      if (!isAlive) {
        this.scene.remove(burst.group);
        burst.dispose();
        this.bursts.splice(index, 1);
      }
    }
  }

  dispose() {
    for (const burst of this.bursts) {
      this.scene.remove(burst.group);
      burst.dispose();
    }

    this.bursts.length = 0;
  }
}
