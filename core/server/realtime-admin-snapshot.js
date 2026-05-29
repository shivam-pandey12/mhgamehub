const fs = require("fs");
const path = require("path");

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;
const PREMIUM_RUNTIME_TIMEOUT_MS = 1200;

const GAME_TITLES = {
    "car-wrestling": "Car Wrestling",
    "carrom-3d": "Carrom 3D",
    chopsticks: "Chopsticks",
    "golf-3d": "Golf 3D",
    handrex: "Handrex",
    "imperial-chess": "Imperial Chess 3D",
    "ludo-3d-royale": "Ludo 3D Royale",
    "snake-ladder-3d-royale": "Snake & Ladder 3D Royale",
    "spaceship-race": "Spaceship Race"
};

function clampLimit(value) {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return DEFAULT_LIMIT;
    }
    return Math.min(MAX_LIMIT, parsed);
}

function sanitizeText(value, maxLength = 120) {
    return String(value ?? "")
        .replace(/[\u0000-\u001f\u007f]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, maxLength);
}

function sanitizeSlug(value, fallback = "unknown") {
    const normalized = sanitizeText(value, 80)
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    return normalized || fallback;
}

function titleFromSlug(slug) {
    const safeSlug = sanitizeSlug(slug);
    return GAME_TITLES[safeSlug] || safeSlug
        .split(/[-_]+/g)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ") || "Unknown Game";
}

function shortIdentifier(value) {
    const text = sanitizeText(value, 96);
    if (!text) {
        return "unknown";
    }
    if (text.length <= 14) {
        return text;
    }
    return `${text.slice(0, 7)}...${text.slice(-4)}`;
}

function toNumber(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function toTimestamp(value) {
    if (!value) {
        return null;
    }
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value.toISOString();
    }
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
        return new Date(value).toISOString();
    }
    if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) {
            return null;
        }
        const parsed = Date.parse(trimmed);
        if (Number.isFinite(parsed)) {
            return new Date(parsed).toISOString();
        }
    }
    if (typeof value?.toDate === "function") {
        try {
            const date = value.toDate();
            return date instanceof Date && !Number.isNaN(date.getTime()) ? date.toISOString() : null;
        } catch {
            return null;
        }
    }
    return null;
}

function ageSeconds(createdAt, now = Date.now()) {
    const created = createdAt ? Date.parse(createdAt) : NaN;
    if (!Number.isFinite(created)) {
        return null;
    }
    return Math.max(0, Math.round((now - created) / 1000));
}

function normalizeRoomType(value) {
    const type = sanitizeText(value, 32).toLowerCase();
    if (type === "public" || type === "private") {
        return type;
    }
    return "unknown";
}

function extractPlayerCount(room) {
    const explicit = toNumber(room.playerCount, NaN);
    if (Number.isFinite(explicit)) {
        return explicit;
    }
    const active = toNumber(room.activePlayers, NaN);
    if (Number.isFinite(active)) {
        return active;
    }
    const connected = toNumber(room.connectedPlayers, NaN);
    if (Number.isFinite(connected)) {
        return connected;
    }
    if (Array.isArray(room.players)) {
        return room.players.length;
    }
    if (room.players && typeof room.players === "object") {
        return Object.values(room.players).filter(Boolean).length;
    }
    return 0;
}

function extractHasBots(room) {
    if (typeof room.hasBots === "boolean") {
        return room.hasBots;
    }
    const players = Array.isArray(room.players)
        ? room.players
        : (room.players && typeof room.players === "object" ? Object.values(room.players).filter(Boolean) : []);
    return players.some((player) => (
        player?.isBot
        || player?.type === "bot"
        || player?.controller === "server-bot"
        || player?.controller === "online-bot"
        || player?.botProfile
    ));
}

function normalizeRoom(room, defaults = {}) {
    const gameSlug = sanitizeSlug(room.gameSlug || room.gameId || defaults.gameSlug);
    const rawId = room.roomId || room.id || room.code || room.roomCode || room.key;
    const type = normalizeRoomType(room.type || room.roomType || defaults.type);
    const createdAt = toTimestamp(room.createdAt);
    const lastActivityAt = toTimestamp(room.lastActivityAt || room.updatedAt || room.lastActivity || room.lastSeenAt || room.lastTickAt || createdAt);
    return {
        roomIdShort: shortIdentifier(rawId),
        gameSlug,
        gameTitle: sanitizeText(room.gameTitle || defaults.gameTitle || titleFromSlug(gameSlug), 120),
        type,
        mode: sanitizeText(room.mode || room.matchType || room.source || room.arenaId || defaults.mode || "online", 64),
        status: sanitizeText(room.status || room.phase || defaults.status || "unknown", 64),
        playerCount: Math.max(0, Math.round(extractPlayerCount(room))),
        maxPlayers: Number.isFinite(Number(room.maxPlayers)) ? Math.max(0, Math.round(Number(room.maxPlayers))) : null,
        createdAt,
        ageSeconds: ageSeconds(createdAt),
        lastActivityAt,
        hasBots: extractHasBots(room),
        isPublic: type === "public",
        isPrivate: type === "private"
    };
}

function normalizeQueue(queue, defaults = {}) {
    const gameSlug = sanitizeSlug(queue.gameSlug || defaults.gameSlug);
    const waitingCount = Math.max(0, Math.round(toNumber(queue.waitingCount ?? queue.count, 0)));
    return {
        gameSlug,
        gameTitle: sanitizeText(queue.gameTitle || defaults.gameTitle || titleFromSlug(gameSlug), 120),
        mode: sanitizeText(queue.mode || defaults.mode || "public", 64),
        waitingCount,
        oldestWaitingSeconds: queue.oldestWaitingSeconds === null || queue.oldestWaitingSeconds === undefined
            ? null
            : Math.max(0, Math.round(toNumber(queue.oldestWaitingSeconds, 0))),
        botFillEnabled: Boolean(queue.botFillEnabled),
        estimatedMatchSize: Number.isFinite(Number(queue.estimatedMatchSize))
            ? Math.max(0, Math.round(Number(queue.estimatedMatchSize)))
            : null
    };
}

function countNamespaceSockets(io, namespaceName = "/") {
    const namespace = namespaceName === "/" ? io?.of?.("/") : io?._nsps?.get?.(namespaceName);
    const sockets = namespace?.sockets;
    if (typeof sockets?.size === "number") {
        return sockets.size;
    }
    if (typeof sockets?.sockets?.size === "number") {
        return sockets.sockets.size;
    }
    return 0;
}

function countAllSockets(io) {
    if (io?._nsps instanceof Map) {
        let total = 0;
        io._nsps.forEach((namespace) => {
            const sockets = namespace?.sockets;
            total += typeof sockets?.size === "number"
                ? sockets.size
                : (typeof sockets?.sockets?.size === "number" ? sockets.sockets.size : 0);
        });
        return total;
    }
    return Math.max(0, Math.round(toNumber(io?.engine?.clientsCount, 0)));
}

function buildRootRooms(realtimeHub) {
    const rooms = [];
    try {
        const genericRooms = typeof realtimeHub?.getRoomsSnapshot === "function" ? realtimeHub.getRoomsSnapshot() : [];
        genericRooms.forEach((room) => {
            rooms.push(normalizeRoom({
                roomId: room.key || room.roomId,
                gameSlug: room.gameId || "gamehub-room",
                gameTitle: titleFromSlug(room.gameId || "gamehub-room"),
                type: "unknown",
                mode: "shared-room",
                status: room.playerCount > 0 ? "active" : "waiting",
                playerCount: room.playerCount,
                createdAt: room.createdAt,
                players: room.players
            }));
        });
    } catch {
        // The admin snapshot must never disturb realtime gameplay.
    }

    try {
        const chopstickRooms = typeof realtimeHub?.getChopstickRoomsSnapshot === "function" ? realtimeHub.getChopstickRoomsSnapshot() : [];
        chopstickRooms.forEach((room) => {
            const players = Object.values(room.players || {}).filter(Boolean);
            rooms.push(normalizeRoom({
                roomId: room.code,
                gameSlug: "chopsticks",
                gameTitle: "Chopsticks",
                type: "private",
                mode: "online-room",
                status: room.match?.status || (players.length >= 2 ? "ready" : "waiting"),
                playerCount: players.length,
                maxPlayers: 2,
                createdAt: room.createdAt,
                players
            }));
        });
    } catch {
        // Ignore malformed optional game snapshots.
    }

    try {
        const carRooms = typeof realtimeHub?.getCarWrestlingRoomsSnapshot === "function" ? realtimeHub.getCarWrestlingRoomsSnapshot() : [];
        carRooms.forEach((room) => {
            rooms.push(normalizeRoom({
                roomId: room.roomId,
                gameSlug: "car-wrestling",
                gameTitle: "Car Wrestling",
                type: "private",
                mode: room.arenaId || "arena",
                status: room.phase || "unknown",
                playerCount: room.connectedPlayers,
                maxPlayers: room.maxPlayers,
                hasBots: false,
                players: room.players
            }));
        });
    } catch {
        // Ignore malformed optional game snapshots.
    }

    return rooms;
}

async function resolvePremiumRuntimes(premiumRuntimeReady) {
    try {
        const timeout = new Promise((resolve) => {
            setTimeout(() => resolve([]), PREMIUM_RUNTIME_TIMEOUT_MS).unref?.();
        });
        const mounted = await Promise.race([Promise.resolve(premiumRuntimeReady), timeout]);
        return Array.isArray(mounted) ? mounted : [];
    } catch {
        return [];
    }
}

async function readRuntimeSnapshot(runtime) {
    const gameSlug = sanitizeSlug(runtime.id);
    const gameTitle = titleFromSlug(gameSlug);
    const activeSockets = countNamespaceSockets(runtime.rootIo, runtime.namespace);
    const base = {
        gameSlug,
        gameTitle,
        namespace: runtime.namespace,
        activeSockets,
        rooms: [],
        queues: [],
        health: {}
    };

    try {
        const handle = runtime.handle || {};
        const snapshot = typeof handle.getAdminSnapshot === "function"
            ? await handle.getAdminSnapshot()
            : (typeof handle.getSnapshot === "function" ? await handle.getSnapshot() : null);
        if (!snapshot || typeof snapshot !== "object") {
            return base;
        }
        const health = snapshot.health && typeof snapshot.health === "object" ? snapshot.health : snapshot;
        return {
            ...base,
            activeSockets: Math.max(activeSockets, Math.round(toNumber(snapshot.activeSockets ?? health.connectedSockets, 0))),
            rooms: Array.isArray(snapshot.rooms)
                ? snapshot.rooms.map((room) => normalizeRoom(room, { gameSlug, gameTitle }))
                : [],
            queues: Array.isArray(snapshot.queues)
                ? snapshot.queues.map((queue) => normalizeQueue(queue, { gameSlug, gameTitle }))
                : [],
            health
        };
    } catch (error) {
        return {
            ...base,
            error: sanitizeText(error?.message || "Runtime snapshot unavailable.", 180)
        };
    }
}

function mergeGameBuckets({ rooms, queues, runtimeSnapshots }) {
    const buckets = new Map();
    const ensure = (gameSlug, gameTitle) => {
        const slug = sanitizeSlug(gameSlug);
        if (!buckets.has(slug)) {
            buckets.set(slug, {
                gameSlug: slug,
                gameTitle: sanitizeText(gameTitle || titleFromSlug(slug), 120),
                activeRooms: 0,
                activePlayers: 0,
                waitingInQueue: 0,
                publicRooms: 0,
                privateRooms: 0
            });
        }
        return buckets.get(slug);
    };

    rooms.forEach((room) => {
        const bucket = ensure(room.gameSlug, room.gameTitle);
        bucket.activeRooms += 1;
        bucket.activePlayers += room.playerCount || 0;
        if (room.isPublic) {
            bucket.publicRooms += 1;
        }
        if (room.isPrivate) {
            bucket.privateRooms += 1;
        }
    });

    queues.forEach((queue) => {
        const bucket = ensure(queue.gameSlug, queue.gameTitle);
        bucket.waitingInQueue += queue.waitingCount || 0;
    });

    runtimeSnapshots.forEach((runtime) => {
        const bucket = ensure(runtime.gameSlug, runtime.gameTitle);
        const healthRooms = toNumber(runtime.health?.activeRooms ?? runtime.health?.rooms, NaN);
        const healthQueues = toNumber(runtime.health?.activeQueues ?? runtime.health?.queue ?? runtime.health?.queuedPlayers ?? runtime.health?.queued?.quick, NaN);
        const healthPlayers = toNumber(runtime.health?.connectedPlayers ?? runtime.health?.activePlayers, NaN);
        if (Number.isFinite(healthRooms) && healthRooms > bucket.activeRooms) {
            bucket.activeRooms = Math.round(healthRooms);
        }
        if (Number.isFinite(healthQueues) && healthQueues > bucket.waitingInQueue) {
            bucket.waitingInQueue = Math.round(healthQueues);
        }
        if (Number.isFinite(healthPlayers) && healthPlayers > bucket.activePlayers) {
            bucket.activePlayers = Math.round(healthPlayers);
        }
    });

    return [...buckets.values()].sort((left, right) => (
        right.activeRooms - left.activeRooms
        || right.activePlayers - left.activePlayers
        || left.gameTitle.localeCompare(right.gameTitle)
    ));
}

function filterRooms(rooms, query = {}) {
    const gameSlug = sanitizeText(query.gameSlug, 80);
    const type = sanitizeText(query.type || "all", 16).toLowerCase();
    const status = sanitizeText(query.status, 64).toLowerCase();
    return rooms.filter((room) => {
        if (gameSlug && room.gameSlug !== sanitizeSlug(gameSlug)) {
            return false;
        }
        if ((type === "public" || type === "private") && room.type !== type) {
            return false;
        }
        if (status && room.status.toLowerCase() !== status) {
            return false;
        }
        return true;
    });
}

function detectStorageStatus(rootDir) {
    const hasInlineCredentials = Boolean(
        String(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || "").trim()
        || String(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 || "").trim()
        || process.env.ALLOW_FIREBASE_APPLICATION_DEFAULT === "true"
    );
    const candidatePaths = [
        process.env.FIREBASE_SERVICE_ACCOUNT_FILE,
        process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
        process.env.GAMEHUB_PREMIUM_FIREBASE_SERVICE_ACCOUNT,
        process.env.GOOGLE_APPLICATION_CREDENTIALS,
        path.join(rootDir, "premium", "firebase_credentials", "serviceAccount.json")
    ].filter(Boolean);
    const hasCredentialFile = candidatePaths.some((candidate) => {
        try {
            const absolute = path.isAbsolute(candidate) ? candidate : path.resolve(rootDir, candidate);
            return fs.existsSync(absolute) && fs.statSync(absolute).isFile();
        } catch {
            return false;
        }
    });
    const dataDir = path.join(rootDir, ".gamehub-data");
    const localFallbackActive = fs.existsSync(dataDir) && fs.statSync(dataDir).isDirectory();
    return {
        firebaseConfigured: hasInlineCredentials || hasCredentialFile,
        localFallbackActive
    };
}

function createRealtimeAdminSnapshot({ io, realtimeHub, premiumRuntimeReady, rootDir, startedAt = Date.now() }) {
    async function collect() {
        const rootRooms = buildRootRooms(realtimeHub);
        const mounted = await resolvePremiumRuntimes(premiumRuntimeReady);
        const runtimeSnapshots = await Promise.all(mounted.map((runtime) => readRuntimeSnapshot({
            ...runtime,
            rootIo: io
        })));
        const runtimeRooms = runtimeSnapshots.flatMap((runtime) => runtime.rooms);
        const runtimeQueues = runtimeSnapshots.flatMap((runtime) => runtime.queues);
        const rooms = [...rootRooms, ...runtimeRooms].sort((left, right) => (
            (right.playerCount || 0) - (left.playerCount || 0)
            || String(right.createdAt || "").localeCompare(String(left.createdAt || ""))
        ));
        const queues = runtimeQueues.sort((left, right) => (
            (right.waitingCount || 0) - (left.waitingCount || 0)
            || left.gameTitle.localeCompare(right.gameTitle)
        ));
        const byGame = mergeGameBuckets({ rooms, queues, runtimeSnapshots });
        return { rooms, queues, byGame, runtimeSnapshots };
    }

    async function getOverview() {
        const { rooms, queues, byGame } = await collect();
        const activeSockets = countAllSockets(io);
        const activePlayersApprox = rooms.reduce((total, room) => total + (room.playerCount || 0), 0);
        return {
            ok: true,
            totals: {
                activeSockets,
                activeRooms: rooms.length,
                publicRooms: rooms.filter((room) => room.isPublic).length,
                privateRooms: rooms.filter((room) => room.isPrivate).length,
                matchmakingWaiting: queues.reduce((total, queue) => total + (queue.waitingCount || 0), 0),
                gamesWithActiveRooms: byGame.filter((game) => game.activeRooms > 0).length,
                activePlayersApprox: Math.max(activePlayersApprox, activeSockets)
            },
            byGame,
            updatedAt: new Date().toISOString()
        };
    }

    async function listRooms(query = {}) {
        const { rooms } = await collect();
        const limit = clampLimit(query.limit);
        return {
            ok: true,
            items: filterRooms(rooms, query).slice(0, limit),
            nextCursor: null,
            updatedAt: new Date().toISOString()
        };
    }

    async function listQueues() {
        const { queues } = await collect();
        return {
            ok: true,
            queues,
            updatedAt: new Date().toISOString()
        };
    }

    function getSystemHealth() {
        const memory = process.memoryUsage();
        const storage = detectStorageStatus(rootDir);
        const activeSockets = countAllSockets(io);
        const isProduction = process.env.NODE_ENV === "production";
        const checks = [
            {
                name: "server",
                status: "healthy",
                message: "Admin health endpoint is responding."
            },
            {
                name: "websocket",
                status: io ? "healthy" : "unknown",
                message: io ? "Socket.IO server is mounted." : "Socket.IO server is not available."
            },
            {
                name: "memory",
                status: memory.heapTotal > 0 && memory.heapUsed / memory.heapTotal > 0.92 ? "degraded" : "healthy",
                message: `${Math.round(memory.heapUsed / 1024 / 1024)} MB heap used.`
            },
            {
                name: "storage",
                status: isProduction && storage.localFallbackActive ? "degraded" : "healthy",
                message: storage.firebaseConfigured
                    ? "Firebase Admin credentials appear configured."
                    : (storage.localFallbackActive ? "Local fallback data is present." : "No Firebase Admin credentials detected.")
            }
        ];
        const status = checks.some((check) => check.status === "degraded")
            ? "degraded"
            : (checks.some((check) => check.status === "unknown") ? "unknown" : "healthy");
        return {
            ok: true,
            status,
            uptimeSeconds: Math.round(process.uptime()),
            memory: {
                rss: memory.rss,
                heapUsed: memory.heapUsed,
                heapTotal: memory.heapTotal
            },
            nodeVersion: process.version,
            environment: sanitizeText(process.env.NODE_ENV || "development", 40),
            serverTime: new Date().toISOString(),
            startedAt: new Date(startedAt).toISOString(),
            websocket: {
                enabled: Boolean(io),
                activeSockets
            },
            storage,
            checks
        };
    }

    function listSystemLogs() {
        return {
            ok: true,
            connected: false,
            items: [],
            message: "Log buffer not connected yet."
        };
    }

    return {
        getOverview,
        listRooms,
        listQueues,
        getSystemHealth,
        listSystemLogs
    };
}

module.exports = {
    createRealtimeAdminSnapshot
};
