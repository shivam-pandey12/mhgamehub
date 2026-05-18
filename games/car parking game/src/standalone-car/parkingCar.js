import * as THREE from "three";
import * as CANNON from "cannon-es";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { createCarModelUrl } from "./carGltf.js";

const WHEEL_POSITIONS = [
  [-0.94, 0.28, 1.44],
  [0.94, 0.28, 1.44],
  [-0.94, 0.28, -1.34],
  [0.94, 0.28, -1.34],
];

function setShadowState(object3d, castShadow, receiveShadow) {
  object3d.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = castShadow;
      child.receiveShadow = receiveShadow;
    }
  });
}

export async function createParkingCarMesh(options = {}) {
  const {
    parent = null,
    position = [0, 0, 0],
    rotationY = 0,
    scale = 0.95,
    bodyColor = null,
    castShadow = true,
    receiveShadow = true,
    envMapIntensity = 0.45,
  } = options;

  const group = new THREE.Group();
  const chassisGroup = new THREE.Group();
  chassisGroup.position.y = -0.44;
  group.add(chassisGroup);

  const modelGroup = new THREE.Group();
  const loader = new GLTFLoader();
  const modelUrl = createCarModelUrl();
  const gltf = await loader.loadAsync(modelUrl);
  URL.revokeObjectURL(modelUrl);

  gltf.scene.scale.setScalar(scale);
  gltf.scene.position.y = 0.1;
  gltf.scene.traverse((child) => {
    if (!child.isMesh) {
      return;
    }

    child.castShadow = castShadow;
    child.receiveShadow = receiveShadow;
    if (child.material) {
      child.material = child.material.clone();
      child.material.envMapIntensity = envMapIntensity;
      if (bodyColor && child.material.color) {
        child.material.color.set(bodyColor);
      }
    }
  });
  modelGroup.add(gltf.scene);
  chassisGroup.add(modelGroup);

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: "#7ccfe0",
    roughness: 0.55,
    metalness: 0.04,
    transparent: true,
    opacity: 0.42,
    transmission: 0.08,
    clearcoat: 0.18,
  });
  const wheelMaterial = new THREE.MeshStandardMaterial({
    color: "#15181d",
    roughness: 0.88,
    metalness: 0.15,
  });
  const tailLightMaterial = new THREE.MeshStandardMaterial({
    color: "#ff6b62",
    emissive: new THREE.Color("#ff4b3b"),
    emissiveIntensity: 0.42,
    roughness: 0.65,
  });

  const windshield = new THREE.Mesh(
    new THREE.BoxGeometry(1.16, 0.34, 1.28),
    glassMaterial
  );
  windshield.position.set(0, 0.84, -0.1);
  chassisGroup.add(windshield);

  const rearGlass = new THREE.Mesh(
    new THREE.BoxGeometry(1.16, 0.24, 0.72),
    glassMaterial.clone()
  );
  rearGlass.position.set(0, 0.78, -1.05);
  chassisGroup.add(rearGlass);

  const wheelGeometry = new THREE.CylinderGeometry(0.38, 0.38, 0.28, 18);
  wheelGeometry.rotateZ(Math.PI / 2);

  const wheels = WHEEL_POSITIONS.map(([x, y, z], index) => {
    const pivot = new THREE.Group();
    pivot.position.set(x, y, z);

    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    pivot.add(wheel);
    chassisGroup.add(pivot);

    return {
      pivot,
      wheel,
      steerable: index < 2,
    };
  });

  const tailLightGeometry = new THREE.BoxGeometry(0.18, 0.08, 0.12);
  [-0.52, 0.52].forEach((x) => {
    const tailLight = new THREE.Mesh(tailLightGeometry, tailLightMaterial);
    tailLight.position.set(x, 0.48, -2.04);
    chassisGroup.add(tailLight);
  });

  group.position.fromArray(position);
  group.rotation.y = rotationY;
  setShadowState(group, castShadow, receiveShadow);

  if (parent) {
    parent.add(group);
  }

  return {
    group,
    chassisGroup,
    modelGroup,
    wheels,
    rearWheelPivots: [wheels[2].pivot, wheels[3].pivot],
  };
}

export function createParkingCarBody(options = {}) {
  const {
    world = null,
    position = [0, 0.82, 0],
    yaw = 0,
    mass = 1350,
    linearDamping = 0.18,
    angularDamping = 0.78,
  } = options;

  const body = new CANNON.Body({
    mass,
    shape: new CANNON.Box(new CANNON.Vec3(1.05, 0.55, 2.2)),
    position: new CANNON.Vec3(position[0], position[1], position[2]),
    angularDamping,
    linearDamping,
  });
  body.angularFactor.set(0, 1, 0);
  body.quaternion.setFromEuler(0, yaw, 0);
  body.userData = { tag: "player" };

  if (world) {
    world.addBody(body);
  }

  return body;
}

export function syncParkingCarMeshFromBody(carMesh, body) {
  if (!carMesh?.group || !body) {
    return;
  }

  carMesh.group.position.set(body.position.x, body.position.y, body.position.z);
  carMesh.group.quaternion.set(
    body.quaternion.x,
    body.quaternion.y,
    body.quaternion.z,
    body.quaternion.w
  );
}
