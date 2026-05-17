import * as THREE from "three";
import { Comet } from "./Comet.js";
import { Planet } from "./Planet.js";

const PLANET_FIELD_RADIUS = 1;
const PLANET_KEEP_RADIUS = PLANET_FIELD_RADIUS + 1;
const PLANET_SECTOR_SIZE = 180;
const PLANET_PALETTES = [
  { color: 0x5167d6, accentColor: 0xb0c0ff, atmosphereColor: 0x86d4ff },
  { color: 0x8a5fd2, accentColor: 0xe4b8ff, atmosphereColor: 0xb58fff },
  { color: 0x4a9365, accentColor: 0xbfe7a2, atmosphereColor: 0x8fe0b8 },
  { color: 0xb36c44, accentColor: 0xffcf8b, atmosphereColor: 0xffa76f },
  { color: 0x336a78, accentColor: 0x98f0ff, atmosphereColor: 0x77c7ff },
];

const separationVector = new THREE.Vector3();
const sectorCoords = new THREE.Vector3();
const raycastDirection = new THREE.Vector3();
const raycastOrigin = new THREE.Vector3();
const lineOfSightRaycaster = new THREE.Raycaster();

function hashCoordinate(x, y, z, seed = 0) {
  let hash = Math.imul((x + 1013) | 0, 374761393)
    ^ Math.imul((y + 2081) | 0, 668265263)
    ^ Math.imul((z + 3253) | 0, 2147483647)
    ^ Math.imul((seed + 4049) | 0, 1274126177);

  hash = (hash ^ (hash >>> 13)) >>> 0;
  hash = Math.imul(hash, 1274126177) >>> 0;
  hash ^= hash >>> 16;

  return (hash >>> 0) / 4294967295;
}

function toSectorCoordinate(value) {
  return Math.floor(value / PLANET_SECTOR_SIZE);
}

function createSectorKey(x, y, z) {
  return `${x}:${y}:${z}`;
}

function seededRange(x, y, z, seed, min, max) {
  return min + (max - min) * hashCoordinate(x, y, z, seed);
}

function createSectorPlanets(sectorX, sectorY, sectorZ) {
  const sectorRoll = hashCoordinate(sectorX, sectorY, sectorZ, 1);
  const planetCount = sectorRoll > 0.82 ? 2 : sectorRoll > 0.36 ? 1 : 0;
  const planets = [];
  const sectorCenter = new THREE.Vector3(
    sectorX * PLANET_SECTOR_SIZE,
    sectorY * PLANET_SECTOR_SIZE,
    sectorZ * PLANET_SECTOR_SIZE,
  );

  for (let index = 0; index < planetCount; index += 1) {
    const paletteIndex = Math.floor(hashCoordinate(sectorX, sectorY, sectorZ, 10 + index) * PLANET_PALETTES.length) % PLANET_PALETTES.length;
    const palette = PLANET_PALETTES[paletteIndex];
    const position = new THREE.Vector3(
      sectorCenter.x + seededRange(sectorX, sectorY, sectorZ, 20 + index * 4, -PLANET_SECTOR_SIZE * 0.28, PLANET_SECTOR_SIZE * 0.28),
      sectorCenter.y + seededRange(sectorX, sectorY, sectorZ, 21 + index * 4, -PLANET_SECTOR_SIZE * 0.3, PLANET_SECTOR_SIZE * 0.3),
      sectorCenter.z + seededRange(sectorX, sectorY, sectorZ, 22 + index * 4, -PLANET_SECTOR_SIZE * 0.28, PLANET_SECTOR_SIZE * 0.28),
    );
    const radius = seededRange(sectorX, sectorY, sectorZ, 23 + index * 4, 6.8, 15.8);
    const hasRing = hashCoordinate(sectorX, sectorY, sectorZ, 30 + index) > 0.62;

    planets.push(new Planet({
      position,
      radius,
      color: palette.color,
      accentColor: palette.accentColor,
      atmosphereColor: palette.atmosphereColor,
      hasRing,
    }));
  }

  return planets;
}

export class EnvironmentManager {
  constructor({ scene, player, cometCount = 8 } = {}) {
    this.scene = scene;
    this.player = player;
    this.group = new THREE.Group();
    this.group.name = "Environment";
    this.planetSectors = new Map();
    this.planets = [];
    this.comets = Array.from({ length: cometCount }, () => new Comet({ anchor: player.position }));

    this.scene.add(this.group);

    for (const comet of this.comets) {
      this.group.add(comet.group);
    }

    this.ensurePlanetField(this.player.position);
  }

  ensurePlanetField(referencePosition = this.player.position) {
    sectorCoords.set(
      toSectorCoordinate(referencePosition.x),
      toSectorCoordinate(referencePosition.y),
      toSectorCoordinate(referencePosition.z),
    );

    let didChange = false;

    for (let offsetX = -PLANET_FIELD_RADIUS; offsetX <= PLANET_FIELD_RADIUS; offsetX += 1) {
      for (let offsetY = -PLANET_FIELD_RADIUS; offsetY <= PLANET_FIELD_RADIUS; offsetY += 1) {
        for (let offsetZ = -PLANET_FIELD_RADIUS; offsetZ <= PLANET_FIELD_RADIUS; offsetZ += 1) {
          const sectorX = sectorCoords.x + offsetX;
          const sectorY = sectorCoords.y + offsetY;
          const sectorZ = sectorCoords.z + offsetZ;
          const sectorKey = createSectorKey(sectorX, sectorY, sectorZ);

          if (this.planetSectors.has(sectorKey)) {
            continue;
          }

          const planets = createSectorPlanets(sectorX, sectorY, sectorZ);

          for (const planet of planets) {
            this.group.add(planet.group);
          }

          this.planetSectors.set(sectorKey, {
            sectorX,
            sectorY,
            sectorZ,
            planets,
          });
          didChange = true;
        }
      }
    }

    for (const [sectorKey, entry] of this.planetSectors) {
      if (
        Math.abs(entry.sectorX - sectorCoords.x) > PLANET_KEEP_RADIUS
        || Math.abs(entry.sectorY - sectorCoords.y) > PLANET_KEEP_RADIUS
        || Math.abs(entry.sectorZ - sectorCoords.z) > PLANET_KEEP_RADIUS
      ) {
        for (const planet of entry.planets) {
          this.group.remove(planet.group);
          planet.dispose();
        }

        this.planetSectors.delete(sectorKey);
        didChange = true;
      }
    }

    if (didChange) {
      this.planets = Array.from(this.planetSectors.values()).flatMap((entry) => entry.planets);
    }
  }

  update(deltaTime) {
    this.ensurePlanetField(this.player.position);

    for (const planet of this.planets) {
      planet.update(deltaTime);
    }

    for (const comet of this.comets) {
      comet.update(deltaTime, this.player.position);
    }
  }

  isProjectileBlocked(projectile) {
    this.ensurePlanetField(this.player.position);

    for (const planet of this.planets) {
      if (projectile.intersectsSphere(planet.collisionSphere)) {
        return true;
      }
    }

    return false;
  }

  isLineBlocked(start, end) {
    this.ensurePlanetField(start);
    this.ensurePlanetField(end);

    raycastDirection.copy(end).sub(start);
    const distance = raycastDirection.length();

    if (distance <= 0.001 || this.planets.length === 0) {
      return false;
    }

    raycastDirection.normalize();
    raycastOrigin.copy(start).addScaledVector(raycastDirection, 0.35);
    lineOfSightRaycaster.set(raycastOrigin, raycastDirection);
    lineOfSightRaycaster.far = Math.max(0, distance - 0.35);

    return lineOfSightRaycaster.intersectObjects(
      this.planets.map((planet) => planet.planetMesh),
      false,
    ).length > 0;
  }

  getPlanetsWithinRange(position, radius) {
    this.ensurePlanetField(position);
    const radiusSquared = radius ** 2;

    return this.planets.filter((planet) => (
      planet.collisionSphere.center.distanceToSquared(position)
      <= (planet.gravityRadius + radius) ** 2 + radiusSquared
    ));
  }

  resolveShipCollisions(ship) {
    if (!ship || ship.isDestroyed) {
      return;
    }

    this.ensurePlanetField(ship.position);

    for (const planet of this.planets) {
      separationVector.copy(ship.position).sub(planet.collisionSphere.center);
      const minDistance = planet.collisionSphere.radius + ship.collisionRadius;
      const distance = separationVector.length();

      if (distance === 0) {
        separationVector.set(0, 1, 0);
      } else if (distance >= minDistance) {
        continue;
      }

      separationVector.normalize();
      ship.position.copy(planet.collisionSphere.center).addScaledVector(separationVector, minDistance);

      const inwardSpeed = ship.velocity.dot(separationVector);

      if (inwardSpeed < 0) {
        ship.velocity.addScaledVector(separationVector, -inwardSpeed);
      }

      ship.updateCollisionBounds();
    }
  }

  getSafePosition(position, paddingRadius = 0) {
    this.ensurePlanetField(position);
    const safePosition = position.clone();

    for (const planet of this.planets) {
      separationVector.copy(safePosition).sub(planet.collisionSphere.center);
      const minDistance = planet.collisionSphere.radius + paddingRadius;
      const distance = separationVector.length();

      if (distance === 0) {
        separationVector.set(0, 1, 0);
      } else if (distance >= minDistance) {
        continue;
      }

      separationVector.normalize();
      safePosition.copy(planet.collisionSphere.center).addScaledVector(separationVector, minDistance);
    }

    return safePosition;
  }

  dispose() {
    for (const entry of this.planetSectors.values()) {
      for (const planet of entry.planets) {
        planet.dispose();
      }
    }

    for (const comet of this.comets) {
      comet.dispose();
    }

    this.planetSectors.clear();
    this.planets.length = 0;
    this.scene.remove(this.group);
  }
}
