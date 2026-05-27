import * as THREE from 'three';
import { CARROM_BOARD } from '../config/carrom-constants.js';

export class QueenVFX {
  constructor({ parent, theme }) {
    this.parent = parent;
    this.theme = theme;
    this.effects = [];
    this.geometry = new THREE.RingGeometry(0.26, 0.46, 72);
    this.material = new THREE.MeshBasicMaterial({
      color: theme.scene.queenRim,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      side: THREE.DoubleSide
    });
  }

  play(position = { x: 0, z: 0 }, type = 'pocketed', reduced = false) {
    if (reduced && type !== 'returned') {
      return;
    }
    if (this.effects.length >= 5) {
      const oldest = this.effects.shift();
      this.parent.remove(oldest.mesh);
      oldest.mesh.material.dispose();
    }
    const ring = new THREE.Mesh(this.geometry, this.material.clone());
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(position.x, CARROM_BOARD.SURFACE_Y + 0.075, position.z);
    ring.material.color.set(type === 'returned' ? this.theme.scene.queen : this.theme.scene.queenRim);
    ring.renderOrder = 45;
    this.parent.add(ring);
    this.effects.push({
      mesh: ring,
      life: type === 'covered' ? 1 : 0.72,
      maxLife: type === 'covered' ? 1 : 0.72
    });
  }

  update(delta) {
    this.effects = this.effects.filter((effect) => {
      effect.life -= delta;
      const t = Math.max(effect.life / effect.maxLife, 0);
      effect.mesh.scale.setScalar(1 + (1 - t) * 2.8);
      effect.mesh.material.opacity = 0.74 * t;
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
    this.material.color.set(theme.scene.queenRim);
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
