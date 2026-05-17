import * as THREE from 'three';
import { PICKUP_CONFIG } from '../config.js';
import { rand } from '../utils/math.js';

export class PickupSystem {
  constructor({ scene, effects, audio, hud }) {
    this.scene = scene;
    this.effects = effects;
    this.audio = audio;
    this.hud = hud;
    this.group = new THREE.Group();
    this.group.name = 'Pickups';
    this.scene.add(this.group);
    this.pickups = [];
    this.respawnTimer = 0;
    this.materials = {};
  }

  reset({ difficulty, modifiers, challenge } = {}) {
    this.clear();
    this.difficulty = difficulty;
    this.modifiers = modifiers;
    this.challenge = challenge;
    if (challenge?.noRepairs) return;
    const count = Math.max(2, Math.round(PICKUP_CONFIG.maxActive * (difficulty?.pickupScale || 1)));
    for (let i = 0; i < Math.min(PICKUP_CONFIG.maxActive, count); i += 1) this.spawn(i);
  }

  clear() {
    for (const pickup of this.pickups) {
      this.group.remove(pickup.mesh);
      pickup.mesh.geometry.dispose();
      pickup.mesh.material.dispose();
    }
    this.pickups.length = 0;
  }

  spawn(index = 0) {
    const point = PICKUP_CONFIG.spawnPoints[(index + Math.floor(rand(0, PICKUP_CONFIG.spawnPoints.length))) % PICKUP_CONFIG.spawnPoints.length];
    const type = this.chooseType();
    const config = PICKUP_CONFIG.types[type];
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(1.1, 0.08, 8, 28),
      new THREE.MeshBasicMaterial({ color: config.color, transparent: true, opacity: 0.92 }),
    );
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(point.x, 0.22, point.z);
    this.group.add(mesh);
    this.pickups.push({ mesh, type, config, spin: rand(1.6, 2.8), pulse: rand(0, 6) });
  }

  chooseType() {
    const entries = Object.entries(PICKUP_CONFIG.types);
    const total = entries.reduce((sum, [, item]) => sum + item.weight, 0);
    let roll = rand(0, total);
    for (const [type, item] of entries) {
      roll -= item.weight;
      if (roll <= 0) return type;
    }
    return 'repair';
  }

  update(dt, player, stats) {
    if (!player || player.destroyed) return;
    this.respawnTimer = Math.max(0, this.respawnTimer - dt);
    for (let i = this.pickups.length - 1; i >= 0; i -= 1) {
      const pickup = this.pickups[i];
      pickup.pulse += dt * 5;
      pickup.mesh.rotation.z += pickup.spin * dt;
      pickup.mesh.scale.setScalar(1 + Math.sin(pickup.pulse) * 0.08);
      if (pickup.mesh.position.distanceTo(player.group.position) > player.stats.radius + 2.4) continue;
      this.applyPickup(pickup, player, stats);
      this.group.remove(pickup.mesh);
      pickup.mesh.geometry.dispose();
      pickup.mesh.material.dispose();
      this.pickups.splice(i, 1);
      this.respawnTimer = PICKUP_CONFIG.respawnDelay;
    }
    if (this.pickups.length < PICKUP_CONFIG.maxActive && this.respawnTimer <= 0 && !this.challenge?.noRepairs) {
      this.spawn(Math.floor(rand(0, PICKUP_CONFIG.spawnPoints.length)));
      this.respawnTimer = PICKUP_CONFIG.respawnDelay;
    }
  }

  applyPickup(pickup, player, stats) {
    if (pickup.type === 'repair') player.health = Math.min(player.maxHealth, player.health + pickup.config.amount);
    if (pickup.type === 'nitro') player.nitro = Math.min(100, player.nitro + pickup.config.amount);
    if (pickup.type === 'ability') player.secondaryCooldown = Math.max(0, player.secondaryCooldown - pickup.config.amount);
    if (pickup.type === 'armor') player.armorBoostTimer = Math.max(player.armorBoostTimer || 0, pickup.config.duration);
    if (pickup.type === 'score') stats.pickupScore = (stats.pickupScore || 0) + pickup.config.amount;
    this.effects.empPulse(pickup.mesh.position, 0.55);
    this.audio.playPickup?.();
    this.hud.showScorePopup?.(`+ ${pickup.config.label}`);
  }
}
