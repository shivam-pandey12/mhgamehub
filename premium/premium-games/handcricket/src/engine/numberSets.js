// @ts-check

const CLASSIC_NUMBERS = Object.freeze([1, 2, 3, 4, 5, 6]);
const MIN_ALLOWED_NUMBER = 1;
const MAX_ALLOWED_NUMBER = 99;
const MIN_ALLOWED_COUNT = 2;
const MAX_ALLOWED_COUNT = 16;

const PRESETS = Object.freeze([
  Object.freeze({
    id: "classic",
    label: "Classic 1-6",
    allowedNumbers: CLASSIC_NUMBERS,
  }),
  Object.freeze({
    id: "power",
    label: "Power Mode",
    allowedNumbers: Object.freeze([1, 2, 3, 4, 5, 6, 8, 10]),
  }),
  Object.freeze({
    id: "chaos",
    label: "Chaos Mode",
    allowedNumbers: Object.freeze([1, 3, 5, 7, 9, 11]),
  }),
  Object.freeze({
    id: "risk",
    label: "Risk Mode",
    allowedNumbers: Object.freeze([1, 2, 4, 6, 10, 20]),
  }),
  Object.freeze({
    id: "low-score",
    label: "Low Score Mode",
    allowedNumbers: Object.freeze([1, 2, 3, 4]),
  }),
]);

const PRESET_BY_ID = new Map(PRESETS.map((preset) => [preset.id, preset]));

/**
 * @param {unknown} value
 * @returns {number | null}
 */
function parsePositiveInteger(value) {
  if (typeof value === "number") {
    return Number.isInteger(value) ? value : null;
  }

  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  if (!/^\d+$/.test(value.trim())) {
    return null;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}

/**
 * @param {unknown} input
 * @returns {unknown[]}
 */
function listFromInput(input) {
  if (Array.isArray(input)) {
    return input;
  }

  if (typeof input === "string") {
    return input
      .split(/[\s,|]+/)
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return [];
}

/**
 * @param {number[]} allowedNumbers
 * @returns {string}
 */
export function formatAllowedNumbers(allowedNumbers) {
  return allowedNumbers.join(", ");
}

/**
 * @returns {{ numberSetMode: "classic"; numberSetPreset: "classic"; numberSetLabel: string; allowedNumbers: number[]; numberRangeMin: number; numberRangeMax: number; customNumbersText: string }}
 */
export function getDefaultNumberSet() {
  return {
    numberSetMode: "classic",
    numberSetPreset: "classic",
    numberSetLabel: "Classic 1-6",
    allowedNumbers: [...CLASSIC_NUMBERS],
    numberRangeMin: 1,
    numberRangeMax: 6,
    customNumbersText: formatAllowedNumbers(CLASSIC_NUMBERS),
  };
}

/**
 * @returns {{ id: string; label: string; allowedNumbers: number[] }[]}
 */
export function getNumberSetPresets() {
  return PRESETS.map((preset) => ({
    id: preset.id,
    label: preset.label,
    allowedNumbers: [...preset.allowedNumbers],
  }));
}

/**
 * Sorts and deduplicates positive integer numbers for storage/display.
 *
 * @param {unknown} input
 * @returns {number[]}
 */
export function normalizeAllowedNumbers(input) {
  return Array.from(
    new Set(
      listFromInput(input)
        .map(parsePositiveInteger)
        .filter((value) => value != null && value >= MIN_ALLOWED_NUMBER && value <= MAX_ALLOWED_NUMBER),
    ),
  ).sort((left, right) => left - right);
}

/**
 * @param {unknown} input
 * @returns {{ ok: true; allowedNumbers: number[] } | { ok: false; error: string; allowedNumbers: number[] }}
 */
export function validateAllowedNumbers(input) {
  const entries = listFromInput(input);
  const parsed = entries.map(parsePositiveInteger);
  const allowedNumbers = normalizeAllowedNumbers(input);

  if (!entries.length) {
    return {
      ok: false,
      error: "Choose at least 2 numbers.",
      allowedNumbers,
    };
  }

  if (parsed.some((value) => value == null || value < MIN_ALLOWED_NUMBER)) {
    return {
      ok: false,
      error: "Numbers must be positive whole numbers.",
      allowedNumbers,
    };
  }

  if (parsed.some((value) => value != null && value > MAX_ALLOWED_NUMBER)) {
    return {
      ok: false,
      error: `Numbers must be ${MAX_ALLOWED_NUMBER} or lower.`,
      allowedNumbers,
    };
  }

  if (new Set(parsed).size !== parsed.length) {
    return {
      ok: false,
      error: "Duplicate numbers are not allowed.",
      allowedNumbers,
    };
  }

  if (allowedNumbers.length < MIN_ALLOWED_COUNT) {
    return {
      ok: false,
      error: "Choose at least 2 numbers.",
      allowedNumbers,
    };
  }

  if (allowedNumbers.length > MAX_ALLOWED_COUNT) {
    return {
      ok: false,
      error: `Choose ${MAX_ALLOWED_COUNT} numbers or fewer.`,
      allowedNumbers,
    };
  }

  return {
    ok: true,
    allowedNumbers,
  };
}

/**
 * @param {unknown} min
 * @param {unknown} max
 * @returns {{ ok: true; allowedNumbers: number[]; min: number; max: number } | { ok: false; error: string; allowedNumbers: number[]; min: number | null; max: number | null }}
 */
export function buildAllowedNumbersFromRange(min, max) {
  const parsedMin = parsePositiveInteger(min);
  const parsedMax = parsePositiveInteger(max);

  if (parsedMin == null || parsedMax == null) {
    return {
      ok: false,
      error: "Range values must be positive whole numbers.",
      allowedNumbers: [],
      min: parsedMin,
      max: parsedMax,
    };
  }

  if (parsedMin < MIN_ALLOWED_NUMBER || parsedMax < MIN_ALLOWED_NUMBER) {
    return {
      ok: false,
      error: "Range values must be 1 or higher.",
      allowedNumbers: [],
      min: parsedMin,
      max: parsedMax,
    };
  }

  if (parsedMax > MAX_ALLOWED_NUMBER || parsedMin > MAX_ALLOWED_NUMBER) {
    return {
      ok: false,
      error: `Range values must be ${MAX_ALLOWED_NUMBER} or lower.`,
      allowedNumbers: [],
      min: parsedMin,
      max: parsedMax,
    };
  }

  if (parsedMin > parsedMax) {
    return {
      ok: false,
      error: "Range minimum must be lower than or equal to the maximum.",
      allowedNumbers: [],
      min: parsedMin,
      max: parsedMax,
    };
  }

  const allowedNumbers = Array.from({ length: parsedMax - parsedMin + 1 }, (_entry, index) => parsedMin + index);

  if (allowedNumbers.length < MIN_ALLOWED_COUNT) {
    return {
      ok: false,
      error: "Range must include at least 2 numbers.",
      allowedNumbers,
      min: parsedMin,
      max: parsedMax,
    };
  }

  if (allowedNumbers.length > MAX_ALLOWED_COUNT) {
    return {
      ok: false,
      error: `Range includes ${allowedNumbers.length} numbers. Choose ${MAX_ALLOWED_COUNT} numbers or fewer.`,
      allowedNumbers,
      min: parsedMin,
      max: parsedMax,
    };
  }

  return {
    ok: true,
    allowedNumbers,
    min: parsedMin,
    max: parsedMax,
  };
}

/**
 * @param {unknown} value
 * @returns {"classic" | "range" | "custom" | "preset"}
 */
function normalizeMode(value) {
  return value === "range" || value === "custom" || value === "preset" ? value : "classic";
}

/**
 * @param {unknown} inputSettings
 * @param {unknown} fallbackSettings
 * @returns {{ ok: true; settings: ReturnType<typeof getDefaultNumberSet> } | { ok: false; error: string; settings: ReturnType<typeof getDefaultNumberSet> }}
 */
export function resolveNumberSetSettings(inputSettings = {}, fallbackSettings = {}) {
  const source = inputSettings && typeof inputSettings === "object" ? /** @type {Record<string, any>} */ (inputSettings) : {};
  const fallback =
    fallbackSettings && typeof fallbackSettings === "object"
      ? /** @type {Record<string, any>} */ (fallbackSettings)
      : {};
  const defaultSettings = getDefaultNumberSet();
  const mode = normalizeMode(source.numberSetMode ?? fallback.numberSetMode);

  if (mode === "classic") {
    return {
      ok: true,
      settings: defaultSettings,
    };
  }

  if (mode === "preset") {
    const presetId = String(source.numberSetPreset ?? source.presetId ?? fallback.numberSetPreset ?? "classic");
    const preset = PRESET_BY_ID.get(presetId);

    if (!preset) {
      return {
        ok: false,
        error: "Choose a valid number set preset.",
        settings: defaultSettings,
      };
    }

    return {
      ok: true,
      settings: {
        numberSetMode: "preset",
        numberSetPreset: preset.id,
        numberSetLabel: preset.label,
        allowedNumbers: [...preset.allowedNumbers],
        numberRangeMin: preset.allowedNumbers[0],
        numberRangeMax: preset.allowedNumbers[preset.allowedNumbers.length - 1],
        customNumbersText: formatAllowedNumbers(preset.allowedNumbers),
      },
    };
  }

  if (mode === "range") {
    const fallbackMin = fallback.numberRangeMin ?? fallback.allowedNumbers?.[0] ?? defaultSettings.numberRangeMin;
    const fallbackMax =
      fallback.numberRangeMax ??
      fallback.allowedNumbers?.[fallback.allowedNumbers.length - 1] ??
      defaultSettings.numberRangeMax;
    const range = buildAllowedNumbersFromRange(source.numberRangeMin ?? source.rangeMin ?? fallbackMin, source.numberRangeMax ?? source.rangeMax ?? fallbackMax);

    if (!range.ok) {
      return {
        ok: false,
        error: range.error,
        settings: defaultSettings,
      };
    }

    return {
      ok: true,
      settings: {
        numberSetMode: "range",
        numberSetPreset: "classic",
        numberSetLabel: `Range ${range.min}-${range.max}`,
        allowedNumbers: range.allowedNumbers,
        numberRangeMin: range.min,
        numberRangeMax: range.max,
        customNumbersText: formatAllowedNumbers(range.allowedNumbers),
      },
    };
  }

  const rawCustom =
    source.customNumbersText ??
    source.customNumbers ??
    source.allowedNumbers ??
    fallback.customNumbersText ??
    fallback.allowedNumbers ??
    defaultSettings.allowedNumbers;
  const validated = validateAllowedNumbers(rawCustom);

  if (!validated.ok) {
    return {
      ok: false,
      error: validated.error,
      settings: defaultSettings,
    };
  }

  return {
    ok: true,
    settings: {
      numberSetMode: "custom",
      numberSetPreset: "classic",
      numberSetLabel: `Custom: ${formatAllowedNumbers(validated.allowedNumbers)}`,
      allowedNumbers: validated.allowedNumbers,
      numberRangeMin: validated.allowedNumbers[0],
      numberRangeMax: validated.allowedNumbers[validated.allowedNumbers.length - 1],
      customNumbersText: formatAllowedNumbers(validated.allowedNumbers),
    },
  };
}

/**
 * @param {number} number
 * @param {unknown} allowedNumbers
 * @returns {boolean}
 */
export function isValidPick(number, allowedNumbers) {
  return Number.isInteger(number) && Array.isArray(allowedNumbers) && allowedNumbers.includes(number);
}

/**
 * @param {unknown} allowedNumbers
 * @returns {number[]}
 */
function resolveDisplayNumbers(allowedNumbers) {
  const normalized = normalizeAllowedNumbers(allowedNumbers);
  return normalized.length >= MIN_ALLOWED_COUNT ? normalized : getDefaultNumberSet().allowedNumbers;
}

/**
 * @param {number[]} allowedNumbers
 * @returns {boolean}
 */
function isClassicSet(allowedNumbers) {
  return allowedNumbers.length === CLASSIC_NUMBERS.length && allowedNumbers.every((value, index) => value === CLASSIC_NUMBERS[index]);
}

/**
 * @param {number} battingNumber
 * @param {unknown} allowedNumbers
 * @returns {string}
 */
export function getShotLabel(battingNumber, allowedNumbers) {
  const numbers = resolveDisplayNumbers(allowedNumbers);

  if (isClassicSet(numbers)) {
    const classicLabels = new Map([
      [1, "Quick Single"],
      [2, "Smart Double"],
      [3, "Gap Run"],
      [4, "Boundary"],
      [5, "Risky Loft"],
      [6, "Huge Six"],
    ]);
    return classicLabels.get(battingNumber) ?? "Attacking Shot";
  }

  const index = numbers.indexOf(battingNumber);
  if (index === -1) {
    return "Attacking Shot";
  }

  if (index === numbers.length - 1) {
    return "Mega Hit";
  }

  const position = numbers.length === 1 ? 1 : index / (numbers.length - 1);

  if (position <= 0.05) {
    return "Controlled Shot";
  }

  if (position < 0.38) {
    return "Smart Run";
  }

  if (position < 0.75) {
    return "Attacking Shot";
  }

  return "Power Hit";
}

/**
 * @param {{ battingNumber: number; bowlingNumber: number; runs: number; isWicket: boolean; allowedNumbers: unknown }} options
 * @returns {{ shotLabel: string; resultLabel: string; resultTone: "wicket" | "mega" | "boundary" | "power" | "run" | "dot"; commentary: string }}
 */
export function getBallPresentation({ battingNumber, bowlingNumber, runs, isWicket, allowedNumbers }) {
  const numbers = resolveDisplayNumbers(allowedNumbers);
  const shotLabel = getShotLabel(battingNumber, numbers);

  if (isWicket) {
    return {
      shotLabel: "Wicket",
      resultLabel: "Wicket! Perfect match.",
      resultTone: "wicket",
      commentary: `Batter chose ${battingNumber}, bowler chose ${bowlingNumber} - Wicket! Perfect match.`,
    };
  }

  const highestNumber = numbers[numbers.length - 1];
  const classicSet = isClassicSet(numbers);
  const resultTone =
    !classicSet && battingNumber === highestNumber
      ? "mega"
      : shotLabel === "Boundary" || shotLabel === "Huge Six"
        ? "boundary"
        : shotLabel === "Power Hit"
          ? "power"
          : runs === 0
            ? "dot"
            : "run";

  return {
    shotLabel,
    resultLabel: `${shotLabel}! +${runs}`,
    resultTone,
    commentary: `Batter chose ${battingNumber}, bowler chose ${bowlingNumber} - ${shotLabel}! +${runs}`,
  };
}
