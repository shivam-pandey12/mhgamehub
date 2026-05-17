// @ts-check

/**
 * @template T
 * @param {T} value
 * @returns {T}
 */
export function clone(value) {
  return structuredClone(value);
}

/**
 * @template T
 * @param {T[]} list
 * @returns {T[]}
 */
export function shuffle(list) {
  const next = [...list];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

/**
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/**
 * @template T
 * @param {T[]} list
 * @returns {T}
 */
export function sample(list) {
  return list[Math.floor(Math.random() * list.length)];
}
