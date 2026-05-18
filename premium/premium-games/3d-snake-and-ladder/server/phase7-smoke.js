import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { io } from "socket.io-client";

const port = Number(process.env.PHASE7_SMOKE_PORT || 3197);
const baseUrl = `http://localhost:${port}`;

const server = spawn(process.execPath, ["server/index.js"], {
  cwd: process.cwd(),
  stdio: ["ignore", "pipe", "pipe"],
  env: {
    ...process.env,
    PORT: String(port),
    LOG_LEVEL: "error",
    PUBLIC_STILL_SEARCHING_MS: "80",
    PUBLIC_BOT_FILL_SOON_MS: "120",
    PUBLIC_BOT_FILL_MS: "180",
    PUBLIC_QUEUE_TICK_MS: "35",
    PUBLIC_START_DELAY_MS: "70",
    INTRO_LOCK_MS: "70",
    DISCONNECT_GRACE_MS: "180",
    CLEANUP_INTERVAL_MS: "70",
    ROOM_IDLE_MS: "700",
    FINISHED_ROOM_TTL_MS: "420"
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
  await testStatusEndpoint();
  await testMalformedAndEmptyNameRejections();
  await testDuplicateQueueDoesNotGrowQueue();
  await testBotFilledRoomClosesWhenRealPlayerLeaves();
  await testLateReconnectAfterBotReplacementIsRejected();
  console.log("Phase 7 launch-hardening smoke checks passed.");
} catch (error) {
  console.error(error?.stack || error);
  if (serverOutput) console.error(serverOutput);
  process.exitCode = 1;
} finally {
  sockets.forEach((socket) => socket.close());
  server.kill();
}

async function waitForHealth() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) return;
    } catch {}
    await delay(70);
  }
  throw new Error("Server health check did not become ready.");
}

async function testStatusEndpoint() {
  const status = await getJson("/status");
  assert(status.ok === true && status.online === true, "status endpoint should report online");
  assert(Number.isInteger(status.activeRooms), "status endpoint should expose safe room count");
  assert(Number.isInteger(status.queueCount), "status endpoint should expose safe queue count");
}

async function testMalformedAndEmptyNameRejections() {
  const socket = connectClient();
  await waitFor(socket, "connect");

  const malformed = waitFor(socket, "errorMessage");
  socket.emit("createRoom", "bad payload");
  assert(/invalid request payload/i.test((await malformed).message), "malformed payload should be rejected nicely");

  const emptyName = waitFor(socket, "errorMessage");
  socket.emit("createRoom", { name: "   ", playerCount: 2, modeId: "classic" });
  assert(/name required/i.test((await emptyName).message), "empty online names should be rejected");

  const health = await getJson("/health");
  assert(health.ok === true, "server should remain healthy after bad payloads");
  socket.close();
}

async function testDuplicateQueueDoesNotGrowQueue() {
  const socket = connectClient();
  await waitFor(socket, "connect");
  socket.emit("joinPublicQueue", { name: "Queue One", preferredPlayerCount: 4, preferredModeId: "classic", allowBotFill: false });
  await waitFor(socket, "queueState");
  socket.emit("joinPublicQueue", { name: "Queue One", preferredPlayerCount: 4, preferredModeId: "classic", allowBotFill: false });
  await waitFor(socket, "queueState");
  const status = await getJson("/status");
  assert(status.queueCount === 1, "duplicate queue from one socket should not create a second entry");
  socket.emit("cancelPublicQueue", {});
  socket.close();
  await waitForStatus((value) => value.queueCount === 0, "queue should clear after cancel");
}

async function testBotFilledRoomClosesWhenRealPlayerLeaves() {
  const socket = connectClient();
  await waitFor(socket, "connect");
  socket.emit("joinPublicQueue", { name: "Solo Launch", preferredPlayerCount: 2, preferredModeId: "classic", allowBotFill: true });
  await waitFor(socket, "matchFound", 4_000);
  await waitFor(socket, "matchStarted", 4_000);
  const closed = waitFor(socket, "roomClosed", 3_000);
  socket.emit("leaveRoom", {});
  await closed;
  socket.close();
  await waitForStatus((value) => value.activeRooms === 0, "bot-filled public room should close when all real players leave");
}

async function testLateReconnectAfterBotReplacementIsRejected() {
  const first = connectClient();
  const second = connectClient();
  await Promise.all([waitFor(first, "connect"), waitFor(second, "connect")]);

  const firstFound = waitFor(first, "matchFound", 4_000);
  const secondFound = waitFor(second, "matchFound", 4_000);
  first.emit("joinPublicQueue", { name: "Refresh One", preferredPlayerCount: 2, preferredModeId: "classic", allowBotFill: false });
  second.emit("joinPublicQueue", { name: "Refresh Two", preferredPlayerCount: 2, preferredModeId: "classic", allowBotFill: false });
  const firstSession = await firstFound;
  await secondFound;
  await Promise.all([waitFor(first, "matchStarted", 4_000), waitFor(second, "matchStarted", 4_000)]);

  const replaced = waitFor(second, "playerReplacedByBot", 4_000);
  first.close();
  await replaced;

  const reconnect = connectClient();
  await waitFor(reconnect, "connect");
  const error = waitFor(reconnect, "errorMessage", 2_000);
  reconnect.emit("reconnectSession", {
    roomCode: firstSession.roomCode,
    playerId: firstSession.playerId,
    sessionToken: firstSession.sessionToken
  });
  assert(/seat was replaced by bot/i.test((await error).message), "late reconnect should not reclaim a bot-replaced seat");

  second.emit("leaveRoom", {});
  second.close();
  reconnect.close();
  await waitForStatus((value) => value.activeRooms === 0, "public room should close after remaining real player leaves");
}

async function waitForStatus(predicate, message) {
  for (let i = 0; i < 40; i += 1) {
    const status = await getJson("/status");
    if (predicate(status)) return status;
    await delay(80);
  }
  throw new Error(message);
}

async function getJson(path) {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  return response.json();
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
