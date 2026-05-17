import { Color, PointLight, Raycaster, Vector2, Vector3 } from "three";

const MAGAZINE_SIZE = 12;
const INFINITE_RESERVE = Number.POSITIVE_INFINITY;
const SHOOT_COOLDOWN = 0.18;
const RELOAD_DURATION = 2;
const KNIFE_COOLDOWN = 0.55;
const KNIFE_DURATION = 0.28;
const KNIFE_RANGE = 2.8;
const GUN_BODY_DAMAGE = 34;
const GUN_HEADSHOT_DAMAGE = 68;
const KNIFE_DAMAGE = 80;
const HIT_FLASH_DURATION = 0.18;
const HIT_FLASH_INTENSITY = 1.6;
const MUZZLE_FLASH_DURATION = 0.06;
const MUZZLE_FLASH_INTENSITY = 2.8;

const GUN_DEFAULT_STATUS = "Rifle ready. Unlimited reserve. Shift or X sprint, G gloo, V view.";
const GUN_EMPTY_STATUS = "Rifle empty. Press R to reload.";
const KNIFE_STATUS = "Knife ready. LMB or Space slash. Press 1 for rifle.";
const KNIFE_COOLDOWN_STATUS = "Knife cooling down.";
const OUT_OF_AMMO_STATUS = "Out of ammo.";
const RELOADING_STATUS = "Reloading rifle...";
const UNLOCKED_STATUS = "Click Enter Scene to aim.";
const GLOO_PREVIEW_STATUS = "Gloo preview active. Tap G to hide or double-tap G to deploy.";

export class WeaponSystem {
  constructor({
    audio,
    camera,
    domElement,
    effects,
    onGunshot,
    player,
    targetProvider,
    targets,
    ui,
    viewRig = null,
  }) {
    this.audio = audio;
    this.camera = camera;
    this.domElement = domElement;
    this.effects = effects;
    this.onGunshot = onGunshot;
    this.player = player;
    this.targetProvider = targetProvider;
    this.targets = targets;
    this.ui = ui;
    this.viewRig = null;
    this.equippedWeapon = "gun";
    this.isAiming = false;
    this.isDisabled = false;
    this.isBarrierModeActive = false;
    this.isViewBlocked = false;
    this.disabledMessage = "";

    this.currentAmmo = MAGAZINE_SIZE;
    this.reserveAmmo = INFINITE_RESERVE;
    this.cooldownRemaining = 0;
    this.knifeCooldownRemaining = 0;
    this.knifeSwingRemaining = 0;
    this.reloadRemaining = 0;
    this.muzzleFlashRemaining = 0;
    this.isReloading = false;

    this.raycaster = new Raycaster();
    this.raycaster.far = 150;
    this.aimPoint = new Vector2(0, 0);
    this.hitFlashColor = new Color(0xffc96e);
    this.activeHitEffects = new Map();
    this.lastAmmoText = "";
    this.lastStatusState = "";
    this.lastStatusText = "";
    this.shotsFired = 0;
    this.shotsHit = 0;
    this.headshots = 0;
    this.tempNormal = new Vector3();
    this.tempMuzzlePosition = new Vector3();
    this.tempMuzzleDirection = new Vector3();

    this.muzzleFlash = new PointLight(0xffe2a6, 0, 10, 2);
    this.setViewRig(viewRig);
    this.player.setEquippedWeapon(this.equippedWeapon);
    this.viewRig?.setWeaponMode(this.equippedWeapon);

    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("mousedown", this.handleMouseDown);
    document.addEventListener("mouseup", this.handleMouseUp);
    this.domElement.addEventListener("contextmenu", this.handleContextMenu);

    this.refreshHud(true);
  }

  setViewRig(viewRig) {
    if (this.muzzleFlash.parent) {
      this.muzzleFlash.parent.remove(this.muzzleFlash);
    }

    this.viewRig = viewRig;
    const flashParent = this.viewRig?.muzzleAnchor ?? this.camera;
    flashParent.add(this.muzzleFlash);

    if (this.viewRig?.muzzleAnchor) {
      this.muzzleFlash.position.set(0, 0, 0);
    } else {
      this.muzzleFlash.position.set(0.32, -0.18, -0.7);
    }
  }

  update(delta) {
    this.cooldownRemaining = Math.max(0, this.cooldownRemaining - delta);
    this.knifeCooldownRemaining = Math.max(0, this.knifeCooldownRemaining - delta);
    this.knifeSwingRemaining = Math.max(0, this.knifeSwingRemaining - delta);

    if (!this.player.isLocked || !this.player.enabled || this.isDisabled) {
      this.setAiming(false);
    }

    if (this.isReloading) {
      this.reloadRemaining -= delta;
      if (this.reloadRemaining <= 0) {
        this.finishReload();
      }
    }

    if (this.muzzleFlashRemaining > 0) {
      this.muzzleFlashRemaining = Math.max(0, this.muzzleFlashRemaining - delta);
      this.muzzleFlash.intensity =
        MUZZLE_FLASH_INTENSITY * (this.muzzleFlashRemaining / MUZZLE_FLASH_DURATION);
    } else {
      this.muzzleFlash.intensity = 0;
    }

    this.updateHitEffects(delta);
    this.refreshHud();
  }

  handleContextMenu(event) {
    event.preventDefault();
  }

  handleMouseDown(event) {
    if (event.button === 2) {
      event.preventDefault();
      if (
        !this.isDisabled &&
        !this.isBarrierModeActive &&
        !this.isViewBlocked &&
        this.equippedWeapon === "gun" &&
        this.player.isLocked &&
        this.player.enabled
      ) {
        this.setAiming(true);
      }
      return;
    }

    if (event.button !== 0) {
      return;
    }

    if (
      this.isDisabled ||
      this.isBarrierModeActive ||
      this.isViewBlocked ||
      !this.player.isLocked ||
      !this.player.enabled
    ) {
      return;
    }

    this.usePrimaryAction();
  }

  handleMouseUp(event) {
    if (event.button === 2) {
      this.setAiming(false);
    }
  }

  handleKeyDown(event) {
    if (event.repeat) {
      return;
    }

    if (event.code === "Space") {
      event.preventDefault();
      if (
        !this.isDisabled &&
        !this.isBarrierModeActive &&
        !this.isViewBlocked &&
        this.player.isLocked &&
        this.player.enabled
      ) {
        this.usePrimaryAction();
      }
      return;
    }

    if (event.code === "Digit1") {
      event.preventDefault();
      this.equipWeapon("gun");
      return;
    }

    if (event.code === "Digit2") {
      event.preventDefault();
      this.equipWeapon("knife");
      return;
    }

    if (event.code === "KeyF") {
      event.preventDefault();
      if (this.equippedWeapon !== "knife") {
        this.equipWeapon("knife");
      } else {
        this.useKnife();
      }
      return;
    }

    if (event.code === "KeyR") {
      this.startReload();
    }
  }

  setAiming(isAiming) {
    this.isAiming = Boolean(
      isAiming &&
      this.equippedWeapon === "gun" &&
      !this.isDisabled &&
      !this.isReloading &&
      this.player.isLocked &&
      this.player.enabled,
    );
    this.player.setAiming(this.isAiming);
  }

  equipWeapon(nextWeapon, { silent = false } = {}) {
    const desiredWeapon = nextWeapon === "knife" ? "knife" : "gun";
    if (desiredWeapon === this.equippedWeapon) {
      return;
    }

    this.equippedWeapon = desiredWeapon;
    this.player.setEquippedWeapon(this.equippedWeapon);
    this.viewRig?.setWeaponMode(this.equippedWeapon);
    this.setAiming(false);

    if (!silent) {
      this.ui.setTemporaryStatus(
        this.equippedWeapon === "gun" ? "Rifle equipped." : "Knife equipped.",
        "boost",
        0.9,
      );
    }

    this.refreshHud(true);
  }

  usePrimaryAction() {
    if (this.equippedWeapon === "knife") {
      this.useKnife();
      return;
    }

    this.fire();
  }

  setDisabled(isDisabled, message = "") {
    this.isDisabled = isDisabled;
    this.disabledMessage = message;

    if (isDisabled) {
      this.isReloading = false;
      this.reloadRemaining = 0;
      this.knifeSwingRemaining = 0;
      this.setAiming(false);
    }

    this.refreshHud(true);
  }

  setViewBlocked(isBlocked) {
    if (this.isViewBlocked === isBlocked) {
      return;
    }

    this.isViewBlocked = isBlocked;
    if (isBlocked) {
      this.setAiming(false);
    }
    this.refreshHud(true);
  }

  setBarrierModeActive(isActive) {
    if (this.isBarrierModeActive === isActive) {
      return;
    }

    this.isBarrierModeActive = isActive;
    if (isActive) {
      this.setAiming(false);
    }
    this.refreshHud(true);
  }

  getTargets() {
    if (this.targetProvider) {
      return this.targetProvider();
    }

    return this.targets ?? [];
  }

  fire() {
    if (
      this.equippedWeapon !== "gun" ||
      this.isDisabled ||
      this.isBarrierModeActive ||
      this.isViewBlocked ||
      this.isReloading ||
      this.cooldownRemaining > 0 ||
      this.knifeSwingRemaining > 0
    ) {
      return;
    }

    if (this.currentAmmo <= 0) {
      if (this.hasReserveAmmo()) {
        this.ui.setTemporaryStatus("Reload needed. Press R.", "warning", 0.95);
      }
      this.refreshHud(true);
      return;
    }

    this.currentAmmo -= 1;
    this.shotsFired += 1;
    this.cooldownRemaining = SHOOT_COOLDOWN;
    this.muzzleFlashRemaining = MUZZLE_FLASH_DURATION;
    this.player.applyRecoil({
      pitch: this.player.isScopeActive ? 0.012 : this.isAiming ? 0.018 : 0.03,
      yaw: (Math.random() - 0.5) * (this.player.isScopeActive ? 0.003 : this.isAiming ? 0.006 : 0.012),
    });
    this.player.applyCameraShake({
      duration: 0.08,
      strength: this.player.isScopeActive ? 0.0026 : this.isAiming ? 0.0038 : 0.0055,
    });
    this.audio?.playPlayerGunshot({
      aiming: this.isAiming,
    });
    this.viewRig?.triggerShoot();
    this.spawnMuzzleBurst();
    this.onGunshot?.({
      position: {
        x: this.player.position.x,
        z: this.player.position.z,
      },
    });

    this.raycaster.far = 150;
    this.raycaster.setFromCamera(this.aimPoint, this.camera);

    const hits = this.raycaster.intersectObjects(this.getTargets(), true);
    if (hits.length > 0) {
      this.handleProjectileHit(hits[0]);
    }

    if (this.currentAmmo === 0 && this.hasReserveAmmo()) {
      this.ui.setTemporaryStatus("Magazine empty. Press R to reload.", "warning", 1.1);
    }

    this.refreshHud(this.currentAmmo === 0 && this.hasReserveAmmo());
  }

  useKnife() {
    if (
      this.equippedWeapon !== "knife" ||
      this.isDisabled ||
      this.isBarrierModeActive ||
      this.isViewBlocked ||
      !this.player.isLocked ||
      !this.player.enabled ||
      this.isReloading ||
      this.knifeCooldownRemaining > 0 ||
      this.knifeSwingRemaining > 0
    ) {
      return;
    }

    this.knifeCooldownRemaining = KNIFE_COOLDOWN;
    this.knifeSwingRemaining = KNIFE_DURATION;
    this.cooldownRemaining = Math.max(this.cooldownRemaining, 0.12);
    this.setAiming(false);
    this.player.applyForwardImpulse(2.4);
    this.player.applyCameraShake({
      duration: 0.12,
      strength: 0.008,
    });
    this.audio?.playKnifeSlash();
    this.viewRig?.triggerKnife();

    this.raycaster.far = KNIFE_RANGE;
    this.raycaster.setFromCamera(this.aimPoint, this.camera);

    const hits = this.raycaster.intersectObjects(this.getTargets(), true);
    if (hits.length > 0) {
      this.handleMeleeHit(hits[0]);
    }

    this.refreshHud(true);
  }

  startReload() {
    if (
      this.equippedWeapon !== "gun" ||
      this.isDisabled ||
      this.isBarrierModeActive ||
      this.isViewBlocked ||
      !this.player.isLocked ||
      !this.player.enabled ||
      this.isReloading ||
      this.knifeSwingRemaining > 0
    ) {
      return;
    }

    if (this.currentAmmo === MAGAZINE_SIZE) {
      this.refreshHud(true);
      return;
    }

    this.setAiming(false);
    this.isReloading = true;
    this.reloadRemaining = RELOAD_DURATION;
    this.audio?.playReload();
    this.ui.setTemporaryStatus("Reloading rifle...", "warning", 1.1);
    this.refreshHud(true);
  }

  finishReload() {
    const neededAmmo = MAGAZINE_SIZE - this.currentAmmo;
    const transferredAmmo = Number.isFinite(this.reserveAmmo)
      ? Math.min(neededAmmo, this.reserveAmmo)
      : neededAmmo;

    this.currentAmmo += transferredAmmo;
    if (Number.isFinite(this.reserveAmmo)) {
      this.reserveAmmo -= transferredAmmo;
    }
    this.isReloading = false;
    this.reloadRemaining = 0;
    this.ui.setTemporaryStatus("Reload complete.", "boost", 0.9);
    this.refreshHud(true);
  }

  handleProjectileHit(hit) {
    const damageReceiver = hit.object.userData.damageReceiver;
    const hitZone = hit.object.userData.hitZone ?? "body";
    const worldNormal = hit.face?.normal
      ? this.tempNormal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld)
      : null;

    this.effects?.spawnImpact(hit.point, {
      headshot: hitZone === "head",
      normal: worldNormal,
    });
    this.audio?.playImpact(hit.point, this.player.position);

    if (damageReceiver) {
      const result = damageReceiver.takeDamage(
        hitZone === "head" ? GUN_HEADSHOT_DAMAGE : GUN_BODY_DAMAGE,
        {
          hitZone,
          point: hit.point,
          sourceObject: hit.object,
        },
      );

      if (result?.hit) {
        this.shotsHit += 1;
        this.ui.flashHitMarker(result.headshot);
        this.audio?.playHitConfirm(result.headshot);
      }
      if (result?.headshot) {
        this.headshots += 1;
        this.ui.setTemporaryStatus("Headshot.", "boost", 0.95);
      }
      return;
    }

    this.applyHitEffect(hit.object);
  }

  handleMeleeHit(hit) {
    const damageReceiver = hit.object.userData.damageReceiver;
    const worldNormal = hit.face?.normal
      ? this.tempNormal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld)
      : null;

    this.effects?.spawnImpact(hit.point, {
      normal: worldNormal,
    });
    this.audio?.playImpact(hit.point, this.player.position);

    if (!damageReceiver) {
      this.applyHitEffect(hit.object);
      return;
    }

    const result = damageReceiver.takeDamage(KNIFE_DAMAGE, {
      hitZone: "melee",
      point: hit.point,
      sourceObject: hit.object,
    });

    if (result?.hit) {
      this.ui.flashHitMarker(false);
      this.audio?.playHitConfirm(false);
      this.ui.setTemporaryStatus("Knife hit.", "boost", 0.7);
    }
  }

  spawnMuzzleBurst() {
    this.camera.getWorldDirection(this.tempMuzzleDirection);

    if (this.viewRig?.muzzleAnchor) {
      this.viewRig.muzzleAnchor.getWorldPosition(this.tempMuzzlePosition);
    } else {
      this.camera.getWorldPosition(this.tempMuzzlePosition);
      this.tempMuzzlePosition.addScaledVector(this.tempMuzzleDirection, 0.7);
    }

    this.effects?.spawnMuzzleBurst(this.tempMuzzlePosition, this.tempMuzzleDirection);
  }

  getStats() {
    return {
      accuracy: this.shotsFired > 0 ? this.shotsHit / this.shotsFired : 0,
      headshots: this.headshots,
      shotsFired: this.shotsFired,
      shotsHit: this.shotsHit,
    };
  }

  getEquippedMode() {
    return this.equippedWeapon;
  }

  applyHitEffect(target) {
    this.prepareFlashTarget(target);
    this.activeHitEffects.set(target, HIT_FLASH_DURATION);
  }

  prepareFlashTarget(target) {
    if (!target?.material?.emissive || target.userData.baseEmissive) {
      return;
    }

    target.userData.baseEmissive = target.material.emissive.clone();
    target.userData.baseEmissiveIntensity = target.material.emissiveIntensity;
  }

  updateHitEffects(delta) {
    for (const [target, remaining] of this.activeHitEffects.entries()) {
      if (!target?.material?.emissive) {
        this.activeHitEffects.delete(target);
        continue;
      }

      this.prepareFlashTarget(target);

      const nextRemaining = remaining - delta;
      const material = target.material;
      const flashMix = Math.max(0, nextRemaining / HIT_FLASH_DURATION);

      material.emissive
        .copy(target.userData.baseEmissive)
        .lerp(this.hitFlashColor, flashMix);
      material.emissiveIntensity =
        target.userData.baseEmissiveIntensity +
        flashMix * (HIT_FLASH_INTENSITY - target.userData.baseEmissiveIntensity);

      if (nextRemaining <= 0) {
        material.emissive.copy(target.userData.baseEmissive);
        material.emissiveIntensity = target.userData.baseEmissiveIntensity;
        this.activeHitEffects.delete(target);
      } else {
        this.activeHitEffects.set(target, nextRemaining);
      }
    }
  }

  getStatusMessage() {
    if (this.isDisabled) {
      return { text: this.disabledMessage || "Weapon offline.", state: "alert" };
    }

    if (this.isViewBlocked) {
      return { text: "Battle scan active.", state: "warning" };
    }

    if (this.isBarrierModeActive) {
      return { text: GLOO_PREVIEW_STATUS, state: "boost" };
    }

    if (!this.player.isLocked) {
      return { text: UNLOCKED_STATUS, state: "warning" };
    }

    if (this.equippedWeapon === "knife") {
      if (this.knifeCooldownRemaining > 0) {
        return { text: KNIFE_COOLDOWN_STATUS, state: "idle" };
      }

      return { text: KNIFE_STATUS, state: "idle" };
    }

    if (this.isReloading) {
      return { text: RELOADING_STATUS, state: "warning" };
    }

    if (this.currentAmmo === 0 && this.hasReserveAmmo()) {
      return { text: GUN_EMPTY_STATUS, state: "alert" };
    }

    if (this.currentAmmo === 0 && !this.hasReserveAmmo()) {
      return { text: OUT_OF_AMMO_STATUS, state: "alert" };
    }

    return { text: GUN_DEFAULT_STATUS, state: "idle" };
  }

  refreshHud(force = false) {
    const reserveText = formatAmmoCount(this.reserveAmmo);
    const ammoText = `${this.currentAmmo} / ${reserveText}`;
    if (force || ammoText !== this.lastAmmoText) {
      this.lastAmmoText = ammoText;
      this.ui.setAmmo(this.currentAmmo, reserveText);
    }

    const { text, state } = this.getStatusMessage();
    if (force || text !== this.lastStatusText || state !== this.lastStatusState) {
      this.lastStatusText = text;
      this.lastStatusState = state;
      this.ui.setStatus("weapon", text, state);
    }
  }

  hasReserveAmmo() {
    return !Number.isFinite(this.reserveAmmo) || this.reserveAmmo > 0;
  }
}

function formatAmmoCount(value) {
  return Number.isFinite(value) ? `${value}` : "∞";
}
