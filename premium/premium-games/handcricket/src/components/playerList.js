// @ts-check

import { renderButton } from "./button.js";
import { renderPlayerTile } from "./playerTile.js";

/**
 * @param {{
 *   players: import("../types/models").Player[];
 *   captains: { alpha: string | null; beta: string | null };
 *   teams?: { alpha: import("../types/models").Team | null; beta: import("../types/models").Team | null };
 *   hostId?: string;
 *   localPlayerId?: string | null;
 *   canRemovePlayers?: boolean;
 * }} config
 * @returns {string}
 */
export function renderPlayerList({
  players,
  captains,
  teams = { alpha: null, beta: null },
  hostId = "",
  localPlayerId = null,
  canRemovePlayers = false,
}) {
  return `
    <ul class="player-list">
      ${players
        .map((player) => {
          const teamBadge = teams.alpha?.playerIds.includes(player.id)
            ? "Alpha"
            : teams.beta?.playerIds.includes(player.id)
              ? "Beta"
              : "";
          const badges = [
            player.id === hostId ? "Host" : "",
            player.id === captains.alpha ? "Alpha Captain" : "",
            player.id === captains.beta ? "Beta Captain" : "",
            teamBadge,
            player.isLocal ? "You" : "",
            player.status === "ready" ? "Ready" : "Waiting",
          ].filter(Boolean);
          const rowClass = [
            player.id === hostId ? "is-host" : "",
            player.id === captains.alpha || player.id === captains.beta ? "is-captain" : "",
            player.status === "ready" ? "is-ready" : "",
            player.id === localPlayerId ? "is-local" : "",
          ]
            .filter(Boolean)
            .join(" ");
          const actions =
            canRemovePlayers && player.id !== hostId
              ? renderButton({
                  label: "Remove",
                  action: "remove-player",
                  variant: "danger",
                  size: "sm",
                  attrs: {
                    "data-player": player.id,
                  },
                })
              : "";

          return renderPlayerTile({
            player,
            badges,
            rowClass,
            actions,
          });
        })
        .join("")}
    </ul>
  `;
}
