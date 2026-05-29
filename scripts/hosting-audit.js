const fs = require("fs");
const http = require("http");
const path = require("path");

const express = require("express");

const { buildGameCatalog } = require("../core/server/game-registry");
const { PREMIUM_GAME_DEFINITIONS, createPremiumRegistry } = require("../core/server/premium-registry");
const { readPremiumFirebaseConfig, resolvePremiumFirebaseCredentialsPath } = require("../core/server/premium-auth-config");
const { createPublicFilePolicy } = require("../core/server/public-file-policy");

const rootDir = path.resolve(__dirname, "..");
const failures = [];
const warnings = [];

const requiredFiles = [
    ".env.example",
    "server.js",
    "package.json",
    "package-lock.json",
    "gamehub.html",
    "admin.html",
    "admin.css",
    "admin.js",
    "admin-access.js",
    "analytics-client.js",
    "feedback.css",
    "feedback-widget.js",
    "documentation.html",
    "legal.html",
    "gamehub.js",
    "gamehub.css",
    "game-renderer.html",
    "new-game-renderer.html",
    "gamehub-socket.js",
    "games-manifest.js",
    "sitemap.xml",
    "robots.txt"
];

const requiredDirs = [
    "assets",
    "core/player",
    "core/server",
    "game-details",
    "games",
    "premium",
    "systems"
];

const premiumRuntimeFiles = [
    "premium/premium-games/3d-spaceship-race/server/multiplayerServer.js",
    "premium/premium-games/chess-codex/server/index.js",
    "premium/premium-games/handcricket/backend/server.js",
    "premium/premium-games/3d-ludo/3d-ludo-royale/server/index.js",
    "premium/premium-games/3d-snake-and-ladder/server/index.js",
    "premium/premium-games/3d-golf/server/index.js"
];

const productionPublicBrowserRoots = [
    "assets",
    "core/player",
    "systems",
    "games",
    "premium",
    "gamehub.html",
    "admin.html",
    "admin.css",
    "admin.js",
    "admin-access.js",
    "analytics-client.js",
    "signals-client.js",
    "feedback.css",
    "feedback-widget.js",
    "gamehub.js",
    "gamehub.css",
    "game-renderer.html",
    "new-game-renderer.html",
    "gamehub-socket.js",
    "games-manifest.js",
    "sitemap.xml",
    "robots.txt",
    "documentation.html",
    "legal.html"
];

const productionServerOnlyRoots = [
    "server.js",
    "core/server",
    "game-details",
    "models",
    "premium/premium-games/**/server",
    "premium/premium-games/**/backend"
];

const localOnlyExamples = [
    "node_modules",
    ".env",
    "*.env",
    "firebase_credentials",
    "premium/firebase_credentials/config.js",
    "premium/firebase_credentials/serviceAccount.json",
    "serviceAccount*.json",
    "logs",
    ".vite",
    ".cache",
    "coverage",
    ".codex-verify",
    ".gamehub-data",
    "premium/premium-games/**/server/data",
    "premium/premium-games/**/backend/data"
];

const routeSmokeChecks = [
    { route: "/", expected: 200 },
    { route: "/gamehub", expected: 200 },
    { route: "/play", expected: 200 },
    { route: "/premium", expected: 200 },
    { route: "/premium/login", expected: 200 },
    { route: "/admin", expected: 200 },
    { route: "/analytics-client.js", expected: 200 },
    { route: "/signals-client.js", expected: 200 },
    { route: "/feedback.css", expected: 200 },
    { route: "/feedback-widget.js", expected: 200 },
    { route: "/game-renderer", expected: 200 },
    { route: "/game-renderer.html", expected: 200 },
    { route: "/api/health", expected: 200 },
    { route: "/api/analytics/event", method: "POST", expected: 400 },
    { route: "/api/signals/event", method: "POST", expected: 400 },
    { route: "/api/operations/config", expected: 200 },
    { route: "/api/admin/me", expected: 401 },
    { route: "/api/admin/catalog/overview", expected: 401 },
    { route: "/api/admin/catalog/games", expected: 401 },
    { route: "/api/admin/catalog/games/local-smoke", expected: 401 },
    { route: "/api/admin/catalog/games/local-smoke/visibility", method: "PATCH", expected: 401 },
    { route: "/api/admin/catalog/games/local-smoke/labels", method: "PATCH", expected: 401 },
    { route: "/api/admin/catalog/games/local-smoke/priority", method: "PATCH", expected: 401 },
    { route: "/api/admin/catalog/games/local-smoke/note", method: "PATCH", expected: 401 },
    { route: "/api/admin/feature-flags", expected: 401 },
    { route: "/api/admin/feature-flags/feedback_enabled", method: "PATCH", expected: 401 },
    { route: "/api/admin/operations/config", expected: 401 },
    { route: "/api/admin/operations/config", method: "PATCH", expected: 401 },
    { route: "/api/admin/analytics/overview", expected: 401 },
    { route: "/api/admin/analytics/games", expected: 401 },
    { route: "/api/admin/analytics/events", expected: 401 },
    { route: "/api/admin/audit-logs", expected: 401 },
    { route: "/api/admin/moderation/overview", expected: 401 },
    { route: "/api/admin/moderation/records", expected: 401 },
    { route: "/api/admin/moderation/feedback/local-smoke/mark", method: "POST", expected: 401 },
    { route: "/api/admin/moderation/restrictions/feedback-mute", method: "POST", expected: 401 },
    { route: "/api/admin/moderation/restrictions/feedback-unmute", method: "POST", expected: 401 },
    { route: "/api/admin/moderation/user-note", method: "POST", expected: 401 },
    { route: "/api/admin/realtime/overview", expected: 401 },
    { route: "/api/admin/realtime/rooms", expected: 401 },
    { route: "/api/admin/realtime/queues", expected: 401 },
    { route: "/api/admin/realtime/rooms/local-smoke/close", method: "POST", expected: 401 },
    { route: "/api/admin/realtime/rooms/local-smoke/kick-player", method: "POST", expected: 401 },
    { route: "/api/admin/realtime/queues/remove-entry", method: "POST", expected: 401 },
    { route: "/api/admin/system/health", expected: 401 },
    { route: "/api/admin/system/logs", expected: 401 },
    { route: "/api/admin/users/overview", expected: 401 },
    { route: "/api/admin/users", expected: 401 },
    { route: "/api/admin/users/local-smoke", expected: 401 },
    { route: "/api/admin/entitlements", expected: 401 },
    { route: "/api/admin/entitlements/types", expected: 401 },
    { route: "/api/admin/owned-items", expected: 401 },
    { route: "/api/admin/entitlements/grant", method: "POST", expected: 401 },
    { route: "/api/admin/entitlements/entitlements%3Alocal-smoke/revoke", method: "PATCH", expected: 401 },
    { route: "/api/admin/entitlements/entitlements%3Alocal-smoke/extend", method: "PATCH", expected: 401 },
    { route: "/api/admin/entitlements/entitlements%3Alocal-smoke/note", method: "PATCH", expected: 401 },
    { route: "/api/admin/payments", expected: 401 },
    { route: "/api/admin/feedback", expected: 401 },
    { route: "/api/games-catalog", expected: 200 },
    { route: "/api/premium-games-catalog", expected: 200 },
    { route: "/sitemap.xml", expected: 200 },
    { route: "/robots.txt", expected: 200 },
    { route: "/socket.io/socket.io.js", expected: 200 },
    { route: "/api/premium-runtime/spaceship-race/health", expected: 200, optional: true },
    { route: "/api/premium-runtime/chess/health", expected: 200, optional: true },
    { route: "/api/premium-runtime/handcricket/health", expected: 200, optional: true },
    { route: "/api/premium-runtime/ludo/health", expected: 200, optional: true },
    { route: "/api/premium-runtime/snake-ladder/health", expected: 200, optional: true },
    { route: "/api/premium-runtime/golf/health", expected: 200, optional: true }
];

const privateRouteChecks = [
    "/.env",
    "/firebase_credentials/config.js",
    "/premium/firebase_credentials",
    "/premium/firebase_credentials/config.js",
    "/premium/firebase_credentials/serviceAccount.json",
    "/serviceAccount.json",
    "/models/User.js",
    "/game-details/2048.json",
    "/core/server/create-server.js",
    "/node_modules/express/package.json",
    "/.vite/deps/main.js",
    "/.cache/runtime.json",
    "/coverage/index.html",
    "/.gamehub-data/analytics.json",
    "/.gamehub-data/feedback-reports.json",
    "/.gamehub-data/admin-audit-logs.json",
    "/.gamehub-data/admin-entitlements.json",
    "/.gamehub-data/moderation-records.json",
    "/.gamehub-data/catalog-operations.json",
    "/logs/app.log",
    "/premium/premium-games/handcricket/backend/server.js",
    "/premium/premium-games/3d-spaceship-race/firebase%20credentials"
];

function relPath(...segments) {
    return path.join(rootDir, ...segments);
}

function fileExists(relativePath) {
    return fs.existsSync(relPath(relativePath));
}

function assertFile(relativePath) {
    if (!fileExists(relativePath) || !fs.statSync(relPath(relativePath)).isFile()) {
        failures.push(`Missing required file: ${relativePath}`);
    }
}

function assertDir(relativePath) {
    if (!fileExists(relativePath) || !fs.statSync(relPath(relativePath)).isDirectory()) {
        failures.push(`Missing required directory: ${relativePath}`);
    }
}

function encodeRoute(relativePath) {
    const normalized = String(relativePath || "")
        .replace(/\\/g, "/")
        .replace(/^\/+/, "");

    return `/${normalized.split("/").map(encodeURIComponent).join("/")}`;
}

function summarizeList(items, limit = 8) {
    if (items.length <= limit) {
        return items.join(", ");
    }

    return `${items.slice(0, limit).join(", ")} and ${items.length - limit} more`;
}

function relativePortable(absolutePath) {
    return path.relative(rootDir, absolutePath).replace(/\\/g, "/") || ".";
}

function isGeneratedOrPrivateDirName(name) {
    return [
        "node_modules",
        "logs",
        ".vite",
        ".cache",
        "coverage",
        ".codex-verify",
        ".gamehub-data",
        "firebase_credentials",
        "firebase credentials"
    ].includes(String(name || "").toLowerCase());
}

function isLocalOnlyFileName(name) {
    const lowerName = String(name || "").toLowerCase();
    if (lowerName === ".env.example") {
        return false;
    }

    return (
        lowerName === ".env" ||
        lowerName.startsWith(".env.") ||
        lowerName.endsWith(".env") ||
        /^serviceaccount.*\.json$/i.test(name) ||
        /service[-_]?account.*\.json$/i.test(name) ||
        /firebase[_\s-]?credentials/i.test(name) ||
        /google-services\.json/i.test(name) ||
        /adminsdk/i.test(name) ||
        /secret.*\.(json|txt|env)$/i.test(name) ||
        /token.*\.(json|txt|env)$/i.test(name) ||
        /private[-_]?key/i.test(name) ||
        lowerName === "firbase.txt" ||
        /\.(pem|key|crt)$/i.test(name) ||
        /\.(log|out\.log|err\.log)$/i.test(name) ||
        lowerName === ".ds_store" ||
        lowerName === "thumbs.db" ||
        lowerName === "desktop.ini"
    );
}

function findLocalDebris() {
    const nestedNodeModules = [];
    const privateDirs = [];
    const localFiles = [];
    const runtimeStateDirs = [];

    function visit(absolutePath) {
        if (!fs.existsSync(absolutePath)) {
            return;
        }

        const entries = fs.readdirSync(absolutePath, { withFileTypes: true });
        for (const entry of entries) {
            const childAbsolute = path.join(absolutePath, entry.name);
            const childPortable = relativePortable(childAbsolute);
            const lowerName = entry.name.toLowerCase();

            if (entry.isDirectory()) {
                if (lowerName === ".git" || lowerName === ".github") {
                    continue;
                }

                if (lowerName === "data" && /premium\/premium-games\/.+\/(?:server|backend)\/data$/i.test(childPortable)) {
                    runtimeStateDirs.push(childPortable);
                    continue;
                }

                if (isGeneratedOrPrivateDirName(entry.name)) {
                    if (lowerName === "node_modules") {
                        nestedNodeModules.push(childPortable);
                    } else {
                        privateDirs.push(childPortable);
                    }
                    continue;
                }

                visit(childAbsolute);
                continue;
            }

            if (isLocalOnlyFileName(entry.name)) {
                localFiles.push(childPortable);
            }
        }
    }

    visit(rootDir);

    if (nestedNodeModules.length) {
        warnings.push(`node_modules folders should stay out of GitHub/VPS uploads; install on the host instead: ${summarizeList(nestedNodeModules)}`);
    }

    if (privateDirs.length) {
        warnings.push(`Private/generated directories found locally and should not be uploaded: ${summarizeList(privateDirs)}`);
    }

    if (runtimeStateDirs.length) {
        warnings.push(`Local premium runtime state folders should not be uploaded: ${summarizeList(runtimeStateDirs)}`);
    }

    if (localFiles.length) {
        warnings.push(`Local-only files found; keep them private and confirm .gitignore excludes them: ${summarizeList(localFiles)}`);
    }
}

function getStatus(port, route, method = "GET") {
    let requestPath = String(route || "/");
    try {
        requestPath = encodeURI(decodeURI(requestPath));
    } catch (_) {
        requestPath = encodeURI(requestPath);
    }

    return new Promise((resolve) => {
        const request = http.request({
            hostname: "127.0.0.1",
            port,
            path: requestPath,
            method,
            headers: method === "POST"
                ? {
                    "Content-Type": "application/json",
                    "Content-Length": "2"
                }
                : undefined
        }, (response) => {
            response.resume();
            response.on("end", () => resolve(response.statusCode || 0));
        });

        request.on("error", () => resolve(0));
        request.setTimeout(5000, () => {
            request.destroy();
            resolve(0);
        });

        if (method === "POST") {
            request.write("{}");
        }
        request.end();
    });
}

async function listenOnRandomPort(server) {
    if (server.listening) {
        return { port: server.address().port, shouldClose: false };
    }

    return new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(0, "127.0.0.1", () => {
            server.off("error", reject);
            resolve({ port: server.address().port, shouldClose: true });
        });
    });
}

async function closeServer(server, io = null) {
    if (io && typeof io.close === "function") {
        try {
            io.close();
        } catch (_) {
            // Keep audit cleanup best-effort; the HTTP close below is authoritative.
        }
    }

    if (!server || !server.listening) {
        return;
    }

    await new Promise((resolve) => server.close(resolve));
}

async function checkPublicPolicy(firstGamePath, firstPremiumPath) {
    const app = express();
    app.get("/signals-client.js", (_, response) => {
        response.sendFile(path.join(rootDir, "analytics-client.js"));
    });
    app.use(createPublicFilePolicy());
    app.use(express.static(rootDir, {
        extensions: false,
        fallthrough: true,
        index: false
    }));
    app.use((_, response) => response.status(404).end());

    const server = await new Promise((resolve, reject) => {
        const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
        instance.on("error", reject);
    });

    try {
        const port = server.address().port;
        const allowedRoutes = [
            "/gamehub.js",
            "/gamehub.css",
            "/admin.html",
            "/admin.css",
            "/admin.js",
            "/admin-access.js",
            "/analytics-client.js",
            "/signals-client.js",
            "/feedback.css",
            "/feedback-widget.js",
            "/game-renderer.html",
            "/new-game-renderer.html",
            "/documentation.html",
            "/legal.html",
            "/sitemap.xml",
            "/robots.txt",
            firstGamePath ? encodeRoute(firstGamePath) : "",
            firstPremiumPath ? encodeRoute(firstPremiumPath) : ""
        ].filter(Boolean);

        for (const route of allowedRoutes) {
            const status = await getStatus(port, route);
            if (status !== 200) {
                failures.push(`Expected public route to serve 200 but got ${status}: ${route}`);
            }
        }

        for (const route of privateRouteChecks) {
            const status = await getStatus(port, route);
            if (status !== 404) {
                failures.push(`Expected private route to be blocked with 404 but got ${status}: ${route}`);
            }
        }
    } finally {
        await closeServer(server);
    }
}

async function checkProductionServerRoutes() {
    const platformServer = require("../server.js");
    await Promise.resolve(platformServer.ready);

    const { port, shouldClose } = await listenOnRandomPort(platformServer.httpServer);
    try {
        for (const check of routeSmokeChecks) {
            const status = await getStatus(port, check.route, check.method || "GET");
            if (status !== check.expected) {
                const message = `Expected production route ${check.route} to return ${check.expected} but got ${status}`;
                if (check.optional) {
                    warnings.push(message);
                } else {
                    failures.push(message);
                }
            }
        }

        for (const route of privateRouteChecks) {
            const status = await getStatus(port, route);
            if (status !== 404) {
                failures.push(`Expected production private route to be blocked with 404 but got ${status}: ${route}`);
            }
        }
    } finally {
        if (shouldClose) {
            await closeServer(platformServer.httpServer, platformServer.io);
        }
    }
}

function validatePackageScripts(packageJson) {
    if (packageJson.scripts?.start !== "node server.js") {
        failures.push("package.json should keep scripts.start as node server.js");
    }

    if (packageJson.scripts?.["hosting:audit"] !== "node scripts/hosting-audit.js") {
        failures.push("package.json should keep scripts.hosting:audit as node scripts/hosting-audit.js");
    }
}

function validateGitignore() {
    const gitignorePath = relPath(".gitignore");
    if (!fs.existsSync(gitignorePath)) {
        failures.push("Missing .gitignore");
        return;
    }

    const source = fs.readFileSync(gitignorePath, "utf8");
    const requiredPatterns = [
        "node_modules/",
        ".env",
        "*.env",
        "!.env.example",
        "firebase_credentials",
        "firebase_credentials/",
        "premium/firebase_credentials",
        "premium/firebase_credentials/",
        "**/firebase_credentials",
        "**/firebase_credentials/",
        "serviceAccount.json",
        "**/serviceAccount*.json",
        "**/*service-account*.json",
        "logs/",
        "*.log",
        ".vite/",
        ".cache/",
        "coverage/",
        ".gamehub-data/",
        ".DS_Store",
        "Thumbs.db"
    ];

    for (const pattern of requiredPatterns) {
        if (!source.includes(pattern)) {
            failures.push(`.gitignore is missing required pattern: ${pattern}`);
        }
    }
}

function validateCatalogEntry(entry, label) {
    const gamePath = String(entry.path || "").split("?")[0].replace(/^\/+/, "");
    if (!gamePath || !fileExists(gamePath)) {
        failures.push(`Catalog points to a missing ${label} game entry: ${entry.id || entry.name || "(unknown)"}`);
        return;
    }

    if (gamePath.includes("/dist/")) {
        const distRoot = gamePath.slice(0, gamePath.indexOf("/dist/") + "/dist".length);
        if (!fileExists(distRoot) || !fs.statSync(relPath(distRoot)).isDirectory()) {
            failures.push(`Catalog requires a missing built dist folder: ${distRoot}`);
        }
    }
}

function slugifyFolderName(name) {
    return String(name || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function normalizePortablePath(value) {
    return String(value || "").replace(/\\/g, "/").replace(/^\/+/, "");
}

function resolvePremiumDefinitionPaths(definition) {
    const folderPath = normalizePortablePath(
        definition.folderPath || path.posix.join("premium", "premium-games", definition.folderName || "")
    );
    const preferredEntry = normalizePortablePath(
        definition.preferredEntryPath || path.posix.join(folderPath, definition.preferredEntry || "dist/index.html")
    );
    const directEntry = normalizePortablePath(
        definition.directEntryPath || path.posix.join(folderPath, "index.html")
    );

    return { folderPath, preferredEntry, directEntry };
}

function validatePremiumDefinitions() {
    const premiumRoot = relPath("premium", "premium-games");
    const existingFolders = fs.existsSync(premiumRoot)
        ? fs.readdirSync(premiumRoot, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name)
            .filter((name) => name !== "premium_game_image")
        : [];

    const registeredPremiumFolders = new Set();
    const registeredPlayableIds = new Set();

    for (const definition of PREMIUM_GAME_DEFINITIONS) {
        const { folderPath, preferredEntry } = resolvePremiumDefinitionPaths(definition);
        registeredPlayableIds.add(definition.id);

        if (preferredEntry.startsWith("premium/premium-games/")) {
            const folderName = preferredEntry.slice("premium/premium-games/".length).split("/")[0];
            registeredPremiumFolders.add(folderName);

            if (/\s/.test(folderName)) {
                failures.push(`Premium registry folder for ${definition.id} is not kebab-case safe: ${folderName}`);
            }

            if (!fileExists(path.posix.join("premium", "premium-games", folderName))) {
                failures.push(`Premium registry references a missing folder for ${definition.id}: premium/premium-games/${folderName}`);
            }
        }

        if (!fileExists(preferredEntry)) {
            failures.push(`Premium registry entry points to a missing playable file for ${definition.id}: ${preferredEntry}`);
        }
    }

    for (const folderName of existingFolders) {
        const slugTwin = /\s/.test(folderName) ? slugifyFolderName(folderName) : "";
        if (slugTwin && existingFolders.includes(slugTwin)) {
            warnings.push(`Ignoring local unslugged duplicate premium folder because production-safe ${slugTwin} exists: premium/premium-games/${folderName}`);
            continue;
        }

        if (/\s/.test(folderName)) {
            failures.push(`Premium game folder contains spaces and should be kebab-case: premium/premium-games/${folderName}`);
        }

        if (!registeredPremiumFolders.has(folderName)) {
            warnings.push(`Premium game folder exists but is not registered in the premium catalog: premium/premium-games/${folderName}`);
        }
    }

    return registeredPlayableIds;
}

function gitignoreBlocksDist(source) {
    return String(source || "")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#"))
        .some((line) => line === "dist" || line === "dist/" || line === "/dist" || line === "/dist/");
}

function validateRequiredDistIsTrackable() {
    for (const definition of PREMIUM_GAME_DEFINITIONS) {
        const { preferredEntry } = resolvePremiumDefinitionPaths(definition);
        const distIndex = preferredEntry.indexOf("/dist/");
        if (distIndex < 0) {
            continue;
        }

        const distOwner = preferredEntry.slice(0, distIndex);
        const ownerParts = distOwner.split("/");
        for (let index = 1; index <= ownerParts.length; index += 1) {
            const gitignorePath = path.join(rootDir, ...ownerParts.slice(0, index), ".gitignore");
            if (!fs.existsSync(gitignorePath) || !fs.statSync(gitignorePath).isFile()) {
                continue;
            }

            const source = fs.readFileSync(gitignorePath, "utf8");
            if (gitignoreBlocksDist(source)) {
                failures.push(`Required premium dist output may be missing from GitHub because ${relativePortable(gitignorePath)} ignores dist for ${definition.id}.`);
            }
        }
    }
}

function validatePremiumCatalogCompleteness(premiumGames, registeredPlayableIds) {
    const catalogIds = new Set(premiumGames.map((game) => game.id));
    for (const gameId of registeredPlayableIds) {
        if (!catalogIds.has(gameId)) {
            failures.push(`Registered premium game is missing from /api/premium-games-catalog: ${gameId}`);
        }
    }
}

function validatePremiumFirebaseCredentials() {
    const envValue = String(process.env.GAMEHUB_PREMIUM_FIREBASE_CREDENTIALS || "").trim();
    const resolved = resolvePremiumFirebaseCredentialsPath(rootDir);
    const configState = readPremiumFirebaseConfig(rootDir);

    if (!envValue) {
        warnings.push("GAMEHUB_PREMIUM_FIREBASE_CREDENTIALS is not set; using local fallback lookup. Set it to premium/firebase_credentials/config.js on production.");
    } else {
        const rawPath = path.isAbsolute(envValue) ? envValue : path.resolve(rootDir, envValue);
        if (!fs.existsSync(rawPath)) {
            failures.push(`GAMEHUB_PREMIUM_FIREBASE_CREDENTIALS points to a missing path: ${envValue}`);
        } else if (fs.statSync(rawPath).isDirectory()) {
            warnings.push(`GAMEHUB_PREMIUM_FIREBASE_CREDENTIALS points to a directory. Set it to ${normalizePortablePath(path.join(envValue, "config.js"))}.`);
        }
    }

    if (resolved.warning) {
        warnings.push(resolved.warning);
    }

    if (!resolved.exists) {
        warnings.push(configState.error || "Premium Firebase credentials are not configured.");
        return;
    }

    if (!configState.configured) {
        warnings.push(configState.error || "Premium Firebase credentials file exists but could not be parsed.");
    }
}

function validateSpaceshipRaceMultiplayerCredentials() {
    const candidatePath = String(
        process.env.GAMEHUB_PREMIUM_FIREBASE_SERVICE_ACCOUNT
        || process.env.FIREBASE_SERVICE_ACCOUNT_FILE
        || process.env.FIREBASE_SERVICE_ACCOUNT_PATH
        || process.env.GOOGLE_APPLICATION_CREDENTIALS
        || ""
    ).trim();
    const hasInlineServiceAccount = Boolean(
        String(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || "").trim()
        || String(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 || "").trim()
    );
    const fallbackPath = relPath("premium", "firebase_credentials", "serviceAccount.json");
    const hasFallbackServiceAccount = fs.existsSync(fallbackPath) && fs.statSync(fallbackPath).isFile();

    if (candidatePath) {
        const resolvedPath = path.isAbsolute(candidatePath)
            ? candidatePath
            : path.resolve(rootDir, candidatePath);

        if (!fs.existsSync(resolvedPath)) {
            warnings.push(`Space Race multiplayer Firebase Admin path is set but missing: ${candidatePath}`);
        } else if (fs.statSync(resolvedPath).isDirectory()) {
            warnings.push(`Space Race multiplayer Firebase Admin path points to a directory. Set it to a serviceAccount.json file: ${candidatePath}`);
        }
    }

    if (!candidatePath && !hasInlineServiceAccount && !hasFallbackServiceAccount) {
        warnings.push("Space Race multiplayer production auth needs a Firebase Admin service account. Set GAMEHUB_PREMIUM_FIREBASE_SERVICE_ACCOUNT=premium/firebase_credentials/serviceAccount.json or GOOGLE_APPLICATION_CREDENTIALS.");
    }
}

function printAuditInventory() {
    console.log("Production public browser roots:");
    productionPublicBrowserRoots.forEach((entry) => console.log(`- ${entry}`));

    console.log("");
    console.log("Production server-only roots:");
    productionServerOnlyRoots.forEach((entry) => console.log(`- ${entry}`));

    console.log("");
    console.log("Local/private-only examples:");
    localOnlyExamples.forEach((entry) => console.log(`- ${entry}`));

    console.log("");
    console.log("Smoke route list:");
    routeSmokeChecks.forEach((check) => console.log(`- ${check.route}`));
}

async function main() {
    requiredFiles.forEach(assertFile);
    requiredDirs.forEach(assertDir);
    premiumRuntimeFiles.forEach(assertFile);
    validateGitignore();

    const packageJson = JSON.parse(fs.readFileSync(relPath("package.json"), "utf8"));
    validatePackageScripts(packageJson);
    validatePremiumFirebaseCredentials();
    validateSpaceshipRaceMultiplayerCredentials();
    const registeredPlayableIds = validatePremiumDefinitions();
    validateRequiredDistIsTrackable();

    const games = await buildGameCatalog(rootDir, { force: true });
    const premiumGames = await createPremiumRegistry(rootDir).listGames({ force: true });

    if (!games.length) {
        failures.push("Public games catalog is empty.");
    }

    if (!premiumGames.length) {
        failures.push("Premium games catalog is empty.");
    }

    games.forEach((game) => validateCatalogEntry(game, "public"));
    premiumGames.forEach((game) => validateCatalogEntry(game, "premium"));
    validatePremiumCatalogCompleteness(premiumGames, registeredPlayableIds);

    findLocalDebris();
    await checkPublicPolicy(games[0]?.path, premiumGames[0]?.path);
    await checkProductionServerRoutes();

    console.log("GameHub hosting audit");
    console.log(`- Public games: ${games.length}`);
    console.log(`- Premium games: ${premiumGames.length}`);
    console.log(`- Required root files checked: ${requiredFiles.length}`);
    console.log(`- Required folders checked: ${requiredDirs.length}`);
    console.log(`- Premium runtime files checked: ${premiumRuntimeFiles.length}`);
    console.log("");
    printAuditInventory();

    if (warnings.length) {
        console.log("");
        console.log("Warnings:");
        warnings.forEach((warning) => console.log(`- ${warning}`));
    }

    if (failures.length) {
        console.log("");
        console.error("Failures:");
        failures.forEach((failure) => console.error(`- ${failure}`));
        process.exit(1);
        return;
    }

    console.log("");
    console.log("Hosting audit passed.");
    process.exit(0);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
