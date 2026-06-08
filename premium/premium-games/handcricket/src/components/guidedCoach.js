// @ts-check

export const GUIDED_COACH_STEPS = [
  {
    route: "home",
    selector: "[data-action='practice-mode']",
    action: "practice-mode",
    title: "Step 1: Start a safe practice match",
    body: "Tap Practice / Offline. It opens a real AI match so you can learn without waiting for another player.",
  },
  {
    route: "lobby",
    selector: "[data-action='toggle-ready']",
    action: "toggle-ready",
    title: "Step 2: Mark yourself ready",
    body: "Tap Ready Up. The lobby will unlock the toss after the practice room is ready.",
  },
  {
    route: "lobby",
    selector: "[data-action='start-toss']:not(:disabled)",
    action: "start-toss",
    title: "Step 3: Start the toss",
    body: "Tap Start Toss. This moves the match into the coin-flip stage.",
  },
  {
    route: "toss",
    selector: "[data-action='run-toss'][data-call='heads']",
    action: "run-toss",
    title: "Step 4: Call heads",
    body: "Tap Heads to flip the coin. The result decides who chooses bat or bowl.",
  },
  {
    route: "toss",
    selector: "[data-action='choose-toss'][data-decision='bat']",
    action: "choose-toss",
    title: "Step 5: Choose batting first",
    body: "If you won the toss, tap Bat First. If the AI won, wait a moment and the guide will continue after its choice.",
  },
  {
    route: "lineup",
    selector: "[data-action='start-match']:not(:disabled)",
    action: "start-match",
    title: "Step 6: Start the match",
    body: "Tap Lock & Start Match. The default lineup is already good for your first game.",
  },
  {
    route: "match",
    selector: ".number-pad:not(.is-disabled) [data-action='pick-number']:not(:disabled)",
    action: "pick-number",
    title: "Step 7: Pick a number",
    body: "Tap any highlighted number. This secretly chooses your batting or bowling number.",
  },
  {
    route: "match",
    selector: ".number-pad:not(.is-disabled) [data-action='lock-number']:not(:disabled)",
    action: "lock-number",
    title: "Step 8: Lock your pick",
    body: "Tap Lock Pick. Both sides reveal together after the active picks are locked.",
  },
  {
    route: "match",
    selector: ".reveal-panel, .scoreboard",
    action: "",
    title: "Step 9: Read the reveal",
    body: "Different numbers score runs. Same numbers take a wicket. Keep playing balls until the match ends.",
    final: true,
  },
];

/**
 * @param {{ active?: boolean; step?: number } | null | undefined} coach
 * @param {string} route
 * @returns {(typeof GUIDED_COACH_STEPS)[number] & { index: number } | null}
 */
export function getGuidedCoachStep(coach, route) {
  if (!coach?.active) {
    return null;
  }

  const requestedIndex = Math.min(
    Math.max(Number(coach.step) || 0, 0),
    GUIDED_COACH_STEPS.length - 1,
  );

  const directStep = GUIDED_COACH_STEPS[requestedIndex];
  if (directStep?.route === route) {
    return { ...directStep, index: requestedIndex };
  }

  const forwardIndex = GUIDED_COACH_STEPS.findIndex((step, index) => index >= requestedIndex && step.route === route);
  if (forwardIndex >= 0) {
    return { ...GUIDED_COACH_STEPS[forwardIndex], index: forwardIndex };
  }

  const routeIndex = GUIDED_COACH_STEPS.findIndex((step) => step.route === route);
  if (routeIndex >= 0) {
    return { ...GUIDED_COACH_STEPS[routeIndex], index: routeIndex };
  }

  return { ...directStep, index: requestedIndex };
}

/**
 * @param {{ active?: boolean; step?: number } | null | undefined} coach
 * @param {string} route
 * @param {HTMLElement} target
 * @returns {boolean}
 */
export function isGuidedCoachTarget(coach, route, target) {
  const step = getGuidedCoachStep(coach, route);
  if (!step?.action || !target.dataset.action) {
    return false;
  }

  if (target.dataset.action !== step.action) {
    return false;
  }

  if (step.selector && !target.matches(step.selector)) {
    return false;
  }

  return true;
}

/**
 * @param {{ active?: boolean; step?: number } | null | undefined} coach
 * @param {string} route
 * @returns {string}
 */
export function renderGuidedCoach(coach, route) {
  const step = getGuidedCoachStep(coach, route);

  if (!step) {
    return "";
  }

  const isFinal = Boolean(step.final);
  return `
    <aside class="guided-coach" aria-live="polite" aria-label="Step by step first match coach">
      <div class="guided-coach__pointer" aria-hidden="true"></div>
      <div class="guided-coach__copy">
        <span class="guided-coach__badge">First match ${step.index + 1}/${GUIDED_COACH_STEPS.length}</span>
        <h3>${step.title}</h3>
        <p>${step.body}</p>
      </div>
      <div class="guided-coach__actions">
        <button class="btn btn--ghost btn--sm" data-action="coach-close">${isFinal ? "Finish Guide" : "Skip"}</button>
        ${
          isFinal
            ? ""
            : `<button class="btn btn--secondary btn--sm" data-action="coach-focus">Show Button</button>`
        }
      </div>
    </aside>
  `;
}
