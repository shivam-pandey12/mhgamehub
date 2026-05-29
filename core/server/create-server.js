const express = require("express");
const http = require("http");
const path = require("path");
const { Server: SocketIOServer } = require("socket.io");

const { buildGameCatalog, createGameRegistry } = require("./game-registry");
const { createPremiumRegistry } = require("./premium-registry");
const { initializePremiumRuntime } = require("./premium-runtime-loader");
const { createPublicFilePolicy } = require("./public-file-policy");
const { createRealtimeAdminSnapshot } = require("./realtime-admin-snapshot");
const { createRealtimeHub } = require("./realtime-hub");
const { authenticateAdminRequest, extractBearerToken } = require("./admin-guard");
const { AdminAccountsError, createAdminAccountsStore } = require("./admin-accounts-store");
const { AdminAuditError, buildAdminRequestMeta, createAdminAuditStore } = require("./admin-audit-store");
const { AnalyticsError, buildAnalyticsRequesterHash, createAnalyticsStore } = require("./analytics-store");
const { FeedbackError, buildRequesterHash, createFeedbackStore } = require("./feedback-store");
const { readPremiumFirebaseConfig } = require("./premium-auth-config");
const { verifyPremiumFirebaseIdentityToken } = require("./premium-firebase-token-verifier");
const { signPremiumSessionTicket, verifyPremiumSessionTicket } = require("./premium-session-ticket");

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
    const adminAccountsStore = createAdminAccountsStore(rootDir);
    const adminAuditStore = createAdminAuditStore(rootDir);
    const analyticsStore = createAnalyticsStore(rootDir);
    const feedbackStore = createFeedbackStore(rootDir);
    const realtimeAdminSnapshot = createRealtimeAdminSnapshot({
        io,
        realtimeHub,
        premiumRuntimeReady,
        rootDir,
        startedAt: Date.now()
    });

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

    app.get("/api/admin/me", (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const result = authenticateAdminRequest(req);
        if (!result.ok) {
            res.status(result.status || 401).json({
                ok: false,
                admin: false,
                error: result.message,
                email: result.status === 403 ? result.email || "" : undefined
            });
            return;
        }

        res.json({
            ok: true,
            admin: true,
            email: result.email
        });
    });

    app.post("/api/feedback", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");

        try {
            const token = extractBearerToken(req);
            let verifiedSession = null;
            if (token) {
                try {
                    verifiedSession = verifyPremiumSessionTicket(token);
                } catch (_) {
                    // Feedback can stay anonymous when an optional premium ticket is stale.
                }
            }
            const anonymousSessionId = typeof req.body?.anonymousSessionId === "string" ? req.body.anonymousSessionId : "";
            const item = await feedbackStore.create(req.body || {}, {
                req,
                verifiedSession,
                requestKeyHash: buildRequesterHash(req, anonymousSessionId),
                userAgent: req.headers["user-agent"] || ""
            });

            res.status(201).json({
                ok: true,
                id: item.id
            });
        } catch (error) {
            const status = error instanceof FeedbackError ? error.status : 500;
            if (!(error instanceof FeedbackError)) {
                console.error("Feedback submission failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not send feedback. Please try again.",
                code: error?.code || "FEEDBACK_ERROR"
            });
        }
    });

    app.post(["/api/analytics/event", "/api/signals/event"], async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");

        try {
            const token = extractBearerToken(req);
            let verifiedSession = null;
            if (token) {
                try {
                    verifiedSession = verifyPremiumSessionTicket(token);
                } catch (_) {
                    // Analytics remains anonymous when an optional premium ticket is stale.
                }
            }

            const anonymousSessionId = typeof req.body?.anonymousSessionId === "string" ? req.body.anonymousSessionId : "";
            const result = await analyticsStore.recordEvent(req.body || {}, {
                req,
                verifiedSession,
                requestKeyHash: buildAnalyticsRequesterHash(req, anonymousSessionId),
                userAgent: req.headers["user-agent"] || ""
            });

            res.json({
                ok: true,
                ignored: result?.ignored === true
            });
        } catch (error) {
            const status = error instanceof AnalyticsError ? error.status : 500;
            if (!(error instanceof AnalyticsError)) {
                console.error("Analytics event failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not record analytics event.",
                code: error?.code || "ANALYTICS_ERROR"
            });
        }
    });

    app.get("/api/admin/analytics/overview", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            res.status(admin.status || 401).json({
                ok: false,
                admin: false,
                error: admin.message
            });
            return;
        }

        try {
            const overview = await analyticsStore.getOverview();
            res.json({
                ok: true,
                ...overview
            });
        } catch (error) {
            const status = error instanceof AnalyticsError ? error.status : 500;
            if (!(error instanceof AnalyticsError)) {
                console.error("Admin analytics overview failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not load analytics overview.",
                code: error?.code || "ADMIN_ANALYTICS_OVERVIEW_ERROR"
            });
        }
    });

    app.get("/api/admin/analytics/games", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            res.status(admin.status || 401).json({
                ok: false,
                admin: false,
                error: admin.message
            });
            return;
        }

        try {
            const result = await analyticsStore.listGames({
                sort: req.query.sort,
                limit: req.query.limit
            });
            res.json({
                ok: true,
                items: result.items,
                storageMode: result.storageMode
            });
        } catch (error) {
            const status = error instanceof AnalyticsError ? error.status : 500;
            if (!(error instanceof AnalyticsError)) {
                console.error("Admin analytics games failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not load game analytics.",
                code: error?.code || "ADMIN_ANALYTICS_GAMES_ERROR"
            });
        }
    });

    app.get("/api/admin/analytics/events", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            res.status(admin.status || 401).json({
                ok: false,
                admin: false,
                error: admin.message
            });
            return;
        }

        try {
            const result = await analyticsStore.listEvents({
                eventType: req.query.eventType,
                gameSlug: req.query.gameSlug,
                source: req.query.source,
                limit: req.query.limit,
                cursor: req.query.cursor
            });
            res.json({
                ok: true,
                items: result.items,
                nextCursor: result.nextCursor || null,
                storageMode: result.storageMode
            });
        } catch (error) {
            const status = error instanceof AnalyticsError ? error.status : 500;
            if (!(error instanceof AnalyticsError)) {
                console.error("Admin analytics events failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not load analytics events.",
                code: error?.code || "ADMIN_ANALYTICS_EVENTS_ERROR"
            });
        }
    });

    app.get("/api/admin/audit-logs", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            res.status(admin.status || 401).json({
                ok: false,
                admin: false,
                error: admin.message
            });
            return;
        }

        try {
            const result = await adminAuditStore.list({
                action: req.query.action,
                targetType: req.query.targetType,
                targetEmail: req.query.targetEmail,
                adminEmail: req.query.adminEmail,
                limit: req.query.limit,
                cursor: req.query.cursor
            });
            res.json({
                ok: true,
                items: result.items,
                nextCursor: result.nextCursor || null,
                storageMode: result.storageMode
            });
        } catch (error) {
            const status = error instanceof AdminAuditError ? error.status : 500;
            if (!(error instanceof AdminAuditError)) {
                console.error("Admin audit list failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not load admin audit logs.",
                code: error?.code || "ADMIN_AUDIT_LIST_ERROR"
            });
        }
    });

    app.get("/api/admin/realtime/overview", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            res.status(admin.status || 401).json({
                ok: false,
                admin: false,
                error: admin.message
            });
            return;
        }

        try {
            res.json(await realtimeAdminSnapshot.getOverview());
        } catch (error) {
            console.error("Admin realtime overview failed:", error);
            res.status(500).json({
                ok: false,
                error: "Could not load realtime overview.",
                code: "ADMIN_REALTIME_OVERVIEW_ERROR"
            });
        }
    });

    app.get("/api/admin/realtime/rooms", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            res.status(admin.status || 401).json({
                ok: false,
                admin: false,
                error: admin.message
            });
            return;
        }

        try {
            res.json(await realtimeAdminSnapshot.listRooms({
                gameSlug: req.query.gameSlug,
                type: req.query.type,
                status: req.query.status,
                limit: req.query.limit
            }));
        } catch (error) {
            console.error("Admin realtime rooms failed:", error);
            res.status(500).json({
                ok: false,
                error: "Could not load realtime rooms.",
                code: "ADMIN_REALTIME_ROOMS_ERROR"
            });
        }
    });

    app.get("/api/admin/realtime/queues", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            res.status(admin.status || 401).json({
                ok: false,
                admin: false,
                error: admin.message
            });
            return;
        }

        try {
            res.json(await realtimeAdminSnapshot.listQueues());
        } catch (error) {
            console.error("Admin realtime queues failed:", error);
            res.status(500).json({
                ok: false,
                error: "Could not load realtime queues.",
                code: "ADMIN_REALTIME_QUEUES_ERROR"
            });
        }
    });

    app.get("/api/admin/system/health", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            res.status(admin.status || 401).json({
                ok: false,
                admin: false,
                error: admin.message
            });
            return;
        }

        try {
            res.json(realtimeAdminSnapshot.getSystemHealth());
        } catch (error) {
            console.error("Admin system health failed:", error);
            res.status(500).json({
                ok: false,
                error: "Could not load system health.",
                code: "ADMIN_SYSTEM_HEALTH_ERROR"
            });
        }
    });

    app.get("/api/admin/system/logs", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            res.status(admin.status || 401).json({
                ok: false,
                admin: false,
                error: admin.message
            });
            return;
        }

        try {
            res.json(realtimeAdminSnapshot.listSystemLogs());
        } catch (error) {
            console.error("Admin system logs failed:", error);
            res.status(500).json({
                ok: false,
                error: "Could not load system logs.",
                code: "ADMIN_SYSTEM_LOGS_ERROR"
            });
        }
    });

    app.get("/api/admin/users/overview", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            res.status(admin.status || 401).json({
                ok: false,
                admin: false,
                error: admin.message
            });
            return;
        }

        try {
            const overview = await adminAccountsStore.getOverview();
            res.json({
                ok: true,
                ...overview
            });
        } catch (error) {
            const status = error instanceof AdminAccountsError ? error.status : 500;
            if (!(error instanceof AdminAccountsError)) {
                console.error("Admin users overview failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not load users overview.",
                code: error?.code || "ADMIN_USERS_OVERVIEW_ERROR"
            });
        }
    });

    app.get("/api/admin/users", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            res.status(admin.status || 401).json({
                ok: false,
                admin: false,
                error: admin.message
            });
            return;
        }

        try {
            const result = await adminAccountsStore.listUsers({
                search: req.query.search,
                plan: req.query.plan,
                status: req.query.status,
                limit: req.query.limit,
                cursor: req.query.cursor
            });
            res.json({
                ok: true,
                items: result.items,
                nextCursor: result.nextCursor || null,
                dataConnected: result.dataConnected !== false,
                storageMode: result.storageMode
            });
        } catch (error) {
            const status = error instanceof AdminAccountsError ? error.status : 500;
            if (!(error instanceof AdminAccountsError)) {
                console.error("Admin users list failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not load users.",
                code: error?.code || "ADMIN_USERS_LIST_ERROR"
            });
        }
    });

    app.get("/api/admin/users/:id", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            res.status(admin.status || 401).json({
                ok: false,
                admin: false,
                error: admin.message
            });
            return;
        }

        try {
            const result = await adminAccountsStore.getUser(req.params.id);
            res.json({
                ok: true,
                user: result.user || null,
                dataConnected: result.dataConnected !== false,
                storageMode: result.storageMode
            });
        } catch (error) {
            const status = error instanceof AdminAccountsError ? error.status : 500;
            if (!(error instanceof AdminAccountsError)) {
                console.error("Admin user detail failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not load user detail.",
                code: error?.code || "ADMIN_USER_DETAIL_ERROR"
            });
        }
    });

    app.get("/api/admin/entitlements/types", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            res.status(admin.status || 401).json({
                ok: false,
                admin: false,
                error: admin.message
            });
            return;
        }

        try {
            const result = await adminAccountsStore.listEntitlementTypes();
            res.json({
                ok: true,
                items: result.items,
                dataConnected: result.dataConnected !== false,
                storageMode: result.storageMode
            });
        } catch (error) {
            const status = error instanceof AdminAccountsError ? error.status : 500;
            if (!(error instanceof AdminAccountsError)) {
                console.error("Admin entitlement types failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not load entitlement types.",
                code: error?.code || "ADMIN_ENTITLEMENT_TYPES_ERROR"
            });
        }
    });

    app.get("/api/admin/entitlements", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            res.status(admin.status || 401).json({
                ok: false,
                admin: false,
                error: admin.message
            });
            return;
        }

        try {
            const result = await adminAccountsStore.listEntitlements({
                search: req.query.search,
                status: req.query.status,
                type: req.query.type,
                limit: req.query.limit,
                cursor: req.query.cursor
            });
            res.json({
                ok: true,
                items: result.items,
                nextCursor: result.nextCursor || null,
                dataConnected: result.dataConnected !== false,
                storageMode: result.storageMode
            });
        } catch (error) {
            const status = error instanceof AdminAccountsError ? error.status : 500;
            if (!(error instanceof AdminAccountsError)) {
                console.error("Admin entitlements list failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not load entitlements.",
                code: error?.code || "ADMIN_ENTITLEMENTS_LIST_ERROR"
            });
        }
    });

    app.get("/api/admin/owned-items", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            res.status(admin.status || 401).json({
                ok: false,
                admin: false,
                error: admin.message
            });
            return;
        }

        try {
            const result = await adminAccountsStore.listOwnedItems({
                search: req.query.search,
                limit: req.query.limit,
                cursor: req.query.cursor
            });
            res.json({
                ok: true,
                items: result.items,
                nextCursor: result.nextCursor || null,
                dataConnected: result.dataConnected !== false,
                storageMode: result.storageMode
            });
        } catch (error) {
            const status = error instanceof AdminAccountsError ? error.status : 500;
            if (!(error instanceof AdminAccountsError)) {
                console.error("Admin owned items list failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not load owned items.",
                code: error?.code || "ADMIN_OWNED_ITEMS_LIST_ERROR"
            });
        }
    });

    app.post("/api/admin/entitlements/grant", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            res.status(admin.status || 401).json({
                ok: false,
                admin: false,
                error: admin.message
            });
            return;
        }

        try {
            await adminAuditStore.ensureAvailable();
            const result = await adminAccountsStore.grantEntitlement(req.body || {}, {
                adminEmail: admin.email
            });
            await adminAuditStore.create({
                adminEmail: admin.email,
                action: "entitlement.grant",
                targetType: "entitlement",
                targetId: result.item?.id,
                targetEmail: result.item?.email,
                before: result.before,
                after: result.after,
                reason: result.reason
            }, {
                requestMeta: buildAdminRequestMeta(req)
            });
            res.status(201).json({
                ok: true,
                item: result.item,
                storageMode: result.storageMode
            });
        } catch (error) {
            const status = error instanceof AdminAccountsError || error instanceof AdminAuditError ? error.status : 500;
            if (!(error instanceof AdminAccountsError) && !(error instanceof AdminAuditError)) {
                console.error("Admin entitlement grant failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not grant entitlement.",
                code: error?.code || "ADMIN_ENTITLEMENT_GRANT_ERROR"
            });
        }
    });

    app.patch("/api/admin/entitlements/:id/revoke", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            res.status(admin.status || 401).json({
                ok: false,
                admin: false,
                error: admin.message
            });
            return;
        }

        try {
            await adminAuditStore.ensureAvailable();
            const result = await adminAccountsStore.revokeEntitlement(req.params.id, req.body || {}, {
                adminEmail: admin.email
            });
            await adminAuditStore.create({
                adminEmail: admin.email,
                action: "entitlement.revoke",
                targetType: "entitlement",
                targetId: result.item?.id,
                targetEmail: result.item?.email,
                before: result.before,
                after: result.after,
                reason: result.reason
            }, {
                requestMeta: buildAdminRequestMeta(req)
            });
            res.json({
                ok: true,
                item: result.item,
                storageMode: result.storageMode
            });
        } catch (error) {
            const status = error instanceof AdminAccountsError || error instanceof AdminAuditError ? error.status : 500;
            if (!(error instanceof AdminAccountsError) && !(error instanceof AdminAuditError)) {
                console.error("Admin entitlement revoke failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not revoke entitlement.",
                code: error?.code || "ADMIN_ENTITLEMENT_REVOKE_ERROR"
            });
        }
    });

    app.patch("/api/admin/entitlements/:id/extend", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            res.status(admin.status || 401).json({
                ok: false,
                admin: false,
                error: admin.message
            });
            return;
        }

        try {
            await adminAuditStore.ensureAvailable();
            const result = await adminAccountsStore.extendEntitlement(req.params.id, req.body || {}, {
                adminEmail: admin.email
            });
            await adminAuditStore.create({
                adminEmail: admin.email,
                action: "entitlement.extend",
                targetType: "entitlement",
                targetId: result.item?.id,
                targetEmail: result.item?.email,
                before: result.before,
                after: result.after,
                reason: result.reason
            }, {
                requestMeta: buildAdminRequestMeta(req)
            });
            res.json({
                ok: true,
                item: result.item,
                storageMode: result.storageMode
            });
        } catch (error) {
            const status = error instanceof AdminAccountsError || error instanceof AdminAuditError ? error.status : 500;
            if (!(error instanceof AdminAccountsError) && !(error instanceof AdminAuditError)) {
                console.error("Admin entitlement extend failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not extend entitlement.",
                code: error?.code || "ADMIN_ENTITLEMENT_EXTEND_ERROR"
            });
        }
    });

    app.patch("/api/admin/entitlements/:id/note", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            res.status(admin.status || 401).json({
                ok: false,
                admin: false,
                error: admin.message
            });
            return;
        }

        try {
            await adminAuditStore.ensureAvailable();
            const result = await adminAccountsStore.updateEntitlementNote(req.params.id, req.body || {}, {
                adminEmail: admin.email
            });
            await adminAuditStore.create({
                adminEmail: admin.email,
                action: "entitlement.note_update",
                targetType: "entitlement",
                targetId: result.item?.id,
                targetEmail: result.item?.email,
                before: result.before,
                after: result.after,
                reason: result.reason
            }, {
                requestMeta: buildAdminRequestMeta(req)
            });
            res.json({
                ok: true,
                item: result.item,
                storageMode: result.storageMode
            });
        } catch (error) {
            const status = error instanceof AdminAccountsError || error instanceof AdminAuditError ? error.status : 500;
            if (!(error instanceof AdminAccountsError) && !(error instanceof AdminAuditError)) {
                console.error("Admin entitlement note update failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not update entitlement note.",
                code: error?.code || "ADMIN_ENTITLEMENT_NOTE_ERROR"
            });
        }
    });

    app.get("/api/admin/payments", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            res.status(admin.status || 401).json({
                ok: false,
                admin: false,
                error: admin.message
            });
            return;
        }

        res.status(501).json({
            ok: false,
            disabled: true,
            items: [],
            ownedItems: [],
            nextCursor: null,
            error: "Payments are not connected in the current GameHub build.",
            code: "ADMIN_PAYMENTS_NOT_CONNECTED"
        });
    });

    app.get("/api/admin/feedback", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            res.status(admin.status || 401).json({
                ok: false,
                admin: false,
                error: admin.message
            });
            return;
        }

        try {
            const result = await feedbackStore.list({
                status: req.query.status,
                type: req.query.type,
                gameSlug: req.query.gameSlug,
                search: req.query.search,
                limit: req.query.limit,
                cursor: req.query.cursor
            });
            res.json({
                ok: true,
                items: result.items,
                nextCursor: result.nextCursor || null,
                summary: result.summary,
                storageMode: result.storageMode
            });
        } catch (error) {
            const status = error instanceof FeedbackError ? error.status : 500;
            if (!(error instanceof FeedbackError)) {
                console.error("Admin feedback list failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not load feedback.",
                code: error?.code || "ADMIN_FEEDBACK_ERROR"
            });
        }
    });

    app.patch("/api/admin/feedback/:id", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            res.status(admin.status || 401).json({
                ok: false,
                admin: false,
                error: admin.message
            });
            return;
        }

        try {
            await adminAuditStore.ensureAvailable();
            const before = await feedbackStore.get(req.params.id);
            const item = await feedbackStore.update(req.params.id, req.body || {}, admin.email);
            await adminAuditStore.create({
                adminEmail: admin.email,
                action: "feedback.status_update",
                targetType: "feedback",
                targetId: item.id,
                targetEmail: item.verifiedUserEmail || item.contactEmail || null,
                before,
                after: item,
                reason: `Feedback status updated to ${item.status}.`
            }, {
                requestMeta: buildAdminRequestMeta(req)
            });
            res.json({
                ok: true,
                item
            });
        } catch (error) {
            const status = error instanceof FeedbackError || error instanceof AdminAuditError ? error.status : 500;
            if (!(error instanceof FeedbackError) && !(error instanceof AdminAuditError)) {
                console.error("Admin feedback update failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not update feedback.",
                code: error?.code || "ADMIN_FEEDBACK_UPDATE_ERROR"
            });
        }
    });

    app.get(["/index.html"], redirectToCleanPath("/"));
    app.get(["/gamehub.html"], redirectToCleanPath("/gamehub"));
    app.get(["/play.html", "/new-game-renderer.html"], redirectToCleanPath("/play"));
    app.get(["/premium.html", "/premium/index.html"], redirectToCleanPath("/premium"));
    app.get(["/premium/play.html"], redirectToCleanPath("/premium/play"));
    app.get(["/premium/login.html"], redirectToCleanPath("/premium/login"));
    app.get(["/admin.html"], redirectToCleanPath("/admin"));
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

    app.get(["/admin", "/admin/"], (_, res) => {
        sendNoStoreFile(res, path.join(rootDir, "admin.html"));
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

    app.get("/signals-client.js", (_, res) => {
        sendNoStoreFile(res, path.join(rootDir, "analytics-client.js"));
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
    app.realtimeAdminSnapshot = realtimeAdminSnapshot;

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
