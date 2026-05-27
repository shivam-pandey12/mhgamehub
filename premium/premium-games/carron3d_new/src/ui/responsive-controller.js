export class ResponsiveController {
  constructor(root) {
    this.root = root;
    this.handleResize = () => this.update();
  }

  init() {
    this.update();
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange', this.handleResize);
  }

  update() {
    const width = window.innerWidth || 0;
    const height = window.innerHeight || 0;
    const mobile = width <= 760;
    const compact = width <= 1080 || height <= 760;
    const portrait = height > width;

    this.root.classList.toggle('is-mobile', mobile);
    this.root.classList.toggle('is-compact', compact);
    this.root.classList.toggle('is-portrait', portrait);
    this.root.classList.toggle('is-landscape', !portrait);
  }

  dispose() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
  }
}
