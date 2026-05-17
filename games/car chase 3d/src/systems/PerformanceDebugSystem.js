import { PERFORMANCE_DEBUG } from '../config.js';

export class PerformanceDebugSystem {
  constructor() {
    this.visible = PERFORMANCE_DEBUG.visibleByDefault;
    this.timer = 0;
    this.frames = 0;
    this.fps = 0;
    this.el = document.createElement('div');
    this.el.className = 'performance-debug is-hidden';
    document.body.appendChild(this.el);
  }

  setVisible(value) {
    this.visible = Boolean(value);
    this.el.classList.toggle('is-hidden', !this.visible);
  }

  update(dt, data = {}) {
    this.frames += 1;
    this.timer += dt;
    if (this.timer >= PERFORMANCE_DEBUG.sampleWindow) {
      this.fps = Math.round(this.frames / this.timer);
      this.frames = 0;
      this.timer = 0;
    }
    if (!this.visible) return;
    this.el.innerHTML = `
      <strong>HEATLINE DEBUG</strong>
      <span>FPS ${this.fps}</span>
      <span>AI ${data.ai || 0}</span>
      <span>Traffic ${data.traffic || 0}</span>
      <span>Projectiles ${data.projectiles || 0}</span>
      <span>Particles ${data.particles || 0}</span>
      <span>District ${data.district || '-'}</span>
      <span>Event ${data.event || '-'}</span>
      <span>Wanted ${data.wanted || 0}</span>
      <span>State ${data.chaseState || '-'}</span>
    `;
  }
}
