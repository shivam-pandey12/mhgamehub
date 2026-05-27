import * as THREE from 'three';
import { CARROM_BOARD, CARROM_VISUAL_Y } from '../config/carrom-constants.js';

export class PieceFactory {
  constructor({ materialLibrary }) {
    this.materialLibrary = materialLibrary;
    this.group = new THREE.Group();
    this.group.name = 'static-carrom-pieces';
    this.pieces = [];
    this.coinGeometry = new THREE.CylinderGeometry(
      CARROM_BOARD.COIN_RADIUS,
      CARROM_BOARD.COIN_RADIUS,
      CARROM_BOARD.COIN_HEIGHT,
      48
    );
    this.strikerGeometry = new THREE.CylinderGeometry(
      CARROM_BOARD.STRIKER_RADIUS,
      CARROM_BOARD.STRIKER_RADIUS,
      CARROM_BOARD.STRIKER_HEIGHT,
      64
    );
    this.coinRingGeometry = new THREE.TorusGeometry(CARROM_BOARD.COIN_RADIUS * 0.78, 0.012, 10, 48);
    this.strikerRingGeometry = new THREE.TorusGeometry(CARROM_BOARD.STRIKER_RADIUS * 0.72, 0.016, 10, 56);
    this.shadowGeometry = new THREE.CircleGeometry(0.25, 36);
    this.highlightMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.22,
      depthWrite: false
    });
  }

  createInitialPieces() {
    this.createQueen();
    this.createCoinRing({
      count: 6,
      radius: CARROM_BOARD.CENTER_CLUSTER_SPACING,
      angleOffset: Math.PI / 6,
      colors: ['white', 'black', 'white', 'black', 'white', 'black'],
      idPrefix: 'inner'
    });
    this.createCoinRing({
      count: 12,
      radius: CARROM_BOARD.CENTER_CLUSTER_SPACING * 2,
      angleOffset: 0,
      colors: ['black', 'white', 'black', 'white', 'black', 'white', 'black', 'white', 'black', 'white', 'black', 'white'],
      idPrefix: 'outer'
    });
    this.createStriker();

    return {
      group: this.group,
      pieces: this.pieces
    };
  }

  createCoinRing({ count, radius, angleOffset, colors, idPrefix }) {
    for (let index = 0; index < count; index += 1) {
      const angle = angleOffset + (index / count) * Math.PI * 2;
      const color = colors[index];
      const position = {
        x: Math.cos(angle) * radius,
        y: CARROM_VISUAL_Y.COIN_VISUAL_Y,
        z: Math.sin(angle) * radius
      };
      this.createCoin({
        id: `${idPrefix}-${color}-coin-${index + 1}`,
        color,
        position
      });
    }
  }

  createQueen() {
    const position = {
      x: 0,
      y: CARROM_VISUAL_Y.QUEEN_VISUAL_Y,
      z: 0
    };
    this.createCoin({
      id: 'queen-red-1',
      color: 'red',
      type: 'queen',
      position
    });
  }

  createStriker() {
    const position = {
      x: 0,
      y: CARROM_VISUAL_Y.STRIKER_VISUAL_Y,
      z: CARROM_BOARD.BASELINE_OFFSET
    };
    const striker = new THREE.Group();
    striker.name = 'striker-piece';
    striker.position.set(position.x, position.y, position.z);

    const body = new THREE.Mesh(this.strikerGeometry, this.materialLibrary.get('striker'));
    body.name = 'striker-body';
    body.castShadow = true;
    body.receiveShadow = true;
    striker.add(body);

    const ring = new THREE.Mesh(this.strikerRingGeometry, this.materialLibrary.get('strikerRing'));
    ring.name = 'striker-top-ring';
    ring.rotation.x = Math.PI / 2;
    ring.position.y = CARROM_BOARD.STRIKER_HEIGHT / 2 + 0.009;
    striker.add(ring);

    const innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(CARROM_BOARD.STRIKER_RADIUS * 0.42, 0.01, 8, 48),
      this.materialLibrary.get('pocketRim')
    );
    innerRing.name = 'striker-inner-ring';
    innerRing.rotation.x = Math.PI / 2;
    innerRing.position.y = CARROM_BOARD.STRIKER_HEIGHT / 2 + 0.013;
    striker.add(innerRing);

    const glow = new THREE.Mesh(
      new THREE.CircleGeometry(CARROM_BOARD.STRIKER_RADIUS * 1.55, 48),
      this.materialLibrary.get('strikerGlow')
    );
    glow.name = 'striker-soft-glow';
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = -CARROM_BOARD.STRIKER_HEIGHT / 2 - 0.006;
    glow.renderOrder = 4;
    striker.add(glow);

    const metadata = this.createMetadata({
      id: 'striker-1',
      type: 'striker',
      color: 'striker',
      position,
      mesh: striker
    });
    striker.userData.carrom = {
      id: metadata.id,
      type: metadata.type,
      color: metadata.color,
      isPocketed: false
    };
    this.group.add(striker);
    this.pieces.push(metadata);
  }

  createCoin({ id, color, type = 'coin', position }) {
    const coin = new THREE.Group();
    coin.name = id;
    coin.position.set(position.x, position.y, position.z);
    const bodyMaterial = this.getCoinBodyMaterial(color);
    const rimMaterial = this.getCoinRimMaterial(color);

    const body = new THREE.Mesh(this.coinGeometry, bodyMaterial);
    body.name = `${id}-body`;
    body.castShadow = true;
    body.receiveShadow = true;
    coin.add(body);

    const rim = new THREE.Mesh(this.coinRingGeometry, rimMaterial);
    rim.name = `${id}-top-rim`;
    rim.rotation.x = Math.PI / 2;
    rim.position.y = CARROM_BOARD.COIN_HEIGHT / 2 + 0.008;
    coin.add(rim);

    const highlight = new THREE.Mesh(
      new THREE.CircleGeometry(CARROM_BOARD.COIN_RADIUS * 0.46, 32),
      this.highlightMaterial
    );
    highlight.name = `${id}-top-highlight`;
    highlight.rotation.x = -Math.PI / 2;
    highlight.position.set(-CARROM_BOARD.COIN_RADIUS * 0.18, CARROM_BOARD.COIN_HEIGHT / 2 + 0.011, -CARROM_BOARD.COIN_RADIUS * 0.1);
    highlight.renderOrder = 6;
    coin.add(highlight);

    const shadow = new THREE.Mesh(this.shadowGeometry, this.materialLibrary.get('softShadow'));
    shadow.name = `${id}-soft-shadow`;
    shadow.rotation.x = -Math.PI / 2;
    shadow.scale.set(0.7, 0.7, 1);
    shadow.position.y = -CARROM_BOARD.COIN_HEIGHT / 2 - 0.008;
    shadow.renderOrder = 2;
    coin.add(shadow);

    const metadata = this.createMetadata({
      id,
      type,
      color,
      position,
      mesh: coin
    });
    coin.userData.carrom = {
      id: metadata.id,
      type: metadata.type,
      color: metadata.color,
      isPocketed: false
    };
    this.group.add(coin);
    this.pieces.push(metadata);
  }

  getCoinBodyMaterial(color) {
    if (color === 'red') {
      return this.materialLibrary.get('queen');
    }
    return this.materialLibrary.get(color === 'white' ? 'whiteCoin' : 'blackCoin');
  }

  getCoinRimMaterial(color) {
    if (color === 'red') {
      return this.materialLibrary.get('queenRim');
    }
    return this.materialLibrary.get(color === 'white' ? 'whiteCoinRim' : 'blackCoinRim');
  }

  createMetadata({ id, type, color, position, mesh }) {
    return {
      id,
      type,
      color,
      radius: type === 'striker' ? CARROM_BOARD.STRIKER_RADIUS : CARROM_BOARD.COIN_RADIUS,
      initialPosition: { ...position },
      visualY: position.y,
      mesh,
      isPocketed: false
    };
  }

  dispose() {
    this.coinGeometry.dispose();
    this.strikerGeometry.dispose();
    this.coinRingGeometry.dispose();
    this.strikerRingGeometry.dispose();
    this.shadowGeometry.dispose();
    this.highlightMaterial.dispose();
  }
}
