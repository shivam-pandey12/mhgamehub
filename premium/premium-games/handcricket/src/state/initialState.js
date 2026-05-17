// @ts-check

import { CONNECTION_STATUS, DEFAULT_SETTINGS, ROUTES } from "../config/constants.js";
import { loadHistory, loadSession, loadState } from "../utils/storage.js";

export function createInitialState() {
  const session = loadSession();
  const lastSavedMatch = loadState();
  const urlRoomCode =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("room")?.trim().toUpperCase() ?? ""
      : "";

  return {
    route: ROUTES.HOME,
    session,
    ui: {
      roomCodeInput: urlRoomCode || session.lastRoomCode || "",
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
