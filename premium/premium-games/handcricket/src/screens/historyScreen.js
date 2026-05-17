// @ts-check

import { renderCard } from "../components/card.js";
import { formatTime, titleCase } from "../utils/formatters.js";

/**
 * @param {import("../types/models").AppState} state
 * @returns {string}
 */
export function renderHistoryScreen(state) {
  return `
    <section class="page-stack">
      ${renderCard({
        kicker: "History",
        title: "Recent Matches",
        className: "card--hero",
        content: `
          <p class="muted">
            ${state.history.length
              ? `${state.history.length} finished match${state.history.length === 1 ? "" : "es"} saved on this device.`
              : "Finished matches saved on this device will appear here."}
          </p>
        `,
      })}
      ${renderCard({
        kicker: "Saved Results",
        title: "Match Archive",
        content: state.history.length
          ? `
              <div class="history-list">
                ${state.history
                  .map(
                    (entry) => `
                      <article class="history-item">
                        <div>
                          <strong>${entry.result.marginText}</strong>
                          <p>Room ${entry.roomCode} &middot; ${formatTime(entry.playedAt)}</p>
                        </div>
                        <div>
                          <p>${titleCase(entry.settings?.matchMode ?? "two-batsmen")} &middot; ${titleCase(entry.settings?.bowlingMode ?? "over-locked")}</p>
                          <p>${entry.numberSetLabel ?? entry.settings?.numberSetLabel ?? "Classic 1-6"} &middot; ${(entry.allowedNumbers ?? entry.settings?.allowedNumbers ?? [1, 2, 3, 4, 5, 6]).join(", ")}</p>
                          ${entry.insights?.[0] ? `<p>${entry.insights[0].label}: ${entry.insights[0].value}</p>` : ""}
                          <p>${entry.inningsSummary.map((innings) => `${innings.teamId}: ${innings.runs}/${innings.wickets}`).join(" | ")}</p>
                        </div>
                      </article>
                    `,
                  )
                  .join("")}
              </div>
            `
          : `<p class="empty-state">Your finished matches will appear here.</p>`,
      })}
    </section>
  `;
}
