export const SOUND_LIBRARY = {
  uiClick: { type: 'sine', frequency: 520, duration: 0.055, gain: 0.035 },
  matchStart: { type: 'triangle', frequency: 330, duration: 0.32, gain: 0.065, sweep: 180 },
  shotRelease: { type: 'sawtooth', frequency: 155, duration: 0.13, gain: 0.06, sweep: 70 },
  collisionSoft: { type: 'triangle', frequency: 420, duration: 0.055, gain: 0.035 },
  collisionHard: { type: 'square', frequency: 260, duration: 0.075, gain: 0.045 },
  pocketCoin: { type: 'sine', frequency: 610, duration: 0.18, gain: 0.055, sweep: -220 },
  queenPocket: { type: 'triangle', frequency: 520, duration: 0.28, gain: 0.07, sweep: 190 },
  queenCovered: { type: 'sine', frequency: 740, duration: 0.34, gain: 0.07, sweep: 260 },
  queenReturned: { type: 'sawtooth', frequency: 220, duration: 0.2, gain: 0.055, sweep: -90 },
  foul: { type: 'square', frequency: 165, duration: 0.22, gain: 0.065, sweep: -55 },
  turnChange: { type: 'triangle', frequency: 440, duration: 0.16, gain: 0.045, sweep: 110 },
  win: { type: 'sine', frequency: 520, duration: 0.5, gain: 0.075, sweep: 340 },
  reset: { type: 'triangle', frequency: 280, duration: 0.14, gain: 0.04, sweep: 80 }
};
