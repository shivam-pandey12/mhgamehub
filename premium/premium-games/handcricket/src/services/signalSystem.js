// @ts-check

import { MATCH_TIMINGS, ROUTES, TEAM_IDS } from "../config/constants.js";
import { ACTIONS } from "../state/actions.js";
import { createId } from "../utils/id.js";

export const SIGNAL_GROUPS = [
  {
    id: "batting",
    label: "Batting Signals",
    signals: [
      { id: "take-strike", text: "I'll take strike" },
      { id: "you-take-strike", text: "You take strike" },
      { id: "play-safe", text: "Play safe" },
      { id: "go-aggressive", text: "Go aggressive" },
    ],
  },
  {
    id: "bowling",
    label: "Bowling Signals",
    signals: [
      { id: "i-bowl-next", text: "I'll bowl next" },
      { id: "change-bowler", text: "Change bowler" },
      { id: "try-random", text: "Try random" },
      { id: "watch-pattern", text: "Watch pattern" },
    ],
  },
  {
    id: "general",
    label: "General Signals",
    signals: [
      { id: "nice-move", text: "Nice move" },
      { id: "careful", text: "Careful" },
      { id: "finish-it", text: "Finish it" },
      { id: "wait", text: "Wait" },
    ],
  },
];

const SIGNAL_LOOKUP = new Map(
  SIGNAL_GROUPS.flatMap((group) =>
    group.signals.map((signal) => [
      signal.id,
      {
        ...signal,
        categoryId: group.id,
        categoryLabel: group.label,
      },
    ]),
  ),
);
const CUSTOM_SIGNAL_MAX_LENGTH = 56;

/**
 * @param {string} signalId
 * @returns {{ id: string; text: string; categoryId: string; categoryLabel: string } | null}
 */
export function getSignalById(signalId) {
  return SIGNAL_LOOKUP.get(signalId) ?? null;
}

/**
 * @param {import("../types/models").Room | null | undefined} room
 * @param {string | null | undefined} localPlayerId
 * @returns {"alpha" | "beta" | null}
 */
export function getLocalSignalTeamId(room, localPlayerId) {
  if (!room || !localPlayerId) {
    return null;
  }

  if (room.teams.alpha?.playerIds.includes(localPlayerId)) {
    return TEAM_IDS.ALPHA;
  }

  if (room.teams.beta?.playerIds.includes(localPlayerId)) {
    return TEAM_IDS.BETA;
  }

  return null;
}

/**
 * @param {import("../types/models").Room | null | undefined} room
 * @param {string | null | undefined} localPlayerId
 * @returns {import("../types/models").Player[]}
 */
export function getSignalTeammates(room, localPlayerId) {
  const teamId = getLocalSignalTeamId(room, localPlayerId);

  if (!room || !teamId || !localPlayerId) {
    return [];
  }

  const teammateIds = room.teams[teamId]?.playerIds.filter((playerId) => playerId !== localPlayerId) ?? [];
  return room.players.filter((player) => teammateIds.includes(player.id));
}

/**
 * @param {import("../types/models").Room | null | undefined} room
 * @param {string | null | undefined} localPlayerId
 * @returns {boolean}
 */
export function canUseSignals(room, localPlayerId) {
  return Boolean(room?.source === "realtime" && getSignalTeammates(room, localPlayerId).length);
}

export class SignalSystem {
  /**
   * @param {{ store: ReturnType<import("../state/store.js").createStore>; socket: import("./mockSocket.js").MockSocket }} options
   */
  constructor({ store, socket }) {
    this.store = store;
    this.socket = socket;
    this.hideTimer = null;
    this.unsubscribe = this.socket.on("receive_signal", (payload) => this.handleIncomingSignal(payload));
  }

  destroy() {
    this.clearHideTimer();
    this.unsubscribe?.();
  }

  clearHideTimer() {
    if (!this.hideTimer) {
      return;
    }

    window.clearTimeout(this.hideTimer);
    this.hideTimer = null;
  }

  /**
   * Signal updates should live in the dedicated match signal area, not compete
   * with right-side toasts.
   *
   * @param {import("../types/models").AppState["ui"]["toasts"]} toasts
   * @returns {import("../types/models").AppState["ui"]["toasts"]}
   */
  stripSignalToasts(toasts) {
    const knownSignalTexts = new Set(Array.from(SIGNAL_LOOKUP.values(), (signal) => signal.text));
    return (toasts ?? []).filter((toast) => {
      const message = String(toast?.message ?? "").trim();
      const separatorIndex = message.indexOf(":");

      if (separatorIndex <= 0) {
        return true;
      }

      const signalText = message.slice(separatorIndex + 1).trim();
      return !knownSignalTexts.has(signalText);
    });
  }

  /**
   * Keep the latest team signal visible in the dedicated signal area, while the
   * highlight fades after a short moment.
   *
   * @param {{
   *   signalId: string;
   *   categoryId: string;
   *   text: string;
   *   fromPlayerId: string | null;
   *   fromPlayerName: string;
   *   receivedAt?: number;
   * }} signal
   */
  showSignal(signal) {
    const state = this.store.getState();

    this.clearHideTimer();

    this.store.dispatch({
      type: ACTIONS.PATCH_UI,
      payload: {
        incomingSignal: {
          signalId: signal.signalId,
          categoryId: signal.categoryId,
          text: signal.text,
          fromPlayerId: signal.fromPlayerId,
          fromPlayerName: signal.fromPlayerName,
          receivedAt: signal.receivedAt ?? Date.now(),
        },
        signalHighlightUntil: Date.now() + MATCH_TIMINGS.SIGNAL_DISPLAY,
        toasts: this.stripSignalToasts(state.ui.toasts),
      },
    });

    this.hideTimer = window.setTimeout(() => {
      this.store.dispatch({
        type: ACTIONS.PATCH_UI,
        payload: {
          signalHighlightUntil: 0,
        },
      });
      this.hideTimer = null;
    }, MATCH_TIMINGS.SIGNAL_DISPLAY);
  }

  /**
   * @param {string} message
   * @param {"info" | "success" | "warning"} [tone]
   */
  pushToast(message, tone = "info") {
    this.store.dispatch({
      type: ACTIONS.PUSH_TOAST,
      payload: {
        id: createId("toast"),
        message,
        tone,
      },
    });
  }

  openSheet() {
    const state = this.store.getState();

    if (!state.match || state.route !== ROUTES.MATCH) {
      return;
    }

    if (!canUseSignals(state.room, state.session.localPlayerId)) {
      this.pushToast("Signals are available only in team multiplayer rooms.", "info");
      return;
    }

    this.store.dispatch({
      type: ACTIONS.PATCH_UI,
      payload: {
        signalSheetOpen: true,
      },
    });
  }

  closeSheet() {
    this.store.dispatch({
      type: ACTIONS.PATCH_UI,
      payload: {
        signalSheetOpen: false,
      },
    });
  }

  /**
   * @param {string | null | undefined} value
   * @returns {string}
   */
  sanitizeCustomText(value) {
    return String(value ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, CUSTOM_SIGNAL_MAX_LENGTH);
  }

  /**
   * @param {string} signalId
   */
  sendSignal(signalId) {
    const state = this.store.getState();
    const signal = getSignalById(signalId);
    const cooldownUntil = Number(state.ui.signalCooldownUntil) || 0;

    if (!signal || !state.match || !state.room || !canUseSignals(state.room, state.session.localPlayerId)) {
      this.closeSheet();
      return;
    }

    if (Date.now() < cooldownUntil) {
      const secondsLeft = Math.max(1, Math.ceil((cooldownUntil - Date.now()) / 1000));
      this.pushToast(`Signals cooling down. Try again in ${secondsLeft}s.`, "info");
      this.closeSheet();
      return;
    }

    const nextCooldown = Date.now() + MATCH_TIMINGS.SIGNAL_COOLDOWN;
    this.store.dispatch({
      type: ACTIONS.PATCH_UI,
      payload: {
        signalSheetOpen: false,
        signalCooldownUntil: nextCooldown,
      },
    });

    this.socket.emit(
      "send_signal",
      {
        signalId: signal.id,
      },
      (response) => {
        if (response?.ok) {
          this.showSignal({
            signalId: signal.id,
            categoryId: signal.categoryId,
            text: signal.text,
            fromPlayerId: state.session.localPlayerId ?? null,
            fromPlayerName: "You",
          });
          return;
        }

        this.pushToast(response?.error ?? "Unable to send teammate signal.", "warning");
      },
    );
  }

  /**
   * @param {string} text
   */
  sendCustomSignal(text) {
    const state = this.store.getState();
    const cooldownUntil = Number(state.ui.signalCooldownUntil) || 0;
    const sanitizedText = this.sanitizeCustomText(text);

    if (!state.match || !state.room || !canUseSignals(state.room, state.session.localPlayerId)) {
      this.closeSheet();
      return;
    }

    if (!sanitizedText) {
      this.pushToast("Type a short teammate note first.", "info");
      return;
    }

    if (Date.now() < cooldownUntil) {
      const secondsLeft = Math.max(1, Math.ceil((cooldownUntil - Date.now()) / 1000));
      this.pushToast(`Signals cooling down. Try again in ${secondsLeft}s.`, "info");
      return;
    }

    const nextCooldown = Date.now() + MATCH_TIMINGS.SIGNAL_COOLDOWN;
    this.store.dispatch({
      type: ACTIONS.PATCH_UI,
      payload: {
        signalSheetOpen: false,
        signalCooldownUntil: nextCooldown,
      },
    });

    this.socket.emit(
      "send_signal",
      {
        customText: sanitizedText,
      },
      (response) => {
        if (response?.ok) {
          this.showSignal({
            signalId: "custom",
            categoryId: "custom",
            text: sanitizedText,
            fromPlayerId: state.session.localPlayerId ?? null,
            fromPlayerName: "You",
          });
          return;
        }

        this.pushToast(response?.error ?? "Unable to send teammate note.", "warning");
      },
    );
  }

  /**
   * @param {any} payload
   */
  handleIncomingSignal(payload) {
    const state = this.store.getState();
    const localPlayerId = state.session.localPlayerId;
    const localTeamId = getLocalSignalTeamId(state.room, localPlayerId);
    const senderTeamId =
      payload?.senderTeamId === TEAM_IDS.ALPHA || payload?.senderTeamId === TEAM_IDS.BETA
        ? payload.senderTeamId
        : null;

    if (!state.room || payload?.roomId !== state.room.code) {
      return;
    }

    if (payload?.fromPlayerId && localPlayerId && payload.fromPlayerId === localPlayerId) {
      return;
    }

    if (localTeamId && senderTeamId && localTeamId !== senderTeamId) {
      return;
    }

    this.showSignal({
      signalId: payload?.signalId ?? "",
      categoryId: payload?.categoryId ?? "general",
      text: payload?.text ?? "Signal",
      fromPlayerId: payload?.fromPlayerId ?? null,
      fromPlayerName: payload?.fromPlayerName ?? "Teammate",
      receivedAt: payload?.sentAt ?? Date.now(),
    });
  }
}
