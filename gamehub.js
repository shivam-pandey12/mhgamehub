(() => {
    "use strict";

    const catalog = window.GameHubCatalog;
    if (!catalog) {
        console.error("GameHubCatalog is missing.");
        return;
    }

    const {
        storageKeys,
        normalizePath,
        loadGamesCatalog,
        getSuggestedGames
    } = catalog;

    const LEGACY_LOCAL_KEYS = [
        "gameHubToken",
        "gameHubProfileCache",
        "gameHubGamesCache",
        "gameHubGamesCacheTime",
        "currentGameSession"
    ];

    const LEGACY_SESSION_KEYS = ["tempGameCode", "tempGameType"];

    const state = {
        games: [],
        query: "",
        favoriteIds: [],
        stats: loadStats(),
        recentIds: loadRecentIds(),
        categoryFilter: "all",
        runtimeFilter: "all",
        operations: null
    };

    const INTERACTIVE_CURSOR_SELECTOR = "a, button, .game-card, .quick-launch-card, .favorite-spotlight, #theme-toggle, .hamburger-icon, input";
    const SECTION_REVEAL_SELECTOR = ".hero-section, .search-section, .headline-card, .quick-launch-section, .feature, .favorites-section, .games-section, .site-footer";
    const SEARCH_RENDER_DELAY_MS = 80;

    let closeMenu = () => { };
    let logoAnimationInterval = null;
    let revealObserver = null;
    let revealRefreshFrame = 0;
    let scrollWorkQueued = false;
    let searchRenderTimer = 0;
    let launchTimer = 0;
    let launchPendingGameId = "";
    let activeToast = null;
    let toastHideTimer = 0;
    let toastRemoveTimer = 0;

    document.addEventListener("DOMContentLoaded", () => {
        void init();
    });

    async function init() {
        clearLegacyAuthArtifacts();
        hydrateStaticIcons();
        applyTheme(loadStoredTheme());

        initThemeToggle();
        initHamburgerMenu();
        initSmoothAnchors();
        initSearch();
        initScrollToTop();
        initCustomCursor();
        initAmbientLayer();
        initLetterAnimation();
        initSectionReveals();

        const loadedCatalog = await loadGamesCatalog();
        state.games = Array.isArray(loadedCatalog.games) ? loadedCatalog.games : [];
        state.operations = loadedCatalog.operations || null;
        state.favoriteIds = loadFavoriteIds();

        renderOperationsBanner();
        renderHeroShowcase();
        renderFilters();
        renderQuickLaunches();
        renderGames();
        renderFavorites();
        updateHeroBadges();
        updateActiveNavigation();
        queueSectionRevealRefresh(document);
        syncInitialHashTarget();
        hideLoader();

        window.addEventListener("scroll", scheduleScrollWork, { passive: true });
        window.addEventListener("resize", scheduleScrollWork, { passive: true });
        window.addEventListener("hashchange", syncInitialHashTarget);
    }

    function clearLegacyAuthArtifacts() {
        LEGACY_LOCAL_KEYS.forEach((key) => localStorage.removeItem(key));
        LEGACY_SESSION_KEYS.forEach((key) => sessionStorage.removeItem(key));
    }

    function renderOperationsBanner() {
        const featureFlags = state.operations?.featureFlags || {};
        const config = state.operations?.config || {};
        const canShowBanner = featureFlags.maintenance_banner_enabled !== false;
        const enabled = canShowBanner && (config.globalMaintenanceMode === true || config.globalBannerEnabled === true);
        let banner = document.getElementById("gamehub-operations-banner");
        if (!enabled) {
            banner?.remove();
            return;
        }
        if (!banner) {
            banner = document.createElement("section");
            banner.id = "gamehub-operations-banner";
            banner.className = "gamehub-operations-banner";
            const anchor = document.querySelector(".hero-section") || document.body.firstElementChild;
            (anchor?.parentNode || document.body).insertBefore(banner, anchor || null);
        }
        const message = config.globalMaintenanceMode
            ? (config.globalMaintenanceMessage || "GameHub is in maintenance mode. Game launches may be temporarily unavailable.")
            : (config.globalBannerMessage || "GameHub operations notice.");
        banner.innerHTML = `
            <span>${homeIcon(config.globalMaintenanceMode ? "clock" : "info")}</span>
            <strong>${escapeHtml(config.globalMaintenanceMode ? "Maintenance" : "Notice")}</strong>
            <p>${escapeHtml(message)}</p>
        `;
    }

    function loadStoredTheme() {
        return localStorage.getItem(storageKeys.theme) === "dark" ? "dark" : "light";
    }

    function loadFavoriteIds() {
        try {
            const stored = JSON.parse(localStorage.getItem(storageKeys.favorites) || "null");
            if (Array.isArray(stored)) {
                return uniqueIds(stored.map(resolveLegacyGameId).filter(Boolean));
            }
        } catch (error) {
            console.warn("Failed to read saved favorites:", error);
        }

        try {
            const legacy = JSON.parse(localStorage.getItem("favorites") || "[]");
            const migrated = Array.isArray(legacy)
                ? uniqueIds(legacy.map(resolveLegacyGameId).filter(Boolean))
                : [];

            persistFavoriteIds(migrated);
            return migrated;
        } catch (error) {
            console.warn("Failed to migrate legacy favorites:", error);
            persistFavoriteIds([]);
            return [];
        }
    }

    function resolveLegacyGameId(entry) {
        if (!entry) {
            return null;
        }

        if (typeof entry === "string") {
            const directMatch = state.games.find((game) => game.id === entry);
            if (directMatch) {
                return directMatch.id;
            }

            const normalizedEntry = normalizePath(entry);
            const pathMatch = state.games.find((game) => {
                return normalizePath(game.path) === normalizedEntry || normalizePath(game.pathEncoded) === normalizedEntry;
            });

            return pathMatch ? pathMatch.id : null;
        }

        if (typeof entry !== "object") {
            return null;
        }

        const directIds = [entry.id, entry._id, entry.gameId];
        for (const id of directIds) {
            if (typeof id === "string" && state.games.some((game) => game.id === id)) {
                return id;
            }
        }

        const normalizedPaths = [entry.path, entry.gameCode, entry.gameUrl, entry.url]
            .filter(Boolean)
            .map(normalizePath);

        const normalizedName = typeof entry.name === "string" ? entry.name.trim().toLowerCase() : "";

        const match = state.games.find((game) => {
            const gamePaths = [game.path, game.pathEncoded].map(normalizePath);
            const pathMatch = normalizedPaths.some((value) => gamePaths.includes(value));
            const nameMatch = normalizedName && game.name.toLowerCase() === normalizedName;
            return pathMatch || nameMatch;
        });

        return match ? match.id : null;
    }

    function persistFavoriteIds(favoriteIds) {
        localStorage.setItem(storageKeys.favorites, JSON.stringify(uniqueIds(favoriteIds)));
        localStorage.removeItem("favorites");
    }

    function loadStats() {
        try {
            const stored = JSON.parse(localStorage.getItem(storageKeys.stats) || "null");
            if (stored && typeof stored === "object") {
                return {
                    totalLaunches: Number(stored.totalLaunches) || 0,
                    games: stored.games && typeof stored.games === "object" ? stored.games : {}
                };
            }
        } catch (error) {
            console.warn("Failed to read play stats:", error);
        }

        return {
            totalLaunches: 0,
            games: {}
        };
    }

    function loadRecentIds() {
        try {
            const stored = JSON.parse(localStorage.getItem(storageKeys.recent) || "[]");
            return Array.isArray(stored) ? uniqueIds(stored.filter(Boolean)) : [];
        } catch (error) {
            console.warn("Failed to read recent games:", error);
            return [];
        }
    }

    function getGamePlayCount(gameId) {
        return Number(state.stats.games[gameId]?.count || 0);
    }

    function getFeaturedGame() {
        if (!state.games.length) {
            return null;
        }

        return (
            [...state.games].sort((left, right) => {
                const playDelta = getGamePlayCount(right.id) - getGamePlayCount(left.id);
                if (playDelta !== 0) {
                    return playDelta;
                }

                return left.order - right.order;
            })[0] || state.games[0]
        );
    }

    function getRuntimeLabel(runtimeKind) {
        const labels = {
            "2d": "2D",
            "3d": "3D",
            io: "Realtime",
            static: "Static"
        };

        return labels[String(runtimeKind || "").toLowerCase()] || "2D";
    }

    function getFilteredGames() {
        return filterGames(state.query, state.categoryFilter, state.runtimeFilter);
    }

    const HOME_ICON_MARKUP = {
        play: `<path d="M8 5.8v12.4L18.2 12 8 5.8Z" fill="currentColor"></path>`,
        heart: `<path d="M12 20.1 10.8 19C6 14.7 3.2 12.1 3.2 8.8c0-2.4 1.9-4.3 4.2-4.3 1.6 0 3 .8 3.9 2.1.9-1.3 2.3-2.1 3.9-2.1 2.3 0 4.2 1.9 4.2 4.3 0 3.3-2.8 5.9-7.6 10.2L12 20.1Z" fill="currentColor"></path>`,
        moon: `<path d="M15 3.2a8.8 8.8 0 1 0 5.8 14.9A9.2 9.2 0 0 1 15 3.2Z" fill="currentColor"></path>`,
        sun: `<circle cx="12" cy="12" r="4.1" fill="currentColor"></circle><path d="M12 2.6v2.6M12 18.8v2.6M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2.6 12h2.6M18.8 12h2.6M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>`,
        gamepad: `<path d="M6.2 8.3h11.6c1.4 0 2.6 1 2.9 2.4l1 4.7c.4 1.8-1 3.4-2.7 3.4-.9 0-1.8-.4-2.4-1.1l-1.7-1.8H9l-1.7 1.8c-.6.7-1.5 1.1-2.4 1.1-1.7 0-3.1-1.6-2.7-3.4l1-4.7c.3-1.4 1.5-2.4 3-2.4Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path><path d="M8.1 11.4v3.1M6.5 13h3.1M16.1 12.1h.1M18.2 14.1h.1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>`,
        folder: `<path d="M3.2 8.7h6l2 2H20.8v6.4a2.3 2.3 0 0 1-2.3 2.3H5.5a2.3 2.3 0 0 1-2.3-2.3V8.7Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path><path d="M3.2 8.7V6.8a2.3 2.3 0 0 1 2.3-2.3h4l2 2h3.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
        layers: `<path d="m12 4 8 4.4-8 4.4-8-4.4L12 4Z" fill="currentColor"></path><path d="m4 12 8 4.3 8-4.3M4 15.7 12 20l8-4.3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
        search: `<circle cx="10.5" cy="10.5" r="5.8" fill="none" stroke="currentColor" stroke-width="1.9"></circle><path d="m15 15 5 5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"></path>`,
        "chevron-down": `<path d="m6.5 9.5 5.5 5 5.5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>`,
        "arrow-up": `<path d="M12 19V5M6.6 10.4 12 5l5.4 5.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>`,
        bolt: `<path d="M13.2 2 5.8 13h4.6l-1 9L17 10.6h-4.5L13.2 2Z" fill="currentColor"></path>`,
        unlock: `<path d="M7 10V8.3a5 5 0 0 1 9.6-1.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path><rect x="4.6" y="10" width="14.8" height="9.9" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"></rect><circle cx="12" cy="15" r="1.3" fill="currentColor"></circle>`,
        star: `<path d="m12 3.2 2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 16.8 6.8 19.5l1-5.9-4.3-4.2 5.9-.9L12 3.2Z" fill="currentColor"></path>`,
        clock: `<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"></circle><path d="M12 7.4v5l3.2 1.9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>`,
        info: `<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"></circle><path d="M12 10.4v5.1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path><circle cx="12" cy="7.4" r="1" fill="currentColor"></circle>`,
        "file-code": `<path d="M7 3.5h7l4 4v13H7v-17Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"></path><path d="M14 3.5v4h4M11 11l-2 2 2 2M13 15l2-2-2-2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path>`,
        fire: `<path d="M12.3 2.6c.5 2.4-.3 4.2-1.7 5.9-1.1 1.4-2.5 2.8-2.5 5A4.2 4.2 0 0 0 12.3 18a4.2 4.2 0 0 0 4.2-4.5c0-1.5-.6-2.8-1.7-4-.6 1.4-1.8 2.4-3.2 2.7.7-1.5.5-3.1.7-4.6Z" fill="currentColor"></path>`,
        user: `<circle cx="12" cy="8" r="3.2" fill="none" stroke="currentColor" stroke-width="1.8"></circle><path d="M5.2 19.1a8.1 8.1 0 0 1 13.6 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>`,
        tag: `<path d="M3.6 12.2V5.5h6.8l8.1 8.1-6.7 6.8-8.2-8.2Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path><circle cx="8.2" cy="8.2" r="1.1" fill="currentColor"></circle>`
    };

    function homeIcon(name, extraClasses = "") {
        const body = HOME_ICON_MARKUP[name] || HOME_ICON_MARKUP.info;
        const classes = ["gh-icon", `gh-icon-${name}`, extraClasses].filter(Boolean).join(" ");
        return `<svg class="${classes}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${body}</svg>`;
    }

    function hydrateStaticIcons() {
        document.querySelectorAll(".gh-icon").forEach((node) => {
            if (node.tagName.toLowerCase() === "svg") {
                return;
            }

            const iconClass = [...node.classList].find((className) => className.startsWith("gh-icon-") && className !== "gh-icon");
            if (!iconClass) {
                return;
            }

            const name = iconClass.replace("gh-icon-", "");
            const extraClasses = [...node.classList]
                .filter((className) => className !== "gh-icon" && className !== iconClass)
                .join(" ");

            node.outerHTML = homeIcon(name, extraClasses);
        });
    }

    function renderStatusPill(element, { icon, value, label, detail = "" }) {
        if (!element) {
            return;
        }

        element.innerHTML = `
            ${homeIcon(icon)}
            <span class="status-copy">
                <strong>${escapeHtml(String(value))}</strong>
                <span class="status-label">${escapeHtml(label)}</span>
            </span>
            ${detail ? `<span class="status-detail">${escapeHtml(detail)}</span>` : ""}
        `;
    }

    function renderHeroShowcase() {
        const mainCard = document.querySelector(".showcase-card.main");
        const miniCards = document.querySelectorAll(".showcase-card.mini");
        const featuredGame = getFeaturedGame();

        if (!mainCard || miniCards.length < 2) {
            return;
        }

        if (!featuredGame) {
            mainCard.innerHTML = `
                <div class="showcase-copy-wrap">
                    <div class="card-top">
                        <span class="chip">Library Empty</span>
                    </div>
                    <h3>Add your first HTML game</h3>
                    <p>Drop an <code>.html</code> file into <code>games/</code> and it will appear here automatically.</p>
                    <div class="card-footer">
                        <span class="pill">${homeIcon("folder")} games/</span>
                        <span class="pill">${homeIcon("file-code")} HTML powered</span>
                    </div>
                </div>
            `;

            miniCards[0].innerHTML = `
                <div class="showcase-icon">${homeIcon("info")}</div>
                <div>
                    <h4>Fresh library</h4>
                    <p>Your arcade cards refresh from the live game catalog.</p>
                </div>
            `;

            miniCards[1].innerHTML = `
                <div class="showcase-icon">${homeIcon("heart")}</div>
                <div>
                    <h4>Local favorites</h4>
                    <p>Your favorites stay in this browser only through local storage.</p>
                </div>
            `;
            return;
        }

        const supporting = getSuggestedGames(state.games, featuredGame.id, 2);
        const recentGame = state.recentIds
            .map((id) => state.games.find((game) => game.id === id))
            .filter(Boolean)
            .find((game) => game.id !== featuredGame.id);

        mainCard.style.setProperty("--showcase-accent", featuredGame.accent);
        mainCard.style.setProperty("--showcase-accent-alt", featuredGame.accentAlt);
        mainCard.innerHTML = `
            <div class="showcase-visual">
                <img src="${featuredGame.thumbnail}" alt="${escapeHtml(featuredGame.name)} artwork">
                <div class="showcase-visual-glow"></div>
            </div>
            <div class="showcase-copy-wrap">
                <div class="card-top">
                    <span class="chip">Featured</span>
                    <span class="chip alt">${homeIcon("layers")} ${escapeHtml(featuredGame.category)}</span>
                </div>
                <h3>${escapeHtml(featuredGame.name)}</h3>
                <p>${escapeHtml(featuredGame.description)}</p>
                <div class="card-footer">
                    <span class="pill">${homeIcon("user")} ${escapeHtml(featuredGame.type)}</span>
                    <span class="pill">${homeIcon("fire")} ${getGamePlayCount(featuredGame.id)} play${getGamePlayCount(featuredGame.id) === 1 ? "" : "s"}</span>
                    <span class="pill">${homeIcon("clock")} ${escapeHtml(featuredGame.loadProfile)}</span>
                </div>
            </div>
        `;

        const miniContent = [
            supporting[0] || recentGame || featuredGame,
            supporting[1] || recentGame || featuredGame
        ];

        miniContent.forEach((game, index) => {
            const card = miniCards[index];
            if (!card || !game) {
                return;
            }

            card.style.setProperty("--showcase-accent", game.accent);
            card.style.setProperty("--showcase-accent-alt", game.accentAlt);
            card.innerHTML = `
                <div class="showcase-icon">${homeIcon(index === 0 ? "star" : "clock")}</div>
                <div>
                    <h4>${escapeHtml(game.name)}</h4>
                    <p>${escapeHtml(index === 0 ? game.subtitle : `${game.ageRating} / ${game.type}`)}</p>
                </div>
            `;
        });
    }

    function renderGames() {
        const container = document.querySelector(".game-cards");
        const heading = document.querySelector("#games .section-heading h2");
        const copy = document.querySelector("#games .section-copy");
        const status = document.getElementById("library-status-pill");

        if (!container || !heading || !copy) {
            return;
        }

        const visibleGames = getFilteredGames();
        container.innerHTML = "";

        renderStatusPill(status, {
            icon: "layers",
            value: visibleGames.length,
            label: state.query || state.categoryFilter !== "all" || state.runtimeFilter !== "all" ? "matching now" : "games ready",
            detail: state.query || state.categoryFilter !== "all" || state.runtimeFilter !== "all" ? `${state.games.length} total` : ""
        });

        if (state.query || state.categoryFilter !== "all" || state.runtimeFilter !== "all") {
            heading.textContent = `Filtered Library (${visibleGames.length})`;
            copy.textContent = "Search, category, and runtime filters stack together so you can narrow the arcade down quickly.";
        } else {
            heading.textContent = `Arcade Library (${state.games.length})`;
            copy.textContent = "Every visible card comes from the live contents of your local games folder.";
        }

        if (!state.games.length) {
            container.appendChild(
                createEmptyState(
                    "No HTML games found yet.",
                    "Your arcade library is empty right now."
                )
            );
            queueSectionRevealRefresh(document.getElementById("games"));
            return;
        }

        if (!visibleGames.length) {
            container.appendChild(
                createEmptyState(
                    "No games match that search.",
                    "Try another title, category, age rating, or clear the search box."
                )
            );
            queueSectionRevealRefresh(document.getElementById("games"));
            return;
        }

        const fragment = document.createDocumentFragment();
        visibleGames.forEach((game, index) => {
            const card = createGameCard(game);
            fragment.appendChild(card);
            animateCardIn(card, index);
        });
        container.appendChild(fragment);
        queueSectionRevealRefresh(document.getElementById("games"));
    }

    function renderFilters() {
        const toolbar = document.getElementById("filter-toolbar");
        if (!toolbar) {
            return;
        }

        const categories = [...new Set(state.games.map((game) => game.category).filter(Boolean))]
            .sort((left, right) => left.localeCompare(right));
        const runtimeOrder = ["2d", "3d", "io", "static"];
        const runtimes = [...new Set(state.games.map((game) => game.runtimeKind).filter(Boolean))]
            .sort((left, right) => runtimeOrder.indexOf(left) - runtimeOrder.indexOf(right));

        toolbar.innerHTML = "";
        toolbar.appendChild(createFilterGroup("Category", [
            { value: "all", label: "All games" },
            ...categories.map((category) => ({ value: category, label: category }))
        ], state.categoryFilter, (value) => {
            state.categoryFilter = value;
            renderFilters();
            renderGames();
        }));

        toolbar.appendChild(createFilterGroup("Runtime", [
            { value: "all", label: "All runtimes" },
            ...runtimes.map((runtime) => ({ value: runtime, label: getRuntimeLabel(runtime) }))
        ], state.runtimeFilter, (value) => {
            state.runtimeFilter = value;
            renderFilters();
            renderGames();
        }));
    }

    function createFilterGroup(label, items, activeValue, onSelect) {
        const group = document.createElement("div");
        group.className = "filter-group";

        const title = document.createElement("span");
        title.className = "filter-label";
        title.textContent = label;
        group.appendChild(title);

        items.forEach((item) => {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = `filter-chip${item.value === activeValue ? " active" : ""}`;
            chip.textContent = item.label;
            chip.addEventListener("click", () => onSelect(item.value));
            group.appendChild(chip);
        });

        return group;
    }

    function renderQuickLaunches() {
        const grid = document.getElementById("quick-launch-grid");
        const status = document.getElementById("quick-launch-status");
        const insight = document.getElementById("quick-launch-insight");
        if (!grid) {
            return;
        }

        const recentGames = state.recentIds
            .map((id) => state.games.find((game) => game.id === id))
            .filter(Boolean);
        const favoriteGames = state.favoriteIds
            .map((id) => state.games.find((game) => game.id === id))
            .filter(Boolean);
        const mostPlayed = [...state.games]
            .sort((left, right) => getGamePlayCount(right.id) - getGamePlayCount(left.id))
            .filter((game) => getGamePlayCount(game.id) > 0);

        const picks = [];
        const seen = new Set();
        [recentGames, favoriteGames, mostPlayed].forEach((group) => {
            group.forEach((game) => {
                if (game && !seen.has(game.id) && picks.length < 6) {
                    seen.add(game.id);
                    picks.push(game);
                }
            });
        });

        if (!picks.length) {
            picks.push(...state.games.slice(0, Math.min(4, state.games.length)));
        }

        grid.innerHTML = "";

        const lead = picks[0] || null;
        renderStatusPill(status, {
            icon: "bolt",
            value: picks.length,
            label: "launch queue",
            detail: lead ? `${getRuntimeLabel(lead.runtimeKind)} lead` : "curated shelf"
        });
        renderQuickLaunchInsight(insight, picks);

        if (!picks.length) {
            grid.appendChild(createEmptyState("Nothing to launch yet.", "Drop a few games into the library and this shelf will populate automatically."));
            return;
        }

        const fragment = document.createDocumentFragment();
        picks.forEach((game, index) => {
            const card = createQuickLaunchCard(game, index);
            fragment.appendChild(card);
            animateCardIn(card, index);
        });
        grid.appendChild(fragment);
    }

    function renderQuickLaunchInsight(element, picks) {
        if (!element) {
            return;
        }

        const lead = picks[0] || getFeaturedGame();
        const recentCount = state.recentIds.length;
        const favoriteCount = state.favoriteIds.length;
        const totalPlays = picks.reduce((total, game) => total + getGamePlayCount(game.id), 0);
        const runtimeMix = picks.reduce((map, game) => {
            const label = getRuntimeLabel(game.runtimeKind);
            map.set(label, (map.get(label) || 0) + 1);
            return map;
        }, new Map());
        const runtimeMarkup = [...runtimeMix.entries()]
            .map(([label, count]) => `<span class="pill">${homeIcon("layers")} ${count} ${escapeHtml(label)}</span>`)
            .join("");

        element.innerHTML = `
            <div class="quick-launch-insight-card"${lead ? ` style="--card-accent:${lead.accent};--card-accent-alt:${lead.accentAlt};"` : ""}>
                <div class="quick-launch-insight-top">
                    <span class="quick-launch-insight-kicker">${homeIcon("star")} Curated rail</span>
                    <strong>${picks.length} picks ready</strong>
                </div>
                <div class="quick-launch-insight-grid">
                    <article>
                        <span>Recent</span>
                        <strong>${recentCount}</strong>
                    </article>
                    <article>
                        <span>Favorites</span>
                        <strong>${favoriteCount}</strong>
                    </article>
                    <article>
                        <span>Tracked plays</span>
                        <strong>${totalPlays}</strong>
                    </article>
                </div>
                <p class="quick-launch-insight-copy">${escapeHtml(lead ? `${lead.name} is currently setting the pace for this shelf with a ${getRuntimeLabel(lead.runtimeKind).toLowerCase()} profile and ${lead.loadProfile} launch weight.` : "Launches, favorites, and recent sessions will shape this rail automatically.")}</p>
                <div class="quick-launch-insight-meta">
                    ${runtimeMarkup || `<span class="pill">${homeIcon("info")} Waiting for play history</span>`}
                </div>
            </div>
        `;
    }

    function createQuickLaunchCard(game, index) {
        const isFavorite = state.favoriteIds.includes(game.id);
        const playCount = getGamePlayCount(game.id);
        const card = document.createElement("article");
        const isLead = index === 0;
        const isUnavailable = isGameUnavailable(game);

        card.className = `quick-launch-card${isLead ? " is-lead" : ""}${isUnavailable ? " is-unavailable" : ""}`;
        card.dataset.gameId = game.id;
        card.style.setProperty("--card-accent", game.accent);
        card.style.setProperty("--card-accent-alt", game.accentAlt);

        card.innerHTML = `
            <div class="quick-launch-visual">
                <img src="${game.thumbnail}" alt="${escapeHtml(game.name)} artwork">
                <div class="quick-launch-visual-overlay"></div>
                <div class="quick-launch-top">
                    <span class="chip">${escapeHtml(isUnavailable ? getLaunchLabel(game) : `Launch ${String(index + 1).padStart(2, "0")}`)}</span>
                    <span class="runtime-pill">${homeIcon("layers")} ${escapeHtml(getRuntimeLabel(game.runtimeKind))}</span>
                </div>
            </div>
            <div class="quick-launch-body">
                <div class="quick-launch-copy-block">
                    <span class="quick-launch-kicker">${escapeHtml(game.category)}</span>
                    <h3 class="quick-launch-title">${escapeHtml(game.name)}</h3>
                    <p class="quick-launch-copy">${escapeHtml(isLead ? game.description : game.subtitle)}</p>
                </div>
                <div class="quick-launch-meta">
                    <span class="pill">${homeIcon("clock")} ${escapeHtml(game.loadProfile)}</span>
                    <span class="pill">${homeIcon("fire")} ${playCount} play${playCount === 1 ? "" : "s"}</span>
                    <span class="pill">${homeIcon("user")} ${escapeHtml(game.type)}</span>
                </div>
                <div class="quick-launch-actions">
                    <button type="button" class="play-button compact">${homeIcon(isUnavailable ? "clock" : "play")} ${escapeHtml(getLaunchLabel(game))}</button>
                    <button type="button" class="favorite-button ${isFavorite ? "active" : ""} compact">${homeIcon("heart")} ${isFavorite ? "Saved" : "Favorite"}</button>
                </div>
            </div>
        `;

        bindCardEvents(card, game);
        return card;
    }

    function renderFavorites() {
        const heading = document.querySelector("#favorites .section-heading h2");
        const copy = document.querySelector("#favorites .section-copy");
        const container = document.querySelector(".favorite-game-cards");
        const emptyMessage = document.querySelector(".no-favorites-message");
        const status = document.getElementById("favorites-status-pill");

        if (!heading || !copy || !container || !emptyMessage) {
            return;
        }

        const favoriteGames = state.favoriteIds
            .map((id) => state.games.find((game) => game.id === id))
            .filter(Boolean);

        if (favoriteGames.length !== state.favoriteIds.length) {
            state.favoriteIds = favoriteGames.map((game) => game.id);
            persistFavoriteIds(state.favoriteIds);
        }

        heading.textContent = `Local Favorites (${favoriteGames.length})`;
        copy.textContent = "Saved only in this browser, with no account or backend required.";

        renderStatusPill(status, {
            icon: "heart",
            value: favoriteGames.length,
            label: "saved locally"
        });

        container.innerHTML = "";

        if (!favoriteGames.length) {
            emptyMessage.classList.add("visible");
            emptyMessage.innerHTML = `
                <span class="empty-heart">${homeIcon("heart")}</span>
                <strong>No favorite games yet</strong>
                <span>Tap the heart on any game card and build your own beige-and-dark arcade shelf.</span>
            `;
            return;
        }

        emptyMessage.classList.remove("visible");

        const fragment = document.createDocumentFragment();
        favoriteGames.forEach((game, index) => {
            const card = createFavoriteCard(game, index);
            fragment.appendChild(card);
            animateCardIn(card, index);
        });
        container.appendChild(fragment);
    }

    function createGameCard(game) {
        const isFavorite = state.favoriteIds.includes(game.id);
        const playCount = getGamePlayCount(game.id);
        const card = document.createElement("article");
        const isUnavailable = isGameUnavailable(game);
        const operationBadges = getOperationBadges(game);

        card.className = `game-card${isUnavailable ? " is-unavailable" : ""}`;
        card.dataset.gameId = game.id;
        card.style.setProperty("--card-accent", game.accent);
        card.style.setProperty("--card-accent-alt", game.accentAlt);

        card.innerHTML = `
            <button type="button" class="favorite-icon ${isFavorite ? "active" : ""}" aria-label="${isFavorite ? "Remove from favorites" : "Save to favorites"}">
                ${homeIcon("heart")}
            </button>
            <div class="game-thumbnail">
                <img src="${game.thumbnail}" alt="${escapeHtml(game.name)} artwork">
                <div class="game-badge-row">
                    ${operationBadges.map((badge) => `<span class="game-category-pill game-operation-pill">${escapeHtml(badge)}</span>`).join("")}
                    <span class="game-category-pill">${escapeHtml(game.category)}</span>
                    <span class="runtime-pill">${homeIcon("layers")} ${escapeHtml(getRuntimeLabel(game.runtimeKind))}</span>
                    <span class="load-pill">${homeIcon("clock")} ${escapeHtml(game.loadProfile)}</span>
                    <span class="game-age-pill">${escapeHtml(game.ageRating)}</span>
                </div>
            </div>
            <div class="game-card-content">
                <div class="game-card-topline">
                    <span>${escapeHtml(game.subtitle)}</span>
                    <span>${playCount} play${playCount === 1 ? "" : "s"}</span>
                </div>
                <h3>${escapeHtml(game.name)}</h3>
                <p class="game-summary">${escapeHtml(game.description)}</p>
                <div class="game-card-meta">
                    <span>${homeIcon("user")} ${escapeHtml(game.type)}</span>
                    <span>${homeIcon("file-code")} ${escapeHtml(game.fileName)}</span>
                </div>
                <div class="game-actions">
                    <button type="button" class="play-button">
                        ${homeIcon(isUnavailable ? "clock" : "play")} ${escapeHtml(getLaunchLabel(game))}
                    </button>
                    <button type="button" class="favorite-button ${isFavorite ? "active" : ""}">
                        ${homeIcon("heart")} ${isFavorite ? "Saved" : "Favorite"}
                    </button>
                </div>
            </div>
        `;

        bindCardEvents(card, game);
        return card;
    }

    function createFavoriteCard(game, index) {
        const playCount = getGamePlayCount(game.id);
        const card = document.createElement("article");

        card.className = "favorite-spotlight";
        card.dataset.gameId = game.id;
        card.style.setProperty("--card-accent", game.accent);
        card.style.setProperty("--card-accent-alt", game.accentAlt);

        card.innerHTML = `
            <div class="favorite-rank">${String(index + 1).padStart(2, "0")}</div>
            <div class="favorite-thumb">
                <img src="${game.thumbnail}" alt="${escapeHtml(game.name)} artwork">
            </div>
            <div class="favorite-copy">
                <div class="favorite-copy-top">
                    <span class="favorite-tag">${escapeHtml(game.category)}</span>
                    <span class="favorite-meta">${escapeHtml(getRuntimeLabel(game.runtimeKind))} / ${escapeHtml(game.loadProfile)} / ${playCount} play${playCount === 1 ? "" : "s"}</span>
                </div>
                <h3>${escapeHtml(game.name)}</h3>
                <p>${escapeHtml(game.description)}</p>
            </div>
            <div class="favorite-actions">
                <button type="button" class="play-button compact">
                    ${homeIcon("play")} Play
                </button>
                <button type="button" class="favorite-button active compact">
                    ${homeIcon("heart")} Remove
                </button>
            </div>
        `;

        bindCardEvents(card, game);
        return card;
    }

    function bindCardEvents(card, game) {
        const playButtons = card.querySelectorAll(".play-button");
        const favoriteButtons = card.querySelectorAll(".favorite-button, .favorite-icon");

        playButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.stopPropagation();
                launchGame(game);
            });
        });

        favoriteButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.stopPropagation();
                toggleFavorite(game.id);
            });
        });

        card.addEventListener("click", () => {
            launchGame(game);
        });
    }

    function isGameUnavailable(game) {
        return game?.visibility === "coming_soon"
            || game?.visibility === "maintenance"
            || game?.launchDisabled === true;
    }

    function getOperationBadges(game) {
        const badges = [];
        if (game?.visibility === "coming_soon") {
            badges.push("Coming Soon");
        }
        if (game?.visibility === "maintenance") {
            badges.push("Maintenance");
        }
        if (game?.featured) {
            badges.push("Featured");
        }
        if (game?.newLabel) {
            badges.push("New");
        }
        if (game?.updatedLabel) {
            badges.push("Updated");
        }
        if (game?.trendingLabel) {
            badges.push("Trending");
        }
        return badges;
    }

    function getLaunchLabel(game) {
        if (game?.visibility === "coming_soon") {
            return "Coming soon";
        }
        if (game?.visibility === "maintenance") {
            return "Maintenance";
        }
        if (game?.launchDisabled) {
            return "Unavailable";
        }
        return "Play now";
    }

    function createEmptyState(title, subtitle) {
        const empty = document.createElement("div");
        empty.className = "empty-grid";
        empty.innerHTML = `
            ${homeIcon("gamepad")}
            <strong>${escapeHtml(title)}</strong>
            <span>${escapeHtml(subtitle)}</span>
        `;
        return empty;
    }

    function animateCardIn(card, index) {
        if (prefersReducedMotion()) {
            card.style.opacity = "1";
            card.style.filter = "none";
            card.style.transform = "none";
            return;
        }

        card.style.opacity = "0";
        card.style.filter = "blur(18px)";
        card.style.transform = "translateY(26px) scale(0.985)";

        requestAnimationFrame(() => {
            const revealTimer = window.setTimeout(() => {
                if (!card.isConnected) {
                    return;
                }

                card.style.transition = "opacity 0.55s ease, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), filter 0.55s ease";
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
                card.style.filter = "blur(0)";
            }, Math.min(index * 55, 260));
            card.dataset.revealTimer = String(revealTimer);
        });
    }

    function filterGames(query, categoryFilter = "all", runtimeFilter = "all") {
        const normalized = query.trim().toLowerCase();
        return state.games.filter((game) => {
            const matchesQuery = !normalized || game.searchText.includes(normalized);
            const matchesCategory = categoryFilter === "all" || game.category === categoryFilter;
            const matchesRuntime = runtimeFilter === "all" || game.runtimeKind === runtimeFilter;
            return matchesQuery && matchesCategory && matchesRuntime;
        });
    }

    function toggleFavorite(gameId) {
        const game = state.games.find((entry) => entry.id === gameId);
        if (!game) {
            return;
        }

        const index = state.favoriteIds.indexOf(gameId);
        if (index >= 0) {
            state.favoriteIds.splice(index, 1);
            showToast(`Removed ${game.name} from local favorites.`);
        } else {
            state.favoriteIds.unshift(gameId);
            showToast(`Saved ${game.name} to local favorites.`);
        }

        persistFavoriteIds(state.favoriteIds);
        renderHeroShowcase();
        renderQuickLaunches();
        renderGames();
        renderFavorites();
        updateHeroBadges();
    }

    function launchGame(game) {
        if (launchPendingGameId) {
            return;
        }

        if (isGameUnavailable(game)) {
            const message = game.maintenanceMessage
                || game.operationStatus?.maintenanceMessage
                || (game.visibility === "coming_soon"
                    ? `${game.name} is coming soon.`
                    : game.visibility === "maintenance"
                        ? `${game.name} is under maintenance.`
                        : `${game.name} is unavailable right now.`);
            showToast(message);
            return;
        }

        launchPendingGameId = game.id;
        showToast(`Loading ${game.name}...`);

        window.clearTimeout(launchTimer);
        launchTimer = window.setTimeout(() => {
            window.location.href = `/play?id=${encodeURIComponent(game.id)}`;
        }, 140);
    }

    function updateHeroBadges() {
        const badges = document.querySelectorAll(".hero-badge");
        const heroSubtitle = document.querySelector(".hero-subtitle");
        const headlineSubtitle = document.querySelector(".headline-subtitle");
        const heroCaption = document.querySelector(".floating-text");
        const footerSummary = document.getElementById("footer-summary");
        const heroStatGames = document.getElementById("hero-stat-games");
        const heroStatFavorites = document.getElementById("hero-stat-favorites");
        const heroStatLaunches = document.getElementById("hero-stat-launches");
        const heroRuntimeStrip = document.getElementById("hero-runtime-strip");

        if (badges[0]) {
            badges[0].innerHTML = `${homeIcon("unlock")} No login, no backend wall`;
        }

        if (badges[1]) {
            badges[1].innerHTML = `${homeIcon("heart")} ${state.favoriteIds.length} local favorite${state.favoriteIds.length === 1 ? "" : "s"}`;
        }

        if (badges[2]) {
            badges[2].innerHTML = `${homeIcon("folder")} ${state.games.length} synced folder game${state.games.length === 1 ? "" : "s"}`;
        }

        if (heroSubtitle) {
            heroSubtitle.textContent = "A more cinematic arcade front door with fast launches, richer shelves, and every playable card sourced directly from your local library.";
        }

        if (heroCaption) {
            heroCaption.dataset.caption = "Fast browser games, local favorites, runtime-aware discovery, and a calmer editorial shell built for instant play.";
        }

        if (headlineSubtitle) {
            headlineSubtitle.textContent = `Play across ${state.games.length} local game${state.games.length === 1 ? "" : "s"} with ${state.favoriteIds.length} favorite${state.favoriteIds.length === 1 ? "" : "s"} saved on this browser.`;
        }

        if (footerSummary) {
            footerSummary.textContent = `${state.games.length} games synced / ${state.stats.totalLaunches} total launches saved locally`;
        }

        if (heroStatGames) {
            heroStatGames.textContent = String(state.games.length);
        }

        if (heroStatFavorites) {
            heroStatFavorites.textContent = String(state.favoriteIds.length);
        }

        if (heroStatLaunches) {
            heroStatLaunches.textContent = String(state.stats.totalLaunches);
        }

        if (heroRuntimeStrip) {
            const runtimeOrder = ["2d", "3d", "io", "static"];
            const runtimeItems = runtimeOrder
                .map((runtime) => ({
                    runtime,
                    count: state.games.filter((game) => game.runtimeKind === runtime).length,
                    label: getRuntimeLabel(runtime)
                }))
                .filter((entry) => entry.count > 0);

            heroRuntimeStrip.innerHTML = runtimeItems.length
                ? runtimeItems
                    .map((entry) => {
                        return `<span class="runtime-chip runtime-chip--${entry.runtime}"><strong>${entry.count}</strong><span>${escapeHtml(entry.label)}</span></span>`;
                    })
                    .join("")
                : `<span class="runtime-chip runtime-chip--waiting">Waiting for library sync</span>`;
        }
    }

    function initSearch() {
        const input = document.getElementById("search-input");
        if (!input) {
            return;
        }

        input.addEventListener("input", () => {
            state.query = input.value;
            queueRenderGames();
        });
    }

    function queueRenderGames() {
        window.clearTimeout(searchRenderTimer);
        searchRenderTimer = window.setTimeout(() => {
            renderGames();
        }, SEARCH_RENDER_DELAY_MS);
    }

    function initThemeToggle() {
        const toggle = document.getElementById("theme-toggle");
        if (!toggle) {
            return;
        }

        const handleToggle = () => {
            const nextTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
            applyTheme(nextTheme);
        };

        toggle.addEventListener("click", handleToggle);
        toggle.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleToggle();
            }
        });
    }

    function applyTheme(theme) {
        document.body.classList.toggle("light-theme", theme === "light");
        document.body.classList.toggle("dark-theme", theme === "dark");
        document.documentElement.style.colorScheme = theme;
        localStorage.setItem(storageKeys.theme, theme);

        const icon = document.querySelector("#theme-toggle .theme-icon");
        const label = document.querySelector("#theme-toggle .toggle-label");
        if (icon) {
            icon.outerHTML = homeIcon(theme === "light" ? "moon" : "sun", "theme-icon");
        }

        if (label) {
            label.textContent = theme === "light" ? "Dark mode" : "Light mode";
        }
    }

    function initHamburgerMenu() {
        const trigger = document.querySelector(".hamburger-icon");
        const menu = document.querySelector(".menu");

        if (!trigger || !menu) {
            closeMenu = () => {};
            return;
        }

        const setOpen = (isOpen) => {
            trigger.classList.toggle("active", isOpen);
            menu.classList.toggle("active", isOpen);
            trigger.setAttribute("aria-expanded", String(isOpen));
            menu.setAttribute("aria-hidden", String(!isOpen));
        };

        closeMenu = () => setOpen(false);

        trigger.addEventListener("click", () => setOpen(!menu.classList.contains("active")));
        trigger.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setOpen(!menu.classList.contains("active"));
            }
        });

        document.addEventListener("click", (event) => {
            if (!menu.classList.contains("active")) {
                return;
            }

            if (!menu.contains(event.target) && !trigger.contains(event.target)) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });
    }

    function initSmoothAnchors() {
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            const href = link.getAttribute("href");
            if (!href || href === "#") {
                return;
            }

            let target = null;
            try {
                target = document.querySelector(href);
            } catch (_) {
                return;
            }

            if (!target) {
                return;
            }

            link.addEventListener("click", (event) => {
                event.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
                if (target.matches?.(SECTION_REVEAL_SELECTOR)) {
                    revealSection(target);
                }
                queueSectionRevealRefresh(target);
                closeMenu();
            });
        });
    }

    function syncInitialHashTarget() {
        const hash = window.location.hash;
        if (!hash || hash === "#") {
            return;
        }

        let target = null;
        try {
            target = document.querySelector(hash);
        } catch (_) {
            return;
        }

        if (!target) {
            return;
        }

        if (target.matches?.(SECTION_REVEAL_SELECTOR)) {
            revealSection(target);
        }

        queueSectionRevealRefresh(target);
        window.requestAnimationFrame(() => {
            target.scrollIntoView({ behavior: "auto", block: "start" });
            queueSectionRevealRefresh(target);
        });
    }

    function initScrollToTop() {
        const button = document.getElementById("scroll-to-top");
        if (!button) {
            return;
        }

        button.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        updateScrollButtonVisibility();
    }

    function handleScroll() {
        updateScrollButtonVisibility();
        updateActiveNavigation();
        queueSectionRevealRefresh(document);
    }

    function scheduleScrollWork() {
        if (scrollWorkQueued) {
            return;
        }

        scrollWorkQueued = true;
        window.requestAnimationFrame(() => {
            scrollWorkQueued = false;
            handleScroll();
        });
    }

    function updateScrollButtonVisibility() {
        const button = document.getElementById("scroll-to-top");
        if (!button) {
            return;
        }

        button.classList.toggle("visible", window.scrollY > 360);
    }

    function updateActiveNavigation() {
        const sections = ["home", "search", "quick-launch", "favorites", "games", "headline"];
        const offset = 180;
        let currentSection = sections[0];

        sections.forEach((sectionId) => {
            const section = document.getElementById(sectionId);
            if (section && window.scrollY + offset >= section.offsetTop) {
                currentSection = sectionId;
            }
        });

        document.querySelectorAll('header nav a[href^="#"], .menu a[href^="#"]').forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${currentSection}`);
        });
    }

    function initCustomCursor() {
        const cursor = document.querySelector(".custom-cursor");
        if (!cursor) {
            return;
        }

        if (!window.matchMedia("(pointer: fine)").matches) {
            cursor.style.display = "none";
            return;
        }

        let cursorX = 0;
        let cursorY = 0;
        let cursorFrame = 0;

        const moveCursor = () => {
            cursorFrame = 0;
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        };

        document.addEventListener("mousemove", (event) => {
            cursorX = event.clientX;
            cursorY = event.clientY;
            if (!cursorFrame) {
                cursorFrame = window.requestAnimationFrame(moveCursor);
            }
        });

        document.addEventListener("pointerover", (event) => {
            if (event.target.closest(INTERACTIVE_CURSOR_SELECTOR)) {
                cursor.classList.add("hover");
            }
        });

        document.addEventListener("pointerout", (event) => {
            if (event.target.closest(INTERACTIVE_CURSOR_SELECTOR) && !event.relatedTarget?.closest?.(INTERACTIVE_CURSOR_SELECTOR)) {
                cursor.classList.remove("hover");
            }
        });
    }

    function initAmbientLayer() {
        const layer = document.getElementById("snowfall");
        if (!layer) {
            return;
        }

        layer.innerHTML = "";

        for (let index = 0; index < 18; index += 1) {
            const particle = document.createElement("div");
            particle.className = "ambient-dot";
            particle.style.left = `${randomBetween(2, 98)}%`;
            particle.style.top = `${randomBetween(0, 100)}%`;
            particle.style.width = `${randomBetween(8, 30)}px`;
            particle.style.height = particle.style.width;
            particle.style.opacity = `${randomBetween(0.08, 0.3)}`;
            particle.style.animationDuration = `${randomBetween(8, 16)}s`;
            particle.style.animationDelay = `${randomBetween(0, 6)}s`;
            layer.appendChild(particle);
        }
    }

    function initLetterAnimation() {
        const letters = [...document.querySelectorAll(".letter")];
        const container = document.querySelector(".gamehub-container");

        if (!letters.length || !container) {
            return;
        }

        if (prefersReducedMotion()) {
            return;
        }

        const stepDelay = 150;
        const activeDuration = 760;
        const cooldown = 950;
        const cycleDelay = letters.length * stepDelay + activeDuration + cooldown;

        letters.forEach((letter, index) => {
            letter.style.setProperty("--letter-index", String(index));
        });

        const playSequence = () => {
            if (document.hidden) {
                return;
            }

            container.classList.add("animating");

            letters.forEach((letter, index) => {
                window.setTimeout(() => {
                    letter.classList.add("rotating");

                    window.setTimeout(() => {
                        letter.classList.remove("rotating");

                        if (index === letters.length - 1) {
                            window.setTimeout(() => {
                                container.classList.remove("animating");
                            }, 200);
                        }
                    }, activeDuration);
                }, index * stepDelay);
            });
        };

        playSequence();

        if (logoAnimationInterval) {
            window.clearInterval(logoAnimationInterval);
        }

        logoAnimationInterval = window.setInterval(playSequence, cycleDelay);
    }

    function initSectionReveals() {
        const sections = collectSectionRevealNodes(document);
        if (!sections.length) {
            return;
        }

        const observer = getSectionRevealObserver();
        const isMobileReveal = window.matchMedia?.("(max-width: 720px)")?.matches === true;
        const revealStep = isMobileReveal ? 28 : 40;
        const revealCap = isMobileReveal ? 160 : 220;

        sections.forEach((section, index) => {
            if (section.dataset.sectionRevealReady === "1") {
                return;
            }

            section.dataset.sectionRevealReady = "1";
            section.classList.add("section-reveal");
            section.style.setProperty("--reveal-delay", `${Math.min(index * revealStep, revealCap)}ms`);
            if (observer && !isRevealSectionInView(section)) {
                observer.observe(section);
            } else {
                revealSection(section);
            }
        });

        queueSectionRevealRefresh(document);
    }

    function collectSectionRevealNodes(root = document) {
        const nodes = [];
        if (root?.matches?.(SECTION_REVEAL_SELECTOR)) {
            nodes.push(root);
        }

        root?.querySelectorAll?.(SECTION_REVEAL_SELECTOR)?.forEach((node) => {
            nodes.push(node);
        });

        return [...new Set(nodes)].filter((node) => node instanceof HTMLElement);
    }

    function getSectionRevealObserver() {
        if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
            return null;
        }

        if (revealObserver) {
            return revealObserver;
        }

        revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                revealSection(entry.target);
            });
        }, {
            rootMargin: "0px 0px 18% 0px",
            threshold: 0.01
        });

        return revealObserver;
    }

    function isRevealSectionInView(section) {
        if (!(section instanceof HTMLElement)) {
            return false;
        }

        const rect = section.getBoundingClientRect();
        if ((rect.width === 0 && rect.height === 0) || rect.bottom < 0 || rect.right < 0) {
            return false;
        }

        const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
        return rect.top <= viewportHeight * 1.14 && rect.left <= viewportWidth * 1.08;
    }

    function revealSection(section) {
        if (!(section instanceof HTMLElement)) {
            return;
        }

        section.classList.add("is-visible");
        revealObserver?.unobserve?.(section);
    }

    function refreshSectionReveals(root = document) {
        collectSectionRevealNodes(root).forEach((section) => {
            if (section.classList.contains("is-visible")) {
                return;
            }

            if (isRevealSectionInView(section)) {
                revealSection(section);
            }
        });
    }

    function queueSectionRevealRefresh(root = document) {
        if (revealRefreshFrame) {
            return;
        }

        revealRefreshFrame = window.requestAnimationFrame(() => {
            revealRefreshFrame = 0;
            refreshSectionReveals(root);
        });
    }

    function hideLoader() {
        const overlay = document.querySelector(".loading-overlay");
        if (!overlay) {
            return;
        }

        const hasSeenLoader = sessionStorage.getItem("gamehubLoaderSeen") === "true";
        const delay = hasSeenLoader ? 160 : 780;

        window.setTimeout(() => {
            overlay.classList.add("hidden");
            sessionStorage.setItem("gamehubLoaderSeen", "true");
        }, delay);
    }

    function showToast(message) {
        if (activeToast) {
            window.clearTimeout(toastHideTimer);
            window.clearTimeout(toastRemoveTimer);
            activeToast.remove();
        }

        const toast = document.createElement("div");
        toast.className = "toast visible";
        toast.textContent = message;

        document.body.appendChild(toast);
        activeToast = toast;

        toastHideTimer = window.setTimeout(() => {
            toast.classList.remove("visible");
            toastRemoveTimer = window.setTimeout(() => {
                toast.remove();
                if (activeToast === toast) {
                    activeToast = null;
                }
            }, 300);
        }, 2200);
    }

    function uniqueIds(values) {
        return [...new Set(values)];
    }

    function randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    function prefersReducedMotion() {
        return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || false;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
})();
