import * as THREE from 'three';
import { CARROM_BOARD } from '../config/carrom-constants.js';

const AIM_Y = CARROM_BOARD.SURFACE_Y + 0.052;
const PLACEMENT_Y = CARROM_BOARD.SURFACE_Y + 0.032;

export class AimLineRenderer {
  constructor({ parent, theme }) {
    this.parent = parent;
    this.theme = theme;
    this.group = new THREE.Group();
    this.group.name = 'premium-aim-line-layer';
    this.group.visible = false;
    this.placementGroup = new THREE.Group();
    this.placementGroup.name = 'striker-placement-feedback';
    this.placementGroup.visible = false;

    this.linePositions = new Float32Array(6);
    this.lineGeometry = new THREE.BufferGeometry();
    this.lineGeometry.setAttribute('position', new THREE.BufferAttribute(this.linePositions, 3));
    this.lineMaterial = new THREE.LineBasicMaterial({
      color: theme.scene.goldTrim,
      transparent: true,
      opacity: 0.92,
      depthWrite: false
    });
    this.line = new THREE.Line(this.lineGeometry, this.lineMaterial);
    this.line.renderOrder = 30;
    this.group.add(this.line);

    this.dotMaterial = new THREE.MeshBasicMaterial({
      color: theme.scene.strikerGlow,
      transparent: true,
      opacity: 0.72,
      depthWrite: false
    });
    this.invalidMaterial = new THREE.MeshBasicMaterial({
      color: theme.scene.queen,
      transparent: true,
      opacity: 0.72,
      depthWrite: false
    });
    this.endpointMaterial = new THREE.MeshBasicMaterial({
      color: theme.scene.goldTrim,
      transparent: true,
      opacity: 0.9,
      depthWrite: false
    });

    this.endpoint = new THREE.Mesh(new THREE.CircleGeometry(0.055, 32), this.endpointMaterial);
    this.endpoint.name = 'aim-line-endpoint';
    this.endpoint.rotation.x = -Math.PI / 2;
    this.endpoint.renderOrder = 31;
    this.group.add(this.endpoint);

    this.dots = Array.from({ length: 5 }, (_, index) => {
      const dot = new THREE.Mesh(new THREE.CircleGeometry(0.026, 20), this.dotMaterial);
      dot.name = `aim-line-power-dot-${index + 1}`;
      dot.rotation.x = -Math.PI / 2;
      dot.renderOrder = 31;
      this.group.add(dot);
      return dot;
    });

    this.placementRingMaterial = new THREE.MeshBasicMaterial({
      color: theme.scene.strikerGlow,
      transparent: true,
      opacity: 0.72,
      depthWrite: false
    });
    this.placementInvalidMaterial = new THREE.MeshBasicMaterial({
      color: theme.scene.queen,
      transparent: true,
      opacity: 0.78,
      depthWrite: false
    });
    this.placementRing = new THREE.Mesh(
      new THREE.TorusGeometry(CARROM_BOARD.STRIKER_RADIUS + 0.035, 0.012, 10, 72),
      this.placementRingMaterial
    );
    this.placementRing.name = 'striker-placement-ring';
    this.placementRing.rotation.x = Math.PI / 2;
    this.placementRing.renderOrder = 32;
    this.placementGroup.add(this.placementRing);

    this.parent?.add(this.group);
    this.parent?.add(this.placementGroup);
  }

  showAim({ start, direction, powerRatio, valid = true }) {
    if (!start || !direction) {
      this.hideAim();
      return;
    }

    const ratio = Math.min(Math.max(powerRatio, 0), 1);
    const length = 0.48 + ratio * 2.25;
    const end = {
      x: start.x + direction.x * length,
      z: start.z + direction.z * length
    };

    this.linePositions[0] = start.x;
    this.linePositions[1] = AIM_Y;
    this.linePositions[2] = start.z;
    this.linePositions[3] = end.x;
    this.linePositions[4] = AIM_Y;
    this.linePositions[5] = end.z;
    this.lineGeometry.attributes.position.needsUpdate = true;

    const material = valid ? this.dotMaterial : this.invalidMaterial;
    this.lineMaterial.color.copy(material.color);
    this.lineMaterial.opacity = valid ? 0.92 : 0.78;
    this.endpoint.material = material;
    this.endpoint.position.set(end.x, AIM_Y + 0.004, end.z);
    this.endpoint.scale.setScalar(0.9 + ratio * 1.15);

    this.dots.forEach((dot, index) => {
      const t = (index + 1) / (this.dots.length + 1);
      dot.material = material;
      dot.position.set(
        start.x + (end.x - start.x) * t,
        AIM_Y + 0.003,
        start.z + (end.z - start.z) * t
      );
      dot.scale.setScalar(0.7 + ratio * 0.7);
      dot.visible = ratio > index * 0.14;
    });

    this.group.visible = true;
  }

  hideAim() {
    this.group.visible = false;
  }

  showPlacement(position, valid = true) {
    if (!position) {
      this.hidePlacement();
      return;
    }

    this.placementRing.material = valid ? this.placementRingMaterial : this.placementInvalidMaterial;
    this.placementRing.position.set(position.x, PLACEMENT_Y, position.z);
    this.placementGroup.visible = true;
  }

  hidePlacement() {
    this.placementGroup.visible = false;
  }

  hide() {
    this.hideAim();
    this.hidePlacement();
  }

  applyTheme(theme) {
    this.theme = theme;
    this.lineMaterial.color.set(theme.scene.goldTrim);
    this.dotMaterial.color.set(theme.scene.strikerGlow);
    this.endpointMaterial.color.set(theme.scene.goldTrim);
    this.placementRingMaterial.color.set(theme.scene.strikerGlow);
    this.invalidMaterial.color.set(theme.scene.queen);
    this.placementInvalidMaterial.color.set(theme.scene.queen);
  }

  dispose() {
    this.parent?.remove(this.group);
    this.parent?.remove(this.placementGroup);
    this.lineGeometry.dispose();
    this.lineMaterial.dispose();
    this.dotMaterial.dispose();
    this.invalidMaterial.dispose();
    this.endpointMaterial.dispose();
    this.placementRingMaterial.dispose();
    this.placementInvalidMaterial.dispose();
    this.endpoint.geometry.dispose();
    this.dots.forEach((dot) => dot.geometry.dispose());
    this.placementRing.geometry.dispose();
  }
}
