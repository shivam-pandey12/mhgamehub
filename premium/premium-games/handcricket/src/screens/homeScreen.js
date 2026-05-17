// @ts-check

import { renderButton } from "../components/button.js";
import { renderCard } from "../components/card.js";
import { APP_RELEASE, PLAYERS_PER_TEAM_OPTIONS, ROOM_CODE_LENGTH } from "../config/constants.js";
import { loadReleaseNotice, saveReleaseNotice } from "../utils/storage.js";

/**
 * @returns {boolean}
 */
function shouldShowWhatsNew() {
  const notice = loadReleaseNotice();
  const nextNotice = {
    installedVersion: notice.installedVersion,
    whatsNewVersion: notice.whatsNewVersion,
  };
  let changed = false;

  if (!nextNotice.installedVersion) {
    nextNotice.installedVersion = APP_RELEASE.version;
    changed = true;
  } else if (nextNotice.installedVersion !== APP_RELEASE.version) {
    nextNotice.installedVersion = APP_RELEASE.version;
    nextNotice.whatsNewVersion = APP_RELEASE.version;
    changed = true;
  }

  const releasedAt = Date.parse(APP_RELEASE.releasedAt);

  if (Number.isNaN(releasedAt)) {
    if (changed) {
      saveReleaseNotice(nextNotice);
    }
    return false;
  }

  const visibleForMs = APP_RELEASE.whatsNewVisibleDays * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const withinWindow = now >= releasedAt && now < releasedAt + visibleForMs;
  const shouldShow = nextNotice.whatsNewVersion === APP_RELEASE.version && withinWindow;

  if (!withinWindow && nextNotice.whatsNewVersion === APP_RELEASE.version) {
    nextNotice.whatsNewVersion = null;
    changed = true;
  }

  if (changed) {
    saveReleaseNotice(nextNotice);
  }

  return shouldShow;
}

/**
 * @param {import("../types/models").AppState} state
 * @returns {string}
 */
export function renderHomeScreen(state) {
  const lastSavedMatch = state.lastSavedMatch;
  const showWhatsNew = shouldShowWhatsNew();
  const whatsNewUrl = APP_RELEASE.whatsNewUrl.trim();

  return `
    <section class="hero hero--home">
      <div class="hero__copy">
        <div class="hero__intro">
          <p class="eyebrow">Realtime Multiplayer Hand Cricket</p>
          <div class="hero__title-row">
            <h1>MH Handrex</h1>
            <div class="hero__release">
              <span class="hero-version">Version ${APP_RELEASE.version}</span>
              ${
                showWhatsNew
                  ? `
                    <a
                      class="hero-link ${whatsNewUrl ? "" : "is-disabled"}"
                      href="${whatsNewUrl || "#"}"
                      ${whatsNewUrl ? `target="_blank" rel="noreferrer"` : `aria-disabled="true" tabindex="-1"`}
                    >
                      What's New
                    </a>
                  `
                  : ""
              }
            </div>
          </div>
          <p class="hero__lede">
            Structured room play, quick practice matches, and synchronized ball reveals built to stay clear on both desktop and mobile.
          </p>
        </div>
        <div class="hero__pills">
          <span class="hero-pill">1v1 to 11v11</span>
          <span class="hero-pill">Live room sync</span>
          <span class="hero-pill">Practice offline</span>
          <span class="hero-pill">Mobile-friendly play</span>
        </div>
        <ul class="feature-list">
          <li>Create or join a room in seconds and keep every player synced.</li>
          <li>Set team size, captains, toss, lineups, and match mode from one flow.</li>
          <li>Jump into quick practice when you want a faster solo session.</li>
        </ul>
        <div class="field-grid">
          <label class="field">
            <span>Player Name</span>
            <input data-field="profile-name" value="${state.session.profileName}" maxlength="18" />
          </label>
          <label class="field">
            <span>Room Code</span>
            <input data-field="room-code" value="${state.ui.roomCodeInput}" maxlength="${ROOM_CODE_LENGTH}" />
          </label>
          <label class="field">
            <span>Players Per Team</span>
            <select data-field="players-per-team">
              ${PLAYERS_PER_TEAM_OPTIONS.map(
    (count) =>
      `<option value="${count}" ${state.ui.playersPerTeam === count ? "selected" : ""}>${count} vs ${count}</option>`,
  ).join("")}
            </select>
          </label>
        </div>
        <div class="hero__actions">
          ${renderButton({ label: "Quick Match", action: "quick-match" })}
          ${renderButton({ label: "Create Room", action: "create-room", variant: "secondary" })}
          ${renderButton({ label: "Join Room", action: "join-room", variant: "secondary" })}
          ${renderButton({ label: "Practice / Offline", action: "practice-mode", variant: "ghost" })}
          ${renderButton({ label: "Rules", action: "navigate", variant: "ghost", attrs: { "data-route": "rules" } })}
        </div>
      </div>
      <div class="hero__stack">
        ${renderCard({
          kicker: "Flow",
          title: "From home screen to live match",
          content: `
            <ul class="feature-list">
              <li>Create or join a room with realtime presence and invite sharing.</li>
              <li>Choose team sizes from 1v1 up to 11v11 before room creation.</li>
              <li>Move through toss, lineups, innings switch, and chase without leaving the flow.</li>
              <li>Play across tabs, windows, or separate devices.</li>
            </ul>
          `,
        })}
        ${lastSavedMatch
          ? renderCard({
              kicker: "Last Match",
              title: lastSavedMatch.result?.marginText ?? "Saved locally",
              content: `
                <ul class="feature-list">
                  ${lastSavedMatch.inningsSummary
                    .map(
                      (innings) =>
                        `<li>${innings.teamName}: ${innings.runs}/${innings.wickets} in ${innings.oversText} overs</li>`,
                    )
                    .join("")}
                  <li>Total runs: ${lastSavedMatch.basicStats.totalRuns}</li>
                  <li>Total wickets: ${lastSavedMatch.basicStats.totalWickets}</li>
                  <li>Numbers: ${lastSavedMatch.numberSetLabel ?? "Classic 1-6"}</li>
                </ul>
              `,
            })
          : ""}
        ${renderCard({
          kicker: "Architecture",
          title: "Structured to scale cleanly",
          content: `
            <ul class="feature-list">
              <li>UI, transport, and deterministic game logic are separated clearly.</li>
              <li>Socket communication stays behind room and match services.</li>
              <li>The engine keeps scoring predictable and easier to maintain.</li>
            </ul>
          `,
        })}
      </div>
    </section>
  `;
}
