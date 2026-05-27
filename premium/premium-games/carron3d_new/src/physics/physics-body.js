import { CARROM_BOARD, CARROM_VISUAL_Y } from '../config/carrom-constants.js';
import { PHYSICS_TUNING } from './physics-tuning.js';

function getVisualY(piece) {
  if (Number.isFinite(piece.visualY)) {
    return piece.visualY;
  }
  if (piece.type === 'striker') {
    return CARROM_VISUAL_Y.STRIKER_VISUAL_Y;
  }
  if (piece.type === 'queen') {
    return CARROM_VISUAL_Y.QUEEN_VISUAL_Y;
  }
  return CARROM_VISUAL_Y.COIN_VISUAL_Y;
}

export class PhysicsBody {
  constructor(piece) {
    const isStriker = piece.type === 'striker';
    const restitution = isStriker ? PHYSICS_TUNING.STRIKER_RESTITUTION : PHYSICS_TUNING.COIN_RESTITUTION;
    const radius = piece.radius || (isStriker ? CARROM_BOARD.STRIKER_RADIUS : CARROM_BOARD.COIN_RADIUS);
    const visualY = getVisualY(piece);

    this.id = piece.id;
    this.type = piece.type;
    this.color = piece.color;
    this.radius = radius;
    this.mass = isStriker ? PHYSICS_TUNING.STRIKER_MASS : PHYSICS_TUNING.COIN_MASS;
    this.invMass = this.mass > 0 ? 1 / this.mass : 0;
    this.restitution = restitution;
    this.damping = PHYSICS_TUNING.LINEAR_DAMPING;
    this.position = {
      x: piece.initialPosition.x,
      z: piece.initialPosition.z
    };
    this.velocity = { x: 0, z: 0 };
    this.initialPosition = {
      ...piece.initialPosition,
      y: visualY
    };
    this.lastSafePosition = {
      x: piece.initialPosition.x,
      z: piece.initialPosition.z
    };
    this.mesh = piece.mesh;
    this.meshId = piece.mesh?.name || piece.id;
    this.visualY = visualY;
    this.isPocketed = false;
    this.isSleeping = true;
    this.sleepFrames = 0;
    this.pocketId = '';
    this.pocketedElapsed = 0;
    this.pocketTarget = null;
    this.spin = { y: 0 };
    this.lastFlatWarningTime = 0;
    this.scenarioHidden = false;
  }

  applyImpulse(impulse) {
    if (this.isPocketed) {
      return;
    }
    this.velocity.x += impulse.x * this.invMass;
    this.velocity.z += impulse.z * this.invMass;
    this.wake();
  }

  wake() {
    if (this.isPocketed) {
      return;
    }
    this.isSleeping = false;
    this.sleepFrames = 0;
  }

  markPocketed(pocket) {
    if (this.isPocketed) {
      return false;
    }
    this.isPocketed = true;
    this.isSleeping = true;
    this.pocketId = pocket.id;
    this.pocketTarget = pocket.position;
    this.pocketedElapsed = 0;
    this.velocity.x = 0;
    this.velocity.z = 0;
    return true;
  }

  reset() {
    this.position.x = this.initialPosition.x;
    this.position.z = this.initialPosition.z;
    this.velocity.x = 0;
    this.velocity.z = 0;
    this.isPocketed = false;
    this.isSleeping = true;
    this.sleepFrames = 0;
    this.pocketId = '';
    this.pocketTarget = null;
    this.pocketedElapsed = 0;
    this.scenarioHidden = false;
    this.spin.y = 0;
    this.lastSafePosition.x = this.initialPosition.x;
    this.lastSafePosition.z = this.initialPosition.z;
    if (this.mesh) {
      this.mesh.visible = true;
      this.mesh.position.set(this.initialPosition.x, this.visualY, this.initialPosition.z);
      this.mesh.rotation.set(0, 0, 0);
      this.mesh.scale.set(1, 1, 1);
      if (this.mesh.userData.carrom) {
        this.mesh.userData.carrom.isPocketed = false;
      }
    }
  }

  speedSq() {
    return this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z;
  }

  isMoving(threshold = PHYSICS_TUNING.STOP_SPEED_THRESHOLD) {
    return !this.isPocketed && this.speedSq() > threshold * threshold;
  }
}
