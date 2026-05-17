// @ts-check

import { App } from "./app/app.js";
import { wireRouter } from "./app/router.js";
import { screenRegistry } from "./app/screenRegistry.js";
import { createInitialState } from "./state/initialState.js";
import { reducer } from "./state/actions.js";
import { createStore } from "./state/store.js";
import { MatchService } from "./services/matchService.js";
import { MockSocket } from "./services/mockSocket.js";
import { RoomService } from "./services/roomService.js";
import { SignalSystem } from "./services/signalSystem.js";

const root = document.querySelector("#app");

if (!(root instanceof HTMLElement)) {
  throw new Error("App root not found.");
}

const store = createStore(createInitialState(), reducer);
const socket = new MockSocket();
const roomService = new RoomService({ store, socket });
const matchService = new MatchService({ store, socket });
const signalSystem = new SignalSystem({ store, socket });

const app = new App({
  root,
  store,
  roomService,
  matchService,
  signalSystem,
  socket,
});

wireRouter(store, screenRegistry);
app.mount();
