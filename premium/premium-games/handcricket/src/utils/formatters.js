// @ts-check

/**
 * @param {number} legalBalls
 * @returns {string}
 */
export function formatOvers(legalBalls) {
  const overs = Math.floor(legalBalls / 6);
  const balls = legalBalls % 6;
  return `${overs}.${balls}`;
}

/**
 * @param {number | null} timestamp
 * @returns {string}
 */
export function formatTime(timestamp) {
  if (!timestamp) {
    return "just now";
  }

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(timestamp);
}

/**
 * @param {string} value
 * @returns {string}
 */
export function titleCase(value) {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}
