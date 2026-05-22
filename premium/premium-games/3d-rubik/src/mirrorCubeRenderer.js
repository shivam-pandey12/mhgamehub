import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import {
  applyMirrorCubeMoveToState,
  cloneMirrorCubeState,
  getMirrorCubeDragCandidateMoves,
  getMirrorCubeMovePieces,
  getMirrorCubeSlotCenter,
  getMirrorCubieById,
  parseMirrorCubeMove
} from "./mirrorCubeState.js";

const DRAG_MATCH_THRESHOLD = 0.64;
const MIRROR_VISUAL_PRESETS = {
  ivoryMirror: {
    bodyColor: 0xece4d6,
    panelColor: 0xd5b36b,
    grooveColor: 0xb98d49,
    roughness: 0.34,
    metalness: 0.08,
    clearcoat: 0.74,
    clearcoatRoughness: 0.24,
    gap: 0.035,
    panelLift: 0.026,
    highlightColor: 0xf4cf72,
    pulseIntensity: 0.22
  },
  goldenMirror: {
    bodyColor: 0xd1a54f,
    panelColor: 0xf2d488,
    grooveColor: 0x8d6427,
    roughness: 0.28,
    metalness: 0.34,
    clearcoat: 0.86,
    clearcoatRoughness: 0.18,
    gap: 0.038,
    panelLift: 0.028,
    highlightColor: 0xffe29a,
    pulseIntensity: 0.24
  },
  silverMirror: {
    bodyColor: 0xbfc2bf,
    panelColor: 0xe8e8dd,
    grooveColor: 0x6f746f,
    roughness: 0.27,
    metalness: 0.28,
    clearcoat: 0.78,
    clearcoatRoughness: 0.2,
    gap: 0.04,
    panelLift: 0.026,
    highlightColor: 0xf5d386,
    pulseIntensity: 0.22
  },
  darkMirror: {
    bodyColor: 0x1d1b18,
    panelColor: 0xc49b4c,
    grooveColor: 0x0e0d0b,
    roughness: 0.3,
    metalness: 0.18,
    clearcoat: 0.68,
    clearcoatRoughness: 0.22,
    gap: 0.045,
    panelLift: 0.03,
    highlightColor: 0xffd777,
    pulseIntensity: 0.32
  }
};

const DEFAULT_VISUAL_PRESET = "ivoryMirror";

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

function vectorToThree(vector, scale = 1) {
  return new THREE.Vector3(vector.x * scale, vector.y * scale, vector.z * scale);
}

function axisToVector(axis) {
  if (axis === "x") return new THREE.Vector3(1, 0, 0);
  if (axis === "y") return new THREE.Vector3(0, 1, 0);
  return new THREE.Vector3(0, 0, 1);
}

function basisToQuaternion(basis) {
  const matrix = new THREE.Matrix4().makeBasis(
    vectorToThree(basis.x),
    vectorToThree(basis.y),
    vectorToThree(basis.z)
  );
  return new THREE.Quaternion().setFromRotationMatrix(matrix);
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

function slotToWorld(position) {
  return vectorToThree(getMirrorCubeSlotCenter(position));
}

function createBodyMaterial(style) {
  return new THREE.MeshPhysicalMaterial({
    color: style.bodyColor,
    roughness: style.roughness,
    metalness: style.metalness,
    clearcoat: style.clearcoat,
    clearcoatRoughness: style.clearcoatRoughness,
    sheen: 0.16,
    sheenColor: new THREE.Color(0xfff2dc)
  });
}

function createPanelMaterial(style, stickerFace = "U") {
  const faceTint = {
    U: 1.1,
    D: 0.9,
    F: 1.0,
    B: 0.82,
    R: 0.95,
    L: 1.03
  }[stickerFace] || 1;
  const color = new THREE.Color(style.panelColor).multiplyScalar(faceTint);
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: Math.max(0.18, style.roughness - 0.06),
    metalness: Math.min(0.48, style.metalness + 0.08),
    clearcoat: Math.min(0.95, style.clearcoat + 0.1),
    clearcoatRoughness: Math.max(0.12, style.clearcoatRoughness - 0.04),
    emissive: color,
    emissiveIntensity: 0
  });
}

function createGrooveMaterial(style) {
  return new THREE.MeshPhysicalMaterial({
    color: style.grooveColor,
    roughness: style.roughness + 0.16,
    metalness: style.metalness * 0.72,
    clearcoat: style.clearcoat * 0.4,
    clearcoatRoughness: style.clearcoatRoughness + 0.16
  });
}

function panelAxesForNormal(normal, dimensions) {
  if (normal.x) {
    return {
      width: Math.max(0.08, dimensions.z - 0.14),
      height: Math.max(0.08, dimensions.y - 0.14),
      depthAxis: "x",
      halfDepth: dimensions.x / 2
    };
  }
  if (normal.y) {
    return {
      width: Math.max(0.08, dimensions.x - 0.14),
      height: Math.max(0.08, dimensions.z - 0.14),
      depthAxis: "y",
      halfDepth: dimensions.y / 2
    };
  }
  return {
    width: Math.max(0.08, dimensions.x - 0.14),
    height: Math.max(0.08, dimensions.y - 0.14),
    depthAxis: "z",
    halfDepth: dimensions.z / 2
  };
}

export class MirrorCubeRenderer {
  constructor(container, mirrorState) {
    this.container = container;
    this.mirrorState = mirrorState;
    this.cubeState = mirrorState;
    this.visualPresetName = DEFAULT_VISUAL_PRESET;
    this.visualStyle = MIRROR_VISUAL_PRESETS[this.visualPresetName];
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
    this.controls.minDistance = 4.8;
    this.controls.maxDistance = 11;
    this.controls.minPolarAngle = Math.PI * 0.16;
    this.controls.maxPolarAngle = Math.PI * 0.84;
    this.controls.target.set(0, 0.06, 0);
    this.controls.enablePan = false;
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_ROTATE
    };

    this.createEnvironment();
    this.createCubies();
    this.resize();
    this.syncFromState();
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
    this.scene.fog = new THREE.Fog(0xfbf6ec, 13, 24);

    this.scene.add(new THREE.HemisphereLight(0xfff7e4, 0x3a3329, 2.3));

    const key = new THREE.DirectionalLight(0xffefc8, 4.75);
    key.position.set(4.8, 7.4, 5.5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 18;
    key.shadow.camera.left = -5;
    key.shadow.camera.right = 5;
    key.shadow.camera.top = 5;
    key.shadow.camera.bottom = -5;
    this.scene.add(key);

    const rim = new THREE.DirectionalLight(0xc5d8ff, 1.0);
    rim.position.set(-5, 3.2, -4);
    this.scene.add(rim);

    const stage = new THREE.Mesh(
      new THREE.CylinderGeometry(3.54, 3.9, 0.12, 96),
      new THREE.MeshPhysicalMaterial({
        color: 0xe1c99d,
        roughness: 0.74,
        metalness: 0.035,
        clearcoat: 0.24,
        clearcoatRoughness: 0.62
      })
    );
    stage.position.set(0, -2.02, 0);
    stage.receiveShadow = true;
    this.scene.add(stage);

    const shadowDisk = new THREE.Mesh(
      new THREE.CircleGeometry(4.45, 96),
      new THREE.MeshBasicMaterial({ color: 0x4a3420, transparent: true, opacity: 0.08, depthWrite: false })
    );
    shadowDisk.rotation.x = -Math.PI / 2;
    shadowDisk.position.y = -1.95;
    this.scene.add(shadowDisk);
  }

  createCubies() {
    this.mirrorState.cubies.forEach((cubie) => {
      const group = new THREE.Group();
      group.userData.cubieId = cubie.id;

      const bodySize = {
        x: Math.max(0.05, cubie.dimensions.x - this.visualStyle.gap),
        y: Math.max(0.05, cubie.dimensions.y - this.visualStyle.gap),
        z: Math.max(0.05, cubie.dimensions.z - this.visualStyle.gap)
      };
      const radius = Math.min(bodySize.x, bodySize.y, bodySize.z) * 0.12;
      const body = new THREE.Mesh(
        new RoundedBoxGeometry(bodySize.x, bodySize.y, bodySize.z, 5, radius),
        createBodyMaterial(this.visualStyle)
      );
      body.castShadow = cubie.type !== "core";
      body.receiveShadow = true;
      body.userData = { type: "body", cubieId: cubie.id };
      group.add(body);
      this.pickables.push(body);

      cubie.stickers.forEach((sticker) => {
        this.addPanel(group, cubie, sticker);
      });

      this.scene.add(group);
      this.cubieGroups.set(cubie.id, group);
    });
  }

  addPanel(group, cubie, sticker) {
    const normal = sticker.homeNormal;
    const dims = panelAxesForNormal(normal, cubie.dimensions);
    const depth = Math.min(0.035, Math.max(0.018, Math.min(dims.width, dims.height) * 0.08));
    const panel = new THREE.Mesh(
      new RoundedBoxGeometry(dims.width, dims.height, depth, 4, Math.min(dims.width, dims.height) * 0.075),
      createPanelMaterial(this.visualStyle, sticker.face)
    );
    const backing = new THREE.Mesh(
      new RoundedBoxGeometry(dims.width + 0.045, dims.height + 0.045, depth * 0.72, 4, Math.min(dims.width, dims.height) * 0.08),
      createGrooveMaterial(this.visualStyle)
    );
    const normalVector = vectorToThree(normal).normalize();
    const offset = dims.halfDepth + this.visualStyle.panelLift;
    [backing, panel].forEach((mesh, index) => {
      mesh.position.copy(normalVector.clone().multiplyScalar(offset - index * 0.002));
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normalVector);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = {
        type: index === 0 ? "backing" : "sticker",
        cubieId: cubie.id,
        stickerFace: sticker.face
      };
      group.add(mesh);
      this.pickables.push(mesh);
    });
  }

  disposeCubieMeshes() {
    this.clearHighlight();
    this.clearGuideHighlights();
    this.clearLayerPreview();
    this.pulse = null;
    this.cubieGroups.forEach((group) => {
      this.scene.remove(group);
      group.traverse((child) => {
        if (!child.isMesh) return;
        child.geometry?.dispose();
        child.material?.dispose();
      });
    });
    this.cubieGroups.clear();
    this.pickables = [];
  }

  rebuildCubies() {
    this.disposeCubieMeshes();
    this.createCubies();
    this.syncFromState();
    this.resetCamera(false);
  }

  setVisualPreset(presetName) {
    const nextStyle = MIRROR_VISUAL_PRESETS[presetName];
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
    this.mirrorState.cubies.forEach((cubie) => {
      const group = this.cubieGroups.get(cubie.id);
      if (!group) return;
      group.position.copy(slotToWorld(cubie.position));
      group.quaternion.copy(basisToQuaternion(cubie.basis));
      group.scale.setScalar(1);
    });
  }

  resetCamera() {
    this.setCameraPreset("isometric");
  }

  setCameraPreset(preset = "isometric") {
    const positions = {
      front: [0, 0.7, 6.45],
      top: [0.01, 6.45, 0.01],
      right: [6.25, 0.8, 0],
      isometric: [5.15, 3.75, 6.05]
    };
    const next = positions[preset] || positions.isometric;
    this.camera.position.set(next[0], next[1], next[2]);
    this.controls.target.set(0, 0.06, 0);
    this.controls.minDistance = 4.55;
    this.controls.maxDistance = 11.5;
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
    if (!hit) return null;

    const cubieId = hit.object.userData.cubieId;
    const cubie = getMirrorCubieById(this.mirrorState, cubieId);
    if (!cubie) return null;
    const normal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld).normalize();
    return {
      cubieId,
      cubie,
      piece: cubie,
      object: hit.object,
      point: hit.point.clone(),
      normal: roundWorldNormal(normal)
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
    this.cubieGroups.get(hit.cubieId)?.scale.setScalar(1.015);
  }

  clearHighlight() {
    if (!this.highlighted) return;
    if (this.highlighted.material?.emissive) {
      this.highlighted.material.emissive.set(this.highlighted.material.color || 0x000000);
      this.highlighted.material.emissiveIntensity = 0;
    }
    this.cubieGroups.forEach((group) => group.scale.setScalar(1));
    this.highlighted = null;
  }

  setGuideHighlights(targets = {}) {
    this.clearGuideHighlights();
    const ids = new Set(targets.cubieIds || targets.pieceIds || []);
    this.guideHighlightedIds = ids;
    ids.forEach((id) => {
      const group = this.cubieGroups.get(id);
      if (!group) return;
      group.scale.setScalar(1.024);
      group.children.forEach((child) => {
        if (child.material?.emissive) {
          child.material.emissive.set(this.visualStyle.highlightColor);
          child.material.emissiveIntensity = 0.18;
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
        if (child.material?.emissive && child !== this.highlighted) {
          child.material.emissive.set(child.material.color || 0x000000);
          child.material.emissiveIntensity = 0;
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
    const parsed = parseMirrorCubeMove(move);
    const signature = `${parsed.axis}:${parsed.layerIndex}:${parsed.quarterTurns}`;
    if (this.previewedLayer?.signature === signature) return;
    this.clearLayerPreview();
    const ids = getMirrorCubeMovePieces(this.mirrorState, parsed).map((cubie) => cubie.id);
    this.previewedLayer = { signature, ids: new Set(ids) };
    ids.forEach((id) => {
      const group = this.cubieGroups.get(id);
      if (!group) return;
      group.scale.setScalar(1.014);
      group.children.forEach((child) => {
        if (child.material?.emissive) {
          child.material.emissive.set(this.visualStyle.highlightColor);
          child.material.emissiveIntensity = 0.14;
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
        if (child.material?.emissive && child !== this.highlighted) {
          child.material.emissive.set(child.material.color || 0x000000);
          child.material.emissiveIntensity = 0;
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

    getMirrorCubeDragCandidateMoves(context.cubiePosition, context.faceNormal).forEach((move) => {
      const parsed = parseMirrorCubeMove(move);
      const axis = axisToVector(parsed.axis);
      const endPoint = startPoint.clone().applyAxisAngle(axis, parsed.quarterTurns * Math.PI * 0.28);
      const candidate = this.projectWorldToScreen(endPoint).sub(startScreen);
      const distance = candidate.length();
      if (distance < 2.5) return;
      const rawScore = candidate.normalize().dot(drag);
      const score = rawScore + (parsed.dragPriority ? 0.055 : 0);
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
    const parsed = parseMirrorCubeMove(move);
    const ids = new Set(layerCubies);
    const groups = [...ids].map((id) => this.cubieGroups.get(id)).filter(Boolean);
    const axis = axisToVector(parsed.axis);
    const targetAngle = parsed.quarterTurns * Math.PI * 0.5;
    const nextState = cloneMirrorCubeState(this.mirrorState);
    applyMirrorCubeMoveToState(nextState, parsed);
    const nextCubies = new Map(nextState.cubies.map((cubie) => [cubie.id, cubie]));
    const actualDuration = this.reduceMotion ? Math.min(duration, 70) : duration;
    const base = groups.map((group) => {
      const cubie = nextCubies.get(group.userData.cubieId);
      return {
        group,
        position: group.position.clone(),
        quaternion: group.quaternion.clone(),
        targetPosition: cubie ? slotToWorld(cubie.position) : group.position.clone(),
        targetQuaternion: cubie ? basisToQuaternion(cubie.basis) : group.quaternion.clone()
      };
    });

    if (actualDuration <= 0) return Promise.resolve();

    return new Promise((resolve) => {
      const startedAt = performance.now();
      const frame = (now) => {
        const progress = Math.min(1, (now - startedAt) / actualDuration);
        const eased = easeOutCubic(progress);
        const rotation = new THREE.Quaternion().setFromAxisAngle(axis, targetAngle * eased);
        base.forEach(({ group, position, quaternion, targetPosition, targetQuaternion }) => {
          const rotatedPosition = position.clone().applyAxisAngle(axis, targetAngle * eased);
          group.position.copy(rotatedPosition.lerp(targetPosition, eased * eased));
          const rotatedQuaternion = rotation.clone().multiply(quaternion);
          group.quaternion.copy(rotatedQuaternion.slerp(targetQuaternion, eased * eased));
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
    const ids = getMirrorCubeMovePieces(this.mirrorState, move).map((cubie) => cubie.id);
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
    this.pulse.ids.forEach((id) => {
      const group = this.cubieGroups.get(id);
      group?.children.forEach((child) => {
        if (child.material?.emissive && child !== this.highlighted) {
          child.material.emissive.set(this.visualStyle.highlightColor);
          child.material.emissiveIntensity = intensity;
        }
      });
    });
    if (progress >= 1) {
      this.pulse.ids.forEach((id) => {
        const group = this.cubieGroups.get(id);
        group?.children.forEach((child) => {
          if (child.material?.emissive && child !== this.highlighted) {
            child.material.emissive.set(child.material.color || 0x000000);
            child.material.emissiveIntensity = 0;
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
