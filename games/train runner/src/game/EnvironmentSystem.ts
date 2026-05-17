import * as THREE from 'three';
import { GAME_CONFIG } from './config';
import { pseudoRandom } from './math';
import { getRouteById } from './RouteConfig';
import type { BiomeId, RouteConfig } from './types';

interface Recyclable {
  object: THREE.Object3D;
  spacing: number;
}

export class EnvironmentSystem {
  readonly group = new THREE.Group();

  private readonly buildings: Recyclable[] = [];
  private readonly gantries: Recyclable[] = [];
  private readonly trackSegments: Recyclable[] = [];
  private readonly ambient = new THREE.AmbientLight(0xffffff, 0.3);
  private readonly hemi = new THREE.HemisphereLight(0xffffff, 0x17243a, 1.8);
  private readonly key = new THREE.DirectionalLight(0xffffff, 4);
  private readonly rim = new THREE.DirectionalLight(0xffffff, 1.4);
  private materials: Record<string, THREE.Material> = {};
  private biome: BiomeId = 'cyber';

  constructor(private readonly scene: THREE.Scene) {
    this.group.name = 'Route biome speed environment';
    this.scene.add(this.ambient, this.hemi, this.key, this.rim);
    this.configureLights();
    this.configureRoute(getRouteById('neon-express'));
  }

  configureRoute(route: RouteConfig): void {
    this.biome = route.biome;
    this.group.name = `${route.displayName} ${route.biome} biome`;
    this.clearEnvironment();
    this.materials = this.createMaterials(route.biome);
    this.setupAtmosphere(route);
    this.buildTrack();
    if (route.biome === 'desert') {
      this.buildDesertScenery();
    } else if (route.biome === 'snow') {
      this.buildSnowScenery();
    } else {
      this.buildCyberBuildings();
      this.buildGantries();
    }
    this.buildDistantGlow(route);
  }

  update(playerZ: number): void {
    this.recycle(this.trackSegments, playerZ, -90);
    this.recycle(this.buildings, playerZ, -150);
    this.recycle(this.gantries, playerZ, -95);
  }

  dispose(): void {
    this.clearEnvironment();
    this.scene.remove(this.ambient, this.hemi, this.key, this.rim);
  }

  private configureLights(): void {
    this.key.position.set(-5, 12, -7);
    this.key.castShadow = true;
    this.key.shadow.mapSize.set(2048, 2048);
    this.key.shadow.camera.near = 1;
    this.key.shadow.camera.far = 70;
    this.key.shadow.camera.left = -16;
    this.key.shadow.camera.right = 16;
    this.key.shadow.camera.top = 18;
    this.key.shadow.camera.bottom = -8;
    this.rim.position.set(7, 5, 10);
  }

  private setupAtmosphere(route: RouteConfig): void {
    if (route.biome === 'desert') {
      this.scene.background = new THREE.Color(0x8fc8d8);
      this.scene.fog = new THREE.Fog(0xd6a865, 58, 280);
      this.ambient.color.setHex(0xffd9a6);
      this.ambient.intensity = 0.42;
      this.hemi.color.setHex(0xffe4b2);
      this.hemi.groundColor.setHex(0x6c4a2d);
      this.hemi.intensity = 1.95;
      this.key.color.setHex(0xffe0aa);
      this.key.intensity = 4.4;
      this.rim.color.setHex(0xff9f55);
      this.rim.intensity = 1.35;
    } else if (route.biome === 'snow') {
      this.scene.background = new THREE.Color(0xbfdaf0);
      this.scene.fog = new THREE.Fog(0xcfe7ff, 46, 250);
      this.ambient.color.setHex(0xdff7ff);
      this.ambient.intensity = 0.5;
      this.hemi.color.setHex(0xf2fbff);
      this.hemi.groundColor.setHex(0x486274);
      this.hemi.intensity = 2.15;
      this.key.color.setHex(0xeaf8ff);
      this.key.intensity = 4.8;
      this.rim.color.setHex(0x70f7ff);
      this.rim.intensity = 1.6;
    } else {
      this.scene.background = GAME_CONFIG.world.skyColor;
      this.scene.fog = new THREE.Fog(GAME_CONFIG.world.fogColor, GAME_CONFIG.world.fogNear, GAME_CONFIG.world.fogFar);
      this.ambient.color.setHex(0x7bbcff);
      this.ambient.intensity = 0.32;
      this.hemi.color.setHex(0xb8e5ff);
      this.hemi.groundColor.setHex(0x17243a);
      this.hemi.intensity = 1.85;
      this.key.color.setHex(0xd8ecff);
      this.key.intensity = 4.1;
      this.rim.color.setHex(0xff93c9);
      this.rim.intensity = 1.75;
    }
  }

  private buildTrack(): void {
    const segmentLength = 34;
    const segmentCount = 18;

    for (let i = 0; i < segmentCount; i += 1) {
      const segment = new THREE.Group();
      segment.position.z = GAME_CONFIG.train.firstCoachStartZ - 55 + i * segmentLength;

      const ground = new THREE.Mesh(new THREE.BoxGeometry(18, 0.08, segmentLength), this.materials.ground);
      ground.position.y = -0.18;
      ground.receiveShadow = true;
      segment.add(ground);

      for (const side of [-1, 1]) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, segmentLength + 0.6), this.materials.rail);
        rail.position.set(side * 1.58, 0.03, 0);
        rail.castShadow = true;
        rail.receiveShadow = true;
        segment.add(rail);

        const routeGlow = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.03, segmentLength), this.materials.trackGlow);
        routeGlow.position.set(side * 2.25, 0.09, 0);
        segment.add(routeGlow);
      }

      for (let s = 0; s < 15; s += 1) {
        const sleeper = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.08, 0.18), this.materials.sleeper);
        sleeper.position.set(0, -0.01, -segmentLength * 0.5 + s * 2.35);
        sleeper.receiveShadow = true;
        segment.add(sleeper);
      }

      this.group.add(segment);
      this.trackSegments.push({ object: segment, spacing: segmentLength * segmentCount });
    }
  }

  private buildCyberBuildings(): void {
    const count = 84;
    const range = 420;

    for (let i = 0; i < count; i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      const group = new THREE.Group();
      const width = THREE.MathUtils.lerp(4, 12, pseudoRandom(i + 1.1));
      const depth = THREE.MathUtils.lerp(5, 16, pseudoRandom(i + 2.3));
      const height = THREE.MathUtils.lerp(10, 58, pseudoRandom(i + 4.8));
      const distance = THREE.MathUtils.lerp(12, 42, pseudoRandom(i + 7.5));

      group.position.set(side * distance, height * 0.5 - 0.35, GAME_CONFIG.train.firstCoachStartZ - 120 + pseudoRandom(i) * range);
      group.add(this.box(width, height, depth, this.materials.building));

      const stripCount = 2 + Math.floor(pseudoRandom(i + 5.5) * 4);
      for (let s = 0; s < stripCount; s += 1) {
        const strip = this.box(0.08, height * 0.68, 0.04, pseudoRandom(i + s) > 0.5 ? this.materials.neonBlue : this.materials.neonPink);
        strip.position.set(side * (-width * 0.5 - 0.05), 0, -depth * 0.35 + (s / Math.max(1, stripCount - 1)) * depth * 0.7);
        group.add(strip);
      }

      this.group.add(group);
      this.buildings.push({ object: group, spacing: range });
    }
  }

  private buildDesertScenery(): void {
    const range = 430;
    for (let i = 0; i < 72; i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      const group = new THREE.Group();
      const distance = THREE.MathUtils.lerp(10, 48, pseudoRandom(i + 3));
      group.position.set(side * distance, -0.05, GAME_CONFIG.train.firstCoachStartZ - 120 + pseudoRandom(i + 9) * range);

      const rockCount = 1 + Math.floor(pseudoRandom(i + 4) * 3);
      for (let r = 0; r < rockCount; r += 1) {
        const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(THREE.MathUtils.lerp(0.9, 3.2, pseudoRandom(i + r)), 0), this.materials.rock);
        rock.position.set(THREE.MathUtils.randFloatSpread(8), rock.scale.y * 0.2, THREE.MathUtils.randFloatSpread(9));
        rock.scale.y = THREE.MathUtils.lerp(0.45, 1.25, pseudoRandom(i + r + 7));
        rock.castShadow = true;
        rock.receiveShadow = true;
        group.add(rock);
      }

      if (pseudoRandom(i + 12) > 0.55) {
        const post = this.box(0.18, 3.2, 0.18, this.materials.infrastructure);
        post.position.y = 1.5;
        const sign = this.box(2.2, 0.5, 0.12, this.materials.neonAmber);
        sign.position.y = 2.7;
        group.add(post, sign);
      }

      this.group.add(group);
      this.buildings.push({ object: group, spacing: range });
    }
  }

  private buildSnowScenery(): void {
    const range = 430;
    for (let i = 0; i < 64; i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      const group = new THREE.Group();
      const distance = THREE.MathUtils.lerp(16, 58, pseudoRandom(i + 13));
      const height = THREE.MathUtils.lerp(7, 28, pseudoRandom(i + 18));
      group.position.set(side * distance, height * 0.35 - 0.2, GAME_CONFIG.train.firstCoachStartZ - 130 + pseudoRandom(i + 21) * range);

      const mountain = new THREE.Mesh(new THREE.ConeGeometry(THREE.MathUtils.lerp(4, 12, pseudoRandom(i + 1)), height, 4), this.materials.mountain);
      mountain.rotation.y = Math.PI * 0.25;
      mountain.castShadow = true;
      mountain.receiveShadow = true;
      group.add(mountain);

      if (pseudoRandom(i + 5) > 0.45) {
        const icePillar = this.box(0.35, THREE.MathUtils.lerp(2, 6, pseudoRandom(i + 6)), 0.35, this.materials.neonBlue);
        icePillar.position.set(THREE.MathUtils.randFloatSpread(6), 1.6, THREE.MathUtils.randFloatSpread(5));
        group.add(icePillar);
      }

      this.group.add(group);
      this.buildings.push({ object: group, spacing: range });
    }

    for (let i = 0; i < 30; i += 1) {
      const gantry = new THREE.Group();
      gantry.position.z = GAME_CONFIG.train.firstCoachStartZ - 45 + i * 17;
      const arch = this.box(8.8, 0.18, 0.18, this.materials.infrastructure);
      arch.position.y = 5.2;
      gantry.add(arch);
      for (const side of [-1, 1]) {
        const pole = this.box(0.16, 5.3, 0.16, this.materials.infrastructure);
        pole.position.set(side * 4.35, 2.55, 0);
        gantry.add(pole);
      }
      this.group.add(gantry);
      this.gantries.push({ object: gantry, spacing: 30 * 17 });
    }
  }

  private buildGantries(): void {
    const count = 28;
    const spacing = 18;

    for (let i = 0; i < count; i += 1) {
      const gantry = new THREE.Group();
      gantry.position.z = GAME_CONFIG.train.firstCoachStartZ - 45 + i * spacing;

      for (const side of [-1, 1]) {
        const pole = this.box(0.16, 7, 0.16, this.materials.infrastructure);
        pole.position.set(side * 5.25, 3.1, 0);
        gantry.add(pole);
      }

      const cross = this.box(10.8, 0.18, 0.18, this.materials.infrastructure);
      cross.position.y = 6.55;
      const scanLight = this.box(2.4, 0.05, 0.1, this.materials.neonBlue);
      scanLight.position.y = 6.25;
      gantry.add(cross, scanLight);

      this.group.add(gantry);
      this.gantries.push({ object: gantry, spacing: count * spacing });
    }
  }

  private buildDistantGlow(route: RouteConfig): void {
    const sunColor = route.biome === 'desert' ? 0xffc26f : route.biome === 'snow' ? 0xeaf8ff : 0xaee9ff;
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(route.biome === 'desert' ? 18 : 12, 32, 16),
      new THREE.MeshBasicMaterial({ color: sunColor, transparent: true, opacity: route.biome === 'cyber' ? 0.28 : 0.42 })
    );
    sun.position.set(-48, 44, 110);
    this.group.add(sun);

    for (let i = 0; i < 16; i += 1) {
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(THREE.MathUtils.randFloat(14, 34), THREE.MathUtils.randFloat(1.8, 4.5)),
        i % 2 === 0 ? this.materials.hazeBlue : this.materials.hazePink
      );
      plane.position.set(THREE.MathUtils.randFloatSpread(88), THREE.MathUtils.randFloat(8, 30), -80 + i * 25);
      plane.rotation.y = Math.PI;
      this.group.add(plane);
    }
  }

  private box(width: number, height: number, depth: number, material: THREE.Material): THREE.Mesh {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  private recycle(items: Recyclable[], playerZ: number, behind: number): void {
    for (const item of items) {
      while (item.object.position.z < playerZ + behind) {
        item.object.position.z += item.spacing;
      }
    }
  }

  private clearEnvironment(): void {
    this.group.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
    });
    this.group.clear();
    Object.values(this.materials).forEach((material) => material.dispose());
    this.materials = {};
    this.buildings.length = 0;
    this.gantries.length = 0;
    this.trackSegments.length = 0;
  }

  private createMaterials(biome: BiomeId): Record<string, THREE.Material> {
    const desert = biome === 'desert';
    const snow = biome === 'snow';
    return {
      ground: new THREE.MeshStandardMaterial({ color: desert ? 0xc9904d : snow ? 0xe6f4ff : 0x122136, roughness: 0.78, metalness: 0.12 }),
      rail: new THREE.MeshStandardMaterial({ color: snow ? 0xd8e7f2 : 0xb8c6d4, roughness: 0.36, metalness: 0.82 }),
      sleeper: new THREE.MeshStandardMaterial({ color: desert ? 0x7b5532 : snow ? 0x93a8b7 : 0x263246, roughness: 0.68, metalness: 0.3 }),
      trackGlow: new THREE.MeshBasicMaterial({ color: desert ? 0xffb454 : snow ? 0x9ddcff : 0x64f0ff, transparent: true, opacity: 0.5 }),
      building: new THREE.MeshStandardMaterial({ color: 0x1e2d45, roughness: 0.46, metalness: 0.42 }),
      rock: new THREE.MeshStandardMaterial({ color: 0x9b6538, roughness: 0.82, metalness: 0.04 }),
      mountain: new THREE.MeshStandardMaterial({ color: 0xc9dbe9, roughness: 0.72, metalness: 0.08 }),
      infrastructure: new THREE.MeshStandardMaterial({ color: snow ? 0xcfe0ec : desert ? 0x9d7c5d : 0x92a9bc, roughness: 0.4, metalness: 0.68 }),
      neonBlue: new THREE.MeshBasicMaterial({ color: snow ? 0xdffcff : 0x38e8ff }),
      neonPink: new THREE.MeshBasicMaterial({ color: desert ? 0xff7a2d : 0xff4fc3 }),
      neonAmber: new THREE.MeshBasicMaterial({ color: 0xffb454 }),
      hazeBlue: new THREE.MeshBasicMaterial({
        color: snow ? 0xdffcff : desert ? 0xffd299 : 0x38e8ff,
        transparent: true,
        opacity: desert ? 0.14 : 0.18,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      }),
      hazePink: new THREE.MeshBasicMaterial({
        color: desert ? 0xff9f55 : snow ? 0x9ddcff : 0xff4fc3,
        transparent: true,
        opacity: 0.14,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    };
  }
}
