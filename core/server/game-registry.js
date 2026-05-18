const fs = require("fs/promises");
const path = require("path");

const CATALOG_CACHE_TTL_MS = 2000;
const catalogCache = new Map();
const PUBLIC_GAME_IMAGE_OVERRIDES = new Map([
    ["2048", "/games/game_images/2048.png"],
    ["ultimate-2048", "/games/game_images/2048.png"],
    ["battlefield-codex", "/games/game_images/battlefield.png"],
    ["battlefield-game", "/games/game_images/battlefield.png"],
    ["skill-parking-simulator", "/games/game_images/carparking.png"],
    ["car-parking-game", "/games/game_images/carparking.png"],
    ["carparking", "/games/game_images/carparking.png"],
    ["car-wrestling", "/games/game_images/carwrestling.png"],
    ["last-drift-standing", "/games/game_images/carwrestling.png"],
    ["color-rush", "/games/game_images/color%20rush.png"],
    ["flappy-mech", "/games/game_images/flappy.png"],
    ["intergalactic-space-war", "/games/game_images/intergalacticspacewar.png"],
    ["mini-city-drive", "/games/game_images/openworld%20cardrive.png"],
    ["openworld-car-game", "/games/game_images/openworld%20cardrive.png"],
    ["heatline-city", "/games/game_images/car%20chase%20.png"],
    ["car-chase-3d", "/games/game_images/car%20chase%20.png"],
    ["night-traffic-run", "/games/game_images/nighttraffic.png"],
    ["car-infinite-race", "/games/game_images/nighttraffic.png"],
    ["snake", "/games/game_images/quantum%20snake.png"],
    ["quantum-snake", "/games/game_images/quantum%20snake.png"],
    ["shadow-fighter-duel", "/games/game_images/shadow%20fighter.png"],
    ["shadow-fight", "/games/game_images/shadow%20fighter.png"],
    ["3dshooter", "/games/game_images/starfire%20cosmic%20blitz.png"],
    ["starfire-cosmic-blitz", "/games/game_images/starfire%20cosmic%20blitz.png"],
    ["stick-hero", "/games/game_images/stickhero.png"],
    ["stick-hero-html", "/games/game_images/stickhero.png"],
    ["train-roof-rush", "/games/game_images/trainroof%20runner.png"],
    ["train-runner", "/games/game_images/trainroof%20runner.png"],
    ["futuristic-tictactoe-fixed", "/games/game_images/tic_tac_toe.png"],
    ["futuristic-tictactoe", "/games/game_images/tic_tac_toe.png"],
    ["neotactix", "/games/game_images/tic_tac_toe.png"]
]);

function slugify(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/\.html?$/i, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function prettifyName(value) {
    return String(value || "Untitled Game")
        .replace(/\.html?$/i, "")
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function extractTitleFromHtml(rawHtml, fallbackName) {
    const match = String(rawHtml || "").match(/<title>([^<]+)<\/title>/i);
    return match?.[1]?.trim() || fallbackName;
}

function createMark(name) {
    const compact = String(name || "")
        .replace(/[^a-z0-9]/gi, "")
        .toUpperCase();

    return compact.slice(0, 6) || "GAME";
}

function pickPalette(seed) {
    const palettes = [
        { accent: "#c7a46a", accentAlt: "#8d6e63" },
        { accent: "#d2b48c", accentAlt: "#a98467" },
        { accent: "#b08968", accentAlt: "#7f5539" },
        { accent: "#c8ad7f", accentAlt: "#6d597a" },
        { accent: "#d6c2a1", accentAlt: "#8c6f56" },
        { accent: "#bea07e", accentAlt: "#7d5a50" }
    ];

    const hash = [...String(seed)].reduce((total, char) => total + char.charCodeAt(0), 0);
    return palettes[hash % palettes.length];
}

async function readMetadataFiles(metadataDir) {
    const metadataMap = new Map();

    try {
        const files = await fs.readdir(metadataDir, { withFileTypes: true });
        const jsonFiles = files.filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".json"));

        for (const entry of jsonFiles) {
            const fullPath = path.join(metadataDir, entry.name);
            try {
                const raw = await fs.readFile(fullPath, "utf8");
                const parsed = JSON.parse(raw);
                const stem = entry.name.replace(/\.json$/i, "");
                const fileKey = slugify(parsed.file || stem);
                metadataMap.set(fileKey, parsed);
            } catch (error) {
                console.warn(`Skipping invalid metadata file: ${entry.name}`, error.message);
            }
        }
    } catch (_) {
        // Missing metadata directory is acceptable.
    }

    return metadataMap;
}

async function resolveFolderGameSource(gamesDir, folderName) {
    const candidates = ["dist/index.html", "index.html"];

    for (const candidate of candidates) {
        const fullPath = path.join(gamesDir, folderName, ...candidate.split("/"));

        try {
            const stats = await fs.stat(fullPath);
            if (!stats.isFile()) {
                continue;
            }

            const relativePath = path.posix.join("games", folderName, candidate);

            return {
                metadataKey: slugify(folderName),
                fallbackName: prettifyName(folderName),
                fileName: `${folderName}/${candidate}`,
                path: relativePath,
                fullPath,
                seed: relativePath
            };
        } catch (_) {
            // Try the next candidate.
        }
    }

    return null;
}

async function collectGameSources(gamesDir) {
    const entries = await fs.readdir(gamesDir, { withFileTypes: true });
    const gameSources = [];

    for (const entry of entries) {
        if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) {
            const fileStem = entry.name.replace(/\.html$/i, "");
            gameSources.push({
                metadataKey: slugify(fileStem),
                fallbackName: prettifyName(entry.name),
                fileName: entry.name,
                path: `games/${entry.name}`,
                fullPath: path.join(gamesDir, entry.name),
                seed: entry.name
            });
            continue;
        }

        if (entry.isDirectory()) {
            const folderSource = await resolveFolderGameSource(gamesDir, entry.name);
            if (folderSource) {
                gameSources.push(folderSource);
            }
        }
    }

    return gameSources;
}

function inferRuntimeKind(metadata, source, rawHtml) {
    const explicit = String(metadata.runtimeKind || metadata.runtime || "").trim().toLowerCase();
    if (explicit) {
        return explicit;
    }

    const signal = [
        metadata.category,
        metadata.type,
        metadata.genre,
        metadata.description,
        source.fileName,
        rawHtml
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    if (/(socket\.io|new websocket|\bio\(|multiplayer|realtime|online room|join room|room:create|room:join|match:move|match:reaction)/.test(signal)) {
        return "io";
    }

    if (/(three\.js|three\.min\.js|three\.module|webglrenderer|\bthree\b|gltf|glb|babylon|ammo|cannon|webgpu)/.test(signal)) {
        return "3d";
    }

    if (/(svg|<canvas|canvas |arcade|puzzle|platform|fighter|runner|shooter|match-3|grid)/.test(signal)) {
        return "2d";
    }

    return "static";
}

function inferCapabilities(metadata, runtimeKind, rawHtml) {
    const explicit = metadata.capabilities;
    if (explicit && typeof explicit === "object") {
        return {
            audio: explicit.audio !== false,
            fullscreen: explicit.fullscreen !== false,
            pause: explicit.pause !== false,
            pointerLock: explicit.pointerLock === true,
            touch: explicit.touch === true,
            multiplayer: explicit.multiplayer === true,
            bridge: explicit.bridge === true
        };
    }

    const signal = String(rawHtml || "").toLowerCase();
    return {
        audio: /<audio|audiocontext|howl|new audio\(|sound|music/.test(signal),
        fullscreen: true,
        pause: runtimeKind !== "static",
        pointerLock: /pointerlock/.test(signal),
        touch: /(touchstart|touchmove|touchend|ontouchstart|pointerdown)/.test(signal),
        multiplayer: runtimeKind === "io",
        bridge: /gamehubbridge|platform:init|game:ready/.test(signal)
    };
}

function inferLoadProfile(metadata, runtimeKind, source, rawHtml) {
    const explicit = String(metadata.loadProfile || "").trim().toLowerCase();
    if (explicit) {
        return explicit;
    }

    const signal = [source.fileName, rawHtml].filter(Boolean).join(" ").toLowerCase();
    if (runtimeKind === "io") {
        return "realtime";
    }

    if (runtimeKind === "3d" && /(gltf|glb|hdr|composer|postprocessing|ammo|cannon)/.test(signal)) {
        return "heavy";
    }

    if (runtimeKind === "static") {
        return "instant";
    }

    return "standard";
}

function createStorageNamespace(id, metadataKey) {
    return `gamehub.${slugify(id || metadataKey || "game")}`;
}

function findPublicThumbnail({ id, fileName, name, metadataKey }) {
    const keys = [id, fileName, name, metadataKey]
        .filter(Boolean)
        .flatMap((value) => {
            const raw = String(value).replace(/\\/g, "/");
            const fileStem = raw.split("/").pop()?.replace(/\.html?$/i, "") || raw;
            return [slugify(raw), slugify(fileStem)];
        });

    for (const key of keys) {
        const thumbnail = PUBLIC_GAME_IMAGE_OVERRIDES.get(key);
        if (thumbnail) {
            return thumbnail;
        }
    }

    return "";
}

function normalizeCategory(value) {
    return value || "Arcade";
}

function normalizeType(value) {
    return value || "Single Player";
}

async function buildFreshCatalog(rootDir) {
    const gamesDir = path.join(rootDir, "games");
    const metadataDir = path.join(rootDir, "game-details");
    const metadataMap = await readMetadataFiles(metadataDir);
    const gameSources = await collectGameSources(gamesDir);
    const games = [];

    for (const source of gameSources) {
        const rawHtml = await fs.readFile(source.fullPath, "utf8");
        const metadata = metadataMap.get(source.metadataKey) || {};
        const order = Number(metadata.order);

        if (metadata.visible === false) {
            continue;
        }

        const fallbackName = source.fallbackName;
        const title = extractTitleFromHtml(rawHtml, fallbackName);
        const palette = pickPalette(source.seed);
        const id = metadata.id || source.metadataKey;
        const runtimeKind = inferRuntimeKind(metadata, source, rawHtml);
        const capabilities = inferCapabilities(metadata, runtimeKind, rawHtml);
        const loadProfile = inferLoadProfile(metadata, runtimeKind, source, rawHtml);

        games.push({
            id,
            fileName: source.fileName,
            path: source.path,
            preferredEntry: metadata.preferredEntry || source.path,
            name: metadata.name || title || fallbackName,
            subtitle: metadata.subtitle || metadata.type || "Browser Game",
            description: metadata.description || "A local HTML game loaded directly from the games folder.",
            ageRating: metadata.ageRating || metadata.age || "7+",
            category: normalizeCategory(metadata.category || metadata.genre),
            type: normalizeType(metadata.type),
            requiresAgeConfirmation: metadata.requiresAgeConfirmation === true || metadata.requires18Confirmation === true,
            contentWarning: metadata.contentWarning || metadata.warning || "",
            thumbnail: metadata.thumbnail || metadata.thumbnailUrl || metadata.thumbnailURL || findPublicThumbnail({
                id,
                fileName: source.fileName,
                name: metadata.name || title || fallbackName,
                metadataKey: source.metadataKey
            }),
            accent: metadata.accent || palette.accent,
            accentAlt: metadata.accentAlt || palette.accentAlt,
            mark: metadata.mark || createMark(metadata.name || title || fallbackName),
            order: Number.isFinite(order) ? order : 9999,
            visible: metadata.visible !== false,
            runtimeKind,
            storageNamespace: metadata.storageNamespace || createStorageNamespace(id, source.metadataKey),
            capabilities,
            loadProfile,
            presentation: metadata.presentation && typeof metadata.presentation === "object"
                ? { ...metadata.presentation }
                : undefined
        });
    }

    games.sort((left, right) => {
        if (left.order !== right.order) {
            return left.order - right.order;
        }

        return left.name.localeCompare(right.name);
    });

    return games.map((game, index) => ({ ...game, order: index }));
}

async function buildGameCatalog(rootDir, options = {}) {
    const cacheKey = path.resolve(rootDir);
    const forceReload = options.force === true;
    const now = Date.now();
    const cached = catalogCache.get(cacheKey);

    if (!forceReload && cached && now - cached.at < CATALOG_CACHE_TTL_MS) {
        return cached.games.map((game) => ({ ...game, capabilities: { ...game.capabilities } }));
    }

    const games = await buildFreshCatalog(rootDir);
    catalogCache.set(cacheKey, { at: now, games });
    return games.map((game) => ({ ...game, capabilities: { ...game.capabilities } }));
}

function createGameRegistry(rootDir) {
    const resolvedRoot = path.resolve(rootDir);

    return {
        async listGames(options = {}) {
            return buildGameCatalog(resolvedRoot, options);
        },
        async getGameById(gameId, options = {}) {
            const games = await buildGameCatalog(resolvedRoot, options);
            return games.find((game) => game.id === gameId) || null;
        },
        invalidate() {
            catalogCache.delete(resolvedRoot);
        }
    };
}

module.exports = {
    buildGameCatalog,
    createGameRegistry
};
