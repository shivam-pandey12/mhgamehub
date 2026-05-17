import * as THREE from "three";
import { createStarfield } from "./createStarfield.js";

function createNebulaTexture({
  innerColor = "#7bb7ff",
  outerColor = "#101832",
} = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;

  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(128, 128, 18, 128, 128, 128);
  gradient.addColorStop(0, "rgba(255,255,255,0.9)");
  gradient.addColorStop(0.18, innerColor);
  gradient.addColorStop(0.62, outerColor);
  gradient.addColorStop(1, "rgba(0,0,0,0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function createNebulaCard(config) {
  const geometry = new THREE.PlaneGeometry(config.width, config.height, 1, 1);
  const texture = createNebulaTexture({
    innerColor: config.innerColor,
    outerColor: config.outerColor,
  });
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color: config.tint,
    transparent: true,
    opacity: config.opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(config.position);
  mesh.rotation.z = config.rotationZ;

  mesh.userData = {
    basePosition: config.position.clone(),
    baseOpacity: config.opacity,
    baseRotationZ: config.rotationZ,
    parallax: config.parallax,
    driftSpeed: config.driftSpeed,
    driftRadius: config.driftRadius,
    pulseOffset: Math.random() * Math.PI * 2,
  };

  return mesh;
}

export class BackdropField {
  constructor() {
    this.group = new THREE.Group();
    this.group.name = "BackdropField";
    this.starLayers = [];
    this.nebulaCards = [];
    this.time = 0;

    this.createStarLayers();
    this.createNebulaCards();
  }

  createStarLayers() {
    const layers = [
      { starCount: 950, spread: 180, depth: 220, color: 0xf3f7ff, size: 1.25, opacity: 0.9, parallax: 0.012 },
      { starCount: 1450, spread: 280, depth: 360, color: 0xbfd8ff, size: 0.95, opacity: 0.8, parallax: 0.02 },
      { starCount: 1200, spread: 420, depth: 520, color: 0x8bb6ff, size: 0.72, opacity: 0.56, parallax: 0.03 },
    ];

    for (const config of layers) {
      const layer = createStarfield(config);
      layer.userData.parallax = config.parallax;
      this.starLayers.push(layer);
      this.group.add(layer);
    }
  }

  createNebulaCards() {
    const cards = [
      {
        position: new THREE.Vector3(-42, 20, -150),
        width: 72,
        height: 40,
        tint: 0x6a9fff,
        innerColor: "rgba(138,205,255,0.95)",
        outerColor: "rgba(20,32,72,0.45)",
        opacity: 0.22,
        rotationZ: -0.18,
        parallax: 0.055,
        driftSpeed: 0.06,
        driftRadius: 3.2,
      },
      {
        position: new THREE.Vector3(34, -16, -176),
        width: 88,
        height: 48,
        tint: 0xff9dc2,
        innerColor: "rgba(255,182,216,0.9)",
        outerColor: "rgba(64,20,44,0.38)",
        opacity: 0.18,
        rotationZ: 0.26,
        parallax: 0.07,
        driftSpeed: 0.08,
        driftRadius: 2.8,
      },
      {
        position: new THREE.Vector3(0, 28, -220),
        width: 112,
        height: 58,
        tint: 0x9fe2b2,
        innerColor: "rgba(191,255,208,0.86)",
        outerColor: "rgba(20,56,40,0.28)",
        opacity: 0.12,
        rotationZ: 0.05,
        parallax: 0.09,
        driftSpeed: 0.045,
        driftRadius: 4.4,
      },
    ];

    for (const config of cards) {
      const card = createNebulaCard(config);
      this.nebulaCards.push(card);
      this.group.add(card);
    }
  }

  update(deltaTime, focusPosition, camera) {
    this.time += deltaTime;

    for (let index = 0; index < this.starLayers.length; index += 1) {
      const layer = this.starLayers[index];
      const parallax = layer.userData.parallax;

      layer.position.x = focusPosition.x * parallax;
      layer.position.y = focusPosition.y * parallax;
      layer.position.z = focusPosition.z * parallax;
      layer.rotation.z += deltaTime * (0.002 + index * 0.0015);
      layer.material.opacity = 0.55 + index * 0.15 + Math.sin(this.time * (0.18 + index * 0.05)) * 0.02;
    }

    for (const card of this.nebulaCards) {
      const {
        basePosition,
        parallax,
        driftSpeed,
        driftRadius,
        baseOpacity,
        baseRotationZ,
        pulseOffset,
      } = card.userData;

      card.position.x = basePosition.x + focusPosition.x * parallax + Math.sin(this.time * driftSpeed + pulseOffset) * driftRadius;
      card.position.y = basePosition.y + focusPosition.y * parallax + Math.cos(this.time * driftSpeed * 0.8 + pulseOffset) * driftRadius * 0.6;
      card.position.z = basePosition.z + focusPosition.z * parallax * 0.85;
      card.lookAt(camera.position);
      card.rotateZ(baseRotationZ);
      card.material.opacity = THREE.MathUtils.clamp(
        baseOpacity + Math.sin(this.time * 0.22 + pulseOffset) * 0.018,
        0.08,
        0.24,
      );
    }
  }

  dispose() {
    for (const layer of this.starLayers) {
      layer.geometry.dispose();
      layer.material.dispose();
    }

    for (const card of this.nebulaCards) {
      card.geometry.dispose();
      card.material.map.dispose();
      card.material.dispose();
    }
  }
}
