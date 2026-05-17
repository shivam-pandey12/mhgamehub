import * as THREE from 'three';
import { DESTRUCTIBLE_PROPS, EFFECT_QUALITY } from '../config.js';
import { rand } from '../utils/math.js';

export class DestructiblePropSystem {
  constructor({ scene, city, effects, audio, settings }) {
    this.scene = scene;
    this.city = city;
    this.effects = effects;
    this.audio = audio;
    this.settings = settings;
    this.group = new THREE.Group();
    this.group.name = 'DestructibleProps';
    this.scene.add(this.group);
    this.props = [];
    this.debris = [];
    this.onBreak = null;
    this.materials = {
      cone: new THREE.MeshStandardMaterial({ color: 0xff6d2f, roughness: 0.55 }),
      wood: new THREE.MeshStandardMaterial({ color: 0x8a5d36, roughness: 0.72 }),
      metal: new THREE.MeshStandardMaterial({ color: 0x8d969a, roughness: 0.55, metalness: 0.25 }),
      glass: new THREE.MeshBasicMaterial({ color: 0x9ed8ff, transparent: true, opacity: 0.52 }),
    };
  }

  build() {
    this.clear();
    const positions = [
      [-138, 64, 'fence'], [-128, 64, 'fence'], [-118, 64, 'fence'], [-98, 116, 'fence'],
      [-132, 82, 'bench'], [-104, 110, 'bench'], [-34, -92, 'glass'], [98, 12, 'glass'],
      [104, -86, 'cone'], [114, -82, 'cone'], [124, -78, 'barrel'], [134, -74, 'barrel'],
      [56, -46, 'crate'], [66, -46, 'crate'], [-52, -46, 'crate'], [150, 42, 'sign'],
      [-154, 38, 'sign'], [12, 72, 'lamp'], [70, 72, 'lamp'], [-70, -10, 'lamp'],
    ];
    for (const [x, z, type] of positions) this.addProp(x, z, type);
  }

  clear() {
    for (const item of [...this.props, ...this.debris]) {
      this.group.remove(item.mesh);
      item.mesh.geometry.dispose();
      if (item.debris) item.mesh.material.dispose();
    }
    this.props.length = 0;
    this.debris.length = 0;
  }

  addProp(x, z, type) {
    const mesh = this.createMesh(type);
    mesh.position.set(x, type === 'cone' ? 0.55 : 0.75, z);
    mesh.castShadow = true;
    this.group.add(mesh);
    this.props.push({ mesh, type, radius: type === 'lamp' ? 1.1 : 2.2, broken: false });
  }

  createMesh(type) {
    if (type === 'cone') return new THREE.Mesh(new THREE.ConeGeometry(0.36, 1.1, 12), this.materials.cone);
    if (type === 'barrel') return new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.2, 14), this.materials.metal);
    if (type === 'crate') return new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.2, 1.5), this.materials.wood);
    if (type === 'glass') return new THREE.Mesh(new THREE.BoxGeometry(4.8, 1.9, 0.16), this.materials.glass);
    if (type === 'lamp') return new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 3.6, 8), this.materials.metal);
    if (type === 'sign') return new THREE.Mesh(new THREE.BoxGeometry(2.6, 1, 0.14), this.materials.metal);
    return new THREE.Mesh(new THREE.BoxGeometry(4, 0.75, 0.25), this.materials.wood);
  }

  update(dt, vehicles) {
    for (const prop of this.props) {
      if (prop.broken) continue;
      for (const vehicle of vehicles) {
        if (vehicle.destroyed || vehicle.speed < DESTRUCTIBLE_PROPS.impactSpeed) continue;
        if (vehicle.group.position.distanceTo(prop.mesh.position) < vehicle.stats.radius + prop.radius) {
          this.breakProp(prop, vehicle);
          break;
        }
      }
    }
    for (let i = this.debris.length - 1; i >= 0; i -= 1) {
      const item = this.debris[i];
      item.life -= dt;
      item.velocity.y -= 8 * dt;
      item.mesh.position.addScaledVector(item.velocity, dt);
      item.mesh.rotation.x += dt * item.spin;
      item.mesh.rotation.z += dt * item.spin * 0.7;
      if (item.life <= 0) {
        this.group.remove(item.mesh);
        item.mesh.geometry.dispose();
        item.mesh.material.dispose();
        this.debris.splice(i, 1);
      }
    }
  }

  breakProp(prop, vehicle) {
    prop.broken = true;
    prop.mesh.visible = false;
    this.effects.dust(prop.mesh.position, 2);
    this.effects.spark(prop.mesh.position, 6, 0xd6c3a6);
    this.audio.playCollision();
    this.onBreak?.({ prop, vehicle });
    const cap = DESTRUCTIBLE_PROPS.debrisCaps[this.settings.effectsQuality] || 70;
    while (this.debris.length > cap) {
      const old = this.debris.shift();
      this.group.remove(old.mesh);
      old.mesh.geometry.dispose();
      old.mesh.material.dispose();
    }
    for (let i = 0; i < 5; i += 1) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.22, 0.46), this.materials.metal.clone());
      mesh.position.copy(prop.mesh.position);
      mesh.position.y += 0.5;
      const direction = vehicle.velocity.clone().normalize();
      mesh.castShadow = true;
      this.group.add(mesh);
      this.debris.push({
        mesh,
        debris: true,
        velocity: new THREE.Vector3(direction.x + rand(-0.7, 0.7), rand(1.2, 3.8), direction.z + rand(-0.7, 0.7)).multiplyScalar(rand(2, 5)),
        life: DESTRUCTIBLE_PROPS.debrisLife,
        spin: rand(-5, 5),
      });
    }
  }
}
