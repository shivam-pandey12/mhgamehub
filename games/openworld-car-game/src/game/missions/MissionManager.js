import * as THREE from '../../vendor/three.js';
import {
  MISSION_CONFIGS,
  getMedalForTime,
  getMissionById,
  getRankForScore
} from '../../config/missions.js';
import { clamp, formatTime, pointInRotatedRect, shortestAngleDelta, vec2Distance } from '../utils/math.js';

export class MissionManager {
  constructor(scene, saveManager, audioManager, surfaceResolver = null) {
    this.scene = scene;
    this.saveManager = saveManager;
    this.audioManager = audioManager;
    this.surfaceResolver = surfaceResolver;
    this.group = new THREE.Group();
    this.group.name = 'Mission Markers';
    this.scene.add(this.group);
    this.active = null;
    this.pendingResult = null;
    this.marker = this.createMarker('#f0c766');
    this.secondaryMarker = this.createMarker('#5ec6ff');
    this.zoneMarker = this.createZoneMarker('#62d28f');
    this.group.add(this.marker, this.secondaryMarker, this.zoneMarker);
    this.hideMarkers();
  }

  createMarker(color) {
    const marker = new THREE.Group();
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.4, 0.12, 10, 54),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.86 })
    );
    ring.rotation.x = Math.PI * 0.5;
    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 5.4, 12),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.38 })
    );
    pillar.position.y = 2.7;
    marker.add(ring, pillar);
    marker.visible = false;
    return marker;
  }

  createZoneMarker(color) {
    const marker = new THREE.Group();
    marker.userData.material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.28 });
    marker.visible = false;
    return marker;
  }

  rebuildZoneMarker(zone, color = '#62d28f') {
    this.zoneMarker.clear();
    this.zoneMarker.userData.material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.28
    });
    const outline = new THREE.Mesh(
      new THREE.BoxGeometry(zone.size[0], 0.08, zone.size[1]),
      this.zoneMarker.userData.material
    );
    outline.position.y = 0.12;
    this.zoneMarker.add(outline);
    const coneMat = new THREE.MeshStandardMaterial({ color: '#f28f38', roughness: 0.5 });
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.1, 12), coneMat);
      cone.position.set(sx * zone.size[0] * 0.55, 0.55, sz * zone.size[1] * 0.55);
      cone.castShadow = true;
      this.zoneMarker.add(cone);
    });
    this.zoneMarker.position.set(zone.center[0], this.getSurfaceHeightForPoint(zone.center) + 0.02, zone.center[1]);
    this.zoneMarker.rotation.y = zone.rotation;
  }

  getSurfaceHeightForPoint(point) {
    if (!this.surfaceResolver?.getSurfaceInfo) return 0;
    const surface = this.surfaceResolver.getSurfaceInfo(new THREE.Vector3(point[0], 0, point[1]), null, { preferElevated: true });
    return surface?.surfaceHeight ?? 0;
  }

  placePointMarker(marker, point, lift = 0.12) {
    marker.position.set(point[0], this.getSurfaceHeightForPoint(point) + lift, point[1]);
  }

  hideMarkers() {
    this.marker.visible = false;
    this.secondaryMarker.visible = false;
    this.zoneMarker.visible = false;
  }

  start(id, context = {}) {
    this.pendingResult = null;
    if (id === 'freeDrive') {
      this.active = null;
      this.hideMarkers();
      return null;
    }
    const config = getMissionById(id) ?? MISSION_CONFIGS[id] ?? MISSION_CONFIGS.timeTrial;
    const timer = config.timer ?? ((config.medalTimes?.Bronze ?? 75) + 25);
    this.active = {
      id: config.id,
      type: config.type,
      config,
      timer,
      elapsed: 0,
      phase: ['delivery', 'taxi'].includes(config.type) ? 'pickup' : 'running',
      checkpointIndex: 0,
      condition: 100,
      comfort: 100,
      collisions: 0,
      hold: 0,
      score: 0,
      driftScore: 0,
      multiplier: 1,
      comboBreak: '',
      completed: false,
      failed: false,
      resets: 0,
      context,
      lastCollisionPulse: 0,
      lastMessagePulse: 0
    };
    this.updateMarkers();
    return config.start;
  }

  noteReset() {
    if (this.active) this.active.resets += 1;
  }

  update(dt, player, telemetry) {
    if (!this.active) return this.getFreeDriveHud();

    const mission = this.active;
    mission.timer -= dt;
    mission.elapsed += dt;
    mission.lastCollisionPulse = Math.max(0, mission.lastCollisionPulse - dt);
    mission.lastMessagePulse = Math.max(0, mission.lastMessagePulse - dt);

    if (telemetry.collisionIntensity > 0.35 && mission.lastCollisionPulse <= 0) {
      mission.collisions += 1;
      mission.lastCollisionPulse = 0.8;
      if (mission.type === 'delivery') mission.condition = Math.max(0, mission.condition - mission.config.crashDamage);
      if (mission.type === 'taxi') mission.comfort = Math.max(0, mission.comfort - mission.config.comfortLoss);
      if (mission.type === 'drift') {
        mission.multiplier = 1;
        mission.comboBreak = 'Combo broken';
      }
    }

    if (mission.type === 'timeTrial') this.updateTimeTrial(player, mission);
    if (mission.type === 'delivery') this.updateDelivery(dt, player, telemetry, mission);
    if (mission.type === 'parking') this.updateParking(dt, player, mission);
    if (mission.type === 'drift') this.updateDrift(dt, player, telemetry, mission);
    if (mission.type === 'taxi') this.updateTaxi(dt, player, telemetry, mission);

    if (this.pendingResult) {
      const result = this.pendingResult;
      this.pendingResult = null;
      return { result };
    }

    if (mission.timer <= 0) {
      if (mission.type === 'drift' && mission.driftScore >= mission.config.targetScore) {
        return this.complete('Target score reached');
      }
      return this.fail('Timer ended');
    }
    if (mission.type === 'delivery' && mission.condition <= 0) return this.fail('Package condition reached 0');
    if (mission.type === 'taxi' && mission.comfort <= 0) return this.fail('Passenger comfort reached 0');

    this.pulseMarkers(dt);
    return this.getHudData(player.position);
  }

  updateTimeTrial(player, mission) {
    const target = mission.config.checkpoints[mission.checkpointIndex];
    if (vec2Distance([player.position.x, player.position.z], target) < 5.5) {
      this.audioManager.play('checkpoint', 0.9);
      mission.checkpointIndex += 1;
      mission.score += 80;
      if (mission.checkpointIndex >= mission.config.checkpoints.length) {
        this.complete('Route cleared');
      } else {
        this.updateMarkers();
      }
    }
  }

  updateDelivery(dt, player, telemetry, mission) {
    if (telemetry.offRoad && telemetry.speed > 8) {
      mission.condition = Math.max(0, mission.condition - mission.config.roughDamagePerSecond * dt);
    }
    const target = mission.phase === 'pickup' ? mission.config.pickup : mission.config.destination;
    if (vec2Distance([player.position.x, player.position.z], target) < 5.8) {
      if (mission.phase === 'pickup') {
        mission.phase = 'deliver';
        this.audioManager.play('checkpoint', 0.9);
        this.updateMarkers();
      } else {
        this.complete('Package delivered');
      }
    }
  }

  updateTaxi(dt, player, telemetry, mission) {
    if (!telemetry.drifting && telemetry.collisionIntensity < 0.05 && telemetry.speed > 4 && telemetry.speed < 24) {
      mission.comfort = Math.min(100, mission.comfort + dt * 1.2);
      mission.score += dt * 7;
    }
    const target = mission.phase === 'pickup' ? mission.config.pickup : mission.config.destination;
    if (vec2Distance([player.position.x, player.position.z], target) < 5.8) {
      if (mission.phase === 'pickup') {
        mission.phase = 'ride';
        this.audioManager.play('checkpoint', 0.9);
        mission.comboBreak = mission.config.messages?.[0] ?? 'Passenger picked up';
        this.updateMarkers();
      } else {
        this.complete('Passenger arrived');
      }
    }
    if (mission.phase === 'ride' && mission.lastMessagePulse <= 0) {
      const messages = mission.config.messages ?? [];
      if (messages.length) mission.comboBreak = messages[Math.floor(Math.random() * messages.length)];
      mission.lastMessagePulse = 9;
    }
  }

  updateParking(dt, player, mission) {
    const zone = mission.config.zone;
    const center = new THREE.Vector3(zone.center[0], 0, zone.center[1]);
    const size = new THREE.Vector3(zone.size[0], 0, zone.size[1]);
    const inside = pointInRotatedRect(player.position, center, size, zone.rotation);
    const speed = player.velocity.length();
    const speedOk = speed < 2.2;
    const angleDelta = Math.abs(shortestAngleDelta(player.heading, zone.rotation));
    const angleOk = angleDelta < 0.58;
    const centerDistance = player.position.distanceTo(center);
    mission.accuracy = clamp(100 - centerDistance * 9 - angleDelta * 38 - speed * 7, 0, 100);
    if (inside && speedOk && angleOk) mission.hold += dt;
    else mission.hold = Math.max(0, mission.hold - dt * 1.6);
    if (mission.hold >= zone.holdTime) this.complete('Parked cleanly');
  }

  updateDrift(dt, player, telemetry, mission) {
    const zone = mission.config.zone;
    const center = new THREE.Vector3(zone.center[0], 0, zone.center[1]);
    const size = new THREE.Vector3(zone.size[0], 0, zone.size[1]);
    const inside = pointInRotatedRect(player.position, center, size, zone.rotation);
    mission.insideZone = inside;
    if (!inside) {
      mission.multiplier = Math.max(1, mission.multiplier - dt * 0.8);
      return;
    }
    if (telemetry.drifting) {
      mission.multiplier = clamp(mission.multiplier + dt * 0.22, 1, 4);
      const angleScore = telemetry.driftScore * (1.8 + telemetry.speedRatio * 2.2) * mission.multiplier;
      mission.driftScore += angleScore;
      mission.score += angleScore;
    } else {
      mission.multiplier = Math.max(1, mission.multiplier - dt * 0.35);
    }
    if (mission.driftScore >= mission.config.targetScore) this.complete('Drift target cleared');
  }

  complete(reason) {
    if (!this.active || this.active.completed) return this.getHudData();
    const mission = this.active;
    mission.completed = true;
    const result = this.createResult(true, reason);
    const record = this.saveManager.recordMission(mission.id, result.score, result.coinsEarned, {
      type: mission.type,
      success: true,
      xp: result.xpEarned,
      medal: result.medal,
      timeSeconds: mission.type === 'timeTrial' ? mission.elapsed : undefined,
      carId: mission.context?.carId,
      bonusObjectives: result.bonusObjectives
    });
    result.isBest = record.isBest;
    result.levelUp = record.levelUp;
    this.audioManager.play('complete', 1);
    this.hideMarkers();
    this.active = null;
    this.pendingResult = result;
    return { result };
  }

  fail(reason) {
    if (!this.active || this.active.failed) return this.getHudData();
    const result = this.createResult(false, reason);
    this.audioManager.play('fail', 1);
    this.hideMarkers();
    this.active = null;
    this.pendingResult = result;
    return { result };
  }

  createResult(success, reason) {
    const mission = this.active;
    const remaining = Math.max(0, mission.timer);
    const medal = mission.type === 'timeTrial' && success ? getMedalForTime(mission.config, mission.elapsed) : null;
    let score = success ? mission.config.reward * 4 : 90;
    score += remaining * 6;
    score -= mission.collisions * 55;
    if (mission.type === 'timeTrial') score += mission.checkpointIndex * 80 + (medal === 'S' ? 240 : medal === 'Gold' ? 180 : medal === 'Silver' ? 90 : 40);
    if (mission.type === 'delivery') score += mission.condition * 4;
    if (mission.type === 'taxi') score += mission.comfort * 4;
    if (mission.type === 'parking') score += (mission.accuracy ?? 0) * 5;
    if (mission.type === 'drift') score += mission.driftScore * 0.45;
    const bonusObjectives = this.evaluateBonusObjectives(mission, success);
    const bonusCompleted = bonusObjectives.filter((objective) => objective.complete).length;
    score += bonusCompleted * 45;
    score = Math.max(0, Math.round(score));

    const rank = getRankForScore(score);
    const coinsEarned = success ? Math.max(15, Math.round(score / 18) + bonusCompleted * 4) : Math.round(score / 40);
    const bestBefore = this.saveManager.data.bestScores[mission.id] ?? 0;
    const xpEarned = success ? mission.config.xp + Math.round(score / 30) + bonusCompleted * 10 : Math.round((mission.config.xp ?? 60) * 0.25);
    return {
      missionId: mission.id,
      missionType: mission.type,
      missionName: mission.config.name,
      routeId: mission.id,
      success,
      reason,
      time: formatTime(mission.elapsed),
      remaining: formatTime(remaining),
      timeSeconds: mission.elapsed,
      score,
      rank,
      medal,
      xpEarned,
      coinsEarned,
      bestBefore,
      isBest: score > bestBefore,
      collisions: mission.collisions,
      condition: Math.round(mission.condition),
      comfort: Math.round(mission.comfort),
      driftScore: Math.round(mission.driftScore),
      bonusObjectives,
      masteryXp: 0,
      newUnlocks: [],
      checkpointProgress: mission.type === 'timeTrial'
        ? `${mission.checkpointIndex}/${mission.config.checkpoints.length}`
        : null
    };
  }

  evaluateBonusObjectives(mission, success) {
    const objectives = [
      {
        id: 'no-major-crash',
        label: 'No major crash',
        complete: success && mission.collisions === 0
      },
      {
        id: 'recommended-car',
        label: `Use recommended car: ${mission.config.recommendedCar ?? 'Any'}`,
        complete: success && (
          !mission.config.recommendedCar
          || mission.context?.carName === mission.config.recommendedCar
          || mission.context?.shortName === mission.config.recommendedCar
        )
      },
      {
        id: 'no-reset',
        label: 'Complete without reset',
        complete: success && mission.resets === 0
      }
    ];

    if (mission.type === 'timeTrial') {
      objectives.push({
        id: 'target-time',
        label: `Finish under ${formatTime(mission.config.medalTimes?.Gold ?? mission.timer)}`,
        complete: success && mission.elapsed <= (mission.config.medalTimes?.Gold ?? Infinity)
      });
    }
    if (mission.type === 'delivery') {
      objectives.push({
        id: 'condition-80',
        label: 'Keep package above 80%',
        complete: success && mission.condition >= 80
      });
    }
    if (mission.type === 'taxi') {
      objectives.push({
        id: 'comfort-90',
        label: 'Keep comfort above 90%',
        complete: success && mission.comfort >= 90
      });
    }
    if (mission.type === 'parking') {
      objectives.push({
        id: 'accuracy-95',
        label: 'Park with 95% accuracy',
        complete: success && (mission.accuracy ?? 0) >= 95
      });
    }
    if (mission.type === 'drift') {
      objectives.push({
        id: 'drift-target-plus',
        label: 'Beat drift target by 20%',
        complete: success && mission.driftScore >= mission.config.targetScore * 1.2
      });
    }
    return objectives;
  }

  updateMarkers() {
    this.hideMarkers();
    if (!this.active) return;
    const mission = this.active;
    if (mission.type === 'timeTrial') {
      const target = mission.config.checkpoints[mission.checkpointIndex];
      this.marker.visible = true;
      this.placePointMarker(this.marker, target);
    }
    if (mission.type === 'delivery' || mission.type === 'taxi') {
      const pickup = mission.config.pickup;
      const destination = mission.config.destination;
      this.marker.visible = mission.phase === 'pickup';
      this.placePointMarker(this.marker, pickup);
      this.secondaryMarker.visible = mission.phase !== 'pickup';
      this.placePointMarker(this.secondaryMarker, destination);
    }
    if (mission.type === 'parking') {
      this.rebuildZoneMarker(mission.config.zone, '#62d28f');
      this.zoneMarker.visible = true;
    }
    if (mission.type === 'drift') {
      this.rebuildZoneMarker(mission.config.zone, '#f0c766');
      this.zoneMarker.visible = true;
    }
  }

  pulseMarkers(dt) {
    [this.marker, this.secondaryMarker, this.zoneMarker].forEach((marker) => {
      if (!marker.visible) return;
      const pulse = 1 + Math.sin(performance.now() * 0.005) * 0.08;
      marker.scale.setScalar(pulse);
      marker.rotation.y += dt * 0.35;
    });
  }

  getTargetPosition() {
    if (!this.active) return null;
    const mission = this.active;
    if (mission.type === 'timeTrial') return mission.config.checkpoints[mission.checkpointIndex];
    if (mission.type === 'delivery' || mission.type === 'taxi') {
      return mission.phase === 'pickup' ? mission.config.pickup : mission.config.destination;
    }
    if (mission.type === 'parking' || mission.type === 'drift') return mission.config.zone.center;
    return null;
  }

  getHudData(playerPosition = null) {
    if (!this.active) return this.getFreeDriveHud();
    const mission = this.active;
    const target = this.getTargetPosition();
    const distance = playerPosition && target
      ? Math.round(vec2Distance([playerPosition.x, playerPosition.z], target))
      : 0;
    const data = {
      active: true,
      missionType: mission.type,
      mode: mission.config.name,
      objective: mission.config.description,
      timer: formatTime(mission.timer),
      distance,
      condition: null,
      comfort: null,
      progress: null,
      accuracy: null,
      driftScore: null,
      multiplier: null,
      combo: mission.comboBreak,
      target
    };

    if (mission.type === 'timeTrial') {
      data.progress = `${mission.checkpointIndex + 1}/${mission.config.checkpoints.length}`;
      data.objective = `Reach checkpoint ${data.progress}`;
    }
    if (mission.type === 'delivery') {
      data.condition = clamp(mission.condition, 0, 100);
      data.objective = mission.phase === 'pickup'
        ? `Collect ${mission.config.name}`
        : `Deliver ${mission.config.name}`;
    }
    if (mission.type === 'taxi') {
      data.comfort = clamp(mission.comfort, 0, 100);
      data.objective = mission.phase === 'pickup' ? 'Pick up passenger' : 'Drive smoothly to destination';
    }
    if (mission.type === 'parking') {
      const holdRatio = clamp(mission.hold / mission.config.zone.holdTime, 0, 1);
      data.accuracy = mission.accuracy ?? holdRatio * 100;
      data.objective = 'Stop aligned inside the parking outline';
    }
    if (mission.type === 'drift') {
      data.driftScore = Math.round(mission.driftScore);
      data.multiplier = mission.multiplier;
      data.progress = `${Math.round(mission.driftScore)}/${mission.config.targetScore}`;
      data.objective = mission.insideZone ? 'Hold angle inside the drift zone' : 'Enter the marked drift zone';
    }
    return data;
  }

  getFreeDriveHud() {
    return {
      active: false,
      missionType: 'freeDrive',
      mode: 'Free Drive',
      objective: 'Explore districts, collect tokens, discover landmarks, career tasks, or Phase 4 routes.',
      timer: null,
      distance: null,
      condition: null,
      comfort: null,
      progress: null,
      accuracy: null,
      driftScore: null,
      multiplier: null,
      combo: null,
      target: null
    };
  }
}
