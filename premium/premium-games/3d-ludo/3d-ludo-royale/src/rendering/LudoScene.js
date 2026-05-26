import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { BOARD_SIZE, PLAYER_IDS, PLAYER_META } from '../ludo/constants.js';
import { getAllBoardCells, getTokenCell, SAFE_COMMON_INDICES } from '../ludo/layout.js';
import { CinematicCameraController } from './CinematicCameraController.js';

const CELL_SIZE = 0.68;
const BOARD_WORLD_SIZE = BOARD_SIZE * CELL_SIZE;
const BOARD_TOP_Y = 0.22;
const TOKEN_BASE_Y = 0.46;
const TOKEN_ARC = 0.54;

const DICE_STATION_POSITIONS = Object.freeze({
  red: new THREE.Vector3(-4.75, 0.58, 4.82),
  blue: new THREE.Vector3(4.75, 0.58, -4.82),
  green: new THREE.Vector3(-4.75, 0.58, -4.82),
  yellow: new THREE.Vector3(4.75, 0.58, 4.82)
});

const PLAYER_INFO_POSITIONS = Object.freeze({
  red: { x: 2.5, y: 9.65 },
  blue: { x: 11.5, y: 4.35 },
  green: { x: 2.5, y: 4.35 },
  yellow: { x: 11.5, y: 9.65 }
});

const BOARD_TEXT_ROTATION = Math.PI;

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

const CAMERA_OPTION_DEFAULTS = {
  cinematicCamera: true,
  autoFocusCurrentPlayer: true
};

const GRAPHICS_QUALITY = Object.freeze({
  auto: {
    mobilePixelRatio: 1.5,
    desktopPixelRatio: 2,
    shadowMapSize: 1536,
    effects: true
  },
  high: {
    mobilePixelRatio: 2,
    desktopPixelRatio: 2,
    shadowMapSize: 2048,
    effects: true
  },
  low: {
    mobilePixelRatio: 1.1,
    desktopPixelRatio: 1.1,
    shadowMapSize: 1024,
    effects: false
  }
});

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
  const size = options.size || 512;
  const canvas = document.createElement('canvas');
  canvas.width = options.textureWidth || size;
  canvas.height = options.textureHeight || size;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = options.background || 'rgba(255,255,255,0)';
  if (options.background) {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.fillStyle = options.color || THEME.text;
  ctx.font = options.font || `700 ${Math.floor(canvas.height * 0.64)}px Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (options.shadowColor) {
    ctx.shadowColor = options.shadowColor;
    ctx.shadowBlur = options.shadowBlur ?? 4;
    ctx.shadowOffsetY = options.shadowOffsetY ?? 1;
  }
  if (options.strokeColor) {
    ctx.strokeStyle = options.strokeColor;
    ctx.lineWidth = options.strokeWidth || Math.max(4, canvas.height * 0.045);
    ctx.lineJoin = 'round';
    ctx.strokeText(text, canvas.width / 2, canvas.height / 2, options.maxTextWidth || canvas.width * 0.88);
  }
  ctx.fillText(text, canvas.width / 2, canvas.height / 2, options.maxTextWidth || canvas.width * 0.88);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;
  return texture;
}

function createMarbleTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#fffaf1');
  gradient.addColorStop(0.48, '#f6eddd');
  gradient.addColorStop(1, '#fffdf8');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 76; i += 1) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const length = 110 + Math.random() * 220;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(
      x + length * 0.24,
      y - 34 + Math.random() * 68,
      x + length * 0.72,
      y + 26 - Math.random() * 52,
      x + length,
      y + 18 - Math.random() * 36
    );
    ctx.strokeStyle = `rgba(183, 138, 70, ${0.025 + Math.random() * 0.055})`;
    ctx.lineWidth = 1 + Math.random() * 1.8;
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
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

function createFlatTextPlane(text, options = {}) {
  const texture = createCanvasTexture(text, options);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    depthTest: options.depthTest ?? false,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(options.width || 1.15, options.height || 0.42),
    material
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.renderOrder = options.renderOrder || 18;
  return mesh;
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
    this.graphicsQuality = 'auto';
    this.effectsEnabled = true;

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.075;
    this.controls.enablePan = false;
    this.controls.screenSpacePanning = false;
    this.controls.rotateSpeed = 0.78;
    this.controls.zoomSpeed = 0.86;
    this.controls.minDistance = 7.4;
    this.controls.maxDistance = 19.2;
    this.controls.minPolarAngle = 0.32;
    this.controls.maxPolarAngle = 1.32;
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE
    };
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_ROTATE
    };
    this.controls.target.set(0, 0.1, 0);
    this.controls.addEventListener('start', () => {
      this.userOrbiting = true;
      this.canvas.style.cursor = 'grabbing';
    });
    this.controls.addEventListener('end', () => {
      this.userOrbiting = false;
      this.focusTarget.copy(this.controls.target);
      this.canvas.style.cursor = this.hoveredTokenId ? 'pointer' : 'grab';
    });
    this.canvas.style.cursor = 'grab';

    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.raycastTargets = [];
    this.tokenMeshes = new Map();
    this.tileMeshes = new Map();
    this.pathHighlightPool = [];
    this.validTokenIds = new Set();
    this.selectedTokenId = null;
    this.hoveredTokenId = null;
    this.invalidTokenIds = new Map();
    this.activePlayerId = 'red';
    this.focusTarget = new THREE.Vector3(0, 0.1, 0);
    this.userOrbiting = false;
    this.latestState = null;
    this.animationSerial = 0;
    this.activeEffects = [];
    this.royaleRings = [];
    this.playerInfoPanels = new Map();
    this.cameraOptions = { ...CAMERA_OPTION_DEFAULTS };

    this.createMaterials();
    this.createLights();
    this.createTable();
    this.createBoard();
    this.createDice();
    this.createEffectLayer();
    this.cameraController = new CinematicCameraController(this.camera, this.controls, this.createCameraPoseProvider());
    this.bindEvents();
    this.applyPerformanceProfile();
    this.resize();
  }

  createCameraPoseProvider() {
    const overview = () => ({
      position: new THREE.Vector3(0, 10.6, 12.6),
      target: new THREE.Vector3(0, 0.1, 0)
    });

    const fromBoardDirection = (target, distance = 10.6, height = 9.6) => {
      const flat = new THREE.Vector3(target.x, 0, target.z);
      if (flat.lengthSq() < 0.001) {
        flat.set(0, 0, 1);
      }
      flat.normalize();
      return new THREE.Vector3(flat.x * distance, height, flat.z * distance);
    };

    return {
      overview,
      player: (playerId) => {
        const player = PLAYER_META[playerId] || PLAYER_META.red;
        const zone = gridToWorld(player.zone, 0.14);
        return {
          position: fromBoardDirection(zone, 10.8, 9.65),
          target: zone.clone().multiplyScalar(0.16).setY(0.16)
        };
      },
      dice: () => {
        const target = this.getActiveDiceStation().group.position.clone();
        return {
          position: target.clone().add(new THREE.Vector3(-2.6, 4.65, 5.05)),
          target: target.clone().add(new THREE.Vector3(0, 0.22, 0))
        };
      },
      token: (position) => {
        const target = position.clone();
        return {
          position: new THREE.Vector3(target.x * 0.26, 8.55, target.z * 0.26 + 9.35),
          target: target.clone().setY(0.32)
        };
      },
      capture: (position) => {
        const target = position.clone();
        return {
          position: new THREE.Vector3(target.x * 0.34, 7.25, target.z * 0.34 + 7.55),
          target: target.clone().setY(0.38)
        };
      },
      home: (position) => {
        const target = position.clone().lerp(new THREE.Vector3(0, 0.5, 0), 0.3);
        return {
          position: new THREE.Vector3(target.x * 0.18, 7.9, target.z * 0.18 + 8.35),
          target: target.setY(0.42)
        };
      },
      winner: (playerId) => {
        const player = PLAYER_META[playerId] || PLAYER_META.red;
        const zone = gridToWorld(player.zone, 0.16).multiplyScalar(0.35);
        return {
          position: fromBoardDirection(zone, 9.2, 8.2),
          target: new THREE.Vector3(0, 0.32, 0).lerp(zone, 0.28)
        };
      }
    };
  }

  createEffectLayer() {
    this.pathHighlightGroup = new THREE.Group();
    this.scene.add(this.pathHighlightGroup);
    this.pathHighlightGeometry = new THREE.BoxGeometry(CELL_SIZE * 0.8, 0.028, CELL_SIZE * 0.8);
    this.pathHighlightMaterials = Object.fromEntries(PLAYER_IDS.map((playerId) => {
      const player = PLAYER_META[playerId];
      return [playerId, {
        step: new THREE.MeshBasicMaterial({
          color: player.accent,
          transparent: true,
          opacity: 0.22,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        }),
        destination: new THREE.MeshBasicMaterial({
          color: THEME.goldSoft,
          transparent: true,
          opacity: 0.42,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        })
      }];
    }));

    this.effectGroup = new THREE.Group();
    this.scene.add(this.effectGroup);

    this.dicePulseRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.64, 0.018, 8, 72),
      new THREE.MeshBasicMaterial({
        color: THEME.goldSoft,
        transparent: true,
        opacity: 0,
        depthWrite: false
      })
    );
    this.dicePulseRing.rotation.x = -Math.PI / 2;
    this.dicePulseRing.position.copy(this.getActiveDiceStation().group.position).setY(0.15);
    this.effectGroup.add(this.dicePulseRing);
  }

  setCameraOptions(options = {}) {
    this.cameraOptions = { ...this.cameraOptions, ...options };
    this.cameraController?.setOptions(this.cameraOptions);
    if (!this.cameraOptions.autoFocusCurrentPlayer) {
      this.focusTarget.set(0, 0.1, 0);
    }
  }

  setGraphicsQuality(quality = 'auto') {
    this.graphicsQuality = GRAPHICS_QUALITY[quality] ? quality : 'auto';
    this.applyPerformanceProfile();
  }

  applyPerformanceProfile() {
    if (!this.renderer) {
      return;
    }
    const profile = GRAPHICS_QUALITY[this.graphicsQuality] || GRAPHICS_QUALITY.auto;
    const mobile = window.matchMedia?.('(pointer: coarse), (max-width: 900px)').matches;
    const maxPixelRatio = mobile ? profile.mobilePixelRatio : profile.desktopPixelRatio;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPixelRatio));
    if (this.keyLight?.shadow?.mapSize) {
      this.keyLight.shadow.mapSize.set(profile.shadowMapSize, profile.shadowMapSize);
      this.keyLight.shadow.needsUpdate = true;
    }
    this.effectsEnabled = profile.effects;
    if (this.royaleRingGroup) {
      this.royaleRingGroup.visible = profile.effects;
    }
  }

  cancelAnimations() {
    this.animationSerial += 1;
    this.cameraController?.cancel();
    this.activeEffects.forEach((effect) => {
      if (effect.mesh?.parent) {
        effect.mesh.parent.remove(effect.mesh);
      }
      effect.mesh?.material?.dispose?.();
      effect.mesh?.geometry?.dispose?.();
    });
    this.activeEffects = [];
    this.setSelectedToken(null);
    this.clearMovePathHighlights();
    this.diceStations?.forEach((station) => {
      station.cube.rotation.set(0, 0, 0);
      station.cube.position.y = 0;
      station.cube.scale.setScalar(1);
      station.activeRing.material.opacity = station.playerId === this.activePlayerId ? 0.48 : 0;
    });
    this.dicePulseRing.material.opacity = 0;
  }

  createMaterials() {
    const marbleTexture = createMarbleTexture();
    this.materials = {
      boardBase: new THREE.MeshStandardMaterial({
        color: THEME.marble,
        map: marbleTexture,
        roughness: 0.56,
        metalness: 0.06
      }),
      boardMarble: new THREE.MeshStandardMaterial({
        color: THEME.marbleWarm,
        map: marbleTexture,
        roughness: 0.47,
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
      royaleRing: new THREE.MeshStandardMaterial({
        color: THEME.goldSoft,
        emissive: new THREE.Color(THEME.goldSoft),
        emissiveIntensity: 0.16,
        roughness: 0.3,
        metalness: 0.48,
        transparent: true,
        opacity: 0.46
      }),
      royaleRingIvory: new THREE.MeshStandardMaterial({
        color: '#fff8ea',
        emissive: new THREE.Color('#f2d6a0'),
        emissiveIntensity: 0.08,
        roughness: 0.42,
        metalness: 0.2,
        transparent: true,
        opacity: 0.28
      }),
      dice: new THREE.MeshStandardMaterial({
        color: '#fff8ed',
        map: marbleTexture,
        roughness: 0.4,
        metalness: 0.16
      }),
      pip: new THREE.MeshStandardMaterial({
        color: THEME.goldDeep,
        roughness: 0.32,
        metalness: 0.45
      }),
      activeZone: new THREE.MeshBasicMaterial({
        color: THEME.goldSoft,
        transparent: true,
        opacity: 0.18,
        depthWrite: false
      }),
      pulse: new THREE.MeshBasicMaterial({
        color: THEME.goldSoft,
        transparent: true,
        opacity: 0,
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
    this.ambientLight = new THREE.AmbientLight('#fff8ee', 1.62);
    this.scene.add(this.ambientLight);

    this.keyLight = new THREE.DirectionalLight('#fff4df', 2.45);
    this.keyLight.position.set(6.5, 11.5, 8);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.set(2048, 2048);
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 34;
    this.keyLight.shadow.camera.left = -10;
    this.keyLight.shadow.camera.right = 10;
    this.keyLight.shadow.camera.top = 10;
    this.keyLight.shadow.camera.bottom = -10;
    this.keyLight.shadow.bias = -0.00018;
    this.scene.add(this.keyLight);

    this.fillLight = new THREE.HemisphereLight('#fff9ef', '#b99b70', 0.72);
    this.scene.add(this.fillLight);

    this.rimLight = new THREE.DirectionalLight('#f4cf8b', 1.22);
    this.rimLight.position.set(-8, 6, -6);
    this.scene.add(this.rimLight);

    this.diceSpotLight = new THREE.PointLight('#f2c781', 0, 4.2);
    this.diceSpotLight.position.set(5.6, 1.15, -5.05);
    this.scene.add(this.diceSpotLight);
  }

  createTable() {
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

    this.createSurroundRings();
  }

  createSurroundRings() {
    this.royaleRingGroup = new THREE.Group();
    this.royaleRingGroup.position.y = BOARD_TOP_Y + 0.08;
    this.scene.add(this.royaleRingGroup);

    const boardCornerRadius = Math.hypot(
      (BOARD_WORLD_SIZE + 1.12) / 2,
      (BOARD_WORLD_SIZE + 1.12) / 2
    ) + 0.035;

    [
      { radius: boardCornerRadius, tube: 0.052, material: this.materials.royaleRing, rotY: Math.PI / 4, phase: 0, scale: 1 },
      { radius: boardCornerRadius, tube: 0.038, material: this.materials.royaleRingIvory, rotY: -Math.PI / 4, phase: 1.7, scale: 1.003 }
    ].forEach((config) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(config.radius, config.tube, 18, 144),
        config.material.clone()
      );
      ring.rotation.set(0, config.rotY, 0);
      ring.castShadow = false;
      ring.receiveShadow = false;
      ring.renderOrder = -1;
      ring.userData.baseRotationY = config.rotY;
      ring.userData.baseScale = config.scale;
      ring.userData.baseOpacity = config.material.opacity;
      ring.userData.phase = config.phase;
      ring.userData.oscillationAmplitude = 0.006;
      ring.userData.angularFrequency = 0.32;
      this.royaleRingGroup.add(ring);
      this.royaleRings.push(ring);
    });
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

      const panel = this.createPlayerInfoPanel(player.id);
      panel.position.copy(gridToWorld(PLAYER_INFO_POSITIONS[player.id], BOARD_TOP_Y + 0.155));
      panel.rotation.y = BOARD_TEXT_ROTATION;
      this.boardGroup.add(panel);
      this.playerInfoPanels.set(player.id, panel);
    });
  }

  createPlayerInfoPanel(playerId) {
    const player = PLAYER_META[playerId];
    const group = new THREE.Group();
    const plaqueMaterial = new THREE.MeshStandardMaterial({
      color: '#fff8ea',
      roughness: 0.38,
      metalness: 0.18,
      emissive: new THREE.Color(player.accent),
      emissiveIntensity: 0.025
    });
    const shadowBase = new THREE.Mesh(
      new THREE.BoxGeometry(3.18, 0.035, 1.24),
      this.materials.boardFrame
    );
    shadowBase.position.y = -0.052;
    shadowBase.castShadow = true;
    shadowBase.receiveShadow = true;
    group.add(shadowBase);

    const plaque = new THREE.Mesh(
      new THREE.BoxGeometry(2.98, 0.095, 1.08),
      plaqueMaterial
    );
    plaque.castShadow = true;
    plaque.receiveShadow = true;
    group.add(plaque);

    const timerBoxMaterial = new THREE.MeshStandardMaterial({
      color: '#fff1d2',
      roughness: 0.34,
      metalness: 0.32,
      emissive: new THREE.Color(player.accent),
      emissiveIntensity: 0.035
    });
    const timerBox = new THREE.Mesh(
      new THREE.BoxGeometry(1.42, 0.06, 0.42),
      timerBoxMaterial
    );
    timerBox.position.set(0, 0.07, 0.27);
    timerBox.castShadow = true;
    timerBox.receiveShadow = true;
    timerBox.visible = false;
    group.add(timerBox);

    const name = createFlatTextPlane(player.label, {
      color: THEME.goldDeep,
      textureWidth: 1024,
      textureHeight: 256,
      font: '900 184px Georgia, serif',
      strokeColor: 'rgba(255, 250, 241, 0.9)',
      strokeWidth: 10,
      shadowColor: 'rgba(77, 57, 29, 0.12)',
      width: 2.38,
      height: 0.42
    });
    name.position.set(0, 0.068, -0.26);
    group.add(name);

    const timer = createFlatTextPlane('', {
      color: THEME.goldDeep,
      textureWidth: 768,
      textureHeight: 256,
      font: '900 188px Georgia, serif',
      strokeColor: 'rgba(255, 250, 241, 0.78)',
      strokeWidth: 10,
      width: 1.26,
      height: 0.34
    });
    timer.position.set(0, 0.112, 0.27);
    timer.visible = false;
    group.add(timer);

    group.userData = {
      playerId,
      plaque,
      timerBox,
      name,
      timer,
      lastName: player.label,
      lastTimer: ''
    };
    return group;
  }

  updateSpriteText(sprite, text, options = {}) {
    const nextText = String(text || '');
    disposeMaterialMap(sprite);
    const texture = createCanvasTexture(nextText, options);
    sprite.material = sprite.isSprite
      ? new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false
      })
      : new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        depthTest: options.depthTest ?? false,
        side: THREE.DoubleSide
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

    const label = createFlatTextPlane('HOME', {
      color: '#fffaf1',
      textureWidth: 768,
      textureHeight: 256,
      font: '900 188px Georgia, serif',
      strokeColor: 'rgba(142, 103, 48, 0.72)',
      strokeWidth: 10,
      shadowColor: 'rgba(43, 36, 29, 0.24)',
      width: 1.42,
      height: 0.46
    });
    label.position.copy(gridToWorld({ x: 7, y: 7 }, BOARD_TOP_Y + 0.345));
    label.rotation.y = BOARD_TEXT_ROTATION;
    this.boardGroup.add(label);
  }

  createDice() {
    this.diceStations = new Map();

    PLAYER_IDS.forEach((playerId) => {
      const station = this.createDiceStation(playerId);
      this.scene.add(station.group);
      this.diceStations.set(playerId, station);
      this.raycastTargets.push(station.group);
      this.updateDiceFace(null, playerId);
    });

    this.diceGroup = this.getActiveDiceStation().cube;
  }

  createDiceStation(playerId) {
    const player = PLAYER_META[playerId];
    const group = new THREE.Group();
    group.position.copy(DICE_STATION_POSITIONS[playerId]);
    group.userData.type = 'dice';
    group.userData.playerId = playerId;

    const tray = new THREE.Group();
    tray.userData.type = 'dice';
    tray.userData.playerId = playerId;
    group.add(tray);

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.72, 0.9, 0.12, 48),
      this.materials.boardFrame
    );
    base.position.y = -0.52;
    base.receiveShadow = true;
    base.castShadow = true;
    tray.add(base);

    const activeRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.86, 0.022, 8, 72),
      new THREE.MeshBasicMaterial({
        color: player.accent,
        transparent: true,
        opacity: 0,
        depthWrite: false
      })
    );
    activeRing.rotation.x = -Math.PI / 2;
    activeRing.position.y = -0.45;
    tray.add(activeRing);

    const pointer = new THREE.Group();
    pointer.visible = false;
    pointer.position.y = 1.54;
    pointer.userData.type = 'dice';
    pointer.userData.playerId = playerId;
    const pointerCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.18, 0.36, 4),
      new THREE.MeshStandardMaterial({
        color: player.accent,
        roughness: 0.32,
        metalness: 0.48,
        emissive: new THREE.Color(player.accent),
        emissiveIntensity: 0.12
      })
    );
    pointerCone.rotation.x = Math.PI;
    pointerCone.rotation.y = Math.PI / 4;
    pointerCone.castShadow = true;
    pointer.add(pointerCone);
    const pointerHalo = new THREE.Mesh(
      new THREE.TorusGeometry(0.24, 0.012, 8, 48),
      new THREE.MeshBasicMaterial({
        color: THEME.goldSoft,
        transparent: true,
        opacity: 0.46,
        depthWrite: false
      })
    );
    pointerHalo.position.y = 0.22;
    pointerHalo.rotation.x = -Math.PI / 2;
    pointer.add(pointerHalo);
    group.add(pointer);

    const cube = new THREE.Group();
    cube.userData.type = 'dice';
    cube.userData.playerId = playerId;
    group.add(cube);

    const diceBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.78, 0.78, 0.78),
      this.materials.dice
    );
    diceBody.castShadow = true;
    diceBody.receiveShadow = true;
    cube.add(diceBody);

    const pipGroup = new THREE.Group();
    cube.add(pipGroup);

    group.traverse((child) => {
      child.userData.type = 'dice';
      child.userData.playerId = playerId;
    });

    return {
      playerId,
      group,
      tray,
      cube,
      pipGroup,
      valueSprite: null,
      activeRing,
      pointer,
      pointerHalo
    };
  }

  getActiveDiceStation() {
    return this.diceStations?.get(this.activePlayerId) || this.diceStations?.get('red');
  }

  updateDiceFace(value, playerId = this.activePlayerId) {
    const station = this.diceStations?.get(playerId);
    if (!station) {
      return;
    }
    station.pipGroup?.clear();

    if (station.valueSprite) {
      station.cube.remove(station.valueSprite);
      disposeMaterialMap(station.valueSprite);
    }

    const text = value ? String(value) : '-';
    station.valueSprite = createTextSprite(text, {
      color: THEME.goldDeep,
      font: '700 120px Georgia, serif',
      width: 0.72,
      height: 0.72
    });
    station.valueSprite.position.set(0, 0.51, 0);
    station.cube.add(station.valueSprite);

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
      station.pipGroup.add(pip);
    });
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    this.canvas.addEventListener('pointermove', (event) => this.handlePointerMove(event));
    this.canvas.addEventListener('pointerleave', () => {
      this.hoveredTokenId = null;
      this.canvas.style.cursor = this.userOrbiting ? 'grabbing' : 'grab';
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
    if (!this.userOrbiting) {
      this.canvas.style.cursor = hit ? 'pointer' : 'grab';
    }
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

  setState(state, cameraOptions = {}) {
    this.latestState = state;
    this.activePlayerId = state.currentPlayer || this.activePlayerId;
    this.ensureTokenMeshes(state);
    this.syncTokenPositions(state);
    this.setValidTokens(state.availableMoves?.map((move) => move.tokenId) || []);
    this.updateMovePathHighlights(state);
    this.updateDiceStations(state);
    this.updatePlayerInfoPanels(state, cameraOptions.playerDisplayNames, cameraOptions.playerTimers);
    this.focusActivePlayer(this.activePlayerId, cameraOptions);
  }

  updatePlayerInfoPanels(state = this.latestState, names = {}, timers = {}) {
    if (!state || !this.playerInfoPanels) {
      return;
    }

    this.playerInfoPanels.forEach((panel, playerId) => {
      const active = state.activePlayers.includes(playerId);
      panel.visible = active;
      if (!active) {
        return;
      }

      const info = panel.userData;
      const name = names?.[playerId] || PLAYER_META[playerId].label;
      if (name !== info.lastName) {
        this.updateSpriteText(info.name, name, {
          color: THEME.goldDeep,
          textureWidth: 1024,
          textureHeight: 256,
          font: '900 184px Georgia, serif',
          strokeColor: 'rgba(255, 250, 241, 0.9)',
          strokeWidth: 10,
          shadowColor: 'rgba(77, 57, 29, 0.12)',
          width: 2.38,
          height: 0.42
        });
        info.lastName = name;
      }

      const timer = timers?.[playerId];
      const timerLabel = timer?.label || '';
      info.timer.visible = Boolean(timerLabel);
      info.timerBox.visible = Boolean(timerLabel);
      if (timerLabel && timerLabel !== info.lastTimer) {
        this.updateSpriteText(info.timer, timerLabel, {
          color: timer.urgent ? '#a73d2d' : THEME.goldDeep,
          textureWidth: 768,
          textureHeight: 256,
          font: '900 188px Georgia, serif',
          strokeColor: 'rgba(255, 250, 241, 0.78)',
          strokeWidth: 10,
          width: 1.26,
          height: 0.34
        });
        info.lastTimer = timerLabel;
      }
      if (!timerLabel) {
        info.lastTimer = '';
      }

      const activeTurn = state.currentPlayer === playerId;
      info.plaque.material.color.set(timer?.urgent ? '#ffe7df' : activeTurn ? '#fff2d2' : '#fff8ea');
      info.plaque.material.emissive.set(timer?.urgent ? '#a73d2d' : PLAYER_META[playerId].accent);
      info.plaque.material.emissiveIntensity = timer?.urgent ? 0.18 : activeTurn ? 0.08 : 0.025;
      info.timerBox.material.color.set(timer?.urgent ? '#ffd7cf' : activeTurn ? '#ffe6ad' : '#fff1d2');
      info.timerBox.material.emissive.set(timer?.urgent ? '#a73d2d' : PLAYER_META[playerId].accent);
      info.timerBox.material.emissiveIntensity = timer?.urgent ? 0.16 : activeTurn ? 0.08 : 0.035;
      panel.scale.lerp(new THREE.Vector3(activeTurn ? 1.05 : 1, activeTurn ? 1.05 : 1, activeTurn ? 1.05 : 1), 0.18);
    });
  }

  clearMovePathHighlights() {
    this.pathHighlightPool?.forEach((mesh) => {
      mesh.visible = false;
    });
  }

  getMovePathHighlightMesh(index) {
    if (!this.pathHighlightPool[index]) {
      const mesh = new THREE.Mesh(this.pathHighlightGeometry, this.pathHighlightMaterials.red.step);
      mesh.visible = false;
      mesh.renderOrder = 6;
      mesh.userData.type = 'path-highlight';
      this.pathHighlightGroup.add(mesh);
      this.pathHighlightPool[index] = mesh;
    }

    return this.pathHighlightPool[index];
  }

  updateMovePathHighlights(state) {
    if (!this.pathHighlightGroup) {
      return;
    }

    const moves = state.diceValue ? state.availableMoves || [] : [];
    if (!moves.length) {
      this.clearMovePathHighlights();
      return;
    }

    const highlights = new Map();
    moves.forEach((move) => {
      move.path?.forEach((step, index) => {
        if (!step.cell) {
          return;
        }
        const key = cellKey(step.cell);
        const existing = highlights.get(key);
        const isDestination = index === move.path.length - 1;
        if (!existing) {
          highlights.set(key, {
            cell: step.cell,
            playerId: move.playerId,
            order: index,
            isDestination
          });
          return;
        }

        existing.order = Math.min(existing.order, index);
        existing.isDestination = existing.isDestination || isDestination;
      });
    });

    const orderedHighlights = [...highlights.values()].sort((left, right) => left.order - right.order);
    this.clearMovePathHighlights();
    orderedHighlights.forEach((highlight, index) => {
      const mesh = this.getMovePathHighlightMesh(index);
      const playerMaterials = this.pathHighlightMaterials[highlight.playerId] || this.pathHighlightMaterials.red;
      mesh.material = highlight.isDestination ? playerMaterials.destination : playerMaterials.step;
      mesh.position.copy(gridToWorld(highlight.cell, BOARD_TOP_Y + 0.205));
      mesh.scale.setScalar(highlight.isDestination ? 1.05 : 0.92);
      mesh.visible = true;
      mesh.userData.baseScale = highlight.isDestination ? 1.05 : 0.92;
      mesh.userData.isDestination = highlight.isDestination;
      mesh.userData.pathOrder = highlight.order;
    });
  }

  updateDiceStations(state) {
    this.diceStations?.forEach((station, playerId) => {
      const active = state.activePlayers.includes(playerId);
      station.group.visible = active;
      station.activeRing.material.opacity = playerId === state.currentPlayer ? 0.48 : 0;
      station.pointer.visible = active && playerId === state.currentPlayer;
      station.activeRing.material.color.set(PLAYER_META[playerId].accent);
      if (!active) {
        return;
      }
      const displayValue = playerId === state.currentPlayer
        ? state.diceValue ?? null
        : null;
      this.updateDiceFace(displayValue, playerId);
    });
    this.diceGroup = this.getActiveDiceStation().cube;
    this.diceSpotLight.position.copy(this.getActiveDiceStation().group.position).setY(1.15);
    this.dicePulseRing?.position.copy(this.getActiveDiceStation().group.position).setY(0.15);
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

  focusActivePlayer(playerId, options = {}) {
    const player = PLAYER_META[playerId];
    if (!player) {
      return;
    }

    const zonePosition = gridToWorld(player.zone, 0.1);
    this.activeZoneHighlight.visible = true;
    this.activeZoneHighlight.position.x = zonePosition.x;
    this.activeZoneHighlight.position.z = zonePosition.z;

    if (options.moveCamera === false) {
      return;
    }

    if (!this.cameraOptions.autoFocusCurrentPlayer) {
      this.focusTarget.set(0, 0.1, 0);
      return;
    }

    const focusPlayer = PLAYER_META[options.cameraPlayerId] || player;
    const focusPosition = gridToWorld(focusPlayer.zone, 0.1);
    this.focusTarget.copy(focusPosition).multiplyScalar(0.28);
  }

  async playTurnIntro(state, options = {}) {
    if (!state?.currentPlayer) {
      return false;
    }
    this.focusActivePlayer(state.currentPlayer, options);
    if (options.moveCamera === false) {
      return false;
    }
    return this.cameraController.focusPlayer(options.cameraPlayerId || state.currentPlayer, { duration: 620 });
  }

  async animateDice(value, options = {}) {
    return this.animateDiceSequence(value, options);
  }

  async animateDiceSequence(value, options = {}) {
    const serial = ++this.animationSerial;
    const station = this.getActiveDiceStation();
    const diceCube = station.cube;
    this.diceGroup = diceCube;
    this.diceSpotLight.position.copy(station.group.position).setY(1.15);
    this.updateDiceFace(null, this.activePlayerId);
    this.diceSpotLight.intensity = 1.2;
    if (this.cameraOptions.cinematicCamera && !options.suppressCamera) {
      await this.cameraController.focusDice({ duration: 520 });
      if (!this.isAnimationActive(serial)) {
        return false;
      }
    }

    options.onRollStart?.();
    const duration = 880;
    const start = performance.now();
    const startRotation = diceCube.rotation.clone();
    const targetRotation = new THREE.Euler(
      startRotation.x + Math.PI * (3.4 + Math.random()),
      startRotation.y + Math.PI * (4.2 + Math.random()),
      startRotation.z + Math.PI * (3.8 + Math.random())
    );

    await new Promise((resolve) => {
      const tick = (now) => {
        if (!this.isAnimationActive(serial)) {
          resolve(false);
          return;
        }
        const progress = Math.min(1, (now - start) / duration);
        const eased = easeInOutCubic(progress);
        diceCube.rotation.x = startRotation.x + (targetRotation.x - startRotation.x) * eased;
        diceCube.rotation.y = startRotation.y + (targetRotation.y - startRotation.y) * eased;
        diceCube.rotation.z = startRotation.z + (targetRotation.z - startRotation.z) * eased;
        const lift = Math.sin(progress * Math.PI) * 0.42;
        diceCube.position.y = lift;
        diceCube.scale.setScalar(1 + Math.sin(progress * Math.PI) * 0.08);
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(tick);
    });

    if (!this.isAnimationActive(serial)) {
      return false;
    }

    diceCube.rotation.set(0, 0, 0);
    diceCube.position.y = 0;
    diceCube.scale.setScalar(1);
    this.updateDiceFace(value, this.activePlayerId);
    this.playDiceResultPulse();
    await this.wait(260, serial);
    this.diceSpotLight.intensity = 0;
    if (this.cameraOptions.cinematicCamera && !options.suppressCamera) {
      await this.cameraController.focusPlayer(options.cameraPlayerId || this.activePlayerId, { duration: 520 });
    }
    return this.isAnimationActive(serial);
  }

  async animateTokenMove(tokenId, path, captures, stateAfter, onStep, options = {}) {
    const serial = ++this.animationSerial;
    const tokenMesh = this.tokenMeshes.get(tokenId);
    const stepDuration = options.tokenSpeed === 'fast' ? 150 : 230;
    const landingDuration = options.tokenSpeed === 'fast' ? 110 : 170;
    if (!tokenMesh) {
      this.setState(stateAfter, {
        moveCamera: options.allowTurnCamera !== false,
        cameraPlayerId: options.turnCameraPlayerId || stateAfter.currentPlayer
      });
      return false;
    }

    this.setSelectedToken(tokenId);
    for (const step of path) {
      const target = gridToWorld(step.cell, TOKEN_BASE_Y);
      if (this.cameraOptions.cinematicCamera && !options.suppressCamera) {
        this.cameraController.followToken(target, { duration: 240 });
      }
      const moved = await this.animateMeshTo(tokenMesh, target, stepDuration, TOKEN_ARC, serial);
      if (!moved) {
        return false;
      }
      onStep?.(step);
      await this.animateLanding(tokenMesh, serial, landingDuration);
      if (!this.isAnimationActive(serial)) {
        return false;
      }
    }

    if (captures?.length) {
      const landing = tokenMesh.position.clone();
      this.playCaptureMoment(landing, { suppressCamera: options.suppressCamera });
      const finalPositions = this.computeTokenPositions(stateAfter);
      for (const capture of captures) {
        const capturedMesh = this.tokenMeshes.get(capture.tokenId);
        const target = finalPositions.get(capture.tokenId);
        if (capturedMesh && target) {
          await this.animateCaptureReturn(capturedMesh, target, serial);
        }
      }
    }

    const finalStep = path[path.length - 1];
    if (finalStep?.kind === 'track' && SAFE_COMMON_INDICES.has(finalStep.commonIndex)) {
      this.playSafeCellPulse(gridToWorld(finalStep.cell, TOKEN_BASE_Y));
    }

    if (finalStep?.kind === 'home-lane') {
      this.playHomeCelebration(gridToWorld(finalStep.cell, TOKEN_BASE_Y), { entry: true });
    }

    if (options.reachedHome) {
      this.playHomeCelebration(tokenMesh.position.clone(), { finish: true });
      if (this.cameraOptions.cinematicCamera && !options.suppressCamera) {
        await this.cameraController.focusHome(tokenMesh.position, { duration: 520 });
      }
    }

    this.setSelectedToken(null);
    this.setState(stateAfter, {
      moveCamera: options.allowTurnCamera !== false,
      cameraPlayerId: options.turnCameraPlayerId || stateAfter.currentPlayer
    });
    if (this.cameraOptions.cinematicCamera && !stateAfter.winner && options.allowTurnCamera !== false) {
      await this.cameraController.focusPlayer(options.turnCameraPlayerId || stateAfter.currentPlayer, { duration: 560 });
    }
    return true;
  }

  animateMeshTo(mesh, target, duration, arc, serial = this.animationSerial) {
    const start = mesh.position.clone();
    const startedAt = performance.now();

    return new Promise((resolve) => {
      const tick = (now) => {
        if (!this.isAnimationActive(serial)) {
          resolve(false);
          return;
        }
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = easeInOutCubic(progress);
        mesh.position.lerpVectors(start, target, eased);
        mesh.position.y = start.y + (target.y - start.y) * eased + Math.sin(progress * Math.PI) * arc;
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          mesh.position.copy(target);
          resolve(true);
        }
      };
      requestAnimationFrame(tick);
    });
  }

  animateLanding(mesh, serial = this.animationSerial, duration = 170) {
    const baseScale = 1;
    const startedAt = performance.now();

    return new Promise((resolve) => {
      const tick = (now) => {
        if (!this.isAnimationActive(serial)) {
          resolve(false);
          return;
        }
        const progress = Math.min(1, (now - startedAt) / duration);
        const bounce = 1 + Math.sin(progress * Math.PI) * 0.1;
        const settled = progress > 0.62 ? 1 + (bounce - 1) * (1 - easeOutBack((progress - 0.62) / 0.38)) : bounce;
        mesh.scale.setScalar(Math.max(0.96, settled * baseScale));
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          mesh.scale.setScalar(baseScale);
          this.spawnPulse(mesh.position.clone(), THEME.goldSoft, { radius: 0.42, duration: 420, height: 0.04 });
          resolve(true);
        }
      };
      requestAnimationFrame(tick);
    });
  }

  async animateCaptureReturn(mesh, target, serial) {
    const startedAt = performance.now();
    const duration = 620;
    const start = mesh.position.clone();
    const spinStart = mesh.rotation.y;
    return new Promise((resolve) => {
      const tick = (now) => {
        if (!this.isAnimationActive(serial)) {
          resolve(false);
          return;
        }
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = easeInOutCubic(progress);
        mesh.position.lerpVectors(start, target, eased);
        mesh.position.y = start.y + (target.y - start.y) * eased + Math.sin(progress * Math.PI) * TOKEN_ARC * 1.55;
        mesh.rotation.y = spinStart + Math.PI * 2 * eased;
        mesh.scale.setScalar(1 - Math.sin(progress * Math.PI) * 0.12);
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          mesh.position.copy(target);
          mesh.scale.setScalar(1);
          resolve(true);
        }
      };
      requestAnimationFrame(tick);
    });
  }

  isAnimationActive(serial) {
    return serial === this.animationSerial;
  }

  wait(duration, serial = this.animationSerial) {
    return new Promise((resolve) => {
      const startedAt = performance.now();
      const tick = (now) => {
        if (!this.isAnimationActive(serial) || now - startedAt >= duration) {
          resolve(this.isAnimationActive(serial));
          return;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  spawnPulse(position, color = THEME.goldSoft, options = {}) {
    if (!this.effectsEnabled) {
      return null;
    }
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(options.radius || 0.38, options.thickness || 0.018, 8, 72),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: options.opacity || 0.62,
        depthWrite: false
      })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.copy(position);
    mesh.position.y = options.height ?? 0.52;
    this.effectGroup.add(mesh);
    this.activeEffects.push({
      mesh,
      startedAt: performance.now(),
      duration: options.duration || 620,
      startScale: options.startScale || 0.56,
      endScale: options.endScale || 1.85,
      startOpacity: options.opacity || 0.62
    });
    return mesh;
  }

  playDiceResultPulse() {
    const station = this.getActiveDiceStation();
    this.spawnPulse(station.group.position.clone().setY(0.14), THEME.goldSoft, {
      radius: 0.56,
      duration: 700,
      startScale: 0.72,
      endScale: 1.7,
      opacity: 0.72,
      height: 0.14
    });
    this.dicePulseRing.material.opacity = 0.72;
    this.dicePulseRing.scale.setScalar(0.7);
    this.dicePulseRing.position.copy(station.group.position).setY(0.15);
  }

  playCaptureMoment(position, options = {}) {
    this.spawnPulse(position.clone(), '#b78a46', {
      radius: 0.48,
      duration: 560,
      startScale: 0.48,
      endScale: 2.15,
      opacity: 0.7,
      height: 0.54
    });
    if (this.cameraOptions.cinematicCamera && !options.suppressCamera) {
      this.cameraController.focusCapture(position, { duration: 280 });
    }
  }

  playSafeCellPulse(position) {
    this.spawnPulse(position.clone(), '#d6b47a', {
      radius: 0.44,
      duration: 760,
      startScale: 0.66,
      endScale: 1.72,
      opacity: 0.56,
      height: 0.54
    });
  }

  playHomeCelebration(position, options = {}) {
    const radius = options.finish ? 0.62 : 0.46;
    this.spawnPulse(position.clone(), '#f2c781', {
      radius,
      duration: options.finish ? 920 : 700,
      startScale: 0.6,
      endScale: options.finish ? 2.25 : 1.85,
      opacity: options.finish ? 0.78 : 0.54,
      height: 0.56
    });
    if (options.finish) {
      this.spawnPulse(new THREE.Vector3(0, TOKEN_BASE_Y, 0), '#fff2c5', {
        radius: 0.82,
        duration: 1040,
        startScale: 0.58,
        endScale: 2.0,
        opacity: 0.36,
        height: 0.62
      });
    }
  }

  async playWinnerCamera(playerId) {
    this.spawnPulse(new THREE.Vector3(0, TOKEN_BASE_Y, 0), '#f2c781', {
      radius: 1.1,
      duration: 1300,
      startScale: 0.75,
      endScale: 2.4,
      opacity: 0.58,
      height: 0.62
    });
    return this.cameraController.focusWinner(playerId, { duration: 980 });
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

  updateMovePathHighlightAppearance(time) {
    if (!this.pathHighlightPool?.length || !this.pathHighlightMaterials) {
      return;
    }

    const pulse = (Math.sin(time * 3.4) + 1) / 2;
    PLAYER_IDS.forEach((playerId) => {
      const materials = this.pathHighlightMaterials[playerId];
      materials.step.opacity = 0.16 + pulse * 0.13;
      materials.destination.opacity = 0.34 + pulse * 0.18;
    });

    this.pathHighlightPool.forEach((mesh) => {
      if (!mesh.visible) {
        return;
      }
      const baseScale = mesh.userData.baseScale || 1;
      const destinationBoost = mesh.userData.isDestination ? 0.055 : 0.032;
      const offsetPulse = (Math.sin(time * 3.7 + mesh.userData.pathOrder * 0.5) + 1) / 2;
      mesh.scale.setScalar(baseScale + offsetPulse * destinationBoost);
      mesh.position.y = BOARD_TOP_Y + 0.205 + offsetPulse * 0.012;
    });
  }

  updateActiveZone(time) {
    if (!this.activeZoneHighlight?.visible) {
      return;
    }
    this.activeZoneHighlight.material.opacity = 0.13 + (Math.sin(time * 2.2) + 1) * 0.035;
    this.diceStations?.forEach((station, playerId) => {
      if (playerId === this.activePlayerId && station.group.visible) {
        station.activeRing.material.opacity = 0.42 + (Math.sin(time * 2.8) + 1) * 0.08;
        station.activeRing.scale.setScalar(1 + (Math.sin(time * 2.2) + 1) * 0.025);
        station.pointer.visible = true;
        station.pointer.position.y = 1.48 + (Math.sin(time * 3.2) + 1) * 0.09;
        station.pointer.rotation.y = Math.sin(time * 1.8) * 0.18;
        station.pointerHalo.material.opacity = 0.34 + (Math.sin(time * 4.1) + 1) * 0.12;
        station.pointerHalo.scale.setScalar(0.92 + (Math.sin(time * 3.4) + 1) * 0.08);
      } else {
        station.activeRing.material.opacity *= 0.86;
        station.pointer.visible = false;
      }
    });
  }

  updateEffects() {
    const now = performance.now();
    this.activeEffects = this.activeEffects.filter((effect) => {
      const progress = Math.min(1, (now - effect.startedAt) / effect.duration);
      const eased = easeOutBack(progress);
      const scale = effect.startScale + (effect.endScale - effect.startScale) * eased;
      effect.mesh.scale.setScalar(scale);
      effect.mesh.material.opacity = effect.startOpacity * (1 - progress);
      if (progress >= 1) {
        effect.mesh.parent?.remove(effect.mesh);
        effect.mesh.material.dispose();
        effect.mesh.geometry.dispose();
        return false;
      }
      return true;
    });

    if (this.dicePulseRing?.material.opacity > 0.001) {
      this.dicePulseRing.scale.multiplyScalar(1.025);
      this.dicePulseRing.material.opacity *= 0.925;
    }
  }

  updateSurroundRings(time) {
    this.royaleRings?.forEach((ring, index) => {
      const breath = (Math.sin(time * 0.42 + index * 1.4) + 1) / 2;
      ring.rotation.y = ring.userData.baseRotationY
        + Math.sin(time * ring.userData.angularFrequency + ring.userData.phase) * ring.userData.oscillationAmplitude;
      ring.scale.setScalar((ring.userData.baseScale || 1) + breath * 0.0018);
      ring.material.opacity = (ring.userData.baseOpacity || 0.34) * (0.86 + breath * 0.14);
    });
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      const delta = this.clock.getDelta();
      const time = this.clock.elapsedTime;
      if (!this.userOrbiting) {
        this.controls.target.lerp(this.focusTarget, 1 - Math.exp(-delta * 1.6));
      }
      this.controls.update();
      this.updateTokenAppearance(time);
      this.updateMovePathHighlightAppearance(time);
      this.updateActiveZone(time);
      this.updateEffects(delta);
      this.updateSurroundRings(time);
      this.renderer.render(this.scene, this.camera);
    });
  }
}

export { gridToWorld, CELL_SIZE, BOARD_TOP_Y };
