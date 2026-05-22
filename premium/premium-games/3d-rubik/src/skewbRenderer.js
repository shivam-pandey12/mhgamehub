import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";
import {
  SKEWB_FACE_DEFINITIONS,
  SKEWB_MOVE_AXES,
  getSkewbDragCandidateMoves,
  getSkewbMovePieces,
  getSkewbPieceById,
  parseSkewbMove
} from "./skewbState.js";

const DRAG_MATCH_THRESHOLD = 0.58;
const FACE_PLANE = 1.34;
const CORNER_OUTER = 1.12;
const CORNER_INNER = 0.24;
const CENTER_RADIUS = 0.58;

const SKEWB_VISUAL_PRESETS = {
  ivorySkewb: {
    bodyColor: 0xe9dfcf,
    grooveColor: 0xb88945,
    backingColor: 0xf1e4ce,
    roughness: 0.38,
    metalness: 0.025,
    clearcoat: 0.74,
    clearcoatRoughness: 0.22,
    stickerLift: 0.045,
    stickerDepth: 0.055,
    emissive: 0,
    highlightColor: 0xf2cf76,
    pulseIntensity: 0.2,
    faceColors: {
      U: "#f8f4ea",
      D: "#e2b74d",
      F: "#41a865",
      B: "#3b78d2",
      R: "#d65445",
      L: "#d8893b"
    }
  },
  classicSkewb: {
    bodyColor: 0x171511,
    grooveColor: 0x0d0c0a,
    backingColor: 0x171511,
    roughness: 0.48,
    metalness: 0.08,
    clearcoat: 0.4,
    clearcoatRoughness: 0.42,
    stickerLift: 0.052,
    stickerDepth: 0.058,
    emissive: 0,
    highlightColor: 0xffd889,
    pulseIntensity: 0.24,
    faceColors: {
      U: "#f8f8f2",
      D: "#ffd84d",
      F: "#0ca856",
      B: "#236bde",
      R: "#d92d24",
      L: "#f28a20"
    }
  },
  glassSkewb: {
    bodyColor: 0xe8f5ff,
    grooveColor: 0xb7cfe8,
    backingColor: 0xd9eaf6,
    roughness: 0.2,
    metalness: 0.025,
    clearcoat: 0.95,
    clearcoatRoughness: 0.12,
    opacity: 0.78,
    stickerLift: 0.052,
    stickerDepth: 0.055,
    emissive: 0.025,
    highlightColor: 0x9ad8ff,
    pulseIntensity: 0.26,
    faceColors: {
      U: "#fbfdff",
      D: "#ffd96a",
      F: "#2ac875",
      B: "#46a0ff",
      R: "#ff6a5f",
      L: "#ffa846"
    }
  },
  darkSkewb: {
    bodyColor: 0x12131a,
    grooveColor: 0x252737,
    backingColor: 0x1d2030,
    roughness: 0.32,
    metalness: 0.13,
    clearcoat: 0.72,
    clearcoatRoughness: 0.2,
    stickerLift: 0.055,
    stickerDepth: 0.058,
    emissive: 0.13,
    highlightColor: 0x6fffd6,
    pulseIntensity: 0.34,
    faceColors: {
      U: "#f2fbff",
      D: "#ffe45a",
      F: "#25f07c",
      B: "#39a5ff",
      R: "#ff4d66",
      L: "#ff9d2d"
    }
  }
};

const DEFAULT_VISUAL_PRESET = "ivorySkewb";

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

function vectorToThree(vector) {
  return new THREE.Vector3(vector.x, vector.y, vector.z);
}

function faceNormal(points) {
  const normal = new THREE.Vector3()
    .subVectors(points[1], points[0])
    .cross(new THREE.Vector3().subVectors(points[2], points[0]))
    .normalize();
  const centroid = points.reduce((sum, point) => sum.add(point), new THREE.Vector3()).multiplyScalar(1 / points.length);
  if (normal.dot(centroid) < 0) {
    normal.multiplyScalar(-1);
  }
  return normal;
}

function createPrismGeometry(points, depth = 0.05) {
  const normal = faceNormal(points);
  const front = points.map((point) => point.clone().addScaledVector(normal, depth * 0.5));
  const back = points.map((point) => point.clone().addScaledVector(normal, -depth * 0.5));
  const vertices = [...front, ...back].flatMap((point) => [point.x, point.y, point.z]);
  const geometry = new THREE.BufferGeometry();
  const count = points.length;
  const indices = [];

  for (let index = 1; index < count - 1; index += 1) {
    indices.push(0, index, index + 1);
    indices.push(count, count + index + 1, count + index);
  }

  for (let index = 0; index < count; index += 1) {
    const next = (index + 1) % count;
    indices.push(index, count + index, count + next, index, count + next, next);
  }

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createBodyMaterial(style) {
  return new THREE.MeshPhysicalMaterial({
    color: style.bodyColor,
    roughness: style.roughness + 0.08,
    metalness: style.metalness,
    clearcoat: style.clearcoat * 0.72,
    clearcoatRoughness: style.clearcoatRoughness + 0.14,
    transparent: Boolean(style.opacity),
    opacity: style.opacity ?? 1
  });
}

function createStickerMaterial(sticker, style) {
  const color = style.faceColors[sticker.homeFace] || SKEWB_FACE_DEFINITIONS[sticker.homeFace]?.color || sticker.color;
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness: style.roughness,
    metalness: style.metalness,
    clearcoat: style.clearcoat,
    clearcoatRoughness: style.clearcoatRoughness,
    sheen: 0.1,
    sheenColor: new THREE.Color(0xfff2d8),
    emissive: new THREE.Color(color),
    emissiveIntensity: style.emissive || 0
  });
}

function createGrooveMaterial(style) {
  return new THREE.MeshPhysicalMaterial({
    color: style.grooveColor,
    roughness: style.roughness + 0.18,
    metalness: style.metalness,
    clearcoat: style.clearcoat * 0.36,
    clearcoatRoughness: style.clearcoatRoughness + 0.22
  });
}

function averagePoints(points) {
  return points.reduce((sum, point) => sum.add(point), new THREE.Vector3()).multiplyScalar(1 / Math.max(points.length, 1));
}

function insetPoints(points, amount) {
  const center = averagePoints(points);
  return points.map((point) => center.clone().lerp(point, amount));
}

function translateGeometry(geometry, anchor) {
  geometry.translate(-anchor.x, -anchor.y, -anchor.z);
  return geometry;
}

function makeCornerStickerPoints(slot, normal, lift = 0) {
  const sx = slot.x;
  const sy = slot.y;
  const sz = slot.z;

  if (normal.x) {
    const x = normal.x * (FACE_PLANE + lift);
    return [
      new THREE.Vector3(x, sy * CORNER_OUTER, sz * CORNER_OUTER),
      new THREE.Vector3(x, sy * CORNER_INNER, sz * CORNER_OUTER),
      new THREE.Vector3(x, sy * CORNER_OUTER, sz * CORNER_INNER)
    ];
  }

  if (normal.y) {
    const y = normal.y * (FACE_PLANE + lift);
    return [
      new THREE.Vector3(sx * CORNER_OUTER, y, sz * CORNER_OUTER),
      new THREE.Vector3(sx * CORNER_OUTER, y, sz * CORNER_INNER),
      new THREE.Vector3(sx * CORNER_INNER, y, sz * CORNER_OUTER)
    ];
  }

  const z = normal.z * (FACE_PLANE + lift);
  return [
    new THREE.Vector3(sx * CORNER_OUTER, sy * CORNER_OUTER, z),
    new THREE.Vector3(sx * CORNER_INNER, sy * CORNER_OUTER, z),
    new THREE.Vector3(sx * CORNER_OUTER, sy * CORNER_INNER, z)
  ];
}

function makeCenterStickerPoints(normal, lift = 0) {
  if (normal.x) {
    const x = normal.x * (FACE_PLANE + lift);
    return [
      new THREE.Vector3(x, 0, CENTER_RADIUS),
      new THREE.Vector3(x, CENTER_RADIUS, 0),
      new THREE.Vector3(x, 0, -CENTER_RADIUS),
      new THREE.Vector3(x, -CENTER_RADIUS, 0)
    ];
  }

  if (normal.y) {
    const y = normal.y * (FACE_PLANE + lift);
    return [
      new THREE.Vector3(0, y, CENTER_RADIUS),
      new THREE.Vector3(CENTER_RADIUS, y, 0),
      new THREE.Vector3(0, y, -CENTER_RADIUS),
      new THREE.Vector3(-CENTER_RADIUS, y, 0)
    ];
  }

  const z = normal.z * (FACE_PLANE + lift);
  return [
    new THREE.Vector3(0, CENTER_RADIUS, z),
    new THREE.Vector3(CENTER_RADIUS, 0, z),
    new THREE.Vector3(0, -CENTER_RADIUS, z),
    new THREE.Vector3(-CENTER_RADIUS, 0, z)
  ];
}

function axisForMove(move) {
  return vectorToThree(move.axis || SKEWB_MOVE_AXES[move.face || move.corner || "R"]).normalize();
}

function pieceAnchor(piece, slot = piece.slot) {
  const scalar = piece.type === "corner" ? 0.78 : 1.08;
  return vectorToThree(slot).multiplyScalar(scalar);
}

function basisQuaternion(primary, tangent) {
  const z = vectorToThree(primary).normalize();
  const x = vectorToThree(tangent)
    .sub(z.clone().multiplyScalar(vectorToThree(tangent).dot(z)))
    .normalize();
  const y = new THREE.Vector3().crossVectors(z, x).normalize();
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
}

function tangentForNormal(normal) {
  if (normal.x) return { x: 0, y: 1, z: 0 };
  if (normal.y) return { x: 0, y: 0, z: 1 };
  return { x: 1, y: 0, z: 0 };
}

function pieceFrame(piece, useHome = false) {
  if (piece.type === "center") {
    const primary = useHome ? piece.stickers[0].homeNormal : piece.stickers[0].normal;
    return {
      primary,
      tangent: (useHome ? piece.homeTangent : piece.tangent) || tangentForNormal(primary)
    };
  }

  return {
    primary: useHome ? piece.stickers[0].homeNormal : piece.stickers[0].normal,
    tangent: useHome ? piece.stickers[1].homeNormal : piece.stickers[1].normal
  };
}

function pieceQuaternion(piece) {
  const home = pieceFrame(piece, true);
  const current = pieceFrame(piece, false);
  return basisQuaternion(current.primary, current.tangent)
    .multiply(basisQuaternion(home.primary, home.tangent).invert());
}

function homeStickerPoints(piece, sticker, lift = 0) {
  return piece.type === "corner"
    ? makeCornerStickerPoints(piece.homeSlot, sticker.homeNormal, lift)
    : makeCenterStickerPoints(sticker.homeNormal, lift);
}

function createPieceBodyGeometry(piece) {
  const outer = piece.stickers.flatMap((sticker) => homeStickerPoints(piece, sticker, 0));
  const innerScale = piece.type === "corner" ? 0.58 : 0.7;
  const inner = outer.map((point) => point.clone().multiplyScalar(innerScale));
  return new ConvexGeometry([...outer, ...inner]);
}

export class SkewbRenderer {
  constructor(container, skewbState) {
    this.container = container;
    this.skewbState = skewbState;
    this.cubeState = skewbState;
    this.visualPresetName = DEFAULT_VISUAL_PRESET;
    this.visualStyle = SKEWB_VISUAL_PRESETS[this.visualPresetName];
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
    this.controls.minDistance = 4.6;
    this.controls.maxDistance = 10;
    this.controls.minPolarAngle = Math.PI * 0.16;
    this.controls.maxPolarAngle = Math.PI * 0.84;
    this.controls.target.set(0, 0.05, 0);
    this.controls.enablePan = false;
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_ROTATE
    };

    this.createEnvironment();
    this.createSkewb();
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
    this.disposeSkewbMeshes();
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

    const key = new THREE.DirectionalLight(0xffefc8, 4.65);
    key.position.set(4.6, 7.2, 5.2);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 18;
    key.shadow.camera.left = -5;
    key.shadow.camera.right = 5;
    key.shadow.camera.top = 5;
    key.shadow.camera.bottom = -5;
    this.scene.add(key);

    const rim = new THREE.DirectionalLight(0xc5d8ff, 1.05);
    rim.position.set(-5, 3, -4);
    this.scene.add(rim);

    const stage = new THREE.Mesh(
      new THREE.CylinderGeometry(3.42, 3.78, 0.12, 96),
      new THREE.MeshPhysicalMaterial({
        color: 0xe1c99d,
        roughness: 0.74,
        metalness: 0.035,
        clearcoat: 0.24,
        clearcoatRoughness: 0.62
      })
    );
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

  createSkewb() {
    this.skewbState.pieces.forEach((piece) => {
      const group = new THREE.Group();
      group.userData = { pieceId: piece.id, type: piece.type };
      this.rebuildPieceGroup(piece, group);
      this.scene.add(group);
      this.pieceGroups.set(piece.id, group);
    });
    this.syncFromState();
  }

  rebuildPieceGroup(piece, group) {
    [...group.children].forEach((child) => {
      group.remove(child);
      child.geometry?.dispose();
      child.material?.dispose();
      const index = this.pickables.indexOf(child);
      if (index >= 0) this.pickables.splice(index, 1);
    });

    const anchor = pieceAnchor(piece, piece.homeSlot);
    const body = new THREE.Mesh(
      translateGeometry(createPieceBodyGeometry(piece), anchor),
      createBodyMaterial(this.visualStyle)
    );
    body.castShadow = true;
    body.receiveShadow = true;
    body.userData = { type: "body", pieceId: piece.id };
    group.add(body);
    this.pickables.push(body);

    piece.stickers.forEach((sticker) => {
      const points = homeStickerPoints(piece, sticker, this.visualStyle.stickerLift);
      this.addStickerMesh(group, piece, sticker, points, anchor);
    });
  }

  addStickerMesh(group, piece, sticker, points, anchor) {
    const groovePoints = insetPoints(points, 0.96);
    const stickerPoints = insetPoints(points, 0.86);
    const backing = new THREE.Mesh(
      translateGeometry(createPrismGeometry(groovePoints, this.visualStyle.stickerDepth + 0.018), anchor),
      createGrooveMaterial(this.visualStyle)
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
      translateGeometry(createPrismGeometry(stickerPoints, this.visualStyle.stickerDepth), anchor),
      createStickerMaterial(sticker, this.visualStyle)
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
  }

  disposeSkewbMeshes() {
    this.clearHighlight();
    this.clearGuideHighlights();
    this.clearLayerPreview();
    this.pulse = null;

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
    this.disposeSkewbMeshes();
    this.createSkewb();
    this.syncFromState();
    this.resetCamera(false);
  }

  setVisualPreset(presetName) {
    const nextStyle = SKEWB_VISUAL_PRESETS[presetName];
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
    this.skewbState.pieces.forEach((piece) => {
      const group = this.pieceGroups.get(piece.id);
      if (!group) return;
      group.position.copy(pieceAnchor(piece));
      group.quaternion.copy(pieceQuaternion(piece));
      group.scale.setScalar(1);
    });
  }

  resetCamera() {
    this.setCameraPreset("isometric");
  }

  setCameraPreset(preset = "isometric") {
    const positions = {
      front: [0, 0.72, 6.25],
      top: [0.01, 6.25, 0.01],
      right: [6.05, 0.9, 0],
      isometric: [4.95, 3.6, 5.8]
    };
    const next = positions[preset] || positions.isometric;
    this.camera.position.set(next[0], next[1], next[2]);
    this.controls.target.set(0, 0.05, 0);
    this.controls.minDistance = 4.2;
    this.controls.maxDistance = 10.5;
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
    const piece = getSkewbPieceById(this.skewbState, pieceId);
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
    this.pieceGroups.get(hit.cubieId)?.scale.setScalar(1.018);
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
    const parsed = parseSkewbMove(move);
    const signature = `${parsed.face}:${parsed.turn}`;
    if (this.previewedLayer?.signature === signature) return;

    this.clearLayerPreview();
    const ids = getSkewbMovePieces(this.skewbState, parsed).map((piece) => piece.id);
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

    getSkewbDragCandidateMoves(context.cubiePosition, {
      pieceType: context.pieceType,
      pieceId: context.pieceId
    }).forEach((move) => {
      const parsed = parseSkewbMove(move);
      const axis = axisForMove(parsed);
      const endPoint = startPoint.clone().applyAxisAngle(axis, parsed.angle * 0.32);
      const candidate = this.projectWorldToScreen(endPoint).sub(startScreen);
      const distance = candidate.length();
      if (distance < 2.5) return;
      const rawScore = candidate.normalize().dot(drag);
      const score = rawScore + 0.035;
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
    const parsed = parseSkewbMove(move);
    const ids = new Set(layerCubies);
    const groups = [...ids].map((id) => this.pieceGroups.get(id)).filter(Boolean);
    const axis = axisForMove(parsed);
    const targetAngle = parsed.angle;
    const actualDuration = this.reduceMotion ? Math.min(duration, 70) : duration;
    const base = groups.map((group) => ({
      group,
      position: group.position.clone(),
      quaternion: group.quaternion.clone()
    }));

    if (actualDuration <= 0) return Promise.resolve();

    return new Promise((resolve) => {
      const startedAt = performance.now();
      const frame = (now) => {
        const progress = Math.min(1, (now - startedAt) / actualDuration);
        const eased = easeOutCubic(progress);
        const rotation = new THREE.Quaternion().setFromAxisAngle(axis, targetAngle * eased);
        base.forEach(({ group, position, quaternion }) => {
          group.position.copy(position.clone().applyAxisAngle(axis, targetAngle * eased));
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
    const ids = getSkewbMovePieces(this.skewbState, move).map((piece) => piece.id);
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
