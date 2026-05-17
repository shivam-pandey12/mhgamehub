// @ts-check

import { formatOvers } from "../utils/formatters.js";

/**
 * @param {{
 *   room: import("../types/models").Room;
 *   match: import("../types/models").Match;
 *   playersById: Record<string, import("../types/models").Player>;
 *   turnLabel: string;
 *   turnTone?: string;
 *   incomingSignal?: import("../types/models").IncomingSignal | null;
 *   signalHighlighted?: boolean;
 *   scorePulse?: boolean;
 * }} config
 * @returns {string}
 */
export function renderScoreboard({
  room,
  match,
  playersById,
  turnLabel,
  turnTone = "",
  incomingSignal = null,
  signalHighlighted = false,
  scorePulse = false,
}) {
  const innings = match.innings[match.currentInningsIndex];
  const battingTeam = room.teams[innings.battingTeamId];
  const bowlingTeam = room.teams[innings.bowlingTeamId];
  const striker = innings.strikerId ? playersById[innings.strikerId] : null;
  const nonStriker = innings.nonStrikerId ? playersById[innings.nonStrikerId] : null;
  const bowler = innings.currentBowlerId ? playersById[innings.currentBowlerId] : null;
  const strikerStats = innings.strikerId ? match.teams[innings.battingTeamId].stats[innings.strikerId] : null;
  const nonStrikerStats = innings.nonStrikerId ? match.teams[innings.battingTeamId].stats[innings.nonStrikerId] : null;
  const bowlerStats = innings.currentBowlerId ? match.teams[innings.bowlingTeamId].stats[innings.currentBowlerId] : null;
  const nextBallNumber = Math.min(innings.scoreboard.ballsInOver + 1, 6);
  const chasePressure =
    innings.scoreboard.target != null &&
    innings.scoreboard.requiredRuns != null &&
    innings.scoreboard.ballsLeft > 0 &&
    innings.scoreboard.requiredRuns <= Math.max(12, innings.scoreboard.ballsLeft * 2);

  return `
    <section class="scoreboard ${scorePulse ? "is-scored" : ""} ${chasePressure ? "is-close-chase" : ""}">
      <div class="scoreboard__main">
        <div class="scoreboard__headline">
          <p class="eyebrow">Innings ${match.currentInningsIndex + 1}</p>
          <h2>${battingTeam?.name ?? "Batting"} <span>${innings.scoreboard.runs}/${innings.scoreboard.wickets}</span></h2>
          <p class="scoreboard__subline">${formatOvers(innings.scoreboard.legalBalls)} overs completed</p>
        </div>
        <div class="scoreboard__turn ${turnTone}">
          <div class="scoreboard__turn-head">
            <span class="turn-dot ${turnTone}"></span>
            <strong>${turnLabel}</strong>
          </div>
          <span>Over ${innings.scoreboard.overs + 1}, ball ${nextBallNumber}</span>
        </div>
        <div class="scoreboard__signal-lane ${signalHighlighted ? "is-live" : ""}">
          <span class="scoreboard__signal-label">Team Signal</span>
          <strong>${incomingSignal ? `${incomingSignal.fromPlayerName || "Teammate"}: ${incomingSignal.text}` : "No teammate signal right now"}</strong>
        </div>
        <div class="scoreboard__meta">
          <span><strong>${formatOvers(innings.scoreboard.legalBalls)}</strong><small>Over count</small></span>
          <span><strong>${innings.scoreboard.target ?? "-"}</strong><small>Target</small></span>
          <span><strong>${innings.scoreboard.requiredRuns ?? "-"}</strong><small>Need</small></span>
          <span><strong>${innings.scoreboard.ballsLeft}</strong><small>Balls left</small></span>
        </div>
      </div>
      <div class="scoreboard__players">
        <article class="scoreboard__player is-striker">
          <strong>Striker</strong>
          <span>${striker?.name ?? "Waiting"}</span>
          <small>${strikerStats ? `${strikerStats.runs} runs &middot; ${strikerStats.ballsFaced} balls` : "Yet to face"}</small>
        </article>
        <article class="scoreboard__player">
          <strong>Non-striker</strong>
          <span>${nonStriker?.name ?? "Single batsman mode"}</span>
          <small>${nonStrikerStats ? `${nonStrikerStats.runs} runs &middot; ${nonStrikerStats.ballsFaced} balls` : "Waiting"}</small>
        </article>
        <article class="scoreboard__player is-bowler">
          <strong>Current bowler</strong>
          <span>${bowler?.name ?? bowlingTeam?.name ?? "Waiting"}</span>
          <small>${bowlerStats ? `${bowlerStats.wicketsTaken} wickets &middot; ${bowlerStats.ballsBowled} balls` : "Ready to bowl"}</small>
        </article>
      </div>
    </section>
  `;
}
