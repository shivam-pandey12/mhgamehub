// @ts-check

import { renderBallTimeline } from "../components/ballTimeline.js";
import { renderButton } from "../components/button.js";
import { renderCard } from "../components/card.js";
import { renderLineupEditor } from "../components/lineupEditor.js";
import { renderMatchStatsDock } from "../components/matchStatsDock.js";
import { renderNumberPad } from "../components/numberPad.js";
import { renderScoreboard } from "../components/scoreboard.js";
import { getMomentumState, getPatternHints, getPressureLabel } from "../engine/mindGame.js";
import { SIGNAL_GROUPS, canUseSignals, getSignalTeammates } from "../services/signalSystem.js";

/**
 * @param {import("../types/models").AppState} state
 * @param {import("../types/models").Match} match
 * @returns {{ kicker: string; title: string; note: string; toneClass: string }}
 */
function getRoundStateCopy(state, match) {
  const revealState = match.revealState;

  if (state.ui.isPaused) {
    return {
      kicker: "Paused",
      title: "Match paused",
      note: "Selections are frozen until the match resumes.",
      toneClass: "is-warning",
    };
  }

  if (state.connection.status === "reconnecting") {
    return {
      kicker: "Reconnect",
      title: "Restoring link",
      note: "Waiting for the realtime connection to recover.",
      toneClass: "is-warning",
    };
  }

  if (revealState.status === "locked") {
    return {
      kicker: "Syncing",
      title: "Both picks locked",
      note: "Numbers stay hidden until the reveal animation completes.",
      toneClass: "is-live",
    };
  }

  if (revealState.status === "revealing") {
    return {
      kicker: "Reveal",
      title: revealState.lastBall?.commentary ?? "Ball resolved",
      note: "Both numbers are shown together to keep every ball fair.",
      toneClass: "is-live",
    };
  }

  if (revealState.status === "waiting") {
    return {
      kicker: "Waiting",
      title: "Waiting for opponent",
      note: state.ui.connectionBanner || "One side has locked in. Waiting for the other pick.",
      toneClass: "",
    };
  }

  return {
    kicker: "Ready",
    title: revealState.lastBall?.commentary ?? "Awaiting next ball",
    note: "Lock both picks to start the next reveal.",
    toneClass: "",
  };
}

/**
 * @param {import("../types/models").AppState} state
 * @param {import("../types/models").Match} match
 * @param {{"batting" | "bowling" | null}} localActiveSide
 * @param {string | null} localTeamId
 * @param {boolean} hotseat
 * @param {boolean} practiceMode
 * @returns {{ label: string; tone: string }}
 */
function getTurnIndicator(state, match, localActiveSide, localTeamId, hotseat, practiceMode) {
  const innings = match.innings[match.currentInningsIndex];

  if (state.ui.isPaused) {
    return { label: "Match paused", tone: "is-warning" };
  }

  if (state.connection.status === "reconnecting") {
    return { label: "Reconnecting", tone: "is-warning" };
  }

  if (match.revealState.status === "locked") {
    return { label: "Reveal syncing", tone: "is-live" };
  }

  if (match.revealState.status === "revealing") {
    return { label: "Result live", tone: "is-live" };
  }

  if (hotseat) {
    if (match.revealState.waitingFor === "batting") {
      return { label: "Batting side to pick", tone: "" };
    }

    if (match.revealState.waitingFor === "bowling") {
      return { label: "Bowling side to pick", tone: "" };
    }

    return { label: "Pick both sides", tone: "is-live" };
  }

  if (match.revealState.waitingFor) {
    if (match.revealState.waitingFor === localActiveSide) {
      return { label: "Your pick needed", tone: "is-live" };
    }

    if (practiceMode && localTeamId && innings[match.revealState.waitingFor === "batting" ? "battingTeamId" : "bowlingTeamId"] === localTeamId) {
      return {
        label: match.revealState.waitingFor === "batting" ? "AI teammate choosing" : "AI teammate bowling",
        tone: "",
      };
    }

    return {
      label: "Waiting for opponent",
      tone: "",
    };
  }

  if (localActiveSide === "batting") {
    return {
      label: "Your turn to bat",
      tone: "is-live",
    };
  }

  if (localActiveSide === "bowling") {
    return {
      label: "Your turn to bowl",
      tone: "is-live",
    };
  }

  if (practiceMode && localTeamId && (innings.battingTeamId === localTeamId || innings.bowlingTeamId === localTeamId)) {
    return {
      label: "AI teammate on this ball",
      tone: "",
    };
  }

  return {
    label: "Waiting for active players",
    tone: "",
  };
}

/**
 * @param {import("../types/models").AppState} state
 * @returns {string}
 */
export function renderMatchScreen(state) {
  if (!state.room || !state.match) {
    return "";
  }

  const playersById = Object.fromEntries(state.room.players.map((player) => [player.id, player]));
  const innings = state.match.innings[state.match.currentInningsIndex];
  const localPlayerId = state.session.localPlayerId;
  const localTeamId = state.room.teams.alpha?.playerIds.includes(localPlayerId ?? "")
    ? "alpha"
    : state.room.teams.beta?.playerIds.includes(localPlayerId ?? "")
      ? "beta"
      : null;
  const localActiveSide = innings.strikerId === localPlayerId ? "batting" : innings.currentBowlerId === localPlayerId ? "bowling" : null;
  const hotseat = state.match.settings.controlMode === "hotseat";
  const practiceMode = state.room.source === "offline";
  const signalEnabled = canUseSignals(state.room, localPlayerId);
  const signalTeammates = getSignalTeammates(state.room, localPlayerId);
  const signalCooldownUntil = Number(state.ui.signalCooldownUntil) || 0;
  const signalCoolingDown = Date.now() < signalCooldownUntil;
  const signalCooldownSeconds = Math.max(1, Math.ceil((signalCooldownUntil - Date.now()) / 1000));
  const activeSignal = state.ui.incomingSignal ?? null;
  const signalHighlightUntil = Number(state.ui.signalHighlightUntil) || 0;
  const signalHighlighted = Boolean(activeSignal) && Date.now() < signalHighlightUntil;
  const signalPanelEnabled = signalEnabled || Boolean(activeSignal);
  const paused = Boolean(state.ui.isPaused);
  const revealState = state.match.revealState;
  const battingSelected = innings.pendingChoices.batting?.value ?? null;
  const bowlingSelected = innings.pendingChoices.bowling?.value ?? null;
  const selectedPicks = state.ui.selectedPicks ?? { batting: null, bowling: null };
  const allowedNumbers = Array.isArray(state.match.settings.allowedNumbers) && state.match.settings.allowedNumbers.length
    ? state.match.settings.allowedNumbers
    : [1, 2, 3, 4, 5, 6];
  const numberSetLabel = state.match.settings.numberSetLabel ?? "Classic 1-6";
  const battingLocked = revealState.lockedSides.includes("batting") || battingSelected !== null;
  const bowlingLocked = revealState.lockedSides.includes("bowling") || bowlingSelected !== null;
  const battingPickerValue = battingLocked ? battingSelected : selectedPicks.batting;
  const bowlingPickerValue = bowlingLocked ? bowlingSelected : selectedPicks.bowling;
  const roundBusy =
    paused ||
    revealState.status === "locked" ||
    revealState.status === "revealing" ||
    state.connection.status === "reconnecting" ||
    state.connection.status === "offline";
  const battingDisabled = roundBusy || (hotseat ? battingLocked : localActiveSide !== "batting" || battingLocked);
  const bowlingDisabled = roundBusy || (hotseat ? bowlingLocked : localActiveSide !== "bowling" || bowlingLocked);
  const battingTeam = state.match.teams[innings.battingTeamId];
  const bowlingTeam = state.match.teams[innings.bowlingTeamId];
  const movableBatters = battingTeam.battingOrder.filter(
    (playerId) => ![innings.strikerId, innings.nonStrikerId, ...innings.dismissedIds].includes(playerId),
  );
  const canManageBatting = hotseat || (localTeamId ? innings.battingTeamId === localTeamId : false);
  const canManageBowling = hotseat || (localTeamId ? innings.bowlingTeamId === localTeamId : false);
  const bowlerLocked =
    paused ||
    revealState.status === "locked" ||
    revealState.status === "revealing" ||
    Boolean(innings.pendingChoices.batting || innings.pendingChoices.bowling) ||
    (state.match.settings.bowlingMode === "over-locked" && innings.scoreboard.ballsInOver !== 0);
  const roundState = getRoundStateCopy(state, state.match);
  const turnIndicator = getTurnIndicator(state, state.match, localActiveSide, localTeamId, hotseat, practiceMode);
  const pressureLabel = getPressureLabel(state.match, state.match.ballEvents, allowedNumbers);
  const momentumState = getMomentumState(state.match, state.match.ballEvents, allowedNumbers);
  const patternHints = getPatternHints(state.match, state.match.ballEvents, allowedNumbers, 3);
  const showRevealNumbers = revealState.status === "revealing";
  const lastBall = state.match.revealState.lastBall;
  const revealResultClass = showRevealNumbers
    ? lastBall?.resultType === "wicket"
      ? "is-wicket"
      : lastBall?.resultTone === "mega"
        ? "is-mega"
        : lastBall?.resultTone === "boundary" || lastBall?.resultTone === "power"
          ? "is-boundary"
          : "is-run"
    : "";
  const revealResultText = showRevealNumbers
    ? lastBall?.resultLabel ?? (lastBall?.resultType === "wicket" ? "Wicket!" : `+${lastBall?.runs ?? 0}`)
    : "";
  const battingReveal = showRevealNumbers
    ? lastBall?.battingNumber ?? "-"
    : battingLocked
      ? "Locked"
      : revealState.status === "locked"
        ? "Locked"
        : "Waiting";
  const bowlingReveal = showRevealNumbers
    ? lastBall?.bowlingNumber ?? "-"
    : bowlingLocked
      ? "Locked"
      : revealState.status === "locked"
        ? "Locked"
        : "Waiting";

  return `
    <section class="match-layout">
      ${renderMatchStatsDock({
        match: state.match,
        playersById,
        hidden: Boolean(state.ui.matchStatsDockHidden),
      })}
      ${renderScoreboard({
        room: state.room,
        match: state.match,
        playersById,
        turnLabel: turnIndicator.label,
        turnTone: turnIndicator.tone,
        incomingSignal: activeSignal,
        signalHighlighted,
        scorePulse: showRevealNumbers,
      })}
      <div class="number-rule-strip" title="Allowed numbers: ${allowedNumbers.join(", ")}">
        <span>Number Set</span>
        <strong>${numberSetLabel}</strong>
        <small>${allowedNumbers.join(", ")}</small>
      </div>
      <section class="tactical-strip" aria-label="Mind game hints from revealed balls">
        <div class="tactical-chip tactical-chip--${pressureLabel.tone}">
          <span>Pressure</span>
          <strong>${pressureLabel.label}</strong>
          <small>${pressureLabel.detail}</small>
        </div>
        <div class="tactical-chip tactical-chip--${momentumState.tone}">
          <span>Momentum</span>
          <strong>${momentumState.label}</strong>
          <small>${momentumState.detail}</small>
        </div>
        <details class="mind-hints" ${patternHints.length ? "open" : ""}>
          <summary>Mind Game</summary>
          ${
            patternHints.length
              ? `<ul>${patternHints.map((hint) => `<li>${hint}</li>`).join("")}</ul>`
              : `<p class="muted">Reveal a few balls to build useful patterns.</p>`
          }
        </details>
      </section>
      ${renderCard({
        kicker: "Team Signal",
        title: signalPanelEnabled ? "Quick coordination" : "Signals unavailable",
        className: `match-signal-card ${signalHighlighted ? "card--focus" : ""}`,
        content: signalPanelEnabled
          ? `
              <div class="signal-hub">
                <div class="signal-hub__head">
                  <div>
                    <strong>${signalTeammates.map((player) => player.name).join(", ") || activeSignal?.fromPlayerName || "Teammate connected"}</strong>
                    <p class="muted">Signals appear here without blocking the ball flow. Use a sample or type your own short note.</p>
                  </div>
                  ${renderButton({
                    label: signalCoolingDown ? `Signal in ${signalCooldownSeconds}s` : "Open Signals",
                    action: "open-signal-sheet",
                    variant: "secondary",
                    disabled: !signalEnabled,
                  })}
                </div>
                <div class="signal-hub__message ${signalHighlighted ? "is-live" : ""}">
                  <span class="signal-hub__label">Signal Channel</span>
                  <strong>${activeSignal ? `${activeSignal.fromPlayerName || "Teammate"}: ${activeSignal.text}` : "No teammate signal right now"}</strong>
                </div>
              </div>
            `
          : `
              <div class="signal-hub">
                <div class="signal-hub__message">
                  <span class="signal-hub__label">Unavailable</span>
                  <strong>Signals activate only in live team multiplayer matches with at least one teammate.</strong>
                </div>
              </div>
            `,
      })}
      <div class="match-layout__controls">
        ${renderCard({
          kicker: roundState.kicker,
          title: roundState.title,
          className: "card--focus match-pick-card",
          content: `
            <div class="round-banner ${roundState.toneClass}">
              <strong>${state.ui.connectionBanner || roundState.title}</strong>
              <span>${roundState.note}</span>
            </div>
            <div class="number-pad-row">
              ${renderNumberPad({
                title: "Batting Pick",
                side: "batting",
                selected: battingPickerValue,
                disabled: battingDisabled,
                locked: battingLocked,
                busy: revealState.status === "locked" || revealState.status === "revealing",
                waiting: battingLocked && revealState.status === "waiting",
                allowedNumbers,
                statusLabel: battingLocked ? "Locked" : battingDisabled ? "Waiting" : "Ready",
                note: hotseat
                  ? "Pick for batting side"
                  : localActiveSide === "batting"
                    ? battingLocked
                      ? "Your batting pick is locked in."
                      : "Your side is batting"
                    : practiceMode && localTeamId === innings.battingTeamId
                      ? battingLocked
                        ? "AI teammate locked batting pick"
                        : "AI teammate is batting"
                    : battingLocked
                      ? "Opponent locked batting pick"
                      : "Waiting for opponent",
              })}
              ${renderNumberPad({
                title: "Bowling Pick",
                side: "bowling",
                selected: bowlingPickerValue,
                disabled: bowlingDisabled,
                locked: bowlingLocked,
                busy: revealState.status === "locked" || revealState.status === "revealing",
                waiting: bowlingLocked && revealState.status === "waiting",
                allowedNumbers,
                statusLabel: bowlingLocked ? "Locked" : bowlingDisabled ? "Waiting" : "Ready",
                note: hotseat
                  ? "Pick for bowling side"
                  : localActiveSide === "bowling"
                    ? bowlingLocked
                      ? "Your bowling pick is locked in."
                      : "Your side is bowling"
                    : practiceMode && localTeamId === innings.bowlingTeamId
                      ? bowlingLocked
                        ? "AI teammate locked bowling pick"
                        : "AI teammate is bowling"
                    : bowlingLocked
                      ? "Opponent locked bowling pick"
                      : "Waiting for opponent",
              })}
            </div>
            <div class="action-row">
              ${renderButton({ label: paused ? "Resume Match" : "Pause Match", action: "toggle-pause", variant: "ghost" })}
              ${renderButton({ label: "Reconnect", action: "simulate-reconnect", variant: "ghost" })}
              ${renderButton({ label: "Leave Match", action: "back-home", variant: "danger" })}
            </div>
          `,
        })}
        ${renderCard({
          kicker:
            revealState.status === "revealing"
              ? "Reveal"
              : revealState.status === "locked"
                ? "Hidden Picks"
                : revealState.status === "waiting"
                  ? "Waiting"
                  : "Latest Ball",
          className: "match-reveal-card",
          title:
            revealState.status === "revealing"
              ? state.match.revealState.lastBall?.commentary ?? "Ball resolved"
              : revealState.status === "locked"
                ? "Both picks are hidden"
                : revealState.status === "waiting"
                  ? "Waiting for opponent"
                  : state.match.revealState.lastBall?.commentary ?? "Awaiting first reveal",
          content: `
            <div class="reveal-panel ${showRevealNumbers ? "is-live" : ""} ${revealState.status === "locked" ? "is-hidden" : ""}">
              <div>
                <strong>Bat</strong>
                <span class="reveal-panel__value">${battingReveal}</span>
              </div>
              <div>
                <strong>Bowl</strong>
                <span class="reveal-panel__value">${bowlingReveal}</span>
              </div>
            </div>
            ${showRevealNumbers ? `<div class="ball-result ${revealResultClass}">${revealResultText}</div>` : ""}
            ${showRevealNumbers && lastBall?.commentary ? `<p class="result-copy">${lastBall.commentary}</p>` : ""}
            ${
              revealState.status === "waiting"
                ? `<p class="warning-text">Waiting for opponent to lock the remaining pick.</p>`
                : revealState.status === "locked"
                  ? `<p class="warning-text">Numbers are synced and will reveal together after a short delay.</p>`
                  : paused
                    ? `<p class="warning-text">Match paused. Picks are temporarily disabled.</p>`
                    : ""
            }
          `,
        })}
      </div>
      <div class="grid-two">
        ${renderCard({
          kicker: "Captain Control",
          title: "Batting Order Management",
          className: "match-captain-card",
          content: canManageBatting
            ? renderLineupEditor({
                title: battingTeam.name,
                teamId: innings.battingTeamId,
                type: "batting",
                order: movableBatters,
                playersById,
                movableIds: movableBatters,
                helper: "Only remaining batters can be reshuffled mid-match.",
              })
            : `<p class="muted">Opponent captain is managing the remaining batting queue.</p>`,
        })}
        ${renderCard({
          kicker: "Captain Control",
          title: "Bowling Order And Changes",
          className: "match-captain-card",
          content: canManageBowling
            ? `
                <p class="muted">
                  ${
                    bowlerLocked && state.match.settings.bowlingMode === "over-locked" && innings.scoreboard.ballsInOver !== 0
                      ? "Bowler is locked until the over ends."
                      : bowlerLocked
                        ? "Bowler changes unlock after the current ball resolves."
                      : "Tap a bowler to make them active for the next ball."
                  }
                </p>
                ${renderLineupEditor({
                  title: `${bowlingTeam.name} bowling queue`,
                  teamId: innings.bowlingTeamId,
                  type: "bowling",
                  order: bowlingTeam.bowlingOrder,
                  playersById,
                  locked: bowlerLocked,
                  helper: "Top position becomes the active bowler when changes are allowed.",
                })}
                <div class="chip-row">
                  ${bowlingTeam.playerIds
                    .map((playerId) => {
                      const player = playersById[playerId];
                      return `
                        <button
                          class="chip-btn ${innings.currentBowlerId === playerId ? "is-active" : ""}"
                          data-action="change-bowler"
                          data-team="${innings.bowlingTeamId}"
                          data-player="${playerId}"
                          ${bowlerLocked ? "disabled" : ""}
                        >
                          ${player?.name ?? playerId}
                        </button>
                      `;
                    })
                    .join("")}
                </div>
              `
            : `<p class="muted">Opponent bowling changes are controlled from the other live client.</p>`,
        })}
      </div>
      ${renderBallTimeline(state.match.ballEvents, { match: state.match, allowedNumbers })}
      ${
        state.ui.signalSheetOpen
          ? `
            <section class="signal-sheet" aria-label="Quick teammate signals">
              <div class="signal-sheet__header">
                <div>
                  <p class="card__kicker">Quick Signals</p>
                  <h3 class="card__title">Teammate Signals</h3>
                </div>
                <button class="icon-btn" data-action="close-signal-sheet" aria-label="Close signals">x</button>
              </div>
              <p class="muted">
                Sent only to teammate${signalTeammates.length > 1 ? "s" : ""}.
                ${signalCoolingDown ? ` Ready again in ${signalCooldownSeconds}s.` : " Tap once to send instantly, or type a short custom note."}
              </p>
              <div class="signal-sheet__composer">
                <label class="field">
                  <span>Type Your Own Signal</span>
                  <textarea
                    class="signal-sheet__input"
                    data-signal-input="custom"
                    maxlength="56"
                    rows="2"
                    placeholder="Type a short note for your teammate"
                  ></textarea>
                </label>
                <div class="action-row">
                  ${renderButton({
                    label: "Send Custom Signal",
                    action: "send-custom-signal",
                    variant: "secondary",
                    disabled: signalCoolingDown,
                  })}
                </div>
              </div>
              <div class="signal-sheet__groups">
                ${SIGNAL_GROUPS.map(
                  (group) => `
                    <section class="signal-group">
                      <p class="team-preview__label">${group.label}</p>
                      <div class="signal-group__grid">
                        ${group.signals
                          .map(
                            (signal) => `
                            <button
                              class="signal-btn"
                              data-action="send-signal"
                              data-signal="${signal.id}"
                            >
                                <span class="signal-btn__text">${signal.text}</span>
                              </button>
                            `,
                          )
                          .join("")}
                      </div>
                    </section>
                  `,
                ).join("")}
              </div>
            </section>
          `
          : ""
      }
    </section>
  `;
}
