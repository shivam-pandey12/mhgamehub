import * as THREE from 'three';
import { COLORS, DISTRICTS } from '../config.js';
import { rand } from '../utils/math.js';

export class CityBuilder {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'HeatlineCity';
    this.roadRects = [];
    this.collisionBoxes = [];
    this.waypoints = [];
    this.spawnPoints = {};
    this.roadblockSites = [];
    this.parkingSites = [];
    this.lampLightCount = 0;

    this.materials = {
      ground: new THREE.MeshStandardMaterial({ color: 0x6a8f62, roughness: 0.96 }),
      road: new THREE.MeshStandardMaterial({ color: COLORS.roadWet, roughness: 0.58, metalness: 0.06 }),
      roadEdge: new THREE.MeshStandardMaterial({ color: 0x61625c, roughness: 0.82 }),
      lane: new THREE.MeshBasicMaterial({ color: 0xf6f3e8, transparent: true, opacity: 0.92 }),
      yellowLane: new THREE.MeshBasicMaterial({ color: 0xf2c856, transparent: true, opacity: 0.9 }),
      pavement: new THREE.MeshStandardMaterial({ color: COLORS.pavement, roughness: 0.82 }),
      grass: new THREE.MeshStandardMaterial({ color: COLORS.grass, roughness: 0.95 }),
      concrete: new THREE.MeshStandardMaterial({ color: 0xc0bab0, roughness: 0.84 }),
      building: new THREE.MeshStandardMaterial({ color: 0x8796a0, roughness: 0.62, metalness: 0.08 }),
      buildingDark: new THREE.MeshStandardMaterial({ color: 0x6f7880, roughness: 0.7, metalness: 0.08 }),
      window: new THREE.MeshStandardMaterial({ color: 0xb9e4ff, roughness: 0.18, metalness: 0.18 }),
      blueWindow: new THREE.MeshStandardMaterial({ color: 0x85c8ef, roughness: 0.16, metalness: 0.22 }),
      lamp: new THREE.MeshStandardMaterial({ color: 0xf3ead8, roughness: 0.42 }),
      barrier: new THREE.MeshStandardMaterial({ color: 0xce3f35, roughness: 0.55 }),
      sign: new THREE.MeshStandardMaterial({ color: 0x2e6bb8, roughness: 0.42 }),
      cone: new THREE.MeshStandardMaterial({ color: 0xff6d2f, roughness: 0.55 }),
    };
  }

  build() {
    this.scene.add(this.group);
    this.addGround();
    this.addRoadNetwork();
    this.addParksAndLandmarks();
    this.addBuildings();
    this.addStreetDressing();
    this.addWaypoints();
    this.addSpawnPoints();

    return {
      group: this.group,
      waypoints: this.waypoints,
      collisionBoxes: this.collisionBoxes,
      spawnPoints: this.spawnPoints,
      roadRects: this.roadRects,
      roadblockSites: this.roadblockSites,
      parkingSites: this.parkingSites,
      districts: DISTRICTS,
      isOnRoad: (position, extra = 0) => this.isOnRoad(position, extra),
      nearestWaypoint: (position) => this.nearestWaypoint(position),
    };
  }

  addGround() {
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(430, 330), this.materials.ground);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.group.add(ground);
  }

  addRoadNetwork() {
    const roads = [
      [-178, -106, 178, -106, 24],
      [-168, 0, 168, 0, 22],
      [-160, 60, 160, 60, 20],
      [-148, -66, 148, -66, 18],
      [-148, 34, 148, 34, 15],
      [-148, -106, -148, 88, 18],
      [-82, -122, -82, 88, 18],
      [0, -128, 0, 104, 22],
      [82, -122, 82, 88, 18],
      [148, -106, 148, 92, 18],
      [-116, 94, 116, 94, 16],
      [116, -106, 116, -8, 14],
      [-116, -106, -116, -8, 14],
    ];

    for (const road of roads) this.addRoadSegment(...road);
    this.addCurvedRoad(-148, -106, 42, Math.PI * 1.5, Math.PI * 2, 18);
    this.addCurvedRoad(148, -106, 42, Math.PI, Math.PI * 1.5, 18);
    this.addCurvedRoad(148, 60, 42, Math.PI * 0.5, Math.PI, 18);
    this.addCurvedRoad(-148, 60, 42, 0, Math.PI * 0.5, 18);

    this.addBridge(-64, -106, 64, -106);
    this.addCrosswalks();
    this.addRoadArrows();
  }

  addRoadSegment(x1, z1, x2, z2, width) {
    const dx = x2 - x1;
    const dz = z2 - z1;
    const length = Math.sqrt(dx * dx + dz * dz);
    const angle = Math.atan2(dz, dx);
    const centerX = (x1 + x2) / 2;
    const centerZ = (z1 + z2) / 2;

    const shoulder = new THREE.Mesh(new THREE.PlaneGeometry(length + 5, width + 7), this.materials.roadEdge);
    shoulder.rotation.x = -Math.PI / 2;
    shoulder.rotation.z = angle;
    shoulder.position.set(centerX, 0.011, centerZ);
    shoulder.receiveShadow = true;
    this.group.add(shoulder);

    const road = new THREE.Mesh(new THREE.PlaneGeometry(length, width), this.materials.road);
    road.rotation.x = -Math.PI / 2;
    road.rotation.z = angle;
    road.position.set(centerX, 0.025, centerZ);
    road.receiveShadow = true;
    this.group.add(road);

    this.roadRects.push({ centerX, centerZ, length, width, angle });
    this.addLaneMarkings(centerX, centerZ, length, width, angle);
  }

  addLaneMarkings(centerX, centerZ, length, width, angle) {
    const forward = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
    const right = new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle));
    const dashGeometry = new THREE.PlaneGeometry(5.6, 0.25);
    const edgeGeometry = new THREE.PlaneGeometry(3.2, 0.18);
    for (let offset = -length / 2 + 8; offset < length / 2 - 4; offset += 14) {
      const center = new THREE.Vector3(centerX, 0.04, centerZ).add(forward.clone().multiplyScalar(offset));
      const dash = new THREE.Mesh(dashGeometry, this.materials.yellowLane);
      dash.position.copy(center);
      dash.rotation.x = -Math.PI / 2;
      dash.rotation.z = angle;
      this.group.add(dash);

      for (const side of [-1, 1]) {
        const edge = new THREE.Mesh(edgeGeometry, this.materials.lane);
        edge.position.copy(center).add(right.clone().multiplyScalar(side * (width * 0.38)));
        edge.rotation.x = -Math.PI / 2;
        edge.rotation.z = angle;
        this.group.add(edge);
      }
    }
  }

  addCurvedRoad(cx, cz, radius, start, end, width) {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, radius + width / 2, start, end, false);
    shape.absarc(0, 0, radius - width / 2, end, start, true);
    const geometry = new THREE.ShapeGeometry(shape, 32);
    const road = new THREE.Mesh(geometry, this.materials.road);
    road.rotation.x = -Math.PI / 2;
    road.position.set(cx, 0.03, cz);
    road.receiveShadow = true;
    this.group.add(road);
  }

  addBridge(x1, z1, x2, z2) {
    const length = Math.abs(x2 - x1);
    const deck = new THREE.Mesh(new THREE.BoxGeometry(length + 24, 0.24, 30), this.materials.concrete);
    deck.position.set(0, 0.13, z1);
    deck.receiveShadow = true;
    deck.castShadow = true;
    this.group.add(deck);

    const railGeometry = new THREE.BoxGeometry(length + 26, 1.8, 0.7);
    for (const side of [-1, 1]) {
      const rail = new THREE.Mesh(railGeometry, this.materials.concrete);
      rail.position.set(0, 1.5, z1 + side * 15.2);
      rail.castShadow = true;
      this.group.add(rail);
    }

    for (let x = -66; x <= 66; x += 44) {
      for (const z of [z1 - 13, z1 + 13]) {
        const column = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.5, 7, 10), this.materials.concrete);
        column.position.set(x, -2.1, z);
        column.castShadow = true;
        this.group.add(column);
      }
    }

    this.addBillboard('HIGHWAY BRIDGE', 0, z1 - 22, 15, 4.5, 0xffba70);
  }

  addCrosswalks() {
    const points = [
      [0, 0],
      [-82, 0],
      [82, 0],
      [0, 60],
      [0, -66],
      [-148, 0],
      [148, 0],
    ];
    for (const [x, z] of points) {
      for (let i = -4; i <= 4; i += 1) {
        const stripe = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 9.5), this.materials.lane);
        stripe.position.set(x + i * 1.7, 0.055, z - 8.2);
        stripe.rotation.x = -Math.PI / 2;
        this.group.add(stripe);
      }
    }
  }

  addRoadArrows() {
    const texture = this.makeTextTexture('UP', '#f6f3e8', 128, 128, 'bold 54px Arial', 0x30343a);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.55 });
    const geometry = new THREE.PlaneGeometry(6, 6);
    const arrows = [
      [42, -106, Math.PI / 2],
      [-42, -106, -Math.PI / 2],
      [126, 0, Math.PI / 2],
      [-126, 0, -Math.PI / 2],
      [0, 78, 0],
      [0, -48, Math.PI],
    ];
    for (const [x, z, rot] of arrows) {
      const arrow = new THREE.Mesh(geometry, material);
      arrow.position.set(x, 0.058, z);
      arrow.rotation.x = -Math.PI / 2;
      arrow.rotation.z = rot;
      this.group.add(arrow);
    }
  }

  addParksAndLandmarks() {
    const park = new THREE.Mesh(new THREE.PlaneGeometry(72, 58), this.materials.grass);
    park.rotation.x = -Math.PI / 2;
    park.position.set(-112, 0.035, 88);
    park.receiveShadow = true;
    this.group.add(park);

    const fountainBase = new THREE.Mesh(new THREE.CylinderGeometry(8, 8.5, 0.8, 32), this.materials.concrete);
    fountainBase.position.set(-112, 0.45, 88);
    fountainBase.castShadow = true;
    this.group.add(fountainBase);
    const water = new THREE.Mesh(
      new THREE.CylinderGeometry(6.4, 6.4, 0.18, 32),
      new THREE.MeshStandardMaterial({ color: 0x48b8d4, roughness: 0.18, metalness: 0.08 }),
    );
    water.position.set(-112, 0.93, 88);
    this.group.add(water);

    const tower = this.addBuilding(34, 34, 72, 38, 92, 0x8bb2c9, true);
    tower.name = 'CentralTower';
    this.addBillboard('CENTRAL TOWER', 38, 116, 19, 5, 0x9ed8ff);

    const checkpoint = new THREE.Group();
    checkpoint.position.set(126, 0, -64);
    this.group.add(checkpoint);
    this.addBillboard('POLICE CHECKPOINT', 126, -82, 18, 4.6, 0x6ea7ff);
    for (let i = -2; i <= 2; i += 1) {
      const barrier = new THREE.Mesh(new THREE.BoxGeometry(7, 1.1, 1), this.materials.barrier);
      barrier.position.set(126 + i * 8, 0.7, -56 + Math.abs(i) * 2);
      barrier.rotation.y = i * 0.18;
      barrier.castShadow = true;
      this.group.add(barrier);
    }

    this.addBillboard('IRONWORKS', 128, 88, 16, 5, 0xff8a4b);
    for (let x = 104; x <= 152; x += 18) {
      const warehouse = this.addBuilding(16, 24, rand(8, 14), x, 112 + rand(-6, 6), 0x8d8a81, false);
      warehouse.scale.y = rand(0.8, 1.2);
    }
  }

  addBuildings() {
    for (let x = -178; x <= 178; x += 22) {
      for (let z = -124; z <= 128; z += 22) {
        if (this.isReservedForRoadOrPark(x, z)) continue;
        if (Math.random() < 0.2) continue;
        const downtown = Math.abs(x) < 74 && Math.abs(z - 18) < 88;
        const width = rand(10, downtown ? 18 : 15);
        const depth = rand(10, downtown ? 18 : 15);
        const height = downtown ? rand(24, 70) : rand(8, 32);
        const palette = downtown
          ? [0x7e97aa, 0x93a4ad, 0xa6a097, 0x75848f]
          : [0xb2a89b, 0x9aa6a7, 0xc0b59e, 0x8f9b8e];
        this.addBuilding(width, depth, height, x + rand(-3, 3), z + rand(-3, 3), palette[Math.floor(rand(0, palette.length))]);
      }
    }

    const shopSigns = [
      ['CITY MART', -50, -88],
      ['AUTO REPAIR', -104, 18],
      ['CITY BANK', 62, 22],
      ['PARK CAFE', -72, 112],
      ['FUEL', 150, 24],
    ];
    for (const [text, x, z] of shopSigns) this.addBillboard(text, x, z, 13, 4.2, 0xffba70);
  }

  addBuilding(width, depth, height, x, z, color = 0x1e2730, landmark = false) {
    const material = this.materials.building.clone();
    material.color.setHex(color);
    const base = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    base.position.set(x, height / 2, z);
    base.castShadow = true;
    base.receiveShadow = true;
    this.group.add(base);

    const cap = new THREE.Mesh(
      new THREE.BoxGeometry(width + 1.2, 1.1, depth + 1.2),
      landmark ? this.materials.concrete : this.materials.buildingDark,
    );
    cap.position.set(x, height + 0.6, z);
    cap.castShadow = true;
    this.group.add(cap);

    this.addWindowStrips(x, z, width, depth, height, landmark);
    this.addRooftopDetails(x, z, width, depth, height, landmark);
    this.collisionBoxes.push({
      minX: x - width / 2 - 1.2,
      maxX: x + width / 2 + 1.2,
      minZ: z - depth / 2 - 1.2,
      maxZ: z + depth / 2 + 1.2,
    });
    return base;
  }

  addWindowStrips(x, z, width, depth, height, landmark) {
    const material = landmark ? this.materials.blueWindow : this.materials.window;
    const rows = Math.max(1, Math.floor(height / 8));
    const stripHeight = 0.55;
    for (let row = 1; row <= rows; row += 1) {
      const y = row * (height / (rows + 1));
      for (const side of [-1, 1]) {
        const front = new THREE.Mesh(new THREE.PlaneGeometry(width * 0.72, stripHeight), material);
        front.position.set(x, y, z + side * (depth / 2 + 0.02));
        front.rotation.y = side > 0 ? 0 : Math.PI;
        this.group.add(front);
      }
      if (width > 12) {
        for (const side of [-1, 1]) {
          const sideWindow = new THREE.Mesh(new THREE.PlaneGeometry(depth * 0.6, stripHeight), material);
          sideWindow.position.set(x + side * (width / 2 + 0.02), y, z);
          sideWindow.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2;
          this.group.add(sideWindow);
        }
      }
    }
  }

  addRooftopDetails(x, z, width, depth, height, landmark) {
    if (height < 14) return;
    const material = new THREE.MeshStandardMaterial({ color: landmark ? 0xd8d2c7 : 0x777c80, roughness: 0.7 });
    const count = landmark ? 4 : Math.floor(rand(1, 3));
    for (let i = 0; i < count; i += 1) {
      const unit = new THREE.Mesh(new THREE.BoxGeometry(rand(1.5, 3.2), rand(0.7, 1.4), rand(1.4, 3.1)), material);
      unit.position.set(
        x + rand(-width * 0.28, width * 0.28),
        height + 1.25,
        z + rand(-depth * 0.28, depth * 0.28),
      );
      unit.castShadow = true;
      this.group.add(unit);
    }
  }

  addStreetDressing() {
    const lampPositions = [];
    for (let x = -160; x <= 160; x += 32) {
      lampPositions.push([x, -92], [x, -120], [x, -10], [x, 12], [x, 50], [x, 72]);
    }
    for (let z = -96; z <= 92; z += 30) {
      lampPositions.push([-158, z], [-70, z], [12, z], [70, z], [158, z]);
    }
    for (const [x, z] of lampPositions) {
      if (this.isReservedForRoadCenter(x, z)) continue;
      this.addLamp(x, z);
    }

    for (let i = 0; i < 72; i += 1) {
      const inPark = Math.random() < 0.45;
      const x = inPark ? rand(-144, -82) : rand(-190, 190);
      const z = inPark ? rand(66, 112) : rand(-132, 130);
      if (this.isOnRoad({ x, z })) continue;
      this.addTree(x, z);
    }

    for (const [x, z] of [
      [-132, 82],
      [-104, 110],
      [-86, 78],
      [116, -70],
      [137, -58],
      [-45, 50],
    ]) {
      this.addBench(x, z);
    }

    for (let x = -144; x <= -84; x += 10) {
      this.addFence(x, 58);
      this.addFence(x, 118);
    }
    for (let z = 66; z <= 110; z += 10) {
      this.addFence(-150, z, Math.PI / 2);
      this.addFence(-76, z, Math.PI / 2);
    }

    this.addTrafficSignals();
    this.addDaytimeDetails();
    this.addParkingSites();
    this.addRoadblockSites();
  }

  addDaytimeDetails() {
    this.addParkPaths();
    this.addShopfronts();
    this.addBusStops();
    this.addRoadSigns();
    this.addConstructionCones();
    this.addRoadDividers();
    this.addLivingCityPolish();
  }

  addLivingCityPolish() {
    const stallMaterial = new THREE.MeshStandardMaterial({ color: 0xffcf70, roughness: 0.62 });
    for (const [x, z, yaw] of [[-44, -58, 0], [-58, -58, 0], [62, 48, Math.PI], [-118, 116, Math.PI]]) {
      const stall = new THREE.Group();
      stall.position.set(x, 0, z);
      stall.rotation.y = yaw;
      const table = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.55, 1.5), this.materials.concrete);
      table.position.set(0, 0.62, 0);
      const canopy = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.24, 2.2), stallMaterial);
      canopy.position.set(0, 2.25, 0);
      stall.add(table, canopy);
      this.group.add(stall);
    }

    for (const [label, x, z, color] of [
      ['NORTH LOOP', -22, -136, 0x2e6bb8],
      ['PARK CUT', -154, 112, 0x3f8a45],
      ['POLICE HQ', 130, -96, 0x256dff],
      ['MARKET STREET', -72, -72, 0xff8a4b],
      ['DOWNTOWN CORE', 38, 124, 0x9ed8ff],
      ['INDUSTRIAL YARD', 148, 106, 0xff8a4b],
    ]) {
      this.addBillboard(label, x, z, 13, 3.4, color);
    }

    for (const [x, z] of [[112, -54], [120, -54], [136, -54], [144, -54], [118, -74], [138, -74]]) {
      const barrier = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.9, 0.7), this.materials.barrier);
      barrier.position.set(x, 0.52, z);
      barrier.rotation.y = (x % 2) * 0.18;
      barrier.castShadow = true;
      this.group.add(barrier);
    }

    const statue = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.6, 3.8, 18), this.materials.concrete);
    statue.position.set(-112, 2.85, 88);
    statue.castShadow = true;
    this.group.add(statue);
    for (const angle of [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5]) {
      const jet = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.2, 6), this.materials.blueWindow);
      jet.position.set(-112 + Math.sin(angle) * 3.8, 2.4, 88 + Math.cos(angle) * 3.8);
      jet.rotation.z = Math.sin(angle) * 0.32;
      this.group.add(jet);
    }

    const personMaterial = new THREE.MeshStandardMaterial({ color: 0x24313a, roughness: 0.75 });
    for (const [x, z] of [[-140, 112], [-134, 112], [-92, 64], [56, 52], [64, 52], [-48, -62]]) {
      const silhouette = new THREE.Group();
      silhouette.position.set(x, 0, z);
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 1.25, 8), personMaterial);
      body.position.y = 0.95;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 6), personMaterial);
      head.position.y = 1.72;
      silhouette.add(body, head);
      this.group.add(silhouette);
    }
  }

  addParkPaths() {
    const material = new THREE.MeshStandardMaterial({ color: 0xd3c4aa, roughness: 0.9 });
    for (const [x, z, w, h, rot] of [
      [-112, 88, 62, 3.2, 0],
      [-112, 88, 3.2, 46, 0],
      [-128, 104, 28, 2.4, 0.55],
      [-96, 74, 28, 2.4, 0.55],
    ]) {
      const path = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
      path.position.set(x, 0.052, z);
      path.rotation.x = -Math.PI / 2;
      path.rotation.z = rot;
      this.group.add(path);
    }
  }

  addShopfronts() {
    for (const [label, x, z, yaw] of [
      ['MARKET', -52, -77, 0],
      ['AUTO', -105, 9, Math.PI / 2],
      ['BANK', 62, 12, 0],
      ['CAFE', -72, 103, Math.PI],
      ['FUEL', 150, 14, -Math.PI / 2],
    ]) {
      const group = new THREE.Group();
      group.position.set(x, 0.04, z);
      group.rotation.y = yaw;
      const awning = new THREE.Mesh(new THREE.BoxGeometry(8, 0.5, 1.2), new THREE.MeshStandardMaterial({ color: 0xd84a3f, roughness: 0.55 }));
      awning.position.set(0, 3.1, 0);
      const glass = new THREE.Mesh(new THREE.BoxGeometry(7.4, 2.2, 0.18), this.materials.window);
      glass.position.set(0, 1.65, 0.42);
      group.add(awning, glass);
      this.group.add(group);
      this.addBillboard(label, x, z + 2, 8, 2.2, 0xffd27a);
    }
  }

  addBusStops() {
    for (const [x, z, yaw] of [[-34, -92, 0], [98, 12, Math.PI], [-160, 38, Math.PI / 2]]) {
      const shelter = new THREE.Group();
      shelter.position.set(x, 0, z);
      shelter.rotation.y = yaw;
      const roof = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.28, 1.8), this.materials.concrete);
      roof.position.set(0, 2.7, 0);
      const back = new THREE.Mesh(new THREE.BoxGeometry(5.8, 2.1, 0.18), this.materials.blueWindow);
      back.position.set(0, 1.45, -0.72);
      const bench = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.28, 0.75), new THREE.MeshStandardMaterial({ color: 0x7d5d40, roughness: 0.7 }));
      bench.position.set(0, 0.78, 0.22);
      shelter.add(roof, back, bench);
      this.group.add(shelter);
    }
  }

  addRoadSigns() {
    for (const [label, x, z] of [
      ['HQ', 118, -44],
      ['PARK', -152, 74],
      ['HIGHWAY', -18, -125],
      ['DOWNTOWN', 14, 42],
      ['MARKET', -54, -52],
    ]) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 3.2, 8), this.materials.concrete);
      pole.position.set(x, 1.6, z);
      const sign = new THREE.Mesh(new THREE.BoxGeometry(3.9, 1.35, 0.12), this.materials.sign);
      sign.position.set(x, 3.1, z);
      this.group.add(pole, sign);
    }
  }

  addConstructionCones() {
    for (let i = 0; i < 20; i += 1) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.1, 12), this.materials.cone);
      cone.position.set(104 + (i % 5) * 5.2, 0.55, -86 + Math.floor(i / 5) * 4.4);
      cone.castShadow = true;
      this.group.add(cone);
    }
  }

  addRoadDividers() {
    for (const [start, end, z] of [[-64, 64, -106], [-58, 58, 0], [-50, 50, 60]]) {
      for (let x = start; x <= end; x += 14) {
        const divider = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.55, 0.6), this.materials.concrete);
        divider.position.set(x, 0.32, z);
        divider.castShadow = true;
        this.group.add(divider);
      }
    }
  }

  addParkingSites() {
    for (const [x, z, yaw] of [
      [-58, -48, Math.PI / 2],
      [-46, -48, Math.PI / 2],
      [54, -48, -Math.PI / 2],
      [66, -48, -Math.PI / 2],
      [128, 18, Math.PI],
      [142, 18, Math.PI],
      [-142, 82, Math.PI / 2],
      [-132, 82, Math.PI / 2],
      [112, 104, 0],
      [126, 104, 0],
      [-164, -92, Math.PI / 2],
      [164, -92, -Math.PI / 2],
      [-24, 74, 0],
      [24, 74, 0],
    ]) {
      this.parkingSites.push({ position: new THREE.Vector3(x, 0, z), yaw });
      const stripe = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 0.18), this.materials.lane);
      stripe.position.set(x, 0.061, z);
      stripe.rotation.x = -Math.PI / 2;
      stripe.rotation.z = yaw;
      this.group.add(stripe);
    }
  }

  addRoadblockSites() {
    const sites = [
      [0, -106, Math.PI / 2, 24],
      [88, 0, Math.PI / 2, 22],
      [-88, 60, Math.PI / 2, 20],
      [0, 34, Math.PI / 2, 15],
      [148, -32, 0, 18],
      [-82, -28, 0, 18],
      [0, 82, 0, 22],
      [-148, 26, 0, 18],
    ];
    this.roadblockSites = sites.map(([x, z, yaw, width]) => ({ center: new THREE.Vector3(x, 0, z), yaw, width }));
  }

  addLamp(x, z) {
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.22, 6.8, 8),
      new THREE.MeshStandardMaterial({ color: 0x5e6569, roughness: 0.5, metalness: 0.25 }),
    );
    pole.position.set(x, 3.4, z);
    pole.castShadow = true;
    this.group.add(pole);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 10, 8), this.materials.lamp);
    head.position.set(x, 7.05, z);
    this.group.add(head);

    if (this.lampLightCount < 12) {
      const light = new THREE.PointLight(0xffd39a, 0.12, 18, 2.2);
      light.position.set(x, 6.7, z);
      this.group.add(light);
      this.lampLightCount += 1;
    }
  }

  addTree(x, z) {
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.42, 2.2, 7),
      new THREE.MeshStandardMaterial({ color: 0x6a4730, roughness: 0.9 }),
    );
    trunk.position.set(x, 1.1, z);
    trunk.castShadow = true;
    this.group.add(trunk);

    const crown = new THREE.Mesh(
      new THREE.SphereGeometry(rand(1.4, 2.3), 10, 8),
      new THREE.MeshStandardMaterial({ color: Math.random() > 0.5 ? 0x2f7d43 : 0x4f9a4f, roughness: 0.9 }),
    );
    crown.position.set(x, 3.2, z);
    crown.castShadow = true;
    this.group.add(crown);
  }

  addBench(x, z) {
    const wood = new THREE.MeshStandardMaterial({ color: 0x7d4f36, roughness: 0.72 });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.28, 1), wood);
    seat.position.set(x, 0.75, z);
    seat.castShadow = true;
    this.group.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.28, 1), wood);
    back.position.set(x, 1.45, z - 0.55);
    back.rotation.x = -0.25;
    back.castShadow = true;
    this.group.add(back);
  }

  addFence(x, z, rotation = 0) {
    const fence = new THREE.Mesh(new THREE.BoxGeometry(7, 1.05, 0.25), this.materials.concrete);
    fence.position.set(x, 0.65, z);
    fence.rotation.y = rotation;
    fence.castShadow = true;
    this.group.add(fence);
  }

  addTrafficSignals() {
    const points = [
      [8, 8],
      [-74, 8],
      [90, 8],
      [8, 68],
      [8, -58],
      [-140, 8],
      [156, 8],
    ];
    for (const [x, z] of points) {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.22, 5.4, 8),
        new THREE.MeshStandardMaterial({ color: 0x252a2f, roughness: 0.55, metalness: 0.32 }),
      );
      pole.position.set(x, 2.7, z);
      this.group.add(pole);
      const box = new THREE.Mesh(new THREE.BoxGeometry(1, 2.2, 0.65), this.materials.buildingDark);
      box.position.set(x, 5.4, z);
      this.group.add(box);
      for (const [iy, color] of [
        [6.05, 0xff2536],
        [5.42, 0xffc247],
        [4.78, 0x29d77f],
      ]) {
        const light = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 6), new THREE.MeshBasicMaterial({ color }));
        light.position.set(x, iy, z - 0.35);
        this.group.add(light);
      }
    }
  }

  addBillboard(text, x, z, width, height, color) {
    const texture = this.makeTextTexture(text, '#101215', 512, 128, 'bold 44px Arial', color);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const board = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
    board.position.set(x, 7.5, z);
    board.rotation.y = Math.PI;
    this.group.add(board);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 7, 8), this.materials.concrete);
    post.position.set(x, 3.45, z);
    this.group.add(post);
  }

  makeTextTexture(text, fill = '#ffffff', width = 512, height = 128, font = 'bold 48px Arial', background = 0xffba70) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = `#${background.toString(16).padStart(6, '0')}`;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = fill;
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  addWaypoints() {
    const nodes = new Map();
    const node = (x, z) => {
      const key = `${x},${z}`;
      if (!nodes.has(key)) {
        nodes.set(key, { position: new THREE.Vector3(x, 0, z), neighbors: [] });
      }
      return nodes.get(key);
    };
    const connect = (a, b) => {
      if (!a.neighbors.includes(b)) a.neighbors.push(b);
      if (!b.neighbors.includes(a)) b.neighbors.push(a);
    };
    const lines = [
      [[-168, -106], [-116, -106], [-82, -106], [0, -106], [82, -106], [116, -106], [168, -106]],
      [[-160, 0], [-116, 0], [-82, 0], [0, 0], [82, 0], [116, 0], [160, 0]],
      [[-150, 60], [-82, 60], [0, 60], [82, 60], [150, 60]],
      [[-148, -106], [-148, -66], [-148, 0], [-148, 60], [-148, 88]],
      [[-82, -122], [-82, -106], [-82, -66], [-82, 0], [-82, 34], [-82, 60], [-82, 88]],
      [[0, -128], [0, -106], [0, -66], [0, 0], [0, 34], [0, 60], [0, 94]],
      [[82, -122], [82, -106], [82, -66], [82, 0], [82, 34], [82, 60], [82, 88]],
      [[148, -106], [148, -66], [148, 0], [148, 34], [148, 60], [148, 92]],
      [[-116, 94], [-82, 94], [0, 94], [82, 94], [116, 94]],
      [[-148, -66], [-82, -66], [0, -66], [82, -66], [148, -66]],
      [[-148, 34], [-82, 34], [0, 34], [82, 34], [148, 34]],
    ];
    for (const line of lines) {
      for (let i = 0; i < line.length - 1; i += 1) {
        connect(node(...line[i]), node(...line[i + 1]));
      }
    }
    this.waypoints = [...nodes.values()];
  }

  addSpawnPoints() {
    this.spawnPoints = {
      robber: { position: new THREE.Vector3(-48, 0, -106), yaw: Math.PI / 2 },
      police: { position: new THREE.Vector3(72, 0, -106), yaw: -Math.PI / 2 },
      aiRobber: { position: new THREE.Vector3(-126, 0, 0), yaw: Math.PI / 2 },
      policeUnits: [
        { position: new THREE.Vector3(122, 0, -66), yaw: Math.PI },
        { position: new THREE.Vector3(-126, 0, 60), yaw: Math.PI / 2 },
        { position: new THREE.Vector3(148, 0, 34), yaw: Math.PI },
        { position: new THREE.Vector3(0, 0, 94), yaw: Math.PI },
      ],
      swat: { position: new THREE.Vector3(126, 0, -88), yaw: 0 },
    };
  }

  isReservedForRoadOrPark(x, z) {
    if (x > -154 && x < -72 && z > 54 && z < 122) return true;
    if (x > 108 && x < 160 && z > 84 && z < 126) return true;
    return this.isOnRoad({ x, z }, 5);
  }

  isReservedForRoadCenter(x, z) {
    return this.isOnRoad({ x, z }, -4);
  }

  isOnRoad(position, extra = 0) {
    for (const road of this.roadRects) {
      const dx = position.x - road.centerX;
      const dz = position.z - road.centerZ;
      const localX = Math.cos(road.angle) * dx + Math.sin(road.angle) * dz;
      const localZ = -Math.sin(road.angle) * dx + Math.cos(road.angle) * dz;
      if (
        Math.abs(localX) <= road.length / 2 + extra &&
        Math.abs(localZ) <= road.width / 2 + extra
      ) {
        return true;
      }
    }
    return false;
  }

  nearestWaypoint(position) {
    let best = this.waypoints[0];
    let bestDistance = Infinity;
    for (const waypoint of this.waypoints) {
      const distance = waypoint.position.distanceToSquared(position);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = waypoint;
      }
    }
    return best;
  }
}
