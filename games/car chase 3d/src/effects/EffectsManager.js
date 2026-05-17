import * as THREE from 'three';
import { angleToVector, rand } from '../utils/math.js';

export class EffectsManager {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.particles = [];
    this.skids = [];
    this.particleScale = 0.85;
    this.maxParticles = 220;
    this.maxSkids = 120;
    this.flashMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd48a,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.sparkGeometry = new THREE.SphereGeometry(0.12, 8, 6);
    this.smokeGeometry = new THREE.SphereGeometry(0.55, 10, 8);
    this.skidGeometry = new THREE.PlaneGeometry(0.42, 3.3);
    this.skidMaterial = new THREE.MeshBasicMaterial({
      color: 0x050506,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });
  }

  clear() {
    for (const item of [...this.particles, ...this.skids]) {
      this.group.remove(item.mesh);
    }
    this.particles.length = 0;
    this.skids.length = 0;
  }

  setQuality(quality) {
    this.particleScale = quality?.particles ?? 0.85;
    this.maxSkids = quality?.skids ?? 120;
    this.maxParticles = Math.floor(190 * this.particleScale + 80);
  }

  spark(position, count = 10, color = 0xffb166) {
    const total = Math.max(1, Math.floor(count * this.particleScale));
    for (let i = 0; i < total; i += 1) {
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(this.sparkGeometry, material);
      mesh.position.copy(position);
      mesh.position.y += rand(0.45, 1.6);
      const velocity = new THREE.Vector3(rand(-1, 1), rand(0.5, 2.4), rand(-1, 1))
        .normalize()
        .multiplyScalar(rand(8, 24));
      this.group.add(mesh);
      this.particles.push({ mesh, velocity, life: rand(0.22, 0.46), maxLife: 0.46, spin: rand(-5, 5) });
      this.trimParticles();
    }
  }

  smoke(position, count = 1, color = 0x24262a) {
    const total = Math.max(1, Math.floor(count * this.particleScale));
    for (let i = 0; i < total; i += 1) {
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(this.smokeGeometry, material);
      mesh.position.copy(position);
      mesh.position.y += rand(1.0, 2.0);
      mesh.scale.setScalar(rand(0.6, 1.1));
      const velocity = new THREE.Vector3(rand(-0.8, 0.8), rand(0.8, 2.1), rand(-0.8, 0.8));
      this.group.add(mesh);
      this.particles.push({ mesh, velocity, life: rand(1.0, 1.8), maxLife: 1.8, grow: rand(0.7, 1.4) });
      this.trimParticles();
    }
  }

  explosion(position, scale = 1) {
    const flash = new THREE.Mesh(
      new THREE.SphereGeometry(2.2 * scale, 18, 12),
      this.flashMaterial.clone(),
    );
    flash.position.copy(position);
    flash.position.y += 1.2;
    this.group.add(flash);
    this.particles.push({
      mesh: flash,
      velocity: new THREE.Vector3(0, 4, 0),
      life: 0.28,
      maxLife: 0.28,
      grow: 5.5,
      disposeGeometry: true,
    });
    this.spark(position, Math.floor(22 * scale), 0xff8d42);
    this.smoke(position, Math.floor(8 * scale), 0x14161a);
  }

  dust(position, count = 1) {
    this.smoke(position, count, 0xb99b72);
  }

  empPulse(position, scale = 1) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.1 * scale, 0.08, 8, 40),
      new THREE.MeshBasicMaterial({
        color: 0x4da3ff,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    ring.position.copy(position);
    ring.position.y += 1.2;
    ring.rotation.x = Math.PI / 2;
    this.group.add(ring);
    this.particles.push({
      mesh: ring,
      velocity: new THREE.Vector3(0, 1, 0),
      life: 0.42,
      maxLife: 0.42,
      grow: 7,
      disposeGeometry: true,
    });
  }

  muzzleFlash(vehicle, direction = null, origin = null) {
    const forward = direction?.clone?.().normalize?.() || angleToVector(vehicle.yaw);
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.34, 8, 6), this.flashMaterial.clone());
    if (origin) {
      mesh.position.copy(origin);
    } else {
      mesh.position.copy(vehicle.group.position.clone().add(forward.clone().multiplyScalar(vehicle.length * 0.58)));
      mesh.position.y += 1.65;
    }
    this.group.add(mesh);
    this.particles.push({
      mesh,
      velocity: forward.clone().multiplyScalar(16),
      life: 0.08,
      maxLife: 0.08,
      grow: 5,
      disposeGeometry: true,
    });
  }

  nitroFlame(vehicle) {
    const back = angleToVector(vehicle.yaw).multiplyScalar(-1);
    const right = new THREE.Vector3(Math.cos(vehicle.yaw), 0, -Math.sin(vehicle.yaw));
    for (const side of [-1, 1]) {
      const mesh = new THREE.Mesh(new THREE.ConeGeometry(0.26, 1.2, 10), this.flashMaterial.clone());
      mesh.position
        .copy(vehicle.group.position)
        .add(back.clone().multiplyScalar(vehicle.length * 0.54))
        .add(right.clone().multiplyScalar(side * vehicle.width * 0.28));
      mesh.position.y += 0.72;
      mesh.rotation.x = Math.PI / 2;
      mesh.rotation.z = -vehicle.yaw;
      this.group.add(mesh);
      this.particles.push({
        mesh,
        velocity: back.clone().multiplyScalar(18),
        life: 0.08,
        maxLife: 0.08,
        grow: 1.4,
        disposeGeometry: true,
      });
    }
  }

  skid(position, yaw, intensity = 1) {
    if (this.skids.length > this.maxSkids) {
      const old = this.skids.shift();
      this.group.remove(old.mesh);
    }
    const mesh = new THREE.Mesh(this.skidGeometry, this.skidMaterial.clone());
    mesh.position.copy(position);
    mesh.position.y = 0.034;
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = -yaw;
    mesh.material.opacity = 0.22 + intensity * 0.22;
    this.group.add(mesh);
    this.skids.push({ mesh, life: 8.5, maxLife: 8.5 });
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      const item = this.particles[i];
      item.life -= dt;
      item.velocity.y -= 7.5 * dt;
      item.mesh.position.addScaledVector(item.velocity, dt);
      if (item.grow) item.mesh.scale.addScalar(item.grow * dt);
      item.mesh.rotation.y += (item.spin || 0) * dt;
      const ratio = Math.max(0, item.life / item.maxLife);
      item.mesh.material.opacity = Math.min(item.mesh.material.opacity, ratio);
      if (item.life <= 0) {
        this.group.remove(item.mesh);
        if (item.disposeGeometry) item.mesh.geometry?.dispose?.();
        item.mesh.material?.dispose?.();
        this.particles.splice(i, 1);
      }
    }

    for (let i = this.skids.length - 1; i >= 0; i -= 1) {
      const item = this.skids[i];
      item.life -= dt;
      item.mesh.material.opacity = 0.42 * Math.max(0, item.life / item.maxLife);
      if (item.life <= 0) {
        this.group.remove(item.mesh);
        item.mesh.material.dispose();
        this.skids.splice(i, 1);
      }
    }
  }

  trimParticles() {
    while (this.particles.length > this.maxParticles) {
      const old = this.particles.shift();
      this.group.remove(old.mesh);
      if (old.disposeGeometry) old.mesh.geometry?.dispose?.();
      old.mesh.material?.dispose?.();
    }
  }
}
