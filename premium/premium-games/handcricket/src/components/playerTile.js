// @ts-check

/**
 * @param {{
 *   player: import("../types/models").Player;
 *   badges: string[];
 *   rowClass?: string;
 *   actions?: string;
 *   layout?: "default" | "board";
 * }} config
 * @returns {string}
 */
export function renderPlayerTile({ player, badges, rowClass = "", actions = "", layout = "default" }) {
  const statusText = player.status === "unready" ? "not ready" : player.status;
  const itemClass = ["player-list__item", rowClass, layout === "board" ? "player-tile--board" : ""]
    .filter(Boolean)
    .join(" ");

  return `
    <li class="${itemClass}">
      <div class="avatar">${player.name.slice(0, 2).toUpperCase()}</div>
      <div class="player-tile__body">
        <strong>${player.name}</strong>
        <p>${statusText}</p>
      </div>
      ${badges.length ? `<div class="badge-row">${badges.map((badge) => `<span class="mini-badge">${badge}</span>`).join("")}</div>` : ""}
      ${actions ? `<div class="player-tile__actions">${actions}</div>` : ""}
    </li>
  `;
}
