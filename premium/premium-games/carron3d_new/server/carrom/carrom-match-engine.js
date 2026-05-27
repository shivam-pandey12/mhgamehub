import { MatchStateManager } from '../../src/game/match-state-manager.js';
import { PhysicsWorld } from '../../src/physics/physics-world.js';
import { PHYSICS_TUNING } from '../../src/physics/physics-tuning.js';
import { createDefaultCarromPieces, createDefaultCarromPockets } from '../../src/shared/carrom-layout.js';
import { serializeMatch } from './carrom-serializer.js';
import { SHOT_REJECTION_CODES, validateShotPayload } from './carrom-validators.js';

const MAX_SIMULATION_STEPS = 3600;

export class CarromMatchEngine {
  constructor({ room }) {
    this.room = room;
    this.lastShotId = 0;
    this.pendingSummary = null;
    this.matchStateManager = null;
    this.physicsWorld = null;
  }

  start() {
    const host = this.room.getHost();
    const guest = this.room.getGuest();
    this.matchStateManager = new MatchStateManager({
      playerOneName: host?.name || 'Host',
      playerTwoName: guest?.name || 'Guest',
      matchMode: 'local2p',
      ruleMode: this.room.matchConfig.ruleMode,
      classicRuleVariant: this.room.matchConfig.classicRuleVariant,
      coinSide: this.room.matchConfig.coinAssignmentMode
    });
    this.physicsWorld = new PhysicsWorld({
      pieces: createDefaultCarromPieces(),
      pockets: createDefaultCarromPockets(),
      onPiecePocketed: () => {},
      onShotSettled: (summary) => {
        this.pendingSummary = summary;
      }
    });
    this.room.status = 'playing';
    this.room.updatedAt = Date.now();
    return this.getSnapshot();
  }

  submitShot({ player, payload }) {
    const validation = validateShotPayload({ room: this.room, player, payload });
    if (!validation.valid) {
      return {
        accepted: false,
        rejection: {
          roomCode: this.room.roomCode,
          matchId: payload?.matchId || this.matchStateManager?.state?.matchId || '',
          clientShotId: payload?.clientShotId || '',
          code: validation.code,
          message: validation.message
        }
      };
    }

    const shotId = `${this.room.roomCode}-${Date.now().toString(36)}-${++this.lastShotId}`;
    const acceptedVersion = this.room.bumpState?.('shot-accepted') || this.room.serverStateVersion || 0;
    const shot = {
      roomCode: this.room.roomCode,
      matchId: this.matchStateManager.state.matchId,
      shotId,
      clientShotId: validation.clientShotId,
      playerId: player.playerId,
      strikerPosition: validation.strikerPosition,
      direction: validation.direction,
      power: validation.power,
      serverStateVersion: acceptedVersion,
      serverTime: Date.now()
    };

    this.physicsWorld.setBodyPosition('striker-1', validation.strikerPosition, {
      visible: true,
      pocketed: false
    });
    this.pendingSummary = null;
    const fired = this.physicsWorld.applyStrikerShot(validation.direction, validation.power);
    if (!fired) {
      return {
        accepted: false,
        rejection: {
          roomCode: this.room.roomCode,
          matchId: this.matchStateManager.state.matchId,
          clientShotId: validation.clientShotId,
          code: SHOT_REJECTION_CODES.INVALID_STRIKER_POSITION,
          message: 'Server could not fire that shot.'
        }
      };
    }

    player.clientShotIds.add(validation.clientShotId);
    player.lastShotAt = Date.now();

    let steps = 0;
    while (!this.pendingSummary && steps < MAX_SIMULATION_STEPS) {
      this.physicsWorld.update(PHYSICS_TUNING.FIXED_TIMESTEP);
      steps += 1;
    }

    if (!this.pendingSummary) {
      this.pendingSummary = {
        pocketed: [],
        pocketedCount: 0,
        strikerPocketed: false,
        queenPocketed: false,
        coinPocketedIds: []
      };
      this.physicsWorld.resetVelocities();
    }

    const result = this.matchStateManager.applyShotSummary(this.pendingSummary);
    result.piecesToReturn.forEach((piece) => {
      this.physicsWorld.returnBodyToBoard(piece.id);
    });

    if (result.state.status === 'finished') {
      this.room.status = 'finished';
    }
    this.room.bumpState?.(result.state.status === 'finished' ? 'match-finished' : 'shot-settled');
    const matchState = this.getSnapshot();

    return {
      accepted: true,
      shot,
      result,
      settled: {
        roomCode: this.room.roomCode,
        matchId: this.matchStateManager.state.matchId,
        shotId,
        pocketedPieces: this.pendingSummary.pocketed,
        ruleResult: result.ruleResult,
        matchState,
        nextPlayerId: result.activePlayer?.id || this.matchStateManager.state.currentPlayerId,
        serverStateVersion: this.room.serverStateVersion || 0,
        serverTime: Date.now()
      }
    };
  }

  applyTurnTimeout() {
    const state = this.matchStateManager?.state;
    if (!state || state.status !== 'playing') {
      return null;
    }
    const timedOutPlayer = this.matchStateManager.getCurrentPlayer();
    const nextPlayer = this.matchStateManager.turnManager.switchTurn();
    state.messages = [
      `${timedOutPlayer?.name || 'Player'} ran out of time.`,
      `Turn switched to ${nextPlayer?.name || 'opponent'}.`
    ];
    state.lastFoul = '';
    this.room.bumpState?.('turn-timeout');
    return {
      roomCode: this.room.roomCode,
      matchId: state.matchId,
      timedOutPlayerId: timedOutPlayer?.id || '',
      currentPlayerId: state.currentPlayerId,
      turnNumber: state.turnNumber,
      shotNumber: state.shotNumber,
      matchState: this.getSnapshot(),
      serverStateVersion: this.room.serverStateVersion || 0,
      serverTime: Date.now()
    };
  }

  forfeitPlayer(playerId) {
    const result = this.matchStateManager?.forfeitPlayer?.(playerId);
    if (!result) {
      return null;
    }
    this.physicsWorld?.resetVelocities?.();
    this.room.status = 'finished';
    this.room.clearTurnTimer?.();
    this.room.clearDisconnectGrace?.();
    this.room.bumpState?.('match-forfeit');
    const matchState = this.getSnapshot();
    return {
      result,
      matchState,
      winnerPlayerId: matchState.winnerPlayerId,
      draw: Boolean(matchState.draw)
    };
  }

  getSnapshot() {
    return serializeMatch(this);
  }
}
