import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { BOARD_SIZE, PLAYER_IDS, PLAYER_META } from '../ludo/constants.js';
import { getAllBoardCells, getTokenCell, SAFE_COMMON_INDICES } from '../ludo/layout.js';

const CELL_SIZE = 0.68;
const BOARD_WORLD_SIZE = BOARD_SIZE * CELL_SIZE;
const BOARD_TOP_Y = 0.22;
const TOKEN_BASE_Y = 0.46;
const TOKEN_ARC = 0.54;

const THEME = {
  marble: '#f8f2e8',
  marbleWarm: '#fffaf1',
  gold: '#b78a46',
  goldDeep: '#8e6730',
  goldSoft: '#d6b47a',
  table: '#d8c4a2',
  tableDeep: '#8c6f52',
  shadow: '#4d391d',
  text: '#2b241d',
  safe: '#d8b36b',
  center: '#ead3a4'
};

function easeInOutCubic(value) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function easeOutBack(value) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(value - 1, 3) + c1 * Math.pow(value - 1, 2);
}

function gridToWorld(cell, y = TOKEN_BASE_Y) {
  return new THREE.Vector3(
    (cell.x - 7) * CELL_SIZE,
    y,
    (cell.y - 7) * CELL_SIZE
  );
}

function cellKey(cell) {
  return `${cell.x},${cell.y}`;
}

function findInteractiveParent(object) {
  let current = object;
  while (current) {
    if (current.userData?.type) {
      return current;
    }
    current = current.parent;
  }
  return null;
}

function createCanvasTexture(text, options = {}) {
  const size = options.size || 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = options.background || 'rgba(255,255,255,0)';
  if (options.background) {
    ctx.fillRect(0, 0, size, size);
  }
  ctx.fillStyle = options.color || THEME.text;
  ctx.font = options.font || `700 ${Math.floor(size * 0.28)}px Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, size / 2, size / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createTextSprite(text, options = {}) {
  const texture = createCanvasTexture(text, options);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(options.width || 1.15, options.height || 0.42, 1);
  return sprite;
}

function disposeMaterialMap(sprite) {
  if (sprite?.material?.map) {
    sprite.material.map.dispose();
  }
  sprite?.material?.dispose?.();
}

export class LudoScene {
  constructor(canvas, handlers = {}) {
    this.canvas = canvas;
    this.handlers = handlers;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#f8f1e5');
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(0, 9.4, 10.8);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.04;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.075;
    this.controls.minDistance = 7.4;
    this.controls.maxDistance = 15.4;
    this.controls.minPolarAngle = 0.45;
    this.controls.maxPolarAngle = 1.05;
    this.controls.target.set(0, 0.1, 0);

    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.raycastTargets = [];
    this.tokenMeshes = new Map();
    this.tileMeshes = new Map();
    this.validTokenIds = new Set();
    this.selectedTokenId = null;
    this.hoveredTokenId = null;
    this.invalidTokenIds = new Map();
    this.activePlayerId = 'red';
    this.focusTarget = new THREE.Vector3(0, 0.1, 0);
    this.latestState = null;

    this.createMaterials();
    this.createLights();
    this.createTable();
    this.createBoard();
    this.createDice();
    this.bindEvents();
    this.resize();
  }

  createMaterials() {
    this.materials = {
      boardBase: new THREE.MeshStandardMaterial({
        color: THEME.marble,
        roughness: 0.56,
        metalness: 0.06
      }),
      boardMarble: new THREE.MeshStandardMaterial({
        color: THEME.marbleWarm,
        roughness: 0.5,
        metalness: 0.05
      }),
      boardFrame: new THREE.MeshStandardMaterial({
        color: THEME.gold,
        roughness: 0.34,
        metalness: 0.48
      }),
      safe: new THREE.MeshStandardMaterial({
        color: THEME.safe,
        roughness: 0.42,
        metalness: 0.36,
        emissive: new THREE.Color(THEME.goldDeep),
        emissiveIntensity: 0.05
      }),
      center: new THREE.MeshStandardMaterial({
        color: THEME.center,
        roughness: 0.38,
        metalness: 0.32
      }),
      table: new THREE.MeshStandardMaterial({
        color: THEME.table,
        roughness: 0.72,
        metalness: 0.12
      }),
      tableDeep: new THREE.MeshStandardMaterial({
        color: THEME.tableDeep,
        roughness: 0.64,
        metalness: 0.18
      }),
      dice: new THREE.MeshStandardMaterial({
        color: '#fff8ed',
        roughness: 0.46,
        metalness: 0.1
      }),
      pip: new THREE.MeshStandardMaterial({
        color: '#2a221b',
        roughness: 0.5,
        metalness: 0.12
      }),
      activeZone: new THREE.MeshBasicMaterial({
        color: THEME.goldSoft,
        transparent: true,
        opacity: 0.18,
        depthWrite: false
      })
    };

    this.playerMaterials = Object.fromEntries(PLAYER_IDS.map((playerId) => {
      const meta = PLAYER_META[playerId];
      return [playerId, {
        token: new THREE.MeshStandardMaterial({
          color: meta.color,
          roughness: 0.42,
          metalness: 0.18,
          emissive: new THREE.Color(meta.color),
          emissiveIntensity: 0.02
        }),
        tokenAccent: new THREE.MeshStandardMaterial({
          color: meta.accent,
          roughness: 0.36,
          metalness: 0.42
        }),
        lane: new THREE.MeshStandardMaterial({
          color: meta.accent,
          roughness: 0.48,
          metalness: 0.08,
          transparent: true,
          opacity: 0.64
        }),
        base: new THREE.MeshStandardMaterial({
          color: meta.color,
          roughness: 0.62,
          metalness: 0.06,
          transparent: true,
          opacity: 0.22
        })
      }];
    }));
  }

  createLights() {
    const ambient = new THREE.AmbientLight('#fff8ee', 1.7);
    this.scene.add(ambient);

    const key = new THREE.DirectionalLight('#fff4df', 2.35);
    key.position.set(6.5, 11.5, 8);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 34;
    key.shadow.camera.left = -10;
    key.shadow.camera.right = 10;
    key.shadow.camera.top = 10;
    key.shadow.camera.bottom = -10;
    key.shadow.bias = -0.00018;
    this.scene.add(key);

    const rim = new THREE.DirectionalLight('#f4cf8b', 1.05);
    rim.position.set(-8, 6, -6);
    this.scene.add(rim);
  }

  createTable() {
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(13, 96),
      new THREE.MeshStandardMaterial({
        color: '#efe4d0',
        roughness: 0.9,
        metalness: 0.02
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.72;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const table = new THREE.Mesh(
      new THREE.CylinderGeometry(6.9, 7.4, 0.48, 72),
      this.materials.table
    );
    table.position.y = -0.42;
    table.castShadow = true;
    table.receiveShadow = true;
    this.scene.add(table);

    const tableTrim = new THREE.Mesh(
      new THREE.CylinderGeometry(7.15, 7.55, 0.14, 72),
      this.materials.tableDeep
    );
    tableTrim.position.y = -0.13;
    tableTrim.castShadow = true;
    tableTrim.receiveShadow = true;
    this.scene.add(tableTrim);
  }

  createBoard() {
    this.boardGroup = new THREE.Group();
    this.scene.add(this.boardGroup);

    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(BOARD_WORLD_SIZE + 1.12, 0.28, BOARD_WORLD_SIZE + 1.12),
      this.materials.boardFrame
    );
    frame.position.y = -0.01;
    frame.castShadow = true;
    frame.receiveShadow = true;
    this.boardGroup.add(frame);

    const board = new THREE.Mesh(
      new THREE.BoxGeometry(BOARD_WORLD_SIZE + 0.64, 0.26, BOARD_WORLD_SIZE + 0.64),
      this.materials.boardBase
    );
    board.position.y = 0.12;
    board.castShadow = true;
    board.receiveShadow = true;
    this.boardGroup.add(board);

    this.createBaseZones();
    this.createCells();
    this.createCenterCrown();

    this.activeZoneHighlight = new THREE.Mesh(
      new THREE.BoxGeometry(CELL_SIZE * 4.85, 0.03, CELL_SIZE * 4.85),
      this.materials.activeZone
    );
    this.activeZoneHighlight.position.y = BOARD_TOP_Y + 0.08;
    this.activeZoneHighlight.visible = false;
    this.boardGroup.add(this.activeZoneHighlight);
  }

  createBaseZones() {
    Object.values(PLAYER_META).forEach((player) => {
      const zone = new THREE.Mesh(
        new THREE.BoxGeometry(CELL_SIZE * 5.25, 0.06, CELL_SIZE * 5.25),
        this.playerMaterials[player.id].base
      );
      zone.position.copy(gridToWorld(player.zone, BOARD_TOP_Y + 0.035));
      zone.castShadow = true;
      zone.receiveShadow = true;
      this.boardGroup.add(zone);

      const border = new THREE.Mesh(
        new THREE.BoxGeometry(CELL_SIZE * 5.58, 0.035, CELL_SIZE * 5.58),
        this.materials.boardFrame
      );
      border.position.copy(gridToWorld(player.zone, BOARD_TOP_Y + 0.01));
      border.receiveShadow = true;
      this.boardGroup.add(border);
      zone.position.y = BOARD_TOP_Y + 0.065;

      const label = createTextSprite(player.label.toUpperCase(), {
        color: THEME.goldDeep,
        font: '700 54px Georgia, serif',
        width: 1.15,
        height: 0.34
      });
      label.position.copy(gridToWorld({ x: player.zone.x, y: player.zone.y - 1.55 }, BOARD_TOP_Y + 0.42));
      this.boardGroup.add(label);
    });
  }

  createCells() {
    const tileGeometry = new THREE.BoxGeometry(CELL_SIZE * 0.88, 0.11, CELL_SIZE * 0.88);
    const safeMarkerGeometry = new THREE.CylinderGeometry(CELL_SIZE * 0.16, CELL_SIZE * 0.16, 0.018, 5);

    getAllBoardCells().forEach((cell) => {
      const primaryRole = cell.roles[0];
      const playerRole = cell.roles.find((role) => role.playerId);
      const material = this.getCellMaterial(primaryRole, playerRole);
      const tile = new THREE.Mesh(tileGeometry, material);
      tile.position.copy(gridToWorld(cell, BOARD_TOP_Y + 0.12));
      tile.castShadow = true;
      tile.receiveShadow = true;
      tile.userData.type = 'cell';
      tile.userData.cellKey = cellKey(cell);
      tile.userData.cell = { x: cell.x, y: cell.y };
      tile.userData.roles = cell.roles;
      this.boardGroup.add(tile);
      this.tileMeshes.set(cellKey(cell), tile);
      this.raycastTargets.push(tile);

      if (primaryRole.role === 'safe-track') {
        const marker = new THREE.Mesh(safeMarkerGeometry, this.materials.boardFrame);
        marker.rotation.y = Math.PI / 5;
        marker.position.copy(gridToWorld(cell, BOARD_TOP_Y + 0.19));
        marker.castShadow = true;
        this.boardGroup.add(marker);
      }
    });
  }

  getCellMaterial(primaryRole, playerRole) {
    if (primaryRole.role === 'center') {
      return this.materials.center;
    }
    if (primaryRole.role === 'safe-track') {
      return this.materials.safe;
    }
    if (playerRole?.role === 'home-lane') {
      return this.playerMaterials[playerRole.playerId].lane;
    }
    if (playerRole?.role === 'base-slot') {
      return this.materials.boardMarble;
    }
    return this.materials.boardMarble;
  }

  createCenterCrown() {
    const crown = new THREE.Mesh(
      new THREE.CylinderGeometry(CELL_SIZE * 1.12, CELL_SIZE * 1.12, 0.08, 4),
      this.materials.boardFrame
    );
    crown.rotation.y = Math.PI / 4;
    crown.position.copy(gridToWorld({ x: 7, y: 7 }, BOARD_TOP_Y + 0.28));
    crown.castShadow = true;
    crown.receiveShadow = true;
    this.boardGroup.add(crown);

    const label = createTextSprite('HOME', {
      color: '#fffaf1',
      font: '700 58px Georgia, serif',
      width: 1.08,
      height: 0.36
    });
    label.position.copy(gridToWorld({ x: 7, y: 7 }, BOARD_TOP_Y + 0.55));
    this.boardGroup.add(label);
  }

  createDice() {
    this.diceGroup = new THREE.Group();
    this.diceGroup.position.set(5.6, 0.58, -5.05);
    this.diceGroup.userData.type = 'dice';
    this.scene.add(this.diceGroup);

    const diceBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.78, 0.78, 0.78),
      this.materials.dice
    );
    diceBody.castShadow = true;
    diceBody.receiveShadow = true;
    this.diceGroup.add(diceBody);

    this.pipGroup = new THREE.Group();
    this.diceGroup.add(this.pipGroup);
    this.updateDiceFace(null);

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.72, 0.9, 0.12, 48),
      this.materials.boardFrame
    );
    base.position.y = -0.52;
    base.receiveShadow = true;
    base.castShadow = true;
    this.diceGroup.add(base);

    const label = createTextSprite('ROLL', {
      color: THEME.goldDeep,
      font: '700 58px Georgia, serif',
      width: 1,
      height: 0.32
    });
    label.position.set(0, -0.1, 0.84);
    this.diceGroup.add(label);

    this.raycastTargets.push(this.diceGroup);
  }

  updateDiceFace(value) {
    this.pipGroup?.clear();

    if (this.diceValueSprite) {
      this.diceGroup.remove(this.diceValueSprite);
      disposeMaterialMap(this.diceValueSprite);
    }

    const text = value ? String(value) : '-';
    this.diceValueSprite = createTextSprite(text, {
      color: THEME.goldDeep,
      font: '700 120px Georgia, serif',
      width: 0.72,
      height: 0.72
    });
    this.diceValueSprite.position.set(0, 0.51, 0);
    this.diceGroup.add(this.diceValueSprite);

    if (!value) {
      return;
    }

    const pipPatterns = {
      1: [[0, 0]],
      2: [[-1, -1], [1, 1]],
      3: [[-1, -1], [0, 0], [1, 1]],
      4: [[-1, -1], [-1, 1], [1, -1], [1, 1]],
      5: [[-1, -1], [-1, 1], [0, 0], [1, -1], [1, 1]],
      6: [[-1, -1], [-1, 0], [-1, 1], [1, -1], [1, 0], [1, 1]]
    };

    pipPatterns[value].forEach(([x, z]) => {
      const pip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.038, 0.038, 0.012, 18),
        this.materials.pip
      );
      pip.position.set(x * 0.17, 0.405, z * 0.17);
      this.pipGroup.add(pip);
    });
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    this.canvas.addEventListener('pointermove', (event) => this.handlePointerMove(event));
    this.canvas.addEventListener('pointerleave', () => {
      this.hoveredTokenId = null;
      this.canvas.style.cursor = '';
    });
    this.canvas.addEventListener('click', (event) => this.handleClick(event));
  }

  resize() {
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  normalizePointer(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  getPointerHit(event) {
    this.normalizePointer(event);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const tokenChildren = [...this.tokenMeshes.values()].flatMap((mesh) => mesh.children);
    const hits = this.raycaster.intersectObjects([...tokenChildren, ...this.raycastTargets], true);
    return hits.length ? findInteractiveParent(hits[0].object) : null;
  }

  handlePointerMove(event) {
    const hit = this.getPointerHit(event);
    this.hoveredTokenId = hit?.userData?.type === 'token' ? hit.userData.tokenId : null;
    this.canvas.style.cursor = hit ? 'pointer' : '';
  }

  handleClick(event) {
    const hit = this.getPointerHit(event);
    if (!hit) {
      return;
    }

    if (hit.userData.type === 'dice') {
      this.handlers.onDiceClick?.();
      return;
    }

    if (hit.userData.type === 'token') {
      this.handlers.onTokenClick?.(hit.userData.tokenId);
      return;
    }

    if (hit.userData.type === 'cell') {
      this.handlers.onCellClick?.(hit.userData.cellKey);
    }
  }

  setState(state) {
    this.latestState = state;
    this.activePlayerId = state.currentPlayer || this.activePlayerId;
    this.ensureTokenMeshes(state);
    this.syncTokenPositions(state);
    this.setValidTokens(state.availableMoves?.map((move) => move.tokenId) || []);
    this.focusActivePlayer(this.activePlayerId);
  }

  ensureTokenMeshes(state) {
    PLAYER_IDS.forEach((playerId) => {
      state.tokens[playerId].forEach((token) => {
        if (!this.tokenMeshes.has(token.id)) {
          const mesh = this.createTokenMesh(playerId, token.index);
          this.scene.add(mesh);
          this.tokenMeshes.set(token.id, mesh);
        }
        this.tokenMeshes.get(token.id).visible = state.activePlayers.includes(playerId);
      });
    });
  }

  createTokenMesh(playerId, index) {
    const player = PLAYER_META[playerId];
    const group = new THREE.Group();
    group.userData.type = 'token';
    group.userData.tokenId = `${playerId}-${index}`;
    group.userData.playerId = playerId;

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.19, 0.25, 0.13, 32),
      this.playerMaterials[playerId].tokenAccent
    );
    base.position.y = 0.055;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    const body = new THREE.Mesh(
      new THREE.LatheGeometry([
        new THREE.Vector2(0.16, 0),
        new THREE.Vector2(0.22, 0.1),
        new THREE.Vector2(0.18, 0.34),
        new THREE.Vector2(0.12, 0.52),
        new THREE.Vector2(0.16, 0.68),
        new THREE.Vector2(0.05, 0.82)
      ], 36),
      this.playerMaterials[playerId].token
    );
    body.position.y = 0.1;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    const cap = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 28, 16),
      this.playerMaterials[playerId].tokenAccent
    );
    cap.position.y = 0.93;
    cap.castShadow = true;
    group.add(cap);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.31, 0.016, 8, 48),
      new THREE.MeshBasicMaterial({
        color: player.accent,
        transparent: true,
        opacity: 0.0,
        depthWrite: false
      })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.018;
    ring.userData.isRing = true;
    group.userData.ring = ring;
    group.add(ring);

    group.traverse((child) => {
      child.userData.type = 'token';
      child.userData.tokenId = `${playerId}-${index}`;
      child.userData.playerId = playerId;
    });

    return group;
  }

  computeTokenPositions(state) {
    const entries = [];
    for (const playerId of state.activePlayers) {
      for (const token of state.tokens[playerId]) {
        entries.push({ token, cell: getTokenCell(token) });
      }
    }

    const grouped = new Map();
    entries.forEach((entry) => {
      const key = cellKey(entry.cell);
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key).push(entry);
    });

    const positions = new Map();
    grouped.forEach((group) => {
      group.forEach((entry, index) => {
        const basePosition = gridToWorld(entry.cell, TOKEN_BASE_Y);
        if (group.length > 1) {
          const angle = (index / group.length) * Math.PI * 2;
          const radius = Math.min(0.17, 0.055 + group.length * 0.018);
          basePosition.x += Math.cos(angle) * radius;
          basePosition.z += Math.sin(angle) * radius;
        }
        positions.set(entry.token.id, basePosition);
      });
    });

    return positions;
  }

  syncTokenPositions(state) {
    const positions = this.computeTokenPositions(state);
    positions.forEach((position, tokenId) => {
      const mesh = this.tokenMeshes.get(tokenId);
      if (mesh) {
        mesh.position.copy(position);
      }
    });
  }

  setValidTokens(tokenIds) {
    this.validTokenIds = new Set(tokenIds);
  }

  setSelectedToken(tokenId) {
    this.selectedTokenId = tokenId;
  }

  pulseInvalidToken(tokenId) {
    if (tokenId) {
      this.invalidTokenIds.set(tokenId, performance.now() + 650);
    }
  }

  focusActivePlayer(playerId) {
    const player = PLAYER_META[playerId];
    if (!player) {
      return;
    }

    const zonePosition = gridToWorld(player.zone, 0.1);
    this.focusTarget.copy(zonePosition).multiplyScalar(0.28);
    this.activeZoneHighlight.visible = true;
    this.activeZoneHighlight.position.x = zonePosition.x;
    this.activeZoneHighlight.position.z = zonePosition.z;
  }

  async animateDice(value) {
    const duration = 780;
    const start = performance.now();
    const startRotation = this.diceGroup.rotation.clone();
    const targetRotation = new THREE.Euler(
      startRotation.x + Math.PI * (2.4 + Math.random()),
      startRotation.y + Math.PI * (3.2 + Math.random()),
      startRotation.z + Math.PI * (2.8 + Math.random())
    );

    this.updateDiceFace(null);

    await new Promise((resolve) => {
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = easeInOutCubic(progress);
        this.diceGroup.rotation.x = startRotation.x + (targetRotation.x - startRotation.x) * eased;
        this.diceGroup.rotation.y = startRotation.y + (targetRotation.y - startRotation.y) * eased;
        this.diceGroup.rotation.z = startRotation.z + (targetRotation.z - startRotation.z) * eased;
        const lift = Math.sin(progress * Math.PI) * 0.34;
        this.diceGroup.position.y = 0.58 + lift;
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(tick);
    });

    this.diceGroup.rotation.set(0, 0, 0);
    this.diceGroup.position.y = 0.58;
    this.updateDiceFace(value);
  }

  async animateTokenMove(tokenId, path, captures, stateAfter, onStep) {
    const tokenMesh = this.tokenMeshes.get(tokenId);
    if (!tokenMesh) {
      this.setState(stateAfter);
      return;
    }

    this.setSelectedToken(tokenId);
    for (const step of path) {
      const target = gridToWorld(step.cell, TOKEN_BASE_Y);
      await this.animateMeshTo(tokenMesh, target, 230, TOKEN_ARC);
      await this.animateLanding(tokenMesh);
      onStep?.(step);
    }

    if (captures?.length) {
      const finalPositions = this.computeTokenPositions(stateAfter);
      await Promise.all(captures.map((capture) => {
        const capturedMesh = this.tokenMeshes.get(capture.tokenId);
        const target = finalPositions.get(capture.tokenId);
        return capturedMesh && target
          ? this.animateMeshTo(capturedMesh, target, 520, TOKEN_ARC * 1.5)
          : Promise.resolve();
      }));
    }

    this.setSelectedToken(null);
    this.setState(stateAfter);
  }

  animateMeshTo(mesh, target, duration, arc) {
    const start = mesh.position.clone();
    const startedAt = performance.now();

    return new Promise((resolve) => {
      const tick = (now) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = easeInOutCubic(progress);
        mesh.position.lerpVectors(start, target, eased);
        mesh.position.y = start.y + (target.y - start.y) * eased + Math.sin(progress * Math.PI) * arc;
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          mesh.position.copy(target);
          resolve();
        }
      };
      requestAnimationFrame(tick);
    });
  }

  animateLanding(mesh) {
    const baseScale = 1;
    const startedAt = performance.now();
    const duration = 150;

    return new Promise((resolve) => {
      const tick = (now) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        const bounce = 1 + Math.sin(progress * Math.PI) * 0.1;
        const settled = progress > 0.62 ? 1 + (bounce - 1) * (1 - easeOutBack((progress - 0.62) / 0.38)) : bounce;
        mesh.scale.setScalar(Math.max(0.96, settled * baseScale));
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          mesh.scale.setScalar(baseScale);
          resolve();
        }
      };
      requestAnimationFrame(tick);
    });
  }

  updateTokenAppearance(time) {
    const now = performance.now();
    this.invalidTokenIds.forEach((expiresAt, tokenId) => {
      if (expiresAt < now) {
        this.invalidTokenIds.delete(tokenId);
      }
    });

    this.tokenMeshes.forEach((mesh, tokenId) => {
      const ring = mesh.userData.ring;
      const isValid = this.validTokenIds.has(tokenId);
      const isSelected = this.selectedTokenId === tokenId;
      const isHovered = this.hoveredTokenId === tokenId;
      const isInvalid = this.invalidTokenIds.has(tokenId);
      const visible = isValid || isSelected || isHovered || isInvalid;
      if (!ring) {
        return;
      }

      ring.visible = visible;
      const pulse = 0.72 + Math.sin(time * 4.2 + tokenId.length) * 0.12;
      ring.material.opacity = isInvalid ? 0.78 : isSelected ? 0.74 : isValid ? pulse : 0.38;
      ring.material.color.set(isInvalid ? '#a73d2d' : isSelected ? '#fff2c5' : THEME.goldSoft);
      ring.scale.setScalar(isSelected ? 1.12 : isValid ? 1.04 + Math.sin(time * 3.4) * 0.035 : 1);

      const targetScale = isHovered || isSelected ? 1.05 : 1;
      mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.18);
    });
  }

  updateActiveZone(time) {
    if (!this.activeZoneHighlight?.visible) {
      return;
    }
    this.activeZoneHighlight.material.opacity = 0.13 + (Math.sin(time * 2.2) + 1) * 0.035;
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      const delta = this.clock.getDelta();
      const time = this.clock.elapsedTime;
      this.controls.target.lerp(this.focusTarget, 1 - Math.exp(-delta * 1.6));
      this.controls.update();
      this.updateTokenAppearance(time);
      this.updateActiveZone(time);
      this.renderer.render(this.scene, this.camera);
    });
  }
}

export { gridToWorld, CELL_SIZE, BOARD_TOP_Y };
