// @ts-check

import { renderButton } from "../components/button.js";
import { renderCard } from "../components/card.js";

/**
 * @param {import("../types/models").AppState} state
 * @returns {string}
 */
export function renderTossScreen(state) {
  const tossResult = state.room?.tossResult ?? null;

  if (!state.room?.teams.alpha || !state.room.teams.beta) {
    return "";
  }

  const localPlayerId = state.session.localPlayerId;
  const isAlphaCaptain = state.room.captains.alpha === localPlayerId;
  const isBetaCaptain = state.room.captains.beta === localPlayerId;
  const isCaptain = isAlphaCaptain || isBetaCaptain;
  const winningCaptainId = tossResult ? state.room.captains[tossResult.winnerTeamId] : null;
  const canChooseDecision = Boolean(tossResult && !tossResult.decision && winningCaptainId === localPlayerId);
  const winnerName = tossResult
    ? state.room.teams[tossResult.winnerTeamId]?.name ?? tossResult.winnerTeamId
    : "";

  let content = `
    <div class="coin-stage">
      <div class="coin ${tossResult ? "is-flipped" : ""}">
        <span>MH</span>
      </div>
    </div>
  `;

  if (!tossResult) {
    content += `
      <p class="centered">Both captains are on toss duty. Alpha captain calls heads or tails while everyone else waits for the reveal.</p>
      ${
        isAlphaCaptain
          ? `
              <div class="action-row action-row--center">
                ${renderButton({ label: "Heads", action: "run-toss", attrs: { "data-call": "heads" } })}
                ${renderButton({ label: "Tails", action: "run-toss", variant: "secondary", attrs: { "data-call": "tails" } })}
              </div>
            `
          : `
              <p class="warning-text centered">
                ${isCaptain ? "Waiting for Alpha captain to make the call." : "Captains are handling the toss. The result will appear here for everyone."}
              </p>
            `
      }
    `;
  } else if (!tossResult.decision) {
    content += `
      <div class="toss-result">
        <p class="eyebrow">Coin landed on ${tossResult.coinFace}</p>
        <h3>${winnerName} won the toss</h3>
        <p>The winning captain now chooses whether to bat or bowl first. All players are synced to this result.</p>
        ${
          canChooseDecision
            ? `
                <div class="action-row action-row--center">
                  ${renderButton({ label: "Bat First", action: "choose-toss", attrs: { "data-decision": "bat" } })}
                  ${renderButton({ label: "Bowl First", action: "choose-toss", variant: "secondary", attrs: { "data-decision": "bowl" } })}
                </div>
              `
            : `
                <p class="warning-text centered">
                  ${
                    isCaptain
                      ? "Waiting for the toss-winning captain to choose bat or bowl."
                      : "Waiting for the toss-winning captain. You will move to lineups automatically."
                  }
                </p>
              `
        }
      </div>
    `;
  } else {
    content += `
      <div class="toss-result">
        <p class="eyebrow">Toss Finalized</p>
        <h3>${winnerName} chose to ${tossResult.decision}</h3>
        <p class="centered">Lineups are opening for the full room now.</p>
      </div>
    `;
  }

  return `
    <section class="page-stack">
      ${renderCard({
        kicker: "Toss",
        title: "Coin Flip",
        className: "card--hero",
        content,
      })}
      ${renderCard({
        kicker: "Flow",
        title: "How this stage works",
        content: `
          <ul class="feature-list">
            <li>Alpha captain makes the heads-or-tails call for the room.</li>
            <li>The toss-winning captain chooses whether to bat or bowl first.</li>
            <li>Once that choice is locked, everyone moves together into lineups.</li>
          </ul>
        `,
      })}
    </section>
  `;
}
