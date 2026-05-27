export class ShotResolver {
  constructor({ onShotStarted, onPiecePocketed, onShotSettled } = {}) {
    this.onShotStarted = onShotStarted;
    this.onPiecePocketed = onPiecePocketed;
    this.onShotSettled = onShotSettled;
    this.isShotActive = false;
    this.pocketedThisShot = [];
    this.lastMoving = false;
  }

  update({ anyMoving, allSleeping }) {
    if (anyMoving && !this.isShotActive) {
      this.isShotActive = true;
      this.pocketedThisShot = [];
      this.onShotStarted?.();
    }

    if (this.isShotActive && !anyMoving && allSleeping) {
      const summary = {
        pocketed: [...this.pocketedThisShot],
        pocketedCount: this.pocketedThisShot.length,
        strikerPocketed: this.pocketedThisShot.some((piece) => piece.type === 'striker'),
        queenPocketed: this.pocketedThisShot.some((piece) => piece.type === 'queen'),
        coinPocketedIds: this.pocketedThisShot.filter((piece) => piece.type === 'coin').map((piece) => piece.id)
      };
      this.isShotActive = false;
      this.onShotSettled?.(summary);
    }

    this.lastMoving = anyMoving;
  }

  recordPocketed(body) {
    const item = {
      id: body.id,
      type: body.type,
      color: body.color,
      pocketId: body.pocketId,
      pocketPosition: body.pocketTarget ? { ...body.pocketTarget } : { x: body.position.x, z: body.position.z }
    };
    if (this.isShotActive) {
      if (this.pocketedThisShot.some((pocketed) => pocketed.id === item.id)) {
        return;
      }
      this.pocketedThisShot.push(item);
    }
    this.onPiecePocketed?.(item);
  }

  reset() {
    this.isShotActive = false;
    this.pocketedThisShot = [];
    this.lastMoving = false;
  }
}
