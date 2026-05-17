import * as THREE from 'three';
import type { EffectEvent } from './types';

interface Particle {
  sprite: THREE.Sprite;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
}

interface Streak {
  position: THREE.Vector3;
  speed: number;
  scale: THREE.Vector3;
}

export class EffectsSystem {
  readonly group = new THREE.Group();

  private readonly particles: Particle[] = [];
  private readonly streaks: Streak[] = [];
  private readonly streakMesh: THREE.InstancedMesh;
  private readonly dummy = new THREE.Object3D();
  private shake = 0;
  private readonly baseParticleScale = 0.16;
  private vfxScale = 1;
  private reducedMotion = false;

  constructor() {
    this.group.name = 'Speed and impact effects';

    const streakGeometry = new THREE.BoxGeometry(0.035, 0.025, 3.8);
    const streakMaterial = new THREE.MeshBasicMaterial({
      color: 0x7beeff,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    this.streakMesh = new THREE.InstancedMesh(streakGeometry, streakMaterial, 92);
    this.streakMesh.frustumCulled = false;
    this.group.add(this.streakMesh);

    for (let i = 0; i < this.streakMesh.count; i += 1) {
      this.streaks.push({
        position: new THREE.Vector3(
          THREE.MathUtils.randFloatSpread(15),
          THREE.MathUtils.randFloat(3.1, 8.5),
          THREE.MathUtils.randFloat(-35, 55)
        ),
        speed: THREE.MathUtils.randFloat(28, 58),
        scale: new THREE.Vector3(
          THREE.MathUtils.randFloat(0.8, 1.4),
          THREE.MathUtils.randFloat(0.8, 1.6),
          THREE.MathUtils.randFloat(0.7, 1.8)
        )
      });
    }

    for (let i = 0; i < 96; i += 1) {
      const material = new THREE.SpriteMaterial({
        color: 0xffd299,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      const sprite = new THREE.Sprite(material);
      sprite.visible = false;
      this.group.add(sprite);
      this.particles.push({
        sprite,
        velocity: new THREE.Vector3(),
        life: 0,
        maxLife: 1
      });
    }
  }

  update(dt: number, playerPosition: THREE.Vector3, speed: number): void {
    this.updateStreaks(dt, playerPosition, speed);
    this.updateParticles(dt);
    this.shake = Math.max(0, this.shake - dt * (this.reducedMotion ? 5.6 : 2.9));
  }

  triggerJump(event: EffectEvent): void {
    this.spawnBurst(event.position, 0x7beeff, 10, event.intensity ?? 0.7, 0.28);
    this.shake = Math.max(this.shake, 0.17 * (event.intensity ?? 1));
  }

  triggerLanding(event: EffectEvent): void {
    this.spawnBurst(event.position, 0xffd299, 24, event.intensity ?? 1, 0.42);
    this.shake = Math.max(this.shake, 0.34 * (event.intensity ?? 1));
  }

  triggerFootstep(event: EffectEvent): void {
    this.spawnBurst(event.position, 0xbdefff, 3, event.intensity ?? 0.3, 0.18);
  }

  triggerSlide(event: EffectEvent): void {
    this.spawnBurst(event.position, 0xffb454, 20, event.intensity ?? 0.65, 0.34);
    this.shake = Math.max(this.shake, 0.12);
  }

  triggerDodge(event: EffectEvent): void {
    this.spawnBurst(event.position, 0x38e8ff, 15, event.intensity ?? 0.55, 0.22);
    this.shake = Math.max(this.shake, 0.13);
  }

  triggerFail(event: EffectEvent): void {
    this.spawnBurst(event.position, 0xff5f6d, 34, event.intensity ?? 1, 0.58);
    this.shake = Math.max(this.shake, 0.42);
  }

  triggerAttack(event: EffectEvent): void {
    const origin = event.position.clone().add(new THREE.Vector3(0, 1.2, 1.1));
    this.spawnBurst(origin, event.color ?? 0xe0f7ff, 12, event.intensity ?? 0.8, 0.2);
    this.shake = Math.max(this.shake, 0.08 * (event.intensity ?? 1));
  }

  triggerEnemyHit(event: EffectEvent): void {
    this.spawnBurst(event.position, 0xffd166, 26, event.intensity ?? 0.85, 0.32);
    this.shake = Math.max(this.shake, 0.2 * (event.intensity ?? 1));
  }

  triggerEnemyDefeat(event: EffectEvent): void {
    this.spawnBurst(event.position, 0xff5f6d, 36, event.intensity ?? 1, 0.46);
    this.shake = Math.max(this.shake, 0.28 * (event.intensity ?? 1));
  }

  triggerPickup(event: EffectEvent): void {
    this.spawnBurst(event.position, 0x8df7c6, 18, event.intensity ?? 0.75, 0.26);
    this.shake = Math.max(this.shake, 0.04);
  }

  triggerDamage(event: EffectEvent): void {
    this.spawnBurst(event.position.clone().add(new THREE.Vector3(0, 1, 0)), 0xff5f6d, 28, event.intensity ?? 1, 0.4);
    this.shake = Math.max(this.shake, 0.32 * (event.intensity ?? 1));
  }

  triggerPerfectDodge(event: EffectEvent): void {
    this.spawnBurst(event.position.clone().add(new THREE.Vector3(0, 0.9, 0)), 0xdffcff, 34, event.intensity ?? 1, 0.34);
    this.shake = Math.max(this.shake, 0.18);
  }

  triggerShieldBreak(event: EffectEvent): void {
    this.spawnBurst(event.position.clone().add(new THREE.Vector3(0, 1, 0)), 0x8df7c6, 30, event.intensity ?? 1, 0.38);
    this.shake = Math.max(this.shake, 0.16);
  }

  triggerObstacleBreak(event: EffectEvent): void {
    this.spawnBurst(event.position.clone().add(new THREE.Vector3(0, 0.7, 0)), 0xffb454, 24, event.intensity ?? 0.8, 0.32);
    this.shake = Math.max(this.shake, 0.16);
  }

  triggerSpecialWave(event: EffectEvent): void {
    this.spawnBurst(event.position.clone().add(new THREE.Vector3(0, 0.9, 1.2)), event.color ?? 0x68f7ff, 42, event.intensity ?? 1.2, 0.42);
    this.shake = Math.max(this.shake, 0.22 * (event.intensity ?? 1));
  }

  triggerExplosion(event: EffectEvent): void {
    this.spawnBurst(event.position, 0xff7a2d, 52, event.intensity ?? 1.2, 0.62);
    this.spawnBurst(event.position.clone().add(new THREE.Vector3(0, 0.5, 0)), 0xffe8a3, 22, event.intensity ?? 1, 0.34);
    this.shake = Math.max(this.shake, 0.48 * (event.intensity ?? 1));
  }

  triggerShockwave(event: EffectEvent): void {
    this.spawnBurst(event.position, 0xdffcff, 34, event.intensity ?? 1, 0.38);
    this.shake = Math.max(this.shake, 0.34 * (event.intensity ?? 1));
  }

  triggerObjective(event: EffectEvent): void {
    this.spawnBurst(event.position, 0x8df7c6, 24, event.intensity ?? 0.65, 0.32);
  }

  triggerBossDamage(event: EffectEvent): void {
    this.spawnBurst(event.position, 0xffb454, 42, event.intensity ?? 1, 0.5);
    this.shake = Math.max(this.shake, 0.3 * (event.intensity ?? 1));
  }

  triggerSetPiece(event: EffectEvent): void {
    this.spawnBurst(event.position, 0x9ddcff, 28, event.intensity ?? 0.8, 0.35);
    this.shake = Math.max(this.shake, 0.14 * (event.intensity ?? 1));
  }

  getShakeAmount(): number {
    return this.reducedMotion ? this.shake * 0.25 : this.shake;
  }

  setVfxIntensity(intensity: 'low' | 'medium' | 'high'): void {
    this.vfxScale = intensity === 'low' ? 0.55 : intensity === 'high' ? 1.25 : 1;
  }

  setReducedMotion(enabled: boolean): void {
    this.reducedMotion = enabled;
  }

  dispose(): void {
    this.streakMesh.geometry.dispose();
    if (Array.isArray(this.streakMesh.material)) {
      this.streakMesh.material.forEach((material) => material.dispose());
    } else {
      this.streakMesh.material.dispose();
    }

    for (const particle of this.particles) {
      particle.sprite.material.dispose();
    }
  }

  private updateStreaks(dt: number, playerPosition: THREE.Vector3, speed: number): void {
    for (let i = 0; i < this.streaks.length; i += 1) {
      const streak = this.streaks[i];
      streak.position.z -= (streak.speed + speed * 0.36) * dt;

      if (streak.position.z < playerPosition.z - 28) {
        streak.position.set(
          playerPosition.x + THREE.MathUtils.randFloatSpread(15),
          THREE.MathUtils.randFloat(3.1, 8.5),
          playerPosition.z + THREE.MathUtils.randFloat(38, 76)
        );
        streak.speed = THREE.MathUtils.randFloat(28, 64);
      }

      this.dummy.position.copy(streak.position);
      this.dummy.rotation.set(0, 0, 0);
      this.dummy.scale.copy(streak.scale);
      this.dummy.updateMatrix();
      this.streakMesh.setMatrixAt(i, this.dummy.matrix);
    }

    this.streakMesh.instanceMatrix.needsUpdate = true;
  }

  private updateParticles(dt: number): void {
    for (const particle of this.particles) {
      if (particle.life <= 0) {
        continue;
      }

      particle.life -= dt;
      particle.velocity.y -= 5.4 * dt;
      particle.sprite.position.addScaledVector(particle.velocity, dt);

      const t = Math.max(0, particle.life / particle.maxLife);
      particle.sprite.material.opacity = t * t * 0.72;
      const scale = this.baseParticleScale * (1 + (1 - t) * 2.4);
      particle.sprite.scale.setScalar(scale);

      if (particle.life <= 0) {
        particle.sprite.visible = false;
        particle.sprite.material.opacity = 0;
      }
    }
  }

  private spawnBurst(position: THREE.Vector3, color: number, count: number, intensity: number, life: number): void {
    const origin = position.clone();
    origin.y += 0.08;
    const motionScale = this.reducedMotion ? 0.46 : 1;
    const scaledCount = Math.max(1, Math.floor(count * this.vfxScale * motionScale));
    const scaledIntensity = intensity * (0.85 + this.vfxScale * 0.15) * (this.reducedMotion ? 0.72 : 1);

    for (let i = 0; i < scaledCount; i += 1) {
      const particle = this.getFreeParticle();
      if (!particle) {
        return;
      }

      particle.life = life * THREE.MathUtils.randFloat(0.75, 1.35);
      particle.maxLife = particle.life;
      particle.sprite.visible = true;
      particle.sprite.position.copy(origin);
      particle.sprite.material.color.setHex(color);
      particle.sprite.material.opacity = 0.72;
      particle.sprite.scale.setScalar(this.baseParticleScale * THREE.MathUtils.randFloat(0.65, 1.55));
      particle.velocity.set(
        THREE.MathUtils.randFloatSpread(2.2) * scaledIntensity,
        THREE.MathUtils.randFloat(0.25, 2.25) * scaledIntensity,
        THREE.MathUtils.randFloat(-4.8, 1.2) * scaledIntensity
      );
    }
  }

  private getFreeParticle(): Particle | null {
    return this.particles.find((particle) => particle.life <= 0) ?? this.particles[0] ?? null;
  }
}
