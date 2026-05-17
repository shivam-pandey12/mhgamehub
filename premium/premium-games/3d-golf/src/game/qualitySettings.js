export const QUALITY_PRESETS = {
  low: {
    label: 'Low',
    pixelRatio: 1,
    shadowMapSize: 512,
    particles: 0.45,
    trailSamples: 16,
    decorationDensity: 0.45
  },
  medium: {
    label: 'Medium',
    pixelRatio: 1.35,
    shadowMapSize: 1024,
    particles: 0.75,
    trailSamples: 24,
    decorationDensity: 0.75
  },
  high: {
    label: 'High',
    pixelRatio: 1.8,
    shadowMapSize: 1536,
    particles: 1,
    trailSamples: 34,
    decorationDensity: 1
  }
};

export function normalizeQuality(value) {
  return QUALITY_PRESETS[value] ? value : 'high';
}

export function suggestedQuality() {
  const mobile = matchMedia?.('(max-width: 820px), (pointer: coarse)')?.matches;
  return mobile ? 'medium' : 'high';
}
