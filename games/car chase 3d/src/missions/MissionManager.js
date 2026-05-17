import * as THREE from 'three';
import { GAME_DURATION, MISSIONS } from '../config.js';
import { clamp, flatDistance, formatTime } from '../utils/math.js';

export class MissionManager {
  constructor() {
    this.mission = MISSIONS.robber[0];
    this.state = this.createState(this.mission);
    this.lastPlayerHealth = null;
    this.lastRobberHealth = null;
  }

  start(mission) {
    this.mission = mission;
    this.state = this.createState(mission);
    this.lastPlayerHealth = null;
    this.lastRobberHealth = null;
    return this.state;
  }

  createState(mission) {
    return {
      timer: mission.duration || GAME_DURATION,
      completed: false,
      failed: false,
      progress: 0,
      checkpointIndex: 0,
      cargoStability: mission.cargoStability ?? 100,
      intercept: 0,
      bonusComplete: false,
      status: mission.objective,
      objectiveTarget: this.getInitialTarget(mission),
    };
  }

  getInitialTarget(mission) {
    if (mission.mode === 'checkpoints') return this.pointToVector(mission.checkpoints[0]);
    if (mission.mode === 'cargo') return this.pointToVector(mission.dropPoint);
    return null;
  }

  pointToVector(point) {
    return point ? new THREE.Vector3(point.x, 0, point.z) : null;
  }

  update(dt, context) {
    const { player, robber, stats, roadblocks } = context;
    if (this.state.completed || this.state.failed) return this.state;

    this.state.timer = Math.max(0, this.state.timer - dt);
    if (this.lastPlayerHealth === null && player) this.lastPlayerHealth = player.health;
    if (this.lastRobberHealth === null && robber) this.lastRobberHealth = robber.health;

    if (this.mission.role === 'robber') this.updateRobberMission({ ...context, dt });
    if (this.mission.role === 'police') this.updatePoliceMission({ ...context, dt });

    if (this.mission.takedownGoal && stats.destroyed >= this.mission.takedownGoal) {
      this.complete('Takedown trial complete.');
    }
    if (this.mission.requiresCaptainDefeat && stats.captainDefeated) {
      this.complete('Captain defeated.');
    }

    if (player && player.health <= 0 && this.mission.role === 'robber') {
      this.fail('Robber disabled.');
    }
    if (this.state.timer <= 0) {
      if (this.mission.mode === 'survival') this.complete('Survived the heat.');
      else this.fail('Mission timer expired.');
    }

    if (this.mission.mode === 'cargo' && this.state.cargoStability <= 0) this.fail('Cargo stability lost.');
    if (this.mission.role === 'police' && robber?.health <= 0) this.complete('Target disabled.');

    this.updateBonus(stats);
    this.lastPlayerHealth = player?.health ?? this.lastPlayerHealth;
    this.lastRobberHealth = robber?.health ?? this.lastRobberHealth;
    return this.state;
  }

  updateRobberMission({ player, stats, dt }) {
    if (!player) return;
    if (this.mission.mode === 'survival') {
      this.state.progress = 1 - this.state.timer / this.mission.duration;
      this.state.status = `Survive ${formatTime(this.state.timer)}`;
    }
    if (this.mission.mode === 'checkpoints') {
      const checkpoint = this.mission.checkpoints[this.state.checkpointIndex];
      if (!checkpoint) {
        this.complete('Escape route cleared.');
        return;
      }
      this.state.objectiveTarget = this.pointToVector(checkpoint);
      const distance = flatDistance(player.group.position, this.state.objectiveTarget);
      if (distance <= checkpoint.radius) {
        this.state.checkpointIndex += 1;
        this.state.progress = this.state.checkpointIndex / this.mission.checkpoints.length;
        const next = this.mission.checkpoints[this.state.checkpointIndex];
        this.state.objectiveTarget = this.pointToVector(next);
        this.state.status = next ? `Checkpoint ${this.state.checkpointIndex + 1} of ${this.mission.checkpoints.length}` : 'Final escape reached.';
        if (!next) this.complete('All checkpoints reached.');
      } else {
        this.state.status = `Checkpoint ${this.state.checkpointIndex + 1}: ${Math.round(distance)}m`;
      }
    }
    if (this.mission.mode === 'cargo') {
      const damageDelta = Math.max(0, (this.lastPlayerHealth ?? player.health) - player.health);
      if (damageDelta > 0) this.state.cargoStability -= damageDelta * 0.38;
      if (player.isDrifting && player.speed > 24) this.state.cargoStability -= 1.2 * dt;
      this.state.cargoStability = clamp(this.state.cargoStability, 0, 100);
      this.state.objectiveTarget = this.pointToVector(this.mission.dropPoint);
      const distance = flatDistance(player.group.position, this.state.objectiveTarget);
      this.state.progress = 1 - distance / 260;
      this.state.status = `Cargo ${Math.round(this.state.cargoStability)}% - Drop ${Math.round(distance)}m`;
      if (distance <= this.mission.dropPoint.radius && this.state.cargoStability > 0) this.complete('Cargo delivered.');
    }
  }

  updatePoliceMission({ robber, player, roadblocks, dt }) {
    if (!robber) return;
    if (this.mission.mode === 'hunt') {
      this.state.progress = 1 - robber.health / robber.maxHealth;
      this.state.status = `Robber HP ${Math.ceil(robber.health)}`;
    }
    if (this.mission.mode === 'intercept') {
      const nearBlock = roadblocks?.blocks?.some((block) => flatDistance(block.group.position, robber.group.position) < 18);
      const slowRobber = robber.speed < 12;
      if (nearBlock && slowRobber) this.state.intercept += 18 * dt;
      if (nearBlock && player && flatDistance(player.group.position, robber.group.position) < 30) this.state.intercept += 10 * dt;
      this.state.intercept = clamp(this.state.intercept, 0, this.mission.interceptGoal);
      this.state.progress = this.state.intercept / this.mission.interceptGoal;
      this.state.status = `Intercept ${Math.round(this.state.intercept)}%`;
      if (this.state.intercept >= this.mission.interceptGoal) this.complete('Roadblock intercept complete.');
    }
    if (this.mission.mode === 'convoy') {
      this.state.progress = 1 - robber.health / robber.maxHealth;
      this.state.status = `Stop convoy leader - ${Math.ceil(robber.health)} HP`;
    }
  }

  updateBonus(stats) {
    const id = this.mission.baseMissionId || this.mission.id;
    if (id === 'survival-heat') this.state.bonusComplete = stats.destroyed >= (this.mission.id === 'career-first-heat' ? 3 : 5);
    if (id === 'escape-route') this.state.bonusComplete = this.state.completed && this.state.timer >= (this.mission.id === 'career-highway-breakout' ? 40 : 30);
    if (id === 'cargo-run') this.state.bonusComplete = this.state.completed && this.state.cargoStability >= (this.mission.id === 'career-cargo-industrial' ? 60 : 55);
    if (id === 'police-hunt') {
      const lowCityDamage = (stats.trafficHits || 0) + (stats.propHits || 0) < 3;
      this.state.bonusComplete = this.mission.id === 'career-market-containment'
        ? this.state.completed && lowCityDamage
        : this.state.completed && this.state.timer >= 60;
    }
    if (id === 'roadblock-intercept') this.state.bonusComplete = stats.abilityHits >= 3;
    if (id === 'convoy-stop') this.state.bonusComplete = stats.convoyDestroyed >= 2;
    if (this.mission.id === 'career-captain-heat') this.state.bonusComplete = Boolean(stats.captainDefeated);
    if (this.mission.id === 'career-captain-assist') this.state.bonusComplete = this.state.completed && (stats.playerDeaths || 0) === 0;
  }

  complete(message) {
    this.state.completed = true;
    this.state.status = message;
  }

  fail(message) {
    this.state.failed = true;
    this.state.status = message;
  }

  getHudState() {
    return {
      name: this.mission.name,
      objective: this.state.status,
      bonus: this.mission.bonus,
      progress: clamp(this.state.progress, 0, 1),
      cargo: this.mission.mode === 'cargo' ? this.state.cargoStability : null,
      timer: this.state.timer,
      target: this.state.objectiveTarget,
      district: this.mission.districtId,
      cupLabel: this.mission.cup ? `${this.mission.cupName} ${this.mission.cupRound}/${this.mission.cupRounds}` : '',
      completed: this.state.completed,
      failed: this.state.failed,
      bonusComplete: this.state.bonusComplete,
    };
  }
}
