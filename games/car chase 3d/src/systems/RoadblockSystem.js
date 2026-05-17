import * as THREE from 'three';
import { angleToVector } from '../utils/math.js';

export class RoadblockSystem {
  constructor({ scene, city, effects, audio }) {
    this.scene = scene;
    this.city = city;
    this.effects = effects;
    this.audio = audio;
    this.group = new THREE.Group();
    this.group.name = 'Roadblocks';
    this.scene.add(this.group);
    this.blocks = [];
    this.recentSites = [];
    this.spawnCooldown = 0;
    this.materials = {
      cone: new THREE.MeshStandardMaterial({ color: 0xff6c2f, roughness: 0.55 }),
      stripe: new THREE.MeshBasicMaterial({ color: 0xffffff }),
      barrier: new THREE.MeshStandardMaterial({ color: 0xd53b31, roughness: 0.62 }),
      dark: new THREE.MeshStandardMaterial({ color: 0x252b31, roughness: 0.6 }),
    };
  }

  clear() {
    for (const block of this.blocks) this.remove(block);
    this.blocks.length = 0;
    this.recentSites.length = 0;
    this.spawnCooldown = 0;
  }

  spawn(target, role = 'robber', context = {}) {
    if (!target || this.blocks.length >= 2 || this.spawnCooldown > 0 || !this.city.roadblockSites?.length) return false;
    const site = this.predictSite(target, context);
    if (!site) return false;

    const block = this.buildBlock(site, role);
    this.blocks.push(block);
    this.recentSites.unshift(site.key);
    this.recentSites = this.recentSites.slice(0, 3);
    this.spawnCooldown = 4.5;
    this.audio.playWarning();
    return true;
  }

  predictSite(target, context = {}) {
    const forward = target.getForward ? target.getForward() : angleToVector(target.yaw || 0);
    const objective = context.objective;
    let best = null;
    let bestScore = -Infinity;
    for (const site of this.city.roadblockSites) {
      site.key = site.key || `${Math.round(site.center.x)},${Math.round(site.center.z)}`;
      if (this.recentSites.includes(site.key)) continue;
      const toSite = site.center.clone().sub(target.group.position).setY(0);
      const distance = toSite.length();
      if (distance < 42 || distance > 145) continue;
      const ahead = forward.dot(toSite.clone().normalize());
      if (ahead < -0.1) continue;
      const objectiveBonus = objective ? Math.max(0, 70 - site.center.distanceTo(objective)) * 0.22 : 0;
      const widthBonus = (site.width || 18) * 0.35;
      const speedBonus = Math.min(28, target.speed || 0) * ahead;
      const score = ahead * 70 - Math.abs(distance - 86) + objectiveBonus + widthBonus + speedBonus;
      if (score > bestScore) {
        bestScore = score;
        best = site;
      }
    }
    return best || this.city.roadblockSites.find((site) => !this.recentSites.includes(site.key));
  }

  buildBlock(site, role) {
    const group = new THREE.Group();
    group.position.copy(site.center);
    group.rotation.y = site.yaw;
    const boxes = [];
    const gap = role === 'robber' ? 5.8 : 7.5;
    const laneWidth = site.width || 18;
    const segments = [
      { x: -(laneWidth * 0.28 + gap * 0.28), width: laneWidth * 0.34 },
      { x: laneWidth * 0.28 + gap * 0.28, width: laneWidth * 0.34 },
    ];

    for (const segment of segments) {
      const barrier = new THREE.Mesh(new THREE.BoxGeometry(segment.width, 1.15, 1.25), this.materials.barrier);
      barrier.position.set(segment.x, 0.68, 0);
      barrier.castShadow = true;
      group.add(barrier);

      boxes.push(this.makeWorldBox(site, segment.x, segment.width, 1.25));
    }

    for (let i = -3; i <= 3; i += 1) {
      if (Math.abs(i) < 1) continue;
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.38, 1.15, 12), this.materials.cone);
      cone.position.set(i * 2.2, 0.6, -3.2);
      cone.castShadow = true;
      group.add(cone);
    }

    const warning = new THREE.Mesh(new THREE.BoxGeometry(laneWidth * 0.5, 0.2, 0.16), this.materials.dark);
    warning.position.set(0, 1.65, 0.1);
    group.add(warning);
    this.group.add(group);
    return { group, boxes, life: 26, arm: 1.15, active: false };
  }

  makeWorldBox(site, localX, width, depth) {
    const right = new THREE.Vector3(Math.cos(site.yaw), 0, -Math.sin(site.yaw));
    const forward = new THREE.Vector3(Math.sin(site.yaw), 0, Math.cos(site.yaw));
    const center = site.center.clone().add(right.multiplyScalar(localX));
    const radiusX = Math.abs(right.x) * width / 2 + Math.abs(forward.x) * depth / 2;
    const radiusZ = Math.abs(right.z) * width / 2 + Math.abs(forward.z) * depth / 2;
    return {
      minX: center.x - radiusX,
      maxX: center.x + radiusX,
      minZ: center.z - radiusZ,
      maxZ: center.z + radiusZ,
      roadblock: true,
    };
  }

  update(dt) {
    this.spawnCooldown = Math.max(0, this.spawnCooldown - dt);
    for (let i = this.blocks.length - 1; i >= 0; i -= 1) {
      const block = this.blocks[i];
      block.life -= dt;
      block.arm -= dt;
      if (!block.active && block.arm <= 0) {
        block.active = true;
        for (const box of block.boxes) this.city.collisionBoxes.push(box);
      }
      block.group.position.y = Math.sin(block.life * 8) * (block.active ? 0.02 : 0.06);
      if (block.life <= 0) {
        this.remove(block);
        this.blocks.splice(i, 1);
      }
    }
  }

  remove(block) {
    this.group.remove(block.group);
    block.group.traverse((child) => {
      child.geometry?.dispose?.();
    });
    this.city.collisionBoxes = this.city.collisionBoxes.filter((box) => !block.boxes.includes(box));
  }
}
