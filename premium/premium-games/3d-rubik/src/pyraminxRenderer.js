import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  PYRAMINX_FACE_DEFINITIONS,
  PYRAMINX_VERTEX_LABELS,
  getPyraminxDragCandidateMoves,
  getPyraminxMovePieces,
  getPyraminxPieceById,
  parsePyraminxMove
} from "./pyraminxState.js";

const DRAG_MATCH_THRESHOLD = 0.62;
const ORDER = 3;

const VERTEX_POSITIONS = {
  U: new THREE.Vector3(0, 1.9596, 0),
  L: new THREE.Vector3(-1.6, -0.6532, 0.9238),
  R: new THREE.Vector3(1.6, -0.6532, 0.9238),
  B: new THREE.Vector3(0, -0.6532, -1.8476)
};

const PYRAMINX_VISUAL_PRESETS = {
  ivoryPyraminx: {
    bodyColor: 0xe8dfd0,
    backingColor: 0xefe4cf,
    grooveColor: 0xb68b46,
    roughness: 0.38,
    metalness: 0.025,
    clearcoat: 0.72,
    clearcoatRoughness: 0.24,
    panelDepth: 0.07,
    backingDepth: 0.09,
    stickerScale: 0.78,
    backingScale: 0.92,
    panelLift: 0.075,
    emissive: 0,
    highlightColor: 0xf3cf78,
    pulseIntensity: 0.2,
    faceColors: {
      U: "#f8f4e9",
      L: "#35a767",
      R: "#3479d8",
      B: "#e1b84a"
    }
  },
  classicPyraminx: {
    bodyColor: 0x171511,
    backingColor: 0x171511,
    grooveColor: 0x111111,
    roughness: 0.46,
    metalness: 0.08,
    clearcoat: 0.38,
    clearcoatRoughness: 0.42,
    panelDepth: 0.068,
    backingDepth: 0.1,
    stickerScale: 0.74,
    backingScale: 0.91,
    panelLift: 0.08,
    emissive: 0,
    highlightColor: 0xffd889,
    pulseIntensity: 0.24,
    faceColors: {
      U: "#f9f9f2",
      L: "#0ca856",
      R: "#246bde",
      B: "#ffd84d"
    }
  },
  glassPyraminx: {
    bodyColor: 0xeaf5ff,
    backingColor: 0xd9e9f6,
    grooveColor: 0xb6d0f0,
    roughness: 0.2,
    metalness: 0.02,
    clearcoat: 0.95,
    clearcoatRoughness: 0.12,
    opacity: 0.78,
    panelDepth: 0.066,
    backingDepth: 0.09,
    stickerScale: 0.77,
    backingScale: 0.92,
    panelLift: 0.078,
    emissive: 0.02,
    highlightColor: 0x9ad8ff,
    pulseIntensity: 0.26,
    faceColors: {
      U: "#fbfdff",
      L: "#2ac875",
      R: "#46a0ff",
      B: "#ffd96a"
    }
  },
  darkPyraminx: {
    bodyColor: 0x12131a,
    backingColor: 0x1d2030,
    grooveColor: 0x222631,
    roughness: 0.31,
    metalness: 0.13,
    clearcoat: 0.72,
    clearcoatRoughness: 0.2,
    panelDepth: 0.07,
    backingDepth: 0.1,
    stickerScale: 0.74,
    backingScale: 0.9,
    panelLift: 0.082,
    emissive: 0.13,
    highlightColor: 0x6fffd6,
    pulseIntensity: 0.34,
    faceColors: {
      U: "#f2fbff",
      L: "#25f07c",
      R: "#39a5ff",
      B: "#ffe45a"
    }
  }
};

const DEFAULT_VISUAL_PRESET = "ivoryPyraminx";

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

function coordToWorld(coord) {
  const point = new THREE.Vector3();
  PYRAMINX_VERTEX_LABELS.forEach((label) => {
    point.addScaledVector(VERTEX_POSITIONS[label], coord[label] / ORDER);
  });
  return point;
}

function triangleCentroid(points) {
  return points.reduce((sum, point) => sum.add(point), new THREE.Vector3()).multiplyScalar(1 / points.length);
}

function faceNormal(points) {
  const normal = new THREE.Vector3()
    .subVectors(points[1], points[0])
    .cross(new THREE.Vector3().subVectors(points[2], points[0]))
    .normalize();
  const centroid = triangleCentroid(points);
  if (normal.dot(centroid) < 0) {
    normal.multiplyScalar(-1);
  }
  return normal;
}

function scaledTriangle(points, scale, lift = 0) {
  const centroid = triangleCentroid(points);
  const normal = faceNormal(points);
  return points.map((point) => (
    centroid.clone().add(point.clone().sub(centroid).multiplyScalar(scale)).addScaledVector(normal, lift)
  ));
}

function createTrianglePrismGeometry(points, depth = 0.06) {
  const normal = faceNormal(points);
  const front = points.map((point) => point.clone().addScaledVector(normal, depth * 0.5));
  const back = points.map((point) => point.clone().addScaledVector(normal, -depth * 0.5));
  const vertices = [...front, ...back].flatMap((point) => [point.x, point.y, point.z]);
  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex([
    0, 1, 2,
    5, 4, 3,
    0, 3, 4, 0, 4, 1,
    1, 4, 5, 1, 5, 2,
    2, 5, 3, 2, 3, 0
  ]);
  geometry.computeVertexNormals();
  return geometry;
}

function createTetraGeometry(scale = 0.925) {
  const positions = Object.fromEntries(PYRAMINX_VERTEX_LABELS.map((label) => [
    label,
    VERTEX_POSITIONS[label].clone().multiplyScalar(scale)
  ]));
  const faces = [
    ["L", "R", "B"],
    ["U", "B", "R"],
    ["U", "L", "B"],
    ["U", "R", "L"]
  ];
  const vertices = [];
  const indices = [];

  faces.forEach((face) => {
    const start = vertices.length / 3;
    let points = face.map((label) => positions[label]);
    if (faceNormal(points).dot(points[0]) < 0) {
      points = points.slice().reverse();
    }
    points.forEach((point) => vertices.push(point.x, point.y, point.z));
    indices.push(start, start + 1, start + 2);
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createPanelMaterial(sticker, style) {
  const color = style.faceColors[sticker.face] || PYRAMINX_FACE_DEFINITIONS[sticker.face]?.color || sticker.color;
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness: style.roughness,
    metalness: style.metalness,
    clearcoat: style.clearcoat,
    clearcoatRoughness: style.clearcoatRoughness,
    sheen: 0.12,
    sheenColor: new THREE.Color(0xfff3dd),
    emissive: new THREE.Color(color),
    emissiveIntensity: style.emissive || 0
  });
}

function createBodyMaterial(style) {
  return new THREE.MeshPhysicalMaterial({
    color: style.bodyColor,
    roughness: style.roughness + 0.1,
    metalness: style.metalness,
    clearcoat: style.clearcoat * 0.7,
    clearcoatRoughness: style.clearcoatRoughness + 0.16,
    transparent: Boolean(style.opacity),
    opacity: style.opacity ?? 1
  });
}

function createBackingMaterial(style) {
  return new THREE.MeshPhysicalMaterial({
    color: style.backingColor,
    roughness: style.roughness + 0.16,
    metalness: style.metalness,
    clearcoat: style.clearcoat * 0.5,
    clearcoatRoughness: style.clearcoatRoughness + 0.2,
    transparent: Boolean(style.opacity),
    opacity: style.opacity ?? 1
  });
}

function axisForVertex(vertex) {
  return VERTEX_POSITIONS[vertex].clone().normalize();
}

export class PyraminxRenderer {
  constructor(container, pyraminxState) {
    this.container = container;
    this.pyraminxState = pyraminxState;
    this.cubeState = pyraminxState;
    this.visualPresetName = DEFAULT_VISUAL_PRESET;
    this.visualStyle = PYRAMINX_VISUAL_PRESETS[this.visualPresetName];
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.raycaster = new THREE.Raycaster();
    this.pointerNdc = new THREE.Vector2();
    this.pieceGroups = new Map();
    this.pickables = [];
    this.highlighted = null;
    this.guideHighlightedIds = new Set();
    this.previewedLayer = null;
    this.pulse = null;
    this.renderSettings = {
      quality: "balanced",
      reducedMotion: false,
      animationSpeed: "normal"
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

    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.085;
    this.controls.minDistance = 4.2;
    this.controls.maxDistance = 9.5;
    this.controls.minPolarAngle = Math.PI * 0.14;
    this.controls.maxPolarAngle = Math.PI * 0.86;
    this.controls.target.set(0, 0.05, 0);
    this.controls.enablePan = false;
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_ROTATE
    };

    this.createEnvironment();
    this.createPyraminx();
    this.resize();
    this.resetCamera(false);

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
    this.disposePyraminxMeshes();
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
    this.scene.fog = new THREE.Fog(0xfbf6ec, 12, 22);

    const hemi = new THREE.HemisphereLight(0xfff7e4, 0x3a3329, 2.35);
    this.scene.add(hemi);

    const key = new THREE.DirectionalLight(0xfff1c8, 4.6);
    key.position.set(4.4, 7.4, 5.2);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 18;
    key.shadow.camera.left = -5;
    key.shadow.camera.right = 5;
    key.shadow.camera.top = 5;
    key.shadow.camera.bottom = -5;
    this.scene.add(key);

    const rim = new THREE.DirectionalLight(0xc5d8ff, 1.12);
    rim.position.set(-5, 3, -4);
    this.scene.add(rim);

    const stageMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xe1c99d,
      roughness: 0.74,
      metalness: 0.035,
      clearcoat: 0.24,
      clearcoatRoughness: 0.62
    });
    const stage = new THREE.Mesh(new THREE.CylinderGeometry(3.45, 3.78, 0.12, 96), stageMaterial);
    stage.position.set(0, -1.92, 0);
    stage.receiveShadow = true;
    this.scene.add(stage);

    const shadowDisk = new THREE.Mesh(
      new THREE.CircleGeometry(4.35, 96),
      new THREE.MeshBasicMaterial({ color: 0x4a3420, transparent: true, opacity: 0.08, depthWrite: false })
    );
    shadowDisk.rotation.x = -Math.PI / 2;
    shadowDisk.position.y = -1.85;
    this.scene.add(shadowDisk);
  }

  createPyraminx() {
    this.bodyMesh = new THREE.Mesh(createTetraGeometry(), createBodyMaterial(this.visualStyle));
    this.bodyMesh.castShadow = true;
    this.bodyMesh.receiveShadow = true;
    this.scene.add(this.bodyMesh);

    this.pyraminxState.pieces.forEach((piece) => {
      const group = new THREE.Group();
      group.userData = { pieceId: piece.id, type: piece.type };
      this.rebuildPieceGroup(piece, group);
      this.scene.add(group);
      this.pieceGroups.set(piece.id, group);
    });
  }

  rebuildPieceGroup(piece, group) {
    const stale = [...group.children];
    stale.forEach((child) => {
      group.remove(child);
      child.geometry?.dispose();
      child.material?.dispose();
      const index = this.pickables.indexOf(child);
      if (index >= 0) this.pickables.splice(index, 1);
    });

    piece.stickers.forEach((sticker) => {
      const rawPoints = sticker.triangle.map(coordToWorld);
      const backingPoints = scaledTriangle(rawPoints, this.visualStyle.backingScale, this.visualStyle.panelLift * 0.35);
      const stickerPoints = scaledTriangle(rawPoints, this.visualStyle.stickerScale, this.visualStyle.panelLift);
      const backing = new THREE.Mesh(
        createTrianglePrismGeometry(backingPoints, this.visualStyle.backingDepth),
        createBackingMaterial(this.visualStyle)
      );
      backing.castShadow = true;
      backing.receiveShadow = true;
      backing.userData = {
        type: "backing",
        pieceId: piece.id,
        stickerId: sticker.id
      };
      group.add(backing);
      this.pickables.push(backing);

      const panel = new THREE.Mesh(
        createTrianglePrismGeometry(stickerPoints, this.visualStyle.panelDepth),
        createPanelMaterial(sticker, this.visualStyle)
      );
      panel.castShadow = true;
      panel.receiveShadow = true;
      panel.userData = {
        type: "sticker",
        pieceId: piece.id,
        stickerId: sticker.id,
        stickerFace: sticker.face,
        baseEmissive: this.visualStyle.emissive || 0
      };
      group.add(panel);
      this.pickables.push(panel);
    });
  }

  disposePyraminxMeshes() {
    this.clearHighlight();
    this.clearGuideHighlights();
    this.clearLayerPreview();
    this.pulse = null;

    if (this.bodyMesh) {
      this.scene.remove(this.bodyMesh);
      this.bodyMesh.geometry?.dispose();
      this.bodyMesh.material?.dispose();
      this.bodyMesh = null;
    }

    this.pieceGroups.forEach((group) => {
      this.scene.remove(group);
      group.traverse((child) => {
        if (!child.isMesh) return;
        child.geometry?.dispose();
        child.material?.dispose();
      });
    });

    this.pieceGroups.clear();
    this.pickables = [];
  }

  rebuildCubies() {
    this.disposePyraminxMeshes();
    this.createPyraminx();
    this.syncFromState();
    this.resetCamera(false);
  }

  setVisualPreset(presetName) {
    const nextStyle = PYRAMINX_VISUAL_PRESETS[presetName];
    if (!nextStyle) return false;
    if (presetName === this.visualPresetName) return true;
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
    this.renderSettings = { ...this.renderSettings, ...settings };
    this.reduceMotion = Boolean(this.renderSettings.reducedMotion) ||
      (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false);
    const cameraSensitivity = Math.min(1.75, Math.max(0.5, Number(this.renderSettings.cameraSensitivity || 1)));
    this.controls.rotateSpeed = cameraSensitivity;
    this.controls.zoomSpeed = 0.85 * cameraSensitivity;
    if (previousQuality !== this.renderSettings.quality || !this.qualityApplied) {
      this.applyQualityMode(this.renderSettings.quality);
    }
  }

  applyQualityMode(quality = "balanced") {
    const pixelRatio = quality === "high" ? 2 : quality === "performance" ? 1.15 : 1.5;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatio));
    this.renderer.shadowMap.enabled = quality !== "performance";
    this.qualityApplied = true;
    this.resize();
  }

  syncFromState() {
    this.pyraminxState.pieces.forEach((piece) => {
      const group = this.pieceGroups.get(piece.id);
      if (!group) return;
      group.quaternion.identity();
      group.scale.setScalar(1);
      this.rebuildPieceGroup(piece, group);
    });
  }

  resetCamera(smooth = true) {
    this.setCameraPreset("isometric", smooth);
  }

  setCameraPreset(preset = "isometric") {
    const positions = {
      front: [0, 0.72, 6.05],
      top: [0.01, 6.1, 0.01],
      right: [5.85, 0.75, 0],
      isometric: [4.8, 3.35, 5.65]
    };
    const next = positions[preset] || positions.isometric;
    this.camera.position.set(next[0], next[1], next[2]);
    this.controls.target.set(0, 0.05, 0);
    this.controls.minDistance = 3.7;
    this.controls.maxDistance = 9.7;
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
    const hit = intersections.find((entry) => entry.object.userData.pieceId);
    if (!hit) return null;

    const pieceId = hit.object.userData.pieceId;
    const piece = getPyraminxPieceById(this.pyraminxState, pieceId);
    if (!piece) return null;

    const normal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld).normalize();
    return {
      cubieId: pieceId,
      cubie: piece,
      piece,
      object: hit.object,
      point: hit.point.clone(),
      normal
    };
  }

  setHighlight(hit) {
    this.clearHighlight();
    if (!hit?.object) return;
    this.highlighted = hit.object;
    if (hit.object.material?.emissive) {
      hit.object.material.emissive.set(this.visualStyle.highlightColor);
      hit.object.material.emissiveIntensity = 0.3;
    }
    const group = this.pieceGroups.get(hit.cubieId);
    group?.scale.setScalar(1.018);
  }

  clearHighlight() {
    if (!this.highlighted) return;
    const base = this.visualStyle.emissive || 0;
    if (this.highlighted.material?.emissive) {
      this.highlighted.material.emissive.set(this.highlighted.material.color || 0x000000);
      this.highlighted.material.emissiveIntensity = base;
    }
    this.pieceGroups.forEach((group) => group.scale.setScalar(1));
    this.highlighted = null;
  }

  setGuideHighlights(targets = {}) {
    this.clearGuideHighlights();
    const ids = new Set(targets.pieceIds || targets.faceletIds || targets.cubieIds || []);
    this.guideHighlightedIds = ids;
    ids.forEach((id) => {
      const group = this.pieceGroups.get(id);
      if (!group) return;
      group.scale.setScalar(1.025);
      group.children.forEach((child) => {
        if (child.userData.type === "sticker" && child.material?.emissive) {
          child.material.emissive.set(this.visualStyle.highlightColor);
          child.material.emissiveIntensity = 0.2;
        }
      });
    });
  }

  clearGuideHighlights() {
    if (!this.guideHighlightedIds?.size) {
      this.guideHighlightedIds = new Set();
      return;
    }
    const base = this.visualStyle.emissive || 0;
    this.guideHighlightedIds.forEach((id) => {
      const group = this.pieceGroups.get(id);
      if (!group) return;
      group.scale.setScalar(1);
      group.children.forEach((child) => {
        if (child.userData.type === "sticker" && child.material?.emissive && child !== this.highlighted) {
          child.material.emissive.set(child.material.color || 0x000000);
          child.material.emissiveIntensity = base;
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
    const parsed = parsePyraminxMove(move);
    const signature = `${parsed.vertex}:${parsed.isTip}:${parsed.turn}`;
    if (this.previewedLayer?.signature === signature) return;

    this.clearLayerPreview();
    const ids = getPyraminxMovePieces(this.pyraminxState, parsed).map((piece) => piece.id);
    this.previewedLayer = { signature, ids: new Set(ids) };
    ids.forEach((id) => {
      const group = this.pieceGroups.get(id);
      if (!group) return;
      group.scale.setScalar(1.016);
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
    const base = this.visualStyle.emissive || 0;
    this.previewedLayer.ids.forEach((id) => {
      if (this.guideHighlightedIds?.has(id)) return;
      const group = this.pieceGroups.get(id);
      if (!group) return;
      group.scale.setScalar(1);
      group.children.forEach((child) => {
        if (child.userData.type === "sticker" && child.material?.emissive && child !== this.highlighted) {
          child.material.emissive.set(child.material.color || 0x000000);
          child.material.emissiveIntensity = base;
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
    if (drag.length() < 1) return null;
    drag.normalize();

    const startPoint = context.point.clone();
    const startScreen = this.projectWorldToScreen(startPoint);
    let best = null;

    getPyraminxDragCandidateMoves(context.cubiePosition, {
      pieceType: context.pieceType,
      pieceId: context.pieceId
    }).forEach((move) => {
      const parsed = parsePyraminxMove(move);
      const axis = axisForVertex(parsed.vertex);
      const endPoint = startPoint.clone().applyAxisAngle(axis, parsed.angle * 0.32);
      const candidate = this.projectWorldToScreen(endPoint).sub(startScreen);
      const distance = candidate.length();
      if (distance < 2.5) return;
      const rawScore = candidate.normalize().dot(drag);
      const score = rawScore + (parsed.isTip ? 0.045 : 0.035);
      if (!best || score > best.score) {
        best = { move: parsed, score, rawScore, distance };
      }
    });

    if (!best || best.rawScore < DRAG_MATCH_THRESHOLD) return null;
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
    } else {
      this.clearLayerPreview();
    }
    return move;
  }

  animateMove(move, { duration = 260, layerCubies = [] } = {}) {
    const parsed = parsePyraminxMove(move);
    const ids = new Set(layerCubies);
    const groups = [...ids].map((id) => this.pieceGroups.get(id)).filter(Boolean);
    const axis = axisForVertex(parsed.vertex);
    const targetAngle = parsed.angle;
    const actualDuration = this.reduceMotion ? Math.min(duration, 70) : duration;
    const base = groups.map((group) => ({ group, quaternion: group.quaternion.clone() }));

    if (actualDuration <= 0) return Promise.resolve();

    return new Promise((resolve) => {
      const startedAt = performance.now();
      const frame = (now) => {
        const progress = Math.min(1, (now - startedAt) / actualDuration);
        const eased = easeOutCubic(progress);
        const rotation = new THREE.Quaternion().setFromAxisAngle(axis, targetAngle * eased);
        base.forEach(({ group, quaternion }) => {
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
    const ids = getPyraminxMovePieces(this.pyraminxState, move).map((piece) => piece.id);
    this.pulse = {
      ids: new Set(ids),
      startedAt: performance.now(),
      duration: this.reduceMotion ? 80 : 260
    };
  }

  updatePulse() {
    if (!this.pulse) return;
    const elapsed = performance.now() - this.pulse.startedAt;
    const progress = Math.min(1, elapsed / this.pulse.duration);
    const intensity = Math.sin(progress * Math.PI) * this.visualStyle.pulseIntensity;
    const base = this.visualStyle.emissive || 0;

    this.pulse.ids.forEach((id) => {
      const group = this.pieceGroups.get(id);
      group?.children.forEach((child) => {
        if (child.userData.type === "sticker" && child.material?.emissive && child !== this.highlighted) {
          child.material.emissive.set(this.visualStyle.highlightColor);
          child.material.emissiveIntensity = intensity;
        }
      });
    });

    if (progress >= 1) {
      this.pulse.ids.forEach((id) => {
        const group = this.pieceGroups.get(id);
        group?.children.forEach((child) => {
          if (child.userData.type === "sticker" && child.material?.emissive && child !== this.highlighted) {
            child.material.emissive.set(child.material.color || 0x000000);
            child.material.emissiveIntensity = base;
          }
        });
      });
      this.pulse = null;
    }
  }

  renderLoop = () => {
    if (this.disposed) return;
    this.controls.update();
    this.updatePulse();
    this.renderer.render(this.scene, this.camera);
    this.frameHandle = requestAnimationFrame(this.renderLoop);
  };
}
