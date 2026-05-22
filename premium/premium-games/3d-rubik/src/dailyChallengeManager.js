import { generateScramble, getAllBasicMoves } from "./cubeState.js";
import { generatePyraminxScramble } from "./pyraminxState.js";
import { generateSkewbScramble } from "./skewbState.js";
import { generateMirrorCubeScramble } from "./mirrorCubeState.js";
import { generateMegaminxScramble } from "./megaminxState.js";

const DAILY_OPTIONS = [
  {
    id: "daily-2x2",
    puzzleType: "cube",
    size: 2,
    title: "Daily 2x2",
    label: "2x2 Daily Challenge",
    difficulty: "Quick",
    description: "A compact pocket-cube scramble for fast practice."
  },
  {
    id: "daily-3x3",
    puzzleType: "cube",
    size: 3,
    title: "Daily 3x3",
    label: "3x3 Daily Challenge",
    difficulty: "Classic",
    description: "The classic daily cube scramble."
  },
  {
    id: "daily-pyraminx",
    puzzleType: "pyraminx",
    size: "pyraminx",
    title: "Daily Pyraminx",
    label: "Pyraminx Daily Challenge",
    difficulty: "Fast",
    description: "A quick tetrahedral twist puzzle run."
  },
  {
    id: "daily-skewb",
    puzzleType: "skewb",
    size: "skewb",
    title: "Daily Skewb",
    label: "Skewb Daily Challenge",
    difficulty: "Medium",
    description: "A corner-turning cube sprint with a clean daily scramble."
  },
  {
    id: "daily-mirror-cube",
    puzzleType: "mirrorCube",
    size: "mirrorCube",
    title: "Daily Mirror Cube",
    label: "Mirror Cube Daily Challenge",
    difficulty: "Shape",
    description: "A shape-shifting 3x3 block challenge for visual solvers."
  }
];

const WEEKLY_OPTIONS = [
  {
    id: "weekly-3x3-hard",
    puzzleType: "cube",
    size: 3,
    title: "Weekly 3x3 Hard",
    label: "Weekly 3x3 Hard Challenge",
    difficulty: "Hard",
    scrambleLength: 28,
    description: "A longer classic cube challenge for the week."
  },
  {
    id: "weekly-4x4",
    puzzleType: "cube",
    size: 4,
    title: "Weekly 4x4",
    label: "Weekly 4x4 Challenge",
    difficulty: "Advanced",
    scrambleLength: 45,
    description: "A big-cube weekly run with a deeper scramble."
  },
  {
    id: "weekly-pyraminx-speed",
    puzzleType: "pyraminx",
    size: "pyraminx",
    title: "Weekly Pyraminx Speed",
    label: "Weekly Pyraminx Speed Challenge",
    difficulty: "Speed",
    scrambleLength: 14,
    description: "A sharp Pyraminx sprint that stays fixed all week."
  },
  {
    id: "weekly-skewb",
    puzzleType: "skewb",
    size: "skewb",
    title: "Weekly Skewb",
    label: "Weekly Skewb Challenge",
    difficulty: "Medium",
    scrambleLength: 14,
    description: "A stylish corner-turning cube challenge for the week."
  },
  {
    id: "weekly-mirror-cube",
    puzzleType: "mirrorCube",
    size: "mirrorCube",
    title: "Weekly Mirror Cube",
    label: "Weekly Mirror Cube Challenge",
    difficulty: "Advanced",
    scrambleLength: 24,
    description: "A longer shape-shifting weekly Mirror Cube recovery."
  },
  {
    id: "weekly-megaminx",
    puzzleType: "megaminx",
    size: "megaminx",
    title: "Weekly Megaminx",
    label: "Weekly Megaminx Challenge",
    difficulty: "Final Boss",
    scrambleLength: 50,
    description: "A seeded 12-face dodecahedron challenge for a long-form solve."
  }
];

function dateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function hashString(input) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function withSeededRandom(seed, callback) {
  const originalRandom = Math.random;
  Math.random = seededRandom(seed);
  try {
    return callback();
  } finally {
    Math.random = originalRandom;
  }
}

function createCustomCubeScramble(length = 20) {
  const playable = getAllBasicMoves();
  const sequence = [];
  let previousFace = "";

  while (sequence.length < length) {
    const move = playable[Math.floor(Math.random() * playable.length)];
    const face = move[0];
    if (face === previousFace) {
      continue;
    }
    sequence.push(move);
    previousFace = face;
  }

  return sequence;
}

function createScramble(option, seed) {
  return withSeededRandom(seed, () => {
    if (option.puzzleType === "pyraminx") {
      return generatePyraminxScramble({ includeTips: true, length: option.scrambleLength || 11 });
    }
    if (option.puzzleType === "skewb") {
      return generateSkewbScramble({ length: option.scrambleLength || 11 });
    }
    if (option.puzzleType === "mirrorCube") {
      return generateMirrorCubeScramble({ length: option.scrambleLength || 20 });
    }
    if (option.puzzleType === "megaminx") {
      return generateMegaminxScramble({ length: option.scrambleLength || 50 });
    }
    if (option.scrambleLength) {
      return createCustomCubeScramble(option.scrambleLength);
    }
    return generateScramble(option.size);
  });
}

export function getDailyPuzzleOptions() {
  return DAILY_OPTIONS;
}

export function createDailyChallenge(puzzleId = "daily-3x3", date = new Date()) {
  const option = DAILY_OPTIONS.find((item) => item.id === puzzleId) || DAILY_OPTIONS[1];
  const day = dateKey(date);
  const seed = hashString(`${day}:${option.id}`);
  return {
    ...option,
    date: day,
    seed,
    scramble: createScramble(option, seed)
  };
}

export function getDailyChallengeList(date = new Date()) {
  return DAILY_OPTIONS.map((option) => createDailyChallenge(option.id, date));
}

function weekStart(date = new Date()) {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  const day = (local.getDay() + 6) % 7;
  local.setDate(local.getDate() - day);
  return local;
}

function weekKey(date = new Date()) {
  return dateKey(weekStart(date));
}

function weekRangeLabel(date = new Date()) {
  const start = weekStart(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return `${dateKey(start)} to ${dateKey(end)}`;
}

export function getWeeklyPuzzleOptions() {
  return WEEKLY_OPTIONS;
}

export function createWeeklyChallenge(id = "weekly-3x3-hard", date = new Date()) {
  const option = WEEKLY_OPTIONS.find((item) => item.id === id) || WEEKLY_OPTIONS[0];
  const week = weekKey(date);
  const seed = hashString(`${week}:${option.id}`);
  return {
    ...option,
    week,
    period: weekRangeLabel(date),
    seed,
    scramble: createScramble(option, seed)
  };
}

export function getWeeklyChallengeList(date = new Date()) {
  return WEEKLY_OPTIONS.map((option) => createWeeklyChallenge(option.id, date));
}

function previousDateKey(day) {
  const date = new Date(`${day}T12:00:00`);
  date.setDate(date.getDate() - 1);
  return dateKey(date);
}

export function updateDailyRecord(progress = {}, challenge, result = {}) {
  const records = { ...progress };
  const current = records[challenge.id] || {};
  const dayRecord = current[challenge.date] || {};
  const bestTimeMs = !dayRecord.bestTimeMs || result.elapsedMs < dayRecord.bestTimeMs
    ? result.elapsedMs
    : dayRecord.bestTimeMs;
  const bestMoves = !dayRecord.bestMoves || result.moveCount < dayRecord.bestMoves
    ? result.moveCount
    : dayRecord.bestMoves;
  const lastCompletedDate = current.lastCompletedDate || "";
  const streak = lastCompletedDate === challenge.date
    ? current.streak || 1
    : lastCompletedDate === previousDateKey(challenge.date)
      ? (current.streak || 0) + 1
      : 1;

  records[challenge.id] = {
    ...current,
    streak,
    lastCompletedDate: challenge.date,
    [challenge.date]: {
      ...dayRecord,
      completed: true,
      attempts: Math.max(1, Number(dayRecord.attempts || 0)),
      bestTimeMs,
      bestMoves,
      completedAt: new Date().toISOString()
    }
  };

  return records;
}

export function recordDailyAttempt(progress = {}, challenge) {
  const records = { ...progress };
  const current = records[challenge.id] || {};
  const dayRecord = current[challenge.date] || {};
  records[challenge.id] = {
    ...current,
    [challenge.date]: {
      ...dayRecord,
      attempts: Number(dayRecord.attempts || 0) + 1,
      completed: Boolean(dayRecord.completed)
    }
  };
  return records;
}

export function updateWeeklyRecord(progress = {}, challenge, result = {}) {
  const records = { ...progress };
  const current = records[challenge.id] || {};
  const weekRecord = current[challenge.week] || {};
  const bestTimeMs = !weekRecord.bestTimeMs || result.elapsedMs < weekRecord.bestTimeMs
    ? result.elapsedMs
    : weekRecord.bestTimeMs;
  const bestMoves = !weekRecord.bestMoves || result.moveCount < weekRecord.bestMoves
    ? result.moveCount
    : weekRecord.bestMoves;

  records[challenge.id] = {
    ...current,
    lastCompletedWeek: challenge.week,
    [challenge.week]: {
      ...weekRecord,
      completed: true,
      attempts: Math.max(1, Number(weekRecord.attempts || 0)),
      bestTimeMs,
      bestMoves,
      completedAt: new Date().toISOString()
    }
  };

  return records;
}

export function recordWeeklyAttempt(progress = {}, challenge) {
  const records = { ...progress };
  const current = records[challenge.id] || {};
  const weekRecord = current[challenge.week] || {};
  records[challenge.id] = {
    ...current,
    [challenge.week]: {
      ...weekRecord,
      attempts: Number(weekRecord.attempts || 0) + 1,
      completed: Boolean(weekRecord.completed)
    }
  };
  return records;
}
