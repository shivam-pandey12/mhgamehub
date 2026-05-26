const SOUND_TYPES = new Set([
  'dice',
  'dice-result',
  'move',
  'land',
  'capture',
  'safe',
  'home-entry',
  'home',
  'turn',
  'bot-turn',
  'match-start',
  'ui-click',
  'ui-open',
  'ui-confirm',
  'ui-cancel',
  'copy',
  'room-join',
  'room-leave',
  'room-ready',
  'timer-beep',
  'win',
  'invalid'
]);

const SOUND_ASSETS = {
  dice: new URL('../../sounds/roll_dice.mp3', import.meta.url).href,
  move: new URL('../../sounds/movement.mp3', import.meta.url).href
};

const SAMPLE_CONFIG = {
  dice: {
    maxDuration: 0.92,
    poolSize: 3,
    volumeMultiplier: 0.96
  },
  move: {
    volumeMultiplier: 0.92
  }
};

let muted = false;
let volume = 0.72;
let samplesPreloaded = false;
const sampleBuffers = new Map();
const sampleBufferPromises = new Map();

export function setAudioMuted(value) {
  muted = Boolean(value);
  preloadSampleSounds();
}

export function setAudioVolume(value) {
  const numeric = Number(value);
  volume = Number.isFinite(numeric) ? Math.max(0, Math.min(1, numeric)) : 0.72;
  preloadSampleSounds();
}

function getAudioContext() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return null;
    }
    const audioContext = window.__ludoAudioContext || new AudioContextClass();
    window.__ludoAudioContext = audioContext;
    if (audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }
    return audioContext;
  } catch {
    return null;
  }
}

function preloadSampleSounds() {
  if (samplesPreloaded || typeof window === 'undefined') {
    return;
  }

  samplesPreloaded = true;
  Object.keys(SOUND_ASSETS).forEach((type) => {
    loadSampleBuffer(type);
  });
}

function loadSampleBuffer(type) {
  if (sampleBuffers.has(type)) {
    return Promise.resolve(sampleBuffers.get(type));
  }

  if (sampleBufferPromises.has(type)) {
    return sampleBufferPromises.get(type);
  }

  const audioContext = getAudioContext();
  const source = SOUND_ASSETS[type];
  if (!audioContext || !source || typeof fetch === 'undefined') {
    return Promise.resolve(null);
  }

  const promise = fetch(source)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to load ${type} sound`);
      }
      return response.arrayBuffer();
    })
    .then((buffer) => audioContext.decodeAudioData(buffer))
    .then((decoded) => {
      sampleBuffers.set(type, decoded);
      return decoded;
    })
    .catch(() => null);

  sampleBufferPromises.set(type, promise);
  return promise;
}

function playSampleSound(type) {
  if (!SOUND_ASSETS[type]) {
    return false;
  }

  try {
    preloadSampleSounds();
    const audioContext = getAudioContext();
    const buffer = sampleBuffers.get(type);
    if (!audioContext || !buffer) {
      loadSampleBuffer(type);
      return false;
    }

    const config = SAMPLE_CONFIG[type] || {};
    const source = audioContext.createBufferSource();
    const gain = audioContext.createGain();
    const startAt = audioContext.currentTime;

    source.buffer = buffer;
    gain.gain.setValueAtTime(Math.max(0, Math.min(1, volume * (config.volumeMultiplier || 1))), startAt);
    source.connect(gain);
    gain.connect(audioContext.destination);
    source.start(startAt);

    if (Number.isFinite(config.maxDuration) && config.maxDuration > 0 && config.maxDuration < buffer.duration) {
      source.stop(startAt + config.maxDuration);
    }
    return true;
  } catch {
    return false;
  }
}

export function playSound(type) {
  if (muted || volume <= 0 || !SOUND_TYPES.has(type)) {
    return;
  }

  if ((type === 'dice' || type === 'move') && playSampleSound(type)) {
    return;
  }

  try {
    const audioContext = getAudioContext();
    if (!audioContext) {
      return;
    }

    const now = audioContext.currentTime;
    const config = {
      dice: [[310, 0.07, 0.024, 'sine'], [410, 0.05, 0.012, 'triangle', 0.035]],
      'dice-result': [[520, 0.09, 0.025, 'sine'], [680, 0.08, 0.014, 'sine', 0.04]],
      move: [[420, 0.035, 0.016, 'sine']],
      land: [[260, 0.055, 0.018, 'triangle']],
      capture: [[170, 0.13, 0.04, 'triangle'], [250, 0.08, 0.018, 'sawtooth', 0.035]],
      safe: [[470, 0.12, 0.022, 'sine'], [620, 0.1, 0.012, 'sine', 0.045]],
      'home-entry': [[510, 0.13, 0.026, 'sine'], [690, 0.12, 0.014, 'sine', 0.055]],
      home: [[590, 0.16, 0.034, 'sine'], [780, 0.14, 0.018, 'sine', 0.07]],
      turn: [[390, 0.07, 0.018, 'sine']],
      'bot-turn': [[340, 0.08, 0.018, 'sine'], [290, 0.06, 0.01, 'triangle', 0.045]],
      'match-start': [[420, 0.12, 0.02, 'sine'], [560, 0.14, 0.018, 'sine', 0.08]],
      'ui-click': [[620, 0.035, 0.008, 'sine']],
      'ui-open': [[430, 0.08, 0.014, 'sine'], [560, 0.08, 0.01, 'sine', 0.04]],
      'ui-confirm': [[560, 0.07, 0.016, 'sine'], [720, 0.08, 0.012, 'sine', 0.045]],
      'ui-cancel': [[210, 0.07, 0.012, 'triangle']],
      copy: [[650, 0.08, 0.014, 'sine']],
      'room-join': [[440, 0.1, 0.018, 'sine'], [590, 0.1, 0.012, 'sine', 0.06]],
      'room-leave': [[260, 0.11, 0.018, 'triangle'], [190, 0.08, 0.01, 'sine', 0.055]],
      'room-ready': [[510, 0.08, 0.016, 'sine']],
      'timer-beep': [[880, 0.075, 0.02, 'square']],
      win: [[660, 0.26, 0.046, 'sine', 0, 1.42], [880, 0.24, 0.022, 'sine', 0.1, 1.18]],
      invalid: [[130, 0.09, 0.02, 'triangle']]
    }[type];

    config.forEach(([frequency, duration, gainValue, waveform, delay = 0, rampMultiplier = 1]) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const startAt = now + delay;
      oscillator.frequency.setValueAtTime(frequency, startAt);
      if (rampMultiplier !== 1) {
        oscillator.frequency.exponentialRampToValueAtTime(frequency * rampMultiplier, startAt + duration * 0.72);
      }
      oscillator.type = waveform;
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(gainValue * volume, startAt + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(startAt);
      oscillator.stop(startAt + duration + 0.02);
    });
  } catch {
    // Audio is optional. The game must remain playable if the browser blocks it.
  }
}
