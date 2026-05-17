// @ts-check

import { CONTROL_MODES } from "../config/constants.js";
import { renderButton } from "../components/button.js";
import { renderCard } from "../components/card.js";
import { renderLineupEditor } from "../components/lineupEditor.js";

/**
 * @param {import("../types/models").AppState} state
 * @returns {string}
 */
export function renderLineupScreen(state) {
  if (!state.room?.teams.alpha || !state.room.teams.beta) {
    return "";
  }

  const playersById = Object.fromEntries(state.room.players.map((player) => [player.id, player]));
  const alphaLineup = state.room.lineups?.alpha ?? {
    battingOrder: state.room.teams.alpha.battingOrder,
    bowlingOrder: state.room.teams.alpha.bowlingOrder,
  };
  const betaLineup = state.room.lineups?.beta ?? {
    battingOrder: state.room.teams.beta.battingOrder,
    bowlingOrder: state.room.teams.beta.bowlingOrder,
  };
  const localPlayerId = state.session.localPlayerId;
  const hotseat = state.room.settings.controlMode === CONTROL_MODES.HOTSEAT;
  const canManageAlpha = hotseat || state.room.captains.alpha === localPlayerId;
  const canManageBeta = hotseat || state.room.captains.beta === localPlayerId;
  const isHost = state.room.hostId === localPlayerId;
  const alphaCaptain = playersById[state.room.captains.alpha ?? ""]?.name ?? "Alpha captain";
  const betaCaptain = playersById[state.room.captains.beta ?? ""]?.name ?? "Beta captain";

  return `
    <section class="page-stack">
      ${renderCard({
        kicker: "Ready",
        title: "Lock lineups and start the match",
        className: "card--hero",
        content: `
          <p>Each captain sets the batting order and bowling rotation for their side before kickoff. The host can lock the lineups and start the match when both teams look right.</p>
          <p class="muted">
            ${alphaCaptain} controls ${state.room.teams.alpha.name}. ${betaCaptain} controls ${state.room.teams.beta.name}.
          </p>
          <div class="action-row">
            ${renderButton({ label: isHost ? "Lock & Start Match" : "Host Starts Match", action: "start-match", disabled: !isHost })}
            ${renderButton({ label: "Back to Toss", action: "navigate", variant: "ghost", attrs: { "data-route": "toss" } })}
          </div>
        `,
      })}
      <div class="grid-two">
        ${renderCard({
          kicker: "Lineups",
          title: state.room.teams.alpha.name,
          content: `
            ${renderLineupEditor({
              title: "Batting Order",
              teamId: "alpha",
              type: "batting",
              order: alphaLineup.battingOrder,
              playersById,
              locked: !canManageAlpha,
              helper: canManageAlpha
                ? "Alpha captain sets the order for incoming batters."
                : `${alphaCaptain} controls this batting lineup.`,
            })}
            ${renderLineupEditor({
              title: "Bowling Rotation",
              teamId: "alpha",
              type: "bowling",
              order: alphaLineup.bowlingOrder,
              playersById,
              locked: !canManageAlpha,
              helper: canManageAlpha
                ? "Set the starting bowling order. Free-change mode can still adjust this in-match."
                : `${alphaCaptain} controls this bowling lineup.`,
            })}
          `,
        })}
        ${renderCard({
          kicker: "Lineups",
          title: state.room.teams.beta.name,
          content: `
            ${renderLineupEditor({
              title: "Batting Order",
              teamId: "beta",
              type: "batting",
              order: betaLineup.battingOrder,
              playersById,
              locked: !canManageBeta,
              helper: canManageBeta
                ? "Beta captain sets the order for incoming batters."
                : `${betaCaptain} controls this batting lineup.`,
            })}
            ${renderLineupEditor({
              title: "Bowling Rotation",
              teamId: "beta",
              type: "bowling",
              order: betaLineup.bowlingOrder,
              playersById,
              locked: !canManageBeta,
              helper: canManageBeta
                ? "Set the starting bowling order for match setup."
                : `${betaCaptain} controls this bowling lineup.`,
            })}
          `,
        })}
      </div>
    </section>
  `;
}
