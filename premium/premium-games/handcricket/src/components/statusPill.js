// @ts-check

/**
 * @param {import("../types/models").ConnectionState} connection
 * @returns {string}
 */
export function renderStatusPill(connection) {
  return `
    <span class="status-pill status-pill--${connection.status}">
      <span class="status-pill__dot"></span>
      <span>${connection.status}</span>
    </span>
  `;
}
