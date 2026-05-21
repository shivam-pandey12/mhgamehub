export class InputManager {
  constructor(root) {
    this.root = root;
    this.keys = new Set();
    this.once = new Set();
    this.touchState = {
      accelerate: false,
      brake: false,
      left: false,
      right: false,
      handbrake: false,
      boost: false
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  onKeyDown(event) {
    const key = this.normalize(event.key);
    if (!this.keys.has(key)) this.once.add(key);
    this.keys.add(key);

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(key)) {
      event.preventDefault();
    }
  }

  onKeyUp(event) {
    this.keys.delete(this.normalize(event.key));
  }

  normalize(key) {
    if (key === ' ') return 'Space';
    if (key.length === 1) return key.toLowerCase();
    return key;
  }

  consume(key) {
    const normalized = this.normalize(key);
    const has = this.once.has(normalized);
    this.once.delete(normalized);
    return has;
  }

  isDown(...keys) {
    return keys.some((key) => this.keys.has(this.normalize(key)));
  }

  bindTouchButton(element, action) {
    const set = (value) => {
      this.touchState[action] = value;
    };
    element.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      element.setPointerCapture?.(event.pointerId);
      set(true);
    });
    element.addEventListener('pointerup', () => set(false));
    element.addEventListener('pointercancel', () => set(false));
    element.addEventListener('lostpointercapture', () => set(false));
  }

  getDrivingInput() {
    const accelerate = this.isDown('w', 'ArrowUp') || this.touchState.accelerate;
    const brake = this.isDown('s', 'ArrowDown') || this.touchState.brake;
    const left = this.isDown('a', 'ArrowLeft') || this.touchState.left;
    const right = this.isDown('d', 'ArrowRight') || this.touchState.right;

    return {
      throttle: accelerate ? 1 : 0,
      brake: brake ? 1 : 0,
      steer: (left ? 1 : 0) + (right ? -1 : 0),
      handbrake: this.isDown('Space') || this.touchState.handbrake,
      boost: this.isDown('Shift') || this.touchState.boost
    };
  }

  dispose() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }
}
