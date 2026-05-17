(() => {
const __bundle = Object.create(null);
(() => {
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

class SoundEngine {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.noiseBuffer = null;
    this.cooldowns = new Map();
    this.mediaPools = new Map();
    this.singleMedia = new Map();
    this.unlockListenersInstalled = false;
    this.managedMediaWarmed = false;
    this.preloadManagedMedia();
    this.installUnlockListeners();
  }

  preloadManagedMedia() {
    if (typeof Audio === "undefined") {
      return;
    }

    this.getMediaPool("explosion-media", {
      src: "./src/audio/explosion.mp3",
      poolSize: 5,
      volume: 0.6,
    });
  }

  installUnlockListeners() {
    if (this.unlockListenersInstalled || typeof window === "undefined") {
      return;
    }

    this.unlockListenersInstalled = true;
    const unlock = () => {
      const context = this.ensureContext();

      if (context && context.state !== "running") {
        context.resume().catch(() => {});
      }

      this.warmManagedMedia();
    };

    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("keydown", unlock, { passive: true });
    window.addEventListener("touchstart", unlock, { passive: true });
  }

  ensureContext() {
    if (typeof window === "undefined") {
      return null;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      return null;
    }

    if (!this.audioContext) {
      this.audioContext = new AudioContextClass();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.24;
      this.masterGain.connect(this.audioContext.destination);
    }

    return this.audioContext;
  }

  warmManagedMedia() {
    if (this.managedMediaWarmed || typeof Audio === "undefined") {
      return;
    }

    this.managedMediaWarmed = true;

    for (const media of this.singleMedia.values()) {
      const { audio } = media;
      try {
        audio.load();
      } catch {}
    }
  }

  getNoiseBuffer(context) {
    if (this.noiseBuffer) {
      return this.noiseBuffer;
    }

    const sampleRate = context.sampleRate;
    const buffer = context.createBuffer(1, sampleRate, sampleRate);
    const channelData = buffer.getChannelData(0);

    for (let index = 0; index < channelData.length; index += 1) {
      channelData[index] = Math.random() * 2 - 1;
    }

    this.noiseBuffer = buffer;
    return buffer;
  }

  now(context) {
    if (context) {
      return context.currentTime;
    }

    if (typeof performance !== "undefined" && typeof performance.now === "function") {
      return performance.now() / 1000;
    }

    return Date.now() / 1000;
  }

  canPlay(tag, minInterval, context) {
    if (!tag || minInterval <= 0) {
      return true;
    }

    const currentTime = this.now(context);
    const previousTime = this.cooldowns.get(tag) ?? -Infinity;

    if (currentTime - previousTime < minInterval) {
      return false;
    }

    this.cooldowns.set(tag, currentTime);
    return true;
  }

  getMediaPool(key, {
    src,
    poolSize = 6,
    volume = 0.5,
  } = {}) {
    if (this.mediaPools.has(key)) {
      return this.mediaPools.get(key);
    }

    if (typeof Audio === "undefined") {
      return null;
    }

    const entries = [];

    for (let index = 0; index < poolSize; index += 1) {
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.volume = volume;
      audio.playsInline = true;
      audio.addEventListener("error", () => {
        pool.broken = true;
      });
      entries.push(audio);
    }

    const pool = {
      entries,
      nextIndex: 0,
      src,
      volume,
      broken: false,
    };

    this.mediaPools.set(key, pool);
    return pool;
  }

  getSingleMedia(key, {
    src,
    volume = 0.5,
  } = {}) {
    if (this.singleMedia.has(key)) {
      return this.singleMedia.get(key);
    }

    if (typeof Audio === "undefined") {
      return null;
    }

    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = volume;
    audio.playsInline = true;

    const media = {
      audio,
      src,
      volume,
      broken: false,
    };

    audio.addEventListener("error", () => {
      media.broken = true;
    });

    this.singleMedia.set(key, media);
    return media;
  }

  playMediaAsset(key, {
    src,
    poolSize = 6,
    volume = 0.5,
    playbackRate = 1,
    minInterval = 0,
    currentTime = 0,
  } = {}) {
    const context = this.audioContext;

    if (!this.canPlay(key, minInterval, context)) {
      return true;
    }

    const pool = this.getMediaPool(key, { src, poolSize, volume });

    if (!pool || pool.broken || pool.entries.length === 0) {
      return false;
    }

    let audio = pool.entries.find((entry) => entry.paused || entry.ended);

    if (!audio) {
      audio = pool.entries[pool.nextIndex % pool.entries.length];
      pool.nextIndex += 1;
    }

    audio.pause();
    audio.currentTime = currentTime;
    audio.volume = volume;
    audio.playbackRate = playbackRate;

    const playPromise = audio.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }

    return true;
  }

  playBurstMediaAsset(key, {
    src,
    poolSize = 6,
    volume = 0.5,
    playbackRate = 1,
    minInterval = 0,
    currentTime = 0,
    burstDuration = 0.14,
  } = {}) {
    const context = this.audioContext;

    if (!this.canPlay(key, minInterval, context)) {
      return true;
    }

    const pool = this.getMediaPool(key, { src, poolSize, volume });

    if (!pool || pool.broken || pool.entries.length === 0) {
      return false;
    }

    let audio = pool.entries.find((entry) => entry.paused || entry.ended);

    if (!audio) {
      audio = pool.entries[pool.nextIndex % pool.entries.length];
      pool.nextIndex += 1;
    }

    if (audio._burstTimeoutId) {
      clearTimeout(audio._burstTimeoutId);
      audio._burstTimeoutId = null;
    }

    audio.pause();

    try {
      audio.currentTime = currentTime;
    } catch {}

    audio.muted = false;
    audio.loop = false;
    audio.volume = volume;
    audio.playbackRate = playbackRate;

    const playPromise = audio.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }

    const burstMs = Math.max(40, burstDuration * 1000);
    audio._burstTimeoutId = setTimeout(() => {
      audio.pause();

      try {
        audio.currentTime = 0;
      } catch {}

      audio._burstTimeoutId = null;
    }, burstMs);

    return true;
  }

  restartSingleMedia(key, {
    src,
    volume = 0.5,
    playbackRate = 1,
    startTime = 0,
    loop = false,
  } = {}) {
    const media = this.getSingleMedia(key, { src, volume });

    if (!media || media.broken) {
      return false;
    }

    const { audio } = media;
    const shouldRestart = audio.paused || audio.ended || Math.abs(audio.playbackRate - playbackRate) > 0.001;

    if (shouldRestart) {
      audio.pause();

      try {
        audio.currentTime = startTime;
      } catch {}
    }

    audio.muted = false;
    audio.loop = loop;
    audio.volume = volume;
    audio.playbackRate = playbackRate;
    const playPromise = audio.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }

    return true;
  }

  stopSingleMedia(key, { resetToStart = true } = {}) {
    const media = this.singleMedia.get(key);

    if (!media || media.broken) {
      return false;
    }

    const { audio } = media;

    if (!audio.paused) {
      audio.pause();
    }

    if (resetToStart) {
      try {
        audio.currentTime = 0;
      } catch {}
    }

    audio.loop = false;

    return true;
  }

  createOutputChain(context, volume, pan = 0, filterConfig = null) {
    const envelope = context.createGain();
    envelope.gain.value = 0.0001;

    let tailNode = envelope;

    if (filterConfig) {
      const filter = context.createBiquadFilter();
      filter.type = filterConfig.type ?? "lowpass";
      filter.frequency.value = filterConfig.frequency ?? 1200;
      filter.Q.value = filterConfig.q ?? 0.001;
      tailNode.connect(filter);
      tailNode = filter;
    }

    if (context.createStereoPanner) {
      const panner = context.createStereoPanner();
      panner.pan.value = clamp(pan, -1, 1);
      tailNode.connect(panner);
      tailNode = panner;
    }

    const gain = context.createGain();
    gain.gain.value = volume;
    tailNode.connect(gain);
    gain.connect(this.masterGain);

    return envelope;
  }

  scheduleEnvelope(envelope, startTime, attack, peak, duration, release = 0.04) {
    const peakGain = Math.max(0.0001, peak);
    const attackTime = Math.max(0.001, attack);
    const holdEndTime = Math.max(startTime + attackTime, startTime + duration);
    const endTime = holdEndTime + Math.max(0.015, release);

    envelope.gain.cancelScheduledValues(startTime);
    envelope.gain.setValueAtTime(0.0001, startTime);
    envelope.gain.exponentialRampToValueAtTime(peakGain, startTime + attackTime);
    envelope.gain.exponentialRampToValueAtTime(0.0001, endTime);

    return endTime;
  }

  playSweep({
    tag,
    minInterval = 0,
    type = "sine",
    frequencyStart = 440,
    frequencyEnd = frequencyStart,
    duration = 0.12,
    attack = 0.004,
    volume = 0.1,
    pan = 0,
    timeOffset = 0,
    detuneStart = 0,
    detuneEnd = detuneStart,
    harmonics = [],
    filter = null,
  } = {}) {
    const context = this.ensureContext();

    if (!context || !this.canPlay(tag, minInterval, context)) {
      return;
    }

    const startTime = this.now(context) + Math.max(0, timeOffset);
    const envelope = this.createOutputChain(context, volume, pan, filter);
    const oscillators = [];

    const createOscillator = (frequency, detune, oscillatorType) => {
      const oscillator = context.createOscillator();
      oscillator.type = oscillatorType;
      oscillator.frequency.setValueAtTime(frequencyStart * frequency, startTime);
      oscillator.frequency.linearRampToValueAtTime(frequencyEnd * frequency, startTime + duration);
      oscillator.detune.setValueAtTime(detuneStart + detune, startTime);
      oscillator.detune.linearRampToValueAtTime(detuneEnd + detune, startTime + duration);
      oscillator.connect(envelope);
      oscillators.push(oscillator);
      return oscillator;
    };

    createOscillator(1, 0, type);

    for (const harmonic of harmonics) {
      createOscillator(
        harmonic.ratio ?? 1,
        harmonic.detune ?? 0,
        harmonic.type ?? type,
      );
    }

    const endTime = this.scheduleEnvelope(envelope, startTime, attack, 1, duration, duration * 0.35);

    for (const oscillator of oscillators) {
      oscillator.start(startTime);
      oscillator.stop(endTime);
    }
  }

  playNoiseBurst({
    tag,
    minInterval = 0,
    duration = 0.14,
    attack = 0.002,
    volume = 0.08,
    pan = 0,
    timeOffset = 0,
    playbackRateStart = 1,
    playbackRateEnd = playbackRateStart,
    filter = null,
  } = {}) {
    const context = this.ensureContext();

    if (!context || !this.canPlay(tag, minInterval, context)) {
      return;
    }

    const startTime = this.now(context) + Math.max(0, timeOffset);
    const envelope = this.createOutputChain(context, volume, pan, filter);
    const source = context.createBufferSource();
    source.buffer = this.getNoiseBuffer(context);
    source.playbackRate.setValueAtTime(playbackRateStart, startTime);
    source.playbackRate.linearRampToValueAtTime(playbackRateEnd, startTime + duration);
    source.connect(envelope);

    const endTime = this.scheduleEnvelope(envelope, startTime, attack, 1, duration, duration * 0.45);
    source.start(startTime);
    source.stop(endTime);
  }

  playEngineSound() {
    this.playSweep({
      tag: "engine",
      minInterval: 0.12,
      type: "sawtooth",
      frequencyStart: 72,
      frequencyEnd: 94,
      duration: 0.16,
      volume: 0.05,
      attack: 0.01,
      harmonics: [
        { ratio: 2, detune: 6, type: "triangle" },
      ],
      filter: { type: "lowpass", frequency: 360, q: 0.4 },
    });
  }

  playBoostSound() {
    this.playSweep({
      tag: "boost",
      minInterval: 0.24,
      type: "sawtooth",
      frequencyStart: 126,
      frequencyEnd: 312,
      duration: 0.24,
      volume: 0.085,
      attack: 0.006,
      harmonics: [
        { ratio: 0.5, detune: -8, type: "triangle" },
      ],
      filter: { type: "lowpass", frequency: 980, q: 0.5 },
    });
    this.playNoiseBurst({
      duration: 0.14,
      volume: 0.055,
      playbackRateStart: 1.5,
      playbackRateEnd: 0.7,
      filter: { type: "highpass", frequency: 420, q: 0.4 },
    });
  }

  playShootTransient() {
    const pan = Math.random() * 0.16 - 0.08;

    this.playSweep({
      tag: "shoot-transient",
      minInterval: 0.024,
      type: "square",
      frequencyStart: 1240,
      frequencyEnd: 410,
      duration: 0.045,
      volume: 0.078,
      attack: 0.0015,
      pan,
      harmonics: [
        { ratio: 1.8, detune: 4, type: "triangle" },
      ],
      filter: { type: "bandpass", frequency: 2100, q: 2.8 },
    });
    this.playNoiseBurst({
      duration: 0.032,
      volume: 0.034,
      pan,
      playbackRateStart: 2.6,
      playbackRateEnd: 1.6,
      filter: { type: "highpass", frequency: 1600, q: 1.4 },
    });
  }

  playShootSound() {
    this.playShootTransient();
  }

  playWeaponSwitchSound() {
    this.playSweep({
      tag: "weapon-switch",
      minInterval: 0.1,
      type: "triangle",
      frequencyStart: 340,
      frequencyEnd: 470,
      duration: 0.09,
      volume: 0.055,
      attack: 0.003,
      filter: { type: "bandpass", frequency: 900, q: 1.4 },
    });
    this.playSweep({
      type: "triangle",
      frequencyStart: 500,
      frequencyEnd: 690,
      duration: 0.08,
      timeOffset: 0.07,
      volume: 0.05,
      attack: 0.003,
      filter: { type: "bandpass", frequency: 1200, q: 1.4 },
    });
  }

  playEnemyShootSound() {
    this.playSweep({
      tag: "enemy-shoot",
      minInterval: 0.08,
      type: "sawtooth",
      frequencyStart: 680,
      frequencyEnd: 250,
      duration: 0.075,
      volume: 0.06,
      attack: 0.003,
      harmonics: [
        { ratio: 1.5, detune: -5, type: "square" },
      ],
      filter: { type: "bandpass", frequency: 1400, q: 1.8 },
    });
    this.playNoiseBurst({
      duration: 0.05,
      volume: 0.03,
      playbackRateStart: 1.8,
      playbackRateEnd: 1.2,
      filter: { type: "highpass", frequency: 980, q: 1 },
    });
  }

  playExplosionSound() {
    const usedUploadedAudio = this.playMediaAsset("explosion-media", {
      src: "./src/audio/explosion.mp3",
      poolSize: 5,
      volume: 0.6,
      playbackRate: 0.94 + Math.random() * 0.12,
      minInterval: 0.08,
    });

    if (usedUploadedAudio) {
      return;
    }

    this.playNoiseBurst({
      tag: "explosion",
      minInterval: 0.12,
      duration: 0.42,
      attack: 0.002,
      volume: 0.16,
      playbackRateStart: 0.8,
      playbackRateEnd: 0.25,
      filter: { type: "lowpass", frequency: 1200, q: 0.8 },
    });
    this.playSweep({
      type: "triangle",
      frequencyStart: 160,
      frequencyEnd: 38,
      duration: 0.36,
      volume: 0.12,
      attack: 0.004,
      harmonics: [
        { ratio: 0.5, detune: -7, type: "sawtooth" },
      ],
      filter: { type: "lowpass", frequency: 420, q: 0.6 },
    });
  }

  playHitSound() {
    this.playSweep({
      tag: "hit",
      minInterval: 0.03,
      type: "square",
      frequencyStart: 520,
      frequencyEnd: 180,
      duration: 0.06,
      volume: 0.05,
      attack: 0.002,
      filter: { type: "bandpass", frequency: 1100, q: 1.8 },
    });
    this.playNoiseBurst({
      duration: 0.03,
      volume: 0.024,
      playbackRateStart: 2.4,
      playbackRateEnd: 1.6,
      filter: { type: "highpass", frequency: 1600, q: 1.4 },
    });
  }

  playLowHealthSound() {
    this.playSweep({
      tag: "low-health",
      minInterval: 1.4,
      type: "square",
      frequencyStart: 240,
      frequencyEnd: 220,
      duration: 0.09,
      volume: 0.055,
      attack: 0.002,
      filter: { type: "bandpass", frequency: 760, q: 1.1 },
    });
    this.playSweep({
      type: "square",
      frequencyStart: 240,
      frequencyEnd: 220,
      duration: 0.09,
      timeOffset: 0.16,
      volume: 0.052,
      attack: 0.002,
      filter: { type: "bandpass", frequency: 760, q: 1.1 },
    });
  }

  playStealthEnterSound() {
    this.playSweep({
      tag: "stealth-enter",
      minInterval: 0.2,
      type: "sine",
      frequencyStart: 440,
      frequencyEnd: 240,
      duration: 0.2,
      volume: 0.045,
      attack: 0.01,
      harmonics: [
        { ratio: 0.5, detune: 0, type: "triangle" },
      ],
      filter: { type: "lowpass", frequency: 720, q: 0.7 },
    });
  }

  playStealthExitSound() {
    this.playSweep({
      tag: "stealth-exit",
      minInterval: 0.2,
      type: "square",
      frequencyStart: 260,
      frequencyEnd: 580,
      duration: 0.14,
      volume: 0.062,
      attack: 0.003,
      filter: { type: "bandpass", frequency: 980, q: 1.6 },
    });
    this.playSweep({
      type: "square",
      frequencyStart: 620,
      frequencyEnd: 740,
      duration: 0.08,
      timeOffset: 0.11,
      volume: 0.048,
      attack: 0.002,
      filter: { type: "bandpass", frequency: 1400, q: 1.6 },
    });
  }

  playTimeSlowSound() {
    this.playSweep({
      tag: "time-slow",
      minInterval: 0.3,
      type: "sawtooth",
      frequencyStart: 320,
      frequencyEnd: 92,
      duration: 0.42,
      volume: 0.07,
      attack: 0.008,
      harmonics: [
        { ratio: 0.5, detune: -8, type: "sine" },
      ],
      filter: { type: "lowpass", frequency: 760, q: 0.9 },
    });
    this.playNoiseBurst({
      duration: 0.22,
      volume: 0.045,
      playbackRateStart: 1.4,
      playbackRateEnd: 0.45,
      filter: { type: "bandpass", frequency: 600, q: 0.9 },
    });
  }

  playEnergyLowSound() {
    this.playSweep({
      tag: "energy-low",
      minInterval: 0.8,
      type: "square",
      frequencyStart: 210,
      frequencyEnd: 170,
      duration: 0.1,
      volume: 0.055,
      attack: 0.002,
      filter: { type: "bandpass", frequency: 620, q: 1.3 },
    });
    this.playSweep({
      type: "square",
      frequencyStart: 180,
      frequencyEnd: 150,
      duration: 0.08,
      timeOffset: 0.13,
      volume: 0.046,
      attack: 0.002,
      filter: { type: "bandpass", frequency: 520, q: 1.3 },
    });
  }

  stopShootSound() {
    return false;
  }
}

const soundEngine = new SoundEngine();
__bundle["src/audio/SoundEngine.js"] = { soundEngine };
})();

(() => {
const { soundEngine } = __bundle["src/audio/SoundEngine.js"];
function playEngineSound() {
  soundEngine.playEngineSound();
}

function playBoostSound() {
  soundEngine.playBoostSound();
}

function playShootSound() {
  soundEngine.playShootSound();
}

function stopShootSound() {
  soundEngine.stopShootSound();
}

function playWeaponSwitchSound() {
  soundEngine.playWeaponSwitchSound();
}

function playEnemyShootSound() {
  soundEngine.playEnemyShootSound();
}

function playExplosionSound() {
  soundEngine.playExplosionSound();
}

function playHitSound() {
  soundEngine.playHitSound();
}

function playLowHealthSound() {
  soundEngine.playLowHealthSound();
}

function playStealthEnterSound() {
  soundEngine.playStealthEnterSound();
}

function playStealthExitSound() {
  soundEngine.playStealthExitSound();
}

function playTimeSlowSound() {
  soundEngine.playTimeSlowSound();
}

function playEnergyLowSound() {
  soundEngine.playEnergyLowSound();
}
__bundle["src/audio/placeholders.js"] = { playEngineSound, playBoostSound, playShootSound, stopShootSound, playWeaponSwitchSound, playEnemyShootSound, playExplosionSound, playHitSound, playLowHealthSound, playStealthEnterSound, playStealthExitSound, playTimeSlowSound, playEnergyLowSound };
})();

(() => {
const THREE = globalThis.THREE;
const TRANSLATION_KEYS = {
  forward: ["ArrowUp"],
  backward: ["ArrowDown"],
  left: ["ArrowLeft"],
  right: ["ArrowRight"],
  up: ["KeyR"],
  down: ["KeyF"],
};

const ROTATION_KEYS = {
  pitchUp: ["KeyW"],
  pitchDown: ["KeyS"],
  yawLeft: ["KeyA"],
  yawRight: ["KeyD"],
  rollLeft: ["KeyQ"],
  rollRight: ["KeyE"],
};

const BOOST_KEYS = ["KeyC"];
const TIME_SLOW_KEYS = ["ShiftLeft", "ShiftRight"];
const SHIELD_KEYS = ["KeyX"];

const WEAPON_SWITCH_KEYS = new Map([
  ["Digit1", 0],
  ["Digit2", 1],
  ["Digit3", 2],
]);

function isAnyKeyActive(activeKeys, keys) {
  return keys.some((key) => activeKeys.has(key));
}

class InputController {
  constructor(domElement) {
    this.domElement = domElement;
    this.activeKeys = new Set();
    this.pointer = new THREE.Vector2();
    this.pointerTarget = new THREE.Vector2();
    this.pointerLockedDelta = new THREE.Vector2();
    this.translationInput = new THREE.Vector3();
    this.rotationInput = new THREE.Vector3();
    this.isPrimaryFirePressed = false;
    this.pendingWeaponSwitch = null;
    this.pendingPauseToggle = false;
    this.pendingRestart = false;
    this.pendingDebugToggle = false;
    this.isPointerLocked = false;
    this.mouseYawSensitivity = 0.72;
    this.mousePitchSensitivity = 0.64;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handlePointerLeave = this.handlePointerLeave.bind(this);
    this.handlePointerLockChange = this.handlePointerLockChange.bind(this);
    this.handleWindowBlur = this.handleWindowBlur.bind(this);

    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    this.domElement.addEventListener("pointermove", this.handlePointerMove, { passive: true });
    this.domElement.addEventListener("pointerdown", this.handlePointerDown);
    window.addEventListener("pointerup", this.handlePointerUp);
    this.domElement.addEventListener("pointerleave", this.handlePointerLeave);
    document.addEventListener("pointerlockchange", this.handlePointerLockChange);
    window.addEventListener("blur", this.handleWindowBlur);
  }

  handleKeyDown(event) {
    if (
      Object.values(TRANSLATION_KEYS).some((keys) => keys.includes(event.code))
      || Object.values(ROTATION_KEYS).some((keys) => keys.includes(event.code))
      || BOOST_KEYS.includes(event.code)
      || TIME_SLOW_KEYS.includes(event.code)
      || SHIELD_KEYS.includes(event.code)
    ) {
      event.preventDefault();
      this.activeKeys.add(event.code);
      return;
    }

    if (event.code === "Space") {
      event.preventDefault();
      this.isPrimaryFirePressed = true;
      return;
    }

    if ((event.code === "Escape" || event.code === "KeyP") && !event.repeat) {
      event.preventDefault();
      this.pendingPauseToggle = true;
      return;
    }

    if (event.code === "KeyT" && !event.repeat) {
      event.preventDefault();
      this.pendingRestart = true;
      return;
    }

    if (event.code === "KeyV" && !event.repeat) {
      event.preventDefault();
      this.pendingDebugToggle = true;
      return;
    }

    if (WEAPON_SWITCH_KEYS.has(event.code) && !event.repeat) {
      event.preventDefault();
      this.pendingWeaponSwitch = WEAPON_SWITCH_KEYS.get(event.code);
    }
  }

  handleKeyUp(event) {
    if (this.activeKeys.has(event.code)) {
      event.preventDefault();
      this.activeKeys.delete(event.code);
      return;
    }

    if (event.code === "Space") {
      event.preventDefault();
      this.isPrimaryFirePressed = false;
    }
  }

  handlePointerMove(event) {
    if (this.isPointerLocked) {
      const width = Math.max(window.innerWidth, 1);
      const height = Math.max(window.innerHeight, 1);

      this.pointerLockedDelta.x += event.movementX / width;
      this.pointerLockedDelta.y += event.movementY / height;
      return;
    }

    const { innerWidth, innerHeight } = window;
    const x = (event.clientX / innerWidth) * 2 - 1;
    const y = (event.clientY / innerHeight) * 2 - 1;

    this.pointerTarget.set(
      THREE.MathUtils.clamp(x, -1, 1),
      THREE.MathUtils.clamp(y, -1, 1),
    );
  }

  handlePointerDown(event) {
    if (event.button !== 0) {
      return;
    }

    this.isPrimaryFirePressed = true;

    if (!this.isPointerLocked && this.domElement.requestPointerLock) {
      this.domElement.requestPointerLock();
    }
  }

  handlePointerUp(event) {
    if (event.button === 0) {
      this.isPrimaryFirePressed = false;
    }
  }

  handlePointerLeave() {
    if (!this.isPointerLocked) {
      this.pointerTarget.set(0, 0);
    }
  }

  handlePointerLockChange() {
    this.isPointerLocked = document.pointerLockElement === this.domElement;

    if (!this.isPointerLocked) {
      this.pointerLockedDelta.set(0, 0);
    }
  }

  handleWindowBlur() {
    this.activeKeys.clear();
    this.isPrimaryFirePressed = false;
    this.pendingWeaponSwitch = null;
    this.pendingPauseToggle = false;
    this.pendingRestart = false;
    this.pendingDebugToggle = false;
    this.pointerTarget.set(0, 0);
    this.pointer.set(0, 0);
    this.pointerLockedDelta.set(0, 0);
  }

  update(deltaTime) {
    const smoothing = 1 - Math.exp(-10 * deltaTime);
    this.pointer.lerp(this.pointerTarget, smoothing);
  }

  getTranslationInput() {
    this.translationInput.set(
      Number(isAnyKeyActive(this.activeKeys, TRANSLATION_KEYS.right)) - Number(isAnyKeyActive(this.activeKeys, TRANSLATION_KEYS.left)),
      Number(isAnyKeyActive(this.activeKeys, TRANSLATION_KEYS.up)) - Number(isAnyKeyActive(this.activeKeys, TRANSLATION_KEYS.down)),
      Number(isAnyKeyActive(this.activeKeys, TRANSLATION_KEYS.forward)) - Number(isAnyKeyActive(this.activeKeys, TRANSLATION_KEYS.backward)),
    );

    if (this.translationInput.lengthSq() > 1) {
      this.translationInput.normalize();
    }

    return this.translationInput;
  }

  getRotationInput() {
    this.rotationInput.set(
      Number(isAnyKeyActive(this.activeKeys, ROTATION_KEYS.pitchDown)) - Number(isAnyKeyActive(this.activeKeys, ROTATION_KEYS.pitchUp)),
      Number(isAnyKeyActive(this.activeKeys, ROTATION_KEYS.yawLeft)) - Number(isAnyKeyActive(this.activeKeys, ROTATION_KEYS.yawRight)),
      Number(isAnyKeyActive(this.activeKeys, ROTATION_KEYS.rollLeft)) - Number(isAnyKeyActive(this.activeKeys, ROTATION_KEYS.rollRight)),
    );

    if (this.isPointerLocked) {
      this.rotationInput.x += this.pointerLockedDelta.y * this.mousePitchSensitivity;
      this.rotationInput.y -= this.pointerLockedDelta.x * this.mouseYawSensitivity;
      this.pointerLockedDelta.set(0, 0);
    }

    this.rotationInput.x = THREE.MathUtils.clamp(this.rotationInput.x, -1, 1);
    this.rotationInput.y = THREE.MathUtils.clamp(this.rotationInput.y, -1, 1);
    this.rotationInput.z = THREE.MathUtils.clamp(this.rotationInput.z, -1, 1);

    return this.rotationInput;
  }

  isBoosting() {
    return isAnyKeyActive(this.activeKeys, BOOST_KEYS);
  }

  isTimeSlowing() {
    return isAnyKeyActive(this.activeKeys, TIME_SLOW_KEYS);
  }

  isShielding() {
    return isAnyKeyActive(this.activeKeys, SHIELD_KEYS);
  }

  isFiring() {
    return this.isPrimaryFirePressed;
  }

  consumeWeaponSwitchRequest() {
    const request = this.pendingWeaponSwitch;
    this.pendingWeaponSwitch = null;
    return request;
  }

  consumePauseToggleRequest() {
    const request = this.pendingPauseToggle;
    this.pendingPauseToggle = false;
    return request;
  }

  consumeRestartRequest() {
    const request = this.pendingRestart;
    this.pendingRestart = false;
    return request;
  }

  consumeDebugToggleRequest() {
    const request = this.pendingDebugToggle;
    this.pendingDebugToggle = false;
    return request;
  }

  dispose() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    this.domElement.removeEventListener("pointermove", this.handlePointerMove);
    this.domElement.removeEventListener("pointerdown", this.handlePointerDown);
    window.removeEventListener("pointerup", this.handlePointerUp);
    this.domElement.removeEventListener("pointerleave", this.handlePointerLeave);
    document.removeEventListener("pointerlockchange", this.handlePointerLockChange);
    window.removeEventListener("blur", this.handleWindowBlur);
  }
}
__bundle["src/core/InputController.js"] = { InputController };
})();

(() => {
const THREE = globalThis.THREE;
const sharedFlashSphere = new THREE.SphereGeometry(0.16, 12, 12);
const sharedFlashRing = new THREE.TorusGeometry(0.32, 0.04, 8, 24);

class ImpactFlash {
  constructor({ position, color = 0xffffff, scale = 1 } = {}) {
    this.group = new THREE.Group();
    this.group.position.copy(position);
    this.duration = 0.28;
    this.life = 0;
    this.scale = scale;

    this.sphereMaterial = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 1,
      depthWrite: false,
    });

    this.ringMaterial = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });

    this.core = new THREE.Mesh(sharedFlashSphere, this.sphereMaterial);
    this.core.scale.setScalar(scale);
    this.group.add(this.core);

    this.ring = new THREE.Mesh(sharedFlashRing, this.ringMaterial);
    this.ring.rotation.x = Math.PI * 0.5;
    this.ring.scale.setScalar(scale * 0.65);
    this.group.add(this.ring);
  }

  update(deltaTime) {
    this.life += deltaTime;
    const progress = Math.min(this.life / this.duration, 1);

    this.core.scale.setScalar(this.scale * (1 + progress * 1.1));
    this.ring.scale.setScalar(this.scale * (0.65 + progress * 1.8));
    this.sphereMaterial.opacity = 1 - progress;
    this.ringMaterial.opacity = 0.95 - progress * 0.95;

    return progress < 1;
  }

  dispose() {
    this.sphereMaterial.dispose();
    this.ringMaterial.dispose();
  }
}

class ImpactFlashSystem {
  constructor({ scene }) {
    this.scene = scene;
    this.flashes = [];
  }

  spawnImpactFlash({ position, color, scale } = {}) {
    const flash = new ImpactFlash({ position, color, scale });
    this.flashes.push(flash);
    this.scene.add(flash.group);
  }

  update(deltaTime) {
    for (let index = this.flashes.length - 1; index >= 0; index -= 1) {
      const flash = this.flashes[index];
      const isAlive = flash.update(deltaTime);

      if (!isAlive) {
        this.scene.remove(flash.group);
        flash.dispose();
        this.flashes.splice(index, 1);
      }
    }
  }

  dispose() {
    for (const flash of this.flashes) {
      this.scene.remove(flash.group);
      flash.dispose();
    }

    this.flashes.length = 0;
  }
}
__bundle["src/effects/ImpactFlashSystem.js"] = { ImpactFlashSystem };
})();

(() => {
const THREE = globalThis.THREE;
const { playExplosionSound } = __bundle["src/audio/placeholders.js"];
const sharedParticleGeometry = new THREE.IcosahedronGeometry(0.08, 0);

class ExplosionBurst {
  constructor({ position, color = 0xffae75, scale = 1 } = {}) {
    this.group = new THREE.Group();
    this.group.position.copy(position);
    this.duration = 0.65;
    this.life = 0;
    this.particles = [];
    this.baseScales = [];
    this.velocities = [];
    this.material = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 2.4,
      roughness: 0.22,
      metalness: 0.08,
      transparent: true,
      opacity: 1,
    });

    const particleCount = 12;

    for (let index = 0; index < particleCount; index += 1) {
      const particle = new THREE.Mesh(sharedParticleGeometry, this.material);
      const direction = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5,
      ).normalize();
      const particleScale = scale * THREE.MathUtils.randFloat(0.6, 1.45);

      particle.position.copy(direction).multiplyScalar(0.18 * scale);
      particle.scale.setScalar(particleScale);

      this.baseScales.push(particleScale);
      this.velocities.push(direction.multiplyScalar(THREE.MathUtils.randFloat(4, 10) * scale));
      this.particles.push(particle);
      this.group.add(particle);
    }
  }

  update(deltaTime) {
    this.life += deltaTime;
    const progress = Math.min(this.life / this.duration, 1);

    for (let index = 0; index < this.particles.length; index += 1) {
      const particle = this.particles[index];
      const velocity = this.velocities[index];
      const particleScale = this.baseScales[index] * (1 - progress * 0.82);

      particle.position.addScaledVector(velocity, deltaTime);
      particle.scale.setScalar(Math.max(0.001, particleScale));
    }

    this.group.scale.setScalar(1 + progress * 0.45);
    this.material.opacity = 1 - progress;
    this.material.emissiveIntensity = 2.4 * (1 - progress * 0.75);

    return progress < 1;
  }

  dispose() {
    this.material.dispose();
  }
}

class ExplosionSystem {
  constructor({ scene }) {
    this.scene = scene;
    this.bursts = [];
  }

  spawnExplosion({ position, color, scale } = {}) {
    const burst = new ExplosionBurst({ position, color, scale });
    this.bursts.push(burst);
    this.scene.add(burst.group);
    playExplosionSound();
  }

  update(deltaTime) {
    for (let index = this.bursts.length - 1; index >= 0; index -= 1) {
      const burst = this.bursts[index];
      const isAlive = burst.update(deltaTime);

      if (!isAlive) {
        this.scene.remove(burst.group);
        burst.dispose();
        this.bursts.splice(index, 1);
      }
    }
  }

  dispose() {
    for (const burst of this.bursts) {
      this.scene.remove(burst.group);
      burst.dispose();
    }

    this.bursts.length = 0;
  }
}
__bundle["src/effects/ExplosionSystem.js"] = { ExplosionSystem };
})();

(() => {
const THREE = globalThis.THREE;
const { playBoostSound, playEngineSound } = __bundle["src/audio/placeholders.js"];
const localForward = new THREE.Vector3(0, 0, -1);
const localRight = new THREE.Vector3(1, 0, 0);
const localUp = new THREE.Vector3(0, 1, 0);
const deltaRotationEuler = new THREE.Euler(0, 0, 0, "YXZ");
const deltaRotationQuaternion = new THREE.Quaternion();
const facingDirection = new THREE.Vector3();
const facingPointDirection = new THREE.Vector3();
const facingQuaternion = new THREE.Quaternion();
const shieldColor = new THREE.Color();
const stealthColor = new THREE.Color(0x83ffd8);
const timeColor = new THREE.Color(0x7bd8ff);

function disposeObjectResources(root) {
  const disposedMaterials = new Set();

  root.traverse((object) => {
    if (object.geometry) {
      object.geometry.dispose();
    }

    const materials = Array.isArray(object.material) ? object.material : [object.material];

    for (const material of materials) {
      if (material && !disposedMaterials.has(material)) {
        disposedMaterials.add(material);
        material.dispose();
      }
    }
  });
}

class Spaceship {
  constructor({
    bodyColor = 0x1a2230,
    wingColor = 0x2a3547,
    accentColor = 0x7fbcff,
    glowColor = 0x55d5ff,
  } = {}) {
    this.group = new THREE.Group();
    this.visualRoot = new THREE.Group();
    this.weaponRig = new THREE.Group();
    this.group.add(this.visualRoot);
    this.visualRoot.add(this.weaponRig);

    this.materials = new Set();
    this.engineGlowMaterials = [];
    this.engineGlowMeshes = [];
    this.engineTrailMaterials = [];
    this.engineTrailMeshes = [];
    this.navigationLightMaterials = [];

    this.floatTime = 0;
    this.targetTiltAmount = 0;
    this.currentTiltAmount = 0;
    this.boostAmount = 0;
    this.weaponRecoil = 0;
    this.weaponModeOffset = 0;
    this.attitudeOffset = new THREE.Vector3();
    this.damageFlash = 0;
    this.timeDilationAmount = 0;
    this.stealthFieldAmount = 0;
    this.shieldFieldAmount = 0;
    this.shieldImpactAmount = 0;

    this.velocity = new THREE.Vector3();
    this.angularVelocity = new THREE.Vector3();
    this.linearDamping = 2.8;
    this.angularDamping = 4.2;
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.isDestroyed = false;
    this.collisionRadius = 1.45;
    this.collisionSphere = new THREE.Sphere(new THREE.Vector3(), this.collisionRadius);

    this.bodyColor = bodyColor;
    this.wingColor = wingColor;
    this.accentColor = accentColor;
    this.glowColor = glowColor;
    this.baseShieldColor = new THREE.Color(this.accentColor);

    this.leftWeaponMount = new THREE.Object3D();
    this.rightWeaponMount = new THREE.Object3D();

    this.group.position.set(0, 0, 0);

    this.buildShip();
  }

  get position() {
    return this.group.position;
  }

  get rotation() {
    return this.group.rotation;
  }

  getForwardVector(target = new THREE.Vector3()) {
    return target.copy(localForward).applyQuaternion(this.group.quaternion).normalize();
  }

  getRightVector(target = new THREE.Vector3()) {
    return target.copy(localRight).applyQuaternion(this.group.quaternion).normalize();
  }

  getUpVector(target = new THREE.Vector3()) {
    return target.copy(localUp).applyQuaternion(this.group.quaternion).normalize();
  }

  faceDirection(direction) {
    if (!direction || direction.lengthSq() <= 0.000001) {
      return;
    }

    facingDirection.copy(direction).normalize();
    facingQuaternion.setFromUnitVectors(localForward, facingDirection);
    this.group.quaternion.copy(facingQuaternion).normalize();
    this.group.rotation.setFromQuaternion(this.group.quaternion, "YXZ");
    this.updateCollisionBounds();
  }

  facePoint(point) {
    if (!point) {
      return;
    }

    facingPointDirection.copy(point).sub(this.position);

    if (facingPointDirection.lengthSq() <= 0.000001) {
      return;
    }

    this.faceDirection(facingPointDirection);
  }

  buildShip() {
    const hull = this.buildBody();
    const cockpit = this.buildCockpit();
    const wings = this.buildWings();
    const engineSection = this.buildEngineSection();

    this.visualRoot.add(hull);
    this.visualRoot.add(cockpit);
    this.visualRoot.add(wings);
    this.visualRoot.add(engineSection);
    this.createWeaponMounts();
    this.createShieldShell();

    this.visualRoot.rotation.x = -0.06;
  }

  buildBody() {
    const hullGroup = new THREE.Group();

    const hullMaterial = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: this.bodyColor,
      emissive: 0x0a1018,
      emissiveIntensity: 0.9,
      roughness: 0.42,
      metalness: 0.86,
    }));

    const accentMaterial = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: this.accentColor,
      emissive: 0x17324d,
      emissiveIntensity: 1.1,
      roughness: 0.2,
      metalness: 0.72,
    }));

    const coreHull = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 0.62, 4.8),
      hullMaterial,
    );
    coreHull.scale.set(1, 0.92, 1);
    hullGroup.add(coreHull);

    const dorsalSpine = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.26, 2.6),
      accentMaterial,
    );
    dorsalSpine.position.set(0, 0.35, -0.1);
    hullGroup.add(dorsalSpine);

    const noseWedge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.76, 1.7, 6),
      hullMaterial,
    );
    noseWedge.rotation.x = Math.PI * 0.5;
    noseWedge.rotation.z = Math.PI * 0.5;
    noseWedge.scale.set(0.58, 0.58, 1.08);
    noseWedge.position.set(0, 0.02, -3.08);
    hullGroup.add(noseWedge);

    const ventralPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.16, 2.8),
      this.trackMaterial(new THREE.MeshStandardMaterial({
        color: 0x101722,
        roughness: 0.55,
        metalness: 0.72,
      })),
    );
    ventralPlate.position.set(0, -0.28, -0.18);
    hullGroup.add(ventralPlate);

    const intakeGeometry = new THREE.BoxGeometry(0.24, 0.24, 1.6);

    for (const side of [-1, 1]) {
      const sideIntake = new THREE.Mesh(intakeGeometry, accentMaterial);
      sideIntake.position.set(0.54 * side, 0.06, -0.2);
      hullGroup.add(sideIntake);

      const cheekArmor = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.22, 1.2),
        hullMaterial,
      );
      cheekArmor.position.set(0.48 * side, -0.06, -1.6);
      cheekArmor.rotation.z = -0.12 * side;
      hullGroup.add(cheekArmor);
    }

    return hullGroup;
  }

  buildCockpit() {
    const canopyMaterial = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: 0xbfe7ff,
      emissive: 0x214d73,
      emissiveIntensity: 1.6,
      roughness: 0.08,
      metalness: 0.18,
      transparent: true,
      opacity: 0.88,
    }));

    const canopy = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 18, 14),
      canopyMaterial,
    );
    canopy.scale.set(0.96, 0.56, 1.42);
    canopy.position.set(0, 0.42, -1.46);

    return canopy;
  }

  buildWings() {
    const wingsGroup = new THREE.Group();
    const wingMaterial = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: this.wingColor,
      emissive: 0x0d1420,
      emissiveIntensity: 0.55,
      roughness: 0.48,
      metalness: 0.8,
    }));

    const edgeMaterial = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: this.accentColor,
      emissive: 0x143250,
      emissiveIntensity: 1,
      roughness: 0.22,
      metalness: 0.74,
    }));

    for (const side of [-1, 1]) {
      const wing = new THREE.Mesh(
        new THREE.BoxGeometry(2.55, 0.14, 1.2),
        wingMaterial,
      );
      wing.position.set(1.7 * side, -0.04, 0.05);
      wing.rotation.z = -0.22 * side;
      wing.rotation.y = 0.12 * side;
      wingsGroup.add(wing);

      const wingBlade = new THREE.Mesh(
        new THREE.BoxGeometry(1.35, 0.08, 1.48),
        edgeMaterial,
      );
      wingBlade.position.set(2.68 * side, -0.08, -0.22);
      wingBlade.rotation.z = -0.34 * side;
      wingBlade.rotation.y = 0.2 * side;
      wingsGroup.add(wingBlade);

      const stabilizer = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.84, 0.9),
        wingMaterial,
      );
      stabilizer.position.set(1.96 * side, 0.38, 1.12);
      stabilizer.rotation.z = -0.18 * side;
      wingsGroup.add(stabilizer);

      const navigationLightMaterial = this.trackMaterial(new THREE.MeshBasicMaterial({
        color: side < 0 ? 0x69dfff : 0xff8f78,
        transparent: true,
        opacity: 0.95,
      }));
      const navigationLight = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 10, 10),
        navigationLightMaterial,
      );
      navigationLight.position.set(3.18 * side, -0.08, -0.34);
      wingsGroup.add(navigationLight);
      this.navigationLightMaterials.push(navigationLightMaterial);
    }

    return wingsGroup;
  }

  buildEngineSection() {
    const engineGroup = new THREE.Group();

    const engineHousingMaterial = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: 0x141b28,
      emissive: 0x0e1724,
      emissiveIntensity: 0.6,
      roughness: 0.38,
      metalness: 0.84,
    }));

    const thrusterMaterial = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: 0x263448,
      emissive: 0x0f2232,
      emissiveIntensity: 0.9,
      roughness: 0.3,
      metalness: 0.76,
    }));

    const engineBridge = new THREE.Mesh(
      new THREE.BoxGeometry(0.92, 0.42, 0.88),
      engineHousingMaterial,
    );
    engineBridge.position.set(0, 0.02, 2.08);
    engineGroup.add(engineBridge);

    for (const side of [-1, 1]) {
      const enginePod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.29, 1.08, 14),
        thrusterMaterial,
      );
      enginePod.rotation.x = Math.PI * 0.5;
      enginePod.position.set(0.56 * side, -0.04, 2.15);
      engineGroup.add(enginePod);

      const nozzle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.19, 0.12, 0.34, 14),
        engineHousingMaterial,
      );
      nozzle.rotation.x = Math.PI * 0.5;
      nozzle.position.set(0.56 * side, -0.04, 2.74);
      engineGroup.add(nozzle);

      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 16, 16),
        this.trackMaterial(new THREE.MeshStandardMaterial({
          color: this.glowColor,
          emissive: this.glowColor,
          emissiveIntensity: 2.4,
          roughness: 0.14,
          metalness: 0.05,
        })),
      );
      glow.scale.set(1, 0.82, 1.28);
      glow.position.set(0.56 * side, -0.04, 2.95);
      this.engineGlowMeshes.push(glow);
      this.engineGlowMaterials.push(glow.material);
      engineGroup.add(glow);

      const trailMaterial = this.trackMaterial(new THREE.MeshBasicMaterial({
        color: this.glowColor,
        transparent: true,
        opacity: 0.34,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }));
      const trail = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.02, 2.2, 12, 1, true),
        trailMaterial,
      );
      trail.rotation.x = Math.PI * 0.5;
      trail.position.set(0.56 * side, -0.04, 3.9);
      trail.scale.set(1, 1, 0.72);
      this.engineTrailMeshes.push(trail);
      this.engineTrailMaterials.push(trailMaterial);
      engineGroup.add(trail);
    }

    return engineGroup;
  }

  createShieldShell() {
    this.shieldShellMaterial = this.trackMaterial(new THREE.MeshBasicMaterial({
      color: this.accentColor,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }));
    this.shieldShell = new THREE.Mesh(
      new THREE.SphereGeometry(2.2, 20, 18),
      this.shieldShellMaterial,
    );
    this.shieldShell.scale.set(1.05, 0.58, 1.8);
    this.visualRoot.add(this.shieldShell);
  }

  createWeaponMounts() {
    this.leftWeaponMount.position.set(-1.06, -0.05, -2.38);
    this.rightWeaponMount.position.set(1.06, -0.05, -2.38);

    this.weaponRig.add(this.leftWeaponMount);
    this.weaponRig.add(this.rightWeaponMount);
  }

  trackMaterial(material) {
    this.materials.add(material);
    return material;
  }

  setWireframe(enabled) {
    for (const material of this.materials) {
      material.wireframe = enabled;
    }
  }

  tilt(direction) {
    this.targetTiltAmount = THREE.MathUtils.clamp(direction, -1, 1);
  }

  boost() {
    this.boostAmount = Math.max(this.boostAmount, 1);
    playEngineSound();
    playBoostSound();
  }

  triggerWeaponRecoil(intensity = 0.22) {
    this.weaponRecoil = Math.max(this.weaponRecoil, intensity);
  }

  setWeaponModeOffset(offset) {
    this.weaponModeOffset = THREE.MathUtils.clamp(offset, -1, 1);
  }

  setTimeDilationAmount(amount) {
    this.timeDilationAmount = THREE.MathUtils.clamp(amount, 0, 1);
  }

  setStealthFieldAmount(amount) {
    this.stealthFieldAmount = THREE.MathUtils.clamp(amount, 0, 1);
  }

  setShieldFieldAmount(amount) {
    this.shieldFieldAmount = THREE.MathUtils.clamp(amount, 0, 1);
  }

  setShieldImpactAmount(amount) {
    this.shieldImpactAmount = THREE.MathUtils.clamp(amount, 0, 1);
  }

  takeDamage(amount) {
    if (this.isDestroyed) {
      return false;
    }

    this.health = Math.max(0, this.health - amount);
    this.damageFlash = 1;

    if (this.health === 0) {
      this.isDestroyed = true;
      this.group.visible = false;
    }

    this.updateCollisionBounds();

    return this.isDestroyed;
  }

  heal(amount) {
    if (this.isDestroyed || amount <= 0) {
      return 0;
    }

    const previousHealth = this.health;
    this.health = Math.min(this.maxHealth, this.health + amount);
    return this.health - previousHealth;
  }

  restore({ position = new THREE.Vector3(), rotationY = 0 } = {}) {
    this.isDestroyed = false;
    this.health = this.maxHealth;
    this.group.visible = true;
    this.group.position.copy(position);
    this.group.rotation.set(0, rotationY, 0);
    this.group.quaternion.setFromEuler(this.group.rotation);
    this.velocity.set(0, 0, 0);
    this.angularVelocity.set(0, 0, 0);
    this.targetTiltAmount = 0;
    this.currentTiltAmount = 0;
    this.boostAmount = 0;
    this.weaponRecoil = 0;
    this.weaponModeOffset = 0;
    this.attitudeOffset.set(0, 0, 0);
    this.damageFlash = 0;
    this.timeDilationAmount = 0;
    this.stealthFieldAmount = 0;
    this.shieldFieldAmount = 0;
    this.shieldImpactAmount = 0;
    this.updateCollisionBounds();
  }

  updateCollisionBounds() {
    this.collisionSphere.radius = this.collisionRadius;

    if (this.isDestroyed || !this.group.visible) {
      this.collisionSphere.center.set(1e6, 1e6, 1e6);
      return;
    }

    this.collisionSphere.center.copy(this.group.position);
  }

  update(deltaTime) {
    if (this.isDestroyed) {
      this.updateCollisionBounds();
      return;
    }

    this.floatTime += deltaTime;

    const linearDrag = Math.exp(-this.linearDamping * deltaTime);
    const angularDrag = Math.exp(-this.angularDamping * deltaTime);

    this.velocity.multiplyScalar(linearDrag);
    this.angularVelocity.multiplyScalar(angularDrag);
    this.group.position.addScaledVector(this.velocity, deltaTime);

    if (this.angularVelocity.lengthSq() > 0.000001) {
      deltaRotationEuler.set(
        this.angularVelocity.x * deltaTime,
        this.angularVelocity.y * deltaTime,
        this.angularVelocity.z * deltaTime,
      );
      deltaRotationQuaternion.setFromEuler(deltaRotationEuler);
      this.group.quaternion.multiply(deltaRotationQuaternion).normalize();
    }

    this.currentTiltAmount = THREE.MathUtils.damp(
      this.currentTiltAmount,
      this.targetTiltAmount,
      7,
      deltaTime,
    );
    this.boostAmount = THREE.MathUtils.damp(this.boostAmount, 0, 4.8, deltaTime);
    this.weaponRecoil = THREE.MathUtils.damp(this.weaponRecoil, 0, 11, deltaTime);
    this.damageFlash = THREE.MathUtils.damp(this.damageFlash, 0, 7.5, deltaTime);
    this.shieldImpactAmount = THREE.MathUtils.damp(this.shieldImpactAmount, 0, 9, deltaTime);

    const idleBob = Math.sin(this.floatTime * 1.7) * 0.08;
    const idleSway = Math.sin(this.floatTime * 0.9) * 0.04;
    const idlePitch = Math.sin(this.floatTime * 1.15) * 0.016;
    const boostStretch = this.boostAmount * 0.08;
    const bodySquash = 1 - this.boostAmount * 0.03;
    const glowPulse = 0.75
      + Math.sin(this.floatTime * 8.5) * 0.12
      + this.boostAmount * 0.95
      + this.timeDilationAmount * 0.45;
    const shieldPulse = this.damageFlash * 0.85
      + this.boostAmount * 0.08
      + this.timeDilationAmount * 0.22
      + this.stealthFieldAmount * 0.08
      + this.shieldFieldAmount * 0.52
      + this.shieldImpactAmount * 0.7;
    const stealthDimming = 1 - this.stealthFieldAmount * 0.45;

    this.visualRoot.position.y = idleBob;
    this.visualRoot.rotation.x = -0.06 + idlePitch + this.attitudeOffset.x;
    this.visualRoot.rotation.y = idleSway + this.weaponModeOffset * 0.08 + this.attitudeOffset.y;
    this.visualRoot.rotation.z = -this.currentTiltAmount * 0.32 + this.attitudeOffset.z;
    this.visualRoot.scale.set(bodySquash, bodySquash, 1 + boostStretch);

    this.weaponRig.position.z = -this.weaponRecoil;
    this.weaponRig.position.x = this.weaponModeOffset * 0.12;

    for (let index = 0; index < this.engineGlowMeshes.length; index += 1) {
      const glowMesh = this.engineGlowMeshes[index];
      const glowMaterial = this.engineGlowMaterials[index];
      const sizePulse = 1 + Math.sin(this.floatTime * 9 + index * 0.6) * 0.08 + this.boostAmount * 0.2;

      glowMaterial.emissiveIntensity = (2.1 + glowPulse) * stealthDimming;
      glowMesh.scale.set(1 * sizePulse, 0.82 * sizePulse, (1.28 + this.boostAmount * 0.4) * sizePulse);
    }

    for (let index = 0; index < this.engineTrailMeshes.length; index += 1) {
      const trailMesh = this.engineTrailMeshes[index];
      const trailMaterial = this.engineTrailMaterials[index];
      const trailPulse = 0.82 + Math.sin(this.floatTime * 9.4 + index * 0.45) * 0.08;

      trailMesh.scale.set(
        1,
        1,
        (0.62 + this.boostAmount * 0.88 + Math.abs(this.velocity.length()) * 0.015) * trailPulse,
      );
      trailMaterial.opacity = (0.16 + this.boostAmount * 0.26 + trailPulse * 0.08 + this.timeDilationAmount * 0.06) * stealthDimming;
    }

    for (let index = 0; index < this.navigationLightMaterials.length; index += 1) {
      this.navigationLightMaterials[index].opacity = (0.68 + Math.sin(this.floatTime * 6 + index * Math.PI) * 0.2) * (1 - this.stealthFieldAmount * 0.35);
    }

    this.shieldShell.visible = shieldPulse > 0.02;
    shieldColor.copy(this.baseShieldColor)
      .lerp(timeColor, this.timeDilationAmount * 0.85)
      .lerp(stealthColor, this.stealthFieldAmount * 0.55);
    this.shieldShellMaterial.color.copy(shieldColor);
    this.shieldShellMaterial.opacity = shieldPulse * 0.32;
    this.shieldShell.scale.set(
      1.05 + shieldPulse * 0.12 + this.shieldFieldAmount * 0.04,
      0.58 + shieldPulse * 0.08 + this.shieldFieldAmount * 0.03,
      1.8 + shieldPulse * 0.18 + this.shieldFieldAmount * 0.06,
    );

    this.updateCollisionBounds();
  }

  dispose() {
    disposeObjectResources(this.group);
  }
}
__bundle["src/entities/Spaceship.js"] = { Spaceship };
})();

(() => {
const WEAPON_SWITCH_DELAY = 0.28;

const WEAPON_DEFINITIONS = [
  {
    id: "laser",
    slot: 1,
    label: "Laser",
    firePattern: "dual",
    cooldown: 0.22,
    projectileSpeed: 78,
    projectileLifetime: 2.4,
    projectileStyle: "laser",
    projectileScale: [1, 1, 1],
    collisionRadius: 0.12,
    damage: 16,
    recoil: 0.12,
    spawnOffset: 0.5,
    velocityInheritance: 0.16,
    weaponColor: 0x69dfff,
    glowColor: 0x38b7ff,
    barrelScale: [0.95, 0.95, 1.16],
    muzzleScale: [1.05, 1.05, 1.3],
    glowIntensity: 2.3,
    barrelEmissiveIntensity: 1.2,
    trailOpacity: 0.3,
    trailLength: 1.4,
    impactScale: 0.75,
    cameraShake: 0.12,
    energyCost: 4.2,
  },
  {
    id: "plasma",
    slot: 2,
    label: "Plasma",
    firePattern: "alternating",
    cooldown: 0.48,
    projectileSpeed: 42,
    projectileLifetime: 2.8,
    projectileStyle: "plasma",
    projectileScale: [1.22, 1.22, 1.22],
    collisionRadius: 0.2,
    damage: 28,
    recoil: 0.2,
    spawnOffset: 0.44,
    velocityInheritance: 0.14,
    weaponColor: 0xffb36a,
    glowColor: 0xff7f50,
    barrelScale: [1.2, 1.15, 0.96],
    muzzleScale: [1.35, 1.35, 1.55],
    glowIntensity: 2.8,
    barrelEmissiveIntensity: 1.45,
    trailOpacity: 0.42,
    trailLength: 1.95,
    impactScale: 1.1,
    cameraShake: 0.2,
    energyCost: 9.4,
  },
  {
    id: "rapid-fire",
    slot: 3,
    label: "Rapid Fire",
    firePattern: "alternating",
    cooldown: 0.09,
    projectileSpeed: 88,
    projectileLifetime: 2,
    projectileStyle: "rapid",
    projectileScale: [1, 1, 1],
    collisionRadius: 0.08,
    damage: 8,
    recoil: 0.07,
    spawnOffset: 0.52,
    velocityInheritance: 0.18,
    weaponColor: 0xc7ff6e,
    glowColor: 0x8dff61,
    barrelScale: [0.72, 0.72, 0.9],
    muzzleScale: [0.75, 0.75, 0.95],
    glowIntensity: 2,
    barrelEmissiveIntensity: 1.05,
    trailOpacity: 0.22,
    trailLength: 1.08,
    impactScale: 0.58,
    cameraShake: 0.06,
    energyCost: 1.85,
  },
];

function getWeaponDefinitionByIndex(index) {
  return WEAPON_DEFINITIONS[index] ?? WEAPON_DEFINITIONS[0];
}
__bundle["src/weapons/weaponTypes.js"] = { getWeaponDefinitionByIndex, WEAPON_SWITCH_DELAY, WEAPON_DEFINITIONS };
})();

(() => {
const THREE = globalThis.THREE;
const { playShootSound, playWeaponSwitchSound, stopShootSound } = __bundle["src/audio/placeholders.js"];
const { WEAPON_DEFINITIONS, WEAPON_SWITCH_DELAY, getWeaponDefinitionByIndex } = __bundle["src/weapons/weaponTypes.js"];
const baseTint = new THREE.Color();

function createWeaponVisual() {
  const root = new THREE.Group();

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.16, 0.38),
    new THREE.MeshStandardMaterial({
      color: 0x1c2432,
      emissive: 0x0b1220,
      emissiveIntensity: 0.7,
      roughness: 0.44,
      metalness: 0.82,
    }),
  );
  root.add(base);

  const barrel = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.14, 0.78),
    new THREE.MeshStandardMaterial({
      color: 0x74dfff,
      emissive: 0x2b89d8,
      emissiveIntensity: 1.2,
      roughness: 0.18,
      metalness: 0.5,
    }),
  );
  barrel.position.z = -0.48;
  root.add(barrel);

  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 14, 12),
    new THREE.MeshStandardMaterial({
      color: 0x74dfff,
      emissive: 0x3fb8ff,
      emissiveIntensity: 2.2,
      roughness: 0.08,
      metalness: 0.04,
    }),
  );
  glow.position.z = -0.9;
  root.add(glow);

  return {
    root,
    base,
    barrel,
    glow,
    materials: {
      base: base.material,
      barrel: barrel.material,
      glow: glow.material,
    },
  };
}

class WeaponSystem {
  constructor({ ship, ownerTag = "player" }) {
    this.ship = ship;
    this.ownerTag = ownerTag;
    this.weaponDefinitions = WEAPON_DEFINITIONS;
    this.currentWeaponIndex = 0;
    this.pendingWeaponIndex = null;
    this.switchTimer = 0;
    this.fireCooldown = 0;
    this.weaponVisualDeploy = 1;
    this.muzzleHeat = 0;
    this.mountCycleIndex = 0;
    this.switchPulse = 0;
    this.fireFlash = 0;
    this.pendingCameraShake = 0;
    this.pendingHudPulse = 0;

    this.visuals = [
      createWeaponVisual(),
      createWeaponVisual(),
    ];

    this.ship.leftWeaponMount.add(this.visuals[0].root);
    this.ship.rightWeaponMount.add(this.visuals[1].root);
    this.applyWeaponVisualState(this.currentWeapon, true);
  }

  get currentWeapon() {
    return getWeaponDefinitionByIndex(this.currentWeaponIndex);
  }

  get isSwitching() {
    return this.switchTimer > 0;
  }

  requestWeaponSwitch(nextWeaponIndex) {
    const nextWeapon = getWeaponDefinitionByIndex(nextWeaponIndex);

    if (!nextWeapon) {
      return;
    }

    if (nextWeaponIndex === this.currentWeaponIndex || nextWeaponIndex === this.pendingWeaponIndex) {
      return;
    }

    this.pendingWeaponIndex = nextWeaponIndex;
    this.switchTimer = WEAPON_SWITCH_DELAY;
    this.fireCooldown = Math.max(this.fireCooldown, WEAPON_SWITCH_DELAY);
    this.switchPulse = 1;
    this.pendingHudPulse = Math.max(this.pendingHudPulse, 1);
    playWeaponSwitchSound();
  }

  update(deltaTime, inputController, projectileSystem, { energySystem } = {}) {
    const requestedWeaponIndex = inputController?.consumeWeaponSwitchRequest();

    if (requestedWeaponIndex !== null && requestedWeaponIndex !== undefined) {
      this.requestWeaponSwitch(requestedWeaponIndex);
    }

    this.fireCooldown = Math.max(0, this.fireCooldown - deltaTime);

    if (this.switchTimer > 0) {
      this.switchTimer = Math.max(0, this.switchTimer - deltaTime);

      if (this.switchTimer === 0 && this.pendingWeaponIndex !== null) {
        this.currentWeaponIndex = this.pendingWeaponIndex;
        this.pendingWeaponIndex = null;
        this.applyWeaponVisualState(this.currentWeapon);
      }
    }

    this.weaponVisualDeploy = THREE.MathUtils.damp(
      this.weaponVisualDeploy,
      this.isSwitching ? 0.28 : 1,
      9,
      deltaTime,
    );
    this.muzzleHeat = THREE.MathUtils.damp(this.muzzleHeat, 0, 8.5, deltaTime);
    this.switchPulse = THREE.MathUtils.damp(this.switchPulse, 0, 7.5, deltaTime);
    this.fireFlash = THREE.MathUtils.damp(this.fireFlash, 0, 10.5, deltaTime);
    this.updateVisuals();

    if (!projectileSystem || !inputController?.isFiring() || this.isSwitching) {
      stopShootSound();
      return;
    }

    if (this.fireCooldown > 0) {
      return;
    }

    const didFire = this.fire(projectileSystem, energySystem);

    if (!didFire) {
      stopShootSound();
    }
  }

  fire(projectileSystem, energySystem) {
    const activeWeapon = this.currentWeapon;

    if (energySystem && !energySystem.consume(activeWeapon.energyCost ?? 0)) {
      return false;
    }

    const mounts = this.getFiringMounts(activeWeapon.firePattern);

    for (const mount of mounts) {
      projectileSystem.spawnProjectile({
        weaponDefinition: activeWeapon,
        origin: mount,
        ownerVelocity: this.ship.velocity,
        ownerTag: this.ownerTag,
      });
    }

    this.fireCooldown = activeWeapon.cooldown;
    this.muzzleHeat = 1;
    this.fireFlash = 1;
    this.pendingCameraShake += activeWeapon.cameraShake ?? 0.08;
    this.pendingHudPulse = Math.max(this.pendingHudPulse, 1);
    this.ship.triggerWeaponRecoil(activeWeapon.recoil);
    playShootSound();
    return true;
  }

  getFiringMounts(firePattern) {
    if (firePattern === "dual") {
      return [this.ship.leftWeaponMount, this.ship.rightWeaponMount];
    }

    const nextMount = this.mountCycleIndex % 2 === 0
      ? this.ship.leftWeaponMount
      : this.ship.rightWeaponMount;

    this.mountCycleIndex += 1;

    return [nextMount];
  }

  applyWeaponVisualState(weaponDefinition, immediate = false) {
    for (const visual of this.visuals) {
      baseTint.setHex(weaponDefinition.glowColor).multiplyScalar(0.12);
      visual.materials.base.emissive.copy(baseTint);
      visual.materials.barrel.color.setHex(weaponDefinition.weaponColor);
      visual.materials.barrel.emissive.setHex(weaponDefinition.glowColor);
      visual.materials.barrel.emissiveIntensity = weaponDefinition.barrelEmissiveIntensity;
      visual.materials.glow.color.setHex(weaponDefinition.weaponColor);
      visual.materials.glow.emissive.setHex(weaponDefinition.glowColor);
      visual.materials.glow.emissiveIntensity = weaponDefinition.glowIntensity;

      if (immediate) {
        visual.root.position.set(0, 0, 0);
      }
    }
  }

  updateVisuals() {
    const activeWeapon = this.currentWeapon;
    const deployDepth = 1 - this.weaponVisualDeploy;
    const flashLevel = this.fireFlash + this.switchPulse * 0.65;

    for (let index = 0; index < this.visuals.length; index += 1) {
      const visual = this.visuals[index];
      const heatScale = 1 + this.muzzleHeat * 0.28;
      const side = index === 0 ? -1 : 1;
      const rootScale = 1 + flashLevel * 0.08;

      visual.root.position.z = deployDepth * 0.38;
      visual.root.position.y = -deployDepth * 0.05;
      visual.root.position.x = side * deployDepth * 0.05;
      visual.root.rotation.y = side * deployDepth * 0.55;
      visual.root.scale.set(rootScale, rootScale, rootScale);

      visual.barrel.scale.set(
        activeWeapon.barrelScale[0],
        activeWeapon.barrelScale[1],
        activeWeapon.barrelScale[2] * this.weaponVisualDeploy,
      );
      visual.barrel.position.z = -0.42 - activeWeapon.barrelScale[2] * 0.16 * this.weaponVisualDeploy;

      visual.glow.position.z = visual.barrel.position.z - 0.42 * this.weaponVisualDeploy;
      visual.glow.scale.set(
        activeWeapon.muzzleScale[0] * heatScale,
        activeWeapon.muzzleScale[1] * heatScale,
        activeWeapon.muzzleScale[2] * heatScale,
      );
      visual.materials.glow.emissiveIntensity = activeWeapon.glowIntensity * (0.72 + this.muzzleHeat * 0.58 + flashLevel * 0.38);
      visual.materials.barrel.emissiveIntensity = activeWeapon.barrelEmissiveIntensity * (0.7 + this.muzzleHeat * 0.5 + flashLevel * 0.2);
    }
  }

  consumeCameraShake() {
    const shakeAmount = this.pendingCameraShake;
    this.pendingCameraShake = 0;
    return shakeAmount;
  }

  consumeHudPulse() {
    const hudPulse = this.pendingHudPulse;
    this.pendingHudPulse = 0;
    return hudPulse;
  }

  getHudState() {
    const pendingWeapon = this.pendingWeaponIndex !== null
      ? getWeaponDefinitionByIndex(this.pendingWeaponIndex)
      : null;

    return {
      currentWeapon: this.currentWeapon,
      pendingWeapon,
      displayWeapon: pendingWeapon ?? this.currentWeapon,
      isSwitching: this.isSwitching,
      switchProgress: pendingWeapon ? 1 - this.switchTimer / WEAPON_SWITCH_DELAY : 1,
      heat: this.muzzleHeat,
      indicatorLevel: Math.max(this.switchPulse, this.fireFlash),
    };
  }
}
__bundle["src/weapons/WeaponSystem.js"] = { WeaponSystem };
})();

(() => {
const THREE = globalThis.THREE;
const { playBoostSound, playEngineSound } = __bundle["src/audio/placeholders.js"];
const { Spaceship } = __bundle["src/entities/Spaceship.js"];
const { WeaponSystem } = __bundle["src/weapons/WeaponSystem.js"];
const forwardVector = new THREE.Vector3();
const rightVector = new THREE.Vector3();
const upVector = new THREE.Vector3();
const accelerationVector = new THREE.Vector3();
const targetAngularVelocity = new THREE.Vector3();

class PlayerShip extends Spaceship {
  constructor() {
    super();

    this.translationInput = new THREE.Vector3();
    this.rotationInput = new THREE.Vector3();
    this.maxSpeed = 34;
    this.baseMaxSpeed = 34;
    this.boostMaxSpeed = 52;
    this.forwardAcceleration = 42;
    this.reverseAcceleration = 32;
    this.strafeAcceleration = 20;
    this.verticalAcceleration = 22;
    this.linearDamping = 1.28;
    this.angularDamping = 3.9;
    this.pitchSpeed = 1.9;
    this.yawSpeed = 2.1;
    this.rollSpeed = 2.35;
    this.angularResponsiveness = 6.4;
    this.hasPlayedEngineSound = false;
    this.weaponSystem = new WeaponSystem({ ship: this });
    this.maxHealth = 120;
    this.health = this.maxHealth;
    this.collisionRadius = 1.4;
    this.boostVisualAmount = 0;
    this.wasBoosting = false;
    this.boostEnergyDrain = 15;
    this.isBoosting = false;
    this.updateCollisionBounds();
  }

  update(deltaTime, inputController, projectileSystem, { energySystem } = {}) {
    if (this.isDestroyed) {
      this.translationInput.set(0, 0, 0);
      this.rotationInput.set(0, 0, 0);
      this.isBoosting = false;
      super.update(deltaTime);
      return;
    }

    if (inputController) {
      this.translationInput.copy(inputController.getTranslationInput());
      this.rotationInput.copy(inputController.getRotationInput());
    } else {
      this.translationInput.set(0, 0, 0);
      this.rotationInput.set(0, 0, 0);
    }

    const wantsBoost = inputController?.isBoosting() ?? false;
    const isBoosting = wantsBoost && (!energySystem || energySystem.consumeRate(this.boostEnergyDrain, deltaTime));
    this.isBoosting = isBoosting;

    this.getForwardVector(forwardVector);
    this.getRightVector(rightVector);
    this.getUpVector(upVector);

    accelerationVector.set(0, 0, 0);
    accelerationVector.addScaledVector(rightVector, this.translationInput.x * this.strafeAcceleration);
    accelerationVector.addScaledVector(upVector, this.translationInput.y * this.verticalAcceleration);
    accelerationVector.addScaledVector(
      forwardVector,
      this.translationInput.z * (this.translationInput.z >= 0 ? this.forwardAcceleration : this.reverseAcceleration) * (isBoosting ? 1.32 : 1),
    );

    this.velocity.addScaledVector(accelerationVector, deltaTime);
    this.maxSpeed = isBoosting ? this.boostMaxSpeed : this.baseMaxSpeed;

    const speed = this.velocity.length();

    if (speed > this.maxSpeed) {
      this.velocity.setLength(this.maxSpeed);
    }

    targetAngularVelocity.set(
      this.rotationInput.x * this.pitchSpeed,
      this.rotationInput.y * this.yawSpeed,
      this.rotationInput.z * this.rollSpeed,
    );

    this.angularVelocity.x = THREE.MathUtils.damp(this.angularVelocity.x, targetAngularVelocity.x, this.angularResponsiveness, deltaTime);
    this.angularVelocity.y = THREE.MathUtils.damp(this.angularVelocity.y, targetAngularVelocity.y, this.angularResponsiveness, deltaTime);
    this.angularVelocity.z = THREE.MathUtils.damp(this.angularVelocity.z, targetAngularVelocity.z, this.angularResponsiveness, deltaTime);

    const targetBoostAmount = speed > 0.2
      ? THREE.MathUtils.clamp(speed / this.boostMaxSpeed + (isBoosting ? 0.22 : 0.08), 0, 1)
      : 0;
    this.boostVisualAmount = THREE.MathUtils.damp(this.boostVisualAmount, targetBoostAmount, 4.2, deltaTime);
    this.boostAmount = Math.max(this.boostAmount, this.boostVisualAmount * (isBoosting ? 0.88 : 0.46));

    this.tilt(this.translationInput.x * 0.24 - this.rotationInput.z * 0.36);

    this.attitudeOffset.x = -this.rotationInput.x * 0.09 - this.translationInput.y * 0.04;
    this.attitudeOffset.y = this.rotationInput.y * 0.05;
    this.attitudeOffset.z = -this.translationInput.x * 0.06 + this.rotationInput.z * 0.05;
    this.setWeaponModeOffset(this.rotationInput.y * 0.15);

    if (!this.hasPlayedEngineSound && this.translationInput.lengthSq() > 0) {
      playEngineSound();
      this.hasPlayedEngineSound = true;
    }

    if (isBoosting && this.boostVisualAmount > 0.78 && !this.wasBoosting) {
      playBoostSound();
      this.wasBoosting = true;
    }

    super.update(deltaTime);
    this.weaponSystem.update(deltaTime, inputController, projectileSystem, { energySystem });

    if (this.translationInput.lengthSq() === 0 && this.velocity.lengthSq() < 0.04) {
      this.hasPlayedEngineSound = false;
    }

    if (!isBoosting || this.boostVisualAmount < 0.28) {
      this.wasBoosting = false;
    }
  }

  respawn(position = new THREE.Vector3(0, 0, 0)) {
    this.restore({ position });
    this.hasPlayedEngineSound = false;
    this.boostVisualAmount = 0;
    this.wasBoosting = false;
    this.isBoosting = false;
  }

  getHealthRatio() {
    return this.health / this.maxHealth;
  }
}
__bundle["src/entities/PlayerShip.js"] = { PlayerShip };
})();

(() => {
const ENEMY_WEAPON_DEFINITION = {
  id: "enemy-bolt",
  label: "Enemy Bolt",
  firePattern: "alternating",
  cooldown: 1.05,
  projectileSpeed: 48,
  projectileLifetime: 3,
  projectileStyle: "enemy",
  projectileScale: [1, 1, 1],
  collisionRadius: 0.14,
  damage: 14,
  recoil: 0.1,
  spawnOffset: 0.48,
  velocityInheritance: 0.12,
  weaponColor: 0xff926c,
  glowColor: 0xff5c4f,
  trailOpacity: 0.26,
  trailLength: 1.18,
  impactScale: 0.72,
  cameraShake: 0.06,
};
__bundle["src/weapons/enemyWeaponDefinition.js"] = { ENEMY_WEAPON_DEFINITION };
})();

(() => {
const THREE = globalThis.THREE;
const { playEnemyShootSound } = __bundle["src/audio/placeholders.js"];
const { ENEMY_WEAPON_DEFINITION } = __bundle["src/weapons/enemyWeaponDefinition.js"];
const { Spaceship } = __bundle["src/entities/Spaceship.js"];
const ENEMY_ARCHETYPES = {
  "fast-attacker": {
    id: "fast-attacker",
    label: "Fast Attacker",
    bodyColor: 0x281721,
    wingColor: 0x3f2133,
    accentColor: 0xff8a89,
    glowColor: 0xff5d8a,
    explosionColor: 0xff8c84,
    explosionScale: 1,
    maxHealth: 38,
    collisionRadius: 1.16,
    scaleRange: [0.84, 0.94],
    maxSpeed: 14.8,
    accelerationForce: 17.4,
    preferredRange: 20,
    attackRange: 56,
    baseFireCooldown: 0.46,
    turnSpeed: 6.2,
    strafeAmplitude: 7.4,
    hoverAmplitude: 2.2,
    leadFactor: 0.08,
    retreatThreshold: 0.56,
    retreatForce: 4.5,
    aimNoiseX: 2.4,
    aimNoiseY: 1.6,
    weaponSway: 0.2,
    weaponDefinition: {
      ...ENEMY_WEAPON_DEFINITION,
      id: "enemy-needle",
      label: "Needler",
      firePattern: "alternating",
      cooldown: 0.56,
      projectileSpeed: 86,
      projectileLifetime: 3,
      projectileStyle: "rapid",
      projectileScale: [0.85, 0.85, 0.9],
      collisionRadius: 0.09,
      damage: 9,
      recoil: 0.05,
      weaponColor: 0xff97b2,
      glowColor: 0xff5d8a,
      trailOpacity: 0.22,
      trailLength: 1.08,
      impactScale: 0.58,
      cameraShake: 0.06,
    },
  },
  "heavy-tank": {
    id: "heavy-tank",
    label: "Heavy Tank",
    bodyColor: 0x2b231b,
    wingColor: 0x413226,
    accentColor: 0xffbf6b,
    glowColor: 0xff7d52,
    explosionColor: 0xffbb72,
    explosionScale: 1.55,
    maxHealth: 108,
    collisionRadius: 1.72,
    scaleRange: [1.2, 1.32],
    maxSpeed: 7.2,
    accelerationForce: 8.2,
    preferredRange: 30,
    attackRange: 74,
    baseFireCooldown: 1.18,
    turnSpeed: 3.2,
    strafeAmplitude: 2.4,
    hoverAmplitude: 1.35,
    leadFactor: 0.18,
    retreatThreshold: 0.48,
    retreatForce: 3.2,
    aimNoiseX: 0.85,
    aimNoiseY: 0.6,
    weaponSway: 0.1,
    weaponDefinition: {
      ...ENEMY_WEAPON_DEFINITION,
      id: "enemy-siege",
      label: "Siege Plasma",
      firePattern: "dual",
      cooldown: 1.48,
      projectileSpeed: 52,
      projectileLifetime: 4.2,
      projectileStyle: "plasma",
      projectileScale: [1.34, 1.34, 1.34],
      collisionRadius: 0.22,
      damage: 24,
      recoil: 0.2,
      weaponColor: 0xffcd7e,
      glowColor: 0xff8959,
      trailOpacity: 0.42,
      trailLength: 2.05,
      impactScale: 1.18,
      cameraShake: 0.12,
    },
  },
  shooter: {
    id: "shooter",
    label: "Shooter",
    bodyColor: 0x1b2332,
    wingColor: 0x25384a,
    accentColor: 0x7ec5ff,
    glowColor: 0x5d95ff,
    explosionColor: 0x86b9ff,
    explosionScale: 1.18,
    maxHealth: 56,
    collisionRadius: 1.32,
    scaleRange: [0.98, 1.08],
    maxSpeed: 9.5,
    accelerationForce: 11.4,
    preferredRange: 34,
    attackRange: 68,
    baseFireCooldown: 0.72,
    turnSpeed: 4.25,
    strafeAmplitude: 4.8,
    hoverAmplitude: 2.6,
    leadFactor: 0.2,
    retreatThreshold: 0.68,
    retreatForce: 5,
    aimNoiseX: 1.1,
    aimNoiseY: 0.9,
    weaponSway: 0.14,
    weaponDefinition: {
      ...ENEMY_WEAPON_DEFINITION,
      id: "enemy-lance",
      label: "Lance Beam",
      firePattern: "alternating",
      cooldown: 0.86,
      projectileSpeed: 72,
      projectileLifetime: 4,
      projectileStyle: "laser",
      projectileScale: [1, 1, 1],
      collisionRadius: 0.13,
      damage: 15,
      recoil: 0.1,
      weaponColor: 0x8cc2ff,
      glowColor: 0x6086ff,
      trailOpacity: 0.28,
      trailLength: 1.45,
      impactScale: 0.78,
      cameraShake: 0.08,
    },
  },
};

const FORWARD_VECTOR = new THREE.Vector3(0, 0, -1);
const desiredPosition = new THREE.Vector3();
const desiredDirection = new THREE.Vector3();
const aimPoint = new THREE.Vector3();
const aimNoise = new THREE.Vector3();
const toPlayer = new THREE.Vector3();
const toPlayerDirection = new THREE.Vector3();
const targetQuaternion = new THREE.Quaternion();
const playerForward = new THREE.Vector3();
const playerRight = new THREE.Vector3();
const playerUp = new THREE.Vector3();

class EnemyShip extends Spaceship {
  constructor({
    spawnPosition = new THREE.Vector3(),
    archetypeId = "shooter",
  } = {}) {
    const archetype = ENEMY_ARCHETYPES[archetypeId] ?? ENEMY_ARCHETYPES.shooter;
    super({
      bodyColor: archetype.bodyColor,
      wingColor: archetype.wingColor,
      accentColor: archetype.accentColor,
      glowColor: archetype.glowColor,
    });

    this.archetype = archetype;
    this.typeId = archetype.id;
    this.typeLabel = archetype.label;
    this.group.position.copy(spawnPosition);
    this.group.scale.setScalar(THREE.MathUtils.randFloat(...archetype.scaleRange));

    this.maxHealth = archetype.maxHealth;
    this.health = this.maxHealth;
    this.collisionRadius = archetype.collisionRadius;
    this.maxSpeed = archetype.maxSpeed;
    this.accelerationForce = archetype.accelerationForce;
    this.preferredRange = archetype.preferredRange;
    this.attackRange = archetype.attackRange;
    this.baseFireCooldown = archetype.baseFireCooldown;
    this.fireCooldown = THREE.MathUtils.randFloat(0.05, Math.max(0.12, archetype.baseFireCooldown * 0.4));
    this.turnSpeed = archetype.turnSpeed;
    this.aiTime = Math.random() * 100;
    this.strafePhase = Math.random() * Math.PI * 2;
    this.hoverPhase = Math.random() * Math.PI * 2;
    this.aimPhase = Math.random() * Math.PI * 2;
    this.mountCycleIndex = Math.round(Math.random());
    this.weaponDefinition = archetype.weaponDefinition;
    this.explosionScale = archetype.explosionScale;
    this.scoreValue = Math.round(archetype.maxHealth * 8);
    this.healthReward = Math.max(8, Math.round(archetype.maxHealth * 0.16));
    this.patrolAnchor = spawnPosition.clone();
    this.visionRange = Math.max(this.attackRange * 1.7, this.preferredRange + 34);
    this.visionHalfAngle = THREE.MathUtils.degToRad(this.typeId === "heavy-tank" ? 38 : 46);

    this.addCombatArmor();
    this.addWeaponPods();
    this.updateCollisionBounds();
  }

  setPatrolAnchor(position) {
    this.patrolAnchor.copy(position);
  }

  addCombatArmor() {
    const armorMaterial = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: this.archetype.accentColor,
      emissive: this.archetype.glowColor,
      emissiveIntensity: 1.05,
      roughness: 0.24,
      metalness: 0.72,
    }));

    const dorsalFin = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.95, 1.05),
      armorMaterial,
    );
    dorsalFin.position.set(0, 0.72, 1.18);
    dorsalFin.rotation.x = -0.16;
    this.visualRoot.add(dorsalFin);

    if (this.typeId === "fast-attacker") {
      for (const side of [-1, 1]) {
        const spearWing = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 0.22, 1.7),
          armorMaterial,
        );
        spearWing.position.set(0.92 * side, 0.08, -0.8);
        spearWing.rotation.z = -0.4 * side;
        spearWing.rotation.y = 0.2 * side;
        this.visualRoot.add(spearWing);
      }
    } else if (this.typeId === "heavy-tank") {
      for (const side of [-1, 1]) {
        const shoulder = new THREE.Mesh(
          new THREE.BoxGeometry(0.4, 0.3, 1.2),
          armorMaterial,
        );
        shoulder.position.set(0.92 * side, 0.08, 0.35);
        shoulder.rotation.y = 0.08 * side;
        this.visualRoot.add(shoulder);
      }
    } else {
      for (const side of [-1, 1]) {
        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(0.18, 0.42, 1.45),
          armorMaterial,
        );
        blade.position.set(0.82 * side, 0.12, -0.58);
        blade.rotation.z = -0.32 * side;
        blade.rotation.y = 0.16 * side;
        this.visualRoot.add(blade);
      }
    }
  }

  addWeaponPods() {
    const podMaterial = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: 0x251820,
      emissive: 0x3b1d22,
      emissiveIntensity: 0.9,
      roughness: 0.4,
      metalness: 0.75,
    }));

    const muzzleMaterial = this.trackMaterial(new THREE.MeshStandardMaterial({
      color: this.archetype.accentColor,
      emissive: this.archetype.glowColor,
      emissiveIntensity: 1.8,
      roughness: 0.12,
      metalness: 0.18,
    }));

    const barrelLength = this.typeId === "heavy-tank" ? 0.86 : 0.62;
    const muzzleScale = this.typeId === "heavy-tank" ? 1.45 : 1.05;

    for (const mount of [this.leftWeaponMount, this.rightWeaponMount]) {
      const pod = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.16, barrelLength),
        podMaterial,
      );
      pod.position.z = -0.28;
      mount.add(pod);

      const muzzle = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 12, 12),
        muzzleMaterial,
      );
      muzzle.position.z = -0.44 - barrelLength * 0.5;
      muzzle.scale.set(muzzleScale, muzzleScale, 1.25 * muzzleScale);
      mount.add(muzzle);
    }
  }

  getFiringMounts() {
    if (this.weaponDefinition.firePattern === "dual") {
      return [this.leftWeaponMount, this.rightWeaponMount];
    }

    const mount = this.mountCycleIndex % 2 === 0 ? this.leftWeaponMount : this.rightWeaponMount;
    this.mountCycleIndex += 1;
    return [mount];
  }

  update(deltaTime, { player, projectileSystem, perception } = {}) {
    if (this.isDestroyed || !player) {
      super.update(deltaTime);
      return;
    }

    this.aiTime += deltaTime;

    toPlayer.copy(player.position).sub(this.position);
    const distanceToPlayer = Math.max(toPlayer.length(), 0.001);
    toPlayerDirection.copy(toPlayer).normalize();

    const awarenessState = perception?.state ?? "alerted";
    const lastKnownTarget = perception?.lastKnownPosition ?? player.position;

    player.getForwardVector(playerForward);
    player.getRightVector(playerRight);
    player.getUpVector(playerUp);

    if (awarenessState === "idle") {
      desiredPosition.copy(this.patrolAnchor)
        .addScaledVector(playerRight, Math.sin(this.aiTime * 1.1 + this.strafePhase) * this.archetype.strafeAmplitude * 0.55)
        .addScaledVector(playerUp, Math.cos(this.aiTime * 0.9 + this.hoverPhase) * this.archetype.hoverAmplitude * 0.65);
      desiredDirection.copy(desiredPosition).sub(this.position);
    } else if (awarenessState === "suspicious") {
      desiredPosition.copy(lastKnownTarget)
        .addScaledVector(playerRight, Math.sin(this.aiTime * 1.25 + this.strafePhase) * this.archetype.strafeAmplitude * 0.42)
        .addScaledVector(playerUp, Math.cos(this.aiTime * 0.95 + this.hoverPhase) * this.archetype.hoverAmplitude * 0.55);
      desiredDirection.copy(desiredPosition).sub(this.position);

      if (distanceToPlayer > this.preferredRange * 0.85) {
        desiredDirection.addScaledVector(toPlayerDirection, 3.8);
      }
    } else {
      desiredPosition.copy(player.position)
        .addScaledVector(playerRight, Math.sin(this.aiTime * 1.45 + this.strafePhase) * this.archetype.strafeAmplitude)
        .addScaledVector(playerUp, Math.cos(this.aiTime * 1.12 + this.hoverPhase) * this.archetype.hoverAmplitude);

      desiredDirection.copy(desiredPosition).sub(this.position);

      if (distanceToPlayer > this.preferredRange) {
        desiredDirection.addScaledVector(
          toPlayerDirection,
          6.4 + Math.min(distanceToPlayer - this.preferredRange, 18) * 0.42,
        );
      } else if (distanceToPlayer < this.preferredRange * this.archetype.retreatThreshold) {
        desiredDirection.addScaledVector(toPlayerDirection, -this.archetype.retreatForce * 1.2);
      }
    }

    if (desiredDirection.lengthSq() > 0.001) {
      desiredDirection.normalize();
      const accelerationScale = awarenessState === "idle"
        ? 0.52
        : awarenessState === "suspicious"
          ? 0.72
          : 1;
      this.velocity.addScaledVector(desiredDirection, this.accelerationForce * accelerationScale * deltaTime);
    }

    const activeMaxSpeed = awarenessState === "idle"
      ? this.maxSpeed * 0.55
      : awarenessState === "suspicious"
        ? this.maxSpeed * 0.78
        : this.maxSpeed;

    if (this.velocity.length() > activeMaxSpeed) {
      this.velocity.setLength(activeMaxSpeed);
    }

    const strafeWave = Math.sin(this.aiTime * 1.75 + this.strafePhase);
    this.tilt(-strafeWave * 0.65);
    this.attitudeOffset.x = -this.velocity.y * 0.02;
    this.attitudeOffset.y = strafeWave * 0.045;
    this.attitudeOffset.z = this.velocity.x * 0.03;
    this.setWeaponModeOffset(Math.sin(this.aiTime * 1.1 + this.hoverPhase) * this.archetype.weaponSway);

    super.update(deltaTime);

    aimNoise.set(
      Math.sin(this.aiTime * 1.9 + this.aimPhase) * this.archetype.aimNoiseX,
      Math.cos(this.aiTime * 1.45 + this.aimPhase) * this.archetype.aimNoiseY,
      0,
    );

    aimPoint.copy(awarenessState === "alerted" ? player.position : lastKnownTarget)
      .addScaledVector(player.velocity, awarenessState === "alerted" ? this.archetype.leadFactor : this.archetype.leadFactor * 0.3)
      .add(aimNoise);

    desiredDirection.copy(aimPoint).sub(this.position).normalize();
    targetQuaternion.setFromUnitVectors(FORWARD_VECTOR, desiredDirection);
    this.group.quaternion.slerp(targetQuaternion, 1 - Math.exp(-this.turnSpeed * deltaTime));

    const canFireAtPlayer = awarenessState === "alerted"
      || (awarenessState === "suspicious" && perception?.canSeePlayer);
    const effectiveAttackRange = awarenessState === "suspicious"
      ? this.attackRange * 0.88
      : this.attackRange;

    if (canFireAtPlayer && !player.isDestroyed && distanceToPlayer <= effectiveAttackRange) {
      const cooldownStep = awarenessState === "alerted" ? deltaTime : deltaTime * 0.82;
      this.fireCooldown = Math.max(0, this.fireCooldown - cooldownStep);

      if (this.fireCooldown === 0 && projectileSystem) {
        for (const mount of this.getFiringMounts()) {
          projectileSystem.spawnProjectile({
            weaponDefinition: this.weaponDefinition,
            origin: mount,
            ownerVelocity: this.velocity,
            ownerTag: "enemy",
          });
        }

        this.triggerWeaponRecoil(this.weaponDefinition.recoil);
        const reactionDelay = awarenessState === "alerted" ? 1 : 1.18;
        this.fireCooldown = this.baseFireCooldown * reactionDelay + Math.random() * 0.24;
        playEnemyShootSound();
      }
    }
  }
}
__bundle["src/entities/EnemyShip.js"] = { EnemyShip };
})();

(() => {
const THREE = globalThis.THREE;
const { EnemyShip } = __bundle["src/entities/EnemyShip.js"];
const spawnPosition = new THREE.Vector3();
const candidateSpawnPosition = new THREE.Vector3();
const forwardVector = new THREE.Vector3();
const rightVector = new THREE.Vector3();
const upVector = new THREE.Vector3();
const enemyToPlayer = new THREE.Vector3();

class EnemyManager {
  constructor({
    scene,
    player,
    projectileSystem,
    explosionSystem,
    environmentManager,
    maxActiveEnemies = 4,
  }) {
    this.scene = scene;
    this.player = player;
    this.projectileSystem = projectileSystem;
    this.explosionSystem = explosionSystem;
    this.environmentManager = environmentManager;
    this.maxActiveEnemiesBase = maxActiveEnemies;
    this.maxActiveEnemies = maxActiveEnemies;
    this.enemies = [];
    this.spawnTimer = 0;
    this.spawnCounter = 0;
    this.currentWave = 0;
    this.enemiesToSpawnThisWave = 0;
    this.enemiesSpawnedThisWave = 0;
    this.waveInterval = 1.2;
    this.waveCooldown = 0;
    this.waveStatusLabel = "Scanning the void";
    this.enemyLeashDistance = 240;

    this.startNextWave(true);
  }

  update(deltaTime, { stealthSystem } = {}) {
    if (!this.player.isDestroyed && this.waveCooldown === 0 && this.enemiesSpawnedThisWave < this.enemiesToSpawnThisWave) {
      this.spawnTimer = Math.max(0, this.spawnTimer - deltaTime);

      if (this.spawnTimer === 0 && this.enemies.length < this.maxActiveEnemies) {
        this.spawnEnemy();
        this.spawnTimer = this.waveInterval * THREE.MathUtils.randFloat(0.82, 1.12);
      }
    }

    for (const enemy of this.enemies) {
      enemy.update(deltaTime, {
        player: this.player,
        projectileSystem: this.projectileSystem,
        perception: stealthSystem?.getEnemyPerception(enemy),
      });

      enemyToPlayer.copy(enemy.position).sub(this.player.position);

      if (enemyToPlayer.lengthSq() > this.enemyLeashDistance ** 2) {
        this.repositionEnemy(enemy);
      }
    }

    if (this.player.isDestroyed) {
      return;
    }

    if (this.waveCooldown > 0) {
      this.waveCooldown = Math.max(0, this.waveCooldown - deltaTime);
      this.waveStatusLabel = `Next wave in ${this.waveCooldown.toFixed(1)}s`;

      if (this.waveCooldown === 0) {
        this.startNextWave();
      }

      return;
    }

    if (this.enemiesSpawnedThisWave < this.enemiesToSpawnThisWave) {
      this.waveStatusLabel = `${this.getWaveState().enemiesRemaining} hostile signatures`;
    } else if (this.enemies.length === 0) {
      this.waveStatusLabel = `Wave ${this.currentWave} secured`;
      this.waveCooldown = 2.6;
    } else {
      this.waveStatusLabel = `${this.enemies.length} hostiles remaining`;
    }
  }

  startNextWave(isInitial = false) {
    this.currentWave += 1;
    this.enemiesToSpawnThisWave = 3 + this.currentWave * 2;
    this.enemiesSpawnedThisWave = 0;
    this.maxActiveEnemies = Math.min(this.maxActiveEnemiesBase + Math.floor(this.currentWave / 2), 9);
    this.waveInterval = Math.max(0.48, 1.42 - this.currentWave * 0.08);
    this.spawnTimer = isInitial ? 0.2 : 0.5;
    this.waveCooldown = 0;
    this.waveStatusLabel = isInitial
      ? `Wave ${this.currentWave} engaging`
      : `Wave ${this.currentWave} incoming`;
  }

  chooseArchetypeForWave() {
    const weightedPool = [
      { id: "shooter", weight: 4 + this.currentWave },
      { id: "fast-attacker", weight: this.currentWave >= 2 ? 2 + this.currentWave * 0.6 : 0 },
      { id: "heavy-tank", weight: this.currentWave >= 3 ? 1 + this.currentWave * 0.35 : 0 },
    ].filter((entry) => entry.weight > 0);

    const totalWeight = weightedPool.reduce((sum, entry) => sum + entry.weight, 0);
    let randomWeight = Math.random() * totalWeight;

    for (const entry of weightedPool) {
      randomWeight -= entry.weight;

      if (randomWeight <= 0) {
        return entry.id;
      }
    }

    return weightedPool[weightedPool.length - 1].id;
  }

  spawnEnemy() {
    const safeSpawnPosition = this.getSpawnPosition();

    const enemy = new EnemyShip({
      spawnPosition: safeSpawnPosition,
      archetypeId: this.chooseArchetypeForWave(),
    });

    this.spawnCounter += 1;
    enemy.debugId = this.spawnCounter;
    enemy.setPatrolAnchor(safeSpawnPosition);
    enemy.facePoint(this.player.position);
    enemy.fireCooldown = THREE.MathUtils.randFloat(0.02, Math.max(0.08, enemy.baseFireCooldown * 0.3));
    this.enemiesSpawnedThisWave += 1;
    this.enemies.push(enemy);
    this.scene.add(enemy.group);
    this.waveStatusLabel = `${this.getWaveState().enemiesRemaining} hostile signatures`;

    return enemy;
  }

  getSpawnPosition(minDistance = 30, maxDistance = 58) {
    this.player.getForwardVector(forwardVector);
    this.player.getRightVector(rightVector);
    this.player.getUpVector(upVector);

    let fallbackPosition = null;

    for (let attempt = 0; attempt < 8; attempt += 1) {
      const forwardDistance = THREE.MathUtils.randFloat(minDistance, maxDistance);
      const lateralSpread = THREE.MathUtils.randFloatSpread(34);
      const verticalSpread = THREE.MathUtils.randFloatSpread(22);

      candidateSpawnPosition.copy(this.player.position)
        .addScaledVector(forwardVector, forwardDistance)
        .addScaledVector(rightVector, lateralSpread)
        .addScaledVector(upVector, verticalSpread);

      const safePosition = this.environmentManager
        ? this.environmentManager.getSafePosition(candidateSpawnPosition, 1.9)
        : candidateSpawnPosition.clone();

      if (!fallbackPosition) {
        fallbackPosition = safePosition.clone();
      }

      if (!this.environmentManager || !this.environmentManager.isLineBlocked(safePosition, this.player.position)) {
        return safePosition;
      }
    }

    spawnPosition.copy(fallbackPosition ?? candidateSpawnPosition);
    return spawnPosition.clone();
  }

  repositionEnemy(enemy) {
    const nextPosition = this.getSpawnPosition(40, 74);
    enemy.group.position.copy(nextPosition);
    enemy.setPatrolAnchor(nextPosition);
    enemy.facePoint(this.player.position);
    enemy.velocity.set(0, 0, 0);
    enemy.angularVelocity.set(0, 0, 0);
    enemy.fireCooldown = THREE.MathUtils.randFloat(0.04, Math.max(0.12, enemy.baseFireCooldown * 0.38));
    enemy.updateCollisionBounds();
  }

  destroyEnemy(enemy) {
    const enemyIndex = this.enemies.indexOf(enemy);

    if (enemyIndex < 0) {
      return;
    }

    this.enemies.splice(enemyIndex, 1);
    this.scene.remove(enemy.group);
    enemy.dispose();

    this.explosionSystem.spawnExplosion({
      position: enemy.position.clone(),
      color: enemy.archetype.explosionColor,
      scale: enemy.explosionScale,
    });

    this.spawnTimer = Math.min(this.spawnTimer, THREE.MathUtils.randFloat(0.18, 0.45));
    this.waveStatusLabel = `${this.getWaveState().enemiesRemaining} hostile signatures`;
  }

  clearEnemies() {
    for (const enemy of this.enemies) {
      this.scene.remove(enemy.group);
      enemy.dispose();
    }

    this.enemies.length = 0;
  }

  reset() {
    this.clearEnemies();
    this.spawnTimer = 0;
    this.spawnCounter = 0;
    this.currentWave = 0;
    this.enemiesToSpawnThisWave = 0;
    this.enemiesSpawnedThisWave = 0;
    this.waveInterval = 1.2;
    this.waveCooldown = 0;
    this.waveStatusLabel = "Scanning the void";
    this.maxActiveEnemies = this.maxActiveEnemiesBase;
    this.startNextWave(true);
  }

  getWaveState() {
    const enemiesRemaining = this.enemies.length + (this.enemiesToSpawnThisWave - this.enemiesSpawnedThisWave);

    return {
      currentWave: this.currentWave,
      enemiesRemaining,
      statusLabel: this.waveStatusLabel,
    };
  }

  dispose() {
    this.clearEnemies();
  }
}
__bundle["src/game/EnemyManager.js"] = { EnemyManager };
})();

(() => {
const THREE = globalThis.THREE;
const rotatedPositionOffset = new THREE.Vector3();
const rotatedLookOffset = new THREE.Vector3();
const forwardVector = new THREE.Vector3();

class FollowCamera {
  constructor(camera, player) {
    this.camera = camera;
    this.player = player;
    this.positionOffset = new THREE.Vector3(0, 2.6, 10.5);
    this.lookOffset = new THREE.Vector3(0, 0.4, -15);
    this.desiredPosition = new THREE.Vector3();
    this.lookTarget = new THREE.Vector3();
    this.shakeOffset = new THREE.Vector3();
    this.baseFov = camera.fov;
    this.shakeIntensity = 0;
    this.lastAppliedFov = camera.fov;
    this.timeDilationAmount = 0;
    this.gravityInfluence = 0;
  }

  update(deltaTime) {
    const playerPosition = this.player.group.position;
    const velocity = this.player.velocity;
    const shipQuaternion = this.player.group.quaternion;

    rotatedPositionOffset.copy(this.positionOffset).applyQuaternion(shipQuaternion);
    rotatedLookOffset.copy(this.lookOffset).applyQuaternion(shipQuaternion);
    this.player.getForwardVector(forwardVector);

    this.desiredPosition.copy(playerPosition).add(rotatedPositionOffset);
    this.desiredPosition.addScaledVector(velocity, -0.08);

    const cameraBlend = 1 - Math.exp(-2.55 * deltaTime);
    this.camera.position.lerp(this.desiredPosition, cameraBlend);

    this.lookTarget.copy(playerPosition)
      .add(rotatedLookOffset)
      .addScaledVector(forwardVector, 6.5)
      .addScaledVector(velocity, 0.04);

    this.shakeIntensity = THREE.MathUtils.damp(
      this.shakeIntensity,
      this.gravityInfluence * 0.08,
      10.5,
      deltaTime,
    );
    this.shakeOffset.set(
      THREE.MathUtils.randFloatSpread(1),
      THREE.MathUtils.randFloatSpread(1),
      THREE.MathUtils.randFloatSpread(1),
    ).multiplyScalar(this.shakeIntensity);

    this.camera.position.add(this.shakeOffset);

    const targetFov = this.baseFov
      - (this.player.boostVisualAmount ?? 0) * 3.3
      - this.timeDilationAmount * 4.4
      + this.gravityInfluence * 1.05
      + this.shakeIntensity * 1.2;
    this.camera.fov = THREE.MathUtils.damp(this.camera.fov, targetFov, 5.4, deltaTime);

    if (Math.abs(this.camera.fov - this.lastAppliedFov) > 0.01) {
      this.camera.updateProjectionMatrix();
      this.lastAppliedFov = this.camera.fov;
    }

    this.camera.lookAt(this.lookTarget.addScaledVector(this.shakeOffset, 0.18));
  }

  addShake(intensity = 0.12) {
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
  }

  setTimeDilation(amount = 0) {
    this.timeDilationAmount = amount;
  }

  setGravityInfluence(amount = 0) {
    this.gravityInfluence = amount;
  }
}
__bundle["src/game/FollowCamera.js"] = { FollowCamera };
})();

(() => {
const { playEnergyLowSound } = __bundle["src/audio/placeholders.js"];
class EnergySystem {
  constructor({
    maxEnergy = 100,
    regenerationRate = 18,
    lowThreshold = 18,
  } = {}) {
    this.maxEnergy = maxEnergy;
    this.energy = maxEnergy;
    this.regenerationRate = regenerationRate;
    this.lowThreshold = lowThreshold;
    this.lowSoundCooldown = 0;
    this.alertPulse = 0;
  }

  update(deltaTime, { regenerationEnabled = true, regenerationMultiplier = 1 } = {}) {
    this.lowSoundCooldown = Math.max(0, this.lowSoundCooldown - deltaTime);
    this.alertPulse = Math.max(0, this.alertPulse - deltaTime * 1.8);

    if (regenerationEnabled) {
      this.energy = Math.min(
        this.maxEnergy,
        this.energy + this.regenerationRate * regenerationMultiplier * deltaTime,
      );
    }
  }

  consume(amount) {
    if (amount <= 0) {
      return true;
    }

    if (this.energy + 1e-6 < amount) {
      this.triggerLowEnergyWarning();
      return false;
    }

    this.energy = Math.max(0, this.energy - amount);

    if (this.energy <= this.lowThreshold) {
      this.triggerLowEnergyWarning();
    }

    return true;
  }

  consumeRate(ratePerSecond, deltaTime) {
    return this.consume(ratePerSecond * deltaTime);
  }

  triggerLowEnergyWarning() {
    this.alertPulse = 1;

    if (this.lowSoundCooldown === 0) {
      playEnergyLowSound();
      this.lowSoundCooldown = 3.4;
    }
  }

  getHudState() {
    return {
      energy: this.energy,
      maxEnergy: this.maxEnergy,
      ratio: this.maxEnergy > 0 ? this.energy / this.maxEnergy : 0,
      isLow: this.energy <= this.lowThreshold,
      pulse: this.alertPulse,
    };
  }

  reset() {
    this.energy = this.maxEnergy;
    this.lowSoundCooldown = 0;
    this.alertPulse = 0;
  }
}
__bundle["src/systems/EnergySystem.js"] = { EnergySystem };
})();

(() => {
const THREE = globalThis.THREE;
const gravityDirection = new THREE.Vector3();
const planetToBody = new THREE.Vector3();

function createDebugHelper() {
  return new THREE.Mesh(
    new THREE.SphereGeometry(1, 18, 14),
    new THREE.MeshBasicMaterial({
      color: 0x7cb8ff,
      transparent: true,
      opacity: 0.08,
      wireframe: true,
      depthWrite: false,
    }),
  );
}

class GravitySystem {
  constructor({ scene } = {}) {
    this.scene = scene;
    this.debugVisible = false;
    this.playerInfluence = 0;
    this.helperMap = new Map();
    this.group = new THREE.Group();
    this.group.name = "GravityDebug";
    this.group.visible = false;

    this.scene?.add(this.group);
  }

  setDebugVisible(isVisible) {
    this.debugVisible = isVisible;
    this.group.visible = isVisible;
  }

  update(deltaTime, {
    player,
    playerDeltaTime = deltaTime,
    enemies = [],
    projectiles = [],
    environmentManager,
  } = {}) {
    const planets = environmentManager?.planets ?? [];
    this.syncHelpers(planets);
    this.playerInfluence = 0;

    if (player && !player.isDestroyed) {
      this.playerInfluence = this.applyGravityToBody(player, planets, playerDeltaTime, 1);
    }

    for (const enemy of enemies) {
      if (!enemy.isDestroyed) {
        this.applyGravityToBody(enemy, planets, deltaTime, 0.72);
      }
    }

    for (const projectile of projectiles) {
      this.applyGravityToProjectile(projectile, planets, deltaTime, 0.18);
    }

    this.updateHelpers(planets, player);
  }

  syncHelpers(planets) {
    const livePlanets = new Set(planets);

    for (const planet of planets) {
      if (this.helperMap.has(planet)) {
        continue;
      }

      const helper = createDebugHelper();
      helper.position.copy(planet.group.position);
      helper.scale.setScalar(planet.gravityRadius);
      this.helperMap.set(planet, helper);
      this.group.add(helper);
    }

    for (const [planet, helper] of this.helperMap) {
      if (livePlanets.has(planet)) {
        continue;
      }

      this.group.remove(helper);
      helper.geometry.dispose();
      helper.material.dispose();
      this.helperMap.delete(planet);
    }
  }

  updateHelpers(planets, player) {
    this.group.visible = this.debugVisible;

    if (!this.debugVisible) {
      return;
    }

    for (const planet of planets) {
      const helper = this.helperMap.get(planet);

      if (!helper) {
        continue;
      }

      helper.position.copy(planet.group.position);
      helper.scale.setScalar(planet.gravityRadius);

      const opacity = player
        ? THREE.MathUtils.clamp(
          0.05 + Math.max(0, 1 - player.position.distanceTo(planet.position) / (planet.gravityRadius + 40)) * 0.18,
          0.05,
          0.2,
        )
        : 0.08;

      helper.material.opacity = opacity;
    }
  }

  applyGravityToBody(body, planets, deltaTime, influenceScale = 1) {
    let strongestInfluence = 0;

    for (const planet of planets) {
      const influence = this.computeInfluence(body.position, planet, body.collisionRadius ?? 0);

      if (!influence) {
        continue;
      }

      body.velocity.addScaledVector(
        influence.direction,
        influence.acceleration * influenceScale * deltaTime,
      );
      strongestInfluence = Math.max(strongestInfluence, influence.normalized);
    }

    return strongestInfluence;
  }

  applyGravityToProjectile(projectile, planets, deltaTime, influenceScale = 0.18) {
    for (const planet of planets) {
      const influence = this.computeInfluence(projectile.position, planet, projectile.radius ?? 0);

      if (!influence) {
        continue;
      }

      projectile.velocity.addScaledVector(
        influence.direction,
        influence.acceleration * influenceScale * deltaTime,
      );
    }
  }

  computeInfluence(position, planet, paddingRadius = 0) {
    planetToBody.copy(planet.position).sub(position);
    const distanceToCenter = planetToBody.length();
    const surfaceDistance = distanceToCenter - planet.radius - paddingRadius;

    if (surfaceDistance >= planet.gravityRadius || distanceToCenter <= 0.001) {
      return null;
    }

    const normalized = THREE.MathUtils.clamp(1 - surfaceDistance / planet.gravityRadius, 0, 1);
    const acceleration = planet.gravityStrength * normalized * normalized;
    gravityDirection.copy(planetToBody).normalize();

    return {
      direction: gravityDirection,
      normalized,
      acceleration,
    };
  }

  getPlayerInfluence() {
    return this.playerInfluence;
  }

  dispose() {
    for (const helper of this.helperMap.values()) {
      this.group.remove(helper);
      helper.geometry.dispose();
      helper.material.dispose();
    }

    this.helperMap.clear();
    this.scene?.remove(this.group);
  }
}
__bundle["src/systems/GravitySystem.js"] = { GravitySystem };
})();

(() => {
class MotionBlurSystem {
  constructor({ root = document } = {}) {
    this.overlay = root.querySelector("#hud-motion-blur");
    this.intensity = 0;
  }

  update(deltaTime, {
    player,
    timeSystem,
    gravitySystem,
    shieldSystem,
    isPaused = false,
  } = {}) {
    const speedRatio = player?.boostMaxSpeed
      ? Math.min(1, player.velocity.length() / player.boostMaxSpeed)
      : 0;
    const gravityRatio = gravitySystem?.getPlayerInfluence?.() ?? 0;
    const shieldRatio = shieldSystem?.getVisualAmount?.() ?? 0;
    const timeRatio = timeSystem?.effectAmount ?? 0;

    const targetIntensity = isPaused
      ? 0
      : Math.min(
        1,
        speedRatio * 0.26 + gravityRatio * 0.18 + shieldRatio * 0.1 + timeRatio * 0.95,
      );

    this.intensity += (targetIntensity - this.intensity) * (1 - Math.exp(-6 * deltaTime));

    if (!this.overlay) {
      return;
    }

    const blurAmount = this.intensity * 3.2;
    const overlayOpacity = Math.min(0.42, this.intensity * 0.32);
    const filterValue = `blur(${blurAmount.toFixed(2)}px) saturate(${(1 + this.intensity * 0.34).toFixed(2)})`;

    this.overlay.style.opacity = `${overlayOpacity}`;
    this.overlay.style.backdropFilter = filterValue;
    this.overlay.style.webkitBackdropFilter = filterValue;
    this.overlay.style.transform = `scale(${(1 + this.intensity * 0.006).toFixed(4)})`;
  }

  reset() {
    this.intensity = 0;

    if (!this.overlay) {
      return;
    }

    this.overlay.style.opacity = "0";
    this.overlay.style.backdropFilter = "none";
    this.overlay.style.webkitBackdropFilter = "none";
    this.overlay.style.transform = "scale(1)";
  }
}
__bundle["src/systems/MotionBlurSystem.js"] = { MotionBlurSystem };
})();

(() => {
class ShieldSystem {
  constructor({
    sustainDrainRate = 21,
    impactEnergyCostMultiplier = 1.4,
    damageReduction = 0.72,
    cooldownDuration = 0.9,
  } = {}) {
    this.sustainDrainRate = sustainDrainRate;
    this.impactEnergyCostMultiplier = impactEnergyCostMultiplier;
    this.damageReduction = damageReduction;
    this.cooldownDuration = cooldownDuration;
    this.cooldown = 0;
    this.isActive = false;
    this.fieldAmount = 0;
    this.impactAmount = 0;
  }

  update(deltaTime, {
    inputController,
    energySystem,
    player,
  } = {}) {
    this.cooldown = Math.max(0, this.cooldown - deltaTime);
    this.impactAmount = Math.max(0, this.impactAmount - deltaTime * 3.4);

    const wantsShield = Boolean(inputController?.isShielding()) && !player?.isDestroyed;
    const canHold = wantsShield
      && this.cooldown === 0
      && (!energySystem || energySystem.consumeRate(this.sustainDrainRate, deltaTime));

    if (this.isActive && !canHold) {
      this.cooldown = Math.max(this.cooldown, this.cooldownDuration);
    }

    this.isActive = canHold;
    const targetField = this.isActive ? 1 : 0;
    this.fieldAmount += (targetField - this.fieldAmount) * (1 - Math.exp(-8 * deltaTime));
  }

  absorbDamage(amount, energySystem) {
    if (!this.isActive || amount <= 0) {
      return amount;
    }

    const impactCost = amount * this.impactEnergyCostMultiplier;

    if (energySystem && !energySystem.consume(impactCost)) {
      this.breakShield();
      return amount;
    }

    this.impactAmount = 1;
    return amount * (1 - this.damageReduction);
  }

  breakShield() {
    this.isActive = false;
    this.cooldown = Math.max(this.cooldown, this.cooldownDuration);
    this.impactAmount = 0.35;
  }

  getVisualAmount() {
    return this.fieldAmount;
  }

  getImpactAmount() {
    return this.impactAmount;
  }

  getHudState() {
    return {
      active: this.isActive,
      cooldown: this.cooldown,
      strength: this.fieldAmount,
    };
  }

  reset() {
    this.cooldown = 0;
    this.isActive = false;
    this.fieldAmount = 0;
    this.impactAmount = 0;
  }
}
__bundle["src/systems/ShieldSystem.js"] = { ShieldSystem };
})();

(() => {
const THREE = globalThis.THREE;
const { playStealthEnterSound, playStealthExitSound } = __bundle["src/audio/placeholders.js"];
const enemyForward = new THREE.Vector3();
const toPlayerVector = new THREE.Vector3();
const lastKnownPosition = new THREE.Vector3();

function createVisionHelper() {
  const mesh = new THREE.Mesh(
    new THREE.ConeGeometry(1, 1, 18, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0x6fb8ff,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  mesh.rotation.x = Math.PI * 0.5;
  mesh.renderOrder = 2;
  return mesh;
}

function getStateColor(state) {
  if (state === "alerted") {
    return 0xff7a7a;
  }

  if (state === "suspicious") {
    return 0xffd36a;
  }

  return 0x76c6ff;
}

class StealthSystem {
  constructor() {
    this.enemyStateMap = new Map();
    this.debugVisible = false;
    this.playerState = "hidden";
  }

  ensureEnemyState(enemy) {
    if (this.enemyStateMap.has(enemy)) {
      return this.enemyStateMap.get(enemy);
    }

    const helper = createVisionHelper();
    enemy.group.add(helper);

    const state = {
      state: "idle",
      detection: 0,
      canSeePlayer: false,
      isBlocked: false,
      lastKnownPosition: enemy.position.clone(),
      helper,
    };

    this.enemyStateMap.set(enemy, state);
    return state;
  }

  setDebugVisible(isVisible) {
    this.debugVisible = isVisible;

    for (const entry of this.enemyStateMap.values()) {
      entry.helper.visible = isVisible;
    }
  }

  update(deltaTime, {
    player,
    enemies = [],
    environmentManager,
  } = {}) {
    const liveEnemies = new Set(enemies);
    let hasAlertedEnemy = false;
    let hasSuspiciousEnemy = false;

    for (const [enemy, entry] of this.enemyStateMap) {
      if (liveEnemies.has(enemy)) {
        continue;
      }

      enemy.group.remove(entry.helper);
      entry.helper.geometry.dispose();
      entry.helper.material.dispose();
      this.enemyStateMap.delete(enemy);
    }

    for (const enemy of enemies) {
      const entry = this.ensureEnemyState(enemy);

      if (enemy.isDestroyed || player?.isDestroyed) {
        entry.canSeePlayer = false;
        entry.detection = Math.max(0, entry.detection - deltaTime);
        entry.state = entry.detection > 0.24 ? "suspicious" : "idle";
        this.updateVisionHelper(enemy, entry);
        continue;
      }

      toPlayerVector.copy(player.position).sub(enemy.position);
      const distanceToPlayer = Math.max(toPlayerVector.length(), 0.001);
      const normalizedDirection = toPlayerVector.normalize();

      enemy.getForwardVector(enemyForward);
      const angleToPlayer = Math.acos(THREE.MathUtils.clamp(enemyForward.dot(normalizedDirection), -1, 1));
      const insideVisionCone = distanceToPlayer <= enemy.visionRange && angleToPlayer <= enemy.visionHalfAngle;
      const blockedByPlanet = insideVisionCone
        ? environmentManager?.isLineBlocked(enemy.position, player.position) ?? false
        : false;

      entry.canSeePlayer = insideVisionCone && !blockedByPlanet;
      entry.isBlocked = blockedByPlanet;

      if (entry.canSeePlayer) {
        entry.detection = Math.min(1, entry.detection + deltaTime * 2.15);
        entry.lastKnownPosition.copy(player.position);
      } else {
        entry.detection = Math.max(0, entry.detection - deltaTime * (blockedByPlanet ? 0.82 : 0.42));
      }

      if (entry.detection >= 0.56) {
        entry.state = "alerted";
        hasAlertedEnemy = true;
      } else if (entry.detection >= 0.16) {
        entry.state = "suspicious";
        hasSuspiciousEnemy = true;
      } else {
        entry.state = "idle";
      }

      this.updateVisionHelper(enemy, entry);
    }

    const previousState = this.playerState;
    this.playerState = hasAlertedEnemy ? "detected" : hasSuspiciousEnemy ? "suspicious" : "hidden";

    if (previousState !== "hidden" && this.playerState === "hidden") {
      playStealthEnterSound();
    } else if (previousState !== "detected" && this.playerState === "detected") {
      playStealthExitSound();
    }
  }

  updateVisionHelper(enemy, entry) {
    entry.helper.visible = this.debugVisible;
    entry.helper.position.z = -enemy.visionRange * 0.5;
    entry.helper.scale.set(
      Math.tan(enemy.visionHalfAngle) * enemy.visionRange,
      enemy.visionRange,
      Math.tan(enemy.visionHalfAngle) * enemy.visionRange,
    );
    entry.helper.material.color.setHex(getStateColor(entry.state));
    entry.helper.material.opacity = entry.state === "alerted"
      ? 0.2
      : entry.state === "suspicious"
        ? 0.16
        : 0.1;
  }

  getEnemyPerception(enemy) {
    const entry = this.enemyStateMap.get(enemy);

    if (!entry) {
      lastKnownPosition.copy(enemy?.position ?? new THREE.Vector3());

      return {
        state: "idle",
        canSeePlayer: false,
        detection: 0,
        lastKnownPosition,
      };
    }

    return {
      state: entry.state,
      canSeePlayer: entry.canSeePlayer,
      detection: entry.detection,
      lastKnownPosition: entry.lastKnownPosition,
      isBlocked: entry.isBlocked,
    };
  }

  isPlayerHidden() {
    return this.playerState === "hidden";
  }

  getHudState() {
    if (this.playerState === "detected") {
      return {
        label: "Detected",
        status: "Hostile sensors have a confirmed lock.",
        isDetected: true,
        isSuspicious: false,
      };
    }

    if (this.playerState === "suspicious") {
      return {
        label: "Suspicious",
        status: "Enemy scans are searching your last known vector.",
        isDetected: false,
        isSuspicious: true,
      };
    }

    return {
      label: "Hidden",
      status: "Planets and distance are masking your signature.",
      isDetected: false,
      isSuspicious: false,
    };
  }

  dispose() {
    for (const [enemy, entry] of this.enemyStateMap) {
      enemy.group.remove(entry.helper);
      entry.helper.geometry.dispose();
      entry.helper.material.dispose();
    }

    this.enemyStateMap.clear();
  }
}
__bundle["src/systems/StealthSystem.js"] = { StealthSystem };
})();

(() => {
const { playTimeSlowSound } = __bundle["src/audio/placeholders.js"];
class TimeSystem {
  constructor({
    slowScale = 0.32,
    playerScale = 0.68,
    energyDrainRate = 28,
    cooldownDuration = 1.15,
  } = {}) {
    this.slowScale = slowScale;
    this.playerScale = playerScale;
    this.energyDrainRate = energyDrainRate;
    this.cooldownDuration = cooldownDuration;
    this.cooldown = 0;
    this.effectAmount = 0;
    this.isActive = false;
    this.activeDuration = 0;
  }

  update(deltaTime, {
    inputController,
    energySystem,
    player,
  } = {}) {
    this.cooldown = Math.max(0, this.cooldown - deltaTime);

    const wantsSlowTime = Boolean(inputController?.isTimeSlowing()) && !player?.isDestroyed;
    let shouldStayActive = false;

    if (wantsSlowTime && this.cooldown === 0) {
      shouldStayActive = energySystem
        ? energySystem.consumeRate(this.energyDrainRate, deltaTime)
        : true;
    }

    if (!this.isActive && shouldStayActive) {
      playTimeSlowSound();
    }

    if (this.isActive && !shouldStayActive && this.activeDuration > 0.08) {
      this.cooldown = Math.max(this.cooldown, this.cooldownDuration);
    }

    this.isActive = shouldStayActive;
    this.activeDuration = this.isActive ? this.activeDuration + deltaTime : 0;

    const targetAmount = this.isActive ? 1 : 0;
    const response = 1 - Math.exp(-7 * deltaTime);
    this.effectAmount += (targetAmount - this.effectAmount) * response;
  }

  getWorldScale() {
    return 1 - (1 - this.slowScale) * this.effectAmount;
  }

  getPlayerScale() {
    return 1 - (1 - this.playerScale) * this.effectAmount;
  }

  getHudState() {
    return {
      active: this.isActive,
      effectAmount: this.effectAmount,
      cooldown: this.cooldown,
      worldScale: this.getWorldScale(),
    };
  }

  reset() {
    this.cooldown = 0;
    this.effectAmount = 0;
    this.isActive = false;
    this.activeDuration = 0;
  }
}
__bundle["src/systems/TimeSystem.js"] = { TimeSystem };
})();

(() => {
class HUDController {
  constructor(root = document) {
    this.root = root.querySelector(".hud");
    this.timewash = root.querySelector("#hud-timewash");
    this.healthFill = root.querySelector("#hud-health-fill");
    this.healthText = root.querySelector("#hud-health-text");
    this.energyFill = root.querySelector("#hud-energy-fill");
    this.energyText = root.querySelector("#hud-energy-text");
    this.weaponName = root.querySelector("#hud-weapon-name");
    this.weaponSlot = root.querySelector("#hud-weapon-slot");
    this.weaponFill = root.querySelector("#hud-weapon-fill");
    this.weaponStatus = root.querySelector("#hud-weapon-status");
    this.waveLabel = root.querySelector("#hud-wave-label");
    this.waveStatus = root.querySelector("#hud-wave-status");
    this.stealthLabel = root.querySelector("#hud-stealth-label");
    this.stealthStatus = root.querySelector("#hud-stealth-status");
    this.shieldStatus = root.querySelector("#hud-shield-status");
    this.timeStatus = root.querySelector("#hud-time-status");
    this.debugText = root.querySelector("#hud-debug-text");
    this.debugCard = root.querySelector("#hud-debug-card");
    this.debugList = root.querySelector("#hud-debug-list");
    this.scoreText = root.querySelector("#hud-score-text");
    this.killsText = root.querySelector("#hud-kills-text");
    this.timeText = root.querySelector("#hud-time-text");
    this.healthCard = root.querySelector("#hud-health-card");
    this.energyCard = root.querySelector("#hud-energy-card");
    this.weaponCard = root.querySelector("#hud-weapon-card");
    this.waveCard = root.querySelector("#hud-wave-card");
    this.tacticalCard = root.querySelector("#hud-tactical-card");
    this.statsCard = root.querySelector("#hud-stats-card");
    this.overlay = root.querySelector("#hud-overlay");
    this.overlayEyebrow = root.querySelector("#hud-overlay-eyebrow");
    this.overlayTitle = root.querySelector("#hud-overlay-title");
    this.overlayCopy = root.querySelector("#hud-overlay-copy");
    this.banner = root.querySelector("#hud-banner");
    this.bannerTitle = root.querySelector("#hud-banner-title");
    this.bannerCopy = root.querySelector("#hud-banner-copy");
    this.damagePulseTimer = 0;
    this.weaponPulseTimer = 0;
    this.lowHealthPulseTimer = 0;
    this.bannerTimer = 0;
  }

  triggerDamagePulse() {
    this.damagePulseTimer = 0.42;
  }

  triggerWeaponPulse() {
    this.weaponPulseTimer = 0.32;
  }

  triggerLowHealthPulse() {
    this.lowHealthPulseTimer = 0.75;
  }

  showBanner(title, copy = "", duration = 2.2) {
    this.bannerTimer = duration;

    if (this.bannerTitle) {
      this.bannerTitle.textContent = title;
    }

    if (this.bannerCopy) {
      this.bannerCopy.textContent = copy;
    }
  }

  formatTime(totalSeconds = 0) {
    const seconds = Math.max(0, Math.floor(totalSeconds));
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  update(deltaTime, {
    player,
    energy,
    stealth,
    shield,
    time,
    debug,
    weapon,
    wave,
    session,
    overlay,
  } = {}) {
    if (!this.root || !player || !energy || !stealth || !shield || !time || !weapon || !wave || !session) {
      return;
    }

    this.damagePulseTimer = Math.max(0, this.damagePulseTimer - deltaTime);
    this.weaponPulseTimer = Math.max(0, this.weaponPulseTimer - deltaTime);
    this.lowHealthPulseTimer = Math.max(0, this.lowHealthPulseTimer - deltaTime);
    this.bannerTimer = Math.max(0, this.bannerTimer - deltaTime);

    const healthRatio = player.maxHealth > 0 ? player.health / player.maxHealth : 0;
    const weaponIndicatorLevel = weapon.isSwitching
      ? Math.max(0.08, weapon.switchProgress)
      : Math.min(1, 0.32 + weapon.heat * 0.6 + weapon.indicatorLevel * 0.2);

    this.healthFill.style.transform = `scaleX(${Math.max(0.02, healthRatio)})`;
    this.healthText.textContent = `${Math.ceil(player.health)} / ${player.maxHealth}`;
    this.energyFill.style.transform = `scaleX(${Math.max(0.02, energy.ratio)})`;
    this.energyText.textContent = `${Math.ceil(energy.energy)} / ${energy.maxEnergy}`;

    this.weaponName.textContent = weapon.isSwitching && weapon.pendingWeapon
      ? `${weapon.currentWeapon.label} -> ${weapon.pendingWeapon.label}`
      : weapon.currentWeapon.label;
    this.weaponSlot.textContent = String(weapon.displayWeapon.slot).padStart(2, "0");
    this.weaponFill.style.transform = `scaleX(${Math.max(0.04, weaponIndicatorLevel)})`;
    this.weaponStatus.textContent = weapon.isSwitching
      ? `Switching ${Math.round(weapon.switchProgress * 100)}%`
      : "Ready";

    this.waveLabel.textContent = `Wave ${wave.currentWave}`;
    this.waveStatus.textContent = wave.statusLabel;
    this.stealthLabel.textContent = stealth.label;
    this.stealthStatus.textContent = stealth.status;
    this.shieldStatus.textContent = shield.active
      ? `Shield Active ${Math.round(shield.strength * 100)}%`
      : shield.cooldown > 0
        ? `Shield Cooldown ${shield.cooldown.toFixed(1)}s`
        : "Shield Standby";
    this.timeStatus.textContent = time.active
      ? `Slow Time ${(time.worldScale * 100).toFixed(0)}%`
      : time.cooldown > 0
        ? `Cooldown ${time.cooldown.toFixed(1)}s`
        : "Time Flow Nominal";
    this.debugText.textContent = debug?.visible ? "Debug On" : "Debug Off";

    if (this.scoreText) {
      this.scoreText.textContent = session.score.toLocaleString();
    }

    if (this.killsText) {
      this.killsText.textContent = String(session.kills);
    }

    if (this.timeText) {
      this.timeText.textContent = this.formatTime(session.elapsedTime);
    }

    this.root.classList.toggle("hud--low-health", healthRatio < 0.3);
    this.root.classList.toggle("hud--detected", stealth.isDetected);
    this.root.classList.toggle("hud--time-slow", time.effectAmount > 0.1);
    this.root.classList.toggle("hud--shielding", shield.active);
    this.healthCard.classList.toggle("is-pulsing", this.damagePulseTimer > 0);
    this.energyCard?.classList.toggle("is-pulsing", energy.pulse > 0.02);
    this.weaponCard.classList.toggle("is-pulsing", this.weaponPulseTimer > 0 || weapon.indicatorLevel > 0.4);
    this.waveCard.classList.toggle("is-pulsing", wave.enemiesRemaining > 0 && wave.enemiesRemaining <= 2);
    this.healthCard.classList.toggle("is-alert", this.lowHealthPulseTimer > 0 || healthRatio < 0.3);
    this.energyCard?.classList.toggle("is-alert", energy.isLow);
    this.tacticalCard?.classList.toggle("is-alert", stealth.isDetected);
    this.tacticalCard?.classList.toggle("is-pulsing", stealth.isSuspicious || time.effectAmount > 0.18 || shield.active);
    this.statsCard?.classList.toggle("is-pulsing", this.bannerTimer > 0);

    if (this.timewash) {
      this.timewash.style.opacity = `${time.effectAmount * 0.32}`;
    }

    if (this.banner) {
      this.banner.classList.toggle("is-visible", this.bannerTimer > 0);
    }

    if (this.debugCard) {
      this.debugCard.classList.toggle("is-visible", Boolean(debug?.visible));
    }

    if (this.debugList) {
      this.debugList.replaceChildren();

      if (debug?.visible) {
        const rows = debug.enemyStates?.length
          ? debug.enemyStates
          : [{ label: "No contacts", state: "clear", detection: 0, detail: "No active enemies" }];

        for (const entry of rows) {
          const row = document.createElement("div");
          row.className = "hud-debug__row";

          const label = document.createElement("span");
          label.className = "hud-debug__label";
          label.textContent = entry.label;

          const state = document.createElement("strong");
          state.className = `hud-debug__state hud-debug__state--${entry.state}`;
          state.textContent = `${entry.state.toUpperCase()} ${entry.detection}%`;

          const detail = document.createElement("span");
          detail.className = "hud-debug__detail";
          detail.textContent = entry.detail;

          row.append(label, state, detail);
          this.debugList.append(row);
        }
      }
    }

    if (this.overlay) {
      const isVisible = Boolean(overlay?.visible);
      this.overlay.classList.toggle("is-visible", isVisible);

      if (isVisible) {
        if (this.overlayEyebrow) {
          this.overlayEyebrow.textContent = overlay.eyebrow ?? "Combat Status";
        }

        if (this.overlayTitle) {
          this.overlayTitle.textContent = overlay.title ?? "";
        }

        if (this.overlayCopy) {
          this.overlayCopy.textContent = overlay.copy ?? "";
        }
      }
    }
  }
}
__bundle["src/ui/HUDController.js"] = { HUDController };
})();

(() => {
const THREE = globalThis.THREE;
const LOCAL_FORWARD = new THREE.Vector3(0, 0, 1);
const SHARED_BULLET_RESOURCES = new Map();
const segment = new THREE.Vector3();
const toCenter = new THREE.Vector3();
const closestPoint = new THREE.Vector3();

function createResourceBundle(weaponDefinition) {
  let coreGeometry;
  let trailGeometry;
  let haloGeometry;

  if (weaponDefinition.projectileStyle === "plasma") {
    coreGeometry = new THREE.SphereGeometry(0.18, 14, 12);
    trailGeometry = new THREE.CylinderGeometry(0.17, 0.02, 1, 10);
    trailGeometry.rotateX(Math.PI * 0.5);
    haloGeometry = new THREE.SphereGeometry(0.24, 12, 12);
  } else if (weaponDefinition.projectileStyle === "rapid") {
    coreGeometry = new THREE.BoxGeometry(0.08, 0.08, 0.54);
    trailGeometry = new THREE.CylinderGeometry(0.08, 0.02, 1, 8);
    trailGeometry.rotateX(Math.PI * 0.5);
    haloGeometry = new THREE.SphereGeometry(0.11, 10, 10);
  } else if (weaponDefinition.projectileStyle === "enemy") {
    coreGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.82, 10);
    coreGeometry.rotateX(Math.PI * 0.5);
    trailGeometry = new THREE.CylinderGeometry(0.1, 0.03, 1, 10);
    trailGeometry.rotateX(Math.PI * 0.5);
    haloGeometry = new THREE.SphereGeometry(0.14, 12, 12);
  } else {
    coreGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.9, 10);
    coreGeometry.rotateX(Math.PI * 0.5);
    trailGeometry = new THREE.CylinderGeometry(0.08, 0.02, 1, 10);
    trailGeometry.rotateX(Math.PI * 0.5);
    haloGeometry = new THREE.SphereGeometry(0.12, 10, 10);
  }

  return {
    coreGeometry,
    trailGeometry,
    haloGeometry,
  };
}

function getSharedBulletResources(weaponDefinition) {
  if (!SHARED_BULLET_RESOURCES.has(weaponDefinition.id)) {
    SHARED_BULLET_RESOURCES.set(weaponDefinition.id, createResourceBundle(weaponDefinition));
  }

  return SHARED_BULLET_RESOURCES.get(weaponDefinition.id);
}

class Bullet {
  constructor({
    weaponDefinition,
    position,
    direction,
    ownerVelocity,
    ownerTag = "player",
  }) {
    this.weaponId = weaponDefinition.id;
    this.ownerTag = ownerTag;
    this.damage = weaponDefinition.damage;
    this.radius = weaponDefinition.collisionRadius;
    this.age = 0;
    this.maxLifetime = weaponDefinition.projectileLifetime;
    this.impactColor = weaponDefinition.glowColor;
    this.impactScale = weaponDefinition.impactScale ?? 0.7;
    this.direction = direction.clone().normalize();
    this.position = position.clone();
    this.previousPosition = position.clone();
    this.velocity = this.direction.clone()
      .multiplyScalar(weaponDefinition.projectileSpeed)
      .addScaledVector(ownerVelocity, weaponDefinition.velocityInheritance);
    this.collisionSphere = new THREE.Sphere(this.position.clone(), this.radius);
    this.baseTrailLength = weaponDefinition.trailLength ?? 1.1;
    this.baseTrailOpacity = weaponDefinition.trailOpacity ?? 0.24;

    const resources = getSharedBulletResources(weaponDefinition);

    this.materials = {
      core: new THREE.MeshStandardMaterial({
        color: weaponDefinition.weaponColor,
        emissive: weaponDefinition.glowColor,
        emissiveIntensity: weaponDefinition.projectileStyle === "plasma" ? 2.35 : 1.9,
        roughness: weaponDefinition.projectileStyle === "plasma" ? 0.12 : 0.16,
        metalness: weaponDefinition.projectileStyle === "rapid" ? 0.22 : 0.08,
        transparent: true,
        opacity: 1,
      }),
      trail: new THREE.MeshBasicMaterial({
        color: weaponDefinition.glowColor,
        transparent: true,
        opacity: this.baseTrailOpacity,
        depthWrite: false,
      }),
      halo: new THREE.MeshBasicMaterial({
        color: weaponDefinition.weaponColor,
        transparent: true,
        opacity: 0.24,
        depthWrite: false,
      }),
    };

    this.mesh = new THREE.Group();
    this.coreMesh = new THREE.Mesh(resources.coreGeometry, this.materials.core);
    this.trailMesh = new THREE.Mesh(resources.trailGeometry, this.materials.trail);
    this.haloMesh = new THREE.Mesh(resources.haloGeometry, this.materials.halo);
    this.haloMesh.scale.setScalar(1.2);

    this.mesh.add(this.trailMesh);
    this.mesh.add(this.haloMesh);
    this.mesh.add(this.coreMesh);
    this.mesh.position.copy(this.position);
    this.mesh.quaternion.setFromUnitVectors(LOCAL_FORWARD, this.direction);
    this.coreMesh.scale.set(...weaponDefinition.projectileScale);
    this.updateVisuals();
  }

  update(deltaTime) {
    this.previousPosition.copy(this.position);
    this.position.addScaledVector(this.velocity, deltaTime);
    this.direction.copy(this.velocity).normalize();
    this.mesh.position.copy(this.position);
    this.mesh.quaternion.setFromUnitVectors(LOCAL_FORWARD, this.direction);
    this.collisionSphere.center.copy(this.position);
    this.age += deltaTime;
    this.updateVisuals();

    return this.age < this.maxLifetime;
  }

  updateVisuals() {
    const lifeRatio = 1 - this.age / this.maxLifetime;
    const speedRatio = THREE.MathUtils.clamp(this.velocity.length() / 80, 0.75, 1.65);
    const trailLength = this.baseTrailLength * speedRatio * (0.75 + lifeRatio * 0.35);

    this.trailMesh.scale.set(1, 1, trailLength);
    this.trailMesh.position.z = -0.28 - trailLength * 0.48;
    this.haloMesh.scale.setScalar(1 + (1 - lifeRatio) * 0.08 + this.radius * 2.8);

    this.materials.core.opacity = 0.72 + lifeRatio * 0.28;
    this.materials.trail.opacity = this.baseTrailOpacity * Math.max(0, lifeRatio);
    this.materials.halo.opacity = 0.14 + lifeRatio * 0.16;
  }

  intersectsSphere(targetSphere) {
    segment.copy(this.position).sub(this.previousPosition);

    if (segment.lengthSq() === 0) {
      return this.collisionSphere.intersectsSphere(targetSphere);
    }

    toCenter.copy(targetSphere.center).sub(this.previousPosition);
    const projection = THREE.MathUtils.clamp(
      toCenter.dot(segment) / segment.lengthSq(),
      0,
      1,
    );

    closestPoint.copy(this.previousPosition).addScaledVector(segment, projection);

    return closestPoint.distanceToSquared(targetSphere.center) <= (targetSphere.radius + this.radius) ** 2;
  }

  dispose() {
    this.materials.core.dispose();
    this.materials.trail.dispose();
    this.materials.halo.dispose();
  }
}
__bundle["src/weapons/Bullet.js"] = { Bullet };
})();

(() => {
const THREE = globalThis.THREE;
const { Bullet } = __bundle["src/weapons/Bullet.js"];
const WORLD_FORWARD = new THREE.Vector3(0, 0, -1);
const DEFAULT_OWNER_VELOCITY = new THREE.Vector3();
const spawnPosition = new THREE.Vector3();
const worldQuaternion = new THREE.Quaternion();
const direction = new THREE.Vector3();

class ProjectileSystem {
  constructor({ scene, maxProjectiles = 180 }) {
    this.scene = scene;
    this.maxProjectiles = maxProjectiles;
    this.projectiles = [];
    this.group = new THREE.Group();

    this.scene.add(this.group);
  }

  spawnProjectile({
    weaponDefinition,
    origin,
    ownerVelocity = DEFAULT_OWNER_VELOCITY,
    ownerTag = "player",
  }) {
    if (this.projectiles.length >= this.maxProjectiles) {
      this.removeProjectile(this.projectiles[0]);
    }

    origin.getWorldPosition(spawnPosition);
    origin.getWorldQuaternion(worldQuaternion);
    direction.copy(WORLD_FORWARD).applyQuaternion(worldQuaternion).normalize();
    spawnPosition.addScaledVector(direction, weaponDefinition.spawnOffset);

    const projectile = new Bullet({
      weaponDefinition,
      position: spawnPosition,
      direction,
      ownerVelocity,
      ownerTag,
    });

    this.projectiles.push(projectile);
    this.group.add(projectile.mesh);

    return projectile;
  }

  update(deltaTime) {
    for (let index = this.projectiles.length - 1; index >= 0; index -= 1) {
      const projectile = this.projectiles[index];
      const isAlive = projectile.update(deltaTime);

      if (!isAlive) {
        this.removeProjectile(projectile);
      }
    }
  }

  removeProjectile(projectile) {
    const projectileIndex = this.projectiles.indexOf(projectile);

    if (projectileIndex >= 0) {
      this.projectiles.splice(projectileIndex, 1);
    }

    this.group.remove(projectile.mesh);
    projectile.dispose();
  }

  removeProjectilesByOwnerTag(ownerTag) {
    for (let index = this.projectiles.length - 1; index >= 0; index -= 1) {
      const projectile = this.projectiles[index];

      if (projectile.ownerTag === ownerTag) {
        this.removeProjectile(projectile);
      }
    }
  }

  clear() {
    for (let index = this.projectiles.length - 1; index >= 0; index -= 1) {
      this.removeProjectile(this.projectiles[index]);
    }
  }

  dispose() {
    this.clear();
    this.scene.remove(this.group);
  }
}
__bundle["src/weapons/ProjectileSystem.js"] = { ProjectileSystem };
})();

(() => {
const THREE = globalThis.THREE;
function createStarfield({
  starCount = 1800,
  spread = 260,
  depth = 340,
  color = 0xbcd7ff,
  size = 0.9,
  opacity = 0.95,
} = {}) {
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const baseColor = new THREE.Color(color);
  const tintColor = new THREE.Color(0xffffff);
  const innerRadius = Math.max(26, Math.min(spread, depth) * 0.16);
  const outerRadius = Math.max(spread * 0.6, depth * 0.72);
  const direction = new THREE.Vector3();

  for (let index = 0; index < starCount; index += 1) {
    const stride = index * 3;
    direction.set(
      THREE.MathUtils.randFloatSpread(2),
      THREE.MathUtils.randFloatSpread(2),
      THREE.MathUtils.randFloatSpread(2),
    );

    if (direction.lengthSq() < 0.0001) {
      direction.set(0, 0, 1);
    } else {
      direction.normalize();
    }

    const radius = THREE.MathUtils.randFloat(innerRadius, outerRadius);

    positions[stride] = direction.x * radius;
    positions[stride + 1] = direction.y * radius;
    positions[stride + 2] = direction.z * radius;

    const mixedColor = baseColor.clone().lerp(tintColor, Math.random() * 0.45);
    colors[stride] = mixedColor.r;
    colors[stride + 1] = mixedColor.g;
    colors[stride + 2] = mixedColor.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity,
    depthWrite: false,
  });

  const stars = new THREE.Points(geometry, material);
  stars.frustumCulled = false;

  return stars;
}
__bundle["src/world/createStarfield.js"] = { createStarfield };
})();

(() => {
const THREE = globalThis.THREE;
const { createStarfield } = __bundle["src/world/createStarfield.js"];
function createNebulaTexture({
  innerColor = "#7bb7ff",
  outerColor = "#101832",
} = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;

  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(128, 128, 18, 128, 128, 128);
  gradient.addColorStop(0, "rgba(255,255,255,0.9)");
  gradient.addColorStop(0.18, innerColor);
  gradient.addColorStop(0.62, outerColor);
  gradient.addColorStop(1, "rgba(0,0,0,0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function createNebulaCard(config) {
  const geometry = new THREE.PlaneGeometry(config.width, config.height, 1, 1);
  const texture = createNebulaTexture({
    innerColor: config.innerColor,
    outerColor: config.outerColor,
  });
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color: config.tint,
    transparent: true,
    opacity: config.opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(config.position);
  mesh.rotation.z = config.rotationZ;

  mesh.userData = {
    basePosition: config.position.clone(),
    baseOpacity: config.opacity,
    baseRotationZ: config.rotationZ,
    parallax: config.parallax,
    driftSpeed: config.driftSpeed,
    driftRadius: config.driftRadius,
    pulseOffset: Math.random() * Math.PI * 2,
  };

  return mesh;
}

class BackdropField {
  constructor() {
    this.group = new THREE.Group();
    this.group.name = "BackdropField";
    this.starLayers = [];
    this.nebulaCards = [];
    this.time = 0;

    this.createStarLayers();
    this.createNebulaCards();
  }

  createStarLayers() {
    const layers = [
      { starCount: 950, spread: 180, depth: 220, color: 0xf3f7ff, size: 1.25, opacity: 0.9, parallax: 0.012 },
      { starCount: 1450, spread: 280, depth: 360, color: 0xbfd8ff, size: 0.95, opacity: 0.8, parallax: 0.02 },
      { starCount: 1200, spread: 420, depth: 520, color: 0x8bb6ff, size: 0.72, opacity: 0.56, parallax: 0.03 },
    ];

    for (const config of layers) {
      const layer = createStarfield(config);
      layer.userData.parallax = config.parallax;
      this.starLayers.push(layer);
      this.group.add(layer);
    }
  }

  createNebulaCards() {
    const cards = [
      {
        position: new THREE.Vector3(-42, 20, -150),
        width: 72,
        height: 40,
        tint: 0x6a9fff,
        innerColor: "rgba(138,205,255,0.95)",
        outerColor: "rgba(20,32,72,0.45)",
        opacity: 0.22,
        rotationZ: -0.18,
        parallax: 0.055,
        driftSpeed: 0.06,
        driftRadius: 3.2,
      },
      {
        position: new THREE.Vector3(34, -16, -176),
        width: 88,
        height: 48,
        tint: 0xff9dc2,
        innerColor: "rgba(255,182,216,0.9)",
        outerColor: "rgba(64,20,44,0.38)",
        opacity: 0.18,
        rotationZ: 0.26,
        parallax: 0.07,
        driftSpeed: 0.08,
        driftRadius: 2.8,
      },
      {
        position: new THREE.Vector3(0, 28, -220),
        width: 112,
        height: 58,
        tint: 0x9fe2b2,
        innerColor: "rgba(191,255,208,0.86)",
        outerColor: "rgba(20,56,40,0.28)",
        opacity: 0.12,
        rotationZ: 0.05,
        parallax: 0.09,
        driftSpeed: 0.045,
        driftRadius: 4.4,
      },
    ];

    for (const config of cards) {
      const card = createNebulaCard(config);
      this.nebulaCards.push(card);
      this.group.add(card);
    }
  }

  update(deltaTime, focusPosition, camera) {
    this.time += deltaTime;

    for (let index = 0; index < this.starLayers.length; index += 1) {
      const layer = this.starLayers[index];
      const parallax = layer.userData.parallax;

      layer.position.x = focusPosition.x * parallax;
      layer.position.y = focusPosition.y * parallax;
      layer.position.z = focusPosition.z * parallax;
      layer.rotation.z += deltaTime * (0.002 + index * 0.0015);
      layer.material.opacity = 0.55 + index * 0.15 + Math.sin(this.time * (0.18 + index * 0.05)) * 0.02;
    }

    for (const card of this.nebulaCards) {
      const {
        basePosition,
        parallax,
        driftSpeed,
        driftRadius,
        baseOpacity,
        baseRotationZ,
        pulseOffset,
      } = card.userData;

      card.position.x = basePosition.x + focusPosition.x * parallax + Math.sin(this.time * driftSpeed + pulseOffset) * driftRadius;
      card.position.y = basePosition.y + focusPosition.y * parallax + Math.cos(this.time * driftSpeed * 0.8 + pulseOffset) * driftRadius * 0.6;
      card.position.z = basePosition.z + focusPosition.z * parallax * 0.85;
      card.lookAt(camera.position);
      card.rotateZ(baseRotationZ);
      card.material.opacity = THREE.MathUtils.clamp(
        baseOpacity + Math.sin(this.time * 0.22 + pulseOffset) * 0.018,
        0.08,
        0.24,
      );
    }
  }

  dispose() {
    for (const layer of this.starLayers) {
      layer.geometry.dispose();
      layer.material.dispose();
    }

    for (const card of this.nebulaCards) {
      card.geometry.dispose();
      card.material.map.dispose();
      card.material.dispose();
    }
  }
}
__bundle["src/world/BackdropField.js"] = { BackdropField };
})();

(() => {
const THREE = globalThis.THREE;
const forward = new THREE.Vector3();
const orientationForward = new THREE.Vector3(0, 0, 1);
const spawnDirection = new THREE.Vector3();
const travelDirection = new THREE.Vector3();

function disposeObjectResources(root) {
  const disposedMaterials = new Set();

  root.traverse((object) => {
    if (object.geometry) {
      object.geometry.dispose();
    }

    const materials = Array.isArray(object.material) ? object.material : [object.material];

    for (const material of materials) {
      if (material && !disposedMaterials.has(material)) {
        disposedMaterials.add(material);
        material.dispose();
      }
    }
  });
}

class Comet {
  constructor({ anchor = new THREE.Vector3() } = {}) {
    this.group = new THREE.Group();
    this.velocity = new THREE.Vector3();
    this.rotationVelocity = new THREE.Vector3();
    this.anchor = anchor.clone();

    const nucleusMaterial = new THREE.MeshStandardMaterial({
      color: 0x7f8ca4,
      emissive: 0x1a2431,
      emissiveIntensity: 0.2,
      roughness: 0.88,
      metalness: 0.04,
    });

    const tailMaterial = new THREE.MeshStandardMaterial({
      color: 0xa6e0ff,
      emissive: 0x72c8ff,
      emissiveIntensity: 0.52,
      roughness: 0.14,
      metalness: 0.02,
      transparent: true,
      opacity: 0.32,
    });

    this.nucleus = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.9, 0),
      nucleusMaterial,
    );
    this.group.add(this.nucleus);

    this.tail = new THREE.Group();
    this.group.add(this.tail);

    for (let index = 0; index < 4; index += 1) {
      const tailNode = new THREE.Mesh(
        new THREE.SphereGeometry(0.42 - index * 0.07, 10, 10),
        tailMaterial,
      );
      tailNode.position.z = -0.7 - index * 0.55;
      tailNode.scale.set(1.2, 0.8, 1.6 + index * 0.25);
      this.tail.add(tailNode);
    }

    this.reset(anchor);
  }

  reset(anchor = this.anchor) {
    this.anchor.copy(anchor);

    spawnDirection.set(
      THREE.MathUtils.randFloatSpread(1),
      THREE.MathUtils.randFloatSpread(1),
      THREE.MathUtils.randFloatSpread(1),
    ).normalize();

    const spawnDistance = THREE.MathUtils.randFloat(110, 210);
    this.group.position.copy(anchor).addScaledVector(spawnDirection, spawnDistance);
    this.group.scale.setScalar(THREE.MathUtils.randFloat(0.7, 1.65));

    travelDirection.copy(spawnDirection).multiplyScalar(-1);
    travelDirection.x += THREE.MathUtils.randFloatSpread(0.35);
    travelDirection.y += THREE.MathUtils.randFloatSpread(0.35);
    travelDirection.z += THREE.MathUtils.randFloatSpread(0.35);
    travelDirection.normalize();

    this.velocity.copy(travelDirection).multiplyScalar(THREE.MathUtils.randFloat(18, 30));

    this.rotationVelocity.set(
      THREE.MathUtils.randFloatSpread(0.6),
      THREE.MathUtils.randFloatSpread(0.9),
      THREE.MathUtils.randFloatSpread(0.4),
    );

    this.updateOrientation();
  }

  updateOrientation() {
    forward.copy(this.velocity).normalize();
    this.group.quaternion.setFromUnitVectors(orientationForward, forward);
  }

  update(deltaTime, anchor) {
    this.group.position.addScaledVector(this.velocity, deltaTime);
    this.nucleus.rotation.x += this.rotationVelocity.x * deltaTime;
    this.nucleus.rotation.y += this.rotationVelocity.y * deltaTime;
    this.nucleus.rotation.z += this.rotationVelocity.z * deltaTime;

    if (this.group.position.distanceToSquared(anchor) > 260 ** 2) {
      this.reset(anchor);
    }
  }

  dispose() {
    disposeObjectResources(this.group);
  }
}
__bundle["src/world/Comet.js"] = { Comet };
})();

(() => {
const THREE = globalThis.THREE;
function disposeObjectResources(root) {
  const disposedMaterials = new Set();

  root.traverse((object) => {
    if (object.geometry) {
      object.geometry.dispose();
    }

    const materials = Array.isArray(object.material) ? object.material : [object.material];

    for (const material of materials) {
      if (material && !disposedMaterials.has(material)) {
        disposedMaterials.add(material);
        material.dispose();
      }
    }
  });
}

class Planet {
  constructor({
    position = new THREE.Vector3(),
    radius = 6,
    color = 0x5d77ff,
    accentColor = 0x8db6ff,
    atmosphereColor = 0x7bc9ff,
    hasRing = false,
  } = {}) {
    this.group = new THREE.Group();
    this.radius = radius;
    this.collisionSphere = new THREE.Sphere(position.clone(), radius);
    this.gravityRadius = radius * 4.3 + 18;
    this.gravityStrength = 4.5 + radius * 0.62;
    this.rotationSpeed = THREE.MathUtils.randFloat(-0.12, 0.12);
    this.surfacePulse = Math.random() * Math.PI * 2;
    this.time = Math.random() * 100;

    this.group.position.copy(position);

    const planetMaterial = new THREE.MeshStandardMaterial({
      color,
      emissive: accentColor,
      emissiveIntensity: 0.18,
      roughness: 0.78,
      metalness: 0.08,
    });

    const atmosphereMaterial = new THREE.MeshStandardMaterial({
      color: atmosphereColor,
      emissive: atmosphereColor,
      emissiveIntensity: 0.35,
      roughness: 0.16,
      metalness: 0.02,
      transparent: true,
      opacity: 0.13,
      side: THREE.DoubleSide,
    });

    this.planetMesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 28, 22),
      planetMaterial,
    );
    this.planetMesh.userData.planet = this;
    this.group.add(this.planetMesh);

    this.atmosphereMesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 1.06, 24, 18),
      atmosphereMaterial,
    );
    this.group.add(this.atmosphereMesh);

    this.addSurfaceBands(accentColor);

    if (hasRing) {
      this.createRing(accentColor);
    }
  }

  get position() {
    return this.group.position;
  }

  addSurfaceBands(accentColor) {
    const bandMaterial = new THREE.MeshStandardMaterial({
      color: accentColor,
      emissive: accentColor,
      emissiveIntensity: 0.08,
      roughness: 0.68,
      metalness: 0.03,
      transparent: true,
      opacity: 0.26,
    });

    const band = new THREE.Mesh(
      new THREE.TorusGeometry(this.radius * 0.78, this.radius * 0.08, 12, 50),
      bandMaterial,
    );
    band.rotation.x = Math.PI * 0.45;
    band.rotation.y = Math.PI * 0.22;
    this.surfaceBand = band;
    this.group.add(band);
  }

  createRing(accentColor) {
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: accentColor,
      emissive: accentColor,
      emissiveIntensity: 0.16,
      roughness: 0.46,
      metalness: 0.04,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
    });

    this.ringMesh = new THREE.Mesh(
      new THREE.TorusGeometry(this.radius * 1.42, this.radius * 0.16, 4, 70),
      ringMaterial,
    );
    this.ringMesh.rotation.x = Math.PI * 0.5;
    this.ringMesh.rotation.y = Math.PI * THREE.MathUtils.randFloat(0.15, 0.45);
    this.group.add(this.ringMesh);
  }

  update(deltaTime) {
    this.time += deltaTime;
    this.planetMesh.rotation.y += this.rotationSpeed * deltaTime;
    this.planetMesh.rotation.z += this.rotationSpeed * 0.35 * deltaTime;
    this.surfaceBand.rotation.z += this.rotationSpeed * 0.6 * deltaTime;
    this.atmosphereMesh.scale.setScalar(1.06 + Math.sin(this.time * 0.75 + this.surfacePulse) * 0.005);

    if (this.ringMesh) {
      this.ringMesh.rotation.z += this.rotationSpeed * 0.2 * deltaTime;
    }
  }

  dispose() {
    disposeObjectResources(this.group);
  }
}
__bundle["src/world/Planet.js"] = { Planet };
})();

(() => {
const THREE = globalThis.THREE;
const { Comet } = __bundle["src/world/Comet.js"];
const { Planet } = __bundle["src/world/Planet.js"];
const PLANET_FIELD_RADIUS = 1;
const PLANET_KEEP_RADIUS = PLANET_FIELD_RADIUS + 1;
const PLANET_SECTOR_SIZE = 180;
const PLANET_PALETTES = [
  { color: 0x5167d6, accentColor: 0xb0c0ff, atmosphereColor: 0x86d4ff },
  { color: 0x8a5fd2, accentColor: 0xe4b8ff, atmosphereColor: 0xb58fff },
  { color: 0x4a9365, accentColor: 0xbfe7a2, atmosphereColor: 0x8fe0b8 },
  { color: 0xb36c44, accentColor: 0xffcf8b, atmosphereColor: 0xffa76f },
  { color: 0x336a78, accentColor: 0x98f0ff, atmosphereColor: 0x77c7ff },
];

const separationVector = new THREE.Vector3();
const sectorCoords = new THREE.Vector3();
const raycastDirection = new THREE.Vector3();
const raycastOrigin = new THREE.Vector3();
const lineOfSightRaycaster = new THREE.Raycaster();

function hashCoordinate(x, y, z, seed = 0) {
  let hash = Math.imul((x + 1013) | 0, 374761393)
    ^ Math.imul((y + 2081) | 0, 668265263)
    ^ Math.imul((z + 3253) | 0, 2147483647)
    ^ Math.imul((seed + 4049) | 0, 1274126177);

  hash = (hash ^ (hash >>> 13)) >>> 0;
  hash = Math.imul(hash, 1274126177) >>> 0;
  hash ^= hash >>> 16;

  return (hash >>> 0) / 4294967295;
}

function toSectorCoordinate(value) {
  return Math.floor(value / PLANET_SECTOR_SIZE);
}

function createSectorKey(x, y, z) {
  return `${x}:${y}:${z}`;
}

function seededRange(x, y, z, seed, min, max) {
  return min + (max - min) * hashCoordinate(x, y, z, seed);
}

function createSectorPlanets(sectorX, sectorY, sectorZ) {
  const sectorRoll = hashCoordinate(sectorX, sectorY, sectorZ, 1);
  const planetCount = sectorRoll > 0.82 ? 2 : sectorRoll > 0.36 ? 1 : 0;
  const planets = [];
  const sectorCenter = new THREE.Vector3(
    sectorX * PLANET_SECTOR_SIZE,
    sectorY * PLANET_SECTOR_SIZE,
    sectorZ * PLANET_SECTOR_SIZE,
  );

  for (let index = 0; index < planetCount; index += 1) {
    const paletteIndex = Math.floor(hashCoordinate(sectorX, sectorY, sectorZ, 10 + index) * PLANET_PALETTES.length) % PLANET_PALETTES.length;
    const palette = PLANET_PALETTES[paletteIndex];
    const position = new THREE.Vector3(
      sectorCenter.x + seededRange(sectorX, sectorY, sectorZ, 20 + index * 4, -PLANET_SECTOR_SIZE * 0.28, PLANET_SECTOR_SIZE * 0.28),
      sectorCenter.y + seededRange(sectorX, sectorY, sectorZ, 21 + index * 4, -PLANET_SECTOR_SIZE * 0.3, PLANET_SECTOR_SIZE * 0.3),
      sectorCenter.z + seededRange(sectorX, sectorY, sectorZ, 22 + index * 4, -PLANET_SECTOR_SIZE * 0.28, PLANET_SECTOR_SIZE * 0.28),
    );
    const radius = seededRange(sectorX, sectorY, sectorZ, 23 + index * 4, 6.8, 15.8);
    const hasRing = hashCoordinate(sectorX, sectorY, sectorZ, 30 + index) > 0.62;

    planets.push(new Planet({
      position,
      radius,
      color: palette.color,
      accentColor: palette.accentColor,
      atmosphereColor: palette.atmosphereColor,
      hasRing,
    }));
  }

  return planets;
}

class EnvironmentManager {
  constructor({ scene, player, cometCount = 8 } = {}) {
    this.scene = scene;
    this.player = player;
    this.group = new THREE.Group();
    this.group.name = "Environment";
    this.planetSectors = new Map();
    this.planets = [];
    this.comets = Array.from({ length: cometCount }, () => new Comet({ anchor: player.position }));

    this.scene.add(this.group);

    for (const comet of this.comets) {
      this.group.add(comet.group);
    }

    this.ensurePlanetField(this.player.position);
  }

  ensurePlanetField(referencePosition = this.player.position) {
    sectorCoords.set(
      toSectorCoordinate(referencePosition.x),
      toSectorCoordinate(referencePosition.y),
      toSectorCoordinate(referencePosition.z),
    );

    let didChange = false;

    for (let offsetX = -PLANET_FIELD_RADIUS; offsetX <= PLANET_FIELD_RADIUS; offsetX += 1) {
      for (let offsetY = -PLANET_FIELD_RADIUS; offsetY <= PLANET_FIELD_RADIUS; offsetY += 1) {
        for (let offsetZ = -PLANET_FIELD_RADIUS; offsetZ <= PLANET_FIELD_RADIUS; offsetZ += 1) {
          const sectorX = sectorCoords.x + offsetX;
          const sectorY = sectorCoords.y + offsetY;
          const sectorZ = sectorCoords.z + offsetZ;
          const sectorKey = createSectorKey(sectorX, sectorY, sectorZ);

          if (this.planetSectors.has(sectorKey)) {
            continue;
          }

          const planets = createSectorPlanets(sectorX, sectorY, sectorZ);

          for (const planet of planets) {
            this.group.add(planet.group);
          }

          this.planetSectors.set(sectorKey, {
            sectorX,
            sectorY,
            sectorZ,
            planets,
          });
          didChange = true;
        }
      }
    }

    for (const [sectorKey, entry] of this.planetSectors) {
      if (
        Math.abs(entry.sectorX - sectorCoords.x) > PLANET_KEEP_RADIUS
        || Math.abs(entry.sectorY - sectorCoords.y) > PLANET_KEEP_RADIUS
        || Math.abs(entry.sectorZ - sectorCoords.z) > PLANET_KEEP_RADIUS
      ) {
        for (const planet of entry.planets) {
          this.group.remove(planet.group);
          planet.dispose();
        }

        this.planetSectors.delete(sectorKey);
        didChange = true;
      }
    }

    if (didChange) {
      this.planets = Array.from(this.planetSectors.values()).flatMap((entry) => entry.planets);
    }
  }

  update(deltaTime) {
    this.ensurePlanetField(this.player.position);

    for (const planet of this.planets) {
      planet.update(deltaTime);
    }

    for (const comet of this.comets) {
      comet.update(deltaTime, this.player.position);
    }
  }

  isProjectileBlocked(projectile) {
    this.ensurePlanetField(this.player.position);

    for (const planet of this.planets) {
      if (projectile.intersectsSphere(planet.collisionSphere)) {
        return true;
      }
    }

    return false;
  }

  isLineBlocked(start, end) {
    this.ensurePlanetField(start);
    this.ensurePlanetField(end);

    raycastDirection.copy(end).sub(start);
    const distance = raycastDirection.length();

    if (distance <= 0.001 || this.planets.length === 0) {
      return false;
    }

    raycastDirection.normalize();
    raycastOrigin.copy(start).addScaledVector(raycastDirection, 0.35);
    lineOfSightRaycaster.set(raycastOrigin, raycastDirection);
    lineOfSightRaycaster.far = Math.max(0, distance - 0.35);

    return lineOfSightRaycaster.intersectObjects(
      this.planets.map((planet) => planet.planetMesh),
      false,
    ).length > 0;
  }

  getPlanetsWithinRange(position, radius) {
    this.ensurePlanetField(position);
    const radiusSquared = radius ** 2;

    return this.planets.filter((planet) => (
      planet.collisionSphere.center.distanceToSquared(position)
      <= (planet.gravityRadius + radius) ** 2 + radiusSquared
    ));
  }

  resolveShipCollisions(ship) {
    if (!ship || ship.isDestroyed) {
      return;
    }

    this.ensurePlanetField(ship.position);

    for (const planet of this.planets) {
      separationVector.copy(ship.position).sub(planet.collisionSphere.center);
      const minDistance = planet.collisionSphere.radius + ship.collisionRadius;
      const distance = separationVector.length();

      if (distance === 0) {
        separationVector.set(0, 1, 0);
      } else if (distance >= minDistance) {
        continue;
      }

      separationVector.normalize();
      ship.position.copy(planet.collisionSphere.center).addScaledVector(separationVector, minDistance);

      const inwardSpeed = ship.velocity.dot(separationVector);

      if (inwardSpeed < 0) {
        ship.velocity.addScaledVector(separationVector, -inwardSpeed);
      }

      ship.updateCollisionBounds();
    }
  }

  getSafePosition(position, paddingRadius = 0) {
    this.ensurePlanetField(position);
    const safePosition = position.clone();

    for (const planet of this.planets) {
      separationVector.copy(safePosition).sub(planet.collisionSphere.center);
      const minDistance = planet.collisionSphere.radius + paddingRadius;
      const distance = separationVector.length();

      if (distance === 0) {
        separationVector.set(0, 1, 0);
      } else if (distance >= minDistance) {
        continue;
      }

      separationVector.normalize();
      safePosition.copy(planet.collisionSphere.center).addScaledVector(separationVector, minDistance);
    }

    return safePosition;
  }

  dispose() {
    for (const entry of this.planetSectors.values()) {
      for (const planet of entry.planets) {
        planet.dispose();
      }
    }

    for (const comet of this.comets) {
      comet.dispose();
    }

    this.planetSectors.clear();
    this.planets.length = 0;
    this.scene.remove(this.group);
  }
}
__bundle["src/world/EnvironmentManager.js"] = { EnvironmentManager };
})();

(() => {
const THREE = globalThis.THREE;
const { playHitSound, playLowHealthSound } = __bundle["src/audio/placeholders.js"];
const { InputController } = __bundle["src/core/InputController.js"];
const { ImpactFlashSystem } = __bundle["src/effects/ImpactFlashSystem.js"];
const { ExplosionSystem } = __bundle["src/effects/ExplosionSystem.js"];
const { PlayerShip } = __bundle["src/entities/PlayerShip.js"];
const { EnemyManager } = __bundle["src/game/EnemyManager.js"];
const { FollowCamera } = __bundle["src/game/FollowCamera.js"];
const { EnergySystem } = __bundle["src/systems/EnergySystem.js"];
const { GravitySystem } = __bundle["src/systems/GravitySystem.js"];
const { MotionBlurSystem } = __bundle["src/systems/MotionBlurSystem.js"];
const { ShieldSystem } = __bundle["src/systems/ShieldSystem.js"];
const { StealthSystem } = __bundle["src/systems/StealthSystem.js"];
const { TimeSystem } = __bundle["src/systems/TimeSystem.js"];
const { HUDController } = __bundle["src/ui/HUDController.js"];
const { ProjectileSystem } = __bundle["src/weapons/ProjectileSystem.js"];
const { BackdropField } = __bundle["src/world/BackdropField.js"];
const { EnvironmentManager } = __bundle["src/world/EnvironmentManager.js"];
const respawnPosition = new THREE.Vector3(0, 0, 0);

class Game {
  constructor({ canvas }) {
    this.canvas = canvas;
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x02050e);
    this.scene.fog = new THREE.FogExp2(0x02050e, 0.0025);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 2.4, 8.5);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;

    this.input = new InputController(this.canvas);
    this.player = new PlayerShip();
    this.followCamera = new FollowCamera(this.camera, this.player);
    this.hud = new HUDController(document);
    this.motionBlurSystem = new MotionBlurSystem({ root: document });
    this.backdrop = new BackdropField();
    this.energySystem = new EnergySystem();
    this.shieldSystem = new ShieldSystem();
    this.timeSystem = new TimeSystem();
    this.projectileSystem = new ProjectileSystem({ scene: this.scene });
    this.explosionSystem = new ExplosionSystem({ scene: this.scene });
    this.impactFlashSystem = new ImpactFlashSystem({ scene: this.scene });
    this.environmentManager = new EnvironmentManager({
      scene: this.scene,
      player: this.player,
    });
    this.gravitySystem = new GravitySystem({ scene: this.scene });
    this.stealthSystem = new StealthSystem();
    this.enemyManager = new EnemyManager({
      scene: this.scene,
      player: this.player,
      projectileSystem: this.projectileSystem,
      explosionSystem: this.explosionSystem,
      environmentManager: this.environmentManager,
    });

    this.animationFrameId = null;
    this.playerRespawnTimer = 0;
    this.playerRespawnDelay = 2.2;
    this.lowHealthSoundCooldown = 0;
    this.isPaused = false;
    this.isDebugVisible = false;
    this.score = 0;
    this.kills = 0;
    this.elapsedTime = 0;
    this.bestWave = this.enemyManager.currentWave;
    this.lastWaveNumber = this.enemyManager.currentWave;

    this.handleResize = this.handleResize.bind(this);
    this.animate = this.animate.bind(this);

    this.setupScene();
  }

  setupScene() {
    const ambientLight = new THREE.AmbientLight(0x8eb8ff, 0.64);
    this.scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(0x7baeff, 0x080d18, 0.78);
    this.scene.add(hemisphereLight);

    const directionalLight = new THREE.DirectionalLight(0xdde8ff, 1.35);
    directionalLight.position.set(7, 9, 10);
    this.scene.add(directionalLight);

    const rimLight = new THREE.DirectionalLight(0x4f8fff, 0.55);
    rimLight.position.set(-12, 4, -8);
    this.scene.add(rimLight);

    const warmFill = new THREE.PointLight(0xff8f72, 1.15, 120, 2);
    warmFill.position.set(18, -8, -28);
    this.scene.add(warmFill);

    this.scene.add(this.backdrop.group);
    this.scene.add(this.player.group);
    this.hud.showBanner(
      `Wave ${this.enemyManager.currentWave}`,
      "Arrow keys move. C boosts. X shields. Shift bends time. Use planets as cover, then strike.",
      3.4,
    );
  }

  start() {
    window.addEventListener("resize", this.handleResize);
    this.clock.start();
    this.animate();
  }

  animate() {
    this.animationFrameId = window.requestAnimationFrame(this.animate);

    const deltaTime = Math.min(this.clock.getDelta(), 0.05);

    this.input.update(deltaTime);

    if (this.input.consumeRestartRequest()) {
      this.resetRun();
    }

    if (this.input.consumePauseToggleRequest()) {
      this.isPaused = !this.isPaused;

      if (this.isPaused && document.exitPointerLock) {
        document.exitPointerLock();
      }

      this.hud.showBanner(
        this.isPaused ? "Simulation Paused" : "Back Online",
        this.isPaused
          ? "Press P to resume or T to restart the run."
          : "Arrow keys for movement. C boosts. X shields. Shift bends time. Re-engage.",
        1.8,
      );
    }

    if (this.input.consumeDebugToggleRequest()) {
      this.isDebugVisible = !this.isDebugVisible;
      this.gravitySystem.setDebugVisible(this.isDebugVisible);
      this.stealthSystem.setDebugVisible(this.isDebugVisible);
      this.hud.showBanner(
        this.isDebugVisible ? "Debug Overlays On" : "Debug Overlays Off",
        this.isDebugVisible
          ? "Enemy vision cones and gravity fields are now visible."
          : "Tactical overlays hidden.",
        1.6,
      );
    }

    if (!this.isPaused) {
      this.lowHealthSoundCooldown = Math.max(0, this.lowHealthSoundCooldown - deltaTime);
      this.elapsedTime += deltaTime;
      this.timeSystem.update(deltaTime, {
        inputController: this.input,
        energySystem: this.energySystem,
        player: this.player,
      });
      this.shieldSystem.update(deltaTime, {
        inputController: this.input,
        energySystem: this.energySystem,
        player: this.player,
      });

      const worldDelta = deltaTime * this.timeSystem.getWorldScale();
      const playerDelta = deltaTime * this.timeSystem.getPlayerScale();

      this.player.setTimeDilationAmount(this.timeSystem.effectAmount);
      this.player.setShieldFieldAmount(this.shieldSystem.getVisualAmount());
      this.player.setShieldImpactAmount(this.shieldSystem.getImpactAmount());
      this.player.update(playerDelta, this.input, this.projectileSystem, {
        energySystem: this.energySystem,
      });

      const shotShake = this.player.weaponSystem.consumeCameraShake();

      if (shotShake > 0) {
        this.followCamera.addShake(shotShake);
      }

      if (this.player.weaponSystem.consumeHudPulse() > 0) {
        this.hud.triggerWeaponPulse();
      }

      this.gravitySystem.update(worldDelta, {
        player: this.player,
        playerDeltaTime: playerDelta,
        enemies: this.enemyManager.enemies,
        projectiles: this.projectileSystem.projectiles,
        environmentManager: this.environmentManager,
      });

      this.environmentManager.resolveShipCollisions(this.player);
      this.stealthSystem.update(worldDelta, {
        player: this.player,
        enemies: this.enemyManager.enemies,
        environmentManager: this.environmentManager,
      });

      const stealthState = this.stealthSystem.playerState;
      this.player.setStealthFieldAmount(
        stealthState === "hidden"
          ? 0.34
          : stealthState === "suspicious"
            ? 0.14
            : 0,
      );

      this.enemyManager.update(worldDelta, {
        stealthSystem: this.stealthSystem,
      });

      for (const enemy of this.enemyManager.enemies) {
        this.environmentManager.resolveShipCollisions(enemy);
      }

      this.projectileSystem.update(worldDelta);
      this.handleProjectileCollisions();
      this.updateRespawn(deltaTime);
      this.environmentManager.update(worldDelta);
      this.impactFlashSystem.update(worldDelta);
      this.explosionSystem.update(worldDelta);
      this.energySystem.update(deltaTime, {
        regenerationEnabled: !this.timeSystem.isActive && !this.player.isBoosting && !this.shieldSystem.isActive,
        regenerationMultiplier: this.stealthSystem.isPlayerHidden() ? 1.18 : 1,
      });
      this.followCamera.setTimeDilation(this.timeSystem.effectAmount);
      this.followCamera.setGravityInfluence(this.gravitySystem.getPlayerInfluence());
      this.followCamera.update(deltaTime);
      this.motionBlurSystem.update(deltaTime, {
        player: this.player,
        timeSystem: this.timeSystem,
        gravitySystem: this.gravitySystem,
        shieldSystem: this.shieldSystem,
        isPaused: false,
      });
      this.handleWaveTransitions();
      this.renderer.toneMappingExposure = 1.08 + this.timeSystem.effectAmount * 0.12;
    } else {
      this.motionBlurSystem.update(deltaTime, {
        player: this.player,
        timeSystem: this.timeSystem,
        gravitySystem: this.gravitySystem,
        shieldSystem: this.shieldSystem,
        isPaused: true,
      });
    }

    this.backdrop.update(deltaTime, this.player.position, this.camera);
    this.hud.update(deltaTime, {
      player: this.player,
      energy: this.energySystem.getHudState(),
      stealth: this.stealthSystem.getHudState(),
      shield: this.shieldSystem.getHudState(),
      time: this.timeSystem.getHudState(),
      debug: this.getDebugState(),
      weapon: this.player.weaponSystem.getHudState(),
      wave: this.enemyManager.getWaveState(),
      session: this.getSessionState(),
      overlay: this.getOverlayState(),
    });

    this.renderer.render(this.scene, this.camera);
  }

  handleWaveTransitions() {
    const currentWave = this.enemyManager.currentWave;

    if (currentWave !== this.lastWaveNumber) {
      this.lastWaveNumber = currentWave;
      this.bestWave = Math.max(this.bestWave, currentWave);
      this.hud.showBanner(`Wave ${currentWave}`, "Fresh hostiles warping into the battlefield.", 2.2);
    }
  }

  handleProjectileCollisions() {
    for (let index = this.projectileSystem.projectiles.length - 1; index >= 0; index -= 1) {
      const projectile = this.projectileSystem.projectiles[index];

      if (!projectile) {
        continue;
      }

      if (this.environmentManager.isProjectileBlocked(projectile)) {
        this.impactFlashSystem.spawnImpactFlash({
          position: projectile.position.clone(),
          color: projectile.impactColor,
          scale: projectile.impactScale,
        });
        this.projectileSystem.removeProjectile(projectile);
        continue;
      }

      if (projectile.ownerTag === "player") {
        for (const enemy of this.enemyManager.enemies) {
          if (enemy.isDestroyed) {
            continue;
          }

          if (projectile.intersectsSphere(enemy.collisionSphere)) {
            this.impactFlashSystem.spawnImpactFlash({
              position: projectile.position.clone(),
              color: projectile.impactColor,
              scale: projectile.impactScale,
            });
            this.projectileSystem.removeProjectile(projectile);
            const wasDestroyed = enemy.takeDamage(projectile.damage);
            playHitSound();
            this.followCamera.addShake(0.08);

            if (wasDestroyed) {
              this.kills += 1;
              this.score += enemy.scoreValue ?? Math.round(enemy.maxHealth * 8);
              this.player.heal(enemy.healthReward ?? 10);
              this.enemyManager.destroyEnemy(enemy);
              this.followCamera.addShake(0.24);
            }

            break;
          }
        }

        continue;
      }

      if (projectile.ownerTag === "enemy" && !this.player.isDestroyed) {
        if (projectile.intersectsSphere(this.player.collisionSphere)) {
          this.impactFlashSystem.spawnImpactFlash({
            position: projectile.position.clone(),
            color: projectile.impactColor,
            scale: projectile.impactScale * 0.9,
          });
          this.projectileSystem.removeProjectile(projectile);
          const incomingDamage = this.shieldSystem.absorbDamage(projectile.damage, this.energySystem);
          this.player.setShieldImpactAmount(this.shieldSystem.getImpactAmount());
          const playerDestroyed = this.player.takeDamage(incomingDamage);
          playHitSound();
          this.hud.triggerDamagePulse();
          this.followCamera.addShake(incomingDamage < projectile.damage ? 0.12 : 0.18);

          if (playerDestroyed) {
            this.handlePlayerDestroyed();
          } else if (this.player.getHealthRatio() < 0.3 && this.lowHealthSoundCooldown === 0) {
            playLowHealthSound();
            this.lowHealthSoundCooldown = 4;
            this.hud.triggerLowHealthPulse();
          }
        }
      }
    }
  }

  handlePlayerDestroyed() {
    this.explosionSystem.spawnExplosion({
      position: this.player.position.clone(),
      color: 0x86d7ff,
      scale: 1.45,
    });

    this.playerRespawnTimer = this.playerRespawnDelay;
    this.projectileSystem.removeProjectilesByOwnerTag("enemy");
    this.shieldSystem.reset();
    this.timeSystem.reset();
    this.player.setTimeDilationAmount(0);
    this.player.setStealthFieldAmount(0);
    this.player.setShieldFieldAmount(0);
    this.player.setShieldImpactAmount(0);
    this.followCamera.addShake(0.42);
    this.hud.showBanner("Hull Breach", "Reconstructing ship systems for redeployment.", 1.8);
  }

  updateRespawn(deltaTime) {
    if (this.playerRespawnTimer <= 0) {
      return;
    }

    this.playerRespawnTimer = Math.max(0, this.playerRespawnTimer - deltaTime);

    if (this.playerRespawnTimer === 0) {
      this.player.respawn(this.environmentManager.getSafePosition(respawnPosition, this.player.collisionRadius));
      this.projectileSystem.removeProjectilesByOwnerTag("enemy");
      this.lowHealthSoundCooldown = 0;
      this.energySystem.reset();
      this.shieldSystem.reset();
      this.timeSystem.reset();
      this.hud.showBanner("Redeployed", "Hull restored. Weapons systems back online.", 1.5);
    }
  }

  getSessionState() {
    return {
      score: this.score,
      kills: this.kills,
      elapsedTime: this.elapsedTime,
      bestWave: this.bestWave,
    };
  }

  getOverlayState() {
    if (this.isPaused) {
      return {
        visible: true,
        eyebrow: "Simulation Paused",
        title: "Tactical Hold",
        copy: "Press P to resume. Use C to boost, X for shields, Shift for slow time, and V for debug overlays. Press T to restart this run.",
      };
    }

    if (this.playerRespawnTimer > 0) {
      return {
        visible: true,
        eyebrow: "Hull Recovery",
        title: "Ship Reconstructing",
        copy: `Redeploying in ${this.playerRespawnTimer.toFixed(1)}s`,
      };
    }

    return { visible: false };
  }

  resetRun() {
    this.isPaused = false;
    this.score = 0;
    this.kills = 0;
    this.elapsedTime = 0;
    this.playerRespawnTimer = 0;
    this.lowHealthSoundCooldown = 0;
    this.energySystem.reset();
    this.shieldSystem.reset();
    this.timeSystem.reset();
    this.projectileSystem.clear();
    this.impactFlashSystem.dispose();
    this.explosionSystem.dispose();
    this.enemyManager.reset();
    this.stealthSystem.update(0, {
      player: this.player,
      enemies: this.enemyManager.enemies,
      environmentManager: this.environmentManager,
    });
    this.bestWave = this.enemyManager.currentWave;
    this.lastWaveNumber = this.enemyManager.currentWave;
    this.player.respawn(this.environmentManager.getSafePosition(respawnPosition, this.player.collisionRadius));
    this.player.setStealthFieldAmount(0);
    this.player.setShieldFieldAmount(0);
    this.player.setShieldImpactAmount(0);
    this.motionBlurSystem.reset();
    this.followCamera.addShake(0.12);
    this.hud.showBanner(
      `Wave ${this.enemyManager.currentWave}`,
      "Run restarted. Hide behind planets, manage energy, raise shields, and strike with intent.",
      2.6,
    );
  }

  getDebugState() {
    if (!this.isDebugVisible) {
      return {
        visible: false,
        enemyStates: [],
      };
    }

    return {
      visible: this.isDebugVisible,
      enemyStates: this.enemyManager.enemies.map((enemy) => {
        const perception = this.stealthSystem.getEnemyPerception(enemy);
        const exactState = perception.state ?? "idle";
        const detail = perception.canSeePlayer
          ? "Line of sight clear"
          : perception.isBlocked
            ? "Line of sight blocked by planet"
            : "Player outside vision cone";

        return {
          label: `${enemy.typeLabel} ${String(enemy.debugId ?? 0).padStart(2, "0")}`,
          state: exactState,
          detection: Math.round((perception.detection ?? 0) * 100),
          detail,
        };
      }),
    };
  }

  handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  dispose() {
    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId);
    }

    window.removeEventListener("resize", this.handleResize);
    this.input.dispose();
    this.enemyManager.dispose();
    this.projectileSystem.dispose();
    this.environmentManager.dispose();
    this.gravitySystem.dispose();
    this.motionBlurSystem.reset();
    this.stealthSystem.dispose();
    this.impactFlashSystem.dispose();
    this.explosionSystem.dispose();
    this.player.dispose();
    this.scene.remove(this.backdrop.group);
    this.backdrop.dispose();
    this.renderer.dispose();
  }
}
__bundle["src/game/Game.js"] = { Game };
})();

(() => {
const { Game } = __bundle["src/game/Game.js"];
const canvas = document.querySelector("#game");

if (!canvas) {
  throw new Error("Game canvas not found.");
}

const game = new Game({ canvas });
game.start();
__bundle["src/main.js"] = {};
})();
})();
