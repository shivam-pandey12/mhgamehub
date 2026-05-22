import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import {
  FACE_DEFINITIONS,
  getDragCandidateMoves,
  getCubieById,
} from "./cubeState.js";

const CUBE_VISUAL_PRESETS = {
  premiumSpeedcube: {
    spacing: 1.025,
    bodySize: 0.985,
    bodyRadius: 0.155,
    bodySegments: 8,
    bodyColor: 0xe8e2d7,
    bodyMetalness: 0.025,
    bodyRoughness: 0.42,
    bodyClearcoat: 0.62,
    bodyClearcoatRoughness: 0.34,
    bodySheen: 0.22,
    panelSize: 0.875,
    panelDepth: 0.034,
    panelRadius: 0.16,
    panelBevelSize: 0.028,
    panelBevelThickness: 0.015,
    panelBevelSegments: 6,
    panelOffsetFactor: 0.28,
    panelRoughness: 0.34,
    panelMetalness: 0.02,
    panelClearcoat: 0.78,
    panelClearcoatRoughness: 0.24,
    panelSheen: 0.14,
    highlightColor: 0xf5d387,
    pulseIntensity: 0.18,
    faceColors: {
      U: "#f4f2ec",
      D: "#f0c847",
      F: "#21a760",
      B: "#2f7edb",
      R: "#e04736",
      L: "#eb8732"
    }
  },
  ivoryRoyale: {
    spacing: 1.018,
    bodySize: 0.992,
    bodyRadius: 0.18,
    bodySegments: 9,
    bodyColor: 0xf1eadb,
    bodyMetalness: 0.035,
    bodyRoughness: 0.36,
    bodyClearcoat: 0.72,
    bodyClearcoatRoughness: 0.26,
    bodySheen: 0.28,
    panelSize: 0.885,
    panelDepth: 0.032,
    panelRadius: 0.175,
    panelBevelSize: 0.024,
    panelBevelThickness: 0.014,
    panelBevelSegments: 6,
    panelOffsetFactor: 0.24,
    panelRoughness: 0.32,
    panelMetalness: 0.025,
    panelClearcoat: 0.82,
    panelClearcoatRoughness: 0.22,
    panelSheen: 0.18,
    highlightColor: 0xf7d78b,
    pulseIntensity: 0.2,
    faceColors: {
      U: "#fffaf0",
      D: "#e6bd45",
      F: "#2ea267",
      B: "#3d76c5",
      R: "#cf4d3e",
      L: "#d8843a"
    }
  },
  glassPrism: {
    spacing: 1.03,
    bodySize: 0.972,
    bodyRadius: 0.15,
    bodySegments: 7,
    bodyColor: 0xeef5ff,
    bodyMetalness: 0.02,
    bodyRoughness: 0.18,
    bodyClearcoat: 0.9,
    bodyClearcoatRoughness: 0.12,
    bodySheen: 0.12,
    bodyOpacity: 0.78,
    panelSize: 0.86,
    panelDepth: 0.03,
    panelRadius: 0.15,
    panelBevelSize: 0.022,
    panelBevelThickness: 0.012,
    panelBevelSegments: 5,
    panelOffsetFactor: 0.3,
    panelRoughness: 0.2,
    panelMetalness: 0.03,
    panelClearcoat: 0.92,
    panelClearcoatRoughness: 0.12,
    panelSheen: 0.1,
    highlightColor: 0x9ad8ff,
    pulseIntensity: 0.24,
    faceColors: {
      U: "#f9fbff",
      D: "#f1ce55",
      F: "#25b970",
      B: "#3487f1",
      R: "#ef5748",
      L: "#f39a3e"
    }
  },
  darkNeon: {
    spacing: 1.055,
    bodySize: 0.94,
    bodyRadius: 0.11,
    bodySegments: 6,
    bodyColor: 0x14151c,
    bodyMetalness: 0.12,
    bodyRoughness: 0.34,
    bodyClearcoat: 0.62,
    bodyClearcoatRoughness: 0.22,
    bodySheen: 0,
    panelSize: 0.78,
    panelDepth: 0.032,
    panelRadius: 0.1,
    panelBevelSize: 0.018,
    panelBevelThickness: 0.01,
    panelBevelSegments: 5,
    panelOffsetFactor: 0.48,
    panelRoughness: 0.24,
    panelMetalness: 0.04,
    panelClearcoat: 0.78,
    panelClearcoatRoughness: 0.18,
    panelSheen: 0,
    panelEmissive: 0.12,
    highlightColor: 0x6fffd6,
    pulseIntensity: 0.35,
    faceColors: {
      U: "#f2fbff",
      D: "#ffe45a",
      F: "#25f07c",
      B: "#39a5ff",
      R: "#ff4b5e",
      L: "#ff9b36"
    }
  },
  woodenPuzzle: {
    spacing: 1.035,
    bodySize: 0.965,
    bodyRadius: 0.13,
    bodySegments: 6,
    bodyColor: 0x8b5f32,
    bodyMetalness: 0.015,
    bodyRoughness: 0.68,
    bodyClearcoat: 0.26,
    bodyClearcoatRoughness: 0.58,
    bodySheen: 0.12,
    panelSize: 0.82,
    panelDepth: 0.026,
    panelRadius: 0.09,
    panelBevelSize: 0.016,
    panelBevelThickness: 0.01,
    panelBevelSegments: 4,
    panelOffsetFactor: 0.38,
    panelRoughness: 0.55,
    panelMetalness: 0.01,
    panelClearcoat: 0.38,
    panelClearcoatRoughness: 0.42,
    panelSheen: 0.08,
    highlightColor: 0xf1c77a,
    pulseIntensity: 0.2,
    faceColors: {
      U: "#fff6df",
      D: "#d8aa40",
      F: "#4f9656",
      B: "#4774a8",
      R: "#b6503d",
      L: "#c3773a"
    }
  },
  classicStickered: {
    spacing: 1.08,
    bodySize: 0.92,
    bodyRadius: 0.075,
    bodySegments: 4,
    bodyColor: 0x171511,
    bodyMetalness: 0.08,
    bodyRoughness: 0.48,
    bodyClearcoat: 0.3,
    bodyClearcoatRoughness: 0.55,
    bodySheen: 0,
    panelSize: 0.64,
    panelDepth: 0.026,
    panelRadius: 0.045,
    panelBevelSize: 0,
    panelBevelThickness: 0,
    panelBevelSegments: 3,
    panelOffsetFactor: 0.72,
    panelRoughness: 0.36,
    panelMetalness: 0.03,
    panelClearcoat: 0.72,
    panelClearcoatRoughness: 0.28,
    panelSheen: 0,
    highlightColor: 0xffd889,
    pulseIntensity: 0.22,
    faceColors: {}
  }
};

const DEFAULT_VISUAL_PRESET = "premiumSpeedcube";
const DRAG_MATCH_THRESHOLD = 0.64;

function vectorToThree(vector, scale = 1) {
  return new THREE.Vector3(vector.x * scale, vector.y * scale, vector.z * scale);
}

function gridToWorld(vector, size, spacing) {
  const center = (size - 1) / 2;
  return new THREE.Vector3(
    (vector.x - center) * spacing,
    (vector.y - center) * spacing,
    (vector.z - center) * spacing
  );
}

function axisToVector(axis) {
  if (axis === "x") return new THREE.Vector3(1, 0, 0);
  if (axis === "y") return new THREE.Vector3(0, 1, 0);
  return new THREE.Vector3(0, 0, 1);
}

function axisValue(vector, axis) {
  return vector[axis];
}

function roundWorldNormal(normal) {
  const abs = {
    x: Math.abs(normal.x),
    y: Math.abs(normal.y),
    z: Math.abs(normal.z)
  };
  const axis = abs.x > abs.y && abs.x > abs.z ? "x" : abs.y > abs.z ? "y" : "z";
  const sign = normal[axis] >= 0 ? 1 : -1;

  return {
    x: axis === "x" ? sign : 0,
    y: axis === "y" ? sign : 0,
    z: axis === "z" ? sign : 0
  };
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

function basisToQuaternion(basis) {
  const matrix = new THREE.Matrix4().makeBasis(
    vectorToThree(basis.x),
    vectorToThree(basis.y),
    vectorToThree(basis.z)
  );
  return new THREE.Quaternion().setFromRotationMatrix(matrix);
}

function createRoundedPanelGeometry(width, height, depth, radius, bevelSize, bevelThickness, bevelSegments) {
  if (bevelSize <= 0 || bevelThickness <= 0) {
    return new RoundedBoxGeometry(width, height, depth, bevelSegments, radius);
  }

  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const corner = Math.min(radius, halfWidth, halfHeight);
  const shape = new THREE.Shape();

  shape.moveTo(-halfWidth + corner, -halfHeight);
  shape.lineTo(halfWidth - corner, -halfHeight);
  shape.quadraticCurveTo(halfWidth, -halfHeight, halfWidth, -halfHeight + corner);
  shape.lineTo(halfWidth, halfHeight - corner);
  shape.quadraticCurveTo(halfWidth, halfHeight, halfWidth - corner, halfHeight);
  shape.lineTo(-halfWidth + corner, halfHeight);
  shape.quadraticCurveTo(-halfWidth, halfHeight, -halfWidth, halfHeight - corner);
  shape.lineTo(-halfWidth, -halfHeight + corner);
  shape.quadraticCurveTo(-halfWidth, -halfHeight, -halfWidth + corner, -halfHeight);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    steps: 1,
    bevelEnabled: true,
    bevelSize,
    bevelThickness,
    bevelSegments,
    curveSegments: 14
  });

  geometry.center();
  geometry.computeVertexNormals();
  return geometry;
}

function createBodyMaterial(style) {
  return new THREE.MeshPhysicalMaterial({
    color: style.bodyColor,
    roughness: style.bodyRoughness,
    metalness: style.bodyMetalness,
    clearcoat: style.bodyClearcoat,
    clearcoatRoughness: style.bodyClearcoatRoughness,
    sheen: style.bodySheen,
    sheenColor: new THREE.Color(0xfff2dc),
    transparent: Boolean(style.bodyOpacity),
    opacity: style.bodyOpacity ?? 1,
    emissive: new THREE.Color(0x000000),
    emissiveIntensity: 0
  });
}

function createPanelMaterial(sticker, style) {
  const color = style.faceColors[sticker.face] || sticker.color || FACE_DEFINITIONS[sticker.face].color;

  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness: style.panelRoughness,
    metalness: style.panelMetalness,
    clearcoat: style.panelClearcoat,
    clearcoatRoughness: style.panelClearcoatRoughness,
    sheen: style.panelSheen,
    sheenColor: new THREE.Color(0xfff4df),
    emissive: new THREE.Color(color),
    emissiveIntensity: style.panelEmissive || 0
  });
}

export class CubeRenderer {
  constructor(container, cubeState) {
    this.container = container;
    this.cubeState = cubeState;
    this.visualPresetName = DEFAULT_VISUAL_PRESET;
    this.visualStyle = CUBE_VISUAL_PRESETS[this.visualPresetName] ?? CUBE_VISUAL_PRESETS.classicStickered;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.raycaster = new THREE.Raycaster();
    this.pointerNdc = new THREE.Vector2();
    this.cubieGroups = new Map();
    this.pickables = [];
    this.highlighted = null;
    this.guideHighlightedIds = new Set();
    this.previewedLayer = null;
    this.pulse = null;
    this.renderSettings = {
      quality: "balanced",
      stickerBorders: true,
      gapStyle: "clean",
      animationSpeed: "normal",
      reducedMotion: false
    };
    this.reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    this.disposed = false;
    this.frameHandle = 0;
    this.qualityApplied = false;

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);
    this.dragIndicator = document.createElement("div");
    this.dragIndicator.className = "drag-direction-indicator";
    this.container.appendChild(this.dragIndicator);

    this.camera.position.set(5.2, 3.9, 6.2);
    this.camera.lookAt(0, 0, 0);

    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.085;
    this.controls.minDistance = 5.2;
    this.controls.maxDistance = 10.5;
    this.controls.minPolarAngle = Math.PI * 0.18;
    this.controls.maxPolarAngle = Math.PI * 0.82;
    this.controls.target.set(0, 0.05, 0);
    this.controls.enablePan = false;
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_ROTATE
    };

    this.createEnvironment();
    this.createCubies();
    this.resize();
    this.syncFromState();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
    window.addEventListener("resize", this.resize, { passive: true });
    this.renderLoop();
  }

  get domElement() {
    return this.renderer.domElement;
  }

  dispose() {
    this.disposed = true;
    if (this.frameHandle) {
      cancelAnimationFrame(this.frameHandle);
      this.frameHandle = 0;
    }
    this.resizeObserver?.disconnect();
    window.removeEventListener("resize", this.resize);
    this.disposeCubieMeshes();
    this.dragIndicator?.remove();
    this.renderer.domElement?.remove();
    this.renderer.dispose();
  }

  resize = () => {
    const rect = this.container.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  };

  createEnvironment() {
    this.scene.background = new THREE.Color(0xfbf6ec);
    this.scene.fog = new THREE.Fog(0xfbf6ec, 13, 23);

    const hemi = new THREE.HemisphereLight(0xfff7e4, 0x3a3329, 2.4);
    this.scene.add(hemi);

    const key = new THREE.DirectionalLight(0xfff1c8, 4.8);
    key.position.set(4.5, 7.5, 5.5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 18;
    key.shadow.camera.left = -5;
    key.shadow.camera.right = 5;
    key.shadow.camera.top = 5;
    key.shadow.camera.bottom = -5;
    this.scene.add(key);

    const rim = new THREE.DirectionalLight(0xc5d8ff, 1.2);
    rim.position.set(-5, 3, -4);
    this.scene.add(rim);

    const stageMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xe1c99d,
      roughness: 0.74,
      metalness: 0.035,
      clearcoat: 0.24,
      clearcoatRoughness: 0.62
    });
    const stage = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.85, 0.12, 96), stageMaterial);
    stage.position.set(0, -2.02, 0);
    stage.receiveShadow = true;
    this.scene.add(stage);

    const shadowDisk = new THREE.Mesh(
      new THREE.CircleGeometry(4.5, 96),
      new THREE.MeshBasicMaterial({ color: 0x4a3420, transparent: true, opacity: 0.08, depthWrite: false })
    );
    shadowDisk.rotation.x = -Math.PI / 2;
    shadowDisk.position.y = -1.95;
    this.scene.add(shadowDisk);
  }

  createCubies() {
    const style = this.visualStyle;
    const metrics = this.getVisualMetrics();
    const bodyGeometry = new RoundedBoxGeometry(
      metrics.bodySize,
      metrics.bodySize,
      metrics.bodySize,
      metrics.bodySegments,
      metrics.bodyRadius
    );
    const stickerGeometry = createRoundedPanelGeometry(
      metrics.panelSize,
      metrics.panelSize,
      metrics.panelDepth,
      metrics.panelRadius,
      metrics.panelBevelSize,
      metrics.panelBevelThickness,
      metrics.panelBevelSegments
    );
    const castsDetailedShadows = this.cubeState.size <= 5;

    this.cubeState.cubies.forEach((cubie) => {
      const group = new THREE.Group();
      group.userData.cubieId = cubie.id;

      const body = new THREE.Mesh(bodyGeometry, createBodyMaterial(style));
      body.castShadow = castsDetailedShadows;
      body.receiveShadow = true;
      body.userData = { type: "body", cubieId: cubie.id };
      group.add(body);
      this.pickables.push(body);

      cubie.stickers.forEach((sticker) => {
        const normal = vectorToThree(sticker.homeNormal).normalize();
        const material = createPanelMaterial(sticker, style);
        const mesh = new THREE.Mesh(stickerGeometry, material);
        mesh.position.copy(
          normal.clone().multiplyScalar(metrics.bodySize / 2 + metrics.panelDepth * style.panelOffsetFactor)
        );
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
        mesh.castShadow = castsDetailedShadows;
        mesh.receiveShadow = true;
        mesh.userData = {
          type: "sticker",
          cubieId: cubie.id,
          stickerFace: sticker.face,
          localNormal: sticker.homeNormal,
          baseEmissive: 0
        };
        group.add(mesh);
        this.pickables.push(mesh);
      });

      this.scene.add(group);
      this.cubieGroups.set(cubie.id, group);
    });
  }

  getVisualMetrics() {
    const style = this.visualStyle;
    const size = this.cubeState.size || 3;
    const targetSpan = size === 2 ? 2.45 : 3.08 + Math.min(Math.max(size - 3, 0), 4) * 0.08;
    const gapFactor = this.renderSettings.gapStyle === "tight" ? 0.985 : this.renderSettings.gapStyle === "wide" ? 1.025 : 1;
    const spacing = (size === 3 ? style.spacing : targetSpan / size) * gapFactor;
    const scale = spacing / style.spacing;
    const panelBorderScale = this.renderSettings.stickerBorders ? 1 : 1.035;

    return {
      spacing,
      bodySize: style.bodySize * scale,
      bodyRadius: style.bodyRadius * scale,
      bodySegments: size >= 6 ? Math.max(3, Math.min(style.bodySegments, 5)) : style.bodySegments,
      panelSize: style.panelSize * scale * panelBorderScale,
      panelDepth: style.panelDepth * scale,
      panelRadius: style.panelRadius * scale,
      panelBevelSize: style.panelBevelSize * scale,
      panelBevelThickness: style.panelBevelThickness * scale,
      panelBevelSegments: size >= 6 ? Math.max(2, Math.min(style.panelBevelSegments, 4)) : style.panelBevelSegments
    };
  }

  disposeCubieMeshes() {
    this.clearHighlight();
    this.clearGuideHighlights();
    this.clearLayerPreview();
    this.pulse = null;

    const geometries = new Set();
    const materials = new Set();

    this.cubieGroups.forEach((group) => {
      this.scene.remove(group);
      group.traverse((child) => {
        if (!child.isMesh) {
          return;
        }

        if (child.geometry) {
          geometries.add(child.geometry);
        }

        if (Array.isArray(child.material)) {
          child.material.forEach((material) => materials.add(material));
        } else if (child.material) {
          materials.add(child.material);
        }
      });
    });

    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    this.cubieGroups.clear();
    this.pickables = [];
  }

  setVisualPreset(presetName) {
    const nextStyle = CUBE_VISUAL_PRESETS[presetName];
    if (!nextStyle) {
      return false;
    }

    if (presetName === this.visualPresetName) {
      return true;
    }

    this.visualPresetName = presetName;
    this.visualStyle = nextStyle;
    this.rebuildCubies();
    return true;
  }

  getVisualPresetName() {
    return this.visualPresetName;
  }

  updateRenderSettings(settings = {}) {
    const previousQuality = this.renderSettings.quality;
    const previousShape = `${this.renderSettings.gapStyle}:${this.renderSettings.stickerBorders}`;
    this.renderSettings = { ...this.renderSettings, ...settings };
    this.reduceMotion = Boolean(this.renderSettings.reducedMotion) ||
      (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false);
    const cameraSensitivity = Math.min(1.75, Math.max(0.5, Number(this.renderSettings.cameraSensitivity || 1)));
    this.controls.rotateSpeed = cameraSensitivity;
    this.controls.zoomSpeed = 0.85 * cameraSensitivity;

    if (previousQuality !== this.renderSettings.quality || !this.qualityApplied) {
      this.applyQualityMode(this.renderSettings.quality);
    }

    const nextShape = `${this.renderSettings.gapStyle}:${this.renderSettings.stickerBorders}`;
    if (previousShape !== nextShape) {
      this.rebuildCubies();
    }
  }

  applyQualityMode(quality = "balanced") {
    const pixelRatio = quality === "high" ? 2 : quality === "performance" ? 1.15 : 1.5;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatio));
    this.renderer.shadowMap.enabled = quality !== "performance";
    this.qualityApplied = true;
    this.resize();
  }

  rebuildCubies() {
    this.disposeCubieMeshes();
    this.createCubies();
    this.syncFromState();
    this.resetCamera(false);
  }

  syncFromState() {
    const metrics = this.getVisualMetrics();
    this.cubeState.cubies.forEach((cubie) => {
      const group = this.cubieGroups.get(cubie.id);
      if (!group) return;

      group.position.copy(gridToWorld(cubie.position, this.cubeState.size, metrics.spacing));
      group.quaternion.copy(basisToQuaternion(cubie.basis));
      group.scale.setScalar(1);
    });
  }

  resetCamera(smooth = true) {
    this.setCameraPreset("isometric", smooth);
  }

  setCameraPreset(preset = "isometric", smooth = true) {
    const size = this.cubeState.size || 3;
    const distanceBoost = Math.max(0, size - 3) * 0.28;
    const distance = 6.4 + distanceBoost;
    const positions = {
      front: [0, 0.65, distance],
      top: [0.01, distance, 0.01],
      right: [distance, 0.65, 0],
      isometric: [5.2 + distanceBoost, 3.9 + distanceBoost * 0.5, 6.2 + distanceBoost]
    };
    const next = positions[preset] || positions.isometric;

    this.camera.position.set(next[0], next[1], next[2]);
    this.controls.target.set(0, 0.05, 0);
    this.controls.minDistance = 4.6 + distanceBoost * 0.55;
    this.controls.maxDistance = 12 + distanceBoost;
    this.controls.update();
  }

  setControlsEnabled(enabled) {
    this.controls.enabled = enabled;
  }

  setTwistingClass(enabled) {
    this.container.classList.toggle("is-twisting", enabled);
  }

  raycast(clientX, clientY) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointerNdc, this.camera);

    const intersections = this.raycaster.intersectObjects(this.pickables, false);
    const hit = intersections.find((entry) => entry.object.userData.cubieId);
    if (!hit) {
      return null;
    }

    let normal;
    if (hit.object.userData.type === "sticker") {
      normal = vectorToThree(hit.object.userData.localNormal).transformDirection(hit.object.matrixWorld);
    } else {
      normal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
    }

    const cubieId = hit.object.userData.cubieId;
    const cubie = getCubieById(this.cubeState, cubieId);
    if (!cubie) {
      return null;
    }

    return {
      cubieId,
      cubie,
      object: hit.object,
      point: hit.point.clone(),
      normal: roundWorldNormal(normal)
    };
  }

  setHighlight(hit) {
    this.clearHighlight();
    if (!hit?.object) {
      return;
    }

    const object = hit.object;
    this.highlighted = object;

    if (object.material?.emissive) {
      object.material.emissive.set(this.visualStyle.highlightColor);
      object.material.emissiveIntensity = 0.28;
    }

    if (object.userData.type === "sticker") {
      object.scale.setScalar(1.045);
    } else {
      const group = this.cubieGroups.get(hit.cubieId);
      group?.scale.setScalar(1.018);
    }
  }

  clearHighlight() {
    if (!this.highlighted) {
      return;
    }

    if (this.highlighted.material?.emissive) {
      this.highlighted.material.emissive.set(0x000000);
      this.highlighted.material.emissiveIntensity = 0;
    }

    this.highlighted.scale.setScalar(1);
    this.cubieGroups.forEach((group) => group.scale.setScalar(1));
    this.highlighted = null;
  }

  setGuideHighlights(targets = {}) {
    this.clearGuideHighlights();
    const ids = new Set(targets.cubieIds || []);
    this.guideHighlightedIds = ids;

    ids.forEach((id) => {
      const group = this.cubieGroups.get(id);
      if (!group) return;

      group.scale.setScalar(1.028);
      group.children.forEach((child) => {
        if (child.userData.type === "sticker" && child.material?.emissive) {
          child.material.emissive.set(this.visualStyle.highlightColor);
          child.material.emissiveIntensity = 0.22;
        }
      });
    });
  }

  clearGuideHighlights() {
    if (!this.guideHighlightedIds?.size) {
      this.guideHighlightedIds = new Set();
      return;
    }

    this.guideHighlightedIds.forEach((id) => {
      const group = this.cubieGroups.get(id);
      if (!group) return;
      group.scale.setScalar(1);
      group.children.forEach((child) => {
        if (child.userData.type === "sticker" && child.material?.emissive && child !== this.highlighted) {
          child.material.emissive.set(child.material.color || 0x000000);
          child.material.emissiveIntensity = this.visualStyle.panelEmissive || 0;
        }
      });
    });

    this.guideHighlightedIds.clear();
  }

  setLayerPreview(move) {
    if (!move) {
      this.clearLayerPreview();
      return;
    }

    const signature = `${move.axis}:${move.layerIndex}:${move.quarterTurns}`;
    if (this.previewedLayer?.signature === signature) {
      return;
    }

    this.clearLayerPreview();
    const ids = this.cubeState.cubies
      .filter((cubie) => axisValue(cubie.position, move.axis) === move.layerIndex)
      .map((cubie) => cubie.id);

    this.previewedLayer = { signature, ids: new Set(ids) };
    ids.forEach((id) => {
      const group = this.cubieGroups.get(id);
      if (!group) return;
      group.scale.setScalar(1.018);
      group.children.forEach((child) => {
        if (child.userData.type === "sticker" && child.material?.emissive) {
          child.material.emissive.set(this.visualStyle.highlightColor);
          child.material.emissiveIntensity = Math.max(child.material.emissiveIntensity || 0, 0.16);
        }
      });
    });
  }

  clearLayerPreview() {
    if (!this.previewedLayer) {
      this.hideDragIndicator();
      return;
    }

    this.previewedLayer.ids.forEach((id) => {
      if (this.guideHighlightedIds?.has(id)) return;
      const group = this.cubieGroups.get(id);
      if (!group) return;
      group.scale.setScalar(1);
      group.children.forEach((child) => {
        if (child.userData.type === "sticker" && child.material?.emissive && child !== this.highlighted) {
          child.material.emissive.set(child.material.color || 0x000000);
          child.material.emissiveIntensity = this.visualStyle.panelEmissive || 0;
        }
      });
    });

    this.previewedLayer = null;
    this.hideDragIndicator();
  }

  startGhostPreview(move) {
    this.ghostPreviewMove = move;
    this.setLayerPreview(move);
    return Boolean(move);
  }

  clearGhostPreview() {
    this.ghostPreviewMove = null;
    this.clearLayerPreview();
  }

  commitGhostPreview() {
    const move = this.ghostPreviewMove;
    this.clearGhostPreview();
    return move;
  }

  showDragIndicator(start, delta, label = "") {
    if (!this.dragIndicator) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    const length = Math.min(88, Math.max(34, Math.hypot(delta.x, delta.y)));
    const angle = Math.atan2(delta.y, delta.x);

    this.dragIndicator.textContent = label;
    this.dragIndicator.style.left = `${start.x - rect.left}px`;
    this.dragIndicator.style.top = `${start.y - rect.top}px`;
    this.dragIndicator.style.width = `${length}px`;
    this.dragIndicator.style.transform = `translateY(-50%) rotate(${angle}rad)`;
    this.dragIndicator.classList.add("is-visible");
  }

  hideDragIndicator() {
    this.dragIndicator?.classList.remove("is-visible");
  }

  projectWorldToScreen(point) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const projected = point.clone().project(this.camera);
    return new THREE.Vector2(
      (projected.x * 0.5 + 0.5) * rect.width,
      (-projected.y * 0.5 + 0.5) * rect.height
    );
  }

  resolveDragMove(context, delta) {
    const drag = new THREE.Vector2(delta.x, delta.y);
    if (drag.length() < 1) {
      return null;
    }

    drag.normalize();

    const startPoint = context.point.clone();
    const startScreen = this.projectWorldToScreen(startPoint);
    let best = null;

    getDragCandidateMoves(context.cubiePosition, this.cubeState.size, context.faceNormal).forEach((move) => {
      if (axisValue(context.cubiePosition, move.axis) !== move.layerIndex) {
        return;
      }

      const angle = move.quarterTurns * Math.PI * 0.28;
      const endPoint = startPoint.clone().applyAxisAngle(axisToVector(move.axis), angle);
      const candidate = this.projectWorldToScreen(endPoint).sub(startScreen);
      const distance = candidate.length();

      if (distance < 2.5) {
        return;
      }

      const rawScore = candidate.normalize().dot(drag);
      const score = rawScore + (move.dragPriority ? 0.055 : 0);
      if (!best || score > best.score) {
        best = { move, score, rawScore, distance };
      }
    });

    if (!best || best.rawScore < DRAG_MATCH_THRESHOLD) {
      return null;
    }

    return best.move;
  }

  previewDragMove(context, delta) {
    const move = this.resolveDragMove(context, delta);
    if (move) {
      this.setLayerPreview(move);
      this.showDragIndicator(
        { x: context.startX, y: context.startY },
        delta,
        `${move.notation || move.display}`
      );
    }
    return move;
  }

  animateMove(move, { duration = 260, layerCubies = [] } = {}) {
    const ids = new Set(layerCubies);
    const groups = [...ids].map((id) => this.cubieGroups.get(id)).filter(Boolean);
    const axisVector = axisToVector(move.axis);
    const targetAngle = move.quarterTurns * Math.PI * 0.5;
    const actualDuration = this.reduceMotion ? Math.min(duration, 70) : duration;
    const base = groups.map((group) => ({
      group,
      position: group.position.clone(),
      quaternion: group.quaternion.clone()
    }));

    if (actualDuration <= 0) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const startedAt = performance.now();

      const frame = (now) => {
        const progress = Math.min(1, (now - startedAt) / actualDuration);
        const eased = easeOutCubic(progress);
        const angle = targetAngle * eased;
        const rotation = new THREE.Quaternion().setFromAxisAngle(axisVector, angle);

        base.forEach(({ group, position, quaternion }) => {
          group.position.copy(position.clone().applyAxisAngle(axisVector, angle));
          group.quaternion.copy(rotation.clone().multiply(quaternion));
        });

        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(frame);
    });
  }

  pulseLayer(move) {
    const ids = this.cubeState.cubies
      .filter((cubie) => axisValue(cubie.position, move.axis) === move.layerIndex)
      .map((cubie) => cubie.id);
    this.pulse = {
      ids: new Set(ids),
      startedAt: performance.now(),
      duration: this.reduceMotion ? 80 : 260
    };
  }

  updatePulse() {
    if (!this.pulse) {
      return;
    }

    const elapsed = performance.now() - this.pulse.startedAt;
    const progress = Math.min(1, elapsed / this.pulse.duration);
    const intensity = Math.sin(progress * Math.PI) * this.visualStyle.pulseIntensity;

    this.pulse.ids.forEach((id) => {
      const group = this.cubieGroups.get(id);
      group?.children.forEach((child) => {
        if (child.userData.type === "sticker" && child.material?.emissive && child !== this.highlighted) {
          child.material.emissive.set(this.visualStyle.highlightColor);
          child.material.emissiveIntensity = intensity;
        }
      });
    });

    if (progress >= 1) {
      this.pulse.ids.forEach((id) => {
        const group = this.cubieGroups.get(id);
        group?.children.forEach((child) => {
          if (child.userData.type === "sticker" && child.material?.emissive && child !== this.highlighted) {
            child.material.emissive.set(0x000000);
            child.material.emissiveIntensity = 0;
          }
        });
      });
      this.pulse = null;
    }
  }

  renderLoop = () => {
    if (this.disposed) {
      return;
    }
    this.controls.update();
    this.updatePulse();
    this.renderer.render(this.scene, this.camera);
    this.frameHandle = requestAnimationFrame(this.renderLoop);
  };
}
