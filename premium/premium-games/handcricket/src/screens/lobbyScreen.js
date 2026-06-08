// @ts-check

import { renderButton } from "../components/button.js";
import { renderCard } from "../components/card.js";
import { renderPlayerList } from "../components/playerList.js";
import { renderTeamAssignmentBoard } from "../components/teamAssignmentBoard.js";
import { formatAllowedNumbers, getNumberSetPresets, resolveNumberSetSettings } from "../engine/numberSets.js";

/**
 * @param {import("../types/models").AppState} state
 * @returns {string}
 */
export function renderLobbyScreen(state) {
  if (!state.room) {
    return "";
  }

  const teamSelections = state.room.teamSelections ?? { alpha: [], beta: [] };
  const playerOptions = (teamId, selectedId) =>
    teamSelections[teamId]
      .map((playerId) => state.room.players.find((player) => player.id === playerId))
      .filter(Boolean)
      .map(
        (player) =>
          `<option value="${player.id}" ${player.id === selectedId ? "selected" : ""}>${player.name}</option>`,
      )
      .join("");

  const isHost = state.room.hostId === state.session.localPlayerId;
  const localPlayer = state.room.players.find((player) => player.id === state.session.localPlayerId) ?? null;
  const localReady = localPlayer?.status === "ready";
  const readyCount = state.room.players.filter((player) => player.status === "ready").length;
  const roomFull = state.room.playerIds.length >= state.room.maxPlayers;
  const allReady = roomFull && readyCount === state.room.players.length;
  const teamsReady =
    teamSelections.alpha.length === state.room.settings.playersPerTeam &&
    teamSelections.beta.length === state.room.settings.playersPerTeam;
  const draftReady = roomFull && allReady && teamsReady && state.room.captains.alpha && state.room.captains.beta;
  const draftComplete = state.room.draftState?.status === "complete";
  const isPractice = state.room.source === "offline";
  const canDiscardRoom = isPractice || isHost;
  const alphaTeamName = (state.room.teams.alpha?.name ?? state.room.teamNames?.alpha ?? "Alpha XI").replace(
    /"/g,
    "&quot;",
  );
  const betaTeamName = (state.room.teams.beta?.name ?? state.room.teamNames?.beta ?? "Beta XI").replace(
    /"/g,
    "&quot;",
  );
  const alphaCaptainOptions = playerOptions("alpha", state.room.captains.alpha);
  const betaCaptainOptions = playerOptions("beta", state.room.captains.beta);
  const hasAlphaCaptainChoices = Boolean(alphaCaptainOptions);
  const hasBetaCaptainChoices = Boolean(betaCaptainOptions);
  const numberSetPresets = getNumberSetPresets();
  const settingsLocked = state.room.status === "live" || state.room.status === "completed" || Boolean(state.match);
  const canEditNumberSet = isHost && !settingsLocked;
  const numberSetDraft = state.ui.numberSetDraft ?? null;
  const draftSettings = {
    ...state.room.settings,
    ...(numberSetDraft ?? {}),
  };
  const activeNumberMode = draftSettings.numberSetMode ?? "classic";
  const activePreset = draftSettings.numberSetPreset ?? "classic";
  const activeAllowedNumbers = Array.isArray(state.room.settings.allowedNumbers) && state.room.settings.allowedNumbers.length
    ? state.room.settings.allowedNumbers
    : [1, 2, 3, 4, 5, 6];
  const draftNumberSet = resolveNumberSetSettings(draftSettings, state.room.settings);
  const previewAllowedNumbers = draftNumberSet.ok ? draftNumberSet.settings.allowedNumbers : activeAllowedNumbers;
  const previewLabel = draftNumberSet.ok ? draftNumberSet.settings.numberSetLabel : "Pending edits";
  const validationError = state.ui.numberSetValidationError || (!draftNumberSet.ok ? draftNumberSet.error : "");
  const customNumbersText = String(draftSettings.customNumbersText ?? draftSettings.allowedNumbers?.join(", ") ?? "1, 2, 3, 4, 5, 6").replace(
    /"/g,
    "&quot;",
  );

  return `
    <section class="page-stack">
      ${renderCard({
        kicker: "Lobby",
        title: "Match Configuration",
        content: `
          <div class="round-banner ${allReady && teamsReady ? "is-live" : ""}">
            <strong>${roomFull ? `${readyCount}/${state.room.players.length} players ready` : `${state.room.playerIds.length}/${state.room.maxPlayers} players in room`}</strong>
            <span>
              ${
                allReady && teamsReady
                  ? isHost
                    ? "Everyone is ready and both sides are complete. Start the toss when you want."
                    : "Everyone is ready. Waiting for the host to continue."
                  : roomFull && !teamsReady
                    ? "Choose sides so Alpha and Beta are fully staffed before the toss can begin."
                    : roomFull
                      ? "Use the ready toggle once you are set. Host can continue after everyone is ready."
                      : "Waiting for the room to fill before the lobby can continue."
              }
            </span>
          </div>
          <div class="action-row action-row--priority">
            ${renderButton({ label: isPractice ? "Practice Room" : "Copy Invite Link", action: "copy-invite", variant: "ghost", disabled: isPractice })}
            ${renderButton({ label: localReady ? "Set Unready" : "Ready Up", action: "toggle-ready", variant: localReady ? "ghost" : "secondary" })}
            ${renderButton({ label: "Open Draft Board", action: "open-draft", variant: "secondary", disabled: !draftReady || !isHost })}
            ${renderButton({ label: "Auto Draft Teams", action: "auto-draft", variant: "ghost", disabled: !draftReady || !isHost })}
            ${renderButton({ label: isHost ? "Start Toss" : "Host Starts Toss", action: "start-toss", disabled: !draftComplete || !allReady || !teamsReady || !isHost })}
            ${canDiscardRoom ? renderButton({ label: isPractice ? "Discard Practice Room" : "Discard Room", action: "discard-room", variant: "danger" }) : ""}
          </div>
          <div class="field-grid">
            <label class="field">
              <span>Match Mode</span>
              <select data-field="match-mode" ${!isHost ? "disabled" : ""}>
                <option value="single" ${state.room.settings.matchMode === "single" ? "selected" : ""}>Single batsman</option>
                <option value="two-batsmen" ${state.room.settings.matchMode === "two-batsmen" ? "selected" : ""}>Two batsmen</option>
              </select>
            </label>
            <label class="field">
              <span>Bowling Mode</span>
              <select data-field="bowling-mode" ${!isHost ? "disabled" : ""}>
                <option value="free-change" ${state.room.settings.bowlingMode === "free-change" ? "selected" : ""}>Free change</option>
                <option value="over-locked" ${state.room.settings.bowlingMode === "over-locked" ? "selected" : ""}>Over locked</option>
              </select>
            </label>
            <label class="field">
              <span>Team Size</span>
              <input value="${state.room.settings.playersPerTeam} vs ${state.room.settings.playersPerTeam}" disabled />
            </label>
            <label class="field">
              <span>Overs</span>
              <select data-field="overs" ${!isHost ? "disabled" : ""}>
                <option value="2" ${state.room.settings.overs === 2 ? "selected" : ""}>2 overs</option>
                <option value="5" ${state.room.settings.overs === 5 ? "selected" : ""}>5 overs</option>
                <option value="10" ${state.room.settings.overs === 10 ? "selected" : ""}>10 overs</option>
              </select>
            </label>
            ${
              isPractice
                ? `
                  <label class="field">
                    <span>AI Difficulty</span>
                    <select data-field="ai-difficulty" ${!isHost ? "disabled" : ""}>
                      <option value="beginner" ${state.room.settings.aiDifficulty === "beginner" ? "selected" : ""}>Beginner</option>
                      <option value="medium" ${(state.room.settings.aiDifficulty ?? "medium") === "medium" ? "selected" : ""}>Medium</option>
                      <option value="hard" ${state.room.settings.aiDifficulty === "hard" ? "selected" : ""}>Hard</option>
                    </select>
                  </label>
                `
                : ""
            }
          </div>
          <section class="number-set-panel" aria-label="Number set settings">
            <div class="number-set-panel__head">
              <div>
                <span class="team-preview__label">Number Set</span>
                <strong>${state.room.settings.numberSetLabel ?? "Classic 1-6"}</strong>
                <p class="muted">${isHost ? "Choose the match numbers before the toss starts." : "Synced from the host and locked for non-host players."}</p>
              </div>
              <div class="number-set-preview">
                <span>Live Preview</span>
                <strong>${previewLabel}</strong>
                <div class="number-set-list">${formatAllowedNumbers(previewAllowedNumbers)}</div>
              </div>
            </div>
            <div class="field-grid">
              <label class="field">
                <span>Number Set Mode</span>
                <select data-field="number-set-mode" ${!canEditNumberSet ? "disabled" : ""}>
                  <option value="classic" ${activeNumberMode === "classic" ? "selected" : ""}>Classic 1-6</option>
                  <option value="preset" ${activeNumberMode === "preset" ? "selected" : ""}>Preset</option>
                  <option value="range" ${activeNumberMode === "range" ? "selected" : ""}>Range</option>
                  <option value="custom" ${activeNumberMode === "custom" ? "selected" : ""}>Custom list</option>
                </select>
              </label>
              <label class="field">
                <span>Preset</span>
                <select data-field="number-set-preset" ${!canEditNumberSet || activeNumberMode !== "preset" ? "disabled" : ""}>
                  ${numberSetPresets
                    .map(
                      (preset) => `
                        <option value="${preset.id}" ${activePreset === preset.id ? "selected" : ""}>
                          ${preset.label} (${preset.allowedNumbers.join(", ")})
                        </option>
                      `,
                    )
                    .join("")}
                </select>
              </label>
              <label class="field">
                <span>Range Min</span>
                <input data-field="number-range-min" type="number" min="1" max="99" value="${draftSettings.numberRangeMin ?? 1}" ${!canEditNumberSet || activeNumberMode !== "range" ? "disabled" : ""} />
              </label>
              <label class="field">
                <span>Range Max</span>
                <input data-field="number-range-max" type="number" min="1" max="99" value="${draftSettings.numberRangeMax ?? 6}" ${!canEditNumberSet || activeNumberMode !== "range" ? "disabled" : ""} />
              </label>
              <label class="field">
                <span>Custom Numbers</span>
                <input data-field="custom-numbers" value="${customNumbersText}" placeholder="1, 5, 7, 11, 20" ${!canEditNumberSet || activeNumberMode !== "custom" ? "disabled" : ""} />
              </label>
              <label class="field">
                <span>Active Numbers</span>
                <input value="${state.room.settings.numberSetLabel ?? "Classic 1-6"}: ${activeAllowedNumbers.join(", ")}" disabled />
              </label>
            </div>
            <div class="preset-card-grid">
              ${numberSetPresets
                .map(
                  (preset) => `
                    <button
                      class="preset-card ${activeNumberMode === "preset" && activePreset === preset.id ? "is-active" : ""}"
                      data-action="choose-number-preset"
                      data-preset="${preset.id}"
                      ${!canEditNumberSet ? "disabled" : ""}
                    >
                      <strong>${preset.label}</strong>
                      <span>${preset.allowedNumbers.join(", ")}</span>
                    </button>
                  `,
                )
                .join("")}
            </div>
            <div class="number-set-panel__actions">
              ${validationError ? `<p class="validation-text">${validationError}</p>` : `<p class="muted">Active picker order is sorted ascending and supports up to 16 numbers.</p>`}
              ${renderButton({ label: "Apply Number Set", action: "apply-number-set", variant: "secondary", disabled: !canEditNumberSet || Boolean(validationError) })}
            </div>
          </section>
          <div class="field-grid">
            <label class="field">
              <span>Alpha Captain</span>
              <select data-field="captain-alpha" ${!isHost || !hasAlphaCaptainChoices ? "disabled" : ""}>
                ${alphaCaptainOptions || `<option value="">Choose from Alpha</option>`}
              </select>
            </label>
            <label class="field">
              <span>Beta Captain</span>
              <select data-field="captain-beta" ${!isHost || !hasBetaCaptainChoices ? "disabled" : ""}>
                ${betaCaptainOptions || `<option value="">Choose from Beta</option>`}
              </select>
            </label>
          </div>
          <div class="field-grid">
            <label class="field">
              <span>Alpha Team Name</span>
              <input
                data-field="team-name-alpha"
                value="${alphaTeamName}"
                maxlength="24"
                ${!isHost ? "disabled" : ""}
              />
            </label>
            <label class="field">
              <span>Beta Team Name</span>
              <input
                data-field="team-name-beta"
                value="${betaTeamName}"
                maxlength="24"
                ${!isHost ? "disabled" : ""}
              />
            </label>
          </div>
          <p class="muted">
            Connected mode: ${isPractice ? "offline practice with AI" : "realtime head-to-head"}. Host:
            ${state.room.players.find((player) => player.id === state.room.hostId)?.name ?? "Unknown"}.
            ${isHost ? "You control lobby progression and can move any player between the two sides." : "You can only change your own side while the host controls global setup."}
          </p>
          <p class="muted">
            Draft status: ${draftComplete ? "complete" : draftReady ? "ready for toss" : "waiting for full teams"}.
          </p>
        `,
      })}
      <div class="grid-two">
        ${renderCard({
          kicker: "Choose Sides",
          title: "Alpha And Beta Areas",
          className: "card--span-2",
          content: renderTeamAssignmentBoard({
            room: state.room,
            localPlayerId: state.session.localPlayerId,
          }),
        })}
        ${renderCard({
          kicker: "Room",
          title: "Players",
          content: renderPlayerList({
            players: state.room.players,
            captains: state.room.captains,
            teams: state.room.teams,
            hostId: state.room.hostId,
            localPlayerId: state.session.localPlayerId,
            canRemovePlayers: isHost && !isPractice,
          }),
        })}
        ${renderCard({
          kicker: "Checklist",
          title: "What unlocks the toss",
          content: `
            <ul class="feature-list">
              <li>${roomFull ? "Room is full." : "Fill every player slot in the room."}</li>
              <li>${teamsReady ? "Both sides are fully assigned." : "Assign enough players to both Alpha and Beta."}</li>
              <li>${state.room.captains.alpha && state.room.captains.beta ? "Both captains are chosen." : "Choose one captain for each side."}</li>
              <li>${allReady ? "Everyone is marked ready." : "Every player must toggle ready."}</li>
              <li>${draftComplete ? "Draft is complete and the match can move on." : "Finish the draft so the toss can begin."}</li>
            </ul>
          `,
        })}
      </div>
    </section>
  `;
}
