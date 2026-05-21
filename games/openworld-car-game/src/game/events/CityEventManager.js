import { CITY_EVENTS, FREE_DRIVE_TASKS } from '../../config/events.js';
import { vec2Distance } from '../utils/math.js';

export class CityEventManager {
  constructor(saveManager, masteryManager, callbacks = {}) {
    this.saveManager = saveManager;
    this.masteryManager = masteryManager;
    this.callbacks = callbacks;
    this.eventIndex = 0;
    this.activeEvent = CITY_EVENTS[0];
    this.eventTimer = this.activeEvent.duration;
    this.eventProgress = { distance: 0, cleanDistance: 0, speedTime: 0, claimed: false };
    this.taskIndex = 0;
    this.activeTask = FREE_DRIVE_TASKS[0];
    this.taskProgress = {
      cleanDistance: 0,
      coinStart: saveManager.data.stats.totalCoinsCollected,
      driftSeconds: 0
    };
  }

  update(dt, telemetry, player, mode, carId) {
    if (mode !== 'freeDrive') return this.getHudData();
    this.eventTimer -= dt;
    if (this.eventTimer <= 0) this.rotateEvent();
    this.updateEventProgress(dt, telemetry, player, carId);
    this.updateTask(dt, telemetry, player, carId);
    return this.getHudData();
  }

  rotateEvent() {
    this.eventIndex = (this.eventIndex + 1) % CITY_EVENTS.length;
    this.activeEvent = CITY_EVENTS[this.eventIndex];
    this.eventTimer = this.activeEvent.duration;
    this.eventProgress = { distance: 0, cleanDistance: 0, speedTime: 0, claimed: false };
    this.callbacks.onEvent?.(this.activeEvent);
  }

  updateEventProgress(dt, telemetry, player, carId) {
    if (this.eventProgress.claimed) return;
    const clean = telemetry.collisionIntensity < 0.08;
    this.eventProgress.distance += telemetry.distanceTravelled;
    this.eventProgress.cleanDistance = clean ? this.eventProgress.cleanDistance + telemetry.distanceTravelled : 0;
    this.eventProgress.speedTime = telemetry.speedKmh > 120 && clean ? this.eventProgress.speedTime + dt : Math.max(0, this.eventProgress.speedTime - dt);

    const id = this.activeEvent.id;
    const zone = telemetry.zoneName;
    const reachedHill = vec2Distance([player.position.x, player.position.z], [170, 258]) < 16;
    const complete = (
      (id === 'morning-traffic' && ['Downtown Core', 'Market Street'].includes(zone) && this.eventProgress.distance > 280)
      || (id === 'park-cruise' && zone === 'Park Loop' && this.eventProgress.cleanDistance > 240)
      || (id === 'highway-speed' && zone === 'Highway Ring / Expressway System' && this.eventProgress.speedTime > 6)
      || (id === 'market-rush' && zone === 'Market Street' && this.eventProgress.cleanDistance > 160)
      || (id === 'hill-view' && reachedHill)
      || (id === 'airport-cruise' && zone === 'Airport Zone' && this.eventProgress.cleanDistance > 220)
      || (id === 'industrial-shift' && zone === 'Industrial / Logistics Zone' && this.eventProgress.cleanDistance > 220)
      || (id === 'clean-streak' && this.eventProgress.cleanDistance > 420)
    );
    if (!complete) return;
    this.eventProgress.claimed = true;
    this.saveManager.completeCityEvent(id);
    this.saveManager.addCoins(this.activeEvent.rewardCoins);
    this.saveManager.addXP(this.activeEvent.rewardXp);
    this.masteryManager.addXp(carId, 55, 'cityEvent');
    this.callbacks.onTaskComplete?.({
      label: this.activeEvent.name,
      coins: this.activeEvent.rewardCoins
    });
  }

  updateTask(dt, telemetry, player, carId) {
    if (!this.activeTask || this.saveManager.data.freeDriveTasks.completed[this.activeTask.id]) {
      this.nextTask();
      return;
    }
    const task = this.activeTask;
    let complete = false;
    if (task.target) {
      complete = vec2Distance([player.position.x, player.position.z], task.target) < 9;
    }
    if (task.cleanDistance) {
      if (telemetry.collisionIntensity > 0.1) this.taskProgress.cleanDistance = 0;
      else this.taskProgress.cleanDistance += telemetry.distanceTravelled;
      complete = this.taskProgress.cleanDistance >= task.cleanDistance;
    }
    if (task.speedKmh) {
      complete = telemetry.zoneName === task.zone && telemetry.speedKmh >= task.speedKmh;
    }
    if (task.coinCount) {
      complete = (this.saveManager.data.stats.totalCoinsCollected - this.taskProgress.coinStart) >= task.coinCount;
    }
    if (task.driftSeconds) {
      this.taskProgress.driftSeconds = telemetry.drifting
        ? this.taskProgress.driftSeconds + dt
        : Math.max(0, this.taskProgress.driftSeconds - dt * 0.5);
      complete = this.taskProgress.driftSeconds >= task.driftSeconds;
    }
    if (!complete) return;
    this.saveManager.completeFreeDriveTask(task.id);
    this.saveManager.addCoins(task.coins);
    this.saveManager.addXP(task.xp);
    this.masteryManager.addXp(carId, task.masteryXp, 'freeDriveTask');
    this.callbacks.onTaskComplete?.(task);
    this.nextTask();
  }

  nextTask() {
    this.taskIndex = (this.taskIndex + 1) % FREE_DRIVE_TASKS.length;
    this.activeTask = FREE_DRIVE_TASKS[this.taskIndex];
    this.taskProgress = {
      cleanDistance: 0,
      coinStart: this.saveManager.data.stats.totalCoinsCollected,
      driftSeconds: 0
    };
  }

  getHudData() {
    return {
      event: this.activeEvent,
      eventTime: Math.max(0, this.eventTimer),
      task: this.activeTask
    };
  }
}
