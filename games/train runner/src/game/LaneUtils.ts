import { PHASE2_CONFIG } from './config';
import type { CoachCollider, LaneIndex } from './types';

export const LANES = PHASE2_CONFIG.lanes as readonly LaneIndex[];

export function laneToX(coach: CoachCollider, lane: LaneIndex): number {
  return lane * coach.walkableWidth * 0.29;
}

export function laneFromX(coach: CoachCollider, x: number): LaneIndex {
  const spacing = coach.walkableWidth * 0.29;
  if (x < -spacing * 0.5) {
    return -1;
  }

  if (x > spacing * 0.5) {
    return 1;
  }

  return 0;
}

export function isSameLane(coach: CoachCollider, x: number, lane: LaneIndex, tolerance = 0.74): boolean {
  return Math.abs(x - laneToX(coach, lane)) <= tolerance;
}
