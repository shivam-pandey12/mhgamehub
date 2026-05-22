import { getSmartHint } from "./hintEngine.js";

export { getSmartHint };

export function getHint(state, level = "soft", activeStageIndex = 0) {
  return getSmartHint(state, level, activeStageIndex);
}
