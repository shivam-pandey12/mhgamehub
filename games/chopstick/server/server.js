import fs from "node:fs";
import path from "node:path";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import express from "express";
import { Server } from "socket.io";
import {
  applyMove,
  applyReaction,
  createInitialMatchState
} from "../src/shared/rules.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
  }
});

const rooms = new Map();

function sanitizeProfile(profile = {}) {
  const name =
    typeof profile.name === "string" && profile.name.trim()
      ? profile.name.trim().slice(0, 20)
      : "Arena Pilot";
  const skinId =
    typeof profile.skinId === "string" && profile.skinId.trim()
      ? profile.skinId.trim().slice(0, 32)
      : "ember";

  return { name, skinId };
}

function generateRoomCode() {
  let code = "";
  do {
    code = String(Math.floor(100000 + Math.random() * 900000));
  } while (rooms.has(code));

  return code;
}

function createRoomSnapshot(room) {
  const players = Object.fromEntries(
    Object.entries(room.players).map(([seat, player]) => [
      seat,
      player
        ? {
            seat: player.seat,
            name: player.name,
            skinId: player.skinId,
            connected: player.connected
          }
        : null
    ])
  );

  return {
    code: room.code,
    createdAt: room.createdAt,
    players,
    rematchVotes: [...room.rematchVotes],
    match: room.match
  };
}

function broadcastRoom(room) {
  io.to(room.code).emit("room:update", createRoomSnapshot(room));
}

function resetMatch(room) {
  const bothConnected =
    room.players.A?.connected && room.players.B?.connected;
  room.match = createInitialMatchState({
    status: bothConnected ? "playing" : "waiting"
  });
  room.rematchVotes.clear();
}

function removeRoomIfEmpty(room) {
  const hasConnectedPlayer =
    room.players.A?.connected || room.players.B?.connected;

  if (!hasConnectedPlayer) {
    rooms.delete(room.code);
  }
}

function detachSocketFromRoom(socket, { disconnecting = false } = {}) {
  const roomCode = socket.data.roomCode;
  const seat = socket.data.seat;

  if (!roomCode || !seat) {
    return;
  }

  const room = rooms.get(roomCode);
  if (!room) {
    socket.data.roomCode = null;
    socket.data.seat = null;
    return;
  }

  const player = room.players[seat];
  if (player && player.socketId === socket.id) {
    player.connected = false;
    player.socketId = null;
  }

  room.rematchVotes.clear();
  room.match.status = room.match.winner ? "finished" : "waiting";

  if (!disconnecting) {
    socket.leave(roomCode);
  }

  socket.data.roomCode = null;
  socket.data.seat = null;

  removeRoomIfEmpty(room);
  if (rooms.has(roomCode)) {
    broadcastRoom(room);
  }
}

function assignSeat(room) {
  if (!room.players.A || !room.players.A.connected) {
    return "A";
  }

  if (!room.players.B || !room.players.B.connected) {
    return "B";
  }

  return null;
}

io.on("connection", (socket) => {
  socket.data.roomCode = null;
  socket.data.seat = null;

  socket.on("room:create", ({ profile }, callback) => {
    detachSocketFromRoom(socket);

    const code = generateRoomCode();
    const host = sanitizeProfile(profile);
    const room = {
      code,
      createdAt: Date.now(),
      players: {
        A: {
          seat: "A",
          name: host.name,
          skinId: host.skinId,
          connected: true,
          socketId: socket.id
        },
        B: null
      },
      rematchVotes: new Set(),
      match: createInitialMatchState({
        status: "waiting"
      })
    };

    rooms.set(code, room);
    socket.join(code);
    socket.data.roomCode = code;
    socket.data.seat = "A";

    callback({
      ok: true,
      seat: "A",
      room: createRoomSnapshot(room)
    });
  });

  socket.on("room:join", ({ roomCode, profile }, callback) => {
    detachSocketFromRoom(socket);

    const code = String(roomCode ?? "").trim();
    const room = rooms.get(code);

    if (!room) {
      callback({
        ok: false,
        error: "Room code not found."
      });
      return;
    }

    const seat = assignSeat(room);
    if (!seat) {
      callback({
        ok: false,
        error: "That room is already full."
      });
      return;
    }

    const player = sanitizeProfile(profile);
    room.players[seat] = {
      seat,
      name: player.name,
      skinId: player.skinId,
      connected: true,
      socketId: socket.id
    };

    socket.join(code);
    socket.data.roomCode = code;
    socket.data.seat = seat;

    resetMatch(room);
    broadcastRoom(room);

    callback({
      ok: true,
      seat,
      room: createRoomSnapshot(room)
    });
  });

  socket.on("match:move", ({ move }, callback) => {
    const room = rooms.get(socket.data.roomCode);
    const seat = socket.data.seat;

    if (!room || !seat) {
      callback({
        ok: false,
        error: "Join a room before sending moves."
      });
      return;
    }

    const result = applyMove(room.match, seat, move);
    if (!result.ok) {
      callback(result);
      return;
    }

    room.match = result.match;
    room.rematchVotes.clear();
    broadcastRoom(room);

    callback({
      ok: true
    });
  });

  socket.on("match:reaction", ({ emoji }, callback) => {
    const room = rooms.get(socket.data.roomCode);
    const seat = socket.data.seat;

    if (!room || !seat) {
      callback({
        ok: false,
        error: "Join a room before sending reactions."
      });
      return;
    }

    room.match = applyReaction(room.match, seat, String(emoji ?? "").slice(0, 4));
    broadcastRoom(room);

    callback({
      ok: true
    });
  });

  socket.on("match:rematch", (_, callback) => {
    const room = rooms.get(socket.data.roomCode);
    const seat = socket.data.seat;

    if (!room || !seat) {
      callback({
        ok: false,
        error: "Join a room before requesting a rematch."
      });
      return;
    }

    room.rematchVotes.add(seat);
    const bothConnected =
      room.players.A?.connected && room.players.B?.connected;

    if (bothConnected && room.rematchVotes.size === 2) {
      resetMatch(room);
    }

    broadcastRoom(room);

    callback({
      ok: true
    });
  });

  socket.on("disconnect", () => {
    detachSocketFromRoom(socket, { disconnecting: true });
  });
});

const distPath = path.resolve(__dirname, "../dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("/{*path}", (request, response) => {
    response.sendFile(path.join(distPath, "index.html"));
  });
} else {
  app.get("/", (request, response) => {
    response.send("Chopsticks 3D Arena server is running.");
  });
}

const port = Number(process.env.PORT || 3001);
httpServer.listen(port, () => {
  console.log(`Chopsticks 3D Arena room server listening on ${port}`);
});
