(function attachPlayerShell() {
    "use strict";

    const catalog = window.GameHubCatalog;
    const platform = window.GameHubPlatform || {};
    if (!catalog || !platform.GameSessionController || !platform.AudioPolicyManager || !platform.PlatformInputManager || !platform.StorageManager) {
        console.error("GameHub player dependencies are missing.");
        return;
    }

    const { loadGamesCatalog, getGameById, getSuggestedGames, storageKeys } = catalog;
    const storageManager = platform.StorageManager.create();
    const audioManager = platform.AudioPolicyManager.create();
    const inputManager = platform.PlatformInputManager.create();
    const mobileControlDeck = platform.MobileControlDeck?.create({
        root: document.getElementById("mobile-control-deck")
    }) || null;

    const params = new URLSearchParams(window.location.search);
    const requestedGameRoute = normalizeEmbeddedRoute(params.get("gameRoute"));
    const cinemaStorageKey = "gamehub-player-cinema-view";
    const PREMIUM_ONLY_PUBLIC_GAME_REDIRECTS = new Map([
        ["chopsticks-3d-arena", "/premium/play?id=chopsticks-3d-arena"]
    ]);

    const ui = {
        frameShell: document.getElementById("frame-shell"),
        frameTemplate: document.getElementById("game-frame"),
        loader: document.getElementById("game-loader"),
        loaderText: document.getElementById("loader-text"),
        ageGate: document.getElementById("age-gate"),
        ageGateText: document.getElementById("age-gate-text"),
        fallback: document.getElementById("player-fallback"),
        fallbackTitle: document.getElementById("fallback-title"),
        fallbackText: document.getElementById("fallback-text"),
        pauseOverlay: document.getElementById("pause-overlay"),
        orientationOverlay: document.getElementById("orientation-overlay"),
        orientationTitle: document.getElementById("orientation-title"),
        orientationText: document.getElementById("orientation-text")
    };

    const state = {
        games: [],
        currentGame: null,
        favorites: [],
        stats: loadStats(),
        recentIds: loadRecent(),
        cinemaMode: false,
        pendingAgeGateReload: false,
        mutedLaunchRequested: false,
        isPaused: false,
        pauseReason: null,
        orientationBlocked: false
    };
    let responsiveSyncFrame = 0;

    const sessionController = platform.GameSessionController.create({
        frameShell: ui.frameShell,
        frameTemplate: ui.frameTemplate,
        audioManager,
        onLoader({ visible, message }) {
            ui.loader.classList.toggle("hidden", !visible);
            if (message) {
                ui.loaderText.textContent = message;
            }
        },
        onHint(message) {
            ui.loaderText.textContent = message;
        },
        onReady({ game }) {
            hideFallback();
            window.GameHubAnalytics?.trackGamePlayStart?.(game);
            recordLaunch(game.id);
            renderPage();
            syncResponsivePresentation();
        },
        onError({ message }) {
            showFallback("Game Session Recovered", message);
            syncResponsivePresentation();
        },
        onStateChange(event) {
            if (event.type === "paused") {
                syncSessionOverlays();
            }

            if (event.type === "resumed" || event.type === "destroyed" || event.type === "loading" || event.type === "ready" || event.type === "error") {
                syncSessionOverlays();
            }
        }
    });

    void init();

    async function init() {
        applyTheme(loadTheme());
        applyCinemaMode(loadCinemaMode());
        bindBaseControls();

        const loadedCatalog = await loadGamesCatalog();
        state.games = Array.isArray(loadedCatalog.games) ? loadedCatalog.games : [];
        const migratedPremiumTarget = resolvePremiumOnlyRedirect(params.get("id"), requestedGameRoute);
        if (migratedPremiumTarget) {
            window.location.replace(migratedPremiumTarget);
            return;
        }
        const requestedGameId = String(params.get("id") || "").trim();
        state.currentGame = getGameById(state.games, requestedGameId) || (!requestedGameId ? state.games[0] || null : null);
        state.favorites = loadFavorites();

        if (!state.currentGame) {
            renderEmptyState();
            return;
        }

        storageManager.migrateKnownKeys(state.currentGame);
        bindGameControls();
        renderPage();
        syncResponsivePresentation();
        requestGameLaunch(false, false);
    }

    function goHome() {
        window.location.href = "/gamehub#games";
    }

    function bindBaseControls() {
        document.getElementById("back-button").addEventListener("click", goHome);
        document.getElementById("empty-back").addEventListener("click", goHome);
        document.getElementById("fallback-home").addEventListener("click", goHome);
        document.getElementById("orientation-home").addEventListener("click", goHome);
        document.getElementById("fallback-retry").addEventListener("click", () => requestGameLaunch(true, state.mutedLaunchRequested));

        document.getElementById("theme-toggle").addEventListener("click", () => {
            const nextTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
            applyTheme(nextTheme);
        });

        document.getElementById("age-gate-confirm").addEventListener("click", () => {
            hideAgeGate();
            requestGameLaunch(state.pendingAgeGateReload, false, true);
        });
        document.getElementById("age-gate-decline").addEventListener("click", goHome);

        document.addEventListener("fullscreenchange", updateFullscreenUi);
        document.addEventListener("webkitfullscreenchange", updateFullscreenUi);
        document.addEventListener("msfullscreenchange", updateFullscreenUi);

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                setPausedState(true, "document-hidden");
                return;
            }

            if (state.isPaused && state.pauseReason === "document-hidden") {
                setPausedState(false, "document-visible");
            }
        });

        window.addEventListener("resize", scheduleResponsivePresentation, { passive: true });
        window.addEventListener("orientationchange", scheduleResponsivePresentation, { passive: true });

        window.addEventListener("beforeunload", () => {
            if (responsiveSyncFrame) {
                window.cancelAnimationFrame(responsiveSyncFrame);
                responsiveSyncFrame = 0;
            }
            sessionController.destroy("page-unload");
            inputManager.destroy();
            mobileControlDeck?.destroy();
        });
    }

    function bindGameControls() {
        document.getElementById("reload-button").addEventListener("click", () => {
            requestGameLaunch(true, state.mutedLaunchRequested);
        });

        document.getElementById("cinema-button").addEventListener("click", toggleCinemaMode);
        document.getElementById("fullscreen-button").addEventListener("click", togglePlayerFullscreen);
        document.getElementById("favorite-toggle").addEventListener("click", () => toggleFavorite(state.currentGame.id));
        document.getElementById("pause-resume-button").addEventListener("click", () => {
            setPausedState(false, "overlay-resume");
        });

        inputManager.setHandlers({
            onEscape() {
                if (isPlayerShellFullscreen()) {
                    void exitShellFullscreen();
                    return;
                }

                if (state.isPaused) {
                    setPausedState(false, "escape-resume");
                }
            },
            onFullscreenToggle() {
                void togglePlayerFullscreen();
            },
            onReload() {
                requestGameLaunch(true, state.mutedLaunchRequested);
            }
        });

        updateFullscreenUi();
        updatePauseButton();
        updateMuteButton();
    }

    function requestGameLaunch(forceReload, mutedPlayback, skipAgeGate = false) {
        if (!state.currentGame) {
            return;
        }

        if (!skipAgeGate && state.currentGame.requiresAgeConfirmation) {
            state.pendingAgeGateReload = forceReload;
            state.mutedLaunchRequested = mutedPlayback;
            sessionController.destroy("age-gate");
            showAgeGate();
            return;
        }

        hideAgeGate();
        hideFallback();
        state.mutedLaunchRequested = Boolean(mutedPlayback);
        storageManager.migrateKnownKeys(state.currentGame);
        audioManager.setMuted(state.mutedLaunchRequested);
        sessionController.load(state.currentGame, {
            forceReload,
            muted: state.mutedLaunchRequested,
            routeFragment: requestedGameRoute
        });
        sessionController.updatePresentation({
            cinemaMode: state.cinemaMode,
            fullscreen: isPlayerShellFullscreen(),
            theme: loadTheme()
        });
        updateMuteButton();
        updatePauseButton();
        syncResponsivePresentation();
    }

    function getPresentationPolicy(game = state.currentGame) {
        return game?.presentation || {
            requireLandscape: false,
            preferredOrientation: "any",
            viewportProfile: "balanced",
            minStageHeight: 360
        };
    }

    function isCoarsePointerViewport() {
        return window.matchMedia?.("(pointer: coarse)").matches || false;
    }

    function isCompactViewport() {
        return window.innerWidth <= 960 || (isCoarsePointerViewport() && window.innerWidth <= 1180);
    }

    function shouldEnforceLandscape(game = state.currentGame) {
        return Boolean(getPresentationPolicy(game).requireLandscape && (isCoarsePointerViewport() || window.innerWidth <= 960));
    }

    function computeResponsiveFrameHeight(game = state.currentGame) {
        const presentation = getPresentationPolicy(game);
        const minHeight = Number(presentation.minStageHeight || 360);

        if (isPlayerShellFullscreen()) {
            return Math.max(minHeight, window.innerHeight);
        }

        const compact = isCompactViewport();
        const immersive = presentation.viewportProfile === "immersive";
        const reservedChrome = state.cinemaMode
            ? (compact ? 118 : 138)
            : (compact ? (immersive ? 168 : 232) : (immersive ? 228 : 310));
        const available = Math.max(260, window.innerHeight - reservedChrome);

        return Math.max(minHeight, Math.min(window.innerHeight - 18, available));
    }

    function syncSessionOverlays() {
        if (state.orientationBlocked) {
            ui.orientationOverlay.classList.add("visible");
            ui.orientationOverlay.setAttribute("aria-hidden", "false");
            hidePauseOverlay();
            return;
        }

        ui.orientationOverlay.classList.remove("visible");
        ui.orientationOverlay.setAttribute("aria-hidden", "true");

        if (state.isPaused) {
            showPauseOverlay();
            return;
        }

        hidePauseOverlay();
    }

    function syncOrientationGuard() {
        if (!state.currentGame) {
            state.orientationBlocked = false;
            syncSessionOverlays();
            return;
        }

        const shouldBlock = shouldEnforceLandscape(state.currentGame) && window.innerHeight > window.innerWidth;
        state.orientationBlocked = shouldBlock;
        document.body.classList.toggle("player-landscape-blocked", shouldBlock);

        if (shouldBlock) {
            ui.orientationTitle.textContent = `${state.currentGame.name} needs landscape`;
            ui.orientationText.textContent = `Rotate your phone or tablet sideways to continue playing ${state.currentGame.name}. The session will resume automatically when landscape mode is available.`;
            if (!state.isPaused || state.pauseReason !== "orientation-lock" || !sessionController.currentSession?.paused) {
                setPausedState(true, "orientation-lock");
            } else {
                syncSessionOverlays();
            }
            return;
        }

        if (state.isPaused && state.pauseReason === "orientation-lock") {
            setPausedState(false, "orientation-restored");
            return;
        }

        syncSessionOverlays();
    }

    function syncResponsivePresentation() {
        if (!state.currentGame) {
            mobileControlDeck?.hide();
            return;
        }

        const presentation = getPresentationPolicy(state.currentGame);
        const compact = isCompactViewport();
        const immersive = presentation.viewportProfile === "immersive";
        const landscape = window.innerWidth >= window.innerHeight;
        const frameHeight = Math.round(computeResponsiveFrameHeight(state.currentGame));

        document.documentElement.style.setProperty("--player-frame-height", `${frameHeight}px`);
        document.documentElement.style.setProperty("--player-stage-min-height", `${presentation.minStageHeight}px`);
        document.body.classList.toggle("player-compact", compact);
        document.body.classList.toggle("game-fit-immersive", immersive);
        document.body.classList.toggle("player-landscape-required", presentation.requireLandscape);

        sessionController.updatePresentation({
            cinemaMode: state.cinemaMode,
            fullscreen: isPlayerShellFullscreen(),
            theme: loadTheme(),
            compact,
            landscape,
            requireLandscape: presentation.requireLandscape,
            preferredOrientation: presentation.preferredOrientation,
            viewportProfile: presentation.viewportProfile,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            embeddedMinHeight: frameHeight
        });

        syncOrientationGuard();

        mobileControlDeck?.update({
            game: state.currentGame,
            sessionController,
            coarsePointer: isCoarsePointerViewport(),
            compact,
            landscape,
            orientationBlocked: state.orientationBlocked,
            paused: state.isPaused,
            ready: sessionController.currentSession?.state === "ready"
        });
    }

    function scheduleResponsivePresentation() {
        if (responsiveSyncFrame) {
            return;
        }

        responsiveSyncFrame = window.requestAnimationFrame(() => {
            responsiveSyncFrame = 0;
            syncResponsivePresentation();
        });
    }

    function renderPage() {
        document.title = `${state.currentGame.name} | GameHub Player`;
        document.documentElement.style.setProperty("--accent", state.currentGame.accent);
        document.documentElement.style.setProperty("--accent-strong", state.currentGame.accentAlt);

        document.getElementById("game-title").textContent = state.currentGame.name;
        document.getElementById("game-subtitle").textContent = state.currentGame.subtitle;
        document.getElementById("game-description").textContent = state.currentGame.description;
        document.getElementById("game-category").innerHTML = `<i class="fas fa-tag"></i> ${escapeHtml(state.currentGame.category)}`;
        document.getElementById("game-type").innerHTML = `<i class="fas fa-user"></i> ${escapeHtml(state.currentGame.type)}`;
        document.getElementById("game-age").innerHTML = `<i class="fas fa-user"></i> ${escapeHtml(state.currentGame.ageRating)}`;
        document.getElementById("game-play-count").innerHTML = `<i class="fas fa-fire"></i> ${getPlayCount(state.currentGame.id)} play${getPlayCount(state.currentGame.id) === 1 ? "" : "s"}`;
        document.getElementById("game-path").innerHTML = `<i class="fas fa-folder-open"></i> ${escapeHtml(state.currentGame.path)}`;
        document.getElementById("game-thumb").src = state.currentGame.thumbnail;
        document.getElementById("game-thumb").alt = `${state.currentGame.name} artwork`;
        document.getElementById("game-runtime").innerHTML = `<i class="fas fa-layer-group"></i> ${escapeHtml(state.currentGame.runtimeKind.toUpperCase())}`;
        document.getElementById("game-profile").innerHTML = `<i class="fas fa-clock"></i> ${escapeHtml(state.currentGame.loadProfile)}${state.currentGame.presentation?.requireLandscape ? " / landscape" : ""}`;
        window.GameHubFeedback?.setGameContext?.({
            gameSlug: state.currentGame.id,
            gameTitle: state.currentGame.name,
            path: window.location.pathname + window.location.search
        });
        window.GameHubAnalytics?.trackGameView?.(state.currentGame, {
            path: window.location.pathname + window.location.search
        });

        updateFavoriteButton();
        updateStatsUi();
        renderSuggestedGames();
        renderRecent();
        syncResponsivePresentation();
    }

    function renderSuggestedGames() {
        const container = document.getElementById("suggested-list");
        container.innerHTML = "";

        getSuggestedGames(state.games, state.currentGame.id, 5).forEach((game) => {
            const card = document.createElement("button");
            card.type = "button";
            card.className = `suggestion-card${game.id === state.currentGame.id ? " active" : ""}`;
            card.innerHTML = `
                <img src="${game.thumbnail}" alt="${escapeHtml(game.name)} artwork">
                <div>
                    <div class="suggestion-meta">
                        <span>${escapeHtml(game.category)}</span>
                        <span>${escapeHtml(game.runtimeKind.toUpperCase())}</span>
                    </div>
                    <h3>${escapeHtml(game.name)}</h3>
                    <p>${escapeHtml(game.subtitle)}</p>
                </div>
            `;

            card.addEventListener("click", () => {
                window.location.href = `/play?id=${encodeURIComponent(game.id)}`;
            });

            container.appendChild(card);
        });
    }

    function renderRecent() {
        const recentList = document.getElementById("recent-list");
        const empty = document.getElementById("recent-empty");
        recentList.innerHTML = "";

        const recentGames = state.recentIds
            .filter((id) => id !== state.currentGame.id)
            .map((id) => getGameById(state.games, id))
            .filter(Boolean)
            .slice(0, 5);

        if (!recentGames.length) {
            empty.style.display = "block";
            return;
        }

        empty.style.display = "none";

        recentGames.forEach((game) => {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "recent-chip";
            chip.textContent = `${game.name} · ${game.runtimeKind.toUpperCase()}`;
            chip.addEventListener("click", () => {
                window.location.href = `/play?id=${encodeURIComponent(game.id)}`;
            });
            recentList.appendChild(chip);
        });
    }

    function toggleFavorite(gameId) {
        if (state.favorites.includes(gameId)) {
            state.favorites = state.favorites.filter((id) => id !== gameId);
        } else {
            state.favorites = [gameId, ...state.favorites.filter((id) => id !== gameId)];
        }

        localStorage.setItem(storageKeys.favorites, JSON.stringify(state.favorites));
        updateFavoriteButton();
        updateStatsUi();
    }

    function updateFavoriteButton() {
        const button = document.getElementById("favorite-toggle");
        const isFavorite = state.favorites.includes(state.currentGame.id);
        button.innerHTML = `<i class="fas fa-heart"></i> ${isFavorite ? "Saved locally" : "Add favorite"}`;
        button.classList.toggle("favorite-active", isFavorite);
    }

    function updateStatsUi() {
        const playCount = getPlayCount(state.currentGame.id);
        document.getElementById("game-play-count").innerHTML = `<i class="fas fa-fire"></i> ${playCount} play${playCount === 1 ? "" : "s"}`;
        document.getElementById("favorite-count").textContent = state.favorites.length;
        document.getElementById("total-launches").textContent = Number(state.stats.totalLaunches || 0);
        document.getElementById("library-count").textContent = state.games.length;
    }

    function recordLaunch(gameId) {
        const gameStats = state.stats.games[gameId] || { count: 0, lastPlayed: null };
        state.stats.totalLaunches = Number(state.stats.totalLaunches || 0) + 1;
        state.stats.games[gameId] = {
            count: Number(gameStats.count || 0) + 1,
            lastPlayed: new Date().toISOString()
        };
        localStorage.setItem(storageKeys.stats, JSON.stringify(state.stats));

        state.recentIds = [gameId, ...state.recentIds.filter((id) => id !== gameId)].slice(0, 8);
        localStorage.setItem(storageKeys.recent, JSON.stringify(state.recentIds));
    }

    function getPlayCount(gameId) {
        return Number(state.stats.games?.[gameId]?.count || 0);
    }

    function loadTheme() {
        return localStorage.getItem(storageKeys.theme) === "dark" ? "dark" : "light";
    }

    function applyTheme(theme) {
        document.body.classList.toggle("light-theme", theme === "light");
        document.body.classList.toggle("dark-theme", theme === "dark");
        document.documentElement.style.colorScheme = theme;
        localStorage.setItem(storageKeys.theme, theme);

        const toggle = document.getElementById("theme-toggle");
        toggle.innerHTML = theme === "light"
            ? '<i class="fas fa-moon"></i> Dark mode'
            : '<i class="fas fa-sun"></i> Light mode';

        sessionController.updatePresentation({
            theme
        });
        syncResponsivePresentation();
    }

    function loadFavorites() {
        try {
            const stored = JSON.parse(localStorage.getItem(storageKeys.favorites) || "[]");
            return Array.isArray(stored) ? stored.filter(Boolean) : [];
        } catch (_) {
            return [];
        }
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
        } catch (_) {
            // Fall back below.
        }

        return {
            totalLaunches: 0,
            games: {}
        };
    }

    function loadRecent() {
        try {
            const stored = JSON.parse(localStorage.getItem(storageKeys.recent) || "[]");
            return Array.isArray(stored) ? stored.filter(Boolean) : [];
        } catch (_) {
            return [];
        }
    }

    function loadCinemaMode() {
        return localStorage.getItem(cinemaStorageKey) === "true";
    }

    function applyCinemaMode(enabled) {
        state.cinemaMode = Boolean(enabled);
        document.body.classList.toggle("cinema-view", state.cinemaMode);
        localStorage.setItem(cinemaStorageKey, state.cinemaMode ? "true" : "false");
        const button = document.getElementById("cinema-button");
        button.innerHTML = state.cinemaMode
            ? '<i class="fas fa-compress"></i> Exit Cinema'
            : '<i class="fas fa-film"></i> Cinema View';
        button.classList.toggle("is-toggled", state.cinemaMode);

        sessionController.updatePresentation({
            cinemaMode: state.cinemaMode
        });
        syncResponsivePresentation();
    }

    function toggleCinemaMode() {
        applyCinemaMode(!state.cinemaMode);
    }

    function showAgeGate() {
        const warning = state.currentGame?.contentWarning || "This game is marked 18+ because it contains mature content. Confirm that you are 18 or older before continuing.";
        ui.ageGateText.textContent = warning;
        ui.ageGate.classList.add("visible");
        ui.ageGate.setAttribute("aria-hidden", "false");
    }

    function hideAgeGate() {
        ui.ageGate.classList.remove("visible");
        ui.ageGate.setAttribute("aria-hidden", "true");
    }

    function showFallback(title, message) {
        ui.fallbackTitle.textContent = title;
        ui.fallbackText.textContent = message;
        ui.fallback.classList.add("visible");
        ui.fallback.setAttribute("aria-hidden", "false");
    }

    function hideFallback() {
        ui.fallback.classList.remove("visible");
        ui.fallback.setAttribute("aria-hidden", "true");
    }

    function showPauseOverlay() {
        updatePauseButton();
        ui.pauseOverlay.classList.add("visible");
        ui.pauseOverlay.setAttribute("aria-hidden", "false");
    }

    function hidePauseOverlay() {
        updatePauseButton();
        ui.pauseOverlay.classList.remove("visible");
        ui.pauseOverlay.setAttribute("aria-hidden", "true");
    }

    function setPausedState(paused, reason) {
        if (paused) {
            state.isPaused = true;
            state.pauseReason = reason;
            sessionController.pause(reason);
            syncSessionOverlays();
            return;
        }

        state.isPaused = false;
        state.pauseReason = null;
        sessionController.resume(reason);
        syncSessionOverlays();
    }

    function updatePauseButton() {
        const button = document.getElementById("pause-button");
        if (!button) {
            return;
        }
        button.innerHTML = state.isPaused
            ? '<i class="fas fa-play"></i> Resume'
            : '<i class="fas fa-window-restore"></i> Pause';
        button.setAttribute("aria-pressed", state.isPaused ? "true" : "false");
    }

    function updateMuteButton() {
        const button = document.getElementById("mute-button");
        if (!button) {
            return;
        }
        button.innerHTML = state.mutedLaunchRequested
            ? '<i class="fas fa-volume-xmark"></i> Session Muted'
            : '<i class="fas fa-wave-square"></i> Session Audio';
        button.classList.toggle("favorite-active", state.mutedLaunchRequested);
    }

    function renderEmptyState() {
        const requestedGameId = String(params.get("id") || "").trim();
        const title = document.getElementById("empty-title");
        const text = document.getElementById("empty-text");
        if (requestedGameId && state.games.length) {
            if (title) {
                title.textContent = "Game not available";
            }
            if (text) {
                text.textContent = `The selected game "${requestedGameId}" is not in this server catalog. Go back home and launch an available game.`;
            }
        }

        document.getElementById("player-main").style.display = "none";
        document.getElementById("empty-state").classList.add("visible");
        ["favorite-toggle", "reload-button", "cinema-button", "fullscreen-button"].forEach((id) => {
            const button = document.getElementById(id);
            if (button) {
                button.disabled = true;
            }
        });
    }

    function getFullscreenElement() {
        return document.fullscreenElement
            || document.webkitFullscreenElement
            || document.msFullscreenElement
            || null;
    }

    function isFullscreenSupported() {
        const shell = ui.frameShell;
        return Boolean(
            shell?.requestFullscreen
            || shell?.webkitRequestFullscreen
            || shell?.msRequestFullscreen
            || document.exitFullscreen
            || document.webkitExitFullscreen
            || document.msExitFullscreen
        );
    }

    function isPlayerShellFullscreen() {
        return Boolean(ui.frameShell && getFullscreenElement() === ui.frameShell);
    }

    async function requestShellFullscreen(shell) {
        if (shell.requestFullscreen) {
            await shell.requestFullscreen();
            return;
        }
        if (shell.webkitRequestFullscreen) {
            await shell.webkitRequestFullscreen();
            return;
        }
        if (shell.msRequestFullscreen) {
            await shell.msRequestFullscreen();
            return;
        }
        throw new Error("Fullscreen is not supported in this browser.");
    }

    async function exitShellFullscreen() {
        if (document.exitFullscreen) {
            await document.exitFullscreen();
            return;
        }
        if (document.webkitExitFullscreen) {
            await document.webkitExitFullscreen();
            return;
        }
        if (document.msExitFullscreen) {
            await document.msExitFullscreen();
            return;
        }
        throw new Error("Fullscreen exit is not supported in this browser.");
    }

    async function togglePlayerFullscreen() {
        const button = document.getElementById("fullscreen-button");
        if (!button || !ui.frameShell) {
            return;
        }

        if (!isFullscreenSupported()) {
            button.disabled = true;
            button.title = "Fullscreen is not available in this browser.";
            return;
        }

        button.disabled = true;
        try {
            if (isPlayerShellFullscreen()) {
                await exitShellFullscreen();
            } else {
                await requestShellFullscreen(ui.frameShell);
            }
        } catch (error) {
            console.warn("Fullscreen toggle failed:", error);
        } finally {
            button.disabled = false;
            updateFullscreenUi();
        }
    }

    function updateFullscreenUi() {
        const button = document.getElementById("fullscreen-button");
        if (!button) {
            return;
        }

        if (!isFullscreenSupported()) {
            button.innerHTML = '<i class="fas fa-ban"></i> Fullscreen Unavailable';
            button.disabled = true;
            button.title = "Fullscreen is not available in this browser.";
            button.setAttribute("aria-pressed", "false");
            return;
        }

        const isFullscreen = isPlayerShellFullscreen();
        ui.frameShell.classList.toggle("is-fullscreen", isFullscreen);
        document.body.classList.toggle("player-fullscreen", isFullscreen);
        button.innerHTML = isFullscreen
            ? '<i class="fas fa-compress"></i> Exit Fullscreen'
            : '<i class="fas fa-expand"></i> Fullscreen';
        button.title = isFullscreen ? "Exit fullscreen player view" : "Open the player in fullscreen";
        button.setAttribute("aria-pressed", isFullscreen ? "true" : "false");

        sessionController.updatePresentation({
            fullscreen: isFullscreen
        });
        syncResponsivePresentation();
    }

    function normalizeEmbeddedRoute(value) {
        const trimmed = String(value || "").trim();
        if (!trimmed) {
            return "";
        }

        const withoutHash = trimmed.replace(/^#/, "");
        const normalized = withoutHash.startsWith("/") ? withoutHash : `/${withoutHash}`;
        return normalized.replace(/\/{2,}/g, "/");
    }

    function resolvePremiumOnlyRedirect(gameId, gameRoute) {
        const normalizedId = String(gameId || "").trim();
        if (normalizedId && PREMIUM_ONLY_PUBLIC_GAME_REDIRECTS.has(normalizedId)) {
            return PREMIUM_ONLY_PUBLIC_GAME_REDIRECTS.get(normalizedId);
        }

        if (gameRoute && normalizeEmbeddedRoute(gameRoute).startsWith("/games/chopstick/")) {
            return PREMIUM_ONLY_PUBLIC_GAME_REDIRECTS.get("chopsticks-3d-arena");
        }

        return "";
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
