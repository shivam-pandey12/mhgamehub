import { formatTime } from '../utils/math.js';
import { getLicenseForXp } from '../../config/progression.js';
import { WORLD_CONFIG } from '../../config/city.js';

export class HUDManager {
  constructor(root, inputManager, saveManager, callbacks) {
    this.root = root;
    this.inputManager = inputManager;
    this.saveManager = saveManager;
    this.callbacks = callbacks;
    this.toasts = [];
    this.buildDom();
    this.bind();
    this.applySettingsToInputs();
  }

  buildDom() {
    this.layer = document.createElement('div');
    this.layer.className = 'screen-layer';
    this.layer.innerHTML = `
      <section class="hud is-hidden" data-hud>
        <div class="hud-panel hud-top">
          <div class="speedometer">
            <div class="speedometer__dial"><div class="speedometer__needle" data-speed-needle></div></div>
            <div>
              <div class="speedometer__value" data-speed-value>0</div>
              <div class="speedometer__unit">km/h</div>
            </div>
          </div>
          <div class="objective">
            <div class="objective__title" data-objective-title>Free Drive</div>
            <div class="objective__copy" data-objective-copy>Explore the city.</div>
          </div>
          <div class="hud-stats">
            <div class="hud-stat"><span>Car</span><strong data-car-name>Hatchback</strong></div>
            <div class="hud-stat"><span>Coins</span><strong data-coins>0</strong></div>
            <div class="hud-stat"><span>District</span><strong data-zone>Downtown</strong></div>
            <div class="hud-stat"><span>License</span><strong data-license>Rookie</strong></div>
          </div>
        </div>
        <div class="hud-panel mission-meters" data-meters>
          <div class="meter-row" data-timer-row><span>Timer</span><span class="meter-track"><span class="meter-fill" data-timer-fill></span></span><strong data-timer>--</strong></div>
          <div class="meter-row" data-event-row><span>Event</span><span class="meter-track"><span class="meter-fill" data-event-fill></span></span><strong data-event-name>-</strong></div>
          <div class="meter-row" data-task-row><span>Task</span><span class="meter-track"><span class="meter-fill" data-task-fill></span></span><strong data-task-name>-</strong></div>
          <div class="meter-row"><span>License XP</span><span class="meter-track"><span class="meter-fill" data-license-fill></span></span><strong data-license-xp>0</strong></div>
          <div class="meter-row"><span>Boost</span><span class="meter-track"><span class="meter-fill" data-boost-fill></span></span><strong data-boost>100</strong></div>
          <div class="meter-row is-hidden" data-condition-row><span>Package</span><span class="meter-track"><span class="meter-fill" data-condition-fill></span></span><strong data-condition>100</strong></div>
          <div class="meter-row is-hidden" data-comfort-row><span>Comfort</span><span class="meter-track"><span class="meter-fill" data-comfort-fill></span></span><strong data-comfort>100</strong></div>
          <div class="meter-row is-hidden" data-parking-row><span>Parking</span><span class="meter-track"><span class="meter-fill" data-parking-fill></span></span><strong data-parking>0</strong></div>
          <div class="meter-row is-hidden" data-drift-row><span>Drift</span><span class="meter-track"><span class="meter-fill" data-drift-fill></span></span><strong data-drift>0</strong></div>
        </div>
        <div class="hud-panel radar" data-radar>
          <div class="minimap-label" data-minimap-label>Mini City</div>
          <div class="radar__ring">
            <div class="radar__arrow" data-radar-arrow></div>
            <div class="radar__target" data-radar-target></div>
          </div>
        </div>
        <div class="camera-mode-pill" data-camera-mode>Standard Chase</div>
        <div class="cockpit-assist is-hidden" data-cockpit-assist>Parking assist active - press C for chase view</div>
        <div class="touch-controls">
          <div class="touch-cluster">
            <button class="touch-button" type="button" data-touch="left">A</button>
            <button class="touch-button" type="button" data-touch="right">D</button>
          </div>
          <div class="touch-cluster">
            <button class="touch-button" type="button" data-touch="brake">S</button>
            <button class="touch-button" type="button" data-touch="handbrake">HB</button>
            <button class="touch-button" type="button" data-touch="boost">B</button>
            <button class="touch-button" type="button" data-touch="accelerate">W</button>
          </div>
        </div>
      </section>
      <section class="pause-menu is-hidden" data-pause>
        <div class="pause-menu__panel">
          <p class="eyebrow">Paused</p>
          <h2>Mini City Drive</h2>
          <div class="pause-actions">
            <button class="primary-button" type="button" data-resume>Resume</button>
            <button class="secondary-button" type="button" data-restart>Restart Mission</button>
            <button class="secondary-button" type="button" data-garage>Garage</button>
            <button class="secondary-button" type="button" data-toggle-settings>Settings</button>
            <button class="secondary-button" type="button" data-toggle-controls>Controls</button>
            <button class="secondary-button" type="button" data-main-menu>Main Menu</button>
          </div>
          <div class="settings-panel is-hidden" data-settings-panel>
            <div class="settings-grid">
              <label class="settings-row">Master <input type="range" min="0" max="1" step="0.01" data-setting="masterVolume"></label>
              <label class="settings-row">Engine <input type="range" min="0" max="1" step="0.01" data-setting="engineVolume"></label>
              <label class="settings-row">Tires <input type="range" min="0" max="1" step="0.01" data-setting="tireVolume"></label>
              <label class="settings-row">UI <input type="range" min="0" max="1" step="0.01" data-setting="uiVolume"></label>
              <label class="settings-row">Ambience <input type="range" min="0" max="1" step="0.01" data-setting="ambienceVolume"></label>
              <label class="settings-row">Shake <select data-setting="cameraShake"><option value="off">Off</option><option value="low">Low</option><option value="normal">Normal</option></select></label>
              <label class="settings-row">Traffic <select data-setting="trafficDensity"><option value="off">Off</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
              <label class="settings-row">Quality <select data-setting="visualQuality"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
              <label class="settings-row">Default Camera <select data-setting="cameraMode"><option value="standard">Standard Chase</option><option value="far">Far Chase</option><option value="hood">Hood</option><option value="cockpit">Cockpit</option></select></label>
              <label class="settings-row">Cockpit Motion <select data-setting="cockpitMotion"><option value="off">Off</option><option value="low">Low</option><option value="normal">Normal</option></select></label>
              <label class="settings-row">Cockpit HUD <select data-setting="cockpitHud"><option value="minimal">Minimal</option><option value="normal">Normal</option></select></label>
              <label class="settings-row">Cockpit FOV <select data-setting="cockpitFov"><option value="low">Low</option><option value="normal">Normal</option><option value="wide">Wide</option></select></label>
              <label class="settings-row">Mirrors <select data-setting="mirrorRendering"><option value="geometry">Geometry</option><option value="off">Off</option></select></label>
              <label class="settings-row">Dash Brightness <input type="range" min="0.35" max="1.2" step="0.01" data-setting="dashboardBrightness"></label>
              <label class="settings-row">Minimap <input type="checkbox" data-setting="minimap"></label>
              <label class="settings-row">Debug <input type="checkbox" data-setting="debugOverlay"></label>
              <label class="settings-row">UI Scale <select data-setting="uiScale"><option value="small">Small</option><option value="normal">Normal</option><option value="large">Large</option></select></label>
              <label class="settings-row">Touch <select data-setting="touchControls"><option value="auto">Auto</option><option value="on">On</option><option value="off">Off</option></select></label>
              <button class="secondary-button" type="button" data-reset-progress>Reset Local Progress</button>
            </div>
          </div>
          <div class="controls-panel is-hidden" data-controls-panel>
            <div class="controls-grid">
              <div class="control-chip"><span>Accelerate</span><kbd>W / Up</kbd></div>
              <div class="control-chip"><span>Brake / Reverse</span><kbd>S / Down</kbd></div>
              <div class="control-chip"><span>Steer</span><kbd>A D</kbd></div>
              <div class="control-chip"><span>Handbrake</span><kbd>Space</kbd></div>
              <div class="control-chip"><span>Boost</span><kbd>Shift</kbd></div>
              <div class="control-chip"><span>Camera</span><kbd>C</kbd></div>
              <div class="control-chip"><span>Cockpit toggle</span><kbd>V</kbd></div>
              <div class="control-chip"><span>Reset car</span><kbd>R</kbd></div>
              <div class="control-chip"><span>Pause</span><kbd>Esc</kbd></div>
            </div>
          </div>
        </div>
      </section>
      <section class="result-modal is-hidden" data-result>
        <div class="result-modal__panel">
          <p class="eyebrow" data-result-eyebrow>Mission result</p>
          <h2 data-result-title>Complete</h2>
          <div class="result-summary" data-result-summary></div>
          <div class="result-actions">
            <button class="primary-button" type="button" data-result-retry>Retry</button>
            <button class="secondary-button" type="button" data-result-free>Free Drive</button>
            <button class="secondary-button" type="button" data-result-garage>Garage</button>
            <button class="secondary-button" type="button" data-result-main>Main Menu</button>
          </div>
        </div>
      </section>
      <div class="debug-overlay is-hidden" data-debug></div>
      <div class="toast-stack is-hidden" data-toasts></div>
    `;
    this.root.appendChild(this.layer);
    this.hud = this.layer.querySelector('[data-hud]');
    this.pause = this.layer.querySelector('[data-pause]');
    this.result = this.layer.querySelector('[data-result]');
    this.toastsEl = this.layer.querySelector('[data-toasts]');
  }

  bind() {
    this.layer.querySelector('[data-resume]').addEventListener('click', this.callbacks.onResume);
    this.layer.querySelector('[data-restart]').addEventListener('click', this.callbacks.onRestart);
    this.layer.querySelector('[data-garage]').addEventListener('click', this.callbacks.onGarage);
    this.layer.querySelector('[data-main-menu]').addEventListener('click', this.callbacks.onMainMenu);
    this.layer.querySelector('[data-toggle-settings]').addEventListener('click', () => this.togglePanel('settings'));
    this.layer.querySelector('[data-toggle-controls]').addEventListener('click', () => this.togglePanel('controls'));
    this.layer.querySelector('[data-result-retry]').addEventListener('click', this.callbacks.onRetry);
    this.layer.querySelector('[data-result-free]').addEventListener('click', () => this.callbacks.onStartMode('freeDrive'));
    this.layer.querySelector('[data-result-garage]').addEventListener('click', this.callbacks.onGarage);
    this.layer.querySelector('[data-result-main]').addEventListener('click', this.callbacks.onMainMenu);
    this.layer.querySelector('[data-reset-progress]').addEventListener('click', () => {
      if (window.confirm('Reset local Mini City Drive progress on this device?')) {
        this.saveManager.resetProgress();
        this.showToast('Local progress reset');
        this.callbacks.onSettingsChanged();
      }
    });
    this.layer.querySelectorAll('[data-setting]').forEach((input) => {
      input.addEventListener('input', () => {
        const key = input.dataset.setting;
        const value = input.type === 'checkbox'
          ? input.checked
          : input.type === 'range'
            ? Number(input.value)
            : input.value;
        this.saveManager.updateSettings({ [key]: value });
        this.callbacks.onSettingsChanged();
      });
    });
    this.layer.querySelectorAll('[data-touch]').forEach((button) => {
      this.inputManager.bindTouchButton(button, button.dataset.touch);
    });
  }

  applySettingsToInputs() {
    this.layer.querySelectorAll('[data-setting]').forEach((input) => {
      const value = this.saveManager.settings[input.dataset.setting];
      if (input.type === 'checkbox') input.checked = Boolean(value);
      else input.value = value;
    });
  }

  togglePanel(name) {
    const settings = this.layer.querySelector('[data-settings-panel]');
    const controls = this.layer.querySelector('[data-controls-panel]');
    if (name === 'settings') {
      settings.classList.toggle('is-hidden');
      controls.classList.add('is-hidden');
    } else {
      controls.classList.toggle('is-hidden');
      settings.classList.add('is-hidden');
    }
  }

  showHud() {
    this.hud.classList.remove('is-hidden');
  }

  hideHud() {
    this.hud.classList.add('is-hidden');
  }

  showPause() {
    this.pause.classList.remove('is-hidden');
  }

  hidePause() {
    this.pause.classList.add('is-hidden');
  }

  showResult(result, carName) {
    this.hidePause();
    this.result.classList.remove('is-hidden');
    this.layer.querySelector('[data-result-eyebrow]').textContent = result.success ? 'Mission complete' : 'Mission failed';
    this.layer.querySelector('[data-result-title]').textContent = result.success ? result.missionName : result.reason;
    const summary = this.layer.querySelector('[data-result-summary]');
    summary.innerHTML = `
      <div class="result-tile"><span>Car</span><strong>${carName}</strong></div>
      <div class="result-tile"><span>Rank</span><strong>${result.rank}</strong></div>
      <div class="result-tile"><span>Medal</span><strong>${result.medal ?? '-'}</strong></div>
      <div class="result-tile"><span>Score</span><strong>${result.score}</strong></div>
      <div class="result-tile"><span>Coins</span><strong>+${result.coinsEarned}</strong></div>
      <div class="result-tile"><span>XP</span><strong>+${result.xpEarned ?? 0}</strong></div>
      <div class="result-tile"><span>Mastery</span><strong>+${result.masteryXp ?? 0}</strong></div>
      <div class="result-tile"><span>Time</span><strong>${result.time}</strong></div>
      <div class="result-tile"><span>Best</span><strong>${result.isBest ? 'New best' : result.bestBefore}</strong></div>
      <div class="result-tile"><span>Bonuses</span><strong>${result.bonusObjectives?.filter((item) => item.complete).length ?? 0}/${result.bonusObjectives?.length ?? 0}</strong></div>
      <div class="result-tile"><span>Unlocks</span><strong>${result.newUnlocks?.length ? result.newUnlocks.join(', ') : '-'}</strong></div>
      <div class="result-tile"><span>Achievements</span><strong>${result.achievements?.length ? result.achievements.map((item) => item.name).join(', ') : '-'}</strong></div>
    `;
  }

  hideResult() {
    this.result.classList.add('is-hidden');
  }

  update(telemetry, missionHud, saveData, carConfig, playerPosition, heading, phase3Hud = null, debugData = {}) {
    this.root.dataset.uiScale = this.saveManager.settings.uiScale;
    const cockpitActive = debugData.cameraMode === 'cockpit';
    const cockpitMinimal = cockpitActive && this.saveManager.settings.cockpitHud === 'minimal';
    this.hud.classList.toggle('is-cockpit-minimal', cockpitMinimal);
    this.layer.querySelector('[data-camera-mode]').textContent = debugData.cameraLabel ?? 'Standard Chase';
    const touchControls = this.layer.querySelector('.touch-controls');
    if (touchControls) {
      touchControls.style.display = this.saveManager.settings.touchControls === 'off'
        ? 'none'
        : this.saveManager.settings.touchControls === 'on'
          ? 'flex'
          : '';
    }
    this.layer.querySelector('[data-speed-value]').textContent = telemetry.speedKmh;
    const needleAngle = -118 + telemetry.speedRatio * 236;
    this.layer.querySelector('[data-speed-needle]').style.transform = `translateX(-50%) rotate(${needleAngle}deg)`;
    this.layer.querySelector('[data-objective-title]').textContent = missionHud.mode;
    this.layer.querySelector('[data-objective-copy]').textContent = missionHud.distance
      ? `${missionHud.objective} - ${missionHud.distance}m`
      : missionHud.objective;
    this.layer.querySelector('[data-car-name]').textContent = carConfig.shortName;
    this.layer.querySelector('[data-coins]').textContent = saveData.totalCoins;
    this.layer.querySelector('[data-zone]').textContent = telemetry.zoneName;
    const license = getLicenseForXp(saveData.license.xp);
    this.layer.querySelector('[data-license]').textContent = license.name.replace(' Driver', '');
    this.layer.querySelector('[data-license-fill]').style.width = `${license.progress * 100}%`;
    this.layer.querySelector('[data-license-xp]').textContent = saveData.license.xp;

    const timerRow = this.layer.querySelector('[data-timer-row]');
    timerRow.classList.toggle('is-hidden', !missionHud.timer);
    if (missionHud.timer) this.layer.querySelector('[data-timer]').textContent = missionHud.timer;
    const eventRow = this.layer.querySelector('[data-event-row]');
    const taskRow = this.layer.querySelector('[data-task-row]');
    eventRow.classList.toggle('is-hidden', missionHud.active || !phase3Hud?.event);
    taskRow.classList.toggle('is-hidden', missionHud.active || !phase3Hud?.task);
    if (phase3Hud?.event) {
      this.layer.querySelector('[data-event-name]').textContent = phase3Hud.event.name;
      this.layer.querySelector('[data-event-fill]').style.width = `${Math.max(8, (phase3Hud.eventTime / phase3Hud.event.duration) * 100)}%`;
    }
    if (phase3Hud?.task) {
      this.layer.querySelector('[data-task-name]').textContent = phase3Hud.task.label;
      this.layer.querySelector('[data-task-fill]').style.width = '48%';
    }
    this.layer.querySelector('[data-boost-fill]').style.width = `${telemetry.boostEnergy * 100}%`;
    this.layer.querySelector('[data-boost]').textContent = Math.round(telemetry.boostEnergy * 100);

    const conditionRow = this.layer.querySelector('[data-condition-row]');
    conditionRow.classList.toggle('is-hidden', missionHud.condition === null);
    if (missionHud.condition !== null) {
      this.layer.querySelector('[data-condition-fill]').style.width = `${missionHud.condition}%`;
      this.layer.querySelector('[data-condition]').textContent = Math.round(missionHud.condition);
    }

    const comfortRow = this.layer.querySelector('[data-comfort-row]');
    comfortRow.classList.toggle('is-hidden', missionHud.comfort === null);
    if (missionHud.comfort !== null) {
      this.layer.querySelector('[data-comfort-fill]').style.width = `${missionHud.comfort}%`;
      this.layer.querySelector('[data-comfort]').textContent = Math.round(missionHud.comfort);
    }

    const parkingRow = this.layer.querySelector('[data-parking-row]');
    parkingRow.classList.toggle('is-hidden', missionHud.accuracy === null);
    if (missionHud.accuracy !== null) {
      this.layer.querySelector('[data-parking-fill]').style.width = `${missionHud.accuracy}%`;
      this.layer.querySelector('[data-parking]').textContent = Math.round(missionHud.accuracy);
    }
    this.layer.querySelector('[data-cockpit-assist]').classList.toggle(
      'is-hidden',
      !(cockpitActive && missionHud.accuracy !== null)
    );

    const driftRow = this.layer.querySelector('[data-drift-row]');
    driftRow.classList.toggle('is-hidden', missionHud.driftScore === null);
    if (missionHud.driftScore !== null) {
      const driftTarget = Number((missionHud.progress ?? '0/1').split('/')[1] ?? 1);
      this.layer.querySelector('[data-drift-fill]').style.width = `${Math.min(100, (missionHud.driftScore / driftTarget) * 100)}%`;
      this.layer.querySelector('[data-drift]').textContent = `${missionHud.driftScore} x${missionHud.multiplier?.toFixed(1) ?? '1.0'}`;
    }

    this.updateRadar(playerPosition, heading, missionHud.target ?? phase3Hud?.task?.target ?? null);
    this.updateDebug(telemetry, missionHud, debugData);
  }

  updateDebug(telemetry, missionHud, debugData) {
    const debug = this.layer.querySelector('[data-debug]');
    const visible = Boolean(this.saveManager.settings.debugOverlay);
    debug.classList.toggle('is-hidden', !visible);
    if (!visible) return;
    debug.innerHTML = `
      <span>FPS est ${Math.round(1 / Math.max(0.001, debugData.dt ?? 0.016))}</span>
      <span>Traffic ${debugData.trafficCount ?? 0}</span>
      <span>Coins ${debugData.collectibleCount ?? 0}</span>
      <span>District ${telemetry.zoneName}</span>
      <span>Mission ${missionHud.mode}</span>
      <span>Camera ${debugData.cameraLabel ?? debugData.cameraMode ?? 'Standard'}</span>
      <span>Surface ${debugData.collision?.currentSurface ?? telemetry.surfaceId ?? 'ground'}</span>
      <span>Type ${debugData.collision?.surfaceType ?? telemetry.surfaceType ?? 'terrain'} @ ${Number(debugData.collision?.surfaceHeight ?? telemetry.surfaceHeight ?? 0).toFixed(1)}</span>
      <span>Colliders ${debugData.collision?.nearbyCount ?? 0}/${debugData.collision?.staticCount ?? 0}</span>
      <span>Clearance zones ${debugData.collision?.clearanceCount ?? 0}</span>
      <span>Hits ${debugData.collision?.lastCount ?? telemetry.collisionCount ?? 0} Traffic ${debugData.collision?.trafficCollisions ?? 0}</span>
    `;
  }

  updateRadar(playerPosition, heading, target) {
    const radar = this.layer.querySelector('[data-radar]');
    radar.style.display = this.saveManager.settings.minimap ? '' : 'none';
    this.layer.querySelector('[data-minimap-label]').textContent = this.layer.querySelector('[data-zone]').textContent;
    const arrow = this.layer.querySelector('[data-radar-arrow]');
    arrow.style.transform = `translate(-50%, -50%) rotate(${heading}rad)`;
    const targetEl = this.layer.querySelector('[data-radar-target]');
    if (!target) {
      targetEl.style.opacity = '0.25';
      targetEl.style.transform = 'translate(-50%, -50%)';
      return;
    }
    targetEl.style.opacity = '1';
    const dx = target[0] - playerPosition.x;
    const dz = target[1] - playerPosition.z;
    const scale = Math.min(54, Math.hypot(dx, dz) * (108 / WORLD_CONFIG.radarRange));
    const angle = Math.atan2(dx, dz) - heading;
    const x = Math.sin(angle) * scale;
    const y = -Math.cos(angle) * scale;
    targetEl.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    this.toastsEl.classList.remove('is-hidden');
    this.toastsEl.appendChild(toast);
    window.setTimeout(() => {
      toast.remove();
      if (!this.toastsEl.children.length) this.toastsEl.classList.add('is-hidden');
    }, 2400);
  }

  setPaused(paused) {
    if (paused) this.showPause();
    else this.hidePause();
  }

  setMissionTime(seconds) {
    this.layer.querySelector('[data-timer]').textContent = formatTime(seconds);
  }
}
