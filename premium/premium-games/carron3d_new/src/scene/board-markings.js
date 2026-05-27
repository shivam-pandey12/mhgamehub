import * as THREE from 'three';
import { CARROM_BOARD, composeBoardStyleTheme } from '../config/carrom-constants.js';

const TEXTURE_SIZE = 2048;

function hexToRgba(hex, alpha) {
  const clean = hex.replace('#', '');
  const value = Number.parseInt(clean, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawCircle(context, cx, cy, radius, stroke, lineWidth) {
  context.beginPath();
  context.arc(cx, cy, radius, 0, Math.PI * 2);
  context.strokeStyle = stroke;
  context.lineWidth = lineWidth;
  context.stroke();
}

export class BoardMarkings {
  constructor({ theme }) {
    this.theme = theme;
    this.boardStyleId = 'ivory';
    this.texture = null;
    this.material = null;
    this.mesh = null;
    this.sceneOverrides = {};
  }

  create() {
    this.texture = this.createTexture(this.getEffectiveTheme());
    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
      side: THREE.DoubleSide
    });
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(CARROM_BOARD.PLAY_AREA_SIZE, CARROM_BOARD.PLAY_AREA_SIZE),
      this.material
    );
    this.mesh.name = 'board-markings-layer';
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.y = CARROM_BOARD.SURFACE_Y + CARROM_BOARD.MARKING_Y_OFFSET;
    this.mesh.renderOrder = 10;
    return this.mesh;
  }

  createTexture(theme) {
    const canvas = document.createElement('canvas');
    canvas.width = TEXTURE_SIZE;
    canvas.height = TEXTURE_SIZE;
    const context = canvas.getContext('2d');
    const half = CARROM_BOARD.PLAY_AREA_SIZE / 2;
    const scale = TEXTURE_SIZE / CARROM_BOARD.PLAY_AREA_SIZE;
    const xToPx = (x) => TEXTURE_SIZE / 2 + x * scale;
    const zToPx = (z) => TEXTURE_SIZE / 2 + z * scale;
    const world = (value) => value * scale;
    const stroke = hexToRgba(theme.scene.markingLine, 0.82);
    const softStroke = hexToRgba(theme.scene.markingLine, 0.42);
    const gold = hexToRgba(theme.scene.goldTrim, 0.7);

    context.clearRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);
    context.lineCap = 'round';
    context.lineJoin = 'round';

    drawCircle(context, xToPx(0), zToPx(0), world(0.58), stroke, world(0.022));
    drawCircle(context, xToPx(0), zToPx(0), world(0.34), softStroke, world(0.014));
    drawCircle(context, xToPx(0), zToPx(0), world(0.18), gold, world(0.012));

    this.drawBaselineSet(context, xToPx, zToPx, world, stroke, softStroke, 1);
    this.drawBaselineSet(context, xToPx, zToPx, world, stroke, softStroke, -1);
    this.drawSideBaselineSet(context, xToPx, zToPx, world, stroke, softStroke, 1);
    this.drawSideBaselineSet(context, xToPx, zToPx, world, stroke, softStroke, -1);
    this.drawCornerGuides(context, xToPx, zToPx, world, stroke, softStroke, half);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
    return texture;
  }

  drawBaselineSet(context, xToPx, zToPx, world, stroke, softStroke, direction) {
    const z = CARROM_BOARD.BASELINE_OFFSET * direction;
    const gap = 0.17;
    const start = -CARROM_BOARD.BASELINE_HALF_LENGTH;
    const end = CARROM_BOARD.BASELINE_HALF_LENGTH;
    const radius = 0.16;

    context.strokeStyle = stroke;
    context.lineWidth = world(0.018);
    [z - gap / 2 * direction, z + gap / 2 * direction].forEach((lineZ) => {
      context.beginPath();
      context.moveTo(xToPx(start), zToPx(lineZ));
      context.lineTo(xToPx(end), zToPx(lineZ));
      context.stroke();
    });

    [start, end].forEach((x) => {
      drawCircle(context, xToPx(x), zToPx(z), world(radius), softStroke, world(0.016));
      drawCircle(context, xToPx(x), zToPx(z), world(radius * 0.56), stroke, world(0.01));
    });
  }

  drawSideBaselineSet(context, xToPx, zToPx, world, stroke, softStroke, direction) {
    const x = CARROM_BOARD.BASELINE_OFFSET * direction;
    const gap = 0.17;
    const start = -CARROM_BOARD.BASELINE_HALF_LENGTH;
    const end = CARROM_BOARD.BASELINE_HALF_LENGTH;
    const radius = 0.16;

    context.strokeStyle = stroke;
    context.lineWidth = world(0.018);
    [x - gap / 2 * direction, x + gap / 2 * direction].forEach((lineX) => {
      context.beginPath();
      context.moveTo(xToPx(lineX), zToPx(start));
      context.lineTo(xToPx(lineX), zToPx(end));
      context.stroke();
    });

    [start, end].forEach((z) => {
      drawCircle(context, xToPx(x), zToPx(z), world(radius), softStroke, world(0.016));
      drawCircle(context, xToPx(x), zToPx(z), world(radius * 0.56), stroke, world(0.01));
    });
  }

  drawCornerGuides(context, xToPx, zToPx, world, stroke, softStroke, half) {
    const inset = 0.74;
    const arrow = 0.22;
    context.lineWidth = world(0.014);

    [
      [1, 1],
      [-1, 1],
      [1, -1],
      [-1, -1]
    ].forEach(([sx, sz]) => {
      const cornerX = sx * (half - inset);
      const cornerZ = sz * (half - inset);
      context.strokeStyle = softStroke;
      context.beginPath();
      context.moveTo(xToPx(cornerX), zToPx(cornerZ));
      context.lineTo(xToPx(cornerX - sx * 0.82), zToPx(cornerZ - sz * 0.82));
      context.stroke();

      context.strokeStyle = stroke;
      context.beginPath();
      context.moveTo(xToPx(cornerX - sx * arrow), zToPx(cornerZ));
      context.lineTo(xToPx(cornerX), zToPx(cornerZ));
      context.lineTo(xToPx(cornerX), zToPx(cornerZ - sz * arrow));
      context.stroke();
    });
  }

  getEffectiveTheme(theme = this.theme, boardStyleId = this.boardStyleId, sceneOverrides = this.sceneOverrides) {
    const composed = composeBoardStyleTheme(theme, boardStyleId);
    return {
      ...composed,
      scene: {
        ...composed.scene,
        ...(sceneOverrides || {})
      }
    };
  }

  applyTheme(theme, boardStyleId = this.boardStyleId, sceneOverrides = this.sceneOverrides) {
    this.theme = theme;
    this.boardStyleId = boardStyleId || 'ivory';
    this.sceneOverrides = { ...(sceneOverrides || {}) };
    if (!this.material) {
      return;
    }
    this.texture?.dispose();
    this.texture = this.createTexture(this.getEffectiveTheme(theme, this.boardStyleId, this.sceneOverrides));
    this.material.map = this.texture;
    this.material.needsUpdate = true;
  }

  dispose() {
    this.texture?.dispose();
    this.material?.dispose();
    this.mesh?.geometry?.dispose();
  }
}
