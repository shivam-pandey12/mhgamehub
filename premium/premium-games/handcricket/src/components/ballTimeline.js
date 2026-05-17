// @ts-check

import { getMomentumState, getResultInsight } from "../engine/mindGame.js";

/**
 * @param {import("../types/models").BallEvent[]} ballEvents
 * @param {{ match?: import("../types/models").Match | null; allowedNumbers?: number[] }} [options]
 * @returns {string}
 */
export function renderBallTimeline(ballEvents, options = {}) {
  const events = Array.isArray(ballEvents) ? ballEvents : [];
  const recent = events
    .map((event, index) => ({ event, index }))
    .slice(-12)
    .reverse();

  return `
    <section class="ball-timeline">
      <div class="ball-timeline__head">
        <h3>Recent Balls</h3>
        <p>Latest reveals and outcomes</p>
      </div>
      <div class="ball-timeline__list">
        ${recent.length
          ? recent
              .map(
                ({ event, index }) => {
                  const tone = event.resultTone ?? event.resultType ?? "run";
                  const label = event.resultLabel ?? (event.resultType === "wicket" ? "Wicket!" : `+${event.runs}`);
                  const priorTimeline = events.slice(0, index);
                  const insight = getResultInsight(event, priorTimeline, options.allowedNumbers);
                  const momentum = getMomentumState(options.match, events.slice(0, index + 1), options.allowedNumbers);
                  const storyLabel = insight || (momentum.label !== "Neutral" ? momentum.label : event.shotLabel ?? "");
                  return `
                  <article class="ball-chip ball-chip--${tone}">
                    <strong>${event.resultType === "wicket" ? "OUT" : `+${event.runs}`}</strong>
                    <span>${event.battingNumber} vs ${event.bowlingNumber}</span>
                    <small>${label}</small>
                    ${storyLabel ? `<em>${storyLabel}</em>` : ""}
                    <small>Over ${event.over}.${event.ball}</small>
                  </article>
                `;
                },
              )
              .join("")
          : `<p class="empty-state">First ball is still waiting.</p>`}
      </div>
    </section>
  `;
}
