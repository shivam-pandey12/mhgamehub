export const BOT_PERSONALITIES = {
  calm: {
    label: "Calm Bot",
    delay: [1050, 1450],
    thinking: "is considering the board.",
    rollVerb: "rolls with royal patience."
  },
  fast: {
    label: "Fast Bot",
    delay: [520, 820],
    thinking: "is ready to move.",
    rollVerb: "snaps the dice forward."
  },
  dramatic: {
    label: "Dramatic Bot",
    delay: [1350, 1950],
    thinking: "is letting the tension rise.",
    rollVerb: "makes the table wait."
  },
  lucky: {
    label: "Lucky Bot",
    delay: [800, 1180],
    thinking: "believes the crown is close.",
    rollVerb: "trusts the marble winds."
  },
  rival: {
    label: "Rival Bot",
    delay: [900, 1300],
    thinking: "is eyeing the crown.",
    rollVerb: "wants that ladder."
  }
};

export const DEFAULT_BOT_PERSONALITY = "calm";

export function getPersonality(personality) {
  return BOT_PERSONALITIES[personality] || BOT_PERSONALITIES[DEFAULT_BOT_PERSONALITY];
}

export function getBotDelay(personality) {
  const [min, max] = getPersonality(personality).delay;
  return Math.round(min + Math.random() * (max - min));
}

export function getBotThinkingText(player) {
  const personality = getPersonality(player.personality);
  return `${player.name} ${personality.thinking}`;
}

export function getBotFlavorLine(player, eventType) {
  const personality = getPersonality(player.personality);
  if (eventType === "roll") return `${player.name} ${personality.rollVerb}`;
  if (eventType === "ladder" && player.personality === "dramatic") return `${player.name} rises like a royal comeback.`;
  if (eventType === "snake" && player.personality === "rival") return `${player.name} is not done with the crown yet.`;
  if (eventType === "extra" && player.personality === "lucky") return `${player.name} smiles at another chance.`;
  if (eventType === "warning" && player.personality === "calm") return `${player.name} waits for the exact finish.`;
  return "";
}

export class BotTurnController {
  constructor({ onStatusChange, onReady }) {
    this.onStatusChange = onStatusChange;
    this.onReady = onReady;
    this.timerId = null;
    this.sequence = 0;
    this.playerId = null;
  }

  cancel() {
    if (this.timerId) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.sequence += 1;
    this.playerId = null;
    this.onStatusChange?.({ active: false, playerId: null, text: "" });
  }

  schedule(player, options = {}) {
    if (!player || player.type !== "bot") return;
    if (this.playerId === player.id && this.timerId) return;
    this.cancel();

    const sequence = this.sequence;
    this.playerId = player.id;
    this.onStatusChange?.({
      active: true,
      playerId: player.id,
      text: "Bot is thinking...",
      detail: getBotThinkingText(player)
    });

    const delay = Math.max(320, Math.round(getBotDelay(player.personality) * (options.delayScale || 1)));
    this.timerId = window.setTimeout(() => {
      if (sequence !== this.sequence) return;
      this.timerId = null;
      this.onReady?.(player, sequence);
    }, delay);
  }
}
