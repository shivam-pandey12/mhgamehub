import * as THREE from '../../vendor/three.js';
import { COCKPIT_SETTINGS, getCockpitConfig } from '../../config/cockpits.js';
import { clamp, damp } from '../utils/math.js';

const materialCache = new Map();

const makeMaterial = (key, options) => {
  const cacheKey = `${key}:${JSON.stringify(options)}`;
  if (!materialCache.has(cacheKey)) {
    materialCache.set(cacheKey, new THREE.MeshStandardMaterial({
      roughness: 0.62,
      metalness: 0.08,
      depthTest: false,
      depthWrite: false,
      ...options
    }));
  }
  return materialCache.get(cacheKey);
};

const makeBasicMaterial = (key, options) => {
  const cacheKey = `${key}:${JSON.stringify(options)}`;
  if (!materialCache.has(cacheKey)) {
    materialCache.set(cacheKey, new THREE.MeshBasicMaterial({
      depthTest: false,
      depthWrite: false,
      ...options
    }));
  }
  return materialCache.get(cacheKey);
};

export class CockpitManager {
  constructor(scene, camera, saveManager) {
    this.scene = scene;
    this.camera = camera;
    this.saveManager = saveManager;
    this.root = new THREE.Group();
    this.root.name = 'Active Procedural Cockpit';
    this.root.visible = false;
    this.root.renderOrder = 1000;
    this.scene.add(this.root);

    this.carId = null;
    this.config = null;
    this.rig = null;
    this.wheel = null;
    this.gaugeTexture = null;
    this.gaugeCanvas = null;
    this.gaugeContext = null;
    this.lastGaugeSpeed = -1;
    this.gaugeTimer = 0;
    this.motion = {
      x: 0,
      y: -0.04,
      z: 0,
      pitch: 0,
      roll: 0
    };
    this.interiorLift = -0.04;
    this.lastForwardSpeed = 0;
    this.accelVisual = 0;
    this.culledVehicle = null;
    this.cullActive = false;
  }

  setCar(carConfig) {
    if (!carConfig || this.carId === carConfig.id) return;
    this.disposeRig();
    this.carId = carConfig.id;
    this.config = getCockpitConfig(carConfig.id);
    const built = this.buildCockpit(carConfig, this.config);
    this.rig = built.group;
    this.wheel = built.wheel;
    this.gaugeCanvas = built.gaugeCanvas;
    this.gaugeContext = built.gaugeContext;
    this.gaugeTexture = built.gaugeTexture;
    this.root.add(this.rig);
    this.drawGauges(0, 0, false);
  }

  update(dt, vehicle, telemetry, modeId) {
    if (!vehicle?.config) {
      this.setVisible(false);
      return;
    }
    this.setCar(vehicle.config);
    const visible = modeId === 'cockpit';
    this.setVisible(visible);
    this.syncVehicleCull(vehicle.mesh, visible);
    if (!visible || !this.rig) return;
    this.syncRootToCamera();
    this.updateMotion(dt, telemetry);
    this.updateWheel(dt, vehicle, telemetry);
    this.updateGauges(dt, telemetry);
    this.updateMirrorVisibility();
  }

  updatePreview(dt, carConfig) {
    this.setCar(carConfig);
    this.setVisible(true);
    this.syncRootToCamera();
    const fakeSteer = Math.sin(performance.now() * 0.0016) * 0.32;
    const fakeSpeed = 42 + Math.sin(performance.now() * 0.001) * 18;
    if (this.wheel) {
      this.wheel.rotation.z = damp(this.wheel.rotation.z, -fakeSteer * this.config.wheel.maxTurn, 7, dt);
    }
    this.rig.position.set(0, this.interiorLift, 0);
    this.rig.rotation.set(0, 0, 0);
    this.gaugeTimer -= dt;
    if (this.gaugeTimer <= 0) {
      this.drawGauges(fakeSpeed, Math.abs(fakeSteer), false);
      this.gaugeTimer = 0.09;
    }
    this.updateMirrorVisibility();
  }

  setVisible(visible) {
    this.root.visible = visible;
  }

  syncRootToCamera() {
    this.root.position.copy(this.camera.position);
    this.root.quaternion.copy(this.camera.quaternion);
  }

  syncVehicleCull(vehicleMesh, active) {
    if (this.culledVehicle && this.culledVehicle !== vehicleMesh) {
      this.applyCull(this.culledVehicle, false);
      this.culledVehicle = null;
      this.cullActive = false;
    }
    if (!vehicleMesh) return;
    if (this.culledVehicle !== vehicleMesh || this.cullActive !== active) {
      this.applyCull(vehicleMesh, active);
      this.culledVehicle = vehicleMesh;
      this.cullActive = active;
    }
  }

  applyCull(vehicleMesh, active) {
    vehicleMesh.traverse((child) => {
      if (child.userData?.firstPersonCull) child.visible = !active;
    });
  }

  updateMotion(dt, telemetry) {
    const level = COCKPIT_SETTINGS.motionLevels[this.saveManager.settings.cockpitMotion] ?? 1;
    const tune = this.config.motion;
    const speed = telemetry?.speedRatio ?? 0;
    const steer = telemetry?.steeringVisual ?? 0;
    const throttle = telemetry?.inputThrottle ?? 0;
    const braking = telemetry?.braking ? 1 : 0;
    const collision = telemetry?.collisionIntensity ?? 0;
    const forwardSpeed = telemetry?.forwardSpeed ?? 0;
    const acceleration = dt > 0 ? (forwardSpeed - this.lastForwardSpeed) / dt : 0;
    this.lastForwardSpeed = forwardSpeed;
    const accelSignal = clamp(acceleration / 22, -1, 1);
    const pedalSignal = throttle * 0.42 - braking * 0.75;
    this.accelVisual = damp(this.accelVisual, clamp(accelSignal + pedalSignal, -1, 1), 7.5, dt);
    const roadVibration = telemetry?.offRoad
      ? Math.sin(performance.now() * 0.035) * tune.vibration * speed
      : 0;
    const vibration = (roadVibration + collision * 0.012) * level;
    const accelPush = this.accelVisual * tune.push * 2.2 * level;
    const accelPitch = this.accelVisual * tune.pitch * 1.9 * level;

    const target = {
      x: -steer * tune.lean * 0.7 * level,
      y: this.interiorLift + vibration,
      z: -accelPush,
      pitch: -accelPitch + collision * 0.015 * level,
      roll: -steer * tune.lean * level
    };
    this.motion.x = damp(this.motion.x, target.x, 8, dt);
    this.motion.y = damp(this.motion.y, target.y, 10, dt);
    this.motion.z = damp(this.motion.z, target.z, 8, dt);
    this.motion.pitch = damp(this.motion.pitch, target.pitch, 7, dt);
    this.motion.roll = damp(this.motion.roll, target.roll, 7, dt);
    this.rig.position.set(this.motion.x, this.motion.y, this.motion.z);
    this.rig.rotation.set(this.motion.pitch, 0, this.motion.roll);
  }

  updateWheel(dt, vehicle, telemetry) {
    if (!this.wheel) return;
    const steer = telemetry?.steeringVisual ?? vehicle.steerVisual ?? 0;
    const collision = telemetry?.collisionIntensity ?? 0;
    const wobble = Math.sin(performance.now() * 0.042) * collision * 0.03;
    this.wheel.rotation.z = damp(
      this.wheel.rotation.z,
      -steer * this.config.wheel.maxTurn + wobble,
      11,
      dt
    );
  }

  updateGauges(dt, telemetry) {
    this.gaugeTimer -= dt;
    const speed = telemetry?.speedKmh ?? 0;
    if (this.gaugeTimer > 0 && Math.abs(speed - this.lastGaugeSpeed) < 2) return;
    this.drawGauges(speed, telemetry?.speedRatio ?? 0, telemetry?.boosting ?? false);
    this.gaugeTimer = 0.075;
  }

  updateMirrorVisibility() {
    if (!this.rig) return;
    const visible = this.saveManager.settings.mirrorRendering !== 'off';
    this.rig.traverse((child) => {
      if (child.userData?.cockpitMirror) child.visible = visible;
    });
  }

  drawGauges(speedKmh, speedRatio, boosting) {
    if (!this.gaugeContext) return;
    const ctx = this.gaugeContext;
    const canvas = this.gaugeCanvas;
    const cfg = this.config;
    const brightness = clamp(Number(this.saveManager.settings.dashboardBrightness ?? 0.9), 0.35, 1.2);
    const accent = cfg.dashboard.accent;
    this.lastGaugeSpeed = speedKmh;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0c1219';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.14 * brightness;
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    ctx.strokeStyle = accent;
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

    const label = cfg.dashboard.display.includes('analog') || cfg.dashboard.display.includes('round') ? 'SPEED' : 'KM/H';
    ctx.fillStyle = cfg.materials.display;
    ctx.font = '900 48px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(Math.round(speedKmh)).padStart(3, '0'), canvas.width * 0.5, 64);
    ctx.font = '800 15px system-ui, sans-serif';
    ctx.fillText(label, canvas.width * 0.5, 86);

    if (cfg.dashboard.display.includes('analog') || cfg.dashboard.display.includes('round')) {
      const radius = 34;
      const cx = canvas.width * 0.22;
      const cy = 72;
      ctx.strokeStyle = cfg.materials.display;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, Math.PI * 0.72, Math.PI * 2.28);
      ctx.stroke();
      const angle = Math.PI * 0.72 + clamp(speedRatio, 0, 1) * Math.PI * 1.56;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * (radius - 7), cy + Math.sin(angle) * (radius - 7));
      ctx.strokeStyle = accent;
      ctx.stroke();
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.fillRect(30, 102, canvas.width - 60, 8);
      ctx.fillStyle = boosting ? '#fff7b8' : accent;
      ctx.fillRect(30, 102, (canvas.width - 60) * clamp(speedRatio, 0, 1), 8);
    }

    this.gaugeTexture.needsUpdate = true;
  }

  buildCockpit(carConfig, cfg) {
    const group = new THREE.Group();
    group.name = `${carConfig.name} Cockpit Rig`;
    group.renderOrder = 1000;
    const mats = this.createMaterials(cfg);

    this.addDashboard(group, cfg, mats);
    const wheel = this.addSteeringWheel(group, cfg, mats);
    const gauges = this.addGaugeDisplay(group, cfg);
    this.addWindshield(group, cfg, mats);
    this.addConsole(group, cfg, mats);
    this.addSidePanels(group, cfg, mats);
    this.addSeatHints(group, cfg, mats);
    this.addMirrorImpressions(group, cfg, mats);
    this.addCarSpecificAccents(group, carConfig.id, cfg, mats);

    return {
      group,
      wheel,
      gaugeCanvas: gauges.canvas,
      gaugeContext: gauges.context,
      gaugeTexture: gauges.texture
    };
  }

  createMaterials(cfg) {
    return {
      dash: makeMaterial(`cockpit-dash-${this.carId}`, { color: cfg.materials.dash }),
      lower: makeMaterial(`cockpit-lower-${this.carId}`, { color: cfg.materials.lower }),
      trim: makeMaterial(`cockpit-trim-${this.carId}`, {
        color: cfg.materials.trim,
        roughness: 0.32,
        metalness: this.carId === 'classic' ? 0.62 : 0.28
      }),
      frame: makeMaterial(`cockpit-frame-${this.carId}`, { color: cfg.materials.frame }),
      seat: makeMaterial(`cockpit-seat-${this.carId}`, { color: cfg.materials.seat }),
      glass: makeBasicMaterial(`cockpit-glass-${this.carId}`, {
        color: '#dff8ff',
        transparent: true,
        opacity: cfg.windshield.tint
      })
    };
  }

  addDashboard(group, cfg, mats) {
    const dash = new THREE.Mesh(
      new THREE.BoxGeometry(cfg.dashboard.width, cfg.dashboard.height, 0.36),
      mats.dash
    );
    dash.position.set(0, cfg.dashboard.y, cfg.dashboard.z);
    dash.renderOrder = 1000;
    group.add(dash);

    const top = new THREE.Mesh(
      new THREE.BoxGeometry(cfg.dashboard.width * 0.94, 0.055, 0.48),
      mats.lower
    );
    top.position.set(0, cfg.dashboard.y + cfg.dashboard.height * 0.46, cfg.dashboard.z - 0.03);
    top.rotation.x = -0.08;
    top.renderOrder = 1001;
    group.add(top);

    const accent = new THREE.Mesh(
      new THREE.BoxGeometry(cfg.dashboard.width * 0.82, 0.035, 0.035),
      mats.trim
    );
    accent.position.set(0, cfg.dashboard.y + 0.08, cfg.dashboard.z + 0.205);
    accent.renderOrder = 1002;
    group.add(accent);
  }

  addSteeringWheel(group, cfg, mats) {
    const wheel = new THREE.Group();
    wheel.position.set(cfg.wheel.x, cfg.wheel.y, cfg.wheel.z);
    wheel.renderOrder = 1004;
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(cfg.wheel.radius, cfg.wheel.tube, 10, 42),
      mats.frame
    );
    rim.renderOrder = 1004;
    wheel.add(rim);

    for (let i = 0; i < cfg.wheel.spokes; i += 1) {
      const spoke = new THREE.Mesh(
        new THREE.BoxGeometry(cfg.wheel.radius * 0.92, 0.026, 0.026),
        mats.trim
      );
      spoke.rotation.z = (i / cfg.wheel.spokes) * Math.PI * 2;
      spoke.renderOrder = 1005;
      wheel.add(spoke);
    }

    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(cfg.wheel.radius * 0.24, cfg.wheel.radius * 0.24, 0.045, 18),
      mats.trim
    );
    hub.rotation.x = Math.PI * 0.5;
    hub.renderOrder = 1006;
    wheel.add(hub);
    group.add(wheel);
    return wheel;
  }

  addGaugeDisplay(group, cfg) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });
    const width = cfg.dashboard.display === 'digital-strip' ? 0.86 : 0.72;
    const height = cfg.dashboard.display === 'digital-strip' ? 0.22 : 0.34;
    const gauge = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
    gauge.position.set(cfg.wheel.x + 0.36, cfg.dashboard.y + 0.1, cfg.dashboard.z + 0.205);
    gauge.renderOrder = 1007;
    group.add(gauge);
    return { canvas, context, texture };
  }

  addWindshield(group, cfg, mats) {
    const frame = cfg.windshield;
    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(frame.width * 0.86, frame.height * 0.78),
      mats.glass
    );
    glass.position.set(0, frame.y, frame.z);
    glass.renderOrder = 998;
    group.add(glass);

    [-1, 1].forEach((side) => {
      const pillar = new THREE.Mesh(
        new THREE.BoxGeometry(frame.pillarWidth, frame.height, 0.05),
        mats.frame
      );
      pillar.position.set(side * frame.width * 0.48, frame.y, frame.z + 0.02);
      pillar.rotation.z = side * 0.16;
      pillar.renderOrder = 1002;
      group.add(pillar);
    });

    const top = new THREE.Mesh(
      new THREE.BoxGeometry(frame.width, frame.pillarWidth * 1.2, 0.06),
      mats.frame
    );
    top.position.set(0, frame.y + frame.height * 0.5, frame.z + 0.02);
    top.renderOrder = 1002;
    group.add(top);
  }

  addConsole(group, cfg, mats) {
    const consolePanel = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.3, 0.36),
      mats.lower
    );
    consolePanel.position.set(0.24, cfg.dashboard.y - 0.08, cfg.dashboard.z + 0.03);
    consolePanel.rotation.x = -0.18;
    consolePanel.renderOrder = 1003;
    group.add(consolePanel);

    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.24, 0.13),
      makeBasicMaterial(`cockpit-console-screen-${this.carId}`, {
        color: cfg.materials.display,
        transparent: true,
        opacity: 0.82
      })
    );
    screen.position.set(0.24, cfg.dashboard.y + 0.03, cfg.dashboard.z + 0.22);
    screen.renderOrder = 1008;
    group.add(screen);
  }

  addSidePanels(group, cfg, mats) {
    [-1, 1].forEach((side) => {
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.34, 0.72),
        mats.lower
      );
      panel.position.set(side * cfg.windshield.width * 0.53, cfg.dashboard.y - 0.1, -0.74);
      panel.rotation.y = side * 0.16;
      panel.renderOrder = 1000;
      group.add(panel);
    });
  }

  addSeatHints(group, cfg, mats) {
    const lower = new THREE.Mesh(
      new THREE.BoxGeometry(1.55, 0.18, 0.42),
      mats.seat
    );
    lower.position.set(0, -0.78, -0.18);
    lower.renderOrder = 999;
    group.add(lower);
  }

  addMirrorImpressions(group, cfg, mats) {
    const mirror = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.12, 0.035),
      mats.frame
    );
    mirror.position.set(0, cfg.windshield.y + cfg.windshield.height * 0.35, cfg.windshield.z + 0.12);
    mirror.renderOrder = 1005;
    mirror.userData.cockpitMirror = true;
    group.add(mirror);

    [-1, 1].forEach((side) => {
      const sideMirror = new THREE.Mesh(
        new THREE.BoxGeometry(0.19, 0.1, 0.04),
        mats.frame
      );
      sideMirror.position.set(side * cfg.windshield.width * 0.58, cfg.dashboard.y + 0.04, cfg.windshield.z + 0.05);
      sideMirror.rotation.y = side * 0.32;
      sideMirror.renderOrder = 1004;
      sideMirror.userData.cockpitMirror = true;
      group.add(sideMirror);
    });
  }

  addCarSpecificAccents(group, carId, cfg, mats) {
    if (carId === 'offroad-jeep') {
      [-1, 1].forEach((side) => {
        const rollBar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.025, 0.025, 1.1, 10),
          mats.frame
        );
        rollBar.position.set(side * 0.74, 0.18, -0.36);
        rollBar.rotation.z = 0.2 * side;
        rollBar.renderOrder = 1003;
        group.add(rollBar);
      });
    }
    if (carId === 'classic') {
      [-0.22, 0.22].forEach((x) => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.11, 0.01, 8, 24),
          mats.trim
        );
        ring.position.set(x, cfg.dashboard.y + 0.12, cfg.dashboard.z + 0.215);
        ring.renderOrder = 1008;
        group.add(ring);
      });
    }
    if (carId === 'supercar') {
      const strip = new THREE.Mesh(
        new THREE.BoxGeometry(1.42, 0.035, 0.035),
        mats.trim
      );
      strip.position.set(0.05, cfg.dashboard.y + 0.17, cfg.dashboard.z + 0.22);
      strip.renderOrder = 1008;
      group.add(strip);
    }
  }

  disposeRig() {
    if (this.rig) {
      this.root.remove(this.rig);
      this.rig.traverse((child) => {
        child.geometry?.dispose?.();
        if (child.material?.map === this.gaugeTexture) child.material.dispose?.();
      });
    }
    this.rig = null;
    this.wheel = null;
    this.gaugeCanvas = null;
    this.gaugeContext = null;
    this.gaugeTexture?.dispose?.();
    this.gaugeTexture = null;
  }

  dispose() {
    if (this.culledVehicle) this.applyCull(this.culledVehicle, false);
    this.disposeRig();
    this.scene.remove(this.root);
  }
}
