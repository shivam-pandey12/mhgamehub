export function createAnimationToken() {
  return {
    cancelled: false,
    cancel() {
      this.cancelled = true;
    }
  };
}

export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export function tween({ duration = 400, ease = easeInOutCubic, onUpdate, onComplete, token }) {
  const start = performance.now();

  return new Promise((resolve) => {
    function frame(now) {
      if (token?.cancelled) {
        resolve(false);
        return;
      }

      const progress = Math.min(1, (now - start) / duration);
      const value = ease(progress);
      onUpdate?.(value, progress);

      if (progress >= 1) {
        onComplete?.();
        resolve(true);
        return;
      }

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  });
}
