import * as THREE from 'three';
import { CARROM_BOARD } from '../config/carrom-constants.js';
import { CollisionVFX } from './collision-vfx.js';
import { ParticlePool } from './particle-pool.js';
import { PocketVFX } from './pocket-vfx.js';
import { QueenVFX } from './queen-vfx.js';
import { ResultVFX } from './result-vfx.js';
import { ScreenShake } from './screen-shake.js';
import { TurnBannerVFX } from './turn-banner-vfx.js';

export class VFXManager {
  constructor({ sceneParent, root, theme }) {
    this.sceneParent = sceneParent;
    this.root = root;
    this.theme = theme;
    this.reducedEffects = false;
    this.baseQualityIntensity = 1;
    this.cosmeticIntensity = 1;
    this.qualityIntensity = 1;
    this.cosmeticPreset = {};
    this.lastCollision = 0;

    this.sparkMaterial = new THREE.MeshBasicMaterial({
      color: theme.scene.goldTrim,
      transparent: true,
      opacity: 0.72,
      depthWrite: false
    });
    this.sparkGeometry = new THREE.SphereGeometry(0.026, 10, 10);
    this.particles = new ParticlePool({
      parent: sceneParent,
      material: this.sparkMaterial,
      geometry: this.sparkGeometry,
      size: 54
    });
    this.pocket = new PocketVFX({ parent: sceneParent, theme });
    this.collision = new CollisionVFX({ parent: sceneParent, theme });
    this.queen = new QueenVFX({ parent: sceneParent, theme });
    this.result = new ResultVFX({ parent: sceneParent, theme });
    this.banner = new TurnBannerVFX({ root });
    this.shake = new ScreenShake({ target: root?.querySelector?.('.carrom-stage') || root });
  }

  playMatchIntro(players = [], matchInfo = {}) {
    const [one, two] = players;
    const vsBot = matchInfo.matchMode === 'vsBot' || Boolean(two?.isBot);
    const ruleMode = matchInfo.ruleModeLabel || 'Classic';
    const difficulty = matchInfo.botDifficultyLabel ? ` - ${matchInfo.botDifficultyLabel} Bot` : '';
    const detail = matchInfo.ruleMode === 'freeCapture'
      ? `${ruleMode}${difficulty} - Pocket any coin. Queen +3.`
      : `${ruleMode}${difficulty} - ${one?.color || 'White'} vs ${two?.color || 'Black'}`;
    this.banner.show({
      eyebrow: vsBot ? 'Human vs Bot' : 'Local Match',
      title: `${one?.name || 'Player 1'} vs ${two?.name || 'Player 2'}`,
      detail,
      tone: 'default',
      reduced: this.reducedEffects
    });
  }

  playTurnChange(player, continued = false) {
    this.banner.show({
      eyebrow: continued ? 'Extra Shot' : 'Turn Change',
      title: continued ? `${player.name} continues` : `${player.name} Turn`,
      detail: `${player.color || ''} coins`,
      tone: continued ? 'success' : 'default',
      reduced: this.reducedEffects
    });
  }

  playShotRelease(power = 0.5, position = { x: 0, z: CARROM_BOARD.BASELINE_OFFSET }) {
    const intensity = Math.min(Math.max(power, 0.2), 1.2) * this.qualityIntensity;
    const origin = new THREE.Vector3(position.x, CARROM_BOARD.SURFACE_Y + 0.09, position.z);
    this.particles.emit({
      position: origin,
      color: this.theme.scene.strikerGlow,
      count: this.getEffectCount(this.reducedEffects ? 3 : 8),
      speed: 0.42 * intensity,
      life: 0.34,
      scale: 0.7
    });
    this.shake.trigger(0.08 * intensity, 0.11);
  }

  playCoinCollision(event) {
    const now = performance.now();
    const cooldown = this.qualityIntensity < 0.6 ? 90 : 42;
    if (now - this.lastCollision < cooldown) {
      return;
    }
    this.lastCollision = now;
    const intensity = Math.min(Math.max(event.intensity || 0, 0), 1);
    if (intensity < (this.qualityIntensity < 0.7 ? 0.34 : 0.18)) {
      return;
    }
    this.collision.play(event.position, intensity, this.reducedEffects);
  }

  playPocketEffect(piece, pocketPosition) {
    const isQueen = piece.type === 'queen';
    const isStriker = piece.type === 'striker';
    const position = new THREE.Vector3(
      pocketPosition?.x ?? 0,
      CARROM_BOARD.SURFACE_Y + 0.08,
      pocketPosition?.z ?? 0
    );
    this.pocket.play(pocketPosition || { x: 0, z: 0 }, {
      queen: isQueen,
      foul: isStriker,
      reduced: this.reducedEffects
    });
    this.particles.emit({
      position,
      color: isStriker ? this.theme.scene.queen : isQueen ? this.theme.scene.queenRim : this.theme.scene.goldTrim,
      count: this.getEffectCount(this.reducedEffects ? 4 : isQueen ? 18 : 10),
      speed: (isQueen ? 0.92 : 0.62) * this.qualityIntensity,
      life: isQueen ? 0.78 : 0.5,
      scale: isQueen ? 1.1 : 0.85
    });
  }

  playQueenPocketEffect(position) {
    this.queen.play(position, 'pocketed', this.reducedEffects);
  }

  playQueenCoveredEffect() {
    this.queen.play({ x: 0, z: 0 }, 'covered', this.reducedEffects);
    this.banner.show({
      eyebrow: 'Queen',
      title: 'Queen Covered',
      detail: 'Royal finish secured',
      tone: 'success',
      reduced: this.reducedEffects
    });
  }

  playQueenReturnedEffect() {
    this.queen.play({ x: 0, z: 0 }, 'returned', this.reducedEffects);
    this.banner.show({
      eyebrow: 'Queen',
      title: 'Queen Returned',
      detail: 'Cover missed',
      tone: 'warning',
      reduced: this.reducedEffects
    });
  }

  playFoulEffect(foulType = 'Foul') {
    this.banner.show({
      eyebrow: 'Foul',
      title: foulType === 'strikerPocketed' ? 'Striker Pocketed' : 'Foul',
      detail: 'Turn changes after penalty',
      tone: 'danger',
      reduced: this.reducedEffects
    });
    this.shake.trigger(0.28, 0.18);
  }

  playWinnerEffect(winner) {
    this.result.play(this.reducedEffects);
    this.banner.show({
      eyebrow: 'Winner',
      title: `${winner?.name || 'Player'} Wins`,
      detail: `${winner?.color || ''} closes the table`,
      tone: 'success',
      reduced: this.reducedEffects
    });
  }

  playResetEffect() {
    this.clear();
    this.banner.show({
      eyebrow: 'Reset',
      title: 'Fresh Board',
      detail: 'Local match restarted',
      tone: 'default',
      reduced: this.reducedEffects
    });
  }

  update(delta) {
    this.particles.update(delta);
    this.pocket.update(delta);
    this.collision.update(delta);
    this.queen.update(delta);
    this.result.update(delta);
    this.shake.update(delta);
  }

  clear() {
    this.particles.clear();
    this.pocket.clear();
    this.collision.clear();
    this.queen.clear();
    this.result.clear();
    this.shake.clear();
  }

  applyTheme(theme) {
    this.theme = theme;
    const sparkColor = this.cosmeticPreset.sparkColor || theme.scene.goldTrim;
    this.sparkMaterial.color.set(sparkColor);
    this.particles.items.forEach((item) => item.mesh.material.color.set(sparkColor));
    this.pocket.applyTheme(theme);
    this.collision.applyTheme(theme);
    this.queen.applyTheme(theme);
    this.result.applyTheme(theme);
  }

  setCosmeticPreset(preset = {}) {
    this.cosmeticPreset = { ...(preset || {}) };
    this.cosmeticIntensity = Math.min(Math.max(Number(preset.intensity) || 1, 0.35), 1.2);
    this.updateEffectiveIntensity();
    const sparkColor = this.cosmeticPreset.sparkColor || this.theme.scene.goldTrim;
    this.sparkMaterial.color.set(sparkColor);
  }

  setReducedEffects(enabled) {
    this.reducedEffects = Boolean(enabled);
    this.shake.setReducedEffects(enabled);
  }

  setQualityProfile(profile) {
    this.baseQualityIntensity = Math.min(Math.max(profile?.vfxIntensity ?? 1, 0.25), 1);
    this.updateEffectiveIntensity();
  }

  updateEffectiveIntensity() {
    this.qualityIntensity = Math.min(Math.max(this.baseQualityIntensity * this.cosmeticIntensity, 0.2), 1.2);
  }

  getEffectCount(baseCount) {
    return Math.max(1, Math.round(baseCount * this.qualityIntensity));
  }

  dispose() {
    this.clear();
    this.particles.dispose();
    this.pocket.dispose();
    this.collision.dispose();
    this.queen.dispose();
    this.result.dispose();
    this.banner.dispose();
  }
}
