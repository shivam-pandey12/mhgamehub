export class InputManager {
  constructor(target = window) {
    this.keys = new Set();
    this.mouseDown = false;
    this.edge = new Set();
    this.touchState = {
      throttle: 0,
      steer: 0,
      handbrake: false,
      nitro: false,
      primary: false,
      secondary: false,
      pause: false,
      recenter: false,
    };

    target.addEventListener('keydown', (event) => {
      const code = event.code;
      if (this.shouldPrevent(code)) event.preventDefault();
      if (!this.keys.has(code)) this.edge.add(code);
      this.keys.add(code);
    });

    target.addEventListener('keyup', (event) => {
      this.keys.delete(event.code);
    });

    window.addEventListener('mousedown', (event) => {
      if (event.button === 0) {
        this.mouseDown = true;
        this.edge.add('MouseLeft');
      }
    });

    window.addEventListener('mouseup', (event) => {
      if (event.button === 0) this.mouseDown = false;
    });

    window.addEventListener('blur', () => {
      this.keys.clear();
      this.edge.clear();
      this.mouseDown = false;
    });
  }

  shouldPrevent(code) {
    return [
      'KeyW',
      'KeyA',
      'KeyS',
      'KeyD',
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'Space',
      'ShiftLeft',
      'ShiftRight',
    ].includes(code);
  }

  getVehicleInput() {
    const accelerate = this.keys.has('ArrowUp');
    const reverse = this.keys.has('ArrowDown');
    const left = this.keys.has('ArrowLeft');
    const right = this.keys.has('ArrowRight');
    const weaponVector = this.getWeaponVector();
    const touch = this.touchState;

    return {
      throttle: accelerate ? 1 : reverse ? -1 : touch.throttle,
      brake: reverse || touch.throttle < 0,
      steer: (left ? 1 : 0) + (right ? -1 : 0) || touch.steer,
      handbrake: this.keys.has('Space') || touch.handbrake,
      nitro: this.keys.has('ShiftLeft') || this.keys.has('ShiftRight') || touch.nitro,
      primary: Boolean(weaponVector) || this.mouseDown || this.keys.has('KeyJ') || touch.primary,
      weaponVector,
      secondary: this.consume('KeyK') || this.consumeTouchSecondary(),
      reset: this.consume('KeyR'),
    };
  }

  getWeaponVector() {
    const x = (this.keys.has('KeyD') ? 1 : 0) + (this.keys.has('KeyA') ? -1 : 0);
    const z = (this.keys.has('KeyW') ? 1 : 0) + (this.keys.has('KeyS') ? -1 : 0);
    if (x === 0 && z === 0) return null;
    const length = Math.hypot(x, z) || 1;
    return { x: x / length, z: z / length };
  }

  consumePause() {
    if (this.touchState.pause) {
      this.touchState.pause = false;
      return true;
    }
    return this.consume('Escape');
  }

  consumeRecenter() {
    if (!this.touchState.recenter) return false;
    this.touchState.recenter = false;
    return true;
  }

  setTouchState(partial) {
    this.touchState = { ...this.touchState, ...partial };
  }

  clear() {
    this.keys.clear();
    this.edge.clear();
    this.mouseDown = false;
    this.touchState = {
      throttle: 0,
      steer: 0,
      handbrake: false,
      nitro: false,
      primary: false,
      secondary: false,
      pause: false,
      recenter: false,
    };
  }

  consumeTouchSecondary() {
    if (!this.touchState.secondary) return false;
    this.touchState.secondary = false;
    return true;
  }

  consume(code) {
    if (!this.edge.has(code)) return false;
    this.edge.delete(code);
    return true;
  }

  endFrame() {
    this.edge.clear();
  }
}
