import * as THREE from 'three';

export class DayEnvironmentManager {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.scene = sceneManager.scene;
    this.clouds = [];
    this.group = new THREE.Group();
    this.group.name = 'DayEnvironment';
  }

  apply() {
    this.scene.background = new THREE.Color(0x86c8f8);
    this.scene.fog = new THREE.FogExp2(0xbadcf1, 0.0025);
    this.sceneManager.renderer.toneMappingExposure = 1.08;
    this.scene.add(this.group);

    const hemi = new THREE.HemisphereLight(0xeaf6ff, 0x9f8d72, 2.05);
    this.group.add(hemi);

    const sun = new THREE.DirectionalLight(0xffe0aa, 3.25);
    sun.position.set(-92, 136, 78);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -230;
    sun.shadow.camera.right = 230;
    sun.shadow.camera.top = 190;
    sun.shadow.camera.bottom = -190;
    sun.shadow.camera.near = 10;
    sun.shadow.camera.far = 330;
    sun.shadow.bias = -0.00015;
    this.group.add(sun);

    const fill = new THREE.DirectionalLight(0xaed6ff, 0.82);
    fill.position.set(120, 70, -100);
    this.group.add(fill);

    this.addClouds();
  }

  addClouds() {
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.58,
      depthWrite: false,
    });
    for (let i = 0; i < 18; i += 1) {
      const cloud = new THREE.Group();
      cloud.position.set(-210 + i * 26, 72 + (i % 3) * 9, -140 + (i % 6) * 48);
      cloud.userData.speed = 1.4 + (i % 5) * 0.22;
      for (let j = 0; j < 4; j += 1) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(7 + j * 1.4, 14, 8), material.clone());
        puff.scale.set(1.9, 0.28, 0.72);
        puff.position.set(j * 8 - 12, Math.sin(j) * 0.8, (j % 2) * 4);
        cloud.add(puff);
      }
      this.clouds.push(cloud);
      this.group.add(cloud);
    }
  }

  update(dt) {
    for (const cloud of this.clouds) {
      cloud.position.x += cloud.userData.speed * dt;
      if (cloud.position.x > 238) cloud.position.x = -238;
    }
  }
}
