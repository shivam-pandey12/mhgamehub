let audioContext;
let masterGain;
let ambientNodes = [];

function ensureAudio() {
  if (typeof window === "undefined") {
    return null;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContextClass();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.18;
    masterGain.connect(audioContext.destination);
  }

  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }

  return audioContext;
}

function stopAmbientNodes() {
  for (const node of ambientNodes) {
    try {
      node.stop();
    } catch {
      continue;
    }
  }

  ambientNodes = [];
}

export function playTapSound() {
  const context = ensureAudio();
  if (!context || !masterGain) {
    return;
  }

  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const click = context.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(420, now);
  oscillator.frequency.exponentialRampToValueAtTime(180, now + 0.08);
  click.gain.setValueAtTime(0.001, now);
  click.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
  click.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

  oscillator.connect(click);
  click.connect(masterGain);
  oscillator.start(now);
  oscillator.stop(now + 0.12);
}

export function syncAmbientAudio(enabled) {
  const context = ensureAudio();

  if (!context || !masterGain) {
    return;
  }

  if (!enabled) {
    stopAmbientNodes();
    return;
  }

  if (ambientNodes.length > 0) {
    return;
  }

  const now = context.currentTime;
  const frequencies = [126, 189, 252];

  ambientNodes = frequencies.map((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = index === 0 ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.012 - index * 0.002, now + 1.2);

    oscillator.connect(gain);
    gain.connect(masterGain);
    oscillator.start(now);
    return oscillator;
  });
}
