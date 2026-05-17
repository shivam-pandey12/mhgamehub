export const GAME_MODES = {
  SOLO_LEVEL: 'soloLevel',
  SOLO_COURSE: 'soloCourse',
  TIME_TRIAL: 'timeTrial',
  CHALLENGE: 'challenge',
  LOCAL_TWO: 'localTwo',
  VS_BOT: 'vsBot',
  PRACTICE: 'practice',
  ONLINE_PRIVATE: 'onlinePrivate',
  ONLINE_PUBLIC: 'onlinePublic',
  ONLINE_BOT_STYLE: 'onlineBotStyle'
};

export const MODE_LABELS = {
  [GAME_MODES.SOLO_LEVEL]: 'Solo Level',
  [GAME_MODES.SOLO_COURSE]: 'Solo Course',
  [GAME_MODES.TIME_TRIAL]: 'Time Trial',
  [GAME_MODES.CHALLENGE]: 'Challenge',
  [GAME_MODES.LOCAL_TWO]: 'Local 2 Player',
  [GAME_MODES.VS_BOT]: 'Vs Bot',
  [GAME_MODES.PRACTICE]: 'Practice',
  [GAME_MODES.ONLINE_PRIVATE]: 'Online Private',
  [GAME_MODES.ONLINE_PUBLIC]: 'Online Match',
  [GAME_MODES.ONLINE_BOT_STYLE]: 'Online Bot'
};

export function adjustedScore(record) {
  return (record?.shots ?? 0) + (record?.penalties ?? 0);
}

export function rankForCourse(shots, penalties, par) {
  const adjusted = shots + penalties;
  if (adjusted <= par) return 'S';
  if (adjusted <= par + 3) return 'A';
  if (adjusted <= par + 7) return 'B';
  return 'C';
}

export function formatTime(ms = 0) {
  const total = Math.max(0, Math.floor(ms));
  const minutes = Math.floor(total / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  const tenths = Math.floor((total % 1000) / 100);
  return `${minutes}:${String(seconds).padStart(2, '0')}.${tenths}`;
}

export function createSession(mode, options = {}) {
  return {
    mode,
    packId: options.packId ?? 'ivory-garden',
    courseLength: options.courseLength ?? 1,
    levelIds: options.levelIds ?? [],
    currentHoleIndex: 0,
    actorIndex: 0,
    actors: options.actors ?? [{ id: 'player', name: 'Player', type: 'human', holes: [] }],
    holes: [],
    challengeId: options.challengeId ?? null,
    botDifficulty: options.botDifficulty ?? 'normal',
    timer: {
      active: false,
      elapsedMs: 0,
      penaltySeconds: 0,
      started: false
    },
    flags: {
      noWallTouch: true,
      usedBouncePad: false,
      usedBoost: false,
      usedSand: false,
      fellOut: false,
      aimAssistAtStart: Boolean(options.aimAssist)
    },
    practice: {
      showShots: options.showShots ?? true
    },
    startedAt: new Date().toISOString()
  };
}

export function resetHoleFlags(session, aimAssist) {
  session.flags = {
    noWallTouch: true,
    usedBouncePad: false,
    usedBoost: false,
    usedSand: false,
    fellOut: false,
    aimAssistAtStart: Boolean(aimAssist)
  };
}

export function summarizeActor(actor) {
  const totals = actor.holes.reduce(
    (sum, hole) => {
      sum.shots += hole.shots;
      sum.penalties += hole.penalties;
      sum.stars += hole.stars ?? 0;
      return sum;
    },
    { shots: 0, penalties: 0, stars: 0 }
  );
  return { ...totals, adjusted: totals.shots + totals.penalties };
}
