import * as THREE from '../../vendor/three.js';

export class EffectsManager {
  constructor(scene) {
    this.scene = scene;
    this.effects = [];
    this.coinGeometry = new THREE.TorusGeometry(0.65, 0.1, 8, 22);
    this.puffGeometry = new THREE.SphereGeometry(0.28, 8, 6);
    this.materials = {
      coin: new THREE.MeshStandardMaterial({
        color: '#f3c65f',
        emissive: '#b88720',
        emissiveIntensity: 0.4,
        metalness: 0.6,
        roughness: 0.28
      }),
      smoke: new THREE.MeshBasicMaterial({
        color: '#d7d8d2',
        transparent: true,
        opacity: 0.42,
        depthWrite: false
      }),
      boost: new THREE.MeshBasicMaterial({
        color: '#67d9ff',
        transparent: true,
        opacity: 0.5,
        depthWrite: false
      }),
      dust: new THREE.MeshBasicMaterial({
        color: '#c8b98a',
        transparent: true,
        opacity: 0.34,
        depthWrite: false
      }),
      spark: new THREE.MeshBasicMaterial({
        color: '#ffd36b',
        transparent: true,
        opacity: 0.82,
        depthWrite: false
      }),
      skid: new THREE.MeshBasicMaterial({
        color: '#111820',
        transparent: true,
        opacity: 0.28,
        depthWrite: false
      })
    };
  }

  createCoinMesh() {
    const mesh = new THREE.Mesh(this.coinGeometry, this.materials.coin);
    mesh.castShadow = true;
    mesh.userData.baseY = 1.15;
    return mesh;
  }

  spawnPuff(position, options = {}) {
    const material = options.boost ? this.materials.boost.clone() : this.materials.smoke.clone();
    if (options.color) material.color.set(options.color);
    const mesh = new THREE.Mesh(this.puffGeometry, material);
    mesh.position.copy(position);
    mesh.scale.setScalar(options.size ?? 1);
    this.scene.add(mesh);
    this.effects.push({
      mesh,
      material,
      age: 0,
      life: options.life ?? 0.7,
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.5,
        0.45 + Math.random() * 0.25,
        (Math.random() - 0.5) * 0.5
      )
    });
  }

  spawnDust(position) {
    const mesh = new THREE.Mesh(this.puffGeometry, this.materials.dust.clone());
    mesh.position.copy(position);
    mesh.scale.setScalar(0.72);
    this.scene.add(mesh);
    this.effects.push({
      mesh,
      material: mesh.material,
      age: 0,
      life: 0.46,
      velocity: new THREE.Vector3((Math.random() - 0.5) * 0.8, 0.35, (Math.random() - 0.5) * 0.8)
    });
  }

  spawnSparks(position) {
    for (let i = 0; i < 5; i += 1) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.42), this.materials.spark.clone());
      mesh.position.copy(position);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      this.scene.add(mesh);
      this.effects.push({
        mesh,
        material: mesh.material,
        age: 0,
        life: 0.28,
        velocity: new THREE.Vector3((Math.random() - 0.5) * 3, Math.random() * 1.7, (Math.random() - 0.5) * 3)
      });
    }
  }

  spawnSkid(position, heading) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.012, 1.4), this.materials.skid.clone());
    mesh.position.copy(position);
    mesh.position.y = 0.025;
    mesh.rotation.y = heading;
    this.scene.add(mesh);
    this.effects.push({
      mesh,
      material: mesh.material,
      age: 0,
      life: 5.5,
      velocity: new THREE.Vector3()
    });
  }

  update(dt) {
    for (let i = this.effects.length - 1; i >= 0; i -= 1) {
      const effect = this.effects[i];
      effect.age += dt;
      effect.mesh.position.addScaledVector(effect.velocity, dt);
      const t = effect.age / effect.life;
      effect.mesh.scale.multiplyScalar(1 + dt * 0.8);
      effect.material.opacity = Math.max(0, (1 - t) * 0.42);
      if (effect.age >= effect.life) {
        this.scene.remove(effect.mesh);
        effect.material.dispose();
        this.effects.splice(i, 1);
      }
    }
  }
}
