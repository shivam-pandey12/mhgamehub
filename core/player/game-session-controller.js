(function attachGameSessionController() {
    "use strict";

    const BRIDGE_CHANNEL = "gamehub-platform";
    const SANDBOX_FLAGS = "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-pointer-lock allow-storage-access-by-user-activation";
    const EMBEDDED_FULLSCREEN_STYLE_ID = "gamehub-embedded-fullscreen-style";

    function cloneFrameTemplate(template) {
        const frame = template.cloneNode(false);
        frame.removeAttribute("src");
        frame.id = template.id;
        frame.title = template.title;
        frame.className = template.className;
        frame.setAttribute("sandbox", SANDBOX_FLAGS);
        frame.setAttribute("allow", "autoplay; fullscreen");
        return frame;
    }

    function getLoadTimeoutMs(game) {
        switch (game?.loadProfile) {
            case "heavy":
                return 18000;
            case "realtime":
                return 15000;
            case "instant":
                return 7000;
            default:
                return 10000;
        }
    }

    class GameSessionController {
        constructor(options = {}) {
            this.frameShell = options.frameShell;
            this.frameTemplate = options.frameTemplate;
            this.audioManager = options.audioManager;
            this.onLoader = options.onLoader || (() => {});
            this.onHint = options.onHint || (() => {});
            this.onReady = options.onReady || (() => {});
            this.onStateChange = options.onStateChange || (() => {});
            this.onError = options.onError || (() => {});
            this.currentSession = null;
            this.presentation = {
                cinemaMode: false,
                fullscreen: false,
                theme: "light",
                compact: false,
                landscape: true,
                requireLandscape: false,
                preferredOrientation: "any",
                viewportProfile: "balanced",
                screenWidth: 0,
                screenHeight: 0,
                embeddedMinHeight: 0
            };

            this.boundMessage = (event) => this.handleMessage(event);
            window.addEventListener("message", this.boundMessage);
        }

        load(game, options = {}) {
            this.destroy("switch");

            const frame = cloneFrameTemplate(this.frameTemplate);
            const session = {
                id: `${game.id}-${Date.now()}`,
                game,
                options,
                frame,
                state: "loading",
                paused: false,
                timers: {
                    hint: 0,
                    timeout: 0
                }
            };

            this.currentSession = session;
            this.frameTemplate.replaceWith(frame);
            this.frameTemplate = frame;
            this.bindFrame(session);
            this.scheduleLoadGuards(session);
            this.onLoader({
                visible: true,
                message: options.muted
                    ? `Preparing ${game.name} with sound off...`
                    : (options.forceReload ? `Reloading ${game.name}...` : `Preparing ${game.name}...`)
            });
            this.onStateChange({ type: "loading", session });
            frame.src = this.buildSessionUrl(game, options);
        }

        buildSessionUrl(game, options) {
            const queryTokens = [];
            const shellMode = String(game?.storageNamespace || "").startsWith("gamehubPremium.")
                ? "premium"
                : "arcade";

            queryTokens.push("gamehubEmbedded=1");
            queryTokens.push(`gamehubShell=${encodeURIComponent(shellMode)}`);
            queryTokens.push(`gamehubGameId=${encodeURIComponent(String(game?.id || ""))}`);
            if (options.muted) {
                queryTokens.push("gamehubMuted=1");
            }
            if (options.forceReload) {
                queryTokens.push(`v=${Date.now()}`);
            }

            const querySuffix = queryTokens.length
                ? `${game.pathEncoded.includes("?") ? "&" : "?"}${queryTokens.join("&")}`
                : "";
            const routeSuffix = options.routeFragment ? `#${String(options.routeFragment).replace(/^#/, "")}` : "";
            return `${game.pathEncoded}${querySuffix}${routeSuffix}`;
        }

        bindFrame(session) {
            session.frame.addEventListener("load", () => this.handleFrameLoad(session));
            session.frame.addEventListener("error", () => {
                this.failSession(session, "The selected game could not be loaded.");
            });
        }

        scheduleLoadGuards(session) {
            session.timers.hint = window.setTimeout(() => {
                if (!this.isCurrentSession(session)) {
                    return;
                }

                this.onHint("Still loading. Some games take a moment to build their world...");
            }, 2400);

            session.timers.timeout = window.setTimeout(() => {
                if (!this.isCurrentSession(session)) {
                    return;
                }

                this.failSession(
                    session,
                    `${session.game.name} took too long to start. The platform recovered safely, and you can retry or pick another game.`
                );
            }, getLoadTimeoutMs(session.game));
        }

        handleFrameLoad(session) {
            if (!this.isCurrentSession(session)) {
                return;
            }

            if (session.state !== "loading") {
                return;
            }

            try {
                this.instrumentWindow(session.frame.contentWindow);
                this.installBridge(session.frame, session.game);
            } catch (error) {
                console.warn("Game instrumentation skipped:", error);
            }

            this.audioManager?.attachToFrame(session.frame, { muted: session.options.muted });
            this.syncEmbeddedPresentation();
            this.postBridgeMessage("platform:init", {
                gameId: session.game.id,
                runtimeKind: session.game.runtimeKind,
                loadProfile: session.game.loadProfile
            });
            this.postBridgeMessage("platform:theme", {
                theme: this.presentation.theme
            });
            this.postBridgeMessage("platform:start", {
                reason: session.options.forceReload ? "reload" : "launch"
            });
            this.postBridgeMessage("platform:fullscreen", {
                fullscreen: this.presentation.fullscreen,
                cinemaMode: this.presentation.cinemaMode
            });
            this.postBridgeMessage("platform:screen", {
                compact: this.presentation.compact,
                landscape: this.presentation.landscape,
                requireLandscape: this.presentation.requireLandscape,
                preferredOrientation: this.presentation.preferredOrientation,
                viewportProfile: this.presentation.viewportProfile,
                screenWidth: this.presentation.screenWidth,
                screenHeight: this.presentation.screenHeight
            });

            this.clearSessionTimers(session);
            session.state = "ready";
            this.onLoader({ visible: false });
            this.onReady({ session, frame: session.frame, game: session.game });
            this.onStateChange({ type: "ready", session });
        }

        handleMessage(event) {
            const session = this.currentSession;
            if (!session || event.source !== session.frame.contentWindow) {
                return;
            }

            const payload = event.data;
            if (!payload || payload.channel !== BRIDGE_CHANNEL) {
                return;
            }

            switch (payload.type) {
                case "game:error":
                    this.failSession(session, payload.payload?.message || "The current game reported a runtime error.");
                    break;
                case "game:telemetry":
                    this.onStateChange({ type: "telemetry", session, payload: payload.payload || {} });
                    break;
                case "game:ready":
                case "game:cleanup-complete":
                default:
                    break;
            }
        }

        failSession(session, message) {
            if (!this.isCurrentSession(session)) {
                return;
            }

            this.clearSessionTimers(session);
            session.state = "error";
            this.stopSessionFrame(session, "error");
            this.onLoader({ visible: false });
            this.onError({
                session,
                game: session.game,
                message
            });
            this.onStateChange({ type: "error", session, message });
        }

        pause(reason = "manual") {
            const session = this.currentSession;
            if (!session || session.paused) {
                return;
            }

            session.paused = true;
            session.frame.style.pointerEvents = "none";
            session.frame.style.filter = "saturate(0.82) brightness(0.86)";
            this.audioManager?.pauseFrameAudio(session.frame);
            this.postBridgeMessage("platform:pause", { reason });
            this.onStateChange({ type: "paused", session, reason });
        }

        resume(reason = "manual") {
            const session = this.currentSession;
            if (!session || !session.paused) {
                return;
            }

            session.paused = false;
            session.frame.style.pointerEvents = "";
            session.frame.style.filter = "";
            if (!session.options.muted) {
                this.audioManager?.resumeFrameAudio(session.frame);
            }
            this.postBridgeMessage("platform:resume", { reason });
            this.onStateChange({ type: "resumed", session, reason });
        }

        destroy(reason = "manual-destroy") {
            const session = this.currentSession;
            if (!session) {
                return;
            }

            this.clearSessionTimers(session);
            session.state = "destroyed";
            this.stopSessionFrame(session, reason);

            this.currentSession = null;
            this.onStateChange({ type: "destroyed", session, reason });
        }

        stopSessionFrame(session, reason) {
            try {
                this.postBridgeMessage("platform:input-reset", { reason });
                this.postBridgeMessage("platform:destroy", { reason });
                this.releasePointerLock(session.frame);
                this.audioManager?.disposeFrameAudio(session.frame);
                this.cleanupInstrumentedWindow(session.frame.contentWindow);
                session.frame.src = "about:blank";
            } catch (_) {
                // Best-effort cleanup only.
            }
        }

        updatePresentation(nextPresentation = {}) {
            this.presentation = {
                ...this.presentation,
                ...nextPresentation
            };

            this.syncEmbeddedPresentation();
            this.postBridgeMessage("platform:theme", { theme: this.presentation.theme });
            this.postBridgeMessage("platform:fullscreen", {
                fullscreen: this.presentation.fullscreen,
                cinemaMode: this.presentation.cinemaMode
            });
            this.postBridgeMessage("platform:screen", {
                compact: this.presentation.compact,
                landscape: this.presentation.landscape,
                requireLandscape: this.presentation.requireLandscape,
                preferredOrientation: this.presentation.preferredOrientation,
                viewportProfile: this.presentation.viewportProfile,
                screenWidth: this.presentation.screenWidth,
                screenHeight: this.presentation.screenHeight
            });
        }

        updateAuth(payload = {}) {
            this.postBridgeMessage("platform:auth", payload);
        }

        postBridgeMessage(type, payload = {}) {
            const session = this.currentSession;
            if (!session?.frame?.contentWindow) {
                return;
            }

            try {
                session.frame.contentWindow.postMessage({
                    channel: BRIDGE_CHANNEL,
                    type,
                    payload
                }, "*");
            } catch (_) {
                // Ignore posting failures.
            }
        }

        isCurrentSession(session) {
            return Boolean(session && this.currentSession && this.currentSession.id === session.id);
        }

        clearSessionTimers(session) {
            if (session.timers.hint) {
                window.clearTimeout(session.timers.hint);
                session.timers.hint = 0;
            }
            if (session.timers.timeout) {
                window.clearTimeout(session.timers.timeout);
                session.timers.timeout = 0;
            }
        }

        releasePointerLock(frame) {
            try {
                frame?.contentDocument?.exitPointerLock?.();
            } catch (_) {
                // Ignore.
            }

            try {
                if (document.pointerLockElement) {
                    document.exitPointerLock?.();
                }
            } catch (_) {
                // Ignore.
            }
        }

        instrumentWindow(win) {
            if (!win || win.__gamehubLifecycleTracker) {
                return;
            }

            const tracker = {
                timeouts: new Set(),
                intervals: new Set(),
                animationFrames: new Set(),
                listeners: [],
                sockets: new Set()
            };

            const originalSetTimeout = win.setTimeout.bind(win);
            const originalClearTimeout = win.clearTimeout.bind(win);
            const originalSetInterval = win.setInterval.bind(win);
            const originalClearInterval = win.clearInterval.bind(win);
            const originalRequestAnimationFrame = typeof win.requestAnimationFrame === "function"
                ? win.requestAnimationFrame.bind(win)
                : null;
            const originalCancelAnimationFrame = typeof win.cancelAnimationFrame === "function"
                ? win.cancelAnimationFrame.bind(win)
                : null;

            win.setTimeout = (...args) => {
                const id = originalSetTimeout(...args);
                tracker.timeouts.add(id);
                return id;
            };
            win.clearTimeout = (id) => {
                tracker.timeouts.delete(id);
                return originalClearTimeout(id);
            };
            win.setInterval = (...args) => {
                const id = originalSetInterval(...args);
                tracker.intervals.add(id);
                return id;
            };
            win.clearInterval = (id) => {
                tracker.intervals.delete(id);
                return originalClearInterval(id);
            };

            if (originalRequestAnimationFrame && originalCancelAnimationFrame) {
                win.requestAnimationFrame = (callback) => {
                    const id = originalRequestAnimationFrame((timestamp) => {
                        tracker.animationFrames.delete(id);
                        callback(timestamp);
                    });
                    tracker.animationFrames.add(id);
                    return id;
                };
                win.cancelAnimationFrame = (id) => {
                    tracker.animationFrames.delete(id);
                    return originalCancelAnimationFrame(id);
                };
            }

            const eventTargetProto = win.EventTarget?.prototype;
            if (eventTargetProto && !eventTargetProto.__gamehubLifecyclePatched) {
                const originalAddEventListener = eventTargetProto.addEventListener;
                const originalRemoveEventListener = eventTargetProto.removeEventListener;
                eventTargetProto.addEventListener = function patchedAddEventListener(type, listener, options) {
                    tracker.listeners.push({ target: this, type, listener, options });
                    return originalAddEventListener.call(this, type, listener, options);
                };
                eventTargetProto.removeEventListener = function patchedRemoveEventListener(type, listener, options) {
                    tracker.listeners = tracker.listeners.filter((entry) => {
                        return !(entry.target === this && entry.type === type && entry.listener === listener);
                    });
                    return originalRemoveEventListener.call(this, type, listener, options);
                };
                eventTargetProto.__gamehubLifecyclePatched = true;
            }

            if (typeof win.WebSocket === "function" && !win.WebSocket.__gamehubTracked) {
                const OriginalWebSocket = win.WebSocket;
                function WrappedWebSocket(...args) {
                    const socket = new OriginalWebSocket(...args);
                    tracker.sockets.add(socket);
                    socket.addEventListener?.("close", () => tracker.sockets.delete(socket), { once: true });
                    return socket;
                }

                Object.setPrototypeOf(WrappedWebSocket, OriginalWebSocket);
                WrappedWebSocket.prototype = OriginalWebSocket.prototype;
                WrappedWebSocket.__gamehubTracked = true;
                win.WebSocket = WrappedWebSocket;
            }

            win.__gamehubLifecycleTracker = tracker;
        }

        cleanupInstrumentedWindow(win) {
            const tracker = win?.__gamehubLifecycleTracker;
            if (!tracker) {
                return;
            }

            tracker.timeouts.forEach((id) => {
                try {
                    win.clearTimeout(id);
                } catch (_) {
                    // Ignore.
                }
            });

            tracker.intervals.forEach((id) => {
                try {
                    win.clearInterval(id);
                } catch (_) {
                    // Ignore.
                }
            });

            tracker.animationFrames.forEach((id) => {
                try {
                    win.cancelAnimationFrame?.(id);
                } catch (_) {
                    // Ignore.
                }
            });

            tracker.listeners.forEach((entry) => {
                try {
                    entry.target?.removeEventListener?.(entry.type, entry.listener, entry.options);
                } catch (_) {
                    // Ignore.
                }
            });

            tracker.sockets.forEach((socket) => {
                try {
                    socket.close?.();
                } catch (_) {
                    // Ignore.
                }
            });
        }

        installBridge(frame, game) {
            const doc = frame?.contentDocument;
            const win = frame?.contentWindow;
            if (!doc?.head || !win) {
                return;
            }

            if (doc.getElementById("gamehub-platform-bridge")) {
                return;
            }

            const script = doc.createElement("script");
            script.id = "gamehub-platform-bridge";
            script.textContent = `
(function registerGameHubBridge() {
    if (window.GameHubBridge) {
        return;
    }

    const channel = ${JSON.stringify(BRIDGE_CHANNEL)};
    const methodMap = {
        "platform:init": "init",
        "platform:start": "start",
        "platform:pause": "pause",
        "platform:resume": "resume",
        "platform:destroy": "destroy",
        "platform:screen": "screen",
        "platform:auth": "auth"
    };

    const bridge = {
        module: null,
        auth: null,
        register(module) {
            this.module = module || null;
            window.parent.postMessage({
                channel,
                type: "game:ready",
                payload: {
                    gameId: ${JSON.stringify(game.id)}
                }
            }, "*");
            return this;
        },
        emit(type, payload) {
            window.parent.postMessage({ channel, type, payload }, "*");
        }
    };

    window.GameHubBridge = bridge;
    window.addEventListener("message", (event) => {
        const payload = event.data || {};
        if (payload.channel !== channel) {
            return;
        }

        if (payload.type === "platform:auth") {
            bridge.auth = payload.payload || null;
            window.GameHubPremiumSession = bridge.auth;
        }

        window.dispatchEvent(new CustomEvent("gamehub:platform-message", { detail: payload }));

        const methodName = methodMap[payload.type];
        if (!methodName || typeof bridge.module?.[methodName] !== "function") {
            return;
        }

        Promise.resolve(bridge.module[methodName](payload.payload || {})).catch((error) => {
            bridge.emit("game:error", {
                message: error?.message || String(error),
                phase: methodName
            });
        });
    });

    window.dispatchEvent(new CustomEvent("gamehub:bridge-ready", { detail: bridge }));
})();`;
            doc.head.appendChild(script);
        }

        syncEmbeddedPresentation() {
            const session = this.currentSession;
            const doc = session?.frame?.contentDocument;
            if (!doc?.documentElement || !doc.head || !doc.body) {
                return;
            }

            let style = doc.getElementById(EMBEDDED_FULLSCREEN_STYLE_ID);
            if (!style) {
                style = doc.createElement("style");
                style.id = EMBEDDED_FULLSCREEN_STYLE_ID;
                doc.head.appendChild(style);
            }

            const isFullscreen = Boolean(this.presentation.fullscreen);
            const expanded = this.presentation.cinemaMode || isFullscreen;
            const compact = Boolean(this.presentation.compact);
            const landscape = Boolean(this.presentation.landscape);
            const requireLandscape = Boolean(this.presentation.requireLandscape);
            const viewportProfile = this.presentation.viewportProfile || "balanced";
            const embeddedMinHeight = Math.max(320, Number(this.presentation.embeddedMinHeight || 0));
            const screenWidth = Math.max(0, Number(this.presentation.screenWidth || 0));
            const screenHeight = Math.max(0, Number(this.presentation.screenHeight || 0));
            const gameId = String(session?.game?.id || "").toLowerCase();
            const runtimeKind = String(session?.game?.runtimeKind || "").toLowerCase();
            const usesFullStageLayout = viewportProfile === "immersive"
                || runtimeKind === "3d"
                || runtimeKind === "io";

            doc.documentElement.dataset.gamehubGameId = gameId;
            doc.documentElement.classList.toggle("gamehub-game-handrex", gameId === "handrex");
            doc.documentElement.classList.toggle("gamehub-player-expanded", expanded);
            doc.documentElement.classList.toggle("gamehub-player-cinema", Boolean(this.presentation.cinemaMode));
            doc.documentElement.classList.toggle("gamehub-player-fullscreen", isFullscreen);
            doc.documentElement.classList.toggle("gamehub-player-compact", compact);
            doc.documentElement.classList.toggle("gamehub-player-landscape", landscape);
            doc.documentElement.classList.toggle("gamehub-player-portrait", !landscape);
            doc.documentElement.classList.toggle("gamehub-player-landscape-required", requireLandscape);
            doc.documentElement.classList.toggle("gamehub-player-immersive", viewportProfile === "immersive");
            doc.documentElement.classList.toggle("gamehub-player-fullstage", usesFullStageLayout);
            doc.documentElement.style.setProperty("--gamehub-shell-width", `${screenWidth}px`);
            doc.documentElement.style.setProperty("--gamehub-shell-height", `${screenHeight}px`);
            doc.documentElement.style.setProperty("--gamehub-embedded-min-height", `${embeddedMinHeight}px`);

            style.textContent = `
html.gamehub-player-expanded,
html.gamehub-player-expanded body {
    width: 100% !important;
    min-height: var(--gamehub-embedded-min-height, 100vh) !important;
    height: 100% !important;
}

html.gamehub-player-fullscreen,
html.gamehub-player-fullscreen body {
    width: 100% !important;
    min-height: 100vh !important;
    min-height: 100dvh !important;
    height: auto !important;
}

html.gamehub-player-expanded body {
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box !important;
    overflow-x: hidden !important;
}

html.gamehub-player-fullscreen body {
    margin: 0 !important;
    padding: 0 !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    
}

html.gamehub-game-handrex.gamehub-player-fullscreen {
    width: 100% !important;
    height: 100dvh !important;
    min-height: 100dvh !important;
    max-height: 100dvh !important;
    overflow: hidden !important;
}

html.gamehub-game-handrex.gamehub-player-fullscreen body {
    width: 100% !important;
    height: 100dvh !important;
    min-height: 100dvh !important;
    max-height: 100dvh !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    overscroll-behavior-y: contain !important;
    -webkit-overflow-scrolling: touch !important;
}

html.gamehub-game-handrex.gamehub-player-fullscreen :is(#app, .app-shell, body > :not(script):not(style):first-child:last-child) {
    width: 100% !important;
    max-width: none !important;
    height: auto !important;
    min-height: 100dvh !important;
    max-height: none !important;
    overflow: visible !important;
}

html.gamehub-player-expanded body > :not(script):not(style):first-child:last-child {
    width: 100% !important;
    max-width: none !important;
    min-height: max(var(--gamehub-embedded-min-height, 100vh), calc(100vh - clamp(12px, 2vw, 24px))) !important;
    height: 100% !important;
    margin: 0 !important;
}

html.gamehub-player-fullscreen body > :not(script):not(style):first-child:last-child {
    width: 100% !important;
    max-width: none !important;
    min-height: 100vh !important;
    min-height: 100dvh !important;
    height: auto !important;
    margin: 0 !important;
}

html.gamehub-player-expanded :is(#game-container, .game-container, #app, .app, .app-shell, .app-shell--arena, .container, .game-shell, #game-shell, .shell, #game-layout, #board-container, main, .wrapper, .content, #root, .root, #__next) {
    width: 100% !important;
    max-width: none !important;
    min-width: 0 !important;
    max-height: none !important;
    margin: 0 !important;
}

html.gamehub-player-expanded :is(#game-container, .game-container, #app, .app, .app-shell, .app-shell--arena, .container, .game-shell, #game-shell, .shell, #game-layout, #board-container, main, .wrapper, .content, #root, .root, #__next) {
    min-height: max(var(--gamehub-embedded-min-height, 100vh), calc(100vh - clamp(12px, 2vw, 24px))) !important;
    height: 100% !important;
}

html.gamehub-player-fullscreen :is(#game-container, .game-container, #app, .app, .app-shell, .app-shell--arena, .container, .game-shell, #game-shell, .shell, #game-layout, #board-container, main, .wrapper, .content, #root, .root, #__next) {
    min-height: 100vh !important;
    min-height: 100dvh !important;
    height: auto !important;
}

html.gamehub-player-expanded :is(#root, #app, #__next, .app, .root, .app-shell, .app-shell--arena) > :only-child {
    min-height: inherit !important;
    height: inherit !important;
}

html.gamehub-player-fullscreen :is(#root, #app, #__next, .app, .root, .app-shell, .app-shell--arena) > :only-child {
    min-height: inherit !important;
    height: auto !important;
}

html.gamehub-player-fullscreen :is(.app-shell--arena, #game-container, .game-container, .game-shell, #game-shell, #game-layout, #board-container, .arena-canvas, .hud-layer) {
    min-height: 100vh !important;
    min-height: 100dvh !important;
    height: 100vh !important;
    height: 100dvh !important;
}

html.gamehub-player-expanded canvas,
html.gamehub-player-expanded svg,
html.gamehub-player-expanded video {
    max-width: 100% !important;
}

html.gamehub-player-fullstage canvas,
html.gamehub-player-fullstage svg,
html.gamehub-player-fullstage video {
    width: 100% !important;
    height: 100% !important;
    object-fit: contain !important;
}

html.gamehub-player-compact:not(.gamehub-player-fullstage) :is(canvas, svg, video) {
    max-width: 100% !important;
    height: auto !important;
}

html.gamehub-player-fullstage.gamehub-player-compact canvas,
html.gamehub-player-fullstage.gamehub-player-compact svg,
html.gamehub-player-fullstage.gamehub-player-compact video {
    width: 100% !important;
    height: 100% !important;
}

html.gamehub-player-landscape-required.gamehub-player-portrait :is(canvas, svg, video) {
    max-width: 100% !important;
}

html.gamehub-player-cinema canvas,
html.gamehub-player-cinema svg,
html.gamehub-player-cinema video {
    max-height: calc(100vh - 16px) !important;
}

html.gamehub-player-fullscreen canvas,
html.gamehub-player-fullscreen svg,
html.gamehub-player-fullscreen video {
    max-height: 100vh !important;
    max-height: 100dvh !important;
}

html.gamehub-player-expanded .game-shell,
html.gamehub-player-expanded #game-container,
html.gamehub-player-expanded .game-container,
html.gamehub-player-expanded #game-shell,
html.gamehub-player-expanded .shell,
html.gamehub-player-expanded :is(.wrapper, .content, #root, .root, #app, .app, .app-shell, .app-shell--arena, #__next) {
    max-height: none !important;
}
            `.trim();
        }
    }

    const platform = window.GameHubPlatform || (window.GameHubPlatform = {});
    platform.GameSessionController = {
        GameSessionController,
        create(options) {
            return new GameSessionController(options);
        }
    };
})();
