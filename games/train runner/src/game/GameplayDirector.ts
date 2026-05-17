import { PHASE2_CONFIG, PHASE3_CONFIG } from './config';
import { DIFFICULTY_PROFILES, getRouteById } from './RouteConfig';
import { LANES } from './LaneUtils';
import { pseudoRandom } from './math';
import { EnemySystem } from './EnemySystem';
import { ObstacleSystem } from './ObstacleSystem';
import { PickupSystem } from './PickupSystem';
import { TrainSystem } from './TrainSystem';
import type { CoachCollider, DifficultyProfile, EnemyType, LaneIndex, ObstacleType, PickupType, RouteConfig, RunSegment, SpawnPattern } from './types';

export class GameplayDirector {
  private nextSpawnZ: number | null = null;
  private sectionIndex = 0;
  private route: RouteConfig = getRouteById('neon-express');
  private difficulty: DifficultyProfile = DIFFICULTY_PROFILES.easy;
  private routeTokensSpawned = 0;

  configureRoute(route: RouteConfig): void {
    this.route = route;
    this.difficulty = DIFFICULTY_PROFILES[route.difficulty];
    this.routeTokensSpawned = 0;
  }

  update(
    playerZ: number,
    distance: number,
    train: TrainSystem,
    obstacles: ObstacleSystem,
    enemies: EnemySystem,
    pickups: PickupSystem
  ): void {
    if (this.nextSpawnZ === null) {
      this.nextSpawnZ = playerZ + PHASE2_CONFIG.spawn.firstSpawnDistance;
    }

    while (this.nextSpawnZ < playerZ + PHASE2_CONFIG.spawn.lookAhead) {
      const coach = this.findCoachForSpawn(train, this.nextSpawnZ);
      if (!coach) {
        this.nextSpawnZ += PHASE2_CONFIG.spawn.sectionSpacing;
        continue;
      }

      const z = Math.max(coach.startZ + 3.4, Math.min(this.nextSpawnZ, coach.endZ - 4.2));
      const pattern = this.pickPattern(distance, this.sectionIndex);
      this.spawnPattern(pattern, coach, z, distance, obstacles, enemies, pickups);
      this.maybeSpawnRouteToken(coach, z, distance, pickups);
      this.sectionIndex += 1;
      this.nextSpawnZ = z + this.getSpacingFor(pattern);
    }
  }

  reset(playerZ: number, route: RouteConfig = this.route): void {
    this.configureRoute(route);
    this.nextSpawnZ = playerZ + PHASE2_CONFIG.spawn.firstSpawnDistance;
    this.sectionIndex = 0;
  }

  getSegment(distance: number): RunSegment {
    if (distance >= this.route.targetDistance) {
      return 'victory';
    }

    if (distance >= this.route.bossStartDistance) {
      return 'bossEncounter';
    }

    if (distance >= PHASE3_CONFIG.segments.eliteStart && distance < this.route.bossStartDistance - 120) {
      return 'eliteEncounter';
    }

    for (const event of this.route.setPieces) {
      if (distance >= event.start && distance <= event.end) {
        return event.type === 'tunnelRush' ? 'tunnelRush' : 'sideTrain';
      }
    }

    if (distance >= 165) {
      return 'enemyEncounter';
    }

    if (distance >= 75) {
      return 'obstacleChallenge';
    }

    return 'warmup';
  }

  private spawnPattern(
    pattern: SpawnPattern,
    coach: CoachCollider,
    z: number,
    distance: number,
    obstacles: ObstacleSystem,
    enemies: EnemySystem,
    pickups: PickupSystem
  ): void {
    const seed = this.sectionIndex + Math.floor(distance * 0.13);
    const lane = this.pickLane(seed);
    const altLane = this.pickLane(seed + 4);

    if (pattern === 'calm') {
      return;
    }

    if (pattern === 'recovery') {
      pickups.spawnLine(coach, z, lane, 'coin', 4);
      return;
    }

    if (pattern === 'pickup') {
      pickups.spawnLine(coach, z, lane, pseudoRandom(seed) > 0.82 ? 'energy' : 'coin', 5);
      if (distance > 170 && pseudoRandom(seed + 3) > 0.9) {
        pickups.spawn(coach, Math.min(z + 6.5, coach.endZ - 3.2), altLane, 'shield');
      }
      return;
    }

    if (pattern === 'obstacle') {
      obstacles.spawn(coach, z, this.pickObstacle(seed, distance), lane, this.pickLane(seed + 8));
      this.spawnRewardLineAfter(coach, z, altLane, pickups);
      return;
    }

    if (pattern === 'enemy') {
      enemies.spawn(coach, z, lane, this.pickEnemy(seed, distance));
      pickups.spawnLine(coach, Math.min(z + 5.4, coach.endZ - 3.8), altLane, 'coin', 3);
      return;
    }

    obstacles.spawn(coach, z, this.pickObstacle(seed, distance), lane, this.pickLane(seed + 9));
    const enemyZ = Math.min(z + 7.4, coach.endZ - 4.2);
    if (enemyZ > z + 4.5) {
      enemies.spawn(coach, enemyZ, altLane, this.pickEnemy(seed + 2, distance));
    }
  }

  private spawnRewardLineAfter(coach: CoachCollider, z: number, lane: LaneIndex, pickups: PickupSystem): void {
    const pickupZ = z + 4.2;
    if (pickupZ < coach.endZ - 3.2) {
      pickups.spawnLine(coach, pickupZ, lane, 'coin', this.difficulty.pickupGenerosity > 1 ? 4 : 3);
    }
  }

  private maybeSpawnRouteToken(coach: CoachCollider, z: number, distance: number, pickups: PickupSystem): void {
    if (this.routeTokensSpawned >= this.route.tokenCount) {
      return;
    }

    const targetDistance = ((this.routeTokensSpawned + 1) / (this.route.tokenCount + 1)) * this.route.targetDistance;
    if (distance < targetDistance - 25) {
      return;
    }

    const lane = LANES[(this.routeTokensSpawned * 2 + this.sectionIndex) % LANES.length] ?? 0;
    const tokenZ = Math.min(z + 3.2, coach.endZ - 3.4);
    pickups.spawn(coach, tokenZ, lane, 'routeToken');
    this.routeTokensSpawned += 1;
  }

  private pickPattern(distance: number, index: number): SpawnPattern {
    const segment = this.getSegment(distance);

    if (segment === 'bossEncounter' || segment === 'victory') {
      return index % 3 === 0 ? 'pickup' : 'recovery';
    }

    if (segment === 'eliteEncounter') {
      return ['pickup', 'recovery', 'obstacle'][index % 3] as SpawnPattern;
    }

    if (segment === 'tunnelRush') {
      return ['obstacle', 'pickup', 'recovery'][index % 3] as SpawnPattern;
    }

    if (segment === 'sideTrain') {
      return ['enemy', 'pickup', 'mixed', 'recovery'][index % 4] as SpawnPattern;
    }

    if (distance < 45) {
      return index % 3 === 0 ? 'pickup' : 'calm';
    }

    if (distance < 110) {
      return ['obstacle', 'pickup', 'recovery'][index % 3] as SpawnPattern;
    }

    if (distance < 220) {
      return this.difficulty.enemyFrequency > 1.05
        ? (['obstacle', 'enemy', 'pickup', 'mixed', 'recovery'][index % 5] as SpawnPattern)
        : (['obstacle', 'enemy', 'pickup', 'recovery'][index % 4] as SpawnPattern);
    }

    return this.difficulty.mixedFrequency > 1.1
      ? (['mixed', 'obstacle', 'enemy', 'pickup', 'mixed', 'recovery'][index % 6] as SpawnPattern)
      : (['mixed', 'pickup', 'obstacle', 'enemy', 'recovery'][index % 5] as SpawnPattern);
  }

  private getSpacingFor(pattern: SpawnPattern): number {
    let spacing: number = PHASE2_CONFIG.spawn.sectionSpacing;
    if (pattern === 'mixed') {
      spacing = 24;
    } else if (pattern === 'enemy') {
      spacing = 22;
    } else if (pattern === 'recovery' || pattern === 'pickup') {
      spacing = 17;
    }

    return spacing * this.difficulty.spawnSpacingMultiplier;
  }

  private pickObstacle(seed: number, distance: number): ObstacleType {
    const early: ObstacleType[] = ['lowBarrier', 'roofCrate', 'brokenPanel'];
    const full = this.route.allowedObstacleTypes;
    const list = distance < 105 ? early.filter((type) => full.includes(type)) : full;
    return list[Math.floor(pseudoRandom(seed + 12) * list.length)] ?? 'roofCrate';
  }

  private pickEnemy(seed: number, distance: number): EnemyType {
    if (distance > 260 && this.route.allowedEnemyTypes.includes('shield') && pseudoRandom(seed + 5) > 0.72) {
      return 'shield';
    }

    if (distance > 135 && this.route.allowedEnemyTypes.includes('runner') && pseudoRandom(seed + 2) > 0.48) {
      return 'runner';
    }

    return this.route.allowedEnemyTypes.includes('laneBlocker') ? 'laneBlocker' : (this.route.allowedEnemyTypes[0] ?? 'laneBlocker');
  }

  private pickLane(seed: number): LaneIndex {
    return LANES[Math.floor(pseudoRandom(seed + 99) * LANES.length)] ?? 0;
  }

  private findCoachForSpawn(train: TrainSystem, z: number): CoachCollider | null {
    return (
      train.coaches.find((coach) => z >= coach.startZ + 3.2 && z <= coach.endZ - 4.2) ??
      train.coaches.find((coach) => coach.startZ > z + 1.5) ??
      null
    );
  }
}
