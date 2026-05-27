export class TurnBannerVFX {
  constructor({ root }) {
    this.root = root;
    this.element = null;
    this.timeoutId = 0;
  }

  init() {
    if (!this.root || this.element) {
      return;
    }
    this.element = document.createElement('div');
    this.element.className = 'cinematic-feedback-banner';
    this.element.setAttribute('aria-live', 'polite');
    this.root.appendChild(this.element);
  }

  show({ eyebrow = 'Turn', title = '', detail = '', tone = 'default', reduced = false }) {
    this.init();
    if (!this.element) {
      return;
    }

    window.clearTimeout(this.timeoutId);
    this.element.dataset.tone = tone;
    this.element.innerHTML = `
      <span>${eyebrow}</span>
      <strong>${title}</strong>
      <em>${detail}</em>
    `;
    this.element.classList.add('is-visible');
    const compact = window.matchMedia?.('(max-width: 760px), (max-height: 560px)')?.matches;
    const duration = reduced ? 700 : compact ? 1150 : 1500;
    this.timeoutId = window.setTimeout(() => {
      this.element?.classList.remove('is-visible');
    }, duration);
  }

  clear() {
    window.clearTimeout(this.timeoutId);
    this.element?.classList.remove('is-visible');
  }

  dispose() {
    window.clearTimeout(this.timeoutId);
    this.element?.remove();
    this.element = null;
  }
}
