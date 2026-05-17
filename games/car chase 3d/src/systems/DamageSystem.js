import * as THREE from 'three';

export class DamageSystem {
  constructor({ camera, renderer, effects, audio, hud }) {
    this.camera = camera;
    this.renderer = renderer;
    this.effects = effects;
    this.audio = audio;
    this.hud = hud;
    this.screen = new THREE.Vector3();
    this.onDamage = null;
  }

  setStatsCallback(callback) {
    this.onDamage = callback;
  }

  apply(target, amount, source = null, worldPosition = target.group.position, options = {}) {
    if (!target || target.destroyed || amount <= 0) return { adjusted: 0, destroyed: false };
    const adjusted = target.applyDamage(amount);
    this.onDamage?.({ target, source, amount: adjusted, destroyed: target.health <= 0, ability: options.ability || null });
    const color = target.faction === 'police' ? '#8fb8ff' : '#ff9b61';
    this.effects.spark(worldPosition, options.sparkCount ?? 8, options.sparkColor ?? 0xffba70);
    this.showDamageNumber(worldPosition, adjusted, color);

    if (target.health <= 0) {
      target.destroy();
      this.effects.explosion(target.group.position, target.type === 'swat' || target.type === 'robber' ? 1.25 : 1);
      this.audio.playExplosion();
      return { adjusted, destroyed: true };
    }

    return { adjusted, destroyed: false };
  }

  showDamageNumber(worldPosition, amount, color) {
    this.screen.copy(worldPosition);
    this.screen.y += 3;
    this.screen.project(this.camera);
    const x = (this.screen.x * 0.5 + 0.5) * this.renderer.domElement.clientWidth;
    const y = (-this.screen.y * 0.5 + 0.5) * this.renderer.domElement.clientHeight;
    this.hud.showDamage(amount, x, y, color);
  }
}
