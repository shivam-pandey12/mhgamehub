import { MathUtils, Vector3 } from "three";

const PLAYER_HEIGHT = 1.8;
const PLAYER_RADIUS = 0.45;
const COLLISION_MARGIN = 0.04;
const WALK_SPEED = 5.1;
const CROUCH_SPEED = 2.85;
const RUN_SPEED = 10.4;
const MOVE_ACCELERATION = 12;
const MOVE_DECELERATION = 10;
const GRAVITY = 30;
const LOOK_SENSITIVITY = 0.0021;
const RECOIL_DAMPING = 18;
const CAMERA_DAMPING = 12;
const WALK_BOB_HEIGHT = 0.026;
const RUN_BOB_HEIGHT = 0.044;
const WALK_BOB_SPEED = 8.2;
const RUN_BOB_SPEED = 11.8;
const ADS_FOV_REDUCTION = 8;
const SCOPE_FOV_REDUCTION = 22;
const SPRINT_FOV_BOOST = 4;
const CAMERA_FOCUS_HEIGHT = 1.42;
const CROUCH_CAMERA_DROP = 0.42;
const THIRD_CAMERA_DISTANCE = 3.15;
const THIRD_CAMERA_HEIGHT = 0.38;
const THIRD_CAMERA_SIDE = 0.5;
const THIRD_AIM_DISTANCE = 1.75;
const THIRD_AIM_HEIGHT = 0.2;
const THIRD_AIM_SIDE = 0.18;
const FIRST_CAMERA_HEIGHT = 1.54;
const FIRST_CAMERA_FORWARD = 0.1;

export class PlayerController {
  constructor({ camera, domElement, collisionBoxes, onLockChange, onViewModeChange }) {
    this.camera = camera;
    this.domElement = domElement;
    this.collisionBoxes = collisionBoxes;
    this.onLockChange = onLockChange;
    this.onViewModeChange = onViewModeChange;
    this.enabled = true;

    this.position = new Vector3(0, 0, 28);
    this.velocity = new Vector3();
    this.moveForward = new Vector3();
    this.moveRight = new Vector3();
    this.movement = new Vector3();
    this.localMovementInput = new Vector3();
    this.wishDirection = new Vector3();
    this.nextPosition = new Vector3();
    this.testMin = new Vector3();
    this.testMax = new Vector3();
    this.cameraForward = new Vector3();
    this.cameraRight = new Vector3();
    this.cameraFocus = new Vector3();
    this.cameraLookTarget = new Vector3();

    this.yaw = 0;
    this.pitch = -0.08;
    this.recoilYaw = 0;
    this.recoilPitch = 0;
    this.shakeClock = 0;
    this.shakeDuration = 0;
    this.shakePitch = 0;
    this.shakeRoll = 0;
    this.shakeStrength = 0;
    this.shakeTimeRemaining = 0;
    this.shakeYaw = 0;
    this.baseFov = camera.fov;
    this.cameraBob = 0;
    this.cameraBobCycle = 0;
    this.cameraRoll = 0;
    this.crouchAmount = 0;
    this.currentFov = camera.fov;
    this.horizontalSpeed = 0;
    this.equippedWeapon = "gun";
    this.isAiming = false;
    this.isCrouching = false;
    this.isGrounded = false;
    this.isLocked = false;
    this.isSprinting = false;
    this.touchControlsEnabled = false;
    this.movementState = "idle";
    this.viewMode = "third";

    this.pressedKeys = {
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      ArrowUp: false,
      KeyA: false,
      KeyD: false,
      KeyS: false,
      KeyW: false,
      KeyX: false,
      ShiftLeft: false,
      ShiftRight: false,
    };

    this.moveState = {
      backward: false,
      forward: false,
      left: false,
      right: false,
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handlePointerLockChange = this.handlePointerLockChange.bind(this);
    this.handleWindowBlur = this.handleWindowBlur.bind(this);

    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("pointerlockchange", this.handlePointerLockChange);
    window.addEventListener("blur", this.handleWindowBlur);

    this.updateCameraTransform();
  }

  get isScopeActive() {
    return this.viewMode === "first" && this.isAiming && this.equippedWeapon === "gun";
  }

  requestPointerLock() {
    if (!this.enabled) {
      return;
    }

    if (this.touchControlsEnabled) {
      this.isLocked = true;
      this.onLockChange?.(true);
      return;
    }

    if (document.pointerLockElement !== this.domElement) {
      this.domElement.requestPointerLock();
    }
  }

  handleKeyDown(event) {
    if (event.code === "KeyV" && !event.repeat) {
      event.preventDefault();
      this.toggleViewMode();
      return;
    }

    if (event.code === "KeyC" && !event.repeat) {
      event.preventDefault();
      this.toggleCrouch();
      return;
    }

    if (!this.enabled || !(event.code in this.pressedKeys)) {
      return;
    }

    event.preventDefault();
    this.pressedKeys[event.code] = true;
    this.syncMoveState();
  }

  handleKeyUp(event) {
    if (!(event.code in this.pressedKeys)) {
      return;
    }

    event.preventDefault();
    this.pressedKeys[event.code] = false;
    this.syncMoveState();
  }

  syncMoveState() {
    this.moveState.forward = this.pressedKeys.KeyW || this.pressedKeys.ArrowUp;
    this.moveState.backward = this.pressedKeys.KeyS || this.pressedKeys.ArrowDown;
    this.moveState.left = this.pressedKeys.KeyA || this.pressedKeys.ArrowLeft;
    this.moveState.right = this.pressedKeys.KeyD || this.pressedKeys.ArrowRight;
  }

  handleMouseMove(event) {
    if (!this.enabled || !this.isLocked) {
      return;
    }

    this.yaw -= event.movementX * LOOK_SENSITIVITY;
    this.pitch -= event.movementY * LOOK_SENSITIVITY;
    this.pitch = MathUtils.clamp(this.pitch, -1.1, 1.0);
    this.updateCameraTransform();
  }

  handlePointerLockChange() {
    this.isLocked = document.pointerLockElement === this.domElement || this.touchControlsEnabled;

    if (!this.isLocked) {
      this.clearMovementState();
      this.setAiming(false);
    }

    this.onLockChange?.(this.isLocked);
  }

  handleWindowBlur() {
    this.clearMovementState();
    this.setAiming(false);
  }

  setTouchControlsEnabled(enabled) {
    const nextEnabled = Boolean(enabled);
    if (this.touchControlsEnabled === nextEnabled) {
      return;
    }

    this.touchControlsEnabled = nextEnabled;
    this.isLocked = document.pointerLockElement === this.domElement || this.touchControlsEnabled;

    if (!this.isLocked) {
      this.clearMovementState();
      this.setAiming(false);
    }

    this.onLockChange?.(this.isLocked);
  }

  applyTouchLook(deltaX, deltaY) {
    if (!this.enabled || !this.isLocked) {
      return;
    }

    this.yaw -= deltaX * 0.05;
    this.pitch -= deltaY * 0.045;
    this.pitch = MathUtils.clamp(this.pitch, -1.1, 1.0);
    this.updateCameraTransform();
  }

  clearMovementState() {
    for (const code of Object.keys(this.pressedKeys)) {
      this.pressedKeys[code] = false;
    }

    this.moveState.forward = false;
    this.moveState.backward = false;
    this.moveState.left = false;
    this.moveState.right = false;
    this.localMovementInput.set(0, 0, 0);
    this.isSprinting = false;
    this.movementState = "idle";
    this.velocity.x = 0;
    this.velocity.z = 0;
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === "third" ? "first" : "third";
    this.onViewModeChange?.(this.viewMode);
    this.updateCameraTransform();
  }

  toggleCrouch() {
    if (!this.enabled || !this.isLocked) {
      return;
    }

    this.isCrouching = !this.isCrouching;
    if (this.isCrouching) {
      this.isSprinting = false;
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled;

    if (!enabled) {
      this.clearMovementState();
      this.setAiming(false);
    }
  }

  setAiming(isAiming) {
    this.isAiming = Boolean(
      isAiming &&
      this.enabled &&
      this.isLocked &&
      this.equippedWeapon === "gun",
    );
  }

  setEquippedWeapon(weaponMode) {
    this.equippedWeapon = weaponMode === "knife" ? "knife" : "gun";
    if (this.equippedWeapon !== "gun") {
      this.isAiming = false;
    }
  }

  applyForwardImpulse(strength) {
    this.moveForward.set(Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    this.velocity.addScaledVector(this.moveForward, strength);

    const speedLimit = RUN_SPEED + Math.max(0, strength * 0.8);
    const speed = Math.hypot(this.velocity.x, this.velocity.z);
    if (speed > speedLimit) {
      const scale = speedLimit / speed;
      this.velocity.x *= scale;
      this.velocity.z *= scale;
    }
  }

  update(delta) {
    this.recoilYaw = MathUtils.damp(this.recoilYaw, 0, RECOIL_DAMPING, delta);
    this.recoilPitch = MathUtils.damp(this.recoilPitch, 0, RECOIL_DAMPING, delta);
    this.crouchAmount = MathUtils.damp(this.crouchAmount, this.isCrouching ? 1 : 0, 12, delta);
    this.updateShake(delta);
    this.updateHorizontalVelocity(delta);

    this.velocity.y -= GRAVITY * delta;

    this.moveHorizontalAxis("x", this.velocity.x * delta);
    this.moveHorizontalAxis("z", this.velocity.z * delta);

    this.position.y += this.velocity.y * delta;
    if (this.position.y <= 0) {
      this.position.y = 0;
      this.velocity.y = 0;
      this.isGrounded = true;
    } else {
      this.isGrounded = false;
    }

    this.horizontalSpeed = Math.hypot(this.velocity.x, this.velocity.z);
    this.updateMovementState();
    this.updateCameraFeel(delta);
    this.updateCameraTransform();
  }

  updateHorizontalVelocity(delta) {
    this.movement.set(0, 0, 0);

    if (this.enabled && this.isLocked) {
      if (this.moveState.forward) {
        this.movement.z -= 1;
      }
      if (this.moveState.backward) {
        this.movement.z += 1;
      }
      if (this.moveState.left) {
        this.movement.x -= 1;
      }
      if (this.moveState.right) {
        this.movement.x += 1;
      }
    }

    const hasInput = this.movement.lengthSq() > 0;
    this.localMovementInput.set(0, 0, 0);
    this.isSprinting = Boolean(
      hasInput &&
      !this.isCrouching &&
      !this.isAiming &&
      (this.pressedKeys.ShiftLeft || this.pressedKeys.ShiftRight || this.pressedKeys.KeyX) &&
      (this.movement.z <= 0 || this.pressedKeys.KeyX) &&
      this.enabled &&
      this.isLocked,
    );

    let targetX = 0;
    let targetZ = 0;

    if (hasInput) {
      this.movement.normalize();
      this.localMovementInput.copy(this.movement);
      this.moveForward.set(Math.sin(this.yaw), 0, -Math.cos(this.yaw));
      this.moveRight.set(Math.cos(this.yaw), 0, Math.sin(this.yaw));

      this.wishDirection
        .copy(this.moveForward)
        .multiplyScalar(-this.movement.z)
        .addScaledVector(this.moveRight, this.movement.x);

      if (this.wishDirection.lengthSq() > 0) {
        this.wishDirection.normalize();
        const targetSpeed = this.isCrouching
          ? CROUCH_SPEED
          : this.isSprinting ? RUN_SPEED : WALK_SPEED;
        targetX = this.wishDirection.x * targetSpeed;
        targetZ = this.wishDirection.z * targetSpeed;
      }
    }

    const damping = hasInput ? MOVE_ACCELERATION : MOVE_DECELERATION;
    this.velocity.x = MathUtils.damp(this.velocity.x, targetX, damping, delta);
    this.velocity.z = MathUtils.damp(this.velocity.z, targetZ, damping, delta);
  }

  updateMovementState() {
    if (!this.isGrounded || this.horizontalSpeed < 0.45) {
      this.movementState = "idle";
      return;
    }

    if (this.isCrouching) {
      this.movementState = "walk";
      return;
    }

    this.movementState = this.isSprinting || this.horizontalSpeed > WALK_SPEED * 0.92
      ? "run"
      : "walk";
  }

  updateCameraFeel(delta) {
    const isMoving = this.isGrounded && this.horizontalSpeed > 0.45;
    const bobSpeed = this.isCrouching
      ? WALK_BOB_SPEED * 0.72
      : this.isSprinting ? RUN_BOB_SPEED : WALK_BOB_SPEED;
    const bobHeight = this.isCrouching
      ? WALK_BOB_HEIGHT * 0.58
      : this.isSprinting ? RUN_BOB_HEIGHT : WALK_BOB_HEIGHT;
    const bobStrength = isMoving
      ? MathUtils.clamp(
        this.horizontalSpeed / (this.isCrouching ? CROUCH_SPEED : this.isSprinting ? RUN_SPEED : WALK_SPEED),
        0.45,
        1.2,
      )
      : 0;

    if (isMoving) {
      this.cameraBobCycle += delta * bobSpeed * bobStrength;
    }

    const bobTarget = isMoving ? Math.abs(Math.sin(this.cameraBobCycle)) * bobHeight : 0;
    const rollTarget = isMoving
      ? Math.sin(this.cameraBobCycle * 0.5) * (this.isSprinting ? 0.014 : 0.008) * bobStrength
      : 0;

    this.cameraBob = MathUtils.damp(this.cameraBob, bobTarget, CAMERA_DAMPING, delta);
    this.cameraRoll = MathUtils.damp(this.cameraRoll, rollTarget, CAMERA_DAMPING, delta);

    const targetFov = this.baseFov
      + (this.isSprinting ? SPRINT_FOV_BOOST : 0)
      - (this.isScopeActive ? SCOPE_FOV_REDUCTION : this.isAiming ? ADS_FOV_REDUCTION : 0);

    this.currentFov = MathUtils.damp(this.currentFov, targetFov, CAMERA_DAMPING, delta);
    if (Math.abs(this.camera.fov - this.currentFov) > 0.01) {
      this.camera.fov = this.currentFov;
      this.camera.updateProjectionMatrix();
    }
  }

  moveHorizontalAxis(axis, amount) {
    if (Math.abs(amount) < 0.00001) {
      return;
    }

    const nextPosition = this.nextPosition.copy(this.position);
    nextPosition[axis] += amount;

    if (this.intersectsObstacle(nextPosition)) {
      this.velocity[axis] = 0;
      return;
    }

    this.position[axis] = nextPosition[axis];
  }

  intersectsObstacle(position) {
    const effectiveRadius = PLAYER_RADIUS - COLLISION_MARGIN;

    this.testMin.set(
      position.x - effectiveRadius,
      position.y + 0.05,
      position.z - effectiveRadius,
    );
    this.testMax.set(
      position.x + effectiveRadius,
      position.y + PLAYER_HEIGHT,
      position.z + effectiveRadius,
    );

    for (const obstacle of this.collisionBoxes) {
      if (
        this.testMin.x < obstacle.max.x &&
        this.testMax.x > obstacle.min.x &&
        this.testMin.y < obstacle.max.y &&
        this.testMax.y > obstacle.min.y &&
        this.testMin.z < obstacle.max.z &&
        this.testMax.z > obstacle.min.z
      ) {
        return true;
      }
    }

    return false;
  }

  applyRecoil({ pitch = 0, yaw = 0 } = {}) {
    this.recoilPitch += pitch;
    this.recoilYaw += yaw;
    this.updateCameraTransform();
  }

  applyCameraShake({ duration = 0.2, strength = 0.01 } = {}) {
    this.shakeDuration = Math.max(this.shakeDuration, duration);
    this.shakeStrength = Math.max(this.shakeStrength, strength);
    this.shakeTimeRemaining = Math.max(this.shakeTimeRemaining, duration);
  }

  updateShake(delta) {
    this.shakeClock += delta;

    if (this.shakeTimeRemaining <= 0) {
      this.shakePitch = 0;
      this.shakeRoll = 0;
      this.shakeYaw = 0;
      this.shakeStrength = 0;
      this.shakeDuration = 0;
      return;
    }

    this.shakeTimeRemaining = Math.max(0, this.shakeTimeRemaining - delta);
    const damping = this.shakeTimeRemaining / Math.max(this.shakeDuration, 0.0001);
    const amplitude = this.shakeStrength * damping;

    this.shakePitch = Math.cos(this.shakeClock * 28.6) * amplitude * 1.15;
    this.shakeYaw = Math.sin(this.shakeClock * 34.2) * amplitude * 0.9;
    this.shakeRoll = Math.cos(this.shakeClock * 24.1) * amplitude * 0.65;
  }

  updateCameraTransform() {
    const rotationYaw = this.yaw + this.recoilYaw + this.shakeYaw;
    const rotationPitch = MathUtils.clamp(
      this.pitch + this.recoilPitch + this.shakePitch,
      -1.1,
      1.0,
    );

    this.cameraForward.set(
      Math.sin(rotationYaw) * Math.cos(rotationPitch),
      Math.sin(rotationPitch),
      -Math.cos(rotationYaw) * Math.cos(rotationPitch),
    ).normalize();

    this.cameraRight.set(
      Math.cos(rotationYaw),
      0,
      Math.sin(rotationYaw),
    ).normalize();

    this.cameraFocus.set(
      this.position.x,
      this.position.y + CAMERA_FOCUS_HEIGHT - this.crouchAmount * CROUCH_CAMERA_DROP + this.cameraBob * 0.25,
      this.position.z,
    );

    if (this.viewMode === "first") {
      this.camera.position.copy(this.cameraFocus);
      this.camera.position.y =
        this.position.y
        + FIRST_CAMERA_HEIGHT
        - this.crouchAmount * CROUCH_CAMERA_DROP
        + this.cameraBob * 0.16;
      this.camera.position.addScaledVector(this.cameraForward, FIRST_CAMERA_FORWARD);
      this.camera.position.addScaledVector(this.cameraRight, 0.02);
    } else {
      const distance = this.isAiming ? THIRD_AIM_DISTANCE : THIRD_CAMERA_DISTANCE;
      const height = (this.isAiming ? THIRD_AIM_HEIGHT : THIRD_CAMERA_HEIGHT) - this.crouchAmount * 0.22;
      const side = this.isAiming ? THIRD_AIM_SIDE : THIRD_CAMERA_SIDE;

      this.camera.position
        .copy(this.cameraFocus)
        .addScaledVector(this.cameraRight, side)
        .addScaledVector(this.cameraForward, -distance);
      this.camera.position.y = this.cameraFocus.y + height;
    }

    this.cameraLookTarget
      .copy(this.cameraFocus)
      .addScaledVector(this.cameraForward, 24);

    this.camera.lookAt(this.cameraLookTarget);
    this.camera.rotation.z += this.cameraRoll + this.shakeRoll;
  }
}
