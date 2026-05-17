import * as THREE from 'three';
import { VehicleFactory } from '../vehicles/VehicleFactory.js';

export class GaragePreviewSystem {
  constructor({ renderer, container }) {
    this.mainRenderer = renderer;
    this.container = container;
    this.renderer = null;
    this.scene = new THREE.Scene();
    this.scene.background = null;
    this.camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    this.camera.position.set(6.5, 4.4, 10.5);
    this.camera.lookAt(0, 1.1, 0);
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0xb8d8ff, 1.9));
    const sun = new THREE.DirectionalLight(0xfff0d6, 2.5);
    sun.position.set(6, 8, 5);
    this.scene.add(sun);
    this.addShowroom();
    this.factory = new VehicleFactory();
    this.visual = null;
    this.angle = 0;
    this.initRenderer();
  }

  initRenderer() {
    if (!this.container || this.renderer) return;
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.domElement.className = 'garage-preview-canvas';
    this.container.replaceChildren(this.renderer.domElement);
  }

  addShowroom() {
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(5.2, 64),
      new THREE.MeshStandardMaterial({
        color: 0xfff1d3,
        roughness: 0.42,
        metalness: 0.08,
        transparent: true,
        opacity: 0.84,
      }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.02;
    this.scene.add(floor);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(4.45, 0.025, 8, 96),
      new THREE.MeshBasicMaterial({ color: 0xc99a45, transparent: true, opacity: 0.62 }),
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.015;
    this.scene.add(ring);
  }

  show(vehicleId) {
    if (!this.container) return;
    this.initRenderer();
    if (this.visual) this.scene.remove(this.visual.group);
    this.visual = this.factory.create(vehicleId);
    this.visual.group.position.set(0, 0.25, 0);
    this.visual.group.rotation.y = -0.4;
    this.angle = -0.4;
    this.scene.add(this.visual.group);
  }

  update(dt) {
    if (!this.container || !this.renderer || !this.visual) return;
    this.angle += dt * 0.48;
    this.visual.group.rotation.y = this.angle;
    const rect = this.container.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    const canvas = this.renderer.domElement;
    if (canvas.width !== Math.floor(width * this.renderer.getPixelRatio()) || canvas.height !== Math.floor(height * this.renderer.getPixelRatio())) {
      this.renderer.setSize(width, height, false);
    }
    this.camera.aspect = rect.width / rect.height;
    this.camera.updateProjectionMatrix();
    this.renderer.render(this.scene, this.camera);
  }
}
