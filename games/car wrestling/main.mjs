import * as THREE from "./vendor/three/build/three.module.js";
import * as CANNON from "./vendor/cannon-es.js";

const gsap = window.gsap;
const Howl = window.Howl;
const Howler = window.Howler;

if (!gsap || !Howl || !Howler) {
  throw new Error("Local vendor libraries failed to initialize for Car Wrestling.");
}

const STORAGE_KEY = "car-survival-theme";
const ARENA_STORAGE_KEY = "car-survival-arena";
const PANELS_STORAGE_KEY = "car-survival-panels";
const GAMEHUB_EMBEDDED_PATH = "/games/car wrestling/";

const CONFIG = {
  arena: {
    initialRadius: 20,
    minimumRadius: 7,
    tileSize: 2.35,
    tileHeight: 1,
    platformY: 0,
    fallLimit: -14,
    shrinkDelay: 10,
    shrinkRate: 0.36,
  },
  cars: {
    count: 6,
    mass: 96,
    width: 1.8,
    height: 1.05,
    length: 3.3,
    rideHeight: 0.62,
    maxForwardSpeed: 18,
    maxReverseSpeed: 8.5,
    engineForce: 760,
    reverseForce: 420,
    steerTorque: 150,
    turnRate: 2.75,
    driveAuthority: 7.2,
    idleBrake: 6.2,
    boostDuration: 1.05,
    boostCooldown: 4.8,
    boostMultiplier: 1.75,
    boostTurnMultiplier: 1.08,
    grip: 0.3,
    angularDrag: 0.9,
    linearDamping: 0.22,
    angularDamping: 0.38,
  },
  powerups: {
    maxActive: 4,
    minRespawn: 2.4,
    maxRespawn: 5.2,
    lifetime: 14,
    pickupRadius: 1.85,
    spawnMargin: 3.2,
  },
  camera: {
    distance: 11.5,
    height: 6.2,
    lookHeight: 1.4,
  },
};

const ARENA_TYPES = {
  standard: {
    label: "Standard Arena",
    note: "Balanced grip and speed for classic bumper battles.",
    physics: {
      groundFriction: 0.72,
      carFriction: 0.42,
      gripMultiplier: 1.18,
      engineMultiplier: 1,
      topSpeedMultiplier: 1,
      reverseMultiplier: 1,
      steerMultiplier: 1,
      angularDragMultiplier: 1,
      linearDamping: 0.22,
      angularDamping: 0.38,
    },
    palette: {
      light: {},
      dark: {},
    },
  },
  ice: {
    label: "Ice Arena",
    note: "Slippery handling with longer slides and looser steering.",
    physics: {
      groundFriction: 0.09,
      carFriction: 0.24,
      gripMultiplier: 0.34,
      engineMultiplier: 0.92,
      topSpeedMultiplier: 1.14,
      reverseMultiplier: 0.9,
      steerMultiplier: 0.76,
      angularDragMultiplier: 0.8,
      linearDamping: 0.1,
      angularDamping: 0.2,
    },
    palette: {
      light: {
        platform: 0xdff3ff,
        platformEdge: 0x7ca7cf,
        support: 0xc1dbef,
        zone: 0x65bdf4,
        pulse: 0xbce7ff,
        center: 0xf4fbff,
        ground: 0xb5cad8,
      },
      dark: {
        platform: 0x182733,
        platformEdge: 0x5d8ab2,
        support: 0x2a4254,
        zone: 0x7acbff,
        pulse: 0xbee9ff,
        center: 0x111b24,
        ground: 0x1c2832,
      },
    },
  },
  sand: {
    label: "Sand Arena",
    note: "Heavier traction but slower acceleration through deep sand.",
    physics: {
      groundFriction: 0.9,
      carFriction: 0.42,
      gripMultiplier: 1.42,
      engineMultiplier: 0.72,
      topSpeedMultiplier: 0.76,
      reverseMultiplier: 0.74,
      steerMultiplier: 0.9,
      angularDragMultiplier: 1.08,
      linearDamping: 0.3,
      angularDamping: 0.44,
    },
    palette: {
      light: {
        platform: 0xe3c594,
        platformEdge: 0xc18840,
        support: 0xc69d65,
        zone: 0xcd7d34,
        pulse: 0xf4c787,
        center: 0xf0ddbe,
        ground: 0xcaa473,
      },
      dark: {
        platform: 0x352819,
        platformEdge: 0xa0692d,
        support: 0x59402a,
        zone: 0xe4a662,
        pulse: 0xf5c888,
        center: 0x241a10,
        ground: 0x3b2a1b,
      },
    },
  },
  moving: {
    label: "Moving Platform",
    note: "The whole arena drifts and rotates under the cars mid-fight.",
    physics: {
      groundFriction: 0.58,
      carFriction: 0.4,
      gripMultiplier: 1.08,
      engineMultiplier: 1.02,
      topSpeedMultiplier: 1.02,
      reverseMultiplier: 1,
      steerMultiplier: 1.04,
      angularDragMultiplier: 1,
      linearDamping: 0.22,
      angularDamping: 0.38,
    },
    motion: {
      shiftX: 1.05,
      shiftZ: 0.82,
      shiftSpeed: 0.42,
      yawAmplitude: 0.11,
      yawSpeed: 0.28,
      carAssist: 1.2,
    },
    palette: {
      light: {
        platform: 0xd9d3cb,
        platformEdge: 0x8a7e72,
        support: 0xb2a79a,
        zone: 0x8f6ff2,
        pulse: 0xd7c8ff,
        center: 0xf3eee7,
        ground: 0xb1a69b,
      },
      dark: {
        platform: 0x2a2623,
        platformEdge: 0x8b7d73,
        support: 0x4b443e,
        zone: 0xc0a6ff,
        pulse: 0xe2d7ff,
        center: 0x161312,
        ground: 0x27211d,
      },
    },
  },
};

const THEMES = {
  light: {
    sceneFog: 0xf8f2e7,
    ambient: 0xfff6ec,
    keyLight: 0xffecd2,
    rimLight: 0xc0d9ff,
    platform: 0xe9ddcc,
    platformEdge: 0xc9a983,
    support: 0xceb89a,
    zone: 0xb56d30,
    pulse: 0xf7c78c,
    center: 0xf4ead8,
    grid: 0xcfb394,
    glass: 0xeff7ff,
    ground: 0xc9b49b,
  },
  dark: {
    sceneFog: 0x120f0c,
    ambient: 0x5d4e42,
    keyLight: 0xffd6a8,
    rimLight: 0x83a8d6,
    platform: 0x2b241f,
    platformEdge: 0x8a6a48,
    support: 0x4d3e32,
    zone: 0xe1b27d,
    pulse: 0xffd2a5,
    center: 0x1b1612,
    grid: 0x7f664f,
    glass: 0x97adc0,
    ground: 0x261f19,
  },
};

const POWERUP_TYPES = {
  speed: {
    label: "Speed Boost",
    color: 0x59c8ff,
    cssColor: "#59c8ff",
    duration: 8,
    speedMultiplier: 1.38,
    shape: "octa",
  },
  knockback: {
    label: "Knockback Boost",
    color: 0xff9364,
    cssColor: "#ff9364",
    duration: 7,
    knockbackMultiplier: 2.25,
    shape: "box",
  },
  shield: {
    label: "Shield",
    color: 0xffd76b,
    cssColor: "#ffd76b",
    duration: 9,
    charges: 1,
    shape: "ico",
  },
  weight: {
    label: "Weight Boost",
    color: 0x88dd74,
    cssColor: "#88dd74",
    duration: 8,
    massMultiplier: 1.7,
    shape: "dodeca",
  },
};

const PLAYER_COLORS = {
  body: 0xdf6b45,
  roof: 0xffd7af,
  trim: 0x35251d,
};

const OPPONENT_COLORS = [
  { body: 0x4b87d7, roof: 0xcfe4ff, trim: 0x1a2029 },
  { body: 0x4ea86d, roof: 0xdcffe8, trim: 0x162116 },
  { body: 0xd9a441, roof: 0xffefca, trim: 0x35270d },
  { body: 0xc96fbd, roof: 0xf8daf6, trim: 0x321a31 },
  { body: 0xe16e55, roof: 0xffddcf, trim: 0x331b16 },
  { body: 0x6b74dd, roof: 0xdadfff, trim: 0x1b1f37 },
];

const body = document.body;
const hudBar = document.querySelector(".hud-bar");
const arenaStage = document.querySelector(".arena-stage");
const sceneRoot = document.getElementById("scene-root");
const carsLeftEl = document.getElementById("cars-left");
const zoneSizeEl = document.getElementById("zone-size");
const arenaCurrentEl = document.getElementById("arena-current");
const arenaNoteEl = document.getElementById("arena-note");
const arenaSelectEl = document.getElementById("arena-select");
const arenaRandomEl = document.getElementById("arena-random");
const boostStatusEl = document.getElementById("boost-status");
const roomCurrentEl = document.getElementById("room-current");
const roomNoteEl = document.getElementById("room-note");
const playersConnectedEl = document.getElementById("players-connected");
const homeButton = document.getElementById("home-button");
const panelsToggle = document.getElementById("panels-toggle");
const panelsToggleLabel = panelsToggle.querySelector(".panels-toggle-label");
const headerPeekToggle = document.getElementById("header-peek-toggle");
const headerPeekToggleLabel = headerPeekToggle.querySelector(".header-peek-toggle-label");
const leftPanelEl = document.getElementById("side-panel-left");
const rightPanelEl = document.getElementById("side-panel-right");
const leftPanelToggle = document.getElementById("left-panel-toggle");
const leftPanelToggleLabel = leftPanelToggle.querySelector(".left-panel-toggle-label");
const rightPanelToggle = document.getElementById("right-panel-toggle");
const rightPanelToggleLabel = rightPanelToggle.querySelector(".right-panel-toggle-label");
const homeScreenEl = document.getElementById("home-screen");
const homeAiArenaSelectEl = document.getElementById("home-ai-arena-select");
const homeAiCountSelectEl = document.getElementById("home-ai-count-select");
const startAiMatchButton = document.getElementById("start-ai-match");
const homeRoomArenaSelectEl = document.getElementById("home-room-arena-select");
const roomIdInputEl = document.getElementById("room-id-input");
const roomCreateButton = document.getElementById("room-create");
const roomJoinButton = document.getElementById("room-join");
const roomLeaveButton = document.getElementById("room-leave");
const roomLobbyPanel = document.getElementById("room-lobby-panel");
const roomLobbyIdEl = document.getElementById("room-lobby-id");
const roomHostBadgeEl = document.getElementById("room-host-badge");
const roomLobbyNoteEl = document.getElementById("room-lobby-note");
const roomLobbyCountEl = document.getElementById("room-lobby-count");
const roomLobbyPhaseEl = document.getElementById("room-lobby-phase");
const roomLobbyListEl = document.getElementById("room-lobby-list");
const roomStartButton = document.getElementById("room-start");
const roomDiscardButton = document.getElementById("room-discard");
const themeToggle = document.getElementById("theme-toggle");
const themeLabel = themeToggle.querySelector(".toggle-label");
const powerupListEl = document.getElementById("powerup-list");
const statusPanel = document.getElementById("status-panel");
const statusTitle = document.getElementById("status-title");
const statusSubtitle = document.getElementById("status-subtitle");
const impactFlash = document.getElementById("impact-flash");
const socketFactory = typeof window !== "undefined" ? window.io : null;
const currentPath = typeof window !== "undefined" ? decodeURI(window.location.pathname || "").toLowerCase() : "";
const usesGameHubRoomBridge = currentPath.includes(GAMEHUB_EMBEDDED_PATH);
const multiplayerSupported = Boolean(socketFactory);
const ROOM_SOCKET_EVENTS = usesGameHubRoomBridge
  ? {
      roomState: "carwrestling:room:state",
      roomLeft: "carwrestling:room:left",
      roomClosed: "carwrestling:room:closed",
      roomKicked: "carwrestling:room:kicked",
      roomCreate: "carwrestling:room:create",
      roomJoin: "carwrestling:room:join",
      roomLeave: "carwrestling:room:leave",
      roomStart: "carwrestling:room:start",
      roomDiscard: "carwrestling:room:discard",
      roomKick: "carwrestling:room:kick",
      roomRestart: "carwrestling:room:restart",
      playerInput: "carwrestling:player:input",
      playerBoost: "carwrestling:player:boost",
    }
  : {
      roomState: "room:state",
      roomLeft: "room:left",
      roomClosed: "room:closed",
      roomKicked: "room:kicked",
      roomCreate: "room:create",
      roomJoin: "room:join",
      roomLeave: "room:leave",
      roomStart: "room:start",
      roomDiscard: "room:discard",
      roomKick: "room:kick",
      roomRestart: "room:restart",
      playerInput: "player:input",
      playerBoost: "player:boost",
    };

const clamp = THREE.MathUtils.clamp;
const lerp = THREE.MathUtils.lerp;
const FORWARD_AXIS = new CANNON.Vec3(0, 0, 1);
const RIGHT_AXIS = new CANNON.Vec3(1, 0, 0);
const UP_AXIS = new CANNON.Vec3(0, 1, 0);

function lerpAngle(start, end, amount) {
  let delta = end - start;
  while (delta > Math.PI) {
    delta -= Math.PI * 2;
  }
  while (delta < -Math.PI) {
    delta += Math.PI * 2;
  }
  return start + delta * amount;
}

function normalizeAngle(angle) {
  let nextAngle = angle;
  while (nextAngle > Math.PI) {
    nextAngle -= Math.PI * 2;
  }
  while (nextAngle < -Math.PI) {
    nextAngle += Math.PI * 2;
  }
  return nextAngle;
}

function getCircularSpawnPoints(count, radius = CONFIG.arena.initialRadius * 0.55) {
  const total = Math.max(count, 1);
  const spawnPoints = [];

  for (let index = 0; index < total; index += 1) {
    const ringAngle = (index / total) * Math.PI * 2 - Math.PI * 0.5;
    spawnPoints.push({
      x: Math.cos(ringAngle) * radius,
      z: Math.sin(ringAngle) * radius,
      yaw: normalizeAngle(-ringAngle - Math.PI * 0.5),
    });
  }

  return spawnPoints;
}

function writeAscii(view, offset, text) {
  for (let i = 0; i < text.length; i += 1) {
    view.setUint8(offset + i, text.charCodeAt(i));
  }
}

function createWaveUrl({ duration, volume, generator, sampleRate = 22050 }) {
  const totalSamples = Math.floor(duration * sampleRate);
  const buffer = new ArrayBuffer(44 + totalSamples * 2);
  const view = new DataView(buffer);

  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + totalSamples * 2, true);
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
  view.setUint32(40, totalSamples * 2, true);

  for (let i = 0; i < totalSamples; i += 1) {
    const t = i / sampleRate;
    const envelope = i / totalSamples;
    const sample = clamp(generator(t, envelope), -1, 1) * volume;
    view.setInt16(44 + i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }

  return URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
}

function createAudioSet() {
  const engineUrl = createWaveUrl({
    duration: 1.1,
    volume: 0.42,
    generator: (t) => {
      const base = Math.sin(Math.PI * 2 * 55 * t);
      const harmonic = 0.45 * Math.sin(Math.PI * 2 * 110 * t + Math.sin(t * 12) * 0.45);
      const grit = 0.18 * Math.sin(Math.PI * 2 * 220 * t);
      const wobble = 0.12 * Math.sin(Math.PI * 2 * 4.2 * t);
      return Math.tanh((base + harmonic + grit) * (0.7 + wobble));
    },
  });

  const impactUrl = createWaveUrl({
    duration: 0.18,
    volume: 0.62,
    generator: (t, envelope) => {
      const decay = Math.pow(1 - envelope, 2.6);
      const freq = 150 - envelope * 90;
      const tone = Math.sin(Math.PI * 2 * freq * t) * 0.55;
      const noise = (Math.random() * 2 - 1) * 0.9;
      return (tone + noise * 0.75) * decay;
    },
  });

  const eliminateUrl = createWaveUrl({
    duration: 0.7,
    volume: 0.58,
    generator: (t, envelope) => {
      const decay = Math.pow(1 - envelope, 1.8);
      const freq = 420 - envelope * 280;
      const tone = Math.sin(Math.PI * 2 * freq * t);
      const overtone = 0.4 * Math.sin(Math.PI * 2 * freq * 0.5 * t);
      return (tone + overtone) * decay;
    },
  });

  const pickupUrl = createWaveUrl({
    duration: 0.28,
    volume: 0.46,
    generator: (t, envelope) => {
      const decay = Math.pow(1 - envelope, 1.7);
      const noteA = Math.sin(Math.PI * 2 * 620 * t);
      const noteB = Math.sin(Math.PI * 2 * 890 * t) * 0.55;
      return (noteA + noteB) * decay;
    },
  });

  const activateUrl = createWaveUrl({
    duration: 0.42,
    volume: 0.48,
    generator: (t, envelope) => {
      const decay = Math.pow(1 - envelope, 1.35);
      const freq = 260 + envelope * 180;
      const tone = Math.sin(Math.PI * 2 * freq * t);
      const shimmer = Math.sin(Math.PI * 2 * freq * 1.8 * t) * 0.34;
      return (tone + shimmer) * decay;
    },
  });

  return {
    engine: new Howl({
      src: [engineUrl],
      format: ["wav"],
      loop: true,
      volume: 0,
      preload: true,
      html5: false,
    }),
    impact: new Howl({
      src: [impactUrl],
      format: ["wav"],
      volume: 0.45,
      preload: true,
      pool: 8,
    }),
    eliminate: new Howl({
      src: [eliminateUrl],
      format: ["wav"],
      volume: 0.42,
      preload: true,
      pool: 4,
    }),
    pickup: new Howl({
      src: [pickupUrl],
      format: ["wav"],
      volume: 0.34,
      preload: true,
      pool: 6,
    }),
    activate: new Howl({
      src: [activateUrl],
      format: ["wav"],
      volume: 0.3,
      preload: true,
      pool: 6,
    }),
  };
}

class ArenaGame {
  constructor() {
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.clock = new THREE.Clock();
    this.world = null;
    this.cars = [];
    this.tiles = [];
    this.supports = [];
    this.powerUps = [];
    this.aiCars = [];
    this.player = null;
    this.frameId = 0;
    this.resizeFrame = 0;
    this.resizeObserver = null;
    this.currentRadius = CONFIG.arena.initialRadius;
    this.elapsed = 0;
    this.gameState = "running";
    this.mode = "solo";
    this.homeVisible = true;
    this.aiTargetCount = CONFIG.cars.count;
    this.currentArenaId = this.getStoredArenaId();
    this.currentArena = ARENA_TYPES[this.currentArenaId];
    this.panelVisibility = this.getStoredPanelVisibility();
    this.input = {
      forward: false,
      backward: false,
      left: false,
      right: false,
    };
    this.socket = null;
    this.networkPlayerId = null;
    this.networkRoomId = null;
    this.roomHostId = null;
    this.roomPhase = "home";
    this.roomPlayers = [];
    this.isRoomHost = false;
    this.roomMinPlayers = 2;
    this.roomMaxPlayers = 5;
    this.connectedPlayers = 1;
    this.roomMessage = multiplayerSupported
      ? "Create a room or join with an ID to battle other players live."
      : "Socket.IO client did not load. Restart the server and refresh the page.";
    this.multiplayerStatusKey = "";
    this.multiplayerReady = false;
    this.networkInputTimer = 0;
    this.lastSentInput = {
      throttle: 0,
      steer: 0,
    };
    this.audioUnlocked = false;
    this.engineSoundId = null;
    this.lastFlashTime = 0;
    this.tempForward = new CANNON.Vec3();
    this.tempRight = new CANNON.Vec3();
    this.tempForce = new CANNON.Vec3();
    this.tempImpulse = new CANNON.Vec3();
    this.tempArenaQuat = new CANNON.Quaternion();
    this.cameraPosition = new THREE.Vector3();
    this.cameraLook = new THREE.Vector3();
    this.cameraShake = 0;
    this.arenaMotion = {
      offsetX: 0,
      offsetZ: 0,
      yaw: 0,
      velX: 0,
      velZ: 0,
      yawVelocity: 0,
    };
    this.cameraRig = {
      distance: CONFIG.camera.distance,
      height: CONFIG.camera.height,
    };
    this.cameraGoal = {
      distance: CONFIG.camera.distance,
      height: CONFIG.camera.height,
    };
    this.zonePulseTween = null;
    this.powerUpSpawnTimer = 1.8;
    this.arenaFloorBody = null;
    this.materials = {
      tile: [],
      support: [],
      ring: [],
      pulse: [],
      center: [],
      glass: [],
      ground: [],
    };
    this.theme = localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
    this.sounds = null;

    this.initThree();
    this.initPhysics();
    this.initLights();
    this.initEnvironment();
    this.initArenaUi();
    this.initMultiplayerUi();
    this.initHomeUi();
    this.initPanelUi();
    this.initInput();
    this.applyArenaPhysics();
    this.applyTheme(this.theme);
    this.resetRound();
    this.showHomeScreen();
    this.onResize();
    this.initLayoutObserver();
    window.addEventListener("resize", () => this.scheduleResize());
    window.addEventListener("blur", () => this.clearInput());
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.clearInput();
      }
      if (this.sounds) {
        Howler.mute(document.hidden);
      }
    });
    this.animate();
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0xf8f2e7, 18, 90);

    this.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 180);
    this.camera.position.set(0, 12, 16);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    sceneRoot.tabIndex = 0;
    sceneRoot.appendChild(this.renderer.domElement);
  }

  scheduleResize() {
    if (this.resizeFrame) {
      return;
    }

    this.resizeFrame = requestAnimationFrame(() => {
      this.resizeFrame = 0;
      this.onResize();
    });
  }

  initLayoutObserver() {
    if (typeof ResizeObserver === "undefined") {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.scheduleResize();
    });

    this.resizeObserver.observe(sceneRoot);
    if (arenaStage) {
      this.resizeObserver.observe(arenaStage);
    }
    if (hudBar) {
      this.resizeObserver.observe(hudBar);
    }
  }

  initPhysics() {
    this.world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -26, 0),
    });
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);
    this.world.allowSleep = true;
    this.world.solver.iterations = 12;

    this.groundMaterial = new CANNON.Material("ground");
    this.carMaterial = new CANNON.Material("car");

    this.groundToCarContact = new CANNON.ContactMaterial(this.groundMaterial, this.carMaterial, {
      friction: 0.5,
      restitution: 0.05,
    });
    this.carToCarContact = new CANNON.ContactMaterial(this.carMaterial, this.carMaterial, {
      friction: 0.35,
      restitution: 0.16,
    });

    this.world.defaultContactMaterial.friction = 0.35;
    this.world.defaultContactMaterial.restitution = 0.02;
    this.world.addContactMaterial(this.groundToCarContact);
    this.world.addContactMaterial(this.carToCarContact);
  }

  initLights() {
    this.ambientLight = new THREE.HemisphereLight(0xffffff, 0xb59f86, 1.4);
    this.scene.add(this.ambientLight);

    this.keyLight = new THREE.DirectionalLight(0xffffff, 2.1);
    this.keyLight.position.set(16, 22, 10);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.set(2048, 2048);
    this.keyLight.shadow.camera.left = -28;
    this.keyLight.shadow.camera.right = 28;
    this.keyLight.shadow.camera.top = 28;
    this.keyLight.shadow.camera.bottom = -28;
    this.keyLight.shadow.camera.near = 1;
    this.keyLight.shadow.camera.far = 65;
    this.scene.add(this.keyLight);

    this.rimLight = new THREE.DirectionalLight(0x7ca4d0, 1.4);
    this.rimLight.position.set(-12, 14, -15);
    this.scene.add(this.rimLight);
  }

  initEnvironment() {
    this.worldGroup = new THREE.Group();
    this.scene.add(this.worldGroup);
    this.arenaSurfaceGroup = new THREE.Group();
    this.scene.add(this.arenaSurfaceGroup);

    const groundGeometry = new THREE.CircleGeometry(72, 56);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0xb8a28a,
      roughness: 0.98,
      metalness: 0.02,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -18;
    ground.receiveShadow = true;
    this.worldGroup.add(ground);
    this.materials.ground.push(groundMaterial);

    const grid = new THREE.GridHelper(120, 40, 0x87694d, 0xa68668);
    grid.position.y = -17.95;
    grid.material.opacity = 0.22;
    grid.material.transparent = true;
    this.worldGroup.add(grid);
    this.materials.ground.push(grid.material);

    const columnGeometry = new THREE.CylinderGeometry(0.45, 0.75, 14, 12);
    for (let i = 0; i < 14; i += 1) {
      const angle = (i / 14) * Math.PI * 2;
      const radius = 27 + (i % 2) * 4;
      const material = new THREE.MeshStandardMaterial({
        color: 0xbba284,
        roughness: 0.9,
        metalness: 0.04,
      });
      const column = new THREE.Mesh(columnGeometry, material);
      column.position.set(Math.cos(angle) * radius, -11, Math.sin(angle) * radius);
      column.rotation.y = angle;
      this.worldGroup.add(column);
      this.materials.support.push(material);
    }

    this.baseSupportMaterialCount = this.materials.support.length;
  }

  initInput() {
    const keyListenerOptions = { capture: true };
    window.addEventListener("keydown", (event) => {
      this.handleKey(event, true);
    }, keyListenerOptions);
    window.addEventListener("keyup", (event) => {
      this.handleKey(event, false);
    }, keyListenerOptions);

    const unlockAudio = async () => {
      if (this.audioUnlocked) {
        return;
      }
      const sounds = this.ensureSounds();
      try {
        if (Howler.ctx && Howler.ctx.state !== "running") {
          await Howler.ctx.resume();
        }
      } catch (error) {
        console.warn("Audio resume failed.", error);
      }
      this.audioUnlocked = true;
      if (sounds && this.engineSoundId === null) {
        this.engineSoundId = sounds.engine.play();
        sounds.engine.volume(0, this.engineSoundId);
      }
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };

    window.addEventListener("pointerdown", unlockAudio);
    window.addEventListener("keydown", unlockAudio);
    sceneRoot.addEventListener("pointerdown", () => {
      sceneRoot.focus();
    });

    themeToggle.addEventListener("click", () => {
      const nextTheme = this.theme === "light" ? "dark" : "light";
      this.applyTheme(nextTheme);
    });
  }

  getStoredPanelVisibility() {
    try {
      const storedValue = localStorage.getItem(PANELS_STORAGE_KEY);
      if (!storedValue) {
        return { left: true, right: true };
      }

      const parsed = JSON.parse(storedValue);
      return {
        header: parsed?.header !== false,
        left: parsed?.left !== false,
        right: parsed?.right !== false,
      };
    } catch (error) {
      return { header: true, left: true, right: true };
    }
  }

  storePanelVisibility() {
    localStorage.setItem(PANELS_STORAGE_KEY, JSON.stringify(this.panelVisibility));
  }

  applyPanelVisibility() {
    const headerVisible = this.panelVisibility.header !== false;
    const leftVisible = this.panelVisibility.left !== false;
    const rightVisible = this.panelVisibility.right !== false;
    const bothVisible = leftVisible && rightVisible;
    const layoutVisible = headerVisible && bothVisible;

    body.classList.toggle("header-hidden", !headerVisible);
    body.classList.toggle("left-panel-hidden", !leftVisible);
    body.classList.toggle("right-panel-hidden", !rightVisible);

    hudBar.setAttribute("aria-hidden", String(!headerVisible));
    leftPanelEl.setAttribute("aria-hidden", String(!leftVisible));
    rightPanelEl.setAttribute("aria-hidden", String(!rightVisible));

    panelsToggleLabel.textContent = layoutVisible ? "Hide Layout" : "Show Layout";
    headerPeekToggleLabel.textContent = layoutVisible ? "Hide Layout" : "Show Layout";
    leftPanelToggleLabel.textContent = leftVisible ? "Hide Left" : "Show Left";
    rightPanelToggleLabel.textContent = rightVisible ? "Hide Right" : "Show Right";
    this.scheduleResize();
  }

  setPanelVisibilityState(nextState, { persist = true } = {}) {
    this.panelVisibility.header = nextState.header !== false;
    this.panelVisibility.left = nextState.left !== false;
    this.panelVisibility.right = nextState.right !== false;
    if (persist) {
      this.storePanelVisibility();
    }
    this.applyPanelVisibility();
  }

  togglePanel(side) {
    if (side !== "left" && side !== "right") {
      return;
    }

    this.setPanelVisibilityState({
      ...this.panelVisibility,
      [side]: !this.panelVisibility[side],
    });
  }

  toggleAllPanels() {
    const allVisible =
      this.panelVisibility.header !== false &&
      this.panelVisibility.left !== false &&
      this.panelVisibility.right !== false;
    this.setPanelVisibilityState({
      header: !allVisible,
      left: !allVisible,
      right: !allVisible,
    });
  }

  initPanelUi() {
    panelsToggle.addEventListener("click", () => {
      this.toggleAllPanels();
    });

    headerPeekToggle.addEventListener("click", () => {
      this.toggleAllPanels();
    });

    leftPanelToggle.addEventListener("click", () => {
      this.togglePanel("left");
    });

    rightPanelToggle.addEventListener("click", () => {
      this.togglePanel("right");
    });

    this.applyPanelVisibility();
  }

  getStoredArenaId() {
    const storedArenaId = localStorage.getItem(ARENA_STORAGE_KEY);
    return ARENA_TYPES[storedArenaId] ? storedArenaId : "standard";
  }

  initArenaUi() {
    arenaSelectEl.innerHTML = Object.entries(ARENA_TYPES)
      .map(([arenaId, arena]) => `<option value="${arenaId}">${arena.label}</option>`)
      .join("");

    arenaSelectEl.addEventListener("change", (event) => {
      this.setArena(event.target.value);
      sceneRoot.focus();
    });

    arenaRandomEl.addEventListener("click", () => {
      this.randomizeArena();
      sceneRoot.focus();
    });

    this.updateArenaUi();
  }

  initMultiplayerUi() {
    roomIdInputEl.addEventListener("input", () => {
      roomIdInputEl.value = roomIdInputEl.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5);
    });

    roomCreateButton.addEventListener("click", () => {
      this.createRoom();
    });

    roomJoinButton.addEventListener("click", () => {
      this.joinRoom();
    });

    roomLeaveButton.addEventListener("click", () => {
      this.leaveRoom();
    });

    roomStartButton.addEventListener("click", () => {
      this.startRoomMatch();
    });

    roomDiscardButton.addEventListener("click", () => {
      this.discardRoom();
    });

    homeButton.addEventListener("click", () => {
      this.goHome();
    });

    this.updateRoomUi();
  }

  initHomeUi() {
    const arenaOptions = Object.entries(ARENA_TYPES)
      .map(([arenaId, arena]) => `<option value="${arenaId}">${arena.label}</option>`)
      .join("");

    homeAiArenaSelectEl.innerHTML = arenaOptions;
    homeRoomArenaSelectEl.innerHTML = arenaOptions;
    homeAiArenaSelectEl.value = this.currentArenaId;
    homeRoomArenaSelectEl.value = this.currentArenaId;

    startAiMatchButton.addEventListener("click", () => {
      this.startAiMatchFromHome();
    });
  }

  showHomeScreen() {
    this.homeVisible = true;
    this.clearInput();
    this.hideStatus();
    body.classList.add("home-visible");
    homeScreenEl.classList.add("is-visible");
    this.updateRoomUi();
    this.scheduleResize();
  }

  hideHomeScreen() {
    this.homeVisible = false;
    body.classList.remove("home-visible");
    homeScreenEl.classList.remove("is-visible");
    this.updateRoomUi();
    this.scheduleResize();
  }

  goHome() {
    if (this.mode === "multiplayer" && this.networkRoomId) {
      this.leaveRoom();
      return;
    }

    this.showHomeScreen();
    this.roomMessage = "Choose a match from the home screen.";
    this.updateRoomUi();
  }

  startAiMatchFromHome() {
    this.mode = "solo";
    this.aiTargetCount = clamp(Number(homeAiCountSelectEl.value) || CONFIG.cars.count, 1, 7);
    this.setArena(homeAiArenaSelectEl.value, { restart: false });
    this.roomMessage = "Smart AI rivals are live in the arena.";
    this.hideHomeScreen();
    this.resetRound();
  }

  renderRoomLobby() {
    const inLobby = this.mode === "multiplayer" && this.networkRoomId && this.roomPhase === "lobby";
    roomLobbyPanel.hidden = !inLobby;

    if (!inLobby) {
      roomLobbyListEl.innerHTML = "";
      return;
    }

    roomLobbyIdEl.textContent = `ROOM ${this.networkRoomId}`;
    roomHostBadgeEl.textContent = this.isRoomHost ? "Host" : "Guest";
    roomLobbyNoteEl.textContent = this.roomMessage;
    roomLobbyCountEl.textContent = `${this.connectedPlayers} / ${this.roomMaxPlayers}`;
    roomLobbyPhaseEl.textContent = this.roomPhase === "lobby" ? "Lobby" : this.roomPhase;
    roomStartButton.disabled = !this.isRoomHost || this.connectedPlayers < this.roomMinPlayers;
    roomDiscardButton.disabled = !this.isRoomHost;

    roomLobbyListEl.innerHTML = this.roomPlayers
      .map((player) => {
        const chips = [];
        if (player.id === this.networkPlayerId) {
          chips.push('<span class="room-player-chip">You</span>');
        }
        if (player.isHost) {
          chips.push('<span class="room-player-chip">Host</span>');
        }
        if (this.isRoomHost && player.id !== this.networkPlayerId) {
          chips.push(`<button class="room-player-kick" type="button" data-kick-player="${player.id}">Remove</button>`);
        }

        return `
          <div class="room-player-row">
            <div class="room-player-meta">
              <strong>${player.name}</strong>
              <span>Seat ${(player.seatIndex ?? player.joinOrder ?? 0) + 1} facing center</span>
            </div>
            <div class="room-player-actions">${chips.join("")}</div>
          </div>
        `;
      })
      .join("");

    roomLobbyListEl.querySelectorAll("[data-kick-player]").forEach((button) => {
      button.addEventListener("click", () => {
        this.kickRoomPlayer(button.dataset.kickPlayer);
      });
    });
  }

  updateRoomUi() {
    const inRoom = this.mode === "multiplayer" && Boolean(this.networkRoomId);
    roomCurrentEl.textContent = inRoom ? `Room ${this.networkRoomId}` : this.mode === "solo" ? "Solo AI Match" : "Solo Practice";
    roomNoteEl.textContent = inRoom
      ? this.roomMessage
      : (multiplayerSupported ? "Open the home screen to create or join room matches." : "Socket.IO client did not load. Restart the server and refresh the page.");
    playersConnectedEl.textContent = String(this.connectedPlayers);
    roomIdInputEl.disabled = !multiplayerSupported || inRoom;
    roomCreateButton.disabled = !multiplayerSupported || inRoom;
    roomJoinButton.disabled = !multiplayerSupported || inRoom;
    roomLeaveButton.disabled = !inRoom;
    roomLeaveButton.hidden = !inRoom;
    arenaSelectEl.disabled = inRoom;
    arenaRandomEl.disabled = inRoom;
    homeAiArenaSelectEl.disabled = inRoom;
    homeAiCountSelectEl.disabled = inRoom;
    startAiMatchButton.disabled = inRoom;
    homeRoomArenaSelectEl.disabled = !multiplayerSupported || inRoom;
    roomIdInputEl.title = multiplayerSupported ? "" : "Socket.IO client did not load. Restart the server and refresh the page.";
    roomCreateButton.title = multiplayerSupported ? "" : "Socket.IO client did not load. Restart the server and refresh the page.";
    roomJoinButton.title = multiplayerSupported ? "" : "Socket.IO client did not load. Restart the server and refresh the page.";
    homeAiArenaSelectEl.value = this.currentArenaId;
    homeRoomArenaSelectEl.value = this.currentArenaId;
    this.renderRoomLobby();
  }

  ensureSocket() {
    if (!socketFactory) {
      this.roomMessage = "Socket.IO client did not load. Restart the server and refresh the page.";
      this.updateRoomUi();
      return null;
    }

    if (this.socket) {
      return this.socket;
    }

    this.socket = socketFactory({
      transports: ["websocket", "polling"],
    });

    this.socket.on("connect", () => {
      if (this.mode !== "multiplayer") {
        this.roomMessage = "Connected. Create a room or join an ID from the home screen.";
        this.updateRoomUi();
      }
    });

    this.socket.on("disconnect", () => {
      if (this.mode === "multiplayer") {
        this.leaveMultiplayerMode("Connection lost. Returned to the home screen.");
      } else {
        this.roomMessage = "Disconnected from multiplayer server. Solo AI is still available.";
        this.updateRoomUi();
      }
    });

    this.socket.on(ROOM_SOCKET_EVENTS.roomState, (snapshot) => {
      this.handleMultiplayerSnapshot(snapshot);
    });

    this.socket.on(ROOM_SOCKET_EVENTS.roomLeft, () => {
      if (this.mode === "multiplayer") {
        this.leaveMultiplayerMode("Returned to the home screen.");
      }
    });

    this.socket.on(ROOM_SOCKET_EVENTS.roomClosed, (payload) => {
      if (this.mode === "multiplayer") {
        this.leaveMultiplayerMode(payload?.message || "The room was closed.");
      }
    });

    this.socket.on(ROOM_SOCKET_EVENTS.roomKicked, (payload) => {
      if (this.mode === "multiplayer") {
        this.leaveMultiplayerMode(payload?.message || "The host removed you from the room.");
      }
    });

    return this.socket;
  }

  createRoom() {
    const socket = this.ensureSocket();
    if (!socket) {
      return;
    }

    this.roomMessage = "Creating room...";
    this.updateRoomUi();
    socket.emit(ROOM_SOCKET_EVENTS.roomCreate, { arenaId: homeRoomArenaSelectEl.value }, (response) => {
      if (!response || !response.ok) {
        this.roomMessage = response?.message || "Unable to create a room right now.";
        this.updateRoomUi();
        return;
      }

      this.enterMultiplayerMode(response.playerId, response.roomId, response.state);
    });
  }

  joinRoom() {
    const socket = this.ensureSocket();
    if (!socket) {
      return;
    }

    const roomId = roomIdInputEl.value.trim().toUpperCase();
    if (!roomId) {
      this.roomMessage = "Enter a room ID before joining.";
      this.updateRoomUi();
      return;
    }

    this.roomMessage = `Joining room ${roomId}...`;
    this.updateRoomUi();
    socket.emit(ROOM_SOCKET_EVENTS.roomJoin, { roomId }, (response) => {
      if (!response || !response.ok) {
        this.roomMessage = response?.message || "Unable to join that room.";
        this.updateRoomUi();
        return;
      }

      this.enterMultiplayerMode(response.playerId, response.roomId, response.state);
    });
  }

  startRoomMatch() {
    if (!this.socket?.connected || !this.networkRoomId) {
      return;
    }

    this.socket.emit(ROOM_SOCKET_EVENTS.roomStart, (response) => {
      if (!response?.ok) {
        this.roomMessage = response?.message || "Only the host can start the room match.";
        this.updateRoomUi();
      }
    });
  }

  discardRoom() {
    if (!this.socket?.connected || !this.networkRoomId) {
      return;
    }

    this.socket.emit(ROOM_SOCKET_EVENTS.roomDiscard, (response) => {
      if (!response?.ok) {
        this.roomMessage = response?.message || "Only the host can discard the room before the match starts.";
        this.updateRoomUi();
      }
    });
  }

  kickRoomPlayer(playerId) {
    if (!this.socket?.connected || !this.networkRoomId || !playerId) {
      return;
    }

    this.socket.emit(ROOM_SOCKET_EVENTS.roomKick, { playerId }, (response) => {
      if (!response?.ok) {
        this.roomMessage = response?.message || "Unable to remove that player.";
        this.updateRoomUi();
      }
    });
  }

  leaveRoom() {
    if (this.mode !== "multiplayer") {
      this.showHomeScreen();
      return;
    }

    if (this.socket?.connected) {
      this.socket.emit(ROOM_SOCKET_EVENTS.roomLeave);
    }

    this.leaveMultiplayerMode("Returned to the home screen.");
  }

  prepareArenaSession() {
    this.clearInput();
    this.elapsed = 0;
    this.currentRadius = CONFIG.arena.initialRadius;
    this.gameState = "running";
    this.cameraShake = 0;
    this.powerUpSpawnTimer = 1.8;
    this.arenaMotion.offsetX = 0;
    this.arenaMotion.offsetZ = 0;
    this.arenaMotion.yaw = 0;
    this.arenaMotion.velX = 0;
    this.arenaMotion.velZ = 0;
    this.arenaMotion.yawVelocity = 0;
    this.cameraRig.distance = CONFIG.camera.distance;
    this.cameraRig.height = CONFIG.camera.height;
    this.cameraGoal.distance = CONFIG.camera.distance;
    this.cameraGoal.height = CONFIG.camera.height;
    this.hideStatus();
    this.buildArena();
    this.updateArenaMotion(0);
    this.updateHud();
    this.renderPowerUpHud();
    sceneRoot.focus();
    this.ensureEngineLoop();
  }

  enterMultiplayerMode(playerId, roomId, snapshot) {
    this.mode = "multiplayer";
    this.networkPlayerId = playerId;
    this.networkRoomId = roomId;
    this.connectedPlayers = snapshot?.connectedPlayers || 1;
    this.roomMinPlayers = snapshot?.minPlayers || 2;
    this.roomMaxPlayers = snapshot?.maxPlayers || 5;
    this.roomMessage = snapshot?.message || `Lobby ${roomId} is ready.`;
    this.multiplayerReady = false;
    this.lastSentInput.throttle = 0;
    this.lastSentInput.steer = 0;
    this.networkInputTimer = 0;
    this.multiplayerStatusKey = "";
    roomIdInputEl.value = roomId;
    this.handleMultiplayerSnapshot(snapshot);
    this.updateRoomUi();
  }

  leaveMultiplayerMode(message) {
    this.mode = "solo";
    this.networkPlayerId = null;
    this.networkRoomId = null;
    this.roomHostId = null;
    this.roomPhase = "home";
    this.roomPlayers = [];
    this.isRoomHost = false;
    this.roomMinPlayers = 2;
    this.roomMaxPlayers = 5;
    this.connectedPlayers = 1;
    this.roomMessage = message;
    this.multiplayerStatusKey = "";
    this.multiplayerReady = false;
    roomIdInputEl.value = "";
    this.showHomeScreen();
    this.updateRoomUi();
    this.resetRound();
  }

  effectsArrayToMap(effects) {
    const effectMap = {};
    effects.forEach((effect) => {
      effectMap[effect.type] = { ...effect };
    });
    return effectMap;
  }

  handleMultiplayerSnapshot(snapshot) {
    if (!snapshot || this.mode !== "multiplayer") {
      return;
    }

    if (snapshot.roomId && this.networkRoomId && snapshot.roomId !== this.networkRoomId) {
      return;
    }

    const nextArenaId = ARENA_TYPES[snapshot.arenaId] ? snapshot.arenaId : "standard";
    const arenaChanged = nextArenaId !== this.currentArenaId;
    if (!this.multiplayerReady || arenaChanged) {
      this.currentArenaId = nextArenaId;
      this.currentArena = ARENA_TYPES[this.currentArenaId];
      localStorage.setItem(ARENA_STORAGE_KEY, this.currentArenaId);
      this.updateArenaUi();
      this.applyArenaPhysics();
      this.applyTheme(this.theme);
      this.clearRound();
      this.prepareArenaSession();
      this.multiplayerReady = true;
    }

    this.elapsed = snapshot.elapsed ?? this.elapsed;
    this.currentRadius = snapshot.safeRadius ?? this.currentRadius;
    this.roomPhase = snapshot.phase || this.roomPhase;
    this.roomHostId = snapshot.hostId || null;
    this.roomMinPlayers = snapshot.minPlayers || this.roomMinPlayers;
    this.roomMaxPlayers = snapshot.maxPlayers || this.roomMaxPlayers;
    this.connectedPlayers = snapshot.connectedPlayers ?? this.connectedPlayers;
    this.roomPlayers = (snapshot.players || []).map((player, index) => ({
      ...player,
      seatIndex: index,
    }));
    this.isRoomHost = Boolean(this.networkPlayerId && this.roomHostId === this.networkPlayerId);
    this.roomMessage = snapshot.message || this.roomMessage;
    this.gameState =
      snapshot.phase === "finished"
        ? snapshot.winnerId === this.networkPlayerId ? "won" : "lost"
        : snapshot.phase === "lobby"
          ? "waiting"
          : "running";

    if (snapshot.arenaMotion) {
      this.arenaMotion.offsetX = snapshot.arenaMotion.offsetX || 0;
      this.arenaMotion.offsetZ = snapshot.arenaMotion.offsetZ || 0;
      this.arenaMotion.yaw = snapshot.arenaMotion.yaw || 0;
      this.arenaMotion.velX = snapshot.arenaMotion.velX || 0;
      this.arenaMotion.velZ = snapshot.arenaMotion.velZ || 0;
      this.arenaMotion.yawVelocity = snapshot.arenaMotion.yawVelocity || 0;
      this.arenaSurfaceGroup.position.set(this.arenaMotion.offsetX, 0, this.arenaMotion.offsetZ);
      this.arenaSurfaceGroup.rotation.y = this.arenaMotion.yaw;
    }

    if (this.zoneRing) {
      this.zoneRing.scale.setScalar(this.currentRadius);
    }
    if (this.zonePulse) {
      this.zonePulse.scale.setScalar(this.currentRadius);
    }

    this.syncMultiplayerPlayers(snapshot.players || []);
    this.syncMultiplayerPowerUps(snapshot.powerUps || []);

    if (snapshot.phase === "lobby") {
      this.showHomeScreen();
    } else {
      this.hideHomeScreen();
    }

    const nextStatusKey = `${snapshot.phase}:${snapshot.winnerId || "none"}:${snapshot.message || ""}`;
    if (snapshot.phase === "finished") {
      if (this.multiplayerStatusKey !== nextStatusKey) {
        this.showStatus(
          snapshot.winnerId === this.networkPlayerId ? "You Win" : "Game Over",
          snapshot.winnerId === this.networkPlayerId
            ? "You were the last driver standing. Press R to restart the room match."
            : "Another driver pushed you out. Press R to restart the room match.",
        );
      }
      this.multiplayerStatusKey = nextStatusKey;
    } else {
      if (this.multiplayerStatusKey) {
        this.hideStatus();
      }
      this.multiplayerStatusKey = "";
    }

    this.updateHud();
    this.updateRoomUi();
  }

  removeCarEntity(car) {
    if (!car) {
      return;
    }

    if (car.collisionHandler && car.body) {
      car.body.removeEventListener("collide", car.collisionHandler);
    }

    const geometries = new Set();
    const materials = new Set();
    this.collectDisposableResources(car.group, geometries, materials);
    if (car.body) {
      this.world.removeBody(car.body);
    }
    this.detachObject(car.group);
    this.disposeResources(geometries, materials);

    this.cars = this.cars.filter((candidate) => candidate !== car);
    this.aiCars = this.aiCars.filter((candidate) => candidate !== car);
    if (this.player === car) {
      this.player = null;
    }
  }

  syncMultiplayerPlayers(players) {
    const playerIds = new Set(players.map((player) => player.id));
    this.cars.slice().forEach((car) => {
      if (!playerIds.has(car.id)) {
        this.removeCarEntity(car);
      }
    });

    players.forEach((playerState) => {
      const isLocalPlayer = playerState.id === this.networkPlayerId;
      let car = this.cars.find((candidate) => candidate.id === playerState.id);

      if (!car) {
        const colors = isLocalPlayer ? PLAYER_COLORS : OPPONENT_COLORS[playerState.colorIndex % OPPONENT_COLORS.length];
        car = this.createCar({
          id: playerState.id,
          label: playerState.name,
          isPlayer: isLocalPlayer,
          colors,
          position: new CANNON.Vec3(
            playerState.x,
            playerState.y ?? CONFIG.cars.rideHeight,
            playerState.z,
          ),
          yaw: playerState.angle,
          networked: true,
        });
      }

      car.isPlayer = isLocalPlayer;
      car.active = playerState.active;
      car.group.visible = playerState.active;
      car.targetPosition.set(playerState.x, playerState.y ?? CONFIG.cars.rideHeight, playerState.z);
      car.targetVelocity.set(playerState.vx || 0, 0, playerState.vz || 0);
      car.targetYaw = playerState.angle || 0;
      const boostCooldownRemaining = Number(playerState.boostCooldownRemaining) || 0;
      const boostActiveRemaining = playerState.boostActive
        ? clamp(
            boostCooldownRemaining - (CONFIG.cars.boostCooldown - CONFIG.cars.boostDuration),
            0.12,
            CONFIG.cars.boostDuration,
          )
        : 0;
      car.boost.activeUntil = playerState.boostActive ? this.elapsed + boostActiveRemaining : 0;
      car.boost.cooldownUntil = this.elapsed + boostCooldownRemaining;
      car.effects = this.effectsArrayToMap(playerState.effects || []);
      this.refreshCarModifiers(car);

      if (!car.networkInitialized) {
        car.body.position.set(playerState.x, playerState.y ?? CONFIG.cars.rideHeight, playerState.z);
        car.body.velocity.set(playerState.vx || 0, 0, playerState.vz || 0);
        car.yaw = playerState.angle || 0;
        car.body.quaternion.setFromAxisAngle(UP_AXIS, car.yaw);
        car.networkInitialized = true;
      }
    });

    this.player = this.cars.find((car) => car.id === this.networkPlayerId) || null;
    this.aiCars = this.cars.filter((car) => car.id !== this.networkPlayerId);
  }

  createMultiplayerPowerUp(powerUpState) {
    const definition = POWERUP_TYPES[powerUpState.type];
    const group = new THREE.Group();
    group.position.set(powerUpState.x, CONFIG.arena.platformY + 1.15, powerUpState.z);

    const coreMaterial = new THREE.MeshStandardMaterial({
      color: definition.color,
      emissive: new THREE.Color(definition.color),
      emissiveIntensity: 1.2,
      roughness: 0.28,
      metalness: 0.12,
    });
    const core = new THREE.Mesh(this.createPowerUpGeometry(definition.shape || "octa"), coreMaterial);
    core.castShadow = true;
    group.add(core);

    const auraMaterial = new THREE.MeshBasicMaterial({
      color: definition.color,
      transparent: true,
      opacity: 0.18,
    });
    const aura = new THREE.Mesh(new THREE.SphereGeometry(0.84, 18, 18), auraMaterial);
    group.add(aura);

    const ringMaterial = new THREE.MeshStandardMaterial({
      color: definition.color,
      emissive: new THREE.Color(definition.color),
      emissiveIntensity: 0.84,
      transparent: true,
      opacity: 0.76,
    });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.07, 10, 30), ringMaterial);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    const orbMaterial = new THREE.MeshBasicMaterial({
      color: definition.color,
      transparent: true,
      opacity: 0.82,
    });
    const orbA = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), orbMaterial);
    const orbB = orbA.clone();
    group.add(orbA);
    group.add(orbB);

    const light = new THREE.PointLight(definition.color, 1.45, 5.5, 2);
    group.add(light);

    this.scene.add(group);

    return {
      id: powerUpState.id,
      networked: true,
      type: powerUpState.type,
      definition,
      group,
      core,
      aura,
      ring,
      orbiters: [orbA, orbB],
      light,
      baseY: group.position.y,
      pulseOffset: powerUpState.pulseOffset || 0,
      spinSpeed: powerUpState.spinSpeed || 1,
      worldX: powerUpState.x,
      worldZ: powerUpState.z,
    };
  }

  syncMultiplayerPowerUps(powerUps) {
    const ids = new Set(powerUps.map((powerUp) => powerUp.id));
    this.powerUps.slice().forEach((powerUp) => {
      if (powerUp.networked && !ids.has(powerUp.id)) {
        this.removePowerUp(powerUp);
      }
    });

    powerUps.forEach((powerUpState) => {
      let powerUp = this.powerUps.find((candidate) => candidate.networked && candidate.id === powerUpState.id);
      if (!powerUp) {
        powerUp = this.createMultiplayerPowerUp(powerUpState);
        this.powerUps.push(powerUp);
      }

      powerUp.worldX = powerUpState.x;
      powerUp.worldZ = powerUpState.z;
      powerUp.pulseOffset = powerUpState.pulseOffset || powerUp.pulseOffset;
      powerUp.spinSpeed = powerUpState.spinSpeed || powerUp.spinSpeed;
      powerUp.group.visible = true;
    });
  }

  sendMultiplayerInput(delta) {
    if (!this.socket?.connected || this.mode !== "multiplayer") {
      return;
    }

    if (this.roomPhase !== "running") {
      if (this.lastSentInput.throttle !== 0 || this.lastSentInput.steer !== 0) {
        this.lastSentInput.throttle = 0;
        this.lastSentInput.steer = 0;
        this.socket.emit(ROOM_SOCKET_EVENTS.playerInput, { throttle: 0, steer: 0 });
      }
      return;
    }

    const throttle = (this.input.forward ? 1 : 0) + (this.input.backward ? -0.72 : 0);
    const steer = (this.input.left ? 1 : 0) + (this.input.right ? -1 : 0);
    const changed =
      Math.abs(throttle - this.lastSentInput.throttle) > 0.01 ||
      Math.abs(steer - this.lastSentInput.steer) > 0.01;

    this.networkInputTimer += delta;
    if (!changed && this.networkInputTimer < 1 / 20) {
      return;
    }

    this.lastSentInput.throttle = throttle;
    this.lastSentInput.steer = steer;
    this.networkInputTimer = 0;
    this.socket.emit(ROOM_SOCKET_EVENTS.playerInput, { throttle, steer });
  }

  updateMultiplayer(delta) {
    this.sendMultiplayerInput(delta);

    const blend = clamp(delta * 10, 0, 1);
    this.cars.forEach((car) => {
      if (car.physicsMode !== "network") {
        return;
      }

      car.body.position.x = lerp(car.body.position.x, car.targetPosition.x, blend);
      car.body.position.y = lerp(car.body.position.y, car.targetPosition.y, blend);
      car.body.position.z = lerp(car.body.position.z, car.targetPosition.z, blend);
      car.body.velocity.x = lerp(car.body.velocity.x, car.targetVelocity.x, blend);
      car.body.velocity.y = 0;
      car.body.velocity.z = lerp(car.body.velocity.z, car.targetVelocity.z, blend);
      car.yaw = lerpAngle(car.yaw, car.targetYaw, blend);
      car.body.quaternion.setFromAxisAngle(UP_AXIS, car.yaw);
    });

    this.powerUps.forEach((powerUp) => {
      if (!powerUp.networked) {
        return;
      }

      const bob = Math.sin(this.elapsed * 2.8 + powerUp.pulseOffset) * 0.18;
      powerUp.group.position.set(powerUp.worldX, powerUp.baseY + bob, powerUp.worldZ);
      powerUp.core.rotation.x += delta * powerUp.spinSpeed;
      powerUp.core.rotation.y += delta * powerUp.spinSpeed * 0.85;
      powerUp.aura.scale.setScalar(1 + Math.sin(this.elapsed * 3.2 + powerUp.pulseOffset) * 0.1);
      powerUp.ring.rotation.z += delta * (powerUp.spinSpeed * 0.45);

      powerUp.orbiters.forEach((orb, index) => {
        const angle = this.elapsed * (1.4 + index * 0.3) + powerUp.pulseOffset + index * Math.PI;
        orb.position.set(Math.cos(angle) * 0.74, Math.sin(angle * 1.6) * 0.16, Math.sin(angle) * 0.74);
      });
    });

    this.syncCars(delta);
    this.updatePlayerEngine(delta);
    this.updateCamera(delta);
    this.updateHud();
  }

  clearInput() {
    this.input.forward = false;
    this.input.backward = false;
    this.input.left = false;
    this.input.right = false;
  }

  resolveInputAction(event) {
    const candidates = [event.code, event.key]
      .filter(Boolean)
      .map((value) => (value.length === 1 ? value.toLowerCase() : value));

    for (const candidate of candidates) {
      switch (candidate) {
        case "KeyW":
        case "w":
        case "W":
        case "ArrowUp":
        case "Up":
          return "forward";
        case "KeyS":
        case "s":
        case "S":
        case "ArrowDown":
        case "Down":
          return "backward";
        case "KeyA":
        case "a":
        case "A":
        case "ArrowLeft":
        case "Left":
          return "left";
        case "KeyD":
        case "d":
        case "D":
        case "ArrowRight":
        case "Right":
          return "right";
        case "KeyR":
        case "r":
        case "R":
          return "restart";
        case "KeyB":
        case "b":
        case "B":
          return "boost";
        default:
          break;
      }
    }

    return null;
  }

  getArenaPalette(theme) {
    return {
      ...THEMES[theme],
      ...(this.currentArena.palette?.[theme] || {}),
    };
  }

  updateArenaUi() {
    arenaCurrentEl.textContent = this.currentArena.label;
    arenaNoteEl.textContent = this.currentArena.note;
    arenaSelectEl.value = this.currentArenaId;
  }

  setArena(arenaId, { restart = true } = {}) {
    if (!ARENA_TYPES[arenaId]) {
      return;
    }

    if (this.mode === "multiplayer" && restart) {
      return;
    }

    this.currentArenaId = arenaId;
    this.currentArena = ARENA_TYPES[arenaId];
    localStorage.setItem(ARENA_STORAGE_KEY, arenaId);
    this.updateArenaUi();
    this.applyArenaPhysics();
    this.applyTheme(this.theme);

    if (restart) {
      this.resetRound();
    }
  }

  randomizeArena({ restart = true } = {}) {
    const arenaIds = Object.keys(ARENA_TYPES);
    let nextArenaId = this.currentArenaId;
    if (arenaIds.length > 1) {
      while (nextArenaId === this.currentArenaId) {
        nextArenaId = arenaIds[Math.floor(Math.random() * arenaIds.length)];
      }
    }
    this.setArena(nextArenaId, { restart });
  }

  applyArenaPhysics() {
    const arenaPhysics = this.currentArena.physics;
    this.groundToCarContact.friction = arenaPhysics.groundFriction;
    this.groundToCarContact.restitution = this.currentArenaId === "ice" ? 0.08 : 0.05;
    this.carToCarContact.friction = arenaPhysics.carFriction;

    this.cars.forEach((car) => {
      if (car.physicsMode !== "network") {
        car.body.linearDamping = arenaPhysics.linearDamping;
        car.body.angularDamping = arenaPhysics.angularDamping;
      }
      this.refreshCarModifiers(car);
    });
  }

  detachObject(object) {
    if (object && object.parent) {
      object.parent.remove(object);
    }
  }

  getArenaCenter() {
    return {
      x: this.arenaMotion.offsetX,
      z: this.arenaMotion.offsetZ,
    };
  }

  getArenaWorldPosition(localX, localZ) {
    const cosine = Math.cos(this.arenaMotion.yaw);
    const sine = Math.sin(this.arenaMotion.yaw);
    return {
      x: cosine * localX - sine * localZ + this.arenaMotion.offsetX,
      z: sine * localX + cosine * localZ + this.arenaMotion.offsetZ,
    };
  }

  getArenaLocalPosition(worldX, worldZ) {
    const dx = worldX - this.arenaMotion.offsetX;
    const dz = worldZ - this.arenaMotion.offsetZ;
    const cosine = Math.cos(this.arenaMotion.yaw);
    const sine = Math.sin(this.arenaMotion.yaw);
    return {
      x: cosine * dx + sine * dz,
      z: -sine * dx + cosine * dz,
    };
  }

  ensureSounds() {
    if (!this.sounds) {
      this.sounds = createAudioSet();
    }
    return this.sounds;
  }

  playSound(soundName, { volume, rate } = {}) {
    if (!this.audioUnlocked) {
      return null;
    }

    const sounds = this.ensureSounds();
    const sound = sounds[soundName];
    if (!sound) {
      return null;
    }

    const id = sound.play();
    if (typeof volume === "number") {
      sound.volume(volume, id);
    }
    if (typeof rate === "number") {
      sound.rate(rate, id);
    }
    return id;
  }

  ensureEngineLoop() {
    if (!this.audioUnlocked) {
      return;
    }

    const sounds = this.ensureSounds();
    if (this.engineSoundId === null) {
      this.engineSoundId = sounds.engine.play();
      sounds.engine.volume(0, this.engineSoundId);
    }
  }

  handleKey(event, isPressed) {
    const action = this.resolveInputAction(event);
    if (!action) {
      return;
    }

    event.preventDefault();

    if (action === "restart") {
      if (isPressed && !event.repeat) {
        if (this.mode === "multiplayer") {
          this.socket?.emit(ROOM_SOCKET_EVENTS.roomRestart);
        } else {
          this.resetRound();
        }
      }
      return;
    }

    if (action === "boost") {
      if (isPressed && !event.repeat) {
        if (this.mode === "multiplayer") {
          if (this.roomPhase === "running") {
            this.socket?.emit(ROOM_SOCKET_EVENTS.playerBoost);
          }
        } else {
          this.tryActivateBoost(this.player);
        }
      }
      return;
    }

    if (isPressed) {
      sceneRoot.focus();
    }

    this.input[action] = isPressed;
  }

  applyTheme(theme) {
    this.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
    body.dataset.theme = theme;
    themeLabel.textContent = theme === "light" ? "Dark Mode" : "Light Mode";

    const palette = this.getArenaPalette(theme);
    this.scene.fog.color.setHex(palette.sceneFog);
    this.ambientLight.color.setHex(palette.ambient);
    this.ambientLight.groundColor.setHex(palette.ground);
    this.keyLight.color.setHex(palette.keyLight);
    this.rimLight.color.setHex(palette.rimLight);
    this.renderer.toneMappingExposure = theme === "light" ? 1.08 : 0.95;

    this.materials.tile.forEach((material) => {
      material.color.setHex(palette.platform);
      material.emissive.setHex(palette.platformEdge);
      material.emissiveIntensity = theme === "light" ? 0.08 : 0.14;
    });
    this.materials.support.forEach((material) => {
      material.color.setHex(palette.support);
    });
    this.materials.ring.forEach((material) => {
      material.color.setHex(palette.zone);
      material.emissive.setHex(palette.zone);
      material.emissiveIntensity = theme === "light" ? 0.85 : 1.15;
    });
    this.materials.pulse.forEach((material) => {
      material.color.setHex(palette.pulse);
      material.emissive.setHex(palette.pulse);
      material.emissiveIntensity = theme === "light" ? 0.42 : 0.66;
    });
    this.materials.center.forEach((material) => {
      material.color.setHex(palette.center);
      material.opacity = theme === "light" ? 0.94 : 0.7;
    });
    this.materials.glass.forEach((material) => {
      material.color.setHex(palette.glass);
      material.emissive.setHex(palette.glass);
      material.emissiveIntensity = theme === "light" ? 0.05 : 0.18;
    });
    this.materials.ground.forEach((material) => {
      if (material.color) {
        material.color.setHex(palette.ground);
      }
    });

    this.cars.forEach((car) => this.refreshCarModifiers(car));
  }

  resetRound() {
    if (this.mode === "multiplayer") {
      this.socket?.emit(ROOM_SOCKET_EVENTS.roomRestart);
      return;
    }

    this.clearRound();
    this.prepareArenaSession();
    this.spawnCars();
    this.updateHud();
    this.renderPowerUpHud();
  }

  collectDisposableResources(object, geometries, materials) {
    if (!object) {
      return;
    }

    object.traverse((child) => {
      if (child.geometry) {
        geometries.add(child.geometry);
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => materials.add(material));
        } else {
          materials.add(child.material);
        }
      }
    });
  }

  disposeResources(geometries, materials) {
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
  }

  clearRound() {
    const geometries = new Set();
    const materials = new Set();

    this.cars.forEach((car) => {
      if (car.collisionHandler) {
        car.body.removeEventListener("collide", car.collisionHandler);
      }
      this.collectDisposableResources(car.group, geometries, materials);
      this.world.removeBody(car.body);
      this.detachObject(car.group);
    });
    this.tiles.forEach((tile) => {
      this.collectDisposableResources(tile.mesh, geometries, materials);
      if (tile.body) {
        this.world.removeBody(tile.body);
      }
      this.detachObject(tile.mesh);
    });
    this.supports.forEach((support) => {
      this.collectDisposableResources(support, geometries, materials);
      this.detachObject(support);
    });
    this.powerUps.forEach((powerUp) => {
      this.collectDisposableResources(powerUp.group, geometries, materials);
      this.detachObject(powerUp.group);
    });

    if (this.zoneRing) {
      this.collectDisposableResources(this.zoneRing, geometries, materials);
      this.detachObject(this.zoneRing);
    }
    if (this.zonePulse) {
      this.collectDisposableResources(this.zonePulse, geometries, materials);
      this.detachObject(this.zonePulse);
    }
    if (this.centerDisk) {
      this.collectDisposableResources(this.centerDisk, geometries, materials);
      this.detachObject(this.centerDisk);
    }

    if (this.zonePulseTween) {
      this.zonePulseTween.kill();
      this.zonePulseTween = null;
    }

    this.materials.tile.length = 0;
    this.materials.support.length = this.baseSupportMaterialCount;
    this.materials.ring.length = 0;
    this.materials.pulse.length = 0;
    this.materials.center.length = 0;
    this.materials.glass.length = 0;
    this.cars = [];
    this.aiCars = [];
    this.tiles = [];
    this.supports = [];
    this.powerUps = [];
    this.player = null;
    if (this.arenaFloorBody) {
      this.world.removeBody(this.arenaFloorBody);
      this.arenaFloorBody = null;
    }

    this.disposeResources(geometries, materials);
  }

  buildArena() {
    const tileSize = CONFIG.arena.tileSize;
    const tileHeight = CONFIG.arena.tileHeight;
    const tileGeometry = new THREE.BoxGeometry(tileSize, tileHeight, tileSize);
    const supportGeometry = new THREE.CylinderGeometry(tileSize * 0.16, tileSize * 0.28, 8, 8);
    const palette = this.getArenaPalette(this.theme);
    const floorHalfHeight = tileHeight * 0.55;
    const floorHalfExtent = CONFIG.arena.initialRadius + tileSize * 0.35;

    this.arenaFloorBody = new CANNON.Body({
      mass: 0,
      material: this.groundMaterial,
      shape: new CANNON.Box(new CANNON.Vec3(floorHalfExtent, floorHalfHeight, floorHalfExtent)),
      position: new CANNON.Vec3(0, CONFIG.arena.platformY - floorHalfHeight, 0),
    });
    this.world.addBody(this.arenaFloorBody);

    for (let x = -CONFIG.arena.initialRadius; x <= CONFIG.arena.initialRadius; x += tileSize) {
      for (let z = -CONFIG.arena.initialRadius; z <= CONFIG.arena.initialRadius; z += tileSize) {
        const radial = Math.hypot(x, z);
        if (radial > CONFIG.arena.initialRadius + tileSize * 0.38) {
          continue;
        }

        const material = new THREE.MeshStandardMaterial({
          color: palette.platform,
          roughness: 0.76,
          metalness: 0.08,
          transparent: true,
        });
        const mesh = new THREE.Mesh(tileGeometry, material);
        mesh.position.set(x, CONFIG.arena.platformY - tileHeight * 0.5, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.arenaSurfaceGroup.add(mesh);

        this.tiles.push({
          mesh,
          body: null,
          x,
          z,
          distance: radial,
          dropped: false,
        });
        this.materials.tile.push(material);

        if (Math.abs(x) < CONFIG.arena.initialRadius - 3 && Math.abs(z) < CONFIG.arena.initialRadius - 3) {
          if ((Math.round(x / tileSize) + Math.round(z / tileSize)) % 3 === 0) {
            const supportMaterial = new THREE.MeshStandardMaterial({
              color: palette.support,
              roughness: 0.88,
              metalness: 0.05,
            });
            const support = new THREE.Mesh(supportGeometry, supportMaterial);
            support.position.set(x, -4.9, z);
            support.castShadow = true;
            this.arenaSurfaceGroup.add(support);
            this.supports.push(support);
            this.materials.support.push(supportMaterial);
          }
        }
      }
    }

    const diskMaterial = new THREE.MeshStandardMaterial({
      color: palette.center,
      roughness: 0.82,
      metalness: 0.03,
      transparent: true,
      opacity: 0.92,
    });
    this.centerDisk = new THREE.Mesh(new THREE.CircleGeometry(CONFIG.arena.initialRadius * 0.55, 48), diskMaterial);
    this.centerDisk.rotation.x = -Math.PI / 2;
    this.centerDisk.position.y = CONFIG.arena.platformY + 0.01;
    this.arenaSurfaceGroup.add(this.centerDisk);
    this.materials.center.push(diskMaterial);

    const ringMaterial = new THREE.MeshStandardMaterial({
      color: palette.zone,
      emissive: new THREE.Color(palette.zone),
      emissiveIntensity: 1,
      roughness: 0.3,
      metalness: 0.1,
    });
    this.zoneRing = new THREE.Mesh(new THREE.TorusGeometry(1, 0.16, 18, 90), ringMaterial);
    this.zoneRing.rotation.x = Math.PI / 2;
    this.zoneRing.position.y = CONFIG.arena.platformY + 0.58;
    this.zoneRing.scale.setScalar(this.currentRadius);
    this.arenaSurfaceGroup.add(this.zoneRing);
    this.materials.ring.push(ringMaterial);

    const pulseMaterial = new THREE.MeshStandardMaterial({
      color: palette.pulse,
      emissive: new THREE.Color(palette.pulse),
      emissiveIntensity: 0.42,
      transparent: true,
      opacity: 0.46,
    });
    this.zonePulse = new THREE.Mesh(new THREE.RingGeometry(0.95, 1.08, 84), pulseMaterial);
    this.zonePulse.rotation.x = -Math.PI / 2;
    this.zonePulse.position.y = CONFIG.arena.platformY + 0.05;
    this.zonePulse.scale.setScalar(this.currentRadius);
    this.arenaSurfaceGroup.add(this.zonePulse);
    this.materials.pulse.push(pulseMaterial);

    this.zonePulseTween = gsap.to(this.zonePulse.material, {
      opacity: 0.12,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }

  scheduleNextPowerUpSpawn() {
    const fewActive = this.powerUps.length < 2;
    const minDelay = fewActive ? 1.2 : CONFIG.powerups.minRespawn;
    const maxDelay = fewActive ? 2.6 : CONFIG.powerups.maxRespawn;
    this.powerUpSpawnTimer = minDelay + Math.random() * (maxDelay - minDelay);
  }

  selectPowerUpType() {
    const types = Object.keys(POWERUP_TYPES);
    return types[Math.floor(Math.random() * types.length)];
  }

  findPowerUpSpawnTile() {
    const safeRadius = Math.min(
      this.currentRadius - CONFIG.powerups.spawnMargin,
      CONFIG.arena.initialRadius - 1.5,
    );
    if (safeRadius <= 2.5) {
      return null;
    }

    const candidates = this.tiles.filter(
      (tile) => !tile.dropped && tile.distance < safeRadius && tile.distance > 1.8,
    );

    if (!candidates.length) {
      return null;
    }

    for (let attempt = 0; attempt < 18; attempt += 1) {
      const tile = candidates[Math.floor(Math.random() * candidates.length)];
      const worldPoint = this.getArenaWorldPosition(tile.x, tile.z);
      const nearCar = this.cars.some(
        (car) =>
          car.active &&
          Math.hypot(car.body.position.x - worldPoint.x, car.body.position.z - worldPoint.z) < 5.4,
      );
      const nearPowerUp = this.powerUps.some(
        (powerUp) =>
          Math.hypot(powerUp.group.position.x - worldPoint.x, powerUp.group.position.z - worldPoint.z) < 4.4,
      );
      if (!nearCar && !nearPowerUp) {
        return tile;
      }
    }

    return candidates[0];
  }

  createPowerUpGeometry(shape) {
    switch (shape) {
      case "box":
        return new THREE.BoxGeometry(0.88, 0.88, 0.88);
      case "ico":
        return new THREE.IcosahedronGeometry(0.52, 0);
      case "dodeca":
        return new THREE.DodecahedronGeometry(0.5, 0);
      case "octa":
      default:
        return new THREE.OctahedronGeometry(0.58, 0);
    }
  }

  spawnRandomPowerUp() {
    if (this.powerUps.length >= CONFIG.powerups.maxActive) {
      this.scheduleNextPowerUpSpawn();
      return;
    }

    const tile = this.findPowerUpSpawnTile();
    if (!tile) {
      this.powerUpSpawnTimer = 1.4;
      return;
    }

    const type = this.selectPowerUpType();
    const definition = POWERUP_TYPES[type];
    const group = new THREE.Group();
    const worldPoint = this.getArenaWorldPosition(tile.x, tile.z);
    group.position.set(worldPoint.x, CONFIG.arena.platformY + 1.15, worldPoint.z);

    const coreMaterial = new THREE.MeshStandardMaterial({
      color: definition.color,
      emissive: new THREE.Color(definition.color),
      emissiveIntensity: 1.2,
      roughness: 0.28,
      metalness: 0.12,
    });
    const core = new THREE.Mesh(this.createPowerUpGeometry(definition.shape), coreMaterial);
    core.castShadow = true;
    group.add(core);

    const auraMaterial = new THREE.MeshBasicMaterial({
      color: definition.color,
      transparent: true,
      opacity: 0.18,
    });
    const aura = new THREE.Mesh(new THREE.SphereGeometry(0.84, 18, 18), auraMaterial);
    group.add(aura);

    const ringMaterial = new THREE.MeshStandardMaterial({
      color: definition.color,
      emissive: new THREE.Color(definition.color),
      emissiveIntensity: 0.84,
      transparent: true,
      opacity: 0.76,
    });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.07, 10, 30), ringMaterial);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    const orbMaterial = new THREE.MeshBasicMaterial({
      color: definition.color,
      transparent: true,
      opacity: 0.82,
    });
    const orbA = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), orbMaterial);
    const orbB = orbA.clone();
    group.add(orbA);
    group.add(orbB);

    const light = new THREE.PointLight(definition.color, 1.45, 5.5, 2);
    light.position.set(0, 0, 0);
    group.add(light);

    this.scene.add(group);
    this.powerUps.push({
      type,
      definition,
      tile,
      group,
      core,
      aura,
      ring,
      orbiters: [orbA, orbB],
      light,
      baseY: group.position.y,
      localX: tile.x,
      localZ: tile.z,
      spawnedAt: this.elapsed,
      pulseOffset: Math.random() * Math.PI * 2,
      spinSpeed: 0.9 + Math.random() * 1.1,
    });

    this.scheduleNextPowerUpSpawn();
  }

  removePowerUp(powerUp) {
    const powerIndex = this.powerUps.indexOf(powerUp);
    if (powerIndex !== -1) {
      this.powerUps.splice(powerIndex, 1);
    }

    const geometries = new Set();
    const materials = new Set();
    this.collectDisposableResources(powerUp.group, geometries, materials);
    this.detachObject(powerUp.group);
    this.disposeResources(geometries, materials);

    if (this.gameState === "running" && this.powerUps.length < 2) {
      this.powerUpSpawnTimer = Math.min(this.powerUpSpawnTimer, 1.2);
    }
  }

  collectPowerUp(car, powerUp) {
    this.playSound("pickup", { rate: 0.96 + Math.random() * 0.16 });
    this.activatePowerUp(car, powerUp.type);
    this.removePowerUp(powerUp);
  }

  activatePowerUp(car, type) {
    const definition = POWERUP_TYPES[type];
    const existing = car.effects[type];
    car.effects[type] = {
      type,
      label: definition.label,
      color: definition.color,
      cssColor: definition.cssColor,
      expiresAt: this.elapsed + definition.duration,
      charges: definition.charges || 0,
    };

    if (existing && type === "shield") {
      car.effects[type].charges = 1;
    }

    this.refreshCarModifiers(car);
    this.playSound("activate", { rate: 0.92 + Math.random() * 0.14 });

    if (car.isPlayer) {
      gsap.killTweensOf(powerupListEl);
      gsap.fromTo(
        powerupListEl,
        { scale: 0.97, opacity: 0.88 },
        { scale: 1, opacity: 1, duration: 0.24, ease: "power2.out" },
      );
      this.flashImpact(0.14);
    }
  }

  clearPowerUpEffect(car, type) {
    if (!car.effects[type]) {
      return;
    }
    delete car.effects[type];
    this.refreshCarModifiers(car);
  }

  refreshCarModifiers(car) {
    car.modifiers.speedMultiplier = car.effects.speed ? POWERUP_TYPES.speed.speedMultiplier : 1;
    car.modifiers.knockbackMultiplier = car.effects.knockback ? POWERUP_TYPES.knockback.knockbackMultiplier : 1;
    car.modifiers.massMultiplier = car.effects.weight ? POWERUP_TYPES.weight.massMultiplier : 1;
    car.modifiers.shieldReady = Boolean(car.effects.shield && car.effects.shield.charges > 0);
    if (car.physicsMode !== "network") {
      car.body.linearDamping = this.currentArena.physics.linearDamping;
      car.body.angularDamping = this.currentArena.physics.angularDamping;

      const targetMass = car.baseMass * car.modifiers.massMultiplier;
      if (Math.abs(car.body.mass - targetMass) > 0.01) {
        car.body.mass = targetMass;
        car.body.updateMassProperties();
        car.body.wakeUp();
      }
    }

    const activeEffects = Object.values(car.effects);
    if (activeEffects.length) {
      const leadEffect = activeEffects.sort((first, second) => second.expiresAt - first.expiresAt)[0];
      car.glassMaterial.color.setHex(leadEffect.color);
      car.glassMaterial.emissive.setHex(leadEffect.color);
      car.glassMaterial.emissiveIntensity = 0.24 + activeEffects.length * 0.08;
      car.glassMaterial.opacity = 0.9;
    } else {
      const glassColor = this.getArenaPalette(this.theme).glass;
      car.glassMaterial.color.setHex(glassColor);
      car.glassMaterial.emissive.setHex(glassColor);
      car.glassMaterial.emissiveIntensity = this.theme === "light" ? 0.05 : 0.18;
      car.glassMaterial.opacity = 0.82;
    }
  }

  updateCarEffects() {
    this.cars.forEach((car) => {
      const activeEffects = Object.values(car.effects);
      activeEffects.forEach((effect) => {
        if (effect.expiresAt <= this.elapsed) {
          this.clearPowerUpEffect(car, effect.type);
        }
      });
    });
  }

  updatePowerUps(delta) {
    if (this.gameState === "running") {
      this.powerUpSpawnTimer -= delta;
      if (this.powerUps.length < CONFIG.powerups.maxActive && this.powerUpSpawnTimer <= 0) {
        this.spawnRandomPowerUp();
      }
    }

    for (let index = this.powerUps.length - 1; index >= 0; index -= 1) {
      const powerUp = this.powerUps[index];

      if (powerUp.tile.dropped || powerUp.tile.distance > this.currentRadius + CONFIG.arena.tileSize * 0.28) {
        this.removePowerUp(powerUp);
        continue;
      }

      const bob = Math.sin(this.elapsed * 2.8 + powerUp.pulseOffset) * 0.18;
      const pulse = 0.92 + Math.sin(this.elapsed * 3.6 + powerUp.pulseOffset) * 0.08;
      const worldPoint = this.getArenaWorldPosition(powerUp.localX, powerUp.localZ);
      powerUp.group.position.set(worldPoint.x, powerUp.baseY + bob, worldPoint.z);
      powerUp.core.rotation.x += delta * 1.25;
      powerUp.core.rotation.y += delta * powerUp.spinSpeed;
      powerUp.ring.rotation.z += delta * 1.15;
      powerUp.aura.scale.setScalar(pulse);
      powerUp.light.intensity = 1.45 + Math.sin(this.elapsed * 4.2 + powerUp.pulseOffset) * 0.3;
      powerUp.orbiters.forEach((orb, orbIndex) => {
        const angle = this.elapsed * 2.4 + powerUp.pulseOffset + orbIndex * Math.PI;
        orb.position.set(Math.cos(angle) * 0.72, Math.sin(angle * 1.5) * 0.12, Math.sin(angle) * 0.72);
      });

      if (this.gameState !== "running") {
        continue;
      }

      if (this.elapsed - powerUp.spawnedAt >= CONFIG.powerups.lifetime) {
        this.removePowerUp(powerUp);
        continue;
      }

      const collector = this.cars.find(
        (car) =>
          car.active &&
          car.body.position.y > -1.2 &&
          Math.hypot(
            car.body.position.x - powerUp.group.position.x,
            car.body.position.z - powerUp.group.position.z,
          ) < CONFIG.powerups.pickupRadius,
      );

      if (collector) {
        this.collectPowerUp(collector, powerUp);
      }
    }
  }

  useShieldSave(car) {
    const shieldEffect = car.effects.shield;
    if (!shieldEffect || shieldEffect.charges < 1) {
      return false;
    }

    shieldEffect.charges = 0;
    delete car.effects.shield;
    this.refreshCarModifiers(car);

    const localPos = this.getArenaLocalPosition(car.body.position.x, car.body.position.z);
    const angle = Math.atan2(localPos.z || 0.001, localPos.x || 0.001);
    const rescueRadius = Math.max(1.8, Math.min(this.currentRadius - 2.4, 5.8));
    const rescueLocalX = Math.cos(angle) * rescueRadius * 0.55;
    const rescueLocalZ = Math.sin(angle) * rescueRadius * 0.55;
    const rescueWorld = this.getArenaWorldPosition(rescueLocalX, rescueLocalZ);
    const center = this.getArenaCenter();
    car.body.position.set(rescueWorld.x, 3.1, rescueWorld.z);
    car.body.velocity.set((center.x - rescueWorld.x) * 0.55, 0, (center.z - rescueWorld.z) * 0.55);
    car.body.angularVelocity.set(0, 0, 0);
    car.body.wakeUp();

    this.playSound("activate", { rate: 0.84 });
    this.flashImpact(car.isPlayer ? 0.28 : 0.14);
    return true;
  }

  renderPowerUpHud() {
    const playerEffects =
      this.player && this.player.active ? Object.values(this.player.effects).sort((first, second) => first.expiresAt - second.expiresAt) : [];

    if (!playerEffects.length) {
      powerupListEl.innerHTML = '<p class="powerup-empty">No active boost</p>';
      return;
    }

    powerupListEl.innerHTML = playerEffects
      .map((effect) => {
        const remaining = Math.max(0, effect.expiresAt - this.elapsed);
        const label = effect.type === "shield" && effect.charges > 0 ? `${effect.label} Ready` : effect.label;
        return `
          <div class="powerup-chip" style="--powerup-color:${effect.cssColor};">
            <div class="powerup-meta">
              <span class="powerup-dot"></span>
              <span class="powerup-name">${label}</span>
            </div>
            <span class="powerup-timer">${remaining.toFixed(1)}s</span>
          </div>
        `;
      })
      .join("");
  }

  updateArenaMotion(delta) {
    const motion = this.currentArena.motion;
    const previousX = this.arenaMotion.offsetX;
    const previousZ = this.arenaMotion.offsetZ;
    const previousYaw = this.arenaMotion.yaw;
    const dt = Math.max(delta, 1 / 60);

    if (!motion) {
      this.arenaMotion.offsetX = 0;
      this.arenaMotion.offsetZ = 0;
      this.arenaMotion.yaw = 0;
    } else {
      this.arenaMotion.offsetX = Math.sin(this.elapsed * motion.shiftSpeed) * motion.shiftX;
      this.arenaMotion.offsetZ = Math.sin(this.elapsed * motion.shiftSpeed * 1.35) * motion.shiftZ;
      this.arenaMotion.yaw = Math.sin(this.elapsed * motion.yawSpeed) * motion.yawAmplitude;
    }

    this.arenaMotion.velX = (this.arenaMotion.offsetX - previousX) / dt;
    this.arenaMotion.velZ = (this.arenaMotion.offsetZ - previousZ) / dt;
    this.arenaMotion.yawVelocity = (this.arenaMotion.yaw - previousYaw) / dt;

    this.arenaSurfaceGroup.position.set(this.arenaMotion.offsetX, 0, this.arenaMotion.offsetZ);
    this.arenaSurfaceGroup.rotation.y = this.arenaMotion.yaw;

    const needsBodySync =
      Boolean(motion) ||
      previousX !== 0 ||
      previousZ !== 0 ||
      previousYaw !== 0;

    if (needsBodySync && this.arenaFloorBody) {
      this.tempArenaQuat.setFromAxisAngle(UP_AXIS, this.arenaMotion.yaw);
      this.arenaFloorBody.position.set(
        this.arenaMotion.offsetX,
        CONFIG.arena.platformY - CONFIG.arena.tileHeight * 0.55,
        this.arenaMotion.offsetZ,
      );
      this.arenaFloorBody.quaternion.copy(this.tempArenaQuat);
      this.arenaFloorBody.aabbNeedsUpdate = true;
    }

    if (motion) {
      this.applyMovingPlatformForces(delta);
    }
  }

  applyMovingPlatformForces(delta) {
    const motion = this.currentArena.motion;
    if (!motion) {
      return;
    }

    const influence = delta * motion.carAssist;
    this.cars.forEach((car) => {
      if (!car.active || car.body.position.y > 2.9) {
        return;
      }

      const localPos = this.getArenaLocalPosition(car.body.position.x, car.body.position.z);
      const tangentialX = -localPos.z * this.arenaMotion.yawVelocity;
      const tangentialZ = localPos.x * this.arenaMotion.yawVelocity;
      car.body.velocity.x += (this.arenaMotion.velX + tangentialX) * influence;
      car.body.velocity.z += (this.arenaMotion.velZ + tangentialZ) * influence;
      car.body.angularVelocity.y += this.arenaMotion.yawVelocity * delta * 0.8;
      car.body.wakeUp();
    });
  }

  spawnCars() {
    const rivalCount = clamp(Number(this.aiTargetCount) || CONFIG.cars.count, 1, 7);
    const spawnPoints = getCircularSpawnPoints(rivalCount + 1);

    const playerSpawn = spawnPoints.shift();
    this.player = this.createCar({
      id: "player",
      label: "Player",
      isPlayer: true,
      colors: PLAYER_COLORS,
      position: new CANNON.Vec3(playerSpawn.x, 2.2, playerSpawn.z),
      yaw: playerSpawn.yaw,
    });

    spawnPoints.forEach((spawn, index) => {
      const aiCar = this.createCar({
        id: `ai-${index}`,
        label: `Rival ${index + 1}`,
        isPlayer: false,
        colors: OPPONENT_COLORS[index % OPPONENT_COLORS.length],
        position: new CANNON.Vec3(spawn.x, 2.2, spawn.z),
        yaw: spawn.yaw,
      });
      aiCar.ai = {
        target: null,
        retargetIn: 0.25 + Math.random() * 0.45,
        wander: new THREE.Vector2((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4),
        stuckFor: 0,
        escapeSteer: Math.random() > 0.5 ? 1 : -1,
        sideBias: Math.random() > 0.5 ? 1 : -1,
      };
      this.aiCars.push(aiCar);
    });
  }

  createCar({ id, label, isPlayer, colors, position, yaw, networked = false }) {
    const carGroup = new THREE.Group();
    carGroup.name = label;
    const palette = this.getArenaPalette(this.theme);

    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: colors.body,
      roughness: 0.55,
      metalness: 0.18,
    });
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: colors.roof,
      roughness: 0.48,
      metalness: 0.1,
    });
    const trimMaterial = new THREE.MeshStandardMaterial({
      color: colors.trim,
      roughness: 0.68,
      metalness: 0.18,
    });
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: palette.glass,
      emissive: new THREE.Color(palette.glass),
      emissiveIntensity: 0.1,
      transparent: true,
      opacity: 0.82,
      roughness: 0.2,
      metalness: 0.12,
    });
    this.materials.glass.push(glassMaterial);

    const chassis = new THREE.Mesh(
      new THREE.BoxGeometry(CONFIG.cars.width, 0.62, CONFIG.cars.length),
      bodyMaterial,
    );
    chassis.position.y = 0.62;
    chassis.castShadow = true;
    carGroup.add(chassis);

    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(CONFIG.cars.width * 0.78, 0.45, CONFIG.cars.length * 0.42),
      roofMaterial,
    );
    cabin.position.set(0, 1.02, -0.08);
    cabin.castShadow = true;
    carGroup.add(cabin);

    const windshield = new THREE.Mesh(
      new THREE.BoxGeometry(CONFIG.cars.width * 0.72, 0.18, CONFIG.cars.length * 0.24),
      glassMaterial,
    );
    windshield.position.set(0, 1.03, 0.42);
    windshield.castShadow = true;
    carGroup.add(windshield);

    const bumperFront = new THREE.Mesh(
      new THREE.BoxGeometry(CONFIG.cars.width * 0.95, 0.24, 0.22),
      trimMaterial,
    );
    bumperFront.position.set(0, 0.48, CONFIG.cars.length * 0.5 - 0.08);
    carGroup.add(bumperFront);

    const bumperRear = bumperFront.clone();
    bumperRear.position.z = -CONFIG.cars.length * 0.5 + 0.08;
    carGroup.add(bumperRear);

    const wheelGeometry = new THREE.CylinderGeometry(0.32, 0.32, 0.3, 14);
    const wheelMaterial = trimMaterial;
    const wheelOffsets = [
      [-CONFIG.cars.width * 0.55, 0.34, CONFIG.cars.length * 0.35],
      [CONFIG.cars.width * 0.55, 0.34, CONFIG.cars.length * 0.35],
      [-CONFIG.cars.width * 0.55, 0.34, -CONFIG.cars.length * 0.35],
      [CONFIG.cars.width * 0.55, 0.34, -CONFIG.cars.length * 0.35],
    ];
    const wheels = [];
    wheelOffsets.forEach((offset, index) => {
      const wheelPivot = new THREE.Group();
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.castShadow = true;
      wheelPivot.position.set(offset[0], offset[1], offset[2]);
      wheelPivot.add(wheel);
      wheelPivot.userData.front = index < 2;
      carGroup.add(wheelPivot);
      wheels.push(wheelPivot);
    });

    const boostGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffbc63,
      transparent: true,
      opacity: 0,
    });
    const boostGlow = new THREE.Mesh(new THREE.SphereGeometry(0.34, 14, 14), boostGlowMaterial);
    boostGlow.position.set(0, 0.54, -CONFIG.cars.length * 0.58);
    boostGlow.scale.set(1.45, 0.8, 0.9);
    carGroup.add(boostGlow);

    const boostLight = new THREE.PointLight(0xffb764, 0, 5.6, 2);
    boostLight.position.set(0, 0.7, -CONFIG.cars.length * 0.45);
    carGroup.add(boostLight);

    this.scene.add(carGroup);

    const body = new CANNON.Body({
      mass: networked ? 0 : CONFIG.cars.mass,
      material: this.carMaterial,
      shape: new CANNON.Box(
        new CANNON.Vec3(CONFIG.cars.width * 0.5, CONFIG.cars.height * 0.5, CONFIG.cars.length * 0.5),
      ),
      position,
      linearDamping: networked ? 0 : this.currentArena.physics.linearDamping,
      angularDamping: networked ? 0 : this.currentArena.physics.angularDamping,
    });
    body.quaternion.setFromAxisAngle(UP_AXIS, yaw);
    body.position.y = CONFIG.cars.rideHeight;
    body.angularFactor = new CANNON.Vec3(0, 0, 0);
    body.fixedRotation = true;
    if (networked) {
      body.type = CANNON.Body.KINEMATIC;
      body.collisionResponse = false;
    }
    body.updateMassProperties();
    body.allowSleep = false;
    body.userData = { id };
    this.world.addBody(body);

    const car = {
      id,
      label,
      isPlayer,
      active: true,
      baseMass: CONFIG.cars.mass,
      body,
      physicsMode: networked ? "network" : "solo",
      group: carGroup,
      wheels,
      wheelSpin: 0,
      yaw,
      turnVelocity: 0,
      targetPosition: new THREE.Vector3(position.x, position.y, position.z),
      targetVelocity: new THREE.Vector3(),
      targetYaw: yaw,
      networkInitialized: !networked,
      lastImpact: 0,
      ai: null,
      glassMaterial,
      boostGlow,
      boostGlowMaterial,
      boostLight,
      effects: {},
      boost: {
        activeUntil: 0,
        cooldownUntil: 0,
      },
      modifiers: {
        speedMultiplier: 1,
        knockbackMultiplier: 1,
        massMultiplier: 1,
        shieldReady: false,
      },
    };

    if (!networked) {
      car.collisionHandler = (event) => this.onCarCollision(car, event);
      body.addEventListener("collide", car.collisionHandler);
    }

    this.cars.push(car);
    return car;
  }

  onCarCollision(car, event) {
    if (this.gameState !== "running") {
      return;
    }

    const impact = Math.abs(event.contact.getImpactVelocityAlongNormal());
    if (impact < 4.6) {
      return;
    }

    const now = performance.now();
    if (now - car.lastImpact < 110) {
      return;
    }
    car.lastImpact = now;

    const otherCar = this.cars.find((candidate) => candidate.body === event.body) || null;
    const involvesPlayer = car.isPlayer || (otherCar && otherCar.isPlayer);
    const volume = clamp((impact - 4) / 12, 0.12, 0.55);
    this.playSound("impact", {
      volume,
      rate: 0.85 + Math.random() * 0.3,
    });

    if (otherCar && otherCar.active) {
      if (car.modifiers.knockbackMultiplier > 1) {
        car.body.vectorToWorldFrame(FORWARD_AXIS, this.tempForward);
        const bonusImpulse = clamp((impact - 3.8) * 4.8 * (car.modifiers.knockbackMultiplier - 1), 0, 34);
        this.tempImpulse.set(this.tempForward.x * bonusImpulse, 0, this.tempForward.z * bonusImpulse);
        otherCar.body.applyImpulse(this.tempImpulse, otherCar.body.position);
      }

      if (otherCar.modifiers.knockbackMultiplier > 1) {
        otherCar.body.vectorToWorldFrame(FORWARD_AXIS, this.tempForward);
        const returnImpulse = clamp((impact - 3.8) * 4.8 * (otherCar.modifiers.knockbackMultiplier - 1), 0, 34);
        this.tempImpulse.set(this.tempForward.x * returnImpulse, 0, this.tempForward.z * returnImpulse);
        car.body.applyImpulse(this.tempImpulse, car.body.position);
      }
    }

    if (involvesPlayer) {
      this.cameraShake = Math.min(this.cameraShake + impact * 0.06, 1.5);
      this.flashImpact(volume);

      const playerCar = car.isPlayer ? car : otherCar;
      if (playerCar && impact > 6.5) {
        playerCar.body.vectorToWorldFrame(FORWARD_AXIS, this.tempForward);
        this.tempImpulse.set(this.tempForward.x * 10, 0, this.tempForward.z * 10);
        playerCar.body.applyImpulse(this.tempImpulse, playerCar.body.position);
      }
    }
  }

  flashImpact(intensity) {
    const now = performance.now();
    if (now - this.lastFlashTime < 75) {
      return;
    }
    this.lastFlashTime = now;
    gsap.killTweensOf(impactFlash);
    gsap.fromTo(
      impactFlash,
      { opacity: intensity * 0.45 },
      { opacity: 0, duration: 0.3, ease: "power2.out" },
    );
  }

  animate() {
    this.frameId = requestAnimationFrame(() => this.animate());
    const delta = Math.min(this.clock.getDelta(), 0.05);
    this.update(delta);
    this.renderer.render(this.scene, this.camera);
  }

  update(delta) {
    if (this.mode === "multiplayer") {
      this.updateMultiplayer(delta);
      return;
    }

    if (this.gameState === "running") {
      this.elapsed += delta;
    }

    this.updateArenaMotion(delta);

    if (this.gameState === "running") {
      this.updateCarEffects();
      this.updateShrink(delta);
      this.updatePlayer(delta);
      this.updateAi(delta);
    } else {
      this.updatePlayerEngine(delta);
    }

    this.world.step(1 / 60, delta, 3);
    this.stabilizeCars(delta);
    this.syncCars(delta);
    this.updatePowerUps(delta);
    this.checkEliminations();
    this.updateCamera(delta);
    this.updateHud();
  }

  updateShrink() {
    if (this.elapsed < CONFIG.arena.shrinkDelay) {
      return;
    }

    const targetRadius = Math.max(
      CONFIG.arena.minimumRadius,
      CONFIG.arena.initialRadius - (this.elapsed - CONFIG.arena.shrinkDelay) * CONFIG.arena.shrinkRate,
    );

    if (Math.abs(targetRadius - this.currentRadius) < 0.01) {
      return;
    }

    this.currentRadius = targetRadius;
    this.zoneRing.scale.setScalar(this.currentRadius);
    this.zonePulse.scale.setScalar(this.currentRadius);
    this.collapseOuterTiles();
  }

  collapseOuterTiles() {
    const threshold = this.currentRadius + CONFIG.arena.tileSize * 0.28;
    this.tiles.forEach((tile) => {
      if (!tile.dropped && tile.distance > threshold) {
        tile.dropped = true;
        if (tile.body) {
          this.world.removeBody(tile.body);
        }
        gsap.to(tile.mesh.position, {
          y: -7 - Math.random() * 4,
          duration: 0.9,
          ease: "power2.in",
        });
        gsap.to(tile.mesh.rotation, {
          x: (Math.random() - 0.5) * 1.6,
          z: (Math.random() - 0.5) * 1.6,
          duration: 0.95,
          ease: "power2.in",
        });
        gsap.to(tile.mesh.material, {
          opacity: 0,
          duration: 0.8,
          ease: "power1.out",
        });
      }
    });
  }

  updatePlayer(delta) {
    if (!this.player || !this.player.active) {
      this.updatePlayerEngine(delta);
      return;
    }

    const throttle = (this.input.forward ? 1 : 0) + (this.input.backward ? -0.72 : 0);
    const steer = (this.input.left ? 1 : 0) + (this.input.right ? -1 : 0);
    this.driveCar(this.player, throttle, steer, delta);
    this.updatePlayerEngine(delta);
  }

  tryActivateBoost(car, { silent = false } = {}) {
    if (!car || !car.active || car.physicsMode === "network") {
      return false;
    }

    if (car.boost.cooldownUntil > this.elapsed) {
      return false;
    }

    car.boost.activeUntil = this.elapsed + CONFIG.cars.boostDuration;
    car.boost.cooldownUntil = this.elapsed + CONFIG.cars.boostCooldown;
    car.body.vectorToWorldFrame(FORWARD_AXIS, this.tempForward);
    car.body.velocity.x += this.tempForward.x * 2.4;
    car.body.velocity.z += this.tempForward.z * 2.4;
    car.body.wakeUp();

    const nearPlayer =
      this.player &&
      this.player.active &&
      Math.hypot(
        car.body.position.x - this.player.body.position.x,
        car.body.position.z - this.player.body.position.z,
      ) < 8.5;

    if (!silent && (car.isPlayer || nearPlayer)) {
      this.playSound("activate", { rate: car.isPlayer ? 1.08 : 0.98, volume: car.isPlayer ? 0.34 : 0.24 });
    }

    if (car.isPlayer) {
      this.flashImpact(0.16);
    }

    return true;
  }

  updateAi(delta) {
    const center = this.getArenaCenter();

    this.aiCars.forEach((car) => {
      if (!car.active) {
        return;
      }

      const ai = car.ai;
      ai.retargetIn -= delta;

      const speed = Math.hypot(car.body.velocity.x, car.body.velocity.z);
      if (speed < 1.15) {
        ai.stuckFor += delta;
      } else {
        ai.stuckFor = 0;
      }

      if (ai.retargetIn <= 0 || !ai.target || !ai.target.active) {
        ai.target = this.findTargetFor(car);
        ai.retargetIn = 0.3 + Math.random() * 0.35;
        ai.wander.set((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5);
        if (Math.random() < 0.35) {
          ai.sideBias *= -1;
        }
        ai.escapeSteer = Math.random() > 0.5 ? 1 : -1;
      }

      let desiredPoint = new THREE.Vector2(center.x, center.z);
      const localPos = this.getArenaLocalPosition(car.body.position.x, car.body.position.z);
      const radial = Math.hypot(localPos.x, localPos.z);
      const edgeDanger = radial > this.currentRadius - 1.9;
      let throttle = edgeDanger ? 1 : 0.94;
      let boostWanted = false;

      if (edgeDanger) {
        desiredPoint.set(center.x, center.z);
      } else if (ai.target && ai.target.active) {
        const target = ai.target;
        const targetCenterX = target.body.position.x - center.x;
        const targetCenterZ = target.body.position.z - center.z;
        const targetRadial = Math.hypot(targetCenterX, targetCenterZ) || 1;
        const outwardX = targetCenterX / targetRadial;
        const outwardZ = targetCenterZ / targetRadial;
        const distanceToTarget = Math.hypot(
          target.body.position.x - car.body.position.x,
          target.body.position.z - car.body.position.z,
        );
        const chaseDirX = (target.body.position.x - car.body.position.x) / Math.max(distanceToTarget, 0.001);
        const chaseDirZ = (target.body.position.z - car.body.position.z) / Math.max(distanceToTarget, 0.001);
        const lineUp = chaseDirX * outwardX + chaseDirZ * outwardZ;
        const edgePressure = clamp((targetRadial - this.currentRadius * 0.48) / Math.max(this.currentRadius * 0.52, 1), 0, 1);
        const flankOffset = (1 - edgePressure) * ai.sideBias * 1.15;
        const stageOffset = lerp(3.5, 1.35, edgePressure);
        const stageX = target.body.position.x - outwardX * stageOffset - outwardZ * flankOffset;
        const stageZ = target.body.position.z - outwardZ * stageOffset + outwardX * flankOffset;
        const attackX = target.body.position.x + outwardX * (1.8 + edgePressure * 1.5) + target.body.velocity.x * 0.16;
        const attackZ = target.body.position.z + outwardZ * (1.8 + edgePressure * 1.5) + target.body.velocity.z * 0.16;
        const stageDistance = Math.hypot(stageX - car.body.position.x, stageZ - car.body.position.z);
        const commitAttack = stageDistance < 2.2 || (lineUp > 0.68 && distanceToTarget < 7.2);

        if (commitAttack) {
          desiredPoint.set(attackX, attackZ);
          throttle = 1;
        } else {
          desiredPoint.set(stageX, stageZ);
          throttle = lineUp < -0.28 ? 0.7 : 0.92;
        }

        boostWanted =
          commitAttack &&
          lineUp > 0.72 &&
          distanceToTarget < 6.3 &&
          targetRadial > this.currentRadius * 0.42;
      } else {
        desiredPoint.set(center.x + ai.wander.x, center.z + ai.wander.y);
        throttle = 0.86;
      }

      const toTargetX = desiredPoint.x - car.body.position.x;
      const toTargetZ = desiredPoint.y - car.body.position.z;
      const length = Math.hypot(toTargetX, toTargetZ) || 1;
      const dirX = toTargetX / length;
      const dirZ = toTargetZ / length;

      car.body.vectorToWorldFrame(FORWARD_AXIS, this.tempForward);
      const dot = dirX * this.tempForward.x + dirZ * this.tempForward.z;
      const cross = this.tempForward.x * dirZ - this.tempForward.z * dirX;
      let steer = clamp(-Math.atan2(cross, dot) * 1.95, -1, 1);
      const alignedForBoost = dot > 0.7 && Math.abs(steer) < 0.32;

      if (Math.abs(steer) > 0.95 && speed > 8) {
        throttle *= 0.58;
      }
      if (ai.stuckFor > 1.3) {
        throttle = -0.5;
        steer = ai.escapeSteer;
        boostWanted = false;
      } else if (Math.abs(steer) < 0.2 && speed < 5 && ai.target) {
        throttle = Math.max(throttle, 0.98);
      }

      if (!boostWanted && ai.target && alignedForBoost && length < 8.8 && speed < 13.2) {
        boostWanted = true;
      }
      if (!boostWanted && edgeDanger && alignedForBoost && speed < 7) {
        boostWanted = true;
      }

      if (boostWanted) {
        this.tryActivateBoost(car);
      }

      this.driveCar(car, throttle, steer, delta);
    });
  }

  findTargetFor(sourceCar) {
    const center = this.getArenaCenter();
    let bestTarget = null;
    let bestScore = -Infinity;

    this.cars.forEach((candidate) => {
      if (!candidate.active || candidate === sourceCar) {
        return;
      }
      const dx = candidate.body.position.x - sourceCar.body.position.x;
      const dz = candidate.body.position.z - sourceCar.body.position.z;
      const distance = Math.hypot(dx, dz) || 1;
      const localPos = this.getArenaLocalPosition(candidate.body.position.x, candidate.body.position.z);
      const edgePressure = clamp(Math.hypot(localPos.x, localPos.z) / Math.max(this.currentRadius, 1), 0, 1);
      const centerDx = candidate.body.position.x - center.x;
      const centerDz = candidate.body.position.z - center.z;
      const centerDistance = Math.hypot(centerDx, centerDz) || 1;
      const outwardX = centerDx / centerDistance;
      const outwardZ = centerDz / centerDistance;
      const chaseDirX = dx / distance;
      const chaseDirZ = dz / distance;
      const lineUp = chaseDirX * outwardX + chaseDirZ * outwardZ;
      const distanceScore = 1 - clamp(distance / (this.currentRadius * 1.95), 0, 1);
      const speedScore = clamp(Math.hypot(candidate.body.velocity.x, candidate.body.velocity.z) / 14, 0, 1) * 0.35;
      const currentAttackers = this.aiCars.reduce((count, rival) => {
        if (!rival.active || rival === sourceCar) {
          return count;
        }
        return count + (rival.ai?.target === candidate ? 1 : 0);
      }, 0);
      const sharedTargetPenalty = currentAttackers * 1.05;
      const score = edgePressure * 2.9 + lineUp * 1.8 + distanceScore * 1.35 + speedScore - sharedTargetPenalty;

      if (score > bestScore) {
        bestScore = score;
        bestTarget = candidate;
      }
    });

    return bestTarget;
  }

  driveCar(car, throttle, steer, delta) {
    const bodyRef = car.body;
    const powerSpeedMultiplier = car.modifiers.speedMultiplier || 1;
    const boostActive = car.boost.activeUntil > this.elapsed;
    const arenaPhysics = this.currentArena.physics;
    const maxForwardSpeed =
      CONFIG.cars.maxForwardSpeed *
      arenaPhysics.topSpeedMultiplier *
      powerSpeedMultiplier *
      (boostActive ? CONFIG.cars.boostMultiplier : 1);
    const maxReverseSpeed = CONFIG.cars.maxReverseSpeed * arenaPhysics.reverseMultiplier;
    const bodyMass = Math.max(bodyRef.mass, 1);
    const engineAcceleration =
      (CONFIG.cars.engineForce *
        arenaPhysics.engineMultiplier *
        powerSpeedMultiplier *
        (boostActive ? CONFIG.cars.boostMultiplier : 1)) /
      bodyMass;
    const reverseAcceleration =
      (CONFIG.cars.reverseForce * arenaPhysics.reverseMultiplier) /
      bodyMass;
    const frameScale = delta * 60;

    const steerStrength = clamp(Math.abs(steer), 0, 1);
    const currentPlanarSpeed = Math.hypot(bodyRef.velocity.x, bodyRef.velocity.z);
    const turnTarget =
      steer *
      CONFIG.cars.turnRate *
      arenaPhysics.steerMultiplier *
      (boostActive ? CONFIG.cars.boostTurnMultiplier : 1) *
      lerp(0.72, 1.08, clamp(currentPlanarSpeed / 8, 0, 1));
    car.turnVelocity = lerp(car.turnVelocity, turnTarget, clamp(delta * 9, 0, 1));
    car.yaw += car.turnVelocity * delta;
    bodyRef.quaternion.setFromAxisAngle(UP_AXIS, car.yaw);
    bodyRef.vectorToWorldFrame(FORWARD_AXIS, this.tempForward);
    bodyRef.vectorToWorldFrame(RIGHT_AXIS, this.tempRight);

    const forwardSpeed =
      bodyRef.velocity.x * this.tempForward.x +
      bodyRef.velocity.z * this.tempForward.z;
    const lateralSpeed =
      bodyRef.velocity.x * this.tempRight.x +
      bodyRef.velocity.z * this.tempRight.z;

    const gripForce = clamp(
      (CONFIG.cars.grip * 2.85 + steerStrength * 0.18) *
        arenaPhysics.gripMultiplier *
        (car.isPlayer ? 1.18 : 1.04) *
        frameScale,
      0.22,
      0.94,
    );

    if (Math.abs(throttle) > 0.01 || Math.abs(steer) > 0.01) {
      bodyRef.wakeUp();
    }

    let desiredForwardSpeed = 0;
    if (throttle > 0.01) {
      desiredForwardSpeed = throttle * maxForwardSpeed;
    } else if (throttle < -0.01) {
      desiredForwardSpeed = throttle * maxReverseSpeed;
    }

    const speedGap = desiredForwardSpeed - forwardSpeed;
    const accelerationRate =
      desiredForwardSpeed >= forwardSpeed
        ? engineAcceleration * 1.5
        : reverseAcceleration * 1.7 + CONFIG.cars.idleBrake;
    const forwardBlend = clamp(delta * accelerationRate, 0, speedGap >= 0 ? 1 : 0.24);
    const nextForwardSpeed =
      forwardSpeed + speedGap * forwardBlend;
    const nextLateralSpeed = lerp(lateralSpeed, 0, gripForce);
    const desiredVelocityX = this.tempForward.x * nextForwardSpeed + this.tempRight.x * nextLateralSpeed;
    const desiredVelocityZ = this.tempForward.z * nextForwardSpeed + this.tempRight.z * nextLateralSpeed;
    const controlAuthority = clamp(delta * (CONFIG.cars.driveAuthority + steerStrength * 1.4), 0, 1);

    bodyRef.velocity.x = lerp(bodyRef.velocity.x, desiredVelocityX, controlAuthority);
    bodyRef.velocity.z = lerp(bodyRef.velocity.z, desiredVelocityZ, controlAuthority);

    const planarSpeed = Math.hypot(bodyRef.velocity.x, bodyRef.velocity.z);
    const maxPlanarSpeed = maxForwardSpeed * 1.12;
    if (planarSpeed > maxPlanarSpeed) {
      const scale = maxPlanarSpeed / planarSpeed;
      bodyRef.velocity.x *= scale;
      bodyRef.velocity.z *= scale;
    }

    if (Math.abs(throttle) > 0.01 && planarSpeed < 0.6) {
      bodyRef.velocity.x += this.tempForward.x * throttle * 0.24;
      bodyRef.velocity.z += this.tempForward.z * throttle * 0.24;
    }

    bodyRef.angularVelocity.set(0, 0, 0);
    bodyRef.torque.set(0, 0, 0);

    const wheelTurn = steer * 0.45;
    car.wheels.forEach((wheel) => {
      if (wheel.userData.front) {
        wheel.rotation.y = lerp(wheel.rotation.y, wheelTurn, 0.16 + delta * 3);
      }
    });
  }

  stabilizeCars(delta) {
    const rideHeight = CONFIG.cars.rideHeight;
    const yBlend = clamp(delta * 16, 0, 1);

    this.cars.forEach((car) => {
      if (!car.active) {
        return;
      }

      car.body.position.y = lerp(car.body.position.y, rideHeight, yBlend);
      car.body.velocity.y = 0;
      car.body.force.y = 0;
      car.body.angularVelocity.x = 0;
      car.body.angularVelocity.z = 0;
      car.body.quaternion.setFromAxisAngle(UP_AXIS, car.yaw);
    });
  }

  syncCars(delta) {
    this.cars.forEach((car) => {
      car.group.position.copy(car.body.position);
      car.group.quaternion.copy(car.body.quaternion);

      car.body.vectorToWorldFrame(FORWARD_AXIS, this.tempForward);
      const forwardSpeed =
        car.body.velocity.x * this.tempForward.x +
        car.body.velocity.z * this.tempForward.z;
      car.wheelSpin += forwardSpeed * delta * 1.8;
      car.wheels.forEach((wheel) => {
        wheel.children[0].rotation.x = car.wheelSpin;
      });

      const boostActive = car.boost.activeUntil > this.elapsed;
      if (car.boostLight) {
        car.boostLight.intensity = boostActive ? 1.5 + Math.sin(this.elapsed * 28) * 0.4 : 0;
      }
      if (car.boostGlowMaterial) {
        car.boostGlowMaterial.opacity = boostActive ? 0.4 + Math.sin(this.elapsed * 24) * 0.12 : 0;
      }
      if (car.boostGlow) {
        const pulse = boostActive ? 1.08 + Math.sin(this.elapsed * 24) * 0.08 : 0.9;
        car.boostGlow.scale.set(1.45 * pulse, 0.8 * pulse, 0.9 * pulse);
      }
    });
  }

  checkEliminations() {
    this.cars.forEach((car) => {
      if (!car.active) {
        return;
      }
      const localPos = this.getArenaLocalPosition(car.body.position.x, car.body.position.z);
      const radialDistance = Math.hypot(localPos.x, localPos.z);
      const outsideSafeZone = radialDistance > this.currentRadius + 0.7;
      if (outsideSafeZone || car.body.position.y < CONFIG.arena.fallLimit) {
        if (this.useShieldSave(car)) {
          return;
        }
        this.eliminateCar(car);
      }
    });

    if (this.gameState !== "running") {
      return;
    }

    const livingOpponents = this.aiCars.filter((car) => car.active).length;
    if (this.player && this.player.active && livingOpponents === 0) {
      this.finish("win");
    }
  }

  eliminateCar(car) {
    car.active = false;
    this.world.removeBody(car.body);
    this.scene.remove(car.group);
    this.playSound("eliminate", { rate: 0.94 + Math.random() * 0.2 });

    if (car === this.player) {
      this.finish("lose");
    }
  }

  finish(result) {
    if (this.gameState !== "running") {
      return;
    }
    this.gameState = result === "win" ? "won" : "lost";
    this.showStatus(
      result === "win" ? "You Win" : "Game Over",
      result === "win"
        ? "You were the last machine standing. Press R to throw everyone back into the arena."
        : "You fell out of the shrinking arena. Press R to drop back in for another round.",
    );

    if (this.sounds && this.engineSoundId !== null) {
      this.sounds.engine.fade(this.sounds.engine.volume(this.engineSoundId), 0, 250, this.engineSoundId);
    }
  }

  showStatus(title, subtitle) {
    statusTitle.textContent = title;
    statusSubtitle.textContent = subtitle;
    statusPanel.classList.add("is-visible");
    gsap.fromTo(
      statusPanel,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.42, ease: "power2.out" },
    );
  }

  hideStatus() {
    statusPanel.classList.remove("is-visible");
    statusTitle.textContent = "Stay Alive";
    statusSubtitle.textContent = "Every rival is trying to ram you off the shrinking platform.";
    gsap.killTweensOf(statusPanel);
    gsap.set(statusPanel, { clearProps: "all" });
  }

  updateHud() {
    const livingCars = this.cars.filter((car) => car.active).length;
    carsLeftEl.textContent = String(livingCars);
    zoneSizeEl.textContent = `${this.currentRadius.toFixed(1)}m`;
    if (!this.player || !this.player.boost) {
      boostStatusEl.textContent = this.mode === "multiplayer" && this.roomPhase === "lobby" ? "Lobby" : "Ready";
    } else if (this.player.boost.activeUntil > this.elapsed) {
      boostStatusEl.textContent = `Active ${Math.max(0, this.player.boost.activeUntil - this.elapsed).toFixed(1)}s`;
    } else {
      const cooldownRemaining = Math.max(0, this.player.boost.cooldownUntil - this.elapsed);
      boostStatusEl.textContent = cooldownRemaining > 0 ? `Cooldown ${cooldownRemaining.toFixed(1)}s` : "Ready";
    }
    this.renderPowerUpHud();
  }

  updatePlayerEngine(delta) {
    if (!this.audioUnlocked || !this.sounds || this.engineSoundId === null) {
      return;
    }

    let desiredVolume = 0;
    let desiredRate = 0.85;
    if (this.player && this.player.active) {
      const speed = Math.hypot(this.player.body.velocity.x, this.player.body.velocity.z);
      desiredVolume = clamp(speed / 26, 0.04, 0.34);
      desiredRate = 0.78 + clamp(speed / 24, 0, 0.5);
      if (this.gameState !== "running") {
        desiredVolume *= 0.4;
      }
    }

    const currentVolume = this.sounds.engine.volume(this.engineSoundId);
    const blendedVolume = lerp(currentVolume, desiredVolume, 0.08 + delta * 2.2);
    this.sounds.engine.volume(blendedVolume, this.engineSoundId);
    this.sounds.engine.rate(desiredRate, this.engineSoundId);
  }

  updateCamera(delta) {
    const targetCar = this.player && this.player.active ? this.player : null;
    const opponentsAlive = this.aiCars.filter((car) => car.active).length;
    const desiredDistance = CONFIG.camera.distance + opponentsAlive * 0.22;
    const desiredHeight = CONFIG.camera.height + opponentsAlive * 0.06;

    if (
      Math.abs(desiredDistance - this.cameraGoal.distance) > 0.05 ||
      Math.abs(desiredHeight - this.cameraGoal.height) > 0.05
    ) {
      this.cameraGoal.distance = desiredDistance;
      this.cameraGoal.height = desiredHeight;
      gsap.to(this.cameraRig, {
        distance: desiredDistance,
        height: desiredHeight,
        duration: 0.6,
        overwrite: true,
        ease: "power2.out",
      });
    }

    if (targetCar) {
      targetCar.body.vectorToWorldFrame(FORWARD_AXIS, this.tempForward);
      const speed = Math.hypot(targetCar.body.velocity.x, targetCar.body.velocity.z);
      const lead = clamp(speed * 0.18, 0.4, 2.6);
      this.cameraLook.set(
        targetCar.body.position.x + this.tempForward.x * lead,
        targetCar.body.position.y + CONFIG.camera.lookHeight,
        targetCar.body.position.z + this.tempForward.z * lead,
      );
      this.cameraPosition.set(
        targetCar.body.position.x - this.tempForward.x * this.cameraRig.distance,
        targetCar.body.position.y + this.cameraRig.height,
        targetCar.body.position.z - this.tempForward.z * this.cameraRig.distance,
      );
    } else {
      this.cameraLook.set(0, 1.5, 0);
      this.cameraPosition.set(0, 15, 17);
    }

    if (this.cameraShake > 0.01) {
      this.cameraPosition.x += (Math.random() - 0.5) * this.cameraShake;
      this.cameraPosition.y += (Math.random() - 0.5) * this.cameraShake * 0.55;
      this.cameraPosition.z += (Math.random() - 0.5) * this.cameraShake;
      this.cameraShake *= 0.88;
    } else {
      this.cameraShake = 0;
    }

    this.camera.position.lerp(this.cameraPosition, 0.1 + delta * 2.2);
    this.camera.lookAt(this.cameraLook);
  }

  onResize() {
    const width = sceneRoot.clientWidth;
    const height = sceneRoot.clientHeight;
    this.camera.aspect = width / Math.max(height, 1);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }
}

new ArenaGame();
