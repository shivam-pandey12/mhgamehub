import * as THREE from "three";
import { playShootSound, playWeaponSwitchSound, stopShootSound } from "../audio/placeholders.js";
import { WEAPON_DEFINITIONS, WEAPON_SWITCH_DELAY, getWeaponDefinitionByIndex } from "./weaponTypes.js";

const baseTint = new THREE.Color();

function createWeaponVisual() {
  const root = new THREE.Group();

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.16, 0.38),
    new THREE.MeshStandardMaterial({
      color: 0x1c2432,
      emissive: 0x0b1220,
      emissiveIntensity: 0.7,
      roughness: 0.44,
      metalness: 0.82,
    }),
  );
  root.add(base);

  const barrel = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.14, 0.78),
    new THREE.MeshStandardMaterial({
      color: 0x74dfff,
      emissive: 0x2b89d8,
      emissiveIntensity: 1.2,
      roughness: 0.18,
      metalness: 0.5,
    }),
  );
  barrel.position.z = -0.48;
  root.add(barrel);

  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 14, 12),
    new THREE.MeshStandardMaterial({
      color: 0x74dfff,
      emissive: 0x3fb8ff,
      emissiveIntensity: 2.2,
      roughness: 0.08,
      metalness: 0.04,
    }),
  );
  glow.position.z = -0.9;
  root.add(glow);

  return {
    root,
    base,
    barrel,
    glow,
    materials: {
      base: base.material,
      barrel: barrel.material,
      glow: glow.material,
    },
  };
}

export class WeaponSystem {
  constructor({ ship, ownerTag = "player" }) {
    this.ship = ship;
    this.ownerTag = ownerTag;
    this.weaponDefinitions = WEAPON_DEFINITIONS;
    this.currentWeaponIndex = 0;
    this.pendingWeaponIndex = null;
    this.switchTimer = 0;
    this.fireCooldown = 0;
    this.weaponVisualDeploy = 1;
    this.muzzleHeat = 0;
    this.mountCycleIndex = 0;
    this.switchPulse = 0;
    this.fireFlash = 0;
    this.pendingCameraShake = 0;
    this.pendingHudPulse = 0;

    this.visuals = [
      createWeaponVisual(),
      createWeaponVisual(),
    ];

    this.ship.leftWeaponMount.add(this.visuals[0].root);
    this.ship.rightWeaponMount.add(this.visuals[1].root);
    this.applyWeaponVisualState(this.currentWeapon, true);
  }

  get currentWeapon() {
    return getWeaponDefinitionByIndex(this.currentWeaponIndex);
  }

  get isSwitching() {
    return this.switchTimer > 0;
  }

  requestWeaponSwitch(nextWeaponIndex) {
    const nextWeapon = getWeaponDefinitionByIndex(nextWeaponIndex);

    if (!nextWeapon) {
      return;
    }

    if (nextWeaponIndex === this.currentWeaponIndex || nextWeaponIndex === this.pendingWeaponIndex) {
      return;
    }

    this.pendingWeaponIndex = nextWeaponIndex;
    this.switchTimer = WEAPON_SWITCH_DELAY;
    this.fireCooldown = Math.max(this.fireCooldown, WEAPON_SWITCH_DELAY);
    this.switchPulse = 1;
    this.pendingHudPulse = Math.max(this.pendingHudPulse, 1);
    playWeaponSwitchSound();
  }

  update(deltaTime, inputController, projectileSystem, { energySystem } = {}) {
    const requestedWeaponIndex = inputController?.consumeWeaponSwitchRequest();

    if (requestedWeaponIndex !== null && requestedWeaponIndex !== undefined) {
      this.requestWeaponSwitch(requestedWeaponIndex);
    }

    this.fireCooldown = Math.max(0, this.fireCooldown - deltaTime);

    if (this.switchTimer > 0) {
      this.switchTimer = Math.max(0, this.switchTimer - deltaTime);

      if (this.switchTimer === 0 && this.pendingWeaponIndex !== null) {
        this.currentWeaponIndex = this.pendingWeaponIndex;
        this.pendingWeaponIndex = null;
        this.applyWeaponVisualState(this.currentWeapon);
      }
    }

    this.weaponVisualDeploy = THREE.MathUtils.damp(
      this.weaponVisualDeploy,
      this.isSwitching ? 0.28 : 1,
      9,
      deltaTime,
    );
    this.muzzleHeat = THREE.MathUtils.damp(this.muzzleHeat, 0, 8.5, deltaTime);
    this.switchPulse = THREE.MathUtils.damp(this.switchPulse, 0, 7.5, deltaTime);
    this.fireFlash = THREE.MathUtils.damp(this.fireFlash, 0, 10.5, deltaTime);
    this.updateVisuals();

    if (!projectileSystem || !inputController?.isFiring() || this.isSwitching) {
      stopShootSound();
      return;
    }

    if (this.fireCooldown > 0) {
      return;
    }

    const didFire = this.fire(projectileSystem, energySystem);

    if (!didFire) {
      stopShootSound();
    }
  }

  fire(projectileSystem, energySystem) {
    const activeWeapon = this.currentWeapon;

    if (energySystem && !energySystem.consume(activeWeapon.energyCost ?? 0)) {
      return false;
    }

    const mounts = this.getFiringMounts(activeWeapon.firePattern);

    for (const mount of mounts) {
      projectileSystem.spawnProjectile({
        weaponDefinition: activeWeapon,
        origin: mount,
        ownerVelocity: this.ship.velocity,
        ownerTag: this.ownerTag,
      });
    }

    this.fireCooldown = activeWeapon.cooldown;
    this.muzzleHeat = 1;
    this.fireFlash = 1;
    this.pendingCameraShake += activeWeapon.cameraShake ?? 0.08;
    this.pendingHudPulse = Math.max(this.pendingHudPulse, 1);
    this.ship.triggerWeaponRecoil(activeWeapon.recoil);
    playShootSound();
    return true;
  }

  getFiringMounts(firePattern) {
    if (firePattern === "dual") {
      return [this.ship.leftWeaponMount, this.ship.rightWeaponMount];
    }

    const nextMount = this.mountCycleIndex % 2 === 0
      ? this.ship.leftWeaponMount
      : this.ship.rightWeaponMount;

    this.mountCycleIndex += 1;

    return [nextMount];
  }

  applyWeaponVisualState(weaponDefinition, immediate = false) {
    for (const visual of this.visuals) {
      baseTint.setHex(weaponDefinition.glowColor).multiplyScalar(0.12);
      visual.materials.base.emissive.copy(baseTint);
      visual.materials.barrel.color.setHex(weaponDefinition.weaponColor);
      visual.materials.barrel.emissive.setHex(weaponDefinition.glowColor);
      visual.materials.barrel.emissiveIntensity = weaponDefinition.barrelEmissiveIntensity;
      visual.materials.glow.color.setHex(weaponDefinition.weaponColor);
      visual.materials.glow.emissive.setHex(weaponDefinition.glowColor);
      visual.materials.glow.emissiveIntensity = weaponDefinition.glowIntensity;

      if (immediate) {
        visual.root.position.set(0, 0, 0);
      }
    }
  }

  updateVisuals() {
    const activeWeapon = this.currentWeapon;
    const deployDepth = 1 - this.weaponVisualDeploy;
    const flashLevel = this.fireFlash + this.switchPulse * 0.65;

    for (let index = 0; index < this.visuals.length; index += 1) {
      const visual = this.visuals[index];
      const heatScale = 1 + this.muzzleHeat * 0.28;
      const side = index === 0 ? -1 : 1;
      const rootScale = 1 + flashLevel * 0.08;

      visual.root.position.z = deployDepth * 0.38;
      visual.root.position.y = -deployDepth * 0.05;
      visual.root.position.x = side * deployDepth * 0.05;
      visual.root.rotation.y = side * deployDepth * 0.55;
      visual.root.scale.set(rootScale, rootScale, rootScale);

      visual.barrel.scale.set(
        activeWeapon.barrelScale[0],
        activeWeapon.barrelScale[1],
        activeWeapon.barrelScale[2] * this.weaponVisualDeploy,
      );
      visual.barrel.position.z = -0.42 - activeWeapon.barrelScale[2] * 0.16 * this.weaponVisualDeploy;

      visual.glow.position.z = visual.barrel.position.z - 0.42 * this.weaponVisualDeploy;
      visual.glow.scale.set(
        activeWeapon.muzzleScale[0] * heatScale,
        activeWeapon.muzzleScale[1] * heatScale,
        activeWeapon.muzzleScale[2] * heatScale,
      );
      visual.materials.glow.emissiveIntensity = activeWeapon.glowIntensity * (0.72 + this.muzzleHeat * 0.58 + flashLevel * 0.38);
      visual.materials.barrel.emissiveIntensity = activeWeapon.barrelEmissiveIntensity * (0.7 + this.muzzleHeat * 0.5 + flashLevel * 0.2);
    }
  }

  consumeCameraShake() {
    const shakeAmount = this.pendingCameraShake;
    this.pendingCameraShake = 0;
    return shakeAmount;
  }

  consumeHudPulse() {
    const hudPulse = this.pendingHudPulse;
    this.pendingHudPulse = 0;
    return hudPulse;
  }

  getHudState() {
    const pendingWeapon = this.pendingWeaponIndex !== null
      ? getWeaponDefinitionByIndex(this.pendingWeaponIndex)
      : null;

    return {
      currentWeapon: this.currentWeapon,
      pendingWeapon,
      displayWeapon: pendingWeapon ?? this.currentWeapon,
      isSwitching: this.isSwitching,
      switchProgress: pendingWeapon ? 1 - this.switchTimer / WEAPON_SWITCH_DELAY : 1,
      heat: this.muzzleHeat,
      indicatorLevel: Math.max(this.switchPulse, this.fireFlash),
    };
  }
}
