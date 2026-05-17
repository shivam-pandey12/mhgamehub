import { CAREER_MISSIONS, DIFFICULTIES, MISSIONS } from '../config.js';

export class CareerManager {
  constructor() {
    this.selectedId = {
      robber: CAREER_MISSIONS.robber[0].id,
      police: CAREER_MISSIONS.police[0].id,
    };
  }

  set(role, id) {
    if (this.find(id)) this.selectedId[role] = id;
  }

  getSelected(role) {
    return this.find(this.selectedId[role]) || CAREER_MISSIONS[role]?.[0] || null;
  }

  getMissions(role) {
    return CAREER_MISSIONS[role] || [];
  }

  find(id) {
    return [...CAREER_MISSIONS.robber, ...CAREER_MISSIONS.police].find((mission) => mission.id === id) || null;
  }

  isUnlocked(mission, progress) {
    if (!mission) return false;
    if (!mission.requires?.length) return true;
    return mission.requires.every((id) => progress.completedMissions?.[id]);
  }

  createMission(careerId) {
    const career = this.find(careerId);
    if (!career) return null;
    const base = (MISSIONS[career.role] || []).find((mission) => mission.id === career.baseMissionId);
    if (!base) return null;
    return {
      ...base,
      ...career,
      id: career.id,
      baseMissionId: base.id,
      role: career.role,
      name: career.name,
      objective: career.objective || base.objective,
      bonus: career.bonus || base.bonus,
      intro: career.intro,
      career: true,
      duration: career.duration || Math.round(base.duration * this.getTimerScale(career.recommendedDifficulty)),
    };
  }

  getTimerScale(difficultyId) {
    return DIFFICULTIES[difficultyId]?.timerScale || 1;
  }
}
