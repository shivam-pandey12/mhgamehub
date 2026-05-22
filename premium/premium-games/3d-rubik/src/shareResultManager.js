import { formatTime } from "./storage.js";

export function buildSolveShareText({
  puzzleLabel = "3x3",
  elapsedMs = 0,
  moveCount = 0,
  mode = "Free Solve"
} = {}) {
  return [
    "Twisty Puzzle 3D",
    `Solved ${puzzleLabel} in ${formatTime(elapsedMs)}`,
    `Moves: ${moveCount}`,
    `Mode: ${mode}`,
    "GameHub by MH Horizon"
  ].join("\n");
}

export function buildDailyShareText({
  challenge,
  elapsedMs = 0,
  moveCount = 0,
  streak = 0
} = {}) {
  const label = challenge?.label || challenge?.title || "Daily Challenge";
  return [
    "Twisty Puzzle 3D",
    label,
    `Date: ${challenge?.date || "--"}`,
    `Time: ${formatTime(elapsedMs)}`,
    `Moves: ${moveCount}`,
    `Streak: ${streak} day${streak === 1 ? "" : "s"}`,
    "GameHub by MH Horizon"
  ].join("\n");
}

export function buildWeeklyShareText({
  challenge,
  elapsedMs = 0,
  moveCount = 0
} = {}) {
  const label = challenge?.label || challenge?.title || "Weekly Challenge";
  return [
    "Twisty Puzzle 3D",
    label,
    `Week: ${challenge?.period || challenge?.week || "--"}`,
    `Time: ${formatTime(elapsedMs)}`,
    `Moves: ${moveCount}`,
    "GameHub by MH Horizon"
  ].join("\n");
}
