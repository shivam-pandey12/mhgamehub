import * as THREE from 'three';
import { attackDuration, getAttackDefinition } from './combat';
import { clamp, smoothStep } from './math';
import type { ActorState } from './types';

interface LimbSegment {
  pivot: THREE.Group;
}

interface PoseSnapshot {
  position: THREE.Vector3;
  rotation: THREE.Euler;
}

export class StickmanRig {
  readonly root = new THREE.Group();
  private readonly body = new THREE.Group();
  private readonly torsoPivot = new THREE.Group();
  private readonly leftUpperArm: LimbSegment;
  private readonly leftLowerArm: LimbSegment;
  private readonly rightUpperArm: LimbSegment;
  private readonly rightLowerArm: LimbSegment;
  private readonly leftUpperLeg: LimbSegment;
  private readonly leftLowerLeg: LimbSegment;
  private readonly rightUpperLeg: LimbSegment;
  private readonly rightLowerLeg: LimbSegment;
  private readonly head: THREE.Mesh;
  private readonly bodyMaterials: THREE.MeshStandardMaterial[] = [];
  private readonly swordGroup = new THREE.Group();
  private readonly gunGroup = new THREE.Group();
  private readonly powerRodGroup = new THREE.Group();
  private readonly muzzleFlash: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  private readonly aura: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  private readonly bossBands: THREE.Group;
  private readonly bossStyle: boolean;
  private primaryColor: number;
  private auraColor: number;
  private accentColor: number;

  constructor(color: number, scale = 1, bossStyle = false) {
    this.bossStyle = bossStyle;
    this.primaryColor = color;
    this.auraColor = 0xffd75a;
    this.accentColor = bossStyle ? 0xffd9cf : 0xe7f2ff;

    const bodyMaterial = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.86,
      metalness: 0.08,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0,
    });
    const jointMaterial = new THREE.MeshStandardMaterial({
      color: bossStyle ? 0xffd9cf : 0xe7f2ff,
      roughness: 0.9,
      metalness: 0.03,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0,
    });
    const swordMaterial = new THREE.MeshStandardMaterial({
      color: 0xd9ecff,
      roughness: 0.28,
      metalness: 0.75,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0,
    });
    const hiltMaterial = new THREE.MeshStandardMaterial({
      color: 0x3c546f,
      roughness: 0.72,
      metalness: 0.22,
    });
    const gunMaterial = new THREE.MeshStandardMaterial({
      color: 0x334657,
      roughness: 0.72,
      metalness: 0.24,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0,
    });

    this.bodyMaterials.push(bodyMaterial, jointMaterial, swordMaterial, gunMaterial);
    this.root.scale.setScalar(scale);
    this.root.add(this.body);

    const pelvis = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), jointMaterial);
    pelvis.position.set(0, 1.02, 0);
    this.body.add(pelvis);

    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 1.02, 10), bodyMaterial);
    torso.position.set(0, 1.5, 0);
    torso.castShadow = true;
    this.body.add(torso);

    this.torsoPivot.position.set(0, 1.08, 0);
    this.body.add(this.torsoPivot);

    this.head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 20), jointMaterial);
    this.head.position.set(0, 1.16, 0);
    this.head.castShadow = true;
    this.torsoPivot.add(this.head);

    this.leftUpperArm = this.createLimb(bodyMaterial, 0.58, 0.075);
    this.leftUpperArm.pivot.position.set(-0.33, 0.74, 0);
    this.torsoPivot.add(this.leftUpperArm.pivot);

    this.leftLowerArm = this.createLimb(bodyMaterial, 0.48, 0.06);
    this.leftLowerArm.pivot.position.set(0, -0.58, 0);
    this.leftUpperArm.pivot.add(this.leftLowerArm.pivot);

    this.rightUpperArm = this.createLimb(bodyMaterial, 0.58, 0.075);
    this.rightUpperArm.pivot.position.set(0.33, 0.74, 0);
    this.torsoPivot.add(this.rightUpperArm.pivot);

    this.rightLowerArm = this.createLimb(bodyMaterial, 0.48, 0.06);
    this.rightLowerArm.pivot.position.set(0, -0.58, 0);
    this.rightUpperArm.pivot.add(this.rightLowerArm.pivot);

    this.leftUpperLeg = this.createLimb(bodyMaterial, 0.68, 0.08);
    this.leftUpperLeg.pivot.position.set(-0.17, 1.0, 0);
    this.body.add(this.leftUpperLeg.pivot);

    this.leftLowerLeg = this.createLimb(bodyMaterial, 0.62, 0.07);
    this.leftLowerLeg.pivot.position.set(0, -0.68, 0);
    this.leftUpperLeg.pivot.add(this.leftLowerLeg.pivot);

    this.rightUpperLeg = this.createLimb(bodyMaterial, 0.68, 0.08);
    this.rightUpperLeg.pivot.position.set(0.17, 1.0, 0);
    this.body.add(this.rightUpperLeg.pivot);

    this.rightLowerLeg = this.createLimb(bodyMaterial, 0.62, 0.07);
    this.rightLowerLeg.pivot.position.set(0, -0.68, 0);
    this.rightUpperLeg.pivot.add(this.rightLowerLeg.pivot);

    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.95, 0.12), swordMaterial);
    blade.position.set(0, -0.62, 0);
    const hilt = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.16), hiltMaterial);
    hilt.position.set(0, -0.16, 0);
    this.swordGroup.add(blade, hilt);
    this.swordGroup.position.set(0.02, -0.1, 0.02);
    this.swordGroup.rotation.z = 0.12;
    this.rightLowerArm.pivot.add(this.swordGroup);

    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.48), gunMaterial);
    stock.position.set(0, -0.28, 0.02);
    const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.72), gunMaterial);
    barrel.position.set(0, -0.18, 0.45);
    this.muzzleFlash = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 10, 10),
      new THREE.MeshBasicMaterial({
        color: 0xffd27a,
        transparent: true,
        opacity: 0.8,
      }),
    );
    this.muzzleFlash.position.set(0, -0.18, 0.84);
    this.gunGroup.add(stock, barrel, this.muzzleFlash);
    this.gunGroup.position.set(0.05, -0.26, 0.06);
    this.gunGroup.rotation.x = 1.42;
    this.rightLowerArm.pivot.add(this.gunGroup);

    const rodCore = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.94, 10), swordMaterial);
    rodCore.rotation.z = Math.PI / 2;
    rodCore.position.set(0.02, -0.48, 0);
    const rodHead = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 14), jointMaterial);
    rodHead.position.set(0.44, -0.48, 0);
    const rodTail = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), hiltMaterial);
    rodTail.position.set(-0.44, -0.48, 0);
    this.powerRodGroup.add(rodCore, rodHead, rodTail);
    this.powerRodGroup.position.set(0.04, -0.18, 0.02);
    this.rightLowerArm.pivot.add(this.powerRodGroup);

    this.aura = new THREE.Mesh(
      new THREE.SphereGeometry(0.95, 20, 20),
      new THREE.MeshBasicMaterial({
        color: 0xffd75a,
        transparent: true,
        opacity: 0,
        wireframe: true,
      }),
    );
    this.aura.position.set(0, 1.45, 0);
    this.root.add(this.aura);

    this.bossBands = new THREE.Group();
    if (bossStyle) {
      const bandMaterial = new THREE.MeshStandardMaterial({
        color: 0x301014,
        roughness: 0.5,
        metalness: 0.22,
      });
      const chestBand = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.045, 8, 20), bandMaterial);
      chestBand.rotation.x = Math.PI / 2;
      chestBand.position.set(0, 1.48, 0);
      const shoulderBand = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.04, 8, 20), bandMaterial);
      shoulderBand.rotation.x = Math.PI / 2;
      shoulderBand.position.set(0, 1.82, 0);
      this.bossBands.add(chestBand, shoulderBand);
      this.body.add(this.bossBands);
    }

    this.root.traverse((node: any) => {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
  }

  setPalette(primaryColor: number, auraColor: number, accentColor: number): void {
    this.primaryColor = primaryColor;
    this.auraColor = auraColor;
    this.accentColor = accentColor;
    const [bodyMaterial, jointMaterial, swordMaterial, gunMaterial] = this.bodyMaterials;
    bodyMaterial.color.setHex(primaryColor);
    jointMaterial.color.setHex(accentColor);
    swordMaterial.color.setHex(accentColor);
    gunMaterial.color.setHex(accentColor);
    this.aura.material.color.setHex(auraColor);
  }

  update(actor: ActorState, elapsedTime: number): void {
    this.root.position.set(actor.position.x, actor.position.y, actor.position.z);
    this.root.rotation.y = actor.facing;
    actor.animation.timer += 1 / 60;
    actor.animation.transitionProgress = Math.min(1, actor.animation.transitionProgress + 0.16);
    actor.animation.blend += (1 - actor.animation.blend) * 0.22;
    const previousPose = this.capturePoseSnapshot();
    const previousBasePose = actor.animation.basePose;
    this.resetPose();
    this.updateProps(actor);

    const horizontalSpeed = Math.abs(actor.velocity.x);
    const locomotionFactor = clamp(horizontalSpeed / Math.max(actor.motor.sprintSpeed, 0.001), 0, 1);
    let nextPose = 'idle';
    let nextBasePose = 'idle';

    if (actor.health <= 0) {
      nextPose = 'defeat';
      nextBasePose = 'defeat';
      this.applyDefeatPose();
    } else if (actor.animation.celebrating || actor.animation.celebrationTime > 0) {
      nextPose = 'celebrate';
      nextBasePose = 'celebrate';
      this.applyCelebratePose(actor, elapsedTime);
    } else if (actor.weaponSwitch.active) {
      nextPose = 'switch';
      nextBasePose = 'switch';
      this.applySwitchPose(actor);
    } else if (actor.defense.blocking) {
      nextPose = 'block';
      nextBasePose = 'block';
      this.applyBlockPose(actor);
    } else if (actor.defense.dashTimer > 0) {
      nextPose = 'dash';
      nextBasePose = 'dash';
      this.applyDodgePose(actor, elapsedTime);
    } else if (actor.hitReactTimer > 0) {
      nextPose = 'hit';
      nextBasePose = actor.defense.guardBreakTimer > 0 ? 'guard_break' : 'hit';
      this.applyHitReact(actor);
    } else if (actor.weaponMode === 'gun' && actor.gun.reloadTimer > 0) {
      nextPose = 'reload';
      nextBasePose = 'reload';
      this.applyReloadPose(actor, elapsedTime);
    } else if (actor.combat.attackName) {
      nextPose = actor.combat.attackName;
      nextBasePose = actor.combat.attackName;
      this.applyAttackPose(actor);
    } else if (!actor.grounded) {
      nextPose = 'jump';
      nextBasePose = 'jump';
      this.applyJumpPose(actor);
    } else if (horizontalSpeed > 0.18) {
      nextPose = actor.weaponMode === 'gun' ? 'gun_run' : 'run';
      nextBasePose = nextPose;
      this.applyRunPose(elapsedTime, locomotionFactor, actor.weaponMode === 'gun', actor.boss !== null);
    } else {
      this.applyIdlePose(elapsedTime, actor.weaponMode === 'gun', actor.boss !== null);
    }

    if (previousBasePose !== nextBasePose) {
      actor.animation.transitionProgress = 0;
    }
    actor.animation.pose = nextPose;
    actor.animation.basePose = nextBasePose;
    actor.animation.overlayPose = actor.animation.celebrating
      ? 'celebration'
      : actor.rage.active
        ? 'rage'
        : actor.power.overdriveActive
          ? 'overdrive'
          : actor.gun.muzzleFlashTimer > 0
            ? 'muzzle_flash'
            : null;
    this.applyPoseBlend(previousPose, actor);
  }

  private getBlendNodes(): THREE.Object3D[] {
    return [
      this.body,
      this.torsoPivot,
      this.head,
      this.leftUpperArm.pivot,
      this.leftLowerArm.pivot,
      this.rightUpperArm.pivot,
      this.rightLowerArm.pivot,
      this.leftUpperLeg.pivot,
      this.leftLowerLeg.pivot,
      this.rightUpperLeg.pivot,
      this.rightLowerLeg.pivot,
    ];
  }

  private capturePoseSnapshot(): Map<THREE.Object3D, PoseSnapshot> {
    return new Map(
      this.getBlendNodes().map((node) => [
        node,
        {
          position: node.position.clone(),
          rotation: new THREE.Euler(node.rotation.x, node.rotation.y, node.rotation.z, node.rotation.order),
        },
      ]),
    );
  }

  private applyPoseBlend(previousPose: Map<THREE.Object3D, PoseSnapshot>, actor: ActorState): void {
    const fastState = actor.combat.attackName !== null || actor.defense.dashTimer > 0;
    const heavyState = actor.hitReactTimer > 0 || actor.animation.celebrating;
    const baseBlend = fastState ? 0.44 : heavyState ? 0.36 : 0.26;
    const alpha = clamp(baseBlend + actor.animation.transitionProgress * 0.52, 0.18, 1);

    for (const node of this.getBlendNodes()) {
      const previous = previousPose.get(node);
      if (!previous) {
        continue;
      }
      node.position.lerpVectors(previous.position, node.position, alpha);
      node.rotation.x = THREE.MathUtils.lerp(previous.rotation.x, node.rotation.x, alpha);
      node.rotation.y = THREE.MathUtils.lerp(previous.rotation.y, node.rotation.y, alpha);
      node.rotation.z = THREE.MathUtils.lerp(previous.rotation.z, node.rotation.z, alpha);
    }
  }

  private createLimb(material: THREE.Material, length: number, radius: number): LimbSegment {
    const pivot = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 8), material);
    mesh.position.y = -length / 2;
    pivot.add(mesh);
    return { pivot };
  }

  private updateProps(actor: ActorState): void {
    const showWeapons = !this.bossStyle;
    this.swordGroup.visible = showWeapons && actor.weaponMode === 'sword';
    this.gunGroup.visible = showWeapons && actor.weaponMode === 'gun';
    this.powerRodGroup.visible = showWeapons && actor.weaponMode === 'power';
    this.muzzleFlash.visible = showWeapons && actor.weaponMode === 'gun' && actor.gun.muzzleFlashTimer > 0;
    if (this.muzzleFlash.visible) {
      const flashScale = 1 + actor.gun.muzzleFlashTimer * 4;
      this.muzzleFlash.scale.setScalar(flashScale);
      this.muzzleFlash.material.opacity = clamp(actor.gun.muzzleFlashTimer * 12, 0, 0.9);
    }

    const silhouette = actor.presentationMode === '2d' || actor.silhouette;
    const rageGlow = actor.rage.active ? 0.95 : 0;
    const powerGlow = actor.power.glowIntensity;
    const glow = Math.max(powerGlow, rageGlow * 0.8);
    const emissiveColor = silhouette ? 0x000000 : actor.rage.active ? 0xff4d3d : glow > 0.01 ? 0xffc33d : 0x000000;

    const [bodyMaterial, jointMaterial, swordMaterial, gunMaterial] = this.bodyMaterials;
    if (silhouette) {
      bodyMaterial.color.setHex(0x050505);
      jointMaterial.color.setHex(0x050505);
      swordMaterial.color.setHex(0x050505);
      gunMaterial.color.setHex(0x050505);
    } else {
      bodyMaterial.color.setHex(this.primaryColor);
      jointMaterial.color.setHex(this.accentColor);
      swordMaterial.color.setHex(this.accentColor);
      gunMaterial.color.setHex(this.accentColor);
    }

    for (const material of this.bodyMaterials) {
      material.emissive.setHex(emissiveColor);
      material.emissiveIntensity = silhouette ? 0 : actor.rage.active ? 1.2 + powerGlow * 0.6 : glow * 1.9;
    }

    this.aura.visible = !silhouette && (glow > 0.05 || actor.rage.tintStrength > 0.08);
    this.aura.material.color.setHex(actor.rage.active ? 0xff5638 : powerGlow > 0.02 ? this.auraColor : 0x9fd1ff);
    this.aura.material.opacity = silhouette ? 0 : actor.rage.active ? 0.22 + actor.rage.tintStrength * 0.12 : glow * 0.22;
    const auraScale = 1 + glow * 0.28 + actor.rage.tintStrength * 0.2;
    this.aura.scale.setScalar(auraScale);
    this.aura.rotation.y += 0.02 + glow * 0.03 + actor.rage.tintStrength * 0.04;
    this.powerRodGroup.rotation.z = actor.power.glowIntensity * 0.18;
    this.bossBands.visible = this.bossStyle && actor.boss !== null;
  }

  private resetPose(): void {
    this.body.position.set(0, 0, 0);
    this.body.rotation.set(0, 0, 0);
    this.torsoPivot.rotation.set(0, 0, 0);
    this.head.rotation.set(0, 0, 0);

    this.leftUpperArm.pivot.rotation.set(0.12, 0, -0.16);
    this.leftLowerArm.pivot.rotation.set(-0.12, 0, 0);
    this.rightUpperArm.pivot.rotation.set(0.12, 0, 0.16);
    this.rightLowerArm.pivot.rotation.set(-0.12, 0, 0);

    this.leftUpperLeg.pivot.rotation.set(0, 0, 0);
    this.leftLowerLeg.pivot.rotation.set(0.08, 0, 0);
    this.rightUpperLeg.pivot.rotation.set(0, 0, 0);
    this.rightLowerLeg.pivot.rotation.set(0.08, 0, 0);
  }

  private applyIdlePose(time: number, gunMode: boolean, bossIdle: boolean): void {
    const sway = Math.sin(time * (bossIdle ? 1.8 : 2.3)) * 0.06;
    this.body.position.y += Math.sin(time * (bossIdle ? 2 : 2.3)) * 0.03;
    this.torsoPivot.rotation.z = sway * 0.3;
    this.torsoPivot.rotation.x = bossIdle ? -0.08 : 0;
    this.leftUpperArm.pivot.rotation.x += sway;
    this.rightUpperArm.pivot.rotation.x -= sway;
    this.leftUpperLeg.pivot.rotation.x -= sway * 0.35;
    this.rightUpperLeg.pivot.rotation.x += sway * 0.35;
    this.head.rotation.z = -sway * 0.2;

    if (bossIdle) {
      this.leftUpperArm.pivot.rotation.x = -0.18;
      this.rightUpperArm.pivot.rotation.x = -0.18;
      this.leftLowerArm.pivot.rotation.x = -0.24;
      this.rightLowerArm.pivot.rotation.x = -0.24;
      this.body.position.y += 0.02;
    }

    if (gunMode) {
      this.rightUpperArm.pivot.rotation.x = -0.4;
      this.rightUpperArm.pivot.rotation.z = 0.05;
      this.rightLowerArm.pivot.rotation.x = -0.88;
      this.leftUpperArm.pivot.rotation.x = -0.24;
      this.leftUpperArm.pivot.rotation.z = -0.22;
      this.leftLowerArm.pivot.rotation.x = -0.74;
      this.torsoPivot.rotation.y = 0.05;
    }
  }

  private applyRunPose(time: number, factor: number, aimingGun: boolean, bossRun: boolean): void {
    const cycle = time * (bossRun ? 7 + factor * 5 : 9 + factor * 6);
    const swing = Math.sin(cycle);
    const secondary = Math.sin(cycle + Math.PI / 2);

    this.body.position.y += Math.abs(swing) * 0.06 * factor;
    this.torsoPivot.rotation.x = bossRun ? -0.22 - factor * 0.1 : -0.16 - factor * 0.08;
    this.torsoPivot.rotation.y = secondary * 0.08 * factor;

    if (aimingGun) {
      this.applyAimPose(undefined);
      this.body.position.y += Math.abs(swing) * 0.02;
      this.leftUpperLeg.pivot.rotation.x = -swing * 0.72 * factor;
      this.rightUpperLeg.pivot.rotation.x = swing * 0.72 * factor;
      this.leftLowerLeg.pivot.rotation.x = 0.08 + Math.max(0, swing) * 0.62 * factor;
      this.rightLowerLeg.pivot.rotation.x = 0.08 + Math.max(0, -swing) * 0.62 * factor;
      return;
    }

    const armFactor = bossRun ? 0.56 : 0.75;
    const legFactor = bossRun ? 0.88 : 1.05;
    this.leftUpperArm.pivot.rotation.x = 0.18 + swing * armFactor * factor;
    this.rightUpperArm.pivot.rotation.x = 0.18 - swing * armFactor * factor;
    this.leftLowerArm.pivot.rotation.x = -0.24 + Math.max(0, -swing) * 0.28 * factor;
    this.rightLowerArm.pivot.rotation.x = -0.24 + Math.max(0, swing) * 0.28 * factor;

    this.leftUpperLeg.pivot.rotation.x = -swing * legFactor * factor;
    this.rightUpperLeg.pivot.rotation.x = swing * legFactor * factor;
    this.leftLowerLeg.pivot.rotation.x = 0.08 + Math.max(0, swing) * 0.85 * factor;
    this.rightLowerLeg.pivot.rotation.x = 0.08 + Math.max(0, -swing) * 0.85 * factor;
  }

  private applyJumpPose(actor: ActorState): void {
    const falling = actor.velocity.y < 0;
    this.torsoPivot.rotation.x = falling ? 0.1 : -0.06;
    this.leftUpperArm.pivot.rotation.x = actor.weaponMode === 'gun' ? -0.48 : -0.75;
    this.rightUpperArm.pivot.rotation.x = actor.weaponMode === 'gun' ? -0.62 : -0.75;
    this.leftLowerArm.pivot.rotation.x = -0.2;
    this.rightLowerArm.pivot.rotation.x = -0.2;
    this.leftUpperLeg.pivot.rotation.x = 0.32;
    this.rightUpperLeg.pivot.rotation.x = 0.32;
    this.leftLowerLeg.pivot.rotation.x = falling ? 0.55 : 0.18;
    this.rightLowerLeg.pivot.rotation.x = falling ? 0.55 : 0.18;
    this.body.position.y += 0.04;
  }

  private applySwitchPose(actor: ActorState): void {
    const progress = 1 - actor.weaponSwitch.timer / Math.max(actor.weaponSwitch.duration, 0.001);
    const fold = smoothStep(0, 1, progress);
    this.torsoPivot.rotation.y = 0.16 * Math.sin(progress * Math.PI);
    this.torsoPivot.rotation.x = -0.1 * fold;
    this.leftUpperArm.pivot.rotation.x = -0.9 * fold;
    this.rightUpperArm.pivot.rotation.x = -0.9 * fold;
    this.leftLowerArm.pivot.rotation.x = -0.7 * fold;
    this.rightLowerArm.pivot.rotation.x = -0.9 * fold;
    this.leftUpperLeg.pivot.rotation.x = 0.16 * Math.sin(progress * Math.PI);
    this.rightUpperLeg.pivot.rotation.x = -0.16 * Math.sin(progress * Math.PI);
    this.body.position.y += Math.sin(progress * Math.PI) * 0.04;
  }

  private applyAimPose(actor?: ActorState): void {
    const recoil = actor ? actor.gun.recoil * 0.04 : 0;
    this.torsoPivot.rotation.x = -0.06 + recoil;
    this.torsoPivot.rotation.y = 0.08;
    this.leftUpperArm.pivot.rotation.x = -1.12 + recoil * 0.4;
    this.leftUpperArm.pivot.rotation.z = -0.28;
    this.leftLowerArm.pivot.rotation.x = -1.02;
    this.rightUpperArm.pivot.rotation.x = -1.24 + recoil * 0.7;
    this.rightUpperArm.pivot.rotation.z = 0.08;
    this.rightLowerArm.pivot.rotation.x = -1.08;
    this.leftUpperLeg.pivot.rotation.x = 0.05;
    this.rightUpperLeg.pivot.rotation.x = -0.05;
  }

  private applyReloadPose(actor: ActorState, elapsedTime: number): void {
    const duration = Math.max(actor.gun.reloadDuration, 0.001);
    const progress = 1 - actor.gun.reloadTimer / duration;
    const rhythm = Math.sin(progress * Math.PI * 2) * 0.2;
    this.torsoPivot.rotation.x = -0.04;
    this.torsoPivot.rotation.y = 0.22;
    this.rightUpperArm.pivot.rotation.x = -1.25 + progress * 0.18;
    this.rightUpperArm.pivot.rotation.z = 0.16;
    this.rightLowerArm.pivot.rotation.x = -1.22 + rhythm;
    this.leftUpperArm.pivot.rotation.x = -0.72 - progress * 0.22;
    this.leftUpperArm.pivot.rotation.z = -0.42;
    this.leftLowerArm.pivot.rotation.x = -0.84 - rhythm * 0.9;
    this.body.position.y += Math.sin(elapsedTime * 16) * 0.01;
  }

  private applyAttackPose(actor: ActorState): void {
    const definition = getAttackDefinition(actor.combat.attackName);
    if (!definition) {
      return;
    }

    const progress = clamp(actor.combat.phaseTime / attackDuration(definition), 0, 1);

    switch (actor.combat.attackName) {
      case 'sword_light1':
        this.applySwordAttack1(progress);
        break;
      case 'sword_light2':
        this.applySwordAttack2(progress);
        break;
      case 'sword_light3':
      case 'sword_launcher':
      case 'sword_heavy':
        this.applySwordAttack3(progress);
        break;
      case 'sword_air':
        this.applySwordAttack1(progress);
        this.body.position.y += Math.sin(progress * Math.PI) * 0.12;
        break;
      case 'gun_light1':
      case 'gun_light2':
      case 'gun_heavy':
      case 'gun_air':
        this.applyAimPose(actor);
        this.torsoPivot.rotation.x += Math.sin(progress * Math.PI) * 0.12;
        this.body.position.z -= Math.sin(progress * Math.PI) * 0.08;
        break;
      case 'power_light1':
        this.applyPowerAttack1(progress, actor.power.overdriveActive, actor.rage.active);
        break;
      case 'power_light2':
      case 'power_heavy':
      case 'power_launcher':
        this.applyPowerAttack2(progress, actor.power.overdriveActive, actor.rage.active);
        break;
      case 'power_air':
        this.applyPowerAttack1(progress, actor.power.overdriveActive, actor.rage.active);
        this.body.position.y += Math.sin(progress * Math.PI) * 0.14;
        break;
      case 'fighter_heavy':
      case 'boss_heavy':
        this.applyBossSmash(progress);
        break;
      case 'fighter_light1':
      case 'boss_light1':
        this.applyBossCombo1(progress);
        break;
      case 'fighter_light2':
      case 'fighter_launcher':
      case 'fighter_air':
      case 'boss_light2':
      case 'boss_launcher':
        this.applyBossCombo2(progress);
        break;
      case 'boss_dash':
        this.applyBossDash(progress);
        break;
    }
  }

  private applySwordAttack1(progress: number): void {
    const windup = smoothStep(0, 0.3, progress);
    const strike = smoothStep(0.3, 0.62, progress);
    const recover = smoothStep(0.62, 1, progress);
    this.body.position.z -= strike * 0.14;
    this.torsoPivot.rotation.x = -0.08 + recover * 0.16;
    this.torsoPivot.rotation.y = -0.52 * windup + 0.64 * strike - 0.16 * recover;
    this.rightUpperArm.pivot.rotation.x = -2.0 * windup + 1.64 * strike;
    this.rightUpperArm.pivot.rotation.z = 0.3 - 0.14 * strike;
    this.rightLowerArm.pivot.rotation.x = -0.98 * windup + 0.62 * strike;
    this.leftUpperArm.pivot.rotation.x = 0.5 - 0.2 * recover;
    this.leftUpperArm.pivot.rotation.z = -0.52;
    this.leftLowerArm.pivot.rotation.x = -0.2;
    this.leftUpperLeg.pivot.rotation.x = 0.18 * strike;
    this.rightUpperLeg.pivot.rotation.x = -0.22 * strike;
    this.leftLowerLeg.pivot.rotation.x = 0.22;
    this.rightLowerLeg.pivot.rotation.x = 0.3;
  }

  private applySwordAttack2(progress: number): void {
    const windup = smoothStep(0, 0.26, progress);
    const strike = smoothStep(0.26, 0.58, progress);
    const recover = smoothStep(0.58, 1, progress);
    this.body.position.z -= strike * 0.18;
    this.body.position.y += Math.sin(progress * Math.PI) * 0.05;
    this.torsoPivot.rotation.x = -0.16 + recover * 0.22;
    this.torsoPivot.rotation.y = 0.52 * windup - 0.7 * strike + 0.18 * recover;
    this.rightUpperArm.pivot.rotation.x = -1.78 * windup + 1.48 * strike;
    this.rightUpperArm.pivot.rotation.z = 0.2 - 0.12 * strike;
    this.rightLowerArm.pivot.rotation.x = -0.72 + strike * 0.68;
    this.leftUpperArm.pivot.rotation.x = -1.36 * windup + 1.16 * strike;
    this.leftUpperArm.pivot.rotation.z = -0.36 + 0.18 * strike;
    this.leftLowerArm.pivot.rotation.x = -0.6 + strike * 0.72;
    this.leftUpperLeg.pivot.rotation.x = 0.34 * strike;
    this.rightUpperLeg.pivot.rotation.x = -0.3 * strike;
    this.leftLowerLeg.pivot.rotation.x = 0.28;
    this.rightLowerLeg.pivot.rotation.x = 0.34;
  }

  private applySwordAttack3(progress: number): void {
    const windup = smoothStep(0, 0.24, progress);
    const strike = smoothStep(0.24, 0.56, progress);
    const recover = smoothStep(0.56, 1, progress);
    this.body.position.z -= strike * 0.24;
    this.body.position.y += Math.sin(progress * Math.PI) * 0.08;
    this.torsoPivot.rotation.x = -0.22 + recover * 0.34;
    this.torsoPivot.rotation.y = -0.85 * windup + 1.05 * strike - 0.24 * recover;
    this.torsoPivot.rotation.z = -0.18 * windup + 0.16 * strike;
    this.rightUpperArm.pivot.rotation.x = -2.24 * windup + 1.92 * strike;
    this.rightUpperArm.pivot.rotation.z = 0.38 - 0.18 * strike;
    this.rightLowerArm.pivot.rotation.x = -1.08 + strike * 0.82;
    this.leftUpperArm.pivot.rotation.x = 0.22 + strike * 0.42;
    this.leftUpperArm.pivot.rotation.z = -0.7 + strike * 0.08;
    this.leftLowerArm.pivot.rotation.x = -0.18 + strike * 0.12;
    this.leftUpperLeg.pivot.rotation.x = 0.54 * strike;
    this.rightUpperLeg.pivot.rotation.x = -0.44 * strike;
    this.leftLowerLeg.pivot.rotation.x = 0.42;
    this.rightLowerLeg.pivot.rotation.x = 0.52;
  }

  private applyPowerAttack1(progress: number, overdrive: boolean, rage: boolean): void {
    const windup = smoothStep(0, 0.34, progress);
    const strike = smoothStep(0.34, 0.62, progress);
    this.body.position.z -= strike * 0.18;
    this.body.position.y += Math.sin(progress * Math.PI) * 0.05;
    this.torsoPivot.rotation.x = -0.12 + strike * 0.12;
    this.torsoPivot.rotation.y = -0.32 * windup + 0.48 * strike;
    this.rightUpperArm.pivot.rotation.x = -1.72 * windup + 1.34 * strike;
    this.rightUpperArm.pivot.rotation.z = 0.14;
    this.rightLowerArm.pivot.rotation.x = -0.94 + strike * 0.68;
    this.leftUpperArm.pivot.rotation.x = -0.34 + strike * 0.2;
    this.leftUpperArm.pivot.rotation.z = -0.44;
    this.leftLowerArm.pivot.rotation.x = -0.3;
    if (overdrive || rage) {
      this.head.rotation.z = Math.sin(progress * Math.PI) * 0.08;
      this.body.position.y += 0.03;
      this.torsoPivot.rotation.z = -0.08 * windup + 0.12 * strike;
    }
  }

  private applyPowerAttack2(progress: number, overdrive: boolean, rage: boolean): void {
    const windup = smoothStep(0, 0.28, progress);
    const strike = smoothStep(0.28, 0.58, progress);
    this.body.position.z -= strike * 0.24;
    this.body.position.y += Math.sin(progress * Math.PI) * 0.08;
    this.torsoPivot.rotation.x = -0.16 + strike * 0.18;
    this.torsoPivot.rotation.y = 0.4 * windup - 0.62 * strike;
    this.leftUpperArm.pivot.rotation.x = -1.78 * windup + 1.56 * strike;
    this.leftUpperArm.pivot.rotation.z = -0.18;
    this.leftLowerArm.pivot.rotation.x = -0.96 + strike * 0.88;
    this.rightUpperArm.pivot.rotation.x = 0.2 + strike * 0.24;
    this.rightUpperArm.pivot.rotation.z = 0.34;
    this.rightLowerArm.pivot.rotation.x = -0.18;
    this.leftUpperLeg.pivot.rotation.x = 0.28 * strike;
    this.rightUpperLeg.pivot.rotation.x = -0.24 * strike;
    if (overdrive || rage) {
      this.torsoPivot.rotation.z = -0.12 * windup + 0.18 * strike;
      this.body.position.y += 0.04;
    }
  }

  private applyBossSmash(progress: number): void {
    const windup = smoothStep(0, 0.42, progress);
    const strike = smoothStep(0.42, 0.7, progress);
    this.body.position.z -= strike * 0.22;
    this.body.position.y += Math.sin(progress * Math.PI) * 0.12;
    this.torsoPivot.rotation.x = -0.35 * windup + 0.44 * strike;
    this.leftUpperArm.pivot.rotation.x = -2.0 * windup + 1.6 * strike;
    this.rightUpperArm.pivot.rotation.x = -2.0 * windup + 1.6 * strike;
    this.leftLowerArm.pivot.rotation.x = -0.75 + strike * 0.34;
    this.rightLowerArm.pivot.rotation.x = -0.75 + strike * 0.34;
    this.leftUpperLeg.pivot.rotation.x = 0.3 * strike;
    this.rightUpperLeg.pivot.rotation.x = -0.24 * strike;
  }

  private applyBossCombo1(progress: number): void {
    const windup = smoothStep(0, 0.25, progress);
    const strike = smoothStep(0.25, 0.58, progress);
    this.body.position.z -= strike * 0.18;
    this.torsoPivot.rotation.x = -0.14 + strike * 0.1;
    this.torsoPivot.rotation.y = -0.28 * windup + 0.42 * strike;
    this.rightUpperArm.pivot.rotation.x = -1.68 * windup + 1.12 * strike;
    this.rightLowerArm.pivot.rotation.x = -0.84 + strike * 0.6;
    this.leftUpperArm.pivot.rotation.x = -0.18;
    this.leftUpperArm.pivot.rotation.z = -0.22;
  }

  private applyBossCombo2(progress: number): void {
    const windup = smoothStep(0, 0.24, progress);
    const strike = smoothStep(0.24, 0.56, progress);
    this.body.position.z -= strike * 0.2;
    this.torsoPivot.rotation.x = -0.16 + strike * 0.14;
    this.torsoPivot.rotation.y = 0.24 * windup - 0.46 * strike;
    this.leftUpperArm.pivot.rotation.x = -1.72 * windup + 1.16 * strike;
    this.leftLowerArm.pivot.rotation.x = -0.86 + strike * 0.68;
    this.rightUpperArm.pivot.rotation.x = -0.1;
    this.rightUpperArm.pivot.rotation.z = 0.26;
  }

  private applyBossDash(progress: number): void {
    const windup = smoothStep(0, 0.2, progress);
    const strike = smoothStep(0.2, 0.54, progress);
    this.body.position.z -= strike * 0.26;
    this.torsoPivot.rotation.x = -0.28 + strike * 0.2;
    this.torsoPivot.rotation.y = -0.18 * windup + 0.22 * strike;
    this.leftUpperArm.pivot.rotation.x = -0.9 + strike * 0.36;
    this.rightUpperArm.pivot.rotation.x = -1.28 * windup + 0.92 * strike;
    this.rightLowerArm.pivot.rotation.x = -0.92 + strike * 0.54;
    this.leftUpperLeg.pivot.rotation.x = 0.52 * strike;
    this.rightUpperLeg.pivot.rotation.x = -0.42 * strike;
  }

  private applyBlockPose(actor: ActorState): void {
    const telegraph = clamp(actor.defense.guardBreakTimer * 4, 0, 1);
    this.torsoPivot.rotation.x = -0.08;
    this.torsoPivot.rotation.y = 0.08;
    this.leftUpperArm.pivot.rotation.x = -1.12 + telegraph * 0.25;
    this.leftUpperArm.pivot.rotation.z = -0.45;
    this.leftLowerArm.pivot.rotation.x = -1.0;
    this.rightUpperArm.pivot.rotation.x = -1.24 + telegraph * 0.2;
    this.rightUpperArm.pivot.rotation.z = 0.38;
    this.rightLowerArm.pivot.rotation.x = -1.02;
    this.leftUpperLeg.pivot.rotation.x = 0.1;
    this.rightUpperLeg.pivot.rotation.x = -0.08;
  }

  private applyDodgePose(actor: ActorState, elapsedTime: number): void {
    const drift = Math.sin(elapsedTime * 22) * 0.03;
    const telegraph = clamp(actor.defense.dashTimer * 5, 0, 1);
    this.body.position.x += drift;
    this.body.position.y += 0.04;
    this.torsoPivot.rotation.z = -0.26 + telegraph * 0.18;
    this.torsoPivot.rotation.x = -0.18;
    this.leftUpperArm.pivot.rotation.x = -0.4;
    this.rightUpperArm.pivot.rotation.x = -0.6;
    this.leftUpperLeg.pivot.rotation.x = 0.28;
    this.rightUpperLeg.pivot.rotation.x = -0.42;
  }

  private applyHitReact(actor: ActorState): void {
    const intensity = clamp(actor.hitReactTimer / 0.42, 0, 1);
    this.body.position.z += 0.2 * intensity;
    this.torsoPivot.rotation.x = 0.38 * intensity;
    this.torsoPivot.rotation.z = 0.2 * intensity;
    this.head.rotation.x = -0.24 * intensity;

    this.leftUpperArm.pivot.rotation.x = -1.1 * intensity;
    this.rightUpperArm.pivot.rotation.x = -1.3 * intensity;
    this.leftLowerArm.pivot.rotation.x = -0.5 * intensity;
    this.rightLowerArm.pivot.rotation.x = -0.6 * intensity;

    this.leftUpperLeg.pivot.rotation.x = 0.26 * intensity;
    this.rightUpperLeg.pivot.rotation.x = 0.26 * intensity;
    this.leftLowerLeg.pivot.rotation.x = 0.42 * intensity;
    this.rightLowerLeg.pivot.rotation.x = 0.42 * intensity;
  }

  private applyDefeatPose(): void {
    this.body.position.set(0, 0.18, 0);
    this.body.rotation.z = -1.28;
    this.torsoPivot.rotation.x = 0.4;
    this.head.rotation.x = -0.28;
    this.leftUpperArm.pivot.rotation.x = -1.4;
    this.rightUpperArm.pivot.rotation.x = -1.1;
    this.leftUpperLeg.pivot.rotation.x = 0.82;
    this.rightUpperLeg.pivot.rotation.x = -0.38;
    this.leftLowerLeg.pivot.rotation.x = 0.4;
    this.rightLowerLeg.pivot.rotation.x = 0.82;
  }

  private applyCelebratePose(actor: ActorState, elapsedTime: number): void {
    const bounce = Math.abs(Math.sin(elapsedTime * 6.8)) * 0.08;
    const flourish = Math.sin(elapsedTime * 5.2) * 0.18;
    this.body.position.y += bounce;
    this.torsoPivot.rotation.x = -0.12;
    this.torsoPivot.rotation.z = flourish * 0.18;
    this.head.rotation.z = flourish * 0.1;
    this.leftUpperArm.pivot.rotation.x = -1.15 + bounce * 0.4;
    this.leftUpperArm.pivot.rotation.z = -0.42;
    this.leftLowerArm.pivot.rotation.x = -0.62;
    this.rightUpperArm.pivot.rotation.x = actor.weaponMode === 'gun' ? -1.28 : -1.52 + bounce * 0.6;
    this.rightUpperArm.pivot.rotation.z = actor.weaponMode === 'gun' ? 0.18 : 0.42;
    this.rightLowerArm.pivot.rotation.x = actor.weaponMode === 'gun' ? -1.04 : -0.52;
    this.leftUpperLeg.pivot.rotation.x = -0.18 + flourish * 0.12;
    this.rightUpperLeg.pivot.rotation.x = 0.22 - flourish * 0.12;
    this.leftLowerLeg.pivot.rotation.x = 0.22;
    this.rightLowerLeg.pivot.rotation.x = 0.32;
  }
}
