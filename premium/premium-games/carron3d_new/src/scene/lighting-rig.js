import * as THREE from 'three';

export class LightingRig {
  constructor(scene, theme) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.ambient = new THREE.AmbientLight(theme.scene.light, 0.95);
    this.hemisphere = new THREE.HemisphereLight(theme.scene.light, theme.scene.fog, 1.18);
    this.key = new THREE.DirectionalLight(theme.scene.light, 2.45);
    this.fill = new THREE.DirectionalLight(theme.scene.rim, 0.82);
    this.rim = new THREE.PointLight(theme.scene.glow, 2.55, 18, 1.8);
    this.tableGlow = new THREE.PointLight(theme.scene.glow, 1.35, 9, 2.2);
    this.boardSpot = new THREE.SpotLight(theme.scene.light, 1.65, 16, Math.PI / 6, 0.52, 1.4);

    this.key.position.set(5.6, 8.8, 5.8);
    this.key.castShadow = true;
    this.key.shadow.mapSize.set(2048, 2048);
    this.key.shadow.camera.near = 0.5;
    this.key.shadow.camera.far = 28;
    this.key.shadow.camera.left = -10;
    this.key.shadow.camera.right = 10;
    this.key.shadow.camera.top = 10;
    this.key.shadow.camera.bottom = -10;
    this.key.shadow.bias = -0.00018;

    this.fill.position.set(-6.8, 4.6, -4.5);
    this.rim.position.set(0, 2.8, -3.9);
    this.tableGlow.position.set(0, 1.15, 1.35);
    this.boardSpot.position.set(-2.4, 5.8, 3.4);
    this.boardSpot.target.position.set(0, 0.08, 0);
    this.boardSpot.castShadow = true;
    this.boardSpot.shadow.mapSize.set(1024, 1024);
    this.boardSpot.shadow.bias = -0.00012;

    this.group.add(this.ambient, this.hemisphere, this.key, this.fill, this.rim, this.tableGlow, this.boardSpot, this.boardSpot.target);
  }

  applyTheme(theme) {
    this.ambient.color.set(theme.scene.light);
    this.hemisphere.color.set(theme.scene.light);
    this.hemisphere.groundColor.set(theme.scene.fog);
    this.key.color.set(theme.scene.light);
    this.fill.color.set(theme.scene.rim);
    this.rim.color.set(theme.scene.glow);
    this.tableGlow.color.set(theme.scene.glow);
    this.boardSpot.color.set(theme.scene.light);
  }

  applyQuality(profile) {
    if (!profile) {
      return;
    }

    this.key.castShadow = Boolean(profile.shadowEnabled);
    this.boardSpot.castShadow = Boolean(profile.shadowEnabled);
    this.key.shadow.mapSize.set(profile.keyShadowMapSize, profile.keyShadowMapSize);
    this.boardSpot.shadow.mapSize.set(profile.spotShadowMapSize, profile.spotShadowMapSize);
    this.key.shadow.map?.dispose?.();
    this.boardSpot.shadow.map?.dispose?.();
    this.key.shadow.map = null;
    this.boardSpot.shadow.map = null;
    this.key.shadow.needsUpdate = true;
    this.boardSpot.shadow.needsUpdate = true;
  }

  dispose() {
    this.scene.remove(this.group);
  }
}
