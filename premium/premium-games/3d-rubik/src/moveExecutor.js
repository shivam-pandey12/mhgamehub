import { applyMoveToState, getLayerCubies, parseMove } from "./cubeState.js";

export class MoveExecutor {
  constructor(cubeState, renderer, callbacks = {}) {
    this.cubeState = cubeState;
    this.renderer = renderer;
    this.callbacks = callbacks;
    this.isMoving = false;
  }

  async execute(notation, options = {}) {
    if (this.isMoving) {
      return false;
    }

    const move = parseMove(notation, this.cubeState.size, options.layerIndex);
    const layerCubies = getLayerCubies(this.cubeState, move).map((cubie) => cubie.id);
    const duration = Number.isFinite(options.duration) ? options.duration : 260;

    this.isMoving = true;
    this.callbacks.onMoveStart?.(move, options);

    try {
      if (options.animate !== false && this.renderer?.animateMove) {
        await this.renderer.animateMove(move, { duration, layerCubies });
      }

      applyMoveToState(this.cubeState, move);
      this.renderer?.syncFromState?.();
      this.renderer?.pulseLayer?.(move);
      this.callbacks.onMoveComplete?.(move, options);
      return true;
    } finally {
      this.isMoving = false;
      this.callbacks.onMoveEnd?.(move, options);
    }
  }

  async executeSequence(sequence, options = {}) {
    for (const notation of sequence) {
      const completed = await this.execute(notation, options);
      if (!completed) {
        return false;
      }
    }

    return true;
  }
}
