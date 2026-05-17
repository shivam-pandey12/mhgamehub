// @ts-check

/**
 * @param {{ open: boolean; title: string; content: string }} config
 * @returns {string}
 */
export function renderModal({ open, title, content }) {
  if (!open) {
    return "";
  }

  return `
    <div class="modal-backdrop">
      <div class="modal">
        <h3>${title}</h3>
        <div class="modal__body">${content}</div>
      </div>
    </div>
  `;
}
