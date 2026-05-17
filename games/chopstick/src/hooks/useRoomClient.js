import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.DEV ? "http://localhost:3001" : undefined;
const SOCKET_OPTIONS = import.meta.env.DEV
  ? {
      transports: ["websocket"]
    }
  : {
      path: "/socket.io",
      transports: ["websocket"],
      auth: {
        gameId: "chopstick",
        roomId: "default"
      }
    };

export function useRoomClient() {
  const socketRef = useRef(null);
  const [room, setRoom] = useState(null);
  const [seat, setSeat] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const clearError = useCallback(() => {
    setError("");
  }, []);

  const bindSocket = useCallback((socket) => {
    socket.on("connect", () => {
      setStatus("connected");
    });

    socket.on("disconnect", () => {
      setStatus("disconnected");
    });

    socket.on("connect_error", () => {
      setStatus("error");
      setError("Live room service unavailable. Check that the main GameHub server is running.");
    });

    socket.on("room:update", (nextRoom) => {
      setRoom(nextRoom);
    });

    socket.on("room:error", (message) => {
      setError(message);
    });
  }, []);

  const teardownSocket = useCallback(() => {
    const socket = socketRef.current;
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    }
  }, []);

  const ensureSocket = useCallback(() => {
    if (socketRef.current) {
      return socketRef.current;
    }

    const socket = io(SOCKET_URL, {
      ...SOCKET_OPTIONS
    });
    bindSocket(socket);
    socketRef.current = socket;
    return socket;
  }, [bindSocket]);

  const emitWithAck = useCallback(
    (eventName, payload) =>
      new Promise((resolve, reject) => {
        const socket = ensureSocket();
        socket.emit(eventName, payload, (response) => {
          if (response?.ok) {
            resolve(response);
            return;
          }

          const message = response?.error ?? "The room server did not answer.";
          setError(message);
          reject(new Error(message));
        });
      }),
    [ensureSocket]
  );

  const createRoom = useCallback(
    async (profile) => {
      clearError();
      const response = await emitWithAck("room:create", { profile });
      setSeat(response.seat);
      setRoom(response.room);
      return response;
    },
    [clearError, emitWithAck]
  );

  const joinRoom = useCallback(
    async (roomCode, profile) => {
      clearError();
      const response = await emitWithAck("room:join", { roomCode, profile });
      setSeat(response.seat);
      setRoom(response.room);
      return response;
    },
    [clearError, emitWithAck]
  );

  const sendMove = useCallback(
    async (move) => {
      if (!room) {
        throw new Error("No room selected.");
      }

      await emitWithAck("match:move", { move });
    },
    [emitWithAck, room]
  );

  const sendReaction = useCallback(
    async (emoji) => {
      if (!room) {
        throw new Error("No room selected.");
      }

      await emitWithAck("match:reaction", { emoji });
    },
    [emitWithAck, room]
  );

  const requestRematch = useCallback(async () => {
    if (!room) {
      throw new Error("No room selected.");
    }

    await emitWithAck("match:rematch", {});
  }, [emitWithAck, room]);

  const leaveRoom = useCallback(() => {
    teardownSocket();
    setRoom(null);
    setSeat(null);
    setStatus("idle");
    setError("");
  }, [teardownSocket]);

  useEffect(() => () => teardownSocket(), [teardownSocket]);

  return {
    room,
    seat,
    status,
    error,
    clearError,
    createRoom,
    joinRoom,
    sendMove,
    sendReaction,
    requestRematch,
    leaveRoom
  };
}
