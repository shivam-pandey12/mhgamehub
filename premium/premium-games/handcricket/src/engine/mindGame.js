// @ts-check

import { getDefaultNumberSet } from "./numberSets.js";

/**
 * Mind-game helpers only read revealed ball events and scoreboard context.
 * They must not inspect pending picks or unrevealed lock state.
 */

/**
 * @param {unknown} allowedNumbers
 * @returns {number[]}
 */
function resolveAllowedNumbers(allowedNumbers) {
  const source = Array.isArray(allowedNumbers) && allowedNumbers.length
    ? allowedNumbers
    : getDefaultNumberSet().allowedNumbers;

  return [...new Set(source.filter((value) => Number.isInteger(value)))].sort((left, right) => left - right);
}

/**
 * @param {import("../types/models").BallEvent[] | null | undefined} timeline
 * @returns {import("../types/models").BallEvent[]}
 */
function getRevealedEvents(timeline) {
  return Array.isArray(timeline)
    ? timeline.filter(
        (event) =>
          Number.isInteger(event?.battingNumber) &&
          Number.isInteger(event?.bowlingNumber) &&
          typeof event?.resultType === "string",
      )
    : [];
}

/**
 * @param {import("../types/models").BallEvent[] | null | undefined} timeline
 * @param {"batting" | "bowling"} side
 * @param {number} [limit]
 * @returns {number[]}
 */
export function getRecentPicks(timeline, side, limit = 5) {
  const key = side === "bowling" ? "bowlingNumber" : "battingNumber";
  return getRevealedEvents(timeline)
    .slice(-limit)
    .map((event) => Number(event[key]))
    .filter((value) => Number.isInteger(value));
}

/**
 * @param {number[]} picks
 * @returns {Map<number, number>}
 */
export function getPickFrequency(picks) {
  const frequency = new Map();
  picks.forEach((pick) => {
    frequency.set(pick, (frequency.get(pick) ?? 0) + 1);
  });
  return frequency;
}

/**
 * @param {number[]} picks
 * @returns {{ number: number; count: number } | null}
 */
export function getMostUsedNumber(picks) {
  let strongest = null;

  getPickFrequency(picks).forEach((count, number) => {
    if (!strongest || count > strongest.count || (count === strongest.count && number > strongest.number)) {
      strongest = { number, count };
    }
  });

  return strongest;
}

/**
 * @param {number[]} picks
 * @returns {{ number: number | null; count: number }}
 */
function getTailRepeat(picks) {
  const number = picks[picks.length - 1] ?? null;
  if (number == null) {
    return { number: null, count: 0 };
  }

  let count = 0;
  for (let index = picks.length - 1; index >= 0; index -= 1) {
    if (picks[index] !== number) {
      break;
    }
    count += 1;
  }

  return { number, count };
}

/**
 * @param {number} number
 * @param {unknown} allowedNumbers
 * @returns {"low" | "mid" | "high" | "highest"}
 */
export function getNumberTier(number, allowedNumbers) {
  const numbers = resolveAllowedNumbers(allowedNumbers);
  const index = numbers.indexOf(number);

  if (index < 0) {
    return "mid";
  }

  if (index === numbers.length - 1) {
    return "highest";
  }

  const position = numbers.length === 1 ? 1 : index / (numbers.length - 1);

  if (position <= 0.28) {
    return "low";
  }

  if (position >= 0.7) {
    return "high";
  }

  return "mid";
}

/**
 * @param {number} number
 * @param {unknown} allowedNumbers
 * @returns {boolean}
 */
export function isHighValuePick(number, allowedNumbers) {
  const tier = getNumberTier(number, allowedNumbers);
  return tier === "high" || tier === "highest";
}

/**
 * @param {number} number
 * @param {unknown} allowedNumbers
 * @returns {boolean}
 */
function isLowValuePick(number, allowedNumbers) {
  return getNumberTier(number, allowedNumbers) === "low";
}

/**
 * @param {import("../types/models").BallEvent[] | null | undefined} timeline
 * @param {unknown} allowedNumbers
 */
export function getRecentPickMemory(timeline, allowedNumbers) {
  const events = getRevealedEvents(timeline);
  const recentEvents = events.slice(-5);
  const batterPicks = getRecentPicks(events, "batting", 5);
  const bowlerPicks = getRecentPicks(events, "bowling", 5);
  const allBatterPicks = events.map((event) => event.battingNumber);
  const allBowlerPicks = events.map((event) => event.bowlingNumber);
  const recentWickets = recentEvents.filter((event) => event.resultType === "wicket");
  const recentBigHits = recentEvents.filter(
    (event) => event.resultType !== "wicket" && isHighValuePick(event.battingNumber, allowedNumbers),
  );

  return {
    batterPicks,
    bowlerPicks,
    mostUsedBatter: getMostUsedNumber(allBatterPicks),
    mostUsedBowler: getMostUsedNumber(allBowlerPicks),
    batterRepeat: getTailRepeat(batterPicks),
    bowlerRepeat: getTailRepeat(bowlerPicks),
    recentWicketNumbers: recentWickets.map((event) => event.battingNumber),
    recentBigHits,
    recentWickets,
  };
}

/**
 * @param {import("../types/models").Match | null | undefined} match
 * @returns {import("../types/models").Innings | null}
 */
function getCurrentInnings(match) {
  return match?.innings?.[match.currentInningsIndex] ?? null;
}

/**
 * @param {import("../types/models").Match | null | undefined} match
 * @param {import("../types/models").BallEvent[] | null | undefined} timeline
 * @param {unknown} allowedNumbers
 * @returns {{ label: string; tone: "calm" | "live" | "warning" | "danger"; detail: string }}
 */
export function getPressureLabel(match, timeline, allowedNumbers) {
  const innings = getCurrentInnings(match);
  const numbers = resolveAllowedNumbers(allowedNumbers);
  const maxNumber = numbers[numbers.length - 1] ?? 6;
  const events = getRevealedEvents(timeline);
  const recent = events.slice(-4);
  const recentWickets = recent.filter((event) => event.resultType === "wicket").length;
  const recentHighHits = recent.filter(
    (event) => event.resultType !== "wicket" && isHighValuePick(event.battingNumber, numbers),
  ).length;

  if (!innings) {
    return { label: "Calm Start", tone: "calm", detail: "No pressure pattern yet." };
  }

  const battingTeam = match?.teams?.[innings.battingTeamId] ?? null;
  const wicketsLeft = Math.max((battingTeam?.playerIds.length ?? 1) - innings.scoreboard.wickets, 0);
  const requiredRuns = innings.scoreboard.requiredRuns ?? null;
  const ballsLeft = innings.scoreboard.ballsLeft ?? 0;
  const hasTarget = innings.scoreboard.target != null;
  const requiredPerBall = hasTarget && ballsLeft > 0 && requiredRuns != null ? requiredRuns / ballsLeft : 0;

  if (recentWickets >= 2) {
    return { label: "Collapse Warning", tone: "danger", detail: "Wickets are falling quickly." };
  }

  if (wicketsLeft === 1) {
    return { label: "Last Wicket Tension", tone: "danger", detail: "One mistake can end the innings." };
  }

  if (hasTarget && ballsLeft <= 6 && requiredRuns != null && requiredRuns > 0) {
    return requiredPerBall > maxNumber * 0.55
      ? { label: "Must Hit Phase", tone: "danger", detail: "The chase needs big choices now." }
      : { label: "Clutch Chase", tone: "warning", detail: "The target is close enough to feel every ball." };
  }

  if (hasTarget && requiredRuns != null && requiredRuns > 0 && requiredRuns <= maxNumber) {
    return { label: "Target Almost There", tone: "live", detail: "One clean shot can finish it." };
  }

  if (recentHighHits >= 2) {
    return { label: "Batter On Fire", tone: "live", detail: "High-value shots are landing." };
  }

  if (recent[recent.length - 1]?.resultType === "wicket") {
    return { label: "Bowler On Top", tone: "warning", detail: "The last read landed perfectly." };
  }

  if (!hasTarget && innings.scoreboard.legalBalls <= 6) {
    return { label: "Calm Start", tone: "calm", detail: "Patterns are still forming." };
  }

  if (ballsLeft <= 6) {
    return { label: "Final Over Heat", tone: "warning", detail: "Every pick has endgame weight." };
  }

  return { label: "Powerplay Mood", tone: "calm", detail: "Build pressure without showing the hand." };
}

/**
 * @param {import("../types/models").Match | null | undefined} match
 * @param {import("../types/models").BallEvent[] | null | undefined} timeline
 * @param {unknown} allowedNumbers
 * @returns {{ label: string; tone: "neutral" | "batting" | "bowling" | "swing" | "clutch" | "collapse"; detail: string }}
 */
export function getMomentumState(match, timeline, allowedNumbers) {
  const innings = getCurrentInnings(match);
  const events = getRevealedEvents(timeline);
  const recent = events.slice(-5);
  const lastBall = recent[recent.length - 1] ?? null;
  const recentWickets = recent.filter((event) => event.resultType === "wicket").length;
  const recentHighHits = recent.filter(
    (event) => event.resultType !== "wicket" && isHighValuePick(event.battingNumber, allowedNumbers),
  ).length;
  const previousTwo = recent.slice(-3, -1);
  const wicketAfterHeat =
    lastBall?.resultType === "wicket" &&
    previousTwo.length >= 2 &&
    previousTwo.every((event) => event.resultType !== "wicket" && isHighValuePick(event.battingNumber, allowedNumbers));
  const closeChase =
    innings?.scoreboard.target != null &&
    (innings.scoreboard.ballsLeft ?? 0) <= 6 &&
    (innings.scoreboard.requiredRuns ?? 99) > 0;

  if (closeChase) {
    return { label: "Clutch Mode", tone: "clutch", detail: "The chase is inside the final squeeze." };
  }

  if (recentWickets >= 2) {
    return { label: "Collapse Pressure", tone: "collapse", detail: "The bowling side has the story right now." };
  }

  if (wicketAfterHeat) {
    return { label: "Momentum Swing", tone: "swing", detail: "A wicket cut through a scoring burst." };
  }

  if (lastBall?.resultType === "wicket") {
    return { label: "Bowler Momentum", tone: "bowling", detail: "A perfect read just shifted the ball." };
  }

  if (recentHighHits >= 2) {
    return { label: "Batter Momentum", tone: "batting", detail: "Big numbers are driving the innings." };
  }

  return { label: "Neutral", tone: "neutral", detail: "Both sides are still testing patterns." };
}

/**
 * @param {import("../types/models").Match | null | undefined} match
 * @param {import("../types/models").BallEvent[] | null | undefined} timeline
 * @param {unknown} allowedNumbers
 * @param {number} [limit]
 * @returns {string[]}
 */
export function getPatternHints(match, timeline, allowedNumbers, limit = 3) {
  const events = getRevealedEvents(timeline);
  const memory = getRecentPickMemory(events, allowedNumbers);
  const hints = [];
  const lastBall = events[events.length - 1] ?? null;
  const batterHighCount = memory.batterPicks.filter((pick) => isHighValuePick(pick, allowedNumbers)).length;
  const bowlerHighCount = memory.bowlerPicks.filter((pick) => isHighValuePick(pick, allowedNumbers)).length;
  const batterLowCount = memory.batterPicks.filter((pick) => isLowValuePick(pick, allowedNumbers)).length;

  if (memory.batterPicks.length) {
    hints.push(`Last 5 batter picks: ${memory.batterPicks.join(", ")}`);
  }

  if (lastBall?.resultType === "wicket") {
    hints.push("Perfect read last ball");
  }

  if (memory.batterRepeat.number != null && memory.batterRepeat.count >= 2) {
    hints.push(`Batter repeated ${memory.batterRepeat.number} twice`);
  } else if ((memory.mostUsedBatter?.count ?? 0) >= 3) {
    hints.push(`Batter repeats ${memory.mostUsedBatter?.number} often`);
  }

  if (batterHighCount >= 3) {
    hints.push("High numbers are becoming predictable");
  } else if (memory.recentBigHits.length >= 2) {
    hints.push("Batter is attacking");
  }

  if (bowlerHighCount >= 3) {
    hints.push("Bowler is hunting high numbers");
  }

  if (memory.batterPicks.length >= 4 && batterLowCount === 0) {
    hints.push("Low numbers are being ignored");
  }

  const pressure = getPressureLabel(match, events, allowedNumbers);
  if (pressure.tone === "warning" || pressure.tone === "danger") {
    hints.push(pressure.label);
  }

  return [...new Set(hints)].slice(0, limit);
}

/**
 * @param {import("../types/models").BallEvent} event
 * @param {import("../types/models").BallEvent[] | null | undefined} timelineBeforeEvent
 * @param {unknown} allowedNumbers
 * @returns {string}
 */
export function getResultInsight(event, timelineBeforeEvent, allowedNumbers) {
  if (!event) {
    return "";
  }

  if (event.resultType === "wicket") {
    return "Perfect Read";
  }

  if (event.resultTone === "mega" || getNumberTier(event.battingNumber, allowedNumbers) === "highest") {
    return "Mega Hit";
  }

  if (isHighValuePick(event.battingNumber, allowedNumbers)) {
    return "Power Phase";
  }

  const previousBatterPicks = getRecentPicks(timelineBeforeEvent, "batting", 3);
  if (previousBatterPicks.length && previousBatterPicks[previousBatterPicks.length - 1] === event.battingNumber) {
    return "Pattern Repeat";
  }

  return "";
}

/**
 * @param {import("../types/models").Match | null | undefined} match
 * @param {import("../types/models").BallEvent[] | null | undefined} timeline
 * @param {unknown} allowedNumbers
 * @returns {{ label: string; value: string; detail: string }[]}
 */
export function getFinalMatchInsights(match, timeline, allowedNumbers) {
  const events = getRevealedEvents(timeline);
  if (!events.length) {
    return [];
  }

  const allPicks = events.flatMap((event) => [event.battingNumber, event.bowlingNumber]);
  const mostPicked = getMostUsedNumber(allPicks);
  const scoreByNumber = new Map();
  const wicketsByNumber = new Map();
  let biggestHit = events[0];

  events.forEach((event) => {
    if (event.resultType !== "wicket") {
      scoreByNumber.set(event.battingNumber, (scoreByNumber.get(event.battingNumber) ?? 0) + event.runs);
      if (event.runs > biggestHit.runs) {
        biggestHit = event;
      }
    } else {
      wicketsByNumber.set(event.battingNumber, (wicketsByNumber.get(event.battingNumber) ?? 0) + 1);
    }
  });

  const bestScoring = [...scoreByNumber.entries()].sort((left, right) => right[1] - left[1])[0] ?? null;
  const dangerous = [...wicketsByNumber.entries()].sort((left, right) => right[1] - left[1])[0] ?? null;
  const perfectReads = events.filter((event) => event.resultType === "wicket").length;
  const momentum = getMomentumState(match, events, allowedNumbers);
  const insights = [];

  if (mostPicked) {
    insights.push({
      label: "Most Picked",
      value: String(mostPicked.number),
      detail: `${mostPicked.count} total uses across bat and bowl.`,
    });
  }

  if (bestScoring) {
    insights.push({
      label: "Best Scoring Number",
      value: String(bestScoring[0]),
      detail: `${bestScoring[1]} runs came from this pick.`,
    });
  }

  if (dangerous) {
    insights.push({
      label: "Most Dangerous Number",
      value: String(dangerous[0]),
      detail: `${dangerous[1]} wicket read${dangerous[1] === 1 ? "" : "s"}.`,
    });
  }

  insights.push({
    label: "Biggest Hit",
    value: String(biggestHit.runs),
    detail: `${biggestHit.battingNumber} vs ${biggestHit.bowlingNumber}.`,
  });

  insights.push({
    label: "Perfect Reads",
    value: String(perfectReads),
    detail: perfectReads ? "Matched numbers decided key balls." : "No wicket reads in this finish.",
  });

  insights.push({
    label: "Story Finish",
    value: momentum.label,
    detail: momentum.detail,
  });

  return insights.slice(0, 6);
}
