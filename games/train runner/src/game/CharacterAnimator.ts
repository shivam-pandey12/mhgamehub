import * as THREE from 'three';
import { expDecay, smoothstep } from './math';
import type { PlayerSnapshot } from './types';

type BodyPart =
  | 'rig'
  | 'spine'
  | 'head'
  | 'leftShoulder'
  | 'rightShoulder'
  | 'leftElbow'
  | 'rightElbow'
  | 'leftHip'
  | 'rightHip'
  | 'leftKnee'
  | 'rightKnee'
  | 'leftFoot'
  | 'rightFoot';

export class CharacterAnimator {
  readonly group = new THREE.Group();

  private readonly parts = new Map<BodyPart, THREE.Object3D>();
  private readonly materialSuit = new THREE.MeshStandardMaterial({
    color: 0x202838,
    roughness: 0.48,
    metalness: 0.38
  });
  private readonly materialArmor = new THREE.MeshStandardMaterial({
    color: 0xd8e3ec,
    roughness: 0.32,
    metalness: 0.42
  });
  private readonly materialAccent = new THREE.MeshStandardMaterial({
    color: 0x38e8ff,
    emissive: 0x1b93cc,
    emissiveIntensity: 0.95,
    roughness: 0.2,
    metalness: 0.24
  });
  private readonly materialVisor = new THREE.MeshStandardMaterial({
    color: 0x07101f,
    emissive: 0x083c5d,
    emissiveIntensity: 1.35,
    roughness: 0.16,
    metalness: 0.6
  });

  private strideBlend = 0;
  private compression = 0;
  private lastState = '';

  constructor() {
    this.group.name = 'Procedural agile runner';
    this.group.scale.setScalar(0.78);
    this.buildRig();
  }

  update(snapshot: PlayerSnapshot, dt: number): void {
    const moving = snapshot.grounded && snapshot.state !== 'sliding' && snapshot.state !== 'failed';
    const runTarget = moving ? THREE.MathUtils.clamp(snapshot.forwardSpeed / 15.5, 0, 1.15) : 0;
    this.strideBlend = expDecay(this.strideBlend, runTarget, 10, dt);
    this.compression = expDecay(this.compression, snapshot.compression, 16, dt);

    const rig = this.part('rig');
    const spine = this.part('spine');
    const head = this.part('head');
    const leftShoulder = this.part('leftShoulder');
    const rightShoulder = this.part('rightShoulder');
    const leftElbow = this.part('leftElbow');
    const rightElbow = this.part('rightElbow');
    const leftHip = this.part('leftHip');
    const rightHip = this.part('rightHip');
    const leftKnee = this.part('leftKnee');
    const rightKnee = this.part('rightKnee');
    const leftFoot = this.part('leftFoot');
    const rightFoot = this.part('rightFoot');

    const phase = snapshot.stride;
    const sin = Math.sin(phase);
    const cos = Math.cos(phase);
    const slide = snapshot.state === 'sliding' ? smoothstep(0, 0.18, snapshot.stateTime) : 0;
    const airborne = snapshot.state === 'jumping' || snapshot.state === 'airborne' || snapshot.state === 'falling';
    const landing = snapshot.state === 'landing' ? 1 - smoothstep(0, 0.22, snapshot.stateTime) : 0;
    const dodge = snapshot.state === 'dodging' ? 1 - smoothstep(0.12, 0.3, snapshot.stateTime) : 0;
    const attack = snapshot.attackPose;
    const dashStrike = snapshot.dashStrike;
    const recoil = snapshot.recoil;
    const perfectDodge = snapshot.perfectDodge;

    rig.position.y = 1.32 + cos * 0.045 * this.strideBlend - this.compression * 0.24 - slide * 0.42 - landing * 0.18;
    rig.scale.set(1 + this.compression * 0.04, 1 - this.compression * 0.07 - slide * 0.18, 1 + slide * 0.08);
    rig.rotation.x = -0.14 - snapshot.forwardSpeed * 0.006 + slide * 0.64 - (airborne ? 0.09 : 0);
    rig.rotation.z = -snapshot.lean * 0.24 - Math.sign(snapshot.lateralVelocity) * dodge * 0.34;
    rig.rotation.y = -snapshot.lean * 0.08;

    spine.rotation.x = -0.05 + sin * 0.035 * this.strideBlend + slide * 0.62 + landing * 0.18;
    spine.rotation.y = -snapshot.lean * 0.11;
    spine.rotation.z = snapshot.lean * 0.08;

    head.rotation.x = 0.07 - slide * 0.22;
    head.rotation.y = snapshot.lean * 0.06 - sin * 0.018 * this.strideBlend;
    head.rotation.z = -snapshot.lean * 0.1;

    leftShoulder.rotation.x = -sin * 0.86 * this.strideBlend - 0.1 + slide * 0.55;
    rightShoulder.rotation.x = sin * 0.86 * this.strideBlend - 0.1 + slide * 0.55;
    leftShoulder.rotation.z = 0.18 + slide * 0.35 + dodge * 0.18;
    rightShoulder.rotation.z = -0.18 - slide * 0.35 - dodge * 0.18;
    leftElbow.rotation.x = -0.74 - Math.max(0, -sin) * 0.38;
    rightElbow.rotation.x = -0.74 - Math.max(0, sin) * 0.38;

    leftHip.rotation.x = sin * 0.72 * this.strideBlend - landing * 0.32 + slide * 0.92;
    rightHip.rotation.x = -sin * 0.72 * this.strideBlend - landing * 0.32 + slide * 0.72;
    leftHip.rotation.z = 0.05 + snapshot.lean * 0.08;
    rightHip.rotation.z = -0.05 + snapshot.lean * 0.08;

    leftKnee.rotation.x = -0.35 - Math.max(0, -sin) * 0.72 - slide * 1.08 - landing * 0.52;
    rightKnee.rotation.x = -0.35 - Math.max(0, sin) * 0.72 - slide * 0.72 - landing * 0.52;
    leftFoot.rotation.x = 0.16 + Math.max(0, -sin) * 0.28 + slide * 0.45;
    rightFoot.rotation.x = 0.16 + Math.max(0, sin) * 0.28 + slide * 0.28;

    if (airborne) {
      const takeoff = snapshot.state === 'jumping' ? 1 - smoothstep(0.04, 0.28, snapshot.stateTime) : 0;
      leftShoulder.rotation.x = -1.02 + takeoff * 0.4;
      rightShoulder.rotation.x = -0.62 + takeoff * 0.2;
      leftHip.rotation.x = 0.35;
      rightHip.rotation.x = -0.24;
      leftKnee.rotation.x = -0.82;
      rightKnee.rotation.x = -0.48;
      rig.position.y += 0.08 * Math.sin(snapshot.stateTime * 9);
    }

    if (attack > 0) {
      const swing = Math.sin((1 - attack) * Math.PI);
      rig.rotation.y += 0.24 * swing + dashStrike * 0.22;
      rig.rotation.x -= 0.16 * swing;
      spine.rotation.z += 0.2 * swing;
      rightShoulder.rotation.x = -1.25 * swing - 0.35;
      rightShoulder.rotation.z = -0.85 * swing - 0.18;
      rightElbow.rotation.x = -0.36 - swing * 0.52;
      leftShoulder.rotation.x = 0.35 * swing - 0.15;
      leftElbow.rotation.x = -0.66;
      rightHip.rotation.x -= dashStrike * 0.48;
      leftHip.rotation.x += dashStrike * 0.32;
    }

    if (recoil > 0) {
      rig.rotation.x += recoil * 0.5;
      rig.position.z -= recoil * 0.16;
      leftShoulder.rotation.x = -0.85;
      rightShoulder.rotation.x = -0.85;
      head.rotation.x += recoil * 0.18;
    }

    if (perfectDodge > 0) {
      rig.rotation.z += Math.sign(snapshot.lateralVelocity || 1) * perfectDodge * 0.38;
      spine.rotation.z += Math.sign(snapshot.lateralVelocity || 1) * perfectDodge * 0.24;
      head.rotation.z -= Math.sign(snapshot.lateralVelocity || 1) * perfectDodge * 0.2;
    }

    if (snapshot.state === 'failed') {
      rig.rotation.x = expDecay(rig.rotation.x, -1.5, 5, dt);
      rig.rotation.z = expDecay(rig.rotation.z, 0.72, 4, dt);
    }

    if (snapshot.state !== this.lastState) {
      this.lastState = snapshot.state;
    }
  }

  applySkin(colors: { suit: number; armor: number; accent: number; visor: number }): void {
    this.materialSuit.color.setHex(colors.suit);
    this.materialArmor.color.setHex(colors.armor);
    this.materialAccent.color.setHex(colors.accent);
    this.materialAccent.emissive.setHex(colors.accent);
    this.materialVisor.color.setHex(0x07101f);
    this.materialVisor.emissive.setHex(colors.visor);
  }

  dispose(): void {
    this.group.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
    });
    this.materialSuit.dispose();
    this.materialArmor.dispose();
    this.materialAccent.dispose();
    this.materialVisor.dispose();
  }

  private buildRig(): void {
    const rig = new THREE.Group();
    rig.name = 'runner-rig-root';
    this.group.add(rig);
    this.parts.set('rig', rig);

    const hips = this.createCapsule(0.22, 0.28, this.materialSuit);
    hips.name = 'hips';
    hips.scale.set(1.45, 0.82, 0.88);
    rig.add(hips);

    const spine = new THREE.Group();
    spine.position.y = 0.38;
    rig.add(spine);
    this.parts.set('spine', spine);

    const torso = this.createCapsule(0.26, 0.62, this.materialSuit);
    torso.scale.set(1.12, 1.08, 0.82);
    torso.position.y = 0.25;
    spine.add(torso);

    const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.5, 0.14), this.materialArmor);
    chestPlate.position.set(0, 0.34, 0.18);
    chestPlate.rotation.x = -0.12;
    chestPlate.castShadow = true;
    spine.add(chestPlate);

    const accentLine = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 0.03), this.materialAccent);
    accentLine.position.set(0, 0.35, 0.265);
    spine.add(accentLine);

    const backPlate = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.48, 0.12), this.materialArmor);
    backPlate.position.set(0, 0.34, -0.19);
    backPlate.rotation.x = 0.1;
    backPlate.castShadow = true;
    spine.add(backPlate);

    const backGlow = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.36, 0.035), this.materialAccent);
    backGlow.position.set(0, 0.38, -0.265);
    spine.add(backGlow);

    const neck = this.createCapsule(0.08, 0.08, this.materialArmor);
    neck.position.y = 0.72;
    spine.add(neck);

    const head = new THREE.Group();
    head.position.y = 0.88;
    spine.add(head);
    this.parts.set('head', head);

    const helmet = this.createCapsule(0.18, 0.2, this.materialArmor);
    helmet.scale.set(0.92, 1.08, 1);
    head.add(helmet);

    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.045), this.materialVisor);
    visor.position.set(0, 0.04, 0.18);
    head.add(visor);

    this.buildArm(spine, 'left', -1);
    this.buildArm(spine, 'right', 1);
    this.buildLeg(rig, 'left', -1);
    this.buildLeg(rig, 'right', 1);

    this.group.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }

  private buildArm(parent: THREE.Group, sideName: 'left' | 'right', side: -1 | 1): void {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.34, 0.58, -0.02);
    parent.add(shoulder);
    this.parts.set(`${sideName}Shoulder` as BodyPart, shoulder);

    const upper = this.createCapsule(0.075, 0.42, this.materialSuit);
    upper.position.y = -0.24;
    shoulder.add(upper);

    const elbow = new THREE.Group();
    elbow.position.y = -0.48;
    shoulder.add(elbow);
    this.parts.set(`${sideName}Elbow` as BodyPart, elbow);

    const forearm = this.createCapsule(0.07, 0.38, this.materialArmor);
    forearm.position.y = -0.22;
    elbow.add(forearm);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.078, 14, 10), this.materialSuit);
    hand.position.y = -0.45;
    elbow.add(hand);
  }

  private buildLeg(parent: THREE.Group, sideName: 'left' | 'right', side: -1 | 1): void {
    const hip = new THREE.Group();
    hip.position.set(side * 0.18, -0.04, 0.01);
    parent.add(hip);
    this.parts.set(`${sideName}Hip` as BodyPart, hip);

    const thigh = this.createCapsule(0.095, 0.52, this.materialSuit);
    thigh.position.y = -0.3;
    hip.add(thigh);

    const knee = new THREE.Group();
    knee.position.y = -0.62;
    hip.add(knee);
    this.parts.set(`${sideName}Knee` as BodyPart, knee);

    const shin = this.createCapsule(0.085, 0.5, this.materialArmor);
    shin.position.y = -0.29;
    knee.add(shin);

    const foot = new THREE.Group();
    foot.position.set(0, -0.56, -0.08);
    knee.add(foot);
    this.parts.set(`${sideName}Foot` as BodyPart, foot);

    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.34), this.materialSuit);
    shoe.position.set(0, -0.04, -0.08);
    shoe.castShadow = true;
    foot.add(shoe);
  }

  private createCapsule(radius: number, length: number, material: THREE.Material): THREE.Mesh {
    return new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 8, 14), material);
  }

  private part(name: BodyPart): THREE.Object3D {
    const part = this.parts.get(name);
    if (!part) {
      throw new Error(`Missing character body part: ${name}`);
    }

    return part;
  }
}
