import { Howl } from "howler";

const SAMPLE_RATE = 22050;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function createWavDataUri(sampleGenerator, durationSeconds) {
  const sampleCount = Math.floor(durationSeconds * SAMPLE_RATE);
  const pcm = new Int16Array(sampleCount);

  for (let i = 0; i < sampleCount; i += 1) {
    const t = i / SAMPLE_RATE;
    const amplitude = clamp(sampleGenerator(t, i, sampleCount), -1, 1);
    pcm[i] = Math.floor(amplitude * 32767);
  }

  const byteLength = 44 + pcm.byteLength;
  const buffer = new ArrayBuffer(byteLength);
  const view = new DataView(buffer);

  const writeString = (offset, text) => {
    for (let i = 0; i < text.length; i += 1) {
      view.setUint8(offset + i, text.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + pcm.byteLength, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, pcm.byteLength, true);

  let offset = 44;
  for (let i = 0; i < pcm.length; i += 1) {
    view.setInt16(offset, pcm[i], true);
    offset += 2;
  }

  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }

  return `data:audio/wav;base64,${btoa(binary)}`;
}

function engineLoopSample(time) {
  const fundamental = 96;
  const harmonic = 192;
  const third = 288;
  const rumble =
    Math.sin(time * Math.PI * 2 * fundamental) * 0.62 +
    Math.sin(time * Math.PI * 2 * harmonic) * 0.24 +
    Math.sin(time * Math.PI * 2 * third) * 0.14;

  return rumble * 0.38;
}

function brakeSample(time, index, total) {
  const progress = index / total;
  const startFrequency = 620;
  const endFrequency = 140;
  const frequency = startFrequency + (endFrequency - startFrequency) * progress;
  const envelope = Math.sin(Math.PI * progress) ** 1.6;
  return Math.sin(time * Math.PI * 2 * frequency) * envelope * 0.38;
}

function crashSample(time, index, total) {
  const progress = index / total;
  const envelope = (1 - progress) ** 1.8;
  const noise = (Math.random() * 2 - 1) * envelope;
  const metallic = Math.sin(time * Math.PI * 2 * 220) * envelope * 0.22;
  return (noise * 0.72 + metallic) * 0.8;
}

function successSample(time, index, total) {
  const progress = index / total;
  const envelope = Math.sin(Math.PI * progress);
  const frequency = progress < 0.5 ? 420 : 560;
  return Math.sin(time * Math.PI * 2 * frequency) * envelope * 0.3;
}

function skidLoopSample(time) {
  const flutter = 0.7 + Math.sin(time * Math.PI * 2 * 5.4) * 0.18;
  const squeal =
    Math.sin(time * Math.PI * 2 * 780 + Math.sin(time * Math.PI * 2 * 17) * 1.2) * 0.32 +
    Math.sin(time * Math.PI * 2 * 420) * 0.16;
  const grit = (Math.random() * 2 - 1) * 0.22;
  return (squeal + grit) * flutter * 0.68;
}

export function createSoundBank() {
  const engineUri = createWavDataUri(engineLoopSample, 1);
  const brakeUri = createWavDataUri(brakeSample, 0.24);
  const crashUri = createWavDataUri(crashSample, 0.48);
  const successUri = createWavDataUri(successSample, 0.4);
  const skidUri = createWavDataUri(skidLoopSample, 0.72);

  return {
    engine: new Howl({
      src: [engineUri],
      loop: true,
      volume: 0.12,
      preload: true,
    }),
    brake: new Howl({
      src: [brakeUri],
      volume: 0.28,
      preload: true,
    }),
    crash: new Howl({
      src: [crashUri],
      volume: 0.48,
      preload: true,
    }),
    success: new Howl({
      src: [successUri],
      volume: 0.3,
      preload: true,
    }),
    skid: new Howl({
      src: [skidUri],
      loop: true,
      volume: 0.08,
      preload: true,
    }),
  };
}
