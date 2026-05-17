import * as THREE from "three";
import { playBoostSound, playEngineSound } from "../audio/placeholders.js";

const localForward = new THREE.Vector3(0, 0, -1);
const localRight = new THREE.Vector3(1, 0, 0);
const localUp = new THREE.Vector3(0, 1, 0);
const deltaRotationEuler = new THREE.Euler(0, 0, 0, "YXZ");
const deltaRotationQuaternion = new THREE.Quaternion();
const facingDirection = new THREE.Vector3();
const facingPointDirection = new THREE.Vector3();
const facingQuaternion = new THREE.Quaternion();
const shieldColor = new THREE.Color();
const stealthColor = new THREE.Color(0x83ffd8);
const timeColor = new THREE.Color(0x7bd8ff);

function disposeObjectResources(root) {
  const disposedMaterials = new Set();

  root.traverse((object) => {
    if (object.geometry) {
      object.geometry.dispose();
    }

    const materials = Array.isArray(object.material) ? object.material : [object.material];

    for (const material of materials) {
      if (material && !disposedMaterials.has(material)) {
        disposedMaterials.add(material);
        material.dispose();
      }
    }
  });
}

export class Spaceship {
  constructor({
    bodyColor = 0x1a2230,
    wingColor = 0x2a3547,
    accentColor = 0x7fbcff,
    glowColor = 0x55d5ff,
  } = {}) {
    this.group = new THREE.Group();
    this.visualRoot = new THREE.Group();
    this.weaponRig = new THREE.Group();
    this.group.add(this.visualRoot);
    this.visualRoot.add(this.weaponRig);

    this.materials = new Set();
    this.engineGlowMaterials = [];
    this.engineGlowMeshes = [];
    this.engineTrailMaterials = [];
    this.engineTrailMeshes = [];
    this.navigationLightMaterials = [];

    this.floatTime = 0;
    this.targetTiltAmount = 0;
    this.currentTiltAmount = 0;
    this.boostAmount = 0;
    this.weaponRecoil = 0;
    this.weaponModeOffset = 0;
    this.attitudeOffset = new THREE.Vector3();
    this.damageFlash = 0;
    this.timeDilationAmount = 0;
    this.stealthFieldAmount = 0;
    this.shieldFieldAmount = 0;
    this.shieldImpactAmount = 0;

    this.velocity = new THREE.Vector3();
    this.angularVelocity = new THREE.Vector3();
    this.linearDamping = 2.8;
    this.angularDamping = 4.2;
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.isDestroyed = false;
    this.collisionRadius = 1.45;
    this.collisionSphere = new THREE.Sphere(new THREE.Vector3(), this.collisionRadius);

    this.bodyColor = bodyColor;
    this.wingColor = wingColor;
    this.accentColor = accentColor;
    this.glowColor = glowColor;
    this.baseShieldColor = new THREE.Color(this.accentColor);

    this.leftWeaponMount = new THREE.Object3D();
    this.rightWeaponMount = new THREE.Object3D();

    this.group.position.set(0, 0, 0);

    this.buildShip();
  }

  get position() {
    return this.group.position;
  }

  get rotation() {
    return this.group.rotation;
  }

  getForwardVector(target = new THREE.Vector3()) {
    return target.copy(localForward).applyQuaternion(this.group.quaternion).normalize();
  }

  getRightVector(target = new THREE.Vector3()) {
    return target.copy(localRight).applyQuaternion(this.group.quaternion).normalize();
  }

  getUpVector(target = new THREE.Vector3()) {
    return target.copy(localUp).applyQuaternion(this.group.quaternion).normalize();
  }

  faceDirection(direction) {
    if (!direction || direction.lengthSq() <= 0.000001) {
      return;
    }

    facingDirection.copy(direction).normalize();
    facingQuaternion.setFromUnitVectors(localForward, facingDirection);
    this.group.quaternion.copy(facingQuaternion).normalize();
    this.group.rotation.setFromQuaternion(this.group.quaternion, "YXZ");
    this.updateCollisionBounds();
  }

  facePoint(point) {
    if (!point) {
      return;
    }

    facingPointDirection.copy(point).sub(this.position);

    if (facingPointDirection.lengthSq() <= 0.000001) {
      return;
    }

    this.faceDirection(facingPointDirection);
  }

  buildShip() {
    const hull = this.buildBody();
    const cockpit = this.buildCockpit();
    const wings = this.buildWings();
    const engineSection = this.buildEngineSection();

    this.visualRoot.add(hull);
    this.visualRoot.add(cockpit);
    this.visualRoot.add(wings);
    this.visualRoot.add(engineSection);
    this.createWeaponMounts();
    this.createShieldShell();

    this.visualRoot.rotation.x = -0.06;
  }

  buildBody() {
    const hullGroup = new THREE.Group();

    const hullMaterial = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: this.bodyColor,
      emissive: 0x0a1018,
      emissiveIntensity: 0.9,
      roughness: 0.42,
      metalness: 0.86,
    }));

    const accentMaterial = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: this.accentColor,
      emissive: 0x17324d,
      emissiveIntensity: 1.1,
      roughness: 0.2,
      metalness: 0.72,
    }));

    const coreHull = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 0.62, 4.8),
      hullMaterial,
    );
    coreHull.scale.set(1, 0.92, 1);
    hullGroup.add(coreHull);

    const dorsalSpine = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.26, 2.6),
      accentMaterial,
    );
    dorsalSpine.position.set(0, 0.35, -0.1);
    hullGroup.add(dorsalSpine);

    const noseWedge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.76, 1.7, 6),
      hullMaterial,
    );
    noseWedge.rotation.x = Math.PI * 0.5;
    noseWedge.rotation.z = Math.PI * 0.5;
    noseWedge.scale.set(0.58, 0.58, 1.08);
    noseWedge.position.set(0, 0.02, -3.08);
    hullGroup.add(noseWedge);

    const ventralPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.16, 2.8),
      this.trackMaterial(new THREE.MeshStandardMaterial({
        color: 0x101722,
        roughness: 0.55,
        metalness: 0.72,
      })),
    );
    ventralPlate.position.set(0, -0.28, -0.18);
    hullGroup.add(ventralPlate);

    const intakeGeometry = new THREE.BoxGeometry(0.24, 0.24, 1.6);

    for (const side of [-1, 1]) {
      const sideIntake = new THREE.Mesh(intakeGeometry, accentMaterial);
      sideIntake.position.set(0.54 * side, 0.06, -0.2);
      hullGroup.add(sideIntake);

      const cheekArmor = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.22, 1.2),
        hullMaterial,
      );
      cheekArmor.position.set(0.48 * side, -0.06, -1.6);
      cheekArmor.rotation.z = -0.12 * side;
      hullGroup.add(cheekArmor);
    }

    return hullGroup;
  }

  buildCockpit() {
    const canopyMaterial = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: 0xbfe7ff,
      emissive: 0x214d73,
      emissiveIntensity: 1.6,
      roughness: 0.08,
      metalness: 0.18,
      transparent: true,
      opacity: 0.88,
    }));

    const canopy = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 18, 14),
      canopyMaterial,
    );
    canopy.scale.set(0.96, 0.56, 1.42);
    canopy.position.set(0, 0.42, -1.46);

    return canopy;
  }

  buildWings() {
    const wingsGroup = new THREE.Group();
    const wingMaterial = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: this.wingColor,
      emissive: 0x0d1420,
      emissiveIntensity: 0.55,
      roughness: 0.48,
      metalness: 0.8,
    }));

    const edgeMaterial = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: this.accentColor,
      emissive: 0x143250,
      emissiveIntensity: 1,
      roughness: 0.22,
      metalness: 0.74,
    }));

    for (const side of [-1, 1]) {
      const wing = new THREE.Mesh(
        new THREE.BoxGeometry(2.55, 0.14, 1.2),
        wingMaterial,
      );
      wing.position.set(1.7 * side, -0.04, 0.05);
      wing.rotation.z = -0.22 * side;
      wing.rotation.y = 0.12 * side;
      wingsGroup.add(wing);

      const wingBlade = new THREE.Mesh(
        new THREE.BoxGeometry(1.35, 0.08, 1.48),
        edgeMaterial,
      );
      wingBlade.position.set(2.68 * side, -0.08, -0.22);
      wingBlade.rotation.z = -0.34 * side;
      wingBlade.rotation.y = 0.2 * side;
      wingsGroup.add(wingBlade);

      const stabilizer = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.84, 0.9),
        wingMaterial,
      );
      stabilizer.position.set(1.96 * side, 0.38, 1.12);
      stabilizer.rotation.z = -0.18 * side;
      wingsGroup.add(stabilizer);

      const navigationLightMaterial = this.trackMaterial(new THREE.MeshBasicMaterial({
        color: side < 0 ? 0x69dfff : 0xff8f78,
        transparent: true,
        opacity: 0.95,
      }));
      const navigationLight = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 10, 10),
        navigationLightMaterial,
      );
      navigationLight.position.set(3.18 * side, -0.08, -0.34);
      wingsGroup.add(navigationLight);
      this.navigationLightMaterials.push(navigationLightMaterial);
    }

    return wingsGroup;
  }

  buildEngineSection() {
    const engineGroup = new THREE.Group();

    const engineHousingMaterial = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: 0x141b28,
      emissive: 0x0e1724,
      emissiveIntensity: 0.6,
      roughness: 0.38,
      metalness: 0.84,
    }));

    const thrusterMaterial = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: 0x263448,
      emissive: 0x0f2232,
      emissiveIntensity: 0.9,
      roughness: 0.3,
      metalness: 0.76,
    }));

    const engineBridge = new THREE.Mesh(
      new THREE.BoxGeometry(0.92, 0.42, 0.88),
      engineHousingMaterial,
    );
    engineBridge.position.set(0, 0.02, 2.08);
    engineGroup.add(engineBridge);

    for (const side of [-1, 1]) {
      const enginePod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.29, 1.08, 14),
        thrusterMaterial,
      );
      enginePod.rotation.x = Math.PI * 0.5;
      enginePod.position.set(0.56 * side, -0.04, 2.15);
      engineGroup.add(enginePod);

      const nozzle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.19, 0.12, 0.34, 14),
        engineHousingMaterial,
      );
      nozzle.rotation.x = Math.PI * 0.5;
      nozzle.position.set(0.56 * side, -0.04, 2.74);
      engineGroup.add(nozzle);

      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 16, 16),
        this.trackMaterial(new THREE.MeshStandardMaterial({
          color: this.glowColor,
          emissive: this.glowColor,
          emissiveIntensity: 2.4,
          roughness: 0.14,
          metalness: 0.05,
        })),
      );
      glow.scale.set(1, 0.82, 1.28);
      glow.position.set(0.56 * side, -0.04, 2.95);
      this.engineGlowMeshes.push(glow);
      this.engineGlowMaterials.push(glow.material);
      engineGroup.add(glow);

      const trailMaterial = this.trackMaterial(new THREE.MeshBasicMaterial({
        color: this.glowColor,
        transparent: true,
        opacity: 0.34,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }));
      const trail = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.02, 2.2, 12, 1, true),
        trailMaterial,
      );
      trail.rotation.x = Math.PI * 0.5;
      trail.position.set(0.56 * side, -0.04, 3.9);
      trail.scale.set(1, 1, 0.72);
      this.engineTrailMeshes.push(trail);
      this.engineTrailMaterials.push(trailMaterial);
      engineGroup.add(trail);
    }

    return engineGroup;
  }

  createShieldShell() {
    this.shieldShellMaterial = this.trackMaterial(new THREE.MeshBasicMaterial({
      color: this.accentColor,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }));
    this.shieldShell = new THREE.Mesh(
      new THREE.SphereGeometry(2.2, 20, 18),
      this.shieldShellMaterial,
    );
    this.shieldShell.scale.set(1.05, 0.58, 1.8);
    this.visualRoot.add(this.shieldShell);
  }

  createWeaponMounts() {
    this.leftWeaponMount.position.set(-1.06, -0.05, -2.38);
    this.rightWeaponMount.position.set(1.06, -0.05, -2.38);

    this.weaponRig.add(this.leftWeaponMount);
    this.weaponRig.add(this.rightWeaponMount);
  }

  trackMaterial(material) {
    this.materials.add(material);
    return material;
  }

  setWireframe(enabled) {
    for (const material of this.materials) {
      material.wireframe = enabled;
    }
  }

  tilt(direction) {
    this.targetTiltAmount = THREE.MathUtils.clamp(direction, -1, 1);
  }

  boost() {
    this.boostAmount = Math.max(this.boostAmount, 1);
    playEngineSound();
    playBoostSound();
  }

  triggerWeaponRecoil(intensity = 0.22) {
    this.weaponRecoil = Math.max(this.weaponRecoil, intensity);
  }

  setWeaponModeOffset(offset) {
    this.weaponModeOffset = THREE.MathUtils.clamp(offset, -1, 1);
  }

  setTimeDilationAmount(amount) {
    this.timeDilationAmount = THREE.MathUtils.clamp(amount, 0, 1);
  }

  setStealthFieldAmount(amount) {
    this.stealthFieldAmount = THREE.MathUtils.clamp(amount, 0, 1);
  }

  setShieldFieldAmount(amount) {
    this.shieldFieldAmount = THREE.MathUtils.clamp(amount, 0, 1);
  }

  setShieldImpactAmount(amount) {
    this.shieldImpactAmount = THREE.MathUtils.clamp(amount, 0, 1);
  }

  takeDamage(amount) {
    if (this.isDestroyed) {
      return false;
    }

    this.health = Math.max(0, this.health - amount);
    this.damageFlash = 1;

    if (this.health === 0) {
      this.isDestroyed = true;
      this.group.visible = false;
    }

    this.updateCollisionBounds();

    return this.isDestroyed;
  }

  heal(amount) {
    if (this.isDestroyed || amount <= 0) {
      return 0;
    }

    const previousHealth = this.health;
    this.health = Math.min(this.maxHealth, this.health + amount);
    return this.health - previousHealth;
  }

  restore({ position = new THREE.Vector3(), rotationY = 0 } = {}) {
    this.isDestroyed = false;
    this.health = this.maxHealth;
    this.group.visible = true;
    this.group.position.copy(position);
    this.group.rotation.set(0, rotationY, 0);
    this.group.quaternion.setFromEuler(this.group.rotation);
    this.velocity.set(0, 0, 0);
    this.angularVelocity.set(0, 0, 0);
    this.targetTiltAmount = 0;
    this.currentTiltAmount = 0;
    this.boostAmount = 0;
    this.weaponRecoil = 0;
    this.weaponModeOffset = 0;
    this.attitudeOffset.set(0, 0, 0);
    this.damageFlash = 0;
    this.timeDilationAmount = 0;
    this.stealthFieldAmount = 0;
    this.shieldFieldAmount = 0;
    this.shieldImpactAmount = 0;
    this.updateCollisionBounds();
  }

  updateCollisionBounds() {
    this.collisionSphere.radius = this.collisionRadius;

    if (this.isDestroyed || !this.group.visible) {
      this.collisionSphere.center.set(1e6, 1e6, 1e6);
      return;
    }

    this.collisionSphere.center.copy(this.group.position);
  }

  update(deltaTime) {
    if (this.isDestroyed) {
      this.updateCollisionBounds();
      return;
    }

    this.floatTime += deltaTime;

    const linearDrag = Math.exp(-this.linearDamping * deltaTime);
    const angularDrag = Math.exp(-this.angularDamping * deltaTime);

    this.velocity.multiplyScalar(linearDrag);
    this.angularVelocity.multiplyScalar(angularDrag);
    this.group.position.addScaledVector(this.velocity, deltaTime);

    if (this.angularVelocity.lengthSq() > 0.000001) {
      deltaRotationEuler.set(
        this.angularVelocity.x * deltaTime,
        this.angularVelocity.y * deltaTime,
        this.angularVelocity.z * deltaTime,
      );
      deltaRotationQuaternion.setFromEuler(deltaRotationEuler);
      this.group.quaternion.multiply(deltaRotationQuaternion).normalize();
    }

    this.currentTiltAmount = THREE.MathUtils.damp(
      this.currentTiltAmount,
      this.targetTiltAmount,
      7,
      deltaTime,
    );
    this.boostAmount = THREE.MathUtils.damp(this.boostAmount, 0, 4.8, deltaTime);
    this.weaponRecoil = THREE.MathUtils.damp(this.weaponRecoil, 0, 11, deltaTime);
    this.damageFlash = THREE.MathUtils.damp(this.damageFlash, 0, 7.5, deltaTime);
    this.shieldImpactAmount = THREE.MathUtils.damp(this.shieldImpactAmount, 0, 9, deltaTime);

    const idleBob = Math.sin(this.floatTime * 1.7) * 0.08;
    const idleSway = Math.sin(this.floatTime * 0.9) * 0.04;
    const idlePitch = Math.sin(this.floatTime * 1.15) * 0.016;
    const boostStretch = this.boostAmount * 0.08;
    const bodySquash = 1 - this.boostAmount * 0.03;
    const glowPulse = 0.75
      + Math.sin(this.floatTime * 8.5) * 0.12
      + this.boostAmount * 0.95
      + this.timeDilationAmount * 0.45;
    const shieldPulse = this.damageFlash * 0.85
      + this.boostAmount * 0.08
      + this.timeDilationAmount * 0.22
      + this.stealthFieldAmount * 0.08
      + this.shieldFieldAmount * 0.52
      + this.shieldImpactAmount * 0.7;
    const stealthDimming = 1 - this.stealthFieldAmount * 0.45;

    this.visualRoot.position.y = idleBob;
    this.visualRoot.rotation.x = -0.06 + idlePitch + this.attitudeOffset.x;
    this.visualRoot.rotation.y = idleSway + this.weaponModeOffset * 0.08 + this.attitudeOffset.y;
    this.visualRoot.rotation.z = -this.currentTiltAmount * 0.32 + this.attitudeOffset.z;
    this.visualRoot.scale.set(bodySquash, bodySquash, 1 + boostStretch);

    this.weaponRig.position.z = -this.weaponRecoil;
    this.weaponRig.position.x = this.weaponModeOffset * 0.12;

    for (let index = 0; index < this.engineGlowMeshes.length; index += 1) {
      const glowMesh = this.engineGlowMeshes[index];
      const glowMaterial = this.engineGlowMaterials[index];
      const sizePulse = 1 + Math.sin(this.floatTime * 9 + index * 0.6) * 0.08 + this.boostAmount * 0.2;

      glowMaterial.emissiveIntensity = (2.1 + glowPulse) * stealthDimming;
      glowMesh.scale.set(1 * sizePulse, 0.82 * sizePulse, (1.28 + this.boostAmount * 0.4) * sizePulse);
    }

    for (let index = 0; index < this.engineTrailMeshes.length; index += 1) {
      const trailMesh = this.engineTrailMeshes[index];
      const trailMaterial = this.engineTrailMaterials[index];
      const trailPulse = 0.82 + Math.sin(this.floatTime * 9.4 + index * 0.45) * 0.08;

      trailMesh.scale.set(
        1,
        1,
        (0.62 + this.boostAmount * 0.88 + Math.abs(this.velocity.length()) * 0.015) * trailPulse,
      );
      trailMaterial.opacity = (0.16 + this.boostAmount * 0.26 + trailPulse * 0.08 + this.timeDilationAmount * 0.06) * stealthDimming;
    }

    for (let index = 0; index < this.navigationLightMaterials.length; index += 1) {
      this.navigationLightMaterials[index].opacity = (0.68 + Math.sin(this.floatTime * 6 + index * Math.PI) * 0.2) * (1 - this.stealthFieldAmount * 0.35);
    }

    this.shieldShell.visible = shieldPulse > 0.02;
    shieldColor.copy(this.baseShieldColor)
      .lerp(timeColor, this.timeDilationAmount * 0.85)
      .lerp(stealthColor, this.stealthFieldAmount * 0.55);
    this.shieldShellMaterial.color.copy(shieldColor);
    this.shieldShellMaterial.opacity = shieldPulse * 0.32;
    this.shieldShell.scale.set(
      1.05 + shieldPulse * 0.12 + this.shieldFieldAmount * 0.04,
      0.58 + shieldPulse * 0.08 + this.shieldFieldAmount * 0.03,
      1.8 + shieldPulse * 0.18 + this.shieldFieldAmount * 0.06,
    );

    this.updateCollisionBounds();
  }

  dispose() {
    disposeObjectResources(this.group);
  }
}
