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

export const soundEngine = new SoundEngine();
