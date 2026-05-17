// @ts-check

import { renderButton } from "../components/button.js";
import { renderCard } from "../components/card.js";
import { renderPlayerList } from "../components/playerList.js";
import { renderTeamAssignmentBoard } from "../components/teamAssignmentBoard.js";

/**
 * @param {import("../types/models").AppState} state
 * @returns {string}
 */
export function renderRoomScreen(state) {
  if (!state.room) {
    return renderCard({
      title: "No active room",
      content: `
        <p>Create a room or quick match from home to start the flow.</p>
        <div class="action-row">${renderButton({ label: "Back Home", action: "navigate", attrs: { "data-route": "home" } })}</div>
      `,
    });
  }

  const filled = `${state.room.playerIds.length}/${state.room.maxPlayers} players`;
  const readyCount = state.room.players.filter((player) => player.status === "ready").length;
  const isHost = state.room.hostId === state.session.localPlayerId;
  const isPractice = state.room.source === "offline";
  const canDiscardRoom = isPractice || isHost;

  return `
    <section class="page-stack">
      ${renderCard({
        kicker: "Room Setup",
        title: `Room ${state.room.code}`,
        className: "card--hero",
        content: `
          <p class="muted">
            ${isPractice
              ? "Practice mode keeps the room local, so you can organize sides and move straight into the lobby when you are ready."
              : "Invite players, place everyone on the correct side, and move into the lobby once the room is full."}
          </p>
          <div class="room-code">${state.room.code}</div>
          <div class="stats-row">
            <div><strong>${filled}</strong><span>Lobby fill</span></div>
            <div><strong>${readyCount}/${state.room.players.length}</strong><span>Players ready</span></div>
            <div><strong>${state.room.settings.playersPerTeam} vs ${state.room.settings.playersPerTeam}</strong><span>Team size</span></div>
            <div><strong>${isPractice ? "Practice AI" : "Realtime"}</strong><span>Control mode</span></div>
            <div><strong>${state.room.connectionState.status}</strong><span>Status</span></div>
          </div>
          <div class="action-row">
            ${renderButton({ label: "Enter Lobby", action: "enter-lobby", disabled: state.room.playerIds.length < state.room.maxPlayers })}
            ${renderButton({ label: "Copy Invite Link", action: "copy-invite", variant: "secondary", disabled: isPractice })}
            ${canDiscardRoom ? renderButton({ label: isPractice ? "Discard Practice Room" : "Discard Room", action: "discard-room", variant: "danger" }) : ""}
            ${renderButton({ label: "Back Home", action: "back-home", variant: "ghost" })}
          </div>
        `,
      })}
      <div class="grid-two">
        ${renderCard({
          kicker: "Choose Sides",
          title: "Team Placement",
          className: "card--span-2",
          content: renderTeamAssignmentBoard({
            room: state.room,
            localPlayerId: state.session.localPlayerId,
          }),
        })}
        ${renderCard({
          kicker: "Presence",
          title: "Players Joining",
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
          kicker: "Next Step",
          title: "Before you enter the lobby",
          content: `
            <ul class="feature-list">
              <li>Fill every available slot so both sides can move forward together.</li>
              <li>Place players into Alpha, Beta, or keep them waiting until teams are balanced.</li>
              <li>Once the room is full, continue to the lobby for captains, settings, and readiness.</li>
            </ul>
          `,
        })}
      </div>
    </section>
  `;
}
