// @ts-check

import { renderShell } from "../components/shell.js";
import { ACTIONS } from "../state/actions.js";
import { screenRegistry } from "./screenRegistry.js";

/**
 * @param {string[]} order
 * @param {number} index
 * @param {"up" | "down"} direction
 * @returns {string[]}
 */
function moveOrder(order, index, direction) {
  const next = [...order];
  const targetIndex = direction === "up" ? index - 1 : index + 1;

  if (targetIndex < 0 || targetIndex >= next.length) {
    return next;
  }

  [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
  return next;
}

export class App {
  /**
 * @param {{
 *   root: HTMLElement;
 *   store: ReturnType<import("../state/store.js").createStore>;
 *   roomService: import("../services/roomService.js").RoomService;
 *   matchService: import("../services/matchService.js").MatchService;
 *   signalSystem: import("../services/signalSystem.js").SignalSystem;
 *   socket: import("../services/mockSocket.js").MockSocket;
 * }} options
 */
  constructor({ root, store, roomService, matchService, signalSystem, socket }) {
    this.root = root;
    this.store = store;
    this.roomService = roomService;
    this.matchService = matchService;
    this.signalSystem = signalSystem;
    this.socket = socket;
    this.renderedRoute = "";
  }

  mount() {
    this.root.addEventListener("click", (event) => this.handleClick(event));
    this.root.addEventListener("change", (event) => this.handleChange(event));
    this.root.addEventListener("input", (event) => this.handleInput(event));
    this.root.addEventListener("keydown", (event) => this.handleKeyDown(event));
    this.store.subscribe(() => this.render());
    this.render();
  }

  render() {
    const state = this.store.getState();
    const screen = screenRegistry[state.route] ?? screenRegistry.home;
    const content = screen(state);
    const markup = renderShell({
      route: state.route,
      content,
      connection: state.connection,
      ui: state.ui,
    });
    const applyRender = () => {
      this.root.innerHTML = markup;
      this.renderedRoute = state.route;
    };
    const doc = /** @type {Document & { startViewTransition?: (update: () => void) => unknown }} */ (document);
    const routeChanged = Boolean(this.renderedRoute) && this.renderedRoute !== state.route;

    if (routeChanged && typeof doc.startViewTransition === "function") {
      doc.startViewTransition(() => {
        applyRender();
      });
      return;
    }

    applyRender();
  }

  /**
   * @param {MouseEvent} event
   */
  handleClick(event) {
    const target = /** @type {HTMLElement | null} */ (event.target instanceof HTMLElement ? event.target.closest("[data-action]") : null);
    if (!target) {
      return;
    }

    const action = target.dataset.action;
    const state = this.store.getState();

    switch (action) {
      case "navigate":
        this.store.dispatch({ type: ACTIONS.NAVIGATE, payload: target.dataset.route || "home" });
        break;
      case "quick-match":
        this.roomService.startQuickMatch({
          teamSize: state.ui.playersPerTeam,
        });
        break;
      case "create-room":
        this.roomService.createRoom({
          playerName: state.session.profileName,
          teamSize: state.ui.playersPerTeam,
        });
        break;
      case "join-room":
        this.roomService.joinRoom({
          playerName: state.session.profileName,
          code: state.ui.roomCodeInput.trim().toUpperCase(),
        });
        break;
      case "practice-mode":
        this.roomService.startPracticeMode();
        break;
      case "enter-lobby":
        this.roomService.enterLobby();
        break;
      case "toggle-ready":
        this.roomService.toggleReady();
        break;
      case "copy-invite":
        this.roomService.copyInviteLink();
        break;
      case "remove-player":
        this.roomService.removePlayer(target.dataset.player || "");
        break;
      case "set-player-team":
        this.roomService.setPlayerTeam(target.dataset.player || "", target.dataset.team || null);
        break;
      case "discard-room":
        if (!state.room) {
          break;
        }

        this.store.dispatch({
          type: ACTIONS.PATCH_UI,
          payload: {
            confirmDialog: {
              title: state.room.source === "offline" ? "Discard Practice Room" : "Discard Room",
              message:
                state.room.source === "offline"
                  ? "Discard this practice room and return home?"
                  : `Discard room ${state.room.code}? This will remove every player from the room.`,
              confirmLabel: "Discard",
              cancelLabel: "Keep Room",
              intent: "discard-room",
            },
          },
        });
        break;
      case "cancel-dialog":
        this.store.dispatch({
          type: ACTIONS.PATCH_UI,
          payload: {
            confirmDialog: null,
          },
        });
        break;
      case "confirm-dialog": {
        const intent = state.ui.confirmDialog?.intent ?? null;
        this.store.dispatch({
          type: ACTIONS.PATCH_UI,
          payload: {
            confirmDialog: null,
          },
        });

        if (intent === "discard-room") {
          this.matchService.clearTimers();
          this.roomService.discardRoom();
        }
        break;
      }
      case "auto-draft":
        this.roomService.autoDraftTeams();
        break;
      case "open-draft":
        this.roomService.openDraftBoard();
        break;
      case "open-signal-sheet":
        this.signalSystem.openSheet();
        break;
      case "close-signal-sheet":
        this.signalSystem.closeSheet();
        break;
      case "send-signal":
        this.signalSystem.sendSignal(target.dataset.signal || "");
        break;
      case "send-custom-signal": {
        const input = /** @type {HTMLTextAreaElement | HTMLInputElement | null} */ (
          this.root.querySelector("[data-signal-input='custom']")
        );
        this.signalSystem.sendCustomSignal(input?.value ?? "");
        break;
      }
      case "draft-pick":
        this.roomService.pickDraftPlayer(target.dataset.player || "");
        break;
      case "start-toss":
        this.matchService.startToss();
        break;
      case "run-toss":
        this.matchService.runToss(/** @type {"heads" | "tails"} */ (target.dataset.call || "heads"));
        break;
      case "choose-toss":
        this.matchService.chooseTossDecision(/** @type {"bat" | "bowl"} */ (target.dataset.decision || "bat"));
        break;
      case "start-match":
        this.roomService.lockLineups();
        this.matchService.confirmLineupsAndStart();
        break;
      case "move-lineup":
        this.handleLineupMove(target);
        break;
      case "pick-number":
        if (!state.ui.isPaused) {
          const side = /** @type {"batting" | "bowling"} */ (target.dataset.side || "batting");
          this.matchService.submitSelection(
            side,
            Number(target.dataset.value),
            {
              previewOnly: true,
            },
          );
        }
        break;
      case "lock-number":
        if (!state.ui.isPaused) {
          const side = /** @type {"batting" | "bowling"} */ (target.dataset.side || "batting");
          const value = state.ui.selectedPicks?.[side];
          this.matchService.submitSelection(
            side,
            Number(value),
          );
        }
        break;
      case "apply-number-set":
        this.roomService.updateSettings(state.ui.numberSetDraft ?? state.room?.settings ?? {});
        break;
      case "choose-number-preset":
        this.store.dispatch({
          type: ACTIONS.PATCH_UI,
          payload: {
            numberSetDraft: {
              ...(state.ui.numberSetDraft ?? state.room?.settings ?? {}),
              numberSetMode: "preset",
              numberSetPreset: target.dataset.preset || "classic",
            },
            numberSetValidationError: "",
          },
        });
        break;
      case "change-bowler":
        this.matchService.changeBowler(target.dataset.team || "", target.dataset.player || "");
        break;
      case "toggle-pause":
        this.matchService.togglePause();
        break;
      case "simulate-reconnect":
        this.matchService.simulateReconnect();
        break;
      case "back-home":
        this.matchService.clearTimers();
        this.roomService.resetToHome();
        break;
      case "dismiss-toast":
        this.store.dispatch({ type: ACTIONS.DISMISS_TOAST, payload: target.dataset.id });
        break;
      default:
        break;
    }
  }

  /**
   * @param {HTMLElement} target
   */
  handleLineupMove(target) {
    const teamId = target.dataset.team || "alpha";
    const type = /** @type {"batting" | "bowling"} */ (target.dataset.type || "batting");
    const index = Number(target.dataset.index);
    const direction = /** @type {"up" | "down"} */ (target.dataset.direction || "up");
    const state = this.store.getState();

    if (state.route === "lineup" && state.room?.teams[teamId]) {
      const currentOrder = state.room.teams[teamId][type === "batting" ? "battingOrder" : "bowlingOrder"];
      this.roomService.updateTeamLineup(teamId, type, moveOrder(currentOrder, index, direction));
      return;
    }

    if (state.route === "match" && state.match) {
      const team = state.match.teams[teamId];
      if (type === "bowling") {
        this.matchService.reorderBowlers(teamId, moveOrder(team.bowlingOrder, index, direction));
        return;
      }

      const innings = state.match.innings[state.match.currentInningsIndex];
      const movable = team.battingOrder.filter(
        (playerId) => ![innings.strikerId, innings.nonStrikerId, ...innings.dismissedIds].includes(playerId),
      );
      this.matchService.reorderBatters(teamId, moveOrder(movable, index, direction));
    }
  }

  /**
   * @param {Event} event
   */
  handleChange(event) {
    const target = /** @type {HTMLInputElement | HTMLSelectElement | null} */ (event.target instanceof HTMLElement ? event.target : null);
    if (!target?.dataset.field) {
      return;
    }

    const field = target.dataset.field;
    const value = target.value;
    const state = this.store.getState();

    switch (field) {
      case "profile-name":
        this.store.dispatch({ type: ACTIONS.UPDATE_SESSION, payload: { profileName: value } });
        break;
      case "room-code":
        this.store.dispatch({ type: ACTIONS.PATCH_UI, payload: { roomCodeInput: value.toUpperCase() } });
        break;
      case "match-mode":
        this.roomService.updateSettings({ matchMode: /** @type {any} */ (value) });
        break;
      case "bowling-mode":
        this.roomService.updateSettings({ bowlingMode: /** @type {any} */ (value) });
        break;
      case "overs":
        this.roomService.updateSettings({ overs: Number(value) });
        break;
      case "ai-difficulty":
        this.roomService.updateSettings({ aiDifficulty: /** @type {any} */ (value) });
        break;
      case "number-set-mode":
        this.store.dispatch({
          type: ACTIONS.PATCH_UI,
          payload: {
            numberSetDraft: { ...(state.ui.numberSetDraft ?? state.room?.settings ?? {}), numberSetMode: /** @type {any} */ (value) },
            numberSetValidationError: "",
          },
        });
        break;
      case "number-set-preset":
        this.store.dispatch({
          type: ACTIONS.PATCH_UI,
          payload: {
            numberSetDraft: { ...(state.ui.numberSetDraft ?? state.room?.settings ?? {}), numberSetMode: "preset", numberSetPreset: value },
            numberSetValidationError: "",
          },
        });
        break;
      case "number-range-min":
        this.store.dispatch({
          type: ACTIONS.PATCH_UI,
          payload: {
            numberSetDraft: { ...(state.ui.numberSetDraft ?? state.room?.settings ?? {}), numberSetMode: "range", numberRangeMin: Number(value) },
            numberSetValidationError: "",
          },
        });
        break;
      case "number-range-max":
        this.store.dispatch({
          type: ACTIONS.PATCH_UI,
          payload: {
            numberSetDraft: { ...(state.ui.numberSetDraft ?? state.room?.settings ?? {}), numberSetMode: "range", numberRangeMax: Number(value) },
            numberSetValidationError: "",
          },
        });
        break;
      case "custom-numbers":
        this.store.dispatch({
          type: ACTIONS.PATCH_UI,
          payload: {
            numberSetDraft: { ...(state.ui.numberSetDraft ?? state.room?.settings ?? {}), numberSetMode: "custom", customNumbersText: value },
            numberSetValidationError: "",
          },
        });
        break;
      case "players-per-team":
        this.store.dispatch({ type: ACTIONS.PATCH_UI, payload: { playersPerTeam: Number(value) } });
        break;
      case "captain-alpha":
        this.roomService.setCaptain("alpha", value);
        break;
      case "captain-beta":
        this.roomService.setCaptain("beta", value);
        break;
      case "team-name-alpha":
        this.roomService.updateTeamName("alpha", value);
        break;
      case "team-name-beta":
        this.roomService.updateTeamName("beta", value);
        break;
      default:
        break;
    }
  }

  /**
   * @param {Event} event
   */
  handleInput(event) {
    const target = /** @type {HTMLInputElement | HTMLSelectElement | null} */ (event.target instanceof HTMLElement ? event.target : null);
    const field = target?.dataset.field ?? "";

    if (field === "number-range-min" || field === "number-range-max" || field === "custom-numbers") {
      this.handleChange(event);
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  handleKeyDown(event) {
    const target = /** @type {HTMLElement | null} */ (event.target instanceof HTMLElement ? event.target : null);

    if (
      !target?.matches("[data-signal-input='custom']") ||
      event.key !== "Enter" ||
      event.shiftKey
    ) {
      return;
    }

    event.preventDefault();
    const input = /** @type {HTMLTextAreaElement | HTMLInputElement | null} */ (target);
    this.signalSystem.sendCustomSignal(input?.value ?? "");
  }
}
