import * as THREE from 'three';
import { GAME_CONFIG } from './config';
import { CharacterAnimator } from './CharacterAnimator';
import { EffectsSystem } from './EffectsSystem';
import { Hud } from './Hud';
import { InputManager } from './InputManager';
import { expDecay } from './math';
import { TrainSystem } from './TrainSystem';
import type { CoachCollider, LoadoutModifiers, PlayerSnapshot, RunnerState, SurfaceHit } from './types';

export class PlayerController {
  readonly character = new CharacterAnimator();
  readonly position = new THREE.Vector3();
  readonly velocity = new THREE.Vector3();

  state: RunnerState = 'running';
  forwardSpeed: number = GAME_CONFIG.player.baseForwardSpeed;
  grounded = true;
  distance = 0;
  lastGroundCoach: CoachCollider | null = null;

  private readonly startPosition = new THREE.Vector3();
  private verticalVelocity = 0;
  private lateralVelocity = 0;
  private stateTime = 0;
  private coyoteTimer = 0;
  private jumpBufferTimer = 0;
  private slideTimer = 0;
  private dodgeTimer = 0;
  private dodgeCooldownTimer = 0;
  private dodgeDirection = 1;
  private landingTimer = 0;
  private compression = 0;
  private stride = 0;
  private footstepDistance = 0;
  private footSide = -1;
  private lastAxis = 1;
  private airStartCoach: CoachCollider | null = null;
  private airStartZ = 0;
  private cleanGapQueued = false;
  private attackPoseTimer = 0;
  private dashStrikeTimer = 0;
  private recoilTimer = 0;
  private perfectDodgeTimer = 0;
  private jumpMultiplier = 1;
  private dashCooldownMultiplier = 1;

  constructor(private readonly train: TrainSystem) {
    this.reset();
  }

  update(dt: number, input: InputManager, effects: EffectsSystem, hud: Hud): void {
    if (this.state === 'failed') {
      this.updateFailure(dt, input);
      this.character.update(this.getSnapshot(), dt);
      this.character.group.position.copy(this.position);
      return;
    }

    this.stateTime += dt;

    if (input.consumeJump()) {
      this.jumpBufferTimer = GAME_CONFIG.player.jumpBuffer;
    } else {
      this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - dt);
    }

    const slideRequested = input.consumeSlide();
    const dodgeRequested = input.consumeDodge();
    const axis = input.lateralAxis;
    if (axis !== 0) {
      this.lastAxis = axis;
    }

    this.updateForwardSpeed(dt, input.forwardHeld);
    this.updateLateralMotion(dt, axis);

    if (this.grounded) {
      this.coyoteTimer = GAME_CONFIG.player.coyoteTime;
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - dt);
    }

    if (slideRequested && this.grounded && this.slideTimer <= 0) {
      this.slideTimer = GAME_CONFIG.player.slideDuration;
      this.compression = 1;
      effects.triggerSlide({ position: this.position, intensity: 0.75 });
    }

    if (dodgeRequested && this.dodgeTimer <= 0 && this.dodgeCooldownTimer <= 0) {
      this.dodgeDirection = axis || this.lastAxis;
      this.dodgeTimer = GAME_CONFIG.player.dodgeDuration;
      this.dodgeCooldownTimer = 0.58 * this.dashCooldownMultiplier;
      this.lateralVelocity += this.dodgeDirection * GAME_CONFIG.player.dodgeImpulse;
      effects.triggerDodge({ position: this.position, intensity: 0.55 });
    }

    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0 && this.slideTimer <= 0.2) {
      this.startJump(effects);
    }

    this.integrateMotion(dt);
    this.resolveTraversal(effects, hud);
    this.updateStateFromTimers(dt);
    this.updateFootsteps(dt, effects);
    this.updateCharacter(dt);
  }

  reset(): void {
    const spawn = this.train.getSafeSpawn();
    this.position.copy(spawn.position);
    this.startPosition.copy(spawn.position);
    this.velocity.set(0, 0, GAME_CONFIG.player.baseForwardSpeed);
    this.forwardSpeed = GAME_CONFIG.player.baseForwardSpeed;
    this.verticalVelocity = 0;
    this.lateralVelocity = 0;
    this.grounded = true;
    this.distance = 0;
    this.lastGroundCoach = spawn.coach;
    this.airStartCoach = null;
    this.airStartZ = this.position.z;
    this.coyoteTimer = GAME_CONFIG.player.coyoteTime;
    this.jumpBufferTimer = 0;
    this.slideTimer = 0;
    this.dodgeTimer = 0;
    this.dodgeCooldownTimer = 0;
    this.landingTimer = 0;
    this.compression = 0;
    this.stride = 0;
    this.footstepDistance = 0;
    this.cleanGapQueued = false;
    this.attackPoseTimer = 0;
    this.dashStrikeTimer = 0;
    this.recoilTimer = 0;
    this.perfectDodgeTimer = 0;
    this.setState('running');
    this.character.group.position.copy(this.position);
  }

  getSnapshot(): PlayerSnapshot {
    return {
      position: this.position,
      velocity: this.velocity,
      state: this.state,
      grounded: this.grounded,
      forwardSpeed: this.forwardSpeed,
      lateralVelocity: this.lateralVelocity,
      stride: this.stride,
      stateTime: this.stateTime,
      compression: this.compression,
      lean: THREE.MathUtils.clamp(this.lateralVelocity / 9, -1, 1),
      attackPose: THREE.MathUtils.clamp(this.attackPoseTimer / 0.22, 0, 1),
      dashStrike: THREE.MathUtils.clamp(this.dashStrikeTimer / 0.24, 0, 1),
      recoil: THREE.MathUtils.clamp(this.recoilTimer / 0.34, 0, 1),
      perfectDodge: THREE.MathUtils.clamp(this.perfectDodgeTimer / 0.45, 0, 1)
    };
  }

  getSpeedKmh(): number {
    return GAME_CONFIG.world.trainSpeedKmh + this.forwardSpeed * 3.6 * 0.18;
  }

  dispose(): void {
    this.character.dispose();
  }

  configureLoadout(modifiers: LoadoutModifiers): void {
    this.jumpMultiplier = modifiers.jumpMultiplier;
    this.dashCooldownMultiplier = modifiers.dashCooldownMultiplier;
  }

  triggerAttackPose(kind: 'basic' | 'dash' | 'jump' | 'counter'): void {
    this.attackPoseTimer = kind === 'jump' ? 0.34 : 0.24;
    this.dashStrikeTimer = kind === 'dash' || kind === 'counter' ? 0.28 : 0;
    this.compression = Math.max(this.compression, kind === 'dash' ? 0.45 : 0.25);
  }

  triggerDamageReaction(): void {
    this.recoilTimer = 0.36;
    this.compression = 0.8;
  }

  triggerPerfectDodge(): void {
    this.perfectDodgeTimer = 0.48;
  }

  triggerFailFromDamage(effects: EffectsSystem): void {
    this.fail(effects);
  }

  consumeCleanGapCleared(): boolean {
    const value = this.cleanGapQueued;
    this.cleanGapQueued = false;
    return value;
  }

  debugSetDistance(distance: number): void {
    this.position.z = this.startPosition.z + Math.max(0, distance);
    this.distance = Math.max(0, distance);
    this.verticalVelocity = 0;
    this.grounded = true;
    const surface = this.train.getSurfaceAt(this.position.x, this.position.z);
    if (surface) {
      this.snapToSurface(surface);
    }
  }

  private updateForwardSpeed(dt: number, forwardHeld: boolean): void {
    const target = forwardHeld ? GAME_CONFIG.player.maxForwardSpeed : GAME_CONFIG.player.baseForwardSpeed;
    this.forwardSpeed = expDecay(this.forwardSpeed, target, GAME_CONFIG.player.acceleration, dt);
  }

  private updateLateralMotion(dt: number, axis: number): void {
    const control = this.grounded ? 1 : GAME_CONFIG.player.airControl;
    const desired = axis * GAME_CONFIG.player.lateralSpeed * control;
    this.lateralVelocity = expDecay(this.lateralVelocity, desired, GAME_CONFIG.player.lateralDamping * control, dt);
  }

  private startJump(effects: EffectsSystem): void {
    this.jumpBufferTimer = 0;
    this.coyoteTimer = 0;
    this.grounded = false;
    this.verticalVelocity = GAME_CONFIG.player.jumpVelocity * this.jumpMultiplier;
    this.airStartCoach = this.lastGroundCoach;
    this.airStartZ = this.position.z;
    this.compression = 1;
    this.setState('jumping');
    effects.triggerJump({ position: this.position, intensity: 0.72 });
  }

  private integrateMotion(dt: number): void {
    if (!this.grounded) {
      this.verticalVelocity -= GAME_CONFIG.player.gravity * dt;
      this.position.y += this.verticalVelocity * dt;
    }

    this.position.x += this.lateralVelocity * dt;
    this.position.z += this.forwardSpeed * dt;
    this.clampToTrainRegion();
    this.velocity.set(this.lateralVelocity, this.verticalVelocity, this.forwardSpeed);
    this.distance = Math.max(0, this.position.z - this.startPosition.z);
  }

  private resolveTraversal(effects: EffectsSystem, hud: Hud): void {
    const surface = this.train.getSurfaceAt(this.position.x, this.position.z);

    if (this.grounded) {
      if (surface) {
        this.snapToSurface(surface);
        return;
      }

      this.grounded = false;
      this.verticalVelocity = Math.min(this.verticalVelocity, -1.1);
      this.airStartCoach = this.lastGroundCoach;
      this.airStartZ = this.position.z;
      this.setState('falling');
      return;
    }

    if (surface && this.verticalVelocity <= 0 && this.position.y <= surface.roofY + 0.15) {
      const oldCoach = this.airStartCoach;
      this.snapToSurface(surface);
      this.verticalVelocity = 0;
      this.grounded = true;
      this.landingTimer = GAME_CONFIG.player.landingLock;
      this.compression = 1;
      this.setState('landing');

      const jumpedGap = oldCoach && oldCoach.id !== surface.coach.id && this.position.z - this.airStartZ > 1.8;
      effects.triggerLanding({ position: this.position, intensity: jumpedGap ? 1.25 : 0.82 });
      hud.showFeedback(jumpedGap ? 'Gap Cleared' : 'Clean Landing', jumpedGap ? 0.85 : 0.45);
      this.cleanGapQueued = Boolean(jumpedGap);
      this.airStartCoach = null;
      return;
    }

    if (this.position.y < GAME_CONFIG.player.failY) {
      this.fail(effects);
    }
  }

  private snapToSurface(surface: SurfaceHit): void {
    const half = surface.coach.walkableWidth * 0.5 - GAME_CONFIG.player.radius;
    this.position.x = THREE.MathUtils.clamp(this.position.x, -half, half);
    this.position.y = surface.roofY;
    this.lastGroundCoach = surface.coach;
  }

  private clampToTrainRegion(): void {
    const coach = this.train.getLateralBoundsCoach(this.position.z);
    if (!coach) {
      return;
    }

    const half = coach.walkableWidth * 0.5 - GAME_CONFIG.player.radius;
    const previousX = this.position.x;
    const clampedX = THREE.MathUtils.clamp(previousX, -half, half);
    this.position.x = clampedX;

    const hitLeftEdge = previousX < -half && this.lateralVelocity < 0;
    const hitRightEdge = previousX > half && this.lateralVelocity > 0;
    if (hitLeftEdge || hitRightEdge) {
      this.lateralVelocity = 0;
    }
  }

  private updateStateFromTimers(dt: number): void {
    this.compression = Math.max(0, this.compression - dt * 4.7);

    if (this.slideTimer > 0) {
      this.slideTimer = Math.max(0, this.slideTimer - dt);
    }

    if (this.dodgeTimer > 0) {
      this.dodgeTimer = Math.max(0, this.dodgeTimer - dt);
    }

    if (this.dodgeCooldownTimer > 0) {
      this.dodgeCooldownTimer = Math.max(0, this.dodgeCooldownTimer - dt);
    }

    if (this.landingTimer > 0) {
      this.landingTimer = Math.max(0, this.landingTimer - dt);
    }

    this.attackPoseTimer = Math.max(0, this.attackPoseTimer - dt);
    this.dashStrikeTimer = Math.max(0, this.dashStrikeTimer - dt);
    this.recoilTimer = Math.max(0, this.recoilTimer - dt);
    this.perfectDodgeTimer = Math.max(0, this.perfectDodgeTimer - dt);

    if (!this.grounded) {
      this.setState(this.verticalVelocity > 1.2 ? 'jumping' : 'airborne');
      return;
    }

    if (this.slideTimer > 0) {
      this.setState('sliding');
      return;
    }

    if (this.dodgeTimer > 0) {
      this.setState('dodging');
      this.lateralVelocity += this.dodgeDirection * 0.12;
      return;
    }

    if (this.landingTimer > 0) {
      this.setState('landing');
      return;
    }

    this.setState('running');
  }

  private updateFootsteps(dt: number, effects: EffectsSystem): void {
    if (!this.grounded || this.state === 'sliding' || this.state === 'failed') {
      return;
    }

    this.stride += this.forwardSpeed * dt * 3.25;
    this.footstepDistance += this.forwardSpeed * dt;

    if (this.footstepDistance > 1.9) {
      this.footstepDistance = 0;
      this.footSide *= -1;
      const footPosition = this.position.clone().add(new THREE.Vector3(this.footSide * 0.24, 0.03, -0.2));
      effects.triggerFootstep({ position: footPosition, intensity: 0.35 });
    }
  }

  private updateCharacter(dt: number): void {
    const snapshot = this.getSnapshot();
    this.character.group.position.copy(this.position);
    this.character.group.rotation.y = 0;
    this.character.update(snapshot, dt);
  }

  private updateFailure(dt: number, input: InputManager): void {
    this.stateTime += dt;
    this.verticalVelocity -= GAME_CONFIG.player.gravity * 0.65 * dt;
    this.position.y += this.verticalVelocity * dt;
    this.position.z += this.forwardSpeed * 0.3 * dt;
    this.velocity.set(this.lateralVelocity, this.verticalVelocity, this.forwardSpeed * 0.3);

    if (input.consumeRestart()) {
      this.reset();
    }
  }

  private fail(effects: EffectsSystem): void {
    if (this.state === 'failed') {
      return;
    }

    this.grounded = false;
    this.verticalVelocity = Math.min(this.verticalVelocity, -4.5);
    this.setState('failed');
    effects.triggerFail({ position: this.position, intensity: 1 });
  }

  private setState(next: RunnerState): void {
    if (this.state === next) {
      return;
    }

    this.state = next;
    this.stateTime = 0;
  }
}
