export const GHOST_SAMPLE_LIMIT = 220;
export const GHOST_SAMPLE_INTERVAL = 0.12;

export function createGhostRecorder(levelId) {
  return {
    levelId,
    elapsed: 0,
    samples: []
  };
}

export function sampleGhost(recorder, position, delta) {
  if (!recorder || recorder.samples.length >= GHOST_SAMPLE_LIMIT) return;
  recorder.elapsed += delta;
  if (recorder.elapsed < GHOST_SAMPLE_INTERVAL && recorder.samples.length > 0) return;
  recorder.elapsed = 0;
  recorder.samples.push({
    x: Number(position.x.toFixed(3)),
    z: Number(position.y.toFixed(3))
  });
}

export function makeGhostRecord(levelId, shots, penalties, samples) {
  return {
    levelId,
    shots,
    penalties,
    samples: samples.slice(0, GHOST_SAMPLE_LIMIT),
    date: new Date().toISOString()
  };
}
