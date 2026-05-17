import * as THREE from '../../vendor/three.js';
import { CAR_CONFIGS } from '../../config/cars.js';
import {
  CITY_ZONES,
  COLLECTIBLES,
  ELEVATED_ROUTES,
  LANDMARKS,
  ROAD_PATHS,
  ROAD_SEGMENTS,
  RESERVED_ZONES,
  WORLD_CONFIG
} from '../../config/city.js';
import { COLLISION_TYPES, CollisionSystem } from '../collision/CollisionSystem.js';
import { pointInRotatedRect, vec2Distance } from '../utils/math.js';

export class CityBuilder {
  constructor(scene, effectsManager, vehicleFactory) {
    this.scene = scene;
    this.effectsManager = effectsManager;
    this.vehicleFactory = vehicleFactory;
    this.group = new THREE.Group();
    this.group.name = 'Mini City Drive City';
    this.scene.add(this.group);
    this.collisionSystem = new CollisionSystem(scene);
    this.roadSegments = ROAD_SEGMENTS;
    this.elevatedRoutes = [];
    this.roadPaths = this.prepareRoadPaths(ROAD_PATHS);
    this.legacyElevatedRoutes = [...ELEVATED_ROUTES].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    this.collectibles = [];
    this.landmarks = LANDMARKS;
    this.currentZoneId = null;
    this.textures = new Map();
    this.materials = this.createMaterials();
  }

  prepareRoadPaths(paths) {
    return paths
      .map((path) => {
        const controlPoints = path.points.map(([x, y, z]) => new THREE.Vector3(x, y, z));
        const curve = new THREE.CatmullRomCurve3(controlPoints, Boolean(path.closed), 'catmullrom', 0.35);
        const sampleCount = path.samples ?? Math.max(18, Math.round(controlPoints.length * 8));
        const samples = curve.getPoints(sampleCount);
        const segments = [];
        let totalLength = 0;
        for (let i = 0; i < samples.length - 1; i += 1) {
          const a = samples[i];
          const b = samples[i + 1];
          const horizontalLength = Math.hypot(b.x - a.x, b.z - a.z);
          if (horizontalLength < 0.01) continue;
          totalLength += horizontalLength;
          segments.push({
            index: i,
            a,
            b,
            midpoint: new THREE.Vector3((a.x + b.x) * 0.5, (a.y + b.y) * 0.5, (a.z + b.z) * 0.5),
            heading: Math.atan2(b.x - a.x, b.z - a.z),
            slope: Math.atan2(b.y - a.y, horizontalLength),
            length: horizontalLength
          });
        }
        return {
          ...path,
          controlPoints,
          curve,
          samples,
          segments,
          length: totalLength
        };
      })
      .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  }

  createMaterials() {
    return {
      ground: new THREE.MeshStandardMaterial({ color: '#b8d884', roughness: 0.84 }),
      park: new THREE.MeshStandardMaterial({ color: '#73b86d', roughness: 0.88 }),
      asphalt: new THREE.MeshStandardMaterial({ color: '#41484e', roughness: 0.72 }),
      sidewalk: new THREE.MeshStandardMaterial({ color: '#d8d1c4', roughness: 0.78 }),
      lane: new THREE.MeshStandardMaterial({ color: '#f6f0dc', roughness: 0.48 }),
      crosswalk: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.42 }),
      glass: new THREE.MeshStandardMaterial({ color: '#9bd4e6', roughness: 0.18, metalness: 0.12 }),
      buildingA: new THREE.MeshStandardMaterial({ color: '#d9e0e4', roughness: 0.58 }),
      buildingB: new THREE.MeshStandardMaterial({ color: '#c8d3dc', roughness: 0.58 }),
      buildingC: new THREE.MeshStandardMaterial({ color: '#ebe0cf', roughness: 0.62 }),
      trim: new THREE.MeshStandardMaterial({ color: '#caa76a', roughness: 0.34, metalness: 0.48 }),
      dark: new THREE.MeshStandardMaterial({ color: '#1f2834', roughness: 0.5 }),
      white: new THREE.MeshStandardMaterial({ color: '#fff8e9', roughness: 0.54 }),
      redLight: new THREE.MeshStandardMaterial({ color: '#d93434', emissive: '#c51d1d', emissiveIntensity: 0.65 }),
      greenLight: new THREE.MeshStandardMaterial({ color: '#31a96c', emissive: '#228f56', emissiveIntensity: 0.55 }),
      water: new THREE.MeshStandardMaterial({ color: '#78c7e7', roughness: 0.08, metalness: 0.04, transparent: true, opacity: 0.78 }),
      runway: new THREE.MeshStandardMaterial({ color: '#343a40', roughness: 0.68 }),
      concrete: new THREE.MeshStandardMaterial({ color: '#c9c4b8', roughness: 0.78 }),
      bridgeBeam: new THREE.MeshStandardMaterial({ color: '#8e9699', roughness: 0.68, metalness: 0.06 }),
      barrier: new THREE.MeshStandardMaterial({ color: '#f1eadc', roughness: 0.52 }),
      shadowZone: new THREE.MeshStandardMaterial({ color: '#8d9a8e', roughness: 0.9, transparent: true, opacity: 0.32 }),
      containerA: new THREE.MeshStandardMaterial({ color: '#b45f45', roughness: 0.62 }),
      containerB: new THREE.MeshStandardMaterial({ color: '#4d738f', roughness: 0.62 }),
      river: new THREE.MeshStandardMaterial({ color: '#8ccde8', roughness: 0.12, metalness: 0.02, transparent: true, opacity: 0.82 })
    };
  }

  build() {
    this.addGround();
    this.addZones();
    this.addRoads();
    this.addReservedZones();
    this.addDowntown();
    this.addPark();
    this.addHighway();
    this.addRiverCorridor();
    this.addAirport();
    this.addIndustrial();
    this.addResidential();
    this.addMarket();
    this.addHill();
    this.addLandmarks();
    this.addCollectibles();
    this.addParkedCars();
  }

  addGround() {
    const ground = new THREE.Mesh(new THREE.BoxGeometry(WORLD_CONFIG.groundSize, 0.08, WORLD_CONFIG.groundSize), this.materials.ground);
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    this.group.add(ground);
  }

  addZones() {
    CITY_ZONES.forEach((zone) => {
      if (zone.id === 'downtown') return;
      const mat = zone.id === 'park'
        ? this.materials.park
        : new THREE.MeshStandardMaterial({ color: zone.color, roughness: 0.82 });
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(zone.size[0], 0.04, zone.size[1]), mat);
      mesh.position.set(zone.center[0], 0.005, zone.center[1]);
      mesh.receiveShadow = true;
      this.group.add(mesh);
    });
  }

  registerSolidBox(id, x, z, width, depth, rotation = 0, height = 5, options = {}) {
    this.collisionSystem.addBox({
      id,
      type: options.type ?? COLLISION_TYPES.HARD_SOLID,
      center: [x, z],
      size: [Math.max(0.4, width), Math.max(0.4, depth)],
      rotation,
      yMin: options.yMin ?? 0,
      yMax: options.yMax ?? height,
      response: options.response ?? 'block',
      metadata: options.metadata ?? {}
    });
  }

  getRotatedRectProbePoints(x, z, width, depth, rotation = 0) {
    const halfW = width * 0.5;
    const halfD = depth * 0.5;
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    return [
      [0, 0],
      [-halfW, -halfD],
      [halfW, -halfD],
      [halfW, halfD],
      [-halfW, halfD],
      [0, -halfD],
      [halfW, 0],
      [0, halfD],
      [-halfW, 0]
    ].map(([localX, localZ]) => new THREE.Vector3(
      x + localX * cos - localZ * sin,
      0,
      z + localX * sin + localZ * cos
    ));
  }

  rectsOverlapApprox(aX, aZ, aWidth, aDepth, aRotation, bX, bZ, bWidth, bDepth, bRotation) {
    const aCenter = new THREE.Vector3(aX, 0, aZ);
    const bCenter = new THREE.Vector3(bX, 0, bZ);
    const aSize = new THREE.Vector3(aWidth, 0, aDepth);
    const bSize = new THREE.Vector3(bWidth, 0, bDepth);
    const aPoints = this.getRotatedRectProbePoints(aX, aZ, aWidth, aDepth, aRotation);
    const bPoints = this.getRotatedRectProbePoints(bX, bZ, bWidth, bDepth, bRotation);
    return aPoints.some((point) => pointInRotatedRect(point, bCenter, bSize, bRotation))
      || bPoints.some((point) => pointInRotatedRect(point, aCenter, aSize, aRotation));
  }

  overlapsRoadClearance(x, z, width, depth, rotation = 0, margin = 2.5) {
    const paddedWidth = width + margin * 2;
    const paddedDepth = depth + margin * 2;
    for (const road of this.roadSegments) {
      if (road.soft) continue;
      if (this.rectsOverlapApprox(
        x,
        z,
        paddedWidth,
        paddedDepth,
        rotation,
        road.center[0],
        road.center[1],
        road.size[0] + margin * 2,
        road.size[1] + margin * 2,
        road.rotation ?? 0
      )) {
        return true;
      }
    }

    const radius = Math.hypot(paddedWidth, paddedDepth) * 0.5;
    const point = new THREE.Vector3(x, 0, z);
    return this.roadPaths.some((path) => {
      const match = this.projectPointToPath(path, point, radius + margin);
      return Boolean(match && match.lateralDistance < path.width * 0.5 + radius + margin);
    });
  }

  registerRoadSurface(id, x, z, width, depth, rotation = 0, surfaceHeight = 0, metadata = {}) {
    this.collisionSystem.addRoadSurface({
      id,
      center: [x, z],
      size: [width, depth],
      rotation,
      surfaceHeight,
      yMin: surfaceHeight - 0.28,
      yMax: surfaceHeight + 0.38,
      metadata: {
        surfaceHeight,
        ...metadata
      }
    });
  }

  addRoads() {
    this.roadSegments.forEach((segment) => {
      this.addRoadSegment(segment);
    });
    this.addPathRoads();
  }

  addReservedZones() {
    RESERVED_ZONES.forEach((zone) => {
      this.collisionSystem.addBox({
        id: zone.id,
        type: COLLISION_TYPES.NO_BUILD_ZONE,
        center: zone.center,
        size: zone.size,
        rotation: zone.rotation ?? 0,
        yMin: 0,
        yMax: 0.12,
        response: 'debug',
        metadata: { clearance: true }
      });
    });
  }

  addRoadSegment(segment) {
    const material = segment.soft
      ? new THREE.MeshStandardMaterial({ color: '#8aae72', roughness: 0.9 })
      : segment.roadClass === 'runway'
        ? this.materials.runway
        : this.materials.asphalt;
    const road = new THREE.Mesh(
      new THREE.BoxGeometry(segment.size[0], 0.08, segment.size[1]),
      material
    );
    road.position.set(segment.center[0], 0.04 + (segment.elevation ?? 0), segment.center[1]);
    road.rotation.y = segment.rotation;
    road.receiveShadow = true;
    this.group.add(road);
    this.registerRoadSurface(segment.id, segment.center[0], segment.center[1], segment.size[0], segment.size[1], segment.rotation, segment.elevation ?? 0, {
      surfaceType: segment.roadClass ?? 'road',
      zone: segment.zone
    });
    this.addRoadDesign(segment);
    if (segment.showSidewalks) this.addSidewalk(segment);
    if (segment.forceBarrier) this.addRoadBarriers(segment);
    if ((segment.elevation ?? 0) > 5) this.addElevatedSupports(segment);
  }

  addPathRoads() {
    this.roadPaths.forEach((path) => this.addRoadPath(path));
  }

  addRoadPath(path) {
    const deck = new THREE.Mesh(this.createPathDeckGeometry(path), this.materials.asphalt);
    deck.castShadow = true;
    deck.receiveShadow = true;
    this.group.add(deck);

    path.segments.forEach((segment) => {
      this.registerRoadSurface(`${path.id}-surface-${segment.index}`, segment.midpoint.x, segment.midpoint.z, path.width, segment.length + 1.5, segment.heading, segment.midpoint.y, {
        surfaceType: path.type,
        zone: path.zone,
        elevated: segment.midpoint.y > 2.2,
        pathId: path.id,
        pathSegment: segment.index
      });

      this.addPathLaneMarks(path, segment);
      if (path.showBarriers) this.addPathBarriers(path, segment);
      this.addPathUnderside(path, segment);
      if (segment.index % 5 === 0 && segment.midpoint.y > 2.2) this.addPathShadow(path, segment);
    });

    this.addPathSupports(path);
    this.addPathGantrySigns(path);
  }

  createPathDeckGeometry(path) {
    const vertices = [];
    const indices = [];
    const halfWidth = path.width * 0.5;
    const thickness = path.deckThickness ?? 1.25;
    path.samples.forEach((point, index) => {
      const previous = path.samples[Math.max(0, index - 1)];
      const next = path.samples[Math.min(path.samples.length - 1, index + 1)];
      const heading = Math.atan2(next.x - previous.x, next.z - previous.z);
      const normal = new THREE.Vector3(Math.cos(heading), 0, -Math.sin(heading));
      const left = point.clone().addScaledVector(normal, halfWidth);
      const right = point.clone().addScaledVector(normal, -halfWidth);
      vertices.push(
        left.x, left.y, left.z,
        right.x, right.y, right.z,
        left.x, left.y - thickness, left.z,
        right.x, right.y - thickness, right.z
      );
    });

    for (let i = 0; i < path.samples.length - 1; i += 1) {
      const a = i * 4;
      const b = (i + 1) * 4;
      indices.push(
        a, a + 1, b + 1, a, b + 1, b,
        a + 2, b + 2, b + 3, a + 2, b + 3, a + 3,
        a, b, b + 2, a, b + 2, a + 2,
        a + 1, a + 3, b + 3, a + 1, b + 3, b + 1
      );
    }
    const end = (path.samples.length - 1) * 4;
    indices.push(0, 2, 3, 0, 3, 1, end, end + 1, end + 3, end, end + 3, end + 2);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  }

  addPathLaneMarks(path, segment) {
    const dashLength = Math.min(7.2, segment.length * 0.82);
    this.getPathLaneDividerOffsets(path).forEach((offset) => {
      if (segment.index % 2 !== 0) return;
      const point = this.offsetPathPoint(segment.midpoint, segment.heading, offset);
      const mark = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.035, dashLength), this.materials.lane);
      mark.position.set(point.x, segment.midpoint.y + 0.08, point.z);
      mark.rotation.set(-segment.slope, segment.heading, 0);
      this.group.add(mark);
    });

    if (path.median && this.isHighwayPath(path)) {
      const median = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.24, segment.length + 0.3), this.materials.trim);
      median.position.set(segment.midpoint.x, segment.midpoint.y + 0.16, segment.midpoint.z);
      median.rotation.set(-segment.slope, segment.heading, 0);
      this.group.add(median);
      this.registerSolidBox(
        `${path.id}-center-divider-${segment.index}`,
        segment.midpoint.x,
        segment.midpoint.z,
        0.52,
        segment.length + 0.42,
        segment.heading,
        segment.midpoint.y + 0.5,
        {
          type: COLLISION_TYPES.SLIDE_SOLID,
          response: 'slide',
          yMin: Math.max(0, segment.midpoint.y - 0.08),
          metadata: { pathId: path.id, centerDivider: true, pathSegment: segment.index }
        }
      );
    } else if (path.median) {
      this.addPathPaintedCenterLine(segment);
    }
  }

  addPathPaintedCenterLine(segment) {
    if (segment.index % 2 !== 0) return;
    const paint = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.026, Math.min(6.8, segment.length * 0.78)), this.materials.trim);
    paint.position.set(segment.midpoint.x, segment.midpoint.y + 0.085, segment.midpoint.z);
    paint.rotation.set(-segment.slope, segment.heading, 0);
    this.group.add(paint);
  }

  addPathBarriers(path, segment) {
    if (!path.barriers) return;
    [-1, 1].forEach((side) => {
      const point = this.offsetPathPoint(segment.midpoint, segment.heading, side * path.width * 0.5);
      const wall = new THREE.Mesh(new THREE.BoxGeometry(0.62, 1.05, segment.length + 0.9), this.materials.barrier);
      wall.position.set(point.x, segment.midpoint.y + 0.55, point.z);
      wall.rotation.set(-segment.slope, segment.heading, 0);
      wall.castShadow = true;
      this.group.add(wall);

      this.registerSolidBox(
        `${path.id}-path-barrier-${segment.index}-${side}`,
        point.x,
        point.z,
        0.82,
        segment.length + 1.1,
        segment.heading,
        segment.midpoint.y + 1.9,
        {
          type: COLLISION_TYPES.SLIDE_SOLID,
          response: 'slide',
          yMin: Math.max(0, segment.midpoint.y - 0.55),
          metadata: { pathId: path.id, barrier: true, pathSegment: segment.index }
        }
      );
    });
  }

  addPathUnderside(path, segment) {
    if (segment.midpoint.y < 1.2) return;
    const thickness = path.deckThickness ?? 1.25;
    [-1, 1].forEach((side) => {
      const point = this.offsetPathPoint(segment.midpoint, segment.heading, side * (path.width * 0.5 - 1.1));
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.42, segment.length + 0.6), this.materials.bridgeBeam);
      beam.position.set(point.x, segment.midpoint.y - thickness - 0.28, point.z);
      beam.rotation.set(-segment.slope, segment.heading, 0);
      beam.castShadow = true;
      this.group.add(beam);
    });
    if (segment.index % 3 === 0) {
      const cross = new THREE.Mesh(new THREE.BoxGeometry(path.width * 0.82, 0.34, 0.45), this.materials.bridgeBeam);
      cross.position.set(segment.midpoint.x, segment.midpoint.y - thickness - 0.36, segment.midpoint.z);
      cross.rotation.y = segment.heading;
      this.group.add(cross);
    }
  }

  addPathSupports(path) {
    const spacing = path.supportSpacing ?? 30;
    let travelled = 0;
    let nextSupport = spacing * 0.65;
    path.segments.forEach((segment) => {
      travelled += segment.length;
      if (travelled < nextSupport || segment.midpoint.y < 2.4) return;
      nextSupport += spacing;

      const isBridge = path.supportStyle === 'bridge-pier' || path.type === 'bridge';
      const offsets = path.supportStyle === 'single'
        ? [0]
        : isBridge
          ? [-path.width * 0.28, 0, path.width * 0.28]
          : [-path.width * 0.26, path.width * 0.26];
      const height = Math.max(1.2, segment.midpoint.y - (path.deckThickness ?? 1.25));

      offsets.forEach((offset) => {
        const point = this.offsetPathPoint(segment.midpoint, segment.heading, offset);
        const column = new THREE.Mesh(
          isBridge
            ? new THREE.CylinderGeometry(0.92, 1.12, height, 16)
            : new THREE.BoxGeometry(1.45, height, 1.45),
          this.materials.concrete
        );
        column.position.set(point.x, height * 0.5, point.z);
        column.castShadow = true;
        column.receiveShadow = true;
        this.group.add(column);
        this.registerSolidBox(
          `${path.id}-path-support-${segment.index}-${offset.toFixed(1)}`,
          point.x,
          point.z,
          isBridge ? 2.5 : 1.9,
          isBridge ? 2.5 : 1.9,
          segment.heading,
          height,
          { metadata: { pathId: path.id, support: true } }
        );
      });

      const cap = new THREE.Mesh(new THREE.BoxGeometry(path.width * 0.68, 0.6, 2.4), this.materials.bridgeBeam);
      cap.position.set(segment.midpoint.x, height + 0.16, segment.midpoint.z);
      cap.rotation.y = segment.heading;
      cap.castShadow = true;
      this.group.add(cap);
    });
  }

  addPathGantrySigns(path) {
    path.signs?.forEach((sign) => {
      const segment = path.segments[Math.min(path.segments.length - 1, Math.max(0, sign.index ?? 0))];
      if (!segment) return;
      const gantry = new THREE.Group();
      [-1, 1].forEach((side) => {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.22, 5.8, 0.22), this.materials.dark);
        post.position.set(side * path.width * 0.42, 2.9, 0);
        gantry.add(post);
      });
      const beam = new THREE.Mesh(new THREE.BoxGeometry(path.width * 0.9, 0.22, 0.22), this.materials.dark);
      beam.position.y = 5.65;
      gantry.add(beam);
      const board = this.createTextBoard(sign.text, 'Mini City Expressway', Math.min(10, path.width * 0.48), 1.6);
      board.position.y = 4.9;
      gantry.add(board);
      gantry.position.set(segment.midpoint.x, segment.midpoint.y + 0.15, segment.midpoint.z);
      gantry.rotation.y = segment.heading;
      this.group.add(gantry);
    });
  }

  addPathShadow(path, segment) {
    const shadow = new THREE.Mesh(new THREE.BoxGeometry(path.width * 1.2, 0.018, segment.length + 1), this.materials.shadowZone);
    shadow.position.set(segment.midpoint.x, 0.03, segment.midpoint.z);
    shadow.rotation.y = segment.heading;
    this.group.add(shadow);
  }

  getPathLaneDividerOffsets(path) {
    const lanes = path.lanes ?? 2;
    if (lanes <= 1) return [];
    if (path.median) {
      if (this.isHighwayPath(path) && lanes >= 4) return [-path.width * 0.25, path.width * 0.25];
      return [];
    }
    if (lanes === 2) return [0];
    if (lanes === 3) return [-path.width * 0.18, path.width * 0.18];
    return [-path.width * 0.24, path.width * 0.24];
  }

  offsetPathPoint(point, heading, offset) {
    return new THREE.Vector3(
      point.x + Math.cos(heading) * offset,
      point.y,
      point.z - Math.sin(heading) * offset
    );
  }

  addElevatedRoutes() {
    this.elevatedRoutes.forEach((route) => {
      if (route.kind === 'bridge') this.addBridgeSpan(route);
      else if (route.kind === 'ramp') this.addRampDeck(route);
      else this.addElevatedDeck(route);
      this.addHighwayBarriers(route);
      this.addShoulderLines(route);
      this.addMergeMarkings(route);
      this.addDeckUnderside(route);
      this.addElevatedSupportsForRoute(route);
      this.addUnderpassDressing(route);
      route.signs?.forEach((sign) => this.addGantrySign(route, sign.at ?? 0, sign.text));
    });
  }

  addElevatedDeck(route) {
    this.addRouteDeckAssembly(route, this.materials.asphalt);
  }

  addRampDeck(route) {
    this.addRouteDeckAssembly(route, this.materials.asphalt);
  }

  addBridgeSpan(route) {
    this.addRouteDeckAssembly(route, this.materials.asphalt);
    this.addBridgePiers(route);
  }

  addRouteDeckAssembly(route, material) {
    const group = this.createRouteSurfaceGroup(route);
    this.registerRoadSurface(route.id, route.center[0], route.center[1], route.size[0], route.size[1], route.rotation, this.getRouteAverageHeight(route), {
      surfaceType: route.kind,
      zone: route.zone,
      elevated: true,
      routeId: route.id
    });
    const thickness = route.deckThickness ?? 1.4;
    const deck = new THREE.Mesh(new THREE.BoxGeometry(route.size[0], thickness, route.size[1]), material);
    deck.position.y = -thickness * 0.5;
    deck.castShadow = true;
    deck.receiveShadow = true;
    group.surface.add(deck);

    const shoulderInset = Math.min(5.2, this.getRouteWidth(route) * 0.34);
    const horizontal = this.isRouteHorizontal(route);
    const length = this.getRouteLength(route);
    const dividerOffsets = this.getLaneDividerOffsets(route);
    dividerOffsets.forEach((offset) => {
      const count = Math.max(4, Math.floor(length / 18));
      for (let i = 0; i < count; i += 1) {
        if (i % 2) continue;
        const major = -length * 0.46 + i * (length * 0.92 / count);
        const mark = new THREE.Mesh(
          new THREE.BoxGeometry(horizontal ? 7.2 : 0.2, 0.035, horizontal ? 0.2 : 7.2),
          this.materials.lane
        );
        mark.position.set(horizontal ? major : offset, 0.06, horizontal ? offset : major);
        group.surface.add(mark);
      }
    });

    [-1, 1].forEach((side) => {
      const strip = new THREE.Mesh(
        new THREE.BoxGeometry(horizontal ? length * 0.95 : 0.18, 0.032, horizontal ? 0.18 : length * 0.95),
        this.materials.lane
      );
      strip.position.set(horizontal ? 0 : side * shoulderInset, 0.065, horizontal ? side * shoulderInset : 0);
      group.surface.add(strip);
    });

    if (route.median) {
      const median = new THREE.Mesh(
        new THREE.BoxGeometry(horizontal ? length * 0.95 : 0.48, 0.22, horizontal ? 0.48 : length * 0.95),
        this.materials.trim
      );
      median.position.y = 0.16;
      group.surface.add(median);
    }

    this.group.add(group.root);
  }

  addDeckUnderside(route) {
    const group = this.createRouteSurfaceGroup(route);
    const horizontal = this.isRouteHorizontal(route);
    const length = this.getRouteLength(route);
    const width = this.getRouteWidth(route);
    const thickness = route.deckThickness ?? 1.4;

    [-1, 1].forEach((side) => {
      const beam = new THREE.Mesh(
        new THREE.BoxGeometry(horizontal ? length * 0.98 : 0.9, 0.65, horizontal ? 0.9 : length * 0.98),
        this.materials.bridgeBeam
      );
      beam.position.set(horizontal ? 0 : side * (width * 0.5 - 1.1), -thickness - 0.26, horizontal ? side * (width * 0.5 - 1.1) : 0);
      beam.castShadow = true;
      group.surface.add(beam);
    });

    const crossCount = Math.max(3, Math.floor(length / 34));
    for (let i = 0; i < crossCount; i += 1) {
      const major = -length * 0.44 + i * (length * 0.88 / Math.max(1, crossCount - 1));
      const cross = new THREE.Mesh(
        new THREE.BoxGeometry(horizontal ? 0.55 : width * 0.92, 0.38, horizontal ? width * 0.92 : 0.55),
        this.materials.bridgeBeam
      );
      cross.position.set(horizontal ? major : 0, -thickness - 0.35, horizontal ? 0 : major);
      group.surface.add(cross);
    }
    this.group.add(group.root);
  }

  addHighwayBarriers(route) {
    if (!route.barriers) return;
    const group = this.createRouteSurfaceGroup(route);
    const horizontal = this.isRouteHorizontal(route);
    const length = this.getRouteLength(route);
    const width = this.getRouteWidth(route);
    [-1, 1].forEach((side) => {
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(horizontal ? length * 0.98 : 0.58, 1.1, horizontal ? 0.58 : length * 0.98),
        this.materials.barrier
      );
      wall.position.set(horizontal ? 0 : side * width * 0.5, 0.54, horizontal ? side * width * 0.5 : 0);
      wall.castShadow = true;
      group.surface.add(wall);
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(horizontal ? length * 0.96 : 0.18, 0.18, horizontal ? 0.18 : length * 0.96),
        this.materials.dark
      );
      rail.position.set(horizontal ? 0 : side * (width * 0.5 - 0.15), 1.2, horizontal ? side * (width * 0.5 - 0.15) : 0);
      group.surface.add(rail);
      const colliderPoint = this.getRouteWorldPoint(route, 0, side * width * 0.5);
      this.registerSolidBox(
        `${route.id}-barrier-${side}`,
        colliderPoint.x,
        colliderPoint.z,
        horizontal ? length * 0.98 : 0.82,
        horizontal ? 0.82 : length * 0.98,
        route.rotation,
        this.getRouteAverageHeight(route) + 2.0,
        {
          yMin: Math.max(0, this.getRouteAverageHeight(route) - 0.6),
          metadata: { routeId: route.id, barrier: true }
        }
      );
      if (route.kind === 'ramp') {
        const segmentCount = 4;
        for (let i = 0; i < segmentCount; i += 1) {
          const t = (i + 0.5) / segmentCount;
          const localMajor = -length * 0.46 + t * length * 0.92;
          const surfaceHeight = this.getRouteHeightAtT(route, t);
          const point = this.getRouteWorldPoint(route, localMajor, side * width * 0.5);
          this.registerSolidBox(
            `${route.id}-ramp-barrier-${side}-${i}`,
            point.x,
            point.z,
            horizontal ? length * 0.23 : 0.82,
            horizontal ? 0.82 : length * 0.23,
            route.rotation,
            surfaceHeight + 1.9,
            {
              yMin: Math.max(0, surfaceHeight - 0.55),
              metadata: { routeId: route.id, barrier: true, rampSegment: i }
            }
          );
        }
      }
    });
    this.group.add(group.root);
  }

  addShoulderLines(route) {
    if (!route.shoulders) return;
    const group = this.createRouteSurfaceGroup(route);
    const horizontal = this.isRouteHorizontal(route);
    const length = this.getRouteLength(route);
    const width = this.getRouteWidth(route);
    [-1, 1].forEach((side) => {
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(horizontal ? length * 0.92 : 0.14, 0.035, horizontal ? 0.14 : length * 0.92),
        this.materials.crosswalk
      );
      line.position.set(horizontal ? 0 : side * (width * 0.5 - 3.2), 0.08, horizontal ? side * (width * 0.5 - 3.2) : 0);
      group.surface.add(line);
    });
    this.group.add(group.root);
  }

  addMergeMarkings(route) {
    if (route.kind !== 'ramp') return;
    const group = this.createRouteSurfaceGroup(route);
    const horizontal = this.isRouteHorizontal(route);
    const length = this.getRouteLength(route);
    for (let i = 0; i < 4; i += 1) {
      const major = -length * 0.25 + i * 8;
      const mark = new THREE.Mesh(
        new THREE.BoxGeometry(horizontal ? 4.6 : 0.16, 0.04, horizontal ? 0.16 : 4.6),
        this.materials.crosswalk
      );
      mark.position.set(horizontal ? major : 2.4 + i * 0.45, 0.1, horizontal ? 2.4 + i * 0.45 : major);
      mark.rotation.y = horizontal ? 0.34 : -0.34;
      group.surface.add(mark);
    }
    this.group.add(group.root);
  }

  addElevatedSupportsForRoute(route) {
    const length = this.getRouteLength(route);
    const spacing = route.supportSpacing ?? 32;
    const count = Math.max(2, Math.floor(length / spacing));
    for (let i = 0; i < count; i += 1) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      const localMajor = -length * 0.44 + t * length * 0.88;
      const surfaceHeight = this.getRouteHeightAtT(route, (localMajor / length) + 0.5);
      if (surfaceHeight < 2.4) continue;
      this.addSupportBent(route, localMajor, surfaceHeight);
    }
  }

  addSupportBent(route, localMajor, surfaceHeight) {
    const width = this.getRouteWidth(route);
    const height = Math.max(1.2, surfaceHeight - (route.deckThickness ?? 1.4));
    const isBridge = route.supportStyle === 'bridge-pier';
    const offsets = route.supportStyle === 'single'
      ? [0]
      : isBridge
        ? [-width * 0.32, 0, width * 0.32]
        : [-width * 0.28, width * 0.28];
    offsets.forEach((offset) => {
      const point = this.getRouteWorldPoint(route, localMajor, offset);
      const column = new THREE.Mesh(
        isBridge
          ? new THREE.CylinderGeometry(0.88, 1.08, height, 16)
          : new THREE.BoxGeometry(1.5, height, 1.5),
        this.materials.concrete
      );
      column.position.set(point.x, height * 0.5, point.z);
      column.castShadow = true;
      column.receiveShadow = true;
      this.group.add(column);
      this.registerSolidBox(
        `${route.id}-support-${Math.round(localMajor)}-${offset.toFixed(1)}`,
        point.x,
        point.z,
        isBridge ? 2.4 : 1.9,
        isBridge ? 2.4 : 1.9,
        route.rotation,
        height,
        { metadata: { routeId: route.id, support: true } }
      );

      const base = new THREE.Mesh(
        new THREE.BoxGeometry(isBridge ? 4.2 : 3.0, 0.34, isBridge ? 3.2 : 2.6),
        this.materials.concrete
      );
      base.position.set(point.x, 0.17, point.z);
      base.rotation.y = route.rotation;
      this.group.add(base);
    });

    const capPoint = this.getRouteWorldPoint(route, localMajor, 0);
    const cap = new THREE.Mesh(
      new THREE.BoxGeometry(isBridge ? width * 0.82 : width * 0.68, 0.65, isBridge ? 3.6 : 2.4),
      this.materials.bridgeBeam
    );
    cap.position.set(capPoint.x, height + 0.18, capPoint.z);
    cap.rotation.y = route.rotation;
    cap.castShadow = true;
    this.group.add(cap);
  }

  addBridgePiers(route) {
    const length = this.getRouteLength(route);
    [-0.34, 0, 0.34].forEach((ratio) => {
      const localMajor = ratio * length;
      const point = this.getRouteWorldPoint(route, localMajor, 0);
      const pier = new THREE.Mesh(new THREE.BoxGeometry(8.2, 3.0, 5.4), this.materials.concrete);
      pier.position.set(point.x, 1.5, point.z);
      pier.rotation.y = route.rotation;
      pier.castShadow = true;
      this.group.add(pier);
      this.registerSolidBox(`${route.id}-pier-${ratio}`, point.x, point.z, 8.8, 5.8, route.rotation, 3.4, {
        metadata: { routeId: route.id, bridgePier: true }
      });
    });
  }

  addGantrySign(route, normalizedMajor, text) {
    const length = this.getRouteLength(route);
    const localMajor = Math.max(-0.45, Math.min(0.45, normalizedMajor)) * length;
    const point = this.getRouteWorldPoint(route, localMajor, 0);
    const height = this.getRouteHeightAtT(route, (localMajor / length) + 0.5);
    const gantry = new THREE.Group();
    const width = this.getRouteWidth(route);
    [-1, 1].forEach((side) => {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.22, 5.8, 0.22), this.materials.dark);
      post.position.set(side * width * 0.42, 2.9, 0);
      gantry.add(post);
    });
    const beam = new THREE.Mesh(new THREE.BoxGeometry(width * 0.92, 0.22, 0.22), this.materials.dark);
    beam.position.y = 5.65;
    gantry.add(beam);
    const board = this.createTextBoard(text, 'Mini City Expressway', Math.min(10, width * 0.45), 1.6);
    board.position.y = 4.9;
    gantry.add(board);
    gantry.position.set(point.x, height + 0.15, point.z);
    gantry.rotation.y = route.rotation;
    this.group.add(gantry);
  }

  addUnderpassDressing(route) {
    if (!['bridge', 'deck', 'flyover'].includes(route.kind)) return;
    const length = this.getRouteLength(route);
    const width = this.getRouteWidth(route);
    const shadow = new THREE.Mesh(
      new THREE.BoxGeometry(this.isRouteHorizontal(route) ? length * 0.92 : width * 1.25, 0.018, this.isRouteHorizontal(route) ? width * 1.25 : length * 0.92),
      this.materials.shadowZone
    );
    shadow.position.set(route.center[0], 0.03, route.center[1]);
    shadow.rotation.y = route.rotation;
    this.group.add(shadow);
    if (route.kind === 'bridge') {
      [-130, 0, 130].forEach((major) => {
        const point = this.getRouteWorldPoint(route, major, -width * 0.72);
        this.addBillboard(point.x, point.z, 'UNDERPASS', 'Bridge clearance');
      });
    }
  }

  createRouteSurfaceGroup(route) {
    const root = new THREE.Group();
    root.position.set(route.center[0], this.getRouteAverageHeight(route), route.center[1]);
    root.rotation.y = route.rotation ?? 0;
    const surface = new THREE.Group();
    const delta = (route.endElevation ?? route.deckElevation ?? 0) - (route.startElevation ?? route.deckElevation ?? 0);
    const angle = Math.atan2(delta, this.getRouteLength(route));
    if (Math.abs(delta) > 0.01) {
      if (this.isRouteHorizontal(route)) surface.rotation.z = angle;
      else surface.rotation.x = -angle;
    }
    root.add(surface);
    return { root, surface };
  }

  isRouteHorizontal(route) {
    return route.size[0] >= route.size[1];
  }

  getRouteLength(route) {
    return Math.max(route.size[0], route.size[1]);
  }

  getRouteWidth(route) {
    return Math.min(route.size[0], route.size[1]);
  }

  getRouteAverageHeight(route) {
    const start = route.startElevation ?? route.deckElevation ?? 0;
    const end = route.endElevation ?? route.deckElevation ?? start;
    return (start + end) * 0.5;
  }

  getRouteHeightAtT(route, t) {
    const start = route.startElevation ?? route.deckElevation ?? 0;
    const end = route.endElevation ?? route.deckElevation ?? start;
    const smooth = t * t * (3 - 2 * t);
    return start + (end - start) * smooth;
  }

  getRouteLocal(route, position, padding = 0) {
    const rotation = route.rotation ?? 0;
    const cos = Math.cos(-rotation);
    const sin = Math.sin(-rotation);
    const dx = position.x - route.center[0];
    const dz = position.z - route.center[1];
    const localX = dx * cos - dz * sin;
    const localZ = dx * sin + dz * cos;
    const horizontal = this.isRouteHorizontal(route);
    const length = this.getRouteLength(route);
    const width = this.getRouteWidth(route);
    const major = horizontal ? localX : localZ;
    const minor = horizontal ? localZ : localX;
    const t = Math.max(0, Math.min(1, major / length + 0.5));
    return {
      x: localX,
      z: localZ,
      major,
      minor,
      t,
      inside: Math.abs(major) <= length * 0.5 + padding && Math.abs(minor) <= width * 0.5 + padding
    };
  }

  getRouteWorldPoint(route, localMajor, localMinor = 0) {
    const horizontal = this.isRouteHorizontal(route);
    const localX = horizontal ? localMajor : localMinor;
    const localZ = horizontal ? localMinor : localMajor;
    const cos = Math.cos(route.rotation ?? 0);
    const sin = Math.sin(route.rotation ?? 0);
    return new THREE.Vector3(
      route.center[0] + localX * cos - localZ * sin,
      0,
      route.center[1] + localX * sin + localZ * cos
    );
  }

  getLaneDividerOffsets(route) {
    const lanes = route.lanes ?? 2;
    if (lanes <= 1) return [0];
    if (lanes === 2) return [0];
    if (lanes === 3) return [-3.2, 3.2];
    return [-5.3, 5.3];
  }

  addRoadDesign(segment) {
    if (segment.roadClass === 'runway' || segment.soft) return;
    this.addLaneLines(segment);
    if (segment.median) {
      if (this.isHighwaySegment(segment)) {
        this.addMedian(segment);
      } else {
        this.addPaintedCenterLine(segment);
      }
    }
  }

  isHighwaySegment(segment) {
    return segment.zone === 'highway' || segment.roadClass === 'highway' || segment.roadClass === 'bridge';
  }

  isHighwayPath(path) {
    return path.zone === 'highway' || path.type === 'elevated' || path.type === 'bridge';
  }

  addSidewalk(segment) {
    if (segment.roadClass === 'highway' || segment.roadClass === 'runway') return;
    const margin = segment.roadClass === 'market' ? 1.8 : 2.8;
    const sidewalk = new THREE.Mesh(
      new THREE.BoxGeometry(segment.size[0] + margin, 0.045, segment.size[1] + margin),
      this.materials.sidewalk
    );
    sidewalk.position.set(segment.center[0], 0.012 + (segment.elevation ?? 0), segment.center[1]);
    sidewalk.rotation.y = segment.rotation;
    sidewalk.receiveShadow = true;
    this.group.add(sidewalk);
  }

  addLaneLines(segment) {
    const majorLength = Math.max(segment.size[0], segment.size[1]);
    const horizontal = segment.size[0] >= segment.size[1];
    const count = Math.floor(majorLength / 12);
    const laneOffsets = this.getRoadLaneMarkOffsets(segment);
    if (laneOffsets.length === 0) return;
    for (let i = -count; i <= count; i += 1) {
      if (i % 2 !== 0) continue;
      laneOffsets.forEach((laneOffset) => {
        const mark = new THREE.Mesh(
          new THREE.BoxGeometry(horizontal ? 5.4 : 0.22, 0.018, horizontal ? 0.22 : 5.4),
          this.materials.lane
        );
        const offset = i * 6;
        const alongX = horizontal ? Math.cos(segment.rotation) : -Math.sin(segment.rotation);
        const alongZ = horizontal ? Math.sin(segment.rotation) : Math.cos(segment.rotation);
        const lateralX = horizontal ? -Math.sin(segment.rotation) : Math.cos(segment.rotation);
        const lateralZ = horizontal ? Math.cos(segment.rotation) : Math.sin(segment.rotation);
        mark.position.set(
          segment.center[0] + alongX * offset + lateralX * laneOffset,
          0.097 + (segment.elevation ?? 0),
          segment.center[1] + alongZ * offset + lateralZ * laneOffset
        );
        mark.rotation.y = segment.rotation;
        this.group.add(mark);
      });
    }
  }

  addPaintedCenterLine(segment) {
    const majorLength = Math.max(segment.size[0], segment.size[1]);
    const horizontal = segment.size[0] >= segment.size[1];
    const count = Math.floor(majorLength / 14);
    for (let i = -count; i <= count; i += 1) {
      if (i % 2 !== 0) continue;
      const mark = new THREE.Mesh(
        new THREE.BoxGeometry(horizontal ? 6.2 : 0.16, 0.022, horizontal ? 0.16 : 6.2),
        this.materials.trim
      );
      const offset = i * 7;
      const alongX = horizontal ? Math.cos(segment.rotation) : -Math.sin(segment.rotation);
      const alongZ = horizontal ? Math.sin(segment.rotation) : Math.cos(segment.rotation);
      mark.position.set(
        segment.center[0] + alongX * offset,
        0.102 + (segment.elevation ?? 0),
        segment.center[1] + alongZ * offset
      );
      mark.rotation.y = segment.rotation;
      this.group.add(mark);
    }
  }

  getRoadLaneMarkOffsets(segment) {
    const lanes = segment.lanes ?? 2;
    if (lanes <= 1) return [];
    const roadWidth = Math.min(segment.size[0], segment.size[1]);
    if (segment.median) {
      if (this.isHighwaySegment(segment) && lanes >= 4) return [-roadWidth * 0.25, roadWidth * 0.25];
      return [];
    }
    if (lanes === 2) return [0];
    if (lanes === 3) return [-roadWidth * 0.18, roadWidth * 0.18];
    return [-roadWidth * 0.24, roadWidth * 0.24];
  }

  addMedian(segment) {
    const horizontal = segment.size[0] >= segment.size[1];
    const length = Math.max(segment.size[0], segment.size[1]) * 0.96;
    const median = new THREE.Mesh(
      new THREE.BoxGeometry(horizontal ? length : 0.46, 0.2, horizontal ? 0.46 : length),
      this.materials.trim
    );
    median.position.set(segment.center[0], 0.15 + (segment.elevation ?? 0), segment.center[1]);
    median.rotation.y = segment.rotation;
    this.group.add(median);
    this.registerSolidBox(
      `${segment.id}-center-divider`,
      segment.center[0],
      segment.center[1],
      horizontal ? length : 0.5,
      horizontal ? 0.5 : length,
      segment.rotation,
      (segment.elevation ?? 0) + 0.5,
      {
        type: COLLISION_TYPES.SLIDE_SOLID,
        response: 'slide',
        yMin: Math.max(0, (segment.elevation ?? 0) - 0.05),
        metadata: { segmentId: segment.id, centerDivider: true }
      }
    );
  }

  addRoadBarriers(segment) {
    const horizontal = segment.size[0] >= segment.size[1];
    const width = horizontal ? segment.size[1] : segment.size[0];
    [-1, 1].forEach((side) => {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(horizontal ? segment.size[0] * 0.98 : 0.28, 0.42, horizontal ? 0.28 : segment.size[1] * 0.98),
        this.materials.white
      );
      const offset = side * width * 0.54;
      const lateralX = horizontal ? -Math.sin(segment.rotation) : Math.cos(segment.rotation);
      const lateralZ = horizontal ? Math.cos(segment.rotation) : Math.sin(segment.rotation);
      rail.position.set(
        segment.center[0] + lateralX * offset,
        0.38 + (segment.elevation ?? 0),
        segment.center[1] + lateralZ * offset
      );
      rail.rotation.y = segment.rotation;
      this.group.add(rail);
      this.registerSolidBox(
        `${segment.id}-barrier-${side}`,
        segment.center[0] + lateralX * offset,
        segment.center[1] + lateralZ * offset,
        horizontal ? segment.size[0] * 0.98 : 0.42,
        horizontal ? 0.42 : segment.size[1] * 0.98,
        segment.rotation,
        (segment.elevation ?? 0) + 1.35,
        {
          type: COLLISION_TYPES.SLIDE_SOLID,
          response: 'slide',
          yMin: segment.elevation ?? 0,
          metadata: { segmentId: segment.id, barrier: true }
        }
      );
    });
  }

  addElevatedSupports(segment) {
    const horizontal = segment.size[0] >= segment.size[1];
    const length = horizontal ? segment.size[0] : segment.size[1];
    const count = Math.max(2, Math.floor(length / 44));
    for (let i = 0; i < count; i += 1) {
      const t = count === 1 ? 0 : (i / (count - 1) - 0.5) * length * 0.82;
      const support = new THREE.Mesh(new THREE.BoxGeometry(2.2, segment.elevation + 0.8, 2.2), this.materials.sidewalk);
      support.position.set(
        segment.center[0] + (horizontal ? Math.cos(segment.rotation) * t : 0),
        (segment.elevation + 0.8) * 0.5,
        segment.center[1] + (horizontal ? Math.sin(segment.rotation) * t : t)
      );
      support.castShadow = true;
      this.group.add(support);
      this.registerSolidBox(
        `${segment.id}-support-${i}`,
        support.position.x,
        support.position.z,
        2.6,
        2.6,
        segment.rotation,
        segment.elevation + 0.8
      );
    }
  }

  addCrosswalk(x, z) {
    for (let i = -3; i <= 3; i += 1) {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.025, 7), this.materials.crosswalk);
      stripe.position.set(x + i * 1.2, 0.092, z + 7.2);
      this.group.add(stripe);
    }
  }

  addSpeedBreaker(x, z, rotation = 0) {
    const breaker = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.16, 0.72), this.materials.trim);
    breaker.position.set(x, 0.16, z);
    breaker.rotation.y = rotation;
    breaker.castShadow = true;
    this.group.add(breaker);
    this.registerSolidBox(`speed-breaker-${x}-${z}`, x, z, 8.2, 0.72, rotation, 0.22, {
      type: COLLISION_TYPES.LOW_SURPASSABLE,
      response: 'bump',
      metadata: { bump: 0.13, slowdown: 0.94 }
    });
  }

  addTrafficLight(x, z) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.2, 10), this.materials.dark);
    pole.position.set(x, 1.6, z);
    pole.castShadow = true;
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.08, 0.28), this.materials.dark);
    box.position.set(x, 3.05, z);
    const red = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 8), this.materials.redLight);
    red.position.set(x, 3.28, z + 0.16);
    const green = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 8), this.materials.greenLight);
    green.position.set(x, 2.85, z + 0.16);
    this.group.add(pole, box, red, green);
  }

  addDowntown() {
    const spots = [
      [-24, -24, 11, 24], [24, -24, 13, 34], [-24, 24, 12, 28], [24, 24, 16, 40],
      [-78, -42, 11, 22], [78, 42, 12, 28], [-78, 42, 11, 26], [78, -42, 12, 30],
      [-118, -18, 10, 18], [118, 18, 12, 24], [-118, 54, 10, 20], [118, -54, 11, 22],
      [-36, 92, 12, 24], [72, 92, 14, 30], [-88, -92, 12, 22], [88, -92, 13, 26]
    ];
    spots.forEach(([x, z, size, height], index) => {
      this.addBuilding(x, z, size, height, index % 2 ? this.materials.buildingA : this.materials.buildingB);
    });
    this.addRooftopDetail(24, -24, 14, 34);
    this.addRooftopDetail(24, 24, 14, 34);
    this.addBillboard(8, 51, 'MINI CITY', 'Free Drive Zone');
    this.addBillboard(48, -51, 'GAMEHUB', 'Powered by MH Horizon');
    this.addCityHall(24, 72);
    this.addPlaza(-24, 88);
    [-112, -62, 0, 62, 112].forEach((x) => this.addBusStop(x, -76));
    [-80, -40, 40, 80].forEach((x) => this.addParkingBay(x, 72, 0));
  }

  addBuilding(x, z, footprint, height, material) {
    if (this.overlapsRoadClearance(x, z, footprint, footprint, 0, 3.2)) return false;
    const base = new THREE.Mesh(new THREE.BoxGeometry(footprint, height, footprint), material);
    base.position.set(x, height * 0.5, z);
    base.castShadow = true;
    base.receiveShadow = true;
    this.group.add(base);
    this.registerSolidBox(`building-${x}-${z}`, x, z, footprint * 0.94, footprint * 0.94, 0, height + 0.25);
    this.addRooftopDetail(x, z, footprint, height);

    const rows = Math.floor(height / 3.2);
    for (let row = 1; row < rows; row += 1) {
      [-1, 1].forEach((side) => {
        const windowStrip = new THREE.Mesh(
          new THREE.BoxGeometry(footprint * 0.72, 0.75, 0.045),
          this.materials.glass
        );
        windowStrip.position.set(x, row * 3 + 1.1, z + side * (footprint * 0.51));
        this.group.add(windowStrip);
      });
    }
    return true;
  }

  addPark() {
    this.addParkGate(-122, 34);
    this.addFountain(-190, 66);
    this.addStatue(-168, 86);
    for (let i = 0; i < 54; i += 1) {
      const angle = (i / 26) * Math.PI * 2;
      const radius = 34 + (i % 6) * 7;
      this.addTree(-190 + Math.cos(angle) * radius, 66 + Math.sin(angle) * radius);
    }
    for (let i = 0; i < 12; i += 1) {
      this.addBench(-245 + i * 14, 28 + (i % 3) * 28, i % 2 ? Math.PI * 0.5 : 0);
    }
    [[-220, 38], [-184, 34], [-226, 100], [-154, 94], [-188, 124], [-130, 64]].forEach(([x, z]) => this.addFlowerBed(x, z));
    this.addWalkingPath(-190, 66, 62, 42);
    this.addFence(-270, 0, 130, true);
    this.addFence(-104, 126, 140, false);
  }

  addFountain(x, z) {
    const base = new THREE.Mesh(new THREE.CylinderGeometry(4.8, 5.3, 0.55, 32), this.materials.trim);
    base.position.set(x, 0.28, z);
    const water = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, 0.18, 32), this.materials.water);
    water.position.set(x, 0.66, z);
    const spray = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.42, 2.8, 18), this.materials.water);
    spray.position.set(x, 1.8, z);
    this.group.add(base, water, spray);
    this.registerSolidBox(`fountain-${x}-${z}`, x, z, 8.9, 8.9, 0, 2.6);
  }

  addStatue(x, z) {
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 2.2), this.materials.trim);
    plinth.position.set(x, 0.4, z);
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.5, 3.2, 14), this.materials.white);
    column.position.set(x, 2.3, z);
    this.group.add(plinth, column);
    this.registerSolidBox(`statue-${x}-${z}`, x, z, 2.8, 2.8, 0, 4.0);
  }

  addTree(x, z) {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 1.6, 8), this.materials.trim);
    trunk.position.set(x, 0.8, z);
    const crown = new THREE.Mesh(new THREE.SphereGeometry(1.25, 12, 8), this.materials.park);
    crown.position.set(x, 2.0, z);
    trunk.castShadow = true;
    crown.castShadow = true;
    this.group.add(trunk, crown);
  }

  addBench(x, z, rotation = 0) {
    const seat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.22, 0.65), this.materials.trim);
    seat.position.set(x, 0.58, z);
    seat.rotation.y = rotation;
    const back = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.65, 0.16), this.materials.trim);
    back.position.set(x, 1.0, z - 0.32);
    back.rotation.y = rotation;
    this.group.add(seat, back);
    this.registerSolidBox(`bench-${x}-${z}`, x, z, 2.6, 0.9, rotation, 1.2, {
      type: COLLISION_TYPES.SOFT_PASSABLE,
      response: 'soft'
    });
  }

  addFence(x, z, length, vertical) {
    const count = Math.floor(length / 4);
    for (let i = 0; i < count; i += 1) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.1, 0.16), this.materials.white);
      post.position.set(x + (vertical ? 0 : i * 4), 0.55, z + (vertical ? i * 4 : 0));
      this.group.add(post);
    }
  }

  addHighway() {
    this.addBillboard(46, -392, 'HIGHWAY RING', 'Long fast routes');
    this.addBillboard(-382, -388, 'AIRPORT', 'Terminal route');
    this.addBillboard(0, -216, 'ELEVATED RIVER BRIDGE', 'Tall deck - clear underpass');
  }

  addResidential() {
    const houses = [
      [126, 36], [162, 28], [214, 30], [248, 66], [132, 92], [178, 112], [226, 118],
      [126, 142], [214, 148], [258, 104]
    ];
    houses.forEach(([x, z], index) => {
      if (this.overlapsRoadClearance(x, z, 10, 8, 0, 2.4)) return;
      const house = new THREE.Mesh(new THREE.BoxGeometry(10, 5.4, 8), this.materials.buildingC);
      house.position.set(x, 2.7, z);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(7.4, 2.4, 4), this.materials.trim);
      roof.position.set(x, 6.6, z);
      roof.rotation.y = Math.PI * 0.25;
      this.group.add(house, roof);
      this.registerSolidBox(`house-${x}-${z}`, x, z, 9.6, 7.6, 0, 7.0);
      this.addTree(x + (index % 2 ? 8 : -8), z + 8);
      this.addDriveway(x, z - 7);
      this.addGarden(x + (index % 2 ? -6 : 6), z + 2);
    });
    this.addBusStop(126, 48);
    this.addBusStop(232, 104);
    this.addLocalSquare(184, 74);
    this.addBillboard(184, 152, 'RESIDENTIAL', 'Calm roads');
  }

  addMarket() {
    for (let i = 0; i < 13; i += 1) {
      const x = -142 + i * 15;
      if (this.overlapsRoadClearance(x, 194, 9, 8, 0, 2.0)) continue;
      const shop = new THREE.Mesh(new THREE.BoxGeometry(9, 5.8, 8), i % 2 ? this.materials.buildingC : this.materials.white);
      shop.position.set(x, 2.9, 194);
      const awning = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.32, 2.2), i % 2 ? this.materials.trim : this.materials.redLight);
      awning.position.set(x, 4.1, 188.6);
      this.group.add(shop, awning);
      this.registerSolidBox(`market-shop-${x}`, x, 194, 8.7, 7.6, 0, 6.0);
      this.addSign(x, 187.2, i % 2 ? 'CAFE' : 'SHOP');
      if (i % 2 === 0) this.addMarketStall(x + 4, 184.2);
    }
    this.addMarketGate(-134, 182);
    this.addBillboard(-66, 154, 'MARKET GATE', 'Dense city route');
    [-138, -102, -66, -30, 6, 42].forEach((x) => this.addStreetLamp(x, 166));
  }

  addHill() {
    const ridge = new THREE.Mesh(
      new THREE.BoxGeometry(190, 1.2, 128),
      new THREE.MeshStandardMaterial({ color: '#bfd1a9', roughness: 0.88 })
    );
    ridge.position.set(170, 0.32, 214);
    ridge.receiveShadow = true;
    this.group.add(ridge);

    this.addBillboard(170, 238, 'VIEWPOINT', 'Switchback road');
    this.addViewpoint(170, 258);
    [[108, 144, 0.52], [150, 194, -0.6], [202, 230, 0.58], [170, 258, 0.02]].forEach(([x, z, rotation]) => {
      this.addGuardrail(x, z, rotation);
      this.addStreetLamp(x - 6, z + 6);
    });
    for (let i = 0; i < 18; i += 1) {
      this.addTree(96 + (i % 6) * 28, 164 + Math.floor(i / 6) * 38);
    }
  }

  addRiverCorridor() {
    const river = new THREE.Mesh(new THREE.BoxGeometry(560, 0.035, 38), this.materials.river);
    river.position.set(0, 0.02, -154);
    this.group.add(river);
    [-180, -60, 80, 210].forEach((x) => this.addBillboard(x, -174, 'RIVER', 'Bridge corridor'));
  }

  addAirport() {
    this.addAirportArea();
    this.addAirportTerminal(-424, -350);
    this.addAirplane(-360, -286);
    this.addFence(-456, -442, 176, false);
    this.addFence(-456, -224, 190, false);
    this.addBillboard(-422, -370, 'HORIZON AIRPORT', 'Terminal - runway - cargo');
    [-452, -426, -400, -322, -296].forEach((x) => this.addParkingBay(x, -310, Math.PI * 0.5));
  }

  addIndustrial() {
    const warehouses = [[292, -334, 24, 12], [318, -310, 30, 14], [398, -332, 24, 12], [300, -258, 28, 12], [392, -256, 34, 13]];
    warehouses.forEach(([x, z, width, height], index) => {
      if (this.overlapsRoadClearance(x, z, width, 18, 0, 2.5)) return;
      const building = new THREE.Mesh(new THREE.BoxGeometry(width, height, 18), index % 2 ? this.materials.buildingB : this.materials.buildingC);
      building.position.set(x, height * 0.5, z);
      building.castShadow = true;
      this.group.add(building);
      this.registerSolidBox(`warehouse-${x}-${z}`, x, z, width * 0.96, 17.4, 0, height + 0.4);
      const bay = new THREE.Mesh(new THREE.BoxGeometry(width * 0.7, 3.2, 0.18), this.materials.dark);
      bay.position.set(x, 2.2, z + 9.2);
      this.group.add(bay);
    });
    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 6; col += 1) {
        this.addContainer(286 + col * 12, -452 + row * 8, (row + col) % 2 ? this.materials.containerA : this.materials.containerB);
      }
    }
    this.addBillboard(360, -260, 'INDUSTRIAL DEPOT', 'Cargo routes');
    [292, 324, 356, 388, 420, 452].forEach((x) => this.addStreetLamp(x, -384));
  }

  addAirportTerminal(x, z) {
    const centerZ = z - 22;
    if (this.overlapsRoadClearance(x, centerZ, 82, 18, 0, 2.5)) return;
    const terminal = new THREE.Mesh(new THREE.BoxGeometry(82, 10, 18), this.materials.white);
    terminal.position.set(x, 5, centerZ);
    terminal.castShadow = true;
    const glass = new THREE.Mesh(new THREE.BoxGeometry(76, 5.2, 0.2), this.materials.glass);
    glass.position.set(x, 5.4, z - 12.8);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(88, 1.2, 22), this.materials.trim);
    roof.position.set(x, 10.8, centerZ);
    this.group.add(terminal, glass, roof);
    this.registerSolidBox(`airport-terminal-${x}-${z}`, x, centerZ, 80, 17.2, 0, 11.2);
    [x - 32, x, x + 32].forEach((gateX) => this.addBusStop(gateX, z - 8));
  }

  addAirplane(x, z) {
    const airplane = new THREE.Group();
    const whiteMat = new THREE.MeshStandardMaterial({ color: '#f8fbff', roughness: 0.34, metalness: 0.14 });
    const stripeMat = new THREE.MeshStandardMaterial({ color: '#caa76a', roughness: 0.24, metalness: 0.42 });
    const darkMat = this.materials.dark;
    const glassMat = this.materials.glass;

    const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 4.7, 56, 24), whiteMat);
    fuselage.rotation.z = Math.PI * 0.5;
    fuselage.position.y = 8;
    const nose = new THREE.Mesh(new THREE.SphereGeometry(4.45, 24, 12), whiteMat);
    nose.scale.x = 1.25;
    nose.position.set(30, 8, 0);
    const tailCone = new THREE.Mesh(new THREE.ConeGeometry(4.5, 10, 24), whiteMat);
    tailCone.rotation.z = -Math.PI * 0.5;
    tailCone.position.set(-33, 8, 0);
    airplane.add(fuselage, nose, tailCone);

    const cockpit = new THREE.Mesh(new THREE.BoxGeometry(5.6, 1.4, 3.8), glassMat);
    cockpit.position.set(30.5, 10.4, 0);
    cockpit.rotation.z = -0.18;
    airplane.add(cockpit);

    const wingGeo = new THREE.BoxGeometry(34, 0.55, 9);
    [-1, 1].forEach((side) => {
      const wing = new THREE.Mesh(wingGeo, whiteMat);
      wing.position.set(2, 7.3, side * 10.5);
      wing.rotation.y = side * 0.18;
      airplane.add(wing);
      const engine = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.45, 4.2, 16), darkMat);
      engine.rotation.x = Math.PI * 0.5;
      engine.position.set(5, 5.9, side * 14.4);
      airplane.add(engine);
    });

    const tail = new THREE.Mesh(new THREE.BoxGeometry(1.1, 10.5, 7), whiteMat);
    tail.position.set(-27, 13.4, 0);
    tail.rotation.z = -0.16;
    const tailWing = new THREE.Mesh(new THREE.BoxGeometry(13, 0.45, 5.4), whiteMat);
    tailWing.position.set(-27, 10, 0);
    airplane.add(tail, tailWing);

    const stripe = new THREE.Mesh(new THREE.BoxGeometry(48, 0.22, 0.32), stripeMat);
    stripe.position.set(0, 8.25, 4.72);
    airplane.add(stripe);
    for (let i = -9; i <= 9; i += 1) {
      const window = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 6), glassMat);
      window.position.set(i * 2.35, 9.2, 4.46);
      airplane.add(window);
    }
    [-18, 14, 24].forEach((px) => {
      const gear = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 3.2, 8), darkMat);
      gear.position.set(px, 4.0, 0);
      const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.18, 8, 16), darkMat);
      wheel.position.set(px, 2.5, 0);
      wheel.rotation.y = Math.PI * 0.5;
      airplane.add(gear, wheel);
    });

    airplane.position.set(x, 0, z);
    airplane.rotation.y = Math.PI * 0.02;
    airplane.scale.setScalar(1.25);
    this.group.add(airplane);
    this.registerSolidBox(`airplane-fuselage-${x}-${z}`, x, z, 78, 8.8, airplane.rotation.y, 14);
    this.registerSolidBox(`airplane-left-wing-${x}-${z}`, x + 2, z + 14.2, 38, 9.4, airplane.rotation.y + 0.18, 9);
    this.registerSolidBox(`airplane-right-wing-${x}-${z}`, x + 2, z - 14.2, 38, 9.4, airplane.rotation.y - 0.18, 9);
    this.registerSolidBox(`airplane-tail-${x}-${z}`, x - 34, z, 13.5, 9.8, airplane.rotation.y, 18);
    this.registerSolidBox(`airplane-left-engine-${x}-${z}`, x + 5, z + 18, 5.2, 3.4, airplane.rotation.y, 7.5);
    this.registerSolidBox(`airplane-right-engine-${x}-${z}`, x + 5, z - 18, 5.2, 3.4, airplane.rotation.y, 7.5);
  }

  addPlaza(x, z) {
    const plaza = new THREE.Mesh(new THREE.BoxGeometry(28, 0.04, 20), this.materials.sidewalk);
    plaza.position.set(x, 0.08, z);
    this.group.add(plaza);
    this.addFountain(x, z);
  }

  addParkingBay(x, z, rotation = 0) {
    const bay = new THREE.Mesh(new THREE.BoxGeometry(11, 0.02, 6), this.materials.sidewalk);
    bay.position.set(x, 0.09, z);
    bay.rotation.y = rotation;
    this.group.add(bay);
    for (let i = -1; i <= 1; i += 1) {
      const line = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 5.4), this.materials.lane);
      line.position.set(x + i * 3.4, 0.11, z);
      line.rotation.y = rotation;
      this.group.add(line);
    }
  }

  addParkGate(x, z) {
    [-1, 1].forEach((side) => {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(1.1, 4.4, 1.1), this.materials.trim);
      pillar.position.set(x + side * 6, 2.2, z - 6);
      this.group.add(pillar);
      this.registerSolidBox(`park-gate-${side}-${x}-${z}`, x + side * 6, z - 6, 1.4, 1.4, 0, 4.8);
    });
    const sign = this.createTextBoard('PARK LOOP', 'Scenic drive', 7.8, 1.7);
    sign.position.set(x, 5.1, z - 6);
    this.group.add(sign);
  }

  addWalkingPath(x, z, width, height) {
    const path = new THREE.Mesh(new THREE.TorusGeometry(1, 0.02, 8, 80), this.materials.sidewalk);
    path.scale.set(width, 1, height);
    path.rotation.x = Math.PI * 0.5;
    path.position.set(x, 0.1, z);
    this.group.add(path);
  }

  addMarketGate(x, z) {
    [-1, 1].forEach((side) => {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5, 1.2), this.materials.trim);
      pillar.position.set(x + side * 7, 2.5, z);
      this.group.add(pillar);
      this.registerSolidBox(`market-gate-${side}-${x}-${z}`, x + side * 7, z, 1.5, 1.5, 0, 5.4);
    });
    const top = this.createTextBoard('MARKET GATE', 'Shop street', 8, 1.7);
    top.position.set(x, 5.5, z);
    this.group.add(top);
  }

  addLocalSquare(x, z) {
    const square = new THREE.Mesh(new THREE.BoxGeometry(26, 0.04, 22), this.materials.sidewalk);
    square.position.set(x, 0.08, z + 20);
    this.group.add(square);
    this.addStatue(x, z + 20);
  }

  addContainer(x, z, material) {
    if (this.overlapsRoadClearance(x, z, 10.6, 4.8, 0, 2.0)) return false;
    const container = new THREE.Mesh(new THREE.BoxGeometry(10, 3.2, 4.2), material);
    container.position.set(x, 1.6, z);
    container.castShadow = true;
    this.group.add(container);
    this.registerSolidBox(`container-${x}-${z}`, x, z, 10.6, 4.8, 0, 3.6);
    return true;
  }

  addCityHall(x, z) {
    const base = new THREE.Mesh(new THREE.BoxGeometry(16, 7, 10), this.materials.white);
    base.position.set(x, 3.5, z);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(18, 1.1, 11.4), this.materials.trim);
    roof.position.set(x, 7.6, z);
    const columns = new THREE.Group();
    for (let i = -2; i <= 2; i += 1) {
      const column = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 4.4, 12), this.materials.trim);
      column.position.set(x + i * 2.2, 2.5, z - 5.25);
      columns.add(column);
    }
    this.group.add(base, roof, columns);
    this.registerSolidBox(`city-hall-${x}-${z}`, x, z, 18.5, 12.2, 0, 8.4);
  }

  addViewpoint(x, z) {
    const deck = new THREE.Mesh(new THREE.CylinderGeometry(7.8, 8.5, 0.55, 28), this.materials.sidewalk);
    deck.position.set(x, 0.76, z);
    deck.receiveShadow = true;
    const marker = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 5.2, 16), this.materials.trim);
    marker.position.set(x + 1.8, 3.2, z - 1.5);
    const top = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 10), this.materials.glass);
    top.position.set(x + 1.8, 6.1, z - 1.5);
    this.group.add(deck, marker, top);
    this.registerSolidBox(`viewpoint-deck-${x}-${z}`, x, z, 16.5, 16.5, 0, 1.4);
    this.registerSolidBox(`viewpoint-marker-${x}-${z}`, x + 1.8, z - 1.5, 1.2, 1.2, 0, 6.4);
    for (let i = 0; i < 12; i += 1) {
      const angle = (i / 12) * Math.PI * 2;
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.72, 0.14), this.materials.white);
      post.position.set(x + Math.cos(angle) * 7.5, 1.22, z + Math.sin(angle) * 7.5);
      this.group.add(post);
    }
  }

  addRooftopDetail(x, z, footprint, height) {
    const cap = new THREE.Mesh(new THREE.BoxGeometry(footprint * 0.64, 0.35, footprint * 0.48), this.materials.trim);
    cap.position.set(x, height + 0.22, z);
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 2.2, 8), this.materials.dark);
    antenna.position.set(x + footprint * 0.24, height + 1.45, z - footprint * 0.16);
    this.group.add(cap, antenna);
  }

  addFlowerBed(x, z) {
    const bed = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.18, 1.4), this.materials.trim);
    bed.position.set(x, 0.16, z);
    this.group.add(bed);
    for (let i = -2; i <= 2; i += 1) {
      const bloom = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 8, 6),
        new THREE.MeshStandardMaterial({ color: i % 2 ? '#f2c66b' : '#ffffff', roughness: 0.5 })
      );
      bloom.position.set(x + i * 0.72, 0.42, z);
      this.group.add(bloom);
    }
  }

  addBridgeSupports(x, z) {
    [-18, 0, 18].forEach((offset) => {
      const support = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.4, 1.2), this.materials.sidewalk);
      support.position.set(x + offset, 0.95, z);
      support.castShadow = true;
      this.group.add(support);
    });
  }

  addOverheadSign(x, z, text) {
    const arch = new THREE.Group();
    [-1, 1].forEach((side) => {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, 4.8, 0.16), this.materials.dark);
      post.position.set(side * 17.2, 2.4, 0);
      arch.add(post);
    });
    const beam = new THREE.Mesh(new THREE.BoxGeometry(35.2, 0.18, 0.18), this.materials.dark);
    beam.position.y = 4.7;
    arch.add(beam);
    const board = this.createTextBoard(text, 'Mini City Drive', 5.4, 1.5);
    board.position.y = 4.1;
    arch.add(board);
    arch.position.set(x, 0, z - 8.8);
    this.group.add(arch);
  }

  addAirportArea() {
    const runway = new THREE.Mesh(new THREE.BoxGeometry(164, 0.035, 12), this.materials.runway);
    runway.position.set(-360, 0.07, -252);
    runway.receiveShadow = true;
    this.group.add(runway);
    for (let i = -7; i <= 7; i += 1) {
      if (i % 2 === 0) {
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(5, 0.025, 0.5), this.materials.lane);
        stripe.position.set(-360 + i * 9, 0.11, -252);
        this.group.add(stripe);
      }
    }
    [-450, -420, -390].forEach((x) => {
      if (this.overlapsRoadClearance(x, -454, 24, 18, 0, 2.2)) return;
      const hangar = new THREE.Mesh(new THREE.BoxGeometry(24, 8.2, 18), this.materials.buildingB);
      hangar.position.set(x, 4.1, -454);
      const roof = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 24, 16, 1, false, 0, Math.PI), this.materials.trim);
      roof.rotation.z = Math.PI * 0.5;
      roof.position.set(x, 8.2, -454);
      this.group.add(hangar, roof);
      this.registerSolidBox(`hangar-${x}`, x, -454, 23.6, 17.4, 0, 9.2);
    });
    this.addOverheadSign(-360, -404, 'AIRPORT');
  }

  addDriveway(x, z) {
    const drive = new THREE.Mesh(new THREE.BoxGeometry(5, 0.035, 6), this.materials.sidewalk);
    drive.position.set(x, 0.06, z);
    this.group.add(drive);
  }

  addGarden(x, z) {
    const bushMat = new THREE.MeshStandardMaterial({ color: '#5f9f58', roughness: 0.86 });
    for (let i = 0; i < 3; i += 1) {
      const bush = new THREE.Mesh(new THREE.SphereGeometry(0.62, 10, 8), bushMat);
      bush.position.set(x + i * 1.1, 0.62, z + (i % 2) * 0.7);
      this.group.add(bush);
    }
  }

  addMarketStall(x, z) {
    if (this.overlapsRoadClearance(x, z, 3.6, 1.8, 0, 1.6)) return;
    const counter = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.0, 1.4), this.materials.white);
    counter.position.set(x, 0.5, z);
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.2, 1.8), this.materials.trim);
    canopy.position.set(x, 1.55, z);
    this.group.add(counter, canopy);
    this.registerSolidBox(`market-stall-${x}-${z}`, x, z, 3.4, 1.6, 0, 1.7, {
      type: COLLISION_TYPES.SOFT_PASSABLE,
      response: 'soft'
    });
  }

  addGuardrail(x, z, rotation) {
    const rail = new THREE.Group();
    const bar = new THREE.Mesh(new THREE.BoxGeometry(18, 0.18, 0.18), this.materials.white);
    bar.position.y = 0.9;
    rail.add(bar);
    for (let i = -4; i <= 4; i += 1) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.9, 0.16), this.materials.white);
      post.position.set(i * 2, 0.45, 0);
      rail.add(post);
    }
    rail.position.set(x, 0.1, z);
    rail.rotation.y = rotation;
    this.group.add(rail);
    this.registerSolidBox(`guardrail-${x}-${z}`, x, z, 18.2, 0.42, rotation, 1.4, {
      type: COLLISION_TYPES.SLIDE_SOLID,
      response: 'slide'
    });
  }

  addBusStop(x, z) {
    const roof = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.28, 2.2), this.materials.glass);
    roof.position.set(x, 2.8, z);
    const bench = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.32, 0.7), this.materials.trim);
    bench.position.set(x, 0.75, z);
    [-1, 1].forEach((side) => {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.5, 0.12), this.materials.dark);
      post.position.set(x + side * 2.45, 1.45, z - 0.8);
      this.group.add(post);
    });
    this.group.add(roof, bench);
  }

  addStreetLamp(x, z) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.6, 10), this.materials.dark);
    pole.position.set(x, 2.3, z);
    const lamp = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 12, 8),
      new THREE.MeshStandardMaterial({ color: '#fff6c2', emissive: '#fff2a8', emissiveIntensity: 0.32 })
    );
    lamp.position.set(x, 4.68, z + 0.2);
    this.group.add(pole, lamp);
  }

  addBillboard(x, z, title, subtitle) {
    const postA = new THREE.Mesh(new THREE.BoxGeometry(0.18, 3.6, 0.18), this.materials.dark);
    const postB = postA.clone();
    postA.position.set(x - 2.4, 1.8, z);
    postB.position.set(x + 2.4, 1.8, z);
    const sign = this.createTextBoard(title, subtitle, 6.8, 2.4);
    sign.position.set(x, 3.6, z);
    this.group.add(postA, postB, sign);
    this.registerSolidBox(`billboard-post-a-${x}-${z}`, x - 2.4, z, 0.5, 0.5, 0, 3.8);
    this.registerSolidBox(`billboard-post-b-${x}-${z}`, x + 2.4, z, 0.5, 0.5, 0, 3.8);
  }

  addSign(x, z, text) {
    const sign = this.createTextBoard(text, '', 3.8, 1.1);
    sign.position.set(x, 4.6, z);
    this.group.add(sign);
  }

  createTextBoard(title, subtitle, width, height) {
    const key = `${title}:${subtitle}`;
    if (!this.textures.has(key)) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 192;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff8ea';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#caa76a';
      ctx.lineWidth = 10;
      ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
      ctx.fillStyle = '#202938';
      ctx.font = '700 54px Segoe UI, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(title, canvas.width / 2, 82);
      if (subtitle) {
        ctx.fillStyle = '#7b6a45';
        ctx.font = '600 28px Segoe UI, sans-serif';
        ctx.fillText(subtitle, canvas.width / 2, 128);
      }
      this.textures.set(key, new THREE.CanvasTexture(canvas));
    }
    const material = new THREE.MeshBasicMaterial({ map: this.textures.get(key) });
    return new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  }

  addLandmarks() {
    this.landmarks.forEach((landmark) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(landmark.radius * 0.52, 0.09, 8, 44),
        new THREE.MeshBasicMaterial({ color: '#f1c764', transparent: true, opacity: 0.55 })
      );
      ring.rotation.x = Math.PI * 0.5;
      ring.position.set(landmark.position[0], 0.13, landmark.position[1]);
      this.group.add(ring);
    });
  }

  addCollectibles() {
    COLLECTIBLES.forEach((collectible, index) => {
      const coin = this.effectsManager.createCoinMesh();
      const position = collectible.position;
      const surfaceHeight = this.getSurfaceInfo(new THREE.Vector3(position[0], 0, position[1]), null, { preferElevated: true }).surfaceHeight ?? 0;
      coin.userData.baseY = surfaceHeight + 1.15;
      coin.position.set(position[0], coin.userData.baseY, position[1]);
      coin.userData.id = collectible.id ?? `coin-${index}`;
      coin.userData.value = collectible.value ?? 8;
      coin.userData.xp = collectible.xp ?? 1;
      coin.userData.type = collectible.type ?? 'cityCoin';
      coin.userData.oneTime = Boolean(collectible.oneTime);
      if (coin.userData.type !== 'cityCoin') {
        coin.scale.setScalar(1.28);
        coin.material = coin.material.clone();
        coin.material.color.set(coin.userData.type === 'hiddenWheel' ? '#ffffff' : '#f3c65f');
      }
      this.collectibles.push(coin);
      this.group.add(coin);
    });
  }

  addParkedCars() {
    const spots = [
      [-31, -50, Math.PI * 0.5, 0], [31, 50, -Math.PI * 0.5, 1],
      [-62, 75, 0, 5], [-2, 94, Math.PI, 2], [72, 22, Math.PI * 0.5, 4],
      [120, 45, -Math.PI * 0.5, 3], [-118, -77, Math.PI * 0.5, 1], [118, -99, -Math.PI * 0.5, 0],
      [-414, -324, Math.PI * 0.5, 2], [-362, -324, Math.PI * 0.5, 4], [-390, -404, 0, 5],
      [320, -370, -Math.PI * 0.5, 2], [390, -370, -Math.PI * 0.5, 4], [424, -290, Math.PI, 1],
      [178, 126, Math.PI * 0.5, 0], [218, 118, -Math.PI * 0.5, 3], [258, 82, Math.PI, 2],
      [-130, 182, Math.PI * 0.5, 5], [-72, 214, -Math.PI * 0.5, 0], [-28, 206, Math.PI, 1],
      [-174, 38, 0, 1], [-210, 92, Math.PI, 2], [-246, 54, Math.PI * 0.5, 4],
      [172, 250, Math.PI * 0.25, 3], [198, 284, Math.PI * 0.9, 5]
    ];
    spots.forEach(([x, z, heading, carIndex]) => {
      const car = this.vehicleFactory.createCarMesh(CAR_CONFIGS[carIndex], { preview: false });
      car.position.set(x, 0, z);
      car.rotation.y = heading;
      car.scale.setScalar(0.82);
      car.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this.group.add(car);
      const visual = CAR_CONFIGS[carIndex].visual;
      this.registerSolidBox(`parked-car-${x}-${z}`, x, z, visual.width * 0.72, visual.length * 0.8, heading, visual.height + visual.rideHeight + 0.35, {
        type: COLLISION_TYPES.HARD_SOLID,
        metadata: { parkedCar: true }
      });
    });
  }

  update(dt) {
    this.collectibles.forEach((coin, index) => {
      if (!coin.visible && coin.userData.respawnAt && performance.now() >= coin.userData.respawnAt) {
        coin.visible = true;
        coin.userData.respawnAt = 0;
      }
      if (!coin.visible) return;
      coin.rotation.y += dt * 2.6;
      coin.position.y = coin.userData.baseY + Math.sin(performance.now() * 0.003 + index) * 0.16;
    });
  }

  checkCollectibles(playerPosition, saveManager, audioManager, showToast) {
    this.collectibles.forEach((coin) => {
      if (!coin.visible) return;
      if (playerPosition.distanceTo(coin.position) < 2.0) {
        let collected = false;
        if (coin.userData.type === 'hiddenWheel' || coin.userData.type === 'landmarkToken') {
          collected = saveManager.collectHiddenToken(coin.userData.id, coin.userData.value, coin.userData.xp);
        } else {
          collected = saveManager.collectCoin(coin.userData.id, coin.userData.value, coin.userData.xp, coin.userData.oneTime);
        }
        if (collected) {
          coin.visible = false;
          if (!coin.userData.oneTime && coin.userData.type === 'cityCoin') {
            coin.userData.respawnAt = performance.now() + 45000;
          }
          audioManager.play('coin', 0.9);
          const label = coin.userData.type === 'cityCoin' ? 'city coins' : 'discovery token';
          showToast(`+${coin.userData.value} ${label}`);
        }
      }
    });
  }

  restoreCollected(saveManager) {
    this.collectibles.forEach((coin) => {
      const hiddenCollected = saveManager.data.discoveries.hiddenTokens[coin.userData.id];
      const coinCollected = saveManager.data.collectedCoins[coin.userData.id];
      coin.visible = !(coin.userData.oneTime && (hiddenCollected || coinCollected));
    });
  }

  checkLandmarks(playerPosition, saveManager, audioManager, showToast) {
    this.landmarks.forEach((landmark) => {
      const distance = vec2Distance([playerPosition.x, playerPosition.z], landmark.position);
      if (distance <= landmark.radius) {
        if (saveManager.discoverLandmark(landmark.id, landmark.reward, landmark.xp ?? 45)) {
          audioManager.play('checkpoint', 0.8);
          showToast(`${landmark.name} discovered +${landmark.reward}`);
        }
      }
    });
  }

  checkDistricts(playerPosition, saveManager, audioManager, showToast) {
    const zone = this.getZoneAt(playerPosition);
    if (zone.id !== this.currentZoneId) {
      this.currentZoneId = zone.id;
      showToast(zone.name);
      if (saveManager.discoverDistrict(zone.id, zone.reward ?? 12, zone.xp ?? 24)) {
        audioManager.play('checkpoint', 0.55);
        showToast(`${zone.name} mapped +${zone.reward}`);
      }
    }
  }

  getPathSurfaceMatch(position, currentSurfaceId = null, options = {}) {
    const preferElevated = Boolean(options.preferElevated);
    const currentPath = currentSurfaceId
      ? this.roadPaths.find((path) => currentSurfaceId === path.id || String(currentSurfaceId).startsWith(`${path.id}-`))
      : null;

    if (currentPath) {
      const match = this.projectPointToPath(currentPath, position, 2.8);
      if (match) return match;
    }

    let best = null;
    for (const path of this.roadPaths) {
      if (path === currentPath) continue;
      const match = this.projectPointToPath(path, position, 1.65);
      if (!match) continue;
      if (!preferElevated && !currentPath && match.surfaceHeight > 2.2) continue;
      if (!best
        || (path.priority ?? 0) > (best.path.priority ?? 0)
        || match.lateralDistance < best.lateralDistance) {
        best = match;
      }
    }
    return best;
  }

  projectPointToPath(path, position, padding = 1.5) {
    let best = null;
    for (const segment of path.segments) {
      const dx = segment.b.x - segment.a.x;
      const dz = segment.b.z - segment.a.z;
      const lenSq = dx * dx + dz * dz;
      if (lenSq < 0.01) continue;
      const tRaw = ((position.x - segment.a.x) * dx + (position.z - segment.a.z) * dz) / lenSq;
      const extra = padding / Math.max(1, segment.length);
      if (tRaw < -extra || tRaw > 1 + extra) continue;
      const t = THREE.MathUtils.clamp(tRaw, 0, 1);
      const nearestX = segment.a.x + dx * t;
      const nearestZ = segment.a.z + dz * t;
      const lateralDistance = Math.hypot(position.x - nearestX, position.z - nearestZ);
      if (lateralDistance > path.width * 0.5 + padding) continue;
      const surfaceHeight = THREE.MathUtils.lerp(segment.a.y, segment.b.y, t);
      if (!best || lateralDistance < best.lateralDistance) {
        best = {
          path,
          segment,
          t,
          surfaceHeight,
          lateralDistance,
          heading: segment.heading,
          slope: segment.slope,
          nearest: new THREE.Vector3(nearestX, surfaceHeight, nearestZ)
        };
      }
    }
    return best;
  }

  getSurfaceInfo(position, currentSurfaceId = null, options = {}) {
    const preferElevated = Boolean(options.preferElevated);
    const pathMatch = this.getPathSurfaceMatch(position, currentSurfaceId, options);
    const zone = this.getZoneAt(position);
    if (pathMatch) {
      const zoneName = CITY_ZONES.find((item) => item.id === pathMatch.path.zone)?.name ?? zone.name;
      return {
        offRoad: false,
        zoneName,
        speedFactor: WORLD_CONFIG.highwaySpeedFactor,
        gripFactor: 1,
        accelerationFactor: 1,
        surfaceHeight: pathMatch.surfaceHeight,
        surfaceId: pathMatch.path.id,
        surfaceType: pathMatch.path.type,
        elevated: pathMatch.surfaceHeight > 2.2,
        pathId: pathMatch.path.id,
        surfaceHeading: pathMatch.heading,
        surfaceSlope: pathMatch.slope
      };
    }

    let elevated = null;
    const currentRoute = currentSurfaceId
      ? this.elevatedRoutes.find((route) => route.id === currentSurfaceId)
      : null;
    if (currentRoute) {
      const local = this.getRouteLocal(currentRoute, position, 1.8);
      if (local.inside) {
        elevated = {
          route: currentRoute,
          surfaceHeight: this.getRouteHeightAtT(currentRoute, local.t)
        };
      }
    }
    for (const route of this.elevatedRoutes) {
      if (route === currentRoute && elevated) continue;
      const local = this.getRouteLocal(route, position);
      if (!local.inside) continue;
      const surfaceHeight = this.getRouteHeightAtT(route, local.t);
      if (!preferElevated && !currentRoute && surfaceHeight > 2.2) continue;
      if (!elevated
        || (route.priority ?? 0) > (elevated.route.priority ?? 0)
        || surfaceHeight > elevated.surfaceHeight) {
        elevated = { route, surfaceHeight };
      }
    }

    if (elevated) {
      const zoneName = CITY_ZONES.find((item) => item.id === elevated.route.zone)?.name ?? zone.name;
      return {
        offRoad: false,
        zoneName,
        speedFactor: WORLD_CONFIG.highwaySpeedFactor,
        gripFactor: 1,
        accelerationFactor: 1,
        surfaceHeight: elevated.surfaceHeight,
        surfaceId: elevated.route.id,
        surfaceType: elevated.route.kind,
        elevated: true
      };
    }

    let road = null;
    for (const segment of this.roadSegments) {
      const center = new THREE.Vector3(segment.center[0], 0, segment.center[1]);
      const size = new THREE.Vector3(segment.size[0], 0, segment.size[1]);
      if (pointInRotatedRect(position, center, size, segment.rotation)) {
        road = segment;
        break;
      }
    }

    if (road) {
      const zoneName = CITY_ZONES.find((item) => item.id === road.zone)?.name ?? zone.name;
      const fastRoad = road.roadClass === 'highway' || road.roadClass === 'bridge' || road.zone === 'highway';
      return {
        offRoad: false,
        zoneName,
        speedFactor: fastRoad ? WORLD_CONFIG.highwaySpeedFactor : road.roadClass === 'market' ? 0.92 : 1,
        gripFactor: 1,
        accelerationFactor: 1,
        surfaceHeight: road.elevation ?? 0,
        surfaceId: road.id,
        surfaceType: road.roadClass ?? 'road',
        elevated: false
      };
    }

    return {
      offRoad: true,
      zoneName: zone.name,
      speedFactor: 1,
      gripFactor: 1,
      accelerationFactor: 1,
      surfaceHeight: 0,
      surfaceId: zone.id,
      surfaceType: 'terrain',
      elevated: false
    };
  }

  getZoneAt(position) {
    let nearest = CITY_ZONES[0];
    let nearestDistance = Infinity;
    for (const zone of CITY_ZONES) {
      const inside = Math.abs(position.x - zone.center[0]) <= zone.size[0] * 0.5
        && Math.abs(position.z - zone.center[1]) <= zone.size[1] * 0.5;
      if (inside) return zone;
      const distance = Math.hypot(position.x - zone.center[0], position.z - zone.center[1]);
      if (distance < nearestDistance) {
        nearest = zone;
        nearestDistance = distance;
      }
    }
    return nearest;
  }
}
