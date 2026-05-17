(function attachPremiumLogin() {
    "use strict";

    const premium = window.GameHubPremium;
    if (!premium) {
        console.error("GameHubPremium helpers are missing.");
        return;
    }

    document.addEventListener("DOMContentLoaded", () => {
        void init();
    });

    async function init() {
        const params = new URLSearchParams(window.location.search);
        const storedIntent = premium.readAuthIntent() || {};
        const requestedNext = params.get("next") || storedIntent.next || "/premium";
        const gameId = params.get("game") || storedIntent.gameId || "";
        const authClient = await waitForAuthClient();

        const [catalog, session] = await Promise.all([
            premium.loadPremiumCatalog(),
            premium.loadPremiumSession()
        ]);

        const requestedGame = gameId ? premium.getPremiumGameById(catalog, gameId) : null;
        const next = sanitizeNext(requestedNext, requestedGame);
        const model = {
            catalog: Array.isArray(catalog) ? catalog : [],
            session: session || {
                authenticated: false,
                user: null,
                configured: false,
                provider: "firebase",
                mode: "firebase-pending"
            },
            requestedGame,
            next,
            authClient
        };

        if (model.session.authenticated) {
            premium.clearAuthIntent?.();
            premium.navigateWithTransition?.(next);
            return;
        }

        const ui = getUi();
        renderIntent(model, ui);
        syncUi(model, ui);
        bindLoginForm(model, ui);
        premium.primeReveal?.(document.querySelector(".premium-login-layout"));

        if (authClient?.subscribe) {
            authClient.subscribe((nextSession) => {
                model.session = nextSession || model.session;
                renderIntent(model, ui);
                syncUi(model, ui);
            });
        }
    }

    function getUi() {
        return {
            form: document.getElementById("premium-login-form"),
            title: document.getElementById("premium-login-title"),
            copy: document.getElementById("premium-login-copy"),
            badges: document.getElementById("premium-login-badges"),
            detail: document.getElementById("premium-login-intent"),
            contract: document.getElementById("premium-login-contract"),
            feedback: document.getElementById("premium-login-feedback"),
            submit: document.getElementById("premium-login-submit"),
            register: document.getElementById("premium-register-submit"),
            google: document.getElementById("premium-google-submit"),
            logout: document.getElementById("premium-logout-submit")
        };
    }

    async function waitForAuthClient() {
        for (let attempt = 0; attempt < 40; attempt += 1) {
            if (window.GameHubPremiumAuth) {
                return window.GameHubPremiumAuth;
            }
            await new Promise((resolve) => window.setTimeout(resolve, 50));
        }
        return null;
    }

    function sanitizeNext(nextValue, requestedGame) {
        const fallback = requestedGame
            ? `/premium/play?id=${encodeURIComponent(requestedGame.id)}`
            : "/premium";
        const raw = String(nextValue || "").trim();
        if (!raw || raw.startsWith("javascript:")) {
            return fallback;
        }

        try {
            const url = new URL(raw, window.location.origin);
            if (url.origin !== window.location.origin) {
                return fallback;
            }
            if (url.pathname.startsWith("/premium/login")) {
                return fallback;
            }
            return `${url.pathname}${url.search}${url.hash}`;
        } catch (_) {
            return fallback;
        }
    }

    function renderIntent(model, ui) {
        const firebaseTitles = model.catalog.filter((game) => game.accountMode === "firebase-in-game");
        const realtimeTitles = model.catalog.filter((game) => game.runtimeKind === "io");
        const memberName = model.session.user?.displayName || model.session.user?.email || "Account";
        const gatewayState = model.session.authenticated
            ? "Signed in"
            : (model.session.configured ? "Ready" : "Setup needed");

        if (model.requestedGame) {
            document.documentElement.style.setProperty("--premium-accent", model.requestedGame.accent);
            document.documentElement.style.setProperty("--premium-accent-alt", model.requestedGame.accentAlt);
        }

        if (ui.title) {
            ui.title.textContent = model.requestedGame
                ? `Sign in to continue to ${model.requestedGame.name}`
                : "Account access";
        }

        if (ui.copy) {
            if (model.session.authenticated) {
                ui.copy.textContent = `${memberName} is signed in. Supported games can use this account.`;
            } else if (model.requestedGame) {
                ui.copy.textContent = `Sign in to continue to ${model.requestedGame.name}.`;
            } else {
                ui.copy.textContent = "Use your account for supported games and synced progress.";
            }
        }

        if (ui.badges) {
            ui.badges.innerHTML = `
                <article class="premium-login-badge">
                    <span>${premium.icon("key")}</span>
                    <div>
                        <small>Provider</small>
                        <strong>Firebase</strong>
                    </div>
                </article>
                <article class="premium-login-badge">
                    <span>${premium.icon("layers")}</span>
                    <div>
                        <small>Supported games</small>
                        <strong>${firebaseTitles.length} with sync</strong>
                    </div>
                </article>
                <article class="premium-login-badge">
                    <span>${premium.icon("radar")}</span>
                    <div>
                        <small>Realtime games</small>
                        <strong>${realtimeTitles.length} online titles</strong>
                    </div>
                </article>
                <article class="premium-login-badge">
                    <span>${premium.icon(model.session.authenticated ? "check" : "shield")}</span>
                    <div>
                        <small>Status</small>
                        <strong>${premium.escapeHtml(gatewayState)}</strong>
                    </div>
                </article>
            `;
        }

        if (ui.detail) {
            if (model.session.authenticated) {
                ui.detail.textContent = model.requestedGame
                    ? `Signed in as ${memberName}. Continue to ${model.requestedGame.name}.`
                    : `Signed in as ${memberName}.`;
            } else if (model.requestedGame) {
                ui.detail.textContent = "You will return to the selected game after sign-in.";
            } else {
                ui.detail.textContent = "Sign in with email or Google.";
            }
        }

        if (ui.contract) {
            ui.contract.innerHTML = `
                <article class="premium-signal-card premium-contract-card">
                    <span>Provider</span>
                    <strong>Firebase</strong>
                    <p>Email and Google sign-in are available here.</p>
                </article>
                <article class="premium-signal-card premium-contract-card">
                    <span>Status</span>
                    <strong>${premium.escapeHtml(gatewayState)}</strong>
                    <p>${model.session.authenticated ? "Your account is ready." : (model.session.configured ? "Sign-in is available." : (model.session.error || "Firebase credentials are not configured yet."))}</p>
                </article>
                <article class="premium-signal-card premium-contract-card">
                    <span>Library</span>
                    <strong>${model.catalog.length}</strong>
                    <p>Games available in this library.</p>
                </article>
                <article class="premium-signal-card premium-contract-card">
                    <span>Sync support</span>
                    <strong>${firebaseTitles.length}</strong>
                    <p>${firebaseTitles.length ? `${premium.escapeHtml(firebaseTitles.map((game) => game.name).join(" and "))} support saved progress.` : "No games with synced progress are available right now."}</p>
                </article>
            `;
        }

        premium.primeReveal?.(document.querySelector(".premium-login-layout"));
    }

    function syncUi(model, ui) {
        if (!ui.feedback || !ui.submit || !ui.register || !ui.google || !ui.logout) {
            return;
        }

        applyActionAvailability(model, ui);

        if (model.session.authenticated) {
            const memberName = model.session.user?.displayName || model.session.user?.email || "Account";
            setFeedback(ui, "success", "check", `${memberName} is signed in.`);
            return;
        }

        if (model.session.error) {
            setFeedback(ui, "warning", "lock", model.session.error);
            return;
        }

        if (!model.authClient || !model.session.configured) {
            setFeedback(ui, "warning", "lock", "Firebase is not configured yet, so sign-in is unavailable.");
            return;
        }

        setFeedback(ui, "muted", "shield", "Sign in with email or Google to use saved progress in supported games.");
    }

    function applyActionAvailability(model, ui) {
        const hasAuth = Boolean(model.authClient && model.session.configured);
        const authenticated = model.session.authenticated === true;
        const loginText = ui.submit.querySelector("span:last-child");
        const registerText = ui.register.querySelector("span:last-child");
        const googleText = ui.google.querySelector("span:last-child");

        if (loginText) {
            loginText.textContent = authenticated ? "Continue to premium" : "Sign in with email";
        }
        if (registerText) {
            registerText.textContent = authenticated ? "Create another account" : "Create premium account";
        }
        if (googleText) {
            googleText.textContent = authenticated ? "Switch with Google" : "Continue with Google";
        }

        ui.submit.disabled = !authenticated && !hasAuth;
        ui.register.disabled = !hasAuth;
        ui.google.disabled = !hasAuth;
        ui.logout.hidden = !authenticated;
    }

    function bindLoginForm(model, ui) {
        if (!ui.form || !ui.feedback || !ui.submit || !ui.register || !ui.google || !ui.logout) {
            return;
        }

        ui.form.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (model.session.authenticated) {
                redirectAfterAuth(model);
                return;
            }

            const credentials = readCredentials(ui.form);
            await runAuthAction(model, ui, "Signing in...", async () => {
                validateCredentials(credentials);
                await ensureAuthClient(model);
                await model.authClient.signInWithEmail(credentials.email, credentials.password);
                premium.setAuthIntent({
                    next: model.next,
                    gameId: model.requestedGame?.id || "",
                    email: credentials.email
                });
                redirectAfterAuth(model);
            });
        });

        ui.register.addEventListener("click", async () => {
            const credentials = readCredentials(ui.form);
            await runAuthAction(model, ui, "Creating account...", async () => {
                validateCredentials(credentials);
                await ensureAuthClient(model);
                await model.authClient.registerWithEmail(credentials.email, credentials.password);
                premium.setAuthIntent({
                    next: model.next,
                    gameId: model.requestedGame?.id || "",
                    email: credentials.email
                });
                redirectAfterAuth(model);
            });
        });

        ui.google.addEventListener("click", async () => {
            await runAuthAction(model, ui, "Opening Google sign-in...", async () => {
                await ensureAuthClient(model);
                await model.authClient.signInWithGoogle();
                premium.setAuthIntent({
                    next: model.next,
                    gameId: model.requestedGame?.id || ""
                });
                redirectAfterAuth(model);
            });
        });

        ui.logout.addEventListener("click", async () => {
            await runAuthAction(model, ui, "Signing out...", async () => {
                await ensureAuthClient(model);
                await model.authClient.signOutUser();
                premium.clearAuthIntent?.();
                setFeedback(ui, "muted", "shield", "Signed out. You can sign in again at any time.");
            });
        });
    }

    function readCredentials(form) {
        const formData = new FormData(form);
        return {
            email: String(formData.get("email") || "").trim(),
            password: String(formData.get("password") || "")
        };
    }

    function validateCredentials(credentials) {
        if (!credentials.email) {
            throw new Error("Enter the premium email address first.");
        }
        if (!credentials.password) {
            throw new Error("Enter the premium password first.");
        }
    }

    async function ensureAuthClient(model) {
        if (!model.authClient) {
            model.authClient = await waitForAuthClient();
        }
        if (!model.authClient) {
            throw new Error("The premium Firebase client did not finish loading.");
        }
    }

    async function runAuthAction(model, ui, pendingMessage, action) {
        setBusy(ui, true);
        setFeedback(ui, "pending", "bolt", pendingMessage);

        try {
            await action();
        } catch (error) {
            setFeedback(ui, "warning", "lock", error?.message || "Premium Firebase sign-in failed.");
        } finally {
            setBusy(ui, false);
            applyActionAvailability(model, ui);
        }
    }

    function setBusy(ui, busy) {
        [ui.submit, ui.register, ui.google, ui.logout].forEach((button) => {
            if (button && !button.hidden) {
                button.disabled = busy;
            }
        });

        ui.form.querySelectorAll("input").forEach((input) => {
            input.disabled = busy;
        });
    }

    function setFeedback(ui, tone, iconName, message) {
        if (!ui.feedback) {
            return;
        }

        ui.feedback.className = `premium-feedback premium-feedback--${tone}`;
        ui.feedback.innerHTML = `${premium.icon(iconName)} <span>${premium.escapeHtml(message)}</span>`;
    }

    function redirectAfterAuth(model) {
        premium.clearAuthIntent?.();
        premium.navigateWithTransition?.(model.next || "/premium");
    }
})();
