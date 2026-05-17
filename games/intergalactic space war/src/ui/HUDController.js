export class HUDController {
  constructor(root = document) {
    this.root = root.querySelector(".hud");
    this.timewash = root.querySelector("#hud-timewash");
    this.healthFill = root.querySelector("#hud-health-fill");
    this.healthText = root.querySelector("#hud-health-text");
    this.energyFill = root.querySelector("#hud-energy-fill");
    this.energyText = root.querySelector("#hud-energy-text");
    this.weaponName = root.querySelector("#hud-weapon-name");
    this.weaponSlot = root.querySelector("#hud-weapon-slot");
    this.weaponFill = root.querySelector("#hud-weapon-fill");
    this.weaponStatus = root.querySelector("#hud-weapon-status");
    this.waveLabel = root.querySelector("#hud-wave-label");
    this.waveStatus = root.querySelector("#hud-wave-status");
    this.stealthLabel = root.querySelector("#hud-stealth-label");
    this.stealthStatus = root.querySelector("#hud-stealth-status");
    this.shieldStatus = root.querySelector("#hud-shield-status");
    this.timeStatus = root.querySelector("#hud-time-status");
    this.debugText = root.querySelector("#hud-debug-text");
    this.debugCard = root.querySelector("#hud-debug-card");
    this.debugList = root.querySelector("#hud-debug-list");
    this.scoreText = root.querySelector("#hud-score-text");
    this.killsText = root.querySelector("#hud-kills-text");
    this.timeText = root.querySelector("#hud-time-text");
    this.healthCard = root.querySelector("#hud-health-card");
    this.energyCard = root.querySelector("#hud-energy-card");
    this.weaponCard = root.querySelector("#hud-weapon-card");
    this.waveCard = root.querySelector("#hud-wave-card");
    this.tacticalCard = root.querySelector("#hud-tactical-card");
    this.statsCard = root.querySelector("#hud-stats-card");
    this.overlay = root.querySelector("#hud-overlay");
    this.overlayEyebrow = root.querySelector("#hud-overlay-eyebrow");
    this.overlayTitle = root.querySelector("#hud-overlay-title");
    this.overlayCopy = root.querySelector("#hud-overlay-copy");
    this.banner = root.querySelector("#hud-banner");
    this.bannerTitle = root.querySelector("#hud-banner-title");
    this.bannerCopy = root.querySelector("#hud-banner-copy");
    this.damagePulseTimer = 0;
    this.weaponPulseTimer = 0;
    this.lowHealthPulseTimer = 0;
    this.bannerTimer = 0;
  }

  triggerDamagePulse() {
    this.damagePulseTimer = 0.42;
  }

  triggerWeaponPulse() {
    this.weaponPulseTimer = 0.32;
  }

  triggerLowHealthPulse() {
    this.lowHealthPulseTimer = 0.75;
  }

  showBanner(title, copy = "", duration = 2.2) {
    this.bannerTimer = duration;

    if (this.bannerTitle) {
      this.bannerTitle.textContent = title;
    }

    if (this.bannerCopy) {
      this.bannerCopy.textContent = copy;
    }
  }

  formatTime(totalSeconds = 0) {
    const seconds = Math.max(0, Math.floor(totalSeconds));
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  update(deltaTime, {
    player,
    energy,
    stealth,
    shield,
    time,
    debug,
    weapon,
    wave,
    session,
    overlay,
  } = {}) {
    if (!this.root || !player || !energy || !stealth || !shield || !time || !weapon || !wave || !session) {
      return;
    }

    this.damagePulseTimer = Math.max(0, this.damagePulseTimer - deltaTime);
    this.weaponPulseTimer = Math.max(0, this.weaponPulseTimer - deltaTime);
    this.lowHealthPulseTimer = Math.max(0, this.lowHealthPulseTimer - deltaTime);
    this.bannerTimer = Math.max(0, this.bannerTimer - deltaTime);

    const healthRatio = player.maxHealth > 0 ? player.health / player.maxHealth : 0;
    const weaponIndicatorLevel = weapon.isSwitching
      ? Math.max(0.08, weapon.switchProgress)
      : Math.min(1, 0.32 + weapon.heat * 0.6 + weapon.indicatorLevel * 0.2);

    this.healthFill.style.transform = `scaleX(${Math.max(0.02, healthRatio)})`;
    this.healthText.textContent = `${Math.ceil(player.health)} / ${player.maxHealth}`;
    this.energyFill.style.transform = `scaleX(${Math.max(0.02, energy.ratio)})`;
    this.energyText.textContent = `${Math.ceil(energy.energy)} / ${energy.maxEnergy}`;

    this.weaponName.textContent = weapon.isSwitching && weapon.pendingWeapon
      ? `${weapon.currentWeapon.label} -> ${weapon.pendingWeapon.label}`
      : weapon.currentWeapon.label;
    this.weaponSlot.textContent = String(weapon.displayWeapon.slot).padStart(2, "0");
    this.weaponFill.style.transform = `scaleX(${Math.max(0.04, weaponIndicatorLevel)})`;
    this.weaponStatus.textContent = weapon.isSwitching
      ? `Switching ${Math.round(weapon.switchProgress * 100)}%`
      : "Ready";

    this.waveLabel.textContent = `Wave ${wave.currentWave}`;
    this.waveStatus.textContent = wave.statusLabel;
    this.stealthLabel.textContent = stealth.label;
    this.stealthStatus.textContent = stealth.status;
    this.shieldStatus.textContent = shield.active
      ? `Shield Active ${Math.round(shield.strength * 100)}%`
      : shield.cooldown > 0
        ? `Shield Cooldown ${shield.cooldown.toFixed(1)}s`
        : "Shield Standby";
    this.timeStatus.textContent = time.active
      ? `Slow Time ${(time.worldScale * 100).toFixed(0)}%`
      : time.cooldown > 0
        ? `Cooldown ${time.cooldown.toFixed(1)}s`
        : "Time Flow Nominal";
    this.debugText.textContent = debug?.visible ? "Debug On" : "Debug Off";

    if (this.scoreText) {
      this.scoreText.textContent = session.score.toLocaleString();
    }

    if (this.killsText) {
      this.killsText.textContent = String(session.kills);
    }

    if (this.timeText) {
      this.timeText.textContent = this.formatTime(session.elapsedTime);
    }

    this.root.classList.toggle("hud--low-health", healthRatio < 0.3);
    this.root.classList.toggle("hud--detected", stealth.isDetected);
    this.root.classList.toggle("hud--time-slow", time.effectAmount > 0.1);
    this.root.classList.toggle("hud--shielding", shield.active);
    this.healthCard.classList.toggle("is-pulsing", this.damagePulseTimer > 0);
    this.energyCard?.classList.toggle("is-pulsing", energy.pulse > 0.02);
    this.weaponCard.classList.toggle("is-pulsing", this.weaponPulseTimer > 0 || weapon.indicatorLevel > 0.4);
    this.waveCard.classList.toggle("is-pulsing", wave.enemiesRemaining > 0 && wave.enemiesRemaining <= 2);
    this.healthCard.classList.toggle("is-alert", this.lowHealthPulseTimer > 0 || healthRatio < 0.3);
    this.energyCard?.classList.toggle("is-alert", energy.isLow);
    this.tacticalCard?.classList.toggle("is-alert", stealth.isDetected);
    this.tacticalCard?.classList.toggle("is-pulsing", stealth.isSuspicious || time.effectAmount > 0.18 || shield.active);
    this.statsCard?.classList.toggle("is-pulsing", this.bannerTimer > 0);

    if (this.timewash) {
      this.timewash.style.opacity = `${time.effectAmount * 0.32}`;
    }

    if (this.banner) {
      this.banner.classList.toggle("is-visible", this.bannerTimer > 0);
    }

    if (this.debugCard) {
      this.debugCard.classList.toggle("is-visible", Boolean(debug?.visible));
    }

    if (this.debugList) {
      this.debugList.replaceChildren();

      if (debug?.visible) {
        const rows = debug.enemyStates?.length
          ? debug.enemyStates
          : [{ label: "No contacts", state: "clear", detection: 0, detail: "No active enemies" }];

        for (const entry of rows) {
          const row = document.createElement("div");
          row.className = "hud-debug__row";

          const label = document.createElement("span");
          label.className = "hud-debug__label";
          label.textContent = entry.label;

          const state = document.createElement("strong");
          state.className = `hud-debug__state hud-debug__state--${entry.state}`;
          state.textContent = `${entry.state.toUpperCase()} ${entry.detection}%`;

          const detail = document.createElement("span");
          detail.className = "hud-debug__detail";
          detail.textContent = entry.detail;

          row.append(label, state, detail);
          this.debugList.append(row);
        }
      }
    }

    if (this.overlay) {
      const isVisible = Boolean(overlay?.visible);
      this.overlay.classList.toggle("is-visible", isVisible);

      if (isVisible) {
        if (this.overlayEyebrow) {
          this.overlayEyebrow.textContent = overlay.eyebrow ?? "Combat Status";
        }

        if (this.overlayTitle) {
          this.overlayTitle.textContent = overlay.title ?? "";
        }

        if (this.overlayCopy) {
          this.overlayCopy.textContent = overlay.copy ?? "";
        }
      }
    }
  }
}
