import * as THREE from "three";
import { EnemyShip } from "../entities/EnemyShip.js";

const spawnPosition = new THREE.Vector3();
const candidateSpawnPosition = new THREE.Vector3();
const forwardVector = new THREE.Vector3();
const rightVector = new THREE.Vector3();
const upVector = new THREE.Vector3();
const enemyToPlayer = new THREE.Vector3();

export class EnemyManager {
  constructor({
    scene,
    player,
    projectileSystem,
    explosionSystem,
    environmentManager,
    maxActiveEnemies = 4,
  }) {
    this.scene = scene;
    this.player = player;
    this.projectileSystem = projectileSystem;
    this.explosionSystem = explosionSystem;
    this.environmentManager = environmentManager;
    this.maxActiveEnemiesBase = maxActiveEnemies;
    this.maxActiveEnemies = maxActiveEnemies;
    this.enemies = [];
    this.spawnTimer = 0;
    this.spawnCounter = 0;
    this.currentWave = 0;
    this.enemiesToSpawnThisWave = 0;
    this.enemiesSpawnedThisWave = 0;
    this.waveInterval = 1.2;
    this.waveCooldown = 0;
    this.waveStatusLabel = "Scanning the void";
    this.enemyLeashDistance = 240;

    this.startNextWave(true);
  }

  update(deltaTime, { stealthSystem } = {}) {
    if (!this.player.isDestroyed && this.waveCooldown === 0 && this.enemiesSpawnedThisWave < this.enemiesToSpawnThisWave) {
      this.spawnTimer = Math.max(0, this.spawnTimer - deltaTime);

      if (this.spawnTimer === 0 && this.enemies.length < this.maxActiveEnemies) {
        this.spawnEnemy();
        this.spawnTimer = this.waveInterval * THREE.MathUtils.randFloat(0.82, 1.12);
      }
    }

    for (const enemy of this.enemies) {
      enemy.update(deltaTime, {
        player: this.player,
        projectileSystem: this.projectileSystem,
        perception: stealthSystem?.getEnemyPerception(enemy),
      });

      enemyToPlayer.copy(enemy.position).sub(this.player.position);

      if (enemyToPlayer.lengthSq() > this.enemyLeashDistance ** 2) {
        this.repositionEnemy(enemy);
      }
    }

    if (this.player.isDestroyed) {
      return;
    }

    if (this.waveCooldown > 0) {
      this.waveCooldown = Math.max(0, this.waveCooldown - deltaTime);
      this.waveStatusLabel = `Next wave in ${this.waveCooldown.toFixed(1)}s`;

      if (this.waveCooldown === 0) {
        this.startNextWave();
      }

      return;
    }

    if (this.enemiesSpawnedThisWave < this.enemiesToSpawnThisWave) {
      this.waveStatusLabel = `${this.getWaveState().enemiesRemaining} hostile signatures`;
    } else if (this.enemies.length === 0) {
      this.waveStatusLabel = `Wave ${this.currentWave} secured`;
      this.waveCooldown = 2.6;
    } else {
      this.waveStatusLabel = `${this.enemies.length} hostiles remaining`;
    }
  }

  startNextWave(isInitial = false) {
    this.currentWave += 1;
    this.enemiesToSpawnThisWave = 3 + this.currentWave * 2;
    this.enemiesSpawnedThisWave = 0;
    this.maxActiveEnemies = Math.min(this.maxActiveEnemiesBase + Math.floor(this.currentWave / 2), 9);
    this.waveInterval = Math.max(0.48, 1.42 - this.currentWave * 0.08);
    this.spawnTimer = isInitial ? 0.2 : 0.5;
    this.waveCooldown = 0;
    this.waveStatusLabel = isInitial
      ? `Wave ${this.currentWave} engaging`
      : `Wave ${this.currentWave} incoming`;
  }

  chooseArchetypeForWave() {
    const weightedPool = [
      { id: "shooter", weight: 4 + this.currentWave },
      { id: "fast-attacker", weight: this.currentWave >= 2 ? 2 + this.currentWave * 0.6 : 0 },
      { id: "heavy-tank", weight: this.currentWave >= 3 ? 1 + this.currentWave * 0.35 : 0 },
    ].filter((entry) => entry.weight > 0);

    const totalWeight = weightedPool.reduce((sum, entry) => sum + entry.weight, 0);
    let randomWeight = Math.random() * totalWeight;

    for (const entry of weightedPool) {
      randomWeight -= entry.weight;

      if (randomWeight <= 0) {
        return entry.id;
      }
    }

    return weightedPool[weightedPool.length - 1].id;
  }

  spawnEnemy() {
    const safeSpawnPosition = this.getSpawnPosition();

    const enemy = new EnemyShip({
      spawnPosition: safeSpawnPosition,
      archetypeId: this.chooseArchetypeForWave(),
    });

    this.spawnCounter += 1;
    enemy.debugId = this.spawnCounter;
    enemy.setPatrolAnchor(safeSpawnPosition);
    enemy.facePoint(this.player.position);
    enemy.fireCooldown = THREE.MathUtils.randFloat(0.02, Math.max(0.08, enemy.baseFireCooldown * 0.3));
    this.enemiesSpawnedThisWave += 1;
    this.enemies.push(enemy);
    this.scene.add(enemy.group);
    this.waveStatusLabel = `${this.getWaveState().enemiesRemaining} hostile signatures`;

    return enemy;
  }

  getSpawnPosition(minDistance = 30, maxDistance = 58) {
    this.player.getForwardVector(forwardVector);
    this.player.getRightVector(rightVector);
    this.player.getUpVector(upVector);

    let fallbackPosition = null;

    for (let attempt = 0; attempt < 8; attempt += 1) {
      const forwardDistance = THREE.MathUtils.randFloat(minDistance, maxDistance);
      const lateralSpread = THREE.MathUtils.randFloatSpread(34);
      const verticalSpread = THREE.MathUtils.randFloatSpread(22);

      candidateSpawnPosition.copy(this.player.position)
        .addScaledVector(forwardVector, forwardDistance)
        .addScaledVector(rightVector, lateralSpread)
        .addScaledVector(upVector, verticalSpread);

      const safePosition = this.environmentManager
        ? this.environmentManager.getSafePosition(candidateSpawnPosition, 1.9)
        : candidateSpawnPosition.clone();

      if (!fallbackPosition) {
        fallbackPosition = safePosition.clone();
      }

      if (!this.environmentManager || !this.environmentManager.isLineBlocked(safePosition, this.player.position)) {
        return safePosition;
      }
    }

    spawnPosition.copy(fallbackPosition ?? candidateSpawnPosition);
    return spawnPosition.clone();
  }

  repositionEnemy(enemy) {
    const nextPosition = this.getSpawnPosition(40, 74);
    enemy.group.position.copy(nextPosition);
    enemy.setPatrolAnchor(nextPosition);
    enemy.facePoint(this.player.position);
    enemy.velocity.set(0, 0, 0);
    enemy.angularVelocity.set(0, 0, 0);
    enemy.fireCooldown = THREE.MathUtils.randFloat(0.04, Math.max(0.12, enemy.baseFireCooldown * 0.38));
    enemy.updateCollisionBounds();
  }

  destroyEnemy(enemy) {
    const enemyIndex = this.enemies.indexOf(enemy);

    if (enemyIndex < 0) {
      return;
    }

    this.enemies.splice(enemyIndex, 1);
    this.scene.remove(enemy.group);
    enemy.dispose();

    this.explosionSystem.spawnExplosion({
      position: enemy.position.clone(),
      color: enemy.archetype.explosionColor,
      scale: enemy.explosionScale,
    });

    this.spawnTimer = Math.min(this.spawnTimer, THREE.MathUtils.randFloat(0.18, 0.45));
    this.waveStatusLabel = `${this.getWaveState().enemiesRemaining} hostile signatures`;
  }

  clearEnemies() {
    for (const enemy of this.enemies) {
      this.scene.remove(enemy.group);
      enemy.dispose();
    }

    this.enemies.length = 0;
  }

  reset() {
    this.clearEnemies();
    this.spawnTimer = 0;
    this.spawnCounter = 0;
    this.currentWave = 0;
    this.enemiesToSpawnThisWave = 0;
    this.enemiesSpawnedThisWave = 0;
    this.waveInterval = 1.2;
    this.waveCooldown = 0;
    this.waveStatusLabel = "Scanning the void";
    this.maxActiveEnemies = this.maxActiveEnemiesBase;
    this.startNextWave(true);
  }

  getWaveState() {
    const enemiesRemaining = this.enemies.length + (this.enemiesToSpawnThisWave - this.enemiesSpawnedThisWave);

    return {
      currentWave: this.currentWave,
      enemiesRemaining,
      statusLabel: this.waveStatusLabel,
    };
  }

  dispose() {
    this.clearEnemies();
  }
}
