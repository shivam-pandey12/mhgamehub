import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";
import {
  MEGAMINX_FACE_COLORS,
  MEGAMINX_FACE_IDS,
  MEGAMINX_TOPOLOGY,
  getMegaminxDragCandidateMoves,
  getMegaminxFaceDefinition,
  getMegaminxMovePieces,
  getMegaminxPieceById,
  getMegaminxSlotCenter,
  parseMegaminxMove
} from "./megaminxState.js";

const DRAG_MATCH_THRESHOLD = 0.6;
const PRESETS = {
  ivoryMegaminx: {
    shell: 0xefe6d8,
    groove: 0xb89255,
    roughness: 0.44,
    metalness: 0.06,
    clearcoat: 0.62,
    stickerLift: 0.028,
    stickerInset: 0.86,
    depth: 0.055,
    faceBoost: 1,
    opacity: 1,
    highlight: 0xffd66f
  },
  classicMegaminx: {
    shell: 0x202020,
    groove: 0x0e0e0e,
    roughness: 0.48,
    metalness: 0.02,
    clearcoat: 0.48,
    stickerLift: 0.03,
    stickerInset: 0.86,
    depth: 0.052,
    faceBoost: 1.08,
    opacity: 1,
    highlight: 0xffe28a
  },
  glassMegaminx: {
    shell: 0xe8ddcc,
    groove: 0xbfa46a,
    roughness: 0.2,
    metalness: 0.08,
    clearcoat: 0.92,
    stickerLift: 0.034,
    stickerInset: 0.85,
    depth: 0.05,
    faceBoost: 1.02,
    opacity: 0.86,
    highlight: 0xffe6a5
  },
  darkMegaminx: {
    shell: 0x181614,
    groove: 0x080706,
    roughness: 0.34,
    metalness: 0.18,
    clearcoat: 0.64,
    stickerLift: 0.032,
    stickerInset: 0.86,
    depth: 0.055,
    faceBoost: 1.12,
    opacity: 1,
    highlight: 0xffd35e
  },
  goldenArtifact: {
    shell: 0xc3994e,
    groove: 0x6d4b1d,
    roughness: 0.27,
    metalness: 0.34,
    clearcoat: 0.88,
    stickerLift: 0.034,
    stickerInset: 0.85,
    depth: 0.056,
    faceBoost: 0.96,
    opacity: 1,
    highlight: 0xffedaa
  }
};

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

function v3(vector) {
  return new THREE.Vector3(vector.x, vector.y, vector.z);
}

function average(points) {
  return points.reduce((sum, point) => sum.add(point), new THREE.Vector3()).multiplyScalar(1 / Math.max(1, points.length));
}

function faceNormal(faceId) {
  return v3(getMegaminxFaceDefinition(faceId).normal).normalize();
}

function projectedTangent(normal, toward) {
  const tangent = toward.clone().sub(normal.clone().multiplyScalar(toward.dot(normal)));
  if (tangent.lengthSq() < 0.00001) {
    tangent.copy(Math.abs(normal.y) > 0.85 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 1, 0));
    tangent.sub(normal.clone().multiplyScalar(tangent.dot(normal)));
  }
  return tangent.normalize();
}

function frameFromFaces(primaryFace, secondaryFace, orientation = 0) {
  const normal = faceNormal(primaryFace);
  let tangent;

  if (secondaryFace) {
    tangent = projectedTangent(normal, faceNormal(secondaryFace));
  } else {
    const face = getMegaminxFaceDefinition(primaryFace);
    const neighbor = face.neighborIds[((orientation % 5) + 5) % 5] || face.neighborIds[0];
    tangent = projectedTangent(normal, faceNormal(neighbor));
  }

  const bitangent = new THREE.Vector3().crossVectors(normal, tangent).normalize();
  return { x: tangent, y: bitangent, z: normal };
}

function frameToQuaternion(frame) {
  return new THREE.Quaternion().setFromRotationMatrix(
    new THREE.Matrix4().makeBasis(frame.x, frame.y, frame.z)
  );
}

function pieceQuaternion(piece) {
  if (piece.type === "center") {
    const face = piece.stickers[0].face;
    const homeFrame = frameFromFaces(piece.stickers[0].homeFace, null, piece.homeOrientation);
    const currentFrame = frameFromFaces(face, null, piece.orientation);
    return frameToQuaternion(currentFrame).multiply(frameToQuaternion(homeFrame).invert());
  }

  const homeFrame = frameFromFaces(piece.stickers[0].homeFace, piece.stickers[1]?.homeFace);
  const currentFrame = frameFromFaces(piece.stickers[0].face, piece.stickers[1]?.face);
  return frameToQuaternion(currentFrame).multiply(frameToQuaternion(homeFrame).invert());
}

function pieceTransform(piece) {
  return {
    position: v3(getMegaminxSlotCenter(piece.slot)),
    quaternion: pieceQuaternion(piece)
  };
}

function createMaterial(style, color, { shell = false } = {}) {
  const base = new THREE.Color(color);
  if (!shell) {
    base.multiplyScalar(style.faceBoost);
  }
  return new THREE.MeshPhysicalMaterial({
    color: base,
    roughness: shell ? style.roughness + 0.12 : style.roughness,
    metalness: shell ? style.metalness : Math.min(0.22, style.metalness + 0.04),
    clearcoat: style.clearcoat,
    clearcoatRoughness: shell ? 0.34 : 0.22,
    transparent: style.opacity < 1,
    opacity: style.opacity,
    emissive: base,
    emissiveIntensity: 0,
    side: THREE.DoubleSide
  });
}

function transformExtrudedGeometry(geometry, center, tangent, bitangent, normal, lift) {
  const attribute = geometry.getAttribute("position");
  for (let index = 0; index < attribute.count; index += 1) {
    const x = attribute.getX(index);
    const y = attribute.getY(index);
    const z = attribute.getZ(index);
    const point = center.clone()
      .add(tangent.clone().multiplyScalar(x))
      .add(bitangent.clone().multiplyScalar(y))
      .add(normal.clone().multiplyScalar(z + lift));
    attribute.setXYZ(index, point.x, point.y, point.z);
  }
  attribute.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
}

function insetPoints(points, amount = 1) {
  const center = average(points);
  return points.map((point) => center.clone().lerp(point, amount));
}

function createFaceletGeometry(facelet, style, inset = style.stickerInset || 1) {
  const points = insetPoints(facelet.points.map(v3), inset);
  const center = average(points);
  const normal = faceNormal(facelet.faceId);
  const tangent = points[1].clone().sub(points[0]).normalize();
  const bitangent = new THREE.Vector3().crossVectors(normal, tangent).normalize();
  const shape = new THREE.Shape();
  points.forEach((point, index) => {
    const local = point.clone().sub(center);
    const x = local.dot(tangent);
    const y = local.dot(bitangent);
    if (index === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  });
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: style.depth,
    bevelEnabled: true,
    bevelSize: style.depth * 0.28,
    bevelThickness: style.depth * 0.22,
    bevelSegments: 1
  });
  transformExtrudedGeometry(geometry, center, tangent, bitangent, normal, style.stickerLift);
  return geometry;
}

function getPieceFacelets(piece) {
  return piece.stickers
    .map((sticker) => MEGAMINX_TOPOLOGY.facelets.find((item) => (
      item.slotId === piece.homeSlot && item.faceId === sticker.homeFace
    )))
    .filter(Boolean);
}

function createPieceBodyGeometry(facelets) {
  const outer = facelets.flatMap((facelet) => facelet.points.map(v3));
  const inner = outer.map((point) => point.clone().multiplyScalar(0.72));
  return new ConvexGeometry([...outer, ...inner]);
}

export class MegaminxRenderer {
  constructor(container, megaminxState) {
    this.container = container;
    this.megaminxState = megaminxState;
    this.cubeState = megaminxState;
    this.visualPresetName = "ivoryMegaminx";
    this.visualStyle = PRESETS[this.visualPresetName];
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(37, 1, 0.1, 90);
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
    this.renderSettings = { quality: "balanced", reducedMotion: false, animationSpeed: "normal" };
    this.reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    this.disposed = false;
    this.frameHandle = 0;
    this.qualityApplied = false;

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.55));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);
    this.dragIndicator = document.createElement("div");
    this.dragIndicator.className = "drag-direction-indicator";
    this.container.appendChild(this.dragIndicator);

    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.085;
    this.controls.minDistance = 4.9;
    this.controls.maxDistance = 12.8;
    this.controls.minPolarAngle = Math.PI * 0.12;
    this.controls.maxPolarAngle = Math.PI * 0.88;
    this.controls.enablePan = false;
    this.controls.target.set(0, 0.04, 0);

    this.createEnvironment();
    this.rebuildPieces();
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
    this.disposePieces();
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
    this.scene.fog = new THREE.Fog(0xfbf6ec, 13, 25);
    this.scene.add(new THREE.HemisphereLight(0xfff7e3, 0x332d25, 2.25));

    const key = new THREE.DirectionalLight(0xffedc1, 4.7);
    key.position.set(4.8, 7.4, 5.3);
    key.castShadow = true;
    key.shadow.mapSize.set(1536, 1536);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 20;
    key.shadow.camera.left = -6;
    key.shadow.camera.right = 6;
    key.shadow.camera.top = 6;
    key.shadow.camera.bottom = -6;
    this.scene.add(key);

    const rim = new THREE.DirectionalLight(0xbfd4ff, 0.95);
    rim.position.set(-4.6, 3.5, -5.1);
    this.scene.add(rim);

    const stage = new THREE.Mesh(
      new THREE.CylinderGeometry(3.85, 4.2, 0.12, 96),
      new THREE.MeshPhysicalMaterial({
        color: 0xe0c99d,
        roughness: 0.74,
        metalness: 0.035,
        clearcoat: 0.24,
        clearcoatRoughness: 0.62
      })
    );
    stage.position.set(0, -2.35, 0);
    stage.receiveShadow = true;
    this.scene.add(stage);

    const shadowDisk = new THREE.Mesh(
      new THREE.CircleGeometry(4.75, 96),
      new THREE.MeshBasicMaterial({ color: 0x49341f, transparent: true, opacity: 0.08, depthWrite: false })
    );
    shadowDisk.rotation.x = -Math.PI / 2;
    shadowDisk.position.y = -2.28;
    this.scene.add(shadowDisk);
  }

  createCoreShell() {
    const shell = new THREE.Mesh(
      new THREE.DodecahedronGeometry(1.88, 0),
      createMaterial(this.visualStyle, this.visualStyle.groove, { shell: true })
    );
    shell.castShadow = true;
    shell.receiveShadow = true;
    shell.userData = { type: "megaminx-shell" };
    this.scene.add(shell);
    this.coreShell = shell;
  }

  createPieceGroup(piece) {
    const group = new THREE.Group();
    group.userData.pieceId = piece.id;
    const homeCenter = v3(getMegaminxSlotCenter(piece.homeSlot));
    const facelets = getPieceFacelets(piece);
    const bodyGeometry = createPieceBodyGeometry(facelets);
    bodyGeometry.translate(-homeCenter.x, -homeCenter.y, -homeCenter.z);
    const body = new THREE.Mesh(
      bodyGeometry,
      createMaterial(this.visualStyle, this.visualStyle.shell, { shell: true })
    );
    body.castShadow = true;
    body.receiveShadow = true;
    body.userData = {
      type: `${piece.type}-body`,
      pieceId: piece.id,
      slotId: piece.homeSlot
    };
    group.add(body);

    piece.stickers.forEach((sticker) => {
      const facelet = facelets.find((item) => item.faceId === sticker.homeFace);
      if (!facelet) return;
      const geometry = createFaceletGeometry(facelet, this.visualStyle);
      geometry.translate(-homeCenter.x, -homeCenter.y, -homeCenter.z);
      const mesh = new THREE.Mesh(
        geometry,
        createMaterial(this.visualStyle, MEGAMINX_FACE_COLORS[sticker.homeFace])
      );
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = {
        type: "sticker",
        pieceId: piece.id,
        faceId: sticker.homeFace,
        slotId: piece.homeSlot
      };
      group.add(mesh);
      this.pickables.push(mesh);
    });

    this.scene.add(group);
    this.pieceGroups.set(piece.id, group);
  }

  disposePieces() {
    this.clearHighlight();
    this.clearGuideHighlights();
    this.clearLayerPreview();
    this.pulse = null;
    if (this.coreShell) {
      this.scene.remove(this.coreShell);
      this.coreShell.geometry?.dispose();
      this.coreShell.material?.dispose();
      this.coreShell = null;
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

  rebuildPieces() {
    this.disposePieces();
    this.createCoreShell();
    this.megaminxState.pieces.forEach((piece) => this.createPieceGroup(piece));
    this.syncFromState();
  }

  setVisualPreset(presetName) {
    const next = PRESETS[presetName];
    if (!next) return false;
    if (presetName === this.visualPresetName) return true;
    this.visualPresetName = presetName;
    this.visualStyle = next;
    this.rebuildPieces();
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
    this.controls.zoomSpeed = 0.82 * cameraSensitivity;
    if (previousQuality !== this.renderSettings.quality || !this.qualityApplied) {
      this.applyQualityMode(this.renderSettings.quality);
    }
  }

  applyQualityMode(quality = "balanced") {
    const pixelRatio = quality === "high" ? 1.8 : quality === "performance" ? 1.05 : 1.35;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatio));
    this.renderer.shadowMap.enabled = quality !== "performance";
    this.qualityApplied = true;
    this.resize();
  }

  syncFromState() {
    this.megaminxState.pieces.forEach((piece) => {
      const group = this.pieceGroups.get(piece.id);
      if (!group) return;
      const transform = pieceTransform(piece);
      group.position.copy(transform.position);
      group.quaternion.copy(transform.quaternion);
      group.scale.setScalar(1);
    });
  }

  resetCamera() {
    this.setCameraPreset("isometric");
  }

  setCameraPreset(preset = "isometric") {
    const positions = {
      front: [0, 0.7, 7.0],
      top: [0.01, 7.0, 0.01],
      right: [6.85, 1.0, 0],
      isometric: [5.85, 4.1, 6.55]
    };
    const next = positions[preset] || positions.isometric;
    this.camera.position.set(next[0], next[1], next[2]);
    this.controls.target.set(0, 0.04, 0);
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
    const faceId = hit.object.userData.faceId;
    const piece = getMegaminxPieceById(this.megaminxState, pieceId);
    if (!piece) return null;
    const normal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld).normalize();
    return {
      cubieId: pieceId,
      pieceId,
      faceId,
      piece,
      cubie: { ...piece, position: { faceId } },
      object: hit.object,
      point: hit.point.clone(),
      normal: { x: normal.x, y: normal.y, z: normal.z }
    };
  }

  setHighlight(hit) {
    this.clearHighlight();
    if (!hit?.object) return;
    this.highlighted = hit.object;
    if (hit.object.material?.emissive) {
      hit.object.material.emissive.set(this.visualStyle.highlight);
      hit.object.material.emissiveIntensity = 0.34;
    }
    this.pieceGroups.get(hit.pieceId || hit.cubieId)?.scale.setScalar(1.015);
  }

  clearHighlight() {
    if (!this.highlighted) return;
    if (this.highlighted.material?.emissive) {
      this.highlighted.material.emissive.set(this.highlighted.material.color || 0x000000);
      this.highlighted.material.emissiveIntensity = 0;
    }
    this.pieceGroups.forEach((group) => group.scale.setScalar(1));
    this.highlighted = null;
  }

  setGuideHighlights(targets = {}) {
    this.clearGuideHighlights();
    const ids = new Set(targets.pieceIds || targets.cubieIds || []);
    this.guideHighlightedIds = ids;
    ids.forEach((id) => {
      const group = this.pieceGroups.get(id);
      if (!group) return;
      group.scale.setScalar(1.024);
      group.children.forEach((child) => {
        if (child.material?.emissive) {
          child.material.emissive.set(this.visualStyle.highlight);
          child.material.emissiveIntensity = 0.16;
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
      const group = this.pieceGroups.get(id);
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
    const parsed = parseMegaminxMove(move);
    const signature = `${parsed.faceId}:${parsed.turn}`;
    if (this.previewedLayer?.signature === signature) return;
    this.clearLayerPreview();
    const ids = getMegaminxMovePieces(this.megaminxState, parsed).map((piece) => piece.id);
    this.previewedLayer = { signature, ids: new Set(ids) };
    ids.forEach((id) => {
      const group = this.pieceGroups.get(id);
      if (!group) return;
      group.scale.setScalar(1.014);
      group.children.forEach((child) => {
        if (child.material?.emissive) {
          child.material.emissive.set(this.visualStyle.highlight);
          child.material.emissiveIntensity = 0.12;
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
      const group = this.pieceGroups.get(id);
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
    const faceId = context.hit?.faceId || context.cubiePosition?.faceId;
    let best = null;

    getMegaminxDragCandidateMoves(context.cubiePosition, { faceId }).forEach((move) => {
      const parsed = parseMegaminxMove(move);
      const axis = faceNormal(parsed.faceId);
      const endPoint = startPoint.clone().applyAxisAngle(axis, parsed.angle * 0.66);
      const candidate = this.projectWorldToScreen(endPoint).sub(startScreen);
      const distance = candidate.length();
      if (distance < 2.5) return;
      const rawScore = candidate.normalize().dot(drag);
      if (!best || rawScore > best.score) {
        best = { move: parsed, score: rawScore, distance };
      }
    });

    if (!best || best.score < DRAG_MATCH_THRESHOLD) return null;
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

  animateMove(move, { duration = 280, layerCubies = [] } = {}) {
    const parsed = parseMegaminxMove(move);
    const groups = [...new Set(layerCubies)].map((id) => this.pieceGroups.get(id)).filter(Boolean);
    const axis = faceNormal(parsed.faceId);
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
    const ids = getMegaminxMovePieces(this.megaminxState, move).map((piece) => piece.id);
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
    const intensity = Math.sin(progress * Math.PI) * 0.2;
    this.pulse.ids.forEach((id) => {
      const group = this.pieceGroups.get(id);
      group?.children.forEach((child) => {
        if (child.material?.emissive && child !== this.highlighted) {
          child.material.emissive.set(this.visualStyle.highlight);
          child.material.emissiveIntensity = intensity;
        }
      });
    });
    if (progress >= 1) {
      this.pulse.ids.forEach((id) => {
        const group = this.pieceGroups.get(id);
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
