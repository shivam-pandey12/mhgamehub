// @ts-check

import { CONNECTION_STATUS, DEFAULT_SETTINGS, ROUTES } from "../config/constants.js";
import { loadHistory, loadSession, loadState } from "../utils/storage.js";

function resolveInviteRoomCode() {
  if (typeof window === "undefined") {
    return "";
  }

  const searches = [];
  try {
    searches.push(window.location.search);
  } catch {
    // Ignore inaccessible browser state.
  }
  try {
    if (window.parent && window.parent !== window) {
      searches.push(window.parent.location.search);
    }
  } catch {
    // Embedded parents can be cross-origin outside GameHub.
  }
  try {
    if (window.top && window.top !== window && window.top !== window.parent) {
      searches.push(window.top.location.search);
    }
  } catch {
    // Embedded top windows can be cross-origin outside GameHub.
  }

  for (const search of searches) {
    const roomCode = new URLSearchParams(search).get("room")?.trim().toUpperCase() ?? "";
    if (roomCode) {
      return roomCode;
    }
  }

  return "";
}

export function createInitialState() {
  const session = loadSession();
  const lastSavedMatch = loadState();
  const inviteRoomCode = resolveInviteRoomCode();

  return {
    route: ROUTES.HOME,
    session,
    ui: {
      inviteRoomCode,
      roomCodeInput: inviteRoomCode || session.lastRoomCode || "",
      tossCall: "heads",
      playersPerTeam: DEFAULT_SETTINGS.playersPerTeam,
      connectionBanner: "Realtime room service ready",
      selectedNumberSide: null,
      selectedPicks: {
        batting: null,
        bowling: null,
      },
      numberSetDraft: null,
      numberSetValidationError: "",
      isPaused: false,
      signalSheetOpen: false,
      signalCooldownUntil: 0,
      signalHighlightUntil: 0,
      incomingSignal: null,
      confirmDialog: null,
      toasts: [],
    },
    connection: {
      status: CONNECTION_STATUS.RECONNECTING,
      lastSyncAt: null,
      latencyMs: 28,
      note: "Connecting to realtime backend",
    },
    room: null,
    match: null,
    history: loadHistory(),
    lastSavedMatch,
  };
}
