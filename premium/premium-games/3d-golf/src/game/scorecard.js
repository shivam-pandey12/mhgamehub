import { adjustedScore, formatTime } from './modes.js';

export function starsMarkup(count = 0) {
  return `${'&starf;'.repeat(count)}${'&star;'.repeat(Math.max(0, 3 - count))}`;
}

export function relativeLabel(shots, penalties, par) {
  const delta = shots + penalties - par;
  if (delta === 0) return 'E';
  return delta > 0 ? `+${delta}` : String(delta);
}

export function renderScorecardRows(holes = []) {
  return holes
    .map((hole, index) => `
      <div class="score-row">
        <span>${hole.levelName ?? index + 1}</span>
        <span>${hole.par}</span>
        <span>${hole.shots}</span>
        <span>${hole.penalties}</span>
        <strong>${relativeLabel(hole.shots, hole.penalties, hole.par)}</strong>
      </div>
    `)
    .join('');
}

export function totalsForHoles(holes = []) {
  return holes.reduce(
    (sum, hole) => {
      sum.shots += hole.shots;
      sum.penalties += hole.penalties;
      sum.par += hole.par;
      sum.stars += hole.stars ?? 0;
      return sum;
    },
    { shots: 0, penalties: 0, par: 0, stars: 0 }
  );
}

export function resultSummaryHtml({ title, subtitle, holes = [], rank, bestLabel, timeMs, penaltySeconds, winner, stars = 0 }) {
  const totals = totalsForHoles(holes);
  const time = Number.isFinite(timeMs) ? `<span>Time <strong>${formatTime(timeMs + (penaltySeconds ?? 0) * 1000)}</strong></span>` : '';
  const winnerLine = winner ? `<p class="winner-line">${winner}</p>` : '';
  return `
    <p class="panel-kicker">${subtitle ?? 'Scorecard'}</p>
    <h2>${title}</h2>
    ${winnerLine}
    <div class="stars is-revealing">${starsMarkup(stars || totals.stars)}</div>
    <div class="complete-grid">
      <span>Shots <strong>${totals.shots}</strong></span>
      <span>Par <strong>${totals.par}</strong></span>
      <span>Penalties <strong>${totals.penalties}</strong></span>
      <span>Total <strong>${adjustedScore(totals)}</strong></span>
      ${rank ? `<span>Rank <strong>${rank}</strong></span>` : ''}
      ${bestLabel ? `<span>Best <strong>${bestLabel}</strong></span>` : ''}
      ${time}
    </div>
    <div class="scorecard">
      <div class="score-row score-row--head">
        <span>Hole</span><span>Par</span><span>Shots</span><span>Penalty</span><strong>Result</strong>
      </div>
      ${renderScorecardRows(holes)}
    </div>
  `;
}
