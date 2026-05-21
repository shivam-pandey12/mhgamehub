import * as THREE from '../../vendor/three.js';
import { CAR_CONFIGS, getCarConfig } from '../../config/cars.js';
import { CAR_ROLE_RECOMMENDATIONS } from '../../config/customization.js';
import { MISSION_CATALOG } from '../../config/missions.js';
import { ONBOARDING_CARDS } from '../../config/onboarding.js';
import { getLicenseForXp } from '../../config/progression.js';
import { TUNING_CATEGORIES } from '../../config/tuning.js';
import { CITY_ZONES } from '../../config/city.js';
import { getCockpitConfig } from '../../config/cockpits.js';
import { CockpitManager } from '../cockpit/CockpitManager.js';

const STAT_LABELS = [
  ['speed', 'Speed'],
  ['acceleration', 'Acceleration'],
  ['handling', 'Handling'],
  ['braking', 'Braking'],
  ['drift', 'Drift'],
  ['offRoad', 'Off-Road'],
  ['stability', 'Stability']
];

const MISSION_GROUPS = {
  timeTrial: 'Time Trials',
  drift: 'Drift Zones',
  taxi: 'Taxi Rides',
  delivery: 'Deliveries',
  parking: 'Parking'
};

export class GarageManager {
  constructor(root, vehicleFactory, saveManager, customizationManager, tuningManager, masteryManager, careerManager, callbacks) {
    this.root = root;
    this.vehicleFactory = vehicleFactory;
    this.saveManager = saveManager;
    this.customizationManager = customizationManager;
    this.tuningManager = tuningManager;
    this.masteryManager = masteryManager;
    this.careerManager = careerManager;
    this.callbacks = callbacks;
    this.selectedId = saveManager.data.selectedCar;
    this.infoPanel = 'passport';
    this.previewMode = 'exterior';
    this.previewCar = null;
    this.previewScene = new THREE.Scene();
    this.previewScene.background = new THREE.Color('#eaf7ff');
    this.previewCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 120);
    this.previewCamera.position.set(6.6, 3.8, 8.4);
    this.previewCamera.lookAt(0, 1, 0);
    this.previewRoot = new THREE.Group();
    this.previewScene.add(this.previewRoot);
    this.cockpitPreview = new CockpitManager(this.previewScene, this.previewCamera, this.saveManager);
    this.createPreviewLighting();
    this.createShowroom();
    this.buildDom();
    this.rebuild();
  }

  createPreviewLighting() {
    const hemi = new THREE.HemisphereLight('#ffffff', '#d6b96d', 1.25);
    this.previewScene.add(hemi);
    const key = new THREE.DirectionalLight('#fff0d2', 2.6);
    key.position.set(-5, 9, 7);
    key.castShadow = true;
    this.previewScene.add(key);
    const rim = new THREE.DirectionalLight('#e8f7ff', 1.1);
    rim.position.set(6, 5, -6);
    this.previewScene.add(rim);
  }

  createShowroom() {
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(9.2, 64),
      new THREE.MeshStandardMaterial({ color: '#f6efe2', roughness: 0.45, metalness: 0.05 })
    );
    floor.rotation.x = -Math.PI * 0.5;
    floor.receiveShadow = true;
    this.previewScene.add(floor);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(4.8, 0.045, 8, 90),
      new THREE.MeshBasicMaterial({ color: '#caa76a', transparent: true, opacity: 0.72 })
    );
    ring.rotation.x = Math.PI * 0.5;
    ring.position.y = 0.035;
    this.previewScene.add(ring);
  }

  buildDom() {
    this.el = document.createElement('section');
    this.el.className = 'garage';
    this.el.innerHTML = `
      <aside class="garage__left">
        <p class="eyebrow">Phase 5 / v0.5 - Local only</p>
        <h1>Mini City Drive</h1>
        <p class="garage__copy">Choose a procedural car, then explore the larger city, highway ring, airport, bridges, and dense local districts.</p>
        <div class="garage__brand">GameHub powered by MH Horizon</div>
        <div class="car-list" data-car-list></div>
      </aside>
      <main class="garage__center" aria-label="3D car preview">
        <div></div>
        <div class="garage__brand">WASD drive - Space drift - Shift boost - C camera - V cockpit</div>
      </main>
      <aside class="garage__right">
        <div class="car-detail" data-car-detail></div>
      </aside>
    `;
    this.root.appendChild(this.el);
    this.listEl = this.el.querySelector('[data-car-list]');
    this.detailEl = this.el.querySelector('[data-car-detail]');
  }

  rebuild() {
    this.renderCarList();
    this.renderDetails();
    this.rebuildPreview();
  }

  renderCarList() {
    this.listEl.innerHTML = '';
    CAR_CONFIGS.forEach((car) => {
      const button = document.createElement('button');
      button.className = `car-choice${car.id === this.selectedId ? ' is-selected' : ''}`;
      button.type = 'button';
      button.innerHTML = `
        <span class="car-choice__swatch" style="background:${car.colors.body}"></span>
        <span>
          <span class="car-choice__name">${car.name}</span>
          <span class="car-choice__meta">${CAR_ROLE_RECOMMENDATIONS[car.id] ?? car.description}</span>
        </span>
        <span class="car-choice__state">${car.unlockText}</span>
      `;
      button.addEventListener('click', () => {
        this.selectedId = car.id;
        this.saveManager.setSelectedCar(car.id);
        this.callbacks.onAudioClick();
        this.rebuild();
      });
      this.listEl.appendChild(button);
    });
  }

  renderDetails() {
    const car = getCarConfig(this.selectedId);
    const tunedCar = this.tuningManager.getEffectiveConfig(car);
    const mastery = this.masteryManager.getMastery(car.id);
    const license = getLicenseForXp(this.saveManager.data.license.xp);
    this.detailEl.innerHTML = `
      <p class="eyebrow">Selected car - ${license.name} - ${mastery.level.name}</p>
      <h2>${car.name}</h2>
      <p>${car.description}</p>
      <p class="garage__copy">${CAR_ROLE_RECOMMENDATIONS[car.id] ?? 'Best for clean city driving.'}</p>
      ${this.renderPreviewControls(car)}
      <div class="license-strip">
        <span>${license.name}</span>
        <span class="stat-track"><span class="stat-fill" style="width:${license.progress * 100}%"></span></span>
        <strong>${this.saveManager.data.license.xp} XP</strong>
      </div>
      <div class="stat-list">
        ${STAT_LABELS.map(([key, label]) => `
          <div class="stat-row">
            <span>${label}</span>
            <span class="stat-track"><span class="stat-fill" style="width:${tunedCar.stats[key]}%"></span></span>
            <span>${tunedCar.stats[key]}</span>
          </div>
        `).join('')}
      </div>
      <div class="license-strip">
        <span>Mastery</span>
        <span class="stat-track"><span class="stat-fill" style="width:${mastery.level.progress * 100}%"></span></span>
        <strong>${Math.round(mastery.xp)} XP</strong>
      </div>
      ${this.renderCustomization(car)}
      <div class="garage__actions">
        <button class="primary-button" type="button" data-start-free>Start Free Drive</button>
        <button class="secondary-button" type="button" data-test-drive>Test Drive</button>
        ${this.renderMissionButtons()}
        ${this.renderInfoTabs()}
      </div>
      <div class="garage-info-panel">${this.renderInfoPanel()}</div>
    `;
    this.bindDetailEvents();
  }

  bindDetailEvents() {
    this.detailEl.querySelector('[data-start-free]').addEventListener('click', () => {
      this.callbacks.onStart('freeDrive', this.selectedId);
    });
    this.detailEl.querySelector('[data-test-drive]').addEventListener('click', () => {
      this.callbacks.onTestDrive?.(this.selectedId);
    });
    this.detailEl.querySelectorAll('[data-preview-mode]').forEach((button) => {
      button.addEventListener('click', () => {
        this.previewMode = button.dataset.previewMode;
        this.callbacks.onAudioClick();
        this.renderDetails();
        this.rebuildPreview();
      });
    });
    this.detailEl.querySelectorAll('[data-mission]').forEach((button) => {
      button.addEventListener('click', () => this.callbacks.onStart(button.dataset.mission, this.selectedId));
    });
    this.detailEl.querySelectorAll('[data-customize]').forEach((input) => {
      input.addEventListener('change', () => {
        this.customizationManager.apply(this.selectedId, { [input.dataset.customize]: input.value });
        this.callbacks.onAudioClick();
        this.rebuild();
      });
    });
    this.detailEl.querySelector('[data-reset-customization]')?.addEventListener('click', () => {
      this.customizationManager.reset(this.selectedId);
      this.callbacks.onAudioClick();
      this.rebuild();
    });
    this.detailEl.querySelectorAll('[data-info]').forEach((button) => {
      button.addEventListener('click', () => {
        this.infoPanel = button.dataset.info;
        this.renderDetails();
      });
    });
    this.detailEl.querySelectorAll('[data-tune]').forEach((button) => {
      button.addEventListener('click', () => {
        const result = this.tuningManager.upgrade(this.selectedId, button.dataset.tune);
        this.callbacks.onAudioClick();
        this.renderDetails();
        if (!result.ok) this.callbacks.onFeedback?.(result.reason);
      });
    });
    this.detailEl.querySelector('[data-reset-tuning]')?.addEventListener('click', () => {
      this.tuningManager.reset(this.selectedId);
      this.callbacks.onAudioClick();
      this.renderDetails();
    });
    this.detailEl.querySelectorAll('[data-career]').forEach((button) => {
      button.addEventListener('click', () => {
        if (button.disabled) return;
        this.callbacks.onStartCareer(button.dataset.career, button.dataset.mission, this.selectedId);
      });
    });
  }

  renderMissionButtons() {
    return Object.entries(MISSION_GROUPS).map(([type, label]) => `
      <p class="garage-section-title">${label}</p>
      <div class="mission-buttons">
        ${MISSION_CATALOG.filter((mission) => mission.type === type).map((mission) => `
          <button class="secondary-button mission-button" type="button" data-mission="${mission.id}">
            <span>${mission.name}</span><span>${mission.recommendedCar}</span>
          </button>
        `).join('')}
      </div>
    `).join('');
  }

  renderPreviewControls(car) {
    const cockpit = getCockpitConfig(car.id);
    return `
      <div class="preview-panel">
        <div class="preview-toggle" role="group" aria-label="Preview mode">
          <button class="mini-button ${this.previewMode === 'exterior' ? 'is-selected' : ''}" type="button" data-preview-mode="exterior">Exterior</button>
          <button class="mini-button ${this.previewMode === 'interior' ? 'is-selected' : ''}" type="button" data-preview-mode="interior">Interior</button>
        </div>
        <div class="cockpit-feature-list">
          <span>${cockpit.visibility}</span>
          <span>${cockpit.dashboardStyle}</span>
          <span>${cockpit.drivingFeel}</span>
        </div>
      </div>
    `;
  }

  renderCustomization(car) {
    const options = this.customizationManager.getOptions();
    const current = this.customizationManager.getCarCustomization(car.id);
    const renderSelect = (label, key, items) => `
      <label class="custom-row">
        <span>${label}</span>
        <select data-customize="${key}">
          ${items.map((item) => {
            const locked = !this.customizationManager.isUnlocked(item);
            return `<option value="${item.id}" ${current[key] === item.id ? 'selected' : ''} ${locked ? 'disabled' : ''}>${item.name}${locked ? ` - ${item.unlockLevel}` : ''}</option>`;
          }).join('')}
        </select>
      </label>
    `;
    return `
      <div class="custom-panel">
        <p class="garage-section-title">Customization</p>
        ${renderSelect('Paint', 'paint', options.paints)}
        ${renderSelect('Accent', 'accent', options.accents)}
        ${renderSelect('Wheels', 'wheels', options.wheels)}
        ${renderSelect('Boost', 'boostTrail', options.boostTrails)}
        ${renderSelect('Glass', 'tint', options.tints)}
        <button class="secondary-button mini-button" type="button" data-reset-customization>Reset customization</button>
      </div>
    `;
  }

  renderInfoTabs() {
    return `
      <div class="info-tabs">
        <button class="mini-button" type="button" data-info="career">Career</button>
        <button class="mini-button" type="button" data-info="world">World</button>
        <button class="mini-button" type="button" data-info="mastery">Mastery</button>
        <button class="mini-button" type="button" data-info="tuning">Tuning</button>
        <button class="mini-button" type="button" data-info="passport">Passport</button>
        <button class="mini-button" type="button" data-info="stats">Stats</button>
        <button class="mini-button" type="button" data-info="achievements">Achievements</button>
        <button class="mini-button" type="button" data-info="help">Help</button>
      </div>
    `;
  }

  renderInfoPanel() {
    const data = this.saveManager.data;
    const car = getCarConfig(this.selectedId);
    if (this.infoPanel === 'career') return this.renderCareerPanel();
    if (this.infoPanel === 'world') return this.renderWorldPanel();
    if (this.infoPanel === 'mastery') return this.renderMasteryPanel(car);
    if (this.infoPanel === 'tuning') return this.renderTuningPanel(car);
    if (this.infoPanel === 'stats') {
      return `
        <p class="garage-section-title">Local Stats</p>
        <div class="mini-grid">
          <span>Distance <strong>${Math.round(data.stats.totalDistance)} m</strong></span>
          <span>Coins <strong>${data.totalCoins}</strong></span>
          <span>Missions <strong>${data.stats.missionsCompleted}</strong></span>
          <span>Crashes <strong>${data.stats.totalCrashes}</strong></span>
          <span>Drift <strong>${Math.round(data.stats.totalDriftScore)}</strong></span>
          <span>License <strong>${getLicenseForXp(data.license.xp).name}</strong></span>
        </div>
      `;
    }
    if (this.infoPanel === 'achievements') {
      const ids = ['first-drive', 'first-delivery', 'first-drift', 'first-parking', 'landmark-hunter', 'clean-driver', 'highway-racer', 'smooth-taxi', 'gold-time-trial', 'horizon-driver'];
      return `
        <p class="garage-section-title">Achievements - ${Object.keys(data.achievements).length}</p>
        <div class="passport-list">
          ${ids.map((id) => `<span class="${data.achievements[id] ? 'is-unlocked' : ''}">${data.achievements[id] ? 'Unlocked' : 'Locked'} - ${id.replaceAll('-', ' ')}</span>`).join('')}
        </div>
      `;
    }
    if (this.infoPanel === 'help') {
      return `
        <p class="garage-section-title">Quick Help</p>
        <div class="passport-list">
          ${ONBOARDING_CARDS.map((card) => `<span><strong>${card.title}</strong><br>${card.copy}</span>`).join('')}
        </div>
      `;
    }
    const landmarks = ['central-tower', 'park-fountain', 'highway-bridge', 'market-gate', 'residential-square', 'hill-viewpoint', 'city-hall', 'airport-terminal', 'giant-airplane', 'industrial-depot', 'river-corridor'];
    const discovered = Object.keys(data.discoveries.landmarks).length;
    return `
      <p class="garage-section-title">City Passport - ${discovered}/${landmarks.length}</p>
      <div class="passport-list">
        ${landmarks.map((id) => `<span class="${data.discoveries.landmarks[id] ? 'is-unlocked' : ''}">${data.discoveries.landmarks[id] ? 'Discovered' : 'Locked'} - ${id.replaceAll('-', ' ')}</span>`).join('')}
      </div>
    `;
  }

  renderMasteryPanel(car) {
    const mastery = this.masteryManager.getMastery(car.id);
    const bestEntries = Object.entries(mastery.bestMissions ?? {}).slice(0, 4);
    return `
      <p class="garage-section-title">Car Mastery - ${mastery.level.name}</p>
      <div class="license-strip">
        <span>${mastery.level.name}</span>
        <span class="stat-track"><span class="stat-fill" style="width:${mastery.level.progress * 100}%"></span></span>
        <strong>${Math.round(mastery.xp)} XP</strong>
      </div>
      <div class="passport-list">
        <span>Next reward: <strong>${mastery.level.next?.nextReward ?? 'Mastered local badge'}</strong></span>
        <span>Next level: <strong>${mastery.level.next?.name ?? 'Complete'}</strong></span>
        ${bestEntries.length ? bestEntries.map(([id, score]) => `<span>${id.replaceAll('-', ' ')} <strong>${score}</strong></span>`).join('') : '<span>No car-specific mission bests yet.</span>'}
      </div>
    `;
  }

  renderWorldPanel() {
    return `
      <p class="garage-section-title">Expanded Phase 4 World</p>
      <div class="passport-list">
        <span><strong>Highway Ring</strong><br>Long multi-lane routes, bridges, ramps, and speed trials.</span>
        <span><strong>Airport Zone</strong><br>Terminal roads, runway straight, service loop, hangars, and a huge airliner landmark.</span>
        <span><strong>Industrial Depot</strong><br>Warehouses, cargo yards, containers, and heavy delivery routes.</span>
        <span><strong>Bridge Corridor</strong><br>River crossing and elevated expressway sections for longer drives.</span>
        ${CITY_ZONES.map((zone) => `<span>${zone.name} <strong>${zone.reward} coins</strong></span>`).join('')}
      </div>
    `;
  }

  renderTuningPanel(car) {
    const tuning = this.tuningManager.getTuning(car.id);
    return `
      <p class="garage-section-title">Vehicle Tuning - ${this.saveManager.data.totalCoins} coins</p>
      <div class="tuning-list">
        ${TUNING_CATEGORIES.map((category) => {
          const state = this.tuningManager.getCategoryState(car.id, category.id);
          const level = tuning[category.id] ?? 0;
          return `
            <div class="tuning-row">
              <span>${category.label}</span>
              <span class="stat-track"><span class="stat-fill" style="width:${(level / Math.max(1, state.max)) * 100}%"></span></span>
              <strong>${level}/${state.max}</strong>
              <button class="mini-button" type="button" data-tune="${category.id}" ${state.canUpgrade ? '' : 'disabled'}>${state.canUpgrade ? `${state.cost}` : 'Max'}</button>
            </div>
          `;
        }).join('')}
      </div>
      <button class="secondary-button mini-button" type="button" data-reset-tuning>Reset tuning</button>
    `;
  }

  renderCareerPanel() {
    const paths = this.careerManager.getPaths();
    return `
      <p class="garage-section-title">Career Mode</p>
      <div class="career-list">
        ${paths.map((path) => `
          <div class="career-path">
            <strong>${path.name}</strong>
            <span>${path.description}</span>
            ${path.missions.map((mission) => `
              <button class="secondary-button mission-button" type="button" data-career="${mission.id}" data-mission="${mission.missionId}" ${mission.unlocked ? '' : 'disabled'}>
                <span>${mission.title}</span>
                <span>${mission.completed ? (mission.completed.medal ?? 'Done') : mission.unlocked ? 'Start' : 'Locked'}</span>
              </button>
            `).join('')}
          </div>
        `).join('')}
      </div>
    `;
  }

  rebuildPreview() {
    if (this.previewCar) {
      this.previewRoot.remove(this.previewCar);
      this.disposeObject(this.previewCar);
    }
    const config = getCarConfig(this.selectedId);
    const customization = this.customizationManager.getCarCustomization(config.id);
    const colors = this.customizationManager.resolveVisualColors(config, customization);
    this.previewCar = this.vehicleFactory.createCarMesh(config, {
      preview: true,
      customization: {
        body: colors.body,
        accent: colors.accent,
        tintOpacity: colors.tintOpacity,
        boostTrail: colors.boostTrail,
        wheelStyle: customization.wheels
      }
    });
    this.previewCar.position.y = 0.02;
    this.previewRoot.add(this.previewCar);
    this.previewCar.visible = this.previewMode === 'exterior';
    this.cockpitPreview.setVisible(this.previewMode === 'interior');
  }

  disposeObject(object) {
    object.traverse((child) => {
      if (!child.isMesh) return;
      child.geometry?.dispose?.();
    });
  }

  show() {
    this.el.classList.remove('is-hidden');
    this.rebuild();
  }

  hide() {
    this.el.classList.add('is-hidden');
  }

  update(dt, size) {
    if (this.el.classList.contains('is-hidden')) return;
    if (this.previewCar) {
      this.previewCar.rotation.y += dt * 0.42;
      this.previewCar.visible = this.previewMode === 'exterior';
      this.previewCar.userData.wheels?.forEach((wheel) => {
        wheel.tire.rotation.x += dt * 0.8;
      });
    }
    if (this.previewMode === 'interior') {
      this.cockpitPreview.updatePreview(dt, getCarConfig(this.selectedId));
    } else {
      this.cockpitPreview.setVisible(false);
    }
    this.previewCamera.aspect = size.width / size.height;
    this.previewCamera.updateProjectionMatrix();
  }

  render(renderer) {
    renderer.render(this.previewScene, this.previewCamera);
  }
}
