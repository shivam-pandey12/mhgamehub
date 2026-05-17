(() => {
    "use strict";

    const STORAGE_KEYS = {
        favorites: "gamehubFavorites",
        theme: "gamehubTheme",
        stats: "gamehubStats",
        recent: "gamehubRecentGames"
    };

    const PALETTES = [
        { accent: "#c7a46a", accentAlt: "#8f6c4f" },
        { accent: "#d2b48c", accentAlt: "#9f7b5d" },
        { accent: "#d1b38a", accentAlt: "#7c6253" },
        { accent: "#c9b08c", accentAlt: "#85644a" },
        { accent: "#ba9670", accentAlt: "#5d4b45" },
        { accent: "#d8be98", accentAlt: "#8f7159" }
    ];

    const LANDSCAPE_REQUIRED_IDS = new Set([
        "3dshooter",
        "cid-pakad",
        "battlefield-codex",
        "car-wrestling",
        "chopsticks-3d-arena",
        "flappy-mech",
        "intergalactic-space-war",
        "night-traffic-run",
        "shadow-fighter-duel",
        "stick-hero",
        "skill-parking-simulator"
    ]);

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
        ["cid-pakad", "/games/game_images/cid%20pakad.png"],
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

    let catalogPromise = null;

    function escapeXml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");
    }

    function slugify(value) {
        return String(value || "")
            .toLowerCase()
            .replace(/\.html?$/i, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    function normalizePath(value) {
        if (!value) {
            return "";
        }

        let normalized = String(value).trim();

        try {
            normalized = decodeURI(normalized);
        } catch (_) {
            // Keep the original string if decoding fails.
        }

        normalized = normalized.replace(/^https?:\/\/[^/]+/i, "");
        normalized = normalized.replace(/\\/g, "/");
        normalized = normalized.replace(/^\/+/, "");
        normalized = normalized.replace(/^\.\//, "");

        return normalized.toLowerCase();
    }

    function titleizeFileName(fileName) {
        return String(fileName || "Untitled Game")
            .replace(/\.html?$/i, "")
            .replace(/[-_]+/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    }

    function createMark(name) {
        const compact = String(name || "")
            .replace(/[^a-z0-9]/gi, "")
            .toUpperCase();

        return compact.slice(0, 6) || "GAME";
    }

    function normalizeRuntimeKind(value) {
        const normalized = String(value || "").trim().toLowerCase();
        if (["2d", "3d", "io", "static"].includes(normalized)) {
            return normalized;
        }

        return "2d";
    }

    function normalizeLoadProfile(value) {
        const normalized = String(value || "").trim().toLowerCase();
        if (["instant", "standard", "heavy", "realtime"].includes(normalized)) {
            return normalized;
        }

        return "standard";
    }

    function normalizePresentation(rawGame, runtimeKind, loadProfile, id) {
        const source = rawGame.presentation && typeof rawGame.presentation === "object"
            ? rawGame.presentation
            : {};

        const explicitLandscapeRequirement = source.requireLandscape
            ?? rawGame.requireLandscape
            ?? rawGame.landscapeOnly;
        const defaultLandscapeRequirement = LANDSCAPE_REQUIRED_IDS.has(id) || runtimeKind === "3d" || runtimeKind === "io";
        const requireLandscape = Boolean(
            explicitLandscapeRequirement ?? defaultLandscapeRequirement
        );

        const preferredOrientation = String(
            source.preferredOrientation
            || rawGame.preferredOrientation
            || (requireLandscape ? "landscape" : "any")
        ).toLowerCase();

        const viewportProfile = String(
            source.viewportProfile
            || rawGame.viewportProfile
            || ((runtimeKind === "3d" || runtimeKind === "io" || loadProfile === "heavy") ? "immersive" : "balanced")
        ).toLowerCase();

        const minStageHeight = Math.max(
            320,
            Number(
                source.minStageHeight
                || rawGame.minStageHeight
                || (viewportProfile === "immersive" ? 420 : 360)
            ) || (viewportProfile === "immersive" ? 420 : 360)
        );

        return {
            requireLandscape,
            preferredOrientation,
            viewportProfile,
            minStageHeight
        };
    }

    function pickPalette(seed) {
        const hash = [...String(seed || "game")].reduce((total, char) => total + char.charCodeAt(0), 0);
        return PALETTES[hash % PALETTES.length];
    }

    function buildThumbnail(game) {
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" role="img" aria-label="${escapeXml(game.name)}">
                <defs>
                    <linearGradient id="panel" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#fbf4ea" />
                        <stop offset="100%" stop-color="#ead9c2" />
                    </linearGradient>
                    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="${escapeXml(game.accent)}" />
                        <stop offset="100%" stop-color="${escapeXml(game.accentAlt)}" />
                    </linearGradient>
                    <radialGradient id="glow" cx="20%" cy="15%" r="90%">
                        <stop offset="0%" stop-color="rgba(255,255,255,0.9)" />
                        <stop offset="100%" stop-color="rgba(255,255,255,0)" />
                    </radialGradient>
                </defs>
                <rect width="800" height="480" rx="36" fill="url(#panel)" />
                <rect x="30" y="28" width="740" height="424" rx="28" fill="#fffaf4" stroke="rgba(53,37,26,0.12)" stroke-width="2" />
                <circle cx="670" cy="120" r="120" fill="url(#accent)" opacity="0.22" />
                <circle cx="156" cy="388" r="136" fill="${escapeXml(game.accentAlt)}" opacity="0.18" />
                <rect x="72" y="84" width="238" height="42" rx="21" fill="#ffffff" opacity="0.82" />
                <text x="96" y="113" font-family="Arial, sans-serif" font-size="22" fill="#74553d" letter-spacing="4">${escapeXml((game.category || "Arcade").toUpperCase())}</text>
                <text x="72" y="244" font-family="Arial, sans-serif" font-size="98" font-weight="700" fill="url(#accent)">${escapeXml(game.mark)}</text>
                <text x="72" y="316" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="#2f2116">${escapeXml(game.name)}</text>
                <text x="72" y="356" font-family="Arial, sans-serif" font-size="24" fill="#6b5847">${escapeXml(game.subtitle || "Browser Game")}</text>
                <rect x="510" y="282" width="206" height="96" rx="28" fill="url(#accent)" opacity="0.92" />
                <text x="613" y="340" font-family="Arial, sans-serif" font-size="26" font-weight="700" text-anchor="middle" fill="#fffaf4">${escapeXml(game.ageRating || "7+")}</text>
                <rect x="30" y="28" width="740" height="424" rx="28" fill="url(#glow)" opacity="0.36" />
            </svg>
        `;

        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    }

    function findPublicThumbnail({ id, fileName, name }) {
        const keys = [id, fileName, name]
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

    function normalizeGame(rawGame, index) {
        const fileName = rawGame.fileName || rawGame.path || `game-${index + 1}.html`;
        const fallbackName = titleizeFileName(fileName);
        const palette = pickPalette(rawGame.id || fileName);
        const name = rawGame.name || fallbackName;
        const subtitle = rawGame.subtitle || rawGame.type || "Browser Game";
        const category = rawGame.category || rawGame.genre || "Arcade";
        const type = rawGame.type || "Single Player";
        const ageRating = rawGame.ageRating || rawGame.age || "7+";
        const accent = rawGame.accent || palette.accent;
        const accentAlt = rawGame.accentAlt || palette.accentAlt;
        const mark = rawGame.mark || createMark(name);
        const path = String(rawGame.path || `games/${fileName}`).replace(/\\/g, "/");
        const description = rawGame.description || "A local HTML game loaded directly from the games folder.";
        const id = slugify(rawGame.id || fileName || name || `game-${index + 1}`);
        const thumbnail = rawGame.thumbnail || rawGame.thumbnailUrl || findPublicThumbnail({ id, fileName, name });
        const runtimeKind = normalizeRuntimeKind(rawGame.runtimeKind);
        const loadProfile = normalizeLoadProfile(rawGame.loadProfile);
        const storageNamespace = String(rawGame.storageNamespace || `gamehub.${id}`);
        const presentation = normalizePresentation(rawGame, runtimeKind, loadProfile, id);
        const capabilities = rawGame.capabilities && typeof rawGame.capabilities === "object"
            ? {
                audio: rawGame.capabilities.audio !== false,
                fullscreen: rawGame.capabilities.fullscreen !== false,
                pause: rawGame.capabilities.pause !== false,
                pointerLock: rawGame.capabilities.pointerLock === true,
                touch: rawGame.capabilities.touch === true,
                multiplayer: rawGame.capabilities.multiplayer === true,
                bridge: rawGame.capabilities.bridge === true
            }
            : {
                audio: true,
                fullscreen: true,
                pause: runtimeKind !== "static",
                pointerLock: false,
                touch: false,
                multiplayer: runtimeKind === "io",
                bridge: false
            };

        const game = {
            id,
            fileName,
            name,
            subtitle,
            description,
            ageRating,
            requiresAgeConfirmation: rawGame.requiresAgeConfirmation === true || rawGame.requires18Confirmation === true,
            contentWarning: rawGame.contentWarning || rawGame.warning || "",
            category,
            type,
            path,
            pathEncoded: encodeURI(path),
            preferredEntry: String(rawGame.preferredEntry || path).replace(/\\/g, "/"),
            accent,
            accentAlt,
            mark,
            order: Number(rawGame.order) || index,
            thumbnail: thumbnail || "",
            runtimeKind,
            loadProfile,
            storageNamespace,
            presentation,
            capabilities,
            searchText: ""
        };

        game.thumbnail = game.thumbnail || buildThumbnail(game);
        game.searchText = [
            game.name,
            game.subtitle,
            game.description,
            game.category,
            game.type,
            game.ageRating,
            game.runtimeKind,
            game.loadProfile,
            game.presentation.preferredOrientation,
            game.presentation.viewportProfile,
            game.fileName,
            game.path
        ]
            .join(" ")
            .toLowerCase();

        return game;
    }

    function sortGames(games) {
        return [...games].sort((left, right) => {
            if (left.order !== right.order) {
                return left.order - right.order;
            }

            return left.name.localeCompare(right.name);
        });
    }

    async function fetchCatalog() {
        const response = await fetch("/api/games-catalog", {
            headers: { Accept: "application/json" },
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(`Catalog request failed with status ${response.status}`);
        }

        const payload = await response.json();
        return Array.isArray(payload.games) ? payload.games : [];
    }

    async function loadGamesCatalog(forceReload = false) {
        if (!forceReload && catalogPromise) {
            return catalogPromise;
        }

        catalogPromise = fetchCatalog()
            .then((games) => {
                const normalizedGames = sortGames(games.map(normalizeGame)).map((game, index) => ({
                    ...game,
                    order: index
                }));
                const gamesById = new Map(normalizedGames.map((game) => [game.id, game]));

                window.GameHubCatalog.games = normalizedGames;
                window.GameHubCatalog.gamesById = gamesById;

                return {
                    games: normalizedGames,
                    gamesById
                };
            })
            .catch((error) => {
                console.error("Failed to load GameHub catalog:", error);

                const emptyCatalog = {
                    games: [],
                    gamesById: new Map()
                };

                window.GameHubCatalog.games = emptyCatalog.games;
                window.GameHubCatalog.gamesById = emptyCatalog.gamesById;

                return emptyCatalog;
            });

        return catalogPromise;
    }

    function resolveGames(source) {
        if (Array.isArray(source)) {
            return source;
        }

        return Array.isArray(window.GameHubCatalog.games) ? window.GameHubCatalog.games : [];
    }

    function getGameById(source, id) {
        const games = resolveGames(source);
        if (!games.length) {
            return null;
        }

        const rawId = String(id || "").trim();
        if (!rawId) {
            return games[0];
        }

        const directMatch = games.find((game) => game.id === rawId);
        if (directMatch) {
            return directMatch;
        }

        const normalized = normalizePath(rawId);
        return (
            games.find((game) => normalizePath(game.path) === normalized || normalizePath(game.pathEncoded) === normalized) ||
            games[0]
        );
    }

    function getSuggestedGames(source, currentId, limit = 4) {
        const games = resolveGames(source);
        const currentGame = getGameById(games, currentId);
        const pool = games.filter((game) => !currentGame || game.id !== currentGame.id);

        if (!currentGame) {
            return pool.slice(0, limit);
        }

        return pool
            .map((game) => {
                let score = 0;

                if (game.category === currentGame.category) {
                    score += 4;
                }

                if (game.type === currentGame.type) {
                    score += 2;
                }

                if (game.ageRating === currentGame.ageRating) {
                    score += 1;
                }

                return { game, score };
            })
            .sort((left, right) => {
                if (left.score !== right.score) {
                    return right.score - left.score;
                }

                return left.game.order - right.game.order;
            })
            .slice(0, limit)
            .map((entry) => entry.game);
    }

    window.GameHubCatalog = {
        games: [],
        gamesById: new Map(),
        storageKeys: STORAGE_KEYS,
        slugify,
        normalizePath,
        buildThumbnail,
        loadGamesCatalog,
        getGameById,
        getSuggestedGames
    };
})();
