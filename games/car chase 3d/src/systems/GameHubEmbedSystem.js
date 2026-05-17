import { GAMEHUB_METADATA } from '../config.js';

export class GameHubEmbedSystem {
  static exposeMetadata() {
    window.HEATLINE_CITY_METADATA = GAMEHUB_METADATA;
  }

  static supportsWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch {
      return false;
    }
  }

  static showError(message) {
    const error = document.querySelector('#webglError');
    if (!error) return;
    error.querySelector('strong').textContent = 'HEATLINE CITY cannot start';
    error.querySelector('span').textContent = message;
    error.classList.remove('is-hidden');
  }

  static hideLoading() {
    document.querySelector('#loadingScreen')?.classList.add('is-hidden');
  }

  static async toggleFullscreen() {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      // Fullscreen is optional inside GameHub embeds.
    }
  }
}
