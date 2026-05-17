// @ts-check

import { renderButton } from "../components/button.js";
import { renderCard } from "../components/card.js";

/**
 * @param {import("../types/models").AppState} state
 * @returns {string}
 */
export function renderDraftScreen(state) {
  if (!state.room?.draftState) {
    return renderCard({
      kicker: "Draft",
      title: "Draft not ready",
      content: `
        <p>Fill the lobby, choose captains, and then open the draft board.</p>
        <div class="action-row">${renderButton({ label: "Back to Lobby", action: "navigate", attrs: { "data-route": "lobby" } })}</div>
      `,
    });
  }

  const playersById = Object.fromEntries(state.room.players.map((player) => [player.id, player]));
  const currentTeamId = state.room.draftState.pickSequence[state.room.draftState.currentPickIndex] ?? null;
  const currentTeam = currentTeamId ? state.room.teams[currentTeamId] : null;
  const localCaptainSide =
    state.room.captains.alpha === state.session.localPlayerId
      ? "alpha"
      : state.room.captains.beta === state.session.localPlayerId
        ? "beta"
        : null;
  const waitingForAi =
    state.room.settings.controlMode === "local-vs-ai" &&
    currentTeamId &&
    localCaptainSide &&
    currentTeamId !== localCaptainSide &&
    state.room.draftState.status !== "complete";

  const renderRoster = (teamId) => {
    const team = state.room?.teams[teamId];
    if (!team) {
      return `<p class="empty-state">Waiting for captains.</p>`;
    }

    return `
      <div class="draft-roster">
        <p class="team-preview__label">${team.name}</p>
        <ul>
          ${team.playerIds
            .map((playerId) => {
              const player = playersById[playerId];
              return `<li>${player?.name ?? playerId}${team.captainId === playerId ? " (C)" : ""}</li>`;
            })
            .join("")}
        </ul>
      </div>
    `;
  };

  return `
    <section class="page-stack">
      ${renderCard({
        kicker: "Draft Board",
        title: state.room.draftState.status === "complete" ? "Teams Locked In" : `${currentTeam?.name ?? "Captain"} on the clock`,
        className: "card--hero",
        content: `
          <p>
            ${
              state.room.draftState.status === "complete"
                ? "The squad build is finished. Move forward to the toss and final lineups."
                : waitingForAi
                  ? "Opponent captain is making a mocked live pick."
                  : "Pick from the available player pool to complete both teams in order."
            }
          </p>
          <div class="stats-row">
            <div><strong>${state.room.draftState.currentPickIndex + 1}</strong><span>Current pick</span></div>
            <div><strong>${state.room.draftState.availablePlayerIds.length}</strong><span>Players left</span></div>
            <div><strong>${state.room.draftState.picks.length}</strong><span>Picks made</span></div>
          </div>
          <div class="action-row">
            ${renderButton({ label: "Auto Complete", action: "auto-draft", variant: "ghost", disabled: state.room.draftState.status === "complete" })}
            ${renderButton({ label: "Back to Lobby", action: "navigate", variant: "ghost", attrs: { "data-route": "lobby" } })}
            ${renderButton({ label: "Start Toss", action: "start-toss", attrs: { "data-route": "toss" }, disabled: state.room.draftState.status !== "complete" })}
          </div>
        `,
      })}
      <div class="grid-two">
        ${renderCard({
          kicker: "Available Pool",
          title: "Make The Next Pick",
          className: "card--span-2",
          content: `
            <div class="draft-grid">
              ${state.room.draftState.availablePlayerIds
                .map((playerId) => {
                  const player = playersById[playerId];
                  return `
                    <article class="draft-player">
                      <div>
                        <strong>${player?.name ?? playerId}</strong>
                        <p>${player?.isMock ? "Mock remote player" : "Local player"}</p>
                      </div>
                      ${renderButton({
                        label: state.room.draftState.status === "complete" ? "Picked" : "Draft",
                        action: "draft-pick",
                        variant: "secondary",
                        disabled: state.room.draftState.status === "complete" || waitingForAi,
                        attrs: { "data-player": playerId },
                      })}
                    </article>
                  `;
                })
                .join("")}
            </div>
          `,
        })}
        ${renderCard({
          kicker: "Squads",
          title: "Alpha Roster",
          content: renderRoster("alpha"),
        })}
        ${renderCard({
          kicker: "Squads",
          title: "Beta Roster",
          content: renderRoster("beta"),
        })}
        ${renderCard({
          kicker: "Pick Log",
          title: "Draft Timeline",
          className: "card--span-2",
          content: `
            <div class="history-list">
              ${
                state.room.draftState.picks.length
                  ? state.room.draftState.picks
                      .map((pick, index) => `
                        <article class="history-item">
                          <div>
                            <strong>Pick ${index + 1}</strong>
                            <p>${state.room.teams[pick.teamId]?.name ?? pick.teamId}</p>
                          </div>
                          <div>
                            <p>${playersById[pick.playerId]?.name ?? pick.playerId}</p>
                            <p>${pick.auto ? "AI assisted" : "Captain selected"}</p>
                          </div>
                        </article>
                      `)
                      .join("")
                  : `<p class="empty-state">The draft board is ready for the first pick.</p>`
              }
            </div>
          `,
        })}
      </div>
    </section>
  `;
}
