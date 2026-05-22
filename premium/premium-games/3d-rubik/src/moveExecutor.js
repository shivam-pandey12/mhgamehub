import { getPuzzleAdapter } from "./puzzleAdapters.js";

export class MoveExecutor {
  constructor(puzzleState, renderer, callbacks = {}, adapter = getPuzzleAdapter("cube")) {
    this.callbacks = callbacks;
    this.isMoving = false;
    this.setPuzzle(puzzleState, renderer, adapter);
  }

  setPuzzle(puzzleState, renderer, adapter = getPuzzleAdapter("cube")) {
    this.puzzleState = puzzleState;
    this.cubeState = puzzleState;
    this.renderer = renderer;
    this.adapter = adapter;
  }

  async execute(notation, options = {}) {
    if (this.isMoving) {
      return false;
    }

    let move;
    let layerCubies;

    try {
      move = this.adapter.parseMove(notation, this.puzzleState, options);
      layerCubies = this.adapter.getMovePieces(this.puzzleState, move).map((piece) => piece.id);
    } catch (error) {
      this.callbacks.onInvalidMove?.(notation, error, options);
      return false;
    }

    const duration = Number.isFinite(options.duration) ? options.duration : 260;

    this.isMoving = true;
    this.callbacks.onMoveStart?.(move, options);

    try {
      if (options.animate !== false && this.renderer?.animateMove) {
        await this.renderer.animateMove(move, { duration, layerCubies });
      }

      this.adapter.applyMove(this.puzzleState, move);
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
