import * as THREE from 'three';
import { ABILITY_CONFIG } from '../config.js';
import { angleToVector, flatDistance } from '../utils/math.js';

export class AbilitySystem {
  constructor({ scene, weapons, damage, effects, audio, hud, onAbilityHit }) {
    this.scene = scene;
    this.weapons = weapons;
    this.damage = damage;
    this.effects = effects;
    this.audio = audio;
    this.hud = hud;
    this.onAbilityHit = onAbilityHit;
    this.spikes = [];
    this.scanTimer = 0;
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.spikeMaterial = new THREE.MeshStandardMaterial({ color: 0x24282c, roughness: 0.42, metalness: 0.5 });
  }

  clear() {
    for (const item of this.spikes) this.group.remove(item.mesh);
    this.spikes.length = 0;
    this.scanTimer = 0;
  }

  setLoadout(vehicle, loadout) {
    vehicle.loadout = loadout;
    vehicle.primaryAbility = ABILITY_CONFIG[loadout.primary];
    vehicle.secondaryAbility = ABILITY_CONFIG[loadout.secondary];
    vehicle.utilityAbility = ABILITY_CONFIG[loadout.utility];
    vehicle.boostAbility = ABILITY_CONFIG[loadout.boost];
    vehicle.secondaryCooldown = 0;
  }

  firePrimary(vehicle, vehicles, aimLocal = null) {
    const ability = vehicle.primaryAbility || ABILITY_CONFIG.machineGun;
    const previousDamage = vehicle.stats.primaryDamage;
    vehicle.stats.primaryDamage *= ability.damageScale || 1;
    const fired = this.weapons.firePrimary(vehicle, vehicles, aimLocal);
    vehicle.stats.primaryDamage = previousDamage;
    return fired;
  }

  fireSecondary(vehicle, vehicles, target) {
    const targetDistance = target ? flatDistance(target.group.position, vehicle.group.position) : 0;
    const useScan = vehicle.loadout?.utility === 'pursuitScan' && targetDistance > 74 && vehicle.isPlayer;
    const abilityId = useScan
      ? 'pursuitScan'
      : vehicle.loadout?.secondary || (vehicle.faction === 'robber' ? 'rearMine' : 'empShot');
    const ability = ABILITY_CONFIG[abilityId];
    if (!ability || vehicle.destroyed) return false;
    if (vehicle.secondaryCooldown > 0) {
      this.audio.playWarning();
      return false;
    }
    if (abilityId === 'rearMine') {
      this.weapons.dropMine(vehicle);
    } else if (abilityId === 'empShot') {
      this.weapons.fireEmp(vehicle);
    } else if (abilityId === 'shockwaveBlast') {
      this.shockwave(vehicle, vehicles, ability);
    } else if (abilityId === 'spikeStrip') {
      this.dropSpikeStrip(vehicle, ability);
    } else if (abilityId === 'pursuitScan') {
      this.scanTimer = ability.duration;
      this.hud.showEvent('Pursuit scan active');
      this.audio.playWarning();
    } else if (abilityId === 'smokeBurst') {
      this.smokeBurst(vehicle, vehicles, ability);
    } else if (abilityId === 'trackerPulse') {
      this.trackerPulse(vehicle, vehicles, target, ability);
    }
    vehicle.secondaryCooldown = ability.cooldown * (vehicle.abilityCooldownScale || 1);
    return true;
  }

  shockwave(vehicle, vehicles, ability) {
    this.effects.empPulse(vehicle.group.position, 1.8);
    this.audio.playExplosion();
    for (const target of vehicles) {
      if (target.destroyed || target === vehicle || target.faction === vehicle.faction) continue;
      const distance = flatDistance(target.group.position, vehicle.group.position);
      if (distance > ability.radius) continue;
      const ratio = 1 - distance / ability.radius;
      const direction = target.group.position.clone().sub(vehicle.group.position).setY(0).normalize();
      target.applyImpulse(direction, ability.impulse * Math.max(0.3, ratio));
      this.damage.apply(target, ability.damage * Math.max(0.35, ratio), vehicle, target.group.position, {
        sparkColor: 0xffa45f,
      });
      this.onAbilityHit?.({ source: vehicle, target, ability: 'shockwaveBlast' });
    }
  }

  dropSpikeStrip(vehicle, ability) {
    const back = angleToVector(vehicle.yaw).multiplyScalar(-1);
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.18, 0.9), this.spikeMaterial.clone());
    mesh.position.copy(vehicle.group.position).add(back.multiplyScalar(vehicle.length * 0.72));
    mesh.position.y = 0.12;
    mesh.rotation.y = vehicle.yaw;
    this.group.add(mesh);
    this.spikes.push({
      mesh,
      owner: vehicle,
      radius: ability.radius,
      damage: ability.damage,
      slowDuration: ability.slowDuration,
      life: 12,
      hit: new Set(),
    });
    this.audio.playMine();
  }

  smokeBurst(vehicle, vehicles, ability) {
    this.effects.smoke(vehicle.group.position, 18, 0xd6d0bd);
    this.effects.empPulse(vehicle.group.position, 1.15);
    this.audio.playMineBeep();
    for (const target of vehicles) {
      if (target.destroyed || target === vehicle || target.faction === vehicle.faction) continue;
      if (flatDistance(target.group.position, vehicle.group.position) > ability.radius) continue;
      target.applyEmp(ability.slowDuration);
      this.effects.spark(target.group.position, 8, 0xffe0aa);
      this.onAbilityHit?.({ source: vehicle, target, ability: 'smokeBurst' });
    }
  }

  trackerPulse(vehicle, vehicles, target, ability) {
    this.scanTimer = 4;
    this.effects.empPulse(vehicle.group.position, 1.25);
    this.audio.playEmp();
    const candidates = target ? [target] : vehicles;
    for (const item of candidates) {
      if (!item || item.destroyed || item === vehicle || item.faction === vehicle.faction) continue;
      if (flatDistance(item.group.position, vehicle.group.position) > ability.radius) continue;
      item.applyEmp(ability.slowDuration);
      this.effects.spark(item.group.position, 10, 0x7be1ff);
      this.damage.apply(item, 10, vehicle, item.group.position, { sparkColor: 0x7be1ff, ability: 'trackerPulse' });
      this.onAbilityHit?.({ source: vehicle, target: item, ability: 'trackerPulse' });
    }
  }

  update(dt, vehicles) {
    this.scanTimer = Math.max(0, this.scanTimer - dt);
    for (let i = this.spikes.length - 1; i >= 0; i -= 1) {
      const strip = this.spikes[i];
      strip.life -= dt;
      for (const vehicle of vehicles) {
        if (vehicle.destroyed || vehicle.faction === strip.owner.faction || strip.hit.has(vehicle)) continue;
        if (flatDistance(vehicle.group.position, strip.mesh.position) < strip.radius) {
          strip.hit.add(vehicle);
          vehicle.applyEmp(strip.slowDuration);
          this.damage.apply(vehicle, strip.damage, strip.owner, strip.mesh.position, { sparkColor: 0xbfd3df });
          this.effects.spark(strip.mesh.position, 12, 0xbfd3df);
          this.onAbilityHit?.({ source: strip.owner, target: vehicle, ability: 'spikeStrip' });
        }
      }
      if (strip.life <= 0) {
        this.group.remove(strip.mesh);
        strip.mesh.geometry.dispose();
        strip.mesh.material.dispose();
        this.spikes.splice(i, 1);
      }
    }
  }
}
