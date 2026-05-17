// @ts-check

import { renderButton } from "./button.js";

/**
 * @param {import("../types/models").AppState["ui"]["confirmDialog"]} dialog
 * @returns {string}
 */
export function renderConfirmDialog(dialog) {
  if (!dialog) {
    return "";
  }

  return `
    <div class="modal-overlay">
      <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
        <p class="card__kicker">Please confirm</p>
        <h3 class="card__title" id="confirm-dialog-title">${dialog.title}</h3>
        <div class="card__body">
          <p class="muted">${dialog.message}</p>
          <div class="action-row">
            ${renderButton({ label: dialog.cancelLabel || "Cancel", action: "cancel-dialog", variant: "ghost" })}
            ${renderButton({ label: dialog.confirmLabel || "Confirm", action: "confirm-dialog", variant: "danger" })}
          </div>
        </div>
      </section>
    </div>
  `;
}
