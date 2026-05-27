import * as THREE from 'three';

export class ParticlePool {
  constructor({ parent, material, geometry, size = 36 }) {
    this.parent = parent;
    this.material = material;
    this.geometry = geometry;
    this.items = Array.from({ length: size }, (_, index) => {
      const mesh = new THREE.Mesh(geometry, material.clone());
      mesh.name = `pooled-vfx-particle-${index + 1}`;
      mesh.visible = false;
      mesh.renderOrder = 40;
      parent.add(mesh);
      return {
        mesh,
        velocity: new THREE.Vector3(),
        life: 0,
        maxLife: 1
      };
    });
  }

  emit({ position, color, count = 8, speed = 0.7, life = 0.55, scale = 1 }) {
    for (let index = 0; index < count; index += 1) {
      const item = this.items.find((candidate) => candidate.life <= 0);
      if (!item) {
        return;
      }

      const angle = Math.random() * Math.PI * 2;
      item.mesh.visible = true;
      item.mesh.position.copy(position);
      item.mesh.scale.setScalar(scale);
      item.mesh.material.color.set(color);
      item.velocity.set(
        Math.cos(angle) * speed * (0.35 + Math.random() * 0.65),
        0.24 + Math.random() * 0.34,
        Math.sin(angle) * speed * (0.35 + Math.random() * 0.65)
      );
      item.life = life;
      item.maxLife = life;
    }
  }

  update(delta) {
    this.items.forEach((item) => {
      if (item.life <= 0) {
        return;
      }
      item.life -= delta;
      const t = Math.max(item.life / item.maxLife, 0);
      item.mesh.position.addScaledVector(item.velocity, delta);
      item.mesh.scale.setScalar(t);
      item.mesh.material.opacity = 0.72 * t;
      item.mesh.visible = item.life > 0;
    });
  }

  clear() {
    this.items.forEach((item) => {
      item.life = 0;
      item.mesh.visible = false;
      item.mesh.material.opacity = 0;
    });
  }

  dispose() {
    this.items.forEach((item) => this.parent.remove(item.mesh));
    this.items.forEach((item) => item.mesh.material.dispose());
    this.geometry.dispose();
    this.material.dispose();
  }
}
