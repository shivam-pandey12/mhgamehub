import { INPUT_KEYS } from './config';
import { signedAxis } from './math';
import type { GameSettings, MobileControlsMode } from './types';

const BLOCKED_CODES = new Set<string>([
  ...INPUT_KEYS.forward,
  ...INPUT_KEYS.left,
  ...INPUT_KEYS.right,
  ...INPUT_KEYS.jump,
  ...INPUT_KEYS.slide,
  ...INPUT_KEYS.dodge
]);

export class InputManager {
  private readonly pressed = new Set<string>();
  private jumpQueued = false;
  private slideQueued = false;
  private dodgeQueued = false;
  private attackQueued = false;
  private specialQueued = false;
  private pauseQueued = false;
  private restartQueued = false;
  private anyQueued = false;
  private host: HTMLElement | null = null;
  private touchRoot: HTMLDivElement | null = null;
  private mobileControlsMode: MobileControlsMode = 'auto';
  private touchAxis = 0;
  private touchAxisUntil = 0;
  private heldTouchAxis = 0;
  private touchStartX = 0;
  private touchStartY = 0;
  private touchStartTime = 0;
  private touchPointerId: number | null = null;

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (BLOCKED_CODES.has(event.code)) {
      event.preventDefault();
    }

    if (!this.pressed.has(event.code)) {
      this.queueFromCode(event.code);
      this.anyQueued = true;
    }

    this.pressed.add(event.code);
  };

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    this.pressed.delete(event.code);
  };

  private readonly onPointerDown = (event: PointerEvent): void => {
    const target = event.target as HTMLElement | null;
    if (target?.closest('.menu-shell, .touch-controls, button, input, select, textarea')) {
      return;
    }

    if (event.pointerType !== 'mouse' || event.button !== 0) {
      return;
    }

    this.attackQueued = true;
    this.anyQueued = true;
  };

  private readonly onTouchPointerDown = (event: PointerEvent): void => {
    if (!this.isTouchPointer(event) || !this.shouldShowTouchControls()) {
      return;
    }

    const target = event.target as HTMLElement | null;
    if (target?.closest('.menu-shell, .touch-controls')) {
      return;
    }

    event.preventDefault();
    this.touchPointerId = event.pointerId;
    this.touchStartX = event.clientX;
    this.touchStartY = event.clientY;
    this.touchStartTime = performance.now();
  };

  private readonly onTouchPointerMove = (event: PointerEvent): void => {
    if (event.pointerId !== this.touchPointerId || !this.shouldShowTouchControls()) {
      return;
    }

    event.preventDefault();
  };

  private readonly onTouchPointerUp = (event: PointerEvent): void => {
    if (event.pointerId !== this.touchPointerId || !this.shouldShowTouchControls()) {
      return;
    }

    event.preventDefault();
    this.touchPointerId = null;
    const dx = event.clientX - this.touchStartX;
    const dy = event.clientY - this.touchStartY;
    const elapsed = performance.now() - this.touchStartTime;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const swipeThreshold = 34;

    if (Math.max(absX, absY) < swipeThreshold && elapsed < 320) {
      this.attackQueued = true;
      this.anyQueued = true;
      return;
    }

    if (absX > absY) {
      this.touchAxis = dx > 0 ? 1 : -1;
      this.touchAxisUntil = performance.now() + 190;
    } else if (dy < 0) {
      this.jumpQueued = true;
    } else {
      this.slideQueued = true;
    }

    this.anyQueued = true;
  };

  private readonly onTouchButtonPointerDown = (event: PointerEvent): void => {
    const button = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-touch-action]');
    if (!button) {
      return;
    }

    event.preventDefault();
    const action = button.dataset.touchAction;
    this.queueTouchAction(action);
  };

  private readonly onTouchButtonPointerUp = (event: PointerEvent): void => {
    const button = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-touch-action]');
    if (!button) {
      return;
    }

    event.preventDefault();
    const action = button.dataset.touchAction;
    if (action === 'left' || action === 'right') {
      this.heldTouchAxis = 0;
    }
  };

  connect(host: HTMLElement = document.body): void {
    this.host = host;
    window.addEventListener('keydown', this.onKeyDown, { passive: false });
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('pointerdown', this.onPointerDown);
    host.addEventListener('pointerdown', this.onTouchPointerDown, { passive: false });
    host.addEventListener('pointermove', this.onTouchPointerMove, { passive: false });
    host.addEventListener('pointerup', this.onTouchPointerUp, { passive: false });
    host.addEventListener('pointercancel', this.onTouchPointerUp, { passive: false });
    this.renderTouchControls();
  }

  configure(settings: GameSettings): void {
    this.mobileControlsMode = settings.mobileControls;
    this.renderTouchControls();
  }

  dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('pointerdown', this.onPointerDown);
    this.host?.removeEventListener('pointerdown', this.onTouchPointerDown);
    this.host?.removeEventListener('pointermove', this.onTouchPointerMove);
    this.host?.removeEventListener('pointerup', this.onTouchPointerUp);
    this.host?.removeEventListener('pointercancel', this.onTouchPointerUp);
    this.touchRoot?.removeEventListener('pointerdown', this.onTouchButtonPointerDown);
    this.touchRoot?.removeEventListener('pointerup', this.onTouchButtonPointerUp);
    this.touchRoot?.removeEventListener('pointercancel', this.onTouchButtonPointerUp);
    this.touchRoot?.remove();
    this.touchRoot = null;
    this.pressed.clear();
  }

  get lateralAxis(): number {
    const keyboardAxis = signedAxis(this.isPressed(INPUT_KEYS.right), this.isPressed(INPUT_KEYS.left));
    if (keyboardAxis !== 0) {
      return keyboardAxis;
    }

    if (this.heldTouchAxis !== 0) {
      return this.heldTouchAxis;
    }

    if (performance.now() < this.touchAxisUntil) {
      return this.touchAxis;
    }

    return 0;
  }

  get forwardHeld(): boolean {
    return this.isPressed(INPUT_KEYS.forward);
  }

  get slideHeld(): boolean {
    return this.isPressed(INPUT_KEYS.slide);
  }

  consumeJump(): boolean {
    const value = this.jumpQueued;
    this.jumpQueued = false;
    return value;
  }

  consumeSlide(): boolean {
    const value = this.slideQueued;
    this.slideQueued = false;
    return value;
  }

  consumeDodge(): boolean {
    const value = this.dodgeQueued;
    this.dodgeQueued = false;
    return value;
  }

  consumeAttack(): boolean {
    const value = this.attackQueued;
    this.attackQueued = false;
    return value;
  }

  consumeSpecial(): boolean {
    const value = this.specialQueued;
    this.specialQueued = false;
    return value;
  }

  consumePause(): boolean {
    const value = this.pauseQueued;
    this.pauseQueued = false;
    return value;
  }

  consumeRestart(): boolean {
    const value = this.restartQueued;
    this.restartQueued = false;
    return value;
  }

  consumeAny(): boolean {
    const value = this.anyQueued;
    this.anyQueued = false;
    return value;
  }

  private queueFromCode(code: string): void {
    if (INPUT_KEYS.jump.includes(code as never)) {
      this.jumpQueued = true;
    }
    if (INPUT_KEYS.slide.includes(code as never)) {
      this.slideQueued = true;
    }
    if (INPUT_KEYS.dodge.includes(code as never)) {
      this.dodgeQueued = true;
    }
    if (INPUT_KEYS.attack.includes(code as never)) {
      this.attackQueued = true;
    }
    if (INPUT_KEYS.special.includes(code as never)) {
      this.specialQueued = true;
    }
    if (INPUT_KEYS.pause.includes(code as never)) {
      this.pauseQueued = true;
    }
    if (INPUT_KEYS.restart.includes(code as never)) {
      this.restartQueued = true;
    }
  }

  private queueTouchAction(action?: string): void {
    if (action === 'left') {
      this.heldTouchAxis = -1;
    } else if (action === 'right') {
      this.heldTouchAxis = 1;
    } else if (action === 'jump') {
      this.jumpQueued = true;
    } else if (action === 'slide') {
      this.slideQueued = true;
    } else if (action === 'dodge') {
      this.dodgeQueued = true;
    } else if (action === 'attack') {
      this.attackQueued = true;
    } else if (action === 'special') {
      this.specialQueued = true;
    } else if (action === 'pause') {
      this.pauseQueued = true;
    }

    this.anyQueued = true;
  }

  private renderTouchControls(): void {
    const host = this.host;
    if (!host) {
      return;
    }

    if (!this.touchRoot) {
      this.touchRoot = document.createElement('div');
      this.touchRoot.className = 'touch-controls';
      this.touchRoot.innerHTML = `
        <div class="touch-controls__move">
          <button data-touch-action="left" aria-label="Move left">&lt;</button>
          <button data-touch-action="right" aria-label="Move right">&gt;</button>
        </div>
        <div class="touch-controls__actions">
          <button data-touch-action="jump">Jump</button>
          <button data-touch-action="slide">Slide</button>
          <button data-touch-action="dodge">Dash</button>
          <button data-touch-action="attack">Hit</button>
          <button data-touch-action="special">Special</button>
          <button data-touch-action="pause">Pause</button>
        </div>
      `;
      this.touchRoot.addEventListener('pointerdown', this.onTouchButtonPointerDown, { passive: false });
      this.touchRoot.addEventListener('pointerup', this.onTouchButtonPointerUp, { passive: false });
      this.touchRoot.addEventListener('pointercancel', this.onTouchButtonPointerUp, { passive: false });
      host.appendChild(this.touchRoot);
    }

    this.touchRoot.classList.toggle('is-visible', this.shouldShowTouchControls());
  }

  private shouldShowTouchControls(): boolean {
    if (this.mobileControlsMode === 'off') {
      return false;
    }

    if (this.mobileControlsMode === 'on') {
      return true;
    }

    return this.isCoarsePointer();
  }

  private isTouchPointer(event: PointerEvent): boolean {
    return event.pointerType === 'touch' || event.pointerType === 'pen';
  }

  private isCoarsePointer(): boolean {
    return window.matchMedia?.('(pointer: coarse)').matches || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  private isPressed(codes: readonly string[]): boolean {
    return codes.some((code) => this.pressed.has(code));
  }
}
