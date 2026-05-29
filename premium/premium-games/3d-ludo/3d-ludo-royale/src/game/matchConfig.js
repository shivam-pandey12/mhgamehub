import { BOT_DIFFICULTIES, BOT_PERSONALITIES } from '../ai/bot.js';
import { PLAYER_IDS, PLAYER_SETS } from '../ludo/constants.js';

export const MATCH_TYPES = Object.freeze(['local', 'bots', 'mixed', 'online', 'public']);
export const CONTROLLER_TYPES = Object.freeze(['human', 'bot', 'inactive']);

export const DEFAULT_BOT_PROFILE = Object.freeze({
  difficulty: 'medium',
  personality: 'balanced'
});

export const DEFAULT_OPTIONS = Object.freeze({
  matchType: 'local',
  playerCount: 2,
  humanPlayerId: 'red',
  botDifficulty: 'medium',
  controllers: {},
  botProfiles: {},
  tokenSpeed: 'normal',
  botSpeed: 'normal',
  cinematicCamera: true,
  autoFocusCurrentPlayer: true,
  muted: false,
  volume: 0.72,
  recordingOrbitSpeed: 10,
  reducedMotion: false,
  graphicsQuality: 'auto'
});

export const QUICK_PLAY_OPTIONS = Object.freeze({
  matchType: 'mixed',
  playerCount: 4,
  humanPlayerId: 'red',
  tokenSpeed: 'normal',
  botSpeed: 'normal',
  cinematicCamera: true,
  autoFocusCurrentPlayer: true,
  muted: false,
  volume: 0.72,
  recordingOrbitSpeed: 10,
  reducedMotion: false,
  graphicsQuality: 'auto'
});

export function formatDuration(durationMs = 0) {
  const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function normalizePlayerCount(playerCount) {
  const numeric = Number(playerCount);
  return PLAYER_SETS[numeric] ? numeric : DEFAULT_OPTIONS.playerCount;
}

export function normalizeChoice(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

export function normalizeVolume(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return DEFAULT_OPTIONS.volume;
  }
  return Math.max(0, Math.min(1, numeric));
}

export function normalizeRecordingOrbitSpeed(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return DEFAULT_OPTIONS.recordingOrbitSpeed;
  }
  return Math.max(1, Math.min(10, numeric));
}

export function createDefaultBotProfiles(seedProfiles = {}, legacyDifficulty = DEFAULT_BOT_PROFILE.difficulty) {
  return Object.fromEntries(PLAYER_IDS.map((playerId) => {
    const profile = seedProfiles[playerId] || {};
    return [playerId, {
      difficulty: normalizeChoice(
        profile.difficulty || legacyDifficulty,
        BOT_DIFFICULTIES,
        DEFAULT_BOT_PROFILE.difficulty
      ),
      personality: normalizeChoice(
        profile.personality,
        BOT_PERSONALITIES,
        DEFAULT_BOT_PROFILE.personality
      )
    }];
  }));
}

export function createControllers(matchType, playerCount, options = {}) {
  const activePlayers = PLAYER_SETS[playerCount];
  const requested = options.controllers || {};
  const humanPlayerId = activePlayers.includes(options.humanPlayerId)
    ? options.humanPlayerId
    : activePlayers[0];

  return Object.fromEntries(PLAYER_IDS.map((playerId) => {
    if (!activePlayers.includes(playerId)) {
      return [playerId, 'inactive'];
    }

    if (matchType === 'local' || matchType === 'online' || matchType === 'public') {
      return [playerId, 'human'];
    }

    if (matchType === 'bots') {
      return [playerId, playerId === humanPlayerId ? 'human' : 'bot'];
    }

    return [playerId, normalizeChoice(requested[playerId], ['human', 'bot'], playerId === activePlayers[0] ? 'human' : 'bot')];
  }));
}

export function normalizeOptions(options = {}) {
  const playerCount = normalizePlayerCount(options.playerCount);
  const activePlayers = PLAYER_SETS[playerCount];
  const matchType = normalizeChoice(options.matchType, MATCH_TYPES, DEFAULT_OPTIONS.matchType);
  const humanPlayerId = activePlayers.includes(options.humanPlayerId)
    ? options.humanPlayerId
    : activePlayers[0];
  const botDifficulty = normalizeChoice(options.botDifficulty, BOT_DIFFICULTIES, DEFAULT_OPTIONS.botDifficulty);
  const botProfiles = createDefaultBotProfiles(options.botProfiles, botDifficulty);
  const controllers = createControllers(matchType, playerCount, {
    ...options,
    humanPlayerId
  });

  return {
    ...DEFAULT_OPTIONS,
    ...options,
    matchType,
    playerCount,
    humanPlayerId,
    botDifficulty,
    controllers,
    botProfiles,
    tokenSpeed: normalizeChoice(options.tokenSpeed, ['normal', 'fast'], DEFAULT_OPTIONS.tokenSpeed),
    botSpeed: normalizeChoice(options.botSpeed, ['normal', 'fast'], DEFAULT_OPTIONS.botSpeed),
    cinematicCamera: options.cinematicCamera !== false,
    autoFocusCurrentPlayer: options.autoFocusCurrentPlayer !== false,
    muted: options.muted === true,
    volume: normalizeVolume(options.volume),
    recordingOrbitSpeed: normalizeRecordingOrbitSpeed(options.recordingOrbitSpeed),
    reducedMotion: options.reducedMotion === true,
    graphicsQuality: normalizeChoice(options.graphicsQuality, ['auto', 'high', 'low'], DEFAULT_OPTIONS.graphicsQuality)
  };
}

export function buildMatchConfig(options = {}) {
  const normalized = normalizeOptions(options);
  return {
    ...normalized,
    activePlayers: [...PLAYER_SETS[normalized.playerCount]]
  };
}

export function createQuickPlayOptions(base = {}) {
  const playerCount = QUICK_PLAY_OPTIONS.playerCount;
  const activePlayers = PLAYER_SETS[playerCount];
  const controllers = Object.fromEntries(PLAYER_IDS.map((playerId) => [
    playerId,
    activePlayers.includes(playerId)
      ? playerId === QUICK_PLAY_OPTIONS.humanPlayerId ? 'human' : 'bot'
      : 'inactive'
  ]));
  const botProfiles = createDefaultBotProfiles();

  return normalizeOptions({
    ...base,
    ...QUICK_PLAY_OPTIONS,
    controllers,
    botProfiles
  });
}

export function pushEventLog(eventLog = [], message, tone = 'neutral', elapsedMs = 0, limit = 12) {
  return [{
    message,
    tone,
    time: formatDuration(elapsedMs)
  }, ...eventLog].slice(0, limit);
}
