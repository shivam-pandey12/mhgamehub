import * as THREE from '../vendor/three.js';

export class SceneManager {
  constructor(root) {
    this.root = root;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    this.renderer.setSize(root.clientWidth, root.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    root.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#bfe9ff');
    this.scene.fog = new THREE.Fog('#dff4ff', 190, 760);
    this.camera = new THREE.PerspectiveCamera(62, 1, 0.1, 1200);
    this.camera.position.set(0, 12, -18);

    this.clock = new THREE.Clock();
    this.size = { width: 1, height: 1 };
    this.buildLighting();
    this.buildSky();
    this.resize();
  }

  buildLighting() {
    const hemi = new THREE.HemisphereLight('#e9f8ff', '#bfa56e', 1.2);
    this.scene.add(hemi);

    const sun = new THREE.DirectionalLight('#fff0c8', 2.8);
    sun.position.set(-42, 78, 38);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -330;
    sun.shadow.camera.right = 330;
    sun.shadow.camera.top = 330;
    sun.shadow.camera.bottom = -330;
    sun.shadow.camera.near = 10;
    sun.shadow.camera.far = 520;
    this.scene.add(sun);

    const fill = new THREE.DirectionalLight('#d8f3ff', 0.8);
    fill.position.set(44, 38, -32);
    this.scene.add(fill);
  }

  buildSky() {
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(660, 32, 16),
      new THREE.MeshBasicMaterial({ color: '#c6ecff', side: THREE.BackSide })
    );
    this.scene.add(sky);

    const skyPuffMat = new THREE.MeshBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.72,
      depthWrite: false
    });
    const skyPuffGeo = new THREE.SphereGeometry(1, 12, 8);
    [[-184, 54, -240], [44, 60, -292], [260, 50, 82], [-250, 58, 154], [8, 68, 284], [190, 62, -210]].forEach((pos, index) => {
      const skyPuffGroup = new THREE.Group();
      for (let i = 0; i < 5; i += 1) {
        const puff = new THREE.Mesh(skyPuffGeo, skyPuffMat);
        puff.position.set(i * 2.2, Math.sin(i) * 0.45, (i % 2) * 0.7);
        puff.scale.set(3 + i * 0.4, 1.1 + (i % 2) * 0.3, 1.4);
        skyPuffGroup.add(puff);
      }
      skyPuffGroup.position.set(pos[0], pos[1], pos[2]);
      skyPuffGroup.rotation.y = index * 0.4;
      this.scene.add(skyPuffGroup);
    });
  }

  resize() {
    const width = Math.max(1, this.root.clientWidth);
    const height = Math.max(1, this.root.clientHeight);
    if (width === this.size.width && height === this.size.height) return;
    this.size = { width, height };
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  render(camera = this.camera, scene = this.scene) {
    this.renderer.render(scene, camera);
  }
}
