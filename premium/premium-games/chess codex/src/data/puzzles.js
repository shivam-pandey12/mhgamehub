export const PUZZLE_DIFFICULTIES = ['all', 'easy', 'medium', 'hard'];

export const PUZZLES = [
  {
    id: 'mate-in-1-corner-net',
    title: 'Corner Net',
    description: 'Mate in 1',
    difficulty: 'easy',
    fen: '6k1/5ppp/8/8/8/6Q1/5PPP/6K1 w - - 0 1',
    solutionMoves: ['g3b8']
  },
  {
    id: 'mate-in-1-a-file-guillotine',
    title: 'A-File Guillotine',
    description: 'Mate in 1',
    difficulty: 'easy',
    fen: '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1',
    solutionMoves: ['a1a8']
  },
  {
    id: 'mate-in-1-diagonal-crown',
    title: 'Diagonal Crown',
    description: 'Mate in 1',
    difficulty: 'easy',
    fen: '1k6/2Q5/2K5/8/8/8/8/8 w - - 0 1',
    solutionMoves: ['c7b7']
  },
  {
    id: 'mate-in-2-knight-funnel',
    title: 'Knight Funnel',
    description: 'Mate in 2',
    difficulty: 'medium',
    fen: '2K5/2NQ4/8/k7/8/8/8/8 w - - 0 1',
    solutionMoves: ['c7d5', 'a5a6', 'd7a4']
  },
  {
    id: 'mate-in-2-quiet-net',
    title: 'Quiet Net',
    description: 'Mate in 2',
    difficulty: 'hard',
    fen: '8/8/4QB2/8/K7/8/k7/8 w - - 0 1',
    solutionMoves: ['e6e5', 'a2b1', 'e5b2']
  }
];

export function normalizePuzzleDifficulty(value = 'all') {
  return PUZZLE_DIFFICULTIES.includes(value) ? value : 'all';
}

export function getPuzzlePool(difficulty = 'all') {
  const normalizedDifficulty = normalizePuzzleDifficulty(difficulty);
  if (normalizedDifficulty === 'all') {
    return PUZZLES;
  }

  return PUZZLES.filter((puzzle) => puzzle.difficulty === normalizedDifficulty);
}

export function getDailyPuzzle(date = new Date()) {
  const seed = Number(`${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`);
  return PUZZLES[seed % PUZZLES.length];
}
