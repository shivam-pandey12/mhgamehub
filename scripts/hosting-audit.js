const fs = require("fs");
const http = require("http");
const path = require("path");

const express = require("express");

const { buildGameCatalog } = require("../core/server/game-registry");
const { createPremiumRegistry } = require("../core/server/premium-registry");
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
    "documentation.html",
    "legal.html",
    "gamehub.js",
    "gamehub.css",
    "game-renderer.html",
    "new-game-renderer.html",
    "gamehub-socket.js",
    "games-manifest.js"
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
    "premium/premium-games/3d-golf/server/index.js"
];

const productionPublicBrowserRoots = [
    "assets",
    "core/player",
    "systems",
    "games",
    "premium",
    "gamehub.html",
    "gamehub.js",
    "gamehub.css",
    "game-renderer.html",
    "new-game-renderer.html",
    "gamehub-socket.js",
    "games-manifest.js",
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
    "premium/firebase_credentials",
    "serviceAccount*.json",
    "logs",
    ".vite",
    ".cache",
    "coverage",
    ".codex-verify",
    "premium/premium-games/**/server/data",
    "premium/premium-games/**/backend/data"
];

const routeSmokeChecks = [
    { route: "/", expected: 200 },
    { route: "/gamehub", expected: 200 },
    { route: "/play", expected: 200 },
    { route: "/premium", expected: 200 },
    { route: "/game-renderer", expected: 200 },
    { route: "/game-renderer.html", expected: 200 },
    { route: "/api/health", expected: 200 },
    { route: "/api/games-catalog", expected: 200 },
    { route: "/api/premium-games-catalog", expected: 200 },
    { route: "/socket.io/socket.io.js", expected: 200 },
    { route: "/api/premium-runtime/spaceship-race/health", expected: 200, optional: true },
    { route: "/api/premium-runtime/chess/health", expected: 200, optional: true },
    { route: "/api/premium-runtime/handcricket/health", expected: 200, optional: true },
    { route: "/api/premium-runtime/ludo/health", expected: 200, optional: true },
    { route: "/api/premium-runtime/golf/health", expected: 200, optional: true }
];

const privateRouteChecks = [
    "/.env",
    "/firebase_credentials/config.js",
    "/premium/firebase_credentials",
    "/serviceAccount.json",
    "/models/User.js",
    "/game-details/2048.json",
    "/core/server/create-server.js",
    "/node_modules/express/package.json",
    "/.vite/deps/main.js",
    "/.cache/runtime.json",
    "/coverage/index.html",
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

function getStatus(port, route) {
    let requestPath = String(route || "/");
    try {
        requestPath = encodeURI(decodeURI(requestPath));
    } catch (_) {
        requestPath = encodeURI(requestPath);
    }

    return new Promise((resolve) => {
        const request = http.get({
            hostname: "127.0.0.1",
            port,
            path: requestPath
        }, (response) => {
            response.resume();
            response.on("end", () => resolve(response.statusCode || 0));
        });

        request.on("error", () => resolve(0));
        request.setTimeout(5000, () => {
            request.destroy();
            resolve(0);
        });
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
            "/game-renderer.html",
            "/new-game-renderer.html",
            "/documentation.html",
            "/legal.html",
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
            const status = await getStatus(port, check.route);
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
