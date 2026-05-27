import { CARROM_BOARD } from '../config/carrom-constants.js';
import { ShotResolver } from '../game/shot-resolver.js';
import { CollisionResolver } from './collision-resolver.js';
import { PhysicsBody } from './physics-body.js';
import { PHYSICS_TUNING } from './physics-tuning.js';
import { PocketDetector } from './pocket-detector.js';

export class PhysicsWorld {
  constructor({ pieces, pockets, onShotStarted, onPiecePocketed, onShotSettled, onStatus, onCollision, debugPhysics = false }) {
    this.bodies = pieces.map((piece) => new PhysicsBody(piece));
    this.bodyMap = new Map(this.bodies.map((body) => [body.id, body]));
    this.accumulator = 0;
    this.totalTime = 0;
    this.onStatus = onStatus;
    this.debugPhysics = debugPhysics;
    this.shotResolver = new ShotResolver({
      onShotStarted,
      onPiecePocketed,
      onShotSettled
    });
    this.pocketDetector = new PocketDetector({
      pockets,
      onPocketed: (body) => this.handlePocketed(body)
    });
    this.collisionResolver = new CollisionResolver({
      pocketDetector: this.pocketDetector,
      onCollision
    });
    this.syncMeshes();
  }

  update(delta) {
    const clampedDelta = Math.min(Math.max(delta, 0), 0.08);
    this.accumulator += clampedDelta;
    let substeps = 0;

    while (this.accumulator >= PHYSICS_TUNING.FIXED_TIMESTEP && substeps < PHYSICS_TUNING.MAX_SUBSTEPS) {
      this.step(PHYSICS_TUNING.FIXED_TIMESTEP);
      this.accumulator -= PHYSICS_TUNING.FIXED_TIMESTEP;
      substeps += 1;
    }

    if (substeps === PHYSICS_TUNING.MAX_SUBSTEPS) {
      this.accumulator = 0;
    }

    this.syncMeshes();
    this.shotResolver.update(this.getMotionState());
  }

  step(dt) {
    this.totalTime += dt;

    this.bodies.forEach((body) => {
      this.sanitizeBody(body);

      if (body.isPocketed) {
        this.pocketDetector.updateBody(body, dt);
        return;
      }

      this.integrateBody(body, dt);
      this.sanitizeBody(body);
      this.pocketDetector.updateBody(body, dt);
    });

    this.bodies.forEach((body) => this.collisionResolver.resolveRails(body));
    this.collisionResolver.resolveBodies(this.bodies);
    this.bodies.forEach((body) => this.sanitizeBody(body));
    this.bodies.forEach((body) => this.updateSleep(body));
  }

  integrateBody(body, dt) {
    if (body.isSleeping) {
      return;
    }

    body.position.x += body.velocity.x * dt;
    body.position.z += body.velocity.z * dt;

    const damping = Math.exp(-body.damping * dt);
    body.velocity.x *= damping;
    body.velocity.z *= damping;
  }

  updateSleep(body) {
    if (body.isPocketed) {
      return;
    }

    const speedSq = body.speedSq();
    if (speedSq <= PHYSICS_TUNING.MIN_VELOCITY_CUTOFF * PHYSICS_TUNING.MIN_VELOCITY_CUTOFF) {
      body.velocity.x = 0;
      body.velocity.z = 0;
    }

    if (speedSq <= PHYSICS_TUNING.STOP_SPEED_THRESHOLD * PHYSICS_TUNING.STOP_SPEED_THRESHOLD) {
      body.sleepFrames += 1;
      if (body.sleepFrames >= PHYSICS_TUNING.SLEEP_FRAMES_REQUIRED) {
        body.isSleeping = true;
        body.velocity.x = 0;
        body.velocity.z = 0;
      }
      return;
    }

    body.isSleeping = false;
    body.sleepFrames = 0;
  }

  syncMeshes() {
    this.bodies.forEach((body) => {
      this.sanitizeBody(body);

      if (!body.mesh) {
        return;
      }

      if (body.scenarioHidden) {
        body.mesh.visible = false;
        return;
      }

      if (body.isPocketed) {
        const removeSeconds = PHYSICS_TUNING.POCKET_REMOVE_DELAY / 1000;
        const progress = Math.min(body.pocketedElapsed / removeSeconds, 1);
        const target = body.pocketTarget || { x: body.position.x, z: body.position.z };
        body.mesh.position.x += (target.x - body.mesh.position.x) * 0.35;
        body.mesh.position.z += (target.z - body.mesh.position.z) * 0.35;
        body.mesh.position.y = body.visualY - progress * 0.22;
        this.lockFlatRotation(body.mesh, body.spin.y);
        const scale = Math.max(0.2, 1 - progress * 0.8);
        body.mesh.scale.set(scale, scale, scale);
        body.mesh.visible = progress < 1;
        return;
      }

      this.validateFlatInvariant(body);
      body.mesh.visible = true;
      body.mesh.position.set(body.position.x, body.visualY, body.position.z);
      body.mesh.scale.set(1, 1, 1);

      const speed = Math.sqrt(body.speedSq());
      if (speed > 0.01) {
        body.spin.y += speed * 0.018;
      }
      this.lockFlatRotation(body.mesh, body.spin.y);
      body.lastSafePosition.x = body.position.x;
      body.lastSafePosition.z = body.position.z;
    });
  }

  sanitizeBody(body) {
    let corrected = false;
    const fallbackX = Number.isFinite(body.lastSafePosition?.x) ? body.lastSafePosition.x : body.initialPosition.x;
    const fallbackZ = Number.isFinite(body.lastSafePosition?.z) ? body.lastSafePosition.z : body.initialPosition.z;

    if (!Number.isFinite(body.position.x)) {
      body.position.x = fallbackX;
      corrected = true;
    }
    if (!Number.isFinite(body.position.z)) {
      body.position.z = fallbackZ;
      corrected = true;
    }
    if (!Number.isFinite(body.velocity.x)) {
      body.velocity.x = 0;
      corrected = true;
    }
    if (!Number.isFinite(body.velocity.z)) {
      body.velocity.z = 0;
      corrected = true;
    }

    const speedSq = body.speedSq();
    const maxSpeedSq = PHYSICS_TUNING.MAX_BODY_SPEED * PHYSICS_TUNING.MAX_BODY_SPEED;
    if (!Number.isFinite(speedSq)) {
      body.velocity.x = 0;
      body.velocity.z = 0;
      corrected = true;
    } else if (speedSq > maxSpeedSq) {
      const scale = PHYSICS_TUNING.MAX_BODY_SPEED / Math.sqrt(speedSq);
      body.velocity.x *= scale;
      body.velocity.z *= scale;
      corrected = true;
    }

    if (!body.isPocketed && !corrected) {
      body.lastSafePosition.x = body.position.x;
      body.lastSafePosition.z = body.position.z;
    }

    if (corrected && this.debugPhysics) {
      this.warnFlatCorrection(body, 'corrected invalid or excessive physics values');
    }
  }

  lockFlatRotation(mesh, yaw = 0) {
    mesh.rotation.x = 0;
    mesh.rotation.y = Number.isFinite(yaw) ? yaw : 0;
    mesh.rotation.z = 0;
  }

  validateFlatInvariant(body) {
    if (!this.debugPhysics || !body.mesh || body.isPocketed) {
      return;
    }

    const yDrift = Math.abs(body.mesh.position.y - body.visualY) > 0.0005;
    const tilted = Math.abs(body.mesh.rotation.x) > 0.0005 || Math.abs(body.mesh.rotation.z) > 0.0005;
    if (yDrift || tilted) {
      this.warnFlatCorrection(body, 'active piece visual drift or tilt corrected');
    }
  }

  warnFlatCorrection(body, reason) {
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (now - body.lastFlatWarningTime < 750) {
      return;
    }

    body.lastFlatWarningTime = now;
    console.warn('[Carrom3D physics]', reason, {
      id: body.id,
      expectedY: body.visualY,
      position: { ...body.position },
      velocity: { ...body.velocity },
      rotation: body.mesh
        ? { x: body.mesh.rotation.x, y: body.mesh.rotation.y, z: body.mesh.rotation.z }
        : null
    });
  }

  applyDevTestShot() {
    const striker = this.getStrikerBody();
    if (!striker) {
      return false;
    }

    const direction = this.getNormalizedVector({
      x: -striker.position.x,
      z: -striker.position.z
    });
    const fired = this.applyStrikerShot(direction, PHYSICS_TUNING.MAX_SHOT_SPEED_DEV_TEST);
    if (fired) {
      this.onStatus?.('Debug impulse running...');
    }
    return fired;
  }

  applyStrikerShot(direction, power) {
    if (!this.canAcceptShot()) {
      return false;
    }

    const striker = this.getStrikerBody();
    const normalized = this.getNormalizedVector(direction);
    const speed = Math.min(Math.max(power, 0), PHYSICS_TUNING.MAX_SHOT_SPEED_DEV_TEST);
    if (!striker || speed <= 0) {
      return false;
    }

    striker.velocity.x = normalized.x * speed;
    striker.velocity.z = normalized.z * speed;
    striker.wake();
    this.shotResolver.update({ anyMoving: true, allSleeping: false });
    this.onStatus?.('Shot in motion.');
    return true;
  }

  canAcceptShot() {
    const striker = this.getStrikerBody();
    return Boolean(striker && !striker.isPocketed && !this.getMotionState().anyMoving);
  }

  getBody(id) {
    return this.bodyMap.get(id) || null;
  }

  getStrikerBody() {
    return this.getBody('striker-1');
  }

  getActiveBodies({ includeStriker = true } = {}) {
    return this.bodies.filter((body) => {
      if (body.isPocketed) {
        return false;
      }
      return includeStriker || body.type !== 'striker';
    });
  }

  setStrikerPosition(x, z) {
    if (this.getMotionState().anyMoving) {
      return false;
    }

    const striker = this.getStrikerBody();
    if (!striker) {
      return false;
    }

    const min = -CARROM_BOARD.PLAY_AREA_SIZE / 2 + striker.radius;
    const max = CARROM_BOARD.PLAY_AREA_SIZE / 2 - striker.radius;
    striker.position.x = Math.min(Math.max(x, min), max);
    striker.position.z = Math.min(Math.max(z, min), max);
    striker.velocity.x = 0;
    striker.velocity.z = 0;
    striker.isPocketed = false;
    striker.isSleeping = true;
    striker.sleepFrames = 0;
    striker.pocketId = '';
    striker.pocketTarget = null;
    striker.pocketedElapsed = 0;
    striker.scenarioHidden = false;
    striker.spin.y = 0;
    striker.lastSafePosition.x = striker.position.x;
    striker.lastSafePosition.z = striker.position.z;

    if (striker.mesh) {
      striker.mesh.visible = true;
      striker.mesh.scale.set(1, 1, 1);
      striker.mesh.rotation.set(0, 0, 0);
      if (striker.mesh.userData.carrom) {
        striker.mesh.userData.carrom.isPocketed = false;
      }
    }

    this.syncMeshes();
    return true;
  }

  setBodyPosition(id, position = {}, { visible = true, pocketed = false } = {}) {
    const body = this.getBody(id);
    if (!body || !Number.isFinite(position.x) || !Number.isFinite(position.z)) {
      return false;
    }

    const bounds = PHYSICS_TUNING.BOARD_BOUNDS;
    const margin = body.radius + 0.02;
    body.position.x = Math.min(Math.max(position.x, bounds.minX + margin), bounds.maxX - margin);
    body.position.z = Math.min(Math.max(position.z, bounds.minZ + margin), bounds.maxZ - margin);
    body.velocity.x = 0;
    body.velocity.z = 0;
    body.isPocketed = Boolean(pocketed);
    body.isSleeping = true;
    body.sleepFrames = 0;
    body.pocketId = '';
    body.pocketTarget = null;
    body.pocketedElapsed = 0;
    body.scenarioHidden = Boolean(pocketed && !visible);
    body.spin.y = 0;
    body.lastSafePosition.x = body.position.x;
    body.lastSafePosition.z = body.position.z;

    if (body.mesh) {
      body.mesh.visible = Boolean(visible);
      body.mesh.scale.set(1, 1, 1);
      body.mesh.position.set(body.position.x, body.visualY, body.position.z);
      body.mesh.rotation.set(0, 0, 0);
      if (body.mesh.userData.carrom) {
        body.mesh.userData.carrom.isPocketed = Boolean(pocketed);
      }
    }

    return true;
  }

  applyBodySnapshot(snapshot = {}) {
    const body = this.getBody(snapshot.id);
    if (!body) {
      return false;
    }

    const position = snapshot.position || snapshot;
    const velocity = snapshot.velocity || snapshot;
    const x = Number(position.x);
    const z = Number(position.z);
    const vx = Number(velocity.vx ?? velocity.x ?? 0);
    const vz = Number(velocity.vz ?? velocity.z ?? 0);
    if (!Number.isFinite(x) || !Number.isFinite(z)) {
      return false;
    }

    body.position.x = x;
    body.position.z = z;
    body.velocity.x = Number.isFinite(vx) ? vx : 0;
    body.velocity.z = Number.isFinite(vz) ? vz : 0;
    body.isPocketed = Boolean(snapshot.isPocketed);
    body.isSleeping = snapshot.isSleeping !== undefined ? Boolean(snapshot.isSleeping) : true;
    body.sleepFrames = body.isSleeping ? PHYSICS_TUNING.SLEEP_FRAMES_REQUIRED : 0;
    body.pocketId = snapshot.pocketId || '';
    body.pocketTarget = snapshot.pocketTarget || null;
    body.pocketedElapsed = body.isPocketed ? PHYSICS_TUNING.POCKET_REMOVE_DELAY / 1000 : 0;
    body.scenarioHidden = Boolean(snapshot.scenarioHidden);
    body.spin.y = Number.isFinite(snapshot.spinY) ? snapshot.spinY : 0;
    body.lastSafePosition.x = body.position.x;
    body.lastSafePosition.z = body.position.z;

    if (body.mesh) {
      body.mesh.visible = !body.isPocketed && !body.scenarioHidden;
      body.mesh.scale.set(1, 1, 1);
      body.mesh.position.set(body.position.x, body.visualY, body.position.z);
      body.mesh.rotation.set(0, body.spin.y, 0);
      if (body.mesh.userData.carrom) {
        body.mesh.userData.carrom.isPocketed = body.isPocketed;
      }
    }

    return true;
  }

  applyBoardSnapshot(snapshot = {}) {
    const bodies = Array.isArray(snapshot.bodies)
      ? snapshot.bodies
      : Array.isArray(snapshot.pieces)
        ? snapshot.pieces
        : [];

    bodies.forEach((body) => this.applyBodySnapshot(body));
    this.accumulator = 0;
    this.shotResolver.reset();
    this.syncMeshes();
    return this.getBoardSnapshot();
  }

  hideBodyForScenario(id) {
    const body = this.getBody(id);
    if (!body) {
      return false;
    }

    return this.setBodyPosition(id, body.position, {
      visible: false,
      pocketed: true
    });
  }

  resetVelocities() {
    this.bodies.forEach((body) => {
      body.velocity.x = 0;
      body.velocity.z = 0;
      body.isSleeping = true;
      body.sleepFrames = 0;
    });
    this.syncMeshes();
  }

  applyTrainingScenario(scenario = {}) {
    this.accumulator = 0;
    this.totalTime = 0;
    this.shotResolver.reset();
    this.bodies.forEach((body) => body.reset());

    const activeIds = Array.isArray(scenario.activePieceIds)
      ? new Set(scenario.activePieceIds)
      : null;

    if (activeIds) {
      this.bodies.forEach((body) => {
        if (!activeIds.has(body.id)) {
          this.hideBodyForScenario(body.id);
        }
      });
    }

    Object.entries(scenario.placements || {}).forEach(([id, position]) => {
      this.setBodyPosition(id, position, { visible: true, pocketed: false });
    });

    if (scenario.striker) {
      this.setBodyPosition('striker-1', scenario.striker, { visible: true, pocketed: false });
    }

    this.resetVelocities();
    this.onStatus?.(scenario.objectiveText || 'Scenario ready.');
  }

  clearTrainingScenario() {
    this.reset();
  }

  resetStrikerToBaseline(position = {}) {
    return this.setStrikerPosition(
      position.x ?? 0,
      position.z ?? CARROM_BOARD.BASELINE_OFFSET
    );
  }

  returnBodyToBoard(id, preferredPosition = null) {
    const body = this.getBody(id);
    if (!body) {
      return null;
    }

    const position = this.findSafeReturnPosition(body, preferredPosition);
    body.position.x = position.x;
    body.position.z = position.z;
    body.velocity.x = 0;
    body.velocity.z = 0;
    body.isPocketed = false;
    body.isSleeping = true;
    body.sleepFrames = 0;
    body.pocketId = '';
    body.pocketTarget = null;
    body.pocketedElapsed = 0;
    body.scenarioHidden = false;
    body.spin.y = 0;
    body.lastSafePosition.x = position.x;
    body.lastSafePosition.z = position.z;

    if (body.mesh) {
      body.mesh.visible = true;
      body.mesh.scale.set(1, 1, 1);
      body.mesh.rotation.set(0, 0, 0);
      if (body.mesh.userData.carrom) {
        body.mesh.userData.carrom.isPocketed = false;
      }
    }

    this.syncMeshes();
    return {
      id: body.id,
      type: body.type,
      color: body.color,
      position
    };
  }

  findSafeReturnPosition(body, preferredPosition = null) {
    const candidates = this.createReturnCandidates(preferredPosition);
    const safe = candidates.find((position) => this.isReturnPositionSafe(body, position));
    return safe || { x: 0, z: 0 };
  }

  createReturnCandidates(preferredPosition = null) {
    const candidates = [];
    if (preferredPosition && Number.isFinite(preferredPosition.x) && Number.isFinite(preferredPosition.z)) {
      candidates.push({ x: preferredPosition.x, z: preferredPosition.z });
    }

    candidates.push({ x: 0, z: 0 });
    const rings = [0.34, 0.52, 0.72, 0.94, 1.18, 1.42];
    rings.forEach((radius, ringIndex) => {
      const count = 8 + ringIndex * 4;
      for (let index = 0; index < count; index += 1) {
        const angle = (index / count) * Math.PI * 2 + ringIndex * 0.18;
        candidates.push({
          x: Math.cos(angle) * radius,
          z: Math.sin(angle) * radius
        });
      }
    });

    return candidates;
  }

  isReturnPositionSafe(body, position) {
    const bounds = PHYSICS_TUNING.BOARD_BOUNDS;
    const margin = body.radius + 0.04;
    if (
      position.x < bounds.minX + margin ||
      position.x > bounds.maxX - margin ||
      position.z < bounds.minZ + margin ||
      position.z > bounds.maxZ - margin
    ) {
      return false;
    }

    const pocketBuffer = PHYSICS_TUNING.POCKET_PULL_RADIUS + body.radius;
    const nearPocket = this.pocketDetector.pockets.some((pocket) => {
      const dx = pocket.position.x - position.x;
      const dz = pocket.position.z - position.z;
      return dx * dx + dz * dz < pocketBuffer * pocketBuffer;
    });
    if (nearPocket) {
      return false;
    }

    return !this.getActiveBodies({ includeStriker: true }).some((other) => {
      if (other.id === body.id) {
        return false;
      }
      const dx = other.position.x - position.x;
      const dz = other.position.z - position.z;
      const minDistance = other.radius + body.radius + 0.035;
      return dx * dx + dz * dz < minDistance * minDistance;
    });
  }

  isCircleOverlapping(x, z, radius, ignoreId = '') {
    return this.getActiveBodies({ includeStriker: true }).some((body) => {
      if (body.id === ignoreId) {
        return false;
      }

      const dx = body.position.x - x;
      const dz = body.position.z - z;
      const minDistance = body.radius + radius;
      return dx * dx + dz * dz < minDistance * minDistance;
    });
  }

  reset() {
    this.accumulator = 0;
    this.totalTime = 0;
    this.bodies.forEach((body) => body.reset());
    this.shotResolver.reset();
    this.syncMeshes();
    this.onStatus?.('Physics reset. Ready for striker placement.');
  }

  getMotionState() {
    const active = this.bodies.filter((body) => !body.isPocketed);
    const anyMoving = active.some((body) => body.isMoving());
    const allSleeping = active.every((body) => body.isSleeping);
    return {
      anyMoving,
      allSleeping,
      movingCount: active.filter((body) => body.isMoving()).length,
      sleepingCount: active.filter((body) => body.isSleeping).length,
      pocketedCount: this.bodies.length - active.length
    };
  }

  getSummary() {
    return {
      totalBodies: this.bodies.length,
      activeBodies: this.bodies.filter((body) => !body.isPocketed).length,
      pocketedBodies: this.bodies.filter((body) => body.isPocketed).length,
      strikerReady: Boolean(this.bodyMap.get('striker-1') && !this.bodyMap.get('striker-1').isPocketed),
      ...this.getMotionState()
    };
  }

  getBoardSnapshot() {
    const serializeBody = (body) => ({
      id: body?.id || '',
      type: body?.type || '',
      color: body?.color || '',
      radius: body?.radius || 0,
      mass: body?.mass || 0,
      x: body?.position?.x || 0,
      z: body?.position?.z || 0,
      vx: body?.velocity?.x || 0,
      vz: body?.velocity?.z || 0,
      position: { x: body?.position?.x || 0, z: body?.position?.z || 0 },
      velocity: { x: body?.velocity?.x || 0, z: body?.velocity?.z || 0 },
      isPocketed: Boolean(body?.isPocketed),
      isSleeping: Boolean(body?.isSleeping)
    });

    const bodies = this.bodies.map(serializeBody);
    return {
      bodies,
      activeBodies: bodies.filter((body) => !body.isPocketed),
      striker: serializeBody(this.getStrikerBody()),
      pockets: this.pocketDetector.pockets.map((pocket) => ({
        id: pocket.id,
        position: { x: pocket.position.x, z: pocket.position.z },
        radius: CARROM_BOARD.POCKET_RADIUS
      })),
      bounds: { ...PHYSICS_TUNING.BOARD_BOUNDS },
      motion: this.getMotionState()
    };
  }

  handlePocketed(body) {
    this.shotResolver.recordPocketed(body);
  }

  getNormalizedVector(vector) {
    const length = Math.hypot(vector.x, vector.z) || 1;
    return {
      x: vector.x / length,
      z: vector.z / length
    };
  }

  dispose() {
    this.bodies.length = 0;
    this.bodyMap.clear();
  }
}
