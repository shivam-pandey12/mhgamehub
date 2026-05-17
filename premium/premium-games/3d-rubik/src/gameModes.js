export const GAME_MODES = [
  {
    id: "free",
    title: "Free Solve",
    badge: "2x2-7x7",
    description: "Practice freely with scramble, undo, reset, hints, and any cube size.",
    compatibility: "All sizes"
  },
  {
    id: "timed",
    title: "Timed Challenge",
    badge: "2x2-7x7",
    description: "Start from a fresh legal scramble and chase your best local time.",
    compatibility: "All sizes"
  },
  {
    id: "guide",
    title: "Beginner Guide",
    badge: "2x2 + 3x3",
    description: "Step-by-step learning with honest support levels for each size.",
    compatibility: "Deep 3x3, simple 2x2"
  },
  {
    id: "missions",
    title: "Mission Mode",
    badge: "Local",
    description: "Focused objectives, move limits, timed runs, and pattern challenges.",
    compatibility: "Size-specific"
  },
  {
    id: "patterns",
    title: "Pattern Mode",
    badge: "Curated",
    description: "Apply classic cube patterns through real legal move sequences.",
    compatibility: "2x2-7x7"
  }
];

export function getMode(modeId) {
  return GAME_MODES.find((mode) => mode.id === modeId) || GAME_MODES[0];
}

export function getDefaultMode() {
  return GAME_MODES[0].id;
}
