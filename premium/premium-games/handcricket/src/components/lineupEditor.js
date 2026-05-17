// @ts-check

/**
 * @param {{
 *   title: string;
 *   teamId: string;
 *   type: "batting" | "bowling";
 *   order: string[];
 *   playersById: Record<string, import("../types/models").Player>;
 *   movableIds?: string[] | null;
 *   locked?: boolean;
 *   helper?: string;
 * }} config
 * @returns {string}
 */
export function renderLineupEditor({ title, teamId, type, order, playersById, movableIds = null, locked = false, helper = "" }) {
  return `
    <section class="lineup-editor">
      <div class="lineup-editor__head">
        <div>
          <h4>${title}</h4>
          ${helper ? `<p>${helper}</p>` : ""}
        </div>
      </div>
      <ol class="lineup-editor__list">
        ${order
          .map((playerId, index) => {
            const player = playersById[playerId];
            const movable = !locked && (!movableIds || movableIds.includes(playerId));
            return `
              <li class="lineup-editor__item ${!movable ? "is-locked" : ""}">
                <span class="lineup-editor__index">${index + 1}</span>
                <span class="lineup-editor__name">${player?.name ?? playerId}</span>
                <span class="lineup-editor__actions">
                  <button
                    class="icon-btn"
                    data-action="move-lineup"
                    data-team="${teamId}"
                    data-type="${type}"
                    data-index="${index}"
                    data-direction="up"
                    ${!movable || index === 0 ? "disabled" : ""}
                  >&uarr;</button>
                  <button
                    class="icon-btn"
                    data-action="move-lineup"
                    data-team="${teamId}"
                    data-type="${type}"
                    data-index="${index}"
                    data-direction="down"
                    ${!movable || index === order.length - 1 ? "disabled" : ""}
                  >&darr;</button>
                </span>
              </li>
            `;
          })
          .join("")}
      </ol>
    </section>
  `;
}
