import * as THREE from 'three';
import { AudioEvents } from './AudioEvents';
import { EffectsSystem } from './EffectsSystem';
import { Hud } from './Hud';
import { PlayerStatsSystem } from './PlayerStatsSystem';
import { getRouteById } from './RouteConfig';
import type { MissionObjective, RouteConfig } from './types';

export class MissionSystem {
  private readonly objectives: MissionObjective[] = [];
  private route: RouteConfig = getRouteById('neon-express');

  constructor(private readonly audio: AudioEvents) {
    this.reset(this.route);
  }

  update(distance: number, stats: PlayerStatsSystem, routeComplete: boolean, effects: EffectsSystem, hud: Hud): void {
    for (const objective of this.objectives) {
      if (objective.type === 'distance') {
        this.setProgress(objective.id, distance, distance >= objective.target, effects, hud);
      } else if (objective.type === 'completeRoute') {
        this.setProgress(objective.id, routeComplete ? 1 : 0, routeComplete, effects, hud);
      } else if (objective.type === 'coins') {
        this.setProgress(objective.id, stats.coins, stats.coins >= objective.target, effects, hud);
      } else if (objective.type === 'enemyDefeats') {
        this.setProgress(objective.id, stats.enemiesDefeated, stats.enemiesDefeated >= objective.target, effects, hud);
      } else if (objective.type === 'specialUses') {
        this.setProgress(objective.id, stats.specialUses, stats.specialUses >= objective.target, effects, hud);
      } else if (objective.type === 'bossDefeated') {
        this.setProgress(objective.id, stats.bossDefeated ? 1 : 0, stats.bossDefeated, effects, hud);
      } else if (objective.type === 'perfectDodges') {
        this.setProgress(objective.id, stats.perfectDodges, stats.perfectDodges >= objective.target, effects, hud);
      } else if (objective.type === 'damageLimit') {
        this.setProgress(objective.id, stats.damageTaken, routeComplete && stats.damageTaken <= objective.target, effects, hud);
      } else if (objective.type === 'routeTokens') {
        this.setProgress(objective.id, stats.routeTokens, stats.routeTokens >= objective.target, effects, hud);
      }
    }
  }

  reset(route: RouteConfig = this.route): void {
    this.route = route;
    this.objectives.length = 0;
    this.objectives.push(...route.objectives.map((objective) => ({ ...objective, progress: 0, completed: false })));
  }

  getSnapshot(): MissionObjective[] {
    return this.objectives.map((objective) => ({ ...objective }));
  }

  get completedCount(): number {
    return this.objectives.filter((objective) => objective.completed).length;
  }

  get completedIds(): string[] {
    return this.objectives.filter((objective) => objective.completed).map((objective) => objective.id);
  }

  get totalCount(): number {
    return this.objectives.length;
  }

  private setProgress(id: string, progress: number, completed: boolean, effects: EffectsSystem, hud: Hud): void {
    const objective = this.objectives.find((item) => item.id === id);
    if (!objective) {
      return;
    }

    objective.progress = Math.min(objective.target, progress);
    if (!objective.completed && completed) {
      objective.completed = true;
      this.audio.play('objectiveComplete');
      hud.showFeedback('Objective Complete', 0.9);
      effects.triggerObjective({ position: new THREE.Vector3(0, 4, 0), intensity: 0.5 });
    }
  }
}
