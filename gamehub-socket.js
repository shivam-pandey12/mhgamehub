(function initGameHubSocket(global) {
    function slugify(value) {
        return String(value || "")
            .toLowerCase()
            .replace(/\.html?$/i, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    function inferGameId() {
        var params = new URLSearchParams(global.location.search);
        var queryGameId = slugify(params.get("gameId") || params.get("id"));
        if (queryGameId) {
            return queryGameId;
        }

        var pathMatch = global.location.pathname.match(/^\/games\/([^/]+)/i);
        if (pathMatch && pathMatch[1]) {
            return slugify(decodeURIComponent(pathMatch[1]));
        }

        return "lobby";
    }

    function inferRoomId() {
        var params = new URLSearchParams(global.location.search);
        return slugify(params.get("roomId") || params.get("room")) || "default";
    }

    function buildAuth(options) {
        return Object.assign({}, options.auth || {}, {
            gameId: slugify(options.gameId || inferGameId()) || "lobby",
            roomId: slugify(options.roomId || inferRoomId()) || "default",
            playerName: typeof options.playerName === "string" ? options.playerName.trim().slice(0, 32) : ""
        });
    }

    function createSocket(options) {
        var resolvedOptions = options || {};
        if (typeof global.io !== "function") {
            throw new Error('Socket.IO client not found. Load "/socket.io/socket.io.js" before "gamehub-socket.js".');
        }

        return global.io(resolvedOptions.url || undefined, {
            path: resolvedOptions.path || "/socket.io",
            transports: resolvedOptions.transports || ["websocket", "polling"],
            auth: buildAuth(resolvedOptions)
        });
    }

    function createGameHubSocket(options) {
        var resolvedOptions = options || {};
        var socket = resolvedOptions.socket || createSocket(resolvedOptions);

        return {
            socket: socket,
            joinRoom: function joinRoom(roomId, extra) {
                var payload = Object.assign({}, extra || {}, {
                    roomId: roomId
                });
                socket.emit("gamehub:join", payload);
                return socket;
            },
            leaveRoom: function leaveRoom() {
                socket.emit("gamehub:leave");
                return socket;
            },
            send: function send(eventName, payload) {
                socket.emit(eventName, payload);
                return socket;
            },
            onRoomState: function onRoomState(handler) {
                socket.on("gamehub:room-state", handler);
                return function unsubscribe() {
                    socket.off("gamehub:room-state", handler);
                };
            }
        };
    }

    global.GameHubSocket = {
        create: createGameHubSocket,
        createSocket: createSocket,
        inferGameId: inferGameId,
        inferRoomId: inferRoomId,
        slugify: slugify
    };
})(window);
