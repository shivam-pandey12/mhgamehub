import * as THREE from 'three';

export class SceneManager {
  constructor(root) {
    this.root = root;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x86c8f8);
    this.scene.fog = new THREE.FogExp2(0xbadcf1, 0.0025);

    this.camera = new THREE.PerspectiveCamera(58, 1, 0.1, 900);
    this.camera.position.set(0, 32, -42);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.04;
    this.root.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.size = { width: 1, height: 1 };

    window.addEventListener('resize', () => this.resize());
    this.resize();
  }

  addBaseLighting() {
    const hemi = new THREE.HemisphereLight(0xeaf6ff, 0x9f8d72, 2.05);
    this.scene.add(hemi);

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
    this.scene.add(sun);

    const skyFill = new THREE.DirectionalLight(0xaed6ff, 0.82);
    skyFill.position.set(120, 70, -100);
    this.scene.add(skyFill);
  }

  resize() {
    const width = Math.max(1, window.innerWidth);
    const height = Math.max(1, window.innerHeight);
    this.size.width = width;
    this.size.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  getDelta() {
    return Math.min(0.04, this.clock.getDelta());
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
