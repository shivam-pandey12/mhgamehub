import * as THREE from 'three';
import { CARROM_BOARD } from '../config/carrom-constants.js';

export class PointerRaycaster {
  constructor({ canvas, camera, surfaceY = CARROM_BOARD.SURFACE_Y }) {
    this.canvas = canvas;
    this.camera = camera;
    this.surfaceY = surfaceY;
    this.raycaster = new THREE.Raycaster();
    this.ndc = new THREE.Vector2();
    this.boardPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -surfaceY);
    this.hitPoint = new THREE.Vector3();
  }

  getBoardPoint(event) {
    if (!this.canvas || !this.camera) {
      return null;
    }

    const rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return null;
    }

    this.ndc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.ndc.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    this.boardPlane.constant = -this.surfaceY;
    this.raycaster.setFromCamera(this.ndc, this.camera);

    const hit = this.raycaster.ray.intersectPlane(this.boardPlane, this.hitPoint);
    if (!hit) {
      return null;
    }

    return {
      x: this.hitPoint.x,
      y: this.hitPoint.y,
      z: this.hitPoint.z
    };
  }
}
