import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { io } from "socket.io-client";

const port = Number(process.env.PHASE5_SMOKE_PORT || 3195);
const baseUrl = `http://localhost:${port}`;

const server = spawn(process.execPath, ["server/index.js"], {
  cwd: process.cwd(),
  stdio: ["ignore", "pipe", "pipe"],
  env: {
    ...process.env,
    PORT: String(port),
    PUBLIC_STILL_SEARCHING_MS: "120",
    PUBLIC_BOT_FILL_SOON_MS: "220",
    PUBLIC_BOT_FILL_MS: "360",
    PUBLIC_QUEUE_TICK_MS: "40",
    PUBLIC_START_DELAY_MS: "80",
    INTRO_LOCK_MS: "80",
    DISCONNECT_GRACE_MS: "260",
    CLEANUP_INTERVAL_MS: "500"
  }
});

let serverOutput = "";
server.stdout.on("data", (chunk) => {
  serverOutput += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  serverOutput += chunk.toString();
});

const sockets = new Set();

try {
  await waitForHealth();
  await testRealPlayerBeatsBotFillRace();
  await testBotFillAndLeaveClosesRoom();
  await testReconnectAfterBotReplacement();
  console.log("Phase 5 smoke checks passed.");
} catch (error) {
  console.error(error?.stack || error);
  if (serverOutput) console.error(serverOutput);
  process.exitCode = 1;
} finally {
  sockets.forEach((socket) => socket.close());
  server.kill();
}

async function waitForHealth() {
  for (let i = 0; i < 50; i += 1) {
    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) return;
    } catch {}
    await delay(80);
  }
  throw new Error("Server health check did not become ready.");
}

async function testRealPlayerBeatsBotFillRace() {
  const a = connectClient();
  const b = connectClient();
  await Promise.all([waitFor(a, "connect"), waitFor(b, "connect")]);

  const matchA = waitFor(a, "matchFound");
  const matchB = waitFor(b, "matchFound");
  a.emit("joinPublicQueue", { name: "Race A", preferredPlayerCount: 2, preferredModeId: "classic", allowBotFill: true });
  await delay(330);
  b.emit("joinPublicQueue", { name: "Race B", preferredPlayerCount: 2, preferredModeId: "classic", allowBotFill: true });
  const [foundA, foundB] = await Promise.all([matchA, matchB]);
  assert(foundA.roomCode === foundB.roomCode, "race players should land in the same room");
  assert(foundA.botFilled === false && foundB.botFilled === false, "second real player should prevent bot fill");
  const startedAfterCancel = waitFor(a, "matchStarted");
  a.emit("cancelPublicQueue", {});
  const start = await startedAfterCancel;
  assert(start.roomCode === foundA.roomCode, "cancel after matchFound should not leave matched room");
  a.emit("leaveRoom", {});
  b.emit("leaveRoom", {});
  await delay(80);
  a.close();
  b.close();
}

async function testBotFillAndLeaveClosesRoom() {
  const solo = connectClient();
  await waitFor(solo, "connect");
  const found = waitFor(solo, "matchFound");
  const started = waitFor(solo, "matchStarted");
  solo.emit("joinPublicQueue", { name: "Solo", preferredPlayerCount: 2, preferredModeId: "classic", allowBotFill: true });
  const match = await found;
  assert(match.botFilled === true, "solo queue should bot-fill after wait");
  const start = await started;
  const botCount = start.snapshot.players.filter((player) => player.type === "bot").length;
  assert(botCount === 1, "bot-filled 2-player match should include one bot");
  const closed = waitFor(solo, "roomClosed");
  solo.emit("leaveRoom", {});
  await closed;
  solo.close();
}

async function testReconnectAfterBotReplacement() {
  const a = connectClient();
  const b = connectClient();
  await Promise.all([waitFor(a, "connect"), waitFor(b, "connect")]);

  const aJoined = waitFor(a, "roomJoined");
  const bJoined = waitFor(b, "roomJoined");
  a.emit("joinPublicQueue", { name: "Stay", preferredPlayerCount: 2, preferredModeId: "classic", allowBotFill: false });
  b.emit("joinPublicQueue", { name: "Drop", preferredPlayerCount: 2, preferredModeId: "classic", allowBotFill: false });
  const [, dropSession] = await Promise.all([aJoined, bJoined]);
  const replaced = waitFor(a, "playerReplacedByBot");
  b.disconnect();
  await replaced;

  const reconnect = connectClient();
  await waitFor(reconnect, "connect");
  const error = waitFor(reconnect, "errorMessage");
  reconnect.emit("reconnectSession", dropSession);
  const payload = await error;
  assert(/replaced by bot/i.test(payload.message), "late reconnect should be told the seat was replaced");
  a.emit("leaveRoom", {});
  reconnect.close();
  a.close();
}

function connectClient() {
  const socket = io(baseUrl, {
    transports: ["websocket"],
    forceNew: true,
    reconnection: false
  });
  sockets.add(socket);
  socket.on("disconnect", () => sockets.delete(socket));
  return socket;
}

function waitFor(socket, eventName, timeoutMs = 3_500) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.off(eventName, onEvent);
      reject(new Error(`Timed out waiting for ${eventName}`));
    }, timeoutMs);
    const onEvent = (payload) => {
      clearTimeout(timer);
      socket.off(eventName, onEvent);
      resolve(payload);
    };
    socket.on(eventName, onEvent);
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
