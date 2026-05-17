export class InputController {
  constructor({ renderer, cubeState, isBusy, onMove }) {
    this.renderer = renderer;
    this.cubeState = cubeState;
    this.isBusy = isBusy;
    this.onMove = onMove;
    this.canvas = renderer.domElement;
    this.gesture = null;
    this.activePointers = new Map();
    this.dragThreshold = 14;
    this.previewThreshold = 8;

    this.canvas.addEventListener("pointerdown", this.onPointerDown);
    this.canvas.addEventListener("pointermove", this.onPointerMove);
    this.canvas.addEventListener("pointerup", this.onPointerUp);
    this.canvas.addEventListener("pointercancel", this.onPointerUp);
    this.canvas.addEventListener("lostpointercapture", this.onPointerUp);
  }

  dispose() {
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    this.canvas.removeEventListener("pointermove", this.onPointerMove);
    this.canvas.removeEventListener("pointerup", this.onPointerUp);
    this.canvas.removeEventListener("pointercancel", this.onPointerUp);
    this.canvas.removeEventListener("lostpointercapture", this.onPointerUp);
  }

  onPointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    this.activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (this.activePointers.size > 1) {
      this.cancelGesture();
      this.renderer.setControlsEnabled(true);
      return;
    }

    if (this.isBusy()) {
      return;
    }

    const hit = this.renderer.raycast(event.clientX, event.clientY);
    if (!hit) {
      this.renderer.clearHighlight();
      this.renderer.setControlsEnabled(true);
      return;
    }

    event.preventDefault();
    this.canvas.setPointerCapture?.(event.pointerId);
    this.renderer.setControlsEnabled(false);
    this.renderer.setTwistingClass(true);
    this.renderer.setHighlight(hit);

    this.gesture = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      hit,
      cubiePosition: { ...hit.cubie.position },
      triggered: false
    };
  };

  onPointerMove = (event) => {
    this.activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (!this.gesture || this.gesture.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();

    if (this.gesture.triggered || this.isBusy()) {
      return;
    }

    const dx = event.clientX - this.gesture.startX;
    const dy = event.clientY - this.gesture.startY;
    const distance = Math.hypot(dx, dy);

    const context = {
      point: this.gesture.hit.point,
      faceNormal: this.gesture.hit.normal,
      cubiePosition: this.gesture.cubiePosition,
      startX: this.gesture.startX,
      startY: this.gesture.startY
    };

    if (distance >= this.previewThreshold) {
      this.renderer.previewDragMove?.(context, { x: dx, y: dy });
    }

    if (distance < this.dragThreshold) {
      return;
    }

    const move = this.renderer.resolveDragMove(context, { x: dx, y: dy });

    if (!move) {
      return;
    }

    this.gesture.triggered = true;
    this.renderer.clearHighlight();
    this.renderer.clearLayerPreview?.();
    if (event.pointerType === "touch" && window.navigator?.vibrate) {
      window.navigator.vibrate(12);
    }
    this.onMove(move, event.pointerType === "touch" ? "touch" : "pointer");
  };

  onPointerUp = (event) => {
    this.activePointers.delete(event.pointerId);

    if (!this.gesture || this.gesture.pointerId !== event.pointerId) {
      return;
    }

    this.canvas.releasePointerCapture?.(event.pointerId);
    this.cancelGesture();
  };

  cancelGesture() {
    this.gesture = null;
    this.renderer.clearHighlight();
    this.renderer.clearLayerPreview?.();
    this.renderer.setTwistingClass(false);
    this.renderer.setControlsEnabled(true);
  }
}
