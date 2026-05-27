import * as THREE from 'three';
import { CARROM_BOARD } from '../config/carrom-constants.js';

export class CollisionVFX {
  constructor({ parent, theme }) {
    this.parent = parent;
    this.theme = theme;
    this.effects = [];
    this.geometry = new THREE.CircleGeometry(0.055, 20);
    this.material = new THREE.MeshBasicMaterial({
      color: theme.scene.goldTrim,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      side: THREE.DoubleSide
    });
  }

  play(position, intensity = 0.5, reduced = false) {
    if (reduced || intensity < 0.24) {
      return;
    }
    if (this.effects.length >= 12) {
      const oldest = this.effects.shift();
      this.parent.remove(oldest.mesh);
      oldest.mesh.material.dispose();
    }
    const flash = new THREE.Mesh(this.geometry, this.material.clone());
    flash.rotation.x = -Math.PI / 2;
    flash.position.set(position.x, CARROM_BOARD.SURFACE_Y + 0.065, position.z);
    flash.scale.setScalar(0.8 + intensity * 1.4);
    flash.renderOrder = 44;
    this.parent.add(flash);
    this.effects.push({
      mesh: flash,
      life: 0.16,
      maxLife: 0.16,
      intensity
    });
  }

  update(delta) {
    this.effects = this.effects.filter((effect) => {
      effect.life -= delta;
      const t = Math.max(effect.life / effect.maxLife, 0);
      effect.mesh.material.opacity = 0.5 * t * effect.intensity;
      effect.mesh.scale.multiplyScalar(1 + delta * 3.2);
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
