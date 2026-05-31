(function attachPremiumPlayer() {
    "use strict";

    const premium = window.GameHubPremium;
    const platform = window.GameHubPlatform || {};
    if (!premium || !platform.GameSessionController || !platform.AudioPolicyManager || !platform.PlatformInputManager || !platform.StorageManager) {
        console.error("Premium player dependencies are missing.");
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const CINEMA_STORAGE_KEY = "gamehubPremium.playerCinemaView";
    const storageManager = platform.StorageManager.create();
    const audioManager = platform.AudioPolicyManager.create();
    const inputManager = platform.PlatformInputManager.create();
    const mobileControlDeck = platform.MobileControlDeck?.create({
        root: document.getElementById("premium-mobile-control-deck")
    }) || null;

    const ui = {
        header: document.querySelector(".premium-header"),
        headerActions: document.querySelector(".premium-header-actions"),
        actionRow: document.querySelector(".premium-action-row"),
        headline: document.querySelector(".premium-player-headline"),
        metaRow: document.querySelector(".premium-meta-row"),
        themeToggle: document.querySelector(".premium-header [data-theme-toggle]"),
        frameShell: document.getElementById("premium-frame-shell"),
        frameTemplate: document.getElementById("premium-game-frame"),
        loader: document.getElementById("premium-loader"),
        loaderText: document.getElementById("premium-loader-text"),
        fallback: document.getElementById("premium-fallback"),
        fallbackTitle: document.getElementById("premium-fallback-title"),
        fallbackText: document.getElementById("premium-fallback-text"),
        pauseOverlay: document.getElementById("premium-pause-overlay"),
        orientationOverlay: document.getElementById("premium-orientation-overlay"),
        orientationTitle: document.getElementById("premium-orientation-title"),
        orientationText: document.getElementById("premium-orientation-text"),
        accessWall: document.getElementById("premium-access-wall"),
        accessTitle: document.getElementById("premium-access-title"),
        accessText: document.getElementById("premium-access-text"),
        accessMeta: document.getElementById("premium-access-meta"),
        accessPrimary: document.getElementById("premium-access-primary"),
        accessSecondary: document.getElementById("premium-access-secondary")
    };

    const state = {
        games: [],
        currentGame: null,
        session: {
            authenticated: false,
            user: null,
            configured: false,
            provider: "firebase",
            mode: "future-auth",
            ticket: null
        },
        watchlist: premium.loadWatchlist(),
        recent: premium.loadRecent(),
        stats: premium.loadStats(),
        cinemaMode: false,
        mutedLaunchRequested: false,
        operations: null,
        isPaused: false,
        pauseReason: null,
        orientationBlocked: false,
        hasRecordedView: false,
        mobileImmersionGestureBound: false,
        mobileImmersionGestureHandler: null
    };

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
        onReady() {
            hideFallback();
            hideAccessWall();
            window.GameHubAnalytics?.trackGamePlayStart?.(state.currentGame, {
                path: window.location.pathname + window.location.search
            });
            state.stats = premium.recordPremiumVisit(state.currentGame.id, { launch: true, visit: false });
            state.recent = premium.loadRecent();
            renderPage();
            syncResponsivePresentation();
            syncEmbeddedPremiumAuth();
        },
        onError({ message }) {
            showFallback("Could not start this game", message);
        },
        onStateChange(event) {
            if (["paused", "resumed", "destroyed", "loading", "ready"].includes(event.type)) {
                syncSessionOverlays();
            }
        }
    });

    document.addEventListener("DOMContentLoaded", () => {
        void init();
    });

    async function init() {
        bindBaseControls();
        applyCinemaMode(loadCinemaMode(), { persist: false });
        const [games, session] = await Promise.all([
            premium.loadPremiumCatalog(false, { includeUnavailable: true }),
            premium.loadPremiumSession()
        ]);

        state.games = Array.isArray(games) ? games : [];
        state.session = session || state.session;
        state.operations = premium.operationsConfig || null;
        state.currentGame = premium.getPremiumGameById(state.games, params.get("id"));

        if (window.GameHubPremiumAuth?.subscribe) {
            window.GameHubPremiumAuth.subscribe((nextSession) => {
                state.session = nextSession || state.session;
                renderPage();
                syncEmbeddedPremiumAuth();
            });
        }

        if (!state.currentGame) {
            renderEmptyState();
            return;
        }

        syncGameIdentityClasses();

        if (!state.hasRecordedView) {
            state.stats = premium.recordPremiumVisit(state.currentGame.id, { launch: false });
            state.recent = premium.loadRecent();
            state.hasRecordedView = true;
        }

        renderPage();
        syncResponsivePresentation();
        premium.primeReveal?.(document.querySelector("#premium-player-main"));

        if (canLaunchCurrentGame()) {
            void requestGameLaunch(false, false);
        } else {
            showAccessWall();
        }
    }

    function goPremiumHome() {
        releaseMobileLandscapeLock();
        premium.navigateWithTransition?.("/premium");
    }

    function bindBaseControls() {
        document.getElementById("premium-home-button").addEventListener("click", goPremiumHome);
        document.getElementById("premium-fallback-home").addEventListener("click", goPremiumHome);
        document.getElementById("premium-fallback-retry").addEventListener("click", () => {
            void requestGameLaunch(true, state.mutedLaunchRequested);
        });
        document.getElementById("premium-orientation-home").addEventListener("click", goPremiumHome);
        document.getElementById("premium-pause-resume").addEventListener("click", () => {
            setPausedState(false, "overlay-resume");
        });

        document.getElementById("premium-fullscreen-button").addEventListener("click", () => {
            void togglePlayerFullscreen();
        });
        document.getElementById("premium-cinema-button").addEventListener("click", () => {
            toggleCinemaMode();
        });
        document.getElementById("premium-shortlist-button").addEventListener("click", () => {
            if (!state.currentGame) {
                return;
            }

            state.watchlist = premium.toggleWatchlist(state.currentGame.id);
            renderWatchlistButton();
        });
        document.getElementById("premium-launch-button").addEventListener("click", () => {
            if (canLaunchCurrentGame()) {
                void requestGameLaunch(true, state.mutedLaunchRequested);
                return;
            }

            routeAccessIntent();
        });

        document.addEventListener("fullscreenchange", updateFullscreenUi);
        document.addEventListener("webkitfullscreenchange", updateFullscreenUi);
        window.addEventListener("resize", syncResponsivePresentation, { passive: true });
        window.addEventListener("orientationchange", syncResponsivePresentation, { passive: true });
        document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
            button.addEventListener("click", () => {
                window.setTimeout(() => {
                    sessionController.updatePresentation({
                        theme: premium.loadStoredTheme()
                    });
                    syncResponsivePresentation();
                }, 0);
            });
        });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                setPausedState(true, "document-hidden");
                return;
            }

            if (state.isPaused && state.pauseReason === "document-hidden") {
                setPausedState(false, "document-visible");
            }
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
                void requestGameLaunch(true, state.mutedLaunchRequested);
            }
        });

        window.addEventListener("beforeunload", () => {
            releaseMobileLandscapeLock();
            sessionController.destroy("page-unload");
            inputManager.destroy();
            mobileControlDeck?.destroy();
        });

        updateFullscreenUi();
        updateCinemaButton();
        updateMuteButton();
        updatePauseButton();
    }

    function isHandrexGame() {
        return String(state.currentGame?.id || "").toLowerCase() === "handrex";
    }

    function syncGameIdentityClasses() {
        const isHandrex = isHandrexGame();
        document.documentElement.classList.toggle("premium-game-handrex", isHandrex);
        document.body.classList.toggle("premium-game-handrex", isHandrex);
        ui.frameShell?.classList.toggle("premium-frame-shell--handrex", isHandrex);
        ui.frameTemplate?.classList.toggle("premium-game-frame--handrex", isHandrex);
    }

    function renderPage() {
        if (!state.currentGame) {
            return;
        }

        document.title = `${state.currentGame.name} | GameHub Premium`;
        document.documentElement.style.setProperty("--premium-accent", state.currentGame.accent);
        document.documentElement.style.setProperty("--premium-accent-alt", state.currentGame.accentAlt);

        document.getElementById("premium-game-title").textContent = state.currentGame.name;
        document.getElementById("premium-game-subtitle").textContent = state.currentGame.subtitle;
        document.getElementById("premium-game-description").textContent = state.currentGame.description;
        document.getElementById("premium-game-runtime").innerHTML = `${premium.icon("orbit")} <span>${premium.escapeHtml(premium.runtimeLabel(state.currentGame.runtimeKind))}</span>`;
        document.getElementById("premium-game-profile").innerHTML = `${premium.icon("clock")} <span>${premium.escapeHtml(premium.loadProfileLabel(state.currentGame.loadProfile))}</span>`;
        document.getElementById("premium-game-access").innerHTML = `${premium.icon(state.currentGame.accountMode === "firebase-in-game" ? "key" : (state.currentGame.authRequired ? "lock" : "ticket"))} <span>${premium.escapeHtml(state.currentGame.accountMode === "firebase-in-game" ? "Account sync" : premium.accessLabel(state.currentGame.accessLevel))}</span>`;
        document.getElementById("premium-game-release").innerHTML = `${premium.icon("layers")} <span>${premium.escapeHtml(state.currentGame.releasePhase || "Available")}</span>`;
        window.GameHubFeedback?.setGameContext?.({
            gameSlug: state.currentGame.id,
            gameTitle: state.currentGame.name,
            path: window.location.pathname + window.location.search
        });
        window.GameHubAnalytics?.trackGameView?.(state.currentGame, {
            path: window.location.pathname + window.location.search
        });

        const statusMessage = canLaunchCurrentGame()
            ? (state.currentGame.accountMode === "firebase-in-game"
                ? (state.session.authenticated
                    ? "This game can use your signed-in account."
                    : "Sign in if you want this game to use synced progress.")
                : "This game is ready to launch.")
            : (state.currentGame.authRequired
                ? "Sign in to open this game."
                : "This game is not available yet.");
        document.getElementById("premium-session-note").textContent = statusMessage;
        document.getElementById("premium-player-tagline").textContent = state.currentGame.category;

        renderLaunchButton();
        renderWatchlistButton();
        renderRelatedGames();
        renderStats();
        syncCinemaToolbarPlacement();
        premium.primeReveal?.(document.querySelector("#premium-player-main"));
    }

    function renderLaunchButton() {
        const button = document.getElementById("premium-launch-button");
        if (!button || !state.currentGame) {
            return;
        }

        if (canLaunchCurrentGame()) {
            const hasLiveSession = sessionController.currentSession?.state === "ready";
            button.innerHTML = `${premium.icon("play")} <span>${hasLiveSession ? "Reload" : "Launch"}</span>`;
            return;
        }

        if (state.currentGame.authRequired) {
            button.innerHTML = `${premium.icon("lock")} <span>Sign in</span>`;
            return;
        }

        button.innerHTML = `${premium.icon("ticket")} <span>View status</span>`;
    }

    function renderWatchlistButton() {
        const button = document.getElementById("premium-shortlist-button");
        if (!button || !state.currentGame) {
            return;
        }

        const isSaved = state.watchlist.includes(state.currentGame.id);
        button.innerHTML = isSaved
            ? `${premium.icon("check")} <span>Favorited</span>`
            : `${premium.icon("diamond")} <span>Add favorite</span>`;
        button.classList.toggle("is-active", isSaved);
    }

    function renderRelatedGames() {
        const container = document.getElementById("premium-related-list");
        if (!container) {
            return;
        }

        const relatedGames = premium.getRelatedGames(state.games, state.currentGame?.id, 4);
        if (!relatedGames.length) {
            container.innerHTML = "<p class=\"premium-empty-copy\">More games will appear here.</p>";
            return;
        }

        container.innerHTML = relatedGames.map((game) => `
            <a class="premium-related-card" href="/premium/play?id=${encodeURIComponent(game.id)}" style="--premium-card-accent:${premium.escapeHtml(game.accent)};">
                <div class="premium-related-thumb">
                    <img src="${game.thumbnail}" alt="${premium.escapeHtml(game.name)} artwork">
                </div>
                <div class="premium-related-body">
                    <div class="premium-related-topline">
                        <span class="premium-related-kicker">${premium.escapeHtml(premium.accessLabel(game.accessLevel))}</span>
                        <span class="premium-related-meta">${premium.escapeHtml(game.releasePhase || premium.runtimeLabel(game.runtimeKind))}</span>
                    </div>
                    <strong>${premium.escapeHtml(game.name)}</strong>
                    <p>${premium.escapeHtml(game.subtitle)}</p>
                </div>
            </a>
        `).join("");
    }

    function renderStats() {
        const stats = premium.loadStats();
        const gameStats = stats.games[state.currentGame.id] || { visits: 0, launches: 0 };
        document.getElementById("premium-stat-opens").textContent = String(gameStats.visits || 0);
        document.getElementById("premium-stat-launches").textContent = String(gameStats.launches || 0);
        document.getElementById("premium-stat-shortlist").textContent = String(state.watchlist.length);
    }

    function canLaunchCurrentGame() {
        if (!state.currentGame || !state.currentGame.pathEncoded) {
            return false;
        }

        if (state.currentGame.visibility === "hidden"
            || state.currentGame.visibility === "coming_soon"
            || state.currentGame.visibility === "maintenance"
            || state.currentGame.launchDisabled === true
            || state.operations?.config?.globalMaintenanceMode === true) {
            return false;
        }

        if (state.currentGame.accessLevel === "comingSoon" || state.currentGame.accessLevel === "invite") {
            return false;
        }

        if ((state.currentGame.authRequired || state.currentGame.accessLevel === "member") && !state.session.authenticated) {
            return false;
        }

        return state.currentGame.accessLevel === "open" || state.currentGame.accessLevel === "member";
    }

    function buildPlayableGame() {
        if (!state.currentGame) {
            return null;
        }

        return {
            id: state.currentGame.id,
            controlsProfile: state.currentGame.controlsProfile || "",
            name: state.currentGame.name,
            subtitle: state.currentGame.subtitle,
            description: state.currentGame.description,
            category: state.currentGame.category,
            type: state.currentGame.type || "Premium Release",
            ageRating: state.currentGame.ageRating || "12+",
            path: state.currentGame.preferredEntry,
            pathEncoded: state.currentGame.pathEncoded,
            runtimeKind: state.currentGame.runtimeKind,
            loadProfile: state.currentGame.loadProfile,
            accent: state.currentGame.accent,
            accentAlt: state.currentGame.accentAlt,
            storageNamespace: state.currentGame.storageNamespace,
            presentation: { ...state.currentGame.presentation },
            capabilities: { ...state.currentGame.capabilities }
        };
    }

    async function requestGameLaunch(forceReload, mutedPlayback) {
        if (!canLaunchCurrentGame()) {
            showAccessWall();
            return;
        }

        const playableGame = buildPlayableGame();
        if (!playableGame) {
            return;
        }

        hideAccessWall();
        hideFallback();
        await ensurePremiumSessionTicket(forceReload);
        storageManager.migrateKnownKeys(playableGame);
        state.mutedLaunchRequested = Boolean(mutedPlayback);
        audioManager.setMuted(state.mutedLaunchRequested);
        sessionController.load(playableGame, {
            forceReload,
            muted: state.mutedLaunchRequested
        });
        sessionController.updatePresentation({
            cinemaMode: state.cinemaMode,
            fullscreen: isPlayerShellFullscreen(),
            theme: premium.loadStoredTheme()
        });
        void requestMobileLandscapeImmersion();
        syncEmbeddedPremiumAuth();
        updateMuteButton();
        syncResponsivePresentation();
    }

    function routeAccessIntent() {
        if (!state.currentGame) {
            return;
        }

        if ((state.currentGame.authRequired || state.currentGame.accessLevel === "member") && !state.session.authenticated) {
            premium.setAuthIntent({
                next: `/premium/play?id=${encodeURIComponent(state.currentGame.id)}`,
                gameId: state.currentGame.id
            });
            premium.navigateWithTransition?.(`/premium/login?next=${encodeURIComponent(`/premium/play?id=${state.currentGame.id}`)}&game=${encodeURIComponent(state.currentGame.id)}`);
            return;
        }

        showAccessWall();
    }

    function showAccessWall() {
        if (!state.currentGame) {
            return;
        }

        sessionController.destroy("premium-access-wall");
        const requiresAuth = state.currentGame.authRequired || state.currentGame.accessLevel === "member";
        const blockedByOperations = state.currentGame.visibility === "hidden"
            || state.currentGame.visibility === "coming_soon"
            || state.currentGame.visibility === "maintenance"
            || state.currentGame.launchDisabled === true
            || state.operations?.config?.globalMaintenanceMode === true;
        const isOpen = !blockedByOperations && state.currentGame.accessLevel === "open" && state.currentGame.pathEncoded;
        let title = "This game is not available yet";
        let copy = "Return to the library or check the account page.";
        let primaryLabel = "Open library";
        let secondaryLabel = "Stay here";

        if (blockedByOperations) {
            const reason = state.operations?.config?.globalMaintenanceMode === true
                ? "global_maintenance"
                : (state.currentGame.operationStatus?.unavailableReason || state.currentGame.visibility || "launch_disabled");
            title = reason === "global_maintenance"
                ? "GameHub Premium is under maintenance"
                : reason === "coming_soon"
                ? `${state.currentGame.name} is coming soon`
                : reason === "maintenance"
                    ? `${state.currentGame.name} is under maintenance`
                    : `${state.currentGame.name} is unavailable`;
            copy = state.currentGame.maintenanceMessage
                || state.currentGame.operationStatus?.maintenanceMessage
                || (reason === "global_maintenance"
                    ? (state.operations?.config?.globalMaintenanceMessage || "Premium GameHub is temporarily in maintenance. Please check back soon.")
                    : reason === "coming_soon"
                    ? "This premium release is listed as coming soon and cannot be launched yet."
                    : reason === "maintenance"
                        ? "This premium release is temporarily in maintenance. Please check back soon."
                        : "This premium release is not available in the current catalog.");
            primaryLabel = "Open library";
            secondaryLabel = "Stay here";
        } else if (requiresAuth) {
            title = `${state.currentGame.name} requires sign-in`;
            copy = "Sign in to continue to this game.";
            primaryLabel = "Open account";
            secondaryLabel = "Back to library";
        } else if (isOpen) {
            title = `${state.currentGame.name} is ready`;
            copy = "Launch the game now or return to the library.";
            primaryLabel = "Reload game";
            secondaryLabel = "Back to library";
        } else if (state.currentGame.accessLevel === "comingSoon") {
            title = `${state.currentGame.name} is coming soon`;
            copy = "This game is listed in the library but is not live yet.";
            primaryLabel = "Open library";
            secondaryLabel = "Open account";
        }

        ui.accessTitle.textContent = title;
        ui.accessText.textContent = copy;
        ui.accessMeta.innerHTML = `
            <span class="premium-chip">${premium.icon("orbit")} ${premium.escapeHtml(premium.runtimeLabel(state.currentGame.runtimeKind))}</span>
            <span class="premium-chip">${premium.icon("ticket")} ${premium.escapeHtml(premium.accessLabel(state.currentGame.accessLevel))}</span>
            <span class="premium-chip">${premium.icon("layers")} ${premium.escapeHtml(state.currentGame.releasePhase || "Available")}</span>
        `;
        ui.accessPrimary.innerHTML = `${premium.icon(requiresAuth ? "key" : (isOpen ? "play" : "arrowLeft"))} <span>${premium.escapeHtml(primaryLabel)}</span>`;
        ui.accessSecondary.innerHTML = `${premium.icon((requiresAuth || state.currentGame.accessLevel === "comingSoon") ? "grid" : "arrowLeft")} <span>${premium.escapeHtml(secondaryLabel)}</span>`;

        ui.accessPrimary.onclick = () => {
            if (requiresAuth) {
                routeAccessIntent();
                return;
            }

            if (isOpen) {
                void requestGameLaunch(true, state.mutedLaunchRequested);
                return;
            }

            premium.navigateWithTransition?.("/premium");
        };

        ui.accessSecondary.onclick = () => {
            if (state.currentGame.accessLevel === "comingSoon") {
                premium.navigateWithTransition?.("/premium/login");
                return;
            }

            premium.navigateWithTransition?.("/premium");
        };

        ui.accessWall.classList.add("visible");
        ui.accessWall.setAttribute("aria-hidden", "false");
    }

    function hideAccessWall() {
        ui.accessWall.classList.remove("visible");
        ui.accessWall.setAttribute("aria-hidden", "true");
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

    function setPausedState(paused, reason) {
        if (!canLaunchCurrentGame()) {
            state.isPaused = false;
            state.pauseReason = null;
            syncSessionOverlays();
            return;
        }

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
        const button = document.getElementById("premium-pause-button");
        if (!button) {
            return;
        }
        button.innerHTML = state.isPaused
            ? `${premium.icon("play")} <span>Resume</span>`
            : `${premium.icon("shield")} <span>Pause</span>`;
        button.setAttribute("aria-pressed", state.isPaused ? "true" : "false");
    }

    function updateMuteButton() {
        const button = document.getElementById("premium-mute-button");
        if (!button) {
            return;
        }
        button.innerHTML = state.mutedLaunchRequested
            ? `${premium.icon("lock")} <span>Muted</span>`
            : `${premium.icon("wave")} <span>Session Audio</span>`;
        button.classList.toggle("is-active", state.mutedLaunchRequested);
    }

    function syncSessionOverlays() {
        updatePauseButton();
        if (state.orientationBlocked) {
            ui.orientationOverlay.classList.add("visible");
            ui.orientationOverlay.setAttribute("aria-hidden", "false");
            ui.pauseOverlay.classList.remove("visible");
            return;
        }

        ui.orientationOverlay.classList.remove("visible");
        ui.orientationOverlay.setAttribute("aria-hidden", "true");
        ui.pauseOverlay.classList.toggle("visible", state.isPaused);
        ui.pauseOverlay.setAttribute("aria-hidden", state.isPaused ? "false" : "true");
    }

    function getPresentationPolicy() {
        return state.currentGame?.presentation || {
            requireLandscape: true,
            preferredOrientation: "landscape",
            viewportProfile: "immersive",
            minStageHeight: 440
        };
    }

    function isCoarsePointerViewport() {
        return window.matchMedia?.("(pointer: coarse)").matches || false;
    }

    function shouldEnforceLandscape() {
        const presentation = getPresentationPolicy();
        return Boolean(presentation.requireLandscape && (isCoarsePointerViewport() || window.innerWidth <= 980));
    }

    function shouldAutoImmerseMobileLandscape() {
        const presentation = getPresentationPolicy();
        return Boolean(
            state.currentGame
            && canLaunchCurrentGame()
            && presentation.requireLandscape
            && String(presentation.preferredOrientation || "landscape").toLowerCase().startsWith("landscape")
            && isCoarsePointerViewport()
        );
    }

    async function requestMobileLandscapeImmersion() {
        if (!ui.frameShell || !shouldAutoImmerseMobileLandscape()) {
            return;
        }

        let needsGestureRetry = false;

        try {
            if (!isPlayerShellFullscreen() && isFullscreenSupported()) {
                await requestShellFullscreen(ui.frameShell);
            }
        } catch {
            needsGestureRetry = true;
        }

        try {
            await lockLandscapeOrientation();
        } catch {
            needsGestureRetry = true;
        }

        updateFullscreenUi();
        syncResponsivePresentation();

        if (needsGestureRetry) {
            bindMobileImmersionGestureRetry();
        } else {
            unbindMobileImmersionGestureRetry();
        }
    }

    function bindMobileImmersionGestureRetry() {
        if (state.mobileImmersionGestureBound) {
            return;
        }

        const retry = () => {
            unbindMobileImmersionGestureRetry();
            void requestMobileLandscapeImmersion();
        };

        state.mobileImmersionGestureBound = true;
        state.mobileImmersionGestureHandler = retry;
        ["pointerup", "touchend", "click"].forEach((eventName) => {
            document.addEventListener(eventName, retry, { capture: true, once: true, passive: true });
        });
    }

    function unbindMobileImmersionGestureRetry() {
        if (!state.mobileImmersionGestureBound || !state.mobileImmersionGestureHandler) {
            return;
        }

        ["pointerup", "touchend", "click"].forEach((eventName) => {
            document.removeEventListener(eventName, state.mobileImmersionGestureHandler, true);
        });
        state.mobileImmersionGestureBound = false;
        state.mobileImmersionGestureHandler = null;
    }

    async function lockLandscapeOrientation() {
        const orientation = window.screen?.orientation;
        if (orientation?.lock) {
            await orientation.lock("landscape");
            return true;
        }

        const legacyLock = window.screen?.lockOrientation
            || window.screen?.mozLockOrientation
            || window.screen?.msLockOrientation;
        if (legacyLock) {
            const result = legacyLock.call(window.screen, "landscape");
            if (result?.then) {
                await result;
            }
            return true;
        }

        return false;
    }

    function releaseMobileLandscapeLock() {
        unbindMobileImmersionGestureRetry();
        try {
            window.screen?.orientation?.unlock?.();
        } catch {
            // Browser may reject unlock when no orientation lock is active.
        }
    }

    function computeResponsiveFrameHeight() {
        const presentation = getPresentationPolicy();
        const minHeight = Math.max(360, Number(presentation.minStageHeight || 440));
        if (isPlayerShellFullscreen()) {
            return Math.max(minHeight, window.innerHeight);
        }

        const compact = window.innerWidth <= 980;
        const immersive = presentation.viewportProfile === "immersive";
        const reservedChrome = state.cinemaMode
            ? (compact ? 118 : 138)
            : (compact ? (immersive ? 214 : 238) : (immersive ? 222 : 252));
        const available = Math.max(280, window.innerHeight - reservedChrome);
        return Math.max(minHeight, Math.min(window.innerHeight - 24, available));
    }

    function syncOrientationGuard() {
        if (!state.currentGame || !canLaunchCurrentGame()) {
            state.orientationBlocked = false;
            syncSessionOverlays();
            return;
        }

        const shouldBlock = shouldEnforceLandscape() && window.innerHeight > window.innerWidth;
        state.orientationBlocked = shouldBlock;
        document.body.classList.toggle("premium-landscape-blocked", shouldBlock);

        if (shouldBlock) {
            ui.orientationTitle.textContent = `${state.currentGame.name} needs landscape`;
            ui.orientationText.textContent = `GameHub will try fullscreen landscape automatically on mobile. If your browser blocks it, tap once, then rotate sideways to continue ${state.currentGame.name}.`;
            if (!state.isPaused || state.pauseReason !== "orientation-lock") {
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

        syncGameIdentityClasses();

        const presentation = getPresentationPolicy();
        const compact = window.innerWidth <= 980;
        const landscape = window.innerWidth >= window.innerHeight;
        const frameHeight = Math.round(computeResponsiveFrameHeight());

        syncCinemaToolbarPlacement();

        document.documentElement.style.setProperty("--premium-player-frame-height", `${frameHeight}px`);
        document.documentElement.style.setProperty("--premium-player-min-height", `${presentation.minStageHeight}px`);
        document.body.classList.toggle("premium-player-compact", compact);
        const handrexFullscreen = document.body.classList.contains("premium-game-handrex") && isPlayerShellFullscreen();
        document.documentElement.classList.toggle("premium-handrex-scroll-frame", handrexFullscreen);
        document.body.classList.toggle("premium-handrex-scroll-frame", handrexFullscreen);

        sessionController.updatePresentation({
            cinemaMode: state.cinemaMode,
            fullscreen: isPlayerShellFullscreen(),
            theme: premium.loadStoredTheme(),
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
            game: buildPlayableGame(),
            sessionController,
            coarsePointer: isCoarsePointerViewport(),
            compact,
            landscape,
            orientationBlocked: state.orientationBlocked,
            paused: state.isPaused,
            ready: sessionController.currentSession?.state === "ready"
        });
    }

    async function ensurePremiumSessionTicket(forceRefresh = false) {
        if (!state.session?.authenticated || !window.GameHubPremiumAuth?.exchangeSessionTicket) {
            state.session = {
                ...state.session,
                ticket: null
            };
            premium.persistSharedTicket?.(null);
            return null;
        }

        try {
            const ticket = await window.GameHubPremiumAuth.exchangeSessionTicket(forceRefresh);
            state.session = {
                ...state.session,
                ticket: ticket || null
            };
            return ticket || null;
        } catch (error) {
            console.warn("Premium session ticket exchange failed:", error);
            return null;
        }
    }

    function buildPremiumAuthPayload() {
        return {
            authenticated: state.session?.authenticated === true,
            provider: state.session?.provider || "firebase",
            mode: state.session?.mode || "firebase-pending",
            configured: state.session?.configured === true,
            user: state.session?.user || null,
            ticket: state.session?.ticket || premium.loadSharedTicket?.() || null
        };
    }

    function syncEmbeddedPremiumAuth() {
        if (!sessionController?.currentSession) {
            return;
        }

        sessionController.updateAuth(buildPremiumAuthPayload());
    }

    function renderEmptyState() {
        document.getElementById("premium-player-main").style.display = "none";
        document.getElementById("premium-player-empty").classList.add("visible");
        [
            "premium-launch-button",
            "premium-shortlist-button",
            "premium-cinema-button",
            "premium-fullscreen-button"
        ].forEach((id) => {
            const button = document.getElementById(id);
            if (button) {
                button.disabled = true;
            }
        });
    }

    function getFullscreenElement() {
        return document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement || null;
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
        const button = document.getElementById("premium-fullscreen-button");
        if (!button || !ui.frameShell) {
            return;
        }

        if (!isFullscreenSupported()) {
            button.disabled = true;
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
            console.warn("Premium fullscreen toggle failed:", error);
        } finally {
            button.disabled = false;
            updateFullscreenUi();
        }
    }

    function loadCinemaMode() {
        return true;
    }

    function updateCinemaButton() {
        const button = document.getElementById("premium-cinema-button");
        if (!button) {
            return;
        }

        button.innerHTML = state.cinemaMode
            ? `${premium.icon("film")} <span>Exit Cinema</span>`
            : `${premium.icon("film")} <span>Cinema View</span>`;
        button.classList.toggle("is-active", state.cinemaMode);
        button.setAttribute("aria-pressed", state.cinemaMode ? "true" : "false");
    }

    function getMemberControlNode() {
        const chip = document.getElementById("premium-member-chip");
        if (!chip) {
            return null;
        }

        return chip.closest(".premium-member-menu") || chip;
    }

    function ensureCinemaToolbarGroup(headerActions, groupName, label) {
        let group = headerActions.querySelector(`[data-premium-cinema-group="${groupName}"]`);
        if (!group) {
            group = document.createElement("div");
            group.className = `premium-cinema-control-group premium-cinema-control-group--${groupName}`;
            group.dataset.premiumCinemaGroup = groupName;
            group.setAttribute("role", "group");
            group.setAttribute("aria-label", label);
        }

        return group;
    }

    function removeCinemaToolbarGroups(headerActions) {
        headerActions.querySelectorAll(".premium-cinema-control-group").forEach((group) => {
            group.remove();
        });
    }

    function isMobilePlayerToolbar() {
        return window.matchMedia?.("(max-width: 860px)").matches || window.innerWidth <= 860;
    }

    function getPlayerMetaNodes() {
        return [
            "premium-game-runtime",
            "premium-game-profile",
            "premium-game-access",
            "premium-game-release"
        ].map((id) => document.getElementById(id)).filter(Boolean);
    }

    function syncCinemaToolbarPlacement() {
        const headerActions = ui.headerActions;
        const actionRow = ui.actionRow;
        const headline = ui.headline;
        const metaRow = ui.metaRow;
        const themeToggle = ui.themeToggle;
        const bridgeButton = ui.header?.querySelector(".premium-site-bridge");
        const memberControl = getMemberControlNode();
        const homeButton = document.getElementById("premium-home-button");
        const launchButton = document.getElementById("premium-launch-button");
        const shortlistButton = document.getElementById("premium-shortlist-button");
        const cinemaButton = document.getElementById("premium-cinema-button");
        const fullscreenButton = document.getElementById("premium-fullscreen-button");
        const metaNodes = getPlayerMetaNodes();
        const mobileToolbar = isMobilePlayerToolbar();

        if (!headerActions || !actionRow || !headline || !metaRow || !homeButton) {
            return;
        }

        removeCinemaToolbarGroups(headerActions);

        if (state.cinemaMode && !mobileToolbar) {
            metaNodes.forEach((node) => {
                metaRow.appendChild(node);
            });

            const sessionGroup = ensureCinemaToolbarGroup(headerActions, "session", "Session controls");
            const viewGroup = ensureCinemaToolbarGroup(headerActions, "view", "View controls");

            [
                [sessionGroup, launchButton, shortlistButton],
                [viewGroup, cinemaButton, fullscreenButton, themeToggle, homeButton]
            ].forEach(([group, ...nodes]) => {
                nodes.filter(Boolean).forEach((node) => {
                    group.appendChild(node);
                });
                headerActions.appendChild(group);
            });
            document.body.classList.add("premium-cinema-toolbar-ready");
            document.body.classList.remove("premium-mobile-player-toolbar-ready");
            return;
        }

        if (state.cinemaMode || mobileToolbar) {
            const metaGroup = ensureCinemaToolbarGroup(headerActions, "meta", "Game details");
            const sessionGroup = ensureCinemaToolbarGroup(headerActions, "session", "Session controls");
            const viewGroup = ensureCinemaToolbarGroup(headerActions, "view", "View controls");

            const toolbarGroups = [
                ...(mobileToolbar && !state.cinemaMode ? [[metaGroup, ...metaNodes]] : []),
                [sessionGroup, ...(state.cinemaMode ? [launchButton, shortlistButton] : [homeButton, launchButton, shortlistButton])],
                [viewGroup, cinemaButton, fullscreenButton, themeToggle, ...(state.cinemaMode ? [homeButton] : [])]
            ];

            toolbarGroups.forEach(([group, ...nodes]) => {
                nodes.filter(Boolean).forEach((node) => {
                    group.appendChild(node);
                });
                if (group.children.length) {
                    headerActions.appendChild(group);
                }
            });

            document.body.classList.toggle("premium-cinema-toolbar-ready", state.cinemaMode);
            document.body.classList.add("premium-mobile-player-toolbar-ready");
            return;
        }

        [
            bridgeButton,
            themeToggle,
            memberControl
        ].filter(Boolean).forEach((node) => {
            headerActions.appendChild(node);
        });

        metaNodes.forEach((node) => {
            metaRow.appendChild(node);
        });

        [
            launchButton,
            shortlistButton,
            cinemaButton,
            fullscreenButton
        ].filter(Boolean).forEach((node) => {
            actionRow.appendChild(node);
        });

        if (themeToggle && themeToggle.parentElement !== headerActions) {
            headerActions.appendChild(themeToggle);
        }

        if (homeButton.parentElement !== headline) {
            headline.appendChild(homeButton);
        }

        document.body.classList.remove("premium-cinema-toolbar-ready");
        document.body.classList.remove("premium-mobile-player-toolbar-ready");
    }

    function applyCinemaMode(enabled, options = {}) {
        const { persist = true } = options;
        state.cinemaMode = Boolean(enabled);
        document.body.classList.toggle("premium-cinema-view", state.cinemaMode);
        updateCinemaButton();
        syncCinemaToolbarPlacement();

        if (persist) {
            window.localStorage?.setItem(CINEMA_STORAGE_KEY, state.cinemaMode ? "true" : "false");
        }

        sessionController.updatePresentation({
            cinemaMode: state.cinemaMode,
            fullscreen: isPlayerShellFullscreen(),
            theme: premium.loadStoredTheme()
        });
        syncResponsivePresentation();
    }

    function toggleCinemaMode() {
        applyCinemaMode(!state.cinemaMode);
    }

    function updateFullscreenUi() {
        const button = document.getElementById("premium-fullscreen-button");
        if (!button) {
            return;
        }

        if (!isFullscreenSupported()) {
            button.innerHTML = `${premium.icon("lock")} <span>Fullscreen unavailable</span>`;
            button.disabled = true;
            button.setAttribute("aria-pressed", "false");
            return;
        }

        const isFullscreen = isPlayerShellFullscreen();
        syncGameIdentityClasses();
        ui.frameShell.classList.toggle("is-fullscreen", isFullscreen);
        document.body.classList.toggle("premium-player-fullscreen", isFullscreen);
        const handrexFullscreen = document.body.classList.contains("premium-game-handrex") && isFullscreen;
        document.documentElement.classList.toggle("premium-handrex-scroll-frame", handrexFullscreen);
        document.body.classList.toggle("premium-handrex-scroll-frame", handrexFullscreen);
        button.innerHTML = isFullscreen
            ? `${premium.icon("arrowLeft")} <span>Exit fullscreen</span>`
            : `${premium.icon("arrowRight")} <span>Fullscreen</span>`;
        button.setAttribute("aria-pressed", isFullscreen ? "true" : "false");

        sessionController.updatePresentation({
            cinemaMode: state.cinemaMode,
            fullscreen: isFullscreen
        });
        syncResponsivePresentation();
    }
})();
