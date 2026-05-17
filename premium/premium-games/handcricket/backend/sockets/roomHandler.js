import { debugLog, normalizePlayerKey, normalizeRoomCode, onSafe, safeAck } from "../utils/runtimeGuards.js";

/**
 * Register room-level socket events.
 *
 * @param {import("socket.io").Server} io
 * @param {import("socket.io").Socket} socket
 * @param {{ roomStore: any; gameStore: any }} stores
 */
export function registerRoomHandler(io, socket, { roomStore, gameStore }) {
  /**
   * @param {string} event
   * @param {any} payload
   */
  function logEvent(event, payload) {
    debugLog("room", event, payload);
  }

  /**
   * @param {string} roomId
   * @param {string} playerKey
   */
  function expireDisconnectedPlayer(roomId, playerKey) {
    const activeGame = gameStore.getGame(roomId);
    const leaveResult = roomStore.removePlayerFromRoomByKey(roomId, playerKey);

    if (!leaveResult) {
      return;
    }

    logEvent("expire_player", {
      roomId,
      playerKey,
    });

    if (activeGame) {
      gameStore.removeGame(roomId);
      io.to(roomId).emit("player_left", {
        roomId,
        playerId: leaveResult.player?.id ?? null,
        reason: "disconnect_timeout",
      });
      io.to(roomId).emit("match_end", {
        roomId,
        aborted: true,
        reason: "A disconnected player did not return before the reconnect timer expired.",
      });
    }

    if (!leaveResult.deleted && leaveResult.room) {
      io.to(roomId).emit("room_update", roomStore.serializeRoom(leaveResult.room));
    }
  }

  /**
   * @param {string} targetSocketId
   * @param {{ disconnected?: boolean; reason?: string; kicked?: boolean }} [options]
   */
  function removeSocketFromRoom(targetSocketId, options = {}) {
    const { disconnected = false, reason = "player_left", kicked = false } = options;
    const roomId = roomStore.getRoomIdBySocketId(targetSocketId);

    if (!roomId) {
      return null;
    }

    const activeGame = gameStore.getGame(roomId);
    const leaveResult = roomStore.removePlayerFromRoom(roomId, targetSocketId);
    const targetSocket = targetSocketId === socket.id ? socket : io.sockets.sockets.get(targetSocketId);
    targetSocket?.leave(roomId);

    if (!leaveResult) {
      return null;
    }

    logEvent("leave_room", {
      roomId,
      socketId: targetSocketId,
      disconnected,
      kicked,
      reason,
    });

    if (activeGame) {
      gameStore.removeGame(roomId);
      io.to(roomId).emit("player_left", {
        roomId,
        playerId: targetSocketId,
        reason,
      });
      io.to(roomId).emit("match_end", {
        roomId,
        aborted: true,
        reason: disconnected
          ? "Player disconnected mid-match."
          : kicked
            ? "A player was removed by the room host mid-match."
            : "Player left the room mid-match.",
      });
    }

    if (kicked) {
      targetSocket?.emit("room_kicked", {
        roomId,
        message: "The room host removed you from the room.",
      });
    }

    if (!leaveResult.deleted && leaveResult.room) {
      io.to(roomId).emit("room_update", roomStore.serializeRoom(leaveResult.room));
    }

    return leaveResult;
  }

  /**
   * @param {{ disconnected?: boolean; reason?: string }} [options]
   */
  function leaveCurrentRoom(options = {}) {
    return removeSocketFromRoom(socket.id, options);
  }

  onSafe(socket, "create_room", (payload = {}, ack) => {
    if (roomStore.getRoomIdBySocketId(socket.id)) {
      leaveCurrentRoom({ reason: "switched_room" });
    }

    const result = roomStore.createRoom({
      socketId: socket.id,
      playerKey: normalizePlayerKey(payload.playerKey, socket.id),
      playerName: payload.playerName ?? "Player 1",
      teamSize: payload.teamSize ?? 1,
      settings: payload.settings ?? {},
    });

    if (result.error || !result.room) {
      safeAck(ack, {
        ok: false,
        error: result.error ?? "Unable to create room.",
      });
      return;
    }

    const { room } = result;

    socket.join(room.roomId);
    const serializedRoom = roomStore.serializeRoom(room);

    logEvent("create_room", {
      roomId: room.roomId,
      hostId: socket.id,
    });

    socket.emit("room_created", serializedRoom);
    io.to(room.roomId).emit("room_update", serializedRoom);
    ack?.({
      ok: true,
      room: serializedRoom,
    });
  });

  onSafe(socket, "join_room", (payload = {}, ack) => {
    const { roomId = "", playerName = "Player 2" } = payload;
    const result = roomStore.joinRoom({
      roomId: normalizeRoomCode(roomId),
      socketId: socket.id,
      playerKey: normalizePlayerKey(payload.playerKey, socket.id),
      playerName,
    });

    if (result.error || !result.room) {
      socket.emit("room_error", {
        roomId,
        message: result.error ?? "Unable to join room.",
      });
      ack?.({
        ok: false,
        error: result.error ?? "Unable to join room.",
      });
      return;
    }

    socket.join(result.room.roomId);
    const serializedRoom = roomStore.serializeRoom(result.room);

    logEvent("join_room", {
      roomId: result.room.roomId,
      playerId: socket.id,
    });

    io.to(result.room.roomId).emit("room_update", serializedRoom);
    ack?.({
      ok: true,
      room: serializedRoom,
    });
  });

  onSafe(socket, "resume_session", (payload = {}, ack) => {
    const roomId = normalizeRoomCode(payload.roomId);
    const playerKey = normalizePlayerKey(payload.playerKey, "");

    if (!roomId || !playerKey) {
      ack?.({
        ok: false,
        error: "Room code and player session key are required to resume.",
      });
      return;
    }

    const resumed = roomStore.resumePlayer({
      roomId,
      socketId: socket.id,
      playerKey,
      playerName: payload.playerName ?? "",
    });

    if (resumed.error || !resumed.room || !resumed.player) {
      ack?.({
        ok: false,
        error: resumed.error ?? "Unable to resume this room session.",
      });
      return;
    }

    socket.join(roomId);

    if (resumed.oldSocketId && resumed.oldSocketId !== socket.id) {
      const previousSocket = io.sockets.sockets.get(resumed.oldSocketId);
      previousSocket?.leave(roomId);
      if (resumed.replacedActiveSocket) {
        previousSocket?.emit("room_kicked", {
          roomId,
          message: "This room session was reopened in another tab or after a reload.",
        });
      }

      const activeGame = gameStore.getGame(roomId);
      if (activeGame) {
        gameStore.rebindPlayer(roomId, resumed.oldSocketId, socket.id);
      }
    }

    const serializedRoom = roomStore.serializeRoom(resumed.room);
    io.to(roomId).emit("room_update", serializedRoom);

    const activeGame = gameStore.getGame(roomId);
    if (activeGame) {
      socket.emit("game_started", gameStore.serializeGame(activeGame));
      socket.emit(
        "next_turn",
        gameStore.createNextTurnPayload(activeGame, {
          message: "Match restored. Rejoin the current ball.",
        }),
      );
    }

    ack?.({
      ok: true,
      room: serializedRoom,
      game: activeGame ? gameStore.serializeGame(activeGame) : null,
      resumed: true,
    });
  });

  onSafe(socket, "leave_room", (_payload = {}, ack) => {
    if (!roomStore.getRoomIdBySocketId(socket.id)) {
      ack?.({
        ok: false,
        error: "Socket is not inside a room.",
      });
      return;
    }

    leaveCurrentRoom({
      reason: "player_left",
    });
    ack?.({
      ok: true,
    });
  });

  onSafe(socket, "discard_room", (_payload = {}, ack) => {
    const room = roomStore.getRoomBySocketId(socket.id);

    if (!room) {
      ack?.({
        ok: false,
        error: "Join a room before discarding it.",
      });
      return;
    }

    if (room.hostId !== socket.id) {
      ack?.({
        ok: false,
        error: "Only the room host can discard the room.",
      });
      return;
    }

    if (room.status === "live") {
      ack?.({
        ok: false,
        error: "A live match cannot be discarded from the room flow.",
      });
      return;
    }

    const discardResult = roomStore.discardRoom(room.roomId);
    if (!discardResult) {
      ack?.({
        ok: false,
        error: "Unable to discard room.",
      });
      return;
    }

    gameStore.removeGame(room.roomId);

    io.to(room.roomId).emit("room_closed", {
      roomId: room.roomId,
      message: "The room host discarded this room.",
    });

    discardResult.players.forEach((player) => {
      const roomSocket = player.id === socket.id ? socket : io.sockets.sockets.get(player.id);
      roomSocket?.leave(room.roomId);
    });

    logEvent("discard_room", {
      roomId: room.roomId,
      hostId: socket.id,
    });

    ack?.({
      ok: true,
      roomId: room.roomId,
    });
  });

  onSafe(socket, "update_room_config", (payload = {}, ack) => {
    const room = roomStore.getRoomBySocketId(socket.id);

    if (!room) {
      ack?.({
        ok: false,
        error: "Join a room before updating room settings.",
      });
      return;
    }

    if (room.hostId !== socket.id) {
      ack?.({
        ok: false,
        error: "Only the room host can update room settings.",
      });
      return;
    }

    const result = roomStore.updateRoomConfig(room.roomId, {
      settings: payload.settings ?? undefined,
      captains: payload.captains ?? undefined,
      teamNames: payload.teamNames ?? undefined,
    });

    if (result.error || !result.room) {
      socket.emit("room_error", {
        roomId: room.roomId,
        message: result.error ?? "Unable to update room settings.",
      });
      ack?.({
        ok: false,
        error: result.error ?? "Unable to update room settings.",
      });
      return;
    }

    const serializedRoom = roomStore.serializeRoom(result.room);
    io.to(result.room.roomId).emit("room_update", serializedRoom);
    ack?.({
      ok: true,
      room: serializedRoom,
    });
  });

  onSafe(socket, "set_player_team", (payload = {}, ack) => {
    const room = roomStore.getRoomBySocketId(socket.id);
    const targetPlayerId = String(payload.playerId ?? socket.id);
    const teamId =
      payload.teamId === "alpha" || payload.teamId === "beta"
        ? payload.teamId
        : null;

    if (!room) {
      ack?.({
        ok: false,
        error: "Join a room before changing team sides.",
      });
      return;
    }

    const result = roomStore.setPlayerTeam({
      roomId: room.roomId,
      actorSocketId: socket.id,
      targetPlayerId,
      teamId,
    });

    if (result.error || !result.room) {
      socket.emit("room_error", {
        roomId: room.roomId,
        message: result.error ?? "Unable to change team side.",
      });
      ack?.({
        ok: false,
        error: result.error ?? "Unable to change team side.",
      });
      return;
    }

    const serializedRoom = roomStore.serializeRoom(result.room);
    io.to(result.room.roomId).emit("room_update", serializedRoom);
    ack?.({
      ok: true,
      room: serializedRoom,
    });
  });

  onSafe(socket, "kick_player", (payload = {}, ack) => {
    const room = roomStore.getRoomBySocketId(socket.id);
    const targetPlayerId = String(payload.playerId ?? "");

    if (!room) {
      ack?.({
        ok: false,
        error: "Join a room before removing a player.",
      });
      return;
    }

    if (room.hostId !== socket.id) {
      ack?.({
        ok: false,
        error: "Only the room host can remove players.",
      });
      return;
    }

    if (!targetPlayerId || targetPlayerId === room.hostId) {
      ack?.({
        ok: false,
        error: "The room host cannot remove themselves.",
      });
      return;
    }

    if (!room.players.some((player) => player.id === targetPlayerId)) {
      ack?.({
        ok: false,
        error: "Player not found in this room.",
      });
      return;
    }

    const result = removeSocketFromRoom(targetPlayerId, {
      kicked: true,
      reason: "removed_by_host",
    });

    if (!result) {
      ack?.({
        ok: false,
        error: "Unable to remove player.",
      });
      return;
    }

    ack?.({
      ok: true,
      room: result.room ? roomStore.serializeRoom(result.room) : null,
    });
  });

  onSafe(socket, "start_toss", (_payload = {}, ack) => {
    const room = roomStore.getRoomBySocketId(socket.id);

    if (!room) {
      ack?.({
        ok: false,
        error: "Join a room before starting the toss.",
      });
      return;
    }

    if (room.hostId !== socket.id) {
      ack?.({
        ok: false,
        error: "Only the room host can start the toss.",
      });
      return;
    }

    if (!roomStore.canStartToss(room)) {
      ack?.({
        ok: false,
        error: "Fill the room, assign both teams, and mark every player ready before the toss starts.",
      });
      return;
    }

    const updatedRoom = roomStore.startToss(room.roomId);
    if (!updatedRoom) {
      ack?.({
        ok: false,
        error: "Unable to start the toss.",
      });
      return;
    }

    const serializedRoom = roomStore.serializeRoom(updatedRoom);
    io.to(room.roomId).emit("room_update", serializedRoom);
    ack?.({
      ok: true,
      room: serializedRoom,
    });
  });

  onSafe(socket, "run_toss", (payload = {}, ack) => {
    const room = roomStore.getRoomBySocketId(socket.id);
    const call = payload.call === "tails" ? "tails" : "heads";

    if (!room) {
      ack?.({
        ok: false,
        error: "Join a room before flipping the toss.",
      });
      return;
    }

    if (room.status !== "toss") {
      ack?.({
        ok: false,
        error: "The toss is not active right now.",
      });
      return;
    }

    if (room.captains.alpha !== socket.id) {
      ack?.({
        ok: false,
        error: "Only the Alpha captain can call heads or tails.",
      });
      return;
    }

    if (room.tossResult) {
      ack?.({
        ok: false,
        error: "The toss has already been completed.",
      });
      return;
    }

    const coinFace = Math.random() > 0.5 ? "heads" : "tails";
    const winnerTeamId = coinFace === call ? "alpha" : "beta";
    const updatedRoom = roomStore.setTossResult(room.roomId, {
      call,
      coinFace,
      winnerTeamId,
      decision: null,
    });

    if (!updatedRoom) {
      ack?.({
        ok: false,
        error: "Unable to save toss result.",
      });
      return;
    }

    const serializedRoom = roomStore.serializeRoom(updatedRoom);
    io.to(room.roomId).emit("room_update", serializedRoom);
    ack?.({
      ok: true,
      room: serializedRoom,
    });
  });

  onSafe(socket, "choose_toss", (payload = {}, ack) => {
    const room = roomStore.getRoomBySocketId(socket.id);
    const decision = payload.decision === "bowl" ? "bowl" : "bat";

    if (!room) {
      ack?.({
        ok: false,
        error: "Join a room before choosing the toss outcome.",
      });
      return;
    }

    if (room.status !== "toss" || !room.tossResult) {
      ack?.({
        ok: false,
        error: "The toss result is not ready yet.",
      });
      return;
    }

    const winningCaptainId = room.captains[room.tossResult.winnerTeamId];
    if (!winningCaptainId || winningCaptainId !== socket.id) {
      ack?.({
        ok: false,
        error: "Only the toss-winning captain can choose bat or bowl.",
      });
      return;
    }

    if (room.tossResult.decision) {
      ack?.({
        ok: false,
        error: "The toss decision has already been locked.",
      });
      return;
    }

    const updatedRoom = roomStore.finalizeTossDecision(room.roomId, decision);
    if (!updatedRoom) {
      ack?.({
        ok: false,
        error: "Unable to finalize the toss decision.",
      });
      return;
    }

    const serializedRoom = roomStore.serializeRoom(updatedRoom);
    io.to(room.roomId).emit("room_update", serializedRoom);
    ack?.({
      ok: true,
      room: serializedRoom,
    });
  });

  socket.on("disconnect", () => {
    const disconnected = roomStore.markPlayerDisconnected(socket.id);

    if (!disconnected) {
      return;
    }

    logEvent("disconnect", {
      roomId: disconnected.roomId,
      socketId: socket.id,
    });

    io.to(disconnected.roomId).emit("room_update", roomStore.serializeRoom(disconnected.room));
    roomStore.scheduleDisconnectExpiry(disconnected.roomId, disconnected.player.playerKey, () => {
      expireDisconnectedPlayer(disconnected.roomId, disconnected.player.playerKey);
    });
  });
}
