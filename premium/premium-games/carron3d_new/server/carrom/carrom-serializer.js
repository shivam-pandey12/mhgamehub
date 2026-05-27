function serializeBody(body = {}) {
  const position = body.position || body;
  const velocity = body.velocity || body;
  return {
    id: body.id || '',
    type: body.type || '',
    color: body.color || '',
    radius: body.radius || 0,
    mass: body.mass || 0,
    x: Number(position.x) || 0,
    z: Number(position.z) || 0,
    vx: Number(velocity.vx ?? velocity.x) || 0,
    vz: Number(velocity.vz ?? velocity.z) || 0,
    position: {
      x: Number(position.x) || 0,
      z: Number(position.z) || 0
    },
    velocity: {
      x: Number(velocity.vx ?? velocity.x) || 0,
      z: Number(velocity.vz ?? velocity.z) || 0
    },
    isPocketed: Boolean(body.isPocketed),
    isSleeping: body.isSleeping !== undefined ? Boolean(body.isSleeping) : true
  };
}

export function serializeRoom(room) {
  const serverTime = Date.now();
  const disconnectGrace = room.updateDisconnectGrace?.(serverTime) || null;
  const turnTimer = room.updateTurnTimer?.(serverTime) || null;
  return {
    roomCode: room.roomCode,
    hostSocketId: room.hostSocketId,
    roomType: room.roomType || 'private',
    serverStateVersion: Number(room.serverStateVersion) || 0,
    lastStateReason: room.lastStateReason || '',
    status: room.status,
    matchConfig: { ...room.matchConfig },
    players: room.players.map((player) => player.serialize()),
    disconnectGrace: disconnectGrace ? { ...disconnectGrace } : null,
    turnTimer: turnTimer ? { ...turnTimer } : null,
    rematch: { ...(room.rematch || {}) },
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
    matchState: room.matchEngine ? serializeMatch(room.matchEngine) : null,
    message: room.message || '',
    serverTime
  };
}

export function serializeMatch(matchEngine) {
  const state = matchEngine.matchStateManager?.state;
  const hud = matchEngine.matchStateManager?.toHudMatch?.() || {};
  const board = matchEngine.physicsWorld?.getBoardSnapshot?.() || { bodies: [] };
  const serverTime = Date.now();
  const disconnectGrace = matchEngine.room.updateDisconnectGrace?.(serverTime) || null;
  const turnTimer = matchEngine.room.updateTurnTimer?.(serverTime) || null;
  return {
    matchId: state?.matchId || '',
    roomCode: matchEngine.room.roomCode,
    serverStateVersion: Number(matchEngine.room.serverStateVersion) || 0,
    lastStateReason: matchEngine.room.lastStateReason || '',
    mode: matchEngine.room.roomType === 'public' ? 'onlinePublic' : 'onlinePrivate',
    roomType: matchEngine.room.roomType || 'private',
    status: state?.status || 'lobby',
    ruleMode: state?.ruleMode || matchEngine.room.matchConfig.ruleMode,
    classicRuleVariant: state?.classicRuleVariant || matchEngine.room.matchConfig.classicRuleVariant,
    coinAssignmentMode: state?.coinAssignmentMode || matchEngine.room.matchConfig.coinAssignmentMode,
    players: (state?.players || []).map((player) => ({
      id: player.id,
      name: player.name,
      color: player.color,
      seat: player.id === 'player-1' ? 'host' : 'guest',
      connected: Boolean(matchEngine.room.getPlayerByPlayerId(player.id)?.isConnected),
      disconnectedAt: matchEngine.room.getPlayerByPlayerId(player.id)?.disconnectedAt || 0,
      lastSeenAt: matchEngine.room.getPlayerByPlayerId(player.id)?.lastSeenAt || 0,
      pocketedOwnCoinIds: [...(player.pocketedOwnCoinIds || [])],
      capturedCoinIds: [...(player.capturedCoinIds || [])],
      dueCount: Number(player.dueCount) || 0,
      returnedPenaltyCount: Number(player.returnedPenaltyCount) || 0
    })),
    currentPlayerId: state?.currentPlayerId || 'player-1',
    activeBaseline: matchEngine.matchStateManager?.getActiveBaseline?.() || 'bottom',
    turnNumber: state?.turnNumber || 1,
    shotNumber: state?.shotNumber || 0,
    queen: { ...(state?.queen || {}) },
    pocketedPieces: {
      white: [...(state?.pocketedPieces?.white || [])],
      black: [...(state?.pocketedPieces?.black || [])],
      queen: Boolean(state?.pocketedPieces?.queen)
    },
    lastFoul: state?.lastFoul || '',
    winnerPlayerId: state?.winnerPlayerId || null,
    draw: Boolean(state?.isDraw),
    board: {
      ...board,
      bodies: (board.bodies || []).map(serializeBody)
    },
    disconnectGrace: disconnectGrace ? { ...disconnectGrace } : null,
    turnTimer: turnTimer ? { ...turnTimer } : null,
    rematch: { ...(matchEngine.room.rematch || {}) },
    hud: {
      ...hud,
      matchMode: matchEngine.room.roomType === 'public' ? 'onlinePublic' : 'onlinePrivate',
      matchModeLabel: matchEngine.room.roomType === 'public' ? 'Online Public' : 'Online Private',
      currentIsBot: false,
      botStatus: ''
    },
    updatedAt: Date.now(),
    serverTime
  };
}
