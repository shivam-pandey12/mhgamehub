import {
  HANDREX_RUNTIME_LIMITS,
  debugLog,
  normalizeText,
  onSafe,
} from "../utils/runtimeGuards.js";

/**
 * Register realtime game events for a connected socket.
 *
 * @param {import("socket.io").Server} io
 * @param {import("socket.io").Socket} socket
 * @param {{ roomStore: any; gameStore: any }} stores
 */
export function registerGameHandler(io, socket, { roomStore, gameStore }) {
  const SIGNAL_COOLDOWN_MS = 2500;
  const SIGNAL_LOOKUP = new Map([
    ["take-strike", { categoryId: "batting", text: "I'll take strike" }],
    ["you-take-strike", { categoryId: "batting", text: "You take strike" }],
    ["play-safe", { categoryId: "batting", text: "Play safe" }],
    ["go-aggressive", { categoryId: "batting", text: "Go aggressive" }],
    ["i-bowl-next", { categoryId: "bowling", text: "I'll bowl next" }],
    ["change-bowler", { categoryId: "bowling", text: "Change bowler" }],
    ["try-random", { categoryId: "bowling", text: "Try random" }],
    ["watch-pattern", { categoryId: "bowling", text: "Watch pattern" }],
    ["nice-move", { categoryId: "general", text: "Nice move" }],
    ["careful", { categoryId: "general", text: "Careful" }],
    ["finish-it", { categoryId: "general", text: "Finish it" }],
    ["wait", { categoryId: "general", text: "Wait" }],
  ]);

  /**
   * @param {string} event
   * @param {any} payload
   */
  function logEvent(event, payload) {
    debugLog("game", event, payload);
  }

  /**
   * @param {string} roomId
   */
  function scheduleTurnTimeout(roomId) {
    const game = gameStore.getGame(roomId);

    if (!game || game.status !== "live") {
      return;
    }

    gameStore.startTurnTimer(roomId, game.settings.inputTimeoutMs, () => {
      const freshGame = gameStore.getGame(roomId);
      if (!freshGame) {
        return;
      }

      io.to(roomId).emit(
        "next_turn",
        gameStore.createNextTurnPayload(freshGame, {
          timeout: true,
          message: "Still waiting for the active batter and bowler input.",
        }),
      );
    });
  }

  onSafe(socket, "player_ready", (payload = {}, ack) => {
    const room = roomStore.setPlayerReady(socket.id, payload.ready !== false);

    if (!room) {
      socket.emit("room_error", {
        message: "Player is not inside an active room.",
      });
      ack?.({
        ok: false,
        error: "Player is not inside an active room.",
      });
      return;
    }

    const serializedRoom = roomStore.serializeRoom(room);
    logEvent("player_ready", {
      roomId: room.roomId,
      playerId: socket.id,
      ready: payload.ready !== false,
    });

    io.to(room.roomId).emit("room_update", serializedRoom);
    ack?.({
      ok: true,
      room: serializedRoom,
      allReady: roomStore.canStartMatch(room),
    });
  });

  onSafe(socket, "start_match", (payload = {}, ack) => {
    const room = roomStore.getRoomBySocketId(socket.id);

    if (!room) {
      socket.emit("game_error", {
        message: "Join a room before starting a match.",
      });
      ack?.({
        ok: false,
        error: "Join a room before starting a match.",
      });
      return;
    }

    if (room.hostId !== socket.id) {
      socket.emit("game_error", {
        roomId: room.roomId,
        message: "Only the room host can start the match.",
      });
      ack?.({
        ok: false,
        error: "Only the room host can start the match.",
      });
      return;
    }

    if (!roomStore.canStartMatch(room)) {
      socket.emit("game_error", {
        roomId: room.roomId,
        message: "Finish the toss and lineup flow before starting the match.",
      });
      ack?.({
        ok: false,
        error: "Finish the toss and lineup flow before starting the match.",
      });
      return;
    }

    const result = gameStore.createGame({
      room,
      settings: payload.settings,
      tossWinnerId: room.tossResult?.winnerTeamId ? room.captains[room.tossResult.winnerTeamId] ?? null : null,
      decision: room.tossResult?.decision ?? null,
      battingFirstPlayerId: payload.battingFirstPlayerId ?? null,
      teams: payload.teams ?? null,
    });

    if (result.error || !result.game) {
      socket.emit("game_error", {
        roomId: room.roomId,
        message: result.error ?? "Unable to create match.",
      });
      ack?.({
        ok: false,
        error: result.error ?? "Unable to create match.",
      });
      return;
    }

    roomStore.updateStatus(room.roomId, "live");
    const serializedRoom = roomStore.serializeRoom(roomStore.getRoom(room.roomId));
    const serializedGame = gameStore.serializeGame(result.game);

    logEvent("start_match", {
      roomId: room.roomId,
      startedBy: socket.id,
      settings: result.game.settings,
    });

    io.to(room.roomId).emit("room_update", serializedRoom);
    io.to(room.roomId).emit("game_started", serializedGame);
    io.to(room.roomId).emit(
      "next_turn",
      gameStore.createNextTurnPayload(result.game, {
        message: `Match live. Active batter and bowler should select from ${result.game.settings.numberSetLabel}.`,
      }),
    );
    scheduleTurnTimeout(room.roomId);

    ack?.({
      ok: true,
      room: serializedRoom,
      game: serializedGame,
    });
  });

  onSafe(socket, "select_number", (payload = {}, ack) => {
    const room = roomStore.getRoomBySocketId(socket.id);

    if (!room) {
      socket.emit("game_error", {
        message: "Join a room before selecting a number.",
      });
      ack?.({
        ok: false,
        error: "Join a room before selecting a number.",
      });
      return;
    }

    const submission = gameStore.submitInput({
      roomId: room.roomId,
      socketId: socket.id,
      number: Number(payload.number),
    });

    if (submission.error || !submission.game) {
      socket.emit("game_error", {
        roomId: room.roomId,
        message: submission.error ?? "Unable to accept number input.",
      });
      ack?.({
        ok: false,
        error: submission.error ?? "Unable to accept number input.",
      });
      return;
    }

    logEvent("select_number", {
      roomId: room.roomId,
      playerId: socket.id,
      locked: true,
    });

    if (!submission.readyForReveal) {
      io.to(room.roomId).emit(
        "next_turn",
        gameStore.createNextTurnPayload(submission.game, {
          message: "Waiting for the active batter and bowler to lock numbers.",
        }),
      );
      ack?.({
        ok: true,
        waiting: true,
      });
      return;
    }

    gameStore.clearTurnTimer(room.roomId);
    const resolution = gameStore.resolveBall(room.roomId);

    if (resolution.error || !resolution.game || !resolution.ballResult) {
      socket.emit("game_error", {
        roomId: room.roomId,
        message: resolution.error ?? "Unable to resolve ball.",
      });
      ack?.({
        ok: false,
        error: resolution.error ?? "Unable to resolve ball.",
      });
      return;
    }

    io.to(room.roomId).emit("ball_result", resolution.ballResult);

    if (resolution.matchEnd) {
      roomStore.updateStatus(room.roomId, "completed");
      io.to(room.roomId).emit("match_end", resolution.matchEnd);
      ack?.({
        ok: true,
        waiting: false,
        result: resolution.ballResult,
        matchEnd: resolution.matchEnd,
      });
      return;
    }

    if (resolution.nextTurn) {
      io.to(room.roomId).emit("next_turn", resolution.nextTurn);
      scheduleTurnTimeout(room.roomId);
    }

    ack?.({
      ok: true,
      waiting: false,
      result: resolution.ballResult,
      nextTurn: resolution.nextTurn ?? null,
    });
  });

  onSafe(socket, "send_signal", (payload = {}, ack) => {
    const room = roomStore.getRoomBySocketId(socket.id);
    const signalId = String(payload.signalId ?? "").trim();
    const customText = normalizeText(payload.customText, "", HANDREX_RUNTIME_LIMITS.maxCustomSignalLength);
    const signal = SIGNAL_LOOKUP.get(signalId);
    const now = Date.now();
    const cooldownRemaining = SIGNAL_COOLDOWN_MS - (now - Number(socket.data.lastSignalAt ?? 0));

    if (!room) {
      ack?.({
        ok: false,
        error: "Join a room before sending signals.",
      });
      return;
    }

    if (!signal && !customText) {
      ack?.({
        ok: false,
        error: "Choose a sample signal or type a short teammate note.",
      });
      return;
    }

    const game = gameStore.getGame(room.roomId);
    if (!game || game.status !== "live") {
      ack?.({
        ok: false,
        error: "Signals are only available during a live match.",
      });
      return;
    }

    if (cooldownRemaining > 0) {
      ack?.({
        ok: false,
        error: `Signal cooling down. Try again in ${Math.ceil(cooldownRemaining / 1000)}s.`,
      });
      return;
    }

    const senderTeam = Object.values(game.teams).find((team) => team.playerIds.includes(socket.id));
    if (!senderTeam) {
      ack?.({
        ok: false,
        error: "Signal sender is not part of the active teams.",
      });
      return;
    }

    const teammateSockets = senderTeam.playerIds
      .filter((playerId) => playerId !== socket.id)
      .map((playerId) => ({
        playerId,
        socket: io.sockets.sockets.get(playerId),
        player: room.players.find((entry) => entry.id === playerId) ?? null,
      }))
      .filter((entry) => entry.player?.connected !== false && entry.socket);

    if (!teammateSockets.length) {
      ack?.({
        ok: false,
        error: "No connected teammate is available to receive that signal.",
      });
      return;
    }

    socket.data.lastSignalAt = now;
    const senderName = room.players.find((player) => player.id === socket.id)?.name ?? "Teammate";
    const signalPayload = {
      roomId: room.roomId,
      signalId: signal?.id ?? "custom",
      categoryId: signal?.categoryId ?? "custom",
      senderTeamId: senderTeam.id,
      text: signal?.text ?? customText,
      fromPlayerId: socket.id,
      fromPlayerName: senderName,
      sentAt: now,
    };

    io.to(room.roomId).emit("receive_signal", signalPayload);

    logEvent("send_signal", {
      roomId: room.roomId,
      fromPlayerId: socket.id,
      recipients: teammateSockets.map((entry) => entry.playerId),
      signalId: signal?.id ?? "custom",
      customText: signal ? undefined : customText,
    });

    ack?.({
      ok: true,
      recipients: teammateSockets.length,
    });
  });
}
