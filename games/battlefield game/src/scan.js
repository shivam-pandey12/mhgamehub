import { MathUtils, Vector3 } from "three";

const SCAN_COOLDOWN = 15;
const SCAN_DURATION = 2.6;
const SCAN_FOV = 58;

export class BattleScanSystem {
  constructor({ audio, camera, player, ui }) {
    this.audio = audio;
    this.camera = camera;
    this.player = player;
    this.ui = ui;

    this.active = false;
    this.activeRemaining = 0;
    this.cooldownRemaining = 0;
    this.defaultFov = camera.fov;
    this.scanPosition = new Vector3();

    this.handleKeyDown = this.handleKeyDown.bind(this);
    document.addEventListener("keydown", this.handleKeyDown);

    this.ui.setScanState({
      active: false,
      cooldownRemaining: 0,
    });
  }

  handleKeyDown(event) {
    if (event.code !== "KeyQ" || event.repeat) {
      return;
    }

    this.tryActivate();
  }

  tryActivate() {
    if (!this.player.enabled || !this.player.isLocked || this.cooldownRemaining > 0 || this.active) {
      return false;
    }

    this.active = true;
    this.activeRemaining = SCAN_DURATION;
    this.cooldownRemaining = SCAN_COOLDOWN;
    this.ui.setTemporaryStatus("Battle scan online.", "boost", 1.2);
    this.audio?.playScanPulse();
    this.ui.setScanState({
      active: true,
      cooldownRemaining: this.cooldownRemaining,
    });
    return true;
  }

  cancel() {
    this.active = false;
    this.activeRemaining = 0;
    this.restoreView();
    this.ui.setScanState({
      active: false,
      cooldownRemaining: this.cooldownRemaining,
    });
  }

  update(delta) {
    this.cooldownRemaining = Math.max(0, this.cooldownRemaining - delta);

    if (this.active) {
      this.activeRemaining = Math.max(0, this.activeRemaining - delta);
      if (this.activeRemaining === 0) {
        this.active = false;
        this.restoreView();
      }
    }

    this.ui.setScanState({
      active: this.active,
      cooldownRemaining: this.cooldownRemaining,
    });
  }

  applyView() {
    if (!this.active) {
      return;
    }

    this.scanPosition.set(
      this.player.position.x * 0.2,
      84,
      this.player.position.z * 0.18 + 10,
    );
    this.camera.position.copy(this.scanPosition);
    this.setFov(SCAN_FOV);
    this.camera.lookAt(
      this.player.position.x,
      0,
      this.player.position.z - 1.5,
    );
  }

  restoreView() {
    this.setFov(this.defaultFov);
  }

  setFov(fov) {
    if (Math.abs(this.camera.fov - fov) < 0.01) {
      return;
    }

    this.camera.fov = MathUtils.lerp(this.camera.fov, fov, 1);
    this.camera.updateProjectionMatrix();
  }
}
