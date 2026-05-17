// @ts-check

import { ROUTES } from "../config/constants.js";
import { renderDraftScreen } from "../screens/draftScreen.js";
import { renderHistoryScreen } from "../screens/historyScreen.js";
import { renderHomeScreen } from "../screens/homeScreen.js";
import { renderLineupScreen } from "../screens/lineupScreen.js";
import { renderLobbyScreen } from "../screens/lobbyScreen.js";
import { renderMatchScreen } from "../screens/matchScreen.js";
import { renderResultScreen } from "../screens/resultScreen.js";
import { renderRoomScreen } from "../screens/roomScreen.js";
import { renderRulesScreen } from "../screens/rulesScreen.js";
import { renderTossScreen } from "../screens/tossScreen.js";

export const screenRegistry = {
  [ROUTES.HOME]: renderHomeScreen,
  [ROUTES.ROOM]: renderRoomScreen,
  [ROUTES.LOBBY]: renderLobbyScreen,
  [ROUTES.DRAFT]: renderDraftScreen,
  [ROUTES.TOSS]: renderTossScreen,
  [ROUTES.LINEUP]: renderLineupScreen,
  [ROUTES.MATCH]: renderMatchScreen,
  [ROUTES.RESULT]: renderResultScreen,
  [ROUTES.HISTORY]: renderHistoryScreen,
  [ROUTES.RULES]: renderRulesScreen,
};
