import "./style.css";

import * as THREE from "three";
import * as CANNON from "cannon-es";
import gsap from "gsap";
import { Howler } from "howler";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

import { createCarModelUrl } from "./carGltf.js";
import { GAME_MODES, generateProceduralLevel } from "./levels.js";
import { createSoundBank } from "./soundBank.js";

const FIXED_TIME_STEP = 1 / 60;
const SAFE_COLLISION_TAGS = new Set(["ground", "guide"]);
const PLAY_CAMERA_RIG = {
  distance: 8.2,
  height: 4.7,
  lookAhead: 2.4,
  lookHeight: 1.2,
};
const BRIEFING_CAMERA_RIG = {
  distance: 16.5,
  height: 10.8,
  lookAhead: 0.8,
  lookHeight: 0.95,
};
const PROGRESS_STORAGE_KEY = "precision-driving-lab-progress-v1";
const DEFAULT_MODE_ID = GAME_MODES[0]?.id ?? "normal";

const canvas = document.querySelector("#game");
const briefingScreenEl = document.querySelector("#briefing-screen");
const startDriveButtonEl = document.querySelector("#start-drive");
const levelJumpInputEl = document.querySelector("#level-jump-input");
const jumpLevelButtonEl = document.querySelector("#jump-level");
const reloadLevelButtonEl = document.querySelector("#reload-level");
const resetProgressButtonEl = document.querySelector("#reset-progress");
const progressSummaryEl = document.querySelector("#progress-summary");
const transitionOverlayEl = document.querySelector("#transition-overlay");
const transitionKickerEl = document.querySelector("#transition-kicker");
const transitionTitleEl = document.querySelector("#transition-title");
const transitionSubtitleEl = document.querySelector("#transition-subtitle");
const levelNameEl = document.querySelector("#level-name");
const levelLabelEl = document.querySelector("#level-label");
const difficultyLabelEl = document.querySelector("#difficulty-label");
const modeLabelEl = document.querySelector("#mode-label");
const speedLabelEl = document.querySelector("#speed-label");
const goalLabelEl = document.querySelector("#goal-label");
const techniqueLabelEl = document.querySelector("#technique-label");
const instructionsEl = document.querySelector("#instructions");
const statusBannerEl = document.querySelector("#status-banner");
const modeButtonsEl = document.querySelector("#mode-buttons");
const touchControlsEl = document.querySelector("#touch-controls");
const orientationGuardEl = document.querySelector("#orientation-guard");

const ui = {
  modeButtons: [...modeButtonsEl.querySelectorAll(".mode-button")],
  touchButtons: [...touchControlsEl.querySelectorAll(".touch-button")],
  briefingCards: [...briefingScreenEl.querySelectorAll(".hud-card")],
};
const clock = new THREE.Clock();
let accumulator = 0;

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.86;

const scene = new THREE.Scene();
scene.background = new THREE.Color("#b5cad8");
scene.fog = new THREE.Fog("#afc4d2", 30, 88);

const camera = new THREE.PerspectiveCamera(
  58,
  window.innerWidth / window.innerHeight,
  0.1,
  180
);
camera.position.set(0, 5, -8);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.055,
  0.32,
  0.96
);
composer.addPass(renderPass);
composer.addPass(bloomPass);

const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.42;

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -12, 0),
});
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = false;
world.defaultContactMaterial.friction = 0.68;
world.defaultContactMaterial.restitution = 0.02;

const asphaltTexture = createAsphaltTexture();
const sharedMaterials = {
  asphalt: new THREE.MeshStandardMaterial({
    color: "#48535d",
    roughness: 0.94,
    metalness: 0.05,
    map: asphaltTexture,
  }),
  whiteStripe: new THREE.MeshStandardMaterial({
    color: "#faf6ea",
    roughness: 0.88,
    metalness: 0.08,
  }),
  yellowStripe: new THREE.MeshStandardMaterial({
    color: "#f0d06a",
    roughness: 0.8,
    metalness: 0.08,
    emissive: new THREE.Color("#f0d06a"),
    emissiveIntensity: 0.035,
  }),
  wall: new THREE.MeshStandardMaterial({
    color: "#8d9498",
    roughness: 0.95,
    metalness: 0.04,
  }),
  cone: new THREE.MeshStandardMaterial({
    color: "#ef7b29",
    roughness: 0.78,
    metalness: 0.08,
  }),
  coneBand: new THREE.MeshStandardMaterial({
    color: "#fff7ed",
    roughness: 0.82,
    metalness: 0.04,
  }),
  slotGuide: new THREE.MeshPhysicalMaterial({
    color: "#f0d06a",
    transparent: true,
    opacity: 0.13,
    roughness: 0.78,
    transmission: 0,
    thickness: 0.12,
    metalness: 0.04,
    emissiveIntensity: 0.04,
  }),
  slotOutline: new THREE.LineBasicMaterial({
    color: "#f7dfa3",
  }),
  parkedWheel: new THREE.MeshStandardMaterial({
    color: "#15181d",
    roughness: 0.88,
    metalness: 0.15,
  }),
  glass: new THREE.MeshPhysicalMaterial({
    color: "#7ccfe0",
    roughness: 0.55,
    metalness: 0.04,
    transparent: true,
    opacity: 0.42,
    transmission: 0.08,
    clearcoat: 0.18,
  }),
};
const smokeTexture = createSmokeTexture();

const sharedGeometries = {
  box: new THREE.BoxGeometry(1, 1, 1),
  wheel: new THREE.CylinderGeometry(0.38, 0.38, 0.28, 18),
  cone: new THREE.CylinderGeometry(0.06, 0.36, 0.86, 12),
  stripeBox: new THREE.BoxGeometry(1, 1, 1),
};
sharedGeometries.wheel.rotateZ(Math.PI / 2);

const root = new THREE.Group();
const levelRoot = new THREE.Group();
const effectsRoot = new THREE.Group();
const tireMarkRoot = new THREE.Group();
const smokeRoot = new THREE.Group();
effectsRoot.add(tireMarkRoot);
effectsRoot.add(smokeRoot);
scene.add(root);
scene.add(levelRoot);
scene.add(effectsRoot);

const state = {
  currentModeId: "normal",
  currentLevel: 1,
  currentLevelConfig: null,
  progress: createDefaultProgress(),
  levelBodies: [],
  levelDisposables: [],
  car: null,
  carBody: null,
  runActive: false,
  briefingVisible: true,
  introReady: false,
  parkingZone: null,
  parkingGuide: null,
  boundaryBodies: [],
  collisionArmedAt: 0,
  orientationBlocked: false,
  restartTween: null,
  successTween: null,
  statusClearTween: null,
  startTween: null,
  briefingTween: null,
  transitionTween: null,
  lastCollisionAt: 0,
  soundUnlocked: false,
  enginePlaying: false,
  skidPlaying: false,
  timeScale: 1,
  timeScaleTween: null,
  driftMarks: [],
  smokePuffs: [],
  touchCounts: {
    forward: 0,
    reverse: 0,
    left: 0,
    right: 0,
    drift: 0,
    brake: 0,
  },
  keyboardInput: {
    forward: false,
    reverse: false,
    left: false,
    right: false,
    drift: false,
    brake: false,
  },
  touchInput: {
    forward: false,
    reverse: false,
    left: false,
    right: false,
    drift: false,
    brake: false,
  },
  drift: {
    active: false,
    recentUntil: 0,
    usedThisRun: false,
    commitArmed: false,
    slowMoActive: false,
    lastMarkAt: 0,
    lastSmokeAt: 0,
  },
  cameraRig: {
    distance: BRIEFING_CAMERA_RIG.distance,
    height: BRIEFING_CAMERA_RIG.height,
    lookAhead: BRIEFING_CAMERA_RIG.lookAhead,
    lookHeight: BRIEFING_CAMERA_RIG.lookHeight,
    shake: 0,
  },
};

const temp = {
  carPosition: new THREE.Vector3(),
  forward: new THREE.Vector3(),
  right: new THREE.Vector3(),
  desiredCamera: new THREE.Vector3(),
  desiredLook: new THREE.Vector3(),
  currentLook: new THREE.Vector3(),
  rearLeftWheel: new THREE.Vector3(),
  rearRightWheel: new THREE.Vector3(),
  box: new THREE.Box3(),
  vector2: new THREE.Vector2(),
};

function createDefaultModeProgress() {
  return {
    currentLevel: 1,
    highestUnlockedLevel: 1,
  };
}

function createDefaultProgress() {
  return {
    activeModeId: DEFAULT_MODE_ID,
    byMode: Object.fromEntries(
      GAME_MODES.map((mode) => [mode.id, createDefaultModeProgress()])
    ),
  };
}

function normalizeProgress(rawProgress) {
  const progress = createDefaultProgress();
  if (!rawProgress || typeof rawProgress !== "object") {
    return progress;
  }

  if (GAME_MODES.some((mode) => mode.id === rawProgress.activeModeId)) {
    progress.activeModeId = rawProgress.activeModeId;
  }

  GAME_MODES.forEach((mode) => {
    const rawModeProgress = rawProgress.byMode?.[mode.id];
    const highestUnlockedLevel = Math.max(
      1,
      Math.round(Number(rawModeProgress?.highestUnlockedLevel) || 1)
    );
    const currentLevel = THREE.MathUtils.clamp(
      Math.round(Number(rawModeProgress?.currentLevel) || 1),
      1,
      highestUnlockedLevel
    );

    progress.byMode[mode.id] = {
      currentLevel,
      highestUnlockedLevel,
    };
  });

  return progress;
}

function loadSavedProgress() {
  try {
    const saved = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    return saved ? normalizeProgress(JSON.parse(saved)) : createDefaultProgress();
  } catch (error) {
    console.warn("Unable to read local progress, using a fresh save.", error);
    return createDefaultProgress();
  }
}

function persistProgress() {
  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state.progress));
  } catch (error) {
    console.warn("Unable to write local progress.", error);
  }
}

function getModeProgress(modeId = state.currentModeId) {
  if (!state.progress?.byMode?.[modeId]) {
    state.progress = normalizeProgress(state.progress);
  }

  return state.progress.byMode[modeId];
}

function updateModeProgress(modeId, patch = {}) {
  const currentProgress = getModeProgress(modeId);
  const highestUnlockedLevel = Math.max(
    1,
    Math.round(
      Number(patch.highestUnlockedLevel ?? currentProgress.highestUnlockedLevel) || 1
    )
  );
  const requestedCurrentLevel = Math.max(
    1,
    Math.round(Number(patch.currentLevel ?? currentProgress.currentLevel) || 1)
  );

  state.progress.byMode[modeId] = {
    currentLevel: THREE.MathUtils.clamp(
      requestedCurrentLevel,
      1,
      highestUnlockedLevel
    ),
    highestUnlockedLevel,
  };
  state.progress.activeModeId = modeId;
  persistProgress();
  return state.progress.byMode[modeId];
}

function getSelectedUnlockedLevel() {
  const modeProgress = getModeProgress();
  const requestedLevel = Math.round(
    Number(levelJumpInputEl?.value || state.currentLevel) || state.currentLevel
  );
  const clampedLevel = THREE.MathUtils.clamp(
    requestedLevel,
    1,
    modeProgress.highestUnlockedLevel
  );

  if (levelJumpInputEl) {
    levelJumpInputEl.value = `${clampedLevel}`;
  }

  return clampedLevel;
}

function syncProgressUi() {
  if (!levelJumpInputEl || !progressSummaryEl) {
    return;
  }

  const modeProgress = getModeProgress();
  const previewLevel = THREE.MathUtils.clamp(
    state.currentLevel,
    1,
    modeProgress.highestUnlockedLevel
  );

  levelJumpInputEl.min = "1";
  levelJumpInputEl.max = `${modeProgress.highestUnlockedLevel}`;
  levelJumpInputEl.value = `${previewLevel}`;
  progressSummaryEl.textContent = `${getCurrentMode().name} resumes from Level ${modeProgress.currentLevel}. Highest unlocked in this mode: ${modeProgress.highestUnlockedLevel}.`;
}

function loadSelectedLevel() {
  if (!state.briefingVisible || state.startTween || state.restartTween || state.successTween) {
    return;
  }

  const selectedLevel = getSelectedUnlockedLevel();
  state.currentLevelConfig = null;
  updateModeProgress(state.currentModeId, {
    currentLevel: selectedLevel,
  });
  loadLevel(selectedLevel, { keepBanner: true, regenerate: true });
  setStatus(`Level ${selectedLevel} loaded. Launch when you are ready.`, "", 1.8);
}

function replayCurrentLevel() {
  if (!state.briefingVisible || state.startTween || state.restartTween || state.successTween) {
    return;
  }

  state.currentLevelConfig = null;
  loadLevel(state.currentLevel, { keepBanner: true, regenerate: true });
  setStatus(`Level ${state.currentLevel} regenerated.`, "", 1.6);
}

function resetModeProgress() {
  if (!state.briefingVisible || state.startTween || state.restartTween || state.successTween) {
    return;
  }

  state.currentLevelConfig = null;
  updateModeProgress(state.currentModeId, {
    currentLevel: 1,
    highestUnlockedLevel: 1,
  });
  loadLevel(1, { keepBanner: true, regenerate: true });
  setStatus(`${getCurrentMode().name} progress reset to Level 1.`, "warning", 2.2);
}

const sounds = createSoundBank();
Howler.volume(0.82);
document.body.classList.add("briefing-active");

buildStaticScene();
bindEvents();
bootstrap().catch((error) => {
  console.error(error);
  setStatus("Load failed. Check the console for details.", "danger", 0);
});

async function bootstrap() {
  setStatus("Loading lot and car rig...", "", 0);
  state.progress = loadSavedProgress();
  state.currentModeId = state.progress.activeModeId;
  await createPlayerCar();
  loadLevel(getModeProgress().currentLevel, { regenerate: true, keepBanner: true });
  showBriefing();
  setStatus(
    `Resume ready. ${getCurrentMode().name} Level ${state.currentLevel} is loaded from local save.`,
    "",
    2.4
  );
  animate();
}

function buildStaticScene() {
  const ambient = new THREE.HemisphereLight("#f7efe1", "#4d6174", 0.84);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight("#fff2c8", 1.28);
  sun.position.set(-18, 25, 14);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 80;
  sun.shadow.camera.left = -36;
  sun.shadow.camera.right = 36;
  sun.shadow.camera.top = 36;
  sun.shadow.camera.bottom = -36;
  scene.add(sun);

  const rim = new THREE.DirectionalLight("#88bce0", 0.28);
  rim.position.set(12, 10, -22);
  scene.add(rim);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(90, 90),
    sharedMaterials.asphalt
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  root.add(ground);

  const lotFrame = new THREE.Mesh(
    new THREE.RingGeometry(24, 33, 4),
    new THREE.MeshStandardMaterial({
      color: "#6c8aa4",
      roughness: 1,
      metalness: 0,
      side: THREE.DoubleSide,
    })
  );
  lotFrame.rotation.x = -Math.PI / 2;
  lotFrame.position.y = 0.01;
  lotFrame.rotation.z = Math.PI / 4;
  root.add(lotFrame);

  const staticLines = new THREE.Group();
  for (let z = -16; z <= 16; z += 8) {
    const stripe = new THREE.Mesh(
      sharedGeometries.stripeBox,
      sharedMaterials.yellowStripe
    );
    stripe.scale.set(0.22, 0.02, 34);
    stripe.position.set(-16.5, 0.012, z * 0.5);
    stripe.receiveShadow = true;
    staticLines.add(stripe);
  }

  for (let x = -12; x <= 12; x += 6) {
    const lane = new THREE.Mesh(
      sharedGeometries.stripeBox,
      sharedMaterials.whiteStripe
    );
    lane.scale.set(0.2, 0.02, 34);
    lane.position.set(x, 0.012, 0);
    lane.receiveShadow = true;
    staticLines.add(lane);
  }

  root.add(staticLines);

  const groundBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Plane(),
    material: new CANNON.Material("ground"),
  });
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  groundBody.userData = { tag: "ground" };
  world.addBody(groundBody);

  const boundaries = [
    { position: [0, 0.9, -20.6], size: [42, 1.8, 1.2] },
    { position: [0, 0.9, 20.6], size: [42, 1.8, 1.2] },
    { position: [-20.6, 0.9, 0], size: [1.2, 1.8, 42] },
    { position: [20.6, 0.9, 0], size: [1.2, 1.8, 42] },
  ];

  boundaries.forEach((barrier) => {
    const mesh = new THREE.Mesh(sharedGeometries.box, sharedMaterials.wall);
    mesh.scale.set(...barrier.size);
    mesh.position.set(...barrier.position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    root.add(mesh);

    const body = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(
        new CANNON.Vec3(
          barrier.size[0] * 0.5,
          barrier.size[1] * 0.5,
          barrier.size[2] * 0.5
        )
      ),
    });
    body.position.set(...barrier.position);
    body.userData = { tag: "wall" };
    world.addBody(body);
    state.boundaryBodies.push(body);
  });
}

async function createPlayerCar() {
  const body = new CANNON.Body({
    mass: 1350,
    shape: new CANNON.Box(new CANNON.Vec3(1.05, 0.55, 2.2)),
    position: new CANNON.Vec3(0, 0.82, 0),
    angularDamping: 0.78,
    linearDamping: 0.18,
  });
  body.angularFactor.set(0, 1, 0);
  body.userData = { tag: "player" };
  body.addEventListener("collide", handleCollision);
  world.addBody(body);
  state.carBody = body;

  const carGroup = new THREE.Group();
  const chassisGroup = new THREE.Group();
  chassisGroup.position.y = -0.44;
  const modelGroup = new THREE.Group();
  const loader = new GLTFLoader();
  const modelUrl = createCarModelUrl();
  const gltf = await loader.loadAsync(modelUrl);
  URL.revokeObjectURL(modelUrl);

  gltf.scene.scale.setScalar(0.95);
  gltf.scene.position.y = 0.1;
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material) {
        child.material.envMapIntensity = 0.45;
      }
    }
  });
  modelGroup.add(gltf.scene);

  const windshield = new THREE.Mesh(
    new THREE.BoxGeometry(1.16, 0.34, 1.28),
    sharedMaterials.glass
  );
  windshield.position.set(0, 0.84, -0.1);
  windshield.castShadow = true;
  modelGroup.add(windshield);

  const rearGlass = new THREE.Mesh(
    new THREE.BoxGeometry(1.16, 0.24, 0.72),
    sharedMaterials.glass
  );
  rearGlass.position.set(0, 0.78, -1.05);
  rearGlass.castShadow = true;
  modelGroup.add(rearGlass);

  chassisGroup.add(modelGroup);

  const wheelPositions = [
    [-0.94, 0.28, 1.44],
    [0.94, 0.28, 1.44],
    [-0.94, 0.28, -1.34],
    [0.94, 0.28, -1.34],
  ];

  const wheels = wheelPositions.map(([x, y, z], index) => {
    const pivot = new THREE.Group();
    pivot.position.set(x, y, z);

    const wheel = new THREE.Mesh(sharedGeometries.wheel, sharedMaterials.parkedWheel);
    wheel.castShadow = true;
    wheel.receiveShadow = true;
    pivot.add(wheel);
    chassisGroup.add(pivot);

    return {
      pivot,
      wheel,
      steerable: index < 2,
    };
  });

  const tailLightGeometry = new THREE.BoxGeometry(0.18, 0.08, 0.12);
  const tailLightMaterial = new THREE.MeshStandardMaterial({
    color: "#ff6b62",
    emissive: new THREE.Color("#ff4b3b"),
    emissiveIntensity: 0.42,
    roughness: 0.65,
  });

  [-0.52, 0.52].forEach((x) => {
    const tailLight = new THREE.Mesh(tailLightGeometry, tailLightMaterial);
    tailLight.position.set(x, 0.48, -2.04);
    chassisGroup.add(tailLight);
  });

  carGroup.add(chassisGroup);

  carGroup.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  root.add(carGroup);

  state.car = {
    group: carGroup,
    chassisGroup,
    modelGroup,
    wheels,
    rearWheelPivots: [wheels[2].pivot, wheels[3].pivot],
    rearTrackPoints: {
      left: null,
      right: null,
    },
    driveSpeed: 0,
    currentSpeed: 0,
    totalSpeed: 0,
    lateralSpeed: 0,
    steer: 0,
    wheelSpin: 0,
    driftBlend: 0,
    driftDirection: 0,
    maxForwardSpeed: 19.5,
    maxReverseSpeed: 8.2,
    forwardAcceleration: 28,
    reverseAcceleration: 16,
    coastDeceleration: 12,
    brakeDeceleration: 24,
    maxSteerAngle: THREE.MathUtils.degToRad(30),
    wheelBase: 2.7,
  };
}

function bindEvents() {
  window.addEventListener("keydown", (event) => {
    const handled = updateInputState(event.code, true);
    if (handled) {
      event.preventDefault();
      unlockAudio();
    }
  });

  window.addEventListener("keyup", (event) => {
    if (updateInputState(event.code, false)) {
      event.preventDefault();
    }
  });

  window.addEventListener("resize", handleResize);
  window.addEventListener("orientationchange", syncOrientationGuard);
  window.addEventListener("pointerdown", unlockAudio, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state.enginePlaying) {
      sounds.engine.pause();
      state.enginePlaying = false;
    }

    if (document.hidden && state.skidPlaying) {
      sounds.skid.pause();
      state.skidPlaying = false;
    }
  });

  ui.modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setMode(button.dataset.mode);
      unlockAudio();
    });
  });

  startDriveButtonEl.addEventListener("click", () => {
    startRun();
    unlockAudio();
  });

  jumpLevelButtonEl.addEventListener("click", () => {
    loadSelectedLevel();
    unlockAudio();
  });

  reloadLevelButtonEl.addEventListener("click", () => {
    replayCurrentLevel();
    unlockAudio();
  });

  resetProgressButtonEl.addEventListener("click", () => {
    resetModeProgress();
    unlockAudio();
  });

  levelJumpInputEl.addEventListener("keydown", (event) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      event.preventDefault();
      loadSelectedLevel();
      unlockAudio();
    }
  });

  levelJumpInputEl.addEventListener("keyup", (event) => {
    event.stopPropagation();
  });

  levelJumpInputEl.addEventListener("change", () => {
    getSelectedUnlockedLevel();
  });

  ui.touchButtons.forEach((button) => {
    const control = button.dataset.control;

    button.addEventListener("pointerdown", (event) => {
      button.setPointerCapture(event.pointerId);
      state.touchCounts[control] += 1;
      syncTouchInput();
      button.classList.add("active");
      unlockAudio();
    });

    const release = (event) => {
      if (button.hasPointerCapture(event.pointerId)) {
        button.releasePointerCapture(event.pointerId);
      }

      state.touchCounts[control] = Math.max(0, state.touchCounts[control] - 1);
      syncTouchInput();
      button.classList.remove("active");
    };

    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("pointerleave", release);
  });

  syncOrientationGuard();
}

function isMobilePortraitBlocked() {
  return window.matchMedia("(pointer: coarse)").matches && window.innerHeight > window.innerWidth;
}

function syncOrientationGuard() {
  const blocked = isMobilePortraitBlocked();
  state.orientationBlocked = blocked;
  document.body.classList.toggle("mobile-portrait-blocked", blocked);

  if (orientationGuardEl) {
    orientationGuardEl.setAttribute("aria-hidden", blocked ? "false" : "true");
  }

  if (blocked) {
    accumulator = 0;
    state.keyboardInput.forward = false;
    state.keyboardInput.reverse = false;
    state.keyboardInput.left = false;
    state.keyboardInput.right = false;
    state.keyboardInput.drift = false;
    state.keyboardInput.brake = false;
    state.touchInput.forward = false;
    state.touchInput.reverse = false;
    state.touchInput.left = false;
    state.touchInput.right = false;
    state.touchInput.drift = false;
    state.touchInput.brake = false;
    state.touchCounts.forward = 0;
    state.touchCounts.reverse = 0;
    state.touchCounts.left = 0;
    state.touchCounts.right = 0;
    state.touchCounts.drift = 0;
    state.touchCounts.brake = 0;
    ui.touchButtons.forEach((button) => button.classList.remove("active"));

    if (state.enginePlaying) {
      sounds.engine.pause();
      state.enginePlaying = false;
    }

    if (state.skidPlaying) {
      sounds.skid.pause();
      state.skidPlaying = false;
    }
  }
}

function updateInputState(code, isPressed) {
  switch (code) {
    case "KeyW":
    case "ArrowUp":
      state.keyboardInput.forward = isPressed;
      return true;
    case "KeyS":
    case "ArrowDown":
      state.keyboardInput.reverse = isPressed;
      return true;
    case "KeyA":
    case "ArrowLeft":
      state.keyboardInput.left = isPressed;
      return true;
    case "KeyD":
    case "ArrowRight":
      state.keyboardInput.right = isPressed;
      return true;
    case "ShiftLeft":
    case "ShiftRight":
      state.keyboardInput.drift = isPressed;
      return true;
    case "Space":
      state.keyboardInput.brake = isPressed;
      return true;
    case "KeyR":
      if (isPressed) {
        if (state.briefingVisible) {
          startRun();
        } else {
          scheduleRestart("Manual reset...");
        }
      }
      return true;
    case "Enter":
    case "NumpadEnter":
      if (isPressed && state.briefingVisible) {
        startRun();
      }
      return state.briefingVisible;
    default:
      return false;
  }
}

function syncTouchInput() {
  for (const key of Object.keys(state.touchCounts)) {
    state.touchInput[key] = state.touchCounts[key] > 0;
  }
}

function isControlActive(control) {
  return state.keyboardInput[control] || state.touchInput[control];
}

function unlockAudio() {
  if (state.soundUnlocked) {
    return;
  }

  state.soundUnlocked = true;
  const engineId = sounds.engine.play();
  sounds.engine.volume(0, engineId);
  sounds.engine.pause(engineId);

  const skidId = sounds.skid.play();
  sounds.skid.volume(0, skidId);
  sounds.skid.pause(skidId);
}

function syncPresentationState() {
  briefingScreenEl.classList.toggle("is-hidden", !state.briefingVisible);
  document.body.classList.toggle("briefing-active", state.briefingVisible);
  document.body.classList.toggle("in-run", state.runActive);
}

function setTransitionCopy(kicker, title, subtitle) {
  transitionKickerEl.textContent = kicker;
  transitionTitleEl.textContent = title;
  transitionSubtitleEl.textContent = subtitle;
}

function hideTransitionOverlay() {
  if (state.transitionTween) {
    state.transitionTween.kill();
    state.transitionTween = null;
  }

  gsap.to(transitionOverlayEl, {
    autoAlpha: 0,
    duration: 0.22,
    ease: "power2.out",
    onStart: () => {
      transitionOverlayEl.classList.add("is-visible");
    },
    onComplete: () => {
      transitionOverlayEl.classList.remove("is-visible");
      transitionOverlayEl.setAttribute("aria-hidden", "true");
    },
  });
}

function showTransitionOverlay(kicker, title, subtitle) {
  if (state.transitionTween) {
    state.transitionTween.kill();
    state.transitionTween = null;
  }

  setTransitionCopy(kicker, title, subtitle);
  transitionOverlayEl.classList.add("is-visible");
  transitionOverlayEl.setAttribute("aria-hidden", "false");
  gsap.set(transitionOverlayEl, { autoAlpha: 0 });
  state.transitionTween = gsap.to(transitionOverlayEl, {
    autoAlpha: 1,
    duration: 0.26,
    ease: "power2.out",
    onComplete: () => {
      state.transitionTween = null;
    },
  });
}

function animateBriefingIn() {
  syncPresentationState();
  gsap.killTweensOf([briefingScreenEl, ...ui.briefingCards]);
  briefingScreenEl.classList.remove("is-hidden");
  gsap.set(briefingScreenEl, { autoAlpha: 1 });
  gsap.set(ui.briefingCards, { y: 34, opacity: 0 });
  state.briefingTween = gsap.to(ui.briefingCards, {
    y: 0,
    opacity: 1,
    stagger: 0.06,
    duration: 0.54,
    ease: "power3.out",
    onComplete: () => {
      state.briefingTween = null;
    },
  });
}

function showBriefing() {
  state.runActive = false;
  state.briefingVisible = true;
  gsap.to(state.cameraRig, {
    distance: BRIEFING_CAMERA_RIG.distance,
    height: BRIEFING_CAMERA_RIG.height,
    lookAhead: BRIEFING_CAMERA_RIG.lookAhead,
    lookHeight: BRIEFING_CAMERA_RIG.lookHeight,
    duration: 0.75,
    ease: "power2.out",
  });
  animateBriefingIn();
}

function startRun() {
  if (
    state.runActive ||
    !state.briefingVisible ||
    !state.currentLevelConfig ||
    state.startTween ||
    state.restartTween ||
    state.successTween
  ) {
    return;
  }

  if (state.orientationBlocked) {
    setStatus("Rotate to landscape on mobile to drive.", "warning", 1.8);
    return;
  }

  setGameplayTimeScale(1, 0.08, true);
  showTransitionOverlay(
    "Precision Driving Lab",
    `Level ${state.currentLevel}`,
    "Rolling camera into position..."
  );

  if (state.briefingTween) {
    state.briefingTween.kill();
    state.briefingTween = null;
  }

  state.startTween = gsap.timeline({
    onComplete: () => {
      state.briefingVisible = false;
      state.runActive = true;
      state.introReady = true;
      syncPresentationState();
      hideTransitionOverlay();
      state.startTween = null;
      setStatus("Go.", "", 1);
    },
  });

  state.startTween
    .to(
      ui.briefingCards,
      {
        y: -22,
        opacity: 0,
        stagger: 0.04,
        duration: 0.26,
        ease: "power2.in",
      },
      0
    )
    .to(
      briefingScreenEl,
      {
        autoAlpha: 0,
        duration: 0.28,
        ease: "power2.inOut",
      },
      0.06
    )
    .to(
      state.cameraRig,
      {
        distance: PLAY_CAMERA_RIG.distance,
        height: PLAY_CAMERA_RIG.height,
        lookAhead: PLAY_CAMERA_RIG.lookAhead,
        lookHeight: PLAY_CAMERA_RIG.lookHeight,
        duration: 0.82,
        ease: "power3.inOut",
      },
      0
    )
    .fromTo(
      bloomPass,
      { strength: 0.34 },
      {
        strength: 0.24,
        duration: 0.78,
        ease: "power2.out",
      },
      0.08
    );
}

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  composer.setSize(window.innerWidth, window.innerHeight);
  syncOrientationGuard();
}

function setMode(modeId) {
  if (modeId === state.currentModeId) {
    syncProgressUi();
    return;
  }

  state.currentModeId = modeId;
  state.progress.activeModeId = modeId;
  persistProgress();
  state.currentLevel = getModeProgress(modeId).currentLevel;
  state.currentLevelConfig = null;
  loadLevel(state.currentLevel, { keepBanner: true, regenerate: true });
  setStatus(
    `${getCurrentMode().name} ready from saved Level ${state.currentLevel}.`,
    "",
    1.8
  );
}

function getCurrentMode() {
  return GAME_MODES.find((mode) => mode.id === state.currentModeId) ?? GAME_MODES[0];
}

function isDriftModeActive() {
  return Boolean(getCurrentMode().driftRequired || state.currentLevelConfig?.driftRequired);
}

function isReverseOnlyActive() {
  const mode = getCurrentMode();
  const level = state.currentLevelConfig;
  return mode.reverseOnly || Boolean(level?.requiresReverse);
}

function clearLevel() {
  while (levelRoot.children.length) {
    levelRoot.remove(levelRoot.children[0]);
  }

  state.levelBodies.forEach((body) => {
    world.removeBody(body);
  });
  state.levelBodies = [];
  state.levelDisposables = [];
  state.parkingGuide = null;
  state.parkingZone = null;
  clearTransientEffects();
}

function loadLevel(levelNumber, options = {}) {
  const { keepBanner = false, regenerate = true, preserveTransition = false } = options;
  clearQueuedTransitions(preserveTransition);
  clearLevel();

  state.currentLevel = Math.max(1, levelNumber);
  const level =
    !regenerate && state.currentLevelConfig
      ? state.currentLevelConfig
      : generateProceduralLevel(state.currentLevel, getCurrentMode());
  state.currentLevelConfig = level;
  const mode = getCurrentMode();
  const driftMode = isDriftModeActive();
  const reverseDisabled = isReverseOnlyActive();

  levelNameEl.textContent = level.name;
  levelLabelEl.textContent = `${state.currentLevel}`;
  if (difficultyLabelEl) {
    difficultyLabelEl.textContent = level.difficultyTag;
  }
  modeLabelEl.textContent = [
    mode.name,
    level.requiresReverse && !mode.reverseOnly ? "Reverse Slot" : "",
    level.driftRequired && !mode.driftRequired ? "Drift Gate" : "",
  ]
      .filter(Boolean)
      .join(" / ");
  goalLabelEl.textContent = level.goal;
  startDriveButtonEl.textContent = `Start Level ${state.currentLevel}`;
  instructionsEl.textContent = buildInstructions(level, mode);
  syncProgressUi();

  ui.modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode.id);
  });

  const forwardTouchButton = ui.touchButtons.find(
    (button) => button.dataset.control === "forward"
  );
  const driftTouchButton = ui.touchButtons.find(
    (button) => button.dataset.control === "drift"
  );
  if (forwardTouchButton) {
    forwardTouchButton.disabled = reverseDisabled;
  }
  if (driftTouchButton) {
    driftTouchButton.disabled = !driftMode;
  }

  buildParkingZone(level.parkingZone);
  buildLevelObstacles(level);
  resetCar(level.spawn.position, level.spawn.yaw);
  bloomPass.strength = 0.055;
  state.lastCollisionAt = 0;
  updateTechniqueLabel();

  if (!keepBanner) {
    setStatus(
      driftMode
        ? "Drift Parking active. Slow parking will fail."
        : reverseDisabled
          ? "Reverse-only bay engaged. Ease it in."
          : "Slide into the highlighted bay.",
      "",
      2.2
    );
  }
}

function buildInstructions(level, mode) {
  if (level.driftRequired) {
    return `${level.instructions} Use W / Up to build speed, steer with A / D, hold Shift or the Drift button once you are moving fast enough, and only brake after the car is rotating into the slot. ${mode.description}`;
  }

  const reverseText = level.requiresReverse || mode.reverseOnly
    ? "Forward throttle is disabled for this run."
    : "Use W / Up for drive and S / Down for reverse.";

  return `${level.instructions} ${reverseText} Space brakes hard, Shift is reserved for drift mode, and R restarts the attempt. ${mode.description}`;
}

function buildParkingZone(zoneConfig) {
  const zoneGroup = new THREE.Group();

  const guide = new THREE.Mesh(
    new THREE.BoxGeometry(zoneConfig.size[0], zoneConfig.size[1], zoneConfig.size[2]),
    sharedMaterials.slotGuide.clone()
  );
  guide.position.set(...zoneConfig.position);
  guide.rotation.y = zoneConfig.rotation;
  guide.renderOrder = 1;
  zoneGroup.add(guide);

  const outline = new THREE.LineSegments(
    new THREE.EdgesGeometry(
      new THREE.BoxGeometry(zoneConfig.size[0], zoneConfig.size[1], zoneConfig.size[2])
    ),
    sharedMaterials.slotOutline.clone()
  );
  outline.position.copy(guide.position);
  outline.rotation.y = guide.rotation.y;
  zoneGroup.add(outline);

  const stripeGroup = new THREE.Group();
  const stripeColor =
    zoneConfig.stripeColor === "#ffe58a"
      ? sharedMaterials.yellowStripe
      : sharedMaterials.whiteStripe;
  const stripeThickness = 0.14;

  const createStripe = (x, z, width, depth) => {
    const mesh = new THREE.Mesh(sharedGeometries.stripeBox, stripeColor);
    mesh.scale.set(width, 0.03, depth);
    mesh.position.set(x, 0.025, z);
    mesh.receiveShadow = true;
    stripeGroup.add(mesh);
  };

  createStripe(0, zoneConfig.size[2] * 0.5 - stripeThickness * 0.5, zoneConfig.size[0] + 0.35, stripeThickness);
  createStripe(0, -zoneConfig.size[2] * 0.5 + stripeThickness * 0.5, zoneConfig.size[0] + 0.35, stripeThickness);
  createStripe(zoneConfig.size[0] * 0.5, 0, stripeThickness, zoneConfig.size[2]);
  createStripe(-zoneConfig.size[0] * 0.5, 0, stripeThickness, zoneConfig.size[2]);

  stripeGroup.position.set(zoneConfig.position[0], 0, zoneConfig.position[2]);
  stripeGroup.rotation.y = zoneConfig.rotation;
  zoneGroup.add(stripeGroup);

  state.parkingGuide = guide;
  state.parkingZone = zoneConfig;
  levelRoot.add(zoneGroup);
}

function buildLevelObstacles(level) {
  level.walls.forEach((wall) => {
    const mesh = new THREE.Mesh(sharedGeometries.box, sharedMaterials.wall);
    mesh.scale.set(...wall.size);
    mesh.position.set(...wall.position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    if (wall.rotation) {
      mesh.rotation.y = wall.rotation;
    }
    levelRoot.add(mesh);

    const body = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(
        new CANNON.Vec3(wall.size[0] * 0.5, wall.size[1] * 0.5, wall.size[2] * 0.5)
      ),
    });
    body.position.set(...wall.position);
    if (wall.rotation) {
      body.quaternion.setFromEuler(0, wall.rotation, 0);
    }
    body.userData = { tag: "wall" };
    world.addBody(body);
    state.levelBodies.push(body);
  });

  level.cones.forEach(([x, z]) => {
    const cone = new THREE.Group();

    const coneBody = new THREE.Mesh(sharedGeometries.cone, sharedMaterials.cone);
    coneBody.position.y = 0.43;
    coneBody.castShadow = true;
    coneBody.receiveShadow = true;
    cone.add(coneBody);

    const band = new THREE.Mesh(
      new THREE.CylinderGeometry(0.19, 0.25, 0.13, 12),
      sharedMaterials.coneBand
    );
    band.position.y = 0.32;
    cone.add(band);

    cone.position.set(x, 0, z);
    levelRoot.add(cone);

    const body = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(0.24, 0.43, 0.24)),
    });
    body.position.set(x, 0.43, z);
    body.userData = { tag: "cone" };
    world.addBody(body);
    state.levelBodies.push(body);
  });

  level.parkedCars.forEach((carConfig) => {
    const parked = createParkedCar(carConfig.color);
    parked.group.position.set(...carConfig.position);
    parked.group.rotation.y = carConfig.rotation;
    levelRoot.add(parked.group);

    const body = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(1.05, 0.55, 2.2)),
    });
    body.position.set(...carConfig.position);
    body.quaternion.setFromEuler(0, carConfig.rotation, 0);
    body.userData = { tag: "parked-car" };
    world.addBody(body);
    state.levelBodies.push(body);
  });
}

function createParkedCar(color) {
  const group = new THREE.Group();
  const shellRoot = new THREE.Group();
  shellRoot.position.y = -0.44;
  group.add(shellRoot);
  const shellMaterial = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.48,
    metalness: 0.35,
  });

  const body = new THREE.Mesh(sharedGeometries.box, shellMaterial);
  body.scale.set(1.9, 0.56, 4.1);
  body.position.y = 0.32;
  body.castShadow = true;
  body.receiveShadow = true;
  shellRoot.add(body);

  const roof = new THREE.Mesh(sharedGeometries.box, shellMaterial);
  roof.scale.set(1.42, 0.5, 2.18);
  roof.position.set(0, 0.82, -0.22);
  roof.castShadow = true;
  roof.receiveShadow = true;
  shellRoot.add(roof);

  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(1.15, 0.28, 1.22),
    sharedMaterials.glass
  );
  glass.position.set(0, 0.84, -0.08);
  glass.castShadow = true;
  shellRoot.add(glass);

  const wheelOffsets = [
    [-0.94, 0.22, 1.42],
    [0.94, 0.22, 1.42],
    [-0.94, 0.22, -1.34],
    [0.94, 0.22, -1.34],
  ];

  wheelOffsets.forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(sharedGeometries.wheel, sharedMaterials.parkedWheel);
    wheel.position.set(x, y, z);
    wheel.castShadow = true;
    wheel.receiveShadow = true;
    shellRoot.add(wheel);
  });

  group.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return { group };
}

function resetCar(position, yaw) {
  const { carBody, car } = state;
  resetDriftRunState();
  setGameplayTimeScale(1, 0.01, true);
  accumulator = 0;
  carBody.position.set(...position);
  carBody.quaternion.setFromEuler(0, yaw, 0);
  carBody.velocity.set(0, 0, 0);
  carBody.angularVelocity.set(0, 0, 0);
  carBody.force.set(0, 0, 0);
  carBody.torque.set(0, 0, 0);

  car.driveSpeed = 0;
  car.currentSpeed = 0;
  car.totalSpeed = 0;
  car.lateralSpeed = 0;
  car.steer = 0;
  car.wheelSpin = 0;
  car.driftBlend = 0;
  car.driftDirection = 0;

  syncCarVisual();

  state.collisionArmedAt = performance.now() + 700;
}

function resetDriftRunState() {
  state.drift.active = false;
  state.drift.recentUntil = 0;
  state.drift.usedThisRun = false;
  state.drift.commitArmed = false;
  state.drift.slowMoActive = false;
  state.drift.lastMarkAt = 0;
  state.drift.lastSmokeAt = 0;

  if (state.car) {
    state.car.rearTrackPoints.left = null;
    state.car.rearTrackPoints.right = null;
  }
}

function clearTransientEffects() {
  while (tireMarkRoot.children.length) {
    const child = tireMarkRoot.children[tireMarkRoot.children.length - 1];
    child.material?.dispose?.();
    tireMarkRoot.remove(child);
  }

  while (smokeRoot.children.length) {
    const child = smokeRoot.children[smokeRoot.children.length - 1];
    child.material?.dispose?.();
    smokeRoot.remove(child);
  }

  state.driftMarks = [];
  state.smokePuffs = [];

  if (state.car) {
    state.car.rearTrackPoints.left = null;
    state.car.rearTrackPoints.right = null;
  }
}

function setGameplayTimeScale(target, duration = 0.18, immediate = false) {
  if (state.timeScaleTween) {
    state.timeScaleTween.kill();
    state.timeScaleTween = null;
  }

  if (immediate) {
    state.timeScale = target;
    return;
  }

  if (Math.abs(state.timeScale - target) < 0.015) {
    state.timeScale = target;
    return;
  }

  state.timeScaleTween = gsap.to(state, {
    timeScale: target,
    duration,
    ease: "power2.out",
    onComplete: () => {
      state.timeScaleTween = null;
    },
  });
}

function clearQueuedTransitions(preserveTransition = false) {
  if (state.restartTween) {
    state.restartTween.kill();
    state.restartTween = null;
  }

  if (state.successTween) {
    state.successTween.kill();
    state.successTween = null;
  }

  if (state.timeScaleTween) {
    state.timeScaleTween.kill();
    state.timeScaleTween = null;
  }

  if (state.startTween) {
    state.startTween.kill();
    state.startTween = null;
  }

  if (state.briefingTween) {
    state.briefingTween.kill();
    state.briefingTween = null;
  }

  if (state.transitionTween) {
    state.transitionTween.kill();
    state.transitionTween = null;
  }

  if (!preserveTransition) {
    transitionOverlayEl.classList.remove("is-visible");
    transitionOverlayEl.setAttribute("aria-hidden", "true");
    gsap.set(transitionOverlayEl, { autoAlpha: 0 });
  }
}

function handleCollision(event) {
  if (!event.body || state.restartTween || state.successTween) {
    return;
  }

  if (performance.now() < state.collisionArmedAt) {
    return;
  }

  const otherTag = event.body.userData?.tag;
  if (SAFE_COLLISION_TAGS.has(otherTag)) {
    return;
  }

  const elapsed = performance.now() - state.lastCollisionAt;
  if (elapsed < 280) {
    return;
  }

  const impact = relativeImpactMagnitude(state.carBody, event.body);
  const threshold = getCurrentMode().collisionThreshold;
  if (impact < threshold) {
    if (getCurrentMode().id === "normal") {
      setStatus("Careful... low-speed scrape ignored in Normal mode.", "warning", 1.2);
    }
    return;
  }

  state.lastCollisionAt = performance.now();
  scheduleRestart("Crash! Restarting...", true);
}

function relativeImpactMagnitude(bodyA, bodyB) {
  const ax = bodyA.velocity.x - bodyB.velocity.x;
  const az = bodyA.velocity.z - bodyB.velocity.z;
  return Math.sqrt(ax * ax + az * az);
}

function scheduleRestart(message, fromCrash = false) {
  if (state.restartTween || state.successTween) {
    return;
  }

  setGameplayTimeScale(1, 0.08, true);
  setStatus(message, fromCrash ? "danger" : "warning", 0);
  state.car.driveSpeed = 0;
  state.touchInput.forward = false;
  state.touchInput.reverse = false;
  state.touchInput.left = false;
  state.touchInput.right = false;
  state.touchInput.drift = false;
  state.touchInput.brake = false;
  state.touchCounts.forward = 0;
  state.touchCounts.reverse = 0;
  state.touchCounts.left = 0;
  state.touchCounts.right = 0;
  state.touchCounts.drift = 0;
  state.touchCounts.brake = 0;
  ui.touchButtons.forEach((button) => button.classList.remove("active"));

  if (state.skidPlaying) {
    sounds.skid.pause();
    state.skidPlaying = false;
  }

  if (fromCrash) {
    sounds.crash.play();
    triggerCrashCamera();
  }

  state.restartTween = gsap.delayedCall(1, () => {
    state.restartTween = null;
    loadLevel(state.currentLevel, { keepBanner: true, regenerate: false });
    setStatus("Run reset. Try a cleaner line.", "", 1.8);
  });
}

function handleSuccess() {
  if (state.successTween || state.restartTween) {
    return;
  }

  setGameplayTimeScale(1, 0.08, true);
  sounds.success.play();
  state.runActive = false;
  setStatus(isDriftModeActive() ? "Perfect Drift!" : "Perfect Parking!", "success", 0);
  const nextLevel = state.currentLevel + 1;
  const currentProgress = getModeProgress();
  updateModeProgress(state.currentModeId, {
    currentLevel: nextLevel,
    highestUnlockedLevel: Math.max(currentProgress.highestUnlockedLevel, nextLevel),
  });
  showTransitionOverlay(
    "Lot Cleared",
    isDriftModeActive() ? "Perfect Drift" : "Perfect Park",
    `Generating Level ${nextLevel} briefing...`
  );
  syncPresentationState();

  const timeline = gsap.timeline({
      onComplete: () => {
        state.successTween = null;
        loadLevel(nextLevel, { regenerate: true, keepBanner: true, preserveTransition: true });
        showBriefing();
        hideTransitionOverlay();
        setStatus(`Level ${nextLevel} ready. Start when you want.`, "", 2.4);
      },
  });

  timeline
    .to(
      state.cameraRig,
      {
        distance: 6.4,
        height: 3.6,
        duration: 0.34,
        ease: "power2.out",
      },
      0
    )
    .to(
      bloomPass,
      {
        strength: 0.72,
        duration: 0.28,
        ease: "power1.out",
      },
      0
    )
    .to(
      state.cameraRig,
      {
        distance: BRIEFING_CAMERA_RIG.distance,
        height: BRIEFING_CAMERA_RIG.height,
        lookAhead: BRIEFING_CAMERA_RIG.lookAhead,
        lookHeight: BRIEFING_CAMERA_RIG.lookHeight,
        duration: 0.92,
        ease: "power2.inOut",
      },
      0.24
    )
    .to(
      bloomPass,
      {
        strength: 0.24,
        duration: 0.78,
        ease: "power2.out",
      },
      0.26
    );

  state.successTween = timeline;
}

function triggerCrashCamera() {
  gsap.killTweensOf(state.cameraRig);
  gsap.fromTo(
    state.cameraRig,
    { shake: 0.65 },
    {
      shake: 0,
      duration: 0.68,
      ease: "power3.out",
    }
  );

  gsap.fromTo(
    bloomPass,
    { strength: 0.7 },
    {
      strength: 0.24,
      duration: 0.75,
      ease: "power2.out",
    }
  );
}

function setStatus(message, kind = "", durationSeconds = 2) {
  statusBannerEl.textContent = message;
  statusBannerEl.className = "status-banner";
  if (kind) {
    statusBannerEl.classList.add(kind);
  }

  if (state.statusClearTween) {
    state.statusClearTween.kill();
    state.statusClearTween = null;
  }

  if (durationSeconds > 0) {
    state.statusClearTween = gsap.delayedCall(durationSeconds, () => {
      statusBannerEl.className = "status-banner";
      state.statusClearTween = null;
    });
  }
}

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.05);

  if (state.orientationBlocked) {
    accumulator = 0;
    composer.render();
    return;
  }

  accumulator += delta * state.timeScale;

  while (accumulator >= FIXED_TIME_STEP) {
    updateCar(FIXED_TIME_STEP);
    world.step(FIXED_TIME_STEP);
    accumulator -= FIXED_TIME_STEP;
  }

  syncCarVisual();
  updateDriftEffects(delta);
  updateParkingDetection();
  updateCamera(delta);
  updateAudio();
  composer.render();
}

function updateCar(dt) {
  if (!state.car || !state.carBody) {
    return;
  }

  const { car, carBody } = state;

  if (state.restartTween || state.successTween) {
    car.driveSpeed = moveToward(car.driveSpeed, 0, car.brakeDeceleration * dt);
    car.driftBlend = damp(car.driftBlend, 0, 8, dt);
    state.drift.active = false;
    carBody.velocity.x *= 0.9;
    carBody.velocity.z *= 0.9;
    carBody.angularVelocity.y *= 0.78;
    car.currentSpeed *= 0.9;
    car.totalSpeed *= 0.9;
    car.lateralSpeed *= 0.9;
    return;
  }

  if (!state.runActive) {
    car.driveSpeed = moveToward(car.driveSpeed, 0, car.brakeDeceleration * dt);
    car.driftBlend = damp(car.driftBlend, 0, 8, dt);
    state.drift.active = false;
    carBody.velocity.x *= 0.84;
    carBody.velocity.z *= 0.84;
    carBody.angularVelocity.y *= 0.8;
    car.currentSpeed *= 0.82;
    car.totalSpeed *= 0.82;
    car.lateralSpeed *= 0.82;
    return;
  }

  const mode = getCurrentMode();
  const reverseOnly = isReverseOnlyActive();
  const driftMode = isDriftModeActive();
  const forwardHeld = reverseOnly ? false : isControlActive("forward");
  const reverseHeld = isControlActive("reverse");
  const brakeHeld = isControlActive("brake");
  const driftHeld = driftMode && isControlActive("drift");

  let throttleDirection = 0;
  if (forwardHeld) {
    throttleDirection += 1;
  }
  if (reverseHeld) {
    throttleDirection -= 1;
  }

  const steerInput = (isControlActive("left") ? 1 : 0) - (isControlActive("right") ? 1 : 0);

  const carQuaternion = new THREE.Quaternion(
    carBody.quaternion.x,
    carBody.quaternion.y,
    carBody.quaternion.z,
    carBody.quaternion.w
  );
  temp.forward.set(0, 0, 1).applyQuaternion(carQuaternion).normalize();
  temp.right.set(1, 0, 0).applyQuaternion(carQuaternion).normalize();

  let forwardSpeed = temp.forward.x * carBody.velocity.x + temp.forward.z * carBody.velocity.z;
  let lateralSpeed = temp.right.x * carBody.velocity.x + temp.right.z * carBody.velocity.z;
  const planarSpeed = Math.hypot(carBody.velocity.x, carBody.velocity.z);

  const driftEligible =
    driftMode &&
    driftHeld &&
    Math.max(Math.abs(forwardSpeed), planarSpeed) > mode.driftActivationSpeed &&
    Math.abs(steerInput) > 0.15;
  const driftTarget = driftEligible ? 1 : 0;

  car.driftBlend = damp(car.driftBlend, driftTarget, driftEligible ? 14 : 7, dt);
  state.drift.active = car.driftBlend > 0.18;
  if (state.drift.active) {
    state.drift.recentUntil = performance.now() + mode.driftRecentWindow;
    state.drift.usedThisRun = true;
  }

  if (throttleDirection > 0) {
    car.driveSpeed = THREE.MathUtils.clamp(
      car.driveSpeed + car.forwardAcceleration * (state.drift.active ? 0.8 : 1) * dt,
      -car.maxReverseSpeed,
      car.maxForwardSpeed
    );
  } else if (throttleDirection < 0) {
    car.driveSpeed = THREE.MathUtils.clamp(
      car.driveSpeed - car.reverseAcceleration * (state.drift.active ? 0.7 : 1) * dt,
      -car.maxReverseSpeed,
      car.maxForwardSpeed
    );
  } else {
    car.driveSpeed = moveToward(
      car.driveSpeed,
      0,
      car.coastDeceleration * (state.drift.active ? 0.32 : 1) * dt
    );
  }

  if (brakeHeld) {
    const priorSpeed = car.driveSpeed;
    car.driveSpeed = moveToward(
      car.driveSpeed,
      0,
      car.brakeDeceleration * (state.drift.active ? 0.38 : 1) * dt
    );
    if (
      Math.abs(priorSpeed) > 1.2 &&
      Math.abs(car.driveSpeed) < Math.abs(priorSpeed) &&
      !sounds.brake.playing()
    ) {
      sounds.brake.play();
    }
  }

  if (reverseOnly) {
    car.driveSpeed = Math.min(car.driveSpeed, 0);
  }

  const steeringCap = car.maxSteerAngle * (state.drift.active ? 1.45 : 1);
  const steerTarget = steerInput * steeringCap;
  car.steer = damp(car.steer, steerTarget, state.drift.active ? 12 : 9, dt);

  const speedForTurn = state.drift.active
    ? Math.sign(forwardSpeed || car.driveSpeed || 1) *
      Math.max(Math.abs(forwardSpeed), Math.abs(car.driveSpeed), 4)
    : car.driveSpeed;

  let yawRate = (car.steer * speedForTurn) / car.wheelBase;
  if (state.drift.active) {
    yawRate *= 1.8;
    yawRate += steerInput * car.driftBlend * 1.05;
    yawRate += lateralSpeed * 0.09 * car.driftBlend;
  }
  carBody.angularVelocity.y = THREE.MathUtils.lerp(
    carBody.angularVelocity.y,
    yawRate,
    state.drift.active ? 0.42 : 0.3
  );

  const desiredForwardSpeed = state.drift.active
    ? THREE.MathUtils.lerp(forwardSpeed, car.driveSpeed, 0.08)
    : car.driveSpeed;
  const forwardTraction = state.drift.active ? 0.09 : 0.17;
  carBody.velocity.x += temp.forward.x * (desiredForwardSpeed - forwardSpeed) * forwardTraction;
  carBody.velocity.z += temp.forward.z * (desiredForwardSpeed - forwardSpeed) * forwardTraction;
  carBody.velocity.y = Math.max(carBody.velocity.y, -3);

  carBody.velocity.x -= temp.right.x * lateralSpeed * (state.drift.active ? 0.045 : 0.24);
  carBody.velocity.z -= temp.right.z * lateralSpeed * (state.drift.active ? 0.045 : 0.24);

  if (state.drift.active) {
    const slipBoost =
      steerInput *
      Math.max(Math.abs(forwardSpeed), planarSpeed, 4) *
      (0.54 + car.driftBlend * 0.36);
    carBody.velocity.x += temp.right.x * slipBoost * dt * 2.5;
    carBody.velocity.z += temp.right.z * slipBoost * dt * 2.5;
  }

  forwardSpeed = temp.forward.x * carBody.velocity.x + temp.forward.z * carBody.velocity.z;
  lateralSpeed = temp.right.x * carBody.velocity.x + temp.right.z * carBody.velocity.z;

  car.currentSpeed = forwardSpeed;
  car.totalSpeed = Math.hypot(carBody.velocity.x, carBody.velocity.z);
  car.lateralSpeed = lateralSpeed;
  car.driftDirection = car.driftBlend > 0.1 ? Math.sign(lateralSpeed || steerInput || 1) : 0;

  if (Math.abs(car.currentSpeed) < 0.1 && car.totalSpeed < 0.2 && throttleDirection === 0 && !brakeHeld) {
    carBody.angularVelocity.y *= 0.85;
  }
}

function syncCarVisual() {
  if (!state.car || !state.carBody) {
    return;
  }

  const { group, wheels, chassisGroup } = state.car;
  group.position.set(
    state.carBody.position.x,
    state.carBody.position.y,
    state.carBody.position.z
  );
  group.quaternion.set(
    state.carBody.quaternion.x,
    state.carBody.quaternion.y,
    state.carBody.quaternion.z,
    state.carBody.quaternion.w
  );

  state.car.wheelSpin += state.car.currentSpeed * 0.08;
  chassisGroup.rotation.z = THREE.MathUtils.lerp(
    chassisGroup.rotation.z,
    THREE.MathUtils.clamp(-state.car.lateralSpeed * 0.038, -0.16, 0.16),
    0.18
  );
  chassisGroup.rotation.x = THREE.MathUtils.lerp(
    chassisGroup.rotation.x,
    THREE.MathUtils.clamp(-state.car.currentSpeed * 0.008, -0.08, 0.06),
    0.16
  );
  wheels.forEach((wheelData) => {
    if (wheelData.steerable) {
      wheelData.pivot.rotation.y = state.car.steer;
    }
    wheelData.wheel.rotation.x -= state.car.currentSpeed * 0.065;
  });

  const kmh = state.car.totalSpeed * 6.6;
  speedLabelEl.textContent = `${kmh.toFixed(1)} km/h`;
}

function updateParkingDetection() {
  if (
    !state.runActive ||
    !state.parkingZone ||
    !state.parkingGuide ||
    state.restartTween ||
    state.successTween
  ) {
    return;
  }

  const result = evaluateParking();
  updateTechniqueLabel(result);
  const material = state.parkingGuide.material;
  const driftMode = isDriftModeActive();

  if (driftMode) {
    const shouldSlowMo =
      result.inside &&
      result.driftRecent &&
      result.aligned &&
      result.speedMagnitude > 0.55 &&
      result.speedMagnitude < 3.2;
    if (shouldSlowMo !== state.drift.slowMoActive) {
      state.drift.slowMoActive = shouldSlowMo;
      setGameplayTimeScale(shouldSlowMo ? 0.58 : 1, shouldSlowMo ? 0.16 : 0.2);
    }

    if (result.inside && result.driftRecent && result.aligned && result.speedMagnitude < 4.2) {
      state.drift.commitArmed = true;
    }

    if (state.drift.commitArmed && !result.inside) {
      scheduleRestart("Drift line lost. Retry the slot.");
      return;
    }

    if (result.inside && result.aligned && result.speedMagnitude < 0.95 && !result.driftRecent) {
      scheduleRestart("No drift, no score. Throw it sideways first.");
      return;
    }
  } else if (state.drift.slowMoActive) {
    state.drift.slowMoActive = false;
    setGameplayTimeScale(1, 0.2);
  }

  if (result.success) {
    material.color.set("#72efc5");
    material.emissive?.set?.("#72efc5");
    material.emissiveIntensity = 0.08;
    material.opacity = 0.24;
    handleSuccess();
    return;
  }

  if (driftMode && result.inside && !result.driftRecent) {
    material.color.set("#ff8d76");
    material.emissive?.set?.("#ff8d76");
    material.emissiveIntensity = 0.06;
    material.opacity = 0.24;
  } else if (driftMode && result.inside) {
    material.color.set(result.aligned ? "#7ce0c9" : "#ffe28c");
    material.emissive?.set?.(result.aligned ? "#7ce0c9" : "#ffe28c");
    material.emissiveIntensity = 0.055;
    material.opacity = 0.22;
  } else if (result.inside) {
    material.color.set("#ffe28c");
    material.emissive?.set?.("#ffe28c");
    material.emissiveIntensity = 0.05;
    material.opacity = 0.22;
  } else {
    material.color.set("#f0d06a");
    material.emissive?.set?.("#f0d06a");
    material.emissiveIntensity = 0.035;
    material.opacity = 0.17;
  }
}

function evaluateParking() {
  const carPosition = state.carBody.position;
  const zone = state.parkingZone;
  const deltaX = carPosition.x - zone.position[0];
  const deltaZ = carPosition.z - zone.position[2];
  const cos = Math.cos(-zone.rotation);
  const sin = Math.sin(-zone.rotation);

  const localX = deltaX * cos - deltaZ * sin;
  const localZ = deltaX * sin + deltaZ * cos;
  const inside =
    Math.abs(localX) < zone.size[0] * 0.42 &&
    Math.abs(localZ) < zone.size[2] * 0.42;

  const yaw = extractYaw(state.carBody.quaternion);
  const angleDiff = Math.min(
    Math.abs(normalizeAngle(yaw - zone.rotation)),
    Math.abs(normalizeAngle(yaw - zone.rotation + Math.PI))
  );
  const angleTolerance = THREE.MathUtils.degToRad(
    Math.min(zone.angleTolerance, getCurrentMode().parkingAngleTolerance)
  );

  const driftRequired = isDriftModeActive();
  const driftRecent = !driftRequired || performance.now() < state.drift.recentUntil;
  const speedMagnitude = state.car.totalSpeed;
  const speedOk = speedMagnitude < (driftRequired ? 0.72 : 0.5);
  const aligned = angleDiff <= angleTolerance;

  return {
    inside,
    aligned,
    speedOk,
    driftRecent,
    speedMagnitude,
    angleDiff,
    success: inside && aligned && speedOk && driftRecent,
  };
}

function updateCamera(dt) {
  if (!state.car) {
    return;
  }

  temp.carPosition.copy(state.car.group.position);
  temp.forward.set(0, 0, 1).applyQuaternion(state.car.group.quaternion).normalize();
  temp.right.set(1, 0, 0).applyQuaternion(state.car.group.quaternion).normalize();
  const speedRatio = THREE.MathUtils.clamp(
    state.car.totalSpeed / state.car.maxForwardSpeed,
    0,
    1
  );
  const driftBlend = state.car.driftBlend;
  const driftSide = state.car.driftDirection;

  temp.desiredCamera
    .copy(temp.carPosition)
    .addScaledVector(temp.forward, -(state.cameraRig.distance + speedRatio * 0.65))
    .addScaledVector(temp.right, driftSide * driftBlend * 1.1)
    .add(new THREE.Vector3(0, state.cameraRig.height + speedRatio * 0.32, 0));

  const combinedShake =
    state.cameraRig.shake + driftBlend * 0.1 + Math.max(0, speedRatio - 0.72) * 0.06;
  if (combinedShake > 0) {
    temp.desiredCamera.x += (Math.random() - 0.5) * combinedShake;
    temp.desiredCamera.y += (Math.random() - 0.5) * combinedShake * 0.45;
    temp.desiredCamera.z += (Math.random() - 0.5) * combinedShake;
  }

  temp.desiredLook
    .copy(temp.carPosition)
    .addScaledVector(temp.forward, state.cameraRig.lookAhead + speedRatio * 1.2)
    .addScaledVector(temp.right, driftSide * driftBlend * 0.3)
    .add(new THREE.Vector3(0, state.cameraRig.lookHeight, 0));

  camera.position.lerp(temp.desiredCamera, 1 - Math.exp(-4.2 * dt));
  temp.currentLook.lerp(temp.desiredLook, 1 - Math.exp(-5.2 * dt));
  camera.lookAt(temp.currentLook);
  camera.rotateZ(driftBlend * driftSide * -0.09);
  camera.fov = THREE.MathUtils.lerp(
    camera.fov,
    58 + speedRatio * 8 + driftBlend * 5,
    1 - Math.exp(-4.5 * dt)
  );
  camera.updateProjectionMatrix();
}

function updateAudio() {
  if (!state.soundUnlocked || !state.car) {
    return;
  }

  const speedRatio = THREE.MathUtils.clamp(
    state.car.totalSpeed / state.car.maxForwardSpeed,
    0,
    1
  );
  const shouldPlayEngine =
    state.runActive &&
    !state.restartTween &&
    !state.successTween &&
    (speedRatio > 0.02 || Math.abs(state.car.driveSpeed) > 0.15);

  if (shouldPlayEngine && !state.enginePlaying) {
    sounds.engine.play();
    state.enginePlaying = true;
  } else if (!shouldPlayEngine && state.enginePlaying) {
    sounds.engine.pause();
    state.enginePlaying = false;
  }

  if (state.enginePlaying) {
    sounds.engine.volume(0.1 + speedRatio * 0.18);
    sounds.engine.rate(0.82 + speedRatio * 0.92);
  }

  const shouldPlaySkid =
    state.runActive &&
    isDriftModeActive() &&
    !state.restartTween &&
    !state.successTween &&
    state.drift.active &&
    state.car.totalSpeed > 3.2;

  if (shouldPlaySkid && !state.skidPlaying) {
    sounds.skid.play();
    state.skidPlaying = true;
  } else if (!shouldPlaySkid && state.skidPlaying) {
    sounds.skid.pause();
    state.skidPlaying = false;
  }

  if (state.skidPlaying) {
    sounds.skid.volume(0.08 + state.car.driftBlend * 0.18);
    sounds.skid.rate(0.84 + speedRatio * 0.62);
  }
}

function updateTechniqueLabel(result = null) {
  if (!techniqueLabelEl) {
    return;
  }

  const mode = getCurrentMode();
  if (isDriftModeActive()) {
    if (state.successTween) {
      techniqueLabelEl.textContent = "Locked In";
    } else if (state.restartTween) {
      techniqueLabelEl.textContent = "Retry";
    } else if (state.drift.active) {
      techniqueLabelEl.textContent = "Sliding";
    } else if (result?.inside && result?.driftRecent) {
      techniqueLabelEl.textContent = "Catch It";
    } else if (performance.now() < state.drift.recentUntil) {
      techniqueLabelEl.textContent = "Drift Recent";
    } else {
      techniqueLabelEl.textContent = state.drift.usedThisRun ? "Re-arm Drift" : "Drift Needed";
    }
    return;
  }

  if (mode.id === "reverse-only" || isReverseOnlyActive()) {
    techniqueLabelEl.textContent = "Reverse Focus";
  } else if (mode.id === "one-scratch") {
    techniqueLabelEl.textContent = "No Contact";
  } else {
    techniqueLabelEl.textContent = "Grip Run";
  }
}

function updateDriftEffects(delta) {
  state.driftMarks = state.driftMarks.filter((mark) => {
    mark.life -= delta;
    if (mark.life <= 0) {
      mark.mesh.removeFromParent();
      mark.mesh.material.dispose();
      return false;
    }

    mark.mesh.material.opacity = mark.baseOpacity * (mark.life / mark.maxLife);
    return true;
  });

  state.smokePuffs = state.smokePuffs.filter((puff) => {
    puff.life -= delta;
    if (puff.life <= 0) {
      puff.sprite.removeFromParent();
      puff.sprite.material.dispose();
      return false;
    }

    puff.sprite.position.addScaledVector(puff.velocity, delta);
    puff.sprite.scale.multiplyScalar(1 + delta * 0.9);
    puff.sprite.material.opacity = puff.baseOpacity * (puff.life / puff.maxLife);
    return true;
  });

  if (!state.car || !isDriftModeActive() || !state.drift.active || state.car.totalSpeed < 4) {
    if (state.car) {
      state.car.rearTrackPoints.left = null;
      state.car.rearTrackPoints.right = null;
    }
    return;
  }

  state.car.rearWheelPivots[0].getWorldPosition(temp.rearLeftWheel);
  state.car.rearWheelPivots[1].getWorldPosition(temp.rearRightWheel);
  temp.rearLeftWheel.y = 0.015;
  temp.rearRightWheel.y = 0.015;

  if (!state.car.rearTrackPoints.left || !state.car.rearTrackPoints.right) {
    state.car.rearTrackPoints.left = temp.rearLeftWheel.clone();
    state.car.rearTrackPoints.right = temp.rearRightWheel.clone();
  }

  const now = performance.now();
  if (now - state.drift.lastMarkAt > 34) {
    createTireMark(state.car.rearTrackPoints.left, temp.rearLeftWheel);
    createTireMark(state.car.rearTrackPoints.right, temp.rearRightWheel);
    state.car.rearTrackPoints.left.copy(temp.rearLeftWheel);
    state.car.rearTrackPoints.right.copy(temp.rearRightWheel);
    state.drift.lastMarkAt = now;
  }

  if (now - state.drift.lastSmokeAt > 72) {
    spawnSmokePuff(temp.rearLeftWheel);
    spawnSmokePuff(temp.rearRightWheel);
    state.drift.lastSmokeAt = now;
  }
}

function createTireMark(start, end) {
  if (!start || !end) {
    return;
  }

  const distance = start.distanceTo(end);
  if (distance < 0.08 || distance > 1.4) {
    return;
  }

  const material = new THREE.MeshBasicMaterial({
    color: "#17191d",
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
  });
  const mark = new THREE.Mesh(sharedGeometries.box, material);
  mark.position.copy(start).add(end).multiplyScalar(0.5);
  mark.position.y = 0.012;
  mark.scale.set(0.16, 0.004, distance);
  mark.rotation.y = Math.atan2(end.x - start.x, end.z - start.z);
  tireMarkRoot.add(mark);

  state.driftMarks.push({
    mesh: mark,
    life: 4.2,
    maxLife: 4.2,
    baseOpacity: 0.34,
  });
}

function spawnSmokePuff(origin) {
  const material = new THREE.SpriteMaterial({
    map: smokeTexture,
    color: "#dce2e7",
    transparent: true,
    opacity: 0.24,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(material);
  const size = 0.7 + Math.random() * 0.45;

  sprite.position.copy(origin);
  sprite.position.y = 0.34;
  sprite.scale.set(size, size, size);
  smokeRoot.add(sprite);

  const maxLife = 0.55 + Math.random() * 0.2;
  state.smokePuffs.push({
    sprite,
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 0.22 + state.car.driftDirection * 0.08,
      0.58 + Math.random() * 0.18,
      (Math.random() - 0.5) * 0.22
    ),
    life: maxLife,
    maxLife,
    baseOpacity: 0.24,
  });
}

function extractYaw(quaternion) {
  const euler = new THREE.Euler().setFromQuaternion(
    new THREE.Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w),
    "YXZ"
  );
  return euler.y;
}

function normalizeAngle(angle) {
  let normalized = angle;
  while (normalized > Math.PI) {
    normalized -= Math.PI * 2;
  }
  while (normalized < -Math.PI) {
    normalized += Math.PI * 2;
  }
  return normalized;
}

function moveToward(value, target, maxDelta) {
  if (Math.abs(target - value) <= maxDelta) {
    return target;
  }
  return value + Math.sign(target - value) * maxDelta;
}

function damp(value, target, lambda, dt) {
  return THREE.MathUtils.lerp(value, target, 1 - Math.exp(-lambda * dt));
}

function createAsphaltTexture() {
  const canvasTexture = document.createElement("canvas");
  canvasTexture.width = 256;
  canvasTexture.height = 256;
  const context = canvasTexture.getContext("2d");

  context.fillStyle = "#48535d";
  context.fillRect(0, 0, canvasTexture.width, canvasTexture.height);

  for (let i = 0; i < 800; i += 1) {
    const value = Math.floor(40 + Math.random() * 65);
    const alpha = 0.12 + Math.random() * 0.18;
    context.fillStyle = `rgba(${value}, ${value}, ${value}, ${alpha})`;
    const size = 1 + Math.random() * 3;
    context.fillRect(
      Math.random() * canvasTexture.width,
      Math.random() * canvasTexture.height,
      size,
      size
    );
  }

  for (let i = 0; i < 40; i += 1) {
    context.fillStyle = "rgba(255,255,255,0.03)";
    context.fillRect(Math.random() * 256, Math.random() * 256, 28, 1);
  }

  const texture = new THREE.CanvasTexture(canvasTexture);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

function createSmokeTexture() {
  const smokeCanvas = document.createElement("canvas");
  smokeCanvas.width = 128;
  smokeCanvas.height = 128;
  const context = smokeCanvas.getContext("2d");
  const gradient = context.createRadialGradient(64, 64, 8, 64, 64, 58);
  gradient.addColorStop(0, "rgba(255,255,255,0.75)");
  gradient.addColorStop(0.45, "rgba(220,228,236,0.34)");
  gradient.addColorStop(1, "rgba(220,228,236,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(smokeCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
