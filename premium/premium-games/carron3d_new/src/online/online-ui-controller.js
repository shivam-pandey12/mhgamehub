export function createOnlinePanelModel(state = {}) {
  const room = state.roomState || {};
  const players = room.players || [];
  const host = players.find((player) => player.seat === 'host') || null;
  const guest = players.find((player) => player.seat === 'guest') || null;
  const status = state.status || 'idle';
  const reconnectPrompt = state.reconnectPrompt || null;
  const disconnectGrace = state.disconnectGrace || room.disconnectGrace || null;
  const turnTimer = state.turnTimer || room.turnTimer || state.matchState?.turnTimer || null;
  const rematch = state.rematch || room.rematch || state.matchState?.rematch || null;
  const remainingMs = Number(disconnectGrace?.remainingMs) || 0;
  const timerMs = Number(turnTimer?.remainingMs) || 0;
  const formatClock = (ms) => {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };
  const hasRematchRequest = rematch?.status === 'requested';
  const requestedByLocal = Boolean(rematch?.requestedBy?.includes?.(state.playerId));
  const serverStateVersion = state.latestServerStateVersion || room.serverStateVersion || state.matchState?.serverStateVersion || 0;
  const latencyMs = Math.round(Number(state.latencyMs) || 0);
  const matchId = state.matchState?.matchId || room.matchState?.matchId || '';
  const debugLabel = [
    `v${serverStateVersion}`,
    `${latencyMs}ms`,
    state.playerId || 'no-player',
    matchId || 'no-match',
    state.lastRejectedShot?.code || 'OK'
  ].join(' / ');
  return {
    view: reconnectPrompt
      ? 'reconnect'
      : room.status === 'playing' || room.status === 'finished'
      ? 'playing'
      : state.roomCode ? 'lobby' : 'menu',
    status,
    roomCode: state.roomCode || room.roomCode || '',
    connectionStatus: state.connectionStatus || 'Offline',
    message: state.message || 'Create or join a private room.',
    error: state.error || '',
    reconnectPrompt,
    reconnectRoomCode: reconnectPrompt?.roomCode || '',
    reconnectPlayerName: reconnectPrompt?.playerName || '',
    host,
    guest,
    isHost: state.seat === 'host',
    canStart: state.seat === 'host' && room.status === 'lobby' && Boolean(host && guest),
    matchConfig: room.matchConfig || {},
    playerId: state.playerId || '',
    disconnectGrace,
    disconnectLabel: remainingMs ? formatClock(remainingMs) : '',
    turnTimer,
    turnTimerLabel: timerMs ? formatClock(timerMs) : '',
    turnTimerLow: timerMs > 0 && timerMs <= 10_000,
    rematch,
    rematchLabel: rematch?.status === 'declined'
      ? 'Rematch declined'
      : hasRematchRequest
        ? requestedByLocal ? 'Rematch request sent' : 'Opponent wants rematch'
        : 'No rematch request',
    canRequestRematch: state.matchState?.status === 'finished' && !hasRematchRequest,
    canAnswerRematch: state.matchState?.status === 'finished' && hasRematchRequest && !requestedByLocal,
    serverStateVersion,
    lastRejectedShot: state.lastRejectedShot || null,
    latencyMs,
    debugLabel
  };
}
