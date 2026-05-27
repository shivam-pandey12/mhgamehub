import * as THREE from 'three';
import { composeBoardStyleTheme } from '../config/carrom-constants.js';

export class MaterialLibrary {
  constructor(theme) {
    this.theme = theme;
    this.boardStyleId = 'ivory';
    this.cosmeticScene = {};
    this.materials = new Map();
    this.createMaterials(theme);
  }

  getEffectiveScene(theme = this.theme, boardStyleId = this.boardStyleId) {
    return {
      ...composeBoardStyleTheme(theme, boardStyleId).scene,
      ...this.cosmeticScene
    };
  }

  createMaterials(theme) {
    const scene = this.getEffectiveScene(theme, this.boardStyleId);
    this.materials.set('tableBase', new THREE.MeshStandardMaterial({
      color: scene.tableBase,
      roughness: 0.92,
      metalness: 0.02
    }));
    this.materials.set('boardSurface', new THREE.MeshStandardMaterial({
      color: scene.boardSurface,
      roughness: 0.78,
      metalness: 0.03
    }));
    this.materials.set('outerFrame', new THREE.MeshStandardMaterial({
      color: scene.outerFrame,
      roughness: 0.46,
      metalness: 0.16
    }));
    this.materials.set('frameSide', new THREE.MeshStandardMaterial({
      color: scene.frameSide,
      roughness: 0.58,
      metalness: 0.1
    }));
    this.materials.set('goldTrim', new THREE.MeshStandardMaterial({
      color: scene.goldTrim,
      emissive: new THREE.Color(scene.glow),
      emissiveIntensity: 0.07,
      roughness: 0.26,
      metalness: 0.58
    }));
    this.materials.set('strikerRing', new THREE.MeshStandardMaterial({
      color: scene.strikerRing || scene.goldTrim,
      emissive: new THREE.Color(scene.strikerGlow || scene.glow),
      emissiveIntensity: 0.06,
      roughness: 0.24,
      metalness: 0.56
    }));
    this.materials.set('pocketDark', new THREE.MeshStandardMaterial({
      color: scene.pocketDark,
      roughness: 0.9,
      metalness: 0.02
    }));
    this.materials.set('pocketRim', new THREE.MeshStandardMaterial({
      color: scene.pocketRim,
      emissive: new THREE.Color(scene.glow),
      emissiveIntensity: 0.05,
      roughness: 0.3,
      metalness: 0.48
    }));
    this.materials.set('markingLine', new THREE.MeshBasicMaterial({
      color: scene.markingLine,
      transparent: true,
      opacity: 0.82,
      depthWrite: false
    }));
    this.materials.set('whiteCoin', new THREE.MeshStandardMaterial({
      color: scene.whiteCoin,
      roughness: 0.42,
      metalness: 0.05
    }));
    this.materials.set('whiteCoinRim', new THREE.MeshStandardMaterial({
      color: scene.whiteCoinRim,
      emissive: new THREE.Color(scene.glow),
      emissiveIntensity: 0.04,
      roughness: 0.28,
      metalness: 0.46
    }));
    this.materials.set('blackCoin', new THREE.MeshStandardMaterial({
      color: scene.blackCoin,
      roughness: 0.36,
      metalness: 0.12
    }));
    this.materials.set('blackCoinRim', new THREE.MeshStandardMaterial({
      color: scene.blackCoinRim,
      emissive: new THREE.Color(scene.glow),
      emissiveIntensity: 0.04,
      roughness: 0.28,
      metalness: 0.5
    }));
    this.materials.set('queen', new THREE.MeshStandardMaterial({
      color: scene.queen,
      emissive: new THREE.Color(scene.queen),
      emissiveIntensity: 0.05,
      roughness: 0.38,
      metalness: 0.08
    }));
    this.materials.set('queenRim', new THREE.MeshStandardMaterial({
      color: scene.queenRim,
      emissive: new THREE.Color(scene.glow),
      emissiveIntensity: 0.06,
      roughness: 0.24,
      metalness: 0.55
    }));
    this.materials.set('striker', new THREE.MeshStandardMaterial({
      color: scene.striker,
      emissive: new THREE.Color(scene.strikerGlow),
      emissiveIntensity: 0.08,
      roughness: 0.32,
      metalness: 0.08
    }));
    this.materials.set('strikerGlow', new THREE.MeshBasicMaterial({
      color: scene.strikerGlow,
      transparent: true,
      opacity: 0.22,
      depthWrite: false
    }));
    this.materials.set('softShadow', new THREE.MeshBasicMaterial({
      color: scene.shadow,
      transparent: true,
      opacity: 0.13,
      depthWrite: false
    }));
  }

  get(name) {
    return this.materials.get(name);
  }

  applyTheme(theme, boardStyleId = this.boardStyleId, cosmeticScene = this.cosmeticScene) {
    this.theme = theme;
    this.boardStyleId = boardStyleId || 'ivory';
    this.cosmeticScene = { ...(cosmeticScene || {}) };
    const scene = this.getEffectiveScene(theme, this.boardStyleId);
    this.setColor('tableBase', scene.tableBase);
    this.setColor('boardSurface', scene.boardSurface);
    this.setColor('outerFrame', scene.outerFrame);
    this.setColor('frameSide', scene.frameSide);
    this.setColor('goldTrim', scene.goldTrim, scene.glow);
    this.setColor('strikerRing', scene.strikerRing || scene.goldTrim, scene.strikerGlow || scene.glow);
    this.setColor('pocketDark', scene.pocketDark);
    this.setColor('pocketRim', scene.pocketRim, scene.glow);
    this.setColor('markingLine', scene.markingLine);
    this.setColor('whiteCoin', scene.whiteCoin);
    this.setColor('whiteCoinRim', scene.whiteCoinRim, scene.glow);
    this.setColor('blackCoin', scene.blackCoin);
    this.setColor('blackCoinRim', scene.blackCoinRim, scene.glow);
    this.setColor('queen', scene.queen, scene.queen);
    this.setColor('queenRim', scene.queenRim, scene.glow);
    this.setColor('striker', scene.striker, scene.strikerGlow);
    this.setColor('strikerGlow', scene.strikerGlow);
    this.setColor('softShadow', scene.shadow);
  }

  applyBoardStyle(boardStyleId) {
    this.applyTheme(this.theme, boardStyleId);
  }

  applyCosmetics(cosmeticScene = {}) {
    this.applyTheme(this.theme, this.boardStyleId, cosmeticScene);
  }

  setColor(name, color, emissive = null) {
    const material = this.materials.get(name);
    if (!material) {
      return;
    }
    material.color?.set(color);
    if (emissive && material.emissive) {
      material.emissive.set(emissive);
    }
  }

  dispose() {
    this.materials.forEach((material) => material.dispose());
    this.materials.clear();
  }
}
