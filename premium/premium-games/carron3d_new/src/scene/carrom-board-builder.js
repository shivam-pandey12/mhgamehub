import * as THREE from 'three';
import { CARROM_BOARD } from '../config/carrom-constants.js';
import { BoardMarkings } from './board-markings.js';

export class CarromBoardBuilder {
  constructor({ materialLibrary, theme }) {
    this.materialLibrary = materialLibrary;
    this.theme = theme;
    this.boardStyleId = 'ivory';
    this.cosmeticScene = {};
    this.group = new THREE.Group();
    this.group.name = 'premium-carrom-board';
    this.markings = new BoardMarkings({ theme });
    this.pockets = [];
  }

  build() {
    this.createTableBase();
    this.createBoardBody();
    this.createPlaySurface();
    this.createFrameRails();
    this.createTrimLines();
    this.createPockets();
    this.group.add(this.markings.create());

    return {
      group: this.group,
      pockets: this.pockets
    };
  }

  createTableBase() {
    const table = new THREE.Mesh(
      new THREE.CylinderGeometry(4.85, 5.22, 0.34, 128),
      this.materialLibrary.get('tableBase')
    );
    table.name = 'ivory-table-base';
    table.position.y = -0.36;
    table.receiveShadow = true;
    table.castShadow = true;
    this.group.add(table);

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(4.95, 96),
      this.materialLibrary.get('softShadow')
    );
    shadow.name = 'board-soft-shadow';
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.18;
    shadow.scale.set(1.22, 0.86, 1);
    shadow.renderOrder = 0;
    this.group.add(shadow);
  }

  createBoardBody() {
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(CARROM_BOARD.BOARD_SIZE, CARROM_BOARD.BOARD_THICKNESS, CARROM_BOARD.BOARD_SIZE),
      this.materialLibrary.get('frameSide')
    );
    body.name = 'carrom-board-body';
    body.position.y = CARROM_BOARD.SURFACE_Y - CARROM_BOARD.BOARD_THICKNESS / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    this.group.add(body);
  }

  createPlaySurface() {
    const surface = new THREE.Mesh(
      new THREE.PlaneGeometry(CARROM_BOARD.PLAY_AREA_SIZE, CARROM_BOARD.PLAY_AREA_SIZE),
      this.materialLibrary.get('boardSurface')
    );
    surface.name = 'carrom-playing-surface';
    surface.rotation.x = -Math.PI / 2;
    surface.position.y = CARROM_BOARD.SURFACE_Y + 0.002;
    surface.receiveShadow = true;
    this.group.add(surface);
  }

  createFrameRails() {
    const half = CARROM_BOARD.BOARD_SIZE / 2;
    const railCenterY = CARROM_BOARD.SURFACE_Y + CARROM_BOARD.FRAME_HEIGHT / 2;
    const railHalfInset = half - CARROM_BOARD.FRAME_WIDTH / 2;
    const material = this.materialLibrary.get('outerFrame');

    [
      {
        name: 'frame-rail-left',
        size: [CARROM_BOARD.FRAME_WIDTH, CARROM_BOARD.FRAME_HEIGHT, CARROM_BOARD.BOARD_SIZE],
        position: [-railHalfInset, railCenterY, 0]
      },
      {
        name: 'frame-rail-right',
        size: [CARROM_BOARD.FRAME_WIDTH, CARROM_BOARD.FRAME_HEIGHT, CARROM_BOARD.BOARD_SIZE],
        position: [railHalfInset, railCenterY, 0]
      },
      {
        name: 'frame-rail-top',
        size: [CARROM_BOARD.BOARD_SIZE, CARROM_BOARD.FRAME_HEIGHT, CARROM_BOARD.FRAME_WIDTH],
        position: [0, railCenterY, -railHalfInset]
      },
      {
        name: 'frame-rail-bottom',
        size: [CARROM_BOARD.BOARD_SIZE, CARROM_BOARD.FRAME_HEIGHT, CARROM_BOARD.FRAME_WIDTH],
        position: [0, railCenterY, railHalfInset]
      }
    ].forEach((rail) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...rail.size), material);
      mesh.name = rail.name;
      mesh.position.set(...rail.position);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.group.add(mesh);
    });
  }

  createTrimLines() {
    const halfPlay = CARROM_BOARD.PLAY_AREA_SIZE / 2;
    const halfBoard = CARROM_BOARD.BOARD_SIZE / 2;
    const topY = CARROM_BOARD.SURFACE_Y + CARROM_BOARD.FRAME_HEIGHT + 0.012;
    const surfaceTrimY = CARROM_BOARD.SURFACE_Y + 0.018;
    const trim = this.materialLibrary.get('goldTrim');
    const thin = 0.035;

    [
      [CARROM_BOARD.PLAY_AREA_SIZE, thin, 0, surfaceTrimY, -halfPlay],
      [CARROM_BOARD.PLAY_AREA_SIZE, thin, 0, surfaceTrimY, halfPlay],
      [thin, CARROM_BOARD.PLAY_AREA_SIZE, -halfPlay, surfaceTrimY, 0],
      [thin, CARROM_BOARD.PLAY_AREA_SIZE, halfPlay, surfaceTrimY, 0],
      [CARROM_BOARD.BOARD_SIZE - 0.32, 0.045, 0, topY, -halfBoard + 0.18],
      [CARROM_BOARD.BOARD_SIZE - 0.32, 0.045, 0, topY, halfBoard - 0.18],
      [0.045, CARROM_BOARD.BOARD_SIZE - 0.32, -halfBoard + 0.18, topY, 0],
      [0.045, CARROM_BOARD.BOARD_SIZE - 0.32, halfBoard - 0.18, topY, 0]
    ].forEach(([width, depth, x, y, z], index) => {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(width, 0.028, depth), trim);
      strip.name = `gold-trim-${index + 1}`;
      strip.position.set(x, y, z);
      strip.castShadow = true;
      this.group.add(strip);
    });
  }

  createPockets() {
    const pocketMaterial = this.materialLibrary.get('pocketDark');
    const rimMaterial = this.materialLibrary.get('pocketRim');
    const pocketGeometry = new THREE.CylinderGeometry(
      CARROM_BOARD.POCKET_RADIUS,
      CARROM_BOARD.POCKET_RADIUS * 1.08,
      0.075,
      48
    );
    const rimGeometry = new THREE.TorusGeometry(CARROM_BOARD.POCKET_RADIUS * 1.05, 0.032, 12, 72);

    [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1]
    ].forEach(([sx, sz], index) => {
      const x = sx * CARROM_BOARD.POCKET_CENTER_OFFSET;
      const z = sz * CARROM_BOARD.POCKET_CENTER_OFFSET;
      const pocket = new THREE.Mesh(pocketGeometry, pocketMaterial);
      pocket.name = `corner-pocket-${index + 1}`;
      pocket.position.set(x, CARROM_BOARD.SURFACE_Y - 0.018, z);
      pocket.receiveShadow = true;
      this.group.add(pocket);

      const rim = new THREE.Mesh(rimGeometry, rimMaterial);
      rim.name = `corner-pocket-rim-${index + 1}`;
      rim.rotation.x = Math.PI / 2;
      rim.position.set(x, CARROM_BOARD.SURFACE_Y + 0.018, z);
      rim.castShadow = true;
      this.group.add(rim);

      this.pockets.push({
        id: `pocket-${index + 1}`,
        position: { x, y: CARROM_BOARD.SURFACE_Y, z },
        radius: CARROM_BOARD.POCKET_RADIUS,
        mesh: pocket
      });
    });
  }

  applyTheme(theme, boardStyleId = this.boardStyleId, cosmeticScene = this.cosmeticScene) {
    this.theme = theme;
    this.boardStyleId = boardStyleId || 'ivory';
    this.cosmeticScene = { ...(cosmeticScene || {}) };
    this.markings.applyTheme(theme, this.boardStyleId, this.cosmeticScene);
  }

  dispose() {
    this.markings.dispose();
  }
}
