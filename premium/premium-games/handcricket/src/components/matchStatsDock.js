// @ts-check

import { formatOvers } from "../utils/formatters.js";

/**
 * @param {import("../types/models").PlayerMatchStats | null | undefined} stats
 * @param {"batting" | "bowling"} mode
 * @returns {string}
 */
function formatPlayerStats(stats, mode) {
  if (!stats) {
    return mode === "batting" ? "Yet to face" : "Ready";
  }

  if (mode === "batting") {
    return `${stats.runs}r / ${stats.ballsFaced}b`;
  }

  return `${stats.wicketsTaken}w / ${stats.ballsBowled}b`;
}

/**
 * @param {import("../types/models").BallEvent} event
 * @returns {string}
 */
function getBallShortLabel(event) {
  if (event.resultType === "wicket") {
    return "W";
  }

  if (event.resultType === "dot" || event.runs === 0) {
    return "0";
  }

  return `+${event.runs}`;
}

/**
 * @param {{
 *   match: import("../types/models").Match;
 *   playersById: Record<string, import("../types/models").Player>;
 *   hidden?: boolean;
 * }} config
 * @returns {string}
 */
export function renderMatchStatsDock({ match, playersById, hidden = false }) {
  const innings = match.innings[match.currentInningsIndex];
  const battingTeam = match.teams[innings.battingTeamId];
  const bowlingTeam = match.teams[innings.bowlingTeamId];
  const striker = innings.strikerId ? playersById[innings.strikerId] : null;
  const nonStriker = innings.nonStrikerId ? playersById[innings.nonStrikerId] : null;
  const bowler = innings.currentBowlerId ? playersById[innings.currentBowlerId] : null;
  const strikerStats = innings.strikerId ? battingTeam.stats[innings.strikerId] : null;
  const nonStrikerStats = innings.nonStrikerId ? battingTeam.stats[innings.nonStrikerId] : null;
  const bowlerStats = innings.currentBowlerId ? bowlingTeam.stats[innings.currentBowlerId] : null;
  const nextBallNumber = Math.min(innings.scoreboard.ballsInOver + 1, 6);
  const recentBalls = match.ballEvents.slice(-8).reverse();

  if (hidden) {
    return `
      <button
        class="match-stats-dock-toggle"
        data-action="toggle-match-stats-dock"
        type="button"
        aria-label="Show live match stats"
      >
        <span>${innings.scoreboard.runs}/${innings.scoreboard.wickets}</span>
        <strong>Stats</strong>
      </button>
    `;
  }

  return `
    <aside class="match-stats-dock" aria-label="Floating live match stats" aria-live="polite">
      <div class="match-stats-dock__head">
        <div>
          <span>Live Match</span>
          <strong>${battingTeam.name} ${innings.scoreboard.runs}/${innings.scoreboard.wickets}</strong>
        </div>
        <button
          class="match-stats-dock__hide"
          data-action="toggle-match-stats-dock"
          type="button"
          aria-label="Hide live match stats"
        >
          Hide
        </button>
      </div>

      <div class="match-stats-dock__meta">
        <span><strong>${formatOvers(innings.scoreboard.legalBalls)}</strong><small>Overs</small></span>
        <span><strong>${innings.scoreboard.overs + 1}.${nextBallNumber}</strong><small>Next</small></span>
        <span><strong>${innings.scoreboard.target ?? "-"}</strong><small>Target</small></span>
        <span><strong>${innings.scoreboard.requiredRuns ?? "-"}</strong><small>Need</small></span>
      </div>

      <div class="match-stats-dock__players">
        <article>
          <span>Striker</span>
          <strong>${striker?.name ?? "Waiting"}</strong>
          <small>${formatPlayerStats(strikerStats, "batting")}</small>
        </article>
        <article>
          <span>Non-striker</span>
          <strong>${nonStriker?.name ?? "Single mode"}</strong>
          <small>${formatPlayerStats(nonStrikerStats, "batting")}</small>
        </article>
        <article>
          <span>Bowler</span>
          <strong>${bowler?.name ?? bowlingTeam.name}</strong>
          <small>${formatPlayerStats(bowlerStats, "bowling")}</small>
        </article>
      </div>

      <div class="match-stats-dock__history">
        <span>Past Balls</span>
        <div>
          ${
            recentBalls.length
              ? recentBalls
                  .map(
                    (event) => `
                      <small class="match-stats-dock__ball match-stats-dock__ball--${event.resultTone ?? event.resultType}">
                        <strong>${getBallShortLabel(event)}</strong>
                        <em>${event.over}.${event.ball}</em>
                      </small>
                    `,
                  )
                  .join("")
              : `<small class="match-stats-dock__empty">No balls yet</small>`
          }
        </div>
      </div>
    </aside>
  `;
}
