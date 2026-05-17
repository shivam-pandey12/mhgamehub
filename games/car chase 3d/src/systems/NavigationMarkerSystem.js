import * as THREE from 'three';
import { clamp } from '../utils/math.js';

export class NavigationMarkerSystem {
  constructor({ camera, hud }) {
    this.camera = camera;
    this.hud = hud;
    this.screen = new THREE.Vector3();
  }

  update(target, label) {
    if (!target) {
      this.hud.updateTargetMarker({ visible: false });
      return;
    }
    this.screen.copy(target);
    this.screen.y += 3;
    this.screen.project(this.camera);
    const visible = this.screen.z < 1;
    const x = clamp((this.screen.x * 0.5 + 0.5) * window.innerWidth, 48, window.innerWidth - 48);
    const y = clamp((-this.screen.y * 0.5 + 0.5) * window.innerHeight, 92, window.innerHeight - 82);
    this.hud.updateTargetMarker({ visible, x, y, label });
  }
}
