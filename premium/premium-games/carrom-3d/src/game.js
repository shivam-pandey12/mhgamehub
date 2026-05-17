import * as THREE from "three";
import * as CANNON from "cannon-es";
import { gsap } from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const BOARD = {
  outerSize: 12,
  innerSize: 10,
  thickness: 0.72,
  topY: 0.72,
  wallThickness: 0.38,
  wallHeight: 0.52,
  pocketRadius: 0.62,
  pocketOffset: 4.36,
  playableHalf: 4.62,
  baselineZ: 3.62,
};

const COIN = {
  radius: 0.27,
  height: 0.18,
  mass: 0.5,
  y: BOARD.topY + 0.09,
};

const STRIKER = {
  radius: 0.34,
  height: 0.2,
  mass: 0.85,
  y: BOARD.topY + 0.1,
};

const SHOT = {
  minForce: 1.4,
  maxForce: 13.8,
  maxDrag: 3.05,
};

const MATCH = {
  pointTarget: 25,
  queenBonus: 3,
  nextRoundDelayMs: 1600,
  placementBand: 0.72,
  legalForwardDot: 0.22,
};

const POCKET = {
  influenceRadius: BOARD.pocketRadius + 0.44,
  captureRadius: BOARD.pocketRadius - 0.1,
  pullStrength: 0.032,
  sinkStrength: 0.07,
};

const FEEL = {
  coinFriction: 0.045,
  coinRestitution: 0.86,
  wallFriction: 0.06,
  wallRestitution: 0.76,
  coinLinearDamping: 0.145,
  coinAngularDamping: 0.28,
  strikerLinearDamping: 0.115,
  strikerAngularDamping: 0.33,
  microMotionLinearThreshold: 0.21,
  microMotionAngularThreshold: 0.26,
  settleLinearThreshold: 0.012,
  settleAngularThreshold: 0.02,
  lowMotionGrace: 0.22,
  turnSwitchDelayMs: 320,
  shotSettleDelayMs: 140,
  aimLerp: 15,
  aimFadeLerp: 11,
  surfaceLinearDrag: 0.34,
  surfaceQuadraticDrag: 0.035,
  spinCurveStrength: 0.022,
  wallSpinTransfer: 0.11,
  placementStep: 0.08,
};

const AI_DIFFICULTY = {
  easy: {
    angleJitter: 0.28,
    powerJitter: 0.18,
  },
  medium: {
    angleJitter: 0.16,
    powerJitter: 0.11,
  },
  hard: {
    angleJitter: 0.07,
    powerJitter: 0.06,
  },
};

const PLAYER_CONFIG = [
  {
    name: "Player 1",
    coinType: "white",
    label: "White",
    chipColor: "#f9f0de",
  },
  {
    name: "Player 2",
    coinType: "black",
    label: "Black",
    chipColor: "#111827",
  },
];

function clamp01(value) {
  return THREE.MathUtils.clamp(value, 0, 1);
}

function randFloat(min, max) {
  return min + Math.random() * (max - min);
}

function rotate2D(x, z, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: x * cos - z * sin,
    z: x * sin + z * cos,
  };
}

function createWoodTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  const background = ctx.createLinearGradient(0, 0, 1024, 1024);
  background.addColorStop(0, "#d99a5b");
  background.addColorStop(0.55, "#b16d38");
  background.addColorStop(1, "#8f5627");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, 1024, 1024);

  for (let i = 0; i < 90; i += 1) {
    const alpha = i % 2 === 0 ? 0.08 : 0.03;
    ctx.fillStyle = `rgba(66, 35, 10, ${alpha})`;
    const width = randFloat(18, 40);
    const x = randFloat(-50, 1024);
    ctx.fillRect(x, 0, width, 1024);
  }

  ctx.save();
  ctx.strokeStyle = "rgba(70, 34, 12, 0.55)";
  ctx.lineWidth = 14;
  ctx.strokeRect(92, 92, 840, 840);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(251, 230, 197, 0.45)";
  ctx.strokeRect(128, 128, 768, 768);

  ctx.fillStyle = "rgba(34, 17, 7, 0.92)";
  const pocketCenters = [
    [154, 154],
    [870, 154],
    [154, 870],
    [870, 870],
  ];
  pocketCenters.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 58, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "rgba(220, 188, 126, 0.35)";
    ctx.stroke();
  });

  ctx.strokeStyle = "rgba(112, 23, 16, 0.95)";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(512, 512, 120, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(250, 242, 229, 0.85)";
  ctx.beginPath();
  ctx.arc(512, 512, 82, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(121, 38, 28, 0.72)";
  ctx.lineWidth = 5;
  const baselineYTop = 252;
  const baselineYBottom = 772;
  [
    baselineYTop,
    baselineYBottom,
  ].forEach((lineY) => {
    ctx.beginPath();
    ctx.moveTo(312, lineY);
    ctx.lineTo(712, lineY);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(512, lineY, 68, 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function createShadowMaterial() {
  return new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
  });
}

function createCircleShadow(radius) {
  return new THREE.Mesh(
    new THREE.CircleGeometry(radius, 24),
    createShadowMaterial(),
  );
}

function makePieceMaterial(type, active = false) {
  if (type === "white") {
    return new THREE.MeshStandardMaterial({
      color: "#f2e8d8",
      roughness: 0.34,
      metalness: 0.05,
      emissive: "#8f7446",
      emissiveIntensity: active ? 0.24 : 0.03,
    });
  }

  if (type === "black") {
    return new THREE.MeshStandardMaterial({
      color: "#1b232f",
      roughness: 0.4,
      metalness: 0.08,
      emissive: "#4a5c82",
      emissiveIntensity: active ? 0.22 : 0.02,
    });
  }

  if (type === "queen") {
    return new THREE.MeshStandardMaterial({
      color: "#b51e24",
      roughness: 0.33,
      metalness: 0.06,
      emissive: "#ff4b4f",
      emissiveIntensity: 0.18,
    });
  }

  return new THREE.MeshStandardMaterial({
    color: "#ffbe55",
    roughness: 0.26,
    metalness: 0.12,
    emissive: "#ffbf40",
    emissiveIntensity: active ? 0.55 : 0.16,
  });
}

export class CarromGame {
  constructor({ container, ui }) {
    this.container = container;
    this.ui = ui;

    this.mode = "vs-ai";
    this.aiDifficulty = "medium";
    this.fixedTimeStep = 1 / 120;
    this.bodyCutoff = FEEL.settleLinearThreshold;
    this.angularCutoff = FEEL.settleAngularThreshold;
    this.softDecayThreshold = FEEL.microMotionLinearThreshold;
    this.softAngularDecayThreshold = FEEL.microMotionAngularThreshold;
    this.lowMotionGrace = FEEL.lowMotionGrace;
    this.turnSwitchDelayMs = FEEL.turnSwitchDelayMs;
    this.shotSettleDelayMs = FEEL.shotSettleDelayMs;
    this.lastCollisionAt = 0;
    this.audioContext = null;
    this.soundEnabled = true;
    this.rulesVisible = false;
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.pointerPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -BOARD.topY);
    this.tempVector = new THREE.Vector3();
    this.lastShakeOffset = new THREE.Vector3();
    this.shakeState = { amplitude: 0, timeLeft: 0 };
    this.aiTimer = null;
    this.turnTransitionTimer = null;
    this.roundTransitionTimer = null;
    this.shotSettledAt = null;
    this.isAiming = false;
    this.isPlacingStriker = false;
    this.turnReady = false;
    this.shotInProgress = false;
    this.gameOver = false;
    this.currentShot = null;
    this.currentAim = null;
    this.centerSpotIndex = 0;
    this.roundNumber = 1;
    this.matchPointTarget = MATCH.pointTarget;
    this.nextBreakIndex = 0;
    this.matchWinnerIndex = null;
    this.turnPhase = "placement";
    this.aimTarget = {
      direction: new THREE.Vector3(0, 0, -1),
      power: 0,
      active: 0,
    };
    this.aimVisual = {
      direction: new THREE.Vector3(0, 0, -1),
      power: 0,
      active: 0,
    };

    this.players = PLAYER_CONFIG.map((player) => ({
      ...player,
      score: 0,
      roundsWon: 0,
      due: 0,
      roundCoins: 0,
      securedPieces: [],
      isAI: false,
      strikerX: 0,
    }));
    this.players[1].isAI = true;
    this.currentPlayerIndex = 0;

    this.queenState = {
      pendingCoverBy: null,
      coveredBy: null,
    };

    this.pockets = [
      new THREE.Vector2(-BOARD.pocketOffset, -BOARD.pocketOffset),
      new THREE.Vector2(BOARD.pocketOffset, -BOARD.pocketOffset),
      new THREE.Vector2(-BOARD.pocketOffset, BOARD.pocketOffset),
      new THREE.Vector2(BOARD.pocketOffset, BOARD.pocketOffset),
    ];

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#07111a");
    this.scene.fog = new THREE.Fog("#07111a", 16, 30);

    this.camera = new THREE.PerspectiveCamera(
      46,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      100,
    );
    this.camera.position.set(0, 14.2, 9.4);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.minDistance = 10;
    this.controls.maxDistance = 17;
    this.controls.minPolarAngle = 0.52;
    this.controls.maxPolarAngle = 1.08;
    this.controls.minAzimuthAngle = -0.42;
    this.controls.maxAzimuthAngle = 0.42;
    this.controls.target.set(0, BOARD.topY, 0);
    this.defaultCameraPosition = this.camera.position.clone();
    this.defaultControlsTarget = this.controls.target.clone();

    this.world = new CANNON.World({
      gravity: new CANNON.Vec3(0, 0, 0),
    });
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);
    this.world.allowSleep = true;
    this.world.solver.iterations = 20;

    this.physicsMaterial = new CANNON.Material("pieces");
    this.wallMaterial = new CANNON.Material("walls");
    this.world.defaultContactMaterial = new CANNON.ContactMaterial(
      this.physicsMaterial,
      this.physicsMaterial,
      {
        friction: FEEL.coinFriction,
        restitution: FEEL.coinRestitution,
      },
    );
    this.world.addContactMaterial(
      new CANNON.ContactMaterial(this.physicsMaterial, this.wallMaterial, {
        friction: FEEL.wallFriction,
        restitution: FEEL.wallRestitution,
      }),
    );

    this.allPieces = [];
    this.coins = [];
    this.dynamicBodies = [];
    this.bodyToPiece = new Map();

    this.boardTexture = createWoodTexture();
    this.coinGeometry = new THREE.CylinderGeometry(COIN.radius, COIN.radius, COIN.height, 48);
    this.strikerGeometry = new THREE.CylinderGeometry(
      STRIKER.radius,
      STRIKER.radius,
      STRIKER.height,
      48,
    );

    this.createLights();
    this.createEnvironment();
    this.createBoard();
    this.createAimHelpers();
    this.createPieces();
    this.createStrikerPulse();
    this.resetAllPieceTransforms();
    this.bindUI();
    this.bindEvents();

    this.prepareTurn("Break shot. Drag opposite the direction you want to strike.");
    this.animate();
  }

  createLights() {
    const ambient = new THREE.AmbientLight("#f5e7cf", 1.1);
    this.scene.add(ambient);

    const directional = new THREE.DirectionalLight("#fff4d6", 1.6);
    directional.position.set(5.2, 14, 5.8);
    directional.castShadow = true;
    directional.shadow.mapSize.set(2048, 2048);
    directional.shadow.radius = 3;
    directional.shadow.blurSamples = 8;
    directional.shadow.camera.near = 1;
    directional.shadow.camera.far = 30;
    directional.shadow.camera.left = -10;
    directional.shadow.camera.right = 10;
    directional.shadow.camera.top = 10;
    directional.shadow.camera.bottom = -10;
    this.scene.add(directional);
  }

  createEnvironment() {
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(18, 64),
      new THREE.ShadowMaterial({ opacity: 0.24 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  createBoard() {
    const boardGroup = new THREE.Group();
    this.scene.add(boardGroup);

    const baseMaterial = new THREE.MeshStandardMaterial({
      map: this.boardTexture,
      roughness: 0.62,
      metalness: 0.02,
    });
    const sideMaterial = new THREE.MeshStandardMaterial({
      color: "#6b3d1a",
      roughness: 0.7,
      metalness: 0.02,
    });

    const base = new THREE.Mesh(
      new THREE.BoxGeometry(BOARD.outerSize, BOARD.thickness, BOARD.outerSize),
      [sideMaterial, sideMaterial, baseMaterial, sideMaterial, sideMaterial, sideMaterial],
    );
    base.position.y = BOARD.thickness / 2;
    base.castShadow = true;
    base.receiveShadow = true;
    boardGroup.add(base);

    const playSurface = new THREE.Mesh(
      new THREE.PlaneGeometry(BOARD.innerSize, BOARD.innerSize),
      new THREE.MeshStandardMaterial({
        map: this.boardTexture,
        roughness: 0.55,
        metalness: 0.03,
      }),
    );
    playSurface.rotation.x = -Math.PI / 2;
    playSurface.position.y = BOARD.topY + 0.002;
    playSurface.receiveShadow = true;
    boardGroup.add(playSurface);

    const wallMaterial = new THREE.MeshStandardMaterial({
      color: "#7f4f24",
      roughness: 0.62,
      metalness: 0.02,
    });
    const wallHeight = BOARD.wallHeight;
    const wallDepth = BOARD.wallThickness;
    const wallY = BOARD.topY + wallHeight / 2 - 0.02;
    const longWallGeometry = new THREE.BoxGeometry(BOARD.innerSize + BOARD.wallThickness, wallHeight, wallDepth);
    const shortWallGeometry = new THREE.BoxGeometry(wallDepth, wallHeight, BOARD.innerSize + BOARD.wallThickness);
    const wallPositions = [
      { geometry: longWallGeometry, position: [0, wallY, -BOARD.innerSize / 2 - wallDepth / 2 + 0.15] },
      { geometry: longWallGeometry, position: [0, wallY, BOARD.innerSize / 2 + wallDepth / 2 - 0.15] },
      { geometry: shortWallGeometry, position: [-BOARD.innerSize / 2 - wallDepth / 2 + 0.15, wallY, 0] },
      { geometry: shortWallGeometry, position: [BOARD.innerSize / 2 + wallDepth / 2 - 0.15, wallY, 0] },
    ];
    wallPositions.forEach(({ geometry, position }) => {
      const wall = new THREE.Mesh(geometry, wallMaterial);
      wall.position.set(...position);
      wall.castShadow = true;
      wall.receiveShadow = true;
      boardGroup.add(wall);
    });

    const pocketMaterial = new THREE.MeshStandardMaterial({
      color: "#120c0b",
      roughness: 0.9,
      metalness: 0,
    });
    this.pockets.forEach((pocket) => {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(BOARD.pocketRadius * 0.96, BOARD.pocketRadius * 1.05, 0.14, 48),
        pocketMaterial,
      );
      mesh.position.set(pocket.x, BOARD.topY + 0.03, pocket.y);
      mesh.receiveShadow = true;
      boardGroup.add(mesh);
    });

    const wallBodies = [
      {
        position: new CANNON.Vec3(0, wallY, -BOARD.playableHalf - BOARD.wallThickness / 2),
        halfExtents: new CANNON.Vec3(BOARD.playableHalf + 0.4, wallHeight / 2, BOARD.wallThickness / 2),
      },
      {
        position: new CANNON.Vec3(0, wallY, BOARD.playableHalf + BOARD.wallThickness / 2),
        halfExtents: new CANNON.Vec3(BOARD.playableHalf + 0.4, wallHeight / 2, BOARD.wallThickness / 2),
      },
      {
        position: new CANNON.Vec3(-BOARD.playableHalf - BOARD.wallThickness / 2, wallY, 0),
        halfExtents: new CANNON.Vec3(BOARD.wallThickness / 2, wallHeight / 2, BOARD.playableHalf + 0.4),
      },
      {
        position: new CANNON.Vec3(BOARD.playableHalf + BOARD.wallThickness / 2, wallY, 0),
        halfExtents: new CANNON.Vec3(BOARD.wallThickness / 2, wallHeight / 2, BOARD.playableHalf + 0.4),
      },
    ];

    wallBodies.forEach(({ position, halfExtents }) => {
      const body = new CANNON.Body({
        type: CANNON.Body.STATIC,
        position,
        material: this.wallMaterial,
      });
      body.addShape(new CANNON.Box(halfExtents));
      this.world.addBody(body);
    });
  }

  createAimHelpers() {
    this.aimArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(0, BOARD.topY + 0.34, 0),
      1.5,
      0xffbe55,
      0.42,
      0.2,
    );
    this.aimArrow.visible = false;
    this.scene.add(this.aimArrow);

    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    this.predictionLine = new THREE.Line(
      lineGeometry,
      new THREE.LineDashedMaterial({
        color: 0xffd38c,
        dashSize: 0.42,
        gapSize: 0.22,
        transparent: true,
        opacity: 0.72,
      }),
    );
    this.predictionLine.visible = false;
    this.scene.add(this.predictionLine);

    this.aimArrow.line.material.transparent = true;
    this.aimArrow.cone.material.transparent = true;
    this.setAimOpacity(0);
  }

  createPieces() {
    this.createCoinsFromFormation();

    this.striker = this.makePiece({
      type: "striker",
      radius: STRIKER.radius,
      height: STRIKER.height,
      mass: STRIKER.mass,
      y: STRIKER.y,
      position: { x: 0, z: BOARD.baselineZ },
      label: "Striker",
    });
  }

  createCoinsFromFormation() {
    const axialCoords = [];
    for (let q = -2; q <= 2; q += 1) {
      for (let r = -2; r <= 2; r += 1) {
        const s = -q - r;
        const distance = Math.max(Math.abs(q), Math.abs(r), Math.abs(s));
        if (distance <= 2) {
          axialCoords.push({ q, r, distance });
        }
      }
    }

    const spacing = COIN.radius * 2.08;
    const rotation = Math.PI / 6;
    const center = axialCoords.find((coord) => coord.distance === 0);
    const inner = axialCoords
      .filter((coord) => coord.distance === 1)
      .sort((a, b) => Math.atan2(a.r, a.q) - Math.atan2(b.r, b.q));
    const outer = axialCoords
      .filter((coord) => coord.distance === 2)
      .sort((a, b) => Math.atan2(a.r, a.q) - Math.atan2(b.r, b.q));

    const formation = [{ ...center, type: "queen" }];
    inner.forEach((coord, index) => {
      formation.push({
        ...coord,
        type: index % 2 === 0 ? "white" : "black",
      });
    });
    outer.forEach((coord, index) => {
      formation.push({
        ...coord,
        type: index % 2 === 0 ? "black" : "white",
      });
    });

    formation.forEach((spot, index) => {
      const baseX = spacing * (Math.sqrt(3) * spot.q + (Math.sqrt(3) / 2) * spot.r);
      const baseZ = spacing * (1.5 * spot.r);
      const rotated = rotate2D(baseX, baseZ, rotation);
      const piece = this.makePiece({
        type: spot.type,
        radius: COIN.radius,
        height: COIN.height,
        mass: COIN.mass,
        y: COIN.y,
        position: { x: rotated.x, z: rotated.z },
        label: spot.type === "queen" ? "Queen" : `${spot.type} coin ${index}`,
      });
      this.coins.push(piece);
      if (spot.type === "queen") {
        this.queenPiece = piece;
      }
    });
  }

  makePiece({ type, radius, height, mass, y, position, label }) {
    const geometry = type === "striker" ? this.strikerGeometry : this.coinGeometry;
    const material = makePieceMaterial(type, type === "striker");
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.rotation.y = randFloat(0, Math.PI * 2);
    mesh.position.set(position.x, y, position.z);
    this.scene.add(mesh);

    const shadow = createCircleShadow(radius * 1.15);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(position.x, BOARD.topY + 0.01, position.z);
    this.scene.add(shadow);

    const body = new CANNON.Body({
      mass,
      material: this.physicsMaterial,
      position: new CANNON.Vec3(position.x, y, position.z),
      shape: new CANNON.Sphere(radius * 0.95),
      linearDamping: type === "striker" ? FEEL.strikerLinearDamping : FEEL.coinLinearDamping,
      angularDamping: type === "striker" ? FEEL.strikerAngularDamping : FEEL.coinAngularDamping,
      allowSleep: true,
      sleepSpeedLimit: FEEL.settleLinearThreshold * 1.1,
      sleepTimeLimit: 0.5,
    });

    body.addEventListener("collide", (event) => {
      this.handleCollision(event);
    });

    this.world.addBody(body);

    const piece = {
      type,
      label,
      mesh,
      shadow,
      body,
      radius,
      height,
      baseY: y,
      initialPosition: { x: position.x, z: position.z },
      displayPosition: new THREE.Vector3(position.x, y, position.z),
      spinAngle: mesh.rotation.y,
      lowMotionTime: 0,
      pocketed: false,
      pendingRespawn: false,
      scoredBy: null,
    };

    this.allPieces.push(piece);
    this.dynamicBodies.push(body);
    this.bodyToPiece.set(body, piece);

    return piece;
  }

  snapPieceToBody(piece) {
    piece.displayPosition.set(piece.body.position.x, piece.baseY, piece.body.position.z);
    piece.mesh.position.copy(piece.displayPosition);
    piece.shadow.position.set(piece.displayPosition.x, BOARD.topY + 0.012, piece.displayPosition.z);
    piece.mesh.visible = true;
  }

  resetAllPieceTransforms() {
    this.allPieces.forEach((piece) => {
      this.snapPieceToBody(piece);
    });
  }

  createStrikerPulse() {
    this.strikerPulse = gsap.timeline({
      repeat: -1,
      yoyo: true,
      paused: true,
      defaults: {
        duration: 0.82,
        ease: "sine.inOut",
      },
    });
    this.strikerPulse.to(this.striker.mesh.material, {
      emissiveIntensity: 0.86,
    }, 0);
    this.strikerPulse.to(this.striker.mesh.scale, {
      x: 1.035,
      y: 1.035,
      z: 1.035,
    }, 0);
  }

  bindUI() {
    this.ui.modeSelect.addEventListener("change", (event) => {
      this.mode = event.target.value;
      this.players[1].isAI = this.mode === "vs-ai";
      this.ui.difficultySelect.disabled = !this.players[1].isAI;
      this.playUITickSound("soft");
      this.updateUI();
      if (this.turnReady && this.isCurrentPlayerAI()) {
        this.scheduleAITurn();
      } else {
        this.clearAITimer();
      }
    });

    this.ui.difficultySelect.addEventListener("change", (event) => {
      this.aiDifficulty = event.target.value;
      this.playUITickSound("soft");
      this.updateUI();
    });

    this.ui.restartButton.addEventListener("click", () => {
      this.playUITickSound("confirm");
      this.restartMatch();
    });

    this.ui.soundButton.addEventListener("click", () => {
      if (this.soundEnabled) {
        this.playUITickSound("soft");
        this.soundEnabled = false;
      } else {
        this.soundEnabled = true;
        this.playUITickSound("confirm");
      }
      this.updateUI();
    });

    this.ui.cameraButton.addEventListener("click", () => {
      this.playUITickSound("soft");
      this.resetCamera();
    });

    this.ui.rulesButton.addEventListener("click", () => {
      this.rulesVisible = !this.rulesVisible;
      this.playUITickSound("soft");
      this.updateUI();
    });
  }

  bindEvents() {
    this.renderer.domElement.addEventListener("pointerdown", (event) => this.onPointerDown(event));
    window.addEventListener("pointermove", (event) => this.onPointerMove(event));
    window.addEventListener("pointerup", () => this.onPointerUp());
    window.addEventListener("resize", () => this.onResize());
  }

  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  getPlacementZForPlayer(playerIndex) {
    return playerIndex === 0 ? BOARD.baselineZ : -BOARD.baselineZ;
  }

  getForwardSignForPlayer(playerIndex) {
    return playerIndex === 0 ? -1 : 1;
  }

  getPlacementBounds() {
    const edgePadding = STRIKER.radius + 0.48;
    return {
      min: -BOARD.playableHalf + edgePadding,
      max: BOARD.playableHalf - edgePadding,
    };
  }

  clampStrikerX(x) {
    const bounds = this.getPlacementBounds();
    return THREE.MathUtils.clamp(x, bounds.min, bounds.max);
  }

  pointWithinPlacementBand(point, playerIndex = this.currentPlayerIndex) {
    const baselineZ = this.getPlacementZForPlayer(playerIndex);
    const bounds = this.getPlacementBounds();
    return Math.abs(point.z - baselineZ) <= MATCH.placementBand
      && point.x >= bounds.min - 0.2
      && point.x <= bounds.max + 0.2;
  }

  isStrikerPlacementLegal(x, playerIndex = this.currentPlayerIndex) {
    const targetX = this.clampStrikerX(x);
    const targetZ = this.getPlacementZForPlayer(playerIndex);
    return this.coins.every((piece) => {
      if (piece.pocketed || piece.pendingRespawn) {
        return true;
      }

      const requiredGap = STRIKER.radius + piece.radius + 0.08;
      const distance = Math.hypot(piece.body.position.x - targetX, piece.body.position.z - targetZ);
      return distance >= requiredGap;
    });
  }

  findNearestLegalStrikerX(targetX, playerIndex = this.currentPlayerIndex) {
    const clampedX = this.clampStrikerX(targetX);
    if (this.isStrikerPlacementLegal(clampedX, playerIndex)) {
      return clampedX;
    }

    const bounds = this.getPlacementBounds();
    const maxOffset = bounds.max - bounds.min;
    for (let offset = FEEL.placementStep; offset <= maxOffset; offset += FEEL.placementStep) {
      const right = this.clampStrikerX(clampedX + offset);
      if (this.isStrikerPlacementLegal(right, playerIndex)) {
        return right;
      }

      const left = this.clampStrikerX(clampedX - offset);
      if (this.isStrikerPlacementLegal(left, playerIndex)) {
        return left;
      }
    }

    return 0;
  }

  moveStrikerToX(x, playerIndex = this.currentPlayerIndex) {
    const legalX = this.findNearestLegalStrikerX(x, playerIndex);
    const targetZ = this.getPlacementZForPlayer(playerIndex);
    const player = this.players[playerIndex];
    player.strikerX = legalX;
    this.striker.body.position.set(legalX, this.striker.baseY, targetZ);
    this.striker.body.velocity.set(0, 0, 0);
    this.striker.body.angularVelocity.set(0, 0, 0);
    this.striker.body.previousPosition.copy(this.striker.body.position);
    this.striker.body.interpolatedPosition.copy(this.striker.body.position);
    this.snapPieceToBody(this.striker);
    return legalX;
  }

  isLegalShotDirection(direction, playerIndex = this.currentPlayerIndex) {
    const forward = this.getForwardSignForPlayer(playerIndex);
    return direction.z * forward >= MATCH.legalForwardDot;
  }

  onPointerDown(event) {
    if (
      event.button !== 0
      || this.gameOver
      || !this.turnReady
      || this.shotInProgress
      || this.isCurrentPlayerAI()
      || this.isBoardInMotion()
    ) {
      return;
    }

    this.ensureAudio();
    const point = this.getPointerPlaneIntersection(event);
    if (!point) {
      return;
    }

    const strikerPoint = new THREE.Vector3(this.striker.body.position.x, BOARD.topY, this.striker.body.position.z);
    const distance = point.distanceTo(strikerPoint);

    if (this.pointWithinPlacementBand(point) && distance > 0.92) {
      this.isPlacingStriker = true;
      this.controls.enabled = false;
      this.turnPhase = "placement";
      this.moveStrikerToX(point.x);
      this.setStatus("Striker placed. Drag from the striker toward the opposite half to shoot.");
      this.updateUI();
      return;
    }

    if (distance > 1.15) {
      return;
    }

    this.isAiming = true;
    this.turnPhase = "aiming";
    this.controls.enabled = false;
    this.playUITickSound("soft");
    this.updateAim(point);
    this.updateUI();
  }

  onPointerMove(event) {
    if (this.isPlacingStriker) {
      const point = this.getPointerPlaneIntersection(event);
      if (!point) {
        return;
      }

      this.moveStrikerToX(point.x);
      return;
    }

    if (!this.isAiming) {
      return;
    }

    const point = this.getPointerPlaneIntersection(event);
    if (!point) {
      return;
    }

    this.updateAim(point);
  }

  onPointerUp() {
    if (this.isPlacingStriker) {
      this.isPlacingStriker = false;
      this.controls.enabled = true;
      this.turnPhase = "placement";
      this.updateUI();
      return;
    }

    if (!this.isAiming) {
      return;
    }

    this.isAiming = false;
    this.controls.enabled = true;

    const aim = this.currentAim;
    this.hideAimHelpers();

    if (!aim || aim.power < 0.08) {
      this.turnPhase = "placement";
      this.setStatus("Shot canceled. Drag a little farther for power.");
      this.playUITickSound("soft");
      this.updateUI();
      return;
    }

    if (!this.isLegalShotDirection(aim.direction, this.currentPlayerIndex)) {
      this.turnPhase = "placement";
      this.setStatus("Illegal shot. Strike toward the opposite half of the board.");
      this.playUITickSound("soft");
      this.updateUI();
      return;
    }

    this.performShot(aim.direction, aim.power, false);
  }

  getPointerPlaneIntersection(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);

    const target = new THREE.Vector3();
    const hit = this.raycaster.ray.intersectPlane(this.pointerPlane, target);
    return hit ? target : null;
  }

  updateAim(point) {
    const strikerPosition = new THREE.Vector3(
      this.striker.body.position.x,
      BOARD.topY + 0.24,
      this.striker.body.position.z,
    );
    const drag = point.clone().sub(strikerPosition);
    drag.y = 0;

    const direction = drag.clone().multiplyScalar(-1);
    const dragLength = drag.length();
    const power = clamp01(dragLength / SHOT.maxDrag);

    if (direction.lengthSq() < 1e-6) {
      this.hideAimHelpers();
      this.setPower(0);
      return;
    }

    direction.normalize();
    this.currentAim = { direction, power };
    this.aimTarget.direction.copy(direction);
    this.aimTarget.power = power;
    this.aimTarget.active = 1;
  }

  updatePredictionLine(direction, baseLength) {
    const start = new THREE.Vector3(this.striker.body.position.x, BOARD.topY + 0.12, this.striker.body.position.z);
    const distanceData = this.computeWallIntersection(start, direction);
    const bounce = direction.clone();
    if (distanceData.axis === "x") {
      bounce.x *= -1;
    } else {
      bounce.z *= -1;
    }

    const hitPoint = start.clone().add(direction.clone().multiplyScalar(distanceData.distance));
    const bouncePoint = hitPoint.clone().add(bounce.multiplyScalar(Math.max(1.2, baseLength * 0.65)));
    this.predictionLine.geometry.setFromPoints([start, hitPoint, bouncePoint]);
    this.predictionLine.computeLineDistances();
    this.predictionLine.visible = true;
  }

  computeWallIntersection(start, direction) {
    const bounds = BOARD.playableHalf - STRIKER.radius * 0.8;
    const candidates = [];

    if (Math.abs(direction.x) > 1e-6) {
      const tx = direction.x > 0 ? (bounds - start.x) / direction.x : (-bounds - start.x) / direction.x;
      if (tx > 0) {
        candidates.push({ axis: "x", distance: tx });
      }
    }

    if (Math.abs(direction.z) > 1e-6) {
      const tz = direction.z > 0 ? (bounds - start.z) / direction.z : (-bounds - start.z) / direction.z;
      if (tz > 0) {
        candidates.push({ axis: "z", distance: tz });
      }
    }

    candidates.sort((a, b) => a.distance - b.distance);
    return candidates[0] ?? { axis: "z", distance: 2.4 };
  }

  setAimOpacity(opacity) {
    const easedOpacity = clamp01(opacity);
    this.aimArrow.line.material.opacity = easedOpacity * 0.9;
    this.aimArrow.cone.material.opacity = easedOpacity;
    this.predictionLine.material.opacity = easedOpacity * 0.76;
  }

  updateAimVisual(delta) {
    const targetActive = this.aimTarget.active;
    const fadeBlend = 1 - Math.exp(-delta * FEEL.aimFadeLerp);
    const aimBlend = 1 - Math.exp(-delta * FEEL.aimLerp);
    this.aimVisual.active = THREE.MathUtils.lerp(this.aimVisual.active, targetActive, fadeBlend);
    this.aimVisual.power = THREE.MathUtils.lerp(this.aimVisual.power, this.aimTarget.power, aimBlend);

    if (targetActive > 0) {
      this.aimVisual.direction.lerp(this.aimTarget.direction, aimBlend);
      this.aimVisual.direction.normalize();
    }

    if (this.aimVisual.active < 0.02 || this.aimVisual.power < 0.01) {
      this.aimArrow.visible = false;
      this.predictionLine.visible = false;
      this.setAimOpacity(0);
      this.setPower(0);
      return;
    }

    const strikerPosition = this.tempVector.set(
      this.striker.body.position.x,
      BOARD.topY + 0.24,
      this.striker.body.position.z,
    );
    const opacity = this.aimVisual.active * THREE.MathUtils.lerp(0.35, 1, this.aimVisual.power);
    const length = THREE.MathUtils.lerp(0.88, 3.95, this.aimVisual.power);

    this.aimArrow.position.copy(strikerPosition);
    this.aimArrow.setDirection(this.aimVisual.direction);
    this.aimArrow.setLength(length, 0.44, 0.22);
    this.aimArrow.visible = true;
    this.predictionLine.visible = true;
    this.setAimOpacity(opacity);
    this.updatePredictionLine(this.aimVisual.direction, length);
    this.setPower(this.aimVisual.power);
  }

  hideAimHelpers(immediate = false) {
    this.currentAim = null;
    this.aimTarget.power = 0;
    this.aimTarget.active = 0;

    if (immediate) {
      this.aimVisual.active = 0;
      this.aimVisual.power = 0;
      this.setAimOpacity(0);
      this.setPower(0);
      this.aimArrow.visible = false;
      this.predictionLine.visible = false;
    }
  }

  getShotForce(power) {
    const clampedPower = clamp01(power);
    const curvedPower = Math.pow(clampedPower, 1.55);
    const blendedPower = THREE.MathUtils.lerp(clampedPower * 0.55, curvedPower, 0.85);
    return THREE.MathUtils.lerp(SHOT.minForce, SHOT.maxForce, blendedPower);
  }

  performShot(direction, power, fromAI) {
    const force = this.getShotForce(power);
    const impulse = new CANNON.Vec3(direction.x * force, 0, direction.z * force);

    this.turnReady = false;
    this.turnPhase = "motion";
    this.shotInProgress = true;
    this.shotSettledAt = null;
    this.currentShot = {
      playerIndex: this.currentPlayerIndex,
      correctPieces: [],
      queenPocketed: false,
      strikerPocketed: false,
      wrongPieces: [],
      startedWithQueenPending: this.queenState.pendingCoverBy === this.currentPlayerIndex,
    };

    this.clearAITimer();
    this.clearTurnTransition();
    this.stopStrikerPulse();
    this.striker.body.wakeUp();
    this.striker.body.velocity.set(0, 0, 0);
    this.striker.body.angularVelocity.set(0, 0, 0);
    this.striker.body.applyImpulse(impulse, this.striker.body.position);
    this.triggerCameraShake(Math.max(0.008, power * 0.02));
    this.setStatus(fromAI ? "AI takes the shot..." : "Pieces are in motion.");
    this.updateUI();
  }

  animate = () => {
    const delta = Math.min(this.clock.getDelta(), 0.03);
    this.world.step(this.fixedTimeStep, delta, 4);
    this.afterPhysicsStep();
    this.syncMeshes(delta);
    this.updateShadows(delta);
    this.updateAimVisual(delta);
    this.camera.position.sub(this.lastShakeOffset);
    this.lastShakeOffset.set(0, 0, 0);
    this.controls.update();
    this.applyCameraShake(delta);
    this.renderer.render(this.scene, this.camera);
    this.animationFrame = requestAnimationFrame(this.animate);
  };

  afterPhysicsStep() {
    this.dynamicBodies.forEach((body) => {
      const piece = this.bodyToPiece.get(body);
      if (!piece || piece.pocketed) {
        return;
      }

      body.position.y = piece.baseY;
      body.velocity.y = 0;
      body.angularVelocity.x = 0;
      body.angularVelocity.z = 0;

      if (body.position.x > BOARD.playableHalf) {
        body.position.x = BOARD.playableHalf;
      }
      if (body.position.x < -BOARD.playableHalf) {
        body.position.x = -BOARD.playableHalf;
      }
      if (body.position.z > BOARD.playableHalf) {
        body.position.z = BOARD.playableHalf;
      }
      if (body.position.z < -BOARD.playableHalf) {
        body.position.z = -BOARD.playableHalf;
      }

      let speed = Math.sqrt(body.velocity.x ** 2 + body.velocity.z ** 2);
      let angularSpeed = Math.abs(body.angularVelocity.y);

      if (speed > 1e-4) {
        const dragFactor = Math.max(
          0.92,
          1 - (FEEL.surfaceLinearDrag + speed * FEEL.surfaceQuadraticDrag) * this.fixedTimeStep,
        );
        const velocityX = body.velocity.x;
        const velocityZ = body.velocity.z;
        body.velocity.x *= dragFactor;
        body.velocity.z *= dragFactor;

        if (Math.abs(body.angularVelocity.y) > 0.01 && speed > 0.08) {
          const normalX = -velocityZ / speed;
          const normalZ = velocityX / speed;
          const spinCurve = body.angularVelocity.y * FEEL.spinCurveStrength * this.fixedTimeStep * clamp01(speed / 5);
          body.velocity.x += normalX * spinCurve;
          body.velocity.z += normalZ * spinCurve;
        }

        speed = Math.sqrt(body.velocity.x ** 2 + body.velocity.z ** 2);
      }

      if (speed < this.softDecayThreshold) {
        const ratio = clamp01(speed / this.softDecayThreshold);
        const decay = THREE.MathUtils.lerp(0.966, 0.994, ratio);
        body.velocity.x *= decay;
        body.velocity.z *= decay;
      }

      if (angularSpeed < this.softAngularDecayThreshold) {
        const ratio = clamp01(angularSpeed / this.softAngularDecayThreshold);
        body.angularVelocity.y *= THREE.MathUtils.lerp(0.9, 0.985, ratio);
      }

      angularSpeed = Math.abs(body.angularVelocity.y);

      if (speed < this.bodyCutoff && angularSpeed < this.angularCutoff) {
        piece.lowMotionTime += this.fixedTimeStep;
      } else {
        piece.lowMotionTime = 0;
      }

      if (piece.lowMotionTime >= this.lowMotionGrace) {
        body.velocity.set(0, 0, 0);
        body.angularVelocity.set(0, 0, 0);
        body.sleep();
        piece.lowMotionTime = 0;
      }
    });

    this.detectPockets();

    if (this.shotInProgress && this.allDynamicBodiesStopped()) {
      if (this.shotSettledAt === null) {
        this.shotSettledAt = performance.now();
      } else if (performance.now() - this.shotSettledAt >= this.shotSettleDelayMs) {
        this.resolveShot();
      }
    } else {
      this.shotSettledAt = null;
    }
  }

  syncMeshes(delta) {
    this.allPieces.forEach((piece) => {
      if (piece.pocketed && !piece.pendingRespawn) {
        return;
      }

      const speed = Math.sqrt(piece.body.velocity.x ** 2 + piece.body.velocity.z ** 2);
      const followStrength = 1 - Math.exp(-delta * THREE.MathUtils.lerp(22, 34, clamp01(speed / 4)));
      const sourcePosition = piece.body.interpolatedPosition ?? piece.body.position;

      this.tempVector.set(sourcePosition.x, piece.baseY, sourcePosition.z);
      piece.displayPosition.lerp(this.tempVector, followStrength);
      if (speed < 0.03) {
        piece.displayPosition.lerp(this.tempVector, 0.3);
      }
      piece.mesh.position.copy(piece.displayPosition);
      piece.spinAngle += piece.body.angularVelocity.y * delta * 1.7;
      piece.mesh.rotation.y = piece.spinAngle;
      piece.shadow.position.set(piece.displayPosition.x, BOARD.topY + 0.012, piece.displayPosition.z);
    });
  }

  updateShadows() {
    this.allPieces.forEach((piece) => {
      piece.shadow.visible = !piece.pocketed || piece.pendingRespawn;
      if (piece.shadow.visible) {
        const speed = Math.sqrt(piece.body.velocity.x ** 2 + piece.body.velocity.z ** 2);
        const motionBoost = clamp01(speed / 2.6);
        piece.shadow.material.opacity = THREE.MathUtils.lerp(0.13, 0.24, motionBoost);
        const scale = THREE.MathUtils.lerp(1, 1.16, motionBoost);
        piece.shadow.scale.setScalar(scale);
      }
    });
  }

  handleCollision(event) {
    const impact = Math.abs(event.contact?.getImpactVelocityAlongNormal?.() ?? 0);
    if (impact < 0.45) {
      return;
    }

    const now = performance.now();
    if (now - this.lastCollisionAt < 70) {
      return;
    }
    this.lastCollisionAt = now;

    this.addCollisionNoise(event, impact);
    this.playCollisionSound(impact);
    this.triggerCameraShake(Math.min(0.022, impact * 0.0034));
  }

  detectPockets() {
    this.allPieces.forEach((piece) => {
      if (piece.pocketed) {
        return;
      }

      const positionX = piece.body.position.x;
      const positionZ = piece.body.position.z;
      const speed = Math.sqrt(piece.body.velocity.x ** 2 + piece.body.velocity.z ** 2);
      let nearestPocket = null;
      let nearestDistance = Infinity;

      this.pockets.forEach((pocket) => {
        const distance = Math.hypot(positionX - pocket.x, positionZ - pocket.y);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestPocket = pocket;
        }
      });

      if (!nearestPocket) {
        return;
      }

      const captureRadius = POCKET.captureRadius + (piece.type === "striker" ? 0.02 : 0);
      if (nearestDistance <= POCKET.influenceRadius && nearestDistance > 1e-5) {
        const pullRatio = clamp01(
          1 - (nearestDistance - captureRadius) / Math.max(0.001, POCKET.influenceRadius - captureRadius),
        );
        const directionX = (nearestPocket.x - positionX) / nearestDistance;
        const directionZ = (nearestPocket.y - positionZ) / nearestDistance;
        const inwardPull = pullRatio * pullRatio;
        piece.body.velocity.x += directionX * POCKET.pullStrength * inwardPull;
        piece.body.velocity.z += directionZ * POCKET.pullStrength * inwardPull;
        piece.body.angularVelocity.y *= THREE.MathUtils.lerp(1, 0.94, inwardPull);

        if (nearestDistance < BOARD.pocketRadius) {
          piece.body.velocity.x += directionX * POCKET.sinkStrength * inwardPull;
          piece.body.velocity.z += directionZ * POCKET.sinkStrength * inwardPull;
        }
      }

      const approachAlignment = speed > 0.001
        ? ((piece.body.velocity.x * (nearestPocket.x - positionX)) + (piece.body.velocity.z * (nearestPocket.y - positionZ)))
          / (speed * Math.max(nearestDistance, 0.001))
        : 1;
      const captured = nearestDistance <= captureRadius
        || (nearestDistance <= captureRadius + 0.08 && speed < 0.82 && approachAlignment > -0.05);
      if (!captured) {
        return;
      }

      if (piece.type === "striker") {
        this.handleStrikerPocket(piece);
      } else {
        this.handleCoinPocket(piece);
      }
    });
  }

  handleStrikerPocket(piece) {
    const speed = Math.sqrt(piece.body.velocity.x ** 2 + piece.body.velocity.z ** 2);
    piece.pocketed = true;
    this.world.removeBody(piece.body);
    this.animatePocket(piece);
    this.playPocketSound(speed);

    if (this.currentShot) {
      this.currentShot.strikerPocketed = true;
    }
  }

  handleCoinPocket(piece) {
    const speed = Math.sqrt(piece.body.velocity.x ** 2 + piece.body.velocity.z ** 2);
    piece.pocketed = true;
    this.world.removeBody(piece.body);
    this.animatePocket(piece);
    this.playPocketSound(speed);

    console.log(`${piece.type} pocketed`);

    const player = this.players[this.currentPlayerIndex];
    if (piece.type === "queen") {
      if (this.currentShot) {
        this.currentShot.queenPocketed = true;
      }
      this.updateUI();
      return;
    }

    if (piece.type === player.coinType) {
      if (this.currentShot) {
        this.currentShot.correctPieces.push(piece);
      }
    } else if (this.currentShot) {
      this.currentShot.wrongPieces.push(piece);
    }

    this.updateUI();
  }

  animatePocket(piece) {
    piece.pendingRespawn = false;
    gsap.killTweensOf(piece.mesh.scale);
    gsap.to(piece.mesh.scale, {
      x: 0.1,
      y: 0.1,
      z: 0.1,
      duration: 0.24,
      ease: "power2.out",
    });
    gsap.to(piece.mesh.material, {
      opacity: 0,
      duration: 0.24,
      ease: "power2.out",
      onStart: () => {
        piece.mesh.material.transparent = true;
      },
      onComplete: () => {
        piece.mesh.visible = false;
        piece.shadow.visible = false;
      },
    });
  }

  restorePiece(piece, targetPosition) {
    this.detachPieceFromPlayer(piece);
    piece.pocketed = false;
    piece.pendingRespawn = true;
    piece.mesh.visible = true;
    piece.shadow.visible = true;
    piece.lowMotionTime = 0;
    gsap.killTweensOf(piece.mesh.scale);
    piece.mesh.scale.setScalar(0.18);
    piece.shadow.scale.setScalar(1);
    piece.mesh.material.transparent = false;
    piece.mesh.material.opacity = 1;
    piece.body.position.set(targetPosition.x, piece.baseY, targetPosition.z);
    piece.body.velocity.set(0, 0, 0);
    piece.body.angularVelocity.set(0, 0, 0);
    piece.body.previousPosition.copy(piece.body.position);
    piece.body.interpolatedPosition.copy(piece.body.position);
    this.snapPieceToBody(piece);
    if (!this.world.bodies.includes(piece.body)) {
      this.world.addBody(piece.body);
    }

    gsap.to(piece.mesh.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.28,
      ease: "back.out(1.7)",
      onComplete: () => {
        piece.pendingRespawn = false;
      },
    });
  }

  detachPieceFromPlayer(piece) {
    if (piece.scoredBy === null || piece.scoredBy === undefined) {
      return;
    }

    const owner = this.players[piece.scoredBy];
    owner.securedPieces = owner.securedPieces.filter((candidate) => candidate !== piece);
    owner.roundCoins = owner.securedPieces.length;
    piece.scoredBy = null;
  }

  securePocketedPieces(playerIndex, pieces) {
    const player = this.players[playerIndex];
    const dueRespots = [];
    const securedPieces = [];

    [...new Set(pieces)].forEach((piece) => {
      this.detachPieceFromPlayer(piece);
      if (player.due > 0) {
        player.due -= 1;
        dueRespots.push(piece);
        return;
      }

      piece.scoredBy = playerIndex;
      player.securedPieces.push(piece);
      securedPieces.push(piece);
    });

    player.roundCoins = player.securedPieces.length;

    if (dueRespots.length > 0) {
      this.respotPieces(dueRespots);
    }

    return {
      securedCount: securedPieces.length,
      clearedDueCount: dueRespots.length,
    };
  }

  securePiecesIgnoringDue(playerIndex, pieces) {
    const player = this.players[playerIndex];
    const securedPieces = [];

    [...new Set(pieces)].forEach((piece) => {
      this.detachPieceFromPlayer(piece);
      piece.scoredBy = playerIndex;
      player.securedPieces.push(piece);
      securedPieces.push(piece);
    });

    player.roundCoins = player.securedPieces.length;
    return {
      securedCount: securedPieces.length,
    };
  }

  applyDuePenalty(playerIndex, amount) {
    const player = this.players[playerIndex];
    let remainingPenalty = amount;
    let respottedSecured = 0;

    while (remainingPenalty > 0 && player.securedPieces.length > 0) {
      const piece = player.securedPieces[player.securedPieces.length - 1];
      this.restorePiece(piece, this.getOpenCenterSpot(piece));
      remainingPenalty -= 1;
      respottedSecured += 1;
    }

    player.due += remainingPenalty;
    player.roundCoins = player.securedPieces.length;

    return {
      respottedSecured,
      storedDue: remainingPenalty,
      totalPenalty: amount,
    };
  }

  resolveQueenToPlayer(playerIndex) {
    this.queenState.pendingCoverBy = null;
    this.queenState.coveredBy = playerIndex;
    this.queenPiece.scoredBy = playerIndex;
  }

  resolveShot() {
    this.shotInProgress = false;
    this.shotSettledAt = null;
    this.turnPhase = "resolution";
    const shot = this.currentShot;
    if (!shot) {
      return;
    }

    const playerIndex = shot.playerIndex;
    const opponentIndex = (playerIndex + 1) % this.players.length;
    const player = this.players[playerIndex];
    const opponent = this.players[opponentIndex];
    const correctPieces = [...new Set(shot.correctPieces)];
    const wrongPieces = [...new Set(shot.wrongPieces)];
    const queenPendingForPlayer = shot.startedWithQueenPending
      && this.queenState.pendingCoverBy === playerIndex;
    const hadOwnPocketBeforeShot = player.roundCoins > 0;
    let keepTurn = false;
    let status = "";
    let awardResult = {
      securedCount: 0,
      clearedDueCount: 0,
    };
    let opponentAwardResult = {
      securedCount: 0,
    };
    let dueResult = null;

    if (wrongPieces.length > 0) {
      opponentAwardResult = this.securePiecesIgnoringDue(opponentIndex, wrongPieces);
    }

    if (queenPendingForPlayer) {
      if (shot.strikerPocketed && correctPieces.length > 0) {
        this.respotPieces(correctPieces);
        dueResult = this.applyDuePenalty(playerIndex, 1);
        keepTurn = true;
        status = `${player.name} pockets the striker while trying to cover the queen. Their own coin${correctPieces.length > 1 ? "s return" : " returns"}, 1 due is declared, and the turn continues.`;
      } else if (correctPieces.length > 0) {
        awardResult = this.securePocketedPieces(playerIndex, correctPieces);
        this.resolveQueenToPlayer(playerIndex);
        keepTurn = wrongPieces.length === 0;
        status = `${player.name} covers the queen.`;
        if (awardResult.clearedDueCount > 0) {
          status += ` ${awardResult.clearedDueCount} due ${awardResult.clearedDueCount > 1 ? "were" : "was"} cleared on the same shot.`;
        }
        status += keepTurn ? " The turn continues." : ` ${opponent.name}'s pocketed coin ends the turn.`;
      } else {
        if (shot.strikerPocketed) {
          dueResult = this.applyDuePenalty(playerIndex, 1);
        }
        this.respotQueen();
        status = `${player.name} failed to cover the queen. Queen respotted and the turn switches.`;
      }
    } else if (shot.queenPocketed) {
      const queenBlockedByDue = player.due > 0;
      const queenBlockedByNoOwnPocket = !hadOwnPocketBeforeShot && correctPieces.length === 0;
      const sameShotQueenCovered = correctPieces.length > 0 && (hadOwnPocketBeforeShot || correctPieces.length > 1);

      if (shot.strikerPocketed && correctPieces.length > 0) {
        this.respotQueen();
        this.respotPieces(correctPieces);
        dueResult = this.applyDuePenalty(playerIndex, 1);
        keepTurn = true;
        status = `${player.name} pockets the queen, their own coin${correctPieces.length > 1 ? "s" : ""}, and the striker together. The queen and own coins return, 1 due is declared, and the turn continues.`;
      } else if (shot.strikerPocketed) {
        this.respotQueen();
        dueResult = this.applyDuePenalty(playerIndex, 1);
        keepTurn = true;
        status = `${player.name} pockets the queen with the striker. The queen returns, 1 due is declared, and the turn continues.`;
      } else if (queenBlockedByDue) {
        this.respotQueen();
        status = `${player.name} cannot keep the queen while a due is pending. Queen respotted and the turn switches.`;
      } else if (queenBlockedByNoOwnPocket) {
        this.respotQueen();
        status = `${player.name} must pocket one of their own coins before taking the queen. Queen respotted and the turn switches.`;
      } else {
        awardResult = this.securePocketedPieces(playerIndex, correctPieces);
        if (sameShotQueenCovered) {
          this.resolveQueenToPlayer(playerIndex);
          keepTurn = wrongPieces.length === 0;
          status = `${player.name} pockets and covers the queen.`;
          status += keepTurn ? " The turn continues." : ` ${opponent.name}'s pocketed coin ends the turn.`;
        } else {
          this.queenState.pendingCoverBy = playerIndex;
          this.queenState.coveredBy = null;
          keepTurn = true;
          status = `${player.name} pockets the queen. Cover it on the next scoring shot.`;
        }

        if (awardResult.clearedDueCount > 0) {
          status += ` ${awardResult.clearedDueCount} due ${awardResult.clearedDueCount > 1 ? "were" : "was"} cleared.`;
        }
      }
    } else if (shot.strikerPocketed && correctPieces.length > 0) {
      this.respotPieces(correctPieces);
      dueResult = this.applyDuePenalty(playerIndex, 1);
      keepTurn = true;
      status = `${player.name} pockets the striker with their own coin${correctPieces.length > 1 ? "s" : ""}. Those coins return, 1 due is declared, and the turn continues.`;
    } else if (shot.strikerPocketed) {
      dueResult = this.applyDuePenalty(playerIndex, 1);
      status = wrongPieces.length > 0
        ? `${player.name} pockets the striker and ${opponent.name}'s coin. The turn switches and 1 due is declared.`
        : `${player.name} pockets the striker. The turn switches and 1 due is declared.`;
    } else if (correctPieces.length > 0) {
      awardResult = this.securePocketedPieces(playerIndex, correctPieces);
      keepTurn = wrongPieces.length === 0;
      if (wrongPieces.length > 0) {
        status = `${player.name} pockets both colours. Their own coin${awardResult.securedCount > 1 ? "s stay" : " stays"} pocketed, ${opponent.name}'s coin${opponentAwardResult.securedCount > 1 ? "s stay" : " stays"} pocketed for ${opponent.name}, and the turn switches.`;
      } else if (awardResult.securedCount > 0 && awardResult.clearedDueCount > 0) {
        status = `${player.name} pockets ${awardResult.securedCount} own coin${awardResult.securedCount > 1 ? "s" : ""} and clears ${awardResult.clearedDueCount} due. The turn continues.`;
      } else if (awardResult.securedCount > 0) {
        status = `${player.name} pockets ${awardResult.securedCount} own coin${awardResult.securedCount > 1 ? "s" : ""} and continues the turn.`;
      } else if (awardResult.clearedDueCount > 0) {
        keepTurn = true;
        status = `${player.name} clears ${awardResult.clearedDueCount} due and continues the turn.`;
      } else {
        status = `${player.name} continues the turn.`;
      }
    } else if (wrongPieces.length > 0) {
      status = `${player.name} pockets ${opponent.name}'s coin. It stays pocketed for ${opponent.name}, and the turn switches.`;
    } else {
      status = `${player.name} misses. Turn switches.`;
    }

    if (dueResult) {
      if (dueResult.respottedSecured > 0) {
        status += ` ${dueResult.respottedSecured} previously pocketed coin${dueResult.respottedSecured > 1 ? "s are" : " is"} returned as due.`;
      }
      if (dueResult.storedDue > 0) {
        status += ` ${dueResult.storedDue} due ${dueResult.storedDue > 1 ? "remain" : "remains"} pending.`;
      }
    }

    if (shot.strikerPocketed) {
      this.restorePiece(
        this.striker,
        this.getStrikerStartPosition(playerIndex),
      );
    }

    this.currentShot = null;

    const roundWinnerIndex = this.getBoardWinnerIndex();
    if (roundWinnerIndex !== null) {
      this.finishRound(roundWinnerIndex);
      return;
    }

    if (!keepTurn) {
      this.currentPlayerIndex = opponentIndex;
    }

    this.prepareTurn(status);
  }

  getStrikerStartPosition(playerIndex) {
    const player = this.players[playerIndex];
    return {
      x: this.findNearestLegalStrikerX(player.strikerX ?? 0, playerIndex),
      z: this.getPlacementZForPlayer(playerIndex),
    };
  }

  respotQueen() {
    this.restorePiece(this.queenPiece, this.getOpenCenterSpot(this.queenPiece));
    this.queenState.pendingCoverBy = null;
    this.queenState.coveredBy = null;
    this.queenPiece.scoredBy = null;
  }

  respotPieces(pieces) {
    const uniquePieces = [...new Set(pieces)];
    uniquePieces.forEach((piece) => {
      this.restorePiece(piece, this.getOpenCenterSpot(piece));
    });
  }

  clearTurnTransition() {
    if (this.turnTransitionTimer !== null) {
      window.clearTimeout(this.turnTransitionTimer);
      this.turnTransitionTimer = null;
    }
  }

  clearRoundTransition() {
    if (this.roundTransitionTimer !== null) {
      window.clearTimeout(this.roundTransitionTimer);
      this.roundTransitionTimer = null;
    }
  }

  prepareTurn(message, options = {}) {
    const { instant = false } = options;

    this.hideAimHelpers(instant);
    this.turnReady = false;
    this.turnPhase = "placement";
    this.isAiming = false;
    this.isPlacingStriker = false;
    this.clearAITimer();
    this.clearTurnTransition();
    this.stopStrikerPulse();
    this.setStatus(message);
    this.updateUI();

    const startTurn = () => {
      this.turnTransitionTimer = null;
      if (this.gameOver) {
        return;
      }

      const start = this.getStrikerStartPosition(this.currentPlayerIndex);
      this.restorePiece(this.striker, start);
      this.players[this.currentPlayerIndex].strikerX = start.x;
      this.turnReady = !this.isBoardInMotion();
      this.turnPhase = this.turnReady ? "placement" : "waiting";
      this.updateUI();

      if (!this.turnReady) {
        this.turnTransitionTimer = window.setTimeout(startTurn, 120);
        return;
      }

      if (this.isCurrentPlayerAI()) {
        this.scheduleAITurn();
      } else {
        this.startStrikerPulse();
        this.playUITickSound("soft");
        this.turnPhase = "placement";
        this.updateUI();
      }
    };

    if (instant) {
      startTurn();
      return;
    }

    this.turnTransitionTimer = window.setTimeout(startTurn, this.turnSwitchDelayMs);
  }

  resetBoardState({
    resetMatch = false,
    breakerIndex = 0,
    message = "Fresh board.",
    instant = true,
  } = {}) {
    this.clearAITimer();
    this.clearTurnTransition();
    this.clearRoundTransition();
    this.hideAimHelpers(true);
    this.isAiming = false;
    this.isPlacingStriker = false;
    this.shotInProgress = false;
    this.currentShot = null;
    this.shotSettledAt = null;
    this.controls.enabled = true;
    this.turnReady = false;
    this.gameOver = false;
    this.matchWinnerIndex = null;
    this.currentPlayerIndex = breakerIndex;
    this.nextBreakIndex = breakerIndex;
    if (resetMatch) {
      this.roundNumber = 1;
    }

    this.players.forEach((player) => {
      if (resetMatch) {
        player.score = 0;
        player.roundsWon = 0;
      }
      player.due = 0;
      player.roundCoins = 0;
      player.securedPieces = [];
      player.strikerX = 0;
    });

    this.queenState.pendingCoverBy = null;
    this.queenState.coveredBy = null;
    this.centerSpotIndex = 0;

    this.allPieces.forEach((piece) => {
      piece.scoredBy = null;
      piece.pocketed = false;
      piece.pendingRespawn = false;
      piece.mesh.visible = true;
      piece.shadow.visible = true;
      piece.shadow.scale.setScalar(1);
      piece.mesh.scale.setScalar(1);
      piece.mesh.material.transparent = false;
      piece.mesh.material.opacity = 1;
      piece.lowMotionTime = 0;
      if (!this.world.bodies.includes(piece.body)) {
        this.world.addBody(piece.body);
      }
    });

    this.coins.forEach((piece) => {
      piece.body.position.set(piece.initialPosition.x, piece.baseY, piece.initialPosition.z);
      piece.body.velocity.set(0, 0, 0);
      piece.body.angularVelocity.set(0, 0, 0);
      piece.body.previousPosition.copy(piece.body.position);
      piece.body.interpolatedPosition.copy(piece.body.position);
      this.snapPieceToBody(piece);
      piece.spinAngle = piece.mesh.rotation.y;
    });

    const strikerStart = this.getStrikerStartPosition(breakerIndex);
    this.striker.body.position.set(strikerStart.x, STRIKER.y, strikerStart.z);
    this.striker.body.velocity.set(0, 0, 0);
    this.striker.body.angularVelocity.set(0, 0, 0);
    this.striker.body.previousPosition.copy(this.striker.body.position);
    this.striker.body.interpolatedPosition.copy(this.striker.body.position);
    this.snapPieceToBody(this.striker);
    this.players[breakerIndex].strikerX = strikerStart.x;
    this.prepareTurn(message, { instant });
  }

  restartMatch() {
    this.resetBoardState({
      resetMatch: true,
      breakerIndex: 0,
      message: "Fresh match. Player 1 breaks.",
      instant: true,
    });
  }

  getPlayerRemainingCoins(playerIndex) {
    const type = this.players[playerIndex].coinType;
    return this.coins.filter((piece) => piece.type === type && !piece.pocketed).length;
  }

  getBoardWinnerIndex() {
    const winnerIndex = this.players.findIndex((player, index) => (
      this.getPlayerRemainingCoins(index) === 0
      && this.queenState.coveredBy === index
    ));
    return winnerIndex >= 0 ? winnerIndex : null;
  }

  finishRound(winnerIndex) {
    const winner = this.players[winnerIndex];
    const loserIndex = (winnerIndex + 1) % this.players.length;
    const loser = this.players[loserIndex];
    const loserCoinsLeft = this.getPlayerRemainingCoins(loserIndex);
    const queenBonus = this.queenState.coveredBy === winnerIndex ? MATCH.queenBonus : 0;
    const pointsAwarded = loserCoinsLeft + queenBonus;

    this.clearAITimer();
    this.clearTurnTransition();
    this.turnReady = false;
    this.shotInProgress = false;
    this.turnPhase = "round-end";
    this.stopStrikerPulse();

    winner.score += pointsAwarded;
    winner.roundsWon += 1;
    this.nextBreakIndex = winnerIndex;

    const summary = `${winner.name} wins Round ${this.roundNumber} for ${pointsAwarded} point${pointsAwarded === 1 ? "" : "s"} (${loserCoinsLeft} remaining${queenBonus > 0 ? ` + ${queenBonus} queen` : ""}).`;

    if (winner.score >= this.matchPointTarget) {
      this.gameOver = true;
      this.matchWinnerIndex = winnerIndex;
      this.setStatus(`${summary} ${winner.name} wins the match ${winner.score}-${loser.score}.`);
      this.updateUI();
      return;
    }

    const nextRoundNumber = this.roundNumber + 1;
    this.setStatus(`${summary} Round ${nextRoundNumber} starts in a moment.`);
    this.updateUI();
    this.clearRoundTransition();
    this.roundTransitionTimer = window.setTimeout(() => {
      this.roundNumber = nextRoundNumber;
      this.resetBoardState({
        resetMatch: false,
        breakerIndex: this.nextBreakIndex,
        message: `Round ${this.roundNumber}. ${winner.name} breaks.`,
        instant: true,
      });
    }, MATCH.nextRoundDelayMs);
  }

  getOpenCenterSpot(excludedPiece = null) {
    const offsets = [
      { x: 0, z: 0 },
      { x: COIN.radius * 2.3, z: 0 },
      { x: -COIN.radius * 2.3, z: 0 },
      { x: COIN.radius * 1.15, z: COIN.radius * 2 },
      { x: -COIN.radius * 1.15, z: COIN.radius * 2 },
      { x: COIN.radius * 1.15, z: -COIN.radius * 2 },
      { x: -COIN.radius * 1.15, z: -COIN.radius * 2 },
      { x: COIN.radius * 4.6, z: 0 },
      { x: -COIN.radius * 4.6, z: 0 },
      { x: 0, z: COIN.radius * 4.6 },
      { x: 0, z: -COIN.radius * 4.6 },
      { x: COIN.radius * 3.4, z: COIN.radius * 3.4 },
      { x: -COIN.radius * 3.4, z: COIN.radius * 3.4 },
      { x: COIN.radius * 3.4, z: -COIN.radius * 3.4 },
      { x: -COIN.radius * 3.4, z: -COIN.radius * 3.4 },
    ];
    let fallbackOffset = offsets[this.centerSpotIndex % offsets.length];
    let bestClearance = -Infinity;

    for (const offset of offsets) {
      let minClearance = Infinity;
      let blocked = false;

      for (const piece of this.allPieces) {
        if (piece.pocketed || piece === excludedPiece) {
          continue;
        }

        const requiredGap = COIN.radius + piece.radius + 0.08;
        const distance = Math.hypot(piece.body.position.x - offset.x, piece.body.position.z - offset.z);
        const clearance = distance - requiredGap;
        minClearance = Math.min(minClearance, clearance);

        if (clearance < 0) {
          blocked = true;
        }
      }

      if (!blocked) {
        return offset;
      }

      if (minClearance > bestClearance) {
        bestClearance = minClearance;
        fallbackOffset = offset;
      }
    }

    return fallbackOffset;
  }

  getColoredCoinsRemainingCount() {
    return this.coins.filter(
      (piece) => piece.type !== "queen" && !piece.pocketed,
    ).length;
  }

  checkForGameOver() {
    const winnerIndex = this.getBoardWinnerIndex();
    if (winnerIndex === null) {
      return false;
    }

    this.finishRound(winnerIndex);
    return true;
  }

  allDynamicBodiesStopped() {
    return this.allPieces.every((piece) => {
      if (piece.pocketed) {
        return true;
      }

      const speed = Math.sqrt(piece.body.velocity.x ** 2 + piece.body.velocity.z ** 2);
      const angularSpeed = Math.abs(piece.body.angularVelocity.y);
      return piece.body.sleepState === CANNON.Body.SLEEPING
        || (speed < this.bodyCutoff * 1.5 && angularSpeed < this.angularCutoff * 1.5);
    });
  }

  isBoardInMotion() {
    return this.allPieces.some((piece) => {
      if (piece.pocketed || piece.pendingRespawn) {
        return false;
      }

      const speed = Math.sqrt(piece.body.velocity.x ** 2 + piece.body.velocity.z ** 2);
      const angularSpeed = Math.abs(piece.body.angularVelocity.y);
      return speed > this.bodyCutoff * 1.6 || angularSpeed > this.angularCutoff * 1.6;
    });
  }

  isCurrentPlayerAI() {
    return this.players[this.currentPlayerIndex].isAI;
  }

  distancePointToSegment(point, start, end) {
    const segment = end.clone().sub(start);
    const lengthSq = Math.max(segment.lengthSq(), 1e-6);
    const t = clamp01(point.clone().sub(start).dot(segment) / lengthSq);
    const projection = start.clone().add(segment.multiplyScalar(t));
    return point.distanceTo(projection);
  }

  isLaneClear(start, end, ignoredPieces = []) {
    const ignored = new Set(ignoredPieces);
    return this.allPieces.every((piece) => {
      if (piece.pocketed || piece.pendingRespawn || ignored.has(piece) || piece === this.striker) {
        return true;
      }

      const point = new THREE.Vector3(piece.body.position.x, 0, piece.body.position.z);
      const clearance = this.distancePointToSegment(point, start, end);
      return clearance > piece.radius + COIN.radius + 0.08;
    });
  }

  getAITargets(playerIndex) {
    const player = this.players[playerIndex];
    const ownCoins = this.coins.filter((piece) => !piece.pocketed && piece.type === player.coinType);

    if (this.queenState.pendingCoverBy === playerIndex) {
      return ownCoins;
    }

    if (ownCoins.length === 0 && !this.queenPiece.pocketed) {
      return [this.queenPiece];
    }

    if (!this.queenPiece.pocketed && ownCoins.length <= 3) {
      return [this.queenPiece, ...ownCoins];
    }

    return ownCoins.length > 0
      ? ownCoins
      : this.coins.filter((piece) => !piece.pocketed && piece.type !== "queen");
  }

  findBestAIPlan(playerIndex) {
    const player = this.players[playerIndex];
    const baselineZ = this.getPlacementZForPlayer(playerIndex);
    const targets = this.getAITargets(playerIndex);
    let bestPlan = null;

    targets.forEach((target) => {
      this.pockets.forEach((pocket) => {
        const coinPosition = new THREE.Vector3(target.body.position.x, 0, target.body.position.z);
        const pocketPosition = new THREE.Vector3(pocket.x, 0, pocket.y);
        const towardPocket = pocketPosition.clone().sub(coinPosition);
        if (towardPocket.lengthSq() < 1e-5) {
          return;
        }

        towardPocket.normalize();
        const ghostPoint = coinPosition.clone().add(
          towardPocket.clone().multiplyScalar(-(target.radius + STRIKER.radius + 0.14)),
        );

        if (Math.abs(ghostPoint.x) > BOARD.playableHalf - 0.28 || Math.abs(ghostPoint.z) > BOARD.playableHalf - 0.28) {
          return;
        }

        const strikerX = this.findNearestLegalStrikerX(ghostPoint.x, playerIndex);
        const strikerPosition = new THREE.Vector3(strikerX, 0, baselineZ);
        const shotVector = ghostPoint.clone().sub(strikerPosition);
        if (shotVector.lengthSq() < 1e-5) {
          return;
        }

        const direction = shotVector.clone().normalize();
        if (!this.isLegalShotDirection(direction, playerIndex)) {
          return;
        }

        const strikerLaneClear = this.isLaneClear(strikerPosition, ghostPoint, [target]);
        const pocketLaneClear = this.isLaneClear(coinPosition, pocketPosition, [target]);
        const obstructionPenalty = (strikerLaneClear ? 0 : 2.3) + (pocketLaneClear ? 0 : 2.8);
        const shotDistance = shotVector.length();
        const pocketDistance = coinPosition.distanceTo(pocketPosition);
        const placementAdjustment = Math.abs(strikerX - player.strikerX) * 0.12;
        const queenPriority = target === this.queenPiece ? -0.6 : 0;
        const score = shotDistance + pocketDistance * 0.76 + obstructionPenalty + placementAdjustment + queenPriority;

        if (!bestPlan || score < bestPlan.score) {
          bestPlan = {
            target,
            strikerX,
            direction,
            power: clamp01((shotDistance + pocketDistance * 0.45) / 8.2),
            score,
          };
        }
      });
    });

    if (bestPlan) {
      return bestPlan;
    }

    const fallbackTarget = targets[0];
    if (!fallbackTarget) {
      return null;
    }

    const strikerX = this.findNearestLegalStrikerX(fallbackTarget.body.position.x, playerIndex);
    const fallbackDirection = new THREE.Vector3(
      fallbackTarget.body.position.x - strikerX,
      0,
      fallbackTarget.body.position.z - baselineZ,
    );
    if (fallbackDirection.lengthSq() < 1e-5) {
      fallbackDirection.set(randFloat(-0.18, 0.18), 0, this.getForwardSignForPlayer(playerIndex));
    }
    fallbackDirection.normalize();
    if (!this.isLegalShotDirection(fallbackDirection, playerIndex)) {
      fallbackDirection.z = this.getForwardSignForPlayer(playerIndex);
      fallbackDirection.normalize();
    }

    return {
      target: fallbackTarget,
      strikerX,
      direction: fallbackDirection,
      power: 0.58,
      score: 999,
    };
  }

  scheduleAITurn() {
    if (!this.turnReady || this.isBoardInMotion()) {
      return;
    }

    this.clearAITimer();
    this.stopStrikerPulse();
    this.turnPhase = "placement";
    this.setStatus("AI is lining up a shot...");
    this.updateUI();
    this.aiTimer = window.setTimeout(() => {
      this.executeAITurn();
    }, 900);
  }

  clearAITimer() {
    if (this.aiTimer !== null) {
      window.clearTimeout(this.aiTimer);
      this.aiTimer = null;
    }
  }

  executeAITurn() {
    if (!this.turnReady || this.gameOver || !this.isCurrentPlayerAI() || this.isBoardInMotion()) {
      return;
    }

    const difficulty = AI_DIFFICULTY[this.aiDifficulty];
    const plan = this.findBestAIPlan(this.currentPlayerIndex);
    if (!plan) {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
      this.prepareTurn("AI had no legal shot and passes the board.");
      return;
    }

    this.moveStrikerToX(plan.strikerX, this.currentPlayerIndex);
    this.turnPhase = "aiming";
    this.setStatus("AI sets the striker and releases...");
    this.updateUI();

    const direction = plan.direction
      .clone()
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), randFloat(-difficulty.angleJitter, difficulty.angleJitter))
      .normalize();
    if (!this.isLegalShotDirection(direction, this.currentPlayerIndex)) {
      direction.z = this.getForwardSignForPlayer(this.currentPlayerIndex);
      direction.normalize();
    }

    const power = clamp01(
      plan.power * (1 + randFloat(-difficulty.powerJitter, difficulty.powerJitter)),
    );

    this.clearAITimer();
    this.aiTimer = window.setTimeout(() => {
      if (!this.turnReady || this.gameOver || this.isBoardInMotion()) {
        return;
      }

      this.performShot(direction, THREE.MathUtils.clamp(power, 0.32, 0.94), true);
    }, 280);
  }

  triggerCameraShake(amount) {
    this.shakeState.amplitude = Math.max(this.shakeState.amplitude, amount);
    this.shakeState.timeLeft = Math.max(this.shakeState.timeLeft, 0.18);
  }

  applyCameraShake(delta) {
    if (this.shakeState.timeLeft <= 0) {
      return;
    }

    this.shakeState.timeLeft = Math.max(0, this.shakeState.timeLeft - delta);
    const falloff = this.shakeState.timeLeft / 0.18;
    const amplitude = this.shakeState.amplitude * falloff;
    this.lastShakeOffset.set(
      randFloat(-amplitude, amplitude),
      randFloat(-amplitude * 0.65, amplitude * 0.65),
      randFloat(-amplitude, amplitude),
    );
    this.camera.position.add(this.lastShakeOffset);

    if (this.shakeState.timeLeft === 0) {
      this.shakeState.amplitude = 0;
    }
  }

  resetCamera() {
    gsap.to(this.camera.position, {
      x: this.defaultCameraPosition.x,
      y: this.defaultCameraPosition.y,
      z: this.defaultCameraPosition.z,
      duration: 0.6,
      ease: "power2.out",
    });
    gsap.to(this.controls.target, {
      x: this.defaultControlsTarget.x,
      y: this.defaultControlsTarget.y,
      z: this.defaultControlsTarget.z,
      duration: 0.6,
      ease: "power2.out",
    });
  }

  startStrikerPulse() {
    if (!this.isCurrentPlayerAI() && !this.gameOver) {
      this.strikerPulse.restart(true);
    }
  }

  stopStrikerPulse() {
    this.strikerPulse.pause();
    this.striker.mesh.material.emissiveIntensity = 0.2;
    gsap.to(this.striker.mesh.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.14,
      overwrite: true,
      ease: "power2.out",
    });
  }

  setPower(value) {
    this.ui.powerFill.style.width = `${Math.round(clamp01(value) * 100)}%`;
  }

  setStatus(message) {
    this.ui.statusText.textContent = message;
    gsap.fromTo(
      this.ui.statusText,
      { opacity: 0.45, y: 4 },
      { opacity: 1, y: 0, duration: 0.22, ease: "power2.out", clearProps: "transform" },
    );
  }

  updateUI() {
    const current = this.players[this.currentPlayerIndex];
    const phaseLabels = {
      placement: "Placement",
      aiming: "Aiming",
      motion: "Motion",
      resolution: "Scoring",
      waiting: "Waiting",
      "round-end": "Round End",
    };

    this.ui.currentPlayer.textContent = current.name;
    this.ui.turnChip.textContent = current.label;
    this.ui.turnChip.style.background = current.chipColor;
    this.ui.turnChip.style.color = current.coinType === "white" ? "#08111b" : "#f6f8fc";
    this.ui.phaseChip.textContent = phaseLabels[this.turnPhase] ?? "Placement";
    this.ui.roundChip.textContent = `Round ${this.roundNumber}`;
    this.ui.scorePlayer1.textContent = String(this.players[0].score);
    this.ui.scorePlayer2.textContent = String(this.players[1].score);
    this.ui.roundsPlayer1.textContent = String(this.players[0].roundsWon);
    this.ui.roundsPlayer2.textContent = String(this.players[1].roundsWon);
    this.ui.boardScorePlayer1.textContent = `${this.players[0].roundCoins} / 9`;
    this.ui.boardScorePlayer2.textContent = `${this.players[1].roundCoins} / 9`;
    this.ui.duePlayer1.textContent = String(this.players[0].due);
    this.ui.duePlayer2.textContent = String(this.players[1].due);
    this.ui.modeSelect.value = this.mode;
    this.ui.difficultySelect.value = this.aiDifficulty;
    this.ui.difficultySelect.disabled = !this.players[1].isAI;
    this.ui.soundButton.textContent = this.soundEnabled ? "Sound On" : "Sound Off";
    this.ui.rulesButton.textContent = this.rulesVisible ? "Hide Rules" : "Show Rules";
    this.ui.rulesPanel.classList.toggle("hidden", !this.rulesVisible);

    if (this.queenState.pendingCoverBy !== null) {
      this.ui.queenStatus.textContent = `${this.players[this.queenState.pendingCoverBy].name} must cover the queen.`;
    } else if (this.queenState.coveredBy !== null) {
      this.ui.queenStatus.textContent = `Queen secured by ${this.players[this.queenState.coveredBy].name}.`;
    } else {
      this.ui.queenStatus.textContent = this.queenPiece.pocketed ? "Queen pocketed." : "Queen available.";
    }

    if (this.gameOver && this.matchWinnerIndex !== null) {
      this.ui.roundStatus.textContent = `${this.players[this.matchWinnerIndex].name} wins the match. Target was ${this.matchPointTarget}.`;
    } else {
      this.ui.roundStatus.textContent = `Race to ${this.matchPointTarget} points. Match score ${this.players[0].score}-${this.players[1].score}.`;
    }

    if (this.gameOver) {
      this.ui.hintText.textContent = "Match complete. Restart Match to play another race.";
      return;
    }

    if (this.queenState.pendingCoverBy === this.currentPlayerIndex) {
      this.ui.hintText.textContent = "Queen is pending. Pocket one of your own coins on this turn to cover it.";
    } else if (this.isCurrentPlayerAI()) {
      this.ui.hintText.textContent = "AI handles striker placement and shot selection on its turn.";
    } else if (this.turnPhase === "placement") {
      this.ui.hintText.textContent = "Drag along your baseline to place the striker, then drag from the striker to shoot forward.";
    } else if (this.turnPhase === "aiming") {
      this.ui.hintText.textContent = "Release to shoot. Legal shots must travel into the opposite half.";
    } else if (this.turnPhase === "motion") {
      this.ui.hintText.textContent = "Input is locked until every moving piece settles.";
    } else if (this.turnPhase === "round-end") {
      this.ui.hintText.textContent = "Board scored. Preparing the next round.";
    } else {
      this.ui.hintText.textContent = "Use the camera reset if the board angle drifts too far while playing.";
    }
  }

  ensureAudio() {
    if (!this.soundEnabled) {
      return null;
    }

    if (!this.audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        return null;
      }
      this.audioContext = new AudioContextClass();
    }

    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    return this.audioContext;
  }

  addCollisionNoise(event, impact) {
    const selfBody = event.target;
    if (!selfBody || impact < 0.8) {
      return;
    }

    const contactNormal = event.contact?.ni;
    if (!contactNormal) {
      return;
    }

    const jitterStrength = Math.min(0.018, impact * 0.0024);
    const tangent = new CANNON.Vec3(-contactNormal.z, 0, contactNormal.x);
    if (tangent.lengthSquared() < 1e-6) {
      tangent.set(1, 0, 0);
    }
    tangent.normalize();
    const jitter = randFloat(-jitterStrength, jitterStrength);
    selfBody.velocity.x += tangent.x * jitter;
    selfBody.velocity.z += tangent.z * jitter;
    selfBody.angularVelocity.y += randFloat(-0.1, 0.1) * impact * 0.2;

    if (event.body?.mass > 0) {
      event.body.velocity.x -= tangent.x * jitter * 0.6;
      event.body.velocity.z -= tangent.z * jitter * 0.6;
      event.body.angularVelocity.y += randFloat(-0.08, 0.08) * impact * 0.16;
    } else {
      selfBody.angularVelocity.y += randFloat(-1, 1) * FEEL.wallSpinTransfer * impact;
    }
  }

  playCollisionSound(intensity) {
    const ctx = this.ensureAudio();
    if (!ctx) {
      return;
    }

    const impact = clamp01(intensity / 6.5);
    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const gain = ctx.createGain();
    const overtoneGain = ctx.createGain();
    const baseFrequency = THREE.MathUtils.lerp(250, 520, impact) * randFloat(0.96, 1.05);
    oscillator.type = impact > 0.6 ? "triangle" : "sine";
    overtone.type = "sine";
    oscillator.detune.value = randFloat(-120, 140);
    overtone.detune.value = randFloat(-80, 100);
    oscillator.frequency.setValueAtTime(baseFrequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(170 + impact * 40, now + 0.085);
    overtone.frequency.setValueAtTime(baseFrequency * randFloat(1.6, 1.95), now);
    overtone.frequency.exponentialRampToValueAtTime(baseFrequency * 0.88, now + 0.07);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(THREE.MathUtils.lerp(0.016, 0.06, impact), now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
    overtoneGain.gain.setValueAtTime(0.0001, now);
    overtoneGain.gain.exponentialRampToValueAtTime(THREE.MathUtils.lerp(0.006, 0.018, impact), now + 0.006);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    oscillator.connect(gain);
    overtone.connect(overtoneGain);
    gain.connect(ctx.destination);
    overtoneGain.connect(ctx.destination);
    oscillator.start(now);
    overtone.start(now);
    oscillator.stop(now + 0.11);
    overtone.stop(now + 0.09);
  }

  playPocketSound(intensity = 0.6) {
    const ctx = this.ensureAudio();
    if (!ctx) {
      return;
    }

    const impact = clamp01(intensity / 3.2);
    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const gain = ctx.createGain();
    const overtoneGain = ctx.createGain();
    const baseFrequency = THREE.MathUtils.lerp(430, 590, impact) * randFloat(0.96, 1.06);
    oscillator.type = "sine";
    overtone.type = "triangle";
    oscillator.detune.value = randFloat(-90, 120);
    overtone.detune.value = randFloat(-120, 120);
    oscillator.frequency.setValueAtTime(baseFrequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(220, now + 0.16);
    overtone.frequency.setValueAtTime(baseFrequency * 1.48, now);
    overtone.frequency.exponentialRampToValueAtTime(260, now + 0.12);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(THREE.MathUtils.lerp(0.045, 0.082, impact), now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    overtoneGain.gain.setValueAtTime(0.0001, now);
    overtoneGain.gain.exponentialRampToValueAtTime(THREE.MathUtils.lerp(0.012, 0.026, impact), now + 0.01);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    oscillator.connect(gain);
    overtone.connect(overtoneGain);
    gain.connect(ctx.destination);
    overtoneGain.connect(ctx.destination);
    oscillator.start(now);
    overtone.start(now);
    oscillator.stop(now + 0.2);
    overtone.stop(now + 0.14);
  }

  playUITickSound(variant = "soft") {
    const ctx = this.ensureAudio();
    if (!ctx) {
      return;
    }

    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
      variant === "confirm" ? randFloat(620, 700) : randFloat(760, 860),
      now,
    );
    oscillator.frequency.exponentialRampToValueAtTime(
      variant === "confirm" ? 380 : 520,
      now + 0.045,
    );
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(
      variant === "confirm" ? 0.03 : 0.018,
      now + 0.006,
    );
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.06);
  }
}
