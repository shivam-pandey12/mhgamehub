// @ts-check

/**
 * @param {import("../types/models").AppState["ui"]["toasts"]} toasts
 * @returns {string}
 */
export function renderToasts(toasts) {
  if (!toasts.length) {
    return "";
  }

  return `
    <div class="toast-stack">
      ${toasts
        .map(
          (toast) => `
            <div class="toast toast--${toast.tone}">
              <span>${toast.message}</span>
              <button class="toast__close" data-action="dismiss-toast" data-id="${toast.id}">x</button>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}
