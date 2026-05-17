import * as THREE from "three";

const TRANSLATION_KEYS = {
  forward: ["ArrowUp"],
  backward: ["ArrowDown"],
  left: ["ArrowLeft"],
  right: ["ArrowRight"],
  up: ["KeyR"],
  down: ["KeyF"],
};

const ROTATION_KEYS = {
  pitchUp: ["KeyW"],
  pitchDown: ["KeyS"],
  yawLeft: ["KeyA"],
  yawRight: ["KeyD"],
  rollLeft: ["KeyQ"],
  rollRight: ["KeyE"],
};

const BOOST_KEYS = ["KeyC"];
const TIME_SLOW_KEYS = ["ShiftLeft", "ShiftRight"];
const SHIELD_KEYS = ["KeyX"];

const WEAPON_SWITCH_KEYS = new Map([
  ["Digit1", 0],
  ["Digit2", 1],
  ["Digit3", 2],
]);

function isAnyKeyActive(activeKeys, keys) {
  return keys.some((key) => activeKeys.has(key));
}

export class InputController {
  constructor(domElement) {
    this.domElement = domElement;
    this.activeKeys = new Set();
    this.pointer = new THREE.Vector2();
    this.pointerTarget = new THREE.Vector2();
    this.pointerLockedDelta = new THREE.Vector2();
    this.translationInput = new THREE.Vector3();
    this.rotationInput = new THREE.Vector3();
    this.isPrimaryFirePressed = false;
    this.pendingWeaponSwitch = null;
    this.pendingPauseToggle = false;
    this.pendingRestart = false;
    this.pendingDebugToggle = false;
    this.isPointerLocked = false;
    this.mouseYawSensitivity = 0.72;
    this.mousePitchSensitivity = 0.64;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handlePointerLeave = this.handlePointerLeave.bind(this);
    this.handlePointerLockChange = this.handlePointerLockChange.bind(this);
    this.handleWindowBlur = this.handleWindowBlur.bind(this);

    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    this.domElement.addEventListener("pointermove", this.handlePointerMove, { passive: true });
    this.domElement.addEventListener("pointerdown", this.handlePointerDown);
    window.addEventListener("pointerup", this.handlePointerUp);
    this.domElement.addEventListener("pointerleave", this.handlePointerLeave);
    document.addEventListener("pointerlockchange", this.handlePointerLockChange);
    window.addEventListener("blur", this.handleWindowBlur);
  }

  handleKeyDown(event) {
    if (
      Object.values(TRANSLATION_KEYS).some((keys) => keys.includes(event.code))
      || Object.values(ROTATION_KEYS).some((keys) => keys.includes(event.code))
      || BOOST_KEYS.includes(event.code)
      || TIME_SLOW_KEYS.includes(event.code)
      || SHIELD_KEYS.includes(event.code)
    ) {
      event.preventDefault();
      this.activeKeys.add(event.code);
      return;
    }

    if (event.code === "Space") {
      event.preventDefault();
      this.isPrimaryFirePressed = true;
      return;
    }

    if ((event.code === "Escape" || event.code === "KeyP") && !event.repeat) {
      event.preventDefault();
      this.pendingPauseToggle = true;
      return;
    }

    if (event.code === "KeyT" && !event.repeat) {
      event.preventDefault();
      this.pendingRestart = true;
      return;
    }

    if (event.code === "KeyV" && !event.repeat) {
      event.preventDefault();
      this.pendingDebugToggle = true;
      return;
    }

    if (WEAPON_SWITCH_KEYS.has(event.code) && !event.repeat) {
      event.preventDefault();
      this.pendingWeaponSwitch = WEAPON_SWITCH_KEYS.get(event.code);
    }
  }

  handleKeyUp(event) {
    if (this.activeKeys.has(event.code)) {
      event.preventDefault();
      this.activeKeys.delete(event.code);
      return;
    }

    if (event.code === "Space") {
      event.preventDefault();
      this.isPrimaryFirePressed = false;
    }
  }

  handlePointerMove(event) {
    if (this.isPointerLocked) {
      const width = Math.max(window.innerWidth, 1);
      const height = Math.max(window.innerHeight, 1);

      this.pointerLockedDelta.x += event.movementX / width;
      this.pointerLockedDelta.y += event.movementY / height;
      return;
    }

    const { innerWidth, innerHeight } = window;
    const x = (event.clientX / innerWidth) * 2 - 1;
    const y = (event.clientY / innerHeight) * 2 - 1;

    this.pointerTarget.set(
      THREE.MathUtils.clamp(x, -1, 1),
      THREE.MathUtils.clamp(y, -1, 1),
    );
  }

  handlePointerDown(event) {
    if (event.button !== 0) {
      return;
    }

    this.isPrimaryFirePressed = true;

    if (!this.isPointerLocked && this.domElement.requestPointerLock) {
      this.domElement.requestPointerLock();
    }
  }

  handlePointerUp(event) {
    if (event.button === 0) {
      this.isPrimaryFirePressed = false;
    }
  }

  handlePointerLeave() {
    if (!this.isPointerLocked) {
      this.pointerTarget.set(0, 0);
    }
  }

  handlePointerLockChange() {
    this.isPointerLocked = document.pointerLockElement === this.domElement;

    if (!this.isPointerLocked) {
      this.pointerLockedDelta.set(0, 0);
    }
  }

  handleWindowBlur() {
    this.activeKeys.clear();
    this.isPrimaryFirePressed = false;
    this.pendingWeaponSwitch = null;
    this.pendingPauseToggle = false;
    this.pendingRestart = false;
    this.pendingDebugToggle = false;
    this.pointerTarget.set(0, 0);
    this.pointer.set(0, 0);
    this.pointerLockedDelta.set(0, 0);
  }

  update(deltaTime) {
    const smoothing = 1 - Math.exp(-10 * deltaTime);
    this.pointer.lerp(this.pointerTarget, smoothing);
  }

  getTranslationInput() {
    this.translationInput.set(
      Number(isAnyKeyActive(this.activeKeys, TRANSLATION_KEYS.right)) - Number(isAnyKeyActive(this.activeKeys, TRANSLATION_KEYS.left)),
      Number(isAnyKeyActive(this.activeKeys, TRANSLATION_KEYS.up)) - Number(isAnyKeyActive(this.activeKeys, TRANSLATION_KEYS.down)),
      Number(isAnyKeyActive(this.activeKeys, TRANSLATION_KEYS.forward)) - Number(isAnyKeyActive(this.activeKeys, TRANSLATION_KEYS.backward)),
    );

    if (this.translationInput.lengthSq() > 1) {
      this.translationInput.normalize();
    }

    return this.translationInput;
  }

  getRotationInput() {
    this.rotationInput.set(
      Number(isAnyKeyActive(this.activeKeys, ROTATION_KEYS.pitchDown)) - Number(isAnyKeyActive(this.activeKeys, ROTATION_KEYS.pitchUp)),
      Number(isAnyKeyActive(this.activeKeys, ROTATION_KEYS.yawLeft)) - Number(isAnyKeyActive(this.activeKeys, ROTATION_KEYS.yawRight)),
      Number(isAnyKeyActive(this.activeKeys, ROTATION_KEYS.rollLeft)) - Number(isAnyKeyActive(this.activeKeys, ROTATION_KEYS.rollRight)),
    );

    if (this.isPointerLocked) {
      this.rotationInput.x += this.pointerLockedDelta.y * this.mousePitchSensitivity;
      this.rotationInput.y -= this.pointerLockedDelta.x * this.mouseYawSensitivity;
      this.pointerLockedDelta.set(0, 0);
    }

    this.rotationInput.x = THREE.MathUtils.clamp(this.rotationInput.x, -1, 1);
    this.rotationInput.y = THREE.MathUtils.clamp(this.rotationInput.y, -1, 1);
    this.rotationInput.z = THREE.MathUtils.clamp(this.rotationInput.z, -1, 1);

    return this.rotationInput;
  }

  isBoosting() {
    return isAnyKeyActive(this.activeKeys, BOOST_KEYS);
  }

  isTimeSlowing() {
    return isAnyKeyActive(this.activeKeys, TIME_SLOW_KEYS);
  }

  isShielding() {
    return isAnyKeyActive(this.activeKeys, SHIELD_KEYS);
  }

  isFiring() {
    return this.isPrimaryFirePressed;
  }

  consumeWeaponSwitchRequest() {
    const request = this.pendingWeaponSwitch;
    this.pendingWeaponSwitch = null;
    return request;
  }

  consumePauseToggleRequest() {
    const request = this.pendingPauseToggle;
    this.pendingPauseToggle = false;
    return request;
  }

  consumeRestartRequest() {
    const request = this.pendingRestart;
    this.pendingRestart = false;
    return request;
  }

  consumeDebugToggleRequest() {
    const request = this.pendingDebugToggle;
    this.pendingDebugToggle = false;
    return request;
  }

  dispose() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    this.domElement.removeEventListener("pointermove", this.handlePointerMove);
    this.domElement.removeEventListener("pointerdown", this.handlePointerDown);
    window.removeEventListener("pointerup", this.handlePointerUp);
    this.domElement.removeEventListener("pointerleave", this.handlePointerLeave);
    document.removeEventListener("pointerlockchange", this.handlePointerLockChange);
    window.removeEventListener("blur", this.handleWindowBlur);
  }
}
