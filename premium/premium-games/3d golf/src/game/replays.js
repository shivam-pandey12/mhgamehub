export const REPLAY_SAMPLE_LIMIT = 180;
export const REPLAY_SAMPLE_INTERVAL = 0.08;

export function createShotReplay({ levelId, packId, direction, power }) {
  return {
    levelId,
    packId,
    direction: { x: Number(direction.x.toFixed(4)), z: Number(direction.y.toFixed(4)) },
    power: Number(power.toFixed(3)),
    elapsed: 0,
    samples: []
  };
}

export function sampleShotReplay(recorder, position, delta) {
  if (!recorder || recorder.samples.length >= REPLAY_SAMPLE_LIMIT) return;
  recorder.elapsed += delta;
  if (recorder.elapsed < REPLAY_SAMPLE_INTERVAL && recorder.samples.length > 0) return;
  recorder.elapsed = 0;
  recorder.samples.push({
    x: Number(position.x.toFixed(3)),
    z: Number(position.y.toFixed(3))
  });
}

export function finalizeShotReplay(recorder, result) {
  if (!recorder?.samples?.length) return null;
  return {
    levelId: recorder.levelId,
    packId: recorder.packId,
    direction: recorder.direction,
    power: recorder.power,
    result: {
      shots: result.shots,
      penalties: result.penalties,
      stars: result.stars
    },
    success: true,
    samples: recorder.samples.slice(0, REPLAY_SAMPLE_LIMIT),
    date: new Date().toISOString()
  };
}
