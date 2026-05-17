import { Game } from "./game/Game.js";

const canvas = document.querySelector("#game");

if (!canvas) {
  throw new Error("Game canvas not found.");
}

const game = new Game({ canvas });
game.start();
