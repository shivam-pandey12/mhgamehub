import { PLAYER_COLORS } from "./board.js";
import { BOT_PERSONALITIES, DEFAULT_BOT_PERSONALITY } from "./bots.js";

export const DEFAULT_BOT_NAMES = ["Ivory Bot", "Golden Bot", "Marble Bot", "Crown Bot"];
export const SETUP_PRESETS = ["twoHumans", "humanVsBot", "humanVsThreeBots", "fourHumans"];

export function createDefaultSetup() {
  return {
    playerCount: 2,
    slots: Array.from({ length: 4 }, (_, index) => createSlot(index))
  };
}

export function createSlot(index, overrides = {}) {
  return {
    type: "human",
    name: `Player ${index + 1}`,
    personality: DEFAULT_BOT_PERSONALITY,
    color: PLAYER_COLORS[index],
    ...overrides
  };
}

export function normalizeSetup(savedSetup = {}) {
  const fallback = createDefaultSetup();
  const playerCount = clampPlayerCount(savedSetup.playerCount ?? fallback.playerCount);
  const slots = Array.from({ length: 4 }, (_, index) => {
    const saved = savedSetup.slots?.[index] || {};
    const type = saved.type === "bot" ? "bot" : "human";
    const personality = BOT_PERSONALITIES[saved.personality] ? saved.personality : DEFAULT_BOT_PERSONALITY;
    return createSlot(index, {
      type,
      personality,
      name: String(saved.name || (type === "bot" ? DEFAULT_BOT_NAMES[index] : `Player ${index + 1}`)).slice(0, 24)
    });
  });

  return { playerCount, slots };
}

export function updatePlayerCount(setup, playerCount) {
  return {
    ...setup,
    playerCount: clampPlayerCount(playerCount),
    slots: normalizeSetup(setup).slots
  };
}

export function updateSlot(setup, index, updates) {
  const normalized = normalizeSetup(setup);
  const slots = normalized.slots.map((slot, slotIndex) => {
    if (slotIndex !== index) return slot;
    const nextType = updates.type || slot.type;
    const typeChanged = updates.type && updates.type !== slot.type;
    return {
      ...slot,
      ...updates,
      type: nextType,
      personality: nextType === "bot"
        ? (BOT_PERSONALITIES[updates.personality || slot.personality] ? updates.personality || slot.personality : DEFAULT_BOT_PERSONALITY)
        : DEFAULT_BOT_PERSONALITY,
      name: typeChanged
        ? (nextType === "bot" ? DEFAULT_BOT_NAMES[index] : `Player ${index + 1}`)
        : String(updates.name ?? slot.name).slice(0, 24)
    };
  });

  return {
    ...normalized,
    slots
  };
}

export function applySetupPreset(preset) {
  const setup = createDefaultSetup();
  if (preset === "humanVsBot") {
    return {
      playerCount: 2,
      slots: [
        createSlot(0),
        createSlot(1, { type: "bot", name: DEFAULT_BOT_NAMES[0], personality: "calm" }),
        createSlot(2),
        createSlot(3)
      ]
    };
  }

  if (preset === "humanVsThreeBots") {
    return {
      playerCount: 4,
      slots: [
        createSlot(0),
        createSlot(1, { type: "bot", name: DEFAULT_BOT_NAMES[0], personality: "calm" }),
        createSlot(2, { type: "bot", name: DEFAULT_BOT_NAMES[1], personality: "fast" }),
        createSlot(3, { type: "bot", name: DEFAULT_BOT_NAMES[2], personality: "rival" })
      ]
    };
  }

  if (preset === "fourHumans") {
    return {
      playerCount: 4,
      slots: Array.from({ length: 4 }, (_, index) => createSlot(index))
    };
  }

  return setup;
}

export function buildPlayersFromSetup(setup, startPosition) {
  const normalized = normalizeSetup(setup);
  const activeSlots = normalized.slots.slice(0, normalized.playerCount);
  const hasHuman = activeSlots.some((slot) => slot.type === "human");

  if (!hasHuman) {
    return {
      ok: false,
      message: "At least one human player is required.",
      players: []
    };
  }

  const names = normalizeNames(activeSlots);
  const players = activeSlots.map((slot, index) => ({
    id: `player-${index + 1}`,
    name: names[index],
    color: PLAYER_COLORS[index],
    type: slot.type,
    personality: slot.type === "bot" ? slot.personality : null,
    displayBadges: slot.type === "bot" ? ["BOT", getPersonalityLabel(slot.personality)] : [],
    position: startPosition
  }));

  return { ok: true, message: "", players };
}

export function getPersonalityLabel(personality) {
  return BOT_PERSONALITIES[personality]?.label || BOT_PERSONALITIES[DEFAULT_BOT_PERSONALITY].label;
}

function normalizeNames(slots) {
  const seen = new Map();
  return slots.map((slot, index) => {
    const fallback = slot.type === "bot" ? DEFAULT_BOT_NAMES[index] || `Bot ${index + 1}` : `Player ${index + 1}`;
    const base = String(slot.name || "").trim() || fallback;
    const key = base.toLowerCase();
    const count = seen.get(key) || 0;
    seen.set(key, count + 1);
    return count === 0 ? base : `${base} ${count + 1}`;
  });
}

function clampPlayerCount(count) {
  return Math.min(4, Math.max(2, Number(count) || 2));
}
