const HEALTH_LERP_SPEED = 10;
const EFFECT_FADE_SPEED = 3.8;
const STATUS_PRIORITY = ["system", "weapon"];

export class GameUi {
  constructor(elements) {
    this.elements = elements;

    this.health = {
      current: 100,
      displayed: 100,
      max: 100,
    };

    this.damageFlash = 0;
    this.healFlash = 0;
    this.hitMarker = 0;
    this.hitMarkerState = "hit";
    this.lowHealthIntensity = 0;
    this.scopeActive = false;
    this.statusChannels = new Map();
    this.temporaryStatus = null;
    this.resultVisible = false;

    this.setStatus("weapon", "Click Enter Scene to aim.", "warning");
    this.setHealth({ current: 100, force: true, max: 100 });
    this.setHealState({
      cooldownRemaining: 0,
      currentHealth: 100,
      maxCharges: 2,
      maxHealth: 100,
      remainingCharges: 2,
    });
    this.setScanState({
      active: false,
      cooldownRemaining: 0,
    });
    this.setEnemyCount(0);
    this.setAmmo(12, "∞");
    this.setGlooState({
      activeCount: 0,
      blocked: false,
      previewActive: false,
      previewValid: false,
    });
    this.renderStatus();
  }

  update(delta) {
    const lerpFactor = 1 - Math.exp(-HEALTH_LERP_SPEED * delta);
    this.health.displayed += (this.health.current - this.health.displayed) * lerpFactor;

    if (Math.abs(this.health.displayed - this.health.current) < 0.05) {
      this.health.displayed = this.health.current;
    }

    this.damageFlash = Math.max(0, this.damageFlash - delta * EFFECT_FADE_SPEED);
    this.healFlash = Math.max(0, this.healFlash - delta * EFFECT_FADE_SPEED * 0.9);
    this.hitMarker = Math.max(0, this.hitMarker - delta * EFFECT_FADE_SPEED * 1.8);

    if (this.temporaryStatus) {
      this.temporaryStatus.remaining -= delta;
      if (this.temporaryStatus.remaining <= 0) {
        this.temporaryStatus = null;
      }
    }

    this.renderHealth();
    this.elements.damageFlash.style.opacity = `${this.damageFlash}`;
    this.elements.healFlash.style.opacity = `${this.healFlash}`;
    this.elements.hitMarker.style.opacity = `${this.hitMarker}`;
    this.elements.hitMarker.style.transform =
      `translate(-50%, -50%) scale(${1 + this.hitMarker * 0.2})`;
    this.elements.hitMarker.dataset.state = this.hitMarkerState;
    this.elements.lowHealthVignette.style.opacity = `${this.lowHealthIntensity}`;
    this.elements.scopeOverlay.style.opacity = this.scopeActive ? "1" : "0";
    this.elements.crosshair.style.opacity = this.scopeActive ? "0.18" : "0.85";
    this.renderStatus();
  }

  setIntroVisible(isVisible) {
    this.elements.introCard.classList.toggle("is-hidden", !isVisible || this.resultVisible);
  }

  setAmmo(currentAmmo, reserveAmmo) {
    this.elements.ammoReadout.textContent = `${currentAmmo} / ${reserveAmmo}`;
  }

  setEnemyCount(count) {
    this.elements.enemyReadout.textContent = `${count}`;
  }

  setScanState({ active, cooldownRemaining }) {
    if (active) {
      this.elements.scanReadout.textContent = "Active";
      this.elements.scanNote.textContent = "Tactical camera uplink live";
      this.elements.scanReadout.dataset.state = "hot";
      return;
    }

    if (cooldownRemaining > 0) {
      this.elements.scanReadout.textContent = `${cooldownRemaining.toFixed(1)}s`;
      this.elements.scanNote.textContent = "Recharging command uplink";
      this.elements.scanReadout.dataset.state = "low";
      return;
    }

    this.elements.scanReadout.textContent = "Ready";
    this.elements.scanNote.textContent = "Press Q for tactical overview";
    this.elements.scanReadout.dataset.state = "stable";
  }

  setGlooState({ activeCount, blocked, previewActive, previewValid }) {
    if (blocked) {
      this.elements.glooReadout.textContent = `${activeCount} active`;
      this.elements.glooNote.textContent = "Unavailable right now";
      this.elements.glooReadout.dataset.state = "low";
      return;
    }

    if (previewActive) {
      this.elements.glooReadout.textContent = previewValid ? "Preview" : "Blocked";
      this.elements.glooNote.textContent = previewValid
        ? "Tap G to hide or double-tap to deploy"
        : "Find a clear spot";
      this.elements.glooReadout.dataset.state = previewValid ? "hot" : "critical";
      return;
    }

    if (activeCount > 0) {
      this.elements.glooReadout.textContent = `${activeCount} active`;
      this.elements.glooNote.textContent = "Press G to place another";
      this.elements.glooReadout.dataset.state = "stable";
      return;
    }

    this.elements.glooReadout.textContent = "Ready";
    this.elements.glooNote.textContent = "Press G to preview wall";
    this.elements.glooReadout.dataset.state = "stable";
  }

  setHealth({ current, force = false, max }) {
    this.health.current = current;
    this.health.max = max;

    if (force) {
      this.health.displayed = current;
    }

    const healthState =
      current <= 25 ? "critical" : current <= 55 ? "low" : "stable";

    this.elements.healthReadout.dataset.state = healthState;
    this.elements.healthNote.textContent =
      current <= 25 ? "Critical condition" : current <= 55 ? "Under pressure" : "Combat ready";

    this.renderHealth(force);
  }

  renderHealth(force = false) {
    const percentage = clamp(this.health.displayed / this.health.max, 0, 1);
    const roundedHealth = Math.round(this.health.displayed);

    if (force || this.elements.healthReadout.textContent !== `${roundedHealth}`) {
      this.elements.healthReadout.textContent = `${roundedHealth}`;
    }

    this.elements.healthFill.style.transform = `scaleX(${percentage})`;
  }

  setHealState({
    cooldownRemaining,
    currentHealth,
    healingRemaining = 0,
    isHealing = false,
    maxCharges,
    maxHealth,
    remainingCharges,
  }) {
    this.elements.healReadout.textContent = `${remainingCharges} / ${maxCharges}`;

    for (const [index, charge] of this.elements.healChargeElements.entries()) {
      charge.classList.toggle("is-empty", index >= remainingCharges);
      charge.classList.toggle(
        "is-cooldown",
        index < remainingCharges && cooldownRemaining > 0,
      );
    }

    if (remainingCharges === 0) {
      this.elements.healNote.textContent = "No field kits left";
      return;
    }

    if (isHealing) {
      this.elements.healNote.textContent = `Applying ${healingRemaining.toFixed(1)}s`;
      return;
    }

    if (cooldownRemaining > 0) {
      this.elements.healNote.textContent = `Recharging ${cooldownRemaining.toFixed(1)}s`;
      return;
    }

    if (currentHealth >= maxHealth) {
      this.elements.healNote.textContent = "Health already full";
      return;
    }

    this.elements.healNote.textContent = "Press H to restore 50 HP over time";
  }

  flashDamage(intensity = 1) {
    this.damageFlash = Math.min(1, this.damageFlash + 0.45 * intensity);
  }

  flashHeal() {
    this.healFlash = 0.85;
  }

  flashHitMarker(headshot = false) {
    this.hitMarker = 1;
    this.hitMarkerState = headshot ? "headshot" : "hit";
  }

  setScopeActive(isActive) {
    this.scopeActive = Boolean(isActive);
  }

  setLowHealthIntensity(intensity) {
    this.lowHealthIntensity = intensity <= 0 ? 0 : clamp(0.12 + intensity * 0.58, 0, 0.78);
  }

  setStatus(channel, text, state = "idle") {
    this.statusChannels.set(channel, { state, text });
    this.renderStatus();
  }

  setTemporaryStatus(text, state = "idle", duration = 1.8) {
    this.temporaryStatus = {
      remaining: duration,
      state,
      text,
    };
    this.renderStatus();
  }

  renderStatus() {
    const activeStatus = this.temporaryStatus ?? this.getPersistentStatus();
    if (!activeStatus) {
      return;
    }

    this.elements.statusText.textContent = activeStatus.text;
    this.elements.statusText.dataset.state = activeStatus.state;
  }

  getPersistentStatus() {
    for (const channel of STATUS_PRIORITY) {
      const status = this.statusChannels.get(channel);
      if (status) {
        return status;
      }
    }

    return null;
  }

  showResult({
    accuracy,
    detail,
    eyebrow,
    kills,
    score,
    timeSurvived,
    title,
    variant,
  }) {
    this.resultVisible = true;
    this.elements.resultCard.dataset.variant = variant;
    this.elements.resultEyebrow.textContent = eyebrow;
    this.elements.resultTitle.textContent = title;
    this.elements.resultDetail.textContent = detail;
    this.elements.resultKills.textContent = `${kills}`;
    this.elements.resultAccuracy.textContent = `${accuracy}%`;
    this.elements.resultScore.textContent = `${score}`;
    this.elements.resultTime.textContent = timeSurvived;
    this.elements.resultCard.classList.add("is-visible");
    this.setIntroVisible(false);
  }

  hideResult() {
    this.resultVisible = false;
    this.elements.resultCard.classList.remove("is-visible");
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
