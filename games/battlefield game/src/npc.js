import { MathUtils, Raycaster, Vector3 } from "three";
import { createNpcAnimationRig } from "./character-rigs.js";

const NPC_RADIUS = 1.1;
const PATROL_RADIUS = 14;
const BASE_REACTION_DELAY_MIN = 0.34;
const BASE_REACTION_DELAY_MAX = 0.82;
const LOST_PLAYER_MEMORY = 3.4;
const HIT_FLASH_DURATION = 0.18;
const DEATH_DURATION = 0.7;
const SPAWN_BUFFER = 15;
const HIT_FLASH_COLOR = 0xff7b64;

const DIFFICULTY_SETTINGS = {
  easy: {
    alertMemory: 5.8,
    countMax: 6,
    countMin: 5,
    coverChance: 0.08,
    coverSearchRadius: 16,
    detectionRadius: 24,
    flankBias: 0.08,
    groupAlertRadius: 14,
    gunAttackCooldown: 1.42,
    gunAttackDamage: 4,
    gunAttackRadius: 13.5,
    hearingRadius: 34,
    knifeAttackCooldown: 1.08,
    knifeAttackDamage: 8,
    knifeAttackRadius: 2.4,
    lastStandChaseMultiplier: 1.12,
    lastStandCount: 2,
    npcHealth: 58,
    patrolSpeed: 1.85,
    reactionDelayScale: 1.22,
    rushChance: 0.14,
    rushSpeedMultiplier: 1.08,
    searchDuration: 3.5,
    searchRadius: 9,
    chaseSpeed: 2.9,
  },
  normal: {
    alertMemory: 7,
    countMax: 9,
    countMin: 5,
    coverChance: 0.24,
    coverSearchRadius: 22,
    detectionRadius: 28,
    flankBias: 0.22,
    groupAlertRadius: 18,
    gunAttackCooldown: 1.2,
    gunAttackDamage: 6,
    gunAttackRadius: 15.5,
    hearingRadius: 38,
    knifeAttackCooldown: 0.92,
    knifeAttackDamage: 10,
    knifeAttackRadius: 2.7,
    lastStandChaseMultiplier: 1.28,
    lastStandCount: 3,
    npcHealth: 68,
    patrolSpeed: 2.05,
    reactionDelayScale: 1,
    rushChance: 0.26,
    rushSpeedMultiplier: 1.14,
    searchDuration: 8.5,
    searchRadius: 14,
    chaseSpeed: 3.35,
  },
  tough: {
    alertMemory: 9.4,
    countMax: 10,
    countMin: 8,
    coverChance: 0.58,
    coverSearchRadius: 30,
    detectionRadius: 34,
    flankBias: 0.42,
    groupAlertRadius: 24,
    gunAttackCooldown: 0.78,
    gunAttackDamage: 8,
    gunAttackRadius: 19,
    hearingRadius: 48,
    knifeAttackCooldown: 0.68,
    knifeAttackDamage: 14,
    knifeAttackRadius: 3.2,
    lastStandChaseMultiplier: 1.42,
    lastStandCount: 4,
    npcHealth: 84,
    patrolSpeed: 2.45,
    reactionDelayScale: 0.52,
    rushChance: 0.56,
    rushSpeedMultiplier: 1.28,
    searchDuration: 14,
    searchRadius: 20,
    chaseSpeed: 4.95,
  },
};

export class NpcManager {
  constructor({
    collisionBoxes,
    coverProvider,
    difficulty = "normal",
    navBounds,
    onEnemyAttack,
    onEnemyCountChange,
    onEnemyDefeated,
    onNpcFootstep,
    onPlayerDamaged,
    player,
    playerSpawn,
    scene,
  }) {
    this.collisionBoxes = collisionBoxes;
    this.coverProvider = coverProvider;
    this.difficultyKey = resolveDifficultyKey(difficulty);
    this.difficulty = DIFFICULTY_SETTINGS[this.difficultyKey];
    this.navBounds = navBounds;
    this.onEnemyAttack = onEnemyAttack;
    this.onEnemyCountChange = onEnemyCountChange;
    this.onEnemyDefeated = onEnemyDefeated;
    this.onNpcFootstep = onNpcFootstep;
    this.onPlayerDamaged = onPlayerDamaged;
    this.player = player;
    this.playerSpawn = playerSpawn;
    this.scene = scene;

    this.elapsed = 0;
    this.playerAlive = true;
    this.rayDirection = new Vector3();
    this.rayOrigin = new Vector3();
    this.raycaster = new Raycaster();
    this.teamContact = {
      active: false,
      sourceIndex: -1,
      timer: 0,
      x: playerSpawn.x,
      z: playerSpawn.z,
    };
    this.npcs = [];

    this.spawnEnemies();
    this.notifyEnemyCount();
  }

  setPlayerAlive(isAlive) {
    this.playerAlive = isAlive;
  }

  getAliveCount() {
    return this.npcs.filter((npc) => !npc.isDying && !npc.isDisposed).length;
  }

  getShootTargets() {
    return this.npcs
      .filter((npc) => !npc.isDying && !npc.isDisposed)
      .map((npc) => npc.root);
  }

  registerGunshot({ position, radius = this.difficulty.hearingRadius, silent = false }) {
    if (silent) {
      return;
    }

    const heardNpcs = [];

    for (const npc of this.npcs) {
      if (npc.isDisposed || npc.isDying) {
        continue;
      }

      if (distanceSquared2D(position.x, position.z, npc.x, npc.z) > radius * radius) {
        continue;
      }

      heardNpcs.push(npc);
      this.alertNpc(npc, position, false);
    }

    for (const heardNpc of heardNpcs) {
      for (const ally of this.npcs) {
        if (ally === heardNpc || ally.isDisposed || ally.isDying) {
          continue;
        }

        if (
          distanceSquared2D(heardNpc.x, heardNpc.z, ally.x, ally.z) <=
          this.difficulty.groupAlertRadius * this.difficulty.groupAlertRadius
        ) {
          this.alertNpc(ally, position, true);
        }
      }
    }

    if (heardNpcs.length > 0) {
      this.activateTeamContact(position, heardNpcs[0], 0.82);
    }
  }

  update(delta) {
    this.elapsed += delta;
    this.teamContact.timer = Math.max(0, this.teamContact.timer - delta);
    if (this.teamContact.timer === 0) {
      this.teamContact.active = false;
      this.teamContact.sourceIndex = -1;
    }

    const aliveCount = this.getAliveCount();

    for (const npc of this.npcs) {
      this.updateHitFlash(npc, delta);

      if (npc.isDying) {
        npc.animation.update(delta);
        this.updateDeath(npc, delta);
        continue;
      }

      npc.alertTimer = Math.max(0, npc.alertTimer - delta);
      npc.attackCooldown = Math.max(0, npc.attackCooldown - delta);
      npc.avoidanceTimer = Math.max(0, npc.avoidanceTimer - delta);
      npc.coverHoldRemaining = Math.max(0, npc.coverHoldRemaining - delta);
      npc.reactionRemaining = Math.max(0, npc.reactionRemaining - delta);
      npc.lastKnownTimer = Math.max(0, npc.lastKnownTimer - delta);
      npc.searchRemaining = Math.max(0, npc.searchRemaining - delta);
      npc.squadBroadcastCooldown = Math.max(0, npc.squadBroadcastCooldown - delta);
      npc.tacticTimer = Math.max(0, npc.tacticTimer - delta);

      if (!this.playerAlive) {
        npc.animation.setLocomotion("idle");
        npc.animation.update(delta);
        continue;
      }

      this.updateBehavior(npc, delta, aliveCount);
      npc.animation.update(delta);
    }

    this.npcs = this.npcs.filter((npc) => !npc.isDisposed);
  }

  spawnEnemies() {
    const targetCount = MathUtils.randInt(this.difficulty.countMin, this.difficulty.countMax);

    for (let index = 0; index < targetCount; index += 1) {
      const spawnPosition = this.findSpawnPosition();
      if (!spawnPosition) {
        continue;
      }

      const npc = this.createNpc(spawnPosition.x, spawnPosition.z, index);
      this.scene.add(npc.root);
      this.npcs.push(npc);
    }
  }

  findSpawnPosition() {
    for (let attempt = 0; attempt < 120; attempt += 1) {
      const x = MathUtils.randFloat(this.navBounds.minX, this.navBounds.maxX);
      const z = MathUtils.randFloat(this.navBounds.minZ, this.navBounds.maxZ);
      const dx = x - this.playerSpawn.x;
      const dz = z - this.playerSpawn.z;

      if (dx * dx + dz * dz < SPAWN_BUFFER * SPAWN_BUFFER) {
        continue;
      }

      if (this.isStaticCollision(x, z, NPC_RADIUS)) {
        continue;
      }

      let overlapsNpc = false;
      for (const npc of this.npcs) {
        if (distanceSquared2D(x, z, npc.x, npc.z) < (NPC_RADIUS * 2.2) ** 2) {
          overlapsNpc = true;
          break;
        }
      }

      if (!overlapsNpc) {
        return { x, z };
      }
    }

    return null;
  }

  createNpc(x, z, index) {
    const animation = createNpcAnimationRig(index);
    const root = animation.root;
    root.position.set(x, 0, z);

    const npc = {
      alertTargetX: x,
      alertTargetZ: z,
      alertTimer: 0,
      animation,
      attackCooldown: MathUtils.randFloat(0.18, this.difficulty.gunAttackCooldown),
      avoidanceSign: Math.random() > 0.5 ? 1 : -1,
      avoidanceTimer: 0,
      baseReactionDelay: MathUtils.randFloat(BASE_REACTION_DELAY_MIN, BASE_REACTION_DELAY_MAX),
      bodyMaterials: animation.bodyMaterials,
      coverHoldRemaining: 0,
      coverTargetX: x,
      coverTargetZ: z,
      deathRemaining: 0,
      engaged: false,
      health: this.difficulty.npcHealth,
      hitFlashRemaining: 0,
      index,
      isDisposed: false,
      isDying: false,
      lastKnownPlayerX: x,
      lastKnownPlayerZ: z,
      lastKnownTimer: 0,
      patrolOriginX: x,
      patrolOriginZ: z,
      patrolTargetX: x,
      patrolTargetZ: z,
      patrolTimer: 0,
      pendingState: null,
      reactionRemaining: 0,
      root,
      searchPointX: x,
      searchPointZ: z,
      searchRemaining: 0,
      state: "patrol",
      stepAccumulator: 0,
      squadBroadcastCooldown: MathUtils.randFloat(0.2, 0.8),
      tacticMode: "none",
      tacticTimer: MathUtils.randFloat(0.3, 1.1),
      x,
      z,
    };

    npc.takeDamage = (damageAmount, meta) => this.applyDamage(npc, damageAmount, meta);

    for (const mesh of animation.flashMeshes) {
      mesh.userData.damageReceiver = npc;
    }

    this.pickPatrolTarget(npc);
    this.syncNpcTransform(npc, 0, 1);
    animation.setCombatMode("gun");
    animation.setLocomotion("idle");

    return npc;
  }

  updateBehavior(npc, delta, aliveCount) {
    const lastStand = aliveCount <= this.difficulty.lastStandCount;
    const reactionDelay = Math.max(
      lastStand ? 0.06 : 0.12,
      npc.baseReactionDelay * this.difficulty.reactionDelayScale * (lastStand ? 0.58 : 1),
    );
    const detectionRadius = this.difficulty.detectionRadius * (lastStand ? 1.18 : 1);
    const attackRadius = this.difficulty.gunAttackRadius * (lastStand ? 1.08 : 1);
    const chaseSpeed =
      this.difficulty.chaseSpeed * (lastStand ? this.difficulty.lastStandChaseMultiplier : 1);

    const toPlayerX = this.player.position.x - npc.x;
    const toPlayerZ = this.player.position.z - npc.z;
    const playerDistanceSq = toPlayerX * toPlayerX + toPlayerZ * toPlayerZ;
    const seesPlayer = playerDistanceSq <= detectionRadius * detectionRadius;

    if (seesPlayer) {
      npc.engaged = true;
      npc.lastKnownPlayerX = this.player.position.x;
      npc.lastKnownPlayerZ = this.player.position.z;
      npc.lastKnownTimer = LOST_PLAYER_MEMORY * (lastStand ? 1.2 : 1);
      npc.searchRemaining = Math.max(npc.searchRemaining, this.difficulty.searchDuration);
      this.planTactic(npc, playerDistanceSq, lastStand);

      if (npc.squadBroadcastCooldown === 0) {
        this.activateTeamContact(this.player.position, npc, lastStand ? 1.2 : 1);
        npc.squadBroadcastCooldown = MathUtils.randFloat(0.7, 1.15);
      }

      this.beginReaction(
        npc,
        playerDistanceSq <= attackRadius * attackRadius ? "attack" : "chase",
        reactionDelay,
      );
    } else if (npc.tacticTimer === 0 && npc.tacticMode === "cover") {
      npc.tacticMode = "flank";
      npc.tacticTimer = MathUtils.randFloat(0.8, 1.6);
    }

    if (!seesPlayer && npc.lastKnownTimer <= 0 && npc.searchRemaining <= 0 && npc.alertTimer <= 0) {
      this.pullIntoTeamFight(npc, lastStand);
    }

    if (npc.reactionRemaining > 0) {
      const targetX = seesPlayer ? this.player.position.x : npc.alertTargetX;
      const targetZ = seesPlayer ? this.player.position.z : npc.alertTargetZ;
      this.syncNpcTransform(npc, targetX - npc.x, targetZ - npc.z);
      npc.animation.setLocomotion("idle", lastStand);

      if (npc.reactionRemaining > 0) {
        return;
      }
    }

    if (npc.pendingState) {
      npc.state = npc.pendingState;
      npc.pendingState = null;
    }

    if (playerDistanceSq <= attackRadius * attackRadius && npc.state === "attack") {
      this.updateAttack(npc, toPlayerX, toPlayerZ, playerDistanceSq, lastStand);
      return;
    }

    if (npc.lastKnownTimer > 0) {
      npc.state = "chase";

      if (
        npc.tacticMode === "cover" &&
        playerDistanceSq > (this.difficulty.knifeAttackRadius + 1.5) ** 2 &&
        this.updateCover(npc, delta, chaseSpeed, lastStand)
      ) {
        return;
      }

      this.updateChase(npc, delta, npc.lastKnownPlayerX - npc.x, npc.lastKnownPlayerZ - npc.z, chaseSpeed, lastStand);
      return;
    }

    if (npc.searchRemaining > 0) {
      npc.state = "search";
      this.updateSearch(npc, delta, lastStand);
      return;
    }

    if (npc.alertTimer > 0) {
      npc.state = "investigate";
      this.updateInvestigate(npc, delta, lastStand);
      return;
    }

    npc.tacticMode = "none";
    npc.state = "patrol";
    this.updatePatrol(npc, delta);
  }

  beginReaction(npc, state, delay) {
    if (npc.state === state || npc.pendingState === state) {
      return;
    }

    npc.pendingState = state;
    npc.reactionRemaining = npc.reactionRemaining > 0
      ? Math.min(npc.reactionRemaining, delay)
      : delay;
  }

  isAggressiveDifficulty() {
    return this.difficultyKey !== "easy";
  }

  activateTeamContact(position, sourceNpc = null, strength = 1) {
    const memoryScale = this.difficultyKey === "tough"
      ? 1.45
      : this.difficultyKey === "normal"
        ? 1.14
        : 0.84;

    this.teamContact.active = true;
    this.teamContact.sourceIndex = sourceNpc?.index ?? -1;
    this.teamContact.x = position.x;
    this.teamContact.z = position.z;
    this.teamContact.timer = Math.max(
      this.teamContact.timer,
      this.difficulty.searchDuration * memoryScale * strength,
    );

    this.coordinateSquad(sourceNpc, position.x, position.z, strength);
  }

  coordinateSquad(sourceNpc, focusX, focusZ, strength = 1) {
    const supportRadius = this.difficultyKey === "tough"
      ? Number.POSITIVE_INFINITY
      : this.isAggressiveDifficulty()
        ? this.difficulty.groupAlertRadius * 3
        : this.difficulty.groupAlertRadius * 1.6;
    const supportRadiusSq = Number.isFinite(supportRadius) ? supportRadius * supportRadius : Infinity;
    const squad = [];

    for (const ally of this.npcs) {
      if (ally.isDisposed || ally.isDying) {
        continue;
      }

      if (sourceNpc) {
        const allyDistanceSq = distanceSquared2D(sourceNpc.x, sourceNpc.z, ally.x, ally.z);
        if (allyDistanceSq > supportRadiusSq) {
          continue;
        }
      }

      squad.push(ally);
    }

    squad.sort(
      (a, b) =>
        distanceSquared2D(a.x, a.z, focusX, focusZ) - distanceSquared2D(b.x, b.z, focusX, focusZ),
    );

    for (let slot = 0; slot < squad.length; slot += 1) {
      const ally = squad[slot];
      ally.engaged = true;
      ally.alertTargetX = focusX;
      ally.alertTargetZ = focusZ;
      ally.alertTimer = Math.max(ally.alertTimer, this.difficulty.alertMemory);
      ally.lastKnownPlayerX = focusX;
      ally.lastKnownPlayerZ = focusZ;
      ally.lastKnownTimer = Math.max(
        ally.lastKnownTimer,
        LOST_PLAYER_MEMORY * (this.isAggressiveDifficulty() ? 1.2 : 1),
      );
      ally.searchRemaining = Math.max(
        ally.searchRemaining,
        this.difficulty.searchDuration * (this.isAggressiveDifficulty() ? 1.08 : 0.9),
      );
      ally.searchPointX = focusX;
      ally.searchPointZ = focusZ;

      this.applyAssignedTactic(ally, this.chooseSquadRole(slot), focusX, focusZ);

      const wantsAttack =
        distanceSquared2D(ally.x, ally.z, focusX, focusZ) <= this.difficulty.gunAttackRadius ** 2;
      const delay = Math.max(
        0.06,
        ally.baseReactionDelay
          * this.difficulty.reactionDelayScale
          * (ally === sourceNpc ? 0.44 : 0.68)
          / Math.max(0.9, strength),
      );

      this.beginReaction(ally, wantsAttack ? "attack" : "chase", delay);
    }
  }

  chooseSquadRole(slot) {
    if (this.difficultyKey === "tough") {
      return ["rush", "flank", "cover", "flank", "rush", "cover"][slot % 6];
    }

    if (this.difficultyKey === "normal") {
      return ["flank", "rush", "cover", "rush", "flank"][slot % 5];
    }

    return slot === 0 ? "rush" : "flank";
  }

  applyAssignedTactic(npc, preferredRole, focusX, focusZ) {
    if (preferredRole === "cover") {
      const coverTarget = this.findCoverTarget(npc, focusX, focusZ);
      if (coverTarget) {
        npc.tacticMode = "cover";
        npc.coverTargetX = coverTarget.x;
        npc.coverTargetZ = coverTarget.z;
        npc.coverHoldRemaining = MathUtils.randFloat(0.7, 1.6);
        npc.tacticTimer = MathUtils.randFloat(1.4, 2.8);
        npc.avoidanceSign = coverTarget.sideSign;
        return;
      }

      preferredRole = npc.index % 2 === 0 ? "flank" : "rush";
    }

    if (preferredRole === "rush") {
      npc.tacticMode = "rush";
      npc.tacticTimer = MathUtils.randFloat(1, 2.1);
      npc.avoidanceSign = 0;
      return;
    }

    npc.tacticMode = "flank";
    npc.tacticTimer = MathUtils.randFloat(1.2, 2.4);
    npc.avoidanceSign = npc.avoidanceSign === 0
      ? Math.random() > 0.5 ? 1 : -1
      : npc.avoidanceSign;
  }

  pullIntoTeamFight(npc, lastStand) {
    if (!this.teamContact.active || !this.isAggressiveDifficulty()) {
      return false;
    }

    const joinRadius = this.difficultyKey === "tough" ? Number.POSITIVE_INFINITY : 72;
    if (
      Number.isFinite(joinRadius) &&
      distanceSquared2D(npc.x, npc.z, this.teamContact.x, this.teamContact.z) > joinRadius * joinRadius
    ) {
      return false;
    }

    npc.engaged = true;
    npc.alertTargetX = this.teamContact.x;
    npc.alertTargetZ = this.teamContact.z;
    npc.alertTimer = Math.max(npc.alertTimer, this.difficulty.alertMemory * 0.8);
    npc.lastKnownPlayerX = this.teamContact.x;
    npc.lastKnownPlayerZ = this.teamContact.z;
    npc.lastKnownTimer = Math.max(
      npc.lastKnownTimer,
      LOST_PLAYER_MEMORY * (lastStand ? 1.15 : 0.9),
    );
    npc.searchRemaining = Math.max(
      npc.searchRemaining,
      this.difficulty.searchDuration * (lastStand ? 1.15 : 0.9),
    );
    npc.searchPointX = this.teamContact.x;
    npc.searchPointZ = this.teamContact.z;

    if (npc.tacticMode === "none" || npc.tacticTimer <= 0.12) {
      this.applyAssignedTactic(
        npc,
        this.chooseSquadRole((npc.index + Math.floor(this.elapsed * 0.4)) % 6),
        this.teamContact.x,
        this.teamContact.z,
      );
    }

    this.beginReaction(
      npc,
      "chase",
      Math.max(
        0.08,
        npc.baseReactionDelay * this.difficulty.reactionDelayScale * (lastStand ? 0.52 : 0.68),
      ),
    );

    return true;
  }

  planTactic(npc, playerDistanceSq, lastStand) {
    if (lastStand) {
      npc.tacticMode = Math.random() < 0.7 ? "rush" : "flank";
      npc.tacticTimer = MathUtils.randFloat(1.1, 2);
      npc.avoidanceSign = Math.random() > 0.5 ? 1 : -1;
      return;
    }

    if (npc.tacticTimer > 0 && npc.tacticMode !== "none") {
      return;
    }

    if (playerDistanceSq < (this.difficulty.knifeAttackRadius + 4) ** 2) {
      npc.tacticMode = "rush";
      npc.tacticTimer = MathUtils.randFloat(0.9, 1.8);
      npc.avoidanceSign = 0;
      return;
    }

    const roll = Math.random();

    if (roll < this.difficulty.coverChance) {
      const coverTarget = this.findCoverTarget(npc, this.player.position.x, this.player.position.z);
      if (coverTarget) {
        npc.tacticMode = "cover";
        npc.coverTargetX = coverTarget.x;
        npc.coverTargetZ = coverTarget.z;
        npc.coverHoldRemaining = MathUtils.randFloat(0.6, 1.25);
        npc.tacticTimer = MathUtils.randFloat(1.8, 3.4);
        npc.avoidanceSign = coverTarget.sideSign;
        return;
      }
    }

    if (roll < this.difficulty.coverChance + this.difficulty.rushChance) {
      npc.tacticMode = "rush";
      npc.tacticTimer = MathUtils.randFloat(1.1, 2.1);
      npc.avoidanceSign = 0;
      return;
    }

    npc.tacticMode = "flank";
    npc.tacticTimer = MathUtils.randFloat(1.4, 2.6);
    npc.avoidanceSign = Math.random() > 0.5 ? 1 : -1;
  }

  alertNpc(npc, position, fromGroup) {
    npc.engaged = npc.engaged || this.isAggressiveDifficulty();
    npc.alertTargetX = position.x;
    npc.alertTargetZ = position.z;
    npc.alertTimer = this.difficulty.alertMemory;
    npc.searchRemaining = Math.max(
      npc.searchRemaining,
      this.difficulty.searchDuration * (fromGroup ? 0.75 : 1),
    );
    npc.searchPointX = position.x;
    npc.searchPointZ = position.z;

    if (npc.lastKnownTimer > 0) {
      return;
    }

    const delay = fromGroup
      ? Math.max(0.16, npc.baseReactionDelay * this.difficulty.reactionDelayScale * 0.72)
      : Math.max(0.2, npc.baseReactionDelay * this.difficulty.reactionDelayScale * 0.84);
    this.beginReaction(npc, "investigate", delay);
  }

  updatePatrol(npc, delta) {
    npc.animation.setCombatMode("gun");
    npc.patrolTimer -= delta;

    let toTargetX = npc.patrolTargetX - npc.x;
    let toTargetZ = npc.patrolTargetZ - npc.z;
    const targetDistanceSq = toTargetX * toTargetX + toTargetZ * toTargetZ;

    if (npc.patrolTimer <= 0 || targetDistanceSq < 2.2) {
      this.pickPatrolTarget(npc);
      toTargetX = npc.patrolTargetX - npc.x;
      toTargetZ = npc.patrolTargetZ - npc.z;
    }

    const moved = this.tryMove(npc, toTargetX, toTargetZ, this.difficulty.patrolSpeed, delta, 0.18);
    npc.animation.setLocomotion(moved ? "walk" : "idle");

    if (!moved) {
      this.pickPatrolTarget(npc);
    }
  }

  updateInvestigate(npc, delta, lastStand) {
    npc.animation.setCombatMode("gun");
    const toAlertX = npc.alertTargetX - npc.x;
    const toAlertZ = npc.alertTargetZ - npc.z;
    const alertDistanceSq = toAlertX * toAlertX + toAlertZ * toAlertZ;

    if (alertDistanceSq < 5) {
      npc.alertTimer = 0;
      npc.state = "patrol";
      npc.animation.setLocomotion("idle");
      this.pickPatrolTarget(npc);
      return;
    }

    const moved = this.tryMove(
      npc,
      toAlertX,
      toAlertZ,
      this.difficulty.patrolSpeed * (lastStand ? 1.35 : 1.15),
      delta,
      0.08,
    );
    npc.animation.setLocomotion(lastStand && moved ? "run" : moved ? "walk" : "idle", lastStand);

    if (!moved) {
      npc.alertTimer = Math.min(npc.alertTimer, 0.6);
    }
  }

  updateSearch(npc, delta, lastStand) {
    npc.animation.setCombatMode("gun");

    let toSearchX = npc.searchPointX - npc.x;
    let toSearchZ = npc.searchPointZ - npc.z;
    const searchDistanceSq = toSearchX * toSearchX + toSearchZ * toSearchZ;

    if (searchDistanceSq < 5 || npc.tacticTimer <= 0) {
      this.pickSearchTarget(npc);
      toSearchX = npc.searchPointX - npc.x;
      toSearchZ = npc.searchPointZ - npc.z;
    }

    const moved = this.tryMove(
      npc,
      toSearchX,
      toSearchZ,
      this.difficulty.patrolSpeed * (lastStand ? 1.55 : 1.28),
      delta,
      npc.avoidanceSign * (0.05 + this.difficulty.flankBias * 0.18),
    );

    npc.animation.setLocomotion(moved ? "run" : "idle", true);

    if (!moved) {
      npc.tacticTimer = 0;
      npc.avoidanceSign = npc.avoidanceSign === 0
        ? Math.random() > 0.5 ? 1 : -1
        : -npc.avoidanceSign;
    }
  }

  updateCover(npc, delta, chaseSpeed, lastStand) {
    npc.state = "cover";
    npc.animation.setCombatMode("gun");

    const toCoverX = npc.coverTargetX - npc.x;
    const toCoverZ = npc.coverTargetZ - npc.z;
    const coverDistanceSq = toCoverX * toCoverX + toCoverZ * toCoverZ;

    if (coverDistanceSq < 3.1) {
      npc.animation.setLocomotion("idle", true);

      if (npc.coverHoldRemaining <= 0 || npc.tacticTimer <= 0.2) {
        npc.tacticMode = "flank";
        npc.tacticTimer = MathUtils.randFloat(0.8, 1.5);
        npc.avoidanceSign = npc.avoidanceSign === 0 ? 1 : -npc.avoidanceSign;
      }

      return true;
    }

    const moved = this.tryMove(npc, toCoverX, toCoverZ, chaseSpeed * 0.96, delta, 0.02);
    npc.animation.setLocomotion(moved ? "run" : "idle", true);

    if (!moved) {
      npc.tacticMode = "rush";
      npc.tacticTimer = MathUtils.randFloat(0.9, 1.5);
    }

    return true;
  }

  updateChase(npc, delta, desiredX, desiredZ, chaseSpeed, lastStand) {
    npc.animation.setCombatMode("gun");

    const tacticMode = npc.tacticMode;
    const swayStrength = tacticMode === "flank"
      ? 0.22 + this.difficulty.flankBias
      : tacticMode === "rush"
        ? 0.04
        : 0.16 + this.difficulty.flankBias * 0.35;
    const swaySign = tacticMode === "flank" ? (npc.avoidanceSign || 1) : 1;
    const sway = Math.sin(this.elapsed * (tacticMode === "rush" ? 1.25 : 1.9) + npc.index)
      * swayStrength
      * swaySign;
    const moveSpeed = chaseSpeed * (tacticMode === "rush" ? this.difficulty.rushSpeedMultiplier : 1);
    const moved = this.tryMove(npc, desiredX, desiredZ, moveSpeed, delta, sway);

    npc.animation.setLocomotion(moved ? "run" : "idle", lastStand || tacticMode !== "none");

    if (!moved) {
      npc.avoidanceSign = npc.avoidanceSign === 0
        ? Math.random() > 0.5 ? 1 : -1
        : -npc.avoidanceSign;
      npc.avoidanceTimer = 0.45;
      if (tacticMode === "cover") {
        npc.tacticMode = "flank";
      }
    }
  }

  updateAttack(npc, toPlayerX, toPlayerZ, playerDistanceSq, lastStand) {
    this.syncNpcTransform(npc, toPlayerX, toPlayerZ);
    const knifeAttackRadius = this.difficulty.knifeAttackRadius * (lastStand ? 1.1 : 1);
    const usingKnife = playerDistanceSq <= knifeAttackRadius * knifeAttackRadius;
    const attackMode = usingKnife ? "knife" : "gun";

    npc.animation.setCombatMode(attackMode);
    npc.animation.setLocomotion("idle", lastStand);

    if (npc.attackCooldown > 0) {
      return;
    }

    npc.attackCooldown = (
      usingKnife
        ? this.difficulty.knifeAttackCooldown
        : this.difficulty.gunAttackCooldown
    ) * (lastStand ? 0.82 : 1) + MathUtils.randFloat(0.04, usingKnife ? 0.12 : 0.18);
    npc.animation.triggerAttack(attackMode);

    if (!usingKnife) {
      const coverHit = this.resolveGunCoverHit(npc);
      if (coverHit) {
        coverHit.object?.userData?.damageReceiver?.takeDamage(
          Math.max(18, this.difficulty.gunAttackDamage * 4),
        );
        this.onEnemyAttack?.({
          position: {
            x: npc.x,
            z: npc.z,
          },
          weapon: attackMode,
        });
        return;
      }
    }

    this.onPlayerDamaged(
      usingKnife
        ? lastStand ? this.difficulty.knifeAttackDamage + 2 : this.difficulty.knifeAttackDamage
        : lastStand ? this.difficulty.gunAttackDamage + 2 : this.difficulty.gunAttackDamage,
    );
    this.onEnemyAttack?.({
      position: {
        x: npc.x,
        z: npc.z,
      },
      weapon: attackMode,
    });
  }

  resolveGunCoverHit(npc) {
    const coverTargets = this.coverProvider?.();
    if (!coverTargets?.length) {
      return null;
    }

    this.rayOrigin.set(npc.x, 1.45, npc.z);
    this.rayDirection.set(
      this.player.position.x - npc.x,
      1.2 - this.rayOrigin.y,
      this.player.position.z - npc.z,
    );

    const distanceToPlayer = this.rayDirection.length();
    if (distanceToPlayer < 0.001) {
      return null;
    }

    this.rayDirection.divideScalar(distanceToPlayer);
    this.raycaster.far = Math.max(0, distanceToPlayer - 0.45);
    this.raycaster.set(this.rayOrigin, this.rayDirection);

    const hits = this.raycaster.intersectObjects(coverTargets, true);
    return hits[0] ?? null;
  }

  tryMove(npc, desiredX, desiredZ, speed, delta, lateralBias) {
    const desiredLength = Math.hypot(desiredX, desiredZ);
    if (desiredLength < 0.001) {
      return false;
    }

    let moveX = desiredX / desiredLength;
    let moveZ = desiredZ / desiredLength;
    const lateralAmount =
      lateralBias + npc.avoidanceSign * 0.58 * Math.max(0, npc.avoidanceTimer);
    const perpendicularX = -moveZ;
    const perpendicularZ = moveX;

    moveX += perpendicularX * lateralAmount;
    moveZ += perpendicularZ * lateralAmount;

    const steeredLength = Math.hypot(moveX, moveZ);
    moveX /= steeredLength;
    moveZ /= steeredLength;

    const step = speed * delta;
    const nextX = npc.x + moveX * step;
    const nextZ = npc.z + moveZ * step;

    if (this.canOccupy(npc, nextX, nextZ)) {
      npc.x = nextX;
      npc.z = nextZ;
      this.syncNpcTransform(npc, moveX, moveZ);
      this.trackFootstep(npc, step);
      return true;
    }

    const axisX = npc.x + moveX * step;
    if (this.canOccupy(npc, axisX, npc.z)) {
      npc.x = axisX;
      this.syncNpcTransform(npc, moveX, moveZ);
      this.trackFootstep(npc, step * 0.75);
      return true;
    }

    const axisZ = npc.z + moveZ * step;
    if (this.canOccupy(npc, npc.x, axisZ)) {
      npc.z = axisZ;
      this.syncNpcTransform(npc, moveX, moveZ);
      this.trackFootstep(npc, step * 0.75);
      return true;
    }

    return false;
  }

  trackFootstep(npc, distanceMoved) {
    const threshold = npc.state === "chase" ? 1.1 : 1.55;
    npc.stepAccumulator += distanceMoved;
    if (npc.stepAccumulator < threshold) {
      return;
    }

    npc.stepAccumulator = 0;
    this.onNpcFootstep?.({
      x: npc.x,
      z: npc.z,
    });
  }

  canOccupy(npc, x, z) {
    if (
      x < this.navBounds.minX ||
      x > this.navBounds.maxX ||
      z < this.navBounds.minZ ||
      z > this.navBounds.maxZ
    ) {
      return false;
    }

    if (this.isStaticCollision(x, z, NPC_RADIUS)) {
      return false;
    }

    for (const other of this.npcs) {
      if (other === npc || other.isDying || other.isDisposed) {
        continue;
      }

      if (distanceSquared2D(x, z, other.x, other.z) < (NPC_RADIUS * 2.05) ** 2) {
        return false;
      }
    }

    return true;
  }

  isStaticCollision(x, z, radius) {
    for (const box of this.collisionBoxes) {
      const nearestX = Math.max(box.min.x, Math.min(x, box.max.x));
      const nearestZ = Math.max(box.min.z, Math.min(z, box.max.z));
      const dx = x - nearestX;
      const dz = z - nearestZ;

      if (dx * dx + dz * dz < radius * radius) {
        return true;
      }
    }

    return false;
  }

  findCoverTarget(npc, playerX, playerZ) {
    let bestTarget = null;
    let bestScore = Infinity;
    const maxDistanceSq = this.difficulty.coverSearchRadius * this.difficulty.coverSearchRadius;

    for (const box of this.collisionBoxes) {
      const centerX = (box.min.x + box.max.x) * 0.5;
      const centerZ = (box.min.z + box.max.z) * 0.5;
      const fromPlayerX = centerX - playerX;
      const fromPlayerZ = centerZ - playerZ;
      const length = Math.hypot(fromPlayerX, fromPlayerZ);

      if (length < 0.001) {
        continue;
      }

      const dirX = fromPlayerX / length;
      const dirZ = fromPlayerZ / length;
      const halfWidth = (box.max.x - box.min.x) * 0.5;
      const halfDepth = (box.max.z - box.min.z) * 0.5;
      const offset = Math.max(halfWidth, halfDepth) + NPC_RADIUS + 1.1;
      const targetX = centerX + dirX * offset;
      const targetZ = centerZ + dirZ * offset;
      const distanceToNpcSq = distanceSquared2D(targetX, targetZ, npc.x, npc.z);
      const distanceToPlayerSq = distanceSquared2D(targetX, targetZ, playerX, playerZ);

      if (distanceToNpcSq > maxDistanceSq || distanceToPlayerSq < 20) {
        continue;
      }

      if (!this.canOccupy(npc, targetX, targetZ)) {
        continue;
      }

      const score = distanceToNpcSq + Math.abs(Math.sqrt(distanceToPlayerSq) - 14) * 4;
      if (score < bestScore) {
        bestScore = score;
        bestTarget = {
          sideSign: dirX + dirZ >= 0 ? 1 : -1,
          x: targetX,
          z: targetZ,
        };
      }
    }

    return bestTarget;
  }

  pickSearchTarget(npc) {
    for (let attempt = 0; attempt < 16; attempt += 1) {
      const candidateX =
        npc.lastKnownPlayerX + MathUtils.randFloatSpread(this.difficulty.searchRadius * 2);
      const candidateZ =
        npc.lastKnownPlayerZ + MathUtils.randFloatSpread(this.difficulty.searchRadius * 2);

      if (!this.canOccupy(npc, candidateX, candidateZ)) {
        continue;
      }

      npc.searchPointX = candidateX;
      npc.searchPointZ = candidateZ;
      npc.tacticTimer = MathUtils.randFloat(0.8, 1.7);
      npc.avoidanceSign = Math.random() > 0.5 ? 1 : -1;
      return;
    }

    npc.searchPointX = npc.lastKnownPlayerX;
    npc.searchPointZ = npc.lastKnownPlayerZ;
    npc.tacticTimer = 0.9;
  }

  pickPatrolTarget(npc) {
    for (let attempt = 0; attempt < 18; attempt += 1) {
      const offsetX = MathUtils.randFloatSpread(PATROL_RADIUS * 2);
      const offsetZ = MathUtils.randFloatSpread(PATROL_RADIUS * 2);
      const candidateX = npc.patrolOriginX + offsetX;
      const candidateZ = npc.patrolOriginZ + offsetZ;

      if (!this.canOccupy(npc, candidateX, candidateZ)) {
        continue;
      }

      npc.patrolTargetX = candidateX;
      npc.patrolTargetZ = candidateZ;
      npc.patrolTimer = MathUtils.randFloat(2.4, 4.8);
      return;
    }

    npc.patrolTargetX = npc.x;
    npc.patrolTargetZ = npc.z;
    npc.patrolTimer = 1.5;
  }

  syncNpcTransform(npc, directionX, directionZ) {
    npc.root.position.set(npc.x, npc.root.position.y, npc.z);

    if (directionX !== 0 || directionZ !== 0) {
      npc.root.rotation.y = Math.atan2(directionX, directionZ);
    }
  }

  applyDamage(npc, damageAmount, meta = {}) {
    if (npc.isDying || npc.isDisposed) {
      return { hit: false };
    }

    const finalDamage = meta.hitZone === "head"
      ? Math.max(damageAmount, this.difficulty.npcHealth)
      : damageAmount;
    npc.health = Math.max(0, npc.health - finalDamage);
    npc.engaged = true;
    npc.hitFlashRemaining = HIT_FLASH_DURATION;
    npc.lastKnownPlayerX = this.player.position.x;
    npc.lastKnownPlayerZ = this.player.position.z;
    npc.lastKnownTimer = LOST_PLAYER_MEMORY;
    npc.searchRemaining = Math.max(npc.searchRemaining, this.difficulty.searchDuration * 0.9);
    npc.tacticMode = "rush";
    npc.tacticTimer = MathUtils.randFloat(0.9, 1.6);
    npc.animation.triggerHit();
    this.activateTeamContact(this.player.position, npc, meta.hitZone === "head" ? 1.2 : 1.05);

    if (npc.health === 0) {
      this.startDeath(npc);
    } else {
      this.beginReaction(npc, "chase", Math.max(0.08, npc.baseReactionDelay * 0.4));
    }

    return {
      headshot: meta.hitZone === "head",
      hit: true,
      killed: npc.health === 0,
    };
  }

  updateHitFlash(npc, delta) {
    if (npc.hitFlashRemaining <= 0 || npc.isDisposed) {
      return;
    }

    npc.hitFlashRemaining = Math.max(0, npc.hitFlashRemaining - delta);
    const flashMix = npc.hitFlashRemaining / HIT_FLASH_DURATION;

    for (const material of npc.bodyMaterials) {
      material.emissive.setHex(HIT_FLASH_COLOR);
      material.emissiveIntensity = 0.3 + flashMix * 1.4;
    }

    if (npc.hitFlashRemaining === 0) {
      for (const material of npc.bodyMaterials) {
        material.emissive.setHex(0x000000);
        material.emissiveIntensity = 0;
      }
    }
  }

  startDeath(npc) {
    npc.isDying = true;
    npc.state = "dead";
    npc.deathRemaining = DEATH_DURATION;
    npc.animation.triggerDeath();
    this.onEnemyDefeated?.();
    this.notifyEnemyCount();
  }

  updateDeath(npc, delta) {
    npc.deathRemaining = Math.max(0, npc.deathRemaining - delta);
    const progress = 1 - npc.deathRemaining / DEATH_DURATION;

    for (const material of npc.bodyMaterials) {
      material.opacity = 1 - progress;
    }

    if (npc.deathRemaining === 0) {
      this.scene.remove(npc.root);
      npc.isDisposed = true;
    }
  }

  notifyEnemyCount() {
    this.onEnemyCountChange(this.getAliveCount());
  }
}

function resolveDifficultyKey(key) {
  return DIFFICULTY_SETTINGS[key] ? key : "normal";
}

function distanceSquared2D(ax, az, bx, bz) {
  const dx = ax - bx;
  const dz = az - bz;
  return dx * dx + dz * dz;
}
