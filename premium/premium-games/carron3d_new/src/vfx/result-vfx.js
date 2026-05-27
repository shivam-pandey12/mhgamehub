import * as THREE from 'three';
import { CARROM_BOARD } from '../config/carrom-constants.js';

export class ResultVFX {
  constructor({ parent, theme }) {
    this.parent = parent;
    this.theme = theme;
    this.effects = [];
    this.geometry = new THREE.RingGeometry(0.45, 0.5, 96);
    this.material = new THREE.MeshBasicMaterial({
      color: theme.scene.goldTrim,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      side: THREE.DoubleSide
    });
  }

  play(reduced = false) {
    if (reduced) {
      return;
    }
    this.clear();
    for (let index = 0; index < 3; index += 1) {
      const ring = new THREE.Mesh(this.geometry, this.material.clone());
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(0, CARROM_BOARD.SURFACE_Y + 0.08 + index * 0.01, 0);
      ring.renderOrder = 46;
      this.parent.add(ring);
      this.effects.push({
        mesh: ring,
        delay: index * 0.16,
        life: 1.15,
        maxLife: 1.15
      });
    }
  }

  update(delta) {
    this.effects = this.effects.filter((effect) => {
      effect.delay -= delta;
      if (effect.delay > 0) {
        return true;
      }
      effect.life -= delta;
      const t = Math.max(effect.life / effect.maxLife, 0);
      effect.mesh.scale.setScalar(1 + (1 - t) * 4.6);
      effect.mesh.material.opacity = 0.4 * t;
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
    this.material.color.set(theme.scene.goldTrim);
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
    this.geometry.dispose();
    this.material.dispose();
  }
}
