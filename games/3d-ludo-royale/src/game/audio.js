const SOUND_TYPES = new Set(['dice', 'move', 'capture', 'home', 'win', 'invalid']);

export function playSound(type) {
  if (!SOUND_TYPES.has(type)) {
    return;
  }

  try {
    const audioContext = window.__ludoAudioContext
      || new (window.AudioContext || window.webkitAudioContext)();
    window.__ludoAudioContext = audioContext;

    if (audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {});
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    const config = {
      dice: [310, 0.045, 0.022],
      move: [420, 0.035, 0.018],
      capture: [170, 0.12, 0.04],
      home: [560, 0.14, 0.035],
      win: [660, 0.22, 0.045],
      invalid: [130, 0.08, 0.02]
    }[type];

    oscillator.frequency.setValueAtTime(config[0], now);
    oscillator.type = type === 'capture' || type === 'invalid' ? 'triangle' : 'sine';
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(config[2], now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + config[1]);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + config[1] + 0.02);
  } catch {
    // Audio is optional. The game must remain playable if the browser blocks it.
  }
}
