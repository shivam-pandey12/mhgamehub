// @ts-check

import { renderButton } from "../components/button.js";
import { renderCard } from "../components/card.js";

/**
 * @param {string} index
 * @param {string} title
 * @param {string} text
 * @returns {string}
 */
function renderStep(index, title, text) {
  return `
    <article class="guide-step">
      <span class="guide-step__index">${index}</span>
      <div class="guide-step__body">
        <strong>${title}</strong>
        <p>${text}</p>
      </div>
    </article>
  `;
}

/**
 * @param {string} title
 * @param {string} text
 * @param {string} meta
 * @returns {string}
 */
function renderModeTile(title, text, meta) {
  return `
    <article class="guide-tile">
      <strong>${title}</strong>
      <p>${text}</p>
      <span>${meta}</span>
    </article>
  `;
}

/**
 * @returns {string}
 */
function renderBallRevealDemo() {
  return `
    <div class="guide-demo">
      <div class="guide-demo__lane">
        <span class="guide-demo__label">Batter pick</span>
        <div class="guide-demo__value">4</div>
      </div>
      <div class="guide-demo__divider">Reveal together</div>
      <div class="guide-demo__lane">
        <span class="guide-demo__label">Bowler pick</span>
        <div class="guide-demo__value">2</div>
      </div>
      <div class="guide-demo__result is-run">
        <strong>Runs scored</strong>
        <span>+4</span>
      </div>
    </div>
  `;
}

/**
 * @returns {string}
 */
function renderOutDemo() {
  return `
    <div class="guide-demo">
      <div class="guide-demo__lane">
        <span class="guide-demo__label">Batter pick</span>
        <div class="guide-demo__value">6</div>
      </div>
      <div class="guide-demo__divider">Same number</div>
      <div class="guide-demo__lane">
        <span class="guide-demo__label">Bowler pick</span>
        <div class="guide-demo__value">6</div>
      </div>
      <div class="guide-demo__result is-out">
        <strong>Wicket falls</strong>
        <span>OUT</span>
      </div>
    </div>
  `;
}

/**
 * @param {import("../types/models").AppState} _state
 * @returns {string}
 */
export function renderRulesScreen(_state) {
  return `
    <section class="rules-page">
      ${renderCard({
        kicker: "How To Play",
        title: "Learn MH Handrex in one smooth walkthrough",
        className: "card--hero rules-hero",
        content: `
          <p class="rules-hero__lede">
            MH Handrex is hand cricket with realtime tension. Two sides lock numbers from the active number set,
            both picks stay hidden, and the reveal decides whether the batter survives or the wicket falls.
          </p>
          <div class="rules-hero__pills">
            <span class="guide-pill">Classic 1-6 by default</span>
            <span class="guide-pill">Hidden picks</span>
            <span class="guide-pill">Realtime reveal</span>
            <span class="guide-pill">Room play from 1v1 to 11v11</span>
          </div>
          <div class="action-row">
            ${renderButton({ label: "Quick Match", action: "quick-match" })}
            ${renderButton({ label: "Create Room", action: "create-room", variant: "secondary" })}
            ${renderButton({ label: "Back Home", action: "navigate", variant: "ghost", attrs: { "data-route": "home" } })}
          </div>
        `,
      })}

      <div class="grid-two">
        ${renderCard({
          kicker: "One Ball",
          title: "This is the entire core rule",
          content: `
            <div class="guide-stack">
              ${renderStep("1", "Both sides choose a number", "The active batter and current bowler each pick from the room's active number set.")}
              ${renderStep("2", "Both picks stay hidden", "No one sees the result until both numbers are locked in.")}
              ${renderStep("3", "The reveal decides the ball", "Match means OUT. Different numbers means the batter scores the chosen runs.")}
            </div>
          `,
        })}
        ${renderCard({
          kicker: "Visual Example",
          title: "If the numbers are different",
          content: `
            ${renderBallRevealDemo()}
            <p class="muted">The batter chose 4, the bowler chose 2, so the batting side scores 4 runs.</p>
          `,
        })}
      </div>

      <div class="grid-two">
        ${renderCard({
          kicker: "Wicket Rule",
          title: "If both sides pick the same number",
          content: `
            ${renderOutDemo()}
            <p class="muted">A matching number always dismisses the striker. In single mode the next batter arrives. In two-batsmen mode the non-striker stays.</p>
          `,
        })}
        ${renderCard({
          kicker: "Strike Logic",
          title: "Who faces the next ball",
          content: `
            <div class="guide-stack">
              ${renderStep("A", "Odd runs rotate strike", "In two-batsmen mode, 1, 3, and 5 swap striker and non-striker.")}
              ${renderStep("B", "Even runs keep strike", "2, 4, and 6 keep the same striker on the next legal ball.")}
              ${renderStep("C", "Over end rotates strike", "After 6 legal balls, the over ends, strike changes, and the next bowler takes over.")}
            </div>
          `,
        })}
      </div>

      <div class="grid-two">
        ${renderCard({
          kicker: "Match Journey",
          title: "From room to winner",
          content: `
            <div class="guide-journey">
              ${renderStep("01", "Create or join a room", "Share the room code or invite link and fill both teams.")}
              ${renderStep("02", "Ready up in the lobby", "The host sets match settings, captains are chosen, and everyone marks ready.")}
              ${renderStep("03", "Run the toss", "Captains decide which side bats first and move into lineup control.")}
              ${renderStep("04", "Play the innings", "Each legal ball updates score, wickets, strike, over count, and chase pressure.")}
              ${renderStep("05", "Finish and review", "See the winner, innings summary, player stats, and ball-by-ball history.")}
            </div>
          `,
        })}
        ${renderCard({
          kicker: "Ways To Play",
          title: "Choose the match style before you start",
          content: `
            <div class="guide-tile-grid">
              ${renderModeTile("Single batsman", "One active batter at a time. Every wicket brings in the next player.", "Best for simpler flow")}
              ${renderModeTile("Two batsmen", "Striker and non-striker stay active. Odd runs and over end rotate strike.", "Feels closer to cricket")}
              ${renderModeTile("Free-change bowling", "Captain can change bowler whenever the rules allow during the innings.", "Flexible captain control")}
              ${renderModeTile("Over-locked bowling", "The current bowler stays for all 6 balls of the over.", "More structured match rhythm")}
            </div>
          `,
        })}
      </div>

      <div class="grid-two">
        ${renderCard({
          kicker: "Captain Control",
          title: "What captains manage",
          content: `
            <div class="guide-stack">
              ${renderStep("1", "Set batting order", "Arrange who walks in first and who remains in the queue behind them.")}
              ${renderStep("2", "Set bowling order", "Choose the opening bowler and the sequence that follows.")}
              ${renderStep("3", "Adjust during the innings", "Remaining batters can be reshuffled, and bowlers can be changed if the bowling mode allows it.")}
            </div>
          `,
        })}
        ${renderCard({
          kicker: "How You Win",
          title: "When the match ends",
          content: `
            <div class="guide-endings">
              <article class="guide-ending">
                <strong>All out</strong>
                <p>The batting side runs out of available players before reaching the target or before overs finish.</p>
              </article>
              <article class="guide-ending">
                <strong>Overs complete</strong>
                <p>The innings ends when the legal ball limit is reached.</p>
              </article>
              <article class="guide-ending">
                <strong>Target achieved</strong>
                <p>In the chase, the match ends immediately once the batting side reaches the target.</p>
              </article>
            </div>
          `,
        })}
      </div>

      <div class="grid-two">
        ${renderCard({
          kicker: "During Live Play",
          title: "What to watch on the match screen",
          content: `
            <div class="guide-tile-grid">
              ${renderModeTile("Scoreboard", "Shows runs, wickets, overs, target, required runs, and balls left.", "Top of screen")}
              ${renderModeTile("Turn signal", "Tells you whether it is your turn or you are waiting for the opponent.", "Center feedback")}
              ${renderModeTile("Hidden picks", "Numbers stay locked and private until both sides have submitted.", "Fair reveal")}
              ${renderModeTile("Ball history", "Recent balls and result trail stay visible so the match never feels confusing.", "Always traceable")}
            </div>
          `,
        })}
        ${renderCard({
          kicker: "Good To Know",
          title: "Small rules that matter",
          content: `
            <ul class="feature-list">
              <li>The batter's number is the run value whenever the bowler picks something different.</li>
              <li>Only the active striker and active bowler submit numbers for the current ball.</li>
              <li>In two-batsmen mode, a wicket only removes the striker. The non-striker stays.</li>
              <li>The second innings always chases first innings score plus one.</li>
              <li>If the page reloads during a live match, the app tries to restore you back into the same room session.</li>
            </ul>
          `,
        })}
      </div>

      ${renderCard({
        kicker: "Ready To Play",
        title: "Start simple, then scale up",
        content: `
          <div class="rules-footer">
            <p>
              Start with a quick 1v1 to learn the rhythm. Once the reveal-and-response flow clicks,
              move into bigger rooms, captain lineups, and full chase pressure.
            </p>
            <div class="action-row">
              ${renderButton({ label: "Start Quick Match", action: "quick-match" })}
              ${renderButton({ label: "Open History", action: "navigate", variant: "secondary", attrs: { "data-route": "history" } })}
            </div>
          </div>
        `,
      })}
    </section>
  `;
}
