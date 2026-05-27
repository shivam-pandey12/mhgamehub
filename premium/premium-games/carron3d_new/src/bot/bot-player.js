import { getBotDifficultyProfile, normalizeBotDifficulty } from './bot-difficulty.js';

export class BotPlayer {
  constructor(player, difficulty = 'normal') {
    this.id = player?.id || 'player-2';
    this.name = player?.name || 'Royal Bot';
    this.color = player?.color || null;
    this.difficulty = normalizeBotDifficulty(difficulty || player?.difficulty);
    this.profile = getBotDifficultyProfile(this.difficulty);
  }

  update(player, difficulty = this.difficulty) {
    this.id = player?.id || this.id;
    this.name = player?.name || this.name;
    this.color = player?.color || null;
    this.difficulty = normalizeBotDifficulty(difficulty);
    this.profile = getBotDifficultyProfile(this.difficulty);
    return this;
  }
}
