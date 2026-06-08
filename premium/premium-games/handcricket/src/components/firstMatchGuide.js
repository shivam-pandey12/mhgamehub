// @ts-check

/**
 * @param {{ compact?: boolean }} [options]
 * @returns {string}
 */
export function renderFirstMatchGuide(options = {}) {
  const compact = Boolean(options.compact);

  return `
    <section class="first-match-guide ${compact ? "first-match-guide--compact" : ""}" aria-label="First match visual guide">
      <div class="first-match-guide__head">
        <p class="card__kicker">First Match Guide</p>
        <h3>${compact ? "Play your first ball" : "Your first match, visually"}</h3>
      </div>
      <div class="first-match-guide__rail">
        <article class="first-match-card">
          <div class="first-match-card__visual first-match-card__visual--setup">
            <span class="guide-node">1</span>
            <div class="guide-mini-input">
              <small>Name</small>
              <strong>You</strong>
            </div>
            <div class="guide-mini-button">Guided Match</div>
          </div>
          <div class="first-match-card__copy">
            <strong>Start simple</strong>
            <span>Tap Guided First Match and follow the highlighted buttons through one real practice game.</span>
          </div>
        </article>
        <article class="first-match-card">
          <div class="first-match-card__visual first-match-card__visual--teams">
            <span class="guide-node">2</span>
            <div class="guide-team-pill">Alpha</div>
            <div class="guide-vs">VS</div>
            <div class="guide-team-pill">Beta</div>
          </div>
          <div class="first-match-card__copy">
            <strong>Set sides</strong>
            <span>Players fill Alpha and Beta, ready up, then the host starts toss and lineups.</span>
          </div>
        </article>
        <article class="first-match-card">
          <div class="first-match-card__visual first-match-card__visual--pick">
            <span class="guide-node">3</span>
            <div class="guide-pick-grid">
              <span>1</span><span>2</span><span>3</span>
              <span class="is-hot">4</span><span>5</span><span>6</span>
            </div>
            <div class="guide-lock">Lock</div>
          </div>
          <div class="first-match-card__copy">
            <strong>Pick hidden numbers</strong>
            <span>The active batter and bowler each lock one number. Picks reveal together.</span>
          </div>
        </article>
        <article class="first-match-card">
          <div class="first-match-card__visual first-match-card__visual--result">
            <span class="guide-node">4</span>
            <div class="guide-result-tile">
              <small>Bat 4 / Bowl 2</small>
              <strong>+4 Runs</strong>
            </div>
            <div class="guide-result-tile is-out">
              <small>Bat 6 / Bowl 6</small>
              <strong>OUT</strong>
            </div>
          </div>
          <div class="first-match-card__copy">
            <strong>Read the reveal</strong>
            <span>Different numbers score batter runs. Same numbers take a wicket.</span>
          </div>
        </article>
        <article class="first-match-card">
          <div class="first-match-card__visual first-match-card__visual--score">
            <span class="guide-node">5</span>
            <div class="guide-score">
              <small>Chase</small>
              <strong>42/3</strong>
              <span>Need 18 in 12</span>
            </div>
          </div>
          <div class="first-match-card__copy">
            <strong>Finish the chase</strong>
            <span>Watch score, wickets, overs, target, and ball history until the winner is clear.</span>
          </div>
        </article>
      </div>
    </section>
  `;
}
