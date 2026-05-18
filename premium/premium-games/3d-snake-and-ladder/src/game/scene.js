import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import {
  BOARD_SIZE,
  LADDERS,
  SNAKES,
  TILE_GAP,
  TILE_SIZE,
  getBoardWorldSize,
  getPlayerTileOffset,
  tileToWorld
} from "./board.js";
import { easeInOutCubic, easeOutBack, easeOutCubic, tween } from "./animation.js";
import { EVENT_TILE_DEFINITIONS } from "./powerups.js";
import { QUALITY_PROFILES } from "./quality.js";

const TILE_TOP_Y = 0.31;
const TOKEN_Y = 0.33;
const CONNECTION_Y = 0.48;
const DESKTOP_OVERVIEW_CAMERA = new THREE.Vector3(10.4, 11.4, 13.2);
const MOBILE_OVERVIEW_CAMERA = new THREE.Vector3(8.8, 12.4, 15.6);
const OVERVIEW_TARGET = new THREE.Vector3(0.22, 0.12, 0.05);

export class RoyaleScene {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = options;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#f7efe1");
    this.scene.fog = new THREE.Fog("#f7efe1", 16, 38);

    this.camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.copy(window.innerWidth < 760 ? MOBILE_OVERVIEW_CAMERA : DESKTOP_OVERVIEW_CAMERA);
    this.qualityProfile = options.qualityProfile || QUALITY_PROFILES.high;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.qualityProfile.pixelRatioCap));
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = this.qualityProfile.shadowEnabled;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.clock = new THREE.Clock();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.minDistance = 8;
    this.controls.maxDistance = 28;
    this.controls.maxPolarAngle = Math.PI * 0.47;
    this.controls.target.copy(OVERVIEW_TARGET);

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.tileHitMeshes = [];
    this.diceHitMeshes = [];
    this.tileMeshes = new Map();
    this.tileLabels = new Map();
    this.tokens = new Map();
    this.connections = new Map();
    this.connectionObjects = [];
    this.eventMarkerObjects = [];
    this.particles = [];
    this.tileHighlights = new Map();
    this.sparkleGeometry = new THREE.SphereGeometry(0.035, 8, 8);
    this.activePlayerIndex = 0;
    this.activePulseId = null;
    this.players = [];
    this.ruleOptions = {};
    this.finishTile = 100;
    this.reduceMotion = false;
    this.quickMode = false;
    this.highContrastNumbers = false;
    this.largeText = false;
    this.isDestroyed = false;

    this.world = new THREE.Group();
    this.boardGroup = new THREE.Group();
    this.actorGroup = new THREE.Group();
    this.fxGroup = new THREE.Group();
    this.world.add(this.boardGroup, this.actorGroup, this.fxGroup);
    this.scene.add(this.world);

    this.materials = this.createMaterials();
    this.buildEnvironment();
    this.buildBoard();
    this.buildConnections();
    this.buildDice();
    this.buildHoverGlow();

    this.onResize = () => this.resize();
    this.onPointerMove = (event) => this.handlePointerMove(event);
    this.onPointerDown = (event) => this.handlePointerDown(event);
    this.onPointerUp = (event) => this.handlePointerUp(event);
    this.onPointerLeave = () => {
      this.hoverGlow.visible = false;
      this.canvas.style.cursor = "";
      this.pendingDiceClick = null;
    };
    this.onContextLost = (event) => {
      event.preventDefault();
      this.options.onWebGLContextLost?.();
    };
    this.onContextRestored = () => {
      this.resize();
      this.options.onWebGLContextRestored?.();
    };
    window.addEventListener("resize", this.onResize);
    this.canvas.addEventListener("pointermove", this.onPointerMove);
    this.canvas.addEventListener("pointerdown", this.onPointerDown);
    this.canvas.addEventListener("pointerup", this.onPointerUp);
    this.canvas.addEventListener("pointerleave", this.onPointerLeave);
    this.canvas.addEventListener("webglcontextlost", this.onContextLost);
    this.canvas.addEventListener("webglcontextrestored", this.onContextRestored);

    this.resize();
    this.render = this.render.bind(this);
    this.render();
  }

  createMaterials() {
    const marbleTexture = createMarbleTexture("#b58a4a");
    const tileTexture = createMarbleTexture("#f4ead8");
    marbleTexture.colorSpace = THREE.SRGBColorSpace;
    tileTexture.colorSpace = THREE.SRGBColorSpace;

    return {
      table: new THREE.MeshStandardMaterial({ color: "#d5bc8d", roughness: 0.78, metalness: 0.05 }),
      boardBase: new THREE.MeshPhysicalMaterial({
        color: "#f7f0e2",
        roughness: 0.48,
        metalness: 0.05,
        clearcoat: 0.35,
        clearcoatRoughness: 0.35,
        map: marbleTexture
      }),
      tileA: new THREE.MeshPhysicalMaterial({
        color: "#f4ead8",
        roughness: 0.42,
        metalness: 0.03,
        clearcoat: 0.25,
        clearcoatRoughness: 0.38,
        map: tileTexture
      }),
      tileB: new THREE.MeshPhysicalMaterial({
        color: "#c7a46b",
        roughness: 0.5,
        metalness: 0.03,
        clearcoat: 0.25,
        clearcoatRoughness: 0.42
      }),
      gold: new THREE.MeshStandardMaterial({ color: "#b58a4a", roughness: 0.28, metalness: 0.72 }),
      darkGold: new THREE.MeshStandardMaterial({ color: "#8e6730", roughness: 0.34, metalness: 0.45 }),
      glassGlow: new THREE.MeshBasicMaterial({ color: "#efd29d", transparent: true, opacity: 0.18, depthWrite: false }),
      dice: new THREE.MeshPhysicalMaterial({
        color: "#fff9ed",
        roughness: 0.32,
        metalness: 0.03,
        clearcoat: 0.52,
        clearcoatRoughness: 0.25
      }),
      dicePip: new THREE.MeshStandardMaterial({ color: "#735226", roughness: 0.38, metalness: 0.55 }),
      snake: new THREE.MeshStandardMaterial({ color: "#317f68", roughness: 0.38, metalness: 0.18, emissive: "#123526", emissiveIntensity: 0.04 }),
      snakeAlt: new THREE.MeshStandardMaterial({ color: "#b6545e", roughness: 0.4, metalness: 0.16, emissive: "#3c1014", emissiveIntensity: 0.035 }),
      ladder: new THREE.MeshStandardMaterial({ color: "#d1a661", roughness: 0.3, metalness: 0.62 }),
      inactiveTile: new THREE.MeshStandardMaterial({ color: "#d7c3a4", roughness: 0.64, metalness: 0.02, transparent: true, opacity: 0.38 }),
      label: new THREE.MeshBasicMaterial({ color: "#2b241d", transparent: true })
    };
  }

  buildEnvironment() {
    const hemi = new THREE.HemisphereLight("#fff9ed", "#9f8a70", 2.2);
    this.scene.add(hemi);

    const key = new THREE.DirectionalLight("#fff4d9", 2.45);
    key.position.set(-4, 9, 6);
    key.castShadow = this.qualityProfile.shadowEnabled;
    key.shadow.mapSize.set(this.qualityProfile.shadowMapSize, this.qualityProfile.shadowMapSize);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 24;
    key.shadow.camera.left = -9;
    key.shadow.camera.right = 9;
    key.shadow.camera.top = 9;
    key.shadow.camera.bottom = -9;
    this.scene.add(key);
    this.keyLight = key;

    const rim = new THREE.SpotLight("#f1c977", 1.5, 28, Math.PI * 0.18, 0.45, 1);
    rim.position.set(7, 8, -6);
    rim.castShadow = false;
    this.scene.add(rim);

    const table = new THREE.Mesh(new THREE.CylinderGeometry(9.7, 10.25, 0.38, 96), this.materials.table);
    table.position.y = -0.32;
    table.receiveShadow = true;
    this.scene.add(table);
  }

  buildBoard() {
    const boardSize = getBoardWorldSize();
    const base = new THREE.Mesh(
      new RoundedBoxGeometry(boardSize + 0.72, 0.28, boardSize + 0.72, 8, 0.18),
      this.materials.boardBase
    );
    base.position.y = 0.02;
    base.castShadow = true;
    base.receiveShadow = true;
    this.boardGroup.add(base);

    const trimGeometry = new RoundedBoxGeometry(boardSize + 0.92, 0.16, 0.11, 5, 0.04);
    const verticalTrimGeometry = new RoundedBoxGeometry(0.11, 0.16, boardSize + 0.92, 5, 0.04);
    const edge = boardSize / 2 + 0.43;
    [
      [trimGeometry, 0, edge],
      [trimGeometry, 0, -edge],
      [verticalTrimGeometry, edge, 0],
      [verticalTrimGeometry, -edge, 0]
    ].forEach(([geometry, x, z]) => {
      const trim = new THREE.Mesh(geometry, this.materials.gold);
      trim.position.set(x, 0.24, z);
      trim.castShadow = true;
      trim.receiveShadow = true;
      this.boardGroup.add(trim);
    });

    const tileGeometry = new RoundedBoxGeometry(TILE_SIZE - TILE_GAP, 0.16, TILE_SIZE - TILE_GAP, 5, 0.06);
    for (let tile = 1; tile <= BOARD_SIZE * BOARD_SIZE; tile += 1) {
      const center = tileToWorld(tile);
      const tileMesh = new THREE.Mesh(tileGeometry, tile % 2 === 0 ? this.materials.tileA : this.materials.tileB);
      tileMesh.position.set(center.x, 0.24, center.z);
      tileMesh.castShadow = true;
      tileMesh.receiveShadow = true;
      tileMesh.userData.tile = tile;
      this.tileHitMeshes.push(tileMesh);
      this.tileMeshes.set(tile, tileMesh);
      this.boardGroup.add(tileMesh);

      const label = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.28), createLabelMaterial(tile));
      label.position.set(center.x - 0.26, TILE_TOP_Y + 0.006, center.z + 0.28);
      label.rotation.x = -Math.PI / 2;
      label.userData.tile = tile;
      this.tileLabels.set(tile, label);
      this.boardGroup.add(label);
    }

    const start = tileToWorld(0);
    const startBase = new THREE.Mesh(new RoundedBoxGeometry(1.0, 0.14, 0.9, 5, 0.08), this.materials.gold);
    startBase.position.set(start.x, 0.21, start.z);
    startBase.castShadow = true;
    startBase.receiveShadow = true;
    this.boardGroup.add(startBase);
    const startLabel = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.25), createTextPlaneMaterial("START", 64, 24, "#fff8e4"));
    startLabel.position.set(start.x, TILE_TOP_Y + 0.012, start.z);
    startLabel.rotation.x = -Math.PI / 2;
    this.boardGroup.add(startLabel);
  }

  buildConnections(ladders = LADDERS, snakes = SNAKES) {
    this.clearConnections();
    [...ladders.entries()].forEach(([from, to]) => this.buildLadder(from, to));
    [...snakes.entries()].forEach(([from, to], index) => this.buildSnake(from, to, index));
  }

  clearConnections() {
    this.connectionObjects.forEach((group) => {
      disposeObjectGeometry(group);
      this.boardGroup.remove(group);
    });
    this.connectionObjects = [];
    this.connections.clear();
  }

  buildLadder(from, to) {
    const group = new THREE.Group();
    const a = vectorForTile(from, CONNECTION_Y);
    const b = vectorForTile(to, CONNECTION_Y + 0.18);
    const direction = b.clone().sub(a);
    const perp = new THREE.Vector3(-direction.z, 0, direction.x).normalize().multiplyScalar(0.17);
    const railA0 = a.clone().add(perp);
    const railA1 = b.clone().add(perp);
    const railB0 = a.clone().sub(perp);
    const railB1 = b.clone().sub(perp);

    group.add(makeCylinderBetween(railA0, railA1, 0.045, this.materials.ladder));
    group.add(makeCylinderBetween(railB0, railB1, 0.045, this.materials.ladder));

    const rungCount = Math.max(5, Math.floor(a.distanceTo(b) / 0.55));
    for (let i = 1; i < rungCount; i += 1) {
      const t = i / rungCount;
      const p1 = railA0.clone().lerp(railA1, t);
      const p2 = railB0.clone().lerp(railB1, t);
      group.add(makeCylinderBetween(p1, p2, 0.033, this.materials.darkGold));
    }

    const marker = makeTileRing(from, "#f9cf74", 0.35);
    marker.position.y = TILE_TOP_Y + 0.018;
    group.add(marker);
    this.connections.set(`ladder-${from}`, group);
    this.connectionObjects.push(group);
    this.boardGroup.add(group);
  }

  buildSnake(from, to, index) {
    const group = new THREE.Group();
    const head = vectorForTile(from, CONNECTION_Y + 0.16);
    const tail = vectorForTile(to, CONNECTION_Y);
    const distance = head.distanceTo(tail);
    const dir = tail.clone().sub(head);
    const perp = new THREE.Vector3(-dir.z, 0, dir.x).normalize().multiplyScalar(index % 2 === 0 ? 0.76 : -0.76);
    const curve = new THREE.CatmullRomCurve3([
      head,
      head.clone().lerp(tail, 0.32).add(perp).setY(CONNECTION_Y + 0.34),
      head.clone().lerp(tail, 0.66).sub(perp.multiplyScalar(0.78)).setY(CONNECTION_Y + 0.18),
      tail
    ]);
    const snakeMaterial = index % 2 === 0 ? this.materials.snake : this.materials.snakeAlt;
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(42, Math.floor(distance * 10)), 0.065, 14, false), snakeMaterial);
    tube.castShadow = true;
    tube.receiveShadow = true;
    group.add(tube);

    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.17, 20, 16), snakeMaterial);
    headMesh.position.copy(head);
    headMesh.scale.set(1.16, 0.8, 1);
    headMesh.castShadow = true;
    group.add(headMesh);

    const eyeMaterial = new THREE.MeshBasicMaterial({ color: "#fff6d9" });
    const eyeA = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 8), eyeMaterial);
    const eyeB = eyeA.clone();
    eyeA.userData.disposeMaterial = true;
    eyeB.userData.disposeMaterial = true;
    eyeA.position.copy(head).add(new THREE.Vector3(0.055, 0.08, 0.11));
    eyeB.position.copy(head).add(new THREE.Vector3(-0.055, 0.08, 0.11));
    group.add(eyeA, eyeB);

    const marker = makeTileRing(from, "#e87272", 0.37);
    marker.position.y = TILE_TOP_Y + 0.02;
    group.add(marker);
    this.connections.set(`snake-${from}`, group);
    this.connectionObjects.push(group);
    this.boardGroup.add(group);
  }

  setBoardConfig(boardRuntime, options = {}) {
    if (!boardRuntime?.preset) return;
    this.finishTile = boardRuntime.finishTile || 100;
    this.setAccessibilityOptions(options);
    this.buildConnections(boardRuntime.laddersMap || LADDERS, boardRuntime.snakesMap || SNAKES);
    this.renderEventMarkers(boardRuntime.eventTilesMap, Boolean(options.eventTilesEnabled));
    this.updateInactiveTiles(this.finishTile);
    this.highlightTile(this.finishTile, "finish");
  }

  setAccessibilityOptions(options = {}) {
    this.reduceMotion = Boolean(options.reduceMotion);
    this.quickMode = Boolean(options.quickMode);
    this.highContrastNumbers = Boolean(options.highContrastNumbers);
    this.largeText = Boolean(options.largeText);
    this.updateTileLabels();
  }

  setQualityProfile(profile = QUALITY_PROFILES.high) {
    if (this.qualityProfile?.id === profile.id) return;
    this.qualityProfile = profile;
    if (this.renderer) {
      this.renderer.shadowMap.enabled = profile.shadowEnabled;
    }
    if (this.keyLight) {
      this.keyLight.castShadow = profile.shadowEnabled;
      this.keyLight.shadow.mapSize.set(profile.shadowMapSize, profile.shadowMapSize);
      this.keyLight.shadow.needsUpdate = true;
    }
    this.resize();
  }

  updateInactiveTiles(finishTile = this.finishTile) {
    this.tileMeshes.forEach((mesh, tile) => {
      mesh.material = tile > finishTile ? this.materials.inactiveTile : (tile % 2 === 0 ? this.materials.tileA : this.materials.tileB);
    });
    this.tileLabels.forEach((label, tile) => {
      label.visible = tile <= finishTile || finishTile >= 100;
      label.material.opacity = tile > finishTile ? 0.28 : 1;
    });
  }

  updateTileLabels() {
    this.tileLabels.forEach((label, tile) => {
      label.material.map?.dispose?.();
      label.material.dispose?.();
      label.material = createLabelMaterial(tile, {
        highContrast: this.highContrastNumbers,
        largeText: this.largeText
      });
      const scale = this.largeText ? 1.16 : 1;
      label.scale.setScalar(scale);
    });
  }

  renderEventMarkers(eventTilesMap, enabled) {
    this.clearEventMarkers();
    if (!enabled || !eventTilesMap?.size) return;
    eventTilesMap.forEach((type, tile) => {
      if (tile <= 0 || tile > this.finishTile) return;
      const definition = EVENT_TILE_DEFINITIONS[type];
      const center = tileToWorld(tile);
      const group = new THREE.Group();
      const ring = makeTileRing(tile, eventColor(type), 0.31);
      ring.position.y = TILE_TOP_Y + 0.024;
      const icon = new THREE.Mesh(
        new THREE.PlaneGeometry(0.42, 0.24),
        createTextPlaneMaterial(definition?.marker || "?", 80, 48, "#735226", "rgba(255,248,231,0.74)")
      );
      icon.position.set(center.x + 0.26, TILE_TOP_Y + 0.03, center.z - 0.26);
      icon.rotation.x = -Math.PI / 2;
      group.add(ring, icon);
      this.eventMarkerObjects.push(group);
      this.fxGroup.add(group);
    });
  }

  clearEventMarkers() {
    this.eventMarkerObjects.forEach((group) => {
      disposeObject(group);
      this.fxGroup.remove(group);
    });
    this.eventMarkerObjects = [];
  }

  buildDice() {
    this.diceGroup = new THREE.Group();
    this.diceGroup.position.set(6.55, 0.72, 6.15);
    const dice = new THREE.Mesh(new RoundedBoxGeometry(0.86, 0.86, 0.86, 8, 0.11), this.materials.dice);
    dice.castShadow = true;
    dice.receiveShadow = true;
    dice.userData.isDice = true;
    this.diceHitMeshes = [dice];
    this.diceGroup.add(dice);
    this.addDicePips();

    this.diceResultSprite = new THREE.Sprite(createSpriteTextMaterial("-", "#6d4b1e", "rgba(255,248,231,0.72)"));
    this.diceResultSprite.position.set(0, 0.78, 0);
    this.diceResultSprite.scale.set(0.72, 0.28, 1);
    this.diceGroup.add(this.diceResultSprite);
    this.scene.add(this.diceGroup);
  }

  addDicePips() {
    const pipGeometry = new THREE.CircleGeometry(0.045, 18);
    const faces = [
      { n: 1, pos: [0, 0, 0.437], rot: [0, 0, 0], axes: ["x", "y"] },
      { n: 6, pos: [0, 0, -0.437], rot: [0, Math.PI, 0], axes: ["x", "y"] },
      { n: 2, pos: [0.437, 0, 0], rot: [0, Math.PI / 2, 0], axes: ["z", "y"] },
      { n: 5, pos: [-0.437, 0, 0], rot: [0, -Math.PI / 2, 0], axes: ["z", "y"] },
      { n: 3, pos: [0, 0.437, 0], rot: [-Math.PI / 2, 0, 0], axes: ["x", "z"] },
      { n: 4, pos: [0, -0.437, 0], rot: [Math.PI / 2, 0, 0], axes: ["x", "z"] }
    ];
    faces.forEach((face) => {
      getPipOffsets(face.n).forEach(([a, b]) => {
        const pip = new THREE.Mesh(pipGeometry, this.materials.dicePip);
        pip.position.set(...face.pos);
        pip.rotation.set(...face.rot);
        pip.position[face.axes[0]] += a;
        pip.position[face.axes[1]] += b;
        this.diceGroup.add(pip);
      });
    });
  }

  buildHoverGlow() {
    this.hoverGlow = new THREE.Mesh(new THREE.PlaneGeometry(TILE_SIZE - 0.08, TILE_SIZE - 0.08), this.materials.glassGlow);
    this.hoverGlow.rotation.x = -Math.PI / 2;
    this.hoverGlow.position.y = TILE_TOP_Y + 0.016;
    this.hoverGlow.visible = false;
    this.scene.add(this.hoverGlow);
  }

  setPlayers(players) {
    this.players = players;
    this.tokens.forEach((token) => disposeObject(token.group));
    this.tokens.clear();

    players.forEach((player, index) => {
      const group = createTokenMesh(player.color);
      const thinkingSprite = new THREE.Sprite(createSpriteTextMaterial("...", "#6d4b1e", "rgba(255,248,231,0.84)"));
      thinkingSprite.position.set(0, 0.92, 0);
      thinkingSprite.scale.set(0.54, 0.24, 1);
      thinkingSprite.visible = false;
      group.add(thinkingSprite);
      this.actorGroup.add(group);
      this.tokens.set(player.id, { group, index, color: player.color, ring: group.userData.ring, thinkingSprite });
    });

    this.syncTokenPositions(players);
    this.setActivePlayer(this.activePlayerIndex);
  }

  syncTokenPositions(players = this.players) {
    players.forEach((player, index) => {
      const token = this.tokens.get(player.id);
      if (!token) return;
      token.group.position.copy(this.getTokenPosition(player.position, index));
    });
  }

  setActivePlayer(index) {
    this.activePlayerIndex = index;
    this.tokens.forEach((token) => {
      token.ring.visible = token.index === index || this.players[token.index]?.id === this.activePulseId;
    });
  }

  setDiceResult(result) {
    if (!this.diceResultSprite) return;
    const nextResult = result || "-";
    if (this.lastDiceResult === nextResult) return;
    this.lastDiceResult = nextResult;
    this.diceResultSprite.material.map?.dispose();
    this.diceResultSprite.material.dispose();
    this.diceResultSprite.material = createSpriteTextMaterial(nextResult, "#6d4b1e", "rgba(255,248,231,0.72)");
  }

  setCinematicEnabled(enabled) {
    if (!enabled) return;
    this.frameBoardOverview({ immediate: true });
  }

  frameBoardOverview({ immediate = false } = {}) {
    const compact = window.innerWidth < 760;
    const position = (compact ? MOBILE_OVERVIEW_CAMERA : DESKTOP_OVERVIEW_CAMERA).clone();
    const target = OVERVIEW_TARGET.clone();
    if (immediate) {
      this.camera.position.copy(position);
      this.controls.target.copy(target);
      this.controls.update();
      return Promise.resolve(true);
    }
    return this.animateCameraTo(position, target, null, this.timing(850));
  }

  frameBoardIntro() {
    if (!this.isCinematic()) return;
    this.frameBoardOverview();
  }

  async animateDiceRoll(result, token) {
    if (this.isCinematic()) {
      this.animateCameraTo(new THREE.Vector3(8.8, 5.8, 8.8), this.diceGroup.position.clone(), token, 520);
    }

    const startRotation = this.diceGroup.rotation.clone();
    const rollSpin = new THREE.Euler(
      startRotation.x + Math.PI * (6 + result * 0.28),
      startRotation.y + Math.PI * (7 + result * 0.21),
      startRotation.z + Math.PI * (5 + result * 0.16)
    );
    const startY = this.diceGroup.position.y;
    const ok = await tween({
      duration: this.timing(1080),
      ease: easeOutCubic,
      token,
      onUpdate: (v, raw) => {
        this.diceGroup.rotation.x = THREE.MathUtils.lerp(startRotation.x, rollSpin.x, v);
        this.diceGroup.rotation.y = THREE.MathUtils.lerp(startRotation.y, rollSpin.y, v);
        this.diceGroup.rotation.z = THREE.MathUtils.lerp(startRotation.z, rollSpin.z, v);
        this.diceGroup.position.y = startY + Math.abs(Math.sin(raw * Math.PI * 5.5)) * 0.28 * (1 - raw);
      },
      onComplete: () => {
        this.diceGroup.position.y = startY;
      }
    });

    if (ok) {
      this.setDiceResult(result);
      this.spawnSparkles(this.diceGroup.position.clone().add(new THREE.Vector3(0, 0.42, 0)), this.reduceMotion ? 5 : 12, "#f4ce7d");
    }

    return ok;
  }

  async moveTokenTileByTile(playerId, path, players, playerIndex, token, onStep) {
    const tokenEntry = this.tokens.get(playerId);
    if (!tokenEntry) return false;

    for (const tile of path) {
      const start = tokenEntry.group.position.clone();
      const end = this.getTokenPosition(tile, playerIndex);
      if (this.isCinematic()) {
        this.animateCameraTo(
          this.camera.position.clone().lerp(end.clone().add(new THREE.Vector3(4.2, 5.6, 5.2)), 0.28),
          end.clone(),
          token,
          360
        );
      }
      this.highlightTile(tile, "target");

      const moved = await tween({
        duration: this.timing(360),
        ease: easeInOutCubic,
        token,
        onUpdate: (v, raw) => {
          tokenEntry.group.position.lerpVectors(start, end, v);
          tokenEntry.group.position.y = THREE.MathUtils.lerp(start.y, end.y, v) + Math.sin(raw * Math.PI) * 0.24;
          if (!this.reduceMotion && raw > 0.35 && raw < 0.9 && Math.random() > 0.82) {
            this.spawnSparkles(tokenEntry.group.position.clone().add(new THREE.Vector3(0, 0.04, 0)), 1, tokenEntry.color || "#f2c76d");
          }
        }
      });
      if (!moved) return false;

      onStep?.(tile);
      const bounced = await this.bounceToken(tokenEntry.group, token);
      if (!bounced) return false;
    }

    this.syncTokenPositions(players);
    return true;
  }

  async animateTransport(playerId, transport, players, playerIndex, token) {
    const tokenEntry = this.tokens.get(playerId);
    if (!tokenEntry) return false;
    this.highlightConnection(transport);
    this.highlightTile(transport.from, transport.type);

    const start = this.getTokenPosition(transport.from, playerIndex);
    const end = this.getTokenPosition(transport.to, playerIndex);
    const lift = transport.type === "ladder" ? 0.9 : 0.52;
    const control = start.clone().lerp(end, 0.5);
    control.y += lift;
    const curve = new THREE.QuadraticBezierCurve3(start, control, end);
    const duration = this.timing(transport.type === "ladder" ? 980 : 880);

    if (this.isCinematic()) {
      const cameraOffset = transport.type === "ladder"
        ? new THREE.Vector3(3.6, 6.2, 4.2)
        : new THREE.Vector3(4.4, 4.8, 5.4);
      this.animateCameraTo(end.clone().add(cameraOffset), end.clone(), token, duration);
    }

    const ok = await tween({
      duration,
      ease: transport.type === "ladder" ? easeInOutCubic : easeOutCubic,
      token,
      onUpdate: (v) => {
        tokenEntry.group.position.copy(curve.getPoint(v));
        tokenEntry.group.rotation.y += transport.type === "ladder" ? 0.025 : 0.045;
        if (!this.reduceMotion && Math.random() > 0.88) {
          this.spawnSparkles(tokenEntry.group.position.clone(), 1, transport.type === "ladder" ? "#f2c76d" : "#c8d9c4");
        }
      },
      onComplete: () => {
        tokenEntry.group.position.copy(end);
        tokenEntry.group.rotation.y = 0;
      }
    });

    if (ok) {
      this.spawnSparkles(end.clone().add(new THREE.Vector3(0, 0.35, 0)), this.reduceMotion ? 6 : (transport.type === "ladder" ? 26 : 15), transport.type === "ladder" ? "#f2c76d" : "#bde6cf");
    }
    return ok;
  }

  async moveTokenDirect(playerId, toTile, players, playerIndex, token, type = "event") {
    const tokenEntry = this.tokens.get(playerId);
    if (!tokenEntry) return false;
    const start = tokenEntry.group.position.clone();
    const end = this.getTokenPosition(toTile, playerIndex);
    const control = start.clone().lerp(end, 0.5);
    control.y += type === "backstep" ? 0.36 : 0.62;
    const curve = new THREE.QuadraticBezierCurve3(start, control, end);
    this.highlightTile(toTile, type);
    if (this.isCinematic()) {
      this.animateCameraTo(end.clone().add(new THREE.Vector3(3.8, 5.2, 4.7)), end.clone(), token, this.timing(520));
    }
    const ok = await tween({
      duration: this.timing(520),
      ease: easeInOutCubic,
      token,
      onUpdate: (v) => {
        tokenEntry.group.position.copy(curve.getPoint(v));
      },
      onComplete: () => {
        tokenEntry.group.position.copy(end);
      }
    });
    if (ok) {
      this.spawnSparkles(end.clone().add(new THREE.Vector3(0, 0.24, 0)), this.reduceMotion ? 4 : 10, eventColor(type));
      this.syncTokenPositions(players);
    }
    return ok;
  }

  async swapTokens(playerA, indexA, playerB, indexB, players, token) {
    const tokenA = this.tokens.get(playerA.id);
    const tokenB = this.tokens.get(playerB.id);
    if (!tokenA || !tokenB) return false;
    const startA = tokenA.group.position.clone();
    const startB = tokenB.group.position.clone();
    const endA = this.getTokenPosition(playerB.position, indexA);
    const endB = this.getTokenPosition(playerA.position, indexB);
    const ok = await tween({
      duration: this.timing(620),
      ease: easeInOutCubic,
      token,
      onUpdate: (v) => {
        tokenA.group.position.lerpVectors(startA, endA, v);
        tokenB.group.position.lerpVectors(startB, endB, v);
        tokenA.group.position.y += Math.sin(v * Math.PI) * 0.34;
        tokenB.group.position.y += Math.sin(v * Math.PI) * 0.34;
      }
    });
    if (ok) {
      this.spawnSparkles(endA.clone().add(new THREE.Vector3(0, 0.28, 0)), this.reduceMotion ? 4 : 14, "#f1c761");
    }
    return ok;
  }

  async bounceToken(group, token) {
    const start = group.scale.clone();
    return tween({
      duration: this.timing(180),
      ease: easeOutBack,
      token,
      onUpdate: (v) => {
        const scale = 1 + Math.sin(v * Math.PI) * 0.12;
        group.scale.set(start.x * scale, start.y * (1 + Math.sin(v * Math.PI) * 0.08), start.z * scale);
      },
      onComplete: () => group.scale.set(1, 1, 1)
    });
  }

  showVictory(player) {
    const tokenEntry = this.tokens.get(player.id);
    if (!tokenEntry) return;
    this.spawnSparkles(tokenEntry.group.position.clone().add(new THREE.Vector3(0, 0.6, 0)), 80, "#f3c664");
    if (this.isCinematic()) {
      this.animateCameraTo(tokenEntry.group.position.clone().add(new THREE.Vector3(3.2, 4.2, 4.4)), tokenEntry.group.position.clone(), null, 900);
    }
  }

  setRuleOptions(rules = {}) {
    this.ruleOptions = { ...rules };
  }

  highlightTile(tile, type = "target") {
    if (!tile || tile < 1) return;
    const colors = {
      target: "#f6d17a",
      ladder: "#f1c761",
      snake: "#e77d7d",
      landing: "#ffffff",
      finish: "#f5c95a",
      bonus: "#f1c761",
      backstep: "#d98565",
      forward: "#8fcf85",
      power: "#d9b7ff",
      safe: "#91d6cf",
      trap: "#d56c6c",
      event: "#f4d08b"
    };
    const key = `${type}-${tile}-${performance.now()}`;
    const ring = makeTileRing(tile, colors[type] || colors.target, type === "target" ? 0.42 : 0.48);
    ring.position.y = TILE_TOP_Y + 0.028;
    ring.userData.life = type === "target" ? 0.9 : 1.25;
    ring.userData.maxLife = ring.userData.life;
    ring.userData.baseScale = ring.scale.x;
    this.fxGroup.add(ring);
    this.tileHighlights.set(key, ring);
  }

  clearHighlights() {
    this.tileHighlights.forEach((mesh) => {
      this.fxGroup.remove(mesh);
      mesh.geometry?.dispose?.();
      mesh.material?.dispose?.();
    });
    this.tileHighlights.clear();
  }

  setBotThinking(playerId, enabled) {
    this.tokens.forEach((token, id) => {
      if (!token.thinkingSprite) return;
      token.thinkingSprite.visible = enabled && id === playerId;
    });
  }

  showResultPop(result) {
    if (!this.diceResultSprite) return;
    this.setDiceResult(result);
    const start = this.diceResultSprite.scale.clone();
    tween({
      duration: 280,
      ease: easeOutBack,
      onUpdate: (v) => {
        const scale = 1 + Math.sin(v * Math.PI) * 0.45;
        this.diceResultSprite.scale.set(start.x * scale, start.y * scale, 1);
      },
      onComplete: () => {
        this.diceResultSprite.scale.copy(start);
      }
    });
  }

  setActiveTokenPulse(playerId, enabled) {
    this.activePulseId = enabled ? playerId : null;
    this.tokens.forEach((token, id) => {
      token.ring.visible = id === this.activePulseId || token.index === this.activePlayerIndex;
    });
  }

  highlightConnection(transport) {
    const group = this.connections.get(`${transport.type}-${transport.from}`);
    if (!group) return;
    group.traverse((child) => {
      if (!child.material || child.userData.isHighlighting) return;
      child.userData.isHighlighting = true;
      const original = child.material.emissiveIntensity || 0;
      if (child.material.emissive) child.material.emissiveIntensity = original + 0.28;
      window.setTimeout(() => {
        if (child.material?.emissive) child.material.emissiveIntensity = original;
        child.userData.isHighlighting = false;
      }, 900);
    });
  }

  getTokenPosition(tile, playerIndex) {
    const center = tileToWorld(tile);
    const offset = tile > 0 ? getPlayerTileOffset(playerIndex) : { x: playerIndex * 0.18, z: 0 };
    return new THREE.Vector3(center.x + offset.x, TOKEN_Y, center.z + offset.z);
  }

  animateCameraTo(position, target, token, duration = 650) {
    if (!this.isCinematic()) return Promise.resolve(false);
    const startPosition = this.camera.position.clone();
    const startTarget = this.controls.target.clone();
    return tween({
      duration,
      ease: easeInOutCubic,
      token,
      onUpdate: (v) => {
        this.camera.position.lerpVectors(startPosition, position, v);
        this.controls.target.lerpVectors(startTarget, target, v);
      }
    });
  }

  isCinematic() {
    return this.options.getCinematicEnabled?.() !== false;
  }

  spawnSparkles(origin, count, color) {
    const qualityScale = this.qualityProfile?.particleScale ?? 1;
    const particleCount = this.reduceMotion ? Math.min(count, 8) : Math.max(0, Math.round(count * qualityScale));
    for (let i = 0; i < particleCount; i += 1) {
      const mesh = new THREE.Mesh(this.sparkleGeometry, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 }));
      mesh.position.copy(origin);
      mesh.userData.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.08,
        Math.random() * 0.08 + 0.035,
        (Math.random() - 0.5) * 0.08
      );
      mesh.userData.life = 1;
      this.fxGroup.add(mesh);
      this.particles.push(mesh);
    }
  }

  timing(duration) {
    const scale = this.reduceMotion ? 0.48 : (this.quickMode ? 0.78 : 1);
    return Math.max(90, Math.round(duration * scale));
  }

  updateParticles(delta) {
    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      const particle = this.particles[i];
      particle.userData.life -= delta * 1.25;
      particle.position.add(particle.userData.velocity);
      particle.userData.velocity.y -= delta * 0.06;
      particle.material.opacity = Math.max(0, particle.userData.life);
      if (particle.userData.life <= 0) {
        this.fxGroup.remove(particle);
        particle.material.dispose();
        this.particles.splice(i, 1);
      }
    }

    this.tileHighlights.forEach((mesh, key) => {
      mesh.userData.life -= delta;
      const progress = Math.max(0, mesh.userData.life / mesh.userData.maxLife);
      const pulse = 1 + (1 - progress) * 0.2;
      mesh.scale.setScalar(pulse);
      mesh.material.opacity = Math.max(0, 0.42 * progress);
      if (mesh.userData.life <= 0) {
        this.fxGroup.remove(mesh);
        mesh.geometry?.dispose?.();
        mesh.material?.dispose?.();
        this.tileHighlights.delete(key);
      }
    });
  }

  handlePointerMove(event) {
    this.updatePointerFromEvent(event);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const diceHit = this.diceHitMeshes.length
      ? this.raycaster.intersectObjects(this.diceHitMeshes, false)[0]
      : null;
    const diceClickable = Boolean(diceHit && this.options.canDiceClick?.());
    this.canvas.style.cursor = diceClickable ? "pointer" : "";
    const hit = this.raycaster.intersectObjects(this.tileHitMeshes, false)[0];
    if (!hit) {
      this.hoverGlow.visible = false;
      return;
    }
    const center = tileToWorld(hit.object.userData.tile);
    this.hoverGlow.position.x = center.x;
    this.hoverGlow.position.z = center.z;
    this.hoverGlow.visible = true;
  }

  handlePointerDown(event) {
    if (event.button !== 0 || !this.diceHitMeshes.length) return;
    this.updatePointerFromEvent(event);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObjects(this.diceHitMeshes, false)[0];
    this.pendingDiceClick = hit && this.options.canDiceClick?.()
      ? { x: event.clientX, y: event.clientY, pointerId: event.pointerId }
      : null;
  }

  handlePointerUp(event) {
    if (!this.pendingDiceClick || this.pendingDiceClick.pointerId !== event.pointerId) return;
    const distance = Math.hypot(event.clientX - this.pendingDiceClick.x, event.clientY - this.pendingDiceClick.y);
    this.pendingDiceClick = null;
    if (distance > 8 || !this.options.canDiceClick?.()) return;
    this.updatePointerFromEvent(event);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObjects(this.diceHitMeshes, false)[0];
    if (!hit) return;
    event.preventDefault();
    this.options.onDiceClick?.();
  }

  updatePointerFromEvent(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    const qualityCap = this.qualityProfile?.pixelRatioCap ?? 2;
    const mobileCap = width < 720 ? Math.min(qualityCap, 1.35) : qualityCap;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobileCap));
    this.renderer.setSize(width, height, false);
    this.controls.minDistance = width < 720 ? 9 : 8;
    this.controls.maxDistance = width < 720 ? 30 : 28;
  }

  render() {
    if (this.isDestroyed) return;
    const delta = Math.min(0.033, this.clock?.getDelta?.() || 0.016);
    this.controls.update();
    this.updateParticles(delta);
    const elapsed = this.clock.elapsedTime;
    this.tokens.forEach((token, id) => {
      if (token.ring?.visible) {
        const active = id === this.activePulseId;
        const glowScale = this.qualityProfile?.glowScale ?? 1;
        const pulse = 1 + Math.sin(elapsed * (active ? 4.2 : 2.4)) * (active ? 0.08 : 0.035) * glowScale;
        token.ring.scale.setScalar(pulse);
        token.ring.material.opacity = (active ? 0.6 + Math.sin(elapsed * 4.2) * 0.18 : 0.42) * glowScale;
      }
    });
    if (this.diceGroup && !this.players.length) {
      this.diceGroup.rotation.y += delta * 0.18;
    }
    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(this.render);
  }

  destroy() {
    this.isDestroyed = true;
    cancelAnimationFrame(this.animationId);
    window.removeEventListener("resize", this.onResize);
    this.canvas.removeEventListener("pointermove", this.onPointerMove);
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    this.canvas.removeEventListener("pointerup", this.onPointerUp);
    this.canvas.removeEventListener("pointerleave", this.onPointerLeave);
    this.canvas.removeEventListener("webglcontextlost", this.onContextLost);
    this.canvas.removeEventListener("webglcontextrestored", this.onContextRestored);
    this.controls.dispose();
    this.clearEventMarkers();
    this.clearConnections();
    disposeObject(this.scene);
    this.sparkleGeometry?.dispose?.();
    this.renderer.dispose();
  }
}

function vectorForTile(tile, y) {
  const center = tileToWorld(tile);
  return new THREE.Vector3(center.x, y, center.z);
}

function makeCylinderBetween(start, end, radius, material) {
  const direction = end.clone().sub(start);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, direction.length(), 14), material);
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function makeTileRing(tile, color, radius) {
  const center = tileToWorld(tile);
  const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.34, depthWrite: false });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.018, 8, 48), material);
  ring.position.set(center.x, 0, center.z);
  ring.rotation.x = Math.PI / 2;
  ring.userData.disposeMaterial = true;
  return ring;
}

function createTokenMesh(color) {
  const group = new THREE.Group();
  group.name = "royale-player-piece";
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.28,
    metalness: 0.22,
    clearcoat: 0.7,
    clearcoatRoughness: 0.18
  });
  const deepMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color).multiplyScalar(0.58),
    roughness: 0.34,
    metalness: 0.22
  });
  const gold = new THREE.MeshStandardMaterial({ color: "#e5bd6a", roughness: 0.22, metalness: 0.82 });
  const darkGold = new THREE.MeshStandardMaterial({ color: "#9c6f2d", roughness: 0.3, metalness: 0.68 });
  const ivory = new THREE.MeshPhysicalMaterial({
    color: "#fff4d9",
    roughness: 0.24,
    metalness: 0.02,
    clearcoat: 0.55,
    clearcoatRoughness: 0.2
  });

  const shadow = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.38, 0.016, 48),
    new THREE.MeshBasicMaterial({ color: "#3c2a13", transparent: true, opacity: 0.13, depthWrite: false })
  );
  shadow.position.y = 0.01;
  shadow.scale.z = 0.82;

  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.31, 0.12, 48), deepMaterial);
  plinth.position.y = 0.07;
  plinth.castShadow = true;
  plinth.receiveShadow = true;

  const lowerTrim = new THREE.Mesh(new THREE.TorusGeometry(0.255, 0.023, 10, 56), gold);
  lowerTrim.rotation.x = Math.PI / 2;
  lowerTrim.position.y = 0.145;
  lowerTrim.castShadow = true;

  const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.22, 0.14, 48), bodyMaterial);
  waist.position.y = 0.22;
  waist.castShadow = true;
  waist.receiveShadow = true;

  const waistTrim = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.018, 10, 48), darkGold);
  waistTrim.rotation.x = Math.PI / 2;
  waistTrim.position.y = 0.29;
  waistTrim.castShadow = true;

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.19, 36, 24), bodyMaterial);
  body.position.y = 0.43;
  body.scale.set(0.82, 1.18, 0.82);
  body.castShadow = true;
  body.receiveShadow = true;

  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.172, 0.018, 10, 48), gold);
  collar.rotation.x = Math.PI / 2;
  collar.position.y = 0.56;
  collar.castShadow = true;

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.135, 34, 22), ivory);
  head.position.y = 0.66;
  head.scale.set(0.96, 1.05, 0.96);
  head.castShadow = true;

  const crownBand = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.13, 0.05, 32), gold);
  crownBand.position.y = 0.755;
  crownBand.castShadow = true;

  const crownTips = new THREE.Group();
  for (let i = 0; i < 5; i += 1) {
    const angle = (i / 5) * Math.PI * 2 + Math.PI / 5;
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.026, 0.105, 4), gold);
    tip.position.set(Math.cos(angle) * 0.088, 0.82, Math.sin(angle) * 0.088);
    tip.rotation.y = angle;
    tip.castShadow = true;
    crownTips.add(tip);
  }

  const jewel = new THREE.Mesh(new THREE.SphereGeometry(0.034, 18, 14), bodyMaterial);
  jewel.position.y = 0.89;
  jewel.castShadow = true;

  const highlight = new THREE.Mesh(
    new THREE.PlaneGeometry(0.075, 0.19),
    new THREE.MeshBasicMaterial({ color: "#fff8df", transparent: true, opacity: 0.22, depthWrite: false })
  );
  highlight.position.set(-0.075, 0.48, 0.151);
  highlight.rotation.x = -0.16;
  highlight.rotation.y = -0.26;

  const ringMaterial = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.54, depthWrite: false });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.024, 8, 56), ringMaterial);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.03;
  ring.visible = false;
  group.userData.ring = ring;

  const goldHalo = new THREE.Mesh(
    new THREE.TorusGeometry(0.27, 0.012, 8, 48),
    new THREE.MeshBasicMaterial({ color: "#f1ca77", transparent: true, opacity: 0.32, depthWrite: false })
  );
  goldHalo.position.y = 0.032;
  goldHalo.visible = true;
  ring.add(goldHalo);

  group.add(ring, shadow, plinth, lowerTrim, waist, waistTrim, body, collar, head, crownBand, crownTips, jewel, highlight);
  group.scale.setScalar(0.86);
  return group;
}

function createMarbleTexture(accent) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff8ec";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 34; i += 1) {
    ctx.beginPath();
    ctx.strokeStyle = i % 3 === 0 ? `${accent}55` : "rgba(255,255,255,0.34)";
    ctx.lineWidth = Math.random() * 2 + 0.5;
    const y = Math.random() * canvas.height;
    for (let x = -20; x < canvas.width + 20; x += 28) {
      const wave = Math.sin((x + i * 19) * 0.025) * 22;
      if (x === -20) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave + Math.random() * 16 - 8);
    }
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

function createLabelMaterial(tile, options = {}) {
  const color = options.highContrast ? "#17110a" : "#2b241d";
  const width = options.largeText ? 72 : 64;
  const height = options.largeText ? 44 : 40;
  return createTextPlaneMaterial(String(tile), width, height, color);
}

function createTextPlaneMaterial(text, width, height, color, background = null) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, width, height);
  if (background) {
    roundedRect(ctx, 2, 2, width - 4, height - 4, Math.min(10, height * 0.28));
    ctx.fillStyle = background;
    ctx.fill();
    ctx.strokeStyle = "rgba(201,163,93,0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  ctx.fillStyle = color;
  ctx.font = `700 ${Math.floor(height * 0.58)}px Segoe UI, Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshBasicMaterial({ map: texture, transparent: true });
}

function createSpriteTextMaterial(text, color, background) {
  const canvas = document.createElement("canvas");
  canvas.width = 160;
  canvas.height = 72;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  roundedRect(ctx, 10, 12, 140, 48, 18);
  ctx.fillStyle = background;
  ctx.fill();
  ctx.strokeStyle = "rgba(201,163,93,0.55)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.font = "800 32px Segoe UI, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(text), 80, 37);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return new THREE.SpriteMaterial({ map: texture, transparent: true });
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function getPipOffsets(n) {
  const a = 0.16;
  const layouts = {
    1: [[0, 0]],
    2: [[-a, -a], [a, a]],
    3: [[-a, -a], [0, 0], [a, a]],
    4: [[-a, -a], [a, -a], [-a, a], [a, a]],
    5: [[-a, -a], [a, -a], [0, 0], [-a, a], [a, a]],
    6: [[-a, -a], [a, -a], [-a, 0], [a, 0], [-a, a], [a, a]]
  };
  return layouts[n] || layouts[1];
}

function disposeObject(object) {
  object.traverse?.((child) => {
    child.geometry?.dispose?.();
    if (Array.isArray(child.material)) {
      child.material.forEach((material) => material.dispose?.());
    } else {
      child.material?.dispose?.();
    }
  });
  object.parent?.remove?.(object);
}

function disposeObjectGeometry(object) {
  object.traverse?.((child) => {
    child.geometry?.dispose?.();
    if (child.userData?.disposeMaterial) child.material?.dispose?.();
  });
  object.parent?.remove?.(object);
}

function eventColor(type) {
  return {
    bonus: "#f1c761",
    backstep: "#d98565",
    forward: "#8fcf85",
    power: "#d9b7ff",
    safe: "#91d6cf",
    trap: "#d56c6c",
    event: "#f4d08b"
  }[type] || "#f4d08b";
}
