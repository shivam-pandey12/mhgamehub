import { BotPlayer } from './bot-player.js';
import { BotShotPlanner } from './bot-shot-planner.js';
import { getBotDifficultyProfile } from './bot-difficulty.js';

function randomDelay(profile) {
  return profile.thinkingMinMs + Math.random() * (profile.thinkingMaxMs - profile.thinkingMinMs);
}

export class BotController {
  constructor({
    sceneRenderer,
    getMatchStateManager,
    getAppState,
    canRun = null,
    callbacks = {},
    debugBot = false
  }) {
    this.sceneRenderer = sceneRenderer;
    this.getMatchStateManager = getMatchStateManager;
    this.getAppState = getAppState;
    this.canRun = canRun;
    this.callbacks = callbacks;
    this.debugBot = debugBot;
    this.planner = new BotShotPlanner({ debugBot });
    this.botPlayer = new BotPlayer(null);
    this.timerId = 0;
    this.phase = 'idle';
    this.paused = false;
    this.pendingPlan = null;
  }

  scheduleTurn({ reason = 'turn-ready' } = {}) {
    this.clearTimer();
    this.pendingPlan = null;
    this.phase = 'idle';

    if (!this.canRunBotTurn()) {
      return false;
    }

    const manager = this.getMatchStateManager?.();
    const currentPlayer = manager?.getCurrentPlayer?.();
    const difficulty = manager?.state?.botDifficulty || currentPlayer?.difficulty || 'normal';
    this.botPlayer.update(currentPlayer, difficulty);
    const profile = this.botPlayer.profile;
    const delay = randomDelay(profile);
    this.phase = 'thinking';
    this.sceneRenderer?.setInputEnabled(false);
    this.callbacks.onStatus?.(`${this.botPlayer.name} is lining up a shot...`, {
      shotPower: 'Bot',
      shotPowerRatio: 0,
      botStatus: 'thinking'
    });
    this.debug('scheduled bot turn', { reason, delay, difficulty: profile.id });

    this.timerId = globalThis.setTimeout(() => this.planShot(), delay);
    return true;
  }

  planShot() {
    this.timerId = 0;
    if (!this.canRunBotTurn()) {
      this.phase = 'idle';
      return;
    }

    const manager = this.getMatchStateManager?.();
    const currentPlayer = manager.getCurrentPlayer();
    this.botPlayer.update(currentPlayer, manager.state.botDifficulty);
    const snapshot = this.sceneRenderer?.getBoardSnapshot?.();
    const baseline = manager.getActiveBaseline();
    const plan = this.planner.plan({
      snapshot,
      matchState: manager.state,
      botPlayer: this.botPlayer,
      baseline,
      difficulty: this.botPlayer.difficulty
    });

    this.pendingPlan = plan;
    this.phase = 'preview';
    this.sceneRenderer?.placeStrikerForBot(plan.strikerPosition);
    this.sceneRenderer?.previewBotShot(plan);
    this.callbacks.onStatus?.(`${this.botPlayer.name} aiming ${plan.shotType === 'bank' ? 'a bank shot' : 'a shot'}...`, {
      shotPower: `${Math.round((plan.powerRatio || 0) * 100)}%`,
      shotPowerRatio: plan.powerRatio || 0,
      botStatus: 'aiming'
    });
    this.debug('bot plan', plan.debug || {
      target: plan.targetId,
      pocket: plan.pocketId,
      score: plan.score
    });

    const profile = getBotDifficultyProfile(this.botPlayer.difficulty);
    this.timerId = globalThis.setTimeout(() => this.fireShot(), profile.previewMs);
  }

  fireShot() {
    this.timerId = 0;
    if (!this.canRunBotTurn() || !this.pendingPlan) {
      this.phase = 'idle';
      return;
    }

    const plan = this.pendingPlan;
    this.phase = 'shooting';
    const fired = this.sceneRenderer?.fireBotShot?.(plan) || false;
    if (!fired) {
      this.sceneRenderer?.clearBotPreview?.();
      this.callbacks.onStatus?.(`${this.botPlayer.name} is finding a safer shot...`, {
        shotPower: 'Bot',
        shotPowerRatio: 0,
        botStatus: 'thinking'
      });
      this.debug('bot shot blocked, rescheduling', { target: plan.targetId });
      this.timerId = globalThis.setTimeout(() => this.scheduleTurn({ reason: 'blocked-shot' }), 320);
      return;
    }

    this.callbacks.onShotFired?.(plan, this.botPlayer);
    this.callbacks.onStatus?.(`${this.botPlayer.name} shot in motion...`, {
      shotPower: 'Moving',
      shotPowerRatio: 1,
      botStatus: 'shooting'
    });
  }

  pause() {
    this.paused = true;
    this.clearTimer();
    this.sceneRenderer?.clearBotPreview?.();
  }

  resume() {
    if (!this.paused) {
      return;
    }
    this.paused = false;
    if (this.canRunBotTurn()) {
      this.scheduleTurn({ reason: 'resume' });
    }
  }

  cancel() {
    this.clearTimer();
    this.pendingPlan = null;
    this.phase = 'idle';
    this.paused = false;
    this.sceneRenderer?.clearBotPreview?.();
  }

  dispose() {
    this.cancel();
  }

  canRunBotTurn() {
    if (this.paused || this.getAppState?.() !== 'playing' || this.canRun?.() === false) {
      return false;
    }

    const manager = this.getMatchStateManager?.();
    const currentPlayer = manager?.getCurrentPlayer?.();
    const motion = this.sceneRenderer?.getPhysicsSummary?.();
    return Boolean(
      manager
      && manager.state?.status === 'playing'
      && currentPlayer?.isBot
      && !motion?.anyMoving
    );
  }

  clearTimer() {
    if (this.timerId) {
      globalThis.clearTimeout(this.timerId);
      this.timerId = 0;
    }
  }

  debug(message, details = {}) {
    if (!this.debugBot) {
      return;
    }
    console.debug('[Carrom3D bot]', message, details);
  }
}
