import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { createCarModelUrl } from "./standalone-car/carGltf.js";

const DEFAULTS = {
  modelUrl: "assets/player-car.gltf",
  roadHalfWidth: 6.2,
  targetWidth: 2.45,
  targetLength: 4.9,
  mass: 90,
  startPosition: new THREE.Vector3(0, 0, 0),
  forwardVisualSpeed: 20,
  maxLateralSpeed: 14,
  lateralResponse: 12,
  turnTilt: 0.13,
  frontWheelSteer: 0.3,
  suspensionBounce: 0.024,
  suspensionSpeed: 8.5,
  cameraOffset: new THREE.Vector3(0, 7.2, 15.5),
  cameraLookAhead: new THREE.Vector3(0, 1.2, -14),
  yawCorrection: 0,
  stepWorldInternally: false
};

const PLAYER_COLLIDER_SCALE_X = 0.44;
const PLAYER_COLLIDER_SCALE_Y = 0.37;
const PLAYER_COLLIDER_SCALE_Z = 0.43;
const STANDALONE_HERO_SIZE = Object.freeze({
  width: 1.9,
  height: 1.03,
  length: 4.1
});

const ARM_UP_AXIS = new THREE.Vector3(0, 1, 0);

function cloneDefaultValue(value) {
  if (value instanceof THREE.Vector3) {
    return value.clone();
  }

  return value;
}

function mergeOptions(overrides = {}) {
  const merged = {};

  for (const [key, value] of Object.entries(DEFAULTS)) {
    merged[key] = cloneDefaultValue(value);
  }

  for (const [key, value] of Object.entries(overrides)) {
    merged[key] = value instanceof THREE.Vector3 ? value.clone() : value;
  }

  return merged;
}

function getMaterialList(material) {
  return Array.isArray(material) ? material : [material];
}

function ensureBodyFactors(body, CANNON) {
  if (!body.linearFactor) {
    body.linearFactor = new CANNON.Vec3(1, 1, 1);
  }

  if (!body.angularFactor) {
    body.angularFactor = new CANNON.Vec3(1, 1, 1);
  }
}

function clearGroup(group) {
  while (group.children.length) {
    group.remove(group.children[0]);
  }
}

function createMhLogoTexture({
  size = 256,
  primary = "#6f4d2a",
  ring = "#d2aa70",
  fill = "rgba(255, 248, 234, 0.96)"
} = {}) {
  if (typeof document === "undefined") {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  const center = size * 0.5;
  const radius = size * 0.44;
  context.clearRect(0, 0, size, size);
  context.fillStyle = fill;
  context.beginPath();
  context.arc(center, center, radius, 0, Math.PI * 2);
  context.fill();
  context.lineWidth = size * 0.05;
  context.strokeStyle = ring;
  context.beginPath();
  context.arc(center, center, radius - size * 0.04, 0, Math.PI * 2);
  context.stroke();
  context.fillStyle = primary;
  context.font = `700 ${Math.round(size * 0.34)}px Rajdhani, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("MH", center, center + size * 0.02);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function createCarPaintMaterial(color, overrides = {}) {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.52,
    roughness: 0.34,
    clearcoat: 0.78,
    clearcoatRoughness: 0.16,
    envMapIntensity: 0.82,
    ...overrides
  });
}

export class PlayerCarSystem {
  constructor({
    scene,
    world = null,
    camera = null,
    gsapInstance = window.gsap,
    cannonLib = window.CANNON,
    ammoLib = window.Ammo,
    modelUrl,
    ...options
  }) {
    if (!scene) {
      throw new Error("PlayerCarSystem requires a Three.js scene.");
    }

    if (!cannonLib) {
      throw new Error("PlayerCarSystem requires Cannon.js on window.CANNON or through cannonLib.");
    }

    this.scene = scene;
    this.camera = camera;
    this.gsap = gsapInstance;
    this.CANNON = cannonLib;
    this.Ammo = ammoLib || null;
    this.options = mergeOptions({ modelUrl, ...options });
    this.loader = new GLTFLoader();

    this.ownsWorld = !world;
    this.world = world || this.createPhysicsWorld();
    this.physicsMaterial = null;
    this.physicsBody = null;
    this.bodyHalfExtents = null;
    this.bodyHalfHeight = 0;

    this.carGroup = new THREE.Group();
    this.carGroup.name = "PlayerCarGroup";

    this.visualRig = new THREE.Group();
    this.visualRig.name = "PlayerCarVisualRig";
    this.carGroup.add(this.visualRig);

    this.modelPivot = new THREE.Group();
    this.modelPivot.name = "PlayerCarModelPivot";
    this.visualRig.add(this.modelPivot);

    this.heroRig = new THREE.Group();
    this.heroRig.name = "PlayerCarHeroRig";
    this.visualRig.add(this.heroRig);

    this.lightingRig = new THREE.Group();
    this.lightingRig.name = "PlayerCarLightingRig";
    this.visualRig.add(this.lightingRig);

    this.indicatorRig = new THREE.Group();
    this.indicatorRig.name = "PlayerCarIndicators";
    this.visualRig.add(this.indicatorRig);

    this.cockpitRig = new THREE.Group();
    this.cockpitRig.name = "PlayerCarCockpit";
    this.cockpitRig.visible = false;
    this.visualRig.add(this.cockpitRig);

    this.chaseCameraMount = new THREE.Object3D();
    this.chaseLookAnchor = new THREE.Object3D();
    this.cockpitCameraMount = new THREE.Object3D();
    this.cockpitLookAnchor = new THREE.Object3D();
    this.visualRig.add(this.chaseCameraMount);
    this.visualRig.add(this.chaseLookAnchor);
    this.cockpitRig.add(this.cockpitCameraMount);
    this.cockpitRig.add(this.cockpitLookAnchor);

    this.scene.add(this.carGroup);

    this.model = null;
    this.showBaseModel = false;
    this.logoTexture = createMhLogoTexture();
    this.modelBasePosition = new THREE.Vector3();
    this.modelBounds = {
      width: this.options.targetWidth,
      height: 1.4,
      length: this.options.targetLength
    };

    this.stockWheelMeshes = [];
    this.wheels = [];
    this.frontWheels = [];
    this.rearWheels = [];
    this.wheelBaseRotations = new Map();
    this.wheelSpin = 0;
    this.tireAccentMaterials = [];

    this.frontLights = [];
    this.rearLights = [];
    this.headlightLensMaterials = [];
    this.brakeLightMaterials = [];
    this.brakeGlowMaterials = [];
    this.headlightSpotLights = [];
    this.headlightTargets = [];
    this.headlightBeams = [];
    this.indicatorMaterials = {
      left: [],
      right: []
    };
    this.indicatorState = {
      side: "off",
      elapsed: 0,
      duration: 0
    };

    this.dashboardNeedle = null;
    this.cockpitForegroundRig = null;
    this.steeringWheelPivot = null;
    this.leftShoulderAnchor = null;
    this.rightShoulderAnchor = null;
    this.leftHandPivot = null;
    this.rightHandPivot = null;
    this.leftUpperArmMesh = null;
    this.rightUpperArmMesh = null;
    this.leftForearmMesh = null;
    this.rightForearmMesh = null;
    this.gearLeverPivot = null;
    this.gearLeverBasePosition = new THREE.Vector3();
    this.acceleratorPedalPivot = null;
    this.brakePedalPivot = null;
    this.currentGear = 3;
    this.viewMode = "chase";
    this.nightMode = false;
    this.headlightMode = "wide";
    this.driveState = {
      accelerating: false,
      braking: false,
      acceleratorPress: 0,
      brakePress: 0,
      gear: 3
    };

    this.inputState = {
      axis: 0,
      left: false,
      right: false
    };

    this.motionState = {
      steer: 0,
      roll: 0,
      pitch: 0
    };

    this.visualState = {
      bounceTime: 0,
      bounceOffset: 0
    };

    this.cameraTargets = {
      position: new THREE.Vector3(),
      lookAt: new THREE.Vector3(),
      smoothLookAt: new THREE.Vector3()
    };

    this.tempBox = new THREE.Box3();
    this.tempSize = new THREE.Vector3();
    this.tempCenter = new THREE.Vector3();
    this.tempWorldPosition = new THREE.Vector3();
    this.tempWorldLookAt = new THREE.Vector3();
    this.tempWorldPositionB = new THREE.Vector3();
    this.tempLocalStart = new THREE.Vector3();
    this.tempLocalEnd = new THREE.Vector3();
    this.tempLocalMid = new THREE.Vector3();
    this.tempLocalElbow = new THREE.Vector3();
    this.tempDirection = new THREE.Vector3();
    this.tempQuaternion = new THREE.Quaternion();
  }

  createPhysicsWorld() {
    const world = new this.CANNON.World();
    world.gravity.set(0, 0, 0);
    world.broadphase = new this.CANNON.NaiveBroadphase();
    world.solver.iterations = 10;
    world.allowSleep = false;
    return world;
  }

  // Load the player GLTF, normalize it to the road, and build the extra premium-feel pieces around it.
  async loadCarModel(modelUrl = this.options.modelUrl) {
    const gltf = await this.loader.loadAsync(modelUrl);
    const loadedScene = gltf.scene || gltf.scenes?.[0];

    if (!loadedScene) {
      throw new Error(`GLTF at "${modelUrl}" did not include a scene.`);
    }

    if (this.model) {
      this.modelPivot.remove(this.model);
    }

    this.model = loadedScene;
    this.model.name = "PlayerCarModel";
    this.modelPivot.add(this.model);

    this.optimizeModel();
    this.fixModelOrientation();
    this.normalizeModelScale();
    this.centerAndGroundModel();
    this.captureNamedMeshes();
    this.applyPlayerPalette();
    await this.buildHeroExterior();
    this.createIndicatorMeshes();
    this.buildCockpit();
    this.updateCameraAnchors();

    if (!this.physicsBody) {
      this.setupPhysics();
    } else {
      this.refreshPhysicsShape();
    }

    this.setViewMode(this.viewMode);
    this.syncVisuals(0);
    return this.carGroup;
  }

  optimizeModel() {
    this.model.traverse((child) => {
      if (!child.isMesh) {
        return;
      }

      child.castShadow = true;
      child.receiveShadow = true;
      child.frustumCulled = false;

      for (const material of getMaterialList(child.material)) {
        if (!material) {
          continue;
        }

        if ("metalness" in material) {
          material.metalness = Math.max(material.metalness ?? 0, 0.56);
        }

        if ("roughness" in material) {
          material.roughness = Math.min(material.roughness ?? 1, 0.36);
        }

        if ("envMapIntensity" in material) {
          material.envMapIntensity = 1.15;
        }
      }
    });
  }

  fixModelOrientation() {
    this.model.rotation.set(0, 0, 0);
    this.model.updateMatrixWorld(true);

    this.tempBox.setFromObject(this.model);
    this.tempBox.getSize(this.tempSize);

    if (this.tempSize.x > this.tempSize.z) {
      this.model.rotation.y = Math.PI * 0.5;
    }

    this.model.rotation.y += this.options.yawCorrection;
    this.model.updateMatrixWorld(true);
  }

  normalizeModelScale() {
    this.tempBox.setFromObject(this.model);
    this.tempBox.getSize(this.tempSize);

    const widthScale = this.options.targetWidth / Math.max(this.tempSize.x, 0.001);
    const lengthScale = this.options.targetLength / Math.max(this.tempSize.z, 0.001);
    const uniformScale = Math.min(widthScale, lengthScale);

    this.model.scale.setScalar(uniformScale);
    this.model.updateMatrixWorld(true);

    this.tempBox.setFromObject(this.model);
    this.tempBox.getSize(this.tempSize);

    this.modelBounds.width = this.tempSize.x;
    this.modelBounds.height = this.tempSize.y;
    this.modelBounds.length = this.tempSize.z;
  }

  // Center the vehicle so the collider can hug the rendered body instead of lagging behind it.
  centerAndGroundModel() {
    this.tempBox.setFromObject(this.model);
    this.tempBox.getCenter(this.tempCenter);

    this.model.position.x -= this.tempCenter.x;
    this.model.position.z -= this.tempCenter.z;
    this.model.updateMatrixWorld(true);

    this.tempBox.setFromObject(this.model);
    this.model.position.y -= this.tempBox.min.y;
    this.model.updateMatrixWorld(true);

    this.tempBox.setFromObject(this.model);
    this.tempBox.getSize(this.tempSize);

    this.modelBounds.width = this.tempSize.x;
    this.modelBounds.height = this.tempSize.y;
    this.modelBounds.length = this.tempSize.z;
    this.modelBasePosition.copy(this.model.position);
  }

  captureNamedMeshes() {
    this.stockWheelMeshes.length = 0;
    this.wheels.length = 0;
    this.frontWheels.length = 0;
    this.rearWheels.length = 0;
    this.frontLights.length = 0;
    this.rearLights.length = 0;
    this.wheelBaseRotations.clear();

    this.model.traverse((child) => {
      if (!child.isMesh) {
        return;
      }

      const name = child.name.toLowerCase();

      if (name.includes("wheel")) {
        this.stockWheelMeshes.push(child);
        this.wheels.push(child);
        this.wheelBaseRotations.set(child.uuid, child.rotation.clone());

        if (name.includes("front")) {
          this.frontWheels.push(child);
        } else if (name.includes("rear")) {
          this.rearWheels.push(child);
        }
      }

      if (name.includes("rearlight")) {
        this.rearLights.push(child);
      } else if (name.includes("light")) {
        this.frontLights.push(child);
      }
    });
  }

  applyPlayerPalette() {
    const bodyColor = new THREE.Color(0xf8efde);
    const cabinColor = new THREE.Color(0xc99b61);
    const wheelColor = new THREE.Color(0x644b2f);
    const lightColor = new THREE.Color(0xf2ddbc);
    const rearColor = new THREE.Color(0xb77f48);
    const trimColor = new THREE.Color(0x7b5a36);

    this.model.traverse((child) => {
      if (!child.isMesh) {
        return;
      }

      const name = child.name.toLowerCase();

      for (const material of getMaterialList(child.material)) {
        if (!material || !("color" in material)) {
          continue;
        }

        if (name.includes("body")) {
          material.color.copy(bodyColor);
          if ("clearcoat" in material) {
            material.clearcoat = 1;
            material.clearcoatRoughness = 0.08;
          }
        } else if (name.includes("cabin")) {
          material.color.copy(cabinColor);
        } else if (name.includes("rearlight")) {
          material.color.copy(rearColor);
        } else if (name.includes("light")) {
          material.color.copy(lightColor);
        } else if (name.includes("wheel")) {
          material.color.copy(wheelColor);
        } else {
          material.color.lerp(trimColor, 0.18);
        }

        if ("metalness" in material) {
          material.metalness = name.includes("wheel") ? 0.18 : name.includes("body") ? 0.38 : 0.24;
        }

        if ("roughness" in material) {
          material.roughness = name.includes("body") ? 0.36 : name.includes("light") ? 0.16 : 0.5;
        }

        if ("envMapIntensity" in material) {
          material.envMapIntensity = 0.62;
        }

        if (name.includes("glass") || name.includes("window")) {
          material.transparent = true;
          material.opacity = 0.64;
          material.roughness = 0.14;
          material.metalness = 0;
          if ("transmission" in material) {
            material.transmission = 0.42;
            material.thickness = 0.16;
            material.ior = 1.45;
          }
        }

        if ("emissive" in material) {
          if (name.includes("rearlight")) {
            material.emissive = rearColor.clone();
            material.emissiveIntensity = 0.12;
          } else if (name.includes("light")) {
            material.emissive = lightColor.clone();
            material.emissiveIntensity = 0.16;
          }
        }
      }
    });
  }

  async buildHeroExterior() {
    clearGroup(this.heroRig);
    clearGroup(this.lightingRig);
    this.tireAccentMaterials.length = 0;
    this.headlightLensMaterials.length = 0;
    this.brakeLightMaterials.length = 0;
    this.brakeGlowMaterials.length = 0;
    this.headlightSpotLights.length = 0;
    this.headlightTargets.length = 0;
    this.headlightBeams.length = 0;

    const bodyWidth = this.modelBounds.width * 0.84;
    const bodyLength = this.modelBounds.length * 0.9;
    const bodyHeight = Math.max(this.modelBounds.height * 0.76, 1.2);
    const roofWidth = bodyWidth * 0.62;
    const roofLength = bodyLength * 0.42;
    const wheelRadius = THREE.MathUtils.clamp(this.modelBounds.height * 0.215, 0.36, 0.46);
    const wheelWidth = 0.28;
    const wheelTrack = bodyWidth * 0.46;
    const wheelY = wheelRadius + 0.02;
    const frontWheelZ = -bodyLength * 0.35;
    const rearWheelZ = bodyLength * 0.33;
    const frontBumperZ = -bodyLength * 0.49;
    const rearBumperZ = bodyLength * 0.49;
    const cabinY = wheelRadius * 1.85;
    const roofY = wheelRadius * 2.3;
    const windowY = wheelRadius * 1.92;
    const lightY = wheelRadius * 1.42;

    const paintMaterial = createCarPaintMaterial(0xb93225, {
      metalness: 0.52,
      roughness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.08
    });
    const accentPaintMaterial = createCarPaintMaterial(0xd44933, {
      metalness: 0.44,
      roughness: 0.28,
      clearcoat: 0.88,
      clearcoatRoughness: 0.1
    });
    const trimMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x2c2f35,
      metalness: 0.42,
      roughness: 0.48,
      clearcoat: 0.16,
      envMapIntensity: 0.42
    });
    const chromeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd9dfe7,
      metalness: 0.94,
      roughness: 0.18,
      envMapIntensity: 0.9
    });
    const tireMaterial = new THREE.MeshStandardMaterial({
      color: 0x121416,
      roughness: 0.94,
      metalness: 0.05
    });
    const rimMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xc8d0da,
      metalness: 0.88,
      roughness: 0.24,
      clearcoat: 0.12,
      envMapIntensity: 0.88
    });
    const brakeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xc98126,
      metalness: 0.84,
      roughness: 0.22
    });
    const brakeDiscMaterial = new THREE.MeshStandardMaterial({
      color: 0x9ea5b0,
      metalness: 0.76,
      roughness: 0.3
    });
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x82c7df,
      transparent: true,
      opacity: 0.46,
      transmission: 0.5,
      thickness: 0.18,
      ior: 1.45,
      roughness: 0.1,
      metalness: 0,
      envMapIntensity: 0.68,
      side: THREE.DoubleSide
    });
    const headLightMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf8f1de,
      emissive: new THREE.Color(0xf5ddb7),
      emissiveIntensity: 0.12,
      transparent: true,
      opacity: 0.84,
      metalness: 0.08,
      roughness: 0.16,
      clearcoat: 0.24
    });
    const rearLightMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x9d1618,
      emissive: new THREE.Color(0x8f0f11),
      emissiveIntensity: 0.18,
      metalness: 0.16,
      roughness: 0.26
    });
    const tireAccentMaterialFactory = () =>
      new THREE.MeshStandardMaterial({
        color: 0xd4dde9,
        emissive: new THREE.Color(0xe6edf7),
        emissiveIntensity: 0.06,
        roughness: 0.28,
        metalness: 0.86
      });
    const badgeMaterial = new THREE.MeshBasicMaterial({
      map: this.logoTexture,
      transparent: true,
      toneMapped: false
    });
    const beamMaterialFactory = () =>
      new THREE.MeshBasicMaterial({
        color: 0xf6e8c8,
        transparent: true,
        opacity: 0.02,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
        side: THREE.DoubleSide
      });
    const brakeGlowMaterialFactory = () =>
      new THREE.MeshBasicMaterial({
        color: 0xff4d45,
        transparent: true,
        opacity: 0.04,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
        side: THREE.DoubleSide
      });

    const exteriorRig = new THREE.Group();
    exteriorRig.name = "PlayerCarStandaloneExterior";
    this.heroRig.add(exteriorRig);

    const addExteriorMesh = (geometry, material, position, rotation = null, parent = exteriorRig) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(position);
      if (rotation) {
        mesh.rotation.set(rotation.x, rotation.y, rotation.z);
      }
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };

    const standaloneUrl = createCarModelUrl();
    try {
      const gltf = await this.loader.loadAsync(standaloneUrl);
      const shell = gltf.scene || gltf.scenes?.[0];

      if (shell) {
        const widthScale = bodyWidth / STANDALONE_HERO_SIZE.width;
        const heightScale = bodyHeight / STANDALONE_HERO_SIZE.height;
        const lengthScale = bodyLength / STANDALONE_HERO_SIZE.length;

        shell.name = "PlayerCarStandaloneShell";
        shell.rotation.y = Math.PI;
        shell.scale.set(widthScale, heightScale, lengthScale);
        shell.position.y = wheelRadius * 0.46 + 0.11 * heightScale;
        shell.traverse((child) => {
          if (!child.isMesh) {
            return;
          }

          child.material = paintMaterial.clone();
          child.castShadow = true;
          child.receiveShadow = true;
        });
        exteriorRig.add(shell);
      }
    } finally {
      URL.revokeObjectURL(standaloneUrl);
    }

    addExteriorMesh(
      new RoundedBoxGeometry(bodyWidth * 0.54, 0.18, bodyLength * 0.3, 6, 0.05),
      accentPaintMaterial,
      new THREE.Vector3(0, wheelRadius * 1.12, -bodyLength * 0.16)
    );
    addExteriorMesh(
      new RoundedBoxGeometry(roofWidth, 0.12, roofLength, 6, 0.04),
      paintMaterial,
      new THREE.Vector3(0, roofY, -bodyLength * 0.06)
    );
    addExteriorMesh(
      new THREE.BoxGeometry(bodyWidth * 0.8, 0.06, 0.18),
      trimMaterial,
      new THREE.Vector3(0, wheelRadius * 0.86, frontBumperZ + 0.08)
    );
    addExteriorMesh(
      new THREE.BoxGeometry(bodyWidth * 0.74, 0.08, 0.16),
      trimMaterial,
      new THREE.Vector3(0, wheelRadius * 0.9, rearBumperZ - 0.04)
    );
    addExteriorMesh(
      new THREE.BoxGeometry(0.08, 0.08, bodyLength * 0.66),
      trimMaterial,
      new THREE.Vector3(-bodyWidth * 0.48, wheelRadius * 0.82, 0)
    );
    addExteriorMesh(
      new THREE.BoxGeometry(0.08, 0.08, bodyLength * 0.66),
      trimMaterial,
      new THREE.Vector3(bodyWidth * 0.48, wheelRadius * 0.82, 0)
    );

    addExteriorMesh(
      new THREE.PlaneGeometry(roofWidth * 0.92, bodyHeight * 0.36),
      glassMaterial,
      new THREE.Vector3(0, windowY, -bodyLength * 0.1),
      new THREE.Euler(-0.62, 0, 0)
    );
    addExteriorMesh(
      new THREE.PlaneGeometry(roofWidth * 0.82, bodyHeight * 0.24),
      glassMaterial,
      new THREE.Vector3(0, windowY - 0.08, bodyLength * 0.23),
      new THREE.Euler(0.62, Math.PI, 0)
    );

    const sideGlassGeometry = new THREE.PlaneGeometry(bodyLength * 0.26, bodyHeight * 0.18);
    addExteriorMesh(
      sideGlassGeometry,
      glassMaterial,
      new THREE.Vector3(-bodyWidth * 0.34, cabinY, -bodyLength * 0.02),
      new THREE.Euler(0, Math.PI * 0.5, -0.08)
    );
    addExteriorMesh(
      sideGlassGeometry,
      glassMaterial,
      new THREE.Vector3(bodyWidth * 0.34, cabinY, -bodyLength * 0.02),
      new THREE.Euler(0, -Math.PI * 0.5, 0.08)
    );

    const mirrorGeometry = new RoundedBoxGeometry(0.16, 0.12, 0.2, 4, 0.03);
    addExteriorMesh(
      mirrorGeometry,
      trimMaterial,
      new THREE.Vector3(-bodyWidth * 0.46, cabinY + 0.06, -bodyLength * 0.11),
      new THREE.Euler(0.12, 0.14, 0.08)
    );
    addExteriorMesh(
      mirrorGeometry,
      trimMaterial,
      new THREE.Vector3(bodyWidth * 0.46, cabinY + 0.06, -bodyLength * 0.11),
      new THREE.Euler(0.12, -0.14, -0.08)
    );

    const grille = addExteriorMesh(
      new THREE.BoxGeometry(bodyWidth * 0.36, 0.14, 0.05),
      chromeMaterial,
      new THREE.Vector3(0, lightY - 0.04, frontBumperZ + 0.02)
    );
    grille.castShadow = false;

    const frontBadge = addExteriorMesh(
      new THREE.CircleGeometry(0.1, 24),
      badgeMaterial,
      new THREE.Vector3(0, lightY - 0.01, frontBumperZ + 0.05)
    );
    frontBadge.castShadow = false;

    const rearBadge = addExteriorMesh(
      new THREE.CircleGeometry(0.1, 24),
      badgeMaterial,
      new THREE.Vector3(0, lightY + 0.02, rearBumperZ + 0.02)
    );
    rearBadge.castShadow = false;

    const headlightGeometry = new RoundedBoxGeometry(0.24, 0.1, 0.1, 5, 0.02);
    const leftHeadlight = addExteriorMesh(
      headlightGeometry,
      headLightMaterial,
      new THREE.Vector3(-bodyWidth * 0.25, lightY, frontBumperZ + 0.12),
      new THREE.Euler(0, 0.08, 0)
    );
    const rightHeadlight = addExteriorMesh(
      headlightGeometry,
      headLightMaterial,
      new THREE.Vector3(bodyWidth * 0.25, lightY, frontBumperZ + 0.12),
      new THREE.Euler(0, -0.08, 0)
    );
    leftHeadlight.castShadow = false;
    rightHeadlight.castShadow = false;

    const tailLightGeometry = new RoundedBoxGeometry(0.22, 0.08, 0.08, 5, 0.02);
    const leftTailLight = addExteriorMesh(
      tailLightGeometry,
      rearLightMaterial,
      new THREE.Vector3(-bodyWidth * 0.25, lightY - 0.04, rearBumperZ - 0.02),
      new THREE.Euler(0, -0.1, 0)
    );
    const rightTailLight = addExteriorMesh(
      tailLightGeometry,
      rearLightMaterial,
      new THREE.Vector3(bodyWidth * 0.25, lightY - 0.04, rearBumperZ - 0.02),
      new THREE.Euler(0, 0.1, 0)
    );
    leftTailLight.castShadow = false;
    rightTailLight.castShadow = false;

    const rearLightBar = addExteriorMesh(
      new RoundedBoxGeometry(bodyWidth * 0.22, 0.05, 0.05, 4, 0.015),
      rearLightMaterial,
      new THREE.Vector3(0, lightY - 0.03, rearBumperZ)
    );
    rearLightBar.castShadow = false;

    this.headlightLensMaterials.push(headLightMaterial);
    this.brakeLightMaterials.push(rearLightMaterial);

    const exhaustGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.22, 16);
    const exhaustLeft = addExteriorMesh(
      exhaustGeometry,
      chromeMaterial,
      new THREE.Vector3(-0.18, wheelRadius * 0.6, rearBumperZ + 0.06),
      new THREE.Euler(Math.PI * 0.5, 0, 0)
    );
    exhaustLeft.castShadow = false;
    const exhaustRight = exhaustLeft.clone();
    exhaustRight.position.x = 0.18;
    exteriorRig.add(exhaustRight);

    this.stockWheelMeshes.forEach((wheelMesh) => {
      wheelMesh.visible = false;
    });
    this.wheels.length = 0;
    this.frontWheels.length = 0;
    this.rearWheels.length = 0;
    this.wheelBaseRotations.clear();

    const wheelPlacements = [
      { position: new THREE.Vector3(-wheelTrack, wheelY, frontWheelZ), isFront: true, caliperSide: -1 },
      { position: new THREE.Vector3(wheelTrack, wheelY, frontWheelZ), isFront: true, caliperSide: 1 },
      { position: new THREE.Vector3(-wheelTrack, wheelY, rearWheelZ), isFront: false, caliperSide: -1 },
      { position: new THREE.Vector3(wheelTrack, wheelY, rearWheelZ), isFront: false, caliperSide: 1 }
    ];

    wheelPlacements.forEach(({ position, isFront, caliperSide }) => {
      const wheel = new THREE.Group();
      wheel.position.copy(position);
      wheel.rotation.z = Math.PI * 0.5;
      wheel.castShadow = true;
      wheel.receiveShadow = true;

      const tire = new THREE.Mesh(
        new THREE.SphereGeometry(wheelRadius * 0.98, 28, 28),
        tireMaterial
      );
      tire.castShadow = true;
      tire.receiveShadow = true;
      wheel.add(tire);

      const tireAccentMaterial = tireAccentMaterialFactory();
      const tireCore = new THREE.Mesh(
        new THREE.SphereGeometry(wheelRadius * 0.56, 20, 20),
        tireAccentMaterial
      );
      tireCore.castShadow = true;
      tireCore.receiveShadow = true;
      wheel.add(tireCore);

      const hubCap = new THREE.Mesh(
        new THREE.SphereGeometry(wheelRadius * 0.24, 16, 16),
        chromeMaterial
      );
      hubCap.castShadow = true;
      hubCap.receiveShadow = true;
      wheel.add(hubCap);

      const treadStripe = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, wheelRadius * 1.08, 0.09),
        rimMaterial
      );
      treadStripe.position.z = wheelRadius * 0.18;
      treadStripe.castShadow = true;
      treadStripe.receiveShadow = true;
      wheel.add(treadStripe);

      const treadStripeCross = treadStripe.clone();
      treadStripeCross.rotation.z = Math.PI * 0.5;
      treadStripeCross.position.z = wheelRadius * 0.18;
      wheel.add(treadStripeCross);

      const brakeDisc = new THREE.Mesh(
        new THREE.CylinderGeometry(wheelRadius * 0.42, wheelRadius * 0.42, 0.08, 18),
        brakeDiscMaterial
      );
      brakeDisc.rotation.z = Math.PI * 0.5;
      brakeDisc.position.x = caliperSide * 0.11;
      wheel.add(brakeDisc);

      const caliper = new THREE.Mesh(
        new RoundedBoxGeometry(0.08, 0.14, 0.1, 4, 0.018),
        brakeMaterial
      );
      caliper.position.set(caliperSide * 0.18, wheelRadius * 0.14, 0);
      wheel.add(caliper);

      this.tireAccentMaterials.push(tireAccentMaterial);
      exteriorRig.add(wheel);
      this.wheels.push(wheel);
      this.wheelBaseRotations.set(wheel.uuid, wheel.rotation.clone());

      if (isFront) {
        this.frontWheels.push(wheel);
      } else {
        this.rearWheels.push(wheel);
      }
    });

    const headlightOffsets = [-bodyWidth * 0.25, bodyWidth * 0.25];

    headlightOffsets.forEach((offsetX) => {
      const beamPivot = new THREE.Group();
      beamPivot.position.set(offsetX, lightY, frontBumperZ + 0.12);
      this.lightingRig.add(beamPivot);

      const beamMaterial = beamMaterialFactory();
      const beam = new THREE.Mesh(
        new THREE.ConeGeometry(0.52, 1.05, 24, 1, true),
        beamMaterial
      );
      beam.rotation.x = -Math.PI * 0.5;
      beam.position.z = -0.56;
      beam.renderOrder = 2;
      beamPivot.add(beam);

      const light = new THREE.SpotLight(0xf6e6c4, 0, 32, 0.3, 0.48, 1.2);
      light.position.set(offsetX, lightY, frontBumperZ + 0.1);
      light.castShadow = false;
      this.lightingRig.add(light);

      const target = new THREE.Object3D();
      target.position.set(offsetX * 1.04, 0.04, -30);
      this.lightingRig.add(target);
      light.target = target;

      this.headlightSpotLights.push(light);
      this.headlightTargets.push(target);
      this.headlightBeams.push({ pivot: beamPivot, mesh: beam, material: beamMaterial });
    });

    [-bodyWidth * 0.22, bodyWidth * 0.22].forEach((offsetX) => {
      const glowMaterial = brakeGlowMaterialFactory();
      const glow = new THREE.Mesh(
        new THREE.PlaneGeometry(0.32, 0.16),
        glowMaterial
      );
      glow.position.set(offsetX, lightY - 0.04, rearBumperZ + 0.04);
      this.lightingRig.add(glow);
      this.brakeGlowMaterials.push(glowMaterial);
    });

    this.applyVehicleLighting(this.options.forwardVisualSpeed, true);
    this.applyHeadlightMode(true);
  }

  createIndicatorMeshes() {
    while (this.indicatorRig.children.length) {
      this.indicatorRig.remove(this.indicatorRig.children[0]);
    }

    this.indicatorMaterials.left.length = 0;
    this.indicatorMaterials.right.length = 0;

    const bodyWidth = this.modelBounds.width * 0.84;
    const bodyLength = this.modelBounds.length * 0.9;
    const frontY = Math.max(this.modelBounds.height * 0.48, 0.68);
    const rearY = Math.max(this.modelBounds.height * 0.44, 0.62);
    const sideY = Math.max(this.modelBounds.height * 0.43, 0.6);
    const frontX = bodyWidth * 0.42;
    const rearX = bodyWidth * 0.4;
    const sideX = bodyWidth * 0.53;
    const frontZ = -bodyLength * 0.485;
    const rearZ = bodyLength * 0.49;
    const sideZ = -bodyLength * 0.16;

    const placements = [
      {
        side: "left",
        geometry: new RoundedBoxGeometry(0.2, 0.07, 0.05, 4, 0.015),
        position: new THREE.Vector3(-frontX, frontY, frontZ),
        rotation: new THREE.Euler(0, 0.32, 0)
      },
      {
        side: "right",
        geometry: new RoundedBoxGeometry(0.2, 0.07, 0.05, 4, 0.015),
        position: new THREE.Vector3(frontX, frontY, frontZ),
        rotation: new THREE.Euler(0, -0.32, 0)
      },
      {
        side: "left",
        geometry: new RoundedBoxGeometry(0.18, 0.07, 0.05, 4, 0.015),
        position: new THREE.Vector3(-rearX, rearY, rearZ),
        rotation: new THREE.Euler(0, -0.26, 0)
      },
      {
        side: "right",
        geometry: new RoundedBoxGeometry(0.18, 0.07, 0.05, 4, 0.015),
        position: new THREE.Vector3(rearX, rearY, rearZ),
        rotation: new THREE.Euler(0, 0.26, 0)
      },
      {
        side: "left",
        geometry: new RoundedBoxGeometry(0.09, 0.05, 0.04, 4, 0.012),
        position: new THREE.Vector3(-sideX, sideY, sideZ),
        rotation: new THREE.Euler(0, Math.PI * 0.5, 0)
      },
      {
        side: "right",
        geometry: new RoundedBoxGeometry(0.09, 0.05, 0.04, 4, 0.012),
        position: new THREE.Vector3(sideX, sideY, sideZ),
        rotation: new THREE.Euler(0, Math.PI * 0.5, 0)
      }
    ];

    placements.forEach(({ side, geometry, position, rotation }) => {
      const material = new THREE.MeshBasicMaterial({
        color: 0x8a5b12,
        transparent: true,
        opacity: 0.34,
        toneMapped: false
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(position);
      mesh.rotation.copy(rotation);
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      mesh.renderOrder = 4;
      this.indicatorRig.add(mesh);
      this.indicatorMaterials[side].push(material);
    });
  }

  buildCockpit() {
    while (this.cockpitRig.children.length) {
      this.cockpitRig.remove(this.cockpitRig.children[0]);
    }

    this.cockpitForegroundRig = null;
    this.dashboardNeedle = null;
    this.steeringWheelPivot = null;
    this.leftShoulderAnchor = null;
    this.rightShoulderAnchor = null;
    this.leftHandPivot = null;
    this.rightHandPivot = null;
    this.leftUpperArmMesh = null;
    this.rightUpperArmMesh = null;
    this.leftForearmMesh = null;
    this.rightForearmMesh = null;
    this.gearLeverPivot = null;
    this.acceleratorPedalPivot = null;
    this.brakePedalPivot = null;

    const interiorDark = new THREE.MeshStandardMaterial({ color: 0x5a4327, roughness: 0.84, metalness: 0.1 });
    const panelMaterial = new THREE.MeshStandardMaterial({ color: 0xe6d2af, roughness: 0.42, metalness: 0.16 });
    const trimMaterial = new THREE.MeshStandardMaterial({ color: 0xb68446, roughness: 0.28, metalness: 0.42 });
    const seatMaterial = new THREE.MeshStandardMaterial({ color: 0x765336, roughness: 0.76, metalness: 0.08 });
    const wheelMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x2f2319,
      roughness: 0.42,
      metalness: 0.32,
      clearcoat: 0.4,
      clearcoatRoughness: 0.18
    });
    const sleeveMaterial = new THREE.MeshStandardMaterial({ color: 0xf6eddc, roughness: 0.74, metalness: 0.02 });
    const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xe6c79f, roughness: 0.78, metalness: 0.02 });
    const slotMaterial = new THREE.MeshStandardMaterial({ color: 0x342315, roughness: 0.88, metalness: 0.06 });
    const badgeMaterial = new THREE.MeshBasicMaterial({
      map: this.logoTexture,
      transparent: true,
      toneMapped: false
    });
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0xfffbf2,
      transparent: true,
      opacity: 0.015,
      roughness: 0.02,
      metalness: 0,
      side: THREE.DoubleSide
    });

    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(this.modelBounds.width * 1.02, 0.08, this.modelBounds.length * 1.08),
      interiorDark
    );
    floor.position.set(0, 0.12, 0.58);
    this.cockpitRig.add(floor);

    const dashBase = new THREE.Mesh(
      new THREE.BoxGeometry(this.modelBounds.width * 0.96, 0.08, 0.24),
      trimMaterial
    );
    dashBase.position.set(0, 0.33, -0.88);
    this.cockpitRig.add(dashBase);

    const dashboardTop = new THREE.Mesh(
      new THREE.BoxGeometry(this.modelBounds.width * 0.8, 0.035, 0.18),
      panelMaterial
    );
    dashboardTop.position.set(0, 0.47, -1.02);
    dashboardTop.rotation.x = -0.16;
    this.cockpitRig.add(dashboardTop);

    const binnacle = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.13, 0.2),
      trimMaterial
    );
    binnacle.position.set(-0.42, 0.55, -0.9);
    binnacle.rotation.x = -0.18;
    this.cockpitRig.add(binnacle);

    const instrumentCluster = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.08, 0.13),
      panelMaterial
    );
    instrumentCluster.position.set(-0.42, 0.58, -0.77);
    instrumentCluster.rotation.x = -0.28;
    this.cockpitRig.add(instrumentCluster);

    const needlePivot = new THREE.Group();
    needlePivot.position.set(-0.42, 0.62, -0.71);
    const needle = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.02, 0.2),
      new THREE.MeshBasicMaterial({ color: 0xc79859 })
    );
    needle.position.z = -0.1;
    needlePivot.add(needle);
    this.cockpitRig.add(needlePivot);
    this.dashboardNeedle = needlePivot;

    const leftSeat = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 0.5, 0.46),
      seatMaterial
    );
    leftSeat.position.set(-0.38, 0.32, 0.88);
    this.cockpitRig.add(leftSeat);

    const rightSeat = leftSeat.clone();
    rightSeat.position.x = 0.38;
    this.cockpitRig.add(rightSeat);

    const seatBack = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.46, 0.12),
      seatMaterial
    );
    seatBack.position.set(-0.38, 0.52, 0.7);
    this.cockpitRig.add(seatBack);

    const seatBackRight = seatBack.clone();
    seatBackRight.position.x = 0.38;
    this.cockpitRig.add(seatBackRight);

    const rearBulkhead = new THREE.Mesh(
      new THREE.BoxGeometry(this.modelBounds.width * 1.02, 0.9, 0.08),
      trimMaterial
    );
    rearBulkhead.position.set(0, 0.9, 1.38);
    this.cockpitRig.add(rearBulkhead);

    const roofShell = new THREE.Mesh(
      new THREE.BoxGeometry(this.modelBounds.width * 1.02, 0.06, this.modelBounds.length * 0.7),
      trimMaterial
    );
    roofShell.position.set(0, 1.6, 0.18);
    this.cockpitRig.add(roofShell);

    const headliner = new THREE.Mesh(
      new THREE.BoxGeometry(this.modelBounds.width * 0.82, 0.024, this.modelBounds.length * 0.62),
      panelMaterial
    );
    headliner.position.set(0, 1.53, 0.12);
    this.cockpitRig.add(headliner);

    const doorLower = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.52, this.modelBounds.length * 0.84),
      trimMaterial
    );
    doorLower.position.set(-this.modelBounds.width * 0.54, 0.44, 0.28);
    this.cockpitRig.add(doorLower);

    const doorLowerRight = doorLower.clone();
    doorLowerRight.position.x = this.modelBounds.width * 0.54;
    this.cockpitRig.add(doorLowerRight);

    const doorTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.14, this.modelBounds.length * 0.74),
      panelMaterial
    );
    doorTop.position.set(-this.modelBounds.width * 0.5, 0.84, 0.16);
    this.cockpitRig.add(doorTop);

    const doorTopRight = doorTop.clone();
    doorTopRight.position.x = this.modelBounds.width * 0.5;
    this.cockpitRig.add(doorTopRight);

    const armRest = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.1, 0.5),
      interiorDark
    );
    armRest.position.set(-this.modelBounds.width * 0.48, 0.44, 0.06);
    this.cockpitRig.add(armRest);

    const armRestRight = armRest.clone();
    armRestRight.position.x = this.modelBounds.width * 0.48;
    this.cockpitRig.add(armRestRight);

    const windshieldTop = new THREE.Mesh(
      new THREE.BoxGeometry(this.modelBounds.width * 1.05, 0.025, 0.04),
      trimMaterial
    );
    windshieldTop.position.set(0, 1.46, -2.38);
    this.cockpitRig.add(windshieldTop);

    const pillarLeft = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.98, 0.04),
      trimMaterial
    );
    pillarLeft.position.set(-this.modelBounds.width * 0.58, 0.82, -1.98);
    pillarLeft.rotation.z = 0.11;
    this.cockpitRig.add(pillarLeft);

    const pillarRight = pillarLeft.clone();
    pillarRight.position.x = this.modelBounds.width * 0.58;
    pillarRight.rotation.z = -0.12;
    this.cockpitRig.add(pillarRight);

    const windshield = new THREE.Mesh(
      new THREE.PlaneGeometry(this.modelBounds.width * 1.08, 1.26),
      glassMaterial
    );
    windshield.position.set(0, 0.9, -2.36);
    windshield.rotation.x = -0.02;
    this.cockpitRig.add(windshield);

    const hood = new THREE.Mesh(
      new THREE.BoxGeometry(this.modelBounds.width * 0.72, 0.04, 0.52),
      panelMaterial
    );
    hood.position.set(0, 0.16, -2.86);
    hood.rotation.x = 0.03;
    this.cockpitRig.add(hood);

    const hoodLightMaterial = new THREE.MeshBasicMaterial({
      color: 0xf2ddb7,
      transparent: true,
      opacity: 0.34,
      toneMapped: false
    });
    const hoodLightLeft = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.012, 0.08),
      hoodLightMaterial
    );
    hoodLightLeft.position.set(-this.modelBounds.width * 0.24, 0.2, -3.03);
    hoodLightLeft.rotation.x = 0.03;
    this.cockpitRig.add(hoodLightLeft);

    const hoodLightRight = hoodLightLeft.clone();
    hoodLightRight.position.x *= -1;
    this.cockpitRig.add(hoodLightRight);

    const cowl = new THREE.Mesh(
      new THREE.BoxGeometry(this.modelBounds.width * 0.76, 0.08, 0.22),
      trimMaterial
    );
    cowl.position.set(0, 0.2, -1.38);
    this.cockpitRig.add(cowl);

    this.cockpitCameraMount = new THREE.Object3D();
    this.cockpitCameraMount.position.set(-0.2, 1.02, 0.52);
    this.cockpitRig.add(this.cockpitCameraMount);

    this.cockpitLookAnchor = new THREE.Object3D();
    this.cockpitLookAnchor.position.set(-0.08, 0.94, -18.8);
    this.cockpitRig.add(this.cockpitLookAnchor);

    const foregroundRig = new THREE.Group();
    this.cockpitCameraMount.add(foregroundRig);
    this.cockpitForegroundRig = foregroundRig;

    const steeringColumn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.05, 0.44, 12),
      interiorDark
    );
    steeringColumn.position.set(-0.22, -0.2, -1.02);
    steeringColumn.rotation.x = 1.02;
    foregroundRig.add(steeringColumn);

    const steeringWheelPivot = new THREE.Group();
    steeringWheelPivot.position.set(-0.26, -0.17, -0.84);
    steeringWheelPivot.rotation.x = 1.02;
    foregroundRig.add(steeringWheelPivot);
    this.steeringWheelPivot = steeringWheelPivot;

    const steeringWheel = new THREE.Mesh(
      new THREE.TorusGeometry(0.2, 0.028, 16, 36),
      wheelMaterial
    );
    steeringWheelPivot.add(steeringWheel);

    const steeringHub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.045, 16),
      trimMaterial
    );
    steeringHub.rotation.x = Math.PI * 0.5;
    steeringWheelPivot.add(steeringHub);

    const steeringAccent = new THREE.Mesh(
      new THREE.TorusGeometry(0.11, 0.008, 10, 24),
      trimMaterial
    );
    steeringAccent.rotation.x = Math.PI * 0.5;
    steeringWheelPivot.add(steeringAccent);

    const steeringBadge = new THREE.Mesh(
      new THREE.CircleGeometry(0.04, 24),
      badgeMaterial
    );
    steeringBadge.position.z = 0.026;
    steeringWheelPivot.add(steeringBadge);

    for (let index = 0; index < 3; index += 1) {
      const spoke = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.14, 0.024),
        wheelMaterial
      );
      spoke.rotation.z = (Math.PI * 2 * index) / 3;
      steeringWheelPivot.add(spoke);
    }

    const driverTorso = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.42, 0.22),
      sleeveMaterial
    );
    driverTorso.position.set(-0.16, -0.58, -0.24);
    driverTorso.rotation.z = 0.05;
    foregroundRig.add(driverTorso);

    const driverChest = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.12, 0.16),
      sleeveMaterial
    );
    driverChest.position.set(-0.16, -0.36, -0.38);
    foregroundRig.add(driverChest);

    const leftShoulderAnchor = new THREE.Object3D();
    leftShoulderAnchor.position.set(-0.31, -0.33, -0.5);
    foregroundRig.add(leftShoulderAnchor);
    this.leftShoulderAnchor = leftShoulderAnchor;

    const rightShoulderAnchor = new THREE.Object3D();
    rightShoulderAnchor.position.set(-0.01, -0.33, -0.5);
    foregroundRig.add(rightShoulderAnchor);
    this.rightShoulderAnchor = rightShoulderAnchor;

    const shoulderJointGeometry = new THREE.SphereGeometry(0.05, 14, 14);
    const leftShoulderJoint = new THREE.Mesh(shoulderJointGeometry, sleeveMaterial);
    leftShoulderAnchor.add(leftShoulderJoint);

    const rightShoulderJoint = new THREE.Mesh(shoulderJointGeometry, sleeveMaterial);
    rightShoulderAnchor.add(rightShoulderJoint);

    const upperArmGeometry = new THREE.CylinderGeometry(0.034, 0.04, 1, 14);
    const forearmGeometry = new THREE.CylinderGeometry(0.028, 0.034, 1, 14);

    this.leftUpperArmMesh = new THREE.Mesh(upperArmGeometry, sleeveMaterial);
    foregroundRig.add(this.leftUpperArmMesh);

    this.rightUpperArmMesh = new THREE.Mesh(upperArmGeometry, sleeveMaterial);
    foregroundRig.add(this.rightUpperArmMesh);

    this.leftForearmMesh = new THREE.Mesh(forearmGeometry, sleeveMaterial);
    foregroundRig.add(this.leftForearmMesh);

    this.rightForearmMesh = new THREE.Mesh(forearmGeometry, sleeveMaterial);
    foregroundRig.add(this.rightForearmMesh);

    const leftHandPivot = new THREE.Group();
    leftHandPivot.position.set(-0.15, 0.13, 0.04);
    steeringWheelPivot.add(leftHandPivot);
    this.leftHandPivot = leftHandPivot;

    const leftPalm = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.04, 0.06),
      skinMaterial
    );
    leftPalm.rotation.z = -0.18;
    leftHandPivot.add(leftPalm);

    const leftThumb = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.015, 0.05, 10),
      skinMaterial
    );
    leftThumb.position.set(0.03, -0.01, 0.04);
    leftThumb.rotation.set(0.55, 0.2, -0.62);
    leftHandPivot.add(leftThumb);

    const leftCuff = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.032, 0.06, 12),
      sleeveMaterial
    );
    leftCuff.position.set(-0.05, -0.01, -0.01);
    leftCuff.rotation.z = -0.34;
    leftHandPivot.add(leftCuff);

    const rightHandPivot = new THREE.Group();
    rightHandPivot.position.set(0.15, 0.13, 0.04);
    steeringWheelPivot.add(rightHandPivot);
    this.rightHandPivot = rightHandPivot;

    const rightPalm = leftPalm.clone();
    rightPalm.rotation.z = 0.18;
    rightHandPivot.add(rightPalm);

    const rightThumb = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.015, 0.05, 10),
      skinMaterial
    );
    rightThumb.position.set(-0.03, -0.01, 0.04);
    rightThumb.rotation.set(0.55, -0.2, 0.62);
    rightHandPivot.add(rightThumb);

    const rightCuff = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.032, 0.06, 12),
      sleeveMaterial
    );
    rightCuff.position.set(0.05, -0.01, -0.01);
    rightCuff.rotation.z = 0.34;
    rightHandPivot.add(rightCuff);

    const consoleTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.08, 0.5),
      trimMaterial
    );
    consoleTop.position.set(0.14, -0.4, -0.98);
    foregroundRig.add(consoleTop);

    const gearGate = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.018, 0.22),
      panelMaterial
    );
    gearGate.position.set(0.14, -0.32, -0.82);
    foregroundRig.add(gearGate);

    const slotHoles = [
      [-0.06, -0.06],
      [-0.06, 0.06],
      [0, -0.06],
      [0, 0.06],
      [0.06, -0.06]
    ];

    slotHoles.forEach(([x, z]) => {
      const slot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.018, 14),
        slotMaterial
      );
      slot.rotation.x = Math.PI * 0.5;
      slot.position.set(0.14 + x, -0.312, -0.82 + z);
      foregroundRig.add(slot);
    });

    const slotBars = [
      { x: 0.08, z: -0.82, width: 0.012, depth: 0.13 },
      { x: 0.14, z: -0.82, width: 0.012, depth: 0.13 },
      { x: 0.2, z: -0.79, width: 0.012, depth: 0.07 },
      { x: 0.14, z: -0.82, width: 0.13, depth: 0.012 }
    ];

    slotBars.forEach(({ x, z, width, depth }) => {
      const groove = new THREE.Mesh(
        new THREE.BoxGeometry(width, 0.012, depth),
        slotMaterial
      );
      groove.position.set(x, -0.312, z);
      foregroundRig.add(groove);
    });

    const gearLeverPivot = new THREE.Group();
    gearLeverPivot.position.set(0.14, -0.3, -0.82);
    this.gearLeverBasePosition.copy(gearLeverPivot.position);
    foregroundRig.add(gearLeverPivot);
    this.gearLeverPivot = gearLeverPivot;

    const gearLever = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.02, 0.24, 12),
      interiorDark
    );
    gearLever.position.y = 0.11;
    gearLever.rotation.z = 0.08;
    gearLeverPivot.add(gearLever);

    const gearKnob = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 16, 16),
      wheelMaterial
    );
    gearKnob.position.set(0, 0.22, 0);
    gearLeverPivot.add(gearKnob);

    const footwell = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.02, 0.42),
      interiorDark
    );
    footwell.position.set(-0.1, -0.58, -1.1);
    foregroundRig.add(footwell);

    const brakePedalPivot = new THREE.Group();
    brakePedalPivot.position.set(-0.06, -0.44, -1.02);
    brakePedalPivot.rotation.x = -0.22;
    foregroundRig.add(brakePedalPivot);
    this.brakePedalPivot = brakePedalPivot;

    const brakePedal = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.14, 0.024),
      trimMaterial
    );
    brakePedal.position.set(0, -0.08, 0.02);
    brakePedalPivot.add(brakePedal);

    const acceleratorPedalPivot = new THREE.Group();
    acceleratorPedalPivot.position.set(0.04, -0.46, -1.02);
    acceleratorPedalPivot.rotation.x = -0.18;
    foregroundRig.add(acceleratorPedalPivot);
    this.acceleratorPedalPivot = acceleratorPedalPivot;

    const acceleratorPedal = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.16, 0.02),
      trimMaterial
    );
    acceleratorPedal.position.set(0, -0.09, 0.02);
    acceleratorPedalPivot.add(acceleratorPedal);

    this.setGear(this.currentGear, true);
  }

  updateCameraAnchors() {
    this.chaseCameraMount.position.copy(this.options.cameraOffset);
    this.chaseLookAnchor.position.copy(this.options.cameraLookAhead);
  }

  // Create a solid box collider that closely matches the rendered body.
  setupPhysics({
    mass = this.options.mass,
    startPosition = this.options.startPosition
  } = {}) {
    const width = this.modelBounds.width || this.options.targetWidth;
    const height = this.modelBounds.height || 1.4;
    const length = this.modelBounds.length || this.options.targetLength;

    this.bodyHalfExtents = new this.CANNON.Vec3(
      width * PLAYER_COLLIDER_SCALE_X,
      Math.max(height * PLAYER_COLLIDER_SCALE_Y, 0.52),
      length * PLAYER_COLLIDER_SCALE_Z
    );
    this.bodyHalfHeight = this.bodyHalfExtents.y;

    if (!this.physicsMaterial) {
      this.physicsMaterial = new this.CANNON.Material("player-car");
    }

    if (this.physicsBody) {
      this.world.removeBody(this.physicsBody);
    }

    this.physicsBody = new this.CANNON.Body({
      mass,
      material: this.physicsMaterial
    });
    this.physicsBody.addShape(new this.CANNON.Box(this.bodyHalfExtents));
    this.physicsBody.linearDamping = 0.85;
    this.physicsBody.angularDamping = 1;
    this.physicsBody.allowSleep = false;
    this.physicsBody.fixedRotation = true;
    ensureBodyFactors(this.physicsBody, this.CANNON);
    this.physicsBody.userData = this.physicsBody.userData || {};
    this.physicsBody.userData.kind = "player";
    this.physicsBody.userData.system = this;
    this.physicsBody.updateMassProperties();
    this.physicsBody.angularFactor.set(0, 0, 0);
    this.physicsBody.position.set(startPosition.x, this.bodyHalfHeight, startPosition.z);

    this.world.addBody(this.physicsBody);
    this.visualRig.position.y = -this.bodyHalfHeight;
    this.syncVisuals(0);
    return this.physicsBody;
  }

  refreshPhysicsShape() {
    const currentPosition = this.physicsBody.position.clone();
    const currentVelocity = this.physicsBody.velocity.clone();
    const currentMass = this.physicsBody.mass;

    this.setupPhysics({
      mass: currentMass,
      startPosition: new THREE.Vector3(currentPosition.x, 0, currentPosition.z)
    });

    this.physicsBody.velocity.set(currentVelocity.x, currentVelocity.y, currentVelocity.z);
  }

  setInput({ left = false, right = false, axis = null } = {}) {
    this.inputState.left = left;
    this.inputState.right = right;

    if (axis === null) {
      axis = (right ? 1 : 0) - (left ? 1 : 0);
    }

    this.inputState.axis = THREE.MathUtils.clamp(axis, -1, 1);
  }

  setForwardVisualSpeed(speed) {
    this.options.forwardVisualSpeed = Math.max(speed, 0);
  }

  setCamera(camera) {
    this.camera = camera;
  }

  getGearLeverPose(gear) {
    const poses = {
      1: { x: -0.06, z: -0.06, rotX: -0.08, rotZ: 0.16 },
      2: { x: -0.06, z: 0.06, rotX: 0.08, rotZ: 0.14 },
      3: { x: 0, z: -0.06, rotX: -0.05, rotZ: 0.04 },
      4: { x: 0, z: 0.06, rotX: 0.06, rotZ: 0.04 },
      5: { x: 0.06, z: -0.06, rotX: -0.04, rotZ: -0.12 }
    };

    return poses[gear] || poses[3];
  }

  setGear(gear, immediate = false) {
    const clampedGear = THREE.MathUtils.clamp(Math.round(gear), 1, 5);
    this.currentGear = clampedGear;
    this.driveState.gear = clampedGear;

    if (!this.gearLeverPivot) {
      return;
    }

    const pose = this.getGearLeverPose(clampedGear);
    const targetX = this.gearLeverBasePosition.x + pose.x;
    const targetZ = this.gearLeverBasePosition.z + pose.z;

    if (immediate || !this.gsap) {
      this.gearLeverPivot.position.set(targetX, this.gearLeverBasePosition.y, targetZ);
      this.gearLeverPivot.rotation.set(pose.rotX, 0, pose.rotZ);
      return;
    }

    this.gsap.killTweensOf(this.gearLeverPivot.position);
    this.gsap.killTweensOf(this.gearLeverPivot.rotation);
    this.gsap.to(this.gearLeverPivot.position, {
      x: targetX,
      z: targetZ,
      duration: 0.18,
      ease: "power2.out",
      overwrite: true
    });
    this.gsap.to(this.gearLeverPivot.rotation, {
      x: pose.rotX,
      z: pose.rotZ,
      duration: 0.18,
      ease: "power2.out",
      overwrite: true
    });
  }

  setTurnSignal(side = "off", duration = 0.95) {
    this.indicatorState.side = side;
    this.indicatorState.elapsed = 0;
    this.indicatorState.duration = duration;

    if (side === "off") {
      this.updateIndicatorVisuals(false, false);
    }
  }

  setViewMode(mode) {
    this.viewMode = mode === "cockpit" ? "cockpit" : "chase";
    this.cockpitRig.visible = this.viewMode === "cockpit";

    if (this.model) {
      this.model.visible = this.showBaseModel && this.viewMode !== "cockpit";
    }

    this.heroRig.visible = this.viewMode !== "cockpit";
    this.indicatorRig.visible = this.viewMode !== "cockpit";
    this.updateHeadlightBeamVisibility();
  }

  getHeadlightModeConfig(mode = this.headlightMode) {
    const configs = {
      wide: { angle: 0.4, distance: 34, intensity: 2.55, targetY: -0.42, targetSpread: 2.8, beamWidth: 1.95, beamLength: 7.8, pitch: 0.12, beamOpacity: 0.1 },
      narrow: { angle: 0.22, distance: 42, intensity: 2.9, targetY: -0.24, targetSpread: 1.1, beamWidth: 1.05, beamLength: 9.4, pitch: 0.08, beamOpacity: 0.11 },
      low: { angle: 0.3, distance: 24, intensity: 1.9, targetY: -0.82, targetSpread: 1.85, beamWidth: 1.3, beamLength: 5.8, pitch: 0.18, beamOpacity: 0.08 },
      high: { angle: 0.24, distance: 46, intensity: 3.15, targetY: -0.08, targetSpread: 1.45, beamWidth: 1.18, beamLength: 10.2, pitch: 0.02, beamOpacity: 0.12 }
    };

    return configs[mode] || configs.wide;
  }

  updateHeadlightBeamVisibility() {
    const showBeamVolumes = this.nightMode && this.viewMode !== "cockpit";
    const config = this.getHeadlightModeConfig(this.headlightMode);

    this.headlightBeams.forEach((beam) => {
      beam.mesh.visible = showBeamVolumes;
      beam.material.opacity = showBeamVolumes ? config.beamOpacity : 0;
    });
  }

  getHeadlightModeLabel() {
    const labels = {
      wide: "Wide",
      narrow: "Narrow",
      low: "Down",
      high: "Up"
    };

    return labels[this.headlightMode] || "Wide";
  }

  setNightMode(enabled) {
    this.nightMode = Boolean(enabled);
    this.applyHeadlightMode(true);
    this.applyVehicleLighting(this.options.forwardVisualSpeed, true);
    this.updateHeadlightBeamVisibility();
  }

  setHeadlightMode(mode, immediate = false) {
    const nextMode = ["wide", "narrow", "low", "high"].includes(mode) ? mode : "wide";
    this.headlightMode = nextMode;
    this.applyHeadlightMode(immediate);
  }

  cycleHeadlightMode() {
    const modes = ["wide", "narrow", "low", "high"];
    const currentIndex = modes.indexOf(this.headlightMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    this.setHeadlightMode(nextMode);
    return nextMode;
  }

  applyHeadlightMode(immediate = false) {
    const config = this.getHeadlightModeConfig(this.headlightMode);
    const isActive = this.nightMode;
    const showBeamVolumes = isActive && this.viewMode !== "cockpit";

    this.headlightLensMaterials.forEach((material) => {
      material.emissiveIntensity = isActive ? 0.42 + config.intensity * 0.08 : 0.08;
      material.opacity = isActive ? 0.96 : 0.82;
    });

    this.headlightSpotLights.forEach((light, index) => {
      const direction = index % 2 === 0 ? -1 : 1;
      const target = this.headlightTargets[index];
      const beam = this.headlightBeams[index];

      if (!target || !beam) {
        return;
      }

      const targetX = direction * config.targetSpread;
      const targetY = config.targetY;
      const beamScaleX = config.beamWidth;
      const beamScaleZ = config.beamLength;
      const beamRotationX = -Math.PI * 0.5 + config.pitch;
      const nextIntensity = isActive ? config.intensity : 0;
      const nextAngle = config.angle;
      const nextDistance = config.distance;
      const nextOpacity = showBeamVolumes ? config.beamOpacity : 0;

      const applyDirectly = () => {
        light.intensity = nextIntensity;
        light.angle = nextAngle;
        light.distance = nextDistance;
        target.position.set(targetX, targetY, -nextDistance);
        beam.pivot.rotation.x = beamRotationX;
        beam.mesh.scale.set(beamScaleX, beamScaleZ, beamScaleX);
        beam.mesh.visible = showBeamVolumes;
        beam.material.opacity = nextOpacity;
      };

      if (immediate || !this.gsap) {
        applyDirectly();
      } else {
        this.gsap.to(light, { intensity: nextIntensity, angle: nextAngle, distance: nextDistance, duration: 0.24, ease: "power2.out", overwrite: true });
        this.gsap.to(target.position, { x: targetX, y: targetY, z: -nextDistance, duration: 0.24, ease: "power2.out", overwrite: true });
        this.gsap.to(beam.pivot.rotation, { x: beamRotationX, duration: 0.24, ease: "power2.out", overwrite: true });
        this.gsap.to(beam.mesh.scale, { x: beamScaleX, y: beamScaleZ, z: beamScaleX, duration: 0.24, ease: "power2.out", overwrite: true });
        beam.mesh.visible = showBeamVolumes;
        this.gsap.to(beam.material, { opacity: nextOpacity, duration: 0.24, ease: "power2.out", overwrite: true });
      }
    });
  }

  applyVehicleLighting(forwardSpeed = this.options.forwardVisualSpeed, immediate = false) {
    const speedRatio = THREE.MathUtils.clamp(forwardSpeed / 58, 0, 1);
    const brakeIntensity = this.driveState.brakePress;
    const slowSpeedGlow = THREE.MathUtils.clamp((14 - forwardSpeed) / 4, 0, 1);
    const rearLightBoost = Math.max(brakeIntensity, slowSpeedGlow * 0.85);
    const headlightBase = this.nightMode ? 0.34 : 0.08;
    const rearBase = this.nightMode ? 0.28 : 0.04;
    const tireGlow = (this.nightMode ? 0.12 : 0.04) + speedRatio * 0.12;

    this.headlightLensMaterials.forEach((material) => {
      material.emissiveIntensity = headlightBase + (this.nightMode ? 0.08 : 0);
    });

    this.brakeLightMaterials.forEach((material) => {
      material.emissiveIntensity = rearBase + rearLightBoost * 2.4;
      material.color.setHex(rearLightBoost > 0.05 ? 0xd52f28 : 0x7a231f);
      material.emissive.setHex(rearLightBoost > 0.05 ? 0xff3b30 : 0x8a2b25);
    });

    this.brakeGlowMaterials.forEach((material) => {
      material.opacity = (this.nightMode ? 0.08 : 0.025) + rearLightBoost * 0.58;
    });

    this.tireAccentMaterials.forEach((material) => {
      material.emissiveIntensity = tireGlow;
      material.color.setHex(this.nightMode ? 0xf1d5ab : 0xe1c59a);
    });

    if (immediate) {
      return;
    }
  }

  getCameraPose(mode, positionTarget = new THREE.Vector3(), lookTarget = new THREE.Vector3()) {
    if (mode === "cockpit") {
      this.cockpitCameraMount.getWorldPosition(positionTarget);
      this.cockpitLookAnchor.getWorldPosition(lookTarget);
      return { position: positionTarget, lookAt: lookTarget };
    }

    this.chaseCameraMount.getWorldPosition(positionTarget);
    this.chaseLookAnchor.getWorldPosition(lookTarget);
    return { position: positionTarget, lookAt: lookTarget };
  }

  updateCar(delta, {
    left = this.inputState.left,
    right = this.inputState.right,
    axis = null,
    targetX = null,
    forwardSpeed = this.options.forwardVisualSpeed,
    accelerating = false,
    braking = false,
    stepWorld = this.ownsWorld || this.options.stepWorldInternally
  } = {}) {
    if (!this.physicsBody) {
      throw new Error("Call loadCarModel() and setupPhysics() before updateCar().");
    }

    this.setInput({ left, right, axis });
    this.driveState.accelerating = accelerating;
    this.driveState.braking = braking;

    let targetVelocityX = this.inputState.axis * this.options.maxLateralSpeed;

    if (targetX !== null) {
      const deltaX = targetX - this.physicsBody.position.x;
      targetVelocityX = THREE.MathUtils.clamp(
        deltaX * this.options.lateralResponse,
        -this.options.maxLateralSpeed,
        this.options.maxLateralSpeed
      );
    }

    const currentVelocityX = this.physicsBody.velocity.x;

    this.physicsBody.velocity.x = THREE.MathUtils.damp(
      currentVelocityX,
      targetVelocityX,
      this.options.lateralResponse,
      delta
    );

    this.physicsBody.velocity.y = 0;
    this.physicsBody.velocity.z = 0;
    this.physicsBody.position.y = this.bodyHalfHeight;

    const lateralLimit = this.options.roadHalfWidth - this.bodyHalfExtents.x - 0.08;
    this.physicsBody.position.x = THREE.MathUtils.clamp(this.physicsBody.position.x, -lateralLimit, lateralLimit);

    if (this.physicsBody.position.x === -lateralLimit || this.physicsBody.position.x === lateralLimit) {
      this.physicsBody.velocity.x = 0;
    }

    this.updateMotionState(delta, forwardSpeed);

    if (stepWorld) {
      this.world.step(1 / 60, delta, 3);
      this.syncAfterPhysics(delta, forwardSpeed);
    }
  }

  updateMotionState(delta, forwardSpeed) {
    const axis = THREE.MathUtils.clamp(
      this.physicsBody.velocity.x / Math.max(this.options.maxLateralSpeed, 0.001),
      -1,
      1
    );
    const steerTarget = axis * this.options.frontWheelSteer;
    const rollTarget = -axis * this.options.turnTilt;
    const pitchTarget = Math.min(forwardSpeed / 200, 0.05);

    if (this.gsap) {
      this.gsap.to(this.motionState, {
        steer: steerTarget,
        roll: rollTarget,
        pitch: pitchTarget,
        duration: 0.18,
        overwrite: true,
        ease: "power2.out"
      });
    } else {
      this.motionState.steer = THREE.MathUtils.damp(this.motionState.steer, steerTarget, 10, delta);
      this.motionState.roll = THREE.MathUtils.damp(this.motionState.roll, rollTarget, 10, delta);
      this.motionState.pitch = THREE.MathUtils.damp(this.motionState.pitch, pitchTarget, 10, delta);
    }

    this.visualState.bounceTime += delta * this.options.suspensionSpeed * (0.8 + forwardSpeed * 0.03);
    const speedFactor = THREE.MathUtils.clamp(forwardSpeed / 30, 0, 1);
    this.visualState.bounceOffset = Math.sin(this.visualState.bounceTime) * this.options.suspensionBounce * speedFactor;
  }

  pinPhysicsBody() {
    this.physicsBody.position.y = this.bodyHalfHeight;
    this.physicsBody.position.z = this.options.startPosition.z;
    this.physicsBody.velocity.y = 0;
    this.physicsBody.velocity.z = 0;
  }

  syncAfterPhysics(delta, forwardSpeed = this.options.forwardVisualSpeed) {
    this.pinPhysicsBody();
    this.syncVisuals(forwardSpeed);
    this.animateWheels(delta, forwardSpeed);
    this.updateIndicators(delta);
    this.updateCockpit(delta, forwardSpeed);
    this.applyVehicleLighting(forwardSpeed);
    this.updateCamera(delta);
  }

  // Keep the car mesh perfectly aligned with the Cannon body, then layer on premium-feel motion.
  syncVisuals(forwardSpeed = this.options.forwardVisualSpeed) {
    this.carGroup.position.set(
      this.physicsBody.position.x,
      this.physicsBody.position.y,
      this.physicsBody.position.z
    );
    this.carGroup.quaternion.set(
      this.physicsBody.quaternion.x,
      this.physicsBody.quaternion.y,
      this.physicsBody.quaternion.z,
      this.physicsBody.quaternion.w
    );

    this.visualRig.position.y = -this.bodyHalfHeight + this.visualState.bounceOffset;
    this.visualRig.rotation.x = this.motionState.pitch;
    this.visualRig.rotation.z = this.motionState.roll;

    const leanFromVelocity = THREE.MathUtils.clamp(
      this.physicsBody.velocity.x / this.options.maxLateralSpeed,
      -1,
      1
    );
    this.visualRig.rotation.z += -leanFromVelocity * 0.02;

    if (!this.model) {
      return;
    }

    this.model.position.copy(this.modelBasePosition);
    this.model.position.y += Math.sin(this.visualState.bounceTime * 0.5) * 0.014 * Math.min(forwardSpeed / 24, 1);
  }

  animateWheels(delta, forwardSpeed) {
    if (!this.wheels.length) {
      return;
    }

    this.wheelSpin -= forwardSpeed * delta * 1.45;

    for (const wheel of this.wheels) {
      const baseRotation = this.wheelBaseRotations.get(wheel.uuid);

      if (!baseRotation) {
        continue;
      }

      wheel.rotation.x = baseRotation.x + this.wheelSpin;
      wheel.rotation.z = baseRotation.z;

      if (this.frontWheels.includes(wheel)) {
        wheel.rotation.y = baseRotation.y + this.motionState.steer;
      } else {
        wheel.rotation.y = baseRotation.y;
      }
    }
  }

  updateIndicators(delta) {
    const state = this.indicatorState;

    if (state.side === "off") {
      this.updateIndicatorVisuals(false, false);
      return;
    }

    state.elapsed += delta;
    const blinkOn = Math.floor(state.elapsed / 0.18) % 2 === 0;
    this.updateIndicatorVisuals(state.side === "left" && blinkOn, state.side === "right" && blinkOn);

    if (state.elapsed >= state.duration) {
      this.setTurnSignal("off", 0);
    }
  }

  updateIndicatorVisuals(leftOn, rightOn) {
    this.indicatorMaterials.left.forEach((material) => {
      material.color.setHex(leftOn ? 0xffc96f : 0x8a5b12);
      material.opacity = leftOn ? 1 : 0.34;
    });

    this.indicatorMaterials.right.forEach((material) => {
      material.color.setHex(rightOn ? 0xffc96f : 0x8a5b12);
      material.opacity = rightOn ? 1 : 0.34;
    });
  }

  updateArmSegment(mesh, start, end) {
    if (!mesh) {
      return;
    }

    this.tempDirection.copy(end).sub(start);
    const length = Math.max(this.tempDirection.length(), 0.001);
    this.tempLocalMid.copy(start).add(end).multiplyScalar(0.5);
    mesh.position.copy(this.tempLocalMid);
    mesh.scale.set(1, length, 1);
    this.tempQuaternion.setFromUnitVectors(ARM_UP_AXIS, this.tempDirection.normalize());
    mesh.quaternion.copy(this.tempQuaternion);
  }

  updateDriverArms() {
    if (
      !this.cockpitForegroundRig ||
      !this.leftShoulderAnchor ||
      !this.rightShoulderAnchor ||
      !this.leftHandPivot ||
      !this.rightHandPivot
    ) {
      return;
    }

    this.leftShoulderAnchor.getWorldPosition(this.tempLocalStart);
    this.cockpitForegroundRig.worldToLocal(this.tempLocalStart);
    this.leftHandPivot.getWorldPosition(this.tempLocalEnd);
    this.cockpitForegroundRig.worldToLocal(this.tempLocalEnd);
    this.tempLocalElbow.copy(this.tempLocalStart).lerp(this.tempLocalEnd, 0.5);
    this.tempLocalElbow.x -= 0.08;
    this.tempLocalElbow.y -= 0.1;
    this.tempLocalElbow.z += 0.14;
    this.updateArmSegment(this.leftUpperArmMesh, this.tempLocalStart, this.tempLocalElbow);
    this.updateArmSegment(this.leftForearmMesh, this.tempLocalElbow, this.tempLocalEnd);

    this.rightShoulderAnchor.getWorldPosition(this.tempWorldPosition);
    this.cockpitForegroundRig.worldToLocal(this.tempWorldPosition);
    this.rightHandPivot.getWorldPosition(this.tempWorldPositionB);
    this.cockpitForegroundRig.worldToLocal(this.tempWorldPositionB);
    this.tempLocalElbow.copy(this.tempWorldPosition).lerp(this.tempWorldPositionB, 0.5);
    this.tempLocalElbow.x += 0.08;
    this.tempLocalElbow.y -= 0.1;
    this.tempLocalElbow.z += 0.14;
    this.updateArmSegment(this.rightUpperArmMesh, this.tempWorldPosition, this.tempLocalElbow);
    this.updateArmSegment(this.rightForearmMesh, this.tempLocalElbow, this.tempWorldPositionB);
  }

  updateCockpit(delta, forwardSpeed) {
    this.driveState.acceleratorPress = THREE.MathUtils.damp(
      this.driveState.acceleratorPress,
      this.driveState.accelerating ? 1 : 0,
      10,
      delta
    );
    this.driveState.brakePress = THREE.MathUtils.damp(
      this.driveState.brakePress,
      this.driveState.braking ? 1 : 0,
      10,
      delta
    );

    if (this.steeringWheelPivot) {
      this.steeringWheelPivot.rotation.z = -this.motionState.steer * 3.55;
    }

    if (this.leftHandPivot) {
      this.leftHandPivot.rotation.set(0.16 - Math.abs(this.motionState.steer) * 0.14, 0, this.motionState.steer * 0.3);
    }

    if (this.rightHandPivot) {
      this.rightHandPivot.rotation.set(0.16 - Math.abs(this.motionState.steer) * 0.14, 0, this.motionState.steer * 0.3);
    }

    this.updateDriverArms();

    if (this.acceleratorPedalPivot) {
      this.acceleratorPedalPivot.rotation.x = -0.18 - this.driveState.acceleratorPress * 0.42;
    }

    if (this.brakePedalPivot) {
      this.brakePedalPivot.rotation.x = -0.22 - this.driveState.brakePress * 0.34;
    }

    if (this.dashboardNeedle) {
      const gearSpeedCaps = { 1: 18.2, 2: 28.6, 3: 40.8, 4: 50.8, 5: 58.14 };
      const speedRatio = THREE.MathUtils.clamp(forwardSpeed / gearSpeedCaps[this.currentGear], 0, 1);
      this.dashboardNeedle.rotation.y = THREE.MathUtils.lerp(1.1, -1.1, speedRatio);
    }
  }

  updateCamera(delta) {
    if (!this.camera) {
      return;
    }

    this.getCameraPose(this.viewMode, this.cameraTargets.position, this.cameraTargets.lookAt);
    this.camera.position.lerp(this.cameraTargets.position, 1 - Math.pow(0.00012, delta));
    this.cameraTargets.smoothLookAt.lerp(this.cameraTargets.lookAt, 1 - Math.pow(0.0002, delta));
    this.camera.lookAt(this.cameraTargets.smoothLookAt);
  }

  getPosition(target = new THREE.Vector3()) {
    return target.copy(this.carGroup.position);
  }

  dispose() {
    if (this.physicsBody) {
      this.world.removeBody(this.physicsBody);
      this.physicsBody = null;
    }

    if (this.model) {
      this.modelPivot.remove(this.model);
      this.model = null;
    }

    this.scene.remove(this.carGroup);

    if (this.logoTexture) {
      this.logoTexture.dispose();
      this.logoTexture = null;
    }
  }
}

export async function loadCarModel(config) {
  const system = new PlayerCarSystem(config);
  await system.loadCarModel();
  return system;
}
