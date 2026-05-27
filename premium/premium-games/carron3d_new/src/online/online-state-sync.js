import { SHELL_MATCH_DEFAULTS } from '../config/carrom-constants.js';

function colorLabel(color, ruleMode = 'classic') {
  if (ruleMode === 'freeCapture') {
    return 'Any';
  }
  if (!color) {
    return 'Unassigned';
  }
  return color === 'white' ? 'White' : 'Black';
}

export class OnlineStateSync {
  constructor({ sceneRenderer }) {
    this.sceneRenderer = sceneRenderer;
    this.pendingSettledPayload = null;
  }

  applyMatchState(matchState, onlineState = {}) {
    if (!matchState) {
      return { ...SHELL_MATCH_DEFAULTS };
    }

    if (matchState.board) {
      this.sceneRenderer?.applyBoardSnapshot(matchState.board);
    }

    return this.toHud(matchState, onlineState);
  }

  toHud(matchState, onlineState = {}) {
    const hud = matchState.hud || {};
    const onlineMode = matchState.mode === 'onlinePublic' ? 'onlinePublic' : 'onlinePrivate';
    const onlineLabel = onlineMode === 'onlinePublic' ? 'Online Public' : 'Online Private';
    const players = matchState.players || [];
    const playerOne = players.find((player) => player.id === 'player-1') || {};
    const playerTwo = players.find((player) => player.id === 'player-2') || {};
    const localTurn = matchState.currentPlayerId === onlineState.playerId;
    const finished = matchState.status === 'finished';
    const waiting = Boolean(onlineState.pendingShot);
    const grace = Boolean(onlineState.disconnectGrace || matchState.disconnectGrace);
    const rematchPending = ['requested', 'accepted'].includes(onlineState.rematch?.status || matchState.rematch?.status);
    const timer = onlineState.turnTimer || matchState.turnTimer || null;
    const latency = Number(onlineState.latencyMs) || 0;
    const timerLabel = timer?.active && Number.isFinite(Number(timer.remainingMs))
      ? `Time ${Math.max(0, Math.ceil(Number(timer.remainingMs) / 1000))}s`
      : '';
    const syncLabel = latency > 0 ? `Sync ${Math.min(Math.round(latency), 999)}ms` : '';
    const turnStatus = finished
      ? rematchPending ? 'Rematch pending.' : 'Match finished.'
      : grace
        ? 'Opponent disconnected.'
        : waiting
          ? 'Sending shot...'
          : localTurn ? 'Your turn.' : 'Opponent turn.';

    return {
      ...SHELL_MATCH_DEFAULTS,
      ...hud,
      matchMode: onlineMode,
      matchModeLabel: onlineLabel,
      onlineActive: true,
      onlineRoomCode: onlineState.roomCode || matchState.roomCode || '',
      onlineConnectionStatus: onlineState.connectionStatus || 'Connected',
      onlineTurnStatus: [turnStatus, timerLabel, syncLabel].filter(Boolean).join(' | '),
      onlineTurnTimer: timerLabel,
      onlineTurnTimerLow: Boolean(timer?.active && Number(timer.remainingMs) <= 10000),
      onlineDisconnectGrace: grace ? onlineState.disconnectGrace || matchState.disconnectGrace : null,
      onlineRematchStatus: onlineState.rematch?.status || matchState.rematch?.status || 'idle',
      playerOneName: playerOne.name || hud.playerOneName || 'Host',
      playerTwoName: playerTwo.name || hud.playerTwoName || 'Guest',
      playerOneColor: colorLabel(playerOne.color, matchState.ruleMode),
      playerTwoColor: colorLabel(playerTwo.color, matchState.ruleMode),
      currentTurn: hud.currentTurn || (matchState.currentPlayerId === 'player-2' ? playerTwo.name : playerOne.name) || 'Player',
      ruleMode: matchState.ruleMode,
      classicRuleVariant: matchState.classicRuleVariant,
      turnNumber: matchState.turnNumber,
      shotNumber: matchState.shotNumber,
      status: `${turnStatus} ${hud.status || ''}`.trim(),
      bannerTone: finished ? 'success' : localTurn ? 'warning' : 'default',
      winnerName: hud.winnerName || '',
      resultOutcome: matchState.draw ? 'Drawn' : hud.resultOutcome || 'Wins',
      resultScore: hud.resultScore || '',
      resultColorSummary: hud.resultColorSummary || '',
      resultQueenStatus: hud.resultQueenStatus || hud.queenStatus || 'On board',
      resultTurns: matchState.turnNumber,
      resultShots: matchState.shotNumber
    };
  }

  getActiveBaseline(matchState) {
    return matchState?.activeBaseline || (matchState?.currentPlayerId === 'player-2' ? 'top' : 'bottom');
  }

  getPlayerBaseline(playerId = '') {
    return playerId === 'player-2' ? 'top' : 'bottom';
  }

  getLocalPlayerBaseline(_matchState, onlineState = {}) {
    return this.getPlayerBaseline(onlineState.playerId);
  }

  canLocalPlayerShoot(matchState, onlineState = {}, motion = {}) {
    const timer = onlineState.turnTimer || matchState?.turnTimer || null;
    const timerExpired = Boolean(
      timer?.active
      && timer.currentPlayerId === onlineState.playerId
      && Number(timer.remainingMs) <= 0
    );
    return Boolean(
      matchState?.status === 'playing'
      && onlineState.playerId
      && matchState.currentPlayerId === onlineState.playerId
      && !onlineState.pendingShot
      && !onlineState.disconnectGrace
      && !matchState.disconnectGrace
      && !timerExpired
      && !['requested', 'accepted'].includes(onlineState.rematch?.status || matchState.rematch?.status)
      && onlineState.status !== 'grace'
      && onlineState.status !== 'reconnecting'
      && onlineState.status !== 'rematch'
      && onlineState.status !== 'waiting'
      && onlineState.status !== 'disconnected'
      && onlineState.status !== 'error'
      && !motion.anyMoving
    );
  }
}
