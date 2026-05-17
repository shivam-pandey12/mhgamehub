export const PATTERNS = [
  {
    id: "checkerboard",
    title: "Checkerboard",
    difficulty: "Classic",
    description: "Alternating face centers and edges with clean double turns.",
    sizes: [2, 3, 4, 5, 6, 7],
    sequence: ["U2", "D2", "L2", "R2", "F2", "B2"]
  },
  {
    id: "cubeDot",
    title: "Dot Pattern",
    difficulty: "Showpiece",
    description: "A center-dot style pattern for odd cubes; even cubes get a balanced visual variant.",
    sizes: [3, 4, 5, 6, 7],
    sequence: ["F2", "B2", "U2", "D2", "R2", "L2"]
  },
  {
    id: "line",
    title: "Line Pattern",
    difficulty: "Easy",
    description: "A simple stripe-like pattern built from legal turns.",
    sizes: [2, 3, 4, 5, 6, 7],
    sequence: ["R2", "L2", "U", "D'", "F2", "B2"]
  }
];

export function getAvailablePatterns(size) {
  return PATTERNS.filter((pattern) => pattern.sizes.includes(size));
}

export function getPattern(patternId, size) {
  return getAvailablePatterns(size).find((pattern) => pattern.id === patternId) || getAvailablePatterns(size)[0] || null;
}
