// @ts-check

/**
 * @param {{
 *   title?: string;
 *   kicker?: string;
 *   content: string;
 *   className?: string;
 * }} config
 * @returns {string}
 */
export function renderCard({ title = "", kicker = "", content, className = "" }) {
  return `
    <section class="card ${className}">
      ${kicker ? `<p class="card__kicker">${kicker}</p>` : ""}
      ${title ? `<h3 class="card__title">${title}</h3>` : ""}
      <div class="card__body">
        ${content}
      </div>
    </section>
  `;
}
