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
const { CatalogOperationsError, createCatalogOperationsStore, mergeCatalogGames, safeAdminGame } = require("./catalog-operations-store");
const { FeedbackError, buildRequesterHash, createFeedbackStore } = require("./feedback-store");
const { ModerationError, createModerationStore, requireConfirmation, requireReason } = require("./moderation-store");
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
    const catalogOperationsStore = createCatalogOperationsStore(rootDir);
    const feedbackStore = createFeedbackStore(rootDir);
    const moderationStore = createModerationStore(rootDir);
    const realtimeAdminSnapshot = createRealtimeAdminSnapshot({
        io,
        realtimeHub,
        premiumRuntimeReady,
        rootDir,
        startedAt: Date.now()
    });

    app.use(applyBaselineHeaders);

    function sendAdminDenied(res, admin) {
        res.status(admin.status || 401).json({
            ok: false,
            admin: false,
            error: admin.message
        });
    }

    function adminErrorStatus(error) {
        if (error instanceof ModerationError
            || error instanceof AdminAuditError
            || error instanceof CatalogOperationsError
            || error instanceof FeedbackError) {
            return error.status;
        }
        const status = Number(error?.status);
        return Number.isFinite(status) ? status : 500;
    }

    function feedbackModerationAction(status) {
        const normalized = String(status || "").trim().toLowerCase();
        if (normalized === "moderation_review") {
            return "feedback.mark_moderation";
        }
        if (normalized === "spam") {
            return "feedback.mark_spam";
        }
        if (normalized === "resolved") {
            return "feedback.mark_resolved";
        }
        if (normalized === "ignored") {
            return "feedback.mark_ignored";
        }
        throw new ModerationError(400, "INVALID_MODERATION_FEEDBACK_STATUS", "Invalid moderation feedback status.");
    }

    async function readCatalogOperationsState() {
        try {
            return await catalogOperationsStore.readPublicState();
        } catch (error) {
            if (!IS_PRODUCTION) {
                console.warn("Catalog operations public state unavailable:", error?.message || error);
            }
            return {
                overrides: [],
                featureFlags: [],
                config: {},
                storageMode: "disabled",
                publicConfig: {
                    ok: true,
                    config: {
                        globalBannerEnabled: false,
                        globalBannerMessage: "",
                        globalMaintenanceMode: false,
                        globalMaintenanceMessage: ""
                    },
                    featureFlags: {
                        feedback_enabled: true,
                        analytics_enabled: true,
                        show_updated_labels: true,
                        show_featured_section: true,
                        realtime_monitoring_enabled: true,
                        maintenance_banner_enabled: true
                    }
                }
            };
        }
    }

    async function listCatalogWithOperations(catalog, options = {}) {
        const baseGames = catalog === "premium"
            ? await premiumRegistry.listGames({ force: options.force === true })
            : await gameRegistry.listGames({ force: options.force === true });
        const state = options.state || await readCatalogOperationsState();
        return mergeCatalogGames(baseGames, state.overrides || [], catalog, {
            includeUnavailable: options.includeUnavailable === true
        });
    }

    async function listAllCatalogGames(options = {}) {
        const state = options.state || await readCatalogOperationsState();
        const [publicGames, premiumGames] = await Promise.all([
            listCatalogWithOperations("public", { ...options, state, includeUnavailable: true }),
            listCatalogWithOperations("premium", { ...options, state, includeUnavailable: true })
        ]);
        return { publicGames, premiumGames, allGames: [...publicGames, ...premiumGames], state };
    }

    async function resolveCatalogGame(slug, catalogHint = "", options = {}) {
        const safeSlug = String(slug || "").trim().toLowerCase();
        const normalizedCatalog = String(catalogHint || "").trim().toLowerCase();
        const { publicGames, premiumGames, state } = await listAllCatalogGames(options);
        const matches = [];
        const publicGame = publicGames.find((game) => game.id === safeSlug);
        const premiumGame = premiumGames.find((game) => game.id === safeSlug);
        if (publicGame) {
            matches.push({ catalog: "public", game: publicGame });
        }
        if (premiumGame) {
            matches.push({ catalog: "premium", game: premiumGame });
        }
        if (normalizedCatalog) {
            const match = matches.find((entry) => entry.catalog === normalizedCatalog);
            if (!match) {
                throw new CatalogOperationsError(404, "CATALOG_GAME_NOT_FOUND", "Catalog game was not found.");
            }
            return { ...match, state };
        }
        if (matches.length > 1) {
            throw new CatalogOperationsError(400, "CATALOG_GAME_AMBIGUOUS", "Specify catalog=public or catalog=premium for this game.");
        }
        if (!matches.length) {
            throw new CatalogOperationsError(404, "CATALOG_GAME_NOT_FOUND", "Catalog game was not found.");
        }
        return { ...matches[0], state };
    }

    function findCatalogOverride(overrides = [], catalog, slug) {
        return (overrides || []).find((item) => item.catalog === catalog && item.gameSlug === slug) || null;
    }

    function catalogAuditTarget(catalog, slug) {
        return `${catalog}:${slug}`;
    }

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
            const state = await readCatalogOperationsState();
            const games = await listCatalogWithOperations("public", {
                force: req.query.refresh === "1",
                includeUnavailable: req.query.includeUnavailable === "1",
                state
            });
            res.json({ games, operations: state.publicConfig });
        } catch (error) {
            console.error("Failed to build games catalog:", error);
            res.status(500).json({ error: "Failed to build games catalog" });
        }
    });

    app.get("/api/operations/config", async (_, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const state = await readCatalogOperationsState();
        res.json(state.publicConfig);
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
            const state = await readCatalogOperationsState();
            const games = await listCatalogWithOperations("premium", {
                force: req.query.refresh === "1",
                includeUnavailable: req.query.includeUnavailable === "1",
                state
            });
            res.json({ games, operations: state.publicConfig });
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
            try {
                const restriction = await moderationStore.findActiveFeedbackRestriction({
                    verifiedUserEmail: verifiedSession?.email || "",
                    anonymousSessionId
                });
                if (restriction) {
                    res.status(429).json({
                        ok: false,
                        error: "Feedback is temporarily limited for this session.",
                        code: "FEEDBACK_TEMPORARILY_LIMITED"
                    });
                    return;
                }
            } catch (restrictionError) {
                console.warn("Feedback moderation restriction check skipped:", restrictionError?.message || restrictionError);
            }
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

    async function buildAdminCatalogContext(options = {}) {
        const state = await readCatalogOperationsState();
        const [basePublic, basePremium, analyticsResult, feedbackResult] = await Promise.all([
            gameRegistry.listGames({ force: options.force === true }),
            premiumRegistry.listGames({ force: options.force === true }),
            analyticsStore.listGames({ sort: "views", limit: 100 }).catch(() => ({ items: [] })),
            feedbackStore.list({ limit: 100 }).catch(() => ({ items: [] }))
        ]);
        const analyticsMap = new Map((analyticsResult.items || []).map((item) => [item.gameSlug, item]));
        const feedbackMap = new Map();
        (feedbackResult.items || []).forEach((item) => {
            const slug = item.gameSlug || "";
            if (!slug) {
                return;
            }
            const summary = feedbackMap.get(slug) || { total: 0, openBugs: 0, reports: 0 };
            summary.total += 1;
            if (item.type === "bug" && (item.status === "open" || item.status === "moderation_review")) {
                summary.openBugs += 1;
            }
            if (item.type === "report") {
                summary.reports += 1;
            }
            feedbackMap.set(slug, summary);
        });
        const publicItems = basePublic.map((game) => safeAdminGame(
            game,
            findCatalogOverride(state.overrides, "public", game.id),
            "public",
            analyticsMap.get(game.id) || null,
            feedbackMap.get(game.id) || null
        ));
        const premiumItems = basePremium.map((game) => safeAdminGame(
            game,
            findCatalogOverride(state.overrides, "premium", game.id),
            "premium",
            analyticsMap.get(game.id) || null,
            feedbackMap.get(game.id) || null
        ));
        return {
            state,
            items: [...publicItems, ...premiumItems]
        };
    }

    function filterAdminCatalogItems(items = [], query = {}) {
        const search = String(query.search || "").trim().toLowerCase();
        const catalog = String(query.catalog || "").trim().toLowerCase();
        const category = String(query.category || "").trim().toLowerCase();
        const visibility = String(query.visibility || "").trim().toLowerCase();
        const status = String(query.status || "").trim().toLowerCase();
        const featured = String(query.featured || "").trim().toLowerCase();
        const limit = Math.min(Math.max(Number(query.limit) || 100, 1), 300);
        return items
            .filter((item) => {
                if (catalog && item.catalog !== catalog) {
                    return false;
                }
                if (category && String(item.category || "").toLowerCase() !== category) {
                    return false;
                }
                if (visibility && item.visibility !== visibility) {
                    return false;
                }
                if (featured === "true" && item.featured !== true) {
                    return false;
                }
                if (featured === "false" && item.featured === true) {
                    return false;
                }
                if (status === "launch_disabled" && item.launchDisabled !== true) {
                    return false;
                }
                if (status === "labeled" && !(item.featured || item.newLabel || item.updatedLabel || item.trendingLabel)) {
                    return false;
                }
                if (search) {
                    const haystack = [
                        item.title,
                        item.slug,
                        item.catalog,
                        item.category,
                        item.route,
                        item.adminNote
                    ].join(" ").toLowerCase();
                    if (!haystack.includes(search)) {
                        return false;
                    }
                }
                return true;
            })
            .sort((left, right) => {
                const priorityDelta = Number(right.priority || 0) - Number(left.priority || 0);
                if (priorityDelta) {
                    return priorityDelta;
                }
                return String(left.title || left.slug).localeCompare(String(right.title || right.slug));
            })
            .slice(0, limit);
    }

    async function auditCatalogOperation({ admin, req, action, targetType = "catalog_game", catalog, slug, before, after, reason }) {
        await adminAuditStore.create({
            adminEmail: admin.email,
            action,
            targetType,
            targetId: catalog && slug ? catalogAuditTarget(catalog, slug) : slug,
            before,
            after,
            reason
        }, {
            requestMeta: buildAdminRequestMeta(req)
        });
    }

    app.get("/api/admin/catalog/overview", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            sendAdminDenied(res, admin);
            return;
        }

        try {
            const { items, state } = await buildAdminCatalogContext({ force: req.query.refresh === "1" });
            const recentlyChanged = [...(state.overrides || [])]
                .sort((left, right) => String(right.updatedAt).localeCompare(String(left.updatedAt)))
                .slice(0, 8);
            const topGames = items
                .filter((item) => item.analyticsSummary)
                .sort((left, right) => Number(right.analyticsSummary?.totalPlays || 0) - Number(left.analyticsSummary?.totalPlays || 0))
                .slice(0, 6);
            res.json({
                ok: true,
                totals: {
                    totalGames: items.length,
                    publicGames: items.filter((item) => item.visibility === "public").length,
                    hiddenGames: items.filter((item) => item.visibility === "hidden").length,
                    comingSoonGames: items.filter((item) => item.visibility === "coming_soon").length,
                    maintenanceGames: items.filter((item) => item.visibility === "maintenance").length,
                    featuredGames: items.filter((item) => item.featured).length,
                    updatedGames: items.filter((item) => item.updatedLabel).length,
                    gamesWithOpenBugs: items.filter((item) => Number(item.feedbackSummary?.openBugs || 0) > 0).length
                },
                topGames,
                recentlyChanged,
                storageMode: state.storageMode
            });
        } catch (error) {
            const status = adminErrorStatus(error);
            if (!(error instanceof CatalogOperationsError)) {
                console.error("Admin catalog overview failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not load catalog overview.",
                code: error?.code || "ADMIN_CATALOG_OVERVIEW_ERROR"
            });
        }
    });

    app.get("/api/admin/catalog/games", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            sendAdminDenied(res, admin);
            return;
        }

        try {
            const { items, state } = await buildAdminCatalogContext({ force: req.query.refresh === "1" });
            res.json({
                ok: true,
                items: filterAdminCatalogItems(items, req.query),
                storageMode: state.storageMode
            });
        } catch (error) {
            const status = adminErrorStatus(error);
            if (!(error instanceof CatalogOperationsError)) {
                console.error("Admin catalog list failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not load catalog games.",
                code: error?.code || "ADMIN_CATALOG_LIST_ERROR"
            });
        }
    });

    app.get("/api/admin/catalog/games/:slug", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            sendAdminDenied(res, admin);
            return;
        }

        try {
            const { catalog, game, state } = await resolveCatalogGame(req.params.slug, req.query.catalog);
            const override = findCatalogOverride(state.overrides, catalog, game.id);
            const [analyticsResult, feedbackResult, moderationResult, auditResult] = await Promise.all([
                analyticsStore.listGames({ limit: 100 }).catch(() => ({ items: [] })),
                feedbackStore.list({ gameSlug: game.id, limit: 10 }).catch(() => ({ items: [], summary: null })),
                moderationStore.list({ search: game.id, limit: 10 }).catch(() => ({ items: [] })),
                adminAuditStore.list({ targetType: "catalog_game", targetEmail: catalogAuditTarget(catalog, game.id), limit: 10 }).catch(() => ({ items: [] }))
            ]);
            res.json({
                ok: true,
                game: {
                    baseMetadata: game,
                    override,
                    merged: safeAdminGame(
                        game,
                        override,
                        catalog,
                        (analyticsResult.items || []).find((item) => item.gameSlug === game.id) || null,
                        feedbackResult.summary || null
                    ),
                    analyticsSummary: (analyticsResult.items || []).find((item) => item.gameSlug === game.id) || null,
                    feedbackSummary: feedbackResult.summary || null,
                    recentFeedback: feedbackResult.items || [],
                    recentModeration: moderationResult.items || [],
                    auditHistory: auditResult.items || []
                },
                storageMode: state.storageMode
            });
        } catch (error) {
            const status = adminErrorStatus(error);
            if (!(error instanceof CatalogOperationsError)) {
                console.error("Admin catalog detail failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not load catalog game.",
                code: error?.code || "ADMIN_CATALOG_DETAIL_ERROR"
            });
        }
    });

    app.patch("/api/admin/catalog/games/:slug/visibility", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            sendAdminDenied(res, admin);
            return;
        }

        try {
            await adminAuditStore.ensureAvailable();
            await catalogOperationsStore.ensureAvailable();
            const resolved = await resolveCatalogGame(req.params.slug, req.body?.catalog || req.query.catalog, { force: true });
            const result = await catalogOperationsStore.updateVisibility({
                catalog: resolved.catalog,
                slug: resolved.game.id,
                input: req.body || {},
                adminEmail: admin.email
            });
            await auditCatalogOperation({
                admin,
                req,
                action: "catalog.visibility_update",
                catalog: resolved.catalog,
                slug: resolved.game.id,
                before: result.before,
                after: result.after,
                reason: result.reason
            });
            gameRegistry.invalidate();
            premiumRegistry.invalidate();
            res.json({ ok: true, item: result.after, storageMode: result.storageMode });
        } catch (error) {
            const status = adminErrorStatus(error);
            if (!(error instanceof CatalogOperationsError) && !(error instanceof AdminAuditError)) {
                console.error("Admin catalog visibility update failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not update catalog visibility.",
                code: error?.code || "ADMIN_CATALOG_VISIBILITY_ERROR"
            });
        }
    });

    app.patch("/api/admin/catalog/games/:slug/labels", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            sendAdminDenied(res, admin);
            return;
        }

        try {
            await adminAuditStore.ensureAvailable();
            await catalogOperationsStore.ensureAvailable();
            const resolved = await resolveCatalogGame(req.params.slug, req.body?.catalog || req.query.catalog, { force: true });
            const result = await catalogOperationsStore.updateLabels({
                catalog: resolved.catalog,
                slug: resolved.game.id,
                input: req.body || {},
                adminEmail: admin.email
            });
            await auditCatalogOperation({
                admin,
                req,
                action: "catalog.labels_update",
                catalog: resolved.catalog,
                slug: resolved.game.id,
                before: result.before,
                after: result.after,
                reason: result.reason
            });
            gameRegistry.invalidate();
            premiumRegistry.invalidate();
            res.json({ ok: true, item: result.after, storageMode: result.storageMode });
        } catch (error) {
            const status = adminErrorStatus(error);
            if (!(error instanceof CatalogOperationsError) && !(error instanceof AdminAuditError)) {
                console.error("Admin catalog labels update failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not update catalog labels.",
                code: error?.code || "ADMIN_CATALOG_LABELS_ERROR"
            });
        }
    });

    app.patch("/api/admin/catalog/games/:slug/priority", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            sendAdminDenied(res, admin);
            return;
        }

        try {
            await adminAuditStore.ensureAvailable();
            await catalogOperationsStore.ensureAvailable();
            const resolved = await resolveCatalogGame(req.params.slug, req.body?.catalog || req.query.catalog, { force: true });
            const result = await catalogOperationsStore.updatePriority({
                catalog: resolved.catalog,
                slug: resolved.game.id,
                input: req.body || {},
                adminEmail: admin.email
            });
            await auditCatalogOperation({
                admin,
                req,
                action: "catalog.priority_update",
                catalog: resolved.catalog,
                slug: resolved.game.id,
                before: result.before,
                after: result.after,
                reason: result.reason
            });
            gameRegistry.invalidate();
            premiumRegistry.invalidate();
            res.json({ ok: true, item: result.after, storageMode: result.storageMode });
        } catch (error) {
            const status = adminErrorStatus(error);
            if (!(error instanceof CatalogOperationsError) && !(error instanceof AdminAuditError)) {
                console.error("Admin catalog priority update failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not update catalog priority.",
                code: error?.code || "ADMIN_CATALOG_PRIORITY_ERROR"
            });
        }
    });

    app.patch("/api/admin/catalog/games/:slug/note", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            sendAdminDenied(res, admin);
            return;
        }

        try {
            await adminAuditStore.ensureAvailable();
            await catalogOperationsStore.ensureAvailable();
            const resolved = await resolveCatalogGame(req.params.slug, req.body?.catalog || req.query.catalog, { force: true });
            const result = await catalogOperationsStore.updateNote({
                catalog: resolved.catalog,
                slug: resolved.game.id,
                input: req.body || {},
                adminEmail: admin.email
            });
            await auditCatalogOperation({
                admin,
                req,
                action: "catalog.note_update",
                catalog: resolved.catalog,
                slug: resolved.game.id,
                before: result.before,
                after: result.after,
                reason: result.reason
            });
            res.json({ ok: true, item: result.after, storageMode: result.storageMode });
        } catch (error) {
            const status = adminErrorStatus(error);
            if (!(error instanceof CatalogOperationsError) && !(error instanceof AdminAuditError)) {
                console.error("Admin catalog note update failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not update catalog note.",
                code: error?.code || "ADMIN_CATALOG_NOTE_ERROR"
            });
        }
    });

    app.get("/api/admin/feature-flags", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            sendAdminDenied(res, admin);
            return;
        }

        try {
            const result = await catalogOperationsStore.listFeatureFlags();
            res.json({ ok: true, items: result.items, storageMode: result.storageMode });
        } catch (error) {
            const status = adminErrorStatus(error);
            if (!(error instanceof CatalogOperationsError)) {
                console.error("Admin feature flags failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not load feature flags.",
                code: error?.code || "ADMIN_FEATURE_FLAGS_ERROR"
            });
        }
    });

    app.patch("/api/admin/feature-flags/:key", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            sendAdminDenied(res, admin);
            return;
        }

        try {
            await adminAuditStore.ensureAvailable();
            await catalogOperationsStore.ensureAvailable();
            const result = await catalogOperationsStore.updateFeatureFlag(req.params.key, req.body || {}, admin.email);
            await adminAuditStore.create({
                adminEmail: admin.email,
                action: "feature_flag.update",
                targetType: "feature_flag",
                targetId: result.after.key,
                before: result.before,
                after: result.after,
                reason: result.reason
            }, {
                requestMeta: buildAdminRequestMeta(req)
            });
            res.json({ ok: true, item: result.after, storageMode: result.storageMode });
        } catch (error) {
            const status = adminErrorStatus(error);
            if (!(error instanceof CatalogOperationsError) && !(error instanceof AdminAuditError)) {
                console.error("Admin feature flag update failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not update feature flag.",
                code: error?.code || "ADMIN_FEATURE_FLAG_UPDATE_ERROR"
            });
        }
    });

    app.get("/api/admin/operations/config", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            sendAdminDenied(res, admin);
            return;
        }

        try {
            const result = await catalogOperationsStore.getConfig();
            res.json({
                ok: true,
                config: result.config,
                publicConfig: result.publicConfig,
                storageMode: result.storageMode
            });
        } catch (error) {
            const status = adminErrorStatus(error);
            if (!(error instanceof CatalogOperationsError)) {
                console.error("Admin operations config failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not load operations config.",
                code: error?.code || "ADMIN_OPERATIONS_CONFIG_ERROR"
            });
        }
    });

    app.patch("/api/admin/operations/config", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            sendAdminDenied(res, admin);
            return;
        }

        try {
            await adminAuditStore.ensureAvailable();
            await catalogOperationsStore.ensureAvailable();
            const result = await catalogOperationsStore.updateConfig(req.body || {}, admin.email);
            await adminAuditStore.create({
                adminEmail: admin.email,
                action: "operations.config_update",
                targetType: "operations_config",
                targetId: "global",
                before: result.before,
                after: result.after,
                reason: result.reason
            }, {
                requestMeta: buildAdminRequestMeta(req)
            });
            res.json({ ok: true, config: result.after, storageMode: result.storageMode });
        } catch (error) {
            const status = adminErrorStatus(error);
            if (!(error instanceof CatalogOperationsError) && !(error instanceof AdminAuditError)) {
                console.error("Admin operations config update failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not update operations config.",
                code: error?.code || "ADMIN_OPERATIONS_CONFIG_UPDATE_ERROR"
            });
        }
    });

    app.get("/api/admin/moderation/overview", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            sendAdminDenied(res, admin);
            return;
        }

        try {
            const overview = await moderationStore.getOverview();
            res.json({
                ok: true,
                ...overview
            });
        } catch (error) {
            const status = error instanceof ModerationError ? error.status : 500;
            if (!(error instanceof ModerationError)) {
                console.error("Admin moderation overview failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not load moderation overview.",
                code: error?.code || "ADMIN_MODERATION_OVERVIEW_ERROR"
            });
        }
    });

    app.get("/api/admin/moderation/records", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            sendAdminDenied(res, admin);
            return;
        }

        try {
            const result = await moderationStore.list({
                targetType: req.query.targetType,
                action: req.query.action,
                status: req.query.status,
                search: req.query.search,
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
            const status = error instanceof ModerationError ? error.status : 500;
            if (!(error instanceof ModerationError)) {
                console.error("Admin moderation records failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not load moderation records.",
                code: error?.code || "ADMIN_MODERATION_RECORDS_ERROR"
            });
        }
    });

    app.post("/api/admin/moderation/feedback/:id/mark", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            sendAdminDenied(res, admin);
            return;
        }

        try {
            await adminAuditStore.ensureAvailable();
            await moderationStore.ensureAvailable();
            const status = String(req.body?.status || "").trim().toLowerCase();
            const action = feedbackModerationAction(status);
            const reason = requireReason(req.body?.reason);
            const before = await feedbackStore.get(req.params.id);
            const item = await feedbackStore.update(req.params.id, {
                status,
                adminNote: req.body?.adminNote
            }, admin.email);
            const moderation = await moderationStore.create({
                targetType: "feedback",
                targetId: item.id,
                targetEmail: item.verifiedUserEmail || item.contactEmail || null,
                targetGameSlug: item.gameSlug,
                action,
                status,
                reason,
                adminNote: req.body?.adminNote,
                linkedFeedbackId: item.id
            }, {
                adminEmail: admin.email
            });
            const audit = await adminAuditStore.create({
                adminEmail: admin.email,
                action,
                targetType: "feedback",
                targetId: item.id,
                targetEmail: item.verifiedUserEmail || item.contactEmail || null,
                before,
                after: item,
                reason
            }, {
                requestMeta: buildAdminRequestMeta(req)
            });
            res.json({
                ok: true,
                item,
                moderation: moderation.item,
                audit
            });
        } catch (error) {
            const status = adminErrorStatus(error);
            if (!(error instanceof ModerationError) && !(error instanceof FeedbackError) && !(error instanceof AdminAuditError)) {
                console.error("Admin feedback moderation failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not update feedback moderation status.",
                code: error?.code || "ADMIN_FEEDBACK_MODERATION_ERROR"
            });
        }
    });

    app.post("/api/admin/moderation/restrictions/feedback-mute", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            sendAdminDenied(res, admin);
            return;
        }

        try {
            await adminAuditStore.ensureAvailable();
            const result = await moderationStore.createFeedbackMute(req.body || {}, {
                adminEmail: admin.email
            });
            const audit = await adminAuditStore.create({
                adminEmail: admin.email,
                action: "session.feedback_mute",
                targetType: result.item.targetType,
                targetId: result.item.targetId,
                targetEmail: result.item.targetEmail,
                before: null,
                after: result.item,
                reason: result.reason
            }, {
                requestMeta: buildAdminRequestMeta(req)
            });
            res.status(201).json({
                ok: true,
                item: result.item,
                audit,
                storageMode: result.storageMode
            });
        } catch (error) {
            const status = adminErrorStatus(error);
            if (!(error instanceof ModerationError) && !(error instanceof AdminAuditError)) {
                console.error("Admin feedback mute failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not create feedback mute.",
                code: error?.code || "ADMIN_FEEDBACK_MUTE_ERROR"
            });
        }
    });

    app.post("/api/admin/moderation/restrictions/feedback-unmute", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            sendAdminDenied(res, admin);
            return;
        }

        try {
            await adminAuditStore.ensureAvailable();
            const result = await moderationStore.endFeedbackMute(req.body || {}, {
                adminEmail: admin.email
            });
            const audit = await adminAuditStore.create({
                adminEmail: admin.email,
                action: "session.feedback_unmute",
                targetType: result.item.targetType,
                targetId: result.item.targetId,
                targetEmail: result.item.targetEmail,
                before: result.before,
                after: result.after,
                reason: result.reason
            }, {
                requestMeta: buildAdminRequestMeta(req)
            });
            res.json({
                ok: true,
                item: result.item,
                record: result.record,
                audit,
                storageMode: result.storageMode
            });
        } catch (error) {
            const status = adminErrorStatus(error);
            if (!(error instanceof ModerationError) && !(error instanceof AdminAuditError)) {
                console.error("Admin feedback unmute failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not end feedback mute.",
                code: error?.code || "ADMIN_FEEDBACK_UNMUTE_ERROR"
            });
        }
    });

    app.post("/api/admin/moderation/user-note", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            sendAdminDenied(res, admin);
            return;
        }

        try {
            await adminAuditStore.ensureAvailable();
            const result = await moderationStore.createUserNote(req.body || {}, {
                adminEmail: admin.email
            });
            const audit = await adminAuditStore.create({
                adminEmail: admin.email,
                action: result.item.action,
                targetType: result.item.targetType,
                targetId: result.item.targetId,
                targetEmail: result.item.targetEmail,
                before: null,
                after: result.item,
                reason: result.item.reason
            }, {
                requestMeta: buildAdminRequestMeta(req)
            });
            res.status(201).json({
                ok: true,
                item: result.item,
                audit,
                storageMode: result.storageMode
            });
        } catch (error) {
            const status = adminErrorStatus(error);
            if (!(error instanceof ModerationError) && !(error instanceof AdminAuditError)) {
                console.error("Admin moderation note failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not save moderation note.",
                code: error?.code || "ADMIN_MODERATION_NOTE_ERROR"
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

    app.post("/api/admin/realtime/rooms/:roomId/close", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            sendAdminDenied(res, admin);
            return;
        }

        try {
            await adminAuditStore.ensureAvailable();
            await moderationStore.ensureAvailable();
            requireConfirmation(req.body?.confirmed);
            const reason = requireReason(req.body?.reason);
            const result = await realtimeAdminSnapshot.closeRoom(req.params.roomId, {
                reason,
                notifyPlayers: req.body?.notifyPlayers !== false
            });
            const moderation = await moderationStore.create({
                targetType: "room",
                targetId: result.roomIdShort || req.params.roomId,
                targetGameSlug: result.gameSlug,
                action: "room.close",
                status: "resolved",
                reason,
                linkedRoomId: result.roomIdShort || null
            }, {
                adminEmail: admin.email
            });
            const audit = await adminAuditStore.create({
                adminEmail: admin.email,
                action: "room.close",
                targetType: "room",
                targetId: result.roomIdShort || req.params.roomId,
                before: result.before || null,
                after: result.after || result,
                reason
            }, {
                requestMeta: buildAdminRequestMeta(req)
            });
            res.json({
                ok: true,
                result,
                moderation: moderation.item,
                audit
            });
        } catch (error) {
            const status = adminErrorStatus(error) || error?.status || 500;
            if (!(error instanceof ModerationError) && !(error instanceof AdminAuditError)) {
                console.error("Admin room close failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Could not close room.",
                code: error?.code || "ADMIN_ROOM_CLOSE_ERROR"
            });
        }
    });

    app.post("/api/admin/realtime/rooms/:roomId/kick-player", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            sendAdminDenied(res, admin);
            return;
        }

        try {
            await adminAuditStore.ensureAvailable();
            await moderationStore.ensureAvailable();
            requireConfirmation(req.body?.confirmed);
            const reason = requireReason(req.body?.reason);
            const result = await realtimeAdminSnapshot.kickPlayer(req.params.roomId, req.body?.playerRef, {
                reason,
                notifyPlayer: req.body?.notifyPlayer !== false
            });
            const moderation = await moderationStore.create({
                targetType: "socket",
                targetId: result.playerIdShort || req.body?.playerRef,
                targetGameSlug: result.gameSlug,
                action: "player.kick",
                status: "resolved",
                reason,
                linkedRoomId: result.roomIdShort || null
            }, {
                adminEmail: admin.email
            });
            const audit = await adminAuditStore.create({
                adminEmail: admin.email,
                action: "player.kick",
                targetType: "socket",
                targetId: result.playerIdShort || req.body?.playerRef,
                before: result.before || null,
                after: result.after || result,
                reason
            }, {
                requestMeta: buildAdminRequestMeta(req)
            });
            res.json({
                ok: true,
                result,
                moderation: moderation.item,
                audit
            });
        } catch (error) {
            const status = adminErrorStatus(error) || error?.status || 500;
            if (!(error instanceof ModerationError) && !(error instanceof AdminAuditError)) {
                console.error("Admin player kick failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Kick is not supported for this game yet.",
                code: error?.code || "ADMIN_PLAYER_KICK_ERROR"
            });
        }
    });

    app.post("/api/admin/realtime/queues/remove-entry", async (req, res) => {
        res.setHeader("Cache-Control", "no-store, max-age=0");
        const admin = authenticateAdminRequest(req);
        if (!admin.ok) {
            sendAdminDenied(res, admin);
            return;
        }

        try {
            await adminAuditStore.ensureAvailable();
            await moderationStore.ensureAvailable();
            requireConfirmation(req.body?.confirmed);
            const reason = requireReason(req.body?.reason);
            const result = await realtimeAdminSnapshot.removeQueueEntry(req.body?.queueEntryRef, {
                reason
            });
            const moderation = await moderationStore.create({
                targetType: "queue",
                targetId: result.queueEntryIdShort || req.body?.queueEntryRef,
                targetGameSlug: result.gameSlug,
                action: "queue.remove",
                status: "resolved",
                reason
            }, {
                adminEmail: admin.email
            });
            const audit = await adminAuditStore.create({
                adminEmail: admin.email,
                action: "queue.remove",
                targetType: "queue",
                targetId: result.queueEntryIdShort || req.body?.queueEntryRef,
                before: result.before || null,
                after: result.after || result,
                reason
            }, {
                requestMeta: buildAdminRequestMeta(req)
            });
            res.json({
                ok: true,
                result,
                moderation: moderation.item,
                audit
            });
        } catch (error) {
            const status = adminErrorStatus(error) || error?.status || 500;
            if (!(error instanceof ModerationError) && !(error instanceof AdminAuditError)) {
                console.error("Admin queue remove failed:", error);
            }
            res.status(status).json({
                ok: false,
                error: error?.message || "Queue entry removal is not supported for this game yet.",
                code: error?.code || "ADMIN_QUEUE_REMOVE_ERROR"
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
