// @ts-check

import { TEAM_IDS } from "../config/constants.js";
import { renderButton } from "./button.js";
import { renderPlayerTile } from "./playerTile.js";

/**
 * @param {{
 *   room: import("../types/models").Room;
 *   localPlayerId: string | null;
 * }} config
 * @returns {string}
 */
export function renderTeamAssignmentBoard({ room, localPlayerId }) {
  const teamSelections = room.teamSelections ?? { alpha: [], beta: [] };
  const playersById = Object.fromEntries(room.players.map((player) => [player.id, player]));
  const assignedIds = new Set([...teamSelections.alpha, ...teamSelections.beta]);
  const waitingIds = room.playerIds.filter((playerId) => !assignedIds.has(playerId));
  const isHost = room.hostId === localPlayerId;
  const alphaName = room.teams.alpha?.name ?? room.teamNames?.alpha ?? "Alpha XI";
  const betaName = room.teams.beta?.name ?? room.teamNames?.beta ?? "Beta XI";

  /**
   * @param {string} playerId
   * @param {"alpha" | "beta" | null} currentTeamId
   * @returns {string}
   */
  function renderMoveButtons(playerId, currentTeamId) {
    const canManage = isHost || playerId === localPlayerId;
    if (!canManage) {
      return "";
    }

    const alphaFull = teamSelections.alpha.length >= room.settings.playersPerTeam;
    const betaFull = teamSelections.beta.length >= room.settings.playersPerTeam;

    return `
      <div class="team-board__actions">
        ${
          currentTeamId !== TEAM_IDS.ALPHA
            ? renderButton({
                label: currentTeamId ? "To Alpha" : "Join Alpha",
                action: "set-player-team",
                variant: currentTeamId ? "ghost" : "secondary",
                size: "sm",
                disabled: alphaFull,
                attrs: {
                  "data-player": playerId,
                  "data-team": TEAM_IDS.ALPHA,
                },
              })
            : ""
        }
        ${
          currentTeamId !== TEAM_IDS.BETA
            ? renderButton({
                label: currentTeamId ? "To Beta" : "Join Beta",
                action: "set-player-team",
                variant: currentTeamId ? "ghost" : "secondary",
                size: "sm",
                disabled: betaFull,
                attrs: {
                  "data-player": playerId,
                  "data-team": TEAM_IDS.BETA,
                },
              })
            : ""
        }
        ${
          currentTeamId
            ? renderButton({
                label: "Bench",
                action: "set-player-team",
                variant: "ghost",
                size: "sm",
                attrs: {
                  "data-player": playerId,
                  "data-team": "",
                },
              })
            : ""
        }
      </div>
    `;
  }

  /**
   * @param {string[]} playerIds
   * @param {"alpha" | "beta" | null} teamId
   * @param {string} title
   * @param {string} helper
   * @returns {string}
   */
  function renderColumn(playerIds, teamId, title, helper) {
    return `
      <section class="team-board__column ${teamId ? `is-${teamId}` : "is-waiting"}">
        <div class="team-board__head">
          <div>
            <span class="team-board__kicker">${teamId ? "Team Side" : "Waiting Pool"}</span>
            <h4>${title}</h4>
          </div>
          <span class="team-board__count">${playerIds.length}/${teamId ? room.settings.playersPerTeam : room.maxPlayers}</span>
        </div>
        <p class="team-board__helper">${helper}</p>
        <ul class="player-list">
          ${
            playerIds.length
              ? playerIds
                  .map((playerId) => {
                    const player = playersById[playerId];
                    if (!player) {
                      return "";
                    }

                    const badges = [
                      player.id === room.hostId ? "Host" : "",
                      player.id === room.captains.alpha ? "Alpha Captain" : "",
                      player.id === room.captains.beta ? "Beta Captain" : "",
                      player.id === localPlayerId ? "You" : "",
                    ].filter(Boolean);
                    const rowClass = [
                      player.id === localPlayerId ? "is-local" : "",
                      player.id === room.captains.alpha || player.id === room.captains.beta ? "is-captain" : "",
                      player.status === "ready" ? "is-ready" : "",
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return renderPlayerTile({
                      player,
                      badges,
                      rowClass,
                      actions: renderMoveButtons(playerId, teamId),
                      layout: "board",
                    });
                  })
                  .join("")
              : `<li class="team-board__empty">No players here yet.</li>`
          }
        </ul>
      </section>
    `;
  }

  return `
    <section class="team-board">
      ${renderColumn(
        teamSelections.alpha,
        TEAM_IDS.ALPHA,
        alphaName,
        "Players can choose this side for themselves. The host can re-place anyone before toss.",
      )}
      ${renderColumn(
        waitingIds,
        null,
        "Waiting To Choose",
        "Unassigned players stay here until they pick Alpha or Beta.",
      )}
      ${renderColumn(
        teamSelections.beta,
        TEAM_IDS.BETA,
        betaName,
        "Beta fills independently, and the host can still rebalance before kickoff.",
      )}
    </section>
  `;
}
