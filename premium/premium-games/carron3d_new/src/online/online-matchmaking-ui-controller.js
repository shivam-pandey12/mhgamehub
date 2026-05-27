function formatWait(ms = 0) {
  const totalSeconds = Math.floor(Math.max(ms, 0) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function preferenceLabel(preferences = {}) {
  const rule = preferences.ruleMode === 'freeCapture'
    ? 'Free Capture'
    : preferences.ruleMode === 'any' ? 'Any Rules' : 'Classic';
  const variant = preferences.ruleMode === 'freeCapture'
    ? ''
    : preferences.classicRuleVariant === 'any' ? 'Any Style' : preferences.classicRuleVariant || 'Casual';
  const coin = preferences.ruleMode === 'freeCapture'
    ? ''
    : preferences.coinAssignmentMode === 'any' ? 'Any Side' : preferences.coinAssignmentMode || 'Random';
  return [rule, variant, coin].filter(Boolean).join(' / ');
}

export function createPublicMatchmakingModel(state = {}) {
  const status = state.status || 'idle';
  const matched = status === 'matched' || Boolean(state.matchFound);
  const queued = status === 'queued';
  const waitMs = state.joinedAt ? Date.now() - state.joinedAt : Number(state.waitMs) || 0;
  return {
    view: matched ? 'matched' : queued ? 'queued' : 'form',
    status,
    queued,
    matched,
    waitLabel: formatWait(waitMs),
    playersWaiting: Number(state.playersWaiting) || 0,
    message: state.error || state.message || 'Find a casual 3D Carrom opponent.',
    tone: state.error ? 'danger' : matched ? 'success' : queued ? 'warning' : 'default',
    preferencesLabel: preferenceLabel(state.preferences || state.matchFound?.matchConfig || {}),
    opponentName: state.matchFound?.opponentName || 'Opponent',
    roomCode: state.matchFound?.roomCode || '',
    startsAt: state.matchFound?.startsAt || 0,
    connectionStatus: state.connectionStatus || 'Offline'
  };
}
