// @ts-check

import { clone } from "../utils/helpers.js";
import { getFinalMatchInsights } from "../engine/mindGame.js";
import { formatOvers } from "../utils/formatters.js";
import { saveHistory, saveLastRoom, saveSession, saveState } from "../utils/storage.js";

export const ACTIONS = {
  NAVIGATE: "NAVIGATE",
  PATCH_UI: "PATCH_UI",
  SET_CONNECTION: "SET_CONNECTION",
  SET_ROOM: "SET_ROOM",
  PATCH_ROOM: "PATCH_ROOM",
  SET_MATCH: "SET_MATCH",
  PATCH_MATCH: "PATCH_MATCH",
  SAVE_HISTORY_ENTRY: "SAVE_HISTORY_ENTRY",
  PUSH_TOAST: "PUSH_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  UPDATE_SESSION: "UPDATE_SESSION",
  RESET_FLOW: "RESET_FLOW",
};

/**
 * @param {import("../types/models").Room | null} room
 * @param {import("../types/models").Match} match
 * @returns {import("../types/models").SavedMatchState}
 */
function createSavedMatchState(room, match) {
  const totalLegalBalls = match.innings.reduce((sum, innings) => sum + innings.scoreboard.legalBalls, 0);

  return {
    savedAt: Date.now(),
    roomCode: room?.code ?? "",
    result: clone(match.result),
    numberSetLabel: match.settings.numberSetLabel ?? "Classic 1-6",
    allowedNumbers: [...(match.settings.allowedNumbers ?? [1, 2, 3, 4, 5, 6])],
    insights: getFinalMatchInsights(match, match.ballEvents, match.settings.allowedNumbers),
    basicStats: {
      totalRuns: match.innings.reduce((sum, innings) => sum + innings.scoreboard.runs, 0),
      totalWickets: match.innings.reduce((sum, innings) => sum + innings.scoreboard.wickets, 0),
      oversText: formatOvers(totalLegalBalls),
      ballCount: match.ballEvents.length,
    },
    inningsSummary: match.innings.map((innings) => ({
      teamId: innings.battingTeamId,
      teamName: match.teams[innings.battingTeamId].name,
      runs: innings.scoreboard.runs,
      wickets: innings.scoreboard.wickets,
      oversText: formatOvers(innings.scoreboard.legalBalls),
    })),
  };
}

/**
 * @param {import("../types/models").AppState} state
 * @param {{ type: string; payload?: any }} action
 * @returns {import("../types/models").AppState}
 */
export function reducer(state, action) {
  const next = clone(state);

  switch (action.type) {
    case ACTIONS.NAVIGATE: {
      next.route = action.payload;
      return next;
    }
    case ACTIONS.PATCH_UI: {
      next.ui = { ...next.ui, ...action.payload };
      return next;
    }
    case ACTIONS.SET_CONNECTION: {
      next.connection = { ...next.connection, ...action.payload };
      return next;
    }
    case ACTIONS.SET_ROOM: {
      next.room = action.payload;
      if (action.payload) {
        saveLastRoom(action.payload);
      }
      return next;
    }
    case ACTIONS.PATCH_ROOM: {
      next.room = next.room ? { ...next.room, ...action.payload } : action.payload;
      if (next.room) {
        saveLastRoom(next.room);
      }
      return next;
    }
    case ACTIONS.SET_MATCH: {
      next.match = action.payload;
      if (action.payload?.result) {
        next.lastSavedMatch = createSavedMatchState(next.room, action.payload);
        saveState(next.lastSavedMatch);
      }
      return next;
    }
    case ACTIONS.PATCH_MATCH: {
      next.match = next.match ? { ...next.match, ...action.payload } : action.payload;
      return next;
    }
    case ACTIONS.SAVE_HISTORY_ENTRY: {
      next.history = [action.payload, ...next.history].slice(0, 12);
      saveHistory(next.history);
      return next;
    }
    case ACTIONS.PUSH_TOAST: {
      next.ui.toasts = [...next.ui.toasts, action.payload].slice(-3);
      return next;
    }
    case ACTIONS.DISMISS_TOAST: {
      next.ui.toasts = next.ui.toasts.filter((item) => item.id !== action.payload);
      return next;
    }
    case ACTIONS.UPDATE_SESSION: {
      next.session = { ...next.session, ...action.payload };
      saveSession(next.session);
      return next;
    }
    case ACTIONS.RESET_FLOW: {
      next.room = null;
      next.match = null;
      next.route = "home";
      next.session = {
        ...next.session,
        activeRoomCode: "",
      };
      next.ui.selectedNumberSide = null;
      next.ui.selectedPicks = {
        batting: null,
        bowling: null,
      };
      next.ui.numberSetDraft = null;
      next.ui.numberSetValidationError = "";
      next.ui.connectionBanner = "Ready for realtime room";
      next.ui.isPaused = false;
      next.ui.matchStatsDockHidden = false;
      next.ui.signalSheetOpen = false;
      next.ui.signalCooldownUntil = 0;
      next.ui.signalHighlightUntil = 0;
      next.ui.incomingSignal = null;
      next.ui.confirmDialog = null;
      next.ui.coach = {
        active: false,
        step: 0,
      };
      next.ui.toasts = [];
      saveSession(next.session);
      return next;
    }
    default: {
      return next;
    }
  }
}
