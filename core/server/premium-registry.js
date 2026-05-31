const fs = require("fs");
const path = require("path");

const PREMIUM_CATALOG_CACHE_TTL_MS = 5000;
const PREMIUM_GAME_IMAGE_OVERRIDES = new Map([
    ["spaceship-race", "/premium/premium-games/premium_game_image/spacerace_new.png"],
    ["carrom-3d", "/premium/premium-games/premium_game_image/carrom-3d.png"],
    ["imperial-chess", "/premium/premium-games/premium_game_image/chess_new.png"],
    ["chopsticks-3d-arena", "/premium/premium-games/premium_game_image/chopstick_new.png"],
    ["handrex", "/premium/premium-games/premium_game_image/mhhandrex_new.png"],
    ["stick-titan", "/premium/premium-games/premium_game_image/stick-titan.png"],
    ["ludo-3d-royale", "/premium/premium-games/premium_game_image/ludo_new.png"],
    ["rubik-3d", "/premium/premium-games/premium_game_image/rubik_new.png"],
    ["snake-ladder-3d-royale", "/premium/premium-games/premium_game_image/snake_new.png"],
    ["archery-3d", "/premium/premium-games/premium_game_image/archery_new.png"],
    ["golf-3d", "/premium/premium-games/premium_game_image/mini_golf.png"]
]);

const PREMIUM_GAME_DEFINITIONS = [
    {
        id: "spaceship-race",
        folderName: "3d-spaceship-race",
        name: "3D Spaceship Race",
        subtitle: "Firebase racer with live room ladders",
        description: "A premium neon racing prototype with in-game Firebase identity, live room matchmaking, and cinematic space-lane handling.",
        category: "Realtime Flight Racer",
        type: "3D Arena Racer",
        runtimeKind: "io",
        loadProfile: "heavy",
        accessLevel: "open",
        authRequired: false,
        accountMode: "firebase-in-game",
        authProvider: "firebase",
        preferredEntry: "dist/index.html",
        accent: "#69b8ff",
        accentAlt: "#1f2f6c",
        mark: "RACE",
        releasePhase: "Live Build",
        presentation: {
            requireLandscape: true,
            preferredOrientation: "landscape",
            viewportProfile: "immersive",
            minStageHeight: 500
        },
        capabilities: {
            audio: true,
            fullscreen: true,
            pause: true,
            pointerLock: false,
            touch: true,
            multiplayer: true,
            bridge: false
        },
        socketNamespace: "/premium-spaceship-race",
        tags: ["Firebase Identity", "Socket.IO Rooms", "3D Flight"]
    },
    {
        id: "carrom-3d",
        folderName: "carron3d_new",
        name: "3D Carrom Royale",
        subtitle: "Premium 3D tabletop carrom",
        description: "A cinematic 3D carrom game with smooth striker physics, queen cover rules, local play, bot practice, challenges, private rooms, and public matchmaking.",
        category: "Board / Tabletop",
        type: "Premium Game",
        runtimeKind: "io",
        loadProfile: "heavy",
        accessLevel: "open",
        authRequired: false,
        accountMode: "none",
        preferredEntry: "dist/index.html",
        accent: "#d8b678",
        accentAlt: "#7b562b",
        mark: "CARM",
        releasePhase: "Available",
        presentation: {
            requireLandscape: false,
            preferredOrientation: "any",
            viewportProfile: "immersive",
            minStageHeight: 470
        },
        capabilities: {
            audio: true,
            fullscreen: true,
            pause: true,
            pointerLock: false,
            touch: true,
            multiplayer: true,
            bridge: false
        },
        socketNamespace: "/premium-carrom",
        tags: ["3D", "Carrom", "Local 2P", "Bot", "Public Rooms", "Private Rooms", "Physics"]
    },
    {
        id: "imperial-chess",
        folderName: "chess-codex",
        name: "Imperial Chess 3D",
        subtitle: "Three.js chess with live seat rooms",
        description: "A cinematic 3D chess floor with local, AI, and Socket.IO room play, tuned as a premium strategy surface.",
        category: "Strategy Salon",
        type: "3D Chess Arena",
        runtimeKind: "io",
        loadProfile: "heavy",
        accessLevel: "open",
        authRequired: false,
        accountMode: "none",
        preferredEntry: "dist/index.html",
        accent: "#9cb8ff",
        accentAlt: "#28366e",
        mark: "CHSS",
        releasePhase: "Live Build",
        presentation: {
            requireLandscape: false,
            preferredOrientation: "any",
            viewportProfile: "immersive",
            minStageHeight: 500
        },
        capabilities: {
            audio: true,
            fullscreen: true,
            pause: true,
            pointerLock: false,
            touch: true,
            multiplayer: true,
            bridge: false
        },
        socketNamespace: "/premium-chess",
        tags: ["Socket.IO Match Rooms", "3D Strategy", "AI + Online"]
    },
    {
        id: "chopsticks-3d-arena",
        folderName: "chopstick",
        name: "Chopsticks 3D Arena",
        subtitle: "Live Strategy Hand Duel",
        description: "Battle through a polished chopsticks arena with 3D hands, quick room codes, practice mode, and live multiplayer rounds served directly from GameHub.",
        category: "Strategy Salon",
        type: "Online Duel",
        runtimeKind: "io",
        loadProfile: "realtime",
        accessLevel: "open",
        authRequired: false,
        accountMode: "none",
        preferredEntryPath: "games/chopstick/dist/index.html",
        directEntryPath: "games/chopstick/index.html",
        accent: "#d3b07b",
        accentAlt: "#4f6286",
        mark: "CHOP",
        releasePhase: "Live Build",
        presentation: {
            requireLandscape: true,
            preferredOrientation: "landscape",
            viewportProfile: "immersive",
            minStageHeight: 480
        },
        capabilities: {
            audio: true,
            fullscreen: true,
            pause: false,
            pointerLock: false,
            touch: true,
            multiplayer: true,
            bridge: false
        },
        tags: ["Socket.IO Rooms", "Practice Mode", "3D Hands"]
    },
    {
        id: "handrex",
        folderName: "handcricket",
        name: "MH Handrex",
        subtitle: "Premium multiplayer hand cricket suite",
        description: "A structured realtime hand cricket product with draft, lobby, toss, match, and room flows elevated into the premium catalog.",
        category: "Realtime Sports Room",
        type: "Live Hand Cricket",
        runtimeKind: "io",
        loadProfile: "realtime",
        accessLevel: "open",
        authRequired: false,
        accountMode: "none",
        preferredEntry: "dist/index.html",
        accent: "#8bf0c2",
        accentAlt: "#194f45",
        mark: "HAND",
        releasePhase: "Live Suite",
        presentation: {
            requireLandscape: true,
            preferredOrientation: "landscape",
            viewportProfile: "balanced",
            minStageHeight: 460
        },
        capabilities: {
            audio: true,
            fullscreen: true,
            pause: true,
            pointerLock: false,
            touch: true,
            multiplayer: true,
            bridge: false
        },
        socketNamespace: "/premium-handcricket",
        tags: ["Socket.IO Multiplayer", "Sports UI", "Room Play"]
    },
    {
        id: "stick-titan",
        folderName: "stick-titan",
        name: "Stick Titan",
        subtitle: "Firebase combat progression build",
        description: "A premium combat prototype with Firebase-backed progression, mode switching, boss flow, and a bold 2.5D presentation.",
        category: "Combat Prestige",
        type: "2.5D Arena Fighter",
        runtimeKind: "3d",
        loadProfile: "heavy",
        accessLevel: "open",
        authRequired: false,
        accountMode: "firebase-in-game",
        authProvider: "firebase",
        preferredEntry: "dist/index.html",
        accent: "#ff985f",
        accentAlt: "#62311f",
        mark: "TITN",
        releasePhase: "Account Ready",
        presentation: {
            requireLandscape: true,
            preferredOrientation: "landscape",
            viewportProfile: "immersive",
            minStageHeight: 500
        },
        capabilities: {
            audio: true,
            fullscreen: true,
            pause: true,
            pointerLock: false,
            touch: true,
            multiplayer: false,
            bridge: false
        },
        tags: ["Firebase Progression", "Boss Combat", "Premium Fighter"]
    },
    {
        id: "ludo-3d-royale",
        folderName: "3d-ludo",
        name: "3D Ludo Royale",
        subtitle: "Ivory Royale board arena",
        description: "A premium 3D Ludo table with local play, bot modes, animated tokens, dice flow, captures, safe cells, and home-lane rules.",
        category: "Premium Board",
        type: "Online Board Game",
        runtimeKind: "io",
        loadProfile: "realtime",
        accessLevel: "open",
        authRequired: false,
        accountMode: "none",
        preferredEntry: "3d-ludo-royale/dist/index.html",
        directEntryPath: "premium/premium-games/3d-ludo/3d-ludo-royale/index.html",
        accent: "#c69a56",
        accentAlt: "#714c26",
        mark: "LUDO",
        releasePhase: "Board Ready",
        presentation: {
            requireLandscape: false,
            preferredOrientation: "any",
            viewportProfile: "immersive",
            minStageHeight: 480
        },
        capabilities: {
            audio: true,
            fullscreen: true,
            pause: false,
            pointerLock: false,
            touch: true,
            multiplayer: true,
            bridge: false
        },
        socketNamespace: "/premium-ludo",
        tags: ["Socket.IO Rooms", "Public Matchmaking", "3D Board"]
    },
    {
        id: "rubik-3d",
        folderName: "3d-rubik",
        name: "3D Rubik",
        subtitle: "Premium cube console",
        description: "A polished 3D Rubik's Cube with real cubie rotations, touch and mouse controls, scramble, undo, missions, and best-score tracking.",
        category: "Premium Puzzle",
        type: "3D Puzzle",
        runtimeKind: "3d",
        loadProfile: "standard",
        accessLevel: "open",
        authRequired: false,
        accountMode: "none",
        preferredEntry: "dist/index.html",
        accent: "#d4b06f",
        accentAlt: "#315d86",
        mark: "CUBE",
        releasePhase: "Puzzle Ready",
        presentation: {
            requireLandscape: false,
            preferredOrientation: "landscape",
            viewportProfile: "balanced",
            minStageHeight: 460
        },
        capabilities: {
            audio: true,
            fullscreen: true,
            pause: true,
            pointerLock: false,
            touch: true,
            multiplayer: false,
            bridge: false
        },
        tags: ["3D Puzzle", "Touch Controls", "Missions"]
    },
    {
        id: "snake-ladder-3d-royale",
        folderName: "3d-snake-and-ladder",
        name: "3D Snake & Ladder Royale",
        subtitle: "Royal dice board with rooms and bots",
        description: "A premium 3D Snake and Ladder board game with local play, bots, private rooms, public matchmaking, animated dice, and cinematic board moments.",
        category: "Premium Board",
        type: "Online Dice Board",
        runtimeKind: "io",
        loadProfile: "realtime",
        accessLevel: "open",
        authRequired: false,
        accountMode: "none",
        preferredEntry: "dist/index.html",
        accent: "#d8b678",
        accentAlt: "#2b241d",
        mark: "SNL",
        releasePhase: "Board Ready",
        presentation: {
            requireLandscape: false,
            preferredOrientation: "any",
            viewportProfile: "immersive",
            minStageHeight: 500
        },
        capabilities: {
            audio: true,
            fullscreen: true,
            pause: true,
            pointerLock: false,
            touch: true,
            multiplayer: true,
            bridge: false
        },
        socketNamespace: "/premium-snake-ladder",
        tags: ["Socket.IO Rooms", "Public Matchmaking", "3D Board"]
    },
    {
        id: "archery-3d",
        folderName: "3d-archery",
        name: "3D Archery",
        subtitle: "Whisper Range precision shots",
        description: "A premium Three.js archery range with precision, time attack, and one-shot rounds plus staged wind, motion, scoring, and feedback.",
        category: "Premium Skill",
        type: "3D Precision Sport",
        runtimeKind: "3d",
        loadProfile: "heavy",
        accessLevel: "open",
        authRequired: false,
        accountMode: "none",
        preferredEntry: "dist/index.html",
        accent: "#d3ac74",
        accentAlt: "#3f5b42",
        mark: "AIM",
        releasePhase: "Range Ready",
        presentation: {
            requireLandscape: true,
            preferredOrientation: "landscape",
            viewportProfile: "immersive",
            minStageHeight: 500
        },
        capabilities: {
            audio: true,
            fullscreen: true,
            pause: true,
            pointerLock: false,
            touch: true,
            multiplayer: false,
            bridge: false
        },
        tags: ["3D Sport", "Precision", "Local Scores"]
    },
    {
        id: "golf-3d",
        folderName: "3d-golf",
        name: "Ivory Golf Royale 3D",
        subtitle: "Premium trick-shot mini golf",
        description: "A premium local and online 3D mini golf course with solo play, time trials, challenges, pass-and-play, bot matches, private rooms, and public matchmaking.",
        category: "Premium Sport",
        type: "3D Mini Golf",
        runtimeKind: "io",
        loadProfile: "realtime",
        accessLevel: "open",
        authRequired: false,
        accountMode: "none",
        preferredEntry: "dist/index.html",
        accent: "#c5a15d",
        accentAlt: "#2f6f50",
        mark: "GOLF",
        releasePhase: "Course Ready",
        presentation: {
            requireLandscape: true,
            preferredOrientation: "landscape",
            viewportProfile: "immersive",
            minStageHeight: 500
        },
        capabilities: {
            audio: true,
            fullscreen: true,
            pause: true,
            pointerLock: false,
            touch: true,
            multiplayer: true,
            bridge: true
        },
        socketNamespace: "/premium-golf",
        tags: ["3D Mini Golf", "Socket.IO Rooms", "Trick Shots"]
    }
];

function fileExists(rootDir, relativePath) {
    try {
        return fs.existsSync(path.join(rootDir, relativePath));
    } catch (_) {
        return false;
    }
}

function buildThumbnail(entry) {
    const accent = entry.accent || "#7c94ff";
    const accentAlt = entry.accentAlt || "#24335f";
    const name = String(entry.name || "Premium Game");
    const subtitle = String(entry.subtitle || "Premium Experience");
    const mark = String(entry.mark || "PRM");
    const runtime = entry.runtimeKind === "io" ? "Realtime" : entry.runtimeKind === "3d" ? "3D" : "Premium";
    const accessLabel = entry.accountMode === "firebase-in-game"
        ? "ACCOUNT READY"
        : entry.runtimeKind === "io"
            ? "LIVE LOBBY"
            : "PREMIUM";
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720" role="img" aria-label="${name}">
            <defs>
                <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#080d15" />
                    <stop offset="48%" stop-color="#0e1522" />
                    <stop offset="100%" stop-color="#05070d" />
                </linearGradient>
                <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${accent}" />
                    <stop offset="100%" stop-color="${accentAlt}" />
                </linearGradient>
                <radialGradient id="glow" cx="82%" cy="18%" r="80%">
                    <stop offset="0%" stop-color="${accent}" stop-opacity="0.72" />
                    <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
                </radialGradient>
            </defs>
            <rect width="1200" height="720" rx="44" fill="url(#bg)" />
            <rect x="28" y="28" width="1144" height="664" rx="34" fill="rgba(10,15,24,0.82)" stroke="rgba(255,255,255,0.08)" />
            <circle cx="920" cy="136" r="220" fill="url(#glow)" />
            <path d="M76 600 C240 508 354 506 532 596" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2" />
            <path d="M664 600 C802 510 944 500 1118 594" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2" />
            <rect x="84" y="78" width="274" height="44" rx="22" fill="rgba(255,255,255,0.08)" />
            <text x="116" y="108" font-family="Segoe UI, Arial, sans-serif" font-size="24" fill="#d6c6ae" letter-spacing="5">${accessLabel}</text>
            <text x="84" y="324" font-family="Georgia, serif" font-size="118" font-weight="700" fill="url(#accent)">${mark}</text>
            <text x="84" y="410" font-family="Georgia, serif" font-size="54" font-weight="700" fill="#f5efe5">${name}</text>
            <text x="84" y="470" font-family="Segoe UI, Arial, sans-serif" font-size="30" fill="#bac6dc">${subtitle}</text>
            <rect x="836" y="516" width="250" height="110" rx="28" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.1)" />
            <text x="961" y="570" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="30" fill="#eef4ff">${runtime}</text>
            <text x="961" y="606" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="22" fill="#d4c8b4">${entry.releasePhase || "Premium"}</text>
        </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function cloneEntry(entry, order) {
    return {
        ...entry,
        order,
        visible: entry.visible !== false,
        ageRating: entry.ageRating || "12+",
        storageNamespace: entry.storageNamespace || `gamehubPremium.${entry.id}`,
        thumbnail: entry.thumbnail || PREMIUM_GAME_IMAGE_OVERRIDES.get(entry.id) || buildThumbnail(entry),
        capabilities: entry.capabilities ? { ...entry.capabilities } : {},
        presentation: entry.presentation ? { ...entry.presentation } : {},
        tags: Array.isArray(entry.tags) ? [...entry.tags] : []
    };
}

function resolveGameEntry(rootDir, definition, order) {
    const premiumFolder = definition.folderPath || path.posix.join("premium", "premium-games", definition.folderName);
    const preferredEntry = definition.preferredEntryPath || path.posix.join(premiumFolder, definition.preferredEntry || "dist/index.html");
    const directEntry = definition.directEntryPath || path.posix.join(premiumFolder, "index.html");
    if (!fileExists(rootDir, preferredEntry)) {
        return null;
    }

    return cloneEntry({
        ...definition,
        folderPath: premiumFolder,
        preferredEntry: `/${preferredEntry}`,
        directEntry: `/${directEntry}`,
        path: `/${preferredEntry}`
    }, order);
}

function buildPremiumCatalog(rootDir) {
    return PREMIUM_GAME_DEFINITIONS
        .map((definition, index) => resolveGameEntry(rootDir, definition, index))
        .filter(Boolean);
}

function createPremiumRegistry(rootDir) {
    let cache = null;

    return {
        async listGames(options = {}) {
            const forceReload = options.force === true;
            const now = Date.now();
            if (!forceReload && cache && now - cache.at < PREMIUM_CATALOG_CACHE_TTL_MS) {
                return cache.games.map((game) => cloneEntry(game, game.order));
            }

            const games = buildPremiumCatalog(rootDir);
            cache = {
                at: now,
                games
            };

            return games.map((game) => cloneEntry(game, game.order));
        },
        async getGameById(gameId, options = {}) {
            const games = await this.listGames(options);
            return games.find((game) => game.id === gameId) || null;
        },
        invalidate() {
            cache = null;
        }
    };
}

module.exports = {
    PREMIUM_GAME_DEFINITIONS,
    createPremiumRegistry
};

