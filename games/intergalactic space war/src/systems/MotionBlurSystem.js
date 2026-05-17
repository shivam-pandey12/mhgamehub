export class MotionBlurSystem {
  constructor({ root = document } = {}) {
    this.overlay = root.querySelector("#hud-motion-blur");
    this.intensity = 0;
  }

  update(deltaTime, {
    player,
    timeSystem,
    gravitySystem,
    shieldSystem,
    isPaused = false,
  } = {}) {
    const speedRatio = player?.boostMaxSpeed
      ? Math.min(1, player.velocity.length() / player.boostMaxSpeed)
      : 0;
    const gravityRatio = gravitySystem?.getPlayerInfluence?.() ?? 0;
    const shieldRatio = shieldSystem?.getVisualAmount?.() ?? 0;
    const timeRatio = timeSystem?.effectAmount ?? 0;

    const targetIntensity = isPaused
      ? 0
      : Math.min(
        1,
        speedRatio * 0.26 + gravityRatio * 0.18 + shieldRatio * 0.1 + timeRatio * 0.95,
      );

    this.intensity += (targetIntensity - this.intensity) * (1 - Math.exp(-6 * deltaTime));

    if (!this.overlay) {
      return;
    }

    const blurAmount = this.intensity * 3.2;
    const overlayOpacity = Math.min(0.42, this.intensity * 0.32);
    const filterValue = `blur(${blurAmount.toFixed(2)}px) saturate(${(1 + this.intensity * 0.34).toFixed(2)})`;

    this.overlay.style.opacity = `${overlayOpacity}`;
    this.overlay.style.backdropFilter = filterValue;
    this.overlay.style.webkitBackdropFilter = filterValue;
    this.overlay.style.transform = `scale(${(1 + this.intensity * 0.006).toFixed(4)})`;
  }

  reset() {
    this.intensity = 0;

    if (!this.overlay) {
      return;
    }

    this.overlay.style.opacity = "0";
    this.overlay.style.backdropFilter = "none";
    this.overlay.style.webkitBackdropFilter = "none";
    this.overlay.style.transform = "scale(1)";
  }
}
