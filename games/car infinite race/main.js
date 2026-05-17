import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { PlayerCarSystem } from "./playerCarSystem.js";
import { TrafficCarSystem } from "./trafficCarSystem.js";

(() => {
  "use strict";

  const gsap = window.gsap;
  const Howl = window.Howl;
  const CANNON = window.CANNON;

  if (!gsap || !Howl || !CANNON) {
    console.error("Night Traffic Run could not start because GSAP, Howler, or Cannon.js failed to load.");
    return;
  }

  // DOM references
  const canvas = document.getElementById("game-canvas");
  const speedValue = document.getElementById("speed-value");
  const distanceValue = document.getElementById("distance-value");
  const scoreValue = document.getElementById("score-value");
  const bestScoreValue = document.getElementById("best-score-value");
  const bonusBurst = document.getElementById("bonus-burst");
  const scoreBanner = document.getElementById("score-banner");
  const speedFlash = document.getElementById("speed-flash");
  const speedometer = document.getElementById("speedometer");
  const speedometerNeedle = document.getElementById("speedometer-needle");
  const speedometerValue = document.getElementById("speedometer-value");
  const speedometerGear = document.getElementById("speedometer-gear");
  const speedometerMode = document.getElementById("speedometer-mode");
  const finalScore = document.getElementById("final-score");
  const finalBest = document.getElementById("final-best");
  const startScreen = document.getElementById("start-screen");
  const gameOverScreen = document.getElementById("game-over-screen");
  const startButton = document.getElementById("start-button");
  const sceneButton = document.getElementById("scene-button");
  const lightsButton = document.getElementById("lights-button");
  const hornButton = document.getElementById("horn-button");
  const viewButton = document.getElementById("view-button");
  const touchLeftButton = document.getElementById("touch-left");
  const touchRightButton = document.getElementById("touch-right");
  const touchAccelerateButton = document.getElementById("touch-accelerate");
  const touchBrakeButton = document.getElementById("touch-brake");
  const touchGearDownButton = document.getElementById("touch-gear-down");
  const touchGearUpButton = document.getElementById("touch-gear-up");
  const mobileGearValue = document.getElementById("mobile-gear-value");
  const orientationGuard = document.getElementById("orientation-guard");

  // Core tuning values
  const ROAD_WIDTH = 14;
  const ROAD_HALF_WIDTH = ROAD_WIDTH / 2;
  const ROAD_TILE_LENGTH = 80;
  const ROAD_TILE_COUNT = 3;
  const PLAYER_Y = 0.8;
  const PLAYER_Z = 18;
  const CAMERA_BASE_FOV = 60;
  const COCKPIT_FOV = 54;
  const PLAYER_MODEL_PATH = "assets/player-car.gltf";
  const TRAFFIC_MODEL_PATH = "assets/traffic-car.gltf";
  const LANE_POSITIONS = [-4, 0, 4];
  const BASE_SPEED = 18;
  const MIN_SPEED = 10;
  const SPEEDOMETER_MAX_KMH = 500;
  const MAX_SPEED = SPEEDOMETER_MAX_KMH / 8.6;
  const ACCELERATION_BOOST = 14.2;
  const BRAKE_REDUCTION = 8.4;
  const SPEED_STEP = 1.05;
  const SPEED_STEP_INTERVAL = 4.8;
  const TRAFFIC_CLEAR_Z = PLAYER_Z + 22;
  const TRAFFIC_SPAWN_Z = -120;
  const MAX_TRAFFIC_CARS = 12;
  const NEAR_MISS_THRESHOLD_X = 1.5;
  const NEAR_MISS_THRESHOLD_Z = 3;
  const NEAR_MISS_PASS_WINDOW_BEHIND = 1.25;
  const NEAR_MISS_SPEED_MIN_KMH = 145;
  const SCORE_RATE = 24;
  const NEAR_MISS_BONUS = 180;
  const COLLISION_OVERLAP_TOLERANCE_X = 0.015;
  const COLLISION_OVERLAP_TOLERANCE_Z = 0.015;
  const BEST_SCORE_STORAGE_KEY = "night-traffic-run-best-score";
  const PHYSICS_STEP = 1 / 60;
  const HORN_COOLDOWN = 0.38;
  const HIGH_SPEED_FLASH_START_KMH = 390;
  const LANE_HOLD_INITIAL_DELAY = 0.17;
  const LANE_HOLD_REPEAT_DELAY = 0.1;
  const GEAR_SETTINGS = {
    1: { speedCap: 18.2, accelMultiplier: 1.42, brakeMultiplier: 1.06, idealMin: 0, idealMax: 14.4 },
    2: { speedCap: 28.6, accelMultiplier: 1.24, brakeMultiplier: 1.02, idealMin: 11.2, idealMax: 23.6 },
    3: { speedCap: 40.8, accelMultiplier: 1.12, brakeMultiplier: 0.98, idealMin: 20.8, idealMax: 34.2 },
    4: { speedCap: 50.8, accelMultiplier: 1.02, brakeMultiplier: 0.94, idealMin: 31.4, idealMax: 45.2 },
    5: { speedCap: MAX_SPEED, accelMultiplier: 0.94, brakeMultiplier: 0.9, idealMin: 42.6, idealMax: 55.8 }
  };

  // Scene objects
  let scene;
  let camera;
  let renderer;
  let composer;
  let bloomPass;
  let environmentTarget;
  let clock;
  let playerCar;
  let playerCarSystem;
  let trafficCarSystem;
  let physicsWorld;
  let playerBody;

  const roadTiles = [];
  const tempCameraTarget = new THREE.Vector3();
  const tempCameraPosition = new THREE.Vector3();
  const smoothedLookTarget = new THREE.Vector3();
  const cameraEffects = {
    shakeX: 0,
    shakeY: 0,
    zoom: 0
  };
  const sceneVisuals = {
    mode: "day",
    hemi: null,
    ambient: null,
    directional: null,
    sun: null,
    halo: null,
    moon: null,
    moonHalo: null,
    stars: [],
    duneMaterials: [],
    towerMaterials: [],
    shoulderMaterials: [],
    roadMaterials: [],
    edgeMaterials: [],
    dashMaterials: [],
    postMaterials: [],
    lampMaterials: []
  };

  const inputState = {
    accelerate: false,
    brake: false,
    left: false,
    right: false,
    laneHoldDirection: 0,
    laneHoldTimer: 0
  };

  const keyboardInputState = {
    accelerate: false,
    brake: false,
    left: false,
    right: false
  };

  const touchInputState = {
    accelerate: false,
    brake: false,
    left: false,
    right: false
  };

  // Shared game state
  const gameState = {
    animationId: 0,
    loopStarted: false,
    started: false,
    running: false,
    ended: false,
    laneIndex: 1,
    targetPlayerX: 0,
    speed: BASE_SPEED,
    targetSpeed: BASE_SPEED,
    speedTimer: 0,
    elapsed: 0,
    distance: 0,
    score: 0,
    bestScore: 0,
    hornCooldown: 0,
    viewMode: "chase",
    gear: 3,
    sceneMode: "day",
    headlightMode: "wide",
    orientationBlocked: false,
    orientationResumePending: false
  };

  const sounds = {
    engine: null,
    wind: null,
    crash: null,
    nearMiss: null,
    horn: null
  };

  void init();

  function getBaseCameraFov() {
    return gameState.viewMode === "cockpit" ? COCKPIT_FOV : CAMERA_BASE_FOV;
  }

  function renderScene() {
    if (composer) {
      composer.render();
      return;
    }

    renderer.render(scene, camera);
  }

  function getHeadlightLabel() {
    const labels = {
      wide: "Wide",
      narrow: "Narrow",
      low: "Down",
      high: "Up"
    };

    return labels[gameState.headlightMode] || "Wide";
  }

  function updateSceneButton() {
    if (sceneButton) {
      sceneButton.textContent = `Mode: ${gameState.sceneMode === "night" ? "Night" : "Day"}`;
    }
  }

  function updateLightsButton() {
    if (lightsButton) {
      lightsButton.textContent = `LED: ${getHeadlightLabel()}`;
      lightsButton.style.opacity = gameState.sceneMode === "night" ? "1" : "0.74";
    }
  }

  function getGearDriveFactor(speed, gearProfile) {
    if (!gearProfile) {
      return 1;
    }

    if (speed <= gearProfile.idealMin) {
      return THREE.MathUtils.clamp(
        THREE.MathUtils.mapLinear(speed, 0, Math.max(gearProfile.idealMin, 0.001), 0.42, 0.92),
        0.42,
        0.92
      );
    }

    if (speed >= gearProfile.idealMax) {
      return THREE.MathUtils.clamp(
        THREE.MathUtils.mapLinear(speed, gearProfile.idealMax, gearProfile.speedCap, 1, 0.84),
        0.84,
        1
      );
    }

    return 1;
  }

  function getGearHint() {
    const gearProfile = GEAR_SETTINGS[gameState.gear];

    if (!gearProfile) {
      return "";
    }

    if (gameState.speed < gearProfile.idealMin - 1 && gameState.gear > 1) {
      return "Shift Down";
    }

    if (gameState.speed > gearProfile.idealMax + 1 && gameState.gear < 5) {
      return "Shift Up";
    }

    return "";
  }

  function getTrafficInteractionMetrics(trafficRecord) {
    if (!trafficRecord || !playerBody || !playerCarSystem?.bodyHalfExtents || !trafficRecord.halfExtents) {
      return null;
    }

    const playerHalfX = playerCarSystem.bodyHalfExtents.x;
    const playerHalfZ = playerCarSystem.bodyHalfExtents.z;
    const trafficHalfX = trafficRecord.halfExtents.x;
    const trafficHalfZ = trafficRecord.halfExtents.z;
    const xDistance = Math.abs(playerBody.position.x - trafficRecord.body.position.x);
    const zDistance = Math.abs(playerBody.position.z - trafficRecord.body.position.z);
    const xOverlap = playerHalfX + trafficHalfX - xDistance;
    const zOverlap = playerHalfZ + trafficHalfZ - zDistance;
    return {
      xDistance,
      zDistance,
      xOverlap,
      zOverlap,
      relativeZ: trafficRecord.body.position.z - playerBody.position.z
    };
  }

  function isMeaningfulCrash(metrics) {
    return (
      metrics &&
      metrics.xOverlap > COLLISION_OVERLAP_TOLERANCE_X &&
      metrics.zOverlap > COLLISION_OVERLAP_TOLERANCE_Z
    );
  }

  function updateHighSpeedEffects(speedKmh) {
    const flashRatio = THREE.MathUtils.clamp(
      (speedKmh - HIGH_SPEED_FLASH_START_KMH) / Math.max(SPEEDOMETER_MAX_KMH - HIGH_SPEED_FLASH_START_KMH, 1),
      0,
      1
    );
    const pulse = 0.5 + 0.5 * Math.sin(gameState.elapsed * (10 + flashRatio * 12));
    const overlayOpacity = flashRatio * (0.08 + 0.22 * pulse);
    const overlayScale = 1 + flashRatio * 0.018 + pulse * flashRatio * 0.018;

    if (speedFlash) {
      speedFlash.style.opacity = overlayOpacity.toFixed(3);
      speedFlash.style.transform = `scale(${overlayScale.toFixed(3)})`;
    }

    if (!speedometer) {
      return;
    }

    speedometer.style.borderColor = `rgba(214, 166, 94, ${(0.3 + flashRatio * 0.42).toFixed(3)})`;
    speedometer.style.boxShadow =
      `0 1rem 2.2rem rgba(150, 112, 58, ${(0.18 + flashRatio * 0.16).toFixed(3)}), ` +
      `0 0 ${(0.7 + flashRatio * 1.3 + pulse * flashRatio * 0.8).toFixed(2)}rem rgba(255, 248, 229, ${(flashRatio * 0.42).toFixed(3)})`;
    speedometer.style.transform = `translateY(${(-flashRatio * 4).toFixed(2)}px)`;
  }

  async function init() {
    startButton.disabled = true;
    startButton.textContent = "Loading Cars...";

    gameState.bestScore = loadBestScore();
    setupScene();
    addLights();
    createBackdrop();
    createRoad();
    initPhysics();
    createAudio();
    bindEvents();

    try {
      await Promise.all([createPlayerCar(), createTrafficSystem()]);
      startButton.disabled = false;
      startButton.textContent = "Start Engine";
      updateViewButton();
      updateSceneButton();
      updateLightsButton();
      applySceneMode(gameState.sceneMode, true);
    } catch (error) {
      console.error("Night Traffic Run could not finish loading the car systems.", error);
      startButton.textContent = "Cars Load Failed";
    }

    updateHud();
    updateCamera(1);
    renderScene();
  }

  // Scene setup and renderer configuration
  function setupScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xd7c5b0);
    scene.fog = new THREE.FogExp2(0xb58b63, 0.0068);

    camera = new THREE.PerspectiveCamera(CAMERA_BASE_FOV, window.innerWidth / window.innerHeight, 0.1, 260);
    camera.position.set(0, 7.2, PLAYER_Z + 15.5);
    smoothedLookTarget.set(0, PLAYER_Y + 1.2, PLAYER_Z - 12);

    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.62;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    environmentTarget = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.05);
    scene.environment = environmentTarget.texture;
    pmremGenerator.dispose();

    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.006,
      0.1,
      0.99
    );
    composer.addPass(bloomPass);

    clock = new THREE.Clock(false);
  }

  // Warm directional light and ambient fill keep the white-and-gold world readable.
  function addLights() {
    const hemi = new THREE.HemisphereLight(0xf0e4d2, 0xb68b61, 0.46);
    scene.add(hemi);
    sceneVisuals.hemi = hemi;

    const ambientLight = new THREE.AmbientLight(0xddc4a0, 0.18);
    scene.add(ambientLight);
    sceneVisuals.ambient = ambientLight;

    const directionalLight = new THREE.DirectionalLight(0xd3aa73, 0.74);
    directionalLight.position.set(10, 16, 14);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;
    scene.add(directionalLight);
    sceneVisuals.directional = directionalLight;
  }

  function createBackdrop() {
    const sun = new THREE.Mesh(
      new THREE.CircleGeometry(11, 48),
      new THREE.MeshBasicMaterial({
        color: 0xdab887,
        transparent: true,
        opacity: 0.14
      })
    );
    sun.position.set(0, 24, -150);
    scene.add(sun);
    sceneVisuals.sun = sun;

    const halo = new THREE.Mesh(
      new THREE.RingGeometry(11.4, 16.5, 64),
      new THREE.MeshBasicMaterial({
        color: 0xbc8f5d,
        transparent: true,
        opacity: 0.02,
        side: THREE.DoubleSide
      })
    );
    halo.position.copy(sun.position);
    scene.add(halo);
    sceneVisuals.halo = halo;

    const moon = new THREE.Group();
    moon.position.set(0, 24, -150);
    scene.add(moon);

    const moonBase = new THREE.Mesh(
      new THREE.CircleGeometry(7.5, 48),
      new THREE.MeshBasicMaterial({
        color: 0xf6f1e6,
        transparent: true,
        opacity: 0
      })
    );
    moon.add(moonBase);

    const moonCut = new THREE.Mesh(
      new THREE.CircleGeometry(7.2, 48),
      new THREE.MeshBasicMaterial({
        color: 0x46301e,
        transparent: true,
        opacity: 0
      })
    );
    moonCut.position.x = 3.45;
    moonCut.position.y = 0.05;
    moon.add(moonCut);
    sceneVisuals.moon = moon;

    const moonHalo = new THREE.Mesh(
      new THREE.RingGeometry(7.9, 11.8, 56),
      new THREE.MeshBasicMaterial({
        color: 0xe9dcc3,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide
      })
    );
    moonHalo.position.copy(moon.position);
    scene.add(moonHalo);
    sceneVisuals.moonHalo = moonHalo;

    for (let index = 0; index < 46; index += 1) {
      const starMaterial = new THREE.MeshBasicMaterial({
        color: 0xfff8e8,
        transparent: true,
        opacity: 0
      });
      const star = new THREE.Mesh(
        new THREE.CircleGeometry(0.12 + Math.random() * 0.18, 10),
        starMaterial
      );
      star.position.set(
        (Math.random() - 0.5) * 160,
        12 + Math.random() * 24,
        -148 - Math.random() * 16
      );
      star.userData.twinkleOffset = Math.random() * Math.PI * 2;
      scene.add(star);
      sceneVisuals.stars.push(star);
    }

    const duneMaterial = new THREE.MeshStandardMaterial({
      color: 0xb49269,
      roughness: 1,
      metalness: 0.02,
      envMapIntensity: 0.04
    });
    sceneVisuals.duneMaterials.push(duneMaterial);

    for (let index = 0; index < 8; index += 1) {
      const dune = new THREE.Mesh(
        new THREE.SphereGeometry(8 + index * 0.8, 18, 10),
        duneMaterial
      );
      dune.scale.y = 0.32;
      dune.position.set(-42 + index * 12, -0.8, -108 - (index % 3) * 14);
      dune.receiveShadow = true;
      scene.add(dune);
    }

    const towerMaterial = new THREE.MeshStandardMaterial({
      color: 0x8f673e,
      roughness: 0.84,
      metalness: 0.04,
      envMapIntensity: 0.03
    });
    sceneVisuals.towerMaterials.push(towerMaterial);

    for (let index = 0; index < 12; index += 1) {
      const tower = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 10 + (index % 4) * 5, 3.2),
        towerMaterial
      );
      const side = index % 2 === 0 ? -1 : 1;
      tower.position.set(side * (18 + (index % 5) * 8), tower.geometry.parameters.height / 2 - 0.2, -125 - index * 8);
      tower.castShadow = true;
      tower.receiveShadow = true;
      scene.add(tower);
    }
  }

  // Road tiles are recycled to create the endless illusion.
  function createRoad() {
    for (let index = 0; index < ROAD_TILE_COUNT; index += 1) {
      const tile = buildRoadTile();
      tile.position.z = -index * ROAD_TILE_LENGTH;
      roadTiles.push(tile);
      scene.add(tile);
    }
  }

  function buildRoadTile() {
    const tile = new THREE.Group();

    const shoulder = new THREE.Mesh(
      new THREE.PlaneGeometry(ROAD_WIDTH + 22, ROAD_TILE_LENGTH),
      new THREE.MeshStandardMaterial({
        color: 0xbca48a,
        roughness: 1,
        metalness: 0,
        envMapIntensity: 0.01
      })
    );
    sceneVisuals.shoulderMaterials.push(shoulder.material);
    shoulder.rotation.x = -Math.PI / 2;
    shoulder.position.y = -0.02;
    shoulder.receiveShadow = true;
    tile.add(shoulder);

    const road = new THREE.Mesh(
      new THREE.PlaneGeometry(ROAD_WIDTH, ROAD_TILE_LENGTH),
      new THREE.MeshStandardMaterial({
        color: 0x906640,
        roughness: 0.94,
        metalness: 0.02,
        envMapIntensity: 0.03
      })
    );
    sceneVisuals.roadMaterials.push(road.material);
    road.rotation.x = -Math.PI / 2;
    road.receiveShadow = true;
    tile.add(road);

    const edgeMaterial = new THREE.MeshBasicMaterial({ color: 0x6a4928 });
    sceneVisuals.edgeMaterials.push(edgeMaterial);
    const edgeGeometry = new THREE.BoxGeometry(0.18, 0.05, ROAD_TILE_LENGTH);
    const leftEdge = new THREE.Mesh(edgeGeometry, edgeMaterial);
    leftEdge.position.set(-ROAD_HALF_WIDTH + 0.12, 0.03, 0);
    tile.add(leftEdge);

    const rightEdge = leftEdge.clone();
    rightEdge.position.x = ROAD_HALF_WIDTH - 0.12;
    tile.add(rightEdge);

    const dashMaterial = new THREE.MeshBasicMaterial({
      color: 0xddcfb0,
      transparent: true,
      opacity: 0.38
    });
    sceneVisuals.dashMaterials.push(dashMaterial);
    const dashGeometry = new THREE.PlaneGeometry(0.28, 4.4);

    [-2, 2].forEach((x) => {
      for (let z = -ROAD_TILE_LENGTH / 2 + 7; z < ROAD_TILE_LENGTH / 2; z += 10) {
        const dash = new THREE.Mesh(dashGeometry, dashMaterial);
        dash.rotation.x = -Math.PI / 2;
        dash.position.set(x, 0.031, z);
        tile.add(dash);
      }
    });

    const postMaterial = new THREE.MeshStandardMaterial({
      color: 0x7f5835,
      roughness: 0.82,
      metalness: 0.05,
      envMapIntensity: 0.03
    });
    const lampMaterial = new THREE.MeshBasicMaterial({ color: 0xd5b87a });
    sceneVisuals.postMaterials.push(postMaterial);
    sceneVisuals.lampMaterials.push(lampMaterial);

    for (let z = -ROAD_TILE_LENGTH / 2 + 9; z < ROAD_TILE_LENGTH / 2; z += 12) {
      [-1, 1].forEach((side) => {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.25, 0.18), postMaterial);
        post.position.set(side * (ROAD_HALF_WIDTH + 1.55), 0.62, z);
        post.castShadow = true;
        tile.add(post);

        const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.24), lampMaterial);
        lamp.position.set(side * (ROAD_HALF_WIDTH + 1.55), 1.36, z);
        tile.add(lamp);
      });
    }

    return tile;
  }

  function applySceneMode(mode = gameState.sceneMode, immediate = false) {
    const nextMode = mode === "night" ? "night" : "day";
    const isNight = nextMode === "night";
    gameState.sceneMode = nextMode;
    sceneVisuals.mode = nextMode;

    if (scene) {
      scene.background.setHex(isNight ? 0x2f2218 : 0xd7c5b0);
      scene.fog.color.setHex(isNight ? 0x46301f : 0xb58b63);
      scene.fog.density = isNight ? 0.0088 : 0.0068;
    }

    if (renderer) {
      renderer.toneMappingExposure = isNight ? 0.54 : 0.62;
    }

    if (bloomPass) {
      bloomPass.strength = isNight ? 0.018 : 0.006;
      bloomPass.radius = isNight ? 0.18 : 0.1;
      bloomPass.threshold = isNight ? 0.9 : 0.99;
    }

    if (sceneVisuals.hemi) {
      sceneVisuals.hemi.color.setHex(isNight ? 0x8f6c48 : 0xf0e4d2);
      sceneVisuals.hemi.groundColor.setHex(isNight ? 0x312116 : 0xb68b61);
      sceneVisuals.hemi.intensity = isNight ? 0.18 : 0.46;
    }

    if (sceneVisuals.ambient) {
      sceneVisuals.ambient.color.setHex(isNight ? 0x6c5036 : 0xddc4a0);
      sceneVisuals.ambient.intensity = isNight ? 0.08 : 0.18;
    }

    if (sceneVisuals.directional) {
      sceneVisuals.directional.color.setHex(isNight ? 0xb8926d : 0xd3aa73);
      sceneVisuals.directional.intensity = isNight ? 0.28 : 0.74;
      sceneVisuals.directional.position.set(isNight ? -12 : 10, isNight ? 12 : 16, 14);
    }

    if (sceneVisuals.sun) {
      sceneVisuals.sun.material.color.setHex(isNight ? 0xc8ad87 : 0xdab887);
      sceneVisuals.sun.material.opacity = isNight ? 0 : 0.14;
      sceneVisuals.sun.scale.setScalar(isNight ? 0.82 : 1);
    }

    if (sceneVisuals.halo) {
      sceneVisuals.halo.material.color.setHex(isNight ? 0xa87c52 : 0xbc8f5d);
      sceneVisuals.halo.material.opacity = isNight ? 0 : 0.02;
      sceneVisuals.halo.scale.setScalar(isNight ? 0.82 : 1);
    }

    if (sceneVisuals.moon) {
      sceneVisuals.moon.children[0].material.opacity = isNight ? 0.88 : 0;
      sceneVisuals.moon.children[1].material.opacity = isNight ? 1 : 0;
      sceneVisuals.moon.children[1].material.color.setHex(isNight ? 0x46301e : 0xefe2c8);
      sceneVisuals.moon.scale.setScalar(isNight ? 1 : 0.88);
    }

    if (sceneVisuals.moonHalo) {
      sceneVisuals.moonHalo.material.opacity = isNight ? 0.14 : 0;
      sceneVisuals.moonHalo.scale.setScalar(isNight ? 1 : 0.88);
    }

    sceneVisuals.stars.forEach((star) => {
      star.material.opacity = isNight ? 0.48 : 0;
      star.visible = isNight;
    });

    sceneVisuals.duneMaterials.forEach((material) => {
      material.color.setHex(isNight ? 0x60462c : 0xb49269);
      material.envMapIntensity = isNight ? 0.03 : 0.04;
    });

    sceneVisuals.towerMaterials.forEach((material) => {
      material.color.setHex(isNight ? 0x46301f : 0x8f673e);
      material.envMapIntensity = isNight ? 0.02 : 0.03;
    });

    sceneVisuals.shoulderMaterials.forEach((material) => {
      material.color.setHex(isNight ? 0x52402c : 0xbca48a);
      material.envMapIntensity = isNight ? 0.02 : 0.01;
    });

    sceneVisuals.roadMaterials.forEach((material) => {
      material.color.setHex(isNight ? 0x412b1b : 0x906640);
      material.roughness = isNight ? 0.88 : 0.94;
      material.envMapIntensity = isNight ? 0.05 : 0.03;
    });

    sceneVisuals.edgeMaterials.forEach((material) => {
      material.color.setHex(isNight ? 0xb88f5d : 0x6a4928);
    });

    sceneVisuals.dashMaterials.forEach((material) => {
      material.color.setHex(isNight ? 0xe8d0a0 : 0xddcfb0);
      material.opacity = isNight ? 0.58 : 0.38;
    });

    sceneVisuals.postMaterials.forEach((material) => {
      material.color.setHex(isNight ? 0x6d492b : 0x7f5835);
      material.envMapIntensity = isNight ? 0.03 : 0.03;
    });

    sceneVisuals.lampMaterials.forEach((material) => {
      material.color.setHex(isNight ? 0xe3c88f : 0xd5b87a);
    });

    if (playerCarSystem) {
      playerCarSystem.setNightMode(isNight);
      playerCarSystem.setHeadlightMode(gameState.headlightMode, true);
    }

    updateSceneButton();
    updateLightsButton();
    updateHud();

    if (!immediate && !gameState.running && renderer && scene && camera) {
      renderScene();
    }
  }

  function toggleSceneMode() {
    applySceneMode(gameState.sceneMode === "day" ? "night" : "day");
  }

  function cycleHeadlightMode() {
    const modes = ["wide", "narrow", "low", "high"];
    const currentIndex = modes.indexOf(gameState.headlightMode);
    gameState.headlightMode = modes[(currentIndex + 1) % modes.length];

    if (playerCarSystem) {
      playerCarSystem.setHeadlightMode(gameState.headlightMode);
    }

    updateLightsButton();
    updateHud();

    if (!gameState.running && renderer && scene && camera) {
      renderScene();
    }
  }

  async function createPlayerCar() {
    playerCarSystem = new PlayerCarSystem({
      scene,
      world: physicsWorld,
      gsapInstance: gsap,
      ammoLib: window.Ammo || null,
      modelUrl: PLAYER_MODEL_PATH,
      roadHalfWidth: ROAD_HALF_WIDTH,
      targetWidth: 2.45,
      targetLength: 4.9,
      startPosition: new THREE.Vector3(0, 0, PLAYER_Z),
      forwardVisualSpeed: BASE_SPEED,
      stepWorldInternally: false
    });

    await playerCarSystem.loadCarModel();
    playerCarSystem.setGear(gameState.gear, true);
    playerCarSystem.setViewMode(gameState.viewMode);
    playerCarSystem.setHeadlightMode(gameState.headlightMode, true);
    playerCarSystem.setNightMode(gameState.sceneMode === "night");
    playerCar = playerCarSystem.carGroup;
    playerBody = playerCarSystem.physicsBody;
    playerBody.userData = playerBody.userData || {};
    playerBody.userData.kind = "player";
    playerBody.addEventListener("collide", handlePlayerCollision);
  }

  async function createTrafficSystem() {
    trafficCarSystem = new TrafficCarSystem({
      scene,
      world: physicsWorld,
      gsapInstance: gsap,
      modelUrl: TRAFFIC_MODEL_PATH,
      lanes: LANE_POSITIONS,
      spawnZ: TRAFFIC_SPAWN_Z,
      clearZ: TRAFFIC_CLEAR_Z,
      maxCars: MAX_TRAFFIC_CARS
    });

    await trafficCarSystem.init();
  }

  function initPhysics() {
    physicsWorld = new CANNON.World();
    physicsWorld.gravity.set(0, 0, 0);
    physicsWorld.solver.iterations = 10;
    physicsWorld.broadphase = new CANNON.NaiveBroadphase();
    physicsWorld.allowSleep = false;
  }

  function handlePlayerCollision(event) {
    if (!gameState.running) {
      return;
    }

    if (!event.body.userData || event.body.userData.kind !== "traffic") {
      return;
    }

    const trafficRecord = event.body.userData.record;
    const metrics = getTrafficInteractionMetrics(trafficRecord);

    if (!isMeaningfulCrash(metrics)) {
      return;
    }

    if (trafficRecord) {
      trafficRecord.collided = true;
    }

    endGame();
  }

  // Generated wav data keeps the project self-contained while still using Howler.
  function createAudio() {
    const engineSource = createWavDataUri(1, 22050, (time) => {
      const base = Math.sin(Math.PI * 2 * 55 * time);
      const harmonic = 0.45 * Math.sin(Math.PI * 2 * 110 * time);
      const pulse = 0.75 + 0.25 * Math.sin(Math.PI * 2 * 4 * time);
      const grit = 0.15 * Math.sin(Math.PI * 2 * 330 * time) * Math.sin(Math.PI * 2 * 24 * time);
      return (base + harmonic) * 0.18 * pulse + grit;
    });

    const crashSource = createWavDataUri(0.7, 22050, (time, sampleIndex) => {
      const decay = Math.exp(-5.8 * time);
      const frequency = 160 - time * 120;
      const tone = Math.sin(Math.PI * 2 * Math.max(frequency, 35) * time);
      const noise = pseudoNoise(sampleIndex) * 0.72;
      return decay * (noise + tone * 0.38);
    });

    const nearMissSource = createWavDataUri(0.24, 22050, (time) => {
      const envelope = Math.exp(-12 * time);
      const sweep = 900 - time * 420;
      const shimmer = Math.sin(Math.PI * 2 * 1400 * time) * 0.08;
      return envelope * (Math.sin(Math.PI * 2 * sweep * time) * 0.42 + shimmer);
    });

    const windSource = createWavDataUri(1, 22050, (time, sampleIndex) => {
      const bed = pseudoNoise(sampleIndex * 17) * 0.36;
      const hiss = pseudoNoise(sampleIndex * 29 + 41) * 0.22;
      const whoosh = Math.sin(Math.PI * 2 * 620 * time) * 0.06 + Math.sin(Math.PI * 2 * 980 * time) * 0.04;
      const pulse = 0.82 + 0.18 * Math.sin(Math.PI * 2 * 1.6 * time);
      return (bed + hiss + whoosh) * pulse;
    });

    const hornSource = createWavDataUri(0.62, 22050, (time) => {
      const envelope = Math.exp(-2.35 * time);
      const wobble = 1 + 0.012 * Math.sin(Math.PI * 2 * 8 * time);
      const toneA = Math.sin(Math.PI * 2 * 392 * wobble * time);
      const toneB = Math.sin(Math.PI * 2 * 466 * wobble * time);
      const octave = Math.sin(Math.PI * 2 * 784 * time) * 0.18;
      return (toneA * 0.68 + toneB * 0.56 + octave) * envelope * 0.72;
    });

    sounds.engine = new Howl({
      src: [engineSource],
      loop: true,
      volume: 0.12
    });

    sounds.wind = new Howl({
      src: [windSource],
      loop: true,
      volume: 0
    });

    sounds.crash = new Howl({
      src: [crashSource],
      volume: 0.55
    });

    sounds.nearMiss = new Howl({
      src: [nearMissSource],
      volume: 0.38
    });

    sounds.horn = new Howl({
      src: [hornSource],
      volume: 0.62
    });
  }

  function createWavDataUri(duration, sampleRate, sampleCallback) {
    const sampleCount = Math.floor(duration * sampleRate);
    const buffer = new ArrayBuffer(44 + sampleCount * 2);
    const view = new DataView(buffer);

    writeAscii(view, 0, "RIFF");
    view.setUint32(4, 36 + sampleCount * 2, true);
    writeAscii(view, 8, "WAVE");
    writeAscii(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeAscii(view, 36, "data");
    view.setUint32(40, sampleCount * 2, true);

    for (let index = 0; index < sampleCount; index += 1) {
      const time = index / sampleRate;
      const sample = THREE.MathUtils.clamp(sampleCallback(time, index), -1, 1);
      view.setInt16(44 + index * 2, sample * 32767, true);
    }

    return `data:audio/wav;base64,${arrayBufferToBase64(buffer)}`;
  }

  function writeAscii(view, offset, text) {
    for (let index = 0; index < text.length; index += 1) {
      view.setUint8(offset + index, text.charCodeAt(index));
    }
  }

  function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    let binary = "";

    for (let index = 0; index < bytes.length; index += chunkSize) {
      const chunk = bytes.subarray(index, index + chunkSize);
      binary += String.fromCharCode.apply(null, chunk);
    }

    return btoa(binary);
  }

  function pseudoNoise(sampleIndex) {
    const seed = Math.sin(sampleIndex * 12.9898) * 43758.5453123;
    return (seed - Math.floor(seed)) * 2 - 1;
  }

  function bindEvents() {
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", syncOrientationGuard);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    startButton.addEventListener("click", startGame);
    sceneButton.addEventListener("click", toggleSceneMode);
    lightsButton.addEventListener("click", cycleHeadlightMode);
    hornButton.addEventListener("click", playHorn);
    viewButton.addEventListener("click", toggleViewMode);
    touchGearDownButton?.addEventListener("click", () => setGear(gameState.gear - 1));
    touchGearUpButton?.addEventListener("click", () => setGear(gameState.gear + 1));

    bindHoldButton(touchAccelerateButton, "accelerate");
    bindHoldButton(touchBrakeButton, "brake");
    bindHoldButton(touchLeftButton, "left");
    bindHoldButton(touchRightButton, "right");

    document.addEventListener("visibilitychange", () => {
      if (!sounds.engine) {
        return;
      }

      if (document.hidden) {
        sounds.engine.pause();
        sounds.wind?.pause();
      } else if (gameState.running && !sounds.engine.playing()) {
        sounds.engine.play();
        if (sounds.wind && !sounds.wind.playing()) {
          sounds.wind.play();
        }
        updateEngineSound();
      }
    });

    syncOrientationGuard();
  }

  function isMobilePortraitBlocked() {
    return window.matchMedia("(pointer: coarse)").matches && window.innerHeight > window.innerWidth;
  }

  function syncOrientationGuard() {
    const blocked = isMobilePortraitBlocked();
    gameState.orientationBlocked = blocked;
    document.body.classList.toggle("mobile-portrait-blocked", blocked);

    if (orientationGuard) {
      orientationGuard.setAttribute("aria-hidden", blocked ? "false" : "true");
    }

    if (blocked) {
      if (gameState.running) {
        gameState.running = false;
        gameState.orientationResumePending = true;
      }

      resetDriveControls();
      sounds.engine?.pause();
      sounds.wind?.pause();
      return;
    }

    if (gameState.orientationResumePending && !gameState.ended) {
      gameState.running = true;
      gameState.orientationResumePending = false;
      clock?.getDelta();

      if (sounds.engine && !sounds.engine.playing()) {
        sounds.engine.play();
      }

      if (sounds.wind && !sounds.wind.playing()) {
        sounds.wind.play();
      }

      updateEngineSound();
    }
  }

  function bindHoldButton(button, control) {
    if (!button) {
      return;
    }

    const release = (event) => {
      if (event && typeof event.pointerId === "number" && button.hasPointerCapture?.(event.pointerId)) {
        button.releasePointerCapture(event.pointerId);
      }

      setDriveControlState("touch", control, false);
    };

    button.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      event.preventDefault();
      button.setPointerCapture?.(event.pointerId);
      setDriveControlState("touch", control, true);
    });

    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("pointerleave", release);
  }

  function getInputSourceState(source) {
    return source === "touch" ? touchInputState : keyboardInputState;
  }

  function setDriveControlState(source, control, isPressed, options = {}) {
    const sourceState = getInputSourceState(source);
    const wasActive = inputState[control];
    sourceState[control] = isPressed;

    inputState[control] = keyboardInputState[control] || touchInputState[control];

    if (control === "left" || control === "right") {
      const direction = control === "left" ? -1 : 1;

      if (isPressed) {
        inputState.laneHoldDirection = direction;

        if (options.triggerShift !== false && !wasActive && inputState[control]) {
          shiftPlayerLane(direction);
          inputState.laneHoldTimer = LANE_HOLD_INITIAL_DELAY;
        }
      } else {
        if (inputState.left && !inputState.right) {
          inputState.laneHoldDirection = -1;
        } else if (inputState.right && !inputState.left) {
          inputState.laneHoldDirection = 1;
        } else {
          inputState.laneHoldDirection = 0;
        }

        inputState.laneHoldTimer = 0;
      }
    }

    syncMobileDriveHud();
  }

  function resetDriveControls() {
    keyboardInputState.accelerate = false;
    keyboardInputState.brake = false;
    keyboardInputState.left = false;
    keyboardInputState.right = false;
    touchInputState.accelerate = false;
    touchInputState.brake = false;
    touchInputState.left = false;
    touchInputState.right = false;
    inputState.accelerate = false;
    inputState.brake = false;
    inputState.left = false;
    inputState.right = false;
    inputState.laneHoldDirection = 0;
    inputState.laneHoldTimer = 0;
    syncMobileDriveHud();
  }

  function syncMobileDriveHud() {
    touchLeftButton?.classList.toggle("is-active", inputState.left);
    touchRightButton?.classList.toggle("is-active", inputState.right);
    touchAccelerateButton?.classList.toggle("is-active", inputState.accelerate);
    touchBrakeButton?.classList.toggle("is-active", inputState.brake);
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    composer?.setSize(window.innerWidth, window.innerHeight);
    syncOrientationGuard();
    renderScene();
  }

  function onKeyDown(event) {
    const key = event.key;
    const lowerKey = key.toLowerCase();

    if (
      key === "ArrowLeft" ||
      key === "ArrowRight" ||
      key === "ArrowUp" ||
      key === "ArrowDown" ||
      /^[1-5]$/.test(key) ||
      lowerKey === "n" ||
      lowerKey === "l" ||
      lowerKey === "h" ||
      lowerKey === "v"
    ) {
      event.preventDefault();
    }

    if (lowerKey === "v") {
      toggleViewMode();
      return;
    }

    if (lowerKey === "h") {
      playHorn();
      return;
    }

    if (lowerKey === "n") {
      toggleSceneMode();
      return;
    }

    if (lowerKey === "l") {
      cycleHeadlightMode();
      return;
    }

    if (/^[1-5]$/.test(key)) {
      setGear(Number(key));
      return;
    }

    if (lowerKey === "r" && gameState.ended) {
      startGame();
      return;
    }

    if (!gameState.running) {
      return;
    }

    if (key === "ArrowUp") {
      setDriveControlState("keyboard", "accelerate", true);
      return;
    }

    if (key === "ArrowDown") {
      setDriveControlState("keyboard", "brake", true);
      return;
    }

    if (key === "ArrowLeft") {
      setDriveControlState("keyboard", "left", true, { triggerShift: !event.repeat });
      return;
    }

    if (key === "ArrowRight") {
      setDriveControlState("keyboard", "right", true, { triggerShift: !event.repeat });
    }
  }

  function onKeyUp(event) {
    if (event.key === "ArrowUp") {
      setDriveControlState("keyboard", "accelerate", false);
    } else if (event.key === "ArrowDown") {
      setDriveControlState("keyboard", "brake", false);
    } else if (event.key === "ArrowLeft") {
      setDriveControlState("keyboard", "left", false);
    } else if (event.key === "ArrowRight") {
      setDriveControlState("keyboard", "right", false);
    }
  }

  function startGame() {
    if (!playerCarSystem || !trafficCarSystem || !playerBody) {
      return;
    }

    if (gameState.orientationBlocked) {
      syncOrientationGuard();
      return;
    }

    resetGame();
    startScreen.classList.remove("overlay--active");
    gameOverScreen.classList.remove("overlay--active");
    gsap.killTweensOf("#game-over-screen .overlay-card");

    gameState.started = true;
    gameState.running = true;
    gameState.ended = false;

    sounds.crash.stop();

    if (!sounds.engine.playing()) {
      sounds.engine.play();
    }
    if (sounds.wind && !sounds.wind.playing()) {
      sounds.wind.play();
    }
    updateEngineSound();

    if (!gameState.loopStarted) {
      gameState.loopStarted = true;
      clock.start();
      clock.getDelta();
      animate();
    } else {
      clock.getDelta();
    }
  }

  function resetGame() {
    if (!trafficCarSystem || !playerCarSystem) {
      return;
    }

    gameState.running = false;
    gameState.ended = false;
    gameState.laneIndex = 1;
    gameState.targetPlayerX = LANE_POSITIONS[1];
    gameState.speed = BASE_SPEED;
    gameState.targetSpeed = BASE_SPEED;
    gameState.speedTimer = 0;
    gameState.elapsed = 0;
    gameState.distance = 0;
    gameState.score = 0;
    gameState.hornCooldown = 0;
    gameState.gear = 3;

    resetDriveControls();

    cameraEffects.shakeX = 0;
    cameraEffects.shakeY = 0;
    cameraEffects.zoom = 0;
    gsap.killTweensOf(cameraEffects);
    gsap.killTweensOf(camera);
    gsap.killTweensOf(scoreBanner);
    gsap.killTweensOf(bonusBurst);
    camera.fov = getBaseCameraFov();
    camera.updateProjectionMatrix();

    roadTiles.forEach((tile, index) => {
      tile.position.z = -index * ROAD_TILE_LENGTH;
    });

    trafficCarSystem.reset();
    resetPlayerPhysics();
    setGear(3, true);
    playerCarSystem.setTurnSignal("off", 0);
    playerCarSystem.setViewMode(gameState.viewMode);

    camera.position.set(0, 7.2, PLAYER_Z + 15.5);
    smoothedLookTarget.set(0, PLAYER_Y + 1.2, PLAYER_Z - 12);
    bonusBurst.style.opacity = "0";
    bonusBurst.style.transform = "translateX(-50%) translateY(0.4rem) scale(0.92)";
    finalScore.textContent = "Score: 0";
    finalBest.textContent = `Best Score: ${gameState.bestScore.toLocaleString()}`;
    updateHud();
    renderScene();
  }

  function resetPlayerPhysics() {
    playerBody.position.set(0, playerCarSystem.bodyHalfHeight, PLAYER_Z);
    playerBody.velocity.set(0, 0, 0);
    playerBody.force.set(0, 0, 0);
    playerBody.angularVelocity.set(0, 0, 0);
    playerBody.quaternion.set(0, 0, 0, 1);
    playerCarSystem.syncAfterPhysics(0, BASE_SPEED);
  }

  // Main game loop
  function animate() {
    gameState.animationId = requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.05);

    if (gameState.orientationBlocked) {
      updateHud();
      renderScene();
      return;
    }

    if (gameState.running) {
      gameState.elapsed += delta;
      gameState.hornCooldown = Math.max(0, gameState.hornCooldown - delta);

      updateLaneHold(delta);
      updateSpeed(delta);
      movePlayer(delta);
      updateTraffic(delta);
      stepPhysics(delta);
      syncPhysics(delta);
      moveRoad(delta);
      updateScore(delta);
      checkNearMisses();
      updateEngineSound();
    }

    updateCamera(delta || 0.016);
    updateHud();
    renderScene();
  }

  function movePlayer(delta) {
    playerCarSystem.updateCar(delta, {
      targetX: gameState.targetPlayerX,
      forwardSpeed: gameState.speed,
      accelerating: inputState.accelerate,
      braking: inputState.brake,
      stepWorld: false
    });
  }

  function updateLaneHold(delta) {
    if (inputState.laneHoldDirection === 0) {
      return;
    }

    if (inputState.laneHoldDirection < 0 && !inputState.left) {
      inputState.laneHoldDirection = inputState.right ? 1 : 0;
      inputState.laneHoldTimer = 0;
      return;
    }

    if (inputState.laneHoldDirection > 0 && !inputState.right) {
      inputState.laneHoldDirection = inputState.left ? -1 : 0;
      inputState.laneHoldTimer = 0;
      return;
    }

    inputState.laneHoldTimer -= delta;

    while (inputState.laneHoldTimer <= 0) {
      const moved = shiftPlayerLane(inputState.laneHoldDirection);
      inputState.laneHoldTimer += LANE_HOLD_REPEAT_DELAY;

      if (!moved) {
        inputState.laneHoldTimer = LANE_HOLD_REPEAT_DELAY;
        break;
      }
    }
  }

  function shiftPlayerLane(direction) {
    const nextLane = THREE.MathUtils.clamp(gameState.laneIndex + direction, 0, LANE_POSITIONS.length - 1);

    if (nextLane === gameState.laneIndex) {
      return false;
    }

    gameState.laneIndex = nextLane;
    gameState.targetPlayerX = LANE_POSITIONS[nextLane];
    playerCarSystem.setTurnSignal(direction < 0 ? "left" : "right", 0.86);
    return true;
  }

  // Difficulty keeps rising, but ArrowUp and ArrowDown let the player push above or below the flow.
  function updateSpeed(delta) {
    gameState.speedTimer += delta;

    if (gameState.speedTimer >= SPEED_STEP_INTERVAL) {
      gameState.targetSpeed = Math.min(gameState.targetSpeed + SPEED_STEP, MAX_SPEED);
      gameState.speedTimer = 0;
    }

    const gearProfile = GEAR_SETTINGS[gameState.gear];
    const driveFactor = getGearDriveFactor(gameState.speed, gearProfile);
    const timeBoost = Math.min(6.2, gameState.elapsed * 0.18);
    const flowTarget = Math.min(Math.max(gameState.targetSpeed, BASE_SPEED + timeBoost), MAX_SPEED);
    const cruiseTarget = Math.min(flowTarget * THREE.MathUtils.lerp(0.88, 1.02, driveFactor), gearProfile.speedCap);
    let desiredSpeed = cruiseTarget;
    const fifthGearPull = gameState.gear === 5 && inputState.accelerate && !inputState.brake;

    if (inputState.accelerate && !inputState.brake) {
      desiredSpeed = Math.min(
        cruiseTarget + ACCELERATION_BOOST * gearProfile.accelMultiplier * driveFactor,
        gearProfile.speedCap
      );

      if (fifthGearPull) {
        const topGearBlend = THREE.MathUtils.clamp(
          THREE.MathUtils.mapLinear(gameState.speed, GEAR_SETTINGS[4].idealMax, gearProfile.speedCap, 0.58, 1),
          0.58,
          1
        );
        desiredSpeed = THREE.MathUtils.lerp(desiredSpeed, gearProfile.speedCap, topGearBlend);
      }
    } else if (inputState.brake && !inputState.accelerate) {
      desiredSpeed = Math.max(MIN_SPEED, cruiseTarget - BRAKE_REDUCTION * gearProfile.brakeMultiplier);
    }

    const responsiveness = inputState.brake
      ? 4.8
      : inputState.accelerate
        ? 2.6 + gearProfile.accelMultiplier * (0.85 + driveFactor * 0.55) + (fifthGearPull ? 1.55 : 0)
        : 2.6;
    gameState.speed = THREE.MathUtils.damp(gameState.speed, desiredSpeed, responsiveness, delta);
    gameState.speed = Math.min(gameState.speed, gearProfile.speedCap, MAX_SPEED);
  }

  function updateScore(delta) {
    gameState.distance += gameState.speed * delta * 2.35;
    gameState.score += delta * (SCORE_RATE + gameState.speed * 1.65);
    updateBestScore();
  }

  function moveRoad(delta) {
    const movement = gameState.speed * delta;

    roadTiles.forEach((tile) => {
      tile.position.z += movement;

      if (tile.position.z > ROAD_TILE_LENGTH) {
        tile.position.z -= ROAD_TILE_LENGTH * ROAD_TILE_COUNT;
      }
    });
  }

  function updateTraffic(delta) {
    trafficCarSystem.updateBeforeStep(delta, {
      speed: gameState.speed,
      elapsed: gameState.elapsed
    });
  }

  function stepPhysics(delta) {
    physicsWorld.step(PHYSICS_STEP, delta, 3);
  }

  function syncPhysics(delta) {
    playerCarSystem.syncAfterPhysics(delta, gameState.speed);
    trafficCarSystem.syncAfterStep(delta, gameState.elapsed);
  }

  function checkNearMisses() {
    const speedKmh = gameState.speed * 8.6;
    const laneSnapIntensity = THREE.MathUtils.clamp(
      Math.abs(playerBody.velocity.x) / Math.max(playerCarSystem.options.maxLateralSpeed, 0.001),
      0,
      1
    );

    if (speedKmh < NEAR_MISS_SPEED_MIN_KMH) {
      return;
    }

    for (let index = 0; index < trafficCarSystem.activeCars.length; index += 1) {
      const trafficCar = trafficCarSystem.activeCars[index];

      if (trafficCar.nearMissed || trafficCar.collided) {
        continue;
      }

      const metrics = getTrafficInteractionMetrics(trafficCar);

      if (!metrics || isMeaningfulCrash(metrics)) {
        continue;
      }

      if (
        metrics.relativeZ > -NEAR_MISS_PASS_WINDOW_BEHIND &&
        metrics.relativeZ < NEAR_MISS_THRESHOLD_Z &&
        metrics.xDistance < NEAR_MISS_THRESHOLD_X &&
        metrics.zDistance < NEAR_MISS_THRESHOLD_Z
      ) {
        const closeness = (NEAR_MISS_THRESHOLD_X - metrics.xDistance) + (NEAR_MISS_THRESHOLD_Z - metrics.zDistance);
        const speedFactor = THREE.MathUtils.clamp(
          (speedKmh - NEAR_MISS_SPEED_MIN_KMH) / Math.max(SPEEDOMETER_MAX_KMH - NEAR_MISS_SPEED_MIN_KMH, 1),
          0,
          1
        );
        const speedBonus = Math.round(speedFactor * 240);
        const swerveBonus = Math.round(laneSnapIntensity * 95);
        const bonus = NEAR_MISS_BONUS + Math.max(60, Math.round(closeness * 54 + speedBonus + swerveBonus));
        const intensity = THREE.MathUtils.clamp(0.85 + closeness * 0.1 + speedFactor * 0.45 + laneSnapIntensity * 0.2, 0.85, 1.55);

        trafficCar.nearMissed = true;
        gameState.score += bonus;
        updateBestScore();
        triggerNearMissFeedback(bonus, intensity);
      }
    }
  }

  // Chase and cockpit views share the same camera effects but different anchor points.
  function updateCamera(delta) {
    if (!playerCarSystem) {
      return;
    }

    playerCarSystem.getCameraPose(gameState.viewMode, tempCameraPosition, tempCameraTarget);
    const lateralVelocity = playerBody ? playerBody.velocity.x : 0;

    if (gameState.viewMode === "cockpit") {
      tempCameraPosition.x += cameraEffects.shakeX * 0.22;
      tempCameraPosition.y += cameraEffects.shakeY * 0.16;
      tempCameraPosition.z += cameraEffects.zoom * 0.08;
      tempCameraTarget.x += cameraEffects.shakeX * 0.16;
      tempCameraTarget.y += cameraEffects.shakeY * 0.1;
      tempCameraPosition.x += lateralVelocity * 0.024;
      tempCameraPosition.y += Math.abs(lateralVelocity) * 0.004;
      tempCameraTarget.x += lateralVelocity * 0.08;
    } else {
      tempCameraPosition.x += cameraEffects.shakeX;
      tempCameraPosition.y += cameraEffects.shakeY;
      tempCameraPosition.z += cameraEffects.zoom;
      tempCameraTarget.x += cameraEffects.shakeX * 0.22;
      tempCameraTarget.y += cameraEffects.shakeY * 0.18;
      tempCameraTarget.x += lateralVelocity * 0.02;
    }

    const positionLerp = gameState.viewMode === "cockpit" ? 1 - Math.pow(0.00003, delta) : 1 - Math.pow(0.00012, delta);
    const targetLerp = gameState.viewMode === "cockpit" ? 1 - Math.pow(0.000045, delta) : 1 - Math.pow(0.0002, delta);

    camera.position.lerp(tempCameraPosition, positionLerp);
    smoothedLookTarget.lerp(tempCameraTarget, targetLerp);
    camera.lookAt(smoothedLookTarget);
  }

  function triggerNearMissFeedback(bonus, intensity = 1) {
    sounds.nearMiss.stop();
    sounds.nearMiss.play();
    shakeCamera(0.14 * intensity, Math.round(5 + intensity * 3), 0.03 + intensity * 0.006);
    pulseCameraZoom(-1.05 * intensity, 56.8 - intensity * 1.4, 0.26 + intensity * 0.08);
    showBonusBurst(`+${bonus} NEAR MISS`, intensity);
  }

  function triggerCrashFeedback() {
    gsap.killTweensOf(cameraEffects);
    gsap.killTweensOf(camera);
    cameraEffects.shakeX = 0;
    cameraEffects.shakeY = 0;
    cameraEffects.zoom = 0;
    shakeCamera(0.52, 12, 0.04);
    pulseCameraZoom(-2.15, 54.5, 0.55);
  }

  function showBonusBurst(text, intensity = 1) {
    bonusBurst.textContent = text;
    gsap.killTweensOf(bonusBurst);
    gsap.killTweensOf(scoreBanner);

    const peakScale = 1 + intensity * 0.1;
    const riseDistance = -18 - intensity * 8;

    gsap.fromTo(
      bonusBurst,
      { opacity: 0, y: 14, scale: 0.92 },
      { opacity: 1, y: riseDistance, scale: peakScale, duration: 0.18 + intensity * 0.04, ease: "power2.out" }
    );

    gsap.to(bonusBurst, {
      opacity: 0,
      y: -36 - intensity * 6,
      scale: peakScale + 0.04,
      duration: 0.4 + intensity * 0.08,
      delay: 0.3,
      ease: "power2.in"
    });

    gsap.fromTo(
      scoreBanner,
      { scale: 1 },
      { scale: 1.05 + intensity * 0.05, duration: 0.14, yoyo: true, repeat: 1, ease: "power2.out" }
    );
  }

  function shakeCamera(intensity, steps, duration) {
    gsap.killTweensOf(cameraEffects, "shakeX");
    gsap.killTweensOf(cameraEffects, "shakeY");

    const timeline = gsap.timeline({
      onComplete: () => {
        cameraEffects.shakeX = 0;
        cameraEffects.shakeY = 0;
      }
    });

    for (let index = 0; index < steps; index += 1) {
      const direction = index % 2 === 0 ? 1 : -1;
      timeline.to(cameraEffects, {
        shakeX: intensity * direction,
        shakeY: intensity * 0.65 * -direction,
        duration,
        ease: "sine.inOut"
      });
    }

    timeline.to(cameraEffects, {
      shakeX: 0,
      shakeY: 0,
      duration,
      ease: "sine.out"
    });
  }

  function pulseCameraZoom(zoomAmount, targetFov, duration) {
    gsap.killTweensOf(cameraEffects, "zoom");
    gsap.killTweensOf(camera);
    cameraEffects.zoom = zoomAmount;

    gsap.to(cameraEffects, {
      zoom: 0,
      duration,
      ease: "power2.out"
    });

    gsap.to(camera, {
      fov: targetFov,
      duration: duration * 0.5,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
      onUpdate: () => camera.updateProjectionMatrix(),
      onComplete: () => {
        camera.fov = getBaseCameraFov();
        camera.updateProjectionMatrix();
      }
    });
  }

  function updateEngineSound() {
    if (!sounds.engine) {
      return;
    }

    const gearProfile = GEAR_SETTINGS[gameState.gear];
    const driveFactor = getGearDriveFactor(gameState.speed, gearProfile);
    const speedKmh = gameState.speed * 8.6;
    const usableBand = Math.max(gearProfile.idealMax - gearProfile.idealMin, 0.001);
    const bandRatio = THREE.MathUtils.clamp((gameState.speed - gearProfile.idealMin) / usableBand, 0, 1.15);
    const rate = THREE.MathUtils.clamp(
      0.82 + bandRatio * 0.28 + (gameState.gear - 1) * 0.035 + (1 - driveFactor) * 0.05,
      0.82,
      1.42
    );
    sounds.engine.rate(rate);
    sounds.engine.volume(0.1 + THREE.MathUtils.clamp((gameState.speed - MIN_SPEED) * 0.0023 + (1 - driveFactor) * 0.015, 0, 0.08));

    if (sounds.wind) {
      const windRatio = THREE.MathUtils.clamp((speedKmh - 350) / 150, 0, 1);
      sounds.wind.rate(THREE.MathUtils.clamp(0.88 + windRatio * 0.44, 0.88, 1.34));
      sounds.wind.volume(windRatio * 0.34);
    }
  }

  function playHorn() {
    if (!sounds.horn || gameState.hornCooldown > 0) {
      return;
    }

    gameState.hornCooldown = HORN_COOLDOWN;
    sounds.horn.stop();
    sounds.horn.play();

    gsap.fromTo(
      hornButton,
      { scale: 1 },
      { scale: 1.08, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.out" }
    );
  }

  function setGear(gear, immediate = false) {
    const nextGear = THREE.MathUtils.clamp(Math.round(gear), 1, 5);

    if (!immediate && nextGear === gameState.gear) {
      return;
    }

    gameState.gear = nextGear;

    if (playerCarSystem) {
      playerCarSystem.setGear(nextGear, immediate);
    }

    if (!immediate) {
      gsap.fromTo(
        speedometerGear,
        { scale: 0.92, opacity: 0.72 },
        { scale: 1.08, opacity: 1, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out" }
      );
    }

    if (!gameState.running) {
      updateHud();

      if (renderer && scene && camera) {
        renderScene();
      }
    }
  }

  function toggleViewMode() {
    gameState.viewMode = gameState.viewMode === "chase" ? "cockpit" : "chase";

    if (playerCarSystem) {
      playerCarSystem.setViewMode(gameState.viewMode);
      playerCarSystem.getCameraPose(gameState.viewMode, tempCameraPosition, tempCameraTarget);
      camera.position.copy(tempCameraPosition);
      smoothedLookTarget.copy(tempCameraTarget);
      camera.lookAt(smoothedLookTarget);
    }

    camera.fov = getBaseCameraFov();
    camera.updateProjectionMatrix();
    cameraEffects.zoom = 0;

    updateViewButton();
    updateHud();

    if (!gameState.running && renderer && scene && camera) {
      renderScene();
    }
  }

  function updateViewButton() {
    viewButton.textContent = gameState.viewMode === "chase" ? "View: Chase" : "View: Cockpit";
  }

  function endGame() {
    if (gameState.ended) {
      return;
    }

    gameState.running = false;
    gameState.ended = true;

    inputState.accelerate = false;
    inputState.brake = false;
    inputState.left = false;
    inputState.right = false;
    inputState.laneHoldDirection = 0;
    inputState.laneHoldTimer = 0;

    playerBody.velocity.set(0, 0, 0);
    trafficCarSystem.activeCars.forEach((trafficCar) => {
      trafficCar.body.velocity.set(0, 0, 0);
      trafficCar.collided = true;
    });

    updateBestScore();
    sounds.engine.stop();
    sounds.wind?.stop();
    sounds.crash.stop();
    sounds.crash.play();
    triggerCrashFeedback();

    finalScore.textContent = `Score: ${Math.floor(gameState.score).toLocaleString()}`;
    finalBest.textContent = `Best Score: ${gameState.bestScore.toLocaleString()}`;
    gameOverScreen.classList.add("overlay--active");

    gsap.fromTo(
      "#game-over-screen .overlay-card",
      { y: 26, opacity: 0.2, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
    );
  }

  function updateHud() {
    const speedKmh = Math.min(Math.round(gameState.speed * 8.6), SPEEDOMETER_MAX_KMH);
    const speedRatio = THREE.MathUtils.clamp(speedKmh / SPEEDOMETER_MAX_KMH, 0, 1);
    const needleAngle = -120 + speedRatio * 240;
    const viewLabel = gameState.viewMode === "cockpit" ? "Cockpit" : "Chase";
    const sceneLabel = gameState.sceneMode === "night" ? `Night ${getHeadlightLabel()}` : "Day";
    let driveLabel = getGearHint() || "Cruise";

    if (inputState.brake && !inputState.accelerate) {
      driveLabel = "Brake";
    } else if (inputState.accelerate && !inputState.brake) {
      driveLabel = getGearHint() || "Throttle";
    }

    speedValue.textContent = `${speedKmh} km/h`;
    distanceValue.textContent = `${Math.floor(gameState.distance).toLocaleString()} m`;
    scoreValue.textContent = Math.floor(gameState.score).toLocaleString();
    bestScoreValue.textContent = gameState.bestScore.toLocaleString();
    speedometerValue.textContent = String(speedKmh);
    speedometerGear.textContent = `G${gameState.gear}`;
    if (mobileGearValue) {
      mobileGearValue.textContent = `G${gameState.gear}`;
    }
    speedometerNeedle.style.transform = `translateX(-50%) rotate(${needleAngle}deg)`;
    speedometerMode.textContent = `${viewLabel} ${driveLabel} • ${sceneLabel}`;
    updateHighSpeedEffects(speedKmh);
  }

  function updateNightSky(delta) {
    if (gameState.sceneMode !== "night" || !sceneVisuals.stars.length) {
      return;
    }

    for (let index = 0; index < sceneVisuals.stars.length; index += 1) {
      const star = sceneVisuals.stars[index];
      const pulse = 0.45 + 0.55 * Math.sin(gameState.elapsed * (1.8 + (index % 5) * 0.27) + star.userData.twinkleOffset);
      star.material.opacity = 0.18 + pulse * 0.56;
      const scale = 0.85 + pulse * 0.35;
      star.scale.setScalar(scale);
    }
  }

  function updateBestScore() {
    const currentScore = Math.floor(gameState.score);

    if (currentScore > gameState.bestScore) {
      gameState.bestScore = currentScore;
      saveBestScore(gameState.bestScore);
    }
  }

  function loadBestScore() {
    try {
      return Number.parseInt(localStorage.getItem(BEST_SCORE_STORAGE_KEY) || "0", 10) || 0;
    } catch (error) {
      return 0;
    }
  }

  function saveBestScore(value) {
    try {
      localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(value));
    } catch (error) {
      // Ignore storage issues and keep the current session playable.
    }
  }
})();
