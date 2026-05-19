const path = require("path");

const PUBLIC_ROOT_FILES = new Set([
    "/",
    "/index.html",
    "/gamehub",
    "/gamehub.html",
    "/play",
    "/play.html",
    "/game-renderer",
    "/game-renderer.html",
    "/documentation",
    "/documentation.html",
    "/legal",
    "/legal/",
    "/legal.html",
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
    "/legal/contact",
    "/gamehub.css",
    "/gamehub.js",
    "/games-manifest.js",
    "/new-game-renderer.html",
    "/gamehub-socket.js",
    "/sitemap.xml",
    "/robots.txt",
    "/favicon.ico",
    "/premium",
    "/premium/",
    "/premium.html",
    "/premium/index.html",
    "/premium/play",
    "/premium/play.html",
    "/premium/login",
    "/premium/login.html"
]);

const PUBLIC_PREFIXES = [
    "/assets/",
    "/core/player/",
    "/systems/",
    "/ui/",
    "/utils/"
];

const BLOCKED_TOP_LEVEL_PREFIXES = [
    "/node_modules/",
    "/game-details/",
    "/core/server/",
    "/models/",
    "/.git/",
    "/.github/",
    "/.codex-verify/",
    "/.vite/",
    "/.cache/",
    "/coverage/",
    "/logs/",
    "/firebase_credentials/",
    "/firebase credentials/"
];

const BLOCKED_GAME_SEGMENTS = new Set([
    "node_modules",
    "server",
    "backend",
    "data",
    "logs",
    "src",
    ".vite",
    ".cache",
    "coverage",
    ".git",
    ".github",
    "tools",
    "scripts"
]);

const BLOCKED_GAME_FILE_NAMES = new Set([
    "package.json",
    "package-lock.json",
    "pnpm-lock.yaml",
    "yarn.lock",
    ".env",
    ".env.local",
    ".env.development",
    ".env.production",
    ".env.example",
    "server.js",
    "server.cjs",
    "server.mjs",
    "serviceaccount.json",
    "service-account.json",
    "service_account.json",
    "google-services.json",
    "firebase_credentials",
    "firebase credentials",
    "firbase.txt",
    "vite.config.js",
    "vite.config.mjs",
    "vite.config.ts",
    "tsconfig.json"
]);

const BLOCKED_GAME_FILE_PATTERNS = [
    /backup/i,
    /\.bak$/i,
    /\.old$/i,
    /\.log$/i,
    /\.md$/i,
    /\.markdown$/i,
    /\.ps1$/i,
    /\.cmd$/i,
    /\.bat$/i,
    /\.sh$/i,
    /\.zip$/i,
    /\.exe$/i
    ,
    /service[-_]?account/i,
    /adminsdk/i,
    /credential/i,
    /secret/i,
    /\.pem$/i,
    /\.key$/i,
    /\.crt$/i
];

const BLOCKED_SENSITIVE_PATH_PATTERNS = [
    /^\/(?:.*\/)?\.env(?:\..*)?$/i,
    /^\/(?:.*\/)?[^/]*\.env$/i,
    /^\/(?:.*\/)?serviceaccount[^/]*\.json$/i,
    /^\/(?:.*\/)?[^/]*service[-_]?account[^/]*\.json$/i,
    /^\/(?:.*\/)?google-services\.json$/i,
    /^\/(?:.*\/)?adminsdk[^/]*\.json$/i,
    /^\/(?:.*\/)?firebase[_\s-]?credentials(?:\/|$)/i,
    /^\/(?:.*\/)?firebase credentials(?:\/|$)/i,
    /^\/(?:.*\/)?[^/]*private[-_]?key[^/]*$/i,
    /^\/(?:.*\/)?(?:secret|token|access[-_]?token|refresh[-_]?token|auth[-_]?token)(?:\.[^/]*)?$/i,
    /^\/(?:.*\/)?logs(?:\/|$)/i,
    /^\/(?:.*\/)?\.vite(?:\/|$)/i,
    /^\/(?:.*\/)?\.cache(?:\/|$)/i,
    /^\/(?:.*\/)?coverage(?:\/|$)/i,
    /^\/(?:.*\/)?\.codex-verify(?:\/|$)/i
];

const ALLOWED_GAME_EXTENSIONS = new Set([
    ".html",
    ".css",
    ".js",
    ".mjs",
    ".json",
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

function normalizeRequestPath(requestPath) {
    let rawPath = String(requestPath || "/");
    try {
        rawPath = decodeURIComponent(rawPath);
    } catch (_) {
        // Keep the original path if the client sends a malformed escape sequence.
    }

    const normalized = path.posix.normalize(`/${rawPath}`);
    return normalized.replace(/\/{2,}/g, "/");
}

function isBlockedTopLevelPath(requestPath) {
    return BLOCKED_TOP_LEVEL_PREFIXES.some((prefix) => requestPath.startsWith(prefix));
}

function isBlockedSensitivePath(requestPath) {
    return BLOCKED_SENSITIVE_PATH_PATTERNS.some((pattern) => pattern.test(requestPath));
}

function isAllowedGamePath(requestPath) {
    if (!requestPath.startsWith("/games/")) {
        return false;
    }

    const segments = requestPath
        .slice("/games/".length)
        .split("/")
        .filter(Boolean);

    if (!segments.length) {
        return false;
    }

    const lastSegment = String(segments[segments.length - 1] || "").toLowerCase();
    if (BLOCKED_GAME_FILE_NAMES.has(lastSegment)) {
        return false;
    }

    if (lastSegment.startsWith(".")) {
        return false;
    }

    if (BLOCKED_GAME_FILE_PATTERNS.some((pattern) => pattern.test(lastSegment))) {
        return false;
    }

    const extension = path.posix.extname(lastSegment);
    if (extension && !ALLOWED_GAME_EXTENSIONS.has(extension)) {
        return false;
    }

    return !segments.some((segment) => BLOCKED_GAME_SEGMENTS.has(String(segment || "").toLowerCase()));
}

function isAllowedPremiumPath(requestPath) {
    if (!requestPath.startsWith("/premium/")) {
        return false;
    }

    const segments = requestPath
        .slice("/premium/".length)
        .split("/")
        .filter(Boolean);

    if (!segments.length) {
        return false;
    }

    const lastSegment = String(segments[segments.length - 1] || "").toLowerCase();
    if (lastSegment.startsWith(".")) {
        return false;
    }

    if (BLOCKED_GAME_FILE_NAMES.has(lastSegment)) {
        return false;
    }

    if (BLOCKED_GAME_FILE_PATTERNS.some((pattern) => pattern.test(lastSegment))) {
        return false;
    }

    const extension = path.posix.extname(lastSegment);
    if (extension && !ALLOWED_GAME_EXTENSIONS.has(extension)) {
        return false;
    }

    return !segments.some((segment) => BLOCKED_GAME_SEGMENTS.has(String(segment || "").toLowerCase()));
}

function isPublicAssetPath(requestPath) {
    if (PUBLIC_ROOT_FILES.has(requestPath)) {
        return true;
    }

    if (requestPath.startsWith("/api/") || requestPath.startsWith("/socket.io/")) {
        return true;
    }

    if (PUBLIC_PREFIXES.some((prefix) => requestPath.startsWith(prefix))) {
        return true;
    }

    if (isAllowedGamePath(requestPath)) {
        return true;
    }

    if (isAllowedPremiumPath(requestPath)) {
        return true;
    }

    return false;
}

function createPublicFilePolicy() {
    return (req, res, next) => {
        if (req.method !== "GET" && req.method !== "HEAD") {
            next();
            return;
        }

        const requestPath = normalizeRequestPath(req.path);
        if (isBlockedTopLevelPath(requestPath) || isBlockedSensitivePath(requestPath)) {
            res.status(404).end();
            return;
        }

        if (isPublicAssetPath(requestPath)) {
            next();
            return;
        }

        res.status(404).end();
    };
}

module.exports = {
    createPublicFilePolicy
};
