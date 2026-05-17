// @ts-check

import { renderButton } from "../components/button.js";
import { renderCard } from "../components/card.js";
import { getFinalMatchInsights, getResultInsight } from "../engine/mindGame.js";
import { formatOvers } from "../utils/formatters.js";

/**
 * @param {import("../types/models").AppState["lastSavedMatch"]} savedMatch
 * @returns {string}
 */
function renderSavedResult(savedMatch) {
  if (!savedMatch) {
    return "";
  }

  return `
    <section class="page-stack">
      ${renderCard({
        kicker: "Restored",
        title: savedMatch.result?.marginText ?? "Last match result",
        className: "card--hero",
        content: `
          <p><strong>Loaded from local storage</strong></p>
          <p class="muted">Basic result data was restored after refresh.</p>
          <div class="action-row">
            ${renderButton({ label: "History", action: "navigate", variant: "secondary", attrs: { "data-route": "history" } })}
            ${renderButton({ label: "Back Home", action: "back-home", variant: "ghost" })}
          </div>
        `,
      })}
      <div class="grid-two">
        ${renderCard({
          kicker: "Scorecard",
          title: "Innings Summary",
          content: `
            <ul class="feature-list">
              ${savedMatch.inningsSummary
                .map(
                  (innings) =>
                    `<li>${innings.teamName}: ${innings.runs}/${innings.wickets} in ${innings.oversText} overs</li>`,
                )
                .join("")}
            </ul>
          `,
        })}
        ${renderCard({
          kicker: "Match Summary",
          title: "Totals",
          content: `
            <div class="stats-row">
              <div><strong>${savedMatch.basicStats.totalRuns}</strong><span>Total runs</span></div>
              <div><strong>${savedMatch.basicStats.totalWickets}</strong><span>Total wickets</span></div>
              <div><strong>${savedMatch.basicStats.oversText}</strong><span>Total overs</span></div>
              <div><strong>${savedMatch.basicStats.ballCount}</strong><span>Balls logged</span></div>
            </div>
          `,
        })}
        ${savedMatch.insights?.length
          ? renderCard({
              kicker: "Mind Game",
              title: "Saved Story Insights",
              className: "card--span-2",
              content: `
                <div class="insight-grid">
                  ${savedMatch.insights
                    .map(
                      (insight) => `
                        <article class="insight-tile">
                          <span>${insight.label}</span>
                          <strong>${insight.value}</strong>
                          <p>${insight.detail}</p>
                        </article>
                      `,
                    )
                    .join("")}
                </div>
              `,
            })
          : ""}
      </div>
    </section>
  `;
}

/**
 * @param {import("../types/models").AppState} state
 * @returns {string}
 */
export function renderResultScreen(state) {
  if (!state.match?.result) {
    return renderSavedResult(state.lastSavedMatch);
  }

  if (!state.room) {
    return renderSavedResult(state.lastSavedMatch);
  }

  const playersById = Object.fromEntries(state.room.players.map((player) => [player.id, player]));
  const totalRuns = state.match.innings.reduce((sum, innings) => sum + innings.scoreboard.runs, 0);
  const totalWickets = state.match.innings.reduce((sum, innings) => sum + innings.scoreboard.wickets, 0);
  const totalBalls = state.match.innings.reduce((sum, innings) => sum + innings.scoreboard.legalBalls, 0);
  const allowedNumbers = Array.isArray(state.match.settings.allowedNumbers) && state.match.settings.allowedNumbers.length
    ? state.match.settings.allowedNumbers
    : [1, 2, 3, 4, 5, 6];
  const finalInsights = getFinalMatchInsights(state.match, state.match.ballEvents, allowedNumbers);
  const winnerTeam =
    state.match.result.winnerTeamId && state.match.teams[state.match.result.winnerTeamId]
      ? state.match.teams[state.match.result.winnerTeamId]
      : null;

  const renderStats = (team) => `
    <div class="stats-table">
      ${team.playerIds
        .map((playerId) => {
          const stats = team.stats[playerId];
          const player = playersById[playerId];
          return `
            <div class="stats-table__row">
              <strong>${player?.name ?? playerId}</strong>
              <span>${stats.runs} runs</span>
              <span>${stats.ballsFaced} balls</span>
              <span>${stats.wicketsTaken} wkts</span>
            </div>
          `;
        })
        .join("")}
    </div>
  `;

  return `
    <section class="page-stack">
      ${renderCard({
        kicker: "Result",
        title: state.match.result.marginText,
        className: "card--hero",
        content: `
          <p><strong>${state.match.result.isTie ? "Match tied" : `${winnerTeam?.name ?? "Winner"} wins`}</strong></p>
          <p>${state.match.result.summary}</p>
          <p class="muted">${state.match.result.reason}</p>
          <div class="action-row">
            ${renderButton({ label: "History", action: "navigate", variant: "secondary", attrs: { "data-route": "history" } })}
            ${renderButton({ label: "Back Home", action: "back-home", variant: "ghost" })}
          </div>
        `,
      })}
      <div class="grid-two">
        ${renderCard({
          kicker: "Scorecard",
          title: "Innings Summary",
          content: `
            <ul class="feature-list">
              ${state.match.innings
                .map((innings) => {
                  const team = state.match?.teams[innings.battingTeamId];
                  return `<li>${team.name}: ${innings.scoreboard.runs}/${innings.scoreboard.wickets} in ${formatOvers(innings.scoreboard.legalBalls)} overs</li>`;
                })
                .join("")}
            </ul>
          `,
        })}
        ${renderCard({
          kicker: "Match Summary",
          title: "Totals",
          content: `
            <div class="stats-row">
              <div><strong>${totalRuns}</strong><span>Total runs</span></div>
              <div><strong>${totalWickets}</strong><span>Total wickets</span></div>
              <div><strong>${formatOvers(totalBalls)}</strong><span>Total overs</span></div>
              <div><strong>${state.match.ballEvents.length}</strong><span>Balls logged</span></div>
              <div><strong>${state.match.settings.numberSetLabel ?? "Classic 1-6"}</strong><span>${allowedNumbers.join(", ")}</span></div>
            </div>
          `,
        })}
        ${finalInsights.length
          ? renderCard({
              kicker: "Mind Game",
              title: "Match Story Insights",
              className: "card--span-2",
              content: `
                <div class="insight-grid">
                  ${finalInsights
                    .map(
                      (insight) => `
                        <article class="insight-tile">
                          <span>${insight.label}</span>
                          <strong>${insight.value}</strong>
                          <p>${insight.detail}</p>
                        </article>
                      `,
                    )
                    .join("")}
                </div>
              `,
            })
          : ""}
        ${renderCard({
          kicker: "Player Stats",
          title: state.match.teams.alpha.name,
          content: renderStats(state.match.teams.alpha),
        })}
        ${renderCard({
          kicker: "Player Stats",
          title: state.match.teams.beta.name,
          content: renderStats(state.match.teams.beta),
        })}
        ${renderCard({
          kicker: "Ball By Ball",
          title: "Match Log",
          className: "card--span-2",
          content: `
            <div class="history-list">
              ${state.match.ballEvents
                .map(
                  (event, index) => {
                    const insight = getResultInsight(event, state.match.ballEvents.slice(0, index), allowedNumbers);
                    return `
                      <article class="history-item">
                        <div>
                          <strong>Over ${event.over}.${event.ball}${insight ? ` - ${insight}` : ""}</strong>
                          <p>${event.commentary ?? event.resultLabel ?? "Ball resolved"}</p>
                          ${event.shotLabel && event.resultType !== "wicket" ? `<p class="muted">${event.shotLabel}</p>` : ""}
                        </div>
                        <div>
                          <p>${event.battingNumber} vs ${event.bowlingNumber}</p>
                          <p>${event.resultLabel ?? (event.resultType === "wicket" ? "Wicket" : `+${event.runs}`)}</p>
                          <p>${state.match.teams[event.battingTeamId].name} batting</p>
                        </div>
                      </article>
                    `;
                  },
                )
                .join("")}
            </div>
          `,
        })}
      </div>
    </section>
  `;
}
