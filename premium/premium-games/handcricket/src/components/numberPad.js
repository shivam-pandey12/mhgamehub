// @ts-check

import { getDefaultNumberSet } from "../engine/numberSets.js";

/**
 * @param {{
 *   title: string;
 *   side: "batting" | "bowling";
 *   selected: number | null;
   *   disabled: boolean;
 *   locked: boolean;
 *   busy?: boolean;
 *   note: string;
 *   statusLabel?: string;
 *   allowedNumbers?: number[];
 *   waiting?: boolean;
 * }} config
 * @returns {string}
 */
export function renderNumberPad({
  title,
  side,
  selected,
  disabled,
  locked,
  busy = false,
  note,
  statusLabel = "",
  allowedNumbers = getDefaultNumberSet().allowedNumbers,
  waiting = false,
}) {
  const displayNumbers = Array.isArray(allowedNumbers) && allowedNumbers.length ? allowedNumbers : getDefaultNumberSet().allowedNumbers;
  const classicGrid = displayNumbers.length === 6 && displayNumbers.every((value, index) => value === index + 1);
  const canLock = !disabled && !locked && selected != null;

  return `
    <section class="number-pad ${disabled ? "is-disabled" : ""} ${locked ? "is-locked" : ""} ${busy ? "is-busy" : ""} ${waiting ? "is-waiting" : ""}">
      <div class="number-pad__head">
        <div>
          <h3>${title}</h3>
          <p>${note}</p>
        </div>
        ${statusLabel ? `<span class="mini-badge">${statusLabel}</span>` : ""}
      </div>
      <div class="number-pad__grid ${classicGrid ? "number-pad__grid--classic" : "number-pad__grid--dynamic"} ${displayNumbers.length > 10 ? "number-pad__grid--dense" : ""}">
        ${displayNumbers.map(
          (value) => `
            <button
              class="number-btn ${!locked && selected === value ? "is-selected" : ""}"
              data-action="pick-number"
              data-side="${side}"
              data-value="${value}"
              aria-label="Select ${value} for ${side}"
              ${disabled || locked ? "disabled" : ""}
            >
              <span>${value}</span>
            </button>
          `,
        ).join("")}
      </div>
      <div class="number-pad__footer">
        <p class="number-pad__status">
          ${
            locked
              ? "Pick locked and hidden until reveal."
              : selected != null
                ? `Selected ${selected}. Lock it when ready.`
                : "Choose a number, then lock your pick."
          }
        </p>
        <button
          class="btn btn--secondary btn--sm number-pad__lock"
          data-action="lock-number"
          data-side="${side}"
          ${canLock ? "" : "disabled"}
          aria-label="Lock ${side} pick"
        >
          ${waiting ? "Waiting..." : locked ? "Locked" : "Lock Pick"}
        </button>
      </div>
    </section>
  `;
}
