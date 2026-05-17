// @ts-check

/**
 * @param {number} battingNumber
 * @param {number} bowlingNumber
 * @returns {boolean}
 */
export function isWicket(battingNumber, bowlingNumber) {
  return battingNumber === bowlingNumber;
}

/**
 * @param {number} value
 * @returns {boolean}
 */
export function isOdd(value) {
  return value % 2 === 1;
}

/**
 * @param {number} legalBalls
 * @param {number} overs
 * @returns {number}
 */
export function ballsLeftInInnings(legalBalls, overs) {
  return Math.max(overs * 6 - legalBalls, 0);
}

/**
 * @param {number} wickets
 * @param {number} totalPlayers
 * @returns {boolean}
 */
export function isAllOut(wickets, totalPlayers) {
  return wickets >= Math.max(totalPlayers, 1);
}
