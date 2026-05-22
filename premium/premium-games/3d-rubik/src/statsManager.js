const DEFAULT_SCOPED_STATS = {
  attempts: 0,
  solves: 0,
  totalMoves: 0,
  totalTimeMs: 0,
  totalSolveMoves: 0,
  averageTimeMs: 0,
  averageMoves: 0,
  latestSolve: null,
  hintsUsed: 0,
  undosUsed: 0,
  dailyStreak: 0,
  weeklyCompletions: 0
};

function safeCount(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

export function getStatsBucketId({ puzzleType = "cube", size = 3 } = {}) {
  return puzzleType !== "cube" ? puzzleType : `${size}x${size}`;
}

function ensureContainers(stats = {}) {
  const source = stats && typeof stats === "object" ? stats : {};
  const attemptsByPuzzle = source.attemptsByPuzzle && typeof source.attemptsByPuzzle === "object" ? source.attemptsByPuzzle : {};
  const solvesBySize = source.solvesBySize && typeof source.solvesBySize === "object" ? source.solvesBySize : {};
  const solvesByPuzzle = source.solvesByPuzzle && typeof source.solvesByPuzzle === "object" ? source.solvesByPuzzle : {};
  const scoped = source.scoped && typeof source.scoped === "object" ? source.scoped : {};
  return {
    totalMoves: safeCount(source.totalMoves),
    totalSolves: safeCount(source.totalSolves),
    totalAttempts: safeCount(source.totalAttempts),
    totalMissionsCompleted: safeCount(source.totalMissionsCompleted),
    weeklyCompletions: safeCount(source.weeklyCompletions),
    lastPlayedPuzzle: source.lastPlayedPuzzle || "",
    favoritePuzzleByAttempts: source.favoritePuzzleByAttempts || "",
    attemptsByPuzzle,
    totalHintsUsed: safeCount(source.totalHintsUsed),
    totalUndosUsed: safeCount(source.totalUndosUsed),
    solvesBySize,
    solvesByPuzzle,
    scoped
  };
}

function getMutableBucket(stats, scope) {
  const normalized = ensureContainers(stats);
  const bucketId = getStatsBucketId(scope);
  normalized.scoped[bucketId] = {
    ...DEFAULT_SCOPED_STATS,
    ...(normalized.scoped[bucketId] || {})
  };
  return { normalized, bucketId, bucket: normalized.scoped[bucketId] };
}

export function getScopedStats(stats = {}, scope = {}) {
  const bucketId = getStatsBucketId(scope);
  return {
    ...DEFAULT_SCOPED_STATS,
    ...((stats.scoped || {})[bucketId] || {})
  };
}

export function recordAttempt(stats = {}, scope = {}) {
  const { normalized, bucket, bucketId } = getMutableBucket(stats, scope);
  normalized.totalAttempts += 1;
  bucket.attempts += 1;
  normalized.lastPlayedPuzzle = bucketId;
  normalized.attemptsByPuzzle[bucketId] = (normalized.attemptsByPuzzle[bucketId] || 0) + 1;
  normalized.favoritePuzzleByAttempts = Object.entries(normalized.attemptsByPuzzle)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || bucketId;
  return normalized;
}

export function recordMove(stats = {}, scope = {}, amount = 1) {
  const { normalized, bucket } = getMutableBucket(stats, scope);
  const moveAmount = Math.max(0, Number(amount || 0));
  normalized.totalMoves += moveAmount;
  bucket.totalMoves += moveAmount;
  return normalized;
}

export function recordHint(stats = {}, scope = {}) {
  const { normalized, bucket } = getMutableBucket(stats, scope);
  normalized.totalHintsUsed += 1;
  bucket.hintsUsed += 1;
  return normalized;
}

export function recordUndo(stats = {}, scope = {}) {
  const { normalized, bucket } = getMutableBucket(stats, scope);
  normalized.totalUndosUsed += 1;
  bucket.undosUsed += 1;
  return normalized;
}

export function recordSolve(stats = {}, scope = {}, result = {}) {
  const { normalized, bucket, bucketId } = getMutableBucket(stats, scope);
  const elapsedMs = Math.max(0, Math.round(result.elapsedMs || 0));
  const moveCount = Math.max(0, Math.round(result.moveCount || 0));

  normalized.totalSolves += 1;
  bucket.solves += 1;
  bucket.totalTimeMs += elapsedMs;
  bucket.totalSolveMoves += moveCount;
  bucket.averageTimeMs = bucket.solves ? bucket.totalTimeMs / bucket.solves : 0;
  bucket.averageMoves = bucket.solves ? bucket.totalSolveMoves / bucket.solves : 0;
  bucket.latestSolve = {
    elapsedMs,
    moveCount,
    completedAt: result.completedAt || new Date().toISOString()
  };

  normalized.solvesByPuzzle[bucketId] = (normalized.solvesByPuzzle[bucketId] || 0) + 1;
  if (scope.puzzleType === "cube" && scope.size) {
    normalized.solvesBySize[scope.size] = (normalized.solvesBySize[scope.size] || 0) + 1;
  }

  return normalized;
}

export function setDailyStreak(stats = {}, scope = {}, streak = 0) {
  const { normalized, bucket } = getMutableBucket(stats, scope);
  bucket.dailyStreak = Math.max(bucket.dailyStreak || 0, Number(streak || 0));
  return normalized;
}

export function recordWeeklyCompletion(stats = {}, scope = {}) {
  const { normalized, bucket } = getMutableBucket(stats, scope);
  normalized.weeklyCompletions += 1;
  bucket.weeklyCompletions += 1;
  return normalized;
}

export function getStatsForFilter(stats = {}, filterId = "all") {
  const normalized = ensureContainers(stats);
  if (filterId === "all") {
    return {
      ...DEFAULT_SCOPED_STATS,
      attempts: normalized.totalAttempts,
      solves: normalized.totalSolves,
      hintsUsed: normalized.totalHintsUsed,
      undosUsed: normalized.totalUndosUsed,
      weeklyCompletions: normalized.weeklyCompletions,
      totalMoves: normalized.totalMoves
    };
  }

  if (filterId === "cube") {
    const cubeBuckets = Object.entries(normalized.scoped)
      .filter(([bucketId]) => /^\d+x\d+$/.test(bucketId))
      .map(([, bucket]) => ({ ...DEFAULT_SCOPED_STATS, ...bucket }));
    return cubeBuckets.reduce((summary, bucket) => ({
      ...summary,
      attempts: summary.attempts + bucket.attempts,
      solves: summary.solves + bucket.solves,
      totalTimeMs: summary.totalTimeMs + bucket.totalTimeMs,
      totalSolveMoves: summary.totalSolveMoves + bucket.totalSolveMoves,
      totalMoves: summary.totalMoves + (bucket.totalMoves || 0),
      hintsUsed: summary.hintsUsed + bucket.hintsUsed,
      undosUsed: summary.undosUsed + bucket.undosUsed,
      weeklyCompletions: summary.weeklyCompletions + bucket.weeklyCompletions
    }), { ...DEFAULT_SCOPED_STATS });
  }

  return {
    ...DEFAULT_SCOPED_STATS,
    ...((normalized.scoped || {})[filterId] || {})
  };
}

export function getChallengeProgressStats(progress = {}, type = "daily") {
  const summary = { ...DEFAULT_SCOPED_STATS };
  const records = progress && typeof progress === "object" ? progress : {};

  Object.values(records).forEach((challengeRecord) => {
    if (!challengeRecord || typeof challengeRecord !== "object") return;
    Object.entries(challengeRecord).forEach(([period, entry]) => {
      if (period === "streak" || period === "lastCompletedDate" || period === "lastCompletedWeek") return;
      if (!entry || typeof entry !== "object") return;
      summary.attempts += safeCount(entry.attempts);
      if (entry.completed) {
        summary.solves += 1;
        summary.totalTimeMs += safeCount(entry.bestTimeMs);
        summary.totalSolveMoves += safeCount(entry.bestMoves);
      }
    });
    if (type === "daily") {
      summary.dailyStreak = Math.max(summary.dailyStreak, safeCount(challengeRecord.streak));
    }
  });

  summary.weeklyCompletions = type === "weekly" ? summary.solves : 0;
  summary.averageTimeMs = summary.solves ? summary.totalTimeMs / summary.solves : 0;
  summary.averageMoves = summary.solves ? summary.totalSolveMoves / summary.solves : 0;
  return summary;
}

export function getStatsFilterOptions() {
  return [
    { id: "all", label: "All" },
    { id: "cube", label: "Cube" },
    { id: "2x2", label: "2x2" },
    { id: "3x3", label: "3x3" },
    { id: "4x4", label: "4x4" },
    { id: "5x5", label: "5x5" },
    { id: "6x6", label: "6x6" },
    { id: "7x7", label: "7x7" },
    { id: "pyraminx", label: "Pyraminx" },
    { id: "skewb", label: "Skewb" },
    { id: "mirrorCube", label: "Mirror Cube" },
    { id: "megaminx", label: "Megaminx" },
    { id: "daily", label: "Daily" },
    { id: "weekly", label: "Weekly" }
  ];
}
