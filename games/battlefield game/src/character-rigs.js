import {
  AnimationClip,
  AnimationMixer,
  BoxGeometry,
  ConeGeometry,
  CylinderGeometry,
  Group,
  LoopOnce,
  LoopRepeat,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  NumberKeyframeTrack,
  Vector3,
} from "three";

const PLAYER_TORSO_GEOMETRY = new BoxGeometry(0.88, 1.08, 0.46);
const PLAYER_HEAD_GEOMETRY = new BoxGeometry(0.48, 0.5, 0.5);
const PLAYER_ARM_GEOMETRY = new BoxGeometry(0.22, 0.96, 0.22);
const PLAYER_LEG_GEOMETRY = new BoxGeometry(0.26, 1.08, 0.26);
const PLAYER_HAND_GEOMETRY = new BoxGeometry(0.18, 0.18, 0.18);

export function createPlayerViewRig() {
  const root = new Group();
  root.name = "PlayerCharacterRig";
  root.scale.setScalar(0.92);

  const modelRoot = new Group();
  modelRoot.name = "ModelRoot";
  root.add(modelRoot);

  const aimRoot = new Group();
  aimRoot.name = "AimRoot";
  aimRoot.position.y = 1.06;
  modelRoot.add(aimRoot);

  const bodyMaterials = [];
  const hiddenInFirstPerson = [];
  const tempAimTarget = new Vector3();

  const fatiguesMaterial = createMaterial(0x65715a, 0.08, 0.82);
  const pantsMaterial = createMaterial(0x4a5547, 0.06, 0.88);
  const skinMaterial = createMaterial(0xc6a178, 0.02, 0.95);
  const vestMaterial = createMaterial(0x384237, 0.12, 0.75);
  const metalMaterial = createMaterial(0x2f3339, 0.58, 0.42);
  const darkMetalMaterial = createMaterial(0x1f2228, 0.68, 0.34);
  const polymerMaterial = createMaterial(0x2f302f, 0.16, 0.7);
  const bladeMaterial = createMaterial(0xc7cbcd, 0.82, 0.18);
  const gripMaterial = createMaterial(0x4d3b2d, 0.08, 0.88);

  bodyMaterials.push(
    fatiguesMaterial,
    pantsMaterial,
    skinMaterial,
    vestMaterial,
    metalMaterial,
    darkMetalMaterial,
    polymerMaterial,
    bladeMaterial,
    gripMaterial,
  );

  const torso = createMesh(PLAYER_TORSO_GEOMETRY, fatiguesMaterial);
  torso.name = "Torso";
  torso.position.set(0, 0.12, 0);
  aimRoot.add(torso);
  hiddenInFirstPerson.push(torso);

  const vest = createMesh(new BoxGeometry(0.7, 0.78, 0.34), vestMaterial);
  vest.position.set(0, 0.1, 0.02);
  aimRoot.add(vest);
  hiddenInFirstPerson.push(vest);

  const head = createMesh(PLAYER_HEAD_GEOMETRY, skinMaterial);
  head.name = "Head";
  head.position.set(0, 0.94, 0.02);
  aimRoot.add(head);
  hiddenInFirstPerson.push(head);

  const helmet = createMesh(new BoxGeometry(0.56, 0.22, 0.58), darkMetalMaterial);
  helmet.position.set(0, 1.08, 0.02);
  aimRoot.add(helmet);
  hiddenInFirstPerson.push(helmet);

  const leftShoulderRoot = new Group();
  leftShoulderRoot.name = "LeftShoulderRoot";
  leftShoulderRoot.position.set(-0.44, 0.52, 0.04);
  aimRoot.add(leftShoulderRoot);

  const rightShoulderRoot = new Group();
  rightShoulderRoot.name = "RightShoulderRoot";
  rightShoulderRoot.position.set(0.44, 0.5, 0.05);
  aimRoot.add(rightShoulderRoot);

  const leftArmPivot = new Group();
  leftArmPivot.name = "LeftArmPivot";
  leftShoulderRoot.add(leftArmPivot);

  const rightArmPivot = new Group();
  rightArmPivot.name = "RightArmPivot";
  rightShoulderRoot.add(rightArmPivot);

  const leftArm = createMesh(PLAYER_ARM_GEOMETRY, fatiguesMaterial);
  leftArm.position.set(0, -0.46, 0);
  leftArmPivot.add(leftArm);

  const rightArm = createMesh(PLAYER_ARM_GEOMETRY, fatiguesMaterial);
  rightArm.position.set(0, -0.46, 0);
  rightArmPivot.add(rightArm);

  const leftHand = createMesh(PLAYER_HAND_GEOMETRY, skinMaterial);
  leftHand.position.set(0, -0.97, 0.04);
  leftArmPivot.add(leftHand);

  const rightHand = createMesh(PLAYER_HAND_GEOMETRY, skinMaterial);
  rightHand.position.set(0, -0.97, 0.04);
  rightArmPivot.add(rightHand);

  const leftLegPivot = new Group();
  leftLegPivot.name = "LeftLegPivot";
  leftLegPivot.position.set(-0.2, 0.62, 0);
  modelRoot.add(leftLegPivot);
  hiddenInFirstPerson.push(leftLegPivot);

  const rightLegPivot = new Group();
  rightLegPivot.name = "RightLegPivot";
  rightLegPivot.position.set(0.2, 0.62, 0);
  modelRoot.add(rightLegPivot);
  hiddenInFirstPerson.push(rightLegPivot);

  const leftLeg = createMesh(PLAYER_LEG_GEOMETRY, pantsMaterial);
  leftLeg.position.set(0, -0.54, 0);
  leftLegPivot.add(leftLeg);

  const rightLeg = createMesh(PLAYER_LEG_GEOMETRY, pantsMaterial);
  rightLeg.position.set(0, -0.54, 0);
  rightLegPivot.add(rightLeg);

  const gunPivot = new Group();
  gunPivot.name = "GunPivot";
  aimRoot.add(gunPivot);

  const gunRecoilRoot = new Group();
  gunRecoilRoot.name = "GunRecoilRoot";
  gunPivot.add(gunRecoilRoot);

  const rifle = buildRifle({
    bladeMaterial,
    darkMetalMaterial,
    gripMaterial,
    metalMaterial,
    polymerMaterial,
  });
  gunRecoilRoot.add(rifle.group);

  const muzzleAnchor = new Group();
  muzzleAnchor.name = "MuzzleAnchor";
  muzzleAnchor.position.set(0, 0.02, 1.15);
  gunRecoilRoot.add(muzzleAnchor);

  const knifePivot = new Group();
  knifePivot.name = "KnifePivot";
  aimRoot.add(knifePivot);

  const knifeRoot = new Group();
  knifeRoot.name = "KnifeRoot";
  knifePivot.add(knifeRoot);

  const knife = buildKnife({
    bladeMaterial,
    darkMetalMaterial,
    gripMaterial,
  });
  knifeRoot.add(knife);
  knifePivot.visible = false;

  const locomotionMixer = new AnimationMixer(root);
  const actionMixer = new AnimationMixer(root);

  const locomotionActions = {
    idle: locomotionMixer.clipAction(createPlayerIdleClip()),
    run: locomotionMixer.clipAction(createPlayerRunClip()),
    walk: locomotionMixer.clipAction(createPlayerWalkClip()),
  };

  for (const action of Object.values(locomotionActions)) {
    action.enabled = true;
    action.setLoop(LoopRepeat, Infinity);
  }

  locomotionActions.idle.play();
  let currentLocomotion = "idle";
  let currentViewMode = "third";
  let currentWeaponMode = "gun";
  let aimAlpha = 0;
  let bodyLean = 0;
  let bodyTurn = 0;
  let crouchBlend = 0;
  let moveBlendX = 0;
  let moveBlendZ = 0;
  let visible = true;

  const shootAction = actionMixer.clipAction(createPlayerShootClip());
  shootAction.setLoop(LoopOnce, 1);
  shootAction.clampWhenFinished = false;

  const knifeAction = actionMixer.clipAction(createPlayerKnifeClip());
  knifeAction.setLoop(LoopOnce, 1);
  knifeAction.clampWhenFinished = false;

  function applyViewMode() {
    const firstPerson = currentViewMode === "first";
    for (const part of hiddenInFirstPerson) {
      part.visible = !firstPerson;
    }
  }

  function applyHandPose(aiming) {
    const firstPerson = currentViewMode === "first";
    const gunEquipped = currentWeaponMode === "gun";

    if (gunEquipped) {
      leftShoulderRoot.position.set(
        firstPerson ? -0.28 : -0.42,
        firstPerson ? 0.38 : 0.52,
        firstPerson ? 0.22 : 0.04,
      );
      rightShoulderRoot.position.set(
        firstPerson ? 0.22 : 0.44,
        firstPerson ? 0.34 : 0.5,
        firstPerson ? 0.16 : 0.05,
      );
      leftShoulderRoot.rotation.set(
        lerp(-0.68, -0.92, aiming),
        lerp(-0.12, 0.02, aiming),
        lerp(0.34, 0.18, aiming),
      );
      rightShoulderRoot.rotation.set(
        lerp(-0.88, -1.02, aiming),
        lerp(0.08, 0.02, aiming),
        lerp(-0.26, -0.12, aiming),
      );
    } else {
      leftShoulderRoot.position.set(
        firstPerson ? -0.16 : -0.4,
        firstPerson ? 0.24 : 0.5,
        firstPerson ? 0.08 : 0.02,
      );
      rightShoulderRoot.position.set(
        firstPerson ? 0.18 : 0.44,
        firstPerson ? 0.22 : 0.48,
        firstPerson ? 0.26 : 0.06,
      );
      leftShoulderRoot.rotation.set(
        lerp(-0.34, -0.48, aiming),
        0,
        0.16,
      );
      rightShoulderRoot.rotation.set(
        lerp(-0.68, -0.92, aiming),
        lerp(0.1, 0.04, aiming),
        lerp(-0.08, 0.02, aiming),
      );
    }
  }

  function applyMovementPose(delta) {
    const forwardBlend = Math.max(0, -moveBlendZ);
    const backwardBlend = Math.max(0, moveBlendZ);
    const moveAmount = Math.min(1, Math.hypot(moveBlendX, moveBlendZ));
    const locomotionDirection = backwardBlend > forwardBlend + 0.08 ? -1 : 1;
    const desiredBodyTurn = moveAmount > 0.08 ? Math.atan2(moveBlendX, -moveBlendZ) : 0;
    const actionPlaying = shootAction.isRunning() || knifeAction.isRunning();

    bodyTurn = MathUtils.damp(bodyTurn, desiredBodyTurn, 11, delta);
    bodyLean = MathUtils.damp(bodyLean, 0, 14, delta);

    modelRoot.rotation.y = bodyTurn;
    modelRoot.rotation.z = bodyLean;
    modelRoot.position.y += -crouchBlend * 0.3;
    aimRoot.position.y = 1.06 - crouchBlend * 0.18;
    aimRoot.rotation.y = -bodyTurn * (currentWeaponMode === "gun" ? 0.2 + aimAlpha * 0.18 : 0.1);

    leftLegPivot.rotation.x *= locomotionDirection;
    rightLegPivot.rotation.x *= locomotionDirection;
    leftLegPivot.rotation.x += crouchBlend * 0.78;
    rightLegPivot.rotation.x += crouchBlend * 0.78;
    leftLegPivot.rotation.z = -backwardBlend * 0.03;
    rightLegPivot.rotation.z = backwardBlend * 0.03;
    leftLegPivot.rotation.y = 0;
    rightLegPivot.rotation.y = 0;
    leftLegPivot.position.z = backwardBlend * 0.02;
    rightLegPivot.position.z = backwardBlend * 0.02;
    leftLegPivot.position.y = 0.62 - crouchBlend * 0.06;
    rightLegPivot.position.y = 0.62 - crouchBlend * 0.06;

    if (currentWeaponMode === "gun") {
      leftShoulderRoot.rotation.x += backwardBlend * 0.06 + crouchBlend * 0.04;
      rightShoulderRoot.rotation.x += backwardBlend * 0.08 + crouchBlend * 0.05;
    } else {
      leftShoulderRoot.rotation.x += backwardBlend * 0.06;
      rightShoulderRoot.rotation.x += backwardBlend * 0.08;
    }

    if (actionPlaying) {
      return;
    }

    if (currentWeaponMode === "gun") {
      const gunSwingScale = 0.1;

      leftArmPivot.rotation.x *= locomotionDirection * gunSwingScale * moveAmount;
      rightArmPivot.rotation.x *= locomotionDirection * gunSwingScale * moveAmount;
      leftArmPivot.rotation.x += backwardBlend * 0.02 + crouchBlend * 0.04;
      rightArmPivot.rotation.x += backwardBlend * 0.03 + crouchBlend * 0.05;
      leftArmPivot.rotation.y = -backwardBlend * 0.02;
      rightArmPivot.rotation.y = -backwardBlend * 0.02;
      return;
    }

    const armSwingScale = 0.72;

    leftArmPivot.rotation.x *= locomotionDirection * moveAmount * armSwingScale;
    rightArmPivot.rotation.x *= locomotionDirection * moveAmount * armSwingScale;
    leftArmPivot.rotation.x += backwardBlend * 0.1 + crouchBlend * 0.08;
    rightArmPivot.rotation.x += backwardBlend * 0.12 + crouchBlend * 0.08;
    leftArmPivot.rotation.y = -backwardBlend * 0.04;
    rightArmPivot.rotation.y = -backwardBlend * 0.04;
  }

  return {
    bodyMaterials,
    muzzleAnchor,
    root,
    setLocomotion(nextState) {
      if (nextState === currentLocomotion) {
        return;
      }

      locomotionActions[currentLocomotion].fadeOut(0.16);
      locomotionActions[nextState].reset().fadeIn(0.16).play();
      currentLocomotion = nextState;
    },
    setMovementIntensity({ sprinting }) {
      locomotionActions.walk.timeScale = sprinting ? 1.06 : 1;
      locomotionActions.run.timeScale = sprinting ? 1.16 : 1;
    },
    setVisible(isVisible) {
      visible = isVisible;
      root.visible = isVisible;
    },
    setViewMode(nextViewMode) {
      currentViewMode = nextViewMode === "first" ? "first" : "third";
      applyViewMode();
    },
    setWeaponMode(nextMode) {
      currentWeaponMode = nextMode === "knife" ? "knife" : "gun";
      gunPivot.visible = currentWeaponMode === "gun";
      knifePivot.visible = currentWeaponMode === "knife";
    },
    triggerKnife() {
      this.setWeaponMode("knife");
      knifeAction.reset().play();
    },
    triggerShoot() {
      this.setWeaponMode("gun");
      shootAction.reset().play();
    },
    update(
      delta,
      {
        aiming,
        aimTarget,
        crouching = false,
        movementInput,
        pitch = 0,
        position,
        viewMode = "third",
        weaponMode = "gun",
        yaw = 0,
      },
    ) {
      this.setViewMode(viewMode);
      this.setWeaponMode(weaponMode);
      root.visible = visible;
      root.position.set(position.x, position.y, position.z);
      root.rotation.y = yaw + Math.PI;

      aimAlpha += (Number(aiming) - aimAlpha) * (1 - Math.exp(-10 * delta));
      crouchBlend = MathUtils.damp(crouchBlend, Number(crouching), 12, delta);
      moveBlendX = MathUtils.damp(moveBlendX, movementInput?.x ?? 0, 10, delta);
      moveBlendZ = MathUtils.damp(moveBlendZ, movementInput?.z ?? 0, 10, delta);

      locomotionMixer.update(delta);
      actionMixer.update(delta);

      applyHandPose(aimAlpha);
      applyMovementPose(delta);
      aimRoot.rotation.x = lerp(0, -pitch * 0.34, 0.52 + aimAlpha * 0.26);
      aimRoot.rotation.z = 0;

      const firstPerson = currentViewMode === "first";
      gunPivot.position.set(
        lerp(firstPerson ? 0.26 : 0.26, firstPerson ? 0.08 : 0.14, aimAlpha),
        lerp(firstPerson ? 0.32 : 0.42, firstPerson ? 0.42 : 0.5, aimAlpha),
        lerp(firstPerson ? 0.88 : 0.54, firstPerson ? 1.08 : 0.78, aimAlpha),
      );

      tempAimTarget.copy(aimTarget);
      gunPivot.lookAt(tempAimTarget);
      gunPivot.rotateX(0.02);
      gunRecoilRoot.rotation.z = lerp(-0.14, -0.05, aimAlpha);

      knifePivot.position.set(
        lerp(firstPerson ? 0.12 : -0.08, firstPerson ? 0.04 : -0.02, aimAlpha),
        lerp(firstPerson ? 0.26 : 0.34, firstPerson ? 0.44 : 0.46, aimAlpha),
        lerp(firstPerson ? 0.92 : 0.48, firstPerson ? 1.02 : 0.72, aimAlpha),
      );
      knifePivot.rotation.x = lerp(-0.34, -0.56, aimAlpha) - pitch * 0.1;
      knifePivot.rotation.y = lerp(0.16, 0.06, aimAlpha);
      knifePivot.rotation.z = lerp(-0.42, -0.22, aimAlpha);
    },
  };
}

export function createNpcAnimationRig(index) {
  const root = new Group();
  root.name = `NpcRig${index}`;

  const modelRoot = new Group();
  modelRoot.name = "ModelRoot";
  root.add(modelRoot);

  const bodyMaterials = [];
  const flashMeshes = [];
  const weaponMetalMaterial = createMaterial(0x31363c, 0.56, 0.42);
  const weaponDarkMetalMaterial = createMaterial(0x1f2329, 0.68, 0.34);
  const weaponPolymerMaterial = createMaterial(0x2c2f31, 0.14, 0.72);
  const knifeBladeMaterial = createMaterial(0xc7cbcf, 0.82, 0.18);
  const knifeGripMaterial = createMaterial(0x4a3a2e, 0.08, 0.88);

  weaponMetalMaterial.transparent = true;
  weaponDarkMetalMaterial.transparent = true;
  weaponPolymerMaterial.transparent = true;
  knifeBladeMaterial.transparent = true;
  knifeGripMaterial.transparent = true;

  bodyMaterials.push(
    weaponMetalMaterial,
    weaponDarkMetalMaterial,
    weaponPolymerMaterial,
    knifeBladeMaterial,
    knifeGripMaterial,
  );

  const torso = createCharacterPart(
    new BoxGeometry(0.95, 1.25, 0.55),
    0x68745d,
    bodyMaterials,
    flashMeshes,
  );
  torso.name = "Torso";
  torso.position.set(0, 1.5, 0);

  const head = createCharacterPart(
    new BoxGeometry(0.52, 0.52, 0.52),
    0xc7a97d,
    bodyMaterials,
    flashMeshes,
    "head",
  );
  head.name = "Head";
  head.position.set(0, 2.48, 0.04);

  const leftArm = createCharacterPart(
    new BoxGeometry(0.22, 1.05, 0.22),
    0x76836d,
    bodyMaterials,
    flashMeshes,
  );
  leftArm.name = "LeftArm";
  leftArm.position.set(-0.62, 1.42, 0);

  const rightArm = createCharacterPart(
    new BoxGeometry(0.22, 1.05, 0.22),
    0x76836d,
    bodyMaterials,
    flashMeshes,
  );
  rightArm.name = "RightArm";
  rightArm.position.set(0.62, 1.42, 0);

  const leftLeg = createCharacterPart(
    new BoxGeometry(0.26, 1.1, 0.26),
    0x4c5846,
    bodyMaterials,
    flashMeshes,
  );
  leftLeg.name = "LeftLeg";
  leftLeg.position.set(-0.22, 0.56, 0);

  const rightLeg = createCharacterPart(
    new BoxGeometry(0.26, 1.1, 0.26),
    0x4c5846,
    bodyMaterials,
    flashMeshes,
  );
  rightLeg.name = "RightLeg";
  rightLeg.position.set(0.22, 0.56, 0);

  const rifleMount = new Group();
  rifleMount.name = "NpcRifleMount";
  rifleMount.position.set(0.05, -0.34, 0.14);
  rifleMount.rotation.set(-1.36, 0.06, -0.16);
  rightArm.add(rifleMount);

  const rifle = buildRifle({
    darkMetalMaterial: weaponDarkMetalMaterial,
    gripMaterial: knifeGripMaterial,
    metalMaterial: weaponMetalMaterial,
    polymerMaterial: weaponPolymerMaterial,
  });
  rifle.group.scale.setScalar(0.72);
  rifle.group.position.set(0.04, 0.01, 0.18);
  rifleMount.add(rifle.group);

  const holsteredKnifeMount = new Group();
  holsteredKnifeMount.name = "NpcHolsteredKnife";
  holsteredKnifeMount.position.set(-0.36, 1.1, -0.14);
  holsteredKnifeMount.rotation.set(1.44, 0.14, -0.4);
  modelRoot.add(holsteredKnifeMount);

  const holsteredKnife = buildKnife({
    bladeMaterial: knifeBladeMaterial,
    darkMetalMaterial: weaponDarkMetalMaterial,
    gripMaterial: knifeGripMaterial,
  });
  holsteredKnife.scale.setScalar(0.74);
  holsteredKnifeMount.add(holsteredKnife);

  const knifeHandMount = new Group();
  knifeHandMount.name = "NpcKnifeHandMount";
  knifeHandMount.position.set(0.05, -0.46, 0.08);
  knifeHandMount.rotation.set(-0.4, 0.16, 1.16);
  knifeHandMount.visible = false;
  rightArm.add(knifeHandMount);

  const attackKnife = buildKnife({
    bladeMaterial: knifeBladeMaterial,
    darkMetalMaterial: weaponDarkMetalMaterial,
    gripMaterial: knifeGripMaterial,
  });
  attackKnife.scale.setScalar(0.82);
  knifeHandMount.add(attackKnife);

  modelRoot.add(torso, head, leftArm, rightArm, leftLeg, rightLeg);

  const mixer = new AnimationMixer(root);
  const actions = {
    idle: mixer.clipAction(createNpcIdleClip()),
    run: mixer.clipAction(createNpcRunClip()),
    walk: mixer.clipAction(createNpcWalkClip()),
  };
  for (const action of Object.values(actions)) {
    action.enabled = true;
    action.setLoop(LoopRepeat, Infinity);
  }
  actions.idle.play();
  let locomotion = "idle";

  const gunAttackAction = mixer.clipAction(createNpcGunAttackClip());
  gunAttackAction.setLoop(LoopOnce, 1);
  gunAttackAction.clampWhenFinished = false;

  const knifeAttackAction = mixer.clipAction(createNpcKnifeAttackClip());
  knifeAttackAction.setLoop(LoopOnce, 1);
  knifeAttackAction.clampWhenFinished = false;

  const deathAction = mixer.clipAction(createNpcDeathClip());
  deathAction.setLoop(LoopOnce, 1);
  deathAction.clampWhenFinished = true;

  const hitAction = mixer.clipAction(createNpcHitClip());
  hitAction.setLoop(LoopOnce, 1);
  hitAction.clampWhenFinished = false;

  let currentCombatMode = "gun";

  function setCombatMode(nextMode) {
    currentCombatMode = nextMode === "knife" ? "knife" : "gun";
    rifleMount.visible = currentCombatMode === "gun";
    knifeHandMount.visible = currentCombatMode === "knife";
    holsteredKnifeMount.visible = currentCombatMode !== "knife";
  }

  setCombatMode("gun");

  return {
    bodyMaterials,
    flashMeshes,
    mixer,
    root,
    setCombatMode(nextMode) {
      setCombatMode(nextMode);
    },
    setLocomotion(nextState, aggressive = false) {
      if (deathAction.isRunning()) {
        return;
      }

      if (nextState !== locomotion) {
        actions[locomotion].fadeOut(0.16);
        actions[nextState].reset().fadeIn(0.16).play();
        locomotion = nextState;
      }

      actions.walk.timeScale = aggressive ? 1.18 : 1;
      actions.run.timeScale = aggressive ? 1.28 : 1;
    },
    triggerAttack(mode = currentCombatMode) {
      if (deathAction.isRunning()) {
        return;
      }
      setCombatMode(mode);
      if (mode === "knife") {
        knifeAttackAction.reset().play();
      } else {
        gunAttackAction.reset().play();
      }
    },
    triggerDeath() {
      deathAction.reset().play();
      actions.idle.stop();
      actions.walk.stop();
      actions.run.stop();
      gunAttackAction.stop();
      knifeAttackAction.stop();
    },
    triggerHit() {
      if (!deathAction.isRunning()) {
        hitAction.reset().play();
      }
    },
    update(delta) {
      mixer.update(delta);
    },
  };
}

function buildRifle({ darkMetalMaterial, gripMaterial, metalMaterial, polymerMaterial }) {
  const group = new Group();

  const receiver = createMesh(new BoxGeometry(0.16, 0.2, 0.7), polymerMaterial);
  receiver.position.set(0, 0, 0.06);
  group.add(receiver);

  const stock = createMesh(new BoxGeometry(0.16, 0.22, 0.36), gripMaterial);
  stock.position.set(0, -0.01, -0.46);
  group.add(stock);

  const handguard = createMesh(new BoxGeometry(0.12, 0.14, 0.42), polymerMaterial);
  handguard.position.set(0, 0.01, 0.48);
  group.add(handguard);

  const barrel = createMesh(new CylinderGeometry(0.03, 0.03, 0.74, 12), darkMetalMaterial);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 0.02, 0.82);
  group.add(barrel);

  const muzzle = createMesh(new CylinderGeometry(0.036, 0.036, 0.12, 10), metalMaterial);
  muzzle.rotation.x = Math.PI / 2;
  muzzle.position.set(0, 0.02, 1.15);
  group.add(muzzle);

  const grip = createMesh(new BoxGeometry(0.1, 0.24, 0.12), gripMaterial);
  grip.position.set(0, -0.2, 0.04);
  grip.rotation.x = -0.18;
  group.add(grip);

  const magazine = createMesh(new BoxGeometry(0.12, 0.3, 0.14), metalMaterial);
  magazine.position.set(0, -0.24, 0.18);
  magazine.rotation.x = -0.14;
  group.add(magazine);

  const rail = createMesh(new BoxGeometry(0.08, 0.04, 0.24), metalMaterial);
  rail.position.set(0, 0.15, 0.16);
  group.add(rail);

  const scopeTube = createMesh(new CylinderGeometry(0.05, 0.05, 0.34, 12), darkMetalMaterial);
  scopeTube.rotation.x = Math.PI / 2;
  scopeTube.position.set(0, 0.2, 0.18);
  group.add(scopeTube);

  const scopeFront = createMesh(new CylinderGeometry(0.065, 0.065, 0.04, 12), darkMetalMaterial);
  scopeFront.rotation.x = Math.PI / 2;
  scopeFront.position.set(0, 0.2, 0.33);
  group.add(scopeFront);

  const scopeBack = createMesh(new CylinderGeometry(0.06, 0.06, 0.04, 12), darkMetalMaterial);
  scopeBack.rotation.x = Math.PI / 2;
  scopeBack.position.set(0, 0.2, 0.03);
  group.add(scopeBack);

  return { group };
}

function buildKnife({ bladeMaterial, darkMetalMaterial, gripMaterial }) {
  const group = new Group();

  const handle = createMesh(new BoxGeometry(0.08, 0.11, 0.24), gripMaterial);
  handle.position.set(0, 0, -0.04);
  group.add(handle);

  const pommel = createMesh(new BoxGeometry(0.09, 0.08, 0.06), darkMetalMaterial);
  pommel.position.set(0, 0, -0.18);
  group.add(pommel);

  const guard = createMesh(new BoxGeometry(0.15, 0.04, 0.08), darkMetalMaterial);
  guard.position.set(0, 0, 0.08);
  group.add(guard);

  const blade = createMesh(new BoxGeometry(0.045, 0.08, 0.56), bladeMaterial);
  blade.position.set(0, 0, 0.42);
  group.add(blade);

  const tip = createMesh(new ConeGeometry(0.04, 0.12, 4), bladeMaterial);
  tip.rotation.x = Math.PI / 2;
  tip.position.set(0, 0, 0.76);
  group.add(tip);

  return group;
}

function createPlayerIdleClip() {
  return new AnimationClip("idle", 1.5, [
    new NumberKeyframeTrack("ModelRoot.position[y]", [0, 0.75, 1.5], [0, 0.03, 0]),
    new NumberKeyframeTrack("LeftArmPivot.rotation[z]", [0, 0.75, 1.5], [0.08, 0.03, 0.08]),
    new NumberKeyframeTrack("RightArmPivot.rotation[z]", [0, 0.75, 1.5], [-0.06, -0.02, -0.06]),
  ]);
}

function createPlayerWalkClip() {
  return new AnimationClip("walk", 0.72, [
    new NumberKeyframeTrack("LeftArmPivot.rotation[x]", [0, 0.36, 0.72], [0.22, -0.18, 0.22]),
    new NumberKeyframeTrack("RightArmPivot.rotation[x]", [0, 0.36, 0.72], [-0.18, 0.22, -0.18]),
    new NumberKeyframeTrack("LeftLegPivot.rotation[x]", [0, 0.36, 0.72], [-0.46, 0.34, -0.46]),
    new NumberKeyframeTrack("RightLegPivot.rotation[x]", [0, 0.36, 0.72], [0.34, -0.46, 0.34]),
    new NumberKeyframeTrack("ModelRoot.position[y]", [0, 0.18, 0.36, 0.54, 0.72], [0, 0.04, 0, -0.02, 0]),
  ]);
}

function createPlayerRunClip() {
  return new AnimationClip("run", 0.52, [
    new NumberKeyframeTrack("LeftArmPivot.rotation[x]", [0, 0.26, 0.52], [0.38, -0.32, 0.38]),
    new NumberKeyframeTrack("RightArmPivot.rotation[x]", [0, 0.26, 0.52], [-0.32, 0.38, -0.32]),
    new NumberKeyframeTrack("LeftLegPivot.rotation[x]", [0, 0.26, 0.52], [-0.72, 0.58, -0.72]),
    new NumberKeyframeTrack("RightLegPivot.rotation[x]", [0, 0.26, 0.52], [0.58, -0.72, 0.58]),
    new NumberKeyframeTrack("ModelRoot.position[y]", [0, 0.13, 0.26, 0.39, 0.52], [0, 0.06, 0, -0.03, 0]),
  ]);
}

function createPlayerShootClip() {
  return new AnimationClip("shoot", 0.18, [
    new NumberKeyframeTrack("GunRecoilRoot.position[z]", [0, 0.05, 0.18], [0, -0.12, 0]),
    new NumberKeyframeTrack("RightArmPivot.rotation[x]", [0, 0.05, 0.18], [0, -0.14, 0]),
    new NumberKeyframeTrack("LeftArmPivot.rotation[x]", [0, 0.05, 0.18], [0, -0.08, 0]),
  ]);
}

function createPlayerKnifeClip() {
  return new AnimationClip("knife", 0.3, [
    new NumberKeyframeTrack("KnifeRoot.rotation[z]", [0, 0.08, 0.18, 0.3], [0, -1.18, 0.46, 0]),
    new NumberKeyframeTrack("KnifeRoot.position[z]", [0, 0.08, 0.18, 0.3], [0, 0.34, -0.04, 0]),
    new NumberKeyframeTrack("RightArmPivot.rotation[x]", [0, 0.08, 0.18, 0.3], [0, -0.28, 0.08, 0]),
    new NumberKeyframeTrack("LeftArmPivot.rotation[x]", [0, 0.08, 0.18, 0.3], [0, -0.12, 0.04, 0]),
  ]);
}

function createNpcIdleClip() {
  return new AnimationClip("idle", 1.5, [
    new NumberKeyframeTrack("ModelRoot.position[y]", [0, 0.75, 1.5], [0, 0.008, 0]),
    new NumberKeyframeTrack("LeftArm.rotation[z]", [0, 0.75, 1.5], [0.01, -0.01, 0.01]),
    new NumberKeyframeTrack("RightArm.rotation[z]", [0, 0.75, 1.5], [-0.01, 0.01, -0.01]),
  ]);
}

function createNpcWalkClip() {
  return new AnimationClip("walk", 0.72, [
    new NumberKeyframeTrack("LeftArm.rotation[x]", [0, 0.36, 0.72], [0.24, -0.18, 0.24]),
    new NumberKeyframeTrack("RightArm.rotation[x]", [0, 0.36, 0.72], [-0.18, 0.24, -0.18]),
    new NumberKeyframeTrack("LeftLeg.rotation[x]", [0, 0.36, 0.72], [-0.45, 0.4, -0.45]),
    new NumberKeyframeTrack("RightLeg.rotation[x]", [0, 0.36, 0.72], [0.4, -0.45, 0.4]),
    new NumberKeyframeTrack("ModelRoot.position[y]", [0, 0.18, 0.36, 0.54, 0.72], [0, 0.015, 0, -0.008, 0]),
  ]);
}

function createNpcRunClip() {
  return new AnimationClip("run", 0.52, [
    new NumberKeyframeTrack("LeftArm.rotation[x]", [0, 0.26, 0.52], [0.32, -0.24, 0.32]),
    new NumberKeyframeTrack("RightArm.rotation[x]", [0, 0.26, 0.52], [-0.24, 0.32, -0.24]),
    new NumberKeyframeTrack("LeftLeg.rotation[x]", [0, 0.26, 0.52], [-0.7, 0.55, -0.7]),
    new NumberKeyframeTrack("RightLeg.rotation[x]", [0, 0.26, 0.52], [0.55, -0.7, 0.55]),
    new NumberKeyframeTrack("ModelRoot.position[y]", [0, 0.13, 0.26, 0.39, 0.52], [0, 0.024, 0, -0.012, 0]),
  ]);
}

function createNpcGunAttackClip() {
  return new AnimationClip("gunAttack", 0.24, [
    new NumberKeyframeTrack("RightArm.rotation[x]", [0, 0.06, 0.24], [0, -0.42, -0.08]),
    new NumberKeyframeTrack("LeftArm.rotation[x]", [0, 0.06, 0.24], [0, -0.18, -0.02]),
    new NumberKeyframeTrack("ModelRoot.rotation[x]", [0, 0.06, 0.24], [0, 0.08, 0]),
  ]);
}

function createNpcKnifeAttackClip() {
  return new AnimationClip("knifeAttack", 0.26, [
    new NumberKeyframeTrack("RightArm.rotation[x]", [0, 0.08, 0.26], [0, -1.1, -0.1]),
    new NumberKeyframeTrack("LeftArm.rotation[x]", [0, 0.08, 0.26], [0, -0.35, 0]),
    new NumberKeyframeTrack("ModelRoot.rotation[x]", [0, 0.08, 0.26], [0, 0.14, 0]),
  ]);
}

function createNpcDeathClip() {
  return new AnimationClip("death", 0.7, [
    new NumberKeyframeTrack("ModelRoot.rotation[z]", [0, 0.7], [0, -1.15]),
    new NumberKeyframeTrack("ModelRoot.position[y]", [0, 0.7], [0, -0.82]),
  ]);
}

function createNpcHitClip() {
  return new AnimationClip("hit", 0.2, [
    new NumberKeyframeTrack("ModelRoot.position[z]", [0, 0.06, 0.2], [0, -0.08, 0]),
    new NumberKeyframeTrack("Torso.rotation[x]", [0, 0.06, 0.2], [0, 0.08, 0]),
  ]);
}

function createMaterial(color, metalness, roughness) {
  return new MeshStandardMaterial({
    color,
    metalness,
    roughness,
  });
}

function createMesh(geometry, material) {
  const mesh = new Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function createCharacterPart(geometry, color, bodyMaterials, flashMeshes, hitZone = null) {
  const material = new MeshStandardMaterial({
    color,
    metalness: 0.04,
    roughness: 0.92,
    transparent: true,
  });

  const mesh = new Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  if (hitZone) {
    mesh.userData.hitZone = hitZone;
  }

  bodyMaterials.push(material);
  flashMeshes.push(mesh);
  return mesh;
}

function lerp(start, end, alpha) {
  return start + (end - start) * alpha;
}
