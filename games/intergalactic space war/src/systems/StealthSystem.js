import * as THREE from "three";
import { playStealthEnterSound, playStealthExitSound } from "../audio/placeholders.js";

const enemyForward = new THREE.Vector3();
const toPlayerVector = new THREE.Vector3();
const lastKnownPosition = new THREE.Vector3();

function createVisionHelper() {
  const mesh = new THREE.Mesh(
    new THREE.ConeGeometry(1, 1, 18, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0x6fb8ff,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  mesh.rotation.x = Math.PI * 0.5;
  mesh.renderOrder = 2;
  return mesh;
}

function getStateColor(state) {
  if (state === "alerted") {
    return 0xff7a7a;
  }

  if (state === "suspicious") {
    return 0xffd36a;
  }

  return 0x76c6ff;
}

export class StealthSystem {
  constructor() {
    this.enemyStateMap = new Map();
    this.debugVisible = false;
    this.playerState = "hidden";
  }

  ensureEnemyState(enemy) {
    if (this.enemyStateMap.has(enemy)) {
      return this.enemyStateMap.get(enemy);
    }

    const helper = createVisionHelper();
    enemy.group.add(helper);

    const state = {
      state: "idle",
      detection: 0,
      canSeePlayer: false,
      isBlocked: false,
      lastKnownPosition: enemy.position.clone(),
      helper,
    };

    this.enemyStateMap.set(enemy, state);
    return state;
  }

  setDebugVisible(isVisible) {
    this.debugVisible = isVisible;

    for (const entry of this.enemyStateMap.values()) {
      entry.helper.visible = isVisible;
    }
  }

  update(deltaTime, {
    player,
    enemies = [],
    environmentManager,
  } = {}) {
    const liveEnemies = new Set(enemies);
    let hasAlertedEnemy = false;
    let hasSuspiciousEnemy = false;

    for (const [enemy, entry] of this.enemyStateMap) {
      if (liveEnemies.has(enemy)) {
        continue;
      }

      enemy.group.remove(entry.helper);
      entry.helper.geometry.dispose();
      entry.helper.material.dispose();
      this.enemyStateMap.delete(enemy);
    }

    for (const enemy of enemies) {
      const entry = this.ensureEnemyState(enemy);

      if (enemy.isDestroyed || player?.isDestroyed) {
        entry.canSeePlayer = false;
        entry.detection = Math.max(0, entry.detection - deltaTime);
        entry.state = entry.detection > 0.24 ? "suspicious" : "idle";
        this.updateVisionHelper(enemy, entry);
        continue;
      }

      toPlayerVector.copy(player.position).sub(enemy.position);
      const distanceToPlayer = Math.max(toPlayerVector.length(), 0.001);
      const normalizedDirection = toPlayerVector.normalize();

      enemy.getForwardVector(enemyForward);
      const angleToPlayer = Math.acos(THREE.MathUtils.clamp(enemyForward.dot(normalizedDirection), -1, 1));
      const insideVisionCone = distanceToPlayer <= enemy.visionRange && angleToPlayer <= enemy.visionHalfAngle;
      const blockedByPlanet = insideVisionCone
        ? environmentManager?.isLineBlocked(enemy.position, player.position) ?? false
        : false;

      entry.canSeePlayer = insideVisionCone && !blockedByPlanet;
      entry.isBlocked = blockedByPlanet;

      if (entry.canSeePlayer) {
        entry.detection = Math.min(1, entry.detection + deltaTime * 2.15);
        entry.lastKnownPosition.copy(player.position);
      } else {
        entry.detection = Math.max(0, entry.detection - deltaTime * (blockedByPlanet ? 0.82 : 0.42));
      }

      if (entry.detection >= 0.56) {
        entry.state = "alerted";
        hasAlertedEnemy = true;
      } else if (entry.detection >= 0.16) {
        entry.state = "suspicious";
        hasSuspiciousEnemy = true;
      } else {
        entry.state = "idle";
      }

      this.updateVisionHelper(enemy, entry);
    }

    const previousState = this.playerState;
    this.playerState = hasAlertedEnemy ? "detected" : hasSuspiciousEnemy ? "suspicious" : "hidden";

    if (previousState !== "hidden" && this.playerState === "hidden") {
      playStealthEnterSound();
    } else if (previousState !== "detected" && this.playerState === "detected") {
      playStealthExitSound();
    }
  }

  updateVisionHelper(enemy, entry) {
    entry.helper.visible = this.debugVisible;
    entry.helper.position.z = -enemy.visionRange * 0.5;
    entry.helper.scale.set(
      Math.tan(enemy.visionHalfAngle) * enemy.visionRange,
      enemy.visionRange,
      Math.tan(enemy.visionHalfAngle) * enemy.visionRange,
    );
    entry.helper.material.color.setHex(getStateColor(entry.state));
    entry.helper.material.opacity = entry.state === "alerted"
      ? 0.2
      : entry.state === "suspicious"
        ? 0.16
        : 0.1;
  }

  getEnemyPerception(enemy) {
    const entry = this.enemyStateMap.get(enemy);

    if (!entry) {
      lastKnownPosition.copy(enemy?.position ?? new THREE.Vector3());

      return {
        state: "idle",
        canSeePlayer: false,
        detection: 0,
        lastKnownPosition,
      };
    }

    return {
      state: entry.state,
      canSeePlayer: entry.canSeePlayer,
      detection: entry.detection,
      lastKnownPosition: entry.lastKnownPosition,
      isBlocked: entry.isBlocked,
    };
  }

  isPlayerHidden() {
    return this.playerState === "hidden";
  }

  getHudState() {
    if (this.playerState === "detected") {
      return {
        label: "Detected",
        status: "Hostile sensors have a confirmed lock.",
        isDetected: true,
        isSuspicious: false,
      };
    }

    if (this.playerState === "suspicious") {
      return {
        label: "Suspicious",
        status: "Enemy scans are searching your last known vector.",
        isDetected: false,
        isSuspicious: true,
      };
    }

    return {
      label: "Hidden",
      status: "Planets and distance are masking your signature.",
      isDetected: false,
      isSuspicious: false,
    };
  }

  dispose() {
    for (const [enemy, entry] of this.enemyStateMap) {
      enemy.group.remove(entry.helper);
      entry.helper.geometry.dispose();
      entry.helper.material.dispose();
    }

    this.enemyStateMap.clear();
  }
}
