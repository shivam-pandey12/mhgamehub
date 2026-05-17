import {
  AmbientLight,
  Box3,
  BoxGeometry,
  CircleGeometry,
  DirectionalLight,
  GridHelper,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
} from "three";

const NAV_BOUNDS = {
  maxX: 80,
  maxZ: 80,
  minX: -80,
  minZ: -80,
};

const SPAWN_CLEAR_ZONE = {
  radius: 18,
  x: 0,
  z: 28,
};

const OBSTACLE_COLORS = [0x7a6847, 0x6c5a42, 0x91754d, 0x70805f, 0x657259];
const BERM_COLORS = [0x5f7759, 0x66795b, 0x6d7f61];
const WALL_COLOR = 0x5f6f5a;
const CENTRAL_LAYOUTS = [
  [
    { depth: 4, height: 2.8, width: 18, x: -20, z: 4 },
    { depth: 4, height: 2.8, width: 18, x: 20, z: 4 },
    { depth: 4, height: 3.2, width: 24, x: 0, z: -18 },
  ],
  [
    { depth: 4, height: 3.2, width: 28, x: -18, z: -10 },
    { depth: 4, height: 2.6, width: 16, x: 22, z: 18 },
    { depth: 4, height: 2.4, width: 14, x: 4, z: 36 },
  ],
  [
    { depth: 4, height: 2.9, width: 24, x: 0, z: 12 },
    { depth: 4, height: 2.6, width: 16, x: -28, z: -24 },
    { depth: 4, height: 2.6, width: 16, x: 28, z: -30 },
  ],
  [
    { depth: 4, height: 2.7, width: 18, x: -26, z: 18 },
    { depth: 4, height: 2.7, width: 18, x: 26, z: 18 },
    { depth: 4, height: 2.4, width: 14, x: -8, z: -20 },
    { depth: 4, height: 2.4, width: 14, x: 8, z: -20 },
  ],
  [
    { depth: 4, height: 2.8, width: 20, x: -32, z: -4 },
    { depth: 4, height: 2.8, width: 20, x: 32, z: -4 },
    { depth: 12, height: 2.6, width: 4, x: -8, z: 24 },
    { depth: 12, height: 2.6, width: 4, x: 8, z: 24 },
  ],
];

export function buildWorld(scene) {
  addLights(scene);
  addGround(scene);

  const collisionBoxes = [];
  const shootableObjects = [];
  const occupied = [];

  addBoundaryWalls(scene, collisionBoxes, occupied, shootableObjects);
  addCentralLayout(scene, collisionBoxes, occupied, shootableObjects);
  addRandomCover(scene, collisionBoxes, occupied, shootableObjects);
  addRaisedBerms(scene, collisionBoxes, occupied, shootableObjects);

  return {
    collisionBoxes,
    navBounds: { ...NAV_BOUNDS },
    shootableObjects,
  };
}

function addLights(scene) {
  const ambientLight = new AmbientLight(0xf4f1db, 1.7);
  scene.add(ambientLight);

  const sunlight = new DirectionalLight(0xfff1c9, 2.5);
  sunlight.position.set(22, 30, 14);
  sunlight.castShadow = true;
  sunlight.shadow.mapSize.set(1024, 1024);
  sunlight.shadow.camera.near = 1;
  sunlight.shadow.camera.far = 90;
  sunlight.shadow.camera.left = -55;
  sunlight.shadow.camera.right = 55;
  sunlight.shadow.camera.top = 55;
  sunlight.shadow.camera.bottom = -55;
  scene.add(sunlight);

  const fillLight = new HemisphereLight(0xd9effb, 0x42503f, 0.7);
  scene.add(fillLight);
}

function addGround(scene) {
  const ground = new Mesh(
    new PlaneGeometry(180, 180),
    new MeshStandardMaterial({
      color: 0x5f7759,
      roughness: 1,
      metalness: 0,
    }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const grid = new GridHelper(180, 36, 0xd9dfc7, 0x6a745c);
  grid.position.y = 0.02;
  grid.material.transparent = true;
  grid.material.opacity = 0.16;
  scene.add(grid);

  const commandPad = new Mesh(
    new CircleGeometry(7, 24),
    new MeshStandardMaterial({
      color: 0x77886c,
      roughness: 1,
      metalness: 0,
    }),
  );
  commandPad.rotation.x = -Math.PI / 2;
  commandPad.position.set(SPAWN_CLEAR_ZONE.x, 0.03, SPAWN_CLEAR_ZONE.z);
  commandPad.receiveShadow = true;
  scene.add(commandPad);
}

function addBoundaryWalls(scene, collisionBoxes, occupied, shootableObjects) {
  const boundaries = [
    { depth: 4, height: 3, width: 184, x: 0, z: -92 },
    { depth: 4, height: 3, width: 184, x: 0, z: 92 },
    { depth: 184, height: 3, width: 4, x: -92, z: 0 },
    { depth: 184, height: 3, width: 4, x: 92, z: 0 },
  ];

  for (const boundary of boundaries) {
    addObstacle(scene, collisionBoxes, occupied, shootableObjects, {
      color: WALL_COLOR,
      ...boundary,
    });
  }
}

function addCentralLayout(scene, collisionBoxes, occupied, shootableObjects) {
  const layout = pickRandom(CENTRAL_LAYOUTS);

  for (const obstacle of layout) {
    addObstacle(scene, collisionBoxes, occupied, shootableObjects, {
      color: pickRandom(OBSTACLE_COLORS),
      ...obstacle,
    });
  }
}

function addRandomCover(scene, collisionBoxes, occupied, shootableObjects) {
  const wallCount = MathUtils.randInt(7, 11);
  const crateCount = MathUtils.randInt(15, 22);

  for (let index = 0; index < wallCount; index += 1) {
    placeRandomObstacle(scene, collisionBoxes, occupied, shootableObjects, {
      color: pickRandom(OBSTACLE_COLORS),
      depth: Math.random() > 0.5 ? 3.4 : MathUtils.randFloat(8, 14),
      height: MathUtils.randFloat(2.3, 3.4),
      width: Math.random() > 0.5 ? MathUtils.randFloat(10, 18) : 3.4,
    });
  }

  for (let index = 0; index < crateCount; index += 1) {
    placeRandomObstacle(scene, collisionBoxes, occupied, shootableObjects, {
      color: pickRandom(OBSTACLE_COLORS),
      depth: MathUtils.randFloat(3.2, 5.2),
      height: MathUtils.randFloat(1.6, 2.4),
      width: MathUtils.randFloat(3.2, 5.2),
    });
  }
}

function addRaisedBerms(scene, collisionBoxes, occupied, shootableObjects) {
  const bermCount = MathUtils.randInt(6, 9);

  for (let index = 0; index < bermCount; index += 1) {
    placeRandomObstacle(scene, collisionBoxes, occupied, shootableObjects, {
      color: pickRandom(BERM_COLORS),
      depth: MathUtils.randFloat(8, 14),
      height: MathUtils.randFloat(0.9, 1.45),
      width: MathUtils.randFloat(10, 18),
    });
  }
}

function placeRandomObstacle(scene, collisionBoxes, occupied, shootableObjects, template) {
  for (let attempt = 0; attempt < 90; attempt += 1) {
    const width = template.width;
    const depth = template.depth;
    const x = MathUtils.randFloat(
      NAV_BOUNDS.minX + width * 0.5 + 4,
      NAV_BOUNDS.maxX - width * 0.5 - 4,
    );
    const z = MathUtils.randFloat(
      NAV_BOUNDS.minZ + depth * 0.5 + 4,
      NAV_BOUNDS.maxZ - depth * 0.5 - 4,
    );

    if (!canPlaceRect(x, z, width, depth, occupied)) {
      continue;
    }

    addObstacle(scene, collisionBoxes, occupied, shootableObjects, {
      ...template,
      x,
      z,
    });
    return;
  }
}

function addObstacle(
  scene,
  collisionBoxes,
  occupied,
  shootableObjects,
  { color, depth, height, width, x, z },
) {
  const mesh = createObstacle({
    color,
    position: [x, height * 0.5, z],
    size: [width, height, depth],
  });

  scene.add(mesh);
  mesh.updateWorldMatrix(true, false);
  collisionBoxes.push(new Box3().setFromObject(mesh));
  shootableObjects.push(mesh);
  occupied.push({
    depth,
    width,
    x,
    z,
  });
}

function canPlaceRect(x, z, width, depth, occupied) {
  if (intersectsSpawnClearZone(x, z, width, depth)) {
    return false;
  }

  for (const rect of occupied) {
    if (
      Math.abs(x - rect.x) < (width + rect.width) * 0.5 + 3 &&
      Math.abs(z - rect.z) < (depth + rect.depth) * 0.5 + 3
    ) {
      return false;
    }
  }

  return true;
}

function intersectsSpawnClearZone(x, z, width, depth) {
  const nearestX = clamp(
    SPAWN_CLEAR_ZONE.x,
    x - width * 0.5,
    x + width * 0.5,
  );
  const nearestZ = clamp(
    SPAWN_CLEAR_ZONE.z,
    z - depth * 0.5,
    z + depth * 0.5,
  );
  const dx = SPAWN_CLEAR_ZONE.x - nearestX;
  const dz = SPAWN_CLEAR_ZONE.z - nearestZ;
  return dx * dx + dz * dz < SPAWN_CLEAR_ZONE.radius * SPAWN_CLEAR_ZONE.radius;
}

function createObstacle({ position, size, color }) {
  const [width, height, depth] = size;
  const mesh = new Mesh(
    new BoxGeometry(width, height, depth),
    new MeshStandardMaterial({
      color,
      roughness: 0.92,
      metalness: 0.04,
    }),
  );

  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}
