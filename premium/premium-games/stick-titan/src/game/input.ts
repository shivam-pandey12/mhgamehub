import { clamp } from './math';
import type { InputState, WeaponMode } from './types';

const DASH_TAP_WINDOW_MS = 230;

const KEY_MAP: Record<
  | 'left'
  | 'right'
  | 'up'
  | 'down'
  | 'jump'
  | 'block'
  | 'reload'
  | 'restart'
  | 'power'
  | 'rage'
  | 'shockwave'
  | 'finisher'
  | 'help'
  | 'debug'
  | 'light'
  | 'heavy'
  | 'special',
  string[]
> = {
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
  up: ['KeyW', 'ArrowUp'],
  down: ['KeyS', 'ArrowDown'],
  jump: ['Space', 'KeyW', 'ArrowUp'],
  block: ['ShiftLeft', 'ShiftRight'],
  reload: ['KeyR'],
  restart: ['Enter'],
  power: ['KeyE'],
  rage: ['KeyF'],
  shockwave: ['KeyQ'],
  finisher: ['KeyX'],
  help: ['Tab'],
  debug: ['Backquote'],
  light: ['KeyJ'],
  heavy: ['KeyK'],
  special: ['KeyL'],
};

const WEAPON_KEYS: Record<string, WeaponMode> = {
  Digit1: 'sword',
  Digit2: 'gun',
  Digit3: 'power',
};

export class InputController {
  private readonly heldKeys = new Set<string>();
  private mouseLightHeld = false;
  private mouseHeavyHeld = false;
  private keyLightHeld = false;
  private keyHeavyHeld = false;
  private keySpecialHeld = false;
  private lightPressed = false;
  private heavyPressed = false;
  private specialPressed = false;
  private jumpPressed = false;
  private reloadPressed = false;
  private restartPressed = false;
  private powerPressed = false;
  private ragePressed = false;
  private shockwavePressed = false;
  private finisherPressed = false;
  private helpPressed = false;
  private debugPressed = false;
  private weaponSlotRequest: WeaponMode | null = null;
  private dashDirection: -1 | 0 | 1 = 0;
  private lastLeftTap = 0;
  private lastRightTap = 0;
  private previousGamepadButtons: boolean[] = [];
  private previousGamepadMoveX = 0;

  private isEditableTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    if (target.isContentEditable) {
      return true;
    }

    const tagName = target.tagName;
    return tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT';
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (this.isEditableTarget(event.target)) {
      return;
    }

    const alreadyHeld = this.heldKeys.has(event.code);
    this.heldKeys.add(event.code);

    if (KEY_MAP.jump.includes(event.code)) {
      event.preventDefault();
      if (!alreadyHeld) {
        this.jumpPressed = true;
      }
    }

    if (KEY_MAP.help.includes(event.code)) {
      event.preventDefault();
      if (!alreadyHeld) {
        this.helpPressed = true;
      }
    }

    if (KEY_MAP.debug.includes(event.code) && !alreadyHeld) {
      this.debugPressed = true;
    }

    if (KEY_MAP.reload.includes(event.code) && !alreadyHeld) {
      this.reloadPressed = true;
    }

    if (KEY_MAP.restart.includes(event.code) && !alreadyHeld) {
      this.restartPressed = true;
    }

    if (KEY_MAP.power.includes(event.code) && !alreadyHeld) {
      this.powerPressed = true;
    }

    if (KEY_MAP.rage.includes(event.code) && !alreadyHeld) {
      this.ragePressed = true;
    }

    if (KEY_MAP.shockwave.includes(event.code) && !alreadyHeld) {
      this.shockwavePressed = true;
    }

    if (KEY_MAP.finisher.includes(event.code) && !alreadyHeld) {
      this.finisherPressed = true;
    }

    if (KEY_MAP.light.includes(event.code)) {
      event.preventDefault();
      this.keyLightHeld = true;
      if (!alreadyHeld) {
        this.lightPressed = true;
      }
    }

    if (KEY_MAP.heavy.includes(event.code)) {
      event.preventDefault();
      this.keyHeavyHeld = true;
      if (!alreadyHeld) {
        this.heavyPressed = true;
      }
    }

    if (KEY_MAP.special.includes(event.code)) {
      event.preventDefault();
      this.keySpecialHeld = true;
      if (!alreadyHeld) {
        this.specialPressed = true;
      }
    }

    if (event.code in WEAPON_KEYS && !alreadyHeld) {
      this.weaponSlotRequest = WEAPON_KEYS[event.code];
    }

    if (!alreadyHeld && KEY_MAP.left.includes(event.code)) {
      event.preventDefault();
      const now = performance.now();
      if (now - this.lastLeftTap <= DASH_TAP_WINDOW_MS) {
        this.dashDirection = -1;
      }
      this.lastLeftTap = now;
    }

    if (!alreadyHeld && KEY_MAP.right.includes(event.code)) {
      event.preventDefault();
      const now = performance.now();
      if (now - this.lastRightTap <= DASH_TAP_WINDOW_MS) {
        this.dashDirection = 1;
      }
      this.lastRightTap = now;
    }
  };

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    if (this.isEditableTarget(event.target)) {
      return;
    }

    this.heldKeys.delete(event.code);

    if (KEY_MAP.light.includes(event.code)) {
      this.keyLightHeld = false;
    }

    if (KEY_MAP.heavy.includes(event.code)) {
      this.keyHeavyHeld = false;
    }

    if (KEY_MAP.special.includes(event.code)) {
      this.keySpecialHeld = false;
    }
  };

  private readonly onMouseDown = (event: MouseEvent): void => {
    if (event.button === 0) {
      this.mouseLightHeld = true;
      this.lightPressed = true;
      return;
    }

    if (event.button === 2) {
      this.mouseHeavyHeld = true;
      this.heavyPressed = true;
    }
  };

  private readonly onMouseUp = (event: MouseEvent): void => {
    if (event.button === 0) {
      this.mouseLightHeld = false;
      return;
    }

    if (event.button === 2) {
      this.mouseHeavyHeld = false;
    }
  };

  private readonly onContextMenu = (event: MouseEvent): void => {
    event.preventDefault();
  };

  constructor(private readonly canvas: HTMLCanvasElement) {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    this.canvas.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    this.canvas.addEventListener('contextmenu', this.onContextMenu);
  }

  dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.canvas.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    this.canvas.removeEventListener('contextmenu', this.onContextMenu);
  }

  snapshot(): InputState {
    const gamepad = this.readGamepadState();
    const left = Math.max(this.axis(KEY_MAP.left), gamepad.left ? 1 : 0);
    const right = Math.max(this.axis(KEY_MAP.right), gamepad.right ? 1 : 0);
    const up = Math.max(this.axis(KEY_MAP.up), gamepad.up ? 1 : 0);
    const down = Math.max(this.axis(KEY_MAP.down), gamepad.down ? 1 : 0);

    const state: InputState = {
      moveX: clamp(right - left, -1, 1),
      moveY: clamp(up - down, -1, 1),
      jumpHeld: this.anyHeld(KEY_MAP.jump) || gamepad.jumpHeld,
      jumpPressed: this.jumpPressed || gamepad.jumpPressed,
      upHeld: this.anyHeld(KEY_MAP.up) || gamepad.up,
      downHeld: this.anyHeld(KEY_MAP.down) || gamepad.down,
      blockHeld: this.anyHeld(KEY_MAP.block) || gamepad.blockHeld,
      lightHeld: this.mouseLightHeld || this.keyLightHeld,
      lightPressed: this.lightPressed || gamepad.lightPressed,
      heavyHeld: this.mouseHeavyHeld || this.keyHeavyHeld,
      heavyPressed: this.heavyPressed || gamepad.heavyPressed,
      specialHeld: this.keySpecialHeld || gamepad.specialHeld,
      specialPressed: this.specialPressed || gamepad.specialPressed,
      reloadPressed: this.reloadPressed || gamepad.reloadPressed,
      powerPressed: this.powerPressed,
      ragePressed: this.ragePressed || gamepad.ragePressed,
      shockwavePressed: this.shockwavePressed || gamepad.contextPressed,
      finisherPressed: this.finisherPressed || gamepad.contextPressed,
      restartPressed: this.restartPressed,
      helpPressed: this.helpPressed || gamepad.helpPressed,
      debugPressed: this.debugPressed || gamepad.debugPressed,
      weaponSlotRequest: this.weaponSlotRequest,
      dashDirection: this.dashDirection !== 0 ? this.dashDirection : gamepad.dashDirection,
      mouseDeltaX: 0,
      mouseDeltaY: 0,
      pointerLocked: false,
    };

    this.jumpPressed = false;
    this.lightPressed = false;
    this.heavyPressed = false;
    this.specialPressed = false;
    this.reloadPressed = false;
    this.restartPressed = false;
    this.powerPressed = false;
    this.ragePressed = false;
    this.shockwavePressed = false;
    this.finisherPressed = false;
    this.helpPressed = false;
    this.debugPressed = false;
    this.weaponSlotRequest = null;
    this.dashDirection = 0;

    return state;
  }

  private axis(keys: readonly string[]): number {
    return keys.some((key) => this.heldKeys.has(key)) ? 1 : 0;
  }

  private anyHeld(keys: readonly string[]): boolean {
    return keys.some((key) => this.heldKeys.has(key));
  }

  private readGamepadState(): {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    jumpHeld: boolean;
    jumpPressed: boolean;
    blockHeld: boolean;
    lightPressed: boolean;
    heavyPressed: boolean;
    specialHeld: boolean;
    specialPressed: boolean;
    reloadPressed: boolean;
    ragePressed: boolean;
    contextPressed: boolean;
    helpPressed: boolean;
    debugPressed: boolean;
    dashDirection: -1 | 0 | 1;
  } {
    if (typeof navigator === 'undefined' || typeof navigator.getGamepads !== 'function') {
      return {
        left: false,
        right: false,
        up: false,
        down: false,
        jumpHeld: false,
        jumpPressed: false,
        blockHeld: false,
        lightPressed: false,
        heavyPressed: false,
        specialHeld: false,
        specialPressed: false,
        reloadPressed: false,
        ragePressed: false,
        contextPressed: false,
        helpPressed: false,
        debugPressed: false,
        dashDirection: 0,
      };
    }

    const pad = [...navigator.getGamepads()].find((entry) => entry?.connected);
    if (!pad) {
      this.previousGamepadButtons = [];
      this.previousGamepadMoveX = 0;
      return {
        left: false,
        right: false,
        up: false,
        down: false,
        jumpHeld: false,
        jumpPressed: false,
        blockHeld: false,
        lightPressed: false,
        heavyPressed: false,
        specialHeld: false,
        specialPressed: false,
        reloadPressed: false,
        ragePressed: false,
        contextPressed: false,
        helpPressed: false,
        debugPressed: false,
        dashDirection: 0,
      };
    }

    const pressed = (index: number): boolean => Boolean(pad.buttons[index]?.pressed);
    const edgePressed = (index: number): boolean => pressed(index) && !this.previousGamepadButtons[index];
    const axisX = pad.axes[0] ?? 0;
    const axisY = pad.axes[1] ?? 0;
    const left = axisX <= -0.4 || pressed(14);
    const right = axisX >= 0.4 || pressed(15);
    const up = axisY <= -0.45 || pressed(12);
    const down = axisY >= 0.45 || pressed(13);

    let dashDirection: -1 | 0 | 1 = 0;
    const currentMoveX = left ? -1 : right ? 1 : 0;
    if (currentMoveX !== 0 && currentMoveX !== this.previousGamepadMoveX) {
      const now = performance.now();
      if (currentMoveX < 0) {
        if (now - this.lastLeftTap <= DASH_TAP_WINDOW_MS) {
          dashDirection = -1;
        }
        this.lastLeftTap = now;
      } else {
        if (now - this.lastRightTap <= DASH_TAP_WINDOW_MS) {
          dashDirection = 1;
        }
        this.lastRightTap = now;
      }
    }
    this.previousGamepadMoveX = currentMoveX;
    this.previousGamepadButtons = pad.buttons.map((button) => Boolean(button.pressed));

    return {
      left,
      right,
      up,
      down,
      jumpHeld: pressed(0),
      jumpPressed: edgePressed(0),
      blockHeld: pressed(4),
      lightPressed: edgePressed(2),
      heavyPressed: edgePressed(3),
      specialHeld: pressed(1),
      specialPressed: edgePressed(1),
      reloadPressed: edgePressed(5),
      ragePressed: edgePressed(6),
      contextPressed: edgePressed(7),
      helpPressed: edgePressed(9),
      debugPressed: edgePressed(8),
      dashDirection,
    };
  }
}
