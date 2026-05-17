(function attachMobileControlDeck() {
    "use strict";

    const CODE_TO_KEY = {
        ArrowUp: "ArrowUp",
        ArrowDown: "ArrowDown",
        ArrowLeft: "ArrowLeft",
        ArrowRight: "ArrowRight",
        Space: " ",
        ShiftLeft: "Shift",
        ShiftRight: "Shift",
        Digit1: "1",
        Digit2: "2",
        Digit3: "3",
        KeyA: "a",
        KeyB: "b",
        KeyC: "c",
        KeyD: "d",
        KeyE: "e",
        KeyF: "f",
        KeyG: "g",
        KeyH: "h",
        KeyM: "m",
        KeyP: "p",
        KeyQ: "q",
        KeyR: "r",
        KeyS: "s",
        KeyT: "t",
        KeyV: "v",
        KeyW: "w",
        KeyX: "x",
        KeyZ: "z"
    };

    const TOUCH_PROFILES = {
        "3dshooter": {
            label: "Flight Touch Deck",
            moveStick: {
                label: "Flight",
                keys: {
                    left: "ArrowLeft",
                    right: "ArrowRight",
                    up: "ArrowUp",
                    down: "ArrowDown"
                }
            },
            lookStick: {
                label: "Rotate",
                keys: {
                    left: "KeyC",
                    right: "KeyV",
                    up: "KeyR",
                    down: "KeyF"
                }
            },
            buttons: [
                { id: "rise", label: "Rise", key: "KeyQ", mode: "hold" },
                { id: "dive", label: "Dive", key: "KeyE", mode: "hold" },
                { id: "fire", label: "Fire", key: "Space", mode: "hold", tone: "primary" },
                { id: "burst", label: "Burst", key: "KeyB", mode: "tap" }
            ]
        },
        "cid-pakad": {
            label: "Runner Touch Deck",
            moveStick: {
                label: "Lane",
                keys: {
                    left: "ArrowLeft",
                    right: "ArrowRight"
                }
            },
            buttons: [
                { id: "jump", label: "Jump", key: "Space", mode: "tap", tone: "primary" },
                { id: "duck", label: "Duck", key: "ArrowDown", mode: "hold" }
            ]
        },
        "intergalactic-space-war": {
            label: "Tactical Flight Deck",
            moveStick: {
                label: "Drift",
                keys: {
                    left: "ArrowLeft",
                    right: "ArrowRight",
                    up: "ArrowUp",
                    down: "ArrowDown"
                }
            },
            lookStick: {
                label: "Pitch / Yaw",
                keys: {
                    left: "KeyA",
                    right: "KeyD",
                    up: "KeyW",
                    down: "KeyS"
                }
            },
            buttons: [
                { id: "rise", label: "Rise", key: "KeyR", mode: "hold" },
                { id: "dive", label: "Dive", key: "KeyF", mode: "hold" },
                { id: "fire", label: "Fire", key: "Space", mode: "hold", tone: "primary" },
                { id: "boost", label: "Boost", key: "KeyC", mode: "hold" },
                { id: "shield", label: "Shield", key: "KeyX", mode: "hold" },
                {
                    id: "weapon",
                    label: "Swap",
                    mode: "tap",
                    callback(deck) {
                        deck.tapCycle("intergalacticWeapons", ["Digit1", "Digit2", "Digit3"]);
                    }
                }
            ]
        },
        "battlefield-codex": {
            label: "Combat Touch Deck",
            moveStick: {
                label: "Move",
                keys: {
                    left: "KeyA",
                    right: "KeyD",
                    up: "KeyW",
                    down: "KeyS"
                }
            },
            lookStick: {
                label: "Aim",
                api: "battlefield-look"
            },
            buttons: [
                { id: "fire", label: "Fire", key: "Space", mode: "hold", tone: "primary" },
                { id: "aim", label: "Aim", mode: "hold", apiAction: "battlefield-aim" },
                { id: "run", label: "Run", key: "ShiftLeft", mode: "hold" },
                { id: "crouch", label: "Crouch", key: "KeyC", mode: "tap" },
                { id: "reload", label: "Reload", key: "KeyR", mode: "tap" },
                { id: "heal", label: "Heal", key: "KeyH", mode: "tap" },
                { id: "scan", label: "Scan", key: "KeyQ", mode: "tap" },
                { id: "wall", label: "Gloo", key: "KeyG", mode: "tap" },
                {
                    id: "weapon",
                    label: "Swap",
                    mode: "tap",
                    callback(deck) {
                        deck.tapCycle("battlefieldWeapons", ["Digit1", "Digit2"]);
                    }
                },
                { id: "view", label: "View", key: "KeyV", mode: "tap" }
            ]
        }
    };

    const NATIVE_TOUCH_IDS = new Set([
        "flappy-mech",
        "shadow-fighter-duel",
        "stick-hero",
        "skill-parking-simulator"
    ]);

    function getEffectiveProfileId(game) {
        const explicit = String(game?.controlsProfile || "").trim();
        if (explicit) {
            return explicit;
        }

        return String(game?.id || "");
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    class MobileControlDeck {
        constructor(options = {}) {
            this.root = options.root || null;
            this.currentGameId = "";
            this.profile = null;
            this.context = null;
            this.stickStates = new Map();
            this.activeSourcesByCode = new Map();
            this.tapTimeouts = new Set();
            this.cycleIndexes = new Map();
            this.lookRaf = 0;
            this.boundContextMenu = (event) => event.preventDefault();
            if (this.root) {
                this.root.addEventListener("contextmenu", this.boundContextMenu);
            }
        }

        update(context = {}) {
            this.context = context;
            const gameId = String(context.game?.id || "");
            const profileId = getEffectiveProfileId(context.game);
            const profile = TOUCH_PROFILES[profileId] || null;
            const shouldShow = Boolean(
                this.root
                && gameId
                && profile
                && context.coarsePointer
                && context.landscape
                && !context.paused
                && !context.orientationBlocked
                && context.ready
            );

            if (!shouldShow || NATIVE_TOUCH_IDS.has(profileId)) {
                this.hide();
                return;
            }

            if (this.currentGameId !== profileId || this.profile !== profile) {
                this.releaseAll();
                this.currentGameId = profileId;
                this.profile = profile;
                this.renderProfile(profile);
            }

            this.root.classList.add("visible");
            this.root.setAttribute("aria-hidden", "false");
        }

        hide() {
            this.releaseAll();
            if (!this.root) {
                return;
            }

            this.root.classList.remove("visible");
            this.root.setAttribute("aria-hidden", "true");
        }

        destroy() {
            this.hide();
            if (this.root) {
                this.root.removeEventListener("contextmenu", this.boundContextMenu);
            }
        }

        renderProfile(profile) {
            if (!this.root) {
                return;
            }

            const buttonMarkup = (profile.buttons || [])
                .map((button) => `
                    <button
                        type="button"
                        class="touch-deck-button${button.tone ? ` touch-deck-button--${button.tone}` : ""}"
                        data-action-id="${button.id}"
                    >
                        <span>${button.label}</span>
                    </button>
                `)
                .join("");

            this.root.dataset.profile = this.currentGameId;
            this.root.innerHTML = `
                <div class="touch-deck-surface${profile.actionOnly ? " touch-deck-surface--action-only" : ""}">
                    <div class="touch-deck-head">
                        <span class="touch-deck-kicker">Landscape mobile controls</span>
                        <strong>${profile.label}</strong>
                    </div>
                    <div class="touch-deck-layout">
                        ${profile.moveStick ? this.renderStick("move", profile.moveStick.label) : '<div class="touch-stick touch-stick--ghost" aria-hidden="true"></div>'}
                        <div class="touch-deck-actions${profile.actionOnly ? " touch-deck-actions--centered" : ""}">
                            ${buttonMarkup}
                        </div>
                        ${profile.lookStick ? this.renderStick("look", profile.lookStick.label) : '<div class="touch-stick touch-stick--ghost" aria-hidden="true"></div>'}
                    </div>
                </div>
            `;

            this.stickStates.clear();
            this.bindButtons(profile);
            this.bindStick("move", profile.moveStick);
            this.bindStick("look", profile.lookStick);
        }

        renderStick(id, label) {
            return `
                <div class="touch-stick" data-stick-id="${id}">
                    <div class="touch-stick-ring">
                        <div class="touch-stick-thumb"></div>
                    </div>
                    <span class="touch-stick-label">${label}</span>
                </div>
            `;
        }

        bindButtons(profile) {
            this.root.querySelectorAll("[data-action-id]").forEach((node) => {
                const action = profile.buttons.find((entry) => entry.id === node.dataset.actionId);
                if (!action) {
                    return;
                }

                let active = false;
                let activePointerId = null;
                const sourceId = `button:${action.id}`;

                const activate = (event) => {
                    event.preventDefault();
                    this.ensureInteractionReady();
                    activePointerId = event.pointerId;
                    node.setPointerCapture?.(event.pointerId);
                    node.dataset.active = "true";
                    if (action.mode === "hold") {
                        active = true;
                        this.applyActionState(action, sourceId, true);
                        return;
                    }

                    this.triggerTapAction(action);
                };

                const release = (event) => {
                    if (event) {
                        if (activePointerId !== null && event.pointerId !== undefined && event.pointerId !== activePointerId) {
                            return;
                        }
                        event.preventDefault();
                    }

                    activePointerId = null;
                    if (!active) {
                        node.dataset.active = "false";
                        return;
                    }

                    active = false;
                    node.dataset.active = "false";
                    this.applyActionState(action, sourceId, false);
                };

                node.addEventListener("pointerdown", activate);
                node.addEventListener("pointerup", release);
                node.addEventListener("pointercancel", release);
                node.addEventListener("lostpointercapture", release);
            });
        }

        bindStick(stickId, config) {
            if (!config) {
                return;
            }

            const node = this.root.querySelector(`[data-stick-id="${stickId}"]`);
            if (!node) {
                return;
            }

            const ring = node.querySelector(".touch-stick-ring");
            const thumb = node.querySelector(".touch-stick-thumb");
            const state = {
                id: stickId,
                node,
                ring,
                thumb,
                config,
                pointerId: null,
                axisX: 0,
                axisY: 0
            };

            const updateFromPointer = (event) => {
                const rect = (ring || node).getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const radius = Math.max(24, rect.width * 0.32);
                const deltaX = clamp(event.clientX - centerX, -radius, radius);
                const deltaY = clamp(event.clientY - centerY, -radius, radius);
                const axisX = clamp(deltaX / radius, -1, 1);
                const axisY = clamp(deltaY / radius, -1, 1);
                state.axisX = Math.abs(axisX) < 0.12 ? 0 : axisX;
                state.axisY = Math.abs(axisY) < 0.12 ? 0 : axisY;
                thumb.style.transform = `translate(${state.axisX * 18}px, ${state.axisY * 18}px)`;
                node.dataset.active = "true";
                this.syncStickState(state);
            };

            const resetStick = () => {
                state.pointerId = null;
                state.axisX = 0;
                state.axisY = 0;
                node.dataset.active = "false";
                thumb.style.transform = "translate(0, 0)";
                this.syncStickState(state);
            };

            node.addEventListener("pointerdown", (event) => {
                event.preventDefault();
                this.ensureInteractionReady();
                state.pointerId = event.pointerId;
                node.setPointerCapture?.(event.pointerId);
                updateFromPointer(event);
            });

            node.addEventListener("pointermove", (event) => {
                if (state.pointerId !== event.pointerId) {
                    return;
                }

                event.preventDefault();
                updateFromPointer(event);
            });

            const release = (event) => {
                if (state.pointerId !== event.pointerId) {
                    return;
                }

                event.preventDefault();
                resetStick();
            };

            node.addEventListener("pointerup", release);
            node.addEventListener("pointercancel", release);
            node.addEventListener("lostpointercapture", () => {
                if (state.pointerId !== null) {
                    resetStick();
                }
            });

            this.stickStates.set(stickId, state);
        }

        syncStickState(state) {
            const { config, axisX, axisY } = state;
            const sourceBase = `stick:${state.id}`;

            if (config.api === "battlefield-look") {
                this.startLookLoop();
                return;
            }

            const threshold = 0.22;
            this.setCodeFromSource(`${sourceBase}:left`, config.keys?.left, axisX <= -threshold);
            this.setCodeFromSource(`${sourceBase}:right`, config.keys?.right, axisX >= threshold);
            this.setCodeFromSource(`${sourceBase}:up`, config.keys?.up, axisY <= -threshold);
            this.setCodeFromSource(`${sourceBase}:down`, config.keys?.down, axisY >= threshold);
        }

        startLookLoop() {
            if (this.lookRaf) {
                return;
            }

            const step = () => {
                this.lookRaf = 0;
                const lookState = this.stickStates.get("look");
                if (lookState && (Math.abs(lookState.axisX) > 0.02 || Math.abs(lookState.axisY) > 0.02)) {
                    const api = this.getBattlefieldApi();
                    api?.look?.(lookState.axisX, lookState.axisY);
                    this.lookRaf = window.requestAnimationFrame(step);
                }
            };

            this.lookRaf = window.requestAnimationFrame(step);
        }

        triggerTapAction(action) {
            if (typeof action.callback === "function") {
                action.callback(this);
                return;
            }

            if (action.apiAction === "battlefield-aim") {
                const api = this.getBattlefieldApi();
                api?.setAiming?.(true);
                const timeout = window.setTimeout(() => {
                    api?.setAiming?.(false);
                    this.tapTimeouts.delete(timeout);
                }, 90);
                this.tapTimeouts.add(timeout);
                return;
            }

            if (action.key) {
                this.tapKey(action.key);
            }
        }

        applyActionState(action, sourceId, active) {
            if (action.apiAction === "battlefield-aim") {
                const api = this.getBattlefieldApi();
                api?.setAiming?.(active);
                return;
            }

            if (typeof action.callback === "function" && !active) {
                return;
            }

            if (action.key) {
                this.setCodeFromSource(sourceId, action.key, active);
            }
        }

        ensureInteractionReady() {
            const frame = this.getFrame();
            frame?.focus?.();
            const api = this.getBattlefieldApi();
            api?.enable?.();
        }

        tapCycle(key, codes) {
            const currentIndex = Number(this.cycleIndexes.get(key) || 0);
            const code = codes[currentIndex % codes.length];
            this.cycleIndexes.set(key, (currentIndex + 1) % codes.length);
            this.tapKey(code);
        }

        tapKey(code) {
            this.sendKeyEvent(code, "keydown");
            const timeout = window.setTimeout(() => {
                this.sendKeyEvent(code, "keyup");
                this.tapTimeouts.delete(timeout);
            }, 48);
            this.tapTimeouts.add(timeout);
        }

        setCodeFromSource(sourceId, code, active) {
            if (!code) {
                return;
            }

            let sources = this.activeSourcesByCode.get(code);
            if (!sources) {
                sources = new Set();
                this.activeSourcesByCode.set(code, sources);
            }

            if (active) {
                const sizeBefore = sources.size;
                sources.add(sourceId);
                if (sizeBefore === 0) {
                    this.sendKeyEvent(code, "keydown");
                }
                return;
            }

            const hadSource = sources.delete(sourceId);
            if (hadSource && sources.size === 0) {
                this.sendKeyEvent(code, "keyup");
            }
        }

        sendKeyEvent(code, type) {
            const frame = this.getFrame();
            const win = frame?.contentWindow;
            const doc = frame?.contentDocument;
            if (!win || !doc) {
                return;
            }

            const key = CODE_TO_KEY[code] || code.replace(/^Key/, "");
            const eventInit = {
                bubbles: true,
                cancelable: true,
                code,
                key
            };

            try {
                doc.dispatchEvent(new KeyboardEvent(type, eventInit));
            } catch (_) {
                // Ignore synthetic keyboard failures.
            }

            try {
                win.dispatchEvent(new KeyboardEvent(type, eventInit));
            } catch (_) {
                // Ignore synthetic keyboard failures.
            }
        }

        getFrame() {
            return this.context?.sessionController?.currentSession?.frame || null;
        }

        getBattlefieldApi() {
            if (getEffectiveProfileId(this.context?.game) !== "battlefield-codex") {
                return null;
            }

            return this.getFrame()?.contentWindow?.GameHubBattlefieldTouch || null;
        }

        releaseAll() {
            if (this.lookRaf) {
                window.cancelAnimationFrame(this.lookRaf);
                this.lookRaf = 0;
            }

            this.stickStates.forEach((state) => {
                state.axisX = 0;
                state.axisY = 0;
                state.pointerId = null;
                if (state.thumb) {
                    state.thumb.style.transform = "translate(0, 0)";
                }
                if (state.node) {
                    state.node.dataset.active = "false";
                }
                this.syncStickState(state);
            });

            this.tapTimeouts.forEach((timeout) => window.clearTimeout(timeout));
            this.tapTimeouts.clear();

            this.activeSourcesByCode.forEach((_, code) => {
                this.sendKeyEvent(code, "keyup");
            });
            this.activeSourcesByCode.clear();

            const battlefieldApi = this.getBattlefieldApi();
            battlefieldApi?.setAiming?.(false);
        }
    }

    const platform = window.GameHubPlatform || (window.GameHubPlatform = {});
    platform.MobileControlDeck = {
        MobileControlDeck,
        create(options) {
            return new MobileControlDeck(options);
        }
    };
})();
