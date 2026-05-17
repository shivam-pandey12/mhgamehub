// @ts-check

import { getDefaultNumberSet } from "../engine/numberSets.js";

/** @type {const} */
export const ROUTES = {
  HOME: "home",
  ROOM: "room",
  LOBBY: "lobby",
  DRAFT: "draft",
  TOSS: "toss",
  LINEUP: "lineup",
  MATCH: "match",
  RESULT: "result",
  HISTORY: "history",
  RULES: "rules",
};

/** @type {const} */
export const ROOM_STATUS = {
  IDLE: "idle",
  LOBBY: "lobby",
  DRAFT: "draft",
  TOSS: "toss",
  LINEUP: "lineup",
  LIVE: "live",
  COMPLETED: "completed",
};

/** @type {const} */
export const MATCH_PHASE = {
  SETUP: "setup",
  TOSS: "toss",
  LINEUP: "lineup",
  LIVE: "live",
  BREAK: "innings-break",
  COMPLETE: "complete",
};

/** @type {const} */
export const MATCH_MODES = {
  SINGLE: "single",
  TWO_BATSMEN: "two-batsmen",
};

/** @type {const} */
export const BOWLING_MODES = {
  FREE: "free-change",
  LOCKED: "over-locked",
};

/** @type {const} */
export const CONNECTION_STATUS = {
  CONNECTED: "connected",
  WAITING: "waiting",
  SYNCING: "syncing",
  RECONNECTING: "reconnecting",
  OFFLINE: "offline",
};

/** @type {const} */
export const CONTROL_MODES = {
  LOCAL_VS_AI: "local-vs-ai",
  HOTSEAT: "hotseat",
};

export const TEAM_IDS = {
  ALPHA: "alpha",
  BETA: "beta",
};

export const TEAM_NAMES = ["Storm Falcons", "Metro Blazers", "Night Chargers", "Sky Strikers"];

export const PLAYER_NAME_POOL = [
  "Aadi",
  "Rhea",
  "Kabir",
  "Mira",
  "Arjun",
  "Tara",
  "Ishaan",
  "Zoya",
  "Neel",
  "Kiara",
  "Dev",
  "Anya",
];

const DEFAULT_NUMBER_SET = getDefaultNumberSet();

export const DEFAULT_SETTINGS = {
  matchMode: MATCH_MODES.TWO_BATSMEN,
  bowlingMode: BOWLING_MODES.LOCKED,
  overs: 2,
  playersPerTeam: 2,
  controlMode: CONTROL_MODES.LOCAL_VS_AI,
  numberSetMode: DEFAULT_NUMBER_SET.numberSetMode,
  numberSetPreset: DEFAULT_NUMBER_SET.numberSetPreset,
  numberSetLabel: DEFAULT_NUMBER_SET.numberSetLabel,
  allowedNumbers: DEFAULT_NUMBER_SET.allowedNumbers,
  numberRangeMin: DEFAULT_NUMBER_SET.numberRangeMin,
  numberRangeMax: DEFAULT_NUMBER_SET.numberRangeMax,
  customNumbersText: DEFAULT_NUMBER_SET.customNumbersText,
  aiDifficulty: "medium",
};

export const OVERS_OPTIONS = [2, 5, 10];
export const PLAYERS_PER_TEAM_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export const TEAM_SIZE = 4;
export const MAX_ROOM_PLAYERS = DEFAULT_SETTINGS.playersPerTeam * 2;
export const ROOM_CODE_LENGTH = 6;

export const BALL_CHOICES = DEFAULT_NUMBER_SET.allowedNumbers;

export const STORAGE_KEYS = {
  SESSION: "mh-handrex-session",
  HISTORY: "mh-handrex-history",
  ROOM: "mh-handrex-room",
  STATE: "mh-handrex-state",
  RELEASE_NOTICE: "mh-handrex-release-notice",
};

export const MOCK_DELAYS = {
  PLAYER_JOIN_MIN: 350,
  PLAYER_JOIN_MAX: 950,
  AI_PICK_MIN: 500,
  AI_PICK_MAX: 1200,
  REVEAL: 850,
  STATUS_PULSE: 2800,
};

export const MATCH_TIMINGS = {
  WAITING_PULSE: 300,
  REVEAL_LOCK: 320,
  RESULT_DISPLAY: 920,
  INNINGS_BREAK: 960,
  RECONNECT: 800,
  SIGNAL_COOLDOWN: 2500,
  SIGNAL_DISPLAY: 2600,
};

export const APP_RELEASE = {
  version: "v1.2.0",
  releasedAt: "2026-04-16T00:00:00+05:30",
  whatsNewUrl: "",
  whatsNewVisibleDays: 7,
};
