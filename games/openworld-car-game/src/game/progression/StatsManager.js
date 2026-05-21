export class StatsManager {
  constructor(saveManager) {
    this.saveManager = saveManager;
    this.lastCrashPulse = 0;
  }

  updateDriving(dt, telemetry) {
    const clean = telemetry.collisionIntensity < 0.1 && !telemetry.offRoad;
    this.saveManager.addDistance(telemetry.distanceTravelled, clean);
    if (telemetry.driftScore > 0.1) {
      this.saveManager.addDriftScore(telemetry.driftScore);
    }
    this.lastCrashPulse = Math.max(0, this.lastCrashPulse - dt);
    if (telemetry.collisionIntensity > 0.55 && this.lastCrashPulse <= 0) {
      this.saveManager.addCrash();
      this.lastCrashPulse = 1.0;
      return true;
    }
    return false;
  }
}
