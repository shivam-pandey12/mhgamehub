import {
  Box3,
  BoxGeometry,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Vector3,
} from "three";

const WALL_WIDTH = 4.6;
const WALL_HEIGHT = 2.7;
const WALL_DEPTH = 0.72;
const WALL_MAX_DISTANCE = 6.6;
const WALL_PLAYER_CLEARANCE = 2.2;
const WALL_MAX_ACTIVE = 4;
const WALL_MAX_HEALTH = 220;
const GLOO_DOUBLE_TAP_WINDOW = 360;

export class GlooWallSystem {
  constructor({
    camera,
    collisionBoxes,
    effects,
    navBounds,
    player,
    scene,
    ui,
  }) {
    this.camera = camera;
    this.collisionBoxes = collisionBoxes;
    this.effects = effects;
    this.navBounds = navBounds;
    this.player = player;
    this.scene = scene;
    this.ui = ui;

    this.walls = [];
    this.isBlocked = false;
    this.isDisabled = false;
    this.previewActive = false;
    this.previewValid = false;
    this.previewPosition = new Vector3();
    this.previewBox = new Box3();
    this.tempDirection = new Vector3();
    this.tempPosition = new Vector3();
    this.tempMin = new Vector3();
    this.tempMax = new Vector3();
    this.lastGPressAt = -Infinity;

    this.preview = buildGlooWall({
      baseColor: 0x7fd7ff,
      emissiveColor: 0x78d9ff,
      emissiveIntensity: 0.85,
      opacity: 0.32,
      transparent: true,
    });
    this.preview.root.visible = false;
    this.scene.add(this.preview.root);

    this.handleKeyDown = this.handleKeyDown.bind(this);

    document.addEventListener("keydown", this.handleKeyDown);

    this.refreshUi();
  }

  get isPlacementActive() {
    return this.previewActive;
  }

  setDisabled(isDisabled) {
    this.isDisabled = isDisabled;
    if (isDisabled) {
      this.cancelPreview();
    }
  }

  setBlocked(isBlocked) {
    this.isBlocked = isBlocked;
    if (isBlocked) {
      this.cancelPreview();
    } else {
      this.refreshUi();
    }
  }

  handleKeyDown(event) {
    if (event.repeat || event.code !== "KeyG") {
      return;
    }

    event.preventDefault();
    const now = performance.now();
    const isDoubleTap = now - this.lastGPressAt <= GLOO_DOUBLE_TAP_WINDOW;
    this.lastGPressAt = now;

    if (!this.player.isLocked || !this.player.enabled || this.isDisabled || this.isBlocked) {
      return;
    }

    if (this.previewActive) {
      if (isDoubleTap) {
        if (this.previewValid) {
          this.deployPreview();
        } else {
          this.ui.setTemporaryStatus("Find a clear spot for the gloo wall.", "warning", 0.9);
        }
      } else {
        this.cancelPreview();
        this.ui.setTemporaryStatus("Gloo wall preview cancelled.", "idle", 0.8);
      }
      return;
    }

    this.previewActive = true;
    this.preview.root.visible = true;
    this.updatePreview();
    this.ui.setTemporaryStatus("Gloo wall preview ready. Press G again to hide or double-tap G to deploy.", "boost", 1.2);
    this.refreshUi();
  }

  update() {
    if (!this.previewActive) {
      this.refreshUi();
      return;
    }

    if (!this.player.isLocked || !this.player.enabled || this.isDisabled || this.isBlocked) {
      this.cancelPreview();
      if (this.preview.root.visible) {
        this.preview.root.visible = false;
      }
      return;
    }

    this.updatePreview();
  }

  updatePreview() {
    this.getPlacementDirection(this.tempDirection);

    const distance = this.player.isAiming ? WALL_MAX_DISTANCE - 1.1 : WALL_MAX_DISTANCE;
    this.tempPosition
      .copy(this.player.position)
      .addScaledVector(this.tempDirection, distance);
    this.tempPosition.y = WALL_HEIGHT * 0.5;

    this.previewPosition.copy(this.tempPosition);
    this.preview.root.position.copy(this.previewPosition);
    this.preview.root.rotation.y = Math.atan2(this.tempDirection.x, this.tempDirection.z);
    this.preview.root.visible = true;
    this.preview.root.updateWorldMatrix(true, false);
    this.previewBox.setFromObject(this.preview.root);
    this.previewValid = this.canPlacePreview();

    const opacity = this.previewValid ? 0.34 : 0.22;
    const baseColor = this.previewValid ? 0x82e0ff : 0xff8577;
    const emissive = this.previewValid ? 0x6bdcff : 0xff725d;
    const intensity = this.previewValid ? 0.95 : 0.7;

    for (const material of this.preview.materials) {
      material.color.setHex(baseColor);
      material.emissive.setHex(emissive);
      material.emissiveIntensity = intensity;
      material.opacity = opacity;
    }

    this.refreshUi();
  }

  getPlacementDirection(target) {
    this.camera.getWorldDirection(target);
    target.y = 0;

    if (target.lengthSq() < 0.0001) {
      target.set(Math.sin(this.player.yaw), 0, -Math.cos(this.player.yaw));
    }

    target.normalize();
    return target;
  }

  canPlacePreview() {
    if (
      this.previewPosition.x < this.navBounds.minX + 3 ||
      this.previewPosition.x > this.navBounds.maxX - 3 ||
      this.previewPosition.z < this.navBounds.minZ + 3 ||
      this.previewPosition.z > this.navBounds.maxZ - 3
    ) {
      return false;
    }

    if (
      Math.hypot(
        this.previewPosition.x - this.player.position.x,
        this.previewPosition.z - this.player.position.z,
      ) < WALL_PLAYER_CLEARANCE
    ) {
      return false;
    }

    this.tempMin.set(
      this.player.position.x - 0.7,
      this.player.position.y,
      this.player.position.z - 0.7,
    );
    this.tempMax.set(
      this.player.position.x + 0.7,
      this.player.position.y + 1.9,
      this.player.position.z + 0.7,
    );

    if (
      this.previewBox.max.x > this.tempMin.x &&
      this.previewBox.min.x < this.tempMax.x &&
      this.previewBox.max.y > this.tempMin.y &&
      this.previewBox.min.y < this.tempMax.y &&
      this.previewBox.max.z > this.tempMin.z &&
      this.previewBox.min.z < this.tempMax.z
    ) {
      return false;
    }

    for (const box of this.collisionBoxes) {
      if (this.previewBox.intersectsBox(box)) {
        return false;
      }
    }

    return true;
  }

  deployPreview() {
    if (this.walls.length >= WALL_MAX_ACTIVE) {
      this.destroyWall(this.walls[0], false);
    }

    const wall = buildGlooWall({
      baseColor: 0x96e2ff,
      emissiveColor: 0x52cfff,
      emissiveIntensity: 0.35,
      opacity: 0.66,
      transparent: true,
    });

    wall.root.position.copy(this.previewPosition);
    wall.root.rotation.copy(this.preview.root.rotation);
    wall.root.updateWorldMatrix(true, false);

    const collisionBox = new Box3().setFromObject(wall.root);
    const wallState = {
      box: collisionBox,
      health: WALL_MAX_HEALTH,
      materials: wall.materials,
      root: wall.root,
    };

    wallState.takeDamage = (amount) => this.applyDamage(wallState, amount);

    wall.root.traverse((child) => {
      if (!child.isMesh) {
        return;
      }

      child.userData.coverType = "gloo";
      child.userData.damageReceiver = wallState;
    });

    this.scene.add(wall.root);
    this.collisionBoxes.push(collisionBox);
    this.walls.push(wallState);

    this.previewActive = false;
    this.preview.root.visible = false;
    this.ui.setTemporaryStatus("Gloo wall deployed.", "boost", 0.9);
    this.refreshUi();
  }

  applyDamage(wall, amount) {
    if (!wall || wall.health <= 0) {
      return { hit: false };
    }

    wall.health = Math.max(0, wall.health - amount);
    const healthAlpha = wall.health / WALL_MAX_HEALTH;

    for (const material of wall.materials) {
      material.opacity = MathUtils.lerp(0.18, 0.66, healthAlpha);
      material.emissiveIntensity = MathUtils.lerp(0.06, 0.35, healthAlpha);
    }

    if (wall.health === 0) {
      this.destroyWall(wall, true);
    }

    return { hit: false };
  }

  destroyWall(wall, shattered) {
    const wallIndex = this.walls.indexOf(wall);
    if (wallIndex >= 0) {
      this.walls.splice(wallIndex, 1);
    }

    const collisionIndex = this.collisionBoxes.indexOf(wall.box);
    if (collisionIndex >= 0) {
      this.collisionBoxes.splice(collisionIndex, 1);
    }

    this.scene.remove(wall.root);

    if (shattered) {
      wall.root.getWorldPosition(this.tempPosition);
      this.effects?.spawnImpact(this.tempPosition, {});
      this.ui.setTemporaryStatus("Gloo wall shattered.", "warning", 0.95);
    }

    this.refreshUi();
  }

  cancelPreview() {
    this.previewActive = false;
    this.previewValid = false;
    this.preview.root.visible = false;
    this.refreshUi();
  }

  getShootTargets() {
    return this.walls.map((wall) => wall.root);
  }

  refreshUi() {
    this.ui.setGlooState({
      activeCount: this.walls.length,
      blocked: this.isBlocked || this.isDisabled,
      previewActive: this.previewActive,
      previewValid: this.previewValid,
    });
  }
}

function buildGlooWall({
  baseColor,
  emissiveColor,
  emissiveIntensity,
  opacity,
  transparent,
}) {
  const root = new Group();
  const materials = [];

  const shieldMaterial = createWallMaterial({
    color: baseColor,
    emissive: emissiveColor,
    emissiveIntensity,
    opacity,
    roughness: 0.28,
    metalness: 0.08,
    transparent,
  });
  const ribMaterial = createWallMaterial({
    color: 0xd6f7ff,
    emissive: emissiveColor,
    emissiveIntensity: emissiveIntensity * 0.55,
    opacity,
    roughness: 0.34,
    metalness: 0.12,
    transparent,
  });

  materials.push(shieldMaterial, ribMaterial);

  const center = createWallMesh(new BoxGeometry(WALL_WIDTH, WALL_HEIGHT, WALL_DEPTH), shieldMaterial);
  center.position.set(0, 0, 0);
  root.add(center);

  const leftWing = createWallMesh(new BoxGeometry(1.05, WALL_HEIGHT * 0.92, WALL_DEPTH * 0.9), shieldMaterial);
  leftWing.position.set(-WALL_WIDTH * 0.42, 0, -0.22);
  leftWing.rotation.y = 0.42;
  root.add(leftWing);

  const rightWing = createWallMesh(new BoxGeometry(1.05, WALL_HEIGHT * 0.92, WALL_DEPTH * 0.9), shieldMaterial);
  rightWing.position.set(WALL_WIDTH * 0.42, 0, -0.22);
  rightWing.rotation.y = -0.42;
  root.add(rightWing);

  const topRib = createWallMesh(new BoxGeometry(WALL_WIDTH * 0.86, 0.18, WALL_DEPTH * 1.18), ribMaterial);
  topRib.position.set(0, WALL_HEIGHT * 0.48, 0.02);
  root.add(topRib);

  const lowerRib = createWallMesh(new BoxGeometry(WALL_WIDTH * 0.72, 0.16, WALL_DEPTH * 1.12), ribMaterial);
  lowerRib.position.set(0, -WALL_HEIGHT * 0.2, 0.02);
  root.add(lowerRib);

  return {
    materials,
    root,
  };
}

function createWallMaterial({
  color,
  emissive,
  emissiveIntensity,
  metalness,
  opacity,
  roughness,
  transparent,
}) {
  return new MeshStandardMaterial({
    color,
    emissive,
    emissiveIntensity,
    metalness,
    opacity,
    roughness,
    transparent,
  });
}

function createWallMesh(geometry, material) {
  const mesh = new Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
