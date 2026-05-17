import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { Server } from "socket.io";
import { GameStore } from "./models/gameStore.js";
import { RoomStore } from "./models/roomStore.js";
import { registerGameHandler } from "./sockets/gameHandler.js";
import { registerRoomHandler } from "./sockets/roomHandler.js";
import { HANDREX_RUNTIME_LIMITS, attachSocketProtections, debugLog } from "./utils/runtimeGuards.js";

const PORT = Number(process.env.PORT) || 4000;
const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function registerPremiumHandcricketRuntime(options = {}) {
  const app = options.app || express();
  const server = options.httpServer || http.createServer(app);
  const io = options.io || new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    maxHttpBufferSize: HANDREX_RUNTIME_LIMITS.maxSocketPayloadBytes,
    pingInterval: 25000,
    pingTimeout: 20000,
  });
  const healthPath = options.healthPath || "/health";
  const infoPath = options.infoPath || "/api/runtime";
  const roomStore = new RoomStore();
  const gameStore = new GameStore();

  app.use(express.json({ limit: "16kb" }));

  app.use("/src", express.static(path.join(PROJECT_ROOT, "src")));
  app.use("/assets", express.static(path.join(PROJECT_ROOT, "dist", "assets")));
  app.get("/favicon.png", (_request, response) => {
    response.sendFile(path.join(PROJECT_ROOT, "favicon.png"));
  });

  app.get(infoPath, (_request, response) => {
    response.json({
      name: "MH Handrex realtime backend",
      status: "ok",
      transport: "socket.io",
      realtimeLimits: {
        maxRooms: HANDREX_RUNTIME_LIMITS.maxRooms,
        maxGames: HANDREX_RUNTIME_LIMITS.maxGames,
        maxOvers: HANDREX_RUNTIME_LIMITS.maxOvers,
      },
    });
  });

  app.get(healthPath, (_request, response) => {
    response.json({
      status: "ok",
      runtime: "handrex-standalone",
      rooms: roomStore.countRooms(),
      games: gameStore.countGames(),
      roomStats: roomStore.getStats(),
      gameStats: gameStore.getStats(),
      timestamp: Date.now(),
    });
  });

  if (infoPath !== "/") {
    app.get("/", (_request, response) => {
      response.sendFile(path.join(PROJECT_ROOT, "index.html"));
    });
  }

  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    const removedRooms = roomStore.cleanupExpiredRooms({ now });
    const removedGames = gameStore.cleanupExpiredGames({
      now,
      hasRoom: (roomId) => Boolean(roomStore.getRoom(roomId)),
      hasConnectedPlayers: (roomId) => {
        const room = roomStore.getRoom(roomId);
        return Boolean(room?.players.some((player) => player.connected !== false));
      },
    });

    removedRooms.forEach((entry) => {
      gameStore.removeGame(entry.roomId);
    });

    if (removedRooms.length || removedGames.length) {
      debugLog("runtime", "cleanup", {
        removedRooms,
        removedGames,
      });
    }
  }, HANDREX_RUNTIME_LIMITS.cleanupIntervalMs);
  cleanupInterval.unref?.();

  io.on("connection", (socket) => {
    debugLog("socket", "connected", {
      socketId: socket.id,
    });
    attachSocketProtections(socket);

    socket.emit("connected", {
      socketId: socket.id,
    });

    registerRoomHandler(io, socket, {
      roomStore,
      gameStore,
    });

    registerGameHandler(io, socket, {
      roomStore,
      gameStore,
    });
  });

  return {
    app,
    httpServer: server,
    io,
    closeRuntime: () => {
      clearInterval(cleanupInterval);
      roomStore.cleanupExpiredRooms({ now: Number.MAX_SAFE_INTEGER, idleRoomTtlMs: 0, completedRoomTtlMs: 0 });
      gameStore.cleanupExpiredGames({
        now: Number.MAX_SAFE_INTEGER,
        idleGameTtlMs: 0,
        completedRoomTtlMs: 0,
        hasRoom: () => false,
      });
    },
  };
}

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
  const { httpServer } = registerPremiumHandcricketRuntime();
  httpServer.listen(PORT, () => {
    console.log(`MH Handrex backend listening on http://localhost:${PORT}`);
  });
}

export { registerPremiumHandcricketRuntime };
