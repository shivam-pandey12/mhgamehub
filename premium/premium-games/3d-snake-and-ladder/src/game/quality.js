export const QUALITY_OPTIONS = ["auto", "low", "medium", "high"];

export const QUALITY_PROFILES = {
  low: {
    id: "low",
    label: "Low",
    pixelRatioCap: 1,
    shadowEnabled: false,
    shadowMapSize: 512,
    particleScale: 0.32,
    glowScale: 0.72
  },
  medium: {
    id: "medium",
    label: "Medium",
    pixelRatioCap: 1.35,
    shadowEnabled: true,
    shadowMapSize: 1024,
    particleScale: 0.62,
    glowScale: 0.86
  },
  high: {
    id: "high",
    label: "High",
    pixelRatioCap: 2,
    shadowEnabled: true,
    shadowMapSize: 1536,
    particleScale: 1,
    glowScale: 1
  }
};

export function normalizeQualityLevel(value) {
  const level = String(value || "auto").toLowerCase();
  return QUALITY_OPTIONS.includes(level) ? level : "auto";
}

export function resolveQualityProfile(level = "auto") {
  const normalized = normalizeQualityLevel(level);
  if (normalized !== "auto") return QUALITY_PROFILES[normalized];
  return isLowPowerDevice() ? QUALITY_PROFILES.low : isCompactDevice() ? QUALITY_PROFILES.medium : QUALITY_PROFILES.high;
}

export function getQualityRows() {
  return [
    ["auto", "Auto"],
    ["low", "Low"],
    ["medium", "Medium"],
    ["high", "High"]
  ];
}

export function isWebGLSupported() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

function isCompactDevice() {
  return window.matchMedia?.("(max-width: 820px)")?.matches || false;
}

function isLowPowerDevice() {
  const memory = Number(navigator.deviceMemory || 0);
  const cores = Number(navigator.hardwareConcurrency || 0);
  return isCompactDevice() || (memory > 0 && memory <= 4) || (cores > 0 && cores <= 4);
}
