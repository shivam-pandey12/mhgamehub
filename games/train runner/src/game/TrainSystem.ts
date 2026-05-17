import * as THREE from 'three';
import { COACH_BLUEPRINTS, GAME_CONFIG } from './config';
import { chooseFrom, pseudoRandom } from './math';
import type { CoachCollider, CoachType, GapInfo, RouteConfig, SurfaceHit } from './types';

type Blueprint = (typeof COACH_BLUEPRINTS)[number];

export class TrainSystem {
  readonly group = new THREE.Group();
  readonly coaches: CoachCollider[] = [];

  private readonly materials: Record<string, THREE.Material>;
  private readonly geometries = {
    panel: new THREE.BoxGeometry(1, 1, 1),
    wheel: new THREE.CylinderGeometry(0.34, 0.34, 0.22, 18),
    vent: new THREE.BoxGeometry(0.8, 0.18, 1.25),
    pipe: new THREE.CylinderGeometry(0.045, 0.045, 1, 8),
    ladder: new THREE.BoxGeometry(0.08, 0.08, 1),
    light: new THREE.BoxGeometry(0.18, 0.08, 0.36)
  };
  private variantAccentMaterial: THREE.Material | null = null;
  private variantTrimMaterial: THREE.Material | null = null;

  constructor() {
    this.group.name = 'High speed procedural train';
    this.materials = this.createMaterials();
    this.buildInitialTrain();
  }

  configureRoute(route: RouteConfig, trainPaintColor?: number): void {
    this.group.name = `${route.displayName} ${route.trainVariant} train`;
    this.variantAccentMaterial?.dispose();
    this.variantTrimMaterial?.dispose();
    const primary = trainPaintColor ?? route.theme.primary;
    this.variantAccentMaterial = new THREE.MeshStandardMaterial({
      color: primary,
      emissive: primary,
      emissiveIntensity: route.biome === 'desert' ? 0.45 : 0.9,
      roughness: 0.38,
      metalness: 0.52
    });
    this.variantTrimMaterial = new THREE.MeshStandardMaterial({
      color: route.theme.secondary,
      emissive: route.biome === 'snow' ? route.theme.primary : route.theme.secondary,
      emissiveIntensity: route.biome === 'desert' ? 0.2 : 0.55,
      roughness: 0.5,
      metalness: 0.4
    });

    for (const coach of this.coaches) {
      this.removeVariantAccent(coach.group);
      this.addVariantAccent(coach, route);
    }
  }

  update(playerZ: number): void {
    this.recyclePassedCoaches(playerZ);
  }

  getSurfaceAt(x: number, z: number): SurfaceHit | null {
    for (const coach of this.coaches) {
      if (z >= coach.startZ && z <= coach.endZ && Math.abs(x) <= coach.walkableWidth * 0.5) {
        return {
          coach,
          roofY: coach.roofY,
          edgeDistance: coach.walkableWidth * 0.5 - Math.abs(x)
        };
      }
    }

    return null;
  }

  getLateralBoundsCoach(z: number): CoachCollider | null {
    for (let i = 0; i < this.coaches.length; i += 1) {
      const coach = this.coaches[i];
      if (z >= coach.startZ && z <= coach.endZ) {
        return coach;
      }

      const next = this.coaches[i + 1];
      if (next && z > coach.endZ && z < next.startZ) {
        return coach.walkableWidth <= next.walkableWidth ? coach : next;
      }
    }

    return null;
  }

  getUpcomingGap(z: number): GapInfo | null {
    for (let i = 0; i < this.coaches.length - 1; i += 1) {
      const current = this.coaches[i];
      const next = this.coaches[i + 1];

      if (z <= current.endZ) {
        return {
          distance: current.endZ - z,
          length: next.startZ - current.endZ,
          startZ: current.endZ,
          endZ: next.startZ
        };
      }
    }

    return null;
  }

  getSafeSpawn(): { position: THREE.Vector3; coach: CoachCollider } {
    const coach = this.coaches[0];
    return {
      coach,
      position: new THREE.Vector3(GAME_CONFIG.player.startX, coach.roofY, coach.startZ + 5)
    };
  }

  dispose(): void {
    this.group.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
    });

    Object.values(this.materials).forEach((material) => material.dispose());
    Object.values(this.geometries).forEach((geometry) => geometry.dispose());
    this.variantAccentMaterial?.dispose();
    this.variantTrimMaterial?.dispose();
  }

  private removeVariantAccent(group: THREE.Group): void {
    const accents = group.children.filter((child) => child.name === 'route-variant-accent');
    for (const accent of accents) {
      accent.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) {
          mesh.geometry.dispose();
        }
      });
      accent.removeFromParent();
    }
  }

  private addVariantAccent(coach: CoachCollider, route: RouteConfig): void {
    if (!this.variantAccentMaterial || !this.variantTrimMaterial) {
      return;
    }

    const accent = new THREE.Group();
    accent.name = 'route-variant-accent';

    const length = coach.length;
    const roofY = coach.roofY;
    const roofStripe = new THREE.Mesh(new THREE.BoxGeometry(coach.walkableWidth - 0.8, 0.045, length - 3.4), this.variantAccentMaterial);
    roofStripe.position.y = roofY + 0.055;
    roofStripe.receiveShadow = true;
    accent.add(roofStripe);

    for (const side of [-1, 1]) {
      const sideStripe = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.08, length - 1.2), this.variantTrimMaterial);
      sideStripe.position.set(side * (coach.width * 0.5 + 0.06), roofY - 1.28, 0);
      accent.add(sideStripe);
    }

    if (route.trainVariant === 'desertCargo') {
      for (let i = 0; i < 4; i += 1) {
        const dustyPanel = new THREE.Mesh(new THREE.BoxGeometry(coach.walkableWidth * 0.62, 0.055, 0.38), this.variantTrimMaterial);
        dustyPanel.position.set(0, roofY + 0.09, -length * 0.35 + i * (length * 0.22));
        accent.add(dustyPanel);
      }
    } else if (route.trainVariant === 'snowArmored') {
      for (let i = 0; i < 5; i += 1) {
        const frostPlate = new THREE.Mesh(new THREE.BoxGeometry(coach.walkableWidth - 0.55, 0.075, 0.18), this.variantTrimMaterial);
        frostPlate.position.set(0, roofY + 0.12, -length * 0.4 + i * (length * 0.2));
        accent.add(frostPlate);
      }
    }

    coach.group.add(accent);
  }

  private buildInitialTrain(): void {
    let cursor = GAME_CONFIG.train.firstCoachStartZ;

    for (let i = 0; i < GAME_CONFIG.train.coachCount; i += 1) {
      const blueprint = chooseFrom(COACH_BLUEPRINTS, i);
      const length = blueprint.length + (pseudoRandom(i + 0.34) - 0.5) * 1.4;
      const gap = this.getGapForIndex(i);
      const coach = this.createCoach(i, cursor, length, blueprint);
      this.coaches.push(coach);
      this.group.add(coach.group);
      cursor = coach.endZ + gap;
    }
  }

  private createCoach(index: number, startZ: number, length: number, blueprint: Blueprint): CoachCollider {
    const width = GAME_CONFIG.train.defaultWidth + (blueprint.type === 'armored' ? 0.22 : 0);
    const roofY = blueprint.height + 0.22;
    const endZ = startZ + length;
    const group = new THREE.Group();
    group.name = `${blueprint.type}-coach-${index}`;
    group.position.z = (startZ + endZ) * 0.5;

    this.addCoachBody(group, blueprint, width, length);
    this.addWindowsAndPanels(group, blueprint, width, length, index);
    this.addRoofDetails(group, blueprint, width, length, index);
    this.addUndercarriage(group, blueprint, width, length);
    this.addLaddersAndCouplers(group, blueprint, width, length);

    return {
      id: index,
      type: blueprint.type as CoachType,
      startZ,
      endZ,
      length,
      width,
      walkableWidth: width - GAME_CONFIG.train.walkableInset,
      roofY,
      group
    };
  }

  private addCoachBody(group: THREE.Group, blueprint: Blueprint, width: number, length: number): void {
    const bodyMaterial = this.createCoachPaint(blueprint);
    const body = new THREE.Mesh(new THREE.BoxGeometry(width, blueprint.height, length), bodyMaterial);
    body.position.y = blueprint.height * 0.5;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(width - 0.38, 0.24, length - 0.8),
      this.materials.roof
    );
    roof.position.y = blueprint.height + 0.12;
    roof.castShadow = true;
    roof.receiveShadow = true;
    group.add(roof);

    const walkway = new THREE.Mesh(
      new THREE.BoxGeometry(width - 1.04, 0.05, length - 1.65),
      this.materials.walkway
    );
    walkway.position.y = blueprint.height + 0.265;
    walkway.castShadow = false;
    walkway.receiveShadow = true;
    group.add(walkway);

    for (const side of [-1, 1]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.18, length - 1.2), this.materials.edge);
      rail.position.set(side * (width * 0.5 - 0.22), blueprint.height + 0.4, 0);
      rail.castShadow = true;
      group.add(rail);
    }
  }

  private addWindowsAndPanels(
    group: THREE.Group,
    blueprint: Blueprint,
    width: number,
    length: number,
    index: number
  ): void {
    const windowCount = blueprint.type === 'cargo' ? 5 : 9;
    const spacing = length / (windowCount + 1);

    for (const side of [-1, 1]) {
      for (let i = 0; i < windowCount; i += 1) {
        const z = -length * 0.5 + spacing * (i + 1);
        const isCargoDoor = blueprint.type === 'cargo' && i % 2 === 0;
        const windowMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.04, isCargoDoor ? 0.86 : 0.48, isCargoDoor ? 1.35 : 0.92),
          isCargoDoor ? this.materials.panelDark : this.materials.window
        );
        windowMesh.position.set(side * (width * 0.5 + 0.024), blueprint.height * 0.58, z);
        windowMesh.castShadow = false;
        group.add(windowMesh);
      }

      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.08, length - 1.1), this.materials.neonCyan);
      stripe.position.set(side * (width * 0.5 + 0.04), blueprint.height * 0.85, 0);
      group.add(stripe);
    }

    const panelCount = 7;
    for (let i = 0; i < panelCount; i += 1) {
      const z = -length * 0.5 + (length / panelCount) * (i + 0.5);
      const panel = new THREE.Mesh(new THREE.BoxGeometry(width + 0.04, 0.035, 0.035), this.materials.panelLine);
      panel.position.set(0, blueprint.height * (0.25 + pseudoRandom(index + i) * 0.42), z);
      group.add(panel);
    }
  }

  private addRoofDetails(group: THREE.Group, blueprint: Blueprint, width: number, length: number, index: number): void {
    const detailCount = blueprint.type === 'passenger' ? 4 : 3;

    for (let i = 0; i < detailCount; i += 1) {
      const z = -length * 0.42 + (length * 0.84 * i) / Math.max(1, detailCount - 1);
      const vent = new THREE.Mesh(this.geometries.vent, this.materials.vent);
      const sx = 0.8 + pseudoRandom(index * 3 + i) * 0.55;
      const sz = 1.1 + pseudoRandom(index * 7 + i) * 0.9;
      vent.scale.set(sx, 1, sz);
      vent.position.set((pseudoRandom(index + i * 10) - 0.5) * 0.7, blueprint.height + 0.42, z);
      vent.castShadow = true;
      vent.receiveShadow = true;
      group.add(vent);
    }

    for (const side of [-1, 1]) {
      const pipe = new THREE.Mesh(this.geometries.pipe, this.materials.pipe);
      pipe.rotation.x = Math.PI * 0.5;
      pipe.scale.z = length - 2.2;
      pipe.position.set(side * (width * 0.5 - 0.74), blueprint.height + 0.46, 0);
      pipe.castShadow = true;
      group.add(pipe);
    }

    if (blueprint.type === 'armored' || blueprint.type === 'tall') {
      for (let i = 0; i < 5; i += 1) {
        const shield = new THREE.Mesh(new THREE.BoxGeometry(width - 0.75, 0.08, 0.22), this.materials.armoredPlate);
        shield.position.set(0, blueprint.height + 0.53, -length * 0.38 + i * (length * 0.19));
        shield.castShadow = true;
        group.add(shield);
      }
    }
  }

  private addUndercarriage(group: THREE.Group, blueprint: Blueprint, width: number, length: number): void {
    const bogieZ = [-length * 0.34, length * 0.34];

    for (const z of bogieZ) {
      const bogie = new THREE.Mesh(new THREE.BoxGeometry(width - 0.7, 0.38, 1.7), this.materials.undercarriage);
      bogie.position.set(0, 0.34, z);
      bogie.castShadow = true;
      group.add(bogie);

      for (const side of [-1, 1]) {
        for (const offset of [-0.42, 0.42]) {
          const wheel = new THREE.Mesh(this.geometries.wheel, this.materials.wheel);
          wheel.rotation.z = Math.PI * 0.5;
          wheel.position.set(side * (width * 0.5 - 0.52), 0.22, z + offset);
          wheel.castShadow = true;
          group.add(wheel);
        }
      }
    }

    const belly = new THREE.Mesh(new THREE.BoxGeometry(width - 1.2, 0.16, length - 2.4), this.materials.undercarriage);
    belly.position.y = 0.72;
    belly.castShadow = true;
    group.add(belly);
  }

  private addLaddersAndCouplers(group: THREE.Group, blueprint: Blueprint, width: number, length: number): void {
    for (const zSide of [-1, 1]) {
      const coupler = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.32, 0.72), this.materials.undercarriage);
      coupler.position.set(0, 0.72, zSide * (length * 0.5 + 0.34));
      coupler.castShadow = true;
      group.add(coupler);

      const endLight = new THREE.Mesh(this.geometries.light, this.materials.neonAmber);
      endLight.position.set(-width * 0.28, blueprint.height * 0.68, zSide * (length * 0.5 + 0.025));
      group.add(endLight);
    }

    for (const side of [-1, 1]) {
      const ladderZ = -length * 0.5 + 1.1;
      const railA = new THREE.Mesh(this.geometries.ladder, this.materials.edge);
      const railB = new THREE.Mesh(this.geometries.ladder, this.materials.edge);
      railA.scale.set(1, 1, blueprint.height * 0.76);
      railB.scale.set(1, 1, blueprint.height * 0.76);
      railA.rotation.x = Math.PI * 0.5;
      railB.rotation.x = Math.PI * 0.5;
      railA.position.set(side * (width * 0.5 + 0.09), blueprint.height * 0.48, ladderZ - 0.18);
      railB.position.set(side * (width * 0.5 + 0.09), blueprint.height * 0.48, ladderZ + 0.18);
      group.add(railA, railB);

      for (let i = 0; i < 5; i += 1) {
        const rung = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.52), this.materials.edge);
        rung.position.set(side * (width * 0.5 + 0.11), 0.88 + i * 0.38, ladderZ);
        group.add(rung);
      }
    }
  }

  private recyclePassedCoaches(playerZ: number): void {
    let moved = false;

    while (
      this.coaches.length > 1 &&
      playerZ - this.coaches[0].endZ > GAME_CONFIG.train.recycleBehindDistance
    ) {
      const coach = this.coaches.shift();
      if (!coach) {
        break;
      }

      const last = this.coaches[this.coaches.length - 1];
      const gap = this.getGapForIndex(coach.id + this.coaches.length + 1);
      coach.startZ = last.endZ + gap;
      coach.endZ = coach.startZ + coach.length;
      coach.group.position.z = (coach.startZ + coach.endZ) * 0.5;
      coach.id += GAME_CONFIG.train.coachCount;
      this.coaches.push(coach);
      moved = true;
    }

    if (moved) {
      this.coaches.sort((a, b) => a.startZ - b.startZ);
    }
  }

  private getGapForIndex(index: number): number {
    const t = pseudoRandom(index * 3.31 + 4.7);
    return THREE.MathUtils.lerp(GAME_CONFIG.train.gapMin, GAME_CONFIG.train.gapMax, t);
  }

  private createCoachPaint(blueprint: Blueprint): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: blueprint.color,
      roughness: 0.46,
      metalness: blueprint.type === 'cargo' ? 0.58 : 0.42
    });
  }

  private createMaterials(): Record<string, THREE.Material> {
    return {
      roof: new THREE.MeshStandardMaterial({ color: 0x242b36, roughness: 0.62, metalness: 0.55 }),
      walkway: new THREE.MeshStandardMaterial({ color: 0x121722, roughness: 0.78, metalness: 0.45 }),
      edge: new THREE.MeshStandardMaterial({ color: 0xa8bac8, roughness: 0.38, metalness: 0.7 }),
      vent: new THREE.MeshStandardMaterial({ color: 0x394555, roughness: 0.44, metalness: 0.68 }),
      pipe: new THREE.MeshStandardMaterial({ color: 0x7b8995, roughness: 0.36, metalness: 0.78 }),
      undercarriage: new THREE.MeshStandardMaterial({ color: 0x161b22, roughness: 0.64, metalness: 0.75 }),
      wheel: new THREE.MeshStandardMaterial({ color: 0x0f1318, roughness: 0.4, metalness: 0.9 }),
      window: new THREE.MeshStandardMaterial({
        color: 0x10243f,
        emissive: 0x123b70,
        emissiveIntensity: 0.85,
        roughness: 0.18,
        metalness: 0.28
      }),
      panelDark: new THREE.MeshStandardMaterial({ color: 0x1c2430, roughness: 0.55, metalness: 0.66 }),
      panelLine: new THREE.MeshStandardMaterial({ color: 0x09101b, roughness: 0.72, metalness: 0.45 }),
      neonCyan: new THREE.MeshStandardMaterial({
        color: 0x38e8ff,
        emissive: 0x38e8ff,
        emissiveIntensity: 1.35,
        roughness: 0.2,
        metalness: 0.15
      }),
      neonAmber: new THREE.MeshStandardMaterial({
        color: 0xffb454,
        emissive: 0xff7a2d,
        emissiveIntensity: 1.6,
        roughness: 0.24,
        metalness: 0.2
      }),
      armoredPlate: new THREE.MeshStandardMaterial({ color: 0x4f5f6f, roughness: 0.5, metalness: 0.78 })
    };
  }
}
