export const CHALLENGES = [
  {
    id: 'level-1-ace',
    title: 'Royal Opening Ace',
    objective: 'Complete Level 1 in one shot.',
    levelId: 1,
    isMet: ({ result }) => result.levelId === 1 && result.shots === 1
  },
  {
    id: 'no-wall-touch',
    title: 'Silk Touch',
    objective: 'Complete any level without touching walls or obstacles.',
    levelId: 1,
    isMet: ({ session }) => session.flags.noWallTouch
  },
  {
    id: 'under-par',
    title: 'Under The Crown',
    objective: 'Complete any level under par.',
    levelId: 2,
    isMet: ({ result, level }) => result.shots + result.penalties < level.par
  },
  {
    id: 'bounce-score',
    title: 'Bounce Master Trial',
    objective: 'Use a bounce pad and still finish the hole.',
    levelId: 9,
    isMet: ({ session }) => session.flags.usedBouncePad
  },
  {
    id: 'no-aim-assist',
    title: 'Pure Read',
    objective: 'Complete any level with aim assist disabled.',
    levelId: 5,
    isMet: ({ session }) => !session.flags.aimAssistAtStart
  },
  {
    id: 'two-shot-max',
    title: 'Two Stroke Velvet',
    objective: 'Complete any level in 2 shots or fewer.',
    levelId: 4,
    isMet: ({ result }) => result.shots <= 2
  },
  {
    id: 'bridge-no-fall',
    title: 'Bridge Etiquette',
    objective: 'Complete a narrow bridge level without falling.',
    levelId: 3,
    isMet: ({ result, session }) => [3, 10, 19].includes(result.levelId) && !session.flags.fellOut
  },
  {
    id: 'three-hole-under',
    title: 'Garden Sprint',
    objective: 'Finish 3 holes with total adjusted score under total par.',
    courseLength: 3,
    isMet: ({ session }) => {
      const shots = session.holes.reduce((sum, hole) => sum + hole.shots, 0);
      const penalties = session.holes.reduce((sum, hole) => sum + hole.penalties, 0);
      const par = session.holes.reduce((sum, hole) => sum + hole.par, 0);
      return session.holes.length >= 3 && shots + penalties < par;
    }
  }
];

export function getChallenge(id) {
  return CHALLENGES.find((challenge) => challenge.id === id) ?? CHALLENGES[0];
}
