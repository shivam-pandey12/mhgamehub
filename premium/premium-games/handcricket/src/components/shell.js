// @ts-check

import { renderConfirmDialog } from "./confirmDialog.js";
import { renderGuidedCoach } from "./guidedCoach.js";
import { renderStatusPill } from "./statusPill.js";
import { renderToasts } from "./toast.js";

/**
 * @param {{
 *   route: string;
 *   content: string;
 *   connection: import("../types/models").ConnectionState;
 *   ui: import("../types/models").AppState["ui"];
 * }} config
 * @returns {string}
 */
export function renderShell({ route, content, connection, ui }) {
  const showDockNav = route !== "match";

  return `
    <div class="app-shell app-shell--${route}">
      <div class="app-shell__backdrop"></div>
      <header class="topbar">
        <div>
          <a class="brand" href="#/home" data-action="navigate" data-route="home">
            <span class="brand__mark">MH</span>
            <span>
              <strong>MH Handrex</strong>
              <small>Crafted by MH Horizon</small>
            </span>
          </a>
        </div>
        <div class="topbar__meta">
          ${renderStatusPill(connection)}
          <p class="topbar__note">${ui.connectionBanner || connection.note || "Ready"}</p>
        </div>
      </header>
      <main class="page-shell page-shell--${route}">
        ${content}
      </main>
      ${
        showDockNav
          ? `
            <nav class="dock-nav">
              <button class="dock-nav__item ${route === "home" ? "is-active" : ""}" data-action="navigate" data-route="home">Home</button>
              <button class="dock-nav__item ${route === "history" ? "is-active" : ""}" data-action="navigate" data-route="history">History</button>
              <button class="dock-nav__item ${route === "rules" ? "is-active" : ""}" data-action="navigate" data-route="rules">Rules</button>
            </nav>
          `
          : ""
      }
      ${renderGuidedCoach(ui.coach ?? null, route)}
      ${renderToasts(ui.toasts)}
      ${renderConfirmDialog(ui.confirmDialog ?? null)}
    </div>
  `;
}
