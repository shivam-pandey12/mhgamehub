const express = require("express");
const http = require("http");
const path = require("path");
const { Server: SocketIOServer } = require("socket.io");

const { buildGameCatalog, createGameRegistry } = require("./game-registry");
const { createPremiumRegistry } = require("./premium-registry");
const { initializePremiumRuntime } = require("./premium-runtime-loader");
const { createPublicFilePolicy } = require("./public-file-policy");
const { createRealtimeHub } = require("./realtime-hub");
const { readPremiumFirebaseConfig } = require("./premium-auth-config");
const { verifyPremiumFirebaseIdentityToken } = require("./premium-firebase-token-verifier");
const { signPremiumSessionTicket } = require("./premium-session-ticket");

const IMMUTABLE_ASSET_EXTENSIONS = new Set([
    ".css",
    ".js",
    ".mjs",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".svg",
    ".ico",
    ".mp3",
    ".wav",
    ".ogg",
    ".m4a",
    ".mp4",
    ".webm",
    ".gltf",
    ".glb",
    ".bin",
    ".wasm",
    ".ttf",
    ".woff",
    ".woff2"
]);

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const GAMEHUB_ALLOWED_ORIGINS = String(process.env.GAMEHUB_ALLOWED_ORIGINS || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

function normalizeOrigin(origin) {
    try {
        return new URL(String(origin || "")).origin;
    } catch {
        return "";
    }
}

function getRequestHost(req) {
    return String(req.headers["x-forwarded-host"] || req.headers.host || "")
        .split(",")[0]
        .trim();
}

function getRequestProtocol(req) {
    const forwardedProto = String(req.headers["x-forwarded-proto"] || "")
        .split(",")[0]
        .trim()
        .toLowerCase();

    if (forwardedProto === "http" || forwardedProto === "https") {
        return forwardedProto;
    }

    return req.socket && req.socket.encrypted ? "https" : "http";
}

function isAllowedSocketOrigin(origin, req = null) {
    if (!origin) {
        return true;
    }

    const normalizedOrigin = normalizeOrigin(origin);
    if (!normalizedOrigin) {
        return !IS_PRODUCTION;
    }

    if (GAMEHUB_ALLOWED_ORIGINS.length > 0) {
        return GAMEHUB_ALLOWED_ORIGINS.includes(normalizedOrigin);
    }

    if (!req) {
        return !IS_PRODUCTION;
    }

    const host = getRequestHost(req);
    if (!host) {
        return !IS_PRODUCTION;
    }

    return normalizedOrigin === `${getRequestProtocol(req)}://${host}`;
}

function applyBaselineHeaders(req, res, next) {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    next();
}

function applyCacheHeaders(res, filePath) {
    const extension = path.extname(String(filePath || "")).toLowerCase();
    const normalized = String(filePath || "").replace(/\\/g, "/").toLowerCase();
    const isHtmlDocument = extension === ".html";
    const isJsonDocument = extension === ".json";

    if (isHtmlDocument || isJsonDocument) {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        return;
    }

    if (IMMUTABLE_ASSET_EXTENSIONS.has(extension)) {
        const isVendorAsset = normalized.includes("/vendor/") || normalized.includes("/assets/");
        const maxAgeSeconds = isVendorAsset ? 60 * 60 * 24 * 7 : 60 * 60;
        res.setHeader("Cache-Control", `public, max-age=${maxAgeSeconds}`);
        return;
    }

    res.setHeader("Cache-Control", "public, max-age=300");
}

function sendNoStoreFile(res, filePath) {
    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.sendFile(filePath);
}

function buildRedirectLocation(req, pathname) {
    const requestUrl = String(req.originalUrl || req.url || "");
    const queryIndex = requestUrl.indexOf("?");
    const query = queryIndex >= 0 ? requestUrl.slice(queryIndex) : "";
    return `${pathname}${query}`;
}

function redirectToCleanPath(pathname) {
    return (req, res) => {
        res.redirect(308, buildRedirectLocation(req, pathname));
    };
}

function createServer() {
    const app = express();
    app.disable("x-powered-by");
    app.use(express.json({ limit: "32kb" }));
    const httpServer = http.createServer(app);
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: (origin, callback) => {
                callback(null, isAllowedSocketOrigin(origin));
            },
            methods: ["GET", "POST"]
        },
        allowRequest: (req, callback) => {
            callback(null, isAllowedSocketOrigin(req.headers.origin, req));
        }
    });

    const rootDir = path.resolve(__dirname, "..", "..");
    const gameRegistry = createGameRegistry(rootDir);
    const premiumRegistry = createPremiumRegistry(rootDir);
    const realtimeHub = createRealtimeHub(io);
    const premiumRuntimeRouter = express.Router();
    const premiumRuntimeReady = initializePremiumRuntime({
        app: premiumRuntimeRouter,
        io,
        rootDir
    });
    const resolvePremiumFirebaseConfig = () => readPremiumFirebaseConfig(rootDir);

    app.use(applyBaselineHeaders);

    app.get("/api/health", (_, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        res.json({
            ok: true,
            platform: "gamehub",
            runtime: "root-server",
            catalogCached: true
        });
    });

    app.get("/api/games-catalog", async (req, res) => {
        try {
            res.setHeader("Cache-Control", "no-store, max-age=0");
            const games = await gameRegistry.listGames({
                force: req.query.refresh === "1"
            });
            res.json({ games });
        } catch (error) {
            console.error("Failed to build games catalog:", error);
            res.status(500).json({ error: "Failed to build games catalog" });
        }
    });

    app.get("/api/socket-status", (_, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        res.json({
            enabled: true,
            clientScript: "/socket.io/socket.io.js",
            helperScript: "/gamehub-socket.js",
            rooms: realtimeHub.getRoomsSnapshot(),
            chopstickRooms: realtimeHub.getChopstickRoomsSnapshot(),
            carWrestlingRooms: realtimeHub.getCarWrestlingRoomsSnapshot()
        });
    });

    app.get("/api/premium-games-catalog", async (req, res) => {
        try {
            res.setHeader("Cache-Control", "no-store, max-age=0");
            const games = await premiumRegistry.listGames({
                force: req.query.refresh === "1"
            });
            res.json({ games });
        } catch (error) {
            console.error("Failed to build premium games catalog:", error);
            res.status(500).json({ error: "Failed to build premium games catalog" });
        }
    });

    app.get("/api/premium-auth/session", (_, res) => {
        const firebaseConfigState = resolvePremiumFirebaseConfig();
        res.setHeader("Cache-Control", "no-store, max-age=0");
        res.json({
            ok: true,
            premiumOnly: true,
            authenticated: false,
            user: null,
            mode: firebaseConfigState.configured ? "firebase-client" : "firebase-pending",
            provider: "firebase",
            configured: firebaseConfigState.configured,
            error: firebaseConfigState.error,
            warning: firebaseConfigState.warning || null
        });
    });

    app.get("/api/premium-auth/config", (_, res) => {
        const firebaseConfigState = resolvePremiumFirebaseConfig();
        res.setHeader("Cache-Control", "no-store, max-age=0");
        res.json({
            ok: true,
            premiumOnly: true,
            provider: "firebase",
            configured: firebaseConfigState.configured,
            config: firebaseConfigState.configured ? firebaseConfigState.config : null,
            error: firebaseConfigState.error,
            warning: firebaseConfigState.warning || null
        });
    });

    app.post("/api/premium-auth/exchange", async (req, res) => {
        const firebaseConfigState = resolvePremiumFirebaseConfig();
        res.setHeader("Cache-Control", "no-store, max-age=0");

        if (!firebaseConfigState.configured || !firebaseConfigState.config) {
            res.status(503).json({
                ok: false,
                premiumOnly: true,
                authenticated: false,
                error: firebaseConfigState.error || "Premium Firebase is not configured."
            });
            return;
        }

        const idToken = typeof req.body?.idToken === "string" ? req.body.idToken.trim() : "";
        if (!idToken) {
            res.status(400).json({
                ok: false,
                premiumOnly: true,
                authenticated: false,
                error: "Missing premium Firebase identity token."
            });
            return;
        }

        try {
            const verifiedUser = await verifyPremiumFirebaseIdentityToken(idToken, firebaseConfigState.config);
            const ticket = signPremiumSessionTicket(verifiedUser);

            res.json({
                ok: true,
                premiumOnly: true,
                authenticated: true,
                provider: "firebase",
                user: {
                    uid: verifiedUser.uid,
                    email: verifiedUser.email,
                    displayName: verifiedUser.displayName,
                    photoURL: verifiedUser.photoURL,
                    provider: verifiedUser.provider,
                    projectId: verifiedUser.projectId
                },
                ticket
            });
        } catch (error) {
            res.status(401).json({
                ok: false,
                premiumOnly: true,
                authenticated: false,
                error: error?.message || "Premium identity verification failed."
            });
        }
    });

    app.post("/api/premium-auth/login", (req, res) => {
        const firebaseConfigState = resolvePremiumFirebaseConfig();
        res.setHeader("Cache-Control", "no-store, max-age=0");
        res.status(405).json({
            ok: false,
            premiumOnly: true,
            authenticated: false,
            code: firebaseConfigState.configured ? "PREMIUM_AUTH_CLIENT_SIDE" : "PREMIUM_AUTH_NOT_ENABLED",
            error: firebaseConfigState.configured
                ? "Premium Firebase login is configured on the client side. Use the premium site login page rather than posting directly to this endpoint."
                : "Premium Firebase login is selected, but the production credential bundle has not been injected yet.",
            received: {
                email: typeof req.body?.email === "string" ? req.body.email.trim() : "",
                intent: typeof req.body?.intent === "string" ? req.body.intent.trim() : ""
            }
        });
    });

    app.post("/api/premium-auth/logout", (_, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        res.json({
            ok: true,
            premiumOnly: true,
            authenticated: false,
            user: null
        });
    });

    app.get(["/index.html"], redirectToCleanPath("/"));
    app.get(["/gamehub.html"], redirectToCleanPath("/gamehub"));
    app.get(["/play.html", "/new-game-renderer.html"], redirectToCleanPath("/play"));
    app.get(["/premium.html", "/premium/index.html"], redirectToCleanPath("/premium"));
    app.get(["/premium/play.html"], redirectToCleanPath("/premium/play"));
    app.get(["/premium/login.html"], redirectToCleanPath("/premium/login"));
    app.get(["/documentation.html"], redirectToCleanPath("/documentation"));
    app.get(["/legal.html"], redirectToCleanPath("/legal"));
    app.get(["/terms.html"], redirectToCleanPath("/legal/terms"));
    app.get(["/privacy.html"], redirectToCleanPath("/legal/privacy"));
    app.get(["/cookies.html"], redirectToCleanPath("/legal/cookies"));
    app.get(["/refund.html"], redirectToCleanPath("/legal/refund"));
    app.get(["/copyright.html"], redirectToCleanPath("/legal/copyright"));
    app.get(["/third-party.html"], redirectToCleanPath("/legal/third-party"));
    app.get(["/acceptable-use.html"], redirectToCleanPath("/legal/acceptable-use"));
    app.get(["/disclaimer.html"], redirectToCleanPath("/legal/disclaimer"));
    app.get(["/accessibility.html"], redirectToCleanPath("/legal/accessibility"));
    app.get(["/contact.html"], redirectToCleanPath("/legal/contact"));
    app.get(["/login.html", "/register.html"], redirectToCleanPath("/"));

    app.get(["/", "/gamehub"], (_, res) => {
        sendNoStoreFile(res, path.join(rootDir, "gamehub.html"));
    });

    app.get(["/play"], (_, res) => {
        sendNoStoreFile(res, path.join(rootDir, "new-game-renderer.html"));
    });

    app.get(["/game-renderer"], (_, res) => {
        sendNoStoreFile(res, path.join(rootDir, "game-renderer.html"));
    });

    app.get(["/premium", "/premium/"], (_, res) => {
        sendNoStoreFile(res, path.join(rootDir, "premium", "index.html"));
    });

    app.get(["/premium/play"], (_, res) => {
        sendNoStoreFile(res, path.join(rootDir, "premium", "play.html"));
    });

    app.get(["/premium/login"], (_, res) => {
        sendNoStoreFile(res, path.join(rootDir, "premium", "login.html"));
    });

    app.get(["/documentation"], (_, res) => {
        sendNoStoreFile(res, path.join(rootDir, "documentation.html"));
    });

    app.get([
        "/legal",
        "/legal/",
        "/legal/terms",
        "/legal/privacy",
        "/legal/cookies",
        "/legal/premium",
        "/legal/refund",
        "/legal/acceptable-use",
        "/legal/copyright",
        "/legal/third-party",
        "/legal/disclaimer",
        "/legal/accessibility",
        "/legal/contact"
    ], (_, res) => {
        sendNoStoreFile(res, path.join(rootDir, "legal.html"));
    });

    app.get(["/login", "/register"], (_, res) => {
        res.redirect("/");
    });

    app.use(premiumRuntimeRouter);
    app.use(createPublicFilePolicy());
    app.use(express.static(rootDir, {
        extensions: false,
        fallthrough: true,
        index: false,
        setHeaders: (res, filePath) => {
            applyCacheHeaders(res, filePath);
        }
    }));

    app.use((req, res) => {
        res.status(404).json({
            error: "Not found"
        });
    });

    app.use((error, req, res, next) => {
        console.error("Unhandled GameHub server error:", error);
        if (res.headersSent) {
            next(error);
            return;
        }

        res.status(500).json({
            error: "Internal server error"
        });
    });

    app.io = io;
    app.httpServer = httpServer;
    app.gameRegistry = gameRegistry;
    app.premiumRegistry = premiumRegistry;
    app.premiumRuntimeReady = premiumRuntimeReady;

    return { app, httpServer, io, ready: premiumRuntimeReady };
}

const { app, httpServer, io, ready } = createServer();

if (require.main === module) {
    const port = process.env.PORT || 3000;
    Promise.resolve(ready)
        .then(() => {
            httpServer.listen(port, () => {
                console.log(`GameHub server with realtime support is running at http://localhost:${port}`);
            });
        })
        .catch((error) => {
            console.error("Premium runtime initialization failed:", error);
            process.exitCode = 1;
        });
}

module.exports = app;
module.exports.app = app;
module.exports.httpServer = httpServer;
module.exports.io = io;
module.exports.ready = ready;
module.exports.createServer = createServer;
module.exports.buildGameCatalog = (rootDir, options) => buildGameCatalog(rootDir, options);
