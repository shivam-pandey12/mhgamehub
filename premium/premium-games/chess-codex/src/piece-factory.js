import * as THREE from 'three';
import { THEME_PRESETS, DEFAULT_THEME_ID } from './theme-config.js';

const GOLD = '#b88d49';

function resolveTheme(themeId = DEFAULT_THEME_ID) {
  return THEME_PRESETS[themeId] || THEME_PRESETS[DEFAULT_THEME_ID];
}

export function resolvePiecePalette(color, themeId = DEFAULT_THEME_ID) {
  return resolveTheme(themeId).pieces[color];
}

function createMaterial(color, accent = false) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: accent ? 0.48 : 0.2,
    roughness: accent ? 0.32 : 0.54,
    emissive: accent ? new THREE.Color('#000000') : new THREE.Color('#060402')
  });
}

function addMesh(group, geometry, material, positionY = 0, castShadow = true) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = positionY;
  mesh.castShadow = castShadow;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addPedestal(group, palette) {
  const bodyMaterial = createMaterial(palette.body);
  const accentMaterial = createMaterial(palette.accent, true);

  addMesh(group, new THREE.CylinderGeometry(0.46, 0.5, 0.16, 42), accentMaterial, 0.08);
  addMesh(group, new THREE.CylinderGeometry(0.34, 0.4, 0.12, 42), bodyMaterial, 0.2);
  addMesh(group, new THREE.TorusGeometry(0.32, 0.04, 20, 42), accentMaterial, 0.26);

  return { bodyMaterial, accentMaterial };
}

function buildPawn(group, palette) {
  const { bodyMaterial, accentMaterial } = addPedestal(group, palette);
  addMesh(group, new THREE.CylinderGeometry(0.17, 0.22, 0.42, 32), bodyMaterial, 0.46);
  addMesh(group, new THREE.SphereGeometry(0.16, 28, 28), accentMaterial, 0.77);
}

function buildRook(group, palette) {
  const { bodyMaterial, accentMaterial } = addPedestal(group, palette);
  addMesh(group, new THREE.CylinderGeometry(0.23, 0.29, 0.72, 32), bodyMaterial, 0.6);
  addMesh(group, new THREE.CylinderGeometry(0.3, 0.26, 0.1, 32), accentMaterial, 1.01);

  for (let index = 0; index < 4; index += 1) {
    const angle = (index / 4) * Math.PI * 2;
    const battlement = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.18), accentMaterial);
    battlement.position.set(Math.cos(angle) * 0.22, 1.1, Math.sin(angle) * 0.22);
    battlement.castShadow = true;
    group.add(battlement);
  }
}

function buildKnight(group, palette) {
  const { bodyMaterial, accentMaterial } = addPedestal(group, palette);
  addMesh(group, new THREE.CylinderGeometry(0.19, 0.28, 0.46, 28), bodyMaterial, 0.47);
  addMesh(group, new THREE.BoxGeometry(0.22, 0.6, 0.32), bodyMaterial, 0.83).rotation.z = -0.2;

  const neck = addMesh(group, new THREE.CylinderGeometry(0.09, 0.12, 0.38, 18), accentMaterial, 1.05);
  neck.rotation.z = 0.7;
  neck.position.x = 0.11;
  neck.position.z = 0.08;

  const head = addMesh(group, new THREE.ConeGeometry(0.16, 0.46, 18), accentMaterial, 1.28);
  head.rotation.z = -0.9;
  head.position.x = 0.15;
  head.position.z = 0.08;

  const earLeft = addMesh(group, new THREE.ConeGeometry(0.05, 0.16, 12), bodyMaterial, 1.46);
  earLeft.position.set(0.23, 1.46, 0.08);
  earLeft.rotation.z = -0.2;
  const earRight = addMesh(group, new THREE.ConeGeometry(0.05, 0.16, 12), bodyMaterial, 1.44);
  earRight.position.set(0.16, 1.44, -0.02);
  earRight.rotation.z = -0.1;
}

function buildBishop(group, palette) {
  const { bodyMaterial, accentMaterial } = addPedestal(group, palette);
  addMesh(group, new THREE.CylinderGeometry(0.16, 0.25, 0.72, 32), bodyMaterial, 0.6);
  addMesh(group, new THREE.SphereGeometry(0.18, 28, 28), accentMaterial, 1.02);
  const mitre = addMesh(group, new THREE.ConeGeometry(0.16, 0.44, 24), bodyMaterial, 1.26);
  mitre.scale.z = 0.78;
  const slit = addMesh(group, new THREE.BoxGeometry(0.05, 0.2, 0.2), accentMaterial, 1.26, false);
  slit.rotation.z = 0.42;
}

function buildQueen(group, palette) {
  const { bodyMaterial, accentMaterial } = addPedestal(group, palette);
  addMesh(group, new THREE.CylinderGeometry(0.16, 0.28, 0.9, 32), bodyMaterial, 0.68);
  addMesh(group, new THREE.TorusGeometry(0.19, 0.04, 20, 42), accentMaterial, 1.12);

  for (let index = 0; index < 5; index += 1) {
    const angle = (index / 5) * Math.PI * 2;
    const jewel = addMesh(group, new THREE.SphereGeometry(0.06, 18, 18), accentMaterial, 1.26);
    jewel.position.x = Math.cos(angle) * 0.17;
    jewel.position.z = Math.sin(angle) * 0.17;
  }

  addMesh(group, new THREE.SphereGeometry(0.11, 20, 20), bodyMaterial, 1.3);
}

function buildKing(group, palette) {
  const { bodyMaterial, accentMaterial } = addPedestal(group, palette);
  addMesh(group, new THREE.CylinderGeometry(0.18, 0.3, 0.96, 32), bodyMaterial, 0.72);
  addMesh(group, new THREE.TorusGeometry(0.18, 0.04, 20, 42), accentMaterial, 1.18);
  addMesh(group, new THREE.CylinderGeometry(0.06, 0.06, 0.22, 16), accentMaterial, 1.36);

  const crossHorizontal = addMesh(group, new THREE.BoxGeometry(0.24, 0.06, 0.06), accentMaterial, 1.44);
  const crossVertical = addMesh(group, new THREE.BoxGeometry(0.06, 0.24, 0.06), accentMaterial, 1.44);
  crossHorizontal.position.y = 1.44;
  crossVertical.position.y = 1.44;
}

const BUILDERS = {
  p: buildPawn,
  r: buildRook,
  n: buildKnight,
  b: buildBishop,
  q: buildQueen,
  k: buildKing
};

export const PIECE_SYMBOLS = {
  q: '\u265B',
  r: '\u265C',
  b: '\u265D',
  n: '\u265E'
};

export const PIECE_NAMES = {
  q: 'Queen',
  r: 'Rook',
  b: 'Bishop',
  n: 'Knight'
};

function applyPaletteToModel(root, palette) {
  root.traverse((child) => {
    if (!child.isMesh) {
      return;
    }

    child.castShadow = true;
    child.receiveShadow = true;
    const isAccent = /accent|trim|gold|crown/i.test(child.name || '');
    child.material = createMaterial(isAccent ? palette.accent : palette.body, isAccent);
  });
}

function clearPieceGeometry(piece) {
  const toRemove = [];
  piece.children.forEach((child) => {
    if (child.material && child.material.isMeshBasicMaterial) {
      return;
    }
    toRemove.push(child);
  });

  toRemove.forEach((child) => {
    piece.remove(child);
    child.geometry?.dispose?.();
    if (Array.isArray(child.material)) {
      child.material.forEach((material) => material.dispose?.());
    } else {
      child.material?.dispose?.();
    }
  });
}

function attachPieceGeometry(piece, { nextType = piece.userData.type, palette, modelRoot } = {}) {
  if (modelRoot) {
    const root = modelRoot.clone(true);
    root.position.y = 0;
    root.rotation.y = 0;
    applyPaletteToModel(root, palette);
    piece.add(root);
    return;
  }

  BUILDERS[nextType](piece, palette);
}

export function createPiece({ color, type, themeId = DEFAULT_THEME_ID, modelRoot = null }) {
  const palette = resolvePiecePalette(color, themeId);
  const piece = new THREE.Group();
  piece.userData.themeId = themeId;
  piece.userData.palette = palette;
  piece.userData.type = type;
  piece.userData.color = color;
  piece.userData.baseY = 0.12;
  piece.position.y = 0.12;

  const shadowDisk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.32, 0.015, 32),
    new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.08 })
  );
  shadowDisk.position.y = 0.005;
  piece.add(shadowDisk);

  attachPieceGeometry(piece, { nextType: type, palette, modelRoot });
  applyPieceAppearance(piece);
  return piece;
}

export function applyPieceAppearance(piece, state = {}) {
  const { selected = false, hovered = false } = state;
  const palette = piece.userData.palette
    || resolvePiecePalette(piece.userData.color, piece.userData.themeId || DEFAULT_THEME_ID);
  const highlight = selected ? 1 : hovered ? 0.45 : 0;

  piece.traverse((child) => {
    if (!child.isMesh || !child.material || child.material.isMeshBasicMaterial) {
      return;
    }
    child.material.emissive = new THREE.Color(palette.emissive);
    child.material.emissiveIntensity = highlight;
  });

  piece.scale.setScalar(selected ? 1.06 : hovered ? 1.03 : 1);
}

export function morphPiece(piece, nextType, { modelRoot = null } = {}) {
  const palette = piece.userData.palette || resolvePiecePalette(piece.userData.color, piece.userData.themeId);
  clearPieceGeometry(piece);
  piece.userData.type = nextType;
  attachPieceGeometry(piece, { nextType, palette, modelRoot });
}

export function rethemePiece(piece, themeId, { modelRoot = null } = {}) {
  const palette = resolvePiecePalette(piece.userData.color, themeId);
  piece.userData.themeId = themeId;
  piece.userData.palette = palette;
  clearPieceGeometry(piece);
  attachPieceGeometry(piece, { nextType: piece.userData.type, palette, modelRoot });
  applyPieceAppearance(piece);
}

export function createMoveMarker({ capture = false, color = GOLD }) {
  if (capture) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.33, 0.045, 16, 48),
      new THREE.MeshStandardMaterial({
        color,
        emissive: new THREE.Color(color),
        emissiveIntensity: 0.5,
        metalness: 0.56,
        roughness: 0.26,
        transparent: true,
        opacity: 0.92
      })
    );
    ring.rotation.x = Math.PI / 2;
    ring.castShadow = false;
    ring.receiveShadow = false;
    return ring;
  }

  const dot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.08, 32),
    new THREE.MeshStandardMaterial({
      color,
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.45,
      metalness: 0.45,
      roughness: 0.28,
      transparent: true,
      opacity: 0.86
    })
  );
  dot.castShadow = false;
  dot.receiveShadow = false;
  return dot;
}
