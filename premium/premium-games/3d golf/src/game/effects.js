import * as THREE from 'three';

export class EffectsManager {
  constructor(scene, getHeight, materials) {
    this.scene = scene;
    this.getHeight = getHeight;
    this.materials = materials;
    this.effects = [];
    this.trailPoints = [];
    this.maxTrailPoints = 34;
    this.trailPositions = new Float32Array(this.maxTrailPoints * 3);
    this.trailGeometry = new THREE.BufferGeometry();
    this.trailGeometry.setAttribute('position', new THREE.BufferAttribute(this.trailPositions, 3));
    this.trailGeometry.setDrawRange(0, 0);
    this.trailLine = new THREE.Line(this.trailGeometry, materials.trail);
    this.trailLine.visible = false;
    this.scene.add(this.trailLine);
    this.particleScale = 1;
  }

  setQuality({ trailSamples = 34, particles = 1 } = {}) {
    this.particleScale = Math.max(0.2, Math.min(1, particles));
    const nextMax = Math.max(8, Math.floor(trailSamples));
    if (nextMax === this.maxTrailPoints) return;
    this.maxTrailPoints = nextMax;
    this.trailPoints.length = Math.min(this.trailPoints.length, this.maxTrailPoints);
    this.trailGeometry.dispose();
    this.trailPositions = new Float32Array(this.maxTrailPoints * 3);
    this.trailGeometry = new THREE.BufferGeometry();
    this.trailGeometry.setAttribute('position', new THREE.BufferAttribute(this.trailPositions, 3));
    this.trailGeometry.setDrawRange(0, 0);
    this.trailLine.geometry = this.trailGeometry;
  }

  dispose() {
    for (const effect of this.effects) {
      this.scene.remove(effect.mesh);
      effect.mesh.geometry?.dispose();
      effect.mesh.material?.dispose();
    }
    this.effects = [];
    this.clearTrail();
    this.trailLine.geometry?.dispose();
    this.scene.remove(this.trailLine);
  }

  clearTrail() {
    this.trailPoints = [];
    this.trailLine.visible = false;
    this.trailLine.geometry.setDrawRange(0, 0);
  }

  pulse(x, z, color, scale = 0.4, maxLife = 0.58) {
    const y = this.getHeight(x, z) + 0.08;
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(new THREE.RingGeometry(0.08, 0.13, 32), material);
    mesh.position.set(x, y, z);
    mesh.rotation.x = Math.PI / 2;
    mesh.scale.setScalar(scale);
    this.scene.add(mesh);
    this.effects.push({ mesh, life: 0, maxLife, startScale: scale, kind: 'pulse' });
  }

  dust(x, z) {
    const count = Math.max(1, Math.round(5 * this.particleScale));
    for (let i = 0; i < count; i += 1) {
      const material = new THREE.MeshBasicMaterial({ color: 0xd9bd87, transparent: true, opacity: 0.32, depthWrite: false });
      const mesh = new THREE.Mesh(new THREE.CircleGeometry(0.05 + Math.random() * 0.035, 12), material);
      mesh.position.set(x + (Math.random() - 0.5) * 0.35, this.getHeight(x, z) + 0.11, z + (Math.random() - 0.5) * 0.35);
      mesh.rotation.x = Math.PI / 2;
      this.scene.add(mesh);
      this.effects.push({ mesh, life: 0, maxLife: 0.48, startScale: 0.7 + Math.random() * 0.4, kind: 'dust' });
    }
  }

  sparkles(x, z) {
    const count = Math.max(3, Math.round(9 * this.particleScale));
    for (let i = 0; i < count; i += 1) {
      const material = new THREE.MeshBasicMaterial({ color: 0xffe7ad, transparent: true, opacity: 0.8, depthWrite: false });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), material);
      mesh.position.set(x, this.getHeight(x, z) + 0.18, z);
      const angle = (i / count) * Math.PI * 2;
      const speed = 0.55 + Math.random() * 0.3;
      this.scene.add(mesh);
      this.effects.push({
        mesh,
        life: 0,
        maxLife: 0.72,
        velocity: new THREE.Vector3(Math.cos(angle) * speed, 0.45 + Math.random() * 0.25, Math.sin(angle) * speed),
        kind: 'sparkle'
      });
    }
  }

  updateTrail(position, speed, enabled) {
    if (!enabled || speed < 0.35) {
      this.trailLine.visible = false;
      return;
    }

    this.trailPoints.unshift({
      x: position.x,
      z: position.z,
      y: this.getHeight(position.x, position.z) + 0.11
    });
    this.trailPoints.length = Math.min(this.trailPoints.length, this.maxTrailPoints);
    const attribute = this.trailLine.geometry.getAttribute('position');
    for (let i = 0; i < this.trailPoints.length; i += 1) {
      const point = this.trailPoints[i];
      attribute.setXYZ(i, point.x, point.y, point.z);
    }
    attribute.needsUpdate = true;
    this.trailLine.geometry.setDrawRange(0, this.trailPoints.length);
    this.trailLine.visible = this.trailPoints.length > 3;
  }

  update(delta) {
    for (let i = this.effects.length - 1; i >= 0; i -= 1) {
      const effect = this.effects[i];
      effect.life += delta;
      const t = effect.life / effect.maxLife;

      if (effect.kind === 'sparkle') {
        effect.mesh.position.addScaledVector(effect.velocity, delta);
        effect.velocity.y -= delta * 1.4;
        effect.mesh.material.opacity = Math.max(0, 0.82 * (1 - t));
      } else {
        effect.mesh.scale.setScalar((effect.startScale ?? 1) * (1 + t * 2.8));
        effect.mesh.material.opacity = Math.max(0, 0.62 * (1 - t));
      }

      if (t >= 1) {
        this.scene.remove(effect.mesh);
        effect.mesh.geometry?.dispose();
        effect.mesh.material?.dispose();
        this.effects.splice(i, 1);
      }
    }
  }
}
