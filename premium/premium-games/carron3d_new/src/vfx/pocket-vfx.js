import * as THREE from 'three';
import { CARROM_BOARD } from '../config/carrom-constants.js';

export class PocketVFX {
  constructor({ parent, theme }) {
    this.parent = parent;
    this.theme = theme;
    this.effects = [];
    this.ringGeometry = new THREE.RingGeometry(0.18, 0.34, 64);
    this.ringMaterial = new THREE.MeshBasicMaterial({
      color: theme.scene.goldTrim,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      side: THREE.DoubleSide
    });
  }

  play(position, { queen = false, foul = false, reduced = false } = {}) {
    if (reduced) {
      return;
    }
    if (this.effects.length >= 8) {
      const oldest = this.effects.shift();
      this.parent.remove(oldest.mesh);
      oldest.mesh.material.dispose();
    }
    const ring = new THREE.Mesh(this.ringGeometry, this.ringMaterial.clone());
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(position.x, CARROM_BOARD.SURFACE_Y + 0.04, position.z);
    ring.renderOrder = 42;
    ring.material.color.set(foul ? this.theme.scene.queen : queen ? this.theme.scene.queenRim : this.theme.scene.goldTrim);
    this.parent.add(ring);
    this.effects.push({
      mesh: ring,
      life: queen ? 0.72 : 0.48,
      maxLife: queen ? 0.72 : 0.48,
      queen,
      foul
    });
  }

  update(delta) {
    this.effects = this.effects.filter((effect) => {
      effect.life -= delta;
      const t = Math.max(effect.life / effect.maxLife, 0);
      const scale = 1 + (1 - t) * (effect.queen ? 2.1 : 1.55);
      effect.mesh.scale.setScalar(scale);
      effect.mesh.material.opacity = 0.62 * t;
      if (effect.life > 0) {
        return true;
      }
      this.parent.remove(effect.mesh);
      effect.mesh.material.dispose();
      return false;
    });
  }

  applyTheme(theme) {
    this.theme = theme;
    this.ringMaterial.color.set(theme.scene.goldTrim);
  }

  clear() {
    this.effects.forEach((effect) => {
      this.parent.remove(effect.mesh);
      effect.mesh.material.dispose();
    });
    this.effects = [];
  }

  dispose() {
    this.clear();
    this.ringGeometry.dispose();
    this.ringMaterial.dispose();
  }
}
