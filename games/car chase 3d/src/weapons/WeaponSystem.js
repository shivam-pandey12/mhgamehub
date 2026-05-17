import * as THREE from 'three';
import { PERFORMANCE_LIMITS, WEAPONS } from '../config.js';
import { angleToVector, vectorToAngle } from '../utils/math.js';

export class WeaponSystem {
  constructor({ scene, effects, audio, damage }) {
    this.scene = scene;
    this.effects = effects;
    this.audio = audio;
    this.damage = damage;
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.projectiles = [];
    this.mines = [];
    this.projectileMaterial = new THREE.MeshBasicMaterial({
      color: 0xffcf7a,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
    });
    this.empMaterial = new THREE.MeshBasicMaterial({
      color: 0x6fb5ff,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    this.mineMaterial = new THREE.MeshStandardMaterial({
      color: 0x191b1e,
      emissive: 0x321108,
      roughness: 0.36,
      metalness: 0.5,
    });
  }

  clear() {
    for (const item of [...this.projectiles, ...this.mines]) {
      this.group.remove(item.mesh);
      this.disposeObject(item.mesh);
    }
    this.projectiles.length = 0;
    this.mines.length = 0;
  }

  firePrimary(vehicle, vehicles = [], aimLocal = null) {
    if (vehicle.destroyed || vehicle.primaryCooldown > 0) return false;
    const requestedDirection = this.resolveFireDirection(vehicle, aimLocal);
    const assisted = this.findAimAssistTarget(vehicle, vehicles, requestedDirection);
    const fireDirection = assisted
      ? assisted.group.position.clone().sub(vehicle.group.position).setY(0).normalize()
      : requestedDirection;
    this.aimTurrets(vehicle, fireDirection);
    const muzzles = this.getMuzzlePositions(vehicle, requestedDirection, aimLocal, fireDirection);
    const damageScale = muzzles.length > 1 ? 1.15 / muzzles.length : 1;

    for (const muzzle of muzzles) {
      const mesh = this.createBulletMesh(fireDirection, this.projectileMaterial.clone());
      mesh.position.copy(muzzle);
      this.group.add(mesh);
      while (this.projectiles.length >= PERFORMANCE_LIMITS.projectiles) {
        const old = this.projectiles.shift();
        this.group.remove(old.mesh);
        this.disposeObject(old.mesh);
      }
      this.projectiles.push({
        mesh,
        owner: vehicle,
        faction: vehicle.faction,
        damage: vehicle.stats.primaryDamage * damageScale,
        velocity: fireDirection.clone().multiplyScalar(WEAPONS.projectileSpeed + vehicle.speed * 0.55),
        life: WEAPONS.projectileLife,
        emp: false,
        hitRadius: 0.7,
      });
      this.effects.muzzleFlash(vehicle, fireDirection, muzzle);
    }

    const abilityCooldown = vehicle.primaryAbility?.cooldown;
    vehicle.primaryCooldown = abilityCooldown || (vehicle.faction === 'police' ? WEAPONS.policePrimaryCooldown : WEAPONS.primaryCooldown);
    this.audio.playFire();
    return true;
  }

  resolveFireDirection(vehicle, aimLocal = null) {
    if (!aimLocal) return angleToVector(vehicle.yaw);
    const forward = angleToVector(vehicle.yaw);
    const right = new THREE.Vector3(Math.cos(vehicle.yaw), 0, -Math.sin(vehicle.yaw));
    const direction = forward.multiplyScalar(aimLocal.z || 0).add(right.multiplyScalar(aimLocal.x || 0));
    if (direction.lengthSq() < 0.001) return angleToVector(vehicle.yaw);
    return direction.normalize();
  }

  getMuzzlePositions(vehicle, direction, aimLocal = null, turretDirection = direction) {
    const nozzles = vehicle.parts?.weaponNozzles || [];
    if (nozzles.length) {
      vehicle.group.updateWorldMatrix?.(true, false);
      const turretPositions = nozzles
        .filter((nozzle) => nozzle.omni && nozzle.baseLocal)
        .map((nozzle) => {
          const base = vehicle.group.localToWorld(nozzle.baseLocal.clone());
          return base.add(turretDirection.clone().multiplyScalar(nozzle.length || 1.8));
        });
      const entries = nozzles.filter((nozzle) => !nozzle.omni).map((nozzle) => {
        const worldPosition = vehicle.group.localToWorld(nozzle.local.clone());
        const worldDirection = nozzle.direction.clone().applyQuaternion(vehicle.group.quaternion).setY(0).normalize();
        return {
          position: worldPosition,
          dot: worldDirection.dot(direction),
        };
      });
      const bestDot = Math.max(...entries.map((entry) => entry.dot));
      const threshold = Math.max(0.48, bestDot - 0.16);
      const selected = entries.filter((entry) => entry.dot >= threshold && entry.dot > 0.25);
      const positions = [...selected.map((entry) => entry.position), ...turretPositions];
      if (positions.length) return positions;
    }
    return [this.getMuzzlePosition(vehicle, direction, aimLocal)];
  }

  aimTurrets(vehicle, direction) {
    if (!vehicle.parts?.turrets?.length) return;
    const localYaw = vectorToAngle(direction) - vehicle.yaw;
    vehicle.turretTargetYaw = localYaw;
    vehicle.turretRecoil = Math.min(1, (vehicle.turretRecoil || 0) + 0.52);
  }

  getMuzzlePosition(vehicle, direction, aimLocal = null) {
    const forwardDot = direction.dot(angleToVector(vehicle.yaw));
    const sideDot = direction.dot(new THREE.Vector3(Math.cos(vehicle.yaw), 0, -Math.sin(vehicle.yaw)));
    const forwardOffset = forwardDot >= 0 ? vehicle.length * 0.56 : vehicle.length * 0.52;
    const sideOffset = Math.abs(sideDot) > 0.48 ? sideDot * vehicle.width * 0.48 : 0;
    const origin = vehicle.group.position
      .clone()
      .add(direction.clone().multiplyScalar(Math.abs(forwardDot) > 0.38 ? forwardOffset : vehicle.width * 0.46))
      .add(new THREE.Vector3(Math.cos(vehicle.yaw), 0, -Math.sin(vehicle.yaw)).multiplyScalar(sideOffset * 0.4));
    origin.y += aimLocal?.z < -0.45 ? 1.1 : 1.48;
    return origin;
  }

  createBulletMesh(direction, material) {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.048, 0.82, 8), material);
    body.rotation.x = Math.PI / 2;
    body.position.z = 0.26;
    const tracer = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.026, 1.35, 8),
      new THREE.MeshBasicMaterial({ color: 0xffe5a6, transparent: true, opacity: 0.44, blending: THREE.AdditiveBlending }),
    );
    tracer.rotation.x = Math.PI / 2;
    tracer.position.z = -0.58;
    group.add(tracer, body);
    group.rotation.y = vectorToAngle(direction);
    return group;
  }

  findAimAssistTarget(vehicle, vehicles, forward) {
    let best = null;
    let bestScore = Infinity;
    for (const target of vehicles) {
      if (target.destroyed || target === vehicle || target.faction === vehicle.faction) continue;
      const toTarget = target.group.position.clone().sub(vehicle.group.position);
      toTarget.y = 0;
      const distance = toTarget.length();
      if (distance > WEAPONS.aimAssistRange || distance < 4) continue;
      const direction = toTarget.normalize();
      const angle = Math.acos(Math.max(-1, Math.min(1, forward.dot(direction))));
      if (angle < WEAPONS.aimAssistAngle && distance + angle * 40 < bestScore) {
        bestScore = distance + angle * 40;
        best = target;
      }
    }
    return best;
  }

  fireSecondary(vehicle) {
    if (vehicle.destroyed || vehicle.secondaryCooldown > 0) return false;
    if (vehicle.faction === 'robber') {
      this.dropMine(vehicle);
    } else {
      this.fireEmp(vehicle);
    }
    vehicle.secondaryCooldown = WEAPONS.secondaryCooldown;
    return true;
  }

  dropMine(vehicle) {
    const back = angleToVector(vehicle.yaw).multiplyScalar(-1);
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.82, 0.28, 16), this.mineMaterial.clone());
    mesh.position.copy(vehicle.group.position).add(back.multiplyScalar(vehicle.length * 0.68));
    mesh.position.y = 0.22;
    this.group.add(mesh);
    while (this.mines.length >= 18) {
      const old = this.mines.shift();
      this.group.remove(old.mesh);
      old.mesh.geometry.dispose();
      old.mesh.material.dispose();
    }
    this.mines.push({
      mesh,
      owner: vehicle,
      faction: vehicle.faction,
      damage: vehicle.stats.secondaryDamage,
      arm: WEAPONS.mineArmTime,
      life: WEAPONS.mineLife,
      radius: WEAPONS.mineRadius,
      triggered: false,
      beepTimer: 0.18,
    });
    this.audio.playMine();
  }

  fireEmp(vehicle) {
    const forward = angleToVector(vehicle.yaw);
    const mesh = this.createBulletMesh(forward, this.empMaterial.clone());
    mesh.scale.setScalar(1.22);
    mesh.position.copy(vehicle.group.position).add(forward.clone().multiplyScalar(vehicle.length * 0.58));
    mesh.position.y += 1.45;
    this.group.add(mesh);
    this.projectiles.push({
      mesh,
      owner: vehicle,
      faction: vehicle.faction,
      damage: vehicle.stats.secondaryDamage,
      velocity: forward.multiplyScalar(WEAPONS.empSpeed + vehicle.speed * 0.35),
      life: WEAPONS.empLife,
      emp: true,
      hitRadius: WEAPONS.empRadius,
    });
    this.audio.playEmp();
  }

  update(dt, vehicles) {
    this.updateProjectiles(dt, vehicles);
    this.updateMines(dt, vehicles);
  }

  updateProjectiles(dt, vehicles) {
    for (let i = this.projectiles.length - 1; i >= 0; i -= 1) {
      const projectile = this.projectiles[i];
      projectile.life -= dt;
      projectile.mesh.position.addScaledVector(projectile.velocity, dt);

      let hit = null;
      for (const vehicle of vehicles) {
        if (vehicle.destroyed || vehicle === projectile.owner || vehicle.faction === projectile.faction) continue;
        const distance = vehicle.group.position.distanceTo(projectile.mesh.position);
        if (distance < vehicle.stats.radius + projectile.hitRadius) {
          hit = vehicle;
          break;
        }
      }

      if (hit) {
        if (projectile.emp) {
          hit.applyEmp(2.35);
          this.effects.empPulse(projectile.mesh.position, 1.1);
          this.effects.spark(hit.group.position, 14, 0x4da3ff);
        }
        this.damage.apply(hit, projectile.damage, projectile.owner, projectile.mesh.position, {
          sparkColor: projectile.emp ? 0x6fb5ff : 0xffba70,
          ability: projectile.emp ? 'empShot' : null,
        });
        const impulse = hit.group.position.clone().sub(projectile.owner.group.position).setY(0).normalize();
        hit.applyImpulse(impulse, projectile.emp ? WEAPONS.hitKnockback * 0.7 : WEAPONS.hitKnockback);
        this.group.remove(projectile.mesh);
        this.disposeObject(projectile.mesh);
        this.projectiles.splice(i, 1);
      } else if (projectile.life <= 0) {
        this.group.remove(projectile.mesh);
        this.disposeObject(projectile.mesh);
        this.projectiles.splice(i, 1);
      }
    }
  }

  updateMines(dt, vehicles) {
    for (let i = this.mines.length - 1; i >= 0; i -= 1) {
      const mine = this.mines[i];
      mine.arm -= dt;
      mine.life -= dt;
      mine.mesh.rotation.y += dt * 3;
      mine.mesh.material.emissive.setHex(mine.arm <= 0 ? 0x441100 : 0x0a0a0a);
      mine.beepTimer -= dt;
      if (mine.beepTimer <= 0) {
        mine.beepTimer = mine.arm > 0 ? 0.22 : 0.65;
        mine.mesh.scale.setScalar(mine.arm <= 0 ? 1.18 : 1.08);
        this.audio.playMineBeep();
      } else {
        mine.mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.18);
      }

      if (mine.arm <= 0) {
        const target = vehicles.find((vehicle) => (
          !vehicle.destroyed &&
          vehicle.faction !== mine.faction &&
          vehicle.group.position.distanceTo(mine.mesh.position) < mine.radius
        ));
        if (target) {
          this.effects.explosion(mine.mesh.position, 0.92);
          this.effects.smoke(mine.mesh.position, 5, 0x38332c);
          this.audio.playExplosion();
          for (const vehicle of vehicles) {
            if (vehicle.destroyed || vehicle.faction === mine.faction) continue;
            const distance = vehicle.group.position.distanceTo(mine.mesh.position);
            if (distance < mine.radius) {
              const ratio = 1 - distance / mine.radius;
              this.damage.apply(vehicle, mine.damage * Math.max(0.35, ratio), mine.owner, mine.mesh.position, {
                sparkCount: 12,
                ability: 'rearMine',
              });
              const impulse = vehicle.group.position.clone().sub(mine.mesh.position).normalize();
              vehicle.applyImpulse(impulse, 16 * ratio);
            }
          }
          this.group.remove(mine.mesh);
          this.disposeObject(mine.mesh);
          this.mines.splice(i, 1);
          continue;
        }
      }

      if (mine.life <= 0) {
        this.group.remove(mine.mesh);
        this.disposeObject(mine.mesh);
        this.mines.splice(i, 1);
      }
    }
  }

  disposeObject(object) {
    object.traverse?.((child) => {
      child.geometry?.dispose?.();
      if (Array.isArray(child.material)) child.material.forEach((material) => material.dispose?.());
      else child.material?.dispose?.();
    });
  }
}
