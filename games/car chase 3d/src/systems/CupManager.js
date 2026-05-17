import { CUP_MODES } from '../config.js';

export class CupManager {
  constructor({ career }) {
    this.career = career;
    this.selectedId = CUP_MODES[0].id;
    this.active = null;
  }

  set(id) {
    if (this.find(id)) this.selectedId = id;
  }

  find(id) {
    return CUP_MODES.find((cup) => cup.id === id) || null;
  }

  getSelected() {
    return this.find(this.selectedId) || CUP_MODES[0];
  }

  start(id = this.selectedId) {
    const cup = this.find(id);
    if (!cup) return null;
    this.selectedId = cup.id;
    this.active = {
      id: cup.id,
      roundIndex: 0,
      score: 0,
      wins: 0,
      complete: false,
    };
    return this.active;
  }

  clear() {
    this.active = null;
  }

  getCurrentCareer() {
    const cup = this.find(this.active?.id);
    if (!cup || !this.active) return null;
    return this.career.find(cup.rounds[this.active.roundIndex]);
  }

  createCurrentMission() {
    const career = this.getCurrentCareer();
    if (!career) return null;
    const mission = this.career.createMission(career.id);
    if (!mission) return null;
    const cup = this.find(this.active.id);
    return {
      ...mission,
      cup: true,
      cupId: cup.id,
      cupName: cup.name,
      cupRound: this.active.roundIndex + 1,
      cupRounds: cup.rounds.length,
    };
  }

  advance(score) {
    if (!this.active) return null;
    const cup = this.find(this.active.id);
    this.active.score += score?.total || 0;
    this.active.wins += 1;
    this.active.roundIndex += 1;
    if (!cup || this.active.roundIndex >= cup.rounds.length) {
      this.active.complete = true;
      return null;
    }
    return this.createCurrentMission();
  }

  getProgressLabel() {
    const cup = this.find(this.active?.id);
    if (!cup || !this.active) return 'No active cup';
    return `${cup.name}: Round ${Math.min(this.active.roundIndex + 1, cup.rounds.length)} / ${cup.rounds.length}`;
  }
}
