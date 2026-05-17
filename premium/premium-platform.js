(function attachPremiumPlatform() {
    "use strict";

    const STORAGE_KEYS = {
        theme: "gamehubPremium.theme",
        watchlist: "gamehubPremium.watchlist",
        recent: "gamehubPremium.recent",
        stats: "gamehubPremium.stats",
        authIntent: "gamehubPremium.authIntent",
        transition: "gamehubPremium.transition",
        sharedFirebaseConfig: "gamehubPremium.sharedFirebaseConfig",
        sharedIdentity: "gamehubPremium.sharedIdentity",
        sharedTicket: "gamehubPremium.sharedTicket"
    };
    const PREMIUM_GAME_IMAGE_OVERRIDES = new Map([
        ["spaceship-race", "/premium/premium-games/premium_game_image/3d%20spaceship%20race.png"],
        ["carrom-3d", "/premium/premium-games/premium_game_image/3d%20carrom%20.png"],
        ["imperial-chess", "/premium/premium-games/premium_game_image/3d%20chess.png"],
        ["chopsticks-3d-arena", "/premium/premium-games/premium_game_image/chopstick%20game.png"],
        ["handrex", "/premium/premium-games/premium_game_image/hand%20cricket.png"],
        ["stick-titan", "/premium/premium-games/premium_game_image/stick%20titan.png"]
    ]);

    const TRANSITION_PORTAL_ID = "premium-nav-transition";
    const REVEAL_SELECTOR = [
        ".premium-header",
        ".premium-hero",
        ".premium-section-heading",
        ".premium-search-section",
        ".premium-recent-section",
        ".premium-ribbon-card",
        ".premium-rail-card",
        ".premium-recent-card",
        ".premium-stat-card",
        ".premium-feature-card",
        ".premium-skyline-card",
        ".premium-signal-section",
        ".premium-signal-card",
        ".premium-catalog-section",
        ".premium-game-card",
        ".premium-auth-band",
        ".premium-login-card",
        ".premium-player-stage",
        ".premium-player-sidebar",
        ".premium-empty-card",
        ".premium-empty-state",
        ".premium-footer"
    ].join(", ");
    const TILT_SELECTOR = [
        ".premium-game-card",
        ".premium-feature-card",
        ".premium-skyline-card",
        ".premium-ribbon-card",
        ".premium-rail-card",
        ".premium-recent-card",
        ".premium-stat-card",
        ".premium-signal-card"
    ].join(", ");

    const ICONS = {
        arrowLeft: `<path d="M14.8 5.3 8.1 12l6.7 6.7" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"></path>`,
        arrowRight: `<path d="M9.2 5.3 15.9 12l-6.7 6.7" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"></path>`,
        bolt: `<path d="M13.2 2.1 5.9 12.8h4.5l-1.1 9.1 7.9-11.5h-4.6l.6-8.3Z" fill="currentColor"></path>`,
        check: `<path d="m5.6 12.7 4.1 4.1 8.7-9.3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>`,
        clock: `<circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" stroke-width="1.8"></circle><path d="M12 7.1v5l3.3 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
        crown: `<path d="M4.2 17.8h15.6l-1.2-8.9-4.4 4.2L12 6.2 9.8 13.1 5.4 8.9l-1.2 8.9Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"></path><path d="M7.2 20.2h9.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>`,
        diamond: `<path d="m12 3.2 7.2 8.3L12 20.8 4.8 11.5 12 3.2Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path><path d="M9.1 7.4h5.8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path>`,
        film: `<rect x="4" y="5.2" width="16" height="13.6" rx="2.2" fill="none" stroke="currentColor" stroke-width="1.8"></rect><path d="M8 5.6v13M16 5.6v13M4.8 9.2h14.4M4.8 14.8h14.4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"></path>`,
        gamepad: `<path d="M6.1 8.2h11.8c1.5 0 2.6 1 2.9 2.4l1 4.7c.4 1.8-1 3.5-2.7 3.5-1 0-1.9-.4-2.5-1.1l-1.6-1.8H9.1l-1.6 1.8c-.6.7-1.5 1.1-2.5 1.1-1.7 0-3.1-1.7-2.7-3.5l1-4.7c.3-1.4 1.4-2.4 2.8-2.4Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path><path d="M8.1 11.4v3.1M6.6 13h3M16.2 12.2h.1M18.3 14.1h.1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>`,
        grid: `<path d="M4.1 4.1h6.8v6.8H4.1Zm9 0h6.8v6.8h-6.8Zm-9 9h6.8v6.8H4.1Zm9 0h6.8v6.8h-6.8Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"></path>`,
        key: `<path d="M14.4 10.2a3.8 3.8 0 1 0-1.2 2.8L20 19.8h1.4v-2.3h-2.3v-2.3h-2.3V13l-1.1-1.1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
        layers: `<path d="m12 4 8 4.4-8 4.4-8-4.4L12 4Z" fill="currentColor"></path><path d="m4 12 8 4.3 8-4.3M4 15.8 12 20l8-4.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
        lock: `<rect x="4.9" y="10.2" width="14.2" height="9.8" rx="2.4" fill="none" stroke="currentColor" stroke-width="1.8"></rect><path d="M8.3 10.2V7.9a3.7 3.7 0 1 1 7.4 0v2.3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path><circle cx="12" cy="14.9" r="1.2" fill="currentColor"></circle>`,
        moon: `<path d="M15.1 3.2a8.8 8.8 0 1 0 5.7 15 9.5 9.5 0 0 1-5.7-15Z" fill="currentColor"></path>`,
        orbit: `<circle cx="12" cy="12" r="2.2" fill="currentColor"></circle><path d="M4.1 13.5c2.2-4.9 6.7-7.5 10.1-5.8s4.3 7.1 2.1 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path><path d="M7.1 4.8c5.3-.7 9.8 1.6 10.2 5.4s-3.3 7.6-8.6 8.3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path>`,
        play: `<path d="M8 5.9v12.2L18.1 12 8 5.9Z" fill="currentColor"></path>`,
        radar: `<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.7"></circle><path d="M12 12 18.6 8.9M12 12 7.2 15.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path><path d="M12 4.7a7.3 7.3 0 0 1 7.3 7.3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>`,
        search: `<circle cx="10.6" cy="10.6" r="5.8" fill="none" stroke="currentColor" stroke-width="1.9"></circle><path d="m15 15 5 5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"></path>`,
        shield: `<path d="M12 3.7 19 6.5v5.4c0 4.3-2.5 7-7 8.4-4.5-1.4-7-4.1-7-8.4V6.5L12 3.7Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path><path d="m9.1 12.4 1.9 1.9 4-4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
        spark: `<path d="M12 2.7 13.9 9l6.4 1.9-6.4 1.9L12 19l-1.9-6.2-6.4-1.9L10.1 9 12 2.7Z" fill="currentColor"></path>`,
        sun: `<circle cx="12" cy="12" r="4.1" fill="currentColor"></circle><path d="M12 2.6v2.7M12 18.7v2.7M5 5l1.9 1.9M17.1 17.1 19 19M2.6 12h2.7M18.7 12h2.7M5 19l1.9-1.9M17.1 6.9 19 5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path>`,
        ticket: `<path d="M4.2 8.2h15.6v3.2a2 2 0 0 0 0 4V18H4.2v-2.6a2 2 0 0 0 0-4V8.2Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path><path d="M12 8.5v9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="1.6 1.6" stroke-linecap="round"></path>`,
        user: `<circle cx="12" cy="8" r="3.2" fill="none" stroke="currentColor" stroke-width="1.8"></circle><path d="M5.1 19.1a8.3 8.3 0 0 1 13.8 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>`,
        wave: `<path d="M3.2 12.8c2.3 0 2.3-5.6 4.7-5.6s2.3 9.6 4.7 9.6 2.3-6.5 4.7-6.5 2.3 2.5 4.7 2.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"></path>`
    };

    let catalogPromise = null;
    let revealObserver = null;
    let revealRefreshFrame = 0;
    let scrollProgressFrame = 0;

    function icon(name, extraClasses = "") {
        const body = ICONS[name] || ICONS.spark;
        const classes = ["premium-icon", extraClasses].filter(Boolean).join(" ");
        return `<svg class="${classes}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${body}</svg>`;
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function slugify(value) {
        return String(value || "")
            .toLowerCase()
            .replace(/\.html?$/i, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    function normalizeSitePathname(pathname) {
        const value = String(pathname || "");
        if (!value) {
            return "/";
        }

        const cleanRoutes = new Map([
            ["/index.html", "/"],
            ["/gamehub.html", "/gamehub"],
            ["/play.html", "/play"],
            ["/new-game-renderer.html", "/play"],
            ["/documentation.html", "/documentation"],
            ["/premium.html", "/premium"],
            ["/premium/index.html", "/premium"],
            ["/premium/play.html", "/premium/play"],
            ["/premium/login.html", "/premium/login"]
        ]);

        return cleanRoutes.get(value) || value;
    }

    function normalizeInternalUrl(href) {
        const url = href instanceof URL
            ? new URL(href.toString())
            : new URL(String(href || ""), window.location.origin);

        if (url.origin === window.location.origin) {
            url.pathname = normalizeSitePathname(url.pathname);
        }

        return url;
    }

    function syncCanonicalLocation() {
        const canonicalPath = normalizeSitePathname(window.location.pathname);
        if (canonicalPath === window.location.pathname) {
            return;
        }

        const nextUrl = `${canonicalPath}${window.location.search}${window.location.hash}`;
        window.history.replaceState(window.history.state, "", nextUrl);
    }

    function normalizeRuntimeKind(value) {
        const normalized = String(value || "").trim().toLowerCase();
        return ["2d", "3d", "io", "static"].includes(normalized) ? normalized : "3d";
    }

    function normalizeLoadProfile(value) {
        const normalized = String(value || "").trim().toLowerCase();
        return ["instant", "standard", "heavy", "realtime"].includes(normalized) ? normalized : "standard";
    }

    function normalizeAccessLevel(value) {
        const normalized = String(value || "").trim();
        if (normalized === "open" || normalized === "member" || normalized === "invite" || normalized === "comingSoon") {
            return normalized;
        }
        return "comingSoon";
    }

    function runtimeLabel(runtimeKind) {
        const labels = {
            "2d": "2D",
            "3d": "3D",
            io: "Realtime",
            static: "Static"
        };
        return labels[normalizeRuntimeKind(runtimeKind)] || "3D";
    }

    function loadProfileLabel(loadProfile) {
        const labels = {
            instant: "Instant",
            standard: "Standard",
            heavy: "Heavy",
            realtime: "Realtime"
        };
        return labels[normalizeLoadProfile(loadProfile)] || "Standard";
    }

    function accessLabel(accessLevel) {
        const labels = {
            open: "Open Access",
            member: "Member Only",
            invite: "Invite Only",
            comingSoon: "Coming Soon"
        };
        return labels[normalizeAccessLevel(accessLevel)] || "Coming Soon";
    }

    function buildThumbnail(game) {
        const accent = escapeHtml(game.accent || "#7c94ff");
        const accentAlt = escapeHtml(game.accentAlt || "#24335f");
        const name = escapeHtml(game.name || "Premium Game");
        const subtitle = escapeHtml(game.subtitle || "Premium Experience");
        const mark = escapeHtml(game.mark || "PREM");
        const label = escapeHtml(accessLabel(game.accessLevel));
        const runtime = escapeHtml(runtimeLabel(game.runtimeKind));
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" role="img" aria-label="${name}">
                <defs>
                    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#0f1726" />
                        <stop offset="55%" stop-color="#121b2d" />
                        <stop offset="100%" stop-color="#0c1019" />
                    </linearGradient>
                    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="${accent}" />
                        <stop offset="100%" stop-color="${accentAlt}" />
                    </linearGradient>
                    <radialGradient id="glow" cx="78%" cy="20%" r="72%">
                        <stop offset="0%" stop-color="${accent}" stop-opacity="0.75" />
                        <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
                    </radialGradient>
                </defs>
                <rect width="800" height="480" rx="34" fill="url(#bg)" />
                <rect x="26" y="24" width="748" height="432" rx="28" fill="rgba(9,14,25,0.82)" stroke="rgba(255,255,255,0.08)" />
                <circle cx="620" cy="118" r="152" fill="url(#glow)" />
                <rect x="68" y="74" width="214" height="36" rx="18" fill="rgba(255,255,255,0.08)" />
                <text x="94" y="99" font-family="Segoe UI, Arial, sans-serif" font-size="20" fill="#d3c6b3" letter-spacing="4">${label.toUpperCase()}</text>
                <text x="68" y="240" font-family="Georgia, serif" font-size="94" font-weight="700" fill="url(#accent)">${mark}</text>
                <text x="68" y="310" font-family="Georgia, serif" font-size="42" font-weight="700" fill="#f4eee4">${name}</text>
                <text x="68" y="352" font-family="Segoe UI, Arial, sans-serif" font-size="25" fill="#b9c3d7">${subtitle}</text>
                <rect x="516" y="300" width="192" height="88" rx="26" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.1)" />
                <text x="612" y="345" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="24" fill="#e3ecff">${runtime}</text>
                <text x="612" y="372" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="18" fill="#d5cab9">Library</text>
            </svg>
        `;

        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    }

    function findPremiumThumbnail(game) {
        const id = slugify(game.id || game.name || "");
        return PREMIUM_GAME_IMAGE_OVERRIDES.get(id) || "";
    }

    function normalizeGame(rawGame, index) {
        const normalizedEntry = String(rawGame.preferredEntry || "")
            .replace(/\\/g, "/")
            .replace(/^(?![a-z]+:\/\/)([^/])/, "/$1");
        const game = {
            ...rawGame,
            id: slugify(rawGame.id || rawGame.name || `premium-${index + 1}`),
            order: Number(rawGame.order ?? index) || index,
            runtimeKind: normalizeRuntimeKind(rawGame.runtimeKind),
            loadProfile: normalizeLoadProfile(rawGame.loadProfile),
            accessLevel: normalizeAccessLevel(rawGame.accessLevel),
            authRequired: rawGame.authRequired === true,
            authProvider: String(rawGame.authProvider || ""),
            accountMode: String(rawGame.accountMode || "none"),
            socketNamespace: String(rawGame.socketNamespace || ""),
            preferredEntry: normalizedEntry,
            accent: rawGame.accent || "#7c94ff",
            accentAlt: rawGame.accentAlt || "#24335f",
            mark: rawGame.mark || String(rawGame.name || "PRM").replace(/[^A-Z0-9]/gi, "").slice(0, 4).toUpperCase(),
            storageNamespace: rawGame.storageNamespace || `gamehubPremium.${slugify(rawGame.id || rawGame.name || index)}`,
            presentation: rawGame.presentation && typeof rawGame.presentation === "object"
                ? {
                    requireLandscape: rawGame.presentation.requireLandscape !== false,
                    preferredOrientation: rawGame.presentation.preferredOrientation || "landscape",
                    viewportProfile: rawGame.presentation.viewportProfile || "immersive",
                    minStageHeight: Number(rawGame.presentation.minStageHeight) || 440
                }
                : {
                    requireLandscape: rawGame.runtimeKind === "3d" || rawGame.runtimeKind === "io",
                    preferredOrientation: "landscape",
                    viewportProfile: "immersive",
                    minStageHeight: 440
                },
            capabilities: rawGame.capabilities && typeof rawGame.capabilities === "object"
                ? { ...rawGame.capabilities }
                : {
                    audio: true,
                    fullscreen: true,
                    pause: true,
                    pointerLock: false,
                    touch: false,
                    multiplayer: rawGame.runtimeKind === "io",
                    bridge: false
                },
            tags: Array.isArray(rawGame.tags) ? rawGame.tags.filter(Boolean).slice(0, 4) : []
        };

        game.path = game.preferredEntry;
        game.pathEncoded = game.preferredEntry ? encodeURI(game.preferredEntry) : "";
        game.thumbnail = rawGame.thumbnail || findPremiumThumbnail(game) || buildThumbnail(game);
        return game;
    }

    async function loadPremiumCatalog(forceReload = false) {
        if (!forceReload && catalogPromise) {
            return catalogPromise;
        }

        catalogPromise = fetch("/api/premium-games-catalog", {
            headers: { Accept: "application/json" },
            cache: "no-store"
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(`Premium catalog request failed with status ${response.status}`);
                }

                const payload = await response.json();
                const games = Array.isArray(payload.games) ? payload.games : [];
                return games.map(normalizeGame).sort((left, right) => left.order - right.order);
            })
            .catch((error) => {
                console.error("Failed to load premium catalog:", error);
                return [];
            });

        return catalogPromise;
    }

    async function loadPremiumSession() {
        if (window.GameHubPremiumAuth && typeof window.GameHubPremiumAuth.ready === "function") {
            try {
                const session = await window.GameHubPremiumAuth.ready();
                if (session && typeof session === "object") {
                    return {
                        authenticated: session.authenticated === true,
                        user: session.user || null,
                        firebaseConfig: session.firebaseConfig || null,
                        ticket: session.ticket || null,
                        mode: session.mode || "firebase-client",
                        provider: session.provider || "firebase",
                        configured: session.configured === true,
                        error: session.error || null
                    };
                }
            } catch (error) {
                console.error("Failed to read premium Firebase client session:", error);
            }
        }

        try {
            const response = await fetch("/api/premium-auth/session", {
                headers: { Accept: "application/json" },
                cache: "no-store"
            });
            if (!response.ok) {
                throw new Error(`Premium session request failed with status ${response.status}`);
            }

            const payload = await response.json();
            return {
                authenticated: payload.authenticated === true,
                user: payload.user || null,
                firebaseConfig: null,
                ticket: null,
                mode: payload.mode || "firebase-pending",
                provider: payload.provider || "firebase",
                configured: payload.configured === true,
                error: payload.error || null
            };
        } catch (error) {
            console.error("Failed to load premium auth session:", error);
            return {
                authenticated: false,
                user: null,
                firebaseConfig: null,
                ticket: null,
                mode: "firebase-pending",
                provider: "firebase",
                configured: false,
                error: error?.message || "Premium auth session could not be loaded."
            };
        }
    }

    function getPremiumGameById(games, id) {
        const list = Array.isArray(games) ? games : [];
        if (!list.length) {
            return null;
        }

        const normalized = slugify(id || "");
        if (!normalized) {
            return list[0];
        }

        return list.find((game) => game.id === normalized) || list[0];
    }

    function getRelatedGames(games, currentId, limit = 3) {
        const currentGame = getPremiumGameById(games, currentId);
        return (Array.isArray(games) ? games : [])
            .filter((game) => !currentGame || game.id !== currentGame.id)
            .map((game) => {
                let score = 0;
                if (currentGame && game.runtimeKind === currentGame.runtimeKind) {
                    score += 4;
                }
                if (currentGame && game.accessLevel === currentGame.accessLevel) {
                    score += 3;
                }
                if (currentGame && game.category === currentGame.category) {
                    score += 2;
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

    function hydrateIcons(root = document) {
        root.querySelectorAll("[data-premium-icon]").forEach((node) => {
            const name = node.getAttribute("data-premium-icon");
            if (!name) {
                return;
            }

            node.outerHTML = icon(name);
        });
    }

    function prefersReducedMotion() {
        return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;
    }

    function collectRevealNodes(root = document) {
        const nodes = [];
        if (root?.matches?.(REVEAL_SELECTOR)) {
            nodes.push(root);
        }
        root?.querySelectorAll?.(REVEAL_SELECTOR)?.forEach((node) => {
            nodes.push(node);
        });
        return nodes;
    }

    function isRevealNodeInView(node) {
        if (!(node instanceof HTMLElement)) {
            return false;
        }

        const rect = node.getBoundingClientRect();
        if ((rect.width === 0 && rect.height === 0) || rect.bottom < 0 || rect.right < 0) {
            return false;
        }

        const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
        return rect.top <= viewportHeight * 1.14 && rect.left <= viewportWidth * 1.08;
    }

    function revealNode(node) {
        node.classList.add("is-visible");
        revealObserver?.unobserve?.(node);
    }

    function refreshRevealVisibility(root = document) {
        collectRevealNodes(root).forEach((node) => {
            if (!(node instanceof HTMLElement) || node.classList.contains("is-visible")) {
                return;
            }

            if (isRevealNodeInView(node)) {
                revealNode(node);
            }
        });
    }

    function queueRevealRefresh(root = document) {
        if (revealRefreshFrame) {
            return;
        }

        revealRefreshFrame = window.requestAnimationFrame(() => {
            revealRefreshFrame = 0;
            refreshRevealVisibility(root);
        });
    }

    function primeReveal(root = document) {
        let revealIndex = 0;
        const observer = getRevealObserver();
        const isMobileReveal = window.matchMedia?.("(max-width: 720px)")?.matches === true;
        const revealStep = isMobileReveal ? 34 : 58;
        const revealCap = isMobileReveal ? 220 : 420;
        collectRevealNodes(root).forEach((node) => {
            if (!(node instanceof HTMLElement) || node.dataset.premiumRevealReady === "1") {
                return;
            }

            node.dataset.premiumRevealReady = "1";
            node.style.setProperty("--premium-reveal-index", String(revealIndex));
            node.style.setProperty("--premium-reveal-delay", `${Math.min(revealIndex * revealStep, revealCap)}ms`);
            node.classList.add("premium-reveal");
            if (observer && !isRevealNodeInView(node)) {
                observer.observe(node);
            } else {
                revealNode(node);
            }
            revealIndex += 1;
        });
        queueRevealRefresh(root);
    }

    function getRevealObserver() {
        if (prefersReducedMotion()) {
            return null;
        }

        if (revealObserver) {
            return revealObserver;
        }

        if (typeof IntersectionObserver !== "function") {
            return null;
        }

        revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                revealNode(entry.target);
            });
        }, {
            rootMargin: "0px 0px 18% 0px",
            threshold: 0.01
        });

        return revealObserver;
    }

    function initPremiumScrollProgress() {
        if (!document.body.matches("[data-premium-page]")) {
            return;
        }

        let progressBar = document.querySelector(".premium-scroll-progress");
        if (!progressBar) {
            progressBar = document.createElement("div");
            progressBar.className = "premium-scroll-progress";
            progressBar.setAttribute("aria-hidden", "true");
            document.body.appendChild(progressBar);
        }

        const writeProgress = () => {
            scrollProgressFrame = 0;
            const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            const progress = Math.min(1, Math.max(0, (window.scrollY || 0) / scrollable));
            document.documentElement.style.setProperty("--premium-scroll-progress-ratio", progress.toFixed(4));
        };

        const schedule = () => {
            if (!scrollProgressFrame) {
                scrollProgressFrame = window.requestAnimationFrame(writeProgress);
            }
        };

        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule, { passive: true });
        schedule();
    }

    function initPremiumPointerEffects() {
        if (!document.body.matches("[data-premium-page]") || prefersReducedMotion()) {
            return;
        }

        const pointerFine = window.matchMedia?.("(pointer: fine)")?.matches === true;
        if (!pointerFine) {
            return;
        }

        let activeCard = null;
        const resetCard = (card) => {
            card.classList.remove("is-tilting");
            card.style.removeProperty("--premium-tilt-x");
            card.style.removeProperty("--premium-tilt-y");
            card.style.removeProperty("--premium-card-mouse-x");
            card.style.removeProperty("--premium-card-mouse-y");
        };

        document.addEventListener("pointermove", (event) => {
            const card = event.target instanceof Element ? event.target.closest(TILT_SELECTOR) : null;
            if (!(card instanceof HTMLElement)) {
                if (activeCard) {
                    resetCard(activeCard);
                    activeCard = null;
                }
                return;
            }

            if (activeCard && activeCard !== card) {
                resetCard(activeCard);
            }
            activeCard = card;
            const rect = card.getBoundingClientRect();
            const x = rect.width ? (event.clientX - rect.left) / rect.width : 0.5;
            const y = rect.height ? (event.clientY - rect.top) / rect.height : 0.5;
            card.classList.add("is-tilting");
            card.style.setProperty("--premium-card-mouse-x", `${(x * 100).toFixed(2)}%`);
            card.style.setProperty("--premium-card-mouse-y", `${(y * 100).toFixed(2)}%`);
            card.style.setProperty("--premium-tilt-x", `${((0.5 - y) * 5).toFixed(2)}deg`);
            card.style.setProperty("--premium-tilt-y", `${((x - 0.5) * 6).toFixed(2)}deg`);
        }, { passive: true });

        document.addEventListener("pointerleave", () => {
            if (!activeCard) {
                return;
            }

            resetCard(activeCard);
            activeCard = null;
        }, { passive: true });
    }

    function initPremiumParallax() {
        if (!document.body.matches("[data-premium-page]") || prefersReducedMotion()) {
            return;
        }

        const root = document.documentElement;
        const pointerFine = window.matchMedia?.("(pointer: fine)")?.matches === true;
        const state = {
            targetX: 0,
            targetY: 0,
            currentX: 0,
            currentY: 0,
            scroll: window.scrollY || 0,
            frame: 0
        };

        const writeVars = () => {
            state.frame = 0;
            state.currentX += (state.targetX - state.currentX) * 0.08;
            state.currentY += (state.targetY - state.currentY) * 0.08;

            const scrollOffset = Math.min(54, Math.max(0, state.scroll * 0.07));
            root.style.setProperty("--premium-parallax-x", `${(state.currentX * 22).toFixed(2)}px`);
            root.style.setProperty("--premium-parallax-y", `${(state.currentY * 18).toFixed(2)}px`);
            root.style.setProperty("--premium-parallax-near-x", `${(state.currentX * -14).toFixed(2)}px`);
            root.style.setProperty("--premium-parallax-near-y", `${(state.currentY * -12).toFixed(2)}px`);
            root.style.setProperty("--premium-scroll-parallax", `${scrollOffset.toFixed(2)}px`);

            if (
                Math.abs(state.targetX - state.currentX) > 0.002
                || Math.abs(state.targetY - state.currentY) > 0.002
            ) {
                schedule();
            }
        };

        const schedule = () => {
            if (!state.frame) {
                state.frame = window.requestAnimationFrame(writeVars);
            }
        };

        if (pointerFine) {
            window.addEventListener("pointermove", (event) => {
                const width = Math.max(1, window.innerWidth);
                const height = Math.max(1, window.innerHeight);
                state.targetX = (event.clientX / width) - 0.5;
                state.targetY = (event.clientY / height) - 0.5;
                schedule();
            }, { passive: true });
        }

        window.addEventListener("scroll", () => {
            state.scroll = window.scrollY || 0;
            schedule();
        }, { passive: true });

        window.addEventListener("resize", schedule, { passive: true });
        schedule();
    }

    function mountTransitionPortal() {
        let portal = document.getElementById(TRANSITION_PORTAL_ID);
        if (portal) {
            return portal;
        }

        portal = document.createElement("div");
        portal.id = TRANSITION_PORTAL_ID;
        portal.className = "premium-nav-transition";
        portal.setAttribute("aria-hidden", "true");
        portal.innerHTML = `
            <div class="premium-nav-transition__veil"></div>
            <div class="premium-nav-transition__panel">
                <div class="premium-loader-rings" aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <strong class="premium-nav-transition__title">Loading</strong>
                <p class="premium-nav-transition__copy">Preparing the next premium view.</p>
                <div class="premium-loader-progress" aria-hidden="true"><span></span></div>
            </div>
        `;
        document.body.appendChild(portal);
        return portal;
    }

    function writeTransitionMarker(marker) {
        try {
            sessionStorage.setItem(STORAGE_KEYS.transition, JSON.stringify(marker || null));
        } catch (_) {
            // Best-effort only.
        }
    }

    function readTransitionMarker() {
        try {
            const raw = sessionStorage.getItem(STORAGE_KEYS.transition);
            return raw ? JSON.parse(raw) : null;
        } catch (_) {
            return null;
        }
    }

    function clearTransitionMarker() {
        try {
            sessionStorage.removeItem(STORAGE_KEYS.transition);
        } catch (_) {
            // Best-effort only.
        }
    }

    function clearTransitionLock() {
        document.body.classList.remove("premium-is-transitioning");
    }

    function resolveTransitionDetails(targetUrl, originHint = "") {
        const pathname = normalizeSitePathname(String(targetUrl?.pathname || ""));
        const searchingLogin = pathname.startsWith("/premium/login");
        const openingPlayer = pathname.startsWith("/premium/play");
        const leavingPremium = pathname === "/" || pathname === "/gamehub";

        if (leavingPremium) {
            return {
                mode: "bridge",
                title: "Returning to GameHub",
                copy: "Crossfading out of the premium shelf and back into the public arcade."
            };
        }

        if (searchingLogin) {
            return {
                mode: "member",
                title: "Opening Member Access",
                copy: "Warming the premium Firebase gateway for a member-authenticated route."
            };
        }

        if (openingPlayer) {
            return {
                mode: "launch",
                title: "Launching Premium Runtime",
                copy: "Sealing the shell and handing control to the heavier premium session."
            };
        }

        if (originHint === "arcade") {
            return {
                mode: "enter",
                title: "Crossing into GameHub Premium",
                copy: "Shifting from the public arcade into the premium deck."
            };
        }

        return {
            mode: "premium",
            title: "Framing the Premium Deck",
            copy: "Recomposing the premium shell for the next destination."
        };
    }

    function updateTransitionPortal(portal, details, direction = "enter") {
        if (!portal) {
            return;
        }

        portal.dataset.mode = details.mode;
        portal.dataset.direction = direction;
        const title = portal.querySelector(".premium-nav-transition__title");
        const copy = portal.querySelector(".premium-nav-transition__copy");
        if (title) {
            title.textContent = details.title;
        }
        if (copy) {
            copy.textContent = details.copy;
        }
    }

    function navigateWithTransition(href, options = {}) {
        if (!href) {
            return;
        }

        const reducedMotion = prefersReducedMotion();
        const resolvedUrl = normalizeInternalUrl(href);
        void options;

        if (reducedMotion) {
            window.location.href = resolvedUrl.toString();
            return;
        }

        const portal = mountTransitionPortal();
        portal.classList.remove("is-visible", "is-entering");
        void portal.offsetWidth;
        portal.classList.add("is-visible", "is-entering");
        document.body.classList.add("premium-is-transitioning");
        window.setTimeout(() => {
            window.location.href = resolvedUrl.toString();
        }, 150);
    }

    function resolveEntryOrigin() {
        const marker = readTransitionMarker();
        const now = Date.now();
        if (marker && typeof marker === "object" && now - Number(marker.at || 0) < 3000) {
            clearTransitionMarker();
            const fromPath = String(marker.from || "");
            return fromPath.includes("gamehub") || fromPath === "/" ? "arcade" : "premium";
        }

        try {
            if (document.referrer) {
                const referrer = new URL(document.referrer);
                if (referrer.origin === window.location.origin) {
                    return referrer.pathname.includes("gamehub") || referrer.pathname === "/"
                        ? "arcade"
                        : (referrer.pathname.startsWith("/premium") ? "premium" : "");
                }
            }
        } catch (_) {
            // Ignore referrer parse issues.
        }

        return "";
    }

    function runEntryTransition() {
        return;
    }

    function isTransitionableAnchor(anchor) {
        if (!(anchor instanceof HTMLAnchorElement)) {
            return false;
        }
        if (anchor.target && anchor.target !== "_self") {
            return false;
        }
        if (anchor.hasAttribute("download")) {
            return false;
        }

        const rawHref = anchor.getAttribute("href");
        if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) {
            return false;
        }

        const resolvedUrl = normalizeInternalUrl(rawHref);
        if (resolvedUrl.origin !== window.location.origin) {
            return false;
        }
        const currentPath = normalizeSitePathname(window.location.pathname);
        if (resolvedUrl.pathname === currentPath && resolvedUrl.search === window.location.search && resolvedUrl.hash) {
            return false;
        }

        return resolvedUrl.pathname.startsWith("/premium")
            || resolvedUrl.pathname === "/"
            || resolvedUrl.pathname === "/gamehub"
            || resolvedUrl.pathname === "/play"
            || resolvedUrl.pathname === "/documentation"
            || resolvedUrl.pathname === "/legal"
            || resolvedUrl.pathname.startsWith("/legal/");
    }

    function bindNavigationTransitions() {
        document.addEventListener("click", (event) => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
            }

            const anchor = event.target?.closest?.("a[href]");
            if (!isTransitionableAnchor(anchor)) {
                return;
            }

            event.preventDefault();
            navigateWithTransition(anchor.href);
        });
    }

    function loadStoredTheme() {
        return localStorage.getItem(STORAGE_KEYS.theme) === "light" ? "light" : "dark";
    }

    function writeSharedState(key, value) {
        try {
            if (value == null) {
                window.localStorage?.removeItem(key);
                return;
            }

            window.localStorage?.setItem(key, JSON.stringify(value));
        } catch (_) {
            // Shared state persistence is best-effort only.
        }
    }

    function readSharedState(key) {
        try {
            const raw = window.localStorage?.getItem(key);
            return raw ? JSON.parse(raw) : null;
        } catch (_) {
            return null;
        }
    }

    function persistSharedFirebaseConfig(config) {
        writeSharedState(STORAGE_KEYS.sharedFirebaseConfig, config && typeof config === "object" ? config : null);
    }

    function loadSharedFirebaseConfig() {
        return readSharedState(STORAGE_KEYS.sharedFirebaseConfig);
    }

    function persistSharedIdentity(identity) {
        writeSharedState(STORAGE_KEYS.sharedIdentity, identity && typeof identity === "object" ? identity : null);
    }

    function loadSharedIdentity() {
        return readSharedState(STORAGE_KEYS.sharedIdentity);
    }

    function persistSharedTicket(ticket) {
        writeSharedState(STORAGE_KEYS.sharedTicket, ticket && typeof ticket === "object" ? ticket : null);
    }

    function loadSharedTicket() {
        return readSharedState(STORAGE_KEYS.sharedTicket);
    }

    function applyTheme(theme) {
        const normalized = theme === "light" ? "light" : "dark";
        document.body.classList.toggle("light-theme", normalized === "light");
        document.body.classList.toggle("dark-theme", normalized === "dark");
        document.documentElement.style.colorScheme = normalized;
        localStorage.setItem(STORAGE_KEYS.theme, normalized);

        document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
            button.innerHTML = normalized === "dark"
                ? `${icon("sun")} <span>Light mode</span>`
                : `${icon("moon")} <span>Dark mode</span>`;
        });
    }

    function bindThemeToggles() {
        document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
            button.addEventListener("click", () => {
                applyTheme(document.body.classList.contains("dark-theme") ? "light" : "dark");
            });
        });
    }

    function loadWatchlist() {
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.watchlist) || "[]");
            return Array.isArray(stored) ? stored.filter(Boolean) : [];
        } catch (_) {
            return [];
        }
    }

    function saveWatchlist(ids) {
        localStorage.setItem(STORAGE_KEYS.watchlist, JSON.stringify([...new Set(ids.filter(Boolean))]));
    }

    function toggleWatchlist(id) {
        const list = loadWatchlist();
        if (list.includes(id)) {
            const next = list.filter((entry) => entry !== id);
            saveWatchlist(next);
            return next;
        }

        const next = [id, ...list.filter((entry) => entry !== id)];
        saveWatchlist(next);
        return next;
    }

    function loadRecent() {
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.recent) || "[]");
            return Array.isArray(stored) ? stored.filter(Boolean) : [];
        } catch (_) {
            return [];
        }
    }

    function saveRecent(ids) {
        localStorage.setItem(STORAGE_KEYS.recent, JSON.stringify([...new Set(ids.filter(Boolean))].slice(0, 8)));
    }

    function loadStats() {
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.stats) || "null");
            if (stored && typeof stored === "object") {
                return {
                    visits: Number(stored.visits) || 0,
                    launches: Number(stored.launches) || 0,
                    games: stored.games && typeof stored.games === "object" ? stored.games : {}
                };
            }
        } catch (_) {
            // Fall through.
        }

        return {
            visits: 0,
            launches: 0,
            games: {}
        };
    }

    function saveStats(stats) {
        localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(stats));
    }

    function recordPremiumVisit(gameId, options = {}) {
        const stats = loadStats();
        const entry = stats.games[gameId] || { visits: 0, launches: 0, lastViewed: null };
        const countVisit = options.visit !== false;
        if (countVisit) {
            stats.visits += 1;
            entry.visits += 1;
        }
        if (options.launch === true) {
            stats.launches += 1;
            entry.launches += 1;
        }
        entry.lastViewed = new Date().toISOString();
        stats.games[gameId] = entry;
        saveStats(stats);

        const recent = loadRecent();
        saveRecent([gameId, ...recent.filter((id) => id !== gameId)]);
        return stats;
    }

    function setAuthIntent(intent) {
        sessionStorage.setItem(STORAGE_KEYS.authIntent, JSON.stringify(intent || null));
    }

    function readAuthIntent() {
        try {
            const stored = sessionStorage.getItem(STORAGE_KEYS.authIntent);
            return stored ? JSON.parse(stored) : null;
        } catch (_) {
            return null;
        }
    }

    function clearAuthIntent() {
        sessionStorage.removeItem(STORAGE_KEYS.authIntent);
    }

    document.addEventListener("DOMContentLoaded", () => {
        syncCanonicalLocation();
        clearTransitionLock();
        hydrateIcons();
        applyTheme(loadStoredTheme());
        bindThemeToggles();
        mountTransitionPortal();
        bindNavigationTransitions();
        primeReveal(document);
        initPremiumParallax();
        initPremiumScrollProgress();
        initPremiumPointerEffects();
        window.requestAnimationFrame(() => {
            document.body.classList.add("premium-ui-ready");
            queueRevealRefresh(document);
        });
    });

    window.addEventListener("resize", () => queueRevealRefresh(document), { passive: true });
    window.addEventListener("scroll", () => queueRevealRefresh(document), { passive: true });
    window.addEventListener("pageshow", () => {
        clearTransitionLock();
        queueRevealRefresh(document);
    });

    window.GameHubPremium = {
        STORAGE_KEYS,
        icon,
        escapeHtml,
        runtimeLabel,
        loadProfileLabel,
        accessLabel,
        loadPremiumCatalog,
        loadPremiumSession,
        getPremiumGameById,
        getRelatedGames,
        loadWatchlist,
        saveWatchlist,
        toggleWatchlist,
        loadRecent,
        saveRecent,
        loadStats,
        saveStats,
        recordPremiumVisit,
        setAuthIntent,
        readAuthIntent,
        clearAuthIntent,
        hydrateIcons,
        primeReveal,
        refreshRevealVisibility,
        navigateWithTransition,
        loadStoredTheme,
        applyTheme,
        persistSharedFirebaseConfig,
        loadSharedFirebaseConfig,
        persistSharedIdentity,
        loadSharedIdentity,
        persistSharedTicket,
        loadSharedTicket
    };
})();
