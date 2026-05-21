import { CAREER_MISSION_LOOKUP, CAREER_PATHS } from '../../config/career.js';
import { getMissionById } from '../../config/missions.js';

export class CareerManager {
  constructor(saveManager, callbacks = {}) {
    this.saveManager = saveManager;
    this.callbacks = callbacks;
  }

  getPaths() {
    return CAREER_PATHS.map((path) => ({
      ...path,
      missions: path.missions.map((mission) => this.getMissionState(mission.id))
    }));
  }

  getMissionState(careerId) {
    const careerMission = CAREER_MISSION_LOOKUP[careerId];
    const missionConfig = getMissionById(careerMission?.missionId);
    const completed = this.saveManager.data.career.completed[careerId] ?? null;
    const unlocked = !careerMission?.required || Boolean(this.saveManager.data.career.completed[careerMission.required]);
    return {
      ...careerMission,
      config: missionConfig,
      completed,
      unlocked
    };
  }

  complete(careerId, result) {
    const careerMission = CAREER_MISSION_LOOKUP[careerId];
    if (!careerMission || !result?.success) return null;
    const newlyCompleted = this.saveManager.completeCareerMission(careerId, result);
    const unlocked = [];
    if (newlyCompleted) {
      this.saveManager.addCoins(careerMission.rewardCoins);
      this.saveManager.addXP(careerMission.rewardXp);
      CAREER_PATHS.forEach((path) => {
        path.missions.forEach((mission) => {
          if (mission.required === careerId) unlocked.push(mission.title);
        });
      });
      this.callbacks.onCareerComplete?.(careerMission, unlocked);
    }
    return {
      careerMission,
      coins: newlyCompleted ? careerMission.rewardCoins : 0,
      xp: newlyCompleted ? careerMission.rewardXp : 0,
      unlocked
    };
  }
}
