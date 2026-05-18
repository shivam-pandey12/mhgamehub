export function createMatchStats(players) {
  return {
    totalTurns: 0,
    startedAt: Date.now(),
    winnerId: null,
    modeId: "classic",
    finishTile: 100,
    awards: [],
    players: players.map((player) => ({
      id: player.id,
      name: player.name,
      type: player.type,
      totalRolls: 0,
      sixes: 0,
      laddersClimbed: 0,
      snakesHit: 0,
      highestTile: player.position,
      currentTile: player.position,
      finalPosition: player.position,
      turnsTaken: 0,
      biggestLadderJump: 0,
      powerUpsUsed: 0,
      powerUpsGained: 0,
      eventTilesTriggered: 0,
      rerollsUsed: 0,
      swapsUsed: 0,
      shieldBlocks: 0
    }))
  };
}

export function getPlayerStats(stats, playerId) {
  return stats?.players?.find((player) => player.id === playerId);
}

export function recordRoll(stats, playerId, roll) {
  const player = getPlayerStats(stats, playerId);
  if (!player) return;
  stats.totalTurns += 1;
  player.totalRolls += 1;
  player.turnsTaken += 1;
  if (roll === 6) player.sixes += 1;
}

export function recordTile(stats, playerId, tile) {
  const player = getPlayerStats(stats, playerId);
  if (!player) return;
  player.currentTile = tile;
  player.finalPosition = tile;
  player.highestTile = Math.max(player.highestTile, tile);
}

export function recordTransport(stats, playerId, transport) {
  const player = getPlayerStats(stats, playerId);
  if (!player) return;
  if (transport.type === "ladder") {
    player.laddersClimbed += 1;
    player.biggestLadderJump = Math.max(player.biggestLadderJump, transport.to - transport.from);
  }
  if (transport.type === "snake") {
    player.snakesHit += 1;
  }
}

export function recordPowerUp(stats, playerId, powerUpId, action = "used") {
  const player = getPlayerStats(stats, playerId);
  if (!player) return;
  if (action === "gained") player.powerUpsGained += 1;
  if (action === "used") player.powerUpsUsed += 1;
  if (powerUpId === "reroll" && action === "used") player.rerollsUsed += 1;
  if (powerUpId === "swap" && action === "used") player.swapsUsed += 1;
  if (powerUpId === "shield" && action === "used") player.shieldBlocks += 1;
}

export function recordEventTile(stats, playerId) {
  const player = getPlayerStats(stats, playerId);
  if (!player) return;
  player.eventTilesTriggered += 1;
}

export function finalizeMatchStats(stats, players, winnerId, context = {}) {
  if (!stats) return null;
  stats.winnerId = winnerId;
  stats.modeId = context.modeId || stats.modeId;
  stats.finishTile = context.finishTile || stats.finishTile;
  players.forEach((player) => recordTile(stats, player.id, player.position));
  stats.awards = computeAwards(stats, players, context);
  return stats;
}

export function computeAwards(stats, livePlayers = [], context = {}) {
  const players = stats?.players || [];
  const winner = players.find((player) => player.id === stats?.winnerId);
  const awards = [];
  if (winner) {
    awards.push({
      title: "Crown Champion",
      playerName: winner.name,
      value: `Tile ${context.finishTile || stats.finishTile || 100}`
    });
  }

  [
    makeAward("Ladder King", players, "laddersClimbed", "ladders"),
    makeAward("Snake Magnet", players, "snakesHit", "snakes"),
    makeAward("Six Master", players, "sixes", "sixes"),
    makeAward("Power Player", players, "powerUpsUsed", "uses"),
    makeAward("Comeback Climber", players, "biggestLadderJump", "tiles")
  ].filter(Boolean).forEach((award) => awards.push(award));

  const closeCall = makeCloseCallAward(players, stats?.winnerId, context.finishTile || stats?.finishTile || 100);
  if (closeCall) awards.push(closeCall);

  if ((context.modeId || stats?.modeId) === "chaos" && winner) {
    awards.push({
      title: "Chaos Survivor",
      playerName: winner.name,
      value: "High Risk cleared"
    });
  }

  return awards;
}

function makeAward(title, players, field, suffix) {
  if (!players.length) return null;
  const winner = [...players].sort((a, b) => b[field] - a[field])[0];
  if (!winner || winner[field] <= 0) return null;

  return {
    title,
    playerName: winner.name,
    value: `${winner[field]} ${suffix}`
  };
}

function makeCloseCallAward(players, winnerId, finishTile) {
  const closest = players
    .filter((player) => player.id !== winnerId)
    .sort((a, b) => b.finalPosition - a.finalPosition)[0];
  if (!closest || closest.finalPosition <= 0) return null;
  return {
    title: "Close Call",
    playerName: closest.name,
    value: `${Math.max(0, finishTile - closest.finalPosition)} tiles away`
  };
}
