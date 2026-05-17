import * as THREE from 'three';
import { AI_PROFILES } from '../config.js';
import { clamp, shortestAngleDelta, vectorToAngle } from '../utils/math.js';

function escapeState(isThreatened, hasSpace) {
  if (isThreatened) return 'UseAbility';
  if (hasSpace) return 'Evade';
  return 'ReturnToRoad';
}

export class AIController {
  constructor({ vehicle, mode, city, targetResolver, profile = null, aggressionScale = null }) {
    this.vehicle = vehicle;
    this.mode = mode;
    this.profileName = profile || (mode === 'escape' ? 'escape' : 'chaser');
    this.profile = { ...(AI_PROFILES[this.profileName] || AI_PROFILES.chaser) };
    this.profile.aggression *= aggressionScale ?? vehicle.aiAggressionScale ?? 1;
    this.city = city;
    this.targetResolver = targetResolver;
    this.waypoint = city.nearestWaypoint(vehicle.group.position);
    this.stuckTimer = 0;
    this.reverseTimer = 0;
    this.replanTimer = 0;
    this.state = mode === 'escape' ? 'Evade' : 'Chase';
  }

  update(dt, vehicles) {
    const vehicle = this.vehicle;
    if (vehicle.destroyed) return this.emptyInput();
    const target = this.targetResolver?.();
    if (!target || target.destroyed) return this.patrolInput(dt);

    this.replanTimer -= dt;
    const targetPoint = this.chooseTargetPoint(target, vehicles);
    const delta = targetPoint.clone().sub(vehicle.group.position);
    delta.y = 0;
    const distance = delta.length();
    const desiredYaw = vectorToAngle(delta);
    const yawDelta = shortestAngleDelta(vehicle.yaw, desiredYaw);

    const steer = clamp(-yawDelta * 1.35, -1, 1);
    const absTurn = Math.abs(yawDelta);
    let throttle = absTurn > 1.55 ? 0.25 : this.profile.aggression;
    let brake = absTurn > 1.45 * this.profile.turnCaution && vehicle.speed > 15;
    let handbrake = absTurn > 1.28 && vehicle.speed > 20;

    if (this.reverseTimer > 0) {
      this.reverseTimer -= dt;
      this.state = 'Recover';
      throttle = -1;
      brake = true;
      handbrake = false;
    }

    if (vehicle.speed < 2 && throttle > 0 && distance > 10) {
      this.stuckTimer += dt;
      if (this.stuckTimer > 2.1) {
        this.reverseTimer = 0.8;
        this.stuckTimer = 0;
      }
    } else {
      this.stuckTimer = Math.max(0, this.stuckTimer - dt * 2);
    }

    const targetDistance = vehicle.group.position.distanceTo(target.group.position);
    const aligned = Math.abs(vehicle.facePoint(target.group.position)) < 0.32;
    const chaseMode = this.mode !== 'escape';
    const closeRam = chaseMode && targetDistance < this.profile.ramRange;
    if (this.reverseTimer <= 0) {
      if (!chaseMode) this.state = escapeState(targetDistance < 38, targetDistance > 70);
      else if (this.profileName === 'blocker') this.state = 'Intercept';
      else if (closeRam) this.state = 'Attack';
      else this.state = 'Chase';
    }

    return {
      throttle,
      brake,
      steer: closeRam && this.profileName === 'rammer' ? clamp(steer * 1.18, -1, 1) : steer,
      handbrake: handbrake || (closeRam && this.profileName === 'rammer'),
      nitro: this.mode === 'escape' ? targetDistance < 48 : targetDistance > 34 && aligned,
      primary: chaseMode && targetDistance < 42 && aligned,
      secondary: chaseMode
        ? targetDistance < 54 && aligned
        : targetDistance < 34 && this.vehicle.secondaryCooldown <= 0,
      reset: false,
    };
  }

  chooseTargetPoint(target, vehicles) {
    const vehicle = this.vehicle;
    const targetDistance = vehicle.group.position.distanceTo(target.group.position);
    if (this.mode === 'chase' && targetDistance < 38 && this.city.isOnRoad(target.group.position, 12) && this.profileName !== 'blocker') {
      return target.group.position.clone().add(this.getProfileOffset(target));
    }

    if (!this.waypoint || vehicle.group.position.distanceTo(this.waypoint.position) < 9 || this.replanTimer <= 0) {
      this.replanTimer = 0.7 + Math.random() * 0.45;
      const base = this.city.nearestWaypoint(vehicle.group.position);
      const candidates = base.neighbors.length ? base.neighbors : [base];
      this.waypoint = this.pickWaypoint(candidates, target, vehicles);
    }

    return this.waypoint.position.clone().add(this.getProfileOffset(target));
  }

  getProfileOffset(target) {
    const offset = new THREE.Vector3();
    const targetForward = target.getForward ? target.getForward() : new THREE.Vector3(0, 0, 1);
    const targetRight = target.getRight ? target.getRight() : new THREE.Vector3(1, 0, 0);
    if (this.profile.leadDistance) offset.addScaledVector(targetForward, this.profile.leadDistance);
    if (this.profile.sideOffset) {
      const side = this.vehicle.id.length % 2 === 0 ? 1 : -1;
      offset.addScaledVector(targetRight, this.profile.sideOffset * side);
    }
    return offset;
  }

  pickWaypoint(candidates, target, vehicles) {
    let best = candidates[0];
    let bestScore = this.mode === 'escape' ? -Infinity : Infinity;
    const police = vehicles.filter((item) => item.faction === 'police' && !item.destroyed);
    const center = new THREE.Vector3();
    for (const item of police) center.add(item.group.position);
    if (police.length) center.multiplyScalar(1 / police.length);

    for (const candidate of candidates) {
      const targetDistance = candidate.position.distanceTo(target.group.position);
      if (this.mode === 'escape') {
        const threatDistance = police.length ? candidate.position.distanceTo(center) : targetDistance;
        const openRoadBonus = candidate.neighbors.length * 4;
        const damagedBonus = this.vehicle.health / this.vehicle.maxHealth < 0.45 ? targetDistance * 0.55 : targetDistance * 0.2;
        const score = threatDistance + damagedBonus + openRoadBonus + Math.random() * 8;
        if (score > bestScore) {
          bestScore = score;
          best = candidate;
        }
      } else {
        const blockerBonus = this.profileName === 'blocker' ? -Math.abs(targetDistance - 42) : targetDistance;
        const score = blockerBonus - candidate.neighbors.length * 2 + Math.random() * 7;
        if (score < bestScore) {
          bestScore = score;
          best = candidate;
        }
      }
    }
    return best;
  }

  patrolInput(dt) {
    if (!this.waypoint || this.vehicle.group.position.distanceTo(this.waypoint.position) < 8) {
      const base = this.city.nearestWaypoint(this.vehicle.group.position);
      this.waypoint = base.neighbors[Math.floor(Math.random() * Math.max(1, base.neighbors.length))] || base;
    }
    const delta = this.waypoint.position.clone().sub(this.vehicle.group.position);
    const yawDelta = shortestAngleDelta(this.vehicle.yaw, vectorToAngle(delta));
    return {
      throttle: 0.75,
      brake: false,
      steer: clamp(-yawDelta * 1.3, -1, 1),
      handbrake: false,
      nitro: false,
      primary: false,
      secondary: false,
      reset: false,
    };
  }

  emptyInput() {
    return {
      throttle: 0,
      brake: false,
      steer: 0,
      handbrake: false,
      nitro: false,
      primary: false,
      secondary: false,
      reset: false,
    };
  }
}
