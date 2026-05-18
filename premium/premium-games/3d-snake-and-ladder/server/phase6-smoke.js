import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { io } from "socket.io-client";

const port = Number(process.env.PHASE6_SMOKE_PORT || 3196);
const baseUrl = `http://localhost:${port}`;

const server = spawn(process.execPath, ["server/index.js"], {
  cwd: process.cwd(),
  stdio: ["ignore", "pipe", "pipe"],
  env: {
    ...process.env,
    PORT: String(port),
    LOG_LEVEL: "error",
    PUBLIC_STILL_SEARCHING_MS: "120",
    PUBLIC_BOT_FILL_SOON_MS: "220",
    PUBLIC_BOT_FILL_MS: "360",
    PUBLIC_QUEUE_TICK_MS: "40",
    PUBLIC_START_DELAY_MS: "80",
    INTRO_LOCK_MS: "80",
    DISCONNECT_GRACE_MS: "260",
    CLEANUP_INTERVAL_MS: "120",
    ROOM_IDLE_MS: "900",
    FINISHED_ROOM_TTL_MS: "500"
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
  await testMalformedPayloadDoesNotCrash();
  await testDuplicateQueueDoesNotGrowQueue();
  await testRoomClosesCleanly();
  console.log("Phase 6 smoke checks passed.");
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

async function testStatusEndpoint() {
  const status = await getJson("/status");
  assert(status.ok === true && status.online === true, "status endpoint should report online");
  assert(Number.isInteger(status.activeRooms), "status endpoint should expose safe room count");
  assert(Number.isInteger(status.queueCount), "status endpoint should expose safe queue count");
}

async function testMalformedPayloadDoesNotCrash() {
  const socket = connectClient();
  await waitFor(socket, "connect");
  const error = waitFor(socket, "errorMessage");
  socket.emit("createRoom", "bad payload");
  const payload = await error;
  assert(/invalid request payload/i.test(payload.message), "malformed payload should be rejected nicely");
  const health = await getJson("/health");
  assert(health.ok === true, "server should remain healthy after malformed payload");
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
}

async function testRoomClosesCleanly() {
  const socket = connectClient();
  await waitFor(socket, "connect");
  const created = waitFor(socket, "roomCreated");
  socket.emit("createRoom", { name: "Closer", playerCount: 2, modeId: "classic" });
  await created;
  const closed = waitFor(socket, "roomClosed");
  socket.emit("leaveRoom", {});
  await closed;
  for (let i = 0; i < 12; i += 1) {
    const status = await getJson("/status");
    if (status.activeRooms === 0) {
      socket.close();
      return;
    }
    await delay(80);
  }
  throw new Error("room should be removed after last player leaves");
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
