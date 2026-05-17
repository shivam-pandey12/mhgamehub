export const ACHIEVEMENTS = [
  { id: 'first-putt', title: 'First Putt', description: 'Take your first shot.' },
  { id: 'first-cup', title: 'First Cup', description: 'Finish your first hole.' },
  { id: 'first-ace', title: 'First Hole-in-One', description: 'Score a hole-in-one.' },
  { id: 'under-par', title: 'Under Par', description: 'Finish a hole under par.' },
  { id: 'stars-10', title: '10 Stars Collected', description: 'Collect 10 total stars.', target: 10 },
  { id: 'stars-25', title: '25 Stars Collected', description: 'Collect 25 total stars.', target: 25 },
  { id: 'no-wall-touch', title: 'No Wall Touch', description: 'Finish a hole without wall contact.' },
  { id: 'bounce-master', title: 'Bounce Master', description: 'Score after using a bounce pad.' },
  { id: 'speed-runner', title: 'Speed Runner', description: 'Finish a time trial hole in under 45 seconds.' },
  { id: 'perfect-3', title: 'Perfect 3-Hole Course', description: 'Earn 9 stars in a 3-hole run.' },
  { id: 'sand-survivor', title: 'Sand Survivor', description: 'Score after rolling through sand.' },
  { id: 'boost-shot', title: 'Boost Shot', description: 'Trigger a boost zone.' },
  { id: 'bridge-clear', title: 'Narrow Bridge Clear', description: 'Finish a bridge level without falling.' },
  { id: 'beat-easy-bot', title: 'Beat Easy Bot', description: 'Win a match against Easy bot.' },
  { id: 'beat-normal-bot', title: 'Beat Normal Bot', description: 'Win a match against Normal bot.' },
  { id: 'beat-hard-bot', title: 'Beat Hard Bot', description: 'Win a match against Hard bot.' }
];

export function getAchievement(id) {
  return ACHIEVEMENTS.find((achievement) => achievement.id === id);
}
