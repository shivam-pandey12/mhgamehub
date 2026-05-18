import { TILE_COUNT } from "./board.js";

export const DEFAULT_RULES = {
  extraTurnOnSix: true,
  exactFinish: true,
  startFromZero: true,
  autoCameraFollow: true,
  eventOverlays: true
};

export function mergeRules(savedRules = {}) {
  return {
    ...DEFAULT_RULES,
    ...Object.fromEntries(
      Object.entries(savedRules || {}).filter(([, value]) => typeof value === "boolean")
    )
  };
}

export function getStartPosition(rules) {
  return rules.startFromZero ? 0 : 1;
}

export function resolveRollTarget(position, roll, rules, tileCount = TILE_COUNT) {
  const rawTarget = position + roll;

  if (rawTarget <= tileCount) {
    return {
      allowed: true,
      target: rawTarget,
      clamped: false,
      needed: tileCount - position
    };
  }

  if (rules.exactFinish) {
    return {
      allowed: false,
      target: position,
      clamped: false,
      needed: tileCount - position
    };
  }

  return {
    allowed: true,
    target: tileCount,
    clamped: true,
    needed: 0
  };
}

export function getRuleRows(rules) {
  return [
    ["extraTurnOnSix", "Extra turn on 6", rules.extraTurnOnSix],
    ["exactFinish", "Exact finish required", rules.exactFinish],
    ["startFromZero", "Start from zone", rules.startFromZero],
    ["autoCameraFollow", "Auto camera follow", rules.autoCameraFollow],
    ["eventOverlays", "Event overlays", rules.eventOverlays]
  ];
}
