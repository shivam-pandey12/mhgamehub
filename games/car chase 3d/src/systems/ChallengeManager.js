import { CHALLENGES, MISSIONS } from '../config.js';

export class ChallengeManager {
  constructor() {
    this.selectedChallengeId = null;
  }

  getAll() {
    return CHALLENGES;
  }

  get(id = this.selectedChallengeId) {
    return CHALLENGES.find((challenge) => challenge.id === id) || null;
  }

  set(id) {
    this.selectedChallengeId = id && CHALLENGES.some((challenge) => challenge.id === id) ? id : null;
  }

  clear() {
    this.selectedChallengeId = null;
  }

  createMissionFromChallenge(challenge) {
    if (!challenge) return null;
    const base = MISSIONS[challenge.role].find((mission) => mission.id === challenge.baseMissionId)
      || MISSIONS[challenge.role][0];
    return {
      ...base,
      id: `challenge-${challenge.id}`,
      name: challenge.name,
      challengeId: challenge.id,
      role: challenge.role,
      baseMissionId: base.id,
      duration: challenge.duration || base.duration,
      objective: challenge.description,
      bonus: base.bonus,
      takedownGoal: challenge.takedownGoal || null,
      requiresCaptainDefeat: Boolean(challenge.startCaptain),
    };
  }
}
